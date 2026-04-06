'use client';

import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuthStore();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const finalEmail = email || user?.email || '';
      const finalName = name || user?.name || '';

      if (!finalEmail || !finalName) {
        setError('Vui lòng nhập email và tên');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: finalEmail,
          name: finalName,
          source: 'footer'
        })
      });

      const data = await response.json();

      if (data.success) {
        setSubscribed(true);
        setEmail('');
        setName('');
        setTimeout(() => setSubscribed(false), 3000);
      } else {
        setError(data.error || 'Đăng ký thất bại');
      }
    } catch (err) {
      setError('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <Mail className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Đăng ký nhận tin khuyến mãi
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Nhận thông tin về các prompt mới, khuyến mãi và mẹo AI độc quyền
          </p>

          {subscribed ? (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
              <Check className="w-5 h-5" />
              <span className="font-medium">Đã đăng ký thành công!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              {!user && (
                <input
                  type="text"
                  placeholder="Tên của bạn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              {!user && (
                <input
                  type="email"
                  placeholder="Email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition"
              >
                {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}