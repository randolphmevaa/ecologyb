"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
// import { Button } from "@/components/ui/Button";
import { PhoneNumber as NumberModalPhoneNumber } from "./NumberModal";
import { NumberData as PortingModalNumberData } from "./PortingModal";
import { NumberData as SMSTemplateModalNumberData } from "./SMSTemplateModal";

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
//   EnvelopeIcon,
//   BellIcon,
  ClockIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
//   DocumentTextIcon,
  FolderIcon,
//   UsersIcon,
//   ArrowTrendingUpIcon,
  PhoneArrowUpRightIcon,
//   ArchiveBoxIcon,
  CheckCircleIcon,
  XCircleIcon,
  EllipsisHorizontalIcon,
  QrCodeIcon,
//   BarsArrowUpIcon,
  AdjustmentsHorizontalIcon,
//   InformationCircleIcon,
  ChatBubbleLeftRightIcon,
  DevicePhoneMobileIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  FingerPrintIcon
} from "@heroicons/react/24/outline";

// Import modals
import { NumberModal } from "./NumberModal";
import { PortingModal } from "./PortingModal";
import { SMSTemplateModal } from "./SMSTemplateModal";

// Define interface for what NumberModal expects
interface PhoneNumber {
  id: string;
  number: string;
  label: string;
  type: string;
  status: string;
  assignedTo: string;
  assignedLines?: string[];
  capabilities: {
    sms: boolean;
    mms: boolean;
    voice: boolean;
    fax: boolean;
    international: boolean;
    shortcode: boolean;
  };
  smsConfig: {
    enabled: boolean;
    autoReply: boolean;
    templates: Array<{
      id: string;
      name: string;
      content: string;
      usageCount: number;
    }>;
    forwardToEmail: boolean;
    emailDestination: string; // This is required (not optional)
  };
  callerID: {
    display: string;
    fallback: string;
    businessInfo?: {
      name: string;
      address: string;
      website: string;
      logo?: string;
    };
  };
  blocking: {
    enabled: boolean;
    blockedNumbers: string[];
    spamFiltering: boolean;
    anonymousCallBlocking: boolean;
    whitelistedNumbers: string[];
    customRules: Array<{
      id: string;
      name: string;
      condition: string;
      action: string;
    }>;
  };
  stats: INumberStats;
  plan: {
    name: string;
    monthlyCost: number;
    includedSMS: number;
    includedMinutes: number;
    smsUsed: number;
    minutesUsed: number;
    nextRenewal: string;
  };
  portingStatus?: {
    status: string;
    requestDate: string;
    estimatedCompletionDate?: string;
    previousProvider?: string;
    notes?: string;
  };
  dateAcquired: string;
  dateExpires?: string;
  tags: string[];
  [key: string]: unknown; // Allow for other properties
}

// Define interface for SMSTemplateModal
interface SMSTemplateData {
  id: string;
  smsConfig: {
    enabled: boolean;
    autoReply: boolean;
    templates: Array<{
      id: string;
      name: string;
      content: string;
      usageCount: number;
    }>;
    forwardToEmail: boolean;
    emailDestination: string; // This is required (not optional)
  };
  [key: string]: unknown; // Allow for other properties
}

// Define interface for PortingModal
interface PortingData {
  id: string;
  number?: string;
  label?: string;
  status?: string;
  portingStatus?: {
    status: "pending" | "in_progress" | "completed" | "cancelled";
    requestDate: string;
    estimatedCompletionDate: string; // Required
    previousProvider: string; // Required
    notes: string; // Required
  };
  [key: string]: unknown; // Allow for other properties
}

// Define types
interface INumberStats {
  incomingCalls: number;
  outgoingCalls: number;
  missedCalls: number;
  callMinutes: number;
  smsSent: number;
  smsReceived: number;
  totalCommunications: number;
  usagePercentage: number;
}

interface ISMSConfig {
  enabled: boolean;
  autoReply: boolean;
  templates: Array<{
    id: string;
    name: string;
    content: string;
    usageCount: number;
  }>;
  forwardToEmail: boolean;
  emailDestination?: string;
}

interface ICallerIDConfig {
  display: string;
  fallback: string;
  businessInfo?: {
    name: string;
    address: string;
    website: string;
    logo?: string;
  };
}

interface IBlockingConfig {
  enabled: boolean;
  blockedNumbers: string[];
  spamFiltering: boolean;
  anonymousCallBlocking: boolean;
  whitelistedNumbers: string[];
  customRules: Array<{
    id: string;
    name: string;
    condition: string;
    action: "block" | "allow" | "voicemail" | "custom";
  }>;
}

interface IPhoneNumber {
  id: string;
  number: string;
  label: string;
  type: "mobile" | "landline" | "tollfree" | "international" | "vanity" | "virtual";
  status: "active" | "inactive" | "porting" | "reserved" | "suspended";
  assignedTo?: string;
  assignedLines?: string[];
  capabilities: {
    sms: boolean;
    mms: boolean;
    voice: boolean;
    fax: boolean;
    international: boolean;
    shortcode: boolean;
  };
  smsConfig: ISMSConfig;
  callerID: ICallerIDConfig;
  blocking: IBlockingConfig;
  stats: INumberStats;
  plan: {
    name: string;
    monthlyCost: number;
    includedSMS: number;
    includedMinutes: number;
    smsUsed: number;
    minutesUsed: number;
    nextRenewal: string;
  };
  portingStatus?: {
    status: "pending" | "in_progress" | "completed" | "failed";
    requestDate: string;
    estimatedCompletionDate?: string;
    previousProvider?: string;
    notes?: string;
  };
  dateAcquired: string;
  dateExpires?: string;
  tags: string[];
}

interface INumberGroup {
  id: string;
  name: string;
  description?: string;
  numbers: string[]; // Array of number IDs
}

// Theme context - same as in the Mes lignes page
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

// Mapper function for NumberModal
function mapToPhoneNumber(phoneNumber: IPhoneNumber): PhoneNumber {
  return {
    ...phoneNumber,
    type: phoneNumber.type,
    assignedTo: phoneNumber.assignedTo || "",
    smsConfig: {
      ...phoneNumber.smsConfig,
      emailDestination: phoneNumber.smsConfig.emailDestination || "" // Ensure emailDestination is never undefined
    }
  };
}

// Mapper function for PortingModal
function mapToPortingData(phoneNumber: IPhoneNumber): PortingData {
  return {
    ...phoneNumber,
    portingStatus: phoneNumber.portingStatus ? {
      status: phoneNumber.portingStatus.status === "failed" ? 
        "cancelled" : phoneNumber.portingStatus.status,
      requestDate: phoneNumber.portingStatus.requestDate,
      // Make sure these fields are not undefined
      estimatedCompletionDate: phoneNumber.portingStatus.estimatedCompletionDate || "",
      previousProvider: phoneNumber.portingStatus.previousProvider || "",
      notes: phoneNumber.portingStatus.notes || ""
    } : undefined
  };
}

// Mapper function for SMSTemplateModal
function mapToSMSTemplateData(phoneNumber: IPhoneNumber): SMSTemplateData {
  return {
    id: phoneNumber.id,
    smsConfig: {
      ...phoneNumber.smsConfig,
      emailDestination: phoneNumber.smsConfig.emailDestination || "" // Ensure emailDestination is never undefined
    }
  };
}

// // Update the mapToIPhoneNumber function to handle all possible input types
// function mapToIPhoneNumber(
//   phoneNumber: PhoneNumber | SMSTemplateData | PortingData | any
// ): IPhoneNumber {
//   // Check if it's a partial update with just the id
//   if (typeof phoneNumber === 'object' && phoneNumber !== null) {
//     // If it's an SMSTemplateData, merge the SMS config with existing data
//     if ('smsConfig' in phoneNumber && !('type' in phoneNumber)) {
//       const existingNumber = phoneNumbers.find(n => n.id === phoneNumber.id);
//       if (existingNumber) {
//         return {
//           ...existingNumber,
//           smsConfig: phoneNumber.smsConfig
//         };
//       }
//     }
    
