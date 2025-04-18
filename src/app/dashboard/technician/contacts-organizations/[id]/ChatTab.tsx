// ChatTab.tsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io, Socket } from "socket.io-client";
import {
  PaperAirplaneIcon,
  // CheckCircleIcon,
  UserCircleIcon,
  PhotoIcon,
  CheckIcon,
  ChevronDownIcon,
  ExclamationCircleIcon,
  DocumentArrowUpIcon
} from "@heroicons/react/24/outline";

interface ChatMessage {
  id?: number;
  sender: string;
  text: string;
  time: string;
  room: string;
  contactId: string;
  status?: "sent" | "delivered" | "read";
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
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showContactInfo, setShowContactInfo] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Always call hooks; handle missing currentContactId inside the hook bodies.
  useEffect(() => {
    if (!currentContactId) return; // do nothing if no ID
    setLoading(true);
    setError("");
    
    const fetchContact = async () => {
      try {
        const res = await fetch(`/api/contacts/${currentContactId}`);
        if (!res.ok) throw new Error("Failed to fetch contact data");
        const data: ContactData = await res.json();
        setContactData(data);
        setRoom(data.gestionnaireSuivi);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Impossible de charger les informations du contact.");
        setLoading(false);
      }
    };
    fetchContact();
  }, [currentContactId]);

  useEffect(() => {
    if (!room || !currentContactId) return; // ensure prerequisites exist
    setLoading(true);
    
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?room=${room}`);
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data: ChatMessage[] = await res.json();
        const filtered = data.filter((msg) => msg.contactId === currentContactId);
        
        // Add status to messages - using type assertion to ensure correct typing
        const messagesWithStatus = filtered.map(msg => ({
          ...msg,
          status: msg.sender === "client" ? ("read" as const) : undefined
        }));
        
        setMessages(messagesWithStatus as ChatMessage[]);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Impossible de charger les messages.");
        setLoading(false);
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
        setMessages((prev) => [...prev, {...msg, status: "delivered" as const}]);
      }
    });
    
    socket.on("staffMessage", (msg: ChatMessage) => {
      if (msg.contactId === currentContactId) {
        setMessages((prev) => [...prev, msg]);
        // Simulate typing stopped
        setTimeout(() => setIsTyping(false), 1000);
      }
    });
    
    socket.on("typing", (data: {contactId: string, isTyping: boolean}) => {
      if (data.contactId === currentContactId) {
        setIsTyping(data.isTyping);
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
      }),
      room,
      contactId: currentContactId,
      status: "sent" as const
    };
    socketRef.current?.emit("clientMessage", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    
    // Simulate message being delivered after a short delay
    setTimeout(() => {
      setMessages(prev => 
        prev.map((msg, i) => 
          i === prev.length - 1 ? {...msg, status: "delivered" as const} : msg
        )
      );
      
      // Then simulate message being read
      setTimeout(() => {
        setMessages(prev => 
          prev.map((msg, i) => 
            i === prev.length - 1 ? {...msg, status: "read" as const} : msg
          )
        );
        
        // Simulate typing indicator
        setIsTyping(true);
      }, 1500);
    }, 1000);
  };

  const formatTime = (timeString: string) => {
    return timeString.split(':').slice(0, 2).join(':');
  };

  const renderMessageStatus = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case "sent":
        return <CheckIcon className="w-4 h-4 text-gray-400" />;
      case "delivered":
        return <div className="flex"><CheckIcon className="w-4 h-4 text-gray-400" /><CheckIcon className="w-4 h-4 text-gray-400 -ml-2" /></div>;
      case "read":
        return <div className="flex"><CheckIcon className="w-4 h-4 text-blue-500" /><CheckIcon className="w-4 h-4 text-blue-500 -ml-2" /></div>;
      default:
        return null;
    }
  };

  const renderAvatar = (sender: string, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12"
    };
    
    return (
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${sender === "client" ? "bg-indigo-100" : "bg-blue-100"}`}>
          {contactData?.imageUrl ? (
            <img
              src={contactData.imageUrl}
              alt={`${contactData.firstName} ${contactData.lastName}`}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <UserCircleIcon className={`${sender === "client" ? "text-indigo-600" : "text-blue-600"} ${size === "sm" ? "w-6 h-6" : "w-8 h-8"}`} />
          )}
        </div>
        {sender === "staff" && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
        )}
      </div>
    );
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { date: string; messages: ChatMessage[] }[] = [];
    let currentDate = "";
    let currentGroup: ChatMessage[] = [];

    messages.forEach((message) => {
      const messageDate = new Date().toLocaleDateString();
      
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: [...currentGroup] });
          currentGroup = [];
        }
        currentDate = messageDate;
      }
      
      currentGroup.push(message);
    });

    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup });
    }

    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Enhanced Header with Background */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="relative bg-gradient-to-r from-indigo-600 to-indigo-400 px-6 py-4"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full -mr-16 -mt-20 opacity-30" />
        <div className="absolute bottom-0 right-24 w-32 h-32 bg-indigo-300 rounded-full -mb-10 opacity-20" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowContactInfo(!showContactInfo)}>
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-indigo-300/50 animate-pulse"></div>
            ) : (
              renderAvatar("staff")
            )}
            
            <div>
              {loading ? (
                <>
                  <div className="h-5 w-32 bg-indigo-300/50 rounded animate-pulse mb-1"></div>
                  <div className="h-4 w-20 bg-indigo-300/50 rounded animate-pulse"></div>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    {contactData ? `${contactData.firstName} ${contactData.lastName}` : "Chargement..."}
                    <ChevronDownIcon className={`w-5 h-5 ml-1 transition-transform ${showContactInfo ? 'rotate-180' : ''}`} />
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm text-white/80">En ligne</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div>
            <button className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors">
              Historique de conversation
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Contact Info Panel - Slides down when clicked */}
      <AnimatePresence>
        {showContactInfo && contactData && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-indigo-50 border-b border-indigo-100 overflow-hidden"
          >
            <div className="p-4 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-indigo-500 uppercase">Numéro de dossier</p>
                <p className="text-gray-800">{contactData.numeroDossier || "Non défini"}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-indigo-500 uppercase">Téléphone</p>
                <p className="text-gray-800">{contactData.phone || "Non défini"}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-indigo-500 uppercase">Email</p>
                <p className="text-gray-800">{contactData.email || "Non défini"}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-indigo-500 uppercase">Adresse</p>
                <p className="text-gray-800">{contactData.mailingAddress || "Non définie"}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages List */}
      <div className="flex-grow overflow-y-auto bg-gradient-to-b from-indigo-50/50 to-white">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
              <p className="text-indigo-500">Chargement des messages...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <div className="flex flex-col items-center text-center max-w-md p-6 bg-white rounded-xl shadow-sm">
              <ExclamationCircleIcon className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Erreur de chargement</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Réessayer
              </button>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="flex flex-col items-center text-center max-w-md p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <PaperAirplaneIcon className="w-8 h-8 text-indigo-500 transform rotate-45" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Commencez la conversation</h3>
              <p className="text-gray-600">Envoyez un message pour démarrer la conversation</p>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {messageGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-4">
                <div className="flex justify-center">
                  <div className="px-4 py-1 rounded-full bg-gray-200/80 backdrop-blur-sm text-xs font-medium text-gray-600">
                    {group.date === new Date().toLocaleDateString() ? "Aujourd'hui" : group.date}
                  </div>
                </div>
                
                {group.messages.map((message, index) => {
                  const isSameUser = index > 0 && 
                               group.messages[index - 1].sender === message.sender;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 300, delay: index * 0.05 }}
                      className={`flex ${
                        message.sender === "client" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex items-end gap-2 max-w-[80%] ${
                          message.sender === "client" ? "flex-row-reverse" : ""
                        }`}
                      >
                        {!isSameUser && message.sender !== "client" && renderAvatar(message.sender, "sm")}
                        {isSameUser && message.sender !== "client" && <div className="w-8"></div>}
                        
                        <motion.div
                          className={`relative p-3 rounded-2xl shadow-sm ${
                            message.sender === "client"
                              ? "bg-indigo-500 text-white rounded-tr-none"
                              : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                          }`}
                          whileHover={{ scale: 1.01 }}
                        >
                          <p className="text-[15px] leading-relaxed">{message.text}</p>
                          <div className={`mt-1 flex items-center ${message.sender === "client" ? "justify-end" : "justify-start"} gap-2`}>
                            <span className={`text-xs ${message.sender === "client" ? "text-indigo-100" : "text-gray-500"}`}>
                              {formatTime(message.time)}
                            </span>
                            {message.sender === "client" && renderMessageStatus(message.status)}
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex justify-start"
              >
                <div className="flex items-end gap-2">
                  {renderAvatar("staff", "sm")}
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "400ms" }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-indigo-100 bg-gradient-to-b from-indigo-50/20 to-white">
        <motion.div
          className="flex items-center gap-2 bg-white rounded-xl shadow-md px-4 py-3 border border-indigo-100 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all"
          whileTap={{ scale: 0.99 }}
        >
          <input
            type="text"
            placeholder="Écrire un message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-transparent border-none focus:outline-none placeholder-gray-400 text-gray-800 text-[15px]"
          />
          
          <div className="flex items-center gap-3">
            <button 
              className="p-2 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
              title="Envoyer un document"
            >
              <DocumentArrowUpIcon className="w-5 h-5" />
            </button>
            <button 
              className="p-2 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
              title="Envoyer une photo"
            >
              <PhotoIcon className="w-5 h-5" />
            </button>
            <motion.button
              onClick={handleSend}
              className={`p-2 rounded-full ${
                input
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              } transition-colors`}
              whileHover={input ? { scale: 1.05 } : {}}
              whileTap={input ? { scale: 0.95 } : {}}
              disabled={!input}
              title="Envoyer"
            >
              <PaperAirplaneIcon className="w-5 h-5 transform -rotate-45" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatTab;