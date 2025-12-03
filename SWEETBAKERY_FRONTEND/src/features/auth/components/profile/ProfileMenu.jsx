// features/auth/components/profile/ProfileMenu.jsx
import {
  UserCircleIcon,
  HeartIcon,
  PencilSquareIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
} from "../../pages/icon";

export default function ProfileMenu({ activeTab, setActiveTab, onLogout }) {
  const menuItems = [
    { id: "info", label: "Thông tin tài khoản", icon: UserCircleIcon },
    { id: "favorites", label: "Sản phẩm yêu thích", icon: HeartIcon },
    { id: "edit", label: "Chỉnh sửa thông tin", icon: PencilSquareIcon },
  ];

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-medium transition-colors ${
            activeTab === item.id
              ? "bg-amber-50 text-amber-800 border-l-4 border-amber-600"
              : "text-stone-600 hover:bg-stone-50 border-l-4 border-transparent"
          }`}
        >
          <item.icon className="h-5 w-5" />
          <span className="flex-1">{item.label}</span>
          <ChevronRightIcon
            className={`h-4 w-4 transition-transform ${
              activeTab === item.id ? "text-amber-600" : "text-stone-400"
            }`}
          />
        </button>
      ))}

      <button
        onClick={onLogout}
        className="flex w-full items-center gap-3 border-t border-stone-100 px-5 py-4 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
      >
        <ArrowRightOnRectangleIcon className="h-5 w-5" />
        <span>Đăng xuất</span>
      </button>
    </div>
  );
}
