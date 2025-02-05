"use client";

import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import {
  ClipboardDocumentCheckIcon,
  CalendarIcon,
  CheckCircleIcon,
  // BriefcaseIcon,
} from "@heroicons/react/24/outline";

// Sample statistics data for the technician dashboard
const stats = [
  {
    name: "Tâches en cours",
    value: "12",
    icon: ClipboardDocumentCheckIcon,
    trend: "8.5%",
    positive: true,
    description: "Cette semaine",
  },
  {
    name: "Interventions à venir",
    value: "5",
    icon: CalendarIcon,
    trend: "2.1%",
    positive: true,
    description: "Prochaines 24h",
  },
  {
    name: "Projets terminés",
    value: "20",
    icon: CheckCircleIcon,
    trend: "15.0%",
    positive: true,
    description: "Ce mois-ci",
  },
];

// Sample tasks data
const tasks = [
  {
    id: 1,
    title: "Installation - Pompe à chaleur",
    location: "123 Rue de l'Énergie, Lyon",
    date: "2025-03-10",
    solution: "Pompes a chaleur",
    status: "Planifiée",
  },
  {
    id: 2,
    title: "Maintenance - Chauffe-eau solaire individuel",
    location: "45 Avenue du Soleil, Marseille",
    date: "2025-03-11",
    solution: "Chauffe-eau solaire individuel",
    status: "En cours",
  },
  {
    id: 3,
    title: "Intervention - Système Solaire Combiné",
    location: "78 Boulevard des Energies, Paris",
    date: "2025-03-12",
    solution: "Système Solaire Combiné",
    status: "Planifiée",
  },
];

export default function TechnicianDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      {/* Consistent header for navigation */}
      <Header user={{ name: "Technician", avatar: "/technician-avatar.png" }} />

      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-800">Accueil Technicien</h1>
          <p className="mt-2 text-lg text-gray-600">
            Suivez vos tâches et interventions pour nos solutions énergétiques spécialisées.
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

        {/* Upcoming Tasks Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tâches à venir</h2>
          <div className="space-y-4">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow flex flex-col md:flex-row justify-between items-center"
                whileHover={{ scale: 1.01 }}
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {task.location} • {task.date}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Solution: {task.solution}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {task.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
