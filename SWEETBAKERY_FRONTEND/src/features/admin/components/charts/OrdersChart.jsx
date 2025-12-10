import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Hàm lấy 7 ngày dựa trên chuỗi tuần (VD: "2025-W49")
function getDaysFromWeek(weekString) {
    if(!weekString) return [];
    const [yearStr, weekStr] = weekString.split('-W');
    const year = Number(yearStr);
    const week = Number(weekStr);
    
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dayOfWeek = simple.getDay();
    const isoWeekStart = simple;
    if (dayOfWeek <= 4)
        isoWeekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        isoWeekStart.setDate(simple.getDate() + 8 - simple.getDay());
        
    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(isoWeekStart);
        d.setDate(isoWeekStart.getDate() + i);
        days.push(d);
    }
    return days;
}

export default function OrdersChart({ orders = [], selectedWeek }) {
    const data = useMemo(() => {
        const daysList = getDaysFromWeek(selectedWeek);
        
        // Label thứ trong tuần (T2, T3...)
        const labels = daysList.map((d) => 
            d.toLocaleDateString("vi-VN", { weekday: "short", day: "numeric", month: "numeric" })
        );

        const counts = daysList.map((day) => {
            const count = orders.reduce((s, o) => {
                if (!o.ngayDatHang) return s;
                const d = new Date(o.ngayDatHang);
                if (d.getFullYear() === day.getFullYear() && 
                    d.getMonth() === day.getMonth() && 
                    d.getDate() === day.getDate()) {
                    return s + 1;
                }
                return s;
            }, 0);
            return count;
        });

        return {
            labels,
            datasets: [
                {
                    label: "Số đơn hàng",
                    data: counts,
                    fill: true,
                    backgroundColor: "rgba(59, 130, 246, 0.1)", // Blue
                    borderColor: "rgba(59, 130, 246, 1)",
                    pointRadius: 4,
                    tension: 0.3,
                },
            ],
        };
    }, [orders, selectedWeek]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: "#f1f5f9" } },
        },
    };

    return (
        <div className="h-64 w-full">
            <Line data={data} options={options} />
        </div>
    );
}