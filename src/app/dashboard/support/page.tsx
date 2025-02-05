"use client";

import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// Sample statistics for support tickets
const stats = [
  {
    name: "Tickets Ouverts",
    value: "32",
    icon: ChatBubbleLeftRightIcon,
    trend: "5.2%",
    positive: true,
    description: "Cette semaine",
  },
  {
    name: "Tickets En Cours",
    value: "18",
    icon: ClockIcon,
    trend: "3.1%",
    positive: false,
    description: "Cette semaine",
  },
  {
    name: "Tickets Résolus",
    value: "47",
    icon: CheckCircleIcon,
    trend: "10.5%",
    positive: true,
    description: "Ce mois-ci",
  },
];

// Sample recent tickets data
const recentTickets = [
  {
    id: 1,
    subject: "Problème d'installation de pompe à chaleur",
    solution: "Pompes a chaleur",
    status: "Ouvert",
    createdDate: "2025-02-10",
  },
  {
    id: 2,
    subject: "Assistance pour chauffe-eau solaire individuel",
    solution: "Chauffe-eau solaire individuel",
    status: "En cours",
    createdDate: "2025-02-09",
  },
  {
    id: 3,
    subject: "Signalement d'une erreur système",
    solution: "Chauffe-eau thermodynamique",
    status: "Résolu",
    createdDate: "2025-02-08",
  },
];

// Sample energy solutions offered by the company
const solutions = [
  { name: "Pompes a chaleur" },
  { name: "Chauffe-eau solaire individuel" },
  { name: "Chauffe-eau thermodynamique" },
  { name: "Système Solaire Combiné" },
];

export default function SupportDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      {/* Consistent header */}
      <Header user={{ name: "Support Rep", avatar: "/support-avatar.png" }} />

      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">Accueil Support</h1>
          <p className="mt-2 text-lg text-gray-600">
            Vue d&apos;ensemble de vos tickets d&apos;assistance et performances pour nos solutions énergétiques spécialisées.
          </p>
        </motion.div>

        {/* Dashboard Statistics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.name}
              className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center">
                <stat.icon className="h-10 w-10 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
                </div>
              </div>
              <p
                className={`mt-2 text-sm ${
                  stat.positive ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.trend} {stat.positive ? "↑" : "↓"} {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Tickets Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Tickets Récents
          </h2>
          <div className="space-y-4">
            {recentTickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow flex items-center justify-between"
                whileHover={{ scale: 1.01 }}
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {ticket.subject}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Solution: {ticket.solution} • Créé le {ticket.createdDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      ticket.status === "Résolu"
                        ? "bg-green-100 text-green-700"
                        : ticket.status === "En cours"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center text-green-600 font-medium"
                  >
                    Voir <ChevronRightIcon className="h-5 w-5 ml-1" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Energy Solutions Overview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-10"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Solutions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
              >
                <p className="text-lg font-medium text-gray-800">
                  {solution.name}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
