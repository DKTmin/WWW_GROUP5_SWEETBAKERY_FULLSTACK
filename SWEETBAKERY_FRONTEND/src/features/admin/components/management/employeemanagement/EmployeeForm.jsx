import React, { useEffect, useState } from "react";
import adminApi from "../../../apis/adminApi";

export default function EmployeeForm({ editingUser, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);

  // State Form mặc định
  const initialFormState = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    identification: "",
    address: "",
    numOfExperience: 0,
    roles: ["EMPLOYEE"],
    isVerified: true, // <--- 1. Thêm mặc định là true
    // Password fields
    password: "",
    confirmPassword: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  // Khi có editingUser truyền vào (chế độ Sửa), thì điền data vào form
  useEffect(() => {
    if (editingUser) {
      setFormData({
        ...initialFormState,
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        username: editingUser.username,
        email: editingUser.email,
        phoneNumber: editingUser.phone,
        identification: editingUser.identification,
        address: editingUser.address,
        numOfExperience: editingUser.numOfExperience,
        roles: editingUser.roles || ["EMPLOYEE"],
        isVerified: editingUser.isVerified, // <--- 2. Load trạng thái từ user
      });
    }
  }, [editingUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // <--- 3. Xử lý riêng cho isVerified vì value từ select luôn là string
    const newValue = name === "isVerified" ? value === "true" : value;

    setFormData({ ...formData, [name]: newValue });
  };

  const handleRoleChange = (roleName) => {
    const currentRoles = formData.roles;
    if (currentRoles.includes(roleName)) {
      setFormData({ ...formData, roles: currentRoles.filter((r) => r !== roleName) });
    } else {
      setFormData({ ...formData, roles: [...currentRoles, roleName] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const experience = parseInt(formData.numOfExperience) || 0;

      // Common fields
      const commonPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        identification: formData.identification,
        numOfExperience: experience,
        roles: formData.roles,
        isVerified: formData.isVerified, // <--- 4. Gửi status lên server
      };

      // === TRƯỜNG HỢP SỬA ===
      if (editingUser) {
        if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
          alert("Mật khẩu mới không khớp!");
          setLoading(false);
          return;
        }

        const updatePayload = {
          ...commonPayload,
          oldPassword: formData.oldPassword || null,
          newPassword: formData.newPassword || null,
          confirmNewPassword: formData.confirmNewPassword || null,
        };

        const res = await adminApi.updateEmployee(editingUser.id, updatePayload);
        if (res.data?.code === 201 && res.data?.data != null) {
          alert("Cập nhật thành công!");
          onSuccess();
        } else {
          alert("Lỗi: " + res.message);
        }
      }
      // === TRƯỜNG HỢP THÊM MỚI ===
      else {
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

        const res = await adminApi.createEmployee(createPayload);

        if (res && res.data?.code === 201) {
          alert("Thêm mới thành công!");
          onSuccess();
        } else {
          console.log("Response create:", res.data?.message);
          if (res?.data) {
            alert("Thêm mới thành công!");
            onSuccess();
          } else {
            alert("Không nhận được phản hồi thành công.");
          }
        }
      }
    } catch (error) {
      console.error("Submit failed:", error);
      const msg = error.response?.data?.message || "Có lỗi xảy ra!";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-800">
        {editingUser ? "Cập nhật thông tin" : "Thêm nhân viên mới"}
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
        <div className={editingUser ? "opacity-50" : ""}>
          <label className="mb-1 block text-sm font-medium text-slate-700">Username</label>
          <input
            required={!editingUser}
            readOnly={!!editingUser}
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
          <label className="mb-1 block text-sm font-medium text-slate-700">Kinh nghiệm (năm)</label>
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

        {/* --- 5. FIELD TRẠNG THÁI (isVerified) --- */}
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Trạng thái tài khoản
          </label>
          <select
            name="isVerified"
            value={formData.isVerified.toString()} // Convert boolean sang string cho value select
            onChange={handleInputChange}
            className="input-style"
          >
            <option value="true">Kích hoạt (Verified)</option>
            <option value="false">Vô hiệu hóa (Unverified)</option>
          </select>
        </div>

        {/* ROLES */}
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
        {!editingUser ? (
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
              <label className="mb-1 block text-sm font-medium text-slate-700">Xác nhận MK</label>
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
                <label className="mb-1 block text-xs font-medium text-slate-500">Mật khẩu cũ</label>
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
            {loading ? "Đang xử lý..." : editingUser ? "Cập nhật" : "Lưu mới"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Hủy bỏ
          </button>
        </div>
      </form>
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