//     // If it's a PortingData with portingStatus, merge with existing data
//     if ('portingStatus' in phoneNumber && !('type' in phoneNumber)) {
//       const existingNumber = phoneNumbers.find(n => n.id === phoneNumber.id);
//       if (existingNumber) {
//         return {
//           ...existingNumber,
//           portingStatus: phoneNumber.portingStatus,
//           status: phoneNumber.portingStatus ? 'porting' : existingNumber.status
//         };
//       }
//     }
    
//     // If it has all the properties of a PhoneNumber
//     if ('type' in phoneNumber) {
//       return {
//         ...phoneNumber,
//         type: (phoneNumber.type as "mobile" | "landline" | "tollfree" | "international" | "vanity" | "virtual"),
//       } as IPhoneNumber;
//     }
//   }
  
//   // If we can't determine the type or find the existing record, return as is 
//   // (TypeScript will complain but runtime should work if data is valid)
//   return phoneNumber as unknown as IPhoneNumber;
// }

// function mapToNumberData(phoneNumber: IPhoneNumber): NumberDataForPorting {
//   return {
//     ...phoneNumber,
//     portingStatus: phoneNumber.portingStatus ? {
//       ...phoneNumber.portingStatus,
//       status: phoneNumber.portingStatus.status === "failed" ? 
//         "cancelled" : phoneNumber.portingStatus.status
//     } : undefined
//   };
// }

// function mapToIPhoneNumber(phoneNumber: PhoneNumberForModal | NumberDataForPorting): IPhoneNumber {
//   return {
//     ...phoneNumber,
//     type: (phoneNumber.type as "mobile" | "landline" | "tollfree" | "international" | "vanity" | "virtual"),
//     // Convert back any other properties as needed
//   } as IPhoneNumber;
// }

// Hook to use theme
const useTheme = () => useContext(ThemeContext);

