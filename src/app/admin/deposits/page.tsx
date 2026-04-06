"use client";

import { useEffect, useState } from "react";

interface DepositRequest {
  id: string;
  email: string;
  username: string;
  amount: number;
  transfer_content: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  reviewed_at?: string;
}

export default function AdminDepositsPage() {
  const [requests, setRequests] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [processing, setProcessing] = useState<string | null>(null);

  const loadRequests = async () => {
    try {
      const res = await fetch("/api/user/deposit-request?all=true");
      const json = await res.json();
      setRequests(json?.data || []);
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    const ok = confirm(action === "approve" ? "Duyệt yêu cầu nạp tiền này?" : "Từ chối yêu cầu này?");
    if (!ok) return;
    setProcessing(id);
    try {
      const res = await fetch("/api/user/deposit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) throw new Error("Failed");
      await loadRequests();
    } catch {
      alert("Có lỗi xảy ra!");
    } finally {
      setProcessing(null);
    }
  };

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedTotal = requests
    .filter((r) => r.status === "approved")
    .reduce((sum, r) => sum + Number(r.amount || 0), 0);

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  if (loading) {
    return <div className="text-sm text-slate-500">Đang tải...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Duyệt nạp tiền</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý yêu cầu nạp tiền từ người dùng</p>
        </div>
        {pendingCount > 0 && (
          <span className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-xl text-sm font-bold">
            {pendingCount} chờ duyệt
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <div className="text-sm text-slate-500">Tổng yêu cầu</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{requests.length}</div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <div className="text-sm text-slate-500">Chờ duyệt</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <div className="text-sm text-slate-500">Đã duyệt tổng</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{formatPrice(approvedTotal)}</div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === f ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f === "all" ? "Tất cả" : f === "pending" ? "Chờ duyệt" : f === "approved" ? "Đã duyệt" : "Từ chối"}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">User</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Số tiền</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Nội dung CK</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Thời gian</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Trạng thái</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    Không có yêu cầu nào
                  </td>
                </tr>
              ) : (
                filtered.map((req) => (
                  <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{req.username}</div>
                      <div className="text-xs text-slate-400">{req.email}</div>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">{formatPrice(Number(req.amount || 0))}</td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-xs">{req.transfer_content}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {new Date(req.created_at).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                          req.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : req.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {req.status === "approved"
                          ? "Đã duyệt"
                          : req.status === "rejected"
                            ? "Từ chối"
                            : "Chờ duyệt"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {req.status === "pending" ? (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleAction(req.id, "approve")}
                            disabled={processing === req.id}
                            className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => handleAction(req.id, "reject")}
                            disabled={processing === req.id}
                            className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200 disabled:opacity-50"
                          >
                            Từ chối
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          {req.reviewed_at ? new Date(req.reviewed_at).toLocaleString("vi-VN") : "—"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
