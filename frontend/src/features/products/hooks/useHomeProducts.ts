"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/products";

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => fetchProducts({ featured: true, limit: 10 }),
  });
}

export function useTrendingProducts() {
  return useQuery({
    queryKey: ["products", "trending"],
    queryFn: () => fetchProducts({ limit: 6 }),
  });
}
