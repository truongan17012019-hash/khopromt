import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { prompts } from "@/data/prompts";
import { isPlanSkuId } from "@/lib/server/plan-skus";
import { ensurePromptExists } from "@/lib/server/order-finalize";

/** Chỉ prompt lẻ trong catalog — không dùng lượt gói để “mở” SKU bundle ảo. */
const allowedPromptIds = new Set(prompts.map((p) => p.id));

function normUserId(v: string | null) {
  return String(v || "").trim().toLowerCase();
}

/**
 * POST /api/user/plan-pick  { userId, promptId }
 * Dùng 1 lượt từ gói plan để mở khóa 1 prompt; ghi user_purchases.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const userId = normUserId(body?.userId);
  const promptId = String(body?.promptId || "").trim();

  if (!userId || !promptId) {
    return NextResponse.json({ error: "Missing userId or promptId" }, { status: 400 });
  }

  if (isPlanSkuId(promptId) || !allowedPromptIds.has(promptId)) {
    return NextResponse.json({ error: "Invalid prompt for plan pick" }, { status: 400 });
  }

  let supabase: any;
  try {
    supabase = createServerClient();
  } catch {
    return NextResponse.json(
      { error: "Supabase not configured — cannot pick on server" },
      { status: 503 }
    );
  }

  await ensurePromptExists(supabase, promptId);

  const { data: existingPurchase } = await supabase
    .from("user_purchases")
    .select("prompt_id")
    .eq("user_id", userId)
    .eq("prompt_id", promptId)
    .maybeSingle();

  if (existingPurchase) {
    return NextResponse.json({ ok: true, alreadyOwned: true });
  }

  const { data: pickDup } = await supabase
    .from("user_plan_prompt_picks")
    .select("id")
    .eq("user_id", userId)
    .eq("prompt_id", promptId)
    .maybeSingle();

  if (pickDup) {
    await supabase.from("user_purchases").upsert(
      { user_id: userId, prompt_id: promptId, order_id: null },
      { onConflict: "user_id,prompt_id" }
    );
    return NextResponse.json({ ok: true, alreadyPicked: true });
  }

  const { data: ents } = await supabase
    .from("user_plan_entitlements")
    .select("id, prompt_quota")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  let chosen: { id: string } | null = null;
  for (const e of ents || []) {
    const { count } = await supabase
      .from("user_plan_prompt_picks")
      .select("*", { count: "exact", head: true })
      .eq("entitlement_id", e.id);
    const used = count ?? 0;
    if (used < Number(e.prompt_quota || 0)) {
      chosen = { id: e.id };
      break;
    }
  }

  if (!chosen) {
    return NextResponse.json(
      { error: "Bạn đã dùng hết lượt chọn prompt từ gói." },
      { status: 403 }
    );
  }

  const { error: insErr } = await supabase.from("user_plan_prompt_picks").insert({
    user_id: userId,
    entitlement_id: chosen.id,
    prompt_id: promptId,
  });

  if (insErr) {
    return NextResponse.json({ error: insErr.message }, { status: 500 });
  }

  await supabase.from("user_purchases").upsert(
    { user_id: userId, prompt_id: promptId, order_id: null },
    { onConflict: "user_id,prompt_id" }
  );

  return NextResponse.json({ ok: true });
}
