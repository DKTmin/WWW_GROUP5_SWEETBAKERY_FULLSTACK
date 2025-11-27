import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import pastryApi from "../api/pastryApi";
import PastryCard from "../components/PastryCard";

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const [pastries, setPastries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categoryFilter = searchParams.get("category"); // cat001, cat002,...

  useEffect(() => {
    const fetchPastries = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await pastryApi.findAllTask();
        // backend chuẩn: { code, message, data: [...] }
        setPastries(res.data?.data || []);
      } catch (e) {
        console.error(e);
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchPastries();
  }, []);

  const filteredPastries = useMemo(() => {
    if (!categoryFilter) return pastries;

    return pastries.filter((p) => {
      // hỗ trợ cả 2 kiểu: p.categoryId hoặc p.category?.id
      if (p.categoryId) return p.categoryId === categoryFilter;
      if (p.category?.id) return p.category.id === categoryFilter;
      return false;
    });
  }, [pastries, categoryFilter]);

  const currentCategoryName = useMemo(() => {
    if (!categoryFilter) return "";
    const found = pastries.find(
      (p) =>
        p.categoryId === categoryFilter ||
        p.category?.id === categoryFilter
    );
    return found?.categoryName || found?.category?.name || "";
  }, [pastries, categoryFilter]);

  return (
    <main className="min-h-screen bg-[#FFF8E9] pb-16 pt-6">
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
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

      {/* Products */}
      <section className="mx-auto mt-10 max-w-6xl px-4">
        <div className="mb-4 flex items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-stone-900 md:text-xl">
              Sản phẩm của Sweet Bakery
            </h2>
            {currentCategoryName && (
              <p className="mt-1 text-sm text-amber-700">
                Danh mục:{" "}
                <span className="font-semibold">{currentCategoryName}</span>
              </p>
            )}
          </div>
          {/* Nếu sau này cần filter/sort thêm thì để ở đây */}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="h-56 animate-pulse rounded-3xl bg-linear-to-b from-amber-200/70 to-amber-100/60"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}

        {/* Empty state */}
        {!loading && !error && filteredPastries.length === 0 && (
          <p className="mt-4 text-sm text-stone-600">
            Hiện chưa có sản phẩm trong danh mục này.
          </p>
        )}

        {/* Grid products */}
        {!loading && !error && filteredPastries.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredPastries.map((pastry) => (
              <PastryCard key={pastry.id || pastry.name} pastry={pastry} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
