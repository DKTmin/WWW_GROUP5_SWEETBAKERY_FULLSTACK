// src/components/common/AiChatBox.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// --- ICONS ---
const RobotIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.58-5.58m-5.59 5.58a6 6 0 0 1 5.58-5.58m5.59 5.58v3.128a2.25 2.25 0 0 1-1.789 2.197L12 21l-1.801-1.435a2.25 2.25 0 0 1-1.79-2.2V14.37m5.59-5.58a6 6 0 0 0-5.59-5.58m5.59 5.58h3.128a2.25 2.25 0 0 0 2.197-1.789l1.435-5.801-5.801-1.435a2.25 2.25 0 0 0-2.2 1.79H10" />
  </svg>
);

const SendIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
  </svg>
);

const XMarkIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

export default function AiChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Xin chào! Mình là trợ lý AI của Sweet Bakery. Bạn cần tìm bánh gì hay cần tư vấn không ạ?", sender: "bot" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // HÀM QUAN TRỌNG: Xử lý cú pháp [Tên](ID) thành Link
  const renderMessageContent = (text) => {
    // Regex tìm chuỗi dạng: [Tên Bánh](ID)
    const regex = /\[(.*?)\]\((.*?)\)/g;
    
    let parts = [];
    let lastIndex = 0;
    let match;

    // Lặp qua các kết quả tìm thấy
    while ((match = regex.exec(text)) !== null) {
      // 1. Thêm phần text thường trước link (nếu có)
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const productName = match[1]; // Tên bánh (trong ngoặc vuông)
      const productId = match[2];   // ID bánh (trong ngoặc tròn)

      // 2. Thêm Link vào mảng hiển thị
      parts.push(
        <Link 
          key={match.index} 
          to={`/product/${productId}`}
          className="font-bold text-blue-600 underline hover:text-blue-800 mx-1"
          onClick={() => {
             // Tùy chọn: Có thể đóng chat khi bấm link nếu muốn gọn màn hình
             // setIsOpen(false); 
          }}
        >
          {productName}
        </Link>
      );

      lastIndex = regex.lastIndex;
    }

    // 3. Thêm phần text còn lại sau link cuối cùng
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    // Nếu không có link nào, trả về text gốc
    return parts.length > 0 ? parts : text;
  };

  // Hàm gửi tin nhắn
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // 1. Thêm tin nhắn User
    const userMsg = { id: Date.now(), text: inputText, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      // 2. Gọi API Backend (Cổng 8082)
      const response = await fetch("http://localhost:8082/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMsg.text }),
      });

      if (!response.ok) throw new Error("API Error");

      const data = await response.json();

      // 3. Thêm phản hồi Bot
      const botMsg = { id: Date.now() + 1, text: data.reply, sender: "bot" };
      setMessages((prev) => [...prev, botMsg]);

    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg = { id: Date.now() + 1, text: "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.", sender: "bot" };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // SỬA THÀNH:
<div className="fixed bottom-10 right-24 z-50 flex flex-col items-end gap-2">
      
      {/* 1. Cửa sổ Chat */}
      <div 
        className={`w-80 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-all duration-300 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-10 pointer-events-none hidden"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-amber-900 px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <RobotIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Trợ lý ảo Sweet Bakery</h3>
              <p className="text-[10px] text-amber-100 flex items-center gap-1">
                <span className="block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
                Đang hoạt động
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-white/20">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Nội dung tin nhắn */}
        <div className="h-80 overflow-y-auto bg-stone-50 p-4">
          <div className="flex flex-col gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                  msg.sender === "user"
                    ? "self-end bg-amber-600 text-white rounded-br-none"
                    : "self-start bg-white text-stone-700 rounded-bl-none border border-stone-100"
                }`}
              >
                {/* Gọi hàm render để xử lý link nếu có */}
                {renderMessageContent(msg.text)}
              </div>
            ))}
            
            {/* Hiệu ứng đang gõ... */}
            {isLoading && (
              <div className="self-start rounded-2xl rounded-bl-none bg-white px-4 py-3 shadow-sm border border-stone-100">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.3s]"></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.15s]"></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="border-t border-stone-100 bg-white p-3">
          <div className="flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2">
            <input
              type="text"
              placeholder="Hỏi gì đó về bánh..."
              className="flex-1 bg-transparent text-sm text-stone-700 placeholder-stone-400 focus:outline-none"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />
            <button 
                type="submit" 
                disabled={isLoading || !inputText.trim()}
                className="text-amber-700 hover:text-amber-900 disabled:opacity-50 transition-colors"
            >
              <SendIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2 text-center text-[10px] text-stone-400">
            AI có thể trả lời sai, hãy kiểm tra lại thông tin.
          </div>
        </form>
      </div>

      {/* 2. Nút Bật/Tắt Chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-amber-600 text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl hover:bg-amber-700 border-2 border-white"
      >
        {isOpen ? (
             <XMarkIcon className="h-7 w-7" />
        ) : (
            <div className="relative">
                <RobotIcon className="h-7 w-7" />
                <span className="absolute -right-1 -top-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                </span>
            </div>
        )}
      </button>
    </div>
  );
}