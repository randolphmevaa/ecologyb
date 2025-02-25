"use client";

import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import {
  DocumentTextIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// Business colors
const colors = {
  white: "#ffffff",
  lightBlue: "#bfddf9",
  lightGreen: "#d2fcb2",
  darkBlue: "#213f5b",
};

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
  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(to bottom, ${colors.white}, ${colors.lightGreen}20)`,
      }}
    >
      {/* Consistent Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold" style={{ color: colors.darkBlue }}>
            Documents
          </h1>
          <p
            className="mt-4 text-lg"
            style={{ color: colors.darkBlue, opacity: 0.8 }}
          >
            Accédez à toute votre documentation pour nos solutions énergétiques
            spécialisées.
          </p>
        </motion.div>

        {/* Documents Grid */}
        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
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
          {documents.map((doc) => (
            <motion.div
              key={doc.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.03,
                boxShadow: `0 12px 30px -5px ${colors.darkBlue}20`,
              }}
              transition={{ duration: 0.3 }}
              className="p-8 rounded-xl border"
              style={{
                background: colors.white,
                borderImage: `linear-gradient(45deg, ${colors.lightBlue}, ${colors.lightGreen}) 1`,
                borderWidth: "1px",
              }}
            >
              <div className="flex items-center gap-5">
                <div className="p-4 bg-green-100 rounded-full">
                  <DocumentTextIcon
                    className="h-10 w-10"
                    style={{ color: colors.darkBlue }}
                  />
                </div>
                <div>
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: colors.darkBlue }}
                  >
                    {doc.name}
                  </h2>
                  <p
                    className="text-sm"
                    style={{ color: colors.darkBlue, opacity: 0.7 }}
                  >
                    {doc.fileType} • {doc.size}
                  </p>
                </div>
              </div>
              <p
                className="mt-6 text-base"
                style={{ color: colors.darkBlue, opacity: 0.85 }}
              >
                Solution: {doc.solution}
              </p>
              <p
                className="mt-2 text-sm"
                style={{ color: colors.darkBlue, opacity: 0.75 }}
              >
                Téléchargé le {doc.uploadedDate}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="mt-6 flex items-center justify-center w-full py-3 px-6 rounded-full shadow-md transition-colors"
                style={{
                  backgroundColor: colors.darkBlue,
                  color: colors.white,
                }}
              >
                Voir Détails
                <ChevronRightIcon className="ml-3 h-5 w-5" />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
