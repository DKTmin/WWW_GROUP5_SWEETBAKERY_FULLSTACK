import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Hàm lấy tất cả các ngày trong tháng được chọn
function getDaysInMonth(year, month) {
    const date = new Date(year, month - 1, 1);
    const days = [];
    while (date.getMonth() === month - 1) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

export default function RevenueChart({ orders = [], selectedMonth }) {
    const data = useMemo(() => {
        if (!selectedMonth) return { labels: [], datasets: [] };

        const [year, month] = selectedMonth.split('-').map(Number);
        const daysList = getDaysInMonth(year, month);
        
        const labels = daysList.map(d => d.getDate()); // Label là ngày 1, 2, 3...

        const totals = daysList.map((day) => {
            const total = orders.reduce((s, o) => {
                if (!o.ngayDatHang) return s;
                // Chỉ tính đơn hoàn thành/đã thanh toán nếu cần
                // const status = String(o.trangThai).toUpperCase();
                // if (status === 'CANCELLED') return s;

                const d = new Date(o.ngayDatHang);
                if (d.getFullYear() === day.getFullYear() && 
                    d.getMonth() === day.getMonth() && 
                    d.getDate() === day.getDate()) {
                    return s + (Number(o.tongTien) || 0);
                }
                return s;
            }, 0);
            return total;
        });

        return {
            labels,
            datasets: [
                {
                    label: "Doanh thu",
                    data: totals,
                    backgroundColor: "rgba(245, 158, 11, 0.8)", // Amber-500
                    hoverBackgroundColor: "rgba(245, 158, 11, 1)",
                    borderRadius: 4,
                },
            ],
        };
    }, [orders, selectedMonth]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${Number(ctx.parsed.y).toLocaleString("vi-VN")}₫`,
                },
            },
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: "#64748b" } },
            y: {
                ticks: {
                    callback: (v) => v >= 1000000 ? `${v/1000000}M` : `${v/1000}k`,
                    color: "#64748b",
                },
                grid: { color: "#f1f5f9" },
            },
        },
    };

    return (
        <div className="h-64 w-full">
            <Bar data={data} options={options} />
        </div>
    );
}