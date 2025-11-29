// src/features/home/pages/CategoryPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import pastryApi from "../apis/pastryApi";
import categoryApi from "../apis/categoryApi";
import PastryCard from "../components/PastryCard";
import SidebarFilters from "../components/SidebarFilters";
import Pagination from "../../../components/common/Pagination";

const PRICE_MAP = {
  under100000: { min: 0, max: 100000 },
  "100000-300000": { min: 100000, max: 300000 },
  "300000-500000": { min: 300000, max: 500000 },
  "500000-1000000": { min: 500000, max: 1000000 },
  over1000000: { min: 1000000, max: Infinity },
};

export default function CategoryPage() {
  const { id: categoryId } = useParams();
  const [searchParams] = useSearchParams();

  const [pastries, setPastries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 8;
  const [sort, setSort] = useState("popular");

  // read price filters from query param (array). use toString to retrigger on param changes
  const priceFilters = useMemo(() => searchParams.getAll("price") || [], [searchParams.toString()]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAll();
        setCategories(res.data?.data || []);
      } catch (e) {
        console.warn("Load categories failed", e);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPastries = async () => {
      try {
        setLoading(true);
        setError("");
        let res;

        // nếu route là /category/all => load tất cả sản phẩm
        if (categoryId === "all") {
          res = await pastryApi.findAllTask();
          setCategoryName("Tất cả sản phẩm");
        }
        // nếu có categoryId khác -> load theo category
        else if (categoryId) {
          res = await pastryApi.findByCategory(categoryId);
          const found = categories.find((c) => c.id === categoryId);
          setCategoryName(found ? found.name : "");
        }
        // fallback (no id) -> load all
        else {
          res = await pastryApi.findAllTask();
          setCategoryName("Tất cả sản phẩm");
        }

        setPastries(res.data?.data || []);
      } catch (e) {
        console.error(e);
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
        setPage(1);
      }
    };

    fetchPastries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, categories]);

  // apply price filters client-side
  const filteredByPrice = useMemo(() => {
    if (!priceFilters || priceFilters.length === 0) return pastries;

    const ranges = priceFilters
      .map((key) => PRICE_MAP[key])
      .filter(Boolean);

    if (ranges.length === 0) return pastries;

    return pastries.filter((p) => {
      let price = p.price;
      if (typeof price === "string") {
        const cleaned = price.replace(/[^\d]/g, "");
        price = cleaned ? Number(cleaned) : NaN;
      }
      price = Number(price || 0);
      if (!price || isNaN(price)) return false;

      return ranges.some((r) => price >= r.min && price <= r.max);
    });
  }, [pastries, priceFilters]);

  // sort after filtering
  const sortedPastries = useMemo(() => {
    const arr = [...filteredByPrice];
    if (sort === "price_asc") return arr.sort((a, b) => (Number(a.price || 0) - Number(b.price || 0)));
    if (sort === "price_desc") return arr.sort((a, b) => (Number(b.price || 0) - Number(a.price || 0)));
    return arr;
  }, [filteredByPrice, sort]);

  const total = sortedPastries.length;
  const start = (page - 1) * perPage;
  const paged = sortedPastries.slice(start, start + perPage);

  return (
    <main className="min-h-screen bg-[#FFF8E9] pb-16 pt-6">
      <div className="mx-auto max-w-6xl px-4">
        <nav className="mb-6 text-sm text-stone-600">
          <Link to="/" className="hover:underline">Trang chủ</Link>
          <span className="px-2">/</span>
          <span>Danh mục</span>
          {categoryName && (
            <>
              <span className="px-2">/</span>
              <span className="font-semibold">{categoryName}</span>
            </>
          )}
        </nav>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <aside className="col-span-1">
            <SidebarFilters categories={categories} activeCategory={categoryId} />
          </aside>

          <section className="col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-stone-900">{categoryName || "Sản phẩm"}</h1>

              <div className="flex items-center gap-4">
                <label className="text-sm text-stone-600">Sắp xếp</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-md border px-3 py-1 text-sm"
                >
                  <option value="popular">Bán chạy nhất</option>
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá: thấp → cao</option>
                  <option value="price_desc">Giá: cao → thấp</option>
                </select>
              </div>
            </div>

            {loading && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: perPage }).map((_, i) => (
                  <div key={i} className="h-64 animate-pulse rounded-xl bg-amber-100" />
                ))}
              </div>
            )}

            {!loading && error && <p className="text-red-600">{error}</p>}

            {!loading && !error && paged.length === 0 && (
              <p className="text-stone-600">Hiện chưa có sản phẩm trong danh mục này.</p>
            )}

            {!loading && !error && paged.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {paged.map((p) => (
                  <PastryCard key={p.id || p.name} pastry={p} />
                ))}
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <Pagination current={page} total={total} perPage={perPage} onChange={(p) => setPage(p)} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
