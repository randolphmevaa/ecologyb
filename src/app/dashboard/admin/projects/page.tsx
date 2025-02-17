"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  FunnelIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

// ------------------------
// Types
// ------------------------
type Dossier = {
  _id: string;
  numero: string;
  client: string;
  projet: string;
  solution: string;
  etape: string;
  valeur: string;
  assignedTeam?: string;
  notes?: string;
  createdAt?: string;
  informationLogement?: {
    typeDeLogement?: string;
    surfaceHabitable?: string;
    anneeConstruction?: string;
    systemeChauffage?: string;
  };
  informationTravaux?: {
    typeTravaux?: string;
    typeUtilisation?: string;
    surfaceChauffee?: string;
    circuitChauffageFonctionnel?: string;
  };
  contactId?: string;
};

export default function ProjectsPage() {
  // Data and loading
  const [projects, setProjects] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filtering & Sorting
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [solutionFilter, setSolutionFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [advancedFiltersVisible, setAdvancedFiltersVisible] = useState<boolean>(false);
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Fetch projects (wrapped in a function so we can refresh)
  const fetchProjects = () => {
    setLoading(true);
    fetch("/api/dossiers")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des projets :", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filtering logic
  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (project.client || "").toLowerCase().includes(query) ||
      (project.projet || "").toLowerCase().includes(query) ||
      (project.numero || "").toLowerCase().includes(query);
    const matchesSolution = solutionFilter
      ? (project.solution || "").toLowerCase() === solutionFilter.toLowerCase()
      : true;
    const matchesStatus = statusFilter
      ? (project.etape || "").toLowerCase().includes(statusFilter.toLowerCase())
      : true;
    return matchesSearch && matchesSolution && matchesStatus;
  });

  // Sorting logic
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    if (sortField === "createdAt") {
      aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    } else if (sortField === "client") {
      aValue = (a.client || "").toLowerCase();
      bValue = (b.client || "").toLowerCase();
    } else if (sortField === "location") {
      aValue = (a.informationLogement?.typeDeLogement || "").toLowerCase();
      bValue = (b.informationLogement?.typeDeLogement || "").toLowerCase();
    } else if (sortField === "etape") {
      aValue = (a.etape || "").toLowerCase();
      bValue = (b.etape || "").toLowerCase();
    } else {
      aValue = "";
      bValue = "";
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedProjects.length / pageSize);
  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handler: Toggle sort on header click
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSolutionFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  // Clear search input
  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <p className="text-lg font-semibold">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar (empty for now; add content as needed) */}
      <motion.div
        className="relative border-r border-[#bfddf9]/30 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Future sidebar content */}
      </motion.div>

      {/* Main container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-8 space-y-10 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
          {/* Page Title */}
          <header className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-[#1a365d]"
            >
              Liste des Projets
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-2 text-lg text-gray-500"
            >
              Gérez et consultez tous les dossiers projets pour des solutions énergétiques spécialisées.
            </motion.p>
          </header>

          {/* Wrap the main content in a grid layout */}
          <div className="grid grid-cols-1 gap-10">
            {/* Search & Advanced Filters */}
            <div className="flex flex-col gap-4">
              <div className="relative flex items-center">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3" />
                <input
                  type="text"
                  placeholder="Rechercher par client, projet ou numéro..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-10 text-gray-500 hover:text-gray-700 transition"
                    title="Effacer la recherche"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => setAdvancedFiltersVisible(!advancedFiltersVisible)}
                  className="ml-3 p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                  title={advancedFiltersVisible ? "Masquer les filtres avancés" : "Afficher les filtres avancés"}
                >
                  {advancedFiltersVisible ? (
                    <XMarkIcon className="w-5 h-5 text-gray-600" />
                  ) : (
                    <FunnelIcon className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                <button
                  onClick={fetchProjects}
                  className="ml-3 p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                  title="Rafraîchir la liste"
                >
                  <ArrowPathIcon className="w-5 h-5 text-gray-600 animate-spin-slow" />
                </button>
              </div>
              <AnimatePresence>
                {advancedFiltersVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col md:flex-row gap-4"
                  >
                    <select
                      value={solutionFilter}
                      onChange={(e) => {
                        setSolutionFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                      <option value="">Toutes les solutions</option>
                      <option value="Pompes à chaleur">Pompes à chaleur</option>
                      <option value="Chauffe-eau solaire individuel">Chauffe-eau solaire individuel</option>
                      <option value="Chauffe-eau thermodynamique">Chauffe-eau thermodynamique</option>
                      <option value="Système Solaire Combiné">Système Solaire Combiné</option>
                    </select>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                      <option value="">Tous les statuts</option>
                      <option value="1 Prise de contact">1 Prise de contact</option>
                      <option value="2 En attente des documents">2 En attente des documents</option>
                      <option value="3 Instruction du dossier">3 Instruction du dossier</option>
                      <option value="4 Dossier Accepter">4 Dossier Accepter</option>
                      <option value="5 Installation">5 Installation</option>
                      <option value="6 Controle">6 Controle</option>
                      <option value="7 Dossier cloturer">7 Dossier cloturer</option>
                    </select>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-md shadow-sm hover:bg-red-200 transition"
                    >
                      Réinitialiser
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Summary Count */}
            <div className="text-gray-700 text-sm">
              {sortedProjects.length} projet{sortedProjects.length !== 1 && "s"} trouvé{sortedProjects.length !== 1 && "s"}.
            </div>

            {/* Projects Table */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th
                      onClick={() => handleSort("createdAt")}
                      title="Cliquer pour trier par Date"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-1">
                        Date
                        {sortField === "createdAt" &&
                          (sortDirection === "asc" ? (
                            <ChevronUpIcon className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                          ))}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("client")}
                      title="Cliquer pour trier par Nom"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-1">
                        Nom
                        {sortField === "client" &&
                          (sortDirection === "asc" ? (
                            <ChevronUpIcon className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                          ))}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("location")}
                      title="Cliquer pour trier par Location"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-1">
                        Location
                        {sortField === "location" &&
                          (sortDirection === "asc" ? (
                            <ChevronUpIcon className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                          ))}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("etape")}
                      title="Cliquer pour trier par Statut du projet"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-1">
                        Statut du projet
                        {sortField === "etape" &&
                          (sortDirection === "asc" ? (
                            <ChevronUpIcon className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                          ))}
                      </div>
                    </th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedProjects.map((project) => (
                    <motion.tr
                      key={project._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.createdAt
                          ? new Date(project.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      {/* Nom (Client & Projet) */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{project.client}</div>
                        <div className="text-sm text-gray-500">{project.projet}</div>
                      </td>
                      {/* Location */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.informationLogement?.typeDeLogement || "N/A"}
                      </td>
                      {/* Statut */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            !project.etape
                              ? "bg-gray-200 text-gray-800"
                              : project.etape.startsWith("1")
                              ? "bg-gray-200 text-gray-800"
                              : project.etape.startsWith("2")
                              ? "bg-blue-200 text-blue-800"
                              : project.etape.startsWith("3")
                              ? "bg-yellow-200 text-yellow-800"
                              : project.etape.startsWith("4")
                              ? "bg-green-200 text-green-800"
                              : project.etape.startsWith("5")
                              ? "bg-purple-200 text-purple-800"
                              : project.etape.startsWith("6")
                              ? "bg-orange-200 text-orange-800"
                              : project.etape.startsWith("7")
                              ? "bg-red-200 text-red-800"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {project.etape || "N/A"}
                        </span>
                      </td>
                      {/* Action */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/dashboard/admin/projects/${project._id}`}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition"
                        >
                          Voir le détail
                          <ArrowRightIcon className="w-4 h-4 ml-2" />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-6">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition disabled:opacity-50"
                >
                  Précédent
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 border rounded-md transition ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
