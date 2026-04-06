'use client';

import { useState } from 'react';

export default function LienHePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'mua-hang',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Gửi tin nhắn thất bại');
      }

      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: 'mua-hang', message: '' });
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    }
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      content: 'support@promptvn.com',
      link: 'mailto:support@promptvn.com',
    },
    {
      icon: '📞',
      title: 'Điện thoại',
      content: '0123 456 789',
      link: 'tel:0123456789',
    },
    {
      icon: '📍',
      title: 'Địa chỉ',
      content: 'TP.HCM, Việt Nam',
      link: '#',
    },
    {
      icon: '⏰',
      title: 'Giờ làm việc',
      content: '8:00 - 22:00 (Hàng ngày)',
      link: '#',
    },
  ];

  const subjectOptions = [
    { value: 'mua-hang', label: 'Mua hàng' },
    { value: 'ky-thuat', label: 'Kỹ thuật' },
    { value: 'hop-tac', label: 'Hợp tác' },
    { value: 'khac', label: 'Khác' },
  ];

  return (
    <main className="bg-slate-50 py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-2 text-slate-900 text-center">
          Liên hệ với chúng tôi
        </h1>
        <p className="text-slate-600 mb-12 text-center">
          Chúng tôi sẵn sàng giúp bạn 24/7. Gửi tin nhắn và chúng tôi sẽ trả lời sớm nhất có thể.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-md">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">✓</div>
                  <h3 className="font-display text-2xl font-bold mb-2 text-green-600">
                    Cảm ơn bạn!
                  </h3>
                  <p className="text-slate-600">
                    Chúng tôi đã nhận được tin nhắn của bạn và sẽ trả lời sớm nhất có thể.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700">{error}</p>
                    </div>
                  )}
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Tên của bạn
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="Nhập tên của bạn"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Chủ đề
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      {subjectOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Tin nhắn
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                      placeholder="Viết tin nhắn của bạn ở đây..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Gửi tin nhắn
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {contactInfo.map((info, idx) => (
                <a
                  key={idx}
                  href={info.link}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow block"
                >
                  <div className="text-3xl mb-3">{info.icon}</div>
                  <h3 className="font-semibold text-slate-900 mb-1">{info.title}</h3>
                  <p className="text-slate-600 text-sm break-words hover:text-brand-600">
                    {info.content}
                  </p>
                </a>
              ))}

              {/* Response Time Card */}
              <div className="bg-brand-50 rounded-xl p-6 border border-brand-200">
                <h4 className="font-semibold text-slate-900 mb-2">Thời gian phản hồi</h4>
                <p className="text-sm text-slate-600">
                  Chúng tôi cố gắng trả lời tất cả các tin nhắn trong vòng 24 giờ trong giờ làm việc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}