import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DanhMucClientPage from "@/components/DanhMucClientPage";
import { getCategorySeoOverrides } from "@/lib/server/seo-settings";
import { getCategoriesFromSettings } from "@/lib/server/category-settings";

type FilterMode = "all" | "hot" | "sale";
type SortMode = "popular" | "rating" | "newest" | "price-low" | "price-high";

function normalizeFilter(input?: string): FilterMode {
  if (input === "hot" || input === "sale") return input;
  return "all";
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

export async function generateStaticParams() {
  const categories = await getCategoriesFromSettings();
  return categories.map((category) => ({ slug: category.id }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const categories = await getCategoriesFromSettings();
  const category = categories.find((item) => item.id === params.slug);
  if (!category) {
    return {
      title: "Danh mục prompt",
      alternates: { canonical: "/danh-muc" },
    };
  }
  const overrides = await getCategorySeoOverrides();
  const override = overrides[category.id] || {};
  const finalTitle = override.title || `Prompt ${category.name} chất lượng cao | PromptVN`;
  const finalDescription =
    override.description ||
    `${category.description}. Xem trước nội dung, so sánh giá và chọn prompt phù hợp danh mục ${category.name}.`;
  const hasRefinementParams =
    typeof searchParams?.filter === "string" ||
    typeof searchParams?.tool === "string" ||
    typeof searchParams?.search === "string" ||
    typeof searchParams?.sort === "string";

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: {
      canonical: `/danh-muc/${category.id}`,
    },
    robots: hasRefinementParams ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: `/danh-muc/${category.id}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
    },
  };
}

export default async function DanhMucSlugPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const queryFilter =
    typeof searchParams?.filter === "string"
      ? normalizeFilter(searchParams.filter)
      : "all";
  const queryTool = typeof searchParams?.tool === "string" ? searchParams.tool : "all";
  const querySort =
    typeof searchParams?.sort === "string" ? normalizeSort(searchParams.sort) : "popular";
  const querySearch = typeof searchParams?.search === "string" ? searchParams.search : "";
  const categories = await getCategoriesFromSettings();
  const category = categories.find((item) => item.id === params.slug);
  if (!category) {
    notFound();
  }
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Prompt ${category.name}`,
    description: category.description,
    url: `https://khopromt.pro/danh-muc/${category.id}`,
    about: {
      "@type": "Thing",
      name: category.name,
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />
      <DanhMucClientPage
        initialCategory={params.slug}
        initialFilter={queryFilter}
        initialTool={queryTool}
        initialSort={querySort}
        initialSearch={querySearch}
        categoriesData={categories}
      />
    </>
  );
}
