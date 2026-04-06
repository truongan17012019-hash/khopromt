"use client";

import { useEffect, useMemo, useState } from "react";

type Order = {
  id: string;
  user_id: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
  order_items?: any[];
  review?: { reviewer?: string; action?: string; created_at?: string } | null;
};

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders?userId=admin");
      const json = await res.json();
      if (res.ok) setOrders(json?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered = useMemo(
    () =>
      statusFilter === "all"
        ? orders
        : orders.filter((o) => o.payment_status === statusFilter),
    [orders, statusFilter]
  );

  const totalRevenue = orders
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Quản lý Đơn hàng</h1>
          <p className="text-slate-500 text-sm mt-1">
            {orders.length} đơn hàng | Doanh thu: {new Intl.NumberFormat("vi-VN").format(totalRevenue)}₫
          </p>
        </div>
        <div className="flex gap-2">
          {["all", "awaiting_review", "paid", "pending", "failed"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                statusFilter === s ? "bg-brand-600 text-white" : "ui-btn-ghost text-slate-600"
              }`}
            >
              {s === "all" ? "Tất cả" : s === "awaiting_review" ? "Chờ duyệt CK" : s === "paid" ? "Đã TT" : s === "pending" ? "Chờ TT" : "Thất bại"}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="p-6 text-sm text-slate-500">Đang tải đơn hàng...</div>
      ) : (
      <div className="ui-table-wrap">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="ui-th">Mã ĐH</th>
              <th className="ui-th">Khách hàng</th>
              <th className="ui-th">Số SP</th>
              <th className="ui-th">Tổng tiền</th>
              <th className="ui-th">Thanh toán</th>
              <th className="ui-th">Trạng thái</th>
              <th className="ui-th">Ngày</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="ui-td font-mono text-brand-600">{order.id}</td>
                <td className="ui-td">
                  <p className="text-sm font-medium text-slate-900">{order.user_id || "-"}</p>
                </td>
                <td className="ui-td text-slate-600">{order.order_items?.length || 0}</td>
                <td className="ui-td font-semibold text-slate-900">{new Intl.NumberFormat("vi-VN").format(order.total_amount || 0)}₫</td>
                <td className="ui-td text-slate-600">{order.payment_method}</td>
                <td className="ui-td">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    order.payment_status === "paid" ? "bg-green-100 text-green-700" :
                    order.payment_status === "awaiting_review" ? "bg-amber-100 text-amber-700" :
                    order.payment_status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {order.payment_status === "paid" ? "Đã thanh toán" : order.payment_status === "awaiting_review" ? "Chờ duyệt chuyển khoản" : order.payment_status === "pending" ? "Chờ thanh toán" : "Thất bại"}
                  </span>
                  {(order.payment_method === "bank" &&
                    (order.payment_status === "awaiting_review" ||
                      order.payment_status === "pending")) && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={async () => {
                          await fetch("/api/orders", {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: "Bearer local-session",
                            },
                            body: JSON.stringify({
                              orderId: order.id,
                              action: "approve_bank",
                              reviewer: "admin@gmail.com",
                            }),
                          });
                          loadOrders();
                        }}
                        className="text-xs px-2 py-1 rounded bg-green-600 text-white"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={async () => {
                          await fetch("/api/orders", {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: "Bearer local-session",
                            },
                            body: JSON.stringify({
                              orderId: order.id,
                              action: "reject_bank",
                              reviewer: "admin@gmail.com",
                            }),
                          });
                          loadOrders();
                        }}
                        className="text-xs px-2 py-1 rounded bg-red-600 text-white"
                      >
                        Từ chối
                      </button>
                    </div>
                  )}
                  {order.review?.created_at && (
                    <p className="mt-1 text-[11px] text-slate-400">
                      {order.review.action === "approved" ? "Đã duyệt" : "Đã từ chối"} bởi{" "}
                      {order.review.reviewer || "admin"} -{" "}
                      {new Date(order.review.created_at).toLocaleString("vi-VN")}
                    </p>
                  )}
                </td>
                <td className="ui-td text-slate-500">{new Date(order.created_at).toLocaleDateString("vi-VN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}