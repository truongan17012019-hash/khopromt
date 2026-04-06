"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { FiLoader } from "react-icons/fi";
import Toast from "@/components/Toast";

interface Category {
  id: string;
  name: string;
}

interface Tool {
  id: string;
  name: string;
}

export default function SellerUpload() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    price: 0,
    category_id: "",
    tool_ids: [] as string[],
    image_url: "",
    tags: [] as string[],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { categories: localCats, tools: localTools } = await import("@/data/prompts");
        setCategories(localCats.slice(0, 6));
        setTools(localTools.slice(0, 4));
      } catch (err) {
        console.error("Failed to load categories/tools:", err);
      }
    };
    loadData();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Vui lòng đăng nhập để tải lên prompt</p>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleToolToggle = (toolId: string) => {
    setFormData((prev) => ({
      ...prev,
      tool_ids: prev.tool_ids.includes(toolId)
        ? prev.tool_ids.filter((id) => id !== toolId)
        : [...prev.tool_ids, toolId],
    }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    setFormData((prev) => ({
      ...prev,
      tags: tags.filter((tag) => tag.length > 0),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.title || !formData.description || !formData.content || !formData.category_id) {
        setToast({ type: "error", message: "Vui lòng điền tất cả các trường bắt buộc" });
        setLoading(false);
        return;
      }

      const response = await fetch("/api/seller/prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user.access_token ? { Authorization: `Bearer ${user.access_token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to upload prompt");
      }

      setToast({ type: "success", message: "✅ Prompt uploaded successfully!" });

      setTimeout(() => {
        router.push("/seller/dashboard");
      }, 2000);
    } catch (error) {
      setToast({
        type: "error",
        message: error instanceof Error ? error.message : "Upload failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tải Lên Prompt Mới</h1>
          <p className="text-gray-600 mb-8">Chia sẻ prompt AI của bạn với cộng đồng</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Tiêu Đề*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ví dụ: Advanced ChatGPT Prompts for Content Writing"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.title.length}/200 ký tự</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Mô Tả*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mô tả chi tiết về prompt của bạn..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Tối thiểu 20 ký tự</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Nội Dung Prompt*</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Paste nội dung prompt đầy đủ của bạn..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Giá (đ)*</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Ví dụ: 50000"
                  min={0}
                  max={10000000}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Danh Mục*</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Tools</label>
              <div className="grid grid-cols-2 gap-3">
                {tools.map((tool) => (
                  <label key={tool.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.tool_ids.includes(tool.id)}
                      onChange={() => handleToolToggle(tool.id)}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{tool.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Ảnh Bìa (URL)</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tags (cách nhau bằng dấu phẩy)
              </label>
              <input
                type="text"
                onChange={handleTagChange}
                placeholder="Ví dụ: writing, marketing, chatgpt"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <FiLoader className="animate-spin" />}
              {loading ? "Đang Tải Lên..." : "Tải Lên Prompt"}
            </button>
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
