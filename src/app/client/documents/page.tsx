"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import {
  DocumentTextIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// Sample documents data
const documents = [
  {
    id: 1,
    name: "Guide d'installation - Pompe à chaleur",
    solution: "Pompes a chaleur",
    uploadedDate: "2025-01-15",
    fileType: "PDF",
    size: "1.2MB",
  },
  {
    id: 2,
    name: "Manuel d'utilisation - Chauffe-eau solaire individuel",
    solution: "Chauffe-eau solaire individuel",
    uploadedDate: "2025-02-10",
    fileType: "PDF",
    size: "800KB",
  },
  {
    id: 3,
    name: "Guide d'entretien - Chauffe-eau thermodynamique",
    solution: "Chauffe-eau thermodynamique",
    uploadedDate: "2025-03-05",
    fileType: "PDF",
    size: "1.5MB",
  },
  {
    id: 4,
    name: "Documentation technique - Système Solaire Combiné",
    solution: "Système Solaire Combiné",
    uploadedDate: "2025-03-20",
    fileType: "PDF",
    size: "2.0MB",
  },
];

export default function ClientDocuments() {
  const [filter, setFilter] = useState("Tous");

  const filteredDocuments =
    filter === "Tous"
      ? documents
      : documents.filter((doc) => doc.solution === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Consistent header */}
      <Header />

      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-800">Documents</h1>
          <p className="mt-2 text-lg text-gray-600">
            Accédez à toute votre documentation pour nos solutions énergétiques
            spécialisées.
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

        {/* Documents Grid */}
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {filteredDocuments.map((doc) => (
            <motion.div
              key={doc.id}
              className="p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-[#bfddf9]/30 bg-white hover:border-[#d2fcb2]/50 hover:bg-gradient-to-br hover:from-white hover:to-[#bfddf9]/10"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <DocumentTextIcon className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {doc.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {doc.fileType} • {doc.size}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Solution: {doc.solution}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Téléchargé le {doc.uploadedDate}
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                className="mt-4 flex items-center justify-center w-full py-2 px-4 bg-green-600 text-white rounded-full transition-colors hover:bg-green-700"
              >
                Voir Détails <ChevronRightIcon className="ml-2 h-5 w-5" />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* No Documents Found Message */}
        {filteredDocuments.length === 0 && (
          <div className="mt-10 text-center text-gray-500">
            Aucun document trouvé pour ce filtre.
          </div>
        )}
      </main>
    </div>
  );
}
