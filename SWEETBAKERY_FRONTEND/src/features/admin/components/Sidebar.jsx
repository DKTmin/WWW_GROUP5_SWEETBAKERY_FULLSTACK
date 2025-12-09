import React from "react";
import {
  CakeIcon,
  HomeIcon,
  ChartIcon,
  SettingsIcon,
  CategoryIcon,
  UsersIcon,
  OrderIcon,
  LogoutIcon,
  XIcon,
} from "./icons";

const MENU_ITEMS = [
  { id: "dashboard", label: "Tổng quan", icon: HomeIcon, adminOnly: false },
  { id: "statistics", label: "Thống kê", icon: ChartIcon, adminOnly: true },
  {
    id: "management",
    label: "Quản lý",
    icon: SettingsIcon,
    adminOnly: true,
    children: [
      { id: "pastries", label: "Quản lý bánh", icon: CakeIcon, adminOnly: true },
      { id: "categories", label: "Quản lý danh mục", icon: CategoryIcon, adminOnly: true },
      { id: "users", label: "Quản lý tài khoản", icon: UsersIcon, adminOnly: true },
      { id: "employees", label: "Quản lý nhân viên", icon: UsersIcon, adminOnly: true },
      { id: "customers", label: "Quản lý khách hàng", icon: UsersIcon, adminOnly: true },
      { id: "orders", label: "Quản lý đơn hàng", icon: OrderIcon, adminOnly: false },
    ],
  },
];

export default function Sidebar({
  expandedMenu,
  setExpandedMenu,
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  onLogout,
  isAdmin = false, // Default false cho EMPLOYEE
}) {
  // Lọc menu items dựa trên role
  const getVisibleItems = () => {
    if (isAdmin) {
      return MENU_ITEMS; // ADMIN thấy tất cả
    }

    // EMPLOYEE: chỉ thấy Dashboard + Orders
    return MENU_ITEMS.filter((item) => {
      if (!item.adminOnly) return true;
      // Nếu là management menu, filter children
      if (item.id === "management") {
        return {
          ...item,
          children: item.children.filter((child) => !child.adminOnly),
        };
      }
      return false;
    }).map((item) => {
      if (item.id === "management" && item.children) {
        return {
          ...item,
          children: item.children.filter((child) => !child.adminOnly),
        };
      }
      return item;
    });
  };

  const visibleItems = getVisibleItems();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-slate-900 transition-transform duration-300 lg:relative lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-slate-700 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600">
            <CakeIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white">Sweet Bakery</h1>
            <p className="text-xs text-slate-400">{isAdmin ? "Admin Panel" : "Employee Panel"}</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 lg:hidden"
        >
          <XIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {visibleItems.map((item) => (
          <div key={item.id}>
            {item.children ? (
              <>
                <button
                  onClick={() => setExpandedMenu(expandedMenu === item.id ? "" : item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                    expandedMenu === item.id
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </span>
                  <svg
                    className={`h-4 w-4 transition-transform ${expandedMenu === item.id ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {expandedMenu === item.id && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-slate-700 pl-4">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => {
                          setActiveTab(child.id);
                          setSidebarOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          activeTab === child.id
                            ? "bg-amber-600 text-white"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <child.icon className="h-4 w-4" />
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-amber-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            )}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-700 p-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
        >
          <LogoutIcon className="h-5 w-5" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
