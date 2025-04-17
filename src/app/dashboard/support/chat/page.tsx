"use client";

import { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChatBubbleBottomCenterTextIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Header } from "@/components/Header";

interface Message {
  type: "assistant" | "user" | "staff";
  message: string;
  timestamp?: string;
  contactId?: string;
  status?: "pending" | "delivered"; // "pending" = Envoi..., "delivered" = Livré
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

interface ServerMessage {
  sender: "client" | "staff";
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
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const requestedContacts = useRef<Set<string>>(new Set());

  // Retrieve roomId from localStorage
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

  // Auto-scroll when messages update or a conversation is opened
  useEffect(() => {
    if (selectedContact && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations, selectedContact]);

  // Fetch conversation messages via the API and group by contactId
  useEffect(() => {
    if (!roomId) {
      console.warn("Aucune salle spécifiée dans proInfo");
      return;
    }
    fetch(`/api/messages?room=${roomId}`)
      .then((res) => res.json())
      .then((data: ServerMessage[]) => {
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
  }, [roomId, selectedContact]);

  // Fetch contact details for each conversation
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

  // Configure Socket.IO connection for real-time messaging
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
        if (!conv[data.contactId]) {
          conv[data.contactId] = [];
        }
        conv[data.contactId] = [...conv[data.contactId], newMsg];
        return conv;
      });
    });

    socket.on("connect_error", (err) => {
      console.error("Erreur de connexion :", err);
    });

    socket.on("disconnect", (reason) => {
      console.warn("Déconnexion du socket :", reason);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  // Message send function
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

    // Update conversation locally (local echo)
    setConversations((prev) => {
      const conv = { ...prev };
      if (!conv[selectedContact]) {
        conv[selectedContact] = [];
      }
      conv[selectedContact] = [...conv[selectedContact], newMsg];
      return conv;
    });
    setInput("");

    // Send message via Socket.IO
    if (socketRef.current) {
      socketRef.current.emit("staffMessage", { text: messageTexte, contactId: selectedContact, room: roomId });
    }

    // Persist the message on the backend and update its status
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
        const msgs = conv[selectedContact];
        if (msgs && msgs.length > 0) {
          const lastIndex = msgs.length - 1;
          if (msgs[lastIndex].type === "staff" && msgs[lastIndex].status === "pending") {
            msgs[lastIndex].status = "delivered";
          }
        }
        return conv;
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du message :", error);
    }
  };

  // Filter conversations based on search term (by contact name)
  const filteredContactIds = Object.keys(conversations).filter((contactId) => {
    const contact = contacts[contactId];
    if (!contact) return true;
    const fullName = `${contact.firstName} ${contact.lastName}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const currentMessages = selectedContact ? conversations[selectedContact] || [] : [];

  return (
    <div className="flex h-screen bg-gradient-to-b from-gray-100 to-gray-50">
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          {/* Presentation section */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-800">Tableau de bord des messages</h1>
            <p className="mt-4 text-lg text-gray-700">
              Gérez vos conversations avec vos clients en toute simplicité.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            className="relative max-w-md mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher des contacts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </motion.div>

          {/* Conversation list */}
          <motion.div
            className="grid gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {filteredContactIds.map((contactId) => {
              const contact = contacts[contactId];
              const msgs = conversations[contactId];
              const lastMsg = msgs && msgs.length > 0 ? msgs[msgs.length - 1] : null;
              return (
                <motion.div
                  key={contactId}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-transform duration-300 border border-gray-200 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedContact(contactId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <ChatBubbleBottomCenterTextIcon className="h-10 w-10 text-blue-600" />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {contact ? `${contact.firstName} ${contact.lastName}` : contactId}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {lastMsg ? lastMsg.message : "Aucun message pour l'instant."}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{lastMsg ? lastMsg.timestamp : ""}</p>
                      {lastMsg && lastMsg.type === "user" && (
                        <span className="inline-block mt-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Nouveau
                        </span>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="mt-4 flex items-center text-blue-600 font-medium"
                      >
                        Voir <ChevronRightIcon className="ml-1 h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {filteredContactIds.length === 0 && (
              <div className="text-center text-gray-500 mt-10">
                Aucune conversation trouvée.
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Conversation modal */}
      <AnimatePresence>
        {selectedContact && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6 relative flex flex-col"
              initial={{ y: "100vh" }}
              animate={{ y: 0 }}
              exit={{ y: "100vh" }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              {/* Sticky header with avatar */}
              <div className="sticky top-0 bg-white z-10 border-b pb-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserCircleIcon className="h-10 w-10 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    {contacts[selectedContact]
                      ? `${contacts[selectedContact].firstName} ${contacts[selectedContact].lastName}`
                      : selectedContact}
                  </h2>
                </div>
                <button onClick={() => setSelectedContact(null)}>
                  <XMarkIcon className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {/* Conversation area */}
              <div className="flex-1 space-y-4 max-h-80 overflow-y-auto pr-2">
                {currentMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    className={`flex ${msg.type === "staff" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <motion.div
                      className={`p-3 rounded-lg max-w-xs ${
                        msg.type === "staff" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      {msg.timestamp && (
                        <p className="text-xs mt-1 text-right">
                          {msg.timestamp}
                          {msg.type === "staff" && msg.status && (
                            <span className="ml-2">
                              {msg.status === "pending" ? "Envoi..." : "Livré"}
                            </span>
                          )}
                        </p>
                      )}
                    </motion.div>
                  </motion.div>
                ))}
                {/* End element for auto-scroll */}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input area */}
              <div className="mt-4 border-t pt-4 flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Tapez un message en tant que membre du personnel..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  onClick={sendMessage}
                  className="ml-4 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <PaperAirplaneIcon className="h-5 w-5 transform -rotate-90" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
