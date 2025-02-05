"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
// import { MailIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

// Sample emails data for the PM Emails page
const emails = [
  {
    id: 1,
    sender: "projets@energiecrm.com",
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
      "Cher PM, la planification pour la maintenance du chauffe-eau solaire individuel pour Client Y a été finalisée...",
  },
  {
    id: 3,
    sender: "coordination@energiecrm.com",
    subject: "Réunion de suivi - Chauffe-eau thermodynamique - Client Z",
    solution: "Chauffe-eau thermodynamique",
    receivedDate: "2025-03-30",
    snippet:
      "Nous vous rappelons la réunion de suivi prévue pour discuter des améliorations du chauffe-eau thermodynamique pour Client Z...",
  },
  {
    id: 4,
    sender: "info@energiecrm.com",
    subject: "Nouvelles directives - Système Solaire Combiné",
    solution: "Système Solaire Combiné",
    receivedDate: "2025-04-05",
    snippet:
      "Bonjour, veuillez consulter les nouvelles directives concernant l'installation du système solaire combiné...",
  },
];

export default function PMEmailsDashboard() {
  const [filter, setFilter] = useState("Tous");

  // Filter emails based on the selected energy solution
  const filteredEmails =
    filter === "Tous"
      ? emails
      : emails.filter((email) => email.solution === filter);

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
          <h1 className="text-3xl font-bold text-gray-800">Emails</h1>
          <p className="mt-2 text-lg text-gray-600">
            Consultez et gérez vos emails liés aux projets d&apos;installation pour nos solutions énergétiques spécialisées.
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

        {/* Emails List */}
        <div className="space-y-6">
          {filteredEmails.map((email) => (
            <motion.div
              key={email.id}
              className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {email.subject}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    De: {email.sender} • Reçu le {email.receivedDate}
                  </p>
                  <p className="mt-2 text-gray-600">{email.snippet}</p>
                </div>
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
