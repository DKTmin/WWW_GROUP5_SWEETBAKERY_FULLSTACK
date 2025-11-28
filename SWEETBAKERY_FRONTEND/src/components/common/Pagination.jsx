export default function Pagination({ current = 1, total = 0, perPage = 8, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        className="rounded border px-3 py-1"
        disabled={current === 1}
      >
        Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`rounded px-3 py-1 ${p === current ? "bg-amber-700 text-white" : "border"}`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(Math.min(totalPages, current + 1))}
        className="rounded border px-3 py-1"
        disabled={current === totalPages}
      >
        Next
      </button>
    </div>
  );
}
