"use client";

import { useParams } from "next/navigation";
import { useEffect, useState} from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import {
  ClipboardDocumentCheckIcon,
  HomeIcon,
  BriefcaseIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { Header } from "@/components/Header";
import {
  DocumentTextIcon,
  CloudArrowDownIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

// ------------------------
// Types
// ------------------------

// New interface for the form data (used in editing)
interface DossierFormData {
  client: string;
  projet: string;
  solution: string;
  etape: string;
  valeur: string;
  assignedTeam: string;
  notes: string;
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

// New interface for users
interface User {
  email: string;
  role: string;
}

type Dossier = {
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
};

type StepProgressProps = {
  currentStep: number;
};

// ------------------------
// Composant StepProgress
// ------------------------
function StepProgress({ currentStep }: StepProgressProps) {
  const steps = [
    "Prise de contact",
    "En attente des documents",
    "Instruction du dossier",
    "Dossier Accepter",
    "Installation",
    "Contrôle",
    "Dossier clôturé",
  ];

  // Calculate the percentage of progress (for the fill)
  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  // Track hovered step for tooltip display
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  // Tooltip animation variants with a gentle scale and fade effect
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
      className="relative px-4 py-8"
    >
      <div className="relative flex items-center justify-between">
        {/* Background track with subtle shimmer */}
        <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 rounded-full transform -translate-y-1/2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Animated progress fill */}
        <motion.div
          className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-green-500 rounded-full transform -translate-y-1/2"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={stepNumber}
              className="flex flex-col items-center relative"
              onMouseEnter={() => setHoveredStep(stepNumber)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={`relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-4 transition-colors duration-200 ${
                  isCompleted
                    ? "bg-green-500 border-green-500"
                    : isCurrent
                    ? "bg-blue-500 border-blue-500"
                    : "bg-white border-gray-300"
                }`}
              >
                {isCurrent && (
                  // Continuous ripple (pulsating) effect on the current step
                  <motion.div
                    className="absolute inset-0 rounded-full border border-blue-300"
                    animate={{ scale: [1, 1.5, 1] }}
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                ) : (
                  <span
                    className={`text-base font-semibold ${
                      isCurrent ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {stepNumber}
                  </span>
                )}
              </motion.div>

              {/* Step label */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`mt-2 text-center text-xs font-medium ${
                  isCurrent
                    ? "text-blue-600"
                    : isCompleted
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {step}
              </motion.div>

              {/* Tooltip with arrow pointer */}
              <AnimatePresence>
                {hoveredStep === stepNumber && (
                  <motion.div
                    variants={tooltipVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.2 }}
                    className="absolute -top-20 flex flex-col items-center z-10"
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

interface DocumentData {
  id: string;
  type: string;
  date: string;
  status: string;
}

function AddDocumentModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (doc: DocumentData) => void;
}) {
  const [docType, setDocType] = useState("");
  const [docDate, setDocDate] = useState("");
  const [docStatus, setDocStatus] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: DocumentData = {
      id: Date.now().toString(),
      type: docType,
      date: docDate,
      status: docStatus || "En attente",
    };
    onAdd(newDoc);
    // Clear form fields
    setDocType("");
    setDocDate("");
    setDocStatus("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Ajouter un document
              </h3>
              <button onClick={onClose} aria-label="Fermer">
                <XMarkIcon className="h-6 w-6 text-gray-600 hover:text-gray-800" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type de document
                </label>
                <input
                  type="text"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  placeholder="Ex: Devis, Facture, etc."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={docDate}
                  onChange={(e) => setDocDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Statut
                </label>
                <input
                  type="text"
                  value={docStatus}
                  onChange={(e) => setDocStatus(e.target.value)}
                  placeholder="Ex: En attente, Prêt, etc."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <PlusIcon className="h-5 w-5" />
                  Ajouter
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DocumentsTab() {
  // Dummy data – replace these with your actual API data.
  const [downloadableDocs] = useState([
    { id: "doc1", type: "Devis", date: "2024-01-01", status: "Prêt" },
    { id: "doc2", type: "Facture", date: "2024-02-01", status: "Téléchargé" },
  ]);

  const [transmittableDocs, setTransmittableDocs] = useState([
    { id: "doc3", type: "Avis d'imposition", date: "2024-03-01", status: "En attente" },
    { id: "doc4", type: "Autre", date: "2024-03-15", status: "En cours" },
  ]);

  // Search states for filtering
  const [searchDownload, setSearchDownload] = useState("");
  const [searchTransmit, setSearchTransmit] = useState("");
  // Modal state for adding new documents
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredDownloadableDocs = downloadableDocs.filter((doc) =>
    doc.type.toLowerCase().includes(searchDownload.toLowerCase())
  );

  const filteredTransmittableDocs = transmittableDocs.filter((doc) =>
    doc.type.toLowerCase().includes(searchTransmit.toLowerCase())
  );

  const handleVisualiser = (docId: string): void => {
    console.log("Visualiser document", docId);
    // Implement preview/download logic.
  };

  const handleAjouterDocTransmettre = (docId: string): void => {
    console.log("Ajouter document", docId);
    // Implement add/submit logic.
  };

  const handleAddDocument = (newDoc: DocumentData): void => {
    // Here we add the new document to the transmittable list.
    setTransmittableDocs((prev) => [...prev, newDoc]);
  };

  return (
    <>
      <AddDocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddDocument}
      />
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Documents à télécharger */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105"
            whileHover={{ scale: 1.02 }}
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 flex items-center gap-3">
              <CloudArrowDownIcon className="h-10 w-10 text-white" />
              <h2 className="text-2xl font-bold text-white">
                Documents à télécharger
              </h2>
            </div>
            <div className="p-6">
              {/* Search Input */}
              <div className="mb-6">
                <input
                  type="text"
                  value={searchDownload}
                  onChange={(e) => setSearchDownload(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Statut
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDownloadableDocs.map((doc) => (
                      <motion.tr
                        key={doc.id}
                        whileHover={{ backgroundColor: "#f0f4f8" }}
                        transition={{ duration: 0.2 }}
                        className="transition-colors duration-200"
                      >
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {doc.type}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {doc.date}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {doc.status}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleVisualiser(doc.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                          >
                            <DocumentTextIcon className="h-5 w-5" />
                            Visualiser
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                    {filteredDownloadableDocs.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-3 text-sm text-center text-gray-500"
                        >
                          Aucun document trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Documents à transmettre */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col"
            whileHover={{ scale: 1.02 }}
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4 flex items-center gap-3">
              <ArrowUpTrayIcon className="h-10 w-10 text-white" />
              <h2 className="text-2xl font-bold text-white">
                Documents à transmettre
              </h2>
            </div>
            <div className="flex flex-col flex-grow p-6">
              {/* Search Input */}
              <div className="mb-6">
                <input
                  type="text"
                  value={searchTransmit}
                  onChange={(e) => setSearchTransmit(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              </div>
              <div className="overflow-x-auto flex-grow">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-green-500 to-teal-500 text-white sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Statut
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTransmittableDocs.map((doc) => (
                      <motion.tr
                        key={doc.id}
                        whileHover={{ backgroundColor: "#f0f4f8" }}
                        transition={{ duration: 0.2 }}
                        className="transition-colors duration-200"
                      >
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {doc.type}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {doc.date}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {doc.status}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleAjouterDocTransmettre(doc.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-green-700"
                          >
                            <PlusIcon className="h-5 w-5" />
                            Ajouter
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                    {filteredTransmittableDocs.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-3 text-sm text-center text-gray-500"
                        >
                          Aucun document trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Action Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  <PlusIcon className="h-5 w-5" />
                  Ajouter un document (devis, facture, avis d&apos;imposition, autre etc.)
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}

// ------------------------
// Composant Principal
// ------------------------
export default function ProjectDetailPage() {
  const { id } = useParams();
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [loading, setLoading] = useState(true);

  // Mode édition global.
  const [isEditing, setIsEditing] = useState(false);
  // État du formulaire local pour les champs modifiables.
  const [formData, setFormData] = useState<DossierFormData>({
    client: "",
    projet: "",
    solution: "",
    etape: "",
    valeur: "",
    assignedTeam: "",
    notes: "",
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
  // Liste des utilisateurs pour le dropdown "Équipe Assignée".
  const [userList, setUserList] = useState<User[]>([]);
  // État pour la sélection de l'onglet : "info" ou "documents"
  const [activeTab, setActiveTab] = useState<"info" | "documents">("info");
  // État pour les fichiers sélectionnés dans l'onglet Documents.
  // const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // État pour savoir si le dropzone est actif (drag over).
  // const [isDragActive, setIsDragActive] = useState(false);
  // Référence pour le champ input de fichier.
  // const fileInputRef = useRef<HTMLInputElement>(null);

  // Fonction pour extraire l'étape actuelle depuis dossier.etape (on suppose que le numéro de l'étape est au début)
  const getCurrentStep = (etape: string): number => {
    const match = etape.match(/^(\d+)/);
    return match ? Number(match[1]) : 1;
  };

  // Récupération des données du dossier.
  useEffect(() => {
    if (id) {
      fetch(`/api/dossiers/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setDossier(data);
          // Initialiser les données du formulaire avec le dossier récupéré.
          setFormData({
            client: data.client,
            projet: data.projet,
            solution: data.solution,
            etape: data.etape,
            valeur: data.valeur,
            assignedTeam: data.assignedTeam || "",
            notes: data.notes || "",
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

  // Récupération de la liste des utilisateurs pour "Équipe Assignée".
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUserList(data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des utilisateurs :", error)
      );
  }, []);

  // Gestion des changements pour les champs de premier niveau.
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: DossierFormData) => ({ ...prev, [name]: value }));
  };

  // Gestion des changements pour les champs imbriqués (Logement et Travaux).
  const handleNestedInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: "informationLogement" | "informationTravaux"
  ) => {
    const { name, value } = e.target;
    setFormData((prev: DossierFormData) => ({
      ...prev,
      [section]: { ...prev[section], [name]: value },
    }));
  };

  // Sauvegarder les modifications via une requête PUT.
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

  // Annuler l'édition et réinitialiser les données du formulaire.
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

  // ------------------------
  // Gestion du Dropzone pour Documents
  // ------------------------
  // const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  //   setIsDragActive(true);
  // };

  // const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  //   setIsDragActive(false);
  // };

  // const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  //   setIsDragActive(false);
  //   if (e.dataTransfer.files) {
  //     setSelectedFiles(Array.from(e.dataTransfer.files));
  //   }
  // };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     setSelectedFiles(Array.from(e.target.files));
  //   }
  // };

  // const handleUpload = () => {
  //   // Placeholder : ici vous intégrerez la logique de téléversement des fichiers vers votre API.
  //   console.log("Téléversement des fichiers :", selectedFiles);
  //   // Après téléversement, vous pouvez réinitialiser la sélection.
  //   setSelectedFiles([]);
  // };

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

  const currentStep = getCurrentStep(dossier.etape);
  const firstLetter = dossier.client ? dossier.client.charAt(0).toUpperCase() : '';

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={{ name: "Administrateur", avatar: "/admin-avatar.png" }} />
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
          {/* Bouton Retour */}
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

          {/* En-tête */}
          <header className="relative bg-white">
            <div className="">
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="relative bg-white rounded-3xl shadow-2xl p-10 md:flex md:items-center md:justify-between"
              >
                {/* Client Details */}
                <div className="flex flex-col">
                  <motion.h1
                    whileHover={{ scale: 1.02 }}
                    className="text-3xl font-bold text-gray-900"
                  >
                    Projet pour {dossier.client}
                  </motion.h1>
                  <div className="mt-4 space-y-3">
                    <motion.div whileHover={{ x: 5 }} className="flex items-center text-gray-700">
                      <EnvelopeIcon className="w-6 h-6 mr-3" />
                      <span className="text-lg">
                        {dossier.clientEmail || 'client@example.com'}
                      </span>
                    </motion.div>
                    <motion.div whileHover={{ x: 5 }} className="flex items-center text-gray-700">
                      <PhoneIcon className="w-6 h-6 mr-3" />
                      <span className="text-lg">
                        {dossier.clientPhone || '+1 (555) 555-5555'}
                      </span>
                    </motion.div>
                    <motion.div whileHover={{ x: 5 }} className="flex items-center text-gray-700">
                      <MapPinIcon className="w-6 h-6 mr-3" />
                      <span className="text-lg">
                        {dossier.clientAddress || '123 Main St, City, Country'}
                      </span>
                    </motion.div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-gray-500">Dossier {dossier.numero}</span>
                  </div>
                </div>
                {/* Client Avatar with Fallback */}
                <div className="relative z-10 mt-8 md:mt-0 flex-shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-32 h-32"
                  >
                    {dossier.clientAvatar ? (
                      <img
                        src={dossier.clientAvatar}
                        alt="Client Avatar"
                        className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-200 border-4 border-white shadow-md">
                        <span className="text-4xl font-bold text-gray-600">{firstLetter}</span>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </header>

          {/* Step Progress */}
          <StepProgress currentStep={currentStep} />

          {/* En-tête des onglets */}
          <div className="flex border-b border-gray-300 mb-4">
            <button
              onClick={() => setActiveTab("info")}
              className={`px-4 py-2 -mb-px font-semibold ${
                activeTab === "info"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            >
              Cartes d&apos;information
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`px-4 py-2 -mb-px font-semibold ${
                activeTab === "documents"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            >
              Documents
            </button>
          </div>

          {/* Bouton d'édition global (affiché uniquement pour l'onglet "Cartes d'information") */}
          {activeTab === "info" && (
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {isEditing ? "Annuler" : "Modifier"}
              </button>
            </div>
          )}

          {/* Contenu de l'onglet */}
          {activeTab === "info" ? (
            // ------------------------
            // Cartes d'information
            // ------------------------
            <div className="space-y-8">
              {/* Informations Générales */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 transform transition duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center bg-blue-500 text-white rounded-full w-10 h-10 mr-4">
                    <ClipboardDocumentCheckIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-700">
                    Informations Générales
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-700">
                      <span className="font-semibold">Client :</span>{" "}
                      {isEditing ? (
                        <input
                          type="text"
                          name="client"
                          value={formData.client}
                          onChange={handleInputChange}
                          className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                      ) : (
                        dossier.client
                      )}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Projet :</span>{" "}
                      {isEditing ? (
                        <input
                          type="text"
                          name="projet"
                          value={formData.projet}
                          onChange={handleInputChange}
                          className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                      ) : (
                        dossier.projet
                      )}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Solution :</span>{" "}
                      {isEditing ? (
                        <select
                          name="solution"
                          value={formData.solution}
                          onChange={handleInputChange}
                          className="mt-1 p-2 border border-gray-300 rounded w-full"
                        >
                          <option value="Pompes a chaleur">Pompes à chaleur</option>
                          <option value="Chauffe-eau solaire individuel">
                            Chauffe-eau solaire individuel
                          </option>
                          <option value="Chauffe-eau thermodynamique">
                            Chauffe-eau thermodynamique
                          </option>
                          <option value="Système Solaire Combiné">
                            Système Solaire Combiné
                          </option>
                        </select>
                      ) : (
                        dossier.solution
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <span className="font-semibold">Étape :</span>{" "}
                      {isEditing ? (
                        <select
                          name="etape"
                          value={formData.etape}
                          onChange={handleInputChange}
                          className="mt-1 p-2 border border-gray-300 rounded w-full"
                        >
                          <option value="1Prise de contact">1 Prise de contact</option>
                          <option value="2En attente des documents">
                            2 En attente des documents
                          </option>
                          <option value="3Instruction du dossier">
                            3 Instruction du dossier
                          </option>
                          <option value="4Dossier Accepter">4 Dossier Accepter</option>
                          <option value="5Installation">5 Installation</option>
                          <option value="6Controle">6 Contrôle</option>
                          <option value="7Dossier cloturer">
                            7 Dossier clôturé
                          </option>
                        </select>
                      ) : (
                        dossier.etape
                      )}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Valeur :</span>{" "}
                      {isEditing ? (
                        <input
                          type="number"
                          name="valeur"
                          value={formData.valeur}
                          onChange={handleInputChange}
                          className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                      ) : (
                        `${dossier.valeur} €`
                      )}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Équipe Assignée :</span>{" "}
                      {isEditing ? (
                        <select
                          name="assignedTeam"
                          value={formData.assignedTeam}
                          onChange={handleInputChange}
                          className="mt-1 p-2 border border-gray-300 rounded w-full"
                        >
                          <option value="">Sélectionnez une équipe</option>
                          {userList.map((user) => (
                            <option key={user.email} value={user.email}>
                              {user.email} ({user.role})
                            </option>
                          ))}
                        </select>
                      ) : (
                        dossier.assignedTeam || "Non assignée"
                      )}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Notes</h3>
                  {isEditing ? (
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      rows={4}
                    />
                  ) : (
                    dossier.notes && (
                      <p className="text-gray-700 whitespace-pre-line">{dossier.notes}</p>
                    )
                  )}
                </div>
              </motion.section>

              {/* Informations Logement */}
              {dossier.informationLogement && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="relative bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 transform transition duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center bg-green-500 text-white rounded-full w-10 h-10 mr-4">
                      <HomeIcon className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-700">
                      Informations Logement
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p className="text-gray-700">
                      <span className="font-semibold">Type de logement :</span>{" "}
                      {isEditing ? (
                        <input
                          type="text"
                          name="typeDeLogement"
                          value={formData.informationLogement?.typeDeLogement || ""}
                          onChange={(e) => handleNestedInputChange(e, "informationLogement")}
                          className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                      ) : (
                        dossier.informationLogement.typeDeLogement
                      )}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Surface Habitable :</span>{" "}
                      {isEditing ? (
                        <input
                          type="text"
                          name="surfaceHabitable"
                          value={formData.informationLogement?.surfaceHabitable || ""}
                          onChange={(e) => handleNestedInputChange(e, "informationLogement")}
                          className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                      ) : (
                        dossier.informationLogement.surfaceHabitable
                      )}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Année de Construction :</span>{" "}
                      {isEditing ? (
                        <input
                          type="text"
                          name="anneeConstruction"
                          value={formData.informationLogement?.anneeConstruction || ""}
                          onChange={(e) => handleNestedInputChange(e, "informationLogement")}
                          className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                      ) : (
                        dossier.informationLogement.anneeConstruction
                      )}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Système de Chauffage :</span>{" "}
                      {isEditing ? (
                        <input
                          type="text"
                          name="systemeChauffage"
                          value={formData.informationLogement?.systemeChauffage || ""}
                          onChange={(e) => handleNestedInputChange(e, "informationLogement")}
                          className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                      ) : (
                        dossier.informationLogement.systemeChauffage
                      )}
                    </p>
                  </div>
                </motion.section>
              )}

              {/* Informations Travaux */}
              {dossier.informationTravaux && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="relative bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 transform transition duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center bg-purple-500 text-white rounded-full w-10 h-10 mr-4">
                      <BriefcaseIcon className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-700">
                      Informations Travaux
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p className="text-gray-700">
                      <span className="font-semibold">Type de Travaux :</span>{" "}
                      {isEditing ? (
                        <input
                          type="text"
                          name="typeTravaux"
                          value={formData.informationTravaux?.typeTravaux || ""}
                          onChange={(e) => handleNestedInputChange(e, "informationTravaux")}
                          className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                      ) : (
                        dossier.informationTravaux.typeTravaux
                      )}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Type d&apos;Utilisation :</span>{" "}
                      {isEditing ? (
                        <input
                          type="text"
                          name="typeUtilisation"
                          value={formData.informationTravaux?.typeUtilisation || ""}
                          onChange={(e) => handleNestedInputChange(e, "informationTravaux")}
                          className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                      ) : (
                        dossier.informationTravaux.typeUtilisation
                      )}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Surface Chauffée :</span>{" "}
                      {isEditing ? (
                        <input
                          type="text"
                          name="surfaceChauffee"
                          value={formData.informationTravaux?.surfaceChauffee || ""}
                          onChange={(e) => handleNestedInputChange(e, "informationTravaux")}
                          className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                      ) : (
                        dossier.informationTravaux.surfaceChauffee
                      )}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Circuit Chauffage Fonctionnel :</span>{" "}
                      {isEditing ? (
                        <input
                          type="text"
                          name="circuitChauffageFonctionnel"
                          value={formData.informationTravaux?.circuitChauffageFonctionnel || ""}
                          onChange={(e) => handleNestedInputChange(e, "informationTravaux")}
                          className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                      ) : (
                        dossier.informationTravaux.circuitChauffageFonctionnel
                      )}
                    </p>
                  </div>
                </motion.section>
              )}

              {/* Détails Supplémentaires */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="relative bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500 transform transition duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center bg-indigo-500 text-white rounded-full w-10 h-10 mr-4">
                    <InformationCircleIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-700">
                    Détails Supplémentaires
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dossier.contactId && (
                    <p className="text-gray-700">
                      <span className="font-semibold">ID Contact :</span> {dossier.contactId}
                    </p>
                  )}
                  <p className="text-gray-700">
                    <span className="font-semibold">ID Dossier :</span> {dossier._id}
                  </p>
                </div>
              </motion.section>

              {/* Boutons Sauvegarder / Annuler (affichés uniquement en mode édition) */}
              {isEditing && (
                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    Sauvegarder
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
          ) : (
            // ------------------------
            // Contenu de l'onglet Documents
            // ------------------------
            <DocumentsTab />
          )}
        </main>
      </div>
    </div>
  );
}
