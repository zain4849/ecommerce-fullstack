import type { Request, Response } from "express";
import { Prisma, PaymentStatus, OrderStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import stripe from "../../lib/stripe.js";

const orderInclude = {
  items: { include: { product: true } },
  user: { select: { id: true, name: true, email: true } },
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    if (!stripe) return res.status(500).json({ error: "Stripe is not configured" });
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.id },
      include: { items: { include: { product: true } } },
    });
    if (!cart || cart.items.length === 0) return res.status(400).json({ error: "Cart is empty" });

    for (const item of cart.items) {
      if (!item.product.inStock || item.product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for "${item.product.name}". Available: ${item.product.stock}, Requested: ${item.quantity}`,
        });
      }
    }

    const totalAmount = cart.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "aed",
      metadata: { userId: req.user!.id },
    });

    const order = await prisma.order.create({
      data: {
        userId: req.user!.id,
        totalAmount: new Prisma.Decimal(totalAmount),
        paymentStatus: PaymentStatus.PENDING,
        paymentIntentId: paymentIntent.id,
        status: OrderStatus.PROCESSING,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.product.price,
          })),
        },
      },
      include: orderInclude,
    });

    return res.status(201).json({
      order,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: orderInclude,
      orderBy: { createdAt: "desc" },
    });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}; 

export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: orderInclude,
      orderBy: { createdAt: "desc" },
    });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.update({
      where: { id: String(req.params.id) },
      data: { status: req.body.status },
      include: orderInclude,
    });
    return res.json(order);
  } catch {
    return res.status(404).json({ error: "Order not found" });
  }
};

export const getAnalytics = async (_req: Request, res: Response) => {
  try {
    const [totalOrders, totalProducts, outOfStock, paidOrdersCount, paidRevenue] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.product.count({ where: { inStock: false } }),
      prisma.order.count({ where: { paymentStatus: PaymentStatus.PAID } }),
      prisma.order.aggregate({
        where: { paymentStatus: PaymentStatus.PAID },
        _sum: { totalAmount: true },
      }),
    ]);

    const topProductRows = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
      where: { order: { paymentStatus: PaymentStatus.PAID } },
    });

    const topProducts = await Promise.all(
      topProductRows.map(async (row) => {
        const product = await prisma.product.findUnique({ where: { id: row.productId } });
        if (!product) return null;
        return {
          name: product.name,
          sold: row._sum.quantity ?? 0,
          revenue: Number(product.price) * (row._sum.quantity ?? 0),
        };
      }),
    );

    const revenueByMonth = await prisma.$queryRaw<Array<{ month: string; revenue: Prisma.Decimal; count: bigint }>>`
      SELECT to_char(date_trunc('month', "createdAt"), 'YYYY-MM') AS month,
             SUM("totalAmount") AS revenue,
             COUNT(*) AS count
      FROM "Order"
      WHERE "paymentStatus" = 'PAID'
        AND "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY date_trunc('month', "createdAt")
      ORDER BY date_trunc('month', "createdAt")
    `;

    return res.json({
      totalOrders,
      totalRevenue: Number(paidRevenue._sum.totalAmount ?? 0),
      totalProducts,
      outOfStock,
      paidOrders: paidOrdersCount,
      topProducts: topProducts.filter(Boolean),
      revenueByMonth: revenueByMonth.map((row) => ({
        _id: row.month,
        revenue: Number(row.revenue),
        count: Number(row.count),
      })),
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};
