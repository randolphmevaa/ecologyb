// ConversationsPanel.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
  // UserIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronLeftIcon,
  // ChevronRightIcon,
  CheckIcon,
  // ClockIcon,
  DocumentTextIcon,
  // PaperAirplaneIcon,
  EllipsisHorizontalIcon,
  ArchiveBoxIcon,
  FunnelIcon,
  // ChevronDownIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {  Send, Phone, Mail, Clock, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr as dateFnsFr } from "date-fns/locale";

// TypeScript interfaces
interface Message {
  id: string;
  sender: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  unreadCount: number;
  lastMessageDate: Date;
  lastMessage: string;
  taskId: string;
  taskTitle: string;
  messages: Message[];
  status: "en_attente" | "a_placer" | "en_controle" | "controle";
}

// Interface for StatusBadge component props
interface StatusBadgeProps {
  status: "en_attente" | "a_placer" | "en_controle" | "controle";
}

// Mock conversation data structure
const mockConversations: Conversation[] = [
  {
    id: "conv1",
    clientId: "client1",
    clientName: "Martin Dupont",
    clientAvatar: "/avatars/client1.jpg",
    unreadCount: 2,
    lastMessageDate: new Date(2023, 10, 30, 14, 25),
    lastMessage: "Je serai présent pour le contrôle. Merci de confirmer l'heure.",
    taskId: "task1",
    taskTitle: "Contrôle PAC Air-Eau",
    messages: [
      {
        id: "msg1",
        sender: "Contrôleur",
        senderAvatar: "/veritas.png",
        content: "Bonjour, je confirme ma disponibilité pour le contrôle le 12 novembre.",
        timestamp: "2023-11-02T10:30:00",
        read: true,
      },
      {
        id: "msg2",
        sender: "Client",
        senderAvatar: "/avatars/client1.jpg",
        content: "Parfait, je serai présent. Dois-je préparer des documents spécifiques ?",
        timestamp: "2023-11-02T11:15:00",
        read: true,
      },
      {
        id: "msg3",
        sender: "Contrôleur",
        senderAvatar: "/veritas.png",
        content: "Oui, merci de préparer les factures d'achat et le certificat de l'installateur.",
        timestamp: "2023-11-02T14:30:00",
        read: true,
      },
      {
        id: "msg4",
        sender: "Client",
        senderAvatar: "/avatars/client1.jpg",
        content: "Je serai présent pour le contrôle. Merci de confirmer l'heure.",
        timestamp: "2023-11-30T14:25:00",
        read: false,
      },
    ],
    status: "en_attente",
  },
  {
    id: "conv2",
    clientId: "client2",
    clientName: "Sophie Martin",
    clientAvatar: "/avatars/client2.jpg",
    unreadCount: 0,
    lastMessageDate: new Date(2023, 10, 29, 9, 15),
    lastMessage: "L'accès aux combles se fait par une trappe dans le couloir.",
    taskId: "task2",
    taskTitle: "Vérification isolation combles",
    messages: [
      {
        id: "msg1",
        sender: "Admin",
        senderAvatar: "/logo-ecologyb.png",
        content: "Bonjour Mme Martin, je vous contacte concernant votre contrôle d'isolation des combles prévu pour le 5 décembre.",
        timestamp: "2023-11-28T08:45:00",
        read: true,
      },
      {
        id: "msg2",
        sender: "Client",
        senderAvatar: "/avatars/client2.jpg",
        content: "Bonjour, oui j'ai bien reçu le mail. À quelle heure est prévu le contrôle ?",
        timestamp: "2023-11-28T10:20:00",
        read: true,
      },
      {
        id: "msg3",
        sender: "Admin",
        senderAvatar: "/logo-ecologyb.png",
        content: "Le contrôle est prévu à 14h. Le contrôleur aura-t-il facilement accès aux combles ?",
        timestamp: "2023-11-28T11:05:00",
        read: true,
      },
      {
        id: "msg4",
        sender: "Client",
        senderAvatar: "/avatars/client2.jpg",
        content: "L'accès aux combles se fait par une trappe dans le couloir.",
        timestamp: "2023-11-29T09:15:00",
        read: true,
      },
    ],
    status: "a_placer",
  },
  {
    id: "conv3",
    clientId: "client3",
    clientName: "Philippe Durand",
    clientAvatar: "/avatars/client3.jpg",
    unreadCount: 1,
    lastMessageDate: new Date(2023, 10, 29, 16, 40),
    lastMessage: "Pouvez-vous me rappeler les documents nécessaires pour demain ?",
    taskId: "task3",
    taskTitle: "Contrôle installation solaire",
    messages: [
      {
        id: "msg1",
        sender: "Client",
        senderAvatar: "/avatars/client3.jpg",
        content: "Bonjour, pouvez-vous me rappeler les documents nécessaires pour demain ?",
        timestamp: "2023-11-29T16:40:00",
        read: false,
      },
    ],
    status: "en_controle",
  },
  {
    id: "conv4",
    clientId: "client4",
    clientName: "Claire Lefevre",
    clientAvatar: "/avatars/client4.jpg",
    unreadCount: 0,
    lastMessageDate: new Date(2023, 10, 25, 11, 30),
    lastMessage: "Le contrôleur a validé l'installation. Merci pour votre professionnalisme.",
    taskId: "task4",
    taskTitle: "Vérification chaudière",
    messages: [
      {
        id: "msg1",
        sender: "Admin",
        senderAvatar: "/logo-ecologyb.png",
        content: "Bonjour Mme Lefevre, le contrôle de votre chaudière s'est bien passé. Je vous confirme que votre installation est conforme.",
        timestamp: "2023-11-25T10:15:00",
        read: true,
      },
      {
        id: "msg2",
        sender: "Client",
        senderAvatar: "/avatars/client4.jpg",
        content: "Le contrôleur a validé l'installation. Merci pour votre professionnalisme.",
        timestamp: "2023-11-25T11:30:00",
        read: true,
      },
    ],
    status: "controle",
  },
  {
    id: "conv5",
    clientId: "client5",
    clientName: "Julien Blanc",
    clientAvatar: "/avatars/client5.jpg",
    unreadCount: 0,
    lastMessageDate: new Date(2023, 10, 27, 15, 10),
    lastMessage: "D'accord, j'ai bien reçu le mail avec les informations.",
    taskId: "task5",
    taskTitle: "Installation VMC",
    messages: [
      {
        id: "msg1",
        sender: "Admin",
        senderAvatar: "/logo-ecologyb.png",
        content: "Bonjour M. Blanc, je vous informe que le contrôle de votre VMC est planifié pour le 7 décembre à 10h.",
        timestamp: "2023-11-27T14:30:00",
        read: true,
      },
      {
        id: "msg2",
        sender: "Client",
        senderAvatar: "/avatars/client5.jpg",
        content: "D'accord, j'ai bien reçu le mail avec les informations.",
        timestamp: "2023-11-27T15:10:00",
        read: true,
      },
    ],
    status: "en_attente",
  },
];

