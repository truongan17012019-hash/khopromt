import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { prompts } from "@/data/prompts";
import { cskhBundlePromptIds, cskhBundleSku, salesBundleSku, growthBundleSku } from "@/data/pricing";
import { bundles } from "@/data/prompts";

const promptCatalog = [...prompts, growthBundleSku, cskhBundleSku, salesBundleSku];

/**
 * GET /api/prompts/[id]/content?userId=email
 * BẢO MẬT: Chỉ trả fullContent khi user đã thanh toán (paid) prompt này.
 * Verify qua Supabase: user_purchases table + order_items fallback.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const promptId = params.id;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const normalizedUserId = String(userId || "").trim().toLowerCase();

  if (!normalizedUserId) {
    return NextResponse.json(
      { error: "Unauthorized: missing userId" },
      { status: 401 }
    );
  }

  // --- Verify purchase qua Supabase ---
  let supabase: any = null;
  try {
    supabase = createServerClient();
  } catch {
    // Supabase chưa config → fallback cho dev: trả fullContent từ local data
    const localPrompt = promptCatalog.find((p) => p.id === promptId);
    if (!localPrompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }
    return NextResponse.json({ fullContent: localPrompt.fullContent });
  }

  // 1. Check bảng user_purchases (source of truth)
  const { data: directPurchase } = await supabase
    .from("user_purchases")
    .select("prompt_id")
    .ilike("user_id", normalizedUserId)
    .eq("prompt_id", promptId)
    .maybeSingle();

  let isPurchased = !!directPurchase;

  if (!isPurchased) {
    const { data: planPick, error: pickErr } = await supabase
      .from("user_plan_prompt_picks")
      .select("id")
      .ilike("user_id", normalizedUserId)
      .eq("prompt_id", promptId)
      .maybeSingle();
    if (!pickErr && planPick) isPurchased = true;
  }

  // 2. Nếu chưa tìm thấy, check qua order_items + orders (paid)
  if (!isPurchased) {
    const { data: orders } = await supabase
      .from("orders")
      .select("id, total_amount, payment_status")
      .ilike("user_id", normalizedUserId)
      .eq("payment_status", "paid");

    if (orders && orders.length > 0) {
      const orderIds = orders.map((o: any) => o.id);
      const { data: items } = await supabase
        .from("order_items")
        .select("prompt_id")
        .in("order_id", orderIds);

      const paidPromptIds = (items || []).map((i: any) => String(i.prompt_id || ""));

      // Expand bundle purchases
      const expandedIds = paidPromptIds.flatMap((id: string) => {
        if (id === cskhBundleSku.id) return cskhBundlePromptIds;
        const matchedBundle = bundles.find((b) => b.id === id);
        return matchedBundle ? matchedBundle.prompts : [id];
      });

      isPurchased = expandedIds.includes(promptId);

      // 3. Fallback: infer prompt từ order amount khi order_items rỗng
      if (!isPurchased) {
        const promptPriceMap = new Map<number, string[]>();
        for (const p of promptCatalog) {
          const price = Number(p.price || 0);
          const current = promptPriceMap.get(price) || [];
          current.push(p.id);
          promptPriceMap.set(price, current);
        }

        for (const order of orders) {
          const hasItems = (items || []).some(
            (i: any) => orderIds.includes(order.id)
          );
          if (hasItems) continue;
          const amount = Number(order.total_amount || 0);
          const candidates = promptPriceMap.get(amount) || [];
          if (candidates.length === 1 && candidates[0] === promptId) {
            isPurchased = true;
            break;
          }
          // Check bundle price match
          if (amount === growthBundleSku.price && promptId === growthBundleSku.id) {
            isPurchased = true;
            break;
          }
          if (amount === cskhBundleSku.price && cskhBundlePromptIds.includes(promptId)) {
            isPurchased = true;
            break;
          }
        }
      }

      // 4. Fallback: check review notes cho manual grant
      if (!isPurchased) {
        const { data: reviewLogs } = await supabase
          .from("order_review_logs")
          .select("note")
          .in("order_id", orderIds);
        for (const log of reviewLogs || []) {
          const note = String(log?.note || "");
          const match = note.match(/(?:manual grant prompt|auto repair prompt)\s+([a-z0-9-]+)/i);
          if (
            match?.[1] === promptId ||
            (match?.[1] === cskhBundleSku.id && cskhBundlePromptIds.includes(promptId))
          ) {
            isPurchased = true;
            break;
          }
        }
      }
    }
  }

  if (!isPurchased) {
    return NextResponse.json(
      { error: "Forbidden: you have not purchased this prompt" },
      { status: 403 }
    );
  }

  // --- Đã verify: trả fullContent ---
  // Ưu tiên lấy từ Supabase DB, fallback về local data
  const { data: dbPrompt } = await supabase
    .from("prompts")
    .select("full_content")
    .eq("id", promptId)
    .maybeSingle();

  const dbFullContent = dbPrompt?.full_content || "";
  const localPrompt = promptCatalog.find((p) => p.id === promptId);
  const localFullContent = localPrompt?.fullContent || "";

  // Dùng DB nếu có nội dung thật, không thì dùng local
  const fullContent = (dbFullContent && !dbFullContent.includes("chỉ hiển thị"))
    ? dbFullContent
    : localFullContent;

  return NextResponse.json({ fullContent });
}
