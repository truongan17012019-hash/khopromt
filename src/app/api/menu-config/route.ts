import { NextResponse } from "next/server";
import { readAppSetting } from "@/lib/supabase-direct";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const config = await readAppSetting("menu_config");
    if (config) {
      return NextResponse.json(config, {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
      });
    }
    return NextResponse.json(null);
  } catch {
    return NextResponse.json(null);
  }
}
