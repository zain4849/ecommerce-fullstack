"use client";

import api from "@/lib/api";
import Order from "@/types/order";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusColor: Record<string, string> = {
  processing: "bg-yellow-100 text-yellow-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const paymentColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

const OrdersPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      api
        .get("/orders")
        .then((res) => setOrders(res.data))
        .catch((err) => console.log(err));
    }
  }, [user]);

  if (!user)
    return (
      <p className="text-center mt-10">Please Login to view your Orders.</p>
    );
  if (orders.length === 0)
    return <p className="text-center mt-10">No orders yet.</p>;

  return (
    <div className="container mx-auto p-6 min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-6">My Orders ({orders.length})</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell className="font-mono text-sm">
                {order._id.slice(-8)}
              </TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {order.items.length} item{order.items.length !== 1 && "s"}
              </TableCell>
              <TableCell className="font-semibold">
                AED {order.totalAmount.toFixed(2)}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${paymentColor[order.paymentStatus] ?? ""}`}
                >
                  {order.paymentStatus}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[order.status] ?? ""}`}
                >
                  {order.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersPage;
