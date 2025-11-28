// src/features/home/pages/HomePage.jsx
import { Link } from "react-router-dom";
import HomeBanner from "../components/HomeBanner";
import FeaturedCategories from "../components/FeaturedCategories";
import FeaturedProducts from "../components/FeaturedProducts";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFF8E9] pb-16 pt-6">
      <div className="mx-auto max-w-6xl px-4">
        {/* Banner (carousel) */}
        <HomeBanner />

        {/* Featured categories (3 boxes linking to category pages) */}
        <FeaturedCategories />

        {/* Intro section + small highlight card (kept from original) */}
        <section className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between mt-8">
          {/* Left: intro text */}
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              Sweet Bakery
            </p>
            <h1 className="mt-2 text-2xl font-bold text-stone-900 md:text-3xl">
              Ngọt ngào cho mọi khoảnh khắc trong ngày của bạn
            </h1>
            <p className="mt-3 text-sm text-stone-600 md:text-[15px]">
              Bánh tươi mỗi ngày với nguyên liệu chọn lọc, phong cách Pháp hiện
              đại. Đặt bánh sinh nhật, bánh ngọt, bánh mì chỉ với vài thao tác.
            </p>
          </div>

          {/* Right: small highlight card */}
          <div className="mt-2 w-full max-w-xs rounded-3xl bg-linear-to-br from-amber-500 via-amber-600 to-stone-900 p-px shadow-lg md:mt-0">
            <div className="flex h-full w-full flex-col justify-between rounded-3xl bg-[#FFF8E9] p-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                  Special of the day
                </p>
                <p className="mt-1 text-sm font-semibold text-stone-900">
                  Combo trà chiều Sweet Day
                </p>
                <p className="mt-1 text-xs text-stone-600">
                  Chọn 3 bánh ngọt + 2 thức uống, ưu đãi dành riêng cho hôm nay.
                </p>
              </div>
              <button className="mt-3 self-start rounded-full bg-amber-700 px-4 py-1.5 text-xs font-semibold text-amber-50 shadow-sm transition hover:-translate-y-px hover:shadow-md">
                Đặt ngay
              </button>
            </div>
          </div>
        </section>

        {/* Featured products section */}
        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-stone-900 md:text-xl">
              Sản phẩm nổi bật
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Những chiếc bánh được khách hàng yêu thích nhất.
            </p>
          </div>

          <FeaturedProducts size={8} />

          {/* Xem thêm -> dẫn tới trang hiển thị tất cả sản phẩm */}
          <div className="mt-6 text-center">
            <Link
              to="/category/all"
              className="inline-block rounded-full bg-amber-700 px-5 py-2 text-sm font-semibold text-amber-50 shadow hover:bg-amber-800"
            >
              Xem thêm →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
