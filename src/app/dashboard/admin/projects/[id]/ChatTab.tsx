// ChatTab.tsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io, Socket } from "socket.io-client";
import {
  PaperAirplaneIcon,
  CheckCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

interface ChatMessage {
  id?: number;
  sender: string;
  text: string;
  time: string;
  room: string;
  contactId: string;
}

interface ContactData {
  _id: string;
  imageUrl: string;
  lastName: string;
  firstName: string;
  dateOfBirth: string;
  mailingAddress: string;
  phone: string;
  email: string;
  role: string;
  numeroDossier: string;
  department: string;
  gestionnaireSuivi: string; // used as room id for chat
  comments: string;
  maprNumero: string;
  mpremail: string;
  mprpassword: string;
  climateZone: string;
  rfr: string;
  eligible: string;
  contactId: string;
  password: string;
  plainPassword: string;
  createdAt: string;
}

interface ChatTabProps {
  currentContactId: string;
}

const ChatTab: React.FC<ChatTabProps> = ({ currentContactId }) => {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [room, setRoom] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Always call hooks; handle missing currentContactId inside the hook bodies.
  useEffect(() => {
    if (!currentContactId) return; // do nothing if no ID
    const fetchContact = async () => {
      try {
        const res = await fetch(`/api/contacts/${currentContactId}`);
        if (!res.ok) throw new Error("Failed to fetch contact data");
        const data: ContactData = await res.json();
        setContactData(data);
        setRoom(data.gestionnaireSuivi);
      } catch (error) {
        console.error(error);
      }
    };
    fetchContact();
  }, [currentContactId]);

  useEffect(() => {
    if (!room || !currentContactId) return; // ensure prerequisites exist
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?room=${room}`);
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data: ChatMessage[] = await res.json();
        const filtered = data.filter((msg) => msg.contactId === currentContactId);
        setMessages(filtered);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();
  }, [room, currentContactId]);

  useEffect(() => {
    if (!room || !currentContactId) return;
    const socket = io(undefined, {
      query: {
        role: "client",
        room: room,
        contactId: currentContactId,
      },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("clientMessage", (msg: ChatMessage) => {
      if (msg.contactId === currentContactId) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    socket.on("staffMessage", (msg: ChatMessage) => {
      if (msg.contactId === currentContactId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [room, currentContactId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (input.trim() === "" || !room) return;
    const newMessage: ChatMessage = {
      sender: "client",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      room,
      contactId: currentContactId,
    };
    socketRef.current?.emit("clientMessage", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  const renderAvatar = (sender: string) => (
    <div className="relative">
      <div className="w-10 h-10 rounded-full bg-[#213f5b] flex items-center justify-center">
        <UserCircleIcon className="w-8 h-8 text-[#bfddf9]" />
      </div>
      {sender === "staff" && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#d2fcb2] rounded-full border-2 border-white" />
      )}
    </div>
  );

  // Instead of an early return, conditionally render the error message.
  return (
    <>
      {!currentContactId ? (
        <div>Error: No contact ID provided.</div>
      ) : (
        <div className="flex flex-col h-full bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Minimal Header */}
          <div className="p-4 bg-[#213f5b]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="text-[#bfddf9] hover:text-white transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <div className="flex items-center gap-3">
                  {renderAvatar("staff")}
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {contactData
                        ? `${contactData.firstName} ${contactData.lastName}`
                        : "Chargement..."}
                    </h2>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-[#d2fcb2] rounded-full animate-pulse" />
                      <span className="text-sm text-[#d2fcb2]">En ligne</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-grow p-4 overflow-y-auto space-y-6 bg-[#f8fafc]">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`flex ${
                    message.sender === "client" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-end gap-2 ${
                      message.sender === "client" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {message.sender !== "client" && renderAvatar(message.sender)}
                    <motion.div
                      className={`relative max-w-xl p-4 rounded-2xl shadow-sm ${
                        message.sender === "client"
                          ? "bg-[#bfddf9] text-[#213f5b] rounded-br-none"
                          : "bg-white text-[#213f5b] rounded-bl-none border border-gray-100"
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-[15px] leading-relaxed">{message.text}</p>
                      <div className="mt-2 flex items-center justify-end gap-2">
                        <span className="text-xs text-[#213f5b]/70">
                          {message.time}
                        </span>
                        {message.sender === "client" && (
                          <CheckCircleIcon className="w-4 h-4 text-[#213f5b]/50" />
                        )}
                      </div>
                      <div
                        className={`absolute bottom-0 ${
                          message.sender === "client"
                            ? "-right-[6px]"
                            : "-left-[6px]"
                        } w-3 h-3 bg-inherit transform rotate-45 origin-bottom`}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-[#bfddf9]">
            <motion.div
              className="flex items-center gap-2 bg-white rounded-xl shadow-md px-4 py-2 border border-[#bfddf9]"
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="text"
                placeholder="Écrire un message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-transparent border-none focus:outline-none placeholder-[#213f5b]/50 text-[#213f5b] text-[15px]"
              />
              <motion.button
                onClick={handleSend}
                className={`p-2 rounded-lg ${
                  input
                    ? "bg-[#213f5b] text-white"
                    : "bg-[#bfddf9] text-[#213f5b]/50 cursor-not-allowed"
                }`}
                whileHover={input ? { scale: 1.05 } : {}}
                disabled={!input}
              >
                <PaperAirplaneIcon className="w-5 h-5 transform -rotate-45" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatTab;
