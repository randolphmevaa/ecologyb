"use client";

// import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import UpdatedHeader from "./UpdatedHeader";
import InfoTab from "./InfoTab";
import PhotoTab from "./PhotoTab";
import ChatTab from "./ChatTab";
import SavTab from "./SavTab";
import {
  DocumentTextIcon,
  CloudArrowDownIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  PlusIcon,
  // CloudIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalendarIcon,
  DocumentArrowUpIcon,
  DocumentIcon,
  ArrowPathIcon,
  EyeIcon,
  FolderIcon,
  DocumentArrowDownIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentListIcon,
  DocumentChartBarIcon,
  LockClosedIcon,
  UserIcon, // For the file upload area
} from "@heroicons/react/24/outline";
import { Header } from "@/components/Header";
import PremiumTabs from "./TabsUI";
import ReglementTab from "./ReglementTab";
import DevisFactureTab from "./DevisFactureTab"
import MultiFileUpload from "./MultiFileUpload";

interface DocumentsTabProps {
  contactId: string;
}

interface DocumentData {
  id: string;
  type: string;
  date: string;
  status: string;
  filePath?: string;
}

// Sample data for demonstration
const SAMPLE_DOWNLOADABLE_DOCS: DocumentData[] = [
  {
    id: "1",
    type: "Devis",
    date: "15/03/2025",
    status: "Soumis",
    filePath: ""
  },
  {
    id: "2",
    type: "Facture",
    date: "18/03/2025",
    status: "Soumis",
    filePath: ""
  },
  {
    id: "3",
    type: "Avis d'éligibilité MaPrimeRénov'",
    date: "20/03/2025",
    status: "Soumis",
    filePath: ""
  }
];

const SAMPLE_TRANSMITTABLE_DOCS: DocumentData[] = [
  {
    id: "4",
    type: "Avis d'imposition",
    date: "22/03/2025",
    status: "Manquant",
    filePath: ""
  },
  {
    id: "5",
    type: "Attestation de propriété",
    date: "22/03/2025",
    status: "Manquant",
    filePath: ""
  }
];

// Define the predefined document types in a shared scope.
const predefinedTypes = [
  "Devis",
  "Facture",
  "Avis d'imposition",
  "Attestation de propriété",
  "Avis d'éligibilité MaPrimeRénov'",
  "Autre"
];

// ------------------------
// Types
// ------------------------

interface DossierFormData {
  client: string;
  projet: string;
  solution: string;
  etape: string;
  nombrePersonne?: string;
  valeur: string;
  assignedTeam: string;
  // Additional properties expected by InfoTab
  typeTravaux?: string;
  codePostal?: string;
  mprColor?: string;
  notes: string;
  nombrePersonnes: string;
  informationLogement: {
    typeDeLogement: string;
    surfaceHabitable: string;
    anneeConstruction: string;
    systemeChauffage: string;
  };
  informationTravaux: {
    typeTravaux: string;
    typeUtilisation: string;
    surfaceChauffee: string;
    circuitChauffageFonctionnel: string;
  };
}

// interface DocumentApiResponse {
//   _id: string;
//   type: string;
//   date: string;
//   statut: string;
//   filePath?: string;
// }

interface User {
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender?: string; // Now optional
}

type Dossier = {
  nombrePersonnes: string;
  _id: string;
  numero: string;
  client: string;
  projet: string;
  solution: string;
  etape: string;
  valeur: string;
  assignedTeam?: string;
  notes?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  clientAvatar?: string;
  informationLogement?: {
    typeDeLogement: string;
    surfaceHabitable: string;
    anneeConstruction: string;
    systemeChauffage: string;
  };
  informationTravaux?: {
    typeTravaux: string;
    typeUtilisation: string;
    surfaceChauffee: string;
    circuitChauffageFonctionnel: string;
  };
  contactId?: string;
  
  // Additional properties expected by InfoTab
  nombrePersonne?: string;  // if different from nombrePersonnes
  typeTravaux?: string;
  codePostal?: string;
  mprColor?: string;
  // Add the missing properties (with optional if necessary)
  anneeConstruction?: string;
  typeCompteurElectrique?: string;
  compteurElectrique?: string;
  surfaceChauffee?: string;
  profil?: string;
  typeDeLogement?: string;
  // ... add any other properties that InfoTab requires, marking them optional if necessary
};

type StepProgressProps = {
  currentStep: number;
  onStepClick: (step: number) => void;
};

// ------------------------
// Component: AddDocumentForm
// ------------------------

// When editing an existing document, we pass initialData (including the document id).
// Otherwise, for a new document the initialData prop is omitted.
// interface DocumentInitialData {
//   id: string;
//   docType: string;
//   solution: string;
//   status?: string;
//   customDocType?: string;
// }

// interface AddDocumentFormProps {
//   onClose: () => void;
//   contactId: string;
//   // Optional initial data for editing an existing document.
//   initialData?: DocumentInitialData;
//   // Callback called with the saved document data (after POST or PUT).
//   onDocumentSaved: (doc: DocumentData) => void;
// }

