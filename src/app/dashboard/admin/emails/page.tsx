"use client";

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/Header";
import {
  XMarkIcon,
  // ChatBubbleLeftRightIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PaperClipIcon,
  UserIcon,
  PhoneIcon,
  DocumentTextIcon,
  BuildingOffice2Icon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { FaceSmileIcon } from "@heroicons/react/24/solid";
import Select, { MultiValue } from "react-select";

// -----------------------------------------------------
// TypeScript interfaces

export interface UserInfo {
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt?: string;
  // Client-specific properties:
  numeroDossier?: string;
  department?: string;
  gestionnaireSuivi?: string;
}

export interface Message {
  id: number;
  sender: UserInfo;
  content: string;
  date: string;
}

export interface Conversation {
  id: number;
  title: string;
  participants: UserInfo[];
  lastMessage: string;
  lastDate: string;
  messages: Message[];
}

interface Option {
  value: string;
  label: string;
  user: UserInfo;
}

// -----------------------------------------------------
// NewConversationModal component props

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newConv: Conversation) => void;
}

// Modal for creating a new conversation
function NewConversationModal({ isOpen, onClose, onCreate }: NewConversationModalProps) {
  // Form state now stores participants as an array of UserInfo.
  const [form, setForm] = useState({
    title: "",
    participants: [] as UserInfo[],
    message: "",
  });
  // Available users fetched from API.
  const [ , setAvailableUsers] = useState<UserInfo[]>([]);
  // Options for react-select.
  const [userOptions, setUserOptions] = useState<Option[]>([]);

  // Fetch available users when the modal opens.
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Error fetching users");
        const data: UserInfo[] = await res.json();
        setAvailableUsers(data);
        setUserOptions(
          data.map((user) => ({
            value: user.email,
            label: `${user.firstName || ""} ${user.lastName || ""} (${user.role})`,
            user,
          }))
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    if (isOpen) fetchUsers();
  }, [isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle change for the react-select multi-select component.
  const handleParticipantsChange = (selected: MultiValue<Option>) => {
    const selectedUsers = selected.map((option) => option.user);
    setForm((prev) => ({ ...prev, participants: selectedUsers }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Retrieve current user info from localStorage.
    const proInfoString = localStorage.getItem("proInfo");
    const proInfo: UserInfo | null = proInfoString ? JSON.parse(proInfoString) : null;
    // If proInfo exists and isn't already selected, add it.
    if (proInfo && !form.participants.some((u) => u.email === proInfo.email)) {
      form.participants.push(proInfo);
    }

    const newConv: Conversation = {
      id: Date.now(),
      title: form.title,
      participants: form.participants,
      lastMessage: form.message,
      lastDate: new Date().toISOString().split("T")[0],
      messages: [
        {
          id: Date.now(),
          sender: proInfo || {
            email: "vous@example.com",
            role: "Admin",
            firstName: "Vous",
            lastName: "",
            phone: "",
            createdAt: new Date().toISOString(),
          },
          content: form.message,
          date: new Date().toISOString(),
        },
      ],
    };

    try {
      // POST the new conversation to the API.
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConv),
      });
      if (!res.ok) {
        throw new Error("Failed to create conversation on the server.");
      }
      const savedConv: Conversation = await res.json();
      // Update parent state with the saved conversation.
      onCreate(savedConv);
    } catch (error) {
      console.error("Error creating conversation:", error);
      // Optionally, you can fall back to local state update:
      onCreate(newConv);
    }
    onClose();
    setForm({ title: "", participants: [], message: "" });
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Fermer"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Nouvelle Conversation</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Titre
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Participants</label>
                <Select
                  isMulti
                  name="participants"
                  options={userOptions}
                  value={userOptions.filter((option) =>
                    form.participants.some((user) => user.email === option.value)
                  )}
                  onChange={handleParticipantsChange}
                  className="mt-1"
                  classNamePrefix="react-select"
                  placeholder="Sélectionnez des participants..."
                />
              </div>

              {/* Preview of selected participants */}
              {form.participants.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Participants sélectionnés</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {form.participants.map((user) => (
                      <div key={user.email} className="flex items-center p-3 bg-gray-100 rounded-lg shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3">
                          {user.firstName?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {user.firstName || ""} {user.lastName || ""}
                          </p>
                          <p className="text-xs text-gray-500">{user.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Premier Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Créer</Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// -----------------------------------------------------
// UserDetailsModal component props

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserInfo[];
}

// Modal to display conversation participants
function UserDetailsModal({ isOpen, onClose, users }: UserDetailsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Fermer"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center gap-2">
              <UserIcon className="h-8 w-8" /> Détails des participants
            </h2>
            <div className="space-y-6">
              {users.map((user) => (
                <div key={user.email} className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {user.firstName?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {user.firstName || ""} {user.lastName || ""}
                      </h3>
                      <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon className="h-5 w-5 mr-2" />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <PhoneIcon className="h-5 w-5 mr-2" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    {user.numeroDossier && (
                      <div className="flex items-center text-sm text-gray-600">
                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                        <span>N° Dossier: {user.numeroDossier}</span>
                      </div>
                    )}
                    {user.department && (
                      <div className="flex items-center text-sm text-gray-600">
                        <BuildingOffice2Icon className="h-5 w-5 mr-2" />
                        <span>Département: {user.department}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// -----------------------------------------------------
// ConversationAvatar component props

interface ConversationAvatarProps {
  title: string;
}

// Dynamic avatar component (shows first letter of title)
function ConversationAvatar({ title }: ConversationAvatarProps) {
  const displayTitle = title || "U";
  return (
    <div className="w-10 h-10 rounded-full bg-[#2a75c7] flex items-center justify-center text-white font-bold">
      {displayTitle.charAt(0).toUpperCase()}
    </div>
  );
}

// -----------------------------------------------------
// ChatList component props

interface ChatListProps {
  onSelectConversation: (conv: Conversation) => void;
  conversations: Conversation[];
  onNewConversation: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onDeleteConversation: (id: string) => void;
}

type ConversationWithMongo = Conversation & { _id?: string | number };

function getConversationId(conv: ConversationWithMongo): string | undefined {
  if (conv.id !== undefined) {
    return conv.id.toString();
  } else if (conv._id !== undefined) {
    return conv._id.toString();
  }
  return undefined;
}

function ChatList({
  onSelectConversation,
  conversations,
  onNewConversation,
  searchQuery,
  setSearchQuery,
  onDeleteConversation,
}: ChatListProps) {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 bg-gray-50 z-10 p-6 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1a365d]">Conversations</h1>
        <Button onClick={onNewConversation} className="flex items-center gap-1">
          <PlusIcon className="h-5 w-5" /> Nouvelle
        </Button>
      </div>
      <div className="p-4">
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-[#2a75c7]"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversations.map((conv, index) => (
          <motion.div
            key={`conversation-${conv.id ?? index}`}
            className="relative flex items-center gap-4 p-4 bg-white rounded-xl shadow hover:shadow-2xl transition duration-300 cursor-pointer border border-gray-200"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onSelectConversation(conv)}
          >
            <ConversationAvatar title={conv.title} />
            <div className="flex-1">
              <p className="font-semibold text-lg text-[#1a365d]">{conv.title}</p>
              <p className="text-xs text-gray-500">
                {(conv.participants || [])
                  .map((u) => `${u.firstName || ""} ${u.lastName || ""}`)
                  .join(", ")}
              </p>
              <p className="text-sm text-gray-600 mt-1">{conv.lastMessage}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">{conv.lastDate}</p>
            </div>
            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const conversationId = getConversationId(conv);
                if (conversationId) {
                  onDeleteConversation(conversationId);
                } else {
                  console.error("Conversation ID is missing");
                }
              }}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              aria-label="Delete conversation"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// -----------------------------------------------------
// ChatConversation component props

interface ChatConversationProps {
  conversation: Conversation;
  onBack: () => void;
}

// ChatConversation: displays the conversation thread with sender details.
function ChatConversation({ conversation, onBack }: ChatConversationProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Message[]>(conversation.messages || []);
  const [isSending, setIsSending] = useState<boolean>(false);

  // Get current user info from localStorage (fallback if not set)
  const currentUser: UserInfo = localStorage.getItem("proInfo")
    ? JSON.parse(localStorage.getItem("proInfo")!)
    : {
        email: "default@example.com",
        role: "User",
        firstName: "Moi",
        lastName: "",
        phone: "",
        createdAt: new Date().toISOString(),
      };

  // Compute unique users from messages
  const uniqueUsers: UserInfo[] = chatMessages.reduce((acc: UserInfo[], msg) => {
    if (!acc.some((user) => user.email === msg.sender.email)) {
      acc.push(msg.sender);
    }
    return acc;
  }, []);

  // Auto-scroll to the latest message when chatMessages updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Update local state if conversation prop changes
  useEffect(() => {
    setChatMessages(conversation.messages || []);
  }, [conversation]);

  // Helper to get a valid conversation ID
  const getConversationId = (): string | undefined => {
    const conv = conversation as ConversationWithMongo;
    return conv.id !== undefined ? conv.id.toString() : conv._id !== undefined ? conv._id.toString() : undefined;
  };

  // Handler for sending a new message
  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setIsSending(true);

    const newMessage: Message = {
      id: Date.now(),
      sender: currentUser,
      content: inputMessage,
      date: new Date().toISOString(),
    };

    const conversationId = getConversationId();
    if (!conversationId) {
      console.error("Conversation ID is missing");
      setIsSending(false);
      return;
    }

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const savedMessage: Message = await res.json();
      setChatMessages((prev) => [...prev, savedMessage]);
      setInputMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 p-4 shadow border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="outline" onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-100">
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </Button>
          <div className="flex items-center gap-3">
            <ConversationAvatar title={conversation.title} />
            <div>
              <p className="font-bold text-xl text-[#1a365d]">{conversation.title}</p>
              <p className="text-sm text-gray-500">
                {conversation.participants.map((u) => `${u.firstName || ""} ${u.lastName || ""}`).join(" • ")}
              </p>
            </div>
          </div>
        </div>
        <Button variant="ghost" onClick={() => setShowUserDetails(true)} className="text-[#1a365d] hover:underline">
          Voir les détails utilisateurs
        </Button>
      </div>

      {/* Conversation body */}
      <div
        className="flex-1 p-6 overflow-y-auto space-y-4 bg-white"
        style={{
          backgroundImage: "url('/images/chat-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {chatMessages.map((msg: Message) => {
          const isCurrentUser = msg.sender.email === currentUser.email;
          return (
            <div key={msg.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`max-w-[70%] p-4 rounded-3xl shadow-md break-words ${
                  isCurrentUser
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                <p className="text-base">{msg.content}</p>
                <p className="text-xs text-right mt-1 opacity-70">
                  {new Date(msg.date).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </motion.div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t border-gray-200 flex items-center space-x-3">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <FaceSmileIcon className="h-6 w-6 text-gray-500" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <PaperClipIcon className="h-6 w-6 text-gray-500" />
        </button>
        <form onSubmit={handleSendMessage} className="flex flex-1 items-center">
          <input
            type="text"
            placeholder="Tapez votre message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 rounded-full border border-gray-300 p-3 focus:outline-none focus:border-blue-500 shadow-sm"
          />
          <Button type="submit" disabled={isSending} className="ml-3 p-3 rounded-full shadow hover:shadow-lg transition bg-blue-500 text-white">
            {isSending ? "Envoi..." : "Envoyer"}
          </Button>
        </form>
      </div>

      {/* User details modal */}
      <UserDetailsModal isOpen={showUserDetails} onClose={() => setShowUserDetails(false)} users={uniqueUsers} />
    </div>
  );
}

// -----------------------------------------------------
// Main ChatPage with Header integrated and real API fetch for conversations

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isNewConvOpen, setIsNewConvOpen] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch("/api/conversations");
        if (!res.ok) throw new Error("Error fetching conversations");
        const data: Conversation[] = await res.json();
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    }
    fetchConversations();
  }, []);

  const filteredConversations = conversations.filter((conv: Conversation) => {
    const lowerQuery = searchQuery.toLowerCase();
    return (
      (conv.title || "").toLowerCase().includes(lowerQuery) ||
      (conv.participants || []).some((p) =>
        `${p.firstName || ""} ${p.lastName || ""}`.toLowerCase().includes(lowerQuery)
      )
    );
  });

  const handleDeleteConversation = async (id: string) => {
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setConversations((prev) => prev.filter((conv) => getConversationId(conv) !== id));
        if (selectedConversation && getConversationId(selectedConversation) === id) {
          setSelectedConversation(null);
        }
      } else {
        console.error("Failed to delete conversation");
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const handleCreateConversation = (newConv: Conversation) => {
    setConversations((prev) => [newConv, ...prev]);
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
          <div className="flex h-full">
            {/* Conversation List */}
            <motion.div
              className={`w-full md:w-1/3 border-r border-gray-200 ${selectedConversation ? "hidden md:block" : ""}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ChatList
                onSelectConversation={(conv) => setSelectedConversation(conv)}
                conversations={filteredConversations}
                onNewConversation={() => setIsNewConvOpen(true)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onDeleteConversation={handleDeleteConversation}
              />
            </motion.div>

            {/* Conversation Thread */}
            <div className="flex-1">
              {selectedConversation ? (
                <ChatConversation conversation={selectedConversation} onBack={() => setSelectedConversation(null)} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Sélectionnez une conversation pour commencer
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal for creating a new conversation */}
      <NewConversationModal isOpen={isNewConvOpen} onClose={() => setIsNewConvOpen(false)} onCreate={handleCreateConversation} />
    </div>
  );
}
