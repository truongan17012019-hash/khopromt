export const metadata = {
  title: 'Workflow: Thiết Kế Landing Page Chốt Đơn | PromptVN',
  description: 'Quy trình tạo landing page có tỷ lệ chuyển đổi cao',
};

export default function LandingPageChotDonPage() {
  const steps = [
    {
      number: 1,
      title: 'Hero Section',
      description: 'Tạo tiêu đề, subheading và hình ảnh chính hấp dẫn',
      template: 'Tạo hero section cho landing page [sản phẩm]. Tiêu đề phải: ngắn (5-8 từ), gợi lợi ích lớn. Subheading: mô tả vấn đề cụ thể (15-20 từ). Gợi ý hình ảnh.',
      icon: '🎬',
    },
    {
      number: 2,
      title: 'Pain Points',
      description: 'Xác định và trình bày các vấn đề khách hàng',
      template: 'Liệt kê 5 vấn đề lớn của [đối tượng mục tiêu] khi [hành động]. Mỗi vấn đề: mô tả (20 từ) + icon đề xuất + giải thích tại sao quan trọng.',
      icon: '😰',
    },
    {
      number: 3,
      title: 'Giải pháp',
      description: 'Giới thiệu sản phẩm như giải pháp hoàn hảo',
      template: 'Viết phần giải pháp cho [sản phẩm]. Liệt kê 4 lợi ích chính (mỗi lợi ích 15-20 từ). Mỗi lợi ích kèm: tiêu đề, mô tả, ví dụ cụ thể.',
      icon: '💡',
    },
    {
      number: 4,
      title: 'Social Proof',
      description: 'Thêm testimonial, review, con số tăng độ tin cậy',
      template: 'Tạo 3 testimonial khác nhau cho [sản phẩm]. Mỗi testimonial: tên, công việc, vấn đề ban đầu (1 câu), kết quả sau (1 câu), đánh giá sao. Thêm: 5000+ customer, 98% hài lòng.',
      icon: '⭐',
    },
    {
      number: 5,
      title: 'Pricing',
      description: 'Trình bày giá cả với từng gói rõ ràng',
      template: 'Tạo bảng giá cho [sản phẩm]. Gói: Cơ bản, Chuyên nghiệp, Premium. Mỗi gói: tên, giá, 5 tính năng, CTA button. Làm nổi bật gói phổ biến nhất.',
      icon: '💰',
    },
    {
      number: 6,
      title: 'CTA',
      description: 'Tạo call-to-action mạnh mẽ, tạo sự cấp bách',
      template: 'Tạo 5 biến thể CTA button cho [sản phẩm]. Mỗi biến thể: text (3-5 từ), mô tả thêm (20 từ), giáo dục khách hàng tại sao nên click. Ví dụ: "Bắt đầu miễn phí", "Nhận tư vấn ngay", v.v.',
      icon: '🎯',
    },
    {
      number: 7,
      title: 'Urgency',
      description: 'Tạo sự cấp bách và động lực hành động',
      template: 'Tạo 3 cách tạo urgency cho landing page [sản phẩm]. Ví dụ: giới hạn số lượng, deadline, bonus hạn thời. Viết copy để tái tạo cảm giác cấp bách mà không spam.',
      icon: '⏰',
    },
  ];

  return (
    <main className="bg-slate-50 py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            Workflow: Thiết Kế Landing Page Chốt Đơn
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Quy trình chi tiết để tạo landing page có tỷ lệ chuyển đổi cao.
            Từ hero section đến urgency - tất cả các phần tử cần thiết để bán hàng thành công.
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

        {/* Landing Page Structure Preview */}
        <div className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-8 text-slate-900">
            Cấu trúc landing page hoàn chỉnh
          </h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-slate-200">
            {/* Hero */}
            <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white p-8 md:p-12 text-center">
              <h3 className="font-display text-3xl font-bold mb-2">Hero Section</h3>
              <p className="text-brand-100">Tiêu đề chính gợi lợi ích lớn</p>
            </div>

            {/* Pain Points */}
            <div className="border-t border-slate-200 p-8">
              <h4 className="font-semibold text-slate-900 mb-4">😰 Vấn đề khách hàng</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">Vấn đề 1</div>
                <div className="bg-red-50 p-4 rounded-lg">Vấn đề 2</div>
                <div className="bg-red-50 p-4 rounded-lg">Vấn đề 3</div>
                <div className="bg-red-50 p-4 rounded-lg">Vấn đề 4</div>
              </div>
            </div>

            {/* Solution */}
            <div className="border-t border-slate-200 p-8 bg-slate-50">
              <h4 className="font-semibold text-slate-900 mb-4">💡 Giải pháp</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">Lợi ích 1</div>
                <div className="bg-blue-50 p-4 rounded-lg">Lợi ích 2</div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="border-t border-slate-200 p-8">
              <h4 className="font-semibold text-slate-900 mb-4">⭐ Chứng minh xã hội</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg text-center">Testimonial 1</div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">Testimonial 2</div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">Testimonial 3</div>
              </div>
            </div>

            {/* Pricing */}
            <div className="border-t border-slate-200 p-8 bg-slate-50">
              <h4 className="font-semibold text-slate-900 mb-4">💰 Bảng giá</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200">Gói 1</div>
                <div className="bg-white p-4 rounded-lg border-2 border-brand-600">Gói 2 (Phổ biến)</div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">Gói 3</div>
              </div>
            </div>

            {/* CTA */}
            <div className="border-t border-slate-200 p-8">
              <div className="text-center">
                <button className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-lg">
                  CTA Button (Chuyển đổi)
                </button>
              </div>
            </div>

            {/* Urgency */}
            <div className="border-t border-slate-200 p-8 bg-orange-50 text-center">
              <p className="text-orange-700 font-semibold">⏰ Tạo sự cấp bách: Hạn chế, deadline</p>
            </div>
          </div>
        </div>

        {/* Key Conversion Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-3">📊</div>
            <h4 className="font-semibold text-slate-900 mb-2">Tỷ lệ chuyển đổi</h4>
            <p className="text-brand-600 font-bold text-xl">2-5% trung bình</p>
            <p className="text-slate-600 text-sm mt-2">Với landing page tối ưu</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-3">⚡</div>
            <h4 className="font-semibold text-slate-900 mb-2">Tốc độ tải</h4>
            <p className="text-brand-600 font-bold text-xl">&lt; 2 giây</p>
            <p className="text-slate-600 text-sm mt-2">Yêu cầu quan trọng cho SEO</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-3">📱</div>
            <h4 className="font-semibold text-slate-900 mb-2">Mobile-first</h4>
            <p className="text-brand-600 font-bold text-xl">100% responsive</p>
            <p className="text-slate-600 text-sm mt-2">70% traffic từ mobile</p>
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
                <span className="text-slate-700">7 prompt cho từng phần landing page</span>
              </div>
              <div className="flex items-start">
                <span className="text-brand-600 font-bold mr-3 mt-1">✓</span>
                <span className="text-slate-700">Template HTML/CSS sẵn sàng sử dụng</span>
              </div>
              <div className="flex items-start">
                <span className="text-brand-600 font-bold mr-3 mt-1">✓</span>
                <span className="text-slate-700">Hướng dẫn SEO landing page</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-brand-600 font-bold mr-3 mt-1">✓</span>
                <span className="text-slate-700">Checklist A/B testing 20 yếu tố</span>
              </div>
              <div className="flex items-start">
                <span className="text-brand-600 font-bold mr-3 mt-1">✓</span>
                <span className="text-slate-700">Video hướng dẫn 10 phút</span>
              </div>
              <div className="flex items-start">
                <span className="text-brand-600 font-bold mr-3 mt-1">✓</span>
                <span className="text-slate-700">Hỗ trợ email 60 ngày</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-xl p-8 text-white text-center">
          <h3 className="font-display text-3xl font-bold mb-4">
            Tạo landing page chốt đơn hôm nay
          </h3>
          <p className="mb-6 text-lg opacity-90 max-w-2xl mx-auto">
            Mua workflow này và có landing page cao cấp trong vòng 4 giờ thay vì 40 giờ
          </p>
          <button className="bg-white text-brand-600 hover:bg-slate-50 font-bold py-3 px-8 rounded-lg transition-colors text-lg">
            Mua ngay - 179,000đ
          </button>
        </div>
      </div>
    </main>
  );
}