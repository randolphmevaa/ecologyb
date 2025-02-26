"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  // ChevronRightIcon,
  SparklesIcon,
  MapPinIcon,
  CalendarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

// Sample projects data for the PM Projects page
const projects = [
  {
    id: 1,
    title: "Installation - Pompe à chaleur - Client X",
    solution: "Pompes a chaleur",
    status: "En cours",
    progress: 70,
    dueDate: "2025-03-25",
    location: "Paris",
    description:
      "Installation complète avec configuration et tests finaux pour optimiser le chauffage.",
  },
  {
    id: 2,
    title: "Maintenance - Chauffe-eau solaire individuel - Client Y",
    solution: "Chauffe-eau solaire individuel",
    status: "Planifié",
    progress: 40,
    dueDate: "2025-03-28",
    location: "Paris",
    description:
      "Vérification du système, remplacement des composants défectueux et contrôle de performance.",
  },
  {
    id: 3,
    title: "Révision - Chauffe-eau thermodynamique - Client Z",
    solution: "Chauffe-eau thermodynamique",
    status: "En cours",
    progress: 85,
    location: "Paris",
    dueDate: "2025-03-22",
    description:
      "Inspection complète et optimisation du système thermodynamique pour améliorer l'efficacité énergétique.",
  },
  {
    id: 4,
    title: "Installation - Système Solaire Combiné - Client A",
    solution: "Système Solaire Combiné",
    status: "Planifié",
    progress: 25,
    dueDate: "2025-03-30",
    location: "Paris",
    description:
      "Déploiement initial et configuration du système solaire combiné dans un complexe résidentiel.",
  },
];

export default function PMProjects() {
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

  const filteredProjects = 
    filter === "Tous" 
      ? projects 
      : projects.filter(p => p.solution === filter);

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
                    <h2 className="text-xl font-bold">Gestion des Projets Énergétiques</h2>
                    <p className="text-[#bfddf9]">{currentDate} - Suivi des installations en cours</p>
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
                Projets d&apos;Installation
              </h1>
              <p className="text-gray-600">
                Coordination des déploiements de solutions écologiques
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
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-[#bfddf9]/20 hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-[#bfddf9]/20">
                    <SparklesIcon className="h-6 w-6 text-[#213f5b]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[#213f5b]">{project.title}</h2>
                    <div className="mt-1 flex items-center gap-2 text-sm text-[#213f5b]/80">
                      <MapPinIcon className="h-4 w-4" />
                      {project.location}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-[#213f5b]/80">
                    <span>Statut</span>
                    <span className={`px-2 py-1 rounded-full ${
                      project.status === "En cours" ? "bg-[#bfddf9]/50" : "bg-[#d2fcb2]/50"
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-[#213f5b]/80">
                      <span>Progression</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-[#bfddf9]/20 rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full bg-[#213f5b]"
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>

                  <p className="text-sm text-[#213f5b]/90">{project.description}</p>

                  <div className="flex items-center justify-between text-sm text-[#213f5b]/80">
                    <span>Échéance</span>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      {project.dueDate}
                    </div>
                  </div>

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

          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10 text-center text-[#213f5b]/80"
            >
              Aucun projet trouvé pour ce filtre
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}