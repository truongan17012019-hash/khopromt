import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DanhMucClientPage from "@/components/DanhMucClientPage";
import { getCategorySeoOverrides } from "@/lib/server/seo-settings";
import { getCategoriesFromSettings } from "@/lib/server/category-settings";

export async function generateStaticParams() {
  const categories = await getCategoriesFromSettings();
  return categories.map((category) => ({ slug: category.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
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

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: {
      canonical: `/danh-muc/${category.id}`,
    },
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
}: {
  params: { slug: string };
}) {
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
        initialFilter="all"
        categoriesData={categories}
      />
    </>
  );
}
