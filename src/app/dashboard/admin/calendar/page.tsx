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
  CheckIcon,
  ArrowPathIcon,
  ListBulletIcon,
  ArrowTopRightOnSquareIcon,
  UserIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  BellAlertIcon,
  ArrowLongRightIcon,
  InformationCircleIcon,
  CubeIcon,
  PencilIcon,
  LinkIcon,
  ShieldCheckIcon,
  WrenchIcon,
  PhoneIcon,
  ClipboardDocumentCheckIcon,
  ExclamationTriangleIcon,
  ReceiptRefundIcon,
  TruckIcon,
  BeakerIcon,
  CurrencyEuroIcon,
  // BuildingOfficeIcon,
  ChartBarIcon,
  BoltIcon,
  FolderIcon,
  ServerIcon,
} from "@heroicons/react/24/outline";

/** ---------------------
 *    TYPE DEFINITIONS
 *  --------------------- */
type EventCategory = 
  | "installation" 
  | "sav"
  | "maintenance" 
  | "claim"
  | "meeting_client"
  | "meeting_admin"
  | "site_visit"
  | "training"
  | "support"
  | "intervention"
  | "quality_control"
  | "remote_monitoring"
  | "billing"
  | "system_update"
  | "warranty"
  | "other";

type EventStatus = 
  | "scheduled" 
  | "completed" 
  | "cancelled" 
  | "in_progress"
  | "pending"
  | "delayed"
  | "on_hold"
  | "reopened";

type EventPriority = "low" | "medium" | "high" | "urgent" | "critical";
type ViewType = "month" | "week" | "day" | "agenda" | "kanban";

interface EventParticipant {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: string;
  type: "internal" | "client" | "admin" | "external" | "technician";
  confirmed: boolean;
}

interface EventLocation {
  name: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  site_id?: string;
  site_type?: string;
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
  type?: "internal" | "client" | "system";
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  serial_number?: string;
  installation_date?: string;
  warranty_end_date?: string;
  status: "operational" | "maintenance_needed" | "failure" | "end_of_life";
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
  equipment?: Equipment[];
  reference_number?: string;
  client_id?: string;
  client_name?: string;
  reminder?: number; // minutes before event
  color?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  resolution_time?: number; // minutes to resolve
  intervention_type?: "onsite" | "remote" | "phone";
  sla_breach?: boolean;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  priority: EventPriority;
  status: "not_started" | "in_progress" | "completed" | "blocked" | "waiting";
  assignee: string;
  related_event?: string;
  related_documents?: Document[];
  created_at: string;
  updated_at: string;
  tags?: string[];
  client_id?: string;
  equipment_id?: string;
}

interface User {
  company: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar_url?: string;
  role: string;
  department?: string;
  specialization?: string[];
}

/** ---------------------
 *     MAIN COMPONENT
 *  --------------------- */
