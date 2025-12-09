import React, { useState, useCallback, lazy, Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import HeaderBar from "../components/HeaderBar";
import DashboardOverview from "../components/DashboardOverview";
import StatisticsView from "../components/StatisticsView";
import SettingsView from "../components/SettingsView";
import EmployeeManagement from "../components/management/EmployeeManagement";
import CustomerManagement from "./../components/management/CustomerManagement";
import authApi from "../../auth/apis/authApi";

// lazy load management pages
const PastriesManagement = lazy(() => import("../components/management/PastriesManagement"));
const CategoriesManagement = lazy(() => import("../components/management/CategoriesManagement"));
const UsersManagement = lazy(() => import("../components/management/UsersManagement"));
const OrdersManagement = lazy(() => import("../components/management/OrdersManagement"));

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState([]);

  // Lấy thông tin user + role từ API
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/admin");
        return;
      }

      try {
        const res = await authApi.getInformation();
        if (res.data?.code === 200 && res.data?.data?.roles) {
          // Extract role names từ roles array
          const roles = res.data.data.roles.map((r) => r.name);
          setUserRoles(roles);
          console.log("User roles:", roles);
        } else {
          navigate("/admin");
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("admin_user");
    window.location.href = "/admin";
  }, []);

  // Kiểm tra xem user có phải ADMIN không
  const isAdmin = userRoles.includes("ADMIN");

  /**
   * Render content dựa trên role
   * - EMPLOYEE: chỉ Dashboard + Orders
   * - ADMIN: tất cả features
   */
  const renderContent = () => {
    // EMPLOYEE: chỉ xem Dashboard + Orders
    if (!isAdmin) {
      switch (activeTab) {
        case "dashboard":
          return <DashboardOverview />;
        case "orders":
          return (
            <Suspense fallback={<div className="text-center py-10">Loading orders...</div>}>
              <OrdersManagement />
            </Suspense>
          );
        default:
          return <DashboardOverview />;
      }
    }

    // ADMIN: xem tất cả features
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;

      case "statistics":
        return <StatisticsView />;

      case "pastries":
        return (
          <Suspense fallback={<div className="text-center py-10">Loading pastries...</div>}>
            <PastriesManagement />
          </Suspense>
        );

      case "categories":
        return (
          <Suspense fallback={<div className="text-center py-10">Loading categories...</div>}>
            <CategoriesManagement />
          </Suspense>
        );

      case "users":
        return (
          <Suspense fallback={<div className="text-center py-10">Loading users...</div>}>
            <UsersManagement />
          </Suspense>
        );

      case "employees":
        return (
          <Suspense fallback={<div className="text-center py-10">Loading employees...</div>}>
            <EmployeeManagement />
          </Suspense>
        );

      case "customers":
        return (
          <Suspense fallback={<div className="text-center py-10">Loading customers...</div>}>
            <CustomerManagement />
          </Suspense>
        );

      case "orders":
        return (
          <Suspense fallback={<div className="text-center py-10">Loading orders...</div>}>
            <OrdersManagement />
          </Suspense>
        );

      case "settings":
        return <SettingsView />;

      default:
        return <DashboardOverview />;
    }
  };

  // Chờ API load xong
  if (loading) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Mobile overlay khi sidebar mở */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        expandedMenu={expandedMenu}
        setExpandedMenu={setExpandedMenu}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
        isAdmin={isAdmin}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <HeaderBar onToggleSidebar={() => setSidebarOpen((s) => !s)} />
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
