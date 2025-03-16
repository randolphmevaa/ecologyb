"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";

import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  BriefcaseIcon,
  PlusCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  // EllipsisHorizontalIcon,
  CheckIcon,
  // ChevronDownIcon,
  ArrowPathIcon,
  // AdjustmentsHorizontalIcon,
  ListBulletIcon,
  ArrowTopRightOnSquareIcon,
  UserIcon,
  // BuildingOfficeIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  // FlagIcon,
  ChatBubbleLeftRightIcon,
  // VideoCameraIcon,
  // PhoneIcon,
  BellAlertIcon,
  // Squares2X2Icon,
  // ArrowLongLeftIcon,
  ArrowLongRightIcon,
  InformationCircleIcon,
  CubeIcon,
  // BellIcon,
  PencilIcon,
  LinkIcon,
  // TrashIcon,
  // FolderIcon,
  // PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

/** ---------------------
 *    TYPE DEFINITIONS
 *  --------------------- */
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

type EventStatus = "scheduled" | "completed" | "cancelled" | "in_progress";
type EventPriority = "low" | "medium" | "high" | "urgent";
type ViewType = "month" | "week" | "day" | "agenda" | "kanban";

interface EventParticipant {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: string;
  type: "internal" | "client" | "admin" | "external";
  confirmed: boolean;
}

interface EventLocation {
  name: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  virtual?: boolean;
  link?: string;
}

interface Document {
  id: string;
  title: string;
  type: string;
}

interface Note {
  id: string;
  content: string;
  created_at: string;
  author: string;
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
  location: EventLocation;
  participants: EventParticipant[];
  recurrence?: string;
  related_documents?: Document[];
  notes?: Note[];
  reminder?: number; // minutes before event
  color?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
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
  related_documents?: Document[];
  created_at: string;
  updated_at: string;
  tags?: string[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar_url?: string;
  role: string;
}

/** ---------------------
 *     MAIN COMPONENT
 *  --------------------- */
export default function AgendaPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>("month");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    category: "meeting_client",
    status: "scheduled",
    priority: "medium",
    all_day: false,
    location: { name: "", virtual: false },
    participants: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<EventCategory | "all">("all");
  const [filterPriority, setFilterPriority] = useState<EventPriority | "all">("all");
  // const [showKanban, setShowKanban] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ , setUserInfo] = useState<{ _id: string; email: string } | null>(null);

