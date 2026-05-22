"use client";

import api from "@/lib/api";
import Order, { OrderStatus, PaymentStatus } from "@/types/order";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import React from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const statusColor: Record<OrderStatus, string> = {
  PROCESSING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  SHIPPED: "bg-blue-100 text-blue-800 border-blue-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

const paymentColor: Record<PaymentStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PAID: "bg-green-100 text-green-800 border-green-200",
  FAILED: "bg-red-100 text-red-800 border-red-200",
};

const statusLabel: Record<OrderStatus, string> = {
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const paymentLabel: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
};

const Pill = ({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) => (
  <span
    className={`px-2.5 py-1 rounded-full text-[0.7rem] font-semibold border inline-block ${className}`}
  >
    {children}
  </span>
);

const OrdersPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["orders", "mine"],
    queryFn: async () => {
      const res = await api.get("/orders");
      return res.data;
    },
    enabled: Boolean(user),
  });

  if (!user)
    return (
      <div className="container mx-auto px-4">
        <div className="my-16 max-w-md mx-auto text-center bg-card rounded-3xl border border-border/60 p-10">
          <div className="size-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-5">
            <Package className="size-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Sign in to view orders</h2>
          <p className="text-muted-foreground mb-6">
            Please log in to see your orders and track their status.
          </p>
          <Link href="/auth/login">
            <Button className="w-full">Log In</Button>
          </Link>
        </div>
      </div>
    );

  if (!isLoading && orders.length === 0)
    return (
      <div className="container mx-auto px-4">
        <div className="my-16 max-w-md mx-auto text-center bg-card rounded-3xl border border-border/60 p-10">
          <div className="size-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-5">
            <ShoppingBag className="size-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">
            Once you place an order, it&apos;ll show up here.
          </p>
          <Link href="/products">
            <Button className="w-full">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 min-h-[60vh]">
      <p className="text-xs text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground font-medium">My Orders</span>
      </p>
      <div className="flex items-end justify-between gap-3 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black">My Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {orders.length} order{orders.length !== 1 ? "s" : ""} placed
          </p>
        </div>
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block bg-card rounded-2xl border border-border/60 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="text-xs uppercase tracking-wider">
                Order ID
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider">Date</TableHead>
              <TableHead className="text-xs uppercase tracking-wider">Items</TableHead>
              <TableHead className="text-xs uppercase tracking-wider">Total</TableHead>
              <TableHead className="text-xs uppercase tracking-wider">Payment</TableHead>
              <TableHead className="text-xs uppercase tracking-wider">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/40">
                <TableCell className="font-mono text-xs">
                  #{order.id.slice(-8)}
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-sm">
                  {order.items.length} item{order.items.length !== 1 && "s"}
                </TableCell>
                <TableCell className="font-bold">
                  AED {Number(order.totalAmount).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Pill className={paymentColor[order.paymentStatus] ?? ""}>
                    {paymentLabel[order.paymentStatus]}
                  </Pill>
                </TableCell>
                <TableCell>
                  <Pill className={statusColor[order.status] ?? ""}>
                    {statusLabel[order.status]}
                  </Pill>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: cards */}
      <div className="md:hidden space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-card rounded-2xl border border-border/60 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-mono text-xs text-muted-foreground">
                  #{order.id.slice(-8)}
                </p>
                <p className="text-sm font-medium">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span className="font-black text-lg">
                AED {Number(order.totalAmount).toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {order.items.length} item{order.items.length !== 1 && "s"}
            </p>
            <div className="flex flex-wrap gap-2">
              <Pill className={paymentColor[order.paymentStatus] ?? ""}>
                {paymentLabel[order.paymentStatus]}
              </Pill>
              <Pill className={statusColor[order.status] ?? ""}>
                {statusLabel[order.status]}
              </Pill>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
