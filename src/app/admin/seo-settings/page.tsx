"use client";

import { useEffect, useState } from "react";

type FormState = {
  site_name: string;
  base_url: string;
  default_title: string;
  default_description: string;
  default_og_image: string;
  google_verification: string;
};

const initialState: FormState = {
  site_name: "PromptVN",
  base_url: "https://khopromt.pro",
  default_title: "PromptVN - Mua bán Prompt AI hàng đầu Việt Nam",
  default_description:
    "Khám phá 600+ prompt AI chất lượng cao cho ChatGPT, Claude, Midjourney, DALL-E.",
  default_og_image: "/og-image.jpg",
  google_verification: "",
};

export default function AdminSeoSettingsPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/admin/seo-settings");
        const json = await res.json();
        if (res.ok && json?.data) setForm(json.data);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const setField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/seo-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Save failed");
      setMessage("Đã lưu SEO settings.");
    } catch (error: any) {
      setMessage(error?.message || "Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-sm text-slate-500">Đang tải cài đặt SEO...</div>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-slate-900">SEO Settings</h1>
      <p className="text-sm text-slate-500 mt-1">Cài đặt SEO mặc định cho toàn website.</p>

      <div className="mt-6 bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
        <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="Site name" value={form.site_name} onChange={(e) => setField("site_name", e.target.value)} />
        <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="Base URL" value={form.base_url} onChange={(e) => setField("base_url", e.target.value)} />
        <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="Default title" value={form.default_title} onChange={(e) => setField("default_title", e.target.value)} />
        <textarea className="w-full border rounded-xl px-3 py-2 text-sm min-h-24" placeholder="Default description" value={form.default_description} onChange={(e) => setField("default_description", e.target.value)} />
        <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="Default OG image path" value={form.default_og_image} onChange={(e) => setField("default_og_image", e.target.value)} />
        <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="Google verification" value={form.google_verification} onChange={(e) => setField("google_verification", e.target.value)} />

        <button
          onClick={onSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-70"
        >
          {saving ? "Đang lưu..." : "Lưu cài đặt SEO"}
        </button>
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </div>
    </div>
  );
}
