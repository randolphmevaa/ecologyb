"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ChevronRightIcon, 

  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import ChatWidget from '@/components/ChatWidget';
import { 

  MapPinIcon,

} from "@heroicons/react/24/outline";

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
  const [loading, setLoading] = useState(true);
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sortBy] = useState<keyof Project>("etape");
  const [sortDirection] = useState("asc");

  // Real data for timeline steps (could be fetched from an API as well)
  const steps = [
    "Prise de contact",
    "En attente des documents",
    "Instruction du dossier",
    "Dossier Accepter",
    "Installation",
    "Contrôle",
    "Dossier clôturé",
  ];
  // currentStep might be a value like 2 (meaning the project is on the second step)
  const currentStep = selectedProject ? parseInt(selectedProject.etape.split(" ")[0], 10) : 0;
  
  // Brand colors
  const colors = {
    white: "#ffffff",
    lightBlue: "#bfddf9",
    lightGreen: "#d2fcb2",
    darkBlue: "#213f5b"
  };

  // Fetch projects (dossiers) for the logged-in client
  useEffect(() => {
    async function fetchProjects() {
      try {
        const storedInfo = localStorage.getItem("clientInfo");
        if (storedInfo) {
          const clientInfo = JSON.parse(storedInfo);
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

  // Handle sorting


  // Filter and sort projects
  const filteredAndSortedProjects = projects
    .filter(project => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        project.numero.toLowerCase().includes(searchLower) ||
        project.typeDeLogement.toLowerCase().includes(searchLower) ||
        project.solution.toLowerCase().includes(searchLower) ||
        project.etape.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      // Handle special case for solution field which needs to be trimmed
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Get project status with color
  const getStatusInfo = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("terminé")) {
      return { 
        color: colors.lightGreen, 
        textColor: colors.darkBlue,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      };
    } else if (statusLower.includes("en cours")) {
      return { 
        color: colors.lightBlue, 
        textColor: colors.darkBlue,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        )
      };
    } else {
      return { 
        color: "rgba(191, 221, 249, 0.4)", 
        textColor: colors.darkBlue,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        )
      };
    }
  };

  // Helper functions for the new card design
  const getStepColor = (step: number): string => {
    const colors: { [key: number]: string } = {
      1: "#d2fcb2",   // Light green
      2: "#bfddf9",   // Light blue
      3: "#f7b91b",   // Amber
      4: "#a6e4d0",   // Mint
      5: "#92d1e0",   // Sky blue
      6: "#7aafc2",   // Steel blue
      7: "#5d8ba3",   // Blue gray
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
    // Create a gradient from the base color to a 20% lighter version
    return `linear-gradient(90deg, ${baseColor}, ${lightenColor(baseColor, 20)})`;
  };

  // Format etape for display
  const formatEtape = (etape?: string) => {
    if (!etape) return "N/A";
    const parts = etape.split(" ");
    if (parts.length > 1 && !isNaN(Number(parts[0]))) {
      return `Etape ${parts[0]} - ${parts.slice(1).join(" ")}`;
    }
    return etape;
  };

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  // Get project initials for display
  const getProjectInitials = (project: Project) => {
    return project.typeDeLogement.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#fafbfd]">
      {/* Header component */}
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        {/* Hero Section with "Nouveau projet" button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-12 sm:py-16 flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#213f5b]">
              Mes Projets
            </h1>
            <p className="mt-3 text-lg text-gray-600 max-w-3xl">
              Suivez l&apos;avancement de vos projets d&apos;installations énergétiques en temps réel.
            </p>
          </div>
          <Link href="/client/contacts">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(33, 63, 91, 0.3)" }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#213f5b] to-[#1a3a5f] text-white rounded-xl transition-all duration-300"
          >
            <PlusIcon className="h-5 w-5" />
            Nouveau projet
          </motion.button>
          </Link>
        </motion.div>

        {/* Search Bar - Sleek, minimalist design */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="relative max-w-lg">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-white border-none rounded-xl shadow-sm focus:ring-2 focus:ring-[#bfddf9] placeholder-gray-400 text-[#213f5b]"
              style={{ boxShadow: "0 2px 10px rgba(191, 221, 249, 0.15)" }}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#213f5b] opacity-60 hover:opacity-100"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Projects Grid - Card-based layout */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-[#bfddf9]/30 rounded-full animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-full border-t-4 border-[#213f5b] rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <>
            {filteredAndSortedProjects.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredAndSortedProjects.map((project) => {
                  // Get step number from etape
                  const stepNumber = parseInt(project.etape.charAt(0), 10);
                  
                  return (
                    <motion.div
                      key={project._id}
                      variants={itemVariants}
                      whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(33, 63, 91, 0.1)" }}
                      className="relative bg-white rounded-xl p-4 shadow-md transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
                      onClick={() => setSelectedProject(project)}
                    >
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#bfddf9]/20 rounded-bl-full z-0"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#d2fcb2]/15 rounded-tr-full z-0"></div>
                      
                      {/* Project Header with Initials */}
                      <div className="flex items-center gap-3 mb-3 relative z-10">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-[#213f5b] to-[#bfddf9] text-white text-lg font-bold shadow-md">
                          {getProjectInitials(project)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[#213f5b] truncate">
                            {project.typeDeLogement}
                          </h3>
                          {project.numero && (
                            <p className="text-xs text-gray-500">
                              #{project.numero}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Project info section */}
                      <div className="bg-gradient-to-br from-white to-[#bfddf9]/10 rounded-lg p-3 mb-3 border border-[#bfddf9]/30">
                        {/* Solution */}
                        <div className="mb-2">
                          <p className="text-xs font-bold text-[#213f5b]/70 uppercase mb-1 flex items-center">
                            <span className="w-3 h-0.5 bg-[#d2fcb2] mr-1"></span>
                            SOLUTION
                          </p>
                          <div className="bg-[#bfddf9]/10 p-2 rounded-lg inline-block border border-[#bfddf9]/30">
                            <span className="text-xs font-medium text-[#213f5b]">
                              {project.solution}
                            </span>
                          </div>
                        </div>
                        
                        {/* Project Progress */}
                        <div className="mb-2">
                          <p className="text-xs font-bold text-[#213f5b] uppercase mb-2 flex items-center">
                            <span className="w-4 h-0.5 bg-[#d2fcb2] mr-2"></span>
                            ÉTAPE DU PROJET
                          </p>
                          
                          {/* Progress Bar */}
                          <div className="relative h-3 w-full bg-[#ffffff] border border-[#bfddf9] rounded-full overflow-hidden shadow-inner mb-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(stepNumber / 7) * 100}%` }}
                              transition={{ duration: 0.6 }}
                              className="absolute h-full rounded-full"
                              style={{ background: getGradientColorForStep(stepNumber) }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                            </motion.div>
                          </div>
                          
                          {/* Step Indicator */}
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-[#213f5b]">
                              {formatEtape(project.etape)}
                            </span>
                            
                            {/* Step Dots */}
                            <div className="flex items-center gap-1">
                              {[...Array(7)].map((_, idx) => {
                                const dotStepNumber = idx + 1;
                                const completed = stepNumber >= dotStepNumber;
                                const stepColor = getStepColor(dotStepNumber);
                                return (
                                  <div
                                    key={idx}
                                    className="w-4 h-4 flex items-center justify-center"
                                    title={`Étape ${dotStepNumber}`}
                                  >
                                    <div
                                      className={`w-2.5 h-2.5 rounded-full ${
                                        completed
                                          ? ""
                                          : "bg-[#ffffff] border border-[#bfddf9]"
                                      }`}
                                      style={completed ? { background: stepColor } : {}}
                                    ></div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Surface Information */}
                      <div className="flex items-center gap-2 p-2 mb-2 hover:bg-[#bfddf9]/5 rounded-lg transition-colors">
                        <div className="bg-[#213f5b]/5 p-1.5 rounded-full">
                          <MapPinIcon className="h-3.5 w-3.5 text-[#213f5b]" />
                        </div>
                        <span className="text-sm text-gray-700">
                          Surface: {project.surfaceChauffee} m²
                        </span>
                      </div>
                      
                      {/* View Details Button */}
                      <div className="mt-auto pt-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the parent onClick
                            setSelectedProject(project);
                          }}
                          className="group inline-flex items-center justify-center w-full py-2 px-4 bg-[#213f5b] text-white rounded-lg transition-all hover:bg-[#213f5b]/90 hover:shadow-md text-sm"
                        >
                          <span>Voir le détail</span>
                          <ChevronRightIcon className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 px-6 rounded-xl bg-white shadow-sm"
              >
                <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-[#f5f9ff]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#bfddf9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#213f5b] mb-2">Aucun projet trouvé</h3>
                <p className="text-gray-600 text-center max-w-md">
                  {searchTerm ? "Essayez de modifier vos critères de recherche pour trouver votre projet." : "Vous n'avez pas encore de projets actifs."}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-6 px-6 py-3 bg-[#f5f9ff] text-[#213f5b] rounded-xl hover:bg-[#e8f1fc] transition-colors font-medium"
                  >
                    Réinitialiser la recherche
                  </button>
                )}
              </motion.div>
            )}
          </>
        )}
      </main>

      {/* Enhanced Chat Button */}
      {!showChatWidget && (
        <motion.button
          onClick={() => setShowChatWidget(true)}
          className="fixed bottom-8 right-8 bg-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all z-50 border border-gray-200 backdrop-blur-lg bg-opacity-80"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 bg-gradient-to-br from-[#213f5b] to-[#1e81b0] rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
          </div>
        </motion.button>
      )}
      
      {/* Chat Widget (visible if showChatWidget === true) */}
      {showChatWidget && (
        <ChatWidget
          onClose={() => {
            setShowChatWidget(false);
          }}
        />
      )}

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
                          icon = (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#213f5b]" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          );
                        } else if (stepNumber === currentStep) {
                          // Current step
                          bgColor = "bg-[#bfddf9]";
                          icon = (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#213f5b]" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          );
                        } else {
                          // Pending steps
                          bgColor = "bg-gray-200";
                          icon = <span className="text-xs font-medium">{stepNumber}</span>;
                        }
                        return (
                          <div className="flex" key={index}>
                            <div className={`flex-shrink-0 h-8 w-8 rounded-full ${bgColor} flex items-center justify-center relative z-10`}>
                              {icon}
                            </div>
                            <div className="ml-4">
                              <h5 className={`text-sm font-medium ${stepNumber <= currentStep ? "text-[#213f5b]" : "text-gray-400"}`}>{step}</h5>
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
              <Link href={`/client/projects/${selectedProject._id}`}>
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