// const AddDocumentForm = ({
//   onClose,
//   contactId,
//   initialData,
//   onDocumentSaved,
// }: AddDocumentFormProps) => {
//   // Initialize state using initialData if provided.
//   const [docType, setDocType] = useState(
//     initialData
//       ? predefinedTypes.includes(initialData.docType)
//         ? initialData.docType
//         : "autre"
//       : ""
//   );
//   const [customDocType, setCustomDocType] = useState(
//     initialData
//       ? predefinedTypes.includes(initialData.docType)
//         ? ""
//         : initialData.customDocType || initialData.docType
//       : ""
//   );
//   const [file, setFile] = useState<File | null>(null);
//   const [status, setStatus] = useState(
//     initialData ? initialData.status || "Manquant" : "Manquant"
//   );
//   // Format current date in French (day/month/year)
//   const currentDate = new Date().toLocaleDateString("fr-FR");
//   const [solution, setSolution] = useState(initialData ? initialData.solution : "");

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0]);
//       setStatus("Soumis");
//     } else {
//       setFile(null);
//       setStatus("Manquant");
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     // Use the custom type if "autre" is selected.
//     const finalDocType = docType === "autre" ? customDocType : docType;
//     if (!finalDocType || !solution || !contactId) {
//       alert("Veuillez remplir tous les champs obligatoires.");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("docType", finalDocType);
//     formData.append("date", currentDate);
//     formData.append("status", status);
//     formData.append("solution", solution);
//     formData.append("contactId", contactId);
//     if (file) {
//       formData.append("file", file);
//     }
//     try {
//       let res;
//       // If initialData exists, update the document via PUT.
//       if (initialData) {
//         res = await fetch(`/api/documents/${initialData.id}`, {
//           method: "PUT",
//           body: formData,
//         });
//       } else {
//         // Otherwise, create a new document via POST.
//         res = await fetch("/api/documents", {
//           method: "POST",
//           body: formData,
//         });
//       }
//       if (!res.ok) throw new Error("Erreur lors de l'enregistrement du document");
//       const savedDoc: DocumentData = await res.json();
//       onDocumentSaved(savedDoc);
//       onClose();
//     } catch (error) {
//       console.error(error);
//       alert("Une erreur est survenue lors de l'enregistrement.");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <h3 className="text-2xl font-semibold text-gray-800 mb-4">
//         Informations du document
//       </h3>
//       {/* Type de document */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Type de document <span className="text-red-500">*</span>
//         </label>
//         <select
//           value={docType}
//           onChange={(e) => setDocType(e.target.value)}
//           className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
//           required
//         >
//           <option value="">Sélectionner le type</option>
//           <option value="avis d'imposition">Avis d&apos;imposition</option>
//           <option value="devis facture">Devis / Facture</option>
//           <option value="checklist PAC">Checklist PAC</option>
//           <option value="note de dimensionnement">Note de dimensionnement</option>
//           <option value="autre">Autre</option>
//         </select>
//       </div>
//       {/* Champ personnalisé pour "autre" */}
//       {docType === "autre" && (
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Spécifiez le type <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             value={customDocType}
//             onChange={(e) => setCustomDocType(e.target.value)}
//             placeholder="Entrez le type personnalisé..."
//             className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
//             required
//           />
//         </div>
//       )}
//       {/* Date de téléversement */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Date de téléversement
//         </label>
//         <input
//           type="text"
//           value={currentDate}
//           disabled
//           className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
//         />
//       </div>
//       {/* Zone de téléversement de fichier */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Fichier
//         </label>
//         <div className="relative">
//           <input
//             id="file-upload"
//             type="file"
//             onChange={handleFileChange}
//             className="hidden"
//           />
//           <label
//             htmlFor="file-upload"
//             className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
//           >
//             <CloudIcon className="w-10 h-10 text-gray-400 mb-2" />
//             {file ? (
//               <span className="text-gray-700">{file.name}</span>
//             ) : (
//               <span className="text-gray-500">
//                 Cliquez ou glissez-déposez votre fichier ici
//               </span>
//             )}
//           </label>
//         </div>
//         {!file && (
//           <p className="mt-1 text-xs text-gray-500">
//             Vous pouvez enregistrer ce document et téléverser le fichier ultérieurement.
//           </p>
//         )}
//       </div>
//       {/* Statut */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Statut
//         </label>
//         <input
//           type="text"
//           value={status}
//           disabled
//           className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
//         />
//       </div>
//       {/* Solution */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Solution <span className="text-red-500">*</span>
//         </label>
//         <select
//           value={solution}
//           onChange={(e) => setSolution(e.target.value)}
//           className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
//           required
//         >
//           <option value="">Sélectionner une solution</option>
//           <option value="Pompes a chaleur">Pompes à chaleur</option>
//           <option value="Chauffe-eau solaire individuel">
//             Chauffe-eau solaire individuel
//           </option>
//           <option value="Chauffe-eau thermodynamique">
//             Chauffe-eau thermodynamique
//           </option>
//           <option value="Système Solaire Combiné">
//             Système Solaire Combiné
//           </option>
//         </select>
//       </div>
//       <div className="flex justify-end">
//         <button
//           type="submit"
//           className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors text-center"
//         >
//           {file ? "Téléverser" : "Enregistrer"}
//         </button>
//       </div>
//     </form>
//   );
// };

// ------------------------
// Component: StepProgress
// ------------------------

