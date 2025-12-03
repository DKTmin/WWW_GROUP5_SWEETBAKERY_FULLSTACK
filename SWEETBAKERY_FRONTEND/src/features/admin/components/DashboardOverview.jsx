import React from "react";
import { CurrencyIcon, OrderIcon, CakeIcon, UsersIcon } from "./icons";
import StatCard from "./StatCard";
import RecentOrdersTable from "./RecentOrdersTable";

export default function DashboardOverview() {
  const stats = [
    {
      label: "Tổng doanh thu",
      value: "125,500,000đ",
      icon: CurrencyIcon,
      change: "+12.5%",
      color: "amber",
    },
    { label: "Đơn hàng hôm nay", value: "48", icon: OrderIcon, change: "+8.2%", color: "blue" },
    { label: "Sản phẩm", value: "156", icon: CakeIcon, change: "+3", color: "green" },
    { label: "Khách hàng", value: "1,234", icon: UsersIcon, change: "+24", color: "purple" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Tổng quan</h2>
        <p className="text-slate-500">Chào mừng trở lại! Đây là tình hình cửa hàng hôm nay.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <RecentOrdersTable />
    </div>
  );
}
