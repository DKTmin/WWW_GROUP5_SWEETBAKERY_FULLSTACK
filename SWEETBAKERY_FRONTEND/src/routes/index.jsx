import ContactPage from "../features/home/pages/ContactPage";
import { Routes, Route } from "react-router-dom";
import HomePage from "../features/home/pages/HomePage";
import CategoryPage from "../features/home/pages/CategoryPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ProfilePage from "../features/auth/pages/ProfilePage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import ProductPage from "../features/home/pages/ProductPage";
import CartPage from "../features/cart/CartPage";
import OrdersPage from "../features/orders/OrdersPage";
import CheckoutPage from "../features/orders/CheckoutPage";
import OrderDetailPage from "../features/orders/OrderDetailPage";
import AdminLoginPage from "../features/admin/pages/AdminLoginPage";
import AdminOTPPage from "../features/admin/pages/AdminOTPPage";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import SearchResultPage from "../features/home/pages/SearchResultPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordOTPPage from "../features/auth/pages/ResetPasswordOTPPage";
import ResetPasswordNewPage from "../features/auth/pages/ResetPasswordPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Trang home mặc định */}
      <Route path="/" element={<HomePage />} />

      {/* Trang category riêng */}
      <Route path="/category/:id" element={<CategoryPage />} />

      <Route path="/contact" element={<ContactPage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password-otp" element={<ResetPasswordOTPPage />} />
      <Route path="/reset-password-new" element={<ResetPasswordNewPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/product/:id" element={<ProductPage />} />

      <Route path="/search" element={<SearchResultPage />} />

      <Route path="/cart" element={<CartPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/orders/:id" element={<OrderDetailPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />

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
  );
}