function StepProgress({ currentStep, onStepClick }: StepProgressProps) {
  const steps = [
    "Prise de contact",
    "En attente des documents",
    "Instruction du dossier",
    "Dossier Accepter",
    "Installation",
    "Contrôle",
    "Dossier clôturé",
  ];

  // Define weights for each step.
  // Here, steps 2-5 have a weight of 2 while steps 1, 6, and 7 have a weight of 1.
  const stepWeights = [1, 1.25, 1.6, 1.5, 1.4, 2, 1];
  const totalWeight = stepWeights.reduce((sum, weight) => sum + weight, 0);
  const currentWeight = stepWeights
    .slice(0, currentStep)
    .reduce((sum, weight) => sum + weight, 0);
  const progressPercent = (currentWeight / totalWeight) * 100;

  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  // Tooltip animation variants.
  const tooltipVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <div
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={steps.length}
      className="relative px-6 py-10"
    >
      <div className="relative flex items-center justify-between">
        {/* Background Track */}
        <div className="absolute top-1/2 left-0 w-full h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full transform -translate-y-1/2 shadow-inner" />

        {/* Subtle Shimmer Effect */}
        <motion.div
          className="absolute top-1/2 left-0 w-full h-6 bg-white opacity-20 rounded-full transform -translate-y-1/2"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Animated Progress Fill */}
        <motion.div
          className="absolute top-1/2 left-0 h-6 bg-gradient-to-r from-blue-500 via-blue-600 to-green-500 rounded-full transform -translate-y-1/2 shadow-md"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {/* Step Indicators */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={stepNumber}
              className="flex flex-col items-center relative cursor-pointer"
              onClick={() => onStepClick(stepNumber)}
              onMouseEnter={() => setHoveredStep(stepNumber)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <motion.div
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 600, damping: 30 }}
                className={`relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-4 transition-colors duration-300 shadow-xl ${
                  isCompleted
                    ? "bg-green-500 border-green-500"
                    : isCurrent
                    ? "bg-blue-500 border-blue-500"
                    : "bg-white border-gray-300"
                }`}
              >
                {/* Pulsing effect for the current step */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full border border-blue-300"
                    animate={{ scale: [1, 1.7, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  />
                )}
                {isCompleted ? (
                  <motion.svg
                    initial={{ rotate: -90 }}
                    animate={{ rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </motion.svg>
                ) : (
                  <span className={`text-base font-semibold ${isCurrent ? "text-white" : "text-gray-500"}`}>
                    {stepNumber}
                  </span>
                )}
              </motion.div>
              {/* Step Label */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 + index * 0.1 }}
                className={`mt-2 text-center text-xs font-medium ${
                  isCurrent ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
                }`}
              >
                {step}
              </motion.div>
              {/* Tooltip on Hover */}
              <AnimatePresence>
                {hoveredStep === stepNumber && (
                  <motion.div
                    variants={tooltipVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.2 }}
                    className="absolute -top-16 flex flex-col items-center z-10"
                  >
                    <div className="bg-black text-white text-xs px-3 py-1 rounded-md shadow-md">
                      {step}
                    </div>
                    <div className="w-0 h-0 border-x-6 border-t-6 border-x-transparent border-t-black" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ------------------------
// Types for Document Data
// ------------------------
interface DocumentData {
  id: string;
  type: string;
  date: string;
  status: string;
  filePath?: string;
  isAdminOnly?: boolean;
  author?: string;
}

// Update the DocumentsTabProps interface
interface DocumentsTabProps {
  contactId: string;
  isAdmin?: boolean;
}

function DocumentsTab({ contactId, isAdmin = false }: DocumentsTabProps) {
  const [downloadableDocs, setDownloadableDocs] = useState<DocumentData[]>([]);
  const [transmittableDocs, setTransmittableDocs] = useState<DocumentData[]>([]);
  const [adminDocs, setAdminDocs] = useState<DocumentData[]>([]);
  const [searchDownload, setSearchDownload] = useState("");
  const [searchTransmit, setSearchTransmit] = useState("");
  const [searchAdmin, setSearchAdmin] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [docToEdit, setDocToEdit] = useState<DocumentData | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeDownloadTab, setActiveDownloadTab] = useState<string>("all");
  const [activeTransmitTab, setActiveTransmitTab] = useState<string>("all");
  const [activeAdminTab, setActiveAdminTab] = useState<string>("all");

  // For demo purposes, use sample data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setDownloadableDocs(SAMPLE_DOWNLOADABLE_DOCS);
      setTransmittableDocs(SAMPLE_TRANSMITTABLE_DOCS);
      // Add some sample admin docs for demo
      setAdminDocs(SAMPLE_ADMIN_DOCS || []);
      setLoading(false);
    }, 800);
    
    /* Commented out actual API call for demo
    if (contactId) {
      setLoading(true);
      // Fetch regular documents
      fetch(`/api/documents?contactId=${contactId}`)
        .then((res) => res.json())
        .then((data: DocumentApiResponse[]) => {
          const mappedDocs: DocumentData[] = data.map((doc) => ({
            id: doc._id,
            type: doc.type,
            date: doc.date,
            status: doc.statut,
            filePath: doc.filePath,
            isAdminOnly: doc.isAdminOnly || false,
          }));
          const downloadable = mappedDocs.filter((doc) => doc.status === "Soumis" && !doc.isAdminOnly);
          const transmittable = mappedDocs.filter((doc) => doc.status === "Manquant" && !doc.isAdminOnly);
          setDownloadableDocs(downloadable);
          setTransmittableDocs(transmittable);
          
          // If user is admin, fetch admin docs
          if (isAdmin) {
            fetch(`/api/admin-documents?contactId=${contactId}`)
              .then((res) => res.json())
              .then((adminData: DocumentApiResponse[]) => {
                const mappedAdminDocs: DocumentData[] = adminData.map((doc) => ({
                  id: doc._id,
                  type: doc.type,
                  date: doc.date,
                  status: doc.statut,
                  filePath: doc.filePath,
                  isAdminOnly: true,
                }));
                setAdminDocs(mappedAdminDocs);
              })
              .catch((err) => {
                console.error("Error fetching admin documents:", err);
              });
          }
          
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching documents:", err);
          setLoading(false);
        });
    }
    */
  }, [contactId, isAdmin]);

  const filteredDownloadableDocs = downloadableDocs.filter((doc) => {
    const matchesSearch = doc.type.toLowerCase().includes(searchDownload.toLowerCase());
    if (activeDownloadTab === "all") return matchesSearch;
    return matchesSearch && doc.type === activeDownloadTab;
  });
  
  const filteredTransmittableDocs = transmittableDocs.filter((doc) => {
    const matchesSearch = doc.type.toLowerCase().includes(searchTransmit.toLowerCase());
    if (activeTransmitTab === "all") return matchesSearch;
    return matchesSearch && doc.type === activeTransmitTab;
  });
  
  const filteredAdminDocs = adminDocs.filter((doc) => {
    const matchesSearch = doc.type.toLowerCase().includes(searchAdmin.toLowerCase());
    if (activeAdminTab === "all") return matchesSearch;
    return matchesSearch && doc.type === activeAdminTab;
  });

  const handleVisualiser = (doc: DocumentData): void => {
    setPreviewDoc(doc);
  };

  const handleAjouterDocTransmettre = (doc: DocumentData): void => {
    setDocToEdit(doc);
    setIsModalOpen(true);
  };
  
  const handleAjouterDocAdmin = (): void => {
    setDocToEdit(null);
    setIsAdminModalOpen(true);
  };

  // Function to get an icon based on document type
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "Devis":
        return <DocumentTextIcon className="h-8 w-8 text-blue-500" />;
      case "Facture":
        return <DocumentDuplicateIcon className="h-8 w-8 text-green-500" />;
      case "Avis d'imposition":
        return <DocumentArrowDownIcon className="h-8 w-8 text-amber-500" />;
      case "Attestation de propriété":
        return <DocumentIcon className="h-8 w-8 text-purple-500" />;
      case "Avis d'éligibilité MaPrimeRénov'":
        return <DocumentArrowUpIcon className="h-8 w-8 text-red-500" />;
      case "Note interne":
        return <DocumentChartBarIcon className="h-8 w-8 text-indigo-500" />;
      case "Fiche technique":
        return <ClipboardDocumentListIcon className="h-8 w-8 text-cyan-500" />;
      default:
        return <DocumentIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="h-full">
      {/* Enhanced Header with Background */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="relative bg-gradient-to-r from-blue-600 to-blue-400 px-10 py-8 rounded-t-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -mr-16 -mt-20 opacity-30" />
        <div className="absolute bottom-0 right-24 w-32 h-32 bg-blue-300 rounded-full -mb-10 opacity-20" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center">
            <div className="flex items-center justify-center bg-white text-blue-600 rounded-full w-16 h-16 mr-6 shadow-xl">
              <FolderIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-white">
                Documents
              </h2>
              <p className="text-blue-100 mt-1">Gestion des documents clients et administratifs</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              setDocToEdit(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-white text-blue-700 rounded-lg shadow-md hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Ajouter un document</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-b-2xl shadow-xl p-6 pb-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Documents to Download Section */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100"
          >
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -mr-10 -mt-10 opacity-20" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <CloudArrowDownIcon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Documents à télécharger</h2>
              </div>
            </div>
            
            <div className="p-6">
              {/* Enhanced Search and Filter */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="relative flex-1 w-full">
                  <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchDownload}
                    onChange={(e) => setSearchDownload(e.target.value)}
                    placeholder="Rechercher un document..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveDownloadTab("all")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeDownloadTab === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setActiveDownloadTab("Devis")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeDownloadTab === "Devis"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Devis
                  </button>
                  <button
                    onClick={() => setActiveDownloadTab("Facture")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeDownloadTab === "Facture"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Factures
                  </button>
                </div>
              </div>
              
              {/* Document List */}
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="relative">
                    <div className="h-16 w-16 border-4 border-blue-200 border-dashed rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ArrowPathIcon className="h-6 w-6 text-blue-500 animate-pulse" />
                    </div>
                  </div>
                </div>
              ) : filteredDownloadableDocs.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-gray-900 font-medium text-lg mb-1">Aucun document trouvé</h3>
                  <p className="text-gray-500 mb-4">Aucun document ne correspond à vos critères de recherche</p>
                  <button
                    onClick={() => {
                      setDocToEdit(null);
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Ajouter un document
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredDownloadableDocs.map((doc) => (
                    <motion.div
                      key={doc.id}
                      whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 group cursor-pointer hover:border-blue-300"
                      onClick={() => handleVisualiser(doc)}
                    >
                      <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        {getDocumentIcon(doc.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {doc.type}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {doc.date}
                          </div>
                          <div className="flex items-center">
                            <CheckCircleIcon className="h-4 w-4 mr-1 text-green-500" />
                            {doc.status}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVisualiser(doc);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(doc.filePath);
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                        >
                          <ArrowDownTrayIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Documents to Transmit Section */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100"
          >
            <div className="relative bg-gradient-to-r from-green-600 to-green-400 px-6 py-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full -mr-10 -mt-10 opacity-20" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <ArrowUpTrayIcon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Documents à transmettre</h2>
              </div>
            </div>
            
            <div className="p-6">
              {/* Enhanced Search and Filter */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="relative flex-1 w-full">
                  <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTransmit}
                    onChange={(e) => setSearchTransmit(e.target.value)}
                    placeholder="Rechercher un document..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTransmitTab("all")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeTransmitTab === "all"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setActiveTransmitTab("Avis d'imposition")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeTransmitTab === "Avis d'imposition"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Avis
                  </button>
                  <button
                    onClick={() => setActiveTransmitTab("Attestation de propriété")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeTransmitTab === "Attestation de propriété"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Attestation
                  </button>
                </div>
              </div>
              
              {/* Document List */}
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="relative">
                    <div className="h-16 w-16 border-4 border-green-200 border-dashed rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ArrowPathIcon className="h-6 w-6 text-green-500 animate-pulse" />
                    </div>
                  </div>
                </div>
              ) : filteredTransmittableDocs.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-gray-900 font-medium text-lg mb-1">Tous les documents sont transmis</h3>
                  <p className="text-gray-500 mb-4">Il n&apos;y a pas de documents manquants à ce stade</p>
                  <button
                    onClick={() => {
                      setDocToEdit(null);
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Ajouter un document
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredTransmittableDocs.map((doc) => (
                    <motion.div
                      key={doc.id}
                      whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 group cursor-pointer hover:border-green-300"
                    >
                      <div className="p-3 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                        {getDocumentIcon(doc.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {doc.type}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {doc.date}
                          </div>
                          <div className="flex items-center">
                            <ExclamationTriangleIcon className="h-4 w-4 mr-1 text-amber-500" />
                            {doc.status}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleAjouterDocTransmettre(doc)}
                        className="inline-flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-green-600 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                      >
                        <PlusIcon className="h-4 w-4" />
                        Ajouter
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Admin-only Internal Documents Section */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 bg-white rounded-2xl shadow-lg overflow-hidden border border-indigo-100"
          >
            <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-400 px-6 py-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full -mr-10 -mt-10 opacity-20" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <LockClosedIcon className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Documents internes (admin uniquement)</h2>
                </div>
                <button
                  onClick={handleAjouterDocAdmin}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-indigo-700 rounded-lg shadow-md hover:bg-indigo-50 transition-colors"
                >
                  <PlusIcon className="h-5 w-5" />
                  Ajouter document interne
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Enhanced Search and Filter */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="relative flex-1 w-full">
                  <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchAdmin}
                    onChange={(e) => setSearchAdmin(e.target.value)}
                    placeholder="Rechercher un document interne..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveAdminTab("all")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeAdminTab === "all"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setActiveAdminTab("Note interne")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeAdminTab === "Note interne"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Notes
                  </button>
                  <button
                    onClick={() => setActiveAdminTab("Fiche technique")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeAdminTab === "Fiche technique"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Fiches
                  </button>
                </div>
              </div>
              
              {/* Admin Document List */}
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="relative">
                    <div className="h-16 w-16 border-4 border-indigo-200 border-dashed rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ArrowPathIcon className="h-6 w-6 text-indigo-500 animate-pulse" />
                    </div>
                  </div>
                </div>
              ) : filteredAdminDocs.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <LockClosedIcon className="h-12 w-12 text-indigo-400 mx-auto mb-3" />
                  <h3 className="text-gray-900 font-medium text-lg mb-1">Aucun document interne</h3>
                  <p className="text-gray-500 mb-4">Aucun document interne n&apos;a été ajouté pour ce client</p>
                  <button
                    onClick={handleAjouterDocAdmin}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Ajouter document interne
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredAdminDocs.map((doc) => (
                    <motion.div
                      key={doc.id}
                      whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 group cursor-pointer hover:border-indigo-300"
                      onClick={() => handleVisualiser(doc)}
                    >
                      <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                        {getDocumentIcon(doc.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {doc.type}
                          </h3>
                          <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                            Admin uniquement
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {doc.date}
                          </div>
                          <div className="flex items-center">
                            <UserIcon className="h-4 w-4 mr-1 text-indigo-500" />
                            {doc.author || "Admin"}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVisualiser(doc);
                          }}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(doc.filePath);
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                        >
                          <ArrowDownTrayIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

      </motion.div>

      {/* Modal for Add/Edit Document - Enhanced Design */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl w-full max-w-lg relative shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
            >
              {/* Modal header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -mr-10 -mt-10 opacity-20" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                      <DocumentIcon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      {docToEdit ? "Modifier le document" : "Ajouter un document"}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setDocToEdit(null);
                    }}
                    className="text-white/80 hover:text-white transition-colors focus:outline-none"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* For demo purposes, we'll just show a placeholder form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de document
                    </label>
                    <select
                      className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={docToEdit?.type || ""}
                    >
                      <option value="" disabled>Sélectionnez un type</option>
                      {predefinedTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fichiers
                    </label>
                    <MultiFileUpload primaryColor="indigo" accept="application/pdf,image/jpeg,image/png,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Statut
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="Soumis"
                          defaultChecked={docToEdit?.status === "Soumis"}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Soumis</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="Manquant"
                          defaultChecked={docToEdit?.status === "Manquant"}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Manquant</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setDocToEdit(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      // For demo purposes, we'll just close the modal
                      setIsModalOpen(false);
                      setDocToEdit(null);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {docToEdit ? "Mettre à jour" : "Ajouter"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Admin Document Modal */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl w-full max-w-lg relative shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
            >
              {/* Modal header */}
              <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-400 px-6 py-4">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full -mr-10 -mt-10 opacity-20" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                      <LockClosedIcon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Ajouter un document interne
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setIsAdminModalOpen(false);
                    }}
                    className="text-white/80 hover:text-white transition-colors focus:outline-none"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de document interne
                    </label>
                    <select
                      className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      defaultValue=""
                    >
                      <option value="" disabled>Sélectionnez un type</option>
                      <option value="Note interne">Note interne</option>
                      <option value="Fiche technique">Fiche technique</option>
                      <option value="Analyse de dossier">Analyse de dossier</option>
                      <option value="Suivi client">Suivi client</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (visible uniquement par l&apos;administration)
                    </label>
                    <textarea
                      className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows={3}
                      placeholder="Ajoutez une description ou des notes pour ce document..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fichiers
                    </label>
                    <MultiFileUpload primaryColor="blue" />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="admin-only-checkbox"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={true}
                      disabled
                    />
                    <label htmlFor="admin-only-checkbox" className="ml-2 block text-sm text-gray-700">
                      Document visible uniquement par l&apos;administration
                    </label>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setIsAdminModalOpen(false);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      // For demo purposes, we'll just close the modal
                      setIsAdminModalOpen(false);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Ajouter le document
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Document Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewDoc(null)}
          >
            <motion.div
              className="bg-white rounded-xl w-full max-w-4xl mx-4 overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="relative bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg">
                    {getDocumentIcon(previewDoc.type)}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h2 className="text-xl font-bold text-white">
                        {previewDoc.type}
                      </h2>
                      {previewDoc.isAdminOnly && (
                        <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                          Admin uniquement
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-white/70 text-sm">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {previewDoc.date}
                      </div>
                      <div className="flex items-center">
                        {previewDoc.isAdminOnly ? (
                          <>
                            <UserIcon className="h-4 w-4 mr-1 text-indigo-400" />
                            {previewDoc.author || "Admin"}
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon className="h-4 w-4 mr-1 text-green-400" />
                            {previewDoc.status}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="text-white/70 hover:text-white transition-colors focus:outline-none"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              {/* Document preview */}
              <div className="p-2 bg-gray-100">
                {previewDoc.filePath ? (
                  <iframe
                    src={previewDoc.filePath}
                    title="Document Preview"
                    className="w-full h-[70vh] border-none rounded"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <ExclamationTriangleIcon className="h-16 w-16 text-amber-500 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Document non disponible</h3>
                    <p className="text-gray-500 max-w-md text-center">
                      Ce document n&apos;est pas encore disponible. Il est marqué comme &quot;à transmettre&quot;.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Action bar */}
              <div className="px-6 py-4 flex justify-between items-center border-t border-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      // Mock download functionality
                      if (previewDoc.filePath) {
                        window.open(previewDoc.filePath, '_blank');
                      }
                    }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                      previewDoc.filePath
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    } transition-colors`}
                    disabled={!previewDoc.filePath}
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    Télécharger
                  </button>
                  <button
                    onClick={() => {
                      setDocToEdit(previewDoc);
                      setPreviewDoc(null);
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <PencilIcon className="h-5 w-5" />
                    Modifier
                  </button>
                </div>
                
                <button
                  onClick={() => {
                    // For demo purposes, we'll just close the modal
                    setPreviewDoc(null);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SAMPLE_ADMIN_DOCS = [
  {
    id: "a1",
    type: "Note interne",
    date: "18/03/2025",
    status: "Interne",
    filePath: "https://example.com/note-interne.pdf",
    isAdminOnly: true,
    author: "Jean Dupont",
  },
  {
    id: "a2",
    type: "Fiche technique",
    date: "12/03/2025",
    status: "Interne",
    filePath: "https://example.com/fiche-technique.pdf",
    isAdminOnly: true,
    author: "Marie Martin",
  },
];

export default function ProjectDetailPage() {
  
  const { id } = useParams();
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [chatMessageCount ] = useState(3);
  const [formData, setFormData] = useState<DossierFormData>({
    client: "",
    projet: "",
    solution: "",
    etape: "",
    valeur: "",
    assignedTeam: "",
    notes: "",
    nombrePersonnes: "",
    informationLogement: {
      typeDeLogement: "",
      surfaceHabitable: "",
      anneeConstruction: "",
      systemeChauffage: "",
    },
    informationTravaux: {
      typeTravaux: "",
      typeUtilisation: "",
      surfaceChauffee: "",
      circuitChauffageFonctionnel: "",
    },
  });
  const [userList, setUserList] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<
  "info" | "documents" | "photo" | "chat" | "sav" | "reglement" | "devis"
>("info");
  const searchParams = useSearchParams();
  // const { tab } = router.query;

  const getCurrentStep = (etape?: string): number => {
    // If etape is undefined or empty, default to step 1.
    if (!etape) return 1;
  
    const match = etape.match(/^(\d+)/);
    return match ? Number(match[1]) : 1;
  };  

  useEffect(() => {
    if (searchParams.get("tab") === "documents") {
      setActiveTab("documents");
      // Allow the component to render the documents tab before scrolling
      setTimeout(() => {
        const documentsSection = document.getElementById("documents");
        documentsSection?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [searchParams]);

  useEffect(() => {
    if (id) {
      fetch(`/api/dossiers/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setDossier(data);
          setFormData({
            client: data.client,
            projet: data.projet,
            solution: data.solution,
            etape: data.etape,
            valeur: data.valeur,
            assignedTeam: data.assignedTeam || "",
            notes: data.notes || "",
            nombrePersonnes: data.nombrePersonnes,
            informationLogement: data.informationLogement
              ? { ...data.informationLogement }
              : {
                  typeDeLogement: "",
                  surfaceHabitable: "",
                  anneeConstruction: "",
                  systemeChauffage: "",
                },
            informationTravaux: data.informationTravaux
              ? { ...data.informationTravaux }
              : {
                  typeTravaux: "",
                  typeUtilisation: "",
                  surfaceChauffee: "",
                  circuitChauffageFonctionnel: "",
                },
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération du dossier :", error);
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUserList(data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des utilisateurs :", error)
      );
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: DossierFormData) => ({ ...prev, [name]: value }));
  };

  const handleNestedInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    section: "informationLogement" | "informationTravaux"
  ) => {
    const { name, value } = e.target;
    setFormData((prev: DossierFormData) => ({
      ...prev,
      [section]: { ...prev[section], [name]: value },
    }));
  };  

  const handleSave = () => {
    fetch(`/api/dossiers/${dossier?._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((updatedData) => {
        setDossier(updatedData);
        setIsEditing(false);
      })
      .catch((error) =>
        console.error("Erreur lors de la mise à jour du dossier :", error)
      );
  };

  const handleCancel = () => {
    if (dossier) {
      setFormData({
        client: dossier.client,
        projet: dossier.projet,
        solution: dossier.solution,
        etape: dossier.etape,
        valeur: dossier.valeur,
        assignedTeam: dossier.assignedTeam || "",
        notes: dossier.notes || "",
        nombrePersonnes: dossier?.nombrePersonnes,
        informationLogement: dossier.informationLogement
          ? { ...dossier.informationLogement }
          : {
              typeDeLogement: "",
              surfaceHabitable: "",
              anneeConstruction: "",
              systemeChauffage: "",
            },
        informationTravaux: dossier.informationTravaux
          ? { ...dossier.informationTravaux }
          : {
              typeTravaux: "",
              typeUtilisation: "",
              surfaceChauffee: "",
              circuitChauffageFonctionnel: "",
            },
      });
    }
    setIsEditing(false);
  };

  const handleStepClick = async (clickedStep: number) => {
    // Define the array of steps (should match the one used in StepProgress)
    const steps = [
      "Prise de contact",
      "En attente des documents",
      "Instruction du dossier",
      "Dossier Accepter",
      "Installation",
      "Contrôle",
      "Dossier clôturé",
    ];
    
    // Build the new etape string using the clicked step
    const newEtape = `${clickedStep} ${steps[clickedStep - 1]}`;
    
    try {
      // Prepare the updated dossier object (here we update only the etape field)
      const updatedDossierPayload = { ...dossier, etape: newEtape };
  
      // Send the PUT request to update the dossier on the server.
      const res = await fetch(`/api/dossiers/${dossier?._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDossierPayload),
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour du dossier");
      
      // Update the local state with the new dossier data (including the updated etape)
      const updatedData = await res.json();
      setDossier(updatedData);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      // Optionally, you could display an error notification here.
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <p className="text-lg font-semibold">Chargement...</p>
      </div>
    );
  }
  if (!dossier) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <p className="text-lg font-semibold">Dossier non trouvé</p>
      </div>
    );
  }

  // const currentStep = getCurrentStep(dossier.etape);
  // const firstLetter = dossier.client ? dossier.client.charAt(0).toUpperCase() : "";
  
  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
        
        <div className="relative">
          {/* Shape 1 - Top Left (faster animation: 4s) */}
          <svg
            className="absolute left-0 top-0 w-72 h-72 opacity-50 z-0"
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path fill="#bfddf9">
              <animate
                attributeName="d"
                dur="4s"
                repeatCount="indefinite"
                values="
                  M430,280Q370,310,340,360Q310,410,260,430Q210,450,170,410Q130,370,110,320Q90,270,120,230Q150,190,200,180Q250,170,310,180Q370,190,410,230Q450,270,430,280Z;
                  M420,290Q360,320,330,370Q300,420,260,410Q220,400,190,360Q160,320,150,270Q140,220,170,190Q200,160,250,150Q300,140,350,160Q400,180,420,210Q440,240,420,290Z;
                  M430,280Q370,310,340,360Q310,410,260,430Q210,450,170,410Q130,370,110,320Q90,270,120,230Q150,190,200,180Q250,170,310,180Q370,190,410,230Q450,270,430,280Z
                "
              />
            </path>
          </svg>

          {/* Animated Morphing Blob Background (faster animation: 5s) */}
          <svg
            className="absolute inset-0 w-full h-full z-0"
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path fill="#bfddf9">
              <animate
                attributeName="d"
                dur="5s"
                repeatCount="indefinite"
                values="
                  M428.5,283.5Q371,317,338,367.5Q305,418,258.5,428.5Q212,439,166,412Q120,385,97.5,337.5Q75,290,86.5,240Q98,190,131,150.5Q164,111,214,97.5Q264,84,313.5,87Q363,90,406,123.5Q449,157,428.5,283.5Z;
                  M421.5,293.5Q371,337,327,379.5Q283,422,239.5,403Q196,384,160,363.5Q124,343,99.5,299Q75,255,86.5,205.5Q98,156,134,121.5Q170,87,221,90Q272,93,314.5,103.5Q357,114,407,153.5Q457,193,421.5,293.5Z;
                  M428.5,283.5Q371,317,338,367.5Q305,418,258.5,428.5Q212,439,166,412Q120,385,97.5,337.5Q75,290,86.5,240Q98,190,131,150.5Q164,111,214,97.5Q264,84,313.5,87Q363,90,406,123.5Q449,157,428.5,283.5Z
                "
              />
            </path>
          </svg>

          {/* Shape 4 - Bottom Right (faster animation: 4s) */}
          <svg
            className="absolute right-0 bottom-0 w-80 h-80 opacity-40 z-0"
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path fill="#d2fcb2">
              <animate
                attributeName="d"
                dur="4s"
                repeatCount="indefinite"
                values="
                  M420,280Q380,320,340,360Q300,400,260,360Q220,320,180,280Q220,240,260,200Q300,160,340,200Q380,240,420,280Z;
                  M430,290Q390,330,350,370Q310,410,270,370Q230,330,190,290Q230,250,270,210Q310,170,350,210Q390,250,430,290Z;
                  M420,280Q380,320,340,360Q300,400,260,360Q220,320,180,280Q220,240,260,200Q300,160,340,200Q380,240,420,280Z
                "
              />
            </path>
          </svg>

          {/* New Shape 2 - Top Right (improved: longer movement, faster: 4s) */}
          <svg
            className="absolute right-0 top-0 w-64 h-64 opacity-40 z-0"
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path fill="#ffcccb">
              <animate
                attributeName="d"
                dur="4s"
                repeatCount="indefinite"
                values="
                  M400,80 Q440,140,380,220 Q320,300,280,220 Q240,140,280,80 Q320,20,380,60 Q440,100,400,80Z;
                  M410,90 Q450,150,390,230 Q330,310,290,230 Q250,150,290,90 Q330,30,390,70 Q450,110,410,90Z;
                  M400,80 Q440,140,380,220 Q320,300,280,220 Q240,140,280,80 Q320,20,380,60 Q440,100,400,80Z
                "
              />
            </path>
          </svg>

          {/* New Shape 3 - Bottom Left (improved: longer movement, faster: 5s) */}
          {/* <svg
            className="absolute left-0 bottom-0 w-64 h-64 opacity-40 z-0"
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path fill="#90ee90">
              <animate
                attributeName="d"
                dur="5s"
                repeatCount="indefinite"
                values="
                  M80,420 Q130,380,180,440 Q230,500,180,520 Q130,540,80,500 Q30,460,50,420 Q70,380,80,420Z;
                  M90,430 Q140,390,190,450 Q240,510,190,530 Q140,550,90,510 Q40,470,60,430 Q80,390,90,430Z;
                  M80,420 Q130,380,180,440 Q230,500,180,520 Q130,540,80,500 Q30,460,50,420 Q70,380,80,420Z
                "
              />
            </path>
          </svg> */}

          {/* New Shape 5 - Center Top (improved: longer movement, faster: 6s) */}
          <svg
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-48 opacity-30 z-0"
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path fill="#add8e6">
              <animate
                attributeName="d"
                dur="6s"
                repeatCount="indefinite"
                values="
                  M240,40 Q300,110,240,180 Q180,250,120,180 Q60,110,120,40 Q180,-30,240,40Z;
                  M250,50 Q310,120,250,190 Q190,260,130,190 Q70,120,130,50 Q190,-20,250,50Z;
                  M240,40 Q300,110,240,180 Q180,250,120,180 Q60,110,120,40 Q180,-30,240,40Z
                "
              />
            </path>
          </svg>

          {/* New Shape 6 - Center Bottom (improved: longer movement, faster: 6s) */}
          <svg
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-48 opacity-30 z-0"
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path fill="#d8bfd8">
              <animate
                attributeName="d"
                dur="6s"
                repeatCount="indefinite"
                values="
                  M240,440 Q300,390,240,340 Q180,290,120,340 Q60,390,120,440 Q180,490,240,440Z;
                  M250,450 Q310,400,250,350 Q190,300,130,350 Q70,400,130,450 Q190,500,250,450Z;
                  M240,440 Q300,390,240,340 Q180,290,120,340 Q60,390,120,440 Q180,490,240,440Z
                "
              />
            </path>
          </svg>

          {/* Content */}
          <div className="relative z-10">
            <div className="mb-6">
              <Link
                href="/dashboard/admin/projects"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Retour à la liste des projets
              </Link>
            </div>

            {/* UpdatedHeader with modified background */}
            <UpdatedHeader contactId={dossier.contactId || ""} />

            <StepProgress
              currentStep={getCurrentStep(dossier.etape)}
              onStepClick={handleStepClick}
            />
          </div>
        </div>

        <div className="relative z-20">
          <PremiumTabs activeTab={activeTab} setActiveTab={setActiveTab} chatMessageCount={chatMessageCount} />
        </div>

          {activeTab === "info" && (
            <div id="info">
              <InfoTab
                dossier={dossier}
                formData={formData}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                handleInputChange={handleInputChange}
                handleNestedInputChange={handleNestedInputChange}
                userList={userList}
                handleSave={handleSave}
                handleCancel={handleCancel}
              />
          </div>
          )}

          {activeTab === "documents" && (
            <div id="documents">
              <DocumentsTab contactId={dossier.contactId || ""} />
            </div>
          )}

          {activeTab === "photo" && (
            <div id="photo">
              <PhotoTab contactId={dossier.contactId || ""} />
            </div>
          )}

          {activeTab === "chat" && (
            <div id="chat" className="h-full">
              <ChatTab currentContactId={dossier.contactId || ""} />
            </div>
          )}

          {activeTab === "sav" && (
            <div id="sav" className="h-full">
              <SavTab contactId={dossier.contactId || ""}/>
            </div>
          )}

          {activeTab === "reglement" && (
            <div id="reglement" className="h-full">
              <ReglementTab contactId={dossier.contactId || ""} />
            </div>
          )}

          {activeTab === "devis" && (
            <div id="devis" className="h-full">
              <DevisFactureTab contactId={dossier.contactId || ""} />
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
