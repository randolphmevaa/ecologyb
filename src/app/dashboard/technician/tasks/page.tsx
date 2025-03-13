"use client";

import { useState, useEffect, JSX } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarIcon,
  ListBulletIcon,
  Squares2X2Icon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  BriefcaseIcon,
  WrenchScrewdriverIcon,
  ChatBubbleLeftIcon,
  SunIcon,
  MoonIcon,
  ArrowTopRightOnSquareIcon,
  ChartBarIcon,
  PlusIcon,
  XMarkIcon,
  BellAlertIcon,
  CheckIcon,
  ArchiveBoxIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import React from "react";

// Define Task interface
interface Task {
  id: number;
  name: string;
  description: string;
  projectId: number;
  projectTitle: string;
  projectType: string;
  location: string;
  clientName: string;
  assignedTo: string;
  deadline: string;
  startTime?: string;
  endTime?: string;
  status: "a_faire" | "en_cours" | "en_attente" | "termine" | "annule";
  priority: "normal" | "high" | "urgent";
  completed: boolean;
  notes?: string;
  materials?: {
    id: number;
    name: string;
    quantity: number;
    available: boolean;
  }[];
  subTasks?: {
    id: number;
    name: string;
    completed: boolean;
  }[];
  attachments?: {
    id: number;
    name: string;
    type: string;
    url: string;
  }[];
  estimatedDuration: number; // in minutes
}

