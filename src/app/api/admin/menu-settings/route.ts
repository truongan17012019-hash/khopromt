import { NextRequest, NextResponse } from "next/server";
import { readAppSetting, writeAppSetting } from "@/lib/supabase-direct";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/* ── Shape ── */
export interface MenuItem {
  id: string;
  label: string;
  href: string;
  badge?: string;          // "NEW", "HOT", "" = no badge
  badgeColor?: string;     // tailwind gradient class
  visible: boolean;
  order: number;
}

export interface UserMenuItem {
  id: string;
  label: string;
  href: string;
  visible: boolean;
  order: number;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: { id: string; label: string; href: string }[];
  visible: boolean;
  order: number;
}

export interface FooterSocial {
  id: string;
  label: string;  // "FB", "YT", "TG", "TT"
  href: string;
  visible: boolean;
}

export interface MenuConfig {
  headerNav: MenuItem[];
  userMenu: UserMenuItem[];
  footerColumns: FooterColumn[];
  footerSocials: FooterSocial[];
  footerDescription: string;
  footerPaymentMethods: { id: string; label: string; shortLabel: string; color: string; visible: boolean }[];
}


const DEFAULT_CONFIG: MenuConfig = {
  headerNav: [
    { id: "1", label: "Danh mục", href: "/danh-muc", visible: true, order: 1 },
    { id: "2", label: "Nâng cấp Prompt", href: "/nang-cap-prompt", badge: "AI", badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500", visible: true, order: 2 },
    { id: "3", label: "Khóa học", href: "/khoa-hoc", visible: true, order: 3 },
    { id: "4", label: "Blog", href: "/blog", visible: true, order: 4 },
    { id: "5", label: "Khuyến mãi", href: "/danh-muc?filter=sale", badge: "HOT", badgeColor: "bg-red-500", visible: true, order: 5 },
    { id: "6", label: "Trợ lý AI", href: "/tro-ly-ao", visible: true, order: 6 },
  ],
  userMenu: [
    { id: "u1", label: "Dashboard", href: "/dashboard", visible: true, order: 1 },
    { id: "u2", label: "Prompt đã mua", href: "/dashboard", visible: true, order: 2 },
    { id: "u3", label: "Ví của tôi", href: "/nap-tien", visible: true, order: 3 },
    { id: "u4", label: "Giới thiệu bạn bè", href: "/gioi-thieu-ban", visible: true, order: 4 },
    { id: "u5", label: "Thu nhập Seller", href: "/seller/thu-nhap", visible: true, order: 5 },
  ],
  footerColumns: [
    {
      id: "fc1", title: "Danh mục", visible: true, order: 1,
      links: [
        { id: "fl1", label: "Viết Content", href: "/danh-muc/viet-content" },
        { id: "fl2", label: "Lập trình", href: "/danh-muc/lap-trinh" },
        { id: "fl3", label: "Thiết kế Ảnh", href: "/danh-muc/thiet-ke-anh" },
        { id: "fl4", label: "Marketing & SEO", href: "/danh-muc/marketing" },
        { id: "fl5", label: "Giáo dục", href: "/danh-muc/giao-duc" },
        { id: "fl5b", label: "Bất Động Sản", href: "/danh-muc/bat-dong-san" },
        { id: "fl5c", label: "Y Tế & Sức Khỏe", href: "/danh-muc/y-te" },
        { id: "fl5d", label: "Tài Chính", href: "/danh-muc/tai-chinh" },
      ],
    },
    {
      id: "fc2", title: "Thêm danh mục", visible: true, order: 2,
      links: [
        { id: "fl6a", label: "Du Lịch", href: "/danh-muc/du-lich" },
        { id: "fl6b", label: "Pháp Lý", href: "/danh-muc/phap-ly" },
        { id: "fl6c", label: "Nhân Sự & HR", href: "/danh-muc/nhan-su" },
        { id: "fl6d", label: "Thương Mại Điện Tử", href: "/danh-muc/thuong-mai-dien-tu" },
        { id: "fl6e", label: "Truyền Thông XH", href: "/danh-muc/truyen-thong-xa-hoi" },
        { id: "fl6f", label: "Khoa Học Dữ Liệu", href: "/danh-muc/khoa-hoc-du-lieu" },
        { id: "fl6g", label: "Kinh Doanh", href: "/danh-muc/kinh-doanh" },
      ],
    },
    {
      id: "fc3", title: "Công cụ AI", visible: true, order: 3,
      links: [
        { id: "fl10", label: "Nâng cấp Prompt", href: "/nang-cap-prompt" },
        { id: "fl11", label: "Khóa học AI", href: "/khoa-hoc" },
        { id: "fl12", label: "Blog & Tin tức", href: "/blog" },
        { id: "fl13", label: "Trợ lý AI", href: "/tro-ly-ao" },
        { id: "fl14", label: "Bảng giá", href: "/bang-gia" },
        { id: "fl15", label: "Câu hỏi thường gặp", href: "/faq" },
        { id: "fl16", label: "Liên hệ", href: "/lien-he" },
      ],
    },
  ],
  footerSocials: [
    { id: "s1", label: "FB", href: "https://facebook.com/promptvn", visible: true },
    { id: "s2", label: "YT", href: "https://youtube.com/@promptvn", visible: true },
    { id: "s3", label: "TG", href: "https://t.me/promptvn", visible: true },
  ],
  footerDescription: "Chia sẻ và mua prompt AI chất lượng — tối ưu cho ChatGPT, Claude, Gemini và hơn thế nữa. Tiết kiệm thời gian, làm việc thông minh hơn.",
  footerPaymentMethods: [
    { id: "p1", label: "MoMo", shortLabel: "Mo", color: "bg-pink-600", visible: true },
    { id: "p2", label: "VNPay", shortLabel: "VN", color: "bg-blue-600", visible: true },
    { id: "p3", label: "Chuyển khoản", shortLabel: "CK", color: "bg-amber-500", visible: true },
  ],
};

const SETTINGS_KEY = "menu_config";

export async function GET() {
  try {
    const config = await readAppSetting(SETTINGS_KEY);
    return NextResponse.json(config || DEFAULT_CONFIG);
  } catch {
    return NextResponse.json(DEFAULT_CONFIG);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await writeAppSetting(SETTINGS_KEY, body);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
