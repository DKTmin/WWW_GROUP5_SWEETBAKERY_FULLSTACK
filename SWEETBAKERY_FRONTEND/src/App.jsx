// src/App.jsx
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/index";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
// 1. Import component liên lạc
import FloatingContact from "./components/common/FloatingContact"; 

function Layout() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  // Nếu là trang admin → KHÔNG hiện Header/Footer và KHÔNG hiện nút liên lạc
  if (isAdminPage) {
    return <AppRoutes />;
  }

  // Các trang user bình thường → có Header + Footer + FloatingContact
  return (
    <div className="flex min-h-screen flex-col bg-amber-50/40">
      <Header />
      
      <div className="flex-1">
        <AppRoutes />
      </div>
      
      <Footer />

      
      <FloatingContact />
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