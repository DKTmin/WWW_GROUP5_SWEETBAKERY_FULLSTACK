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
    case "CONFIRMED":
      return "Đã xác nhận";
    case "COMPLETED":
      return "Hoàn thành";
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
    case "CONFIRMED":
      return "bg-blue-100 text-blue-700";
    case "COMPLETED":
      return "bg-green-100 text-green-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
];

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
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

  // Open status update modal
  const handleUpdateStatus = (orderId, currentStatus) => {
    setUpdatingOrderId(orderId);
    setNewStatus(currentStatus);
    setShowStatusModal(true);
  };

  // Update order status
  const handleConfirmStatusUpdate = async () => {
    if (!updatingOrderId || !newStatus) return;

    try {
      await adminApi.updateOrderStatus(updatingOrderId, newStatus);
      alert("Cập nhật trạng thái thành công!");
      setShowStatusModal(false);
      setUpdatingOrderId(null);
      setNewStatus("");
      fetchOrders(); // Reload orders
    } catch (err) {
      console.error("Update order status failed:", err);
      alert("Cập nhật trạng thái thất bại!");
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
                    <button
                      onClick={() => handleUpdateStatus(order.id, order.trangThai)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Cập nhật
                    </button>
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

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="border-b border-slate-200 px-6 py-4">
              <h3 className="text-xl font-bold text-slate-800">Cập nhật trạng thái đơn hàng</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Trạng thái mới
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setUpdatingOrderId(null);
                  setNewStatus("");
                }}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmStatusUpdate}
                className="flex-1 rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
