"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../apis/authApi";
import ProfileUserCard from "./../components/profile/ProfileUserCard";
import ProfileMenu from "./../components/profile/ProfileMenu";
import ProfileInfoTab from "./../components/profile/ProfileInfoTab";
import ProfileFavoritesTab from "./../components/profile/ProfileFavoritesTab";
import ProfileEditTab from "./../components/profile/ProfileEditTab";

// Import các component đã tách

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await authApi.getInformation();
        setUser(res.data?.data || null);
      } catch (err) {
        console.error("Fetch user error:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");

    try {
      localStorage.removeItem("cart");
      window.dispatchEvent(new CustomEvent("cart_update"));
    } catch (e) {
      console.warn("Failed to clear cart on logout", e);
    }

    navigate("/");
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF8E9]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-600 border-t-transparent"></div>
      </div>
    );
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
    );
  }

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
            <ProfileUserCard user={user} />

            <ProfileMenu
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onLogout={handleLogout}
            />
          </aside>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-3">
            {activeTab === "info" && (
              <ProfileInfoTab user={user} onEdit={() => setActiveTab("edit")} />
            )}
            {activeTab === "favorites" && <ProfileFavoritesTab />}
            {activeTab === "edit" && <ProfileEditTab user={user} />}
          </div>
        </div>
      </div>
    </main>
  );
}
