"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  // ChatBubbleBottomCenterTextIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

interface Message {
  type: "user" | "assistant";
  message: string;
  timestamp?: string;
}

export default function ChatWidget({
  onClose,
}: {
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "assistant",
      message:
        "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages are added.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "") return;
    const userMsg: Message = {
      type: "user",
      message: input,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    // Show typing indicator
    setIsTyping(true);

    // Simulate assistant reply after 1.5 seconds.
    setTimeout(() => {
      setIsTyping(false);
      const reply: Message = {
        type: "assistant",
        message:
          "Merci pour votre message. Un conseiller vous contactera sous peu.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-80 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 py-3 flex justify-between items-center">
            <h2 className="text-white text-lg font-bold">Assistant Virtuel</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          {/* Conversation Area */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`max-w-[80%] p-3 rounded-lg shadow ${
                  msg.type === "user"
                    ? "bg-green-100 self-end text-right"
                    : "bg-gray-100 self-start text-left"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                {msg.timestamp && (
                  <span className="block mt-1 text-xs text-gray-500">
                    {msg.timestamp}
                  </span>
                )}
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                className="max-w-[80%] p-3 rounded-lg bg-gray-100 self-start text-left shadow animate-pulse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-sm italic text-gray-500">
                  L&apos;assistant est en train d&apos;écrire...
                </p>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Input Area */}
          <div className="px-4 py-3 border-t border-gray-200 flex items-center">
            <input
              type="text"
              placeholder="Votre message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button
              onClick={sendMessage}
              className="ml-3 text-green-600 hover:text-green-800 transition-colors"
            >
              <PaperAirplaneIcon className="h-6 w-6 rotate-90" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
