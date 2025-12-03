import React, { useState } from "react";

export default function PastriesManagement() {
  const [pastries, setPastries] = useState([
    {
      id: 1,
      name: "Bánh Kem Tiramisu",
      category: "Bánh kem",
      price: "150,000đ",
      stock: 12,
      status: "Hoạt động",
    },
    {
      id: 2,
      name: "Bánh Chocolate",
      category: "Bánh ngọt",
      price: "120,000đ",
      stock: 8,
      status: "Hoạt động",
    },
    {
      id: 3,
      name: "Bánh Pháp",
      category: "Bánh kem",
      price: "180,000đ",
      stock: 5,
      status: "Hoạt động",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý bánh</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
        >
          {showForm ? "Hủy" : "+ Thêm bánh"}
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Thêm bánh mới</h3>
          <form className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Tên bánh</label>
              <input
                type="text"
                placeholder="Nhập tên bánh"
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Danh mục</label>
              <select className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none">
                <option>Chọn danh mục</option>
                <option>Bánh kem</option>
                <option>Bánh ngọt</option>
                <option>Bánh mặn</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Giá</label>
              <input
                type="number"
                placeholder="Nhập giá"
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Số lượng tồn</label>
              <input
                type="number"
                placeholder="Nhập số lượng"
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Mô tả</label>
              <textarea
                placeholder="Nhập mô tả bánh"
                rows="3"
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-3 sm:col-span-2">
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
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-600">Tên bánh</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Danh mục</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Giá</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Tồn kho</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Trạng thái</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {pastries.map((p) => (
              <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                <td className="px-4 py-3 text-slate-600">{p.category}</td>
                <td className="px-4 py-3 font-semibold text-amber-600">{p.price}</td>
                <td className="px-4 py-3 text-slate-600">{p.stock}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    {p.status}
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
