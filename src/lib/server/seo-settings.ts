import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { createServerClient } from "@/lib/supabase";

export interface SeoSettings {
  site_name: string;
  base_url: string;
  default_title: string;
  default_description: string;
  default_og_image: string;
  google_verification: string;
}

export const DEFAULT_SEO_SETTINGS: SeoSettings = {
  site_name: "PromptVN",
  base_url: "https://khopromt.pro",
  default_title: "PromptVN - Mua bán Prompt AI hàng đầu Việt Nam",
  default_description:
    "Khám phá 600+ prompt AI chất lượng cao cho ChatGPT, Claude, Midjourney, DALL-E.",
  default_og_image: "/og-image.jpg",
  google_verification: "",
};

function sanitizeUrl(input?: string) {
  if (!input) return DEFAULT_SEO_SETTINGS.base_url;
  try {
    const url = new URL(input);
    return `${url.protocol}//${url.host}`;
  } catch {
    return DEFAULT_SEO_SETTINGS.base_url;
  }
}

export const getSeoSettings = cache(async (): Promise<SeoSettings> => {
  noStore();
  let supabase: any = null;
  try {
    supabase = createServerClient();
  } catch {
    return DEFAULT_SEO_SETTINGS;
  }

  const keys = [
    "seo_site_name",
    "seo_base_url",
    "seo_default_title",
    "seo_default_description",
    "seo_default_og_image",
    "seo_google_verification",
  ];

  const { data, error } = await supabase
    .from("app_settings")
    .select("key, value")
    .in("key", keys);

  if (error || !data) return DEFAULT_SEO_SETTINGS;

  const merged = { ...DEFAULT_SEO_SETTINGS };
  for (const row of data) {
    if (row.key === "seo_site_name" && row.value) merged.site_name = row.value;
    if (row.key === "seo_base_url" && row.value) merged.base_url = sanitizeUrl(row.value);
    if (row.key === "seo_default_title" && row.value) merged.default_title = row.value;
    if (row.key === "seo_default_description" && row.value) {
      merged.default_description = row.value;
    }
    if (row.key === "seo_default_og_image" && row.value) {
      merged.default_og_image = row.value;
    }
    if (row.key === "seo_google_verification") {
      merged.google_verification = row.value || "";
    }
  }
  return merged;
});

export async function saveSeoSettings(next: SeoSettings) {
  const supabase = createServerClient();
  const payload = [
    { key: "seo_site_name", value: next.site_name },
    { key: "seo_base_url", value: sanitizeUrl(next.base_url) },
    { key: "seo_default_title", value: next.default_title },
    { key: "seo_default_description", value: next.default_description },
    { key: "seo_default_og_image", value: next.default_og_image },
    { key: "seo_google_verification", value: next.google_verification || "" },
  ];

  const { error } = await supabase.from("app_settings").upsert(payload, {
    onConflict: "key",
  });
  if (error) throw new Error(error.message);
}

export async function getCategorySeoOverrides(): Promise<Record<string, { title?: string; description?: string }>> {
  let supabase: any = null;
  try {
    supabase = createServerClient();
  } catch {
    return {};
  }
  const { data } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "seo_category_overrides")
    .single();
  try {
    return data?.value ? JSON.parse(data.value) : {};
  } catch {
    return {};
  }
}

export async function saveCategorySeoOverrides(
  value: Record<string, { title?: string; description?: string }>
) {
  const supabase = createServerClient();
  const { error } = await supabase.from("app_settings").upsert(
    [{ key: "seo_category_overrides", value: JSON.stringify(value || {}) }],
    { onConflict: "key" }
  );
  if (error) throw new Error(error.message);
}
