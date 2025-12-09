import React, { useEffect, useState } from "react";
import adminApi from "../../apis/adminApi";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Filter,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const ITEMS_PER_PAGE = 8;

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Nháp", color: "bg-gray-100 text-gray-700 border-gray-200" },
  { value: "ACTIVE", label: "Đang bán", color: "bg-green-50 text-green-700 border-green-200" },
  { value: "OUT_OF_STOCK", label: "Hết hàng", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { value: "DISCONTINUED", label: "Ngừng KD", color: "bg-red-50 text-red-700 border-red-200" },
];

export default function PastriesManagement() {
  const [pastries, setPastries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc",
  });

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    stockQuantity: "",
    status: "DRAFT",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resCat, resPas] = await Promise.all([
        adminApi.getAdminCategories(),
        adminApi.getAdminPastries(),
      ]);
      setCategories(resCat.data.data || []);
      setPastries(resPas.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      categoryId: "",
      price: "",
      stockQuantity: "",
      status: "DRAFT",
      description: "",
      imageUrl: "",
    });
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name || "",
        categoryId: product.categoryId || "",
        price: product.price ?? 0,
        stockQuantity: product.stockQuantity ?? 0,
        status: product.status || "DRAFT",
        description: product.description || "",
        imageUrl: product.imageUrl || "",
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stockQuantity: Number(formData.stockQuantity),
      };

      if (editingId) await adminApi.updatePastry(editingId, payload);
      else await adminApi.createPastry(payload);

      await loadData();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Lưu thất bại!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xác nhận xóa bánh này?")) return;
    try {
      await adminApi.deletePastry(id);
      await loadData();
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  const getCategoryName = (p) =>
    p.categoryName || categories.find((c) => c.id === p.categoryId)?.name || "";

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={14} className="text-slate-400" />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp size={14} className="text-amber-500" />
    ) : (
      <ChevronDown size={14} className="text-amber-500" />
    );
  };

  const getSortedData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      let aVal, bVal;

      switch (sortConfig.key) {
        case "category":
          aVal = getCategoryName(a);
          bVal = getCategoryName(b);
          break;
        case "price":
          aVal = a.price ?? 0;
          bVal = b.price ?? 0;
          break;
        case "stock":
          aVal = a.stockQuantity ?? 0;
          bVal = b.stockQuantity ?? 0;
          break;
        case "status":
          aVal = a.status || "";
          bVal = b.status || "";
          break;
        default:
          return 0;
      }

      if (typeof aVal === "string") {
        const comp = aVal.localeCompare(bVal, "vi", { sensitivity: "base" });
        return sortConfig.direction === "asc" ? comp : -comp;
      }

      return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
    });
  };

  const filteredData = pastries.filter((p) => {
    const matchName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCategory ? p.categoryId === filterCategory : true;
    return matchName && matchCat;
  });

  const sortedData = getSortedData(filteredData);

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE) || 1;
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = sortedData.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  useEffect(() => setCurrentPage(1), [searchTerm, filterCategory, sortConfig]);

  const formatVND = (v) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6 font-sans text-slate-800">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý Bánh ngọt</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} /> Thêm bánh mới
        </button>
      </div>

      {/* FILTER */}
<div className="bg-white p-4 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4">

  {/* Input tìm kiếm */}
  <div className="md:col-span-5 relative">
    <Search
      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      size={18}
    />
    <input
      type="text"
      placeholder="Tìm theo tên bánh..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 focus:bg-white focus:ring-2 focus:ring-amber-400 outline-none transition-all"
    />
  </div>

  {/* Dropdown danh mục */}
  <div className="md:col-span-3 relative">
    <Filter
      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      size={18}
    />
    <select
      value={filterCategory}
      onChange={(e) => setFilterCategory(e.target.value)}
      className="w-full pl-10 pr-8 py-2 rounded-lg bg-slate-100 focus:bg-white focus:ring-2 focus:ring-amber-400 outline-none appearance-none transition-all"
    >
      <option value="">Tất cả danh mục</option>
      {categories.map((c) => (
        <option key={c.id} value={c.id}>{c.name}</option>
      ))}
    </select>
  </div>

</div>


      {/* --- TABLE --- */}
<div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full text-left text-sm table-fixed">
      <thead className="bg-slate-50 border-b border-slate-200">
        <tr>
          <th className="px-6 py-4 font-semibold text-slate-600 w-[36%]">Sản phẩm</th>

          <th
            className="px-6 py-4 font-semibold text-slate-600 cursor-pointer select-none w-[20%]"
            onClick={() => handleSort("category")}
          >
            <div className="flex items-center gap-1">
              Danh mục
              {renderSortIcon("category")}
            </div>
          </th>

          <th
            className="px-6 py-4 font-semibold text-slate-600 cursor-pointer select-none w-[14%]"
            onClick={() => handleSort("price")}
          >
            <div className="flex items-center gap-1">
              Giá bán
              {renderSortIcon("price")}
            </div>
          </th>

          <th
            className="px-6 py-4 font-semibold text-slate-600 text-center cursor-pointer select-none w-[10%]"
            onClick={() => handleSort("stock")}
          >
            <div className="flex items-center justify-center gap-1">
              Tồn kho
              {renderSortIcon("stock")}
            </div>
          </th>

          <th
            className="px-6 py-4 font-semibold text-slate-600 cursor-pointer select-none w-[12%]"
            onClick={() => handleSort("status")}
          >
            <div className="flex items-center gap-1">
              Trạng thái
              {renderSortIcon("status")}
            </div>
          </th>

          <th className="px-6 py-4 font-semibold text-slate-600 text-right w-[8%]">
            Thao tác
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {loading ? (
          <tr>
            <td colSpan={6} className="text-center py-12 text-slate-500">
              Đang tải dữ liệu...
            </td>
          </tr>
        ) : currentData.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center py-12 text-slate-500">
              Không tìm thấy sản phẩm nào.
            </td>
          </tr>
        ) : (
          currentData.map((p) => {
            const statusInfo =
              STATUS_OPTIONS.find((s) => s.value === p.status) || STATUS_OPTIONS[0];

            return (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 w-[36%]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 line-clamp-1">{p.name}</div>
                      <div className="text-xs text-slate-500 line-clamp-1 max-w-[150px]">
                        {p.description}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-slate-600 w-[20%]">
                  {getCategoryName(p) || "---"}
                </td>

                <td className="px-6 py-4 text-amber-600 font-semibold w-[14%]">
                  {formatVND(p.price)}
                </td>

                <td className="px-6 py-4 text-center w-[10%]">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
                    {p.stockQuantity}
                  </span>
                </td>

                <td className="px-6 py-4 w-[12%]">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </td>

                <td className="px-6 py-4 text-right w-[8%]">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenModal(p)}
                      className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
</div>


      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)}></div>

          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">
                {editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="font-medium">Tên bánh</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="font-medium">Danh mục</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="">-- Chọn --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium">Giá</label>
                <input
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="font-medium">Tồn kho</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={(e) =>
                    setFormData({ ...formData, stockQuantity: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="font-medium">Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="font-medium">Ảnh</label>
                <input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="col-span-2">
                <label className="font-medium">Mô tả</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="col-span-2 flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Hủy
                </button>
                <button className="px-4 py-2 bg-amber-600 text-white rounded">
                  {editingId ? "Lưu thay đổi" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
