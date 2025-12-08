import React, { useEffect, useState } from "react";
import adminApi from "../apis/adminApi";
import StatCard from "./StatCard";
import { CurrencyIcon, OrderIcon, CakeIcon, UsersIcon } from "./icons";
import RevenueChart from "./charts/RevenueChart";
import OrdersChart from "./charts/OrdersChart";
import CustomersChart from "./charts/CustomersChart";

export default function StatisticsView() {
  const [stats, setStats] = useState({ revenue: 0, ordersToday: 0, products: 0, customers: 0 });
  const [loading, setLoading] = useState(true);
  const [topProducts, setTopProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customersList, setCustomersList] = useState([]);

  function formatCurrency(v) {
    if (v == null) return "0₫";
    return Number(v).toLocaleString("vi-VN") + "₫";
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

        const orders = ordersRes.data?.data || [];
        const pastries = pastriesRes.data?.data || [];
        const customers = customersRes.data?.data || [];

        const revenue = orders.reduce((s, o) => s + (Number(o.tongTien) || 0), 0);

        const today = new Date();
        const isSameDay = (d) => {
          if (!d) return false;
          const dt = new Date(d);
          return dt.getFullYear() === today.getFullYear() && dt.getMonth() === today.getMonth() && dt.getDate() === today.getDate();
        };
        const ordersToday = orders.filter((o) => isSameDay(o.ngayDatHang)).length;

        // top products by sold quantity if your pastry object has `soLuongDaBan` or similar.
        // Fallback: pick pastries by created order count is unavailable, so just show top by assumed `sales` field if present
        const top = pastries
          .slice()
          .sort((a, b) => (Number(b.sales || b.sold || 0) - Number(a.sales || a.sold || 0)))
          .slice(0, 4);

        if (!mounted) return;
        setOrders(orders);
        setCustomersList(customers);
        setStats({ revenue, ordersToday, products: pastries.length, customers: customers.length });
        setTopProducts(top);
      } catch (err) {
        console.error("Failed to load statistics", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Thống kê</h2>
        <p className="text-slate-500">Phân tích dữ liệu bán hàng chi tiết</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tổng doanh thu" value={formatCurrency(stats.revenue)} icon={CurrencyIcon} change={""} color="amber" />
        <StatCard label="Đơn hàng hôm nay" value={String(stats.ordersToday)} icon={OrderIcon} change={""} color="blue" />
        <StatCard label="Sản phẩm" value={String(stats.products)} icon={CakeIcon} change={""} color="green" />
        <StatCard label="Khách hàng" value={String(stats.customers)} icon={UsersIcon} change={""} color="purple" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Doanh thu theo tháng</h3>
          <div className="mb-4 text-3xl font-medium text-amber-600">{formatCurrency(stats.revenue)}</div>
          <RevenueChart orders={orders} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Đơn hàng theo tuần</h3>
          <div className="mb-4 text-3xl font-medium text-blue-600">{stats.ordersToday} đơn hôm nay</div>
          <OrdersChart orders={orders} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Sản phẩm bán chạy</h3>
          <div className="space-y-4">
            {topProducts.length === 0 ? (
              <div className="text-slate-500">Không có dữ liệu sản phẩm bán chạy</div>
            ) : (
              topProducts.map((item) => (
                <div key={item.id || item.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.name || item.tenBanh}</span>
                    <span className="text-slate-500">{item.sales || item.sold || 0} bán</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600"
                      style={{ width: `${Math.min(100, Number(item.sales || item.sold || 0))}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Khách hàng mới</h3>
          <div className="mb-4 text-3xl font-medium text-purple-600">{stats.customers}</div>
          <CustomersChart customers={customersList} />
        </div>
      </div>
    </div>
  );
}
