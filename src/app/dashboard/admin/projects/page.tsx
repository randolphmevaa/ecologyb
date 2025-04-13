'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { useGlobalIFrame } from "@/contexts/GlobalIFrameContext";
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
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { 
  ChevronLeftIcon, 
  SearchIcon
} from "lucide-react";

// Define status option type
type StatusOption = {
  id: string;
  value: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: React.ReactNode;
};

// Define status info return type
type StatusInfo = {
  color: string;
  textColor: string;
  icon: React.ReactNode | null;
};

// Sample status options with detailed information
const statusOptions: StatusOption[] = [
  { 
    id: "pending", 
    value: "En attente de paiement", 
    color: "bg-amber-100 text-amber-800 border-amber-200",
    bgColor: "#FEF3C7", 
    textColor: "#92400E", 
    borderColor: "#FDE68A",
    icon: <ClockIcon className="h-4 w-4 mr-1" />
  },
  { 
    id: "paid", 
    value: "Payé", 
    color: "bg-green-100 text-green-800 border-green-200",
    bgColor: "#D1FAE5", 
    textColor: "#065F46", 
    borderColor: "#A7F3D0",
    icon: <CheckCircleIcon className="h-4 w-4 mr-1" />
  },
  { 
    id: "in-progress", 
    value: "En cours", 
    color: "bg-blue-100 text-blue-800 border-blue-200",
    bgColor: "#DBEAFE", 
    textColor: "#1E40AF", 
    borderColor: "#BFDBFE",
    icon: <ArrowPathIcon className="h-4 w-4 mr-1" />
  },
  { 
    id: "completed", 
    value: "Terminé", 
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    bgColor: "#E0E7FF", 
    textColor: "#3730A3", 
    borderColor: "#C7D2FE",
    icon: <CheckCircleIcon className="h-4 w-4 mr-1" />
  },
  { 
    id: "canceled", 
    value: "Annulé", 
    color: "bg-red-100 text-red-800 border-red-200",
    bgColor: "#FEE2E2", 
    textColor: "#991B1B", 
    borderColor: "#FECACA",
    icon: <ExclamationCircleIcon className="h-4 w-4 mr-1" />
  }
];

// Get status details for a given status value
const getStatusDetails = (statusValue: string): StatusOption => {
  const status = statusOptions.find(s => s.value === statusValue);
  return status || statusOptions[0]; // Default to "pending" if not found
};

