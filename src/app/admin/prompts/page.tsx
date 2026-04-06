"use client";

import { useEffect, useMemo, useState } from "react";
import { categories } from "@/data/prompts";
import { formatPrice } from "@/lib/utils";

type AdminPrompt = {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price: number;
  category_id: string;
  sold: number;
  rating: number;
  preview: string;
  full_content: string;
  tags: string[];
  difficulty: string;
};

const emptyForm = {
  id: "",
  title: "",
  description: "",
  price: "0",
  original_price: "0",
  category_id: "marketing",
  preview: "",
  full_content: "",
  tags: "",
  difficulty: "Trung bình",
};

export default function AdminPromptsPage() {
  const [rows, setRows] = useState<AdminPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const loadPrompts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/prompts", { cache: "no-store" });
      const json = await res.json();
      setRows(Array.isArray(json?.data) ? json.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrompts();
  }, []);

  const filtered = useMemo(() => {
    let list = [...rows];
    if (selectedCat !== "all") list = list.filter((p) => p.category_id === selectedCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
    }
    return list;
  }, [rows, selectedCat, search]);

  const openCreate = () => {
    setIsEditing(false);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (prompt: AdminPrompt) => {
    setIsEditing(true);
    setForm({
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      price: String(prompt.price || 0),
      original_price: String(prompt.original_price || 0),
      category_id: prompt.category_id || "marketing",
      preview: prompt.preview || "",
      full_content: prompt.full_content || "",
      tags: (prompt.tags || []).join(", "),
      difficulty: prompt.difficulty || "Trung bình",
    });
    setShowModal(true);
  };

  const removePrompt = async (prompt: AdminPrompt) => {
    if (!confirm(`Xóa prompt "${prompt.title}"?`)) return;
    const res = await fetch(`/api/admin/prompts/${encodeURIComponent(prompt.id)}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Xóa thất bại");
      return;
    }
    await loadPrompts();
  };

  const savePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        id: form.id.trim(),
        slug: form.id.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price || 0),
        original_price: Number(form.original_price || form.price || 0),
        category_id: form.category_id,
        preview: form.preview,
        full_content: form.full_content,
        tags: form.tags.split(",").map((x) => x.trim()).filter(Boolean),
        difficulty: form.difficulty,
      };
      const url = isEditing
        ? `/api/admin/prompts/${encodeURIComponent(form.id)}`
        : "/api/admin/prompts";
      const method = isEditing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        alert("Lưu thất bại");
        return;
      }
      setShowModal(false);
      await loadPrompts();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Quản lý Prompt</h1>
          <p className="text-slate-500 text-sm mt-1">Tổng: {rows.length} prompt</p>
        </div>
        <button onClick={openCreate} className="ui-btn-primary">
          + Thêm Prompt
        </button>
      </div>

      <div className="ui-card p-4 mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo id hoặc tiêu đề..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ui-input flex-1 min-w-[200px]"
        />
        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="ui-select w-auto"
        >
          <option value="all">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="ui-table-wrap">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="ui-th">Prompt</th>
              <th className="ui-th">Danh mục</th>
              <th className="ui-th">Giá</th>
              <th className="ui-th">Đã bán</th>
              <th className="ui-th text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-5 py-4 text-sm text-slate-500" colSpan={5}>Đang tải...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td className="px-5 py-4 text-sm text-slate-500" colSpan={5}>Không có prompt</td></tr>
            ) : (
              filtered.map((prompt) => (
                <tr key={prompt.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="ui-td">
                    <p className="text-sm font-medium text-slate-900">{prompt.title}</p>
                    <p className="text-xs text-slate-400">{prompt.id}</p>
                  </td>
                  <td className="ui-td text-slate-700">
                    {categories.find((c) => c.id === prompt.category_id)?.name || prompt.category_id}
                  </td>
                  <td className="ui-td font-semibold text-slate-900">{formatPrice(prompt.price)}</td>
                  <td className="ui-td text-slate-600">{prompt.sold || 0}</td>
                  <td className="ui-td text-right">
                    <button onClick={() => openEdit(prompt)} className="text-xs text-brand-600 font-medium mr-3">Sửa</button>
                    <button onClick={() => removePrompt(prompt)} className="text-xs text-red-500 font-medium">Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="ui-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 mx-4">
            <h2 className="font-display text-xl font-bold text-slate-900 mb-4">
              {isEditing ? "Sửa Prompt" : "Thêm Prompt"}
            </h2>
            <form className="space-y-3" onSubmit={savePrompt}>
              <input disabled={isEditing} value={form.id} onChange={(e) => setForm((s) => ({ ...s, id: e.target.value }))} placeholder="ID (vd: test-11)" className="ui-input disabled:bg-slate-50" />
              <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} placeholder="Tiêu đề" className="ui-input" />
              <textarea rows={2} value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} placeholder="Mô tả" className="ui-input" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={form.price} onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))} placeholder="Giá" className="ui-input" />
                <input type="number" value={form.original_price} onChange={(e) => setForm((s) => ({ ...s, original_price: e.target.value }))} placeholder="Giá gốc" className="ui-input" />
              </div>
              <select value={form.category_id} onChange={(e) => setForm((s) => ({ ...s, category_id: e.target.value }))} className="ui-select">
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={form.difficulty} onChange={(e) => setForm((s) => ({ ...s, difficulty: e.target.value }))} className="ui-select">
                <option>Dễ</option>
                <option>Trung bình</option>
                <option>Nâng cao</option>
              </select>
              <textarea rows={3} value={form.preview} onChange={(e) => setForm((s) => ({ ...s, preview: e.target.value }))} placeholder="Preview" className="ui-input" />
              <textarea rows={5} value={form.full_content} onChange={(e) => setForm((s) => ({ ...s, full_content: e.target.value }))} placeholder="Full content" className="ui-input" />
              <input value={form.tags} onChange={(e) => setForm((s) => ({ ...s, tags: e.target.value }))} placeholder="Tags, cách nhau dấu phẩy" className="ui-input" />
              <div className="flex gap-3 pt-2">
                <button disabled={saving} type="submit" className="ui-btn-primary px-6 py-2.5">
                  {saving ? "Đang lưu..." : "Lưu Prompt"}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="ui-btn-ghost px-6 py-2.5">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}