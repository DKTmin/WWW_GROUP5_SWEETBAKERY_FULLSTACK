import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import authApi from "../../features/auth/apis/authApi";

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      // Không có token thì đá ra login
      if (!token) {
        setAuthorized(false);
        setChecking(false);
        return;
      }

      try {
        // Gọi API getInformation (nếu access token hết hạn, axios sẽ tự refresh)
        await authApi.getInformation();
        setAuthorized(true);
      } catch (error) {
        // Refresh cũng fail luôn → logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setAuthorized(false);
      }

      setChecking(false);
    };

    checkAuth();
  }, []);

  if (checking) return <div>Loading...</div>;

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
