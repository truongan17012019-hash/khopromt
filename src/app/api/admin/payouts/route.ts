import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/admin/payouts
 * Get all pending and recent payouts for admin review
 */
export async function GET(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured" },
        { status: 503 }
      );
    }

    const auth = req.headers.get("authorization");
    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = auth.replace("Bearer ", "");
    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json(
        { error: "Permission denied - admin only" },
        { status: 403 }
      );
    }

    // Get all payouts with seller info
    const { data: payouts, error: payoutsError } = await supabase
      .from("seller_payouts")
      .select(
        `
        id,
        seller_id,
        amount,
        status,
        bank_name,
        bank_account,
        created_at,
        processed_at,
        profiles(email, display_name)
      `
      )
      .order("created_at", { ascending: false });

    if (payoutsError) {
      throw payoutsError;
    }

    // Format payouts with seller info
    const formattedPayouts = (payouts || []).map((p: any) => ({
      id: p.id,
      seller_id: p.seller_id,
      seller_email: p.profiles?.email || "Unknown",
      seller_name: p.profiles?.display_name || "Unknown",
      amount: p.amount,
      status: p.status,
      bank_name: p.bank_name,
      bank_account: p.bank_account,
      created_at: p.created_at,
      processed_at: p.processed_at,
    }));

    // Calculate stats
    const pending = formattedPayouts.filter((p) => p.status === "pending");
    const processed = formattedPayouts.filter((p) => p.status === "processed");

    const totalPending = pending.reduce((sum, p) => sum + p.amount, 0);
    const totalProcessed = processed.reduce((sum, p) => sum + p.amount, 0);
    const totalPayouts = formattedPayouts.length;
    const averagePayout =
      totalPayouts > 0 ? totalProcessed / processed.length : 0;

    return NextResponse.json({
      data: {
        payouts: formattedPayouts,
        stats: {
          totalPending,
          totalProcessed,
          averagePayout: Math.round(averagePayout),
          totalPayouts,
          pendingCount: pending.length,
          processedCount: processed.length,
        },
      },
    });
  } catch (error) {
    console.error("GET admin payouts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
