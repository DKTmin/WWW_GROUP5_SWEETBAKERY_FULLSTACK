import React, { useState } from "react";

export default function CategoriesManagement() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Bánh ngọt", description: "Các loại bánh ngọt đặc biệt", status: "Hoạt động" },
    { id: 2, name: "Bánh mặn", description: "Bánh mặn cho các bữa tiệc", status: "Hoạt động" },
    { id: 3, name: "Bánh kem", description: "Bánh kem trang trí đẹp mắt", status: "Hoạt động" },
  ]);

  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý danh mục</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
        >
          {showForm ? "Hủy" : "+ Thêm danh mục"}
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Thêm danh mục mới</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Tên danh mục</label>
              <input
                type="text"
                placeholder="Nhập tên danh mục"
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Mô tả</label>
              <textarea
                placeholder="Nhập mô tả danh mục"
                rows="3"
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none"
              />
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

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-600">ID</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Tên danh mục</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Mô tả</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Trạng thái</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-600">{cat.id}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{cat.name}</td>
                <td className="px-4 py-3 text-slate-600">{cat.description}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    {cat.status}
                  </span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button className="text-amber-600 hover:text-amber-700">Sửa</button>
                  <button className="text-red-600 hover:text-red-700">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
