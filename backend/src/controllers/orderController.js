import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import stripe from "../config/stripe.js";

// Create order (checkout from cart)
export const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce(
      (acc, item) => acc + item.productId.price * item.quantity,
      0
    );

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // cents
      currency: "aed",
      metadata: { userId: req.user.id.toString() },
    });

    // Create Order
    const order = await Order.create({
      userId: req.user.id,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
      totalAmount,
      paymentIntentId: paymentIntent.id,
      paymentStatus: "pending",
    });

    // Optionally clear cart after creating order
    // cart.items = [];
    // await cart.save();

    res.status(201).json({
      order,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get logged-in user's orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate(
      "items.productId"
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

