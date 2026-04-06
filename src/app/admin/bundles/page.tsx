"use client";

import { useCallback, useEffect, useState } from "react";

interface SpecialBundle {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  promptCount: number;
  tags: string[];
  ctaText: string;
  ctaLink: string;
  secondaryText: string;
  secondaryLink: string;
  badgeText: string;
  enabled: boolean;
  order: number;
}

function emptyBundle(): SpecialBundle {
  return {
    id: "bundle-" + Date.now(),
    name: "",
    subtitle: "",
    description: "",
    price: 0,
    originalPrice: 0,
    discount: 0,
    promptCount: 0,
    tags: [],
    ctaText: "Mua trọn bộ ngay",
    ctaLink: "/gio-hang",
    secondaryText: "Xem chi tiết →",
    secondaryLink: "/danh-muc",
    badgeText: "Mới — Gói chuyên biệt",
    enabled: true,
    order: 0,
  };
}

function BundleEditor({
  bundle,
  onChange,
  onDelete,
}: {
  bundle: SpecialBundle;
  onChange: (b: SpecialBundle) => void;
  onDelete: () => void;
}) {
  const set = (key: keyof SpecialBundle, val: unknown) =>
    onChange({ ...bundle, [key]: val });

  return (
    <div
      className={`rounded-2xl border p-5 space-y-4 ${
        bundle.enabled
          ? "border-brand-300 bg-white"
          : "border-slate-200 bg-slate-50 opacity-70"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 text-lg">
          {bundle.name || "Gói mới"}
        </h3>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={bundle.enabled}
              onChange={(e) => set("enabled", e.target.checked)}
            />
            Hiển thị
          </label>
          <button
            type="button"
            onClick={onDelete}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Xóa gói
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">ID (SKU)</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm bg-slate-50"
            value={bundle.id}
            onChange={(e) => set("id", e.target.value)}
            placeholder="sales-bundle"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Tên gói</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={bundle.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Sát Thủ Bán Hàng"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Phụ đề</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={bundle.subtitle}
            onChange={(e) => set("subtitle", e.target.value)}
            placeholder="Trọn bộ 50 Prompt Coach Bán Hàng Ảo"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Badge text</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={bundle.badgeText}
            onChange={(e) => set("badgeText", e.target.value)}
            placeholder="Mới — Gói chuyên biệt"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Mô tả</label>
        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm min-h-[72px]"
          value={bundle.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Mô tả chi tiết gói..."
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Giá bán (đ)</label>
          <input
            type="number"
            min={0}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={bundle.price}
            onChange={(e) => set("price", Number(e.target.value || 0))}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Giá gốc (đ)</label>
          <input
            type="number"
            min={0}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={bundle.originalPrice}
            onChange={(e) => set("originalPrice", Number(e.target.value || 0))}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">% Giảm</label>
          <input
            type="number"
            min={0}
            max={99}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={bundle.discount}
            onChange={(e) => set("discount", Number(e.target.value || 0))}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Số prompt</label>
          <input
            type="number"
            min={0}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={bundle.promptCount}
            onChange={(e) => set("promptCount", Number(e.target.value || 0))}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Tags (phân cách bằng dấu phẩy)
        </label>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          value={bundle.tags.join(", ")}
          onChange={(e) =>
            set(
              "tags",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
          placeholder="Thấu hiểu khách, Phá băng, Xử lý từ chối, Chốt đơn"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Text nút CTA chính</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={bundle.ctaText}
            onChange={(e) => set("ctaText", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Link nút CTA</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={bundle.ctaLink}
            onChange={(e) => set("ctaLink", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Text link phụ</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={bundle.secondaryText}
            onChange={(e) => set("secondaryText", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Link phụ</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={bundle.secondaryLink}
            onChange={(e) => set("secondaryLink", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Thứ tự hiển thị</label>
        <input
          type="number"
          min={0}
          className="w-32 border rounded-lg px-3 py-2 text-sm"
          value={bundle.order}
          onChange={(e) => set("order", Number(e.target.value || 0))}
        />
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-dashed border-slate-300 p-4 bg-gradient-to-br from-amber-500 via-orange-500 to-red-600">
        <p className="text-white/70 text-xs font-bold mb-2 uppercase tracking-wider">Preview</p>
        <div className="text-white">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-2">
            {bundle.badgeText || "Badge"}
          </span>
          <h4 className="text-xl font-extrabold">{bundle.name || "Tên gói"}</h4>
          <p className="text-sm text-white/90 mt-1">{bundle.subtitle}</p>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-white/50 text-sm line-through">
              {bundle.originalPrice.toLocaleString("vi-VN")} đ
            </span>
            <span className="text-2xl font-extrabold">
              {bundle.price.toLocaleString("vi-VN")} đ
            </span>
          </div>
          <p className="text-amber-100 text-xs font-bold mt-1">
            Tiết kiệm {bundle.discount}% — {bundle.promptCount} prompt
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminBundlesPage() {
  const [bundles, setBundles] = useState<SpecialBundle[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/bundles");
      const json = await res.json();
      if (res.ok && Array.isArray(json?.bundles)) {
        setBundles(json.bundles);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/bundles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundles }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Save failed");
      setMessage("Đã lưu thành công! Banner trang chủ sẽ cập nhật ngay.");
      await load();
    } catch (error: any) {
      setMessage("Lỗi: " + (error?.message || "Lưu thất bại"));
    } finally {
      setSaving(false);
    }
  };

  const addBundle = () => {
    setBundles((prev) => [...prev, emptyBundle()]);
  };

  const updateBundle = (idx: number, b: SpecialBundle) => {
    setBundles((prev) => prev.map((p, i) => (i === idx ? b : p)));
  };

  const deleteBundle = (idx: number) => {
    if (!confirm("Xóa gói này?")) return;
    setBundles((prev) => prev.filter((_, i) => i !== idx));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Gói chuyên biệt (Bundles)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý banner gói chuyên biệt hiển thị trên trang chủ. Hỗ trợ nhiều gói, bật/tắt, sắp xếp thứ tự.
          </p>
        </div>
        <button
          type="button"
          onClick={addBundle}
          className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
        >
          + Thêm gói mới
        </button>
      </div>

      {bundles.length === 0 ? (
        <div className="text-center py-16 bg-white border rounded-2xl">
          <p className="text-slate-500 text-lg">Chưa có gói nào</p>
          <p className="text-slate-400 text-sm mt-1">
            Nhấn &quot;+ Thêm gói mới&quot; để tạo gói chuyên biệt đầu tiên
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {bundles.map((bundle, idx) => (
            <BundleEditor
              key={bundle.id + idx}
              bundle={bundle}
              onChange={(b) => updateBundle(idx, b)}
              onDelete={() => deleteBundle(idx)}
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold disabled:opacity-70 hover:bg-brand-700 transition-colors"
        >
          {saving ? "Đang lưu..." : "Lưu toàn bộ"}
        </button>
        {message && (
          <p className={`text-sm ${message.startsWith("Lỗi") ? "text-red-600" : "text-emerald-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
