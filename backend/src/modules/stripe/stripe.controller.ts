import type { Request, Response } from "express";
import { PaymentStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import stripe from "../../lib/stripe.js";
import { logger } from "../../lib/logger.js";

const handleStripeWebhook = async (req: Request, res: Response) => {
  try {
    if (!stripe) return res.status(500).json({ error: "Stripe is not configured" });
    const sig = req.headers["stripe-signature"];
    if (!sig) return res.status(400).json({ error: "Missing Stripe signature" });

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
    } catch (error) {
      return res.status(400).send(`Webhook Error: ${(error as Error).message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.update({
          where: { paymentIntentId: paymentIntent.id },
          data: { paymentStatus: PaymentStatus.PAID },
          include: { items: true },
        });

        for (const item of order.items) {
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          if (!product) continue;
          const nextStock = Math.max(0, product.stock - item.quantity);
          await tx.product.update({
            where: { id: product.id },
            data: { stock: nextStock, inStock: nextStock > 0 },
          });
        }

        await tx.cart.deleteMany({ where: { userId: order.userId } });
      });
    }

    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      await prisma.order.update({
        where: { paymentIntentId: paymentIntent.id },
        data: { paymentStatus: PaymentStatus.FAILED },
      });
    }

    return res.json({ received: true });
  } catch (error) {
    logger.error({ error }, "Stripe webhook processing failed");
    return res.status(400).json({ error: `Webhook error: ${(error as Error).message}` });
  }
};

export default handleStripeWebhook;
