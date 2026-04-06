"use client";

import { useState } from "react";

const sampleCoupons = [
  { id: "1", code: "WELCOME10", type: "percent", value: 10, minOrder: 50000, maxUses: 100, used: 45, expires: "2024-12-31", active: true },
  { id: "2", code: "SAVE20K", type: "fixed", value: 20000, minOrder: 100000, maxUses: 50, used: 12, expires: "2024-06-30", active: true },
  { id: "3", code: "VIP30", type: "percent", value: 30, minOrder: 200000, maxUses: 20, used: 20, expires: "2024-04-30", active: false },
  { id: "4", code: "NEWUSER", type: "percent", value: 15, minOrder: 0, maxUses: 0, used: 230, expires: "", active: true },
  { id: "5", code: "SUMMER50", type: "fixed", value: 50000, minOrder: 150000, maxUses: 30, used: 8, expires: "2024-08-31", active: true },
];

export default function AdminCouponsPage() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Mã giảm giá</h1>
          <p className="text-slate-500 text-sm mt-1">{sampleCoupons.length} mã giảm giá</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 text-sm"
        >
          + Tạo mã mới
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
          <h3 className="font-semibold text-slate-900 mb-4">Tạo mã giảm giá mới</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Mã code (VD: SAVE20)" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <select className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white">
              <option value="percent">Giảm %</option>
              <option value="fixed">Giảm tiền cố định</option>
            </select>
            <input type="number" placeholder="Giá trị giảm" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <input type="number" placeholder="Đơn tối thiểu (VNĐ)" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <input type="number" placeholder="Số lần sử dụng tối đa (0=vô hạn)" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <input type="date" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <button className="mt-4 px-6 py-2.5 bg-brand-600 text-white font-semibold rounded-xl text-sm hover:bg-brand-700">Tạo mã</button>
        </div>
      )}      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Mã</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Loại</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Giá trị</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Đơn tối thiểu</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Sử dụng</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Hết hạn</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {sampleCoupons.map(c => (
              <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-5 py-3 text-sm font-mono font-bold text-brand-600">{c.code}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{c.type === "percent" ? "Phần trăm" : "Cố định"}</td>
                <td className="px-5 py-3 text-sm font-semibold">{c.type === "percent" ? `${c.value}%` : `${new Intl.NumberFormat("vi-VN").format(c.value)}₫`}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{c.minOrder > 0 ? `${new Intl.NumberFormat("vi-VN").format(c.minOrder)}₫` : "Không"}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{c.used}/{c.maxUses || "∞"}</td>
                <td className="px-5 py-3 text-sm text-slate-500">{c.expires || "Vô hạn"}</td>
                <td className="px-5 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    {c.active ? "Hoạt động" : "Hết hạn"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="text-xs text-brand-600 font-medium mr-2">Sửa</button>
                  <button className="text-xs text-red-500 font-medium">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}