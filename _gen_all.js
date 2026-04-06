const fs=require('fs'),path=require('path');
const B='D:/Promt/promptvn/src';
function w(p,c){const f=path.join(B,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,c.trimStart(),'utf8');console.log('OK:',p);}

// ========== BLOG DATA ==========
w('data/blog-posts.ts', `
export interface BlogPost {
  id: string; title: string; slug: string; excerpt: string; content: string;
  author: string; category: string; tags: string[]; image: string;
  published: boolean; createdAt: string; updatedAt: string; views: number;
}
export const blogCategories = [
  { id: "huong-dan", name: "Hướng dẫn", icon: "📖" },
  { id: "tin-tuc", name: "Tin tức AI", icon: "📰" },
  { id: "meo-hay", name: "Mẹo hay", icon: "💡" },
  { id: "case-study", name: "Case Study", icon: "📊" },
];
export const defaultBlogPosts: BlogPost[] = [
  {
    id:"blog-1",title:"Hướng dẫn viết Prompt AI hiệu quả cho người mới",slug:"huong-dan-viet-prompt-ai-hieu-qua",
    excerpt:"Tìm hiểu cách viết prompt AI chuyên nghiệp để có kết quả tốt nhất từ ChatGPT, Claude.",
    content:"<h2>Prompt AI là gì?</h2><p>Prompt AI là câu lệnh bạn gửi cho các mô hình ngôn ngữ lớn như ChatGPT, Claude. Một prompt tốt giúp bạn nhận được kết quả chính xác hơn.</p><h2>5 nguyên tắc</h2><p><strong>1. Rõ ràng cụ thể</strong> - Viết chi tiết yêu cầu.</p><p><strong>2. Cung cấp ngữ cảnh</strong> - Cho AI biết bối cảnh.</p><p><strong>3. Định dạng đầu ra</strong> - Chỉ rõ format mong muốn.</p><p><strong>4. Cho ví dụ</strong> - Cung cấp mẫu tham khảo.</p><p><strong>5. Lặp lại cải thiện</strong> - Chỉnh sửa prompt nhiều lần.</p>",
    author:"PromptVN Team",category:"huong-dan",tags:["prompt engineering","AI","hướng dẫn"],
    image:"https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    published:true,createdAt:"2024-03-15",updatedAt:"2024-03-15",views:1250
  },
  {
    id:"blog-2",title:"Top 10 xu hướng AI năm 2024 không thể bỏ qua",slug:"top-10-xu-huong-ai-2024",
    excerpt:"Khám phá những xu hướng AI nổi bật nhất năm 2024.",
    content:"<h2>AI đang thay đổi mọi thứ</h2><p>Năm 2024 chứng kiến bùng nổ AI. Từ GPT-4 Turbo đến Claude 3, các mô hình ngày càng mạnh.</p><p><strong>1. AI Agent tự động</strong> - Thực hiện công việc phức tạp.</p><p><strong>2. RAG</strong> - Kết hợp AI với dữ liệu doanh nghiệp.</p><p><strong>3. AI tạo video</strong> - Sora thay đổi sáng tạo.</p><p><strong>4. Coding Assistant</strong> - Copilot, Cursor thay đổi lập trình.</p>",
    author:"PromptVN Team",category:"tin-tuc",tags:["AI trends","2024"],
    image:"https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop",
    published:true,createdAt:"2024-03-10",updatedAt:"2024-03-10",views:980
  },
  {
    id:"blog-3",title:"7 mẹo sử dụng ChatGPT mà 90% người dùng không biết",slug:"7-meo-su-dung-chatgpt",
    excerpt:"Những mẹo ẩn giúp bạn khai thác tối đa sức mạnh ChatGPT.",
    content:"<h2>ChatGPT mạnh hơn bạn nghĩ</h2><p>Hầu hết người dùng chỉ dùng ChatGPT ở mức cơ bản.</p><p><strong>1. Custom Instructions</strong> - Thiết lập hướng dẫn tùy chỉnh.</p><p><strong>2. Chain of Thought</strong> - Yêu cầu AI suy nghĩ từng bước.</p><p><strong>3. Role Playing</strong> - Giao vai trò cụ thể.</p><p><strong>4. Few-shot Learning</strong> - Cho ví dụ mẫu.</p><p><strong>5. Output Formatting</strong> - Yêu cầu format cụ thể.</p>",
    author:"PromptVN Team",category:"meo-hay",tags:["ChatGPT","mẹo hay"],
    image:"https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&h=400&fit=crop",
    published:true,createdAt:"2024-03-08",updatedAt:"2024-03-08",views:2100
  },
  {
    id:"blog-4",title:"Case Study: Tăng 300% doanh thu nhờ AI Prompt",slug:"case-study-tang-300-doanh-thu",
    excerpt:"Câu chuyện thực tế doanh nghiệp Việt Nam dùng AI prompt tối ưu marketing.",
    content:"<h2>Bối cảnh</h2><p>Công ty ABC - startup TMĐT tại TP.HCM với đội marketing 3 người, ngân sách hạn chế.</p><h2>Giải pháp</h2><p>Sử dụng bộ prompt marketing từ PromptVN để tạo content, email marketing, phân tích đối thủ, tối ưu SEO.</p><h2>Kết quả</h2><p>Doanh thu tăng 300%, thời gian tạo content giảm 80%, engagement tăng 5 lần.</p>",
    author:"PromptVN Team",category:"case-study",tags:["case study","marketing"],
    image:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    published:true,createdAt:"2024-03-05",updatedAt:"2024-03-05",views:750
  },
  {
    id:"blog-5",title:"So sánh ChatGPT vs Claude vs Gemini",slug:"so-sanh-chatgpt-claude-gemini",
    excerpt:"Phân tích ưu nhược điểm của 3 AI chatbot phổ biến nhất.",
    content:"<h2>Ba ông lớn AI</h2><p>ChatGPT, Claude và Gemini là 3 AI phổ biến nhất. Mỗi công cụ có thế mạnh riêng.</p><p><strong>ChatGPT:</strong> Plugin phong phú, code tốt. <strong>Claude:</strong> Văn bản dài, phân tích sâu. <strong>Gemini:</strong> Tích hợp Google, multimodal.</p><p>Dùng ChatGPT cho code, Claude cho phân tích dài, Gemini cho Google tasks.</p>",
    author:"PromptVN Team",category:"huong-dan",tags:["so sánh","ChatGPT","Claude"],
    image:"https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&h=400&fit=crop",
    published:true,createdAt:"2024-03-01",updatedAt:"2024-03-01",views:1800
  },
  {
    id:"blog-6",title:"Cách dùng Midjourney tạo ảnh sản phẩm chuyên nghiệp",slug:"cach-dung-midjourney-tao-anh-san-pham",
    excerpt:"Hướng dẫn chi tiết sử dụng Midjourney tạo ảnh sản phẩm đẹp cho kinh doanh online.",
    content:"<h2>Tại sao Midjourney?</h2><p>Midjourney là công cụ AI tạo ảnh hàng đầu cho thương mại điện tử.</p><h2>Cấu trúc Prompt</h2><p>Chủ thể + Phong cách + Ánh sáng + Góc chụp + Thông số (--ar, --v, --s, --q).</p><p>Ví dụ: professional product photography of luxury watch on marble surface, soft studio lighting --ar 4:3 --v 6 --s 750</p>",
    author:"PromptVN Team",category:"huong-dan",tags:["Midjourney","ảnh sản phẩm"],
    image:"https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=800&h=400&fit=crop",
    published:true,createdAt:"2024-02-28",updatedAt:"2024-02-28",views:1500
  },
];
`);

