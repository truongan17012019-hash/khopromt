"use client";

import Link from "next/link";
import { useAuthStore, usePurchaseStore } from "@/lib/store";
import { prompts } from "@/data/prompts";
import { cskhBundlePromptIds, cskhBundleSku, growthBundleSku } from "@/data/pricing";
import { formatPrice } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOutClient } from "@/lib/sign-out";

export default function DashboardPage() {
  const { isLoggedIn, user } = useAuthStore();
  const purchasedPromptIds = usePurchaseStore((s) => s.purchasedPromptIds);
  const markPurchased = usePurchaseStore((s) => s.markPurchased);
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("purchased");
  const [planPickSlotsRemaining, setPlanPickSlotsRemaining] = useState(0);
  const [hasPlanEntitlements, setHasPlanEntitlements] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const promptCatalog = [...prompts, growthBundleSku, cskhBundleSku];

  useEffect(() => {
    if (isLoggedIn && user?.role === "admin") {
      router.replace("/admin");
    }
  }, [isLoggedIn, user?.role, router]);

  useEffect(() => {
    const syncPurchases = async () => {
      if (!isLoggedIn || !user?.email) return;
      try {
        const normalizedEmail = String(user.email || "").trim().toLowerCase();
        const res = await fetch(
          `/api/orders?userId=${encodeURIComponent(normalizedEmail)}`,
          { cache: "no-store" }
        );
        const json = await res.json();
        if (!res.ok || !Array.isArray(json?.data)) return;
        const paidPromptIds = json.data
          .filter((order: any) => order.payment_status === "paid")
          .flatMap((order: any) =>
            (order.order_items || []).map((item: any) => item.prompt_id)
          )
          .filter(Boolean);
        const inferredBundleIds = json.data
          .filter(
            (order: any) =>
              order.payment_status === "paid" &&
              [growthBundleSku.price, cskhBundleSku.price].includes(Number(order.total_amount || 0)) &&
              (!order.order_items || order.order_items.length === 0)
          )
          .flatMap((order: any) =>
            Number(order.total_amount || 0) === cskhBundleSku.price
              ? [cskhBundleSku.id, ...cskhBundlePromptIds]
              : [growthBundleSku.id]
          );
        const inferredSinglePromptIds = json.data
          .filter(
            (order: any) =>
              order.payment_status === "paid" &&
              (!order.order_items || order.order_items.length === 0)
          )
          .map((order: any) => {
            const amount = Number(order.total_amount || 0);
            const matched = promptCatalog.filter((p) => Number(p.price || 0) === amount);
            return matched.length === 1 ? matched[0].id : null;
          })
          .filter(Boolean) as string[];
        const manualGrantedIds = json.data
          .map((order: any) => String(order?.review?.note || ""))
          .map((note: string) => {
            const match = note.match(/(?:manual grant prompt|auto repair prompt)\s+([a-z0-9-]+)/i);
            return match?.[1] || null;
          })
          .filter(Boolean) as string[];
        const purchasedFromServer = Array.isArray(json?.purchased_prompt_ids)
          ? (json.purchased_prompt_ids as string[])
          : [];
        const mergedIds = Array.from(
          new Set([
            ...paidPromptIds,
            ...inferredBundleIds,
            ...inferredSinglePromptIds,
            ...manualGrantedIds,
            ...purchasedFromServer,
          ])
        );
        if (mergedIds.length) {
          markPurchased(mergedIds);
        }
      } catch {
        // noop
      }
    };
    syncPurchases();
  }, [isLoggedIn, user?.email, markPurchased]);

  useEffect(() => {
    if (!isLoggedIn || !user?.email) {
      setPlanPickSlotsRemaining(0);
      setHasPlanEntitlements(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/user/plan-entitlements?userId=${encodeURIComponent(
            String(user.email).trim().toLowerCase()
          )}`,
          { cache: "no-store" }
        );
        const json = await res.json();
        if (!cancelled && res.ok) {
          setPlanPickSlotsRemaining(Number(json?.totalPickSlotsRemaining ?? 0));
          setHasPlanEntitlements(Array.isArray(json?.entitlements) && json.entitlements.length > 0);
        }
      } catch {
        if (!cancelled) {
          setPlanPickSlotsRemaining(0);
          setHasPlanEntitlements(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, user?.email, pathname]);

  // Fetch wallet balance
  useEffect(() => {
    if (!isLoggedIn || !user?.email) {
      setWalletBalance(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const email = String(user.email).trim().toLowerCase();
        const res = await fetch(
          `/api/user/balance?email=${encodeURIComponent(email)}`,
          { cache: "no-store" }
        );
        const json = await res.json();
        if (!cancelled && res.ok) {
          setWalletBalance(Number(json?.balance) || 0);
        }
      } catch {
        if (!cancelled) setWalletBalance(0);
      }
    })();
    return () => { cancelled = true; };
  }, [isLoggedIn, user?.email, pathname]);

  const purchasedPrompts = prompts.filter((p) => purchasedPromptIds.includes(p.id));
  const purchasedItems = [
    ...purchasedPrompts.map((prompt) => ({
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      price: prompt.price,
      createdAt: prompt.createdAt,
      href: `/prompt/${prompt.id}`,
      type: "prompt" as const,
    })),
    ...(purchasedPromptIds.includes("growth-bundle")
      ? [{
          id: growthBundleSku.id,
          title: growthBundleSku.title,
          description: "Đã mở quyền truy cập 3 workflow Growth.",
          price: growthBundleSku.price,
          createdAt: growthBundleSku.createdAt,
          href: "/workflow/ads-chuyen-doi",
          type: "bundle" as const,
        }]
      : []),
    ...(purchasedPromptIds.includes(cskhBundleSku.id)
      ? [{
          id: cskhBundleSku.id,
          title: cskhBundleSku.title,
          description: "Đã mở quyền truy cập toàn bộ 30 prompt CSKH.",
          price: cskhBundleSku.price,
          createdAt: cskhBundleSku.createdAt,
          href: "/danh-muc/cham-soc-khach-hang",
          type: "bundle" as const,
        }]
      : []),
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Vui lòng đăng nhập
          </h2>          <p className="text-slate-500 mt-2">
            Bạn cần đăng nhập để xem dashboard
          </p>
          <Link
            href="/dang-nhap"
            className="inline-block mt-6 px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-all"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="hero-mlv border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="section-eyebrow text-brand-400 mb-3">Tài khoản</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20 shrink-0">
              <span className="text-white text-2xl font-extrabold">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                Xin chào, {user?.name}!
              </h1>
              <p className="text-slate-400 mt-1 truncate">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={async () => {
                await signOutClient();
                router.push("/");
              }}
              className="sm:ml-auto px-4 py-2.5 rounded-xl border border-slate-600 text-slate-200 text-sm font-semibold hover:bg-slate-800/80 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {hasPlanEntitlements && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-800">Gói chọn prompt</p>
            <p className="mt-2 text-emerald-950 text-base leading-relaxed">
              Bạn đang có{" "}
              <span className="text-2xl font-extrabold tabular-nums text-emerald-700">
                {planPickSlotsRemaining}
              </span>{" "}
              lượt mở khóa prompt. Vào danh mục, mở từng prompt và nhấn{" "}
              <span className="font-semibold">«Mở khóa bằng gói»</span> — không tốn thêm tiền cho từng prompt
              đó.
            </p>
            {planPickSlotsRemaining === 0 && (
              <p className="mt-2 text-sm text-amber-800">
                Bạn đã dùng hết lượt của gói hiện tại. Có thể mua thêm gói để tiếp tục mở khóa prompt.
              </p>
            )}
            <Link
              href="/danh-muc"
              className="inline-flex mt-4 px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-bold hover:bg-emerald-800 transition-colors"
            >
              Chọn prompt ngay →
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="ui-card p-5">
            <div className="text-sm text-slate-500">Prompt đã mua</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {purchasedPrompts.length}
            </div>          </div>
          <div className="ui-card p-5">
            <div className="text-sm text-slate-500">Tổng chi tiêu</div>
            <div className="text-2xl font-bold text-brand-700 mt-1">
              {formatPrice(
                purchasedItems.reduce((sum, p) => sum + p.price, 0)
              )}
            </div>
          </div>
          <div className="ui-card p-5">
            <div className="text-sm text-slate-500">Số dư ví</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              {walletBalance !== null ? formatPrice(walletBalance) : "..."}
            </div>
          </div>
          <Link href="/nap-tien" className="ui-card p-5 hover:border-brand-300 transition-colors group">
            <div className="text-sm text-slate-500 group-hover:text-brand-600">Nạp tiền</div>
            <div className="text-lg font-bold text-brand-600 mt-1 flex items-center gap-1">
              Nạp ngay <span className="text-xl">→</span>
            </div>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 w-fit">
          {[
            { id: "purchased", label: "Prompt đã mua" },
            { id: "favorites", label: "Yêu thích" },
            { id: "settings", label: "Cài đặt" },
          ].map((tab) => (            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "purchased" && (
          <div className="space-y-4">
            {purchasedItems.map((prompt) => (
              <div
                key={prompt.id}
                className="ui-card p-6 flex flex-col sm:flex-row gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-lg">
                      {prompt.type === "bundle" ? "Đã mua gói" : "Đã mua"}
                    </span>
                    <span className="text-xs text-slate-400">{prompt.createdAt}</span>
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900">
                    {prompt.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                    {prompt.description}
                  </p>
                </div>
                <div className="flex sm:flex-col items-center gap-3">
                  <Link
                    href={`/prompt/${prompt.id}`}
                    className="ui-btn-primary px-4 py-2"
                  >
                    Xem Prompt
                  </Link>
                  <button className="ui-btn-ghost px-4 py-2">
                    Tải xuống
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="ui-card p-12 text-center">
            <div className="text-4xl mb-4">💝</div>
            <h3 className="font-semibold text-slate-900 text-lg">
              Chưa có prompt yêu thích
            </h3>            <p className="text-slate-500 mt-2 text-sm">
              Nhấn vào biểu tượng trái tim để lưu prompt yêu thích
            </p>
            <Link
              href="/danh-muc"
              className="inline-block mt-4 ui-btn-primary"
            >
              Khám phá prompt
            </Link>
          </div>
        )}

        {activeTab === "purchased" && purchasedItems.length === 0 && (
          <div className="ui-card p-12 text-center">
            <div className="text-4xl mb-4">🛍️</div>
            <h3 className="font-semibold text-slate-900 text-lg">
              Bạn chưa mua prompt nào
            </h3>
            <p className="text-slate-500 mt-2 text-sm">
              Mua prompt hoặc Growth Bundle để mở nội dung đầy đủ.
            </p>
            <Link
              href="/danh-muc"
              className="inline-block mt-4 ui-btn-primary"
            >
              Khám phá prompt
            </Link>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="ui-card p-6">
            <h2 className="font-display font-bold text-lg text-slate-900 mb-6">
              Thông tin tài khoản
            </h2>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Họ tên
                </label>
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="ui-input"
                />
              </div>              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  className="ui-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  placeholder="0912 345 678"
                  className="ui-input"
                />
              </div>
              <button className="ui-btn-primary px-6 py-2.5">
                Lưu thay đổi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}