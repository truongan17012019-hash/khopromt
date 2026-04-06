import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getPlanSettings } from "@/lib/server/plan-settings";
import { grantPlanEntitlementsForOrder, isPlanSkuId } from "@/lib/server/plan-skus";

function normUserId(v: string | null) {
  return String(v || "").trim().toLowerCase();
}

/**
 * GET /api/user/plan-entitlements?userId=email
 */
export async function GET(req: NextRequest) {
  const userId = normUserId(new URL(req.url).searchParams.get("userId"));
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  let supabase: any;
  try {
    supabase = createServerClient();
  } catch {
    return NextResponse.json({
      entitlements: [],
      totalPickSlotsRemaining: 0,
      mock: true,
    });
  }

  const { data: ents, error } = await supabase
    .from("user_plan_entitlements")
    .select("id, plan_sku_id, prompt_quota, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const out: {
    id: string;
    planSkuId: string;
    quota: number;
    used: number;
    remaining: number;
    createdAt: string;
  }[] = [];

  let totalRemaining = 0;

  for (const e of ents || []) {
    const { count, error: cErr } = await supabase
      .from("user_plan_prompt_picks")
      .select("*", { count: "exact", head: true })
      .eq("entitlement_id", e.id);
    if (cErr) continue;
    const used = count ?? 0;
    const quota = Number(e.prompt_quota || 0);
    const remaining = Math.max(0, quota - used);
    totalRemaining += remaining;
    out.push({
      id: e.id,
      planSkuId: e.plan_sku_id,
      quota,
      used,
      remaining,
      createdAt: e.created_at,
    });
  }

  // Self-heal: nếu user có đơn paid chứa plan SKU nhưng entitlement chưa có, tự cấp lại.
  if (out.length === 0) {
    const { data: paidOrders } = await supabase
      .from("orders")
      .select("id,payment_status")
      .eq("user_id", userId)
      .eq("payment_status", "paid");
    const orderIds = (paidOrders || []).map((o: any) => String(o.id || "")).filter(Boolean);
    if (orderIds.length > 0) {
      const { data: orderItems } = await supabase
        .from("order_items")
        .select("order_id,prompt_id")
        .in("order_id", orderIds);
      const byOrder = new Map<string, string[]>();
      for (const item of orderItems || []) {
        const oid = String(item.order_id || "");
        const pid = String(item.prompt_id || "");
        if (!oid || !pid) continue;
        const cur = byOrder.get(oid) || [];
        cur.push(pid);
        byOrder.set(oid, cur);
      }
      const settings = await getPlanSettings();
      for (const oid of orderIds) {
        const planSkus = (byOrder.get(oid) || []).filter((id) => isPlanSkuId(id));
        if (planSkus.length === 0) continue;
        await grantPlanEntitlementsForOrder(supabase, userId, oid, planSkus, settings);
      }

      // Reload sau khi tự sửa
      const { data: ents2 } = await supabase
        .from("user_plan_entitlements")
        .select("id, plan_sku_id, prompt_quota, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });
      const repaired: typeof out = [];
      let repairedTotal = 0;
      for (const e of ents2 || []) {
        const { count } = await supabase
          .from("user_plan_prompt_picks")
          .select("*", { count: "exact", head: true })
          .eq("entitlement_id", e.id);
        const used = count ?? 0;
        const quota = Number(e.prompt_quota || 0);
        const remaining = Math.max(0, quota - used);
        repairedTotal += remaining;
        repaired.push({
          id: e.id,
          planSkuId: e.plan_sku_id,
          quota,
          used,
          remaining,
          createdAt: e.created_at,
        });
      }
      return NextResponse.json({
        entitlements: repaired,
        totalPickSlotsRemaining: repairedTotal,
        repaired: true,
      });
    }
  }

  return NextResponse.json({
    entitlements: out,
    totalPickSlotsRemaining: totalRemaining,
  });
}
