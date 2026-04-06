import Link from 'next/link';

export const metadata = {
  title: 'Giới thiệu | PromptVN',
  description: 'Tìm hiểu về PromptVN - sàn giao dịch prompt AI hàng đầu Việt Nam',
};

export default function GioiThieuPage() {
  const values = [
    {
      title: 'Chất lượng',
      description: 'Các prompt được kiểm tra kỹ lưỡng và tối ưu cho kết quả tốt nhất',
      icon: '⭐',
    },
    {
      title: 'Đổi mới',
      description: 'Cập nhật liên tục với các xu hướng AI và công nghệ mới nhất',
      icon: '💡',
    },
    {
      title: 'Cộng đồng',
      description: 'Kết nối với hàng nghìn người dùng và tác giả prompt trên toàn Việt Nam',
      icon: '👥',
    },
    {
      title: 'Minh bạch',
      description: 'Giá cả công bằng, không phí ẩn, và hỗ trợ khách hàng tuyệt vời',
      icon: '🔍',
    },
  ];

  const stats = [
    { number: '600+', label: 'Prompt' },
    { number: '10,000+', label: 'Khách hàng' },
    { number: '6', label: 'Danh mục' },
    { number: '50+', label: 'Tác giả' },
  ];

  return (
    <main className="bg-slate-50">
      {/* Hero Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-r from-brand-600 to-brand-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Về PromptVN
          </h1>
          <p className="text-lg md:text-xl font-light mb-4">
            Sàn giao dịch prompt AI hàng đầu Việt Nam
          </p>
          <p className="text-md max-w-2xl mx-auto opacity-90">
            PromptVN là nơi để bạn tìm thấy các prompt AI chất lượng cao được tạo bởi các chuyên gia,
            giúp bạn tối ưu hóa công việc và sáng tạo.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">Câu chuyện của PromptVN</h2>
          <div className="bg-white rounded-xl p-8 shadow-md">
            <p className="text-slate-700 text-lg leading-relaxed mb-4">
              PromptVN được thành lập với mục tiêu giúp các người dùng Việt Nam tiếp cận những prompt AI chất lượng cao.
              Chúng tôi nhận thấy rằng việc tìm kiếm các prompt tốt là một thách thức lớn, đặc biệt là khi hầu hết các
              tài nguyên đều bằng tiếng Anh.
            </p>
            <p className="text-slate-700 text-lg leading-relaxed">
              Với việc kết nối trực tiếp giữa các tác giả prompt tài năng và người dùng, PromptVN tạo ra một cộng đồng
              mạnh mẽ nơi mỗi người có thể phát triển sáng tạo của mình. Chúng tôi cam kết cung cấp các prompt được
              kiểm tra kỹ lưỡng, có giá cả công bằng và hỗ trợ khách hàng xuất sắc.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-bold mb-12 text-center">Giá trị cốt lõi của chúng tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-display text-xl font-bold mb-3 text-slate-900">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-bold mb-12 text-center">Số liệu thống kê</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center p-6 rounded-xl bg-slate-50">
                <div className="font-display text-3xl md:text-4xl font-bold text-brand-600 mb-2">
                  {stat.number}
                </div>
                <p className="text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold mb-6">Sẵn sàng khám phá?</h2>
          <p className="text-slate-600 mb-8 text-lg">
            Duyệt qua hàng trăm prompt chất lượng cao được tạo bởi các chuyên gia
          </p>
          <Link
            href="/danh-muc"
            className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
          >
            Khám phá danh mục
          </Link>
        </div>
      </section>
    </main>
  );
}