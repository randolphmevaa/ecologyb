"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  // ChevronRightIcon,
  ClipboardDocumentCheckIcon,
  MapPinIcon,
  CalendarIcon,
  // SparklesIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

// Sample tasks data for the PM Tasks page
const tasks = [
  {
    id: 1,
    title: "Planification - Installation Pompe à chaleur",
    solution: "Pompes a chaleur",
    location: "12 Rue de l'Énergie, Lyon",
    dueDate: "2025-03-20",
    status: "En cours",
    description:
      "Préparation des ressources et planning pour l'installation d'une pompe à chaleur pour Client X.",
  },
  {
    id: 2,
    title: "Coordination - Maintenance Chauffe-eau solaire individuel",
    solution: "Chauffe-eau solaire individuel",
    location: "34 Avenue du Soleil, Marseille",
    dueDate: "2025-03-22",
    status: "Planifiée",
    description:
      "Organisation de la maintenance du chauffe-eau solaire individuel pour Client Y, incluant vérification des équipements.",
  },
  {
    id: 3,
    title: "Supervision - Révision Chauffe-eau thermodynamique",
    solution: "Chauffe-eau thermodynamique",
    location: "56 Boulevard des Energies, Paris",
    dueDate: "2025-03-25",
    status: "En cours",
    description:
      "Suivi de la révision complète du chauffe-eau thermodynamique pour Client Z afin d'optimiser le rendement.",
  },
  {
    id: 4,
    title: "Planification - Installation Système Solaire Combiné",
    solution: "Système Solaire Combiné",
    location: "78 Rue du Soleil, Nice",
    dueDate: "2025-03-28",
    status: "Planifiée",
    description:
      "Coordination des équipes pour l'installation initiale du système solaire combiné dans un complexe résidentiel.",
  },
];

export default function PMTasks() {
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
                    <h2 className="text-xl font-bold">Gestion des Tâches Énergétiques</h2>
                    <p className="text-[#bfddf9]">{currentDate} - Suivi des opérations techniques</p>
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
                Coordination des Tâches
              </h1>
              <p className="text-gray-600">
                Planification et suivi des opérations techniques
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

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-[#bfddf9]/20 hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-[#d2fcb2]/20">
                    <ClipboardDocumentCheckIcon className="h-6 w-6 text-[#213f5b]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[#213f5b]">{task.title}</h2>
                    <div className="mt-1 flex items-center gap-2 text-sm text-[#213f5b]/80">
                      <MapPinIcon className="h-4 w-4" />
                      {task.location}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-[#213f5b]/80">
                    <span>Échéance</span>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      {task.dueDate}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-[#213f5b]/80">
                    <span>Statut</span>
                    <span className={`px-2 py-1 rounded-full ${
                      task.status === "En cours" ? "bg-[#bfddf9]/50" : "bg-[#d2fcb2]/50"
                    }`}>
                      {task.status}
                    </span>
                  </div>

                  <p className="text-sm text-[#213f5b]/90">{task.description}</p>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    className="w-full py-2 px-4 bg-[#213f5b] text-white rounded-lg text-sm hover:bg-[#213f5b]/90 flex items-center justify-center gap-2"
                  >
                    <ChartBarIcon className="h-4 w-4" />
                    Suivi détaillé
                  </motion.button>
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
              Aucune tâche trouvée pour ce filtre
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}