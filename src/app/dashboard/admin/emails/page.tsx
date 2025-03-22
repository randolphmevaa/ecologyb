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
  // EnvelopeIcon,
  BriefcaseIcon,
  HandThumbUpIcon,
  PencilIcon,
  LinkIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CogIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

/** ---------------------
 *    TYPE DEFINITIONS
 *  --------------------- */
type MessageStatus = "sent" | "delivered" | "read" | "failed";
type UserStatus = "online" | "offline" | "away" | "busy";
type ConversationType = "individual" | "group" | "admin" | "document" | "client" | "system" | "support";

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
  priority?: "normal" | "high" | "urgent";
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
  department?: string;
  isAdmin?: boolean;
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
  priority?: "normal" | "high" | "urgent";
}

/** ---------------------
 *     MAIN COMPONENT
 *  --------------------- */
export default function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "staff" | "unread" | "client" | "support">("all");
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showFormatting, setShowFormatting] = useState(false);
  const [showGroupedByDate, setShowGroupedByDate] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [, setUserInfo] = useState<{ _id: string; email: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample admin staff data
  const sampleStaff: User[] = [
    {
      id: "admin001",
      firstName: "Marie",
      lastName: "Legrand",
      email: "m.legrand@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/women/23.jpg",
      role: "Directrice",
      status: "online",
      department: "Direction",
      isAdmin: true
    },
    {
      id: "admin002",
      firstName: "Philippe",
      lastName: "Dupont",
      email: "p.dupont@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/men/54.jpg",
      role: "Responsable Technique",
      status: "busy",
      department: "Technique",
      isAdmin: true
    },
    {
      id: "admin003",
      firstName: "Sophie",
      lastName: "Moreau",
      email: "s.moreau@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/women/42.jpg",
      role: "Responsable RH",
      status: "away",
      department: "Ressources Humaines",
      isAdmin: true
    },
    {
      id: "admin004",
      firstName: "Nicolas",
      lastName: "Bernard",
      email: "n.bernard@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/men/36.jpg",
      role: "Responsable Finance",
      status: "online",
      department: "Finance",
      isAdmin: true
    }
  ];

  // Sample regular staff data
  const sampleRegularStaff: User[] = [
    {
      id: "user001",
      firstName: "Thomas",
      lastName: "Dubois",
      email: "thomas.dubois@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "Commercial",
      status: "online",
      department: "Commercial"
    },
    {
      id: "user002",
      firstName: "Léa",
      lastName: "Martin",
      email: "lea.martin@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
      role: "Support",
      status: "online",
      department: "Support"
    },
    {
      id: "user003",
      firstName: "Pierre",
      lastName: "Laurent",
      email: "pierre.laurent@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/men/62.jpg",
      role: "Technicien",
      status: "busy",
      last_active: "2025-03-16T10:30:00Z",
      department: "Technique"
    },
    {
      id: "user004",
      firstName: "Équipe",
      lastName: "Support",
      email: "support@ecologyb.fr",
      avatar_url: "",
      role: "Support",
      status: "online",
      department: "Support"
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
    }
  ];

  // Sample system accounts
  const sampleSystemAccounts: User[] = [
    {
      id: "system001",
      firstName: "Système",
      lastName: "Notifications",
      email: "system@ecologyb.fr",
      role: "Système",
      status: "online",
      department: "Système"
    },
    {
      id: "system002",
      firstName: "Alertes",
      lastName: "Automatiques",
      email: "alerts@ecologyb.fr",
      role: "Système",
      status: "online",
      department: "Système"
    }
  ];

  // Sample conversation data specifically for admin
  const sampleAdminConversations: Conversation[] = [
    {
      id: "adminconv001",
      type: "admin",
      name: "Direction - Planification Q2",
      participants: ["admin001", "admin002", "admin003", "admin004"],
      unread_count: 5,
      created_at: "2025-03-10T09:30:00Z",
      updated_at: "2025-03-18T14:35:00Z",
      is_pinned: true,
      priority: "high"
    },
    {
      id: "adminconv002",
      type: "system",
      name: "Alertes Système",
      participants: ["admin001", "system001"],
      unread_count: 3,
      created_at: "2025-03-15T08:20:00Z",
      updated_at: "2025-03-19T09:15:00Z",
      is_pinned: true,
      priority: "urgent"
    },
    {
      id: "adminconv003",
      type: "individual",
      participants: ["admin001", "user001"],
      unread_count: 1,
      created_at: "2025-03-16T10:40:00Z",
      updated_at: "2025-03-16T15:22:00Z"
    },
    {
      id: "adminconv004",
      type: "document",
      name: "Rapport Financier Trimestriel",
      participants: ["admin001", "admin004", "user003"],
      unread_count: 0,
      created_at: "2025-03-12T11:30:00Z",
      updated_at: "2025-03-17T16:45:00Z",
      document_id: "DOC-2025-FIN-Q1",
      document_name: "Rapport Financier - Q1 2025"
    },
    {
      id: "adminconv005",
      type: "support",
      name: "Support - Problèmes Techniques",
      participants: ["admin001", "user002", "user004"],
      unread_count: 2,
      created_at: "2025-03-14T09:15:00Z",
      updated_at: "2025-03-19T10:30:00Z"
    },
    {
      id: "adminconv006",
      type: "group",
      name: "Équipe Direction",
      participants: ["admin001", "admin002", "admin003", "admin004"],
      unread_count: 0,
      created_at: "2025-02-28T14:00:00Z",
      updated_at: "2025-03-18T11:20:00Z"
    },
    {
      id: "adminconv007",
      type: "client",
      participants: ["admin001", "client001"],
      unread_count: 0,
      created_at: "2025-03-15T13:30:00Z",
      updated_at: "2025-03-17T09:45:00Z"
    },
    {
      id: "adminconv008",
      type: "system",
      name: "Rapports Automatiques",
      participants: ["admin001", "system002"],
      unread_count: 1,
      created_at: "2025-03-01T00:00:00Z",
      updated_at: "2025-03-19T00:01:00Z"
    },
    {
      id: "adminconv009",
      type: "document",
      name: "Plan Stratégique 2025-2027",
      participants: ["admin001", "admin002", "admin003", "admin004"],
      unread_count: 0,
      created_at: "2025-03-10T15:20:00Z",
      updated_at: "2025-03-15T11:35:00Z",
      document_id: "DOC-2025-STRAT-01",
      document_name: "Plan Stratégique Ecology'B 2025-2027"
    }
  ];

  // Sample messages for admin conversations
  const sampleAdminMessages: Record<string, Message[]> = {
    "adminconv001": [
      {
        id: "admsg001",
        conversation_id: "adminconv001",
        sender_id: "admin003",
        content: "Bonjour à tous, j'aimerais planifier une réunion pour discuter des objectifs du Q2. Êtes-vous disponibles lundi prochain à 10h ?",
        timestamp: "2025-03-18T09:30:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "admsg002",
        conversation_id: "adminconv001",
        sender_id: "admin002",
        content: "Bonjour Sophie, je suis disponible lundi. Je préparerai une présentation sur les projets techniques en cours.",
        timestamp: "2025-03-18T09:45:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "admsg003",
        conversation_id: "adminconv001",
        sender_id: "admin004",
        content: "Je serai également présent. J'ai terminé l'analyse des performances du Q1, je pourrai la présenter lors de cette réunion.",
        timestamp: "2025-03-18T10:15:00Z",
        status: "read",
        is_read: true,
        attachments: [
          {
            id: "adatt001",
            name: "Analyse_Performance_Q1_2025.pdf",
            type: "application/pdf",
            size: 3240,
            url: "#",
            thumbnail_url: "https://via.placeholder.com/100x100/213f5b/FFFFFF?text=PDF"
          }
        ]
      },
      {
        id: "admsg004",
        conversation_id: "adminconv001",
        sender_id: "admin001",
        content: "Excellentes nouvelles. J'aimerais aussi que nous abordions le lancement des nouveaux projets solaires. La Région a confirmé son soutien financier hier.",
        timestamp: "2025-03-18T11:30:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "admsg005",
        conversation_id: "adminconv001",
        sender_id: "admin003",
        content: "Super ! Je vais préparer une note sur les besoins en recrutement pour ces nouveaux projets. Nous aurons besoin de renforcer les équipes techniques.",
        timestamp: "2025-03-18T14:35:00Z",
        status: "delivered",
        is_read: false
      }
    ],
    "adminconv002": [
      {
        id: "admsg101",
        conversation_id: "adminconv002",
        sender_id: "system001",
        content: "⚠️ ALERTE SYSTÈME : Le serveur principal a atteint 90% de sa capacité de stockage. Une intervention est nécessaire dans les 48 heures.",
        timestamp: "2025-03-18T08:00:00Z",
        status: "delivered",
        is_read: true,
        priority: "high"
      },
      {
        id: "admsg102",
        conversation_id: "adminconv002",
        sender_id: "admin001",
        content: "Message reçu. Je vais contacter le service informatique pour qu'ils étendent la capacité du serveur.",
        timestamp: "2025-03-18T08:15:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "admsg103",
        conversation_id: "adminconv002",
        sender_id: "system001",
        content: "⚠️ ALERTE SÉCURITÉ : Plusieurs tentatives d'accès non autorisées détectées depuis l'adresse IP 192.168.1.45. L'accès a été bloqué automatiquement.",
        timestamp: "2025-03-19T04:30:00Z",
        status: "delivered",
        is_read: false,
        priority: "urgent"
      },
      {
        id: "admsg104",
        conversation_id: "adminconv002",
        sender_id: "system001",
        content: "ℹ️ INFORMATION : La sauvegarde quotidienne des données a été réalisée avec succès à 03:00.",
        timestamp: "2025-03-19T03:05:00Z",
        status: "delivered",
        is_read: false
      },
      {
        id: "admsg105",
        conversation_id: "adminconv002",
        sender_id: "system001",
        content: "⚠️ ALERTE MAINTENANCE : Une mise à jour du système est prévue ce soir à 22:00. Une interruption de service de 30 minutes est à prévoir.",
        timestamp: "2025-03-19T09:15:00Z",
        status: "delivered",
        is_read: false,
        priority: "high"
      }
    ],
    "adminconv003": [
      {
        id: "admsg201",
        conversation_id: "adminconv003",
        sender_id: "user001",
        content: "Bonjour Madame la Directrice, j'aimerais vous présenter les résultats de la dernière campagne commerciale. Pouvons-nous prévoir un moment cette semaine ?",
        timestamp: "2025-03-16T10:40:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "admsg202",
        conversation_id: "adminconv003",
        sender_id: "admin001",
        content: "Bonjour Thomas, merci pour votre message. Je suis disponible demain entre 14h et 16h, ou jeudi matin. Qu'est-ce qui vous conviendrait le mieux ?",
        timestamp: "2025-03-16T11:15:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "admsg203",
        conversation_id: "adminconv003",
        sender_id: "user001",
        content: "Demain 14h30 serait parfait. J'ai préparé un rapport détaillé que je vous envoie en avance pour que vous puissiez en prendre connaissance.",
        timestamp: "2025-03-16T11:45:00Z",
        status: "read",
        is_read: true,
        attachments: [
          {
            id: "adatt201",
            name: "Rapport_Campagne_Commerciale_Mars2025.pdf",
            type: "application/pdf",
            size: 2750,
            url: "#",
            thumbnail_url: "https://via.placeholder.com/100x100/213f5b/FFFFFF?text=PDF"
          }
        ]
      },
      {
        id: "admsg204",
        conversation_id: "adminconv003",
        sender_id: "admin001",
        content: "Parfait, c'est noté pour demain à 14h30. Je vais étudier votre rapport dès aujourd'hui. Merci pour votre réactivité.",
        timestamp: "2025-03-16T14:20:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "admsg205",
        conversation_id: "adminconv003",
        sender_id: "user001",
        content: "Je viens de recevoir une demande importante de la Mairie de Lyon. Ils souhaitent un devis pour l'installation de panneaux solaires sur 5 bâtiments municipaux. Je pense que ce serait intéressant d'en discuter également demain.",
        timestamp: "2025-03-16T15:22:00Z",
        status: "delivered",
        is_read: false
      }
    ],
    "adminconv005": [
      {
        id: "admsg401",
        conversation_id: "adminconv005",
        sender_id: "user004",
        content: "Bonjour à tous. Nous avons reçu plusieurs signalements concernant des problèmes de connexion à l'application mobile. L'équipe technique est-elle au courant ?",
        timestamp: "2025-03-19T08:45:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "admsg402",
        conversation_id: "adminconv005",
        sender_id: "user002",
        content: "Oui, nous sommes en train d'investiguer. Il semble y avoir un problème avec le dernier déploiement. Nous travaillons sur un correctif.",
        timestamp: "2025-03-19T08:55:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "admsg403",
        conversation_id: "adminconv005",
        sender_id: "admin001",
        content: "Merci pour ces informations. Pouvez-vous estimer le temps nécessaire pour résoudre ce problème ? Devons-nous prévenir les clients ?",
        timestamp: "2025-03-19T09:10:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "admsg404",
        conversation_id: "adminconv005",
        sender_id: "user002",
        content: "Nous pensons pouvoir déployer le correctif d'ici 2 heures. Le problème n'affecte que l'affichage des statistiques de consommation, les fonctionnalités principales restent opérationnelles.",
        timestamp: "2025-03-19T09:30:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "admsg405",
        conversation_id: "adminconv005",
        sender_id: "user004",
        content: "Nous avons commencé à recevoir des appels de clients. Je propose d'envoyer un message automatique pour les informer de la situation et du délai de résolution.",
        timestamp: "2025-03-19T10:30:00Z",
        status: "delivered",
        is_read: false
      }
    ],
    "adminconv008": [
      {
        id: "admsg501",
        conversation_id: "adminconv008",
        sender_id: "system002",
        content: "📊 RAPPORT QUOTIDIEN : Performance des installations solaires (18/03/2025)\n\n• Production totale : 245.8 kWh\n• Économies réalisées : 42.3 €\n• Réduction CO2 : 98.3 kg\n• Installations en maintenance : 2\n• Efficacité moyenne : 92%",
        timestamp: "2025-03-19T00:01:00Z",
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
    const allUsers: User[] = [...sampleStaff, ...sampleRegularStaff, ...sampleClients, ...sampleSystemAccounts];
    setUsers(allUsers);
    setConversations(sampleAdminConversations);
    
    // Get user info from localStorage
    const adminInfo = localStorage.getItem("adminInfo");
    if (adminInfo) {
      setUserInfo(JSON.parse(adminInfo));
    }
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      // Simulate fetching messages for the selected conversation
      setIsLoading(true);
      setTimeout(() => {
        const conversationMessages = sampleAdminMessages[selectedConversation.id] || [];
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
        if (selectedConversation.id === "adminconv003" || selectedConversation.id === "adminconv005") {
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
      if (activeTab === "staff" && (conv.type !== "individual" && conv.type !== "group")) return false;
      if (activeTab === "unread" && conv.type !== "system") return false;
      if (activeTab === "client" && conv.type !== "client") return false;
      if (activeTab === "support" && conv.type !== "support") return false;
      
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
      // Sort by priority first, then pinned status, then by last update
      if (a.priority === "urgent" && b.priority !== "urgent") return -1;
      if (a.priority !== "urgent" && b.priority === "urgent") return 1;
      if (a.priority === "high" && b.priority !== "high" && b.priority !== "urgent") return -1;
      if (a.priority !== "high" && a.priority !== "urgent" && b.priority === "high") return 1;
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

  const handleSendMessage = () => {
    if (!selectedConversation || (!newMessage.trim() && attachments.length === 0)) return;
    
    const newMsg: Message = {
      id: `msg${Date.now()}`,
      conversation_id: selectedConversation.id,
      sender_id: "admin001", // Using the main admin ID
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
    
    if (conversation.type === "individual") {
      const otherParticipantId = conversation.participants.find(id => id !== "admin001");
      const otherUser = users.find(user => user.id === otherParticipantId);
      return otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "Conversation";
    }
    
    if (conversation.type === "system") {
      return "Système Ecology'B";
    }
    
    if (conversation.type === "document") {
      return conversation.document_name || "Discussion document";
    }
    
    if (conversation.type === "client") {
      const clientId = conversation.participants.find(id => id !== "admin001");
      const client = users.find(user => user.id === clientId);
      if (client) {
        const company = client.company;
        return company ? `${client.firstName} ${client.lastName} (${company})` : `${client.firstName} ${client.lastName}`;
      }
      return "Client";
    }
    
    if (conversation.type === "support") {
      return "Équipe Support";
    }
    
    return `Groupe (${conversation.participants.length - 1})`;
  };

  const getConversationAvatar = (conversation: Conversation): string => {
    if (conversation.type === "individual" || conversation.type === "client") {
      const otherParticipantId = conversation.participants.find(id => id !== "admin001");
      const otherUser = users.find(user => user.id === otherParticipantId);
      return otherUser?.avatar_url || "";
    }
    
    if (conversation.type === "admin") {
      return "https://randomuser.me/api/portraits/women/23.jpg"; // Admin avatar
    }
    
    return ""; // Use default icon
  };

  const getConversationIcon = (conversation: Conversation) => {
    if (conversation.type === "document") {
      return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
    }
    
    if (conversation.type === "group") {
      return <UserGroupIcon className="h-5 w-5 text-purple-500" />;
    }
    
    if (conversation.type === "admin") {
      return <ShieldCheckIcon className="h-5 w-5 text-red-500" />;
    }
    
    if (conversation.type === "client") {
      return <BriefcaseIcon className="h-5 w-5 text-green-500" />;
    }
    
    if (conversation.type === "system") {
      return <CogIcon className="h-5 w-5 text-gray-500" />;
    }
    
    if (conversation.type === "support") {
      return <ClipboardDocumentCheckIcon className="h-5 w-5 text-amber-500" />;
    }
    
    return null;
  };

  const getPriorityIcon = (priority?: string) => {
    if (priority === "urgent") {
      return <span className="inline-flex items-center justify-center h-3 w-3 bg-red-500 rounded-full mr-1.5"></span>;
    }
    
    if (priority === "high") {
      return <span className="inline-flex items-center justify-center h-3 w-3 bg-amber-500 rounded-full mr-1.5"></span>;
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

  const totalUnreadMessages = conversations.reduce((count, conv) => count + conv.unread_count, 0);
  const urgentUnreadMessages = conversations.filter(conv => conv.priority === "urgent" && conv.unread_count > 0).reduce((count, conv) => count + conv.unread_count, 0);

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 flex overflow-hidden">
          {/* Conversations Sidebar */}
          <div className="w-80 border-r flex flex-col bg-white">
            <div className="p-4 border-b flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Administration</h2>
                <div className="flex gap-2">
                  <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors relative">
                    <BellIcon className="h-5 w-5 text-gray-500" />
                    {totalUnreadMessages > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                        {totalUnreadMessages}
                      </span>
                    )}
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
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#213f5b] focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              
              {urgentUnreadMessages > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-medium text-red-700">{urgentUnreadMessages} alertes urgentes</span>
                  </div>
                  <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                    Voir
                  </button>
                </div>
              )}
              
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
                className={`flex-1 py-2 text-sm font-medium ${activeTab === 'staff' ? 'bg-[#213f5b] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('staff')}
              >
                <div className="flex justify-center items-center gap-1">
                  <UserGroupIcon className="h-4 w-4" />
                  <span>Équipe</span>
                </div>
              </button>
              <button
                className={`flex-1 py-2 text-sm font-medium ${activeTab === 'unread' ? 'bg-[#213f5b] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('unread')}
              >
                <div className="flex justify-center items-center gap-1">
                  <BellIcon className="h-4 w-4" />
                  <span>Non lue</span>
                </div>
              </button>
              <button
                className={`flex-1 py-2 text-sm font-medium ${activeTab === 'client' ? 'bg-[#213f5b] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('client')}
              >
                <div className="flex justify-center items-center gap-1">
                  <BriefcaseIcon className="h-4 w-4" />
                  <span>Clients</span>
                </div>
              </button>
            </div>
            </div>
            
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
                      className={`cursor-pointer transition-colors ${selectedConversation?.id === conversation.id ? 'bg-[#bfddf9]/30' : conversation.priority === "urgent" ? 'bg-red-50 hover:bg-red-100/70' : conversation.priority === "high" ? 'bg-amber-50 hover:bg-amber-100/70' : 'hover:bg-gray-50'}`}
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
                              {conversation.type === "individual" && getUserStatus(users.find(u => u.id === conversation.participants.find(id => id !== "admin001"))?.status || "offline")}
                            </div>
                          ) : (
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                              conversation.type === "document" ? "bg-blue-100" :
                              conversation.type === "group" ? "bg-purple-100" :
                              conversation.type === "admin" ? "bg-red-100" :
                              conversation.type === "system" ? "bg-gray-100" :
                              conversation.type === "support" ? "bg-amber-100" : "bg-gray-100"
                            }`}>
                              {getConversationIcon(conversation) || (
                                <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-500" />
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="text-sm font-medium text-gray-900 truncate flex items-center">
                              {getPriorityIcon(conversation.priority)}
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
                                  ? "Discussion à propos d'un document" 
                                  : conversation.type === "system"
                                  ? "Notifications système"
                                  : "Démarrer une conversation"
                              )}
                            </p>
                            
                            {conversation.unread_count > 0 && (
                              <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full text-white text-xs font-medium ${
                                conversation.priority === "urgent" ? "bg-red-500" :
                                conversation.priority === "high" ? "bg-amber-500" : "bg-[#213f5b]"
                              }`}>
                                {conversation.unread_count}
                              </span>
                            )}
                          </div>
                          
                          {conversation.document_id && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-blue-600">
                              <DocumentTextIcon className="h-3.5 w-3.5" />
                              <span className="truncate">{conversation.document_name}</span>
                            </div>
                          )}
                          
                          {conversation.type === "admin" && !conversation.document_id && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
                              <ShieldCheckIcon className="h-3.5 w-3.5" />
                              <span>Administration</span>
                            </div>
                          )}
                          
                          {conversation.type === "system" && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                              <CogIcon className="h-3.5 w-3.5" />
                              <span>Système</span>
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
                        {selectedConversation.type === "individual" && getUserStatus(users.find(u => u.id === selectedConversation.participants.find(id => id !== "admin001"))?.status || "offline")}
                      </div>
                    ) : (
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        selectedConversation.type === "document" ? "bg-blue-100" :
                        selectedConversation.type === "group" ? "bg-purple-100" :
                        selectedConversation.type === "admin" ? "bg-red-100" :
                        selectedConversation.type === "system" ? "bg-gray-100" :
                        selectedConversation.type === "support" ? "bg-amber-100" : "bg-gray-100"
                      }`}>
                        {getConversationIcon(selectedConversation) || (
                          <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    )}
                    
                    <div>
                      <h2 className="font-medium text-gray-900 flex items-center">
                        {getPriorityIcon(selectedConversation.priority)}
                        {getConversationName(selectedConversation)}
                      </h2>
                      {selectedConversation.type === "individual" && (
                        <p className="text-xs text-gray-500">
                          {users.find(u => u.id === selectedConversation.participants.find(id => id !== "admin001"))?.status === "online"
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
                      {selectedConversation.document_id && (
                        <p className="text-xs text-blue-600 flex items-center gap-1">
                          <DocumentTextIcon className="h-3.5 w-3.5" />
                          {selectedConversation.document_name}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {selectedConversation.type !== "system" && (
                      <>
                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                          <PhoneIcon className="h-5 w-5 text-gray-500" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                          <VideoCameraIcon className="h-5 w-5 text-gray-500" />
                        </button>
                      </>
                    )}
                    {selectedConversation.type === "system" && (
                      <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <ChartBarIcon className="h-5 w-5 text-gray-500" />
                      </button>
                    )}
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
                              const isCurrentUser = message.sender_id === "admin001";
                              const isSystemMessage = message.sender_id.startsWith("system");
                              const showAvatar = 
                                index === 0 || 
                                messagesForDate[index - 1].sender_id !== message.sender_id ||
                                new Date(message.timestamp).getTime() - new Date(messagesForDate[index - 1].timestamp).getTime() > 5 * 60 * 1000;
                              
                              const sender = users.find(u => u.id === message.sender_id);
                              
                              return (
                                <motion.div 
                                  key={message.id} 
                                  className={`flex ${isCurrentUser ? 'justify-end' : isSystemMessage ? 'justify-center' : 'justify-start'}`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {!isCurrentUser && !isSystemMessage && showAvatar && (
                                    <div className="flex-shrink-0 mr-3">
                                      {sender?.avatar_url ? (
                                        <img 
                                          src={sender.avatar_url} 
                                          alt={`${sender.firstName} ${sender.lastName}`}
                                          className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-sm"
                                        />
                                      ) : (
                                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center shadow-sm">
                                          {sender?.id.startsWith("system") ? (
                                            <CogIcon className="h-6 w-6 text-gray-500" />
                                          ) : (
                                            <UserCircleIcon className="h-6 w-6 text-gray-500" />
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  <div className={`${isSystemMessage ? 'max-w-[90%]' : 'max-w-[75%]'} ${!isCurrentUser && !isSystemMessage && !showAvatar ? 'ml-11' : ''}`}>
                                    {showAvatar && !isSystemMessage && (
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
                                              : isSystemMessage
                                              ? message.priority === "urgent"
                                                ? 'bg-red-100 text-red-800 border border-red-200'
                                                : message.priority === "high"
                                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                                              : 'bg-white text-gray-900 border'
                                          }`}
                                        >
                                          <div className="whitespace-pre-wrap">{message.content}</div>
                                          
                                          {/* Message reactions menu - appears on hover */}
                                          {!isSystemMessage && (
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
                                          )}
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
                  {/* Only show input for non-system conversations */}
                  {selectedConversation.type !== "system" ? (
                    <>
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
                      
                      {/* Optional quick responses for admin */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700">
                          Je prends en charge ce sujet
                        </button>
                        <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700">
                          Merci pour ces informations
                        </button>
                        <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700">
                          Planifions une réunion
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Ce canal est réservé aux notifications système automatiques.</span>
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 text-sm bg-white border hover:bg-gray-50 rounded-lg transition-colors text-gray-700 flex items-center gap-1 shadow-sm">
                            <ChartBarIcon className="h-4 w-4" />
                            <span>Statistiques</span>
                          </button>
                          <button className="px-3 py-1.5 text-sm bg-[#213f5b] hover:bg-[#213f5b]/90 rounded-lg transition-colors text-white flex items-center gap-1 shadow-sm">
                            <CogIcon className="h-4 w-4" />
                            <span>Paramètres</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="h-20 w-20 rounded-full bg-[#bfddf9]/30 flex items-center justify-center mb-4">
                  <ShieldCheckIcon className="h-10 w-10 text-[#213f5b]" />
                </div>
                <h3 className="text-xl font-medium text-gray-900">Administration Ecology&apos;B</h3>
                <p className="text-sm text-gray-500 mt-2 mb-6">Sélectionnez une conversation pour afficher les messages</p>
                
                {totalUnreadMessages > 0 && (
                  <div className="flex items-center gap-2 bg-[#213f5b]/5 px-4 py-2 rounded-full">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#213f5b] text-white text-xs font-medium">
                      {totalUnreadMessages}
                    </span>
                    <span className="text-sm text-[#213f5b]">messages non lus</span>
                  </div>
                )}
                
                {urgentUnreadMessages > 0 && (
                  <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full mt-2">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-500 text-white text-xs font-medium">
                      {urgentUnreadMessages}
                    </span>
                    <span className="text-sm text-red-700">alertes urgentes</span>
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
