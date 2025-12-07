import React, { useEffect, useState, useCallback } from "react";
import adminApi from "./../../apis/adminApi";

export default function EmployeeManagement() {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // State để biết đang ở chế độ Sửa (có ID) hay Thêm (null)
  const [editingId, setEditingId] = useState(null);

  // --- STATE FORM ĐẦY ĐỦ ---
  const initialFormState = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    identification: "",
    address: "",
    numOfExperience: 0,
    roles: ["EMPLOYEE"], // Mặc định chọn Employee
    // Password fields
    password: "",
    confirmPassword: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  // ----- 1. LẤY DANH SÁCH USER (Dùng useCallback để tránh render vô hạn) -----
  const fetchUsers = useCallback(async () => {
    try {
      const res = await adminApi.getAllEmployees();

      // Kiểm tra data trả về có hợp lệ không
      if (res && res.data && res.data.data) {
        const mappedUsers = res.data.data.map((u) => ({
          id: u.id,
          fullName: `${u.firstName} ${u.lastName}`,
          email: u.email,
          phone: u.phoneNumber,
          roleName: u.roles?.[0]?.name || "N/A",
          status: "Hoạt động",
          // Data gốc để fill vào form sửa
          firstName: u.firstName,
          lastName: u.lastName,
          username: u.username,
          identification: u.identification,
          address: u.address,
          numOfExperience: u.numOfExperience,
          roles: u.roles ? u.roles.map((r) => r.name) : [],
        }));
        setUsers(mappedUsers);
      }
    } catch (err) {
      console.error("Load users failed:", err);
      // Nếu load danh sách mà bị 401 thì cũng báo lỗi luôn
      if (err.response && err.response.status === 401) {
        console.warn("Token hết hạn hoặc không có quyền!");
      }
    }
  }, []);

  // Gọi hàm trong useEffect
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ----- HANDLERS FORM -----
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (roleName) => {
    const currentRoles = formData.roles;
    if (currentRoles.includes(roleName)) {
      setFormData({ ...formData, roles: currentRoles.filter((r) => r !== roleName) });
    } else {
      setFormData({ ...formData, roles: [...currentRoles, roleName] });
    }
  };

  const handleEditClick = (user) => {
    setEditingId(user.id);
    setFormData({
      ...initialFormState,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phoneNumber: user.phone,
      identification: user.identification,
      address: user.address,
      numOfExperience: user.numOfExperience,
      roles: user.roles,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  // ----- 5. SUBMIT (QUAN TRỌNG: XỬ LÝ LỖI 401 TẠI ĐÂY) -----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate chung
      const experience = parseInt(formData.numOfExperience) || 0;
      let res; // Biến hứng kết quả trả về

      if (editingId) {
        // === LOGIC SỬA (UPDATE) ===
        if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
          alert("Mật khẩu mới không khớp!");
          setLoading(false);
          return;
        }

        const updatePayload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          identification: formData.identification,
          numOfExperience: experience,
          roles: formData.roles,
          oldPassword: formData.oldPassword || null,
          newPassword: formData.newPassword || null,
          confirmNewPassword: formData.confirmNewPassword || null,
        };

        res = await adminApi.updateEmployee(editingId, updatePayload);
      } else {
        // === LOGIC THÊM MỚI (CREATE) ===
        if (formData.password !== formData.confirmPassword) {
          alert("Mật khẩu xác nhận không khớp!");
          setLoading(false);
          return;
        }

        const createPayload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          identification: formData.identification,
          numOfExperience: experience,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          roles: formData.roles,
        };

        console.log("Đang gửi payload:", createPayload); // Debug: Xem dữ liệu gửi đi
        res = await adminApi.createEmployee(createPayload);
      }

      console.log("API Success Response:", res); // Debug: Xem kết quả thành công

      // Kiểm tra status code (201 cho create, 200 cho update)
      if (res && (res.status === 201 || res.status === 200)) {
        alert(editingId ? "Cập nhật thành công!" : "Thêm mới thành công!");
        handleCancel();
        fetchUsers();
      } else {
        // Trường hợp API trả về 200 nhưng message lỗi (nếu có logic đó)
        alert("Thao tác thành công (Status: " + res?.status + ")");
        handleCancel();
        fetchUsers();
      }
    } catch (error) {
      console.error("API Error Response:", error); // Debug: Xem lỗi chi tiết

      const status = error.response?.status;
      const data = error.response?.data;

      // --- XỬ LÝ LỖI CỤ THỂ ---
      if (status === 401) {
        alert(
          `Lỗi 401: Phiên đăng nhập hết hạn hoặc Token không hợp lệ.\nChi tiết: ${data?.message || "Unauthenticated"}`
        );
        // Bạn có thể thêm lệnh chuyển hướng về trang login ở đây:
        // window.location.href = '/admin';
      } else if (status === 403) {
        alert("Lỗi 403: Bạn không có quyền thực hiện hành động này!");
      } else if (status === 400 || status === 422) {
        // Lỗi validation từ backend
        const msg = data?.message || "Dữ liệu không hợp lệ!";
        alert(`Lỗi nhập liệu: ${msg}`);
      } else {
        const msg = data?.message || "Có lỗi không xác định xảy ra!";
        alert(`Thất bại: ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // ----- 6. XÓA -----
  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    try {
      await adminApi.deleteUser(userId);
      alert("Xóa thành công!");
      fetchUsers();
    } catch (error) {
      console.error("Delete error:", error);
      if (error.response?.status === 401) {
        alert("Lỗi 401: Hết phiên đăng nhập. Vui lòng login lại.");
      } else {
        alert("Xóa thất bại!");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý nhân viên</h2>
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData(initialFormState);
            }}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
          >
            + Thêm nhân viên
          </button>
        )}
      </div>

      {/* FORM */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">
            {editingId ? "Cập nhật thông tin" : "Thêm nhân viên mới"}
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

            {/* SĐT & CCCD */}
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
              <label className="mb-1 block text-sm font-medium text-slate-700">CCCD</label>
              <input
                required
                name="identification"
                value={formData.identification}
                onChange={handleInputChange}
                className="input-style"
              />
            </div>

            {/* KINH NGHIỆM & ĐỊA CHỈ */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Kinh nghiệm (năm)
              </label>
              <input
                required
                type="number"
                name="numOfExperience"
                value={formData.numOfExperience}
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

            {/* ROLES CHECKBOX */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Vai trò</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.roles.includes("EMPLOYEE")}
                    onChange={() => handleRoleChange("EMPLOYEE")}
                  />
                  <span>Nhân viên (EMPLOYEE)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.roles.includes("ADMIN")}
                    onChange={() => handleRoleChange("ADMIN")}
                  />
                  <span>Quản trị viên (ADMIN)</span>
                </label>
              </div>
            </div>

            {/* PASSWORD FIELDS */}
            {!editingId && (
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
            )}

            {editingId && (
              <div className="sm:col-span-2 rounded-lg bg-slate-50 p-4 border border-slate-200">
                <p className="mb-3 text-sm font-bold text-slate-600">
                  Đổi mật khẩu (Bỏ trống nếu không đổi)
                </p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">
                      Mật khẩu cũ (Nếu có)
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

            {/* ACTION BUTTONS */}
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
              <th className="px-4 py-3 font-semibold text-slate-600">Email</th>
              <th className="px-4 py-3 font-semibold text-slate-600">SĐT</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Vai trò</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{user.fullName}</td>
                <td className="px-4 py-3 text-slate-600">{user.email}</td>
                <td className="px-4 py-3 text-slate-600">{user.phone}</td>
                <td className="px-4 py-3 text-slate-600">{user.roleName}</td>
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
