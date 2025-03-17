"use client";

import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  DocumentChartBarIcon,
  FolderIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationCircleIcon,
  StarIcon,
  ChevronDownIcon,
  BellIcon,
  EyeIcon,
  ArrowsUpDownIcon,
  AdjustmentsHorizontalIcon,
  DocumentArrowDownIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { useEffect, useState, useRef } from "react";

// Define TypeScript interfaces
interface ApiDocument {
  _id: string;
  type: string;
  date: string;
  statut: string;
  solution: string;
  contactId: string;
  filePath: string;
  description?: string;
  importance?: 'faible' | 'moyenne' | 'haute';
}

interface FormattedDocument {
  id: string;
  name: string;
  solution: string;
  uploadedDate: string;
  fileType: string;
  size: string;
  category: string;
  description?: string;
  statut: string;
  importance: 'faible' | 'moyenne' | 'haute';
  isFavorite: boolean;
  originalData: ApiDocument;
}

interface QuickTag {
  name: string;
  color: string;
  filter: {
    importance?: string;
    statut?: string;
    category?: string;
    favorite?: boolean;
  };
}

// Sample data for demonstration
const sampleDocuments: FormattedDocument[] = [
  {
    id: "doc-001",
    name: "Manuel d'utilisation - Système Photovoltaïque",
    solution: "SolarPlus 3000",
    uploadedDate: "2024-03-15",
    fileType: "PDF",
    size: "2.3MB",
    category: "Manuels techniques",
    description: "Guide complet d'installation et d'utilisation du système photovoltaïque",
    statut: "Disponible",
    importance: "haute",
    isFavorite: true,
    originalData: {
      _id: "doc-001",
      type: "manuel",
      date: "15/03/2024",
      statut: "Disponible",
      solution: "SolarPlus 3000",
      contactId: "c72666f5-0b42-4b27-be73-51301bdb5987",
      filePath: "/documents/manual-solarplus-3000.pdf",
      importance: "haute"
    }
  },
  {
    id: "doc-002",
    name: "Facture d'installation",
    solution: "Installation résidentielle",
    uploadedDate: "2024-02-28",
    fileType: "PDF",
    size: "0.8MB",
    category: "Factures",
    description: "Facture détaillée de l'installation complète",
    statut: "Payée",
    importance: "haute",
    isFavorite: true,
    originalData: {
      _id: "doc-002",
      type: "facture",
      date: "28/02/2024",
      statut: "Payée",
      solution: "Installation résidentielle",
      contactId: "c72666f5-0b42-4b27-be73-51301bdb5987",
      filePath: "/documents/facture-20240228.pdf",
      importance: "haute"
    }
  },
  {
    id: "doc-003",
    name: "Guide de maintenance",
    solution: "SolarPlus 3000",
    uploadedDate: "2024-03-10",
    fileType: "PDF",
    size: "1.5MB",
    category: "Maintenance",
    description: "Procédures de maintenance préventive et corrective",
    statut: "Disponible",
    importance: "moyenne",
    isFavorite: false,
    originalData: {
      _id: "doc-003",
      type: "entretien",
      date: "10/03/2024",
      statut: "Disponible",
      solution: "SolarPlus 3000",
      contactId: "c72666f5-0b42-4b27-be73-51301bdb5987",
      filePath: "/documents/maintenance-solarplus.pdf",
      importance: "moyenne"
    }
  },
  {
    id: "doc-004",
    name: "Spécifications techniques",
    solution: "Panneaux Solaires EcoMax",
    uploadedDate: "2024-01-15",
    fileType: "PDF",
    size: "3.2MB",
    category: "Spécifications techniques",
    description: "Détails techniques des panneaux solaires installés",
    statut: "Disponible",
    importance: "moyenne",
    isFavorite: false,
    originalData: {
      _id: "doc-004",
      type: "tech",
      date: "15/01/2024",
      statut: "Disponible",
      solution: "Panneaux Solaires EcoMax",
      contactId: "c72666f5-0b42-4b27-be73-51301bdb5987",
      filePath: "/documents/specs-ecomax.pdf",
      importance: "moyenne"
    }
  },
  {
    id: "doc-005",
    name: "Attestation de conformité",
    solution: "Installation résidentielle",
    uploadedDate: "2024-03-02",
    fileType: "PDF",
    size: "0.5MB",
    category: "Certificats",
    description: "Certification de conformité aux normes électriques",
    statut: "Validé",
    importance: "haute",
    isFavorite: false,
    originalData: {
      _id: "doc-005",
      type: "autre",
      date: "02/03/2024",
      statut: "Validé",
      solution: "Installation résidentielle",
      contactId: "c72666f5-0b42-4b27-be73-51301bdb5987",
      filePath: "/documents/attestation-conformite.pdf",
      importance: "haute"
    }
  },
  {
    id: "doc-006",
    name: "Schéma électrique",
    solution: "Installation personnalisée",
    uploadedDate: "2024-02-10",
    fileType: "PDF",
    size: "1.1MB",
    category: "Spécifications techniques",
    description: "Schéma détaillé de l'installation électrique",
    statut: "Disponible",
    importance: "faible",
    isFavorite: false,
    originalData: {
      _id: "doc-006",
      type: "tech",
      date: "10/02/2024",
      statut: "Disponible",
      solution: "Installation personnalisée",
      contactId: "c72666f5-0b42-4b27-be73-51301bdb5987",
      filePath: "/documents/schema-electrique.pdf",
      importance: "faible"
    }
  }
];

