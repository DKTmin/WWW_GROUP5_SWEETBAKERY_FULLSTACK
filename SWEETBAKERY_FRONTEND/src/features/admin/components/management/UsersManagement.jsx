import React, { useEffect, useState } from "react";
import adminApi from "./../../apis/adminApi";

// Định nghĩa style chung cho input để code gọn hơn
const inputStyle =
  "mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-amber-500 focus:outline-none";
const labelStyle = "block text-sm font-medium text-slate-700 mb-1";

export default function UsersManagement() {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);

  // State xác định đang Sửa hay Thêm mới (null = Thêm mới)
  const [editingUser, setEditingUser] = useState(null);

  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    role: "",
    isVerified: true, // Mặc định là true khi thêm mới
    password: "",
    confirmPassword: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // ----- FETCH DATA -----
  const fetchUsers = async () => {
    try {
      const res = await adminApi.getAllUsers();
      const mappedUsers = res.data.data.map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Chưa cập nhật",
        username: u.username,
        email: u.email,
        phone: u.phoneNumber,
        role: u.roles?.[0]?.name || "",
        isVerified: u.isVerified,
        statusText: u.isVerified ? "Đã kích hoạt" : "Vô hiệu hóa",
      }));
      setUsers(mappedUsers);
    } catch (err) {
      console.error("Load users failed:", err);
    }
  };

  // Gọi khi component load lần đầu
  // setUsers chạy trong hàm async → OK
  useEffect(() => {
    const load = async () => {
      await fetchUsers();
    };
    load();
  }, []);

  // ----- HANDLERS -----

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Xử lý riêng cho field isVerified vì value từ select là string "true"/"false"
      [name]: name === "isVerified" ? value === "true" : value,
    }));
  };

  // Mở form Thêm mới
  const handleAddNew = () => {
    setEditingUser(null); // Reset mode về Add
    setFormData({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phoneNumber: "",
      role: "",
      isVerified: true,
      password: "",
      confirmPassword: "", // Reset password fields
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setShowForm(true);
  };

  // Mở form Edit
  const handleEdit = (user) => {
    setEditingUser(user); // Set mode về Edit
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      email: user.email || "",
      phoneNumber: user.phone || "",
      role: user.role,
      isVerified: user.isVerified,
      // Khi edit thì clear các trường password
      password: "",
      confirmPassword: "",
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Anh có chắc chắn muốn xóa người dùng này không?")) return;
    try {
      await adminApi.deleteUser(userId);
      alert("Xóa thành công!");
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Xóa thất bại!");
    }
  };

  // Nút Lưu (Xử lý tùy theo Add hay Edit)
  // ----- XỬ LÝ SUBMIT (TẠO MỚI / CẬP NHẬT) -----
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Chuẩn bị dữ liệu payload chung
    // Lưu ý: Backend cần roles là mảng string ["ROLE_NAME"]
    const commonPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      isVerified: formData.isVerified,
      roles: [formData.role], // Đóng gói role vào mảng
    };

    try {
      // --- TRƯỜNG HỢP 1: TẠO MỚI (CREATE) ---
      if (!editingUser) {
        // Validate mật khẩu
        if (formData.password !== formData.confirmPassword) {
          alert("Mật khẩu xác nhận không khớp!");
          return;
        }

        // Payload cho tạo mới (thêm username, password)
        const createPayload = {
          ...commonPayload,
          username: formData.username,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        };

        // Phân loại API dựa trên Role
        if (formData.role === "EMPLOYEE") {
          await adminApi.createEmployee(createPayload);
        } else if (formData.role === "CUSTOMER") {
          await adminApi.createCustomer(createPayload);
        } else {
          // Trường hợp Admin hoặc chưa chọn role (nếu có logic riêng)
          alert("Chưa hỗ trợ tạo role này qua API hiện tại");
          return;
        }

        alert("Tạo tài khoản thành công!");
      }

      // --- TRƯỜNG HỢP 2: CẬP NHẬT (UPDATE) ---
      else {
        // Payload cho update
        const updatePayload = {
          ...commonPayload,
          // Nếu người dùng nhập mật khẩu mới thì gửi kèm, không thì thôi
          ...(formData.newPassword && {
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmNewPassword,
          }),
        };

        // Validate đổi mật khẩu (nếu có nhập)
        if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
          alert("Mật khẩu mới xác nhận không khớp!");
          return;
        }

        // Gọi API Update dựa trên Role CŨ (editingUser.role) hoặc Role hiện tại (vì đã disable select box nên giống nhau)
        // Lưu ý: Dùng ID của editingUser
        if (formData.role === "EMPLOYEE") {
          await adminApi.updateEmployee(editingUser.id, updatePayload);
        } else if (formData.role === "CUSTOMER") {
          await adminApi.updateCustomer(editingUser.id, updatePayload);
        } else {
          alert("Không thể chỉnh sửa role này");
          return;
        }

        alert("Cập nhật thành công!");
      }

      // Xử lý sau khi thành công
      setShowForm(false); // Đóng form
      fetchUsers(); // Load lại danh sách
    } catch (error) {
      console.error("Submit error:", error);
      // Hiển thị lỗi từ server trả về nếu có
      alert(error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý tài khoản</h2>
        <button
          onClick={() => {
            if (showForm) setShowForm(false);
            else handleAddNew();
          }}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 shadow-sm"
        >
          {showForm ? "Đóng form" : "+ Thêm tài khoản"}
        </button>
      </div>

      {/* ----- FORM AREA ----- */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all">
          <h3 className="mb-6 text-lg font-bold text-slate-800 border-b pb-2">
            {editingUser ? "Cập nhật thông tin" : "Thêm tài khoản mới"}
          </h3>

          <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2">
            {/* Hàng 1: Họ - Tên */}
            <div>
              <label className={labelStyle}>Họ (First Name)</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Nhập họ"
                className={inputStyle}
              />
            </div>
            <div>
              <label className={labelStyle}>Tên (Last Name)</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Nhập tên"
                className={inputStyle}
              />
            </div>

            {/* Hàng 2: Username - Email */}
            <div>
              <label className={labelStyle}>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Nhập username"
                disabled={!!editingUser} // Thường username không cho sửa
                className={`${inputStyle} ${editingUser ? "bg-slate-100 text-slate-500" : ""}`}
              />
            </div>
            <div>
              <label className={labelStyle}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@gmail.com"
                className={inputStyle}
              />
            </div>

            {/* Hàng 3: SĐT - Role */}
            <div>
              <label className={labelStyle}>Số điện thoại</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="0912..."
                className={inputStyle}
              />
            </div>
            <div>
              <label className={labelStyle}>Vai trò</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                disabled={!!editingUser}
                className={inputStyle}
              >
                <option value="">Chọn vai trò</option>
                <option value="CUSTOMER">Khách hàng</option>
                <option value="EMPLOYEE">Nhân viên</option>
                <option value="ADMIN">Quản trị viên</option>
              </select>
            </div>

            {/* Hàng 4: Trạng thái (isVerified) */}
            <div className="sm:col-span-2">
              <label className={labelStyle}>Trạng thái tài khoản</label>
              <select
                name="isVerified"
                value={(formData.isVerified ?? true).toString()} // Convert boolean to string for select
                onChange={handleInputChange}
                className={inputStyle}
              >
                <option value="true">Kích hoạt (Verified)</option>
                <option value="false">Vô hiệu hóa (Unverified)</option>
              </select>
            </div>

            {/* --- PASSWORD LOGIC (ADD VS EDIT) --- */}
            <div className="sm:col-span-2 border-t pt-4 mt-2">
              {!editingUser ? (
                // MODE: ADD NEW (Mật khẩu bắt buộc)
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className={labelStyle}>
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Nhập mật khẩu"
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>
                      Xác nhận mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Nhập lại mật khẩu"
                      className={inputStyle}
                    />
                  </div>
                </div>
              ) : (
                // MODE: EDIT (Đổi mật khẩu - Optional)
                <div className="rounded-xl bg-slate-50 p-5 border border-slate-200">
                  <p className="mb-4 text-sm font-bold text-slate-700 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Đổi mật khẩu (Bỏ trống nếu không đổi)
                  </p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-500">
                        Mật khẩu cũ
                      </label>
                      <input
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleInputChange}
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-500">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-500">
                        Xác nhận MK mới
                      </label>
                      <input
                        type="password"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleInputChange}
                        className={inputStyle}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 sm:col-span-2 pt-2">
              <button
                type="submit"
                className="rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-700 shadow-md transition-colors"
              >
                {editingUser ? "Cập nhật" : "Tạo tài khoản"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE HIỂN THỊ LIST USER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-600">Tên</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Username</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Email</th>
              <th className="px-4 py-3 font-semibold text-slate-600">SĐT</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Vai trò</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Trạng thái</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-slate-800">{user.name}</td>
                <td className="px-4 py-3 text-slate-600 font-medium">{user.username}</td>
                <td className="px-4 py-3 text-slate-600">{user.email}</td>
                <td className="px-4 py-3 text-slate-600">{user.phone}</td>
                <td className="px-4 py-3 text-slate-600">{user.role}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.isVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.statusText}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-3 py-1.5 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition"
                    >
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
