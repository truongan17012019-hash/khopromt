import { unstable_noStore as noStore } from "next/cache";
import { createServerClient } from "@/lib/supabase";

export interface SpecialBundle {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  promptCount: number;
  tags: string[];
  ctaText: string;
  ctaLink: string;
  secondaryText: string;
  secondaryLink: string;
  badgeText: string;
  enabled: boolean;
  order: number;
}

const DB_KEY = "special_bundles";

export function defaultSalesBundle(): SpecialBundle {
  return {
    id: "sales-bundle",
    name: "Sát Thủ Bán Hàng",
    subtitle: "Trọn bộ 50 Prompt Coach Bán Hàng Ảo",
    description:
      "Từ thấu hiểu khách hàng, phá băng, xử lý từ chối, đến chốt đơn và chăm sóc sau bán. Dành cho chủ shop, sale, freelancer.",
    price: 499000,
    originalPrice: 1450000,
    discount: 66,
    promptCount: 50,
    tags: ["Thấu hiểu khách", "Phá băng", "Xử lý từ chối", "Chốt đơn", "Chăm sóc"],
    ctaText: "Mua trọn bộ ngay",
    ctaLink: "/gio-hang?sku=sales-bundle&source=homepage",
    secondaryText: "Xem chi tiết 50 prompt →",
    secondaryLink: "/danh-muc/ban-hang",
    badgeText: "Mới — Gói chuyên biệt",
    enabled: true,
    order: 0,
  };
}

export async function getBundles(): Promise<SpecialBundle[]> {
  noStore();
  let supabase: any = null;
  try {
    supabase = createServerClient();
  } catch {
    return [defaultSalesBundle()];
  }

  const { data, error } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", DB_KEY)
    .maybeSingle();

  if (error) {
    console.warn("[getBundles]", error.message);
    return [defaultSalesBundle()];
  }

  if (!data?.value || String(data.value).trim() === "") {
    return [defaultSalesBundle()];
  }

  try {
    const parsed = JSON.parse(String(data.value));
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [defaultSalesBundle()];
    }
    return parsed as SpecialBundle[];
  } catch {
    return [defaultSalesBundle()];
  }
}

export async function saveBundles(bundles: SpecialBundle[]): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase.from("app_settings").upsert(
    [{ key: DB_KEY, value: JSON.stringify(bundles) }],
    { onConflict: "key" }
  );
  if (error) throw new Error(error.message);
}
