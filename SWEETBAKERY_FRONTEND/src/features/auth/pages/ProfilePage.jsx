"use client"

// src/features/auth/pages/ProfilePage.jsx
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import authApi from "../apis/authApi"
import { getFavorites, removeFavorite } from "../../../utils/favoriteUtils";





// --- ICONS ---
const UserCircleIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
)
const ShoppingBagIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12.427c.07.69-.476 1.293-1.17 1.293H5.3c-.694 0-1.24-.603-1.17-1.293l1.263-12.427a2.25 2.25 0 0 1 2.247-2.007h8.72a2.25 2.25 0 0 1 2.247 2.007Z"
    />
  </svg>
)
const HeartIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
    />
  </svg>
)
const PencilSquareIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
    />
  </svg>
)
const ArrowRightOnRectangleIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
    />
  </svg>
)
const EnvelopeIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
    />
  </svg>
)
const PhoneIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
    />
  </svg>
)
const MapPinIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
    />
  </svg>
)
const ChevronRightIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
)

export default function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("info")
  const [favoriteList, setFavoriteList] = useState([]);

  useEffect(() => {
  setFavoriteList(getFavorites());

  // Cập nhật khi có thay đổi
  const update = () => setFavoriteList(getFavorites());
  window.addEventListener("favorites_update", update);

  return () => window.removeEventListener("favorites_update", update);
}, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      navigate("/login")
      return
    }

    const fetchUser = async () => {
      try {
        const res = await authApi.getInformation()
        setUser(res.data?.data || null)
      } catch (err) {
        console.error("Fetch user error:", err)
        // Token invalid -> redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem("access_token")
          navigate("/login")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    // remove cart data on logout
    try {
      localStorage.removeItem("cart")
      window.dispatchEvent(new CustomEvent("cart_update"))
    } catch (e) {
      console.warn("Failed to clear cart on logout", e)
    }
    navigate("/")
    // Force reload to update Header state
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF8E9]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFF8E9] gap-4">
        <p className="text-xl text-stone-600">Không thể tải thông tin người dùng</p>
        <button
          onClick={() => navigate("/login")}
          className="rounded-full bg-amber-700 px-6 py-2 text-white hover:bg-amber-800"
        >
          Đăng nhập lại
        </button>
      </div>
    )
  }

  const menuItems = [
    { id: "info", label: "Thông tin tài khoản", icon: UserCircleIcon },
    { id: "favorites", label: "Sản phẩm yêu thích", icon: HeartIcon },
    { id: "edit", label: "Chỉnh sửa thông tin", icon: PencilSquareIcon },
  ]

  return (
    <main className="min-h-screen bg-[#FFF8E9] pb-16 pt-6">
      <div className="mx-auto max-w-6xl px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-stone-500">
          <Link to="/" className="hover:text-amber-700">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="font-semibold text-stone-800">Tài khoản</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* SIDEBAR */}
          <aside className="lg:col-span-1">
            {/* User Card */}
            <div className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 p-6 text-white shadow-lg">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold uppercase">
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-sm text-amber-100/80">@{user.username}</p>
                </div>
              </div>
            </div>

            {/* Menu */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-medium transition-colors ${activeTab === item.id
                    ? "bg-amber-50 text-amber-800 border-l-4 border-amber-600"
                    : "text-stone-600 hover:bg-stone-50 border-l-4 border-transparent"
                    }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRightIcon
                    className={`h-4 w-4 transition-transform ${activeTab === item.id ? "text-amber-600" : "text-stone-400"}`}
                  />
                </button>
              ))}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 border-t border-stone-100 px-5 py-4 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-3">
            {/* Tab: Thông tin tài khoản */}
            {activeTab === "info" && (
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

                <div className="border-b border-stone-100 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4">
                  <h3 className="text-lg font-bold text-stone-800">Thông tin tài khoản</h3>
                  <p className="text-sm text-stone-500">Thông tin cá nhân của bạn</p>
                </div>

                <div className="p-6">

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Full Name */}
                    <div className="rounded-xl bg-stone-50 p-4">
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-400">
                        Họ và tên
                      </label>
                      <p className="text-base font-medium text-stone-800">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>

                    {/* Username */}
                    <div className="rounded-xl bg-stone-50 p-4">
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-400">
                        Tên đăng nhập
                      </label>
                      <p className="text-base font-medium text-stone-800">@{user.username}</p>
                    </div>

                    {/* Email */}
                    <div className="rounded-xl bg-stone-50 p-4">
                      <label className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
                        <EnvelopeIcon className="h-4 w-4" /> Email
                      </label>
                      <p className="text-base font-medium text-stone-800">{user.email}</p>
                    </div>

                    {/* Phone */}
                    <div className="rounded-xl bg-stone-50 p-4">
                      <label className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
                        <PhoneIcon className="h-4 w-4" /> Số điện thoại
                      </label>
                      <p className="text-base font-medium text-stone-800">{user.phoneNumber || "Chưa cập nhật"}</p>
                    </div>

                    {/* Address */}
                    <div className="rounded-xl bg-stone-50 p-4 md:col-span-2">
                      <label className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
                        <MapPinIcon className="h-4 w-4" /> Địa chỉ
                      </label>
                      <p className="text-base font-medium text-stone-800">{user.address || "Chưa cập nhật"}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setActiveTab("edit")}
                      className="inline-flex items-center gap-2 rounded-full bg-amber-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-amber-800 hover:shadow-lg"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                      Chỉnh sửa thông tin
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Orders tab removed - orders accessible via /orders page */}

            {/* Tab: Yêu thích */}
            {activeTab === "favorites" && (
              <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
                <div className="border-b border-stone-100 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4">
                  <h3 className="text-lg font-bold text-stone-800">Sản phẩm yêu thích</h3>
                </div>

                {favoriteList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <HeartIcon className="mb-4 h-16 w-16 text-stone-300" />
                    <h4 className="text-lg font-semibold text-stone-700">Danh sách trống</h4>
                    <Link to="/category/all" className="mt-4 bg-amber-700 text-white px-5 py-2 rounded-full">
                    Khám phá sản phẩm
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6">
                    {favoriteList.map((p) => (
                      <div key={p.id} className="border rounded-xl p-4 shadow-sm bg-stone-50">
                        <Link to={`/product/${p.id}`}>
                          <img src={p.image} className="w-full h-32 object-cover rounded-lg" />
                        </Link>

                        <h4 className="mt-2 font-semibold">{p.name}</h4>
                        <p className="text-amber-700 font-bold">{p.price} VND</p>

                        <button 
                          onClick={() => {
                          removeFavorite(p.id);
                          setFavoriteList(getFavorites());
                        }}
                        className="mt-3 text-sm text-red-600 hover:underline"
                        >
                          Xóa khỏi yêu thích
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
           )}

            {/* Tab: Chỉnh sửa */}
            {activeTab === "edit" && (
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="border-b border-stone-100 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4">
                  <h3 className="text-lg font-bold text-stone-800">Chỉnh sửa thông tin</h3>
                  <p className="text-sm text-stone-500">Cập nhật thông tin cá nhân của bạn</p>
                </div>
                <div className="p-6">
                  <p className="text-center text-stone-500 py-8">Tính năng đang phát triển...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
