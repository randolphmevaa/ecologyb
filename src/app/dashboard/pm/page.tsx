"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import {
  BriefcaseIcon,
  ClipboardDocumentCheckIcon,
  CalendarIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// Sample statistics data for the PM dashboard
const stats = [
  {
    name: "Projets en cours",
    value: "15",
    icon: BriefcaseIcon,
    trend: "12%",
    positive: true,
    description: "Ce mois-ci",
  },
  {
    name: "Tâches en cours",
    value: "28",
    icon: ClipboardDocumentCheckIcon,
    trend: "5%",
    positive: false,
    description: "Cette semaine",
  },
  {
    name: "Interventions planifiées",
    value: "8",
    icon: CalendarIcon,
    trend: "10%",
    positive: true,
    description: "Prochaines 48h",
  },
];

// Sample projects data for the PM dashboard
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
  // Optionally, you could add filtering functionality for projects by solution
  const [filter, setFilter] = useState("Tous");

  const filteredProjects =
    filter === "Tous"
      ? projects
      : projects.filter((project) => project.solution === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Common Header */}
      <Header user={{ name: "Project Manager", avatar: "/pm-avatar.png" }} />

      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-800">Accueil PM</h1>
          <p className="mt-2 text-lg text-gray-600">
            Suivez vos projets et installations pour nos solutions énergétiques spécialisées.
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.name}
              whileHover={{ scale: 1.02 }}
              className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow"
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

        {/* Optional Filter Buttons */}
        <motion.div
          className="flex flex-wrap gap-4 mb-8 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
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

        {/* Projects Grid */}
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow flex flex-col"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold text-gray-800">
                  {project.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Solution: {project.solution} • Status: {project.status}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Due: {project.dueDate}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full bg-green-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <div className="mt-1 text-right text-xs text-gray-500">
                  {project.progress}% complété
                </div>
              </div>

              {/* Call-to-Action Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                className="mt-4 flex items-center justify-center w-full py-2 px-4 bg-green-600 text-white rounded-full transition-colors hover:bg-green-700"
              >
                Voir Détails <ChevronRightIcon className="ml-2 h-5 w-5" />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* No Projects Found Message */}
        {filteredProjects.length === 0 && (
          <div className="mt-10 text-center text-gray-500">
            Aucun projet trouvé pour ce filtre.
          </div>
        )}
      </main>
    </div>
  );
}
