"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
// import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/Header";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  FunnelIcon,
  ChartBarIcon,
  // StarIcon, // Added missing SearchIcon import
} from "@heroicons/react/24/outline";
import { ChevronLeftIcon, SearchIcon } from "lucide-react";
// import { MagnifyingGlassIcon, ArrowPathIcon, ChartBarIcon, UserGroupIcon, BuildingOfficeIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";

// Define your colors object
const colors = {
  darkBlue: "#213f5b",
};

// Example getStatusInfo function that maps a project's etape to status details.
const getStatusInfo = (etape?: string) => {
  if (!etape) {
    return { color: "#ccc", textColor: "#000", icon: null };
  }

  const step = Number(etape.charAt(0));
  let color = "#bfddf9";
  let textColor = "#213f5b";
  let icon = null;

  switch (step) {
    case 1:
      color = "#bfddf9";
      textColor = "#213f5b";
      icon = <MagnifyingGlassIcon className="h-4 w-4 mr-1" />;
      break;
    case 2:
      color = "#d2fcb2";
      textColor = "#213f5b";
      icon = <ArrowPathIcon className="h-4 w-4 mr-1" />;
      break;
    case 3:
      color = "#f7b91b";
      textColor = "#213f5b";
      icon = <ChartBarIcon className="h-4 w-4 mr-1" />;
      break;
    case 4:
      color = "#a6e4d0";
      textColor = "#213f5b";
      icon = <UserGroupIcon className="h-4 w-4 mr-1" />;
      break;
    case 5:
      color = "#92d1e0";
      textColor = "#213f5b";
      icon = <BuildingOfficeIcon className="h-4 w-4 mr-1" />;
      break;
    case 6:
      color = "#7aafc2";
      textColor = "#213f5b";
      icon = <MapPinIcon className="h-4 w-4 mr-1" />;
      break;
    case 7:
      color = "#5d8ba3";
      textColor = "#ffffff";
      icon = <PhoneIcon className="h-4 w-4 mr-1" />;
      break;
    default:
      color = "#ccc";
      textColor = "#000";
      icon = null;
      break;
  }

  return { color, textColor, icon };
};


