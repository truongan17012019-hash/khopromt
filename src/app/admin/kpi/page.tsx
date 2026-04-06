"use client";

import { useEffect, useState } from "react";

const TARGETS = {
  ctrBuy: 3,
  checkoutStart: 8,
  purchaseRate: 1.5,
};

export default function AdminKpiPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    totalEvents: 0,
    views: 0,
    addToCart: 0,
    startCheckout: 0,
    purchase: 0,
    viewToCartRate: 0,
    cartToCheckoutRate: 0,
    checkoutToPurchaseRate: 0,
  });
  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/funnel", { cache: "no-store" });
      const json = await res.json();
      if (res.ok) {
        setData({
          totalEvents: Number(json?.totalEvents || 0),
          ...(json?.stats || {}),
        });
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">KPI 7 ngày</h1>
          <p className="text-slate-500 text-sm mt-1">
            Funnel thật từ dữ liệu server-side events
          </p>
        </div>
        <button
          onClick={load}
          className="px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
        >
          Refresh dữ liệu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <p className="text-sm text-slate-500">View prompt</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{data.views || 0}</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Add to cart</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{data.addToCart || 0}</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Start checkout</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{data.startCheckout || 0}</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Purchase</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{data.purchase || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <p className="text-sm text-slate-500">View → Cart</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {Number(data.viewToCartRate || 0).toFixed(2)}%
          </p>
          <p className="text-xs mt-2 text-slate-500">
            Mục tiêu {">"} {TARGETS.ctrBuy}%
          </p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Cart → Checkout</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {Number(data.cartToCheckoutRate || 0).toFixed(2)}%
          </p>
          <p className="text-xs mt-2 text-slate-500">
            Mục tiêu {">"} {TARGETS.checkoutStart}%
          </p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Checkout → Purchase</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {Number(data.checkoutToPurchaseRate || 0).toFixed(2)}%
          </p>
          <p className="text-xs mt-2 text-slate-500">
            Mục tiêu {">"} {TARGETS.purchaseRate}%
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        {loading ? "Đang tải dữ liệu…" : `Tổng events 7 ngày: ${data.totalEvents}.`}
      </p>
    </div>
  );
}
