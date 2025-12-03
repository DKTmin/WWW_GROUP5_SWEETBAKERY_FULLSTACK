import { useState } from "react";
import { useNavigate } from "react-router-dom";
import aiApi from "../apis/aiApi";

// helper format giá
function formatPrice(value) {
  if (value == null) return "";
  return Number(value).toLocaleString("vi-VN") + "₫";
}

export default function ChatAIPage() {
  const navigate = useNavigate();

  // 1️⃣ Khởi tạo với lời chào mặc định của bot
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Xin chào, mình là Trợ lý AI Sweet Bakery 🍰 Hôm nay bạn cần tư vấn loại bánh nào vậy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // danh sách sản phẩm gợi ý của lần trả lời gần nhất
  const [suggestions, setSuggestions] = useState([]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await aiApi.chat(text);
      const payload = res?.data?.data || {};
      const answer = payload.answer || "Xin lỗi, mình chưa trả lời được câu này.";
      const aiMsg = { role: "ai", text: answer };

      setMessages((prev) => [...prev, aiMsg]);
      setSuggestions(payload.suggestions || []);
    } catch (e) {
      console.error(e);
      const errMsg = {
        role: "ai",
        text: "Xin lỗi, hệ thống đang gặp lỗi, bạn thử lại sau nhé.",
      };
      setMessages((prev) => [...prev, errMsg]);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8E9]">
      <div className="mx-auto max-w-4xl px-4 pt-8 pb-28">
        <h1 className="mb-4 text-center text-2xl font-bold text-amber-900">
          Trợ Lý AI Sweet Bakery
        </h1>

        {/* khung chat */}
        <div className="space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm ${
                  m.role === "user"
                    ? "bg-amber-700 text-white rounded-br-none"
                    : "bg-white text-stone-800 rounded-bl-none"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-xs text-stone-500 mt-2">AI đang suy nghĩ giúp bạn...</div>
          )}

          {/* 2️⃣ Card gợi ý sản phẩm mới nhất */}
          {suggestions && suggestions.length > 0 && (
            <div className="mt-4">
              <h2 className="mb-2 text-sm font-semibold text-amber-800">
                Một vài lựa chọn phù hợp cho bạn:
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="group flex flex-col overflow-hidden rounded-xl bg-white shadow hover:shadow-lg transition transform hover:-translate-y-0.5 text-left"
                  >
                    <div className="relative h-28 w-full overflow-hidden bg-[#FFF4E0]">
                      <img
                        src={p.imageUrl || "/placeholder.png"}
                        alt={p.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                    <div className="p-2">
                      <p className="line-clamp-2 text-xs font-semibold text-stone-800 mb-1">
                        {p.name}
                      </p>
                      <p className="text-xs font-bold text-amber-700">
                        {formatPrice(p.price)}
                      </p>
                      <p className="mt-1 text-[10px] text-amber-600 underline">
                        Xem chi tiết
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ô nhập tin nhắn */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white/95">
        <div className="mx-auto flex max-w-4xl gap-3 px-4 py-3">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 resize-none rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
            placeholder="Ví dụ: Mình thích bánh socola ít ngọt, gợi ý giúp mình 2–3 loại nhé… 💕"
          />
          <button
            onClick={send}
            disabled={loading}
            className="min-w-[80px] rounded-xl bg-amber-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-800 disabled:opacity-70"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
