"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import {
  // SparklesIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  ArrowUpRightIcon,
  ChartBarIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// Sample statistics data for the Sales dashboard
const stats = [
  {
    name: "Total Leads",
    value: "1,200",
    icon: UserCircleIcon,
    trend: "8.4%",
    positive: true,
    description: "Depuis le mois dernier",
  },
  {
    name: "Opportunités",
    value: "320",
    icon: BriefcaseIcon,
    trend: "3.7%",
    positive: false,
    description: "Nouveaux ce mois-ci",
  },
  {
    name: "Revenus",
    value: "€45,000",
    icon: CurrencyDollarIcon,
    trend: "12.3%",
    positive: true,
    description: "Ce mois-ci",
  },
];

// Sample pipeline data for the sales funnel
const pipeline = [
  { stage: "Prospection", percentage: 40 },
  { stage: "Qualification", percentage: 30 },
  { stage: "Proposition", percentage: 20 },
  { stage: "Négociation", percentage: 10 },
];

// Sample recent leads data
const recentLeads = [
  {
    id: 1,
    name: "Client Alpha",
    solution: "Pompes a chaleur",
    contact: "alpha@example.com",
    status: "Nouveau",
    date: "2025-04-01",
  },
  {
    id: 2,
    name: "Client Beta",
    solution: "Chauffe-eau solaire individuel",
    contact: "beta@example.com",
    status: "En discussion",
    date: "2025-04-03",
  },
  {
    id: 3,
    name: "Client Gamma",
    solution: "Chauffe-eau thermodynamique",
    contact: "gamma@example.com",
    status: "Converti",
    date: "2025-03-28",
  },
];

// Sample top performing regions data
const topRegions = [
  { region: "Île-de-France", revenue: "€20,000" },
  { region: "Provence-Alpes-Côte d'Azur", revenue: "€15,000" },
  { region: "Auvergne-Rhône-Alpes", revenue: "€10,000" },
];

export default function SalesDashboard() {
  // Additional filter state if needed (e.g., for leads by solution)
  const [leadFilter] = useState("Tous");

  // Optionally filter recent leads (here, simply show all for demo)
  const filteredLeads =
    leadFilter === "Tous"
      ? recentLeads
      : recentLeads.filter((lead) => lead.solution === leadFilter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Common Header */}
      <Header user={{ name: "Account Executive", avatar: "/sales-avatar.png" }} />

      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-800">
            Bienvenue dans votre Espace Commercial
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Découvrez vos leads, opportunités et revenus générés pour nos solutions énergétiques spécialisées.
          </p>
        </motion.div>

        {/* Sales Statistics Cards */}
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.name}
              className="bg-white/90 backdrop-blur-md border border-pink-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center">
                <stat.icon className="h-10 w-10 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
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

        {/* Upcoming Opportunities Snapshot */}
        <motion.div
          className="bg-white/90 backdrop-blur-md border border-pink-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Opportunités à venir</h2>
            <button className="flex items-center gap-1 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
              Voir le rapport <ArrowUpRightIcon className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-3 text-gray-600">
            Vous avez 45 nouvelles opportunités en cours ce mois-ci. Consultez les détails pour planifier vos actions commerciales.
          </p>
        </motion.div>

        {/* Pipeline Overview */}
        <motion.div
          className="bg-white/90 backdrop-blur-md border border-pink-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Vue d&apos;ensemble du Pipeline</h2>
          {pipeline.map((stage, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                <span className="text-sm font-medium text-gray-700">{stage.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full bg-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${stage.percentage}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Recent Leads Table */}
        <motion.div
          className="bg-white/90 backdrop-blur-md border border-pink-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Leads Récents</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Nom du Client</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Solution</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Contact</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Statut</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-4 py-2 text-sm text-gray-800">{lead.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{lead.solution}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{lead.contact}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{lead.status}</td>
                    <td className="px-4 py-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center text-purple-600 font-medium"
                      >
                        Voir <ChevronRightIcon className="ml-1 h-5 w-5" />
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Top Performing Regions */}
        <motion.div
          className="bg-white/90 backdrop-blur-md border border-pink-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Top Régions Performantes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topRegions.map((region, idx) => (
              <div
                key={idx}
                className="bg-purple-100 rounded-xl p-4 flex flex-col items-center"
              >
                <ChartBarIcon className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="text-lg font-semibold text-gray-800">{region.region}</h3>
                <p className="text-sm text-gray-700">{region.revenue} de revenus</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
