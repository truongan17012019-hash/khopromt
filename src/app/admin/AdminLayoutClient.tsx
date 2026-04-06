"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useEffect } from "react";
import { signOutClient } from "@/lib/sign-out";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/kpi", label: "KPI 7 ngày", icon: "📈" },
  { href: "/admin/payment-settings", label: "Payment Settings", icon: "💳" },
  { href: "/admin/seo-settings", label: "SEO Settings", icon: "🔎" },
  { href: "/admin/course-page", label: "Trang Khóa học", icon: "🎓" },
  { href: "/admin/security", label: "Admin Security", icon: "🔐" },
  { href: "/admin/categories", label: "Chuyên mục & SEO", icon: "🗂️" },
  { href: "/admin/plans", label: "Quản lý gói", icon: "📦" },
  { href: "/admin/bundles", label: "Gói chuyên biệt", icon: "🎁" },
  { href: "/admin/prompts", label: "Quản lý Prompt", icon: "📝" },
  { href: "/admin/deposits", label: "Duyệt nạp tiền", icon: "💳" },
  { href: "/admin/orders", label: "Đơn hàng", icon: "🛒" },
  { href: "/admin/users", label: "Khách hàng", icon: "👥" },
  { href: "/admin/coupons", label: "Mã giảm giá", icon: "🎟️" },
  { href: "/admin/automation", label: "Automation", icon: "⚙️" },
  { href: "/admin/reviews", label: "Đánh giá", icon: "⭐" },
  { href: "/admin/menu-settings", label: "Menu & Footer", icon: "📋" },
  { href: "/admin/email-marketing", label: "Email Marketing", icon: "📧" },
  { href: "/admin/payouts", label: "Seller Payouts", icon: "💸" },
];
export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user } = useAuthStore();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;
    if (!isLoggedIn) {
      router.replace("/admin/login");
      return;
    }
    if (user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [isLoginPage, isLoggedIn, user?.role, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isLoggedIn || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 fixed h-full">        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="font-display font-bold text-lg">
              PromptVN <span className="text-brand-400 text-sm">Admin</span>
            </span>
          </Link>
        </div>
        <nav className="mt-4 px-3">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-all ${
                pathname === item.href
                  ? "bg-brand-600 text-white shadow-lg shadow-slate-950/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 space-y-1">
          <Link href="/" className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">
            <span>🌐</span> Về trang chủ
          </Link>
          <button
            type="button"
            onClick={() => void signOutClient().then(() => router.replace("/admin/login"))}
            className="flex w-full items-center gap-2 px-4 py-2 text-slate-400 hover:text-red-300 text-sm transition-colors text-left rounded-lg hover:bg-slate-800/80"
          >
            <span>🚪</span> Đăng xuất admin
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 ml-64 p-6 lg:p-8">{children}</main>
    </div>
  );
}