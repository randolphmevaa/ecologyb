"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  MinusSmallIcon,
} from "@heroicons/react/24/outline";
import io, { Socket } from "socket.io-client";

interface Message {
  type: "assistant" | "user" | "staff";
  message: string;
  timestamp?: string;
}

// Define the expected shape of the data fetched from the API.
interface MessageData {
  sender: "client" | "staff";
  text: string;
  time: string;
  contactId?: string;
}

export default function ChatWidget({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [phase, setPhase] = useState<"intro" | "liveChat">("intro");
  const [isMinimized, setIsMinimized] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Retrieve client information from localStorage.
  let roomId = "";
  let contactId = "";
  const clientInfoStr = localStorage.getItem("clientInfo");
  if (clientInfoStr) {
    try {
      const clientInfo = JSON.parse(clientInfoStr);
      if (clientInfo.contact) {
        // Prioritize "contactId" over "id"
        contactId = clientInfo.contact.contactId || clientInfo.contact.id || "";
        if (clientInfo.contact.gestionnaireSuivi) {
          roomId = clientInfo.contact.gestionnaireSuivi;
        }
      }
      if (
        !roomId &&
        clientInfo.dossier &&
        clientInfo.dossier.length > 0 &&
        clientInfo.dossier[0].assignedTeam
      ) {
        roomId = clientInfo.dossier[0].assignedTeam;
      }
    } catch (error) {
      console.error("Erreur lors de l'analyse de clientInfo depuis localStorage", error);
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch conversation history for the room.
  useEffect(() => {
    if (!roomId) {
      console.warn("Aucune salle spécifiée dans clientInfo");
      return;
    }
    fetch(`/api/messages?room=${roomId}`)
      .then((res) => res.json())
      .then((data: MessageData[]) => {
        const mapped: Message[] = data
          .filter((item) => {
            // For staff messages, include only if the contactId matches.
            if (item.sender === "staff") {
              return item.contactId === contactId;
            }
            return true;
          })
          .map((item) => ({
            type: item.sender === "client" ? "user" : "staff",
            message: item.text,
            timestamp: item.time,
          }));
        // If no conversation exists, display a welcome message.
        if (mapped.length === 0) {
          mapped.unshift({
            type: "assistant",
            message:
              "Bonjour et bienvenue ! Je suis votre conseiller virtuel. Comment puis-je vous aider aujourd’hui ?",
            timestamp: new Date().toLocaleTimeString(),
          });
        }
        setMessages(mapped);
      })
      .catch(console.error);
  }, [roomId, contactId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const messageText = input;
    // Immediately display the user's message.
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        message: messageText,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setInput("");
    setIsTyping(true);

    if (phase === "intro") {
      setTimeout(() => {
        setIsTyping(false);
        connectToExpert();
      }, 1000);
    } else if (phase === "liveChat") {
      if (socketRef.current) {
        // Send the message along with the contactId.
        socketRef.current.emit("clientMessage", { 
          text: messageText, 
          contactId: contactId 
        });
      }
      setIsTyping(false);
    }
  };

  const connectToExpert = () => {
    setMessages((prev) => [
      ...prev,
      {
        type: "assistant",
        message: "Je vous mets en relation avec un expert...",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    setTimeout(() => {
      setPhase("liveChat");
      startLiveChatSocket();
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          message:
            "Vous êtes maintenant en chat direct avec notre expert. N’hésitez pas à poser vos questions !",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }, 1500);
  };

  const startLiveChatSocket = () => {
    // Pass the client's contactId in the query so the server can filter messages.
    const socket = io(undefined, {
      transports: ["websocket"],
      query: { role: "client", room: roomId, contactId },
    });
    socketRef.current = socket;

    socket.on("staffMessage", (data) => {
      // Only process staff messages intended for this client.
      if (data.contactId && data.contactId !== contactId) {
        return;
      }
      setMessages((prev) => {
        const duplicate = prev.some(
          (msg) => msg.type === "staff" && msg.message === data.text
        );
        if (duplicate) {
          return prev;
        }
        return [
          ...prev,
          {
            type: "staff",
            message: data.text,
            timestamp: new Date().toLocaleTimeString(),
          },
        ];
      });
    });

    socket.on("connect_error", (err) => {
      console.error("Erreur de connexion :", err);
    });

    socket.on("disconnect", (reason) => {
      console.warn("Déconnexion du socket :", reason);
    });
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-6 right-6 z-50 w-full max-w-sm"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div
          className={`flex flex-col overflow-hidden rounded-xl shadow-2xl ${
            isMinimized ? "h-12" : "min-h-[400px] max-h-[70vh]"
          }`}
          style={{ backgroundColor: "#ffffff", transition: "height 0.3s ease" }}
        >
          <div
            className="px-4 py-3 flex justify-between items-center"
            style={{ backgroundColor: "#213f5b" }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm text-white">
                {phase === "liveChat" ? "Chat avec un expert" : "Support Virtuel"}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleMinimize}
                className="text-white hover:opacity-80 transition-opacity"
              >
                <MinusSmallIcon className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="text-white hover:opacity-80 transition-opacity"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          {!isMinimized && (
            <>
              <div
                className="p-4 flex-1 overflow-y-auto space-y-4"
                style={{ backgroundColor: "#ffffff" }}
              >
                {messages.map((msg, index) => {
                  const isUser = msg.type === "user";
                  const isStaff = msg.type === "staff";
                  const containerClass = isUser
                    ? "justify-end text-right"
                    : "justify-start text-left";
                  let bubbleColor = "bg-gray-200";
                  if (isUser) bubbleColor = "bg-[#d2fcb2]";
                  if (isStaff) bubbleColor = "bg-[#bfddf9]";
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`flex items-start ${containerClass}`}
                    >
                      {!isUser && (
                        <div className="mr-2 flex-shrink-0">
                          <UserCircleIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div
                        className={`relative max-w-[75%] px-4 py-3 rounded-lg shadow ${bubbleColor}`}
                      >
                        <p className="text-sm leading-normal text-gray-800">
                          {msg.message}
                        </p>
                        {msg.timestamp && (
                          <span className="block mt-1 text-xs text-gray-500">
                            {msg.timestamp}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start justify-start"
                  >
                    <div
                      className="relative max-w-[75%] px-4 py-3 rounded-lg shadow"
                      style={{ backgroundColor: "#d2fcb2" }}
                    >
                      <div className="flex space-x-1">
                        <span className="block w-2 h-2 bg-gray-500 rounded-full animate-bounce1" />
                        <span className="block w-2 h-2 bg-gray-500 rounded-full animate-bounce2" />
                        <span className="block w-2 h-2 bg-gray-500 rounded-full animate-bounce3" />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div
                className="px-4 py-3 border-t flex items-center space-x-3"
                style={{ borderColor: "#213f5b", backgroundColor: "#ffffff" }}
              >
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
                  autoFocus
                  className="flex-1 px-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-2"
                  style={{ borderColor: "#213f5b" }}
                />
                <button
                  onClick={sendMessage}
                  className="p-2 rounded-full transition-colors"
                  style={{ backgroundColor: "#213f5b" }}
                >
                  <PaperAirplaneIcon className="h-5 w-5 transform -rotate-90 text-[#bfddf9]" />
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
