"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// Sample emails data for the Sales Emails page
const emails = [
  {
    id: 1,
    sender: "sales@energiecrm.com",
    subject: "Mise à jour de l'installation - Pompe à chaleur - Client X",
    solution: "Pompes a chaleur",
    receivedDate: "2025-04-01",
    snippet:
      "Bonjour, veuillez trouver ci-joint la dernière mise à jour concernant l'installation de la pompe à chaleur pour Client X...",
  },
  {
    id: 2,
    sender: "support@energiecrm.com",
    subject: "Planification - Chauffe-eau solaire individuel - Client Y",
    solution: "Chauffe-eau solaire individuel",
    receivedDate: "2025-04-03",
    snippet:
      "Cher client, la planification pour la maintenance du chauffe-eau solaire individuel pour Client Y a été finalisée...",
  },
  {
    id: 3,
    sender: "info@energiecrm.com",
    subject: "Réunion de suivi - Chauffe-eau thermodynamique - Client Z",
    solution: "Chauffe-eau thermodynamique",
    receivedDate: "2025-04-05",
    snippet:
      "Nous vous rappelons la réunion de suivi prévue pour discuter des améliorations du chauffe-eau thermodynamique pour Client Z...",
  },
  {
    id: 4,
    sender: "updates@energiecrm.com",
    subject: "Nouvelles directives - Système Solaire Combiné",
    solution: "Système Solaire Combiné",
    receivedDate: "2025-04-07",
    snippet:
      "Bonjour, veuillez consulter les nouvelles directives concernant l'installation du système solaire combiné...",
  },
];

export default function SalesEmailsDashboard() {
  const [solutionFilter, setSolutionFilter] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter emails based on the selected energy solution and search term
  const filteredEmails = emails.filter((email) => {
    const matchesSolution =
      solutionFilter === "Tous" || email.solution === solutionFilter;
    const matchesSearch =
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.sender.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSolution && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100">
      {/* Import the common Header for consistent navigation */}
      <Header />

      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-800">Emails</h1>
          <p className="mt-4 text-lg text-gray-700">
            Consultez et gérez vos emails liés aux projets d&apos;installation pour nos solutions énergétiques spécialisées.
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
            placeholder="Rechercher des emails..."
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

        {/* Emails Table */}
        <div className="overflow-x-auto">
          <motion.table
            className="min-w-full bg-white/90 backdrop-blur-md border border-pink-200 rounded-xl shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold">Sujet</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Expéditeur</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Solution</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmails.map((email) => (
                <tr key={email.id} className="hover:bg-purple-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-800">{email.subject}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{email.sender}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{email.solution}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{email.receivedDate}</td>
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

        {/* No Emails Found Message */}
        {filteredEmails.length === 0 && (
          <div className="mt-10 text-center text-gray-500">
            Aucun email trouvé pour ce filtre.
          </div>
        )}
      </main>
    </div>
  );
}
