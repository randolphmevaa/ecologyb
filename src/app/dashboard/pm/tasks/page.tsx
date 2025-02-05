"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { ChevronRightIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

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

  // Filter tasks based on selected energy solution
  const filteredTasks =
    filter === "Tous"
      ? tasks
      : tasks.filter((task) => task.solution === filter);

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
          <h1 className="text-3xl font-bold text-gray-800">Tâches</h1>
          <p className="mt-2 text-lg text-gray-600">
            Gérez et suivez vos tâches liées aux projets d&apos;installation pour nos solutions énergétiques spécialisées.
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

        {/* Tasks Grid */}
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow flex flex-col"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <ClipboardDocumentCheckIcon className="h-8 w-8 text-green-600" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{task.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {task.location} • Due le {task.dueDate}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Solution: {task.solution}</p>
                </div>
              </div>
              <p className="mt-3 text-gray-600">{task.description}</p>
              <div className="mt-4 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center text-green-600 font-medium"
                >
                  Voir Détails <ChevronRightIcon className="ml-1 h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Tasks Found Message */}
        {filteredTasks.length === 0 && (
          <div className="mt-10 text-center text-gray-500">
            Aucune tâche trouvée pour ce filtre.
          </div>
        )}
      </main>
    </div>
  );
}
