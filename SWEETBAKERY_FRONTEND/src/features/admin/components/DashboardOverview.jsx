import React, { useEffect, useState } from "react";
import { CurrencyIcon, OrderIcon, CakeIcon, UsersIcon } from "./icons";
import StatCard from "./StatCard";
import RecentOrdersTable from "./RecentOrdersTable";
import adminApi from "../apis/adminApi";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    revenue: 0,
    ordersToday: 0,
    products: 0,
    customers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

        const orders = (ordersRes.data?.data) || [];
        const pastries = (pastriesRes.data?.data) || [];
        const customers = (customersRes.data?.data) || [];

        // total revenue (sum tongTien)
        const revenue = orders.reduce((s, o) => {
    const status = String(o.trangThai || "").toUpperCase();
    // Copy logic lọc trạng thái từ StatisticsView sang
    if(status === 'COMPLETED' || status === 'PAID' || status === 'DONE') {
        return s + (Number(o.tongTien) || 0);
    }
    return s;
}, 0);
        // orders today
        const today = new Date();
        const isSameDay = (d) => {
          if (!d) return false;
          const dt = new Date(d);
          return dt.getFullYear() === today.getFullYear() && dt.getMonth() === today.getMonth() && dt.getDate() === today.getDate();
        };
        const ordersToday = orders.filter((o) => isSameDay(o.ngayDatHang)).length;

        if (!mounted) return;
        setStats({ revenue, ordersToday, products: pastries.length, customers: customers.length });

        // recent orders (sort by date desc and take 5)
        const sorted = orders.slice().sort((a, b) => {
          const da = a.ngayDatHang ? new Date(a.ngayDatHang) : new Date(0);
          const db = b.ngayDatHang ? new Date(b.ngayDatHang) : new Date(0);
          return db - da;
        });
        setRecentOrders(sorted.slice(0, 6));
      } catch (err) {
        console.error("Failed to load dashboard data", err);
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
        <h2 className="text-2xl font-bold text-slate-800">Tổng quan</h2>
        <p className="text-slate-500">Tình hình cửa hàng hôm nay</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tổng doanh thu" value={formatCurrency(stats.revenue)} icon={CurrencyIcon} change={""} color="amber" />
        <StatCard label="Đơn hàng hôm nay" value={String(stats.ordersToday)} icon={OrderIcon} change={""} color="blue" />
        <StatCard label="Sản phẩm" value={String(stats.products)} icon={CakeIcon} change={""} color="green" />
        <StatCard label="Khách hàng" value={String(stats.customers)} icon={UsersIcon} change={""} color="purple" />
      </div>

      <RecentOrdersTable orders={recentOrders} loading={loading} />
    </div>
  );
}
