"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from 'react';
import {
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TagIcon,
  MapPinIcon,
  UserIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
  XMarkIcon,
  DocumentTextIcon,
  CloudArrowDownIcon,
  ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline";
import { Header } from "@/components/Header";
import { useEffect, useState, useRef } from "react";
import { TicketIcon, Check, FileText, FileSignature } from "lucide-react";
import SignatureCanvas from 'react-signature-canvas';
import dynamic from 'next/dynamic';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PDFViewer = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFViewer), { ssr: false });

{/* Type definitions */}
interface PriorityBadgeProps {
  priority: string;
}

interface ConversationMessage {
  message: string;
  sender: string;
  timestamp: number; 
}

interface AttestationDocument {
  id: string;
  title: string;
  issueDate: string;
  expiryDate: string;
  status: "pending" | "signed" | "verified";
  issuedBy: string;
  description: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  signatureRequired: boolean;
  signedDate?: string;
  verifiedDate?: string;
  content?: string; // HTML content of the attestation for preview
}

interface StatusBadgeProps {
  status: string;
}

interface IconProps {
  className?: string;
}

// Define the type for the ticket as returned by your API.
interface ApiTicket {
  conversation: ConversationMessage[];
  _id: string;
  ticket: string;
  status: string;
  priority: string;
  contactId: string;
  customerFirstName: string;
  customerLastName: string;
  problem: string;
  notes: string;
  technicianId: string;
  technicianFirstName: string;
  technicianLastName: string;
  createdAt: string;
  end: string;
  location: string;
  participants: string;
  start: string;
  title: string;
  type: string;
  attestations?: AttestationDocument[];
}

// Define the UI ticket type.
interface Ticket {
  id: string;
  title: string;
  ticket: string;
  type: string;
  notes: string;
  location: string;
  createdAt: string | number | Date;
  start: string | number | Date;
  end: string | number | Date;
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
  attestations: AttestationDocument[];
}

// PDF Document props interface
interface AttestationPDFProps {
  attestation: AttestationDocument;
  ticketData: Ticket;
}

// Sample attestation data
const sampleAttestations: AttestationDocument[] = [
  {
    id: "att-001",
    title: "Attestation d'intervention technique",
    issueDate: "2025-03-15",
    expiryDate: "2025-06-15",
    status: "pending",
    issuedBy: "Service Technique",
    description: "Attestation d'intervention suite à réparation du système de chauffage",
    fileName: "attestation_intervention_technique.pdf",
    fileType: "PDF",
    fileSize: "1.2 MB",
    signatureRequired: true,
    content: `
      <div style="font-family: Arial, sans-serif;">
        <h1 style="text-align: center; color: #213f5b;">ATTESTATION D'INTERVENTION TECHNIQUE</h1>
        <div style="text-align: right;">
          <p>Date: 15/03/2025</p>
          <p>Référence: ATT-001-2025</p>
        </div>
        <div style="margin-top: 30px;">
          <p>Je soussigné(e), [PRÉNOM NOM], certifie que l'intervention technique a été réalisée le 15/03/2025 à l'adresse suivante : </p>
          <p style="font-weight: bold; margin: 15px 0;">[ADRESSE COMPLÈTE]</p>
          <p>Type d'intervention : Réparation du système de chauffage</p>
          <p>Détails des opérations effectuées :</p>
          <ul>
            <li>Diagnostic du dysfonctionnement</li>
            <li>Remplacement des pièces défectueuses</li>
            <li>Test de fonctionnement</li>
            <li>Mise en service</li>
          </ul>
          <p>Cette attestation est valable jusqu'au 15/06/2025.</p>
          <div style="margin-top: 50px;">
            <p>Signature du technicien:</p>
            <div style="border-bottom: 1px solid #000; height: 40px; width: 200px;"></div>
            <p>Signature du client:</p>
            <div style="border-bottom: 1px solid #000; height: 40px; width: 200px;"></div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: "att-002",
    title: "Certificat de conformité",
    issueDate: "2025-03-10",
    expiryDate: "2026-03-10",
    status: "signed",
    issuedBy: "Département Qualité",
    description: "Certificat attestant de la conformité de l'installation aux normes en vigueur",
    fileName: "certificat_conformite.pdf",
    fileType: "PDF",
    fileSize: "0.8 MB",
    signatureRequired: true,
    signedDate: "2025-03-12",
    content: `
      <div style="font-family: Arial, sans-serif;">
        <h1 style="text-align: center; color: #213f5b;">CERTIFICAT DE CONFORMITÉ</h1>
        <div style="text-align: right;">
          <p>Date: 10/03/2025</p>
          <p>Référence: CERT-002-2025</p>
        </div>
        <div style="margin-top: 30px;">
          <p>Je soussigné(e), [PRÉNOM NOM], certifie que l'installation réalisée le 10/03/2025 à l'adresse suivante : </p>
          <p style="font-weight: bold; margin: 15px 0;">[ADRESSE COMPLÈTE]</p>
          <p>Est conforme aux normes en vigueur et spécifications techniques requises.</p>
          <p>Type d'installation : Système énergétique</p>
          <p>Normes appliquées :</p>
          <ul>
            <li>NF C 15-100 pour les installations électriques</li>
            <li>RT 2020 pour les performances énergétiques</li>
            <li>Directive européenne 2009/28/CE</li>
          </ul>
          <p>Ce certificat est valable jusqu'au 10/03/2026.</p>
          <div style="margin-top: 50px;">
            <p>Signature du technicien:</p>
            <div style="border-bottom: 1px solid #000; height: 40px; width: 200px;"></div>
            <p>Signature du client:</p>
            <div style="border-bottom: 1px solid #000; height: 40px; width: 200px;"></div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: "att-003",
    title: "Rapport de maintenance préventive",
    issueDate: "2025-02-20",
    expiryDate: "2025-08-20",
    status: "verified",
    issuedBy: "Service Maintenance",
    description: "Rapport détaillant les opérations de maintenance préventive effectuées",
    fileName: "rapport_maintenance.pdf",
    fileType: "PDF",
    fileSize: "1.5 MB",
    signatureRequired: true,
    signedDate: "2025-02-22",
    verifiedDate: "2025-02-25",
    content: `
      <div style="font-family: Arial, sans-serif;">
        <h1 style="text-align: center; color: #213f5b;">RAPPORT DE MAINTENANCE PRÉVENTIVE</h1>
        <div style="text-align: right;">
          <p>Date: 20/02/2025</p>
          <p>Référence: RPT-003-2025</p>
        </div>
        <div style="margin-top: 30px;">
          <p>Je soussigné(e), [PRÉNOM NOM], certifie que la maintenance préventive a été réalisée le 20/02/2025 à l'adresse suivante : </p>
          <p style="font-weight: bold; margin: 15px 0;">[ADRESSE COMPLÈTE]</p>
          <p>Type de maintenance : Préventive complète</p>
          <p>Équipements vérifiés :</p>
          <ul>
            <li>Système de chauffage</li>
            <li>Ventilation</li>
            <li>Isolation thermique</li>
            <li>Tableau électrique</li>
          </ul>
          <p>Recommandations :</p>
          <ol>
            <li>Planifier le remplacement du filtre d'ici 3 mois</li>
            <li>Surveiller le niveau de pression du circuit</li>
            <li>Prochaine maintenance complète dans 6 mois</li>
          </ol>
          <p>Ce rapport est valable jusqu'au 20/08/2025.</p>
          <div style="margin-top: 50px;">
            <p>Signature du technicien:</p>
            <div style="border-bottom: 1px solid #000; height: 40px; width: 200px;"></div>
            <p>Signature du client:</p>
            <div style="border-bottom: 1px solid #000; height: 40px; width: 200px;"></div>
          </div>
        </div>
      </div>
    `
  }
];