// Status badge component for conversation list
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgColor, textColor, label;

  switch (status) {
    case "en_attente":
      bgColor = "bg-amber-100";
      textColor = "text-amber-800";
      label = "En attente";
      break;
    case "a_placer":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      label = "À placer";
      break;
    case "en_controle":
      bgColor = "bg-purple-100";
      textColor = "text-purple-800";
      label = "En contrôle";
      break;
    case "controle":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      label = "Contrôlé";
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
      label = "Inconnu";
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {label}
    </span>
  );
};

// Main Conversations Panel Component
const ConversationsPanel: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [newMessage, setNewMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showContextPanel, setShowContextPanel] = useState<boolean>(false);

  // Filter conversations by search query and status
  const filteredConversations = conversations.filter((conversation) => {
    // Apply status filter
    if (statusFilter !== "all" && conversation.status !== statusFilter) {
      return false;
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        conversation.clientName.toLowerCase().includes(query) ||
        conversation.taskTitle.toLowerCase().includes(query) ||
        conversation.lastMessage.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Sort conversations by last message date (most recent first)
  const sortedConversations = [...filteredConversations].sort((a, b) => 
    b.lastMessageDate.getTime() - a.lastMessageDate.getTime()
  );

  // Fetch conversation data (simulate API call)
  useEffect(() => {
    setTimeout(() => {
      setConversations(mockConversations);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Scroll to bottom of messages when a conversation is selected or a new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConversation]);

  // Handle sending a new message
  const handleSendMessage = (): void => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: `msg${Date.now()}`,
      sender: "Admin",
      senderAvatar: "/logo-ecologyb.png",
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: true,
    };

    // Update selected conversation with new message
    const updatedConversation: Conversation = {
      ...selectedConversation,
      lastMessage: newMessage,
      lastMessageDate: new Date(),
      messages: [...selectedConversation.messages, newMsg],
    };

    // Update conversations list
    const updatedConversations = conversations.map((conv) =>
      conv.id === selectedConversation.id ? updatedConversation : conv
    );

    setSelectedConversation(updatedConversation);
    setConversations(updatedConversations);
    setNewMessage("");

    // Scroll to bottom of messages
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Mark conversation as read when selected
  const handleSelectConversation = (conversation: Conversation): void => {
    if (conversation.unreadCount > 0) {
      const updatedConversation: Conversation = {
        ...conversation,
        unreadCount: 0,
        messages: conversation.messages.map((msg) => ({ ...msg, read: true })),
      };

      const updatedConversations = conversations.map((conv) =>
        conv.id === conversation.id ? updatedConversation : conv
      );

      setSelectedConversation(updatedConversation);
      setConversations(updatedConversations);
    } else {
      setSelectedConversation(conversation);
    }
  };

  // Start a new conversation
  const handleStartNewConversation = (): void => {
    // In a real app, this would open a modal to select a client or task
    alert("Fonctionnalité à implémenter : Démarrer une nouvelle conversation");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[500px] flex justify-center items-center bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-8 w-8 text-[#213f5b] mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-lg font-semibold text-[#213f5b]">
            Chargement des conversations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 min-h-[700px] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#213f5b] to-[#1a324a] p-6 text-white">
        <div className="flex items-start md:items-center justify-between flex-col md:flex-row">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-inner">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Conversations</h2>
              <div className="flex items-center gap-2 text-white/70 text-sm font-medium mt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Gérez vos échanges avec clients et contrôleurs</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleStartNewConversation}
            className="mt-4 md:mt-0 px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg inline-flex items-center text-sm transition-all border border-white/20 shadow-lg"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nouvelle conversation
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Rechercher par nom, sujet, message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center">
            <FunnelIcon className="w-4 h-4 text-gray-500 mr-2" />
            <p className="text-sm text-gray-500 mr-2">Statut:</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                statusFilter === "all"
                  ? "bg-gradient-to-r from-[#213f5b] to-[#1d6fa5] text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#4facfe] hover:bg-[#4facfe]/10"
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setStatusFilter("en_attente")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                statusFilter === "en_attente"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-amber-400 hover:bg-amber-50"
              }`}
            >
              En Attente
            </button>
            <button
              onClick={() => setStatusFilter("a_placer")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                statusFilter === "a_placer"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              À Placer
            </button>
            <button
              onClick={() => setStatusFilter("en_controle")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                statusFilter === "en_controle"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-purple-400 hover:bg-purple-50"
              }`}
            >
              En Contrôle
            </button>
            <button
              onClick={() => setStatusFilter("controle")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                statusFilter === "controle"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-green-400 hover:bg-green-50"
              }`}
            >
              Contrôlé
            </button>
          </div>
        </div>
      </div>

      {/* Conversations List and Chat Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Conversations List */}
        <div className={`w-full md:w-1/3 border-r border-gray-200 ${selectedConversation && 'hidden md:block'}`}>
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700">
              {sortedConversations.length} conversation{sortedConversations.length !== 1 ? "s" : ""}
            </h3>
            <div className="flex gap-2">
              <button className="p-1.5 text-gray-500 hover:text-[#4facfe] rounded-lg hover:bg-gray-100">
                <ArchiveBoxIcon className="w-5 h-5" />
              </button>
              <button className="p-1.5 text-gray-500 hover:text-[#4facfe] rounded-lg hover:bg-gray-100">
                <EllipsisHorizontalIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto" style={{ height: "calc(100% - 60px)" }}>
            {sortedConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-300 mb-3" />
                <h3 className="text-gray-600 font-medium mb-1">Aucune conversation trouvée</h3>
                <p className="text-sm text-gray-500">
                  {searchQuery
                    ? "Essayez avec d'autres termes de recherche"
                    : "Démarrez une nouvelle conversation"}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {sortedConversations.map((conversation) => (
                  <motion.li
                    key={conversation.id}
                    whileHover={{ x: 5, backgroundColor: "#f8fafc" }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`cursor-pointer relative ${
                      selectedConversation?.id === conversation.id
                        ? "bg-[#4facfe]/5 border-l-4 border-[#4facfe]"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="px-4 py-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="relative">
                            <img
                              src={conversation.clientAvatar || `https://ui-avatars.com/api/?name=${conversation.clientName}&background=random`}
                              alt={conversation.clientName}
                              className="w-10 h-10 rounded-full mr-3 object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = `https://ui-avatars.com/api/?name=${conversation.clientName}&background=random`;
                              }}
                            />
                            {conversation.unreadCount > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {conversation.clientName}
                            </h4>
                            <p className="text-xs text-gray-500 flex items-center mt-0.5">
                              <StatusBadge status={conversation.status} />
                              <span className="ml-2">{conversation.taskTitle}</span>
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {format(conversation.lastMessageDate, "dd MMM", {
                            locale: dateFnsFr,
                          })}
                        </span>
                      </div>
                      <p
                        className={`text-sm truncate pr-5 ${
                          conversation.unreadCount > 0
                            ? "font-semibold text-gray-900"
                            : "text-gray-600"
                        }`}
                      >
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className={`w-full md:w-2/3 flex flex-col ${!selectedConversation && 'hidden md:flex'}`}>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center">
                <button 
                  className="md:hidden mr-2 text-gray-500"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <img
                  src={selectedConversation.clientAvatar || `https://ui-avatars.com/api/?name=${selectedConversation.clientName}&background=random`}
                  alt={selectedConversation.clientName}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `https://ui-avatars.com/api/?name=${selectedConversation.clientName}&background=random`;
                  }}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedConversation.clientName}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center mt-0.5">
                    <StatusBadge status={selectedConversation.status} />
                    <span className="ml-2">{selectedConversation.taskTitle}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="p-2 text-gray-500 hover:text-[#4facfe] rounded-lg hover:bg-gray-100"
                  onClick={() => setShowContextPanel(!showContextPanel)}
                >
                  <DocumentTextIcon className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-[#4facfe] rounded-lg hover:bg-gray-100">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-[#4facfe] rounded-lg hover:bg-gray-100">
                  <EllipsisHorizontalIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "Admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.sender !== "Admin" && (
                      <img
                        src={message.senderAvatar || `https://ui-avatars.com/api/?name=${message.sender}&background=random`}
                        alt={message.sender}
                        className="w-8 h-8 rounded-full mr-2 mt-1 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = `https://ui-avatars.com/api/?name=${message.sender}&background=random`;
                        }}
                      />
                    )}
                    <div
                      className={`max-w-[75%] p-3.5 rounded-lg shadow-sm ${
                        message.sender === "Admin"
                          ? "bg-[#4facfe] text-white rounded-tr-none"
                          : "bg-white text-gray-800 rounded-tl-none"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center mt-1.5 text-xs ${
                        message.sender === "Admin" ? "text-white/70 justify-end" : "text-gray-500"
                      }`}>
                        <span>
                          {format(new Date(message.timestamp), "dd MMM HH:mm", {
                            locale: dateFnsFr,
                          })}
                        </span>
                        {message.sender === "Admin" && message.read && (
                          <CheckIcon className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </div>
                    {message.sender === "Admin" && (
                      <img
                        src={message.senderAvatar || `https://ui-avatars.com/api/?name=${message.sender}&background=random`}
                        alt={message.sender}
                        className="w-8 h-8 rounded-full ml-2 mt-1 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = `https://ui-avatars.com/api/?name=${message.sender}&background=random`;
                        }}
                      />
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end gap-2">
                <div className="flex-grow">
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition resize-none"
                    placeholder="Écrivez votre message..."
                    rows={2}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`p-3 rounded-lg ${
                    newMessage.trim()
                      ? "bg-[#213f5b] text-white hover:bg-[#1d3349]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  } transition-colors`}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full md:w-2/3 hidden md:flex flex-col items-center justify-center bg-gray-50 p-6">
            <div className="text-center max-w-md">
              <div className="bg-[#4facfe]/10 p-6 rounded-full inline-block mb-6">
                <ChatBubbleLeftRightIcon className="w-16 h-16 text-[#4facfe]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Aucune conversation sélectionnée</h3>
              <p className="text-gray-600 mb-6">
                Sélectionnez une conversation dans la liste pour voir les messages ou démarrez une nouvelle conversation.
              </p>
              <button
                onClick={handleStartNewConversation}
                className="px-6 py-3 bg-[#213f5b] text-white rounded-lg hover:bg-[#1a324a] transition-colors inline-flex items-center justify-center"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Nouvelle conversation
              </button>
            </div>
          </div>
        )}

        {/* Context Panel (Task Details) - conditionally rendered */}
        <AnimatePresence>
          {showContextPanel && selectedConversation && (
            <motion.div
              className="hidden lg:block w-1/4 border-l border-gray-200 bg-white overflow-y-auto"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Détails du contrôle</h3>
                <button
                  onClick={() => setShowContextPanel(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Informations générales</h4>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-sm font-medium text-gray-900 mb-1">{selectedConversation.taskTitle}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <StatusBadge status={selectedConversation.status} />
                      <span>ID: {selectedConversation.taskId}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Client</h4>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center mb-2">
                      <img
                        src={selectedConversation.clientAvatar || `https://ui-avatars.com/api/?name=${selectedConversation.clientName}&background=random`}
                        alt={selectedConversation.clientName}
                        className="w-8 h-8 rounded-full mr-2 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = `https://ui-avatars.com/api/?name=${selectedConversation.clientName}&background=random`;
                        }}
                      />
                      <p className="text-sm font-medium text-gray-900">{selectedConversation.clientName}</p>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-3 w-3 mr-1" />
                        <span>client@example.com</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-3 w-3 mr-1" />
                        <span>06 12 34 56 78</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Dernier contact: {format(selectedConversation.lastMessageDate, "dd MMM yyyy", { locale: dateFnsFr })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Actions rapides</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs flex flex-col items-center transition-colors">
                      <DocumentTextIcon className="h-5 w-5 mb-1" />
                      <span>Documents</span>
                    </button>
                    <button className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs flex flex-col items-center transition-colors">
                      <Mail className="h-5 w-5 mb-1" />
                      <span>Email</span>
                    </button>
                    <button className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs flex flex-col items-center transition-colors">
                      <Phone className="h-5 w-5 mb-1" />
                      <span>Appeler</span>
                    </button>
                    <button className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs flex flex-col items-center transition-colors">
                      <CalendarIcon className="h-5 w-5 mb-1" />
                      <span>Calendrier</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Documents</h4>
                  <ul className="space-y-2">
                    <li className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-xs flex justify-between items-center">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-900">Attestation.pdf</span>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Reçu</span>
                    </li>
                    <li className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-xs flex justify-between items-center">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-900">Facture.pdf</span>
                      </div>
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">En attente</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ConversationsPanel;