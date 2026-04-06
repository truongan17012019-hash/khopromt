"use client";

import { useEffect, useState } from "react";

export default function AdminReviewsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [summary, setSummary] = useState<any>({ total: 0, verified: 0 });

  const load = async () => {
    const url = `/api/admin/reviews${onlyVerified ? "?verified=true" : ""}`;
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();
    if (res.ok) {
      setRows(json?.data || []);
      setSummary(json?.summary || { total: 0, verified: 0 });
    }
  };

  useEffect(() => {
    load();
  }, [onlyVerified]);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Đánh giá & Trust</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tổng {summary.total} review, verified purchase: {summary.verified}
          </p>
        </div>
        <label className="text-sm flex items-center gap-2">
          <input type="checkbox" checked={onlyVerified} onChange={(e) => setOnlyVerified(e.target.checked)} />
          Chỉ xem verified
        </label>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-4 py-3">Prompt</th>
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Rating</th>
              <th className="text-left px-4 py-3">Trust</th>
              <th className="text-left px-4 py-3">Nội dung</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{r.prompt_id}</td>
                <td className="px-4 py-3">{r.user_id}</td>
                <td className="px-4 py-3">{"⭐".repeat(Math.max(0, Number(r.rating || 0)))}</td>
                <td className="px-4 py-3">
                  {r.is_verified_purchase ? (
                    <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-semibold">Verified</span>
                  ) : (
                    <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs">Unverified</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-700">{r.comment || "—"}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  Chưa có review nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

