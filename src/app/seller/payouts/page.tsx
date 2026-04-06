"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { FiDollarSign, FiCheck, FiClock, FiX, FiCreditCard } from "react-icons/fi";
import Toast from "@/components/Toast";

interface Payout {
  id: string;
  amount: number;
  status: "pending" | "processed" | "failed";
  bank_account?: string;
  bank_name?: string;
  payout_date?: string;
  created_at: string;
}

interface PayoutData {
  payouts: Payout[];
  groupedByStatus: {
    pending: Payout[];
    processed: Payout[];
    failed: Payout[];
  };
  totals: {
    totalPending: number;
    totalProcessed: number;
    totalFailed: number;
  };
}

export default function SellerPayoutsPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [data, setData] = useState<PayoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: 0,
    bankName: "",
    bankAccount: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/dang-nhap");
      return;
    }

    fetchPayouts();
  }, [user, router]);

  const fetchPayouts = async () => {
    try {
      const response = await fetch("/api/seller/payouts", {
        headers: user?.access_token
          ? { Authorization: `Bearer ${user.access_token}` }
          : undefined,
      });

      if (!response.ok) {
        throw new Error("Failed to load payouts");
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || formData.amount <= 0) {
      setToast({ type: "error", message: "Vui lòng nhập số tiền > 0" });
      return;
    }

    if (!formData.bankName || !formData.bankAccount) {
      setToast({ type: "error", message: "Vui lòng nhập đầy đủ thông tin tài khoản" });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/seller/payouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.access_token ? { Authorization: `Bearer ${user.access_token}` } : {}),
        },
        body: JSON.stringify({
          amount: formData.amount,
          bankName: formData.bankName,
          bankAccount: formData.bankAccount,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to request payout");
      }

      setToast({ type: "success", message: "✅ Yêu cầu thanh toán đã được tạo!" });
      setFormData({ amount: 0, bankName: "", bankAccount: "" });
      setShowRequestForm(false);
      fetchPayouts();
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Request failed",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Vui lòng đăng nhập</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">⏳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Thanh Toán</h1>
          <p className="text-gray-600 mt-2">Theo dõi các yêu cầu thanh toán và doanh thu</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-6">
            {error}
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Chờ Thanh Toán</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {(data.totals.totalPending / 1000).toFixed(0)}k đ
                  </p>
                </div>
                <FiClock className="text-4xl text-yellow-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Đã Thanh Toán</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(data.totals.totalProcessed / 1000).toFixed(0)}k đ
                  </p>
                </div>
                <FiCheck className="text-4xl text-green-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Thất Bại</p>
                  <p className="text-2xl font-bold text-red-600">
                    {(data.totals.totalFailed / 1000).toFixed(0)}k đ
                  </p>
                </div>
                <FiX className="text-4xl text-red-500 opacity-20" />
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <button
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FiDollarSign /> Yêu Cầu Thanh Toán
          </button>
        </div>

        {showRequestForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tạo Yêu Cầu Thanh Toán</h2>

            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Số Tiền (VND)*
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      amount: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="Ví dụ: 500000"
                  min={100000}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Tối thiểu 100k VND</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tên Ngân Hàng*
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      bankName: e.target.value,
                    }))
                  }
                  placeholder="Ví dụ: Vietcombank"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Số Tài Khoản*
                </label>
                <input
                  type="text"
                  value={formData.bankAccount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      bankAccount: e.target.value,
                    }))
                  }
                  placeholder="Ví dụ: 1234567890"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? "Đang Xử Lý..." : "Tạo Yêu Cầu"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="flex-1 bg-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Lịch Sử Thanh Toán ({data?.payouts.length || 0})
            </h2>
          </div>

          {!data?.payouts.length ? (
            <div className="px-6 py-12 text-center">
              <FiCreditCard className="mx-auto text-4xl text-gray-300 mb-3" />
              <p className="text-gray-600">Chưa có yêu cầu thanh toán</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ngày</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Số Tiền</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tài Khoản</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data?.payouts.map((payout) => (
                    <tr key={payout.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(payout.created_at).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {(payout.amount / 1000).toFixed(0)}k đ
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {payout.bank_account && payout.bank_name && (
                          <span>
                            {payout.bank_name} - ...{payout.bank_account.slice(-4)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            payout.status === "processed"
                              ? "bg-green-100 text-green-800"
                              : payout.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {payout.status === "processed"
                            ? "Đã Thanh Toán"
                            : payout.status === "pending"
                              ? "Chờ Xử Lý"
                              : "Thất Bại"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
