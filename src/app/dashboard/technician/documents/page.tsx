"use client";

import { useState, JSX } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  DocumentTextIcon,
  // ChevronLeftIcon,
  // ChevronRightIcon,
  PlusIcon,
  DocumentArrowDownIcon,
  // DocumentCheckIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  PencilIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  // ArrowTopRightOnSquareIcon,
  ShareIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  // TagIcon,
  AdjustmentsHorizontalIcon,
  CalendarIcon,
  MoonIcon,
  SunIcon,
  DocumentArrowUpIcon,
  TrashIcon,
  // ArrowUpTrayIcon,
  // BellAlertIcon,
  // HandThumbUpIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
  // PaperClipIcon,
  DocumentPlusIcon,
  InformationCircleIcon,
  CheckIcon,
  XMarkIcon,
  // QueueListIcon,
  // CircleStackIcon,
  // CogIcon,
} from "@heroicons/react/24/outline";

// Define document types
interface DocumentType {
  id: string;
  name: string;
  color: string;
}

// Define document status
type DocumentStatus = 
  | "pending_signature" 
  | "signed" 
  | "to_send" 
  | "sent" 
  | "draft" 
  | "template"
  | "expired"
  | "to_download"
  | "to_complete";

// Define document interface
interface TechnicianDocument {
  id: number;
  name: string;
  fileName: string;
  type: string;
  typeId: string;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
  size: string;
  clientName?: string;
  clientEmail?: string;
  expiryDate?: string;
  signatureDate?: string;
  technicianName?: string; // Add this property
  intervention?: {
    id: number;
    title: string;
    date: string;
  };
  tags?: string[];
  preview?: string;
  isAttestationIntervention?: boolean;
  attestationDetails?: {
    clientAddress?: string;
    interventionDate?: string;
    interventionDescription?: string;
    workDone?: string[];
    materialsUsed?: string[];
    technicalNotes?: string;
    hoursSpent?: number;
    clientSignature?: boolean;
    technicianSignature?: boolean;
    toBeCompleted?: boolean;
    completedBy?: string;
    hasCopy?: boolean;
  };
}

// Sample document types
const documentTypes: DocumentType[] = [
  { id: "attestation", name: "Attestation d'Intervention", color: "bg-rose-500" },
  { id: "installation", name: "Installation", color: "bg-blue-500" },
  { id: "invoice", name: "Facture", color: "bg-green-500" },
  { id: "maintenance", name: "Maintenance", color: "bg-purple-500" },
  { id: "warranty", name: "Garantie", color: "bg-yellow-500" },
  { id: "contract", name: "Contrat", color: "bg-red-500" },
  { id: "report", name: "Rapport", color: "bg-indigo-500" },
  { id: "certificate", name: "Certificat", color: "bg-pink-500" },
  { id: "technical", name: "Technique", color: "bg-cyan-500" },
];

