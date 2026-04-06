"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store";

export default function AdminSecurityPage() {
  const user = useAuthStore((s) => s.user);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const onReset = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email || "admin@gmail.com",
          oldPassword,
          newPassword,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Reset failed");
      setMessage("Đổi mật khẩu admin thành công.");
      setOldPassword("");
      setNewPassword("");
    } catch (error: any) {
      setMessage(error?.message || "Đổi mật khẩu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-slate-900">Admin Security</h1>
      <p className="text-sm text-slate-500 mt-1">Đổi mật khẩu tài khoản admin.</p>
      <div className="mt-6 bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Mật khẩu hiện tại"
          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Mật khẩu mới (>=8 ký tự)"
          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
        />
        <button
          onClick={onReset}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold disabled:opacity-70"
        >
          {saving ? "Đang xử lý..." : "Đổi mật khẩu"}
        </button>
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </div>
    </div>
  );
}
