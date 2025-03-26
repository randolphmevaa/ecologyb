"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  BellAlertIcon,
  BoltIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ChatBubbleOvalLeftIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CogIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  PlusCircleIcon,
  UserCircleIcon,
  UserGroupIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  // ChartBarIcon
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

type UserRole = "admin" | "manager" | "regie" | "technician" | "sales" | "customer";
type UserStatus = "active" | "inactive" | "pending" | "blocked";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatar_url?: string;
  last_login?: string;
  created_at: string;
  projects_count: number;
  tasks_count: number;
  department?: string;
}

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
  assignee_name?: string;
  assignee_avatar?: string;
  related_event?: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

// interface Message {
//   id: string;
//   sender: {
//     id: string;
//     name: string;
//     avatar_url?: string;
//   };
//   content: string;
//   timestamp: string;
//   read: boolean;
//   attachments?: {
//     name: string;
//     type: string;
//     url: string;
//   }[];
// }

interface Chat {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar_url?: string;
  }[];
  last_message: {
    content: string;
    timestamp: string;
    sender_id: string;
  };
  unread_count: number;
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
  manager?: string;
  manager_name?: string;
  team_members?: number;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: "info" | "warning" | "success" | "error";
  date: string;
  read: boolean;
  link?: string;
  category?: "system" | "user" | "project" | "security" | "billing";
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  usersByRole: { name: string; value: number; color: string }[];
  userActivity: { date: string; count: number }[];
  newUsersThisWeek: number;
  usersGrowth: number;
  
  projectsCount: number;
  projectsByType: { name: string; value: number; color: string }[];
  projectsStatus: { name: string; value: number; color: string }[];
  projectsGrowth: number;
  
  totalRevenue: number;
  revenueByMonth: { month: string; value: number }[];
  revenueGrowth: number;
  pendingInvoices: number;
  overdueTasks: number;
  
  securityIncidents: number;
  
  teamPerformance: {
    team: string;
    tasks_to_do: number;
    tasks_to_close: number;
    projects_in_progress: number;
    projects_closed: number;
  }[];
  
  monthlyActiveUsers: { month: string; value: number }[];
}

// interface AccessLog {
//   id: string;
//   user_id: string;
//   user_name: string;
//   action: string;
//   resource: string;
//   timestamp: string;
//   ip_address: string;
//   status: "success" | "failure";
//   details?: string;
// }

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

// const formatDateTime = (dateString: string): string => {
//   const date = new Date(dateString);
//   return new Intl.DateTimeFormat('fr-FR', {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit'
//   }).format(date);
// };

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

// const getTimeSince = (dateString: string): string => {
//   const now = new Date();
//   const past = new Date(dateString);
//   const diffInMs = now.getTime() - past.getTime();
//   const diffInSec = Math.floor(diffInMs / 1000);
  
//   if (diffInSec < 60) return `${diffInSec} secondes`;
  
//   const diffInMin = Math.floor(diffInSec / 60);
//   if (diffInMin < 60) return `${diffInMin} minutes`;
  
//   const diffInHours = Math.floor(diffInMin / 60);
//   if (diffInHours < 24) return `${diffInHours} heures`;
  
//   const diffInDays = Math.floor(diffInHours / 24);
//   if (diffInDays < 30) return `${diffInDays} jours`;
  
//   const diffInMonths = Math.floor(diffInDays / 30);
//   if (diffInMonths < 12) return `${diffInMonths} mois`;
  
//   const diffInYears = Math.floor(diffInMonths / 12);
//   return `${diffInYears} ans`;
// };

/** ---------------------
 *     MAIN COMPONENT
 *  --------------------- */
