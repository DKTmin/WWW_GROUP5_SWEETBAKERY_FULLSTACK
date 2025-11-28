// src/features/home/components/HomeBanner.jsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import banner1 from "../../../assets/banners/banner-1.jpg";
import banner2 from "../../../assets/banners/banner-2.jpg";
import banner3 from "../../../assets/banners/banner-3.jpg";

const defaultBanners = [
  { id: "b1", image: banner1, title: "Vanilla Cheese Cake", subtitle: "15% OFF", linkTo: "/product/vanilla-cheese-cake" },
  { id: "b2", image: banner2, title: "Combo Sweet Day", subtitle: "Chọn 3 bánh + 2 thức uống", linkTo: "/category/cat002" },
  { id: "b3", image: banner3, title: "Bánh sinh nhật", subtitle: "Đặt trước 24 giờ", linkTo: "/category/cat001" },
];

export default function HomeBanner({ banners = defaultBanners, interval = 5000 }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    startAuto();
    return stopAuto;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function startAuto() {
    stopAuto();
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, interval);
  }

  function stopAuto() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function goTo(i) {
    setIndex(i % banners.length);
  }

  return (
    <div className="w-full relative overflow-hidden rounded-xl">
      <div className="relative h-[320px] md:h-[420px]">
        {banners.map((b, i) => (
          <div
            key={b.id}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
          >
            {b.linkTo ? (
              <Link to={b.linkTo} className="block h-full w-full">
                <img src={b.image} alt={b.title} className="h-full w-full object-cover" />
              </Link>
            ) : (
              <img src={b.image} alt={b.title} className="h-full w-full object-cover" />
            )}

            <div className="absolute left-6 top-10 max-w-lg rounded-md bg-white/80 p-4 shadow-md">
              <div className="text-xs font-semibold text-amber-700">{b.subtitle}</div>
              <div className="mt-2 text-xl font-bold text-stone-900">{b.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute left-1/2 bottom-4 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 w-8 rounded-full ${i === index ? "bg-amber-700" : "bg-white/60"}`}
            aria-label={`banner-${i}`}
          />
        ))}
      </div>

      <button
        onClick={() => { stopAuto(); setIndex((i) => (i - 1 + banners.length) % banners.length); startAuto(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md"
        aria-label="prev"
      >
        ‹
      </button>
      <button
        onClick={() => { stopAuto(); setIndex((i) => (i + 1) % banners.length); startAuto(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md"
        aria-label="next"
      >
        ›
      </button>
    </div>
  );
}
