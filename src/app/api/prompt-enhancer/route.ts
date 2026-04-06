import { NextRequest, NextResponse } from "next/server";
import { enhancePrompt } from "@/lib/prompt-enhancement";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const hdrs = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
const INITIAL_BALANCE = 50000;

async function getOrCreateBalance(email: string): Promise<number> {
  try {
    const res = await fetch(`${url}/rest/v1/user_balances?email=eq.${encodeURIComponent(email)}&select=balance`, {
      headers: { ...hdrs, Prefer: "return=representation" }, cache: "no-store",
    });
    if (!res.ok) return INITIAL_BALANCE; // table may not exist
    const data = await res.json();
    if (data?.length > 0) return data[0].balance;
    // Auto-create balance row
    await fetch(`${url}/rest/v1/user_balances`, {
      method: "POST", headers: { ...hdrs, Prefer: "return=representation" },
      body: JSON.stringify({ email, balance: INITIAL_BALANCE }),
    });
    return INITIAL_BALANCE;
  } catch { return INITIAL_BALANCE; }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, tool, tone, language, industry, role, outputFormat, email } = await req.json();
    if (!prompt || prompt.length < 5) return NextResponse.json({ error: "Prompt quá ngắn (tối thiểu 5 ký tự)" }, { status: 400 });
    if (!email) return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 });

    const balance = await getOrCreateBalance(email);
    if (balance < 2000) return NextResponse.json({ error: "Số dư ví không đủ. Vui lòng nạp thêm tiền." }, { status: 400 });

    const result = await enhancePrompt({
      prompt, tool: tool || "chatgpt", tone: tone || "chuyen-nghiep",
      language: language || "vi", industry, role, outputFormat,
    });

    // Deduct balance (best-effort)
    try {
      await fetch(`${url}/rest/v1/user_balances?email=eq.${encodeURIComponent(email)}`, {
        method: "PATCH", headers: { ...hdrs, Prefer: "return=representation" },
        body: JSON.stringify({ balance: balance - 2000 }),
      });
      await fetch(`${url}/rest/v1/balance_transactions`, {
        method: "POST", headers: { ...hdrs, Prefer: "return=representation" },
        body: JSON.stringify({ email, amount: -2000, type: "prompt_enhance", description: "Nâng cấp prompt AI" }),
      });
    } catch {}

    return NextResponse.json({
      enhanced: result.enhanced, tips: result.tips, engine: result.engine,
      cost: 2000, newBalance: balance - 2000,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Lỗi server" }, { status: 500 });
  }
}
