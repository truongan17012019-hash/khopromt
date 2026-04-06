"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { blogCategories, BlogPost } from "@/data/blog-posts";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/blog?published=true", { cache: "no-store" })
      .then(r => r.json()).then(d => { setPosts(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = posts.filter(p => {
    if (category !== "all" && p.category !== category) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const readTime = (c: string) => Math.max(1, Math.ceil(c.replace(/<[^>]+>/g, "").length / 800));
  const catName = (id: string) => blogCategories.find(c => c.id === id)?.name || id;

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Blog PromptVN</h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto">Chia sẻ kiến thức, mẹo hay và xu hướng mới nhất về AI & Prompt Engineering</p>
          <div className="mt-6 max-w-md mx-auto">
            <input type="text" placeholder="Tìm kiếm bài viết..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8 flex-wrap">
          <button onClick={() => setCategory("all")} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === "all" ? "bg-primary-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}>Tất cả</button>
          {blogCategories.map(c => (
            <button key={c.id} onClick={() => setCategory(c.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === c.id ? "bg-primary-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Không tìm thấy bài viết nào</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden group">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">{catName(post.category)}</span>
                  <h2 className="font-display font-bold text-lg text-gray-900 mt-3 mb-2 line-clamp-2">{post.title}</h2>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{post.author}</span>
                    <span>{post.createdAt} · {readTime(post.content)} phút đọc</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
