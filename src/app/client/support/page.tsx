"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from 'react';
import {
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  // CheckCircleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  // ClockIcon,
  TagIcon,
  MapPinIcon,
  UserIcon,
  PaperAirplaneIcon,
  // CheckIcon,
  // ExclamationCircleIcon,
  // DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { Header } from "@/components/Header";
import { useEffect, useState, JSX } from "react";
import { TicketIcon } from "lucide-react";

{/* Type definitions */}
interface PriorityBadgeProps {
  priority: string;
}

interface ConversationMessage {
  message: string;
  sender: string;
  timestamp: number; // or string if that's what you use
}


interface StatusBadgeProps {
  status: string;
}

// interface InfoSectionProps {
//   title: string;
//   content: string;
//   icon: React.ReactNode;
//   multiline?: boolean;
// }

interface IconProps {
  className?: string;
}

// Define the type for the ticket as returned by your API.
interface ApiTicket {
  conversation: ConversationMessage[];
  _id: string;
  ticket: string;
  status: string;
  priority: string;
  contactId: string;
  customerFirstName: string;
  customerLastName: string;
  problem: string;
  notes: string;
  technicianId: string;
  technicianFirstName: string;
  technicianLastName: string;
  createdAt: string;
  end: string;
  location: string;
  participants: string;
  start: string;
  title: string;
  type: string;
}

// Define the UI ticket type.
interface Ticket {
  // customerPhone: any;
  title: string;
  ticket: string;
  type: string;
  notes: string;
  location: string;
  createdAt: string | number | Date;
  start: string | number | Date;
  end: string | number | Date;
  participants: string;
  technicianFirstName: string;
  technicianLastName: string;
  customerFirstName: string;
  customerLastName: string;
  problem: string;
  id: string;
  ticketNumber: string;
  subject: string;
  solution: string;
  status: string;
  priority: string;
  createdDate: string;
  description: string;
  lastUpdate: string;
  conversation: ConversationMessage[];
}

// Transformation function to convert an API ticket into the UI ticket.
function transformTicket(realTicket: ApiTicket): Ticket {
  return {
    id: realTicket._id,
    title: realTicket.title,
    ticket: realTicket.ticket,
    type: realTicket.type,
    conversation: realTicket.conversation,
    ticketNumber: realTicket.ticket,
    problem: realTicket.problem,
    location: realTicket.location,
    notes: realTicket.notes,
    technicianFirstName: realTicket.technicianFirstName,
    technicianLastName: realTicket.technicianLastName,
    customerFirstName: realTicket.customerFirstName,
    customerLastName: realTicket.customerLastName,
    createdAt: realTicket.createdAt,
    start: realTicket.start,
    end: realTicket.end,
    participants: realTicket.participants,
    subject: realTicket.title || realTicket.problem,
    solution: realTicket.type || "",
    status:
      realTicket.status === "closed"
        ? "Fermé"
        : realTicket.status === "in progress"
        ? "En cours"
        : "Ouvert",
    priority:
      realTicket.priority === "low"
        ? "Faible"
        : realTicket.priority === "medium"
        ? "Moyenne"
        : "Haute",
    createdDate: realTicket.createdAt
      ? new Date(realTicket.createdAt).toLocaleDateString("fr-FR")
      : "",
    description: realTicket.notes,
    lastUpdate: realTicket.end
      ? new Date(realTicket.end).toLocaleString("fr-FR")
      : "",
  };
}

const statusOptions = ["Tous", "Ouvert", "En cours", "Fermé"];
const priorityOptions = ["Tous", "Haute", "Moyenne", "Faible"];


{/* Component for Priority Badge */}
const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getPriorityColor = (priority: string): string => {
    switch (priority.toLowerCase()) {
      case 'haute':
      case 'high':
      case 'urgent':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
      case 'moyenne':
      case 'medium':
      case 'normal':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
      case 'basse':
      case 'low':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(priority)}`}>
      {priority}
    </span>
  );
};

{/* Component for Status Badge */}
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'ouvert':
      case 'open':
      case 'nouveau':
      case 'new':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
      case 'en cours':
      case 'in progress':
        return 'bg-purple-500/20 text-purple-600 dark:text-purple-400';
      case 'résolu':
      case 'resolved':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
      case 'fermé':
      case 'closed':
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
      case 'attente':
      case 'waiting':
      case 'pending':
        return 'bg-orange-500/20 text-orange-600 dark:text-orange-400';
      default:
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

{/* Component for Info Section */}
// const InfoSection: React.FC<InfoSectionProps> = ({ title, content, icon, multiline = false }) => {
//   return (
//     <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
//       <div className="flex items-center gap-2 mb-2">
//         {icon}
//         <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
//       </div>
//       <div className={multiline ? "whitespace-pre-line" : ""}>
//         <p className="text-gray-900 dark:text-gray-100">{content}</p>
//       </div>
//     </div>
//   );
// };

{/* Icons - simplified versions for the example */}
const ExclamationCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DocumentTextIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CalendarIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function SAV() {
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("Tous");
  const [selectedPriority, setSelectedPriority] = useState<string>("Tous");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [contactId, setContactId] = useState<string>("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [mapType, setMapType] = useState('roadmap');
  // const [showStreetView, setShowStreetView] = useState(false);

  // Retrieve clientInfo from localStorage to get contactId.
  useEffect(() => {
    const clientInfoStr = localStorage.getItem("clientInfo");
    if (clientInfoStr) {
      try {
        const clientInfo = JSON.parse(clientInfoStr);
        // Extract contactId from the nested contact object.
        const id = clientInfo.contact?.contactId;
        if (id) {
          setContactId(id);
        }
      } catch (err) {
        console.error("Error parsing clientInfo from localStorage:", err);
      }
    }
  }, []);

  // Hide the welcome message after 5 seconds.
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch tickets from the API once we have a contactId.
  useEffect(() => {
    if (!contactId) return;
    async function fetchTickets() {
      try {
        const res = await fetch(`/api/tickets?contactId=${contactId}`);
        const data: ApiTicket[] = await res.json();
        const transformedTickets = data.map(transformTicket);
        setTickets(transformedTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    }
    fetchTickets();
  }, [contactId]);

  // Filter tickets based on search query, status, and priority.
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "Tous" || ticket.status === selectedStatus;
    const matchesPriority = selectedPriority === "Tous" || ticket.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: string): string => {
    const baseStyle = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case "Fermé":
        return `${baseStyle} bg-[#d2fcb2]/50 text-[#213f5b]`;
      case "En cours":
        return `${baseStyle} bg-[#bfddf9]/50 text-[#213f5b]`;
      default:
        return `${baseStyle} bg-white border border-[#213f5b]/20 text-[#213f5b]`;
    }
  };

  const getPriorityIcon = (priority: string): JSX.Element => {
    const iconStyle = "h-5 w-5";
    switch (priority) {
      case "Haute":
        return <ExclamationTriangleIcon className={`${iconStyle} text-red-600`} />;
      case "Moyenne":
        return <InformationCircleIcon className={`${iconStyle} text-[#213f5b]`} />;
      default:
        return <CheckCircleIcon className={`${iconStyle} text-[#213f5b]`} />;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main
          className="flex-1 overflow-y-auto px-8 py-6 space-y-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(191,221,249,0.1) 0%, rgba(210,252,178,0.05) 100%)",
          }}
        >
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#213f5b] to-[#213f5b]/80 text-white shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0, padding: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Support Technique Énergétique</h2>
                    <p className="text-[#bfddf9]">
                      Notre équipe est à votre disposition pour toutes demandes d&apos;assistance
                    </p>
                  </div>
                  <button
                    onClick={() => setShowWelcome(false)}
                    className="text-white opacity-80 hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center mb-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-[#213f5b]">Service Après-Vente</h1>
              <p className="text-gray-600">Gestion des demandes d&apos;assistance technique</p>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-[#213f5b] text-white rounded-lg shadow hover:shadow-md hover:bg-[#213f5b]/90 flex items-center gap-2"
            >
              Nouveau Ticket
              <ChevronRightIcon className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Filters Section */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-[#213f5b]/70" />
              <input
                type="text"
                placeholder="Rechercher un ticket..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#bfddf9]/30 focus:outline-none focus:ring-2 focus:ring-[#213f5b]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <FunnelIcon className="h-5 w-5 absolute left-3 top-3 text-[#213f5b]/70" />
              <select
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#bfddf9]/30 text-[#213f5b] focus:outline-none focus:ring-2 focus:ring-[#213f5b]"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    Statut: {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <TagIcon className="h-5 w-5 absolute left-3 top-3 text-[#213f5b]/70" />
              <select
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#bfddf9]/30 text-[#213f5b] focus:outline-none focus:ring-2 focus:ring-[#213f5b]"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                {priorityOptions.map((option) => (
                  <option key={option} value={option}>
                    Priorité: {option}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Tickets List */}
          <motion.div className="space-y-4">
            <AnimatePresence>
              {filteredTickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.005 }}
                  transition={{ duration: 0.2 }}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-[#bfddf9]/20 hover:border-[#d2fcb2]/50 transition-all"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-[#bfddf9]/30 rounded-lg">
                          <ChatBubbleLeftRightIcon className="h-8 w-8 text-[#213f5b]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-[#213f5b]">
                            {ticket.subject}
                          </h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className={getStatusBadge(ticket.status)}>
                              {ticket.status}
                            </span>
                            <span className="flex items-center gap-1 px-3 py-1 bg-[#213f5b]/10 rounded-full text-sm text-[#213f5b]">
                              {getPriorityIcon(ticket.priority)}
                              {ticket.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedTicket(ticket)}
                        className="px-4 py-2 bg-[#213f5b] text-white rounded-lg flex items-center gap-2 hover:bg-[#213f5b]/90 text-sm"
                      >
                        Détails
                        <ChevronRightIcon className="h-4 w-4" />
                      </motion.button>
                    </div>

                    <div className="mt-4 pl-14 space-y-2 text-sm text-[#213f5b]/80">
                      <p>{ticket.description}</p>
                      <div className="flex flex-wrap gap-4 mt-3">
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>Créé le {ticket.createdDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TagIcon className="h-4 w-4" />
                          <span>{ticket.problem}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>
                            Dernière mise à jour:{" "}
                            {ticket.lastUpdate
                              ? ticket.lastUpdate
                              : "Aucune mise à jour récente"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredTickets.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="mx-auto max-w-md">
                <ChatBubbleLeftRightIcon className="h-20 w-20 text-[#213f5b]/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#213f5b]">
                  Aucun ticket trouvé
                </h3>
                <p className="mt-2 text-[#213f5b]/70">
                  Essayez d&apos;ajuster vos filtres de recherche
                </p>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Enhanced Modal for Ticket Details */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop with improved blur effect */}
            <motion.div 
              className="absolute inset-0 bg-black/60 backdrop-blur-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedTicket(null)}
            />
            
            <motion.div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl relative z-10 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with enhanced gradient background */}
              <div className="bg-gradient-to-r from-[#0f2947] via-[#1a365d] to-[#2c4f76] p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                    <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                      <circle id="pattern-circle" cx="20" cy="20" r="4" fill="#fff"></circle>
                    </pattern>
                    <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
                  </svg>
                </div>
                
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/15 p-2.5 rounded-xl shadow-sm backdrop-blur-sm">
                      <TicketIcon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white truncate">
                      {selectedTicket.subject || selectedTicket.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="text-white hover:text-[#d2fcb2] transition-colors focus:outline-none focus:ring-2 focus:ring-[#bfddf9] focus:ring-offset-2 focus:ring-offset-[#213f5b] rounded-full p-1"
                    aria-label="Close"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="bg-white/20 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10 shadow-sm">
                    #{selectedTicket.ticketNumber || selectedTicket.ticket}
                  </span>
                  <PriorityBadge priority={selectedTicket.priority} />
                  <StatusBadge status={selectedTicket.status} />
                  <span className="flex items-center text-white/90 text-sm ml-auto backdrop-blur-sm bg-white/10 px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    {new Date(selectedTicket.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
              
              {/* Content with refined design */}
              <div className="p-0 max-h-[70vh] overflow-y-auto bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
                  {/* Left Column - 3/5 width */}
                  <div className="md:col-span-3 p-6 space-y-6 bg-white border-r border-gray-100">
                    <div className="flex items-center space-x-3 mb-5 pb-2 border-b border-gray-100">
                      <DocumentTextIcon className="h-5 w-5 text-[#1a365d]" />
                      <h3 className="text-lg font-semibold text-gray-800">Détails du Ticket</h3>
                    </div>
                    
                    {/* Problem Card - Redesigned */}
                    <div className="bg-gradient-to-br from-[#bfddf9]/10 to-[#bfddf9]/5 p-5 rounded-2xl border border-[#bfddf9]/30 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-br from-[#1a365d] to-[#213f5b] rounded-full p-3 shadow-md flex-shrink-0">
                          <ExclamationCircleIcon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[#1a365d] font-semibold text-lg flex items-center">
                            Problème
                            <span className="ml-2 text-xs bg-[#1a365d]/10 text-[#1a365d] px-2 py-0.5 rounded-full">Signalé</span>
                          </h3>
                          <div className="text-gray-700 mt-3 p-3 bg-white/80 rounded-xl border border-[#bfddf9]/20">
                            {selectedTicket.problem}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Solution Card - Redesigned */}
                    <div className="bg-gradient-to-br from-[#d2fcb2]/15 to-[#d2fcb2]/5 p-5 rounded-2xl border border-[#d2fcb2]/30 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-br from-[#2e5e3a] to-[#3d7a4c] rounded-full p-3 shadow-md flex-shrink-0">
                          <CheckCircleIcon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[#2e5e3a] font-semibold text-lg flex items-center">
                            Solution / Type
                            <span className="ml-2 text-xs bg-[#2e5e3a]/10 text-[#2e5e3a] px-2 py-0.5 rounded-full">Proposé</span>
                          </h3>
                          <div className="text-gray-700 mt-3 p-3 bg-white/80 rounded-xl border border-[#d2fcb2]/20">
                            {selectedTicket.solution || selectedTicket.type || "Aucun type défini pour ce ticket."}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Notes Card - Redesigned */}
                    <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-full p-3 shadow-md flex-shrink-0">
                          <DocumentTextIcon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-gray-700 font-semibold text-lg flex items-center">
                            Notes
                            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Informations</span>
                          </h3>
                          <div className="text-gray-700 mt-3 p-3 bg-white rounded-xl border border-gray-200 whitespace-pre-line">
                            {selectedTicket.description || selectedTicket.notes || "Aucune note disponible."}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Map Section if location exists */}
                    {selectedTicket.location && (
                      <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 relative">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="bg-gradient-to-br from-[#1a365d] to-[#213f5b] rounded-full p-3 shadow-md flex-shrink-0">
                            <MapPinIcon className="h-5 w-5 text-white" />
                          </div>
                          <div className="w-full">
                            <h3 className="text-[#1a365d] font-semibold text-lg flex items-center">
                              Adresse
                              <span className="ml-2 text-xs bg-[#1a365d]/10 text-[#1a365d] px-2 py-0.5 rounded-full">Localisation</span>
                            </h3>
                            <div className="flex items-center mt-3">
                              <div className="flex-grow">
                                <p className="text-gray-700 font-medium p-3 bg-white/80 rounded-xl border border-gray-200">{selectedTicket.location}</p>
                              </div>

                            </div>
                          </div>
                        </div>
                        
                        {/* Map Container */}
                        <div className="relative">
                          {/* Map View Options */}
                          <div className="absolute top-3 right-3 z-10 bg-white rounded-lg shadow-md border border-gray-200 flex overflow-hidden">
                            <button 
                              className="p-2 hover:bg-gray-100 transition-colors border-r border-gray-200 focus:outline-none active:bg-gray-200"
                              onClick={() => setMapType('roadmap')}
                              title="Vue standard"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1a365d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                              </svg>
                            </button>
                            <button 
                              className="p-2 hover:bg-gray-100 transition-colors focus:outline-none active:bg-gray-200"
                              onClick={() => setMapType('satellite')}
                              title="Vue satellite"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1a365d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          </div>
                          
                          {/* Google Maps iframe */}
                          <div className="h-72 w-full rounded-xl overflow-hidden border border-gray-200 shadow-md">
                            <iframe 
                              width="100%" 
                              height="100%" 
                              frameBorder="0" 
                              scrolling="no"
                              src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedTicket.location)}&t=${mapType === 'satellite' ? 'k' : 'm'}&z=16&ie=UTF8&iwloc=&output=embed`} 
                              style={{ border: 0 }}
                              title="Client Location"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>
                        
                        {/* Action Buttons - Enhanced */}
                        <div className="flex flex-wrap gap-3 mt-4">
                          <a 
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedTicket.location)}&travelmode=driving`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#1a365d] to-[#213f5b] text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all active:scale-98 transform shadow-sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Itinéraire
                          </a>
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedTicket.location)}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#1a365d] text-[#1a365d] py-3 px-4 rounded-xl hover:bg-gray-50 transition-all active:scale-98 transform hover:shadow-md shadow-sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Voir sur Google Maps
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Right Column - 2/5 width */}
                  <div className="md:col-span-2 bg-gray-50 p-6 space-y-6">
                    {/* Timeline Card - Redesigned */}
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <h3 className="flex items-center text-[#1a365d] font-semibold text-lg mb-5 pb-2 border-b border-gray-100">
                        <CalendarIcon className="h-5 w-5 mr-2" /> Chronologie
                      </h3>
                      
                      <div className="space-y-5">
                        <div className="relative pl-8 before:content-[''] before:absolute before:left-3 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-[#bfddf9] before:to-[#bfddf9]/30">
                          <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-gradient-to-br from-[#bfddf9] to-[#8cb8d8] shadow-md flex items-center justify-center">
                            <CalendarIcon className="h-3 w-3 text-white" />
                          </div>
                          <div className="bg-white/50 p-3 rounded-xl border border-[#bfddf9]/20">
                            <p className="text-sm font-medium text-[#1a365d]">Créé le</p>
                            <p className="text-sm text-gray-700">
                              {selectedTicket.createdDate || new Date(selectedTicket.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative pl-8 before:content-[''] before:absolute before:left-3 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-[#bfddf9]/30 before:to-[#d2fcb2]">
                          <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-gradient-to-br from-[#d2fcb2] to-[#a5e08d] shadow-md flex items-center justify-center">
                            <ClockIcon className="h-3 w-3 text-[#2e5e3a]" />
                          </div>
                          <div className="bg-white/50 p-3 rounded-xl border border-[#d2fcb2]/20">
                            <p className="text-sm font-medium text-[#2e5e3a]">Rendez-vous</p>
                            <p className="text-sm text-gray-700">
                              {selectedTicket.start && selectedTicket.end 
                                ? `${new Date(selectedTicket.start).toLocaleString('fr-FR')} - ${new Date(selectedTicket.end).toLocaleTimeString('fr-FR')}`
                                : "Aucun rendez-vous planifié"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative pl-8">
                          <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-gradient-to-br from-[#1a365d] to-[#213f5b] shadow-md flex items-center justify-center">
                            <UserIcon className="h-3 w-3 text-white" />
                          </div>
                          <div className="bg-white/50 p-3 rounded-xl border border-[#1a365d]/10">
                            <p className="text-sm font-medium text-[#1a365d]">Participants</p>
                            <p className="text-sm text-gray-700">
                              {selectedTicket.participants || `${selectedTicket.technicianFirstName} ${selectedTicket.technicianLastName} & ${selectedTicket.customerFirstName} ${selectedTicket.customerLastName}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Conditionally render Conversation Box if conversation exists and has messages */}
                    {selectedTicket.conversation && selectedTicket.conversation.length > 0 && (
                      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#0f2947] via-[#1a365d] to-[#2c4f76] p-4 relative overflow-hidden">
                          <div className="absolute inset-0 opacity-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                              <pattern id="pattern-circles-conv" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                                <circle id="pattern-circle-conv" cx="20" cy="20" r="4" fill="#fff"></circle>
                              </pattern>
                              <rect id="rect-conv" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles-conv)"></rect>
                            </svg>
                          </div>
                          <h3 className="text-white font-semibold flex items-center relative z-10">
                            <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                            Conversation
                          </h3>
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto p-4 bg-gray-50 space-y-4">
                          {selectedTicket.conversation.map((msg, index) => {
                            if (!msg.message || !msg.sender) return null;
                            
                            const isTechnician = msg.sender === "technicien";
                            return (
                              <div key={index} className={`flex ${isTechnician ? 'justify-start' : 'justify-end'}`}>
                                <div className={`relative max-w-xs sm:max-w-sm rounded-2xl px-4 py-3 ${
                                  isTechnician 
                                    ? 'bg-white border border-[#bfddf9]/50 text-gray-800 rounded-tl-none shadow-sm ml-2' 
                                    : 'bg-gradient-to-r from-[#1a365d] to-[#213f5b] text-white rounded-tr-none shadow-sm mr-2'
                                }`}>
                                  {isTechnician && (
                                    <div className="absolute -left-2 top-0 w-0 h-0 border-t-8 border-r-8 border-transparent border-r-white"></div>
                                  )}
                                  {!isTechnician && (
                                    <div className="absolute -right-2 top-0 w-0 h-0 border-t-8 border-l-8 border-transparent border-l-[#1a365d]"></div>
                                  )}
                                  <div className="text-xs mb-1 font-medium flex items-center gap-2">
                                    {isTechnician && (
                                      <div className="h-5 w-5 rounded-full bg-[#1a365d] flex items-center justify-center flex-shrink-0">
                                        <UserIcon className="h-3 w-3 text-white" />
                                      </div>
                                    )}
                                    <span>
                                      {isTechnician 
                                        ? `${selectedTicket.technicianFirstName} ${selectedTicket.technicianLastName}` 
                                        : `${selectedTicket.customerFirstName} ${selectedTicket.customerLastName}`}
                                    </span>
                                    {!isTechnician && (
                                      <div className="h-5 w-5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                        <UserIcon className="h-3 w-3 text-[#1a365d]" />
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-sm">{msg.message}</p>
                                  <div className={`text-xs text-right mt-1 ${isTechnician ? 'text-gray-500' : 'text-white/75'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="p-4 border-t border-gray-100 bg-white">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 relative rounded-xl border border-gray-200 overflow-hidden hover:border-[#1a365d]/30 focus-within:border-[#1a365d] transition-colors shadow-sm">
                              <input 
                                type="text" 
                                placeholder="Tapez votre message..." 
                                className="flex-1 w-full px-4 py-3 focus:outline-none focus:ring-0 bg-transparent" 
                              />
                              <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#1a365d] text-white p-2 rounded-lg hover:bg-[#213f5b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:ring-offset-2">
                                <PaperAirplaneIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Documents and Attachments Section - New */}
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                      <div className="bg-gradient-to-r from-[#0f2947] via-[#1a365d] to-[#2c4f76] p-4 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                            <pattern id="pattern-circles-docs" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                              <circle id="pattern-circle-docs" cx="20" cy="20" r="4" fill="#fff"></circle>
                            </pattern>
                            <rect id="rect-docs" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles-docs)"></rect>
                          </svg>
                        </div>
                        <h3 className="text-white font-semibold flex items-center relative z-10">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Documents
                        </h3>
                      </div>
                      
                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-[#1a365d]/30 transition-colors cursor-pointer group">
                          <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-[#1a365d]/10 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 group-hover:text-[#1a365d] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#1a365d] transition-colors">Rapport_Technique.pdf</h4>
                            <p className="text-xs text-gray-500">PDF - 2.4 MB</p>
                          </div>
                          <button className="p-1.5 text-gray-400 hover:text-[#1a365d] rounded-full hover:bg-[#1a365d]/10 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-[#1a365d]/30 transition-colors cursor-pointer group">
                          <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-[#1a365d]/10 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 group-hover:text-[#1a365d] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#1a365d] transition-colors">Photo_Installation.jpg</h4>
                            <p className="text-xs text-gray-500">Image - 1.8 MB</p>
                          </div>
                          <button className="p-1.5 text-gray-400 hover:text-[#1a365d] rounded-full hover:bg-[#1a365d]/10 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Upload new document button */}
                        <button className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-gray-300 rounded-xl text-[#1a365d] hover:bg-[#1a365d]/5 hover:border-[#1a365d]/30 transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span>Ajouter un document</span>
                        </button>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
              
              {/* Footer with action buttons */}
              <div className="border-t border-gray-200 p-5 flex flex-wrap justify-between items-center bg-white gap-4">
                <div className="text-sm flex flex-wrap items-center gap-3">
                  <span className="bg-[#1a365d] text-white px-3 py-1.5 rounded-full shadow-sm">
                    ID: {selectedTicket.ticketNumber || selectedTicket.ticket}
                  </span>
                  <span className="text-gray-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
                  </span>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
