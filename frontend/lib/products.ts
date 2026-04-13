import api from "./api";
import { Product } from "@/types/product";

export interface ProductsResponse {
  products: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  brands: string[];
  categories: string[];
}

export interface ProductFilters {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean | null;
  sort?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}

export async function fetchProducts(
  filters: ProductFilters = {},
): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.minPrice !== undefined)
    params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined)
    params.set("maxPrice", String(filters.maxPrice));
  if (filters.minRating !== undefined)
    params.set("minRating", String(filters.minRating));
  if (filters.inStock === true) params.set("inStock", "true");
  else if (filters.inStock === false) params.set("inStock", "false");
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.featured) params.set("featured", "true");
  const res = await api.get(`/products?${params.toString()}`);
  return res.data;
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const res = await fetchProducts({ featured: true, limit: 10 });
  return res.products;
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await api.get(`/products/${id}`);
  return res.data;
}
