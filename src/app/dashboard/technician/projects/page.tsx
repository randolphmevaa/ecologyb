"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

// Sample projects data for the Technician / Projects page
const projects = [
  {
    id: 1,
    title: "Installation Pompe à chaleur - Résidence Dupont",
    solution: "Pompes a chaleur",
    status: "En cours",
    progress: 60,
    location: "12 Rue de l'Énergie, Lyon",
    description: "Installation et configuration de la pompe à chaleur pour optimiser le chauffage.",
  },
  {
    id: 2,
    title: "Maintenance Chauffe-eau solaire individuel - Immeuble Martin",
    solution: "Chauffe-eau solaire individuel",
    status: "Planifiée",
    progress: 20,
    location: "34 Avenue du Soleil, Marseille",
    description: "Vérification et remplacement des composants pour améliorer l'efficacité.",
  },
  {
    id: 3,
    title: "Révision Chauffe-eau thermodynamique - Complexe Belle Vue",
    solution: "Chauffe-eau thermodynamique",
    status: "En cours",
    progress: 75,
    location: "56 Boulevard des Energies, Paris",
    description: "Inspection complète et optimisation du système thermodynamique.",
  },
  {
    id: 4,
    title: "Installation Système Solaire Combiné - Résidence Soleil",
    solution: "Système Solaire Combiné",
    status: "Planifiée",
    progress: 10,
    location: "78 Rue du Soleil, Nice",
    description: "Déploiement initial et configuration du système solaire combiné.",
  },
];

export default function TechnicianProjects() {
  const [filter, setFilter] = useState("Tous");

  // Filter projects by energy solution (or show all)
  const filteredProjects =
    filter === "Tous"
      ? projects
      : projects.filter((project) => project.solution === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      {/* Common Header */}
      <Header />

      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-800">Projets</h1>
          <p className="mt-2 text-lg text-gray-600">
            Suivez et gérez les projets d&apos;installation pour nos solutions énergétiques spécialisées.
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

        {/* Projects Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              className="p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-[#bfddf9]/30 bg-white hover:border-[#d2fcb2]/50 hover:bg-gradient-to-br hover:from-white hover:to-[#bfddf9]/10 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold text-gray-800">
                  {project.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {project.location} • {project.status}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {project.description}
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
        </div>

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
