import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getPaymentSettings } from "@/lib/server/payment-settings";
import { prompts } from "@/data/prompts";
import { cskhBundlePromptIds, cskhBundleSku, salesBundleSku, growthBundleSku } from "@/data/pricing";
import {
  ensurePromptExists,
  ensureBundlePromptExists,
  finalizePaidOrder,
} from "@/lib/server/order-finalize";
import { isPlanSkuId, ensurePlanSkusInSupabase } from "@/lib/server/plan-skus";

const promptCatalog = [...prompts, growthBundleSku, cskhBundleSku, salesBundleSku];
const promptIdsByPrice = promptCatalog.reduce((acc, prompt) => {
  const price = Number(prompt.price || 0);
  const current = acc.get(price) || [];
  current.push(prompt.id);
  acc.set(price, current);
  return acc;
}, new Map<number, string[]>());

function inferPromptIdByReviewNote(note: string | null | undefined): string | null {
  const value = String(note || "");
  const match = value.match(/(?:manual grant prompt|auto repair prompt)\s+([a-z0-9-]+)/i);
  return match?.[1] || null;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, items, paymentMethod, couponCode } = body;
  const normalizedUserId = String(userId || "").trim().toLowerCase();
  const paymentSettings = await getPaymentSettings();

  if (!normalizedUserId || !items?.length || !paymentMethod) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  let supabase: any = null;
  try {
    supabase = createServerClient();
  } catch {
    // Local/demo mode without Supabase config: create lightweight order response.
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + Number(item.price || 0),
      0
    );
    const mockStatus = paymentMethod === "bank" ? "awaiting_review" : "pending";
    return NextResponse.json({
      data: {
        orderId: `LOCAL-${Date.now()}`,
        totalAmount,
        paymentMethod,
        paymentStatus: mockStatus,
        bankInfo: paymentMethod === "bank" ? paymentSettings : null,
        isMock: true,
      },
    });
  }

  if (
    items.some((item: any) =>
      [growthBundleSku.id, cskhBundleSku.id].includes(String(item.promptId || ""))
    )
  ) {
    await ensureBundlePromptExists(supabase);
  }
  if (items.some((item: any) => isPlanSkuId(String(item.promptId || "")))) {
    await ensurePlanSkusInSupabase(supabase);
  }
  for (const item of items) {
    await ensurePromptExists(supabase, String(item.promptId || ""));
  }

  // Resolve items and calculate total (supports SKU not in prompts table, e.g. bundles)
  const promptIds = items.map((item: any) => item.promptId);
  const { data: dbPromptRows, error: promptError } = await supabase
    .from("prompts")
    .select("id, price")
    .in("id", promptIds);

  if (promptError) {
    return NextResponse.json({ error: "Cannot resolve items" }, { status: 400 });
  }
  const promptPriceMap = new Map<string, number>(
    (dbPromptRows || []).map((p: any) => [p.id, Number(p.price || 0)])
  );
  const resolvedItems = items.map((item: any) => {
    const id = String(item.promptId || "");
    const fallbackPrice = Number(item.price || 0);
    const dbPrice = promptPriceMap.get(id);
    return {
      promptId: id,
      price: typeof dbPrice === "number" ? dbPrice : fallbackPrice,
      existsInDb: promptPriceMap.has(id),
    };
  });

  let totalAmount = resolvedItems.reduce(
    (sum: number, item: any) => sum + Number(item.price || 0),
    0
  );
  let discountAmount = 0;

  // Apply coupon if provided
  if (couponCode) {
    const { data: coupon } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", couponCode)
      .eq("is_active", true)
      .single();

    if (coupon && (!coupon.expires_at || new Date(coupon.expires_at) > new Date())) {
      if (coupon.max_uses > 0 && coupon.used_count >= coupon.max_uses) {
        return NextResponse.json({ error: "Coupon exhausted" }, { status: 400 });
      }
      if (totalAmount >= coupon.min_order_amount) {
        discountAmount = coupon.discount_type === "percent"
          ? Math.round(totalAmount * coupon.discount_value / 100)
          : coupon.discount_value;
        discountAmount = Math.min(discountAmount, totalAmount);
      }
    }
  }
  const finalAmount = totalAmount - discountAmount;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: normalizedUserId,
      total_amount: finalAmount,
      discount_amount: discountAmount,
      coupon_code: couponCode || null,
      payment_method: paymentMethod,
      payment_status: paymentMethod === "bank" ? "awaiting_review" : "pending",
    })
    .select()
    .single();

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  // Create order items
  const orderItems = resolvedItems
    .filter((item: any) => item.existsInDb)
    .map((item: any) => ({
    order_id: order.id,
      prompt_id: item.promptId,
      price: item.price,
    }));

  if (orderItems.length > 0) {
    await supabase.from("order_items").insert(orderItems);
  }

  return NextResponse.json({
    data: {
      orderId: order.id,
      totalAmount: finalAmount,
      paymentMethod,
    },
  });
}
export async function GET(req: NextRequest) {
  let supabase: any = null;
  try {
    supabase = createServerClient();
  } catch {
    return NextResponse.json({ data: [] });
  }
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const normalizedUserId = String(userId || "").trim().toLowerCase();

  if (!normalizedUserId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  const query = supabase
    .from("orders")
    .select("id, user_id, total_amount, discount_amount, payment_method, payment_status, created_at")
    .order("created_at", { ascending: false });
  if (normalizedUserId !== "admin") {
    query.ilike("user_id", normalizedUserId);
  }
  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    if (normalizedUserId !== "admin") {
      const { data: purchases } = await supabase
        .from("user_purchases")
        .select("prompt_id")
        .ilike("user_id", normalizedUserId);
      const purchasedPromptIds = Array.from(
        new Set((purchases || []).map((row: any) => String(row.prompt_id || "")).filter(Boolean))
      );
      return NextResponse.json({ data: [], purchased_prompt_ids: purchasedPromptIds });
    }
    return NextResponse.json({ data: [] });
  }

  const orderIds = data.map((order: any) => order.id);
  const { data: orderItems } = await supabase
    .from("order_items")
    .select("order_id, id, price, prompt_id")
    .in("order_id", orderIds);
  const { data: reviewLogs } = await supabase
    .from("order_review_logs")
    .select("order_id, reviewer, action, note, created_at")
    .in("order_id", orderIds)
    .order("created_at", { ascending: false });

  const itemByOrderMap = new Map<string, any[]>();
  for (const item of orderItems || []) {
    const current = itemByOrderMap.get(item.order_id) || [];
    current.push(item);
    itemByOrderMap.set(item.order_id, current);
  }

  const merged = data.map((order: any) => ({
    ...order,
    order_items: itemByOrderMap.get(order.id) || [],
    review: (reviewLogs || []).find((row: any) => row.order_id === order.id) || null,
  }));

  if (normalizedUserId !== "admin") {
    const { data: purchases } = await supabase
      .from("user_purchases")
      .select("prompt_id")
      .ilike("user_id", normalizedUserId);
    const fromPurchasesTable = (purchases || [])
      .map((row: any) => String(row.prompt_id || ""))
      .filter(Boolean);
    const paidOrders = merged.filter((order: any) => order.payment_status === "paid");
    const fromOrderItems = paidOrders
      .flatMap((order: any) => (order.order_items || []).map((item: any) => String(item.prompt_id || "")))
      .filter(Boolean);
    const fromReviewNotes = paidOrders
      .map((order: any) => inferPromptIdByReviewNote(order?.review?.note))
      .filter(Boolean) as string[];
    const fromBundleAmount = paidOrders
      .filter(
        (order: any) =>
          [growthBundleSku.price, cskhBundleSku.price].includes(Number(order.total_amount || 0)) &&
          (!order.order_items || order.order_items.length === 0)
      )
      .flatMap((order: any) =>
        Number(order.total_amount || 0) === cskhBundleSku.price
          ? [cskhBundleSku.id, ...cskhBundlePromptIds]
          : [growthBundleSku.id]
      );
    const fromUniqueAmount = paidOrders
      .filter((order: any) => !order.order_items || order.order_items.length === 0)
      .map((order: any) => {
        const candidates = promptIdsByPrice.get(Number(order.total_amount || 0)) || [];
        return candidates.length === 1 ? candidates[0] : null;
      })
      .filter(Boolean) as string[];
    const purchasedPromptIds = Array.from(
      new Set([
        ...fromPurchasesTable,
        ...fromOrderItems,
        ...fromReviewNotes,
        ...fromBundleAmount,
        ...fromUniqueAmount,
      ])
    );
    return NextResponse.json({ data: merged, purchased_prompt_ids: purchasedPromptIds });
  }

  return NextResponse.json({ data: merged });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { orderId, action, reviewer } = body || {};
  if (!orderId || !action) {
    return NextResponse.json({ error: "Missing orderId/action" }, { status: 400 });
  }

  let supabase: any = null;
  try {
    supabase = createServerClient();
  } catch {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 400 });
  }

  if (action === "approve_bank") {
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: "paid" })
      .eq("id", orderId)
      .in("payment_status", ["awaiting_review", "pending"]);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await finalizePaidOrder(supabase, orderId);
    await supabase.from("order_review_logs").insert({
      order_id: orderId,
      reviewer: reviewer || "admin",
      action: "approved",
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "reject_bank") {
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: "failed" })
      .eq("id", orderId)
      .eq("payment_status", "awaiting_review");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await supabase.from("order_review_logs").insert({
      order_id: orderId,
      reviewer: reviewer || "admin",
      action: "rejected",
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "confirm_paid") {
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: "paid" })
      .eq("id", orderId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await finalizePaidOrder(supabase, orderId);
    await supabase.from("order_review_logs").insert({
      order_id: orderId,
      reviewer: reviewer || "system",
      action: "approved",
      note: "auto confirm from success redirect",
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "admin_grant_prompt") {
    const promptId = String(body?.promptId || "");
    if (!promptId) {
      return NextResponse.json({ error: "Missing promptId" }, { status: 400 });
    }
    await ensurePromptExists(supabase, promptId);
    const { data: order } = await supabase
      .from("orders")
      .select("id,payment_status")
      .eq("id", orderId)
      .single();
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (order.payment_status !== "paid") {
      await supabase.from("orders").update({ payment_status: "paid" }).eq("id", orderId);
    }
    await supabase.from("order_items").upsert(
      {
        order_id: orderId,
        prompt_id: promptId,
        price: promptId === growthBundleSku.id
          ? growthBundleSku.price
          : promptId === cskhBundleSku.id
            ? cskhBundleSku.price
          : (prompts.find((p) => p.id === promptId)?.price || 0),
      },
      { onConflict: "order_id,prompt_id" }
    );
    await finalizePaidOrder(supabase, orderId);
    await supabase.from("order_review_logs").insert({
      order_id: orderId,
      reviewer: reviewer || "admin",
      action: "approved",
      note: `manual grant prompt ${promptId}`,
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "admin_repair_user_orders") {
    const targetUserId = String(body?.userId || "");
    if (!targetUserId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { data: userOrders, error: orderErr } = await supabase
      .from("orders")
      .select("id,user_id,total_amount,payment_status")
      .eq("user_id", targetUserId)
      .eq("payment_status", "paid")
      .order("created_at", { ascending: false });
    if (orderErr) return NextResponse.json({ error: orderErr.message }, { status: 500 });

    const repaired: string[] = [];
    const skipped: string[] = [];

    for (const order of userOrders || []) {
      const { data: existingItems } = await supabase
        .from("order_items")
        .select("id")
        .eq("order_id", order.id)
        .limit(1);
      if ((existingItems || []).length > 0) continue;

      const { data: latestReview } = await supabase
        .from("order_review_logs")
        .select("note")
        .eq("order_id", order.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      const fromNote = inferPromptIdByReviewNote(latestReview?.note);
      const candidateIds = fromNote
        ? [fromNote]
        : (promptIdsByPrice.get(Number(order.total_amount || 0)) || []);
      if (candidateIds.length !== 1) {
        skipped.push(order.id);
        continue;
      }
      const promptId = candidateIds[0];
      await ensurePromptExists(supabase, promptId);
      await supabase.from("order_items").upsert(
        {
          order_id: order.id,
          prompt_id: promptId,
          price: promptId === growthBundleSku.id
            ? growthBundleSku.price
            : promptId === cskhBundleSku.id
              ? cskhBundleSku.price
            : (prompts.find((p) => p.id === promptId)?.price || 0),
        },
        { onConflict: "order_id,prompt_id" }
      );
      await finalizePaidOrder(supabase, order.id);
      await supabase.from("order_review_logs").insert({
        order_id: order.id,
        reviewer: reviewer || "admin",
        action: "approved",
        note: `auto repair prompt ${promptId}`,
      });
      repaired.push(order.id);
    }

    return NextResponse.json({ ok: true, repaired, skipped });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}