// ------------------------
// Types
// ------------------------
type Dossier = {
  _id: string;
  numero: string;
  client: string;
  projet: string;
  // numero: string;
  typeDeLogement: string;
  // solution: string;
  surfaceChauffee: number;
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

type Contact = {
  _id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  mailingAddress: string;
  email?: string;
  phone?: string;
};

// Mapping for step colors - updated with brand colors
// const stepStyles: { [key: string]: { bg: string; text: string } } = {
//   "1": { bg: "bg-[#bfddf9]/30", text: "text-[#213f5b]" },
//   "2": { bg: "bg-[#bfddf9]/50", text: "text-[#213f5b]" },
//   "3": { bg: "bg-[#d2fcb2]/30", text: "text-[#213f5b]" },
//   "4": { bg: "bg-[#d2fcb2]/50", text: "text-[#213f5b]" },
//   "5": { bg: "bg-[#213f5b]/20", text: "text-[#213f5b]" },
//   "6": { bg: "bg-[#213f5b]/30", text: "text-[#213f5b]" },
//   "7": { bg: "bg-[#213f5b]/50", text: "text-white" },
// };
// Define your timeline steps
const steps = [
  "Prise de contact",
  "En attente des documents",
  "Instruction du dossier",
  "Dossier Accepter",
  "Installation",
  "Contrôle",
  "Dossier clôturé",
];

// type SlideOverProps = {
//   selectedProject: Dossier | null;
//   setSelectedProject: (project: Dossier | null) => void;
// };

export default function ProjectsPage() {
  // Data and loading
  const [projects, setProjects] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  

  // Fetched contacts (mapping contactId => contact data)
  const [contacts, setContacts] = useState<{ [id: string]: Contact }>({});
  const [selectedProject, setSelectedProject] = useState<Dossier | null>(null);
  // Extract the current step number from the etape string.
  const currentStep = selectedProject ? parseInt(selectedProject.etape.split(" ")[0], 10) : 0;

  // Filtering state
  const [searchQuery, setSearchQuery] = useState<string>("");
  // One filter for solution (mimicking SalesContactsOrganizations)
  const [filter, setFilter] = useState("Tous");

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

// Helper Functions with explicit types
const getStepColor = (step: number): string => {
  const colors: { [key: number]: string } = {
    1: "#d2fcb2",   // business green
    2: "#bfddf9",   // business light blue
    3: "#f7b91b",   // business dark blue
    4: "#a6e4d0",   // custom derived shade
    5: "#92d1e0",   // custom derived shade
    6: "#7aafc2",   // custom derived shade
    7: "#5d8ba3",   // custom derived shade
  };
  return colors[step] || "#bfddf9";
};

const lightenColor = (color: string, percent: number): string => {
  const num = parseInt(color.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  let R = (num >> 16) + amt;
  let G = ((num >> 8) & 0x00ff) + amt;
  let B = (num & 0x0000ff) + amt;
  R = R < 255 ? (R < 0 ? 0 : R) : 255;
  G = G < 255 ? (G < 0 ? 0 : G) : 255;
  B = B < 255 ? (B < 0 ? 0 : B) : 255;
  return (
    "#" +
    ((1 << 24) + (R << 16) + (G << 8) + B)
      .toString(16)
      .slice(1)
  );
};

const getGradientColorForStep = (step: number): string => {
  const baseColor = getStepColor(step);
  // Create a gradient from the base color to a 20% lighter version.
  return `linear-gradient(90deg, ${baseColor}, ${lightenColor(baseColor, 20)})`;
};


  // Fetch projects (dossiers)
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

  // When projects change, fetch their contact data if available.
  useEffect(() => {
    projects.forEach((project) => {
      if (project.contactId && !contacts[project.contactId]) {
        fetch(`/api/contacts/${project.contactId}`)
          .then((res) => res.json())
          .then((data: Contact) => {
            setContacts((prev) => ({ ...prev, [project.contactId as string]: data }));
          })
          .catch((error) => {
            console.error("Erreur lors de la récupération du contact :", error);
          });
      }
    });
  }, [projects, contacts]);

  // Helper: Format the etape string to "Etape X - description"
  const formatEtape = (etape?: string) => {
    if (!etape) return "N/A";
    const parts = etape.split(" ");
    if (parts.length > 1 && !isNaN(Number(parts[0]))) {
      return `Etape ${parts[0]} - ${parts.slice(1).join(" ")}`;
    }
    return etape;
  };

  // Helper: Get bg and text classes based on the step number
  // const getEtapeStyles = (etape?: string) => {
  //   if (!etape) return "bg-gray-200 text-gray-800";
  //   const digit = etape.charAt(0);
  //   const style = stepStyles[digit];
  //   return style ? `${style.bg} ${style.text}` : "bg-gray-200 text-gray-800";
  // };

  // Filtering logic (ensuring string conversion)
  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      String(project.client || "").toLowerCase().includes(query) ||
      String(project.projet || "").toLowerCase().includes(query) ||
      String(project.numero || "").toLowerCase().includes(query);
    const matchesSolution =
      filter === "Tous" || project.solution.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesSolution;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredProjects.length / pageSize);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  // -------------------------------
  // Stats Calculations
  // -------------------------------
  // We'll use the total number of projects as "Total Clients"
  const totalClientsCount = projects.length;
  const solutionCounts = projects.reduce((acc, project) => {
    const sol = project.solution || "Autres";
    acc[sol] = (acc[sol] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
  const sortedSolutions = Object.entries(solutionCounts)
    .filter(([key]) => key !== "Autres")
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2);

  // Define solution filter options
  const solutionOptions = [
    "Tous",
    "Pompes a chaleur",
    "Chauffe-eau solaire individuel",
    "Chauffe-eau thermodynamique",
    "Système Solaire Combiné",
  ];

  // Calculate stage statistics
  const stageStats = projects.reduce((acc, project) => {
    const stageNumber = project.etape?.charAt(0) || "N/A";
    acc[stageNumber] = (acc[stageNumber] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-white to-[#bfddf9]/10">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-[#213f5b] mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-lg font-semibold text-[#213f5b]">
            Chargement des projets...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar placeholder */}
      {/* <motion.div
        className="relative border-r border-[#bfddf9]/30 bg-white w-16 md:w-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >

        <div className="p-4 hidden md:block">
          <div className="h-10 w-full bg-[#213f5b]/10 rounded-lg animate-pulse"></div>
          <div className="mt-8 space-y-4">
            <div className="h-8 w-full bg-[#bfddf9]/20 rounded-lg"></div>
            <div className="h-8 w-full bg-[#bfddf9]/20 rounded-lg"></div>
            <div className="h-8 w-full bg-[#213f5b]/10 rounded-lg"></div>
          </div>
        </div>
      </motion.div> */}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main
          className="flex-1 overflow-y-auto"
          style={{
            background:
              "linear-gradient(135deg, rgba(191,221,249,0.15), rgba(210,252,178,0.1))",
          }}
        >
          {/* Hero Section */}
          <div
            className="w-full py-8 md:py-10 relative overflow-hidden"
            style={{ backgroundColor: "#213f5b" }}
          >
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#bfddf9]/10 transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#d2fcb2]/10 transform -translate-x-1/3 translate-y-1/3"></div>

            <motion.div
              className="max-w-7xl mx-auto px-4 md:px-8 relative z-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-start md:items-center justify-between flex-col md:flex-row">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Liste des Projets
                  </h1>
                  <p className="mt-2 md:mt-4 text-base md:text-lg text-[#d2fcb2]">
                    Gérez et consultez tous les dossiers projets pour des solutions
                    énergétiques spécialisées.
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg px-4 py-2 inline-flex items-center text-sm transition-all border border-white/20 shadow-lg">
                    <ChartBarIcon className="h-4 w-4 mr-2" />
                    Voir les statistiques
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
            {/* Stats Section */}
            <motion.div
              className="mb-6 md:mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Total Clients */}
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border-l-4 border-[#213f5b] hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-500">
                      Total Clients
                    </p>
                    <h3 className="text-xl md:text-2xl font-bold text-[#213f5b]">
                      {totalClientsCount}
                    </h3>
                  </div>
                  <div className="p-2 md:p-3 rounded-full bg-[#bfddf9]/20">
                    <UserGroupIcon className="h-5 w-5 md:h-6 md:w-6 text-[#213f5b]" />
                  </div>
                </div>
              </div>

              {/* Active Projects */}
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border-l-4 border-[#d2fcb2] hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-500">
                      Projets Actifs
                    </p>
                    <h3 className="text-xl md:text-2xl font-bold text-[#213f5b]">
                      {stageStats["3"] + (stageStats["4"] || 0) + (stageStats["5"] || 0) || 0}
                    </h3>
                  </div>
                  <div className="p-2 md:p-3 rounded-full bg-[#d2fcb2]/20">
                    <BuildingOfficeIcon className="h-5 w-5 md:h-6 md:w-6 text-[#213f5b]" />
                  </div>
                </div>
              </div>

              {/* Top Solution */}
              {sortedSolutions[0] && (
                <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border-l-4 border-[#bfddf9] hover:shadow-lg transition-shadow">
                  <div>
                    <p className="text-xs md:text-sm text-gray-500">
                      Solution Principale
                    </p>
                    <h3 className="text-lg font-bold text-[#213f5b] truncate">
                      {sortedSolutions[0][0]}
                    </h3>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-[#bfddf9] h-1.5 rounded-full"
                        style={{
                          width: `${(sortedSolutions[0][1] / totalClientsCount) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {sortedSolutions[0][1]} clients (
                      {Math.round((sortedSolutions[0][1] / totalClientsCount) * 100)}%)
                    </p>
                  </div>
                </div>
              )}

              {/* Completed Projects */}
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border-l-4 border-[#213f5b] hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-500">
                      Projets Complétés
                    </p>
                    <h3 className="text-xl md:text-2xl font-bold text-[#213f5b]">
                      {stageStats["7"] || 0}
                    </h3>
                  </div>
                  <div className="p-2 md:p-3 rounded-full bg-[#213f5b]/10">
                    <ChartBarIcon className="h-5 w-5 md:h-6 md:w-6 text-[#213f5b]" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Search Bar & Filter Buttons */}
            <div className="mb-6 md:mb-8 bg-white p-4 rounded-xl shadow-sm border border-[#bfddf9]/30">
              <div className="relative mb-4">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="Rechercher par client, projet ou numéro..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-24 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#bfddf9] focus:border-transparent transition"
                />
                <div className="absolute right-3 top-2 flex items-center">
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="p-1.5 text-gray-500 hover:text-gray-700 transition mr-1"
                      title="Effacer la recherche"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={fetchProjects}
                    className="p-1.5 text-[#213f5b] bg-[#bfddf9]/10 rounded-lg hover:bg-[#bfddf9]/20 transition border border-[#bfddf9]/30"
                    title="Rafraîchir la liste"
                  >
                    <ArrowPathIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <FunnelIcon className="w-4 h-4 text-gray-500 mr-2" />
                <p className="text-sm text-gray-500 mr-4">Filtres:</p>
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {solutionOptions.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setFilter(item);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filter === item
                          ? "bg-[#213f5b] text-white shadow-sm"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-[#bfddf9] hover:bg-[#bfddf9]/10"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Project Count */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{filteredProjects.length}</span> projet
                {filteredProjects.length !== 1 ? "s" : ""} trouvé
                {filteredProjects.length !== 1 ? "s" : ""}
              </p>

              {paginatedProjects.length > 0 && (
                <p className="text-sm text-gray-600">
                  Page {currentPage} sur {totalPages}
                </p>
              )}
            </div>

            {/* Projects Cards Grid */}
            {paginatedProjects.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center border border-[#bfddf9]/20">
                <div className="flex flex-col items-center justify-center">
                  <div className="p-3 bg-[#bfddf9]/10 rounded-full mb-4">
                    <SearchIcon className="h-8 w-8 text-[#213f5b]/60" />
                  </div>
                  <h3 className="text-lg font-medium text-[#213f5b]">
                    Aucun projet trouvé
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Essayez de modifier vos filtres ou votre recherche
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilter("Tous");
                    }}
                    className="mt-4 px-4 py-2 bg-[#213f5b]/10 text-[#213f5b] rounded-lg hover:bg-[#213f5b]/20 transition"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {paginatedProjects.map((project) => {
                  // Use fetched contact data if available
                  const contact = project.contactId
                    ? contacts[project.contactId]
                    : null;
                  const initials = contact
                    ? `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`.toUpperCase()
                    : String(project.client || "").slice(0, 2).toUpperCase();
                  const clientName = contact
                    ? `${contact.firstName} ${contact.lastName}`
                    : project.client;
                  const email = contact?.email || "N/A";
                  const phone = contact?.phone || "N/A";
                  const locationStr = contact
                    ? contact.mailingAddress
                    : project.informationLogement?.typeDeLogement || "N/A";
                  const solution = project.solution;

                  return (
                    <motion.div
                      key={project._id}
                      className="relative bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -3 }}
                    >
                      {/* Decorative elements - reduced size */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#bfddf9]/20 rounded-bl-full z-0"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#d2fcb2]/15 rounded-tr-full z-0"></div>

                      {/* Client's initials in a circle - reduced size */}
                      <div className="flex items-center gap-3 mb-3 relative z-10">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-[#213f5b] to-[#bfddf9] text-white text-lg font-bold shadow-md">
                          {initials}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[#213f5b]">
                            {clientName}
                          </h3>
                          {project.numero && (
                            <p className="text-xs text-gray-500">
                              #{project.numero}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Info container with subtle background - reduced padding */}
                      <div className="bg-gradient-to-br from-white to-[#bfddf9]/10 rounded-lg p-3 mb-3 border border-[#bfddf9]/30">
                        {/* SOLUTION Section - tighter spacing */}
                        <div className="mb-2">
                          <p className="text-xs font-bold text-[#213f5b]/70 uppercase mb-1 flex items-center">
                            <span className="w-3 h-0.5 bg-[#d2fcb2] mr-1"></span>
                            SOLUTION
                          </p>
                          <div className="bg-[#bfddf9]/10 p-2 rounded-lg inline-block border border-[#bfddf9]/30">
                            <span className="text-xs font-medium text-[#213f5b]">
                              {solution}
                            </span>
                          </div>
                        </div>

                        {/* ÉTAPE DU PROJET Section - Advanced UI with Step-Specific Colors */}
                        <div className="mb-4">
                          <p className="text-xs font-bold text-[#213f5b] uppercase mb-2 flex items-center">
                            <span className="w-4 h-0.5 bg-[#d2fcb2] mr-2"></span>
                            ÉTAPE DU PROJET
                          </p>
                          <div className="space-y-3">
                            {/* Progress Bar with Step-Based Gradient */}
                            <div className="relative h-4 w-full bg-[#ffffff] border border-[#bfddf9] rounded-full overflow-hidden shadow-inner">
                              {project.etape && (
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${(Number(project.etape.charAt(0)) / 7) * 100}%`,
                                  }}
                                  transition={{ duration: 0.6 }}
                                  className="absolute h-full rounded-full"
                                  style={{
                                    background: getGradientColorForStep(Number(project.etape.charAt(0))),
                                  }}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                                </motion.div>
                              )}
                            </div>

                            {/* Step Indicator with Unique Colors per Step */}
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-[#213f5b]">
                                {formatEtape(project.etape)}
                              </span>
                              <div className="flex items-center gap-2">
                                {[...Array(7)].map((_, idx) => {
                                  const stepNumber = idx + 1;
                                  // Consider the step complete if the current etape is greater or equal to the step number.
                                  const completed = Number(project.etape?.charAt(0)) >= stepNumber;
                                  const stepColor = getStepColor(stepNumber);
                                  return (
                                    <div
                                      key={idx}
                                      className="w-6 h-6 flex items-center justify-center transition-transform transform hover:scale-110"
                                      title={`Step ${stepNumber}`}
                                    >
                                      <div
                                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                          completed
                                            ? ""
                                            : "bg-[#ffffff] border border-[#bfddf9]"
                                        }`}
                                        style={completed ? { background: stepColor } : {}}
                                      >
                                        <span className="text-[10px] text-[#213f5b]">
                                          {stepNumber}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact information - condensed */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-2 p-1 hover:bg-[#bfddf9]/5 rounded-lg transition-colors">
                          <div className="bg-[#213f5b]/5 p-1.5 rounded-full">
                            <EnvelopeIcon className="h-3 w-3 text-[#213f5b]" />
                          </div>
                          <span className="text-xs text-gray-700 truncate">
                            {email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 p-1 hover:bg-[#bfddf9]/5 rounded-lg transition-colors">
                          <div className="bg-[#213f5b]/5 p-1.5 rounded-full">
                            <PhoneIcon className="h-3 w-3 text-[#213f5b]" />
                          </div>
                          <span className="text-xs text-gray-700">{phone}</span>
                        </div>
                        <div className="flex items-center gap-2 p-1 hover:bg-[#bfddf9]/5 rounded-lg transition-colors">
                          <div className="bg-[#213f5b]/5 p-1.5 rounded-full">
                            <MapPinIcon className="h-3 w-3 text-[#213f5b]" />
                          </div>
                          <span className="text-xs text-gray-700 truncate">
                            {locationStr}
                          </span>
                        </div>
                      </div>

                      {/* Action button - reduced padding */}
                      <div className="mt-auto">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="group inline-flex items-center justify-center w-full py-2 px-4 bg-[#213f5b] text-white rounded-lg transition-all hover:bg-[#213f5b]/90 hover:shadow-md text-sm"
                      >
                        <span>Voir le détail</span>
                        <ChevronRightIcon className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </button>

                      </div>

                      

                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg flex items-center gap-2 text-[#213f5b] border border-[#bfddf9]/40 hover:bg-[#bfddf9]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Précédent</span>
              </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show first, last, current and surrounding pages
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                        currentPage === pageNum
                          ? "bg-[#213f5b] text-white shadow-lg"
                          : "text-[#213f5b] hover:bg-[#bfddf9]/20 border border-[#bfddf9]/40"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg flex items-center gap-2 text-[#213f5b] border border-[#bfddf9]/40 hover:bg-[#bfddf9]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="text-sm font-medium">Suivant</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Footer spacing */}
            <div className="h-8"></div>
          </div>
        </main>
      </div>
      {/* Project Detail Slide-Over Panel */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
            />
            
            {/* Slide-over panel */}
            <motion.div 
              className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-[#213f5b]">Détails du projet</h2>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 overflow-auto p-6">
                {/* Project Header */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-1">
                    <span 
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: getStatusInfo(selectedProject.etape).color,
                        color: getStatusInfo(selectedProject.etape).textColor 
                      }}
                    >
                      {getStatusInfo(selectedProject.etape).icon}
                      {selectedProject.etape}
                    </span>
                    <span className="text-sm text-gray-500">#{selectedProject.numero}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#213f5b]">{selectedProject.typeDeLogement}</h3>
                </div>
                
                {/* Project Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Solution</h4>
                    <p className="text-[#213f5b]">{selectedProject.solution}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Surface chauffée</h4>
                    <p className="text-[#213f5b]">{selectedProject.surfaceChauffee} m²</p>
                  </div>
                  
                  {/* Timeline using real data */}
                  <div className="mt-8">
                    <h4 className="text-sm font-medium text-gray-500 mb-4">Progression du projet</h4>
                    
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200"></div>
                      
                      <div className="space-y-6">
                        {steps.map((step, index) => {
                          const stepNumber = index + 1;
                          let bgColor, icon;
                          if (stepNumber < currentStep) {
                            // Completed steps
                            bgColor = "bg-[#d2fcb2]";
                            // textColor = "text-[#213f5b]";
                            icon = (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#213f5b]" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            );
                          } else if (stepNumber === currentStep) {
                            // Current step
                            bgColor = "bg-[#bfddf9]";
                            // textColor = "text-[#213f5b]";
                            icon = (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#213f5b]" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            );
                          } else {
                            // Pending steps
                            bgColor = "bg-gray-200";
                            // textColor = "text-gray-500";
                            icon = <span className="text-xs font-medium">{stepNumber}</span>;
                          }
                          return (
                            <div className="flex" key={index}>
                              <div className={`flex-shrink-0 h-8 w-8 rounded-full ${bgColor} flex items-center justify-center relative z-10`}>
                                {icon}
                              </div>
                              <div className="ml-4">
                                <h5 className={`text-sm font-medium ${stepNumber <= currentStep ? "text-[#213f5b]" : "text-gray-400"}`}>{step}</h5>
                                {/* Optionally, add dates for each step if available */}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100">
                <Link href={`/dashboard/admin/projects/${selectedProject._id}`}>
                  <motion.button
                    className="w-full py-3 rounded-xl text-white font-medium"
                    style={{ backgroundColor: colors.darkBlue }}
                    whileHover={{ opacity: 0.9 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Voir tous les détails
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
