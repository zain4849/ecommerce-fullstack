/**
 * Product search / autocomplete backend.
 * Replace the body of `getProductSearchSuggestions` with an Elasticsearch (or other) client later;
 * keep exporting the same DTO shape from `productSearch.types.ts`.
 */
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import type { ProductSearchSuggestionDTO } from "./productSearch.types.js";
import { applyProductQueryString } from "./productTextSearch.js";

function mapRow(row: {
  id: string;
  name: string;
  brand: string | null;
  category: string | null;
  images: string[];
  price: Prisma.Decimal;
}): ProductSearchSuggestionDTO {
  const parts = [row.brand, row.category].filter(Boolean);
  return {
    id: row.id,
    title: row.name,
    subtitle: parts.length ? parts.join(" · ") : null,
    imageUrl: row.images[0] ?? null,
    price: row.price.toFixed(2),
  };
}

export async function getProductSearchSuggestions(
  rawQuery: string,
  limit: number,
): Promise<ProductSearchSuggestionDTO[]> {
  const q = rawQuery.trim();
  if (!q) return [];

  const where: Prisma.ProductWhereInput = {};
  applyProductQueryString(where, q);

  const rows = await prisma.product.findMany({
    where,
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      brand: true,
      category: true,
      images: true,
      price: true,
    },
  });

  return rows.map(mapRow);
}
