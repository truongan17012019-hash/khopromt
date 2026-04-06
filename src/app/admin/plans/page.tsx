"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { HomepagePricingSection } from "@/data/pricing";
import { defaultHomepagePricingSection } from "@/data/pricing";
import {
  THREE_TIER_IDS,
  THREE_TIER_UI_LABEL,
  homepageCardsFromTiers,
  normalizeOneTimeToThreeTiers,
} from "@/lib/plan-tier-utils";

function perksToText(perks: string[] | undefined): string {
  return Array.isArray(perks) ? perks.join("\n") : "";
}

function textToPerks(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AdminPlansPage() {
  const [oneTimePlans, setOneTimePlans] = useState<any[]>(() => normalizeOneTimeToThreeTiers([]));
  const [homepagePricingSection, setHomepagePricingSection] = useState<HomepagePricingSection>({
    ...defaultHomepagePricingSection,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  /** Cùng nguồn getPlanSettings() như trang chủ — để đối chiếu */
  const [syncMeta, setSyncMeta] = useState<{
    homepageCardCount: number;
    oneTimePlanCount: number;
  } | null>(null);

  const loadPlansFromServer = useCallback(async () => {
    const res = await fetch("/api/admin/plans");
    const json = await res.json();
    if (res.ok && json?.data) {
      setOneTimePlans(normalizeOneTimeToThreeTiers(json.data.oneTimePlans || []));
      const sec = json.data.homepagePricingSection;
      const normalizedLinks =
        Array.isArray(sec?.workflowLinks) && sec.workflowLinks.length > 0
          ? sec.workflowLinks
              .filter((x: any) => x && typeof x.href === "string")
              .map((x: any) => ({
                label: String(x.label || "Link"),
                href: String(x.href),
              }))
          : Array.isArray(sec?.workflowLinks)
            ? []
            : defaultHomepagePricingSection.workflowLinks;

      setHomepagePricingSection({
        eyebrow:
          typeof sec?.eyebrow === "string" ? sec.eyebrow : defaultHomepagePricingSection.eyebrow,
        title: typeof sec?.title === "string" ? sec.title : defaultHomepagePricingSection.title,
        description:
          typeof sec?.description === "string"
            ? sec.description
            : defaultHomepagePricingSection.description,
        workflowLinks: normalizedLinks,
      });
      if (json.meta && typeof json.meta.homepageCardCount === "number") {
        setSyncMeta({
          homepageCardCount: json.meta.homepageCardCount,
          oneTimePlanCount: json.meta.oneTimePlanCount ?? 0,
        });
      }
    }
  }, []);

  useEffect(() => {
    loadPlansFromServer();
  }, [loadPlansFromServer]);

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oneTimePlans: normalizeOneTimeToThreeTiers(oneTimePlans),
          membershipPlans: [],
          homepagePricingSection,
          homepagePricingCards: homepageCardsFromTiers(normalizeOneTimeToThreeTiers(oneTimePlans)),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Save failed");
      setMessage("Đã lưu cấu hình gói và bảng giá trang chủ.");
      await loadPlansFromServer();
    } catch (error: any) {
      setMessage(error?.message || "Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const cardPreview = useMemo(() => homepageCardsFromTiers(oneTimePlans), [oneTimePlans]);

  const quotaSummary = useMemo(() => {
    const a = oneTimePlans[0]?.prompts ?? 0;
    const b = oneTimePlans[1]?.prompts ?? 0;
    const c = oneTimePlans[2]?.prompts ?? 0;
    return { starter: a, pro: b, premium: c };
  }, [oneTimePlans]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Quản lý gói</h1>
        <p className="text-sm text-slate-500 mt-1">
          Ba gói cố định (Starter · Pro · Premium), tiêu đề section trang chủ và gói API/giỏ hàng. Dữ liệu tải
          và lưu qua <code className="text-xs bg-slate-100 px-1 rounded">getPlanSettings</code> giống trang chủ —
          lưu xong, thẻ bảng giá trên home khớp 3 gói bên dưới.
        </p>
        {syncMeta && (
          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900">
            <span className="font-semibold">Đồng bộ trang chủ (sau xử lý DB):</span>{" "}
            <span className="tabular-nums">{syncMeta.homepageCardCount}</span> thẻ bảng giá ·{" "}
            <span className="tabular-nums">{syncMeta.oneTimePlanCount}</span> gói một lần (Starter · Pro · Premium).
          </div>
        )}
      </div>

      <div className="bg-white border rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-slate-900">Bảng giá trang chủ — tiêu đề &amp; link</h2>
        <input
          className="w-full max-w-xl border rounded-lg px-3 py-2 text-sm"
          value={homepagePricingSection.eyebrow}
          onChange={(e) =>
            setHomepagePricingSection((s) => ({ ...s, eyebrow: e.target.value }))
          }
          placeholder="Dòng phụ (eyebrow)"
        />
        <input
          className="w-full max-w-xl border rounded-lg px-3 py-2 text-sm"
          value={homepagePricingSection.title}
          onChange={(e) =>
            setHomepagePricingSection((s) => ({ ...s, title: e.target.value }))
          }
          placeholder="Tiêu đề chính"
        />
        <textarea
          className="w-full max-w-2xl border rounded-lg px-3 py-2 text-sm min-h-[72px]"
          value={homepagePricingSection.description}
          onChange={(e) =>
            setHomepagePricingSection((s) => ({ ...s, description: e.target.value }))
          }
          placeholder="Mô tả ngắn"
        />
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Link workflow (thêm/bớt)</p>
          <div className="space-y-2">
            {homepagePricingSection.workflowLinks.map((link, idx) => (
              <div key={idx} className="flex flex-wrap gap-2 items-center">
                <input
                  className="flex-1 min-w-[140px] border rounded-lg px-2 py-1.5 text-sm"
                  value={link.label}
                  onChange={(e) =>
                    setHomepagePricingSection((s) => {
                      const next = [...s.workflowLinks];
                      next[idx] = { ...next[idx], label: e.target.value };
                      return { ...s, workflowLinks: next };
                    })
                  }
                  placeholder="Nhãn"
                />
                <input
                  className="flex-1 min-w-[180px] border rounded-lg px-2 py-1.5 text-sm"
                  value={link.href}
                  onChange={(e) =>
                    setHomepagePricingSection((s) => {
                      const next = [...s.workflowLinks];
                      next[idx] = { ...next[idx], href: e.target.value };
                      return { ...s, workflowLinks: next };
                    })
                  }
                  placeholder="/duong-dan"
                />
                <button
                  type="button"
                  className="text-sm text-red-600 hover:underline"
                  onClick={() =>
                    setHomepagePricingSection((s) => ({
                      ...s,
                      workflowLinks: s.workflowLinks.filter((_, i) => i !== idx),
                    }))
                  }
                >
                  Xóa
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-sm font-semibold text-brand-600"
              onClick={() =>
                setHomepagePricingSection((s) => ({
                  ...s,
                  workflowLinks: [...s.workflowLinks, { label: "Link mới →", href: "/" }],
                }))
              }
            >
              + Thêm link
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-2xl p-5 space-y-5">
        <div>
          <h2 className="font-semibold text-slate-900">Ba gói bán — đồng bộ trang chủ &amp; giỏ hàng</h2>
          <p className="text-xs text-slate-500 mt-2">
            Luôn đúng 3 SKU: <strong>starter</strong>, <strong>pro</strong>, <strong>premium</strong>. Mỗi cột hiển thị lượt
            prompt của cả ba gói để đối chiếu khi chỉnh. Nhấn <strong>Lưu toàn bộ</strong> — thẻ trang chủ được tạo tự động
            từ các gói này.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-600 mb-2">Xem trước thẻ trang chủ</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {cardPreview.map((card) => (
              <div
                key={String(card.id)}
                className={`rounded-xl border p-3 text-sm ${
                  card.highlight
                    ? "border-brand-400 bg-brand-50/40 ring-1 ring-brand-200"
                    : "border-slate-200 bg-slate-50/50"
                }`}
              >
                <p className="font-semibold text-slate-900">{card.name}</p>
                <p className="text-slate-600 text-xs mt-1 line-clamp-2">{card.tagline}</p>
                {card.perks && card.perks.length > 0 && (
                  <ul className="mt-2 text-[11px] text-slate-600 space-y-0.5 list-disc list-inside line-clamp-3">
                    {card.perks.slice(0, 3).map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                )}
                <p className="tabular-nums text-slate-800 mt-2">
                  {(typeof card.price === "number" ? card.price : Number(card.price) || 0).toLocaleString("vi-VN")} đ
                </p>
                <p className="text-[11px] text-slate-500 mt-1 truncate" title={card.ctaHref || ""}>
                  {card.ctaHref}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {THREE_TIER_IDS.map((tierId, idx) => {
            const plan = oneTimePlans[idx] ?? {};
            const label = THREE_TIER_UI_LABEL[tierId];
            return (
              <div
                key={tierId}
                className={`rounded-2xl border p-4 space-y-3 ${
                  plan.highlight ? "border-brand-300 bg-brand-50/30" : "border-slate-200 bg-white"
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">SKU: {tierId}</p>
                </div>
                <div className="rounded-lg bg-slate-100/90 border border-slate-200 px-2.5 py-2 text-[11px] text-slate-700 leading-relaxed">
                  <span className="font-semibold text-slate-600">Lượt 3 gói:</span> Starter{" "}
                  <span className="tabular-nums font-medium">{quotaSummary.starter}</span>
                  <span className="text-slate-400 mx-1">·</span>
                  Pro <span className="tabular-nums font-medium">{quotaSummary.pro}</span>
                  <span className="text-slate-400 mx-1">·</span>
                  Premium <span className="tabular-nums font-medium">{quotaSummary.premium}</span>
                </div>
                <input
                  className="w-full border rounded-lg px-2 py-1 text-sm"
                  value={plan.name || ""}
                  onChange={(e) =>
                    setOneTimePlans((prev) =>
                      prev.map((p, i) => (i === idx ? { ...p, name: e.target.value } : p))
                    )
                  }
                  placeholder="Tên hiển thị"
                />
                <input
                  type="number"
                  min={0}
                  className="w-full border rounded-lg px-2 py-1 text-sm"
                  value={plan.prompts ?? 0}
                  onChange={(e) =>
                    setOneTimePlans((prev) =>
                      prev.map((p, i) =>
                        i === idx ? { ...p, prompts: Number(e.target.value || 0) } : p
                      )
                    )
                  }
                  placeholder="Số lượt chọn/xem prompt (gói này)"
                />
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Nội dung / gạch đầu dòng (trang chủ)
                  </label>
                  <textarea
                    className="w-full border rounded-lg px-2 py-1.5 text-sm min-h-[88px] font-mono"
                    value={perksToText(plan.perks)}
                    onChange={(e) =>
                      setOneTimePlans((prev) =>
                        prev.map((p, i) =>
                          i === idx ? { ...p, perks: textToPerks(e.target.value) } : p
                        )
                      )
                    }
                    placeholder={"Mỗi dòng một dòng hiển thị dưới mô tả lượt prompt\nVD: Full thư viện theo danh mục"}
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Hiển thị dưới dòng lượt prompt. Để trống = không liệt kê bullet.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min={0}
                    className="border rounded-lg px-2 py-1 text-sm"
                    value={plan.price ?? 0}
                    onChange={(e) =>
                      setOneTimePlans((prev) =>
                        prev.map((p, i) =>
                          i === idx ? { ...p, price: Number(e.target.value || 0) } : p
                        )
                      )
                    }
                    placeholder="Giá"
                  />
                  <input
                    type="number"
                    min={0}
                    className="border rounded-lg px-2 py-1 text-sm"
                    value={plan.originalPrice ?? 0}
                    onChange={(e) =>
                      setOneTimePlans((prev) =>
                        prev.map((p, i) =>
                          i === idx ? { ...p, originalPrice: Number(e.target.value || 0) } : p
                        )
                      )
                    }
                    placeholder="Giá gốc"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!plan.highlight}
                    onChange={(e) =>
                      setOneTimePlans((prev) =>
                        prev.map((p, i) =>
                          i === idx ? { ...p, highlight: e.target.checked } : p
                        )
                      )
                    }
                  />
                  Highlight trên trang chủ
                </label>
                <input
                  className="w-full border rounded-lg px-2 py-1 text-sm"
                  value={plan.cta || ""}
                  onChange={(e) =>
                    setOneTimePlans((prev) =>
                      prev.map((p, i) => (i === idx ? { ...p, cta: e.target.value } : p))
                    )
                  }
                  placeholder="Chữ nút CTA"
                />
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold disabled:opacity-70"
      >
        {saving ? "Đang lưu..." : "Lưu toàn bộ"}
      </button>
      {message && <p className="text-sm text-slate-600">{message}</p>}
    </div>
  );
}
