'use client';

import { useState, useEffect } from 'react';
import { Mail, Send, Users, ShoppingCart, Eye, MousePointerClick, Plus, Trash2, Bell } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

interface Subscriber {
  email: string;
  name: string;
  subscribed_at: string;
  status: 'active' | 'unsubscribed';
  source: 'footer' | 'popup' | 'checkout';
}

interface Campaign {
  id: string;
  subject: string;
  content: string;
  type: 'newsletter' | 'abandoned_cart' | 'welcome' | 'promo';
  status: 'draft' | 'sent';
  sent_at?: string;
  recipients_count: number;
  open_count: number;
  click_count: number;
  created_at: string;
}

interface AbandonedCart {
  email: string;
  items: { promptId: string; title: string; price: number }[];
  created_at: string;
  reminded: boolean;
  recovered: boolean;
}

export default function EmailMarketingPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'subscribers' | 'campaigns' | 'carts'>('subscribers');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);

  // Campaign creation states
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    subject: '',
    content: '',
    type: 'newsletter' as Campaign['type']
  });
  const [campaignLoading, setCampaignLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subRes, campRes, cartRes] = await Promise.all([
        fetch('/api/newsletter'),
        fetch('/api/email-campaigns'),
        fetch('/api/abandoned-cart')
      ]);

      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscribers(subData.data || []);
      }
      if (campRes.ok) {
        const campData = await campRes.json();
        setCampaigns(campData.data || []);
      }
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        setAbandonedCarts(cartData.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async () => {
    if (!newCampaign.subject || !newCampaign.content) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setCampaignLoading(true);
    try {
      const response = await fetch('/api/email-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          ...newCampaign
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCampaigns([...campaigns, data.data]);
        setNewCampaign({ subject: '', content: '', type: 'newsletter' });
        setShowNewCampaign(false);
      }
    } catch (error) {
      console.error('Failed to create campaign:', error);
    } finally {
      setCampaignLoading(false);
    }
  };

  const sendCampaign = async (campaignId: string) => {
    try {
      const response = await fetch('/api/email-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          campaign_id: campaignId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCampaigns(campaigns.map(c => c.id === campaignId ? data.data : c));
      }
    } catch (error) {
      console.error('Failed to send campaign:', error);
    }
  };

  const remindAbandonedCart = async (email: string) => {
    try {
      const response = await fetch('/api/abandoned-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          action: 'remind'
        })
      });

      if (response.ok) {
        setAbandonedCarts(abandonedCarts.map(c => 
          c.email === email ? { ...c, reminded: true } : c
        ));
      }
    } catch (error) {
      console.error('Failed to remind cart:', error);
    }
  };

  const recoverCart = async (email: string) => {
    try {
      const response = await fetch('/api/abandoned-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          action: 'recover'
        })
      });

      if (response.ok) {
        setAbandonedCarts(abandonedCarts.map(c => 
          c.email === email ? { ...c, recovered: true } : c
        ));
      }
    } catch (error) {
      console.error('Failed to recover cart:', error);
    }
  };

  const stats = {
    totalSubscribers: subscribers.length,
    activeSubscribers: subscribers.filter(s => s.status === 'active').length,
    campaignsSent: campaigns.filter(c => c.status === 'sent').length,
    cartRecoveryRate: abandonedCarts.length > 0 
      ? Math.round((abandonedCarts.filter(c => c.recovered).length / abandonedCarts.length) * 100)
      : 0
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 mb-2">
            <Mail className="w-10 h-10 text-blue-600" />
            Tiếp thị Email
          </h1>
          <p className="text-gray-600">Quản lý đăng ký, chiến dịch và giỏ hàng bỏ lại</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Tổng người đăng ký</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSubscribers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Người đăng ký hoạt động</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeSubscribers}</p>
              </div>
              <Mail className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Chiến dịch đã gửi</p>
                <p className="text-3xl font-bold text-gray-900">{stats.campaignsSent}</p>
              </div>
              <Send className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Tỉ lệ khôi phục giỏ</p>
                <p className="text-3xl font-bold text-gray-900">{stats.cartRecoveryRate}%</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`px-4 py-3 font-medium border-b-2 transition ${
                activeTab === 'subscribers'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              Người đăng ký ({stats.totalSubscribers})
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`px-4 py-3 font-medium border-b-2 transition ${
                activeTab === 'campaigns'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="w-5 h-5 inline mr-2" />
              Chiến dịch ({campaigns.length})
            </button>
            <button
              onClick={() => setActiveTab('carts')}
              className={`px-4 py-3 font-medium border-b-2 transition ${
                activeTab === 'carts'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <ShoppingCart className="w-5 h-5 inline mr-2" />
              Giỏ hàng ({abandonedCarts.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Đang tải...</p>
          </div>
        ) : (
          <>
            {/* Subscribers Tab */}
            {activeTab === 'subscribers' && (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-200 bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tên</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nguồn</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ngày đăng ký</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((sub, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{sub.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{sub.name}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              {sub.source === 'footer' ? '🔗 Footer' : sub.source === 'popup' ? '📱 Popup' : '🛒 Checkout'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              sub.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {sub.status === 'active' ? '✓ Hoạt động' : '✗ Hủy'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(sub.subscribed_at).toLocaleDateString('vi-VN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {subscribers.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Chưa có người đăng ký</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Campaigns Tab */}
            {activeTab === 'campaigns' && (
              <div>
                <button
                  onClick={() => setShowNewCampaign(!showNewCampaign)}
                  className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Tạo chiến dịch mới
                </button>

                {showNewCampaign && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">Tạo chiến dịch email mới</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tiêu đề
                        </label>
                        <input
                          type="text"
                          value={newCampaign.subject}
                          onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nhập tiêu đề chiến dịch"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Loại chiến dịch
                        </label>
                        <select
                          value={newCampaign.type}
                          onChange={(e) => setNewCampaign({...newCampaign, type: e.target.value as Campaign['type']})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="newsletter">Newsletter</option>
                          <option value="welcome">Chào mừng</option>
                          <option value="promo">Khuyến mãi</option>
                          <option value="abandoned_cart">Giỏ hàng bỏ lại</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nội dung
                        </label>
                        <textarea
                          value={newCampaign.content}
                          onChange={(e) => setNewCampaign({...newCampaign, content: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                          placeholder="Nhập nội dung email"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={createCampaign}
                          disabled={campaignLoading}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg"
                        >
                          {campaignLoading ? 'Đang tạo...' : 'Tạo chiến dịch'}
                        </button>
                        <button
                          onClick={() => setShowNewCampaign(false)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-6 rounded-lg"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {campaign.subject}
                          </h3>
                          <div className="flex gap-2 mb-4">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                              {campaign.type === 'newsletter' ? 'Newsletter' : 
                               campaign.type === 'welcome' ? 'Chào mừng' :
                               campaign.type === 'promo' ? 'Khuyến mãi' : 'Giỏ hàng bỏ lại'}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              campaign.status === 'sent'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {campaign.status === 'sent' ? '✓ Đã gửi' : '📝 Bản nháp'}
                            </span>
                          </div>
                        </div>
                        {campaign.status === 'draft' && (
                          <button
                            onClick={() => sendCampaign(campaign.id)}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            Gửi
                          </button>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {campaign.content}
                      </p>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-600">Người nhận</p>
                            <p className="text-lg font-semibold text-gray-900">{campaign.recipients_count}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-600">Mở</p>
                            <p className="text-lg font-semibold text-gray-900">{campaign.open_count}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MousePointerClick className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-600">Nhấp</p>
                            <p className="text-lg font-semibold text-gray-900">{campaign.click_count}</p>
                          </div>
                        </div>
                      </div>

                      {campaign.sent_at && (
                        <p className="text-xs text-gray-500 mt-4">
                          Gửi vào: {new Date(campaign.sent_at).toLocaleDateString('vi-VN')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {campaigns.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có chiến dịch nào</p>
                  </div>
                )}
              </div>
            )}

            {/* Abandoned Carts Tab */}
            {activeTab === 'carts' && (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-200 bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sản phẩm</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tổng giá</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {abandonedCarts.map((cart, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{cart.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <div className="space-y-1">
                              {cart.items.map((item, i) => (
                                <div key={i} className="text-xs">
                                  {item.title}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {cart.items.reduce((sum, item) => sum + item.price, 0).toLocaleString('vi-VN')} đ
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="space-y-1">
                              {cart.reminded && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded block">
                                  📬 Đã nhắc
                                </span>
                              )}
                              {cart.recovered && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded block">
                                  ✓ Khôi phục
                                </span>
                              )}
                              {!cart.reminded && !cart.recovered && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded block">
                                  ⚠️ Bỏ lại
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm space-x-2">
                            {!cart.reminded && (
                              <button
                                onClick={() => remindAbandonedCart(cart.email)}
                                className="inline-flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded text-xs font-medium"
                              >
                                <Bell className="w-3 h-3" />
                                Nhắc
                              </button>
                            )}
                            {!cart.recovered && (
                              <button
                                onClick={() => recoverCart(cart.email)}
                                className="inline-flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded text-xs font-medium"
                              >
                                <ShoppingCart className="w-3 h-3" />
                                Khôi phục
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {abandonedCarts.length === 0 && (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Không có giỏ hàng bỏ lại</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}