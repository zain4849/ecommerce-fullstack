export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  category?: string;
  brand?: string;
  images?: string[];
  inStock?: boolean;
  featured?: boolean;
  rating?: number;
  numReviews?: number;
}