// Sample documents à transmettre (to be sent by client)
const sampleDocumentsToTransmit: FormattedDocument[] = [
  {
    id: "trans-001",
    name: "Attestation d'assurance",
    solution: "Document administratif",
    uploadedDate: "2024-03-12",
    fileType: "PDF",
    size: "0.7MB",
    category: "Documents administratifs",
    description: "À transmettre pour validation de la garantie",
    statut: "À transmettre",
    importance: "haute",
    isFavorite: false,
    originalData: {
      _id: "trans-001",
      type: "autre",
      date: "12/03/2024",
      statut: "À transmettre",
      solution: "Document administratif",
      contactId: "c72666f5-0b42-4b27-be73-51301bdb5987",
      filePath: "",
      importance: "haute"
    }
  },
  {
    id: "trans-002",
    name: "Relevé compteur électrique",
    solution: "Suivi énergétique",
    uploadedDate: "2024-03-01",
    fileType: "JPG",
    size: "1.2MB",
    category: "Relevés",
    description: "Photo du compteur pour le suivi mensuel",
    statut: "Transmis",
    importance: "moyenne",
    isFavorite: false,
    originalData: {
      _id: "trans-002",
      type: "autre",
      date: "01/03/2024",
      statut: "Transmis",
      solution: "Suivi énergétique",
      contactId: "c72666f5-0b42-4b27-be73-51301bdb5987",
      filePath: "/documents/releve-mars.jpg",
      importance: "moyenne"
    }
  },
  {
    id: "trans-003",
    name: "Certificat d'économie d'énergie",
    solution: "Dossier administratif",
    uploadedDate: "2024-03-05",
    fileType: "PDF",
    size: "0.9MB",
    category: "Documents administratifs",
    description: "Document requis pour l'obtention des primes énergétiques",
    statut: "En attente",
    importance: "haute",
    isFavorite: false,
    originalData: {
      _id: "trans-003",
      type: "autre",
      date: "05/03/2024",
      statut: "En attente",
      solution: "Dossier administratif",
      contactId: "c72666f5-0b42-4b27-be73-51301bdb5987",
      filePath: "/documents/certificat-energie.pdf",
      importance: "haute"
    }
  }
];

