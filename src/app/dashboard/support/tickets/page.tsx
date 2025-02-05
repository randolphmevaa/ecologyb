"use client";

import { JSX, useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import {
  // ChatBubbleLeftRightIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

// Sample support tickets data
const tickets = [
  {
    id: 1,
    ticketNumber: "TCK-3001",
    subject: "Problème d'installation de pompe à chaleur",
    solution: "Pompes a chaleur",
    status: "Ouvert",
    priority: "Haute",
    createdDate: "2025-03-01",
    description:
      "Le système ne démarre pas correctement après l'installation de la pompe à chaleur. Le client signale une anomalie sur la température de sortie.",
  },
  {
    id: 2,
    ticketNumber: "TCK-3002",
    subject: "Assistance requise pour chauffe-eau solaire individuel",
    solution: "Chauffe-eau solaire individuel",
    status: "En cours",
    priority: "Moyenne",
    createdDate: "2025-03-02",
    description:
      "Le client rencontre des erreurs lors de la configuration du chauffe-eau solaire individuel et demande un suivi technique.",
  },
  {
    id: 3,
    ticketNumber: "TCK-3003",
    subject: "Demande de renseignements sur le chauffe-eau thermodynamique",
    solution: "Chauffe-eau thermodynamique",
    status: "Résolu",
    priority: "Faible",
    createdDate: "2025-02-28",
    description:
      "Le client a demandé des précisions sur les conditions d'entretien du chauffe-eau thermodynamique.",
  },
  {
    id: 4,
    ticketNumber: "TCK-3004",
    subject: "Dysfonctionnement signalé sur le système solaire combiné",
    solution: "Système Solaire Combiné",
    status: "Ouvert",
    priority: "Haute",
    createdDate: "2025-03-03",
    description:
      "Le système solaire combiné affiche des fluctuations anormales et nécessite une intervention rapide.",
  },
];

// Helper functions for status badges and priority icons
const getStatusBadge = (status: string): string => {
  switch (status) {
    case "Résolu":
      return "bg-green-100 text-green-700";
    case "En cours":
      return "bg-yellow-100 text-yellow-700";
    case "Ouvert":
    default:
      return "bg-red-100 text-red-700";
  }
};

const getPriorityIcon = (priority: string): JSX.Element => {
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


export default function SupportTicketsDashboard() {
  const [filter, setFilter] = useState("Tous");

  const filteredTickets =
    filter === "Tous"
      ? tickets
      : tickets.filter((ticket) => ticket.solution === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      {/* Common Header */}
      <Header user={{ name: "Support Rep", avatar: "/support-avatar.png" }} />

      <main className="max-w-7xl mx-auto p-6">
        {/* Hero / Page Title */}
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
            Gérez et suivez vos tickets d&apos;assistance pour nos solutions énergétiques spécialisées.
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
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {ticket.subject}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Ticket {ticket.ticketNumber} • Créé le {ticket.createdDate}
                  </p>
                  <p className="mt-2 text-gray-600">{ticket.description}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(ticket.priority)}
                    <span className="text-sm text-gray-500">
                      Priorité: {ticket.priority}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center text-green-600 font-medium"
                  >
                    Voir Détails{" "}
                    <ChevronRightIcon className="h-5 w-5 ml-1" />
                  </motion.button>
                </div>
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
