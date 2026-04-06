"use client";

import Link from "next/link";
import { useAuthStore, useCartStore } from "@/lib/store";
import { formatPrice, getToolColor } from "@/lib/utils";
import { useEffect, useState } from "react";
import { cskhBundleSku, salesBundleSku, growthBundleSku, oneTimePlans } from "@/data/pricing";
import { trackEvent } from "@/lib/tracking";

export default function GioHangPage() {
  const { items, addItem, removeItem, clearCart, getTotalPrice } = useCartStore();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [showCheckout, setShowCheckout] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [bankInfo, setBankInfo] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const totalPrice = getTotalPrice();
  const upsellTierPlan = oneTimePlans.find((plan) => plan.id === "pro");
  const shouldSuggestUpsell =
    !!upsellTierPlan && items.length >= 2 && totalPrice < upsellTierPlan.price;
  const upsellGap = upsellTierPlan ? upsellTierPlan.price - totalPrice : 0;
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planId = params.get("plan");
    if (!planId) return;
    (async () => {
      try {
        const res = await fetch(
          `/api/plans/resolve?planId=${encodeURIComponent(planId)}`
        );
        const json = await res.json();
        if (!res.ok || !json?.prompt) return;
        const exists = useCartStore
          .getState()
          .items.some((item) => item.prompt.id === json.prompt.id);
        if (exists) return;
        addItem(json.prompt);
        trackEvent("add_plan_to_cart", { planId });
      } catch {
        /* noop */
      }
    })();
  }, [addItem]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sku = params.get("sku");
    const source = params.get("source") || "unknown";
    const bundleSkuMap: Record<string, any> = {
      "growth-bundle": growthBundleSku,
      "cskh-bundle": cskhBundleSku,
      "sales-bundle": salesBundleSku,
    };
    const selectedSku = sku ? bundleSkuMap[sku] : null;
    if (selectedSku && !items.some((item) => item.prompt.id === sku)) {
      addItem(selectedSku);
      trackEvent("click_buy_growth", { source, sku });
    }
  }, [addItem, items]);

  useEffect(() => {
    const loadPaymentSettings = async () => {
      try {
        const res = await fetch("/api/admin/payment-settings");
        const json = await res.json();
        if (res.ok) setBankInfo(json?.data || null);
      } catch {}
    };
    loadPaymentSettings();
  }, []);

  // Load wallet balance
  useEffect(() => {
    if (!user?.email) return;
    fetch(`/api/user/balance?email=${encodeURIComponent(user.email)}`)
      .then((r) => r.json())
      .then((j) => setWalletBalance(Number(j.balance) || 0))
      .catch(() => {});
  }, [user?.email]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="hero-mlv border-b border-slate-800/80 py-12">
          <div className="max-w-lg mx-auto px-4 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="font-display text-2xl font-bold text-white">Giỏ hàng trống</h2>
            <p className="text-slate-400 mt-2">Hãy thêm prompt vào giỏ hàng để bắt đầu</p>
            <Link href="/danh-muc" className="inline-block mt-6 ui-btn-primary px-8 py-3">
              Khám phá prompt
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="hero-mlv border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="section-eyebrow text-brand-400 mb-2">Thanh toán</p>
          <h1 className="font-display text-3xl font-extrabold text-white">
            Giỏ hàng ({items.length})
          </h1>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ prompt }) => (
              <div key={prompt.id} className="ui-card p-5 flex gap-4">
                {/* Preview */}
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex-shrink-0 flex items-center justify-center">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${getToolColor(prompt.tool)}`}>
                    {prompt.tool === "chatgpt" ? "GPT" : prompt.tool === "claude" ? "CL" : prompt.tool === "midjourney" ? "MJ" : "AI"}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={`/prompt/${prompt.id}`}>
                    <h3 className="font-semibold text-slate-900 hover:text-brand-600 transition-colors truncate">
                      {prompt.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                    {prompt.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-brand-700">
                      {formatPrice(prompt.price)}
                    </span>
                    <button
                      onClick={() => removeItem(prompt.id)}
                      className="text-sm text-red-500 hover:text-red-600 font-medium"
                    >
                      Xóa
                    </button>
                  </div>
                </div>              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-sm text-slate-400 hover:text-red-500 font-medium transition-colors"
            >
              Xóa tất cả
            </button>
          </div>

          {/* Order Summary */}
          <div>
            <div className="ui-card p-6 sticky top-24">
              <h2 className="font-display font-bold text-lg text-slate-900 mb-4">
                Tổng đơn hàng
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Tạm tính ({items.length} prompt)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Giảm giá</span>
                  <span className="text-green-600">-{formatPrice(0)}</span>
                </div>                <div className="pt-3 border-t border-slate-100 flex justify-between">
                  <span className="font-semibold text-slate-900">Tổng cộng</span>
                  <span className="text-xl font-bold text-brand-700">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
              {shouldSuggestUpsell && upsellTierPlan && (
                <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50 p-3.5">
                  <p className="text-sm font-semibold text-brand-800">
                    Gợi ý tối ưu: nâng lên gói {upsellTierPlan.name}
                  </p>
                  <p className="text-xs text-brand-700 mt-1">
                    Chỉ thêm {formatPrice(upsellGap)} để nhận tổng {upsellTierPlan.prompts} lượt theo gói.
                  </p>
                  <Link
                    href="/"
                    className="inline-block mt-2 text-xs font-semibold text-brand-700 hover:text-brand-800"
                  >
                    Xem chi tiết bảng giá
                  </Link>
                </div>
              )}

              {/* Coupon */}
              <div className="mt-4">
                <div className="flex gap-2">
                  <input type="text" placeholder="Mã giảm giá" className="ui-input flex-1 py-2 rounded-lg" />
                  <button className="ui-btn-secondary px-4 py-2 rounded-lg">
                    Áp dụng
                  </button>
                </div>
              </div>

              {!showCheckout ? (
                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      window.location.href = "/dang-nhap";
                      return;
                    }
                    setShowCheckout(true);
                    trackEvent("start_checkout", {
                      cart_items: items.length,
                      cart_total: totalPrice,
                    });
                  }}
                  className="w-full mt-6 ui-btn-primary py-3"
                >
                  {isLoggedIn ? "Thanh toán" : "Đăng nhập để thanh toán"}
                </button>
              ) : (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="font-semibold text-slate-900 mb-3">
                    Chọn phương thức thanh toán
                  </h3>
                  <div className="space-y-2">
                    {[
                      { id: "wallet", name: `Ví PromptVN (${formatPrice(walletBalance)})`, color: "bg-brand-500", label: "VP", disabled: walletBalance < totalPrice },
                      { id: "momo", name: "MoMo", color: "bg-pink-500", label: "Mo" },
                      { id: "vnpay", name: "VNPay", color: "bg-blue-600", label: "VN" },
                      { id: "bank", name: "Chuyển khoản ngân hàng", color: "bg-yellow-500", label: "CK" },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => !("disabled" in method && method.disabled) && setPaymentMethod(method.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                          "disabled" in method && method.disabled
                            ? "border-slate-100 opacity-50 cursor-not-allowed"
                            : paymentMethod === method.id
                            ? "border-brand-500 bg-brand-50"
                            : "border-slate-100 hover:border-slate-200"
                        }`}
                      >
                        <div className={`w-8 h-8 ${method.color} rounded-lg flex items-center justify-center text-white text-xs font-bold`}>
                          {method.label}
                        </div>
                        <span className="text-sm font-medium text-slate-900">
                          {method.name}
                        </span>
                        {paymentMethod === method.id && (
                          <svg className="w-5 h-5 text-brand-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Hướng dẫn nạp tiền ví */}
              {showCheckout && paymentMethod === "wallet" && walletBalance < totalPrice && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                  <p className="text-sm font-semibold text-amber-800">Số dư không đủ</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Bạn cần nạp thêm {formatPrice(totalPrice - walletBalance)} vào ví.
                  </p>
                  <a href="/nap-tien" className="inline-block mt-2 text-xs font-bold text-brand-700 hover:text-brand-800 underline">
                    Nạp tiền ngay →
                  </a>
                </div>
              )}

              {/* Hướng dẫn CK nạp tiền */}
              {showCheckout && paymentMethod === "bank" && bankInfo && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold">Nạp tiền vào ví:</span> CK với nội dung <span className="font-bold text-brand-700">{(user?.email || "").split("@")[0]} naptien</span> để nạp trước, mua nhiều prompt thoải mái.
                  </p>
                </div>
              )}

              {showCheckout && (
                <button
                  onClick={async () => {
                    if (isPaying) return;
                    setCheckoutError(null);
                    setIsPaying(true);
                    try {
                      const orderRes = await fetch("/api/orders", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: "Bearer local-session",
                        },
                        body: JSON.stringify({
                          userId: user?.email || "guest",
                          paymentMethod,
                          items: items.map((item) => ({
                            promptId: item.prompt.id,
                            price: item.prompt.price,
                          })),
                        }),
                      });
                      const orderJson = await orderRes.json();
                      if (!orderRes.ok || !orderJson?.data?.orderId) {
                        throw new Error(orderJson?.error || "Không tạo được đơn hàng");
                      }

                      // Thanh toán bằng Ví PromptVN
                      if (paymentMethod === "wallet") {
                        // Trừ tiền ví
                        const balRes = await fetch("/api/admin/balance", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            email: user?.email,
                            amount: orderJson.data.totalAmount,
                            action: "deduct",
                            note: `Thanh toán đơn ${orderJson.data.orderId}`,
                          }),
                        });
                        const balJson = await balRes.json();
                        if (!balRes.ok) throw new Error(balJson.error || "Trừ tiền ví thất bại");

                        // Confirm paid with retry
                        let confirmOk = false;
                        for (let attempt = 0; attempt < 3; attempt++) {
                          try {
                            const cRes = await fetch("/api/orders", {
                              method: "PATCH",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer local-session",
                              },
                              body: JSON.stringify({
                                orderId: orderJson.data.orderId,
                                action: "confirm_paid",
                                reviewer: "wallet",
                              }),
                            });
                            if (cRes.ok) { confirmOk = true; break; }
                          } catch {}
                          if (attempt < 2) await new Promise(r => setTimeout(r, 1000));
                        }

                        // If confirm_paid failed, rollback balance
                        if (!confirmOk) {
                          await fetch("/api/admin/balance", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              email: user?.email,
                              amount: orderJson.data.totalAmount,
                              action: "deposit",
                              note: `Hoàn tiền đơn lỗi ${orderJson.data.orderId}`,
                            }),
                          });
                          throw new Error("Xác nhận thanh toán thất bại. Tiền đã hoàn lại ví.");
                        }

                        localStorage.setItem(
                          "promptvn_pending_purchase_ids",
                          JSON.stringify(items.map((item) => item.prompt.id))
                        );
                        setWalletBalance(balJson.balance);
                        clearCart();
                        window.location.href = `/thanh-toan-thanh-cong?orderId=${orderJson.data.orderId}&method=wallet`;
                        return;
                      }

                      if (paymentMethod === "bank") {
                        localStorage.setItem(
                          "promptvn_pending_purchase_ids",
                          JSON.stringify(items.map((item) => item.prompt.id))
                        );
                        // Lấy tên đăng nhập (bỏ @gmail.com) để admin nhận diện ai CK
                        const loginName = (user?.email || "guest").split("@")[0];
                        const shortOrderId = String(orderJson.data.orderId).slice(0, 8).toUpperCase();
                        const note = `${loginName} ${shortOrderId}`;
                        setCheckoutError(
                          `Đơn hàng đã tạo và chờ duyệt. Vui lòng chuyển khoản ${formatPrice(
                            orderJson.data.totalAmount
                          )} tới ${
                            bankInfo?.bank_name || "ngân hàng đã cấu hình"
                          } - STK ${bankInfo?.bank_account_number || "..."} - ${
                            bankInfo?.bank_account_holder || "..."
                          }. Nội dung CK: "${note}".`
                        );
                        return;
                      }

                      const paymentPath =
                        paymentMethod === "vnpay"
                          ? "/api/payment/vnpay"
                          : "/api/payment/momo";
                      const paymentRes = await fetch(paymentPath, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          orderId: orderJson.data.orderId,
                          amount: orderJson.data.totalAmount,
                          orderInfo: `Thanh toán đơn ${orderJson.data.orderId}`,
                          ipAddr: "127.0.0.1",
                        }),
                      });
                      const paymentJson = await paymentRes.json();
                      if (!paymentRes.ok || !paymentJson?.payUrl) {
                        throw new Error(paymentJson?.error || "Không tạo được link thanh toán");
                      }

                      // Persist pending purchase ids to recover after redirect callback.
                      localStorage.setItem(
                        "promptvn_pending_purchase_ids",
                        JSON.stringify(items.map((item) => item.prompt.id))
                      );
                      window.location.href = paymentJson.payUrl;
                    } catch (error: any) {
                      setCheckoutError(error?.message || "Thanh toán thất bại");
                    } finally {
                      setIsPaying(false);
                    }
                  }}
                  disabled={isPaying}
                  className="w-full mt-4 ui-btn-primary py-3"
                >
                  {isPaying ? "Đang xử lý..." : `Xác nhận thanh toán ${formatPrice(totalPrice)}`}
                </button>
              )}
              {checkoutError && (
                <p className="mt-3 text-xs text-red-600">{checkoutError}</p>
              )}

              <p className="mt-4 text-xs text-slate-400 text-center">
                Bảo mật thanh toán với mã hóa SSL 256-bit
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}