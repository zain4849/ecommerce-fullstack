import Product from "../models/Product.js";
import stripe from "../config/stripe.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";



// Webhook to update payment status (Stripe calls this)
const handleStripeWebhook = async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        // req.body is the raw Buffer because express.raw was used
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification falied:", err.message)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      const session = await Order.db.startSession()
      session.startTransaction()
      try {
        const order = await Order.findOneAndUpdate(
          {paymentIntentId: paymentIntent.id},
          {paymentStatus: 'paid'},
          {new: true, session}
        ).populate('items.productId')

        if (order) {
          for (const item of order.items) {
            const prod = await Product.findById(item.productId._id).session(session)
            if (!prod) continue
            prod.stock = Math.max(0, prod.stock - item.quantity)
            if (prod.stock <= 0) prod.inStock = false
            console.log('backend success stripe reached')
            await prod.save({session})
          }
          // clear user's cart handled by frontend webhook payment success
          // await Cart.findOneAndDelete({userId: order.userId}, {session})
        }
        await session.commitTransaction()
      } catch (err) {
        await session.abortTransaction()
        console.error("Error updating stock/order after payment:", err)
      } finally {
        session.endSession()
      }

      // Find the user and clear their cart ONLY after payment succeeds
      const userId = paymentIntent.metadata.userId; // Get the ID you stored earlier
      await Cart.findOneAndDelete({ userId: userId });
    }

    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      await Order.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        { paymentStatus: "failed" }
      );
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(400).json({ error: `Webhook error: ${err.message}` });
  }
};

export default handleStripeWebhook