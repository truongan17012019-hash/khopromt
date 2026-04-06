import { unstable_noStore as noStore } from "next/cache";
import { createServerClient } from "@/lib/supabase";
import {
  oneTimePlans,
  type MembershipPlan,
  type OneTimePlan,
  type HomepagePricingPlan,
  type HomepagePricingSection,
  defaultHomepagePricingSection,
} from "@/data/pricing";
import { homepageCardsFromTiers, normalizeOneTimeToThreeTiers } from "@/lib/plan-tier-utils";

export type PlanSettingsPayload = {
  oneTimePlans: OneTimePlan[];
  membershipPlans: MembershipPlan[];
  homepagePricingCards: HomepagePricingPlan[];
  homepagePricingSection: HomepagePricingSection;
};

/** Khi không có bản ghi / lỗi đọc DB — trả đúng 3 SKU + thẻ trang chủ khớp (cùng logic admin). */
function emptyPlanSettings(): PlanSettingsPayload {
  const ot = normalizeOneTimeToThreeTiers([]);
  return {
    oneTimePlans: ot,
    membershipPlans: [],
    homepagePricingCards: homepageCardsFromTiers(ot),
    homepagePricingSection: { ...defaultHomepagePricingSection },
  };
}

function plansArrayFromDb<T>(parsed: Record<string, unknown>, key: string, codeFallback: T[]): T[] {
  if (!Object.prototype.hasOwnProperty.call(parsed, key)) {
    return codeFallback;
  }
  const v = parsed[key];
  if (!Array.isArray(v)) {
    return codeFallback;
  }
  return v as T[];
}

function normalizeSection(raw: unknown): HomepagePricingSection {
  const d = defaultHomepagePricingSection;
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  const links = Array.isArray(o.workflowLinks)
    ? o.workflowLinks
        .filter((x: any) => x && typeof x.href === "string")
        .map((x: any) => ({ label: String(x.label || "Link"), href: String(x.href) }))
    : d.workflowLinks;
  return {
    eyebrow: typeof o.eyebrow === "string" ? o.eyebrow : d.eyebrow,
    title: typeof o.title === "string" ? o.title : d.title,
    description: typeof o.description === "string" ? o.description : d.description,
    workflowLinks: links,
  };
}

function resolveHomepageSection(
  parsed: Record<string, unknown>,
  cards: HomepagePricingPlan[]
): HomepagePricingSection {
  const empty: HomepagePricingSection = {
    eyebrow: "",
    title: "",
    description: "",
    workflowLinks: [],
  };
  if (Object.prototype.hasOwnProperty.call(parsed, "homepagePricingSection")) {
    return normalizeSection(parsed.homepagePricingSection);
  }
  if (cards.length > 0) {
    return { ...defaultHomepagePricingSection };
  }
  return empty;
}

export async function getPlanSettings(): Promise<PlanSettingsPayload> {
  noStore();

  let supabase: any = null;
  try {
    supabase = createServerClient();
  } catch {
    return emptyPlanSettings();
  }

  const { data, error } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "pricing_plans")
    .maybeSingle();

  if (error) {
    console.warn("[getPlanSettings] pricing_plans:", error.message);
    return emptyPlanSettings();
  }

  if (!data?.value || String(data.value).trim() === "") {
    return emptyPlanSettings();
  }

  try {
    const parsed = JSON.parse(String(data.value));
    if (!parsed || typeof parsed !== "object") {
      return emptyPlanSettings();
    }
    if (Object.keys(parsed).length === 0) {
      return emptyPlanSettings();
    }

    const p = parsed as Record<string, unknown>;
    const otRaw = plansArrayFromDb(p, "oneTimePlans", oneTimePlans);
    const ot = normalizeOneTimeToThreeTiers(otRaw);
    const cards = homepageCardsFromTiers(ot);
    const section = resolveHomepageSection(p, cards);

    return {
      oneTimePlans: ot,
      membershipPlans: [],
      homepagePricingCards: cards,
      homepagePricingSection: section,
    };
  } catch {
    return emptyPlanSettings();
  }
}

export async function savePlanSettings(payload: Partial<PlanSettingsPayload> & {
  oneTimePlans?: OneTimePlan[];
  membershipPlans?: MembershipPlan[];
}) {
  const current = await getPlanSettings();
  const rawOne = payload.oneTimePlans ?? current.oneTimePlans;
  const oneNorm = normalizeOneTimeToThreeTiers(Array.isArray(rawOne) ? rawOne : []);
  const tierCards = homepageCardsFromTiers(oneNorm);

  const next: PlanSettingsPayload = {
    oneTimePlans: oneNorm,
    membershipPlans: [],
    homepagePricingCards: tierCards,
    homepagePricingSection: payload.homepagePricingSection ?? current.homepagePricingSection,
  };

  const supabase = createServerClient();
  const { error } = await supabase.from("app_settings").upsert(
    [{ key: "pricing_plans", value: JSON.stringify(next) }],
    { onConflict: "key" }
  );
  if (error) throw new Error(error.message);
}
