import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  getSellerPayouts,
  createPayout,
  validateBankAccount,
  markPayoutProcessed,
} from "@/lib/payoutService";
import { logApiError, logPaymentError } from "@/lib/errorLogger";

/**
 * GET /api/seller/payouts
 * Get seller's payout history
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

    const payouts = await getSellerPayouts(user.id);

    // Group by status
    const grouped = {
      pending: payouts.filter((p) => p.status === "pending"),
      processed: payouts.filter((p) => p.status === "processed"),
      failed: payouts.filter((p) => p.status === "failed"),
    };

    const totals = {
      totalPending: grouped.pending.reduce((sum, p) => sum + p.amount, 0),
      totalProcessed: grouped.processed.reduce((sum, p) => sum + p.amount, 0),
      totalFailed: grouped.failed.reduce((sum, p) => sum + p.amount, 0),
    };

    return NextResponse.json({
      data: {
        payouts,
        groupedByStatus: grouped,
        totals,
      },
    });
  } catch (error) {
    console.error("GET payouts error:", error);
    logApiError("Failed to get payouts", 500, "/api/seller/payouts");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/seller/payouts
 * Request payout (create payout record)
 */
export async function POST(req: NextRequest) {
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

    const { amount, bankName, bankAccount } = await req.json();

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid payout amount" },
        { status: 400 }
      );
    }

    if (amount < 100000) {
      return NextResponse.json(
        { error: "Minimum payout is 100k VND" },
        { status: 400 }
      );
    }

    // Check bank details if not yet saved
    if (!bankAccount || !bankName) {
      return NextResponse.json(
        { error: "Bank account and bank name required" },
        { status: 400 }
      );
    }

    if (!validateBankAccount(bankAccount, bankName)) {
      return NextResponse.json(
        { error: "Invalid bank account format" },
        { status: 400 }
      );
    }

    // Check if user has pending payout
    const { data: existingPayouts } = await supabase
      .from("seller_payouts")
      .select("id")
      .eq("seller_id", user.id)
      .eq("status", "pending")
      .limit(1);

    if (existingPayouts && existingPayouts.length > 0) {
      return NextResponse.json(
        { error: "You already have a pending payout request" },
        { status: 400 }
      );
    }

    // Create payout record
    const payout = await createPayout(user.id, amount, bankAccount);

    if (!payout) {
      throw new Error("Failed to create payout");
    }

    // Update seller profile with bank details
    await supabase
      .from("profiles")
      .update({
        bank_account: bankAccount,
        bank_name: bankName,
      })
      .eq("id", user.id);

    return NextResponse.json(
      {
        message: "Payout request created successfully",
        data: payout,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST payout error:", error);
    logPaymentError(
      "Payout creation failed",
      "bank_transfer",
      "payout-request",
      error as any
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/seller/payouts/[id]/process
 * Mark payout as processed (admin only)
 */
export async function PUT(req: NextRequest) {
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

    // Check admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can process payouts" },
        { status: 403 }
      );
    }

    const { payoutId, transactionId } = await req.json();

    if (!payoutId || !transactionId) {
      return NextResponse.json(
        { error: "Missing payoutId or transactionId" },
        { status: 400 }
      );
    }

    const success = await markPayoutProcessed(payoutId, transactionId);

    if (!success) {
      throw new Error("Failed to mark payout as processed");
    }

    return NextResponse.json({
      message: "Payout marked as processed",
    });
  } catch (error) {
    console.error("PUT payout error:", error);
    logApiError("Failed to process payout", 500, "/api/seller/payouts");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