export default function AdminDashboardPage() {
  const [adminInfo, setAdminInfo] = useState<{ _id: string; email: string } | null>(null);
  const [ , setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [ , setInvoices] = useState<Invoice[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    usersByRole: [],
    userActivity: [],
    newUsersThisWeek: 0,
    usersGrowth: 0,
    
    projectsCount: 0,
    projectsByType: [],
    projectsStatus: [],
    projectsGrowth: 0,
    
    totalRevenue: 0,
    revenueByMonth: [],
    revenueGrowth: 0,
    pendingInvoices: 0,
    overdueTasks: 0,
    
    securityIncidents: 0,
    
    teamPerformance: [],
    
    monthlyActiveUsers: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [savStats ] = useState({
    openTickets: 12,
    pendingTickets: 5,
    solvedTickets: 42,
    totalTickets: 59,
    avgResponseTime: 8, // hours
    ticketsTrend: -15, // percentage trend vs last period
  });

  // Simulate fetching SAV data
  useEffect(() => {
    // Replace with actual API call
    // const fetchSAVData = async () => {
    //   // const response = await fetch('/api/sav/stats');
    //   // const data = await response.json();
    //   // setSavStats(data);
    // };
    
    // Comment out when implementing real API call
    // fetchSAVData();
  }, []);

  // Calculate percentage of solved tickets
  // const solvedPercentage = Math.round((savStats.solvedTickets / savStats.totalTickets) * 100);
  
  // Load admin info from localStorage
  useEffect(() => {
    const adminInfo = localStorage.getItem("adminInfo");
    if (adminInfo) {
      setAdminInfo(JSON.parse(adminInfo));
    }
  }, []);

  // Fetch sample data
  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      // Sample user data
      const sampleUsers: User[] = [
        {
          id: "u001",
          firstName: "Thomas",
          lastName: "Dubois",
          email: "thomas.dubois@ecologyb.fr",
          phone: "06 12 34 56 78",
          role: "admin",
          status: "active",
          avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
          last_login: "2025-03-19T08:15:00Z",
          created_at: "2023-01-10T10:00:00Z",
          projects_count: 12,
          tasks_count: 5,
          department: "Direction"
        },
        {
          id: "u002",
          firstName: "Marie",
          lastName: "Lefevre",
          email: "marie.lefevre@ecologyb.fr",
          phone: "06 23 45 67 89",
          role: "manager",
          status: "active",
          avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
          last_login: "2025-03-18T16:30:00Z",
          created_at: "2023-02-15T09:30:00Z",
          projects_count: 8,
          tasks_count: 12,
          department: "Projets"
        },
        {
          id: "u003",
          firstName: "Pierre",
          lastName: "Laurent",
          email: "pierre.laurent@ecologyb.fr",
          phone: "06 34 56 78 90",
          role: "technician",
          status: "active",
          avatar_url: "https://randomuser.me/api/portraits/men/62.jpg",
          last_login: "2025-03-19T07:45:00Z",
          created_at: "2023-03-20T11:15:00Z",
          projects_count: 0,
          tasks_count: 7,
          department: "Technique"
        },
        {
          id: "u004",
          firstName: "Sophie",
          lastName: "Martin",
          email: "sophie.martin@ecologyb.fr",
          phone: "06 45 67 89 01",
          role: "regie",
          status: "active",
          avatar_url: "https://randomuser.me/api/portraits/women/22.jpg",
          last_login: "2025-03-18T14:20:00Z",
          created_at: "2023-04-05T13:45:00Z",
          projects_count: 5,
          tasks_count: 3,
          department: "Commercial"
        },
        {
          id: "u005",
          firstName: "Lucas",
          lastName: "Bernard",
          email: "lucas.bernard@ecologyb.fr",
          phone: "06 56 78 90 12",
          role: "sales",
          status: "active",
          avatar_url: "https://randomuser.me/api/portraits/men/55.jpg",
          last_login: "2025-03-17T11:10:00Z",
          created_at: "2023-05-12T09:30:00Z",
          projects_count: 0,
          tasks_count: 4,
          department: "Commercial"
        },
        {
          id: "u006",
          firstName: "Emma",
          lastName: "Petit",
          email: "emma.petit@ecologyb.fr",
          phone: "06 67 89 01 23",
          role: "manager",
          status: "active",
          avatar_url: "https://randomuser.me/api/portraits/women/33.jpg",
          last_login: "2025-03-18T10:05:00Z",
          created_at: "2023-06-20T14:20:00Z",
          projects_count: 7,
          tasks_count: 9,
          department: "Études"
        },
        {
          id: "u007",
          firstName: "Antoine",
          lastName: "Moreau",
          email: "antoine.moreau@ecologyb.fr",
          phone: "06 78 90 12 34",
          role: "technician",
          status: "inactive",
          avatar_url: "https://randomuser.me/api/portraits/men/41.jpg",
          last_login: "2025-03-10T16:45:00Z",
          created_at: "2023-07-15T10:30:00Z",
          projects_count: 0,
          tasks_count: 0,
          department: "Technique"
        },
        {
          id: "u008",
          firstName: "Julie",
          lastName: "Dubois",
          email: "julie.dubois@ecologyb.fr",
          phone: "06 89 01 23 45",
          role: "regie",
          status: "pending",
          avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
          created_at: "2025-03-15T09:00:00Z",
          projects_count: 0,
          tasks_count: 0,
          department: "Commercial"
        }
      ];
      
      // Sample project data
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
          progress: 35,
          manager: "u002",
          manager_name: "Marie Lefevre",
          team_members: 4
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
          progress: 70,
          manager: "u006",
          manager_name: "Emma Petit",
          team_members: 3
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
          progress: 0,
          manager: "u002",
          manager_name: "Marie Lefevre",
          team_members: 2
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
          progress: 100,
          manager: "u006",
          manager_name: "Emma Petit",
          team_members: 5
        },
        {
          id: "p005",
          name: "Micro-hydraulique - Domaine Viticole",
          description: "Installation d'une micro-centrale hydraulique pour un domaine viticole",
          status: "En cours",
          client: "Domaine du Soleil",
          start_date: "2025-02-20T08:00:00Z",
          end_date: "2025-04-10T18:00:00Z",
          budget: 40000,
          type: "Hydraulique",
          location: "Gard",
          progress: 50,
          manager: "u002",
          manager_name: "Marie Lefevre",
          team_members: 3
        },
        {
          id: "p006",
          name: "Solaire Thermique - Centre Sportif",
          description: "Installation de panneaux solaires thermiques pour la production d'eau chaude",
          status: "En cours",
          client: "Ville de Nîmes",
          start_date: "2025-03-10T08:00:00Z",
          end_date: "2025-05-20T18:00:00Z",
          budget: 38000,
          type: "Solaire",
          location: "Nîmes",
          progress: 25,
          manager: "u006",
          manager_name: "Emma Petit",
          team_members: 4
        }
      ];
      
      // Sample events
      const sampleEvents: Event[] = [
        {
          id: "event001",
          title: "Réunion projet photovoltaïque - Mairie de Montpellier",
          description: "Discussion des spécifications techniques pour l'installation de panneaux solaires",
          start_time: "2025-03-20T10:00:00Z",
          end_time: "2025-03-20T11:30:00Z",
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
          start_time: "2025-03-20T14:00:00Z",
          end_time: "2025-03-20T16:00:00Z",
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
      
      // Sample tasks
      const sampleTasks: Task[] = [
        {
          id: "task001",
          title: "Finaliser le dossier de subvention",
          description: "Compléter tous les documents requis et vérifier les pièces justificatives",
          due_date: "2025-03-20T18:00:00Z",
          priority: "high",
          status: "in_progress",
          assignee: "u004",
          assignee_name: "Sophie Martin",
          assignee_avatar: "https://randomuser.me/api/portraits/women/22.jpg",
          created_at: "2025-03-10T11:30:00Z",
          updated_at: "2025-03-15T14:30:00Z",
          tags: ["subvention", "administratif", "deadline"]
        },
        {
          id: "task002",
          title: "Préparer présentation technique pour la réunion mairie",
          description: "Créer des slides détaillant les spécifications techniques des panneaux et le plan d'installation",
          due_date: "2025-03-20T09:00:00Z",
          priority: "high",
          status: "in_progress",
          assignee: "u003",
          assignee_name: "Pierre Laurent",
          assignee_avatar: "https://randomuser.me/api/portraits/men/62.jpg",
          related_event: "event001",
          created_at: "2025-03-14T09:30:00Z",
          updated_at: "2025-03-15T16:45:00Z",
          tags: ["présentation", "client", "technique"]
        },
        {
          id: "task003",
          title: "Commander le matériel pour l'installation des panneaux",
          description: "Passer commande des panneaux solaires et du matériel de fixation nécessaire",
          due_date: "2025-03-20T12:00:00Z",
          priority: "urgent",
          status: "not_started",
          assignee: "u003",
          assignee_name: "Pierre Laurent",
          assignee_avatar: "https://randomuser.me/api/portraits/men/62.jpg",
          created_at: "2025-03-15T11:20:00Z",
          updated_at: "2025-03-15T11:20:00Z",
          tags: ["commande", "matériel", "installation"]
        },
        {
          id: "task004",
          title: "Vérifier les devis des fournisseurs",
          description: "Comparer les différentes offres et sélectionner le meilleur rapport qualité-prix",
          due_date: "2025-03-20T15:00:00Z",
          priority: "medium",
          status: "not_started",
          assignee: "u004",
          assignee_name: "Sophie Martin",
          assignee_avatar: "https://randomuser.me/api/portraits/women/22.jpg",
          created_at: "2025-03-18T10:20:00Z",
          updated_at: "2025-03-18T10:20:00Z",
          tags: ["devis", "fournisseurs", "budget"]
        },
        {
          id: "task005",
          title: "Planifier les équipes d'installation",
          description: "Organiser les équipes et le planning pour l'installation des panneaux solaires",
          due_date: "2025-03-20T17:30:00Z",
          priority: "medium",
          status: "not_started",
          assignee: "u002",
          assignee_name: "Marie Lefevre",
          assignee_avatar: "https://randomuser.me/api/portraits/women/44.jpg",
          created_at: "2025-03-19T09:15:00Z",
          updated_at: "2025-03-19T09:15:00Z",
          tags: ["planification", "équipes", "installation"]
        }
      ];
      
      // Sample chats
      const sampleChats: Chat[] = [
        {
          id: "chat001",
          participants: [
            {
              id: "u001",
              name: "Thomas Dubois",
              avatar_url: "https://randomuser.me/api/portraits/men/32.jpg"
            },
            {
              id: "u004",
              name: "Sophie Martin",
              avatar_url: "https://randomuser.me/api/portraits/women/22.jpg"
            }
          ],
          last_message: {
            content: "Bonjour Thomas, pouvez-vous valider le dossier de subvention que je vous ai envoyé?",
            timestamp: "2025-03-20T08:45:00Z",
            sender_id: "u004"
          },
          unread_count: 2
        },
        {
          id: "chat002",
          participants: [
            {
              id: "u001",
              name: "Thomas Dubois",
              avatar_url: "https://randomuser.me/api/portraits/men/32.jpg"
            },
            {
              id: "u002",
              name: "Marie Lefevre",
              avatar_url: "https://randomuser.me/api/portraits/women/44.jpg"
            },
            {
              id: "u003",
              name: "Pierre Laurent",
              avatar_url: "https://randomuser.me/api/portraits/men/62.jpg"
            }
          ],
          last_message: {
            content: "La réunion avec la mairie est confirmée pour 10h demain",
            timestamp: "2025-03-19T16:20:00Z",
            sender_id: "u002"
          },
          unread_count: 0
        },
        {
          id: "chat003",
          participants: [
            {
              id: "u001",
              name: "Thomas Dubois",
              avatar_url: "https://randomuser.me/api/portraits/men/32.jpg"
            },
            {
              id: "u005",
              name: "Lucas Bernard",
              avatar_url: "https://randomuser.me/api/portraits/men/55.jpg"
            }
          ],
          last_message: {
            content: "J'ai un nouveau client intéressé par notre solution de panneaux solaires",
            timestamp: "2025-03-20T09:10:00Z",
            sender_id: "u005"
          },
          unread_count: 1
        }
      ];
      
      // Sample invoices
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
      
      // Sample notifications
      const sampleNotifications: NotificationItem[] = [
        {
          id: "notif001",
          title: "Nouvel utilisateur en attente",
          description: "Julie Dubois (julie.dubois@ecologyb.fr) attend la validation de son compte.",
          type: "info",
          date: "2025-03-15T09:10:00Z",
          read: false,
          link: "/admin/users",
          category: "user"
        },
        {
          id: "notif002",
          title: "Taux d'erreur système élevé",
          description: "Le taux d'erreur système a dépassé 1% pendant 15 minutes.",
          type: "warning",
          date: "2025-03-18T22:30:00Z",
          read: false,
          link: "/admin/system",
          category: "system"
        },
        {
          id: "notif003",
          title: "Tentative de connexion suspecte",
          description: "Plusieurs tentatives de connexion infructueuses depuis l'IP 45.128.67.89.",
          type: "error",
          date: "2025-03-19T02:40:00Z",
          read: false,
          link: "/admin/security",
          category: "security"
        },
        {
          id: "notif004",
          title: "Factures en attente",
          description: "2 factures attendent validation depuis plus de 3 jours.",
          type: "warning",
          date: "2025-03-17T14:20:00Z",
          read: true,
          link: "/admin/finance",
          category: "billing"
        }
      ];
      
      // Calculate admin statistics
      const sampleAdminStats: AdminStats = {
        // User statistics
        totalUsers: sampleUsers.length,
        activeUsers: sampleUsers.filter(u => u.status === "active").length,
        pendingUsers: sampleUsers.filter(u => u.status === "pending").length,
        usersByRole: [
          { name: "Admin", value: sampleUsers.filter(u => u.role === "admin").length, color: "#213f5b" },
          { name: "Manager", value: sampleUsers.filter(u => u.role === "manager").length, color: "#bfddf9" },
          { name: "Regie", value: sampleUsers.filter(u => u.role === "regie").length, color: "#d2fcb2" },
          { name: "Tech", value: sampleUsers.filter(u => u.role === "technician").length, color: "#dae8f3" },
          { name: "Sales", value: sampleUsers.filter(u => u.role === "sales").length, color: "#a6b9cb" }
        ],
        userActivity: [
          { date: "Lun", count: 32 },
          { date: "Mar", count: 40 },
          { date: "Mer", count: 28 },
          { date: "Jeu", count: 35 },
          { date: "Ven", count: 30 },
          { date: "Sam", count: 12 },
          { date: "Dim", count: 8 }
        ],
        newUsersThisWeek: 1,
        usersGrowth: 12.5,
        
        // Project statistics
        projectsCount: sampleProjects.length,
        projectsByType: [
          { name: "Solaire", value: sampleProjects.filter(p => p.type === "Solaire").length, color: "#d2fcb2" },
          { name: "Éolien", value: sampleProjects.filter(p => p.type === "Éolien").length, color: "#bfddf9" },
          { name: "Hydraulique", value: sampleProjects.filter(p => p.type === "Hydraulique").length, color: "#88c9f7" },
          { name: "Biomasse", value: sampleProjects.filter(p => p.type === "Biomasse").length, color: "#b8f996" },
          { name: "Autre", value: sampleProjects.filter(p => p.type === "Autre").length, color: "#213f5b" }
        ],
        projectsStatus: [
          { name: "En cours", value: sampleProjects.filter(p => p.status === "En cours").length, color: "#bfddf9" },
          { name: "Terminé", value: sampleProjects.filter(p => p.status === "Terminé").length, color: "#d2fcb2" },
          { name: "En attente", value: sampleProjects.filter(p => p.status === "En attente").length, color: "#f9e5bf" },
          { name: "Annulé", value: sampleProjects.filter(p => p.status === "Annulé").length, color: "#f9bfbf" }
        ],
        projectsGrowth: 8.5,
        
        // Financial statistics
        totalRevenue: sampleInvoices.reduce((sum, inv) => sum + (inv.statut === "Payée" ? inv.montant_ttc : 0), 0),
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
        revenueGrowth: 19.2,
        pendingInvoices: sampleInvoices.filter(inv => inv.statut === "Envoyée" || inv.statut === "En attente de validation").length,
        overdueTasks: sampleTasks.filter(t => 
          t.status !== "completed" && new Date(t.due_date) < new Date()
        ).length,
        
        // Security and system health
        securityIncidents: 2,
        
        // Team performance (regies)
        teamPerformance: [
          { 
            team: "Sophie Martin", 
            tasks_to_do: 15, 
            tasks_to_close: 8, 
            projects_in_progress: 5, 
            projects_closed: 3 
          },
          { 
            team: "Julie Dubois", 
            tasks_to_do: 12, 
            tasks_to_close: 6, 
            projects_in_progress: 4, 
            projects_closed: 2 
          },
          { 
            team: "Alexandre Petit", 
            tasks_to_do: 18, 
            tasks_to_close: 10, 
            projects_in_progress: 6, 
            projects_closed: 5 
          },
          { 
            team: "Camille Rousseau", 
            tasks_to_do: 14, 
            tasks_to_close: 7, 
            projects_in_progress: 3, 
            projects_closed: 4 
          }
        ],
        
        // User engagement
        monthlyActiveUsers: [
          { month: "Oct", value: 18 },
          { month: "Nov", value: 22 },
          { month: "Déc", value: 25 },
          { month: "Jan", value: 32 },
          { month: "Fév", value: 38 },
          { month: "Mar", value: 45 }
        ]
      };

      // Set the state with the sample data
      setUsers(sampleUsers);
      setProjects(sampleProjects);
      setTasks(sampleTasks);
      setEvents(sampleEvents);
      setInvoices(sampleInvoices);
      setChats(sampleChats);
      setNotifications(sampleNotifications);
      setStats(sampleAdminStats);
      setIsLoading(false);
    }, 1000);
  }, [adminInfo]);

  // Get today's events and tasks
  const todaysEvents = useMemo(() => {
    const today = new Date().toDateString();
    return events.filter(event => {
      const eventDate = new Date(event.start_time).toDateString();
      return eventDate === today;
    });
  }, [events]);

  const todaysTasks = useMemo(() => {
    const today = new Date().toDateString();
    return tasks.filter(task => {
      const taskDate = new Date(task.due_date).toDateString();
      return taskDate === today;
    });
  }, [tasks]);

  // Get critical notifications
  // const criticalNotifications = useMemo(() => {
  //   return notifications.filter(n => !n.read && (n.type === "error" || n.type === "warning"));
  // }, [notifications]);

  // Get the welcome message based on time of day
  const welcomeMessage = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  }, []);

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
          icon: <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
        };
      default:
        return { 
          color: "bg-gray-100 text-gray-800",
          icon: <BellAlertIcon className="h-5 w-5 text-gray-500" />
        };
    }
  };

  // Get status color
  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "active":
  //     case "success":
  //     case "healthy":
  //     case "completed":
  //     case "Terminé":
  //     case "Payée":
  //       return "bg-[#d2fcb2] text-[#213f5b]";
  //     case "inactive":
  //     case "En attente":
  //     case "pending":
  //     case "not_started":
  //     case "Brouillon":
  //       return "bg-[#bfddf9]/40 text-[#213f5b]";
  //     case "cancelled":
  //     case "blocked":
  //     case "failure":
  //     case "critical":
  //     case "Annulé":
  //       return "bg-red-100 text-red-800";
  //     case "in_progress":
  //     case "warning":
  //     case "En cours":
  //     case "Envoyée":
  //     case "scheduled":
  //       return "bg-[#bfddf9] text-[#213f5b]";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-[#bfddf9]/30 text-[#213f5b]";
      case "medium":
        return "bg-[#bfddf9] text-[#213f5b]";
      case "high":
        return "bg-[#d2fcb2] text-[#213f5b]";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format month name for calendar
  // const formatMonth = (date: Date): string => {
  //   return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date);
  // };

  // Generate calendar days
  // const generateCalendarDays = () => {
  //   const year = currentMonth.getFullYear();
  //   const month = currentMonth.getMonth();
    
  //   // First day of the month
  //   const firstDay = new Date(year, month, 1);
  //   // Last day of the month
  //   const lastDay = new Date(year, month + 1, 0);
    
  //   // Day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  //   let firstDayOfWeek = firstDay.getDay();
  //   // Convert to Monday as first day of week
  //   firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
  //   const daysInMonth = lastDay.getDate();
  //   const days = [];
    
  //   // Add empty cells for days before the first day of the month
  //   for (let i = 0; i < firstDayOfWeek; i++) {
  //     days.push({ date: null, isCurrentMonth: false });
  //   }
    
  //   // Add cells for each day of the month
  //   const today = new Date();
  //   for (let i = 1; i <= daysInMonth; i++) {
  //     const date = new Date(year, month, i);
  //     days.push({
  //       date,
  //       isCurrentMonth: true,
  //       isToday: date.getDate() === today.getDate() && 
  //                date.getMonth() === today.getMonth() && 
  //                date.getFullYear() === today.getFullYear(),
  //       events: events.filter(event => {
  //         const eventDate = new Date(event.start_time);
  //         return eventDate.getDate() === date.getDate() && 
  //                eventDate.getMonth() === date.getMonth() && 
  //                eventDate.getFullYear() === date.getFullYear();
  //       })
  //     });
  //   }
    
  //   return days;
  // };

  // Change month
  const changeMonth = (increment: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main
          className="flex-1 overflow-y-auto"
          style={{
            background: "linear-gradient(135deg, rgba(191,221,249,0.1) 0%, rgba(210,252,178,0.05) 100%)",
          }}
        >
          <div className="w-full mx-auto p-4 sm:p-6 lg:p-8">
            {/* Welcome Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl font-bold text-[#213f5b]">
                  {welcomeMessage}, {adminInfo?.email.split('@')[0] || "Admin"}
                </h1>
                <p className="text-[#213f5b]/70">
                  Tableau de bord d&apos;administration des projets d&apos;énergies renouvelables
                </p>
              </motion.div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-white border border-[#bfddf9] rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-all relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <BellAlertIcon className="h-5 w-5 text-[#213f5b]" />
                  <span className="hidden sm:inline text-[#213f5b]">Notifications</span>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#213f5b] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      className="absolute top-24 right-8 bg-white rounded-xl shadow-xl z-50 w-full max-w-md border border-[#bfddf9]"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="p-4 border-b border-[#bfddf9]/30">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-[#213f5b]">Notifications</h3>
                          <button 
                            className="text-[#213f5b]/70 hover:text-[#213f5b]"
                            onClick={() => setShowNotifications(false)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto p-2">
                        {notifications.length === 0 ? (
                          <div className="text-center py-6 text-[#213f5b]/50">
                            Aucune notification
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {notifications.map(notification => {
                              const { icon } = getNotificationInfo(notification.type);
                              return (
                                <div 
                                  key={notification.id}
                                  className={`p-3 rounded-lg border border-[#bfddf9]/30 ${notification.read ? 'bg-white' : 'bg-[#bfddf9]/10'} hover:bg-[#bfddf9]/5 transition-colors`}
                                >
                                  <div className="flex gap-3">
                                    <div className={`p-2 rounded-full bg-[#bfddf9]/40 flex-shrink-0`}>
                                      {icon}
                                    </div>
                                    <div className="flex-grow">
                                      <h4 className="font-medium text-[#213f5b]">{notification.title}</h4>
                                      <p className="text-sm text-[#213f5b]/70 mt-1">{notification.description}</p>
                                      <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-[#213f5b]/50">{formatDate(notification.date)} - {formatTime(notification.date)}</span>
                                        {notification.link && (
                                          <Link 
                                            href={notification.link}
                                            className="text-sm text-[#213f5b] hover:text-[#213f5b]/80 flex items-center gap-1"
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
                      <div className="p-3 border-t border-[#bfddf9]/30 text-center">
                        <button className="text-sm text-[#213f5b] hover:text-[#213f5b]/80">
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
                  <CogIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Paramètres</span>
                </motion.button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <ArrowPathIcon className="h-10 w-10 text-[#213f5b] animate-spin mx-auto mb-4" />
                  <p className="text-[#213f5b]/70">Chargement du tableau de bord d&apos;administration...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Improved KPI Stats Cards */}
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Total Revenue KPI */}
                  <motion.div 
                    className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-blue-50/50 to-blue-100/20 border border-blue-100"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-[#213f5b]/90">Chiffre d&apos;affaires total</p>
                        <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{formatCurrency(1250000)}</h3>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-xs flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium bg-green-100 text-[#213f5b]">
                            <ArrowTrendingUpIcon className="h-3 w-3" />
                            42%
                          </span>
                          <span className="text-xs text-[#213f5b]/70">vs année précédente</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-full bg-white/60 shadow-sm">
                        <BanknotesIcon className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                    <div className="mt-4 relative h-1.5 bg-blue-100 rounded-full overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <div className="flex justify-between items-center mt-1 text-xs text-[#213f5b]/70">
                      <span>Objectif annuel</span>
                      <span className="font-medium">65%</span>
                    </div>
                  </motion.div>

                  {/* Clients KPI */}
                  <motion.div 
                    className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-purple-50/50 to-purple-100/20 border border-purple-100"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-[#213f5b]/90">Clients</p>
                        <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{projects.filter(p => p.status === "En cours").length + 42}</h3>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-xs flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium bg-purple-100 text-[#213f5b]">
                            <ArrowTrendingUpIcon className="h-3 w-3" />
                            12%
                          </span>
                          <span className="text-xs text-[#213f5b]/70">vs mois précédent</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-full bg-white/60 shadow-sm">
                        <UsersIcon className="h-5 w-5 text-purple-500" />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-sm">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded-full bg-green-400"></span>
                          <span className="text-xs text-[#213f5b]/80">En cours: 24</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded-full bg-purple-400"></span>
                          <span className="text-xs text-[#213f5b]/80">En instruction: 18</span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded-full bg-blue-400"></span>
                          <span className="text-xs text-[#213f5b]/80">En installation: 12</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded-full bg-[#213f5b]"></span>
                          <span className="text-xs text-[#213f5b]/80">Installé cloturé: 35</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Paiement en attente KPI */}
                  <motion.div 
                    className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-amber-50/50 to-amber-100/20 border border-amber-100"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-[#213f5b]/90">Paiement en attente</p>
                        <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{formatCurrency(185000)}</h3>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-xs flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium bg-amber-100 text-[#213f5b]">
                            <ArrowTrendingUpIcon className="h-3 w-3" />
                            8%
                          </span>
                          <span className="text-xs text-[#213f5b]/70">vs trimestre précédent</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-full bg-white/60 shadow-sm">
                        <BanknotesIcon className="h-5 w-5 text-amber-500" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#213f5b]/80">Délai moyen de paiement</span>
                        <span className="text-xs font-medium text-[#213f5b]">28 jours</span>
                      </div>
                      <div className="h-1.5 w-full bg-amber-100/50 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Factures à payer KPI */}
                  <motion.div 
                    className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-indigo-50/50 to-indigo-100/20 border border-indigo-100"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-[#213f5b]/90">Factures à payer</p>
                        <h3 className="text-2xl font-bold text-[#213f5b] mt-1">16</h3>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-xs flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium bg-indigo-100 text-[#213f5b]">
                            <ArrowTrendingDownIcon className="h-3 w-3" />
                            5%
                          </span>
                          <span className="text-xs text-[#213f5b]/70">vs mois précédent</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-full bg-white/60 shadow-sm">
                        <DocumentTextIcon className="h-5 w-5 text-indigo-500" />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between text-xs">
                      <div className="flex flex-col items-center">
                        <span className="text-[#213f5b]/80">Récentes</span>
                        <span className="font-medium text-[#213f5b]">8</span>
                        <div className="h-1.5 w-8 bg-green-400 rounded-full mt-1"></div>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[#213f5b]/80">En attente</span>
                        <span className="font-medium text-[#213f5b]">5</span>
                        <div className="h-1.5 w-8 bg-blue-400 rounded-full mt-1"></div>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[#213f5b]/80">Tardives</span>
                        <span className="font-medium text-[#213f5b]">3</span>
                        <div className="h-1.5 w-8 bg-amber-400 rounded-full mt-1"></div>
                      </div>
                    </div>
                  </motion.div>

                  {/* SAV Support KPI */}
                  <motion.div 
                    className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-green-50/50 to-green-100/20 border border-green-100"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <Link href="/dashboard/admin/support">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-[#213f5b]/90">SAV</p>
                          <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{savStats.openTickets}</h3>
                          <div className="flex items-center gap-1 mt-2">
                            <span className={`text-xs flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium ${
                              savStats.ticketsTrend < 0 ? 'bg-green-100 text-[#213f5b]' : 'bg-amber-100 text-[#213f5b]'
                            }`}>
                              {savStats.ticketsTrend < 0 ? (
                                <ArrowTrendingDownIcon className="h-3 w-3" />
                              ) : (
                                <ArrowTrendingUpIcon className="h-3 w-3" />
                              )}
                              {Math.abs(savStats.ticketsTrend)}%
                            </span>
                            <span className="text-xs text-[#213f5b]/70">vs mois précédent</span>
                          </div>
                        </div>
                        <div className="p-2 rounded-full bg-white/60 shadow-sm">
                          <WrenchScrewdriverIcon className="h-5 w-5 text-green-500" />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center text-sm">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded-full bg-blue-400"></span>
                            <span className="text-xs text-[#213f5b]/80">Tickets Ouverts: {savStats.openTickets}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded-full bg-amber-400"></span>
                            <span className="text-xs text-[#213f5b]/80">Tickets en attente: {savStats.pendingTickets}</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded-full bg-green-400"></span>
                            <span className="text-xs text-[#213f5b]/80">Tickets Clôturés: {savStats.solvedTickets}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded-full bg-[#213f5b]"></span>
                            <span className="text-xs text-[#213f5b]/80">Taux de Résolution: {((savStats.solvedTickets / savStats.totalTickets) * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Top Revenue Chart - Streamlined Premium Version */}
                <motion.div 
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#bfddf9]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ boxShadow: "0 15px 25px -5px rgba(33, 63, 91, 0.08)" }}
                >
                  {/* Header with business color gradient */}
                  <div className="p-5 bg-gradient-to-r from-[#213f5b] to-[#213f5b]/90 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white/15 backdrop-blur-sm rounded-lg">
                        <BanknotesIcon className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="text-lg font-bold text-white">Analyse Financière</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                        <span className="text-[#d2fcb2] font-medium text-sm">+35.8%</span>
                        <span className="text-[#bfddf9] text-xs">vs 2024</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Main content area */}
                  <div className="p-5">
                    {/* Main KPI cards */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {/* Total Revenue */}
                      <motion.div 
                        className="rounded-lg bg-gradient-to-br from-white via-[#bfddf9]/20 to-[#bfddf9]/10 p-4 border border-[#bfddf9]"
                        whileHover={{ y: -3 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs text-[#213f5b]/70 font-medium mb-1">Total des revenus</span>
                          <span className="text-2xl font-bold text-[#213f5b]">{formatCurrency(1250000)}</span>
                          <div className="mt-2 flex items-center gap-1">
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#d2fcb2] text-[#213f5b] font-medium">+42%</span>
                            <span className="text-xs text-[#213f5b]/70">vs 2024</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Monthly Average */}
                      <motion.div 
                        className="rounded-lg bg-gradient-to-br from-white via-[#d2fcb2]/20 to-[#d2fcb2]/10 p-4 border border-[#d2fcb2]"
                        whileHover={{ y: -3 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs text-[#213f5b]/70 font-medium mb-1">Moyenne mensuelle</span>
                          <span className="text-2xl font-bold text-[#213f5b]">{formatCurrency(104000)}</span>
                          <div className="mt-2 flex items-center gap-1">
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#213f5b]/10 text-[#213f5b] font-medium">Mars: {formatCurrency(125000)}</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Annual Forecast */}
                      <motion.div 
                        className="rounded-lg bg-gradient-to-br from-white via-[#213f5b]/5 to-[#213f5b]/10 p-4 border border-[#213f5b]/20"
                        whileHover={{ y: -3 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs text-[#213f5b]/70 font-medium mb-1">Prévision annuelle</span>
                          <span className="text-2xl font-bold text-[#213f5b]">{formatCurrency(2800000)}</span>
                          <div className="mt-2 flex items-center gap-1">
                            <div className="w-full bg-[#bfddf9]/30 rounded-full h-1.5">
                              <div className="h-full bg-[#213f5b] rounded-full" style={{width: '45%'}}></div>
                            </div>
                            <span className="text-xs text-[#213f5b]/70 font-medium">45%</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Revenue Chart - Simplified */}
                    <div className="bg-white rounded-lg border border-[#bfddf9]/70 p-4 mb-2">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[#213f5b] text-sm font-medium">Évolution des revenus 2025</h3>
                        <div className="flex items-center space-x-2">
                          <div className="flex rounded-lg overflow-hidden border border-[#bfddf9]/70 text-xs">
                            <button className="px-2 py-1 font-medium bg-[#213f5b] text-white">Mensuel</button>
                            <button className="px-2 py-1 font-medium bg-white text-[#213f5b]">Annuel</button>
                          </div>
                        </div>
                      </div>

                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={[
                              { month: "Jan", value: 92000, target: 85000 },
                              { month: "Fév", value: 98000, target: 90000 },
                              { month: "Mar", value: 125000, target: 95000 },
                              { month: "Avr", value: 138000, target: 100000 },
                              { month: "Mai", value: 145000, target: 110000 },
                              { month: "Juin", value: 175000, target: 120000 },
                              { month: "Juil", value: 195000, target: 130000 },
                              { month: "Aoû", value: 210000, target: 140000 },
                              { month: "Sep", value: 240000, target: 150000 },
                              { month: "Oct", value: 235000, target: 160000 },
                              { month: "Nov", value: 220000, target: 170000 },
                              { month: "Déc", value: 180000, target: 175000 }
                            ]}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#213f5b" stopOpacity={0.7}/>
                                <stop offset="95%" stopColor="#213f5b" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis 
                              dataKey="month" 
                              axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }} 
                              tickLine={false}
                              tick={{ fill: '#213f5b', fontSize: 10 }}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#213f5b', fontSize: 10 }}
                              tickFormatter={(value) => `${value/1000}k`}
                              width={30}
                            />
                            <Tooltip 
                              formatter={(value) => [`${formatCurrency(Number(value))}`, "Revenu"]}
                              contentStyle={{ 
                                borderRadius: "0.5rem", 
                                border: "1px solid #bfddf9",
                                boxShadow: "0 4px 6px -1px rgba(33, 63, 91, 0.1)",
                                padding: "8px 10px",
                              }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#213f5b" 
                              strokeWidth={2}
                              fillOpacity={1} 
                              fill="url(#colorRevenue)" 
                              animationDuration={1500}
                              activeDot={{ 
                                r: 5, 
                                fill: "#213f5b", 
                                stroke: "#FFFFFF", 
                                strokeWidth: 2,
                              }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="target" 
                              stroke="#bfddf9" 
                              strokeWidth={1.5}
                              strokeDasharray="3 3"
                              fillOpacity={0} 
                              animationDuration={1500}
                              dot={false}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="flex justify-center gap-6 mt-2">
                        <div className="flex items-center gap-1.5">
                          <div className="h-2.5 w-2.5 rounded-sm bg-[#213f5b]"></div>
                          <span className="text-xs text-[#213f5b]/70">Revenu actuel</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-2.5 w-2.5 rounded-sm border border-[#bfddf9]"></div>
                          <span className="text-xs text-[#213f5b]/70">Objectif</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Simple footer */}
                  <div className="px-5 py-3 border-t border-[#bfddf9]/30 flex justify-between items-center bg-gradient-to-r from-white to-[#bfddf9]/10">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-[#213f5b]/70" />
                      <span className="text-xs text-[#213f5b]/70">Mise à jour: <span className="font-medium">20 Mars 2025</span></span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 bg-white border border-[#bfddf9] rounded text-xs text-[#213f5b] hover:bg-[#bfddf9]/10 flex items-center gap-1.5">
                        <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                        Exporter
                      </button>
                      <Link 
                        href="/admin/finance/details" 
                        className="px-3 py-1.5 bg-[#213f5b] rounded text-xs text-white hover:bg-[#213f5b]/90 flex items-center gap-1.5"
                      >
                        Plus de détails
                        <ChevronRightIcon className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>

                {/* Stats Cards with consistent sizing */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {/* Utilisateurs Card - with navigation to /dashboard/admin/administration */}
                  <Link href="/dashboard/admin/administration">
                    <motion.div 
                      className="bg-white rounded-xl shadow-sm p-5 border border-[#bfddf9] hover:shadow-md transition-all cursor-pointer h-full"
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-[#213f5b]/80">Utilisateurs</p>
                          <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{stats.totalUsers}</h3>
                          <div className="flex items-center gap-1 mt-2">
                            <span className={`text-xs flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium ${stats.usersGrowth >= 0 ? 'bg-[#d2fcb2] text-[#213f5b]' : 'bg-red-100 text-red-800'}`}>
                              {stats.usersGrowth >= 0 ? <ArrowTrendingUpIcon className="h-3 w-3" /> : <ArrowTrendingDownIcon className="h-3 w-3" />}
                              {Math.abs(stats.usersGrowth)}%
                            </span>
                            <span className="text-xs text-[#213f5b]/60">vs mois précédent</span>
                          </div>
                        </div>
                        <div className="p-3 rounded-full bg-[#bfddf9]/30">
                          <UserGroupIcon className="h-6 w-6 text-[#213f5b]" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded-full bg-[#d2fcb2]"></span>
                          <span className="text-[#213f5b]/70">Actifs: {stats.activeUsers}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded-full bg-[#bfddf9]"></span>
                          <span className="text-[#213f5b]/70">En attente: {stats.pendingUsers}</span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>

                  {/* Prospects Card - Converted to percentage completion */}
                  <Link href="/dashboard/admin/leads">
                    <motion.div 
                      className="bg-white rounded-xl shadow-sm p-5 border border-[#bfddf9] hover:shadow-md transition-all cursor-pointer h-full"
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-[#213f5b]/80">Prospects</p>
                          <h3 className="text-2xl font-bold text-[#213f5b] mt-1">42</h3>
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-xs flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium bg-[#d2fcb2] text-[#213f5b]">
                              <ArrowTrendingUpIcon className="h-3 w-3" />
                              15%
                            </span>
                            <span className="text-xs text-[#213f5b]/60">vs mois précédent</span>
                          </div>
                        </div>
                        <div className="p-3 rounded-full bg-[#bfddf9]/30">
                          <UsersIcon className="h-6 w-6 text-[#213f5b]" />
                        </div>
                      </div>
                      
                      {/* Percentage visualization of client progress */}
                      <div className="mt-3 mb-1">
                        <div className="flex">
                          <div className="h-2 flex-1 rounded-l-full bg-[#dde8f3]" title="0-15%"></div>
                          <div className="h-2 flex-1 bg-[#bfddf9]" title="15-30%"></div>
                          <div className="h-2 flex-1 bg-[#88c9f7]" title="30-45%"></div>
                          <div className="h-2 flex-1 bg-[#b8f996]" title="45-60%"></div>
                          <div className="h-2 flex-1 bg-[#d2fcb2]" title="60-75%"></div>
                          <div className="h-2 flex-1 bg-[#8fc97c]" title="75-90%"></div>
                          <div className="h-2 flex-1 rounded-r-full bg-[#213f5b]" title="90-100%"></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-[#dde8f3]"></div>
                            <span className="ml-1 text-[#213f5b]/70">6 clients à 14%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-[#bfddf9]"></div>
                            <span className="ml-1 text-[#213f5b]/70">4 clients à 28%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-[#88c9f7]"></div>
                            <span className="ml-1 text-[#213f5b]/70">8 clients à 43%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-[#b8f996]"></div>
                            <span className="ml-1 text-[#213f5b]/70">5 clients à 57%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-[#d2fcb2]"></div>
                            <span className="ml-1 text-[#213f5b]/70">9 clients à 71%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-[#8fc97c]"></div>
                            <span className="ml-1 text-[#213f5b]/70">3 clients à 86%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between col-span-2 mt-0.5">
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-[#213f5b]"></div>
                            <span className="ml-1 text-[#213f5b]/70">7 clients à 100%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>

                  {/* Tasks Card - with navigation to /dashboard/admin/tasks */}
                  <Link href="/dashboard/admin/tasks">
                    <motion.div 
                      className="bg-white rounded-xl shadow-sm p-5 border border-[#bfddf9] hover:shadow-md transition-all cursor-pointer h-full"
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-[#213f5b]/80">Tâches aujourd&apos;hui</p>
                          <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{todaysTasks.length}</h3>
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-xs flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium bg-[#bfddf9] text-[#213f5b]">
                              <ClockIcon className="h-3 w-3" />
                              {new Date().toLocaleDateString('fr-FR', { weekday: 'long' })}
                            </span>
                            <span className="text-xs text-[#213f5b]/60">20 Mars 2025</span>
                          </div>
                        </div>
                        <div className="p-3 rounded-full bg-[#d2fcb2]/40">
                          <CalendarIcon className="h-6 w-6 text-[#213f5b]" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded-full bg-[#bfddf9]"></span>
                          <span className="text-sm text-[#213f5b]/70">En attente: {todaysTasks.filter(t => t.status === "not_started").length}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded-full bg-[#213f5b]"></span>
                          <span className="text-sm text-[#213f5b]/70">En cours: {todaysTasks.filter(t => t.status === "in_progress").length}</span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>

                  {/* Messages Card - with navigation to /dashboard/admin/emails */}
                  <Link href="/dashboard/admin/emails">
                    <motion.div 
                      className="bg-white rounded-xl shadow-sm p-5 border border-[#bfddf9] hover:shadow-md transition-all cursor-pointer h-full"
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-[#213f5b]/80">Messages</p>
                          <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{chats.reduce((sum, chat) => sum + chat.unread_count, 0)}</h3>
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-xs rounded-full px-1.5 py-0.5 font-medium bg-[#d2fcb2] text-[#213f5b]">
                              Non lus
                            </span>
                            <span className="text-xs text-[#213f5b]/60">sur {chats.length} conversations</span>
                          </div>
                        </div>
                        <div className="p-3 rounded-full bg-[#d2fcb2]/40">
                          <ChatBubbleOvalLeftIcon className="h-6 w-6 text-[#213f5b]" />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center">
                        <div className="text-sm text-[#213f5b] hover:text-[#213f5b]/80 flex items-center gap-1">
                          Voir tous les messages
                          <ArrowRightIcon className="h-4 w-4" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* First Row - Full Width Components in 2-column arrangement */}
                  <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Enhanced Calendar with Week View */}
                    <motion.div 
                      className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bfddf9] h-full flex flex-col"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      whileHover={{ boxShadow: "0 10px 25px -5px rgba(33, 63, 91, 0.1)" }}
                    >
                      <div className="p-4 border-b border-[#bfddf9]/30 bg-gradient-to-r from-[#bfddf9]/30 to-[#bfddf9]/10">
                        <div className="flex justify-between items-center">
                          <h2 className="font-semibold text-[#213f5b] flex items-center gap-2">
                            <CalendarDaysIcon className="h-5 w-5 text-[#213f5b]" />
                            <span>Agenda de la semaine</span>
                          </h2>
                          <div className="flex items-center gap-2">
                            <button 
                              className="p-1.5 rounded-lg text-[#213f5b]/70 hover:text-[#213f5b] hover:bg-[#bfddf9]/20 transition-colors"
                              onClick={() => changeMonth(-1)}
                            >
                              <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            <span className="text-sm font-medium text-[#213f5b] min-w-[150px] text-center">
                              20 - 26 Mars 2025
                            </span>
                            <button 
                              className="p-1.5 rounded-lg text-[#213f5b]/70 hover:text-[#213f5b] hover:bg-[#bfddf9]/20 transition-colors"
                              onClick={() => changeMonth(1)}
                            >
                              <ChevronRightIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-[#213f5b]/70 text-xs">
                            <span className="font-medium">{todaysEvents.length}</span> événements cette semaine
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 bg-[#d2fcb2]/50 text-[#213f5b] text-xs py-1 px-2 rounded-full">
                              <ClockIcon className="h-3 w-3" />
                              <span className="font-medium">Aujourd&apos;hui</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Week View Calendar */}
                      <div className="flex-grow overflow-y-auto p-1">
                        <div className="grid grid-cols-7 border-b border-[#bfddf9]/20 sticky top-0 bg-white z-10">
                          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => {
                            const currentDay = new Date();
                            currentDay.setDate(currentDay.getDate() - currentDay.getDay() + 1 + index);
                            const isToday = currentDay.getDate() === new Date().getDate() && 
                                            currentDay.getMonth() === new Date().getMonth() && 
                                            currentDay.getFullYear() === new Date().getFullYear();
                            
                            return (
                              <div key={day} className="px-1 py-3">
                                <div className={`flex flex-col items-center ${isToday ? 'text-[#213f5b]' : 'text-[#213f5b]/70'}`}>
                                  <span className="text-xs font-medium">{day}</span>
                                  <span className={`text-sm font-bold mt-1 h-7 w-7 flex items-center justify-center rounded-full ${
                                    isToday ? 'bg-[#bfddf9] text-[#213f5b]' : ''
                                  }`}>
                                    {currentDay.getDate()}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Time slots */}
                        <div className="mt-2 space-y-3 px-1">
                          {/* Morning Time Slots */}
                          <div className="flex items-center mb-2">
                            <div className="w-20 flex-shrink-0">
                              <div className="text-xs font-medium text-[#213f5b]/70 ml-2">Matin</div>
                            </div>
                            <div className="h-px flex-grow bg-[#bfddf9]/20"></div>
                          </div>
                          
                          {['08:00', '09:00', '10:00', '11:00'].map((time) => (
                            <div key={time} className="flex group">
                              <div className="w-16 flex-shrink-0">
                                <div className="text-xs text-[#213f5b]/60 text-right pr-2">{time}</div>
                              </div>
                              <div className="flex-grow grid grid-cols-7 gap-1 relative">
                                {Array(7).fill(0).map((_, idx) => (
                                  <div 
                                    key={idx} 
                                    className="h-12 rounded border border-dashed border-[#bfddf9]/20 hover:bg-[#bfddf9]/5 group-hover:border-[#bfddf9]/40 transition-all cursor-pointer"
                                  ></div>
                                ))}
                                
                                {/* Example Events */}
                                {time === '10:00' && (
                                  <div className="absolute left-[calc(0/7*100%)] top-0 w-[calc(100%/7)] h-full">
                                    <div className="mx-0.5 h-full">
                                      <div className="bg-[#d2fcb2]/70 border border-[#d2fcb2] rounded p-1 h-full flex flex-col shadow-sm hover:shadow transition-shadow">
                                        <div className="flex items-center gap-1">
                                          <UsersIcon className="h-3 w-3 text-[#213f5b]/70" />
                                          <span className="text-xs font-medium text-[#213f5b] truncate">Réunion Mairie</span>
                                        </div>
                                        <span className="text-[10px] text-[#213f5b]/70">10:00 - 11:30</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {time === '08:00' && (
                                  <div className="absolute left-[calc(2/7*100%)] top-0 w-[calc(100%/7)] h-[calc(100%*2)]">
                                    <div className="mx-0.5 h-full">
                                      <div className="bg-[#bfddf9]/70 border border-[#bfddf9] rounded p-1 h-full flex flex-col shadow-sm hover:shadow transition-shadow">
                                        <div className="flex items-center gap-1">
                                          <BriefcaseIcon className="h-3 w-3 text-[#213f5b]/70" />
                                          <span className="text-xs font-medium text-[#213f5b] truncate">Préparation dossier</span>
                                        </div>
                                        <span className="text-[10px] text-[#213f5b]/70">08:00 - 10:00</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          
                          {/* Afternoon Time Slots */}
                          <div className="flex items-center mb-2 mt-4">
                            <div className="w-20 flex-shrink-0">
                              <div className="text-xs font-medium text-[#213f5b]/70 ml-2">Après-midi</div>
                            </div>
                            <div className="h-px flex-grow bg-[#bfddf9]/20"></div>
                          </div>
                          
                          {['14:00', '15:00', '16:00', '17:00'].map((time) => (
                            <div key={time} className="flex group">
                              <div className="w-16 flex-shrink-0">
                                <div className="text-xs text-[#213f5b]/60 text-right pr-2">{time}</div>
                              </div>
                              <div className="flex-grow grid grid-cols-7 gap-1 relative">
                                {Array(7).fill(0).map((_, idx) => (
                                  <div 
                                    key={idx} 
                                    className="h-12 rounded border border-dashed border-[#bfddf9]/20 hover:bg-[#bfddf9]/5 group-hover:border-[#bfddf9]/40 transition-all cursor-pointer"
                                  ></div>
                                ))}
                                
                                {/* Example Event */}
                                {time === '14:00' && (
                                  <div className="absolute left-[calc(3/7*100%)] top-0 w-[calc(100%/7)] h-[calc(100%*2)]">
                                    <div className="mx-0.5 h-full">
                                      <div className="bg-[#f9e5bf]/70 border border-[#f9e5bf] rounded p-1 h-full flex flex-col shadow-sm hover:shadow transition-shadow">
                                        <div className="flex items-center gap-1">
                                          <BriefcaseIcon className="h-3 w-3 text-[#213f5b]/70" />
                                          <span className="text-xs font-medium text-[#213f5b] truncate">Visite technique</span>
                                        </div>
                                        <span className="text-[10px] text-[#213f5b]/70">14:00 - 16:00</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-3 border-t border-[#bfddf9]/30 bg-[#bfddf9]/5 flex justify-between items-center">
                        <Link 
                          href="/dashboard/admin/calendar" 
                          className="text-xs text-[#213f5b] hover:text-[#213f5b]/80 flex items-center gap-1"
                        >
                          Voir tout le calendrier
                          <ArrowRightIcon className="h-3 w-3" />
                        </Link>
                        <button
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#213f5b] bg-white hover:bg-[#bfddf9]/20 px-2.5 py-1 rounded-md border border-[#bfddf9]/30 transition-colors"
                        >
                          <PlusCircleIcon className="h-3.5 w-3.5" />
                          Ajouter un événement
                        </button>
                      </div>
                    </motion.div>

                    {/* Right - Today's Tasks */}
                    <motion.div 
                      className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bfddf9] h-full flex flex-col"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      whileHover={{ boxShadow: "0 10px 25px -5px rgba(33, 63, 91, 0.1)" }}
                    >
                      <div className="p-4 border-b border-[#bfddf9]/30 flex justify-between items-center bg-gradient-to-r from-[#d2fcb2]/30 to-[#d2fcb2]/10">
                        <h2 className="font-semibold text-[#213f5b] flex items-center gap-2">
                          <ClockIcon className="h-5 w-5 text-[#213f5b]" />
                          <span>Tâches d&apos;aujourd&apos;hui</span>
                        </h2>
                        <span className="bg-[#d2fcb2] text-[#213f5b] text-xs font-medium px-2 py-1 rounded-full">
                          {todaysTasks.length} tâches
                        </span>
                      </div>
                      
                      <div className="divide-y divide-[#bfddf9]/30 flex-grow overflow-y-auto max-h-[500px] p-1">
                        {todaysTasks.length === 0 ? (
                          <div className="p-4 text-center text-sm text-[#213f5b]/50">
                            Aucune tâche aujourd&apos;hui
                          </div>
                        ) : (
                          todaysTasks.map((task) => (
                            <div key={task.id} className="p-3 hover:bg-[#bfddf9]/5 transition-colors rounded-lg">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  {task.status === "completed" ? (
                                    <div className="w-5 h-5 rounded-full bg-[#d2fcb2] flex items-center justify-center">
                                      <CheckIcon className="h-3 w-3 text-[#213f5b]" />
                                    </div>
                                  ) : (
                                    <div className={`w-5 h-5 rounded-full border-2 ${
                                      task.priority === 'urgent' 
                                        ? 'border-red-400' 
                                        : task.priority === 'high'
                                          ? 'border-[#d2fcb2]'
                                          : 'border-[#bfddf9]'
                                    }`}></div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <p className={`text-sm font-medium ${
                                      task.status === "completed" 
                                        ? 'text-[#213f5b]/50 line-through' 
                                        : 'text-[#213f5b]'
                                    }`}>{task.title}</p>
                                    <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                                      {task.priority}
                                    </span>
                                  </div>
                                  {task.description && (
                                    <p className="mt-1 text-xs text-[#213f5b]/70">{truncateText(task.description, 60)}</p>
                                  )}
                                  <div className="mt-2 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      {task.assignee_avatar ? (
                                        <img 
                                          src={task.assignee_avatar} 
                                          alt={task.assignee_name} 
                                          className="h-5 w-5 rounded-full"
                                        />
                                      ) : (
                                        <div className="h-5 w-5 rounded-full bg-[#bfddf9]/30 flex items-center justify-center text-xs text-[#213f5b]">
                                          {task.assignee_name?.charAt(0) || '?'}
                                        </div>
                                      )}
                                      <span className="text-xs text-[#213f5b]/70">{task.assignee_name}</span>
                                    </div>
                                    <span className="text-xs font-medium text-[#213f5b]/70">
                                      {formatTime(task.due_date)}
                                    </span>
                                  </div>
                                  {task.tags && task.tags.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                      {task.tags.map((tag, tagIdx) => (
                                        <span 
                                          key={tagIdx}
                                          className="px-1.5 py-0.5 text-xs font-medium rounded bg-[#bfddf9]/30 text-[#213f5b]"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      
                      <div className="p-3 border-t border-[#bfddf9]/30 bg-[#bfddf9]/5 flex justify-between items-center mt-auto">
                        <Link 
                          href="/admin/tasks" 
                          className="text-xs text-[#213f5b] hover:text-[#213f5b]/80 flex items-center gap-1"
                        >
                          Voir toutes les tâches
                          <ArrowRightIcon className="h-3 w-3" />
                        </Link>
                        <button
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#213f5b] hover:text-[#213f5b]/80"
                        >
                          <PlusCircleIcon className="h-3.5 w-3.5" />
                          Ajouter
                        </button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Second Row - 3-column layout for remaining components */}
                  <div className="lg:col-span-8 space-y-4">

                    {/* Updated Performance Component */}
                    <motion.div 
                      className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bfddf9]"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      whileHover={{ boxShadow: "0 10px 25px -5px rgba(33, 63, 91, 0.1)" }}
                    >
                      <div className="p-4 border-b border-[#bfddf9]/30 flex justify-between items-center bg-gradient-to-r from-[#bfddf9]/30 to-[#bfddf9]/10">
                        <h2 className="font-semibold text-[#213f5b] flex items-center gap-2">
                          <UserGroupIcon className="h-5 w-5 text-[#213f5b]" />
                          <span>Performance de l&apos;équipe commercial</span>
                        </h2>
                        <Link href="/admin/regies" className="text-sm text-[#213f5b] hover:text-[#213f5b]/80 flex items-center gap-1">
                          Gérer l&apos;équipe
                          <ArrowRightIcon className="h-4 w-4" />
                        </Link>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-[#bfddf9]/10">
                              <th className="text-left py-3 px-4 text-sm font-medium text-[#213f5b]">Partenaires</th>
                              <th className="text-center py-3 px-4 text-sm font-medium text-[#213f5b]">Taches a realiser</th>
                              <th className="text-center py-3 px-4 text-sm font-medium text-[#213f5b]">Taches a cloturer</th>
                              <th className="text-center py-3 px-4 text-sm font-medium text-[#213f5b]">Projet en cours</th>
                              <th className="text-center py-3 px-4 text-sm font-medium text-[#213f5b]">Projet cloturé</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#bfddf9]/30">
                            {stats.teamPerformance.map((regie, idx) => (
                              <tr key={idx} className="hover:bg-[#bfddf9]/5 transition-colors">
                                <td className="py-3 px-4 text-sm font-medium text-[#213f5b]">
                                  <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-[#bfddf9]/30 text-[#213f5b] flex items-center justify-center font-medium">
                                      {regie.team.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <span>{regie.team}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-[#bfddf9]/30 text-[#213f5b]">
                                    {regie.tasks_to_do}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-[#d2fcb2]/40 text-[#213f5b]">
                                    {regie.tasks_to_close}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-[#bfddf9]/50 text-[#213f5b]">
                                    {regie.projects_in_progress}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-[#d2fcb2]/50 text-[#213f5b]">
                                    {regie.projects_closed}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                    
                    {/* Quick Actions in a compact redesigned card */}
                    <motion.div 
                      className="bg-white rounded-xl shadow-sm border border-[#bfddf9]"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      whileHover={{ boxShadow: "0 10px 25px -5px rgba(33, 63, 91, 0.1)" }}
                    >
                      <div className="p-4 border-b border-[#bfddf9]/30 flex justify-between items-center bg-gradient-to-r from-[#d2fcb2]/30 to-[#d2fcb2]/10">
                        <h2 className="font-semibold text-[#213f5b] flex items-center gap-2">
                          <BoltIcon className="h-5 w-5 text-[#213f5b]" />
                          <span>Actions rapides</span>
                        </h2>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-4 gap-3">
                          <Link
                            href="/admin/users/new"
                            className="flex flex-col items-center justify-center bg-[#bfddf9]/10 hover:bg-[#bfddf9]/20 transition-all p-3 rounded-lg"
                          >
                            <UserCircleIcon className="h-6 w-6 text-[#213f5b] mb-2" />
                            <span className="text-xs font-medium text-[#213f5b] text-center">Nouvel utilisateur</span>
                          </Link>
                          <Link
                            href="/admin/projects/new"
                            className="flex flex-col items-center justify-center bg-[#bfddf9]/10 hover:bg-[#bfddf9]/20 transition-all p-3 rounded-lg"
                          >
                            <BriefcaseIcon className="h-6 w-6 text-[#213f5b] mb-2" />
                            <span className="text-xs font-medium text-[#213f5b] text-center">Nouveau projet</span>
                          </Link>
                          <Link
                            href="/admin/invoices/new"
                            className="flex flex-col items-center justify-center bg-[#d2fcb2]/20 hover:bg-[#d2fcb2]/30 transition-all p-3 rounded-lg"
                          >
                            <DocumentTextIcon className="h-6 w-6 text-[#213f5b] mb-2" />
                            <span className="text-xs font-medium text-[#213f5b] text-center">Créer facture</span>
                          </Link>
                          <Link
                            href="/admin/tasks/new"
                            className="flex flex-col items-center justify-center bg-[#d2fcb2]/20 hover:bg-[#d2fcb2]/30 transition-all p-3 rounded-lg"
                          >
                            <ClockIcon className="h-6 w-6 text-[#213f5b] mb-2" />
                            <span className="text-xs font-medium text-[#213f5b] text-center">Nouvelle tâche</span>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Third Column - Chat Previews */}
                  <div className="lg:col-span-4">
                    <motion.div 
                      className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bfddf9] h-full flex flex-col"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      whileHover={{ boxShadow: "0 10px 25px -5px rgba(33, 63, 91, 0.1)" }}
                    >
                      <div className="p-4 border-b border-[#bfddf9]/30 flex justify-between items-center bg-gradient-to-r from-[#d2fcb2]/30 to-[#d2fcb2]/10">
                        <h2 className="font-semibold text-[#213f5b] flex items-center gap-2">
                          <ChatBubbleLeftRightIcon className="h-5 w-5 text-[#213f5b]" />
                          <span>Nouveaux messages</span>
                        </h2>
                        <Link href="/admin/messages" className="text-sm text-[#213f5b] hover:text-[#213f5b]/80 flex items-center gap-1">
                          Voir tous
                          <ArrowRightIcon className="h-4 w-4" />
                        </Link>
                      </div>
                      <div className="divide-y divide-[#bfddf9]/30 overflow-y-auto flex-grow">
                        {chats.length === 0 ? (
                          <div className="p-4 text-center text-sm text-[#213f5b]/50">
                            Aucun message
                          </div>
                        ) : (
                          chats.map((chat) => (
                            <div key={chat.id} className="p-3 hover:bg-[#bfddf9]/5 transition-colors">
                              <div className="flex items-start gap-3">
                                <div className="relative flex-shrink-0">
                                {chat.participants.filter(p => p.id !== adminInfo?._id).length === 1 ? (
                                    <img 
                                      src={chat.participants.find(p => p.id !== adminInfo?._id)?.avatar_url || `https://ui-avatars.com/api/?name=${chat.participants.find(p => p.id !== adminInfo?._id)?.name || "User"}&background=random`}
                                      alt={chat.participants.find(p => p.id !== adminInfo?._id)?.name || "User"}
                                      className="h-10 w-10 rounded-full"
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-[#bfddf9]/30 flex items-center justify-center text-xs text-[#213f5b]">
                                      <UserGroupIcon className="h-6 w-6" />
                                    </div>
                                  )}
                                  {chat.unread_count > 0 && (
                                    <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#213f5b] text-white text-xs flex items-center justify-center font-medium">
                                      {chat.unread_count}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <h4 className="text-sm font-medium text-[#213f5b]">
                                      {chat.participants.length === 2 
                                        ? chat.participants.find(p => p.id !== adminInfo?._id)?.name 
                                        : `${chat.participants.filter(p => p.id !== adminInfo?._id).length + 1} personnes`}
                                    </h4>
                                    <span className="text-xs text-[#213f5b]/50">
                                      {formatTime(chat.last_message.timestamp)}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-xs text-[#213f5b]/70 line-clamp-1">
                                    {chat.last_message.sender_id === adminInfo?._id ? "Vous: " : ""}
                                    {truncateText(chat.last_message.content, 40)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="p-3 border-t border-[#bfddf9]/30 bg-[#bfddf9]/5 flex justify-center mt-auto">
                        <Link 
                          href="/admin/messages/new" 
                          className="text-sm text-[#213f5b] hover:text-[#213f5b]/80 flex items-center gap-1"
                        >
                          <PlusCircleIcon className="h-4 w-4" />
                          Nouvelle conversation
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>
            </div>
          )}
        </div>
      </main>
    </div>
  </div>
);
}
