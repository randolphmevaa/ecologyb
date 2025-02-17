"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { ChevronRightIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// Sample opportunities data for the Sales Opportunities page
const opportunities = [
  {
    id: 1,
    name: "Installation - Pompe à chaleur - Client A",
    solution: "Pompes a chaleur",
    value: "€20,000",
    probability: "75%",
    status: "En discussion",
    closeDate: "2025-04-15",
  },
  {
    id: 2,
    name: "Maintenance - Chauffe-eau solaire individuel - Client B",
    solution: "Chauffe-eau solaire individuel",
    value: "€15,000",
    probability: "60%",
    status: "Nouveau",
    closeDate: "2025-04-20",
  },
  {
    id: 3,
    name: "Upgrade - Chauffe-eau thermodynamique - Client C",
    solution: "Chauffe-eau thermodynamique",
    value: "€25,000",
    probability: "80%",
    status: "Converti",
    closeDate: "2025-04-10",
  },
  {
    id: 4,
    name: "Installation - Système Solaire Combiné - Client D",
    solution: "Système Solaire Combiné",
    value: "€30,000",
    probability: "50%",
    status: "En discussion",
    closeDate: "2025-04-18",
  },
  // You can add more opportunities as needed
];

export default function SalesOpportunitiesDashboard() {
  const [solutionFilter, setSolutionFilter] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter opportunities by solution and search term
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSolution =
      solutionFilter === "Tous" || opp.solution === solutionFilter;
    const matchesSearch = opp.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSolution && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100">
      {/* Common Header */}
      <Header />

      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-800">Opportunités</h1>
          <p className="mt-4 text-lg text-gray-700">
            Gérez et suivez vos opportunités commerciales pour nos solutions énergétiques spécialisées.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="relative max-w-md mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher une opportunité..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </motion.div>

        {/* Filter Buttons */}
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
              onClick={() => setSolutionFilter(item)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                solutionFilter === item
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-purple-50"
              }`}
            >
              {item}
            </button>
          ))}
        </motion.div>

        {/* Opportunities Table */}
        <div className="overflow-x-auto">
          <motion.table
            className="min-w-full bg-white/90 backdrop-blur-md border border-pink-200 rounded-xl shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold">Opportunité</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Solution</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Valeur</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Probabilité</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Date de clôture</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOpportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-purple-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-800">{opp.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{opp.solution}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{opp.value}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{opp.probability}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{opp.status}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{opp.closeDate}</td>
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

        {/* No Opportunities Found Message */}
        {filteredOpportunities.length === 0 && (
          <div className="mt-10 text-center text-gray-500">
            Aucune opportunité trouvée pour ce filtre.
          </div>
        )}
      </main>
    </div>
  );
}
