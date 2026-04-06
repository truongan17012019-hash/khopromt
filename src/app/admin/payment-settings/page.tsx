"use client";

import { useEffect, useState } from "react";

type PaymentMode = "mock" | "live";

export default function AdminPaymentSettingsPage() {
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("mock");
  const [momoEnabled, setMomoEnabled] = useState(true);
  const [vnpayEnabled, setVnpayEnabled] = useState(true);
  const [bankEnabled, setBankEnabled] = useState(true);
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountHolder, setBankAccountHolder] = useState("");
  const [bankQrImage, setBankQrImage] = useState("");
  const [bankTransferNote, setBankTransferNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/payment-settings");
        const json = await res.json();
        if (res.ok && json?.data) {
          setPaymentMode(json.data.payment_mode);
          setMomoEnabled(!!json.data.momo_enabled);
          setVnpayEnabled(!!json.data.vnpay_enabled);
          setBankEnabled(!!json.data.bank_enabled);
          setBankName(json.data.bank_name || "");
          setBankAccountNumber(json.data.bank_account_number || "");
          setBankAccountHolder(json.data.bank_account_holder || "");
          setBankQrImage(json.data.bank_qr_image || "");
          setBankTransferNote(json.data.bank_transfer_note || "");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/payment-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_mode: paymentMode,
          momo_enabled: momoEnabled,
          vnpay_enabled: vnpayEnabled,
          bank_enabled: bankEnabled,
          bank_name: bankName,
          bank_account_number: bankAccountNumber,
          bank_account_holder: bankAccountHolder,
          bank_qr_image: bankQrImage,
          bank_transfer_note: bankTransferNote,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Save failed");
      setMessage("Đã lưu cài đặt thanh toán.");
    } catch (error: any) {
      setMessage(error?.message || "Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-slate-500">Đang tải cài đặt...</div>;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-slate-900">Payment Settings</h1>
      <p className="text-sm text-slate-500 mt-1">
        Quản lý chế độ thanh toán mock/live và bật tắt từng cổng.
      </p>

      <div className="mt-6 bg-white border border-slate-100 rounded-2xl p-6 space-y-6">
        <div>
          <p className="text-sm font-semibold text-slate-800 mb-2">Payment mode</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPaymentMode("mock")}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${
                paymentMode === "mock"
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Mock mode
            </button>
            <button
              onClick={() => setPaymentMode("live")}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${
                paymentMode === "live"
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Live mode
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={momoEnabled}
              onChange={(e) => setMomoEnabled(e.target.checked)}
            />
            Bật cổng MoMo
          </label>
          <label className="flex items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={vnpayEnabled}
              onChange={(e) => setVnpayEnabled(e.target.checked)}
            />
            Bật cổng VNPay
          </label>
          <label className="flex items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={bankEnabled}
              onChange={(e) => setBankEnabled(e.target.checked)}
            />
            Bật chuyển khoản ngân hàng
          </label>
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-4">
          <p className="text-sm font-semibold text-slate-800">Thông tin chuyển khoản</p>
          <input
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="Tên ngân hàng (VD: MB Bank)"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
          />
          <input
            value={bankAccountNumber}
            onChange={(e) => setBankAccountNumber(e.target.value)}
            placeholder="Số tài khoản"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
          />
          <input
            value={bankAccountHolder}
            onChange={(e) => setBankAccountHolder(e.target.value)}
            placeholder="Tên chủ tài khoản"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
          />
          <input
            value={bankQrImage}
            onChange={(e) => setBankQrImage(e.target.value)}
            placeholder="Link ảnh QR chuyển khoản (nếu có)"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
          />
          <textarea
            value={bankTransferNote}
            onChange={(e) => setBankTransferNote(e.target.value)}
            placeholder="Ghi chú chuyển khoản"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm min-h-24"
          />
        </div>

        <p className="text-xs text-slate-500">
          Lưu ý: secret key vẫn lấy từ environment variables server (Vercel env),
          không lưu trong trang quản trị.
        </p>

        <button
          onClick={onSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-70"
        >
          {saving ? "Đang lưu..." : "Lưu cài đặt"}
        </button>
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </div>
    </div>
  );
}
