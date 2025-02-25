"use client";

import { motion } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { Header } from "@/components/Header";

// Business colors
const colors = {
  white: "#ffffff",
  lightBlue: "#bfddf9",
  lightGreen: "#d2fcb2",
  darkBlue: "#213f5b",
};

// Sample tickets data
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

// Helper function for status badge styles
const getStatusBadge = (status: string) => {
  let bgColor, textColor;
  if (status === "Fermé") {
    bgColor = colors.lightGreen;
    textColor = colors.darkBlue;
  } else if (status === "En cours") {
    bgColor = colors.lightBlue;
    textColor = colors.darkBlue;
  } else {
    bgColor = colors.lightBlue;
    textColor = colors.darkBlue;
  }
  return { bgColor, textColor };
};

// Helper function for priority icons
const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "Haute":
      return <ExclamationTriangleIcon className="h-5 w-5" style={{ color: colors.darkBlue }} />;
    case "Moyenne":
      return <InformationCircleIcon className="h-5 w-5" style={{ color: colors.darkBlue }} />;
    case "Faible":
    default:
      return <CheckCircleIcon className="h-5 w-5" style={{ color: colors.darkBlue }} />;
  }
};

export default function SAV() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(to bottom, ${colors.white}, ${colors.lightGreen}20)`,
      }}
    >
      {/* Navigation Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold" style={{ color: colors.darkBlue }}>
            S.A.V – Service Après-Vente
          </h1>
          <p className="mt-3 text-lg" style={{ color: colors.darkBlue, opacity: 0.8 }}>
            Gérez vos demandes d&apos;assistance pour nos solutions énergétiques de façon rapide et simple.
          </p>
        </motion.div>

        {/* Tickets List */}
        <div className="space-y-8">
          {tickets.map((ticket) => {
            const { bgColor, textColor } = getStatusBadge(ticket.status);
            return (
              <motion.div
                key={ticket.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: `0 12px 30px -5px ${colors.darkBlue}20`,
                }}
                transition={{ duration: 0.3 }}
                className="p-8 rounded-xl border"
                style={{
                  background: colors.white,
                  borderImage: `linear-gradient(45deg, ${colors.lightBlue}, ${colors.lightGreen}) 1`,
                  borderWidth: "1px",
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-5">
                    <ChatBubbleLeftRightIcon className="h-10 w-10" style={{ color: colors.darkBlue }} />
                    <div>
                      <h2 className="text-2xl font-semibold" style={{ color: colors.darkBlue }}>
                        {ticket.subject}
                      </h2>
                      <p className="text-sm mt-1" style={{ color: colors.darkBlue, opacity: 0.75 }}>
                        Ticket {ticket.ticketNumber} • Créé le {ticket.createdDate}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span
                      className="px-4 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: bgColor, color: textColor }}
                    >
                      {ticket.status}
                    </span>
                  </div>
                </div>

                <p className="mt-6 text-base" style={{ color: colors.darkBlue, opacity: 0.85 }}>
                  {ticket.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(ticket.priority)}
                    <span className="text-sm" style={{ color: colors.darkBlue, opacity: 0.75 }}>
                      Priorité: {ticket.priority}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center font-medium px-5 py-2 rounded-full shadow focus:outline-none"
                    style={{
                      backgroundColor: colors.darkBlue,
                      color: colors.white,
                    }}
                  >
                    Voir Détails
                    <ChevronRightIcon className="h-5 w-5 ml-2" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* No Tickets Message (if needed) */}
        {tickets.length === 0 && (
          <div className="mt-12 text-center text-xl font-medium" style={{ color: colors.darkBlue, opacity: 0.7 }}>
            Aucun ticket trouvé.
          </div>
        )}
      </main>
    </div>
  );
}
