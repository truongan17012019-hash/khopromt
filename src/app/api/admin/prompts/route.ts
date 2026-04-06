import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("prompts")
      .select("id,slug,title,description,price,original_price,category_id,tool_id,rating,review_count,sold,preview,full_content,tags,difficulty,author_name,image_url,created_at,is_active")
      .order("created_at", { ascending: false });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Cannot load prompts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();
    const id = String(body?.id || "").trim();
    const title = String(body?.title || "").trim();
    if (!id || !title) {
      return NextResponse.json({ error: "Missing id/title" }, { status: 400 });
    }
    const payload = {
      id,
      slug: String(body?.slug || id).trim(),
      title,
      description: String(body?.description || ""),
      price: Number(body?.price || 0),
      original_price: Number(body?.original_price || body?.price || 0),
      category_id: String(body?.category_id || "marketing"),
      tool_id: String(body?.tool_id || "chatgpt"),
      rating: Number(body?.rating || 4.8),
      review_count: Number(body?.review_count || 0),
      sold: Number(body?.sold || 0),
      preview: String(body?.preview || ""),
      full_content: String(body?.full_content || ""),
      tags: Array.isArray(body?.tags) ? body.tags : [],
      difficulty: String(body?.difficulty || "Trung bình"),
      author_name: String(body?.author_name || "PromptVN"),
      image_url: String(body?.image_url || "/images/content-1.jpg"),
      is_active: body?.is_active !== false,
    };
    const { error } = await supabase.from("prompts").upsert(payload, { onConflict: "id" });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Cannot create prompt" }, { status: 500 });
  }
}
