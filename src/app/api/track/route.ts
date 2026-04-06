import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const DB_KEY = "funnel_events";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = String(body?.event || "").trim();
    if (!event) {
      return NextResponse.json({ error: "Missing event" }, { status: 400 });
    }

    let supabase: any = null;
    try {
      supabase = createServerClient();
    } catch {
      return NextResponse.json({ ok: true, skipped: "no-db" });
    }

    const { data } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", DB_KEY)
      .single();
    let raw = data?.value;
    if (typeof raw === "string") {
      try { raw = JSON.parse(raw); } catch { raw = []; }
    }
    const list: any[] = Array.isArray(raw) ? raw : [];
    list.push({
      event,
      ts: Number(body?.ts || Date.now()),
      page: String(body?.page || ""),
      promptId: String(body?.promptId || ""),
      category: String(body?.category || ""),
      source: String(body?.source || "web"),
      userEmail: String(body?.user_email || body?.userEmail || "").toLowerCase(),
      orderId: String(body?.order_id || body?.orderId || ""),
      paymentMethod: String(body?.payment_method || body?.paymentMethod || ""),
    });

    await supabase
      .from("app_settings")
      .upsert({ key: DB_KEY, value: list.slice(-5000) }, { onConflict: "key" });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

