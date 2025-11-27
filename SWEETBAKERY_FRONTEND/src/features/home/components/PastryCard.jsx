// src/features/home/components/PastryCard.jsx

export default function PastryCard({ pastry }) {
  const { name, price, description, imageUrl } = pastry || {};

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
      {/* Top: ảnh hoặc gradient */}
      <div className="relative h-44 w-full overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-amber-400 via-amber-500 to-stone-900" />
        )}

        {/* Tag Sweet Bakery */}
        <div className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center justify-center rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold tracking-wide text-amber-800 shadow-sm">
          Sweet Bakery
        </div>
      </div>

      {/* Bottom: info + actions */}
      <div className="flex flex-1 flex-col justify-between bg-white px-4 pb-4 pt-3">
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold text-stone-900">
            {name || "Sweet Bakery Pastry"}
          </h3>
          {price != null && (
            <p className="mt-1 text-sm font-semibold text-amber-800">
              {price.toLocaleString("vi-VN")}₫
            </p>
          )}
          {description && (
            <p className="mt-1 line-clamp-2 text-xs text-stone-500">
              {description}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <button className="text-xs font-medium text-stone-600 hover:text-amber-800">
            Liên hệ
          </button>
          <button className="rounded-full bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-1.5 text-xs font-semibold text-amber-50 shadow-sm transition hover:-translate-y-px hover:shadow-md">
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
}
