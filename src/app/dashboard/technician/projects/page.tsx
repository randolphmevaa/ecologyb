"use client";

import { useState, useEffect, JSX } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bars4Icon,
  ViewColumnsIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  // PhotoIcon,
  ChatBubbleLeftIcon,
  ChartBarIcon,
  // ArrowLeftIcon,
  ArrowRightIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  // BoltIcon,
  // WrenchScrewdriverIcon,
  TruckIcon,
  CalendarDaysIcon,
  SunIcon,
  MoonIcon,
  // AdjustmentsHorizontalIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import React from "react";

// Define project interface
interface Project {
  id: number;
  title: string;
  description: string;
  solution: string;
  type: string;
  location: string;
  startDate: string;
  estimatedEndDate: string;
  actualEndDate?: string;
  status: "en_attente" | "en_cours" | "en_pause" | "termine" | "annule";
  progress: number;
  priority: "normal" | "high" | "urgent";
  budget: number;
  costs: number;
  technicians: string[];
  client: {
    name: string;
    phone: string;
    email: string;
    preferredContactMethod?: "phone" | "email" | "sms";
  };
  notes?: string;
  phases: {
    id: number;
    name: string;
    status: "en_attente" | "en_cours" | "termine";
    startDate?: string;
    endDate?: string;
    tasks: {
      id: number;
      name: string;
      completed: boolean;
      assignedTo?: string;
      deadline?: string;
    }[];
  }[];
  issues?: {
    id: number;
    title: string;
    description: string;
    status: "ouvert" | "en_cours" | "resolu";
    createdDate: string;
    resolvedDate?: string;
    priority: "low" | "medium" | "high";
  }[];
  documents?: {
    id: number;
    name: string;
    type: "plan" | "contrat" | "facture" | "autre";
    url: string;
    uploadDate: string;
  }[];
  photos?: {
    id: number;
    name: string;
    url: string;
    uploadDate: string;
  }[];
  requiredMaterials: {
    id: number;
    name: string;
    quantity: number;
    ordered: boolean;
    received: boolean;
    estimatedDelivery?: string;
  }[];
  inspections?: {
    id: number;
    type: string;
    date: string;
    status: "planifie" | "effectue" | "a_refaire";
    inspector: string;
    notes?: string;
  }[];
}

