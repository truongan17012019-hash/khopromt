import { NextRequest, NextResponse } from "next/server";
import {
  getCategoriesFromSettings,
  saveCategoriesToSettings,
} from "@/lib/server/category-settings";

export async function GET() {
  try {
    const data = await getCategoriesFromSettings();
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Cannot load categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const categories = Array.isArray(body) ? body : [];
    await saveCategoriesToSettings(categories);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Cannot save categories" }, { status: 500 });
  }
}
