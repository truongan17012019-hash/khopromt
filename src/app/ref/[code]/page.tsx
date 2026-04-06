'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ReferralPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (code) {
      localStorage.setItem('referral_code', code);
    }
  }, [code]);

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-600 via-brand-500 to-primary-600 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Welcome Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-50 mb-6">
              <span className="text-4xl">🎉</span>
            </div>
          </div>

          {/* Welcome Text */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Chào mừng bạn!
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Bạn được giới thiệu bởi một thành viên PromptVN!
          </p>

          {/* Benefits Section */}
          <div className="mb-12 text-left">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center">
              Tại sao lựa chọn PromptVN?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-brand-100">
                    <span className="text-brand-600 font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    600+ Prompt chất lượng cao
                  </p>
                  <p className="text-slate-600 text-sm">
                    Thư viện prompt toàn diện cho mọi nhu cầu
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-brand-100">
                    <span className="text-brand-600 font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    Công cụ miễn phí
                  </p>
                  <p className="text-slate-600 text-sm">
                    Truy cập tất cả công cụ hữu ích mà không cần trả tiền
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-brand-100">
                    <span className="text-brand-600 font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    Cộng đồng sôi động
                  </p>
                  <p className="text-slate-600 text-sm">
                    Kết nối với hàng nghìn người dùng AI khác
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-brand-100">
                    <span className="text-brand-600 font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    Cập nhật hàng tuần
                  </p>
                  <p className="text-slate-600 text-sm">
                    Luôn có prompt và công cụ mới nhất
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => router.push('/dang-nhap')}
            className="w-full bg-gradient-to-r from-brand-600 to-primary-600 hover:from-brand-700 hover:to-primary-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg mb-6 text-lg"
          >
            Đăng ký ngay
          </button>

          {/* Secondary CTA */}
          <p className="text-slate-600">
            Đã có tài khoản?{' '}
            <button
              onClick={() => router.push('/dang-nhap')}
              className="text-brand-600 font-semibold hover:text-brand-700 transition-colors"
            >
              Đăng nhập
            </button>
          </p>

          {/* Referral Info */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Mã giới thiệu: <span className="font-mono font-semibold text-slate-700">{code}</span>
            </p>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="text-center mt-8">
          <p className="text-white text-sm opacity-90">
            Bắt đầu hành trình AI của bạn với PromptVN ngay hôm nay
          </p>
        </div>
      </div>
    </main>
  );
}
