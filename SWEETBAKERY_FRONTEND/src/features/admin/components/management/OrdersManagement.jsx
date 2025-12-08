import React, { useState, useEffect } from "react";
import adminApi from "./../../apis/adminApi";

function formatPrice(v) {
  if (v == null) return "";
  return Number(v).toLocaleString("vi-VN") + "₫";
}

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return dateString;
  }
}

function statusLabel(status) {
  if (!status) return "Chưa xác định";
  switch (status) {
    case "PENDING":
      return "Chờ xác nhận";
    case "PAID":
      return "Đã thanh toán";
    case "CONFIRMED":
      return "Đã xác nhận";
    case "COMPLETED":
      return "Hoàn thành";
    case "REFUND_PENDING":
      return "Đang đợi hoàn tiền";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status;
  }
}

function statusClass(status) {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-700";
    case "PAID":
      return "bg-indigo-100 text-indigo-700";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-700";
    case "COMPLETED":
      return "bg-green-100 text-green-700";
    case "REFUND_PENDING":
      return "bg-orange-100 text-orange-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "PAID", label: "Đã thanh toán" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "REFUND_PENDING", label: "Đang đợi hoàn tiền" },
  { value: "CANCELLED", label: "Đã hủy" },
];

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [confirmOrderId, setConfirmOrderId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [refundOrder, setRefundOrder] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundProofImageUrl, setRefundProofImageUrl] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAllOrders();
      const ordersData = res.data.data || [];
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (err) {
      console.error("Load orders failed:", err);
      alert("Không thể tải danh sách đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((order) => order.trangThai === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id?.toLowerCase().includes(term) ||
          order.customerName?.toLowerCase().includes(term) ||
          order.customerAddress?.toLowerCase().includes(term)
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchTerm]);

  // View order details
  const handleViewDetail = async (orderId) => {
    try {
      const res = await adminApi.getOrderById(orderId);
      setSelectedOrder(res.data.data);
      setShowDetailModal(true);
    } catch (err) {
      console.error("Load order detail failed:", err);
      alert("Không thể tải chi tiết đơn hàng!");
    }
  };

  // Confirm order (PAID -> CONFIRMED)
  const handleConfirmOrder = (orderId) => {
    setConfirmOrderId(orderId);
    setShowConfirmModal(true);
  };

  const confirmOrderStatus = async () => {
    if (!confirmOrderId) return;
    try {
      await adminApi.updateOrderStatus(confirmOrderId, "CONFIRMED");
      alert("Đã xác nhận đơn hàng!");
      setShowConfirmModal(false);
      setConfirmOrderId(null);
      fetchOrders();
    } catch (err) {
      console.error("Confirm order failed:", err);
      alert("Không thể xác nhận đơn hàng!");
    }
  };

  // Mark refund done (REFUND_PENDING -> CANCELLED)
  const handleRefund = async (order) => {
    try {
      // fetch fresh order details from server to ensure bankName and other fields are present
      const res = await adminApi.getOrderById(order.id);
      const full = res.data?.data || order;
      setRefundOrder(full);
      // prefill refund proof image if already present
      setRefundProofImageUrl(full.refundProofImageUrl || "");
      setShowRefundModal(true);
    } catch (err) {
      console.warn('Failed to fetch full order for refund modal, falling back to provided order', err);
      setRefundOrder(order);
      setShowRefundModal(true);
    }
  };

  const confirmRefund = async () => {
    if (!refundOrder?.id) return;
    try {
      await adminApi.updateOrderStatus(refundOrder.id, "CANCELLED", refundProofImageUrl || undefined);
      alert("Đã đánh dấu hoàn tiền và hủy đơn.");
      setShowRefundModal(false);
      setRefundOrder(null);
      setRefundProofImageUrl("");
      fetchOrders();
    } catch (err) {
      console.error("Refund mark failed:", err);
      alert("Không thể cập nhật hoàn tiền!");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý đơn hàng</h2>
          <p className="text-slate-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Quản lý đơn hàng</h2>
        <p className="text-slate-500">Xem và quản lý tất cả đơn hàng của khách hàng</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
          >
            <option value="ALL">Tất cả trạng thái</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-slate-500">Không có đơn hàng nào</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600">Mã đơn</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Khách hàng</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Số mặt hàng</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Tổng tiền</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Trạng thái</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Ngày đặt</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-medium text-slate-800">{order.id}</td>
                  <td className="px-4 py-3 text-slate-700">{order.customerName || "N/A"}</td>
                  <td className="px-4 py-3 text-slate-600">{order.items?.length || 0}</td>
                  <td className="px-4 py-3 font-semibold text-amber-600">{formatPrice(order.tongTien)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClass(order.trangThai)}`}>
                      {statusLabel(order.trangThai)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(order.ngayDatHang)}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleViewDetail(order.id)}
                      className="text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Chi tiết
                    </button>
                    {(order.trangThai === "PAID" || order.trangThai === "PENDING") && (
                      <button
                        onClick={() => handleConfirmOrder(order.id)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Xác nhận
                      </button>
                    )}
                    {order.trangThai === "REFUND_PENDING" && (
                      <button
                        onClick={() => handleRefund(order)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Hoàn tiền
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <h3 className="text-xl font-bold text-slate-800">Chi tiết đơn hàng</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Mã đơn hàng</p>
                  <p className="font-semibold text-slate-800">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Ngày đặt hàng</p>
                  <p className="font-semibold text-slate-800">{formatDate(selectedOrder.ngayDatHang)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Khách hàng</p>
                  <p className="font-semibold text-slate-800">{selectedOrder.customerName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Địa chỉ giao hàng</p>
                  <p className="font-semibold text-slate-800">{selectedOrder.customerAddress || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phương thức thanh toán</p>
                  <p className="font-semibold text-slate-800">{selectedOrder.paymentMethod || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Trạng thái</p>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClass(selectedOrder.trangThai)}`}>
                    {statusLabel(selectedOrder.trangThai)}
                  </span>
                </div>
                {selectedOrder.lyDoHuy && (
                  <div className="col-span-2">
                    <p className="text-sm text-red-600 font-semibold">Lý do hủy</p>
                    <p className="text-sm text-slate-700">{selectedOrder.lyDoHuy}</p>
                  </div>
                )}
                {(selectedOrder.bankAccountName || selectedOrder.bankAccountNumber || selectedOrder.bankName) && (
                  <div className="col-span-2">
                    <p className="text-sm text-slate-500 font-semibold">Thông tin hoàn tiền (VNPay)</p>
                    {selectedOrder.bankAccountName && <p className="text-sm">Tên chủ TK: {selectedOrder.bankAccountName}</p>}
                    {selectedOrder.bankAccountNumber && <p className="text-sm">Số tài khoản: {selectedOrder.bankAccountNumber}</p>}
                    {selectedOrder.bankName && <p className="text-sm">Ngân hàng: {selectedOrder.bankName}</p>}
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div>
                <h4 className="mb-3 font-semibold text-slate-800">Sản phẩm</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 border-b border-slate-100 pb-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{item.name}</p>
                        <p className="text-sm text-slate-500">Số lượng: {item.qty}</p>
                        <p className="text-sm text-slate-500">Đơn giá: {formatPrice(item.price)}</p>
                      </div>
                      <div className="font-semibold text-amber-600">
                        {formatPrice((item.price || 0) * (item.qty || 1))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-end border-t border-slate-200 pt-4">
                <div className="text-right">
                  <p className="text-sm text-slate-500">Tổng tiền</p>
                  <p className="text-2xl font-bold text-amber-600">{formatPrice(selectedOrder.tongTien)}</p>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                onClick={() => setShowDetailModal(false)}
                className="rounded-lg bg-slate-600 px-4 py-2 text-white hover:bg-slate-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="border-b border-slate-200 px-6 py-4">
              <h3 className="text-xl font-bold text-slate-800">Xác nhận đơn hàng</h3>
              <p className="text-sm text-slate-600 mt-1">Xác nhận đơn đã thanh toán để chuẩn bị giao hàng.</p>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-700">Bạn có chắc muốn xác nhận đơn hàng <span className="font-semibold">{confirmOrderId}</span>?</p>
            </div>
            <div className="flex gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmOrderId(null);
                }}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                Đóng
              </button>
              <button
                onClick={confirmOrderStatus}
                className="flex-1 rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && refundOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="border-b border-slate-200 px-6 py-4">
              <h3 className="text-xl font-bold text-slate-800">Hoàn tiền thủ công</h3>
              <p className="text-sm text-slate-600 mt-1">Xem thông tin và đánh dấu đã hoàn tiền cho khách.</p>
            </div>
            <div className="p-6 space-y-3 text-sm text-slate-700">
              <p><span className="font-semibold">Mã đơn:</span> {refundOrder.id}</p>
              <p><span className="font-semibold">Khách hàng:</span> {refundOrder.customerName || "N/A"}</p>
              <p><span className="font-semibold">Phương thức thanh toán:</span> {refundOrder.paymentMethod || "N/A"}</p>
              {refundOrder.paymentMethod && refundOrder.paymentMethod.toString().toUpperCase() === 'VNPAY' && (
                <div className="mt-2 space-y-1">
                  {refundOrder.bankAccountName && (
                    <p><span className="font-semibold">Tên chủ TK:</span> {refundOrder.bankAccountName}</p>
                  )}
                  {refundOrder.bankAccountNumber && (
                    <p><span className="font-semibold">Số tài khoản:</span> {refundOrder.bankAccountNumber}</p>
                  )}
                  {refundOrder.bankName && (
                    <p><span className="font-semibold">Ngân hàng:</span> {refundOrder.bankName}</p>
                  )}
                </div>
              )}
              <p><span className="font-semibold">Trạng thái hiện tại:</span> {statusLabel(refundOrder.trangThai)}</p>

              {refundOrder.lyDoHuy && (
                <p><span className="font-semibold text-red-700">Lý do hủy:</span> {refundOrder.lyDoHuy}</p>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Link chứng từ (Cloudinary)</label>
                <input
                  type="text"
                  value={refundProofImageUrl}
                  onChange={(e) => setRefundProofImageUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>
              <div className="rounded-lg bg-orange-50 border border-orange-200 p-3 text-orange-800">
                Kiểm tra thông tin chuyển khoản VNPay, thực hiện hoàn tiền thủ công. Sau khi hoàn tất, bấm "Đã hoàn tiền" để đổi trạng thái đơn sang đã hủy.
              </div>
            </div>
            <div className="flex gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                onClick={() => {
                  setShowRefundModal(false);
                  setRefundOrder(null);
                }}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                Đóng
              </button>
              <button
                onClick={confirmRefund}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Đã hoàn tiền
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
