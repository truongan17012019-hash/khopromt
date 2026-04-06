"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export type HeroSlide = {
  id: string;
  title: string;
  preview: string;
  tool: string;
  /** id chuyên mục — dùng cho thumbnail đại diện (emoji + nền) */
  categoryId: string;
  categoryIcon: string;
  categoryName: string;
};

/** Class Tailwind tĩnh để không bị purge; đồng bộ tông từng chuyên mục */
const CATEGORY_THUMB: Record<string, string> = {
  "viet-content":
    "bg-gradient-to-br from-sky-600/85 to-slate-950 ring-1 ring-sky-400/35 shadow-lg shadow-sky-900/30",
  "lap-trinh":
    "bg-gradient-to-br from-emerald-600/85 to-slate-950 ring-1 ring-emerald-400/35 shadow-lg shadow-emerald-900/30",
  "thiet-ke-anh":
    "bg-gradient-to-br from-violet-600/85 to-slate-950 ring-1 ring-violet-400/35 shadow-lg shadow-violet-900/30",
  marketing:
    "bg-gradient-to-br from-orange-600/85 to-slate-950 ring-1 ring-orange-400/35 shadow-lg shadow-orange-900/30",
  "giao-duc":
    "bg-gradient-to-br from-teal-600/85 to-slate-950 ring-1 ring-teal-400/35 shadow-lg shadow-teal-900/30",
  "kinh-doanh":
    "bg-gradient-to-br from-red-600/85 to-slate-950 ring-1 ring-red-400/35 shadow-lg shadow-red-900/30",
  "cham-soc-khach-hang":
    "bg-gradient-to-br from-rose-600/85 to-slate-950 ring-1 ring-rose-400/35 shadow-lg shadow-rose-900/30",
  "ban-hang":
    "bg-gradient-to-br from-amber-600/85 to-slate-950 ring-1 ring-amber-400/35 shadow-lg shadow-amber-900/30",
  default:
    "bg-gradient-to-br from-slate-600/90 to-slate-950 ring-1 ring-slate-500/40 shadow-lg shadow-black/20",
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function thumbClasses(categoryId: string) {
  return CATEGORY_THUMB[categoryId] ?? CATEGORY_THUMB.default;
}

/** Thứ tự cố định — trùng khớp SSR + lần hydrate đầu (không dùng Math.random ở đây). */
function pickStableSlides(items: HeroSlide[]): HeroSlide[] {
  if (!items.length) return [];
  const take = Math.min(8, Math.max(4, items.length));
  const base = items.slice(0, take);
  return base.length ? base : items.slice(0, 1);
}

export default function HeroPromptSlider({ items }: { items: HeroSlide[] }) {
  const [slides, setSlides] = useState<HeroSlide[]>(() => pickStableSlides(items));
  const [index, setIndex] = useState(0);

  /* Cập nhật khi danh sách id thay đổi (ổn định hơn so với tham chiếu mảng `items`). */
  const itemsKey = items.map((i) => i.id).join("\0");

  useEffect(() => {
    if (!items.length) {
      setSlides([]);
      setIndex(0);
      return;
    }
    if (items.length < 4) {
      const take = Math.min(8, items.length);
      setSlides(items.slice(0, Math.max(1, take)));
      setIndex(0);
      return;
    }
    const pool = shuffle([...items]);
    const take = Math.min(8, Math.max(4, pool.length));
    setSlides(pool.slice(0, take));
    setIndex(0);
  }, [itemsKey]);

  const current = slides[index % slides.length];

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4200);
    return () => clearInterval(id);
  }, [slides.length]);

  if (!current) return null;

  return (
    <div className="w-full max-w-lg mx-auto lg:mx-0 lg:max-w-none">
      <p className="text-center lg:text-left text-xs font-semibold uppercase tracking-wider text-brand-400/90 mb-3">
        Gợi ý prompt — đổi ngẫu nhiên
      </p>
      <div className="relative rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-2xl shadow-black/40 overflow-hidden min-h-[220px] sm:min-h-[240px]">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/60 bg-slate-950/80">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="ml-auto text-[10px] text-slate-500 font-mono truncate">
            preview • {current.tool}
          </span>
        </div>

        <div className="relative p-4 sm:p-5">
          <div
            key={current.id + index}
            className="animate-fade-hero flex flex-col sm:flex-row gap-4"
          >
            <div
              className={`relative w-full sm:w-28 h-28 shrink-0 rounded-xl overflow-hidden flex flex-col items-center justify-center ${thumbClasses(
                current.categoryId
              )}`}
              title={current.categoryName}
              aria-label={`Chuyên mục: ${current.categoryName}`}
            >
              <span className="text-4xl sm:text-5xl leading-none drop-shadow-md" role="img">
                {current.categoryIcon}
              </span>
              <span className="mt-1.5 px-2 py-0.5 rounded-md bg-black/25 text-[10px] font-semibold text-white/90 text-center line-clamp-2 max-w-[90%]">
                {current.categoryName}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/prompt/${current.id}`}
                className="font-semibold text-white text-sm sm:text-base leading-snug hover:text-brand-400 transition-colors line-clamp-2"
              >
                {current.title}
              </Link>
              <pre className="mt-3 font-mono text-[11px] sm:text-xs text-slate-400 whitespace-pre-wrap break-words leading-relaxed line-clamp-6">
                <span className="text-brand-400 select-none">{"> "}</span>
                {current.preview}
              </pre>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 pb-3">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index % slides.length
                  ? "w-6 bg-brand-500"
                  : "w-1.5 bg-slate-600 hover:bg-slate-500"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
