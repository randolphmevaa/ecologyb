"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { Header } from "@/components/Header";
import { useEffect, useState } from "react";

// Sample tickets data
const tickets = [
  {
    id: 1,
    ticketNumber: "TCK-2001",
    subject: "Problème d'installation de pompe à chaleur",
    solution: "Pompes à chaleur",
    status: "Ouvert",
    priority: "Haute",
    createdDate: "2025-02-01",
    description: "Le système ne démarre pas correctement après l'installation de la pompe à chaleur.",
    lastUpdate: "2025-02-02 14:30",
  },
  {
    id: 2,
    ticketNumber: "TCK-2002",
    subject: "Besoin d'assistance pour chauffe-eau solaire",
    solution: "Chauffe-eau solaire individuel",
    status: "En cours",
    priority: "Moyenne",
    createdDate: "2025-02-05",
    description: "Des erreurs apparaissent lors de la configuration initiale du chauffe-eau solaire.",
    lastUpdate: "2025-02-05 09:15",
  },
  {
    id: 3,
    ticketNumber: "TCK-2003",
    subject: "Question sur le système thermodynamique",
    solution: "Chauffe-eau thermodynamique",
    status: "Fermé",
    priority: "Faible",
    createdDate: "2025-01-28",
    description: "Demande de précisions sur la maintenance du système thermodynamique.",
    lastUpdate: "2025-01-29 16:45",
  },
  {
    id: 4,
    ticketNumber: "TCK-2004",
    subject: "Signalement d'un dysfonctionnement du système solaire combiné",
    solution: "Système Solaire Combiné",
    status: "Ouvert",
    priority: "Haute",
    createdDate: "2025-02-10",
    description: "Le système solaire combiné présente des fluctuations anormales de tension.",
    lastUpdate: "2025-02-10 11:20",
  },
];

const statusOptions = ["Tous", "Ouvert", "En cours", "Fermé"];
const priorityOptions = ["Tous", "Haute", "Moyenne", "Faible"];

export default function SAV() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Tous");
  const [selectedPriority, setSelectedPriority] = useState("Tous");

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "Tous" || ticket.status === selectedStatus;
    const matchesPriority = selectedPriority === "Tous" || ticket.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: string) => {
    const baseStyle = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case "Fermé": return `${baseStyle} bg-[#d2fcb2]/50 text-[#213f5b]`;
      case "En cours": return `${baseStyle} bg-[#bfddf9]/50 text-[#213f5b]`;
      default: return `${baseStyle} bg-white border border-[#213f5b]/20 text-[#213f5b]`;
    }
  };

  const getPriorityIcon = (priority: string) => {
    const iconStyle = "h-5 w-5";
    switch (priority) {
      case "Haute": return <ExclamationTriangleIcon className={`${iconStyle} text-red-600`} />;
      case "Moyenne": return <InformationCircleIcon className={`${iconStyle} text-[#213f5b]`} />;
      default: return <CheckCircleIcon className={`${iconStyle} text-[#213f5b]`} />;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6"
          style={{
            background: "linear-gradient(135deg, rgba(191,221,249,0.1) 0%, rgba(210,252,178,0.05) 100%)",
          }}>
          
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
                    <p className="text-[#bfddf9]">Notre équipe est à votre disposition pour toutes demandes d&apos;assistance</p>
                  </div>
                  <button onClick={() => setShowWelcome(false)} className="text-white opacity-80 hover:opacity-100">×</button>
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
              <h1 className="text-3xl font-bold text-[#213f5b]">
                Service Après-Vente
              </h1>
              <p className="text-gray-600">
                Gestion des demandes d&apos;assistance technique
              </p>
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
                {statusOptions.map(option => (
                  <option key={option} value={option}>Statut: {option}</option>
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
                {priorityOptions.map(option => (
                  <option key={option} value={option}>Priorité: {option}</option>
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
                          <h3 className="text-xl font-semibold text-[#213f5b]">{ticket.subject}</h3>
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
                          <span>{ticket.solution}</span>
                        </div>
                        {ticket.lastUpdate && (
                          <div className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            <span>Dernière mise à jour: {ticket.lastUpdate}</span>
                          </div>
                        )}
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
                <h3 className="text-xl font-semibold text-[#213f5b]">Aucun ticket trouvé</h3>
                <p className="mt-2 text-[#213f5b]/70">Essayez d&apos;ajuster vos filtres de recherche</p>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}