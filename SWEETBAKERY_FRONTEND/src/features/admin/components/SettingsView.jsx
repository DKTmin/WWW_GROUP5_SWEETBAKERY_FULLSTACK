import React from "react";

export default function SettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Cài đặt</h2>
        <p className="text-slate-500">Quản lý cài đặt hệ thống</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Thông tin cửa hàng</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Tên cửa hàng</label>
              <input
                type="text"
                defaultValue="Sweet Bakery"
                className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Địa chỉ</label>
              <input
                type="text"
                defaultValue="123 Đường Ngọt Ngào, Gò Vấp, TP.HCM"
                className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Hotline</label>
              <input
                type="text"
                defaultValue="0123 456 789"
                className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <button className="rounded-lg bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700">
              Lưu thay đổi
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Đổi mật khẩu Admin</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Mật khẩu mới</label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <button className="rounded-lg bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700">
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
