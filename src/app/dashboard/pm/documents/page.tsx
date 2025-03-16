"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
// import { jsPDF } from "jspdf";

import {
  FolderIcon,
  DocumentTextIcon,
  // PlusCircleIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  ArrowsUpDownIcon,
  DocumentDuplicateIcon,
  DocumentArrowUpIcon,
  DocumentChartBarIcon,
  ShareIcon,
  TagIcon,
  TrashIcon,
  CloudArrowUpIcon,
  // ArrowPathIcon,
  BellAlertIcon,
  FolderArrowDownIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ChatBubbleLeftIcon,
  // StarIcon,
  // BookmarkIcon,
  ArchiveBoxIcon,
  FireIcon,
  CalendarIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

/** ---------------------
 *    TYPE DEFINITIONS
 *  --------------------- */
type DocumentCategory = "Contrat" | "Rapport" | "Guide" | "Formulaire" | "Autre";
type DocumentStatus = "Brouillon" | "À valider" | "Validé" | "Archivé";
type DocumentDirection = "À télécharger" | "À transmettre";
type DocumentFormat = "PDF" | "DOC" | "DOCX" | "XLS" | "XLSX" | "JPG" | "PNG";

interface Document {
  _id?: string;
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  format: DocumentFormat;
  status: DocumentStatus;
  direction: DocumentDirection;
  urgency?: "Faible" | "Moyenne" | "Haute";
  deadline?: string;
  tags: string[];
  size: number; // in KB
  upload_date: string;
  last_modified: string;
  owner_id: string;
  shared_with: string[];
  download_count: number;
  view_count: number;
  version: string;
  postedByUserId?: string | null;
  thumbnailUrl?: string;
  regie_id?: string;
  is_new?: boolean;
  has_comments?: boolean;
  comments_count?: number;
}

interface User {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

/** ---------------------
 *     MAIN COMPONENT
 *  --------------------- */
export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userInfo, setUserInfo] = useState<{
    id: unknown; _id: string; email: string 
  } | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDocumentDetailModal, setShowDocumentDetailModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [filter, setFilter] = useState<DocumentStatus | "Tous">("Tous");
  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | "Tous">("Tous");
  const [activeTab, setActiveTab] = useState<DocumentDirection>("À télécharger");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title" | "size" | "category">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [showGridView, setShowGridView] = useState(false);

  // Sample data for documents
  const sampleDocuments: Document[] = [
    // Documents à télécharger (from admin to regie)
    {
      id: "DOC-2025-001",
      title: "Convention de partenariat - Projet Solaire",
      description: "Convention de partenariat pour le projet d'installation de panneaux solaires dans la commune de Montpellier",
      category: "Contrat",
      format: "PDF",
      status: "Validé",
      direction: "À télécharger",
      tags: ["énergie", "solaire", "partenariat", "montpellier"],
      size: 2345,
      upload_date: "2025-02-15T10:30:00Z",
      last_modified: "2025-02-18T14:45:00Z",
      owner_id: "user123",
      shared_with: ["user456", "user789"],
      download_count: 12,
      view_count: 45,
      version: "1.2",
      regie_id: "regie001",
      thumbnailUrl: "https://via.placeholder.com/800x600/213f5b/FFFFFF?text=Convention",
      is_new: true
    },
    {
      id: "DOC-2025-002",
      title: "Rapport d'évaluation - Efficacité énergétique",
      description: "Évaluation des performances énergétiques des bâtiments municipaux",
      category: "Rapport",
      format: "PDF",
      status: "Validé",
      direction: "À télécharger",
      tags: ["énergie", "évaluation", "bâtiment", "municipalité"],
      size: 4567,
      upload_date: "2025-02-12T09:15:00Z",
      last_modified: "2025-02-12T09:15:00Z",
      owner_id: "user123",
      shared_with: ["user456"],
      download_count: 8,
      view_count: 26,
      version: "1.0",
      regie_id: "regie001",
      thumbnailUrl: "https://via.placeholder.com/800x600/213f5b/FFFFFF?text=Rapport"
    },
    {
      id: "DOC-2025-005",
      title: "Inventaire matériel - Éclairage public LED",
      description: "Inventaire des équipements LED pour l'éclairage public",
      category: "Rapport",
      format: "XLSX",
      status: "Validé",
      direction: "À télécharger",
      tags: ["éclairage", "LED", "inventaire", "public"],
      size: 3421,
      upload_date: "2025-01-25T14:10:00Z",
      last_modified: "2025-02-02T10:35:00Z",
      owner_id: "user123",
      shared_with: ["user456"],
      download_count: 16,
      view_count: 34,
      version: "1.3",
      regie_id: "regie001",
      thumbnailUrl: "https://via.placeholder.com/800x600/213f5b/FFFFFF?text=Inventaire",
      has_comments: true,
      comments_count: 3
    },
    {
      id: "DOC-2025-006",
      title: "Guide d'installation - Bornes de recharge",
      description: "Guide technique pour l'installation des bornes de recharge pour véhicules électriques",
      category: "Guide",
      format: "PDF",
      status: "Validé",
      direction: "À télécharger",
      tags: ["borne", "recharge", "électrique", "installation"],
      size: 5432,
      upload_date: "2025-02-28T11:25:00Z",
      last_modified: "2025-03-01T09:40:00Z",
      owner_id: "user456",
      shared_with: ["user123", "user789"],
      download_count: 28,
      view_count: 76,
      version: "2.0",
      regie_id: "regie001",
      thumbnailUrl: "https://via.placeholder.com/800x600/213f5b/FFFFFF?text=Guide+d'installation"
    },
    {
      id: "DOC-2025-007",
      title: "Présentation - Solutions de compostage urbain",
      description: "Présentation des solutions innovantes pour le compostage en milieu urbain",
      category: "Autre",
      format: "PDF",
      status: "Archivé",
      direction: "À télécharger",
      tags: ["compostage", "urbain", "innovation", "présentation"],
      size: 2876,
      upload_date: "2024-12-05T16:50:00Z",
      last_modified: "2024-12-05T16:50:00Z",
      owner_id: "user789",
      shared_with: ["user123", "user456"],
      download_count: 45,
      view_count: 120,
      version: "1.0",
      regie_id: "regie001",
      thumbnailUrl: "https://via.placeholder.com/800x600/213f5b/FFFFFF?text=Présentation"
    },
    {
      id: "DOC-2025-009",
      title: "Cahier des charges - Projet de rénovation thermique",
      description: "Cahier des charges pour le projet de rénovation thermique des logements sociaux",
      category: "Contrat",
      format: "PDF",
      status: "Validé",
      direction: "À télécharger",
      urgency: "Haute",
      tags: ["rénovation", "thermique", "logement", "social"],
      size: 3785,
      upload_date: "2025-03-14T10:20:00Z",
      last_modified: "2025-03-14T10:20:00Z",
      owner_id: "user123",
      shared_with: ["user456"],
      download_count: 4,
      view_count: 12,
      version: "1.0",
      regie_id: "regie001",
      thumbnailUrl: "https://via.placeholder.com/800x600/213f5b/FFFFFF?text=Cahier+des+charges",
      is_new: true
    },
    {
      id: "DOC-2025-010",
      title: "Normes environnementales 2025 - Guide de conformité",
      description: "Guide des nouvelles normes environnementales applicables en 2025",
      category: "Guide",
      format: "PDF",
      status: "Validé",
      direction: "À télécharger",
      tags: ["normes", "environnement", "conformité", "réglementation"],
      size: 2156,
      upload_date: "2025-03-01T14:30:00Z",
      last_modified: "2025-03-01T14:30:00Z",
      owner_id: "user123",
      shared_with: ["user456", "user789"],
      download_count: 32,
      view_count: 67,
      version: "1.0",
      regie_id: "regie001",
      thumbnailUrl: "https://via.placeholder.com/800x600/213f5b/FFFFFF?text=Normes+environnementales"
    },
    
    // Documents à transmettre (from regie to admin)
    {
      id: "DOC-2025-003",
      title: "Plan d'action - Réduction des déchets",
      description: "Plan d'action pour la réduction des déchets dans les espaces publics",
      category: "Guide",
      format: "DOCX",
      status: "À valider",
      direction: "À transmettre",
      urgency: "Moyenne",
      deadline: "2025-03-25T23:59:59Z",
      tags: ["déchets", "plan", "réduction", "public"],
      size: 1876,
      upload_date: "2025-03-01T15:45:00Z",
      last_modified: "2025-03-05T11:30:00Z",
      owner_id: "user456",
      shared_with: ["user123", "user789"],
      download_count: 3,
      view_count: 15,
      version: "2.1",
      regie_id: "regie001",
      thumbnailUrl: "https://via.placeholder.com/800x600/213f5b/FFFFFF?text=Plan+d'action",
      has_comments: true,
      comments_count: 2
    },
    {
      id: "DOC-2025-004",
      title: "Demande de subvention - Projet Mobilité Verte",
      description: "Formulaire de demande de subvention pour le projet de mobilité verte",
      category: "Formulaire",
      format: "PDF",
      status: "Brouillon",
      direction: "À transmettre",
      deadline: "2025-04-15T23:59:59Z",
      tags: ["subvention", "mobilité", "vert", "financement"],
      size: 986,
      upload_date: "2025-03-10T08:20:00Z",
      last_modified: "2025-03-10T08:20:00Z",
      owner_id: "user789",
      shared_with: [],
      download_count: 0,
      view_count: 2,
      version: "0.1",
      regie_id: "regie001",
      thumbnailUrl: "https://via.placeholder.com/800x600/213f5b/FFFFFF?text=Demande+de+subvention"
    },
    {
      id: "DOC-2025-008",
      title: "Accord de confidentialité - Projet Hydrogène",
      description: "Accord de confidentialité pour le nouveau projet de production d'hydrogène vert",
      category: "Contrat",
      format: "DOCX",
      status: "À valider",
      direction: "À transmettre",
      deadline: "2025-03-20T23:59:59Z",
      urgency: "Haute",
      tags: ["hydrogène", "confidentialité", "accord", "projet"],
      size: 1245,
      upload_date: "2025-03-08T13:15:00Z",
      last_modified: "2025-03-12T09:20:00Z",
      owner_id: "user123",
      shared_with: ["user456"],
      download_count: 2,
      view_count: 8,
      version: "1.1",
      regie_id: "regie001",
      thumbnailUrl: "https://via.placeholder.com/800x600/213f5b/FFFFFF?text=Accord+de+confidentialité"
    },
    {
      id: "DOC-2025-011",
      title: "Rapport d'avancement - Premier trimestre 2025",
      description: "Rapport trimestriel sur l'avancement des projets environnementaux",
      category: "Rapport",
      format: "DOCX",
      status: "Brouillon",
      direction: "À transmettre",
      urgency: "Haute",
      deadline: "2025-04-05T23:59:59Z",
      tags: ["rapport", "trimestriel", "avancement", "2025"],
      size: 1820,
      upload_date: "2025-03-15T09:10:00Z",
      last_modified: "2025-03-15T09:10:00Z",
      owner_id: "user456",
      shared_with: [],
      download_count: 0,
      view_count: 1,
      version: "0.3",
      regie_id: "regie001",
      thumbnailUrl: "https://via.placeholder.com/800x600/213f5b/FFFFFF?text=Rapport+d'avancement"
    },
    {
      id: "DOC-2025-012",
      title: "Bilan carbone - Activités 2024",
      description: "Bilan des émissions de carbone pour l'ensemble des activités de 2024",
      category: "Rapport",
      format: "XLSX",
      status: "À valider",
      direction: "À transmettre",
      deadline: "2025-03-31T23:59:59Z",
      urgency: "Moyenne",
      tags: ["bilan", "carbone", "émissions", "2024"],
      size: 2450,
      upload_date: "2025-03-10T14:25:00Z",
      last_modified: "2025-03-12T11:40:00Z",
      owner_id: "user789",
      shared_with: ["user456"],
      download_count: 3,
      view_count: 8,
      version: "1.2",
      regie_id: "regie001",
      thumbnailUrl: "https://via.placeholder.com/800x600/213f5b/FFFFFF?text=Bilan+carbone"
    }
  ];

  // Sample users
  const sampleUsers: User[] = [
    { _id: "user123", id: "user123", firstName: "Thomas", lastName: "Dupont", email: "thomas.dupont@ecologyb.fr" },
    { _id: "user456", id: "user456", firstName: "Marie", lastName: "Laurent", email: "marie.laurent@ecologyb.fr" },
    { _id: "user789", id: "user789", firstName: "Nicolas", lastName: "Martin", email: "nicolas.martin@ecologyb.fr" }
  ];

  useEffect(() => {
    // Simulate API fetch
    setDocuments(sampleDocuments);
    setUsers(sampleUsers);
  }, []);

  useEffect(() => {
    const proInfo = localStorage.getItem("proInfo");
    if (proInfo) {
      setUserInfo(JSON.parse(proInfo));
    }
  }, []);

  const getUserName = (userId: string): string => {
    const user = users.find((u) => u.id === userId || u._id === userId);
    if (!user) return "Utilisateur inconnu";
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || "Utilisateur inconnu";
  };

  const formatSize = (sizeInKB: number): string => {
    if (sizeInKB < 1000) {
      return `${sizeInKB} KB`;
    } else {
      return `${(sizeInKB / 1024).toFixed(2)} MB`;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const getDocumentIcon = (format: DocumentFormat) => {
    switch (format) {
      case "PDF":
        return <DocumentTextIcon className="h-5 w-5 text-red-500" />;
      case "DOC":
      case "DOCX":
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
      case "XLS":
      case "XLSX":
        return <DocumentChartBarIcon className="h-5 w-5 text-green-500" />;
      case "JPG":
      case "PNG":
        return <DocumentDuplicateIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusClasses = (status: DocumentStatus) => {
    if (status === "Brouillon") return "bg-gray-100 text-gray-800";
    if (status === "À valider") return "bg-yellow-100 text-yellow-800";
    if (status === "Validé") return "bg-green-100 text-green-800";
    if (status === "Archivé") return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  const getCategoryClasses = (category: DocumentCategory) => {
    if (category === "Contrat") return "bg-purple-100 text-purple-800";
    if (category === "Rapport") return "bg-blue-100 text-blue-800";
    if (category === "Guide") return "bg-green-100 text-green-800";
    if (category === "Formulaire") return "bg-orange-100 text-orange-800";
    if (category === "Autre") return "bg-gray-100 text-gray-800";
    return "bg-gray-100 text-gray-800";
  };

  const filteredDocuments = documents
    .filter((document) => {
      // First filter by active tab (À télécharger or À transmettre)
      return document.direction === activeTab;
    })
    .filter((document) => {
      if (filter === "Tous") return true;
      return document.status === filter;
    })
    .filter((document) => {
      if (categoryFilter === "Tous") return true;
      return document.category === categoryFilter;
    })
    .filter((document) => {
      if (!searchTerm) return true;
      const searchFields = [
        document.title,
        document.description,
        document.category,
        document.format,
        document.id,
        ...document.tags
      ].map(field => String(field).toLowerCase());
      
      const search = searchTerm.toLowerCase();
      return searchFields.some(field => field.includes(search));
    });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "date":
        comparison =
          new Date(a.last_modified).getTime() - new Date(b.last_modified).getTime();
        break;
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "size":
        comparison = a.size - b.size;
        break;
      case "category":
        comparison = a.category.localeCompare(b.category);
        break;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleSort = (field: "date" | "title" | "size" | "category") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setShowDocumentDetailModal(true);
  };

  const handleDownloadDocument = (doc: Document) => {
    const link = doc.format === "PDF"
      ? `/api/documents/${doc.id}/download`
      : `https://via.placeholder.com/800x600/213f5b/FFFFFF?text=${encodeURIComponent(document.title)}`;
    
      const a = document.createElement('a');
      a.href = link;
      a.download = `${doc.title}.${doc.format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    
    // Update download count locally
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === doc.id 
          ? {...doc, download_count: doc.download_count + 1}
          : doc
      )
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleUploadProgress = () => {
    const timer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    
    return () => clearInterval(timer);
  };

  const handleUploadSubmit = () => {
    if (!selectedFile) return;
    
    // Start upload progress
    handleUploadProgress();
    
    // Simulate upload
    setTimeout(() => {
      // Create new document from form data
      const fileExtension = selectedFile.name.split('.').pop()?.toUpperCase() as DocumentFormat || "PDF";
      
      const newDocument: Document = {
        id: `DOC-${new Date().getFullYear()}-${String(documents.length + 1).padStart(3, '0')}`,
        title: selectedFile.name.split('.')[0],
        description: "Nouveau document téléchargé",
        category: "Autre",
        format: fileExtension === "PDF" || fileExtension === "DOC" || fileExtension === "DOCX" || 
                fileExtension === "XLS" || fileExtension === "XLSX" || fileExtension === "JPG" || 
                fileExtension === "PNG" ? fileExtension : "PDF",
        status: "Brouillon",
        tags: selectedTags,
        size: Math.round(selectedFile.size / 1024), // Convert bytes to KB
        upload_date: new Date().toISOString(),
        last_modified: new Date().toISOString(),
        owner_id: userInfo?._id || "user123",
        shared_with: [],
        download_count: 0,
        view_count: 0,
        version: "1.0",
        regie_id: "regie001",
        thumbnailUrl: `https://via.placeholder.com/800x600/213f5b/FFFFFF?text=${encodeURIComponent(selectedFile.name.split('.')[0])}`,
        direction: activeTab,
      };
      
      setDocuments([newDocument, ...documents]);
      setShowUploadModal(false);
      setSelectedFile(null);
      setSelectedTags([]);
      setUploadProgress(0);
    }, 2000);
  };

  // Calculate statistics based on the active tab
  const docsToDownload = documents.filter(doc => doc.direction === "À télécharger");
  const docsToTransmit = documents.filter(doc => doc.direction === "À transmettre");
  
  const totalDocumentsCurrentTab = activeTab === "À télécharger" ? docsToDownload.length : docsToTransmit.length;
  // const totalDownloads = documents.reduce((sum, doc) => sum + doc.download_count, 0);
  const documentsWaiting = documents.filter(doc => doc.status === "À valider" && doc.direction === activeTab).length;
  const documentsWithDeadline = documents.filter(doc => doc.direction === "À transmettre" && doc.deadline).length;
  const documentsUrgent = documents.filter(doc => doc.urgency === "Haute" && doc.direction === activeTab).length;
  const newDocuments = documents.filter(doc => doc.is_new && doc.direction === activeTab).length;

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return "Expiré";
    if (diffDays === 1) return "1 jour restant";
    return `${diffDays} jours restants`;
  };
  
  const getDeadlineClasses = (deadline?: string) => {
    if (!deadline) return "";
    
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return "text-red-600 font-bold";
    if (diffDays <= 3) return "text-amber-600 font-semibold";
    if (diffDays <= 7) return "text-amber-500";
    return "text-gray-600";
  };
  
  const getUrgencyIcon = (urgency?: string) => {
    if (!urgency) return null;
    
    if (urgency === "Haute") {
      return <FireIcon className="h-4 w-4 text-red-500" title="Urgence haute" />;
    } else if (urgency === "Moyenne") {
      return <ExclamationCircleIcon className="h-4 w-4 text-amber-500" title="Urgence moyenne" />;
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main
          className="flex-1 overflow-y-auto px-8 py-6 space-y-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(191,221,249,0.1) 0%, rgba(210,252,178,0.05) 100%)",
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-[#213f5b]">
                Gestion des Documents
              </h1>
              <p className="text-gray-600">
                Téléchargez, partagez et gérez vos documents en toute simplicité
              </p>
            </motion.div>

            <div className="flex items-center gap-3">
              <div className="bg-white rounded-lg shadow-sm p-1 flex">
                <button 
                  className={`p-2 rounded ${!showGridView ? 'bg-[#213f5b] text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setShowGridView(false)}
                  title="Vue liste"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="21" y1="6" x2="3" y2="6"></line>
                    <line x1="21" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="18" x2="3" y2="18"></line>
                  </svg>
                </button>
                <button 
                  className={`p-2 rounded ${showGridView ? 'bg-[#213f5b] text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setShowGridView(true)}
                  title="Vue grille"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </button>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-all
                  ${activeTab === "À transmettre" ? 'bg-[#213f5b] text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setShowUploadModal(true)}
              >
                <CloudArrowUpIcon className="h-5 w-5" />
                {activeTab === "À transmettre" ? "Transmettre un document" : "Télécharger un document"}
              </motion.button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm p-1 mb-2">
            <div className="flex border-b">
              <button
                className={`relative py-4 px-6 text-sm font-medium transition-all duration-200 flex items-center gap-2
                  ${activeTab === "À télécharger" 
                    ? "text-[#213f5b] before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:bg-[#213f5b]" 
                    : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("À télécharger")}
              >
                <FolderArrowDownIcon className="h-5 w-5" />
                Documents à télécharger
                <span className="ml-1 bg-[#bfddf9]/30 text-[#213f5b] text-xs font-semibold px-2 py-0.5 rounded-full">
                  {docsToDownload.length}
                </span>
                {newDocuments > 0 && (
                  <span className="absolute top-3 right-3 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </button>
              
              <button
                className={`relative py-4 px-6 text-sm font-medium transition-all duration-200 flex items-center gap-2
                  ${activeTab === "À transmettre" 
                    ? "text-[#213f5b] before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:bg-[#213f5b]" 
                    : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("À transmettre")}
              >
                <PaperAirplaneIcon className="h-5 w-5" />
                Documents à transmettre
                <span className="ml-1 bg-[#bfddf9]/30 text-[#213f5b] text-xs font-semibold px-2 py-0.5 rounded-full">
                  {docsToTransmit.length}
                </span>
                {documentsUrgent > 0 && (
                  <span className="absolute top-3 right-3 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Statistics */}
            <motion.div
              className="col-span-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-[#d2fcb2]/20 to-[#bfddf9]/30 border border-[#bfddf9]/30 relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center mb-3 relative z-10">
                  <p className="text-sm font-medium text-[#213f5b]">
                    {activeTab === "À télécharger" ? "Documents disponibles" : "Documents à envoyer"}
                  </p>
                  <div className="p-2 rounded-full bg-white/80 shadow-sm">
                    <FolderIcon className="h-5 w-5 text-[#213f5b]" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#213f5b] relative z-10">
                  {totalDocumentsCurrentTab}
                </p>
                <p className="text-xs text-gray-600 mt-1 relative z-10">
                  {activeTab === "À télécharger" 
                    ? "Documents disponibles à télécharger" 
                    : "Documents à transmettre à l'administrateur"}
                </p>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                  <FolderIcon className="h-24 w-24 text-[#213f5b]" />
                </div>
              </motion.div>

              {activeTab === "À télécharger" ? (
                <motion.div
                  className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-[#bfddf9]/30 to-[#d2fcb2]/20 border border-[#bfddf9]/30 relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-center mb-3 relative z-10">
                    <p className="text-sm font-medium text-[#213f5b]">
                      Nouveaux documents
                    </p>
                    <div className="p-2 rounded-full bg-white/80 shadow-sm">
                      <BellAlertIcon className="h-5 w-5 text-[#213f5b]" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-[#213f5b] relative z-10">
                    {newDocuments}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 relative z-10">
                    Documents récemment ajoutés
                  </p>
                  <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                    <BellAlertIcon className="h-24 w-24 text-[#213f5b]" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-[#bfddf9]/30 to-[#d2fcb2]/20 border border-[#bfddf9]/30 relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-center mb-3 relative z-10">
                    <p className="text-sm font-medium text-[#213f5b]">
                      Échéances
                    </p>
                    <div className="p-2 rounded-full bg-white/80 shadow-sm">
                      <CalendarIcon className="h-5 w-5 text-[#213f5b]" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-[#213f5b] relative z-10">
                    {documentsWithDeadline}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 relative z-10">
                    Documents avec date limite
                  </p>
                  <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                    <CalendarIcon className="h-24 w-24 text-[#213f5b]" />
                  </div>
                </motion.div>
              )}

              <motion.div
                className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-[#d2fcb2]/20 to-[#bfddf9]/30 border border-[#bfddf9]/30 relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center mb-3 relative z-10">
                  <p className="text-sm font-medium text-[#213f5b]">
                    {activeTab === "À télécharger" ? "Commentaires" : "Documents urgents"}
                  </p>
                  <div className="p-2 rounded-full bg-white/80 shadow-sm">
                    {activeTab === "À télécharger" 
                      ? <ChatBubbleLeftIcon className="h-5 w-5 text-[#213f5b]" />
                      : <FireIcon className="h-5 w-5 text-[#213f5b]" />
                    }
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#213f5b] relative z-10">
                  {activeTab === "À télécharger" 
                    ? documents.filter(doc => doc.has_comments && doc.direction === activeTab).length
                    : documentsUrgent
                  }
                </p>
                <p className="text-xs text-gray-600 mt-1 relative z-10">
                  {activeTab === "À télécharger" 
                    ? "Documents avec commentaires" 
                    : "Documents haute priorité"}
                </p>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                  {activeTab === "À télécharger" 
                    ? <ChatBubbleLeftIcon className="h-24 w-24 text-[#213f5b]" />
                    : <FireIcon className="h-24 w-24 text-[#213f5b]" />
                  }
                </div>
              </motion.div>

              <motion.div
                className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-[#bfddf9]/30 to-[#d2fcb2]/20 border border-[#bfddf9]/30 relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center mb-3 relative z-10">
                  <p className="text-sm font-medium text-[#213f5b]">
                    {activeTab === "À télécharger" ? "Téléchargements" : "En attente"}
                  </p>
                  <div className="p-2 rounded-full bg-white/80 shadow-sm">
                    {activeTab === "À télécharger" 
                      ? <ArrowDownTrayIcon className="h-5 w-5 text-[#213f5b]" />
                      : <ClockIcon className="h-5 w-5 text-[#213f5b]" />
                    }
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#213f5b] relative z-10">
                  {activeTab === "À télécharger" 
                    ? documents.filter(doc => doc.direction === activeTab).reduce((sum, doc) => sum + doc.download_count, 0)
                    : documentsWaiting
                  }
                </p>
                <p className="text-xs text-gray-600 mt-1 relative z-10">
                  {activeTab === "À télécharger" 
                    ? "Téléchargements ce mois-ci"
                    : "Documents en attente de validation"
                  }
                </p>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                  {activeTab === "À télécharger" 
                    ? <ArrowDownTrayIcon className="h-24 w-24 text-[#213f5b]" />
                    : <ClockIcon className="h-24 w-24 text-[#213f5b]" />
                  }
                </div>
              </motion.div>
            </motion.div>

            {/* Filters */}
            <div className="col-span-12">
              <motion.div
                className="bg-white rounded-xl shadow-sm p-3 mb-6 flex flex-col sm:flex-row justify-between gap-4 items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                  <div className="group relative rounded-md shadow-sm flex-1 sm:flex-none">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-[#213f5b] transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#213f5b] sm:w-72 focus:shadow-sm"
                      placeholder="Rechercher un document..."
                    />
                  </div>
                  
                  <div className="relative">
                    <button
                      className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors"
                      onClick={() =>
                        document
                          .getElementById("statusFilterDropdown")
                          ?.classList.toggle("hidden")
                      }
                    >
                      <AdjustmentsHorizontalIcon className="h-4 w-4" />
                      Statut
                      {filter !== "Tous" && (
                        <span className="ml-1 flex h-2 w-2 rounded-full bg-[#213f5b]"></span>
                      )}
                    </button>
                    <div
                      id="statusFilterDropdown"
                      className="absolute z-10 mt-1 hidden min-w-[200px] rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transform origin-top-right transition-all"
                    >
                      <div className="p-2">
                        {[
                          "Tous",
                          "Brouillon",
                          "À valider",
                          "Validé",
                          "Archivé"
                        ].map((status) => (
                          <div
                            key={status}
                            className={`px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 transition-colors flex items-center ${
                              filter === status
                                ? "bg-[#bfddf9]/30 font-medium"
                                : ""
                            }`}
                            onClick={() => {
                              setFilter(status as DocumentStatus | "Tous");
                              document
                                .getElementById("statusFilterDropdown")
                                ?.classList.add("hidden");
                            }}
                          >
                            {status === "Brouillon" && <DocumentTextIcon className="h-4 w-4 mr-2 text-gray-500" />}
                            {status === "À valider" && <ClockIcon className="h-4 w-4 mr-2 text-yellow-500" />}
                            {status === "Validé" && <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />}
                            {status === "Archivé" && <ArchiveBoxIcon className="h-4 w-4 mr-2 text-blue-500" />}
                            {status === "Tous" && <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2 text-gray-500" />}
                            {status}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button
                      className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors"
                      onClick={() =>
                        document
                          .getElementById("categoryFilterDropdown")
                          ?.classList.toggle("hidden")
                      }
                    >
                      <TagIcon className="h-4 w-4" />
                      Catégorie
                      {categoryFilter !== "Tous" && (
                        <span className="ml-1 flex h-2 w-2 rounded-full bg-[#213f5b]"></span>
                      )}
                    </button>
                    <div
                      id="categoryFilterDropdown"
                      className="absolute z-10 mt-1 hidden min-w-[200px] rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transform origin-top-right transition-all"
                    >
                      <div className="p-2">
                        {[
                          "Tous",
                          "Contrat",
                          "Rapport",
                          "Guide",
                          "Formulaire",
                          "Autre"
                        ].map((category) => (
                          <div
                            key={category}
                            className={`px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${
                              categoryFilter === category
                                ? "bg-[#bfddf9]/30 font-medium"
                                : ""
                            }`}
                            onClick={() => {
                              setCategoryFilter(category as DocumentCategory | "Tous");
                              document
                                .getElementById("categoryFilterDropdown")
                                ?.classList.add("hidden");
                            }}
                          >
                            {category}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {activeTab === "À transmettre" && (
                    <div className="relative">
                      <button
                        className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors"
                        onClick={() =>
                          document
                            .getElementById("urgencyFilterDropdown")
                            ?.classList.toggle("hidden")
                        }
                      >
                        <FireIcon className="h-4 w-4" />
                        Urgence
                      </button>
                      <div
                        id="urgencyFilterDropdown"
                        className="absolute z-10 mt-1 hidden min-w-[200px] rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transform origin-top-right transition-all"
                      >
                        <div className="p-2">
                          {[
                            "Tous",
                            "Haute",
                            "Moyenne",
                            "Faible"
                          ].map((urgency) => (
                            <div
                              key={urgency}
                              className={`px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 transition-colors flex items-center`}
                              onClick={() => {
                                // Implement urgency filter here
                                document
                                  .getElementById("urgencyFilterDropdown")
                                  ?.classList.add("hidden");
                              }}
                            >
                              {urgency === "Haute" && <FireIcon className="h-4 w-4 mr-2 text-red-500" />}
                              {urgency === "Moyenne" && <ExclamationCircleIcon className="h-4 w-4 mr-2 text-amber-500" />}
                              {urgency === "Faible" && <ClockIcon className="h-4 w-4 mr-2 text-blue-500" />}
                              {urgency === "Tous" && <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2 text-gray-500" />}
                              {urgency}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Trier par:</span>
                  <button 
                    className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${sortBy === "date" ? "bg-[#bfddf9]/30 text-[#213f5b] font-medium" : "hover:bg-gray-100"}`}
                    onClick={() => handleSort("date")}
                  >
                    Date
                    {sortBy === "date" && (
                      <ArrowsUpDownIcon className={`h-3.5 w-3.5 ${sortOrder === "asc" ? "rotate-180" : ""}`} />
                    )}
                  </button>
                  <button 
                    className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${sortBy === "title" ? "bg-[#bfddf9]/30 text-[#213f5b] font-medium" : "hover:bg-gray-100"}`}
                    onClick={() => handleSort("title")}
                  >
                    Titre
                    {sortBy === "title" && (
                      <ArrowsUpDownIcon className={`h-3.5 w-3.5 ${sortOrder === "asc" ? "rotate-180" : ""}`} />
                    )}
                  </button>
                  <button 
                    className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${sortBy === "category" ? "bg-[#bfddf9]/30 text-[#213f5b] font-medium" : "hover:bg-gray-100"}`}
                    onClick={() => handleSort("category")}
                  >
                    Catégorie
                    {sortBy === "category" && (
                      <ArrowsUpDownIcon className={`h-3.5 w-3.5 ${sortOrder === "asc" ? "rotate-180" : ""}`} />
                    )}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Document Table or Grid View */}
            <motion.div
              className="col-span-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {sortedDocuments.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <div className="mx-auto h-24 w-24 text-gray-300">
                    <FolderIcon className="h-24 w-24" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun document trouvé</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {searchTerm 
                      ? "Aucun document ne correspond à votre recherche." 
                      : `Aucun document ${activeTab === "À télécharger" ? "à télécharger" : "à transmettre"} disponible.`}
                  </p>
                </div>
              ) : showGridView ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {sortedDocuments.map((document) => (
                    <motion.div
                      key={document.id}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col h-full group"
                      whileHover={{ y: -4 }}
                    >
                      <div className="relative h-32 bg-[#213f5b]/5 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center justify-center">
                          {getDocumentIcon(document.format)}
                        </div>
                        <img 
                          src={document.thumbnailUrl || "https://via.placeholder.com/400x200/213f5b/FFFFFF?text=Document"} 
                          alt={document.title}
                          className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        {document.is_new && (
                          <div className="absolute top-2 right-2">
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                              Nouveau
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center">
                          <div className="px-4 py-3 text-white w-full flex justify-between items-center">
                            <div className="text-sm font-medium truncate mr-2">
                              {document.title}
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleViewDocument(document)}
                                className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
                                title="Voir le document"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDownloadDocument(document)}
                                className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
                                title="Télécharger"
                              >
                                <ArrowDownTrayIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-[#213f5b] line-clamp-2">{document.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{document.format} • v{document.version}</p>
                          </div>
                          {getUrgencyIcon(document.urgency)}
                        </div>
                        
                        <div className="flex items-center gap-1 mt-auto">
                          <span
                            className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryClasses(
                              document.category
                            )}`}
                          >
                            {document.category}
                          </span>
                          <span
                            className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
                              document.status
                            )}`}
                          >
                            {document.status}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                          <div className="truncate">{formatDate(document.last_modified)}</div>
                          <div className="flex items-center gap-1.5">
                            {document.has_comments && (
                              <div className="flex items-center" title="Commentaires">
                                <ChatBubbleLeftIcon className="h-3.5 w-3.5 mr-0.5 text-blue-500" />
                                {document.comments_count}
                              </div>
                            )}
                            {document.direction === "À transmettre" && document.deadline && (
                              <div className={`flex items-center ${getDeadlineClasses(document.deadline)}`} title="Date limite">
                                <CalendarIcon className="h-3.5 w-3.5 mr-0.5" />
                                {getTimeRemaining(document.deadline)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Document
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Catégorie
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {activeTab === "À télécharger" ? "Modifié le" : "Échéance"}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {activeTab === "À télécharger" ? "Propriétaire" : "Statut"}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sortedDocuments.map((document) => (
                          <tr
                            key={document.id}
                            className="hover:bg-gray-50 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-[#213f5b]/5 rounded-lg flex items-center justify-center group-hover:bg-[#213f5b]/10 transition-colors">
                                  {getDocumentIcon(document.format)}
                                </div>
                                <div className="ml-4 max-w-md">
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm font-medium text-[#213f5b] line-clamp-1">
                                      {document.title}
                                    </div>
                                    {document.is_new && (
                                      <span className="inline-flex items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                        Nouveau
                                      </span>
                                    )}
                                    {document.has_comments && (
                                      <span className="inline-flex items-center text-xs text-blue-500" title="Commentaires">
                                        <ChatBubbleLeftIcon className="h-3.5 w-3.5 mr-0.5" />
                                        {document.comments_count}
                                      </span>
                                    )}
                                    {getUrgencyIcon(document.urgency)}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                    <span>{document.format} • v{document.version}</span>
                                    <span>•</span>
                                    <span>{formatSize(document.size)}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryClasses(
                                  document.category
                                )}`}
                              >
                                {document.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {activeTab === "À télécharger" ? (
                                <>
                                  <div className="text-sm text-gray-900">
                                    {formatDate(document.last_modified)}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Créé le {formatDate(document.upload_date)}
                                  </div>
                                </>
                              ) : (
                                document.deadline ? (
                                  <div className={`text-sm ${getDeadlineClasses(document.deadline)}`}>
                                    {getTimeRemaining(document.deadline)}
                                    <div className="text-xs text-gray-500">
                                      {formatDate(document.deadline)}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-500">
                                    Aucune échéance
                                  </div>
                                )
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {activeTab === "À télécharger" ? (
                                <>
                                  <div className="text-sm text-gray-900">
                                    {getUserName(document.owner_id)}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {document.shared_with.length > 0 
                                      ? `Partagé avec ${document.shared_with.length} utilisateur${document.shared_with.length > 1 ? 's' : ''}`
                                      : "Non partagé"}
                                  </div>
                                </>
                              ) : (
                                <span
                                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
                                    document.status
                                  )}`}
                                >
                                  {document.status}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleViewDocument(document)}
                                  className="text-indigo-600 hover:text-indigo-900 p-1.5 hover:bg-indigo-50 rounded-full transition-colors"
                                  title="Voir le document"
                                >
                                  <EyeIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDownloadDocument(document)}
                                  className={`${activeTab === "À télécharger" ? "text-blue-600 hover:text-blue-900 hover:bg-blue-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"} p-1.5 rounded-full transition-colors`}
                                  title={activeTab === "À télécharger" ? "Télécharger" : "Modifier"}
                                >
                                  {activeTab === "À télécharger" ? <ArrowDownTrayIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
                                </button>
                                <button
                                  className="text-green-600 hover:text-green-900 p-1.5 hover:bg-green-50 rounded-full transition-colors"
                                  title={activeTab === "À télécharger" ? "Partager" : "Transmettre"}
                                >
                                  {activeTab === "À télécharger" ? <ShareIcon className="h-4 w-4" /> : <PaperAirplaneIcon className="h-4 w-4" />}
                                </button>
                                {document.has_comments && (
                                  <button
                                    className="text-blue-600 hover:text-blue-900 p-1.5 hover:bg-blue-50 rounded-full transition-colors"
                                    title="Commentaires"
                                  >
                                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>

      {/* Upload Document Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#213f5b]">
                    Télécharger un document
                  </h2>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {!selectedFile ? (
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-[#213f5b] transition-colors"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4 flex flex-col items-center text-sm text-gray-600">
                        <p className="font-medium text-[#213f5b]">Glissez-déposez un fichier</p>
                        <p>ou</p>
                        <p className="text-[#213f5b] font-medium">Parcourir</p>
                      </div>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          {getDocumentIcon(selectedFile.name.split('.').pop()?.toUpperCase() as DocumentFormat || "PDF")}
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                            <p className="text-xs text-gray-500">{formatSize(Math.round(selectedFile.size / 1024))}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedFile(null)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>

                      {uploadProgress > 0 && uploadProgress < 100 ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-700">Progression</span>
                            <span className="text-gray-700">{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-[#213f5b] h-2.5 rounded-full" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : null}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Catégorie
                        </label>
                        <select
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                        >
                          <option value="Contrat">Contrat</option>
                          <option value="Rapport">Rapport</option>
                          <option value="Guide">Guide</option>
                          <option value="Formulaire">Formulaire</option>
                          <option value="Autre" selected>Autre</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description (optionnelle)
                        </label>
                        <textarea
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                          rows={3}
                          placeholder="Décrivez ce document..."
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tags
                        </label>
                        <div className="relative mt-1">
                          <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm pr-16"
                            placeholder="Ajouter un tag"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                          />
                          <button
                            type="button"
                            onClick={handleAddTag}
                            className="absolute inset-y-0 right-0 flex items-center px-3 bg-gray-50 text-sm text-gray-500 border-l rounded-r-md"
                          >
                            Ajouter
                          </button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedTags.map(tag => (
                            <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#bfddf9]/30 text-[#213f5b]">
                              {tag}
                              <button
                                type="button"
                                className="ml-1.5 inline-flex flex-shrink-0 h-4 w-4 items-center justify-center rounded-full text-[#213f5b] hover:bg-[#bfddf9]/50 focus:outline-none"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                <span className="sr-only">Remove {tag}</span>
                                <XCircleIcon className="h-3 w-3" aria-hidden="true" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Statut initial
                        </label>
                        <select
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                        >
                          <option value="Brouillon" selected>Brouillon</option>
                          <option value="À valider">À valider</option>
                          <option value="Validé">Validé</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Partager avec
                        </label>
                        <select
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                          multiple
                        >
                          {users.map(user => (
                            <option key={user._id || user.id} value={user._id || user.id}>
                              {getUserName(user._id || user.id || '')}
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">Maintenez Ctrl (PC) ou Cmd (Mac) pour sélectionner plusieurs utilisateurs</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    disabled={!selectedFile}
                    onClick={handleUploadSubmit}
                    className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm ${
                      selectedFile 
                        ? "bg-[#213f5b] hover:bg-[#213f5b]/90" 
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Télécharger
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Detail Modal */}
      <AnimatePresence>
        {showDocumentDetailModal && selectedDocument && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#213f5b]">
                    Détails du document
                  </h2>
                  <button
                    onClick={() => setShowDocumentDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <img 
                        src={selectedDocument.thumbnailUrl || "https://via.placeholder.com/400x300/213f5b/FFFFFF?text=Document"}
                        alt={selectedDocument.title}
                        className="w-full h-auto rounded-md mx-auto mb-4 object-cover"
                        style={{ maxHeight: '200px' }}
                      />
                      <div className="flex justify-center gap-2 mt-4">
                        <button
                          onClick={() => handleDownloadDocument(selectedDocument)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#213f5b] text-white rounded-md text-sm"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                          Télécharger
                        </button>
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md text-sm"
                        >
                          <ShareIcon className="h-4 w-4" />
                          Partager
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Informations</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">ID:</span>
                          <span className="text-gray-900">{selectedDocument.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Format:</span>
                          <span className="text-gray-900">{selectedDocument.format}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Taille:</span>
                          <span className="text-gray-900">{formatSize(selectedDocument.size)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Version:</span>
                          <span className="text-gray-900">{selectedDocument.version}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Téléchargements:</span>
                          <span className="text-gray-900">{selectedDocument.download_count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Vues:</span>
                          <span className="text-gray-900">{selectedDocument.view_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-[#213f5b]">{selectedDocument.title}</h3>
                          <p className="text-gray-500">
                            Téléchargé le {formatDate(selectedDocument.upload_date)}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
                            selectedDocument.status
                          )}`}
                        >
                          {selectedDocument.status}
                        </span>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">Description</h4>
                        <p className="mt-1 text-sm text-gray-600">
                          {selectedDocument.description}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Catégorie</h4>
                      <span
                        className={`mt-1 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryClasses(
                          selectedDocument.category
                        )}`}
                      >
                        {selectedDocument.category}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Tags</h4>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedDocument.tags.map(tag => (
                          <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#bfddf9]/30 text-[#213f5b]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Historique des modifications</h4>
                      <div className="mt-2 border-l-2 border-gray-200 pl-4 space-y-4">
                        <div className="relative">
                          <div className="absolute -left-6 mt-1 h-2 w-2 rounded-full bg-[#213f5b]"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {getUserName(selectedDocument.owner_id)} a modifié ce document
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(selectedDocument.last_modified)}
                            </p>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-6 mt-1 h-2 w-2 rounded-full bg-gray-400"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {getUserName(selectedDocument.owner_id)} a téléchargé ce document
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(selectedDocument.upload_date)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Partagé avec</h4>
                      {selectedDocument.shared_with.length > 0 ? (
                        <div className="mt-2 space-y-2">
                          {selectedDocument.shared_with.map(userId => (
                            <div key={userId} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                              <div className="text-sm text-gray-900">{getUserName(userId)}</div>
                              <div className="text-xs text-gray-500">Accès en lecture</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-gray-500">
                          Ce document n&apos;est pas partagé
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDocumentDetailModal(false)}
                    className="inline-flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  >
                    <XCircleIcon className="h-4 w-4" />
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
