"use client";

import { useState, useEffect, useRef } from "react";
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
  ArrowLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  MapPinIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import { Header } from "@/components/Header";

interface Message {
  type: "assistant" | "user" | "staff";
  message: string;
  timestamp?: string;
  contactId?: string;
  status?: "pending" | "delivered";
  read?: boolean; // Added to track if a message has been read
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
  const [conversations, setConversations] = useState<{ [contactId: string]: Message[] }>({});
  const [contacts, setContacts] = useState<{ [contactId: string]: Contact }>({});
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const requestedContacts = useRef<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  let roomId = "";
  const proInfoStr = localStorage.getItem("proInfo");
  if (proInfoStr) {
    try {
      const proInfo = JSON.parse(proInfoStr);
      if (proInfo._id) {
        roomId = proInfo._id;
      }
    } catch (error) {
      console.error("Erreur lors du parsing de proInfo depuis localStorage", error);
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (selectedContact && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations, selectedContact]);

  useEffect(() => {
    if (!roomId) {
      console.warn("Aucune salle spécifiée dans proInfo");
      return;
    }
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
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    Object.keys(conversations).forEach((contactId) => {
      if (!requestedContacts.current.has(contactId)) {
        requestedContacts.current.add(contactId);
        fetch(`/api/contacts/${contactId}`)
          .then((res) => res.json())
          .then((data: Contact) => {
            setContacts((prev) => ({ ...prev, [contactId]: data }));
          })
          .catch(console.error);
      }
    });
  }, [conversations]);

  useEffect(() => {
    if (!roomId) return;

    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
      query: { role: "staff", room: roomId },
    });
    socketRef.current = socket;

    socket.on("clientMessage", (data: ClientMessage) => {
      const newMsg: Message = {
        type: "user",
        message: data.text,
        timestamp: new Date().toLocaleTimeString(),
        contactId: data.contactId,
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
  }, [roomId]);

  useEffect(() => {
    if (selectedContact && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedContact]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedContact) return;
    const messageTexte = input;
    const newMsg: Message = {
      type: "staff",
      message: messageTexte,
      timestamp: new Date().toLocaleTimeString(),
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
          time: new Date().toLocaleTimeString(),
        }),
      });
      
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
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du message:", error);
    }
  };

  const getUnreadCount = (contactId: string) => {
    const msgs = conversations[contactId] || [];
    return msgs.filter(msg => msg.type === "user" && !msg.read).length;
  };

  const filteredContactIds = Object.keys(conversations).filter((contactId) => {
    const contact = contacts[contactId];
    if (!contact) return true;
    const fullName = `${contact.firstName} ${contact.lastName}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const currentMessages = selectedContact ? conversations[selectedContact] || [] : [];

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

  const toggleContactInfo = () => {
    setShowContactInfo(!showContactInfo);
  };

  const showContactsList = !selectedContact || !isMobileView;
  const showConversation = selectedContact && (!isMobileView || !showContactsList);

  const hasNewMessages = (msgs: Message[]) => {
    return msgs.some(msg => msg.type === "user" && !msg.read);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getLastActivityTime = (msgs: Message[]) => {
    if (msgs.length === 0) return null;
    const lastMsg = msgs[msgs.length - 1];
    return lastMsg.timestamp;
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          {/* Panel de liste des contacts */}
          {showContactsList && (
            <motion.div
              className={`${isMobileView ? 'w-full' : 'w-1/3 lg:w-1/4'} flex flex-col border-r border-gray-200 bg-white`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 border-b border-gray-200 bg-gradient-to-br from-bfddf9 to-white">
                <h2 className="text-2xl font-bold text-213f5b mb-4">Messagerie</h2>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher un contact..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-bfddf9 transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2">
                {filteredContactIds.length > 0 ? (
                  filteredContactIds.map((contactId) => {
                    const contact = contacts[contactId];
                    const msgs = conversations[contactId] || [];
                    const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
                    const unreadCount = getUnreadCount(contactId);
                    const isSelected = selectedContact === contactId;
                    const hasNew = hasNewMessages(msgs);
                    const lastActivity = getLastActivityTime(msgs);
                    
                    return (
                      <motion.div
                        key={contactId}
                        className={`p-3 mb-2 rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-d2fcb2 bg-opacity-30 border-l-4 border-d2fcb2' 
                            : hasNew 
                              ? 'border-l-4 border-213f5b bg-white hover:bg-gray-50'
                              : 'hover:bg-gray-50'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => setSelectedContact(contactId)}
                      >
                        <div className="flex items-center space-x-3">
                          {contact ? (
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-213f5b font-medium flex-shrink-0">
                              {getInitials(contact.firstName, contact.lastName)}
                            </div>
                          ) : (
                            <UserCircleIcon className="h-12 w-12 text-213f5b flex-shrink-0" />
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className={`text-md font-semibold ${hasNew ? 'text-213f5b' : 'text-gray-800'} truncate`}>
                                {contact ? `${contact.firstName} ${contact.lastName}` : contactId}
                              </h3>
                              <span className="text-xs text-gray-500 whitespace-nowrap ml-1">
                                {lastActivity ?? ""}
                              </span>
                            </div>
                            
                            <p className={`text-sm ${hasNew ? 'font-medium text-gray-800' : 'text-gray-600'} truncate mt-1`}>
                              {lastMsg ? truncateText(lastMsg.message, 40) : "Aucun message"}
                            </p>
                            
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-gray-500">
                                {lastMsg?.type === "staff" && (
                                  <span className="flex items-center">
                                    {lastMsg.status === "pending" ? (
                                      <><ClockIcon className="h-3 w-3 mr-1" /> Envoi...</>
                                    ) : (
                                      <><CheckIcon className="h-3 w-3 mr-1" /> Livré</>
                                    )}
                                  </span>
                                )}
                              </span>
                              
                              {unreadCount > 0 && (
                                <span className="bg-213f5b text-white text-xs font-bold px-2 py-1 rounded-full">
                                  {unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
                    <ChatBubbleLeftRightIcon className="h-16 w-16 mb-4 text-bfddf9" />
                    <p className="text-center font-medium">Aucune conversation trouvée</p>
                    {searchTerm && <p className="text-sm mt-2">Essayez de modifier votre recherche</p>}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Panel de conversation */}
          {showConversation && (
            <motion.div 
              className="flex-1 flex flex-col bg-gradient-to-br from-bfddf9 to-white bg-opacity-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* En-tête de contact */}
              <div className="sticky top-0 p-4 border-b border-gray-200 bg-white shadow-sm flex items-center justify-between">
                <div className="flex items-center">
                  {isMobileView && (
                    <button 
                      onClick={() => setSelectedContact(null)}
                      className="mr-3 p-1 rounded-full hover:bg-gray-100"
                    >
                      <ArrowLeftIcon className="h-5 w-5 text-213f5b" />
                    </button>
                  )}
                  
                  {contacts[selectedContact] ? (
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-213f5b font-medium mr-3">
                        {getInitials(contacts[selectedContact].firstName, contacts[selectedContact].lastName)}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-213f5b">
                          {`${contacts[selectedContact].firstName} ${contacts[selectedContact].lastName}`}
                        </h2>
                        <p className="text-xs text-gray-500 flex items-center">
                          <div className="flex items-center mr-3">
                            <EnvelopeIcon className="h-3 w-3 mr-1" />
                            {truncateText(contacts[selectedContact].email || "Non disponible", 20)}
                          </div>
                          {contacts[selectedContact].phone && (
                            <div className="flex items-center">
                              <PhoneIcon className="h-3 w-3 mr-1" />
                              {contacts[selectedContact].phone}
                            </div>
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
                
                <div className="flex items-center">
                  {contacts[selectedContact] && (
                    <button 
                      onClick={toggleContactInfo}
                      className={`p-2 rounded-full mr-2 ${showContactInfo ? 'bg-d2fcb2 text-213f5b' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex-1 flex overflow-hidden">
                {/* Zone de messages */}
                <div className={`${showContactInfo && !isMobileView ? 'w-2/3' : 'w-full'} flex flex-col`}>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {currentMessages.length > 0 ? (
                      currentMessages.map((msg, index) => {
                        const isStaff = msg.type === "staff";
                        return (
                          <motion.div
                            key={index}
                            className={`flex ${isStaff ? "justify-end" : "justify-start"}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03, duration: 0.2 }}
                          >
                            <div
                              className={`p-3 rounded-lg max-w-xs lg:max-w-md ${
                                isStaff 
                                  ? "bg-[#213f5b] text-white rounded-br-none shadow-md" 
                                  : "bg-[#d2fcb2] text-gray-800 rounded-bl-none shadow-sm"
                              }`}
                            >
                              <p className="text-sm">{msg.message}</p>
                              <div className={`text-xs mt-1 flex justify-end items-center ${isStaff ? "text-blue-100" : "text-gray-500"}`}>
                                {formatTime(msg.timestamp)}
                                {isStaff && msg.status && (
                                  <span className="ml-2 flex items-center">
                                    {msg.status === "pending" ? (
                                      <ClockIcon className="h-3 w-3 ml-1" />
                                    ) : (
                                      <CheckIcon className="h-3 w-3 ml-1" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-500 p-6">
                        <ChatBubbleLeftRightIcon className="h-20 w-20 mb-4 text-bfddf9" />
                        <p className="font-medium text-lg">Aucun message</p>
                        <p className="text-sm mt-2 text-center">Envoyez un message pour démarrer la conversation</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Zone de saisie */}
                  <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex items-center bg-gray-100 rounded-full px-4 py-1">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Tapez votre message..."
                        className="flex-1 bg-transparent py-2 focus:outline-none text-gray-800"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!input.trim()}
                        className={`ml-2 p-2 rounded-full transition-colors ${
                          input.trim() 
                            ? "bg-[#213f5b] text-white hover:bg-opacity-90" 
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <PaperAirplaneIcon className="h-5 w-5 transform -rotate-90" />
                      </button>
                    </div>
                  </div>
                </div>
                {/* Panneau d'informations du contact pour desktop */}
                {showContactInfo && !isMobileView && selectedContact && contacts[selectedContact] && (
                  <div className="w-1/3 border-l border-gray-200 bg-white overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-bold text-213f5b">Informations du client</h3>
                      <button 
                        onClick={toggleContactInfo}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <XMarkIcon className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      <div className="flex flex-col items-center p-4 bg-bfddf9 bg-opacity-10 rounded-lg">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-213f5b text-xl font-bold mb-3">
                          {getInitials(
                            contacts[selectedContact].firstName,
                            contacts[selectedContact].lastName
                          )}
                        </div>
                        <h2 className="text-xl font-bold text-213f5b">
                          {`${contacts[selectedContact].firstName} ${contacts[selectedContact].lastName}`}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {contacts[selectedContact].role || "Client"}
                        </p>
                      </div>
                      
                      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start">
                          <EnvelopeIcon className="h-5 w-5 text-213f5b mr-3 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm">{contacts[selectedContact].email || "Non disponible"}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <PhoneIcon className="h-5 w-5 text-213f5b mr-3 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Téléphone</p>
                            <p className="text-sm">{contacts[selectedContact].phone || "Non disponible"}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <CalendarIcon className="h-5 w-5 text-213f5b mr-3 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Date de naissance</p>
                            <p className="text-sm">{formatDate(contacts[selectedContact].dateOfBirth)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <MapPinIcon className="h-5 w-5 text-213f5b mr-3 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Adresse</p>
                            <p className="text-sm">{contacts[selectedContact].mailingAddress || "Non disponible"}</p>
                          </div>
                        </div>
                      </div>
                      
                      {contacts[selectedContact].department && (
                        <div className="bg-d2fcb2 bg-opacity-20 p-4 rounded-lg">
                          <h4 className="font-medium text-213f5b mb-2">Informations techniques</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Département:</span>
                              <span className="text-sm font-medium">{contacts[selectedContact].department}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Zone climatique:</span>
                              <span className="text-sm font-medium">{contacts[selectedContact].climateZone || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Éligibilité:</span>
                              <span className={`text-sm font-medium ${contacts[selectedContact].eligible === "oui" ? "text-green-600" : "text-red-600"}`}>
                                {contacts[selectedContact].eligible === "oui" ? "Éligible" : "Non éligible"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Dossier N°:</span>
                              <span className="text-sm font-medium">{contacts[selectedContact].numeroDossier || "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {contacts[selectedContact].comments && (
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <h4 className="font-medium text-213f5b mb-2">Notes</h4>
                          <p className="text-sm text-gray-700">{contacts[selectedContact].comments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Panneau d'informations en mode mobile (modal) */}
          <AnimatePresence>
            {showContactInfo && isMobileView && selectedContact && contacts[selectedContact] && (
              <motion.div
                className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto"
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                >
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="font-bold text-213f5b">Informations du client</h3>
                    <button 
                      onClick={toggleContactInfo}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <XMarkIcon className="h-6 w-6 text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    {/* Même contenu que le panneau latéral */}
                    <div className="flex flex-col items-center p-4 bg-bfddf9 bg-opacity-10 rounded-lg">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center bg-213f5b text-white text-xl font-bold mb-3">
                        {getInitials(
                          contacts[selectedContact].firstName,
                          contacts[selectedContact].lastName
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-213f5b">
                        {`${contacts[selectedContact].firstName} ${contacts[selectedContact].lastName}`}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {contacts[selectedContact].role || "Client"}
                      </p>
                    </div>
                    
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <EnvelopeIcon className="h-5 w-5 text-213f5b mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm">{contacts[selectedContact].email || "Non disponible"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <PhoneIcon className="h-5 w-5 text-213f5b mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Téléphone</p>
                          <p className="text-sm">{contacts[selectedContact].phone || "Non disponible"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <CalendarIcon className="h-5 w-5 text-213f5b mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Date de naissance</p>
                          <p className="text-sm">{formatDate(contacts[selectedContact].dateOfBirth)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <MapPinIcon className="h-5 w-5 text-213f5b mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Adresse</p>
                          <p className="text-sm">{contacts[selectedContact].mailingAddress || "Non disponible"}</p>
                        </div>
                      </div>
                    </div>
                    
                    {contacts[selectedContact].department && (
                      <div className="bg-d2fcb2 bg-opacity-20 p-4 rounded-lg">
                        <h4 className="font-medium text-213f5b mb-2">Informations techniques</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Département:</span>
                            <span className="text-sm font-medium">{contacts[selectedContact].department}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Zone climatique:</span>
                            <span className="text-sm font-medium">{contacts[selectedContact].climateZone || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Éligibilité:</span>
                            <span className={`text-sm font-medium ${contacts[selectedContact].eligible === "oui" ? "text-green-600" : "text-red-600"}`}>
                              {contacts[selectedContact].eligible === "oui" ? "Éligible" : "Non éligible"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Dossier N°:</span>
                            <span className="text-sm font-medium">{contacts[selectedContact].numeroDossier || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {contacts[selectedContact].comments && (
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-213f5b mb-2">Notes</h4>
                        <p className="text-sm text-gray-700">{contacts[selectedContact].comments}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </div>
    </div>
  );
}
