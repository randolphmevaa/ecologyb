"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";

import {
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
  PaperAirplaneIcon,
  PlusCircleIcon,
  PaperClipIcon,
  PhotoIcon,
  DocumentTextIcon,
  FaceSmileIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  PhoneIcon,
  VideoCameraIcon,
  UserCircleIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  AdjustmentsHorizontalIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  HandThumbUpIcon,
  PencilIcon,
  LinkIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  WrenchScrewdriverIcon,
  // ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
  MapPinIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

/** ---------------------
 *    TYPE DEFINITIONS
 *  --------------------- */
type MessageStatus = "sent" | "delivered" | "read" | "failed";
type UserStatus = "online" | "offline" | "away" | "busy";
type ConversationType = "coworker" | "group" | "admin" | "document" | "client" | "installation";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  timestamp: string;
  status: MessageStatus;
  is_read: boolean;
  attachments?: Attachment[];
  reply_to?: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number; // in KB
  url: string;
  thumbnail_url?: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar_url?: string;
  role?: string;
  company?: string;
  status: UserStatus;
  last_active?: string;
}

interface Installation {
  id: string;
  client_id: string;
  name: string;
  address: string;
  status: "scheduled" | "in_progress" | "completed" | "issue";
  type: "solar" | "charging" | "battery" | "heating" | "other";
  scheduled_date?: string;
}

interface Conversation {
  id: string;
  type: ConversationType;
  name?: string;
  participants: string[];
  last_message?: Message;
  unread_count: number;
  created_at: string;
  updated_at: string;
  is_pinned?: boolean;
  document_id?: string;
  document_name?: string;
  installation_id?: string;
}

/** ---------------------
 *     MAIN COMPONENT
 *  --------------------- */
