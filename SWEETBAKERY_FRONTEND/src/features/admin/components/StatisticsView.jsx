import React, { useEffect, useState } from "react";
import adminApi from "../apis/adminApi";
import StatCard from "./StatCard";
import { CurrencyIcon, OrderIcon, CakeIcon, UsersIcon } from "./icons";
import RevenueChart from "./charts/RevenueChart";
import OrdersChart from "./charts/OrdersChart";

export default function StatisticsView() {
  const [stats, setStats] = useState({ revenue: 0, ordersToday: 0, products: 0, customers: 0 });
  const [loading, setLoading] = useState(true);

  // Dữ liệu gốc
  const [orders, setOrders] = useState([]);
  const [pastries, setPastries] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

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

  // Helper: lấy ảnh sản phẩm từ nhiều trường có thể có
  function getProductImage(p) {
    if (!p) return null;
    return (
      p.hinhAnh ||
      p.image ||
      p.anh ||
      (Array.isArray(p.images) && p.images[0]) ||
      p.thumbnail ||
      p.thumb ||
      ""
    );
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const [ordersRes, pastriesRes, usersRes] = await Promise.all([
          adminApi.getAllOrders(),
          adminApi.getAdminPastries(),
          adminApi.getAllUsers(),
        ]);

        const ordersData = ordersRes.data?.data || ordersRes.data || [];
        const pastriesData = pastriesRes.data?.data || pastriesRes.data || [];
        const usersData = usersRes.data?.data || usersRes.data || [];

        // 1. Tính tổng doanh thu (chỉ đơn thành công)
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
          return dt.getFullYear() === today.getFullYear() &&
            dt.getMonth() === today.getMonth() &&
            dt.getDate() === today.getDate();
        };
        const ordersToday = ordersData.filter((o) => isSameDay(o.ngayDatHang || o.createdAt || o.createdDate)).length;

        // 3. Logic tính sản phẩm bán chạy
        const salesMap = {};
        ordersData.forEach(order => {
          const status = String(order.trangThai || order.status || "").toUpperCase();
          if (!['CANCELLED', 'DA_HUY', 'CANCELED', 'HỦY'].includes(status)) {
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
            return {
              ...p,
              sold: salesMap[pIdKey] || 0
            };
          })
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 4);

        if (!mounted) return;

        setOrders(ordersData);
        setPastries(pastriesData);
        setTopProducts(calculatedTop);

        setStats({
          revenue,
          ordersToday,
          products: pastriesData.length,
          customers: usersData.length
        });

      } catch (err) {
        console.error("Failed to load statistics", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // Tính giá trị max để hiển thị % progress (tránh chia cho 0)
  const maxSold = topProducts && topProducts.length ? Math.max(...topProducts.map(p => p.sold || 0)) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Thống kê</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tổng doanh thu" value={formatCurrency(stats.revenue)} icon={CurrencyIcon} color="amber" />
        <StatCard label="Đơn hàng hôm nay" value={String(stats.ordersToday)} icon={OrderIcon} color="blue" />
        <StatCard label="Sản phẩm" value={String(stats.products)} icon={CakeIcon} color="green" />
        <StatCard label="Khách hàng (TK)" value={String(stats.customers)} icon={UsersIcon} color="purple" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Doanh thu theo ngày</h3>
            <input
              type="month"
              value={revenueMonth}
              onChange={(e) => setRevenueMonth(e.target.value)}
              className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
          <RevenueChart orders={orders} selectedMonth={revenueMonth} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Đơn hàng theo tuần</h3>
            <input
              type="week"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <OrdersChart orders={orders} selectedWeek={selectedWeek} />
        </div>

        {/* TOP PRODUCTS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Sản phẩm bán chạy</h3>
            <div className="text-sm text-slate-500">{topProducts.length} mục</div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-amber-300 border-t-transparent" />
            </div>
          ) : topProducts.length === 0 || (topProducts[0] && topProducts[0].sold === 0) ? (
            <div className="text-slate-500 text-center py-8">
              Chưa có dữ liệu bán hàng
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((item, idx) => {
                const img = getProductImage(item);
                const sold = item.sold || 0;
                const percent = maxSold > 0 ? Math.round((sold / maxSold) * 100) : 0;
                return (
                  <div key={item.id ?? item._id ?? idx} className="flex items-center gap-4">
                    <div className="relative flex items-center">
                      <div className="h-14 w-14 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center">
                        {img ? (
                          <img src={img} alt={item.tenBanh || item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="text-slate-400 text-xs">No image</div>
                        )}
                      </div>
                      <div className={`absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${idx === 0 ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                        {idx + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-slate-800 truncate">{item.tenBanh || item.name || item.ten || item.title}</div>
                        <div className="text-sm font-semibold text-slate-600">{sold} đã bán</div>
                      </div>

                      <div className="mt-2">
                        <div className="relative h-3 w-full rounded-full bg-slate-100">
                          <div
                            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                          <div className="truncate">{item.categoryName || item.loai || ''}</div>
                          <div>{percent}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}