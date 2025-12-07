// src/features/home/components/PastryCard.jsx
import { Link } from "react-router-dom";
import cartApi from "../../cart/apis/cartApi"

// Icon Giỏ hàng (Inline SVG)
const ShoppingCartIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

// Icon Eye (Xem chi tiết - Optional)
const EyeIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// ❤️ Icon yêu thích
const HeartIcon = ({ className, filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "red" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default function PastryCard({ pastry }) {
  // Xử lý dữ liệu an toàn
  const image = pastry.imageUrl || pastry.image || "/placeholder.png";
  const name = pastry.name || pastry.title || "Sản phẩm";
  const price = pastry.price != null
    ? (Number(pastry.price).toLocaleString("vi-VN") + "₫")
    : "Liên hệ";
  const description = pastry.description || "";

   // -----------------------------
  // ❤️ Thêm sản phẩm yêu thích
  // -----------------------------
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  const isFavorite = favorites.some((item) => item.id === pastry.id);

  const toggleFavorite = (e) => {
    e.preventDefault(); // tránh việc click bị chuyển trang

    let updated = [];

    if (isFavorite) {
      // Nếu đang yêu thích → Xóa khỏi danh sách
      updated = favorites.filter((item) => item.id !== pastry.id);
    } else {
      // Nếu chưa yêu thích → Thêm vào danh sách
      updated = [
        ...favorites,
        {
          id: pastry.id,
          name,
          image,
          price: pastry.price,
        },
      ];
    }

    localStorage.setItem("favorites", JSON.stringify(updated));
    window.dispatchEvent(new Event("favorites_update")); // để cập nhật icon realtime

    // Refresh component
    window.location.reload();
  };

  // Hàm xử lý khi bấm thêm vào giỏ
  const handleAddToCart = (e) => {
    e.preventDefault(); // Ngăn việc chuyển trang của thẻ Link bao ngoài (nếu có)
    try {
      const cartJson = localStorage.getItem("cart") || "[]"
      const cart = JSON.parse(cartJson)
      const item = {
        id: pastry.id,
        name: pastry.name || pastry.title,
        price: Number(pastry.price || 0),
        qty: 1,
        size: "",
        image: pastry.imageUrl || pastry.image || "/placeholder.png",
      }
      const idx = cart.findIndex((c) => c.id === item.id)
      if (idx >= 0) cart[idx].qty = Number(cart[idx].qty) + 1
      else cart.push(item)
      localStorage.setItem("cart", JSON.stringify(cart))
      window.dispatchEvent(new CustomEvent("cart_update"))
      // If user is logged in (has token), attempt to sync to backend
      try {
        const token = localStorage.getItem("access_token")
        if (token) {
          cartApi.sync(cart).catch((e) => console.warn("cart sync failed", e))
        }
      } catch (e) {
        console.warn("cart sync error", e)
      }
      try { window.dispatchEvent(new CustomEvent('cart_item_added')) } catch (e) { }
    } catch (err) {
      console.error("Add to cart failed", err)
    }
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white border border-stone-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-900/10">

      {/* --- PHẦN HÌNH ẢNH --- */}
      <Link to={`/product/${pastry.id}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-110"
        />

        {/* Tag nổi bật (Optional) */}
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-amber-800 shadow-sm backdrop-blur-sm">
          Sweet Patries
        </div>

        {/* Overlay nút xem chi tiết khi hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex items-center gap-1 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-stone-800 shadow-lg backdrop-blur-sm">
            <EyeIcon className="h-3 w-3" /> Xem nhanh
          </div>
        </div>
      </Link>

      {/* --- PHẦN THÔNG TIN --- */}
      <div className="flex flex-1 flex-col p-4">
        {/* Tên & Mô tả */}
        <div className="mb-3 flex-1">
          <Link to={`/product/${pastry.id}`}>
            <h3 className="line-clamp-1 text-base font-bold text-stone-800 transition-colors hover:text-amber-700">
              {name}
            </h3>
          </Link>
          {description && (
            <p className="mt-1 line-clamp-2 text-xs text-stone-500 font-medium">
              {description}
            </p>
          )}
        </div>

         {/* ❤️ ICON YÊU THÍCH */}
        <button
          onClick={toggleFavorite}
          className="absolute right-3 top-3 p-2 rounded-full bg-white/80 backdrop-blur shadow hover:scale-110 transition"
        >
          <HeartIcon className="h-5 w-5 text-red-600" filled={isFavorite} />
        </button>

        {/* Giá & Nút hành động */}
        <div className="flex items-center justify-between border-t border-stone-100 pt-3 mt-auto">
          {/* Giá tiền nổi bật */}
          <div className="flex flex-col">
            <span className="text-xs text-stone-400 font-medium">Giá bán</span>
            <span className="text-lg font-bold text-amber-700">{price}</span>
          </div>

          {/* Nút Giỏ hàng  */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="group/btn relative flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-600 transition-all hover:bg-amber-600 hover:text-white hover:shadow-md hover:scale-105 active:scale-95"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingCartIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}