// Sample documents data with attestations
const sampleDocuments: TechnicianDocument[] = [
  {
    id: 1,
    name: "Attestation d'Intervention - Famille Dupont",
    fileName: "attestation-intervention-dupont.pdf",
    type: "Attestation d'Intervention",
    typeId: "attestation",
    status: "to_complete",
    createdAt: "2025-03-10T09:30:00",
    updatedAt: "2025-03-10T09:30:00",
    size: "1.2 MB",
    clientName: "Famille Dupont",
    clientEmail: "dupont@email.com",
    intervention: {
      id: 1,
      title: "Installation - Pompe à chaleur - Résidence Dupont",
      date: "2025-03-08",
    },
    tags: ["PAC", "Résidentiel", "Attestation"],
    preview: "/previews/attestation-intervention-template.png",
    isAttestationIntervention: true,
    attestationDetails: {
      clientAddress: "12 Rue des Lilas, 75020 Paris",
      interventionDate: "2025-03-08",
      workDone: [],
      materialsUsed: [],
      technicalNotes: "",
      hoursSpent: 3,
      clientSignature: false,
      technicianSignature: false,
      toBeCompleted: true,
      hasCopy: false
    }
  },
  {
    id: 2,
    name: "Attestation d'Intervention - Résidence Soleil",
    fileName: "attestation-intervention-soleil.pdf",
    type: "Attestation d'Intervention",
    typeId: "attestation",
    status: "signed",
    createdAt: "2025-03-20T17:45:00",
    updatedAt: "2025-03-20T18:30:00",
    signatureDate: "2025-03-20T18:30:00",
    size: "1.4 MB",
    clientName: "Résidence Soleil",
    clientEmail: "contact@residence-soleil.fr",
    intervention: {
      id: 4,
      title: "Intervention - Système Solaire Combiné - Résidence Soleil",
      date: "2025-03-20",
    },
    tags: ["SSC", "Résidentiel", "Attestation"],
    preview: "/previews/attestation-complete.png",
    isAttestationIntervention: true,
    attestationDetails: {
      clientAddress: "27 Rue de la Paix, 75002 Paris",
      interventionDate: "2025-03-20",
      interventionDescription: "Réparation fuite et contrôle système solaire combiné",
      workDone: ["Détection de fuite", "Remplacement vanne régulation", "Test pression", "Remise en service"],
      materialsUsed: ["Vanne régulation x1", "Joint spécial haute température x2"],
      technicalNotes: "Pression du circuit stabilisée à 2.4 bars. Recommandation: surveillance mensuelle du niveau de pression.",
      hoursSpent: 2.5,
      clientSignature: true,
      technicianSignature: true,
      completedBy: "Marie Lambert",
      hasCopy: true
    }
  },
  {
    id: 3,
    name: "Attestation d'Intervention - Famille Martin",
    fileName: "attestation-intervention-martin.pdf",
    type: "Attestation d'Intervention",
    typeId: "attestation",
    status: "to_send",
    createdAt: "2025-03-12T16:45:00",
    updatedAt: "2025-03-12T17:30:00",
    size: "1.3 MB",
    clientName: "Famille Martin",
    clientEmail: "martin@email.com",
    intervention: {
      id: 2,
      title: "Maintenance - Chauffe-eau solaire individuel - Immeuble Martin",
      date: "2025-03-12",
    },
    tags: ["CES", "Maintenance", "Attestation"],
    preview: "/previews/attestation-completed.png",
    isAttestationIntervention: true,
    attestationDetails: {
      clientAddress: "45 Avenue Victor Hugo, 75016 Paris",
      interventionDate: "2025-03-12",
      interventionDescription: "Maintenance annuelle chauffe-eau solaire",
      workDone: ["Contrôle capteurs", "Vérification circuit", "Remplacement fluide caloporteur", "Test rendement"],
      materialsUsed: ["Liquide caloporteur 10L", "Joints d'étanchéité x4"],
      technicalNotes: "Rendement optimal. Installation en parfait état de fonctionnement.",
      hoursSpent: 2,
      clientSignature: true,
      technicianSignature: true,
      completedBy: "Sophie Dubois",
      hasCopy: true
    }
  },
  {
    id: 4,
    name: "Rapport d'installation - Pompe à chaleur",
    fileName: "rapport-installation-pac-dupont.pdf",
    type: "Installation",
    typeId: "installation",
    status: "pending_signature",
    createdAt: "2025-03-10T14:30:00",
    updatedAt: "2025-03-10T14:30:00",
    size: "2.4 MB",
    clientName: "Famille Dupont",
    clientEmail: "dupont@email.com",
    intervention: {
      id: 1,
      title: "Installation - Pompe à chaleur - Résidence Dupont",
      date: "2025-03-08",
    },
    tags: ["PAC", "Résidentiel"],
    preview: "/previews/rapport-installation.png"
  },
  {
    id: 5,
    name: "Contrat de maintenance - Chauffe-eau solaire",
    fileName: "contrat-maintenance-ces-martin.pdf",
    type: "Contrat",
    typeId: "contract",
    status: "to_send",
    createdAt: "2025-03-12T16:45:00",
    updatedAt: "2025-03-12T16:45:00",
    size: "1.8 MB",
    clientName: "Famille Martin",
    clientEmail: "martin@email.com",
    expiryDate: "2026-03-12T23:59:59",
    intervention: {
      id: 2,
      title: "Maintenance - Chauffe-eau solaire individuel - Immeuble Martin",
      date: "2025-03-12",
    },
    tags: ["Solaire", "Maintenance", "Contrat annuel"]
  },
  {
    id: 6,
    name: "Certificat de conformité - Chauffe-eau thermodynamique",
    fileName: "conformite-cet-bellevue.pdf",
    type: "Certificat",
    typeId: "certificate",
    status: "signed",
    createdAt: "2025-03-15T13:20:00",
    updatedAt: "2025-03-15T17:45:00",
    signatureDate: "2025-03-15T17:45:00",
    size: "850 KB",
    clientName: "Copropriété Belle Vue",
    clientEmail: "syndic@bellevue.fr",
    intervention: {
      id: 3,
      title: "Révision - Chauffe-eau thermodynamique - Complexe Belle Vue",
      date: "2025-03-15",
    },
    tags: ["CET", "Collectif", "Conformité"]
  },
  {
    id: 7,
    name: "Manuel d'utilisation - Système Solaire Combiné",
    fileName: "manuel-ssc-soleil.pdf",
    type: "Technique",
    typeId: "technical",
    status: "to_send",
    createdAt: "2025-03-19T09:10:00",
    updatedAt: "2025-03-19T09:10:00",
    size: "5.7 MB",
    clientName: "Résidence Soleil",
    clientEmail: "contact@residence-soleil.fr",
    intervention: {
      id: 4,
      title: "Intervention - Système Solaire Combiné - Résidence Soleil",
      date: "2025-03-20",
    },
    tags: ["SSC", "Manuel", "Documentation"]
  },
  {
    id: 8,
    name: "Devis réparation - Panneaux Solaires",
    fileName: "devis-reparation-ps-beausoleil.pdf",
    type: "Invoice",
    typeId: "invoice",
    status: "sent",
    createdAt: "2025-03-09T11:30:00",
    updatedAt: "2025-03-11T09:15:00",
    size: "1.2 MB",
    clientName: "M. Beausoleil",
    clientEmail: "beausoleil@email.com",
    intervention: {
      id: 5,
      title: "Réparation - Panneaux Solaires - Villa Beausoleil",
      date: "2025-03-12",
    },
    tags: ["Devis", "Photovoltaïque", "Réparation"]
  },
  {
    id: 9,
    name: "Attestation d'Intervention - Bureau Moderne",
    fileName: "attestation-ventilation-moderne.pdf",
    type: "Attestation d'Intervention",
    typeId: "attestation",
    status: "signed",
    createdAt: "2025-03-10T14:00:00",
    updatedAt: "2025-03-10T16:30:00",
    signatureDate: "2025-03-10T16:30:00",
    size: "1.3 MB",
    clientName: "Entreprise Moderne",
    clientEmail: "contact@entreprise-moderne.com",
    intervention: {
      id: 6,
      title: "Diagnostic - Système de Ventilation - Bureau Moderne",
      date: "2025-03-10",
    },
    tags: ["VMC", "Diagnostic", "Tertiaire", "Attestation"],
    preview: "/previews/attestation-ventilation.png",
    isAttestationIntervention: true,
    attestationDetails: {
      clientAddress: "18 Avenue de l'Innovation, 75013 Paris",
      interventionDate: "2025-03-10",
      interventionDescription: "Diagnostic complet système de ventilation bureaux",
      workDone: ["Mesures débit d'air", "Contrôle filtres", "Vérification moteur", "Analyse qualité air"],
      materialsUsed: [],
      technicalNotes: "Remplacement des filtres recommandé, à planifier dans les 2 mois. Débits conformes aux normes tertiaires.",
      hoursSpent: 1.5,
      clientSignature: true,
      technicianSignature: true,
      completedBy: "Sophie Dubois",
      hasCopy: true
    }
  },
  {
    id: 10,
    name: "Certificat de garantie - Bornes de Recharge",
    fileName: "garantie-bornes-parking-central.pdf",
    type: "Warranty",
    typeId: "warranty",
    status: "to_send",
    createdAt: "2025-03-13T18:00:00",
    updatedAt: "2025-03-13T18:00:00",
    size: "980 KB",
    expiryDate: "2030-03-13T23:59:59",
    clientName: "Parking Central SARL",
    clientEmail: "direction@parking-central.fr",
    intervention: {
      id: 7,
      title: "Installation - Bornes de Recharge - Parking Central",
      date: "2025-03-13",
    },
    tags: ["Bornes", "Garantie", "Mobilité"]
  },
  {
    id: 11,
    name: "Fiche technique - Climatisation industrielle",
    fileName: "fiche-technique-clim-hotel-luxe.pdf",
    type: "Technique",
    typeId: "technical",
    status: "to_download",
    createdAt: "2025-03-16T10:20:00",
    updatedAt: "2025-03-16T10:20:00",
    size: "4.3 MB",
    intervention: {
      id: 8,
      title: "Entretien - Système de Climatisation - Hôtel Luxe",
      date: "2025-03-18",
    },
    tags: ["Climatisation", "Technique", "Industriel"]
  },
  {
    id: 12,
    name: "Guide d'utilisation - Domotique résidentielle",
    fileName: "guide-domotique-maison-futur.pdf",
    type: "Technique",
    typeId: "technical",
    status: "to_download",
    createdAt: "2025-03-17T15:40:00",
    updatedAt: "2025-03-17T15:40:00",
    size: "7.8 MB",
    clientName: "M. et Mme Futur",
    clientEmail: "futur@email.com",
    intervention: {
      id: 9,
      title: "Installation - Système domotique - Maison intelligente",
      date: "2025-03-19",
    },
    tags: ["Domotique", "Smart Home", "Guide"]
  },
  {
    id: 13,
    name: "Modèle Attestation d'Intervention standard",
    fileName: "modele-attestation-standard.pdf",
    type: "Attestation d'Intervention",
    typeId: "attestation",
    status: "template",
    createdAt: "2025-01-15T10:30:00",
    updatedAt: "2025-01-15T10:30:00",
    size: "890 KB",
    tags: ["Modèle", "Attestation", "Standard"],
    preview: "/previews/attestation-template.png",
    isAttestationIntervention: true
  }
];

