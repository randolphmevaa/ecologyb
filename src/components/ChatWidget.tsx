"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import io, { Socket } from "socket.io-client";

interface Message {
  type: "assistant" | "user" | "staff";
  message: string;
  timestamp?: string;
}

export default function ChatWidget({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [phase, setPhase] = useState<"intro" | "liveChat">("intro");

  // Keep a reference to the Socket.io connection
  const socketRef = useRef<Socket | null>(null);

  // Keep a reference to automatically scroll into view
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    setMessages([
      {
        type: "assistant",
        message:
          "Bonjour ! Je suis votre conseiller virtuel. Merci d'avoir fait appel à nos services. Comment puis-je vous aider aujourd'hui ?",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  // Function to send a message from the user
  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      type: "user",
      message: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    if (phase === "intro") {
      // After the user’s first message, move to live chat
      setTimeout(() => {
        setIsTyping(false);
        connectToExpert();
      }, 1000);
    } else if (phase === "liveChat") {
      // If already in live chat, send the message to staff
      if (socketRef.current) {
        socketRef.current.emit("clientMessage", {
          text: userMsg.message,
        });
      }
      setIsTyping(false);
    }
  };

  // Connect user to a live expert
  const connectToExpert = () => {
    setMessages((prev) => [
      ...prev,
      {
        type: "assistant",
        message: "Je vous mets en relation avec un expert...",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    // Simulate short delay before establishing the live chat
    setTimeout(() => {
      setPhase("liveChat");
      startLiveChatSocket();
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          message:
            "Vous êtes maintenant en chat direct avec notre expert. N'hésitez pas à poser vos questions !",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }, 1500);
  };

  // Inside your ChatWidget component
  const startLiveChatSocket = () => {
    // Connect to the same host (this works both in development and production)
    const socket = io(undefined, { transports: ["websocket"] });
    socketRef.current = socket;
  
    socket.on("serverMessage", (data) => {
      console.log("Received message from server:", data);
      // Handle the incoming message (e.g., update state to display the message)
    });
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
            <h2 className="text-white text-lg font-bold">
              {phase === "liveChat" ? "Assistance en Direct" : "Support Client"}
            </h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {messages.map((msg, index) => {
              // Basic styling based on sender
              const containerStyles = "max-w-[80%] p-3 rounded-lg shadow ";
              let alignment =
                msg.type === "user"
                  ? "bg-green-100 self-end text-right"
                  : "bg-gray-100 self-start text-left";

              if (msg.type === "staff") {
                alignment = "bg-blue-100 self-start text-left";
              }

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={containerStyles + alignment}
                >
                  <p className="text-sm">{msg.message}</p>
                  {msg.timestamp && (
                    <span className="block mt-1 text-xs text-gray-500">
                      {msg.timestamp}
                    </span>
                  )}
                </motion.div>
              );
            })}

            {isTyping && (
              <motion.div
                className="max-w-[80%] p-3 rounded-lg bg-gray-100 self-start text-left shadow animate-pulse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-sm italic text-gray-500">
                  Le conseiller virtuel est en train d&apos;écrire...
                </p>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-200 flex items-center">
            <input
              type="text"
              placeholder={
                phase === "liveChat"
                  ? "Écrivez votre message..."
                  : "Décrivez votre besoin..."
              }
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
