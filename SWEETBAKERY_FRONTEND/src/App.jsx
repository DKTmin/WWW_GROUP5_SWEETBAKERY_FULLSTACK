// src/App.jsx
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/index";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import FloatingContact from "./components/common/FloatingContact";
// 1. Import thêm Chatbox AI
import AiChatBox from "./components/common/AiChatBox";

function Layout() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  // Nếu là trang admin → KHÔNG hiện Header/Footer và các công cụ hỗ trợ
  if (isAdminPage) {
    return <AppRoutes />;
  }

  // Các trang user bình thường
  return (
    <div className="flex min-h-screen flex-col bg-amber-50/40">
      <Header />
      
      <div className="flex-1">
        <AppRoutes />
      </div>
      
      <Footer />

      {/* Các thành phần nổi (Floating) */}
      <FloatingContact /> {/* Nút gọi, Zalo... */}
      <AiChatBox />       {/* Chatbox AI mới thêm */}
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