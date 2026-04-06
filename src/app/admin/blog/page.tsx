"use client";
import { useState, useEffect } from "react";
import { blogCategories, BlogPost } from "@/data/blog-posts";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/admin/blog", { cache: "no-store" }).then(r => r.json()).then(d => { setPosts(d); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(load, []);

  const genSlug = (t: string) => t.toLowerCase().replace(/[àáạảãăắằặẳẵâấầậẩẫ]/g,"a").replace(/[èéẹẻẽêếềệểễ]/g,"e").replace(/[ìíịỉĩ]/g,"i").replace(/[òóọỏõôốồộổỗơớờợởỡ]/g,"o").replace(/[ùúụủũưứừựửữ]/g,"u").replace(/[ỳýỵỷỹ]/g,"y").replace(/đ/g,"d").replace(/[^a-z0-9]+/g,"-").replace(/-+$/,"");

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const body = isNew ? editing : { ...editing, _method: "PUT" };
    await fetch("/api/admin/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false);
    setEditing(null);
    setIsNew(false);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Xóa bài viết này?")) return;
    await fetch("/api/admin/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _method: "DELETE", id }) });
    load();
  };

  const toggle = async (post: BlogPost) => {
    await fetch("/api/admin/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...post, _method: "PUT", published: !post.published }) });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Blog CMS</h1>
        <button onClick={() => { setIsNew(true); setEditing({ id:"",title:"",slug:"",excerpt:"",content:"",author:"PromptVN Team",category:"huong-dan",tags:[],image:"",published:false,createdAt:"",updatedAt:"",views:0 }); }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">+ Tạo bài viết mới</button>
      </div>

      {editing && (
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">{isNew ? "Tạo bài viết mới" : "Chỉnh sửa bài viết"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1">Tiêu đề</label>
              <input value={editing.title} onChange={e => setEditing({...editing, title: e.target.value, slug: isNew ? genSlug(e.target.value) : editing.slug})}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600" />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Slug</label>
              <input value={editing.slug} onChange={e => setEditing({...editing, slug: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600" />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Danh mục</label>
              <select value={editing.category} onChange={e => setEditing({...editing, category: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600">
                {blogCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Ảnh (URL)</label>
              <input value={editing.image} onChange={e => setEditing({...editing, image: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600" />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-400 block mb-1">Mô tả ngắn</label>
            <input value={editing.excerpt} onChange={e => setEditing({...editing, excerpt: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600" />
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-400 block mb-1">Tags (phân cách bằng dấu phẩy)</label>
            <input value={editing.tags.join(", ")} onChange={e => setEditing({...editing, tags: e.target.value.split(",").map(t=>t.trim()).filter(Boolean)})}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600" />
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-400 block mb-1">Nội dung (HTML)</label>
            <textarea value={editing.content} onChange={e => setEditing({...editing, content: e.target.value})} rows={10}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 font-mono text-sm" />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input type="checkbox" checked={editing.published} onChange={e => setEditing({...editing, published: e.target.checked})} className="rounded" />
              Xuất bản
            </label>
            <div className="ml-auto flex gap-2">
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="px-4 py-2 text-gray-400 hover:text-white">Hủy</button>
              <button onClick={save} disabled={saving} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
                {saving ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-gray-700">
            <th className="text-left px-4 py-3 text-gray-400 text-sm font-medium">Tiêu đề</th>
            <th className="text-left px-4 py-3 text-gray-400 text-sm font-medium">Danh mục</th>
            <th className="text-left px-4 py-3 text-gray-400 text-sm font-medium">Trạng thái</th>
            <th className="text-left px-4 py-3 text-gray-400 text-sm font-medium">Ngày tạo</th>
            <th className="text-right px-4 py-3 text-gray-400 text-sm font-medium">Thao tác</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">Đang tải...</td></tr> :
            posts.map(post => (
              <tr key={post.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                <td className="px-4 py-3 text-white font-medium">{post.title}</td>
                <td className="px-4 py-3 text-gray-300 text-sm">{blogCategories.find(c=>c.id===post.category)?.name}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggle(post)} className={`px-2 py-1 rounded-full text-xs font-medium ${post.published ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                    {post.published ? "Đã xuất bản" : "Bản nháp"}
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-400 text-sm">{post.createdAt}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => { setEditing(post); setIsNew(false); }} className="text-primary-400 hover:text-primary-300 text-sm mr-3">Sửa</button>
                  <button onClick={() => del(post.id)} className="text-red-400 hover:text-red-300 text-sm">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
