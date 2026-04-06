"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { blogCategories, BlogPost } from "@/data/blog-posts";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/blog?published=true", { cache: "no-store" })
      .then(r => r.json())
      .then((posts: BlogPost[]) => {
        const found = posts.find(p => p.slug === slug);
        setPost(found || null);
        if (found) setRelated(posts.filter(p => p.category === found.category && p.id !== found.id).slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const readTime = (c: string) => Math.max(1, Math.ceil(c.replace(/<[^>]+>/g, "").length / 800));
  const catName = (id: string) => blogCategories.find(c => c.id === id)?.name || id;

  if (loading) return <div className="min-h-screen bg-gray-50/30 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;
  if (!post) return <div className="min-h-screen bg-gray-50/30 flex flex-col items-center justify-center"><h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h1><Link href="/blog" className="text-primary-600 hover:underline">← Về trang Blog</Link></div>;

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/blog" className="text-primary-600 hover:underline text-sm mb-6 inline-block">← Quay lại Blog</Link>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="aspect-[21/9] overflow-hidden"><img src={post.image} alt={post.title} className="w-full h-full object-cover" /></div>
          <div className="p-6 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">{catName(post.category)}</span>
              <span className="text-xs text-gray-400">{post.createdAt}</span>
              <span className="text-xs text-gray-400">{readTime(post.content)} phút đọc</span>
              <span className="text-xs text-gray-400">{post.views.toLocaleString()} lượt xem</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
              <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">{post.author.charAt(0)}</div>
              <div><p className="font-medium text-gray-900 text-sm">{post.author}</p><p className="text-xs text-gray-400">Tác giả</p></div>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="ml-auto px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                {copied ? "Đã sao chép!" : "Chia sẻ"}
              </button>
            </div>
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            {post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
                {post.tags.map(tag => <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">#{tag}</span>)}
              </div>
            )}
          </div>
        </div>
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Bài viết liên quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(r => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <div className="aspect-[16/9] overflow-hidden"><img src={r.image} alt={r.title} className="w-full h-full object-cover" /></div>
                  <div className="p-4"><h3 className="font-bold text-gray-900 line-clamp-2">{r.title}</h3><p className="text-sm text-gray-400 mt-2">{r.createdAt}</p></div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
