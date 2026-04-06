import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { createServerClient } from "@/lib/supabase";
import type { CoursePageSettings, CoursePageStatKey } from "@/data/course-page-marketing";
import { DEFAULT_COURSE_PAGE_SETTINGS } from "@/data/course-page-marketing";

export type { CoursePageSettings, CoursePageStatKey } from "@/data/course-page-marketing";
export { DEFAULT_COURSE_PAGE_SETTINGS } from "@/data/course-page-marketing";

const SETTINGS_KEY = "course_page_marketing";

function isStatKey(v: string): v is CoursePageStatKey {
  return v === "courseCount" || v === "totalLessons" || v === "avgRating" || v === "freeCount";
}

export function normalizeSettings(raw: unknown): CoursePageSettings {
  const d = DEFAULT_COURSE_PAGE_SETTINGS;
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;

  const heroIn = (o.hero || {}) as Record<string, unknown>;
  const hero = {
    badge: typeof heroIn.badge === "string" ? heroIn.badge : d.hero.badge,
    title: typeof heroIn.title === "string" ? heroIn.title : d.hero.title,
    intro: typeof heroIn.intro === "string" ? heroIn.intro : d.hero.intro,
    bullets: Array.isArray(heroIn.bullets)
      ? heroIn.bullets.map((x) => String(x)).filter(Boolean)
      : d.hero.bullets,
    primaryCta: {
      label:
        typeof (heroIn.primaryCta as { label?: string })?.label === "string"
          ? (heroIn.primaryCta as { label: string }).label
          : d.hero.primaryCta.label,
      href:
        typeof (heroIn.primaryCta as { href?: string })?.href === "string"
          ? (heroIn.primaryCta as { href: string }).href
          : d.hero.primaryCta.href,
    },
    secondaryCta: {
      label:
        typeof (heroIn.secondaryCta as { label?: string })?.label === "string"
          ? (heroIn.secondaryCta as { label: string }).label
          : d.hero.secondaryCta.label,
      href:
        typeof (heroIn.secondaryCta as { href?: string })?.href === "string"
          ? (heroIn.secondaryCta as { href: string }).href
          : d.hero.secondaryCta.href,
    },
  };

  let stats = d.stats;
  if (Array.isArray(o.stats) && o.stats.length > 0) {
    stats = o.stats.map((row: Record<string, unknown>, i: number) => {
      const fallback = d.stats[i] || d.stats[0];
      const vk =
        typeof row?.valueKey === "string" && isStatKey(row.valueKey)
          ? row.valueKey
          : fallback.valueKey;
      return {
        label: typeof row?.label === "string" ? row.label : fallback.label,
        sub: typeof row?.sub === "string" ? row.sub : fallback.sub,
        valueKey: vk,
      };
    });
    while (stats.length < 4) stats.push(d.stats[stats.length]);
    stats = stats.slice(0, 4);
  }

  const os = (o.outcomesSection || {}) as Record<string, unknown>;
  const outcomesSection = {
    heading: typeof os.heading === "string" ? os.heading : d.outcomesSection.heading,
    subheading: typeof os.subheading === "string" ? os.subheading : d.outcomesSection.subheading,
  };

  let outcomes = d.outcomes;
  if (Array.isArray(o.outcomes) && o.outcomes.length > 0) {
    outcomes = o.outcomes.map((x: Record<string, unknown>, i: number) => ({
      icon: typeof x?.icon === "string" ? x.icon : d.outcomes[i]?.icon || "brain",
      title: typeof x?.title === "string" ? x.title : d.outcomes[i]?.title || "",
      body: typeof x?.body === "string" ? x.body : d.outcomes[i]?.body || "",
    }));
  }

  const ps = (o.pathsSection || {}) as Record<string, unknown>;
  const pathsSection = {
    eyebrow: typeof ps.eyebrow === "string" ? ps.eyebrow : d.pathsSection.eyebrow,
    title: typeof ps.title === "string" ? ps.title : d.pathsSection.title,
    intro: typeof ps.intro === "string" ? ps.intro : d.pathsSection.intro,
    asideNote: typeof ps.asideNote === "string" ? ps.asideNote : d.pathsSection.asideNote,
  };

  let paths = d.paths;
  if (Array.isArray(o.paths) && o.paths.length > 0) {
    paths = o.paths.map((p: Record<string, unknown>, i: number) => ({
      name: typeof p?.name === "string" ? p.name : d.paths[i]?.name || "",
      desc: typeof p?.desc === "string" ? p.desc : d.paths[i]?.desc || "",
      topics: Array.isArray(p?.topics)
        ? (p.topics as unknown[]).map((t) => String(t)).filter(Boolean)
        : d.paths[i]?.topics || [],
    }));
  }

  const ms = (o.methodSection || {}) as Record<string, unknown>;
  const methodSection = {
    title: typeof ms.title === "string" ? ms.title : d.methodSection.title,
    p1: typeof ms.p1 === "string" ? ms.p1 : d.methodSection.p1,
    p2: typeof ms.p2 === "string" ? ms.p2 : d.methodSection.p2,
    links:
      Array.isArray(ms.links) && ms.links.length > 0
        ? (ms.links as Record<string, unknown>[]).map((l, i) => ({
            label:
              typeof l?.label === "string"
                ? l.label
                : d.methodSection.links[i]?.label || "Link",
            href:
              typeof l?.href === "string" ? l.href : d.methodSection.links[i]?.href || "/",
          }))
        : d.methodSection.links,
  };

  const ab = (o.audienceBox || {}) as Record<string, unknown>;
  const audienceBox = {
    title: typeof ab.title === "string" ? ab.title : d.audienceBox.title,
    lines: Array.isArray(ab.lines)
      ? ab.lines.map((x: unknown) => String(x)).filter(Boolean)
      : d.audienceBox.lines,
    footerHtml:
      typeof ab.footerHtml === "string" ? ab.footerHtml : d.audienceBox.footerHtml,
  };

  const ls = (o.listSection || {}) as Record<string, unknown>;
  const listSection = {
    title: typeof ls.title === "string" ? ls.title : d.listSection.title,
    hint: typeof ls.hint === "string" ? ls.hint : d.listSection.hint,
  };

  const fs = (o.faqSection || {}) as Record<string, unknown>;
  const faqSection = {
    title: typeof fs.title === "string" ? fs.title : d.faqSection.title,
    contactLead: typeof fs.contactLead === "string" ? fs.contactLead : d.faqSection.contactLead,
    contactLabel: typeof fs.contactLabel === "string" ? fs.contactLabel : d.faqSection.contactLabel,
    contactHref: typeof fs.contactHref === "string" ? fs.contactHref : d.faqSection.contactHref,
  };

  let faq = d.faq;
  if (Array.isArray(o.faq) && o.faq.length > 0) {
    faq = o.faq.map((f: Record<string, unknown>) => ({
      q: typeof f?.q === "string" ? f.q : "",
      a: typeof f?.a === "string" ? f.a : "",
    }));
  }

  const ct = (o.cta || {}) as Record<string, unknown>;
  const cta = {
    title: typeof ct.title === "string" ? ct.title : d.cta.title,
    body: typeof ct.body === "string" ? ct.body : d.cta.body,
    primaryLabel: typeof ct.primaryLabel === "string" ? ct.primaryLabel : d.cta.primaryLabel,
    primaryHref: typeof ct.primaryHref === "string" ? ct.primaryHref : d.cta.primaryHref,
    secondaryLabel: typeof ct.secondaryLabel === "string" ? ct.secondaryLabel : d.cta.secondaryLabel,
    secondaryHref: typeof ct.secondaryHref === "string" ? ct.secondaryHref : d.cta.secondaryHref,
  };

  return {
    hero,
    stats,
    outcomesSection,
    outcomes,
    pathsSection,
    paths,
    methodSection,
    audienceBox,
    listSection,
    faqSection,
    faq,
    cta,
  };
}

export const getCoursePageSettings = cache(async (): Promise<CoursePageSettings> => {
  noStore();
  let supabase: ReturnType<typeof createServerClient> | null = null;
  try {
    supabase = createServerClient();
  } catch {
    return DEFAULT_COURSE_PAGE_SETTINGS;
  }

  const { data, error } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", SETTINGS_KEY)
    .maybeSingle();

  if (error || !data?.value) return DEFAULT_COURSE_PAGE_SETTINGS;

  try {
    const parsed = JSON.parse(String(data.value));
    return normalizeSettings(parsed);
  } catch {
    return DEFAULT_COURSE_PAGE_SETTINGS;
  }
});

export async function saveCoursePageSettings(next: CoursePageSettings) {
  const supabase = createServerClient();
  const normalized = normalizeSettings(next);
  const { error } = await supabase.from("app_settings").upsert(
    [{ key: SETTINGS_KEY, value: JSON.stringify(normalized) }],
    { onConflict: "key" }
  );
  if (error) throw new Error(error.message);
}
