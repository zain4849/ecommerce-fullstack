import { Product } from "./product";

export interface OrderItem {
  productId: Product;
  quantity: number;
}

export default interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentIntentId?: string;
  items: OrderItem[];
  createdAt: string;
}