import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const DB_KEY = "post_purchase_automation";

const defaultValue = {
  enabled: true,
  onboardingMessage:
    "Bắt đầu trong 5 phút: mở 1 prompt đã mua, copy prompt, điền input mẫu và chạy thử ngay.",
  upsellPromptIds: ["cskh-14", "mkt-10", "sale-1"],
};

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
      try { raw = JSON.parse(raw); } catch { raw = null; }
    }
    const value = raw && typeof raw === "object" ? { ...defaultValue, ...raw } : defaultValue;
    return NextResponse.json({ data: value });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createServerClient();
    const next = {
      enabled: !!body?.enabled,
      onboardingMessage: String(body?.onboardingMessage || defaultValue.onboardingMessage),
      upsellPromptIds: Array.isArray(body?.upsellPromptIds)
        ? body.upsellPromptIds.map((v: any) => String(v || "").trim()).filter(Boolean).slice(0, 12)
        : defaultValue.upsellPromptIds,
    };
    await supabase
      .from("app_settings")
      .upsert({ key: DB_KEY, value: next }, { onConflict: "key" });
    return NextResponse.json({ ok: true, data: next });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

