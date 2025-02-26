"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  BriefcaseIcon,
  ClipboardDocumentCheckIcon,
  CalendarIcon,
  // ChevronRightIcon,
  ChartBarIcon,
  UsersIcon,
  // ClockIcon,
  SparklesIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

const stats = [
  {
    name: "Projets Actifs",
    value: "15",
    icon: BriefcaseIcon,
    trend: "12%",
    positive: true,
    description: "Ce mois-ci",
    color: "from-[#d2fcb2]/20 to-[#bfddf9]/30",
  },
  {
    name: "Tâches En Cours",
    value: "28",
    icon: ClipboardDocumentCheckIcon,
    trend: "5%",
    positive: false,
    description: "Cette semaine",
    color: "from-[#bfddf9]/20 to-[#d2fcb2]/30",
  },
  {
    name: "Interventions",
    value: "8",
    icon: CalendarIcon,
    trend: "10%",
    positive: true,
    description: "Prochaines 48h",
    color: "from-[#d2fcb2]/10 via-[#bfddf9]/20 to-[#d2fcb2]/10",
  },
];

const projects = [
  {
    id: 1,
    title: "Installation - Pompe à chaleur - Client X",
    solution: "Pompes a chaleur",
    status: "En cours",
    progress: 65,
    dueDate: "2025-03-20",
  },
  {
    id: 2,
    title: "Maintenance - Chauffe-eau solaire individuel - Client Y",
    solution: "Chauffe-eau solaire individuel",
    status: "Planifié",
    progress: 30,
    dueDate: "2025-03-22",
  },
  {
    id: 3,
    title: "Révision - Chauffe-eau thermodynamique - Client Z",
    solution: "Chauffe-eau thermodynamique",
    status: "En cours",
    progress: 80,
    dueDate: "2025-03-25",
  },
  {
    id: 4,
    title: "Installation - Système Solaire Combiné - Client A",
    solution: "Système Solaire Combiné",
    status: "Planifié",
    progress: 20,
    dueDate: "2025-03-28",
  },
];

export default function PMDashboard() {
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
                    <h2 className="text-xl font-bold">Gestion de Projets Énergétiques</h2>
                    <p className="text-[#bfddf9]">{currentDate} - Suivi des installations écologiques</p>
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
                Tableau de Bord PM
              </h1>
              <p className="text-gray-600">
                Gestion des installations énergétiques écologiques
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 space-y-6">
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
                className="flex flex-wrap gap-3 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {["Tous", "Pompes a chaleur", "Chauffe-eau solaire individuel", "Chauffe-eau thermodynamique"].map((item) => (
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

              <motion.div
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    className="bg-white rounded-xl shadow-sm p-6 border border-[#bfddf9]/20 hover:shadow-md transition-all"
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <SparklesIcon className="h-6 w-6 text-[#213f5b]" />
                      <h2 className="text-xl font-semibold text-[#213f5b] truncate">
                        {project.title}
                      </h2>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-[#213f5b]/80">
                        <TagIcon className="h-4 w-4" />
                        {project.solution}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#213f5b]/80">
                        <CalendarIcon className="h-4 w-4" />
                        Échéance: {project.dueDate}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#213f5b]/80">
                        <UsersIcon className="h-4 w-4" />
                        Équipe: 5 membres
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="flex justify-between text-sm text-[#213f5b]/80">
                        <span>Progrès</span>
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

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      className="mt-4 w-full py-2 bg-[#213f5b] text-white rounded-lg text-sm hover:bg-[#213f5b]/90 flex items-center justify-center gap-2"
                    >
                      <ChartBarIcon className="h-4 w-4" />
                      Voir Détails
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}