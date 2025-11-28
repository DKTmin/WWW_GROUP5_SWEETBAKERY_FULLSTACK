// src/features/home/components/PastryCard.jsx
import { Link } from "react-router-dom";

export default function PastryCard({ pastry }) {
  const image = pastry.imageUrl || pastry.image || "/placeholder.png";
  const name = pastry.name || pastry.title || "Sản phẩm";
  const price = pastry.price != null ? (Number(pastry.price).toLocaleString("vi-VN") + "₫") : "";
  const description = pastry.description || "";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
      {/* Top: image + overlay + tag */}
      <Link to={`/product/${pastry.id}`} className="relative block h-44 w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Semi-transparent tag centered near top */}
        <div className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center justify-center rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold tracking-wide text-amber-800 shadow-sm">
          Sweet Bakery
        </div>

        {/* Overlay "Xem chi tiết" on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 hover:opacity-100">
          <div className="rounded-md bg-black/50 px-3 py-1 text-sm text-white">Xem chi tiết</div>
        </div>
      </Link>

      {/* Bottom: info + actions */}
      <div className="flex flex-1 flex-col justify-between bg-white px-4 pb-4 pt-3">
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold text-stone-900">
            <Link to={`/product/${pastry.id}`} className="hover:underline">
              {name}
            </Link>
          </h3>

          {price && (
            <p className="mt-1 text-sm font-semibold text-amber-800">
              {price}
            </p>
          )}

          {description && (
            <p className="mt-1 line-clamp-2 text-xs text-stone-500">
              {description}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            className="text-xs font-medium text-stone-600 hover:text-amber-800"
            onClick={(e) => {
              e.preventDefault();
              // placeholder: bạn có thể mở modal contact ở đây
              console.log("Liên hệ với nhà bán hàng cho:", pastry.id);
            }}
          >
            Liên hệ
          </button>

          <Link
            to={`/product/${pastry.id}`}
            className="rounded-full bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-1.5 text-xs font-semibold text-amber-50 shadow-sm transition hover:-translate-y-px hover:shadow-md"
          >
            Mua ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
