"use client";

import Link from "next/link";
import { Prompt } from "@/data/prompts";
import { useCartStore } from "@/lib/store";
import { trackEvent } from "@/lib/tracking";
import {
  formatPrice,
  getToolColor,
  getDifficultyColor,
  getDiscountPercent,
} from "@/lib/utils";

interface PromptCardProps {
  prompt: Prompt;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const isInCart = items.some((item) => item.prompt.id === prompt.id);
  const safeTags = Array.isArray(prompt.tags) ? prompt.tags : [];
  const safePreview = prompt.preview || "Xem trước nội dung prompt...";
  const safeDescription = prompt.description || "Prompt AI chất lượng cao.";
  const safeTool = prompt.tool || "chatgpt";
  const safeDifficulty = prompt.difficulty || "Trung bình";
  const safeRating = typeof prompt.rating === "number" ? prompt.rating : 0;
  const safeReviewCount =
    typeof prompt.reviewCount === "number" ? prompt.reviewCount : 0;
  const safeSold = typeof prompt.sold === "number" ? prompt.sold : 0;

  return (
    <div className="group ui-card ui-card-hover overflow-hidden flex flex-col h-full bg-white">
      <div className="relative h-48 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 overflow-hidden border-b border-slate-700/50">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500/40 via-transparent to-transparent" />
        <div className="relative flex gap-2 flex-wrap">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getToolColor(safeTool)}`}>
            {safeTool === "chatgpt"
              ? "ChatGPT"
              : safeTool === "claude"
                ? "Claude"
                : safeTool === "midjourney"
                  ? "Midjourney"
                  : safeTool === "dalle"
                    ? "DALL-E"
                    : safeTool}
          </span>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getDifficultyColor(safeDifficulty)}`}>
            {safeDifficulty}
          </span>
        </div>
        {prompt.originalPrice && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-brand-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg shadow-lg shadow-brand-500/30">
              -{getDiscountPercent(prompt.price, prompt.originalPrice)}%
            </span>
          </div>
        )}
        <div className="relative mt-7 font-mono text-[11px] sm:text-xs text-slate-400 leading-relaxed line-clamp-5 select-none">
          <span className="text-brand-400 font-bold">{`>`}</span> {safePreview}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
      </div>

      <div className="flex flex-col flex-1 p-5">
        <Link href={`/prompt/${prompt.id}`}>
          <h3 className="font-display font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 text-base leading-snug">
            {prompt.title}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">{safeDescription}</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {safeTags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-md">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            {safeRating}
          </span>
          <span>{safeReviewCount} đánh giá</span>
          <span>{safeSold} đã bán</span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <div>
            <span className="text-xl font-extrabold text-brand-600">{formatPrice(prompt.price)}</span>
            {prompt.originalPrice && (
              <span className="ml-2 text-sm text-slate-400 line-through">{formatPrice(prompt.originalPrice)}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              addItem(prompt);
              trackEvent("add_to_cart", {
                promptId: prompt.id,
                category: prompt.category,
                price: prompt.price,
                page: "prompt_card",
              });
            }}
            disabled={isInCart}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              isInCart
                ? "bg-slate-100 text-slate-400 cursor-default"
                : "ui-btn-primary"
            }`}
          >
            {isInCart ? "Đã thêm" : "Mua ngay"}
          </button>
        </div>
      </div>
    </div>
  );
}
