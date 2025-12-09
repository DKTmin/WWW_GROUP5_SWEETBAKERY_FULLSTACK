import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function getLastMonths(n = 6) {
    const now = new Date();
    const months = [];
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            label: d.toLocaleString("vi-VN", { month: "short", year: "numeric" }),
            year: d.getFullYear(),
            month: d.getMonth(),
        });
    }
    return months;
}

export default function RevenueChart({ orders = [], months = 6 }) {
    const data = useMemo(() => {
        const monthsList = getLastMonths(months);
        const totals = monthsList.map((m) => {
            const total = orders.reduce((s, o) => {
                if (!o.ngayDatHang) return s;
                const d = new Date(o.ngayDatHang);
                if (d.getFullYear() === m.year && d.getMonth() === m.month) {
                    return s + (Number(o.tongTien) || 0);
                }
                return s;
            }, 0);
            return total;
        });

        return {
            labels: monthsList.map((m) => m.label),
            datasets: [
                {
                    label: "Doanh thu",
                    data: totals,
                    backgroundColor: "rgba(250, 204, 21, 0.95)",
                    borderRadius: 6,
                    maxBarThickness: 40,
                },
            ],
        };
    }, [orders, months]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 6, bottom: 6, left: 6, right: 6 } },
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${Number(ctx.parsed.y).toLocaleString("vi-VN")}₫`,
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: "#475569" },
            },
            y: {
                ticks: {
                    callback: (v) => Number(v).toLocaleString("vi-VN") + "₫",
                    color: "#475569",
                },
                grid: { color: "rgba(15,23,42,0.04)" },
            },
        },
    };

    return (
        <div className="h-56 p-2">
            <Bar data={data} options={options} />
        </div>
    );
}
