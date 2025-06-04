// src/app/components/ChatBotButton.jsx
"use client";
import React, { useState, useEffect } from "react";
import { Send, MessageCircleMore, Minus, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";

// Icon Chat
const ChatIcon = () => {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="chat-svg w-[2.25rem] h-[2.25rem]"
    >
      <mask
        id="mask0_342_2441"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="1"
        y="1"
        className="w-[2.0625rem] h-[2.0625rem]"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.5 1.50049H33.7395V33.7412H1.5V1.50049Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_342_2441)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.16266 29.513C10.0327 29.513 10.8532 29.843 11.7217 30.1925C17.0422 32.6525 23.3347 31.5335 27.4342 27.4355C32.8432 22.0235 32.8432 13.22 27.4342 7.81099C24.8152 5.19199 21.3322 3.75049 17.6242 3.75049C13.9147 3.75049 10.4302 5.19349 7.81266 7.81249C3.71166 11.9105 2.59566 18.203 5.03316 23.4725C5.38416 24.341 5.72316 25.187 5.72316 26.066C5.72316 26.9435 5.42166 27.827 5.15616 28.607C4.93716 29.249 4.60566 30.218 4.81866 30.431C5.02716 30.647 6.00216 30.3065 6.64566 30.086C7.41816 29.822 8.29416 29.519 9.16266 29.513V29.513ZM17.5867 33.7415C15.2947 33.7415 12.9877 33.257 10.8292 32.258C10.1932 32.003 9.59766 31.763 9.17016 31.763C8.67816 31.766 8.01666 31.994 7.37766 32.2145C6.06666 32.6645 4.43466 33.2255 3.22716 32.0225C2.02416 30.818 2.57916 29.1905 3.02616 27.881C3.24666 27.236 3.47316 26.57 3.47316 26.066C3.47316 25.652 3.27366 25.124 2.96766 24.3635C0.158156 18.296 1.45716 10.9835 6.22266 6.22099C9.26466 3.17749 13.3132 1.50049 17.6227 1.50049C21.9322 1.50049 25.9822 3.17599 29.0242 6.21949C35.3122 12.5075 35.3122 22.7375 29.0242 29.0255C25.9417 32.1095 21.7912 33.7415 17.5867 33.7415V33.7415Z"
          fill="white"
        />
      </g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.5443 19.7446C22.7163 19.7446 22.0383 19.0741 22.0383 18.2446C22.0383 17.4151 22.7028 16.7446 23.5308 16.7446H23.5443C24.3723 16.7446 25.0443 17.4151 25.0443 18.2446C25.0443 19.0741 24.3723 19.7446 23.5443 19.7446"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.5311 19.7446C16.7031 19.7446 16.0251 19.0741 16.0251 18.2446C16.0251 17.4151 16.6881 16.7446 17.5176 16.7446H17.5311C18.3591 16.7446 19.0311 17.4151 19.0311 18.2446C19.0311 19.0741 18.3591 19.7446 17.5311 19.7446"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.5175 19.7446C10.6895 19.7446 10.0115 19.0741 10.0115 18.2446C10.0115 17.4151 10.676 16.7446 11.504 16.7446H11.5175C12.3455 16.7446 13.0175 17.4151 13.0175 18.2446C13.0175 19.0741 12.3455 19.7446 11.5175 19.7446"
        fill="white"
      />
    </svg>
  );
};

// Badge thông báo
const NotificationBadge = ({ count }) => {
  return (
    <div
      className="absolute self-center w-[1.5rem] text-[1rem] font-bold text-center justify-center items-center text-white bg-[#F7302E] rounded-full"
      role="status"
      aria-label={`${count} unread messages`}
    >
      {count}
    </div>
  );
};

