import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase";
import PromptDetailClientPage from "@/components/PromptDetailClientPage";
import type { Prompt } from "@/data/prompts";
import { prompts } from "@/data/prompts";
import { cskhBundleSku, growthBundleSku } from "@/data/pricing";

export const dynamic = "force-dynamic";

async function getActivePromptById(id: string): Promise<Prompt | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("prompts")
    .select("id,title,description,price,original_price,category_id,tool_id,rating,review_count,sold,preview,full_content,tags,difficulty,author_name,image_url,created_at")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();
  if (!data) return null;
  const mapped: Prompt = {
    id: data.id,
    title: data.title,
    description: data.description,
    price: Number(data.price || 0),
    originalPrice: Number(data.original_price || 0),
    category: data.category_id,
    tool: data.tool_id,
    rating: Number(data.rating || 0),
    reviewCount: Number(data.review_count || 0),
    sold: Number(data.sold || 0),
    preview: data.preview || "",
    fullContent: data.full_content || "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    difficulty: data.difficulty || "Trung bình",
    author: data.author_name || "PromptVN",
    createdAt: data.created_at || "",
    image: data.image_url || "/og-image.jpg",
  };
  const localPrompt = id === growthBundleSku.id
    ? growthBundleSku
    : (prompts.find((p) => p.id === id) || null);
  if (!localPrompt) return mapped;
  // Local data là source of truth cho nội dung text (có dấu tiếng Việt).
  // Supabase chỉ ưu tiên cho dữ liệu số (giá, rating, sold) và metadata.
  return {
    ...mapped,
    ...localPrompt,
    price: mapped.price || localPrompt.price,
    originalPrice: mapped.originalPrice || localPrompt.originalPrice,
    rating: mapped.rating || localPrompt.rating,
    reviewCount: mapped.reviewCount || localPrompt.reviewCount,
    sold: mapped.sold || localPrompt.sold,
    image: mapped.image || localPrompt.image,
    createdAt: mapped.createdAt || localPrompt.createdAt,
  };
}

function getLocalPromptById(id: string): Prompt | null {
  if (id === growthBundleSku.id) return growthBundleSku;
  if (id === cskhBundleSku.id) return cskhBundleSku;
  return prompts.find((p) => p.id === id) || null;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const prompt = (await getActivePromptById(params.id)) || getLocalPromptById(params.id);
  if (!prompt) {
    return {
      title: "Không tìm thấy prompt",
      alternates: { canonical: "/danh-muc" },
    };
  }

  const seoSource = String(prompt.detailDescription || prompt.description || prompt.preview || "");
  const shortDescription = seoSource
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 155);
  const title = `${prompt.title} | Prompt AI ${prompt.category} | PromptVN`;
  const keywords = Array.from(
    new Set([
      ...(Array.isArray(prompt.tags) ? prompt.tags : []),
      prompt.title,
      "prompt AI",
      "prompt chatgpt",
      "prompt claude",
      "prompt gemini",
      "prompt viet nam",
      "mua prompt",
    ])
  );
  return {
    title,
    description: shortDescription,
    keywords,
    alternates: {
      canonical: `/prompt/${prompt.id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description: shortDescription,
      url: `/prompt/${prompt.id}`,
      images: [{ url: prompt.image || "/og-image.jpg" }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: shortDescription,
      images: [prompt.image || "/og-image.jpg"],
    },
  };
}

export default async function PromptDetailPage({ params }: { params: { id: string } }) {
  const prompt = (await getActivePromptById(params.id)) || getLocalPromptById(params.id);
  if (!prompt) {
    notFound();
  }
  // BẢO MẬT: Không gửi fullContent xuống client - client sẽ fetch qua API riêng
  const safePrompt = { ...prompt, fullContent: "" };
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: prompt.title,
    description: prompt.detailDescription || prompt.description,
    image: [prompt.image || "/og-image.jpg"],
    brand: {
      "@type": "Brand",
      name: "PromptVN",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price: Number(prompt.price || 0),
      availability: "https://schema.org/InStock",
      url: `https://khopromt.pro/prompt/${prompt.id}`,
    },
    aggregateRating:
      Number(prompt.reviewCount || 0) > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: Number(prompt.rating || 0),
            reviewCount: Number(prompt.reviewCount || 0),
          }
        : undefined,
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <PromptDetailClientPage prompt={safePrompt} />
    </>
  );
}