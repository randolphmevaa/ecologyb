"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
// import { Button } from "@/components/ui/Button";

import {
  PhoneIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog6ToothIcon,
  ArrowsRightLeftIcon,
  EnvelopeIcon,
  BellIcon,
  ClockIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
  FolderIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  PhoneArrowUpRightIcon,
  // ArchiveBoxIcon,
  CheckCircleIcon,
  XCircleIcon,
  EllipsisHorizontalIcon,
  QrCodeIcon,
  BarsArrowUpIcon,
  AdjustmentsHorizontalIcon,
  // InformationCircleIcon
} from "@heroicons/react/24/outline";

// LineModal component for adding or editing lines
import { LineModal } from "./LineModal";
// ForwardingModal component for configuring call forwarding
import { ForwardingModal } from "./ForwardingModal";
// CallFlowModal component for configuring call flows
import { CallFlowModal } from "./CallFlowModal";

// Define types
interface IPhoneLineStats {
  incoming: number;
  outgoing: number;
  missed: number;
  minutes: number;
  totalCalls: number;
  usagePercentage: number;
}

interface ICallForwarding {
  enabled: boolean;
  destination: string;
  conditions: "always" | "busy" | "no-answer" | "custom";
  timeout?: number; // seconds to wait before forwarding
  schedules?: {
    days: ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")[];
    startTime: string;
    endTime: string;
  }[];
}

// Define step data interfaces
interface IGreetingStepData {
  message: string;
}

interface IMenuOption {
  key: string;
  action: string;
  destination?: string;
}

interface IMenuStepData {
  options: IMenuOption[];
}

interface IForwardStepData {
  destination: string;
}

interface IVoicemailStepData {
  greeting: string;
}

interface IEndStepData {
  message: string;
}

// Union type for step data
type StepData = 
  | IGreetingStepData
  | IMenuStepData
  | IForwardStepData
  | IVoicemailStepData
  | IEndStepData;

interface ICallFlow {
  enabled: boolean;
  steps: {
    type: "greeting" | "menu" | "forward" | "voicemail" | "end";
    data: StepData;
  }[];
}

interface IVoicemailConfig {
  enabled: boolean;
  greeting: "default" | "custom";
  transcription: boolean;
  emailNotification: boolean;
  pin?: string;
}

interface IPhoneLine {
  id: string;
  number: string;
  extension?: string;
  label: string;
  type: "direct" | "extension" | "virtual" | "fax" | "conference";
  status: "active" | "inactive" | "forwarded" | "voicemail" | "dnd";
  assignedTo?: string;
  capabilities: {
    sms: boolean;
    voicemail: boolean;
    recording: boolean;
    conferencing: boolean;
    fax: boolean;
    international: boolean;
  };
  forwarding: ICallForwarding;
  voicemail: IVoicemailConfig;
  callFlow?: ICallFlow;
  stats: IPhoneLineStats;
  subscription: {
    plan: string;
    monthlyCost: number;
    minutesIncluded: number;
    minutesUsed: number;
    nextRenewal: string;
  };
  dateAdded: string;
}

interface ILineGroup {
  id: string;
  name: string;
  description?: string;
  lines: string[]; // Array of line IDs
}



// Theme context
const ThemeContext = createContext({ isDarkMode: false, toggleTheme: () => {} });

