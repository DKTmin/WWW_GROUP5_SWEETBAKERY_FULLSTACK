import { Routes, Route } from "react-router-dom";
import HomePage from "../features/home/pages/HomePage";
import CategoryPage from "../features/home/pages/CategoryPage";
import LoginPage from "../features/auth/pages/LoginPage";
import ProtectedRoute from "../components/common/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Trang home mặc định */}
      <Route path="/" element={<HomePage />} />

      {/* Trang category riêng */}
      <Route path="/category/:id" element={<CategoryPage />} />

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
