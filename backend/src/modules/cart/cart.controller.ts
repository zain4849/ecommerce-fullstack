import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

const includeCart = {
  items: { include: { product: true } },
};

const fetchCart = async (userId: string) =>
  prisma.cart.findUnique({
    where: { userId },
    include: includeCart,
  });

export const getCart = async (req: Request, res: Response) => {
  try {
    const cart = await fetchCart(req.user!.id);
    if (!cart) return res.json({ items: [] });
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: "Product Not Found" });
    if (!product.inStock || product.stock <= 0) {
      return res.status(400).json({ error: "Product is out of stock" });
    }

    const cart = await prisma.cart.upsert({
      where: { userId: req.user!.id },
      create: { userId: req.user!.id },
      update: {},
    });

    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      create: { cartId: cart.id, productId, quantity },
      update: { quantity: { increment: quantity } },
    });

    return res.json(await fetchCart(req.user!.id));
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const productId = String(req.params.productId);
    const cart = await prisma.cart.findUnique({ where: { userId: req.user!.id } });
    if (!cart) return res.status(404).json({ error: "Cart Not Found" });
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
    return res.json(await fetchCart(req.user!.id));
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const productId = String(req.params.productId);
    const cart = await prisma.cart.findUnique({ where: { userId: req.user!.id } });
    if (!cart) return res.status(404).json({ error: "Cart Not Found" });
    const item = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });
    if (!item) return res.status(404).json({ error: "Item not in cart" });

    const nextQuantity = item.quantity + req.body.delta;
    if (nextQuantity <= 0) {
      await prisma.cartItem.delete({ where: { id: item.id } });
    } else {
      await prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity: nextQuantity },
      });
    }
    return res.json(await fetchCart(req.user!.id));
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.user!.id } });
    if (!cart) return res.json({ items: [] });
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return res.json(await fetchCart(req.user!.id));
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};
