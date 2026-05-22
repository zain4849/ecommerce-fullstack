"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Order, { OrderStatus, PaymentStatus } from "@/types/order";

type AdminOrder = Order;

const statusColors: Record<OrderStatus, string> = {
  PROCESSING: "bg-yellow-100 text-yellow-800",
  SHIPPED: "bg-blue-100 text-blue-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const paymentColors: Record<PaymentStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
};

const statusLabels: Record<OrderStatus, string> = {
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const paymentLabels: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
};

function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response?: { data?: unknown } }).response?.data &&
    typeof (error as { response?: { data?: { error?: unknown } } }).response?.data?.error ===
      "string"
  ) {
    return (error as { response: { data: { error: string } } }).response.data.error;
  }
  return fallback;
}

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/admin/all")
      .then((res) => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await api.patch(`/orders/admin/${orderId}/status`, {
        status,
      });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: res.data.status } : o)));
    } catch (err: unknown) {
      alert(getErrorMessage(err, "Failed to update status"));
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg">
          <p className="text-gray-500">No orders yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Items</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Payment</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono">{order.id.slice(-8)}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{order.user?.name || "Unknown"}</p>
                      <p className="text-xs text-gray-500">{order.user?.email || ""}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {order.items.length} item{order.items.length !== 1 && "s"}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">AED {Number(order.totalAmount).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        paymentColors[order.paymentStatus] || "bg-gray-100"
                      }`}
                    >
                      {paymentLabels[order.paymentStatus]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        statusColors[order.status] || "bg-gray-100"
                      }`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
