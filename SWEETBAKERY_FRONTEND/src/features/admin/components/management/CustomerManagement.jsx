import React, { useEffect, useState, useCallback } from "react";
import adminApi from "./../../apis/adminApi";

export default function CustomerManagement() {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // State xác định chế độ Sửa (có ID) hay Thêm (null)
  const [editingId, setEditingId] = useState(null);

  // --- STATE FORM MẶC ĐỊNH ---
  const initialFormState = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
    loyaltyPoints: 0, // Thay thế kinh nghiệm & role bằng điểm tích lũy
    isVerified: true, // Mặc định kích hoạt
    // Password fields
    password: "",
    confirmPassword: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  // ----- 1. FETCH DATA -----
  const fetchUsers = useCallback(async () => {
    try {
      const res = await adminApi.getAllCustomers();

      if (res && res.data && res.data.data) {
        const mappedUsers = res.data.data.map((u) => ({
          id: u.id,
          fullName: `${u.firstName} ${u.lastName}`,
          email: u.email,
          phone: u.phoneNumber,

          // Xử lý an toàn cho boolean
          isVerified: u.isVerified === null ? true : u.isVerified,

          // Data gốc để fill vào form
          firstName: u.firstName,
          lastName: u.lastName,
          username: u.username,
          address: u.address,
          // Xử lý điểm tích lũy (nếu null thì cho bằng 0)
          loyaltyPoints: u.loyaltyPoints || 0,
        }));
        setUsers(mappedUsers);
      }
    } catch (err) {
      console.error("Load customers failed:", err);
      if (err.response && err.response.status === 401) {
        console.warn("Token hết hạn hoặc không có quyền!");
      }
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ----- HANDLERS FORM -----
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convert string "true"/"false" sang boolean cho isVerified
    const newValue = name === "isVerified" ? value === "true" : value;
    setFormData({ ...formData, [name]: newValue });
  };

  // Click nút Sửa
  const handleEditClick = (user) => {
    setEditingId(user.id);
    setFormData({
      ...initialFormState,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phoneNumber: user.phone,
      address: user.address,
      loyaltyPoints: user.loyaltyPoints,
      isVerified: user.isVerified,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  // ----- 2. SUBMIT -----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Parse điểm sang số nguyên
      const points = parseInt(formData.loyaltyPoints) || 0;
      let res;

      // Payload chung (Dùng cho cả Create và Update)
      const commonPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        loyaltyPoints: points, // Gửi điểm tích lũy
        isVerified: formData.isVerified,
      };

      if (editingId) {
        // === UPDATE ===
        if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
          alert("Mật khẩu mới không khớp!");
          setLoading(false);
          return;
        }

        const updatePayload = {
          ...commonPayload,
          // Update Customer không gửi Username, chỉ gửi pass nếu có đổi
          oldPassword: formData.oldPassword || null,
          newPassword: formData.newPassword || null,
          confirmNewPassword: formData.confirmNewPassword || null,
        };

        res = await adminApi.updateCustomer(editingId, updatePayload);
      } else {
        // === CREATE ===
        if (formData.password !== formData.confirmPassword) {
          alert("Mật khẩu xác nhận không khớp!");
          setLoading(false);
          return;
        }

        const createPayload = {
          ...commonPayload,
          username: formData.username,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        };

        res = await adminApi.createCustomer(createPayload);
      }

      // Check kết quả
      if (res && (res.status === 201 || res.status === 200 || res.data?.code === 200)) {
        alert(editingId ? "Cập nhật thành công!" : "Thêm mới thành công!");
        handleCancel();
        fetchUsers();
      } else {
        alert("Thao tác thành công (Status: " + res?.status + ")");
        handleCancel();
        fetchUsers();
      }
    } catch (error) {
      console.error("API Error Response:", error);
      const msg = error.response?.data?.message || "Có lỗi xảy ra!";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // ----- 3. DELETE -----
  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn có chắc muốn xóa khách hàng này?")) return;
    try {
      await adminApi.deleteUser(userId);
      alert("Xóa thành công!");
      fetchUsers();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Xóa thất bại!");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý khách hàng</h2>
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData(initialFormState);
            }}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
          >
            + Thêm khách hàng
          </button>
        )}
      </div>

      {/* FORM AREA */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">
            {editingId ? "Cập nhật thông tin" : "Thêm khách hàng mới"}
          </h3>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            {/* HỌ TÊN */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Họ</label>
              <input
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="input-style"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Tên</label>
              <input
                required
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="input-style"
              />
            </div>

            {/* USERNAME */}
            <div className={editingId ? "opacity-50" : ""}>
              <label className="mb-1 block text-sm font-medium text-slate-700">Username</label>
              <input
                required={!editingId}
                readOnly={!!editingId}
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="input-style bg-slate-50"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-style"
              />
            </div>

            {/* SĐT & ĐỊA CHỈ */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">SĐT</label>
              <input
                required
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="input-style"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Địa chỉ</label>
              <input
                required
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="input-style"
              />
            </div>

            {/* ĐIỂM TÍCH LŨY (Thay cho Kinh nghiệm & Role) */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Điểm tích lũy (Loyalty Points)
              </label>
              <input
                type="number"
                name="loyaltyPoints"
                value={formData.loyaltyPoints}
                onChange={handleInputChange}
                className="input-style"
                placeholder="0"
              />
            </div>

            {/* TRẠNG THÁI */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Trạng thái tài khoản
              </label>
              <select
                name="isVerified"
                value={formData.isVerified ? "true" : "false"}
                onChange={handleInputChange}
                className="input-style"
              >
                <option value="true">Kích hoạt (Verified)</option>
                <option value="false">Vô hiệu hóa (Unverified)</option>
              </select>
            </div>

            {/* PASSWORD FIELDS */}
            {!editingId ? (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Mật khẩu</label>
                  <input
                    required
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-style"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    required
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="input-style"
                  />
                </div>
              </>
            ) : (
              <div className="sm:col-span-2 rounded-lg bg-slate-50 p-4 border border-slate-200">
                <p className="mb-3 text-sm font-bold text-slate-600">
                  Đổi mật khẩu (Bỏ trống nếu không đổi)
                </p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">
                      Mật khẩu cũ
                    </label>
                    <input
                      type="password"
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleInputChange}
                      className="input-style text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="input-style text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">
                      Xác nhận MK mới
                    </label>
                    <input
                      type="password"
                      name="confirmNewPassword"
                      value={formData.confirmNewPassword}
                      onChange={handleInputChange}
                      className="input-style text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* BUTTONS */}
            <div className="mt-2 flex gap-3 sm:col-span-2">
              <button
                disabled={loading}
                type="submit"
                className="rounded-lg bg-amber-600 px-6 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:bg-slate-400"
              >
                {loading ? "Đang xử lý..." : editingId ? "Cập nhật" : "Lưu mới"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-600">Tên</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Username</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Email</th>
              <th className="px-4 py-3 font-semibold text-slate-600">SĐT</th>
              {/* Thay cột Vai trò bằng Điểm tích lũy */}
              <th className="px-4 py-3 font-semibold text-slate-600">Điểm tích lũy</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Trạng thái</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{user.fullName}</td>
                <td className="px-4 py-3 text-slate-600 font-medium">{user.username}</td>
                <td className="px-4 py-3 text-slate-600">{user.email}</td>
                <td className="px-4 py-3 text-slate-600">{user.phone}</td>

                {/* Hiển thị điểm tích lũy */}
                <td className="px-4 py-3 text-slate-600 font-bold text-amber-600">
                  {user.loyaltyPoints}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${user.isVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {user.isVerified ? "Đã kích hoạt" : "Vô hiệu hóa"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="rounded-lg bg-amber-100 px-3 py-1.5 text-sm text-amber-700 transition hover:bg-amber-200"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="rounded-lg bg-red-100 px-3 py-1.5 text-sm text-red-700 transition hover:bg-red-200"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-slate-500">
                  Chưa có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .input-style {
            width: 100%;
            border-radius: 0.5rem;
            border: 1px solid #cbd5e1;
            padding: 0.5rem 1rem;
            outline: none;
        }
        .input-style:focus {
            border-color: #f59e0b;
        }
      `}</style>
    </div>
  );
}
