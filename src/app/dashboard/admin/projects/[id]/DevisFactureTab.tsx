import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DocumentIcon,
  DocumentTextIcon,
  DocumentCheckIcon,
  MagnifyingGlassIcon,
  ArrowsUpDownIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  CalendarIcon,
  EyeIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  CurrencyEuroIcon,
  BellIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  PrinterIcon
} from "@heroicons/react/24/outline";

interface DevisFactureTabProps {
  contactId: string;
}

// Document types and statuses
type DocumentType = "devis" | "facture";
type DocumentStatus = "brouillon" | "envoyé" | "signé" | "payé" | "refusé" | "expiré";
type SignatureStatus = "non_demandé" | "en_attente" | "signé" | "refusé";

interface Document {
  id: string;
  type: DocumentType;
  reference: string;
  clientId: string;
  clientName: string;
  dateCreation: string;
  dateExpiration?: string;
  dateDue?: string;
  montant: string;
  status: DocumentStatus;
  signatureStatus: SignatureStatus;
  signatureDate?: string;
  fileUrl: string;
}

// Document status badge component
const DocumentStatusBadge: React.FC<{ status: DocumentStatus }> = ({ status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case "brouillon":
        return { 
          bgColor: "bg-gray-100", 
          textColor: "text-gray-800",
          icon: <PencilIcon className="h-4 w-4 mr-1" />,
          label: "Brouillon"
        };
      case "envoyé":
        return { 
          bgColor: "bg-blue-100", 
          textColor: "text-blue-800",
          icon: <EnvelopeIcon className="h-4 w-4 mr-1" />,
          label: "Envoyé"
        };
      case "signé":
        return { 
          bgColor: "bg-green-100", 
          textColor: "text-green-800",
          icon: <CheckIcon className="h-4 w-4 mr-1" />,
          label: "Signé"
        };
      case "payé":
        return { 
          bgColor: "bg-purple-100", 
          textColor: "text-purple-800",
          icon: <CurrencyEuroIcon className="h-4 w-4 mr-1" />,
          label: "Payé"
        };
      case "refusé":
        return { 
          bgColor: "bg-red-100", 
          textColor: "text-red-800",
          icon: <XMarkIcon className="h-4 w-4 mr-1" />,
          label: "Refusé"
        };
      case "expiré":
        return { 
          bgColor: "bg-amber-100", 
          textColor: "text-amber-800",
          icon: <ClockIcon className="h-4 w-4 mr-1" />,
          label: "Expiré"
        };
      default:
        return { 
          bgColor: "bg-gray-100", 
          textColor: "text-gray-800",
          icon: null,
          label: status
        };
    }
  };

  const { bgColor, textColor, icon, label } = getStatusInfo();

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {label}
    </span>
  );
};

// Signature status badge component
const SignatureStatusBadge: React.FC<{ status: SignatureStatus }> = ({ status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case "non_demandé":
        return { 
          bgColor: "bg-gray-100", 
          textColor: "text-gray-800",
          icon: <XMarkIcon className="h-4 w-4 mr-1" />,
          label: "Non demandé"
        };
      case "en_attente":
        return { 
          bgColor: "bg-amber-100", 
          textColor: "text-amber-800",
          icon: <ClockIcon className="h-4 w-4 mr-1" />,
          label: "En attente"
        };
      case "signé":
        return { 
          bgColor: "bg-green-100", 
          textColor: "text-green-800",
          icon: <CheckIcon className="h-4 w-4 mr-1" />,
          label: "Signé"
        };
      case "refusé":
        return { 
          bgColor: "bg-red-100", 
          textColor: "text-red-800",
          icon: <XMarkIcon className="h-4 w-4 mr-1" />,
          label: "Refusé"
        };
      default:
        return { 
          bgColor: "bg-gray-100", 
          textColor: "text-gray-800",
          icon: null,
          label: status
        };
    }
  };

  const { bgColor, textColor, icon, label } = getStatusInfo();

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {label}
    </span>
  );
};

