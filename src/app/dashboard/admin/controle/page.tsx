"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { PhoneIcon } from "@heroicons/react/24/outline";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  // CheckIcon,
  ClockIcon,
  CalendarIcon,
  // MapPinIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  // ArrowTrendingUpIcon,
  // ArrowTrendingDownIcon,
  BuildingOfficeIcon,
  UserIcon,
  ShieldCheckIcon,
  // ExclamationCircleIcon,
  ChartBarIcon,
  FunnelIcon,
  // Bars3Icon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Header } from "@/components/Header";
// import { Button } from "@/components/ui/Button";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "moment/locale/fr";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { fr } from 'date-fns/locale/fr';
import { format, isToday, addDays, subDays } from "date-fns";
import { fr as dateFnsFr } from "date-fns/locale";
import { User, Clock, MapPin, Send, Mail, Phone, ChevronDownIcon } from "lucide-react";
import NewTaskModal from "./NewTaskModal";
import ConversationsPanel from "./ConversationsPanel";

// Register the French locale for DatePicker
registerLocale('fr', fr);
setDefaultLocale('fr');

// Set moment locale to French
moment.locale("fr");
const localizer = momentLocalizer(moment);

// Types for the components
interface Controller {
  id: string;
  name: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
}

interface Organization {
  id: string;
  name: string;
  type: "CEE" | "MPR";
  logo: string;
}

// First, define an interface for the calendar event
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: "en_attente" | "a_placer" | "en_controle" | "controle";
  priority: "high" | "medium" | "low";
  controllerId: string;
  organizationId: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  address: string;
  allDay: boolean;
  type: string;
}

