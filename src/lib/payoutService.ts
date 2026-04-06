/**
 * Payout Service - Weekly seller payments
 */

import { supabase } from "./supabase";

export interface PayoutRecord {
  id: string;
  seller_id: string;
  amount: number;
  status: "pending" | "processed" | "failed";
  bank_name?: string;
  bank_account?: string;
  payout_date?: string;
  created_at: string;
}

/**
 * Calculate seller earnings from orders
 */
export async function calculateSellerEarnings(
  sellerId: string,
  startDate: Date,
  endDate: Date
): Promise<number> {
  try {
    if (!supabase) return 0;
    const { data, error } = await supabase
      .from("order_items")
      .select("price")
      .in(
        "prompt_id",
        (
          await supabase
            .from("prompts")
            .select("id")
            .eq("author_id", sellerId)
        ).data?.map((p) => p.id) || []
      )
      .gte(
        "orders.created_at",
        startDate.toISOString()
      )
      .lte(
        "orders.created_at",
        endDate.toISOString()
      );

    if (error) throw error;

    const totalEarnings = data?.reduce((sum, item) => sum + item.price, 0) || 0;
    return totalEarnings;
  } catch (error) {
    console.error("Calculate earnings error:", error);
    return 0;
  }
}

/**
 * Create payout record for seller
 */
export async function createPayout(
  sellerId: string,
  amount: number,
  bankAccount?: string
): Promise<PayoutRecord | null> {
  try {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("seller_payouts")
      .insert({
        seller_id: sellerId,
        amount,
        status: "pending",
        bank_account: bankAccount,
        created_at: new Date(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Create payout error:", error);
    return null;
  }
}

/**
 * Get pending payouts for seller
 */
export async function getSellerPayouts(
  sellerId: string
): Promise<PayoutRecord[]> {
  try {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("seller_payouts")
      .select("*")
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Get payouts error:", error);
    return [];
  }
}

/**
 * Mark payout as processed
 */
export async function markPayoutProcessed(
  payoutId: string,
  transactionId: string
): Promise<boolean> {
  try {
    if (!supabase) return false;
    const { error } = await supabase
      .from("seller_payouts")
      .update({
        status: "processed",
        payout_date: new Date(),
        transaction_id: transactionId,
      })
      .eq("id", payoutId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Mark payout processed error:", error);
    return false;
  }
}

/**
 * Get total payout amount (pending + processed this month)
 */
export async function getMonthlyPayoutTotal(sellerId: string): Promise<number> {
  try {
    if (!supabase) return 0;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const { data, error } = await supabase
      .from("seller_payouts")
      .select("amount")
      .eq("seller_id", sellerId)
      .gte("created_at", startOfMonth.toISOString())
      .in("status", ["pending", "processed"]);

    if (error) throw error;

    const total = data?.reduce((sum, payout) => sum + payout.amount, 0) || 0;
    return total;
  } catch (error) {
    console.error("Get monthly total error:", error);
    return 0;
  }
}

/**
 * Validate bank account format (Vietnamese)
 */
export function validateBankAccount(
  accountNumber: string,
  bankName: string
): boolean {
  // Simple validation: 8-20 digits, no special chars
  const cleanAccount = accountNumber.replace(/\s/g, "");
  const isValidFormat = /^[0-9]{8,20}$/.test(cleanAccount);
  const hasValidBank = Boolean(bankName && bankName.length > 0);

  return isValidFormat && hasValidBank;
}

/**
 * Format payout amount in Vietnamese currency
 */
export function formatPayoutAmount(amount: number): string {
  return (amount / 1000).toFixed(0) + "k đ";
}
