"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRightIcon,
  MapPinIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  // ClockIcon,
} from "@heroicons/react/24/outline";

// Sample tasks data for Technician / Jobs page
const tasks = [
  {
    id: 1,
    title: "Installation - Pompe à chaleur",
    location: "12 Rue de l'Énergie, Lyon",
    date: "2025-03-10",
    solution: "Pompes a chaleur",
    status: "Planifiée",
    details: "Installation complète avec configuration du système et test de performance.",
  },
  {
    id: 2,
    title: "Maintenance - Chauffe-eau solaire individuel",
    location: "34 Avenue du Soleil, Marseille",
    date: "2025-03-12",
    solution: "Chauffe-eau solaire individuel",
    status: "En cours",
    details: "Vérification du système et remplacement des composants défectueux.",
  },
  {
    id: 3,
    title: "Révision - Chauffe-eau thermodynamique",
    location: "56 Boulevard des Energies, Paris",
    date: "2025-03-15",
    solution: "Chauffe-eau thermodynamique",
    status: "Planifiée",
    details: "Inspection complète et optimisation des performances du système.",
  },
  {
    id: 4,
    title: "Intervention - Système Solaire Combiné",
    location: "78 Rue du Soleil, Nice",
    date: "2025-03-18",
    solution: "Système Solaire Combiné",
    status: "Planifiée",
    details: "Installation et configuration initiale du système solaire combiné.",
  },
];

export default function TechnicianTasks() {
  const [filter, setFilter] = useState("Tous");
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

  const filteredTasks = 
    filter === "Tous" 
      ? tasks 
      : tasks.filter(t => t.solution === filter);

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
                    <h2 className="text-xl font-bold">Planification des Interventions</h2>
                    <p className="text-[#bfddf9]">{currentDate} - Prêt pour une journée productive!</p>
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
                Gestion des Interventions
              </h1>
              <p className="text-gray-600">
                Suivi des installations et maintenances énergétiques
              </p>
            </motion.div>
          </div>

          <motion.div
            className="flex flex-wrap gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {["Tous", "Pompes a chaleur", "Chauffe-eau solaire individuel", "Chauffe-eau thermodynamique", "Système Solaire Combiné"].map((item) => (
              <motion.button
                key={item}
                whileHover={{ scale: 1.05 }}
                onClick={() => setFilter(item)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === item
                    ? "bg-[#213f5b] text-white"
                    : "bg-[#bfddf9]/30 text-[#213f5b] hover:bg-[#d2fcb2]/50"
                }`}
              >
                {item}
              </motion.button>
            ))}
          </motion.div>

          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-[#bfddf9]/20 hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#d2fcb2]/20">
                    <WrenchScrewdriverIcon className="h-6 w-6 text-[#213f5b]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-[#213f5b]">{task.title}</h2>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-[#213f5b]/80">
                        <MapPinIcon className="h-4 w-4" />
                        {task.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#213f5b]/80">
                        <CalendarIcon className="h-4 w-4" />
                        {task.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#213f5b]/80">
                        <SparklesIcon className="h-4 w-4" />
                        {task.solution}
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-[#213f5b]/90">{task.details}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.status === "En cours" ? "bg-[#bfddf9]/50 text-[#213f5b]" : "bg-[#d2fcb2]/50 text-[#213f5b]"
                    }`}>
                      {task.status}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center text-[#213f5b] text-sm font-medium mt-2"
                    >
                      Détails <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10 text-center text-[#213f5b]/80"
            >
              Aucune intervention planifiée pour ce filtre
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}