// Sample projects data
const projectsData: Project[] = [
  {
    id: 1,
    title: "Installation Pompe à chaleur - Villa Dupont",
    description: "Installation complète d'une pompe à chaleur air/eau pour une villa individuelle de 140m²",
    solution: "Pompe à chaleur Air/Eau 11kW",
    type: "installation",
    location: "15 Rue des Lilas, 75020 Paris",
    startDate: "2025-03-25",
    estimatedEndDate: "2025-04-10",
    status: "en_attente",
    progress: 0,
    priority: "normal",
    budget: 12500,
    costs: 0,
    technicians: ["Jean Martin", "Sophie Dubois"],
    client: {
      name: "Famille Dupont",
      phone: "06 12 34 56 78",
      email: "dupont@email.com",
      preferredContactMethod: "phone"
    },
    notes: "Client disponible uniquement en fin de journée (après 17h)",
    phases: [
      {
        id: 1,
        name: "Étude préalable",
        status: "termine",
        startDate: "2025-03-10",
        endDate: "2025-03-15",
        tasks: [
          { id: 1, name: "Visite technique initiale", completed: true, assignedTo: "Jean Martin" },
          { id: 2, name: "Calcul des besoins thermiques", completed: true, assignedTo: "Sophie Dubois" },
          { id: 3, name: "Proposition technique", completed: true, assignedTo: "Jean Martin" }
        ]
      },
      {
        id: 2,
        name: "Préparation",
        status: "en_cours",
        startDate: "2025-03-20",
        tasks: [
          { id: 4, name: "Commande du matériel", completed: true, assignedTo: "Jean Martin" },
          { id: 5, name: "Planification des travaux", completed: false, assignedTo: "Sophie Dubois" },
          { id: 6, name: "Obtention des autorisations", completed: false, assignedTo: "Jean Martin" }
        ]
      },
      {
        id: 3,
        name: "Installation",
        status: "en_attente",
        tasks: [
          { id: 7, name: "Mise en place unité extérieure", completed: false, assignedTo: "Jean Martin" },
          { id: 8, name: "Installation unité intérieure", completed: false, assignedTo: "Sophie Dubois" },
          { id: 9, name: "Raccordements hydrauliques", completed: false, assignedTo: "Jean Martin" },
          { id: 10, name: "Raccordements électriques", completed: false, assignedTo: "Sophie Dubois" }
        ]
      },
      {
        id: 4,
        name: "Mise en service",
        status: "en_attente",
        tasks: [
          { id: 11, name: "Test d'étanchéité", completed: false, assignedTo: "Jean Martin" },
          { id: 12, name: "Mise en service", completed: false, assignedTo: "Sophie Dubois" },
          { id: 13, name: "Formation client", completed: false, assignedTo: "Jean Martin" }
        ]
      }
    ],
    issues: [
      {
        id: 1,
        title: "Décalage livraison PAC",
        description: "Retard d'une semaine annoncé par le fournisseur",
        status: "ouvert",
        createdDate: "2025-03-22",
        priority: "medium"
      }
    ],
    documents: [
      {
        id: 1,
        name: "Devis signé",
        type: "contrat",
        url: "/documents/devis_dupont.pdf",
        uploadDate: "2025-03-05"
      },
      {
        id: 2,
        name: "Plans villa",
        type: "plan",
        url: "/documents/plans_dupont.pdf",
        uploadDate: "2025-03-10"
      }
    ],
    requiredMaterials: [
      {
        id: 1,
        name: "Pompe à chaleur Air/Eau 11kW",
        quantity: 1,
        ordered: true,
        received: false,
        estimatedDelivery: "2025-03-29"
      },
      {
        id: 2,
        name: "Kit hydraulique",
        quantity: 1,
        ordered: true,
        received: true
      },
      {
        id: 3,
        name: "Thermostat connecté",
        quantity: 1,
        ordered: true,
        received: true
      }
    ],
    inspections: [
      {
        id: 1,
        type: "Contrôle avant mise en service",
        date: "2025-04-08",
        status: "planifie",
        inspector: "Thomas Bernard"
      }
    ]
  },
  {
    id: 2,
    title: "Installation Photovoltaïque - Résidence Les Fleurs",
    description: "Installation d'un système photovoltaïque 6kWc sur toiture inclinée",
    solution: "Panneaux photovoltaïques 6kWc",
    type: "installation",
    location: "8 Avenue des Roses, 75011 Paris",
    startDate: "2025-04-05",
    estimatedEndDate: "2025-04-20",
    status: "en_attente",
    progress: 0,
    priority: "high",
    budget: 18000,
    costs: 0,
    technicians: ["Pierre Durand", "Alexandre Petit"],
    client: {
      name: "Copropriété Les Fleurs",
      phone: "01 23 45 67 89",
      email: "syndic@lesfleurs.fr",
      preferredContactMethod: "email"
    },
    phases: [
      {
        id: 1,
        name: "Étude préalable",
        status: "termine",
        startDate: "2025-03-01",
        endDate: "2025-03-15",
        tasks: [
          { id: 1, name: "Étude d'ensoleillement", completed: true, assignedTo: "Pierre Durand" },
          { id: 2, name: "Dimensionnement système", completed: true, assignedTo: "Alexandre Petit" },
          { id: 3, name: "Validation technique", completed: true, assignedTo: "Pierre Durand" }
        ]
      },
      {
        id: 2,
        name: "Administratif",
        status: "en_cours",
        startDate: "2025-03-20",
        tasks: [
          { id: 4, name: "Demande de raccordement réseau", completed: true, assignedTo: "Pierre Durand" },
          { id: 5, name: "Déclaration préalable de travaux", completed: false, assignedTo: "Alexandre Petit" },
          { id: 6, name: "Validation assurance", completed: false, assignedTo: "Pierre Durand" }
        ]
      },
      {
        id: 3,
        name: "Installation",
        status: "en_attente",
        tasks: [
          { id: 7, name: "Installation structure", completed: false, assignedTo: "Pierre Durand" },
          { id: 8, name: "Pose des panneaux", completed: false, assignedTo: "Alexandre Petit" },
          { id: 9, name: "Installation onduleur", completed: false, assignedTo: "Pierre Durand" },
          { id: 10, name: "Câblage électrique", completed: false, assignedTo: "Alexandre Petit" }
        ]
      },
      {
        id: 4,
        name: "Mise en service",
        status: "en_attente",
        tasks: [
          { id: 11, name: "Tests électriques", completed: false, assignedTo: "Pierre Durand" },
          { id: 12, name: "Mise en service", completed: false, assignedTo: "Alexandre Petit" },
          { id: 13, name: "Formation utilisateurs", completed: false, assignedTo: "Pierre Durand" }
        ]
      }
    ],
    documents: [
      {
        id: 1,
        name: "Contrat installation",
        type: "contrat",
        url: "/documents/contrat_lesfleurs.pdf",
        uploadDate: "2025-03-10"
      },
      {
        id: 2,
        name: "Schéma d'implantation",
        type: "plan",
        url: "/documents/schema_lesfleurs.pdf",
        uploadDate: "2025-03-15"
      }
    ],
    requiredMaterials: [
      {
        id: 1,
        name: "Panneaux solaires 375W",
        quantity: 16,
        ordered: true,
        received: false,
        estimatedDelivery: "2025-04-02"
      },
      {
        id: 2,
        name: "Onduleur 6kW",
        quantity: 1,
        ordered: true,
        received: false,
        estimatedDelivery: "2025-04-02"
      },
      {
        id: 3,
        name: "Structure de fixation",
        quantity: 1,
        ordered: true,
        received: true
      }
    ]
  },
  {
    id: 3,
    title: "Installation Chauffe-eau thermodynamique - Appartement Girard",
    description: "Remplacement d'un chauffe-eau électrique par un modèle thermodynamique",
    solution: "Chauffe-eau thermodynamique 200L",
    type: "installation",
    location: "23 Rue du Commerce, 75015 Paris",
    startDate: "2025-03-15",
    estimatedEndDate: "2025-03-18",
    actualEndDate: "2025-03-17",
    status: "termine",
    progress: 100,
    priority: "normal",
    budget: 2800,
    costs: 2750,
    technicians: ["Thomas Bernard"],
    client: {
      name: "M. et Mme Girard",
      phone: "06 98 76 54 32",
      email: "girard@email.com",
      preferredContactMethod: "phone"
    },
    notes: "Installation terminée avec un jour d'avance, client très satisfait",
    phases: [
      {
        id: 1,
        name: "Préparation",
        status: "termine",
        startDate: "2025-03-10",
        endDate: "2025-03-14",
        tasks: [
          { id: 1, name: "Visite technique préalable", completed: true, assignedTo: "Thomas Bernard" },
          { id: 2, name: "Commande matériel", completed: true, assignedTo: "Thomas Bernard" }
        ]
      },
      {
        id: 2,
        name: "Installation",
        status: "termine",
        startDate: "2025-03-15",
        endDate: "2025-03-17",
        tasks: [
          { id: 3, name: "Dépose ancien chauffe-eau", completed: true, assignedTo: "Thomas Bernard" },
          { id: 4, name: "Installation nouveau chauffe-eau", completed: true, assignedTo: "Thomas Bernard" },
          { id: 5, name: "Mise en service", completed: true, assignedTo: "Thomas Bernard" }
        ]
      }
    ],
    photos: [
      {
        id: 1,
        name: "Avant installation",
        url: "/photos/girard_avant.jpg",
        uploadDate: "2025-03-15"
      },
      {
        id: 2,
        name: "Après installation",
        url: "/photos/girard_apres.jpg",
        uploadDate: "2025-03-17"
      }
    ],
    requiredMaterials: [
      {
        id: 1,
        name: "Chauffe-eau thermodynamique 200L",
        quantity: 1,
        ordered: true,
        received: true
      },
      {
        id: 2,
        name: "Kit de raccordement",
        quantity: 1,
        ordered: true,
        received: true
      }
    ],
    inspections: [
      {
        id: 1,
        type: "Contrôle final",
        date: "2025-03-17",
        status: "effectue",
        inspector: "Thomas Bernard",
        notes: "Installation conforme"
      }
    ]
  },
  {
    id: 4,
    title: "Installation Système solaire combiné - Maison Leroy",
    description: "Installation complète d'un système solaire thermique pour chauffage et eau chaude",
    solution: "Système solaire combiné 8m²",
    type: "installation",
    location: "5 Rue des Vignes, 77000 Melun",
    startDate: "2025-04-10",
    estimatedEndDate: "2025-04-30",
    status: "en_attente",
    progress: 0,
    priority: "high",
    budget: 15000,
    costs: 0,
    technicians: ["Marie Lambert", "Jean Martin"],
    client: {
      name: "Famille Leroy",
      phone: "06 11 22 33 44",
      email: "leroy@email.com",
      preferredContactMethod: "email"
    },
    phases: [
      {
        id: 1,
        name: "Étude technique",
        status: "termine",
        startDate: "2025-03-10",
        endDate: "2025-03-25",
        tasks: [
          { id: 1, name: "Analyse des besoins", completed: true, assignedTo: "Marie Lambert" },
          { id: 2, name: "Dimensionnement système", completed: true, assignedTo: "Jean Martin" },
          { id: 3, name: "Validation technique", completed: true, assignedTo: "Marie Lambert" }
        ]
      },
      {
        id: 2,
        name: "Préparation",
        status: "en_cours",
        startDate: "2025-03-26",
        tasks: [
          { id: 4, name: "Commande équipements", completed: true, assignedTo: "Marie Lambert" },
          { id: 5, name: "Planification travaux", completed: false, assignedTo: "Jean Martin" }
        ]
      },
      {
        id: 3,
        name: "Installation",
        status: "en_attente",
        tasks: [
          { id: 6, name: "Installation capteurs", completed: false, assignedTo: "Marie Lambert" },
          { id: 7, name: "Installation ballon", completed: false, assignedTo: "Jean Martin" },
          { id: 8, name: "Raccordements", completed: false, assignedTo: "Marie Lambert" }
        ]
      }
    ],
    documents: [
      {
        id: 1,
        name: "Devis signé",
        type: "contrat",
        url: "/documents/devis_leroy.pdf",
        uploadDate: "2025-03-20"
      }
    ],
    requiredMaterials: [
      {
        id: 1,
        name: "Capteurs solaires thermiques",
        quantity: 4,
        ordered: true,
        received: false,
        estimatedDelivery: "2025-04-05"
      },
      {
        id: 2,
        name: "Ballon combiné 500L",
        quantity: 1,
        ordered: true,
        received: false,
        estimatedDelivery: "2025-04-05"
      },
      {
        id: 3,
        name: "Station solaire",
        quantity: 1,
        ordered: true,
        received: false,
        estimatedDelivery: "2025-04-05"
      }
    ]
  },
  {
    id: 5,
    title: "Installation Bornes de recharge - Parking Étoile",
    description: "Installation de 10 bornes de recharge pour véhicules électriques",
    solution: "Bornes de recharge 22kW",
    type: "installation",
    location: "25 Avenue des Champs-Élysées, 75008 Paris",
    startDate: "2025-03-20",
    estimatedEndDate: "2025-04-15",
    status: "en_cours",
    progress: 35,
    priority: "normal",
    budget: 48000,
    costs: 25000,
    technicians: ["Alexandre Petit", "Pierre Durand", "Sophie Dubois"],
    client: {
      name: "Parking Étoile SAS",
      phone: "01 44 55 66 77",
      email: "contact@parking-etoile.com",
      preferredContactMethod: "email"
    },
    notes: "Travaux à effectuer de nuit (22h-6h)",
    phases: [
      {
        id: 1,
        name: "Étude préalable",
        status: "termine",
        startDate: "2025-02-15",
        endDate: "2025-03-05",
        tasks: [
          { id: 1, name: "Audit électrique", completed: true, assignedTo: "Alexandre Petit" },
          { id: 2, name: "Étude d'implantation", completed: true, assignedTo: "Pierre Durand" },
          { id: 3, name: "Validation technique", completed: true, assignedTo: "Sophie Dubois" }
        ]
      },
      {
        id: 2,
        name: "Préparation",
        status: "termine",
        startDate: "2025-03-06",
        endDate: "2025-03-19",
        tasks: [
          { id: 4, name: "Commande matériel", completed: true, assignedTo: "Alexandre Petit" },
          { id: 5, name: "Planification travaux", completed: true, assignedTo: "Pierre Durand" }
        ]
      },
      {
        id: 3,
        name: "Installation",
        status: "en_cours",
        startDate: "2025-03-20",
        tasks: [
          { id: 6, name: "Travaux électriques préparatoires", completed: true, assignedTo: "Alexandre Petit" },
          { id: 7, name: "Pose chemins de câbles", completed: true, assignedTo: "Pierre Durand" },
          { id: 8, name: "Installation bornes (4/10)", completed: false, assignedTo: "Sophie Dubois" },
          { id: 9, name: "Câblage et raccordement", completed: false, assignedTo: "Alexandre Petit" }
        ]
      },
      {
        id: 4,
        name: "Mise en service",
        status: "en_attente",
        tasks: [
          { id: 10, name: "Tests électriques", completed: false, assignedTo: "Pierre Durand" },
          { id: 11, name: "Configuration système", completed: false, assignedTo: "Sophie Dubois" },
          { id: 12, name: "Formation personnel", completed: false, assignedTo: "Alexandre Petit" }
        ]
      }
    ],
    issues: [
      {
        id: 1,
        title: "Modification tableau électrique",
        description: "Nécessité de remplacer le TGBT existant pour supporter la puissance requise",
        status: "resolu",
        createdDate: "2025-03-10",
        resolvedDate: "2025-03-15",
        priority: "high"
      },
      {
        id: 2,
        title: "Délai livraison bornes",
        description: "Retard de livraison des 6 dernières bornes",
        status: "en_cours",
        createdDate: "2025-03-25",
        priority: "medium"
      }
    ],
    documents: [
      {
        id: 1,
        name: "Plans électriques",
        type: "plan",
        url: "/documents/plan_electrique_etoile.pdf",
        uploadDate: "2025-02-20"
      },
      {
        id: 2,
        name: "Contrat",
        type: "contrat",
        url: "/documents/contrat_etoile.pdf",
        uploadDate: "2025-03-01"
      },
      {
        id: 3,
        name: "Avenant tableau électrique",
        type: "autre",
        url: "/documents/avenant_etoile.pdf",
        uploadDate: "2025-03-15"
      }
    ],
    photos: [
      {
        id: 1,
        name: "Tableau électrique avant",
        url: "/photos/etoile_tgbt_avant.jpg",
        uploadDate: "2025-03-10"
      },
      {
        id: 2,
        name: "Tableau électrique après",
        url: "/photos/etoile_tgbt_apres.jpg",
        uploadDate: "2025-03-18"
      },
      {
        id: 3,
        name: "Installation en cours",
        url: "/photos/etoile_installation.jpg",
        uploadDate: "2025-03-25"
      }
    ],
    requiredMaterials: [
      {
        id: 1,
        name: "Bornes de recharge 22kW",
        quantity: 10,
        ordered: true,
        received: false,
        estimatedDelivery: "2025-04-05"
      },
      {
        id: 2,
        name: "Tableau TGBT 400A",
        quantity: 1,
        ordered: true,
        received: true
      },
      {
        id: 3,
        name: "Câble électrique 5G10mm²",
        quantity: 500,
        ordered: true,
        received: true
      },
      {
        id: 4,
        name: "Disjoncteurs 32A",
        quantity: 10,
        ordered: true,
        received: true
      }
    ],
    inspections: [
      {
        id: 1,
        type: "Contrôle installation électrique",
        date: "2025-03-22",
        status: "effectue",
        inspector: "Bureau Veritas",
        notes: "Installation conforme"
      },
      {
        id: 2,
        type: "Contrôle final",
        date: "2025-04-12",
        status: "planifie",
        inspector: "Bureau Veritas"
      }
    ]
  }
];