// ========== BLOG PUBLIC API ==========
w('app/api/blog/route.ts', `
import { NextRequest, NextResponse } from "next/server";
import { defaultBlogPosts } from "@/data/blog-posts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const hdrs = { apikey: key, Authorization: \`Bearer \${key}\`, "Content-Type": "application/json", Prefer: "return=representation" };

async function getStoredPosts() {
  try {
    const res = await fetch(\`\${url}/rest/v1/app_settings?key=eq.blog_posts&select=value\`, { headers: hdrs, cache: "no-store" });
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
`);

// ========== BLOG ADMIN API ==========
w('app/api/admin/blog/route.ts', `
import { NextRequest, NextResponse } from "next/server";
import { defaultBlogPosts } from "@/data/blog-posts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const hdrs = { apikey: key, Authorization: \`Bearer \${key}\`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=representation" };

async function getPosts() {
  try {
    const res = await fetch(\`\${url}/rest/v1/app_settings?key=eq.blog_posts&select=value\`, { headers: {...hdrs, Prefer:"return=representation"}, cache: "no-store" });
    const rows = await res.json();
    if (rows?.[0]?.value) return rows[0].value;
  } catch {}
  return [...defaultBlogPosts];
}

async function savePosts(posts: any[]) {
  await fetch(\`\${url}/rest/v1/app_settings\`, {
    method: "POST", headers: hdrs,
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
    if (idx >= 0) { posts[idx] = { ...posts[idx], ...body, updatedAt: new Date().toISOString().split("T")[0] }; }
    await savePosts(posts);
    return NextResponse.json({ ok: true });
  }
  if (body._method === "DELETE") {
    const filtered = posts.filter((p: any) => p.id !== body.id);
    await savePosts(filtered);
    return NextResponse.json({ ok: true });
  }
  const newPost = {
    ...body, id: "blog-" + Date.now(),
    slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/,""),
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
    views: 0,
  };
  posts.unshift(newPost);
  await savePosts(posts);
  return NextResponse.json(newPost);
}
`);

// ========== BLOG PUBLIC PAGE ==========
w('app/blog/page.tsx', `
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

  const readTime = (content: string) => Math.max(1, Math.ceil(content.replace(/<[^>]+>/g, "").length / 1000));

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
          <button onClick={() => setCategory("all")} className={\`px-4 py-2 rounded-full text-sm font-medium transition-colors \${category === "all" ? "bg-primary-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}\`}>Tất cả</button>
          {blogCategories.map(c => (
            <button key={c.id} onClick={() => setCategory(c.id)} className={\`px-4 py-2 rounded-full text-sm font-medium transition-colors \${category === c.id ? "bg-primary-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}\`}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Không tìm thấy bài viết nào</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(post => (
              <Link key={post.id} href={\`/blog/\${post.slug}\`} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden group">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
