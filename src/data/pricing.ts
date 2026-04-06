import type { Prompt } from "./prompts";

export interface OneTimePlan {
  id: string;
  name: string;
  prompts: number;
  price: number;
  originalPrice: number;
  highlight?: boolean;
  cta: string;
  /** Gạch đầu dòng hiển thị trên thẻ bảng giá trang chủ (mỗi dòng một ý trong admin). */
  perks?: string[];
}

export interface MembershipPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyPrompts: number;
  perks: string[];
  highlight?: boolean;
  cta: string;
}

/** Gói pricing hiển thị trên trang chủ (Starter / Member Basic / Member Pro, v.v.) — chỉnh trong Admin */
export type HomepagePricingPlanKind = "one_time" | "membership";

export interface HomepagePricingPlan {
  id: string;
  kind: HomepagePricingPlanKind;
  name: string;
  /** Dòng mô tả nhỏ dưới tên (vd: "25 prompt trong gói") */
  tagline?: string;
  highlight?: boolean;
  /** Nhãn góc thẻ (để trống = không hiện) */
  badge?: string;
  cta: string;
  /** Đường dẫn nút CTA (mặc định: one_time → /danh-muc, membership → /dang-nhap) */
  ctaHref?: string;
  /** Gói một lần */
  prompts?: number;
  price?: number;
  originalPrice?: number;
  /** Gói membership */
  monthlyPrompts?: number;
  monthlyPrice?: number;
  yearlyPrice?: number;
  perks?: string[];
}

export interface HomepagePricingSection {
  eyebrow: string;
  title: string;
  description: string;
  workflowLinks: { label: string; href: string }[];
}

export const defaultHomepagePricingSection: HomepagePricingSection = {
  eyebrow: "Gói linh hoạt",
  title: "Bảng giá tối ưu",
  description: "Ba gói một lần — Cơ bản, Nâng cao và Vĩnh viễn — phù hợp từng nhu cầu.",
  workflowLinks: [
    { label: "Workflow Ads →", href: "/workflow/ads-chuyen-doi" },
    { label: "Landing chốt đơn →", href: "/workflow/landing-page-chot-don" },
    { label: "Content 30 ngày →", href: "/workflow/content-calendar-30-ngay" },
  ],
};

export function deriveDefaultHomepageCards(
  one: OneTimePlan[],
  _member: MembershipPlan[]
): HomepagePricingPlan[] {
  const order = ["starter", "pro", "premium"];
  const byId = new Map(one.map((p) => [p.id, p]));
  const out: HomepagePricingPlan[] = [];
  for (const id of order) {
    const p = byId.get(id);
    if (!p) continue;
    const pid = encodeURIComponent(String(p.id || "goi").trim() || "goi");
    const n = Number(p.prompts) || 0;
    out.push({
      id: p.id,
      kind: "one_time",
      name: p.name,
      tagline:
        p.id === "premium" ? `${n} lượt chọn prompt — gói vĩnh viễn` : `${n} lượt chọn prompt`,
      highlight: !!p.highlight,
      badge: p.highlight ? "Phổ biến" : "",
      cta: p.cta,
      ctaHref: `/gio-hang?plan=${pid}`,
      prompts: p.prompts,
      price: p.price,
      originalPrice: p.originalPrice,
      perks: p.perks && p.perks.length > 0 ? p.perks : undefined,
    });
  }
  return out;
}

/** Ba gói dùng cố định: Cơ bản → Nâng cao → Vĩnh viễn (SKU: starter / pro / premium). */
export const oneTimePlans: OneTimePlan[] = [
  {
    id: "starter",
    name: "Cơ bản (Starter)",
    prompts: 25,
    price: 199000,
    originalPrice: 299000,
    cta: "Chọn gói Cơ bản",
    highlight: false,
  },
  {
    id: "pro",
    name: "Nâng cao (Pro)",
    prompts: 80,
    price: 449000,
    originalPrice: 699000,
    highlight: true,
    cta: "Chọn gói Nâng cao",
  },
  {
    id: "premium",
    name: "Vĩnh viễn (Premium)",
    prompts: 500,
    price: 1299000,
    originalPrice: 1999000,
    cta: "Mua gói Vĩnh viễn",
    highlight: false,
  },
];

/** Nâng cấp 3 gói: không dùng membership song song; giữ mảng rỗng cho DB mới. */
export const membershipPlans: MembershipPlan[] = [];

export const salesBundleSku: Prompt = {
  id: "sales-bundle",
  title: "Sát Thủ Bán Hàng - Trọn bộ 50 Prompt",
  description: "Trọn bộ 50 prompt Coach Bán Hàng Ảo: thấu hiểu khách, phá băng, xử lý từ chối, chốt đơn, chăm sóc sau bán. Dành cho mọi chủ shop, sale, freelancer.",
  price: 499000,
  originalPrice: 1450000,
  category: "ban-hang",
  tool: "chatgpt",
  rating: 4.9,
  reviewCount: 0,
  sold: 0,
  preview: "Gói 50 prompt bán hàng chuyên nghiệp: từ phân tích khách hàng → tiếp cận → xử lý từ chối → chốt đơn → chăm sóc sau bán",
  fullContent: "Bạn đã sở hữu trọn bộ 50 Prompt Sát Thủ Bán Hàng. Hãy vào từng prompt trong danh mục Bán Hàng để sử dụng.",
  tags: ["bundle", "bán-hàng", "coach", "chốt-đơn", "50-prompt"],
  difficulty: "Nâng cao",
  author: "PromptVN",
  createdAt: "2026-04-01",
  image: "/images/sales-bundle.jpg",
};

export const growthBundleSku: Prompt = {
  id: "growth-bundle",
  title: "Growth Bundle - 3 Workflow chốt đơn",
  description:
    "Trọn bộ 3 workflow: Ads chuyển đổi, Landing page chốt đơn, Content calendar 30 ngày.",
  price: 399000,
  originalPrice: 599000,
  category: "marketing",
  tool: "chatgpt",
  rating: 4.9,
  reviewCount: 0,
  sold: 0,
  preview: "Bundle theo kết quả thực thi: traffic -> conversion -> nội dung duy trì",
  fullContent: "Nội dung đầy đủ - chỉ hiển thị khi mua",
  tags: ["growth", "workflow", "bundle"],
  difficulty: "Trung bình",
  author: "PromptVN",
  createdAt: "2026-03-31",
  image: "/images/growth-bundle.jpg",
};

export const cskhBundlePromptIds = Array.from({ length: 30 }, (_, index) => `cskh-${index + 1}`);

export const cskhBundleSku: Prompt = {
  id: "cskh-bundle",
  title: "CSKH Bundle – 30 prompt thực chiến",
  description:
    "Trọn bộ 30 prompt CSKH 5 sao: xử lý từ chối, hậu mãi, khiếu nại, đòi nợ tế nhị và script thu hồi công nợ.",
  price: 499000,
  originalPrice: 1290000,
  category: "cham-soc-khach-hang",
  tool: "chatgpt",
  rating: 4.9,
  reviewCount: 0,
  sold: 0,
  preview:
    "Bundle CSKH theo tình huống: tư vấn → chốt đơn → hậu mãi → thu hồi công nợ",
  fullContent: "Nội dung đầy đủ - chỉ hiển thị khi mua",
  tags: ["cskh", "bundle", "ban-hang", "cham-soc-khach-hang"],
  difficulty: "Trung bình",
  author: "PromptVN",
  createdAt: "2026-03-31",
  image: "/images/growth-bundle.jpg",
};
