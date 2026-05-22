import "server-only";

import { Product } from "@/types/product";
import { ProductFilters, ProductsResponse } from "./products";
import { serverApiGet } from "./server-api";

export async function fetchProductsServer(
  filters: ProductFilters = {},
  init: RequestInit = {},
): Promise<ProductsResponse> {
  return serverApiGet<ProductsResponse>("/products", {
    query: {
      q: filters.q,
      category: filters.category,
      brand: filters.brand,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minRating: filters.minRating,
      inStock:
        filters.inStock === null || filters.inStock === undefined ? undefined : filters.inStock,
      sort: filters.sort,
      page: filters.page,
      limit: filters.limit,
      featured: filters.featured,
    },
    ...init,
  });
}

export async function fetchProductByIdServer(
  id: string,
  init: RequestInit = {},
): Promise<Product> {
  return serverApiGet<Product>(`/products/${id}`, init);
}
