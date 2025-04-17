"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import io, { Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  ClockIcon,
  CheckIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  MapPinIcon,
  DocumentTextIcon,
  EllipsisHorizontalIcon,
  // PhotoIcon,
  FaceSmileIcon,
  PaperClipIcon,
  MicrophoneIcon,
  ChevronDownIcon,
  // BellIcon,
  Cog6ToothIcon,
  AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";
import {
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  BellIcon as BellIconSolid
} from "@heroicons/react/24/solid";
import { Header } from "@/components/Header";

interface Message {
  type: "assistant" | "user" | "staff";
  message: string;
  timestamp?: string;
  contactId?: string;
  status?: "pending" | "delivered" | "read";
  read?: boolean;
}

interface Contact {
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
  gestionnaireSuivi: string;
  comments: string;
  maprNumero: string;
  mpremail: string;
  mprpassword: string;
  climateZone: string;
  rfr: string;
  eligible: string;
  contactId: string;
  id: string;
  password: string;
  plainPassword: string;
  createdAt: string;
  lastSeen?: string;
  isOnline?: boolean;
}

interface MessageData {
  sender: string;
  text: string;
  time: string;
  contactId: string;
}

interface ClientMessage {
  text: string;
  contactId: string;
}

export default function StaffDashboard() {
  // State management
  const [conversations, setConversations] = useState<{ [contactId: string]: Message[] }>({});
  const [contacts, setContacts] = useState<{ [contactId: string]: Contact }>({});
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmoji, setShowEmoji] = useState(false);
  const [typingContactId, setTypingContactId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<{[contactId: string]: number}>({});
  const [showSearch, setShowSearch] = useState(false);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [isPinnedExpanded, setIsPinnedExpanded] = useState(true);
  const [pinnedContacts, setPinnedContacts] = useState<string[]>([]);
  const [filter, setFilter] = useState("all"); // all, unread, recent
  
  // Refs
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const requestedContacts = useRef<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Get Room ID from localStorage
  const roomId = useMemo(() => {
    if (typeof window === "undefined") return "";
    const proInfoStr = localStorage.getItem("proInfo");
    if (proInfoStr) {
      try {
        const proInfo = JSON.parse(proInfoStr);
        return proInfo._id || "";
      } catch (error) {
        console.error("Erreur lors du parsing de proInfo depuis localStorage", error);
        return "";
      }
    }
    return "";
  }, []);

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (selectedContact && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations, selectedContact]);

  // Fetch initial messages
  useEffect(() => {
    if (!roomId) {
      console.warn("Aucune salle spécifiée dans proInfo");
      return;
    }
    
    setIsLoading(true);
    
    fetch(`/api/messages?room=${roomId}`)
      .then((res) => res.json())
      .then((data: MessageData[]) => {
        const conv: { [contactId: string]: Message[] } = {};
        data.forEach((item) => {
          const mappedMsg: Message = {
            type: item.sender === "client" ? "user" : "staff",
            message: item.text,
            timestamp: item.time,
            contactId: item.contactId,
            status: "delivered",
            read: item.sender === "staff" ? true : false,
          };
          if (item.contactId) {
            if (!conv[item.contactId]) {
              conv[item.contactId] = [];
            }
            conv[item.contactId].push(mappedMsg);
          }
        });
        setConversations(conv);
        if (!selectedContact && Object.keys(conv).length > 0) {
          setSelectedContact(Object.keys(conv)[0]);
        }
        
        // Simulate some pinned contacts
        setPinnedContacts(Object.keys(conv).slice(0, 2));
        
        setTimeout(() => {
          setIsLoading(false);
        }, 800); // Slight delay for smooth loading transition
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  }, [roomId]);

  // Fetch contact details 
  useEffect(() => {
    Object.keys(conversations).forEach((contactId) => {
      if (!requestedContacts.current.has(contactId)) {
        requestedContacts.current.add(contactId);
        fetch(`/api/contacts/${contactId}`)
          .then((res) => res.json())
          .then((data: Contact) => {
            // Add some simulated online status
            const enhanced = {
              ...data,
              isOnline: Math.random() > 0.5,
              lastSeen: Math.random() > 0.5 ? "aujourd'hui" : "hier"
            };
            setContacts((prev) => ({ ...prev, [contactId]: enhanced }));
          })
          .catch(console.error);
      }
    });
  }, [conversations]);

  // Socket connection
  useEffect(() => {
    if (!roomId) return;

    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
      query: { role: "staff", room: roomId },
    });
    socketRef.current = socket;

    socket.on("clientMessage", (data: ClientMessage) => {
      // Add notifications for unselected contacts
      if (selectedContact !== data.contactId) {
        setNotifications(prev => ({
          ...prev,
          [data.contactId]: (prev[data.contactId] || 0) + 1
        }));
      }
      
      const newMsg: Message = {
        type: "user",
        message: data.text,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        contactId: data.contactId,
        read: selectedContact === data.contactId, // Mark as read if currently selected
      };
      
      setConversations((prev) => {
        const conv = { ...prev };
        const contact = data.contactId;
        if (!conv[contact]) {
          conv[contact] = [];
        }
        conv[contact] = [...conv[contact], newMsg];
        return conv;
      });
      
      // Show typing indicator briefly
      setTimeout(() => {
        setTypingContactId(data.contactId);
        setTimeout(() => setTypingContactId(null), 2000);
      }, 1000);
    });

    socket.on("connect_error", (err) => {
      console.error("Erreur de connexion:", err);
    });

    socket.on("disconnect", (reason) => {
      console.warn("Socket déconnecté:", reason);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, selectedContact]);

  // Focus input when changing contacts
  useEffect(() => {
    if (selectedContact && inputRef.current) {
      inputRef.current.focus();
      
      // Clear notifications when selecting a contact
      if (notifications[selectedContact]) {
        setNotifications(prev => {
          const newNotifications = {...prev};
          delete newNotifications[selectedContact];
          return newNotifications;
        });
      }
      
      // Mark messages as read
      setConversations(prev => {
        if (!prev[selectedContact]) return prev;
        
        const updated = {...prev};
        updated[selectedContact] = prev[selectedContact].map(msg => {
          if (msg.type === "user" && !msg.read) {
            return {...msg, read: true};
          }
          return msg;
        });
        
        return updated;
      });
    }
  }, [selectedContact, notifications]);
  
  // Focus search input when toggling search
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + / to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setShowSearch(true);
      }
      
      // Escape to close search
      if (e.key === "Escape" && showSearch) {
        setShowSearch(false);
      }
    };
    
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [showSearch]);

  // Send message function
  const sendMessage = async () => {
    if (!input.trim() || !selectedContact) return;
    const messageTexte = input;
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const newMsg: Message = {
      type: "staff",
      message: messageTexte,
      timestamp: timestamp,
      contactId: selectedContact,
      status: "pending",
    };

    setConversations((prev) => {
      const conv = { ...prev };
      if (!conv[selectedContact]) {
        conv[selectedContact] = [];
      }
      conv[selectedContact] = [...conv[selectedContact], newMsg];
      return conv;
    });
    setInput("");

    if (socketRef.current) {
      socketRef.current.emit("staffMessage", { text: messageTexte, contactId: selectedContact, room: roomId });
    }

    try {
      await fetch(`/api/messages?room=${roomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: messageTexte,
          sender: "staff",
          contactId: selectedContact,
          room: roomId,
          time: timestamp,
        }),
      });
      
      // Update message status to delivered
      setTimeout(() => {
        setConversations((prev) => {
          const conv = { ...prev };
          if (selectedContact) {
            const msgs = conv[selectedContact];
            if (msgs && msgs.length > 0) {
              const lastIndex = msgs.length - 1;
              if (msgs[lastIndex].type === "staff" && msgs[lastIndex].status === "pending") {
                msgs[lastIndex].status = "delivered";
              }
            }
          }
          return conv;
        });
        
        // Then update to read after a delay
        setTimeout(() => {
          setConversations((prev) => {
            const conv = { ...prev };
            if (selectedContact) {
              const msgs = conv[selectedContact];
              if (msgs && msgs.length > 0) {
                const lastIndex = msgs.length - 1;
                if (msgs[lastIndex].type === "staff" && msgs[lastIndex].status === "delivered") {
                  msgs[lastIndex].status = "read";
                }
              }
            }
            return conv;
          });
        }, 1500);
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du message:", error);
    }
  };
  
  // Toggle pin contact
  const togglePinContact = (contactId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (pinnedContacts.includes(contactId)) {
      setPinnedContacts(pinnedContacts.filter(id => id !== contactId));
    } else {
      setPinnedContacts([...pinnedContacts, contactId]);
    }
  };
  
  // Upload file handler
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  // Helper functions
  const getUnreadCount = (contactId: string) => {
    const msgs = conversations[contactId] || [];
    return msgs.filter(msg => msg.type === "user" && !msg.read).length;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return "";
    return timestamp;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non disponible";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }).format(date);
    } catch {
      return dateString;
    }
  };
  
  // const getLastMessagePreview = (msgs: Message[]) => {
  //   if (msgs.length === 0) return "Aucun message";
  //   const lastMsg = msgs[msgs.length - 1];
  //   return truncateText(lastMsg.message, 40);
  // };
  
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getLastActivityTime = (msgs: Message[]) => {
    if (msgs.length === 0) return null;
    const lastMsg = msgs[msgs.length - 1];
    return lastMsg.timestamp;
  };
  
  const hasNewMessages = (msgs: Message[]) => {
    return msgs.some(msg => msg.type === "user" && !msg.read);
  };
  
  const totalNotifications = Object.values(notifications).reduce((sum, count) => sum + count, 0);
  
  const toggleContactInfo = () => {
    setShowContactInfo(!showContactInfo);
  };

  const showContactsList = !selectedContact || !isMobileView;
  const showConversation = selectedContact && (!isMobileView || !showContactsList);
  
  // Filter contacts based on search and filter criteria
  const filteredContactIds = Object.keys(conversations).filter((contactId) => {
    const contact = contacts[contactId];
    if (!contact) return true;
    
    // Search filtering
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const email = (contact.email || "").toLowerCase();
    const department = (contact.department || "").toLowerCase();
    const searchQuery = searchTerm.toLowerCase();
    
    const matchesSearch = 
      fullName.includes(searchQuery) || 
      email.includes(searchQuery) || 
      department.includes(searchQuery);
    
    if (!matchesSearch) return false;
    
    // Status filtering
    if (filter === "unread") {
      return hasNewMessages(conversations[contactId] || []);
    }
    
    return true;
  });
  
  // Separate pinned and unpinned contacts
  const pinnedContactIds = filteredContactIds.filter(id => pinnedContacts.includes(id));
  const unpinnedContactIds = filteredContactIds.filter(id => !pinnedContacts.includes(id));

  const currentMessages = selectedContact ? conversations[selectedContact] || [] : [];

  // Interface elements
  const loadingLayout = (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="flex justify-center">
          <svg className="animate-spin h-12 w-12 text-213f5b" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h3 className="mt-4 text-xl font-semibold text-213f5b">Chargement de vos conversations</h3>
        <p className="mt-2 text-gray-500">Veuillez patienter un instant...</p>
      </div>
    </div>
  );

  if (isLoading) {
    return loadingLayout;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          {/* Contacts List Panel */}
          {showContactsList && (
            <motion.div
              className={`${isMobileView ? 'w-full' : 'w-80 lg:w-96'} flex flex-col border-r border-gray-200 bg-white shadow-sm`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-213f5b">Messagerie</h2>
                  <div className="flex space-x-2">
                    {totalNotifications > 0 && (
                      <div className="relative">
                        <BellIconSolid className="h-6 w-6 text-213f5b" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {totalNotifications}
                        </span>
                      </div>
                    )}
                    <Cog6ToothIcon className="h-6 w-6 text-gray-500 hover:text-213f5b cursor-pointer transition-colors" />
                  </div>
                </div>
                
                <AnimatePresence>
                  {showSearch ? (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="relative"
                    >
                      <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Rechercher un contact..."
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-213f5b focus:border-transparent transition-all"
                        onBlur={() => !searchTerm && setShowSearch(false)}
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => setAdvancedSearch(!advancedSearch)}
                        className="absolute right-14 top-3 text-gray-400 hover:text-213f5b"
                      >
                        <AdjustmentsHorizontalIcon className="h-5 w-5" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex space-x-2"
                    >
                      <button
                        onClick={() => setShowSearch(true)}
                        className="flex items-center space-x-2 text-gray-500 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors flex-grow"
                      >
                        <MagnifyingGlassIcon className="h-5 w-5" />
                        <span className="text-sm">Rechercher un contact...</span>
                        <span className="text-xs border border-gray-300 rounded px-1 py-0.5 ml-auto">⌘ /</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Advanced search filters - shown conditionally */}
                <AnimatePresence>
                  {advancedSearch && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="flex space-x-2 pb-1">
                        <button 
                          onClick={() => setFilter("all")}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            filter === "all" 
                              ? "bg-213f5b text-white" 
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          Tous
                        </button>
                        <button 
                          onClick={() => setFilter("unread")}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            filter === "unread" 
                              ? "bg-213f5b text-white" 
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          Non lus
                        </button>
                        <button 
                          onClick={() => setFilter("recent")}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            filter === "recent" 
                              ? "bg-213f5b text-white" 
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          Récents
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Pinned contacts section */}
              {pinnedContactIds.length > 0 && (
                <div className="px-4 py-2">
                  <button 
                    onClick={() => setIsPinnedExpanded(!isPinnedExpanded)}
                    className="flex items-center justify-between w-full text-sm font-semibold text-gray-500 py-2"
                  >
                    <span>Contacts épinglés ({pinnedContactIds.length})</span>
                    <ChevronDownIcon 
                      className={`h-4 w-4 transform transition-transform ${isPinnedExpanded ? '' : '-rotate-90'}`} 
                    />
                  </button>
                  
                  <AnimatePresence>
                    {isPinnedExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        {renderContactList(pinnedContactIds)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              
              {/* All other contacts */}
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                {unpinnedContactIds.length > 0 ? (
                  <>
                    {unpinnedContactIds.length > 0 && pinnedContactIds.length > 0 && (
                      <div className="text-sm font-semibold text-gray-500 py-2">
                        Toutes les conversations
                      </div>
                    )}
                    {renderContactList(unpinnedContactIds)}
                  </>
                ) : filteredContactIds.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500 p-6">
                    <ChatBubbleLeftRightIcon className="h-16 w-16 mb-4 text-gray-300" />
                    {searchTerm ? (
                      <>
                        <p className="text-center font-medium">Aucun résultat pour &quot;{searchTerm}&quot;</p>
                        <p className="text-sm mt-2">Essayez de modifier votre recherche</p>
                        <button 
                          onClick={() => setSearchTerm("")}
                          className="mt-4 px-4 py-2 bg-213f5b text-white rounded-full text-sm hover:bg-opacity-90 transition-colors"
                        >
                          Effacer la recherche
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-center font-medium">Aucune conversation</p>
                        <p className="text-sm mt-2">Les conversations apparaîtront ici</p>
                      </>
                    )}
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}

          {/* Chat Window Panel */}
          {showConversation && (
            <motion.div 
              className="flex-1 flex flex-col bg-gray-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Contact Header */}
              <div className="sticky top-0 p-4 border-b border-gray-200 bg-white shadow-sm flex items-center justify-between z-10">
                <div className="flex items-center">
                  {isMobileView && (
                    <button 
                      onClick={() => setSelectedContact(null)}
                      className="mr-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <ArrowLeftIcon className="h-5 w-5 text-213f5b" />
                    </button>
                  )}
                  
                  {contacts[selectedContact] ? (
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-213f5b text-white font-medium mr-3">
                          {getInitials(contacts[selectedContact].firstName, contacts[selectedContact].lastName)}
                        </div>
                        {contacts[selectedContact].isOnline && (
                          <span className="absolute bottom-0 right-3 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                        )}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-213f5b flex items-center">
                          {`${contacts[selectedContact].firstName} ${contacts[selectedContact].lastName}`}
                          <button
                            onClick={(e) => togglePinContact(selectedContact, e)}
                            className={`ml-2 p-1 rounded-full ${
                              pinnedContacts.includes(selectedContact) 
                                ? 'text-yellow-500 hover:text-gray-400' 
                                : 'text-gray-400 hover:text-yellow-500'
                            } transition-colors`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </h2>
                        <p className="text-xs text-gray-500 flex items-center">
                          {contacts[selectedContact].isOnline ? (
                            <span className="text-green-500 flex items-center">
                              <span className="h-1.5 w-1.5 bg-green-500 rounded-full mr-1.5"></span>
                              En ligne
                            </span>
                          ) : (
                            <span className="text-gray-500 flex items-center">
                              Vu {contacts[selectedContact].lastSeen}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <UserCircleIcon className="h-10 w-10 text-213f5b mr-3" />
                      <h2 className="text-lg font-bold text-gray-800">{selectedContact}</h2>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
                    <PhoneIcon className="h-5 w-5" />
                  </button>
                  
                  {contacts[selectedContact] && (
                    <button 
                      onClick={toggleContactInfo}
                      className={`p-2 rounded-full ${showContactInfo ? 'bg-d2fcb2 bg-opacity-50 text-213f5b' : 'text-gray-500 hover:bg-gray-100'} transition-colors`}
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                    </button>
                  )}
                  
                  <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
                    <EllipsisHorizontalIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 flex overflow-hidden">
                {/* Messages Area */}
                <div className={`${showContactInfo && !isMobileView ? 'w-2/3' : 'w-full'} flex flex-col`}>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {currentMessages.length > 0 ? (
                      currentMessages.map((msg, index) => {
                        const isStaff = msg.type === "staff";
                        const isConsecutive = index > 0 && currentMessages[index - 1].type === msg.type;
                        const showTimestamp = !isConsecutive || index === currentMessages.length - 1;
                        
                        return (
                          <motion.div
                            key={index}
                            className={`flex ${isStaff ? "justify-end" : "justify-start"}`}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ 
                              delay: Math.min(index * 0.03, 0.3),
                              duration: 0.2,
                              type: "spring",
                              stiffness: 260,
                              damping: 20
                            }}
                          >
                            <div className={`max-w-xs lg:max-w-md ${isConsecutive ? 'mt-1' : 'mt-3'}`}>
                              {!isStaff && !isConsecutive && contacts[selectedContact] && (
                                <div className="flex items-center mb-1 ml-1">
                                  <div className="w-6 h-6 rounded-full flex items-center justify-center bg-213f5b text-white text-xs font-medium mr-2">
                                    {getInitials(contacts[selectedContact].firstName, contacts[selectedContact].lastName)}
                                  </div>
                                  <span className="text-xs font-medium text-gray-800">
                                    {contacts[selectedContact].firstName} {contacts[selectedContact].lastName}
                                  </span>
                                </div>
                              )}
                              
                              <div
                                className={`p-3 rounded-lg ${
                                  isStaff 
                                    ? "bg-213f5b text-white rounded-br-none shadow-sm" 
                                    : "bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm"
                                } ${!isConsecutive ? '' : isStaff ? 'rounded-tr-md' : 'rounded-tl-md'}`}
                              >
                                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                              </div>
                              
                              {showTimestamp && (
                                <div className={`text-xs mt-1 flex ${isStaff ? "justify-end" : "justify-start"} items-center text-gray-500`}>
                                  {formatTime(msg.timestamp)}
                                  {isStaff && msg.status && (
                                    <span className="ml-1.5 flex items-center">
                                      {msg.status === "pending" ? (
                                        <ClockIcon className="h-3 w-3" />
                                      ) : msg.status === "delivered" ? (
                                        <CheckIcon className="h-3 w-3" />
                                      ) : (
                                        <CheckCircleIcon className="h-3 w-3 text-green-500" />
                                      )}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-500 p-6">
                        <div className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center max-w-md mx-auto">
                          <ChatBubbleLeftRightIconSolid className="h-16 w-16 mb-4 text-213f5b opacity-20" />
                          <h3 className="font-bold text-lg text-213f5b mb-2">Démarrer la conversation</h3>
                          <p className="text-sm text-center mb-6">Envoyez un message pour commencer à échanger avec {contacts[selectedContact]?.firstName || 'ce contact'}</p>
                          <button 
                            onClick={() => inputRef.current?.focus()}
                            className="px-4 py-2 bg-213f5b text-white rounded-full hover:bg-opacity-90 transition-colors flex items-center"
                          >
                            <PaperAirplaneIcon className="h-4 w-4 mr-2 transform -rotate-45" />
                            Envoyer un message
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Typing indicator */}
                    {typingContactId === selectedContact && (
                      <div className="flex justify-start">
                        <div className="max-w-xs bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Input Area */}
                  <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex flex-col rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
                      <div className="flex items-center pl-4 pr-2 py-2 space-x-2">
                        <input
                          ref={inputRef}
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                          placeholder="Tapez votre message..."
                          className="flex-1 bg-transparent focus:outline-none text-gray-800"
                        />
                        <button
                          onClick={() => setShowEmoji(!showEmoji)}
                          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          <FaceSmileIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={handleFileUpload}
                          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          <PaperClipIcon className="h-5 w-5" />
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            multiple
                          />
                        </button>
                        <button
                          onClick={() => {}}
                          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          <MicrophoneIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={sendMessage}
                          disabled={!input.trim()}
                          className={`ml-1 p-2.5 rounded-full transition-colors ${
                            input.trim() 
                              ? "bg-213f5b text-white hover:bg-opacity-90" 
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <PaperAirplaneIcon className="h-5 w-5 transform -rotate-45" />
                        </button>
                      </div>
                      
                      {/* Emoji picker would go here */}
                      <AnimatePresence>
                        {showEmoji && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-gray-200 overflow-hidden"
                          >
                            <div className="p-3 max-h-48 overflow-y-auto grid grid-cols-8 gap-2">
                              {["😊", "👍", "❤️", "😂", "🙏", "🔥", "👏", "✅", 
                                "🤔", "🎉", "👌", "🤝", "😍", "🤣", "⭐", "🥳"].map((emoji, i) => (
                                <button 
                                  key={i}
                                  onClick={() => {
                                    setInput(prev => prev + emoji);
                                    setShowEmoji(false);
                                    inputRef.current?.focus();
                                  }}
                                  className="text-2xl h-9 w-9 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
                
                {/* Contact Info Panel */}
                {showContactInfo && !isMobileView && selectedContact && contacts[selectedContact] && (
                  <motion.div 
                    className="w-1/3 border-l border-gray-200 bg-white overflow-y-auto"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                      <h3 className="font-bold text-213f5b">Informations du client</h3>
                      <button 
                        onClick={toggleContactInfo}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <XMarkIcon className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                    
                    <div className="p-4 space-y-5">
                      <div className="flex flex-col items-center p-5 bg-gradient-to-br from-213f5b to-213f5b/80 text-white rounded-xl">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white text-xl font-bold text-213f5b mb-3 border-2 border-white shadow-md">
                          {getInitials(
                            contacts[selectedContact].firstName,
                            contacts[selectedContact].lastName
                          )}
                        </div>
                        <h2 className="text-xl font-bold">
                          {`${contacts[selectedContact].firstName} ${contacts[selectedContact].lastName}`}
                        </h2>
                        <p className="text-sm opacity-90">
                          {contacts[selectedContact].role || "Client"}
                        </p>
                        <div className="flex space-x-3 mt-4">
                          <a href={`tel:${contacts[selectedContact].phone}`} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                            <PhoneIcon className="h-5 w-5" />
                          </a>
                          <a href={`mailto:${contacts[selectedContact].email}`} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                            <EnvelopeIcon className="h-5 w-5" />
                          </a>
                          <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                            <CalendarIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                        <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wider">Coordonnées</h4>
                        
                        <div className="flex items-start">
                          <div className="mt-0.5 bg-213f5b/10 p-1.5 rounded text-213f5b">
                            <EnvelopeIcon className="h-4 w-4" />
                          </div>
                          <div className="ml-3">
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-medium">{contacts[selectedContact].email || "Non disponible"}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mt-0.5 bg-213f5b/10 p-1.5 rounded text-213f5b">
                            <PhoneIcon className="h-4 w-4" />
                          </div>
                          <div className="ml-3">
                            <p className="text-xs text-gray-500">Téléphone</p>
                            <p className="text-sm font-medium">{contacts[selectedContact].phone || "Non disponible"}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mt-0.5 bg-213f5b/10 p-1.5 rounded text-213f5b">
                            <CalendarIcon className="h-4 w-4" />
                          </div>
                          <div className="ml-3">
                            <p className="text-xs text-gray-500">Date de naissance</p>
                            <p className="text-sm font-medium">{formatDate(contacts[selectedContact].dateOfBirth)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mt-0.5 bg-213f5b/10 p-1.5 rounded text-213f5b">
                            <MapPinIcon className="h-4 w-4" />
                          </div>
                          <div className="ml-3">
                            <p className="text-xs text-gray-500">Adresse</p>
                            <p className="text-sm font-medium">{contacts[selectedContact].mailingAddress || "Non disponible"}</p>
                          </div>
                        </div>
                      </div>
                      
                      {contacts[selectedContact].department && (
                        <div className="bg-gradient-to-br from-d2fcb2/30 to-d2fcb2/10 p-4 rounded-xl">
                          <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wider mb-3">Informations techniques</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Département:</span>
                              <span className="text-sm font-medium text-gray-800">{contacts[selectedContact].department}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Zone climatique:</span>
                              <span className="text-sm font-medium text-gray-800">{contacts[selectedContact].climateZone || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Éligibilité:</span>
                              <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${contacts[selectedContact].eligible === "oui" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {contacts[selectedContact].eligible === "oui" ? "Éligible" : "Non éligible"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Dossier N°:</span>
                              <span className="text-sm font-medium text-gray-800 font-mono">{contacts[selectedContact].numeroDossier || "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {contacts[selectedContact].comments && (
                        <div className="bg-white border border-gray-200 p-4 rounded-xl">
                          <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wider mb-2">Notes</h4>
                          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{contacts[selectedContact].comments}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-center pt-3">
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                          Modifier les informations
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Mobile Contact Info Modal */}
          <AnimatePresence>
            {showContactInfo && isMobileView && selectedContact && contacts[selectedContact] && (
              <motion.div
                className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden"
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="font-bold text-213f5b">Informations du client</h3>
                    <button 
                      onClick={toggleContactInfo}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="overflow-y-auto max-h-[calc(85vh-60px)]">
                    <div className="p-4 space-y-5">
                      {/* Same content as desktop with slight adjustments for mobile */}
                      <div className="flex flex-col items-center p-5 bg-gradient-to-br from-213f5b to-213f5b/80 text-white rounded-xl">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white text-xl font-bold text-213f5b mb-3 border-2 border-white shadow-md">
                          {getInitials(
                            contacts[selectedContact].firstName,
                            contacts[selectedContact].lastName
                          )}
                        </div>
                        <h2 className="text-xl font-bold">
                          {`${contacts[selectedContact].firstName} ${contacts[selectedContact].lastName}`}
                        </h2>
                        <p className="text-sm opacity-90">
                          {contacts[selectedContact].role || "Client"}
                        </p>
                        <div className="flex space-x-3 mt-4">
                          <a href={`tel:${contacts[selectedContact].phone}`} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                            <PhoneIcon className="h-5 w-5" />
                          </a>
                          <a href={`mailto:${contacts[selectedContact].email}`} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                            <EnvelopeIcon className="h-5 w-5" />
                          </a>
                          <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                            <CalendarIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                        <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wider">Coordonnées</h4>
                        
                        <div className="flex items-start">
                          <div className="mt-0.5 bg-213f5b/10 p-1.5 rounded text-213f5b">
                            <EnvelopeIcon className="h-4 w-4" />
                          </div>
                          <div className="ml-3">
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-medium">{contacts[selectedContact].email || "Non disponible"}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mt-0.5 bg-213f5b/10 p-1.5 rounded text-213f5b">
                            <PhoneIcon className="h-4 w-4" />
                          </div>
                          <div className="ml-3">
                            <p className="text-xs text-gray-500">Téléphone</p>
                            <p className="text-sm font-medium">{contacts[selectedContact].phone || "Non disponible"}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mt-0.5 bg-213f5b/10 p-1.5 rounded text-213f5b">
                            <CalendarIcon className="h-4 w-4" />
                          </div>
                          <div className="ml-3">
                            <p className="text-xs text-gray-500">Date de naissance</p>
                            <p className="text-sm font-medium">{formatDate(contacts[selectedContact].dateOfBirth)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mt-0.5 bg-213f5b/10 p-1.5 rounded text-213f5b">
                            <MapPinIcon className="h-4 w-4" />
                          </div>
                          <div className="ml-3">
                            <p className="text-xs text-gray-500">Adresse</p>
                            <p className="text-sm font-medium">{contacts[selectedContact].mailingAddress || "Non disponible"}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Technical info and comments - same as desktop */}
                      {contacts[selectedContact].department && (
                        <div className="bg-gradient-to-br from-d2fcb2/30 to-d2fcb2/10 p-4 rounded-xl">
                          <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wider mb-3">Informations techniques</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Département:</span>
                              <span className="text-sm font-medium text-gray-800">{contacts[selectedContact].department}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Zone climatique:</span>
                              <span className="text-sm font-medium text-gray-800">{contacts[selectedContact].climateZone || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Éligibilité:</span>
                              <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${contacts[selectedContact].eligible === "oui" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {contacts[selectedContact].eligible === "oui" ? "Éligible" : "Non éligible"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Dossier N°:</span>
                              <span className="text-sm font-medium text-gray-800 font-mono">{contacts[selectedContact].numeroDossier || "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {contacts[selectedContact].comments && (
                        <div className="bg-white border border-gray-200 p-4 rounded-xl">
                          <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wider mb-2">Notes</h4>
                          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{contacts[selectedContact].comments}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-center pt-3 pb-5">
                        <button className="px-4 py-2.5 bg-213f5b text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors w-full">
                          Modifier les informations
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
  
  function renderContactList(contactIds: string[]) {
    return contactIds.map((contactId) => {
      const contact = contacts[contactId];
      const msgs = conversations[contactId] || [];
      const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
      const unreadCount = getUnreadCount(contactId);
      const isSelected = selectedContact === contactId;
      const hasNew = hasNewMessages(msgs);
      const lastActivity = getLastActivityTime(msgs);
      const notificationCount = notifications[contactId] || 0;
      const isPinned = pinnedContacts.includes(contactId);
      
      return (
        <motion.div
          key={contactId}
          className={`p-3 mb-2 rounded-xl cursor-pointer transition-all ${
            isSelected 
              ? 'bg-213f5b text-white shadow-md' 
              : hasNew 
                ? 'bg-white shadow-sm border-l-4 border-213f5b hover:bg-gray-50'
                : 'bg-white shadow-sm hover:bg-gray-50'
          }`}
          whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedContact(contactId)}
          layout
        >
          <div className="flex items-center space-x-3">
            {contact ? (
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-medium flex-shrink-0 ${
                  isSelected ? 'bg-white text-213f5b' : 'bg-213f5b text-white'
                }`}>
                  {getInitials(contact.firstName, contact.lastName)}
                </div>
                {contact.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>
            ) : (
              <div className="relative">
                <UserCircleIcon className={`h-12 w-12 ${isSelected ? 'text-white' : 'text-213f5b'} flex-shrink-0`} />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className={`text-md font-semibold ${isSelected ? 'text-white' : hasNew ? 'text-213f5b' : 'text-gray-800'} truncate`}>
                  {contact ? `${contact.firstName} ${contact.lastName}` : contactId}
                </h3>
                <div className="flex items-center">
                  {isPinned && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-yellow-500'} mr-1`}>
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={`text-xs whitespace-nowrap ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                    {lastActivity ?? ""}
                  </span>
                </div>
              </div>
              
              <p className={`text-sm ${
                isSelected 
                  ? 'text-white/90' 
                  : hasNew 
                    ? 'font-medium text-gray-800' 
                    : 'text-gray-600'
              } truncate mt-1`}>
                {lastMsg 
                  ? lastMsg.type === "staff" 
                    ? `Vous: ${truncateText(lastMsg.message, 36)}` 
                    : truncateText(lastMsg.message, 40) 
                  : "Aucun message"
                }
              </p>
              
              <div className="flex justify-between items-center mt-1">
                <span className={`text-xs ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                  {lastMsg?.type === "staff" && (
                    <span className="flex items-center">
                      {lastMsg.status === "pending" ? (
                        <><ClockIcon className="h-3 w-3 mr-1" /> Envoi...</>
                      ) : lastMsg.status === "delivered" ? (
                        <><CheckIcon className="h-3 w-3 mr-1" /> Livré</>
                      ) : (
                        <><CheckCircleIcon className="h-3 w-3 mr-1" /> Lu</>
                      )}
                    </span>
                  )}
                </span>
                
                {(unreadCount > 0 || notificationCount > 0) && (
                  <span className={`${
                    isSelected ? 'bg-white text-213f5b' : 'bg-213f5b text-white'
                  } text-xs font-bold px-2 py-0.5 rounded-full`}>
                    {notificationCount || unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      );
    });
  }
}
