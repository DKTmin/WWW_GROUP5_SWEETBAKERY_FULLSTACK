import React, { useEffect, useState } from "react";
import adminApi from "./../../apis/adminApi";

export default function EmployeeManagement() {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);

  // ----- TÁCH fetchUsers RA NGOÀI -----
  const fetchUsers = async () => {
    try {
      const res = await adminApi.getAllEmployees();

      const mappedUsers = res.data.data.map((u) => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        phone: u.phoneNumber,
        role: u.roles?.[0]?.name || "Không rõ",
        status: "Hoạt động",
      }));

      setUsers(mappedUsers);
    } catch (err) {
      console.error("Load users failed:", err);
    }
  };

  // Gọi khi component load lần đầu
  useEffect(() => {
    const load = async () => {
      await fetchUsers(); // setUsers chạy trong hàm async → OK
    };
    load();
  }, []);

  // ----- XOÁ USER -----
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Anh có chắc chắn muốn xóa người dùng này không?");
    if (!confirmDelete) return;

    try {
      await adminApi.deleteUser(userId);
      alert("Xóa thành công!");

      // Load lại danh sách
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Xóa thất bại!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý tài khoản</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
        >
          {showForm ? "Hủy" : "+ Thêm tài khoản"}
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Thêm tài khoản mới</h3>
          <form className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Họ tên</label>
              <input
                type="text"
                placeholder="Nhập họ tên"
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                placeholder="Nhập email"
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Số điện thoại</label>
              <input
                type="tel"
                placeholder="Nhập số điện thoại"
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Vai trò</label>
              <select className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none">
                <option>Chọn vai trò</option>
                <option>Khách hàng</option>
                <option>Quản trị viên</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Mật khẩu</label>
              <input
                type="password"
                placeholder="Nhập mật khẩu"
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
              <th className="px-4 py-3 font-semibold text-slate-600">Tên</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Email</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Số điện thoại</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Vai trò</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Trạng thái</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{user.name}</td>
                <td className="px-4 py-3 text-slate-600">{user.email}</td>
                <td className="px-4 py-3 text-slate-600">{user.phone}</td>
                <td className="px-4 py-3 text-slate-600">{user.role}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button className="px-3 py-1.5 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition">
                      Sửa
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
