export const metadata = {
  title: 'Workflow: Lập Kế Hoạch Content 30 Ngày | PromptVN',
  description: 'Quy trình lập kế hoạch content 30 ngày hiệu quả bằng AI',
};

export default function ContentCalendarPage() {
  const steps = [
    {
      number: 1,
      title: 'Phân tích',
      description: 'Xác định đối tượng, nền tảng và mục tiêu tiếp thị',
      template: 'Tôi là một [loại doanh nghiệp]. Đối tượng mục tiêu của tôi là [mô tả]. Mục tiêu chính là [tăng follow/bán hàng/thương hiệu]. Nền tảng: [Facebook/Instagram/TikTok]. Đưa ra 5 chủ đề nội dung phù hợp.',
      icon: '📊',
    },
    {
      number: 2,
      title: 'Content Pillars',
      description: 'Xác định 3-4 trụ cột nội dung chính',
      template: 'Dựa trên mục tiêu [mục tiêu tiếp thị], hãy tạo 4 content pillars. Mỗi pillar phải có: tên, mô tả (50 chữ), ví dụ bài viết.',
      icon: '🏛️',
    },
    {
      number: 3,
      title: 'Lên lịch',
      description: 'Lập kế hoạch bài viết cho 4 tuần',
      template: 'Tạo lịch content 30 ngày. Tuần 1-4, mỗi ngày 1 bài. Đa dạng theo content pillars: [pillar 1], [pillar 2], [pillar 3], [pillar 4]. Định dạng: Thứ 2 - Pillar X - [tiêu đề bài viết].',
      icon: '📅',
    },
    {
      number: 4,
      title: 'Viết content',
      description: 'Tạo nội dung chi tiết cho từng bài',
      template: 'Viết một bài [loại nội dung] về [chủ đề] cho [nền tảng]. Độ dài [số từ]. Tone: [chuyên nghiệp/hài hước/tình cảm]. Bao gồm [CTA/hashtag/câu hỏi].',
      icon: '✍️',
    },
    {
      number: 5,
      title: 'Review',
      description: 'Kiểm tra chất lượng, SEO, và sẵn sàng đăng',
      template: 'Review bài viết: [nội dung]. Kiểm tra: ngữ pháp, độ dài, CTA, hashtag phù hợp. Đề xuất cải thiện.',
      icon: '✅',
    },
    {
      number: 6,
      title: 'Đăng bài',
      description: 'Lên lịch đăng tự động hoặc đăng thủ công',
      template: 'Tạo caption cho bài viết [nội dung]. Caption phải: hấp dẫn, có emoji, hashtag (10-15), CTA rõ ràng. Độ dài: 2-3 đoạn.',
      icon: '🚀',
    },
  ];

  const weeks = [
    {
      week: 'Tuần 1',
      theme: 'Giới thiệu & Giáo dục',
      description: 'Tập trung vào xây dựng nhận thức thương hiệu',
    },
    {
      week: 'Tuần 2',
      theme: 'Giải quyết vấn đề',
      description: 'Chia sẻ cách giải quyết các vấn đề khách hàng',
    },
    {
      week: 'Tuần 3',
      theme: 'Tương tác & Cộng đồng',
      description: 'Bài viết tương tác, poll, Q&A',
    },
    {
      week: 'Tuần 4',
      theme: 'Chuyển đổi & Bán hàng',
      description: 'Tập trung vào bán sản phẩm/dịch vụ',
    },
  ];

  return (
    <main className="bg-slate-50 py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            Workflow: Lập Kế Hoạch Content 30 Ngày
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Quy trình hoàn chỉnh để lập kế hoạch, viết và lên lịch 30 ngày nội dung xuyên suốt.
            Từ ý tưởng đến đăng bài - tất cả trong một quy trình dễ tuân theo.
          </p>
        </div>

        {/* Timeline Steps */}
        <div className="space-y-8 mb-12">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Left Section */}
                <div className="md:w-1/3 bg-gradient-to-br from-brand-600 to-brand-700 text-white p-8 flex flex-col justify-between">
                  <div>
                    <div className="text-5xl font-bold mb-4 opacity-20">{step.number}</div>
                    <h3 className="font-display text-2xl font-bold mb-2">{step.title}</h3>
                    <p className="text-brand-100">{step.description}</p>
                  </div>
                  <div className="text-6xl mt-6">{step.icon}</div>
                </div>

                {/* Right Section */}
                <div className="md:w-2/3 p-8">
                  <h4 className="font-semibold text-slate-900 mb-3">Template Prompt:</h4>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 font-mono text-sm text-slate-700">
                    {step.template}
                  </div>
                  <div className="mt-4">
                    <span className="text-xs text-slate-500">Sao chép thủ công template để sử dụng</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Preview Grid */}
        <div className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8 text-slate-900">
            Xem trước lịch 4 tuần
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {weeks.map((week, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-md border-t-4 border-brand-600">
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                  {week.week}
                </h3>
                <p className="font-semibold text-brand-600 mb-2">{week.theme}</p>
                <p className="text-slate-600 text-sm">{week.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What You'll Get */}
        <div className="bg-white rounded-xl p-8 shadow-md mb-12">
          <h3 className="font-display text-2xl font-bold mb-6 text-slate-900">
            Bạn sẽ nhận được gì
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-brand-600 font-bold mr-3 mt-1">✓</span>
                <span className="text-slate-700">6 prompt để lập kế hoạch từng bước</span>
              </div>
              <div className="flex items-start">
                <span className="text-brand-600 font-bold mr-3 mt-1">✓</span>
                <span className="text-slate-700">Template Google Sheets lịch 30 ngày</span>
              </div>
              <div className="flex items-start">
                <span className="text-brand-600 font-bold mr-3 mt-1">✓</span>
                <span className="text-slate-700">Hướng dẫn viết content cho từng nền tảng</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-brand-600 font-bold mr-3 mt-1">✓</span>
                <span className="text-slate-700">Checklist review content chất lượng</span>
              </div>
              <div className="flex items-start">
                <span className="text-brand-600 font-bold mr-3 mt-1">✓</span>
                <span className="text-slate-700">Bộ hashtag phổ biến cho 10+ lĩnh vực</span>
              </div>
              <div className="flex items-start">
                <span className="text-brand-600 font-bold mr-3 mt-1">✓</span>
                <span className="text-slate-700">Cập nhật miễn phí hàng tháng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">30 bài</div>
            <p className="text-slate-700">Nội dung sẵn sàng đăng</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-2">100+ giờ</div>
            <p className="text-slate-700">Thời gian tiết kiệm được</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">300% ROI</div>
            <p className="text-slate-700">Tăng engagement trung bình</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-xl p-8 text-white text-center">
          <h3 className="font-display text-3xl font-bold mb-4">
            Lập kế hoạch content một lần, chiến thắng cả tháng
          </h3>
          <p className="mb-6 text-lg opacity-90 max-w-2xl mx-auto">
            Mua workflow này và có 30 ngày content sẵn sàng chỉ trong 2 giờ
          </p>
          <button className="bg-white text-brand-600 hover:bg-slate-50 font-bold py-3 px-8 rounded-lg transition-colors text-lg">
            Mua ngay - 149,000đ
          </button>
        </div>
      </div>
    </main>
  );
}