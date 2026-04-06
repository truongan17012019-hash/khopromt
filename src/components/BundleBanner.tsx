"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface SpecialBundle {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  promptCount: number;
  tags: string[];
  ctaText: string;
  ctaLink: string;
  secondaryText: string;
  secondaryLink: string;
  badgeText: string;
  enabled: boolean;
  order: number;
}

export default function BundleBanner() {
  const [bundles, setBundles] = useState<SpecialBundle[]>([]);

  useEffect(() => {
    fetch("/api/bundles")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.bundles)) setBundles(d.bundles);
      })
      .catch(() => {});
  }, []);

  if (bundles.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {bundles.map((b) => (
          <div
            key={b.id}
            className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 rounded-3xl p-8 lg:p-12 overflow-hidden shadow-2xl shadow-orange-900/20"
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-300 rounded-full blur-3xl" />
            </div>
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                {b.badgeText && (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur rounded-full text-white text-sm font-bold mb-4 border border-white/20">
                    {b.badgeText}
                  </div>
                )}
                <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                  {b.name}
                </h2>
                <p className="text-lg text-white/95 font-semibold mt-2">{b.subtitle}</p>
                <p className="mt-4 text-white/85 leading-relaxed">{b.description}</p>
                {b.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {b.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-white/15 backdrop-blur text-white text-xs font-semibold rounded-full border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-center lg:text-right">
                <div className="inline-block bg-black/20 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10">
                  <p className="text-white/60 text-sm line-through">
                    {b.originalPrice.toLocaleString("vi-VN")} ₫
                  </p>
                  <p className="text-4xl sm:text-5xl font-extrabold text-white mt-1">
                    {b.price.toLocaleString("vi-VN")} ₫
                  </p>
                  <p className="text-amber-100 font-bold text-sm mt-2">
                    Tiết kiệm {b.discount}% — {b.promptCount} prompt
                  </p>
                  <Link
                    href={b.ctaLink}
                    className="inline-block mt-5 px-8 py-4 bg-white text-orange-600 font-extrabold rounded-xl hover:bg-slate-50 transition-all shadow-xl active:scale-[0.98]"
                  >
                    {b.ctaText}
                  </Link>
                  {b.secondaryText && (
                    <Link
                      href={b.secondaryLink}
                      className="block mt-4 text-white/90 text-sm font-semibold hover:text-white transition-colors"
                    >
                      {b.secondaryText}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
