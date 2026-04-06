"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PromptCard from "@/components/PromptCard";
import { prompts, categories as defaultCategories, tools, type Category } from "@/data/prompts";

type FilterMode = "all" | "hot" | "sale";

interface DanhMucClientPageProps {
  initialCategory?: string;
  initialFilter?: FilterMode;
  initialSearch?: string;
  categoriesData?: Category[];
}

export default function DanhMucClientPage({
  initialCategory = "all",
  initialFilter = "all",
  initialSearch = "",
  categoriesData = defaultCategories,
}: DanhMucClientPageProps) {
  const router = useRouter();
  const safePrompts = Array.isArray(prompts) ? prompts.filter(Boolean) : [];
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedTool, setSelectedTool] = useState<string>("all");
  const [selectedFilter, setSelectedFilter] = useState<FilterMode>(initialFilter);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [visibleCount, setVisibleCount] = useState<number>(24);
  const [isPending, setIsPending] = useState<boolean>(false);

  useEffect(() => {
    setSelectedCategory(initialCategory);
    setSelectedFilter(initialFilter);
    setSearchQuery(initialSearch);
  }, [initialCategory, initialFilter, initialSearch]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === "all") {
      router.push("/danh-muc");
      return;
    }
    router.push(`/danh-muc/${categoryId}`);
  };

  const filtered = useMemo(() => {
    let next = [...safePrompts];

    if (selectedCategory !== "all") {
      next = next.filter((p) => p.category === selectedCategory);
    }
    if (selectedTool !== "all") {
      next = next.filter((p) => p.tool === selectedTool);
    }
    if (selectedFilter === "sale") {
      next = next.filter((p) => (p.originalPrice || 0) > p.price);
    }
    if (selectedFilter === "hot") {
      next = next.filter((p) => p.sold >= 500);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      next = next.filter((p) =>
        `${p.title} ${p.description} ${(p.tags || []).join(" ")}`
          .toLowerCase()
          .includes(q)
      );
    }

    switch (sortBy) {
      case "popular":
        next.sort((a, b) => b.sold - a.sold);
        break;
      case "rating":
        next.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        next.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        next.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        next.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        break;
    }
    return next;
  }, [selectedCategory, selectedTool, selectedFilter, searchQuery, sortBy, safePrompts]);

  useEffect(() => {
    setVisibleCount(24);
    setIsPending(false);
  }, [selectedCategory, selectedTool, selectedFilter, searchQuery, sortBy]);

  const visiblePrompts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="hero-mlv border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <p className="section-eyebrow mb-2">Khám phá kho Prompt</p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tất cả Prompt
          </h1>
          <p className="text-slate-400 mt-3 max-w-xl">
            {safePrompts.length}+ prompt chất lượng — lọc theo danh mục, công cụ AI và ưu đãi.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sticky top-24">
              <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Danh mục</h3>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                    selectedCategory === "all"
                      ? "bg-brand-50 text-brand-800 font-semibold ring-1 ring-brand-200"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Tất cả ({safePrompts.length})
                </button>
                {categoriesData.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center gap-2 ${
                      selectedCategory === cat.id
                        ? "bg-brand-50 text-brand-800 font-semibold ring-1 ring-brand-200"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>

              <h3 className="font-bold text-slate-900 mb-3 mt-6 text-sm uppercase tracking-wider">Bộ lọc nhanh</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedFilter("all")}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                    selectedFilter === "all"
                      ? "bg-brand-50 text-brand-800 font-semibold ring-1 ring-brand-200"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setSelectedFilter("hot")}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                    selectedFilter === "hot"
                      ? "bg-brand-50 text-brand-800 font-semibold ring-1 ring-brand-200"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Bán chạy
                </button>
                <button
                  onClick={() => setSelectedFilter("sale")}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                    selectedFilter === "sale"
                      ? "bg-brand-50 text-brand-800 font-semibold ring-1 ring-brand-200"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Khuyến mãi
                </button>
              </div>

              <h3 className="font-bold text-slate-900 mb-3 mt-6 text-sm uppercase tracking-wider">Công cụ AI</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedTool("all")}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                    selectedTool === "all"
                      ? "bg-brand-50 text-brand-800 font-semibold ring-1 ring-brand-200"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Tất cả
                </button>
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center gap-2 ${
                      selectedTool === tool.id
                        ? "bg-brand-50 text-brand-800 font-semibold ring-1 ring-brand-200"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{tool.icon}</span>
                    {tool.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600">{filtered.length} kết quả</span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tiêu đề, mô tả, hashtag..."
                  className="w-72 max-w-[45vw] rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm font-semibold text-slate-800 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-brand-500/30 rounded-lg cursor-pointer"
                >
                  <option value="popular">Bán chạy</option>
                  <option value="rating">Đánh giá cao</option>
                  <option value="newest">Mới nhất</option>
                  <option value="price-low">Giá thấp</option>
                  <option value="price-high">Giá cao</option>
                </select>
              </div>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {visiblePrompts.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 rounded-2xl border border-dashed border-slate-200 bg-white">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="font-bold text-slate-900 text-lg">Không tìm thấy prompt</h3>
                <p className="text-slate-500 mt-2">Thử thay đổi bộ lọc để xem thêm kết quả</p>
              </div>
            )}

            {filtered.length > 0 && hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => {
                    setIsPending(true);
                    setTimeout(() => {
                      setVisibleCount((prev) => prev + 24);
                      setIsPending(false);
                    }, 0);
                  }}
                  className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:border-brand-300 hover:text-brand-700 transition-colors"
                >
                  {isPending ? "Đang tải..." : "Xem thêm prompt"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
