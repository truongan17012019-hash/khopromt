import { NextResponse } from "next/server";
import { getBundles } from "@/lib/server/bundle-settings";

export async function GET() {
  try {
    const bundles = await getBundles();
    const enabled = bundles.filter((b) => b.enabled).sort((a, b) => a.order - b.order);
    return NextResponse.json({ bundles: enabled });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed" }, { status: 500 });
  }
}
