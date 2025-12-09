import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../apis/authApi";

const ShieldCheckIcon = ({ className }) => (
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
      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
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

const OTP_LENGTH = 6;
const OTP_TTL_SECONDS = 300; // 5 phút
const RESEND_TTL_SECONDS = 30;

export default function ResetPasswordOTPForm() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(OTP_TTL_SECONDS);
  const inputRefs = useRef([]);
  const email = sessionStorage.getItem("reset_password_email");

  // Kiểm tra email pending
  //   useEffect(() => {
  //     if (!email || !sessionStorage.getItem("reset_password_pending")) {
  //       navigate("/forgot-password");
  //     }
  //   }, [navigate, email]);

  // Đếm ngược thời gian
  useEffect(() => {
    if (countdown <= 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== OTP_LENGTH) {
      setError("Vui lòng nhập đủ 6 chữ số OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Xác minh OTP
      const res = await authApi.verifyOTpToResetPassword({
        otp: enteredOtp,
        email,
      });

      if (
        res.data?.code === 200 &&
        res.status === 200 &&
        res.data?.data.valid &&
        res.data?.data.resetPasswordToken != null
      ) {
        // Lưu token hoặc flag để xác nhận OTP đã valid
        sessionStorage.setItem("otp_verified", "true");
        sessionStorage.setItem("otp_verification_token", res.data?.data.resetPasswordToken || "");

        // Chuyển sang trang nhập mật khẩu mới
        navigate("/reset-password-new");
      } else {
        throw new Error(res.data?.message || "Xác minh thất bại");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Mã OTP không đúng hoặc hết hạn.";
      setError(msg);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
    // navigate("/reset-password-new");
  };

  const handleResend = async () => {
    const key = "reset_password_otp_sent_at";
    const last = Number(sessionStorage.getItem(key) || "0");

    if (Date.now() - last < RESEND_TTL_SECONDS * 1000) {
      const waitTime = Math.ceil((RESEND_TTL_SECONDS * 1000 - (Date.now() - last)) / 1000);
      setError(`Vui lòng đợi ${waitTime}s trước khi gửi lại.`);
      return;
    }

    try {
      const res = await authApi.post("/auth/forgot-password", { email });
      if (res.status === 200 || res.data?.code === 200) {
        sessionStorage.setItem(key, String(Date.now()));
        setCountdown(OTP_TTL_SECONDS);
        setError("");
        alert("✅ Gửi lại mã OTP thành công!");
      }
    } catch (err) {
      setError("Gửi lại mã thất bại. Vui lòng thử lại sau.");
    }
  };

  const handleCancel = () => {
    sessionStorage.removeItem("reset_password_email");
    sessionStorage.removeItem("reset_password_pending");
    navigate("/login");
  };

  return (
    <div className="w-full max-w-2xl rounded-3xl border border-amber-100 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-2xl shadow-green-500/40">
          <ShieldCheckIcon className="h-11 w-11 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Xác minh OTP</h1>
        <p className="mt-3 text-base text-slate-600">
          Mã OTP đã được gửi đến <span className="font-semibold text-amber-700">{email}</span>
        </p>
      </div>

      {/* Thời gian đếm ngược */}
      <div className="mb-8 text-center">
        <p className="text-sm text-slate-500 mb-2">Mã OTP hết hạn trong</p>
        <div
          className={`inline-block px-6 py-2 rounded-xl font-bold text-2xl transition ${
            countdown <= 60
              ? "text-red-400 bg-red-500/10 border border-red-500/40"
              : "text-amber-400 bg-amber-500/10 border border-amber-500/40"
          }`}
        >
          {formatTime(countdown)}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Input */}
        <div>
          <label className="mb-3 block text-sm font-medium text-slate-700">Mã OTP (6 chữ số)</label>
          <div className="flex justify-center items-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={loading}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-slate-300 bg-white text-center text-xl sm:text-2xl font-bold text-slate-800 transition focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-200 disabled:opacity-50"
              />
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-pulse">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          <button
            type="button"
            onClick={handleResend}
            disabled={loading || countdown === 0}
            className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 transition"
          >
            Gửi lại mã
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Hủy
          </button>

          <button
            type="submit"
            disabled={loading || countdown === 0}
            className="rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 py-3 font-semibold text-white shadow-lg shadow-amber-600/30 transition hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <SpinnerIcon className="h-5 w-5" />
                Đang xác minh...
              </>
            ) : (
              "Xác minh"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
