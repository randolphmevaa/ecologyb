"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRightIcon, ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import ChatWidget from "@/components/ChatWidget"; // Adjust the path as needed

interface Project {
  _id: string;
  numero: string;
  typeDeLogement: string;
  solution: string;
  surfaceChauffee: number;
  etape: string;
}

export default function ClientProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState("Tous");
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Fetch projects (dossiers) for the logged-in client based on contactId from localStorage.
  useEffect(() => {
    async function fetchProjects() {
      try {
        const storedInfo = localStorage.getItem("clientInfo");
        if (storedInfo) {
          const clientInfo = JSON.parse(storedInfo);
          // Assume the contact info is stored under the key "contact"
          const contact = clientInfo.contact;
          const contactId = contact.contactId || contact._id;
          const res = await fetch(`/api/dossiers?contactId=${contactId}`);
          if (res.ok) {
            const data = await res.json();
            setProjects(data);
          } else {
            console.error("Error fetching dossiers:", res.statusText);
          }
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Filter projects by solution if a filter is applied.
  // Note: The dossier's "solution" field is a comma‐separated string.
  const filteredProjects =
    filter === "Tous"
      ? projects
      : projects.filter((project) => {
          if (!project.solution) return false;
          return project.solution
            .split(",")
            .map((s: string) => s.trim())
            .includes(filter);
        });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 relative">
      {/* Header component for consistent navigation */}
      <Header />

      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">Mes Projets</h1>
          <p className="mt-2 text-lg text-gray-600">
            Suivez l&apos;avancement de vos projets d&apos;installations énergétiques et vérifiez si des documents supplémentaires sont nécessaires.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap gap-4 mb-8"
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
        {loading ? (
          <div className="text-center text-gray-600">Chargement...</div>
        ) : (
          <>
            {filteredProjects.length > 0 ? (
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
                {filteredProjects.map((project) => (
                  <Link
                    key={project._id}
                    href={`/client/projects/${project._id}`}
                  >
                    <motion.div
                      className="p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-[#bfddf9]/30 bg-white hover:border-[#d2fcb2]/50 hover:bg-gradient-to-br hover:from-white hover:to-[#bfddf9]/10 cursor-pointer"
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">
                          {project.numero} - {project.typeDeLogement}
                        </h2>
                        <div className="text-sm font-medium text-gray-500">
                          {project.etape}
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-gray-600">
                        <strong>Solution:</strong> {project.solution}
                      </p>
                      <p className="mt-2 text-sm text-gray-600">
                        <strong>Surface chauffée:</strong> {project.surfaceChauffee} m²
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        className="mt-4 flex items-center justify-center w-full py-2 px-4 bg-green-600 text-white rounded-full transition-colors hover:bg-green-700"
                      >
                        Détails <ChevronRightIcon className="ml-2 h-5 w-5" />
                      </motion.button>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            ) : (
              <div className="mt-10 text-center text-gray-500">
                Aucun projet trouvé pour ce filtre.
              </div>
            )}
          </>
        )}
      </main>

      {/* Chat Open Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg"
      >
        <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
      </button>

      {/* Chat Widget */}
      {isChatOpen && <ChatWidget onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}
