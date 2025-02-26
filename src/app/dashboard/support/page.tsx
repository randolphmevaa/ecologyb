"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  // UserCircleIcon,
  TagIcon,
  LifebuoyIcon,
  SparklesIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const stats = [
  {
    name: "Tickets Ouverts",
    value: "32",
    icon: ChatBubbleLeftRightIcon,
    trend: "5.2%",
    positive: true,
    description: "Cette semaine",
    color: "from-[#d2fcb2]/20 to-[#bfddf9]/30",
  },
  {
    name: "Tickets En Cours",
    value: "18",
    icon: ClockIcon,
    trend: "3.1%",
    positive: false,
    description: "Cette semaine",
    color: "from-[#bfddf9]/20 to-[#d2fcb2]/30",
  },
  {
    name: "Tickets Résolus",
    value: "47",
    icon: CheckCircleIcon,
    trend: "10.5%",
    positive: true,
    description: "Ce mois-ci",
    color: "from-[#d2fcb2]/10 via-[#bfddf9]/20 to-[#d2fcb2]/10",
  },
];

// Sample statistics for support tickets
// const stats = [
//   {
//     name: "Tickets Ouverts",
//     value: "32",
//     icon: ChatBubbleLeftRightIcon,
//     trend: "5.2%",
//     positive: true,
//     description: "Cette semaine",
//   },
//   {
//     name: "Tickets En Cours",
//     value: "18",
//     icon: ClockIcon,
//     trend: "3.1%",
//     positive: false,
//     description: "Cette semaine",
//   },
//   {
//     name: "Tickets Résolus",
//     value: "47",
//     icon: CheckCircleIcon,
//     trend: "10.5%",
//     positive: true,
//     description: "Ce mois-ci",
//   },
// ];

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
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    } as const;
    setCurrentDate(now.toLocaleDateString('fr-FR', options));
    
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

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
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Centre de Support Énergétique</h2>
                    <p className="text-[#bfddf9]">{currentDate} - Prêt à assister nos clients!</p>
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
                Tableau de Bord Support
              </h1>
              <p className="text-gray-600">
                Gestion des tickets d&apos;assistance pour solutions écologiques
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <motion.div
                className="grid grid-cols-1 gap-5 md:grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {stats.map((stat) => (
                  <motion.div
                    key={stat.name}
                    className={`p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br ${stat.color} border border-[#bfddf9]/30`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm font-medium text-[#213f5b]">{stat.name}</p>
                      <div className="p-2 rounded-full bg-white/60">
                        <stat.icon className="h-5 w-5 text-[#213f5b]" />
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-2xl font-bold text-[#213f5b]">{stat.value}</p>
                      <p className={`text-sm flex items-center gap-1 ${stat.positive ? 'text-[#213f5b]' : 'text-red-600'}`}>
                        {stat.trend} {stat.positive ? "↑" : "↓"}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bfddf9]/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="p-5 border-b border-[#bfddf9]/20 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[#213f5b]">Tickets Récents</h2>
                  <button className="px-3 py-1 bg-[#213f5b] text-white rounded-lg text-sm hover:bg-[#213f5b]/90">
                    + Nouveau Ticket
                  </button>
                </div>
                <div className="divide-y divide-[#bfddf9]/20">
                  {recentTickets.map((ticket) => (
                    <motion.div
                      key={ticket.id}
                      className="p-4 hover:bg-[#d2fcb2]/5 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="text-base font-semibold text-[#213f5b]">
                            {ticket.subject}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-[#213f5b]/80">
                            <TagIcon className="h-4 w-4" />
                            {ticket.solution}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#213f5b]/80">
                            <CalendarIcon className="h-4 w-4" />
                            Créé le {ticket.createdDate}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ticket.status === "Résolu" ? 'bg-[#d2fcb2]/50 text-[#213f5b]' :
                            ticket.status === "En cours" ? 'bg-[#bfddf9]/50 text-[#213f5b]' :
                            'bg-[#213f5b]/10 text-[#213f5b]'
                          }`}>
                            {ticket.status}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center text-[#213f5b] text-sm font-medium"
                          >
                            Détails <ChevronRightIcon className="h-4 w-4 ml-1" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-6">
              <motion.div
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bfddf9]/20"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="p-5 border-b border-[#bfddf9]/20">
                  <h2 className="text-xl font-bold text-[#213f5b]">Solutions Supportées</h2>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                  {solutions.map((solution, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 rounded-lg bg-[#bfddf9]/10 hover:bg-[#d2fcb2]/20 transition-colors text-center"
                    >
                      <SparklesIcon className="h-6 w-6 text-[#213f5b] mx-auto mb-2" />
                      <span className="text-sm font-medium text-[#213f5b]">
                        {solution.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-[#d2fcb2]/20 to-[#bfddf9]/20 rounded-xl shadow-sm overflow-hidden border border-[#d2fcb2]/30"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="p-5 border-b border-[#d2fcb2]/30 flex items-center gap-3">
                  <div className="p-2 bg-[#d2fcb2]/30 rounded-full">
                    <LifebuoyIcon className="h-5 w-5 text-[#213f5b]" />
                  </div>
                  <h2 className="text-lg font-bold text-[#213f5b]">Conseils Rapides</h2>
                </div>
                <div className="p-5 text-sm text-[#213f5b]/80 space-y-3">
                  <p>✅ Vérifiez toujours la garantie avant de planifier une intervention</p>
                  <p>📞 Priorisez les appels concernant les systèmes de chauffage en hiver</p>
                  <p>🌱 Suggestiez des contrats de maintenance annuelle</p>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}