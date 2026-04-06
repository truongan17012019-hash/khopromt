import type { HomepagePricingPlan, OneTimePlan } from "@/data/pricing";

/** Ba gói cố định: Cơ bản → Nâng cao → Vĩnh viễn (SKU / giỏ hàng). */
export const THREE_TIER_IDS = ["starter", "pro", "premium"] as const;
export type ThreeTierId = (typeof THREE_TIER_IDS)[number];

export const THREE_TIER_UI_LABEL: Record<ThreeTierId, string> = {
  starter: "Cơ bản (Starter)",
  pro: "Nâng cao (Pro)",
  premium: "Vĩnh viễn (Premium)",
};

function normalizePerksList(raw: unknown, fallback: string[]): string[] {
  if (Array.isArray(raw)) {
    return raw.map((x) => String(x).trim()).filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [...fallback];
}

const DEFAULT_THREE: OneTimePlan[] = [
  {
    id: "starter",
    name: "Cơ bản (Starter)",
    prompts: 25,
    price: 199000,
    originalPrice: 299000,
    cta: "Chọn gói Cơ bản",
    highlight: false,
    perks: ["Lượt xem/chọn prompt theo gói", "Phù hợp dùng thử & dự án nhỏ"],
  },
  {
    id: "pro",
    name: "Nâng cao (Pro)",
    prompts: 80,
    price: 449000,
    originalPrice: 699000,
    cta: "Chọn gói Nâng cao",
    highlight: true,
    perks: ["Nhiều lượt hơn cho team nhỏ", "Ưu tiên nội dung & workflow hot"],
  },
  {
    id: "premium",
    name: "Vĩnh viễn (Premium)",
    prompts: 500,
    price: 1299000,
    originalPrice: 1999000,
    cta: "Mua gói Vĩnh viễn",
    highlight: false,
    perks: ["Một lần mua — dùng lâu dài", "Lượt lớn, phù hợp agency / power user"],
  },
];

/** Chuẩn hóa về đúng 3 tier; `growth` cũ gộp vào `pro` nếu chưa có pro. */
export function normalizeOneTimeToThreeTiers(raw: Partial<OneTimePlan>[]): OneTimePlan[] {
  const list = Array.isArray(raw) ? raw : [];
  const byId = new Map(list.map((p) => [String(p.id || "").trim(), p]));

  return THREE_TIER_IDS.map((id, i) => {
    const base = DEFAULT_THREE[i];
    let found = byId.get(id) as Partial<OneTimePlan> | undefined;
    if (!found && id === "pro" && byId.get("growth")) {
      const g = byId.get("growth")!;
      found = { ...g, id: "pro" };
    }
    if (!found) {
      return { ...base };
    }
    const basePerks = base.perks ?? [];
    return {
      ...base,
      ...found,
      id,
      name: String(found.name || base.name),
      prompts: Math.max(0, Number(found.prompts) || base.prompts),
      price: Math.max(0, Number(found.price) || base.price),
      originalPrice: Math.max(0, Number(found.originalPrice ?? found.price) || base.originalPrice),
      cta: String(found.cta || base.cta),
      highlight: !!found.highlight,
      perks: normalizePerksList(found.perks, basePerks),
    };
  });
}

/** Thẻ trang chủ — luôn 3 thẻ, đồng bộ SKU với `oneTimePlans`. */
export function homepageCardsFromTiers(plans: OneTimePlan[]): HomepagePricingPlan[] {
  return plans.map((p) => {
    const pid = encodeURIComponent(String(p.id || "").trim() || "goi");
    const n = Number(p.prompts) || 0;
    return {
      id: p.id,
      kind: "one_time",
      name: p.name,
      tagline:
        p.id === "premium"
          ? `${n} lượt chọn prompt — gói vĩnh viễn`
          : `${n} lượt chọn prompt`,
      highlight: !!p.highlight,
      badge: p.highlight ? "Phổ biến" : "",
      cta: p.cta,
      ctaHref: `/gio-hang?plan=${pid}`,
      prompts: p.prompts,
      price: p.price,
      originalPrice: p.originalPrice,
      perks: p.perks && p.perks.length > 0 ? p.perks : undefined,
    };
  });
}