// Sample tasks data
const tasksData: Task[] = [
  {
    id: 1,
    name: "Visite technique initiale",
    description: "Effectuer la visite initiale pour évaluer les besoins et contraintes",
    projectId: 1,
    projectTitle: "Installation Pompe à chaleur - Villa Dupont",
    projectType: "installation",
    location: "15 Rue des Lilas, 75020 Paris",
    clientName: "Famille Dupont",
    assignedTo: "Jean Martin",
    deadline: "2025-03-15",
    startTime: "09:00",
    endTime: "11:00",
    status: "termine",
    priority: "normal",
    completed: true,
    notes: "Accès par le portail principal, sonner à l'interphone",
    estimatedDuration: 120,
    materials: [
      {
        id: 101,
        name: "Appareil de mesure thermique",
        quantity: 1,
        available: true
      },
      {
        id: 102,
        name: "Tablette avec logiciel d'audit",
        quantity: 1,
        available: true
      }
    ],
    subTasks: [
      {
        id: 201,
        name: "Photos des emplacements",
        completed: true
      },
      {
        id: 202,
        name: "Mesures des pièces",
        completed: true
      },
      {
        id: 203,
        name: "Évaluation isolation",
        completed: true
      }
    ],
    attachments: [
      {
        id: 301,
        name: "Plan de la maison",
        type: "pdf",
        url: "/documents/plan_dupont.pdf"
      }
    ]
  },
  {
    id: 2,
    name: "Planification des travaux",
    description: "Organiser le calendrier d'intervention et coordonner avec le client",
    projectId: 1,
    projectTitle: "Installation Pompe à chaleur - Villa Dupont",
    projectType: "installation",
    location: "15 Rue des Lilas, 75020 Paris",
    clientName: "Famille Dupont",
    assignedTo: "Sophie Dubois",
    deadline: "2025-03-24",
    status: "en_cours",
    priority: "high",
    completed: false,
    estimatedDuration: 90,
    subTasks: [
      {
        id: 204,
        name: "Vérifier disponibilité équipe",
        completed: true
      },
      {
        id: 205,
        name: "Validation dates avec client",
        completed: false
      },
      {
        id: 206,
        name: "Création planning détaillé",
        completed: false
      }
    ]
  },
  {
    id: 3,
    name: "Obtention des autorisations",
    description: "Obtenir les autorisations administratives nécessaires pour l'installation",
    projectId: 1,
    projectTitle: "Installation Pompe à chaleur - Villa Dupont",
    projectType: "installation",
    location: "15 Rue des Lilas, 75020 Paris",
    clientName: "Famille Dupont",
    assignedTo: "Jean Martin",
    deadline: "2025-03-28",
    status: "en_attente",
    priority: "normal",
    completed: false,
    notes: "Attente de réponse de la copropriété",
    estimatedDuration: 180,
    subTasks: [
      {
        id: 207,
        name: "Préparation dossier",
        completed: true
      },
      {
        id: 208,
        name: "Soumission demande",
        completed: true
      },
      {
        id: 209,
        name: "Suivi demande",
        completed: false
      }
    ],
    attachments: [
      {
        id: 302,
        name: "Formulaire d'autorisation",
        type: "pdf",
        url: "/documents/autorisation_dupont.pdf"
      }
    ]
  },
  {
    id: 4,
    name: "Étude d'ensoleillement",
    description: "Réaliser l'étude d'ensoleillement pour optimiser le placement des panneaux",
    projectId: 2,
    projectTitle: "Installation Photovoltaïque - Résidence Les Fleurs",
    projectType: "installation",
    location: "8 Avenue des Roses, 75011 Paris",
    clientName: "Copropriété Les Fleurs",
    assignedTo: "Pierre Durand",
    deadline: "2025-03-10",
    startTime: "14:00",
    endTime: "17:00",
    status: "termine",
    priority: "high",
    completed: true,
    estimatedDuration: 180,
    materials: [
      {
        id: 103,
        name: "Appareil de mesure solaire",
        quantity: 1,
        available: true
      },
      {
        id: 104,
        name: "Drone avec caméra",
        quantity: 1,
        available: true
      }
    ]
  },
  {
    id: 5,
    name: "Déclaration préalable de travaux",
    description: "Préparer et déposer la déclaration préalable de travaux pour l'installation photovoltaïque",
    projectId: 2,
    projectTitle: "Installation Photovoltaïque - Résidence Les Fleurs",
    projectType: "installation",
    location: "8 Avenue des Roses, 75011 Paris",
    clientName: "Copropriété Les Fleurs",
    assignedTo: "Alexandre Petit",
    deadline: "2025-03-30",
    status: "en_cours",
    priority: "high",
    completed: false,
    estimatedDuration: 240,
    subTasks: [
      {
        id: 210,
        name: "Préparation des documents",
        completed: true
      },
      {
        id: 211,
        name: "Rendez-vous mairie",
        completed: false
      },
      {
        id: 212,
        name: "Suivi dossier",
        completed: false
      }
    ]
  },
  {
    id: 6,
    name: "Mise en place unité extérieure",
    description: "Installation de l'unité extérieure de la pompe à chaleur",
    projectId: 1,
    projectTitle: "Installation Pompe à chaleur - Villa Dupont",
    projectType: "installation",
    location: "15 Rue des Lilas, 75020 Paris",
    clientName: "Famille Dupont",
    assignedTo: "Jean Martin",
    deadline: "2025-04-05",
    startTime: "08:30",
    endTime: "16:30",
    status: "a_faire",
    priority: "normal",
    completed: false,
    estimatedDuration: 480,
    materials: [
      {
        id: 105,
        name: "Pompe à chaleur Air/Eau 11kW",
        quantity: 1,
        available: false
      },
      {
        id: 106,
        name: "Support mural renforcé",
        quantity: 1,
        available: true
      },
      {
        id: 107,
        name: "Outillage spécifique",
        quantity: 1,
        available: true
      }
    ],
    subTasks: [
      {
        id: 213,
        name: "Préparation zone installation",
        completed: false
      },
      {
        id: 214,
        name: "Fixation support",
        completed: false
      },
      {
        id: 215,
        name: "Installation unité",
        completed: false
      }
    ]
  },
  {
    id: 7,
    name: "Dépose ancien chauffe-eau",
    description: "Démonter et évacuer l'ancien chauffe-eau électrique",
    projectId: 3,
    projectTitle: "Installation Chauffe-eau thermodynamique - Appartement Girard",
    projectType: "installation",
    location: "23 Rue du Commerce, 75015 Paris",
    clientName: "M. et Mme Girard",
    assignedTo: "Thomas Bernard",
    deadline: "2025-03-15",
    startTime: "08:00",
    endTime: "10:00",
    status: "termine",
    priority: "normal",
    completed: true,
    estimatedDuration: 120,
    materials: [
      {
        id: 108,
        name: "Outillage de plomberie",
        quantity: 1,
        available: true
      }
    ]
  },
  {
    id: 8,
    name: "Installation capteurs",
    description: "Installer les capteurs solaires thermiques sur le toit",
    projectId: 4,
    projectTitle: "Installation Système solaire combiné - Maison Leroy",
    projectType: "installation",
    location: "5 Rue des Vignes, 77000 Melun",
    clientName: "Famille Leroy",
    assignedTo: "Marie Lambert",
    deadline: "2025-04-15",
    status: "a_faire",
    priority: "high",
    completed: false,
    estimatedDuration: 360,
    materials: [
      {
        id: 109,
        name: "Capteurs solaires thermiques",
        quantity: 4,
        available: false
      },
      {
        id: 110,
        name: "Kit de fixation toiture",
        quantity: 1,
        available: false
      },
      {
        id: 111,
        name: "Harnais de sécurité",
        quantity: 2,
        available: true
      }
    ]
  },
  {
    id: 9,
    name: "Travaux électriques préparatoires",
    description: "Réaliser les travaux électriques préparatoires pour l'installation des bornes de recharge",
    projectId: 5,
    projectTitle: "Installation Bornes de recharge - Parking Étoile",
    projectType: "installation",
    location: "25 Avenue des Champs-Élysées, 75008 Paris",
    clientName: "Parking Étoile SAS",
    assignedTo: "Alexandre Petit",
    deadline: "2025-03-22",
    startTime: "22:00",
    endTime: "06:00",
    status: "termine",
    priority: "normal",
    completed: true,
    notes: "Travaux de nuit obligatoires",
    estimatedDuration: 480,
    materials: [
      {
        id: 112,
        name: "Tableau TGBT 400A",
        quantity: 1,
        available: true
      },
      {
        id: 113,
        name: "Disjoncteurs différentiels",
        quantity: 10,
        available: true
      }
    ]
  },
  {
    id: 10,
    name: "Installation bornes (4/10)",
    description: "Installation des premières bornes de recharge",
    projectId: 5,
    projectTitle: "Installation Bornes de recharge - Parking Étoile",
    projectType: "installation",
    location: "25 Avenue des Champs-Élysées, 75008 Paris",
    clientName: "Parking Étoile SAS",
    assignedTo: "Sophie Dubois",
    deadline: "2025-04-02",
    startTime: "22:00",
    endTime: "06:00",
    status: "a_faire",
    priority: "urgent",
    completed: false,
    notes: "Travaux de nuit obligatoires, coordonner avec l'équipe électrique",
    estimatedDuration: 480,
    materials: [
      {
        id: 114,
        name: "Bornes de recharge 22kW",
        quantity: 4,
        available: true
      },
      {
        id: 115,
        name: "Câble électrique 5G10mm²",
        quantity: 200,
        available: true
      }
    ],
    subTasks: [
      {
        id: 216,
        name: "Installation support mural",
        completed: false
      },
      {
        id: 217,
        name: "Montage bornes",
        completed: false
      },
      {
        id: 218,
        name: "Raccordement électrique",
        completed: false
      },
      {
        id: 219,
        name: "Tests préliminaires",
        completed: false
      }
    ]
  }
];

