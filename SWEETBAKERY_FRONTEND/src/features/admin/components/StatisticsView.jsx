import React from "react";

export default function StatisticsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Thống kê</h2>
        <p className="text-slate-500">Phân tích dữ liệu bán hàng chi tiết</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart Placeholder */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Doanh thu theo tháng</h3>
          <div className="flex h-64 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            Biểu đồ doanh thu
          </div>
        </div>

        {/* Orders Chart Placeholder */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Đơn hàng theo tuần</h3>
          <div className="flex h-64 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            Biểu đồ đơn hàng
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Sản phẩm bán chạy</h3>
          <div className="space-y-4">
            {[
              { name: "Bánh Tiramisu", sales: 156, percent: 85 },
              { name: "Bánh Red Velvet", sales: 134, percent: 73 },
              { name: "Bánh Cheesecake", sales: 98, percent: 53 },
              { name: "Bánh Chocolate", sales: 87, percent: 47 },
            ].map((item) => (
              <div key={item.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.name}</span>
                  <span className="text-slate-500">{item.sales} đơn</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Stats */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Khách hàng mới</h3>
          <div className="flex h-64 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            Biểu đồ khách hàng
          </div>
        </div>
      </div>
    </div>
  );
}