  // Sample events data
  const sampleEvents: Event[] = [
    {
      id: "event001",
      title: "Réunion projet photovoltaïque - Mairie de Montpellier",
      description: "Discussion des spécifications techniques pour l'installation de panneaux solaires sur les bâtiments municipaux",
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
          type: "client",
          confirmed: true
        },
        {
          id: "part002",
          name: "Thomas Dubois",
          email: "thomas.dubois@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
          role: "Admin",
          type: "admin",
          confirmed: true
        },
        {
          id: "part003",
          name: "Pierre Laurent",
          email: "pierre.laurent@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/62.jpg",
          role: "Technique",
          type: "internal",
          confirmed: true
        }
      ],
      related_documents: [
        {
          id: "doc001",
          title: "Convention de partenariat - Projet Solaire",
          type: "Contrat"
        },
        {
          id: "doc002",
          title: "Rapport d'évaluation - Efficacité énergétique",
          type: "Rapport"
        }
      ],
      created_by: "user001",
      created_at: "2025-03-10T15:30:00Z",
      updated_at: "2025-03-12T09:45:00Z"
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
          type: "internal",
          confirmed: true
        },
        {
          id: "part004",
          name: "Jean Moreau",
          email: "j.moreau@habitat-eco.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/22.jpg",
          role: "Responsable technique",
          type: "client",
          confirmed: true
        }
      ],
      related_documents: [
        {
          id: "doc005",
          title: "Guide d'installation - Bornes de recharge",
          type: "Guide"
        }
      ],
      created_by: "user003",
      created_at: "2025-03-14T10:15:00Z",
      updated_at: "2025-03-14T10:15:00Z"
    },
    {
      id: "event003",
      title: "Date limite - Soumission dossier subvention",
      description: "Date limite pour la soumission du dossier de demande de subvention pour le projet de mobilité verte",
      start_time: "2025-04-15T23:59:59Z",
      end_time: "2025-04-15T23:59:59Z",
      category: "deadline",
      status: "scheduled",
      priority: "urgent",
      all_day: true,
      location: {
        name: "Bureau",
        virtual: true
      },
      participants: [
        {
          id: "part005",
          name: "Sophie Legrand",
          email: "sophie.legrand@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/women/17.jpg",
          role: "Finance",
          type: "internal",
          confirmed: true
        }
      ],
      related_documents: [
        {
          id: "doc004",
          title: "Demande de subvention - Projet Mobilité Verte",
          type: "Formulaire"
        }
      ],
      notes: [
        {
          id: "note001",
          content: "Vérifier que tous les documents nécessaires sont inclus avant soumission",
          created_at: "2025-03-15T14:30:00Z",
          author: "Sophie Legrand"
        }
      ],
      reminder: 1440, // 24 hours before
      created_by: "user004",
      created_at: "2025-03-10T11:30:00Z",
      updated_at: "2025-03-15T14:30:00Z"
    },
    {
      id: "event004",
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
          type: "internal",
          confirmed: true
        },
        {
          id: "part006",
          name: "Équipe d'installation",
          email: "installation@ecologyb.fr",
          role: "Installateurs",
          type: "internal",
          confirmed: true
        },
        {
          id: "part001",
          name: "Marie Dupont",
          email: "marie.dupont@montpellier.fr",
          avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
          role: "Directrice des services techniques",
          type: "client",
          confirmed: true
        }
      ],
      related_documents: [
        {
          id: "doc001",
          title: "Convention de partenariat - Projet Solaire",
          type: "Contrat"
        },
        {
          id: "doc006",
          title: "Schéma d'installation - École Jean Jaurès",
          type: "Technique"
        }
      ],
      created_by: "user003",
      created_at: "2025-03-12T16:45:00Z",
      updated_at: "2025-03-12T16:45:00Z"
    },
    {
      id: "event005",
      title: "Réunion hebdomadaire équipe technique",
      description: "Point d'avancement sur les projets en cours",
      start_time: "2025-03-17T09:00:00Z",
      end_time: "2025-03-17T10:00:00Z",
      category: "meeting_admin",
      status: "completed",
      priority: "medium",
      all_day: false,
      location: {
        name: "Salle de conférence",
        virtual: true,
        link: "https://meet.google.com/eco-team-weekly"
      },
      participants: [
        {
          id: "part002",
          name: "Thomas Dubois",
          email: "thomas.dubois@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
          role: "Admin",
          type: "admin",
          confirmed: true
        },
        {
          id: "part003",
          name: "Pierre Laurent",
          email: "pierre.laurent@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/62.jpg",
          role: "Technique",
          type: "internal",
          confirmed: true
        },
        {
          id: "part005",
          name: "Sophie Legrand",
          email: "sophie.legrand@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/women/17.jpg",
          role: "Finance",
          type: "internal",
          confirmed: true
        }
      ],
      recurrence: "FREQ=WEEKLY;BYDAY=MO",
      created_by: "user002",
      created_at: "2025-01-15T16:30:00Z",
      updated_at: "2025-03-10T15:45:00Z"
    },
    {
      id: "event006",
      title: "Formation utilisation système de monitoring",
      description: "Formation des équipes techniques du client sur l'utilisation du système de monitoring des panneaux solaires",
      start_time: "2025-03-29T13:30:00Z",
      end_time: "2025-03-29T16:30:00Z",
      category: "training",
      status: "scheduled",
      priority: "medium",
      all_day: false,
      location: {
        name: "Centre technique municipal",
        address: "45 Rue des Techniques, 34000 Montpellier",
        virtual: false
      },
      participants: [
        {
          id: "part003",
          name: "Pierre Laurent",
          email: "pierre.laurent@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/62.jpg",
          role: "Technique",
          type: "internal",
          confirmed: true
        },
        {
          id: "part001",
          name: "Marie Dupont",
          email: "marie.dupont@montpellier.fr",
          avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
          role: "Directrice des services techniques",
          type: "client",
          confirmed: true
        },
        {
          id: "part007",
          name: "Équipe technique municipale",
          email: "technique@montpellier.fr",
          role: "Techniciens",
          type: "client",
          confirmed: true
        }
      ],
      related_documents: [
        {
          id: "doc007",
          title: "Manuel d'utilisation - Système de monitoring",
          type: "Guide"
        }
      ],
      reminder: 1440, // 24 hours before
      created_by: "user003",
      created_at: "2025-03-15T10:30:00Z",
      updated_at: "2025-03-15T10:30:00Z"
    },
    {
      id: "event007",
      title: "Maintenance annuelle - Système éolien",
      description: "Maintenance annuelle programmée du système éolien installé l'année dernière",
      start_time: "2025-04-05T08:00:00Z",
      end_time: "2025-04-05T17:00:00Z",
      category: "maintenance",
      status: "scheduled",
      priority: "high",
      all_day: true,
      location: {
        name: "Parc éolien Les Hauteurs",
        address: "Route de Nîmes, 34670 Baillargues",
        virtual: false
      },
      participants: [
        {
          id: "part003",
          name: "Pierre Laurent",
          email: "pierre.laurent@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/62.jpg",
          role: "Technique",
          type: "internal",
          confirmed: true
        },
        {
          id: "part008",
          name: "Équipe de maintenance",
          email: "maintenance@ecologyb.fr",
          role: "Techniciens",
          type: "internal",
          confirmed: true
        }
      ],
      related_documents: [
        {
          id: "doc008",
          title: "Protocole de maintenance - Système éolien",
          type: "Technique"
        },
        {
          id: "doc009",
          title: "Historique de maintenance - Parc éolien Les Hauteurs",
          type: "Rapport"
        }
      ],
      reminder: 2880, // 48 hours before
      created_by: "user003",
      created_at: "2025-02-20T14:15:00Z",
      updated_at: "2025-02-20T14:15:00Z"
    },
    {
      id: "event008",
      title: "Appel client - GreenTech Innovations",
      description: "Suivi de la proposition de collaboration sur les solutions de stockage d'énergie",
      start_time: "2025-03-18T15:00:00Z",
      end_time: "2025-03-18T15:30:00Z",
      category: "meeting_client",
      status: "scheduled",
      priority: "medium",
      all_day: false,
      location: {
        name: "Appel téléphonique",
        virtual: true
      },
      participants: [
        {
          id: "part010",
          name: "Sarah Berger",
          email: "s.berger@greentech-innov.com",
          avatar_url: "https://randomuser.me/api/portraits/women/33.jpg",
          role: "Directrice R&D",
          type: "client",
          confirmed: true
        },
        {
          id: "part011",
          name: "Alexandre Martin",
          email: "a.martin@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/45.jpg",
          role: "Responsable commercial",
          type: "internal",
          confirmed: true
        }
      ],
      created_by: "user011",
      created_at: "2025-03-16T10:15:00Z",
      updated_at: "2025-03-16T10:15:00Z"
    }
  ];
  
  // Sample tasks data
  const sampleTasks: Task[] = [
    {
      id: "task001",
      title: "Finaliser le dossier de subvention",
      description: "Compléter tous les documents requis et vérifier les pièces justificatives",
      due_date: "2025-04-12T18:00:00Z",
      priority: "high",
      status: "in_progress",
      assignee: "user004",
      related_event: "event003",
      related_documents: [
        {
          id: "doc004",
          title: "Demande de subvention - Projet Mobilité Verte",
          type: "Formulaire"
        }
      ],
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
      related_event: "event004",
      created_at: "2025-03-15T11:20:00Z",
      updated_at: "2025-03-15T11:20:00Z",
      tags: ["commande", "matériel", "installation"]
    },
    {
      id: "task004",
      title: "Mettre à jour le manuel d'utilisation du système de monitoring",
      description: "Intégrer les modifications récentes de l'interface et ajouter les nouvelles fonctionnalités",
      due_date: "2025-03-27T18:00:00Z",
      priority: "medium",
      status: "not_started",
      assignee: "user012",
      related_event: "event006",
      related_documents: [
        {
          id: "doc007",
          title: "Manuel d'utilisation - Système de monitoring",
          type: "Guide"
        }
      ],
      created_at: "2025-03-16T09:45:00Z",
      updated_at: "2025-03-16T09:45:00Z",
      tags: ["documentation", "formation", "mise à jour"]
    },
    {
      id: "task005",
      title: "Réaliser étude de faisabilité - Extension parc éolien",
      description: "Analyser les données de vent et évaluer la faisabilité d'extension du parc éolien existant",
      due_date: "2025-04-10T18:00:00Z",
      priority: "medium",
      status: "not_started",
      assignee: "user003",
      created_at: "2025-03-16T14:30:00Z",
      updated_at: "2025-03-16T14:30:00Z",
      tags: ["étude", "éolien", "développement"]
    },
    {
      id: "task006",
      title: "Préparer le devis pour GreenTech Innovations",
      description: "Établir un devis détaillé pour la collaboration sur les solutions de stockage d'énergie",
      due_date: "2025-03-20T12:00:00Z",
      priority: "high",
      status: "not_started",
      assignee: "user011",
      related_event: "event008",
      created_at: "2025-03-16T10:30:00Z",
      updated_at: "2025-03-16T10:30:00Z",
      tags: ["devis", "commercial", "collaboration"]
    }
  ];

  // Sample users data
  const sampleUsers: User[] = [
    {
      id: "user001",
      firstName: "Thomas",
      lastName: "Dubois",
      email: "thomas.dubois@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "Admin"
    },
    {
      id: "user002",
      firstName: "Léa",
      lastName: "Martin",
      email: "lea.martin@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
      role: "Support"
    },
    {
      id: "user003",
      firstName: "Pierre",
      lastName: "Laurent",
      email: "pierre.laurent@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/men/62.jpg",
      role: "Technique"
    },
    {
      id: "user004",
      firstName: "Sophie",
      lastName: "Legrand",
      email: "sophie.legrand@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/women/17.jpg",
      role: "Finance"
    },
    {
      id: "user011",
      firstName: "Alexandre",
      lastName: "Martin",
      email: "a.martin@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/men/45.jpg",
      role: "Commercial"
    },
    {
      id: "user012",
      firstName: "Julie",
      lastName: "Petit",
      email: "j.petit@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/women/22.jpg",
      role: "Communication"
    }
  ];

  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true);
    setTimeout(() => {
      setEvents(sampleEvents);
      setTasks(sampleTasks);
      setUsers(sampleUsers); // Add this line to set the users data
      setIsLoading(false);
    }, 1000);
    
    // Get user info from localStorage
    const proInfo = localStorage.getItem("proInfo");
    if (proInfo) {
      setUserInfo(JSON.parse(proInfo));
    }
  }, []);

  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true);
    setTimeout(() => {
      setEvents(sampleEvents);
      setTasks(sampleTasks);
      setIsLoading(false);
    }, 1000);
    
    // Get user info from localStorage
    const proInfo = localStorage.getItem("proInfo");
    if (proInfo) {
      setUserInfo(JSON.parse(proInfo));
    }
  }, []);

  // Generate dates for the current month or week view
  const calendarDates = useMemo(() => {
    const dates = [];
    
    if (viewType === "month") {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      
      // Get the first day of the month
      const firstDayOfMonth = new Date(year, month, 1);
      // Get the last day of the month
      const lastDayOfMonth = new Date(year, month + 1, 0);
      
      // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
      let firstDayOfWeek = firstDayOfMonth.getDay();
      // Adjust for Monday as first day of week (0 = Monday, 6 = Sunday)
      firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
      
      // Add previous month days to fill the first week
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(year, month, -i);
        dates.push(date);
      }
      
      // Add all days of the current month
      for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const date = new Date(year, month, day);
        dates.push(date);
      }
      
      // Add next month days to fill the last week
      const lastDay = lastDayOfMonth.getDay();
      const daysToAdd = lastDay === 0 ? 0 : 7 - lastDay;
      for (let i = 1; i <= daysToAdd; i++) {
        const date = new Date(year, month + 1, i);
        dates.push(date);
      }
    } else if (viewType === "week") {
      // Find the Monday of the current week
      const day = selectedDate.getDay();
      const diff = selectedDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
      const mondayOfWeek = new Date(selectedDate);
      mondayOfWeek.setDate(diff);
      
      // Add all 7 days of the week
      for (let i = 0; i < 7; i++) {
        const date = new Date(mondayOfWeek);
        date.setDate(mondayOfWeek.getDate() + i);
        dates.push(date);
      }
    } else if (viewType === "day") {
      // Just add the selected date
      dates.push(new Date(selectedDate));
    }
    
    return dates;
  }, [selectedDate, viewType]);

  // Filter events for the selected date range
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.location.name.toLowerCase().includes(searchLower) ||
          (event.location.address && event.location.address.toLowerCase().includes(searchLower)) ||
          event.participants.some(p => 
            p.name.toLowerCase().includes(searchLower) || 
            p.email.toLowerCase().includes(searchLower)
          );
        
        if (!matchesSearch) return false;
      }
      
      // Filter by category
      if (filterCategory !== "all" && event.category !== filterCategory) {
        return false;
      }
      
      // Filter by priority
      if (filterPriority !== "all" && event.priority !== filterPriority) {
        return false;
      }
      
      return true;
    });
  }, [events, searchTerm, filterCategory, filterPriority]);

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    
    return filteredEvents.filter(event => {
      const eventStart = new Date(event.start_time);
      const eventEnd = new Date(event.end_time);
      
      // Check if the event is for this date
      const eventStartDate = eventStart.toISOString().split('T')[0];
      const eventEndDate = eventEnd.toISOString().split('T')[0];
      
      if (event.all_day) {
        // For all-day events, check if the date is between start and end date (inclusive)
        return dateString >= eventStartDate && dateString <= eventEndDate;
      } else {
        // For time-specific events
        if (viewType === "day") {
          // In day view, show all events that overlap with this day
          return dateString >= eventStartDate && dateString <= eventEndDate;
        } else {
          // In month or week view, show events on their start date
          return dateString === eventStartDate;
        }
      }
    });
  };

  // Get today's events
  const todaysEvents = useMemo(() => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    return filteredEvents.filter(event => {
      const eventStart = new Date(event.start_time);
      const eventEnd = new Date(event.end_time);
      
      const eventStartDate = eventStart.toISOString().split('T')[0];
      const eventEndDate = eventEnd.toISOString().split('T')[0];
      
      if (event.all_day) {
        // For all-day events, check if today is between start and end date (inclusive)
        return todayString >= eventStartDate && todayString <= eventEndDate;
      } else {
        // For time-specific events, check if it's happening today
        return todayString >= eventStartDate && todayString <= eventEndDate;
      }
    }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  }, [filteredEvents]);

  // Get upcoming events (next 7 days, excluding today)
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    // Calculate date 7 days from now
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const nextWeekString = nextWeek.toISOString().split('T')[0];
    
    return filteredEvents
      .filter(event => {
        const eventStart = new Date(event.start_time);
        const eventStartDate = eventStart.toISOString().split('T')[0];
        
        // Include events that start after today but before or on the next 7 days
        return eventStartDate > todayString && eventStartDate <= nextWeekString;
      })
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  }, [filteredEvents]);

  // Get upcoming tasks ordered by due date and priority
  const upcomingTasks = useMemo(() => {
    const today = new Date();
    
    return tasks
      .filter(task => task.status !== "completed" && new Date(task.due_date) >= today)
      .sort((a, b) => {
        // First sort by due date
        const dateComparison = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        if (dateComparison !== 0) return dateComparison;
        
        // Then by priority (urgent > high > medium > low)
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  }, [tasks]);

  // Get overdue tasks
  const overdueTasks = useMemo(() => {
    const today = new Date();
    
    return tasks
      .filter(task => task.status !== "completed" && new Date(task.due_date) < today)
      .sort((a, b) => {
        // Sort by priority first (urgent > high > medium > low)
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        const priorityComparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityComparison !== 0) return priorityComparison;
        
        // Then by due date (oldest first)
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      });
  }, [tasks]);

  // Navigate to the previous month/week/day
  const handlePrevious = () => {
    const newDate = new Date(selectedDate);
    
    if (viewType === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewType === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else if (viewType === "day") {
      newDate.setDate(newDate.getDate() - 1);
    }
    
    setSelectedDate(newDate);
  };

  // Navigate to the next month/week/day
  const handleNext = () => {
    const newDate = new Date(selectedDate);
    
    if (viewType === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewType === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else if (viewType === "day") {
      newDate.setDate(newDate.getDate() + 1);
    }
    
    setSelectedDate(newDate);
  };

  // Go to today
  const handleToday = () => {
    setSelectedDate(new Date());
  };

  // Format date for display
  const formatDate = (date: Date, format: 'full' | 'short' | 'weekday' | 'day' = 'full'): string => {
    const options: Intl.DateTimeFormatOptions = {};
    
    if (format === 'full' || format === 'short') {
      options.day = 'numeric';
      options.month = format === 'full' ? 'long' : 'short';
      options.year = 'numeric';
    }
    
    if (format === 'weekday' || format === 'full') {
      options.weekday = format === 'full' ? 'long' : 'short';
    }
    
    if (format === 'day') {
      options.day = 'numeric';
    }
    
    return date.toLocaleDateString('fr-FR', options);
  };

  // Format time for display
  const formatTime = (dateTimeString: string, includeSeconds = false): string => {
    const date = new Date(dateTimeString);
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
    };
    
    if (includeSeconds) {
      options.second = '2-digit';
    }
    
    return date.toLocaleTimeString('fr-FR', options);
  };

  // Get the month name for display
  const getMonthName = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  // Get the week range for display
  const getWeekRange = (date: Date): string => {
    // Find the Monday of the current week
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    const monday = new Date(date);
    monday.setDate(diff);
    
    // Find the Sunday of the current week
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    // Format the date range
    const options: Intl.DateTimeFormatOptions = { day: 'numeric' };
    
    // If month is different, include it
    if (monday.getMonth() !== sunday.getMonth()) {
      return `${monday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${sunday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }
    
    // If year is different, include it
    if (monday.getFullYear() !== sunday.getFullYear()) {
      return `${monday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })} - ${sunday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }
    
    // Otherwise, just show the day range with month and year
    return `${monday.toLocaleDateString('fr-FR', options)} - ${sunday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  };

  // Determine if a date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Determine if a date is in the current month
  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === selectedDate.getMonth();
  };

  // Get color for an event category
  const getCategoryColor = (category: EventCategory): string => {
    switch (category) {
      case "meeting_client":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "meeting_admin":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "site_visit":
        return "bg-green-100 text-green-800 border-green-300";
      case "deadline":
        return "bg-red-100 text-red-800 border-red-300";
      case "task":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "installation":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "training":
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case "maintenance":
        return "bg-teal-100 text-teal-800 border-teal-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Get color for an event by status
  const getStatusColor = (status: EventStatus): string => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get color for an event by priority
  const getPriorityColor = (priority: EventPriority): string => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get priority label
  const getPriorityLabel = (priority: EventPriority): string => {
    switch (priority) {
      case "urgent":
        return "Urgente";
      case "high":
        return "Élevée";
      case "medium":
        return "Moyenne";
      case "low":
        return "Basse";
      default:
        return "Non définie";
    }
  };

  // Get category label
  const getCategoryLabel = (category: EventCategory): string => {
    switch (category) {
      case "meeting_client":
        return "Réunion Client";
      case "meeting_admin":
        return "Réunion Interne";
      case "site_visit":
        return "Visite de Site";
      case "deadline":
        return "Échéance";
      case "task":
        return "Tâche";
      case "installation":
        return "Installation";
      case "training":
        return "Formation";
      case "maintenance":
        return "Maintenance";
      default:
        return "Autre";
    }
  };

  // Get category icon
  const getCategoryIcon = (category: EventCategory) => {
    switch (category) {
      case "meeting_client":
        return <BriefcaseIcon className="h-5 w-5 text-blue-500" />;
      case "meeting_admin":
        return <UserGroupIcon className="h-5 w-5 text-purple-500" />;
      case "site_visit":
        return <MapPinIcon className="h-5 w-5 text-green-500" />;
      case "deadline":
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      case "task":
        return <CheckIcon className="h-5 w-5 text-gray-500" />;
      case "installation":
        return <CubeIcon className="h-5 w-5 text-yellow-500" />;
      case "training":
        return <UserIcon className="h-5 w-5 text-indigo-500" />;
      case "maintenance":
        return <ArrowPathIcon className="h-5 w-5 text-teal-500" />;
      default:
        return <CalendarIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Handle opening event details
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // Truncate text with ellipsis
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Generate time slots for day view
  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 7; i <= 19; i++) { // 7 AM to 7 PM
      slots.push(`${i}:00`);
      slots.push(`${i}:30`);
    }
    return slots;
  };

  // Get events for a specific time slot in day view
  const getEventsForTimeSlot = (date: Date, timeSlot: string) => {
    const [hour, minute] = timeSlot.split(':').map(Number);
    const slotStart = new Date(date);
    slotStart.setHours(hour, minute, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotStart.getMinutes() + 30);
    
    return filteredEvents.filter(event => {
      if (event.all_day) return false; // All-day events are shown separately
      
      const eventStart = new Date(event.start_time);
      const eventEnd = new Date(event.end_time);
      
      // Check if event overlaps with the time slot
      return (eventStart < slotEnd && eventEnd > slotStart) &&
             (eventStart.toDateString() === date.toDateString() || eventEnd.toDateString() === date.toDateString());
    });
  };

  // Check if an event spans multiple days
  const isMultiDayEvent = (event: Event): boolean => {
    const eventStart = new Date(event.start_time);
    const eventEnd = new Date(event.end_time);
    
    return eventStart.toDateString() !== eventEnd.toDateString();
  };

  // Get all-day events for a date
  const getAllDayEvents = (date: Date) => {
    return filteredEvents.filter(event => {
      if (!event.all_day && !isMultiDayEvent(event)) return false;
      
      const eventStart = new Date(event.start_time);
      const eventEnd = new Date(event.end_time);
      
      // For all-day events, check if the date is between start and end date (inclusive)
      return date >= new Date(eventStart.setHours(0, 0, 0, 0)) && 
             date <= new Date(eventEnd.setHours(23, 59, 59, 999));
    });
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
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl font-bold text-[#213f5b]">
                  Agenda
                </h1>
                <p className="text-gray-600">
                  Planifiez et gérez vos événements, rendez-vous et tâches
                </p>
              </motion.div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* View Selector */}
                <div className="bg-white rounded-lg shadow-sm p-1 flex">
                  <button 
                    className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 ${viewType === 'month' ? 'bg-[#213f5b] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setViewType('month')}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    <span className="hidden md:inline">Mois</span>
                  </button>
                  <button 
                    className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 ${viewType === 'week' ? 'bg-[#213f5b] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setViewType('week')}
                  >
                    <ListBulletIcon className="h-4 w-4" />
                    <span className="hidden md:inline">Semaine</span>
                  </button>
                  <button 
                    className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 ${viewType === 'day' ? 'bg-[#213f5b] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setViewType('day')}
                  >
                    <ClockIcon className="h-4 w-4" />
                    <span className="hidden md:inline">Jour</span>
                  </button>
                  <button 
                    className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 ${viewType === 'agenda' ? 'bg-[#213f5b] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setViewType('agenda')}
                  >
                    <ListBulletIcon className="h-4 w-4" />
                    <span className="hidden md:inline">Liste</span>
                  </button>
                </div>

                <div className="flex items-center">
                  <button 
                    className="p-2 rounded-l bg-white border border-r-0 hover:bg-gray-50 text-gray-600"
                    onClick={handlePrevious}
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <button 
                    className="px-3 py-1.5 bg-white border border-x-0 hover:bg-gray-50 text-sm font-medium"
                    onClick={handleToday}
                  >
                    Aujourd&apos;hui
                  </button>
                  <button 
                    className="p-2 rounded-r bg-white border border-l-0 hover:bg-gray-50 text-gray-600"
                    onClick={handleNext}
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-[#213f5b] text-white rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                  onClick={() => setShowNewEventModal(true)}
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  Nouvel événement
                </motion.button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Sidebar - Events and Tasks Summary */}
              <div className="md:w-80 lg:w-96 space-y-6">
                {/* Current Date Title */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <h2 className="text-xl font-bold text-[#213f5b] text-center">
                    {viewType === 'month' && getMonthName(selectedDate)}
                    {viewType === 'week' && getWeekRange(selectedDate)}
                    {viewType === 'day' && formatDate(selectedDate, 'full')}
                    {viewType === 'agenda' && 'Agenda'}
                  </h2>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher un événement..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#213f5b] focus:border-[#213f5b] text-sm"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Catégorie
                      </label>
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value as EventCategory | "all")}
                        className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-[#213f5b] focus:border-[#213f5b] text-sm"
                      >
                        <option value="all">Toutes</option>
                        <option value="meeting_client">Réunion Client</option>
                        <option value="meeting_admin">Réunion Interne</option>
                        <option value="site_visit">Visite de Site</option>
                        <option value="deadline">Échéance</option>
                        <option value="installation">Installation</option>
                        <option value="training">Formation</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="task">Tâche</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priorité
                      </label>
                      <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value as EventPriority | "all")}
                        className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-[#213f5b] focus:border-[#213f5b] text-sm"
                      >
                        <option value="all">Toutes</option>
                        <option value="urgent">Urgente</option>
                        <option value="high">Élevée</option>
                        <option value="medium">Moyenne</option>
                        <option value="low">Basse</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Today's Events */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-[#213f5b] px-4 py-3 text-white flex justify-between items-center">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      Aujourd&apos;hui
                    </h3>
                    <span className="text-sm bg-white/20 rounded-full w-6 h-6 inline-flex items-center justify-center">
                      {todaysEvents.length}
                    </span>
                  </div>
                  <div className="p-2">
                    {todaysEvents.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        Aucun événement aujourd&apos;hui
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {todaysEvents.map((event) => (
                          <div 
                            key={event.id} 
                            className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-full ${getCategoryColor(event.category).split(' ')[0]}`}>
                                {getCategoryIcon(event.category)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {event.title}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                  <ClockIcon className="h-3.5 w-3.5" />
                                  {event.all_day ? (
                                    "Toute la journée"
                                  ) : (
                                    `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`
                                  )}
                                </div>
                                {event.location?.name && (
                                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                    <MapPinIcon className="h-3.5 w-3.5" />
                                    {truncateText(event.location.name, 25)}
                                  </div>
                                )}
                              </div>
                              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                                {getPriorityLabel(event.priority)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-blue-600 px-4 py-3 text-white flex justify-between items-center">
                    <h3 className="font-semibold flex items-center gap-2">
                      <ArrowLongRightIcon className="h-5 w-5" />
                      À venir
                    </h3>
                    <span className="text-sm bg-white/20 rounded-full w-6 h-6 inline-flex items-center justify-center">
                      {upcomingEvents.length}
                    </span>
                  </div>
                  <div className="p-2 max-h-[300px] overflow-y-auto">
                    {upcomingEvents.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        Aucun événement à venir
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {upcomingEvents.slice(0, 5).map((event) => (
                          <div 
                            key={event.id} 
                            className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-full ${getCategoryColor(event.category).split(' ')[0]}`}>
                                {getCategoryIcon(event.category)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {event.title}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                  <CalendarIcon className="h-3.5 w-3.5" />
                                  {formatDate(new Date(event.start_time), 'short')}
                                  {!event.all_day && (
                                    <span className="ml-1">
                                      {formatTime(event.start_time)}
                                    </span>
                                  )}
                                </div>
                                {event.location?.name && (
                                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                    <MapPinIcon className="h-3.5 w-3.5" />
                                    {truncateText(event.location.name, 25)}
                                  </div>
                                )}
                              </div>
                              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                                {getPriorityLabel(event.priority)}
                              </div>
                            </div>
                          </div>
                        ))}
                        {upcomingEvents.length > 5 && (
                          <div className="p-2 text-center">
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                              Voir tous les événements ({upcomingEvents.length})
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tasks */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-amber-600 px-4 py-3 text-white flex justify-between items-center">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CheckIcon className="h-5 w-5" />
                      Tâches 
                    </h3>
                    <div className="flex gap-1">
                      <span className="text-sm bg-white/20 rounded-full px-2 h-6 inline-flex items-center justify-center" title="En cours">
                        {upcomingTasks.filter(t => t.status === "in_progress").length}
                      </span>
                      <span className="text-sm bg-red-500/80 rounded-full px-2 h-6 inline-flex items-center justify-center" title="En retard">
                        {overdueTasks.length}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 max-h-[300px] overflow-y-auto">
                    {overdueTasks.length > 0 && (
                      <div className="mb-2">
                        <h4 className="text-xs font-semibold text-red-600 px-2 py-1 bg-red-50 rounded-md flex items-center gap-1">
                          <ExclamationCircleIcon className="h-4 w-4" />
                          Tâches en retard
                        </h4>
                        <div className="divide-y divide-gray-100 mt-1">
                          {overdueTasks.slice(0, 3).map((task) => (
                            <div 
                              key={task.id} 
                              className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                            >
                              <div className="flex items-start gap-2">
                                <div className="pt-0.5">
                                  <input 
                                    type="checkbox" 
                                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {task.title}
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <div className="text-xs text-red-600 flex items-center gap-1">
                                      <ClockIcon className="h-3.5 w-3.5" />
                                      {formatDate(new Date(task.due_date), 'short')}
                                    </div>
                                    <div className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                      {getPriorityLabel(task.priority)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {overdueTasks.length > 3 && (
                            <div className="px-2 py-1 text-center text-xs text-red-600">
                              +{overdueTasks.length - 3} autres tâches en retard
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-xs font-semibold text-gray-600 px-2 py-1 bg-gray-50 rounded-md">
                        Tâches à venir
                      </h4>
                      <div className="divide-y divide-gray-100 mt-1">
                        {upcomingTasks.length === 0 ? (
                          <div className="text-center py-2 text-gray-500 text-xs">
                            Aucune tâche à venir
                          </div>
                        ) : (
                          upcomingTasks.slice(0, 5).map((task) => (
                            <div 
                              key={task.id} 
                              className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                            >
                              <div className="flex items-start gap-2">
                                <div className="pt-0.5">
                                  <input 
                                    type="checkbox" 
                                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {task.title}
                                  </div>
                                  <div className="flex items-center flex-wrap gap-2 mt-0.5">
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                      <ClockIcon className="h-3.5 w-3.5" />
                                      {formatDate(new Date(task.due_date), 'short')}
                                    </div>
                                    <div className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                      {getPriorityLabel(task.priority)}
                                    </div>
                                    {task.status === "in_progress" && (
                                      <div className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        En cours
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {task.related_event && (
                                  <button className="text-gray-400 hover:text-gray-600" title="Voir l'événement associé">
                                    <LinkIcon className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-2 flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {upcomingTasks.length + overdueTasks.length} tâches au total
                    </span>
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      Gérer les tâches
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Calendar/Events Area */}
              <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="text-center">
                      <ArrowPathIcon className="h-10 w-10 text-[#213f5b] animate-spin mx-auto mb-4" />
                      <p className="text-gray-600">Chargement des événements...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Month View */}
                    {viewType === 'month' && (
                      <div className="h-full flex flex-col">
                        {/* Weekday Headers */}
                        <div className="grid grid-cols-7 border-b text-center py-2 bg-gray-50">
                          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                            <div key={day} className="text-sm font-medium text-gray-600">
                              {day}
                            </div>
                          ))}
                        </div>
                        
                        {/* Calendar Grid */}
                        <div className="flex-1 grid grid-cols-7 grid-rows-6 auto-rows-fr">
                          {calendarDates.map((date, index) => {
                            const dayEvents = getEventsForDate(date);
                            const isCurrentDay = isToday(date);
                            const inCurrentMonth = isCurrentMonth(date);
                            
                            return (
                              <div 
                                key={index} 
                                className={`border-b border-r min-h-[100px] p-1 ${
                                  inCurrentMonth ? '' : 'bg-gray-50'
                                } ${isCurrentDay ? 'bg-blue-50' : ''}`}
                              >
                                <div className="flex justify-between items-center p-1">
                                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-sm ${
                                    isCurrentDay 
                                      ? 'bg-blue-600 text-white' 
                                      : inCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                                  }`}>
                                    {date.getDate()}
                                  </span>
                                  {dayEvents.length > 0 && (
                                    <span className="text-xs text-gray-500">
                                      {dayEvents.length} evt
                                    </span>
                                  )}
                                </div>
                                
                                {/* Display events (limited to first 3) */}
                                <div className="mt-1 space-y-1 overflow-hidden max-h-[calc(100%-2rem)]">
                                  {dayEvents.slice(0, 3).map((event) => (
                                    <div 
                                      key={event.id} 
                                      className={`px-2 py-1 rounded text-xs truncate cursor-pointer ${getCategoryColor(event.category)}`}
                                      onClick={() => handleEventClick(event)}
                                    >
                                      {event.all_day ? '● ' : `${formatTime(event.start_time)} `}
                                      {truncateText(event.title, 20)}
                                    </div>
                                  ))}
                                  {dayEvents.length > 3 && (
                                    <div className="px-2 py-0.5 text-xs text-gray-500 text-center">
                                      +{dayEvents.length - 3} plus
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Week View */}
                    {viewType === 'week' && (
                      <div className="h-full flex flex-col">
                        {/* Day Headers */}
                        <div className="grid grid-cols-7 border-b">
                          {calendarDates.map((date, index) => (
                            <div 
                              key={index} 
                              className={`p-2 text-center ${isToday(date) ? 'bg-blue-50' : ''}`}
                            >
                              <div className="text-sm font-medium">
                                {formatDate(date, 'weekday')}
                              </div>
                              <div className={`text-lg font-bold mx-auto w-10 h-10 flex items-center justify-center rounded-full ${
                                isToday(date) ? 'bg-blue-600 text-white' : 'text-gray-900'
                              }`}>
                                {date.getDate()}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* All-day Events */}
                        <div className="border-b py-1">
                          <div className="px-2 pt-1 pb-2">
                            <h3 className="text-xs font-medium text-gray-500 mb-1">Toute la journée</h3>
                            <div className="grid grid-cols-7 gap-1">
                              {calendarDates.map((date, dateIndex) => {
                                const allDayEvents = getAllDayEvents(date);
                                return (
                                  <div key={dateIndex} className="min-h-[30px]">
                                    {allDayEvents.slice(0, 2).map((event, eventIndex) => (
                                      <div 
                                        key={`${event.id}-${eventIndex}`} 
                                        className={`px-2 py-1 mb-1 rounded text-xs truncate cursor-pointer ${getCategoryColor(event.category)}`}
                                        onClick={() => handleEventClick(event)}
                                      >
                                        {truncateText(event.title, 15)}
                                      </div>
                                    ))}
                                    {allDayEvents.length > 2 && (
                                      <div className="text-xs text-center text-gray-500">
                                        +{allDayEvents.length - 2}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        
                        {/* Time-based Events */}
                        <div className="flex-1 overflow-y-auto">
                          <div className="grid grid-cols-7 divide-x">
                            {calendarDates.map((date, dateIndex) => (
                              <div key={dateIndex} className="relative min-h-[800px]">
                                {/* Time labels on the first column only */}
                                {dateIndex === 0 && generateTimeSlots().map((slot, slotIndex) => (
                                  <div 
                                    key={slotIndex} 
                                    className="absolute w-full border-t text-xs text-gray-500 px-1"
                                    style={{ top: `${slotIndex * 30}px` }}
                                  >
                                    {slot}
                                  </div>
                                ))}
                                
                                {/* Events */}
                                {filteredEvents
                                  .filter(event => {
                                    if (event.all_day) return false; // All-day events are shown separately
                                    
                                    const eventDate = new Date(event.start_time);
                                    return (
                                      eventDate.getDate() === date.getDate() &&
                                      eventDate.getMonth() === date.getMonth() &&
                                      eventDate.getFullYear() === date.getFullYear()
                                    );
                                  })
                                  .map((event) => {
                                    const startTime = new Date(event.start_time);
                                    const endTime = new Date(event.end_time);
                                    
                                    // Calculate position and height
                                    const startHours = startTime.getHours() + startTime.getMinutes() / 60;
                                    const endHours = endTime.getHours() + endTime.getMinutes() / 60;
                                    const durationHours = endHours - startHours;
                                    
                                    const top = Math.max(0, (startHours - 7) * 60); // 7 AM is our start time
                                    const height = durationHours * 60;
                                    
                                    return (
                                      <div 
                                        key={event.id} 
                                        className={`absolute left-0 right-0 mx-1 rounded px-2 py-1 overflow-hidden cursor-pointer ${getCategoryColor(event.category)}`}
                                        style={{ 
                                          top: `${top}px`, 
                                          height: `${height}px`,
                                          minHeight: '25px'
                                        }}
                                        onClick={() => handleEventClick(event)}
                                      >
                                        <div className="text-xs font-medium truncate">
                                          {event.title}
                                        </div>
                                        <div className="text-xs opacity-80 truncate">
                                          {formatTime(event.start_time)} - {formatTime(event.end_time)}
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Day View */}
                    {viewType === 'day' && (
                      <div className="h-full flex flex-col">
                        {/* Day Header */}
                        <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold ${
                              isToday(selectedDate) ? 'bg-blue-600 text-white' : 'text-gray-900'
                            }`}>
                              {selectedDate.getDate()}
                            </span>
                            <div>
                              <div className="text-sm font-medium">
                                {formatDate(selectedDate, 'weekday')}
                              </div>
                              <div className="text-xs text-gray-500">
                                {selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            {getEventsForDate(selectedDate).length} événements
                          </div>
                        </div>
                        
                        {/* All-day Events */}
                        <div className="border-b py-1">
                          <div className="px-3 pt-2 pb-2">
                            <h3 className="text-xs font-medium text-gray-500 mb-1">Toute la journée</h3>
                            <div className="space-y-1">
                              {getAllDayEvents(selectedDate).map((event) => (
                                <div 
                                  key={event.id} 
                                  className={`px-3 py-1.5 rounded text-sm cursor-pointer ${getCategoryColor(event.category)}`}
                                  onClick={() => handleEventClick(event)}
                                >
                                  <div className="font-medium">
                                    {event.title}
                                  </div>
                                  {event.location?.name && (
                                    <div className="text-xs opacity-80 flex items-center gap-1 mt-1">
                                      <MapPinIcon className="h-3.5 w-3.5" />
                                      {event.location.name}
                                    </div>
                                  )}
                                </div>
                              ))}
                              {getAllDayEvents(selectedDate).length === 0 && (
                                <div className="text-center text-sm text-gray-500 py-1">
                                  Aucun événement toute la journée
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Time-based Events */}
                        <div className="flex-1 overflow-y-auto p-2">
                          <div className="relative min-h-[800px]">
                            {/* Time slots */}
                            {generateTimeSlots().map((slot, index) => {
                              const [hour, minute] = slot.split(':').map(Number);
                              const events = getEventsForTimeSlot(selectedDate, slot);
                              
                              return (
                                <div 
                                  key={index} 
                                  className={`flex border-t relative h-[30px] ${minute === 0 ? 'bg-gray-50' : ''}`}
                                >
                                  {/* Time label */}
                                  <div className="w-20 flex-shrink-0 text-right pr-2 text-xs text-gray-500">
                                    {minute === 0 && `${hour}:00`}
                                  </div>
                                  
                                  {/* Event container */}
                                  <div className="flex-1 relative">
                                    {events.map((event) => {
                                      const startTime = new Date(event.start_time);
                                      const endTime = new Date(event.end_time);
                                      
                                      // Calculate position and height
                                      const eventStartHour = startTime.getHours();
                                      const eventStartMinute = startTime.getMinutes();
                                      const eventEndHour = endTime.getHours();
                                      const eventEndMinute = endTime.getMinutes();
                                      
                                      // Only render if this is the starting time slot
                                      if (eventStartHour === hour && Math.floor(eventStartMinute / 30) * 30 === minute) {
                                        // Calculate duration in minutes
                                        const durationMinutes = 
                                          (eventEndHour - eventStartHour) * 60 + 
                                          (eventEndMinute - eventStartMinute);
                                        
                                        // Convert to height (1 minute = 1px, approximately)
                                        const height = Math.max(25, durationMinutes / 2); // minimum height of 25px
                                        
                                        return (
                                          <div 
                                            key={event.id} 
                                            className={`absolute left-0 right-0 rounded px-2 py-1 overflow-hidden cursor-pointer ${getCategoryColor(event.category)}`}
                                            style={{ 
                                              height: `${height}px`, 
                                              zIndex: 10
                                            }}
                                            onClick={() => handleEventClick(event)}
                                          >
                                            <div className="text-sm font-medium truncate">
                                              {event.title}
                                            </div>
                                            <div className="text-xs opacity-80 truncate">
                                              {formatTime(event.start_time)} - {formatTime(event.end_time)}
                                            </div>
                                            {height > 50 && event.location?.name && (
                                              <div className="text-xs opacity-80 flex items-center gap-1 mt-1">
                                                <MapPinIcon className="h-3 w-3" />
                                                {event.location.name}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      }
                                      return null;
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Agenda View (List View) */}
                    {viewType === 'agenda' && (
                      <div className="h-full flex flex-col">
                        <div className="border-b bg-gray-50 py-2 px-4">
                          <h3 className="text-lg font-semibold text-gray-800">Tous les événements</h3>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-3">
                          {filteredEvents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                              <CalendarIcon className="h-12 w-12 text-gray-300 mb-2" />
                              <p>Aucun événement ne correspond à vos critères</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {/* Group events by date */}
                              {(() => {
                                // Create a map of date -> events
                                const eventsByDate = filteredEvents.reduce((acc, event) => {
                                  const date = new Date(event.start_time).toLocaleDateString('fr-FR');
                                  if (!acc[date]) acc[date] = [];
                                  acc[date].push(event);
                                  return acc;
                                }, {} as Record<string, Event[]>);
                                
                                // Sort dates
                                const sortedDates = Object.keys(eventsByDate).sort((a, b) => {
                                  const dateA = new Date(a.split('/').reverse().join('-'));
                                  const dateB = new Date(b.split('/').reverse().join('-'));
                                  return dateA.getTime() - dateB.getTime();
                                });
                                
                                return sortedDates.map(date => {
                                  const events = eventsByDate[date];
                                  const dateObj = new Date(date.split('/').reverse().join('-'));
                                  
                                  return (
                                    <div key={date}>
                                      <div className="sticky top-0 bg-white z-10 pb-2">
                                        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-1 mb-2">
                                          <CalendarIcon className="h-4 w-4" />
                                          {formatDate(dateObj, 'full')}
                                          {isToday(dateObj) && (
                                            <span className="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                                              Aujourd&apos;hui
                                            </span>
                                          )}
                                        </h4>
                                      </div>
                                      
                                      <div className="space-y-3 pl-1">
                                        {events
                                          .sort((a, b) => {
                                            const timeA = new Date(a.start_time).getTime();
                                            const timeB = new Date(b.start_time).getTime();
                                            return timeA - timeB;
                                          })
                                          .map(event => (
                                            <motion.div 
                                              key={event.id} 
                                              className="bg-white rounded-lg shadow-sm border hover:shadow transition-shadow cursor-pointer"
                                              onClick={() => handleEventClick(event)}
                                              whileHover={{ y: -2 }}
                                            >
                                              <div className="p-3">
                                                <div className="flex justify-between items-start">
                                                  <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-full ${getCategoryColor(event.category).split(' ')[0]}`}>
                                                      {getCategoryIcon(event.category)}
                                                    </div>
                                                    <div>
                                                      <h5 className="text-base font-medium text-gray-900">
                                                        {event.title}
                                                      </h5>
                                                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                        <ClockIcon className="h-4 w-4" />
                                                        {event.all_day ? (
                                                          "Toute la journée"
                                                        ) : (
                                                          `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="flex flex-col items-end gap-2">
                                                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                                                      {getPriorityLabel(event.priority)}
                                                    </div>
                                                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                                                      {event.status === "scheduled" ? "Planifié" : 
                                                       event.status === "completed" ? "Terminé" :
                                                       event.status === "cancelled" ? "Annulé" : "En cours"}
                                                    </div>
                                                  </div>
                                                </div>
                                                
                                                {event.location?.name && (
                                                  <div className="text-sm text-gray-500 flex items-center gap-1 mt-2">
                                                    <MapPinIcon className="h-4 w-4" />
                                                    <span>{event.location.name}</span>
                                                    {event.location.virtual && (
                                                      <span className="ml-1 text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                                                        Virtuel
                                                      </span>
                                                    )}
                                                  </div>
                                                )}
                                                
                                                {event.participants.length > 0 && (
                                                  <div className="flex items-center gap-1 mt-3">
                                                    <div className="flex -space-x-2">
                                                      {event.participants.slice(0, 3).map((participant) => (
                                                        <div 
                                                          key={participant.id} 
                                                          className="relative"
                                                          title={participant.name}
                                                        >
                                                          {participant.avatar_url ? (
                                                            <img 
                                                              src={participant.avatar_url} 
                                                              alt={participant.name} 
                                                              className="w-7 h-7 rounded-full border-2 border-white"
                                                            />
                                                          ) : (
                                                            <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                                                              <UserIcon className="h-4 w-4text-gray-500" />
                                                            </div>
                                                          )}
                                                        </div>
                                                      ))}
                                                      {event.participants.length > 3 && (
                                                        <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600 font-medium">
                                                          +{event.participants.length - 3}
                                                        </div>
                                                      )}
                                                    </div>
                                                    <span className="text-xs text-gray-500 ml-2">
                                                      {event.participants.length} participant{event.participants.length > 1 ? 's' : ''}
                                                    </span>
                                                  </div>
                                                )}
                                                
                                                {event.related_documents && event.related_documents.length > 0 && (
                                                  <div className="mt-3 pt-2 border-t">
                                                    <div className="text-xs text-gray-500 mb-1">Documents liés:</div>
                                                    <div className="flex flex-wrap gap-2">
                                                      {event.related_documents.map(doc => (
                                                        <div 
                                                          key={doc.id}
                                                          className="flex items-center gap-1 text-xs bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded border cursor-pointer"
                                                        >
                                                          <DocumentTextIcon className="h-3.5 w-3.5 text-blue-500" />
                                                          <span className="truncate max-w-[150px]">{doc.title}</span>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            </motion.div>
                                          ))}
                                      </div>
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {showEventModal && selectedEvent && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEventModal(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {/* Header with color based on category */}
                <div className={`p-6 ${getCategoryColor(selectedEvent.category).split(' ')[0]}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-white/90">
                        {getCategoryIcon(selectedEvent.category)}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {selectedEvent.title}
                        </h2>
                        <div className="flex items-center gap-3 mt-1">
                          <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedEvent.status)}`}>
                            {selectedEvent.status === "scheduled" ? "Planifié" : 
                             selectedEvent.status === "completed" ? "Terminé" :
                             selectedEvent.status === "cancelled" ? "Annulé" : "En cours"}
                          </div>
                          <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedEvent.priority)}`}>
                            Priorité: {getPriorityLabel(selectedEvent.priority)}
                          </div>
                          <div className="text-sm text-gray-700">
                            {getCategoryLabel(selectedEvent.category)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowEventModal(false)}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-white/50"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                
                {/* Body content */}
                <div className="p-6 space-y-6">
                  {/* Date and Time */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
                      <CalendarIcon className="h-5 w-5 text-gray-500" />
                      Date et heure
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Début:</div>
                        <div className="text-base font-medium">
                          {formatDate(new Date(selectedEvent.start_time), 'full')}
                          {!selectedEvent.all_day && (
                            <span className="ml-2">{formatTime(selectedEvent.start_time)}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Fin:</div>
                        <div className="text-base font-medium">
                          {formatDate(new Date(selectedEvent.end_time), 'full')}
                          {!selectedEvent.all_day && (
                            <span className="ml-2">{formatTime(selectedEvent.end_time)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {selectedEvent.recurrence && (
                      <div className="mt-3 text-sm text-gray-700 flex items-center gap-1">
                        <ArrowPathIcon className="h-4 w-4 text-gray-500" />
                        Récurrent: {selectedEvent.recurrence.includes('WEEKLY') ? 'Toutes les semaines' : 'Récurrent'}
                      </div>
                    )}
                    {selectedEvent.reminder && (
                      <div className="mt-1 text-sm text-gray-700 flex items-center gap-1">
                        <BellAlertIcon className="h-4 w-4 text-gray-500" />
                        Rappel: {selectedEvent.reminder / 60 >= 24 
                          ? `${selectedEvent.reminder / 60 / 24} jour(s) avant` 
                          : selectedEvent.reminder / 60 >= 1 
                            ? `${selectedEvent.reminder / 60} heure(s) avant` 
                            : `${selectedEvent.reminder} minutes avant`}
                      </div>
                    )}
                  </div>
                  
                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <InformationCircleIcon className="h-5 w-5 text-gray-500" />
                      Description
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-line">
                      {selectedEvent.description || "Aucune description fournie."}
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <MapPinIcon className="h-5 w-5 text-gray-500" />
                      Lieu
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-base font-medium text-gray-900">
                            {selectedEvent.location.name}
                          </div>
                          {selectedEvent.location.address && (
                            <div className="text-sm text-gray-700 mt-1">
                              {selectedEvent.location.address}
                            </div>
                          )}
                          {selectedEvent.location.virtual && (
                            <div className="flex items-center gap-1 mt-2">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                Réunion virtuelle
                              </span>
                              {selectedEvent.location.link && (
                                <a 
                                  href={selectedEvent.location.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                  <LinkIcon className="h-4 w-4" />
                                  Lien de connexion
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {!selectedEvent.location.virtual && (
                          <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                            Voir sur la carte
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Participants */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <UserGroupIcon className="h-5 w-5 text-gray-500" />
                      Participants ({selectedEvent.participants.length})
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="grid sm:grid-cols-2 gap-3">
                        {selectedEvent.participants.map(participant => (
                          <div 
                            key={participant.id} 
                            className="flex items-center gap-3 p-2 rounded border border-gray-200 bg-white"
                          >
                            {participant.avatar_url ? (
                              <img 
                                src={participant.avatar_url} 
                                alt={participant.name} 
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <UserIcon className="h-5 w-5 text-gray-500" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {participant.name}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-2">
                                <span>{participant.email}</span>
                                <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                                <span>{participant.role}</span>
                              </div>
                            </div>
                            <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              participant.type === "client" ? "bg-green-100 text-green-800" :
                              participant.type === "admin" ? "bg-red-100 text-red-800" :
                              participant.type === "internal" ? "bg-blue-100 text-blue-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {participant.type === "client" ? "Client" :
                               participant.type === "admin" ? "Admin" :
                               participant.type === "internal" ? "Interne" : "Externe"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Related Documents */}
                  {selectedEvent.related_documents && selectedEvent.related_documents.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <DocumentTextIcon className="h-5 w-5 text-gray-500" />
                        Documents associés
                      </h3>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="grid sm:grid-cols-2 gap-3">
                          {selectedEvent.related_documents.map(doc => (
                            <div 
                              key={doc.id} 
                              className="flex items-center gap-3 p-3 rounded border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors"
                            >
                              <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {doc.title}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {doc.type}
                                </div>
                              </div>
                              <button className="text-gray-400 hover:text-gray-600">
                                <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Notes */}
                  {selectedEvent.notes && selectedEvent.notes.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-500" />
                        Notes
                      </h3>
                      <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                        {selectedEvent.notes.map(note => (
                          <div 
                            key={note.id} 
                            className="p-3 rounded border border-gray-200 bg-white"
                          >
                            <div className="text-sm text-gray-700 whitespace-pre-line">
                              {note.content}
                            </div>
                            <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                              <span>Ajouté par {note.author}</span>
                              <span>{formatDate(new Date(note.created_at), 'short')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Footer with actions */}
                <div className="border-t p-4 bg-gray-50 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Créé le {formatDate(new Date(selectedEvent.created_at), 'short')}
                    {selectedEvent.created_at !== selectedEvent.updated_at && (
                      <span className="ml-2">
                        • Mis à jour le {formatDate(new Date(selectedEvent.updated_at), 'short')}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                      onClick={() => setShowEventModal(false)}
                    >
                      <XMarkIcon className="h-4 w-4" />
                      Fermer
                    </button>
                    <button className="px-3 py-1.5 border border-blue-600 bg-blue-600 rounded text-sm text-white hover:bg-blue-700 flex items-center gap-1">
                      <PencilIcon className="h-4 w-4" />
                      Modifier
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Event Modal */}
      <AnimatePresence>
        {showNewEventModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewEventModal(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#213f5b]">
                    Nouvel événement
                  </h2>
                  <button
                    onClick={() => setShowNewEventModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre
                    </label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                      placeholder="Titre de l'événement"
                    />
                  </div>

                  {/* Type and Priority */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type d&apos;événement
                      </label>
                      <select
                        value={newEvent.category}
                        onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as EventCategory })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                      >
                        <option value="meeting_client">Réunion Client</option>
                        <option value="meeting_admin">Réunion Interne</option>
                        <option value="site_visit">Visite de Site</option>
                        <option value="deadline">Échéance</option>
                        <option value="installation">Installation</option>
                        <option value="training">Formation</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priorité
                      </label>
                      <select
                        value={newEvent.priority}
                        onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value as EventPriority })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                      >
                        <option value="low">Basse</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Élevée</option>
                        <option value="urgent">Urgente</option>
                      </select>
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Date et heure
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="all_day"
                          checked={newEvent.all_day}
                          onChange={(e) => setNewEvent({ ...newEvent, all_day: e.target.checked })}
                          className="h-4 w-4 text-[#213f5b] focus:ring-[#213f5b] border-gray-300 rounded"
                        />
                        <label htmlFor="all_day" className="text-sm text-gray-600">
                          Toute la journée
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Début
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={newEvent.start_time ? new Date(newEvent.start_time).toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                              const date = e.target.value;
                              const time = newEvent.start_time 
                                ? new Date(newEvent.start_time).toISOString().split('T')[1] 
                                : '10:00:00.000Z';
                              setNewEvent({ ...newEvent, start_time: `${date}T${time}` });
                            }}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                          />
                          {!newEvent.all_day && (
                            <input
                              type="time"
                              value={newEvent.start_time ? new Date(newEvent.start_time).toTimeString().slice(0, 5) : ''}
                              onChange={(e) => {
                                const time = e.target.value + ':00';
                                const date = newEvent.start_time 
                                  ? new Date(newEvent.start_time).toISOString().split('T')[0] 
                                  : new Date().toISOString().split('T')[0];
                                setNewEvent({ ...newEvent, start_time: `${date}T${time}.000Z` });
                              }}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Fin
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={newEvent.end_time ? new Date(newEvent.end_time).toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                              const date = e.target.value;
                              const time = newEvent.end_time 
                                ? new Date(newEvent.end_time).toISOString().split('T')[1] 
                                : '11:00:00.000Z';
                              setNewEvent({ ...newEvent, end_time: `${date}T${time}` });
                            }}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                          />
                          {!newEvent.all_day && (
                            <input
                              type="time"
                              value={newEvent.end_time ? new Date(newEvent.end_time).toTimeString().slice(0, 5) : ''}
                              onChange={(e) => {
                                const time = e.target.value + ':00';
                                const date = newEvent.end_time 
                                  ? new Date(newEvent.end_time).toISOString().split('T')[0] 
                                  : new Date().toISOString().split('T')[0];
                                setNewEvent({ ...newEvent, end_time: `${date}T${time}.000Z` });
                              }}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                      placeholder="Description de l'événement"
                    ></textarea>
                  </div>

                  {/* Location */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Lieu
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="virtual"
                          checked={newEvent.location?.virtual}
                          onChange={(e) => setNewEvent({ 
                            ...newEvent, 
                            location: { 
                              ...newEvent.location,
                              // virtual: e.target.checked 
                              name: e.target.value
                            } 
                          })}
                          className="h-4 w-4 text-[#213f5b] focus:ring-[#213f5b] border-gray-300 rounded"
                        />
                        <label htmlFor="virtual" className="text-sm text-gray-600">
                          Réunion virtuelle
                        </label>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={newEvent.location?.name || ''}
                      onChange={(e) => setNewEvent({ 
                        ...newEvent, 
                        location: { 
                          ...newEvent.location,
                          name: e.target.value 
                        } 
                      })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                      placeholder={newEvent.location?.virtual ? "Nom de la réunion virtuelle" : "Adresse ou lieu"}
                    />
                    {newEvent.location?.virtual && (
                      <input
                        type="text"
                        value={newEvent.location?.link || ''}
                        onChange={(e) => setNewEvent({ 
                          ...newEvent, 
                          location: { 
                            ...newEvent.location,
                            name: e.target.value
                          } 
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm mt-2"
                        placeholder="Lien de la réunion (optionnel)"
                      />
                    )}
                  </div>

                  {/* Participants */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Participants
                    </label>
                    <select
                      multiple
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm h-32"
                    >
                      <optgroup label="Internes">
                        {users.filter(user => user.role !== "Admin").map(user => (
                          <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName} - {user.role}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Administration">
                        {users.filter(user => user.role === "Admin").map(user => (
                          <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName} - {user.role}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Maintenez Ctrl (PC) ou Cmd (Mac) pour sélectionner plusieurs participants
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNewEventModal(false)}
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-[#213f5b] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#213f5b]/90"
                  >
                    Créer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