// Function to get status label in French
function getStatusLabel(status: DocumentStatus): string {
  switch (status) {
    case "pending_signature":
      return "En attente de signature";
    case "signed":
      return "Signé";
    case "to_send":
      return "À transmettre";
    case "sent":
      return "Transmis";
    case "draft":
      return "Brouillon";
    case "template":
      return "Modèle";
    case "expired":
      return "Expiré";
    case "to_download":
      return "À télécharger";
    case "to_complete":
      return "À compléter";
    default:
      return "Inconnu";
  }
}

// Function to get status icon component
function getStatusIcon(status: DocumentStatus): JSX.Element {
  switch (status) {
    case "pending_signature":
      return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    case "signed":
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    case "to_send":
      return <DocumentArrowUpIcon className="h-5 w-5 text-blue-500" />;
    case "sent":
      return <EnvelopeIcon className="h-5 w-5 text-blue-500" />;
    case "draft":
      return <PencilIcon className="h-5 w-5 text-gray-500" />;
    case "template":
      return <DocumentDuplicateIcon className="h-5 w-5 text-purple-500" />;
    case "expired":
      return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
    case "to_download":
      return <DocumentArrowDownIcon className="h-5 w-5 text-indigo-500" />;
    case "to_complete":
      return <ClipboardDocumentIcon className="h-5 w-5 text-orange-500" />;
    default:
      return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
  }
}

// Function to get tag color
function getTagColor(tag: string): string {
  // Simple hash function to determine color
  const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    "bg-blue-100 text-blue-800 border-blue-200",
    "bg-green-100 text-green-800 border-green-200",
    "bg-purple-100 text-purple-800 border-purple-200",
    "bg-yellow-100 text-yellow-800 border-yellow-200",
    "bg-red-100 text-red-800 border-red-200",
    "bg-indigo-100 text-indigo-800 border-indigo-200",
    "bg-pink-100 text-pink-800 border-pink-200",
    "bg-cyan-100 text-cyan-800 border-cyan-200"
  ];
  
  return colors[hash % colors.length];
}

