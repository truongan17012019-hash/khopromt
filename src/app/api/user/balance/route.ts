import { NextRequest, NextResponse } from "next/server";
import { readAppSetting } from "@/lib/supabase-direct";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ balance: 0 });
  }

  try {
    const key = email.trim().toLowerCase();
    const balances = (await readAppSetting("user_balances")) || {};
    const balance = Number(balances[key]) || 0;

    const allTx = (await readAppSetting("balance_transactions")) || [];
    const userTx = (Array.isArray(allTx) ? allTx : [])
      .filter((tx: any) => tx.email === key)
      .slice(-50)
      .reverse();

    return NextResponse.json({ balance, transactions: userTx });
  } catch {
    return NextResponse.json({ balance: 0, transactions: [] });
  }
}