// Example getStatusInfo function that maps a project's etape to status details.
const getStatusInfo = (etape?: string): StatusInfo => {
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


// Types
// ------------------------
// Adding TypeScript types for the API response data
type Contact = {
  _id: string;
  imageUrl: string;
  lastName: string;
  firstName: string;
  dateOfBirth: string;
  mailingAddress: string;
  phone: string;
  email: string;
  role: string;
  numeroDossier: string;
  department: string;
  gestionnaireSuivi: string;
  comments: string;
  maprNumero: string;
  mpremail: string;
  mprpassword: string;
  climateZone: string;
  rfr: string;
  eligible: string;
  contactId: string;
  id: string;
  password: string;
  plainPassword: string;
  createdAt: string;
};

type Dossier = {
  _id: string;
  contactId?: string; // Made optional to accommodate sample data
  numero: string;
  assignedTeam?: string;
  projet?: string[] | string;
  surfaceChauffee?: string | number;
  typeCompteurElectrique?: string;
  solution?: string;
  anneeConstruction?: string;
  typeDeLogement?: string;
  profil?: string;
  nombrePersonne?: string;
  codePostal?: string;
  mprColor?: string;
  etape?: string;
  typeTravaux?: string;
  assignedRegie?: string;
  prix?: string;
  statut?: string;
  description?: string;
  client?: string; // Added for display purposes
  valeur?: string; // Added for display purposes
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
  status?: string; // For status display
};

// Define API response type to avoid using 'any'
type RawDossierData = {
  _id: string;
  contactId?: string;
  numero: string;
  assignedTeam?: string;
  projet?: string[] | string;
  surfaceChauffee?: string | number;
  typeCompteurElectrique?: string;
  solution?: string;
  anneeConstruction?: string;
  typeDeLogement?: string;
  profil?: string;
  nombrePersonne?: string;
  codePostal?: string;
  mprColor?: string;
  etape?: string;
  typeTravaux?: string;
  assignedRegie?: string;
  prix?: string;
  statut?: string;
  description?: string;
};

// Define timeline steps
const steps = [
  "Prise de contact",
  "En attente des documents",
  "Instruction du dossier",
  "Dossier Accepter",
  "Installation",
  "Contrôle",
  "Dossier clôturé",
];

export default function ClientsPage() {
  // Get the global iframe context
  const { openIframe } = useGlobalIFrame();

  // Data and loading
  const [projects, setProjects] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetched contacts (mapping contactId => contact data)
  const [contacts, setContacts] = useState<{ [id: string]: Contact }>({});
  const [selectedProject, setSelectedProject] = useState<Dossier | null>(null);
  // Extract the current step number from the etape string.
  const currentStep = selectedProject ? parseInt(selectedProject.etape?.split(" ")[0] || "0", 10) : 0;

  // Filtering state
  const [searchQuery, setSearchQuery] = useState<string>("");
  // One filter for solution (mimicking SalesContactsOrganizations)
  const [filter, setFilter] = useState("Tous");

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Enhanced helper functions with improved color schemes
  const getStepColor = (step: number): string => {
    const colors: { [key: number]: string } = {
      1: "#4facfe",   // Bright blue for initial contact
      2: "#43e97b",   // Vibrant green for documents
      3: "#f7b91b",   // Amber for processing
      4: "#38c2de",   // Teal for accepted 
      5: "#32a7c1",   // Mid blue for installation
      6: "#2d98c5",   // Ocean blue for control
      7: "#1d6fa5",   // Deep blue for closure
    };
    return colors[step] || "#4facfe";
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
    // Create a more interesting gradient with a shift in hue
    const lighterColor = lightenColor(baseColor, 30);
    return `linear-gradient(90deg, ${baseColor}, ${lighterColor})`;
  };

  // Fetch projects (dossiers) from the API
  const fetchProjects = async () => {
    setLoading(true);
    
    try {
      // Fetch dossiers data from API
      const dossiersResponse = await fetch('/api/dossiers');
      if (!dossiersResponse.ok) {
        throw new Error('Failed to fetch dossiers');
      }
      
      const dossiersData = await dossiersResponse.json();
      
      // Fetch contacts data from API
      const contactsResponse = await fetch('/api/contacts');
      if (!contactsResponse.ok) {
        throw new Error('Failed to fetch contacts');
      }
      
      const contactsData = await contactsResponse.json();
      
      // Convert contacts array to object with contactId as key for quick lookup
      const contactsMap = contactsData.reduce((acc: { [key: string]: Contact }, contact: Contact) => {
        acc[contact.contactId] = contact;
        return acc;
      }, {});
      
      // Set contacts in state
      setContacts(contactsMap);
      
      // Process dossiers to include client name and other necessary display fields
      const processedDossiers = dossiersData.map((dossier: RawDossierData): Dossier => {
        const contact = dossier.contactId ? contactsMap[dossier.contactId] : undefined;
        
        // Generate fallback status based on etape
        let status = "En attente de paiement";
        const step = Number(dossier.etape?.charAt(0) || 0);
        if (step >= 6) status = "Terminé";
        else if (step >= 4) status = "En cours";
        
        return {
          ...dossier,
          // Create client field by combining firstName and lastName from the contact
          client: contact ? `${contact.firstName} ${contact.lastName}` : `Dossier #${dossier.numero}`,
          // Use solution string as projet display if projet is an array
          projet: Array.isArray(dossier.projet) ? dossier.projet.join(', ') : dossier.solution,
          // Set valeur to prix if available, or default value
          valeur: dossier.prix || "15000",
          // Set status based on step
          status
        };
      });
      
      setProjects(processedDossiers);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to sample data in case of error
      // This would include your sample data as a fallback
      const sampleProjects: Dossier[] = [
        {
          _id: "1",
          contactId: "sample-contact-1", // Added to satisfy type requirements
          numero: "D2023-001",
          client: "Martin Dupont",
          projet: "Installation chauffage",
          typeDeLogement: "Maison individuelle",
          surfaceChauffee: "120",
          solution: "Pompes a chaleur",
          etape: "5 Installation",
          valeur: "15000",
          typeTravaux: "Mono-geste",
          codePostal: "75001",
          status: "En cours"
        },
        {
          _id: "2",
          contactId: "sample-contact-2",
          numero: "D2023-002",
          client: "Sophie Martin",
          projet: "Rénovation énergétique",
          typeDeLogement: "Appartement",
          surfaceChauffee: "85",
          solution: "Panneaux photovoltaique",
          etape: "6 Contrôle",
          valeur: "8500",
          typeTravaux: "Rénovation d'ampleur",
          codePostal: "69002",
          status: "En attente de paiement"
        },
        {
          _id: "3",
          contactId: "sample-contact-3",
          numero: "D2023-003",
          client: "Jean Leclerc",
          projet: "Installation chauffe-eau",
          typeDeLogement: "Maison individuelle",
          surfaceChauffee: "150",
          solution: "Chauffe-eau thermodynamique",
          etape: "7 Dossier clôturé",
          valeur: "3200",
          typeTravaux: "Mono-geste",
          codePostal: "33000",
          status: "Payé"
        }
      ];
      
      setProjects(sampleProjects);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Add hint for double-click action
  useEffect(() => {
    // Show a tooltip on first visit
    const hasSeenDoubleClickHint = localStorage.getItem('hasSeenDoubleClickHint');
    if (!hasSeenDoubleClickHint && projects.length > 0) {
      // Set tooltip visibility
      setTimeout(() => {
        const tooltip = document.createElement('div');
        tooltip.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-[#213f5b] text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center animate-bounce';
        tooltip.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#4facfe]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Double-cliquez sur une carte pour ouvrir le projet</span>
        `;
        document.body.appendChild(tooltip);
        
        // Remove after 5 seconds
        setTimeout(() => {
          tooltip.classList.add('opacity-0');
          tooltip.style.transition = 'opacity 0.5s ease-out';
          setTimeout(() => {
            document.body.removeChild(tooltip);
          }, 500);
        }, 5000);
        
        localStorage.setItem('hasSeenDoubleClickHint', 'true');
      }, 1000);
    }
  }, [projects.length]);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Helper: Format the etape string to "Etape X - description"
  const formatEtape = (etape?: string) => {
    if (!etape) return "N/A";
    const parts = etape.split(" ");
    if (parts.length > 1 && !isNaN(Number(parts[0]))) {
      return `Etape ${parts[0]} - ${parts.slice(1).join(" ")}`;
    }
    return etape;
  };

  // Filtering logic (ensuring string conversion)
  const filteredProjects = projects.filter((project) => {
    // Only include steps 5, 6, 7
    const includedSteps = [5, 6, 7];
    const stepNumber = parseInt(project.etape?.charAt(0) ?? "0", 10);
  
    // If the project's etape is not 5, 6, or 7, exclude it
    if (!includedSteps.includes(stepNumber)) {
      return false;
    }
  
    // Existing search & filter checks
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      String(project.client || "").toLowerCase().includes(query) ||
      String(project.projet || "").toLowerCase().includes(query) ||
      String(project.numero || "").toLowerCase().includes(query);
  
    // Filter by typeTravaux instead of solution
    const matchesTypeTravaux =
      filter === "Tous" ||
      (project.typeTravaux?.toLowerCase() === filter.toLowerCase());
  
    return matchesSearch && matchesTypeTravaux;
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

  // 2. Compute *all stats* from the filteredProjects array.
  const totalClientsCount = filteredProjects.length;

  // For stageStats
  const stageStats = filteredProjects.reduce((acc: { [key: string]: number }, project) => {
    const stageNumber = project.etape?.charAt(0) || "N/A";
    acc[stageNumber] = (acc[stageNumber] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Add type travaux filter options
  const typeTravauxOptions = [
    "Tous",
    "Mono-geste",
    "Financement", 
    "Rénovation d'ampleur",
    "Panneaux photovoltaique"
  ];

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
            style={{ 
              background: "linear-gradient(135deg, #213f5b, #1a324a)" 
            }}
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
                    Liste des Clients
                  </h1>
                  <p className="mt-2 md:mt-4 text-base md:text-lg text-[#d2fcb2]">
                    Gérez et consultez tous les dossiers projets pour des solutions
                    énergétiques spécialisées.
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Link href={"/dashboard/admin/reports"}>
                    <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg px-4 py-2 inline-flex items-center text-sm transition-all border border-white/20 shadow-lg">
                      <ChartBarIcon className="h-4 w-4 mr-2" />
                      Voir les statistiques
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
            {/* Stats Section - Updated with new labels and improved UI */}
            <motion.div
              className="mb-6 md:mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Total Clients */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="flex h-full">
                  <div className="w-2 bg-gradient-to-b from-[#4facfe] to-[#1d6fa5]"></div>
                  <div className="flex-1 p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">Total Clients</p>
                        <h3 className="text-xl md:text-2xl font-bold text-[#213f5b] mt-1">
                          {totalClientsCount}
                        </h3>
                      </div>
                      <div className="p-2 md:p-3 rounded-full bg-[#4facfe]/10 group-hover:bg-[#4facfe]/20 transition-all">
                        <UserGroupIcon className="h-5 w-5 md:h-6 md:w-6 text-[#4facfe]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Projets en Installation */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="flex h-full">
                  <div className="w-2 bg-gradient-to-b from-[#43e97b] to-[#38f9d7]"></div>
                  <div className="flex-1 p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">Projets en Installation</p>
                        <h3 className="text-xl md:text-2xl font-bold text-[#213f5b] mt-1">
                          {stageStats["5"] || 0}
                        </h3>
                      </div>
                      <div className="p-2 md:p-3 rounded-full bg-[#43e97b]/10 group-hover:bg-[#43e97b]/20 transition-all">
                        <BuildingOfficeIcon className="h-5 w-5 md:h-6 md:w-6 text-[#43e97b]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Projets en Contrôle */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="flex h-full">
                  <div className="w-2 bg-gradient-to-b from-[#f7b91b] to-[#f59e0b]"></div>
                  <div className="flex-1 p-4 md:p-6">
                    <div>
                      <p className="text-xs md:text-sm text-gray-500 font-medium">Projets en Contrôle</p>
                      <h3 className="text-lg font-bold text-[#213f5b] mt-1">
                        {stageStats["6"] || 0}
                      </h3>
                      <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#f7b91b] to-[#f59e0b]"
                          style={{
                            width: `${((stageStats["6"] || 0) / totalClientsCount) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.round(((stageStats["6"] || 0) / totalClientsCount) * 100) || 0}% des projets
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Projets Complétés */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="flex h-full">
                  <div className="w-2 bg-gradient-to-b from-[#38c2de] to-[#1d6fa5]"></div>
                  <div className="flex-1 p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">
                          Projets Complétés
                        </p>
                        <h3 className="text-xl md:text-2xl font-bold text-[#213f5b] mt-1">
                          {stageStats["7"] || 0}
                        </h3>
                      </div>
                      <div className="p-2 md:p-3 rounded-full bg-[#38c2de]/10 group-hover:bg-[#38c2de]/20 transition-all">
                        <ChartBarIcon className="h-5 w-5 md:h-6 md:w-6 text-[#38c2de]" />
                      </div>
                    </div>
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
                  className="w-full pl-12 pr-24 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition"
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
                  {typeTravauxOptions.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setFilter(item);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filter === item
                          ? "bg-gradient-to-r from-[#213f5b] to-[#1d6fa5] text-white shadow-sm"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-[#4facfe] hover:bg-[#4facfe]/10"
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
                  // Use fetched contact data if available with safeguards
                  const contact = project.contactId
                    ? contacts[project.contactId]
                    : null;
                  const initials = contact && contact.firstName && contact.lastName
                    ? `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`.toUpperCase()
                    : String(project.client || project.numero || "NA").slice(0, 2).toUpperCase();
                  const clientName = contact && (contact.firstName || contact.lastName)
                    ? `${contact.firstName || ""} ${contact.lastName || ""}`.trim()
                    : project.client || `Dossier #${project.numero}`;
                  const email = contact?.email || "Email non disponible";
                  const phone = contact?.phone || "Téléphone non disponible";
                  const locationStr = contact && contact.mailingAddress
                    ? contact.mailingAddress
                    : project.informationLogement?.typeDeLogement || project.codePostal || "Adresse non disponible";
                  const solution = project.solution || "Non spécifié";
                  const typeTravaux = project.typeTravaux || "Non spécifié";
                  const stepNumber = Number(project.etape?.charAt(0)) || 1;
                  
                  // Get status details
                  const statusDetail = getStatusDetails(project.status || "En attente de paiement");

                  return (
                    <motion.div
                      key={project._id}
                      className="relative bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -3 }}
                    >
                      {/* Status indicator stripe at top */}
                      <div 
                        className="absolute top-0 left-0 right-0 h-1 z-10"
                        style={{ background: getGradientColorForStep(stepNumber) }}
                      ></div>
                      
                      {/* Decorative elements with improved styling */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#4facfe]/5 to-[#4facfe]/15 rounded-bl-full z-0 group-hover:scale-110 transition-transform duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#43e97b]/5 to-[#43e97b]/15 rounded-tr-full z-0 group-hover:scale-110 transition-transform duration-500"></div>

                      {/* Client's initials and status badge */}
                      <div className="flex items-start justify-between mb-3 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-[#4facfe] to-[#1d6fa5] text-white text-lg font-bold shadow-md">
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
                        
                        {/* Status Badge - NEW */}
                        <div 
                          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center`}
                          style={{ 
                            backgroundColor: statusDetail.bgColor,
                            color: statusDetail.textColor,
                            border: `1px solid ${statusDetail.borderColor}`
                          }}
                        >
                          {statusDetail.icon}
                          {project.status || "En attente de paiement"}
                        </div>
                      </div>

                      {/* Info container with improved background */}
                      <div className="bg-gradient-to-br from-white to-[#f9fbff] rounded-lg p-3 mb-3 border border-[#e0eefb] shadow-sm">
                        {/* SOLUTION Section - with improved styling */}
                        <div className="mb-2">
                          <p className="text-xs font-bold text-[#213f5b]/70 uppercase mb-1 flex items-center">
                            <span className="w-3 h-0.5 bg-[#43e97b] mr-1"></span>
                            SOLUTION
                          </p>
                          <div className="bg-[#4facfe]/10 p-2 rounded-lg inline-block border border-[#4facfe]/20">
                            <span className="text-xs font-medium text-[#213f5b]">
                              {solution}
                            </span>
                          </div>
                        </div>

                        {/* TYPE DE TRAVAUX Section */}
                        <div className="mb-2">
                          <p className="text-xs font-bold text-[#213f5b]/70 uppercase mb-1 flex items-center">
                            <span className="w-3 h-0.5 bg-[#f7b91b] mr-1"></span>
                            TYPE DE TRAVAUX
                          </p>
                          <div className="bg-[#f7b91b]/10 p-2 rounded-lg inline-block border border-[#f7b91b]/20">
                            <span className="text-xs font-medium text-[#213f5b]">
                              {typeTravaux}
                            </span>
                          </div>
                        </div>

                        {/* ÉTAPE DU PROJET Section - Enhanced UI with advanced progress styling */}
                        <div className="mb-4">
                          <p className="text-xs font-bold text-[#213f5b] uppercase mb-2 flex items-center">
                            <span className="w-4 h-0.5 bg-[#43e97b] mr-2"></span>
                            ÉTAPE DU PROJET
                          </p>
                          <div className="space-y-3">
                            {/* Progress Bar with Step-Based Gradient - Improved aesthetic */}
                            <div className="relative h-4 w-full bg-gray-50 rounded-full overflow-hidden shadow-inner">
                              {project.etape && (
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${(Number(project.etape.charAt(0)) / 7) * 100}%`,
                                  }}
                                  transition={{ 
                                    duration: 0.8, 
                                    ease: "easeOut" 
                                  }}
                                  className="absolute h-full rounded-full"
                                  style={{
                                    background: getGradientColorForStep(Number(project.etape.charAt(0))),
                                  }}
                                >
                                  {/* Add animated shimmer effect */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer"></div>
                                </motion.div>
                              )}
                            </div>

                            {/* Step Indicator with enhanced styling */}
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-[#213f5b]">
                                {formatEtape(project.etape)}
                              </span>
                              <div className="flex items-center gap-1">
                                {[...Array(7)].map((_, idx) => {
                                  const stepNumber = idx + 1;
                                  // Consider the step complete if the current etape is greater or equal to the step number.
                                  const completed = Number(project.etape?.charAt(0) || "0") >= stepNumber;
                                  const stepColor = getStepColor(stepNumber);
                                  return (
                                    <div
                                      key={idx}
                                      className="w-5 h-5 flex items-center justify-center transition-transform transform hover:scale-110"
                                      title={`Step ${stepNumber}`}
                                    >
                                      <div
                                        className={`w-3 h-3 rounded-full flex items-center justify-center ${
                                          completed
                                            ? "shadow-sm"
                                            : "bg-gray-100 border border-gray-200"
                                        } transition-all duration-300`}
                                        style={completed ? { background: stepColor } : {}}
                                      >
                                        {stepNumber === Number(project.etape?.charAt(0) || "0") && (
                                          <div className="absolute w-5 h-5 rounded-full border-2 border-white shadow-sm animate-pulse" style={{ borderColor: stepColor }}></div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact information - enhanced UI */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-2 p-1 hover:bg-[#4facfe]/5 rounded-lg transition-colors">
                          <div className="bg-[#4facfe]/10 p-1.5 rounded-full">
                            <EnvelopeIcon className="h-3 w-3 text-[#4facfe]" />
                          </div>
                          <span className="text-xs text-gray-700 truncate">
                            {email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 p-1 hover:bg-[#4facfe]/5 rounded-lg transition-colors">
                          <div className="bg-[#4facfe]/10 p-1.5 rounded-full">
                            <PhoneIcon className="h-3 w-3 text-[#4facfe]" />
                          </div>
                          <span className="text-xs text-gray-700">{phone}</span>
                        </div>
                        <div className="flex items-center gap-2 p-1 hover:bg-[#4facfe]/5 rounded-lg transition-colors">
                          <div className="bg-[#4facfe]/10 p-1.5 rounded-full">
                            <MapPinIcon className="h-3 w-3 text-[#4facfe]" />
                          </div>
                          <span className="text-xs text-gray-700 truncate">
                            {locationStr}
                          </span>
                        </div>
                      </div>

                      {/* Action button - enhanced with gradient */}
                      <div className="mt-auto relative z-20">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="group inline-flex items-center justify-center w-full py-2 px-4 bg-gradient-to-r from-[#213f5b] to-[#1d6fa5] text-white rounded-lg transition-all hover:shadow-md text-sm relative overflow-hidden"
                        >
                          {/* Button shimmer effect */}
                          <div className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                          
                          <span>Voir le détail</span>
                          <ChevronRightIcon className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                      
                      {/* Double-click handler for opening iframe - Now uses the global iframe context */}
                      <div 
                        className="absolute inset-0 cursor-pointer" 
                        onDoubleClick={() => openIframe(project._id, project.numero)}
                        aria-label="Double-click to open window"
                      ></div>
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
                className="px-4 py-2 rounded-lg flex items-center gap-2 text-[#213f5b] border border-[#4facfe]/40 hover:bg-[#4facfe]/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
                          ? "bg-gradient-to-br from-[#213f5b] to-[#1d6fa5] text-white shadow-lg"
                          : "text-[#213f5b] hover:bg-[#4facfe]/10 border border-[#4facfe]/40"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg flex items-center gap-2 text-[#213f5b] border border-[#4facfe]/40 hover:bg-[#4facfe]/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
      {selectedProject && (
        <motion.div 
          className="fixed inset-0 z-40"
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
              {/* Project Header with Status - UPDATED */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-500">#{selectedProject.numero}</span>
                  
                  {/* Status Badge - UPDATED */}
                  {selectedProject.status && (
                    <span 
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: getStatusDetails(selectedProject.status).bgColor,
                        color: getStatusDetails(selectedProject.status).textColor,
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: getStatusDetails(selectedProject.status).borderColor
                      }}
                    >
                      {getStatusDetails(selectedProject.status).icon}
                      {selectedProject.status}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 mt-2">
                  <span 
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium"
                    style={{ 
                      backgroundColor: getStatusInfo(selectedProject.etape).color,
                      color: getStatusInfo(selectedProject.etape).textColor 
                    }}
                  >
                    {getStatusInfo(selectedProject.etape).icon}
                    {selectedProject.etape}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#213f5b] mt-2">{selectedProject.typeDeLogement}</h3>
              </div>
              
              {/* Project Details */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Solution</h4>
                  <p className="text-[#213f5b]">{selectedProject.solution}</p>
                </div>
                
                {/* Type de Travaux */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Type de Travaux</h4>
                  <p className="text-[#213f5b]">{selectedProject.typeTravaux || "Non spécifié"}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Surface chauffée</h4>
                  <p className="text-[#213f5b]">{selectedProject.surfaceChauffee} m²</p>
                </div>
                
                {/* Timeline using real data - enhanced styling */}
                <div className="mt-8">
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Progression du projet</h4>
                  
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#4facfe]/30 via-[#43e97b]/30 to-[#1d6fa5]/30"></div>
                    
                    <div className="space-y-6">
                      {steps.map((step, index) => {
                        const stepNumber = index + 1;
                        let bgColor, icon;
                        if (stepNumber < currentStep) {
                          // Completed steps
                          bgColor = "bg-gradient-to-r from-[#43e97b] to-[#38f9d7]";
                          icon = (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          );
                        } else if (stepNumber === currentStep) {
                          // Current step
                          bgColor = "bg-gradient-to-r from-[#4facfe] to-[#4bb8fe]";
                          icon = (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          );
                        } else {
                          // Pending steps
                          bgColor = "bg-gray-200";
                          icon = <span className="text-xs font-medium text-gray-500">{stepNumber}</span>;
                        }
                        return (
                          <div className="flex" key={index}>
                            <div className={`flex-shrink-0 h-8 w-8 rounded-full ${bgColor} flex items-center justify-center relative z-10 shadow-sm`}>
                              {icon}
                            </div>
                            <div className="ml-4">
                              <h5 className={`text-sm font-medium ${stepNumber <= currentStep ? "text-[#213f5b]" : "text-gray-400"}`}>{step}</h5>
                              {/* Optionally, add dates for each step if available */}
                              {stepNumber === currentStep && (
                                <p className="text-xs text-[#4facfe] mt-1">En cours</p>
                              )}
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
              {/* Status section at bottom - NEW */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Status du dossier</h4>
                <div 
                  className="p-3 rounded-lg flex items-center justify-between"
                  style={{ 
                    backgroundColor: getStatusDetails(selectedProject.status || "En attente de paiement").bgColor,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: getStatusDetails(selectedProject.status || "En attente de paiement").borderColor
                  }}
                >
                  <div className="flex items-center">
                    {getStatusDetails(selectedProject.status || "En attente de paiement").icon}
                    <span 
                      className="ml-2 font-medium"
                      style={{ color: getStatusDetails(selectedProject.status || "En attente de paiement").textColor }}
                    >
                      {selectedProject.status || "En attente de paiement"}
                    </span>
                  </div>
                  
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: `${getStatusDetails(selectedProject.status || "En attente de paiement").textColor}20`
                    }}
                  >
                    {getStatusDetails(selectedProject.status || "En attente de paiement").icon}
                  </div>
                </div>
              </div>
              
              {/* Button options */}
              <div className="grid grid-cols-2 gap-4">
                {/* Open in floating window */}
                <button 
                  onClick={() => {
                    openIframe(selectedProject._id, selectedProject.numero);
                    setSelectedProject(null); // Close the detail panel
                  }}
                  className="py-3 rounded-xl text-white font-medium relative overflow-hidden bg-gradient-to-r from-[#38c2de] to-[#1d6fa5] hover:opacity-90 transition-all"
                >
                  <div className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
                  Ouvrir Fenêtre
                </button>
                
                {/* Open in new tab */}
                <a 
                  href={`/dashboard/admin/projects/${selectedProject._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <button
                    className="w-full py-3 rounded-xl text-white font-medium relative overflow-hidden bg-gradient-to-r from-[#213f5b] to-[#1a324a] hover:opacity-90 transition-all"
                  >
                    <div className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
                    Ouvrir Nouvel Onglet
                  </button>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}