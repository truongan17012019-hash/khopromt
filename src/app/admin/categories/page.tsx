"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/data/prompts";
type SeoMap = Record<string, { title?: string; description?: string }>;

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [seoMap, setSeoMap] = useState<SeoMap>({});
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/admin/categories");
      const json = await res.json();
      if (res.ok) setCategories(json?.data || []);
      const seoRes = await fetch("/api/admin/category-seo");
      const seoJson = await seoRes.json();
      if (seoRes.ok) setSeoMap(seoJson?.data || {});
    };
    load();
  }, []);

  const update = (idx: number, key: keyof Category, value: string | number) => {
    setCategories((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: value } as Category;
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categories),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Save failed");
      await fetch("/api/admin/category-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seoMap),
      });
      setMessage("Đã lưu chuyên mục.");
    } catch (error: any) {
      setMessage(error?.message || "Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-900">Chuyên mục & SEO</h1>
      <p className="text-sm text-slate-500 mt-1">Tạo/Sửa/Xóa chuyên mục thật (lưu DB).</p>
      <div className="mt-6 space-y-4">
        {categories.map((c, idx) => (
          <div
            key={`${c.id}-${idx}`}
            className="bg-white border rounded-2xl p-4"
            draggable
            onDragStart={() => setDragIndex(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIndex === null || dragIndex === idx) return;
              setCategories((prev) => {
                const next = [...prev];
                const [moved] = next.splice(dragIndex, 1);
                next.splice(idx, 0, moved);
                return next;
              });
              setDragIndex(null);
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-slate-900">{c.name || c.id}</p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Kéo để đổi thứ tự</span>
                <button
                  onClick={() =>
                    setCategories((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="text-xs text-red-600"
                >
                  Xóa
                </button>
              </div>
            </div>
            <input
              value={c.id}
              onChange={(e) => update(idx, "id", e.target.value)}
              placeholder="Slug id"
              className="w-full mt-2 border rounded-xl px-3 py-2 text-sm"
            />
            <input
              value={c.name}
              onChange={(e) => update(idx, "name", e.target.value)}
              placeholder="Tên chuyên mục"
              className="w-full mt-2 border rounded-xl px-3 py-2 text-sm"
            />
            <textarea
              value={c.description}
              onChange={(e) => update(idx, "description", e.target.value)}
              placeholder="Mô tả chuyên mục"
              className="w-full mt-2 border rounded-xl px-3 py-2 text-sm min-h-20"
            />
            <input
              value={seoMap[c.id]?.title || ""}
              onChange={(e) =>
                setSeoMap((prev) => ({
                  ...prev,
                  [c.id]: { ...(prev[c.id] || {}), title: e.target.value },
                }))
              }
              placeholder="SEO title"
              className="w-full mt-2 border rounded-xl px-3 py-2 text-sm"
            />
            <textarea
              value={seoMap[c.id]?.description || ""}
              onChange={(e) =>
                setSeoMap((prev) => ({
                  ...prev,
                  [c.id]: { ...(prev[c.id] || {}), description: e.target.value },
                }))
              }
              placeholder="SEO description"
              className="w-full mt-2 border rounded-xl px-3 py-2 text-sm min-h-20"
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input
                value={c.icon}
                onChange={(e) => update(idx, "icon", e.target.value)}
                placeholder="Icon"
                className="border rounded-xl px-3 py-2 text-sm"
              />
              <input
                value={c.color}
                onChange={(e) => update(idx, "color", e.target.value)}
                placeholder="Màu"
                className="border rounded-xl px-3 py-2 text-sm"
              />
            </div>
          </div>
        ))}
        <button
          onClick={() =>
            setCategories((prev) => [
              ...prev,
              {
                id: `cat-${Date.now()}`,
                name: "Chuyên mục mới",
                icon: "📁",
                description: "",
                count: 0,
                color: "bg-slate-500",
              },
            ])
          }
          className="px-4 py-2 rounded-xl border border-slate-200 text-sm"
        >
          + Thêm chuyên mục
        </button>
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="mt-4 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold disabled:opacity-70"
      >
        {saving ? "Đang lưu..." : "Lưu SEO chuyên mục"}
      </button>
      {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}
    </div>
  );
}
