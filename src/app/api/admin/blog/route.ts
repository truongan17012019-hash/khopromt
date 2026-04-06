import { NextRequest, NextResponse } from "next/server";
import { defaultBlogPosts } from "@/data/blog-posts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function getPosts() {
  try {
    const res = await fetch(`${url}/rest/v1/app_settings?key=eq.blog_posts&select=value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=representation" },
      cache: "no-store",
    });
    const rows = await res.json();
    if (rows?.[0]?.value) return rows[0].value;
  } catch {}
  return [...defaultBlogPosts];
}

async function savePosts(posts: any[]) {
  await fetch(`${url}/rest/v1/app_settings`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({ key: "blog_posts", value: posts }),
  });
}

export async function GET() {
  return NextResponse.json(await getPosts());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const posts = await getPosts();
  if (body._method === "PUT") {
    const idx = posts.findIndex((p: any) => p.id === body.id);
    if (idx >= 0) posts[idx] = { ...posts[idx], ...body, updatedAt: new Date().toISOString().split("T")[0] };
    delete posts[idx]?._method;
    await savePosts(posts);
    return NextResponse.json({ ok: true });
  }
  if (body._method === "DELETE") {
    await savePosts(posts.filter((p: any) => p.id !== body.id));
    return NextResponse.json({ ok: true });
  }
  const newPost = {
    ...body, id: "blog-" + Date.now(),
    slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, ""),
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
    views: 0,
  };
  posts.unshift(newPost);
  await savePosts(posts);
  return NextResponse.json(newPost);
}
