"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  // ArrowUpIcon,
  // ArrowDownIcon,
  PlusCircleIcon,
  CalendarIcon,
  ChartBarIcon,
  BanknotesIcon,
  UsersIcon,
  // BoltIcon,
  // SunIcon,
  MapPinIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ChatBubbleLeftRightIcon,
  BellAlertIcon,
  ArrowPathIcon,
  // FireIcon,
  ChartPieIcon,
  CubeIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  // ArrowTopRightOnSquareIcon,
  // EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

/** ---------------------
 *    TYPE DEFINITIONS
 *  --------------------- */
type EventStatus = "scheduled" | "completed" | "cancelled" | "in_progress";
type EventPriority = "low" | "medium" | "high" | "urgent";
type EventCategory = 
  | "meeting_client" 
  | "meeting_admin" 
  | "site_visit" 
  | "deadline" 
  | "task" 
  | "other"
  | "installation"
  | "training"
  | "maintenance";

interface Event {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  category: EventCategory;
  status: EventStatus;
  priority: EventPriority;
  all_day: boolean;
  location: {
    name: string;
    address?: string;
    virtual?: boolean;
  };
  participants: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
    role: string;
    type: "internal" | "client" | "admin" | "external";
  }[];
}

interface Task {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  priority: EventPriority;
  status: "not_started" | "in_progress" | "completed" | "blocked";
  assignee: string;
  related_event?: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

interface Invoice {
  id: string;
  _id?: string;
  date_creation: string;
  contact_ids: string[];
  solution_id: string;
  montant_ht: number;
  tva: number;
  montant_ttc: number;
  statut: "Payée" | "En attente de validation" | "Envoyée" | "Brouillon" | "Annulé";
  date_paiement: string | null;
}

interface Contact {
  id?: string;
  _id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  mailingAddress: string;
  prix: string;
  assignedRegie: string;
  projet?: string[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: "En cours" | "Terminé" | "En attente" | "Annulé";
  client: string;
  start_date: string;
  end_date: string;
  budget: number;
  type: "Solaire" | "Éolien" | "Hydraulique" | "Biomasse" | "Autre";
  location: string;
  progress: number;
}

// interface User {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: string;
//   avatar_url?: string;
// }

interface Stats {
  projectsCount: number;
  projectsByType: { name: string; value: number; color: string }[];
  projectsStatus: { name: string; value: number; color: string }[];
  revenueByMonth: { month: string; value: number }[];
  pendingInvoices: number;
  totalRevenue: number;
  contactsCount: number;
  completedProjects: number;
  upcomingEvents: number;
  todayEvents: number;
  overdueTasks: number;
  pendingTasks: number;
  revenueGrowth: number;
  projectsGrowth: number;
  contactsGrowth: number;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: "info" | "warning" | "success" | "error";
  date: string;
  read: boolean;
  link?: string;
}

/** ---------------------
 *    UTILITY FUNCTIONS
 *  --------------------- */
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/** ---------------------
 *     MAIN COMPONENT
 *  --------------------- */
export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState<{ _id: string; email: string } | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ , setInvoices] = useState<Invoice[]>([]);
  const [ , setContacts] = useState<Contact[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [stats, setStats] = useState<Stats>({
    projectsCount: 0,
    projectsByType: [],
    projectsStatus: [],
    revenueByMonth: [],
    pendingInvoices: 0,
    totalRevenue: 0,
    contactsCount: 0,
    completedProjects: 0,
    upcomingEvents: 0,
    todayEvents: 0,
    overdueTasks: 0,
    pendingTasks: 0,
    revenueGrowth: 0,
    projectsGrowth: 0,
    contactsGrowth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // Load user info from localStorage
  useEffect(() => {
    const proInfo = localStorage.getItem("proInfo");
    if (proInfo) {
      setUserInfo(JSON.parse(proInfo));
    }
  }, []);

  // Fetch sample data
  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      // Sample data for demonstration
      const sampleEvents: Event[] = [
        {
          id: "event001",
          title: "Réunion projet photovoltaïque - Mairie de Montpellier",
          description: "Discussion des spécifications techniques pour l'installation de panneaux solaires",
          start_time: "2025-03-18T10:00:00Z",
          end_time: "2025-03-18T11:30:00Z",
          category: "meeting_client",
          status: "scheduled",
          priority: "high",
          all_day: false,
          location: {
            name: "Mairie de Montpellier",
            address: "1 Place Georges Frêche, 34000 Montpellier",
            virtual: false
          },
          participants: [
            {
              id: "part001",
              name: "Marie Dupont",
              email: "marie.dupont@montpellier.fr",
              avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
              role: "Directrice des services techniques",
              type: "client"
            },
            {
              id: "part002",
              name: "Thomas Dubois",
              email: "thomas.dubois@ecologyb.fr",
              avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
              role: "Admin",
              type: "admin"
            }
          ]
        },
        {
          id: "event002",
          title: "Visite technique - Bornes de recharge",
          description: "Évaluation du site pour l'installation de bornes de recharge pour véhicules électriques",
          start_time: "2025-03-19T14:00:00Z",
          end_time: "2025-03-19T16:00:00Z",
          category: "site_visit",
          status: "scheduled",
          priority: "medium",
          all_day: false,
          location: {
            name: "Parking Centre Commercial Grand Sud",
            address: "Route de la Mer, 34970 Lattes",
            virtual: false
          },
          participants: [
            {
              id: "part003",
              name: "Pierre Laurent",
              email: "pierre.laurent@ecologyb.fr",
              avatar_url: "https://randomuser.me/api/portraits/men/62.jpg",
              role: "Technique",
              type: "internal"
            }
          ]
        },
        {
          id: "event003",
          title: "Installation panneaux solaires - Phase 1",
          description: "Début de l'installation des panneaux solaires sur le toit du bâtiment principal",
          start_time: "2025-03-23T08:00:00Z",
          end_time: "2025-03-25T18:00:00Z",
          category: "installation",
          status: "scheduled",
          priority: "high",
          all_day: true,
          location: {
            name: "École Jean Jaurès",
            address: "123 Avenue de la Liberté, 34000 Montpellier",
            virtual: false
          },
          participants: [
            {
              id: "part003",
              name: "Pierre Laurent",
              email: "pierre.laurent@ecologyb.fr",
              avatar_url: "https://randomuser.me/api/portraits/men/62.jpg",
              role: "Technique",
              type: "internal"
            }
          ]
        }
      ];
      
      const sampleTasks: Task[] = [
        {
          id: "task001",
          title: "Finaliser le dossier de subvention",
          description: "Compléter tous les documents requis et vérifier les pièces justificatives",
          due_date: "2025-04-12T18:00:00Z",
          priority: "high",
          status: "in_progress",
          assignee: "user004",
          created_at: "2025-03-10T11:30:00Z",
          updated_at: "2025-03-15T14:30:00Z",
          tags: ["subvention", "administratif", "deadline"]
        },
        {
          id: "task002",
          title: "Préparer présentation technique pour la réunion mairie",
          description: "Créer des slides détaillant les spécifications techniques des panneaux et le plan d'installation",
          due_date: "2025-03-17T17:00:00Z",
          priority: "high",
          status: "in_progress",
          assignee: "user003",
          related_event: "event001",
          created_at: "2025-03-14T09:30:00Z",
          updated_at: "2025-03-15T16:45:00Z",
          tags: ["présentation", "client", "technique"]
        },
        {
          id: "task003",
          title: "Commander le matériel pour l'installation des panneaux",
          description: "Passer commande des panneaux solaires et du matériel de fixation nécessaire",
          due_date: "2025-03-19T12:00:00Z",
          priority: "urgent",
          status: "not_started",
          assignee: "user003",
          created_at: "2025-03-15T11:20:00Z",
          updated_at: "2025-03-15T11:20:00Z",
          tags: ["commande", "matériel", "installation"]
        }
      ];
      
      const sampleInvoices: Invoice[] = [
        {
          id: "INV2025-001",
          date_creation: "2025-03-10T15:30:00Z",
          contact_ids: ["c001", "c002"],
          solution_id: "sol001",
          montant_ht: 5000,
          tva: 20,
          montant_ttc: 6000,
          statut: "Payée",
          date_paiement: "2025-03-15T10:00:00Z"
        },
        {
          id: "INV2025-002",
          date_creation: "2025-03-12T11:45:00Z",
          contact_ids: ["c003"],
          solution_id: "sol002",
          montant_ht: 3500,
          tva: 20,
          montant_ttc: 4200,
          statut: "Envoyée",
          date_paiement: null
        },
        {
          id: "INV2025-003",
          date_creation: "2025-03-16T09:30:00Z",
          contact_ids: ["c004", "c005"],
          solution_id: "sol001",
          montant_ht: 7500,
          tva: 20,
          montant_ttc: 9000,
          statut: "Brouillon",
          date_paiement: null
        }
      ];
      
      const sampleContacts: Contact[] = [
        {
          id: "c001",
          firstName: "Marie",
          lastName: "Dupont",
          email: "marie.dupont@example.com",
          phone: "06 12 34 56 78",
          mailingAddress: "12 Rue de la Paix, 75001 Paris",
          prix: "1200",
          assignedRegie: userInfo?._id || ""
        },
        {
          id: "c002",
          firstName: "Jean",
          lastName: "Martin",
          email: "jean.martin@example.com",
          phone: "06 23 45 67 89",
          mailingAddress: "45 Avenue des Champs-Élysées, 75008 Paris",
          prix: "950",
          assignedRegie: userInfo?._id || ""
        },
        {
          id: "c003",
          firstName: "Sophie",
          lastName: "Bernard",
          email: "sophie.bernard@example.com",
          phone: "06 34 56 78 90",
          mailingAddress: "8 Place Bellecour, 69002 Lyon",
          prix: "1500",
          assignedRegie: userInfo?._id || ""
        }
      ];
      
      const sampleProjects: Project[] = [
        {
          id: "p001",
          name: "Installation Panneaux Solaires - École Jean Jaurès",
          description: "Installation de 50 panneaux solaires sur le toit de l'école",
          status: "En cours",
          client: "Mairie de Montpellier",
          start_date: "2025-03-01T08:00:00Z",
          end_date: "2025-04-15T18:00:00Z",
          budget: 45000,
          type: "Solaire",
          location: "Montpellier",
          progress: 35
        },
        {
          id: "p002",
          name: "Bornes de recharge - Centre Commercial",
          description: "Installation de 10 bornes de recharge pour véhicules électriques",
          status: "En cours",
          client: "Grand Sud Shopping",
          start_date: "2025-02-15T08:00:00Z",
          end_date: "2025-03-30T18:00:00Z",
          budget: 25000,
          type: "Autre",
          location: "Lattes",
          progress: 70
        },
        {
          id: "p003",
          name: "Éoliennes Résidentielles - Eco-quartier",
          description: "Installation de 5 petites éoliennes pour un quartier résidentiel",
          status: "En attente",
          client: "Coopérative Habitat Durable",
          start_date: "2025-04-01T08:00:00Z",
          end_date: "2025-05-15T18:00:00Z",
          budget: 35000,
          type: "Éolien",
          location: "Nîmes",
          progress: 0
        },
        {
          id: "p004",
          name: "Centrale Biomasse - Industrie Agricole",
          description: "Installation d'une petite centrale à biomasse pour une exploitation agricole",
          status: "Terminé",
          client: "Ferme Bio des Cévennes",
          start_date: "2025-01-10T08:00:00Z",
          end_date: "2025-02-28T18:00:00Z",
          budget: 55000,
          type: "Biomasse",
          location: "Alès",
          progress: 100
        }
      ];
      
      const sampleNotifications: NotificationItem[] = [
        {
          id: "notif001",
          title: "Nouvelle facture créée",
          description: "La facture INV2025-003 a été créée et est en attente de validation.",
          type: "info",
          date: "2025-03-16T09:30:00Z",
          read: false,
          link: "/dashboard/pm/billing"
        },
        {
          id: "notif002",
          title: "Tâche en retard",
          description: "La tâche 'Commander le matériel pour l'installation des panneaux' est en retard.",
          type: "warning",
          date: "2025-03-15T11:20:00Z",
          read: false
        },
        {
          id: "notif003",
          title: "Paiement reçu",
          description: "Le paiement pour la facture INV2025-001 a été reçu.",
          type: "success",
          date: "2025-03-15T10:00:00Z",
          read: true,
          link: "/dashboard/pm/billing"
        }
      ];
      
      // Calculate statistics
      const sampleStats: Stats = {
        projectsCount: sampleProjects.length,
        projectsByType: [
          { name: "Solaire", value: sampleProjects.filter(p => p.type === "Solaire").length, color: "#FFCA28" },
          { name: "Éolien", value: sampleProjects.filter(p => p.type === "Éolien").length, color: "#29B6F6" },
          { name: "Hydraulique", value: sampleProjects.filter(p => p.type === "Hydraulique").length, color: "#42A5F5" },
          { name: "Biomasse", value: sampleProjects.filter(p => p.type === "Biomasse").length, color: "#66BB6A" },
          { name: "Autre", value: sampleProjects.filter(p => p.type === "Autre").length, color: "#78909C" }
        ],
        projectsStatus: [
          { name: "En cours", value: sampleProjects.filter(p => p.status === "En cours").length, color: "#2196F3" },
          { name: "Terminé", value: sampleProjects.filter(p => p.status === "Terminé").length, color: "#4CAF50" },
          { name: "En attente", value: sampleProjects.filter(p => p.status === "En attente").length, color: "#FF9800" },
          { name: "Annulé", value: sampleProjects.filter(p => p.status === "Annulé").length, color: "#F44336" }
        ],
        revenueByMonth: [
          { month: "Jan", value: 35000 },
          { month: "Fév", value: 42000 },
          { month: "Mar", value: 50000 },
          { month: "Avr", value: 0 },
          { month: "Mai", value: 0 },
          { month: "Juin", value: 0 },
          { month: "Juil", value: 0 },
          { month: "Aoû", value: 0 },
          { month: "Sep", value: 0 },
          { month: "Oct", value: 0 },
          { month: "Nov", value: 0 },
          { month: "Déc", value: 0 }
        ],
        pendingInvoices: sampleInvoices.filter(inv => inv.statut === "Envoyée" || inv.statut === "En attente de validation").length,
        totalRevenue: sampleInvoices.reduce((sum, inv) => sum + (inv.statut === "Payée" ? inv.montant_ttc : 0), 0),
        contactsCount: sampleContacts.length,
        completedProjects: sampleProjects.filter(p => p.status === "Terminé").length,
        upcomingEvents: sampleEvents.filter(e => new Date(e.start_time) > new Date()).length,
        todayEvents: sampleEvents.filter(e => {
          const eventDate = new Date(e.start_time).toDateString();
          const today = new Date().toDateString();
          return eventDate === today;
        }).length,
        overdueTasks: sampleTasks.filter(t => 
          t.status !== "completed" && new Date(t.due_date) < new Date()
        ).length,
        pendingTasks: sampleTasks.filter(t => t.status !== "completed").length,
        revenueGrowth: 19.2,
        projectsGrowth: 8.5,
        contactsGrowth: 12.7
      };

      // Set the state with the sample data
      setEvents(sampleEvents);
      setTasks(sampleTasks);
      setInvoices(sampleInvoices);
      setContacts(sampleContacts);
      setProjects(sampleProjects);
      setNotifications(sampleNotifications);
      setStats(sampleStats);
      setIsLoading(false);
    }, 1000);
  }, [userInfo]);

  // Get today's events
  const todaysEvents = useMemo(() => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time).toDateString();
      const today = new Date().toDateString();
      return eventDate === today;
    });
  }, [events]);

  // Get overdue tasks
  const overdueTasks = useMemo(() => {
    return tasks.filter(task => 
      task.status !== "completed" && new Date(task.due_date) < new Date()
    );
  }, [tasks]);

  // Get the welcome message based on time of day
  const welcomeMessage = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  }, []);

  // Get task status color
  const getTaskStatusColor = (status: string): string => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "not_started": return "bg-gray-100 text-gray-800";
      case "blocked": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get priority color
  const getPriorityColor = (priority: EventPriority): string => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get event category color and icon
  const getCategoryInfo = (category: EventCategory) => {
    switch (category) {
      case "meeting_client":
        return { 
          color: "bg-blue-100 text-blue-800 border-blue-300",
          icon: <BriefcaseIcon className="h-5 w-5 text-blue-500" />
        };
      case "meeting_admin":
        return { 
          color: "bg-purple-100 text-purple-800 border-purple-300",
          icon: <UsersIcon className="h-5 w-5 text-purple-500" />
        };
      case "site_visit":
        return { 
          color: "bg-green-100 text-green-800 border-green-300",
          icon: <MapPinIcon className="h-5 w-5 text-green-500" />
        };
      case "deadline":
        return { 
          color: "bg-red-100 text-red-800 border-red-300",
          icon: <ClockIcon className="h-5 w-5 text-red-500" />
        };
      case "installation":
        return { 
          color: "bg-yellow-100 text-yellow-800 border-yellow-300",
          icon: <CubeIcon className="h-5 w-5 text-yellow-500" />
        };
      case "training":
        return { 
          color: "bg-indigo-100 text-indigo-800 border-indigo-300",
          icon: <UsersIcon className="h-5 w-5 text-indigo-500" />
        };
      case "maintenance":
        return { 
          color: "bg-teal-100 text-teal-800 border-teal-300",
          icon: <ArrowPathIcon className="h-5 w-5 text-teal-500" />
        };
      default:
        return { 
          color: "bg-gray-100 text-gray-800 border-gray-300",
          icon: <CalendarIcon className="h-5 w-5 text-gray-500" />
        };
    }
  };

  // Get notification type color and icon
  const getNotificationInfo = (type: string) => {
    switch (type) {
      case "info":
        return { 
          color: "bg-blue-100 text-blue-800",
          icon: <BellAlertIcon className="h-5 w-5 text-blue-500" />
        };
      case "warning":
        return { 
          color: "bg-yellow-100 text-yellow-800",
          icon: <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />
        };
      case "success":
        return { 
          color: "bg-green-100 text-green-800",
          icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />
        };
      case "error":
        return { 
          color: "bg-red-100 text-red-800",
          icon: <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
        };
      default:
        return { 
          color: "bg-gray-100 text-gray-800",
          icon: <BellAlertIcon className="h-5 w-5 text-gray-500" />
        };
    }
  };

  // Calculate progress bar width
  const calculateProgressWidth = (progress: number): string => {
    return `${Math.max(0, Math.min(100, progress))}%`;
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main
          className="flex-1 overflow-y-auto"
          style={{
            background:
              "linear-gradient(135deg, rgba(191,221,249,0.1) 0%, rgba(210,252,178,0.05) 100%)",
          }}
        >
          <div className="p-6 md:p-8">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl font-bold text-[#213f5b]">
                  {welcomeMessage}, {userInfo?.email.split('@')[0] || "Utilisateur"}
                </h1>
                <p className="text-gray-600">
                  Bienvenue sur votre tableau de bord de gestion de projets d&apos;énergies renouvelables
                </p>
              </motion.div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-all relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <BellAlertIcon className="h-5 w-5 text-[#213f5b]" />
                  <span className="hidden md:inline">Notifications</span>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      className="absolute top-24 right-8 bg-white rounded-xl shadow-xl z-50 w-full max-w-md"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="p-4 border-b">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-[#213f5b]">Notifications</h3>
                          <button 
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => setShowNotifications(false)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto p-2">
                        {notifications.length === 0 ? (
                          <div className="text-center py-6 text-gray-500">
                            Aucune notification
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {notifications.map(notification => {
                              const { color, icon } = getNotificationInfo(notification.type);
                              return (
                                <div 
                                  key={notification.id}
                                  className={`p-3 rounded-lg border ${notification.read ? 'bg-white' : 'bg-blue-50'} hover:bg-gray-50 transition-colors`}
                                >
                                  <div className="flex gap-3">
                                    <div className={`p-2 rounded-full ${color} flex-shrink-0`}>
                                      {icon}
                                    </div>
                                    <div className="flex-grow">
                                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                                      <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                                      <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-gray-500">{formatDate(notification.date)} - {formatTime(notification.date)}</span>
                                        {notification.link && (
                                          <Link 
                                            href={notification.link}
                                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                          >
                                            <span>Voir</span>
                                            <ArrowRightIcon className="h-3 w-3" />
                                          </Link>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div className="p-3 border-t text-center">
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          Marquer tout comme lu
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-[#213f5b] text-white rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  <span className="hidden md:inline">Nouveau Projet</span>
                </motion.button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <ArrowPathIcon className="h-10 w-10 text-[#213f5b] animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Chargement du tableau de bord...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* KPI Stats Cards */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div 
                    className="bg-white rounded-xl shadow-sm p-5 border border-[#bfddf9]/30 hover:shadow-md transition-all"
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Projets</p>
                        <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{stats.projectsCount}</h3>
                        <div className="flex items-center gap-1 mt-2">
                          <span className={`text-xs flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium ${stats.projectsGrowth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {stats.projectsGrowth >= 0 ? <ArrowTrendingUpIcon className="h-3 w-3" /> : <ArrowTrendingDownIcon className="h-3 w-3" />}
                            {Math.abs(stats.projectsGrowth)}%
                          </span>
                          <span className="text-xs text-gray-500">vs mois précédent</span>
                        </div>
                      </div>
                      <div className="p-3 rounded-full bg-green-100">
                        <BriefcaseIcon className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                        style={{ width: calculateProgressWidth((stats.completedProjects / stats.projectsCount) * 100) }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{stats.completedProjects} projets terminés</p>
                  </motion.div>

                  <motion.div 
                    className="bg-white rounded-xl shadow-sm p-5 border border-[#bfddf9]/30 hover:shadow-md transition-all"
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Revenu Total</p>
                        <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{formatCurrency(stats.totalRevenue)}</h3>
                        <div className="flex items-center gap-1 mt-2">
                          <span className={`text-xs flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium ${stats.revenueGrowth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {stats.revenueGrowth >= 0 ? <ArrowTrendingUpIcon className="h-3 w-3" /> : <ArrowTrendingDownIcon className="h-3 w-3" />}
                            {Math.abs(stats.revenueGrowth)}%
                          </span>
                          <span className="text-xs text-gray-500">vs mois précédent</span>
                        </div>
                      </div>
                      <div className="p-3 rounded-full bg-blue-100">
                        <BanknotesIcon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-600 flex justify-between items-center">
                      <span>Factures en attente:</span>
                      <span className="font-medium text-[#213f5b]">{stats.pendingInvoices}</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="bg-white rounded-xl shadow-sm p-5 border border-[#bfddf9]/30 hover:shadow-md transition-all"
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Événements</p>
                        <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{stats.upcomingEvents}</h3>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-xs bg-yellow-100 text-yellow-800 rounded-full px-1.5 py-0.5 font-medium flex items-center gap-0.5">
                            <ClockIcon className="h-3 w-3" />
                            {stats.todayEvents}
                          </span>
                          <span className="text-xs text-gray-500">aujourd&apos;hui</span>
                        </div>
                      </div>
                      <div className="p-3 rounded-full bg-purple-100">
                        <CalendarIcon className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-600 flex justify-between items-center">
                      <span>Prochaine réunion:</span>
                      <span className="font-medium text-[#213f5b]">
                        {events.length > 0 
                          ? formatDate(events[0].start_time)
                          : "Aucune"}
                      </span>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="bg-white rounded-xl shadow-sm p-5 border border-[#bfddf9]/30 hover:shadow-md transition-all"
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Contacts</p>
                        <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{stats.contactsCount}</h3>
                        <div className="flex items-center gap-1 mt-2">
                          <span className={`text-xs flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium ${stats.contactsGrowth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {stats.contactsGrowth >= 0 ? <ArrowTrendingUpIcon className="h-3 w-3" /> : <ArrowTrendingDownIcon className="h-3 w-3" />}
                            {Math.abs(stats.contactsGrowth)}%
                          </span>
                          <span className="text-xs text-gray-500">vs mois précédent</span>
                        </div>
                      </div>
                      <div className="p-3 rounded-full bg-amber-100">
                        <UsersIcon className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-600 flex justify-between items-center">
                      <span>Tâches en cours:</span>
                      <span className="font-medium text-[#213f5b]">{stats.pendingTasks}</span>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Projects & Charts */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Projects Overview */}
                    <motion.div 
                      className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bfddf9]/30"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-semibold text-[#213f5b] flex items-center gap-2">
                          <BriefcaseIcon className="h-5 w-5 text-[#213f5b]" />
                          Projets en cours
                        </h2>
                        <Link href="/dashboard/pm/contacts-organizations" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                          Tous les projets
                          <ArrowRightIcon className="h-4 w-4" />
                        </Link>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {projects
                          .filter(project => project.status === "En cours")
                          .slice(0, 3)
                          .map((project) => (
                            <div key={project.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                                  <p className="text-sm text-gray-600 mt-1">{truncateText(project.description, 100)}</p>
                                  <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                                      {project.type}
                                    </span>
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                      <MapPinIcon className="h-3 w-3" />
                                      {project.location}
                                    </span>
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                      <BanknotesIcon className="h-3 w-3" />
                                      {formatCurrency(project.budget)}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                                  {project.status}
                                </span>
                              </div>
                              <div className="mt-3">
                                <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                                  <span>Progression</span>
                                  <span>{project.progress}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                                    style={{ width: `${project.progress}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                                  <span>Début: {formatDate(project.start_date)}</span>
                                  <span>Fin: {formatDate(project.end_date)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                      {projects.filter(project => project.status === "En cours").length === 0 && (
                        <div className="py-10 text-center text-gray-500">
                          <BriefcaseIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                          <p>Aucun projet en cours actuellement</p>
                          <button className="mt-3 text-sm text-blue-600 hover:text-blue-800">
                            Créer un nouveau projet
                          </button>
                        </div>
                      )}
                    </motion.div>

                    {/* Charts Section */}
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {/* Revenue Chart */}
                      <div className="bg-white rounded-xl shadow-sm p-4 border border-[#bfddf9]/30">
                        <h2 className="font-semibold text-[#213f5b] mb-4 flex items-center gap-2">
                          <ChartBarIcon className="h-5 w-5 text-[#213f5b]" />
                          Revenus (2025)
                        </h2>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={stats.revenueByMonth}
                              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                            >
                              <XAxis dataKey="month" tickLine={false} axisLine={false} />
                              <YAxis tickFormatter={(value) => `${value/1000}k`} tickLine={false} axisLine={false} />
                              <Tooltip 
                                formatter={(value) => [`${formatCurrency(value as number)}`, "Revenu"]}
                                labelStyle={{ color: "#213f5b" }}
                                contentStyle={{ 
                                  borderRadius: "0.5rem", 
                                  border: "none", 
                                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" 
                                }}
                              />
                              <Bar 
                                dataKey="value" 
                                fill="#4F46E5"
                                radius={[4, 4, 0, 0]}
                                background={{ fill: '#f3f4f6' }}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Project Distribution Chart */}
                      <div className="bg-white rounded-xl shadow-sm p-4 border border-[#bfddf9]/30">
                        <h2 className="font-semibold text-[#213f5b] mb-4 flex items-center gap-2">
                          <ChartPieIcon className="h-5 w-5 text-[#213f5b]" />
                          Répartition des Projets
                        </h2>
                        <div className="h-64 flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={stats.projectsByType}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                              >
                                {stats.projectsByType.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value, name) => [`${value} projets`, name]}
                                contentStyle={{ 
                                  borderRadius: "0.5rem", 
                                  border: "none", 
                                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" 
                                }}
                              />
                              <Legend 
                                layout="horizontal" 
                                verticalAlign="bottom" 
                                align="center"
                                wrapperStyle={{ fontSize: "12px" }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </motion.div>

                    {/* Quick Access / Action Cards */}
                    <motion.div 
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Link 
                        href="/contacts" 
                        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group"
                      >
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <UsersIcon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Gestion des Contacts</h3>
                        <p className="text-sm text-gray-600">Gérez vos clients et partenaires</p>
                      </Link>

                      <Link 
                        href="/dashboard/pm/agenda" 
                        className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group"
                      >
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <CalendarIcon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Agenda</h3>
                        <p className="text-sm text-gray-600">Planifiez vos rendez-vous et événements</p>
                      </Link>

                      <Link 
                        href="/dashboard/pm/billing" 
                        className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group"
                      >
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <DocumentTextIcon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Facturation</h3>
                        <p className="text-sm text-gray-600">Gérez vos factures et paiements</p>
                      </Link>
                    </motion.div>
                  </div>

                  {/* Right Column - Activities & Tasks */}
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {/* Today's Events */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bfddf9]/30">
                      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-semibold text-[#213f5b] flex items-center gap-2">
                          <CalendarIcon className="h-5 w-5 text-[#213f5b]" />
                          Événements du jour
                        </h2>
                        <Link href="/dashboard/pm/agenda" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                          Agenda
                          <ArrowRightIcon className="h-4 w-4" />
                        </Link>
                      </div>
                      <div className="overflow-hidden">
                        {todaysEvents.length === 0 ? (
                          <div className="py-8 text-center text-gray-500">
                            <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                            <p>Aucun événement aujourd&apos;hui</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                            {todaysEvents.map((event) => {
                              const { color, icon } = getCategoryInfo(event.category);
                              return (
                                <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                                  <div className="flex gap-3">
                                    <div className={`p-2 rounded-full ${color.split(' ')[0]}`}>
                                      {icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-medium text-gray-900 truncate">{event.title}</h3>
                                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                          <ClockIcon className="h-3 w-3" />
                                          {event.all_day 
                                            ? "Toute la journée" 
                                            : `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`}
                                        </span>
                                        {event.location.name && (
                                          <span className="flex items-center gap-1">
                                            <MapPinIcon className="h-3 w-3" />
                                            {truncateText(event.location.name, 20)}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 mt-2">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                                          {event.priority === "urgent" ? "Urgent" : 
                                           event.priority === "high" ? "Élevée" : 
                                           event.priority === "medium" ? "Moyenne" : "Basse"}
                                        </span>
                                        <div className="flex -space-x-2">
                                          {event.participants.slice(0, 3).map((participant, idx) => (
                                            <div key={idx} className="h-6 w-6 rounded-full border-2 border-white overflow-hidden">
                                              {participant.avatar_url ? (
                                                <img 
                                                  src={participant.avatar_url} 
                                                  alt={participant.name}
                                                  className="h-full w-full object-cover"
                                                />
                                              ) : (
                                                <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold">
                                                  {participant.name.charAt(0)}
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                          {event.participants.length > 3 && (
                                            <div className="h-6 w-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                                              +{event.participants.length - 3}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tasks List */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bfddf9]/30">
                      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-semibold text-[#213f5b] flex items-center gap-2">
                          <CheckCircleIcon className="h-5 w-5 text-[#213f5b]" />
                          Tâches à faire
                        </h2>
                        <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                          <PlusCircleIcon className="h-4 w-4" />
                          Ajouter
                        </button>
                      </div>
                      <div className="p-2">
                        {tasks.filter(task => task.status !== "completed").length === 0 ? (
                          <div className="py-8 text-center text-gray-500">
                            <CheckCircleIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                            <p>Aucune tâche en cours</p>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-72 overflow-y-auto p-2">
                            {overdueTasks.length > 0 && (
                              <div className="mb-3">
                                <div className="text-xs font-medium uppercase text-red-600 mb-2 flex items-center gap-1">
                                  <ExclamationCircleIcon className="h-4 w-4" />
                                  Tâches en retard
                                </div>
                                <div className="space-y-2">
                                  {overdueTasks.map((task) => (
                                    <div 
                                      key={task.id} 
                                      className="p-3 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                                    >
                                      <div className="flex items-start gap-3">
                                        <input 
                                          type="checkbox" 
                                          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-600">
                                            <span className="flex items-center gap-0.5">
                                              <ClockIcon className="h-3 w-3" />
                                              Échéance: {formatDate(task.due_date)}
                                            </span>
                                            <span className={`px-1.5 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                                              {task.priority === "urgent" ? "Urgent" : 
                                              task.priority === "high" ? "Élevée" : 
                                              task.priority === "medium" ? "Moyenne" : "Basse"}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div>
                              <div className="text-xs font-medium uppercase text-gray-600 mb-2">
                                Tâches à faire
                              </div>
                              <div className="space-y-2">
                                {tasks
                                  .filter(task => task.status !== "completed" && !overdueTasks.includes(task))
                                  .map((task) => (
                                    <div 
                                      key={task.id} 
                                      className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                      <div className="flex items-start gap-3">
                                        <input 
                                          type="checkbox" 
                                          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-600">
                                            <span className="flex items-center gap-0.5">
                                              <ClockIcon className="h-3 w-3" />
                                              Échéance: {formatDate(task.due_date)}
                                            </span>
                                            <span className={`px-1.5 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                                              {task.priority === "urgent" ? "Urgent" : 
                                               task.priority === "high" ? "Élevée" : 
                                               task.priority === "medium" ? "Moyenne" : "Basse"}
                                            </span>
                                            <span className={`px-1.5 py-0.5 rounded-full ${getTaskStatusColor(task.status)}`}>
                                              {task.status === "in_progress" ? "En cours" : 
                                               task.status === "not_started" ? "À démarrer" : 
                                               task.status === "blocked" ? "Bloquée" : "Terminée"}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="bg-gray-50 px-4 py-3 text-right border-t">
                        <Link href="/taches" className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-end gap-1">
                          Voir toutes les tâches
                          <ArrowRightIcon className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bfddf9]/30">
                      <div className="p-4 border-b border-gray-100">
                        <h2 className="font-semibold text-[#213f5b] flex items-center gap-2">
                          <ChatBubbleLeftRightIcon className="h-5 w-5 text-[#213f5b]" />
                          Activité récente
                        </h2>
                      </div>
                      <div className="p-4">
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          <div className="flex gap-3 items-start">
                            <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                              <BanknotesIcon className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-900">
                                Facture <span className="font-medium">INV2025-001</span> a été payée
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Il y a 2 jours</p>
                            </div>
                          </div>
                          <div className="flex gap-3 items-start">
                            <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                              <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-900">
                                Nouveau projet <span className="font-medium">Bornes de recharge - Centre Commercial</span> créé
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Il y a 5 jours</p>
                            </div>
                          </div>
                          <div className="flex gap-3 items-start">
                            <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
                              <CalendarIcon className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-900">
                                Réunion avec <span className="font-medium">Mairie de Montpellier</span> programmée
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Il y a 1 semaine</p>
                            </div>
                          </div>
                          <div className="flex gap-3 items-start">
                            <div className="bg-yellow-100 p-2 rounded-full flex-shrink-0">
                              <DocumentTextIcon className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-900">
                                Devis <span className="font-medium">DEV2025-012</span> envoyé à <span className="font-medium">Coopérative Habitat Durable</span>
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Il y a 1 semaine</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}