// Theme provider component
import { ReactNode } from "react";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check system preference or saved preference
    const savedTheme = localStorage.getItem('pbx-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setIsDarkMode(savedTheme === 'dark' || (!savedTheme && prefersDark));
    
    // Apply theme to document
    document.documentElement.classList.toggle('dark-theme', isDarkMode);
  }, [isDarkMode]);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('pbx-theme', !isDarkMode ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
const useTheme = () => useContext(ThemeContext);

export default function MesLignesPage() {
  // Theme
  const { isDarkMode } = useTheme();
  // const theme = isDarkMode ? colors.dark : colors.light;
  
  // State for the lines page
  const [phoneLines, setPhoneLines] = useState<IPhoneLine[]>([]);
  const [lineGroups, setLineGroups] = useState<ILineGroup[]>([]);
  const [selectedLine, setSelectedLine] = useState<IPhoneLine | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"all" | "direct" | "extension" | "virtual" | "groups">("all");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  
  // Modal states
  const [isLineModalOpen, setIsLineModalOpen] = useState(false);
  const [isForwardingModalOpen, setIsForwardingModalOpen] = useState(false);
  const [isCallFlowModalOpen, setIsCallFlowModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  
  // Expanded states for details sections
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  
  // Toggle section expansion
  const toggleSection = (lineId: string, section: string) => {
    const key = `${lineId}-${section}`;
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Check if section is expanded
  const isSectionExpanded = (lineId: string, section: string) => {
    const key = `${lineId}-${section}`;
    return expandedSections[key] || false;
  };
  
  // Effect to fetch lines data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Mock lines data
        const mockLines: IPhoneLine[] = [
          {
            id: "line1",
            number: "+33123456789",
            extension: "101",
            label: "Ligne principale",
            type: "direct",
            status: "active",
            assignedTo: "Sophie Martin",
            capabilities: {
              sms: true,
              voicemail: true,
              recording: true,
              conferencing: true,
              fax: true,
              international: true
            },
            forwarding: {
              enabled: false,
              destination: "",
              conditions: "always"
            },
            voicemail: {
              enabled: true,
              greeting: "custom",
              transcription: true,
              emailNotification: true,
              pin: "1234"
            },
            callFlow: {
              enabled: true,
              steps: [
                { type: "greeting", data: { message: "Bienvenue chez Notre Entreprise" } as IGreetingStepData },
                { type: "menu", data: { options: [
                  { key: "1", action: "forward", destination: "Support technique" },
                  { key: "2", action: "forward", destination: "Service commercial" }
                ] } as IMenuStepData },
                { type: "voicemail", data: { greeting: "Merci de laisser un message" } as IVoicemailStepData }
              ]
            },
            stats: {
              incoming: 124,
              outgoing: 87,
              missed: 12,
              minutes: 432,
              totalCalls: 211,
              usagePercentage: 72
            },
            subscription: {
              plan: "Business Pro",
              monthlyCost: 24.99,
              minutesIncluded: 1000,
              minutesUsed: 432,
              nextRenewal: "2025-04-15"
            },
            dateAdded: "2023-12-01"
          },
          {
            id: "line2",
            number: "+33234567890",
            extension: "102",
            label: "Support technique",
            type: "direct",
            status: "active",
            assignedTo: "Thomas Bernard",
            capabilities: {
              sms: true,
              voicemail: true,
              recording: true,
              conferencing: false,
              fax: false,
              international: false
            },
            forwarding: {
              enabled: false,
              destination: "",
              conditions: "always"
            },
            voicemail: {
              enabled: true,
              greeting: "default",
              transcription: true,
              emailNotification: true
            },
            stats: {
              incoming: 245,
              outgoing: 53,
              missed: 35,
              minutes: 518,
              totalCalls: 298,
              usagePercentage: 86
            },
            subscription: {
              plan: "Business Standard",
              monthlyCost: 19.99,
              minutesIncluded: 750,
              minutesUsed: 518,
              nextRenewal: "2025-04-10"
            },
            dateAdded: "2023-12-10"
          },
          {
            id: "line3",
            number: "+33345678901",
            extension: "103",
            label: "Service commercial",
            type: "direct",
            status: "forwarded",
            assignedTo: "Marie Dubois",
            capabilities: {
              sms: true,
              voicemail: true,
              recording: true,
              conferencing: true,
              fax: false,
              international: true
            },
            forwarding: {
              enabled: true,
              destination: "+33612345678",
              conditions: "always"
            },
            voicemail: {
              enabled: true,
              greeting: "default",
              transcription: false,
              emailNotification: true
            },
            stats: {
              incoming: 186,
              outgoing: 221,
              missed: 24,
              minutes: 604,
              totalCalls: 407,
              usagePercentage: 80
            },
            subscription: {
              plan: "Business Pro",
              monthlyCost: 24.99,
              minutesIncluded: 1000,
              minutesUsed: 604,
              nextRenewal: "2025-04-15"
            },
            dateAdded: "2024-01-05"
          },
          {
            id: "line4",
            number: "+33456789012",
            extension: "104",
            label: "Administration",
            type: "extension",
            status: "active",
            assignedTo: "Pierre Lambert",
            capabilities: {
              sms: false,
              voicemail: true,
              recording: true,
              conferencing: false,
              fax: false,
              international: false
            },
            forwarding: {
              enabled: false,
              destination: "",
              conditions: "always"
            },
            voicemail: {
              enabled: true,
              greeting: "default",
              transcription: true,
              emailNotification: true
            },
            stats: {
              incoming: 92,
              outgoing: 68,
              missed: 11,
              minutes: 247,
              totalCalls: 160,
              usagePercentage: 41
            },
            subscription: {
              plan: "Business Basic",
              monthlyCost: 14.99,
              minutesIncluded: 500,
              minutesUsed: 247,
              nextRenewal: "2025-04-05"
            },
            dateAdded: "2024-01-15"
          },
          {
            id: "line5",
            number: "+33567890123",
            label: "Fax",
            type: "fax",
            status: "active",
            capabilities: {
              sms: false,
              voicemail: false,
              recording: false,
              conferencing: false,
              fax: true,
              international: true
            },
            forwarding: {
              enabled: false,
              destination: "",
              conditions: "always"
            },
            voicemail: {
              enabled: false,
              greeting: "default",
              transcription: false,
              emailNotification: false
            },
            stats: {
              incoming: 24,
              outgoing: 17,
              missed: 0,
              minutes: 0,
              totalCalls: 41,
              usagePercentage: 20
            },
            subscription: {
              plan: "Fax Service",
              monthlyCost: 9.99,
              minutesIncluded: 0,
              minutesUsed: 0,
              nextRenewal: "2025-04-15"
            },
            dateAdded: "2024-02-01"
          },
          {
            id: "line6",
            number: "+33678901234",
            label: "Conférence",
            type: "conference",
            status: "active",
            capabilities: {
              sms: false,
              voicemail: false,
              recording: true,
              conferencing: true,
              fax: false,
              international: true
            },
            forwarding: {
              enabled: false,
              destination: "",
              conditions: "always"
            },
            voicemail: {
              enabled: false,
              greeting: "default",
              transcription: false,
              emailNotification: false
            },
            stats: {
              incoming: 38,
              outgoing: 0,
              missed: 2,
              minutes: 1240,
              totalCalls: 38,
              usagePercentage: 62
            },
            subscription: {
              plan: "Conference Pro",
              monthlyCost: 29.99,
              minutesIncluded: 2000,
              minutesUsed: 1240,
              nextRenewal: "2025-04-10"
            },
            dateAdded: "2024-02-10"
          },
          {
            id: "line7",
            number: "+33789012345",
            extension: "105",
            label: "Direction",
            type: "extension",
            status: "inactive",
            assignedTo: "Émilie Moreau",
            capabilities: {
              sms: false,
              voicemail: true,
              recording: false,
              conferencing: false,
              fax: false,
              international: false
            },
            forwarding: {
              enabled: false,
              destination: "",
              conditions: "always"
            },
            voicemail: {
              enabled: true,
              greeting: "default",
              transcription: true,
              emailNotification: true
            },
            stats: {
              incoming: 0,
              outgoing: 0,
              missed: 0,
              minutes: 0,
              totalCalls: 0,
              usagePercentage: 0
            },
            subscription: {
              plan: "Business Basic",
              monthlyCost: 14.99,
              minutesIncluded: 500,
              minutesUsed: 0,
              nextRenewal: "2025-04-05"
            },
            dateAdded: "2024-02-20"
          }
        ];
        
        // Mock line groups
        const mockLineGroups: ILineGroup[] = [
          {
            id: "group1",
            name: "Équipe commerciale",
            description: "Lignes de l'équipe commerciale",
            lines: ["line1", "line3"]
          },
          {
            id: "group2",
            name: "Support client",
            description: "Lignes du support client",
            lines: ["line2", "line4"]
          },
          {
            id: "group3",
            name: "Services spéciaux",
            description: "Fax et conférence",
            lines: ["line5", "line6"]
          }
        ];
        
        setPhoneLines(mockLines);
        setLineGroups(mockLineGroups);
        
        // Simulate delay for loading effect
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Impossible de charger les données. Veuillez réessayer ultérieurement.");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter lines based on search and view
  const getFilteredLines = () => {
    let filtered = [...phoneLines];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(line => 
        line.label.toLowerCase().includes(term) || 
        line.number.includes(term) ||
        (line.extension && line.extension.includes(term))
      );
    }
    
    // Filter by view
    if (view === "direct") {
      filtered = filtered.filter(line => line.type === "direct");
    } else if (view === "extension") {
      filtered = filtered.filter(line => line.type === "extension");
    } else if (view === "virtual") {
      filtered = filtered.filter(line => line.type === "virtual" || line.type === "fax" || line.type === "conference");
    } else if (view === "groups" && activeGroup) {
      const group = lineGroups.find(g => g.id === activeGroup);
      if (group) {
        filtered = filtered.filter(line => group.lines.includes(line.id));
      }
    }
    
    // Filter by status
    if (!showInactive) {
      filtered = filtered.filter(line => line.status !== "inactive");
    }
    
    return filtered;
  };
  
  const filteredLines = getFilteredLines();
  
  // Get line stats for all filtered lines
  const getOverallStats = () => {
    const stats = {
      totalLines: filteredLines.length,
      activeLines: filteredLines.filter(l => l.status === "active").length,
      forwardedLines: filteredLines.filter(l => l.status === "forwarded").length,
      inactiveLines: filteredLines.filter(l => l.status === "inactive").length,
      totalCalls: filteredLines.reduce((sum, line) => sum + line.stats.totalCalls, 0),
      totalMinutes: filteredLines.reduce((sum, line) => sum + line.stats.minutes, 0),
      avgUsagePercentage: filteredLines.length > 0 
        ? Math.round(filteredLines.reduce((sum, line) => sum + line.stats.usagePercentage, 0) / filteredLines.length) 
        : 0
    };
    
    return stats;
  };
  
  const overallStats = getOverallStats();
  
  // Format phone number for display
  const formatPhoneNumber = (number: string) => {
    // Basic formatting for French numbers
    if (number.startsWith("+33") && number.length === 12) {
      return number.replace(/(\+33)(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5 $6");
    }
    return number;
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return isDarkMode ? "bg-green-900 text-green-100" : "bg-green-100 text-green-800";
      case "inactive":
        return isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-800";
      case "forwarded":
        return isDarkMode ? "bg-blue-900 text-blue-100" : "bg-blue-100 text-blue-800";
      case "voicemail":
        return isDarkMode ? "bg-amber-900 text-amber-100" : "bg-amber-100 text-amber-800";
      case "dnd":
        return isDarkMode ? "bg-red-900 text-red-100" : "bg-red-100 text-red-800";
      default:
        return isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-800";
    }
  };
  
  // Get translated status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Actif";
      case "inactive":
        return "Inactif";
      case "forwarded":
        return "Transfert";
      case "voicemail":
        return "Messagerie";
      case "dnd":
        return "Ne pas déranger";
      default:
        return status;
    }
  };
  
  // Get line type icon
  const getLineTypeIcon = (type: string) => {
    switch (type) {
      case "direct":
        return <PhoneIcon className="h-5 w-5" />;
      case "extension":
        return <PhoneArrowUpRightIcon className="h-5 w-5" />;
      case "virtual":
        return <QrCodeIcon className="h-5 w-5" />;
      case "fax":
        return <DocumentTextIcon className="h-5 w-5" />;
      case "conference":
        return <UsersIcon className="h-5 w-5" />;
      default:
        return <PhoneIcon className="h-5 w-5" />;
    }
  };
  
  // Open line modal in add mode
  const handleAddLine = () => {
    setSelectedLine(null);
    setModalMode("add");
    setIsLineModalOpen(true);
  };
  
  // Open line modal in edit mode
  const handleEditLine = (line: IPhoneLine) => {
    setSelectedLine(line);
    setModalMode("edit");
    setIsLineModalOpen(true);
  };
  
  // Configure call forwarding for a line
  const handleConfigureForwarding = (line: IPhoneLine) => {
    setSelectedLine(line);
    setIsForwardingModalOpen(true);
  };
  
  // Configure call flow for a line
  const handleConfigureCallFlow = (line: IPhoneLine) => {
    setSelectedLine(line);
    setIsCallFlowModalOpen(true);
  };
  
  // Toggle line status
  const toggleLineStatus = (lineId: string) => {
    setPhoneLines(prev => 
      prev.map(line => {
        if (line.id === lineId) {
          return {
            ...line,
            status: line.status === "active" ? "inactive" : "active"
          };
        }
        return line;
      })
    );
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format as currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    });
  };

  return (
    <ThemeProvider>
      <div className={`flex h-screen ${isDarkMode ? 'bg-[#1F2937]' : 'bg-[#F9FAFB]'}`}>
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-hidden flex flex-col">
            <div className="max-w-full h-full flex flex-col">
              {/* Dashboard Header */}
              <div className={`${isDarkMode ? 'bg-[#111827] border-[#374151]' : 'bg-white border-[#E5E7EB]'} border-b px-4 sm:px-6 lg:px-8 py-4`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="relative">
                    <div className="absolute -left-3 md:-left-5 top-1 w-1.5 h-12 bg-gradient-to-b from-[#6366F1] to-[#4F46E5] rounded-full"></div>
                    <h1 className={`text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode ? 'from-[#6366F1] to-[#4F46E5]' : 'from-[#4F46E5] to-[#6366F1]'} mb-1 pl-2`}>Mes lignes</h1>
                    <p className={`${isDarkMode ? 'text-[#9CA3AF] opacity-90' : 'text-[#4F46E5] opacity-90'} pl-2`}>Gérez vos lignes téléphoniques, extensions et configurations</p>
                    <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-[#4F46E5] opacity-10 rounded-full blur-3xl"></div>
                  </div>
                  
                  <div className={`${isDarkMode ? 'bg-[#1F2937] border-[#374151]' : 'bg-[#F3F4F6] border-[#E5E7EB]'} border rounded-lg px-4 py-3 max-w-xl`}>
                    <h2 className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'} mb-2`}>Information</h2>
                    <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                      Cette interface vous permet de gérer l&apos;ensemble de vos lignes téléphoniques. Vous pouvez configurer le transfert d&apos;appel, la messagerie vocale et créer des groupes pour faciliter la gestion.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className={`${isDarkMode ? 'bg-[#111827] border-[#374151]' : 'bg-white border-[#E5E7EB]'} backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border hover:border-[#4F46E5] transition-colors overflow-hidden relative group`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#4F46E5] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} font-medium`}>Lignes actives</p>
                        <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} mt-1`}>
                          {overallStats.activeLines}/{overallStats.totalLines}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#6366F1] shadow-lg">
                        <PhoneIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className={`${isDarkMode ? 'bg-[#111827] border-[#374151]' : 'bg-white border-[#E5E7EB]'} backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border hover:border-[#4F46E5] transition-colors overflow-hidden relative group`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#4F46E5] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} font-medium`}>Appels ce mois</p>
                        <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} mt-1`}>
                          {overallStats.totalCalls.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#6366F1] shadow-lg">
                        <ArrowTrendingUpIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className={`${isDarkMode ? 'bg-[#111827] border-[#374151]' : 'bg-white border-[#E5E7EB]'} backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border hover:border-[#4F46E5] transition-colors overflow-hidden relative group`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#4F46E5] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} font-medium`}>Minutes utilisées</p>
                        <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} mt-1`}>
                          {overallStats.totalMinutes.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#6366F1] shadow-lg">
                        <ClockIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className={`${isDarkMode ? 'bg-[#111827] border-[#374151]' : 'bg-white border-[#E5E7EB]'} backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border hover:border-[#4F46E5] transition-colors overflow-hidden relative group`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#4F46E5] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} font-medium`}>Utilisation moyenne</p>
                        <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} mt-1`}>
                          {overallStats.avgUsagePercentage}%
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#6366F1] shadow-lg">
                        <BarsArrowUpIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="flex-1 overflow-hidden flex">
                {/* Left Panel - Filters & Navigation */}
                <div className={`w-full md:w-64 border-r ${isDarkMode ? 'border-[#374151] bg-[#1F2937]' : 'border-[#E5E7EB] bg-white'} flex flex-col`}>
                  {/* Search & Add */}
                  <div className={`p-4 border-b ${isDarkMode ? 'border-[#374151]' : 'border-[#E5E7EB]'}`}>
                    <div className="flex gap-2 mb-4">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <MagnifyingGlassIcon className={`h-4 w-4 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`} />
                        </div>
                        <input
                          type="text"
                          placeholder="Rechercher..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className={`w-full pl-10 pr-10 py-2 ${
                            isDarkMode 
                              ? 'bg-[#111827] border-[#374151] text-[#F9FAFB] focus:ring-[#4F46E5] focus:border-[#4F46E5]' 
                              : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] focus:ring-[#4F46E5] focus:border-[#4F46E5]'
                          } border rounded-lg text-sm`}
                        />
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm("")}
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-[#9CA3AF] hover:text-[#F9FAFB]' : 'text-[#6B7280] hover:text-[#111827]'} rounded-full p-1`}
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      
                      <button
                        onClick={handleAddLine}
                        className={`p-2 ${isDarkMode ? 'bg-[#4F46E5] hover:bg-[#4338CA]' : 'bg-[#4F46E5] hover:bg-[#4338CA]'} text-white rounded-lg`}
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} flex items-center gap-2`}>
                        <input
                          type="checkbox"
                          checked={showInactive}
                          onChange={() => setShowInactive(!showInactive)}
                          className="rounded text-[#4F46E5] focus:ring-[#4F46E5]"
                        />
                        Afficher inactives
                      </label>
                      
                      <button
                        onClick={() => setShowInactive(false)}
                        className={`text-xs ${isDarkMode ? 'text-[#4F46E5] hover:text-[#6366F1]' : 'text-[#4F46E5] hover:text-[#6366F1]'}`}
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Navigation */}
                  <div className={`p-4 border-b ${isDarkMode ? 'border-[#374151]' : 'border-[#E5E7EB]'}`}>
                    <h3 className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-3`}>
                      Types de lignes
                    </h3>
                    
                    <nav className="space-y-1">
                      <button
                        onClick={() => setView("all")}
                        className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg ${
                          view === "all" 
                            ? isDarkMode 
                              ? 'bg-[#374151] text-[#F9FAFB]' 
                              : 'bg-[#F3F4F6] text-[#111827]'
                            : isDarkMode 
                              ? 'text-[#9CA3AF] hover:bg-[#374151] hover:text-[#F9FAFB]' 
                              : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'
                        }`}
                      >
                        <PhoneIcon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          view === "all" 
                            ? isDarkMode ? 'text-[#6366F1]' : 'text-[#4F46E5]' 
                            : isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
                        }`} />
                        <span>Toutes les lignes</span>
                        <span className={`ml-auto ${isDarkMode ? 'bg-[#111827]' : 'bg-white'} rounded-full px-2 py-0.5 text-xs`}>
                          {phoneLines.length}
                        </span>
                      </button>
                      
                      <button
                        onClick={() => setView("direct")}
                        className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg ${
                          view === "direct" 
                            ? isDarkMode 
                              ? 'bg-[#374151] text-[#F9FAFB]' 
                              : 'bg-[#F3F4F6] text-[#111827]'
                            : isDarkMode 
                              ? 'text-[#9CA3AF] hover:bg-[#374151] hover:text-[#F9FAFB]' 
                              : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'
                        }`}
                      >
                        <PhoneArrowUpRightIcon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          view === "direct" 
                            ? isDarkMode ? 'text-[#6366F1]' : 'text-[#4F46E5]' 
                            : isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
                        }`} />
                        <span>Lignes directes</span>
                        <span className={`ml-auto ${isDarkMode ? 'bg-[#111827]' : 'bg-white'} rounded-full px-2 py-0.5 text-xs`}>
                          {phoneLines.filter(l => l.type === "direct").length}
                        </span>
                      </button>
                      
                      <button
                        onClick={() => setView("extension")}
                        className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg ${
                          view === "extension" 
                            ? isDarkMode 
                              ? 'bg-[#374151] text-[#F9FAFB]' 
                              : 'bg-[#F3F4F6] text-[#111827]'
                            : isDarkMode 
                              ? 'text-[#9CA3AF] hover:bg-[#374151] hover:text-[#F9FAFB]' 
                              : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'
                        }`}
                      >
                        <QrCodeIcon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          view === "extension" 
                            ? isDarkMode ? 'text-[#6366F1]' : 'text-[#4F46E5]' 
                            : isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
                        }`} />
                        <span>Extensions</span>
                        <span className={`ml-auto ${isDarkMode ? 'bg-[#111827]' : 'bg-white'} rounded-full px-2 py-0.5 text-xs`}>
                          {phoneLines.filter(l => l.type === "extension").length}
                        </span>
                      </button>
                      
                      <button
                        onClick={() => setView("virtual")}
                        className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg ${
                          view === "virtual" 
                            ? isDarkMode 
                              ? 'bg-[#374151] text-[#F9FAFB]' 
                              : 'bg-[#F3F4F6] text-[#111827]'
                            : isDarkMode 
                              ? 'text-[#9CA3AF] hover:bg-[#374151] hover:text-[#F9FAFB]' 
                              : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'
                        }`}
                      >
                        <DocumentTextIcon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          view === "virtual" 
                            ? isDarkMode ? 'text-[#6366F1]' : 'text-[#4F46E5]' 
                            : isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
                        }`} />
                        <span>Services spéciaux</span>
                        <span className={`ml-auto ${isDarkMode ? 'bg-[#111827]' : 'bg-white'} rounded-full px-2 py-0.5 text-xs`}>
                          {phoneLines.filter(l => ["virtual", "fax", "conference"].includes(l.type)).length}
                        </span>
                      </button>
                    </nav>
                  </div>
                  
                  {/* Groups */}
                  <div className="p-4 flex-1 overflow-y-auto">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                        Groupes
                      </h3>
                      <button
                        className={`text-xs ${isDarkMode ? 'text-[#4F46E5] hover:text-[#6366F1]' : 'text-[#4F46E5] hover:text-[#6366F1]'} p-1`}
                      >
                        <PlusIcon className="h-3 w-3" />
                      </button>
                    </div>
                    
                    <nav className="space-y-1">
                      <button
                        onClick={() => {
                          setView("groups");
                          setActiveGroup(null);
                        }}
                        className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg ${
                          view === "groups" && !activeGroup
                            ? isDarkMode 
                              ? 'bg-[#374151] text-[#F9FAFB]' 
                              : 'bg-[#F3F4F6] text-[#111827]'
                            : isDarkMode 
                              ? 'text-[#9CA3AF] hover:bg-[#374151] hover:text-[#F9FAFB]' 
                              : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'
                        }`}
                      >
                        <FolderIcon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          view === "groups" && !activeGroup
                            ? isDarkMode ? 'text-[#6366F1]' : 'text-[#4F46E5]' 
                            : isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
                        }`} />
                        <span>Tous les groupes</span>
                      </button>
                      
                      {lineGroups.map(group => (
                        <button
                          key={group.id}
                          onClick={() => {
                            setView("groups");
                            setActiveGroup(group.id);
                          }}
                          className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg ${
                            view === "groups" && activeGroup === group.id
                              ? isDarkMode 
                                ? 'bg-[#374151] text-[#F9FAFB]' 
                                : 'bg-[#F3F4F6] text-[#111827]'
                              : isDarkMode 
                                ? 'text-[#9CA3AF] hover:bg-[#374151] hover:text-[#F9FAFB]' 
                                : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'
                          }`}
                        >
                          <FolderIcon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                            view === "groups" && activeGroup === group.id
                              ? isDarkMode ? 'text-[#6366F1]' : 'text-[#4F46E5]' 
                              : isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
                          }`} />
                          <span>{group.name}</span>
                          <span className={`ml-auto ${isDarkMode ? 'bg-[#111827]' : 'bg-white'} rounded-full px-2 py-0.5 text-xs`}>
                            {group.lines.length}
                          </span>
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
                
                {/* Right Panel - Main Content */}
                <div className={`hidden md:flex flex-1 flex-col ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F3F4F6]'} overflow-hidden`}>
                  {/* Content header */}
                  <div className={`p-4 border-b ${isDarkMode ? 'border-[#374151] bg-[#1F2937]' : 'border-[#E5E7EB] bg-white'} flex items-center justify-between`}>
                    <h2 className={`text-lg font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                      {view === "all" && "Toutes les lignes"}
                      {view === "direct" && "Lignes directes"}
                      {view === "extension" && "Extensions"}
                      {view === "virtual" && "Services spéciaux"}
                      {view === "groups" && activeGroup && lineGroups.find(g => g.id === activeGroup)?.name}
                      {view === "groups" && !activeGroup && "Tous les groupes"}
                    </h2>
                    
                    <div className="flex items-center gap-2">
                      <button
                        className={`p-2 ${isDarkMode ? 'bg-[#374151] hover:bg-[#4B5563] text-[#F9FAFB]' : 'bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827]'} rounded-lg`}
                      >
                        <AdjustmentsHorizontalIcon className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={handleAddLine}
                        className={`px-3 py-2 ${isDarkMode ? 'bg-[#4F46E5] hover:bg-[#4338CA]' : 'bg-[#4F46E5] hover:bg-[#4338CA]'} text-white rounded-lg flex items-center gap-1`}
                      >
                        <PlusIcon className="h-5 w-5" />
                        <span>Ajouter</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Lines list */}
                  <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                      <div className="flex flex-col justify-center items-center p-12">
                        <div className="relative">
                          <div className={`absolute inset-0 bg-gradient-to-r ${isDarkMode ? 'from-[#4F46E5] to-[#6366F1]' : 'from-[#4F46E5] to-[#6366F1]'} rounded-full blur opacity-30 animate-pulse`}></div>
                          <div className={`relative animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${isDarkMode ? 'border-[#4F46E5]' : 'border-[#4F46E5]'}`}></div>
                        </div>
                        <p className={`mt-4 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} animate-pulse`}>Chargement des lignes...</p>
                      </div>
                    ) : error ? (
                      <div className="p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                          <ExclamationCircleIcon className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
                        <p className="text-red-700 mb-4">{error}</p>
                        <button
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                          onClick={() => window.location.reload()}
                        >
                          Rafraîchir
                        </button>
                      </div>
                    ) : filteredLines.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="relative mx-auto mb-6 w-20 h-20">
                          <div className={`absolute inset-0 ${isDarkMode ? 'bg-[#4F46E5]' : 'bg-[#4F46E5]'} opacity-20 rounded-full animate-pulse`}></div>
                          <PhoneIcon className={`h-20 w-20 ${isDarkMode ? 'text-[#4F46E5]' : 'text-[#4F46E5]'} opacity-60`} />
                        </div>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'} mb-2`}>Aucune ligne trouvée</h3>
                        <p className={`${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-4`}>
                          {searchTerm 
                            ? "Aucune ligne ne correspond à votre recherche." 
                            : "Aucune ligne trouvée dans cette catégorie."}
                        </p>
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm("")}
                            className={`px-4 py-2 ${isDarkMode ? 'bg-[#374151] text-[#F9FAFB]' : 'bg-white text-[#4F46E5]'} rounded-lg`}
                          >
                            <XMarkIcon className="h-4 w-4 inline mr-1" />
                            Effacer la recherche
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredLines.map(line => (
                          <div
                            key={line.id}
                            className={`${isDarkMode ? 'bg-[#1F2937] border-[#374151]' : 'bg-white border-[#E5E7EB]'} border rounded-lg overflow-hidden shadow-sm`}
                          >
                            {/* Line header */}
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-3">
                                  <div className={`p-3 rounded-lg ${
                                    line.status === "active" 
                                      ? isDarkMode ? 'bg-green-900' : 'bg-green-100' 
                                      : line.status === "inactive" 
                                        ? isDarkMode ? 'bg-gray-800' : 'bg-gray-100' 
                                        : line.status === "forwarded" 
                                          ? isDarkMode ? 'bg-blue-900' : 'bg-blue-100' 
                                          : isDarkMode ? 'bg-[#374151]' : 'bg-[#F3F4F6]'
                                  }`}>
                                    {getLineTypeIcon(line.type)}
                                  </div>
                                  
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                        {line.label}
                                      </h3>
                                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(line.status)}`}>
                                        {getStatusText(line.status)}
                                      </span>
                                    </div>
                                    
                                    <div className="flex flex-col md:flex-row md:items-center md:gap-3 mt-1">
                                      <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                        {formatPhoneNumber(line.number)}
                                      </p>
                                      
                                      {line.extension && (
                                        <>
                                          <span className="hidden md:inline text-gray-400">•</span>
                                          <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                            Ext: {line.extension}
                                          </p>
                                        </>
                                      )}
                                      
                                      {line.assignedTo && (
                                        <>
                                          <span className="hidden md:inline text-gray-400">•</span>
                                          <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                            Assigné à: {line.assignedTo}
                                          </p>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => toggleLineStatus(line.id)}
                                    className={`p-1.5 ${isDarkMode ? 'hover:bg-[#374151]' : 'hover:bg-[#F3F4F6]'} rounded-lg`}
                                  >
                                    {line.status === "active" ? (
                                      <XCircleIcon className={`h-6 w-6 ${isDarkMode ? 'text-[#EF4444]' : 'text-[#EF4444]'}`} />
                                    ) : (
                                      <CheckCircleIcon className={`h-6 w-6 ${isDarkMode ? 'text-[#22C55E]' : 'text-[#22C55E]'}`} />
                                    )}
                                  </button>
                                  
                                  <button
                                    onClick={() => handleEditLine(line)}
                                    className={`p-1.5 ${isDarkMode ? 'hover:bg-[#374151]' : 'hover:bg-[#F3F4F6]'} rounded-lg`}
                                  >
                                    <Cog6ToothIcon className={`h-6 w-6 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`} />
                                  </button>
                                  
                                  <button
                                    className={`p-1.5 ${isDarkMode ? 'hover:bg-[#374151]' : 'hover:bg-[#F3F4F6]'} rounded-lg`}
                                  >
                                    <EllipsisHorizontalIcon className={`h-6 w-6 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`} />
                                  </button>
                                </div>
                              </div>
                              
                              {/* Line stats */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F3F4F6]'}`}>
                                  <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>Appels entrants</p>
                                  <p className={`text-lg font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                    {line.stats.incoming}
                                  </p>
                                </div>
                                
                                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F3F4F6]'}`}>
                                  <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>Appels sortants</p>
                                  <p className={`text-lg font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                    {line.stats.outgoing}
                                  </p>
                                </div>
                                
                                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F3F4F6]'}`}>
                                  <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>Minutes utilisées</p>
                                  <p className={`text-lg font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                    {line.stats.minutes}
                                  </p>
                                </div>
                                
                                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F3F4F6]'}`}>
                                  <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>Utilisation</p>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                      <div 
                                        className={`h-2.5 rounded-full ${
                                          line.stats.usagePercentage > 80
                                            ? "bg-red-600"
                                            : line.stats.usagePercentage > 60
                                              ? "bg-amber-500"
                                              : "bg-green-600"
                                        }`}
                                        style={{ width: `${line.stats.usagePercentage}%` }}
                                      ></div>
                                    </div>
                                    <span className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                      {line.stats.usagePercentage}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Line capabilities */}
                              <div className="flex flex-wrap gap-2 mt-4">
                                {line.capabilities.sms && (
                                  <span className={`px-2 py-1 text-xs rounded-full ${isDarkMode ? 'bg-[#374151] text-[#9CA3AF]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                                    SMS
                                  </span>
                                )}
                                {line.capabilities.voicemail && (
                                  <span className={`px-2 py-1 text-xs rounded-full ${isDarkMode ? 'bg-[#374151] text-[#9CA3AF]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                                    Messagerie vocale
                                  </span>
                                )}
                                {line.capabilities.recording && (
                                  <span className={`px-2 py-1 text-xs rounded-full ${isDarkMode ? 'bg-[#374151] text-[#9CA3AF]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                                    Enregistrement
                                  </span>
                                )}
                                {line.capabilities.conferencing && (
                                  <span className={`px-2 py-1 text-xs rounded-full ${isDarkMode ? 'bg-[#374151] text-[#9CA3AF]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                                    Conférence
                                  </span>
                                )}
                                {line.capabilities.fax && (
                                  <span className={`px-2 py-1 text-xs rounded-full ${isDarkMode ? 'bg-[#374151] text-[#9CA3AF]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                                    Fax
                                  </span>
                                )}
                                {line.capabilities.international && (
                                  <span className={`px-2 py-1 text-xs rounded-full ${isDarkMode ? 'bg-[#374151] text-[#9CA3AF]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                                    International
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Line actions */}
                            <div className={`border-t ${isDarkMode ? 'border-[#374151]' : 'border-[#E5E7EB]'} px-4 py-3 flex items-center gap-2 overflow-x-auto`}>
                              <button
                                onClick={() => handleConfigureForwarding(line)}
                                className={`px-3 py-1.5 ${
                                  line.forwarding.enabled
                                    ? isDarkMode ? 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white' : 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
                                    : isDarkMode ? 'bg-[#374151] hover:bg-[#4B5563] text-[#9CA3AF]' : 'bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280]'
                                } rounded-lg text-sm flex items-center gap-1 whitespace-nowrap`}
                              >
                                <ArrowsRightLeftIcon className="h-4 w-4" />
                                <span>Transfert d&apos;appel</span>
                                {line.forwarding.enabled && (
                                  <span className={`inline-block w-2 h-2 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-green-400'} ml-1`}></span>
                                )}
                              </button>
                              
                              <button
                                className={`px-3 py-1.5 ${
                                  line.voicemail.enabled
                                    ? isDarkMode ? 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white' : 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
                                    : isDarkMode ? 'bg-[#374151] hover:bg-[#4B5563] text-[#9CA3AF]' : 'bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280]'
                                } rounded-lg text-sm flex items-center gap-1 whitespace-nowrap`}
                              >
                                <EnvelopeIcon className="h-4 w-4" />
                                <span>Messagerie vocale</span>
                                {line.voicemail.enabled && (
                                  <span className={`inline-block w-2 h-2 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-green-400'} ml-1`}></span>
                                )}
                              </button>
                              
                              {line.callFlow && (
                                <button
                                  onClick={() => handleConfigureCallFlow(line)}
                                  className={`px-3 py-1.5 ${
                                    line.callFlow.enabled
                                      ? isDarkMode ? 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white' : 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
                                      : isDarkMode ? 'bg-[#374151] hover:bg-[#4B5563] text-[#9CA3AF]' : 'bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280]'
                                  } rounded-lg text-sm flex items-center gap-1 whitespace-nowrap`}
                                >
                                  <FolderIcon className="h-4 w-4" />
                                  <span>Flux d&apos;appel</span>
                                  {line.callFlow.enabled && (
                                    <span className={`inline-block w-2 h-2 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-green-400'} ml-1`}></span>
                                  )}
                                </button>
                              )}
                              
                              <button
                                className={`px-3 py-1.5 ${isDarkMode ? 'bg-[#374151] hover:bg-[#4B5563] text-[#9CA3AF]' : 'bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280]'} rounded-lg text-sm flex items-center gap-1 whitespace-nowrap`}
                              >
                                <BellIcon className="h-4 w-4" />
                                <span>Notifications</span>
                              </button>
                              
                              <button
                                className={`px-3 py-1.5 ${isDarkMode ? 'bg-[#374151] hover:bg-[#4B5563] text-[#9CA3AF]' : 'bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280]'} rounded-lg text-sm flex items-center gap-1 whitespace-nowrap`}
                              >
                                <ShieldCheckIcon className="h-4 w-4" />
                                <span>Sécurité</span>
                              </button>
                            </div>
                            
                            {/* Expandable sections */}
                            {/* Subscription details */}
                            <div className={`border-t ${isDarkMode ? 'border-[#374151]' : 'border-[#E5E7EB]'}`}>
                              <button
                                onClick={() => toggleSection(line.id, 'subscription')}
                                className={`w-full flex justify-between items-center p-4 ${isDarkMode ? 'hover:bg-[#111827]' : 'hover:bg-[#F3F4F6]'}`}
                              >
                                <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                  Abonnement et facturation
                                </span>
                                {isSectionExpanded(line.id, 'subscription') ? (
                                  <ChevronUpIcon className="h-5 w-5" />
                                ) : (
                                  <ChevronDownIcon className="h-5 w-5" />
                                )}
                              </button>
                              
                              {isSectionExpanded(line.id, 'subscription') && (
                                <div className="px-4 pb-4">
                                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F3F4F6]'}`}>
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                                      <div>
                                        <h4 className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'} mb-1`}>
                                          {line.subscription.plan}
                                        </h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                          Renouvellement: {formatDate(line.subscription.nextRenewal)}
                                        </p>
                                      </div>
                                      
                                      <div className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-[#1F2937]' : 'bg-white'}`}>
                                        <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                          Coût mensuel
                                        </p>
                                        <p className={`text-xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                          {formatCurrency(line.subscription.monthlyCost)}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                      <div className="flex justify-between items-center mb-1">
                                        <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                          Utilisation des minutes
                                        </p>
                                        <p className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                          {line.subscription.minutesUsed} / {line.subscription.minutesIncluded}
                                        </p>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                        <div 
                                          className={`h-2.5 rounded-full ${
                                            (line.subscription.minutesUsed / line.subscription.minutesIncluded) > 0.8
                                              ? "bg-red-600"
                                              : (line.subscription.minutesUsed / line.subscription.minutesIncluded) > 0.6
                                                ? "bg-amber-500"
                                                : "bg-green-600"
                                          }`}
                                          style={{ width: `${(line.subscription.minutesUsed / line.subscription.minutesIncluded) * 100}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex justify-end">
                                      <button
                                        className={`text-sm ${isDarkMode ? 'text-[#4F46E5] hover:text-[#6366F1]' : 'text-[#4F46E5] hover:text-[#6366F1]'}`}
                                      >
                                        Modifier le forfait
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Call forwarding details */}
                            {line.forwarding.enabled && (
                              <div className={`border-t ${isDarkMode ? 'border-[#374151]' : 'border-[#E5E7EB]'}`}>
                                <button
                                  onClick={() => toggleSection(line.id, 'forwarding')}
                                  className={`w-full flex justify-between items-center p-4 ${isDarkMode ? 'hover:bg-[#111827]' : 'hover:bg-[#F3F4F6]'}`}
                                >
                                  <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                    Configuration du transfert d&apos;appel
                                  </span>
                                  {isSectionExpanded(line.id, 'forwarding') ? (
                                    <ChevronUpIcon className="h-5 w-5" />
                                  ) : (
                                    <ChevronDownIcon className="h-5 w-5" />
                                  )}
                                </button>
                                
                                {isSectionExpanded(line.id, 'forwarding') && (
                                  <div className="px-4 pb-4">
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F3F4F6]'}`}>
                                      <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                                          <ArrowsRightLeftIcon className={`h-5 w-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`} />
                                        </div>
                                        
                                        <div>
                                          <h4 className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'} mb-1`}>
                                            Transfert {line.forwarding.conditions === "always" ? "permanent" : "conditionnel"}
                                          </h4>
                                          <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                            Les appels sont transférés vers: <span className="font-medium">{formatPhoneNumber(line.forwarding.destination)}</span>
                                          </p>
                                          
                                          {line.forwarding.conditions !== "always" && (
                                            <div className="mt-2">
                                              <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                                Conditions: 
                                                {line.forwarding.conditions === "busy" && " Lorsque la ligne est occupée"}
                                                {line.forwarding.conditions === "no-answer" && ` Après ${line.forwarding.timeout} secondes sans réponse`}
                                                {line.forwarding.conditions === "custom" && " Configuration personnalisée"}
                                              </p>
                                              
                                              {line.forwarding.conditions === "custom" && line.forwarding.schedules && (
                                                <div className="mt-1 space-y-1">
                                                  {line.forwarding.schedules.map((schedule, index) => (
                                                    <p key={index} className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                                      {schedule.days.join(', ')} de {schedule.startTime} à {schedule.endTime}
                                                    </p>
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      
                                      <div className="flex justify-end mt-4">
                                        <button
                                          onClick={() => handleConfigureForwarding(line)}
                                          className={`text-sm ${isDarkMode ? 'text-[#4F46E5] hover:text-[#6366F1]' : 'text-[#4F46E5] hover:text-[#6366F1]'}`}
                                        >
                                          Modifier le transfert
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Call flow details */}
                            {line.callFlow?.enabled && (
                              <div className={`border-t ${isDarkMode ? 'border-[#374151]' : 'border-[#E5E7EB]'}`}>
                                <button
                                  onClick={() => toggleSection(line.id, 'callflow')}
                                  className={`w-full flex justify-between items-center p-4 ${isDarkMode ? 'hover:bg-[#111827]' : 'hover:bg-[#F3F4F6]'}`}
                                >
                                  <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                    Flux d&apos;appel
                                  </span>
                                  {isSectionExpanded(line.id, 'callflow') ? (
                                    <ChevronUpIcon className="h-5 w-5" />
                                  ) : (
                                    <ChevronDownIcon className="h-5 w-5" />
                                  )}
                                </button>
                                
                                {isSectionExpanded(line.id, 'callflow') && (
                                  <div className="px-4 pb-4">
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F3F4F6]'}`}>
                                      <div className="mb-4">
                                        <h4 className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'} mb-2`}>
                                          Étapes du flux d&apos;appel
                                        </h4>
                                        
                                        <ol className="relative border-l border-gray-300 dark:border-gray-700 ml-3 space-y-6">
                                          {line.callFlow.steps.map((step, index) => (
                                            <li key={index} className="ml-6">
                                              <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ${
                                                isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-white border-gray-300'
                                              } border`}>
                                                {index + 1}
                                              </span>
                                              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1F2937]' : 'bg-white'}`}>
                                                <h5 className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                                  {step.type === "greeting" && "Message d'accueil"}
                                                  {step.type === "menu" && "Menu interactif"}
                                                  {step.type === "forward" && "Transfert"}
                                                  {step.type === "voicemail" && "Messagerie vocale"}
                                                  {step.type === "end" && "Fin de l'appel"}
                                                </h5>
                                                
                                                {step.type === "greeting" && (
                                                  <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mt-1`}>
                                                    {(step.data as IGreetingStepData).message}
                                                  </p>
                                                )}
                                                
                                                {step.type === "menu" && (
                                                  <div className="mt-1 space-y-1">
                                                    {(step.data as IMenuStepData).options.map((option: IMenuOption, optIndex: number) => (
                                                      <p key={optIndex} className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                                        Touche {option.key}: {option.action === "forward" ? `Transférer vers ${option.destination}` : option.action}
                                                      </p>
                                                    ))}
                                                  </div>
                                                )}
                                                
                                                {step.type === "voicemail" && (
                                                  <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mt-1`}>
                                                    {(step.data as IVoicemailStepData).greeting}
                                                  </p>
                                                )}
                                              </div>
                                            </li>
                                          ))}
                                        </ol>
                                      </div>
                                      
                                      <div className="flex justify-end">
                                        <button
                                          onClick={() => handleConfigureCallFlow(line)}
                                          className={`text-sm ${isDarkMode ? 'text-[#4F46E5] hover:text-[#6366F1]' : 'text-[#4F46E5] hover:text-[#6366F1]'}`}
                                        >
                                          Modifier le flux d&apos;appel
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        
        {/* Modals */}
        <AnimatePresence>
          {isLineModalOpen && (
            <LineModal
              isOpen={isLineModalOpen}
              onClose={() => setIsLineModalOpen(false)}
              mode={modalMode}
              // line={selectedLine}
              onSave={(updatedLine) => {
                if (modalMode === "add") {
                  setPhoneLines(prev => [...prev, updatedLine]);
                } else {
                  setPhoneLines(prev => 
                    prev.map(line => line.id === updatedLine.id ? updatedLine : line)
                  );
                }
                setIsLineModalOpen(false);
              }}
            />
          )}
          
          {isForwardingModalOpen && (
            <ForwardingModal
              isOpen={isForwardingModalOpen}
              onClose={() => setIsForwardingModalOpen(false)}
              line={selectedLine}
              onSave={(updatedLine) => {
                setPhoneLines(prev => 
                  prev.map(line => line.id === updatedLine.id ? updatedLine : line)
                );
                setIsForwardingModalOpen(false);
              }}
            />
          )}
          
          {isCallFlowModalOpen && (
            <CallFlowModal
              isOpen={isCallFlowModalOpen}
              onClose={() => setIsCallFlowModalOpen(false)}
              line={selectedLine}
              onSave={(updatedLine) => {
                setPhoneLines(prev => 
                  prev.map(line => line.id === updatedLine.id ? updatedLine : line)
                );
                setIsCallFlowModalOpen(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}