// src/features/home/components/SidebarFilters.jsx
import { Link, useSearchParams } from "react-router-dom";
import { useMemo } from "react";

const PRICE_OPTIONS = [
  { id: "under100000", label: "Dưới 100,000đ", min: 0, max: 100000 },
  { id: "100000-300000", label: "100,000đ - 300,000đ", min: 100000, max: 300000 },
  { id: "300000-500000", label: "300,000đ - 500,000đ", min: 300000, max: 500000 },
  { id: "500000-1000000", label: "500,000đ - 1,000,000đ", min: 500000, max: 1000000 },
  { id: "over1000000", label: "Trên 1,000,000đ", min: 1000000, max: Number.POSITIVE_INFINITY },
];

export default function SidebarFilters({ categories = [], activeCategory }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // read selected price filters from query params (price param can appear multiple times)
  // use stringified params as dependency to ensure updates when params change
  const selectedPrices = useMemo(() => {
    return searchParams.getAll("price");
  }, [searchParams.toString()]);

  function togglePrice(optionId) {
    const current = searchParams.getAll("price");
    const next = new Set(current);
    if (next.has(optionId)) next.delete(optionId);
    else next.add(optionId);

    // update query string but keep other params (like page, sort, etc.)
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("price");
    for (const p of next) newParams.append("price", p);

    // reset page when filters change
    newParams.delete("page");

    setSearchParams(newParams, { replace: false });
  }

  // treat activeCategory === 'all' or undefined as "Tất cả sản phẩm"
  const isAllActive = !activeCategory || activeCategory === "all";

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-stone-700">Danh mục</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <Link to="/category/all" className={`block py-2 ${isAllActive ? 'font-semibold text-amber-700' : 'text-stone-700'}`}>Tất cả sản phẩm</Link>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                to={`/category/${c.id}`}
                className={`block py-2 ${activeCategory === c.id ? 'font-semibold text-amber-700' : 'text-stone-700'}`}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Price filter */}
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-stone-700">Giá sản phẩm</h3>
        <div className="space-y-2 text-sm text-stone-600">
          {PRICE_OPTIONS.map((opt) => {
            const checked = selectedPrices.includes(opt.id);
            return (
              <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="price"
                  checked={checked}
                  onChange={() => togglePrice(opt.id)}
                  className="h-4 w-4"
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
