import { NextRequest, NextResponse } from "next/server";
import { courses } from "@/data/courses";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tier = searchParams.get("tier");
  const level = searchParams.get("level");
  const slug = searchParams.get("slug");

  if (slug) {
    const course = courses.find(c => c.slug === slug);
    return course ? NextResponse.json(course) : NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let filtered = [...courses];
  if (tier) filtered = filtered.filter(c => c.tier === tier);
  if (level) filtered = filtered.filter(c => c.level === level);
  return NextResponse.json(filtered);
}
