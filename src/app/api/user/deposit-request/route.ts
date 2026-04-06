import { NextRequest, NextResponse } from "next/server";
import { readAppSetting, writeAppSetting } from "@/lib/supabase-direct";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const DB_KEY = "deposit_requests";

interface DepositRequest {
  id: string;
  email: string;
  username: string;
  amount: number;
  transfer_content: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  reviewed_at?: string;
  note?: string;
}

/** GET: List deposit requests for a user (by email) or all (admin) */
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const all = req.nextUrl.searchParams.get("all");

  try {
    const requests: DepositRequest[] = (await readAppSetting(DB_KEY)) || [];

    if (all === "true") {
      return NextResponse.json({ data: requests });
    }

    if (!email) {
      return NextResponse.json({ data: [] });
    }

    const filtered = requests.filter(
      (r) => r.email.toLowerCase() === email.trim().toLowerCase()
    );
    return NextResponse.json({ data: filtered });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/** POST: Create new deposit request OR approve/reject (admin) */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const requests: DepositRequest[] = (await readAppSetting(DB_KEY)) || [];

    // Admin approve/reject
    if (body.action === "approve" || body.action === "reject") {
      const { id, action } = body;
      const idx = requests.findIndex((r) => r.id === id);
      if (idx === -1) {
        return NextResponse.json({ error: "Request not found" }, { status: 404 });
      }

      requests[idx].status = action === "approve" ? "approved" : "rejected";
      requests[idx].reviewed_at = new Date().toISOString();

      // If approved, add balance to user
      if (action === "approve") {
        const depositReq = requests[idx];
        const balances: Record<string, number> = (await readAppSetting("user_balances")) || {};
        const userKey = depositReq.email.trim().toLowerCase();
        balances[userKey] = (Number(balances[userKey]) || 0) + depositReq.amount;
        await writeAppSetting("user_balances", balances);

        // Log transaction
        const txList: any[] = (await readAppSetting("balance_transactions")) || [];
        txList.push({
          email: userKey,
          action: "deposit",
          amount: depositReq.amount,
          balance_after: balances[userKey],
          note: `Duyệt yêu cầu nạp #${depositReq.id.slice(-6)}`,
          created_at: new Date().toISOString(),
        });
        await writeAppSetting("balance_transactions", txList.slice(-500));
      }

      await writeAppSetting(DB_KEY, requests);
      return NextResponse.json({ ok: true, status: requests[idx].status });
    }

    // User creates new deposit request
    const { email, username, amount } = body;
    if (!email || !amount) {
      return NextResponse.json({ error: "Missing email or amount" }, { status: 400 });
    }

    const uname = username || email.split("@")[0];
    const newReq: DepositRequest = {
      id: crypto.randomUUID(),
      email: email.trim().toLowerCase(),
      username: uname,
      amount: Math.abs(Number(amount)),
      transfer_content: `${uname} naptien`,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    requests.unshift(newReq);
    await writeAppSetting(DB_KEY, requests.slice(0, 1000));

    return NextResponse.json({ ok: true, data: newReq });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