export default function TechnicianChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "installations" | "clients" | "team">("all");
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showFormatting, setShowFormatting] = useState(false);
  const [showGroupedByDate, setShowGroupedByDate] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [ , setTechnicianInfo] = useState<{ id: string; firstName: string; lastName: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [todayInstallations, setTodayInstallations] = useState<Installation[]>([]);
  const [upcomingInstallations, setUpcomingInstallations] = useState<Installation[]>([]);

  // Sample technician data
  const technicianData = {
    id: "tech001",
    firstName: "Martin",
    lastName: "Dubois",
    email: "martin.dubois@ecologyb.fr",
    avatar_url: "https://randomuser.me/api/portraits/men/42.jpg",
    role: "Technicien installateur",
    status: "online"
  };

  // Sample users data (coworkers and supervisors)
  const sampleUsers: User[] = [
    {
      id: "user001",
      firstName: "Thomas",
      lastName: "Dubois",
      email: "thomas.dubois@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "Chef d'équipe",
      status: "online"
    },
    {
      id: "user003",
      firstName: "Pierre",
      lastName: "Laurent",
      email: "pierre.laurent@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/men/62.jpg",
      role: "Technicien senior",
      status: "busy",
      last_active: "2025-03-16T10:30:00Z"
    },
    {
      id: "user004",
      firstName: "Sophie",
      lastName: "Legrand",
      email: "sophie.legrand@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/women/17.jpg",
      role: "Coordinatrice",
      status: "away",
      last_active: "2025-03-16T09:15:00Z"
    },
    {
      id: "user005",
      firstName: "Équipe",
      lastName: "Support",
      email: "support@ecologyb.fr",
      avatar_url: "",
      role: "Support",
      status: "online"
    },
    {
      id: "user006",
      firstName: "Julien",
      lastName: "Moreau",
      email: "julien.moreau@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/men/52.jpg",
      role: "Technicien",
      status: "online"
    }
  ];

  // Sample client data
  const sampleClients: User[] = [
    {
      id: "client001",
      firstName: "Marie",
      lastName: "Dupont",
      company: "Mairie de Montpellier",
      email: "marie.dupont@montpellier.fr",
      avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
      status: "online"
    },
    {
      id: "client002",
      firstName: "Jean",
      lastName: "Moreau",
      company: "Habitat Écologique SARL",
      email: "j.moreau@habitat-eco.fr",
      avatar_url: "https://randomuser.me/api/portraits/men/22.jpg",
      status: "offline",
      last_active: "2025-03-15T14:20:00Z"
    },
    {
      id: "client003",
      firstName: "Sarah",
      lastName: "Berger",
      company: "GreenTech Innovations",
      email: "s.berger@greentech-innov.com",
      avatar_url: "https://randomuser.me/api/portraits/women/33.jpg",
      status: "online"
    },
    {
      id: "client004",
      firstName: "Robert",
      lastName: "Martin",
      company: "Résidence Les Oliviers",
      email: "r.martin@residence-oliviers.fr",
      avatar_url: "https://randomuser.me/api/portraits/men/45.jpg",
      status: "offline"
    },
    {
      id: "client005",
      firstName: "Lucie",
      lastName: "Fabre",
      company: "Restaurant Bio Le Jardin",
      email: "contact@lejardin-bio.fr",
      avatar_url: "https://randomuser.me/api/portraits/women/23.jpg",
      status: "online"
    }
  ];

  // Sample installations data
  const sampleInstallations: Installation[] = [
    {
      id: "inst001",
      client_id: "client001",
      name: "Installation panneaux solaires - Mairie",
      address: "1 Place Georges Frêche, 34000 Montpellier",
      status: "scheduled",
      type: "solar",
      scheduled_date: "2025-04-20T09:00:00Z"
    },
    {
      id: "inst002",
      client_id: "client002",
      name: "Installation bornes de recharge",
      address: "24 Rue des Écologistes, 34070 Montpellier",
      status: "in_progress",
      type: "charging",
      scheduled_date: "2025-04-18T10:30:00Z"
    },
    {
      id: "inst003",
      client_id: "client003",
      name: "Installation système de stockage",
      address: "55 Avenue de l'Innovation, 34080 Montpellier",
      status: "scheduled",
      type: "battery",
      scheduled_date: "2025-04-25T08:00:00Z"
    },
    {
      id: "inst004",
      client_id: "client004",
      name: "Maintenance système chauffage",
      address: "78 Rue des Oliviers, 34990 Juvignac",
      status: "completed",
      type: "heating",
      scheduled_date: "2025-04-15T14:00:00Z"
    },
    {
      id: "inst005",
      client_id: "client005",
      name: "Installation panneaux solaires - Restaurant",
      address: "126 Rue du Jardin, 34000 Montpellier",
      status: "issue",
      type: "solar",
      scheduled_date: "2025-04-17T11:00:00Z"
    }
  ];

  // Sample conversation data
  const sampleConversations: Conversation[] = [
    // Installation-specific conversations
    {
      id: "conv001",
      type: "installation",
      name: "Installation Mairie de Montpellier",
      participants: ["tech001", "client001", "user001"],
      unread_count: 2,
      created_at: "2025-04-10T08:30:00Z",
      updated_at: "2025-04-16T11:35:00Z",
      is_pinned: true,
      installation_id: "inst001"
    },
    {
      id: "conv002",
      type: "installation",
      name: "Bornes de recharge - Habitat Écologique",
      participants: ["tech001", "client002", "user003"],
      unread_count: 3,
      created_at: "2025-04-12T14:20:00Z",
      updated_at: "2025-04-18T09:42:00Z",
      installation_id: "inst002"
    },
    {
      id: "conv003",
      type: "installation",
      name: "Système stockage GreenTech",
      participants: ["tech001", "client003"],
      unread_count: 0,
      created_at: "2025-04-14T10:15:00Z",
      updated_at: "2025-04-17T09:30:00Z",
      installation_id: "inst003"
    },
    {
      id: "conv004",
      type: "installation",
      name: "Problème installation Restaurant Le Jardin",
      participants: ["tech001", "client005", "user001", "user004"],
      unread_count: 5,
      created_at: "2025-04-17T11:00:00Z",
      updated_at: "2025-04-18T08:20:00Z",
      is_pinned: true,
      installation_id: "inst005"
    },
    
    // Team conversations
    {
      id: "conv005",
      type: "coworker",
      participants: ["tech001", "user001"],
      unread_count: 0,
      created_at: "2025-04-10T09:45:00Z",
      updated_at: "2025-04-16T15:30:00Z",
    },
    {
      id: "conv006",
      type: "coworker",
      participants: ["tech001", "user003"],
      unread_count: 1,
      created_at: "2025-04-15T14:30:00Z",
      updated_at: "2025-04-18T11:15:00Z",
    },
    {
      id: "conv007",
      type: "group",
      name: "Équipe Technique",
      participants: ["tech001", "user001", "user003", "user006"],
      unread_count: 7,
      created_at: "2025-03-20T11:00:00Z",
      updated_at: "2025-04-18T10:10:00Z"
    },
    
    // Document conversations
    {
      id: "conv008",
      type: "document",
      name: "Guide d'installation - Panneaux solaires V2",
      participants: ["tech001", "user001", "user003", "user006"],
      unread_count: 0,
      created_at: "2025-04-01T09:45:00Z",
      updated_at: "2025-04-10T15:30:00Z",
      document_id: "DOC-2025-010",
      document_name: "Guide_Installation_Panneaux_V2.pdf"
    },
    {
      id: "conv009",
      type: "document",
      name: "Procédure maintenance bornes",
      participants: ["tech001", "user003", "user006"],
      unread_count: 1,
      created_at: "2025-04-05T14:30:00Z",
      updated_at: "2025-04-15T16:15:00Z",
      document_id: "DOC-2025-012",
      document_name: "Procedure_Maintenance_Bornes_2025.pdf"
    },
    
    // Admin conversation
    {
      id: "conv010",
      type: "admin",
      participants: ["tech001", "user005"],
      unread_count: 2,
      created_at: "2025-04-16T09:15:00Z",
      updated_at: "2025-04-18T14:25:00Z",
    },
  ];

  // Sample messages for conversation 1 (Installation Mairie)
  const sampleMessages: Record<string, Message[]> = {
    "conv001": [
      {
        id: "msg001",
        conversation_id: "conv001",
        sender_id: "user001",
        content: "Bonjour Martin, je t'assigne l'installation des panneaux solaires pour la Mairie de Montpellier. Voici les plans et les spécifications techniques. L'installation est prévue pour le 20 avril.",
        timestamp: "2025-04-10T10:30:00Z",
        status: "read",
        is_read: true,
        attachments: [
          {
            id: "att001",
            name: "Plans_Installation_Mairie.pdf",
            type: "application/pdf",
            size: 2048,
            url: "#",
            thumbnail_url: "https://via.placeholder.com/100x100/213f5b/FFFFFF?text=PDF"
          },
          {
            id: "att002",
            name: "Specifications_Techniques.xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 1240,
            url: "#",
            thumbnail_url: "https://via.placeholder.com/100x100/213f5b/FFFFFF?text=XLSX"
          }
        ]
      },
      {
        id: "msg002",
        conversation_id: "conv001",
        sender_id: "tech001",
        content: "Bonjour Thomas, merci pour ces informations. J'ai bien reçu les documents et je vais les consulter. Est-ce que nous avons déjà fait une visite préliminaire du site?",
        timestamp: "2025-04-10T10:45:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg003",
        conversation_id: "conv001",
        sender_id: "user001",
        content: "Oui, la visite a été effectuée la semaine dernière. Tu trouveras le rapport dans le dossier du projet. Il y a quelques points d'attention concernant l'accès au toit et les raccordements électriques.",
        timestamp: "2025-04-10T11:00:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg004",
        conversation_id: "conv001",
        sender_id: "client001",
        content: "Bonjour à tous, je suis Marie Dupont, responsable du projet pour la mairie. Je voulais savoir s'il était possible d'avoir une réunion avant le début des travaux pour discuter de quelques points logistiques?",
        timestamp: "2025-04-16T09:15:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg005",
        conversation_id: "conv001",
        sender_id: "tech001",
        content: "Bonjour Mme Dupont, je suis Martin, le technicien en charge de l'installation. Une réunion préalable est tout à fait possible. Je suis disponible en début de semaine prochaine. Quelles sont vos disponibilités?",
        timestamp: "2025-04-16T09:45:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg006",
        conversation_id: "conv001",
        sender_id: "client001",
        content: "Parfait, je serais disponible lundi 21 avril entre 14h et 16h, ou mardi 22 avril toute la matinée. Est-ce que l'une de ces options vous conviendrait?",
        timestamp: "2025-04-16T10:20:00Z",
        status: "delivered",
        is_read: false
      },
      {
        id: "msg007",
        conversation_id: "conv001",
        sender_id: "client001",
        content: "J'aimerais également savoir si vous pourriez me confirmer la durée estimée des travaux? Nous devons organiser l'accès au bâtiment et prévenir les services municipaux.",
        timestamp: "2025-04-16T11:35:00Z",
        status: "delivered",
        is_read: false
      }
    ],
    
    // For the in-progress installation (bornes de recharge)
    "conv002": [
      {
        id: "msg101",
        conversation_id: "conv002",
        sender_id: "tech001",
        content: "Bonjour M. Moreau, je suis Martin, le technicien qui va s'occuper de l'installation des bornes de recharge demain. Je voulais confirmer avec vous l'heure d'arrivée prévue pour 10h30. Est-ce que cela vous convient?",
        timestamp: "2025-04-17T14:30:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg102",
        conversation_id: "conv002",
        sender_id: "client002",
        content: "Bonjour Martin, oui 10h30 me convient parfaitement. Est-ce que vous aurez besoin d'un accès particulier à notre local technique?",
        timestamp: "2025-04-17T15:40:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg103",
        conversation_id: "conv002",
        sender_id: "tech001",
        content: "Oui, nous aurons besoin d'accéder au tableau électrique principal ainsi qu'à l'emplacement extérieur prévu pour les bornes. J'ai consulté les plans, mais il serait utile que quelqu'un sur place puisse nous orienter.",
        timestamp: "2025-04-17T16:15:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg104",
        conversation_id: "conv002",
        sender_id: "client002",
        content: "Pas de problème, je serai présent pour vous accueillir et vous guider. J'ai une dernière question concernant les travaux : combien de bornes seront installées demain?",
        timestamp: "2025-04-17T16:35:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg105",
        conversation_id: "conv002",
        sender_id: "tech001",
        content: "Selon notre bon de commande, nous devons installer 3 bornes de recharge de 22kW. L'installation devrait prendre la journée entière. Nous apporterons tout le matériel nécessaire.",
        timestamp: "2025-04-17T16:50:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg106",
        conversation_id: "conv002",
        sender_id: "user003",
        content: "Martin, n'oublie pas de prendre également le testeur de charge et les nouveaux câbles renforcés. Le client a demandé spécifiquement des protections supplémentaires pour les bornes extérieures.",
        timestamp: "2025-04-18T08:15:00Z",
        status: "delivered",
        is_read: false
      },
      {
        id: "msg107",
        conversation_id: "conv002",
        sender_id: "client002",
        content: "Bonjour, j'espère que vous avez bien reçu les informations concernant l'emplacement des bornes. J'ai remarqué que sur les plans initiaux, il y avait une petite erreur concernant la distance jusqu'au transformateur.",
        timestamp: "2025-04-18T09:10:00Z",
        status: "delivered",
        is_read: false
      },
      {
        id: "msg108",
        conversation_id: "conv002",
        sender_id: "client002",
        content: "Voici le plan corrigé avec les distances exactes. Cela pourrait être important pour le dimensionnement des câbles.",
        timestamp: "2025-04-18T09:42:00Z",
        status: "delivered",
        is_read: false,
        attachments: [
          {
            id: "att101",
            name: "Plan_Corrigé_Bornes.pdf",
            type: "application/pdf",
            size: 1845,
            url: "#",
            thumbnail_url: "https://via.placeholder.com/100x100/213f5b/FFFFFF?text=PDF"
          }
        ],
        location: {
          latitude: 43.6109,
          longitude: 3.8772,
          address: "24 Rue des Écologistes, 34070 Montpellier"
        }
      }
    ],
    
    // Team conversation
    "conv007": [
      {
        id: "msg201",
        conversation_id: "conv007",
        sender_id: "user001",
        content: "Bonjour l'équipe, petit rappel concernant les nouvelles procédures d'installation des panneaux solaires V3. Merci de consulter le nouveau guide technique.",
        timestamp: "2025-04-17T09:15:00Z",
        status: "read",
        is_read: true,
        attachments: [
          {
            id: "att201",
            name: "Guide_Technique_Panneaux_V3.pdf",
            type: "application/pdf",
            size: 3254,
            url: "#",
            thumbnail_url: "https://via.placeholder.com/100x100/213f5b/FFFFFF?text=PDF"
          }
        ]
      },
      {
        id: "msg202",
        conversation_id: "conv007",
        sender_id: "user003",
        content: "Merci Thomas. J'ai remarqué qu'il y a des changements dans la procédure de raccordement électrique. Est-ce que tous les techniciens ont été formés à cette nouvelle méthode?",
        timestamp: "2025-04-17T09:30:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg203",
        conversation_id: "conv007",
        sender_id: "user001",
        content: "Pas encore. Une session de formation est prévue la semaine prochaine. En attendant, seuls Pierre et Julien sont habilités à réaliser les nouveaux raccordements. Pour les installations prévues d'ici là, merci de les inclure dans l'équipe.",
        timestamp: "2025-04-17T09:35:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg204",
        conversation_id: "conv007",
        sender_id: "tech001",
        content: "Compris. J'ai justement l'installation de la Mairie de Montpellier prévue pour le 20 avril. Je ferai appel à Pierre pour la partie raccordement.",
        timestamp: "2025-04-17T09:50:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg205",
        conversation_id: "conv007",
        sender_id: "user006",
        content: "J'ai un problème avec l'installation au Restaurant Le Jardin. Les supports fixés sur le toit ne correspondent pas au modèle de panneaux que nous avons livré. Quelqu'un peut venir m'aider?",
        timestamp: "2025-04-18T08:20:00Z",
        status: "delivered",
        is_read: false,
        location: {
          latitude: 43.6102,
          longitude: 3.8769,
          address: "126 Rue du Jardin, 34000 Montpellier"
        }
      },
      {
        id: "msg206",
        conversation_id: "conv007",
        sender_id: "user001",
        content: "Julien, peux-tu prendre des photos du problème? Martin est disponible et pourrait te rejoindre avec les adaptateurs si nécessaire.",
        timestamp: "2025-04-18T08:30:00Z",
        status: "delivered",
        is_read: false
      },
      {
        id: "msg207",
        conversation_id: "conv007",
        sender_id: "user006",
        content: "Voici les photos. On a reçu des panneaux 400W mais les supports sont pour des 320W.",
        timestamp: "2025-04-18T08:40:00Z",
        status: "delivered",
        is_read: false,
        attachments: [
          {
            id: "att202",
            name: "Photo_probleme_1.jpg",
            type: "image/jpeg",
            size: 1254,
            url: "#",
            thumbnail_url: "https://via.placeholder.com/100x100/eaeaea/666666?text=PHOTO"
          },
          {
            id: "att203",
            name: "Photo_probleme_2.jpg",
            type: "image/jpeg",
            size: 1102,
            url: "#",
            thumbnail_url: "https://via.placeholder.com/100x100/eaeaea/666666?text=PHOTO"
          }
        ]
      },
      {
        id: "msg208",
        conversation_id: "conv007",
        sender_id: "user003",
        content: "Je pense qu'il y a eu une erreur de livraison. Les adaptateurs sont dans le camion de service, au dépôt. Martin, peux-tu passer les prendre avant de rejoindre Julien?",
        timestamp: "2025-04-18T09:00:00Z",
        status: "delivered",
        is_read: false
      },
      {
        id: "msg209",
        conversation_id: "conv007",
        sender_id: "user001",
        content: "Confirmé. Martin, passe prendre les adaptateurs série B400 et rejoins Julien au plus vite. Le client attend la fin des travaux pour aujourd'hui.",
        timestamp: "2025-04-18T09:15:00Z",
        status: "delivered",
        is_read: false
      },
      {
        id: "msg210",
        conversation_id: "conv007",
        sender_id: "user006",
        content: "Merci! Je préviens le client qu'on va résoudre le problème rapidement.",
        timestamp: "2025-04-18T09:20:00Z",
        status: "delivered",
        is_read: false
      },
      {
        id: "msg211",
        conversation_id: "conv007",
        sender_id: "tech001",
        content: "Je pars chercher les adaptateurs tout de suite et je te rejoins d'ici 30-40 minutes Julien.",
        timestamp: "2025-04-18T10:10:00Z",
        status: "sent",
        is_read: false
      }
    ],
    
    // Problematic installation conversation
    "conv004": [
      {
        id: "msg301",
        conversation_id: "conv004",
        sender_id: "user006",
        content: "Bonjour à tous, je suis sur le site du Restaurant Le Jardin pour l'installation des panneaux solaires, mais nous avons un problème avec les supports de fixation qui ne correspondent pas aux panneaux livrés.",
        timestamp: "2025-04-17T11:30:00Z",
        status: "read",
        is_read: true,
        location: {
          latitude: 43.6102,
          longitude: 3.8769,
          address: "126 Rue du Jardin, 34000 Montpellier"
        }
      },
      {
        id: "msg302",
        conversation_id: "conv004",
        sender_id: "user004",
        content: "Bonjour Julien, je suis désolée pour ce problème. Pouvez-vous préciser quels modèles de panneaux et supports avez-vous sur place?",
        timestamp: "2025-04-17T11:45:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg303",
        conversation_id: "conv004",
        sender_id: "user006",
        content: "Nous avons reçu des panneaux SolarMax 400W, mais les supports installés sont pour des modèles 320W. La différence de dimension ne permet pas un montage sécurisé.",
        timestamp: "2025-04-17T12:00:00Z",
        status: "read",
        is_read: true,
        attachments: [
          {
            id: "att301",
            name: "Photo_Panneau.jpg",
            type: "image/jpeg",
            size: 1254,
            url: "#",
            thumbnail_url: "https://via.placeholder.com/100x100/eaeaea/666666?text=PHOTO"
          }
        ]
      },
      {
        id: "msg304",
        conversation_id: "conv004",
        sender_id: "client005",
        content: "Bonjour, c'est Lucie Fabre du restaurant. Je suis inquiète car nous avions prévu une inauguration de notre initiative écologique pour la semaine prochaine. Est-ce que ce problème va retarder considérablement l'installation?",
        timestamp: "2025-04-17T14:10:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg305",
        conversation_id: "conv004",
        sender_id: "user001",
        content: "Bonjour Madame Fabre, nous prenons ce problème très au sérieux. Nous avons les adaptateurs nécessaires en stock et nous allons envoyer un technicien supplémentaire dès demain pour résoudre ce problème. L'installation sera terminée à temps pour votre inauguration.",
        timestamp: "2025-04-17T14:45:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg306",
        conversation_id: "conv004",
        sender_id: "user001",
        content: "Martin, peux-tu te rendre demain au Restaurant Le Jardin avec les adaptateurs B400 pour aider Julien à terminer l'installation? C'est une priorité.",
        timestamp: "2025-04-17T14:50:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg307",
        conversation_id: "conv004",
        sender_id: "tech001",
        content: "Bien sûr, je serai disponible demain matin. J'irai chercher les adaptateurs au dépôt avant de me rendre sur place.",
        timestamp: "2025-04-17T15:05:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg308",
        conversation_id: "conv004",
        sender_id: "client005",
        content: "Merci beaucoup pour votre réactivité. C'est vraiment important pour nous que tout soit prêt à temps. Y a-t-il quelque chose que nous pouvons faire pour faciliter votre intervention demain?",
        timestamp: "2025-04-18T08:10:00Z",
        status: "delivered",
        is_read: false
      },
      {
        id: "msg309",
        conversation_id: "conv004",
        sender_id: "user006",
        content: "Le problème semble plus complexe que prévu. En plus des adaptateurs, nous aurons besoin de renforcer la structure du toit à certains endroits. Martin, peux-tu apporter également le kit de renforcement?",
        timestamp: "2025-04-18T08:20:00Z",
        status: "delivered",
        is_read: false,
        attachments: [
          {
            id: "att302",
            name: "Photo_Structure_Toit.jpg",
            type: "image/jpeg",
            size: 1320,
            url: "#",
            thumbnail_url: "https://via.placeholder.com/100x100/eaeaea/666666?text=PHOTO"
          }
        ]
      }
    ],

    // Coworker conversation
    "conv006": [
      {
        id: "msg401",
        conversation_id: "conv006",
        sender_id: "user003",
        content: "Salut Martin, je voulais te demander si tu pouvais me remplacer pour la formation de vendredi sur les nouvelles bornes de recharge? J'ai un rendez-vous médical que je ne peux pas déplacer.",
        timestamp: "2025-04-16T14:30:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg402",
        conversation_id: "conv006",
        sender_id: "tech001",
        content: "Bonjour Pierre, pas de problème pour vendredi. À quelle heure est la formation et où a-t-elle lieu?",
        timestamp: "2025-04-16T15:10:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg403",
        conversation_id: "conv006",
        sender_id: "user003",
        content: "Merci beaucoup! La formation est de 14h à 17h au centre technique de Vendargues. C'est sur les nouvelles bornes rapides 150kW. Thomas est au courant que tu me remplaces.",
        timestamp: "2025-04-16T15:40:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg404",
        conversation_id: "conv006",
        sender_id: "tech001",
        content: "D'accord, j'y serai. Est-ce qu'il y a des documents à préparer ou à lire avant la formation?",
        timestamp: "2025-04-16T16:30:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg405",
        conversation_id: "conv006",
        sender_id: "user003",
        content: "Oui, il y a un guide préliminaire à consulter. Je te l'envoie tout de suite. Prévois aussi tes EPI complets car il y aura une partie pratique.",
        timestamp: "2025-04-18T11:10:00Z",
        status: "delivered",
        is_read: false,
        attachments: [
          {
            id: "att401",
            name: "Guide_Préliminaire_Bornes_150kW.pdf",
            type: "application/pdf",
            size: 2845,
            url: "#",
            thumbnail_url: "https://via.placeholder.com/100x100/213f5b/FFFFFF?text=PDF"
          }
        ]
      }
    ],
    
    // Admin conversation
    "conv010": [
      {
        id: "msg501",
        conversation_id: "conv010",
        sender_id: "user005",
        content: "Bonjour Martin, nous devons mettre à jour votre habilitation électrique. Pouvez-vous nous communiquer vos disponibilités pour une formation de recyclage dans les prochaines semaines?",
        timestamp: "2025-04-16T09:15:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg502",
        conversation_id: "conv010",
        sender_id: "tech001",
        content: "Bonjour, je serai disponible la première semaine de mai, idéalement les 5 et 6 mai. Est-ce possible de programmer la formation sur ces dates?",
        timestamp: "2025-04-16T10:30:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg503",
        conversation_id: "conv010",
        sender_id: "user005",
        content: "C'est noté. Nous vous avons inscrit pour les 5 et 6 mai. La formation aura lieu au centre de formation APAVE à Montpellier, de 8h30 à 17h. Merci de confirmer que ces horaires vous conviennent.",
        timestamp: "2025-04-16T11:45:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg504",
        conversation_id: "conv010",
        sender_id: "tech001",
        content: "Les horaires me conviennent parfaitement. Merci pour l'organisation.",
        timestamp: "2025-04-16T14:20:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg505",
        conversation_id: "conv010",
        sender_id: "user005",
        content: "Aussi, nous avons besoin de valider vos notes de frais du mois dernier. Il manque les justificatifs pour les repas du 28 et 29 mars. Pouvez-vous les transmettre dès que possible?",
        timestamp: "2025-04-18T14:20:00Z",
        status: "delivered",
        is_read: false
      },
      {
        id: "msg506",
        conversation_id: "conv010",
        sender_id: "user005",
        content: "Nous devons également vous informer que votre véhicule de service est programmé pour une révision le 25 avril. Merci de le déposer au garage partenaire la veille au soir. Un véhicule de remplacement sera mis à votre disposition.",
        timestamp: "2025-04-18T14:25:00Z",
        status: "delivered",
        is_read: false
      }
    ]
  };

  function handleNewMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setNewMessage(e.target.value);
  }

  useEffect(() => {
    // Simulate API fetch
    const allUsers: User[] = [...sampleUsers, ...sampleClients];
    setUsers(allUsers);
    setConversations(sampleConversations);
    setInstallations(sampleInstallations);
    setTechnicianInfo(technicianData);
    
    // Filter today's and upcoming installations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayInst = sampleInstallations.filter(installation => {
      if (!installation.scheduled_date) return false;
      const installDate = new Date(installation.scheduled_date);
      installDate.setHours(0, 0, 0, 0);
      return installDate.getTime() === today.getTime();
    });
    
    const upcomingInst = sampleInstallations.filter(installation => {
      if (!installation.scheduled_date) return false;
      const installDate = new Date(installation.scheduled_date);
      installDate.setHours(0, 0, 0, 0);
      return installDate.getTime() > today.getTime();
    }).sort((a, b) => {
      if (!a.scheduled_date || !b.scheduled_date) return 0;
      return new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime();
    }).slice(0, 3); // Get next 3 upcoming
    
    setTodayInstallations(todayInst);
    setUpcomingInstallations(upcomingInst);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      // Simulate fetching messages for the selected conversation
      setIsLoading(true);
      setTimeout(() => {
        const conversationMessages = sampleMessages[selectedConversation.id] || [];
        setMessages(conversationMessages);
        
        // Group messages by date for better visualization
        const groupedMessages: Record<string, Message[]> = {};
        conversationMessages.forEach(message => {
          const date = new Date(message.timestamp).toLocaleDateString();
          if (!groupedMessages[date]) {
            groupedMessages[date] = [];
          }
          groupedMessages[date].push(message);
        });
        setShowGroupedByDate(groupedMessages);
        
        setIsLoading(false);
        
        // Mark messages as read
        const updatedConversations = conversations.map(conv => {
          if (conv.id === selectedConversation.id) {
            return { ...conv, unread_count: 0 };
          }
          return conv;
        });
        setConversations(updatedConversations);
        
        // Simulate typing indicator for certain conversations
        if (selectedConversation.id === "conv002" || selectedConversation.id === "conv007") {
          setTimeout(() => {
            setIsTyping(true);
            
            const timeout = setTimeout(() => {
              setIsTyping(false);
            }, 3000);
            
            setTypingTimeout(timeout);
          }, 2000);
        }
      }, 500);
    }
    
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [selectedConversation]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const filteredConversations = conversations
    .filter(conv => {
      // Filter by active tab
      if (activeTab === "installations" && conv.type !== "installation") return false;
      if (activeTab === "clients" && conv.type !== "client" && conv.type !== "installation") return false;
      if (activeTab === "team" && conv.type !== "coworker" && conv.type !== "group" && conv.type !== "admin" && conv.type !== "document") return false;
      
      // Filter by search term
      if (!searchTerm) return true;
      
      const participants = conv.participants
        .map(participantId => {
          const user = users.find(u => u.id === participantId);
          return user ? `${user.firstName} ${user.lastName}` : "";
        })
        .join(" ")
        .toLowerCase();
        
      const conversationName = conv.name?.toLowerCase() || "";
      const documentName = conv.document_name?.toLowerCase() || "";
      
      return participants.includes(searchTerm.toLowerCase()) || 
             conversationName.includes(searchTerm.toLowerCase()) ||
             documentName.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      // Sort pinned conversations first, then by last update
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

  const handleSendMessage = () => {
    if (!selectedConversation || (!newMessage.trim() && attachments.length === 0)) return;
    
    const newMsg: Message = {
      id: `msg${Date.now()}`,
      conversation_id: selectedConversation.id,
      sender_id: "tech001",
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      status: "sent",
      is_read: false,
      attachments: attachments.length > 0 ? attachments.map((file, index) => ({
        id: `att${Date.now()}-${index}`,
        name: file.name,
        type: file.type,
        size: Math.round(file.size / 1024),
        url: "#",
        thumbnail_url: file.type.startsWith("image/") 
          ? URL.createObjectURL(file)
          : `https://via.placeholder.com/100x100/213f5b/FFFFFF?text=${file.name.split('.').pop()?.toUpperCase() || 'FILE'}`
      })) : undefined
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
    setAttachments([]);
    
    // Update conversation's last message and updated_at
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return { 
          ...conv, 
          last_message: newMsg,
          updated_at: newMsg.timestamp
        };
      }
      return conv;
    });
    
    // Sort conversations to move the active one to the top
    const sortedConversations = [...updatedConversations].sort((a, b) => {
      if (a.id === selectedConversation.id) return -1;
      if (b.id === selectedConversation.id) return 1;
      return 0;
    });
    
    setConversations(sortedConversations);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = Array.from(e.target.files);
      setAttachments([...attachments, ...fileList]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today, show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Yesterday
      return "Hier";
    } else if (diffDays < 7) {
      // This week, show day of week
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      // Older, show date
      return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
    }
  };

  const getConversationName = (conversation: Conversation): string => {
    if (conversation.name) return conversation.name;
    
    if (conversation.type === "coworker") {
      const otherParticipantId = conversation.participants.find(id => id !== "tech001");
      const otherUser = users.find(user => user.id === otherParticipantId);
      return otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "Conversation";
    }
    
    if (conversation.type === "admin") {
      return "Administration ECOLOGY'B";
    }
    
    if (conversation.type === "document") {
      return conversation.document_name || "Document technique";
    }
    
    if (conversation.type === "client" || conversation.type === "installation") {
      const clientId = conversation.participants.find(id => id !== "tech001" && !id.startsWith("user"));
      const client = users.find(user => user.id === clientId);
      if (client) {
        const company = client.company;
        return company ? `${client.firstName} ${client.lastName} (${company})` : `${client.firstName} ${client.lastName}`;
      }
      return conversation.type === "installation" ? "Installation" : "Client";
    }
    
    return `Groupe (${conversation.participants.length - 1})`;
  };

  const getConversationAvatar = (conversation: Conversation): string => {
    if (conversation.type === "coworker" || conversation.type === "client") {
      const otherParticipantId = conversation.participants.find(id => id !== "tech001");
      const otherUser = users.find(user => user.id === otherParticipantId);
      return otherUser?.avatar_url || "";
    }
    
    if (conversation.type === "installation") {
      const clientId = conversation.participants.find(id => id.startsWith("client"));
      const client = users.find(user => user.id === clientId);
      return client?.avatar_url || "";
    }
    
    if (conversation.type === "admin") {
      return "https://randomuser.me/api/portraits/men/32.jpg"; // Admin avatar
    }
    
    return ""; // Use icon for document conversations and groups
  };

  const getConversationIcon = (conversation: Conversation) => {
    if (conversation.type === "document") {
      return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
    }
    
    if (conversation.type === "group") {
      return <UserCircleIcon className="h-5 w-5 text-purple-500" />;
    }
    
    if (conversation.type === "admin") {
      return <BuildingOfficeIcon className="h-5 w-5 text-red-500" />;
    }
    
    if (conversation.type === "client") {
      return <BriefcaseIcon className="h-5 w-5 text-green-500" />;
    }
    
    if (conversation.type === "installation") {
      return <WrenchScrewdriverIcon className="h-5 w-5 text-yellow-600" />;
    }
    
    return null;
  };

  const getStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case "sent":
        return <CheckCircleIcon className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <CheckCircleIcon className="h-3 w-3 text-blue-500" />;
      case "read":
        return <CheckCircleIcon className="h-3 w-3 text-green-500" />;
      case "failed":
        return <ExclamationCircleIcon className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getUserStatus = (status: UserStatus) => {
    switch (status) {
      case "online":
        return <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>;
      case "away":
        return <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-yellow-500 border-2 border-white"></span>;
      case "busy":
        return <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>;
      case "offline":
        return <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-gray-500 border-2 border-white"></span>;
      default:
        return null;
    }
  };

  const formatFileSize = (sizeInKB: number): string => {
    if (sizeInKB < 1000) {
      return `${sizeInKB} KB`;
    } else {
      return `${(sizeInKB / 1024).toFixed(1)} MB`;
    }
  };

  const getInstallationStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <CalendarDaysIcon className="h-4 w-4 text-blue-500" />;
      case "in_progress":
        return <ArrowPathIcon className="h-4 w-4 text-yellow-500" />;
      case "completed":
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case "issue":
        return <ExclamationCircleIcon className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getInstallationTypeIcon = (type: string) => {
    switch (type) {
      case "solar":
        return "☀️";
      case "charging":
        return "🔌";
      case "battery":
        return "🔋";
      case "heating":
        return "🔥";
      default:
        return "🔧";
    }
  };

  const formatInstallationDate = (dateString?: string): string => {
    if (!dateString) return "À planifier";
    
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Aujourd'hui à ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Demain à ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    }
  };

  const getClientForInstallation = (installation: Installation) => {
    return users.find(user => user.id === installation.client_id);
  };

  const getTodayInstallationBadge = () => {
    const count = todayInstallations.length;
    if (count === 0) return null;
    
    return (
      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
        {count}
      </span>
    );
  };

  const totalUnreadMessages = conversations.reduce((count, conv) => count + conv.unread_count, 0);

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 flex overflow-hidden">
          {/* Conversations Sidebar */}
          <div className="w-80 border-r flex flex-col bg-white">
            <div className="p-4 border-b flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                <div className="flex gap-2">
                  <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                    <BellIcon className="h-5 w-5 text-gray-500" />
                  </button>
                  <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                    <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
                  </button>
                  <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                    <PlusCircleIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher une conversation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#213f5b] focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              
              <div className="flex border rounded-lg overflow-hidden shadow-sm">
                <button
                  className={`flex-1 py-2 text-sm font-medium ${activeTab === 'all' ? 'bg-[#213f5b] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('all')}
                >
                  <div className="flex justify-center items-center gap-1">
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                    <span>Tous</span>
                  </div>
                </button>
                <button
                  className={`flex-1 py-2 text-sm font-medium ${activeTab === 'installations' ? 'bg-[#213f5b] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('installations')}
                >
                  <div className="flex justify-center items-center gap-1">
                    <WrenchScrewdriverIcon className="h-4 w-4" />
                    <span>Installations</span>
                  </div>
                </button>
                <button
                  className={`flex-1 py-2 text-sm font-medium ${activeTab === 'clients' ? 'bg-[#213f5b] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('clients')}
                >
                  <div className="flex justify-center items-center gap-1">
                    <BriefcaseIcon className="h-4 w-4" />
                    <span>Clients</span>
                  </div>
                </button>
                <button
                  className={`flex-1 py-2 text-sm font-medium ${activeTab === 'team' ? 'bg-[#213f5b] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('team')}
                >
                  <div className="flex justify-center items-center gap-1">
                    <UserCircleIcon className="h-4 w-4" />
                    <span>Équipe</span>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Today's Installations Section */}
            {activeTab === 'all' || activeTab === 'installations' ? (
              <div className="px-4 py-3 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    Installations du jour
                    {getTodayInstallationBadge()}
                  </h3>
                </div>
                {todayInstallations.length > 0 ? (
                  <div className="space-y-2">
                    {todayInstallations.map(installation => {
                      const client = getClientForInstallation(installation);
                      const relatedConversation = conversations.find(c => c.installation_id === installation.id);
                      
                      return (
                        <div 
                          key={installation.id}
                          className={`p-2 rounded-lg border ${
                            installation.status === "issue" ? "border-red-200 bg-red-50" :
                            installation.status === "in_progress" ? "border-yellow-200 bg-yellow-50" :
                            "border-blue-200 bg-blue-50"
                          } cursor-pointer hover:opacity-90 transition-opacity`}
                          onClick={() => relatedConversation && setSelectedConversation(relatedConversation)}
                        >
                          <div className="flex items-start gap-2">
                            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                              <span className="text-lg">{getInstallationTypeIcon(installation.type)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium text-gray-600 truncate">
                                  {formatInstallationDate(installation.scheduled_date)}
                                </span>
                                {getInstallationStatusIcon(installation.status)}
                              </div>
                              <p className="text-sm font-medium text-gray-900 truncate">{installation.name}</p>
                              <div className="flex items-center gap-1">
                                <MapPinIcon className="h-3 w-3 text-gray-500" />
                                <p className="text-xs text-gray-600 truncate">{installation.address}</p>
                              </div>
                              {client && (
                                <p className="text-xs text-gray-600 mt-1 truncate">
                                  {client.firstName} {client.lastName} {client.company ? `(${client.company})` : ""}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 text-center py-2">
                    Aucune installation prévue aujourd&apos;hui
                  </div>
                )}
              </div>
            ) : null}
            
            <div className="overflow-y-auto flex-1">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Aucune conversation trouvée
                </div>
              ) : (
                <ul className="divide-y">
                  {filteredConversations.map(conversation => (
                    <li 
                      key={conversation.id}
                      className={`cursor-pointer transition-colors ${selectedConversation?.id === conversation.id ? 'bg-[#bfddf9]/30' : 'hover:bg-gray-50'}`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="p-3 flex items-start gap-3">
                        <div className="relative flex-shrink-0">
                          {getConversationAvatar(conversation) ? (
                            <div className="relative">
                              <img 
                                src={getConversationAvatar(conversation)} 
                                alt={getConversationName(conversation)}
                                className="h-12 w-12 rounded-full object-cover"
                              />
                              {conversation.type === "coworker" && getUserStatus(users.find(u => u.id === conversation.participants.find(id => id !== "tech001"))?.status || "offline")}
                            </div>
                          ) : (
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                              conversation.type === "document" ? "bg-blue-100" :
                              conversation.type === "group" ? "bg-purple-100" :
                              conversation.type === "admin" ? "bg-red-100" :
                              conversation.type === "installation" ? "bg-yellow-100" : "bg-gray-100"
                            }`}>
                              {getConversationIcon(conversation) || (
                                <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-500" />
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {getConversationName(conversation)}
                            </h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {formatTimestamp(conversation.updated_at)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500 truncate">
                              {conversation.last_message?.content || (
                                conversation.type === "document" 
                                  ? "Document technique" 
                                  : conversation.type === "installation"
                                    ? "Discussion sur l'installation"
                                    : "Démarrer une conversation"
                              )}
                            </p>
                            
                            {conversation.unread_count > 0 && (
                              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#213f5b] text-white text-xs font-medium">
                                {conversation.unread_count}
                              </span>
                            )}
                          </div>
                          
                          {conversation.installation_id && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-yellow-600">
                              <WrenchScrewdriverIcon className="h-3.5 w-3.5" />
                              <span className="truncate">
                                {installations.find(i => i.id === conversation.installation_id)?.name || "Installation"}
                              </span>
                            </div>
                          )}
                          
                          {conversation.document_id && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-blue-600">
                              <DocumentTextIcon className="h-3.5 w-3.5" />
                              <span className="truncate">{conversation.document_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="h-16 border-b bg-white flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    {getConversationAvatar(selectedConversation) ? (
                      <div className="relative">
                        <img 
                          src={getConversationAvatar(selectedConversation)}
                          alt={getConversationName(selectedConversation)}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        {selectedConversation.type === "coworker" && getUserStatus(users.find(u => u.id === selectedConversation.participants.find(id => id !== "tech001"))?.status || "offline")}
                      </div>
                    ) : (
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        selectedConversation.type === "document" ? "bg-blue-100" :
                        selectedConversation.type === "group" ? "bg-purple-100" :
                        selectedConversation.type === "admin" ? "bg-red-100" :
                        selectedConversation.type === "installation" ? "bg-yellow-100" : "bg-gray-100"
                      }`}>
                        {getConversationIcon(selectedConversation) || (
                          <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    )}
                    
                    <div>
                      <h2 className="font-medium text-gray-900">
                        {getConversationName(selectedConversation)}
                      </h2>
                      {selectedConversation.type === "coworker" && (
                        <p className="text-xs text-gray-500">
                          {users.find(u => u.id === selectedConversation.participants.find(id => id !== "tech001"))?.status === "online"
                            ? "En ligne"
                            : "Hors ligne"
                          }
                        </p>
                      )}
                      {selectedConversation.type === "group" && (
                        <p className="text-xs text-gray-500">
                          {selectedConversation.participants.length} participants
                        </p>
                      )}
                      {selectedConversation.installation_id && (
                        <p className="text-xs text-yellow-600 flex items-center gap-1">
                          <WrenchScrewdriverIcon className="h-3.5 w-3.5" />
                          {installations.find(i => i.id === selectedConversation.installation_id)?.name || "Installation"}
                        </p>
                      )}
                      {selectedConversation.document_id && (
                        <p className="text-xs text-blue-600 flex items-center gap-1">
                          <DocumentTextIcon className="h-3.5 w-3.5" />
                          {selectedConversation.document_name}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <PhoneIcon className="h-5 w-5 text-gray-500" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <VideoCameraIcon className="h-5 w-5 text-gray-500" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <EllipsisHorizontalIcon className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="flex flex-col items-center">
                        <ArrowPathIcon className="h-8 w-8 text-[#213f5b] animate-spin" />
                        <p className="text-sm text-gray-500 mt-2">Chargement des messages...</p>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="h-16 w-16 rounded-full bg-[#bfddf9]/30 flex items-center justify-center mb-3">
                        <ChatBubbleLeftRightIcon className="h-8 w-8 text-[#213f5b]" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Démarrez la conversation</h3>
                      <p className="text-sm text-gray-500 mt-1">Envoyez un message pour commencer à discuter</p>
                    </div>
                  ) : (
                    <>
                      {/* Messages grouped by date */}
                      {Object.entries(showGroupedByDate).map(([date, messagesForDate]) => (
                        <div key={date}>
                          <div className="relative py-2 flex items-center">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink mx-4 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
                              {new Date(date).toLocaleDateString('fr-FR', { 
                                weekday: 'long', 
                                day: 'numeric', 
                                month: 'long' 
                              })}
                            </span>
                            <div className="flex-grow border-t border-gray-300"></div>
                          </div>
                          
                          <div className="space-y-3">
                            {messagesForDate.map((message, index) => {
                              const isCurrentUser = message.sender_id === "tech001";
                              const showAvatar = 
                                index === 0 || 
                                messagesForDate[index - 1].sender_id !== message.sender_id ||
                                new Date(message.timestamp).getTime() - new Date(messagesForDate[index - 1].timestamp).getTime() > 5 * 60 * 1000;
                              
                              const sender = users.find(u => u.id === message.sender_id);
                              
                              return (
                                <motion.div 
                                  key={message.id} 
                                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {!isCurrentUser && showAvatar && (
                                    <div className="flex-shrink-0 mr-3">
                                      {sender?.avatar_url ? (
                                        <img 
                                          src={sender.avatar_url} 
                                          alt={`${sender.firstName} ${sender.lastName}`}
                                          className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-sm"
                                        />
                                      ) : (
                                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center shadow-sm">
                                          <UserCircleIcon className="h-6 w-6 text-gray-500" />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  <div className={`max-w-[75%] ${!isCurrentUser && !showAvatar ? 'ml-11' : ''}`}>
                                    {showAvatar && (
                                      <div className={`text-xs text-gray-500 mb-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                                        {!isCurrentUser && (
                                          <span className="font-medium">{sender?.firstName || 'Utilisateur'} {sender?.lastName || ''}</span>
                                        )}
                                        <span className="ml-2 opacity-70">{formatTimestamp(message.timestamp)}</span>
                                      </div>
                                    )}
                                    
                                    <div className="space-y-2 relative group">
                                      {message.content && (
                                        <div 
                                          className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                                            isCurrentUser 
                                              ? 'bg-gradient-to-br from-[#213f5b] to-[#213f5b]/90 text-white' 
                                              : 'bg-white text-gray-900 border'
                                          }`}
                                        >
                                          <div className="whitespace-pre-wrap">{message.content}</div>
                                          
                                          {/* Message reactions menu - appears on hover */}
                                          <div className={`absolute ${isCurrentUser ? 'left-0 -translate-x-full pl-2' : 'right-0 translate-x-full pr-2'} top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 bg-white rounded-full shadow-md p-1`}>
                                            <button className="p-1 hover:bg-gray-100 rounded-full" title="J'aime">
                                              <HandThumbUpIcon className="h-4 w-4 text-gray-500" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-100 rounded-full" title="Répondre">
                                              <ChatBubbleLeftRightIcon className="h-4 w-4 text-gray-500" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-100 rounded-full" title="Plus">
                                              <EllipsisHorizontalIcon className="h-4 w-4 text-gray-500" />
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {/* If the message has a location */}
                                      {message.location && (
                                        <div 
                                          className={`px-3 py-3 rounded-xl shadow-sm ${
                                            isCurrentUser 
                                              ? 'bg-[#213f5b]/90 text-white' 
                                              : 'bg-white text-gray-900 border'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2 mb-1">
                                            <MapPinIcon className={`h-4 w-4 ${isCurrentUser ? 'text-white' : 'text-red-500'}`} />
                                            <p className="text-sm font-medium">Localisation</p>
                                          </div>
                                          <p className="text-sm mb-1">{message.location.address}</p>
                                          <div className="h-28 bg-gray-200 rounded-lg overflow-hidden relative">
                                            {/* This would be a map in real implementation */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                              <span className="text-gray-500">Carte non disponible</span>
                                            </div>
                                            <div className="absolute bottom-2 right-2">
                                              <button className="bg-white p-1.5 rounded-full shadow text-gray-800 text-xs">
                                                Ouvrir dans Maps
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {message.attachments && message.attachments.length > 0 && (
                                        <div className="space-y-2">
                                          {message.attachments.map(attachment => (
                                            <div 
                                              key={attachment.id}
                                              className={`px-3 py-3 rounded-xl shadow-sm ${
                                                isCurrentUser 
                                                  ? 'bg-[#213f5b]/90 text-white' 
                                                  : 'bg-white text-gray-900 border'
                                              }`}
                                            >
                                              <div className="flex items-center gap-3">
                                                {attachment.type.startsWith('image/') && attachment.thumbnail_url ? (
                                                  <img 
                                                    src={attachment.thumbnail_url}
                                                    alt={attachment.name}
                                                    className="h-12 w-12 object-cover rounded-lg shadow-sm"
                                                  />
                                                ) : (
                                                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${isCurrentUser ? 'bg-white/20' : 'bg-gray-100'}`}>
                                                    <DocumentTextIcon className={`h-6 w-6 ${isCurrentUser ? 'text-white' : 'text-gray-500'}`} />
                                                  </div>
                                                )}
                                                
                                                <div className="min-w-0 flex-1">
                                                  <p className="text-sm font-medium truncate">{attachment.name}</p>
                                                  <p className="text-xs opacity-80">{formatFileSize(attachment.size)}</p>
                                                </div>
                                                
                                                <div className="flex items-center gap-1">
                                                  <button className={`p-1.5 rounded-full ${isCurrentUser ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`} title="Télécharger">
                                                    <ArrowDownTrayIcon className="h-4 w-4" />
                                                  </button>
                                                  <button className={`p-1.5 rounded-full ${isCurrentUser ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`} title="Aperçu">
                                                    <EyeIcon className="h-4 w-4" />
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    
                                    {isCurrentUser && (
                                      <div className="text-right mt-1 flex items-center justify-end gap-1">
                                        <span className="text-xs text-gray-500">{formatTimestamp(message.timestamp).includes(':') ? formatTimestamp(message.timestamp) : ''}</span>
                                        {getStatusIcon(message.status)}
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      
                      {/* Typing indicator */}
                      {isTyping && (
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3">
                            {selectedConversation && (
                              <div className="relative">
                                {getConversationAvatar(selectedConversation) ? (
                                  <img 
                                    src={getConversationAvatar(selectedConversation)}
                                    alt="typing"
                                    className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-sm"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center shadow-sm">
                                    {getConversationIcon(selectedConversation) || (
                                      <UserCircleIcon className="h-6 w-6 text-gray-500" />
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="bg-white border rounded-xl px-3 py-2 shadow-sm">
                            <div className="flex space-x-1">
                              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>
                
                {/* Message Input */}
                <div className="bg-white border-t p-3">
                  {/* Formatting options */}
                  {showFormatting && (
                    <div className="mb-3 p-2 bg-gray-50 rounded-lg border flex items-center justify-between">
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded hover:bg-gray-200 transition-colors" title="Gras">
                          <span className="font-bold text-sm">B</span>
                        </button>
                        <button className="p-1.5 rounded hover:bg-gray-200 transition-colors" title="Italique">
                          <span className="italic text-sm">I</span>
                        </button>
                        <button className="p-1.5 rounded hover:bg-gray-200 transition-colors" title="Souligné">
                          <span className="underline text-sm">U</span>
                        </button>
                        <div className="h-6 mx-1 border-l border-gray-300"></div>
                        <button className="p-1.5 rounded hover:bg-gray-200 transition-colors" title="Liste à puces">
                          <span className="text-sm">•</span>
                        </button>
                        <button className="p-1.5 rounded hover:bg-gray-200 transition-colors" title="Liste numérotée">
                          <span className="text-sm">1.</span>
                        </button>
                        <div className="h-6 mx-1 border-l border-gray-300"></div>
                        <button className="p-1.5 rounded hover:bg-gray-200 transition-colors" title="Lien">
                          <LinkIcon className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                      <button 
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                        onClick={() => setShowFormatting(false)}
                      >
                        <XMarkIcon className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  )}
                  
                  {/* Attachments preview */}
{attachments.length > 0 && (
  <div className="mb-3 flex gap-3 overflow-x-auto py-2 px-1">
    {attachments.map((file, index) => (
      <motion.div 
        key={index} 
        className="flex-shrink-0 relative group"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {file.type.startsWith("image/") ? (
          <div className="w-24 h-24 relative rounded-lg overflow-hidden border shadow-sm group-hover:shadow transition-shadow">
            <img 
              src={URL.createObjectURL(file)} 
              alt={file.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors">
              <button 
                className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeAttachment(index)}
              >
                <XMarkIcon className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-24 h-24 flex flex-col items-center justify-center bg-gray-50 rounded-lg border shadow-sm group-hover:shadow p-2 transition-shadow">
            <DocumentTextIcon className="h-8 w-8 text-blue-500" />
            <p className="text-xs text-center font-medium truncate w-full mt-1">{file.name.split('.').pop()?.toUpperCase()}</p>
            <p className="text-xs text-gray-500 truncate w-full">{formatFileSize(Math.round(file.size / 1024))}</p>
            <button 
              className="absolute top-1 right-1 bg-gray-200/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeAttachment(index)}
            >
              <XMarkIcon className="h-3.5 w-3.5 text-gray-700" />
            </button>
          </div>
        )}
      </motion.div>
    ))}
  </div>
)}

<div className="relative flex items-center">
  <div className="absolute left-3 flex gap-2">
    <button
      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
      onClick={() => fileInputRef.current?.click()}
      title="Joindre un fichier"
    >
      <PaperClipIcon className="h-5 w-5 text-gray-500" />
    </button>
    <input
      type="file"
      ref={fileInputRef}
      className="hidden"
      multiple
      onChange={handleFileUpload}
    />
    
    <button 
      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
      title="Joindre une image"
    >
      <PhotoIcon className="h-5 w-5 text-gray-500" />
    </button>
    
    <button 
      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
      onClick={() => setShowFormatting(!showFormatting)}
      title="Formater le texte"
    >
      <PencilIcon className="h-5 w-5 text-gray-500" />
    </button>
  </div>
  
  <textarea
    value={newMessage}
    onChange={handleNewMessageChange}
    onKeyDown={handleKeyPress}
    placeholder="Écrivez votre message..."
    className="w-full pl-24 pr-20 py-3 border rounded-xl resize-none text-sm focus:ring-2 focus:ring-[#213f5b] focus:border-transparent shadow-sm"
    rows={1}
    style={{ maxHeight: '150px' }}
  />
  
  <div className="absolute right-3 flex gap-2">
    <button 
      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors relative"
      title="Ajouter un emoji"
    >
      <FaceSmileIcon className="h-5 w-5 text-gray-500" />
      {showEmojiPicker && (
        <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border p-2">
          {/* Emoji picker content */}
        </div>
      )}
    </button>
    
    <button 
      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors relative"
      title="Réponses rapides"
    >
      <BoltIcon className="h-5 w-5 text-gray-500" />
    </button>
    
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={`p-2 rounded-full transition-all ${
        newMessage.trim() || attachments.length > 0
          ? 'bg-[#213f5b] hover:bg-[#213f5b]/90 text-white shadow-md'
          : 'bg-gray-100 text-gray-400'
      }`}
      onClick={handleSendMessage}
      disabled={!newMessage.trim() && attachments.length === 0}
      title="Envoyer"
    >
      <PaperAirplaneIcon className="h-5 w-5" />
    </motion.button>
  </div>
</div>

{/* Quick responses for installations */}
{selectedConversation?.type === "installation" && (
  <div className="mt-3 flex flex-wrap gap-2">
    <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700">
      Je serai sur place dans 15 minutes
    </button>
    <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700">
      Installation terminée, tout fonctionne correctement
    </button>
    <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700">
      Besoin d&apos;informations complémentaires
    </button>
  </div>
)}
</div>
</>
) : (
<div className="flex flex-col items-center justify-center h-full">
  <div className="h-20 w-20 rounded-full bg-[#bfddf9]/30 flex items-center justify-center mb-4">
    <EnvelopeIcon className="h-10 w-10 text-[#213f5b]" />
  </div>
  <h3 className="text-xl font-medium text-gray-900">Sélectionnez une conversation</h3>
  <p className="text-sm text-gray-500 mt-2 mb-6">Cliquez sur une conversation pour afficher les messages</p>
  
  {totalUnreadMessages > 0 && (
    <div className="flex items-center gap-2 bg-[#213f5b]/5 px-4 py-2 rounded-full">
      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#213f5b] text-white text-xs font-medium">
        {totalUnreadMessages}
      </span>
      <span className="text-sm text-[#213f5b]">messages non lus</span>
    </div>
  )}
  
  {upcomingInstallations.length > 0 && (
    <div className="mt-8 w-full max-w-md">
      <h4 className="text-sm font-semibold text-gray-900 mb-3 px-4">Prochaines installations</h4>
      <div className="space-y-2 px-4">
        {upcomingInstallations.map(installation => {
          const client = getClientForInstallation(installation);
          
          return (
            <div 
              key={installation.id}
              className="p-2 rounded-lg border border-blue-200 bg-blue-50"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{getInstallationTypeIcon(installation.type)}</span>
                <span className="text-sm font-medium text-gray-900">{installation.name}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                <CalendarDaysIcon className="h-3.5 w-3.5" />
                <span>{formatInstallationDate(installation.scheduled_date)}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <MapPinIcon className="h-3.5 w-3.5" />
                <span className="truncate">{installation.address}</span>
              </div>
              {client && (
                <p className="text-xs text-gray-600 mt-1">
                  Client: {client.firstName} {client.lastName}
                </p>
              )}
            </div>
          );
        })}
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