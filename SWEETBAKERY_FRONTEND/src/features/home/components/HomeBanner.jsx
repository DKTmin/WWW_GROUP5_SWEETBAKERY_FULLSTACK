// src/features/home/components/HomeBanner.jsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import banner1 from "../../../assets/banners/banner-1.jpg";
import banner2 from "../../../assets/banners/banner-2.jpg";
import banner3 from "../../../assets/banners/banner-3.jpg";

// --- ICONS ---
const ChevronLeftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
);
const ChevronRightIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
);

const defaultBanners = [
  { id: "b1", image: banner1, title: "Vanilla Cheese Cake", subtitle: "Giảm 15% tuần này", linkTo: "/product/vanilla-cheese-cake", btnText: "Mua ngay" },
  { id: "b2", image: banner2, title: "Combo Sweet Day", subtitle: "Mua 3 bánh tặng 2 trà", linkTo: "/category/cat002", btnText: "Xem ưu đãi" },
  { id: "b3", image: banner3, title: "Bánh Sinh Nhật", subtitle: "Đặt trước 24 giờ", linkTo: "/category/cat001", btnText: "Đặt bánh ngay" },
];

export default function HomeBanner({ banners = defaultBanners, interval = 6000 }) {
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

  const handlePrev = () => {
    stopAuto();
    setIndex((i) => (i - 1 + banners.length) % banners.length);
    startAuto();
  };

  const handleNext = () => {
    stopAuto();
    setIndex((i) => (i + 1) % banners.length);
    startAuto();
  };

  return (
    <div className="group relative w-full overflow-hidden rounded-2xl shadow-xl h-[400px] md:h-[550px]">
      
      {banners.map((b, i) => {
        const isActive = i === index;
        return (
          <div
            key={b.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
          >
            {/* Hình ảnh + Hiệu ứng Zoom chậm */}
            <div className="relative h-full w-full overflow-hidden">
                <img 
                    src={b.image} 
                    alt={b.title} 
                    className={`h-full w-full object-cover transition-transform duration-[8000ms] ease-out ${isActive ? "scale-110" : "scale-100"}`} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            </div>

            {/* Nội dung chữ */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              
              {/* Subtitle */}
              <div className={`transform transition-all duration-700 delay-300 ${isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                <span className="inline-block rounded-full bg-amber-500/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm backdrop-blur-sm mb-4">
                    {b.subtitle}
                </span>
              </div>

              {/* Title - Đã bỏ font-playfair, dùng font mặc định */}
              <h2 className={`text-4xl md:text-6xl font-bold text-white drop-shadow-md mb-6 transform transition-all duration-700 delay-500 ${isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                {b.title}
              </h2>

              {/* Button CTA */}
              {b.linkTo && (
                <div className={`transform transition-all duration-700 delay-700 ${isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                    <Link 
                        to={b.linkTo} 
                        className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-3 text-sm font-bold uppercase tracking-wider text-amber-900 transition-all hover:bg-amber-50 hover:text-amber-700"
                    >
                        {b.btnText || "Khám phá"}
                        <ChevronRightIcon className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => { stopAuto(); setIndex(i); startAuto(); }}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-amber-500" : "bg-white/50 hover:bg-white"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-amber-600 hover:text-white opacity-0 group-hover:opacity-100 md:block hidden"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-amber-600 hover:text-white opacity-0 group-hover:opacity-100 md:block hidden"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>
    </div>
  );
}