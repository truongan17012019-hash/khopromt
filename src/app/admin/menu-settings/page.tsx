"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/lib/store";

interface MenuItem {
  id: string; label: string; href: string; badge?: string; badgeColor?: string; visible: boolean; order: number;
}
interface UserMenuItem {
  id: string; label: string; href: string; visible: boolean; order: number;
}
interface FooterColumn {
  id: string; title: string; links: { id: string; label: string; href: string }[]; visible: boolean; order: number;
}
interface FooterSocial {
  id: string; label: string; href: string; visible: boolean;
}
interface PaymentMethod {
  id: string; label: string; shortLabel: string; color: string; visible: boolean;
}
interface MenuConfig {
  headerNav: MenuItem[];
  userMenu: UserMenuItem[];
  footerColumns: FooterColumn[];
  footerSocials: FooterSocial[];
  footerDescription: string;
  footerPaymentMethods: PaymentMethod[];
}

const uid = () => Math.random().toString(36).slice(2, 9);

export default function AdminMenuSettings() {
  const [config, setConfig] = useState<MenuConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"header" | "user" | "footer" | "social">("header");

  // -- edit modals
  const [editItem, setEditItem] = useState<any>(null);
  const [editType, setEditType] = useState<string>("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/menu-settings", { cache: "no-store" });
      const d = await r.json();
      setConfig(d);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!config) return;
    setSaving(true);
    try {
      await fetch("/api/admin/menu-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {} finally { setSaving(false); }
  };

  const moveItem = (arr: any[], idx: number, dir: -1 | 1) => {
    const next = [...arr];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return arr;
    [next[idx], next[target]] = [next[target], next[idx]];
    return next.map((it, i) => ({ ...it, order: i + 1 }));
  };

  if (loading || !config) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
    </div>
  );

  const tabs = [
    { key: "header", label: "Menu Header" },
    { key: "user", label: "Menu User" },
    { key: "footer", label: "Footer Columns" },
    { key: "social", label: "Social & Mô tả" },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Title + Save */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Menu & Footer</h1>
          <p className="text-sm text-gray-500 mt-1">Thêm, sửa, xoá, ẩn/hiện các mục menu. Thay đổi đồng bộ toàn bộ website.</p>
        </div>
        <button onClick={save} disabled={saving}
          className="px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2">
          {saving ? (
            <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Đang lưu...</>
          ) : saved ? (
            <><span>&#10003;</span> Đã lưu!</>
          ) : "Lưu thay đổi"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === t.key ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── TAB: Header Nav ─── */}
      {activeTab === "header" && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Các mục menu trên Header</h2>
            <button onClick={() => {
              setConfig({
                ...config,
                headerNav: [...config.headerNav, { id: uid(), label: "Mục mới", href: "/", badge: "", badgeColor: "", visible: true, order: config.headerNav.length + 1 }],
              });
            }} className="px-3 py-1.5 bg-primary-50 text-primary-600 text-sm font-medium rounded-lg hover:bg-primary-100 transition-colors">
              + Thêm mục
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {config.headerNav.sort((a,b) => a.order - b.order).map((item, idx) => (
              <div key={item.id} className={`flex items-center gap-3 px-4 py-3 ${!item.visible ? "opacity-40" : ""}`}>
                <div className="flex flex-col gap-1">
                  <button onClick={() => setConfig({ ...config, headerNav: moveItem(config.headerNav, idx, -1) })}
                    className="text-gray-400 hover:text-gray-700 text-xs leading-none">&#9650;</button>
                  <button onClick={() => setConfig({ ...config, headerNav: moveItem(config.headerNav, idx, 1) })}
                    className="text-gray-400 hover:text-gray-700 text-xs leading-none">&#9660;</button>
                </div>
                <div className="flex-1 grid grid-cols-4 gap-3">
                  <input value={item.label} onChange={e => {
                    const nav = [...config.headerNav]; nav[idx] = { ...nav[idx], label: e.target.value };
                    setConfig({ ...config, headerNav: nav });
                  }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm" placeholder="Tên hiển thị" />
                  <input value={item.href} onChange={e => {
                    const nav = [...config.headerNav]; nav[idx] = { ...nav[idx], href: e.target.value };
                    setConfig({ ...config, headerNav: nav });
                  }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm" placeholder="/đường-dẫn" />
                  <input value={item.badge || ""} onChange={e => {
                    const nav = [...config.headerNav]; nav[idx] = { ...nav[idx], badge: e.target.value };
                    setConfig({ ...config, headerNav: nav });
                  }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm" placeholder="Badge (NEW, HOT...)" />
                  <select value={item.badgeColor || ""} onChange={e => {
                    const nav = [...config.headerNav]; nav[idx] = { ...nav[idx], badgeColor: e.target.value };
                    setConfig({ ...config, headerNav: nav });
                  }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
                    <option value="">Không màu</option>
                    <option value="bg-red-500">Đỏ</option>
                    <option value="bg-gradient-to-r from-primary-500 to-purple-500">Tím gradient</option>
                    <option value="bg-green-500">Xanh lá</option>
                    <option value="bg-amber-500">Cam</option>
                    <option value="bg-blue-500">Xanh dương</option>
                  </select>
                </div>
                <button onClick={() => {
                  const nav = [...config.headerNav]; nav[idx] = { ...nav[idx], visible: !nav[idx].visible };
                  setConfig({ ...config, headerNav: nav });
                }} className={`px-2 py-1 rounded text-xs font-medium ${item.visible ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {item.visible ? "Hiện" : "Ẩn"}
                </button>
                <button onClick={() => {
                  setConfig({ ...config, headerNav: config.headerNav.filter(x => x.id !== item.id) });
                }} className="text-red-400 hover:text-red-600 text-sm">Xoá</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB: User Menu ─── */}
      {activeTab === "user" && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Menu dropdown User (khi đã đăng nhập)</h2>
            <button onClick={() => {
              setConfig({
                ...config,
                userMenu: [...config.userMenu, { id: uid(), label: "Mục mới", href: "/", visible: true, order: config.userMenu.length + 1 }],
              });
            }} className="px-3 py-1.5 bg-primary-50 text-primary-600 text-sm font-medium rounded-lg hover:bg-primary-100 transition-colors">
              + Thêm mục
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {config.userMenu.sort((a,b) => a.order - b.order).map((item, idx) => (
              <div key={item.id} className={`flex items-center gap-3 px-4 py-3 ${!item.visible ? "opacity-40" : ""}`}>
                <div className="flex flex-col gap-1">
                  <button onClick={() => setConfig({ ...config, userMenu: moveItem(config.userMenu, idx, -1) })}
                    className="text-gray-400 hover:text-gray-700 text-xs leading-none">&#9650;</button>
                  <button onClick={() => setConfig({ ...config, userMenu: moveItem(config.userMenu, idx, 1) })}
                    className="text-gray-400 hover:text-gray-700 text-xs leading-none">&#9660;</button>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <input value={item.label} onChange={e => {
                    const m = [...config.userMenu]; m[idx] = { ...m[idx], label: e.target.value };
                    setConfig({ ...config, userMenu: m });
                  }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm" placeholder="Tên hiển thị" />
                  <input value={item.href} onChange={e => {
                    const m = [...config.userMenu]; m[idx] = { ...m[idx], href: e.target.value };
                    setConfig({ ...config, userMenu: m });
                  }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm" placeholder="/đường-dẫn" />
                </div>
                <button onClick={() => {
                  const m = [...config.userMenu]; m[idx] = { ...m[idx], visible: !m[idx].visible };
                  setConfig({ ...config, userMenu: m });
                }} className={`px-2 py-1 rounded text-xs font-medium ${item.visible ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {item.visible ? "Hiện" : "Ẩn"}
                </button>
                <button onClick={() => {
                  setConfig({ ...config, userMenu: config.userMenu.filter(x => x.id !== item.id) });
                }} className="text-red-400 hover:text-red-600 text-sm">Xoá</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB: Footer Columns ─── */}
      {activeTab === "footer" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Các cột trong Footer</h2>
            <button onClick={() => {
              setConfig({
                ...config,
                footerColumns: [...config.footerColumns, {
                  id: uid(), title: "Cột mới", links: [], visible: true, order: config.footerColumns.length + 1
                }],
              });
            }} className="px-3 py-1.5 bg-primary-50 text-primary-600 text-sm font-medium rounded-lg hover:bg-primary-100 transition-colors">
              + Thêm cột
            </button>
          </div>

          {config.footerColumns.sort((a,b) => a.order - b.order).map((col, colIdx) => (
            <div key={col.id} className={`bg-white rounded-2xl border border-gray-200 overflow-hidden ${!col.visible ? "opacity-40" : ""}`}>
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <button onClick={() => setConfig({ ...config, footerColumns: moveItem(config.footerColumns, colIdx, -1) })}
                    className="text-gray-400 hover:text-gray-700 text-xs">&#9650;</button>
                  <button onClick={() => setConfig({ ...config, footerColumns: moveItem(config.footerColumns, colIdx, 1) })}
                    className="text-gray-400 hover:text-gray-700 text-xs">&#9660;</button>
                </div>
                <input value={col.title} onChange={e => {
                  const cols = [...config.footerColumns]; cols[colIdx] = { ...cols[colIdx], title: e.target.value };
                  setConfig({ ...config, footerColumns: cols });
                }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-semibold flex-1" placeholder="Tiêu đề cột" />
                <button onClick={() => {
                  const cols = [...config.footerColumns]; cols[colIdx] = { ...cols[colIdx], visible: !cols[colIdx].visible };
                  setConfig({ ...config, footerColumns: cols });
                }} className={`px-2 py-1 rounded text-xs font-medium ${col.visible ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {col.visible ? "Hiện" : "Ẩn"}
                </button>
                <button onClick={() => {
                  setConfig({ ...config, footerColumns: config.footerColumns.filter(x => x.id !== col.id) });
                }} className="text-red-400 hover:text-red-600 text-sm">Xoá cột</button>
              </div>
              <div className="p-4 space-y-2">
                {col.links.map((link, linkIdx) => (
                  <div key={link.id} className="flex items-center gap-2">
                    <input value={link.label} onChange={e => {
                      const cols = [...config.footerColumns];
                      const links = [...cols[colIdx].links];
                      links[linkIdx] = { ...links[linkIdx], label: e.target.value };
                      cols[colIdx] = { ...cols[colIdx], links };
                      setConfig({ ...config, footerColumns: cols });
                    }} className="px-2 py-1 border border-gray-200 rounded text-sm flex-1" placeholder="Tên link" />
                    <input value={link.href} onChange={e => {
                      const cols = [...config.footerColumns];
                      const links = [...cols[colIdx].links];
                      links[linkIdx] = { ...links[linkIdx], href: e.target.value };
                      cols[colIdx] = { ...cols[colIdx], links };
                      setConfig({ ...config, footerColumns: cols });
                    }} className="px-2 py-1 border border-gray-200 rounded text-sm flex-1" placeholder="/đường-dẫn" />
                    <button onClick={() => {
                      const cols = [...config.footerColumns];
                      cols[colIdx] = { ...cols[colIdx], links: cols[colIdx].links.filter(x => x.id !== link.id) };
                      setConfig({ ...config, footerColumns: cols });
                    }} className="text-red-400 hover:text-red-600 text-xs">Xoá</button>
                  </div>
                ))}
                <button onClick={() => {
                  const cols = [...config.footerColumns];
                  cols[colIdx] = { ...cols[colIdx], links: [...cols[colIdx].links, { id: uid(), label: "Link mới", href: "/" }] };
                  setConfig({ ...config, footerColumns: cols });
                }} className="text-primary-600 text-sm hover:underline mt-1">+ Thêm link</button>
              </div>
            </div>
          ))}

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Phương thức thanh toán (Footer)</h2>
            </div>
            <div className="p-4 space-y-2">
              {config.footerPaymentMethods.map((pm, pmIdx) => (
                <div key={pm.id} className={`flex items-center gap-3 ${!pm.visible ? "opacity-40" : ""}`}>
                  <input value={pm.label} onChange={e => {
                    const pms = [...config.footerPaymentMethods]; pms[pmIdx] = { ...pms[pmIdx], label: e.target.value };
                    setConfig({ ...config, footerPaymentMethods: pms });
                  }} className="px-2 py-1 border border-gray-200 rounded text-sm flex-1" placeholder="Tên" />
                  <input value={pm.shortLabel} onChange={e => {
                    const pms = [...config.footerPaymentMethods]; pms[pmIdx] = { ...pms[pmIdx], shortLabel: e.target.value };
                    setConfig({ ...config, footerPaymentMethods: pms });
                  }} className="px-2 py-1 border border-gray-200 rounded text-sm w-20" placeholder="Viết tắt" />
                  <select value={pm.color} onChange={e => {
                    const pms = [...config.footerPaymentMethods]; pms[pmIdx] = { ...pms[pmIdx], color: e.target.value };
                    setConfig({ ...config, footerPaymentMethods: pms });
                  }} className="px-2 py-1 border border-gray-200 rounded text-sm bg-white">
                    <option value="bg-pink-600">Hồng</option>
                    <option value="bg-blue-600">Xanh</option>
                    <option value="bg-amber-500">Cam</option>
                    <option value="bg-green-600">Xanh lá</option>
                    <option value="bg-red-600">Đỏ</option>
                    <option value="bg-purple-600">Tím</option>
                  </select>
                  <button onClick={() => {
                    const pms = [...config.footerPaymentMethods]; pms[pmIdx] = { ...pms[pmIdx], visible: !pms[pmIdx].visible };
                    setConfig({ ...config, footerPaymentMethods: pms });
                  }} className={`px-2 py-1 rounded text-xs font-medium ${pm.visible ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {pm.visible ? "Hiện" : "Ẩn"}
                  </button>
                  <button onClick={() => {
                    setConfig({ ...config, footerPaymentMethods: config.footerPaymentMethods.filter(x => x.id !== pm.id) });
                  }} className="text-red-400 hover:text-red-600 text-xs">Xoá</button>
                </div>
              ))}
              <button onClick={() => {
                setConfig({ ...config, footerPaymentMethods: [...config.footerPaymentMethods, { id: uid(), label: "Mới", shortLabel: "M", color: "bg-gray-600", visible: true }] });
              }} className="text-primary-600 text-sm hover:underline">+ Thêm phương thức</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: Social & Description ─── */}
      {activeTab === "social" && (
        <div className="space-y-6">
          {/* Footer Description */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
            <h2 className="font-semibold text-gray-800">Mô tả Footer</h2>
            <textarea value={config.footerDescription} onChange={e => setConfig({ ...config, footerDescription: e.target.value })}
              rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" placeholder="Mô tả ngắn hiển thị ở footer..." />
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Mạng xã hội</h2>
              <button onClick={() => {
                setConfig({ ...config, footerSocials: [...config.footerSocials, { id: uid(), label: "New", href: "https://", visible: true }] });
              }} className="px-3 py-1.5 bg-primary-50 text-primary-600 text-sm font-medium rounded-lg hover:bg-primary-100 transition-colors">
                + Thêm
              </button>
            </div>
            <div className="p-4 space-y-2">
              {config.footerSocials.map((s, sIdx) => (
                <div key={s.id} className={`flex items-center gap-3 ${!s.visible ? "opacity-40" : ""}`}>
                  <input value={s.label} onChange={e => {
                    const ss = [...config.footerSocials]; ss[sIdx] = { ...ss[sIdx], label: e.target.value };
                    setConfig({ ...config, footerSocials: ss });
                  }} className="px-2 py-1 border border-gray-200 rounded text-sm w-24" placeholder="FB, YT..." />
                  <input value={s.href} onChange={e => {
                    const ss = [...config.footerSocials]; ss[sIdx] = { ...ss[sIdx], href: e.target.value };
                    setConfig({ ...config, footerSocials: ss });
                  }} className="px-2 py-1 border border-gray-200 rounded text-sm flex-1" placeholder="https://..." />
                  <button onClick={() => {
                    const ss = [...config.footerSocials]; ss[sIdx] = { ...ss[sIdx], visible: !ss[sIdx].visible };
                    setConfig({ ...config, footerSocials: ss });
                  }} className={`px-2 py-1 rounded text-xs font-medium ${s.visible ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {s.visible ? "Hiện" : "Ẩn"}
                  </button>
                  <button onClick={() => {
                    setConfig({ ...config, footerSocials: config.footerSocials.filter(x => x.id !== s.id) });
                  }} className="text-red-400 hover:text-red-600 text-xs">Xoá</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Preview hint */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
        <strong>Lưu ý:</strong> Sau khi bấm &quot;Lưu thay đổi&quot;, Header và Footer trên toàn bộ website sẽ tự động cập nhật trong vòng 1 phút (khi user tải lại trang).
      </div>
    </div>
  );
}
