import type { Prisma } from "@prisma/client";

/** Shared text filter for product search (used by list + autocomplete). Swap impl only if ES query semantics diverge. */
export function applyProductQueryString(where: Prisma.ProductWhereInput, rawQuery: string): void {
  const q = rawQuery.trim();
  if (!q) return;
  where.OR = [
    { name: { contains: q, mode: "insensitive" } },
    { description: { contains: q, mode: "insensitive" } },
    { brand: { contains: q, mode: "insensitive" } },
  ];
}
