"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/tracking";
import { useCartStore, usePurchaseStore, useAuthStore } from "@/lib/store";
import { prompts } from "@/data/prompts";

async function confirmPaidWithRetry(orderId: string, maxRetries = 2): Promise<boolean> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer local-session",
        },
        body: JSON.stringify({
          orderId,
          action: "confirm_paid",
          reviewer: "system",
        }),
      });
      if (res.ok) return true;
    } catch {
      // retry
    }
    if (attempt < maxRetries) {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  return false;
}

function idsIncludePlanSku(ids: string[]) {
  return ids.some((id) => String(id).startsWith("plan-"));
}

export default function ThanhToanThanhCongPage() {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [status, setStatus] = useState<"success" | "processing" | "failed">("processing");
  const [purchasedPlanOrder, setPurchasedPlanOrder] = useState(false);
  const [planSlotsAfterPayment, setPlanSlotsAfterPayment] = useState<number | null>(null);
  const [automation, setAutomation] = useState<any>({ enabled: false, onboardingMessage: "", upsellPromptIds: [] });
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const markPurchased = usePurchaseStore((s) => s.markPurchased);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/automation-settings", { cache: "no-store" });
        const json = await res.json();
        if (res.ok) setAutomation(json?.data || {});
      } catch {
        // noop
      }
    })();
  }, []);

  useEffect(() => {
    if (status !== "success" || !purchasedPlanOrder) return;
    const email = user?.email?.trim().toLowerCase();
    if (!email) {
      setPlanSlotsAfterPayment(null);
      return;
    }
    let cancelled = false;
    (async () => {
      for (let attempt = 0; attempt < 4; attempt++) {
        try {
          const r = await fetch(
            `/api/user/plan-entitlements?userId=${encodeURIComponent(email)}`,
            { cache: "no-store" }
          );
          const j = await r.json();
          if (!cancelled && r.ok) {
            const n = Number(j?.totalPickSlotsRemaining ?? 0);
            setPlanSlotsAfterPayment(n);
            if (n > 0 || attempt >= 3) break;
          }
        } catch {
          /* retry */
        }
        if (attempt < 3) await new Promise((r) => setTimeout(r, 1200));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, purchasedPlanOrder, user?.email]);

  const restorePendingPurchases = () => {
    const raw = localStorage.getItem("promptvn_pending_purchase_ids");
    if (!raw) return false;
    try {
      const pendingIds = JSON.parse(raw);
      if (Array.isArray(pendingIds) && pendingIds.length > 0) {
        markPurchased(pendingIds);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      localStorage.removeItem("promptvn_pending_purchase_ids");
    }
  };

  useEffect(() => {
    const processPayment = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const resolvedOrderId = params.get("orderId") || params.get("vnp_TxnRef");
        const responseCode = params.get("vnp_ResponseCode");
        const resultCode = params.get("resultCode");

        setOrderId(resolvedOrderId);

        const method = params.get("method");
        const isWalletPayment = method === "wallet";
        const isPaymentSuccess = responseCode === "00" || resultCode === "0" || isWalletPayment;
        const hasGatewayParams = !!(responseCode || resultCode || isWalletPayment);

        if (isPaymentSuccess) {
          const rawPending = localStorage.getItem("promptvn_pending_purchase_ids");
          let pendingIds: string[] = [];
          try {
            pendingIds = rawPending ? JSON.parse(rawPending) : [];
          } catch {
            pendingIds = [];
          }
          const cartIds = items.map((item) => item.prompt.id);
          const idsForPlanCheck =
            Array.isArray(pendingIds) && pendingIds.length > 0 ? pendingIds : cartIds;
          setPurchasedPlanOrder(idsIncludePlanSku(idsForPlanCheck.map(String)));

          // 1. Gọi API confirm paid (có retry) — kích hoạt gói / prompt trên server
          if (resolvedOrderId) {
            await confirmPaidWithRetry(resolvedOrderId);
          }

          if (Array.isArray(pendingIds) && pendingIds.length > 0) {
            markPurchased(pendingIds);
            localStorage.removeItem("promptvn_pending_purchase_ids");
          } else if (items.length > 0) {
            markPurchased(cartIds);
          }
          clearCart();
          setStatus("success");

          trackEvent("purchase", {
            order_id: resolvedOrderId,
            payment_method: responseCode ? "vnpay" : "momo",
            user_email: user?.email || "unknown",
          });
        } else if (hasGatewayParams) {
          setStatus("failed");
        } else {
          // Fallback for mock/local redirects without gateway params
          const rawFb = localStorage.getItem("promptvn_pending_purchase_ids");
          let pendFb: string[] = [];
          try {
            pendFb = rawFb ? JSON.parse(rawFb) : [];
          } catch {
            pendFb = [];
          }
          const cartFb = items.map((item) => item.prompt.id);
          setPurchasedPlanOrder(
            idsIncludePlanSku((pendFb.length ? pendFb : cartFb).map(String))
          );
          const restored = restorePendingPurchases();
          if (restored || items.length > 0) {
            if (items.length > 0) {
              markPurchased(cartFb);
              clearCart();
            }
            setStatus("success");
          } else {
            setStatus("failed");
          }
        }
      } catch {
        setStatus("failed");
      }
    };
    processPayment();
  }, []);

  useEffect(() => {
    // Hard timeout fallback to avoid infinite "processing" UI.
    const timer = setTimeout(() => {
      setStatus((current) => (current === "processing" ? "failed" : current));
    }, 10000); // tăng lên 10s vì giờ await PATCH
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
      <div className="max-w-lg mx-4 text-center">
        {status === "success" && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-display text-3xl font-bold text-slate-900">Thanh toán thành công!</h1>
            {purchasedPlanOrder ? (
              <>
                <p className="text-slate-600 mt-3">
                  Bạn đã kích hoạt <span className="font-semibold text-slate-800">gói chọn prompt</span>. Prompt{" "}
                  <span className="font-semibold">chưa tự mở</span> — vào từng prompt trong danh mục và nhấn{" "}
                  <span className="whitespace-nowrap font-semibold text-emerald-700">«Mở khóa bằng gói»</span>.
                </p>
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm text-emerald-900">
                  {planSlotsAfterPayment === null && user?.email && (
                    <p className="animate-pulse">Đang kiểm tra số lượt còn lại trên tài khoản…</p>
                  )}
                  {planSlotsAfterPayment !== null && (
                    <>
                      <p>
                        Hiện bạn có{" "}
                        <span className="text-lg font-extrabold tabular-nums">{planSlotsAfterPayment}</span> lượt
                        chọn prompt.
                      </p>
                      {planSlotsAfterPayment === 0 && user?.email && (
                        <p className="mt-2 text-xs text-amber-900">
                          Nếu bạn vừa mua gói mà vẫn 0 lượt: chờ vài giây và tải lại trang, hoặc kiểm tra Supabase đã
                          chạy migration bảng gói, và đơn hàng đã ở trạng thái đã thanh toán.
                        </p>
                      )}
                    </>
                  )}
                  {!user?.email && (
                    <p className="text-amber-800">
                      Đăng nhập cùng email đã thanh toán để thấy lượt gói trên Dashboard và khi mở từng prompt.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-slate-500 mt-3">
                Cảm ơn bạn đã mua hàng. Prompt đã được thêm vào tài khoản của bạn.
              </p>
            )}
            {orderId && <p className="text-sm text-slate-400 mt-2">Mã đơn hàng: {orderId}</p>}
            {automation?.enabled && (
              <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-left text-sm text-indigo-900">
                <p className="font-semibold">Onboarding sau mua</p>
                <p className="mt-1">{automation?.onboardingMessage}</p>
                {Array.isArray(automation?.upsellPromptIds) && automation.upsellPromptIds.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {automation.upsellPromptIds
                      .map((id: string) => prompts.find((p) => p.id === id))
                      .filter(Boolean)
                      .slice(0, 3)
                      .map((p: any) => (
                        <Link
                          key={p.id}
                          href={`/prompt/${p.id}`}
                          className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-700 text-xs font-semibold"
                        >
                          Upsell: {p.title}
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            )}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              {purchasedPlanOrder ? (
                <>
                  <Link
                    href="/danh-muc"
                    className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-all"
                  >
                    Chọn prompt để mở khóa
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
                  >
                    Về Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-all">
                    Xem prompt đã mua
                  </Link>
                  <Link href="/danh-muc" className="px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all">
                    Tiếp tục mua sắm
                  </Link>
                </>
              )}
            </div>
          </>
        )}
        {status === "processing" && (
          <>
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="font-display text-3xl font-bold text-slate-900">Đang xử lý thanh toán...</h1>
            <p className="text-slate-500 mt-3">Hệ thống đang xác nhận thanh toán và kích hoạt prompt. Vui lòng đợi trong giây lát.</p>
          </>
        )}
        {status === "failed" && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="font-display text-3xl font-bold text-slate-900">Thanh toán thất bại</h1>
            <p className="text-slate-500 mt-3">Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.</p>
            <div className="mt-8">
              <Link href="/gio-hang" className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-all">
                Quay lại giỏ hàng
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
