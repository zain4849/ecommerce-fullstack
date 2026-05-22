import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { getProductSearchSuggestions as fetchSuggestions } from "./productSearch.service.js";
import { applyProductQueryString } from "./productTextSearch.js";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};
    if (req.query.featured === "true") where.featured = true;
    if (req.query.category) where.category = String(req.query.category);
    if (req.query.brand) where.brand = String(req.query.brand);
    if (req.query.inStock === "true") where.inStock = true;
    if (req.query.inStock === "false") where.inStock = false;
    if (req.query.minPrice || req.query.maxPrice) {
      where.price = {};
      if (req.query.minPrice) where.price.gte = new Prisma.Decimal(Number(req.query.minPrice));
      if (req.query.maxPrice) where.price.lte = new Prisma.Decimal(Number(req.query.maxPrice));
    }
    if (req.query.minRating) where.rating = { gte: Number(req.query.minRating) };
    if (req.query.q) applyProductQueryString(where, String(req.query.q));

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      req.query.sort === "price-low"
        ? { price: "asc" }
        : req.query.sort === "price-high"
          ? { price: "desc" }
          : req.query.sort === "rating"
            ? { rating: "desc" }
            : { createdAt: "desc" };

    const [products, total, brandRows, categoryRows] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip, take: limit }),
      prisma.product.count({ where }),
      prisma.product.findMany({ where: { brand: { not: "" } }, select: { brand: true }, distinct: ["brand"] }),
      prisma.product.findMany({ where: { category: { not: "" } }, select: { category: true }, distinct: ["category"] }),
    ]);

    return res.json({
      products,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      brands: brandRows.map((row) => row.brand).filter(Boolean),
      categories: categoryRows.map((row) => row.category).filter(Boolean),
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const getProductSearchSuggestions = async (req: Request, res: Response) => {
  try {
    const raw = String(req.query.q ?? "");
    const limit = Math.min(15, Math.max(1, Number(req.query.limit) || 8));
    const q = raw.trim();
    if (!q) {
      return res.json({ query: "", suggestions: [] });
    }
    const suggestions = await fetchSuggestions(raw, limit);
    return res.json({ query: q, suggestions });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: String(req.params.id) } });
    if (!product) return res.status(404).json({ error: "Product Not Found" });
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.create({
      data: {
        ...req.body,
        price: new Prisma.Decimal(req.body.price),
      },
    });
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.update({
      where: { id: String(req.params.id) },
      data: req.body.price ? { ...req.body, price: new Prisma.Decimal(req.body.price) } : req.body,
    });
    return res.json(product);
  } catch (error) {
    return res.status(404).json({ error: "Product Not Found" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({ where: { id: String(req.params.id) } });
    return res.json({ message: "Product Deleted successfully" });
  } catch {
    return res.status(404).json({ error: "Product Not Found" });
  }
};
