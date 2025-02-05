"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import {
  ChevronRightIcon,
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

  // Filter tasks based on the selected energy solution
  const filteredTasks =
    filter === "Tous"
      ? tasks
      : tasks.filter((task) => task.solution === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      {/* Import the common Header component */}
      <Header user={{ name: "Technician", avatar: "/technician-avatar.png" }} />

      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-800">Tâches / Jobs</h1>
          <p className="mt-2 text-lg text-gray-600">
            Gérez et suivez vos tâches pour les installations de nos solutions énergétiques spécialisées.
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

        {/* Tasks List */}
        <div className="space-y-6">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">{task.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {task.location} • {task.date}
                </p>
                <p className="text-sm text-gray-600 mt-1">Solution: {task.solution}</p>
                <p className="mt-2 text-gray-600">{task.details}</p>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === "En cours"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {task.status}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center text-green-600 font-medium"
                >
                  Voir Détails <ChevronRightIcon className="h-5 w-5 ml-1" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Tasks Message */}
        {filteredTasks.length === 0 && (
          <div className="mt-10 text-center text-gray-500">
            Aucune tâche trouvée pour ce filtre.
          </div>
        )}
      </main>
    </div>
  );
}
