import React from "react";

export default function RecentOrdersTable() {
  const orders = [
    {
      id: "0001",
      customer: "Nguyễn Văn A",
      total: "150,000đ",
      status: "Hoàn thành",
      date: "2025-11-30",
    },
    {
      id: "0002",
      customer: "Trần Thị B",
      total: "220,000đ",
      status: "Đang giao",
      date: "2025-11-30",
    },
    {
      id: "0003",
      customer: "Phạm Văn C",
      total: "180,000đ",
      status: "Chờ xác nhận",
      date: "2025-11-29",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-800">Đơn hàng gần đây</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-600">Mã đơn</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Khách hàng</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Tổng tiền</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Trạng thái</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Ngày</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs text-slate-600">{order.id}</td>
                <td className="px-4 py-3 text-slate-700">{order.customer}</td>
                <td className="px-4 py-3 font-semibold text-amber-600">{order.total}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