// Send signature request modal component
const SendSignatureRequestModal: React.FC<{
  document: Document;
  onClose: () => void;
  onSend: () => void;
}> = ({ document, onClose, onSend }) => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>(`Bonjour,\n\nVeuillez trouver ci-joint votre ${document.type === "devis" ? "devis" : "facture"} n°${document.reference} pour signature.\n\nCordialement,\nVotre entreprise`);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here would be the API call to send the signature request
    onSend();
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-white rounded-xl w-full max-w-2xl m-4 overflow-hidden shadow-2xl"
      >
        {/* Modal header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -mr-10 -mt-10 opacity-20" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <EnvelopeIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Envoyer une demande de signature
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Modal body */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">Document</span>
                  <span className="text-lg font-semibold">{document.type === "devis" ? "Devis" : "Facture"} #{document.reference}</span>
                </div>
                <DocumentStatusBadge status={document.status} />
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">Client</span>
                  <span className="text-base">{document.clientName}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">Montant</span>
                  <span className="text-base font-semibold">{document.montant}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email du destinataire
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="client@example.com"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 transition hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg transition hover:bg-blue-700 inline-flex items-center"
              >
                <EnvelopeIcon className="h-4 w-4 mr-1" />
                Envoyer
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// Document preview component
const DocumentPreview: React.FC<{
  document: Document;
  onRequestSignature: (document: Document) => void;
  onSendReminder: (document: Document) => void;
}> = ({ document, onRequestSignature, onSendReminder }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Document header */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {document.type === "devis" ? "Devis" : "Facture"} #{document.reference}
            </h2>
            <p className="text-gray-600">{document.clientName}</p>
          </div>
          <div className="flex flex-col items-end">
            <DocumentStatusBadge status={document.status} />
            <span className="text-sm text-gray-500 mt-2">Créé le {document.dateCreation}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="block text-sm font-medium text-gray-500">Montant</span>
            <span className="text-xl font-bold text-gray-900">{document.montant}</span>
          </div>
          {document.type === "devis" && (
            <div>
              <span className="block text-sm font-medium text-gray-500">Validité</span>
              <span className="text-base text-gray-900">{document.dateExpiration || "Non définie"}</span>
            </div>
          )}
          {document.type === "facture" && (
            <div>
              <span className="block text-sm font-medium text-gray-500">Date d&apos;échéance</span>
              <span className="text-base text-gray-900">{document.dateDue || "Non définie"}</span>
            </div>
          )}
          <div>
            <span className="block text-sm font-medium text-gray-500">Signature</span>
            <div className="flex items-center mt-0.5">
              <SignatureStatusBadge status={document.signatureStatus} />
              {document.signatureDate && (
                <span className="text-xs text-gray-500 ml-2">
                  le {document.signatureDate}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Document preview iframe */}
      <div className="flex-grow relative bg-gray-100 rounded-lg overflow-hidden mb-4">
        {document.fileUrl ? (
          <iframe 
            src={document.fileUrl}
            className="w-full h-full"
            title={`Aperçu du ${document.type} #${document.reference}`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-500">Aperçu non disponible</p>
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mt-auto">
        <a 
          href={document.fileUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          <EyeIcon className="h-5 w-5 text-gray-500" />
          Visualiser
        </a>
        <a
          href={document.fileUrl}
          download={`${document.type}_${document.reference}.pdf`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          <ArrowDownTrayIcon className="h-5 w-5 text-gray-500" />
          Télécharger
        </a>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          <PrinterIcon className="h-5 w-5 text-gray-500" />
          Imprimer
        </button>
        
        {/* Signature status specific actions */}
        {document.signatureStatus === "non_demandé" && (
          <button
            onClick={() => onRequestSignature(document)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ml-auto"
          >
            <EnvelopeIcon className="h-5 w-5" />
            Demander une signature
          </button>
        )}
        {document.signatureStatus === "en_attente" && (
          <button
            onClick={() => onSendReminder(document)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition ml-auto"
          >
            <BellIcon className="h-5 w-5" />
            Envoyer un rappel
          </button>
        )}
      </div>
    </div>
  );
};

// Empty state component
const EmptyState: React.FC<{
  type: "all" | "devis" | "facture";
  onCreateNew: () => void;
}> = ({ type, onCreateNew }) => {
  const title = type === "devis" ? "Aucun devis" : type === "facture" ? "Aucune facture" : "Aucun document";
  const message = type === "devis" 
    ? "Vous n'avez pas encore créé de devis. Commencez par en créer un."
    : type === "facture" 
      ? "Vous n'avez pas encore créé de facture. Commencez par en créer une."
      : "Vous n'avez pas encore créé de documents. Commencez par en créer un.";
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
        {type === "devis" ? (
          <DocumentIcon className="h-10 w-10 text-blue-600" />
        ) : type === "facture" ? (
          <DocumentTextIcon className="h-10 w-10 text-blue-600" />
        ) : (
          <DocumentCheckIcon className="h-10 w-10 text-blue-600" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md text-center">{message}</p>
      <button
        onClick={onCreateNew}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg transition hover:bg-blue-700 inline-flex items-center"
      >
        <PlusIcon className="h-5 w-5 mr-1" />
        {type === "devis" ? "Créer un devis" : type === "facture" ? "Créer une facture" : "Créer un document"}
      </button>
    </div>
  );
};

// Main tab component
const DevisFactureTab: React.FC<DevisFactureTabProps> = ({ contactId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<"all" | "devis" | "facture">("all");
  const [filterSignature, setFilterSignature] = useState<SignatureStatus | "all">("all");
  const [sortKey, setSortKey] = useState<keyof Document>("dateCreation");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showSignatureModal, setShowSignatureModal] = useState<boolean>(false);
  
  // Fetch documents on mount and when contactId changes
  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // This would be your actual API call
        // const response = await fetch(`/api/documents?contactId=${contactId}`);
        // if (!response.ok) throw new Error("Failed to fetch documents");
        // const data = await response.json();
        
        // For demonstration, we'll use mock data
        // In a real application, replace this with actual API calls
        setTimeout(() => {
          const mockDocuments: Document[] = [
            {
              id: "1",
              type: "devis",
              reference: "DEV-2025-001",
              clientId: contactId,
              clientName: "Jean Dupont",
              dateCreation: "15/03/2025",
              dateExpiration: "15/04/2025",
              montant: "4 580,00 €",
              status: "signé",
              signatureStatus: "signé",
              signatureDate: "20/03/2025",
              fileUrl: ""
            },
            {
              id: "2",
              type: "devis",
              reference: "DEV-2025-002",
              clientId: contactId,
              clientName: "Jean Dupont",
              dateCreation: "18/03/2025",
              dateExpiration: "18/04/2025",
              montant: "2 340,00 €",
              status: "envoyé",
              signatureStatus: "en_attente",
              fileUrl: ""
            },
            {
              id: "3",
              type: "facture",
              reference: "FAC-2025-001",
              clientId: contactId,
              clientName: "Jean Dupont",
              dateCreation: "20/03/2025",
              dateDue: "20/04/2025",
              montant: "4 580,00 €",
              status: "payé",
              signatureStatus: "signé",
              signatureDate: "22/03/2025",
              fileUrl: ""
            },
            {
              id: "4",
              type: "devis",
              reference: "DEV-2025-003",
              clientId: contactId,
              clientName: "Jean Dupont",
              dateCreation: "22/03/2025",
              dateExpiration: "22/04/2025",
              montant: "5 260,00 €",
              status: "brouillon",
              signatureStatus: "non_demandé",
              fileUrl: ""
            }
          ];
          
          setDocuments(mockDocuments);
          if (mockDocuments.length > 0) {
            setSelectedDocument(mockDocuments[0]);
          }
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setError("Impossible de charger les documents. Veuillez réessayer.");
        setIsLoading(false);
      }
    };
    
    fetchDocuments();
  }, [contactId]);
  
  // Helper functions for sorting and filtering
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      // Filter by search query
      const matchesSearch = 
        doc.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.montant.includes(searchQuery);
      
      // Filter by document type
      const matchesType = 
        filterType === "all" || 
        (filterType === "devis" && doc.type === "devis") ||
        (filterType === "facture" && doc.type === "facture");
      
      // Filter by signature status
      const matchesSignature = 
        filterSignature === "all" || 
        doc.signatureStatus === filterSignature;
      
      return matchesSearch && matchesType && matchesSignature;
    }).sort((a, b) => {
      // Special case for date sorting
      if (sortKey === "dateCreation" || sortKey === "dateExpiration" || sortKey === "dateDue" || sortKey === "signatureDate") {
        const dateA = a[sortKey] ? new Date(a[sortKey].split('/').reverse().join('-')) : new Date(0);
        const dateB = b[sortKey] ? new Date(b[sortKey].split('/').reverse().join('-')) : new Date(0);

        return sortDirection === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
      
      // Special case for amount sorting (convert to number first)
      if (sortKey === "montant") {
        const amountA = parseFloat(a[sortKey].replace(/[€\s.]/g, "").replace(",", ".")) || 0;
        const amountB = parseFloat(b[sortKey].replace(/[€\s.]/g, "").replace(",", ".")) || 0;

        return sortDirection === "asc"
          ? amountA - amountB
          : amountB - amountA;
      }
      
      // Default string comparison
      if (a[sortKey] < b[sortKey])
        return sortDirection === "asc" ? -1 : 1;
      if (a[sortKey] > b[sortKey])
        return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [documents, searchQuery, filterType, filterSignature, sortKey, sortDirection]);
  
  // Statistics
  const stats = useMemo(() => {
    const devisCount = documents.filter(doc => doc.type === "devis").length;
    const factureCount = documents.filter(doc => doc.type === "facture").length;
    const pendingSignatureCount = documents.filter(doc => doc.signatureStatus === "en_attente").length;
    const signedCount = documents.filter(doc => doc.signatureStatus === "signé").length;
    
    // Calculate total amount based on document type
    const devisAmount = documents
      .filter(doc => doc.type === "devis")
      .reduce((sum, doc) => {
        const amount = parseFloat(doc.montant.replace(/[€\s.]/g, "").replace(",", ".")) || 0;
        return sum + amount;
      }, 0);
      
    const factureAmount = documents
      .filter(doc => doc.type === "facture")
      .reduce((sum, doc) => {
        const amount = parseFloat(doc.montant.replace(/[€\s.]/g, "").replace(",", ".")) || 0;
        return sum + amount;
      }, 0);
    
    return {
      devisCount,
      factureCount,
      pendingSignatureCount,
      signedCount,
      devisAmount: devisAmount.toLocaleString("fr-FR").replace(/,/g, " ") + " €",
      factureAmount: factureAmount.toLocaleString("fr-FR").replace(/,/g, " ") + " €"
    };
  }, [documents]);
  
  // Handle sort click
  const handleSort = (key: keyof Document) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };
  
  // Handle request signature
  const handleRequestSignature = (doc: Document) => {
    setSelectedDocument(doc);
    setShowSignatureModal(true);
  };
  
  // Handle send reminder
  const handleSendReminder = (doc: Document) => {
    // In a real app, this would make an API call to send a reminder
    alert(`Rappel envoyé pour le document ${doc.reference}`);
  };
  
  // Handle send signature request
  const handleSendSignatureRequest = () => {
    if (!selectedDocument) return;
    
    // In a real app, this would make an API call to send the signature request
    // For now, we'll update the document status locally
    setDocuments(docs => docs.map(doc => 
      doc.id === selectedDocument.id 
        ? { ...doc, signatureStatus: "en_attente" as SignatureStatus, status: "envoyé" as DocumentStatus } 
        : doc
    ));
    
    setSelectedDocument(prev => 
      prev ? { ...prev, signatureStatus: "en_attente", status: "envoyé" } : null
    );
    
    alert(`Demande de signature envoyée pour le document ${selectedDocument.reference}`);
  };
  
  // Handle create new document
  const handleCreateNew = () => {
    // In a real app, this would navigate to a document creation page or open a modal
    alert("Navigation vers la création d'un nouveau document");
  };
  
  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Enhanced Header with Background */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="relative bg-gradient-to-r from-blue-600 to-blue-400 px-10 py-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -mr-16 -mt-20 opacity-30" />
        <div className="absolute bottom-0 right-24 w-32 h-32 bg-blue-300 rounded-full -mb-10 opacity-20" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center">
            <div className="flex items-center justify-center bg-white text-blue-600 rounded-full w-16 h-16 mr-6 shadow-xl">
              <DocumentCheckIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-white">
                Devis & Factures
              </h2>
              <p className="text-blue-100 mt-1">Gestion des documents financiers et signatures</p>
            </div>
          </div>
          
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-white text-blue-700 rounded-lg shadow-md hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Nouveau document</span>
          </button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-blue-50 border-b border-blue-100">
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4"
        >
          <div className="p-3 bg-blue-100 rounded-lg">
            <DocumentIcon className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Devis</p>
            <p className="text-2xl font-bold text-gray-900">{stats.devisCount}</p>
            <p className="text-xs text-gray-600">{stats.devisAmount}</p>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4"
        >
          <div className="p-3 bg-blue-100 rounded-lg">
            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Factures</p>
            <p className="text-2xl font-bold text-gray-900">{stats.factureCount}</p>
            <p className="text-xs text-gray-600">{stats.factureAmount}</p>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4"
        >
          <div className="p-3 bg-amber-100 rounded-lg">
            <ClockIcon className="h-8 w-8 text-amber-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">En attente de signature</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pendingSignatureCount}</p>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4"
        >
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckIcon className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Documents signés</p>
            <p className="text-2xl font-bold text-gray-900">{stats.signedCount}</p>
          </div>
        </motion.div>
      </div>

      {/* Search, Filters and Sorting */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par référence, client ou montant..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 text-sm font-medium transition ${
                  filterType === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilterType("devis")}
                className={`px-4 py-2 text-sm font-medium transition ${
                  filterType === "devis"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Devis
              </button>
              <button
                onClick={() => setFilterType("facture")}
                className={`px-4 py-2 text-sm font-medium transition ${
                  filterType === "facture"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Factures
              </button>
            </div>
            
            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterSignature}
                onChange={(e) => setFilterSignature(e.target.value as SignatureStatus | "all")}
              >
                <option value="all">Toutes signatures</option>
                <option value="non_demandé">Non demandé</option>
                <option value="en_attente">En attente</option>
                <option value="signé">Signé</option>
                <option value="refusé">Refusé</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <ChevronDownIcon className="h-4 w-4" />
              </div>
            </div>
            
            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={sortKey}
                onChange={(e) => handleSort(e.target.value as keyof Document)}
              >
                <option value="dateCreation">Date de création</option>
                <option value="reference">Référence</option>
                <option value="montant">Montant</option>
                {filterType !== "facture" && <option value="dateExpiration">Date d&apos;expiration</option>}
                {filterType !== "devis" && <option value="dateDue">Date d&apos;échéance</option>}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <ArrowsUpDownIcon className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Split View */}
      <div className="flex-grow flex overflow-hidden">
        {/* Left Panel - Document List */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto bg-gray-50">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-blue-500">Chargement des documents...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <ExclamationCircleIcon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur</h3>
              <p className="text-gray-600 mb-6 text-center">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <ArrowPathIcon className="h-5 w-5" />
                Réessayer
              </button>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <EmptyState 
              type={filterType}
              onCreateNew={handleCreateNew}
            />
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <li
                  key={doc.id}
                  onClick={() => setSelectedDocument(doc)}
                  className={`border-l-4 ${
                    selectedDocument?.id === doc.id
                      ? "border-l-blue-500 bg-blue-50"
                      : "border-l-transparent hover:bg-gray-50"
                  } transition-all cursor-pointer`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {doc.type === "devis" ? (
                          <DocumentIcon className="h-5 w-5 text-blue-600 mr-2" />
                        ) : (
                          <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
                        )}
                        <span className="font-medium text-gray-900">{doc.reference}</span>
                      </div>
                      <DocumentStatusBadge status={doc.status} />
                    </div>
                    
                    <div className="mb-2">
                      <span className="text-sm text-gray-600">{doc.clientName}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 inline mr-1" />
                        {doc.dateCreation}
                      </div>
                      <div className="font-semibold">{doc.montant}</div>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between">
                      <SignatureStatusBadge status={doc.signatureStatus} />
                      <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-0.5">
                        <span>Détails</span>
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Right Panel - Document Preview */}
        <div className="flex-grow overflow-y-auto bg-white p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-blue-500">Chargement des documents...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <ExclamationCircleIcon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur</h3>
              <p className="text-gray-600 mb-6 text-center">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <ArrowPathIcon className="h-5 w-5" />
                Réessayer
              </button>
            </div>
          ) : !selectedDocument ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <DocumentCheckIcon className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun document sélectionné</h3>
              <p className="text-gray-500 mb-6 max-w-md text-center">
                Sélectionnez un document dans la liste pour voir les détails.
              </p>
            </div>
          ) : (
            <DocumentPreview 
              document={selectedDocument}
              onRequestSignature={handleRequestSignature}
              onSendReminder={handleSendReminder}
            />
          )}
        </div>
      </div>
      
      {/* Signature Request Modal */}
      <AnimatePresence>
        {showSignatureModal && selectedDocument && (
          <SendSignatureRequestModal 
            document={selectedDocument}
            onClose={() => setShowSignatureModal(false)}
            onSend={handleSendSignatureRequest}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DevisFactureTab;