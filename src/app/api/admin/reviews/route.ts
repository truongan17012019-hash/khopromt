import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const promptId = req.nextUrl.searchParams.get("promptId");
    const verified = req.nextUrl.searchParams.get("verified");
    const supabase = createServerClient();
    let query = supabase
      .from("reviews")
      .select("id,prompt_id,user_id,rating,comment,is_verified_purchase,created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (promptId) query = query.eq("prompt_id", promptId);
    if (verified === "true") query = query.eq("is_verified_purchase", true);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const byPrompt = new Map<string, { total: number; verified: number }>();
    for (const r of data || []) {
      const key = String(r.prompt_id || "");
      const cur = byPrompt.get(key) || { total: 0, verified: 0 };
      cur.total += 1;
      if (r.is_verified_purchase) cur.verified += 1;
      byPrompt.set(key, cur);
    }

    return NextResponse.json({
      data: data || [],
      summary: {
        total: (data || []).length,
        verified: (data || []).filter((r: any) => !!r.is_verified_purchase).length,
        prompts: Array.from(byPrompt.entries()).map(([promptId, stat]) => ({ promptId, ...stat })),
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

