import { useState } from "react";
import authApi from "../../apis/authApi";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function ProfileEditTab({ user, onSuccess }) {
  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    address: user.address || "",
  });

  const [changePassword, setChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // State để bật/tắt hiện mật khẩu
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordInput = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber.trim() || null,
      address: form.address.trim() || null,
      oldPassword: changePassword ? passwords.oldPassword : null,
      newPassword: changePassword ? passwords.newPassword : null,
      confirmNewPassword: changePassword ? passwords.confirmNewPassword : null,
    };

    try {
      await authApi.updateCustomerInformation(payload, user.id);
      setMessage("Cập nhật thông tin thành công!");
      setChangePassword(false);
      setPasswords({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
      setShowPasswords({ old: false, new: false, confirm: false });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setMessage("Cập nhật thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="border-b border-stone-100 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4">
        <h3 className="text-lg font-bold text-stone-800">Chỉnh sửa thông tin</h3>
        <p className="text-sm text-stone-500">Cập nhật thông tin cá nhân của bạn</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-7">
        {/* Họ & Tên */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2 text-sm font-semibold text-stone-700">Họ</label>
            <input
              type="text"
              name="firstName"
              className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-sm text-stone-800 placeholder-stone-400 transition-all focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              value={form.firstName}
              onChange={handleInput}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-stone-700">Tên</label>
            <input
              type="text"
              name="lastName"
              className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-sm text-stone-800 placeholder-stone-400 transition-all focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              value={form.lastName}
              onChange={handleInput}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-stone-700">Email</label>
          <input
            type="email"
            name="email"
            className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-sm text-stone-800 placeholder-stone-400 transition-all focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            value={form.email}
            onChange={handleInput}
            required
          />
        </div>

        {/* Số điện thoại */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-stone-700">Số điện thoại</label>
          <input
            type="text"
            name="phoneNumber"
            className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-sm text-stone-800 placeholder-stone-400 transition-all focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            value={form.phoneNumber}
            onChange={handleInput}
          />
        </div>

        {/* Địa chỉ */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-stone-700">Địa chỉ</label>
          <input
            type="text"
            name="address"
            className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-sm text-stone-800 placeholder-stone-400 transition-all focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            value={form.address}
            onChange={handleInput}
          />
        </div>

        {/* Checkbox đổi mật khẩu */}
        <div className="flex items-center gap-3 pt-4">
          <input
            type="checkbox"
            id="changePassword"
            checked={changePassword}
            onChange={() => setChangePassword(!changePassword)}
            className="h-5 w-5 rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
          />
          <label
            htmlFor="changePassword"
            className="text-stone-700 font-medium cursor-pointer select-none"
          >
            Thay đổi mật khẩu
          </label>
        </div>

        {/* Phần đổi mật khẩu - chỉ hiện khi tick */}
        {changePassword && (
          <div className="space-y-5 rounded-2xl border border-stone-200 bg-stone-50/70 p-6">
            {/* Mật khẩu cũ */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">
                Mật khẩu hiện tại
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type={showPasswords.old ? "text" : "password"}
                  name="oldPassword"
                  className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-12 pr-12 text-sm text-stone-800 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  value={passwords.oldPassword}
                  onChange={handlePasswordInput}
                  placeholder="Nhập mật khẩu cũ"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("old")}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-stone-400 hover:text-stone-600 transition"
                >
                  {showPasswords.old ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Mật khẩu mới */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">
                Mật khẩu mới
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-12 pr-12 text-sm text-stone-800 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  value={passwords.newPassword}
                  onChange={handlePasswordInput}
                  placeholder="Nhập mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-stone-400 hover:text-stone-600 transition"
                >
                  {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmNewPassword"
                  className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-12 pr-12 text-sm text-stone-800 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  value={passwords.confirmNewPassword}
                  onChange={handlePasswordInput}
                  placeholder="Nhập lại mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-stone-400 hover:text-stone-600 transition"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Nút lưu */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-amber-600 px-8 py-3.5 text-white font-semibold shadow-md hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? "Đang lưu thay đổi..." : "Lưu thay đổi"}
          </button>
        </div>

        {/* Thông báo */}
        {message && (
          <div className="text-center">
            <p
              className={`inline-block rounded-lg px-6 py-3 text-sm font-semibold ${
                message.includes("thành công")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
