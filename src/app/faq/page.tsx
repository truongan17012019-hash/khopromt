'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqGroups = [
    {
      category: 'Mua Hàng',
      questions: [
        {
          id: 'q1',
          question: 'Làm thế nào để thanh toán?',
          answer: 'PromptVN hỗ trợ nhiều phương thức thanh toán bao gồm: thẻ tín dụng, thẻ ghi nợ, ví điện tử (Momo, Zalopay), và chuyển khoản ngân hàng. Tất cả giao dịch được mã hóa và bảo mật.',
        },
        {
          id: 'q2',
          question: 'Tôi nhận prompt như thế nào sau khi mua?',
          answer: 'Sau khi thanh toán thành công, bạn sẽ nhận được email xác nhận với liên kết tải xuống. Bạn cũng có thể truy cập prompt từ tài khoản cá nhân của bạn trong phần "Tài nguyên của tôi".',
        },
        {
          id: 'q3',
          question: 'Có chính sách hoàn tiền không?',
          answer: 'Có, chúng tôi cung cấp chính sách hoàn tiền trong vòng 7 ngày kể từ ngày mua. Để yêu cầu hoàn tiền, vui lòng liên hệ với đội hỗ trợ khách hàng của chúng tôi với lý do.',
        },
        {
          id: 'q4',
          question: 'Prompt bundle là gì?',
          answer: 'Bundle là tập hợp các prompt liên quan được bán với giá giảm so với mua từng cái. Ví dụ: bundle tiếp thị bao gồm prompt về email, social media và quảng cáo với giá 399,000đ thay vì 599,000đ.',
        },
      ],
    },
    {
      category: 'Tài Khoản',
      questions: [
        {
          id: 'q5',
          question: 'Làm thế nào để đăng ký tài khoản?',
          answer: 'Nhấp vào nút "Đăng ký" ở góc trên cùng bên phải trang chủ. Nhập email và mật khẩu của bạn, sau đó xác nhận email. Bạn sẽ nhận được email xác nhận trong vòng vài phút.',
        },
        {
          id: 'q6',
          question: 'Tôi quên mật khẩu, phải làm gì?',
          answer: 'Nhấp vào liên kết "Quên mật khẩu?" trên trang đăng nhập. Nhập email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật khẩu. Bạn có 24 giờ để đặt lại mật khẩu của mình.',
        },
        {
          id: 'q7',
          question: 'Dữ liệu cá nhân của tôi được bảo vệ như thế nào?',
          answer: 'Chúng tôi sử dụng mã hóa SSL, tường lửa và kiểm soát truy cập để bảo vệ dữ liệu của bạn. Chúng tôi không chia sẻ thông tin cá nhân với bên thứ ba cho mục đích tiếp thị.',
        },
        {
          id: 'q8',
          question: 'Tôi có thể xóa tài khoản của mình không?',
          answer: 'Có, bạn có thể yêu cầu xóa tài khoản từ cài đặt cá nhân hoặc liên hệ với đội hỗ trợ. Dữ liệu của bạn sẽ được xóa vĩnh viễn sau 30 ngày.',
        },
      ],
    },
    {
      category: 'Kỹ Thuật',
      questions: [
        {
          id: 'q9',
          question: 'Làm thế nào để sử dụng prompt?',
          answer: 'Sau khi tải xuống, bạn có thể sao chép prompt và dán vào bất kỳ AI nào như ChatGPT, Claude hoặc Gemini. Một số prompt có hướng dẫn cụ thể về cách sử dụng - vui lòng đọc trước khi áp dụng.',
        },
        {
          id: 'q10',
          question: 'Prompt có tương thích với những AI nào?',
          answer: 'Hầu hết prompt của chúng tôi tương thích với ChatGPT, Claude, Gemini và các mô hình LLM phổ biến khác. Mỗi prompt sẽ có ghi chú về AI được khuyên dùng.',
        },
        {
          id: 'q11',
          question: 'Prompt có được cập nhật không?',
          answer: 'Có, các tác giả thường xuyên cập nhật prompt để cải thiện kết quả. Bạn sẽ nhận được thông báo về cập nhật và có thể tải xuống phiên bản mới mà không cần thanh toán thêm.',
        },
        {
          id: 'q12',
          question: 'Nếu gặp vấn đề kỹ thuật, tôi nên làm gì?',
          answer: 'Vui lòng liên hệ với đội hỗ trợ của chúng tôi với mô tả chi tiết về vấn đề. Chúng tôi sẽ hỗ trợ bạn trong vòng 24 giờ. Email: support@promptvn.com hoặc sử dụng biểu mẫu liên hệ.',
        },
      ],
    },
  ];

  const filteredGroups = faqGroups
    .map((group) => ({
      ...group,
      questions: group.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((group) => group.questions.length > 0);

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <main className="bg-slate-50 py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-2 text-slate-900 text-center">
          Câu hỏi thường gặp
        </h1>
        <p className="text-slate-600 mb-8 text-center">
          Tìm câu trả lời nhanh chóng cho các câu hỏi phổ biến
        </p>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Tìm câu hỏi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          />
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <div key={group.category}>
                <h2 className="font-display text-2xl font-bold mb-4 text-slate-900">
                  {group.category}
                </h2>
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  {group.questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className={`border-b last:border-b-0 border-slate-200 ${
                        idx === 0 ? '' : ''
                      }`}
                    >
                      <button
                        onClick={() => toggleExpanded(q.id)}
                        className="w-full p-6 flex items-start justify-between hover:bg-slate-50 transition-colors text-left"
                      >
                        <span className="font-semibold text-slate-900 flex-1 pr-4">
                          {q.question}
                        </span>
                        <svg
                          className={`w-5 h-5 text-brand-600 flex-shrink-0 transition-transform ${
                            expandedId === q.id ? 'transform rotate-180' : ''
                          }`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedId === q.id && (
                        <div className="px-6 pb-6 text-slate-700 bg-slate-50 border-t border-slate-200">
                          {q.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">
                Không tìm thấy kết quả phù hợp. Vui lòng thử lại với từ khóa khác.
              </p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-white rounded-xl p-8 shadow-md text-center">
          <h3 className="font-display text-2xl font-bold mb-4 text-slate-900">
            Không tìm thấy câu trả lời?
          </h3>
          <p className="text-slate-600 mb-6">
            Liên hệ với đội hỗ trợ của chúng tôi - chúng tôi sẽ giúp bạn trong vòng 24 giờ
          </p>
          <Link
            href="/lien-he"
            className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
          >
            Liên hệ chúng tôi
          </Link>
        </div>
      </div>
    </main>
  );
}