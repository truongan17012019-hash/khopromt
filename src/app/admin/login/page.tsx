"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error || "Sai tài khoản hoặc mật khẩu.");
        return;
      }
      const dataEmail = String(json?.data?.email || normalizedEmail);
      login("Quản trị viên", dataEmail, "admin");
      router.replace("/admin");
    } catch {
      setError("Không thể đăng nhập. Thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
              <span className="font-bold text-lg">P</span>
            </div>
            <span className="font-display font-bold text-xl">
              Prompt<span className="text-brand-400">VN</span>{" "}
              <span className="text-slate-400 text-sm font-semibold">Admin</span>
            </span>
          </Link>
        </div>
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8 shadow-xl">
          <h1 className="font-display text-2xl font-bold text-white text-center">
            Đăng nhập quản trị
          </h1>
          <p className="text-slate-400 text-center text-sm mt-2">
            Chỉ tài khoản admin trong hệ thống. Không dùng chung với đăng nhập khách hàng.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email admin</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-slate-100 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-slate-100 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                required
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 disabled:opacity-60 transition-colors"
            >
              {loading ? "Đang xử lý…" : "Vào trang quản trị"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            <Link href="/dang-nhap" className="text-brand-400 hover:text-brand-300 font-medium">
              ← Đăng nhập khách hàng
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
