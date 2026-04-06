import { NextRequest, NextResponse } from "next/server";
import { getSeoSettings, saveSeoSettings } from "@/lib/server/seo-settings";

export async function GET() {
  try {
    const settings = await getSeoSettings();
    return NextResponse.json({ data: settings });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Cannot load SEO settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const next = {
      site_name: String(body?.site_name || "PromptVN"),
      base_url: String(body?.base_url || "https://khopromt.pro"),
      default_title: String(body?.default_title || ""),
      default_description: String(body?.default_description || ""),
      default_og_image: String(body?.default_og_image || "/og-image.jpg"),
      google_verification: String(body?.google_verification || ""),
    };

    await saveSeoSettings(next);
    return NextResponse.json({ data: next });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Cannot save SEO settings" },
      { status: 500 }
    );
  }
}
