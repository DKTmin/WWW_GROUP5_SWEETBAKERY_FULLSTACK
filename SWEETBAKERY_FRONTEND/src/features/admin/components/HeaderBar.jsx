import React, { useEffect, useState } from "react";
import { MenuIcon } from "./icons";
import { useNavigate } from "react-router-dom";
import authApi from "../../auth/apis/authApi";

export default function HeaderBar({ onToggleSidebar }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/admin");
        return;
      }

      try {
        const res = await authApi.getInformation();
        if (res.data?.code === 200 && res.data?.data) {
          setUserInfo(res.data.data);
          console.log("User info:", res.data.data);
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

  // Lấy role name (mặc định là ADMIN nếu không có)
  const roleName = userInfo?.roles?.[0]?.name || "ADMIN";
  const roleDescription = userInfo?.roles?.[0]?.description || "Quản trị viên";
  const fullName = userInfo ? `${userInfo.username}` : "User";

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      <button
        onClick={onToggleSidebar}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-4">

        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="text-right">
            <p className="text-xs text-slate-500">{roleName}</p>
            <p className="text-sm font-medium text-slate-800">{fullName}</p>
          </div>
          <img
src={`https://ui-avatars.com/api/?name=${fullName}&background=amber&color=fff`}
            src={`https://ui-avatars.com/api/?name=${fullName}&background=amber&color=fff`}
            alt="Avatar"
            className="h-8 w-8 rounded-full"
          />
        </div>
      </div>
    </header>
  );
}