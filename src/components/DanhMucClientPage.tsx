"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import PromptCard from "@/components/PromptCard";
import { prompts as staticPrompts, categories as defaultCategories, tools, type Category, type Prompt } from "@/data/prompts";

type FilterMode = "all" | "hot" | "sale";
type SortMode = "popular" | "rating" | "newest" | "price-low" | "price-high";

interface DanhMucClientPageProps {
  initialCategory?: string;
  initialFilter?: FilterMode;
  initialSearch?: string;
  initialTool?: string;
  initialSort?: SortMode;
  categoriesData?: Category[];
}

type ApiPrompt = {
  id: string;
  title?: string;
  description?: string;
  price?: number;
  original_price?: number | null;
  category_id?: string | null;
  tool_id?: string | null;
  rating?: number;
  review_count?: number;
  sold?: number;
  preview?: string;
  tags?: string[];
  difficulty?: "Dễ" | "Trung bình" | "Nâng cao";
  author_name?: string;
  created_at?: string;
  image_url?: string | null;
};

function normalizeSort(input?: string): SortMode {
  return input === "rating" ||
    input === "newest" ||
    input === "price-low" ||
    input === "price-high"
    ? input
    : "popular";
}

export default function DanhMucClientPage({
  initialCategory = "all",
  initialFilter = "all",
  initialSearch = "",
  initialTool = "all",
  initialSort = "popular",
  categoriesData = defaultCategories,
}: DanhMucClientPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const safeStaticPrompts = Array.isArray(staticPrompts) ? staticPrompts.filter(Boolean) : [];
  const [promptData, setPromptData] = useState<Prompt[]>(safeStaticPrompts);
  const [isPromptLoading, setIsPromptLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedTool, setSelectedTool] = useState<string>(initialTool);
  const [selectedFilter, setSelectedFilter] = useState<FilterMode>(initialFilter);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<SortMode>(initialSort);
  const [visibleCount, setVisibleCount] = useState<number>(24);
  const [isPending, setIsPending] = useState<boolean>(false);

  useEffect(() => {
    setSelectedCategory(initialCategory);
    setSelectedTool(initialTool);
    setSelectedFilter(initialFilter);
    setSearchQuery(initialSearch);
    setSortBy(normalizeSort(initialSort));
  }, [initialCategory, initialTool, initialFilter, initialSearch, initialSort]);

  useEffect(() => {
    let cancelled = false;
    const loadPrompts = async () => {
      try {
        setIsPromptLoading(true);
        const params = new URLSearchParams({
          page: "1",
          limit: "1000",
          sort: "popular",
        });
        const res = await fetch(`/api/prompts?${params.toString()}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load prompts");
        const json = await res.json();
        const apiRows: ApiPrompt[] = Array.isArray(json?.data) ? json.data : [];
        const mapped: Prompt[] = apiRows.map((row) => ({
          id: row.id,
          title: row.title || "Prompt AI",
          description: row.description || "Prompt AI chất lượng cao.",
          detailDescription: row.description || "",
          price: typeof row.price === "number" ? row.price : 0,
          originalPrice: typeof row.original_price === "number" ? row.original_price : undefined,
          category: row.category_id || "all",
          tool: row.tool_id || "chatgpt",
          rating: typeof row.rating === "number" ? row.rating : 4.8,
          reviewCount: typeof row.review_count === "number" ? row.review_count : 0,
          sold: typeof row.sold === "number" ? row.sold : 0,
          preview: row.preview || "Xem trước nội dung prompt...",
          fullContent: row.preview || row.description || "",
          tags: Array.isArray(row.tags) ? row.tags : [],
          difficulty: row.difficulty || "Trung bình",
          author: row.author_name || "PromptVN",
          createdAt: row.created_at || new Date().toISOString(),
          image: row.image_url || "/images/prompt-placeholder.jpg",
        }));
        if (!cancelled && mapped.length > 0) {
          setPromptData(mapped);
        }
      } catch {
        // Keep static dataset as fallback when API/Supabase is unavailable
      } finally {
        if (!cancelled) setIsPromptLoading(false);
      }
    };
    loadPrompts();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateUrl = (next: {
    category?: string;
    filter?: FilterMode;
    tool?: string;
    search?: string;
    sort?: SortMode;
  }) => {
    const category = next.category ?? selectedCategory;
    const filter = next.filter ?? selectedFilter;
    const tool = next.tool ?? selectedTool;
    const search = next.search ?? searchQuery;
    const sort = next.sort ?? sortBy;
    const params = new URLSearchParams();
    if (filter !== "all") params.set("filter", filter);
    if (tool !== "all") params.set("tool", tool);
    if (search.trim()) params.set("search", search.trim());
    if (sort !== "popular") params.set("sort", sort);
    const query = params.toString();
    const basePath = category === "all" ? "/danh-muc" : `/danh-muc/${category}`;
    router.replace(query ? `${basePath}?${query}` : basePath);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    updateUrl({ category: categoryId });
  };

  const handleFilterChange = (filter: FilterMode) => {
    setSelectedFilter(filter);
    updateUrl({ filter });
  };

  const handleToolChange = (toolId: string) => {
    setSelectedTool(toolId);
    updateUrl({ tool: toolId });
  };

  const handleSortChange = (value: string) => {
    const normalized = normalizeSort(value);
    setSortBy(normalized);
    updateUrl({ sort: normalized });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateUrl({ search: value });
  };

  const filtered = useMemo(() => {
    let next = [...promptData];

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
  }, [selectedCategory, selectedTool, selectedFilter, searchQuery, sortBy, promptData]);

  useEffect(() => {
    setVisibleCount(24);
    setIsPending(false);
  }, [selectedCategory, selectedTool, selectedFilter, searchQuery, sortBy, pathname]);

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
            {promptData.length}+ prompt chất lượng — lọc theo danh mục, công cụ AI và ưu đãi.
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
                  Tất cả ({promptData.length})
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
                  onClick={() => handleFilterChange("all")}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                    selectedFilter === "all"
                      ? "bg-brand-50 text-brand-800 font-semibold ring-1 ring-brand-200"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => handleFilterChange("hot")}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                    selectedFilter === "hot"
                      ? "bg-brand-50 text-brand-800 font-semibold ring-1 ring-brand-200"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Bán chạy
                </button>
                <button
                  onClick={() => handleFilterChange("sale")}
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
                  onClick={() => handleToolChange("all")}
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
                    onClick={() => handleToolChange(tool.id)}
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
                <span className="text-sm font-medium text-slate-600">
                  {isPromptLoading ? "Đang tải..." : `${filtered.length} kết quả`}
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Tìm theo tiêu đề, mô tả, hashtag..."
                  className="w-72 max-w-[45vw] rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
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
