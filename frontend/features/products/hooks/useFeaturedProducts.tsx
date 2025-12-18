import { useEffect, useState } from "react";
import { fetchFeaturedProducts } from "@/lib/products";
import { Product } from "../../../types/product";

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts()
      .then(setProducts) // implicitly setProducts(res)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return { products, isLoading, error };
}
