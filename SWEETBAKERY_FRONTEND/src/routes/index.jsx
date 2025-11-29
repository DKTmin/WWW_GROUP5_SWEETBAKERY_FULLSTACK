import { Routes, Route } from "react-router-dom"
import HomePage from "../features/home/pages/HomePage"
import CategoryPage from "../features/home/pages/CategoryPage"
import LoginPage from "../features/auth/pages/LoginPage"
import RegisterPage from "../features/auth/pages/RegisterPage"
import ProfilePage from "../features/auth/pages/ProfilePage"
import ProtectedRoute from "../components/common/ProtectedRoute"
import ProductPage from "../features/home/pages/ProductPage"
import AdminLoginPage from "../features/admin/pages/AdminLoginPage"
import AdminOTPPage from "../features/admin/pages/AdminOTPPage"
import AdminDashboard from "../features/admin/pages/AdminDashboard"

export default function AppRoutes() {
  return (
    <Routes>
      {/* Trang home mặc định */}
      <Route path="/" element={<HomePage />} />

      {/* Trang category riêng */}
      <Route path="/category/:id" element={<CategoryPage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route path="/product/:id" element={<ProductPage />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Ví dụ route cần login */}
      <Route
        path="/pastries"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route path="/admin" element={<AdminLoginPage />} />
      <Route path="/admin/verify-otp" element={<AdminOTPPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  )
}
