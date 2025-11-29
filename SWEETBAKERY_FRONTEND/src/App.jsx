// src/App.jsx – PHIÊN BẢN HOÀN HẢO NHẤT (đã loại admin ra khỏi Header/Footer)
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/index";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

function Layout() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  // Nếu là trang admin → KHÔNG hiện Header/Footer
  if (isAdminPage) {
    return <AppRoutes />;
  }

  // Các trang user bình thường → có Header + Footer
  return (
    <div className="flex min-h-screen flex-col bg-amber-50/40">
      <Header />
      <div className="flex-1">
        <AppRoutes />
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}