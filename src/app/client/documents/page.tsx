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
  // PlusIcon,
  ArrowPathIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

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
  originalData: ApiDocument;
}

// interface Contact {
//   contactId: string;
//   id: string;
// }

// interface ClientInfo {
//   email: string;
//   role: string;
//   contact: Contact | undefined;
// }

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
    originalData: {
      _id: "doc-001",
      type: "manuel",
      date: "15/03/2024",
      statut: "Disponible",
      solution: "SolarPlus 3000",
      contactId: "c72666f5-0b42-4b27-be73-51301bdb5987",
      filePath: "/documents/manual-solarplus-3000.pdf",
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
    originalData: {
      _id: "doc-002",
      type: "facture",
      date: "28/02/2024",
      statut: "Payée",
      solution: "Installation résidentielle",
      contactId: "c72666f5-0b42-4b27-be73-51301bdb5987",
      filePath: "/documents/facture-20240228.pdf",
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
    originalData: {
      _id: "doc-003",
      type: "entretien",
      date: "10/03/2024",
      statut: "Disponible",
      solution: "SolarPlus 3000",
      contactId: "c72666f5-0b42-4b27-be73-51301bdb5987",
      filePath: "/documents/maintenance-solarplus.pdf",
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
    originalData: {
      _id: "doc-004",
      type: "tech",
      date: "15/01/2024",
      statut: "Disponible",
      solution: "Panneaux Solaires EcoMax",
      contactId: "c72666f5-0b42-4b27-be73-51301bdb5987",
      filePath: "/documents/specs-ecomax.pdf",
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
    originalData: {
      _id: "doc-005",
      type: "autre",
      date: "02/03/2024",
      statut: "Validé",
      solution: "Installation résidentielle",
      contactId: "c72666f5-0b42-4b27-be73-51301bdb5987",
      filePath: "/documents/attestation-conformite.pdf",
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
    originalData: {
      _id: "doc-006",
      type: "tech",
      date: "10/02/2024",
      statut: "Disponible",
      solution: "Installation personnalisée",
      contactId: "c72666f5-0b42-4b27-be73-51301bdb5987",
      filePath: "/documents/schema-electrique.pdf",
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
    originalData: {
      _id: "trans-001",
      type: "autre",
      date: "12/03/2024",
      statut: "À transmettre",
      solution: "Document administratif",
      contactId: "c72666f5-0b42-4b27-be73-51301bdb5987",
      filePath: "",
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
    originalData: {
      _id: "trans-002",
      type: "autre",
      date: "01/03/2024",
      statut: "Transmis",
      solution: "Suivi énergétique",
      contactId: "c72666f5-0b42-4b27-be73-51301bdb5987",
      filePath: "/documents/releve-mars.jpg",
    }
  }
];

export default function ClientDocuments() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("Tous");
  const [documents, setDocuments] = useState<FormattedDocument[]>([]);
  const [transmitDocuments, setTransmitDocuments] = useState<FormattedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("telecharger");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // // Function to format date from API format (DD/MM/YYYY) to display format (YYYY-MM-DD)
  // const formatDate = (dateString: string): string => {
  //   if (!dateString) return "";
  //   const [day, month, year] = dateString.split('/');
  //   return `${year}-${month}-${day}`;
  // };

  // // Function to get file type from filePath
  // const getFileType = (filePath: string): string => {
  //   if (!filePath) return "Unknown";
  //   const extension = filePath.split('.').pop();
  //   return extension ? extension.toUpperCase() : "Unknown";
  // };

  // // Function to map document type to category
  // const mapTypeToCategory = (type: string): string => {
  //   const categoryMap: Record<string, string> = {
  //     "autre": "Autres documents",
  //     "manuel": "Manuels techniques",
  //     "guide": "Guides utilisateur",
  //     "entretien": "Maintenance",
  //     "tech": "Spécifications techniques",
  //     "facture": "Factures"
  //   };
    
  //   return categoryMap[type.toLowerCase()] || "Autres documents";
  // };

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
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
        
        // In a real implementation, you would fetch from API:
        /*
        // Get contactId from localStorage
        let contactId = "";
        
        try {
          const clientInfoStr = localStorage.getItem('clientInfo');
          if (clientInfoStr) {
            const clientInfo: ClientInfo = JSON.parse(clientInfoStr);
            contactId = clientInfo.contact?.contactId || clientInfo.contact?.id || "";
          }
        } catch (storageError) {
          console.error("Error accessing localStorage:", storageError);
          contactId = "c72666f5-0b42-4b27-be73-51301bdb5987";
        }
        
        if (!contactId) {
          throw new Error("Identifiant de contact non trouvé");
        }
        
        const response = await fetch(`/api/documents?contactId=${contactId}`);
        
        if (!response.ok) {
          throw new Error(`Erreur: ${response.status}`);
        }
        
        const data: ApiDocument[] = await response.json();
        
        // Transform API data
        const transformedData: FormattedDocument[] = data.map((doc) => ({
          id: doc._id,
          name: doc.solution || "Document sans nom",
          solution: doc.solution || "Non spécifié",
          uploadedDate: formatDate(doc.date) || "Date inconnue",
          fileType: getFileType(doc.filePath),
          size: "1.0MB",
          category: mapTypeToCategory(doc.type),
          description: doc.description || "",
          statut: doc.statut || "Disponible",
          originalData: doc
        }));
        
        setDocuments(transformedData);
        */
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

  // Filter documents based on search and category
  const getFilteredDocuments = () => {
    const currentDocs = activeTab === "telecharger" ? documents : transmitDocuments;
    
    return currentDocs.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "Tous" || doc.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const filteredDocuments = getFilteredDocuments();

  // Get unique categories for filter dropdown
  const getCategories = () => {
    const currentDocs = activeTab === "telecharger" ? documents : transmitDocuments;
    return ["Tous", ...Array.from(new Set(currentDocs.map(doc => doc.category)))];
  };

  const categories = getCategories();

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto space-y-6"
          style={{
            background: "linear-gradient(135deg, rgba(191,221,249,0.15) 0%, rgba(210,252,178,0.08) 100%)",
          }}>
          
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

          <div className="px-8 py-4 max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <h1 className="text-3xl font-bold text-[#19345e]">
                Mes Documents
              </h1>
              <p className="text-gray-600">
                Gérer et consulter vos documents techniques et administratifs
              </p>
            </motion.div>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("telecharger")}
                  className={`py-4 px-1 inline-flex items-center border-b-2 text-sm font-medium ${
                    activeTab === "telecharger"
                      ? "border-[#19345e] text-[#19345e]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Documents à télécharger
                </button>
                <button
                  onClick={() => setActiveTab("transmettre")}
                  className={`py-4 px-1 inline-flex items-center border-b-2 text-sm font-medium ${
                    activeTab === "transmettre"
                      ? "border-[#19345e] text-[#19345e]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                  Documents à transmettre
                </button>
              </div>
            </div>

            {/* Filters Section */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="relative md:col-span-5">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-[#19345e]/70" />
                <input
                  type="text"
                  placeholder="Rechercher un document..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#19345e]/60 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="md:col-span-3">
                <select
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-[#19345e] focus:outline-none focus:ring-2 focus:ring-[#19345e]/60 shadow-sm"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-4">
                <button 
                  onClick={() => activeTab === "transmettre" ? setShowUploadModal(true) : null}
                  className={`w-full px-4 py-3 rounded-lg shadow text-white flex items-center justify-center gap-2 transition-all ${
                    activeTab === "transmettre" 
                      ? "bg-[#19345e] hover:bg-[#19345e]/90" 
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {activeTab === "transmettre" ? (
                    <>
                      <PaperAirplaneIcon className="h-5 w-5" />
                      <span>Transmettre un document</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownTrayIcon className="h-5 w-5" />
                      <span>Télécharger tout</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="mx-auto max-w-md">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#19345e] mx-auto mb-4"></div>
                  <h3 className="text-xl font-semibold text-[#19345e]">Chargement des documents...</h3>
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {error && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-white rounded-xl shadow-sm border border-red-100"
              >
                <div className="mx-auto max-w-md">
                  <ExclamationCircleIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#19345e]">Erreur lors du chargement</h3>
                  <p className="mt-2 text-[#19345e]/70">{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-6 px-6 py-2 bg-[#19345e] text-white rounded-lg hover:bg-[#19345e]/90 transition-colors"
                  >
                    <ArrowPathIcon className="h-5 w-5 inline mr-2" />
                    Réessayer
                  </button>
                </div>
              </motion.div>
            )}

            {/* Documents Grid */}
            {!loading && !error && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {filteredDocuments.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md hover:border-[#d2fcb2]/50 transition-all"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-3 rounded-lg ${
                          doc.fileType === "PDF" ? "bg-red-100" : 
                          doc.fileType === "JPG" || doc.fileType === "PNG" ? "bg-blue-100" : 
                          "bg-green-100"
                        }`}>
                          <DocumentTextIcon className={`h-8 w-8 ${
                            doc.fileType === "PDF" ? "text-red-600" : 
                            doc.fileType === "JPG" || doc.fileType === "PNG" ? "text-blue-600" : 
                            "text-green-600"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[#19345e] line-clamp-2">{doc.name}</h3>
                          <p className="text-sm text-[#19345e]/70 mt-1">{doc.category}</p>
                        </div>
                      </div>

                      {doc.description && (
                        <p className="text-sm text-gray-600 my-3 line-clamp-2">{doc.description}</p>
                      )}

                      <div className="space-y-2 text-sm text-[#19345e]/80 mt-4">
                        <div className="flex items-center gap-2">
                          <FolderIcon className="h-4 w-4 text-gray-500" />
                          <span>{doc.solution}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-4 w-4 text-gray-500" />
                          <span>Téléversé le {doc.uploadedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DocumentChartBarIcon className="h-4 w-4 text-gray-500" />
                          <span>{doc.fileType} • {doc.size}</span>
                        </div>
                        {doc.statut && (
                          <div className="flex items-center gap-2 mt-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              doc.statut === "Disponible" || doc.statut === "Validé"
                                ? "bg-green-100 text-green-800" 
                                : doc.statut === "À transmettre"
                                ? "bg-amber-100 text-amber-800"
                                : doc.statut === "Transmis"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {doc.statut}
                            </span>
                          </div>
                        )}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full mt-6 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
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
                            Télécharger
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Transmettre
                            <PaperAirplaneIcon className="h-4 w-4" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredDocuments.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-white rounded-xl shadow-sm"
              >
                <div className="mx-auto max-w-md">
                  <DocumentTextIcon className="h-16 w-16 text-[#19345e]/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#19345e]">Aucun document trouvé</h3>
                  <p className="mt-2 text-[#19345e]/70">
                    {activeTab === "telecharger" 
                      ? "Aucun document disponible au téléchargement pour le moment."
                      : "Vous n'avez pas de documents à transmettre actuellement."
                    }
                  </p>
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !loading && !uploadSuccess && setShowUploadModal(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {uploadSuccess ? (
                <div className="text-center py-6">
                  <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <CheckIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#19345e]">Document transmis !</h3>
                  <p className="mt-2 text-[#19345e]/70">Votre document a été transmis avec succès.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-[#19345e]">Transmettre un document</h3>
                    <button 
                      onClick={() => !loading && setShowUploadModal(false)} 
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleUpload}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type de document
                        </label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#19345e] focus:border-[#19345e]"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#19345e] focus:border-[#19345e]"
                          rows={3}
                          placeholder="Description du document à transmettre"
                        />
                      </div>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <div className="text-center">
                          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-2">
                            <label htmlFor="file-upload" className="relative cursor-pointer">
                              <span className="text-[#19345e] hover:text-[#19345e]/80 font-medium">Cliquez pour télécharger</span>
                              <span className="text-gray-500"> ou glissez-déposez</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">
                            PDF, JPG, PNG jusqu&apos;à 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        onClick={() => !loading && setShowUploadModal(false)}
                        disabled={loading}
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#19345e] hover:bg-[#19345e]/90 focus:outline-none flex items-center gap-2"
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
    </div>
  );
}
