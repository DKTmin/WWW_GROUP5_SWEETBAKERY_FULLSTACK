"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// --- ICONS ---
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
)
const SpinnerIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
)

const OTP_LENGTH = 3
const CORRECT_OTP = "555"

export default function AdminOTPPage() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""))
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const inputRefs = useRef([])

  // Check if admin_pending exists
  useEffect(() => {
    const adminPending = localStorage.getItem("admin_pending")
    if (!adminPending) {
      navigate("/admin")
    }
  }, [navigate])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return // Only digits

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Only last digit
    setOtp(newOtp)
    setError("")

    // Auto focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, OTP_LENGTH)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)
    inputRefs.current[Math.min(pastedData.length, OTP_LENGTH - 1)]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const enteredOtp = otp.join("")

    if (enteredOtp.length !== OTP_LENGTH) {
      setError("Vui lòng nhập đầy đủ mã OTP.")
      return
    }

    setLoading(true)
    setError("")

    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (enteredOtp === CORRECT_OTP) {
      // Move admin data from pending to confirmed
      const adminData = localStorage.getItem("admin_pending")
      localStorage.setItem("admin_user", adminData)
      localStorage.removeItem("admin_pending")

      navigate("/admin/dashboard")
    } else {
      setError("Mã OTP không đúng. Vui lòng thử lại.")
      setOtp(Array(OTP_LENGTH).fill(""))
      inputRefs.current[0]?.focus()
    }

    setLoading(false)
  }

  const handleCancel = () => {
    localStorage.removeItem("admin_pending")
    localStorage.removeItem("access_token")
    navigate("/admin")
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-12">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-600/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* OTP Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30">
            <ShieldCheckIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Xác thực OTP</h1>
          <p className="mt-2 text-slate-400">Nhập mã xác thực để tiếp tục</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Inputs */}
            <div className="flex justify-center gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="h-16 w-16 rounded-xl border-2 border-slate-600 bg-slate-700/50 text-center text-2xl font-bold text-white transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              ))}
            </div>

            {/* Hint */}
            <p className="text-center text-sm text-slate-500">
              Mã OTP mặc định: <span className="font-mono text-amber-500">555</span>
            </p>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-center text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 rounded-xl border border-slate-600 bg-slate-700/50 py-3 font-semibold text-slate-300 transition-all hover:bg-slate-700"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 font-semibold text-white shadow-lg shadow-amber-500/30 transition-all hover:from-amber-600 hover:to-amber-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <SpinnerIcon className="h-5 w-5 animate-spin" />
                    Đang xác thực...
                  </span>
                ) : (
                  "Xác nhận"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
