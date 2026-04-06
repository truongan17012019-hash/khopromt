import type { PlanSettingsPayload } from "@/lib/server/plan-settings";
import { getPlanSettings } from "@/lib/server/plan-settings";

export function toPlanSkuId(planRowId: string): string {
  const id = String(planRowId || "").trim();
  if (!id) return "";
  return id.startsWith("plan-") ? id : `plan-${id}`;
}

export function stripPlanSkuPrefix(planSkuId: string): string {
  return String(planSkuId || "").replace(/^plan-/i, "");
}

export function isPlanSkuId(promptOrSkuId: string | undefined | null): boolean {
  return String(promptOrSkuId || "").startsWith("plan-");
}

export function resolvePlanQuota(
  planSkuId: string,
  settings: PlanSettingsPayload
): number {
  const raw = stripPlanSkuPrefix(planSkuId);
  const ot = settings.oneTimePlans.find((p) => p.id === raw);
  if (ot) return Math.max(0, Number(ot.prompts) || 0);
  const mem = settings.membershipPlans.find((p) => p.id === raw);
  if (mem) return Math.max(0, Number(mem.monthlyPrompts) || 0);
  return 0;
}

export async function ensurePlanSkusInSupabase(supabase: any, settings?: PlanSettingsPayload) {
  const s = settings ?? (await getPlanSettings());
  const rows: any[] = [];
  for (const p of s.oneTimePlans) {
    const id = toPlanSkuId(p.id);
    rows.push({
      id,
      slug: id,
      title: `${p.name} — ${p.prompts} lượt chọn prompt`,
      description: `Gói một lần: sau khi thanh toán, bạn được chọn ${p.prompts} prompt bất kỳ trong danh mục để mở khóa đầy đủ.`,
      price: p.price,
      original_price: p.originalPrice ?? p.price,
      category_id: "ban-hang",
      tool_id: "chatgpt",
      rating: 5,
      review_count: 0,
      sold: 0,
      preview: `Mua gói để nhận ${p.prompts} lượt mở khóa prompt.`,
      full_content: "Đây là sản phẩm gói — hãy vào từng prompt trong danh mục và nhấn Mở khóa bằng gói.",
      tags: ["plan", "goi-mot-lan"],
      difficulty: "Trung bình",
      author_name: "PromptVN",
      image_url: null,
      is_active: true,
    });
  }
  for (const m of s.membershipPlans) {
    const id = toPlanSkuId(m.id);
    rows.push({
      id,
      slug: id,
      title: `${m.name} — ${m.monthlyPrompts} lượt/thanh toán`,
      description: `Membership: mỗi lần thanh toán gói này, bạn nhận ${m.monthlyPrompts} lượt chọn prompt (cấu hình trong Admin).`,
      price: m.monthlyPrice,
      original_price: m.yearlyPrice ?? m.monthlyPrice,
      category_id: "ban-hang",
      tool_id: "chatgpt",
      rating: 5,
      review_count: 0,
      sold: 0,
      preview: `Thành viên: ${m.monthlyPrompts} lượt chọn prompt theo chu kỳ đơn hàng.`,
      full_content: "Đây là sản phẩm membership — chọn prompt trong danh mục để mở khóa bằng lượt gói.",
      tags: ["plan", "membership"],
      difficulty: "Trung bình",
      author_name: "PromptVN",
      image_url: null,
      is_active: true,
    });
  }
  for (const row of rows) {
    await supabase.from("prompts").upsert(row, { onConflict: "id" });
  }
}

export async function grantPlanEntitlementsForOrder(
  supabase: any,
  userId: string,
  orderId: string,
  planSkuIds: string[],
  settings?: PlanSettingsPayload
) {
  const s = settings ?? (await getPlanSettings());
  const skus = planSkuIds.filter((id) => isPlanSkuId(id));
  if (!skus.length) return;

  const { data: existing } = await supabase
    .from("user_plan_entitlements")
    .select("id")
    .eq("order_id", orderId);
  const already = existing?.length || 0;
  if (already >= skus.length) return;

  for (const sku of skus.slice(already)) {
    const quota = resolvePlanQuota(sku, s);
    if (quota <= 0) continue;
    await supabase.from("user_plan_entitlements").insert({
      user_id: userId,
      plan_sku_id: sku,
      prompt_quota: quota,
      order_id: orderId,
    });
  }
}