// Component ChatBox
const ChatBotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Chào bạn! Tôi là trợ lý thư viện. Hỏi tôi về sách còn hay không, sách mới trong tháng, hoặc sách được yêu thích nhé! 😊" },
  ]);
  const [input, setInput] = useState("");
  const [notificationVisible, setNotificationVisible] = useState(true);

  // Khởi tạo Supabase client
  const supabase = createClient(
    "https://bodplopetgopwanaxmej.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvZHBsb3BldGdvcHdhbmF4bWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MjE0NjksImV4cCI6MjA2MDA5NzQ2OX0.4Ao054tK11NFSqSdM0iYbze3kGgq3aJLd8cDrwQ8vr4"
  );

  // Google AI Studio API
  const API_KEY = "AIzaSyBqd2u7gmKg_Dm9tG8ZLtAH_l6P3-h4kTo";
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

  const sendMessage = async () => {
    if (input.trim() === "") return;
    const newUserMessage = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setNotificationVisible(false);

    try {
      const lowerMessage = input.toLowerCase();
      let botReply = "";

      // Kiểm tra tình trạng sách
      if (lowerMessage.includes("còn sách") || lowerMessage.includes("sách còn không")) {
        const bookTitle = extractBookTitle(input);
        const { data: bookData, error: bookError } = await supabase
          .from("book")
          .select("ma_sach, ten_sach, ten_tac_gia, trang_thai")
          .ilike("ten_sach", `%${bookTitle}%`)
          .limit(1);

        if (bookError) throw new Error("Lỗi truy vấn Supabase (book): " + bookError.message);
        if (bookData && bookData.length > 0) {
          const book = bookData[0];
          const { data: borrowData, error: borrowError } = await supabase
            .from("borrow_cards")
            .select("id")
            .eq("book_id", book.ma_sach)
            .is("status", "borrowed");

          if (borrowError) throw new Error("Lỗi truy vấn Supabase (borrow_cards): " + borrowError.message);
          botReply = `Cuốn "${book.ten_sach}" của ${book.ten_tac_gia} hiện ${borrowData.length === 0 ? "còn" : "đã được mượn"}. Bạn muốn mình hướng dẫn cách mượn không?`;
        } else {
          botReply = `Không tìm thấy cuốn "${bookTitle}". Bạn có muốn thử tên khác không?`;
        }
      }
      // Sách mới trong tháng
      else if (lowerMessage.includes("sách mới") || lowerMessage.includes("mới ra")) {
        const currentMonth = new Date().getMonth() + 1; // 6 cho tháng 6/2025
        const currentYear = new Date().getFullYear();  // 2025
        const { data, error } = await supabase
          .from("book")
          .select("ten_sach, ten_tac_gia, created_at")
          .gte("created_at", `${currentYear}-${currentMonth}-01`)
          .lte("created_at", `${currentYear}-${currentMonth}-30`)
          .limit(5);

        if (error) throw new Error("Lỗi truy vấn Supabase: " + error.message);
        if (data && data.length > 0) {
          botReply = "Sách mới trong tháng 6/2025:\n" + data.map(book => `- ${book.ten_sach} (${book.ten_tac_gia})`).join("\n");
        } else {
          botReply = "Hiện không có sách mới trong tháng này. Bạn muốn tìm sách theo thể loại không?";
        }
      }
      // Sách được yêu thích
      else if (lowerMessage.includes("sách yêu thích") || lowerMessage.includes("phổ biến")) {
        const { data, error } = await supabase
          .from("borrowed_books")
          .select("book_id, book!inner(ten_sach, ten_tac_gia)")
          .group("book_id")
          .order("count", { ascending: false })
          .limit(5);

        if (error) throw new Error("Lỗi truy vấn Supabase: " + error.message);
        if (data && data.length > 0) {
          const bookCounts = data.reduce((acc, curr) => {
            const book = curr.book;
            const key = book.ten_sach;
            acc[key] = acc[key] || { title: book.ten_sach, author: book.ten_tac_gia, count: 0 };
            acc[key].count += 1;
            return acc;
          }, {});
          const sortedBooks = Object.values(bookCounts).sort((a, b) => b.count - a.count).slice(0, 5);
          botReply = "Sách được yêu thích nhất:\n" + sortedBooks.map(book => `- ${book.title} (${book.author}, ${book.count} lượt mượn)`).join("\n");
        } else {
          botReply = "Hiện chưa có dữ liệu về sách được yêu thích. Bạn muốn tìm sách theo thể loại không?";
        }
      }
      // Câu hỏi chung (gửi đến Google AI Studio)
      else {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }] }],
            systemInstruction: {
              parts: [{
                text: "Bạn là một trợ lý thư viện thông minh, hỗ trợ người dùng tra cứu sách, kiểm tra tình trạng mượn/trả, và cung cấp thông tin về thư viện. Trả lời thân thiện, ngắn gọn, và chuyên nghiệp. Nếu không biết thông tin cụ thể, hướng dẫn người dùng liên hệ thư viện trực tiếp."
              }]
            }
          })
        });

        const data = await response.json();
        botReply = data.candidates[0].content.parts[0].text;
      }

      const newBotMessage = {
        sender: "bot",
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Lỗi:", error);
      const errorMessage = {
        sender: "bot",
        text: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const extractBookTitle = (message) => {
    const match = message.match(/"([^"]+)"|'([^']+)'|(\w[\w\s]*\w)/);
    return match ? (match[1] || match[2] || match[3]).trim() : "";
  };

  return (
//<<<<<<< thanhtri
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
      {/* Nút mở chat */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 p-0 bg-blue-500 rounded-full flex items-center justify-center hover:opacity-80 hover:bg-blue-600 relative"
//=======
    //<div className="fixed bottom-[1.5rem] right-[2rem] h-[4rem] w-[4rem]">
     // <button
       // onClick={toggleChat}
       // className="flex absolute top-1.5 left-1.5 justify-center items-center p-[0.75rem] bg-blue-800 rounded-[999px] cursor-pointer"
        //aria-label="Chat messages"
//>>>>>>> main
      >
        <ChatIcon />
        {notificationVisible && <NotificationBadge count={1} />}
      </Button>

      {/* Hộp chat */}
      {isOpen && (
        <div
          className={`${
            isFullScreen
              ? "fixed inset-0 w-full h-full"
              : "fixed bottom-20 right-4 w-80 h-96"
          } bg-white rounded-xl flex flex-col border-2 border-blue-300`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b rounded-tl-xl rounded-tr-xl bg-[#E6EAF1]">
            <span className="text-lg font-semibold text-gray-700">Trợ lý Thư viện</span>
            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <Minus className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="text-gray-600 hover:text-gray-800"
              >
                {isFullScreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#E6EAF1]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mt-1">
                    {`${msg.sender === "user" ? "Bạn\t" : "Thư viện\t"}${msg.time}`}
                  </span>
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ô nhập tin nhắn */}
          <div className="flex p-2 border-0 bg-white items-center rounded-br-xl rounded-bl-xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Nhập câu hỏi của bạn..."
              className="w-full border-0 rounded-xl px-3 py-2 outline-none"
            />
            <Button
              onClick={sendMessage}
              className="ml-2 bg-white text-black px-2 py-2 rounded-lg hover:bg-blue-200"
            >
              <Send className="w-6 h-6" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBotButton;
