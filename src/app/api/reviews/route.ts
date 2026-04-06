import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();
  const { userId, promptId, rating, comment } = body;

  if (!userId || !promptId || !rating) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
  }

  // Check if user purchased this prompt
  const { data: purchase } = await supabase
    .from("user_purchases")
    .select("id")
    .eq("user_id", userId)
    .eq("prompt_id", promptId)
    .single();

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      prompt_id: promptId,
      user_id: userId,
      rating,
      comment,
      is_verified_purchase: !!purchase,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const promptId = searchParams.get("promptId");
  const supabase = createServerClient();

  if (!promptId) {
    return NextResponse.json({ error: "Missing promptId" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, is_verified_purchase, created_at, profiles (full_name, avatar_url)")
    .eq("prompt_id", promptId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}