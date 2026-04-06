import { NextRequest, NextResponse } from "next/server";
import {
  getCategorySeoOverrides,
  saveCategorySeoOverrides,
} from "@/lib/server/seo-settings";

export async function GET() {
  try {
    const data = await getCategorySeoOverrides();
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Cannot load" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await saveCategorySeoOverrides(body || {});
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Cannot save" }, { status: 500 });
  }
}