// Function to get status color
function getStatusColor(status: string): string {
  switch (status) {
    case "en_cours":
      return "bg-blue-500";
    case "a_faire":
      return "bg-indigo-500";
    case "en_attente":
      return "bg-amber-500";
    case "termine":
      return "bg-green-500";
    case "annule":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

// Function to get status text
function getStatusText(status: string): string {
  switch (status) {
    case "en_cours":
      return "En cours";
    case "a_faire":
      return "À faire";
    case "en_attente":
      return "En attente";
    case "termine":
      return "Terminé";
    case "annule":
      return "Annulé";
    default:
      return "Inconnu";
  }
}

// Function to get priority badge
function getPriorityBadge(priority: string): JSX.Element {
  switch (priority) {
    case "urgent":
      return (
        <span className="bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 text-xs font-medium px-2 py-0.5 rounded-full border border-red-400 flex items-center">
          <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
          Urgent
        </span>
      );
    case "high":
      return (
        <span className="bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 text-xs font-medium px-2 py-0.5 rounded-full border border-orange-400 flex items-center">
          <BellAlertIcon className="h-3 w-3 mr-1" />
          Prioritaire
        </span>
      );
    default:
      return (
        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-medium px-2 py-0.5 rounded-full border border-blue-400 flex items-center">
          <ClockIcon className="h-3 w-3 mr-1" />
          Normal
        </span>
      );
  }
}

// Function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

// Function to format date in short format
// function formatShortDate(dateString: string): string {
//   const date = new Date(dateString);
//   return date.toLocaleDateString("fr-FR", {
//     day: "numeric",
//     month: "short"
//   });
// }

// Function to check if a task is due today
function isToday(dateString: string): boolean {
  const today = new Date();
  const taskDate = new Date(dateString);
  return (
    taskDate.getDate() === today.getDate() &&
    taskDate.getMonth() === today.getMonth() &&
    taskDate.getFullYear() === today.getFullYear()
  );
}

// Function to check if a task is due this week
function isThisWeek(dateString: string): boolean {
  const today = new Date();
  const taskDate = new Date(dateString);
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Monday
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
  endOfWeek.setHours(23, 59, 59, 999);
  return taskDate >= startOfWeek && taskDate <= endOfWeek;
}

// Function to format time
function formatTime(timeString?: string): string {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  return `${hours}h${minutes}`;
}

export default function TechnicianTasksPage() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"list" | "grid" | "calendar">("list");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("deadline");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasksData);
  const [tasksCompleted, setTasksCompleted] = useState<{ [key: number]: boolean }>({});
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Current technician for demo purposes
  const currentTechnician = "Jean Martin";

  // Initialize tasks completed state
  useEffect(() => {
    const initialTasksCompleted: { [key: number]: boolean } = {};
    tasksData.forEach(task => {
      initialTasksCompleted[task.id] = task.completed;
    });
    setTasksCompleted(initialTasksCompleted);
  }, []);

  // Filter tasks when search or filters change
  useEffect(() => {
    let filtered = tasksData;

    // Filter by current technician
    filtered = filtered.filter(task => task.assignedTo === currentTechnician);

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.name.toLowerCase().includes(query) ||
          task.projectTitle.toLowerCase().includes(query) ||
          task.location.toLowerCase().includes(query) ||
          task.clientName.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter === "active") {
      filtered = filtered.filter((task) => task.status !== "termine" && task.status !== "annule");
    } else if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    // Apply time filter
    if (timeFilter === "today") {
      filtered = filtered.filter((task) => isToday(task.deadline));
    } else if (timeFilter === "week") {
      filtered = filtered.filter((task) => isThisWeek(task.deadline));
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case "deadline":
          valueA = new Date(a.deadline).getTime();
          valueB = new Date(b.deadline).getTime();
          break;
        case "name":
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case "priority":
          const priorityOrder = { urgent: 3, high: 2, normal: 1 };
          valueA = priorityOrder[a.priority as keyof typeof priorityOrder];
          valueB = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case "project":
          valueA = a.projectTitle.toLowerCase();
          valueB = b.projectTitle.toLowerCase();
          break;
        case "duration":
          valueA = a.estimatedDuration;
          valueB = b.estimatedDuration;
          break;
        default:
          valueA = new Date(a.deadline).getTime();
          valueB = new Date(b.deadline).getTime();
      }

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    setFilteredTasks(filtered);
  }, [searchQuery, statusFilter, timeFilter, sortBy, sortDirection, currentTechnician, tasksCompleted]);

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // Open task details
  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
  };

  // Close task details
  const closeTaskDetails = () => {
    setSelectedTask(null);
  };

  // Toggle task completion
  const toggleTaskCompletion = (taskId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setTasksCompleted(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // Toggle filters panel
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Group tasks by date for calendar view
  // const groupTasksByDate = () => {
  //   const grouped: Record<string, Task[]> = {};
  //   filteredTasks.forEach(task => {
  //     if (!grouped[task.deadline]) {
  //       grouped[task.deadline] = [];
  //     }
  //     grouped[task.deadline].push(task);
  //   });
  //   return grouped;
  // };

  // Function to generate calendar dates
  const generateCalendarDates = () => {
    const today = new Date();
    const dates = [];
    
    // Start from the beginning of the current month
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Adjust to include the previous month's last days to fill the calendar's first week
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  // Get tasks for a specific date
  // const getTasksForDate = (date: Date, groupedTasks: Record<string, Task[]>) => {
  //   const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  //   return groupedTasks[dateString] || [];
  // };

  // Check if date is today
  const isDateToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  // Check if date is in the current month
  const isCurrentMonth = (date: Date) => {
    const today = new Date();
    return date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Common Header */}
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          <div className="flex flex-col">
            {/* Navigation Header */}
            <div className={`${darkMode ? "bg-gradient-to-r from-gray-900 to-gray-800" : "bg-gradient-to-r from-[#1a365d] to-[#0f2942]"} p-7 text-white`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-white/15 rounded-2xl backdrop-blur-md flex items-center justify-center">
                    <WrenchScrewdriverIcon className="h-8 w-8 text-[#e2ffc2]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Mes Tâches</h2>
                    <p className="text-white/90 font-medium mt-1.5">
                      Organisez et suivez vos missions d&apos;installation
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                  <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-4 w-4 text-white/60" />
                    </div>
                    <input
                      type="text"
                      placeholder="Rechercher tâche, projet..."
                      className="w-full text-sm border-none bg-white/15 hover:bg-white/20 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-white placeholder-white/60"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <button 
                    className="flex-shrink-0 p-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
                    onClick={() => setDarkMode(!darkMode)}
                    aria-label={darkMode ? "Mode clair" : "Mode sombre"}
                  >
                    {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                  </button>
                  
                  <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#e2ffc2] to-[#c5f7a5] hover:opacity-90 text-[#1a365d] rounded-xl text-sm font-semibold transition-colors">
                    <PlusIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Nouvelle tâche</span>
                    <span className="sm:hidden">Nouvelle</span>
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  {/* View Mode Selector */}
                  <div className="flex bg-white/15 rounded-xl overflow-hidden p-0.5">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg flex items-center gap-1.5 ${
                        viewMode === "list" ? "bg-white text-[#1a365d]" : "text-white"
                      }`}
                    >
                      <ListBulletIcon className="h-4 w-4" />
                      Liste
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg flex items-center gap-1.5 ${
                        viewMode === "grid" ? "bg-white text-[#1a365d]" : "text-white"
                      }`}
                    >
                      <Squares2X2Icon className="h-4 w-4" />
                      Grille
                    </button>
                    <button
                      onClick={() => setViewMode("calendar")}
                      className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg flex items-center gap-1.5 ${
                        viewMode === "calendar" ? "bg-white text-[#1a365d]" : "text-white"
                      }`}
                    >
                      <CalendarIcon className="h-4 w-4" />
                      Calendrier
                    </button>
                  </div>
                  
                  {/* Filters Button */}
                  <button 
                    className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-sm font-medium flex items-center gap-1"
                    onClick={toggleFilters}
                  >
                    <FunnelIcon className="h-4 w-4" />
                    <span>Filtres</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-sm flex items-center gap-2">
                    <span>Trier par:</span>
                    <select 
                      className="bg-white/15 hover:bg-white/25 rounded-lg p-1.5 text-white"
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                    >
                      <option value="deadline">Échéance</option>
                      <option value="name">Nom</option>
                      <option value="priority">Priorité</option>
                      <option value="project">Projet</option>
                      <option value="duration">Durée</option>
                    </select>
                    <button 
                      onClick={toggleSortDirection}
                      className="p-1.5 bg-white/15 hover:bg-white/25 rounded-lg"
                    >
                      {sortDirection === 'asc' ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  className={`p-4 ${darkMode ? "bg-gray-800" : "bg-white"} border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Filtres avancés</h3>
                    <button 
                      onClick={toggleFilters}
                      className={`p-1.5 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className={`block text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mb-1`}>
                        Statut
                      </label>
                      <select 
                        className={`w-full p-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-700"}`}
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                      >
                        <option value="all">Tous les statuts</option>
                        <option value="active">Actives</option>
                        <option value="a_faire">À faire</option>
                        <option value="en_cours">En cours</option>
                        <option value="en_attente">En attente</option>
                        <option value="termine">Terminées</option>
                        <option value="annule">Annulées</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className={`block text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mb-1`}>
                        Période
                      </label>
                      <select 
                        className={`w-full p-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-700"}`}
                        value={timeFilter}
                        onChange={e => setTimeFilter(e.target.value)}
                      >
                        <option value="all">Toutes les dates</option>
                        <option value="today">Aujourd&apos;hui</option>
                        <option value="week">Cette semaine</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className={`block text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mb-1`}>
                        Priorité
                      </label>
                      <select 
                        className={`w-full p-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-700"}`}
                      >
                        <option value="all">Toutes les priorités</option>
                        <option value="urgent">Urgent</option>
                        <option value="high">Prioritaire</option>
                        <option value="normal">Normal</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className={`block text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mb-1`}>
                        Type de projet
                      </label>
                      <select 
                        className={`w-full p-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-700"}`}
                      >
                        <option value="all">Tous les types</option>
                        <option value="installation">Installation</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="depannage">Dépannage</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Tasks Dashboard */}
            <div className={`p-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"} flex-1`}>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <motion.div 
                  className={`rounded-xl p-5 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${darkMode ? "bg-blue-900/30" : "bg-blue-100"}`}>
                      <WrenchScrewdriverIcon className={`h-6 w-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                    </div>
                    <div>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>
                        Tâches en cours
                      </p>
                      <p className="text-2xl font-bold mt-1">
                        {tasksData.filter(t => t.assignedTo === currentTechnician && t.status === "en_cours").length}
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className={`rounded-xl p-5 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${darkMode ? "bg-amber-900/30" : "bg-amber-100"}`}>
                      <ClockIcon className={`h-6 w-6 ${darkMode ? "text-amber-400" : "text-amber-600"}`} />
                    </div>
                    <div>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>
                        À faire aujourd&apos;hui
                      </p>
                      <p className="text-2xl font-bold mt-1">
                        {tasksData.filter(t => t.assignedTo === currentTechnician && isToday(t.deadline) && t.status !== "termine").length}
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className={`rounded-xl p-5 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${darkMode ? "bg-green-900/30" : "bg-green-100"}`}>
                      <CheckCircleIcon className={`h-6 w-6 ${darkMode ? "text-green-400" : "text-green-600"}`} />
                    </div>
                    <div>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>
                        Terminées ce mois
                      </p>
                      <p className="text-2xl font-bold mt-1">
                        {tasksData.filter(t => t.assignedTo === currentTechnician && t.status === "termine").length}
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className={`rounded-xl p-5 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${darkMode ? "bg-purple-900/30" : "bg-purple-100"}`}>
                      <ChartBarIcon className={`h-6 w-6 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
                    </div>
                    <div>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>
                        Heures planifiées
                      </p>
                      <p className="text-2xl font-bold mt-1">
                        {Math.round(tasksData
                          .filter(t => t.assignedTo === currentTechnician && t.status !== "termine" && t.status !== "annule")
                          .reduce((sum, t) => sum + t.estimatedDuration, 0) / 60)} h
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Tasks List View */}
              {viewMode === "list" && (
                <motion.div 
                  className={`rounded-xl overflow-hidden border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={`${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <div className={`grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                      <div className="col-span-1"></div>
                      <div className="col-span-4">Tâche</div>
                      <div className="col-span-3">Projet</div>
                      <div className="col-span-1">Priorité</div>
                      <div className="col-span-2">Échéance</div>
                      <div className="col-span-1">Actions</div>
                    </div>
                    
                    <div className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"} max-h-[calc(100vh-400px)] overflow-auto`}>
                      {filteredTasks.length === 0 ? (
                        <div className="text-center py-8">
                          <CheckCircleIcon className={`h-12 w-12 mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
                          <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>
                            Aucune tâche ne correspond à vos critères
                          </p>
                        </div>
                      ) : (
                        filteredTasks.map((task) => (
                          <motion.div 
                            key={task.id}
                            className={`grid grid-cols-12 gap-4 px-6 py-4 ${darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"} cursor-pointer items-center ${
                              tasksCompleted[task.id] ? `${darkMode ? "bg-gray-800/50" : "bg-gray-50"} opacity-75` : ""
                            }`}
                            onClick={() => openTaskDetails(task)}
                            whileHover={{ backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(249, 250, 251, 1)' }}
                          >
                            <div className="col-span-1">
                              <button
                                onClick={(e) => toggleTaskCompletion(task.id, e)}
                                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                                  tasksCompleted[task.id] 
                                    ? `${darkMode ? "bg-green-600 border-green-600" : "bg-green-500 border-green-500"} text-white` 
                                    : `border-gray-300 dark:border-gray-600`
                                }`}
                              >
                                {tasksCompleted[task.id] && <CheckIcon className="h-4 w-4" />}
                              </button>
                            </div>
                            
                            <div className="col-span-4">
                              <div className="flex items-start gap-3">
                                <div className={`mt-0.5 h-8 w-1 rounded-full ${getStatusColor(task.status)}`}></div>
                                <div>
                                  <h4 className={`font-semibold ${tasksCompleted[task.id] ? "line-through opacity-75" : ""}`}>
                                    {task.name}
                                  </h4>
                                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1 ${tasksCompleted[task.id] ? "line-through opacity-75" : ""}`}>
                                    {task.startTime && `${formatTime(task.startTime)} - ${formatTime(task.endTime)}`}
                                    {task.startTime && task.estimatedDuration && " • "}
                                    {task.estimatedDuration && `${Math.floor(task.estimatedDuration / 60)}h${task.estimatedDuration % 60 ? (task.estimatedDuration % 60) + "m" : ""}`}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="col-span-3">
                              <p className="font-medium">{task.projectTitle}</p>
                              <div className="flex items-center text-xs mt-1">
                                <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                                <span className="truncate">{task.location}</span>
                              </div>
                            </div>
                            
                            <div className="col-span-1">
                              {getPriorityBadge(task.priority)}
                            </div>
                            
                            <div className="col-span-2">
                              <div className="flex flex-col">
                                <span className={`text-sm font-medium ${
                                  new Date(task.deadline) < new Date() && task.status !== "termine" 
                                    ? "text-red-500 dark:text-red-400" 
                                    : isToday(task.deadline)
                                    ? "text-amber-500 dark:text-amber-400"
                                    : ""
                                }`}>
                                  {formatDate(task.deadline)}
                                </span>
                                <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
                                  {getStatusText(task.status)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="col-span-1 flex justify-end">
                              <button 
                                className={`p-1.5 rounded-lg ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openTaskDetails(task);
                                }}
                              >
                                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Tasks Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-h-[calc(100vh-350px)] overflow-auto pr-2">
                  {filteredTasks.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <CheckCircleIcon className={`h-12 w-12 mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
                      <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>
                        Aucune tâche ne correspond à vos critères
                      </p>
                    </div>
                  ) : (
                    filteredTasks.map((task) => (
                      <motion.div 
                        key={task.id}
                        className={`rounded-xl overflow-hidden border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm ${
                          tasksCompleted[task.id] ? `${darkMode ? "bg-gray-800/50" : "bg-gray-50"} opacity-75` : `${darkMode ? "bg-gray-800" : "bg-white"}`
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      >
                        <div 
                          className="cursor-pointer h-full flex flex-col"
                          onClick={() => openTaskDetails(task)}
                        >
                          <div className="relative">
                            <div className={`h-2 w-full ${getStatusColor(task.status)}`}></div>
                            <div className="p-5 flex-1">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className={`font-semibold ${tasksCompleted[task.id] ? "line-through opacity-75" : ""}`}>
                                  {task.name}
                                </h4>
                                <button
                                  onClick={(e) => toggleTaskCompletion(task.id, e)}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                                    tasksCompleted[task.id] 
                                      ? `${darkMode ? "bg-green-600 border-green-600" : "bg-green-500 border-green-500"} text-white` 
                                      : `border-gray-300 dark:border-gray-600`
                                  }`}
                                >
                                  {tasksCompleted[task.id] && <CheckIcon className="h-4 w-4" />}
                                </button>
                              </div>
                              
                              <div className="flex items-center mt-1 text-sm">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                <span className={`${darkMode ? "text-gray-400" : "text-gray-500"} ${tasksCompleted[task.id] ? "line-through opacity-75" : ""}`}>
                                  {task.startTime && `${formatTime(task.startTime)} - ${formatTime(task.endTime)}`}
                                  {task.startTime && task.estimatedDuration && " • "}
                                  {task.estimatedDuration && `${Math.floor(task.estimatedDuration / 60)}h${task.estimatedDuration % 60 ? (task.estimatedDuration % 60) + "m" : ""}`}
                                </span>
                              </div>
                              
                              <div className="mt-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  task.status === "termine" ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" : 
                                  task.status === "en_cours" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" :
                                  task.status === "a_faire" ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300" :
                                  task.status === "en_attente" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" :
                                  "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                                }`}>
                                  {getStatusText(task.status)}
                                </span>
                                
                                <div className="mt-2">
                                  {getPriorityBadge(task.priority)}
                                </div>
                              </div>
                              
                              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="font-medium">{task.projectTitle}</p>
                                <div className="flex items-center text-xs mt-1">
                                  <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                                  <span className="truncate">{task.location}</span>
                                </div>
                              </div>
                              
                              <div className="mt-4 flex justify-between items-center">
                                <span className={`text-sm font-medium ${
                                  new Date(task.deadline) < new Date() && task.status !== "termine" 
                                    ? "text-red-500 dark:text-red-400" 
                                    : isToday(task.deadline)
                                    ? "text-amber-500 dark:text-amber-400"
                                    : ""
                                }`}>
                                  {formatDate(task.deadline)}
                                </span>
                                
                                <button className={`p-1.5 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}>
                                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
              
              {/* Tasks Calendar View */}
              {viewMode === "calendar" && (
                <motion.div 
                  className={`rounded-xl overflow-hidden border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={`${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <div className={`px-6 py-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">
                          {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                        </h3>
                        <div className="flex space-x-2">
                          <button className={`p-1.5 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}>
                            <ChevronUpIcon className="h-4 w-4" />
                          </button>
                          <button className={`p-1.5 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}>
                            <ChevronDownIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="max-h-[calc(100vh-450px)] overflow-auto">
                      <div className="grid grid-cols-7">
                        {/* Day headers */}
                        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                          <div 
                            key={day} 
                            className={`text-center py-2 border-b text-sm font-medium ${darkMode ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"}`}
                          >
                            {day}
                          </div>
                        ))}
                        
                        {/* Calendar cells */}
                        {generateCalendarDates().map((date, index) => {
                          const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                          const tasksForDate = filteredTasks.filter(task => task.deadline === dateString);
                          const isToday = isDateToday(date);
                          const isThisMonth = isCurrentMonth(date);
                          
                          return (
                            <div 
                              key={index} 
                              className={`min-h-[100px] p-1 border-b border-r ${darkMode ? "border-gray-700" : "border-gray-200"} ${
                                isToday ? (darkMode ? "bg-blue-900/20" : "bg-blue-50") : 
                                !isThisMonth ? (darkMode ? "bg-gray-800/50" : "bg-gray-50/50") : ""
                              }`}
                            >
                              <div className="flex justify-between p-1">
                                <span className={`text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center ${
                                  isToday ? "bg-blue-500 text-white" : 
                                  !isThisMonth ? (darkMode ? "text-gray-500" : "text-gray-400") : ""
                                }`}>
                                  {date.getDate()}
                                </span>
                                {tasksForDate.length > 0 && (
                                  <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    {tasksForDate.length} tâche{tasksForDate.length > 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                              
                              <div className="space-y-1 mt-1">
                                {tasksForDate.slice(0, 3).map(task => (
                                  <div 
                                    key={task.id}
                                    className={`text-xs p-1 rounded truncate cursor-pointer ${
                                      task.status === "termine" ? (darkMode ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-800") : 
                                      task.status === "en_cours" ? (darkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-800") :
                                      task.status === "a_faire" ? (darkMode ? "bg-indigo-900/30 text-indigo-300" : "bg-indigo-100 text-indigo-800") :
                                      task.status === "en_attente" ? (darkMode ? "bg-amber-900/30 text-amber-300" : "bg-amber-100 text-amber-800") :
                                      (darkMode ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-800")
                                    }`}
                                    onClick={() => openTaskDetails(task)}
                                  >
                                    {task.startTime ? `${formatTime(task.startTime)} ` : ''}{task.name}
                                  </div>
                                ))}
                                
                                {tasksForDate.length > 3 && (
                                  <div className={`text-xs px-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    +{tasksForDate.length - 3} autres
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </main>
        
        {/* Task Details Modal */}
        <AnimatePresence>
          {selectedTask && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              {/* Background overlay */}
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeTaskDetails}
              ></motion.div>
              
              {/* Modal content */}
              <motion.div
                className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-2xl z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden relative`}
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Header */}
                <div className={`p-6 ${selectedTask.status === "termine" ? "bg-gradient-to-r from-green-600 to-green-500" : 
                                    selectedTask.status === "en_cours" ? "bg-gradient-to-r from-blue-600 to-blue-500" :
                                    selectedTask.status === "a_faire" ? "bg-gradient-to-r from-indigo-600 to-indigo-500" :
                                    selectedTask.status === "en_attente" ? "bg-gradient-to-r from-amber-600 to-amber-500" :
                                    "bg-gradient-to-r from-red-600 to-red-500"} text-white sticky top-0 z-10`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm font-medium">
                          {getStatusText(selectedTask.status)}
                        </span>
                        {getPriorityBadge(selectedTask.priority)}
                      </div>
                      <h3 className="text-xl font-bold">{selectedTask.name}</h3>
                      <p className="mt-1 opacity-90">{selectedTask.projectTitle}</p>
                    </div>
                    <button
                      onClick={closeTaskDetails}
                      className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="overflow-y-auto max-h-[calc(90vh-150px)]">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                    {/* Left column - Task details */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Description */}
                      <div className={`rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"} p-5`}>
                        <h4 className="font-medium mb-3">Description</h4>
                        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {selectedTask.description}
                        </p>
                        
                        {selectedTask.notes && (
                          <div className={`mt-4 pt-4 border-t ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
                            <h5 className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Notes</h5>
                            <p className="text-sm">{selectedTask.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Subtasks */}
                      {selectedTask.subTasks && selectedTask.subTasks.length > 0 && (
                        <div className={`rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"} overflow-hidden`}>
                          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                            <h4 className="font-medium">Sous-tâches</h4>
                          </div>
                          
                          <div className="p-4 space-y-3">
                            {selectedTask.subTasks.map((subTask) => (
                              <div 
                                key={subTask.id} 
                                className={`p-3 rounded-lg flex items-start ${
                                  subTask.completed ? 
                                  (darkMode ? "bg-green-900/20 text-green-300" : "bg-green-50 text-green-800") : 
                                  (darkMode ? "bg-gray-800" : "bg-white")
                                }`}
                              >
                                <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded ${
                                  subTask.completed ? 
                                  "bg-green-500 text-white flex items-center justify-center" : 
                                  "border-2 border-gray-400"
                                }`}>
                                  {subTask.completed && (
                                    <CheckIcon className="h-3 w-3" />
                                  )}
                                </div>
                                <div className="ml-3">
                                  <p className={`${subTask.completed ? "line-through opacity-75" : ""}`}>
                                    {subTask.name}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Materials */}
                      {selectedTask.materials && selectedTask.materials.length > 0 && (
                        <div className={`rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"} overflow-hidden`}>
                          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                            <h4 className="font-medium">Matériel nécessaire</h4>
                          </div>
                          
                          <div className="p-4">
                            <div className={`rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} overflow-hidden shadow-sm`}>
                              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
                                  <tr>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                      Matériel
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                      Quantité
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                      Disponibilité
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className={`divide-y divide-gray-200 dark:divide-gray-700`}>
                                  {selectedTask.materials.map((material) => (
                                    <tr key={material.id}>
                                      <td className="px-4 py-3 text-sm">
                                        {material.name}
                                      </td>
                                      <td className="px-4 py-3 text-sm">
                                        {material.quantity}
                                      </td>
                                      <td className="px-4 py-3 text-sm">
                                        {material.available ? (
                                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-800"}`}>
                                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                                            Disponible
                                          </span>
                                        ) : (
                                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-800"}`}>
                                            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                                            Non disponible
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Attachments */}
                      {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                        <div className={`rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"} overflow-hidden`}>
                          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                            <h4 className="font-medium">Pièces jointes</h4>
                          </div>
                          
                          <div className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {selectedTask.attachments.map((attachment) => (
                                <div 
                                  key={attachment.id} 
                                  className={`p-4 rounded-lg flex items-center ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
                                >
                                  <div className={`p-3 rounded-lg ${
                                    attachment.type === "pdf" ? (darkMode ? "bg-red-900/30" : "bg-red-100") :
                                    attachment.type === "image" ? (darkMode ? "bg-blue-900/30" : "bg-blue-100") :
                                    (darkMode ? "bg-gray-700" : "bg-gray-200")
                                  } mr-4`}>
                                    <DocumentTextIcon className={`h-5 w-5 ${
                                      attachment.type === "pdf" ? (darkMode ? "text-red-400" : "text-red-600") :
                                      attachment.type === "image" ? (darkMode ? "text-blue-400" : "text-blue-600") :
                                      (darkMode ? "text-gray-400" : "text-gray-600")
                                    }`} />
                                  </div>
                                  <div>
                                    <p className="font-medium">{attachment.name}</p>
                                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
                                      {attachment.type.toUpperCase()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Right column - Task info */}
                    <div className="space-y-6">
                      <div className={`rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"} p-5`}>
                        <h4 className="font-medium mb-3">Informations</h4>
                        
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <CalendarIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Échéance</p>
                              <p className={`font-medium ${
                                new Date(selectedTask.deadline) < new Date() && selectedTask.status !== "termine" 
                                  ? "text-red-500 dark:text-red-400" 
                                  : isToday(selectedTask.deadline)
                                  ? "text-amber-500 dark:text-amber-400"
                                  : ""
                              }`}>
                                {formatDate(selectedTask.deadline)}
                              </p>
                              {selectedTask.startTime && (
                                <p className="text-sm mt-1">
                                  {formatTime(selectedTask.startTime)} - {formatTime(selectedTask.endTime)}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <ClockIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Durée estimée</p>
                              <p className="font-medium">
                                {Math.floor(selectedTask.estimatedDuration / 60)}h
                                {selectedTask.estimatedDuration % 60 > 0 ? (selectedTask.estimatedDuration % 60) + "min" : ""}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <BriefcaseIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Projet</p>
                              <p className="font-medium">{selectedTask.projectTitle}</p>
                              <p className="text-sm mt-1">Client: {selectedTask.clientName}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <MapPinIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Adresse</p>
                              <p className="font-medium">{selectedTask.location}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <button 
                          onClick={() => toggleTaskCompletion(selectedTask.id, { stopPropagation: () => {} } as React.MouseEvent)}
                          className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium
                            ${tasksCompleted[selectedTask.id] ?
                              (darkMode ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-500 hover:bg-green-600 text-white") :
                              (darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white")
                            }`}
                        >
                          {tasksCompleted[selectedTask.id] ? (
                            <>
                              <ArchiveBoxIcon className="h-4 w-4" />
                              Archiver
                            </>
                          ) : (
                            <>
                              <CheckIcon className="h-4 w-4" />
                              Marquer terminée
                            </>
                          )}
                        </button>
                        <button className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium
                          ${darkMode ? "bg-gray-600 hover:bg-gray-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}>
                          <ChatBubbleLeftIcon className="h-4 w-4" />
                          Notes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}