"use client";

import api from "@/lib/api";
import AdminDashboardClient from "./AdminDashboardClient";
import { useQuery } from "@tanstack/react-query";

interface Analytics {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  outOfStock: number;
  paidOrders: number;
  topProducts: { name: string; sold: number; revenue: number }[];
  revenueByMonth: { _id: string; revenue: number; count: number }[];
}

export default function AdminDashboardData() {
  const { data: analytics, isLoading: loading } = useQuery<Analytics>({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      const res = await api.get("/orders/admin/analytics");
      return res.data;  
    },
  });

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

  if (!analytics) {
    return <p className="text-red-500">Failed to load analytics</p>;
  }

  return <AdminDashboardClient analytics={analytics} />;
}
