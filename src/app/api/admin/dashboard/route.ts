import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  let supabase: any = null;
  try {
    supabase = createServerClient();
  } catch {
    return NextResponse.json({ error: "DB not configured" }, { status: 500 });
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  /* ── 1. Tất cả orders ── */
  const { data: allOrders } = await supabase
    .from("orders")
    .select("id, user_id, total_amount, payment_method, payment_status, created_at")
    .order("created_at", { ascending: false });
  const orders = allOrders || [];

  /* ── 2. Stats tổng hợp ── */
  const paidOrders = orders.filter((o: any) => o.payment_status === "paid");
  const totalRevenue = paidOrders.reduce((s: number, o: any) => s + Number(o.total_amount || 0), 0);

  const ordersToday = orders.filter((o: any) => o.created_at >= todayStart);
  const ordersTodayPaid = ordersToday.filter((o: any) => o.payment_status === "paid");
  const revenueToday = ordersTodayPaid.reduce((s: number, o: any) => s + Number(o.total_amount || 0), 0);

  const ordersThisWeek = orders.filter((o: any) => o.created_at >= weekStart);
  const ordersThisMonth = orders.filter((o: any) => o.created_at >= monthStart);

  /* ── 3. Khách hàng ── */
  let authUserCount = 0;
  try {
    const { data: authData } = await supabase.auth.admin.listUsers({ perPage: 500 });
    authUserCount = authData?.users?.length || 0;
  } catch {}

  let registeredCount = 0;
  try {
    const { data: regData } = await supabase
      .from("app_settings").select("value").eq("key", "registered_users").single();
    let raw = regData?.value;
    if (typeof raw === "string") { try { raw = JSON.parse(raw); } catch { raw = []; } }
    registeredCount = Array.isArray(raw) ? raw.length : 0;
  } catch {}

  const uniqueCustomerEmails = new Set(orders.map((o: any) => String(o.user_id || "").toLowerCase()).filter(Boolean));
  const totalCustomers = Math.max(authUserCount + registeredCount, uniqueCustomerEmails.size);

  /* ── 4. Tổng prompt trong DB ── */
  const { count: promptCount } = await supabase
    .from("prompts").select("id", { count: "exact", head: true });

  /* ── 5. Top prompts bán chạy (từ user_purchases + order_items) ── */
  const { data: purchases } = await supabase
    .from("user_purchases")
    .select("prompt_id");
  const { data: orderItems } = await supabase
    .from("order_items")
    .select("prompt_id, price");

  // Đếm lượt bán từ user_purchases (nguồn chính)
  const promptSales = new Map<string, { sold: number; revenue: number }>();
  for (const p of purchases || []) {
    const pid = String(p.prompt_id || "");
    if (!pid) continue;
    const cur = promptSales.get(pid) || { sold: 0, revenue: 0 };
    cur.sold += 1;
    promptSales.set(pid, cur);
  }
  // Bổ sung revenue từ order_items
  for (const item of orderItems || []) {
    const pid = String(item.prompt_id || "");
    if (!pid) continue;
    const cur = promptSales.get(pid) || { sold: 0, revenue: 0 };
    cur.revenue += Number(item.price || 0);
    if (!promptSales.has(pid)) cur.sold += 1;
    promptSales.set(pid, cur);
  }
  // Lấy tên prompt
  const topPromptIds = Array.from(promptSales.entries())
    .sort((a, b) => b[1].sold - a[1].sold)
    .slice(0, 10)
    .map(([id]) => id);

  let promptNames = new Map<string, string>();
  if (topPromptIds.length > 0) {
    const { data: promptRows } = await supabase
      .from("prompts").select("id, title").in("id", topPromptIds);
    for (const p of promptRows || []) {
      promptNames.set(p.id, p.title || p.id);
    }
  }

  const topPrompts = topPromptIds.map((id) => {
    const stat = promptSales.get(id)!;
    return { id, title: promptNames.get(id) || id, sold: stat.sold, revenue: stat.revenue };
  });

  /* ── 6. Đơn hàng gần đây (10 đơn mới nhất) ── */
  const recentOrders = orders.slice(0, 10).map((o: any) => ({
    id: o.id,
    customer: o.user_id || "N/A",
    amount: Number(o.total_amount || 0),
    status: o.payment_status,
    method: o.payment_method || "N/A",
    date: o.created_at,
  }));

  /* ── 7. Response ── */
  return NextResponse.json({
    stats: {
      totalRevenue,
      revenueToday,
      totalOrders: orders.length,
      ordersToday: ordersToday.length,
      paidOrders: paidOrders.length,
      pendingOrders: orders.filter((o: any) => ["pending", "awaiting_review"].includes(o.payment_status)).length,
      totalCustomers,
      totalPrompts: promptCount || 0,
      totalPurchases: (purchases || []).length,
      ordersThisWeek: ordersThisWeek.length,
      ordersThisMonth: ordersThisMonth.length,
    },
    recentOrders,
    topPrompts,
  });
}
