// src/features/home/components/FeaturedCategories.jsx
import { Link } from "react-router-dom";
import cat1 from "../../../assets/categories/cat-birthday.jpg";
import cat2 from "../../../assets/categories/cat-fresh.jpg";
import cat3 from "../../../assets/categories/cat-cookie.jpg";

const items = [
  { id: "cat001", title: "Bánh sinh nhật", image: cat1 },
  { id: "cat002", title: "Bánh tươi", image: cat2 },
  { id: "cat003", title: "Bánh quy", image: cat3 },
];

export default function FeaturedCategories() {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-3">
      {items.map((it) => (
        <div key={it.id} className="relative overflow-hidden rounded-xl shadow-md">
          {/* group để kích hoạt các group-hover:* trên con */}
          <Link to={`/category/${it.id}`} className="group block h-40 md:h-40">
            {/* Image: scale on hover */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={it.image}
                alt={it.title}
                className="h-full w-full object-cover transform transition-transform duration-500 ease-out group-hover:scale-105"
                loading="lazy"
              />
              {/* overlay nhẹ để chữ nổi bật */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
            </div>

            {/* Text panel: ban đầu dịch sang trái và ẩn (opacity 0), on hover trượt vào và hiện */}
            <div className="absolute left-4 bottom-4 z-10 max-w-[80%]">
              <div
                className="transform -translate-x-3 opacity-0 transition-all duration-400 ease-out group-hover:translate-x-0 group-hover:opacity-100"
              >
                <div className="text-white text-lg font-semibold drop-shadow-sm">
                  {it.title}
                </div>

                <div className="mt-3 inline-block">
                  <span className="inline-block rounded bg-white/90 px-3 py-1 text-xs font-semibold text-stone-900 shadow-sm">
                    XEM NGAY
                  </span>
                </div>
              </div>
            </div>

            {/* Accessibility: invisible area to ensure link covers whole card */}
            <span className="sr-only">{`Mở danh mục ${it.title}`}</span>
          </Link>
        </div>
      ))}
    </div>
  );
}
