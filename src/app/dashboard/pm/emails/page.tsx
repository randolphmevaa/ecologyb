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
  // ChevronDownIcon,
  // FolderIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  AdjustmentsHorizontalIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  // CalendarIcon,
  // ClockIcon,
  HandThumbUpIcon,
  // HandThumbDownIcon,
  // UserGroupIcon,
  // CogIcon,
  // InformationCircleIcon,
  PencilIcon,
  LinkIcon,
  // ArchiveBoxIcon,
  EyeIcon,
  // TrashIcon,
  // StarIcon,
  // BookmarkIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

/** ---------------------
 *    TYPE DEFINITIONS
 *  --------------------- */
type MessageStatus = "sent" | "delivered" | "read" | "failed";
type UserStatus = "online" | "offline" | "away" | "busy";
type ConversationType = "individual" | "group" | "admin" | "document" | "client";

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
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number; // in KB
  url: string;
  thumbnail_url?: string;
}

// type UserStatus = "online" | "offline" | "away" | "busy";

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
}

/** ---------------------
 *     MAIN COMPONENT
 *  --------------------- */
export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "documents" | "admin" | "clients">("all");
  // const [showUserProfile, setShowUserProfile] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showFormatting, setShowFormatting] = useState(false);
  const [showGroupedByDate, setShowGroupedByDate] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker ] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [ , setUserInfo] = useState<{ _id: string; email: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample users data
  const sampleUsers: User[] = [
    {
      id: "user001",
      firstName: "Thomas",
      lastName: "Dubois",
      email: "thomas.dubois@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "Admin",
      status: "online"
    },
    {
      id: "user002",
      firstName: "Léa",
      lastName: "Martin",
      email: "lea.martin@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
      role: "Support",
      status: "online"
    },
    {
      id: "user003",
      firstName: "Pierre",
      lastName: "Laurent",
      email: "pierre.laurent@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/men/62.jpg",
      role: "Technique",
      status: "busy",
      last_active: "2025-03-16T10:30:00Z"
    },
    {
      id: "user004",
      firstName: "Sophie",
      lastName: "Legrand",
      email: "sophie.legrand@ecologyb.fr",
      avatar_url: "https://randomuser.me/api/portraits/women/17.jpg",
      role: "Finance",
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

  // Sample conversation data
  const sampleConversations: Conversation[] = [
    {
      id: "conv001",
      type: "admin",
      participants: ["regie001", "user001"],
      unread_count: 3,
      created_at: "2025-03-10T08:30:00Z",
      updated_at: "2025-03-16T11:35:00Z",
      is_pinned: true
    },
    {
      id: "conv002",
      type: "document",
      name: "Projet Solaire - Questions techniques",
      participants: ["regie001", "user003", "user002"],
      unread_count: 1,
      created_at: "2025-03-12T14:20:00Z",
      updated_at: "2025-03-15T16:42:00Z",
      document_id: "DOC-2025-001",
      document_name: "Convention de partenariat - Projet Solaire"
    },
    {
      id: "conv003",
      type: "individual",
      participants: ["regie001", "user002"],
      unread_count: 0,
      created_at: "2025-03-05T10:15:00Z",
      updated_at: "2025-03-14T09:30:00Z"
    },
    {
      id: "conv004",
      type: "group",
      name: "Équipe Support Technique",
      participants: ["regie001", "user002", "user003", "user004"],
      unread_count: 5,
      created_at: "2025-02-20T11:00:00Z",
      updated_at: "2025-03-16T08:20:00Z"
    },
    {
      id: "conv005",
      type: "document",
      name: "Bornes de recharge - Installation",
      participants: ["regie001", "user003"],
      unread_count: 0,
      created_at: "2025-03-01T09:45:00Z",
      updated_at: "2025-03-10T15:30:00Z",
      document_id: "DOC-2025-006",
      document_name: "Guide d'installation - Bornes de recharge"
    },
    {
      id: "conv006",
      type: "individual",
      participants: ["regie001", "user004"],
      unread_count: 0,
      created_at: "2025-02-15T14:30:00Z",
      updated_at: "2025-03-05T16:15:00Z"
    },
    // Client conversations
    {
      id: "conv007",
      type: "client",
      participants: ["regie001", "client001"],
      unread_count: 2,
      created_at: "2025-03-14T09:15:00Z",
      updated_at: "2025-03-16T14:25:00Z",
      is_pinned: true
    },
    {
      id: "conv008",
      type: "client",
      participants: ["regie001", "client002"],
      unread_count: 0,
      created_at: "2025-03-10T11:20:00Z",
      updated_at: "2025-03-15T10:45:00Z"
    },
    {
      id: "conv009",
      type: "client",
      participants: ["regie001", "client003"],
      unread_count: 1,
      created_at: "2025-03-06T15:30:00Z",
      updated_at: "2025-03-16T09:10:00Z"
    }
  ];

  // Sample messages for conversation 1
  const sampleMessages: Record<string, Message[]> = {
    "conv001": [
      {
        id: "msg001",
        conversation_id: "conv001",
        sender_id: "user001",
        content: "Bonjour, j'espère que vous vous portez bien. Je souhaitais vous informer que nous avons mis à jour les exigences du projet solaire. Pouvez-vous consulter les nouveaux documents que j'ai téléchargés ?",
        timestamp: "2025-03-16T10:30:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg002",
        conversation_id: "conv001",
        sender_id: "regie001",
        content: "Bonjour Thomas, merci pour votre message. Je vais consulter les documents dès que possible et revenir vers vous en cas de questions.",
        timestamp: "2025-03-16T10:35:00Z",
        status: "delivered",
        is_read: true
      },
      {
        id: "msg003",
        conversation_id: "conv001",
        sender_id: "user001",
        content: "Parfait, merci. N'hésitez pas à me contacter si vous avez besoin de précisions supplémentaires. Nous devons finaliser ce projet avant la fin du mois.",
        timestamp: "2025-03-16T10:40:00Z",
        status: "delivered",
        is_read: false
      },
      {
        id: "msg004",
        conversation_id: "conv001",
        sender_id: "user001",
        content: "J'ai également joint le planning mis à jour pour les prochaines étapes du projet.",
        timestamp: "2025-03-16T11:15:00Z",
        status: "delivered",
        is_read: false,
        attachments: [
          {
            id: "att001",
            name: "Planning_Projet_Solaire_2025.pdf",
            type: "application/pdf",
            size: 2048,
            url: "#",
            thumbnail_url: "https://via.placeholder.com/100x100/213f5b/FFFFFF?text=PDF"
          }
        ]
      },
      {
        id: "msg005",
        conversation_id: "conv001",
        sender_id: "user001",
        content: "Une réunion est prévue vendredi prochain à 14h pour faire le point sur l'avancement. Merci de confirmer votre disponibilité.",
        timestamp: "2025-03-16T11:35:00Z",
        status: "delivered",
        is_read: false
      }
    ],
    "conv002": [
      {
        id: "msg101",
        conversation_id: "conv002",
        sender_id: "user003",
        content: "Bonjour à tous, j'ai passé en revue le document de convention pour le projet solaire et j'ai quelques questions techniques concernant les spécifications des panneaux.",
        timestamp: "2025-03-15T14:30:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg102",
        conversation_id: "conv002",
        sender_id: "user002",
        content: "Bonjour Pierre, quelles sont vos questions spécifiques ? Nous pouvons clarifier ces points.",
        timestamp: "2025-03-15T14:40:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg103",
        conversation_id: "conv002",
        sender_id: "user003",
        content: "J'aimerais savoir si les panneaux solaires doivent être conformes à la norme IEC 61215 comme mentionné dans la section 3.2 du document, ou s'il y a d'autres normes applicables ?",
        timestamp: "2025-03-15T14:45:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg104",
        conversation_id: "conv002",
        sender_id: "regie001",
        content: "Bonjour, de notre côté nous avons prévu d'utiliser des panneaux conformes à la norme IEC 61215 ainsi qu'à la norme IEC 61730 pour la sécurité. Est-ce que cela répond à vos exigences ?",
        timestamp: "2025-03-15T15:20:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg105",
        conversation_id: "conv002",
        sender_id: "user003",
        content: "Oui, c'est parfait. La conformité à ces deux normes est exactement ce que nous recherchons. Merci pour cette précision.",
        timestamp: "2025-03-15T15:35:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg106",
        conversation_id: "conv002",
        sender_id: "user002",
        content: "Je viens de mettre à jour le document avec ces informations. Vous pouvez le consulter et me faire part de vos remarques.",
        timestamp: "2025-03-15T16:10:00Z",
        status: "read",
        is_read: true,
        attachments: [
          {
            id: "att101",
            name: "Convention_Projet_Solaire_V2.docx",
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            size: 1540,
            url: "#",
            thumbnail_url: "https://via.placeholder.com/100x100/213f5b/FFFFFF?text=DOCX"
          }
        ]
      },
      {
        id: "msg107",
        conversation_id: "conv002",
        sender_id: "user003",
        content: "J'ai une autre question concernant la garantie des panneaux. La convention mentionne une garantie de 20 ans, mais ne précise pas si c'est une garantie de performance ou une garantie produit. Pouvez-vous clarifier ce point ?",
        timestamp: "2025-03-15T16:42:00Z",
        status: "delivered",
        is_read: false
      }
    ],
    // Client conversations
    "conv007": [
      {
        id: "msg201",
        conversation_id: "conv007",
        sender_id: "client001",
        content: "Bonjour, je vous contacte au sujet de l'installation des panneaux solaires prévue pour la mairie de Montpellier. Nous aimerions avoir un calendrier plus précis des différentes phases du projet.",
        timestamp: "2025-03-16T09:15:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg202",
        conversation_id: "conv007",
        sender_id: "regie001",
        content: "Bonjour Mme Dupont, je vous remercie pour votre message. Nous sommes actuellement en train de finaliser le planning détaillé. Je serai en mesure de vous le transmettre d'ici demain.",
        timestamp: "2025-03-16T09:30:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg203",
        conversation_id: "conv007",
        sender_id: "client001",
        content: "Parfait, merci beaucoup pour votre réactivité. Pourriez-vous également inclure les dates prévisionnelles de raccordement au réseau ? C'est un point crucial pour notre planification interne.",
        timestamp: "2025-03-16T09:35:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg204",
        conversation_id: "conv007",
        sender_id: "regie001",
        content: "Bien sûr, je veillerai à ce que les dates de raccordement soient clairement indiquées. Nous avons déjà pris contact avec le gestionnaire de réseau pour coordonner cette étape.",
        timestamp: "2025-03-16T09:50:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg205",
        conversation_id: "conv007",
        sender_id: "client001",
        content: "Excellente nouvelle. Par ailleurs, la commission environnement se réunit la semaine prochaine et souhaiterait avoir une estimation plus précise des économies d'énergie attendues. Avez-vous des données actualisées à ce sujet ?",
        timestamp: "2025-03-16T14:20:00Z",
        status: "delivered",
        is_read: false
      },
      {
        id: "msg206",
        conversation_id: "conv007",
        sender_id: "client001",
        content: "J'ai également préparé un document résumant nos attentes pour la présentation à la commission.",
        timestamp: "2025-03-16T14:25:00Z",
        status: "delivered",
        is_read: false,
        attachments: [
          {
            id: "att201",
            name: "Attentes_Commission_Environnement.pdf",
            type: "application/pdf",
            size: 1845,
            url: "#",
            thumbnail_url: "https://via.placeholder.com/100x100/213f5b/FFFFFF?text=PDF"
          }
        ]
      }
    ],
    "conv008": [
      {
        id: "msg301",
        conversation_id: "conv008",
        sender_id: "client002",
        content: "Bonjour, je souhaiterais avoir des informations sur les solutions de rénovation énergétique que vous proposez pour les bâtiments anciens.",
        timestamp: "2025-03-14T10:30:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg302",
        conversation_id: "conv008",
        sender_id: "regie001",
        content: "Bonjour M. Moreau, merci pour votre intérêt. Nous proposons plusieurs solutions adaptées aux bâtiments anciens, notamment l'isolation par l'extérieur, le remplacement des menuiseries et l'installation de systèmes de chauffage plus performants.",
        timestamp: "2025-03-14T11:15:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg303",
        conversation_id: "conv008",
        sender_id: "client002",
        content: "Merci pour ces informations. Nous travaillons actuellement sur un projet de rénovation d'un immeuble du 19ème siècle. L'isolation par l'extérieur pourrait être une solution intéressante, mais nous devons respecter certaines contraintes architecturales.",
        timestamp: "2025-03-14T14:20:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg304",
        conversation_id: "conv008",
        sender_id: "regie001",
        content: "Je comprends parfaitement votre problématique. Nous avons développé des solutions spécifiques pour les bâtiments présentant un intérêt patrimonial. Je vous propose de vous envoyer notre brochure dédiée à ce type de projet.",
        timestamp: "2025-03-14T15:10:00Z",
        status: "read",
        is_read: true,
        attachments: [
          {
            id: "att301",
            name: "Solutions_Renovation_Patrimoine.pdf",
            type: "application/pdf",
            size: 3254,
            url: "#",
            thumbnail_url: "https://via.placeholder.com/100x100/213f5b/FFFFFF?text=PDF"
          }
        ]
      },
      {
        id: "msg305",
        conversation_id: "conv008",
        sender_id: "client002",
        content: "Merci beaucoup pour ce document, c'est exactement ce dont nous avions besoin. Serait-il possible d'organiser une visite sur site pour évaluer plus précisément les travaux à réaliser ?",
        timestamp: "2025-03-15T09:45:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg306",
        conversation_id: "conv008",
        sender_id: "regie001",
        content: "Avec plaisir. Nous pouvons organiser cette visite la semaine prochaine. Pourriez-vous me communiquer vos disponibilités ainsi que l'adresse exacte du bâtiment ?",
        timestamp: "2025-03-15T10:45:00Z",
        status: "delivered",
        is_read: true
      }
    ],
    "conv009": [
      {
        id: "msg401",
        conversation_id: "conv009",
        sender_id: "client003",
        content: "Bonjour, je représente GreenTech Innovations et nous sommes intéressés par une collaboration sur des projets d'énergie renouvelable. Pouvons-nous discuter de potentielles synergies ?",
        timestamp: "2025-03-15T11:30:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg402",
        conversation_id: "conv009",
        sender_id: "regie001",
        content: "Bonjour Mme Berger, nous sommes toujours ouverts à de nouvelles collaborations. Pourriez-vous me préciser les domaines qui vous intéressent particulièrement ?",
        timestamp: "2025-03-15T14:15:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg403",
        conversation_id: "conv009",
        sender_id: "client003",
        content: "Nous développons actuellement des solutions de stockage d'énergie par batterie pour optimiser l'utilisation de l'énergie solaire. Nous cherchons des partenaires pour tester ces solutions sur des installations existantes.",
        timestamp: "2025-03-15T15:40:00Z",
        status: "read",
        is_read: true,
        attachments: [
          {
            id: "att401",
            name: "Presentation_GreenTech_Batteries.pdf",
            type: "application/pdf",
            size: 4152,
            url: "#",
            thumbnail_url: "https://via.placeholder.com/100x100/213f5b/FFFFFF?text=PDF"
          }
        ]
      },
      {
        id: "msg404",
        conversation_id: "conv009",
        sender_id: "regie001",
        content: "Merci pour ces informations. Votre solution semble très prometteuse et pourrait effectivement compléter nos installations solaires. Nous avons plusieurs sites qui pourraient servir de terrain d'expérimentation.",
        timestamp: "2025-03-15T16:30:00Z",
        status: "read",
        is_read: true
      },
      {
        id: "msg405",
        conversation_id: "conv009",
        sender_id: "client003",
        content: "C'est une excellente nouvelle ! Pourriez-vous me communiquer les caractéristiques techniques de ces sites ? Nous pourrions ainsi évaluer leur compatibilité avec nos systèmes de stockage.",
        timestamp: "2025-03-16T09:10:00Z",
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
    
    // Get user info from localStorage
    const proInfo = localStorage.getItem("proInfo");
    if (proInfo) {
      setUserInfo(JSON.parse(proInfo));
    }
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
        if (selectedConversation.id === "conv007" || selectedConversation.id === "conv009") {
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
      if (activeTab === "documents" && conv.type !== "document") return false;
      if (activeTab === "admin" && conv.type !== "admin") return false;
      if (activeTab === "clients" && conv.type !== "client") return false;
      
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
      sender_id: "regie001",
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
      const otherParticipantId = conversation.participants.find(id => id !== "regie001");
      const otherUser = users.find(user => user.id === otherParticipantId);
      return otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "Conversation";
    }
    
    if (conversation.type === "admin") {
      return "Administration ECOLOGY'B";
    }
    
    if (conversation.type === "document") {
      return conversation.document_name || "Discussion document";
    }
    
    if (conversation.type === "client") {
      const clientId = conversation.participants.find(id => id !== "regie001");
      const client = users.find(user => user.id === clientId);
      if (client) {
        const company = client.company; // Using any to access the company property
        return company ? `${client.firstName} ${client.lastName} (${company})` : `${client.firstName} ${client.lastName}`;
      }
      return "Client";
    }
    
    return `Groupe (${conversation.participants.length - 1})`;
  };

  const getConversationAvatar = (conversation: Conversation): string => {
    if (conversation.type === "individual" || conversation.type === "client") {
      const otherParticipantId = conversation.participants.find(id => id !== "regie001");
      const otherUser = users.find(user => user.id === otherParticipantId);
      return otherUser?.avatar_url || "";
    }
    
    if (conversation.type === "admin") {
      return "https://randomuser.me/api/portraits/men/32.jpg"; // Admin avatar
    }
    
    if (conversation.type === "document") {
      return ""; // Use icon for document conversations
    }
    
    return ""; // Use default group icon
  };

  const getConversationIcon = (conversation: Conversation) => {
    if (conversation.type === "document") {
      return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
    }
    
    if (conversation.type === "group") {
      return <UserCircleIcon className="h-5 w-5 text-purple-500" />;
    }
    
    if (conversation.type === "admin") {
      return <UserCircleIcon className="h-5 w-5 text-red-500" />;
    }
    
    if (conversation.type === "client") {
      return <BriefcaseIcon className="h-5 w-5 text-green-500" />;
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
                  className={`flex-1 py-2 text-sm font-medium ${activeTab === 'clients' ? 'bg-[#213f5b] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('clients')}
                >
                  <div className="flex justify-center items-center gap-1">
                    <BriefcaseIcon className="h-4 w-4" />
                    <span>Clients</span>
                  </div>
                </button>
                <button
                  className={`flex-1 py-2 text-sm font-medium ${activeTab === 'documents' ? 'bg-[#213f5b] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('documents')}
                >
                  <div className="flex justify-center items-center gap-1">
                    <DocumentTextIcon className="h-4 w-4" />
                    <span>Docs</span>
                  </div>
                </button>
                <button
                  className={`flex-1 py-2 text-sm font-medium ${activeTab === 'admin' ? 'bg-[#213f5b] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('admin')}
                >
                  <div className="flex justify-center items-center gap-1">
                    <UserCircleIcon className="h-4 w-4" />
                    <span>Admin</span>
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
                              {conversation.type === "individual" && getUserStatus(users.find(u => u.id === conversation.participants.find(id => id !== "regie001"))?.status || "offline")}
                            </div>
                          ) : (
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                              conversation.type === "document" ? "bg-blue-100" :
                              conversation.type === "group" ? "bg-purple-100" :
                              conversation.type === "admin" ? "bg-red-100" : "bg-gray-100"
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
                                  ? "Discussion à propos d'un document" 
                                  : "Démarrer une conversation"
                              )}
                            </p>
                            
                            {conversation.unread_count > 0 && (
                              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#213f5b] text-white text-xs font-medium">
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
                        {selectedConversation.type === "individual" && getUserStatus(users.find(u => u.id === selectedConversation.participants.find(id => id !== "regie001"))?.status || "offline")}
                      </div>
                    ) : (
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        selectedConversation.type === "document" ? "bg-blue-100" :
                        selectedConversation.type === "group" ? "bg-purple-100" :
                        selectedConversation.type === "admin" ? "bg-red-100" : "bg-gray-100"
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
                      {selectedConversation.type === "individual" && (
                        <p className="text-xs text-gray-500">
                          {users.find(u => u.id === selectedConversation.participants.find(id => id !== "regie001"))?.status === "online"
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
                              const isCurrentUser = message.sender_id === "regie001";
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
                  
                  {/* Optional quick responses */}
                  {selectedConversation?.type === "client" && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700">
                        Merci pour votre message
                      </button>
                      <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700">
                        Je vous recontacte au plus vite
                      </button>
                      <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700">
                        Pouvez-vous préciser votre demande ?
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
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
