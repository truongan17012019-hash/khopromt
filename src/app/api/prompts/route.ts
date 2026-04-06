import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const category = searchParams.get("category");
  const tool = searchParams.get("tool");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "popular";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const difficulty = searchParams.get("difficulty");

  const offset = (page - 1) * limit;

  let query = supabase
    .from("prompts")
    .select("id, slug, title, description, price, original_price, category_id, tool_id, rating, review_count, sold, preview, tags, difficulty, author_name, image_url, created_at", { count: "exact" })
    .eq("is_active", true);

  if (category) query = query.eq("category_id", category);
  if (tool) query = query.eq("tool_id", tool);
  if (difficulty) query = query.eq("difficulty", difficulty);
  if (minPrice) query = query.gte("price", parseInt(minPrice));
  if (maxPrice) query = query.lte("price", parseInt(maxPrice));
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }
  switch (sort) {
    case "popular": query = query.order("sold", { ascending: false }); break;
    case "rating": query = query.order("rating", { ascending: false }); break;
    case "newest": query = query.order("created_at", { ascending: false }); break;
    case "price-low": query = query.order("price", { ascending: true }); break;
    case "price-high": query = query.order("price", { ascending: false }); break;
    default: query = query.order("sold", { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}