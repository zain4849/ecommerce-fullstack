// Express automatically calls cart.toJSON() (or cart.toObject() internally).

import { isValidObjectId } from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

/* 
PROCESS FOR ALL CONTROLLERS

Database → Mongoose Document
Cart.findOne() returns a Mongoose document (special object with methods).

Mongoose Document → Plain JS Object
When you call res.json(cart), Express automatically calls cart.toJSON() (or cart.toObject() internally).

Plain JS Object → JSON String
*/

export const getCart = async (req, res) => {
  // req.user gets added in authMiddleware.js
  // “Find the cart that belongs to the currently logged-in user.”
  try {
    //
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId"
    ); // The .populate() method is what uses that ref: "Product" info to automatically fetch the full product details from the Product collection.
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!isValidObjectId(productId)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    console.log("Product model _id type:", Product.schema.path("_id").instance);
    // Find if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ err: "Product Not Found" });
    // Find if cart exists
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        items: [
          {
            productId,
            quantity,
          },
        ],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (itemIndex > -1) cart.items[itemIndex].quantity += quantity;
      else cart.items.push({ productId, quantity });
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ error: "Cart Not Found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { items: [] },
      { new: true }
    );
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
