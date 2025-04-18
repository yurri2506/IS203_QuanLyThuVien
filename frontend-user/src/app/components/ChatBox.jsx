"use client";
import {
  Send,
  MessageCircleMore,
  Minus,
  Maximize,
  Minimize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";

const BoxChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello Nice" },
    {
      sender: "bot",
      text: "Welcome to LiveChat! I was made with Pick a topic from the list or type down a question!",
    },
    { sender: "user", text: "Welcome" },
    { sender: "bot", text: "Hello Nice" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() === "") return;
    const newMessage = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }), // Lấy giờ:phút
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
      {/* Nút mở chat */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 p-0 bg-blue-500 rounded-full flex items-center justify-center hover:opacity-80 hover:bg-blue-600 relative"
      >
        <MessageCircleMore className="w-8 h-8 text-white size-0.3" />
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">1</span>
        </div>
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
            <span className="text-lg font-semibold text-gray-700">
              Chat Box
            </span>
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
                {isFullScreen ? (
                  <Minimize className="w-5 h-5" />
                ) : (
                  <Maximize className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#E6EAF1]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div flex flex-col>
                  <span className="text-xs text-gray-500 mt-1">
                    {`${msg.sender === "user" ? "Visitor\t" : "LiveChat\t"}`}
                    {msg.time ||
                      new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
              placeholder="Type a message..."
              className="w-full border-0 rounded-xl px-3 py-2 outline-none"
            />
            <Button
              onClick={sendMessage}
              className="ml-2 bg-white text-black px-2 py-2 rounded-lg hover:bg-90 hover:bg-blue-200"
            >
              <Send className="w-6 h-6 size-0.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoxChat;
