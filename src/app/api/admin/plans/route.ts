import { NextRequest, NextResponse } from "next/server";
import { getPlanSettings, savePlanSettings } from "@/lib/server/plan-settings";

export async function GET() {
  try {
    const data = await getPlanSettings();
    return NextResponse.json({
      data,
      /** Đối chiếu với trang chủ: số thẻ thực sự sau khi lọc/khớp gói trong DB */
      meta: {
        homepageCardCount: data.homepagePricingCards.length,
        oneTimePlanCount: data.oneTimePlans.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Cannot load plans" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await savePlanSettings({
      oneTimePlans: body?.oneTimePlans,
      homepagePricingCards: body?.homepagePricingCards,
      homepagePricingSection: body?.homepagePricingSection,
    });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Cannot save plans" }, { status: 500 });
  }
}
