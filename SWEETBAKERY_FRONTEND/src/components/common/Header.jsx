import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import categoryApi from "../../features/home/api/categoryApi";

const navBase = "relative px-5 py-2 text-sm font-medium transition-colors";
const navActive = "text-amber-800";
const navInactive = "text-stone-700 hover:text-amber-800";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);

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

  const isHome = location.pathname === "/";
  const isContact = location.pathname === "/contact";

  return (
    <header className="w-full bg-[#FFF4E0]">
      {/* Hotline */}
      <div className="mx-auto flex max-w-6xl justify-between px-4 py-1 text-[11px] text-stone-600">
        <span>Hotline: 0123 456 789</span>
        <span>Email: sweetbakery@example.com</span>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-amber-500 to-amber-800 text-xs font-bold text-amber-50 shadow-md">
            SB
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-stone-900">Sweet Bakery</div>
            <div className="text-[10px] tracking-[0.25em] text-amber-700">
              BAKERY
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-1 items-center justify-center gap-2">
          {/* Trang chủ */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${navBase} ${isActive || isHome ? navActive : navInactive}`
            }
          >
            <span>Trang chủ</span>
            {isHome && (
              <span className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-amber-700" />
            )}
          </NavLink>

          {/* Bánh mì & Bánh ngọt */}
          <div
            className="group relative"
            onMouseEnter={() => setOpenDropdown(true)}
            onMouseLeave={() => setOpenDropdown(false)}
          >
            <button
              type="button"
              className={`${navBase} ${openDropdown ? navActive : navInactive} flex items-center gap-1`}
            >
              <span>Bánh mì &amp; Bánh ngọt</span>
              <span className="text-[10px]">{openDropdown ? "▲" : "▼"}</span>

              {openDropdown && (
                <span className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-amber-700" />
              )}
            </button>

            {/* Dropdown categories */}
            <div className={`absolute left-1/2 z-40 w-64 -translate-x-1/2 rounded-2xl bg-white py-1 shadow-[0_18px_40px_rgba(0,0,0,0.15)] transition-all duration-200 ${
              openDropdown 
                ? "pointer-events-auto visible top-full mt-0 opacity-100" 
                : "pointer-events-none invisible top-full mt-2 opacity-0"
            }`}>
              {categories.length === 0 && (
                <div className="px-4 py-3 text-xs text-stone-500">
                  Chưa có danh mục nào.
                </div>
              )}

              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    navigate(`/category/${c.id}`);
                    setOpenDropdown(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-stone-700 transition hover:bg-amber-50"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Liên hệ */}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `${navBase} ${isActive || isContact ? navActive : navInactive}`
            }
          >
            <span>Liên hệ</span>
            {isContact && (
              <span className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-amber-700" />
            )}
          </NavLink>
        </nav>

        {/* Buttons right side */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-full border border-amber-700 px-4 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-700 hover:text-amber-50"
          >
            Đăng nhập
          </Link>

          <button className="flex items-center gap-2 rounded-full bg-linear-to-r from-amber-600 to-amber-800 px-4 py-1.5 text-xs font-semibold text-amber-50 shadow-md">
            <span>Giỏ hàng</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-50 text-[10px] font-bold text-amber-800">
              0
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
