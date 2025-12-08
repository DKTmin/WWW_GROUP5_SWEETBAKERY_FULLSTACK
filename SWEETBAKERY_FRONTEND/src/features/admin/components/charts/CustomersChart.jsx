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

function parseCustomerDate(c) {
    // try common fields used in the project: ngayTao, createdAt, ngayTaoTaiKhoan, ngay_tao
    const candidates = ["ngayTao", "createdAt", "ngayTaoTaiKhoan", "ngay_tao", "ngayTaoKhachHang"];
    for (const k of candidates) {
        if (c && c[k]) return new Date(c[k]);
    }
    // fallback: try any field that looks like a date
    if (c) {
        for (const key of Object.keys(c)) {
            const v = c[key];
            if (typeof v === "string" && /\d{4}-\d{2}-\d{2}/.test(v)) {
                return new Date(v);
            }
        }
    }
    return null;
}

export default function CustomersChart({ customers = [], days = 7 }) {
    const data = useMemo(() => {
        const daysList = getLastDays(days);
        const labels = daysList.map((d) => d.toLocaleDateString("vi-VN", { weekday: "short", day: "numeric" }));
        const counts = daysList.map((day) => {
            const count = customers.reduce((s, c) => {
                const d = parseCustomerDate(c);
                if (!d) return s;
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
                    label: "Khách hàng mới",
                    data: counts,
                    fill: true,
                    backgroundColor: "rgba(139,92,246,0.08)",
                    borderColor: "rgba(139,92,246,1)",
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    tension: 0.35,
                },
            ],
        };
    }, [customers, days]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 6, bottom: 6, left: 6, right: 6 } },
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.y} khách` } },
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: "#475569" } },
            y: { beginAtZero: true, ticks: { stepSize: 1, color: "#475569" }, grid: { color: "rgba(15,23,42,0.04)" } },
        },
    };

    return (
        <div className="h-56 p-2">
            <Line data={data} options={options} />
        </div>
    );
}
