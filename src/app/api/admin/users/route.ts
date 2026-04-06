import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  let supabase: any = null;
  try {
    supabase = createServerClient();
  } catch {
    return NextResponse.json({ data: [] });
  }

  /* ── 1. Lấy users từ Supabase Auth ── */
  let authUsers: any[] = [];
  try {
    const { data: authData } = await supabase.auth.admin.listUsers({
      perPage: 500,
    });
    authUsers = authData?.users || [];
  } catch {
    /* service role key may lack auth.admin — skip */
  }

  /* ── 2. Lấy tất cả orders để tổng hợp khách hàng ── */
  const { data: orders } = await supabase
    .from("orders")
    .select("user_id, total_amount, payment_status, created_at")
    .order("created_at", { ascending: false });

  /* ── 3. Lấy profiles nếu có ── */
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, points, created_at");

  /* ── 3b. Lấy registered_users từ app_settings ── */
  let registeredUsers: any[] = [];
  try {
    const { data: regData } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "registered_users")
      .single();
    let raw = regData?.value;
    if (typeof raw === "string") {
      try { raw = JSON.parse(raw); } catch { raw = []; }
    }
    registeredUsers = Array.isArray(raw) ? raw : [];
  } catch {}

  const registeredMap = new Map<string, any>();
  for (const ru of registeredUsers) {
    if (ru.email) registeredMap.set(ru.email.toLowerCase(), ru);
  }

  const profileMap = new Map<string, any>();
  for (const p of profiles || []) {
    profileMap.set(String(p.id || "").toLowerCase(), p);
  }

  /* ── 4. Tổng hợp order stats theo user_id (email) ── */
  const orderStats = new Map<
    string,
    { name: string; totalOrders: number; paidOrders: number; paidAmount: number; firstOrder: string }
  >();
  for (const o of orders || []) {
    const key = String(o.user_id || "").trim().toLowerCase();
    if (!key) continue;
    const cur = orderStats.get(key) || {
      name: "",
      totalOrders: 0,
      paidOrders: 0,
      paidAmount: 0,
      firstOrder: o.created_at,
    };
    cur.totalOrders += 1;
    if (o.payment_status === "paid") {
      cur.paidOrders += 1;
      cur.paidAmount += Number(o.total_amount || 0);
    }
    if (o.created_at < cur.firstOrder) cur.firstOrder = o.created_at;
    orderStats.set(key, cur);
  }

  /* ── 5. Merge: auth users + order users → unified list ── */
  const seen = new Set<string>();
  const merged: any[] = [];

  // Auth users first (Google OAuth, etc.)
  for (const au of authUsers) {
    const email = String(au.email || "").trim().toLowerCase();
    if (!email || seen.has(email)) continue;
    seen.add(email);
    const stat = orderStats.get(email);
    const profile = profileMap.get(email) || profileMap.get(au.id);
    const provider = au.app_metadata?.provider || "email";
    merged.push({
      id: au.id,
      email,
      full_name:
        profile?.full_name ||
        au.user_metadata?.full_name ||
        au.user_metadata?.name ||
        stat?.name ||
        email.split("@")[0],
      provider,
      points: profile?.points || 0,
      total_orders: stat?.totalOrders || 0,
      paid_orders: stat?.paidOrders || 0,
      paid_amount: stat?.paidAmount || 0,
      created_at: au.created_at,
    });
  }

  // Order-only users (login thường, chỉ có trong orders, không có auth account)
  for (const [email, stat] of Array.from(orderStats.entries())) {
    if (seen.has(email)) continue;
    seen.add(email);
    const profile = profileMap.get(email);
    const reg = registeredMap.get(email);
    merged.push({
      id: email,
      email,
      full_name: profile?.full_name || reg?.full_name || stat.name || email.split("@")[0],
      provider: reg?.provider || "local",
      points: profile?.points || 0,
      total_orders: stat.totalOrders,
      paid_orders: stat.paidOrders,
      paid_amount: stat.paidAmount,
      created_at: reg?.created_at || stat.firstOrder || new Date().toISOString(),
    });
  }

  // Registered-only users (đăng ký qua form nhưng chưa có order và không có auth)
  for (const ru of registeredUsers) {
    const email = (ru.email || "").trim().toLowerCase();
    if (!email || seen.has(email)) continue;
    seen.add(email);
    const profile = profileMap.get(email);
    merged.push({
      id: email,
      email,
      full_name: profile?.full_name || ru.full_name || email.split("@")[0],
      provider: ru.provider || "email",
      points: profile?.points || 0,
      total_orders: 0,
      paid_orders: 0,
      paid_amount: 0,
      created_at: ru.created_at || new Date().toISOString(),
    });
  }

  // Lấy số dư ví user — dùng direct PostgREST để tránh cache
  let userBalances: Record<string, number> = {};
  try {
    const { readAppSetting } = await import("@/lib/supabase-direct");
    const raw = await readAppSetting("user_balances");
    userBalances = (raw && typeof raw === "object" && !Array.isArray(raw)) ? raw : {};
  } catch {}

  // Gắn balance vào mỗi user — dùng user_balances làm nguồn chính xác duy nhất
  for (const u of merged) {
    const email = String(u.email || "").trim().toLowerCase();
    u.balance = Number(userBalances[email] || 0);
  }

  // Sort by created_at desc
  merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return NextResponse.json({
    data: merged,
    meta: {
      authUserCount: authUsers.length,
      orderUserCount: orderStats.size,
      registeredUserCount: registeredUsers.length,
      totalMerged: merged.length,
    },
  });
}
