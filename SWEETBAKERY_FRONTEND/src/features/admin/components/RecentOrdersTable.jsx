import React from "react";

export default function RecentOrdersTable({ orders = [], loading = false }) {
  function formatPrice(v) {
    if (v == null) return "0₫";
    return Number(v).toLocaleString("vi-VN") + "₫";
  }

  const rows = (orders && orders.length > 0) ? orders : [];

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
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">Đang tải...</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">Không có đơn hàng</td>
              </tr>
            ) : (
              rows.map((order) => (
                <tr key={order.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{order.id}</td>
                  <td className="px-4 py-3 text-slate-700">{order.customerName || "N/A"}</td>
                  <td className="px-4 py-3 font-semibold text-amber-600">{formatPrice(order.tongTien)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${order.trangThai === "COMPLETED" ? "bg-green-100 text-green-700" : order.trangThai === "PAID" ? "bg-indigo-100 text-indigo-700" : "bg-amber-100 text-amber-700"}`}>
                      {order.trangThai}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{order.ngayDatHang ? new Date(order.ngayDatHang).toLocaleString() : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
