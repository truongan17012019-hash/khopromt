import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * Lưu thông tin user đăng ký (form email) vào Supabase
 * để admin có thể theo dõi tất cả khách hàng.
 */
export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    let supabase;
    try {
      supabase = createServerClient();
    } catch {
      return NextResponse.json({ error: "DB not configured" }, { status: 500 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const displayName = (name || normalizedEmail.split("@")[0]).trim();
    const now = new Date().toISOString();

    // Lưu vào app_settings với key "registered_users" (JSON array)
    // Pattern đã dùng cho bundles & pricing — chắc chắn hoạt động
    const DB_KEY = "registered_users";

    // Đọc danh sách hiện tại
    const { data: existing } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", DB_KEY)
      .single();

    // value có thể là string (JSON bị stringify) hoặc array
    let raw = existing?.value;
    if (typeof raw === "string") {
      try { raw = JSON.parse(raw); } catch { raw = []; }
    }
    const users: any[] = Array.isArray(raw) ? raw : [];

    // Kiểm tra trùng email
    const idx = users.findIndex(
      (u: any) => u.email?.toLowerCase() === normalizedEmail
    );

    if (idx >= 0) {
      // Đã có → cập nhật tên & last_seen
      users[idx].full_name = displayName;
      users[idx].last_seen = now;
    } else {
      // Chưa có → thêm mới
      users.push({
        email: normalizedEmail,
        full_name: displayName,
        provider: "email",
        created_at: now,
        last_seen: now,
      });
    }

    // Lưu lại — đảm bảo value là JSON object (không phải string)
    await supabase
      .from("app_settings")
      .upsert({ key: DB_KEY, value: JSON.parse(JSON.stringify(users)) }, { onConflict: "key" });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
