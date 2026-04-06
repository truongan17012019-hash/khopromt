import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * PATCH /api/admin/payouts/[id]
 * Process or reject a payout request
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { status, reason, transactionId } = await req.json();

    // Validate status
    if (!["processed", "failed"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Get payout record
    const { data: payout, error: fetchError } = await supabase
      .from("seller_payouts")
      .select("*")
      .eq("id", params.id)
      .single();

    if (fetchError || !payout) {
      return NextResponse.json(
        { error: "Payout not found" },
        { status: 404 }
      );
    }

    if (payout.status !== "pending") {
      return NextResponse.json(
        { error: "Can only process pending payouts" },
        { status: 400 }
      );
    }

    // Update payout status
    const { data: updated, error: updateError } = await supabase
      .from("seller_payouts")
      .update({
        status,
        processed_at: new Date(),
        ...(transactionId && { transaction_id: transactionId }),
        ...(reason && status === "failed" && { failure_reason: reason }),
        processed_by: user.id,
      })
      .eq("id", params.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    const { data: sellerProfile } = await supabase
      .from("profiles")
      .select("email, display_name")
      .eq("id", payout.seller_id)
      .single();

    if (sellerProfile?.email) {
      // TODO: Send email notification
    }

    return NextResponse.json({
      data: {
        id: updated.id,
        status: updated.status,
        processed_at: updated.processed_at,
      },
    });
  } catch (error) {
    console.error("PATCH admin payout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