export default function AdminAgendaPage() {
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
    category: "sav",
    status: "scheduled",
    priority: "medium",
    all_day: false,
    location: { name: "", virtual: false },
    participants: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<EventCategory | "all">("all");
  const [filterPriority, setFilterPriority] = useState<EventPriority | "all">("all");
  const [filterStatus, setFilterStatus] = useState<EventStatus | "all">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [, setUserInfo] = useState<{ _id: string; email: string } | null>(null);
  const [statsVisible, setStatsVisible] = useState(true);

  // Sample statistics
  const statistics = {
    pendingInstallations: 8,
    openServiceCalls: 12,
    scheduledMaintenance: 5,
    unresolvedClaims: 3,
    waitingForParts: 2,
    overdueInterventions: 4,
    todayInterventions: 7,
    totalScheduled: 37,
    reminders: 5,        // Add this new property
    appointments: 9      // Add this new property
  };

  {/* Helper function to calculate current time position */}
const getCurrentTimePosition = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // Convert to position in time slots array (2 slots per hour)
  return Math.max(0, (hours - 7) * 2 + Math.floor(minutes / 30));
};

  // Sample admin staff data
  const sampleStaff: User[] = [
    {
      id: "admin001",
      firstName: "Marie",
      lastName: "Legrand",
      email: "m.legrand@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/women/23.jpg",
      role: "Directrice",
      department: "Direction",
      company: "undefined"
    },
    {
      id: "admin002",
      firstName: "Philippe",
      lastName: "Dupont",
      email: "p.dupont@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/men/54.jpg",
      role: "Responsable Technique",
      department: "Technique",
      company: "undefined"
    },
    {
      id: "tech001",
      firstName: "Lucas",
      lastName: "Martin",
      email: "l.martin@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/men/43.jpg",
      role: "Technicien",
      department: "SAV",
      specialization: ["Panneaux solaires", "Batterie"],
      company: "undefined"
    },
    {
      id: "tech002",
      firstName: "Emma",
      lastName: "Bernard",
      email: "e.bernard@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/women/33.jpg",
      role: "Technicienne",
      department: "SAV",
      specialization: ["Bornes de recharge", "Systèmes éoliens"],
      company: "undefined"
    },
    {
      id: "tech003",
      firstName: "Thomas",
      lastName: "Petit",
      email: "t.petit@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/men/22.jpg",
      role: "Technicien",
      department: "Installation",
      specialization: ["Panneaux solaires", "Systèmes de monitoring"],
      company: "undefined"
    },
    {
      id: "support001",
      firstName: "Léa",
      lastName: "Rousseau",
      email: "l.rousseau@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
      role: "Support Technique",
      department: "Support",
      company: "undefined"
    },
    {
      id: "qa001",
      firstName: "Pierre",
      lastName: "Moreau",
      email: "p.moreau@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/men/67.jpg",
      role: "Contrôleur Qualité",
      department: "Qualité",
      company: "undefined"
    }
  ];

  // Sample client data
  const sampleClients: User[] = [
    {
      id: "client001",
      firstName: "Marie",
      lastName: "Dupont",
      email: "marie.dupont@montpellier.fr",
      avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
      role: "Directrice des services techniques",
      company: "undefined"
    },
    {
      id: "client002",
      firstName: "Jean",
      lastName: "Moreau",
      email: "j.moreau@habitat-eco.fr",
      avatar_url: "https://randomuser.me/api/portraits/men/22.jpg",
      role: "Responsable technique",
      company: "undefined"
    },
    {
      id: "client003",
      firstName: "Sarah",
      lastName: "Berger",
      email: "s.berger@greentech-innov.com",
      avatar_url: "https://randomuser.me/api/portraits/women/33.jpg",
      role: "Directrice R&D",
      company: "undefined"
    }
  ];

  // Sample admin events data - focused on SAV, installations, etc.
  const sampleAdminEvents: Event[] = [
    {
      id: "event001",
      title: "SAV - Défaut système monitoring - Mairie de Montpellier",
      description: "Intervention suite signalement de dysfonctionnement du système de monitoring pour les panneaux solaires. Le client ne reçoit plus les données de production depuis 48h.",
      start_time: "2025-03-18T09:00:00Z",
      end_time: "2025-03-18T11:00:00Z",
      category: "sav",
      status: "scheduled",
      priority: "high",
      all_day: false,
      reference_number: "SAV-2025-0142",
      client_id: "client001",
      client_name: "Mairie de Montpellier",
      location: {
        name: "École Jean Jaurès",
        address: "123 Avenue de la Liberté, 34000 Montpellier",
        site_id: "SITE-MPL-023",
        site_type: "Bâtiment public",
        virtual: false
      },
      participants: [
        {
          id: "tech001",
          name: "Lucas Martin",
          email: "l.martin@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/43.jpg",
          role: "Technicien",
          type: "technician",
          confirmed: true
        },
        {
          id: "client001",
          name: "Marie Dupont",
          email: "marie.dupont@montpellier.fr",
          avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
          role: "Directrice des services techniques",
          type: "client",
          confirmed: true
        }
      ],
      equipment: [
        {
          id: "eq001",
          name: "Système de monitoring SolarVision Pro",
          type: "Monitoring",
          serial_number: "SV-45678-B",
          installation_date: "2024-07-15T00:00:00Z",
          warranty_end_date: "2027-07-15T00:00:00Z",
          status: "maintenance_needed"
        },
        {
          id: "eq002",
          name: "Panneau solaire EcoSun 350W (x48)",
          type: "Panneau solaire",
          installation_date: "2024-07-10T00:00:00Z",
          warranty_end_date: "2034-07-10T00:00:00Z",
          status: "operational"
        }
      ],
      related_documents: [
        {
          id: "doc001",
          title: "Rapport d'installation - École Jean Jaurès",
          type: "Rapport"
        },
        {
          id: "doc002",
          title: "Manuel système monitoring SolarVision Pro",
          type: "Documentation"
        },
        {
          id: "doc003",
          title: "Contrat de maintenance - Mairie de Montpellier",
          type: "Contrat"
        }
      ],
      notes: [
        {
          id: "note001",
          content: "Client contacté par téléphone le 17/03. Problème détecté: perte de connexion entre le boitier local et le serveur. Premier diagnostic suggère un problème de carte réseau.",
          created_at: "2025-03-17T15:30:00Z",
          author: "Léa Rousseau",
          type: "internal"
        }
      ],
      intervention_type: "onsite",
      created_by: "support001",
      created_at: "2025-03-17T14:30:00Z",
      updated_at: "2025-03-17T15:30:00Z"
    },
    {
      id: "event002",
      title: "Installation bornes de recharge - Parking Grand Sud",
      description: "Installation de 5 bornes de recharge rapide pour véhicules électriques. Phase 1: préparation du terrain et câblage.",
      start_time: "2025-03-19T08:00:00Z",
      end_time: "2025-03-21T18:00:00Z",
      category: "installation",
      status: "scheduled",
      priority: "medium",
      all_day: true,
      reference_number: "INST-2025-0037",
      client_id: "client002",
      client_name: "Habitat Écologique SARL",
      location: {
        name: "Parking Centre Commercial Grand Sud",
        address: "Route de la Mer, 34970 Lattes",
        site_id: "SITE-LAT-005",
        site_type: "Parking",
        virtual: false
      },
      participants: [
        {
          id: "tech002",
          name: "Emma Bernard",
          email: "e.bernard@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/women/33.jpg",
          role: "Technicienne",
          type: "technician",
          confirmed: true
        },
        {
          id: "tech003",
          name: "Thomas Petit",
          email: "t.petit@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/22.jpg",
          role: "Technicien",
          type: "technician",
          confirmed: true
        },
        {
          id: "client002",
          name: "Jean Moreau",
          email: "j.moreau@habitat-eco.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/22.jpg",
          role: "Responsable technique",
          type: "client",
          confirmed: true
        }
      ],
      equipment: [
        {
          id: "eq010",
          name: "Borne de recharge FastCharge 50kW (x5)",
          type: "Borne de recharge",
          serial_number: "FC-22-501 à FC-22-505",
          status: "operational"
        }
      ],
      related_documents: [
        {
          id: "doc010",
          title: "Plan d'installation - Parking Grand Sud",
          type: "Plan"
        },
        {
          id: "doc011",
          title: "Spécifications techniques - FastCharge 50kW",
          type: "Documentation"
        }
      ],
      intervention_type: "onsite",
      created_by: "admin002",
      created_at: "2025-03-10T09:15:00Z",
      updated_at: "2025-03-10T09:15:00Z"
    },
    {
      id: "event003",
      title: "Maintenance préventive - Système éolien Baillargues",
      description: "Maintenance semestrielle programmée du système éolien. Vérification des pales, contrôle électronique et graissage.",
      start_time: "2025-03-25T08:00:00Z",
      end_time: "2025-03-25T17:00:00Z",
      category: "maintenance",
      status: "scheduled",
      priority: "medium",
      all_day: true,
      reference_number: "MAINT-2025-0089",
      client_id: "client002",
      client_name: "Habitat Écologique SARL",
      location: {
        name: "Parc éolien Les Hauteurs",
        address: "Route de Nîmes, 34670 Baillargues",
        site_id: "SITE-BAI-001",
        site_type: "Parc éolien",
        virtual: false
      },
      participants: [
        {
          id: "tech002",
          name: "Emma Bernard",
          email: "e.bernard@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/women/33.jpg",
          role: "Technicienne",
          type: "technician",
          confirmed: true
        },
        {
          id: "qa001",
          name: "Pierre Moreau",
          email: "p.moreau@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/67.jpg",
          role: "Contrôleur Qualité",
          type: "internal",
          confirmed: true
        }
      ],
      equipment: [
        {
          id: "eq020",
          name: "Éolienne WhisperWind 10kW (x3)",
          type: "Éolienne",
          serial_number: "WW-10K-455, WW-10K-456, WW-10K-457",
          installation_date: "2023-08-10T00:00:00Z",
          warranty_end_date: "2033-08-10T00:00:00Z",
          status: "operational"
        }
      ],
      related_documents: [
        {
          id: "doc020",
          title: "Procédure de maintenance - WhisperWind 10kW",
          type: "Procédure"
        },
        {
          id: "doc021",
          title: "Historique de maintenance - Parc éolien Baillargues",
          type: "Rapport"
        }
      ],
      notes: [
        {
          id: "note020",
          content: "Dernière maintenance effectuée le 20/09/2024. RAS. Pièces d'usure (roulements) à vérifier particulièrement lors de cette intervention.",
          created_at: "2025-03-15T14:30:00Z",
          author: "Emma Bernard",
          type: "internal"
        }
      ],
      intervention_type: "onsite",
      created_by: "admin002",
      created_at: "2025-02-20T11:30:00Z",
      updated_at: "2025-03-15T14:30:00Z"
    },
    {
      id: "event004",
      title: "Réclamation client - Panneaux défectueux GreenTech",
      description: "Traitement de la réclamation concernant 3 panneaux solaires présentant des microfissures. Inspection sur site nécessaire.",
      start_time: "2025-03-18T14:00:00Z",
      end_time: "2025-03-18T16:00:00Z",
      category: "claim",
      status: "scheduled",
      priority: "high",
      all_day: false,
      reference_number: "CLAIM-2025-0012",
      client_id: "client003",
      client_name: "GreenTech Innovations",
      location: {
        name: "Siège GreenTech Innovations",
        address: "45 Rue de l'Innovation, 34000 Montpellier",
        site_id: "SITE-GTI-001",
        site_type: "Bâtiment commercial",
        virtual: false
      },
      participants: [
        {
          id: "qa001",
          name: "Pierre Moreau",
          email: "p.moreau@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/67.jpg",
          role: "Contrôleur Qualité",
          type: "internal",
          confirmed: true
        },
        {
          id: "tech001",
          name: "Lucas Martin",
          email: "l.martin@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/43.jpg",
          role: "Technicien",
          type: "technician",
          confirmed: true
        },
        {
          id: "client003",
          name: "Sarah Berger",
          email: "s.berger@greentech-innov.com",
          avatar_url: "https://randomuser.me/api/portraits/women/33.jpg",
          role: "Directrice R&D",
          type: "client",
          confirmed: true
        }
      ],
      equipment: [
        {
          id: "eq030",
          name: "Panneau solaire EcoSun 400W (x3)",
          type: "Panneau solaire",
          serial_number: "ES400-78541, ES400-78542, ES400-78543",
          installation_date: "2024-11-05T00:00:00Z",
          warranty_end_date: "2034-11-05T00:00:00Z",
          status: "failure"
        }
      ],
      related_documents: [
        {
          id: "doc030",
          title: "Photos des panneaux défectueux",
          type: "Images"
        },
        {
          id: "doc031",
          title: "Rapport d'installation - GreenTech",
          type: "Rapport"
        },
        {
          id: "doc032",
          title: "Garantie EcoSun 400W",
          type: "Garantie"
        }
      ],
      notes: [
        {
          id: "note030",
          content: "Client a signalé une baisse de production d'environ 15% et a constaté des microfissures sur 3 panneaux lors d'une inspection visuelle. Les panneaux sont sous garantie.",
          created_at: "2025-03-16T10:45:00Z",
          author: "Léa Rousseau",
          type: "internal"
        },
        {
          id: "note031",
          content: "Nous avons remarqué une réduction de performance sur plusieurs panneaux installés en novembre 2024. Merci de vérifier s'il s'agit d'un défaut de série.",
          created_at: "2025-03-16T09:30:00Z",
          author: "Sarah Berger",
          type: "client"
        }
      ],
      intervention_type: "onsite",
      created_by: "support001",
      created_at: "2025-03-16T10:00:00Z",
      updated_at: "2025-03-16T10:45:00Z"
    },
    {
      id: "event005",
      title: "Support à distance - Configuration système GreenTech",
      description: "Session de support à distance pour configurer les nouveaux paramètres de sécurité du système de stockage d'énergie.",
      start_time: "2025-03-17T10:00:00Z",
      end_time: "2025-03-17T11:30:00Z",
      category: "support",
      status: "completed",
      priority: "medium",
      all_day: false,
      reference_number: "SUP-2025-0105",
      client_id: "client003",
      client_name: "GreenTech Innovations",
      location: {
        name: "Session à distance",
        virtual: true,
        link: "https://meet.ecologyb.fr/support-105"
      },
      participants: [
        {
          id: "support001",
          name: "Léa Rousseau",
          email: "l.rousseau@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
          role: "Support Technique",
          type: "internal",
          confirmed: true
        },
        {
          id: "client003",
          name: "Sarah Berger",
          email: "s.berger@greentech-innov.com",
          avatar_url: "https://randomuser.me/api/portraits/women/33.jpg",
          role: "Directrice R&D",
          type: "client",
          confirmed: true
        }
      ],
      equipment: [
        {
          id: "eq040",
          name: "Système de stockage PowerBank 50kWh",
          type: "Batterie",
          serial_number: "PB50-2345",
          installation_date: "2024-12-18T00:00:00Z",
          warranty_end_date: "2029-12-18T00:00:00Z",
          status: "operational"
        }
      ],
      related_documents: [
        {
          id: "doc040",
          title: "Guide de configuration - PowerBank",
          type: "Guide"
        }
      ],
      notes: [
        {
          id: "note040",
          content: "Configuration réussie. Mise à jour du firmware effectuée. Client formé sur les nouveaux paramètres de sécurité et la surveillance à distance.",
          created_at: "2025-03-17T11:35:00Z",
          author: "Léa Rousseau",
          type: "internal"
        }
      ],
      intervention_type: "remote",
      resolution_time: 90,
      created_by: "support001",
      created_at: "2025-03-16T14:30:00Z",
      updated_at: "2025-03-17T11:35:00Z"
    },
    {
      id: "event006",
      title: "Contrôle qualité post-installation - École Victor Hugo",
      description: "Contrôle qualité suite à l'installation récente des panneaux photovoltaïques. Vérification des normes de sécurité et performance.",
      start_time: "2025-03-20T09:00:00Z",
      end_time: "2025-03-20T12:00:00Z",
      category: "quality_control",
      status: "scheduled",
      priority: "medium",
      all_day: false,
      reference_number: "QC-2025-0028",
      client_id: "client001",
      client_name: "Mairie de Montpellier",
      location: {
        name: "École Victor Hugo",
        address: "12 Rue des Écoles, 34000 Montpellier",
        site_id: "SITE-MPL-024",
        site_type: "Bâtiment public",
        virtual: false
      },
      participants: [
        {
          id: "qa001",
          name: "Pierre Moreau",
          email: "p.moreau@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/67.jpg",
          role: "Contrôleur Qualité",
          type: "internal",
          confirmed: true
        },
        {
          id: "client001",
          name: "Marie Dupont",
          email: "marie.dupont@montpellier.fr",
          avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
          role: "Directrice des services techniques",
          type: "client",
          confirmed: true
        }
      ],
      equipment: [
        {
          id: "eq050",
          name: "Panneaux solaires EcoSun 350W (x60)",
          type: "Panneau solaire",
          installation_date: "2025-03-05T00:00:00Z",
          warranty_end_date: "2035-03-05T00:00:00Z",
          status: "operational"
        },
        {
          id: "eq051",
          name: "Onduleur SolarMax 20kW",
          type: "Onduleur",
          installation_date: "2025-03-05T00:00:00Z",
          warranty_end_date: "2030-03-05T00:00:00Z",
          status: "operational"
        }
      ],
      related_documents: [
        {
          id: "doc050",
          title: "Rapport d'installation - École Victor Hugo",
          type: "Rapport"
        },
        {
          id: "doc051",
          title: "Checklist contrôle qualité - Installations photovoltaïques",
          type: "Procédure"
        }
      ],
      intervention_type: "onsite",
      created_by: "admin002",
      created_at: "2025-03-07T14:30:00Z",
      updated_at: "2025-03-07T14:30:00Z"
    },
    {
      id: "event007",
      title: "Intervention urgente - Panne onduleur Mairie",
      description: "Intervention suite à une panne complète de l'onduleur principal. Système solaire hors service.",
      start_time: "2025-03-18T13:00:00Z",
      end_time: "2025-03-18T17:00:00Z",
      category: "intervention",
      status: "in_progress",
      priority: "urgent",
      all_day: false,
      reference_number: "URG-2025-0018",
      client_id: "client001",
      client_name: "Mairie de Montpellier",
      location: {
        name: "Hôtel de Ville",
        address: "1 Place Georges Frêche, 34000 Montpellier",
        site_id: "SITE-MPL-001",
        site_type: "Bâtiment public",
        virtual: false
      },
      participants: [
        {
          id: "tech001",
          name: "Lucas Martin",
          email: "l.martin@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/43.jpg",
          role: "Technicien",
          type: "technician",
          confirmed: true
        },
        {
          id: "tech003",
          name: "Thomas Petit",
          email: "t.petit@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/22.jpg",
          role: "Technicien",
          type: "technician",
          confirmed: true
        },
        {
          id: "client001",
          name: "Marie Dupont",
          email: "marie.dupont@montpellier.fr",
          avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
          role: "Directrice des services techniques",
          type: "client",
          confirmed: true
        }
      ],
      equipment: [
        {
          id: "eq060",
          name: "Onduleur SolarMax 50kW",
          type: "Onduleur",
          serial_number: "SM50-12789",
          installation_date: "2023-04-15T00:00:00Z",
          warranty_end_date: "2028-04-15T00:00:00Z",
          status: "failure"
        }
      ],
      related_documents: [
        {
          id: "doc060",
          title: "Schéma électrique - Installation Hôtel de Ville",
          type: "Technique"
        },
        {
          id: "doc061",
          title: "Manuel onduleur SolarMax 50kW",
          type: "Documentation"
        }
      ],
      notes: [
        {
          id: "note060",
          content: "Alerte reçue à 8h30 via système de monitoring. Erreur système critique E-507 sur l'onduleur. Pièces de rechange disponibles dans notre dépôt.",
          created_at: "2025-03-18T08:45:00Z",
          author: "Léa Rousseau",
          type: "internal"
        },
        {
          id: "note061",
          content: "Rappel: client sous contrat maintenance premium. Intervention requise sous 4h.",
          created_at: "2025-03-18T08:50:00Z",
          author: "Philippe Dupont",
          type: "internal"
        }
      ],
      intervention_type: "onsite",
      sla_breach: false,
      created_by: "support001",
      created_at: "2025-03-18T08:45:00Z",
      updated_at: "2025-03-18T09:30:00Z"
    },
    {
      id: "event008",
      title: "Formation système de monitoring - Équipe GreenTech",
      description: "Session de formation sur l'utilisation avancée du système de monitoring pour l'équipe technique du client.",
      start_time: "2025-03-22T09:30:00Z",
      end_time: "2025-03-22T16:30:00Z",
      category: "training",
      status: "scheduled",
      priority: "medium",
      all_day: false,
      reference_number: "TRN-2025-0042",
      client_id: "client003",
      client_name: "GreenTech Innovations",
      location: {
        name: "Centre de formation Ecology'B",
        address: "56 Avenue de l'Europe, 34080 Montpellier",
        virtual: false
      },
      participants: [
        {
          id: "support001",
          name: "Léa Rousseau",
          email: "l.rousseau@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
          role: "Support Technique",
          type: "internal",
          confirmed: true
        },
        {
          id: "client003",
          name: "Sarah Berger",
          email: "s.berger@greentech-innov.com",
          avatar_url: "https://randomuser.me/api/portraits/women/33.jpg",
          role: "Directrice R&D",
          type: "client",
          confirmed: true
        }
      ],
      related_documents: [
        {
          id: "doc070",
          title: "Support de formation - Système de monitoring",
          type: "Formation"
        },
        {
          id: "doc071",
          title: "Exercices pratiques",
          type: "Formation"
        }
      ],
      created_by: "support001",
      created_at: "2025-03-10T11:30:00Z",
      updated_at: "2025-03-10T11:30:00Z"
    },
    {
      id: "event009",
      title: "Mise à jour système à distance - Tous clients",
      description: "Déploiement d'une mise à jour de sécurité critique sur tous les systèmes de monitoring. Intervention planifiée hors heures de bureau.",
      start_time: "2025-03-26T22:00:00Z",
      end_time: "2025-03-27T02:00:00Z",
      category: "system_update",
      status: "scheduled",
      priority: "high",
      all_day: false,
      reference_number: "SYS-2025-0007",
      location: {
        name: "Serveurs Ecology'B",
        virtual: true
      },
      participants: [
        {
          id: "tech001",
          name: "Lucas Martin",
          email: "l.martin@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/43.jpg",
          role: "Technicien",
          type: "technician",
          confirmed: true
        },
        {
          id: "support001",
          name: "Léa Rousseau",
          email: "l.rousseau@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
          role: "Support Technique",
          type: "internal",
          confirmed: true
        }
      ],
      related_documents: [
        {
          id: "doc080",
          title: "Note de version v3.5.2",
          type: "Technique"
        },
        {
          id: "doc081",
          title: "Procédure de rollback en cas d'échec",
          type: "Procédure"
        }
      ],
      notes: [
        {
          id: "note080",
          content: "Email envoyé à tous les clients le 12/03 pour les informer de la maintenance planifiée.",
          created_at: "2025-03-12T15:30:00Z",
          author: "Léa Rousseau",
          type: "internal"
        }
      ],
      intervention_type: "remote",
      created_by: "admin002",
      created_at: "2025-03-05T10:30:00Z",
      updated_at: "2025-03-12T15:30:00Z"
    },
    {
      id: "event010",
      title: "Traitement demande de garantie - Habitat Écologique",
      description: "Analyse de la demande de garantie pour 2 onduleurs présentant des défauts récurrents de surchauffe.",
      start_time: "2025-03-19T10:00:00Z",
      end_time: "2025-03-19T12:00:00Z",
      category: "warranty",
      status: "scheduled",
      priority: "medium",
      all_day: false,
      reference_number: "WAR-2025-0023",
      client_id: "client002",
      client_name: "Habitat Écologique SARL",
      location: {
        name: "Bureau Ecology'B",
        address: "56 Avenue de l'Europe, 34080 Montpellier",
        virtual: false
      },
      participants: [
        {
          id: "qa001",
          name: "Pierre Moreau",
          email: "p.moreau@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/67.jpg",
          role: "Contrôleur Qualité",
          type: "internal",
          confirmed: true
        },
        {
          id: "admin002",
          name: "Philippe Dupont",
          email: "p.dupont@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/54.jpg",
          role: "Responsable Technique",
          type: "admin",
          confirmed: true
        }
      ],
      equipment: [
        {
          id: "eq090",
          name: "Onduleur SolarMax 10kW (x2)",
          type: "Onduleur",
          serial_number: "SM10-34521, SM10-34522",
          installation_date: "2024-06-10T00:00:00Z",
          warranty_end_date: "2029-06-10T00:00:00Z",
          status: "failure"
        }
      ],
      related_documents: [
        {
          id: "doc090",
          title: "Rapport d'intervention - Constat défaut",
          type: "Rapport"
        },
        {
          id: "doc091",
          title: "Garantie onduleurs SolarMax",
          type: "Garantie"
        },
        {
          id: "doc092",
          title: "Historique température onduleurs - Relevés",
          type: "Données"
        }
      ],
      created_by: "qa001",
      created_at: "2025-03-15T16:45:00Z",
      updated_at: "2025-03-15T16:45:00Z"
    },
    {
      id: "event011",
      title: "Réunion hebdomadaire équipe SAV",
      description: "Point hebdomadaire sur les interventions en cours, planning de la semaine et répartition des tâches.",
      start_time: "2025-03-18T08:00:00Z",
      end_time: "2025-03-18T09:00:00Z",
      category: "meeting_admin",
      status: "scheduled",
      priority: "medium",
      all_day: false,
      reference_number: "MTG-2025-0124",
      location: {
        name: "Salle de réunion Ecology'B",
        address: "56 Avenue de l'Europe, 34080 Montpellier",
        virtual: false
      },
      participants: [
        {
          id: "admin002",
          name: "Philippe Dupont",
          email: "p.dupont@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/54.jpg",
          role: "Responsable Technique",
          type: "admin",
          confirmed: true
        },
        {
          id: "tech001",
          name: "Lucas Martin",
          email: "l.martin@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/43.jpg",
          role: "Technicien",
          type: "technician",
          confirmed: true
        },
        {
          id: "tech002",
          name: "Emma Bernard",
          email: "e.bernard@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/women/33.jpg",
          role: "Technicienne",
          type: "technician",
          confirmed: true
        },
        {
          id: "tech003",
          name: "Thomas Petit",
          email: "t.petit@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/22.jpg",
          role: "Technicien",
          type: "technician",
          confirmed: true
        },
        {
          id: "support001",
          name: "Léa Rousseau",
          email: "l.rousseau@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
          role: "Support Technique",
          type: "internal",
          confirmed: true
        }
      ],
      recurrence: "FREQ=WEEKLY;BYDAY=TU",
      related_documents: [
        {
          id: "doc100",
          title: "Planning interventions - Semaine 12",
          type: "Planning"
        }
      ],
      created_by: "admin002",
      created_at: "2025-01-07T15:30:00Z",
      updated_at: "2025-03-11T16:30:00Z"
    },
    {
      id: "event012",
      title: "Inspection facturation trimestrielle",
      description: "Vérification des services facturables pour le premier trimestre 2025. Préparation des factures clients pour contrats de maintenance.",
      start_time: "2025-03-28T09:00:00Z",
      end_time: "2025-03-28T17:00:00Z",
      category: "billing",
      status: "scheduled",
      priority: "medium",
      all_day: true,
      reference_number: "BIL-2025-0001",
      location: {
        name: "Bureau Ecology'B",
        address: "56 Avenue de l'Europe, 34080 Montpellier",
        virtual: false
      },
      participants: [
        {
          id: "admin001",
          name: "Marie Legrand",
          email: "m.legrand@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/women/23.jpg",
          role: "Directrice",
          type: "admin",
          confirmed: true
        },
        {
          id: "admin002",
          name: "Philippe Dupont",
          email: "p.dupont@ecologyb.fr",
          avatar_url: "https://randomuser.me/api/portraits/men/54.jpg",
          role: "Responsable Technique",
          type: "admin",
          confirmed: true
        }
      ],
      related_documents: [
        {
          id: "doc110",
          title: "Rapport d'activité SAV - T1 2025",
          type: "Rapport"
        },
        {
          id: "doc111",
          title: "Liste des interventions facturables",
          type: "Facturation"
        }
      ],
      created_by: "admin001",
      created_at: "2025-03-01T11:15:00Z",
      updated_at: "2025-03-01T11:15:00Z"
    }
  ];

  // Sample tasks data
  const sampleAdminTasks: Task[] = [
    {
      id: "task001",
      title: "Commander pièces de rechange - Onduleurs SolarMax",
      description: "Commander 5 cartes électroniques de remplacement pour onduleurs SolarMax suite aux défaillances récentes.",
      due_date: "2025-03-20T18:00:00Z",
      priority: "high",
      status: "in_progress",
      assignee: "admin002",
      related_documents: [
        {
          id: "doc200",
          title: "Liste des pièces à commander",
          type: "Commande"
        }
      ],
      created_at: "2025-03-15T10:30:00Z",
      updated_at: "2025-03-17T14:30:00Z",
      tags: ["commande", "pièces", "onduleur"]
    },
    {
      id: "task002",
      title: "Préparer rapport qualité mensuel - Mars 2025",
      description: "Compiler les données de qualité du mois de mars pour présentation à la direction.",
      due_date: "2025-04-05T17:00:00Z",
      priority: "medium",
      status: "not_started",
      assignee: "qa001",
      created_at: "2025-03-14T09:15:00Z",
      updated_at: "2025-03-14T09:15:00Z",
      tags: ["rapport", "qualité", "mensuel"]
    },
    {
      id: "task003",
      title: "Mettre à jour procédure d'intervention SAV",
      description: "Intégrer les nouvelles directives de sécurité dans la procédure standard d'intervention SAV.",
      due_date: "2025-03-25T18:00:00Z",
      priority: "medium",
      status: "not_started",
      assignee: "support001",
      related_documents: [
        {
          id: "doc201",
          title: "Procédure d'intervention SAV v2.4",
          type: "Procédure"
        },
        {
          id: "doc202",
          title: "Nouvelles directives de sécurité 2025",
          type: "Réglementation"
        }
      ],
      created_at: "2025-03-16T11:30:00Z",
      updated_at: "2025-03-16T11:30:00Z",
      tags: ["procédure", "sécurité", "mise à jour"]
    },
    {
      id: "task004",
      title: "Analyser taux de défaillance batteries PowerBank",
      description: "Étudier l'augmentation des défaillances signalées sur les batteries PowerBank installées en 2024.",
      due_date: "2025-03-22T17:00:00Z",
      priority: "high",
      status: "in_progress",
      assignee: "qa001",
      equipment_id: "eq040",
      related_documents: [
        {
          id: "doc203",
          title: "Historique des interventions - PowerBank",
          type: "Données"
        }
      ],
      created_at: "2025-03-15T14:45:00Z",
      updated_at: "2025-03-17T09:30:00Z",
      tags: ["analyse", "défaillance", "batterie"]
    },
    {
      id: "task005",
      title: "Organiser formation nouveaux techniciens",
      description: "Planifier et préparer la session de formation pour les 3 nouveaux techniciens qui débutent le 01/04.",
      due_date: "2025-03-29T18:00:00Z",
      priority: "medium",
      status: "not_started",
      assignee: "tech001",
      related_documents: [
        {
          id: "doc204",
          title: "Support de formation nouveaux techniciens",
          type: "Formation"
        }
      ],
      created_at: "2025-03-16T08:30:00Z",
      updated_at: "2025-03-16T08:30:00Z",
      tags: ["formation", "techniciens", "intégration"]
    },
    {
      id: "task006",
      title: "Vérifier contrats de maintenance à renouveler",
      description: "Identifier les contrats de maintenance arrivant à échéance au Q2 2025 et préparer les propositions de renouvellement.",
      due_date: "2025-03-31T17:00:00Z",
      priority: "high",
      status: "not_started",
      assignee: "admin001",
      created_at: "2025-03-17T11:15:00Z",
      updated_at: "2025-03-17T11:15:00Z",
      tags: ["contrat", "maintenance", "renouvellement"]
    },
    {
      id: "task007",
      title: "Mettre à jour base de données équipements clients",
      description: "Intégrer les nouveaux équipements installés en mars dans la base de données de gestion de parc.",
      due_date: "2025-04-02T18:00:00Z",
      priority: "medium",
      status: "not_started",
      assignee: "support001",
      created_at: "2025-03-18T09:45:00Z",
      updated_at: "2025-03-18T09:45:00Z",
      tags: ["base de données", "équipement", "gestion de parc"]
    },
    {
      id: "task008",
      title: "Suivre retour SAV fabricant - Onduleurs défectueux",
      description: "Assurer le suivi des 3 onduleurs envoyés au fabricant pour analyse et réparation sous garantie.",
      due_date: "2025-03-21T17:00:00Z",
      priority: "high",
      status: "in_progress",
      assignee: "tech002",
      equipment_id: "eq090",
      client_id: "client002",
      created_at: "2025-03-14T16:30:00Z",
      updated_at: "2025-03-16T10:15:00Z",
      tags: ["SAV", "garantie", "onduleur"]
    }
  ];

  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true);
    setTimeout(() => {
      setEvents(sampleAdminEvents);
      setTasks(sampleAdminTasks);
      setUsers([...sampleStaff, ...sampleClients]);
      setIsLoading(false);
    }, 1000);
    
    // Get user info from localStorage
    const adminInfo = localStorage.getItem("adminInfo");
    if (adminInfo) {
      setUserInfo(JSON.parse(adminInfo));
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
          (event.client_name && event.client_name.toLowerCase().includes(searchLower)) ||
          (event.reference_number && event.reference_number.toLowerCase().includes(searchLower)) ||
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
      
      // Filter by status
      if (filterStatus !== "all" && event.status !== filterStatus) {
        return false;
      }
      
      return true;
    });
  }, [events, searchTerm, filterCategory, filterPriority, filterStatus]);

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
    }).sort((a, b) => {
      // Sort by priority first, then by time
      const priorityOrder = { critical: 0, urgent: 1, high: 2, medium: 3, low: 4 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    });
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
      .sort((a, b) => {
        // Sort by date first
        const dateComparison = new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
        if (dateComparison !== 0) return dateComparison;
        
        // Then by priority
        const priorityOrder = { critical: 0, urgent: 1, high: 2, medium: 3, low: 4 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
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
        const priorityOrder = { critical: 0, urgent: 1, high: 2, medium: 3, low: 4 };
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
        const priorityOrder = { critical: 0, urgent: 1, high: 2, medium: 3, low: 4 };
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
      case "sav":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "installation":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "maintenance":
        return "bg-teal-100 text-teal-800 border-teal-300";
      case "claim":
        return "bg-red-100 text-red-800 border-red-300";
      case "meeting_client":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "meeting_admin":
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case "site_visit":
        return "bg-green-100 text-green-800 border-green-300";
      case "training":
        return "bg-sky-100 text-sky-800 border-sky-300";
      case "support":
        return "bg-cyan-100 text-cyan-800 border-cyan-300";
      case "intervention":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "quality_control":
        return "bg-violet-100 text-violet-800 border-violet-300";
      case "remote_monitoring":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "billing":
        return "bg-slate-100 text-slate-800 border-slate-300";
      case "system_update":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "warranty":
        return "bg-rose-100 text-rose-800 border-rose-300";
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
        return "bg-amber-100 text-amber-800";
      case "pending":
        return "bg-purple-100 text-purple-800";
      case "delayed":
        return "bg-orange-100 text-orange-800";
      case "on_hold":
        return "bg-gray-100 text-gray-800";
      case "reopened":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get color for an event by priority
  const getPriorityColor = (priority: EventPriority): string => {
    switch (priority) {
      case "critical":
        return "bg-purple-100 text-purple-800";
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
      case "critical":
        return "Critique";
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
      case "sav":
        return "Service Après-Vente";
      case "installation":
        return "Installation";
      case "maintenance":
        return "Maintenance";
      case "claim":
        return "Réclamation";
      case "meeting_client":
        return "Réunion Client";
      case "meeting_admin":
        return "Réunion Interne";
      case "site_visit":
        return "Visite de Site";
      case "training":
        return "Formation";
      case "support":
        return "Support Technique";
      case "intervention":
        return "Intervention";
      case "quality_control":
        return "Contrôle Qualité";
      case "remote_monitoring":
        return "Monitoring à Distance";
      case "billing":
        return "Facturation";
      case "system_update":
        return "Mise à Jour Système";
      case "warranty":
        return "Garantie";
      default:
        return "Autre";
    }
  };

  // Get status label
  const getStatusLabel = (status: EventStatus): string => {
    switch (status) {
      case "scheduled":
        return "Planifié";
      case "completed":
        return "Terminé";
      case "cancelled":
        return "Annulé";
      case "in_progress":
        return "En cours";
      case "pending":
        return "En attente";
      case "delayed":
        return "Retardé";
      case "on_hold":
        return "En suspens";
      case "reopened":
        return "Réouvert";
      default:
        return "Non défini";
    }
  };

  // Get category icon
  const getCategoryIcon = (category: EventCategory) => {
    switch (category) {
      case "sav":
        return <WrenchIcon className="h-5 w-5 text-amber-500" />;
      case "installation":
        return <CubeIcon className="h-5 w-5 text-blue-500" />;
      case "maintenance":
        return <ArrowPathIcon className="h-5 w-5 text-teal-500" />;
      case "claim":
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case "meeting_client":
        return <BriefcaseIcon className="h-5 w-5 text-purple-500" />;
      case "meeting_admin":
        return <UserGroupIcon className="h-5 w-5 text-indigo-500" />;
      case "site_visit":
        return <MapPinIcon className="h-5 w-5 text-green-500" />;
      case "training":
        return <UserIcon className="h-5 w-5 text-sky-500" />;
      case "support":
        return <PhoneIcon className="h-5 w-5 text-cyan-500" />;
      case "intervention":
        return <BoltIcon className="h-5 w-5 text-orange-500" />;
      case "quality_control":
        return <ClipboardDocumentCheckIcon className="h-5 w-5 text-violet-500" />;
      case "remote_monitoring":
        return <ChartBarIcon className="h-5 w-5 text-emerald-500" />;
      case "billing":
        return <CurrencyEuroIcon className="h-5 w-5 text-slate-500" />;
      case "system_update":
        return <ServerIcon className="h-5 w-5 text-gray-500" />;
      case "warranty":
        return <ReceiptRefundIcon className="h-5 w-5 text-rose-500" />;
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
              "linear-gradient(135deg, rgba(33,63,91,0.05) 0%, rgba(50,80,120,0.03) 100%)",
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
                <h1 className="text-3xl font-bold text-[#213f5b] flex items-center gap-2">
                  <ShieldCheckIcon className="h-8 w-8 text-[#213f5b]" />
                  Administration Agenda
                </h1>
                <p className="text-gray-600">
                  Gérez les interventions SAV, installations, etc.
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
                  Nouvelle intervention
                </motion.button>
              </div>
            </div>

            {/* Stats Overview */}
            {statsVisible && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-6 gap-3"
              >
                <div className="bg-white rounded-lg shadow-sm p-3 flex flex-col">
                  <div className="text-[#213f5b] text-sm font-medium mb-1 flex items-center gap-1">
                    <FolderIcon className="h-4 w-4" />
                    <span>Total</span>
                  </div>
                  <div className="text-2xl font-bold">{statistics.totalScheduled}</div>
                  <div className="text-xs text-gray-500 mt-1">Dossiers actifs</div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-3 flex flex-col">
                  <div className="text-green-600 text-sm font-medium mb-1 flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Aujourd&apos;hui</span>
                  </div>
                  <div className="text-2xl font-bold">{statistics.todayInterventions}</div>
                  <div className="text-xs text-gray-500 mt-1">Interventions</div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-3 flex flex-col">
                  <div className="text-blue-600 text-sm font-medium mb-1 flex items-center gap-1">
                    <CubeIcon className="h-4 w-4" />
                    <span>Installation</span>
                  </div>
                  <div className="text-2xl font-bold">{statistics.pendingInstallations}</div>
                  <div className="text-xs text-gray-500 mt-1">En attente</div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-3 flex flex-col">
                  <div className="text-amber-600 text-sm font-medium mb-1 flex items-center gap-1">
                    <WrenchIcon className="h-4 w-4" />
                    <span>SAV</span>
                  </div>
                  <div className="text-2xl font-bold">{statistics.openServiceCalls}</div>
                  <div className="text-xs text-gray-500 mt-1">Tickets ouverts</div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-3 flex flex-col">
                  <div className="text-purple-600 text-sm font-medium mb-1 flex items-center gap-1">
                    <BellAlertIcon className="h-4 w-4" />
                    <span>Rappel</span>
                  </div>
                  <div className="text-2xl font-bold">{statistics.reminders || 5}</div>
                  <div className="text-xs text-gray-500 mt-1">À effectuer</div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-3 flex flex-col">
                  <div className="text-indigo-600 text-sm font-medium mb-1 flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>RDV</span>
                  </div>
                  <div className="text-2xl font-bold">{statistics.appointments || 9}</div>
                  <div className="text-xs text-gray-500 mt-1">Planifiés</div>
                </div>
                
                <button 
                  className="absolute top-24 right-8 text-gray-400 hover:text-gray-600 p-1"
                  onClick={() => setStatsVisible(false)}
                  title="Masquer les statistiques"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </motion.div>
            )}

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
                    {viewType === 'agenda' && 'Interventions planifiées'}
                  </h2>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher une intervention..."
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
                      Type d&apos;intervention
                      </label>
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value as EventCategory | "all")}
                        className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-[#213f5b] focus:border-[#213f5b] text-sm"
                      >
                        <option value="all">Tous</option>
                        <option value="sav">SAV</option>
                        <option value="installation">Installation</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="claim">Réclamation</option>
                        <option value="intervention">Intervention</option>
                        <option value="support">Support</option>
                        <option value="quality_control">Contrôle Qualité</option>
                        <option value="training">Formation</option>
                        <option value="warranty">Garantie</option>
                        <option value="system_update">Mise à jour</option>
                        <option value="meeting_client">Réunion client</option>
                        <option value="meeting_admin">Réunion interne</option>
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
                        <option value="critical">Critique</option>
                        <option value="urgent">Urgente</option>
                        <option value="high">Élevée</option>
                        <option value="medium">Moyenne</option>
                        <option value="low">Basse</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Statut
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as EventStatus | "all")}
                      className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-[#213f5b] focus:border-[#213f5b] text-sm"
                    >
                      <option value="all">Tous</option>
                      <option value="scheduled">Planifié</option>
                      <option value="in_progress">En cours</option>
                      <option value="completed">Terminé</option>
                      <option value="pending">En attente</option>
                      <option value="on_hold">En suspens</option>
                      <option value="delayed">Retardé</option>
                      <option value="cancelled">Annulé</option>
                      <option value="reopened">Réouvert</option>
                    </select>
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
                        Aucune intervention aujourd&apos;hui
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
                                <div className="text-sm font-medium text-gray-900 truncate flex items-start">
                                  {event.reference_number && (
                                    <span className="inline-block bg-gray-100 text-gray-800 text-xs rounded px-1.5 py-0.5 mr-1">
                                      {event.reference_number}
                                    </span>
                                  )}
                                  <span className="truncate">{event.title}</span>
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                  <ClockIcon className="h-3.5 w-3.5" />
                                  {event.all_day ? (
                                    "Toute la journée"
                                  ) : (
                                    `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`
                                  )}
                                </div>
                                {event.client_name && (
                                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                    <BriefcaseIcon className="h-3.5 w-3.5" />
                                    {truncateText(event.client_name, 25)}
                                  </div>
                                )}
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
                        Aucune intervention à venir
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
                                  {truncateText(event.title, 30)}
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
                                {event.client_name && (
                                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                    <BriefcaseIcon className="h-3.5 w-3.5" />
                                    {truncateText(event.client_name, 25)}
                                  </div>
                                )}
                                <div className="flex items-center gap-1 mt-1">
                                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                                    {getPriorityLabel(event.priority)}
                                  </span>
                                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                                    {getStatusLabel(event.status)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {upcomingEvents.length > 5 && (
                          <div className="p-2 text-center">
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                              Voir toutes les interventions ({upcomingEvents.length})
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
                      Tâches administratives
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
                                  {/* Display assignee if available */}
                                  {task.assignee && (
                                    <div className="text-xs text-gray-500 mt-0.5">
                                      Assigné à: {users.find(u => u.id === task.assignee)?.firstName || ''} {users.find(u => u.id === task.assignee)?.lastName || ''}
                                    </div>
                                  )}
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
                                  {/* Display tags */}
                                  {task.tags && task.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {task.tags.slice(0, 2).map((tag, index) => (
                                        <span 
                                          key={index}
                                          className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                      {task.tags.length > 2 && (
                                        <span className="text-xs text-gray-500">
                                          +{task.tags.length - 2}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                {task.related_event && (
                                  <button className="text-gray-400 hover:text-gray-600" title="Voir l'intervention associée">
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
                      <p className="text-gray-600">Chargement des interventions...</p>
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
                                      {dayEvents.length} interv.
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
                                      {event.reference_number ? `[${event.reference_number}] ` : ''}
                                      {truncateText(event.title, 18)}
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
                        <div className="grid grid-cols-8 border-b">
                          {/* Empty cell for time column */}
                          <div className="p-2 text-center border-r bg-gray-50 w-20"></div>
                          
                          {/* Day headers */}
                          {calendarDates.map((date, index) => (
                            <div 
                              key={index} 
                              className={`p-2 text-center border-r ${isToday(date) ? 'bg-blue-50' : ''}`}
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
                          <div className="grid grid-cols-8">
                            {/* Label for all-day events */}
                            <div className="px-2 pt-1 pb-2 text-xs font-medium text-gray-500 border-r bg-gray-50 w-20">
                              Toute la journée
                            </div>
                            
                            {/* All-day events by day */}
                            <div className="col-span-7 grid grid-cols-7 gap-1">
                              {calendarDates.map((date, dateIndex) => {
                                const allDayEvents = getAllDayEvents(date);
                                return (
                                  <div key={dateIndex} className="min-h-[40px] border-r p-1">
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
                          <div className="relative">
                            <div className="grid grid-cols-8">
                              {/* Time labels in the first column */}
                              <div className="w-20 flex-shrink-0 text-right pr-2 text-xs text-gray-500 bg-gray-50 border-r">
                                {generateTimeSlots().map((slot, slotIndex) => (
                                  <div 
                                    key={slotIndex} 
                                    className={`h-[30px] flex items-center justify-end pr-2 ${slotIndex % 2 === 0 ? 'font-medium border-t' : ''}`}
                                  >
                                    {slotIndex % 2 === 0 && slot}
                                  </div>
                                ))}
                              </div>
                              
                              {/* Day columns with events */}
                              <div className="col-span-7 grid grid-cols-7 divide-x relative">
                                {/* Horizontal time grid lines that span all days */}
                                <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none">
                                  {generateTimeSlots().map((slot, slotIndex) => (
                                    <div 
                                      key={slotIndex} 
                                      className={`absolute left-0 right-0 border-t ${slotIndex % 2 === 0 ? 'border-gray-200' : 'border-gray-100'}`}
                                      style={{ top: `${slotIndex * 30}px` }}
                                    >
                                      {/* Current time indicator */}
                                      {isToday(selectedDate) && getCurrentTimePosition() === slotIndex && (
                                        <div className="absolute left-0 right-0 border-t-2 border-red-500 z-20"></div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                
                                {calendarDates.map((date, dateIndex) => (
                                  <div key={dateIndex} className="relative min-h-[800px]">
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
                                            className={`absolute left-0 right-0 mx-1 rounded px-2 py-1 overflow-hidden cursor-pointer shadow-sm ${getCategoryColor(event.category)} z-10`}
                                            style={{ 
                                              top: `${top}px`, 
                                              height: `${height}px`,
                                              minHeight: '25px'
                                            }}
                                            onClick={() => handleEventClick(event)}
                                          >
                                            <div className="text-xs font-medium truncate">
                                              {event.reference_number && `[${event.reference_number}] `}
                                              {event.title}
                                            </div>
                                            <div className="text-xs opacity-80 truncate">
                                              {formatTime(event.start_time)} - {formatTime(event.end_time)}
                                            </div>
                                            {height > 50 && event.client_name && (
                                              <div className="text-xs opacity-80 truncate mt-0.5">
                                                {event.client_name}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                  </div>
                                ))}
                              </div>
                            </div>
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
                            {getEventsForDate(selectedDate).length} interventions
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
                                  <div className="font-medium flex items-center">
                                    {getCategoryIcon(event.category)}
                                    <span className="ml-2">{event.title}</span>
                                  </div>
                                  <div className="flex items-center gap-4 mt-1 text-xs">
                                    {event.reference_number && (
                                      <span className="flex items-center gap-1">
                                        <FolderIcon className="h-3.5 w-3.5" />
                                        {event.reference_number}
                                      </span>
                                    )}
                                    {event.client_name && (
                                      <span className="flex items-center gap-1">
                                        <BriefcaseIcon className="h-3.5 w-3.5" />
                                        {event.client_name}
                                      </span>
                                    )}
                                    {event.location?.name && (
                                      <span className="flex items-center gap-1">
                                        <MapPinIcon className="h-3.5 w-3.5" />
                                        {event.location.name}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {getAllDayEvents(selectedDate).length === 0 && (
                                <div className="text-center text-sm text-gray-500 py-1">
                                  Aucune intervention toute la journée
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
                                            <div className="text-sm font-medium truncate flex items-center">
                                              {getCategoryIcon(event.category)}
                                              <span className="ml-1">{event.title}</span>
                                            </div>
                                            <div className="text-xs opacity-80 truncate">
                                              {formatTime(event.start_time)} - {formatTime(event.end_time)}
                                            </div>
                                            {height > 50 && (
                                              <div className="text-xs mt-1">
                                                {event.reference_number && (
                                                  <span className="inline-block bg-white/40 rounded px-1.5 py-0.5 mr-1">
                                                    {event.reference_number}
                                                  </span>
                                                )}
                                                {event.client_name && (
                                                  <span className="inline-block bg-white/40 rounded px-1.5 py-0.5 mr-1">
                                                    {event.client_name}
                                                  </span>
                                                )}
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
                          <h3 className="text-lg font-semibold text-gray-800">Toutes les interventions planifiées</h3>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-3">
                          {filteredEvents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                              <CalendarIcon className="h-12 w-12 text-gray-300 mb-2" />
                              <p>Aucune intervention ne correspond à vos critères</p>
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
                                            // First sort by priority
                                            const priorityOrder = { critical: 0, urgent: 1, high: 2, medium: 3, low: 4 };
                                            const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
                                            
                                            if (priorityDiff !== 0) return priorityDiff;
                                            
                                            // Then by time
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
                                                      <div className="flex items-center gap-2">
                                                        {event.reference_number && (
                                                          <span className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                                                            {event.reference_number}
                                                          </span>
                                                        )}
                                                        <h5 className="text-base font-medium text-gray-900">
                                                          {event.title}
                                                        </h5>
                                                      </div>
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
                                                      {getStatusLabel(event.status)}
                                                    </div>
                                                  </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4 mt-3">
                                                  <div>
                                                    {event.client_name && (
                                                      <div className="text-sm text-gray-600 flex items-center gap-1">
                                                        <BriefcaseIcon className="h-4 w-4 text-gray-500" />
                                                        <span>Client: {event.client_name}</span>
                                                      </div>
                                                    )}
                                                    
                                                    {event.location?.name && (
                                                      <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                                        <MapPinIcon className="h-4 w-4 text-gray-500" />
                                                        <span>{event.location.name}</span>
                                                        {event.location.virtual && (
                                                          <span className="ml-1 text-xs bg-blue-100 px-1.5 py-0.5 rounded">
                                                            Distanciel
                                                          </span>
                                                        )}
                                                      </div>
                                                    )}
                                                  </div>
                                                  
                                                  <div>
                                                    {event.intervention_type && (
                                                      <div className="text-sm text-gray-600 flex items-center gap-1">
                                                        {event.intervention_type === "onsite" ? (
                                                          <>
                                                            <TruckIcon className="h-4 w-4 text-gray-500" />
                                                            <span>Intervention sur site</span>
                                                          </>
                                                        ) : event.intervention_type === "remote" ? (
                                                          <>
                                                            <ServerIcon className="h-4 w-4 text-gray-500" />
                                                            <span>Intervention à distance</span>
                                                          </>
                                                        ) : (
                                                          <>
                                                            <PhoneIcon className="h-4 w-4 text-gray-500" />
                                                            <span>Assistance téléphonique</span>
                                                          </>
                                                        )}
                                                      </div>
                                                    )}
                                                    
                                                    {event.sla_breach !== undefined && (
                                                      <div className="text-sm flex items-center gap-1 mt-1">
                                                        {event.sla_breach ? (
                                                          <span className="text-red-600 flex items-center gap-1">
                                                            <ExclamationCircleIcon className="h-4 w-4" />
                                                            Risque de dépassement SLA
                                                          </span>
                                                        ) : (
                                                          <span className="text-green-600 flex items-center gap-1">
                                                            <CheckIcon className="h-4 w-4" />
                                                            SLA respecté
                                                          </span>
                                                        )}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                                
                                                {event.participants.length > 0 && (
                                                  <div className="flex items-center gap-1 mt-3 pt-3 border-t">
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
                                                              <UserIcon className="h-4 w-4 text-gray-500" />
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
                                                
                                                {event.equipment && event.equipment.length > 0 && (
                                                  <div className="mt-3 pt-3 border-t">
                                                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                                      <CubeIcon className="h-3.5 w-3.5" />
                                                      Équipements concernés:
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                      {event.equipment.map(eq => (
                                                        <div 
                                                          key={eq.id}
                                                          className={`flex items-center gap-1 text-xs px-2 py-1 rounded border ${
                                                            eq.status === 'operational' ? 'bg-green-50 text-green-800 border-green-200' :
                                                            eq.status === 'maintenance_needed' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                                                            eq.status === 'failure' ? 'bg-red-50 text-red-800 border-red-200' :
                                                            'bg-gray-50 text-gray-800 border-gray-200'
                                                          }`}
                                                        >
                                                          <span className="truncate max-w-[150px]">{eq.name}</span>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </div>
                                                )}
                                                
                                                {event.related_documents && event.related_documents.length > 0 && (
                                                  <div className="mt-3 pt-3 border-t">
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
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
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
                        <div className="flex items-center gap-2 mb-1">
                          {selectedEvent.reference_number && (
                            <span className="bg-white/80 text-gray-800 px-2 py-0.5 rounded text-sm font-medium">
                              {selectedEvent.reference_number}
                            </span>
                          )}
                          <h2 className="text-xl font-bold text-gray-900">
                            {selectedEvent.title}
                          </h2>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedEvent.status)}`}>
                            {getStatusLabel(selectedEvent.status)}
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
                  {/* Client Info (if available) */}
                  {selectedEvent.client_name && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
                        <BriefcaseIcon className="h-5 w-5 text-blue-500" />
                        Information client
                      </h3>
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="text-lg font-medium text-gray-900">
                            {selectedEvent.client_name}
                          </div>
                          {selectedEvent.client_id && (
                            <div className="text-sm text-gray-600 mt-1">
                              ID Client: {selectedEvent.client_id}
                            </div>
                          )}
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                          Voir la fiche client
                        </button>
                      </div>
                    </div>
                  )}
                  
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
                    <div className="mt-3 flex items-center gap-4">
                      {selectedEvent.recurrence && (
                        <div className="text-sm text-gray-700 flex items-center gap-1">
                          <ArrowPathIcon className="h-4 w-4 text-gray-500" />
                          Récurrent: {selectedEvent.recurrence.includes('WEEKLY') ? 'Toutes les semaines' : 'Récurrent'}
                        </div>
                      )}
                      {selectedEvent.reminder && (
                        <div className="text-sm text-gray-700 flex items-center gap-1">
                          <BellAlertIcon className="h-4 w-4 text-gray-500" />
                          Rappel: {selectedEvent.reminder / 60 >= 24 
                            ? `${selectedEvent.reminder / 60 / 24} jour(s) avant` 
                            : selectedEvent.reminder / 60 >= 1 
                              ? `${selectedEvent.reminder / 60} heure(s) avant` 
                              : `${selectedEvent.reminder} minutes avant`}
                        </div>
                      )}
                      {selectedEvent.intervention_type && (
                        <div className="text-sm text-gray-700 flex items-center gap-1">
                          {selectedEvent.intervention_type === "onsite" ? (
                            <>
                              <TruckIcon className="h-4 w-4 text-gray-500" />
                              <span>Intervention sur site</span>
                            </>
                          ) : selectedEvent.intervention_type === "remote" ? (
                            <>
                              <ServerIcon className="h-4 w-4 text-gray-500" />
                              <span>Intervention à distance</span>
                            </>
                          ) : (
                            <>
                              <PhoneIcon className="h-4 w-4 text-gray-500" />
                              <span>Assistance téléphonique</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
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
                  
                  {/* Equipment */}
                  {selectedEvent.equipment && selectedEvent.equipment.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <CubeIcon className="h-5 w-5 text-gray-500" />
                        Équipements concernés
                      </h3>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="grid sm:grid-cols-2 gap-3">
                          {selectedEvent.equipment.map(eq => (
                            <div 
                              key={eq.id} 
                              className={`flex items-center gap-3 p-3 rounded border ${
                                eq.status === 'operational' ? 'bg-green-50 border-green-200' :
                                eq.status === 'maintenance_needed' ? 'bg-yellow-50 border-yellow-200' :
                                eq.status === 'failure' ? 'bg-red-50 border-red-200' :
                                'bg-white border-gray-200'
                              }`}
                            >
                              <div className={`p-2 rounded-full ${
                                eq.status === 'operational' ? 'bg-green-100' :
                                eq.status === 'maintenance_needed' ? 'bg-yellow-100' :
                                eq.status === 'failure' ? 'bg-red-100' :
                                'bg-gray-100'
                              }`}>
                                {eq.type === "Panneau solaire" ? (
                                  <BoltIcon className="h-5 w-5 text-gray-700" />
                                ) : eq.type === "Monitoring" ? (
                                  <ChartBarIcon className="h-5 w-5 text-gray-700" />
                                ) : eq.type === "Onduleur" ? (
                                  <ServerIcon className="h-5 w-5 text-gray-700" />
                                ) : eq.type === "Batterie" ? (
                                  <BeakerIcon className="h-5 w-5 text-gray-700" />
                                ) : eq.type === "Borne de recharge" ? (
                                  <BoltIcon className="h-5 w-5 text-gray-700" />
                                ) : eq.type === "Éolienne" ? (
                                  <ArrowPathIcon className="h-5 w-5 text-gray-700" />
                                ) : (
                                  <CubeIcon className="h-5 w-5 text-gray-700" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900">
                                  {eq.name}
                                </div>
                                <div className="text-xs text-gray-600 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                  {eq.serial_number && (
                                    <span>S/N: {eq.serial_number}</span>
                                  )}
                                  {eq.installation_date && (
                                    <span>Installation: {new Date(eq.installation_date).toLocaleDateString('fr-FR')}</span>
                                  )}
                                  {eq.warranty_end_date && (
                                    <span>Fin garantie: {new Date(eq.warranty_end_date).toLocaleDateString('fr-FR')}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  eq.status === 'operational' ? 'bg-green-100 text-green-800' :
                                  eq.status === 'maintenance_needed' ? 'bg-yellow-100 text-yellow-800' :
                                  eq.status === 'failure' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {eq.status === 'operational' ? 'Opérationnel' :
                                   eq.status === 'maintenance_needed' ? 'Maintenance requise' :
                                   eq.status === 'failure' ? 'En panne' : 'Fin de vie'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
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
                          {selectedEvent.location.site_id && (
                            <div className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                                Site ID: {selectedEvent.location.site_id}
                              </span>
                              {selectedEvent.location.site_type && (
                                <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs">
                                  Type: {selectedEvent.location.site_type}
                                </span>
                              )}
                            </div>
                          )}
                          {selectedEvent.location.virtual && (
                            <div className="flex items-center gap-1 mt-2">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                Intervention à distance
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
                      Intervenants ({selectedEvent.participants.length})
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
                              participant.type === "technician" ? "bg-blue-100 text-blue-800" :
                              participant.type === "internal" ? "bg-purple-100 text-purple-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {participant.type === "client" ? "Client" :
                               participant.type === "admin" ? "Admin" :
                               participant.type === "technician" ? "Technicien" :
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
                        Notes et commentaires
                      </h3>
                      <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                        {selectedEvent.notes.map(note => (
                          <div 
                            key={note.id} 
                            className={`p-3 rounded border ${
                              note.type === "client" ? "border-green-200 bg-green-50" :
                              note.type === "system" ? "border-gray-200 bg-gray-50" :
                              "border-blue-200 bg-white"
                            }`}
                          >
                            <div className="text-sm text-gray-700 whitespace-pre-line">
                              {note.content}
                            </div>
                            <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                {note.type === "client" ? (
                                  <>
                                    <BriefcaseIcon className="h-3.5 w-3.5 text-green-600" />
                                    <span className="text-green-600">Note client</span>
                                  </>
                                ) : note.type === "system" ? (
                                  <>
                                    <ServerIcon className="h-3.5 w-3.5 text-gray-600" />
                                    <span className="text-gray-600">Note système</span>
                                  </>
                                ) : (
                                  <>
                                    <UserIcon className="h-3.5 w-3.5 text-blue-600" />
                                    <span className="text-blue-600">Note interne</span>
                                  </>
                                )}
                                <span className="text-gray-500 ml-1">par {note.author}</span>
                              </span>
                              <span>{formatDate(new Date(note.created_at), 'short')} {formatTime(note.created_at)}</span>
                            </div>
                          </div>
                        ))}
                        
                        {/* Add note input */}
                        <div className="mt-2 p-3 border border-dashed border-gray-300 rounded-lg">
                          <textarea
                            placeholder="Ajouter une nouvelle note..."
                            className="w-full p-2 border border-gray-300 rounded resize-none text-sm focus:ring-blue-500 focus:border-blue-500"
                            rows={2}
                          ></textarea>
                          <div className="flex justify-between mt-2">
                            <select className="text-xs border border-gray-300 rounded p-1 focus:ring-blue-500 focus:border-blue-500">
                              <option value="internal">Note interne</option>
                              <option value="client">Visible par le client</option>
                            </select>
                            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                              Ajouter
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Footer with actions */}
                <div className="border-t p-4 bg-gray-50 flex flex-wrap justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Créé le {formatDate(new Date(selectedEvent.created_at), 'short')} par {users.find(u => u.id === selectedEvent.created_by)?.firstName || ''} {users.find(u => u.id === selectedEvent.created_by)?.lastName || ''}
                    {selectedEvent.created_at !== selectedEvent.updated_at && (
                      <span className="ml-2">
                        • Dernière mise à jour le {formatDate(new Date(selectedEvent.updated_at), 'short')}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    {selectedEvent.status !== "completed" && (
                      <button className="px-3 py-1.5 border border-green-600 bg-green-600 rounded text-sm text-white hover:bg-green-700 flex items-center gap-1">
                        <CheckIcon className="h-4 w-4" />
                        Marquer comme terminé
                      </button>
                    )}
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
                    Nouvelle intervention
                  </h2>
                  <button
                    onClick={() => setShowNewEventModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Title and Reference */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titre
                      </label>
                      <input
                        type="text"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                        placeholder="Titre de l'intervention"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Référence
                      </label>
                      <input
                        type="text"
                        value={newEvent.reference_number || ''}
                        onChange={(e) => setNewEvent({ ...newEvent, reference_number: e.target.value })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                        placeholder="SAV-2025-XXXX"
                      />
                    </div>
                  </div>

                  {/* Type and Priority */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type d&apos;intervention
                      </label>
                      <select
                        value={newEvent.category}
                        onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as EventCategory })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                      >
                        <option value="sav">SAV</option>
                        <option value="installation">Installation</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="claim">Réclamation</option>
                        <option value="quality_control">Contrôle Qualité</option>
                        <option value="intervention">Intervention Urgente</option>
                        <option value="training">Formation</option>
                        <option value="support">Support Technique</option>
                        <option value="system_update">Mise à jour Système</option>
                        <option value="warranty">Garantie</option>
                        <option value="meeting_client">Réunion Client</option>
                        <option value="meeting_admin">Réunion Interne</option>
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
                        <option value="critical">Critique</option>
                      </select>
                    </div>
                  </div>

                  {/* Status and Intervention Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Statut
                      </label>
                      <select
                        value={newEvent.status}
                        onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value as EventStatus })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                      >
                        <option value="scheduled">Planifié</option>
                        <option value="in_progress">En cours</option>
                        <option value="pending">En attente</option>
                        <option value="on_hold">En suspens</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type d&apos;assistance
                      </label>
                      <select
                        value={newEvent.intervention_type || 'onsite'}
                        onChange={(e) => setNewEvent({ 
                          ...newEvent, 
                          intervention_type: e.target.value as "onsite" | "remote" | "phone" 
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                      >
                        <option value="onsite">Sur site</option>
                        <option value="remote">À distance</option>
                        <option value="phone">Téléphonique</option>
                      </select>
                    </div>
                  </div>

                  {/* Client */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client
                    </label>
                    <select
                      value={newEvent.client_id || ''}
                      onChange={(e) => {
                        const clientId = e.target.value;
                        const client = sampleClients.find(c => c.id === clientId);
                        setNewEvent({ 
                          ...newEvent, 
                          client_id: clientId,
                          client_name: client ? `${client.firstName} ${client.lastName}${client.company ? ` - ${client.company}` : ''}` : undefined
                        });
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                    >
                      <option value="">Sélectionner un client</option>
                      {sampleClients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.firstName} {client.lastName}{client.company ? ` - ${client.company}` : ''}
                        </option>
                      ))}
                    </select>
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
                      placeholder="Description de l'intervention"
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
                              name: newEvent.location?.name || "",
                              ...newEvent.location,
                              virtual: e.target.checked 
                            } 
                          })}
                          className="h-4 w-4 text-[#213f5b] focus:ring-[#213f5b] border-gray-300 rounded"
                        />
                        <label htmlFor="virtual" className="text-sm text-gray-600">
                          Intervention à distance
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
                      placeholder={newEvent.location?.virtual ? "Nom de la session à distance" : "Adresse ou lieu"}
                    />
                    
                    {!newEvent.location?.virtual && (
                      <input
                        type="text"
                        value={newEvent.location?.address || ''}
                        onChange={(e) => setNewEvent({ 
                          ...newEvent, 
                          location: { 
                            name: newEvent.location?.name || "",
                            ...newEvent.location,
                            address: e.target.value 
                          } 
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm mt-2"
                        placeholder="Adresse complète"
                      />
                    )}
                    
                    {newEvent.location?.virtual && (
                      <input
                        type="text"
                        value={newEvent.location?.link || ''}
                        onChange={(e) => setNewEvent({ 
                          ...newEvent, 
                          location: { 
                            name: newEvent.location?.name || "",
                            ...newEvent.location,
                            link: e.target.value 
                          } 
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm mt-2"
                        placeholder="Lien de connexion (optionnel)"
                      />
                    )}
                    
                    {!newEvent.location?.virtual && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <input
                          type="text"
                          value={newEvent.location?.site_id || ''}
                          onChange={(e) => setNewEvent({ 
                            ...newEvent, 
                            location: { 
                              name: newEvent.location?.name || "",
                              ...newEvent.location,
                              site_id: e.target.value 
                            } 
                          })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                          placeholder="ID du site (optionnel)"
                        />
                        <input
                          type="text"
                          value={newEvent.location?.site_type || ''}
                          onChange={(e) => setNewEvent({ 
                            ...newEvent, 
                            location: { 
                              name: newEvent.location?.name || "",
                              ...newEvent.location,
                              site_type: e.target.value 
                            } 
                          })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                          placeholder="Type de site (optionnel)"
                        />
                      </div>
                    )}
                  </div>

                  {/* Participants */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Intervenants
                    </label>
                    <select
                      multiple
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm h-32"
                    >
                      <optgroup label="Techniciens">
                        {users.filter(user => user.role === "Technicien" || user.role === "Technicienne").map(user => (
                          <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName} - {user.role}{user.specialization ? ` (${user.specialization[0]})` : ''}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Support">
                        {users.filter(user => user.role === "Support Technique").map(user => (
                          <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName} - {user.role}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Qualité">
                        {users.filter(user => user.role === "Contrôleur Qualité").map(user => (
                          <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName} - {user.role}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Administration">
                        {users.filter(user => user.role === "Directrice" || user.role === "Responsable Technique").map(user => (
                          <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName} - {user.role}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Maintenez Ctrl (PC) ou Cmd (Mac) pour sélectionner plusieurs intervenants
                    </p>
                  </div>
                  
                  {/* Equipment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Équipements concernés
                    </label>
                    <div className="p-3 border border-dashed border-gray-300 rounded-lg">
                      <div className="text-sm text-gray-500 mb-2">
                        Vous pourrez ajouter des équipements après la création de l&apos;intervention
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700 border">
                          <PlusCircleIcon className="h-4 w-4" />
                          Ajouter un équipement
                        </button>
                      </div>
                    </div>
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
                    Créer l&apos;intervention
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