interface ControlTask {
  id: string;
  title: string;
  organizationId: string;
  controllerId: string;
  status: "en_attente" | "a_placer" | "en_controle" | "controle";
  priority: "high" | "medium" | "low";
  startDate: Date | string;
  endDate: Date | string;
  address: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  documents: Document[];
  notes?: string;
  type: string;
  conversation?: Message[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  required: boolean;
  uploaded: boolean;
  dateUploaded?: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface EmailTemplate {
  id: string;
  title: string;
  subject: string;
  content: string;
}

// Sample data for controllers
const controllers: Controller[] = [
  {
    id: "veritas",
    name: "Bureau Veritas",
    logo: "/veritas.png",
    email: "contact@bureauveritas.fr",
    phone: "01 42 91 52 91",
    address: "40 Av. du Général de Gaulle, 92800 Puteaux"
  },
  {
    id: "qualigaz-evonia",
    name: "Qualigaz Evonia",
    logo: "/qualigaz.png",
    email: "contact@qualigaz.com",
    phone: "01 41 49 57 57",
    address: "2 Pl. de la Gare, 95210 Saint-Gratien"
  }
];

// Update the organizations data to include logos
const organizations: Organization[] = [
  { id: "cee", name: "Certificats d'Économies d'Énergie", type: "CEE", logo: "/cee.png" },
  { id: "mpr", name: "MaPrimeRénov'", type: "MPR", logo: "/mpr.svg" }
];

// Email templates
const emailTemplates: EmailTemplate[] = [
  {
    id: "template1",
    title: "Confirmation de contrôle planifié",
    subject: "Confirmation de votre contrôle sur site",
    content: "Madame, Monsieur,\n\nNous avons le plaisir de vous confirmer que le contrôle sur site sera effectué le {{date}} à {{heure}} par notre partenaire {{controlleur}}.\n\nMerci de bien vouloir vous assurer que tous les documents nécessaires sont disponibles.\n\nCordialement,\nL'équipe d'EcologyB"
  },
  {
    id: "template2",
    title: "Rappel de contrôle",
    subject: "Rappel : Contrôle sur site demain",
    content: "Madame, Monsieur,\n\nNous vous rappelons que le contrôle sur site aura lieu demain, {{date}} à {{heure}}.\n\nVeuillez vous assurer d'être présent(e) et que tous les documents nécessaires sont disponibles.\n\nCordialement,\nL'équipe d'EcologyB"
  },
  {
    id: "template3",
    title: "Contrôle effectué",
    subject: "Compte-rendu de contrôle sur site",
    content: "Madame, Monsieur,\n\nNous vous informons que le contrôle sur site a été effectué le {{date}}.\n\nVous recevrez prochainement le rapport complet par email.\n\nNous vous remercions pour votre collaboration.\n\nCordialement,\nL'équipe d'EcologyB"
  }
];

// Sample documents required for control
const requiredDocuments: Document[] = [
  { id: "doc1", name: "Formulaire d'attestation sur l'honneur", type: "PDF", url: "/documents/attestation.pdf", required: true, uploaded: false },
  { id: "doc2", name: "Devis signé", type: "PDF", url: "/documents/devis.pdf", required: true, uploaded: true, dateUploaded: "2023-10-15" },
  { id: "doc3", name: "Factures acquittées", type: "PDF", url: "/documents/factures.pdf", required: true, uploaded: false },
  { id: "doc4", name: "Photos des travaux", type: "JPG", url: "/documents/photos.jpg", required: true, uploaded: true, dateUploaded: "2023-10-20" },
  { id: "doc5", name: "Certificat RGE", type: "PDF", url: "/documents/certificat_rge.pdf", required: true, uploaded: true, dateUploaded: "2023-09-10" },
  { id: "doc6", name: "Avis d'imposition", type: "PDF", url: "/documents/avis_imposition.pdf", required: false, uploaded: false }
];

// Sample control tasks
const sampleControlTasks: ControlTask[] = [
  {
    id: "task1",
    title: "Contrôle PAC Air-Eau",
    organizationId: "cee",
    controllerId: "veritas",
    status: "en_attente",
    priority: "high",
    startDate: addDays(new Date(), 2),
    endDate: addDays(new Date(), 2),
    address: "15 Rue de la Paix, 75001 Paris",
    client: {
      id: "client1",
      name: "Martin Dupont",
      email: "martin.dupont@example.com",
      phone: "0612345678"
    },
    documents: requiredDocuments,
    notes: "Première installation, contrôle obligatoire pour validation CEE",
    type: "Pompe à chaleur",
    conversation: [
      {
        id: "msg1",
        sender: "Contrôleur",
        content: "Bonjour, je confirme ma disponibilité pour le contrôle le 12 novembre.",
        timestamp: "2023-11-02T10:30:00",
        read: true
      },
      {
        id: "msg2",
        sender: "Client",
        content: "Parfait, je serai présent. Dois-je préparer des documents spécifiques ?",
        timestamp: "2023-11-02T11:15:00",
        read: true
      }
    ]
  },
  {
    id: "task2",
    title: "Vérification isolation combles",
    organizationId: "mpr",
    controllerId: "qualigaz-evonia",
    status: "a_placer",
    priority: "medium",
    startDate: addDays(new Date(), 5),
    endDate: addDays(new Date(), 5),
    address: "27 Avenue Victor Hugo, 69003 Lyon",
    client: {
      id: "client2",
      name: "Sophie Martin",
      email: "sophie.martin@example.com",
      phone: "0698765432"
    },
    documents: requiredDocuments.slice(0, 4),
    notes: "Isolation de combles perdus, accès par trappe dans le placard",
    type: "Isolation"
  },
  {
    id: "task3",
    title: "Contrôle installation solaire",
    organizationId: "cee",
    controllerId: "veritas",
    status: "en_controle",
    priority: "low",
    startDate: new Date(),
    endDate: new Date(),
    address: "8 Boulevard Magenta, 33000 Bordeaux",
    client: {
      id: "client3",
      name: "Philippe Durand",
      email: "philippe.durand@example.com",
      phone: "0678912345"
    },
    documents: requiredDocuments.slice(1, 5),
    notes: "Panneaux solaires installés sur toit exposé sud, accès par échelle",
    type: "Panneaux solaires"
  },
  {
    id: "task4",
    title: "Vérification chaudière",
    organizationId: "mpr",
    controllerId: "qualigaz-evonia",
    status: "controle",
    priority: "high",
    startDate: subDays(new Date(), 2),
    endDate: subDays(new Date(), 2),
    address: "42 Rue du Commerce, 44000 Nantes",
    client: {
      id: "client4",
      name: "Claire Lefevre",
      email: "claire.lefevre@example.com",
      phone: "0654321987"
    },
    documents: requiredDocuments,
    notes: "Remplacement de chaudière fioul par chaudière gaz à condensation",
    type: "Chaudière"
  },
  {
    id: "task5",
    title: "Installation VMC",
    organizationId: "cee",
    controllerId: "qualigaz-evonia",
    status: "en_attente",
    priority: "medium",
    startDate: addDays(new Date(), 7),
    endDate: addDays(new Date(), 7),
    address: "3 Rue des Fleurs, 67000 Strasbourg",
    client: {
      id: "client5",
      name: "Julien Blanc",
      email: "julien.blanc@example.com",
      phone: "0732145698"
    },
    documents: requiredDocuments.slice(0, 3),
    notes: "VMC double flux, contrôle d'étanchéité nécessaire",
    type: "VMC"
  },
  {
    id: "task6",
    title: "Contrôle isolation murs",
    organizationId: "mpr",
    controllerId: "veritas",
    status: "a_placer",
    priority: "low",
    startDate: addDays(new Date(), 9),
    endDate: addDays(new Date(), 9),
    address: "17 Avenue Jean Jaurès, 59000 Lille",
    client: {
      id: "client6",
      name: "Émilie Dubois",
      email: "emilie.dubois@example.com",
      phone: "0612378945"
    },
    documents: requiredDocuments.slice(2, 6),
    notes: "Isolation par l'extérieur, maison individuelle",
    type: "Isolation"
  }
];

// Main component
export default function ControleSurSitePage() {
  // State variables
  const [loading, setLoading] = useState(true);
  // const [sendDocs, setSendDocs] = useState(false);
  // const [showClientList, setShowClientList] = useState(false);
  // const [selectedClient, setSelectedClient] = useState(null);
  // const [newTaskController, setNewTaskController] = useState("");
  // const [newTaskOrg, setNewTaskOrg] = useState("");
  const [controlTasks, setControlTasks] = useState<ControlTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<ControlTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<ControlTask | null>(null);
  const [selectedController, setSelectedController] = useState<Controller | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [currentView, setCurrentView] = useState<"month" | "week" | "day" | "agenda">(Views.WEEK);
  const [activeViewTab, setActiveViewTab] = useState("Semaine");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [ , setSelectedEmailTemplate] = useState<EmailTemplate | null>(null);
  const [emailContent, setEmailContent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  // const [newTaskOrg, setNewTaskOrg] = useState("");
  // const [newTaskController, setNewTaskController] = useState("");
  // const [showClientDropdown, setShowClientDropdown] = useState(false);
  // const [clientSearch, setClientSearch] = useState("");
  // const [selectedClient, setSelectedClient] = useState(null);
  // const [clientName, setClientName] = useState("");
  // const [clientEmail, setClientEmail] = useState("");
  // const [clientPhone, setClientPhone] = useState("");
  // const [clientAddress, setClientAddress] = useState("");
  // const [sendDocs, setSendDocs] = useState(false);
  // const [controlDate, setControlDate] = useState(new Date());

  // Custom styles for the React Big Calendar
  // const calendarCustomStyles = {
  //   // Base styles for the calendar
  //   calendar: {
  //     borderRadius: "12px",
  //     overflow: "hidden",
  //     backgroundColor: "#fff",
  //     boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
  //   },
  //   // Styles for the day cells
  //   day: {
  //     backgroundColor: "#fff",
  //     borderColor: "#f0f0f0",
  //     transition: "all 0.2s ease-in-out"
  //   },
  //   // Styles for the time slots
  //   timeSlot: {
  //     borderColor: "#f0f0f0",
  //     borderWidth: "1px"
  //   },
  //   // Styles for the events
  //   event: {
  //     padding: "4px 6px",
  //     borderRadius: "6px",
  //     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  //     transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
  //   }
  // };

  // Fetch data on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setControlTasks(sampleControlTasks);
      setFilteredTasks(sampleControlTasks);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter tasks when search query or status filter changes
  useEffect(() => {
    let filtered = [...controlTasks];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        task =>
          task.title.toLowerCase().includes(query) ||
          task.client.name.toLowerCase().includes(query) ||
          task.address.toLowerCase().includes(query) ||
          task.type.toLowerCase().includes(query)
      );
    }

    // Apply organization filter
    if (selectedOrganization) {
      filtered = filtered.filter(task => task.organizationId === selectedOrganization.id);
    }

    // Apply controller filter
    if (selectedController) {
      filtered = filtered.filter(task => task.controllerId === selectedController.id);
    }

    setFilteredTasks(filtered);
  }, [controlTasks, searchQuery, statusFilter, selectedOrganization, selectedController]);

  // Calendar event preparations
  const calendarEvents = useMemo(() => {
    return filteredTasks.map(task => ({
      id: task.id,
      title: task.title,
      start: new Date(task.startDate),
      end: new Date(task.endDate),
      status: task.status,
      priority: task.priority,
      controllerId: task.controllerId,
      organizationId: task.organizationId,
      client: task.client,
      address: task.address,
      allDay: true,
      type: task.type
    }));
  }, [filteredTasks]);

  // Status counts for statistics cards
  const statusCounts = useMemo(() => {
    const counts = {
      en_attente: 0,
      a_placer: 0,
      en_controle: 0,
      controle: 0
    };

    controlTasks.forEach(task => {
      counts[task.status]++;
    });

    return counts;
  }, [controlTasks]);

  // Calculate percentages for statistics
  const tasksCompleted = statusCounts.controle;
  const totalTasks = controlTasks.length;
  const completionRate = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

  // Handler for navigating the calendar
  const handleCalendarNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  // Handlers for navigation buttons
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (currentView === Views.MONTH) {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (currentView === Views.WEEK) {
      newDate.setDate(newDate.getDate() - 7);
    } else if (currentView === Views.DAY || currentView === Views.AGENDA) {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (currentView === Views.MONTH) {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (currentView === Views.WEEK) {
      newDate.setDate(newDate.getDate() + 7);
    } else if (currentView === Views.DAY || currentView === Views.AGENDA) {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  // Handle view tab changes
  const viewTabs = ["Jour", "Semaine", "Mois", "Listing"];

  const handleViewChange = (view: string) => {
    setActiveViewTab(view);
    if (view === "Mois") {
      setCurrentView(Views.MONTH);
    } else if (view === "Semaine") {
      setCurrentView(Views.WEEK);
    } else if (view === "Jour") {
      setCurrentView(Views.DAY);
    } else if (view === "Listing") {
      setCurrentView(Views.AGENDA);
    }
  };

  // Handle selecting an event from the calendar
  const handleSelectEvent = (event: CalendarEvent) => {
    const task = controlTasks.find(t => t.id === event.id);
    if (task) {
      setSelectedTask(task);
      setShowChatPanel(true);
    }
  };

  // Function to update task status
  const updateTaskStatus = (taskId: string, newStatus: "en_attente" | "a_placer" | "en_controle" | "controle") => {
    const updatedTasks = controlTasks.map(task => {
      if (task.id === taskId) {
        return { ...task, status: newStatus };
      }
      return task;
    });
    setControlTasks(updatedTasks);
  };

  // Handle sending an email
  const handleSendEmail = () => {
    // In a real app, this would send the email via an API
    console.log("Sending email:", { subject: emailSubject, content: emailContent });
    alert("Email envoyé avec succès !");
    setShowEmailModal(false);
  };

  // Handle document upload
  const handleDocumentUpload = (documentId: string) => {
    if (!selectedTask) return;

    const updatedDocuments = selectedTask.documents.map(doc => {
      if (doc.id === documentId) {
        return { ...doc, uploaded: true, dateUploaded: new Date().toISOString().split('T')[0] };
      }
      return doc;
    });

    const updatedTask = { ...selectedTask, documents: updatedDocuments };
    const updatedTasks = controlTasks.map(task => {
      if (task.id === selectedTask.id) {
        return updatedTask;
      }
      return task;
    });

    setSelectedTask(updatedTask);
    setControlTasks(updatedTasks);
  };

  // Handle sending a chat message
  const handleSendMessage = () => {
    if (!chatMessage.trim() || !selectedTask) return;

    const newMessage: Message = {
      id: `msg${Date.now()}`,
      sender: "Admin",
      content: chatMessage,
      timestamp: new Date().toISOString(),
      read: false
    };

    const updatedConversation = selectedTask.conversation 
      ? [...selectedTask.conversation, newMessage] 
      : [newMessage];

    const updatedTask = { ...selectedTask, conversation: updatedConversation };
    const updatedTasks = controlTasks.map(task => {
      if (task.id === selectedTask.id) {
        return updatedTask;
      }
      return task;
    });

    setSelectedTask(updatedTask);
    setControlTasks(updatedTasks);
    setChatMessage("");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-white to-[#bfddf9]/10">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-[#213f5b] mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-lg font-semibold text-[#213f5b]">
            Chargement des contrôles...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main
          className="flex-1 overflow-y-auto"
          style={{
            background:
              "linear-gradient(135deg, rgba(191,221,249,0.15), rgba(210,252,178,0.1))",
          }}
        >
          {/* Hero Section */}
          <div
            className="w-full py-8 md:py-10 relative overflow-hidden"
            style={{ 
              background: "linear-gradient(135deg, #213f5b, #1a324a)" 
            }}
          >
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#bfddf9]/10 transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#d2fcb2]/10 transform -translate-x-1/3 translate-y-1/3"></div>

            <motion.div
              className="max-w-7xl mx-auto px-4 md:px-8 relative z-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-start md:items-center justify-between flex-col md:flex-row">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Contrôle sur site
                  </h1>
                  <p className="mt-2 md:mt-4 text-base md:text-lg text-[#d2fcb2]">
                    Planifiez et gérez vos contrôles sur site pour assurer la conformité des installations
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-3">
                  <button
                    onClick={() => setShowNewTaskModal(true)}
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg px-4 py-2 inline-flex items-center text-sm transition-all border border-white/20 shadow-lg"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Nouveau contrôle
                  </button>
                  <button
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg px-4 py-2 inline-flex items-center text-sm transition-all border border-white/20 shadow-lg"
                  >
                    <ChartBarIcon className="h-4 w-4 mr-2" />
                    Statistiques
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
            {/* Stats Section */}
            <motion.div
              className="mb-6 md:mb-8 grid grid-cols-2 lg:grid-cols-5 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Total Controls */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="flex h-full">
                  <div className="w-2 bg-gradient-to-b from-[#4facfe] to-[#1d6fa5]"></div>
                  <div className="flex-1 p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">Total Contrôles</p>
                        <h3 className="text-xl md:text-2xl font-bold text-[#213f5b] mt-1">
                          {controlTasks.length}
                        </h3>
                      </div>
                      <div className="p-2 md:p-3 rounded-full bg-[#4facfe]/10 group-hover:bg-[#4facfe]/20 transition-all">
                        <ShieldCheckIcon className="h-5 w-5 md:h-6 md:w-6 text-[#4facfe]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* En Attente */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="flex h-full">
                  <div className="w-2 bg-gradient-to-b from-amber-400 to-amber-600"></div>
                  <div className="flex-1 p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">En Attente</p>
                        <h3 className="text-xl md:text-2xl font-bold text-amber-600 mt-1">
                          {statusCounts.en_attente}
                        </h3>
                      </div>
                      <div className="p-2 md:p-3 rounded-full bg-amber-100 group-hover:bg-amber-200 transition-all">
                        <ClockIcon className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* À Placer */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="flex h-full">
                  <div className="w-2 bg-gradient-to-b from-blue-400 to-blue-600"></div>
                  <div className="flex-1 p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">À Placer</p>
                        <h3 className="text-xl md:text-2xl font-bold text-blue-600 mt-1">
                          {statusCounts.a_placer}
                        </h3>
                      </div>
                      <div className="p-2 md:p-3 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-all">
                        <CalendarIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* En Contrôle */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="flex h-full">
                  <div className="w-2 bg-gradient-to-b from-purple-400 to-purple-600"></div>
                  <div className="flex-1 p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">En Contrôle</p>
                        <h3 className="text-xl md:text-2xl font-bold text-purple-600 mt-1">
                          {statusCounts.en_controle}
                        </h3>
                      </div>
                      <div className="p-2 md:p-3 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-all">
                        <UserGroupIcon className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contrôlé */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="flex h-full">
                  <div className="w-2 bg-gradient-to-b from-green-400 to-green-600"></div>
                  <div className="flex-1 p-4 md:p-6">
                    <div>
                      <p className="text-xs md:text-sm text-gray-500 font-medium">Contrôlé</p>
                      <h3 className="text-lg font-bold text-green-600 mt-1">
                        {statusCounts.controle}
                      </h3>
                      <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600"
                          style={{
                            width: `${completionRate}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {completionRate}% des contrôles
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Search Bar & Filter Buttons */}
            <div className="mb-6 md:mb-8 bg-white p-4 rounded-xl shadow-sm border border-[#bfddf9]/30">
              <div className="relative mb-4">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, client, adresse..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-24 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition"
                />
                <div className="absolute right-3 top-2 flex items-center">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="p-1.5 text-gray-500 hover:text-gray-700 transition mr-1"
                      title="Effacer la recherche"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => {/* Refresh data */}}
                    className="p-1.5 text-[#213f5b] bg-[#bfddf9]/10 rounded-lg hover:bg-[#bfddf9]/20 transition border border-[#bfddf9]/30"
                    title="Rafraîchir la liste"
                  >
                    <ArrowPathIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center">
                  <FunnelIcon className="w-4 h-4 text-gray-500 mr-2" />
                  <p className="text-sm text-gray-500 mr-4">Statut:</p>
                </div>
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      statusFilter === "all"
                        ? "bg-gradient-to-r from-[#213f5b] to-[#1d6fa5] text-white shadow-sm"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-[#4facfe] hover:bg-[#4facfe]/10"
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setStatusFilter("en_attente")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      statusFilter === "en_attente"
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-amber-400 hover:bg-amber-50"
                    }`}
                  >
                    En Attente
                  </button>
                  <button
                    onClick={() => setStatusFilter("a_placer")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      statusFilter === "a_placer"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    À Placer
                  </button>
                  <button
                    onClick={() => setStatusFilter("en_controle")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      statusFilter === "en_controle"
                        ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-purple-400 hover:bg-purple-50"
                    }`}
                  >
                    En Contrôle
                  </button>
                  <button
                    onClick={() => setStatusFilter("controle")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      statusFilter === "controle"
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-green-400 hover:bg-green-50"
                    }`}
                  >
                    Contrôlé
                  </button>
                </motion.div>

                <div className="ml-auto flex gap-3 mt-3 sm:mt-0">
                <div className="relative">
                  <select
                    value={selectedOrganization ? selectedOrganization.id : ""}
                    onChange={(e) => {
                      const orgId = e.target.value;
                      const org = organizations.find(o => o.id === orgId);
                      setSelectedOrganization(org || null);
                    }}
                    className="appearance-none pl-10 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition"
                  >
                    <option value="">Toutes les organismes</option>
                    {organizations.map(org => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                  </select>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    {selectedOrganization ? (
                      <img 
                        src={selectedOrganization.logo} 
                        alt={selectedOrganization.name} 
                        className="h-4 w-4 object-contain" 
                      />
                    ) : (
                      <BuildingOfficeIcon className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={selectedController ? selectedController.id : ""}
                    onChange={(e) => {
                      const controllerId = e.target.value;
                      const controller = controllers.find(c => c.id === controllerId);
                      setSelectedController(controller || null);
                    }}
                    className="appearance-none pl-10 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition"
                  >
                    <option value="">Bureau de contrôle</option>
                    {controllers.map(controller => (
                      <option key={controller.id} value={controller.id}>{controller.name}</option>
                    ))}
                  </select>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    {selectedController ? (
                      <img 
                        src={selectedController.logo} 
                        alt={selectedController.name} 
                        className="h-4 w-4 object-contain" 
                      />
                    ) : (
                      <UserGroupIcon className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
                </div>
              </div>
            </div>

            {/* Main Content - Google Calendar Inspired with Task Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Panel: Calendar */}
              <div className="lg:col-span-2">
                <motion.div
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {/* Calendar Header */}
                  <div className="bg-gradient-to-r from-[#213f5b] to-[#1d3349] p-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-inner">
                          <CalendarIcon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white tracking-tight">Calendrier des contrôles</h2>
                          <div className="flex items-center gap-2 text-white/70 text-sm font-medium mt-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                            <span>Planifiez et organisez vos contrôles sur site</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                      {/* Left: Today and Navigation */}
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={handleToday}
                          className="px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors text-sm font-medium backdrop-blur-sm flex items-center gap-2 shadow-inner"
                        >
                          <CalendarIcon className="h-4 w-4" />
                          Aujourd&apos;hui
                        </button>
                        <div className="flex gap-1.5">
                          <button
                            onClick={handlePrev}
                            className="p-2.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
                          >
                            <ChevronLeftIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={handleNext}
                            className="p-2.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
                          >
                            <ChevronRightIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {/* Center: Current Date Label */}
                      <h3 className="text-xl font-semibold text-white whitespace-nowrap tracking-wide">
                        {currentDate.toLocaleString("fr-FR", { month: "long", year: "numeric" })}
                      </h3>

                      {/* Right: New Control Button */}
                      <button 
                        className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-full text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:translate-y-[-2px]"
                        onClick={() => setShowNewTaskModal(true)}
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span>Nouveau contrôle</span>
                      </button>
                    </div>
                  </div>

                  {/* View Tabs */}
                  <div className="px-4 sm:px-6 pt-4 bg-white border-b border-gray-100 overflow-x-auto sticky top-0 z-10 shadow-sm">
                    <div className="flex gap-2 min-w-max">
                      {viewTabs.map((view, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleViewChange(view)}
                          className={`px-3 sm:px-5 py-2.5 text-sm font-medium rounded-t-xl transition-all duration-200 ${
                            activeViewTab === view
                              ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600 shadow-[0_4px_6px_-1px_rgba(79,70,229,0.05)]"
                              : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                          }`}
                          whileHover={{ y: -2 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          {view}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Google Calendar Inspired Calendar */}
                  <div className="p-4 sm:p-6">
                    <motion.div 
                      className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Calendar
                        localizer={localizer}
                        events={calendarEvents}
                        startAccessor="start"
                        endAccessor="end"
                        date={currentDate}
                        view={currentView}
                        onNavigate={handleCalendarNavigate}
                        onView={(view) => setCurrentView(view as "month" | "week" | "day" | "agenda")}
                        defaultView={Views.WEEK}
                        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                        formats={{
                            timeGutterFormat: (date) => 
                            date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                            eventTimeRangeFormat: ({ start, end }) => {
                            return `${start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
                            },
                            agendaTimeRangeFormat: ({ start, end }) => {
                            return `${start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
                            },
                            dayRangeHeaderFormat: ({ start, end }) => {
                            return `${start.toLocaleDateString('fr-FR')} - ${end.toLocaleDateString('fr-FR')}`
                            },
                        }}
                        messages={{
                            month: "Mois",
                            week: "Semaine",
                            day: "Jour",
                            agenda: "Agenda",
                            previous: "Précédent",
                            next: "Suivant",
                            today: "Aujourd'hui",
                            showMore: (total) => `+ ${total} autres`,
                            allDay: "Toute la journée",
                            date: "Date",
                            time: "Heure",
                            event: "Événement",
                            noEventsInRange: "Aucun contrôle dans cette période",
                        }}
                        style={{ height: "65vh" }}
                        className="calendrier-premium"
                        selectable={true}
                        popup={true}
                        onSelectEvent={handleSelectEvent}
                        onSelectSlot={(slotInfo) => {
                            console.log("Créneau sélectionné:", slotInfo);
                            setShowNewTaskModal(true);
                        }}
                        eventPropGetter={(event) => {
                            let backgroundColor, borderColor, color;

                            switch (event.status) {
                            case "en_attente":
                                backgroundColor = "#FEF3C7";
                                borderColor = "#F59E0B";
                                color = "#92400E";
                                break;
                            case "a_placer":
                                backgroundColor = "#DBEAFE";
                                borderColor = "#3B82F6";
                                color = "#1E40AF";
                                break;
                            case "en_controle":
                                backgroundColor = "#EDE9FE";
                                borderColor = "#8B5CF6";
                                color = "#5B21B6";
                                break;
                            case "controle":
                                backgroundColor = "#D1FAE5";
                                borderColor = "#10B981";
                                color = "#065F46";
                                break;
                            default:
                                backgroundColor = "#E5E7EB";
                                borderColor = "#6B7280";
                                color = "#1F2937";
                            }

                            if (event.priority === "high") {
                            borderColor = "#EF4444";
                            }

                            return {
                            style: {
                                backgroundColor,
                                borderLeft: `4px solid ${borderColor}`,
                                color,
                                padding: "8px 14px",
                                borderRadius: "6px",
                                fontWeight: 500,
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            },
                            };
                        }}
                        dayPropGetter={(date) => ({
                            className:
                            isToday(date)
                                ? "jour-actuel bg-gradient-to-br from-indigo-50/70 to-indigo-100/40 border-l-4 border-indigo-500"
                                : "",
                        })}
                        components={{
                            event: ({ event }) => (
                            <motion.div
                                className="h-full p-2 group"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.03, y: -1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <div className="flex items-start gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{event.title}</p>
                                    <div className="flex items-center gap-2 mt-1 text-xs">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                        {format(new Date(event.start), "HH:mm")}
                                    </span>
                                    {event.client && (
                                        <>
                                        <span className="text-opacity-60">•</span>
                                        <User className="h-3 w-3" />
                                        <span className="truncate">{event.client.name}</span>
                                        </>
                                    )}
                                    </div>
                                </div>
                                </div>
                            </motion.div>
                            ),
                            agenda: {
                            event: ({ event }) => (
                                <motion.div
                                className="flex items-center gap-4 p-4 my-2.5 bg-white border-l-4 rounded-xl shadow-sm hover:shadow-md transition-all group"
                                style={{
                                    borderLeftColor: 
                                    event.status === "en_attente" ? "#F59E0B" :
                                    event.status === "a_placer" ? "#3B82F6" :
                                    event.status === "en_controle" ? "#8B5CF6" :
                                    event.status === "controle" ? "#10B981" : "#6B7280"
                                }}
                                whileHover={{ x: 5, backgroundColor: "#f8fafc" }}
                                onClick={() => handleSelectEvent(event)}
                                >
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{event.title}</p>
                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-3 mt-1.5">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">
                                        {format(new Date(event.start), "dd/MM/yyyy HH:mm")}
                                        </span>
                                    </div>
                                    {event.client && (
                                        <>
                                        <span className="text-gray-400 hidden sm:inline">|</span>
                                        <div className="flex items-center gap-1.5">
                                            <User className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm text-gray-600">
                                            {event.client.name}
                                            </span>
                                        </div>
                                        </>
                                    )}
                                    {event.address && (
                                        <>
                                        <span className="text-gray-400 hidden sm:inline">|</span>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm text-gray-600">{event.address}</span>
                                        </div>
                                        </>
                                    )}
                                    </div>
                                </div>
                                <div className="px-3 py-1 rounded-full text-xs font-medium"
                                    style={{
                                    backgroundColor: 
                                        event.status === "en_attente" ? "#FEF3C7" :
                                        event.status === "a_placer" ? "#DBEAFE" :
                                        event.status === "en_controle" ? "#EDE9FE" :
                                        event.status === "controle" ? "#D1FAE5" : "#E5E7EB",
                                    color:
                                        event.status === "en_attente" ? "#92400E" :
                                        event.status === "a_placer" ? "#1E40AF" :
                                        event.status === "en_controle" ? "#5B21B6" :
                                        event.status === "controle" ? "#065F46" : "#1F2937"
                                    }}
                                >
                                    {event.status === "en_attente" ? "En attente" :
                                    event.status === "a_placer" ? "À placer" :
                                    event.status === "en_controle" ? "En contrôle" :
                                    event.status === "controle" ? "Contrôlé" : "Inconnu"}
                                </div>
                                </motion.div>
                            ),
                            },
                        }}
                        />
                    </motion.div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-4 mt-4 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                      <span className="text-sm font-medium text-gray-700">Légende :</span>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                        <span className="text-sm text-gray-600">En attente</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-gray-600">À placer</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm text-gray-600">En contrôle</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-600">Contrôlé</span>
                      </div>
                      <div className="ml-auto flex items-center gap-3">
                        <span className="text-xs text-gray-500">{calendarEvents.length} contrôles</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Panel: Task Details and Controllers */}
              <div className="space-y-6">
                {/* Controllers Logos and Info Panel */}
                <motion.div 
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-lg font-bold text-[#213f5b] mb-4">Bureau de contrôle</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {controllers.map(controller => (
                      <motion.div 
                        key={controller.id}
                        className={`p-4 border rounded-xl cursor-pointer transition-all ${
                          selectedController && selectedController.id === controller.id
                            ? "border-[#4facfe] bg-[#4facfe]/5 shadow-md"
                            : "border-gray-200 hover:border-[#4facfe]/50 hover:bg-[#4facfe]/5"
                        }`}
                        whileHover={{ y: -2 }}
                        onClick={() => setSelectedController(
                          selectedController && selectedController.id === controller.id
                            ? null
                            : controller
                        )}
                      >
                        <div className="h-12 flex items-center justify-center mb-3">
                          <img 
                            src={controller.logo} 
                            alt={controller.name} 
                            className="h-full object-contain"
                          />
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{controller.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{controller.phone}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Organizations Panel */}
                <motion.div 
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="text-lg font-bold text-[#213f5b] mb-4">Type d&apos;organisme</h3>
                  <div className="space-y-3">
                    {organizations.map(org => (
                      <motion.div 
                        key={org.id}
                        className={`p-4 border rounded-xl cursor-pointer transition-all ${
                          selectedOrganization && selectedOrganization.id === org.id
                            ? "border-[#4facfe] bg-[#4facfe]/5 shadow-md"
                            : "border-gray-200 hover:border-[#4facfe]/50 hover:bg-[#4facfe]/5"
                        }`}
                        whileHover={{ x: 5 }}
                        onClick={() => setSelectedOrganization(
                          selectedOrganization && selectedOrganization.id === org.id
                            ? null
                            : org
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white border border-gray-100 p-1 flex items-center justify-center">
                              <img src={org.logo} alt={org.name} className="h-7 w-7 object-contain" />
                            </div>
                            <div>
                              <p className="font-medium text-[#213f5b]">{org.name}</p>
                              <div className="mt-1 px-2 py-1 bg-[#4facfe]/10 text-[#4facfe] text-xs font-medium rounded-full inline-flex items-center">
                                <BuildingOfficeIcon className="h-3 w-3 mr-1" />
                                {org.type}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Quick Actions Panel */}
                <motion.div 
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-lg font-bold text-[#213f5b] mb-4">Actions rapides</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setShowNewTaskModal(true)}
                      className="p-3 bg-[#4facfe]/10 rounded-xl text-[#4facfe] font-medium flex flex-col items-center hover:bg-[#4facfe]/20 transition-colors"
                    >
                      <PlusIcon className="h-6 w-6 mb-1" />
                      <span>Nouveau contrôle</span>
                    </button>
                    <button 
                      onClick={() => setShowEmailModal(true)}
                      className="p-3 bg-[#4facfe]/10 rounded-xl text-[#4facfe] font-medium flex flex-col items-center hover:bg-[#4facfe]/20 transition-colors"
                    >
                      <EnvelopeIcon className="h-6 w-6 mb-1" />
                      <span>Envoyer un email</span>
                    </button>
                    <button 
                      onClick={() => {
                        if (selectedTask) {
                          setShowDocumentModal(true);
                        } else {
                          alert("Veuillez sélectionner un contrôle d'abord");
                        }
                      }}
                      className="p-3 bg-[#4facfe]/10 rounded-xl text-[#4facfe] font-medium flex flex-col items-center hover:bg-[#4facfe]/20 transition-colors"
                    >
                      <DocumentTextIcon className="h-6 w-6 mb-1" />
                      <span>Documents</span>
                    </button>
                    <button 
                      onClick={() => {
                        if (selectedTask) {
                          setShowChatPanel(true);
                        } else {
                          alert("Veuillez sélectionner un contrôle d'abord");
                        }
                      }}
                      className="p-3 bg-[#4facfe]/10 rounded-xl text-[#4facfe] font-medium flex flex-col items-center hover:bg-[#4facfe]/20 transition-colors"
                    >
                      <ChatBubbleLeftRightIcon className="h-6 w-6 mb-1" />
                      <span>Discussion</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
            <ConversationsPanel />
          </div>
        </main>
      </div>

      {/* Modals and Panels */}

      {/* New Task Modal */}
      <NewTaskModal
        showNewTaskModal={showNewTaskModal}
        setShowNewTaskModal={setShowNewTaskModal}
        organizations={organizations}
        controllers={controllers}
      />
      
      {/* Email Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="p-6 bg-gradient-to-r from-[#213f5b] to-[#1d3349] flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Envoyer un email</h2>
                <button 
                  onClick={() => setShowEmailModal(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destinataire</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition">
                      <option value="">Sélectionner un destinataire</option>
                      {selectedTask ? (
                        <option value={selectedTask.client.email}>{selectedTask.client.name} - {selectedTask.client.email}</option>
                      ) : (
                        controlTasks.map(task => (
                          <option key={task.id} value={task.client.email}>
                            {task.client.name} - {task.client.email}
                          </option>
                        ))
                      )}
                      {controllers.map(controller => (
                        <option key={controller.id} value={controller.email}>
                          {controller.name} - {controller.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modèle d&apos;email</label>
                    <select 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition"
                      onChange={(e) => {
                        const templateId = e.target.value;
                        const template = emailTemplates.find(t => t.id === templateId);
                        if (template) {
                          setSelectedEmailTemplate(template);
                          setEmailSubject(template.subject);
                          setEmailContent(template.content);
                        } else {
                          setSelectedEmailTemplate(null);
                          setEmailSubject("");
                          setEmailContent("");
                        }
                      }}
                    >
                      <option value="">Sélectionner un modèle</option>
                      {emailTemplates.map(template => (
                        <option key={template.id} value={template.id}>{template.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Objet</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition"
                      placeholder="Objet de l'email"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                    <textarea 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition"
                      placeholder="Contenu de l'email..."
                      rows={8}
                      value={emailContent}
                      onChange={(e) => setEmailContent(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                    <p>Variables disponibles :</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li><code>{'{{date}}'}</code> - Date du contrôle</li>
                      <li><code>{'{{heure}}'}</code> - Heure du contrôle</li>
                      <li><code>{'{{controlleur}}'}</code> - Nom de l&apos;organisme contrôleur</li>
                    </ul>
                  </div>
                </form>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <button 
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleSendEmail}
                  className="px-4 py-2 bg-[#213f5b] text-white rounded-lg hover:bg-[#1a324a] transition flex items-center gap-2"
                >
                  <EnvelopeIcon className="h-5 w-5" />
                  Envoyer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Modal */}
      <AnimatePresence>
        {showDocumentModal && selectedTask && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="p-6 bg-gradient-to-r from-[#213f5b] to-[#1d3349] flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Documents requis</h2>
                <button 
                  onClick={() => setShowDocumentModal(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Liste des documents pour &quot;{selectedTask.title}&quot;</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedTask.documents.filter(doc => doc.uploaded).length} sur {selectedTask.documents.length} documents ont été chargés.
                  </p>
                </div>
                <div className="space-y-4">
                  {selectedTask.documents.map(doc => (
                    <div 
                      key={doc.id} 
                      className={`p-4 border rounded-lg flex items-center justify-between transition-colors ${
                        doc.uploaded 
                          ? "bg-green-50 border-green-200" 
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          doc.uploaded ? "bg-green-100" : "bg-gray-100"
                        }`}>
                          <DocumentTextIcon className={`h-6 w-6 ${
                            doc.uploaded ? "text-green-600" : "text-gray-500"
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                              {doc.type}
                            </span>
                            {doc.required && (
                              <span className="text-xs bg-red-100 px-2 py-1 rounded-full text-red-700">
                                Requis
                              </span>
                            )}
                            {doc.uploaded && doc.dateUploaded && (
                              <span className="text-xs text-gray-500">
                                Chargé le {format(new Date(doc.dateUploaded), "dd/MM/yyyy")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        {doc.uploaded ? (
                          <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            Voir
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleDocumentUpload(doc.id)}
                            className="px-3 py-1.5 bg-[#213f5b] hover:bg-[#1a324a] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            Charger
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between">
                <button 
                  onClick={() => {
                    alert("Email envoyé au client pour demander les documents manquants");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
                >
                  <EnvelopeIcon className="h-5 w-5" />
                  Demander les documents manquants
                </button>
                <button 
                  onClick={() => setShowDocumentModal(false)}
                  className="px-4 py-2 bg-[#213f5b] text-white rounded-lg hover:bg-[#1a324a] transition"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel / Task Details */}
      <AnimatePresence>
        {showChatPanel && selectedTask && (
          <motion.div 
            className="fixed inset-y-0 right-0 z-40 w-full md:w-1/3 max-w-md bg-white shadow-xl flex flex-col border-l border-gray-200"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#213f5b] to-[#1d3349] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedTask.status === "en_attente" ? "bg-amber-500" :
                  selectedTask.status === "a_placer" ? "bg-blue-500" :
                  selectedTask.status === "en_controle" ? "bg-purple-500" : "bg-green-500"
                }`}>
                  <ShieldCheckIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{selectedTask.title}</h3>
                  <p className="text-xs text-white/70">
                    {format(new Date(selectedTask.startDate), "dd MMMM yyyy à HH:mm", { locale: dateFnsFr })}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowChatPanel(false)}
                className="text-white/80 hover:text-white transition"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Task Info Tabs */}
            <div className="bg-white border-b border-gray-200">
              <div className="flex">
                <button className="flex-1 py-3 px-4 text-[#213f5b] border-b-2 border-[#213f5b] font-medium">
                  Détails
                </button>
                <button className="flex-1 py-3 px-4 text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 font-medium transition-colors">
                  Conversation
                </button>
                <button className="flex-1 py-3 px-4 text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 font-medium transition-colors">
                  Documents
                </button>
              </div>
            </div>

            {/* Task Details */}
            <div className="flex-grow overflow-y-auto p-4">
              <div className="space-y-6">
                {/* Status Display & Actions */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3">Statut actuel</p>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-3 h-3 rounded-full ${
                      selectedTask.status === "en_attente" ? "bg-amber-500" :
                      selectedTask.status === "a_placer" ? "bg-blue-500" :
                      selectedTask.status === "en_controle" ? "bg-purple-500" : "bg-green-500"
                    }`}></div>
                    <span className="font-medium text-gray-900">
                      {selectedTask.status === "en_attente" ? "En attente" :
                       selectedTask.status === "a_placer" ? "À placer" :
                       selectedTask.status === "en_controle" ? "En contrôle" : "Contrôlé"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Changer le statut :</p>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => updateTaskStatus(selectedTask.id, "en_attente")}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                        selectedTask.status === "en_attente" 
                          ? "bg-amber-100 text-amber-800 border border-amber-300" 
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-amber-50"
                      }`}
                    >
                      En attente
                    </button>
                    <button 
                      onClick={() => updateTaskStatus(selectedTask.id, "a_placer")}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                        selectedTask.status === "a_placer" 
                          ? "bg-blue-100 text-blue-800 border border-blue-300" 
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50"
                      }`}
                    >
                      À placer
                    </button>
                    <button 
                      onClick={() => updateTaskStatus(selectedTask.id, "en_controle")}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                        selectedTask.status === "en_controle" 
                          ? "bg-purple-100 text-purple-800 border border-purple-300" 
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-purple-50"
                      }`}
                    >
                      En contrôle
                    </button>
                    <button 
                      onClick={() => updateTaskStatus(selectedTask.id, "controle")}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                        selectedTask.status === "controle" 
                          ? "bg-green-100 text-green-800 border border-green-300" 
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-green-50"
                      }`}
                    >
                      Contrôlé
                    </button>
                  </div>
                </div>

                {/* Client & Controller Info */}
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-[#4facfe]" />
                      Informations Client
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <p className="text-sm font-medium text-gray-500 w-24">Nom :</p>
                        <p className="text-sm text-gray-900">{selectedTask.client.name}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <p className="text-sm font-medium text-gray-500 w-24">Email :</p>
                        <p className="text-sm text-gray-900">{selectedTask.client.email}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <p className="text-sm font-medium text-gray-500 w-24">Téléphone :</p>
                        <p className="text-sm text-gray-900">{selectedTask.client.phone}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <p className="text-sm font-medium text-gray-500 w-24">Adresse :</p>
                        <p className="text-sm text-gray-900">{selectedTask.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <BuildingOfficeIcon className="h-4 w-4 text-[#4facfe]" />
                      Organisme de contrôle
                    </h4>
                    <div className="flex items-center gap-3 mb-3">
                      {selectedTask.controllerId === "veritas" ? (
                        <>
                          <img src="/veritas.png" alt="Bureau Veritas" className="h-8" />
                          <span className="font-medium text-gray-900">Bureau Veritas</span>
                        </>
                      ) : (
                        <>
                          <img src="/qualigaz.png" alt="Qualigaz Evonia" className="h-8" />
                          <span className="font-medium text-gray-900">Qualigaz Evonia</span>
                        </>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <p className="text-sm font-medium text-gray-500 w-24">Organismes :</p>
                        <p className="text-sm text-gray-900">
                          {selectedTask.organizationId === "cee" ? "Certificats d'Économies d'Énergie (CEE)" : "MaPrimeRénov' (MPR)"}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <p className="text-sm font-medium text-gray-500 w-24">Type :</p>
                        <p className="text-sm text-gray-900">{selectedTask.type}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedTask.notes && (
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <DocumentTextIcon className="h-4 w-4 text-[#4facfe]" />
                      Notes
                    </h4>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{selectedTask.notes}</p>
                  </div>
                )}

                {/* Document Summary */}
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <DocumentTextIcon className="h-4 w-4 text-[#4facfe]" />
                    Documents
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        {selectedTask.documents.filter(doc => doc.uploaded).length} sur {selectedTask.documents.length} documents chargés
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div 
                          className="bg-[#4facfe] h-1.5 rounded-full"
                          style={{ width: `${(selectedTask.documents.filter(doc => doc.uploaded).length / selectedTask.documents.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowDocumentModal(true)}
                      className="text-[#4facfe] text-sm font-medium hover:text-[#3b82f6] transition-colors"
                    >
                      Voir tous
                    </button>
                  </div>
                </div>

                {/* Chat Section */}
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <ChatBubbleLeftRightIcon className="h-4 w-4 text-[#4facfe]" />
                    Conversation
                  </h4>
                  <div className="space-y-4 max-h-60 overflow-y-auto mb-4">
                    {selectedTask.conversation && selectedTask.conversation.length > 0 ? (
                      selectedTask.conversation.map(message => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.sender === "Admin" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender === "Admin" 
                              ? "bg-[#4facfe] text-white" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${message.sender === "Admin" ? "text-white/70" : "text-gray-500"}`}>
                              {format(new Date(message.timestamp), "HH:mm")}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">Aucun message dans cette conversation</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-grow">
                      <textarea 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition resize-none"
                        placeholder="Votre message..."
                        rows={2}
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                      ></textarea>
                    </div>
                    <button 
                      onClick={handleSendMessage}
                      className={`p-3 rounded-lg ${
                        chatMessage.trim() ? "bg-[#213f5b] text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!chatMessage.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-2 justify-between">
                <button 
                  onClick={() => setShowEmailModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#213f5b] text-white rounded-lg hover:bg-[#1a324a] transition"
                >
                  <EnvelopeIcon className="h-5 w-5" />
                  Email
                </button>
                <button 
                  onClick={() => setShowDocumentModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#213f5b] text-white rounded-lg hover:bg-[#1a324a] transition"
                >
                  <DocumentTextIcon className="h-5 w-5" />
                  Documents
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Calendar Inspired Styling */}
      <style jsx global>{`
        .calendrier-premium {
          .rbc-month-view,
          .rbc-time-view {
            border: none;
            background: linear-gradient(to bottom right, #f8fafc, #ffffff);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          }
          .rbc-header {
            padding: 1.25rem 1rem;
            background: #f8fafc;
            color: #4b5563;
            font-weight: 600;
            border-bottom: 1px solid #e5e7eb;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-size: 0.875rem;
          }
          .rbc-month-row {
            overflow: visible;
          }
          .rbc-day-bg {
            transition: background 0.3s;
          }
          .rbc-day-bg:hover {
            background: rgba(243, 244, 246, 0.7);
          }
          .rbc-event {
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
            transform-origin: center;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .rbc-event:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
            z-index: 5;
          }
          .rbc-time-content {
            border-top: 0;
          }
          .rbc-timeslot-group {
            border-color: #e5e7eb;
          }
          .rbc-current-time-indicator {
            background: #6366f1;
            height: 2px;
          }
          .rbc-today {
            background-color: rgba(238, 242, 255, 0.6);
          }
          .rbc-label {
            font-weight: 500;
            color: #4b5563;
          }
          .rbc-time-header-content {
            border-color: #e5e7eb;
          }
          .rbc-agenda-view table.rbc-agenda-table {
            border-radius: 10px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
          }
          .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
            background-color: #f3f4f6;
            color: #4b5563;
            font-weight: 600;
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
          }
          .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
          }
          .rbc-agenda-view table.rbc-agenda-table tbody > tr:hover {
            background-color: #f9fafb;
          }
          .rbc-header + .rbc-header {
            border-left: 1px solid #e5e7eb;
          }
          .rbc-off-range-bg {
            background: #f9fafb;
          }
          .rbc-off-range {
            color: #9ca3af;
          }
          .rbc-date-cell {
            padding: 6px 8px;
            text-align: center;
            font-weight: 500;
            color: #4b5563;
          }
          .rbc-date-cell.rbc-now {
            color: #4f46e5;
            font-weight: 700;
          }
          .rbc-button-link {
            font-weight: 500;
          }
          
          /* Support mobile */
          @media (max-width: 640px) {
            .rbc-toolbar {
              flex-direction: column;
              align-items: flex-start;
              margin-bottom: 10px;
            }
            .rbc-toolbar-label {
              margin: 8px 0;
            }
            .rbc-btn-group {
              margin-bottom: 8px;
            }
            .rbc-header {
              padding: 0.75rem 0.5rem;
              font-size: 0.75rem;
            }
            .rbc-event {
              padding: 4px 8px !important;
            }
            .rbc-day-slot .rbc-events-container {
              margin-right: 0;
            }
          }
          
          /* Improved hover states */
          .rbc-day-bg.rbc-today:hover {
            background: rgba(238, 242, 255, 0.8);
          }

          .rbc-row-segment .rbc-event {
            border-radius: 10px;
            overflow: hidden;
          }

          .rbc-show-more {
            background-color: transparent;
            color: #4f46e5;
            font-weight: 500;
            font-size: 0.75rem;
            padding: 2px 5px;
            margin-top: 2px;
            border-radius: 4px;
            transition: background-color 0.2s;
          }

          .rbc-show-more:hover {
            background-color: rgba(238, 242, 255, 0.7);
            text-decoration: underline;
          }

          .rbc-toolbar button {
            color: #4b5563;
            border: 1px solid #e5e7eb;
            border-radius: 0.375rem;
            padding: 0.4rem 0.75rem;
            font-weight: 500;
            transition: all 0.2s;
          }
          
          .rbc-toolbar button:hover {
            background-color: #f5f7fa;
            color: #4f46e5;
          }
          
          .rbc-toolbar button.rbc-active {
            background-color: #eef2ff;
            color: #4f46e5;
            border-color: #c7d2fe;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          }
          
          .rbc-toolbar button.rbc-active:hover {
            background-color: #e0e7ff;
            color: #4338ca;
          }
        }
        
        .jour-actuel {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(255,255,255,0) 70%);
          position: relative;
        }
        
        .jour-actuel::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #6366f1;
          border-radius: 3px 3px 0 0;
        }
      `}</style>
    </div>
  );
}
