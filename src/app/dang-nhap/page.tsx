"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";

export default function DangNhapPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [oauthLoading, setOauthLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn && user?.role === "admin") {
      router.replace("/admin");
    }
  }, [isLoggedIn, user?.role, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    const displayName = name || email.split("@")[0];
    /* Chỉ luồng khách hàng — admin đăng nhập tại /admin/login */
    login(displayName, normalizedEmail, "user");

    // Lưu thông tin user vào Supabase để admin theo dõi
    fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizedEmail, name: displayName }),
    }).catch(() => {}); // fire-and-forget, không block UX

    router.push("/dashboard");
  };

  const handleGoogleAuth = async () => {
    setError("");
    if (!supabase) {
      setError("Chưa cấu hình Supabase. Vui lòng kiểm tra .env.local");
      return;
    }
    setOauthLoading(true);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dang-nhap?oauth=google`,
      },
    });
    if (oauthError) {
      setError(oauthError.message || "Không thể đăng nhập bằng Google");
      setOauthLoading(false);
    }
  };

  useEffect(() => {
    const syncGoogleSession = async () => {
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user;
      if (!sessionUser?.email) return;
      const displayName =
        (sessionUser.user_metadata?.full_name as string) ||
        (sessionUser.user_metadata?.name as string) ||
        sessionUser.email.split("@")[0];
      const gEmail = sessionUser.email.toLowerCase();
      login(displayName, gEmail, "user");

      // Lưu Google user vào DB để admin theo dõi
      fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: gEmail, name: displayName }),
      }).catch(() => {});

      router.replace("/dashboard");
    };
    syncGoogleSession();
  }, [login, router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12">
      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">            <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="font-display font-bold text-2xl text-slate-900">
              Prompt<span className="text-brand-600">VN</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <h1 className="font-display text-2xl font-bold text-slate-900 text-center">
            {isRegister ? "Tạo tài khoản" : "Đăng nhập"}
          </h1>
          <p className="text-slate-500 text-center mt-2 text-sm">
            {isRegister
              ? "Đăng ký để mua và quản lý prompt"
              : "Chào mừng bạn quay trở lại"}
          </p>
          <p className="text-center mt-3 text-xs text-slate-400">
            Quản trị viên?{" "}
            <Link href="/admin/login" className="text-brand-600 font-semibold hover:underline">
              Đăng nhập admin
            </Link>
          </p>

          {/* Social Login */}
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={oauthLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-60"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-slate-700">
                {oauthLoading ? "Đang chuyển hướng..." : "Tiếp tục với Google"}
              </span>
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400">hoặc</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Họ tên
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                required
              />
            </div>
            {!isRegister && (
              <div className="text-right">
                <a href="#" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                  Quên mật khẩu?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-all active:scale-[0.98]"
            >
              {isRegister ? "Đăng ký" : "Đăng nhập"}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-brand-600 font-semibold hover:text-brand-700"
            >
              {isRegister ? "Đăng nhập" : "Đăng ký ngay"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}