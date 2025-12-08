import React from "react";

export default function RecentOrdersTable({ orders = [], loading = false }) {
  function formatPrice(v) {
    if (v == null) return "0₫";
    return Number(v).toLocaleString("vi-VN") + "₫";
  }

  const rows = (orders && orders.length > 0) ? orders : [];

  function getStatusInfo(status) {
    if (!status) return { label: "Chưa rõ", classes: "bg-amber-100 text-amber-700" };
    const s = String(status).toUpperCase();
    switch (s) {
      case "COMPLETED":
      case "DONE":
        return { label: "Hoàn thành", classes: "bg-green-100 text-green-700" };
      case "PAID":
      case "PAID_SUCCESS":
        return { label: "Đã thanh toán", classes: "bg-indigo-100 text-indigo-700" };
      case "DELIVERING":
      case "SHIPPING":
        return { label: "Đang giao", classes: "bg-blue-100 text-blue-700" };
      case "PENDING":
      case "NEW":
      case "CREATED":
        return { label: "Chờ xác nhận", classes: "bg-amber-100 text-amber-700" };
      case "CANCELLED":
      case "CANCELED":
        return { label: "Đã hủy", classes: "bg-red-100 text-red-700" };
      case "REFUND_PENDING":
      case "REFUND_REQUESTED":
        return { label: "Chờ hoàn tiền", classes: "bg-amber-100 text-amber-700" };
      case "REFUNDED":
      case "REFUND_COMPLETED":
        return { label: "Đã hoàn tiền", classes: "bg-green-100 text-green-700" };
      default:
        return { label: String(status), classes: "bg-amber-100 text-amber-700" };
    }
  }

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
                    {(() => {
                      const info = getStatusInfo(order.trangThai || order.trangThaiV2 || order.status);
                      return (
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${info.classes}`}>
                          {info.label}
                        </span>
                      );
                    })()}
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
