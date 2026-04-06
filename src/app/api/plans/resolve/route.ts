import { NextRequest, NextResponse } from "next/server";
import { getPlanSettings } from "@/lib/server/plan-settings";
import { toPlanSkuId } from "@/lib/server/plan-skus";
import type { Prompt } from "@/data/prompts";

/**
 * GET /api/plans/resolve?planId=starter|member-basic|...
 * Trả về object Prompt (giả) để thêm vào giỏ — id dạng plan-* khớp SKU trong DB.
 */
export async function GET(req: NextRequest) {
  const planId = String(new URL(req.url).searchParams.get("planId") || "").trim();
  if (!planId) {
    return NextResponse.json({ error: "Missing planId" }, { status: 400 });
  }

  const settings = await getPlanSettings();
  const ot = settings.oneTimePlans.find((p) => p.id === planId);
  if (ot) {
    const id = toPlanSkuId(ot.id);
    const p: Prompt = {
      id,
      title: `${ot.name} (${ot.prompts} lượt chọn prompt)`,
      description: `Gói một lần: thanh toán xong bạn được chọn ${ot.prompts} prompt trong danh mục để mở khóa.`,
      price: ot.price,
      originalPrice: ot.originalPrice,
      category: "ban-hang",
      tool: "chatgpt",
      rating: 5,
      reviewCount: 0,
      sold: 0,
      preview: `Sau khi mua, vào từng prompt và nhấn «Mở khóa bằng gói» (còn ${ot.prompts} lượt).`,
      fullContent: "",
      tags: ["plan"],
      difficulty: "Trung bình",
      author: "PromptVN",
      createdAt: new Date().toISOString().slice(0, 10),
      image: "",
    };
    return NextResponse.json({ prompt: p });
  }

  const mem = settings.membershipPlans.find((p) => p.id === planId);
  if (mem) {
    const id = toPlanSkuId(mem.id);
    const p: Prompt = {
      id,
      title: `${mem.name} (${mem.monthlyPrompts} lượt / thanh toán)`,
      description: `Membership: mỗi lần thanh toán thành công nhận ${mem.monthlyPrompts} lượt chọn prompt (số lượt cấu hình trong Admin).`,
      price: mem.monthlyPrice,
      originalPrice: mem.yearlyPrice,
      category: "ban-hang",
      tool: "chatgpt",
      rating: 5,
      reviewCount: 0,
      sold: 0,
      preview: `Thanh toán gói membership để nhận lượt chọn prompt.`,
      fullContent: "",
      tags: ["plan", "membership"],
      difficulty: "Trung bình",
      author: "PromptVN",
      createdAt: new Date().toISOString().slice(0, 10),
      image: "",
    };
    return NextResponse.json({ prompt: p });
  }

  return NextResponse.json({ error: "Plan not found" }, { status: 404 });
}
