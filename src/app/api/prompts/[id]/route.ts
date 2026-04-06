import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("prompts")
    .select(`
      id, slug, title, description, price, original_price,
      category_id, tool_id, rating, review_count, sold,
      preview, tags, difficulty, author_name, image_url, created_at,
      reviews (id, rating, comment, created_at, profiles (full_name, avatar_url))
    `)
    .eq("slug", params.id)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}