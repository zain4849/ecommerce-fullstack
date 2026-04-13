"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { DollarSign, Package, ShoppingCart, AlertTriangle } from "lucide-react";

interface Analytics {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  outOfStock: number;
  paidOrders: number;
  topProducts: { name: string; sold: number; revenue: number }[];
  revenueByMonth: { _id: string; revenue: number; count: number }[];
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/admin/analytics")
      .then((res) => setAnalytics(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics)
    return <p className="text-red-500">Failed to load analytics</p>;

  const stats = [
    {
      label: "Total Revenue",
      value: `AED ${analytics.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Total Orders",
      value: analytics.totalOrders,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Products",
      value: analytics.totalProducts,
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Out of Stock",
      value: analytics.outOfStock,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">{stat.label}</span>
                <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
          {analytics.topProducts.length === 0 ? (
            <p className="text-gray-500 text-sm">No sales data yet</p>
          ) : (
            <div className="space-y-4">
              {analytics.topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">
                        {product.sold} sold
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-sm">
                    AED{" "}
                    {product.revenue.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Revenue by Month */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
          {analytics.revenueByMonth.length === 0 ? (
            <p className="text-gray-500 text-sm">No monthly data yet</p>
          ) : (
            <div className="space-y-3">
              {analytics.revenueByMonth.map((month) => {
                const maxRevenue = Math.max(
                  ...analytics.revenueByMonth.map((m) => m.revenue),
                );
                const width =
                  maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={month._id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{month._id}</span>
                      <span className="font-medium">
                        AED{" "}
                        {month.revenue.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        ({month.count} orders)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full transition-all"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