// Sample API tickets to use instead of real API data
const sampleApiTickets: ApiTicket[] = [
  {
    _id: "sample-123",
    ticket: "SAV-2025-0123",
    status: "in progress",
    priority: "medium",
    contactId: "contact-123",
    customerFirstName: "Marie",
    customerLastName: "Dubois",
    problem: "Dysfonctionnement du système de chauffage",
    notes: "Le client signale que son système de chauffage ne fonctionne pas correctement depuis 3 jours. La température ne monte pas au-dessus de 17°C malgré les réglages.",
    technicianId: "tech-456",
    technicianFirstName: "Thomas",
    technicianLastName: "Martin",
    createdAt: "2025-03-10T09:30:00Z",
    end: "2025-03-18T16:00:00Z",
    location: "15 Rue des Fleurs, 75001 Paris, France",
    participants: "Thomas Martin, Marie Dubois",
    start: "2025-03-15T14:00:00Z",
    title: "Réparation système de chauffage",
    type: "Intervention technique",
    conversation: [
      {
        message: "Bonjour, je confirme ma disponibilité pour l'intervention ce samedi.",
        sender: "technicien",
        timestamp: Date.now() - 86400000 * 3
      },
      {
        message: "Parfait, je serai présent. Merci de votre réactivité.",
        sender: "client",
        timestamp: Date.now() - 86400000 * 2
      }
    ],
    attestations: [sampleAttestations[0], sampleAttestations[1]] // First two attestations
  },
  {
    _id: "sample-124",
    ticket: "SAV-2025-0124",
    status: "open",
    priority: "high",
    contactId: "contact-123",
    customerFirstName: "Jean",
    customerLastName: "Michel",
    problem: "Panne électrique dans tout l'appartement",
    notes: "Le client signale une coupure totale d'électricité dans son appartement depuis ce matin. Il a vérifié le disjoncteur principal qui semble fonctionnel.",
    technicianId: "tech-789",
    technicianFirstName: "Sophie",
    technicianLastName: "Leclerc",
    createdAt: "2025-03-15T11:45:00Z",
    end: "2025-03-16T18:00:00Z",
    location: "8 Avenue Victor Hugo, 75016 Paris, France",
    participants: "Sophie Leclerc, Jean Michel",
    start: "2025-03-16T15:00:00Z",
    title: "Dépannage électrique urgent",
    type: "Intervention d'urgence",
    conversation: [
      {
        message: "Bonjour, suite à votre appel, je peux intervenir demain à 15h.",
        sender: "technicien",
        timestamp: Date.now() - 86400000 * 1
      },
      {
        message: "Merci beaucoup, c'est urgent car nous n'avons plus d'électricité du tout.",
        sender: "client",
        timestamp: Date.now() - 86400000 * 1 + 3600000
      },
      {
        message: "Je comprends l'urgence. Avez-vous essayé de vérifier le tableau électrique?",
        sender: "technicien",
        timestamp: Date.now() - 86400000 * 1 + 3900000
      },
      {
        message: "Oui, j'ai vérifié et réarmé tous les disjoncteurs, sans résultat.",
        sender: "client",
        timestamp: Date.now() - 86400000 * 1 + 4200000
      }
    ],
    attestations: [] // No attestations for this ticket
  },
  {
    _id: "sample-125",
    ticket: "SAV-2025-0125",
    status: "closed",
    priority: "low",
    contactId: "contact-123",
    customerFirstName: "Laure",
    customerLastName: "Dupont",
    problem: "Configuration du thermostat intelligent",
    notes: "La cliente a récemment fait installer un thermostat intelligent et souhaite une assistance pour sa configuration correcte et optimisation énergétique.",
    technicianId: "tech-101",
    technicianFirstName: "Antoine",
    technicianLastName: "Bernard",
    createdAt: "2025-03-05T10:00:00Z",
    end: "2025-03-08T11:30:00Z",
    location: "25 Rue de la République, 69002 Lyon, France",
    participants: "Antoine Bernard, Laure Dupont",
    start: "2025-03-08T10:00:00Z",
    title: "Configuration thermostat intelligent",
    type: "Assistance technique",
    conversation: [
      {
        message: "Bonjour Madame Dupont, je serai chez vous ce samedi à 10h pour la configuration de votre thermostat.",
        sender: "technicien",
        timestamp: Date.now() - 86400000 * 10
      },
      {
        message: "Merci beaucoup, j'ai hâte de pouvoir utiliser ce nouveau système correctement.",
        sender: "client",
        timestamp: Date.now() - 86400000 * 9
      },
      {
        message: "L'intervention a été réalisée avec succès. Je vous ai envoyé par email un guide d'utilisation.",
        sender: "technicien",
        timestamp: Date.now() - 86400000 * 7
      },
      {
        message: "Merci pour votre intervention efficace et le guide! Tout fonctionne parfaitement maintenant.",
        sender: "client",
        timestamp: Date.now() - 86400000 * 7 + 3600000
      }
    ],
    attestations: [sampleAttestations[2]] // Third attestation for this ticket
  }
];

