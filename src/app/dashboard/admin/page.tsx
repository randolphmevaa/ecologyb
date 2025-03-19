"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import {
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  BellAlertIcon,
  BoltIcon,
  BriefcaseIcon,
  // CalendarIcon,
  ChartBarIcon,
  ChartPieIcon,
  // ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  // ClockIcon,
  CogIcon,
  CpuChipIcon,
  CubeIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  // GlobeAltIcon,
  KeyIcon,
  MapPinIcon,
  PlusCircleIcon,
  ServerIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  UserGroupIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
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

// interface Contact {
//   id?: string;
//   _id?: string;
//   firstName: string;
//   lastName: string;
//   email?: string;
//   phone?: string;
//   mailingAddress: string;
//   prix: string;
//   assignedRegie: string;
//   projet?: string[];
// }

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

interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  response_time: number;
  uptime: number;
  error_rate: number;
  requests_per_second: number;
  active_sessions: number;
  avg_request_time: number;
  status: "healthy" | "warning" | "critical";
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
  systemHealth: {
    status: "healthy" | "warning" | "critical";
    components: {
      name: string;
      status: "healthy" | "warning" | "critical";
      value: number;
    }[];
  };
  
  teamPerformance: {
    team: string;
    score: number;
    tasks_completed: number;
    avg_response_time: number;
  }[];
  
  monthlyActiveUsers: { month: string; value: number }[];
}

interface AccessLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  resource: string;
  timestamp: string;
  ip_address: string;
  status: "success" | "failure";
  details?: string;
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

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
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

