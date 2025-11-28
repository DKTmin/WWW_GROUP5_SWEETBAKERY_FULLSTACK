// src/features/home/components/Header.jsx
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import categoryApi from "../../features/home/api/categoryApi";
import logoImg from "../../assets/logo/logo.jpg";

// --- ICONS (Inline SVG để tối ưu) ---
const SearchIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
);
const UserIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
);
const CartIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 5.407c.49 2.1-.924 4.086-3.083 4.086H6.214c-2.16 0-3.573-1.986-3.083-4.086l1.263-5.407a2.25 2.25 0 0 1 2.192-1.738h9.872c.98 0 1.84.628 2.192 1.738ZM6.75 6a5.25 5.25 0 0 1 10.5 0" /></svg>
);
const PhoneIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z" clipRule="evenodd" /></svg>
);

// --- STYLES ---
const navBase = "relative px-4 py-2 text-sm font-semibold transition-colors duration-200 rounded-full";
const navActive = "text-amber-800 bg-amber-100/50";
const navInactive = "text-stone-600 hover:text-amber-800 hover:bg-white/50";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAll();
        setCategories(res.data?.data || []);
      } catch (e) {
        console.error("Load categories error:", e);
      }
    };
    fetchCategories();
  }, []);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location.pathname === "/";
  const isContact = location.pathname === "/contact";

  return (
    <>
      {/* 1. TOP BAR (Thông tin liên hệ) */}
      <div className="bg-amber-900 text-amber-50">
        <div className="mx-auto flex max-w-7xl justify-between px-6 py-1.5 text-[11px] font-medium tracking-wide">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
                <PhoneIcon className="h-3 w-3" /> Hotline: 0123 456 789
            </span>
            <span className="hidden sm:inline">Email: sweetbakery@example.com</span>
          </div>
          <div className="flex gap-3">
             <Link to="/help" className="hover:underline">Trợ giúp</Link>
             <span>|</span>
             <Link to="/language" className="hover:underline">Tiếng Việt</Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Sticky) */}
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
            isScrolled 
            ? "bg-white/90 backdrop-blur-md shadow-md py-2" 
            : "bg-[#FFF4E0] py-4"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6">
          
          {/* LOGO */}
          <Link to="/" className="group flex items-center gap-3 shrink-0">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-amber-700 shadow-md transition-transform duration-300 group-hover:scale-105">
              <img 
                src={logoImg} 
                alt="Sweet Bakery Logo" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className={`leading-tight transition-all duration-300 ${isScrolled ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
              <div className="text-xl font-extrabold text-amber-900 font-serif">Sweet Bakery</div>
              <div className="text-[10px] tracking-[0.3em] font-bold text-amber-700 uppercase">Premium Taste</div>
            </div>
          </Link>

          {/* NAVIGATION (Center) */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              className={({ isActive }) => `${navBase} ${isActive || isHome ? navActive : navInactive}`}
            >
              Trang chủ
            </NavLink>

            {/* Dropdown Menu */}
            <div
              className="group relative"
              onMouseEnter={() => setOpenDropdown(true)}
              onMouseLeave={() => setOpenDropdown(false)}
            >
              <button
                className={`${navBase} ${openDropdown ? navActive : navInactive} flex items-center gap-1 cursor-pointer`}
              >
                <span>Sản phẩm</span>
                <span className={`text-[10px] transition-transform duration-200 ${openDropdown ? "rotate-180" : ""}`}>▼</span>
              </button>

              {/* Dropdown Content */}
              <div 
                className={`absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2 rounded-xl bg-white p-2 shadow-xl ring-1 ring-black/5 transition-all duration-200 origin-top ${
                    openDropdown ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
                }`}
              >
                {/* Mũi tên nhỏ trỏ lên */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
                
                <div className="max-h-64 overflow-y-auto">
                    {categories.length === 0 ? (
                        <div className="px-4 py-3 text-center text-xs text-stone-400">Đang cập nhật...</div>
                    ) : (
                        categories.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => {
                                navigate(`/category/${c.id}`);
                                setOpenDropdown(false);
                            }}
                            className="w-full rounded-lg px-4 py-2.5 text-left text-sm text-stone-600 transition hover:bg-amber-50 hover:text-amber-800"
                        >
                            {c.name}
                        </button>
                        ))
                    )}
                </div>
              </div>
            </div>

            <NavLink
              to="/contact"
              className={({ isActive }) => `${navBase} ${isActive || isContact ? navActive : navInactive}`}
            >
              Liên hệ
            </NavLink>
          </nav>

          {/* RIGHT ACTIONS (Search, User, Cart) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Bar (Mini) */}
            <div className="hidden lg:flex items-center rounded-full bg-white/60 px-3 py-1.5 ring-1 ring-stone-200 focus-within:ring-amber-500 transition-shadow">
                <SearchIcon className="h-4 w-4 text-stone-400 mr-2" />
                <input 
                    type="text" 
                    placeholder="Tìm bánh..." 
                    className="w-24 bg-transparent text-sm text-stone-700 placeholder-stone-400 focus:outline-none focus:w-40 transition-all duration-300"
                />
            </div>

            {/* User Login */}
            <Link 
                to="/login" 
                className="group relative rounded-full p-2 text-stone-600 hover:bg-amber-100 hover:text-amber-800 transition-colors"
                title="Tài khoản"
            >
                <UserIcon className="h-6 w-6" />
            </Link>

            {/* Cart Button */}
            <button 
                className="group relative rounded-full p-2 text-stone-600 hover:bg-amber-100 hover:text-amber-800 transition-colors"
                title="Giỏ hàng"
            >
                <CartIcon className="h-6 w-6" />
                {/* Badge Count */}
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                    0
                </span>
            </button>
          </div>

        </div>
      </header>
    </>
  );
}