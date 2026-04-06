"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";

interface SellerProfile {
  id: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  default_bank_name?: string;
  default_bank_account?: string;
  email: string;
}

export default function SellerSettingsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    default_bank_name: "",
    default_bank_account: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/dang-nhap");
      return;
    }

    fetchProfile();
  }, [user, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/seller/settings", {
        headers: user?.access_token
          ? { Authorization: `Bearer ${user.access_token}` }
          : undefined,
      });

      if (!response.ok) {
        throw new Error("Failed to load profile");
      }

      const result = await response.json();
      setProfile(result.data);

      setFormData({
        display_name: result.data.display_name || "",
        bio: result.data.bio || "",
        default_bank_name: result.data.default_bank_name || "",
        default_bank_account: result.data.default_bank_account || "",
      });
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to load profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.display_name) {
      setToast({ type: "error", message: "Vui lòng nhập tên cửa hàng" });
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/seller/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(user?.access_token ? { Authorization: `Bearer ${user.access_token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to save settings");
      }

      setToast({ type: "success", message: "✅ Cài đặt đã được lưu!" });
      fetchProfile();
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Save failed",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">⏳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Cài Đặt Cửa Hàng</h1>
          <p className="text-slate-300 mt-2">Quản lý hồ sơ và thông tin thanh toán của bạn</p>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow p-6 backdrop-blur">
            <h2 className="text-lg font-semibold text-white mb-4">Thông Tin Tài Khoản</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-slate-300"
                />
                <p className="text-xs text-slate-400 mt-1">Email không thể thay đổi</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow p-6 backdrop-blur">
              <h2 className="text-lg font-semibold text-white mb-4">Hồ Sơ Cửa Hàng</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-100 mb-2">
                    Tên Cửa Hàng*
                  </label>
                  <input
                    type="text"
                    name="display_name"
                    value={formData.display_name}
                    onChange={handleChange}
                    placeholder="Ví dụ: Prompt Store Pro"
                    className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Tên này sẽ hiển thị cho khách mua hàng
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-100 mb-2">
                    Mô Tả Cửa Hàng
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Ví dụ: Chuyên cung cấp prompt chất lượng cao..."
                    rows={4}
                    className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">Tối đa 500 ký tự</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow p-6 backdrop-blur">
              <h2 className="text-lg font-semibold text-white mb-4">Thông Tin Thanh Toán</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-100 mb-2">
                    Tên Ngân Hàng Mặc Định
                  </label>
                  <input
                    type="text"
                    name="default_bank_name"
                    value={formData.default_bank_name}
                    onChange={handleChange}
                    placeholder="Ví dụ: Vietcombank, Techcombank"
                    className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-100 mb-2">
                    Số Tài Khoản Mặc Định
                  </label>
                  <input
                    type="text"
                    name="default_bank_account"
                    value={formData.default_bank_account}
                    onChange={handleChange}
                    placeholder="Ví dụ: 1234567890"
                    className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Thông tin này sẽ được sử dụng làm mặc định trong yêu cầu thanh toán
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow p-6 backdrop-blur">
              <h2 className="text-lg font-semibold text-white mb-4">Bảo Mật</h2>

              <button
                type="button"
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
              >
                Đổi Mật Khẩu
              </button>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {saving ? "Đang Lưu..." : "Lưu Cài Đặt"}
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-600 transition"
              >
                Hủy
              </button>
            </div>
          </form>
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
