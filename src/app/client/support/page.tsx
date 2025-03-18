"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState, useRef } from 'react';
import {
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  // InformationCircleIcon,
  MagnifyingGlassIcon,
  // FunnelIcon,
  TagIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  BellIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  XMarkIcon,
  CpuChipIcon,
  PhotoIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  // PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Header } from "@/components/Header";
import { TicketIcon, Zap, Lightbulb, Thermometer, Home, FileText, Sparkles, ClockIcon, PenTool, FileSignature, Download, Send } from "lucide-react";

// Type definitions
interface ConversationMessage {
  message: string;
  sender: string;
  timestamp: number;
}

interface Attachment {
  name: string;
  type: string;
  size: string;
}

interface StatusHistoryItem {
  status: string;
  date: string;
}

interface Ticket {
  id: string;
  title: string;
  ticket: string;
  type: string;
  notes: string;
  location: string;
  createdAt: string;
  start: string;
  end: string;
  participants: string;
  technicianFirstName: string;
  technicianLastName: string;
  customerFirstName: string;
  customerLastName: string;
  problem: string;
  ticketNumber: string;
  subject: string;
  solution: string;
  status: string;
  priority: string;
  createdDate: string;
  description: string;
  lastUpdate: string;
  conversation: ConversationMessage[];
  category: string;
  equipmentType: string;
  equipmentModel: string;
  warranty: boolean;
  attachments: Attachment[];
  satisfaction?: number;
  totalCost?: number;
  statusHistory: StatusHistoryItem[];
  attestation?: {
    signed: boolean;
    signatureDate?: string;
    downloadAvailable: boolean;
  };
}

// Props interfaces
interface StatusBadgeProps {
  status: string;
}

interface CategoryBadgeProps {
  category: string;
}

// Sample data
const SAMPLE_TICKETS: Ticket[] = [
  {
    id: "1",
    title: "Problème de chauffage central",
    ticket: "SAV-2023-00156",
    type: "Installation",
    notes: "Client signale que le chauffage ne fonctionne pas correctement dans plusieurs pièces. Vérification nécessaire du système central et des radiateurs.",
    location: "14 Rue de la Paix, 75002 Paris",
    createdAt: "2023-11-10T09:23:45",
    start: "2023-11-15T10:00:00",
    end: "2023-11-15T12:00:00",
    participants: "Michel Dupont & Jean Martin",
    technicianFirstName: "Michel",
    technicianLastName: "Dupont",
    customerFirstName: "Jean",
    customerLastName: "Martin",
    problem: "Chauffage défectueux",
    ticketNumber: "SAV-2023-00156",
    subject: "Problème de chauffage central",
    solution: "Remplacement vanne thermostatique",
    status: "En cours",
    priority: "Haute",
    createdDate: "10/11/2023",
    description: "Client signale que le chauffage ne fonctionne pas correctement dans plusieurs pièces. Vérification nécessaire du système central et des radiateurs.",
    lastUpdate: "12/11/2023 15:42",
    category: "Chauffage",
    equipmentType: "Chaudière à condensation",
    equipmentModel: "EcoThermic Plus 3000",
    warranty: true,
    conversation: [
      {
        message: "Bonjour, j'ai un problème avec mon chauffage central, il ne chauffe plus correctement.",
        sender: "client",
        timestamp: 1699600000000
      },
      {
        message: "Bonjour M. Martin, je comprends votre souci. Pouvez-vous me préciser depuis quand et dans quelles pièces principalement ?",
        sender: "technicien",
        timestamp: 1699603600000
      },
      {
        message: "Depuis environ 3 jours, surtout dans le salon et la chambre principale.",
        sender: "client",
        timestamp: 1699604500000
      },
      {
        message: "Merci pour ces précisions. Je vous propose une intervention le 15 novembre entre 10h et 12h. Est-ce que cela vous convient ?",
        sender: "technicien",
        timestamp: 1699605400000
      },
      {
        message: "Oui parfait, merci beaucoup.",
        sender: "client",
        timestamp: 1699606300000
      }
    ],
    attachments: [
      { name: "Rapport_Intervention.pdf", type: "PDF", size: "2.4 MB" },
      { name: "Photo_Chaudiere.jpg", type: "Image", size: "1.8 MB" }
    ],
    statusHistory: [
      { status: "Ouvert", date: "10/11/2023 09:23" },
      { status: "En cours", date: "12/11/2023 15:42" }
    ],
    satisfaction: 0,
    totalCost: 120,
    attestation: {
      signed: false,
      downloadAvailable: true
    }
  },
  {
    id: "2",
    title: "Panne système photovoltaïque",
    ticket: "SAV-2023-00157",
    type: "Maintenance",
    notes: "Production d'énergie en baisse depuis une semaine. Diagnostic complet à effectuer.",
    location: "14 Rue de la Paix, 75002 Paris",
    createdAt: "2023-11-08T14:10:22",
    start: "2023-11-12T09:30:00",
    end: "2023-11-12T11:30:00",
    participants: "Sophie Leroy & Jean Martin",
    technicianFirstName: "Sophie",
    technicianLastName: "Leroy",
    customerFirstName: "Jean",
    customerLastName: "Martin",
    problem: "Panne système solaire",
    ticketNumber: "SAV-2023-00157",
    subject: "Panne système photovoltaïque",
    solution: "Nettoyage panneaux et reconfiguration onduleur",
    status: "Fermé",
    priority: "Moyenne",
    createdDate: "08/11/2023",
    description: "Production d'énergie en baisse depuis une semaine. Diagnostic complet à effectuer.",
    lastUpdate: "12/11/2023 11:30",
    category: "Énergie Solaire",
    equipmentType: "Panneaux photovoltaïques",
    equipmentModel: "SolarMax 500W",
    warranty: true,
    conversation: [
      {
        message: "Bonjour, je constate que ma production d'électricité est en baisse depuis une semaine environ.",
        sender: "client",
        timestamp: 1699450000000
      },
      {
        message: "Bonjour M. Martin. Avez-vous remarqué quelque chose d'inhabituel sur vos panneaux ?",
        sender: "technicien",
        timestamp: 1699453600000
      },
      {
        message: "Non, mais l'application indique une baisse de 40% de production.",
        sender: "client",
        timestamp: 1699454500000
      }
    ],
    attachments: [
      { name: "Rapport_Maintenance.pdf", type: "PDF", size: "3.1 MB" },
      { name: "Photo_Panneaux.jpg", type: "Image", size: "2.2 MB" },
      { name: "Attestation_Intervention.pdf", type: "PDF", size: "1.2 MB" }
    ],
    statusHistory: [
      { status: "Ouvert", date: "08/11/2023 14:10" },
      { status: "En cours", date: "10/11/2023 09:15" },
      { status: "Fermé", date: "12/11/2023 11:30" }
    ],
    satisfaction: 4.5,
    totalCost: 0,
    attestation: {
      signed: true,
      signatureDate: "12/11/2023 18:45",
      downloadAvailable: true
    }
  },
  {
    id: "3",
    title: "Thermostat intelligent défectueux",
    ticket: "SAV-2023-00158",
    type: "Réparation",
    notes: "Le thermostat ne répond plus aux commandes et affiche un code d'erreur E45. Remplacement probablement nécessaire.",
    location: "14 Rue de la Paix, 75002 Paris",
    createdAt: "2023-11-11T11:05:33",
    start: "2023-11-14T14:00:00",
    end: "2023-11-14T15:00:00",
    participants: "Thomas Petit & Jean Martin",
    technicianFirstName: "Thomas",
    technicianLastName: "Petit",
    customerFirstName: "Jean",
    customerLastName: "Martin",
    problem: "Thermostat défectueux",
    ticketNumber: "SAV-2023-00158",
    subject: "Thermostat intelligent défectueux",
    solution: "Remplacement thermostat",
    status: "Ouvert",
    priority: "Faible",
    createdDate: "11/11/2023",
    description: "Le thermostat ne répond plus aux commandes et affiche un code d'erreur E45. Remplacement probablement nécessaire.",
    lastUpdate: "11/11/2023 11:05",
    category: "Domotique",
    equipmentType: "Thermostat intelligent",
    equipmentModel: "EcoControl 2000",
    warranty: false,
    conversation: [
      {
        message: "Bonjour, mon thermostat affiche un code d'erreur E45 et ne répond plus.",
        sender: "client",
        timestamp: 1699690000000
      },
      {
        message: "Bonjour M. Martin. Ce code indique généralement un problème de capteur. Avez-vous essayé de redémarrer l'appareil ?",
        sender: "technicien",
        timestamp: 1699693600000
      },
      {
        message: "Oui, j'ai essayé mais le problème persiste.",
        sender: "client",
        timestamp: 1699694500000
      }
    ],
    attachments: [
      { name: "Manuel_Thermostat.pdf", type: "PDF", size: "1.5 MB" },
      { name: "Photo_Erreur.jpg", type: "Image", size: "0.8 MB" }
    ],
    statusHistory: [
      { status: "Ouvert", date: "11/11/2023 11:05" }
    ],
    satisfaction: 0,
    totalCost: 85,
    attestation: {
      signed: false,
      downloadAvailable: false
    }
  },
  {
    id: "4",
    title: "Installation pompe à chaleur",
    ticket: "SAV-2023-00159",
    type: "Installation",
    notes: "Suite à l'achat d'une pompe à chaleur, planification de l'installation complète avec tests.",
    location: "14 Rue de la Paix, 75002 Paris",
    createdAt: "2023-11-05T16:45:00",
    start: "2023-11-20T09:00:00",
    end: "2023-11-20T17:00:00",
    participants: "Lucas Moreau & Jean Martin",
    technicianFirstName: "Lucas",
    technicianLastName: "Moreau",
    customerFirstName: "Jean",
    customerLastName: "Martin",
    problem: "Installation PAC",
    ticketNumber: "SAV-2023-00159",
    subject: "Installation pompe à chaleur",
    solution: "Installation complète",
    status: "Ouvert",
    priority: "Moyenne",
    createdDate: "05/11/2023",
    description: "Suite à l'achat d'une pompe à chaleur, planification de l'installation complète avec tests.",
    lastUpdate: "10/11/2023 14:30",
    category: "Climatisation",
    equipmentType: "Pompe à chaleur air/eau",
    equipmentModel: "EcoEnergy Pro 8000",
    warranty: true,
    conversation: [
      {
        message: "Bonjour, j'ai reçu ma nouvelle pompe à chaleur et j'aimerais planifier l'installation.",
        sender: "client",
        timestamp: 1699200000000
      },
      {
        message: "Bonjour M. Martin. Félicitations pour votre achat. Nous pouvons prévoir l'installation pour le 20 novembre. Cela vous convient-il ?",
        sender: "technicien",
        timestamp: 1699203600000
      },
      {
        message: "Oui, ça me convient parfaitement. Merci.",
        sender: "client",
        timestamp: 1699204500000
      }
    ],
    attachments: [
      { name: "Devis_Installation.pdf", type: "PDF", size: "1.9 MB" },
      { name: "Schema_Installation.jpg", type: "Image", size: "1.2 MB" }
    ],
    statusHistory: [
      { status: "Ouvert", date: "05/11/2023 16:45" }
    ],
    satisfaction: 0,
    totalCost: 2400,
    attestation: {
      signed: false,
      downloadAvailable: false
    }
  },
  {
    id: "5",
    title: "Dysfonctionnement ballon eau chaude",
    ticket: "SAV-2023-00160",
    type: "Réparation",
    notes: "Plus d'eau chaude depuis hier soir. Vérification du thermostat et de la résistance nécessaire.",
    location: "14 Rue de la Paix, 75002 Paris",
    createdAt: "2023-11-12T08:20:15",
    start: "2023-11-13T11:00:00",
    end: "2023-11-13T13:00:00",
    participants: "Antoine Girard & Jean Martin",
    technicianFirstName: "Antoine",
    technicianLastName: "Girard",
    customerFirstName: "Jean",
    customerLastName: "Martin",
    problem: "Panne eau chaude",
    ticketNumber: "SAV-2023-00160",
    subject: "Dysfonctionnement ballon eau chaude",
    solution: "Remplacement résistance",
    status: "En cours",
    priority: "Haute",
    createdDate: "12/11/2023",
    description: "Plus d'eau chaude depuis hier soir. Vérification du thermostat et de la résistance nécessaire.",
    lastUpdate: "12/11/2023 15:10",
    category: "Plomberie",
    equipmentType: "Chauffe-eau électrique",
    equipmentModel: "AquaTherm 200L",
    warranty: true,
    conversation: [
      {
        message: "Bonjour, je n'ai plus d'eau chaude depuis hier soir, c'est urgent!",
        sender: "client",
        timestamp: 1699765200000
      },
      {
        message: "Bonjour M. Martin. Je comprends l'urgence. Nous pouvons intervenir demain entre 11h et 13h. Est-ce que cela vous convient ?",
        sender: "technicien",
        timestamp: 1699766100000
      },
      {
        message: "Oui, merci beaucoup pour cette intervention rapide.",
        sender: "client",
        timestamp: 1699767000000
      }
    ],
    attachments: [
      { name: "Bon_Intervention.pdf", type: "PDF", size: "1.2 MB" },
      { name: "Attestation_Intervention.pdf", type: "PDF", size: "1.1 MB" }
    ],
    statusHistory: [
      { status: "Ouvert", date: "12/11/2023 08:20" },
      { status: "En cours", date: "12/11/2023 15:10" }
    ],
    satisfaction: 0,
    totalCost: 180,
    attestation: {
      signed: false,
      downloadAvailable: true
    }
  }
];

// Define options for filters
const statusOptions = ["Tous", "Ouvert", "En cours", "Fermé"];
const categoryOptions = ["Tous", "Chauffage", "Énergie Solaire", "Domotique", "Climatisation", "Plomberie"];

// StatusBadge Component
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'ouvert':
      case 'open':
      case 'nouveau':
      case 'new':
        return 'bg-gradient-to-r from-blue-500/20 to-blue-400/30 text-blue-600 dark:text-blue-400 border border-blue-200';
      case 'en cours':
      case 'in progress':
        return 'bg-gradient-to-r from-purple-500/20 to-indigo-400/30 text-purple-600 dark:text-purple-400 border border-purple-200';
      case 'résolu':
      case 'resolved':
        return 'bg-gradient-to-r from-emerald-500/20 to-green-400/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200';
      case 'fermé':
      case 'closed':
        return 'bg-gradient-to-r from-gray-500/20 to-gray-400/30 text-gray-600 dark:text-gray-400 border border-gray-200';
      case 'attente':
      case 'waiting':
      case 'pending':
        return 'bg-gradient-to-r from-orange-500/20 to-orange-400/30 text-orange-600 dark:text-orange-400 border border-orange-200';
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-gray-400/30 text-gray-600 dark:text-gray-400 border border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ouvert':
      case 'open':
      case 'nouveau':
      case 'new':
        return <BellIcon className="h-3.5 w-3.5" />;
      case 'en cours':
      case 'in progress':
        return <ArrowPathIcon className="h-3.5 w-3.5" />;
      case 'résolu':
      case 'resolved':
      case 'fermé':
      case 'closed':
        return <CheckBadgeIcon className="h-3.5 w-3.5" />;
      case 'attente':
      case 'waiting':
      case 'pending':
        return <CalendarDaysIcon className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1.5 shadow-sm ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      {status}
    </span>
  );
};

