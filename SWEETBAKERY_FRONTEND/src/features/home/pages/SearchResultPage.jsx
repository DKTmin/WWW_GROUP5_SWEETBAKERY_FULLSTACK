// src/features/home/pages/SearchResultPage.jsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import pastryApi from "../apis/pastryApi";
import PastryCard from "../components/PastryCard";
import Pagination from "../../../components/common/Pagination";

const PER_PAGE = 12;

export default function SearchResultPage() {
  const [searchParams] = useSearchParams();
  const keyword = (searchParams.get("keyword") || "").trim();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!keyword) {
      setItems([]);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await pastryApi.search(keyword);
        setItems(res.data?.data || []);
        setPage(1);
      } catch (e) {
        console.error(e);
        setError("Không thể tải kết quả tìm kiếm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    load();
    window.scrollTo(0, 0);
  }, [keyword]);

  const total = items.length;
  const start = (page - 1) * PER_PAGE;
  const paged = items.slice(start, start + PER_PAGE);

  return (
    <main className="min-h-screen bg-[#FFF8E9] pb-16 pt-6">
      <div className="mx-auto max-w-6xl px-4">
        <nav className="mb-6 text-sm text-stone-600">
          <Link to="/" className="hover:underline">
            Trang chủ
          </Link>
          <span className="px-2">/</span>
          <span>Tìm kiếm</span>
        </nav>

        <section className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-stone-900 md:text-3xl">
            Tìm kiếm
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            {keyword
              ? `Có ${total} sản phẩm cho từ khóa "${keyword}".`
              : "Nhập từ khóa vào thanh tìm kiếm để bắt đầu."}
          </p>
        </section>

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: PER_PAGE }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-amber-100" />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="text-center text-red-600">{error}</p>
        )}

        {!loading && !error && keyword && paged.length === 0 && (
          <p className="text-center text-stone-600">
            Không có sản phẩm nào phù hợp với từ khóa của bạn.
          </p>
        )}

        {!loading && !error && paged.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {paged.map((p) => (
                <PastryCard key={p.id || p.name} pastry={p} />
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Pagination
                current={page}
                total={total}
                perPage={PER_PAGE}
                onChange={(p) => setPage(p)}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
