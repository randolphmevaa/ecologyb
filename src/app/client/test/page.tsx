"use client";

import { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

interface Message {
  type: "assistant" | "user" | "staff";
  message: string;
  timestamp?: string;
}

interface APIMessage {
  sender: "client" | "staff";
  text: string;
  time: string;
}


export default function StaffDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch conversation on mount.
  useEffect(() => {
    fetch("/api/messages")
      .then((res) => res.json())
      .then((data: APIMessage[]) => {
        const mapped: Message[] = data.map((item) => ({
          type: item.sender === "client" ? "user" : "staff",
          message: item.text,
          timestamp: item.time,
        }));
        setMessages(mapped);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
      query: { role: "staff" },
    });
    socketRef.current = socket;

    socket.on("clientMessage", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          message: data.text,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    socket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    const messageText = input;
    // Local echo: show the staff's own message immediately.
    setMessages((prev) => [
      ...prev,
      {
        type: "staff",
        message: messageText,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setInput("");
    if (socketRef.current) {
      socketRef.current.emit("staffMessage", { text: messageText });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Staff Chat Dashboard</h1>
      <div className="w-full max-w-md bg-white shadow rounded-lg flex flex-col">
        <div className="flex-1 h-80 overflow-y-auto p-4 border-b">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 flex ${
                msg.type === "staff" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg max-w-[75%] ${
                  msg.type === "staff"
                    ? "bg-blue-100 text-right"
                    : "bg-green-100 text-left"
                }`}
              >
                <p className="text-sm text-gray-800">{msg.message}</p>
                {msg.timestamp && (
                  <span className="text-xs text-gray-500">
                    {msg.timestamp}
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type a message as staff..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
