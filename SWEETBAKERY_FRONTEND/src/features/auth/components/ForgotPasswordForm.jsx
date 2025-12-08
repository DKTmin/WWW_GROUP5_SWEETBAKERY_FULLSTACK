import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../apis/authApi";

const MailIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5A2.25 2.25 0 0 0 2.25 6.75m19.5 0v-1.5a2.25 2.25 0 0 0-2.25-2.25H4.5A2.25 2.25 0 0 0 2.25 6.75m0 0v1.5"
    />
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const SpinnerIcon = ({ className }) => (
  <svg
    className={`${className} animate-spin`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Gọi API gửi yêu cầu đặt lại mật khẩu
      // const res = await authApi.post("/auth/forgot-password", { email });

      // if (res.status === 200 || res.data?.code === 200) {
      //   setSuccess(true);

      //   // Lưu email vào sessionStorage để xác minh OTP
      //   sessionStorage.setItem("reset_password_email", email);
      //   sessionStorage.setItem("reset_password_pending", "true");

      //   // Redirect sang trang OTP verification sau 1.5 giây
      //   setTimeout(() => navigate("/reset-password-otp"), 1500);
      // }
      setTimeout(() => navigate("/reset-password-otp"), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Gửi yêu cầu thất bại. Vui lòng thử lại.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-amber-100 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-50">
          <MailIcon className="h-8 w-8 text-amber-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Quên mật khẩu?</h1>
        <p className="mt-2 text-sm text-slate-600">
          Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">Gửi thành công!</p>
              <p className="text-sm text-green-700">
                Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra email.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="your@email.com"
            disabled={loading || success}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:bg-slate-50"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || success}
          className="w-full rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 py-3 font-semibold text-white shadow-lg shadow-amber-600/30 transition hover:from-amber-700 hover:to-amber-800 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <SpinnerIcon className="h-5 w-5" />
              Đang gửi...
            </div>
          ) : success ? (
            "Đã gửi! Chuyển hướng..."
          ) : (
            "Gửi yêu cầu"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 border-t border-slate-200"></div>
        <span className="text-sm text-slate-500">hoặc</span>
        <div className="flex-1 border-t border-slate-200"></div>
      </div>

      {/* Links */}
      <div className="space-y-2 text-center text-sm">
        <p className="text-slate-600">
          Nhớ mật khẩu?{" "}
          <Link
            to="/login"
            className="font-semibold text-amber-700 hover:text-amber-800 hover:underline"
          >
            Đăng nhập
          </Link>
        </p>
        <p className="text-slate-600">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="font-semibold text-amber-700 hover:text-amber-800 hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
