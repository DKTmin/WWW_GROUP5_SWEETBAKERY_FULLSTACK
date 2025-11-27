// routes/index.jsx hoặc AppRoutes.jsx

import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import HomePage from "../features/home/pages/HomePage";
import LoginPage from "../features/auth/pages/LoginPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Trang home cho mọi người xem (không cần login) */}
      <Route path="/" element={<HomePage />} />

      {/* Login không bọc ProtectedRoute */}
      <Route path="/login" element={<LoginPage />} />

      {/* Ví dụ route cần login */}
      <Route
        path="/pastries"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
