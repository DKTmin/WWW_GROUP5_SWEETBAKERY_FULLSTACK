import React, { useState, useCallback, lazy, Suspense } from "react";
import Sidebar from "../components/Sidebar";
import HeaderBar from "../components/HeaderBar";
import DashboardOverview from "../components/DashboardOverview";
import StatisticsView from "../components/StatisticsView";
import SettingsView from "../components/SettingsView";
import EmployeeManagement from "../components/management/EmployeeManagement";

// lazy load management pages
const PastriesManagement = lazy(() => import("../components/management/PastriesManagement"));
const CategoriesManagement = lazy(() => import("../components/management/CategoriesManagement"));
const UsersManagement = lazy(() => import("../components/management/UsersManagement"));
const OrdersManagement = lazy(() => import("../components/management/OrdersManagement"));
import CustomerManagement from "./../components/management/CustomerManagement";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/admin";
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "statistics":
        return <StatisticsView />;
      case "pastries":
        return (
          <Suspense fallback={<div>Loading pastries...</div>}>
            <PastriesManagement />
          </Suspense>
        );
      case "categories":
        return (
          <Suspense fallback={<div>Loading categories...</div>}>
            <CategoriesManagement />
          </Suspense>
        );
      case "users":
        return (
          <Suspense fallback={<div>Loading users...</div>}>
            <UsersManagement />
          </Suspense>
        );
      case "employees":
        return (
          <Suspense fallback={<div>Loading employees...</div>}>
            <EmployeeManagement />
          </Suspense>
        );
      case "customers":
        return (
          <Suspense fallback={<div>Loading employees...</div>}>
            <CustomerManagement />
          </Suspense>
        );
      case "orders":
        return (
          <Suspense fallback={<div>Loading orders...</div>}>
            <OrdersManagement />
          </Suspense>
        );
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        expandedMenu={expandedMenu}
        setExpandedMenu={setExpandedMenu}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 flex-col">
        <HeaderBar onToggleSidebar={() => setSidebarOpen((s) => !s)} />

        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