// PDF document styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    color: '#213f5b',
    marginBottom: 20,
  },
  subheader: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  reference: {
    fontSize: 10,
    marginTop: 5,
    color: '#666',
  },
  signatureSection: {
    marginTop: 30,
    borderTop: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  signatureLine: {
    borderBottom: 1,
    borderBottomColor: '#000',
    width: 200,
    marginTop: 40,
    marginBottom: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#666',
    borderTop: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
    fontSize: 10,
  },
});

// PDF attestation document
const AttestationnPDF: React.FC<AttestationPDFProps> = ({ attestation, ticketData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>{attestation.title}</Text>
        <Text style={styles.reference}>Référence: {attestation.id} - Date: {new Date(attestation.issueDate).toLocaleDateString('fr-FR')}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.subheader}>Informations du client</Text>
        <Text style={styles.text}>Nom: {ticketData.customerFirstName} {ticketData.customerLastName}</Text>
        <Text style={styles.text}>Adresse: {ticketData.location}</Text>
        <Text style={styles.text}>Numéro de ticket: {ticketData.ticketNumber}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.subheader}>Détails de l&apos;attestation</Text>
        <Text style={styles.text}>{attestation.description}</Text>
        <Text style={styles.text}>Délivré par: {attestation.issuedBy}</Text>
        <Text style={styles.text}>Validité: du {new Date(attestation.issueDate).toLocaleDateString('fr-FR')} au {new Date(attestation.expiryDate).toLocaleDateString('fr-FR')}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.subheader}>Nature de l&apos;intervention</Text>
        <Text style={styles.text}>Type: {ticketData.type}</Text>
        <Text style={styles.text}>Problème: {ticketData.problem}</Text>
        <Text style={styles.text}>Solution: {ticketData.solution}</Text>
      </View>
      
      <View style={styles.signatureSection}>
        <Text style={styles.text}>Signature du technicien:</Text>
        <View style={styles.signatureLine}></View>
        <Text style={styles.text}>Nom du technicien: {ticketData.technicianFirstName} {ticketData.technicianLastName}</Text>
        
        <Text style={[styles.text, { marginTop: 20 }]}>Signature du client:</Text>
        <View style={styles.signatureLine}></View>
        <Text style={styles.text}>Nom du client: {ticketData.customerFirstName} {ticketData.customerLastName}</Text>
      </View>
      
      <View style={styles.footer}>
        <Text>Ce document a été généré automatiquement et fait office d&apos;attestation d&apos;intervention.</Text>
        <Text>Pour toute question, veuillez contacter notre service après-vente.</Text>
      </View>
    </Page>
  </Document>
);

// Transformation function to convert an API ticket into the UI ticket.
function transformTicket(realTicket: ApiTicket): Ticket {
  return {
    id: realTicket._id,
    title: realTicket.title,
    ticket: realTicket.ticket,
    type: realTicket.type,
    conversation: realTicket.conversation,
    ticketNumber: realTicket.ticket,
    problem: realTicket.problem,
    location: realTicket.location,
    notes: realTicket.notes,
    technicianFirstName: realTicket.technicianFirstName,
    technicianLastName: realTicket.technicianLastName,
    customerFirstName: realTicket.customerFirstName,
    customerLastName: realTicket.customerLastName,
    createdAt: realTicket.createdAt,
    start: realTicket.start,
    end: realTicket.end,
    participants: realTicket.participants,
    subject: realTicket.title || realTicket.problem,
    solution: realTicket.type || "",
    status:
      realTicket.status === "closed"
        ? "Fermé"
        : realTicket.status === "in progress"
        ? "En cours"
        : "Ouvert",
    priority:
      realTicket.priority === "low"
        ? "Faible"
        : realTicket.priority === "medium"
        ? "Moyenne"
        : "Haute",
    createdDate: realTicket.createdAt
      ? new Date(realTicket.createdAt).toLocaleDateString("fr-FR")
      : "",
    description: realTicket.notes,
    lastUpdate: realTicket.end
      ? new Date(realTicket.end).toLocaleString("fr-FR")
      : "",
    attestations: realTicket.attestations || [], // Initialize with empty array if none provided
  };
}

const statusOptions = ["Tous", "Ouvert", "En cours", "Fermé"];
const priorityOptions = ["Tous", "Haute", "Moyenne", "Faible"];

