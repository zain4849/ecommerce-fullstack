"use client";

import ProductCarousel from "../../../components/layout/product/ProductCarousel";
import { useFeaturedProducts } from "../hooks/useFeaturedProducts";

export function FeaturedProductsContainer() {
  const { products, isLoading, error } = useFeaturedProducts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load products</div>;

  return <ProductCarousel products={products} />;
}
