import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cách dùng prompt AI hiệu quả từ A-Z | PromptVN",
  description:
    "Hướng dẫn cách viết và dùng prompt AI hiệu quả cho ChatGPT, Claude, Gemini: cấu trúc prompt, mẹo tối ưu và checklist thực hành.",
  alternates: {
    canonical: "/cach-dung-prompt-ai",
  },
  openGraph: {
    title: "Cách dùng prompt AI hiệu quả từ A-Z | PromptVN",
    description:
      "Hướng dẫn thực hành prompt AI cho người mới và người đã dùng lâu, kèm mẫu áp dụng ngay.",
    url: "/cach-dung-prompt-ai",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cách dùng prompt AI hiệu quả từ A-Z | PromptVN",
    description:
      "Checklist và framework viết prompt rõ mục tiêu, rõ ngữ cảnh, rõ đầu ra.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Prompt tốt cần có gì?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Một prompt tốt nên có mục tiêu rõ ràng, bối cảnh đủ thông tin, tiêu chí đầu ra cụ thể và ví dụ mong muốn nếu có.",
      },
    },
    {
      "@type": "Question",
      name: "Vì sao cùng một prompt nhưng kết quả khác nhau?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kết quả phụ thuộc model, nhiệt độ, lịch sử hội thoại và độ rõ ràng của input. Nên chuẩn hóa format và thêm ràng buộc đầu ra.",
      },
    },
    {
      "@type": "Question",
      name: "Người mới bắt đầu nên làm gì trước?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bắt đầu từ mẫu prompt có sẵn, thay biến theo ngữ cảnh thực tế, đo kết quả theo checklist và lặp lại 2-3 vòng tối ưu.",
      },
    },
  ],
};

export default function CachDungPromptAiPage() {
  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <p className="text-sm font-semibold text-brand-600">Hướng dẫn thực chiến</p>
        <h1 className="mt-2 font-display text-3xl lg:text-4xl font-extrabold text-slate-900">
          Cách dùng prompt AI hiệu quả từ A-Z
        </h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          Nếu bạn đã từng thấy AI trả lời lan man, thiếu trọng tâm hoặc sai format, vấn đề thường nằm ở cách đặt prompt.
          Bài này giúp bạn chuẩn hóa cách viết prompt để ra kết quả ổn định hơn và tiết kiệm thời gian chỉnh sửa.
        </p>

        <div className="mt-8 space-y-8 text-slate-700">
          <section>
            <h2 className="text-xl font-bold text-slate-900">1) Công thức prompt 4 phần</h2>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>
                <strong>Mục tiêu:</strong> Bạn muốn AI làm gì? (viết bài, phân tích, tạo kịch bản...)
              </li>
              <li>
                <strong>Ngữ cảnh:</strong> Thông tin ngành, đối tượng, dữ liệu đầu vào.
              </li>
              <li>
                <strong>Ràng buộc:</strong> Độ dài, tone, định dạng, điều cấm.
              </li>
              <li>
                <strong>Đầu ra:</strong> Mẫu output cụ thể (bullet, bảng, checklist, JSON...).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">2) Checklist trước khi bấm gửi</h2>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>Đã nêu rõ người đọc/khách hàng mục tiêu chưa?</li>
              <li>Đã chỉ định format kết quả mong muốn chưa?</li>
              <li>Đã thêm ví dụ “đúng ý” và “không đúng ý” chưa?</li>
              <li>Đã có tiêu chí đo chất lượng đầu ra chưa?</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">3) Mẹo tối ưu nhanh trong 3 vòng</h2>
            <ol className="mt-3 space-y-2 list-decimal pl-5">
              <li>Vòng 1: lấy bản nháp nhanh để kiểm tra hướng.</li>
              <li>Vòng 2: sửa prompt theo điểm chưa đạt (thiếu chiều sâu, sai tone, sai format).</li>
              <li>Vòng 3: chốt prompt chuẩn + lưu mẫu tái sử dụng cho team.</li>
            </ol>
          </section>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="font-semibold text-slate-900">Muốn áp dụng ngay với mẫu sẵn?</p>
          <p className="text-sm text-slate-600 mt-1">
            Xem thư viện prompt theo danh mục và chọn mẫu phù hợp với công việc của bạn.
          </p>
          <Link
            href="/danh-muc"
            className="inline-block mt-3 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
          >
            Khám phá danh mục prompt
          </Link>
        </div>
      </section>
    </main>
  );
}