{/* Component for Priority Badge */}
const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getPriorityColor = (priority: string): string => {
    switch (priority.toLowerCase()) {
      case 'haute':
      case 'high':
      case 'urgent':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
      case 'moyenne':
      case 'medium':
      case 'normal':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
      case 'basse':
      case 'low':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(priority)}`}>
      {priority}
    </span>
  );
};

{/* Component for Status Badge */}
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'ouvert':
      case 'open':
      case 'nouveau':
      case 'new':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
      case 'en cours':
      case 'in progress':
        return 'bg-purple-500/20 text-purple-600 dark:text-purple-400';
      case 'résolu':
      case 'resolved':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
      case 'fermé':
      case 'closed':
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
      case 'attente':
      case 'waiting':
      case 'pending':
        return 'bg-orange-500/20 text-orange-600 dark:text-orange-400';
      default:
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

{/* Icons - simplified versions for the example */}
const ExclamationCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CalendarIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function SAV() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Tous");
  const [selectedPriority, setSelectedPriority] = useState("Tous");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [mapType, setMapType] = useState('roadmap');
  const [activeTab, setActiveTab] = useState('details');
  const [showNewBadge, setShowNewBadge] = useState(true);
  const [selectedAttestation, setSelectedAttestation] = useState<AttestationDocument | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const signaturePadRef = useRef<SignatureCanvas | null>(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  
  // Simulate having new attestations
  useEffect(() => {
    // This will hide the "NEW" badge after 10 seconds
    const timer = setTimeout(() => setShowNewBadge(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  // Hide the welcome message after 5 seconds.
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Use sample data instead of API call
  useEffect(() => {
    // Transform the sample data
    const transformedTickets = sampleApiTickets.map(transformTicket);
    setTickets(transformedTickets);
  }, []);

  // Filter tickets based on search query, status, and priority.
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "Tous" || ticket.status === selectedStatus;
    const matchesPriority = selectedPriority === "Tous" || ticket.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: string): string => {
    const baseStyle = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case "Fermé":
        return `${baseStyle} bg-[#d2fcb2]/50 text-[#213f5b]`;
      case "En cours":
        return `${baseStyle} bg-[#bfddf9]/50 text-[#213f5b]`;
      default:
        return `${baseStyle} bg-white border border-[#213f5b]/20 text-[#213f5b]`;
    }
  };

  const getPriorityIcon = (priority: string) => {
    const iconStyle = "h-5 w-5";
    switch (priority) {
      case "Haute":
        return <ExclamationTriangleIcon className={`${iconStyle} text-red-600`} />;
      case "Moyenne":
        return <InformationCircleIcon className={`${iconStyle} text-[#213f5b]`} />;
      default:
        return <CheckCircleIcon className={`${iconStyle} text-[#213f5b]`} />;
    }
  };
  
  const getAttestationStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            En attente
          </span>
        );
      case 'signed':
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Signé
          </span>
        );
      case 'verified':
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Vérifié
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            Inconnu
          </span>
        );
    }
  };
  
  const handleSignAttestation = (attestation: AttestationDocument) => {
    setSelectedAttestation(attestation);
    setShowSignatureModal(true);
  };
  
  const handleSignatureSubmit = () => {
    if (signaturePadRef.current?.isEmpty()) {
      toast.error('Veuillez signer le document avant de soumettre');
      return;
    }
    
    // In a real app, here we would save the signature data, update the attestation status, etc.
    // For this demo, we'll just update the local state
    if (selectedTicket && selectedAttestation) {
      const updatedTickets = tickets.map(ticket => {
        if (ticket.id === selectedTicket.id) {
          const updatedAttestations = ticket.attestations.map(att => {
            if (att.id === selectedAttestation.id) {
              return {
                ...att,
                status: 'signed' as 'pending' | 'signed' | 'verified',
                signedDate: new Date().toISOString()
              };
            }
            return att;
          });
          
          return {
            ...ticket,
            attestations: updatedAttestations
          };
        }
        return ticket;
      });
      
      setTickets(updatedTickets);
      
      // Also update the selected ticket if it's open
      if (selectedTicket) {
        const updatedAttestations = selectedTicket.attestations.map(att => {
          if (att.id === selectedAttestation.id) {
            return {
              ...att,
              status: 'signed' as 'pending' | 'signed' | 'verified',
              signedDate: new Date().toISOString()
            };
          }
          return att;
        });
        
        setSelectedTicket({
          ...selectedTicket,
          attestations: updatedAttestations
        });
      }
      
      setShowSignatureModal(false);
      toast.success('Document signé avec succès !');
    }
  };
  
  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  };

  const handlePreviewPdf = (attestation: AttestationDocument) => {
    setSelectedAttestation(attestation);
    setShowPdfPreview(true);
  };
  
  const hasUnsignedAttestations = (ticket: Ticket): boolean => {
    return ticket.attestations && ticket.attestations.some(att => att.status === 'pending');
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        {/* Toast container for notifications */}
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <main
          className="flex-1 overflow-y-auto px-8 py-6 space-y-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(191,221,249,0.1) 0%, rgba(210,252,178,0.05) 100%)",
          }}
        >
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#213f5b] to-[#213f5b]/80 text-white shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0, padding: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Support Technique Énergétique</h2>
                    <p className="text-[#bfddf9]">
                      Notre équipe est à votre disposition pour toutes demandes d&apos;assistance
                    </p>
                  </div>
                  <button
                    onClick={() => setShowWelcome(false)}
                    className="text-white opacity-80 hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center mb-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-[#213f5b]">Service Après-Vente</h1>
              <p className="text-gray-600">Gestion des demandes d&apos;assistance technique</p>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-[#213f5b] text-white rounded-lg shadow hover:shadow-md hover:bg-[#213f5b]/90 flex items-center gap-2"
            >
              Nouveau Ticket
              <ChevronRightIcon className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Filters Section */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-[#213f5b]/70" />
              <input
                type="text"
                placeholder="Rechercher un ticket..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#bfddf9]/30 focus:outline-none focus:ring-2 focus:ring-[#213f5b]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <FunnelIcon className="h-5 w-5 absolute left-3 top-3 text-[#213f5b]/70" />
              <select
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#bfddf9]/30 text-[#213f5b] focus:outline-none focus:ring-2 focus:ring-[#213f5b]"
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
              <TagIcon className="h-5 w-5 absolute left-3 top-3 text-[#213f5b]/70" />
              <select
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#bfddf9]/30 text-[#213f5b] focus:outline-none focus:ring-2 focus:ring-[#213f5b]"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                {priorityOptions.map((option) => (
                  <option key={option} value={option}>
                    Priorité: {option}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Tickets List */}
          <motion.div className="space-y-4">
            <AnimatePresence>
              {filteredTickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.005 }}
                  transition={{ duration: 0.2 }}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-[#bfddf9]/20 hover:border-[#d2fcb2]/50 transition-all"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-[#bfddf9]/30 rounded-lg relative">
                          <ChatBubbleLeftRightIcon className="h-8 w-8 text-[#213f5b]" />
                          {/* Notification badge for new attestations */}
                          {hasUnsignedAttestations(ticket) && showNewBadge && (
                            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white animate-pulse">
                              !
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-[#213f5b] flex items-center gap-2">
                            {ticket.subject}
                            {hasUnsignedAttestations(ticket) && showNewBadge && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full animate-pulse">
                                Attestation à signer
                              </span>
                            )}
                          </h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className={getStatusBadge(ticket.status)}>
                              {ticket.status}
                            </span>
                            <span className="flex items-center gap-1 px-3 py-1 bg-[#213f5b]/10 rounded-full text-sm text-[#213f5b]">
                              {getPriorityIcon(ticket.priority)}
                              {ticket.priority}
                            </span>
                            {ticket.attestations && ticket.attestations.length > 0 && (
                              <span className="flex items-center gap-1 px-3 py-1 bg-[#213f5b]/10 rounded-full text-sm text-[#213f5b]">
                                <DocumentTextIcon className="h-4 w-4" />
                                {ticket.attestations.length} attestation{ticket.attestations.length > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedTicket(ticket)}
                        className="px-4 py-2 bg-[#213f5b] text-white rounded-lg flex items-center gap-2 hover:bg-[#213f5b]/90 text-sm"
                      >
                        Détails
                        <ChevronRightIcon className="h-4 w-4" />
                      </motion.button>
                    </div>

                    <div className="mt-4 pl-14 space-y-2 text-sm text-[#213f5b]/80">
                      <p>{ticket.description}</p>
                      <div className="flex flex-wrap gap-4 mt-3">
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>Créé le {ticket.createdDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TagIcon className="h-4 w-4" />
                          <span>{ticket.problem}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>
                            Dernière mise à jour:{" "}
                            {ticket.lastUpdate
                              ? ticket.lastUpdate
                              : "Aucune mise à jour récente"}
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
          {filteredTickets.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="mx-auto max-w-md">
                <ChatBubbleLeftRightIcon className="h-20 w-20 text-[#213f5b]/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#213f5b]">
                  Aucun ticket trouvé
                </h3>
                <p className="mt-2 text-[#213f5b]/70">
                  Essayez d&apos;ajuster vos filtres de recherche
                </p>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Enhanced Modal for Ticket Details */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop with improved blur effect */}
            <motion.div 
              className="absolute inset-0 bg-black/60 backdrop-blur-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedTicket(null)}
            />
            
            <motion.div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl relative z-10 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with enhanced gradient background */}
              <div className="bg-gradient-to-r from-[#0f2947] via-[#1a365d] to-[#2c4f76] p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                    <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                      <circle id="pattern-circle" cx="20" cy="20" r="4" fill="#fff"></circle>
                    </pattern>
                    <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
                  </svg>
                </div>
                
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/15 p-2.5 rounded-xl shadow-sm backdrop-blur-sm">
                      <TicketIcon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white truncate">
                      {selectedTicket.subject || selectedTicket.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="text-white hover:text-[#d2fcb2] transition-colors focus:outline-none focus:ring-2 focus:ring-[#bfddf9] focus:ring-offset-2 focus:ring-offset-[#213f5b] rounded-full p-1"
                    aria-label="Close"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="bg-white/20 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10 shadow-sm">
                    #{selectedTicket.ticketNumber || selectedTicket.ticket}
                  </span>
                  <PriorityBadge priority={selectedTicket.priority} />
                  <StatusBadge status={selectedTicket.status} />
                  <span className="flex items-center text-white/90 text-sm ml-auto backdrop-blur-sm bg-white/10 px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    {new Date(selectedTicket.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 overflow-x-auto hide-scrollbar">
                <button 
                  className={`px-6 py-4 font-medium text-sm flex items-center gap-2 transition-colors border-b-2 ${
                    activeTab === 'details' 
                    ? 'text-[#1a365d] border-[#1a365d]' 
                    : 'text-gray-500 border-transparent hover:text-[#1a365d] hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('details')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Détails
                </button>
                
                <button 
                  className={`px-6 py-4 font-medium text-sm flex items-center gap-2 transition-colors border-b-2 ${
                    activeTab === 'conversation' 
                    ? 'text-[#1a365d] border-[#1a365d]' 
                    : 'text-gray-500 border-transparent hover:text-[#1a365d] hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('conversation')}
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  Conversation
                </button>
                
                <button 
                  className={`px-6 py-4 font-medium text-sm flex items-center gap-2 transition-colors border-b-2 relative ${
                    activeTab === 'attestations' 
                    ? 'text-[#1a365d] border-[#1a365d]' 
                    : 'text-gray-500 border-transparent hover:text-[#1a365d] hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('attestations')}
                >
                  <FileText className="h-5 w-5" />
                  Attestations
                  {hasUnsignedAttestations(selectedTicket) && showNewBadge && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white animate-pulse">
                      !
                    </span>
                  )}
                </button>
                
                <button 
                  className={`px-6 py-4 font-medium text-sm flex items-center gap-2 transition-colors border-b-2 ${
                    activeTab === 'location' 
                    ? 'text-[#1a365d] border-[#1a365d]' 
                    : 'text-gray-500 border-transparent hover:text-[#1a365d] hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('location')}
                >
                  <MapPinIcon className="h-5 w-5" />
                  Localisation
                </button>
              </div>
              
              {/* Content with refined design */}
              <div className="max-h-[70vh] overflow-y-auto bg-gray-50">
                {/* Tab content: Details */}
                {activeTab === 'details' && (
                  <div className="p-6 space-y-6 bg-white">
                    <div className="flex items-center space-x-3 mb-5 pb-2 border-b border-gray-100">
                      <DocumentTextIcon className="h-5 w-5 text-[#1a365d]" />
                      <h3 className="text-lg font-semibold text-gray-800">Détails du Ticket</h3>
                    </div>
                    
                    {/* Information Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Problem Card - Redesigned */}
                      <div className="bg-gradient-to-br from-[#bfddf9]/10 to-[#bfddf9]/5 p-5 rounded-2xl border border-[#bfddf9]/30 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-start gap-4">
                          <div className="bg-gradient-to-br from-[#1a365d] to-[#213f5b] rounded-full p-3 shadow-md flex-shrink-0">
                            <ExclamationCircleIcon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-[#1a365d] font-semibold text-lg flex items-center">
                              Problème
                              <span className="ml-2 text-xs bg-[#1a365d]/10 text-[#1a365d] px-2 py-0.5 rounded-full">Signalé</span>
                            </h3>
                            <div className="text-gray-700 mt-3 p-3 bg-white/80 rounded-xl border border-[#bfddf9]/20">
                              {selectedTicket.problem}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Solution Card - Redesigned */}
                      <div className="bg-gradient-to-br from-[#d2fcb2]/15 to-[#d2fcb2]/5 p-5 rounded-2xl border border-[#d2fcb2]/30 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-start gap-4">
                          <div className="bg-gradient-to-br from-[#2e5e3a] to-[#3d7a4c] rounded-full p-3 shadow-md flex-shrink-0">
                            <CheckCircleIcon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-[#2e5e3a] font-semibold text-lg flex items-center">
                              Solution / Type
                              <span className="ml-2 text-xs bg-[#2e5e3a]/10 text-[#2e5e3a] px-2 py-0.5 rounded-full">Proposé</span>
                            </h3>
                            <div className="text-gray-700 mt-3 p-3 bg-white/80 rounded-xl border border-[#d2fcb2]/20">
                              {selectedTicket.solution || selectedTicket.type || "Aucun type défini pour ce ticket."}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Notes Card - Redesigned */}
                    <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-full p-3 shadow-md flex-shrink-0">
                          <DocumentTextIcon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-gray-700 font-semibold text-lg flex items-center">
                            Notes
                            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Informations</span>
                          </h3>
                          <div className="text-gray-700 mt-3 p-3 bg-white rounded-xl border border-gray-200 whitespace-pre-line">
                            {selectedTicket.description || selectedTicket.notes || "Aucune note disponible."}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Timeline Card - Redesigned */}
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <h3 className="flex items-center text-[#1a365d] font-semibold text-lg mb-5 pb-2 border-b border-gray-100">
                        <CalendarIcon className="h-5 w-5 mr-2" /> Chronologie
                      </h3>
                      
                      <div className="space-y-5">
                        <div className="relative pl-8 before:content-[''] before:absolute before:left-3 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-[#bfddf9] before:to-[#bfddf9]/30">
                          <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-gradient-to-br from-[#bfddf9] to-[#8cb8d8] shadow-md flex items-center justify-center">
                            <CalendarIcon className="h-3 w-3 text-white" />
                          </div>
                          <div className="bg-white/50 p-3 rounded-xl border border-[#bfddf9]/20">
                            <p className="text-sm font-medium text-[#1a365d]">Créé le</p>
                            <p className="text-sm text-gray-700">
                              {selectedTicket.createdDate || new Date(selectedTicket.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative pl-8 before:content-[''] before:absolute before:left-3 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-[#bfddf9]/30 before:to-[#d2fcb2]">
                          <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-gradient-to-br from-[#d2fcb2] to-[#a5e08d] shadow-md flex items-center justify-center">
                            <ClockIcon className="h-3 w-3 text-[#2e5e3a]" />
                          </div>
                          <div className="bg-white/50 p-3 rounded-xl border border-[#d2fcb2]/20">
                            <p className="text-sm font-medium text-[#2e5e3a]">Rendez-vous</p>
                            <p className="text-sm text-gray-700">
                              {selectedTicket.start && selectedTicket.end 
                                ? `${new Date(selectedTicket.start).toLocaleString('fr-FR')} - ${new Date(selectedTicket.end).toLocaleTimeString('fr-FR')}`
                                : "Aucun rendez-vous planifié"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative pl-8">
                          <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-gradient-to-br from-[#1a365d] to-[#213f5b] shadow-md flex items-center justify-center">
                            <UserIcon className="h-3 w-3 text-white" />
                          </div>
                          <div className="bg-white/50 p-3 rounded-xl border border-[#1a365d]/10">
                            <p className="text-sm font-medium text-[#1a365d]">Participants</p>
                            <p className="text-sm text-gray-700">
                              {selectedTicket.participants || `${selectedTicket.technicianFirstName} ${selectedTicket.technicianLastName} & ${selectedTicket.customerFirstName} ${selectedTicket.customerLastName}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Tab content: Conversation */}
                {activeTab === 'conversation' && (
                  <div className="bg-gray-50">
                    {selectedTicket.conversation && selectedTicket.conversation.length > 0 ? (
                      <div className="bg-white rounded-b-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                        <div className="max-h-96 overflow-y-auto p-4 bg-gray-50 space-y-4">
                          {selectedTicket.conversation.map((msg, index) => {
                            if (!msg.message || !msg.sender) return null;
                            
                            const isTechnician = msg.sender === "technicien";
                            return (
                              <div key={index} className={`flex ${isTechnician ? 'justify-start' : 'justify-end'}`}>
                                <div className={`relative max-w-xs sm:max-w-sm rounded-2xl px-4 py-3 ${
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
                                      <div className="h-5 w-5 rounded-full bg-[#1a365d] flex items-center justify-center flex-shrink-0">
                                        <UserIcon className="h-3 w-3 text-white" />
                                      </div>
                                    )}
                                    <span>
                                      {isTechnician 
                                        ? `${selectedTicket.technicianFirstName} ${selectedTicket.technicianLastName}` 
                                        : `${selectedTicket.customerFirstName} ${selectedTicket.customerLastName}`}
                                    </span>
                                    {!isTechnician && (
                                      <div className="h-5 w-5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                        <UserIcon className="h-3 w-3 text-[#1a365d]" />
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-sm">{msg.message}</p>
                                  <div className={`text-xs text-right mt-1 ${isTechnician ? 'text-gray-500' : 'text-white/75'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="p-4 border-t border-gray-100 bg-white">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 relative rounded-xl border border-gray-200 overflow-hidden hover:border-[#1a365d]/30 focus-within:border-[#1a365d] transition-colors shadow-sm">
                              <input 
                                type="text" 
                                placeholder="Tapez votre message..." 
                                className="flex-1 w-full px-4 py-3 focus:outline-none focus:ring-0 bg-transparent" 
                              />
                              <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#1a365d] text-white p-2 rounded-lg hover:bg-[#213f5b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:ring-offset-2">
                                <PaperAirplaneIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-16 px-4">
                        <div className="mx-auto max-w-md">
                          <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-700">Aucun message</h3>
                          <p className="mt-2 text-gray-500">Cette conversation ne contient pas encore de messages.</p>
                          
                          <div className="mt-6">
                            <div className="flex-1 relative rounded-xl border border-gray-200 overflow-hidden hover:border-[#1a365d]/30 focus-within:border-[#1a365d] transition-colors shadow-sm">
                              <input 
                                type="text" 
                                placeholder="Démarrer une conversation..." 
                                className="flex-1 w-full px-4 py-3 focus:outline-none focus:ring-0 bg-transparent" 
                              />
                              <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#1a365d] text-white p-2 rounded-lg hover:bg-[#213f5b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:ring-offset-2">
                                <PaperAirplaneIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Tab content: Attestations - NEW */}
                {activeTab === 'attestations' && (
                  <div className="p-6 space-y-6 bg-white">
                    <div className="flex justify-between items-center mb-5 pb-2 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-[#1a365d]" />
                        <h3 className="text-lg font-semibold text-gray-800">Attestations et documents officiels</h3>
                      </div>
                    </div>
                    
                    {selectedTicket.attestations && selectedTicket.attestations.length > 0 ? (
                      <div className="space-y-4">
                        {selectedTicket.attestations.map((attestation) => (
                          <div 
                            key={attestation.id}
                            className={`bg-white rounded-xl border ${
                              attestation.status === 'pending' 
                                ? 'border-amber-200 shadow-amber-100/50'
                                : attestation.status === 'signed'
                                ? 'border-blue-200 shadow-blue-100/50'
                                : 'border-green-200 shadow-green-100/50'
                            } shadow-lg overflow-hidden transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl`}
                          >
                            <div className={`p-4 ${
                              attestation.status === 'pending' 
                                ? 'bg-amber-50/50' 
                                : attestation.status === 'signed'
                                ? 'bg-blue-50/50'
                                : 'bg-green-50/50'
                            } border-b border-gray-100 flex justify-between items-center`}>
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${
                                  attestation.status === 'pending' 
                                    ? 'bg-amber-100 text-amber-700' 
                                    : attestation.status === 'signed'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-green-100 text-green-700'
                                }`}>
                                  {attestation.status === 'pending' ? (
                                    <FileText className="h-5 w-5" />
                                  ) : attestation.status === 'signed' ? (
                                    <FileSignature className="h-5 w-5" />
                                  ) : (
                                    <Check className="h-5 w-5" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-800">{attestation.title}</h4>
                                  <p className="text-sm text-gray-500">
                                    Émis le {new Date(attestation.issueDate).toLocaleDateString('fr-FR')} • 
                                    Valide jusqu&apos;au {new Date(attestation.expiryDate).toLocaleDateString('fr-FR')}
                                  </p>
                                </div>
                              </div>
                              
                              <div>
                                {getAttestationStatusBadge(attestation.status)}
                              </div>
                            </div>
                            
                            <div className="p-4">
                              <p className="text-sm text-gray-700 mb-4">{attestation.description}</p>
                              
                              <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-4">
                                <span className="px-2 py-1 bg-gray-100 rounded-full">
                                  Délivré par: {attestation.issuedBy}
                                </span>
                                {attestation.signedDate && (
                                  <span className="px-2 py-1 bg-blue-50 rounded-full text-blue-700">
                                    Signé le: {new Date(attestation.signedDate).toLocaleDateString('fr-FR')}
                                  </span>
                                )}
                                {attestation.verifiedDate && (
                                  <span className="px-2 py-1 bg-green-50 rounded-full text-green-700">
                                    Vérifié le: {new Date(attestation.verifiedDate).toLocaleDateString('fr-FR')}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-3">
                                {attestation.status === 'pending' && (
                                  <button 
                                    onClick={() => handleSignAttestation(attestation)} 
                                    className="flex items-center gap-2 px-4 py-2 bg-[#1a365d] text-white rounded-lg hover:bg-[#264973] transition-colors"
                                  >
                                    <FileSignature className="h-4 w-4" />
                                    Signer
                                  </button>
                                )}
                                
                                <button 
                                  onClick={() => handlePreviewPdf(attestation)}
                                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  Prévisualiser
                                </button>
                                
                                {/* React-PDF Download Link Button */}
                                <PDFDownloadLink
                                  document={<AttestationnPDF attestation={attestation} ticketData={selectedTicket} />}
                                  fileName={attestation.fileName}
                                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  {({ loading }) => (
                                    loading ? (
                                      <span className="flex items-center gap-2">
                                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                        Préparation...
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-2">
                                        <CloudArrowDownIcon className="h-4 w-4" />
                                        Télécharger
                                      </span>
                                    )
                                  )}
                                </PDFDownloadLink>
                                
                                {attestation.status !== 'pending' && (
                                  <span className="ml-auto text-xs text-gray-500 flex items-center">
                                    {attestation.status === 'signed' ? (
                                      <>
                                        <FileSignature className="h-4 w-4 mr-1 text-blue-500" />
                                        Signé
                                      </>
                                    ) : (
                                      <>
                                        <Check className="h-4 w-4 mr-1 text-green-500" />
                                        Vérifié
                                      </>
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <div className="mx-auto max-w-md">
                          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-700">Aucune attestation</h3>
                          <p className="mt-2 text-gray-500">Ce ticket ne contient pas encore d&apos;attestations ou de documents officiels.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Tab content: Location */}
                {activeTab === 'location' && selectedTicket.location && (
                  <div className="p-6 space-y-6 bg-white">
                    <div className="flex items-center space-x-3 mb-5 pb-2 border-b border-gray-100">
                      <MapPinIcon className="h-5 w-5 text-[#1a365d]" />
                      <h3 className="text-lg font-semibold text-gray-800">Localisation</h3>
                    </div>
                    
                    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 relative">
                      <div className="flex items-center mt-3 mb-4">
                        <div className="flex-grow">
                          <p className="text-gray-700 font-medium p-3 bg-white/80 rounded-xl border border-gray-200">{selectedTicket.location}</p>
                        </div>
                      </div>
                      
                      {/* Map View Options */}
                      <div className="absolute top-3 right-3 z-10 bg-white rounded-lg shadow-md border border-gray-200 flex overflow-hidden">
                        <button 
                          className="p-2 hover:bg-gray-100 transition-colors border-r border-gray-200 focus:outline-none active:bg-gray-200"
                          onClick={() => setMapType('roadmap')}
                          title="Vue standard"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1a365d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                        </button>
                        <button 
                          className="p-2 hover:bg-gray-100 transition-colors focus:outline-none active:bg-gray-200"
                          onClick={() => setMapType('satellite')}
                          title="Vue satellite"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1a365d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                          title="Client Location"
                          allowFullScreen
                        ></iframe>
                      </div>
                      
                      {/* Action Buttons - Enhanced */}
                      <div className="flex flex-wrap gap-3 mt-4">
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedTicket.location)}&travelmode=driving`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#1a365d] to-[#213f5b] text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all active:scale-98 transform shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Itinéraire
                        </a>
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedTicket.location)}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#1a365d] text-[#1a365d] py-3 px-4 rounded-xl hover:bg-gray-50 transition-all active:scale-98 transform hover:shadow-md shadow-sm"
                        >
                          <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                          Voir sur Google Maps
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer with action buttons */}
              <div className="border-t border-gray-200 p-5 flex flex-wrap justify-between items-center bg-white gap-4">
                <div className="text-sm flex flex-wrap items-center gap-3">
                  <span className="bg-[#1a365d] text-white px-3 py-1.5 rounded-full shadow-sm">
                    ID: {selectedTicket.ticketNumber || selectedTicket.ticket}
                  </span>
                  <span className="text-gray-500 flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 text-[#1a365d] border border-[#1a365d] rounded-lg hover:bg-[#1a365d]/5 transition-colors">
                    Imprimer
                  </button>
                  <button 
                    onClick={() => setActiveTab('attestations')}
                    className="px-4 py-2 bg-[#1a365d] text-white rounded-lg hover:bg-[#1a365d]/90 transition-colors flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Attestations
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Signature Modal */}
      <AnimatePresence>
        {showSignatureModal && selectedAttestation && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowSignatureModal(false)}
            />
            
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-[#0f2947] to-[#1a365d] p-5 text-white flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileSignature className="h-5 w-5" />
                  Signature d&apos;attestation
                </h3>
                <button 
                  onClick={() => setShowSignatureModal(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-blue-800">
                  <p className="text-sm flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      <strong>{selectedAttestation.title}</strong> - 
                      Veuillez appposer votre signature ci-dessous pour valider ce document.
                    </span>
                  </p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Votre signature:</label>
                  <div className="border-2 border-gray-300 rounded-lg overflow-hidden hover:border-[#1a365d] transition-colors">
                    <SignatureCanvas
                      ref={signaturePadRef}
                      canvasProps={{
                        className: 'w-full h-64 cursor-crosshair',
                        style: { width: '100%', height: '256px', backgroundColor: 'rgba(255, 255, 255, 0)' }
                      }}
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <button 
                      onClick={clearSignature}
                      className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Effacer
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6 gap-3">
                  <button
                    onClick={() => setShowSignatureModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSignatureSubmit}
                    className="px-4 py-2 bg-[#1a365d] text-white rounded-lg hover:bg-[#264973] transition-colors flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Valider la signature
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* PDF Preview Modal */}
      <AnimatePresence>
        {showPdfPreview && selectedAttestation && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPdfPreview(false)}
            />
            
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] relative z-10 overflow-hidden flex flex-col"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-[#0f2947] to-[#1a365d] p-4 text-white flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <DocumentTextIcon className="h-5 w-5" />
                  {selectedAttestation.title}
                </h3>
                <button 
                  onClick={() => setShowPdfPreview(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-hidden p-0 bg-gray-100">
                <div className="h-full w-full">
                  {selectedTicket && (
                    <PDFViewer width="100%" height="100%" className="border-none">
                      <AttestationnPDF attestation={selectedAttestation} ticketData={selectedTicket} />
                    </PDFViewer>
                  )}
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Document généré le {new Date().toLocaleDateString('fr-FR')}
                </span>
                
                <div className="flex gap-2">
                  <PDFDownloadLink
                    document={<AttestationnPDF attestation={selectedAttestation} ticketData={selectedTicket!} />}
                    fileName={selectedAttestation.fileName}
                    className="px-4 py-2 bg-[#1a365d] text-white rounded-lg hover:bg-[#264973] transition-colors flex items-center gap-2"
                  >
                    {({ loading }) => (
                      loading ? (
                        <span className="flex items-center gap-2">
                          <ArrowPathIcon className="h-4 w-4 animate-spin" />
                          Préparation...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <CloudArrowDownIcon className="h-4 w-4" />
                          Télécharger
                        </span>
                      )
                    )}
                  </PDFDownloadLink>
                  
                  {selectedAttestation.status === 'pending' && (
                    <button 
                      onClick={() => {
                        setShowPdfPreview(false);
                        handleSignAttestation(selectedAttestation);
                      }}
                      className="px-4 py-2 bg-white border border-[#1a365d] text-[#1a365d] rounded-lg hover:bg-[#1a365d]/5 transition-colors flex items-center gap-2"
                    >
                      <FileSignature className="h-4 w-4" />
                      Signer
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
