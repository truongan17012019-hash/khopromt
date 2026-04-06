"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { bundles, prompts } from "@/data/prompts";
import type { Prompt } from "@/data/prompts";
import { cskhBundlePromptIds, cskhBundleSku, growthBundleSku } from "@/data/pricing";
import { useAuthStore, useCartStore, usePurchaseStore } from "@/lib/store";
import {
  formatPrice,
  getToolColor,
  getDifficultyColor,
  getDiscountPercent,
} from "@/lib/utils";
import PromptCard from "@/components/PromptCard";
import { trackEvent } from "@/lib/tracking";

export default function PromptDetailClientPage({
  prompt,
}: {
  prompt: Prompt;
}) {
  const promptCatalog = [...prompts, growthBundleSku, cskhBundleSku];
  const promptId = prompt.id;
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const user = useAuthStore((s) => s.user);
  const hasPurchased = usePurchaseStore((s) => s.hasPurchased);
  const markPurchased = usePurchaseStore((s) => s.markPurchased);
  const [remotePurchased, setRemotePurchased] = useState(false);
  const [secureFullContent, setSecureFullContent] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [planSlotsRemaining, setPlanSlotsRemaining] = useState(0);
  const [hasPlanEntitlements, setHasPlanEntitlements] = useState(false);
  const [planPickLoading, setPlanPickLoading] = useState(false);
  const [planPickMessage, setPlanPickMessage] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [verifiedReviewCount, setVerifiedReviewCount] = useState(0);

  useEffect(() => {
    if (!isLoggedIn || !user?.email) {
      setRemotePurchased(false);
      return;
    }
    let mounted = true;
    const syncPurchases = async () => {
      try {
        const normalizedEmail = String(user.email || "").trim().toLowerCase();
        const res = await fetch(`/api/orders?userId=${encodeURIComponent(normalizedEmail)}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (!mounted || !res.ok || !Array.isArray(json?.data)) return;
        const paidPromptIds = json.data
          .filter((order: any) => order.payment_status === "paid")
          .flatMap((order: any) =>
            (order.order_items || []).map((item: any) => item.prompt_id)
          )
          .filter(Boolean);
        const purchasedFromServer = Array.isArray(json?.purchased_prompt_ids)
          ? (json.purchased_prompt_ids as string[])
          : [];
        const expandedBundlePromptIds = paidPromptIds.flatMap((id: string) => {
          if (id === cskhBundleSku.id) return cskhBundlePromptIds;
          const matchedBundle = bundles.find((bundle) => bundle.id === id);
          return matchedBundle ? matchedBundle.prompts : [id];
        });
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
        const mergedIds = Array.from(
          new Set([
            ...expandedBundlePromptIds,
            ...inferredBundleIds,
            ...inferredSinglePromptIds,
            ...manualGrantedIds,
            ...purchasedFromServer,
          ])
        );
        if (mergedIds.length) {
          markPurchased(mergedIds);
        }
        if (mounted) {
          setRemotePurchased(mergedIds.includes(promptId));
        }
      } catch {
        if (mounted) {
          setRemotePurchased(false);
        }
      }
    };
    syncPurchases();
    return () => {
      mounted = false;
    };
  }, [isLoggedIn, user?.email, markPurchased, promptId]);

  const isInCart = items.some((item) => item.prompt.id === prompt.id);
  const isPurchased = hasPurchased(prompt.id) || remotePurchased;

  useEffect(() => {
    if (!isLoggedIn || !user?.email) {
      setPlanSlotsRemaining(0);
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
          setPlanSlotsRemaining(Number(json?.totalPickSlotsRemaining || 0));
          setHasPlanEntitlements(Array.isArray(json?.entitlements) && json.entitlements.length > 0);
        }
      } catch {
        if (!cancelled) {
          setPlanSlotsRemaining(0);
          setHasPlanEntitlements(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, user?.email, isPurchased]);

  // BẢO MẬT: Fetch fullContent từ API chỉ khi đã verify purchased
  // Có retry logic: nếu API trả 403 (user_purchases chưa kịp populate), retry tối đa 3 lần
  useEffect(() => {
    if (!isPurchased || !user?.email) return;
    if (secureFullContent) return; // đã fetch rồi
    let mounted = true;
    setLoadingContent(true);
    const fetchContentWithRetry = async (maxRetries = 3) => {
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const res = await fetch(
            `/api/prompts/${promptId}/content?userId=${encodeURIComponent(user.email)}`,
            { cache: "no-store" }
          );
          const json = await res.json();
          if (mounted && res.ok && json.fullContent) {
            setSecureFullContent(json.fullContent);
            return; // success
          }
          // Nếu 403 (chưa có purchase record), retry sau delay
          if (res.status === 403 && attempt < maxRetries) {
            await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
            continue;
          }
        } catch {
          if (attempt < maxRetries) {
            await new Promise((r) => setTimeout(r, 2000));
            continue;
          }
        }
      }
      if (mounted) setLoadingContent(false);
    };
    fetchContentWithRetry().finally(() => {
      if (mounted) setLoadingContent(false);
    });
    return () => { mounted = false; };
  }, [isPurchased, user?.email, promptId, secureFullContent]);
  const related = promptCatalog
    .filter((p) => p.category === prompt.category && p.id !== prompt.id)
    .slice(0, 4);
  const fullPromptForCopy = secureFullContent || prompt.fullContent || "";
  useEffect(() => {
    trackEvent("view_prompt", {
      promptId: prompt.id,
      category: prompt.category,
      price: prompt.price,
      page: "prompt_detail",
    });
  }, [prompt.id, prompt.category, prompt.price]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/reviews?promptId=${encodeURIComponent(prompt.id)}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (!cancelled && res.ok && Array.isArray(json?.data)) {
          setVerifiedReviewCount(
            json.data.filter((r: any) => !!r?.is_verified_purchase).length
          );
        }
      } catch {
        if (!cancelled) setVerifiedReviewCount(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [prompt.id]);

  const detailText = String(prompt.detailDescription || prompt.description || "");
  const detailLines = detailText.split("\n").map((line) => line.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="hero-mlv border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <p className="section-eyebrow text-brand-400 mb-2">Chi tiết Prompt</p>
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-400">
            <Link href="/" className="hover:text-brand-400 transition-colors">
              Trang chủ
            </Link>
            <span className="text-slate-600">/</span>
            <Link href="/danh-muc" className="hover:text-brand-400 transition-colors">
              Danh mục
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-white font-medium line-clamp-2">{prompt.title}</span>
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6">
                {isPurchased && !loadingContent && fullPromptForCopy && (
                  <div className="mb-4 flex justify-end">
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(fullPromptForCopy);
                        setCopiedPrompt(true);
                        setTimeout(() => setCopiedPrompt(false), 1200);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700 text-white hover:bg-slate-600"
                    >
                      {copiedPrompt ? "Đã copy prompt" : "Copy prompt"}
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />

                </div>
                <pre className="font-mono text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                  <span className="text-green-400">
                    {isPurchased ? "// ✅ Prompt đầy đủ - đã mở khóa" : "// Xem trước prompt"}
                  </span>
                  {"\n\n"}
                  {isPurchased ? (
                    loadingContent ? (
                      <span className="text-yellow-400">⏳ Đang tải nội dung đầy đủ...</span>
                    ) : (
                      secureFullContent || "Đang xác thực quyền truy cập..."
                    )
                  ) : (
                    prompt.preview
                  )}
                  {"\n\n"}
                  {!isPurchased && (
                    <span className="text-slate-500">// 🔒 ... phần còn lại chỉ hiển thị khi mua ...</span>
                  )}
                </pre>
              </div>
            </div>
            {isLoggedIn && hasPlanEntitlements && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-900">
                Bạn còn <span className="font-bold">{planSlotsRemaining}</span> lượt chọn prompt từ gói đã thanh toán.
                {!isPurchased && planSlotsRemaining > 0 && (
                  <> Dùng 1 lượt để mở khóa prompt này (miễn phí thêm) thay vì mua lẻ.</>
                )}
                {planSlotsRemaining === 0 && (
                  <> Bạn đã dùng hết lượt gói hiện tại.</>
                )}
              </div>
            )}
            {!isPurchased && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-900">
                Bạn đang xem bản preview. Mua lẻ, hoặc dùng lượt từ gói (nếu có) để xem đầy đủ nội dung.
              </div>
            )}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                Trust block: <span className="font-semibold">{verifiedReviewCount}</span> đánh giá verified purchase cho prompt này.
              </div>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-4">
                Mô tả chi tiết
              </h2>
              <div className="space-y-3 text-slate-700 leading-relaxed">
                {detailLines.map((line, idx) => {
                  const isBullet = line.startsWith("- ");
                  const content = isBullet ? line.slice(2) : line;
                  const isMini = /^Mini input:|^Mini output:/i.test(content);
                  const isCta = /^Dùng ngay prompt/i.test(content);
                  const isLeadParagraph = idx === 0 && !isBullet && !isMini && !isCta;

                  if (isBullet) {
                    return (
                      <div key={`${idx}-${content}`} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-600 shrink-0" />
                        <p className="text-slate-700">{content}</p>
                      </div>
                    );
                  }

                  if (isMini) {
                    const [label, ...rest] = content.split(":");
                    return (
                      <div
                        key={`${idx}-${content}`}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                      >
                        <span className="font-semibold text-slate-900">{label}:</span>{" "}
                        <span className="text-slate-700">{rest.join(":").trim()}</span>
                      </div>
                    );
                  }

                  if (isCta) {
                    return (
                      <p
                        key={`${idx}-${content}`}
                        className="rounded-xl bg-brand-50 border border-brand-100 px-3 py-2 font-semibold text-brand-800"
                      >
                        {content}
                      </p>
                    );
                  }

                  return (
                    <p
                      key={`${idx}-${content}`}
                      className={
                        isLeadParagraph
                          ? "text-slate-900 font-semibold text-[17px] leading-8"
                          : "text-slate-700"
                      }
                    >
                      {content}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-900/5 p-6 sticky top-24">
              <h1 className="font-display text-2xl font-bold text-slate-900">{prompt.title}</h1>

              <div className="flex items-center gap-2 mt-3">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getToolColor(prompt.tool)}`}>
                  {prompt.tool === "chatgpt" ? "ChatGPT" : prompt.tool === "claude" ? "Claude" : prompt.tool}
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getDifficultyColor(prompt.difficulty)}`}>
                  {prompt.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-4 text-sm text-slate-500">
                <span>{prompt.rating}</span>
                <span>{prompt.reviewCount} đánh giá</span>
                <span>{prompt.sold} đã bán</span>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold text-brand-700">
                    {formatPrice(prompt.price)}
                  </span>
                  {prompt.originalPrice && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-slate-400 line-through">
                        {formatPrice(prompt.originalPrice)}
                      </span>
                      <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">
                        -{getDiscountPercent(prompt.price, prompt.originalPrice)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {isPurchased ? (
                <div className="w-full mt-4 py-3 rounded-xl font-bold text-base text-center bg-green-100 text-green-700">
                  Bạn đã sở hữu prompt này
                </div>
              ) : (
                <>
                  {isLoggedIn && planSlotsRemaining > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!user?.email || planPickLoading) return;
                          setPlanPickMessage(null);
                          setPlanPickLoading(true);
                          try {
                            const res = await fetch("/api/user/plan-pick", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                userId: String(user.email).trim().toLowerCase(),
                                promptId,
                              }),
                            });
                            const json = await res.json().catch(() => ({}));
                            if (!res.ok) {
                              throw new Error(json?.error || "Không mở khóa được");
                            }
                            markPurchased([promptId]);
                            setRemotePurchased(true);
                            const entRes = await fetch(
                              `/api/user/plan-entitlements?userId=${encodeURIComponent(
                                String(user.email).trim().toLowerCase()
                              )}`,
                              { cache: "no-store" }
                            );
                            const entJson = await entRes.json().catch(() => ({}));
                            if (entRes.ok) {
                              setPlanSlotsRemaining(
                                Number(entJson?.totalPickSlotsRemaining || 0)
                              );
                            }
                          } catch (e: any) {
                            setPlanPickMessage(e?.message || "Lỗi mở khóa");
                          } finally {
                            setPlanPickLoading(false);
                          }
                        }}
                        disabled={planPickLoading}
                        className="w-full mt-4 py-3 rounded-xl font-bold text-base transition-all bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60"
                      >
                        {planPickLoading
                          ? "Đang mở khóa…"
                          : `Mở khóa bằng gói (còn ${planSlotsRemaining} lượt)`}
                      </button>
                      {planPickMessage && (
                        <p className="mt-2 text-xs text-red-600">{planPickMessage}</p>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => addItem(prompt)}
                    disabled={isInCart}
                    className={`w-full mt-4 py-3 rounded-xl font-bold text-base transition-all ${
                      isInCart
                        ? "bg-slate-100 text-slate-400 cursor-default"
                        : "bg-brand-600 text-white hover:bg-brand-700"
                    }`}
                  >
                    {isInCart ? "Đã có trong giỏ hàng" : "Thêm vào giỏ hàng"}
                  </button>

                  {!isInCart && (
                    <Link
                      href={isLoggedIn ? "/gio-hang" : "/dang-nhap"}
                      onClick={() => addItem(prompt)}
                      className="block w-full mt-2 py-3 rounded-xl font-bold text-base text-center border-2 border-brand-600 text-brand-600 hover:bg-brand-50 transition-all"
                    >
                      {isLoggedIn ? "Mua ngay" : "Đăng nhập để mua"}
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">
              Prompt liên quan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <PromptCard key={p.id} prompt={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
