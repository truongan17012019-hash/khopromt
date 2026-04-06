import { NextResponse } from "next/server";
import { readAppSetting, writeAppSetting } from "@/lib/supabase-direct";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/** GET: Lấy tất cả số dư */
export async function GET() {
  try {
    const balances = (await readAppSetting("user_balances")) || {};
    return NextResponse.json({ data: balances });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/** POST: Nạp/trừ tiền cho user
 * body: { email, amount, action: "deposit" | "deduct", note? }
 */
export async function POST(req: Request) {
  try {
    const { email, amount, action, note } = await req.json();
    if (!email || !amount || !action) {
      return NextResponse.json({ error: "Missing email, amount, or action" }, { status: 400 });
    }

    const balances: Record<string, number> = (await readAppSetting("user_balances")) || {};
    const key = email.trim().toLowerCase();
    const current = Number(balances[key]) || 0;
    const amountNum = Math.abs(Number(amount));

    if (action === "deposit") {
      balances[key] = current + amountNum;
    } else if (action === "deduct") {
      if (current < amountNum) {
        return NextResponse.json({ error: "Số dư không đủ" }, { status: 400 });
      }
      balances[key] = current - amountNum;
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await writeAppSetting("user_balances", balances);

    // Ghi log giao dịch
    const txList: any[] = (await readAppSetting("balance_transactions")) || [];
    txList.push({
      email: key,
      action,
      amount: amountNum,
      balance_after: balances[key],
      note: note || "",
      created_at: new Date().toISOString(),
    });
    await writeAppSetting("balance_transactions", txList.slice(-500));

    return NextResponse.json({
      ok: true,
      email: key,
      balance: balances[key],
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
