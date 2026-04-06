"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface FooterColumn { id: string; title: string; links: { id: string; label: string; href: string }[]; visible: boolean; order: number; }
interface FooterSocial { id: string; label: string; href: string; visible: boolean; }
interface PaymentMethod { id: string; label: string; shortLabel: string; color: string; visible: boolean; }
interface FooterCfg {
  footerColumns: FooterColumn[];
  footerSocials: FooterSocial[];
  footerDescription: string;
  footerPaymentMethods: PaymentMethod[];
}

const FALLBACK: FooterCfg = {
  footerDescription: "Chia sẻ và mua prompt AI chất lượng — tối ưu cho ChatGPT, Claude, Gemini và hơn thế nữa.",
  footerColumns: [
    { id: "fc1", title: "Danh mục", visible: true, order: 1, links: [
      { id: "fl1", label: "Viết Content", href: "/danh-muc/viet-content" },
      { id: "fl2", label: "Lập trình", href: "/danh-muc/lap-trinh" },
      { id: "fl3", label: "Thiết kế Ảnh", href: "/danh-muc/thiet-ke-anh" },
      { id: "fl4", label: "Marketing & SEO", href: "/danh-muc/marketing" },
      { id: "fl5", label: "Giáo dục", href: "/danh-muc/giao-duc" },
      { id: "fl5b", label: "Bất Động Sản", href: "/danh-muc/bat-dong-san" },
      { id: "fl5c", label: "Y Tế & Sức Khỏe", href: "/danh-muc/y-te" },
      { id: "fl5d", label: "Tài Chính", href: "/danh-muc/tai-chinh" },
    ]},
    { id: "fc2", title: "Thêm danh mục", visible: true, order: 2, links: [
      { id: "fl6a", label: "Du Lịch", href: "/danh-muc/du-lich" },
      { id: "fl6b", label: "Pháp Lý", href: "/danh-muc/phap-ly" },
      { id: "fl6c", label: "Nhân Sự & HR", href: "/danh-muc/nhan-su" },
      { id: "fl6d", label: "Thương Mại Điện Tử", href: "/danh-muc/thuong-mai-dien-tu" },
      { id: "fl6e", label: "Truyền Thông XH", href: "/danh-muc/truyen-thong-xa-hoi" },
      { id: "fl6f", label: "Khoa Học Dữ Liệu", href: "/danh-muc/khoa-hoc-du-lieu" },
      { id: "fl6g", label: "Kinh Doanh", href: "/danh-muc/kinh-doanh" },
    ]},
    { id: "fc3", title: "Công cụ AI", visible: true, order: 3, links: [
      { id: "fl10", label: "Nâng cấp Prompt", href: "/nang-cap-prompt" },
      { id: "fl11", label: "Khóa học AI", href: "/khoa-hoc" },
      { id: "fl12", label: "Blog & Tin tức", href: "/blog" },
      { id: "fl13", label: "Trợ lý AI", href: "/tro-ly-ao" },
      { id: "fl14", label: "Bảng giá", href: "/bang-gia" },
      { id: "fl15", label: "Câu hỏi thường gặp", href: "/faq" },
      { id: "fl16", label: "Liên hệ", href: "/lien-he" },
    ]},
  ],
  footerSocials: [
    { id: "s1", label: "FB", href: "#", visible: true },
    { id: "s2", label: "YT", href: "#", visible: true },
    { id: "s3", label: "TG", href: "#", visible: true },
  ],
  footerPaymentMethods: [
    { id: "p1", label: "MoMo", shortLabel: "Mo", color: "bg-pink-600", visible: true },
    { id: "p2", label: "VNPay", shortLabel: "VN", color: "bg-blue-600", visible: true },
    { id: "p3", label: "Chuyển khoản", shortLabel: "CK", color: "bg-amber-500", visible: true },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();
  const [cfg, setCfg] = useState<FooterCfg>(FALLBACK);

  useEffect(() => {
    fetch("/api/menu-config", { cache: "no-store" })
      .then(r => r.json())
      .then(d => { if (d?.footerColumns) setCfg(d); })
      .catch(() => {});
  }, []);

  const columns = cfg.footerColumns.filter(c => c.visible).sort((a, b) => a.order - b.order);
  const socials = cfg.footerSocials.filter(s => s.visible);
  const payments = cfg.footerPaymentMethods.filter(p => p.visible);

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <span className="text-white font-extrabold text-lg">P</span>
              </div>
              <span className="font-display font-extrabold text-xl text-white tracking-tight">
                Prompt<span className="text-brand-400">VN</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              {cfg.footerDescription}
            </p>
            {socials.length > 0 && (
              <div className="flex gap-2 mt-5">
                {socials.map(s => (
                  <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-900 hover:bg-brand-500/20 hover:text-brand-400 border border-slate-800 rounded-xl flex items-center justify-center text-xs font-bold transition-colors">
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic columns from API */}
          {columns.map(col => (
            <div key={col.id}>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">{col.title}</h3>
              <ul className="space-y-2.5 text-sm">
                {col.links.map(link => (
                  <li key={link.id}>
                    <Link href={link.href} className="hover:text-brand-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Payment methods */}
          {payments.length > 0 && (
            <div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Thanh toán</h3>
              <div className="space-y-2">
                {payments.map(pm => (
                  <div key={pm.id} className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2.5">
                    <div className={`w-8 h-8 ${pm.color} rounded-lg flex items-center justify-center text-white text-[10px] font-bold`}>
                      {pm.shortLabel}
                    </div>
                    <span className="text-sm text-slate-300">{pm.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">&copy; {year} PromptVN. Bảo lưu mọi quyền.</p>
          <div className="flex gap-8 text-sm text-slate-600">
            <Link href="/dieu-khoan" className="hover:text-slate-400 transition-colors">
              Điều khoản
            </Link>
            <Link href="/bao-mat" className="hover:text-slate-400 transition-colors">
              Bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
