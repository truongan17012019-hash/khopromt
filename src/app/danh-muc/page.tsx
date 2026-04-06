import DanhMucClientPage from "@/components/DanhMucClientPage";
import type { Metadata } from "next";
import { getCategoriesFromSettings } from "@/lib/server/category-settings";

type FilterMode = "all" | "hot" | "sale";
type SortMode = "popular" | "rating" | "newest" | "price-low" | "price-high";

function normalizeFilter(input?: string): FilterMode {
  if (input === "hot" || input === "sale") return input;
  return "all";
}

function getCategoryParam(searchParams?: { [key: string]: string | string[] | undefined }): string {
  if (typeof searchParams?.cat === "string") return searchParams.cat;
  if (typeof searchParams?.category === "string") return searchParams.category;
  return "";
}

function normalizeSort(input?: string): SortMode {
  if (
    input === "popular" ||
    input === "rating" ||
    input === "newest" ||
    input === "price-low" ||
    input === "price-high"
  ) {
    return input;
  }
  return "popular";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const queryCat = getCategoryParam(searchParams);
  const queryFilter =
    typeof searchParams?.filter === "string"
      ? normalizeFilter(searchParams.filter)
      : "all";
  const categories = await getCategoriesFromSettings();
  const categoryName =
    categories.find((c) => c.id === queryCat)?.name ||
    categories.find((c) => c.name === queryCat)?.name ||
    "";

  const suffix =
    queryFilter === "hot"
      ? " - Bán chạy"
      : queryFilter === "sale"
      ? " - Khuyến mãi"
      : categoryName
      ? ` - ${categoryName}`
      : "";
  const title = `Danh mục prompt AI${suffix} | PromptVN`;
  const description =
    queryFilter === "hot"
      ? "Khám phá các prompt AI bán chạy nhất theo từng danh mục, cập nhật liên tục."
      : queryFilter === "sale"
        ? "Tổng hợp prompt AI đang giảm giá, phù hợp nhiều mục tiêu công việc và kinh doanh."
        : categoryName
          ? `Tổng hợp prompt AI danh mục ${categoryName}, có xem trước và mua nhanh theo nhu cầu.`
          : "Khám phá kho prompt AI theo danh mục, công cụ và mức giá phù hợp.";
  const canonical = queryCat ? `/danh-muc/${queryCat}` : "/danh-muc";

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots:
      queryFilter !== "all" || !!queryCat
        ? { index: false, follow: true }
        : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: "/danh-muc",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function DanhMucPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const queryCat = getCategoryParam(searchParams) || "all";
  const queryFilter =
    typeof searchParams?.filter === "string"
      ? normalizeFilter(searchParams.filter)
      : "all";
  const queryTool = typeof searchParams?.tool === "string" ? searchParams.tool : "all";
  const querySort =
    typeof searchParams?.sort === "string" ? normalizeSort(searchParams.sort) : "popular";
  const querySearch = typeof searchParams?.search === "string" ? searchParams.search : "";

  const categoriesData = await getCategoriesFromSettings();
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Danh mục prompt AI",
    description: "Danh mục prompt AI theo lĩnh vực và nhu cầu sử dụng.",
    url: "https://khopromt.pro/danh-muc",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: categoriesData.map((cat, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: cat.name,
        url: `https://khopromt.pro/danh-muc/${cat.id}`,
      })),
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <DanhMucClientPage
        initialCategory={queryCat}
        initialFilter={queryFilter}
        initialTool={queryTool}
        initialSort={querySort}
        initialSearch={querySearch}
        categoriesData={categoriesData}
      />
    </>
  );
}