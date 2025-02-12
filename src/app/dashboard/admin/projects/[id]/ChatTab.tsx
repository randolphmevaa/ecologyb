// ChatTab.tsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  MicrophoneIcon,
  HomeIcon,
  CheckCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

interface ChatMessage {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
  read?: boolean; // Pour les messages envoyés par l'utilisateur
}

const sampleMessages: ChatMessage[] = [
  {
    id: 1,
    sender: "Alice",
    text: "Bonjour Bob, comment se passe ta journée ?",
    timestamp: "10:00",
  },
  {
    id: 2,
    sender: "Bob",
    text: "Salut Alice ! Ma journée se déroule à merveille. Je viens de terminer un grand projet !",
    timestamp: "10:02",
    read: true,
  },
  {
    id: 3,
    sender: "Alice",
    text: "C'est super ! Je pensais qu'on pourrait discuter de la nouvelle idée de projet.",
    timestamp: "10:03",
    read: true,
  },
  {
    id: 4,
    sender: "Bob",
    text: "Bien sûr, allons-y !",
    timestamp: "10:05",
  },
];

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-1">
      <div
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "0s" }}
      ></div>
      <div
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></div>
      <div
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "0.4s" }}
      ></div>
    </div>
  );
};

const ChatTab: React.FC = () => {
  const currentUser = "Alice";
  const [messages, setMessages] = useState<ChatMessage[]>(sampleMessages);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (input.trim() === "") return;
    const newMessage: ChatMessage = {
      id: messages.length + 1,
      sender: currentUser,
      text: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: true,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Simuler la saisie du partenaire
    setIsTyping(true);
    setTimeout(() => {
      const partnerMessage: ChatMessage = {
        id: messages.length + 2,
        sender: "Bob",
        text: "Compris ! Je vais examiner ton message et te recontacter rapidement.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, partnerMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Fonction pour rendre l'avatar SVG en fonction de l'expéditeur.
  const renderAvatar = (sender: string) => {
    return sender === currentUser ? (
      <UserCircleIcon className="w-8 h-8 text-blue-500" />
    ) : (
      <UserCircleIcon className="w-8 h-8 text-green-500" />
    );
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-xl rounded-lg overflow-hidden">
      {/* En-tête */}
      <div className="flex items-center p-4 bg-gradient-to-r from-indigo-600 to-purple-600">
        <button
          className="mr-4 text-white focus:outline-none"
          aria-label="Retour"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="mr-3">{renderAvatar("Bob")}</div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-white">Bob</h2>
          <p className="text-sm text-green-200">En ligne</p>
        </div>
        <button
          className="text-white focus:outline-none"
          aria-label="Infos"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M12 20.5A8.5 8.5 0 1012 3.5a8.5 8.5 0 000 17z"
            />
          </svg>
        </button>
      </div>

      {/* Liste des messages */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`flex items-end ${
                message.sender === currentUser
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {message.sender !== currentUser && (
                <div className="mr-2">{renderAvatar(message.sender)}</div>
              )}
              <div
                className={`relative max-w-xs md:max-w-md p-3 rounded-xl shadow-lg transition-all duration-200 ${
                  message.sender === currentUser
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <p className="text-sm break-words">{message.text}</p>
                <div className="mt-1 flex items-center justify-end space-x-1">
                  <span className="text-xs text-gray-300">
                    {message.timestamp}
                  </span>
                  {message.sender === currentUser && message.read && (
                    <CheckCircleIcon className="w-4 h-4 text-green-300" />
                  )}
                </div>
                {/* Queue de la bulle */}
                <div
                  className={`absolute bottom-0 ${
                    message.sender === currentUser
                      ? "right-[-6px]"
                      : "left-[-6px]"
                  } w-0 h-0 border-t-8 border-t-transparent border-r-8 ${
                    message.sender === currentUser
                      ? "border-r-blue-500"
                      : "border-r-gray-100"
                  }`}
                />
              </div>
              {message.sender === currentUser && (
                <div className="ml-2">{renderAvatar(message.sender)}</div>
              )}
            </motion.div>
          ))}

          {/* Indicateur de saisie */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-start"
            >
              <div className="mr-2">{renderAvatar("Bob")}</div>
              <div className="bg-gray-100 p-3 rounded-xl shadow-lg rounded-bl-none">
                <TypingIndicator />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3 bg-white rounded-full px-4 py-2 shadow-inner">
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Emoji"
          >
            <HomeIcon className="w-6 h-6" />
          </button>
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Joindre un fichier"
          >
            <PaperClipIcon className="w-6 h-6" />
          </button>
          <input
            type="text"
            placeholder="Tapez votre message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-grow border-none focus:outline-none text-gray-800 placeholder-gray-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 hover:bg-blue-600 p-2 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Envoyer le message"
          >
            <PaperAirplaneIcon className="w-6 h-6 transform rotate-90" />
          </button>
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Enregistrer un message vocal"
          >
            <MicrophoneIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatTab;
