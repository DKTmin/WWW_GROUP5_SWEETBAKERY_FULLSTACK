import LoginPage from "../features/auth/pages/LoginPage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import { Route, Routes } from "react-router-dom";
import HomePage from "../features/home/pages/HomePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
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
