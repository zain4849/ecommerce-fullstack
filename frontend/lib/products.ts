import api from "./api";
import { Product } from "@/types/product";

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const res = await api.get("/products/featured");
  return res.data;
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await api.get(`/products/${id}`);
  return res.data;
}
