"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import authApi from "../api/authApi"
import logoImg from "../../../assets/logo/logo.jpg"

// --- ICONS ---
const UserIcon = ({ className }) => (
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
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
)

const LockIcon = ({ className }) => (
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
      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
    />
  </svg>
)

const EyeIcon = ({ className }) => (
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
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.573-3.007-9.963-7.178Z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
)

const EyeSlashIcon = ({ className }) => (
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
      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
    />
  </svg>
)

export default function LoginForm() {
  const [identifier, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await authApi.login({ identifier, password })
      console.log(res.data)
      localStorage.setItem("access_token", res.data.data.accessToken)
      window.location.href = "/pastries"
      setIsLoggedIn(!!res.data.data.accessToken);
    } catch (err) {
      console.error(err)
      setError("Sai username hoặc mật khẩu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Card Container */}
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-amber-900/10">
        {/* Decorative Header */}
        <div className="relative bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 px-8 py-10 text-center">
          {/* Decorative circles */}
          <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-amber-500/20"></div>
          <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-amber-900/20"></div>

          {/* Logo */}
          <div className="relative mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border-4 border-white/30 shadow-lg">
            <img src={logoImg || "/placeholder.svg"} alt="Sweet Bakery Logo" className="h-full w-full object-cover" />
          </div>

          <h2 className="relative text-2xl font-bold text-white">Chào mừng trở lại!</h2>
          <p className="relative mt-1 text-sm text-amber-100/80">Đăng nhập để tiếp tục mua sắm</p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="px-8 py-8">
          {/* Username Field */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-stone-700">Tên đăng nhập</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <UserIcon className="h-5 w-5 text-stone-400" />
              </div>
              <input
                type="text"
                placeholder="Nhập username của bạn"
                className="w-full rounded-xl border border-stone-200 bg-stone-50/50 py-3 pl-12 pr-4 text-sm text-stone-700 placeholder-stone-400 transition-all duration-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                value={identifier}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-stone-700">Mật khẩu</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <LockIcon className="h-5 w-5 text-stone-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                className="w-full rounded-xl border border-stone-200 bg-stone-50/50 py-3 pl-12 pr-12 text-sm text-stone-700 placeholder-stone-400 transition-all duration-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="mb-6 flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-stone-600">
              <input type="checkbox" className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500" />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <Link to="/forgot-password" className="font-medium text-amber-700 hover:text-amber-800 hover:underline">
              Quên mật khẩu?
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              <span className="font-medium">Lỗi:</span> {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 py-3.5 font-bold text-white shadow-lg shadow-amber-600/30 transition-all duration-300 hover:from-amber-700 hover:to-amber-800 hover:shadow-xl hover:shadow-amber-700/30 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span
              className={`flex items-center justify-center gap-2 transition-all ${loading ? "opacity-0" : "opacity-100"}`}
            >
              Đăng nhập
            </span>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              </div>
            )}
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-stone-200"></div>
            <span className="text-xs font-medium text-stone-400">HOẶC</span>
            <div className="h-px flex-1 bg-stone-200"></div>
          </div>

          {/* Social Login */}
          <div className="flex gap-3">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50"
            >
              <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              Facebook
            </button>
          </div>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-stone-600">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="font-bold text-amber-700 hover:text-amber-800 hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </form>
      </div>

      {/* Back to Home Link */}
      <div className="mt-6 text-center">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-amber-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Quay về trang chủ
        </Link>
      </div>
    </div>
  )
}
