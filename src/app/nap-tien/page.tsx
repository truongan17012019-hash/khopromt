"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

interface DepositRequest {
  id: string;
  email: string;
  username: string;
  amount: number;
  transfer_content: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  reviewed_at?: string;
}

interface BankInfo {
  bank_name: string;
  bank_account_number: string;
  bank_account_holder: string;
  bank_qr_image: string;
}

interface Transaction {
  email: string;
  action: "deposit" | "deduct";
  amount: number;
  balance_after: number;
  note: string;
  created_at: string;
}

export default function NapTienPage() {
  const { isLoggedIn, user } = useAuthStore();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [requests, setRequests] = useState<DepositRequest[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const username = user?.email ? user.email.split("@")[0] : "";
  const transferContent = `${username} naptien`;

  const refreshData = useCallback(async (showLoading = false) => {
    if (!user?.email) return;
    if (showLoading) setLoading(true);
    try {
      const [balRes, reqRes, bankRes] = await Promise.all([
        fetch(`/api/user/balance?email=${encodeURIComponent(user.email)}`, { cache: "no-store" }),
        fetch(`/api/user/deposit-request?email=${encodeURIComponent(user.email)}`, { cache: "no-store" }),
        fetch("/api/admin/payment-settings", { cache: "no-store" }),
      ]);
      const balJson = await balRes.json();
      const reqJson = await reqRes.json();
      const bankJson = await bankRes.json();
      setBalance(Number(balJson?.balance) || 0);
      setTransactions(balJson?.transactions || []);
      setRequests(reqJson?.data || []);
      if (bankJson?.data) {
        setBankInfo({
          bank_name: bankJson.data.bank_name || "",
          bank_account_number: bankJson.data.bank_account_number || "",
          bank_account_holder: bankJson.data.bank_account_holder || "",
          bank_qr_image: bankJson.data.bank_qr_image || "",
        });
      }
    } catch {}
    setLoading(false);
  }, [user?.email]);

  // Initial load
  useEffect(() => {
    if (!isLoggedIn || !user?.email) return;
    refreshData(true);
  }, [isLoggedIn, user?.email, refreshData]);

  // Auto-refresh when tab gets focus (e.g. after admin approves deposit)
  useEffect(() => {
    if (!isLoggedIn || !user?.email) return;
    const onFocus = () => refreshData(false);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") refreshData(false);
    });
    // Also poll every 30s for pending deposits
    const interval = setInterval(() => {
      if (requests.some(r => r.status === "pending")) refreshData(false);
    }, 30000);
    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(interval);
    };
  }, [isLoggedIn, user?.email, refreshData, requests]);

  const handleSubmit = async () => {
    const amountNum = Number(amount);
    if (!amountNum || amountNum < 10000) {
      setMessage({ type: "error", text: "Số tiền tối thiểu là 10,000đ" });
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/user/deposit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email,
          username,
          amount: amountNum,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gửi yêu cầu thất bại");
      setMessage({ type: "success", text: "Đã gửi yêu cầu nạp tiền! Vui lòng chuyển khoản theo thông tin bên dưới." });
      setAmount("");
      // Reload all data
      await refreshData(false);
    } catch (e: any) {
      setMessage({ type: "error", text: e?.message || "Có lỗi xảy ra" });
    }
    setSubmitting(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="font-display text-2xl font-bold text-gray-900">
            Vui lòng đăng nhập
          </h2>
          <p className="text-gray-500 mt-2">Bạn cần đăng nhập để nạp tiền</p>
          <Link href="/dang-nhap" className="inline-block mt-6 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000];

  // Generate VietQR URL for dynamic QR code
  const getVietQRUrl = (bankId: string, accountNo: string, accountName: string, amt: number, content: string) => {
    return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amt}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(accountName)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
          Nạp tiền vào ví
        </h1>
        <p className="text-gray-500 mb-8">
          Nạp tiền một lần, mua nhiều prompt tùy thích
        </p>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">Số dư hiện tại</p>
              <p className="text-3xl font-bold mt-1">{formatPrice(balance)}</p>
            </div>
            <button
              type="button"
              onClick={() => refreshData(false)}
              className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center hover:bg-white/30 transition-colors"
              title="Làm mới số dư"
            >
              <span className="text-3xl">🔄</span>
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2">
            <span className="text-primary-100 text-sm">Tài khoản:</span>
            <span className="font-medium">{user?.email}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Deposit Form */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-display font-bold text-lg text-gray-900 mb-4">
                Tạo yêu cầu nạp tiền
              </h2>

              {/* Quick amounts */}
              <div className="flex flex-wrap gap-2 mb-4">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    onClick={() => setAmount(String(q))}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      amount === String(q)
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 text-gray-600 hover:border-primary-300"
                    }`}
                  >
                    {formatPrice(q)}
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số tiền nạp (VNĐ)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Nhập số tiền..."
                  min={10000}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {message && (
                <div className={`mb-4 p-3 rounded-xl text-sm ${
                  message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {message.text}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting || !amount}
                className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Đang gửi..." : "Gửi yêu cầu nạp tiền"}
              </button>
            </div>

            {/* Bank Transfer Info */}
            {bankInfo && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
                <h2 className="font-display font-bold text-lg text-gray-900 mb-4">
                  Thông tin chuyển khoản
                </h2>
                <div className="space-y-3 text-sm">
                  {bankInfo.bank_name && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ngân hàng</span>
                      <span className="font-semibold text-gray-900">{bankInfo.bank_name}</span>
                    </div>
                  )}
                  {bankInfo.bank_account_number && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Số tài khoản</span>
                      <span className="font-semibold text-gray-900">{bankInfo.bank_account_number}</span>
                    </div>
                  )}
                  {bankInfo.bank_account_holder && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Chủ tài khoản</span>
                      <span className="font-semibold text-gray-900">{bankInfo.bank_account_holder}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nội dung CK</span>
                    <span className="font-bold text-primary-700">{transferContent}</span>
                  </div>
                  {/* Dynamic VietQR code based on amount */}
                  {bankInfo.bank_account_number && (
                    <div className="mt-4 flex flex-col items-center gap-3">
                      <img
                        src={amount && Number(amount) >= 10000
                          ? getVietQRUrl(
                              bankInfo.bank_name.toLowerCase().replace(/\s+/g, '').replace('ngânhàng', '').replace('bank', '') || 'mbbank',
                              bankInfo.bank_account_number,
                              bankInfo.bank_account_holder,
                              Number(amount),
                              transferContent
                            )
                          : bankInfo.bank_qr_image || `https://img.vietqr.io/image/mbbank-${bankInfo.bank_account_number}-compact2.png?addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(bankInfo.bank_account_holder)}`
                        }
                        alt="QR chuyển khoản"
                        className="w-56 h-56 object-contain rounded-xl border border-gray-200"
                      />
                      <p className="text-xs text-gray-500 text-center">
                        {amount && Number(amount) >= 10000
                          ? `Quét QR để chuyển ${formatPrice(Number(amount))}`
                          : "Nhập số tiền để tạo QR chuyển khoản tự động"}
                      </p>
                    </div>
                  )}
                  {bankInfo.bank_qr_image && !bankInfo.bank_account_number && (
                    <div className="mt-4 flex justify-center">
                      <img src={bankInfo.bank_qr_image} alt="QR chuyển khoản" className="w-48 h-48 object-contain rounded-xl border border-gray-200" />
                    </div>
                  )}
                </div>
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-xs text-amber-800">
                    <strong>Lưu ý:</strong> Nội dung chuyển khoản phải ghi đúng <strong>{transferContent}</strong> để admin duyệt nhanh hơn. Sau khi chuyển khoản, admin sẽ duyệt và số dư tự động cộng vào tài khoản.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Deposit History */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-display font-bold text-lg text-gray-900 mb-4">
                Lịch sử yêu cầu nạp
              </h2>
              {requests.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📋</div>
                  <p className="text-gray-500 text-sm">Chưa có yêu cầu nạp tiền nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.map((req) => (
                    <div key={req.id} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(req.amount)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                          req.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : req.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {req.status === "approved" ? "Đã duyệt" : req.status === "rejected" ? "Từ chối" : "Chờ duyệt"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        <span>Nội dung CK: <strong>{req.transfer_content}</strong></span>
                        <span className="mx-2">•</span>
                        <span>{new Date(req.created_at).toLocaleString("vi-VN")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Transaction History */}
            {transactions.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
                <h2 className="font-display font-bold text-lg text-gray-900 mb-4">
                  Lịch sử giao dịch ví
                </h2>
                <div className="space-y-2">
                  {transactions.map((tx, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                            tx.action === "deposit" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                          }`}>
                            {tx.action === "deposit" ? "+ Nạp" : "- Mua"}
                          </span>
                          <span className="text-xs text-gray-500 truncate">{tx.note}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {new Date(tx.created_at).toLocaleString("vi-VN")}
                        </div>
                      </div>
                      <div className="text-right ml-3">
                        <span className={`text-sm font-bold ${tx.action === "deposit" ? "text-green-600" : "text-orange-600"}`}>
                          {tx.action === "deposit" ? "+" : "-"}{formatPrice(tx.amount)}
                        </span>
                        <div className="text-xs text-gray-400">Còn: {formatPrice(tx.balance_after)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How it works */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
              <h2 className="font-display font-bold text-lg text-gray-900 mb-4">
                Hướng dẫn nạp tiền
              </h2>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Tạo yêu cầu", desc: "Nhập số tiền muốn nạp và gửi yêu cầu" },
                  { step: "2", title: "Chuyển khoản", desc: `Chuyển khoản đúng số tiền với nội dung: ${transferContent}` },
                  { step: "3", title: "Admin duyệt", desc: "Admin xác nhận và duyệt yêu cầu nạp tiền" },
                  { step: "4", title: "Nhận số dư", desc: "Số dư tự động cộng vào ví, dùng để mua prompt" },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <div className="w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
