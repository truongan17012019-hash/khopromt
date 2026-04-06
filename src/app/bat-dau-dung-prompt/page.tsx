"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { prompts } from "@/data/prompts";
import { useAuthStore, usePurchaseStore } from "@/lib/store";

function sampleInputForPrompt(title: string, category: string) {
  return [
    `Mục tiêu: Dùng prompt "${title}" để tạo kết quả có thể áp dụng ngay.`,
    `Ngữ cảnh: Danh mục ${category}, đối tượng khách hàng là chủ shop online tại Việt Nam.`,
    "Ràng buộc: Viết bằng tiếng Việt, dễ hiểu, có ví dụ cụ thể, độ dài dưới 300 từ.",
    "Đầu ra mong muốn: 1 bản ngắn gọn + 1 bản chi tiết + checklist hành động.",
  ].join("\n");
}

function sampleOutputForPrompt(title: string) {
  return [
    `Kết quả mẫu cho "${title}"`,
    "",
    "1) Bản ngắn gọn:",
    "- Nêu ý chính trong 3-5 gạch đầu dòng",
    "- Có CTA rõ ràng",
    "",
    "2) Bản chi tiết:",
    "- Có cấu trúc mở bài - nội dung - kết luận",
    "- Có ví dụ thực tế dễ áp dụng",
    "",
    "3) Checklist triển khai:",
    "- [ ] Kiểm tra lại tone giọng",
    "- [ ] Đổi dữ liệu theo tình huống thật",
    "- [ ] Chạy thử và tối ưu vòng 2",
  ].join("\n");
}

export default function BatDauDungPromptPage() {
  const { isLoggedIn } = useAuthStore();
  const purchasedPromptIds = usePurchaseStore((s) => s.purchasedPromptIds);
  const [copiedKey, setCopiedKey] = useState<string>("");

  const purchasedPrompts = useMemo(
    () => prompts.filter((p) => purchasedPromptIds.includes(p.id)).slice(0, 12),
    [purchasedPromptIds]
  );

  const copyText = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 1400);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md text-center">
          <h1 className="font-display text-2xl font-bold text-slate-900">Bắt đầu dùng prompt</h1>
          <p className="text-slate-500 mt-2">Đăng nhập để xem prompt đã mua và dùng ngay theo mẫu input/output.</p>
          <Link
            href="/dang-nhap"
            className="inline-block mt-6 px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  if (purchasedPrompts.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md text-center">
          <h1 className="font-display text-2xl font-bold text-slate-900">Chưa có prompt để bắt đầu</h1>
          <p className="text-slate-500 mt-2">Bạn cần mua ít nhất 1 prompt để dùng trang onboarding này.</p>
          <Link
            href="/danh-muc"
            className="inline-block mt-6 px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700"
          >
            Khám phá prompt
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <p className="text-sm font-semibold text-brand-600">Onboarding sau mua</p>
        <h1 className="font-display text-3xl font-extrabold text-slate-900 mt-2">
          Bắt đầu dùng prompt trong 5 phút
        </h1>
        <p className="text-slate-600 mt-3 max-w-3xl">
          Chọn một prompt đã mua, copy nhanh mẫu input/output bên dưới, dán vào ChatGPT hoặc Claude rồi chỉnh lại theo ngữ cảnh thật.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Quy trình 3 bước:</p>
          <p className="mt-1">1) Copy Input mẫu → 2) Dán vào công cụ AI và sửa dữ liệu thật → 3) So với Output mẫu để tối ưu vòng 2.</p>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {purchasedPrompts.map((prompt) => {
            const inputText = sampleInputForPrompt(prompt.title, prompt.category);
            const outputText = sampleOutputForPrompt(prompt.title);
            return (
              <article key={prompt.id} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
                <div>
                  <p className="text-xs text-slate-500">{prompt.category}</p>
                  <h2 className="font-semibold text-slate-900 mt-1">{prompt.title}</h2>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase text-slate-500">Input mẫu</p>
                    <button
                      type="button"
                      onClick={() => copyText(`in-${prompt.id}`, inputText)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50"
                    >
                      {copiedKey === `in-${prompt.id}` ? "Đã copy" : "Copy input"}
                    </button>
                  </div>
                  <pre className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 whitespace-pre-wrap text-slate-700">
                    {inputText}
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase text-slate-500">Output mẫu</p>
                    <button
                      type="button"
                      onClick={() => copyText(`out-${prompt.id}`, outputText)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50"
                    >
                      {copiedKey === `out-${prompt.id}` ? "Đã copy" : "Copy output"}
                    </button>
                  </div>
                  <pre className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 whitespace-pre-wrap text-slate-700">
                    {outputText}
                  </pre>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/prompt/${prompt.id}`}
                    className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Mở prompt chi tiết →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
