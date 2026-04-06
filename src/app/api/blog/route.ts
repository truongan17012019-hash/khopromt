import { NextRequest, NextResponse } from "next/server";
import { defaultBlogPosts } from "@/data/blog-posts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const hdrs = () => ({ apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=representation" });

async function getStoredPosts() {
  try {
    const res = await fetch(`${url}/rest/v1/app_settings?key=eq.blog_posts&select=value`, { headers: hdrs(), cache: "no-store" });
    const rows = await res.json();
    if (rows?.[0]?.value) return rows[0].value;
  } catch {}
  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const published = searchParams.get("published");
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  let posts = (await getStoredPosts()) || defaultBlogPosts;
  if (published === "true") posts = posts.filter((p: any) => p.published);
  if (category) posts = posts.filter((p: any) => p.category === category);
  if (search) {
    const q = search.toLowerCase();
    posts = posts.filter((p: any) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
  }
  posts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json(posts);
}
