'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';

interface SellerEarnings {
  total_earned: number;
  available: number;
  withdrawn: number;
  commission_rate: number;
}

interface BankInfo {
  bank_name: string;
  account_number: string;
  account_holder: string;
}

interface PayoutRequest {
  id: string;
  email: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  bank_info: BankInfo;
  requested_at: string;
  reviewed_at?: string;
  note?: string;
}

const MIN_PAYOUT = 100000;

export default function SellerEarningsPage() {
  const { isLoggedIn, user } = useAuthStore();
  const [earnings, setEarnings] = useState<SellerEarnings | null>(null);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    amount: '',
    bank_name: '',
    account_number: '',
    account_holder: '',
  });

  useEffect(() => {
    if (!isLoggedIn || !user?.email) return;

    const fetchEarnings = async () => {
      try {
        const res = await fetch(`/api/seller/earnings?email=${user.email}`);
        const data = await res.json();
        setEarnings(data);
      } catch (err) {
        console.error('Error fetching earnings:', err);
        setError('Failed to load earnings data');
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [isLoggedIn, user?.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const amount = parseInt(formData.amount);

    if (!amount || amount < MIN_PAYOUT) {
      setError(`Minimum payout is ${formatPrice(MIN_PAYOUT)}`);
      return;
    }

    if (!formData.bank_name || !formData.account_number || !formData.account_holder) {
      setError('Please fill in all bank information');
      return;
    }

    if (earnings && earnings.available < amount) {
      setError('Insufficient available balance');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/seller/earnings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_payout',
          email: user?.email,
          amount,
          bank_info: {
            bank_name: formData.bank_name,
            account_number: formData.account_number,
            account_holder: formData.account_holder,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error);
      }

      setSuccess('Yêu cầu rút tiền đã được gửi thành công!');
      setFormData({ amount: '', bank_name: '', account_number: '', account_holder: '' });
      setShowForm(false);

      const refreshRes = await fetch(`/api/seller/earnings?email=${user?.email}`);
      const newEarnings = await refreshRes.json();
      setEarnings(newEarnings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request payout');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h1>
          <p className="text-slate-400">Bạn cần đăng nhập để xem thu nhập của mình</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="mt-4 text-slate-300">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Thu Nhập Của Bạn</h1>
          <p className="text-slate-400">Quản lý thu nhập và yêu cầu rút tiền</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            label="Tổng Thu Nhập"
            value={formatPrice(earnings?.total_earned || 0)}
            color="from-blue-600 to-blue-400"
          />
          <StatsCard 
            label="Khả Dụng"
            value={formatPrice(earnings?.available || 0)}
            color="from-green-600 to-green-400"
          />
          <StatsCard 
            label="Đã Rút"
            value={formatPrice(earnings?.withdrawn || 0)}
            color="from-purple-600 to-purple-400"
          />
          <StatsCard 
            label="Hoa Hồng"
            value={`${(earnings?.commission_rate || 0.7) * 100}%`}
            color="from-orange-600 to-orange-400"
          />
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-8 backdrop-blur">
          <h2 className="text-xl font-bold text-white mb-6">Biểu Đồ Thu Nhập</h2>
          <div className="space-y-4">
            <ChartBar 
              label="Tổng thu nhập"
              value={earnings?.total_earned || 0}
              max={earnings?.total_earned || 1}
              color="from-blue-500 to-blue-400"
            />
            <ChartBar 
              label="Khả dụng"
              value={earnings?.available || 0}
              max={earnings?.total_earned || 1}
              color="from-green-500 to-green-400"
            />
            <ChartBar 
              label="Đã rút"
              value={earnings?.withdrawn || 0}
              max={earnings?.total_earned || 1}
              color="from-purple-500 to-purple-400"
            />
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-8 backdrop-blur">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Yêu Cầu Rút Tiền</h2>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Yêu Cầu Rút Tiền
              </button>
            )}
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Số Tiền (VND)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Nhập số tiền"
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  min={MIN_PAYOUT}
                />
                <p className="text-xs text-slate-400 mt-1">
                  Tối thiểu: {formatPrice(MIN_PAYOUT)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tên Ngân Hàng
                  </label>
                  <input
                    type="text"
                    value={formData.bank_name}
                    onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                    placeholder="VD: Vietcombank"
                    className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Số Tài Khoản
                  </label>
                  <input
                    type="text"
                    value={formData.account_number}
                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                    placeholder="Số tài khoản"
                    className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tên Chủ Tài Khoản
                </label>
                <input
                  type="text"
                  value={formData.account_holder}
                  onChange={(e) => setFormData({ ...formData, account_holder: e.target.value })}
                  placeholder="Tên chủ tài khoản"
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {submitting ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-all"
                >
                  Hủy
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur">
          <h2 className="text-xl font-bold text-white mb-6">Lịch Sử Rút Tiền</h2>
          {payouts && payouts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Ngày</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Số Tiền</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Ngân Hàng</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout) => (
                    <tr key={payout.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-4 text-slate-300">
                        {new Date(payout.requested_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-semibold">
                        {formatPrice(payout.amount)}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <div className="text-sm">{payout.bank_info.bank_name}</div>
                        <div className="text-xs text-slate-500">{payout.bank_info.account_number}</div>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={payout.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">Chưa có yêu cầu rút tiền</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatsCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white shadow-lg`}>
      <p className="text-sm font-medium opacity-90 mb-2">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function ChartBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-slate-300 text-sm">{label}</span>
        <span className="text-slate-300 text-sm font-semibold">{formatPrice(value)}</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    approved: 'bg-green-500/20 text-green-300 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  const labels = {
    pending: 'Chờ Duyệt',
    approved: 'Đã Duyệt',
    rejected: 'Từ Chối',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  );
}