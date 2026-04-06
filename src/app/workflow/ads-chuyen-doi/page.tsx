export const metadata = {
  title: 'Workflow: Tạo Quảng Cáo Chuyển Đổi Cao | PromptVN',
  description: 'Quy trình chi tiết để tạo quảng cáo có tỷ lệ chuyển đổi cao bằng AI',
};

export default function AdsChuyenDoiPage() {
  const steps = [
    {
      number: 1,
      title: 'Nghiên cứu',
      description: 'Phân tích đối tượng mục tiêu, competitor và điểm yếu thị trường',
      template: 'Phân tích đối tượng mục tiêu của tôi: [mô tả sản phẩm]. Các điểm yếu chính là gì? Đối thủ cạnh tranh làm gì khác biệt?',
      icon: '🔍',
    },
    {
      number: 2,
      title: 'Tiêu đề (Headline)',
      description: 'Tạo tiêu đề hấp dẫn, gợi chú ý và liên quan',
      template: 'Tạo 10 tiêu đề quảng cáo cho [tên sản phẩm]. Tiêu đề phải: tạo sự tò mò, gợi cảm xúc, và bao gồm chữ số hoặc từ khóa mạnh mẽ.',
      icon: '✍️',
    },
    {
      number: 3,
      title: 'Nội dung quảng cáo',
      description: 'Viết copy hấp dẫn, tập trung vào lợi ích, giải quyết vấn đề',
      template: 'Viết copy quảng cáo cho [sản phẩm]. Bắt đầu bằng vấn đề khách hàng, sau đó giới thiệu giải pháp. Giới hạn 300 ký tự.',
      icon: '📝',
    },
    {
      number: 4,
      title: 'Call-to-Action (CTA)',
      description: 'Tạo CTA mạnh mẽ, rõ ràng và tạo sự cấp bách',
      template: 'Tạo 5 CTA button text cho quảng cáo [sản phẩm]. Mỗi CTA phải rõ ràng, mạnh mẽ và tạo cảm giác cấp bách. Ví dụ: "Mua ngay", "Khám phá miễn phí", v.v.',
      icon: '🎯',
    },
    {
      number: 5,
      title: 'A/B Testing',
      description: 'Tạo các biến thể để kiểm tra hiệu suất',
      template: 'Tạo 3 phiên bản quảng cáo khác nhau cho [sản phẩm]. Phiên bản 1 tập trung vào giá, phiên bản 2 tập trung vào chất lượng, phiên bản 3 tập trung vào tốc độ.',
      icon: '🧪',
    },
    {
      number: 6,
      title: 'Tối ưu hóa',
      description: 'Phân tích kết quả và cải thiện dần dần',
      template: 'Dựa trên dữ liệu: CTR [%], Conversion Rate [%], CPC [cost]. Đưa ra 5 khuyến nghị để cải thiện hiệu suất quảng cáo.',
      icon: '📊',
    },
  ];

  return (
    <main className="bg-slate-50 py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            Workflow: Tạo Quảng Cáo Chuyển Đổi Cao
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Quy trình từng bước để tạo quảng cáo có tỷ lệ chuyển đổi cao bằng sức mạnh của AI.
            Từ nghiên cứu đến tối ưu hóa - tất cả những gì bạn cần để thành công.
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

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-3">⚡</div>
            <h4 className="font-semibold text-slate-900 mb-2">Tiết kiệm thời gian</h4>
            <p className="text-slate-600 text-sm">
              Tạo quảng cáo chất lượng cao trong vài phút thay vì mấy giờ
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-3">📈</div>
            <h4 className="font-semibold text-slate-900 mb-2">Tăng conversion</h4>
            <p className="text-slate-600 text-sm">
              Các prompt được tối ưu hóa giúp tăng tỷ lệ chuyển đổi lên đến 300%
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-3">🎯</div>
            <h4 className="font-semibold text-slate-900 mb-2">Dễ sử dụng</h4>
            <p className="text-slate-600 text-sm">
              Không cần kinh nghiệm marketing - chỉ cần thay đổi [dấu ngoặc]
            </p>
          </div>
        </div>

        {/* What You'll Get */}
        <div className="bg-white rounded-xl p-8 shadow-md mb-12">
          <h3 className="font-display text-2xl font-bold mb-6 text-slate-900">
            Bạn sẽ nhận được gì
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-start">
              <span className="text-brand-600 font-bold mr-3">✓</span>
              <span className="text-slate-700">6 prompt chuyên sâu cho từng bước quy trình</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-600 font-bold mr-3">✓</span>
              <span className="text-slate-700">Hướng dẫn chi tiết cách sử dụng prompt</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-600 font-bold mr-3">✓</span>
              <span className="text-slate-700">Template bảng tính theo dõi kết quả</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-600 font-bold mr-3">✓</span>
              <span className="text-slate-700">Video hướng dẫn từng bước (5 phút)</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-600 font-bold mr-3">✓</span>
              <span className="text-slate-700">Cập nhật miễn phí mãi mãi</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-600 font-bold mr-3">✓</span>
              <span className="text-slate-700">Hỗ trợ email trong 30 ngày</span>
            </li>
          </ul>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-xl p-8 text-white text-center">
          <h3 className="font-display text-3xl font-bold mb-4">
            Sẵn sàng tạo quảng cáo chuyển đổi cao?
          </h3>
          <p className="mb-6 text-lg opacity-90 max-w-2xl mx-auto">
            Mua workflow này ngay hôm nay và bắt đầu tạo quảng cáo mạnh mẽ vào ngay lập tức
          </p>
          <button className="bg-white text-brand-600 hover:bg-slate-50 font-bold py-3 px-8 rounded-lg transition-colors text-lg">
            Mua ngay - 199,000đ
          </button>
        </div>
      </div>
    </main>
  );
}