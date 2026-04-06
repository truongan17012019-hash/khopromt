import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const DB_KEY = "funnel_events";

function pct(part: number, total: number) {
  if (!total) return 0;
  return Number(((part / total) * 100).toFixed(2));
}

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", DB_KEY)
      .single();
    let raw = data?.value;
    if (typeof raw === "string") {
      try { raw = JSON.parse(raw); } catch { raw = []; }
    }
    const all = Array.isArray(raw) ? raw : [];
    const since = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const events = all.filter((e: any) => Number(e?.ts || 0) >= since);

    const views = events.filter((e: any) => e.event === "view_prompt").length;
    const addToCart = events.filter((e: any) => e.event === "add_to_cart").length;
    const startCheckout = events.filter((e: any) => e.event === "start_checkout").length;
    const purchase = events.filter((e: any) => e.event === "purchase").length;

    return NextResponse.json({
      stats: {
        views,
        addToCart,
        startCheckout,
        purchase,
        viewToCartRate: pct(addToCart, views),
        cartToCheckoutRate: pct(startCheckout, addToCart),
        checkoutToPurchaseRate: pct(purchase, startCheckout),
      },
      totalEvents: events.length,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

