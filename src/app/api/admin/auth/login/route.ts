import { NextRequest, NextResponse } from "next/server";
import { verifyAdminLogin } from "@/lib/server/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "");
    const password = String(body?.password || "");
    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }
    const ok = await verifyAdminLogin(email, password);
    if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    return NextResponse.json({ data: { email, role: "admin" } });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Login failed" }, { status: 500 });
  }
}
