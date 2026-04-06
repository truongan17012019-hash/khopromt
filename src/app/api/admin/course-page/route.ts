import { NextRequest, NextResponse } from "next/server";
import {
  getCoursePageSettings,
  saveCoursePageSettings,
  normalizeSettings,
} from "@/lib/server/course-page-settings";

export async function GET() {
  try {
    const data = await getCoursePageSettings();
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Cannot load course page settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const merged = normalizeSettings(body?.settings ?? body);
    await saveCoursePageSettings(merged);
    return NextResponse.json({ data: merged });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Cannot save course page settings" },
      { status: 500 }
    );
  }
}