const getTimeSince = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now.getTime() - past.getTime();
  const diffInSec = Math.floor(diffInMs / 1000);
  
  if (diffInSec < 60) return `${diffInSec} secondes`;
  
  const diffInMin = Math.floor(diffInSec / 60);
  if (diffInMin < 60) return `${diffInMin} minutes`;
  
  const diffInHours = Math.floor(diffInMin / 60);
  if (diffInHours < 24) return `${diffInHours} heures`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} jours`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} mois`;
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ans`;
};

/** ---------------------
 *     MAIN COMPONENT
 *  --------------------- */
export default function AdminDashboardPage() {
  const [adminInfo, setAdminInfo] = useState<{ _id: string; email: string } | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [, setTasks] = useState<Task[]>([]);
  const [ , setEvents] = useState<Event[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  // const [contacts, setContacts] = useState<Contact[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
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
    systemHealth: {
      status: "healthy",
      components: []
    },
    
    teamPerformance: [],
    monthlyActiveUsers: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'projects' | 'finance' | 'system'>('overview');
  
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
      
      // Sample tasks
      const sampleTasks: Task[] = [
        {
          id: "task001",
          title: "Finaliser le dossier de subvention",
          description: "Compléter tous les documents requis et vérifier les pièces justificatives",
          due_date: "2025-04-12T18:00:00Z",
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
          due_date: "2025-03-17T17:00:00Z",
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
          due_date: "2025-03-19T12:00:00Z",
          priority: "urgent",
          status: "not_started",
          assignee: "u003",
          assignee_name: "Pierre Laurent",
          assignee_avatar: "https://randomuser.me/api/portraits/men/62.jpg",
          created_at: "2025-03-15T11:20:00Z",
          updated_at: "2025-03-15T11:20:00Z",
          tags: ["commande", "matériel", "installation"]
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
      
      // Sample system metrics
      const sampleSystemMetrics: SystemMetrics = {
        cpu_usage: 42,
        memory_usage: 58,
        disk_usage: 67,
        response_time: 230, // ms
        uptime: 95.8, // percentage
        error_rate: 0.6, // percentage
        requests_per_second: 24,
        active_sessions: 32,
        avg_request_time: 186, // ms
        status: "healthy"
      };
      
      // Sample access logs
      const sampleAccessLogs: AccessLog[] = [
        {
          id: "log001",
          user_id: "u001",
          user_name: "Thomas Dubois",
          action: "login",
          resource: "system",
          timestamp: "2025-03-19T08:15:00Z",
          ip_address: "192.168.1.45",
          status: "success"
        },
        {
          id: "log002",
          user_id: "u002",
          user_name: "Marie Lefevre",
          action: "update",
          resource: "project/p001",
          timestamp: "2025-03-18T16:30:00Z",
          ip_address: "192.168.1.78",
          status: "success"
        },
        {
          id: "log003",
          user_id: "u003",
          user_name: "Pierre Laurent",
          action: "view",
          resource: "task/task003",
          timestamp: "2025-03-19T07:45:00Z",
          ip_address: "192.168.1.92",
          status: "success"
        },
        {
          id: "log004",
          user_id: "unknown",
          user_name: "Unknown",
          action: "login",
          resource: "system",
          timestamp: "2025-03-19T02:35:00Z",
          ip_address: "45.128.67.89",
          status: "failure",
          details: "Invalid credentials"
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
          { name: "Admin", value: sampleUsers.filter(u => u.role === "admin").length, color: "#4F46E5" },
          { name: "Manager", value: sampleUsers.filter(u => u.role === "manager").length, color: "#0EA5E9" },
          { name: "Regie", value: sampleUsers.filter(u => u.role === "regie").length, color: "#10B981" },
          { name: "Tech", value: sampleUsers.filter(u => u.role === "technician").length, color: "#F59E0B" },
          { name: "Sales", value: sampleUsers.filter(u => u.role === "sales").length, color: "#EC4899" }
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
        systemHealth: {
          status: "healthy",
          components: [
            { name: "API Server", status: "healthy", value: 95 },
            { name: "Database", status: "healthy", value: 92 },
            { name: "Storage", status: "warning", value: 67 },
            { name: "Authentication", status: "healthy", value: 98 },
            { name: "File Service", status: "healthy", value: 90 }
          ]
        },
        
        // Team performance
        teamPerformance: [
          { team: "Technique", score: 87, tasks_completed: 42, avg_response_time: 4.2 },
          { team: "Commercial", score: 92, tasks_completed: 36, avg_response_time: 1.8 },
          { team: "Projets", score: 78, tasks_completed: 28, avg_response_time: 5.5 },
          { team: "Études", score: 85, tasks_completed: 31, avg_response_time: 3.2 }
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
      setSystemMetrics(sampleSystemMetrics);
      setAccessLogs(sampleAccessLogs);
      setNotifications(sampleNotifications);
      setStats(sampleAdminStats);
      setIsLoading(false);
    }, 1000);
  }, [adminInfo]);

  // Get today's events
  // const todaysEvents = useMemo(() => {
  //   return events.filter(event => {
  //     const eventDate = new Date(event.start_time).toDateString();
  //     const today = new Date().toDateString();
  //     return eventDate === today;
  //   });
  // }, [events]);

  // Get recent access logs
  const recentAccessLogs = useMemo(() => {
    return accessLogs.slice(0, 5);
  }, [accessLogs]);

  // Get critical notifications
  const criticalNotifications = useMemo(() => {
    return notifications.filter(n => !n.read && (n.type === "error" || n.type === "warning"));
  }, [notifications]);

  // Get critical system components
  const criticalSystemComponents = useMemo(() => {
    return stats.systemHealth.components.filter(c => c.status === "warning" || c.status === "critical");
  }, [stats.systemHealth.components]);

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "success":
      case "healthy":
      case "completed":
      case "Terminé":
      case "Payée":
        return "bg-green-100 text-green-800";
      case "inactive":
      case "En attente":
      case "pending":
      case "not_started":
      case "Brouillon":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
      case "blocked":
      case "failure":
      case "critical":
      case "Annulé":
        return "bg-red-100 text-red-800";
      case "in_progress":
      case "warning":
      case "En cours":
      case "Envoyée":
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "technician":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "regie":
        return "bg-green-100 text-green-800 border-green-200";
      case "sales":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "customer":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Calculate progress bar width
  const calculateProgressWidth = (progress: number): string => {
    return `${Math.max(0, Math.min(100, progress))}%`;
  };

  const NavTab = ({ id, label, icon, active }: { id: typeof activeTab, label: string, icon: React.ReactNode, active: boolean }) => (
    <button
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        active 
          ? 'bg-white text-[#213f5b] shadow-sm' 
          : 'text-gray-600 hover:bg-white/50 hover:text-[#213f5b]'
      }`}
      onClick={() => setActiveTab(id)}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main
          className="flex-1 overflow-y-auto"
          style={{
            background:
              "linear-gradient(135deg, rgba(79,70,229,0.05) 0%, rgba(16,185,129,0.05) 100%)",
          }}
        >
          <div className="p-6 md:p-8">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl font-bold text-[#213f5b]">
                  {welcomeMessage}, {adminInfo?.email.split('@')[0] || "Admin"}
                </h1>
                <p className="text-gray-600">
                  Tableau de bord d&apos;administration des projets d&apos;énergies renouvelables
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
                  className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                >
                  <CogIcon className="h-5 w-5" />
                  <span className="hidden md:inline">Paramètres</span>
                </motion.button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <ArrowPathIcon className="h-10 w-10 text-[#4F46E5] animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Chargement du tableau de bord d&apos;administration...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Main navigation tabs */}
                <div className="bg-indigo-50/50 rounded-xl p-1 flex space-x-1 overflow-x-auto">
                  <NavTab 
                    id="overview" 
                    label="Vue d'ensemble" 
                    icon={<ChartPieIcon className="h-5 w-5" />} 
                    active={activeTab === 'overview'} 
                  />
                  <NavTab 
                    id="users" 
                    label="Utilisateurs" 
                    icon={<UsersIcon className="h-5 w-5" />} 
                    active={activeTab === 'users'} 
                  />
                  <NavTab 
                    id="projects" 
                    label="Projets" 
                    icon={<BriefcaseIcon className="h-5 w-5" />} 
                    active={activeTab === 'projects'} 
                  />
                  <NavTab 
                    id="finance" 
                    label="Finances" 
                    icon={<BanknotesIcon className="h-5 w-5" />} 
                    active={activeTab === 'finance'} 
                  />
                  <NavTab 
                    id="system" 
                    label="Système" 
                    icon={<ServerIcon className="h-5 w-5" />} 
                    active={activeTab === 'system'} 
                  />
                </div>

                {/* Dashboard Content - Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Alert Banner for Critical Issues */}
                    {criticalNotifications.length > 0 && (
                      <motion.div 
                        className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-red-100 rounded-full text-red-600">
                            <ExclamationTriangleIcon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-red-800">Problèmes critiques nécessitant votre attention</h3>
                            <ul className="mt-2 space-y-1 text-sm text-red-700">
                              {criticalNotifications.map((notification, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                  <span>{notification.title}: {notification.description}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Link 
                            href="/admin/alerts" 
                            className="text-red-700 hover:text-red-900 text-sm font-medium flex items-center gap-1 whitespace-nowrap"
                          >
                            Voir tout
                            <ArrowRightIcon className="h-4 w-4" />
                          </Link>
                        </div>
                      </motion.div>
                    )}

                    {/* KPI Stats Cards */}
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div 
                        className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all"
                        whileHover={{ y: -5 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                            <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{stats.totalUsers}</h3>
                            <div className="flex items-center gap-1 mt-2">
                              <span className={`text-xs flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium ${stats.usersGrowth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {stats.usersGrowth >= 0 ? <ArrowTrendingUpIcon className="h-3 w-3" /> : <ArrowTrendingDownIcon className="h-3 w-3" />}
                                {Math.abs(stats.usersGrowth)}%
                              </span>
                              <span className="text-xs text-gray-500">vs mois précédent</span>
                            </div>
                          </div>
                          <div className="p-3 rounded-full bg-indigo-100">
                            <UserGroupIcon className="h-6 w-6 text-indigo-600" />
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4 text-sm">
                          <div className="flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded-full bg-green-500"></span>
                            <span className="text-gray-600">Actifs: {stats.activeUsers}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                            <span className="text-gray-600">En attente: {stats.pendingUsers}</span>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div 
                        className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all"
                        whileHover={{ y: -5 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Projets</p>
                            <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{stats.projectsCount}</h3>
                            <div className="flex items-center gap-1 mt-2">
                              <span className={`text-xs flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium ${stats.projectsGrowth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {stats.projectsGrowth >= 0 ? <ArrowTrendingUpIcon className="h-3 w-3" /> : <ArrowTrendingDownIcon className="h-3 w-3" />}
                                {Math.abs(stats.projectsGrowth)}%
                              </span>
                              <span className="text-xs text-gray-500">vs mois précédent</span>
                            </div>
                          </div>
                          <div className="p-3 rounded-full bg-blue-100">
                            <BriefcaseIcon className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-4 gap-1">
                          {stats.projectsStatus.map((status, idx) => (
                            <div 
                              key={idx} 
                              className="h-2 rounded-full"
                              style={{ backgroundColor: status.color }}
                              title={`${status.name}: ${status.value}`}
                            ></div>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>En cours: {stats.projectsStatus.find(s => s.name === "En cours")?.value || 0}</span>
                          <span>Terminés: {stats.projectsStatus.find(s => s.name === "Terminé")?.value || 0}</span>
                        </div>
                      </motion.div>

                      <motion.div 
                        className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all"
                        whileHover={{ y: -5 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Revenus</p>
                            <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{formatCurrency(stats.totalRevenue)}</h3>
                            <div className="flex items-center gap-1 mt-2">
                              <span className={`text-xs flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium ${stats.revenueGrowth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {stats.revenueGrowth >= 0 ? <ArrowTrendingUpIcon className="h-3 w-3" /> : <ArrowTrendingDownIcon className="h-3 w-3" />}
                                {Math.abs(stats.revenueGrowth)}%
                              </span>
                              <span className="text-xs text-gray-500">vs mois précédent</span>
                            </div>
                          </div>
                          <div className="p-3 rounded-full bg-green-100">
                            <BanknotesIcon className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-600 flex justify-between items-center">
                          <span>Factures en attente:</span>
                          <span className="font-medium text-[#213f5b]">{stats.pendingInvoices}</span>
                        </div>
                      </motion.div>

                      <motion.div 
                        className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all"
                        whileHover={{ y: -5 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Santé du système</p>
                            <h3 className="text-2xl font-bold text-[#213f5b] mt-1">
                              {systemMetrics?.status === "healthy" ? "Bon" : 
                               systemMetrics?.status === "warning" ? "Avertissement" : 
                               systemMetrics?.status === "critical" ? "Critique" : "---"}
                            </h3>
                            <div className="flex items-center gap-1 mt-2">
                              <span className={`text-xs rounded-full px-1.5 py-0.5 font-medium ${
                                systemMetrics?.status === "healthy" ? "bg-green-100 text-green-800" :
                                systemMetrics?.status === "warning" ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-100 text-red-800"
                              }`}>
                                {systemMetrics?.uptime.toFixed(1)}% uptime
                              </span>
                            </div>
                          </div>
                          <div className="p-3 rounded-full bg-purple-100">
                            <ServerIcon className="h-6 w-6 text-purple-600" />
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>CPU</span>
                            <span>{systemMetrics?.cpu_usage || 0}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                (systemMetrics?.cpu_usage || 0) > 80 ? "bg-red-500" :
                                (systemMetrics?.cpu_usage || 0) > 60 ? "bg-yellow-500" :
                                "bg-green-500"
                              }`}
                              style={{ width: `${systemMetrics?.cpu_usage || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left Column */}
                      <div className="lg:col-span-2 space-y-6">
                        {/* User Activity Chart */}
                        <motion.div 
                          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        >
                          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-semibold text-[#213f5b] flex items-center gap-2">
                              <ChartBarIcon className="h-5 w-5 text-[#213f5b]" />
                              Activité des utilisateurs
                            </h2>
                            <Link href="/admin/analytics" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                              Analyse détaillée
                              <ArrowRightIcon className="h-4 w-4" />
                            </Link>
                          </div>
                          <div className="p-4">
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                  data={stats.monthlyActiveUsers}
                                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                >
                                  <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1}/>
                                    </linearGradient>
                                  </defs>
                                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                  <YAxis axisLine={false} tickLine={false} />
                                  <Tooltip 
                                    formatter={(value) => [`${value} utilisateurs`, "Actifs"]}
                                    contentStyle={{ 
                                      borderRadius: "0.5rem", 
                                      border: "none", 
                                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" 
                                    }}
                                  />
                                  <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#4F46E5" 
                                    fillOpacity={1} 
                                    fill="url(#colorUsers)" 
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                              <div className="bg-indigo-50 rounded-lg p-3">
                                <div className="text-xs text-indigo-600 font-medium">UTILISATEURS ACTIFS</div>
                                <div className="text-2xl font-bold text-indigo-900 mt-1">{stats.activeUsers}</div>
                              </div>
                              <div className="bg-green-50 rounded-lg p-3">
                                <div className="text-xs text-green-600 font-medium">TAUX D&apos;ENGAGEMENT</div>
                                <div className="text-2xl font-bold text-green-900 mt-1">78%</div>
                              </div>
                              <div className="bg-blue-50 rounded-lg p-3">
                                <div className="text-xs text-blue-600 font-medium">TEMPS MOYEN</div>
                                <div className="text-2xl font-bold text-blue-900 mt-1">24 min</div>
                              </div>
                              <div className="bg-purple-50 rounded-lg p-3">
                                <div className="text-xs text-purple-600 font-medium">NOUVEAUX CETTE SEMAINE</div>
                                <div className="text-2xl font-bold text-purple-900 mt-1">{stats.newUsersThisWeek}</div>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Team Performance */}
                        <motion.div 
                          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-semibold text-[#213f5b] flex items-center gap-2">
                              <UserGroupIcon className="h-5 w-5 text-[#213f5b]" />
                              Performance des équipes
                            </h2>
                            <Link href="/admin/teams" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                              Gérer les équipes
                              <ArrowRightIcon className="h-4 w-4" />
                            </Link>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Équipe</th>
                                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Score</th>
                                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Tâches Complétées</th>
                                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Temps Réponse (j)</th>
                                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Tendance</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {stats.teamPerformance.map((team, idx) => (
                                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{team.team}</td>
                                    <td className="py-3 px-4 text-center">
                                      <div className="flex items-center justify-center">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                          team.score >= 90 ? "bg-green-100 text-green-800" :
                                          team.score >= 75 ? "bg-blue-100 text-blue-800" :
                                          team.score >= 60 ? "bg-yellow-100 text-yellow-800" :
                                          "bg-red-100 text-red-800"
                                        }`}>
                                          {team.score}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 text-center text-sm text-gray-600">{team.tasks_completed}</td>
                                    <td className="py-3 px-4 text-center text-sm text-gray-600">{team.avg_response_time}</td>
                                    <td className="py-3 px-4 text-right">
                                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                        idx === 0 ? "bg-green-100 text-green-800" :
                                        idx === 1 ? "bg-blue-100 text-blue-800" :
                                        idx === 2 ? "bg-red-100 text-red-800" :
                                        "bg-yellow-100 text-yellow-800"
                                      }`}>
                                        {idx === 0 ? "+5%" :
                                         idx === 1 ? "+2%" :
                                         idx === 2 ? "-3%" :
                                         "+1%"}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </motion.div>

                        {/* Revenue & Project Distribution Charts */}
                        <motion.div 
                          className="grid grid-cols-1 md:grid-cols-2 gap-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          {/* Revenue Chart */}
                          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                            <h2 className="font-semibold text-[#213f5b] mb-4 flex items-center gap-2">
                              <BanknotesIcon className="h-5 w-5 text-[#213f5b]" />
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
                                    fill="#10B981"
                                    radius={[4, 4, 0, 0]}
                                    background={{ fill: '#f3f4f6' }}
                                  />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* Project Distribution Chart */}
                          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
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
                      </div>

                      {/* Right Column - Activities & System Health */}
                      <motion.div 
                        className="space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                          <h2 className="font-semibold text-[#213f5b] mb-4 flex items-center gap-2">
                            <BoltIcon className="h-5 w-5 text-[#213f5b]" />
                            Actions rapides
                          </h2>
                          <div className="grid grid-cols-2 gap-3">
                            <button className="flex flex-col items-center bg-indigo-50 hover:bg-indigo-100 transition-colors p-3 rounded-lg">
                              <UserCircleIcon className="h-6 w-6 text-indigo-600 mb-2" />
                              <span className="text-sm font-medium text-indigo-900">Nouvel utilisateur</span>
                            </button>
                            <button className="flex flex-col items-center bg-green-50 hover:bg-green-100 transition-colors p-3 rounded-lg">
                              <BriefcaseIcon className="h-6 w-6 text-green-600 mb-2" />
                              <span className="text-sm font-medium text-green-900">Nouveau projet</span>
                            </button>
                            <button className="flex flex-col items-center bg-blue-50 hover:bg-blue-100 transition-colors p-3 rounded-lg">
                              <DocumentTextIcon className="h-6 w-6 text-blue-600 mb-2" />
                              <span className="text-sm font-medium text-blue-900">Facturation</span>
                            </button>
                            <button className="flex flex-col items-center bg-purple-50 hover:bg-purple-100 transition-colors p-3 rounded-lg">
                              <CogIcon className="h-6 w-6 text-purple-600 mb-2" />
                              <span className="text-sm font-medium text-purple-900">Paramètres</span>
                            </button>
                          </div>
                        </div>

                        {/* User Activity Logs */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-semibold text-[#213f5b] flex items-center gap-2">
                              <EyeIcon className="h-5 w-5 text-[#213f5b]" />
                              Activité récente
                            </h2>
                            <Link href="/admin/logs" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                              Tous les logs
                              <ArrowRightIcon className="h-4 w-4" />
                            </Link>
                          </div>
                          <div className="overflow-hidden">
                            <div className="max-h-80 overflow-y-auto">
                              {recentAccessLogs.map((log) => (
                                <div 
                                  key={log.id} 
                                  className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className={`mt-0.5 p-1.5 rounded-full ${log.status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                                      {log.status === 'success' ? (
                                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <ExclamationCircleIcon className="h-4 w-4 text-red-600" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm text-gray-900 font-medium">
                                        {log.user_name} {log.action === 'login' ? 'a accédé au' : 'a modifié'} {log.resource}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-500">
                                          {formatDateTime(log.timestamp)}
                                        </span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-gray-500">
                                          IP: {log.ip_address}
                                        </span>
                                      </div>
                                      {log.details && (
                                        <p className="text-xs text-red-600 mt-1">{log.details}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* System Health */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                          <div className="p-4 border-b border-gray-100">
                            <h2 className="font-semibold text-[#213f5b] flex items-center gap-2">
                              <ServerIcon className="h-5 w-5 text-[#213f5b]" />
                              Santé du système
                            </h2>
                          </div>
                          <div className="p-4">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="bg-indigo-50 rounded-lg p-3 flex flex-col items-center justify-center">
                                <CpuChipIcon className="h-6 w-6 text-indigo-600 mb-1" />
                                <div className="text-xs text-indigo-700 font-medium mb-1">CPU</div>
                                <div className="text-xl font-bold text-indigo-900">{systemMetrics?.cpu_usage || 0}%</div>
                              </div>
                              <div className="bg-green-50 rounded-lg p-3 flex flex-col items-center justify-center">
                                <ServerIcon className="h-6 w-6 text-green-600 mb-1" />
                                <div className="text-xs text-green-700 font-medium mb-1">MÉMOIRE</div>
                                <div className="text-xl font-bold text-green-900">{systemMetrics?.memory_usage || 0}%</div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="font-medium text-gray-700">Temps de réponse</span>
                                  <span className="text-gray-600">{systemMetrics?.response_time || 0} ms</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      (systemMetrics?.response_time || 0) > 500 ? "bg-red-500" :
                                      (systemMetrics?.response_time || 0) > 300 ? "bg-yellow-500" :
                                      "bg-green-500"
                                    }`}
                                    style={{ width: `${Math.min(100, ((systemMetrics?.response_time || 0) / 10))}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="font-medium text-gray-700">Taux d&apos;erreur</span>
                                  <span className="text-gray-600">{systemMetrics?.error_rate || 0}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      (systemMetrics?.error_rate || 0) > 3 ? "bg-red-500" :
                                      (systemMetrics?.error_rate || 0) > 1 ? "bg-yellow-500" :
                                      "bg-green-500"
                                    }`}
                                    style={{ width: `${Math.min(100, ((systemMetrics?.error_rate || 0) * 20))}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="font-medium text-gray-700">Sessions actives</span>
                                  <span className="text-gray-600">{systemMetrics?.active_sessions || 0}</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full rounded-full bg-blue-500"
                                    style={{ width: `${Math.min(100, ((systemMetrics?.active_sessions || 0) / 2))}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            
                            {criticalSystemComponents.length > 0 && (
                              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <h3 className="text-sm font-medium text-yellow-800 flex items-center gap-1.5">
                                  <ExclamationTriangleIcon className="h-4 w-4" />
                                  Composants à surveiller
                                </h3>
                                <ul className="mt-2 space-y-1">
                                  {criticalSystemComponents.map((component, idx) => (
                                    <li key={idx} className="text-xs text-yellow-700 flex items-center justify-between">
                                      <span>{component.name}</span>
                                      <span className={`px-1.5 py-0.5 rounded-full ${
                                        component.status === "critical" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                                      }`}>
                                        {component.value}%
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <Link 
                                href="/admin/system" 
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1"
                              >
                                Surveillance détaillée
                                <ArrowRightIcon className="h-4 w-4" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                  <div className="space-y-6">
                    {/* Users Management Header */}
                    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-100">
                      <div>
                        <h2 className="text-lg font-bold text-[#213f5b]">Gestion des utilisateurs</h2>
                        <p className="text-sm text-gray-600 mt-1">
                          Gérez l&apos;accès, les rôles et les permissions des utilisateurs
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="Rechercher..."
                            className="w-full md:w-60 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <div className="relative">
                          <select className="pl-4 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none">
                            <option value="">Tous les rôles</option>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="regie">Régie</option>
                            <option value="technician">Technicien</option>
                            <option value="sales">Commercial</option>
                          </select>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute right-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                        >
                          <PlusCircleIcon className="h-5 w-5" />
                          <span>Nouvel utilisateur</span>
                        </motion.button>
                      </div>
                    </div>

                    {/* Users List */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Utilisateur</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Rôle</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Département</th>
                              <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Statut</th>
                              <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Dernière connexion</th>
                              <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    {user.avatar_url ? (
                                      <img 
                                        src={user.avatar_url} 
                                        alt={`${user.firstName} ${user.lastName}`}
                                        className="h-8 w-8 rounded-full object-cover"
                                      />
                                    ) : (
                                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                      </div>
                                    )}
                                    <div>
                                      <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                                      <div className="text-sm text-gray-600">Projets: {user.projects_count} | Tâches: {user.tasks_count}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                                <td className="py-3 px-4 text-sm text-gray-600">{user.department || "-"}</td>
                                <td className="py-3 px-4 text-center">
                                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-center text-sm text-gray-600">
                                  {user.last_login ? getTimeSince(user.last_login) : "Jamais"}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <div className="flex items-center justify-center space-x-2">
                                    <button className="p-1.5 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                                      <EyeIcon className="h-5 w-5" />
                                    </button>
                                    <button className="p-1.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                      <CogIcon className="h-5 w-5" />
                                    </button>
                                    <button className="p-1.5 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors">
                                      <KeyIcon className="h-5 w-5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                        <div className="text-sm text-gray-600">
                          Affichage de <span className="font-medium text-gray-900">1</span> à <span className="font-medium text-gray-900">{users.length}</span> sur <span className="font-medium text-gray-900">{users.length}</span> utilisateurs
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button className="p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-100">
                      <div>
                        <h2 className="text-lg font-bold text-[#213f5b]">Gestion des projets</h2>
                        <p className="text-sm text-gray-600 mt-1">
                          Suivez et gérez tous les projets d&apos;énergies renouvelables
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="Rechercher..."
                            className="w-full md:w-60 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                        >
                          <PlusCircleIcon className="h-5 w-5" />
                          <span>Nouveau projet</span>
                        </motion.button>
                      </div>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.map((project) => (
                        <motion.div 
                          key={project.id}
                          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                          whileHover={{ y: -5 }}
                        >
                          <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                {project.status}
                              </span>
                              <span className="text-xs font-medium text-gray-500">
                                {formatDate(project.start_date)}
                              </span>
                            </div>
                            <h3 className="font-semibold text-[#213f5b] text-lg mb-2">
                              {project.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                              {truncateText(project.description, 100)}
                            </p>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Client:</span>
                                <span className="font-medium text-gray-900">{project.client}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Type:</span>
                                <span className="font-medium text-gray-900">{project.type}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Budget:</span>
                                <span className="font-medium text-gray-900">{formatCurrency(project.budget)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Progression:</span>
                                <span className="font-medium text-gray-900">{project.progress}%</span>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div 
                                  className="h-2.5 rounded-full bg-blue-600" 
                                  style={{ width: calculateProgressWidth(project.progress) }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <MapPinIcon className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{project.location}</span>
                            </div>
                            <Link 
                              href={`/admin/projects/${project.id}`}
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              Détails
                              <ArrowRightIcon className="h-4 w-4" />
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Finance Tab */}
                {activeTab === 'finance' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-100">
                      <div>
                        <h2 className="text-lg font-bold text-[#213f5b]">Gestion financière</h2>
                        <p className="text-sm text-gray-600 mt-1">
                          Suivez les factures, les paiements et les analyses financières
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                        >
                          <PlusCircleIcon className="h-5 w-5" />
                          <span>Nouvelle facture</span>
                        </motion.button>
                      </div>
                    </div>

                    {/* Finance Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                          <h2 className="font-semibold text-[#213f5b] flex items-center gap-2">
                            <DocumentTextIcon className="h-5 w-5 text-[#213f5b]" />
                            Factures récentes
                          </h2>
                          <Link href="/admin/invoices" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            Toutes les factures
                            <ArrowRightIcon className="h-4 w-4" />
                          </Link>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Référence</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Montant HT</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">TVA</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Montant TTC</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Statut</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="py-3 px-4 text-sm font-medium text-blue-600">{invoice.id}</td>
                                  <td className="py-3 px-4 text-sm text-gray-600">{formatDate(invoice.date_creation)}</td>
                                  <td className="py-3 px-4 text-sm text-gray-600 text-right">{formatCurrency(invoice.montant_ht)}</td>
                                  <td className="py-3 px-4 text-sm text-gray-600 text-right">{invoice.tva}%</td>
                                  <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">{formatCurrency(invoice.montant_ttc)}</td>
                                  <td className="py-3 px-4 text-center">
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.statut)}`}>
                                      {invoice.statut}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                      <button className="p-1.5 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                                        <EyeIcon className="h-5 w-5" />
                                      </button>
                                      <button className="p-1.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                        <ArrowPathIcon className="h-5 w-5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                          <h2 className="font-semibold text-[#213f5b] mb-4 flex items-center gap-2">
                            <ChartBarIcon className="h-5 w-5 text-[#213f5b]" />
                            Revenus 2025 (€)
                          </h2>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={stats.revenueByMonth}
                                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                              >
                                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                                <YAxis tickFormatter={(value) => `${value/1000}k`} tickLine={false} axisLine={false} />
                                <Tooltip 
                                  formatter={(value) => [`${formatCurrency(value as number)}`, "Revenu"]}
                                  contentStyle={{ 
                                    borderRadius: "0.5rem", 
                                    border: "none", 
                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" 
                                  }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="value" 
                                  stroke="#10B981" 
                                  strokeWidth={2} 
                                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                                  activeDot={{ fill: "#047857", strokeWidth: 0, r: 6 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                          <h2 className="font-semibold text-[#213f5b] mb-4 flex items-center gap-2">
                            <BanknotesIcon className="h-5 w-5 text-[#213f5b]" />
                            Résumé financier
                          </h2>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                              <span className="text-gray-600">Revenu total 2025:</span>
                              <span className="font-bold text-[#213f5b]">{formatCurrency(127000)}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                              <span className="text-gray-600">Factures en attente:</span>
                              <span className="font-medium text-amber-600">{formatCurrency(13200)}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                              <span className="text-gray-600">Marge moyenne:</span>
                              <span className="font-medium text-green-600">38.5%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Projection annuelle:</span>
                              <span className="font-medium text-blue-600">{formatCurrency(480000)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* System Tab */}
                {activeTab === 'system' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-100">
                      <div>
                        <h2 className="text-lg font-bold text-[#213f5b]">Système & Sécurité</h2>
                        <p className="text-sm text-gray-600 mt-1">
                          Monitoring des performances, sécurité et logs d&apos;accès
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-all"
                        >
                          <WrenchScrewdriverIcon className="h-5 w-5" />
                          <span>Maintenance</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                        >
                          <ShieldCheckIcon className="h-5 w-5" />
                          <span>Sécurité</span>
                        </motion.button>
                      </div>
                    </div>

                    {/* System Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                          <div className="p-4 border-b border-gray-100">
                            <h2 className="font-semibold text-[#213f5b] flex items-center gap-2">
                              <CpuChipIcon className="h-5 w-5 text-[#213f5b]" />
                              Performances du système
                            </h2>
                          </div>
                          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-indigo-50 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-indigo-800">CPU</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  (systemMetrics?.cpu_usage || 0) > 80 ? "bg-red-100 text-red-800" :
                                  (systemMetrics?.cpu_usage || 0) > 60 ? "bg-yellow-100 text-yellow-800" :
                                  "bg-green-100 text-green-800"
                                }`}>
                                  {systemMetrics?.cpu_usage || 0}%
                                </span>
                              </div>
                              <div className="h-2 bg-white rounded-full overflow-hidden mb-4">
                                <div 
                                  className={`h-full rounded-full ${
                                    (systemMetrics?.cpu_usage || 0) > 80 ? "bg-red-500" :
                                    (systemMetrics?.cpu_usage || 0) > 60 ? "bg-yellow-500" :
                                    "bg-green-500"
                                  }`}
                                  style={{ width: `${systemMetrics?.cpu_usage || 0}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-indigo-700">
                                <div className="flex justify-between mb-1">
                                  <span>Threads:</span>
                                  <span>24 actifs</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Load average:</span>
                                  <span>1.2, 1.0, 0.8</span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-green-800">Mémoire</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  (systemMetrics?.memory_usage || 0) > 80 ? "bg-red-100 text-red-800" :
                                  (systemMetrics?.memory_usage || 0) > 60 ? "bg-yellow-100 text-yellow-800" :
                                  "bg-green-100 text-green-800"
                                }`}>
                                  {systemMetrics?.memory_usage || 0}%
                                </span>
                              </div>
                              <div className="h-2 bg-white rounded-full overflow-hidden mb-4">
                                <div 
                                  className={`h-full rounded-full ${
                                    (systemMetrics?.memory_usage || 0) > 80 ? "bg-red-500" :
                                    (systemMetrics?.memory_usage || 0) > 60 ? "bg-yellow-500" :
                                    "bg-green-500"
                                  }`}
                                  style={{ width: `${systemMetrics?.memory_usage || 0}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-green-700">
                                <div className="flex justify-between mb-1">
                                  <span>Total:</span>
                                  <span>16 GB</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Used:</span>
                                  <span>{(16 * (systemMetrics?.memory_usage || 0) / 100).toFixed(1)} GB</span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-blue-800">Disque</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  (systemMetrics?.disk_usage || 0) > 80 ? "bg-red-100 text-red-800" :
                                  (systemMetrics?.disk_usage || 0) > 60 ? "bg-yellow-100 text-yellow-800" :
                                  "bg-green-100 text-green-800"
                                }`}>
                                  {systemMetrics?.disk_usage || 0}%
                                </span>
                              </div>
                              <div className="h-2 bg-white rounded-full overflow-hidden mb-4">
                                <div 
                                  className={`h-full rounded-full ${
                                    (systemMetrics?.disk_usage || 0) > 80 ? "bg-red-500" :
                                    (systemMetrics?.disk_usage || 0) > 60 ? "bg-yellow-500" :
                                    "bg-green-500"
                                  }`}
                                  style={{ width: `${systemMetrics?.disk_usage || 0}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-blue-700">
                                <div className="flex justify-between mb-1">
                                  <span>Total:</span>
                                  <span>1 TB</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>I/O:</span>
                                  <span>12 MB/s</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-semibold text-[#213f5b] flex items-center gap-2">
                              <ShieldCheckIcon className="h-5 w-5 text-[#213f5b]" />
                              Logs d&apos;accès
                            </h2>
                            <Link href="/admin/logs" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                              Historique complet
                              <ArrowRightIcon className="h-4 w-4" />
                            </Link>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Utilisateur</th>
                                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Action</th>
                                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Ressource</th>
                                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">IP</th>
                                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Statut</th>
                                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Timestamp</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {accessLogs.map((log) => (
                                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{log.user_name}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{log.action}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{log.resource}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{log.ip_address}</td>
                                    <td className="py-3 px-4 text-center">
                                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                                        {log.status}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600 text-right">{formatDateTime(log.timestamp)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                          <div className="p-4 border-b border-gray-100">
                            <h2 className="font-semibold text-[#213f5b] flex items-center gap-2">
                              <CubeIcon className="h-5 w-5 text-[#213f5b]" />
                              Composants du système
                            </h2>
                          </div>
                          <div className="p-4">
                            <ul className="space-y-3">
                              {stats.systemHealth.components.map((component, idx) => (
                                <li key={idx} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                      component.status === "healthy" ? "bg-green-500" :
                                      component.status === "warning" ? "bg-yellow-500" :
                                      "bg-red-500"
                                    }`}></div>
                                    <span className="text-sm font-medium text-gray-900">{component.name}</span>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    component.status === "healthy" ? "bg-green-100 text-green-800" :
                                    component.status === "warning" ? "bg-yellow-100 text-yellow-800" :
                                    "bg-red-100 text-red-800"
                                  }`}>
                                    {component.value}%
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                          <div className="p-4 border-b border-gray-100">
                            <h2 className="font-semibold text-[#213f5b] flex items-center gap-2">
                              <AdjustmentsHorizontalIcon className="h-5 w-5 text-[#213f5b]" />
                              Paramètres système
                            </h2>
                          </div>
                          <div className="p-4">
                            <div className="space-y-4">
                              <div>
                                <label className="flex items-center justify-between text-sm mb-1">
                                  <span className="font-medium text-gray-700">Mode maintenance</span>
                                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                    <input type="checkbox" id="toggle-maintenance" className="sr-only" />
                                    <div className="block h-6 bg-gray-200 rounded-full w-11"></div>
                                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"></div>
                                  </div>
                                </label>
                                <p className="text-xs text-gray-500">Activer le mode maintenance rendra le site inaccessible pour les utilisateurs non-admin.</p>
                              </div>
                              
                              <div>
                                <label className="flex items-center justify-between text-sm mb-1">
                                  <span className="font-medium text-gray-700">Logs avancés</span>
                                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                    <input type="checkbox" id="toggle-logs" className="sr-only" checked />
                                    <div className="block h-6 bg-indigo-400 rounded-full w-11"></div>
                                    <div className="absolute left-6 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"></div>
                                  </div>
                                </label>
                                <p className="text-xs text-gray-500">Enregistre des informations détaillées sur les actions et les performances.</p>
                              </div>
                              
                              <div>
                                <label className="flex items-center justify-between text-sm mb-1">
                                  <span className="font-medium text-gray-700">Alertes email</span>
                                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                    <input type="checkbox" id="toggle-email" className="sr-only" checked />
                                    <div className="block h-6 bg-indigo-400 rounded-full w-11"></div>
                                    <div className="absolute left-6 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"></div>
                                  </div>
                                </label>
                                <p className="text-xs text-gray-500">Envoi d&apos;alertes par email en cas d&apos;incident critique.</p>
                              </div>
                              
                              <div className="pt-3 mt-3 border-t border-gray-100">
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  className="w-full px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all"
                                >
                                  <CogIcon className="h-5 w-5" />
                                  <span>Configuration avancée</span>
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