function DocumentTypeBadge({ typeId }: { typeId: string }) {
  const docType = documentTypes.find(t => t.id === typeId);
  if (!docType) return null;
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${docType.color} bg-opacity-10 border`}>
      {docType.name}
    </span>
  );
}

interface AttestationFormData {
  interventionDescription: string;
  workDone: string[];
  materialsUsed: string[];
  technicalNotes: string;
  hoursSpent: number;
}

export default function TechnicianDocumentsPage() {
  const [documents, setDocuments] = useState<TechnicianDocument[]>(sampleDocuments);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  // const [selectedDocType, setSelectedDocType] = useState<string>("all");
  const [selectedDocument, setSelectedDocument] = useState<TechnicianDocument | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showAttestationForm, setShowAttestationForm] = useState<boolean>(false);
  const [attestationFormData, setAttestationFormData] = useState<AttestationFormData>({
    interventionDescription: "",
    workDone: [""],
    materialsUsed: [""],
    technicalNotes: "",
    hoursSpent: 0
  });  

  // Filter documents based on criteria
  const filteredDocuments = documents.filter(doc => {
    // Search filter
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(doc.clientName && doc.clientName.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !(doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))) {
      return false;
    }
    
    // Type filter
    if (filterType !== "all" && doc.typeId !== filterType) {
      return false;
    }
    
    // Status filter
    if (filterStatus !== "all" && doc.status !== filterStatus) {
      return false;
    }
    
    // Tab filter
    if (activeTab === "to_send" && doc.status !== "to_send") {
      return false;
    }
    if (activeTab === "to_download" && doc.status !== "to_download") {
      return false;
    }
    if (activeTab === "pending_signature" && doc.status !== "pending_signature") {
      return false;
    }
    if (activeTab === "signature" && (doc.status !== "signed" && doc.status !== "pending_signature")) {
      return false;
    }
    if (activeTab === "attestations" && !doc.isAttestationIntervention) {
      return false;
    }
    if (activeTab === "to_complete" && doc.status !== "to_complete") {
      return false;
    }
    
    return true;
  });
  
  // Count documents by category
  const attestationCount = documents.filter(doc => doc.isAttestationIntervention).length;
  const toCompleteCount = documents.filter(doc => doc.status === "to_complete").length;
  
  const openDocumentDetails = (doc: TechnicianDocument) => {
    setSelectedDocument(doc);
    
    // If it's an attestation to complete, we can pre-populate form
    if (doc.isAttestationIntervention && doc.status === "to_complete" && doc.attestationDetails) {
      setAttestationFormData({
        interventionDescription: doc.attestationDetails.interventionDescription || "",
        workDone: doc.attestationDetails.workDone?.length ? doc.attestationDetails.workDone : [""],
        materialsUsed: doc.attestationDetails.materialsUsed?.length ? doc.attestationDetails.materialsUsed : [""],
        technicalNotes: doc.attestationDetails.technicalNotes || "",
        hoursSpent: doc.attestationDetails.hoursSpent || 0
      });
    }
  };
  
  const closeDocumentDetails = () => {
    setSelectedDocument(null);
    setShowAttestationForm(false);
  };
  
  // Function to toggle attestation form
  const toggleAttestationForm = () => {
    setShowAttestationForm(!showAttestationForm);
  };
  
  // Handle form field changes
  const handleAttestationFieldChange = <K extends keyof AttestationFormData>(
    field: K,
    value: AttestationFormData[K]
  ) => {
    setAttestationFormData({
      ...attestationFormData,
      [field]: value
    });
  };  
  
  // Handle array field changes (workDone, materialsUsed)
  const handleArrayFieldChange = (
    field: "workDone" | "materialsUsed",
    index: number,
    value: string
  ) => {
    const newArray = [...attestationFormData[field]];
    newArray[index] = value;
    setAttestationFormData({
      ...attestationFormData,
      [field]: newArray
    });
  };
  
  // Add new item to array field
  const addArrayItem = (field: "workDone" | "materialsUsed") => {
    setAttestationFormData({
      ...attestationFormData,
      [field]: [...attestationFormData[field], ""]
    });
  };
  
  // Remove item from array field
  const removeArrayItem = (field: "workDone" | "materialsUsed", index: number) => {
    const newArray = [...attestationFormData[field]];
    newArray.splice(index, 1);
    if (newArray.length === 0) newArray.push(""); // Keep at least one empty field
    setAttestationFormData({
      ...attestationFormData,
      [field]: newArray
    });
  };
  
  // Submit the attestation form
  const submitAttestationForm = () => {
    if (!selectedDocument) return;
    
    // In a real app, this would send data to the server
    // For now, we'll just update our local state
    const updatedDocuments = documents.map(doc => {
      if (doc.id === selectedDocument.id) {
        return {
          ...doc,
          status: "to_send" as DocumentStatus,
          updatedAt: new Date().toISOString(),
          attestationDetails: {
            ...doc.attestationDetails,
            interventionDescription: attestationFormData.interventionDescription,
            workDone: attestationFormData.workDone.filter(Boolean),
            materialsUsed: attestationFormData.materialsUsed.filter(Boolean),
            technicalNotes: attestationFormData.technicalNotes,
            hoursSpent: attestationFormData.hoursSpent,
            technicianSignature: true,
            completedBy: "Jean Martin" // In a real app, this would be the logged-in user
          }
        };
      }
      return doc;
    });
    
    setDocuments(updatedDocuments);
    setShowAttestationForm(false);
    setSelectedDocument(null);
  };
  
  // Generate a new attestation for an intervention
  const generateNewAttestation = () => {
    // This would typically open a form to select the intervention
    // For demo purposes, we'll just add a new attestation to our list
    const newId = Math.max(...documents.map(d => d.id)) + 1;
    
    const newAttestation: TechnicianDocument = {
      id: newId,
      name: "Nouvelle Attestation d'Intervention",
      fileName: `attestation-intervention-${newId}.pdf`,
      type: "Attestation d'Intervention",
      typeId: "attestation",
      status: "to_complete",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      size: "1.1 MB",
      tags: ["Attestation", "Nouveau"],
      preview: "/previews/attestation-intervention-template.png",
      isAttestationIntervention: true,
      attestationDetails: {
        workDone: [],
        materialsUsed: [],
        technicalNotes: "",
        hoursSpent: 0,
        clientSignature: false,
        technicianSignature: false,
        toBeCompleted: true,
        hasCopy: false
      }
    };
    
    setDocuments([...documents, newAttestation]);
  };

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Common Header */}
        <Header />

        <main className="flex-1 overflow-y-auto">
          {/* Main container */}
        <div className="flex flex-col">
          {/* Navigation Header */}
          <div className={`${darkMode ? "bg-gradient-to-r from-gray-900 to-gray-800" : "bg-gradient-to-r from-[#1a365d] to-[#0f2942]"} p-7 text-white`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-white/15 rounded-2xl backdrop-blur-md flex items-center justify-center">
                  <DocumentTextIcon className="h-8 w-8 text-[#e2ffc2]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Documents Technicien</h2>
                  <p className="text-white/90 font-medium mt-1.5">
                    Gérez tous vos documents techniques, attestations et formulaires clients
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-4 w-4 text-white/60" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher un document..."
                    className="w-full text-sm border-none bg-white/15 hover:bg-white/20 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-white placeholder-white/60"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button 
                  className="flex-shrink-0 p-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
                  onClick={() => setDarkMode(!darkMode)}
                  aria-label={darkMode ? "Mode clair" : "Mode sombre"}
                >
                  {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                </button>
                <button 
                  className="flex-shrink-0 p-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <AdjustmentsHorizontalIcon className="h-5 w-5" />
                </button>
                <div className="relative group">
                  <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#e2ffc2] to-[#c5f7a5] hover:opacity-90 text-[#1a365d] rounded-xl text-sm font-semibold transition-colors">
                    <PlusIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Nouveau document</span>
                    <span className="sm:hidden">Nouveau</span>
                  </button>
                  
                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 hidden group-hover:block z-20">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <button 
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={generateNewAttestation}
                      >
                        <ClipboardDocumentCheckIcon className="mr-3 h-5 w-5 text-rose-500" />
                        Nouvelle Attestation d&apos;Intervention
                      </button>
                      <button className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <DocumentPlusIcon className="mr-3 h-5 w-5 text-blue-500" />
                        Autre document
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs for document categories */}
            <div className="mt-8 border-b border-white/20">
              <div className="flex flex-wrap items-center gap-1 md:gap-2">
                <button
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-t-lg ${
                    activeTab === "all" ? "bg-white/10 border-b-2 border-white" : "text-white/80 hover:bg-white/5"
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  Tous les documents
                </button>
                <button
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-t-lg ${
                    activeTab === "attestations" ? "bg-white/10 border-b-2 border-white" : "text-white/80 hover:bg-white/5"
                  }`}
                  onClick={() => setActiveTab("attestations")}
                >
                  <span className="flex items-center">
                    <ClipboardDocumentCheckIcon className="h-4 w-4 mr-1.5" />
                    Attestations d&apos;intervention
                    <span className="ml-1.5 bg-rose-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                      {attestationCount}
                    </span>
                  </span>
                </button>
                <button
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-t-lg ${
                    activeTab === "to_complete" ? "bg-white/10 border-b-2 border-white" : "text-white/80 hover:bg-white/5"
                  }`}
                  onClick={() => setActiveTab("to_complete")}
                >
                  <span className="flex items-center">
                    <ClipboardDocumentIcon className="h-4 w-4 mr-1.5" />
                    À compléter
                    <span className="ml-1.5 bg-orange-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                      {toCompleteCount}
                    </span>
                  </span>
                </button>
                <button
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-t-lg ${
                    activeTab === "to_send" ? "bg-white/10 border-b-2 border-white" : "text-white/80 hover:bg-white/5"
                  }`}
                  onClick={() => setActiveTab("to_send")}
                >
                  <span className="flex items-center">
                    <DocumentArrowUpIcon className="h-4 w-4 mr-1.5" />
                    À transmettre
                  </span>
                </button>
                <button
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-t-lg ${
                    activeTab === "to_download" ? "bg-white/10 border-b-2 border-white" : "text-white/80 hover:bg-white/5"
                  }`}
                  onClick={() => setActiveTab("to_download")}
                >
                  <span className="flex items-center">
                    <DocumentArrowDownIcon className="h-4 w-4 mr-1.5" />
                    À télécharger
                  </span>
                </button>
                <button
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-t-lg ${
                    activeTab === "signature" ? "bg-white/10 border-b-2 border-white" : "text-white/80 hover:bg-white/5"
                  }`}
                  onClick={() => setActiveTab("signature")}
                >
                  <span className="flex items-center">
                    <IdentificationIcon className="h-4 w-4 mr-1.5" />
                    Signatures
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Filters panel - appears when filters button is clicked */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className={`${darkMode ? "bg-gray-800" : "bg-white"} border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Type de document
                    </label>
                    <select
                      className={`w-full rounded-lg border text-sm py-2 px-3 ${
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-white" 
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option value="all">Tous les types</option>
                      {documentTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Statut
                    </label>
                    <select
                      className={`w-full rounded-lg border text-sm py-2 px-3 ${
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-white" 
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="to_complete">À compléter</option>
                      <option value="pending_signature">En attente de signature</option>
                      <option value="signed">Signé</option>
                      <option value="to_send">À transmettre</option>
                      <option value="sent">Transmis</option>
                      <option value="draft">Brouillon</option>
                      <option value="template">Modèle</option>
                      <option value="to_download">À télécharger</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Affichage
                    </label>
                    <div className="flex gap-2">
                      <button 
                        className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium flex items-center justify-center ${
                          viewMode === "list" 
                            ? darkMode 
                              ? "bg-blue-600 text-white border-blue-700" 
                              : "bg-blue-50 text-blue-700 border-blue-200"
                            : darkMode 
                              ? "bg-gray-700 text-gray-300 border-gray-600" 
                              : "bg-white text-gray-700 border-gray-300"
                        }`}
                        onClick={() => setViewMode("list")}
                      >
                        <DocumentTextIcon className="h-4 w-4 mr-1.5" />
                        Liste
                      </button>
                      <button 
                        className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium flex items-center justify-center ${
                          viewMode === "grid" 
                            ? darkMode 
                              ? "bg-blue-600 text-white border-blue-700" 
                              : "bg-blue-50 text-blue-700 border-blue-200"
                            : darkMode 
                              ? "bg-gray-700 text-gray-300 border-gray-600" 
                              : "bg-white text-gray-700 border-gray-300"
                        }`}
                        onClick={() => setViewMode("grid")}
                      >
                        <FolderIcon className="h-4 w-4 mr-1.5" />
                        Vignettes
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Documents Container */}
          <div className={`p-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <motion.div 
                className={`rounded-xl p-4 flex items-center gap-3 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`p-2.5 ${darkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100"} rounded-lg`}>
                  <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>
                    Total
                  </p>
                  <p className="text-xl font-bold">{documents.length} documents</p>
                </div>
              </motion.div>
              
              <motion.div 
                className={`rounded-xl p-4 flex items-center gap-3 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className={`p-2.5 ${darkMode ? "bg-rose-900/30 text-rose-400" : "bg-rose-100"} rounded-lg`}>
                  <ClipboardDocumentCheckIcon className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>
                    Attestations
                  </p>
                  <p className="text-xl font-bold">{attestationCount}</p>
                </div>
              </motion.div>
              
              <motion.div 
                className={`rounded-xl p-4 flex items-center gap-3 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className={`p-2.5 ${darkMode ? "bg-orange-900/30 text-orange-400" : "bg-orange-100"} rounded-lg`}>
                  <ClipboardDocumentIcon className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>
                    À compléter
                  </p>
                  <p className="text-xl font-bold">{toCompleteCount}</p>
                </div>
              </motion.div>
              
              <motion.div 
                className={`rounded-xl p-4 flex items-center gap-3 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className={`p-2.5 ${darkMode ? "bg-green-900/30 text-green-400" : "bg-green-100"} rounded-lg`}>
                  <DocumentArrowUpIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>
                    À transmettre
                  </p>
                  <p className="text-xl font-bold">{documents.filter(doc => doc.status === "to_send").length}</p>
                </div>
              </motion.div>
              
              <motion.div 
                className={`rounded-xl p-4 flex items-center gap-3 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className={`p-2.5 ${darkMode ? "bg-indigo-900/30 text-indigo-400" : "bg-indigo-100"} rounded-lg`}>
                  <DocumentArrowDownIcon className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>
                    À télécharger
                  </p>
                  <p className="text-xl font-bold">{documents.filter(doc => doc.status === "to_download").length}</p>
                </div>
              </motion.div>
            </div>

            {/* Documents List View */}
            {viewMode === "list" && (
              <>
                {filteredDocuments.length === 0 ? (
                  <div className={`text-center py-12 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <DocumentTextIcon className={`h-16 w-16 mx-auto ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
                    <h3 className={`mt-4 text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-900"}`}>Aucun document trouvé</h3>
                    <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Aucun document ne correspond à vos critères de recherche.
                    </p>
                    <button
                      className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium ${
                        darkMode 
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-300" 
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => {
                        setSearchQuery("");
                        setFilterStatus("all");
                        setFilterType("all");
                        setActiveTab("all");
                      }}
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                ) : (
                  <div className={`rounded-xl overflow-hidden shadow-sm border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <div className={`${darkMode ? "bg-gray-800" : "bg-white"}`}>
                      {/* Table Header */}
                      <div className={`grid grid-cols-12 gap-4 p-4 text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-400 border-gray-700" : "text-gray-500 border-gray-200"} border-b`}>
                        <div className="col-span-4">Nom</div>
                        <div className="col-span-2">Type</div>
                        <div className="col-span-2">Client</div>
                        <div className="col-span-2">Date de mise à jour</div>
                        <div className="col-span-1">Statut</div>
                        <div className="col-span-1 text-right">Actions</div>
                      </div>
                      
                      {/* Table Body */}
                      <div className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}>
                        {filteredDocuments.map((doc) => (
                          <div 
                            key={doc.id} 
                            className={`grid grid-cols-12 gap-4 p-4 items-center ${darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"} transition-colors cursor-pointer ${doc.isAttestationIntervention ? (darkMode ? "bg-rose-900/5" : "bg-rose-50/30") : ""}`}
                            onClick={() => openDocumentDetails(doc)}
                          >
                            <div className="col-span-4 flex items-center gap-3">
                              <div className={`p-2 rounded ${
                                doc.isAttestationIntervention 
                                  ? darkMode ? "bg-rose-900/20" : "bg-rose-100" 
                                  : darkMode ? "bg-gray-700" : "bg-gray-100"
                              }`}>
                                {doc.isAttestationIntervention 
                                  ? <ClipboardDocumentCheckIcon className="h-5 w-5 text-rose-500" />
                                  : <DocumentTextIcon className="h-5 w-5 text-blue-500" />
                                }
                              </div>
                              <div>
                                <p className="font-medium truncate">{doc.name}</p>
                                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{doc.fileName} · {doc.size}</p>
                              </div>
                            </div>
                            <div className="col-span-2">
                              <DocumentTypeBadge typeId={doc.typeId} />
                            </div>
                            <div className="col-span-2">
                              {doc.clientName ? (
                                <div>
                                  <p className="text-sm font-medium truncate">{doc.clientName}</p>
                                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} truncate`}>{doc.clientEmail}</p>
                                </div>
                              ) : (
                                <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"} italic`}>Non spécifié</span>
                              )}
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm">
                                {new Date(doc.updatedAt).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric"
                                })}
                              </p>
                              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                {new Date(doc.updatedAt).toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </p>
                            </div>
                            <div className="col-span-1">
                              <div className="flex items-center gap-1.5">
                                {getStatusIcon(doc.status)}
                                <span className={`text-xs ${
                                  doc.status === "pending_signature" ? "text-yellow-500" :
                                  doc.status === "signed" ? "text-green-500" :
                                  doc.status === "to_send" ? "text-blue-500" :
                                  doc.status === "to_complete" ? "text-orange-500" :
                                  doc.status === "expired" ? "text-red-500" :
                                  darkMode ? "text-gray-400" : "text-gray-600"
                                }`}>
                                  {getStatusLabel(doc.status)}
                                </span>
                              </div>
                            </div>
                            <div className="col-span-1 flex justify-end">
                              <div className="flex space-x-1">
                                <button 
                                  className={`p-1.5 rounded ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Download functionality would go here
                                  }}
                                >
                                  <DocumentArrowDownIcon className="h-4 w-4" />
                                </button>
                                {doc.status === "to_complete" && (
                                  <button 
                                    className={`p-1.5 rounded ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openDocumentDetails(doc);
                                      setShowAttestationForm(true);
                                    }}
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Documents Grid View */}
            {viewMode === "grid" && (
              <>
                {filteredDocuments.length === 0 ? (
                  <div className={`text-center py-12 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <DocumentTextIcon className={`h-16 w-16 mx-auto ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
                    <h3 className={`mt-4 text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-900"}`}>Aucun document trouvé</h3>
                    <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Aucun document ne correspond à vos critères de recherche.
                    </p>
                    <button
                      className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium ${
                        darkMode 
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-300" 
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => {
                        setSearchQuery("");
                        setFilterStatus("all");
                        setFilterType("all");
                        setActiveTab("all");
                      }}
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredDocuments.map((doc) => (
                      <motion.div
                        key={doc.id}
                        className={`rounded-xl overflow-hidden shadow-sm border ${darkMode ? "border-gray-700" : "border-gray-200"} cursor-pointer transition-transform hover:-translate-y-1 ${doc.isAttestationIntervention ? (darkMode ? "bg-rose-900/5 border-rose-800/30" : "bg-rose-50/30 border-rose-200") : ""}`}
                        onClick={() => openDocumentDetails(doc)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Document Preview */}
                        <div className={`h-40 ${
                          doc.isAttestationIntervention 
                            ? darkMode ? "bg-rose-900/20" : "bg-rose-100/50" 
                            : darkMode ? "bg-gray-700" : "bg-gray-100"
                        } flex items-center justify-center relative`}>
                          {doc.preview ? (
                            <img 
                              src={doc.preview} 
                              alt={doc.name} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="text-center">
                              {doc.isAttestationIntervention 
                                ? <ClipboardDocumentCheckIcon className={`h-12 w-12 mx-auto ${darkMode ? "text-rose-500" : "text-rose-500"}`} />
                                : <DocumentTextIcon className={`h-12 w-12 mx-auto ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                              }
                              <span className={`text-xs mt-2 block ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Aucun aperçu</span>
                            </div>
                          )}
                          
                          {/* Status Badge */}
                          <div className="absolute top-2 right-2">
                            <div className={`flex items-center ${
                              doc.status === "pending_signature" 
                                ? "bg-yellow-500" 
                                : doc.status === "signed" 
                                  ? "bg-green-500" 
                                  : doc.status === "to_send" 
                                    ? "bg-blue-500" 
                                    : doc.status === "to_download" 
                                      ? "bg-indigo-500" 
                                      : doc.status === "to_complete" 
                                        ? "bg-orange-500" 
                                        : "bg-gray-500"
                            } text-white text-xs px-2 py-0.5 rounded-full`}>
                              {getStatusIcon(doc.status)}
                              <span className="ml-1">{getStatusLabel(doc.status)}</span>
                            </div>
                          </div>
                          
                          {/* Attestation badge if applicable */}
                          {doc.isAttestationIntervention && (
                            <div className="absolute top-2 left-2">
                              <div className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
                                Attestation
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Document Info */}
                        <div className={`p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                          <div className="mb-2">
                            <DocumentTypeBadge typeId={doc.typeId} />
                          </div>
                          <h3 className="font-medium truncate mb-1" title={doc.name}>{doc.name}</h3>
                          <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} mb-2`}>{doc.fileName}</p>
                          
                          {/* Additional Info */}
                          <div className="flex items-center justify-between text-xs mt-3">
                            <span className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                              {new Date(doc.updatedAt).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "short"
                              })}
                            </span>
                            
                            <div className="flex space-x-1">
                              <button className={`p-1.5 rounded ${darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}>
                                <DocumentArrowDownIcon className="h-4 w-4" />
                              </button>
                              {doc.status === "to_complete" && (
                                <button 
                                  className={`p-1.5 rounded ${darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDocumentDetails(doc);
                                    setShowAttestationForm(true);
                                  }}
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        </main>
        {/* Document Detail Modal */}
        <AnimatePresence>
          {selectedDocument && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30 backdrop-blur-sm">
              <motion.div
                className={`w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl shadow-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                {/* Header */}
                <div className={`p-6 ${
                  selectedDocument.isAttestationIntervention 
                    ? "bg-rose-500" 
                    : getDocumentType(selectedDocument.typeId)?.color || "bg-blue-500"
                } text-white`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm font-medium">
                          {selectedDocument.isAttestationIntervention ? "Attestation d'Intervention" : getDocumentType(selectedDocument.typeId)?.name || selectedDocument.type}
                        </span>
                        <span className={`px-2 py-0.5 ${
                          selectedDocument.status === "pending_signature" 
                            ? "bg-yellow-400/20 text-yellow-100" 
                            : selectedDocument.status === "signed" 
                              ? "bg-green-400/20 text-green-100" 
                              : selectedDocument.status === "to_send" 
                                ? "bg-blue-400/20 text-blue-100" 
                                : selectedDocument.status === "to_complete" 
                                  ? "bg-orange-400/20 text-orange-100" 
                                  : "bg-white/20"
                        } rounded-full text-xs font-medium flex items-center`}>
                          {getStatusIcon(selectedDocument.status)}
                          <span className="ml-1">{getStatusLabel(selectedDocument.status)}</span>
                        </span>
                      </div>
                      <h3 className="text-xl font-bold">{selectedDocument.name}</h3>
                      <p className="text-sm text-white/80 mt-1">{selectedDocument.fileName} · {selectedDocument.size}</p>
                    </div>
                    <button
                      onClick={closeDocumentDetails}
                      className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  {/* Attestation form for technicians to fill */}
                  {selectedDocument.isAttestationIntervention && 
                    selectedDocument.status === "to_complete" && 
                    showAttestationForm ? (
                    <div className="p-6">
                      <div className={`rounded-xl p-4 mb-6 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-medium">Encadré réservé à l&apos;équipe technique</h3>
                          <div className={`flex items-center text-xs rounded-full px-3 py-1 ${darkMode ? "bg-rose-900/20 text-rose-300" : "bg-rose-100 text-rose-800"}`}>
                            <InformationCircleIcon className="h-4 w-4 mr-1.5" />
                            Remplissez ce formulaire avant signature
                          </div>
                        </div>
                        <p className={`mb-4 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Complétez les détails de l&apos;intervention pour générer l&apos;attestation. Ce document sera ensuite à faire signer par le client.
                        </p>
                        
                        <div className="space-y-4">
                          {/* Intervention Description */}
                          <div>
                            <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Détail de l&apos;intervention
                            </label>
                            <textarea
                              className={`w-full rounded-lg border px-3 py-2 ${
                                darkMode 
                                  ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500" 
                                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-600"
                              } focus:ring-0 focus:outline-none`}
                              rows={3}
                              placeholder="Décrivez brièvement l'intervention réalisée..."
                              value={attestationFormData.interventionDescription}
                              onChange={(e) => handleAttestationFieldChange('interventionDescription', e.target.value)}
                            />
                          </div>
                          
                          {/* Work Done - Dynamic List */}
                          <div>
                            <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Travaux effectués
                            </label>
                            <div className="space-y-2">
                              {attestationFormData.workDone.map((work: string, index: number) => (
                                <div key={index} className="flex gap-2">
                                  <input
                                    type="text"
                                    className={`flex-1 rounded-lg border px-3 py-2 ${
                                      darkMode 
                                        ? "bg-gray-800 border-gray-600 text-white" 
                                        : "bg-white border-gray-300 text-gray-900"
                                    } focus:ring-0 focus:outline-none focus:border-blue-600`}
                                    placeholder="Ex: Remplacement de pièce, Test de pression..."
                                    value={work}
                                    onChange={(e) => handleArrayFieldChange('workDone', index, e.target.value)}
                                  />
                                  <button 
                                    className={`p-2 rounded-lg ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
                                    onClick={() => removeArrayItem('workDone', index)}
                                    disabled={attestationFormData.workDone.length <= 1}
                                  >
                                    <XMarkIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              ))}
                              <button 
                                className={`mt-1 text-sm font-medium flex items-center ${
                                  darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                                }`}
                                onClick={() => addArrayItem('workDone')}
                              >
                                <PlusIcon className="h-4 w-4 mr-1" />
                                Ajouter un travail
                              </button>
                            </div>
                          </div>
                          
                          {/* Materials Used - Dynamic List */}
                          <div>
                            <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Matériels utilisés
                            </label>
                            <div className="space-y-2">
                              {attestationFormData.materialsUsed.map((material: string, index: number) => (
                                <div key={index} className="flex gap-2">
                                  <input
                                    type="text"
                                    className={`flex-1 rounded-lg border px-3 py-2 ${
                                      darkMode 
                                        ? "bg-gray-800 border-gray-600 text-white" 
                                        : "bg-white border-gray-300 text-gray-900"
                                    } focus:ring-0 focus:outline-none focus:border-blue-600`}
                                    placeholder="Ex: Pompe, Vanne, Filtre..."
                                    value={material}
                                    onChange={(e) => handleArrayFieldChange('materialsUsed', index, e.target.value)}
                                  />
                                  <button 
                                    className={`p-2 rounded-lg ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
                                    onClick={() => removeArrayItem('materialsUsed', index)}
                                    disabled={attestationFormData.materialsUsed.length <= 1}
                                  >
                                    <XMarkIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              ))}
                              <button 
                                className={`mt-1 text-sm font-medium flex items-center ${
                                  darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                                }`}
                                onClick={() => addArrayItem('materialsUsed')}
                              >
                                <PlusIcon className="h-4 w-4 mr-1" />
                                Ajouter un matériel
                              </button>
                            </div>
                          </div>
                          
                          {/* Technical Notes */}
                          <div>
                            <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Notes techniques (recommandations, observations)
                            </label>
                            <textarea
                              className={`w-full rounded-lg border px-3 py-2 ${
                                darkMode 
                                  ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500" 
                                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-600"
                              } focus:ring-0 focus:outline-none`}
                              rows={2}
                              placeholder="Notez vos observations et recommandations techniques..."
                              value={attestationFormData.technicalNotes}
                              onChange={(e) => handleAttestationFieldChange('technicalNotes', e.target.value)}
                            />
                          </div>
                          
                          {/* Hours Spent */}
                          <div>
                            <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Temps passé (heures)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              className={`w-full max-w-xs rounded-lg border px-3 py-2 ${
                                darkMode 
                                  ? "bg-gray-800 border-gray-600 text-white" 
                                  : "bg-white border-gray-300 text-gray-900"
                              } focus:ring-0 focus:outline-none focus:border-blue-600`}
                              value={attestationFormData.hoursSpent}
                              onChange={(e) => handleAttestationFieldChange('hoursSpent', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Form Actions */}
                      <div className="flex justify-end gap-3">
                        <button 
                          className={`px-4 py-2.5 rounded-lg text-sm font-medium ${
                            darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          }`}
                          onClick={() => setShowAttestationForm(false)}
                        >
                          Annuler
                        </button>
                        <button 
                          className="px-4 py-2.5 rounded-lg text-sm font-medium bg-rose-500 hover:bg-rose-600 text-white flex items-center"
                          onClick={submitAttestationForm}
                        >
                          <CheckIcon className="h-4 w-4 mr-1.5" />
                          Compléter l&apos;attestation
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Regular document view
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                      {/* Left Column - Preview */}
                      <div className="md:col-span-2 space-y-6">
                        {/* Document Preview */}
                        <div className={`rounded-xl overflow-hidden border ${darkMode ? "border-gray-700" : "border-gray-200"} h-96 flex items-center justify-center ${
                          selectedDocument.isAttestationIntervention 
                            ? darkMode ? "bg-rose-900/20" : "bg-rose-100/50" 
                            : darkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}>
                          {selectedDocument.preview ? (
                            <img 
                              src={selectedDocument.preview} 
                              alt={selectedDocument.name} 
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="text-center p-6">
                              {selectedDocument.isAttestationIntervention 
                                ? <ClipboardDocumentCheckIcon className={`h-16 w-16 mx-auto ${darkMode ? "text-rose-500" : "text-rose-500"}`} />
                                : <DocumentTextIcon className={`h-16 w-16 mx-auto ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                              }
                              <p className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-500"} max-w-md mx-auto`}>
                                L&apos;aperçu de ce document n&apos;est pas disponible. Téléchargez le document pour le visualiser.
                              </p>
                              <button className={`mt-4 px-4 py-2 rounded-lg ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white font-medium flex items-center justify-center mx-auto`}>
                                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                                Télécharger
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {/* For Attestations, show details if completed */}
                        {selectedDocument.isAttestationIntervention && 
                        selectedDocument.attestationDetails && 
                        selectedDocument.status !== "to_complete" && (
                          <div className={`rounded-xl p-4 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                            <h4 className={`font-medium mb-4 flex items-center ${
                              darkMode ? "text-rose-300" : "text-rose-600"
                            }`}>
                              <ClipboardDocumentCheckIcon className="h-5 w-5 mr-2" />
                              Détails de l&apos;attestation d&apos;intervention
                            </h4>
                            
                            <div className="space-y-4">
                              <div>
                                <h5 className={`text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                  Détail de l&apos;intervention
                                </h5>
                                <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                  {selectedDocument.attestationDetails.interventionDescription}
                                </p>
                              </div>
                              
                              {selectedDocument.attestationDetails.workDone && selectedDocument.attestationDetails.workDone.length > 0 && (
                                <div>
                                  <h5 className={`text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                    Travaux effectués
                                  </h5>
                                  <ul className={`list-disc pl-5 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                    {selectedDocument.attestationDetails.workDone.map((work, idx) => (
                                      <li key={idx}>{work}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {selectedDocument.attestationDetails.materialsUsed && selectedDocument.attestationDetails.materialsUsed.length > 0 && (
                                <div>
                                  <h5 className={`text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                    Matériels utilisés
                                  </h5>
                                  <ul className={`list-disc pl-5 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                    {selectedDocument.attestationDetails.materialsUsed.map((material, idx) => (
                                      <li key={idx}>{material}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {selectedDocument.attestationDetails.technicalNotes && (
                                <div>
                                  <h5 className={`text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                    Notes techniques
                                  </h5>
                                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                    {selectedDocument.attestationDetails.technicalNotes}
                                  </p>
                                </div>
                              )}
                              
                              <div className="flex gap-8">
                                <div>
                                  <h5 className={`text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                    Temps passé
                                  </h5>
                                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                    {selectedDocument.attestationDetails.hoursSpent} heures
                                  </p>
                                </div>
                                
                                <div>
                                  <h5 className={`text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                    Technicien
                                  </h5>
                                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                    {selectedDocument.attestationDetails.completedBy || selectedDocument.technicianName}
                                  </p>
                                </div>
                                
                                <div>
                                  <h5 className={`text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                    Signatures
                                  </h5>
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center">
                                      <span className={`${
                                        selectedDocument.attestationDetails.technicianSignature 
                                          ? "text-green-500" 
                                          : "text-gray-400"
                                      } mr-1`}>
                                        {selectedDocument.attestationDetails.technicianSignature 
                                          ? <CheckIcon className="h-4 w-4" /> 
                                          : <XMarkIcon className="h-4 w-4" />
                                        }
                                      </span>
                                      <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Technicien</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className={`${
                                        selectedDocument.attestationDetails.clientSignature 
                                          ? "text-green-500" 
                                          : "text-gray-400"
                                      } mr-1`}>
                                        {selectedDocument.attestationDetails.clientSignature 
                                          ? <CheckIcon className="h-4 w-4" /> 
                                          : <XMarkIcon className="h-4 w-4" />
                                        }
                                      </span>
                                      <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Client</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Tags section */}
                        {selectedDocument.tags && selectedDocument.tags.length > 0 && (
                          <div>
                            <h4 className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedDocument.tags.map((tag, index) => (
                                <span 
                                  key={index} 
                                  className={`text-xs px-2 py-0.5 rounded-full border ${getTagColor(tag)}`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Intervention section */}
                        {selectedDocument.intervention && (
                          <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                            <h4 className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Intervention associée
                            </h4>
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-600" : "bg-white"}`}>
                                <CalendarIcon className="h-5 w-5 text-blue-500" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{selectedDocument.intervention.title}</p>
                                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  {new Date(selectedDocument.intervention.date).toLocaleDateString("fr-FR", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric"
                                  })}
                                </p>
                              </div>
                              <button className={`text-xs px-2 py-1 rounded ${darkMode ? "bg-gray-600 hover:bg-gray-500 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}>
                                Voir détails
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Right Column - Info */}
                      <div className="space-y-6">
                        {/* Client info */}
                        {selectedDocument.clientName && (
                          <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                            <h4 className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Client
                            </h4>
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{selectedDocument.clientName}</p>
                                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{selectedDocument.clientEmail}</p>
                                
                                {selectedDocument.attestationDetails && selectedDocument.attestationDetails.clientAddress && (
                                  <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    {selectedDocument.attestationDetails.clientAddress}
                                  </p>
                                )}
                              </div>
                              <div className="flex space-x-1">
                                <button className={`p-1.5 rounded ${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-white hover:bg-gray-200"}`}>
                                  <EnvelopeIcon className="h-4 w-4" />
                                </button>
                                <button className={`p-1.5 rounded ${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-white hover:bg-gray-200"}`}>
                                  <UserIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Document information */}
                        <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                          <h4 className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Informations du document
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Créé le</span>
                              <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                {new Date(selectedDocument.createdAt).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric"
                                })}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Mis à jour</span>
                              <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                {new Date(selectedDocument.updatedAt).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric"
                                })}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Taille</span>
                              <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                {selectedDocument.size}
                              </span>
                            </div>
                            {selectedDocument.signatureDate && (
                              <div className="flex justify-between">
                                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Signé le</span>
                                <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                  {new Date(selectedDocument.signatureDate).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric"
                                  })}
                                </span>
                              </div>
                            )}
                            {selectedDocument.expiryDate && (
                              <div className="flex justify-between">
                                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Expire le</span>
                                <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                  {new Date(selectedDocument.expiryDate).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric"
                                  })}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Statut</span>
                              <span className={`text-sm font-medium flex items-center ${
                                selectedDocument.status === "pending_signature" ? "text-yellow-500" :
                                selectedDocument.status === "signed" ? "text-green-500" :
                                selectedDocument.status === "to_send" ? "text-blue-500" :
                                selectedDocument.status === "to_complete" ? "text-orange-500" :
                                darkMode ? "text-gray-300" : "text-gray-700"
                              }`}>
                                {getStatusIcon(selectedDocument.status)}
                                <span className="ml-1.5">{getStatusLabel(selectedDocument.status)}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                          <h4 className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Actions
                          </h4>
                          <div className="space-y-2">
                            <button className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}>
                              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                              Télécharger
                            </button>
                            
                            {selectedDocument.status === "to_complete" && (
                              <button 
                                className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center ${darkMode ? "bg-rose-600 hover:bg-rose-700" : "bg-rose-500 hover:bg-rose-600"} text-white`}
                                onClick={toggleAttestationForm}
                              >
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Compléter l&apos;attestation
                              </button>
                            )}
                            
                            {selectedDocument.status === "to_send" && (
                              <button className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center ${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white`}>
                                <EnvelopeIcon className="h-4 w-4 mr-2" />
                                Envoyer au client
                              </button>
                            )}
                            
                            {selectedDocument.status === "pending_signature" && (
                              <button className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center ${darkMode ? "bg-yellow-600 hover:bg-yellow-700" : "bg-yellow-500 hover:bg-yellow-600"} text-white`}>
                                <ArrowPathIcon className="h-4 w-4 mr-2" />
                                Vérifier signature
                              </button>
                            )}
                            
                            <button className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center ${
                              darkMode ? "bg-gray-600 hover:bg-gray-500 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                            }`}>
                              <ShareIcon className="h-4 w-4 mr-2" />
                              Partager
                            </button>
                            
                            <button className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center ${
                              darkMode ? "bg-gray-600 hover:bg-gray-500 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                            }`}>
                              <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
                              Dupliquer
                            </button>
                            
                            <button className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center ${
                              darkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"
                            } text-white`}>
                              <TrashIcon className="h-4 w-4 mr-2" />
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        
        </div>
        
    </div>
  );
}

// Helper function to get document type from typeId
function getDocumentType(typeId: string): DocumentType | undefined {
  return documentTypes.find(t => t.id === typeId);
}

// Import for IdentificationIcon (this was missing in the original imports)
import { IdentificationIcon } from "@heroicons/react/24/outline";