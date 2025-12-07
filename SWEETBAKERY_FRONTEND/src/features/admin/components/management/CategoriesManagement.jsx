import React, { useEffect, useState } from "react";
import adminApi from "../../apis/adminApi";

export default function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    isActive: true,
  });

  // ---- LOAD DATA ----
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAdminCategories();
      const data = res?.data?.data || [];
      setCategories(data);
    } catch (error) {
      console.error("Lỗi load categories:", error);
      alert("Không tải được danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ---- FORM HANDLERS ----
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      isActive: true,
    });
    setShowForm(true);
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || "",
      isActive: cat.isActive ?? true, // ĐỌC TỪ isActive
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        isActive: formData.isActive, // GỬI isActive lên backend
      };

      if (editingCategory) {
        await adminApi.updateCategory(editingCategory.id, payload);
      } else {
        await adminApi.createCategory(payload);
      }

      setShowForm(false);
      await fetchCategories();
    } catch (error) {
      console.error("Lỗi lưu category:", error);
      alert("Không lưu được danh mục. Vui lòng kiểm tra lại.");
    }
  };

  // Ẩn category (soft delete)
  const handleToggleStatus = async (cat) => {
    if (!cat.isActive) return; // đang ẩn rồi thì thôi

    if (!window.confirm(`Bạn có chắc muốn Ẩn danh mục "${cat.name}" không?`))
      return;

    try {
      const res = await adminApi.deleteCategory(cat.id);
      const apiRes = res?.data || {};
      const success = apiRes.data === true;

      if (success) {
        // cập nhật UI ngay
        setCategories((prev) =>
          prev.map((c) =>
            c.id === cat.id ? { ...c, isActive: false } : c
          )
        );
        alert(apiRes.message || "Đã ẩn danh mục thành công.");
      } else {
        alert(apiRes.message || "Không thể thực hiện hành động này.");
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      alert("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý danh mục</h2>
        <button
          onClick={handleOpenCreate}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
        >
          + Thêm danh mục
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">
            {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Tên danh mục
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên danh mục"
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isActive"
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-slate-700"
              >
                Đang sử dụng (hiển thị cho khách)
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
              >
                Lưu
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        {loading ? (
          <p className="text-sm text-slate-500">Đang tải danh mục...</p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-slate-500">Chưa có danh mục nào.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600">
                  Tên danh mục
                </th>
                <th className="px-4 py-3 font-semibold text-slate-600">
                  Trạng thái
                </th>
                <th className="px-4 py-3 font-semibold text-slate-600">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {cat.name}
                  </td>
                  <td className="px-4 py-3">
                    {cat.isActive ? (
                      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Đang dùng
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                        Đã ẩn
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 space-x-3">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-amber-600 hover:text-amber-700"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleToggleStatus(cat)}
                      className="text-red-600 hover:text-red-700"
                      disabled={!cat.isActive}
                      style={{
                        opacity: cat.isActive ? 1 : 0.5,
                        cursor: cat.isActive ? "pointer" : "not-allowed",
                      }}
                    >
                      {cat.isActive ? "Ẩn" : "Đã ẩn"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
