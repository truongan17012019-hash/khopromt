"use client";

import { useEffect, useState } from "react";

export default function AdminAutomationPage() {
  const [enabled, setEnabled] = useState(true);
  const [onboardingMessage, setOnboardingMessage] = useState("");
  const [upsellPromptIds, setUpsellPromptIds] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/automation-settings");
      const json = await res.json();
      if (res.ok) {
        setEnabled(!!json?.data?.enabled);
        setOnboardingMessage(String(json?.data?.onboardingMessage || ""));
        setUpsellPromptIds((json?.data?.upsellPromptIds || []).join(", "));
      }
    })();
  }, []);

  const save = async () => {
    setMsg(null);
    const ids = upsellPromptIds
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const res = await fetch("/api/admin/automation-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled, onboardingMessage, upsellPromptIds: ids }),
    });
    const json = await res.json();
    setMsg(res.ok ? "Đã lưu automation." : json?.error || "Lưu thất bại");
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-slate-900">Automation sau mua</h1>
      <p className="text-sm text-slate-500 mt-1">Onboarding + upsell hiển thị tại trang thanh toán thành công.</p>

      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <label className="flex items-center gap-3 text-sm font-medium text-slate-800">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          Bật automation sau mua
        </label>

        <div>
          <p className="text-sm font-medium text-slate-700 mb-1">Thông điệp onboarding</p>
          <textarea
            value={onboardingMessage}
            onChange={(e) => setOnboardingMessage(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700 mb-1">Danh sách prompt upsell (phân tách dấu phẩy)</p>
          <input
            value={upsellPromptIds}
            onChange={(e) => setUpsellPromptIds(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="cskh-14, mkt-10, sale-1"
          />
        </div>

        <button onClick={save} className="px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold">
          Lưu
        </button>
        {msg && <p className="text-sm text-slate-600">{msg}</p>}
      </div>
    </div>
  );
}

