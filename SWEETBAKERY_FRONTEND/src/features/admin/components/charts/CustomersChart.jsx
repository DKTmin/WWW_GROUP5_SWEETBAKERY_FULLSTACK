import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
// --- NEW: Import thêm Filler ---
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler // <--- Quan trọng
} from "chart.js";

// --- NEW: Đăng ký Filler ---
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler // <--- Quan trọng
);

function getDaysInMonth(year, month) {
    const date = new Date(year, month - 1, 1);
    const days = [];
    while (date.getMonth() === month - 1) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

function parseCustomerDate(c) {
    if (!c) return null;

    const tryParse = (val) => {
        if (!val && val !== 0) return null;
        if (typeof val === 'number') {
            if (String(val).length === 10) return new Date(val * 1000);
            return new Date(val);
        }
        if (typeof val === 'string') {
            const s = val.trim();
            const d = new Date(s);
            if (!isNaN(d)) return d;
            const parts = s.split(/[-T:\s]/).map(Number);
            if (parts.length >= 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
                return new Date(parts[0], parts[1] - 1, parts[2]);
            }
            return null;
        }
        return null;
    };

    // Ưu tiên check các trường created_at
    const candidates = [
        c.created_at, c.createdAt, c.ngayTao, c.createdAtTimestamp, c.created_at_timestamp
    ];

    for (const x of candidates) {
        const parsed = tryParse(x);
        if (parsed) return parsed;
    }

    // Check nested objects (account, user)
    const nestedPaths = [
        c.account, c.user, c.profile, (c.account && c.account.user)
    ];

    for (const obj of nestedPaths) {
        if (!obj) continue;
        const nestedCandidates = [obj.created_at, obj.createdAt, obj.ngayTao, obj.createdAtTimestamp];
        for (const x of nestedCandidates) {
            const parsed = tryParse(x);
            if (parsed) return parsed;
        }
    }

    return null;
}

export default function CustomersChart({ customers = [], selectedMonth }) {
    const data = useMemo(() => {
        if (!selectedMonth) return { labels: [], datasets: [] };

        const [year, month] = selectedMonth.split('-').map(Number);
        const daysList = getDaysInMonth(year, month);
        
        const labels = daysList.map(d => d.getDate());

        const counts = daysList.map((day) => {
            const count = customers.reduce((s, c) => {
                const d = parseCustomerDate(c);
                if (!d) return s;
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
                    label: "Khách mới",
                    data: counts,
                    fill: true, // Cần plugin Filler để hoạt động
                    backgroundColor: "rgba(168, 85, 247, 0.1)",
                    borderColor: "rgba(168, 85, 247, 1)",
                    pointRadius: 3,
                    tension: 0.3,
                },
            ],
        };
    }, [customers, selectedMonth]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false }, ticks: { color: "#64748b" } },
            y: { beginAtZero: true, ticks: { stepSize: 1, color: "#64748b" }, grid: { color: "#f1f5f9" } },
        },
    };

    return (
        <div className="h-64 w-full">
            <Line data={data} options={options} />
        </div>
    );
}