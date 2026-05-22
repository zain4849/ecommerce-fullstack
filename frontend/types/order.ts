import { Product } from "./product";

export interface OrderItem {
  id?: string;
  productId: string;
  product?: Product | null;
  quantity: number;
  priceAtPurchase?: number | string;
}

export type OrderStatus = "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export default interface Order {
  id: string;
  userId?: string;
  user?: { id: string; name: string; email: string } | null;
  totalAmount: number | string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentIntentId?: string;
  items: OrderItem[];
  createdAt: string;
}