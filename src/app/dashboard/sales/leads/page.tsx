"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import {
  // UserCircleIcon,
  // BriefcaseIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  FireIcon,
} from "@heroicons/react/24/outline";

// Sample leads data for the Sales leads page
const leadsData = [
  {
    id: 1,
    name: "Client Alpha",
    solution: "Pompes a chaleur",
    contact: "alpha@example.com",
    status: "Nouveau",
    date: "2025-04-01",
    region: "Île-de-France",
    owner: "Julie Durand",
  },
  {
    id: 2,
    name: "Client Beta",
    solution: "Chauffe-eau solaire individuel",
    contact: "beta@example.com",
    status: "En discussion",
    date: "2025-04-03",
    region: "Provence-Alpes-Côte d'Azur",
    owner: "Marc Leclerc",
  },
  {
    id: 3,
    name: "Client Gamma",
    solution: "Chauffe-eau thermodynamique",
    contact: "gamma@example.com",
    status: "Converti",
    date: "2025-03-28",
    region: "Auvergne-Rhône-Alpes",
    owner: "Sophie Martin",
  },
  {
    id: 4,
    name: "Client Delta",
    solution: "Système Solaire Combiné",
    contact: "delta@example.com",
    status: "Nouveau",
    date: "2025-04-05",
    region: "Nouvelle-Aquitaine",
    owner: "Julien Bernard",
  },
  // ... more leads
];

export default function SalesLeadsDashboard() {
  const [solutionFilter, setSolutionFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter leads by solution, status, and search term
  const filteredLeads = leadsData.filter((lead) => {
    const matchesSolution =
      solutionFilter === "Tous" || lead.solution === solutionFilter;
    const matchesStatus =
      statusFilter === "Tous" || lead.status === statusFilter;
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contact.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSolution && matchesStatus && matchesSearch;
  });

  // Summary statistics
  const totalLeads = leadsData.length;
  const newLeads = leadsData.filter((lead) => lead.status === "Nouveau").length;
  const discussionLeads = leadsData.filter(
    (lead) => lead.status === "En discussion"
  ).length;
  const convertedLeads = leadsData.filter(
    (lead) => lead.status === "Converti"
  ).length;

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
            Leads
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Gérez vos leads pour nos solutions énergétiques spécialisées et maximisez vos ventes.
          </p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/90 backdrop-blur-md border border-purple-200 rounded-xl p-6 shadow-lg">
            <p className="text-sm text-gray-500">Total Leads</p>
            <p className="text-2xl font-bold text-gray-800">{totalLeads}</p>
          </div>
          <div className="bg-white/90 backdrop-blur-md border border-purple-200 rounded-xl p-6 shadow-lg">
            <p className="text-sm text-gray-500">Nouveaux</p>
            <p className="text-2xl font-bold text-gray-800">{newLeads}</p>
          </div>
          <div className="bg-white/90 backdrop-blur-md border border-purple-200 rounded-xl p-6 shadow-lg">
            <p className="text-sm text-gray-500">En discussion</p>
            <p className="text-2xl font-bold text-gray-800">{discussionLeads}</p>
          </div>
          <div className="bg-white/90 backdrop-blur-md border border-purple-200 rounded-xl p-6 shadow-lg">
            <p className="text-sm text-gray-500">Convertis</p>
            <p className="text-2xl font-bold text-gray-800">{convertedLeads}</p>
          </div>
        </motion.div>

        {/* Search & Advanced Filters */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Search Bar */}
          <div className="relative w-full max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher des leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Solution Filter */}
            <div className="flex items-center gap-1">
              <FireIcon className="h-5 w-5 text-gray-600" />
              {["Tous", "Pompes a chaleur", "Chauffe-eau solaire individuel", "Chauffe-eau thermodynamique", "Système Solaire Combiné"].map((item) => (
                <button
                  key={item}
                  onClick={() => setSolutionFilter(item)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                    solutionFilter === item
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-purple-50"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            {/* Status Filter */}
            <div className="flex items-center gap-1">
              <FireIcon className="h-5 w-5 text-gray-600" />
              {["Tous", "Nouveau", "En discussion", "Converti"].map((item) => (
                <button
                  key={item}
                  onClick={() => setStatusFilter(item)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                    statusFilter === item
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-purple-50"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Leads Table */}
        <div className="overflow-x-auto">
          <motion.table
            className="min-w-full bg-white/90 backdrop-blur-md border border-purple-200 rounded-xl shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold">Client</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Solution</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Région</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Responsable</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-purple-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-800">{lead.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{lead.solution}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{lead.contact}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{lead.status}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{lead.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{lead.region}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{lead.owner}</td>
                  <td className="px-4 py-3">
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
          </motion.table>
        </div>

        {/* No Leads Message */}
        {filteredLeads.length === 0 && (
          <div className="mt-10 text-center text-gray-500">
            Aucun lead trouvé pour ce filtre.
          </div>
        )}
      </main>
    </div>
  );
}
