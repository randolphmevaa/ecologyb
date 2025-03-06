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
}

interface FormattedDocument {
  id: string;
  name: string;
  solution: string;
  uploadedDate: string;
  fileType: string;
  size: string;
  category: string;
  originalData: ApiDocument;
}

interface Contact {
  contactId: string;
  id: string;
  // other properties if known
}

interface ClientInfo {
  email: string;
  role: string;
  contact: Contact | undefined; // Assuming contact can be undefined
  // Define specific known additional properties if needed, not [key: string]: any;
}

export default function ClientDocuments() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("Tous");
  const [documents, setDocuments] = useState<FormattedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to format date from API format (DD/MM/YYYY) to display format (YYYY-MM-DD)
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  // Function to get file size
  const getFileSize = (): string => {
    // Since we don't have actual file size from the API, 
    // we're returning a placeholder value
    return "1.0MB";
  };

  // Function to get file type from filePath
  const getFileType = (filePath: string): string => {
    if (!filePath) return "Unknown";
    const extension = filePath.split('.').pop();
    return extension ? extension.toUpperCase() : "Unknown";
  };

  // Function to map document type to category
  const mapTypeToCategory = (type: string): string => {
    const categoryMap: Record<string, string> = {
      "autre": "Autres documents",
      "manuel": "Manuels techniques",
      "guide": "Guides utilisateur",
      "entretien": "Maintenance",
      "tech": "Spécifications techniques",
      "facture": "Factures"
    };
    
    return categoryMap[type.toLowerCase()] || "Autres documents";
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch documents from API
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        
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
          // Fallback to default contactId if localStorage fails
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
        
        // Transform API data to match our component's expected format
        const transformedData: FormattedDocument[] = data.map((doc) => ({
          id: doc._id,
          name: doc.solution || "Document sans nom",
          solution: doc.solution || "Non spécifié",
          uploadedDate: formatDate(doc.date) || "Date inconnue",
          fileType: getFileType(doc.filePath),
          size: getFileSize(),
          category: mapTypeToCategory(doc.type),
          originalData: doc
        }));
        
        setDocuments(transformedData);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "Tous" || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = ["Tous", ...Array.from(new Set(documents.map(doc => doc.category)))];

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6"
          style={{
            background: "linear-gradient(135deg, rgba(191,221,249,0.1) 0%, rgba(210,252,178,0.05) 100%)",
          }}>
          
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
                    <h2 className="text-xl font-bold">Votre Documentation Énergétique</h2>
                    <p className="text-[#bfddf9]">Tous vos documents techniques à portée de main</p>
                  </div>
                  <button onClick={() => setShowWelcome(false)} className="text-white opacity-80 hover:opacity-100">×</button>
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
              <h1 className="text-3xl font-bold text-[#213f5b]">
                Mes Documents
              </h1>
              <p className="text-gray-600">
                Gérer et consulter vos documents techniques
              </p>
            </motion.div>
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
                placeholder="Rechercher un document..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#bfddf9]/30 focus:outline-none focus:ring-2 focus:ring-[#213f5b]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select
              className="px-4 py-2 rounded-lg border border-[#bfddf9]/30 text-[#213f5b] focus:outline-none focus:ring-2 focus:ring-[#213f5b]"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <button className="px-4 py-2 bg-[#213f5b] text-white rounded-lg shadow hover:shadow-md hover:bg-[#213f5b]/90 flex items-center justify-center gap-2">
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>Téléverser un document</span>
            </button>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="mx-auto max-w-md">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#213f5b] mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-[#213f5b]">Chargement des documents...</h3>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="mx-auto max-w-md">
                <DocumentTextIcon className="h-20 w-20 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#213f5b]">Erreur lors du chargement</h3>
                <p className="mt-2 text-[#213f5b]/70">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-4 py-2 bg-[#213f5b] text-white rounded-lg"
                >
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
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-white rounded-xl shadow-sm overflow-hidden border border-[#bfddf9]/20 hover:border-[#d2fcb2]/50 transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-[#d2fcb2]/30 rounded-lg">
                        <DocumentTextIcon className="h-8 w-8 text-[#213f5b]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#213f5b]">{doc.name}</h3>
                        <p className="text-sm text-[#213f5b]/70">{doc.category}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-[#213f5b]/80">
                      <div className="flex items-center gap-2">
                        <FolderIcon className="h-4 w-4" />
                        <span>{doc.solution}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4" />
                        <span>Téléchargé le {doc.uploadedDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DocumentChartBarIcon className="h-4 w-4" />
                        <span>{doc.fileType} • {doc.size}</span>
                      </div>
                      {doc.originalData.statut && (
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            doc.originalData.statut === "Soumis" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {doc.originalData.statut}
                          </span>
                        </div>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="w-full mt-6 py-2 px-4 bg-[#213f5b] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#213f5b]/90 transition-colors"
                      onClick={() => window.open(doc.originalData.filePath, '_blank')}
                    >
                      Télécharger
                      <ArrowDownTrayIcon className="h-4 w-4" />
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
              className="text-center py-12"
            >
              <div className="mx-auto max-w-md">
                <DocumentTextIcon className="h-20 w-20 text-[#213f5b]/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#213f5b]">Aucun document trouvé</h3>
                <p className="mt-2 text-[#213f5b]/70">Essayez d&apos;ajuster votre recherche ou filtre.</p>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}