import { MetadataRoute } from "next";
import { prompts, categories } from "@/data/prompts";
import { defaultBlogPosts } from "@/data/blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://khopromt.pro";
  const now = new Date();

  const staticPages = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/danh-muc`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/nang-cap-prompt`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/tro-ly-ao`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${baseUrl}/khoa-hoc`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/gioi-thieu`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/lien-he`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/dang-nhap`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/danh-muc?category=${cat.id}`,
    lastModified: now, changeFrequency: "weekly" as const, priority: 0.8,
  }));

  const promptPages = prompts.map((p) => ({
    url: `${baseUrl}/prompt/${p.id}`,
    lastModified: new Date(p.createdAt), changeFrequency: "weekly" as const, priority: 0.7,
  }));

  const blogPages = defaultBlogPosts
    .filter(p => p.published)
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: "weekly" as const, priority: 0.7,
    }));

  return [...staticPages, ...categoryPages, ...promptPages, ...blogPages];
}
