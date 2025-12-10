import React from "react";

export default function StatCard({ icon: Icon, label, value, change, color = "amber" }) {
  const colorMap = {
    amber: "bg-amber-100 text-amber-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`rounded-xl p-3 ${colorMap[color] || colorMap.amber}`}>
          {Icon && <Icon className="h-6 w-6" />}
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-green-600">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
          <span>{change}</span>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}
