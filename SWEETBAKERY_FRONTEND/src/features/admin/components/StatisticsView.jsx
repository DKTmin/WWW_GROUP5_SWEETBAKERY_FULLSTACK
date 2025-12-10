import React, { useEffect, useState } from "react";
import adminApi from "../apis/adminApi";
import axiosClient from "../../../utils/axiosClient";
import StatCard from "./StatCard";
import { CurrencyIcon, OrderIcon, CakeIcon, UsersIcon } from "./icons";
import RevenueChart from "./charts/RevenueChart";
import OrdersChart from "./charts/OrdersChart";

export default function StatisticsView() {
  const [stats, setStats] = useState({ revenue: 0, ordersToday: 0, products: 0, customers: 0 });
  const [loading, setLoading] = useState(true);

  // Dữ liệu gốc từ API
  const [orders, setOrders] = useState([]);
  const [pastries, setPastries] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  // State bộ lọc
  const [revenueMonth, setRevenueMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedWeek, setSelectedWeek] = useState("");

  useEffect(() => {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    const week = Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
    setSelectedWeek(`${now.getFullYear()}-W${String(week).padStart(2, '0')}`);
  }, []);

  function formatCurrency(v) {
    if (v == null) return "0₫";
    return Number(v).toLocaleString("vi-VN") + "₫";
  }

  function formatDateShort(d) {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
    } catch (e) {
      return String(d);
    }
  }

  // Trả về URL ảnh (hỗ trợ nhiều trường, và nối baseURL nếu là path relative)
  function getProductImage(p) {
    if (!p) return "";
    const url =
      p.imageUrl ||
      p.image ||
      p.hinhAnh ||
      p.anh ||
      (Array.isArray(p.images) && p.images[0]) ||
      p.thumbnail ||
      p.thumb ||
      "";
    if (!url) return "";
    if (/^https?:\/\//i.test(url) || url.startsWith("data:") || url.startsWith("//")) {
      return url;
    }
    // Nếu là path bắt đầu bằng '/', nối với baseURL từ axiosClient hoặc origin hiện tại
    try {
      const base = axiosClient?.defaults?.baseURL || "";
      if (base) {
        return base.replace(/\/$/, "") + "/" + url.replace(/^\/+/, "");
      }
    } catch (e) {}
    return window.location.origin.replace(/\/$/, "") + "/" + url.replace(/^\/+/, "");
  }

  function getStatusStyle(status) {
    const s = String(status || "").toUpperCase();
    if (['COMPLETED', 'PAID', 'DONE', 'DELIVERED', 'HOAN_THANH'].includes(s))
      return "bg-green-100 text-green-700 border-green-200";
    if (['CANCELLED', 'DA_HUY', 'CANCELED', 'HUY'].includes(s))
      return "bg-red-100 text-red-700 border-red-200";
    if (['PENDING', 'CHO_XU_LY', 'PROCESSING'].includes(s))
      return "bg-amber-100 text-amber-700 border-amber-200";
    if (['SHIPPING', 'DANG_GIAO'].includes(s))
      return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const [ordersRes, pastriesRes, customersRes] = await Promise.all([
          adminApi.getAllOrders(),
          adminApi.getAdminPastries(),
          adminApi.getAllCustomers(),
        ]);

        const ordersData = ordersRes.data?.data || ordersRes.data || [];
        const pastriesData = pastriesRes.data?.data || pastriesRes.data || [];
        const customersData = customersRes.data?.data || customersRes.data || [];

        // DEBUG (bật console nếu cần kiểm tra cấu trúc): console.log(ordersData[0])

        // 1. Tính tổng doanh thu (chi các trạng thái thành công)
        const revenue = ordersData.reduce((s, o) => {
          const status = String(o.trangThai || o.status || "").toUpperCase();
          if (['COMPLETED', 'PAID', 'DONE', 'DELIVERED', 'HOAN_THANH'].includes(status)) {
            return s + (Number(o.tongTien || o.total || o.amount) || 0);
          }
          return s;
        }, 0);

        // 2. Tính đơn hôm nay
        const today = new Date();
        const isSameDay = (d) => {
          if (!d) return false;
          const dt = new Date(d);
          return dt.getFullYear() === today.getFullYear() && dt.getMonth() === today.getMonth() && dt.getDate() === today.getDate();
        };
        const ordersToday = ordersData.filter((o) => isSameDay(o.ngayDatHang || o.createdAt || o.createdDate)).length;

        // 3. Tính sản phẩm bán chạy (hỗ trợ nhiều biến thể payload)
        const salesMap = {};
        ordersData.forEach(order => {
          const status = String(order.trangThai || order.status || "").toUpperCase();
          // loại bỏ đơn hủy
          if (!['CANCELLED', 'DA_HUY', 'CANCELED', 'HUY'].includes(status)) {
            const details = order.listChiTietDonHang || order.orderDetails || order.items || [];
            if (Array.isArray(details)) {
              details.forEach(item => {
                const pastryId =
                  item?.banhNgot?.id ||
                  item?.banhNgotId ||
                  item?.pastry?.id ||
                  item?.pastryId ||
                  item?.product?.id ||
                  item?.productId ||
                  item?.id ||
                  null;
                const qty = Number(item?.soLuong ?? item?.qty ?? item?.quantity ?? item?.quantityOrdered ?? 0) || 0;
                if (pastryId && qty > 0) {
                  const key = String(pastryId);
                  salesMap[key] = (salesMap[key] || 0) + qty;
                }
              });
            }
          }
        });

        const calculatedTop = pastriesData
          .map(p => {
            const pIdKey = String(p.id ?? p._id ?? p.pastryId ?? "");
            return { ...p, sold: salesMap[pIdKey] || 0 };
          })
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 4);

        // 4. Đơn hàng gần đây (take 5)
        const sortedOrders = [...ordersData]
          .sort((a, b) => {
            const da = new Date(a.ngayDatHang || a.createdAt || a.createdDate || 0).getTime();
            const db = new Date(b.ngayDatHang || b.createdAt || b.createdDate || 0).getTime();
            return db - da;
          })
          .slice(0, 5);

        if (!mounted) return;

        setOrders(ordersData);
        setPastries(pastriesData);
        setCustomersList(customersData);
        setTopProducts(calculatedTop);
        setRecentOrders(sortedOrders);

        setStats({ revenue, ordersToday, products: pastriesData.length, customers: customersData.length });
      } catch (err) {
        console.error("Failed to load statistics", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const maxSold = topProducts && topProducts.length ? Math.max(...topProducts.map(p => p.sold || 0)) : 0;

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Thống kê</h2>
        <p className="text-slate-500 text-sm mt-1">Tổng hợp số liệu kinh doanh của cửa hàng</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tổng doanh thu" value={formatCurrency(stats.revenue)} icon={CurrencyIcon} color="amber" />
        <StatCard label="Đơn hàng hôm nay" value={String(stats.ordersToday)} icon={OrderIcon} color="blue" />
        <StatCard label="Sản phẩm" value={String(stats.products)} icon={CakeIcon} color="green" />
        <StatCard label="Khách hàng" value={String(stats.customers)} icon={UsersIcon} color="purple" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 items-start">
        {/* Cột trái - làm flex để 2 card trong cột chia đều theo chiều dọc */}
        <div className="flex flex-col gap-6 h-full">
          {/* Chart (cho chart một chiều cao tối thiểu) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-[340px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Doanh thu theo ngày</h3>
              <input
                type="month"
                value={revenueMonth}
                onChange={(e) => setRevenueMonth(e.target.value)}
                className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
              />
            </div>
            <RevenueChart orders={orders} selectedMonth={revenueMonth} />
          </div>

          {/* Top products: đảm bảo min-height khớp với mini orders ở cột phải */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm min-h-[220px] flex-1">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Top sản phẩm bán chạy</h3>
              <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-700 rounded-full">Top 4</span>
            </div>

            {loading ? (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-2 border-amber-500 rounded-full animate-spin border-t-transparent"></div>
              </div>
            ) : topProducts.length === 0 || (topProducts[0] && topProducts[0].sold === 0) ? (
              <div className="text-slate-400 text-center py-6 text-sm">Chưa có dữ liệu</div>
            ) : (
              <div className="space-y-5">
                {topProducts.map((item, idx) => {
                  const img = getProductImage(item);
                  const sold = item.sold || 0;
                  const percent = maxSold > 0 ? Math.round((sold / maxSold) * 100) : 0;
                  return (
                    <div key={item.id ?? item._id ?? idx} className="flex items-center gap-4 group">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-slate-100 shadow-sm">
                          {img ? <img src={img} alt={item.tenBanh || item.name} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-slate-200" />}
                        </div>
                        <div className={`absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold shadow-sm border border-white ${idx === 0 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                          #{idx + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-semibold text-slate-700 truncate pr-2">{item.tenBanh || item.name || item.title}</span>
                            <span className="text-xs font-bold text-slate-500">{sold} đã bán</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Cột phải - cũng làm flex-col và đồng bộ min-heights với cột trái */}
        <div className="flex flex-col gap-6 h-full">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-[340px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Đơn hàng theo tuần</h3>
              <input
                type="week"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
              />
            </div>
            <OrdersChart orders={orders} selectedWeek={selectedWeek} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm min-h-[220px] flex-1">
             <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Đơn hàng mới nhất</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">Xem tất cả</button>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs uppercase text-slate-400 font-semibold tracking-wider">
                      <th className="pb-3 pl-1">Mã</th>
                      <th className="pb-3">Ngày</th>
                      <th className="pb-3 text-right">Tổng</th>
                      <th className="pb-3 text-right pr-1">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentOrders.length === 0 ? (
                        <tr><td colSpan="4" className="text-center py-4 text-slate-400">Không có đơn hàng nào</td></tr>
                    ) : (
                        recentOrders.map((order, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                                <td className="py-3 pl-1 font-medium text-slate-700">#{order.id || order._id || '---'}</td>
                                <td className="py-3 text-slate-500">{formatDateShort(order.ngayDatHang || order.createdAt || order.createdDate)}</td>
                                <td className="py-3 text-right font-semibold text-slate-700">{formatCurrency(order.tongTien || order.total || order.amount || 0)}</td>
                                <td className="py-3 text-right pr-1">
                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(order.trangThai || order.status)}`}>
                                        {order.trangThai || order.status || "N/A"}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                  </tbody>
                </table>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}