// Get status color
function getStatusColor(status: string): string {
  switch (status) {
    case "en_cours":
      return "bg-blue-500";
    case "en_attente":
      return "bg-amber-500";
    case "termine":
      return "bg-green-500";
    case "en_pause":
      return "bg-purple-500";
    case "annule":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

// Get status text
function getStatusText(status: string): string {
  switch (status) {
    case "en_cours":
      return "En cours";
    case "en_attente":
      return "En attente";
    case "termine":
      return "Terminé";
    case "en_pause":
      return "En pause";
    case "annule":
      return "Annulé";
    default:
      return "Inconnu";
  }
}

// Get priority badge
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
          <ArrowPathIcon className="h-3 w-3 mr-1" />
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

export default function TechnicianProjectsPage() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"list" | "grid" | "kanban">("list");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("phases");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projectsData);
  const [sortBy, setSortBy] = useState<string>("startDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter projects when search or filters change
  useEffect(() => {
    let filtered = projectsData;

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.solution.toLowerCase().includes(query) ||
          project.location.toLowerCase().includes(query) ||
          project.client.name.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status === statusFilter);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case "startDate":
          valueA = new Date(a.startDate).getTime();
          valueB = new Date(b.startDate).getTime();
          break;
        case "estimatedEndDate":
          valueA = new Date(a.estimatedEndDate).getTime();
          valueB = new Date(b.estimatedEndDate).getTime();
          break;
        case "title":
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case "progress":
          valueA = a.progress;
          valueB = b.progress;
          break;
        case "budget":
          valueA = a.budget;
          valueB = b.budget;
          break;
        case "priority":
          const priorityOrder = { urgent: 3, high: 2, normal: 1 };
          valueA = priorityOrder[a.priority as keyof typeof priorityOrder];
          valueB = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        default:
          valueA = a.startDate;
          valueB = b.startDate;
      }

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    setFilteredProjects(filtered);
  }, [searchQuery, statusFilter, sortBy, sortDirection]);

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // Open project details
  const openProjectDetails = (project: Project) => {
    setSelectedProject(project);
  };

  // Close project details
  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  // Toggle section expansion in project details
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Calculate days remaining or overdue
  const calculateDaysRemaining = (project: Project) => {
    if (project.status === "termine") {
      return { days: 0, overdue: false, text: "Terminé" };
    }

    const today = new Date();
    const endDate = new Date(project.estimatedEndDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { days: Math.abs(diffDays), overdue: true, text: `Retard de ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}` };
    } else {
      return { days: diffDays, overdue: false, text: `${diffDays} jour${diffDays > 1 ? 's' : ''} restant${diffDays > 1 ? 's' : ''}` };
    }
  };
  
  // Determine CSS class based on days remaining
  const getDaysRemainingClass = (daysObj: { days: number, overdue: boolean }) => {
    if (daysObj.overdue) {
      return "text-red-600 dark:text-red-400";
    } else if (daysObj.days <= 5) {
      return "text-amber-600 dark:text-amber-400";
    } else {
      return "text-green-600 dark:text-green-400";
    }
  };

  // Calculate project completion
  const calculateProjectCompletion = (project: Project) => {
    // If project is manually marked as complete, return 100%
    if (project.status === "termine") return 100;
    
    // Get total tasks
    let totalTasks = 0;
    let completedTasks = 0;
    
    project.phases.forEach(phase => {
      totalTasks += phase.tasks.length;
      completedTasks += phase.tasks.filter(task => task.completed).length;
    });
    
    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
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
                    <BriefcaseIcon className="h-8 w-8 text-[#e2ffc2]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Projets d&apos;Installation</h2>
                    <p className="text-white/90 font-medium mt-1.5">
                      Gérez et suivez l&apos;avancement de vos installations énergétiques
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
                      placeholder="Rechercher projet, client..."
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
                    <span className="hidden sm:inline">Nouveau projet</span>
                    <span className="sm:hidden">Nouveau</span>
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
                      <Bars4Icon className="h-4 w-4" />
                      Liste
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg flex items-center gap-1.5 ${
                        viewMode === "grid" ? "bg-white text-[#1a365d]" : "text-white"
                      }`}
                    >
                      <ViewColumnsIcon className="h-4 w-4" />
                      Grille
                    </button>
                    <button
                      onClick={() => setViewMode("kanban")}
                      className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg flex items-center gap-1.5 ${
                        viewMode === "kanban" ? "bg-white text-[#1a365d]" : "text-white"
                      }`}
                    >
                      <ViewColumnsIcon className="h-4 w-4" />
                      Kanban
                    </button>
                  </div>
                  
                  {/* Status Filter */}
                  <div className="relative">
                    <button 
                      className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-sm font-medium flex items-center gap-1"
                    >
                      <FunnelIcon className="h-4 w-4" />
                      <span>Filtres</span>
                    </button>
                    <div className="absolute left-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg z-20 p-3 w-60 text-sm border border-gray-200 dark:border-gray-700 hidden">
                      <div className="mb-2">
                        <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">Statut</label>
                        <select 
                          className="w-full bg-gray-100 dark:bg-gray-700 rounded p-1.5 text-gray-800 dark:text-white"
                          value={statusFilter}
                          onChange={e => setStatusFilter(e.target.value)}
                        >
                          <option value="all">Tous les statuts</option>
                          <option value="en_attente">En attente</option>
                          <option value="en_cours">En cours</option>
                          <option value="en_pause">En pause</option>
                          <option value="termine">Terminés</option>
                          <option value="annule">Annulés</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-sm flex items-center gap-2">
                    <span>Trier par:</span>
                    <select 
                      className="bg-white/15 hover:bg-white/25 rounded-lg p-1.5 text-white"
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                    >
                      <option value="startDate">Date de début</option>
                      <option value="estimatedEndDate">Date de fin</option>
                      <option value="title">Nom du projet</option>
                      <option value="progress">Avancement</option>
                      <option value="budget">Budget</option>
                      <option value="priority">Priorité</option>
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
            
            {/* Projects Dashboard */}
            <div className={`p-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
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
                      <BriefcaseIcon className={`h-6 w-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                    </div>
                    <div>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>
                        Projets en cours
                      </p>
                      <p className="text-2xl font-bold mt-1">
                        {projectsData.filter(p => p.status === "en_cours").length}
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
                        En attente
                      </p>
                      <p className="text-2xl font-bold mt-1">
                        {projectsData.filter(p => p.status === "en_attente").length}
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
                        Terminés
                      </p>
                      <p className="text-2xl font-bold mt-1">
                        {projectsData.filter(p => p.status === "termine").length}
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
                        Budget total
                      </p>
                      <p className="text-2xl font-bold mt-1">
                        {projectsData.reduce((sum, p) => sum + p.budget, 0).toLocaleString()} €
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Projects List View */}
              {viewMode === "list" && (
                <motion.div 
                  className={`rounded-xl overflow-hidden border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={`${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <div className={`grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                      <div className="col-span-4">Projet</div>
                      <div className="col-span-2">Client</div>
                      <div className="col-span-1">Statut</div>
                      <div className="col-span-1">Priorité</div>
                      <div className="col-span-1">Avancement</div>
                      <div className="col-span-2">Calendrier</div>
                      <div className="col-span-1">Actions</div>
                    </div>
                    
                    <div className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"} max-h-[calc(100vh-400px)] overflow-auto`}>
                      {filteredProjects.length === 0 ? (
                        <div className="text-center py-8">
                          <ExclamationCircleIcon className={`h-12 w-12 mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
                          <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>
                            Aucun projet ne correspond à vos critères
                          </p>
                        </div>
                      ) : (
                        filteredProjects.map((project) => {
                          const daysRemaining = calculateDaysRemaining(project);
                          const completion = project.progress || calculateProjectCompletion(project);
                          
                          return (
                            <motion.div 
                              key={project.id}
                              className={`grid grid-cols-12 gap-4 px-6 py-4 ${darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"} cursor-pointer items-center`}
                              onClick={() => openProjectDetails(project)}
                              whileHover={{ backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(249, 250, 251, 1)' }}
                            >
                              <div className="col-span-4">
                                <div className="flex items-start gap-3">
                                  <div className={`mt-0.5 h-8 w-1 rounded-full ${getStatusColor(project.status)}`}></div>
                                  <div>
                                    <h4 className="font-semibold">{project.title}</h4>
                                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
                                      {project.solution}
                                    </p>
                                    <div className="flex items-center text-xs mt-1">
                                      <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                                      <span className="truncate">{project.location}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="col-span-2">
                                <p className="font-medium">{project.client.name}</p>
                                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
                                  {project.client.phone}
                                </p>
                              </div>
                              
                              <div className="col-span-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  project.status === "termine" ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" : 
                                  project.status === "en_cours" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" :
                                  project.status === "en_attente" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" :
                                  project.status === "en_pause" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300" :
                                  "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                                }`}>
                                  {getStatusText(project.status)}
                                </span>
                              </div>
                              
                              <div className="col-span-1">
                                {getPriorityBadge(project.priority)}
                              </div>
                              
                              <div className="col-span-1">
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                  <div 
                                    className={`h-2.5 rounded-full ${
                                      completion >= 100 ? "bg-green-500" :
                                      completion > 50 ? "bg-blue-500" :
                                      completion > 25 ? "bg-amber-500" : "bg-orange-500"
                                    }`}
                                    style={{ width: `${completion}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs font-medium mt-1 text-center">{completion}%</p>
                              </div>
                              
                              <div className="col-span-2">
                                <div className="flex flex-col">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Début:</span>
                                    <span className="text-xs font-medium">{formatDate(project.startDate)}</span>
                                  </div>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Fin prévue:</span>
                                    <span className="text-xs font-medium">{formatDate(project.estimatedEndDate)}</span>
                                  </div>
                                  <div>
                                    <span className={`text-xs font-medium ${getDaysRemainingClass(daysRemaining)}`}>
                                      {daysRemaining.text}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="col-span-1 flex justify-end">
                                <button 
                                  className={`p-1.5 rounded-lg ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openProjectDetails(project);
                                  }}
                                >
                                  <ArrowRightIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Projects Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-h-[calc(100vh-350px)] overflow-auto pr-2">
                  {filteredProjects.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <ExclamationCircleIcon className={`h-12 w-12 mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
                      <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>
                        Aucun projet ne correspond à vos critères
                      </p>
                    </div>
                  ) : (
                    filteredProjects.map((project) => {
                      const daysRemaining = calculateDaysRemaining(project);
                      const completion = project.progress || calculateProjectCompletion(project);
                      
                      return (
                        <motion.div 
                          key={project.id}
                          className={`rounded-xl overflow-hidden border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                          whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        >
                          <div 
                            className={`${darkMode ? "bg-gray-800" : "bg-white"} cursor-pointer`}
                            onClick={() => openProjectDetails(project)}
                          >
                            <div className="relative">
                              <div className={`h-2 w-full ${getStatusColor(project.status)}`}></div>
                              <div className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                  <h4 className="font-semibold">{project.title}</h4>
                                  {getPriorityBadge(project.priority)}
                                </div>
                                
                                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                  {project.solution}
                                </p>
                                
                                <div className="flex items-center text-sm mt-3">
                                  <MapPinIcon className="h-4 w-4 mr-1" />
                                  <span className="truncate">{project.location}</span>
                                </div>
                                
                                <div className="flex items-center text-sm mt-2">
                                  <UserIcon className="h-4 w-4 mr-1" />
                                  <span className="truncate">{project.client.name}</span>
                                </div>
                                
                                <div className="mt-4">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Avancement</span>
                                    <span className="text-xs font-medium">{completion}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        completion >= 100 ? "bg-green-500" :
                                        completion > 50 ? "bg-blue-500" :
                                        completion > 25 ? "bg-amber-500" : "bg-orange-500"
                                      }`}
                                      style={{ width: `${completion}%` }}
                                    ></div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                  <div>
                                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Début</p>
                                    <p className="text-sm font-medium">{formatDate(project.startDate)}</p>
                                  </div>
                                  <div>
                                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Fin prévue</p>
                                    <p className="text-sm font-medium">{formatDate(project.estimatedEndDate)}</p>
                                  </div>
                                </div>
                                
                                <div className="mt-2">
                                  <span className={`text-xs font-medium ${getDaysRemainingClass(daysRemaining)}`}>
                                    {daysRemaining.text}
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-between mt-5 pt-3 border-t border-gray-200 dark:border-gray-700">
                                  <div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      project.status === "termine" ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" : 
                                      project.status === "en_cours" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" :
                                      project.status === "en_attente" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" :
                                      project.status === "en_pause" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300" :
                                      "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                                    }`}>
                                      {getStatusText(project.status)}
                                    </span>
                                  </div>
                                  
                                  <div className="flex space-x-2">
                                    <button className={`p-1.5 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}>
                                      <CalendarDaysIcon className="h-4 w-4" />
                                    </button>
                                    <button className={`p-1.5 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}>
                                      <ArrowRightIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              )}
              
              {/* Projects Kanban View */}
              {viewMode === "kanban" && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-h-[calc(100vh-350px)] overflow-auto pr-2">
                  {/* En attente */}
                  <div className={`rounded-xl border ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} shadow-sm flex flex-col h-full`}>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                        <h3 className="font-semibold">En attente</h3>
                      </div>
                      <div className={`px-2 py-0.5 rounded text-xs ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                        {filteredProjects.filter(p => p.status === "en_attente").length}
                      </div>
                    </div>
                    
                    <div className="p-3 overflow-y-auto flex-1 space-y-3">
                      {filteredProjects.filter(p => p.status === "en_attente").map(project => (
                        <motion.div 
                          key={project.id}
                          className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} cursor-pointer shadow-sm`}
                          onClick={() => openProjectDetails(project)}
                          whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        >
                          <div className="flex justify-between items-start">
                            <h5 className="font-medium text-sm">{project.title}</h5>
                            {getPriorityBadge(project.priority)}
                          </div>
                          
                          <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
                            {project.solution}
                          </p>
                          
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center text-xs">
                              <UserIcon className="h-3 w-3 mr-1" />
                              <span className="truncate">{project.client.name}</span>
                            </div>
                            <div className="flex items-center text-xs">
                              <CalendarDaysIcon className="h-3 w-3 mr-1" />
                              <span>Début: {formatDate(project.startDate)}</span>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                              <div 
                                className="h-1.5 rounded-full bg-amber-500"
                                style={{ width: `${project.progress || calculateProjectCompletion(project)}%` }}
                              ></div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {filteredProjects.filter(p => p.status === "en_attente").length === 0 && (
                        <div className="text-center py-5">
                          <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                            Aucun projet dans cette colonne
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* En cours */}
                  <div className={`rounded-xl border ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} shadow-sm flex flex-col h-full`}>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                        <h3 className="font-semibold">En cours</h3>
                      </div>
                      <div className={`px-2 py-0.5 rounded text-xs ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                        {filteredProjects.filter(p => p.status === "en_cours").length}
                      </div>
                    </div>
                    
                    <div className="p-3 overflow-y-auto flex-1 space-y-3">
                      {filteredProjects.filter(p => p.status === "en_cours").map(project => (
                        <motion.div 
                          key={project.id}
                          className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} cursor-pointer shadow-sm`}
                          onClick={() => openProjectDetails(project)}
                          whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        >
                          <div className="flex justify-between items-start">
                            <h5 className="font-medium text-sm">{project.title}</h5>
                            {getPriorityBadge(project.priority)}
                          </div>
                          
                          <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
                            {project.solution}
                          </p>
                          
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center text-xs">
                              <UserIcon className="h-3 w-3 mr-1" />
                              <span className="truncate">{project.client.name}</span>
                            </div>
                            <div className="flex items-center text-xs">
                              <CalendarDaysIcon className="h-3 w-3 mr-1" />
                              <span>Fin: {formatDate(project.estimatedEndDate)}</span>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                              <div 
                                className="h-1.5 rounded-full bg-blue-500"
                                style={{ width: `${project.progress || calculateProjectCompletion(project)}%` }}
                              ></div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {filteredProjects.filter(p => p.status === "en_cours").length === 0 && (
                        <div className="text-center py-5">
                          <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                            Aucun projet dans cette colonne
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* En pause */}
                  <div className={`rounded-xl border ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} shadow-sm flex flex-col h-full`}>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
                        <h3 className="font-semibold">En pause</h3>
                      </div>
                      <div className={`px-2 py-0.5 rounded text-xs ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                        {filteredProjects.filter(p => p.status === "en_pause").length}
                      </div>
                    </div>
                    
                    <div className="p-3 overflow-y-auto flex-1 space-y-3">
                      {filteredProjects.filter(p => p.status === "en_pause").map(project => (
                        <motion.div 
                          key={project.id}
                          className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} cursor-pointer shadow-sm`}
                          onClick={() => openProjectDetails(project)}
                          whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        >
                          <div className="flex justify-between items-start">
                            <h5 className="font-medium text-sm">{project.title}</h5>
                            {getPriorityBadge(project.priority)}
                          </div>
                          
                          <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
                            {project.solution}
                          </p>
                          
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center text-xs">
                              <UserIcon className="h-3 w-3 mr-1" />
                              <span className="truncate">{project.client.name}</span>
                            </div>
                            <div className="flex items-center text-xs">
                              <CalendarDaysIcon className="h-3 w-3 mr-1" />
                              <span>Fin: {formatDate(project.estimatedEndDate)}</span>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                              <div 
                                className="h-1.5 rounded-full bg-purple-500"
                                style={{ width: `${project.progress || calculateProjectCompletion(project)}%` }}
                              ></div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {filteredProjects.filter(p => p.status === "en_pause").length === 0 && (
                        <div className="text-center py-5">
                          <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                            Aucun projet dans cette colonne
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Terminés */}
                  <div className={`rounded-xl border ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} shadow-sm flex flex-col h-full`}>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                        <h3 className="font-semibold">Terminés</h3>
                      </div>
                      <div className={`px-2 py-0.5 rounded text-xs ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                        {filteredProjects.filter(p => p.status === "termine").length}
                      </div>
                    </div>
                    
                    <div className="p-3 overflow-y-auto flex-1 space-y-3">
                      {filteredProjects.filter(p => p.status === "termine").map(project => (
                        <motion.div 
                          key={project.id}
                          className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} cursor-pointer shadow-sm`}
                          onClick={() => openProjectDetails(project)}
                          whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        >
                          <div className="flex justify-between items-start">
                            <h5 className="font-medium text-sm">{project.title}</h5>
                            {getPriorityBadge(project.priority)}
                          </div>
                          
                          <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
                            {project.solution}
                          </p>
                          
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center text-xs">
                              <UserIcon className="h-3 w-3 mr-1" />
                              <span className="truncate">{project.client.name}</span>
                            </div>
                            <div className="flex items-center text-xs">
                              <CalendarDaysIcon className="h-3 w-3 mr-1" />
                              <span>
                                Terminé le: {project.actualEndDate ? formatDate(project.actualEndDate) : formatDate(project.estimatedEndDate)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                              <div 
                                className="h-1.5 rounded-full bg-green-500"
                                style={{ width: "100%" }}
                              ></div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {filteredProjects.filter(p => p.status === "termine").length === 0 && (
                        <div className="text-center py-5">
                          <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                            Aucun projet dans cette colonne
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
        
        {/* Project Details Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              {/* Background overlay */}
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeProjectDetails}
              ></motion.div>
              
              {/* Modal content */}
              <motion.div
                className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-2xl z-10 w-full max-w-5xl max-h-[90vh] overflow-hidden relative`}
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Header */}
                <div className={`p-6 ${selectedProject.status === "termine" ? "bg-gradient-to-r from-green-600 to-green-500" : 
                                    selectedProject.status === "en_cours" ? "bg-gradient-to-r from-blue-600 to-blue-500" :
                                    selectedProject.status === "en_attente" ? "bg-gradient-to-r from-amber-600 to-amber-500" :
                                    selectedProject.status === "en_pause" ? "bg-gradient-to-r from-purple-600 to-purple-500" :
                                    "bg-gradient-to-r from-red-600 to-red-500"} text-white sticky top-0 z-10`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm font-medium">
                          {getStatusText(selectedProject.status)}
                        </span>
                        {getPriorityBadge(selectedProject.priority)}
                      </div>
                      <h3 className="text-xl font-bold">{selectedProject.title}</h3>
                      <p className="mt-1 opacity-90">{selectedProject.solution}</p>
                    </div>
                    <button
                      onClick={closeProjectDetails}
                      className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Project info tabs */}
                <div className={`px-6 py-3 flex space-x-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"} overflow-x-auto`}>
                  <button 
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${expandedSection === "phases" ? 
                      (darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900") : 
                      (darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900")}`}
                    onClick={() => toggleSection("phases")}
                  >
                    Phases et tâches
                  </button>
                  <button 
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${expandedSection === "materials" ? 
                      (darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900") : 
                      (darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900")}`}
                    onClick={() => toggleSection("materials")}
                  >
                    Matériaux
                  </button>
                  <button 
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${expandedSection === "issues" ? 
                      (darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900") : 
                      (darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900")}`}
                    onClick={() => toggleSection("issues")}
                  >
                    Problèmes
                    {selectedProject.issues && selectedProject.issues.some(i => i.status !== "resolu") && (
                      <span className="ml-2 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs">
                        {selectedProject.issues.filter(i => i.status !== "resolu").length}
                      </span>
                    )}
                  </button>
                  <button 
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${expandedSection === "documents" ? 
                      (darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900") : 
                      (darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900")}`}
                    onClick={() => toggleSection("documents")}
                  >
                    Documents
                  </button>
                  <button 
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${expandedSection === "inspections" ? 
                      (darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900") : 
                      (darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900")}`}
                    onClick={() => toggleSection("inspections")}
                  >
                    Inspections
                  </button>
                  <button 
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${expandedSection === "photos" ? 
                      (darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900") : 
                      (darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900")}`}
                    onClick={() => toggleSection("photos")}
                  >
                    Photos
                  </button>
                </div>
                
                <div className="overflow-y-auto max-h-[calc(90vh-250px)]">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                    {/* Left column - Project details */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Phases and Tasks */}
                      {expandedSection === "phases" && (
                        <div className={`rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"} overflow-hidden`}>
                          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                            <h4 className="font-medium">Phases et tâches du projet</h4>
                          </div>
                          
                          <div className="p-4 space-y-4">
                            {selectedProject.phases.map((phase) => (
                              <div key={phase.id} className={`rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} overflow-hidden shadow-sm`}>
                                <div className={`p-3 ${
                                  phase.status === "termine" ? "bg-green-500 text-white" :
                                  phase.status === "en_cours" ? "bg-blue-500 text-white" :
                                  "bg-gray-200 dark:bg-gray-600 dark:text-white"
                                } flex justify-between items-center`}>
                                  <h5 className="font-medium">{phase.name}</h5>
                                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/20">
                                    {phase.status === "termine" ? "Terminé" : 
                                    phase.status === "en_cours" ? "En cours" : "À venir"}
                                  </span>
                                </div>
                                
                                <div className="px-3 py-2 text-sm">
                                  {phase.startDate && (
                                    <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700">
                                      <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Début:</span>
                                      <span className="font-medium">{formatDate(phase.startDate)}</span>
                                    </div>
                                  )}
                                  
                                  {phase.endDate && (
                                    <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700">
                                      <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Fin:</span>
                                      <span className="font-medium">{formatDate(phase.endDate)}</span>
                                    </div>
                                  )}
                                  
                                  <div className="mt-2">
                                    <div className="font-medium mb-2">Tâches:</div>
                                    <div className="space-y-1.5">
                                      {phase.tasks.map((task) => (
                                        <div 
                                          key={task.id} 
                                          className={`p-2 rounded flex items-start ${
                                            task.completed ? 
                                            (darkMode ? "bg-green-900/20 text-green-300" : "bg-green-50 text-green-800") : 
                                            (darkMode ? "bg-gray-700" : "bg-gray-100")
                                          }`}
                                        >
                                          <div className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded ${
                                            task.completed ? 
                                            "bg-green-500 text-white flex items-center justify-center" : 
                                            "border-2 border-gray-400"
                                          }`}>
                                            {task.completed && (
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                              </svg>
                                            )}
                                          </div>
                                          <div className="ml-2">
                                            <div className="flex items-center justify-between">
                                              <p>{task.name}</p>
                                              {task.assignedTo && (
                                                <span className={`ml-2 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                  {task.assignedTo}
                                                </span>
                                              )}
                                            </div>
                                            {task.deadline && (
                                              <p className="text-xs mt-0.5">
                                                Échéance: {formatDate(task.deadline)}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Materials */}
                      {expandedSection === "materials" && (
                        <div className={`rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"} overflow-hidden`}>
                          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                            <h4 className="font-medium">Matériaux requis</h4>
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
                                      Statut
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                      Livraison
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className={`divide-y divide-gray-200 dark:divide-gray-700`}>
                                  {selectedProject.requiredMaterials.map((material) => (
                                    <tr key={material.id}>
                                      <td className="px-4 py-3 text-sm">
                                        {material.name}
                                      </td>
                                      <td className="px-4 py-3 text-sm">
                                        {material.quantity}
                                      </td>
                                      <td className="px-4 py-3 text-sm">
                                        {material.ordered ? (
                                          material.received ? (
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-800"}`}>
                                              <CheckCircleIcon className="h-3 w-3 mr-1" />
                                              Reçu
                                            </span>
                                          ) : (
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-800"}`}>
                                              <TruckIcon className="h-3 w-3 mr-1" />
                                              Commandé
                                            </span>
                                          )
                                        ) : (
                                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-800"}`}>
                                            <ExclamationCircleIcon className="h-3 w-3 mr-1" />
                                            Non commandé
                                          </span>
                                        )}
                                      </td>
                                      <td className="px-4 py-3 text-sm">
                                        {material.estimatedDelivery ? (
                                          formatDate(material.estimatedDelivery)
                                        ) : (
                                          material.received ? (
                                            "Livré"
                                          ) : (
                                            "-"
                                          )
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
                      
                      {/* Issues */}
                      {expandedSection === "issues" && (
                        <div className={`rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"} overflow-hidden`}>
                          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                            <h4 className="font-medium">Problèmes</h4>
                          </div>
                          
                          <div className="p-4 space-y-4">
                            {selectedProject.issues && selectedProject.issues.length > 0 ? (
                              selectedProject.issues.map((issue) => (
                                <div key={issue.id} className={`rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} overflow-hidden shadow-sm`}>
                                  <div className={`p-3 ${
                                    issue.status === "resolu" ? "bg-green-500 text-white" :
                                    issue.status === "en_cours" ? "bg-blue-500 text-white" :
                                    "bg-red-500 text-white"
                                  } flex justify-between items-center`}>
                                    <h5 className="font-medium">{issue.title}</h5>
                                    <div className="flex items-center space-x-2">
                                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                        issue.priority === "high" ? "bg-red-400/40" :
                                        issue.priority === "medium" ? "bg-amber-400/40" :
                                        "bg-green-400/40"
                                      }`}>
                                        {issue.priority === "high" ? "Haute" :
                                         issue.priority === "medium" ? "Moyenne" :
                                         "Basse"}
                                      </span>
                                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/20">
                                        {issue.status === "resolu" ? "Résolu" :
                                         issue.status === "en_cours" ? "En cours" :
                                         "Ouvert"}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="p-3 text-sm">
                                    <p className="mb-3">{issue.description}</p>
                                    <div className="flex justify-between text-xs">
                                      <span>Créé le: {formatDate(issue.createdDate)}</span>
                                      {issue.resolvedDate && (
                                        <span>Résolu le: {formatDate(issue.resolvedDate)}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-6">
                                <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  Aucun problème signalé pour ce projet
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Documents */}
                      {expandedSection === "documents" && (
                        <div className={`rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"} overflow-hidden`}>
                          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                            <h4 className="font-medium">Documents</h4>
                          </div>
                          
                          <div className="p-4">
                            {selectedProject.documents && selectedProject.documents.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {selectedProject.documents.map((doc) => (
                                  <div 
                                    key={doc.id} 
                                    className={`p-4 rounded-lg flex items-center ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
                                  >
                                    <div className={`p-3 rounded-lg ${
                                      doc.type === "plan" ? (darkMode ? "bg-blue-900/30" : "bg-blue-100") :
                                      doc.type === "contrat" ? (darkMode ? "bg-green-900/30" : "bg-green-100") :
                                      doc.type === "facture" ? (darkMode ? "bg-purple-900/30" : "bg-purple-100") :
                                      (darkMode ? "bg-gray-700" : "bg-gray-200")
                                    } mr-4`}>
                                      <DocumentTextIcon className={`h-5 w-5 ${
                                        doc.type === "plan" ? (darkMode ? "text-blue-400" : "text-blue-600") :
                                        doc.type === "contrat" ? (darkMode ? "text-green-400" : "text-green-600") :
                                        doc.type === "facture" ? (darkMode ? "text-purple-400" : "text-purple-600") :
                                        (darkMode ? "text-gray-400" : "text-gray-600")
                                      }`} />
                                    </div>
                                    <div>
                                      <p className="font-medium">{doc.name}</p>
                                      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
                                        Ajouté le {formatDate(doc.uploadDate)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6">
                                <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  Aucun document associé à ce projet
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Inspections */}
                      {expandedSection === "inspections" && (
                        <div className={`rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"} overflow-hidden`}>
                          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                            <h4 className="font-medium">Inspections</h4>
                          </div>
                          
                          <div className="p-4 space-y-4">
                            {selectedProject.inspections && selectedProject.inspections.length > 0 ? (
                              selectedProject.inspections.map((inspection) => (
                                <div key={inspection.id} className={`rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} overflow-hidden shadow-sm`}>
                                  <div className={`p-3 ${
                                    inspection.status === "effectue" ? "bg-green-500 text-white" :
                                    inspection.status === "a_refaire" ? "bg-red-500 text-white" :
                                    "bg-blue-500 text-white"
                                  } flex justify-between items-center`}>
                                    <h5 className="font-medium">{inspection.type}</h5>
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/20">
                                      {inspection.status === "effectue" ? "Effectué" :
                                       inspection.status === "a_refaire" ? "À refaire" :
                                       "Planifié"}
                                    </span>
                                  </div>
                                  
                                  <div className="p-3 text-sm">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-medium">Date: {formatDate(inspection.date)}</span>
                                      <span>Inspecteur: {inspection.inspector}</span>
                                    </div>
                                    {inspection.notes && (
                                      <div className={`mt-2 p-2 rounded ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                                        <p>{inspection.notes}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-6">
                                <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  Aucune inspection enregistrée pour ce projet
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Photos */}
                      {expandedSection === "photos" && (
                        <div className={`rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"} overflow-hidden`}>
                          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                            <h4 className="font-medium">Photos</h4>
                          </div>
                          
                          <div className="p-4">
                            {selectedProject.photos && selectedProject.photos.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {selectedProject.photos.map((photo) => (
                                  <div 
                                    key={photo.id} 
                                    className={`rounded-lg overflow-hidden shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}
                                  >
                                    <div className="aspect-w-16 aspect-h-9 bg-gray-300 dark:bg-gray-600">
                                      <img 
                                        src={photo.url} 
                                        alt={photo.name} 
                                        className="object-cover w-full h-full"
                                      />
                                    </div>
                                    <div className="p-3">
                                      <p className="font-medium">{photo.name}</p>
                                      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
                                        Ajouté le {formatDate(photo.uploadDate)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6">
                                <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  Aucune photo associée à ce projet
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Right column - Project summary */}
                    <div className="space-y-6">
                      <div className={`rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"} p-5`}>
                        <h4 className="font-medium mb-3">Informations générales</h4>
                        
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <MapPinIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Adresse</p>
                              <p className="font-medium">{selectedProject.location}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <UserIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Client</p>
                              <p className="font-medium">{selectedProject.client.name}</p>
                              <p className="text-sm">{selectedProject.client.phone}</p>
                              <p className="text-sm">{selectedProject.client.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <CalendarDaysIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Calendrier</p>
                              <p className="font-medium">Début: {formatDate(selectedProject.startDate)}</p>
                              <p className="font-medium">Fin prévue: {formatDate(selectedProject.estimatedEndDate)}</p>
                              {selectedProject.actualEndDate && (
                                <p className="font-medium">Fin réelle: {formatDate(selectedProject.actualEndDate)}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <UserGroupIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Techniciens assignés</p>
                              <div className="space-y-1 mt-1">
                                {selectedProject.technicians.map((tech, index) => (
                                  <p key={index} className="font-medium">{tech}</p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"} p-5`}>
                        <h4 className="font-medium mb-3">Budget et avancement</h4>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Avancement</span>
                              <span className="text-sm font-medium">{selectedProject.progress || calculateProjectCompletion(selectedProject)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  selectedProject.progress >= 100 ? "bg-green-500" :
                                  selectedProject.progress > 50 ? "bg-blue-500" :
                                  selectedProject.progress > 25 ? "bg-amber-500" : "bg-orange-500"
                                }`}
                                style={{ width: `${selectedProject.progress || calculateProjectCompletion(selectedProject)}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                            <span className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>Budget</span>
                            <span className="font-medium">{selectedProject.budget.toLocaleString()} €</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>Coûts actuels</span>
                            <span className="font-medium">{selectedProject.costs.toLocaleString()} €</span>
                          </div>
                          
                          <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                            <span className="font-medium">Reste</span>
                            <span className={`font-medium ${
                              selectedProject.budget - selectedProject.costs > 0 ? "text-green-500" : "text-red-500"
                            }`}>
                              {(selectedProject.budget - selectedProject.costs).toLocaleString()} €
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {selectedProject.notes && (
                        <div className={`rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"} p-5`}>
                          <h4 className="font-medium mb-3">Notes</h4>
                          <p className="text-sm">{selectedProject.notes}</p>
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-4">
                        <button className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium
                          ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}>
                          <ArrowPathIcon className="h-4 w-4" />
                          Mettre à jour
                        </button>
                        <button className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium
                          ${darkMode ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"} ${darkMode ? "text-white" : "text-gray-800"}`}>
                          <ChatBubbleLeftIcon className="h-4 w-4" />
                          Messages
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