export default function MesNumerosPage() {
  // Theme
  const { isDarkMode } = useTheme();
//   const theme = isDarkMode ? colors.dark : colors.light;
  
  // State for the numbers page
  const [phoneNumbers, setPhoneNumbers] = useState<IPhoneNumber[]>([]);
  const [numberGroups, setNumberGroups] = useState<INumberGroup[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<IPhoneNumber | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"all" | "mobile" | "landline" | "tollfree" | "special" | "groups">("all");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  
  // Modal states
  const [isNumberModalOpen, setIsNumberModalOpen] = useState(false);
  const [isPortingModalOpen, setIsPortingModalOpen] = useState(false);
  const [isSMSTemplateModalOpen, setIsSMSTemplateModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  
  // Expanded states for details sections
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  // Mapper function to convert back to IPhoneNumber - moved inside component to access phoneNumbers state
  const mapToIPhoneNumber = (
    phoneNumber: PhoneNumber | SMSTemplateData | PortingData | Record<string, unknown>
  ): IPhoneNumber => {
    if (typeof phoneNumber === 'object' && phoneNumber !== null) {
      // SMS Template Data case
      if ('smsConfig' in phoneNumber && !('type' in phoneNumber)) {
        const existingNumber = phoneNumbers.find(n => n.id === phoneNumber.id);
        if (existingNumber) {
          return {
            ...existingNumber,
            smsConfig: phoneNumber.smsConfig as ISMSConfig  // Add type assertion
          };
        }
      }
      
      // Porting Data case
      if ('portingStatus' in phoneNumber && !('type' in phoneNumber)) {
        const existingNumber = phoneNumbers.find(n => n.id === phoneNumber.id);
        if (existingNumber) {
          return {
            ...existingNumber,
            portingStatus: phoneNumber.portingStatus as IPhoneNumber['portingStatus'],  // Add type assertion
            status: phoneNumber.portingStatus ? 'porting' : existingNumber.status
          };
        }
      }
      
      // Complete Phone Number case
      if ('type' in phoneNumber) {
        return {
          ...phoneNumber,
          type: (phoneNumber.type as "mobile" | "landline" | "tollfree" | "international" | "vanity" | "virtual"),
        } as IPhoneNumber;
      }
    }
    
    // Fallback case - convert as-is with type assertion
    return phoneNumber as unknown as IPhoneNumber;
  };
  
  // Toggle section expansion
  const toggleSection = (numberId: string, section: string) => {
    const key = `${numberId}-${section}`;
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Check if section is expanded
  const isSectionExpanded = (numberId: string, section: string) => {
    const key = `${numberId}-${section}`;
    return expandedSections[key] || false;
  };
  
  // Effect to fetch numbers data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Mock phone numbers data
        const mockNumbers: IPhoneNumber[] = [
          {
            id: "num1",
            number: "+33123456789",
            label: "Numéro principal",
            type: "landline",
            status: "active",
            assignedTo: "Accueil",
            assignedLines: ["line1"],
            capabilities: {
              sms: true,
              mms: true,
              voice: true,
              fax: true,
              international: true,
              shortcode: false
            },
            smsConfig: {
              enabled: true,
              autoReply: true,
              templates: [
                {
                  id: "template1",
                  name: "Réponse automatique standard",
                  content: "Merci de nous avoir contacté. Un conseiller vous répondra dans les plus brefs délais.",
                  usageCount: 145
                },
                {
                  id: "template2",
                  name: "Heures d'ouverture",
                  content: "Nos bureaux sont ouverts du lundi au vendredi de 9h à 18h. Merci pour votre message.",
                  usageCount: 87
                }
              ],
              forwardToEmail: true,
              emailDestination: "contact@notre-entreprise.fr"
            },
            callerID: {
              display: "Notre Entreprise",
              fallback: "+33123456789",
              businessInfo: {
                name: "Notre Entreprise SAS",
                address: "123 Avenue des Affaires, 75008 Paris",
                website: "www.notre-entreprise.fr"
              }
            },
            blocking: {
              enabled: true,
              blockedNumbers: ["+33987654321", "+33876543210"],
              spamFiltering: true,
              anonymousCallBlocking: false,
              whitelistedNumbers: ["+33765432109"],
              customRules: [
                {
                  id: "rule1",
                  name: "Après heures d'ouverture",
                  condition: "after_hours",
                  action: "voicemail"
                }
              ]
            },
            stats: {
              incomingCalls: 240,
              outgoingCalls: 156,
              missedCalls: 18,
              callMinutes: 845,
              smsSent: 420,
              smsReceived: 350,
              totalCommunications: 1166,
              usagePercentage: 78
            },
            plan: {
              name: "Business Pro",
              monthlyCost: 29.99,
              includedSMS: 1000,
              includedMinutes: 1000,
              smsUsed: 770,
              minutesUsed: 845,
              nextRenewal: "2025-04-15"
            },
            dateAcquired: "2023-12-01",
            tags: ["principal", "marketing", "service client"]
          },
          {
            id: "num2",
            number: "+33234567890",
            label: "Support technique",
            type: "landline",
            status: "active",
            assignedTo: "Équipe technique",
            assignedLines: ["line2"],
            capabilities: {
              sms: true,
              mms: true,
              voice: true,
              fax: false,
              international: true,
              shortcode: false
            },
            smsConfig: {
              enabled: true,
              autoReply: false,
              templates: [
                {
                  id: "template3",
                  name: "Support technique - Accusé de réception",
                  content: "Nous avons bien reçu votre demande. Un technicien va la traiter dans les meilleurs délais. Ref: {{reference}}",
                  usageCount: 312
                }
              ],
              forwardToEmail: true,
              emailDestination: "support@notre-entreprise.fr"
            },
            callerID: {
              display: "Support Technique",
              fallback: "+33234567890"
            },
            blocking: {
              enabled: true,
              blockedNumbers: [],
              spamFiltering: true,
              anonymousCallBlocking: false,
              whitelistedNumbers: [],
              customRules: []
            },
            stats: {
              incomingCalls: 385,
              outgoingCalls: 127,
              missedCalls: 42,
              callMinutes: 930,
              smsSent: 312,
              smsReceived: 405,
              totalCommunications: 1229,
              usagePercentage: 85
            },
            plan: {
              name: "Business Standard",
              monthlyCost: 24.99,
              includedSMS: 750,
              includedMinutes: 750,
              smsUsed: 717,
              minutesUsed: 930,
              nextRenewal: "2025-04-10"
            },
            dateAcquired: "2023-12-10",
            tags: ["support", "technique"]
          },
          {
            id: "num3",
            number: "+33345678901",
            label: "Commercial",
            type: "mobile",
            status: "active",
            assignedTo: "Équipe commerciale",
            assignedLines: ["line3"],
            capabilities: {
              sms: true,
              mms: true,
              voice: true,
              fax: false,
              international: true,
              shortcode: false
            },
            smsConfig: {
              enabled: true,
              autoReply: true,
              templates: [
                {
                  id: "template4",
                  name: "Prospection commerciale",
                  content: "Bonjour ! Nous vous remercions de l'intérêt que vous portez à nos produits. Un conseiller vous contactera prochainement.",
                  usageCount: 520
                }
              ],
              forwardToEmail: true,
              emailDestination: "commercial@notre-entreprise.fr"
            },
            callerID: {
              display: "Service Commercial",
              fallback: "+33345678901"
            },
            blocking: {
              enabled: false,
              blockedNumbers: [],
              spamFiltering: true,
              anonymousCallBlocking: false,
              whitelistedNumbers: [],
              customRules: []
            },
            stats: {
              incomingCalls: 230,
              outgoingCalls: 480,
              missedCalls: 35,
              callMinutes: 1250,
              smsSent: 520,
              smsReceived: 190,
              totalCommunications: 1420,
              usagePercentage: 92
            },
            plan: {
              name: "Mobile Business Pro",
              monthlyCost: 34.99,
              includedSMS: 2000,
              includedMinutes: 1500,
              smsUsed: 710,
              minutesUsed: 1250,
              nextRenewal: "2025-04-15"
            },
            dateAcquired: "2024-01-05",
            tags: ["ventes", "commercial", "mobile"]
          },
          {
            id: "num4",
            number: "0800123456",
            label: "Numéro vert",
            type: "tollfree",
            status: "active",
            assignedTo: "Service client",
            assignedLines: ["line1"],
            capabilities: {
              sms: false,
              mms: false,
              voice: true,
              fax: false,
              international: false,
              shortcode: false
            },
            smsConfig: {
              enabled: false,
              autoReply: false,
              templates: [],
              forwardToEmail: false
            },
            callerID: {
              display: "Service Client - N° Vert",
              fallback: "0800123456"
            },
            blocking: {
              enabled: true,
              blockedNumbers: [],
              spamFiltering: true,
              anonymousCallBlocking: false,
              whitelistedNumbers: [],
              customRules: []
            },
            stats: {
              incomingCalls: 450,
              outgoingCalls: 0,
              missedCalls: 15,
              callMinutes: 1800,
              smsSent: 0,
              smsReceived: 0,
              totalCommunications: 450,
              usagePercentage: 75
            },
            plan: {
              name: "Numéro Vert Premium",
              monthlyCost: 39.99,
              includedSMS: 0,
              includedMinutes: 3000,
              smsUsed: 0,
              minutesUsed: 1800,
              nextRenewal: "2025-04-20"
            },
            dateAcquired: "2024-01-15",
            tags: ["service client", "gratuit", "support"]
          },
          {
            id: "num5",
            number: "36ENTREPRISE",
            label: "Numéro mémorable",
            type: "vanity",
            status: "active",
            assignedLines: ["line1"],
            capabilities: {
              sms: false,
              mms: false,
              voice: true,
              fax: false,
              international: false,
              shortcode: false
            },
            smsConfig: {
              enabled: false,
              autoReply: false,
              templates: [],
              forwardToEmail: false
            },
            callerID: {
              display: "Notre Entreprise",
              fallback: "36ENTREPRISE"
            },
            blocking: {
              enabled: false,
              blockedNumbers: [],
              spamFiltering: true,
              anonymousCallBlocking: false,
              whitelistedNumbers: [],
              customRules: []
            },
            stats: {
              incomingCalls: 185,
              outgoingCalls: 0,
              missedCalls: 8,
              callMinutes: 520,
              smsSent: 0,
              smsReceived: 0,
              totalCommunications: 185,
              usagePercentage: 52
            },
            plan: {
              name: "Vanity Number Pro",
              monthlyCost: 49.99,
              includedSMS: 0,
              includedMinutes: 1000,
              smsUsed: 0,
              minutesUsed: 520,
              nextRenewal: "2025-04-25"
            },
            dateAcquired: "2024-02-01",
            tags: ["marketing", "publicité", "branding"]
          },
          {
            id: "num6",
            number: "+41223456789",
            label: "Suisse",
            type: "international",
            status: "active",
            assignedTo: "Équipe internationale",
            assignedLines: ["line3"],
            capabilities: {
              sms: true,
              mms: false,
              voice: true,
              fax: false,
              international: true,
              shortcode: false
            },
            smsConfig: {
              enabled: true,
              autoReply: false,
              templates: [
                {
                  id: "template5",
                  name: "Bienvenue international",
                  content: "Merci pour votre message. Notre équipe internationale vous répondra dans les plus brefs délais.",
                  usageCount: 78
                }
              ],
              forwardToEmail: true,
              emailDestination: "international@notre-entreprise.fr"
            },
            callerID: {
              display: "Notre Entreprise - CH",
              fallback: "+41223456789"
            },
            blocking: {
              enabled: true,
              blockedNumbers: [],
              spamFiltering: true,
              anonymousCallBlocking: false,
              whitelistedNumbers: [],
              customRules: []
            },
            stats: {
              incomingCalls: 120,
              outgoingCalls: 85,
              missedCalls: 12,
              callMinutes: 480,
              smsSent: 78,
              smsReceived: 65,
              totalCommunications: 348,
              usagePercentage: 60
            },
            plan: {
              name: "International Business",
              monthlyCost: 59.99,
              includedSMS: 500,
              includedMinutes: 1000,
              smsUsed: 143,
              minutesUsed: 480,
              nextRenewal: "2025-04-15"
            },
            dateAcquired: "2024-02-10",
            tags: ["international", "suisse", "expansion"]
          },
          {
            id: "num7",
            number: "+33456789012",
            label: "Ancien numéro",
            type: "landline",
            status: "inactive",
            capabilities: {
              sms: true,
              mms: false,
              voice: true,
              fax: true,
              international: false,
              shortcode: false
            },
            smsConfig: {
              enabled: false,
              autoReply: false,
              templates: [],
              forwardToEmail: false
            },
            callerID: {
              display: "Notre Entreprise (ancien)",
              fallback: "+33456789012"
            },
            blocking: {
              enabled: false,
              blockedNumbers: [],
              spamFiltering: false,
              anonymousCallBlocking: false,
              whitelistedNumbers: [],
              customRules: []
            },
            stats: {
              incomingCalls: 0,
              outgoingCalls: 0,
              missedCalls: 0,
              callMinutes: 0,
              smsSent: 0,
              smsReceived: 0,
              totalCommunications: 0,
              usagePercentage: 0
            },
            plan: {
              name: "Business Basic",
              monthlyCost: 9.99,
              includedSMS: 100,
              includedMinutes: 200,
              smsUsed: 0,
              minutesUsed: 0,
              nextRenewal: "2025-04-05"
            },
            dateAcquired: "2023-09-01",
            dateExpires: "2025-09-01",
            tags: ["archive", "ancien"]
          },
          {
            id: "num8",
            number: "+33567890123",
            label: "Marketing Saisonnier",
            type: "mobile",
            status: "reserved",
            capabilities: {
              sms: true,
              mms: true,
              voice: true,
              fax: false,
              international: false,
              shortcode: false
            },
            smsConfig: {
              enabled: false,
              autoReply: false,
              templates: [],
              forwardToEmail: false
            },
            callerID: {
              display: "Campagne Été",
              fallback: "+33567890123"
            },
            blocking: {
              enabled: false,
              blockedNumbers: [],
              spamFiltering: true,
              anonymousCallBlocking: false,
              whitelistedNumbers: [],
              customRules: []
            },
            stats: {
              incomingCalls: 0,
              outgoingCalls: 0,
              missedCalls: 0,
              callMinutes: 0,
              smsSent: 0,
              smsReceived: 0,
              totalCommunications: 0,
              usagePercentage: 0
            },
            plan: {
              name: "Mobile Seasonal",
              monthlyCost: 19.99,
              includedSMS: 500,
              includedMinutes: 300,
              smsUsed: 0,
              minutesUsed: 0,
              nextRenewal: "2025-04-15"
            },
            dateAcquired: "2024-02-25",
            tags: ["marketing", "saisonnier", "réservé"]
          },
          {
            id: "num9",
            number: "+33678901234",
            label: "Nouveau bureau",
            type: "landline",
            status: "porting",
            capabilities: {
              sms: true,
              mms: false,
              voice: true,
              fax: true,
              international: true,
              shortcode: false
            },
            smsConfig: {
              enabled: false,
              autoReply: false,
              templates: [],
              forwardToEmail: false
            },
            callerID: {
              display: "Notre Entreprise - Nouveau",
              fallback: "+33678901234"
            },
            blocking: {
              enabled: false,
              blockedNumbers: [],
              spamFiltering: true,
              anonymousCallBlocking: false,
              whitelistedNumbers: [],
              customRules: []
            },
            portingStatus: {
              status: "in_progress",
              requestDate: "2024-03-10",
              estimatedCompletionDate: "2024-04-10",
              previousProvider: "TelecomEx",
              notes: "Confirmation reçue, en attente de la date de transfert"
            },
            stats: {
              incomingCalls: 0,
              outgoingCalls: 0,
              missedCalls: 0,
              callMinutes: 0,
              smsSent: 0,
              smsReceived: 0,
              totalCommunications: 0,
              usagePercentage: 0
            },
            plan: {
              name: "Business Standard",
              monthlyCost: 24.99,
              includedSMS: 500,
              includedMinutes: 750,
              smsUsed: 0,
              minutesUsed: 0,
              nextRenewal: "2025-05-01"
            },
            dateAcquired: "2024-03-10",
            tags: ["nouveau", "expansion", "portage"]
          }
        ];
        
        // Mock number groups
        const mockNumberGroups: INumberGroup[] = [
          {
            id: "group1",
            name: "Numéros principaux",
            description: "Numéros de contact principaux",
            numbers: ["num1", "num2", "num4"]
          },
          {
            id: "group2",
            name: "Équipe commerciale",
            description: "Numéros utilisés par l'équipe commerciale",
            numbers: ["num3", "num5"]
          },
          {
            id: "group3",
            name: "International",
            description: "Numéros internationaux",
            numbers: ["num6"]
          },
          {
            id: "group4",
            name: "Archives et réservations",
            description: "Numéros inactifs ou réservés",
            numbers: ["num7", "num8", "num9"]
          }
        ];
        
        setPhoneNumbers(mockNumbers);
        setNumberGroups(mockNumberGroups);
        
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
  
  // Filter numbers based on search and view
  const getFilteredNumbers = () => {
    let filtered = [...phoneNumbers];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(num => 
        num.label.toLowerCase().includes(term) || 
        num.number.toLowerCase().includes(term) ||
        (num.assignedTo && num.assignedTo.toLowerCase().includes(term))
      );
    }
    
    // Filter by view
    if (view === "mobile") {
      filtered = filtered.filter(num => num.type === "mobile");
    } else if (view === "landline") {
      filtered = filtered.filter(num => num.type === "landline");
    } else if (view === "tollfree") {
      filtered = filtered.filter(num => num.type === "tollfree");
    } else if (view === "special") {
      filtered = filtered.filter(num => ["vanity", "international", "virtual"].includes(num.type));
    } else if (view === "groups" && activeGroup) {
      const group = numberGroups.find(g => g.id === activeGroup);
      if (group) {
        filtered = filtered.filter(num => group.numbers.includes(num.id));
      }
    }
    
    // Filter by status
    if (!showInactive) {
      filtered = filtered.filter(num => !["inactive", "suspended"].includes(num.status));
    }
    
    return filtered;
  };
  
  const filteredNumbers = getFilteredNumbers();
  
  // Get number stats for all filtered numbers
  const getOverallStats = () => {
    const stats = {
      totalNumbers: filteredNumbers.length,
      activeNumbers: filteredNumbers.filter(n => n.status === "active").length,
      portingNumbers: filteredNumbers.filter(n => n.status === "porting").length,
      inactiveNumbers: filteredNumbers.filter(n => ["inactive", "suspended"].includes(n.status)).length,
      totalCalls: filteredNumbers.reduce((sum, num) => sum + num.stats.incomingCalls + num.stats.outgoingCalls, 0),
      totalSMS: filteredNumbers.reduce((sum, num) => sum + num.stats.smsSent + num.stats.smsReceived, 0),
      totalMinutes: filteredNumbers.reduce((sum, num) => sum + num.stats.callMinutes, 0),
      avgUsagePercentage: filteredNumbers.length > 0 
        ? Math.round(filteredNumbers.reduce((sum, num) => sum + num.stats.usagePercentage, 0) / filteredNumbers.length) 
        : 0
    };
    
    return stats;
  };
  
  const overallStats = getOverallStats();
  
  // Format phone number for display
  const formatPhoneNumber = (number: string) => {
    // For vanity numbers, just return as is
    if (!/^\+?\d+$/.test(number)) {
      return number;
    }
    
    // Basic formatting for French numbers
    if (number.startsWith("+33") && number.length === 12) {
      return number.replace(/(\+33)(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5 $6");
    }
    
    // For toll-free numbers
    if (number.startsWith("0800") && number.length === 10) {
      return number.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
    }
    
    // For international numbers, try to format them
    if (number.startsWith("+") && number.length > 10) {
      // Just add spaces every 2 digits after country code for simplicity
      const countryCode = number.substring(0, 3);
      const rest = number.substring(3);
      let formatted = countryCode + ' ';
      for (let i = 0; i < rest.length; i += 2) {
        formatted += rest.substring(i, Math.min(i + 2, rest.length)) + ' ';
      }
      return formatted.trim();
    }
    
    return number;
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return isDarkMode ? "bg-green-900 text-green-100" : "bg-green-100 text-green-800";
      case "inactive":
      case "suspended":
        return isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-800";
      case "porting":
        return isDarkMode ? "bg-amber-900 text-amber-100" : "bg-amber-100 text-amber-800";
      case "reserved":
        return isDarkMode ? "bg-blue-900 text-blue-100" : "bg-blue-100 text-blue-800";
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
      case "porting":
        return "Portage en cours";
      case "reserved":
        return "Réservé";
      case "suspended":
        return "Suspendu";
      default:
        return status;
    }
  };
  
  // Get number type icon
  const getNumberTypeIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <DevicePhoneMobileIcon className="h-5 w-5" />;
      case "landline":
        return <PhoneIcon className="h-5 w-5" />;
      case "tollfree":
        return <PhoneArrowUpRightIcon className="h-5 w-5" />;
      case "international":
        return <GlobeAltIcon className="h-5 w-5" />;
      case "vanity":
        return <FingerPrintIcon className="h-5 w-5" />;
      case "virtual":
        return <QrCodeIcon className="h-5 w-5" />;
      default:
        return <PhoneIcon className="h-5 w-5" />;
    }
  };
  
  // Get number type label
  const getNumberTypeLabel = (type: string) => {
    switch (type) {
      case "mobile":
        return "Mobile";
      case "landline":
        return "Fixe";
      case "tollfree":
        return "Numéro vert";
      case "international":
        return "International";
      case "vanity":
        return "Mémorable";
      case "virtual":
        return "Virtuel";
      default:
        return type;
    }
  };
  
  // Open number modal in add mode
  const handleAddNumber = () => {
    setSelectedNumber(null);
    setModalMode("add");
    setIsNumberModalOpen(true);
  };
  
  // Open number modal in edit mode
  const handleEditNumber = (number: IPhoneNumber) => {
    setSelectedNumber(number);
    setModalMode("edit");
    setIsNumberModalOpen(true);
  };
  
  // Open porting modal
  const handlePortNumber = (number: IPhoneNumber) => {
    setSelectedNumber(number);
    setIsPortingModalOpen(true);
  };
  
  // Open SMS template modal
  const handleConfigureSMS = (number: IPhoneNumber) => {
    setSelectedNumber(number);
    setIsSMSTemplateModalOpen(true);
  };
  
  // Toggle number status
  const toggleNumberStatus = (numberId: string) => {
    setPhoneNumbers(prev => 
      prev.map(num => {
        if (num.id === numberId) {
          return {
            ...num,
            status: num.status === "active" ? "inactive" : "active"
          };
        }
        return num;
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
                    <h1 className={`text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode ? 'from-[#6366F1] to-[#4F46E5]' : 'from-[#4F46E5] to-[#6366F1]'} mb-1 pl-2`}>Mes numéros</h1>
                    <p className={`${isDarkMode ? 'text-[#9CA3AF] opacity-90' : 'text-[#4F46E5] opacity-90'} pl-2`}>Gérez vos numéros de téléphone, SMS et configurations</p>
                    <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-[#4F46E5] opacity-10 rounded-full blur-3xl"></div>
                  </div>
                  
                  <div className={`${isDarkMode ? 'bg-[#1F2937] border-[#374151]' : 'bg-[#F3F4F6] border-[#E5E7EB]'} border rounded-lg px-4 py-3 max-w-xl`}>
                    <h2 className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'} mb-2`}>Information</h2>
                    <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                      Cette interface vous permet de gérer tous vos numéros de téléphone. Vous pouvez configurer les SMS, l&apos;identification d&apos;appel et lancer des demandes de portabilité.
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
                        <p className={`text-sm ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} font-medium`}>Numéros actifs</p>
                        <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} mt-1`}>
                          {overallStats.activeNumbers}/{overallStats.totalNumbers}
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
                        <p className={`text-sm ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} font-medium`}>Total appels</p>
                        <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} mt-1`}>
                          {overallStats.totalCalls.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#6366F1] shadow-lg">
                        <PhoneArrowUpRightIcon className="h-5 w-5 text-white" />
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
                        <p className={`text-sm ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} font-medium`}>Total SMS</p>
                        <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} mt-1`}>
                          {overallStats.totalSMS.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#6366F1] shadow-lg">
                        <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
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
                        onClick={handleAddNumber}
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
                        Afficher inactifs
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
                      Types de numéros
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
                        <span>Tous les numéros</span>
                        <span className={`ml-auto ${isDarkMode ? 'bg-[#111827]' : 'bg-white'} rounded-full px-2 py-0.5 text-xs`}>
                          {phoneNumbers.length}
                        </span>
                      </button>
                      
                      <button
                        onClick={() => setView("mobile")}
                        className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg ${
                          view === "mobile" 
                            ? isDarkMode 
                              ? 'bg-[#374151] text-[#F9FAFB]' 
                              : 'bg-[#F3F4F6] text-[#111827]'
                            : isDarkMode 
                              ? 'text-[#9CA3AF] hover:bg-[#374151] hover:text-[#F9FAFB]' 
                              : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'
                        }`}
                      >
                        <DevicePhoneMobileIcon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          view === "mobile" 
                            ? isDarkMode ? 'text-[#6366F1]' : 'text-[#4F46E5]' 
                            : isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
                        }`} />
                        <span>Mobiles</span>
                        <span className={`ml-auto ${isDarkMode ? 'bg-[#111827]' : 'bg-white'} rounded-full px-2 py-0.5 text-xs`}>
                          {phoneNumbers.filter(n => n.type === "mobile").length}
                        </span>
                      </button>
                      
                      <button
                        onClick={() => setView("landline")}
                        className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg ${
                          view === "landline" 
                            ? isDarkMode 
                              ? 'bg-[#374151] text-[#F9FAFB]' 
                              : 'bg-[#F3F4F6] text-[#111827]'
                            : isDarkMode 
                              ? 'text-[#9CA3AF] hover:bg-[#374151] hover:text-[#F9FAFB]' 
                              : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'
                        }`}
                      >
                        <BuildingOfficeIcon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          view === "landline" 
                            ? isDarkMode ? 'text-[#6366F1]' : 'text-[#4F46E5]' 
                            : isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
                        }`} />
                        <span>Fixes</span>
                        <span className={`ml-auto ${isDarkMode ? 'bg-[#111827]' : 'bg-white'} rounded-full px-2 py-0.5 text-xs`}>
                          {phoneNumbers.filter(n => n.type === "landline").length}
                        </span>
                      </button>
                      
                      <button
                        onClick={() => setView("tollfree")}
                        className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg ${
                          view === "tollfree" 
                            ? isDarkMode 
                              ? 'bg-[#374151] text-[#F9FAFB]' 
                              : 'bg-[#F3F4F6] text-[#111827]'
                            : isDarkMode 
                              ? 'text-[#9CA3AF] hover:bg-[#374151] hover:text-[#F9FAFB]' 
                              : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'
                        }`}
                      >
                        <PhoneArrowUpRightIcon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          view === "tollfree" 
                            ? isDarkMode ? 'text-[#6366F1]' : 'text-[#4F46E5]' 
                            : isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
                        }`} />
                        <span>Numéros verts</span>
                        <span className={`ml-auto ${isDarkMode ? 'bg-[#111827]' : 'bg-white'} rounded-full px-2 py-0.5 text-xs`}>
                          {phoneNumbers.filter(n => n.type === "tollfree").length}
                        </span>
                      </button>
                      
                      <button
                        onClick={() => setView("special")}
                        className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg ${
                          view === "special" 
                            ? isDarkMode 
                              ? 'bg-[#374151] text-[#F9FAFB]' 
                              : 'bg-[#F3F4F6] text-[#111827]'
                            : isDarkMode 
                              ? 'text-[#9CA3AF] hover:bg-[#374151] hover:text-[#F9FAFB]' 
                              : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'
                        }`}
                      >
                        <GlobeAltIcon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          view === "special" 
                            ? isDarkMode ? 'text-[#6366F1]' : 'text-[#4F46E5]' 
                            : isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
                        }`} />
                        <span>Numéros spéciaux</span>
                        <span className={`ml-auto ${isDarkMode ? 'bg-[#111827]' : 'bg-white'} rounded-full px-2 py-0.5 text-xs`}>
                          {phoneNumbers.filter(n => ["vanity", "international", "virtual"].includes(n.type)).length}
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
                      
                      {numberGroups.map(group => (
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
                            {group.numbers.length}
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
                      {view === "all" && "Tous les numéros"}
                      {view === "mobile" && "Numéros mobiles"}
                      {view === "landline" && "Numéros fixes"}
                      {view === "tollfree" && "Numéros verts"}
                      {view === "special" && "Numéros spéciaux"}
                      {view === "groups" && activeGroup && numberGroups.find(g => g.id === activeGroup)?.name}
                      {view === "groups" && !activeGroup && "Tous les groupes"}
                    </h2>
                    
                    <div className="flex items-center gap-2">
                      <button
                        className={`p-2 ${isDarkMode ? 'bg-[#374151] hover:bg-[#4B5563] text-[#F9FAFB]' : 'bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827]'} rounded-lg`}
                      >
                        <AdjustmentsHorizontalIcon className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={handleAddNumber}
                        className={`px-3 py-2 ${isDarkMode ? 'bg-[#4F46E5] hover:bg-[#4338CA]' : 'bg-[#4F46E5] hover:bg-[#4338CA]'} text-white rounded-lg flex items-center gap-1`}
                      >
                        <PlusIcon className="h-5 w-5" />
                        <span>Ajouter</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Numbers list */}
                  <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                      <div className="flex flex-col justify-center items-center p-12">
                        <div className="relative">
                          <div className={`absolute inset-0 bg-gradient-to-r ${isDarkMode ? 'from-[#4F46E5] to-[#6366F1]' : 'from-[#4F46E5] to-[#6366F1]'} rounded-full blur opacity-30 animate-pulse`}></div>
                          <div className={`relative animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${isDarkMode ? 'border-[#4F46E5]' : 'border-[#4F46E5]'}`}></div>
                        </div>
                        <p className={`mt-4 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#4F46E5]'} animate-pulse`}>Chargement des numéros...</p>
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
                    ) : filteredNumbers.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="relative mx-auto mb-6 w-20 h-20">
                          <div className={`absolute inset-0 ${isDarkMode ? 'bg-[#4F46E5]' : 'bg-[#4F46E5]'} opacity-20 rounded-full animate-pulse`}></div>
                          <PhoneIcon className={`h-20 w-20 ${isDarkMode ? 'text-[#4F46E5]' : 'text-[#4F46E5]'} opacity-60`} />
                        </div>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'} mb-2`}>Aucun numéro trouvé</h3>
                        <p className={`${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-4`}>
                          {searchTerm 
                            ? "Aucun numéro ne correspond à votre recherche." 
                            : "Aucun numéro trouvé dans cette catégorie."}
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
                        {filteredNumbers.map(number => (
                          <div
                            key={number.id}
                            className={`${isDarkMode ? 'bg-[#1F2937] border-[#374151]' : 'bg-white border-[#E5E7EB]'} border rounded-lg overflow-hidden shadow-sm`}
                          >
                            {/* Number header */}
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-3">
                                  <div className={`p-3 rounded-lg ${
                                    number.status === "active" 
                                      ? isDarkMode ? 'bg-green-900' : 'bg-green-100' 
                                      : number.status === "inactive" || number.status === "suspended"
                                        ? isDarkMode ? 'bg-gray-800' : 'bg-gray-100' 
                                        : number.status === "porting" 
                                          ? isDarkMode ? 'bg-amber-900' : 'bg-amber-100' 
                                          : isDarkMode ? 'bg-[#374151]' : 'bg-[#F3F4F6]'
                                  }`}>
                                    {getNumberTypeIcon(number.type)}
                                  </div>
                                  
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                        {number.label}
                                      </h3>
                                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(number.status)}`}>
                                        {getStatusText(number.status)}
                                      </span>
                                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${isDarkMode ? 'bg-[#111827] text-[#9CA3AF]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                                        {getNumberTypeLabel(number.type)}
                                      </span>
                                    </div>
                                    
                                    <div className="flex flex-col md:flex-row md:items-center md:gap-3 mt-1">
                                      <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                        {formatPhoneNumber(number.number)}
                                      </p>
                                      
                                      {number.assignedTo && (
                                        <>
                                          <span className="hidden md:inline text-gray-400">•</span>
                                          <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                            Assigné à: {number.assignedTo}
                                          </p>
                                        </>
                                      )}
                                      
                                      {number.dateAcquired && (
                                        <>
                                          <span className="hidden md:inline text-gray-400">•</span>
                                          <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                            Acquis le: {formatDate(number.dateAcquired)}
                                          </p>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => toggleNumberStatus(number.id)}
                                    className={`p-1.5 ${isDarkMode ? 'hover:bg-[#374151]' : 'hover:bg-[#F3F4F6]'} rounded-lg`}
                                    disabled={number.status === "porting"}
                                  >
                                    {number.status === "active" ? (
                                      <XCircleIcon className={`h-6 w-6 ${isDarkMode ? 'text-[#EF4444]' : 'text-[#EF4444]'}`} />
                                    ) : number.status !== "porting" ? (
                                      <CheckCircleIcon className={`h-6 w-6 ${isDarkMode ? 'text-[#22C55E]' : 'text-[#22C55E]'}`} />
                                    ) : (
                                      <ClockIcon className={`h-6 w-6 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`} />
                                    )}
                                  </button>
                                  
                                  <button
                                    onClick={() => handleEditNumber(number)}
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
                              
                              {/* Number stats */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F3F4F6]'}`}>
                                  <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>Appels entrants</p>
                                  <p className={`text-lg font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                    {number.stats.incomingCalls}
                                  </p>
                                </div>
                                
                                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F3F4F6]'}`}>
                                  <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>Appels sortants</p>
                                  <p className={`text-lg font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                    {number.stats.outgoingCalls}
                                  </p>
                                </div>
                                
                                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F3F4F6]'}`}>
                                  <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>SMS envoyés/reçus</p>
                                  <p className={`text-lg font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                    {number.stats.smsSent}/{number.stats.smsReceived}
                                  </p>
                                </div>
                                
                                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F3F4F6]'}`}>
                                  <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>Minutes utilisées</p>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                      <div 
                                        className={`h-2.5 rounded-full ${
                                          number.stats.usagePercentage > 80
                                            ? "bg-red-600"
                                            : number.stats.usagePercentage > 60
                                              ? "bg-amber-500"
                                              : "bg-green-600"
                                        }`}
                                        style={{ width: `${number.stats.usagePercentage}%` }}
                                      ></div>
                                    </div>
                                    <span className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                      {number.stats.callMinutes}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Tags */}
                              {number.tags && number.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                  {number.tags.map(tag => (
                                    <span 
                                      key={tag}
                                      className={`px-2 py-1 text-xs rounded-full ${isDarkMode ? 'bg-[#374151] text-[#9CA3AF]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            {/* Number actions */}
                            <div className={`border-t ${isDarkMode ? 'border-[#374151]' : 'border-[#E5E7EB]'} px-4 py-3 flex items-center gap-2 overflow-x-auto`}>
                              {number.capabilities.sms && (
                                <button
                                  onClick={() => handleConfigureSMS(number)}
                                  className={`px-3 py-1.5 ${
                                    number.smsConfig.enabled
                                      ? isDarkMode ? 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white' : 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
                                      : isDarkMode ? 'bg-[#374151] hover:bg-[#4B5563] text-[#9CA3AF]' : 'bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280]'
                                  } rounded-lg text-sm flex items-center gap-1 whitespace-nowrap`}
                                >
                                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                  <span>SMS</span>
                                  {number.smsConfig.enabled && (
                                    <span className={`inline-block w-2 h-2 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-green-400'} ml-1`}></span>
                                  )}
                                </button>
                              )}
                              
                              <button
                                className={`px-3 py-1.5 ${
                                  number.callerID.businessInfo
                                    ? isDarkMode ? 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white' : 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
                                    : isDarkMode ? 'bg-[#374151] hover:bg-[#4B5563] text-[#9CA3AF]' : 'bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280]'
                                } rounded-lg text-sm flex items-center gap-1 whitespace-nowrap`}
                              >
                                <BuildingOfficeIcon className="h-4 w-4" />
                                <span>ID Appelant</span>
                                {number.callerID.businessInfo && (
                                  <span className={`inline-block w-2 h-2 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-green-400'} ml-1`}></span>
                                )}
                              </button>
                              
                              <button
                                className={`px-3 py-1.5 ${
                                  number.blocking.enabled
                                    ? isDarkMode ? 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white' : 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
                                    : isDarkMode ? 'bg-[#374151] hover:bg-[#4B5563] text-[#9CA3AF]' : 'bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280]'
                                } rounded-lg text-sm flex items-center gap-1 whitespace-nowrap`}
                              >
                                <ShieldCheckIcon className="h-4 w-4" />
                                <span>Blocage</span>
                                {number.blocking.enabled && (
                                  <span className={`inline-block w-2 h-2 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-green-400'} ml-1`}></span>
                                )}
                              </button>
                              
                              {!number.portingStatus && (
                                <button
                                  onClick={() => handlePortNumber(number)}
                                  className={`px-3 py-1.5 ${isDarkMode ? 'bg-[#374151] hover:bg-[#4B5563] text-[#9CA3AF]' : 'bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280]'} rounded-lg text-sm flex items-center gap-1 whitespace-nowrap`}
                                >
                                  <ArrowsRightLeftIcon className="h-4 w-4" />
                                  <span>Portabilité</span>
                                </button>
                              )}
                            </div>
                            
                            {/* Porting status */}
                            {number.portingStatus && (
                              <div className={`border-t ${isDarkMode ? 'border-[#374151]' : 'border-[#E5E7EB]'}`}>
                                <button
                                  onClick={() => toggleSection(number.id, 'porting')}
                                  className={`w-full flex justify-between items-center p-4 ${isDarkMode ? 'hover:bg-[#111827]' : 'hover:bg-[#F3F4F6]'}`}
                                >
                                  <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                    Statut de portabilité
                                  </span>
                                  {isSectionExpanded(number.id, 'porting') ? (
                                    <ChevronUpIcon className="h-5 w-5" />
                                  ) : (
                                    <ChevronDownIcon className="h-5 w-5" />
                                  )}
                                </button>
                                
                                {isSectionExpanded(number.id, 'porting') && (
                                  <div className="px-4 pb-4">
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F3F4F6]'}`}>
                                      <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-full ${
                                          number.portingStatus.status === "in_progress"
                                            ? isDarkMode ? 'bg-amber-900' : 'bg-amber-100'
                                            : number.portingStatus.status === "completed"
                                              ? isDarkMode ? 'bg-green-900' : 'bg-green-100'
                                              : number.portingStatus.status === "failed"
                                                ? isDarkMode ? 'bg-red-900' : 'bg-red-100'
                                                : isDarkMode ? 'bg-blue-900' : 'bg-blue-100'
                                        }`}>
                                          <ArrowsRightLeftIcon className={`h-5 w-5 ${
                                            number.portingStatus.status === "in_progress"
                                              ? isDarkMode ? 'text-amber-300' : 'text-amber-700'
                                              : number.portingStatus.status === "completed"
                                                ? isDarkMode ? 'text-green-300' : 'text-green-700'
                                                : number.portingStatus.status === "failed"
                                                  ? isDarkMode ? 'text-red-300' : 'text-red-700'
                                                  : isDarkMode ? 'text-blue-300' : 'text-blue-700'
                                          }`} />
                                        </div>
                                        
                                        <div>
                                          <h4 className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'} mb-1`}>
                                            {number.portingStatus.status === "pending" && "En attente de validation"}
                                            {number.portingStatus.status === "in_progress" && "Portage en cours"}
                                            {number.portingStatus.status === "completed" && "Portage terminé"}
                                            {number.portingStatus.status === "failed" && "Portage échoué"}
                                          </h4>
                                          
                                          <div className="space-y-2">
                                            <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                              Demande effectuée le: <span className="font-medium">{formatDate(number.portingStatus.requestDate)}</span>
                                            </p>
                                            
                                            {number.portingStatus.estimatedCompletionDate && (
                                              <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                                Date prévue de fin: <span className="font-medium">{formatDate(number.portingStatus.estimatedCompletionDate)}</span>
                                              </p>
                                            )}
                                            
                                            {number.portingStatus.previousProvider && (
                                              <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                                Opérateur précédent: <span className="font-medium">{number.portingStatus.previousProvider}</span>
                                              </p>
                                            )}
                                            
                                            {number.portingStatus.notes && (
                                              <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                                Notes: <span className="font-medium">{number.portingStatus.notes}</span>
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* SMS Configuration */}
                            {number.capabilities.sms && (
                              <div className={`border-t ${isDarkMode ? 'border-[#374151]' : 'border-[#E5E7EB]'}`}>
                                <button
                                  onClick={() => toggleSection(number.id, 'sms')}
                                  className={`w-full flex justify-between items-center p-4 ${isDarkMode ? 'hover:bg-[#111827]' : 'hover:bg-[#F3F4F6]'}`}
                                >
                                  <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                    Configuration SMS
                                  </span>
                                  {isSectionExpanded(number.id, 'sms') ? (
                                    <ChevronUpIcon className="h-5 w-5" />
                                  ) : (
                                    <ChevronDownIcon className="h-5 w-5" />
                                  )}
                                </button>
                                
                                {isSectionExpanded(number.id, 'sms') && (
                                  <div className="px-4 pb-4">
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F3F4F6]'}`}>
                                      <div className="flex items-start gap-3 mb-4">
                                        <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                                          <ChatBubbleLeftRightIcon className={`h-5 w-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`} />
                                        </div>
                                        
                                        <div>
                                          <h4 className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'} mb-1`}>
                                            Configuration SMS {number.smsConfig.enabled ? "active" : "inactive"}
                                          </h4>
                                          
                                          <div className="space-y-2">
                                            {number.smsConfig.autoReply && (
                                              <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                                <span className="font-medium">Réponse automatique activée</span>
                                              </p>
                                            )}
                                            
                                            {number.smsConfig.forwardToEmail && (
                                              <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                                Transfert vers: <span className="font-medium">{number.smsConfig.emailDestination}</span>
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {number.smsConfig.templates && number.smsConfig.templates.length > 0 && (
                                        <div className="mt-3">
                                          <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                            Modèles SMS ({number.smsConfig.templates.length})
                                          </h5>
                                          <div className="space-y-2">
                                            {number.smsConfig.templates.map(template => (
                                              <div 
                                                key={template.id}
                                                className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1F2937]' : 'bg-white'}`}
                                              >
                                                <div className="flex justify-between items-center mb-1">
                                                  <span className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                                    {template.name}
                                                  </span>
                                                  <span className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                                    Utilisé {template.usageCount} fois
                                                  </span>
                                                </div>
                                                <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                                  {template.content.length > 100 
                                                    ? template.content.substring(0, 100) + '...' 
                                                    : template.content}
                                                </p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      
                                      <div className="flex justify-end mt-4">
                                        <button
                                          onClick={() => handleConfigureSMS(number)}
                                          className={`text-sm ${isDarkMode ? 'text-[#4F46E5] hover:text-[#6366F1]' : 'text-[#4F46E5] hover:text-[#6366F1]'}`}
                                        >
                                          Modifier la configuration SMS
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Caller ID Configuration */}
                            <div className={`border-t ${isDarkMode ? 'border-[#374151]' : 'border-[#E5E7EB]'}`}>
                              <button
                                onClick={() => toggleSection(number.id, 'callerId')}
                                className={`w-full flex justify-between items-center p-4 ${isDarkMode ? 'hover:bg-[#111827]' : 'hover:bg-[#F3F4F6]'}`}
                              >
                                <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                  Identification d&apos;appel
                                </span>
                                {isSectionExpanded(number.id, 'callerId') ? (
                                  <ChevronUpIcon className="h-5 w-5" />
                                ) : (
                                  <ChevronDownIcon className="h-5 w-5" />
                                )}
                              </button>
                              
                              {isSectionExpanded(number.id, 'callerId') && (
                                <div className="px-4 pb-4">
                                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F3F4F6]'}`}>
                                    <div className="flex items-start gap-3 mb-4">
                                      <div className={`p-2 rounded-full ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                                        <BuildingOfficeIcon className={`h-5 w-5 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`} />
                                      </div>
                                      
                                      <div>
                                        <h4 className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'} mb-1`}>
                                          Identifiant principal
                                        </h4>
                                        
                                        <div className="space-y-2">
                                          <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                            Nom affiché: <span className="font-medium">{number.callerID.display}</span>
                                          </p>
                                          
                                          <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                            Numéro de secours: <span className="font-medium">{formatPhoneNumber(number.callerID.fallback)}</span>
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {number.callerID.businessInfo && (
                                      <div className={`mt-3 p-3 rounded-lg ${isDarkMode ? 'bg-[#1F2937]' : 'bg-white'}`}>
                                        <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                          Informations d&apos;entreprise
                                        </h5>
                                        <div className="space-y-1">
                                          <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                            Nom: <span className="font-medium">{number.callerID.businessInfo.name}</span>
                                          </p>
                                          <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                            Adresse: <span className="font-medium">{number.callerID.businessInfo.address}</span>
                                          </p>
                                          {number.callerID.businessInfo.website && (
                                            <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                              Site web: <span className="font-medium">{number.callerID.businessInfo.website}</span>
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    
                                    <div className="flex justify-end mt-4">
                                      <button
                                        className={`text-sm ${isDarkMode ? 'text-[#4F46E5] hover:text-[#6366F1]' : 'text-[#4F46E5] hover:text-[#6366F1]'}`}
                                      >
                                        Modifier l&apos;identification
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Plan details */}
                            <div className={`border-t ${isDarkMode ? 'border-[#374151]' : 'border-[#E5E7EB]'}`}>
                              <button
                                onClick={() => toggleSection(number.id, 'plan')}
                                className={`w-full flex justify-between items-center p-4 ${isDarkMode ? 'hover:bg-[#111827]' : 'hover:bg-[#F3F4F6]'}`}
                              >
                                <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                  Forfait et facturation
                                </span>
                                {isSectionExpanded(number.id, 'plan') ? (
                                  <ChevronUpIcon className="h-5 w-5" />
                                ) : (
                                  <ChevronDownIcon className="h-5 w-5" />
                                )}
                              </button>
                              
                              {isSectionExpanded(number.id, 'plan') && (
                                <div className="px-4 pb-4">
                                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F3F4F6]'}`}>
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                                      <div>
                                        <h4 className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'} mb-1`}>
                                          {number.plan.name}
                                        </h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                          Renouvellement: {formatDate(number.plan.nextRenewal)}
                                        </p>
                                      </div>
                                      
                                      <div className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-[#1F2937]' : 'bg-white'}`}>
                                        <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                          Coût mensuel
                                        </p>
                                        <p className={`text-xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                          {formatCurrency(number.plan.monthlyCost)}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    {number.plan.includedMinutes > 0 && (
                                      <div className="mb-4">
                                        <div className="flex justify-between items-center mb-1">
                                          <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                            Utilisation des minutes
                                          </p>
                                          <p className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                            {number.plan.minutesUsed} / {number.plan.includedMinutes}
                                          </p>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                          <div 
                                            className={`h-2.5 rounded-full ${
                                              (number.plan.minutesUsed / number.plan.includedMinutes) > 0.8
                                                ? "bg-red-600"
                                                : (number.plan.minutesUsed / number.plan.includedMinutes) > 0.6
                                                  ? "bg-amber-500"
                                                  : "bg-green-600"
                                            }`}
                                            style={{ width: `${(number.plan.minutesUsed / number.plan.includedMinutes) * 100}%` }}
                                          ></div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {number.plan.includedSMS > 0 && (
                                      <div className="mb-4">
                                        <div className="flex justify-between items-center mb-1">
                                          <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                            Utilisation des SMS
                                          </p>
                                          <p className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                            {number.plan.smsUsed} / {number.plan.includedSMS}
                                          </p>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                          <div 
                                            className={`h-2.5 rounded-full ${
                                              (number.plan.smsUsed / number.plan.includedSMS) > 0.8
                                                ? "bg-red-600"
                                                : (number.plan.smsUsed / number.plan.includedSMS) > 0.6
                                                  ? "bg-amber-500"
                                                  : "bg-green-600"
                                            }`}
                                            style={{ width: `${(number.plan.smsUsed / number.plan.includedSMS) * 100}%` }}
                                          ></div>
                                        </div>
                                      </div>
                                    )}
                                    
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
                            
                            {/* Blocking Configuration */}
                            {number.blocking.enabled && (
                              <div className={`border-t ${isDarkMode ? 'border-[#374151]' : 'border-[#E5E7EB]'}`}>
                                <button
                                  onClick={() => toggleSection(number.id, 'blocking')}
                                  className={`w-full flex justify-between items-center p-4 ${isDarkMode ? 'hover:bg-[#111827]' : 'hover:bg-[#F3F4F6]'}`}
                                >
                                  <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                    Configuration de blocage
                                  </span>
                                  {isSectionExpanded(number.id, 'blocking') ? (
                                    <ChevronUpIcon className="h-5 w-5" />
                                  ) : (
                                    <ChevronDownIcon className="h-5 w-5" />
                                  )}
                                </button>
                                
                                {isSectionExpanded(number.id, 'blocking') && (
                                  <div className="px-4 pb-4">
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F3F4F6]'}`}>
                                      <div className="flex items-start gap-3 mb-4">
                                        <div className={`p-2 rounded-full ${isDarkMode ? 'bg-red-900' : 'bg-red-100'}`}>
                                          <ShieldCheckIcon className={`h-5 w-5 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`} />
                                        </div>
                                        
                                        <div>
                                          <h4 className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'} mb-1`}>
                                            Blocage actif
                                          </h4>
                                          
                                          <div className="space-y-2">
                                            {number.blocking.spamFiltering && (
                                              <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                                <span className="font-medium">Filtrage anti-spam activé</span>
                                              </p>
                                            )}
                                            
                                            {number.blocking.anonymousCallBlocking && (
                                              <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                                <span className="font-medium">Blocage des appels anonymes activé</span>
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {number.blocking.blockedNumbers.length > 0 && (
                                        <div className="mt-3">
                                          <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                            Numéros bloqués ({number.blocking.blockedNumbers.length})
                                          </h5>
                                          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1F2937]' : 'bg-white'}`}>
                                            <ul className="space-y-1">
                                              {number.blocking.blockedNumbers.map((blockedNumber, index) => (
                                                <li key={index} className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                                  {formatPhoneNumber(blockedNumber)}
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {number.blocking.customRules.length > 0 && (
                                        <div className="mt-3">
                                          <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                            Règles personnalisées ({number.blocking.customRules.length})
                                          </h5>
                                          <div className="space-y-2">
                                            {number.blocking.customRules.map(rule => (
                                              <div 
                                                key={rule.id}
                                                className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1F2937]' : 'bg-white'}`}
                                              >
                                                <div className="flex justify-between items-center mb-1">
                                                  <span className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                                    {rule.name}
                                                  </span>
                                                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                    rule.action === 'block'
                                                      ? isDarkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800'
                                                      : rule.action === 'allow'
                                                        ? isDarkMode ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800'
                                                        : rule.action === 'voicemail'
                                                          ? isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'
                                                          : isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800'
                                                  }`}>
                                                    {rule.action === 'block' && 'Bloquer'}
                                                    {rule.action === 'allow' && 'Autoriser'}
                                                    {rule.action === 'voicemail' && 'Messagerie'}
                                                    {rule.action === 'custom' && 'Personnalisé'}
                                                  </span>
                                                </div>
                                                <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                                  Condition: {rule.condition}
                                                </p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      
                                      <div className="flex justify-end mt-4">
                                        <button
                                          className={`text-sm ${isDarkMode ? 'text-[#4F46E5] hover:text-[#6366F1]' : 'text-[#4F46E5] hover:text-[#6366F1]'}`}
                                        >
                                          Modifier les règles de blocage
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
          {isNumberModalOpen && (
            <NumberModal
              isOpen={isNumberModalOpen}
              onClose={() => setIsNumberModalOpen(false)}
              mode={modalMode}
              number={selectedNumber ? (mapToPhoneNumber(selectedNumber) as NumberModalPhoneNumber) : null}
              onSave={(number: NumberModalPhoneNumber) => {
                const convertedNumber = mapToIPhoneNumber(number);
                if (modalMode === "add") {
                  setPhoneNumbers(prev => [...prev, convertedNumber]);
                } else {
                  setPhoneNumbers(prev => 
                    prev.map(num => num.id === convertedNumber.id ? convertedNumber : num)
                  );
                }
                setIsNumberModalOpen(false);
              }}
            />
          )}
                  
          {isPortingModalOpen && (
            <PortingModal
              isOpen={isPortingModalOpen}
              onClose={() => setIsPortingModalOpen(false)}
              number={selectedNumber ? (mapToPortingData(selectedNumber) as PortingModalNumberData) : null}
              onSave={(data: PortingModalNumberData) => {
                const convertedNumber = mapToIPhoneNumber(data);
                setPhoneNumbers(prev => 
                  prev.map(num => num.id === convertedNumber.id ? convertedNumber : num)
                );
                setIsPortingModalOpen(false);
              }}
            />
          )}
          
          {isSMSTemplateModalOpen && (
            <SMSTemplateModal
              isOpen={isSMSTemplateModalOpen}
              onClose={() => setIsSMSTemplateModalOpen(false)}
              number={selectedNumber ? (mapToSMSTemplateData(selectedNumber) as SMSTemplateModalNumberData) : null}
              onSave={(data: SMSTemplateModalNumberData) => {
                const convertedNumber = mapToIPhoneNumber(data);
                setPhoneNumbers(prev => 
                  prev.map(num => num.id === convertedNumber.id ? convertedNumber : num)
                );
                setIsSMSTemplateModalOpen(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}