export default function ClientDocuments() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("Tous");
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [documents, setDocuments] = useState<FormattedDocument[]>([]);
  const [transmitDocuments, setTransmitDocuments] = useState<FormattedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("telecharger");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<FormattedDocument | null>(null);
  // Remove sidebar state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Toggle favorites
  const toggleFavorite = (id: string) => {
    if (activeTab === "telecharger") {
      setDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === id ? {...doc, isFavorite: !doc.isFavorite} : doc
        )
      );
    } else {
      setTransmitDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === id ? {...doc, isFavorite: !doc.isFavorite} : doc
        )
      );
    }
  };

  // Function to format date from API format (DD/MM/YYYY) to display format (YYYY-MM-DD)

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Click outside handler for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch documents from API (using sample data for this example)
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        
        // Simulate API call with sample data
        setTimeout(() => {
          setDocuments(sampleDocuments);
          setTransmitDocuments(sampleDocumentsToTransmit);
          setLoading(false);
        }, 1000);
        
        // In a real implementation, you would fetch from API
      } catch (err) {
        console.error("Failed to fetch documents:", err);
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Handle document upload (simulated)
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setLoading(false);
      setUploadSuccess(true);
      
      // Reset after showing success message
      setTimeout(() => {
        setUploadSuccess(false);
        setShowUploadModal(false);
      }, 2000);
    }, 1500);
  };

  // Count totals for statistics
  const getTotalDocuments = () => {
    return activeTab === "telecharger" ? documents.length : transmitDocuments.length;
  };

  const getPendingDocuments = () => {
    return transmitDocuments.filter(doc => doc.statut === "À transmettre").length;
  };

  const getFavoriteDocuments = () => {
    return activeTab === "telecharger" 
      ? documents.filter(doc => doc.isFavorite).length 
      : transmitDocuments.filter(doc => doc.isFavorite).length;
  };

  // Sort and filter documents
  const getSortedAndFilteredDocuments = () => {
    const currentDocs = activeTab === "telecharger" ? documents : transmitDocuments;
    
    // Apply filters
    let filtered = currentDocs.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      const matchesCategory = filterCategory === "Tous" || doc.category === filterCategory;
      const matchesStatus = filterStatus === "Tous" || doc.statut === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
    
    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc" 
          ? new Date(a.uploadedDate).getTime() - new Date(b.uploadedDate).getTime()
          : new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime();
      } else if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "importance") {
        const importanceOrder = { haute: 3, moyenne: 2, faible: 1 };
        return sortOrder === "asc"
          ? (importanceOrder[a.importance] || 0) - (importanceOrder[b.importance] || 0)
          : (importanceOrder[b.importance] || 0) - (importanceOrder[a.importance] || 0);
      }
      return 0;
    });
    
    return filtered;
  };

  const filteredDocuments = getSortedAndFilteredDocuments();

  // Get unique categories and statuses for filters
  const getCategories = () => {
    const currentDocs = activeTab === "telecharger" ? documents : transmitDocuments;
    return ["Tous", ...Array.from(new Set(currentDocs.map(doc => doc.category)))];
  };

  const getStatuses = () => {
    const currentDocs = activeTab === "telecharger" ? documents : transmitDocuments;
    return ["Tous", ...Array.from(new Set(currentDocs.map(doc => doc.statut)))];
  };

  // Get top tags for quick filtering
  const getQuickTags = (): QuickTag[] => {
    const tags: QuickTag[] = [
      { name: 'Prioritaire', color: 'bg-red-100 text-red-800', filter: { importance: 'haute' } },
      { name: 'Validé', color: 'bg-green-100 text-green-800', filter: { statut: 'Validé' } },
      { name: 'Technique', color: 'bg-blue-100 text-blue-800', filter: { category: 'Spécifications techniques' } },
      { name: 'Factures', color: 'bg-purple-100 text-purple-800', filter: { category: 'Factures' } },
      { name: 'Favoris', color: 'bg-amber-100 text-amber-800', filter: { favorite: true } }
    ];
    return tags;
  };

  const categories = getCategories();
  const statuses = getStatuses();
  const quickTags = getQuickTags();

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterCategory("Tous");
    setFilterStatus("Tous");
    setSearchQuery("");
    setSortBy("date");
    setSortOrder("desc");
  };

  // Render document card based on view mode
  const renderDocumentCard = (doc: FormattedDocument) => {
    const importanceColor = 
      doc.importance === "haute" ? "bg-red-100 text-red-800" :
      doc.importance === "moyenne" ? "bg-amber-100 text-amber-800" : 
      "bg-blue-100 text-blue-800";
    
    const statusColor =
      doc.statut === "Disponible" || doc.statut === "Validé" || doc.statut === "Payée"
        ? "bg-green-100 text-green-800" 
        : doc.statut === "À transmettre"
        ? "bg-amber-100 text-amber-800"
        : doc.statut === "Transmis"
        ? "bg-blue-100 text-blue-800"
        : doc.statut === "En attente"
        ? "bg-purple-100 text-purple-800"
        : "bg-gray-100 text-gray-800";
    
    if (viewMode === 'list') {
      return (
        <motion.div
          key={doc.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 
            hover:shadow-md transition-all w-full flex ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
        >
          <div className={`p-4 flex-shrink-0 flex items-center justify-center ${
            doc.fileType === "PDF" ? "bg-red-50" : 
            doc.fileType === "JPG" || doc.fileType === "PNG" ? "bg-blue-50" : 
            "bg-green-50"
          } ${darkMode ? 'bg-opacity-20' : ''}`}>
            <DocumentTextIcon className={`h-12 w-12 ${
              doc.fileType === "PDF" ? "text-red-600" : 
              doc.fileType === "JPG" || doc.fileType === "PNG" ? "text-blue-600" : 
              "text-green-600"
            }`} />
          </div>
          
          <div className="flex-1 p-4 flex flex-col">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-[#19345e]'}`}>{doc.name}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-[#19345e]/70'} mt-1`}>{doc.solution}</p>
              </div>
              <button 
                onClick={() => toggleFavorite(doc.id)} 
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                {doc.isFavorite ? 
                  <StarIconSolid className="h-5 w-5 text-amber-400" /> : 
                  <StarIcon className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                }
              </button>
            </div>
            
            <div className="mt-2">
              {doc.description && (
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-1`}>{doc.description}</p>
              )}
            </div>
            
            <div className="mt-2 flex flex-wrap gap-2">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColor} ${darkMode ? 'bg-opacity-30' : ''}`}>
                {doc.statut}
              </span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${importanceColor} ${darkMode ? 'bg-opacity-30' : ''}`}>
                {doc.importance === "haute" ? "Prioritaire" :
                 doc.importance === "moyenne" ? "Standard" : "Optionnel"}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                {doc.fileType} • {doc.size}
              </span>
            </div>
            
            <div className="mt-3 flex justify-between items-center">
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <ClockIcon className="h-3 w-3 inline mr-1" />
                {doc.uploadedDate}
              </div>
              
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm flex items-center gap-1 hover:bg-gray-200"
                  onClick={() => setPreviewDocument(doc)}
                >
                  <EyeIcon className="h-3 w-3" />
                  <span>Aperçu</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
                    activeTab === "telecharger" || doc.statut === "Transmis"
                      ? "bg-[#19345e] text-white hover:bg-[#19345e]/90"
                      : "bg-amber-500 text-white hover:bg-amber-600"
                  }`}
                  onClick={() => activeTab === "telecharger" || doc.statut === "Transmis" 
                    ? window.open(doc.originalData.filePath, '_blank') 
                    : setShowUploadModal(true)
                  }
                >
                  {activeTab === "telecharger" || doc.statut === "Transmis" ? (
                    <>
                      <ArrowDownTrayIcon className="h-3 w-3" />
                      <span>Télécharger</span>
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="h-3 w-3" />
                      <span>Transmettre</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }
    
    // Grid view (default)
    return (
      <motion.div
        key={doc.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className={`group overflow-hidden rounded-xl transition-all ${
          darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border border-gray-100'
        } hover:shadow-lg relative`}
      >
        {/* Importance indicator strip at top */}
        <div className={`h-1 w-full absolute top-0 left-0 right-0 ${
          doc.importance === "haute" ? "bg-red-500" :
          doc.importance === "moyenne" ? "bg-amber-500" : 
          "bg-blue-500"
        }`}></div>
        
        {/* Favorite button */}
        <button 
          onClick={() => toggleFavorite(doc.id)} 
          className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 z-10"
        >
          {doc.isFavorite ? 
            <StarIconSolid className="h-5 w-5 text-amber-400" /> : 
            <StarIcon className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          }
        </button>
        
        <div className="p-6 pt-7">
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-lg ${
              doc.fileType === "PDF" ? "bg-red-100" : 
              doc.fileType === "JPG" || doc.fileType === "PNG" ? "bg-blue-100" : 
              "bg-green-100"
            } ${darkMode ? 'bg-opacity-20' : ''}`}>
              <DocumentTextIcon className={`h-8 w-8 ${
                doc.fileType === "PDF" ? "text-red-600" : 
                doc.fileType === "JPG" || doc.fileType === "PNG" ? "text-blue-600" : 
                "text-green-600"
              }`} />
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-semibold line-clamp-2 ${darkMode ? 'text-white' : 'text-[#19345e]'}`}>{doc.name}</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-[#19345e]/70'} mt-1`}>{doc.category}</p>
            </div>
          </div>

          {doc.description && (
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} my-3 line-clamp-2`}>{doc.description}</p>
          )}

          <div className="space-y-2 text-sm mt-4">
            <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-[#19345e]/80'}`}>
              <FolderIcon className="h-4 w-4 text-gray-500" />
              <span className="line-clamp-1">{doc.solution}</span>
            </div>
            <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-[#19345e]/80'}`}>
              <ClockIcon className="h-4 w-4 text-gray-500" />
              <span>Téléversé le {doc.uploadedDate}</span>
            </div>
            <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-[#19345e]/80'}`}>
              <DocumentChartBarIcon className="h-4 w-4 text-gray-500" />
              <span>{doc.fileType} • {doc.size}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor} ${darkMode ? 'bg-opacity-30' : ''}`}>
                {doc.statut}
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 ${
                darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setPreviewDocument(doc)}
            >
              <EyeIcon className="h-4 w-4" />
              Aperçu
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                activeTab === "telecharger" || doc.statut === "Transmis"
                  ? "bg-[#19345e] text-white hover:bg-[#19345e]/90"
                  : "bg-amber-500 text-white hover:bg-amber-600"
              }`}
              onClick={() => activeTab === "telecharger" || doc.statut === "Transmis" 
                ? window.open(doc.originalData.filePath, '_blank') 
                : setShowUploadModal(true)
              }
            >
              {activeTab === "telecharger" || doc.statut === "Transmis" ? (
                <>
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Télécharger
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-4 w-4" />
                  Transmettre
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Render skeleton loaders
  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, index) => (
      <div 
        key={`skeleton-${index}`} 
        className={`rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm p-6 animate-pulse`}>
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} h-14 w-14`}></div>
          <div className="flex-1">
            <div className={`h-5 ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded w-3/4 mb-2`}></div>
            <div className={`h-4 ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded w-1/2`}></div>
          </div>
        </div>
        <div className={`h-4 ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded w-full mb-2`}></div>
        <div className={`h-4 ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded w-5/6 mb-6`}></div>
        <div className="space-y-3">
          <div className={`h-4 ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded w-full`}></div>
          <div className={`h-4 ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded w-full`}></div>
          <div className={`h-4 ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded w-3/4`}></div>
        </div>
        <div className="mt-6 flex gap-2">
          <div className={`h-10 ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded flex-1`}></div>
          <div className="h-10 bg-blue-200 rounded flex-1"></div>
        </div>
      </div>
    ));
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-white'}`}>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main 
          className={`flex-1 overflow-y-auto ${
            darkMode 
              ? 'bg-slate-900' 
              : 'bg-[#f8fafc]'
          }`}
        >
          {/* Banner with welcome message */}
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                className="p-6 rounded-none bg-gradient-to-r from-[#19345e] to-[#235789] text-white shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0, padding: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Bienvenue dans votre Espace Documentation</h2>
                    <p className="text-[#bfddf9]">Retrouvez ici tous vos documents techniques et administratifs</p>
                  </div>
                  <button 
                    onClick={() => setShowWelcome(false)} 
                    className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="px-8 py-6 max-w-7xl mx-auto w-full space-y-6">
            {/* Top action bar with notifications and theme toggle */}
            <div className="flex justify-between items-center mb-2">
              <div className={`flex items-center gap-2 ${darkMode ? 'text-white' : 'text-[#19345e]'}`}>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Theme toggle */}
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-lg flex items-center gap-2 ${
                    darkMode 
                      ? 'bg-slate-800 text-white hover:bg-slate-700' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  } shadow-sm`}
                >
                  <div className={`w-8 h-4 rounded-full relative ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 left-0.5 bg-white w-3 h-3 rounded-full transition-transform ${
                      darkMode ? 'transform translate-x-4' : ''
                    }`}></div>
                  </div>
                </button>
                
                <div ref={notificationRef} className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`p-2 rounded-lg relative ${
                      darkMode 
                        ? 'bg-slate-800 text-white hover:bg-slate-700' 
                        : 'bg-white text-[#19345e] hover:bg-gray-100'
                    } shadow-sm`}
                  >
                    <BellIcon className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500"></span>
                  </button>
                  
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg z-20 overflow-hidden ${
                        darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100'
                      }`}
                    >
                      <div className={`p-3 border-b ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                        <h3 className="font-medium">Notifications</h3>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        <div className={`p-3 border-b ${darkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-gray-100 hover:bg-gray-50'}`}>
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Nouveau document disponible</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Le rapport de performance est prêt à être téléchargé</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Il y a 2 heures</p>
                        </div>
                        <div className={`p-3 border-b ${darkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-gray-100 hover:bg-gray-50'}`}>
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Rappel: Document à transmettre</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Le certificat d&apos;économie d&apos;énergie est en attente</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Hier</p>
                        </div>
                        <div className={`p-3 ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}`}>
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Maintenance programmée</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Une visite de maintenance est prévue le 15/04/2024</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Il y a 3 jours</p>
                        </div>
                      </div>
                      <div className={`p-2 border-t ${darkMode ? 'border-slate-700' : 'border-gray-100'} text-center`}>
                        <a href="#" className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          Voir toutes les notifications
                        </a>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Header and stats */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1"
              >
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#19345e]'}`}>
                  Mes Documents
                </h1>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Gérer et consulter vos documents techniques et administratifs
                </p>
                
                {/* Quick filter tags */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-2 mt-3"
                >
                  {quickTags.map((tag: QuickTag, index: number) => (
                    <button
                      key={index}
                      className={`px-3 py-1 text-xs rounded-full ${tag.color} flex items-center gap-1 ${
                        darkMode ? 'bg-opacity-30 hover:bg-opacity-50' : 'hover:shadow-sm'
                      }`}
                      onClick={() => {
                        // Quick filter implementation would go here
                        if (tag.filter.importance) {
                          // Filter by importance
                        } else if (tag.filter.statut) {
                          setFilterStatus(tag.filter.statut);
                        } else if (tag.filter.category) {
                          setFilterCategory(tag.filter.category);
                        }
                      }}
                    >
                      {tag.name}
                    </button>
                  ))}
                </motion.div>
              </motion.div>
              
              <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className={`px-4 py-3 rounded-xl shadow-sm ${
                    darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100'
                  }`}
                >
                  <p className={`text-xs uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#19345e]'}`}>{getTotalDocuments()}</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className={`px-4 py-3 rounded-xl shadow-sm ${
                    darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100'
                  }`}
                >
                  <p className={`text-xs uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>En attente</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#19345e]'}`}>{getPendingDocuments()}</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className={`px-4 py-3 rounded-xl shadow-sm ${
                    darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100'
                  }`}
                >
                  <p className={`text-xs uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Favoris</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#19345e]'}`}>{getFavoriteDocuments()}</p>
                </motion.div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className={`border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("telecharger")}
                  className={`py-4 px-1 inline-flex items-center border-b-2 text-sm font-medium ${
                    activeTab === "telecharger"
                      ? darkMode 
                        ? "border-blue-500 text-blue-500" 
                        : "border-[#19345e] text-[#19345e]"
                      : darkMode
                        ? "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  Documents à télécharger
                </button>
                <button
                  onClick={() => setActiveTab("transmettre")}
                  className={`py-4 px-1 inline-flex items-center border-b-2 text-sm font-medium ${
                    activeTab === "transmettre"
                      ? darkMode 
                        ? "border-blue-500 text-blue-500" 
                        : "border-[#19345e] text-[#19345e]"
                      : darkMode
                        ? "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                  Documents à transmettre
                </button>
              </div>
            </div>

            {/* Filters Section */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative lg:flex-1">
                <MagnifyingGlassIcon className={`h-5 w-5 absolute left-3 top-3 ${darkMode ? 'text-gray-400' : 'text-[#19345e]/70'}`} />
                <input
                  type="text"
                  placeholder="Rechercher un document..."
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 shadow-sm ${
                    darkMode 
                      ? 'bg-slate-800 border-slate-700 text-white focus:ring-blue-500/50' 
                      : 'bg-white border-gray-200 focus:ring-[#19345e]/60'
                  }`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4">
                <div ref={filterRef} className="relative">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`h-full px-4 py-3 rounded-lg flex items-center gap-2 shadow-sm ${
                      darkMode 
                        ? 'bg-slate-800 border border-slate-700 text-white' 
                        : 'bg-white border border-gray-200 text-[#19345e]'
                    }`}
                  >
                    <AdjustmentsHorizontalIcon className="h-5 w-5" />
                    <span>Filtres</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </button>
                  
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg z-20 overflow-hidden ${
                        darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100'
                      }`}
                    >
                      <div className={`p-4 border-b ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-medium">Filtres avancés</h3>
                          <button 
                            onClick={resetFilters}
                            className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
                          >
                            Réinitialiser
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Catégorie
                            </label>
                            <select
                              className={`w-full px-3 py-2 rounded border text-sm ${
                                darkMode 
                                  ? 'bg-slate-700 border-slate-600 text-white' 
                                  : 'bg-white border-gray-200 text-gray-800'
                              }`}
                              value={filterCategory}
                              onChange={(e) => setFilterCategory(e.target.value)}
                            >
                              {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Statut
                            </label>
                            <select
                              className={`w-full px-3 py-2 rounded border text-sm ${
                                darkMode 
                                  ? 'bg-slate-700 border-slate-600 text-white' 
                                  : 'bg-white border-gray-200 text-gray-800'
                              }`}
                              value={filterStatus}
                              onChange={(e) => setFilterStatus(e.target.value)}
                            >
                              {statuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Trier par
                            </label>
                            <div className="flex gap-2">
                              <select
                                className={`flex-1 px-3 py-2 rounded border text-sm ${
                                  darkMode 
                                    ? 'bg-slate-700 border-slate-600 text-white' 
                                    : 'bg-white border-gray-200 text-gray-800'
                                }`}
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                              >
                                <option value="date">Date</option>
                                <option value="name">Nom</option>
                                <option value="importance">Importance</option>
                              </select>
                              <button
                                onClick={toggleSortOrder}
                                className={`px-3 rounded border ${
                                  darkMode 
                                    ? 'bg-slate-700 border-slate-600 text-white' 
                                    : 'bg-white border-gray-200 text-gray-800'
                                }`}
                              >
                                <ArrowsUpDownIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-lg shadow-sm ${
                      darkMode 
                        ? `${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-gray-300 border border-slate-700'}` 
                        : `${viewMode === 'grid' ? 'bg-[#19345e] text-white' : 'bg-white text-gray-800 border border-gray-200'}`
                    }`}
                  >
                    <RectangleStackIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-lg shadow-sm ${
                      darkMode 
                        ? `${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-gray-300 border border-slate-700'}` 
                        : `${viewMode === 'list' ? 'bg-[#19345e] text-white' : 'bg-white text-gray-800 border border-gray-200'}`
                    }`}
                  >
                    <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                      <div className="h-0.5 w-full rounded-full bg-current"></div>
                      <div className="h-0.5 w-full rounded-full bg-current"></div>
                      <div className="h-0.5 w-full rounded-full bg-current"></div>
                    </div>
                  </button>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => activeTab === "transmettre" ? setShowUploadModal(true) : null}
                  className={`px-4 py-3 rounded-lg shadow flex items-center justify-center gap-2 ${
                    activeTab === "transmettre" 
                      ? darkMode
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "bg-[#19345e] text-white hover:bg-[#19345e]/90"
                      : darkMode
                        ? "bg-slate-700 text-gray-400 cursor-not-allowed"
                        : "bg-gray-400 text-white cursor-not-allowed"
                  }`}
                >
                  {activeTab === "transmettre" ? (
                    <>
                      <PaperAirplaneIcon className="h-5 w-5" />
                      <span>Transmettre</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownTrayIcon className="h-5 w-5" />
                      <span>Télécharger tout</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Loading State - Skeleton */}
            {loading && (
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 ${
                viewMode === 'list' ? '!grid-cols-1' : ''
              }`}>
                {renderSkeletons()}
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-center py-16 rounded-xl shadow-sm border ${
                  darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-red-100'
                }`}
              >
                <div className="mx-auto max-w-md">
                  <ExclamationCircleIcon className={`h-16 w-16 mx-auto mb-4 ${
                    darkMode ? 'text-red-500' : 'text-red-400'
                  }`} />
                  <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-[#19345e]'}`}>
                    Erreur lors du chargement
                  </h3>
                  <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-[#19345e]/70'}`}>{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className={`mt-6 px-6 py-2 rounded-lg flex items-center justify-center mx-auto gap-2 ${
                      darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-[#19345e] text-white hover:bg-[#19345e]/90'
                    }`}
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                    Réessayer
                  </button>
                </div>
              </motion.div>
            )}

            {/* Documents Grid/List */}
            {!loading && !error && (
              <div className={`grid gap-6 mt-2 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredDocuments.map((doc) => renderDocumentCard(doc))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredDocuments.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-center py-16 rounded-xl shadow-sm ${
                  darkMode ? 'bg-slate-800' : 'bg-white'
                }`}
              >
                <div className="mx-auto max-w-md">
                  <DocumentTextIcon className={`h-16 w-16 mx-auto mb-4 ${
                    darkMode ? 'text-gray-600' : 'text-[#19345e]/30'
                  }`} />
                  <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-[#19345e]'}`}>
                    Aucun document trouvé
                  </h3>
                  <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-[#19345e]/70'}`}>
                    {activeTab === "telecharger" 
                      ? "Aucun document disponible avec les filtres actuels."
                      : "Vous n'avez pas de documents à transmettre correspondant à ces critères."
                    }
                  </p>
                  <button 
                    onClick={resetFilters}
                    className={`mt-6 px-6 py-2 rounded-lg ${
                      darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-[#19345e] text-white hover:bg-[#19345e]/90'
                    }`}
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !loading && !uploadSuccess && setShowUploadModal(false)}
          >
            <motion.div
              className={`rounded-xl shadow-xl max-w-md w-full p-6 ${
                darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'
              }`}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {uploadSuccess ? (
                <div className="text-center py-6">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className={`mx-auto flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                      darkMode ? 'bg-green-500 bg-opacity-20' : 'bg-green-100'
                    }`}
                  >
                    <CheckIcon className="h-8 w-8 text-green-600" />
                  </motion.div>
                  <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-[#19345e]'}`}>
                    Document transmis !
                  </h3>
                  <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-[#19345e]/70'}`}>
                    Votre document a été transmis avec succès.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-[#19345e]'}`}>
                      Transmettre un document
                    </h3>
                    <button 
                      onClick={() => !loading && setShowUploadModal(false)} 
                      className={`p-1 rounded-full ${darkMode ? 'text-gray-400 hover:text-white hover:bg-slate-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleUpload}>
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Type de document
                        </label>
                        <select 
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                            darkMode 
                              ? 'bg-slate-700 border-slate-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                              : 'border-gray-300 focus:ring-[#19345e] focus:border-[#19345e]'
                          }`}
                          required
                        >
                          <option value="">Sélectionner un type</option>
                          <option value="attestation">Attestation d&apos;assurance</option>
                          <option value="releve">Relevé compteur</option>
                          <option value="facture">Facture</option>
                          <option value="autre">Autre document</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Description
                        </label>
                        <textarea 
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                            darkMode 
                              ? 'bg-slate-700 border-slate-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                              : 'border-gray-300 focus:ring-[#19345e] focus:border-[#19345e]'
                          }`}
                          rows={3}
                          placeholder="Description du document à transmettre"
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Importance
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input type="radio" name="importance" value="faible" className="mr-2" />
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Faible</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name="importance" value="moyenne" className="mr-2" defaultChecked />
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Moyenne</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name="importance" value="haute" className="mr-2" />
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Haute</span>
                          </label>
                        </div>
                      </div>
                      
                      <div 
                        className={`border-2 border-dashed rounded-lg p-6 ${
                          darkMode ? 'border-slate-600 hover:border-slate-500' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="text-center">
                          <DocumentTextIcon className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          <div className="mt-2">
                            <label htmlFor="file-upload" className="relative cursor-pointer">
                              <span className={`font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-[#19345e] hover:text-[#19345e]/80'}`}>
                                Cliquez pour télécharger
                              </span>
                              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}> ou glissez-déposez</span>
                              <input 
                                ref={fileInputRef}
                                id="file-upload" 
                                name="file-upload" 
                                type="file" 
                                className="sr-only" 
                              />
                            </label>
                          </div>
                          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            PDF, JPG, PNG jusqu&apos;à 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium ${
                          darkMode 
                            ? 'border border-slate-600 text-gray-300 bg-slate-700 hover:bg-slate-600' 
                            : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                        } focus:outline-none`}
                        onClick={() => !loading && setShowUploadModal(false)}
                        disabled={loading}
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                          darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#19345e] hover:bg-[#19345e]/90'
                        } focus:outline-none flex items-center gap-2`}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <PaperAirplaneIcon className="h-4 w-4" />
                            Transmettre
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {previewDocument && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewDocument(null)}
          >
            <motion.div
              className={`max-w-4xl w-full rounded-xl shadow-2xl overflow-hidden ${
                darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'
              }`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`flex justify-between items-center p-4 border-b ${
                darkMode ? 'border-slate-700' : 'border-gray-200'
              }`}>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-[#19345e]'}`}>
                  Aperçu du document
                </h3>
                <button
                  onClick={() => setPreviewDocument(null)}
                  className={`p-1 rounded-full ${
                    darkMode ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row h-[70vh]">
                <div className={`flex-1 ${darkMode ? 'bg-slate-900' : 'bg-gray-100'} flex items-center justify-center p-4`}>
                  <div className={`max-w-lg mx-auto rounded-lg overflow-hidden shadow-lg ${
                    darkMode ? 'bg-slate-800' : 'bg-white'
                  }`}>
                    {previewDocument.fileType === "PDF" && (
                      <div className="p-8 text-center">
                        <DocumentTextIcon className={`h-20 w-20 mx-auto mb-4 ${
                          darkMode ? 'text-red-500' : 'text-red-600'
                        }`} />
                        <p className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Aperçu PDF
                        </p>
                        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          L&apos;aperçu direct des PDF n&apos;est pas disponible. Cliquez sur le bouton télécharger pour consulter le document.
                        </p>
                      </div>
                    )}
                    {(previewDocument.fileType === "JPG" || previewDocument.fileType === "PNG") && (
                      <img 
                        src="/api/placeholder/400/300" 
                        alt={previewDocument.name} 
                        className="w-full h-auto"
                      />
                    )}
                  </div>
                </div>
                
                <div className={`w-full md:w-80 p-4 border-t md:border-t-0 md:border-l ${
                  darkMode ? 'border-slate-700' : 'border-gray-200'
                } overflow-y-auto`}>
                  <div className="space-y-4">
                    <div>
                      <h4 className={`text-xs uppercase tracking-wide ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Nom du document</h4>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {previewDocument.name}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className={`text-xs uppercase tracking-wide ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Catégorie</h4>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {previewDocument.category}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className={`text-xs uppercase tracking-wide ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Solution</h4>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {previewDocument.solution}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className={`text-xs uppercase tracking-wide ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Date de téléversement</h4>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {previewDocument.uploadedDate}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className={`text-xs uppercase tracking-wide ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Format</h4>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {previewDocument.fileType} ({previewDocument.size})
                      </p>
                    </div>
                    
                    <div>
                      <h4 className={`text-xs uppercase tracking-wide ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Statut</h4>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        previewDocument.statut === "Disponible" || previewDocument.statut === "Validé" || previewDocument.statut === "Payée"
                          ? "bg-green-100 text-green-800" 
                          : previewDocument.statut === "À transmettre"
                          ? "bg-amber-100 text-amber-800"
                          : previewDocument.statut === "Transmis"
                          ? "bg-blue-100 text-blue-800"
                          : previewDocument.statut === "En attente"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      } ${darkMode ? 'bg-opacity-30' : ''}`}>
                        {previewDocument.statut}
                      </span>
                    </div>
                    
                    {previewDocument.description && (
                      <div>
                        <h4 className={`text-xs uppercase tracking-wide ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>Description</h4>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {previewDocument.description}
                        </p>
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                          activeTab === "telecharger" || previewDocument.statut === "Transmis"
                            ? darkMode ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-[#19345e] text-white hover:bg-[#19345e]/90"
                            : darkMode ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-amber-500 text-white hover:bg-amber-600"
                        }`}
                        onClick={() => {
                          if (activeTab === "telecharger" || previewDocument.statut === "Transmis") {
                            window.open(previewDocument.originalData.filePath, '_blank');
                          } else {
                            setPreviewDocument(null);
                            setShowUploadModal(true);
                          }
                        }}
                      >
                        {activeTab === "telecharger" || previewDocument.statut === "Transmis" ? (
                          <>
                            <ArrowDownTrayIcon className="h-5 w-5" />
                            Télécharger
                          </>
                        ) : (
                          <>
                            <PaperAirplaneIcon className="h-5 w-5" />
                            Transmettre
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}