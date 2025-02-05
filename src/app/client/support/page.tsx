"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

// Sample support tickets data
const tickets = [
  {
    id: 1,
    ticketNumber: "TCK-2001",
    subject: "Problème d'installation de pompe à chaleur",
    solution: "Pompes a chaleur",
    status: "Ouvert",
    priority: "Haute",
    createdDate: "2025-02-01",
    description:
      "Le système ne démarre pas correctement après l'installation de la pompe à chaleur.",
  },
  {
    id: 2,
    ticketNumber: "TCK-2002",
    subject: "Besoin d'assistance pour chauffe-eau solaire",
    solution: "Chauffe-eau solaire individuel",
    status: "En cours",
    priority: "Moyenne",
    createdDate: "2025-02-05",
    description:
      "Des erreurs apparaissent lors de la configuration initiale du chauffe-eau solaire.",
  },
  {
    id: 3,
    ticketNumber: "TCK-2003",
    subject: "Question sur le système thermodynamique",
    solution: "Chauffe-eau thermodynamique",
    status: "Fermé",
    priority: "Faible",
    createdDate: "2025-01-28",
    description:
      "Demande de précisions sur la maintenance du système thermodynamique.",
  },
  {
    id: 4,
    ticketNumber: "TCK-2004",
    subject: "Signalement d'un dysfonctionnement du système solaire combiné",
    solution: "Système Solaire Combiné",
    status: "Ouvert",
    priority: "Haute",
    createdDate: "2025-02-10",
    description:
      "Le système solaire combiné présente des fluctuations anormales de tension.",
  },
];

export default function ClientSupport() {
  const [filter, setFilter] = useState("Tous");

  // Filter tickets by energy solution type (or show all)
  const filteredTickets =
    filter === "Tous"
      ? tickets
      : tickets.filter((ticket) => ticket.solution === filter);

  // Helper function for status badge colors
  const getStatusBadge = (status: string): string => {
    switch (status) {
      case "Fermé":
        return "bg-green-100 text-green-700";
      case "En cours":
        return "bg-yellow-100 text-yellow-700";
      case "Ouvert":
      default:
        return "bg-red-100 text-red-700";
    }
  };

  // Helper function for priority icons
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "Haute":
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      case "Moyenne":
        return <InformationCircleIcon className="h-5 w-5 text-yellow-600" />;
      case "Faible":
      default:
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Header for consistent navigation */}
      <Header user={{ name: "Client", avatar: "/client-avatar.png" }} />

      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-800">
            Support &amp; Tickets
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Consultez et gérez vos tickets d&apos;assistance pour nos solutions
            énergétiques spécialisées.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap gap-4 mb-8 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[
            "Tous",
            "Pompes a chaleur",
            "Chauffe-eau solaire individuel",
            "Chauffe-eau thermodynamique",
            "Système Solaire Combiné",
          ].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                filter === item
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-green-50"
              }`}
            >
              {item}
            </button>
          ))}
        </motion.div>

        {/* Tickets List */}
        <div className="space-y-6">
          {filteredTickets.map((ticket) => (
            <motion.div
              key={ticket.id}
              className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-600" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {ticket.subject}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Ticket {ticket.ticketNumber} • Créé le {ticket.createdDate}
                    </p>
                  </div>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600">
                {ticket.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getPriorityIcon(ticket.priority)}
                  <span className="text-sm text-gray-500">
                    Priorité: {ticket.priority}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center text-green-600 font-medium"
                >
                  Voir Détails{" "}
                  <ChevronRightIcon className="h-5 w-5 ml-1" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Tickets Message */}
        {filteredTickets.length === 0 && (
          <div className="mt-10 text-center text-gray-500">
            Aucun ticket trouvé pour ce filtre.
          </div>
        )}
      </main>
    </div>
  );
}
