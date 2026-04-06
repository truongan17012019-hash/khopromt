"use client";

import { useEffect, useState } from "react";

type UserItem = {
  id: string;
  email: string;
  full_name: string;
  provider: string;
  points: number;
  created_at: string;
  total_orders: number;
  paid_orders: number;
  paid_amount: number;
  balance: number;
};

type Meta = {
  authUserCount: number;
  orderUserCount: number;
  totalMerged: number;
};

const providerLabel: Record<string, string> = {
  google: "Google", email: "Email", local: "Local",
};
const providerColor: Record<string, string> = {
  google: "bg-blue-100 text-blue-700",
  email: "bg-emerald-100 text-emerald-700",
  local: "bg-slate-100 text-slate-600",
};

function fmt(n: number) {
  return new Intl.NumberFormat("vi-VN").format(n);
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  // Modal nạp tiền
  const [depositTarget, setDepositTarget] = useState<UserItem | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositNote, setDepositNote] = useState("");
  const [depositing, setDepositing] = useState(false);
  const [depositMsg, setDepositMsg] = useState("");

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      if (res.ok) {
        setUsers(json?.data || []);
        setMeta(json?.meta || null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleDeposit = async () => {
    if (!depositTarget || !depositAmount) return;
    setDepositing(true);
    setDepositMsg("");
    try {
      const res = await fetch("/api/admin/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: depositTarget.email,
          amount: Number(depositAmount),
          action: "deposit",
          note: depositNote || "Nạp tiền từ admin",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setDepositMsg(`Đã nạp ${fmt(Number(depositAmount))}₫ cho ${depositTarget.email}. Số dư mới: ${fmt(json.balance)}₫`);
      setDepositAmount("");
      setDepositNote("");
      // Reload users
      loadUsers();
    } catch (e: any) {
      setDepositMsg(`Lỗi: ${e.message}`);
    } finally {
      setDepositing(false);
    }
  };

  const filtered = search.trim()
    ? users.filter(
        (u) =>
          u.full_name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  const totalPaid = users.reduce((s, u) => s + u.paid_amount, 0);
  const totalBalance = users.reduce((s, u) => s + (u.balance || 0), 0);

  return (
    <div>
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Khách hàng đăng ký</h1>
        <p className="text-sm text-slate-500 mt-1">Quản lý khách hàng, số dư ví và nạp tiền.</p>
      </div>

      {/* Stats */}
      {meta && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase">Tổng KH</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{meta.totalMerged}</p>
          </div>
          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase">Auth (Google)</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{meta.authUserCount}</p>
          </div>
          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase">Có đơn hàng</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{meta.orderUserCount}</p>
          </div>
          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase">Tổng doanh thu</p>
            <p className="text-xl font-bold text-amber-600 mt-1">{fmt(totalPaid)}₫</p>
          </div>
          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase">Tổng số dư ví</p>
            <p className="text-xl font-bold text-brand-600 mt-1">{fmt(totalBalance)}₫</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mt-4">
        <input type="text" className="w-full max-w-sm border rounded-lg px-3 py-2 text-sm"
          placeholder="Tìm theo tên hoặc email..." value={search}
          onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="mt-4 bg-white border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            {search ? "Không tìm thấy" : "Chưa có khách hàng nào"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b text-xs text-slate-500 uppercase">
                  <th className="text-left px-4 py-3">Khách hàng</th>
                  <th className="text-left px-4 py-3">Nguồn</th>
                  <th className="text-right px-4 py-3">Đơn hàng</th>
                  <th className="text-right px-4 py-3">Doanh thu</th>
                  <th className="text-right px-4 py-3">Số dư ví</th>
                  <th className="text-left px-4 py-3">Ngày TG</th>
                  <th className="text-center px-4 py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-900">{u.full_name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${providerColor[u.provider] || providerColor.local}`}>
                        {providerLabel[u.provider] || u.provider}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm">{u.total_orders}
                      {u.paid_orders > 0 && <span className="text-xs text-emerald-600 ml-1">({u.paid_orders} paid)</span>}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium">
                      {u.paid_amount > 0 ? fmt(u.paid_amount) + "₫" : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-bold ${u.balance > 0 ? "text-brand-600" : "text-slate-300"}`}>
                        {u.balance > 0 ? fmt(u.balance) + "₫" : "0₫"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(u.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => { setDepositTarget(u); setDepositMsg(""); }}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-700 px-2 py-1 rounded-lg hover:bg-brand-50">
                        + Nạp tiền
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal nạp tiền */}
      {depositTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-bold text-lg text-slate-900">Nạp tiền cho khách hàng</h3>
            <p className="text-sm text-slate-500 mt-1">{depositTarget.full_name} — {depositTarget.email}</p>
            <p className="text-sm mt-2">Số dư hiện tại: <span className="font-bold text-brand-600">{fmt(depositTarget.balance || 0)}₫</span></p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700">Số tiền nạp (₫)</label>
                <input type="number" value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="VD: 200000"
                  className="w-full border rounded-xl px-3 py-2 text-sm mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Ghi chú</label>
                <input type="text" value={depositNote}
                  onChange={(e) => setDepositNote(e.target.value)}
                  placeholder="VD: CK ngân hàng 01/04"
                  className="w-full border rounded-xl px-3 py-2 text-sm mt-1" />
              </div>
            </div>

            {depositMsg && <p className="mt-3 text-sm text-slate-600">{depositMsg}</p>}

            <div className="flex gap-2 mt-5">
              <button onClick={handleDeposit} disabled={depositing || !depositAmount}
                className="flex-1 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50">
                {depositing ? "Đang nạp..." : "Xác nhận nạp"}
              </button>
              <button onClick={() => setDepositTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
