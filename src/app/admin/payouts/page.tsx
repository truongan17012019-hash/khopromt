"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiAlertCircle, FiClock } from "react-icons/fi";
import Toast from "@/components/Toast";

interface PayoutRequest {
  id: string;
  seller_id: string;
  seller_email: string;
  seller_name: string;
  amount: number;
  status: "pending" | "processed" | "failed";
  bank_name: string;
  bank_account: string;
  created_at: string;
  processed_at?: string;
}

interface PayoutStats {
  totalPending: number;
  totalProcessed: number;
  averagePayout: number;
}

export default function AdminPayoutManagementPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [stats, setStats] = useState<PayoutStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/dang-nhap");
      return;
    }

    if (user.role !== "admin") {
      router.push("/");
      return;
    }

    fetchPayouts();
  }, [user, router]);

  const fetchPayouts = async () => {
    try {
      const response = await fetch("/api/admin/payouts", {
        headers: user?.access_token
          ? { Authorization: `Bearer ${user.access_token}` }
          : undefined,
      });

      if (!response.ok) {
        throw new Error("Failed to load payouts");
      }

      const result = await response.json();
      setPayouts(result.data.payouts);
      setStats(result.data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayout = async (payoutId: string) => {
    setProcessingId(payoutId);

    try {
      const response = await fetch(`/api/admin/payouts/${payoutId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(user?.access_token ? { Authorization: `Bearer ${user.access_token}` } : {}),
        },
        body: JSON.stringify({
          status: "processed",
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to process payout");
      }

      setToast({ type: "success", message: "✅ Thanh toán đã được xử lý!" });
      fetchPayouts();
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Processing failed",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleFailPayout = async (payoutId: string) => {
    setProcessingId(payoutId);

    try {
      const response = await fetch(`/api/admin/payouts/${payoutId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(user?.access_token ? { Authorization: `Bearer ${user.access_token}` } : {}),
        },
        body: JSON.stringify({
          status: "failed",
          reason: "Manual rejection by admin",
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to reject payout");
      }

      setToast({ type: "success", message: "✅ Thanh toán đã bị từ chối!" });
      fetchPayouts();
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Rejection failed",
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">⏳</div>
      </div>
    );
  }

  const pendingPayouts = payouts.filter((p) => p.status === "pending");
  const processedPayouts = payouts.filter((p) => p.status === "processed");
  const failedPayouts = payouts.filter((p) => p.status === "failed");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Thanh Toán Người Bán</h1>
          <p className="text-gray-600 mt-2">Xử lý yêu cầu rút tiền từ người bán</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-6">
            {error}
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Chờ Xử Lý</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {(stats.totalPending / 1000).toFixed(0)}k đ
                  </p>
                  <p className="text-xs text-gray-500">{pendingPayouts.length} yêu cầu</p>
                </div>
                <FiClock className="text-4xl text-yellow-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Đã Xử Lý</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(stats.totalProcessed / 1000).toFixed(0)}k đ
                  </p>
                  <p className="text-xs text-gray-500">{processedPayouts.length} yêu cầu</p>
                </div>
                <FiCheckCircle className="text-4xl text-green-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Thất Bại</p>
                  <p className="text-2xl font-bold text-red-600">{failedPayouts.length}</p>
                  <p className="text-xs text-gray-500">yêu cầu</p>
                </div>
                <FiAlertCircle className="text-4xl text-red-500 opacity-20" />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Yêu Cầu Chờ Xử Lý ({pendingPayouts.length})
            </h2>
          </div>

          {pendingPayouts.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-600">
              ✅ Không có yêu cầu chờ xử lý
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Người Bán
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Số Tiền
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Tài Khoản
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Ngày Yêu Cầu
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pendingPayouts.map((payout) => (
                    <tr key={payout.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        <div className="text-gray-900 font-medium">{payout.seller_name}</div>
                        <div className="text-xs text-gray-500">{payout.seller_email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        {(payout.amount / 1000).toFixed(0)}k đ
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {payout.bank_name} - ...{payout.bank_account.slice(-4)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(payout.created_at).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={() => handleProcessPayout(payout.id)}
                          disabled={processingId === payout.id}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50 text-xs font-medium"
                        >
                          {processingId === payout.id ? "..." : "Xử Lý"}
                        </button>
                        <button
                          onClick={() => handleFailPayout(payout.id)}
                          disabled={processingId === payout.id}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 text-xs font-medium"
                        >
                          Từ Chối
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Các Thanh Toán Hoàn Tất ({processedPayouts.length})
            </h2>
          </div>

          {processedPayouts.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-600">
              Chưa có thanh toán nào hoàn tất
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Người Bán
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Số Tiền
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Ngày Xử Lý
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {processedPayouts.slice(0, 10).map((payout) => (
                    <tr key={payout.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        <div className="text-gray-900 font-medium">{payout.seller_name}</div>
                        <div className="text-xs text-gray-500">{payout.seller_email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        {(payout.amount / 1000).toFixed(0)}k đ
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {payout.processed_at
                          ? new Date(payout.processed_at).toLocaleDateString("vi-VN")
                          : "N/A"}
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
