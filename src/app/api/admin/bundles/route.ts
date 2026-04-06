import { NextRequest, NextResponse } from "next/server";
import { getBundles, saveBundles } from "@/lib/server/bundle-settings";

export async function GET() {
  try {
    const bundles = await getBundles();
    return NextResponse.json({ bundles });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Cannot load bundles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!Array.isArray(body?.bundles)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    await saveBundles(body.bundles);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Cannot save" }, { status: 500 });
  }
}
