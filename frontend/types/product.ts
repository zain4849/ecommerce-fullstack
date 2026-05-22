export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  stock?: number;
  category?: string;
  brand?: string;
  images?: string[];
  inStock?: boolean;
  featured?: boolean;
  rating?: number;
  numReviews?: number;
}

export function getProductId(product: Product): string {
  return product.id;
}
