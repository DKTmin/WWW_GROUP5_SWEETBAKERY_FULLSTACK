import React, { useEffect, useState } from "react";
import adminApi from "../../apis/adminApi";

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Nháp" },
  { value: "ACTIVE", label: "Đang bán" },
  { value: "OUT_OF_STOCK", label: "Hết hàng / Tạm ngưng" },
  { value: "DISCONTINUED", label: "Ngừng kinh doanh" },
];

export default function PastriesManagement() {
  const [pastries, setPastries] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    stockQuantity: "",
    status: "DRAFT",
    description: "",
    imageUrl: "",
  });

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

  const formatCurrency = (value) => {
    if (value == null) return "";
    try {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(value);
    } catch {
      return value;
    }
  };

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await adminApi.getAdminCategories();
      // backend đang trả ApiResponse => data ở res.data.data
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Load categories error:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadPastries = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getAdminPastries();
      setPastries(res.data.data || []);
    } catch (err) {
      console.error("Load pastries error:", err);
      setError("Không tải được danh sách bánh");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadPastries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError(null);

      const payload = {
        name: formData.name,
        price: formData.price ? Number(formData.price) : 0,
        description: formData.description,
        imageUrl: formData.imageUrl,
        categoryId: formData.categoryId || null,
        stockQuantity: formData.stockQuantity
          ? Number(formData.stockQuantity)
          : 0,
        status: formData.status,
      };

      if (editingId) {
        // UPDATE
        await adminApi.updatePastry(editingId, payload);
      } else {
        // CREATE
        await adminApi.createPastry(payload);
      }

      await loadPastries();
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Save pastry error:", err);
      setError("Lưu bánh thất bại");
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      name: p.name || "",
      categoryId: p.categoryId || "",
      price: p.price ?? "",
      stockQuantity: p.stockQuantity ?? "",
      status: p.status || "DRAFT",
      description: p.description || "",
      imageUrl: p.imageUrl || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bánh này?")) return;

    try {
      await adminApi.deletePastry(id);
      setPastries((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete pastry error:", err);
      alert("Xóa thất bại, thử lại sau.");
    }
  };

  const renderStatusBadge = (status) => {
    if (!status) return null;

    let colorClass =
      "bg-slate-100 text-slate-700"; // default (DRAFT hoặc chưa set)
    let text = status;

    switch (status) {
      case "ACTIVE":
        colorClass = "bg-green-100 text-green-700";
        text = "Đang bán";
        break;
      case "OUT_OF_STOCK":
        colorClass = "bg-amber-100 text-amber-700";
        text = "Hết hàng";
        break;
      case "DISCONTINUED":
        colorClass = "bg-red-100 text-red-700";
        text = "Ngừng KD";
        break;
      case "DRAFT":
        colorClass = "bg-slate-100 text-slate-700";
        text = "Nháp";
        break;
      default:
        break;
    }

    return (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${colorClass}`}
      >
        {text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý bánh</h2>
        <button
          onClick={() => {
            if (!showForm) {
              resetForm();
              setEditingId(null);
            }
            setShowForm((prev) => !prev);
          }}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
        >
          {showForm ? "Hủy" : "+ Thêm bánh"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form create / edit */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">
            {editingId ? "Chỉnh sửa bánh" : "Thêm bánh mới"}
          </h3>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Tên bánh
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên bánh"
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Danh mục
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none"
              >
                <option value="">Chọn danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {loadingCategories && (
                <p className="mt-1 text-xs text-slate-400">
                  Đang tải danh mục...
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Giá (VND)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Nhập giá"
                min="0"
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Số lượng tồn
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                placeholder="Nhập số lượng"
                min="0"
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">
                Ảnh (URL)
              </label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="Dán link ảnh Cloudinary..."
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả bánh"
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-3 sm:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
              >
                {editingId ? "Cập nhật" : "Lưu"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
          <span>
            Tổng cộng: <b>{pastries.length}</b> bánh
          </span>
          {loading && <span>Đang tải...</span>}
        </div>

        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-600">
                Tên bánh
              </th>
              <th className="px-4 py-3 font-semibold text-slate-600">
                Danh mục
              </th>
              <th className="px-4 py-3 font-semibold text-slate-600">Giá</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Tồn kho</th>
              <th className="px-4 py-3 font-semibold text-slate-600">
                Trạng thái
              </th>
              <th className="px-4 py-3 font-semibold text-slate-600">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {pastries.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  Chưa có bánh nào.
                </td>
              </tr>
            )}

            {pastries.map((p) => (
              <tr
                key={p.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-medium text-slate-800">
                  {p.name}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {p.categoryName || "-"}
                </td>
                <td className="px-4 py-3 font-semibold text-amber-600">
                  {formatCurrency(p.price)}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {p.stockQuantity ?? 0}
                </td>
                <td className="px-4 py-3">{renderStatusBadge(p.status)}</td>
                <td className="px-4 py-3 space-x-3">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-amber-600 hover:text-amber-700"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
