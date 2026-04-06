"use client";

import { useEffect, useState } from "react";

interface DashboardData {
  stats: {
    totalRevenue: number;
    revenueToday: number;
    totalOrders: number;
    ordersToday: number;
    paidOrders: number;
    pendingOrders: number;
    totalCustomers: number;
    totalPrompts: number;
    totalPurchases: number;
    ordersThisWeek: number;
    ordersThisMonth: number;
  };
  recentOrders: {
    id: string;
    customer: string;
    amount: number;
    status: string;
    method: string;
    date: string;
  }[];
  topPrompts: {
    id: string;
    title: string;
    sold: number;
    revenue: number;
  }[];
}

function fmt(n: number) {
  return new Intl.NumberFormat("vi-VN").format(n);
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((json) => {
        if (json.error) setError(json.error);
        else setData(json);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="ui-card p-8 text-center">
        <p className="text-red-600">Lỗi tải dữ liệu: {error}</p>
      </div>
    );
  }

  if (!data) return null;

  const s = data.stats;
  const statCards = [
    { label: "Tổng doanh thu", value: `${fmt(s.totalRevenue)}₫`, sub: `Hôm nay: ${fmt(s.revenueToday)}₫ · Đã TT: ${s.paidOrders} đơn`, color: "text-green-600", bg: "bg-green-50" },
    { label: "Đơn hàng", value: String(s.totalOrders), sub: `Hôm nay: ${s.ordersToday} · Chờ xử lý: ${s.pendingOrders}`, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Khách hàng", value: String(s.totalCustomers), sub: `Lượt mua prompt: ${s.totalPurchases}`, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Tổng prompt", value: String(s.totalPrompts), sub: `Tuần: ${s.ordersThisWeek} đơn · Tháng: ${s.ordersThisMonth} đơn`, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Tổng quan hoạt động kinh doanh</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="ui-card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className={`text-xs mt-1 ${stat.color}`}>{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="ui-card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Đơn hàng gần đây</h2>
          {data.recentOrders.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">Chưa có đơn hàng nào</p>
          ) : (
            <div className="space-y-3">
              {data.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <span className="text-sm font-medium text-slate-900">{order.customer}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400">#{String(order.id).slice(0, 8)}</span>
                      <span className="text-xs text-slate-400">{order.method}</span>
                      <span className="text-xs text-slate-400">{fmtDate(order.date)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-900">{fmt(order.amount)}₫</span>
                    <div className="mt-0.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        order.status === "paid" ? "bg-green-100 text-green-700" :
                        order.status === "pending" || order.status === "awaiting_review" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {order.status === "paid" ? "Đã TT" : order.status === "pending" ? "Chờ TT" : order.status === "awaiting_review" ? "Chờ duyệt" : "Thất bại"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Prompts */}
        <div className="ui-card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Prompt bán chạy nhất</h2>
          {data.topPrompts.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">Chưa có dữ liệu bán hàng</p>
          ) : (
            <div className="space-y-3">
              {data.topPrompts.map((prompt, idx) => (
                <div key={prompt.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    idx === 0 ? "bg-yellow-100 text-yellow-700" :
                    idx === 1 ? "bg-slate-100 text-slate-600" :
                    idx === 2 ? "bg-orange-100 text-orange-700" :
                    "bg-slate-50 text-slate-400"
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-slate-900 truncate block">{prompt.title}</span>
                    <span className="text-xs text-slate-400">{prompt.sold} lượt bán</span>
                  </div>
                  <span className="text-sm font-semibold text-brand-700">{fmt(prompt.revenue)}₫</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