// CategoryBadge Component
const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const getCategoryColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'chauffage':
        return 'bg-gradient-to-r from-red-500/20 to-orange-400/30 text-red-600 border border-red-200';
      case 'énergie solaire':
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-400/30 text-yellow-600 border border-yellow-200';
      case 'domotique':
        return 'bg-gradient-to-r from-blue-500/20 to-sky-400/30 text-blue-600 border border-blue-200';
      case 'climatisation':
        return 'bg-gradient-to-r from-sky-500/20 to-cyan-400/30 text-sky-600 border border-sky-200';
      case 'plomberie':
        return 'bg-gradient-to-r from-blue-500/20 to-indigo-400/30 text-blue-600 border border-blue-200';
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-gray-400/30 text-gray-600 border border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'chauffage':
        return <Thermometer className="h-3.5 w-3.5" />;
      case 'énergie solaire':
        return <Zap className="h-3.5 w-3.5" />;
      case 'domotique':
        return <CpuChipIcon className="h-3.5 w-3.5" />;
      case 'climatisation':
        return <Sparkles className="h-3.5 w-3.5" />;
      case 'plomberie':
        return <Home className="h-3.5 w-3.5" />;
      default:
        return <TagIcon className="h-3.5 w-3.5" />;
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1.5 shadow-sm ${getCategoryColor(category)}`}>
      {getCategoryIcon(category)}
      {category}
    </span>
  );
};

// Main Component
export default function SAV() {
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("Tous");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [tickets, setTickets] = useState<Ticket[]>(SAMPLE_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [mapType, setMapType] = useState<string>('roadmap');
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [newMessage, setNewMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("details");
  const [isSigningAttestation, setIsSigningAttestation] = useState<boolean>(false);
  const [signature, setSignature] = useState<string>("");
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [showDownloadAlert, setShowDownloadAlert] = useState<boolean>(false);

  // Hide welcome banner after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort tickets
  const filteredAndSortedTickets = tickets
    .filter((ticket) => {
      const matchesSearch = 
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === "Tous" || ticket.status === selectedStatus;
      const matchesCategory = selectedCategory === "Tous" || ticket.category === selectedCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOrder === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return 0;
    });

  // Send a new message in the conversation
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;
    
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === selectedTicket.id) {
        const newConversation = [
          ...ticket.conversation,
          {
            message: newMessage,
            sender: "client",
            timestamp: Date.now()
          }
        ];
        return { ...ticket, conversation: newConversation };
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    
    if (selectedTicket) {
      setSelectedTicket({
        ...selectedTicket,
        conversation: [
          ...selectedTicket.conversation,
          {
            message: newMessage,
            sender: "client",
            timestamp: Date.now()
          }
        ]
      });
    }
    
    setNewMessage("");
  };

  // Start drawing signature
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Prevent scrolling when drawing on canvas with touch
    e.preventDefault();
    
    // Clear any existing path
    ctx.beginPath();
    
    // Get position based on event type
    let x: number, y: number;
    if ('touches' in e) {
      // Touch event - get position relative to canvas
      const rect = canvas.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    
    // Move to the starting position
    ctx.moveTo(x, y);
    
    // Store isDrawing state and last position
    canvas.dataset.isDrawing = 'true';
    canvas.dataset.lastX = x.toString();
    canvas.dataset.lastY = y.toString();
  };

  // Draw signature
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas || canvas.dataset.isDrawing !== 'true') return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Prevent scrolling while drawing
    e.preventDefault();
    
    // Get position based on event type
    let x: number, y: number;
    if ('touches' in e) {
      // Touch event - get position relative to canvas
      const rect = canvas.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    
    // Improve signature quality
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#213f5b';
    ctx.shadowColor = '#213f5b';
    ctx.shadowBlur = 1;
    
    // Draw line from last position to current position
    ctx.beginPath();
    
    // Use last position from dataset
    const lastX = parseFloat(canvas.dataset.lastX || '0');
    const lastY = parseFloat(canvas.dataset.lastY || '0');
    
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Update last position
    canvas.dataset.lastX = x.toString();
    canvas.dataset.lastY = y.toString();
  };

  // Stop drawing signature
  const stopDrawing = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    
    canvas.dataset.isDrawing = 'false';
    
    // Get the signature data and update state
    setSignature(canvas.toDataURL());
  };

  // Submit signature
  const submitSignature = () => {
    if (!signature || !selectedTicket) return;
    
    const currentDate = new Date().toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Make sure we preserve the downloadAvailable property
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === selectedTicket.id) {
        return { 
          ...ticket, 
          attestation: {
            signed: true,
            signatureDate: currentDate,
            // Ensure downloadAvailable is always defined
            downloadAvailable: ticket.attestation?.downloadAvailable || true
          }
        };
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    
    // Update the selected ticket with proper typing
    if (selectedTicket.attestation) {
      setSelectedTicket({
        ...selectedTicket,
        attestation: {
          ...selectedTicket.attestation,
          signed: true,
          signatureDate: currentDate,
          // Preserve the downloadAvailable value
          downloadAvailable: selectedTicket.attestation.downloadAvailable
        }
      });
    } else {
      // If attestation doesn't exist yet, create it
      setSelectedTicket({
        ...selectedTicket,
        attestation: {
          signed: true,
          signatureDate: currentDate,
          downloadAvailable: true
        }
      });
    }
    
    setIsSigningAttestation(false);
    setShowSuccessAlert(true);
    
    // Hide success alert after 3 seconds
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3000);
  };

  // Enhanced clear signature function
  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature("");
  };

  // Download attestation as PDF
  const downloadAttestation = () => {
    // In a real application, this would trigger a PDF download
    // For this demo, we just show a success message
    setShowDownloadAlert(true);
    
    // Hide download alert after 3 seconds
    setTimeout(() => {
      setShowDownloadAlert(false);
    }, 3000);
  };

  // Get category icon for ticket card
  const getCategoryIcon = (category: string) => {
    const iconClass = "h-8 w-8 text-[#213f5b]";
    switch (category.toLowerCase()) {
      case 'chauffage':
        return <Thermometer className={iconClass} />;
      case 'énergie solaire':
        return <Zap className={iconClass} />;
      case 'domotique':
        return <CpuChipIcon className={iconClass} />;
      case 'climatisation':
        return <Sparkles className={iconClass} />;
      case 'plomberie':
        return <Home className={iconClass} />;
      default:
        return <ChatBubbleLeftRightIcon className={iconClass} />;
    }
  };

  // Function to format a date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main
          className="flex-1 overflow-y-auto px-6 lg:px-8 py-6 space-y-6"
          style={{
            background: "linear-gradient(135deg, rgba(191,221,249,0.15) 0%, rgba(210,252,178,0.08) 100%)",
          }}
        >
          {/* Success Alert */}
          <AnimatePresence>
            {showSuccessAlert && (
              <motion.div
                className="fixed top-6 right-6 z-50 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <CheckBadgeIcon className="h-6 w-6 text-green-500" />
                  <p className="font-medium">Attestation signée avec succès !</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Download Alert */}
          <AnimatePresence>
            {showDownloadAlert && (
              <motion.div
                className="fixed top-6 right-6 z-50 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg shadow-lg"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <Download className="h-6 w-6 text-blue-500" />
                  <p className="font-medium">Téléchargement démarré</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Welcome Banner */}
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-[#213f5b] via-[#263f57] to-[#2c4f76] text-white shadow-xl overflow-hidden relative"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0, padding: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%">
                    <pattern id="pattern-squares" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                      <rect width="1" height="1" x="0" y="0" fill="white" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#pattern-squares)" />
                  </svg>
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <h2 className="text-2xl font-bold mb-1 flex items-center">
                      <Lightbulb className="h-6 w-6 mr-2" />
                      Bienvenue dans votre Espace SAV
                    </h2>
                    <div className="flex items-center">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                        className="h-1 bg-gradient-to-r from-[#bfddf9] to-[#d2fcb2] rounded-full mb-2"
                      />
                    </div>
                    <p className="text-[#bfddf9]">
                      Suivez vos demandes d&apos;assistance technique et échangez avec nos techniciens
                    </p>
                  </div>
                  <button
                    onClick={() => setShowWelcome(false)}
                    className="text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1"
            >
              <h1 className="text-3xl font-bold text-[#213f5b] flex items-center">
                <TicketIcon className="h-7 w-7 mr-3" />
                Mes demandes d&apos;assistance
                <span className="ml-3 text-sm bg-[#213f5b]/10 px-2 py-1 rounded-full text-[#213f5b]">
                  {filteredAndSortedTickets.length} ticket{filteredAndSortedTickets.length !== 1 ? 's' : ''}
                </span>
              </h1>
              <p className="text-gray-600 mt-1">Suivez l&apos;avancement de vos demandes et communiquez avec nos techniciens</p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2.5 bg-gradient-to-r from-[#213f5b] to-[#1d3c56] text-white rounded-xl shadow hover:shadow-md flex items-center gap-2 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nouvelle demande
            </motion.button>
          </div>

          {/* Enhanced Filters Section */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3.5 text-[#213f5b]/70" />
              <input
                type="text"
                placeholder="Rechercher un ticket..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#bfddf9]/30 focus:outline-none focus:ring-2 focus:ring-[#213f5b] shadow-sm bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <TagIcon className="h-5 w-5 absolute left-3 top-3.5 text-[#213f5b]/70" />
              <select
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#bfddf9]/30 text-[#213f5b] focus:outline-none focus:ring-2 focus:ring-[#213f5b] shadow-sm appearance-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23213f5b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.75rem_center] bg-[size:1.5em_1.5em] bg-no-repeat"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    Statut: {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <CpuChipIcon className="h-5 w-5 absolute left-3 top-3.5 text-[#213f5b]/70" />
              <select
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#bfddf9]/30 text-[#213f5b] focus:outline-none focus:ring-2 focus:ring-[#213f5b] shadow-sm appearance-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23213f5b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.75rem_center] bg-[size:1.5em_1.5em] bg-no-repeat"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    Catégorie: {option}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Sort controls */}
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-600">
              {filteredAndSortedTickets.length} ticket{filteredAndSortedTickets.length !== 1 ? 's' : ''} trouvé{filteredAndSortedTickets.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Trier par:</span>
              <select
                className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#213f5b] focus:outline-none shadow-sm"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">Plus récent</option>
                <option value="oldest">Plus ancien</option>
              </select>
            </div>
          </div>

          {/* Tickets List */}
          <motion.div className="space-y-4">
            <AnimatePresence>
              {filteredAndSortedTickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-[#bfddf9]/20 hover:border-[#d2fcb2]/50 transition-all overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-[#bfddf9]/40 to-[#bfddf9]/20 rounded-xl shadow-sm">
                          {getCategoryIcon(ticket.category)}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-xl font-semibold text-[#213f5b]">
                              {ticket.subject}
                            </h3>
                            <span className="ml-3 text-xs bg-[#213f5b]/10 px-2 py-0.5 rounded-full text-[#213f5b]">
                              #{ticket.ticketNumber}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <StatusBadge status={ticket.status} />
                            <CategoryBadge category={ticket.category} />
                            
                            {ticket.warranty && (
                              <span className="flex items-center gap-1 px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full text-sm border border-blue-200 shadow-sm">
                                <CheckBadgeIcon className="h-3.5 w-3.5" />
                                Sous garantie
                              </span>
                            )}

                            {ticket.attestation?.downloadAvailable && (
                              <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-sm border border-emerald-200 shadow-sm">
                                <FileSignature className="h-3.5 w-3.5" />
                                {ticket.attestation.signed ? 'Attestation signée' : 'Attestation disponible'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedTicket(ticket)}
                        className="px-4 py-2 bg-gradient-to-r from-[#213f5b] to-[#1a365d] text-white rounded-lg flex items-center gap-2 hover:shadow-md transition-all text-sm self-start md:self-center"
                      >
                        Détails
                        <ChevronRightIcon className="h-4 w-4" />
                      </motion.button>
                    </div>

                    <div className="mt-4 pl-14 space-y-2 text-sm text-[#213f5b]/80">
                      <p className="line-clamp-2">{ticket.description}</p>
                      <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <CalendarDaysIcon className="h-4 w-4" />
                          <span>Créé le {ticket.createdDate}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <TagIcon className="h-4 w-4" />
                          <span>{ticket.equipmentType} {ticket.equipmentModel}</span>
                        </div>
                        
                        {ticket.start && (
                          <div className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            <span>
                              RDV: {new Date(ticket.start).toLocaleDateString('fr-FR')} ({new Date(ticket.start).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})})
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <ArrowPathIcon className="h-4 w-4" />
                          <span>
                            Dernière mise à jour: {ticket.lastUpdate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredAndSortedTickets.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div className="mx-auto max-w-md">
                <div className="bg-[#213f5b]/5 p-4 rounded-full mx-auto w-20 h-20 flex items-center justify-center mb-4">
                  <ChatBubbleLeftRightIcon className="h-12 w-12 text-[#213f5b]/40" />
                </div>
                <h3 className="text-xl font-semibold text-[#213f5b]">
                  Aucun ticket trouvé
                </h3>
                <p className="mt-2 text-[#213f5b]/70 max-w-xs mx-auto">
                  Essayez d&apos;ajuster vos filtres de recherche ou créez une nouvelle demande d&apos;assistance
                </p>
                <button className="mt-6 px-4 py-2 bg-[#213f5b] text-white rounded-lg hover:bg-[#1a365d] transition-colors flex items-center gap-2 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Nouvelle demande
                </button>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Ticket Detail Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Enhanced Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-black/70 to-[#1a365d]/70 backdrop-blur-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedTicket(null)}
            />
            
            <motion.div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] relative z-10 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with enhanced design */}
              <div className="bg-gradient-to-r from-[#0f2947] via-[#1a365d] to-[#2c4f76] p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                    <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                      <circle id="pattern-circle" cx="20" cy="20" r="3" fill="#fff"></circle>
                    </pattern>
                    <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
                  </svg>
                </div>
                
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/15 p-2.5 rounded-xl shadow-sm backdrop-blur-sm">
                      <TicketIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h2 className="text-2xl font-bold text-white truncate mr-2">
                          {selectedTicket.subject || selectedTicket.title}
                        </h2>
                        <CategoryBadge category={selectedTicket.category} />
                      </div>
                      <p className="text-blue-200 text-sm mt-0.5">
                        {selectedTicket.equipmentType} - {selectedTicket.equipmentModel}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="text-white hover:text-[#d2fcb2] transition-colors focus:outline-none focus:ring-2 focus:ring-[#bfddf9] focus:ring-offset-2 focus:ring-offset-[#213f5b] rounded-full p-1"
                    aria-label="Close"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="bg-white/20 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10 shadow-sm">
                    #{selectedTicket.ticketNumber || selectedTicket.ticket}
                  </span>
                  <StatusBadge status={selectedTicket.status} />
                  {selectedTicket.warranty && (
                    <span className="flex items-center gap-1.5 backdrop-blur-sm bg-blue-500/20 px-3 py-1.5 rounded-full text-blue-100 border border-blue-300/30 shadow-sm">
                      <CheckBadgeIcon className="h-3.5 w-3.5" />
                      Sous garantie
                    </span>
                  )}
                  {selectedTicket.attestation?.downloadAvailable && (
                    <span className="flex items-center gap-1.5 backdrop-blur-sm bg-green-500/20 px-3 py-1.5 rounded-full text-green-100 border border-green-300/30 shadow-sm">
                      <FileSignature className="h-3.5 w-3.5" />
                      {selectedTicket.attestation.signed ? 'Attestation signée' : 'Attestation disponible'}
                    </span>
                  )}
                  <span className="flex items-center text-white/90 text-sm ml-auto backdrop-blur-sm bg-white/10 px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
                    <CalendarDaysIcon className="h-4 w-4 mr-2" />
                    Demande créée le {formatDate(selectedTicket.createdAt)}
                  </span>
                </div>
                
                {/* Tab Navigation */}
                <div className="mt-6 flex border-b border-white/20 relative">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-4 py-2 text-sm font-medium relative ${
                      activeTab === 'details' 
                        ? 'text-white' 
                        : 'text-blue-200 hover:text-white transition-colors'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <DocumentTextIcon className="h-4 w-4" />
                      Détails
                    </div>
                    {activeTab === 'details' && (
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t-full"
                        layoutId="activeTab"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('conversation')}
                    className={`px-4 py-2 text-sm font-medium relative ${
                      activeTab === 'conversation' 
                        ? 'text-white' 
                        : 'text-blue-200 hover:text-white transition-colors'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <ChatBubbleLeftRightIcon className="h-4 w-4" />
                      Conversation
                      <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {selectedTicket.conversation.length}
                      </span>
                    </div>
                    {activeTab === 'conversation' && (
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t-full"
                        layoutId="activeTab"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('files')}
                    className={`px-4 py-2 text-sm font-medium relative ${
                      activeTab === 'files' 
                        ? 'text-white' 
                        : 'text-blue-200 hover:text-white transition-colors'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-4 w-4" />
                      Documents
                      <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {selectedTicket.attachments.length}
                      </span>
                    </div>
                    {activeTab === 'files' && (
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t-full"
                        layoutId="activeTab"
                      />
                    )}
                  </button>
                  {/* New Attestation Tab */}
                  <button
                    onClick={() => setActiveTab('attestation')}
                    className={`px-4 py-2 text-sm font-medium relative ${
                      activeTab === 'attestation' 
                        ? 'text-white' 
                        : 'text-blue-200 hover:text-white transition-colors'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <FileSignature className="h-4 w-4" />
                      Attestation
                    </div>
                    {activeTab === 'attestation' && (
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t-full"
                        layoutId="activeTab"
                      />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Content with tabs */}
              <div className="max-h-[calc(90vh-200px)] overflow-y-auto bg-gray-50">
                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                    {/* Left Column - 2/3 width */}
                    <div className="md:col-span-2 p-6 space-y-6 bg-white border-r border-gray-100">
                      <div className="flex items-center space-x-3 mb-5 pb-2 border-b border-gray-100">
                        <DocumentTextIcon className="h-5 w-5 text-[#1a365d]" />
                        <h3 className="text-lg font-semibold text-gray-800">Détails de votre demande</h3>
                      </div>
                      
                      {/* Problem Card */}
                      <div className="bg-gradient-to-br from-[#bfddf9]/10 to-[#bfddf9]/5 p-5 rounded-2xl border border-[#bfddf9]/30 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-start gap-4">
                          <div className="bg-gradient-to-br from-[#1a365d] to-[#213f5b] rounded-full p-3 shadow-md flex-shrink-0">
                            <ExclamationTriangleIcon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-[#1a365d] font-semibold text-lg flex items-center">
                              Problème signalé
                              <span className="ml-2 text-xs bg-[#1a365d]/10 text-[#1a365d] px-2 py-0.5 rounded-full">
                                Le {selectedTicket.createdDate}
                              </span>
                            </h3>
                            <div className="text-gray-700 mt-3 p-4 bg-white/80 rounded-xl border border-[#bfddf9]/20">
                              <div className="font-medium">{selectedTicket.problem}</div>
                              <div className="mt-3 text-sm text-gray-500">
                                {selectedTicket.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Solution Card */}
                      <div className="bg-gradient-to-br from-[#d2fcb2]/15 to-[#d2fcb2]/5 p-5 rounded-2xl border border-[#d2fcb2]/30 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-start gap-4">
                          <div className="bg-gradient-to-br from-[#2e5e3a] to-[#3d7a4c] rounded-full p-3 shadow-md flex-shrink-0">
                            <CheckBadgeIcon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-[#2e5e3a] font-semibold text-lg flex items-center">
                              Solution proposée
                              <span className="ml-2 text-xs bg-[#2e5e3a]/10 text-[#2e5e3a] px-2 py-0.5 rounded-full">
                                {selectedTicket.status === "Fermé" ? "Résolu" : "En attente"}
                              </span>
                            </h3>
                            <div className="text-gray-700 mt-3 p-4 bg-white/80 rounded-xl border border-[#d2fcb2]/20">
                              <div className="font-medium">
                                {selectedTicket.solution || selectedTicket.type || "Notre équipe technique est en train d'analyser votre demande."}
                              </div>
                              
                              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                                  <div className="bg-gray-200 p-1.5 rounded-md mr-2">
                                    <TagIcon className="h-4 w-4 text-gray-500" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Type d&apos;équipement</p>
                                    <p className="font-medium">{selectedTicket.equipmentType}</p>
                                  </div>
                                </div>
                                <div className="flex items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                                  <div className="bg-gray-200 p-1.5 rounded-md mr-2">
                                    <CpuChipIcon className="h-4 w-4 text-gray-500" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Modèle</p>
                                    <p className="font-medium">{selectedTicket.equipmentModel}</p>
                                  </div>
                                </div>
                              </div>
                              
                              {selectedTicket.totalCost !== undefined && selectedTicket.totalCost > 0 && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Coût d&apos;intervention</span>
                                    <span className="font-bold text-[#213f5b]">{selectedTicket.totalCost.toFixed(2)} €</span>
                                  </div>
                                  {selectedTicket.warranty && (
                                    <p className="text-xs text-green-600 mt-1">Intervention sous garantie - Aucun frais</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Map Component */}
                      {selectedTicket.location && (
                        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 relative">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="bg-gradient-to-br from-[#1a365d] to-[#213f5b] rounded-full p-3 shadow-md flex-shrink-0">
                              <MapPinIcon className="h-5 w-5 text-white" />
                            </div>
                            <div className="w-full">
                              <h3 className="text-[#1a365d] font-semibold text-lg flex items-center">
                                Lieu d&apos;intervention
                              </h3>
                              <div className="flex items-center mt-3">
                                <div className="flex-grow">
                                  <p className="text-gray-700 font-medium p-3 bg-white/80 rounded-xl border border-gray-200">{selectedTicket.location}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Map View Options */}
                          <div className="absolute top-3 right-3 z-10 bg-white rounded-lg shadow-md border border-gray-200 flex overflow-hidden">
                            <button 
                              className={`p-2 transition-colors border-r border-gray-200 focus:outline-none ${
                                mapType === 'roadmap' ? 'bg-[#1a365d]/10 text-[#1a365d]' : 'hover:bg-gray-100 text-gray-500'
                              }`}
                              onClick={() => setMapType('roadmap')}
                              title="Vue standard"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                              </svg>
                            </button>
                            <button 
                              className={`p-2 transition-colors focus:outline-none ${
                                mapType === 'satellite' ? 'bg-[#1a365d]/10 text-[#1a365d]' : 'hover:bg-gray-100 text-gray-500'
                              }`}
                              onClick={() => setMapType('satellite')}
                              title="Vue satellite"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          </div>
                          
                          {/* Google Maps iframe */}
                          <div className="h-72 w-full rounded-xl overflow-hidden border border-gray-200 shadow-md">
                            <iframe 
                              width="100%" 
                              height="100%" 
                              frameBorder="0" 
                              scrolling="no"
                              src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedTicket.location)}&t=${mapType === 'satellite' ? 'k' : 'm'}&z=16&ie=UTF8&iwloc=&output=embed`} 
                              style={{ border: 0 }}
                              title="Location"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Right Column - 1/3 width */}
                    <div className="md:col-span-1 p-6 space-y-6 bg-gray-50">
                      {/* Status Timeline */}
                      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                        <h3 className="flex items-center text-[#1a365d] font-semibold text-lg mb-5 pb-2 border-b border-gray-100">
                          <CalendarDaysIcon className="h-5 w-5 mr-2" /> Suivi de votre demande
                        </h3>
                        
                        <div className="space-y-5">
                          {selectedTicket.statusHistory.map((item, index) => (
                            <div key={index} className="relative pl-8 before:content-[''] before:absolute before:left-3 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-[#bfddf9] before:to-[#d2fcb2]/30">
                              <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-gradient-to-br from-[#bfddf9] to-[#8cb8d8] shadow-md flex items-center justify-center">
                                {index === 0 ? (
                                  <CalendarDaysIcon className="h-3 w-3 text-white" />
                                ) : (
                                  <ArrowPathIcon className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <div className="bg-white/50 p-3 rounded-xl border border-[#bfddf9]/20">
                                <p className="text-sm font-medium text-[#1a365d]">{item.status}</p>
                                <p className="text-sm text-gray-700">{item.date}</p>
                              </div>
                            </div>
                          ))}
                          
                          {selectedTicket.status !== "Fermé" && (
                            <div className="relative pl-8 before:content-[''] before:absolute before:left-3 before:top-0 before:h-6 before:w-px before:bg-gradient-to-b before:from-[#d2fcb2] before:to-transparent">
                              <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-white border-2 border-dashed border-[#d2fcb2] flex items-center justify-center">
                                <CheckBadgeIcon className="h-3 w-3 text-[#2e5e3a]/40" />
                              </div>
                              <div className="p-3 rounded-xl border border-dashed border-[#d2fcb2]/40 text-center">
                                <p className="text-sm text-[#2e5e3a]/60">Résolution en attente</p>
                              </div>
                            </div>
                          )}
                          
                          {/* Show signature timestamp if attestation is signed */}
                          {selectedTicket.attestation?.signed && selectedTicket.attestation.signatureDate && (
                            <div className="relative pl-8 before:content-[''] before:absolute before:left-3 before:top-0 before:h-6 before:w-px before:bg-gradient-to-b before:from-[#d2fcb2] before:to-transparent">
                              <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-gradient-to-br from-[#2e5e3a] to-[#3d7a4c] flex items-center justify-center">
                                <FileSignature className="h-3 w-3 text-white" />
                              </div>
                              <div className="bg-green-50 p-3 rounded-xl border border-green-200">
                                <p className="text-sm font-medium text-[#2e5e3a]">Attestation signée</p>
                                <p className="text-sm text-green-700">{selectedTicket.attestation.signatureDate}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Technician Info */}
                      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                        <h3 className="flex items-center text-[#1a365d] font-semibold text-lg mb-4 pb-2 border-b border-gray-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Technicien assigné
                        </h3>
                        
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#1a365d] to-[#213f5b] flex items-center justify-center text-white text-lg font-bold">
                            {selectedTicket.technicianFirstName.charAt(0)}{selectedTicket.technicianLastName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium">{selectedTicket.technicianFirstName} {selectedTicket.technicianLastName}</h4>
                            <p className="text-sm text-gray-500">Technicien spécialisé</p>
                          </div>
                        </div>
                        
                        {selectedTicket.start && selectedTicket.end && (
                          <div className="mt-4 p-3 bg-[#1a365d]/5 rounded-xl text-sm">
                            <h4 className="font-medium text-[#1a365d] mb-2">Rendez-vous planifié</h4>
                            <div className="flex items-center gap-3 mb-2">
                              <CalendarDaysIcon className="h-4 w-4 text-[#1a365d]" />
                              <span className="text-gray-700">
                                {new Date(selectedTicket.start).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <ClockIcon className="h-4 w-4 text-[#1a365d]" />
                              <span className="text-gray-700">
                                {new Date(selectedTicket.start).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})} - 
                                {new Date(selectedTicket.end).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                     {/* Fixed satisfaction rendering with proper null checks */}
                      {selectedTicket.status === "Fermé" && !(selectedTicket.satisfaction && selectedTicket.satisfaction > 0) && (
                        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                          <h3 className="flex items-center text-[#1a365d] font-semibold text-lg mb-3 pb-2 border-b border-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Votre avis compte
                          </h3>
                          
                          <p className="text-sm text-gray-600 mb-4">
                            Comment évalueriez-vous notre service pour cette intervention ?
                          </p>
                          
                          <div className="flex justify-center space-x-2 mb-4">
                            {[1, 2, 3, 4, 5].map(rating => (
                              <button 
                                key={rating}
                                className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 flex items-center justify-center transition-all"
                              >
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  viewBox="0 0 24 24" 
                                  fill="currentColor" 
                                  className="w-6 h-6 text-gray-300 hover:text-yellow-400 transition-colors"
                                >
                                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                </svg>
                              </button>
                            ))}
                          </div>
                          
                          <button className="w-full bg-[#1a365d] text-white py-2 rounded-lg hover:bg-[#213f5b] transition-colors">
                            Envoyer mon évaluation
                          </button>
                        </div>
                      )}

                      {/* If satisfaction already given, show it - with proper null checks */}
                      {selectedTicket.satisfaction !== undefined && selectedTicket.satisfaction > 0 && (
                        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                          <h3 className="flex items-center text-[#1a365d] font-semibold text-lg mb-3 pb-2 border-b border-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Votre évaluation
                          </h3>
                          
                          <div className="flex justify-center items-center flex-col">
                            <div className="flex space-x-1 mb-2">
                              {[1, 2, 3, 4, 5].map(star => (
                                <svg
                                  key={star}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill={star <= (selectedTicket.satisfaction ?? 0) ? "#FFD700" : "#E5E7EB"}
                                  className="h-6 w-6"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ))}
                            </div>
                            <p className="text-xl font-bold text-[#213f5b]">{(selectedTicket.satisfaction ?? 0).toFixed(1)}/5</p>
                            <p className="text-sm text-gray-500 mt-1">Merci pour votre évaluation!</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Conversation Tab */}
                {activeTab === 'conversation' && (
                  <div className="min-h-[400px] flex flex-col bg-gray-50">
                    <div className="flex-1 p-6 overflow-y-auto space-y-6">
                      {selectedTicket.conversation.map((msg, index) => {
                        const isTechnician = msg.sender === "technicien";
                        const date = new Date(msg.timestamp);
                        
                        return (
                          <div key={index} className={`flex ${isTechnician ? 'justify-start' : 'justify-end'}`}>
                            <div className={`relative max-w-md rounded-2xl px-5 py-4 ${
                              isTechnician 
                                ? 'bg-white border border-[#bfddf9]/50 text-gray-800 rounded-tl-none shadow-sm ml-2' 
                                : 'bg-gradient-to-r from-[#1a365d] to-[#213f5b] text-white rounded-tr-none shadow-sm mr-2'
                            }`}>
                              {isTechnician && (
                                <div className="absolute -left-2 top-0 w-0 h-0 border-t-8 border-r-8 border-transparent border-r-white"></div>
                              )}
                              {!isTechnician && (
                                <div className="absolute -right-2 top-0 w-0 h-0 border-t-8 border-l-8 border-transparent border-l-[#1a365d]"></div>
                              )}
                              <div className="text-xs mb-1 font-medium flex items-center gap-2">
                                {isTechnician && (
                                  <>
                                    <div className="h-5 w-5 rounded-full bg-[#1a365d] flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                    </div>
                                    <span>
                                      {selectedTicket.technicianFirstName} ({isTechnician ? 'Technicien' : 'Vous'})
                                    </span>
                                  </>
                                )}
                                {!isTechnician && (
                                  <>
                                  <span>
                                    Vous
                                  </span>
                                  <div className="h-5 w-5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#1a365d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                  </div>
                                </>
                              )}
                            </div>
                            <p className="text-base">{msg.message}</p>
                            <div className={`text-xs text-right mt-2 ${isTechnician ? 'text-gray-500' : 'text-white/75'}`}>
                              {date.toLocaleDateString('fr-FR')} · {date.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="p-4 border-t border-gray-200 bg-white shadow-lg">
                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
                      <div className="flex-1 relative rounded-xl border border-gray-200 overflow-hidden hover:border-[#1a365d]/30 focus-within:border-[#1a365d] transition-colors">
                        <input 
                          type="text" 
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Répondre au technicien..." 
                          className="w-full px-4 py-3 pr-10 focus:outline-none focus:ring-0 bg-transparent" 
                        />
                      </div>
                      <button 
                        type="submit"
                        className="p-3 bg-gradient-to-r from-[#1a365d] to-[#213f5b] text-white rounded-xl hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!newMessage.trim()}
                      >
                        <PaperAirplaneIcon className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </div>
              )}
              
              {/* Files/Documents Tab */}
              {activeTab === 'files' && (
                <div className="p-6 min-h-[400px] bg-gray-50">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                    <div className="p-4 bg-[#1a365d] text-white flex items-center justify-between">
                      <h3 className="font-medium flex items-center gap-2">
                        <DocumentTextIcon className="h-5 w-5" />
                        Documents liés à votre demande
                      </h3>
                    </div>
                    <div className="p-5 space-y-4">
                      {selectedTicket.attachments.length > 0 ? (
                        <>
                          {selectedTicket.attachments.map((file, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#1a365d]/30 transition-colors cursor-pointer group">
                              <div className="bg-[#1a365d]/10 p-3 rounded-lg">
                                {file.type === 'PDF' ? (
                                  <DocumentTextIcon className="h-6 w-6 text-[#1a365d]" />
                                ) : (
                                  <PhotoIcon className="h-6 w-6 text-[#1a365d]" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#1a365d] transition-colors">{file.name}</h4>
                                <p className="text-xs text-gray-500">{file.type} - {file.size}</p>
                              </div>
                              <button className="p-2 text-gray-400 hover:text-[#1a365d] rounded-full hover:bg-[#1a365d]/10 transition-colors">
                                <ArrowDownTrayIcon className="h-5 w-5" />
                              </button>
                            </div>
                          ))}
                          
                          <button className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-gray-300 rounded-xl text-[#1a365d] hover:bg-[#1a365d]/5 hover:border-[#1a365d]/30 transition-all mt-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Ajouter un document</span>
                          </button>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <div className="bg-[#1a365d]/5 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-3">
                            <DocumentTextIcon className="h-8 w-8 text-[#1a365d]/40" />
                          </div>
                          <h4 className="text-gray-800 font-medium mb-1">Aucun document disponible</h4>
                          <p className="text-gray-500 text-sm mb-4">Les documents liés à votre demande apparaîtront ici</p>
                          <button className="inline-flex items-center px-4 py-2 bg-[#1a365d] text-white rounded-lg shadow hover:bg-[#1a365d]/90 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Ajouter un document
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Attestation Tab */}
              {activeTab === 'attestation' && (
                <div className="p-6 min-h-[400px] bg-gray-50">
                  {!selectedTicket.attestation?.downloadAvailable ? (
                    <div className="text-center py-8 bg-white rounded-xl shadow-sm border border-gray-200">
                      <div className="mx-auto max-w-md">
                        <div className="bg-[#1a365d]/5 p-4 rounded-full mx-auto w-20 h-20 flex items-center justify-center mb-4">
                          <FileSignature className="h-10 w-10 text-[#1a365d]/40" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#1a365d]">
                          Attestation non disponible
                        </h3>
                        <p className="mt-2 text-[#213f5b]/70 max-w-xs mx-auto">
                          L&apos;attestation d&apos;intervention sera disponible une fois que le technicien aura complété l&apos;intervention.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {isSigningAttestation ? (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                          <div className="p-4 bg-[#1a365d] text-white">
                            <h3 className="font-medium flex items-center gap-2">
                              <PenTool className="h-5 w-5" />
                              Signature de l&apos;attestation d&apos;intervention
                            </h3>
                          </div>
                          <div className="p-6">
                            <div className="mb-4 text-gray-700">
                              <p>Veuillez signer ci-dessous pour confirmer l&apos;achèvement de l&apos;intervention selon les termes convenus.</p>
                            </div>
                            
                            <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-4">
                              <canvas 
                                ref={signatureCanvasRef}
                                width={580}
                                height={200}
                                className="w-full touch-none bg-white"
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                              />
                            </div>
                            
                            <div className="flex justify-between gap-4">
                              <button 
                                onClick={clearSignature}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                              >
                                <XMarkIcon className="h-5 w-5" />
                                Effacer
                              </button>
                              
                              <div className="flex gap-3">
                                <button 
                                  onClick={() => setIsSigningAttestation(false)}
                                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  Annuler
                                </button>
                                <button
                                  onClick={submitSignature}
                                  disabled={!signature}
                                  className="px-4 py-2 bg-gradient-to-r from-[#1a365d] to-[#213f5b] text-white rounded-lg shadow hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                  <FileSignature className="h-5 w-5" />
                                  Valider la signature
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                          <div className="p-4 bg-[#1a365d] text-white flex items-center justify-between">
                            <h3 className="font-medium flex items-center gap-2">
                              <FileSignature className="h-5 w-5" />
                              Attestation d&apos;intervention
                            </h3>
                            {selectedTicket.attestation.signed && (
                              <span className="px-3 py-1 bg-green-500/20 rounded-full text-sm text-green-50 border border-green-400/30">
                                Signée le {selectedTicket.attestation.signatureDate}
                              </span>
                            )}
                          </div>
                          <div className="p-6">
                            <div className="mb-6 text-center">
                              <div className="mx-auto w-24 h-24 bg-[#1a365d]/5 rounded-full flex items-center justify-center mb-3">
                                <FileSignature className="h-12 w-12 text-[#1a365d]" />
                              </div>
                              <h4 className="text-xl font-semibold text-[#1a365d]">
                                Attestation {selectedTicket.attestation.signed ? 'signée' : 'à signer'}
                              </h4>
                              <p className="text-gray-600 mt-1 max-w-md mx-auto">
                                {selectedTicket.attestation.signed 
                                  ? "L'attestation d'intervention a été signée et est disponible pour téléchargement." 
                                  : "Veuillez signer l'attestation d'intervention pour confirmer la complétion des travaux."}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                              <div>
                                <p className="text-sm font-medium text-gray-500">Intervention</p>
                                <p className="font-semibold">{selectedTicket.subject}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">Numéro de ticket</p>
                                <p className="font-semibold">#{selectedTicket.ticketNumber}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">Technicien</p>
                                <p className="font-semibold">{selectedTicket.technicianFirstName} {selectedTicket.technicianLastName}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">Date d&apos;intervention</p>
                                <p className="font-semibold">{selectedTicket.start ? new Date(selectedTicket.start).toLocaleDateString('fr-FR') : selectedTicket.createdDate}</p>
                              </div>
                            </div>
                            
                            <div className="flex justify-between gap-4">
                              <button 
                                onClick={downloadAttestation}
                                className="px-4 py-2 border border-[#1a365d] text-[#1a365d] rounded-lg hover:bg-[#1a365d]/5 transition-colors flex items-center gap-2"
                              >
                                <Download className="h-5 w-5" />
                                Télécharger l&apos;attestation
                              </button>
                              
                              {!selectedTicket.attestation.signed && (
                                <button
                                  onClick={() => setIsSigningAttestation(true)}
                                  className="px-4 py-2 bg-gradient-to-r from-[#1a365d] to-[#213f5b] text-white rounded-lg shadow hover:shadow-md transition-all flex items-center gap-2"
                                >
                                  <PenTool className="h-5 w-5" />
                                  Signer l&apos;attestation
                                </button>
                              )}
                              
                              {selectedTicket.attestation.signed && (
                                <button
                                  onClick={() => null}
                                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg shadow hover:shadow-md transition-all flex items-center gap-2"
                                >
                                  <Send className="h-5 w-5" />
                                  Envoyer par email
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Footer with action buttons */}
            <div className="border-t border-gray-200 p-5 flex justify-end items-center gap-3 bg-white">
              <button 
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
              
              {selectedTicket.status !== "Fermé" && (
                <button className="px-4 py-2 bg-gradient-to-r from-[#1a365d] to-[#213f5b] text-white rounded-lg shadow hover:shadow-md transition-all">
                  Contacter le technicien
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
}
