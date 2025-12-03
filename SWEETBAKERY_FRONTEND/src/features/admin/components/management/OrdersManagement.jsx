import React, { useState } from "react";

export default function OrdersManagement() {
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      customer: "Nguyễn Văn A",
      total: "250,000đ",
      items: 3,
      status: "Hoàn thành",
      date: "2025-11-30",
    },
    {
      id: "ORD002",
      customer: "Trần Thị B",
      total: "420,000đ",
      items: 2,
      status: "Đang giao",
      date: "2025-11-30",
    },
    {
      id: "ORD003",
      customer: "Phạm Văn C",
      total: "180,000đ",
      items: 1,
      status: "Chờ xác nhận",
      date: "2025-11-29",
    },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Quản lý đơn hàng</h2>
        <p className="text-slate-500">Xem và quản lý tất cả đơn hàng của khách hàng</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-600">Mã đơn</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Khách hàng</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Số mặt hàng</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Tổng tiền</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Trạng thái</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Ngày</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-mono font-medium text-slate-800">{order.id}</td>
                <td className="px-4 py-3 text-slate-700">{order.customer}</td>
                <td className="px-4 py-3 text-slate-600">{order.items}</td>
                <td className="px-4 py-3 font-semibold text-amber-600">{order.total}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      order.status === "Hoàn thành"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Đang giao"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{order.date}</td>
                <td className="px-4 py-3 space-x-2">
                  <button className="text-amber-600 hover:text-amber-700">Chi tiết</button>
                  <button className="text-blue-600 hover:text-blue-700">Cập nhật</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
