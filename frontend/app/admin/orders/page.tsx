"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

interface AdminOrder {
  _id: string;
  userId: { _id: string; name: string; email: string } | null;
  items: {
    productId: { name: string; price: number } | null;
    quantity: number;
  }[];
  totalAmount: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  processing: "bg-yellow-100 text-yellow-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const paymentColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/admin/all")
      .then((res) => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await api.patch(`/orders/admin/${orderId}/status`, {
        status,
      });
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: res.data.status } : o,
        ),
      );
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update status");
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
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono">
                    {order._id.slice(-8)}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">
                        {order.userId?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.userId?.email || ""}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {order.items.length} item{order.items.length !== 1 && "s"}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    AED {order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        paymentColors[order.paymentStatus] || "bg-gray-100"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        statusColors[order.status] || "bg-gray-100"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
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
