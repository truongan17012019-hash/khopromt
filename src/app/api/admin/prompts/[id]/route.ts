import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const body = await req.json();
    const promptId = String(params.id || "").trim();
    if (!promptId) {
      return NextResponse.json({ error: "Missing prompt id" }, { status: 400 });
    }
    const payload = {
      slug: String(body?.slug || promptId).trim(),
      title: String(body?.title || ""),
      description: String(body?.description || ""),
      price: Number(body?.price || 0),
      original_price: Number(body?.original_price || body?.price || 0),
      category_id: String(body?.category_id || "marketing"),
      tool_id: String(body?.tool_id || "chatgpt"),
      preview: String(body?.preview || ""),
      full_content: String(body?.full_content || ""),
      tags: Array.isArray(body?.tags) ? body.tags : [],
      difficulty: String(body?.difficulty || "Trung bình"),
      author_name: String(body?.author_name || "PromptVN"),
      image_url: String(body?.image_url || "/images/content-1.jpg"),
      is_active: body?.is_active !== false,
    };
    const { error } = await supabase.from("prompts").update(payload).eq("id", promptId);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Cannot update prompt" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const promptId = String(params.id || "").trim();
    if (!promptId) {
      return NextResponse.json({ error: "Missing prompt id" }, { status: 400 });
    }
    const { error } = await supabase.from("prompts").delete().eq("id", promptId);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Cannot delete prompt" }, { status: 500 });
  }
}
