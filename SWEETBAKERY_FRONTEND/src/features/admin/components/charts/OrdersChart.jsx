import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function getLastDays(n = 7) {
    const now = new Date();
    const days = [];
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        days.push(d);
    }
    return days;
}

export default function OrdersChart({ orders = [], days = 7 }) {
    const data = useMemo(() => {
        const daysList = getLastDays(days);
        const labels = daysList.map((d) => d.toLocaleDateString("vi-VN", { weekday: "short", day: "numeric" }));
        const counts = daysList.map((day) => {
            const count = orders.reduce((s, o) => {
                if (!o.ngayDatHang) return s;
                const d = new Date(o.ngayDatHang);
                if (d.getFullYear() === day.getFullYear() && d.getMonth() === day.getMonth() && d.getDate() === day.getDate()) {
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
                    label: "Số đơn",
                    data: counts,
                    fill: true,
                    backgroundColor: "rgba(59,130,246,0.12)",
                    borderColor: "rgba(59,130,246,1)",
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    tension: 0.35,
                },
            ],
        };
    }, [orders, days]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 6, bottom: 6, left: 6, right: 6 } },
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.y} đơn` } },
        },
    };

    return (
        <div className="h-56 p-2">
            <Line data={data} options={{ ...options, scales: { x: { grid: { display: false }, ticks: { color: "#475569" } }, y: { grid: { color: "rgba(15,23,42,0.04)" }, ticks: { color: "#475569", stepSize: 1 } } } }} />
        </div>
    );
}
