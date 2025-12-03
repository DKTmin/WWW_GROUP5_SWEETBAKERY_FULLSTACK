// src/components/common/FloatingContact.jsx
import { useEffect, useState } from "react";

// --- ICONS (SVG) ---
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.96 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
  </svg>
);

const MessengerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clipRule="evenodd" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 10.75 7.5-7.5 7.5 7.5" className="opacity-50" /> 
  </svg>
);

export default function FloatingContact() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Xử lý hiện nút Scroll Top khi cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Class chung cho các nút tròn
  const btnClass = "flex h-12 w-12 items-center justify-center rounded-full bg-[#0A1E3F] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl cursor-pointer border-2 border-white/10";

  return (
    <div className="fixed bottom-10 right-4 z-50 flex flex-col items-center gap-4">
      
      {/* 1. Nút Gọi Điện */}
      <a 
        href="tel:0123456789" 
        className={btnClass}
        title="Gọi ngay"
      >
        <div className="animate-tada"> 
          <PhoneIcon />
        </div>
      </a>
      {/* 2. Nút Zalo */}
      <a 
        href="https://zalo.me/0123456789" 
        target="_blank" 
        rel="noreferrer"
        className={`${btnClass} text-[13px] font-bold tracking-wide font-sans`}
        title="Chat Zalo"
      >
        Zalo
      </a>

      {/* 3. Nút Messenger */}
      <a 
        href="https://m.me/ducluvice#" 
        target="_blank" 
        rel="noreferrer"
        className={btnClass}
        title="Chat Messenger"
      >
        <MessengerIcon />
      </a>

      {/* 4. Nút Scroll To Top (Chỉ hiện khi cuộn xuống) */}
      <button
        onClick={scrollToTop}
        className={`mt-2 flex flex-col items-center justify-center text-stone-500 transition-all duration-300 hover:-translate-y-1 hover:text-amber-800 ${
          showScrollTop ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-4"
        }`}
      >
        <div className="flex flex-col items-center -space-y-3">
             {/* Tạo hình mũi tên kép */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m18 15-6-6-6 6"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 opacity-60"><path d="m18 15-6-6-6 6"/></svg>
        </div>
      </button>

    </div>
  );
}