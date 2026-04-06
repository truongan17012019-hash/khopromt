export const metadata = {
  title: 'Chính sách bảo mật | PromptVN',
  description: 'Chính sách bảo mật dữ liệu người dùng của PromptVN',
};

export default function BaoMatPage() {
  return (
    <main className="bg-slate-50 py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-2 text-slate-900">
          Chính sách bảo mật
        </h1>
        <p className="text-slate-600 mb-8">Cập nhật lần cuối: 01/04/2026</p>

        <div className="bg-white rounded-xl p-8 shadow-md space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-slate-900">
              1. Thu thập thông tin
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                PromptVN thu thập thông tin mà bạn cung cấp trực tiếp khi tạo tài khoản, mua sản phẩm hoặc liên hệ với
                chúng tôi. Thông tin này bao gồm:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Tên, địa chỉ email và số điện thoại</li>
                <li>Địa chỉ giao hàng và thanh toán</li>
                <li>Thông tin thanh toán (được xử lý qua cổng bảo mật)</li>
                <li>Lịch sử mua hàng và sở thích người dùng</li>
                <li>Bình luận và phản hồi</li>
              </ul>
              <p>
                Chúng tôi cũng tự động thu thập một số thông tin thông qua cookie và công nghệ theo dõi khác, bao gồm
                địa chỉ IP, loại trình duyệt và các hoạt động trên trang web.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-slate-900">
              2. Sử dụng thông tin
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Chúng tôi sử dụng thông tin bạn cung cấp cho các mục đích sau:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Xử lý đơn hàng và giao dịch của bạn</li>
                <li>Cung cấp hỗ trợ khách hàng</li>
                <li>Gửi thông báo về tài khoản và cập nhật dịch vụ</li>
                <li>Cải thiện Dịch vụ dựa trên phản hồi của bạn</li>
                <li>Phân tích xu hướng người dùng và cải thiện trải nghiệm</li>
                <li>Gửi email tiếp thị (bạn có thể hủy đăng ký bất cứ lúc nào)</li>
                <li>Tuân thủ các yêu cầu pháp lý</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-slate-900">
              3. Bảo vệ dữ liệu
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                PromptVN cam kết bảo vệ dữ liệu cá nhân của bạn. Chúng tôi sử dụng các biện pháp bảo mật tiêu chuẩn ngành,
                bao gồm mã hóa SSL, tường lửa và kiểm soát truy cập để bảo vệ thông tin của bạn.
              </p>
              <p>
                Mặc dù chúng tôi cố gắng hết sức để bảo vệ dữ liệu của bạn, không có phương pháp truyền qua internet hay
                lưu trữ điện tử nào hoàn toàn an toàn. Chúng tôi không thể đảm bảo bảo mật tuyệt đối.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-slate-900">
              4. Chia sẻ thông tin với bên thứ ba
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                PromptVN không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba cho mục đích tiếp thị.
                Tuy nhiên, chúng tôi có thể chia sẻ thông tin trong những trường hợp sau:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Với các nhà cung cấp dịch vụ thanh toán để xử lý giao dịch</li>
                <li>Với các công ty lưu trữ dữ liệu để lưu trữ an toàn</li>
                <li>Khi được yêu cầu bởi pháp luật hoặc quy định chính phủ</li>
                <li>Để bảo vệ quyền, tài sản hoặc an toàn của PromptVN, người dùng hoặc công chúng</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-slate-900">
              5. Cookie
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                PromptVN sử dụng cookie để cải thiện trải nghiệm người dùng. Cookie là các tệp nhỏ được lưu trên máy tính
                hoặc thiết bị của bạn để lưu trữ thông tin như tùy chọn ngôn ngữ, lịch sử xem và thông tin đăng nhập.
              </p>
              <p>
                Bạn có thể kiểm soát cookie thông qua cài đặt trình duyệt. Việc vô hiệu hóa cookie có thể ảnh hưởng đến
                chức năng của Dịch vụ.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-slate-900">
              6. Quyền của người dùng
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Bạn có quyền truy cập, chỉnh sửa hoặc xóa thông tin cá nhân của mình bất cứ lúc nào. Để thực hiện các
                điều này, vui lòng liên hệ với đội hỗ trợ khách hàng của chúng tôi.
              </p>
              <p>
                Bạn cũng có quyền yêu cầu sao chép dữ liệu cá nhân của mình hoặc yêu cầu xóa tài khoản của bạn vĩnh viễn.
                Chúng tôi sẽ xử lý các yêu cầu này trong vòng 30 ngày.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-slate-900">
              7. Liên hệ
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Nếu bạn có bất kỳ câu hỏi về Chính sách bảo mật này hoặc muốn thực hiện các quyền của mình, vui lòng
                liên hệ với chúng tôi tại:
              </p>
              <p className="font-semibold">
                Email: <a href="mailto:support@khopromt.pro" className="text-brand-600 hover:underline">
                  support@khopromt.pro
                </a>
              </p>
              <p className="text-sm mt-4">
                Chúng tôi sẽ trả lời các yêu cầu của bạn trong vòng 5 ngày làm việc.
              </p>
            </div>
          </section>
        </div>

        <p className="text-slate-600 text-sm mt-8 text-center">
          Chính sách bảo mật này có hiệu lực từ 01/04/2026. PromptVN có quyền cập nhật chính sách này bất cứ lúc nào.
        </p>
      </div>
    </main>
  );
}