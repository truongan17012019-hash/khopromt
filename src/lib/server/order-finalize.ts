import { prompts } from "@/data/prompts";
import { cskhBundlePromptIds, cskhBundleSku, growthBundleSku } from "@/data/pricing";
import { getPlanSettings } from "@/lib/server/plan-settings";
import {
  grantPlanEntitlementsForOrder,
  isPlanSkuId,
} from "@/lib/server/plan-skus";

async function ensureBundlePromptExists(supabase: any) {
  const bundleSkus = [growthBundleSku, cskhBundleSku];
  for (const sku of bundleSkus) {
    await supabase.from("prompts").upsert(
      {
        id: sku.id,
        slug: sku.id,
        title: sku.title,
        description: sku.description,
        price: sku.price,
        original_price: sku.originalPrice || sku.price,
        category_id: sku.category,
        tool_id: sku.tool,
        rating: sku.rating,
        review_count: sku.reviewCount,
        sold: sku.sold,
        preview: sku.preview,
        full_content: sku.fullContent,
        tags: sku.tags,
        difficulty: sku.difficulty,
        author_name: sku.author,
        image_url: sku.image,
        is_active: true,
      },
      { onConflict: "id" }
    );
  }
}

async function ensurePromptExists(supabase: any, promptId: string) {
  if (promptId === growthBundleSku.id || promptId === cskhBundleSku.id) {
    await ensureBundlePromptExists(supabase);
    return;
  }
  const prompt = prompts.find((p) => p.id === promptId);
  if (!prompt) return;
  await supabase.from("prompts").upsert(
    {
      id: prompt.id,
      slug: prompt.id,
      title: prompt.title,
      description: prompt.description,
      price: prompt.price,
      original_price: prompt.originalPrice || prompt.price,
      category_id: prompt.category,
      tool_id: prompt.tool,
      rating: prompt.rating,
      review_count: prompt.reviewCount,
      sold: prompt.sold,
      preview: prompt.preview,
      full_content: prompt.fullContent,
      tags: prompt.tags,
      difficulty: prompt.difficulty,
      author_name: prompt.author,
      image_url: prompt.image,
      is_active: true,
    },
    { onConflict: "id" }
  );
}

/**
 * Chạy sau khi đơn chuyển sang paid: ghi user_purchases, gói plan-* → entitlement,
 * bundle expansion, increment_sold, điểm.
 */
export async function finalizePaidOrder(supabase: any, orderId: string) {
  const { data: order } = await supabase
    .from("orders")
    .select("id,user_id,total_amount,payment_status")
    .eq("id", orderId)
    .single();
  if (!order || order.payment_status !== "paid") return;

  let { data: orderItems } = await supabase
    .from("order_items")
    .select("prompt_id")
    .eq("order_id", orderId);

  if (!orderItems || !orderItems.length) {
    const amount = Number(order.total_amount || 0);
    const matchedBundle =
      amount === growthBundleSku.price
        ? growthBundleSku
        : amount === cskhBundleSku.price
          ? cskhBundleSku
          : null;
    if (matchedBundle) {
      await ensureBundlePromptExists(supabase);
      await supabase.from("order_items").insert({
        order_id: orderId,
        prompt_id: matchedBundle.id,
        price: matchedBundle.price,
      });
      const { data: retry } = await supabase
        .from("order_items")
        .select("prompt_id")
        .eq("order_id", orderId);
      orderItems = retry || [];
    }
  }
  if (!orderItems || !orderItems.length) return;

  const settings = await getPlanSettings();

  const planSkuList = orderItems
    .map((item: any) => String(item.prompt_id || ""))
    .filter((id: string) => isPlanSkuId(id));

  if (planSkuList.length) {
    await grantPlanEntitlementsForOrder(
      supabase,
      order.user_id,
      orderId,
      planSkuList,
      settings
    );
  }

  const nonPlanItems = orderItems.filter((item: any) => !isPlanSkuId(String(item.prompt_id || "")));

  const expandedPromptIds = nonPlanItems.flatMap((item: any) => {
    const id = String(item.prompt_id || "");
    if (id === cskhBundleSku.id) return cskhBundlePromptIds;
    return [id];
  });

  const purchases = expandedPromptIds.map((promptId: string) => ({
    user_id: order.user_id,
    prompt_id: promptId,
    order_id: orderId,
  }));

  if (purchases.length) {
    await supabase.from("user_purchases").upsert(purchases, {
      onConflict: "user_id,prompt_id",
    });
  }

  for (const item of orderItems) {
    const pid = String(item.prompt_id || "");
    if (isPlanSkuId(pid)) continue;
    await supabase.rpc("increment_sold", { prompt_uuid: pid });
  }

  const points = Math.floor(Number(order.total_amount || 0) / 1000);
  if (points > 0) {
    try {
      await supabase.rpc("add_user_points", {
        user_uuid: order.user_id,
        point_amount: points,
      });
    } catch {
      /* RPC có thể chưa tồn tại */
    }
  }
}

export { ensurePromptExists, ensureBundlePromptExists };
