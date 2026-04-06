'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { Copy, Share2, Send, CheckCircle, Clock, ExternalLink } from 'lucide-react';

interface ReferralData {
  code: string | null;
  stats: {
    totalReferred: number;
    totalEarned: number;
    pendingReward: number;
  };
  referrals: Array<{
    referrer_email: string;
    referred_email: string;
    code: string;
    signed_up_at: string;
    first_purchase_at: string | null;
    reward_paid: boolean;
    reward_amount: number;
  }>;
}

export default function ReferralPage() {
  const { isLoggedIn, user } = useAuthStore();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn && user?.email) {
      fetchReferralData();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, user?.email]);

  async function fetchReferralData() {
    try {
      const res = await fetch(`/api/referral?email=${user?.email}`);
      const data = await res.json();

      if (data.success) {
        // Generate code if not exists
        if (!data.code) {
          const generateRes = await fetch('/api/referral', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'generate', email: user?.email }),
          });
          const generateData = await generateRes.json();
          if (generateData.success) {
            data.code = generateData.code;
          }
        }
        setReferralData(data);
      }
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string, type: string) {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  function getMaskedEmail(email: string): string {
    const [local, domain] = email.split('@');
    const masked = local.substring(0, 3) + '*'.repeat(Math.max(0, local.length - 3));
    return `${masked}@${domain}`;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Giới thiệu bạn bè, nhận 10,000đ
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Chia sẻ mã giới thiệu của bạn với bạn bè và kiếm thêm tiền
            </p>
            <a
              href="/dang-nhap"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Đăng nhập để bắt đầu
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const referralLink = referralData?.code ? `https://khopromt.pro/ref/${referralData.code}` : '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Giới thiệu bạn bè,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  nhận 10,000đ
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Chia sẻ mã giới thiệu với bạn bè. Khi họ mua hàng lần đầu, bạn sẽ nhận được 10,000đ vào
                ví của mình.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white">
                      🔗
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Không giới hạn</h3>
                    <p className="mt-2 text-gray-600">Giới thiệu bao nhiêu bạn bè cũng được</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white">
                      💰
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Nhận thưởng ngay</h3>
                    <p className="mt-2 text-gray-600">Khi bạn bè mua lần đầu, thưởng sẽ về ví ngay</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Illustration */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl blur-2xl opacity-60"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-50 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-2">🤝</div>
                    <p className="text-sm font-medium text-gray-700">Chia sẻ</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-2">📱</div>
                    <p className="text-sm font-medium text-gray-700">Gọi bạn</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-2">💳</div>
                    <p className="text-sm font-medium text-gray-700">Mua hàng</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-2">💸</div>
                    <p className="text-sm font-medium text-gray-700">Nhận tiền</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Cách hoạt động</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 text-center h-full">
                <div className="text-5xl mb-4">🔗</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">1. Chia sẻ link</h3>
                <p className="text-gray-700">
                  Sao chép mã giới thiệu của bạn và chia sẻ tới bạn bè qua Facebook, Zalo, email...
                </p>
              </div>
              <div className="absolute -right-4 top-1/2 hidden md:block">
                <svg className="w-8 h-8 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center h-full">
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">2. Bạn bè đăng ký</h3>
                <p className="text-gray-700">
                  Bạn bè của bạn nhấn link và đăng ký tài khoản mới trên PromptVN
                </p>
              </div>
              <div className="absolute -right-4 top-1/2 hidden md:block">
                <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center h-full">
                <div className="text-5xl mb-4">💳</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">3. Nhận thưởng</h3>
                <p className="text-gray-700">
                  Khi bạn bè mua prompt lần đầu, bạn sẽ nhận 10,000đ vào ví ngay lập tức
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Code Card */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-white">
            <h2 className="text-3xl font-bold mb-8">Mã giới thiệu của bạn</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Code Card */}
              <div className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-6">
                <p className="text-white text-opacity-90 text-sm font-medium mb-3">MÃ GIỚI THIỆU</p>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-4xl font-bold text-white font-mono">
                    {referralData?.code || '...'}
                  </div>
                  <button
                    onClick={() => copyToClipboard(referralData?.code || '', 'code')}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-lg transition-colors"
                  >
                    {copied === 'code' ? (
                      <CheckCircle size={20} className="text-green-300" />
                    ) : (
                      <Copy size={20} />
                    )}
                  </button>
                </div>
                <p className="text-white text-opacity-80 text-sm">
                  {copied === 'code' ? '✓ Đã sao chép' : 'Nhấn để sao chép mã'}
                </p>
              </div>

              {/* Link Card */}
              <div className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-6">
                <p className="text-white text-opacity-90 text-sm font-medium mb-3">LINK GIỚI THIỆU</p>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-white bg-opacity-20 rounded-lg p-3 flex-1 overflow-hidden">
                    <p className="text-white text-sm font-mono truncate">
                      {referralLink}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(referralLink, 'link')}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-lg transition-colors"
                  >
                    {copied === 'link' ? (
                      <CheckCircle size={20} className="text-green-300" />
                    ) : (
                      <Copy size={20} />
                    )}
                  </button>
                </div>
                <p className="text-white text-opacity-80 text-sm">
                  {copied === 'link' ? '✓ Đã sao chép' : 'Nhấn để sao chép link'}
                </p>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="mt-8">
              <p className="text-white text-opacity-90 text-sm font-medium mb-4">CHIA SẺ NGAY</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
                    window.open(shareUrl, '_blank');
                  }}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <ExternalLink size={20} />
                  <span>Facebook</span>
                </button>
                <button
                  onClick={() => {
                    const shareUrl = `https://zalo.me/?text=${encodeURIComponent(`Bạn được giới thiệu bởi tôi!\n\n${referralLink}`)}`;
                    window.open(shareUrl, '_blank');
                  }}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Send size={20} />
                  <span>Zalo</span>
                </button>
                <button
                  onClick={() => {
                    const mailtoLink = `mailto:?subject=Mã giới thiệu PromptVN&body=${encodeURIComponent(`Bạn được giới thiệu bởi tôi!\n\nNhấn link để đăng ký:\n${referralLink}`)}`;
                    window.location.href = mailtoLink;
                  }}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Share2 size={20} />
                  <span>Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Dashboard */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Thống kê của bạn</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Referred */}
            <div className="bg-white rounded-xl shadow p-8 border-l-4 border-indigo-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Đã giới thiệu</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">
                    {referralData?.stats.totalReferred || 0}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">người</p>
                </div>
                <div className="text-5xl">👥</div>
              </div>
            </div>

            {/* Total Earned */}
            <div className="bg-white rounded-xl shadow p-8 border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Đã nhận</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">
                    {formatPrice(referralData?.stats.totalEarned || 0)}
                  </p>
                </div>
                <div className="text-5xl">💰</div>
              </div>
            </div>

            {/* Pending Rewards */}
            <div className="bg-white rounded-xl shadow p-8 border-l-4 border-yellow-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Đang chờ</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">
                    {referralData?.stats.pendingReward || 0}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">người chưa mua</p>
                </div>
                <div className="text-5xl">⏳</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Referral History */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Lịch sử giới thiệu</h2>

          {referralData?.referrals && referralData.referrals.length > 0 ? (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Đăng ký
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Trạng thái mua
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Thưởng
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {referralData.referrals.map((referral, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {getMaskedEmail(referral.referred_email)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(referral.signed_up_at).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center space-x-2">
                            {referral.first_purchase_at ? (
                              <>
                                <CheckCircle size={18} className="text-green-600" />
                                <span className="text-green-700 font-medium">Đã mua</span>
                              </>
                            ) : (
                              <>
                                <Clock size={18} className="text-yellow-600" />
                                <span className="text-yellow-700 font-medium">Chưa mua</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {referral.reward_paid ? (
                            <div className="flex items-center space-x-1">
                              <span className="text-green-700 font-semibold">
                                +{formatPrice(referral.reward_amount)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500">Chờ...</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Chưa có giới thiệu nào</h3>
              <p className="text-gray-600 mb-6">
                Hãy bắt đầu chia sẻ mã giới thiệu của bạn để nhận thưởng
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Câu hỏi thường gặp
          </h2>
          <div className="space-y-6">
            <details className="bg-gray-50 rounded-lg p-6 cursor-pointer group">
              <summary className="flex items-center justify-between font-semibold text-gray-900">
                <span>Khi nào tôi nhận được thưởng?</span>
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-700 mt-4">
                Bạn sẽ nhận thưởng 10,000đ ngay khi người được giới thiệu của bạn thực hiện lần mua
                đầu tiên trên PromptVN. Tiền sẽ được cộng vào ví của bạn tự động.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-6 cursor-pointer group">
              <summary className="flex items-center justify-between font-semibold text-gray-900">
                <span>Tôi có thể giới thiệu bao nhiêu người?</span>
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-700 mt-4">
                Không có giới hạn! Bạn có thể giới thiệu bao nhiêu bạn bè tuỳ thích. Mỗi lần bạn bè
                mua hàng, bạn sẽ nhận 10,000đ.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-6 cursor-pointer group">
              <summary className="flex items-center justify-between font-semibold text-gray-900">
                <span>Mã giới thiệu có hạn sử dụng không?</span>
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-700 mt-4">
                Không. Mã giới thiệu của bạn có hiệu lực vĩnh viễn. Bạn có thể sử dụng nó bao lâu
                cũng được.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-6 cursor-pointer group">
              <summary className="flex items-center justify-between font-semibold text-gray-900">
                <span>Làm sao tôi biết bạn bè của tôi đã đăng ký?</span>
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-700 mt-4">
                Bạn có thể xem danh sách người được giới thiệu ở mục "Lịch sử giới thiệu" trên trang
                này. Bạn sẽ thấy email của họ (ẩn để bảo mật) và trạng thái mua hàng.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-6 cursor-pointer group">
              <summary className="flex items-center justify-between font-semibold text-gray-900">
                <span>Thưởng sẽ được gửi thế nào?</span>
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-700 mt-4">
                Thưởng sẽ được tự động cộng vào ví trên tài khoản của bạn. Bạn có thể sử dụng tiền
                này để mua prompt hoặc rút tiền theo chính sách của chúng tôi.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Bắt đầu kiếm tiền ngay hôm nay</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Chia sẻ mã giới thiệu với bạn bè và nhận thưởng khi họ mua hàng
          </p>
          <button
            onClick={() => copyToClipboard(referralLink, 'cta')}
            className="bg-white text-indigo-600 hover:bg-gray-50 font-bold py-4 px-8 rounded-lg transition-colors inline-flex items-center space-x-2"
          >
            {copied === 'cta' ? (
              <>
                <CheckCircle size={24} />
                <span>Đã sao chép link!</span>
              </>
            ) : (
              <>
                <Copy size={24} />
                <span>Sao chép link để chia sẻ</span>
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}