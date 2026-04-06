import { NextRequest, NextResponse } from "next/server";
import { resetAdminPassword, verifyAdminLogin } from "@/lib/server/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "");
    const oldPassword = String(body?.oldPassword || "");
    const newPassword = String(body?.newPassword || "");
    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Mật khẩu mới phải >= 8 ký tự" }, { status: 400 });
    }
    const valid = await verifyAdminLogin(email, oldPassword);
    if (!valid) {
      return NextResponse.json({ error: "Xác thực thất bại" }, { status: 401 });
    }
    await resetAdminPassword(newPassword);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Reset failed" }, { status: 500 });
  }
}
