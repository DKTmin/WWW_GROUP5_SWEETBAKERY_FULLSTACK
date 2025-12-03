import React from "react";
import { MenuIcon } from "./icons";

export default function HeaderBar({ onToggleSidebar }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      <button
        onClick={onToggleSidebar}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="hidden rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm placeholder-slate-400 focus:border-amber-500 focus:outline-none md:block"
        />
        <button className="relative rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-800">Admin User</p>
            <p className="text-xs text-slate-500">Quản trị viên</p>
          </div>
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=amber&color=fff"
            alt="Avatar"
            className="h-8 w-8 rounded-full"
          />
        </div>
      </div>
    </header>
  );
}
