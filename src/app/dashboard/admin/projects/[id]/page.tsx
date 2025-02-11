"use client";

// import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClipboardDocumentCheckIcon,
  HomeIcon,
  BriefcaseIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  CloudArrowDownIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  PlusIcon,
  CloudIcon, // For the file upload area
} from "@heroicons/react/24/outline";
import { Header } from "@/components/Header";

// Define the predefined document types in a shared scope.
const predefinedTypes = [
  "avis d'imposition",
  "devis facture",
  "checklist PAC",
  "note de dimensionnement",
];

// ------------------------
// Types
// ------------------------

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

interface DocumentApiResponse {
  _id: string;
  type: string;
  date: string;
  statut: string;
  filePath?: string;
}

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
// Component: AddDocumentForm
// ------------------------

// When editing an existing document, we pass initialData (including the document id).
// Otherwise, for a new document the initialData prop is omitted.
interface DocumentInitialData {
  id: string;
  docType: string;
  solution: string;
  status?: string;
  customDocType?: string;
}

interface AddDocumentFormProps {
  onClose: () => void;
  contactId: string;
  // Optional initial data for editing an existing document.
  initialData?: DocumentInitialData;
  // Callback called with the saved document data (after POST or PUT).
  onDocumentSaved: (doc: DocumentData) => void;
}

const AddDocumentForm = ({
  onClose,
  contactId,
  initialData,
  onDocumentSaved,
}: AddDocumentFormProps) => {
  // Initialize state using initialData if provided.
  const [docType, setDocType] = useState(
    initialData
      ? predefinedTypes.includes(initialData.docType)
        ? initialData.docType
        : "autre"
      : ""
  );
  const [customDocType, setCustomDocType] = useState(
    initialData
      ? predefinedTypes.includes(initialData.docType)
        ? ""
        : initialData.customDocType || initialData.docType
      : ""
  );
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState(
    initialData ? initialData.status || "Manquant" : "Manquant"
  );
  // Format current date in French (day/month/year)
  const currentDate = new Date().toLocaleDateString("fr-FR");
  const [solution, setSolution] = useState(initialData ? initialData.solution : "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("Soumis");
    } else {
      setFile(null);
      setStatus("Manquant");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Use the custom type if "autre" is selected.
    const finalDocType = docType === "autre" ? customDocType : docType;
    if (!finalDocType || !solution || !contactId) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    const formData = new FormData();
    formData.append("docType", finalDocType);
    formData.append("date", currentDate);
    formData.append("status", status);
    formData.append("solution", solution);
    formData.append("contactId", contactId);
    if (file) {
      formData.append("file", file);
    }
    try {
      let res;
      // If initialData exists, update the document via PUT.
      if (initialData) {
        res = await fetch(`/api/documents/${initialData.id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        // Otherwise, create a new document via POST.
        res = await fetch("/api/documents", {
          method: "POST",
          body: formData,
        });
      }
      if (!res.ok) throw new Error("Erreur lors de l'enregistrement du document");
      const savedDoc: DocumentData = await res.json();
      onDocumentSaved(savedDoc);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de l'enregistrement.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        Informations du document
      </h3>
      {/* Type de document */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de document <span className="text-red-500">*</span>
        </label>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          required
        >
          <option value="">Sélectionner le type</option>
          <option value="avis d'imposition">Avis d&apos;imposition</option>
          <option value="devis facture">Devis / Facture</option>
          <option value="checklist PAC">Checklist PAC</option>
          <option value="note de dimensionnement">Note de dimensionnement</option>
          <option value="autre">Autre</option>
        </select>
      </div>
      {/* Champ personnalisé pour "autre" */}
      {docType === "autre" && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spécifiez le type <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={customDocType}
            onChange={(e) => setCustomDocType(e.target.value)}
            placeholder="Entrez le type personnalisé..."
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            required
          />
        </div>
      )}
      {/* Date de téléversement */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date de téléversement
        </label>
        <input
          type="text"
          value={currentDate}
          disabled
          className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
        />
      </div>
      {/* Zone de téléversement de fichier */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fichier
        </label>
        <div className="relative">
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <CloudIcon className="w-10 h-10 text-gray-400 mb-2" />
            {file ? (
              <span className="text-gray-700">{file.name}</span>
            ) : (
              <span className="text-gray-500">
                Cliquez ou glissez-déposez votre fichier ici
              </span>
            )}
          </label>
        </div>
        {!file && (
          <p className="mt-1 text-xs text-gray-500">
            Vous pouvez enregistrer ce document et téléverser le fichier ultérieurement.
          </p>
        )}
      </div>
      {/* Statut */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Statut
        </label>
        <input
          type="text"
          value={status}
          disabled
          className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
        />
      </div>
      {/* Solution */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Solution <span className="text-red-500">*</span>
        </label>
        <select
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          required
        >
          <option value="">Sélectionner une solution</option>
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
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors text-center"
        >
          {file ? "Téléverser" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
};

// ------------------------
// Component: StepProgress
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

  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

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
        <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 rounded-full transform -translate-y-1/2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </motion.svg>
                ) : (
                  <span className={`text-base font-semibold ${isCurrent ? "text-white" : "text-gray-500"}`}>
                    {stepNumber}
                  </span>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`mt-2 text-center text-xs font-medium ${
                  isCurrent ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
                }`}
              >
                {step}
              </motion.div>
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

// ------------------------
// Types for Document Data
// ------------------------

interface DocumentData {
  id: string;
  type: string;
  date: string;
  status: string;
  filePath?: string;
}

// ------------------------
// Component: DocumentsTab
// ------------------------

interface DocumentsTabProps {
  contactId: string;
}

function DocumentsTab({ contactId }: DocumentsTabProps) {
  const [downloadableDocs, setDownloadableDocs] = useState<DocumentData[]>([]);
  const [transmittableDocs, setTransmittableDocs] = useState<DocumentData[]>([]);
  const [searchDownload, setSearchDownload] = useState("");
  const [searchTransmit, setSearchTransmit] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // If docToEdit is set, then we are editing that document (prefilled form).
  const [docToEdit, setDocToEdit] = useState<DocumentData | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocumentData | null>(null);

  useEffect(() => {
    if (contactId) {
      fetch(`/api/documents?contactId=${contactId}`)
        .then((res) => res.json())
        // Specify that data is an array of DocumentApiResponse
        .then((data: DocumentApiResponse[]) => {
          const mappedDocs: DocumentData[] = data.map((doc) => ({
            id: doc._id,
            type: doc.type,
            date: doc.date,
            status: doc.statut,
            filePath: doc.filePath,
          }));
          const downloadable = mappedDocs.filter((doc) => doc.status === "Soumis");
          const transmittable = mappedDocs.filter((doc) => doc.status === "Manquant");
          setDownloadableDocs(downloadable);
          setTransmittableDocs(transmittable);
        })
        .catch((err) => console.error("Error fetching documents:", err));
    }
  }, [contactId]);

  const filteredDownloadableDocs = downloadableDocs.filter((doc) =>
    doc.type.toLowerCase().includes(searchDownload.toLowerCase())
  );
  const filteredTransmittableDocs = transmittableDocs.filter((doc) =>
    doc.type.toLowerCase().includes(searchTransmit.toLowerCase())
  );

  const handleVisualiser = (doc: DocumentData): void => {
    setPreviewDoc(doc);
  };

  // When clicking the row-level "Ajouter" button, open the modal for editing.
  const handleAjouterDocTransmettre = (doc: DocumentData): void => {
    setDocToEdit(doc);
    setIsModalOpen(true);
  };

  // Callback after a document is saved (either updated or added).
  const handleDocumentSaved = (savedDoc: DocumentData) => {
    if (docToEdit) {
      // Update an existing document.
      setTransmittableDocs((prev) =>
        prev.map((d) => (d.id === savedDoc.id ? savedDoc : d))
      );
      if (savedDoc.status === "Soumis") {
        setTransmittableDocs((prev) => prev.filter((d) => d.id !== savedDoc.id));
        setDownloadableDocs((prev) => [...prev, savedDoc]);
      }
    } else {
      // Add a new document.
      if (savedDoc.status === "Manquant") {
        setTransmittableDocs((prev) => [...prev, savedDoc]);
      } else if (savedDoc.status === "Soumis") {
        setDownloadableDocs((prev) => [...prev, savedDoc]);
      }
    }
    setDocToEdit(null);
  };

  return (
    <>
      {/* Modal for adding/editing a document */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-md relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setDocToEdit(null);
                }}
                className="absolute top-4 right-4"
              >
                <XMarkIcon className="h-6 w-6 text-gray-600 hover:text-gray-800" />
              </button>
              <AddDocumentForm
                onClose={() => {
                  setIsModalOpen(false);
                  setDocToEdit(null);
                }}
                contactId={contactId}
                initialData={
                  docToEdit
                    ? {
                        id: docToEdit.id,
                        // Use "autre" if the document type is not one of the predefined ones.
                        docType: predefinedTypes.includes(docToEdit.type) ? docToEdit.type : "autre",
                        customDocType: predefinedTypes.includes(docToEdit.type) ? "" : docToEdit.type,
                        solution: "", // Optionally prefill the solution if available.
                        status: docToEdit.status,
                      }
                    : undefined
                }
                onDocumentSaved={handleDocumentSaved}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 flex items-center gap-3">
              <CloudArrowDownIcon className="h-10 w-10 text-white" />
              <h2 className="text-2xl font-bold text-white">Documents à télécharger</h2>
            </div>
            <div className="p-6">
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
                      <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Statut</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
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
                        <td className="px-4 py-3 text-sm text-gray-700">{doc.type}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{doc.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{doc.status}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleVisualiser(doc)}
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
                        <td colSpan={4} className="px-4 py-3 text-sm text-center text-gray-500">
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
            <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4 flex items-center gap-3">
              <ArrowUpTrayIcon className="h-10 w-10 text-white" />
              <h2 className="text-2xl font-bold text-white">Documents à transmettre</h2>
            </div>
            <div className="flex flex-col flex-grow p-6">
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
                      <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Statut</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
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
                        <td className="px-4 py-3 text-sm text-gray-700">{doc.type}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{doc.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{doc.status}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleAjouterDocTransmettre(doc)}
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
                        <td colSpan={4} className="px-4 py-3 text-sm text-center text-gray-500">
                          Aucun document trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => {
                    setDocToEdit(null);
                    setIsModalOpen(true);
                  }}
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

      {/* Preview Modal for a document */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-4 max-w-3xl w-full relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Prévisualisation du document</h3>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Fermer
                </button>
              </div>
              {previewDoc.filePath ? (
                <iframe
                  src={previewDoc.filePath}
                  title="Document Preview"
                  className="w-full h-96 border"
                />
              ) : (
                <p>Aucun document à afficher.</p>
              )}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    if (!previewDoc) return;
                    fetch(`/api/documents/${previewDoc.id}`, { method: "DELETE" })
                      .then((res) => {
                        if (!res.ok) throw new Error("Erreur lors de la suppression du document");
                        setDownloadableDocs((prev) => prev.filter((d) => d.id !== previewDoc.id));
                        setTransmittableDocs((prev) => prev.filter((d) => d.id !== previewDoc.id));
                        setPreviewDoc(null);
                      })
                      .catch((err) => console.error("Erreur lors de la suppression :", err));
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ------------------------
// Main Component: ProjectDetailPage
// ------------------------

export default function ProjectDetailPage() {
  
  const { id } = useParams();
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
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
  const [userList, setUserList] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<"info" | "documents">("info");
  const searchParams = useSearchParams();
  // const { tab } = router.query;

  const getCurrentStep = (etape: string): number => {
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
    e: React.ChangeEvent<HTMLInputElement>,
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
  const firstLetter = dossier.client ? dossier.client.charAt(0).toUpperCase() : "";

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={{ name: "Administrateur", avatar: "/admin-avatar.png" }} />
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
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

          <header className="relative bg-white">
            <div className="">
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative bg-white rounded-3xl shadow-2xl p-10 md:flex md:items-center md:justify-between"
              >
                <div className="flex flex-col">
                  <motion.h1 whileHover={{ scale: 1.02 }} className="text-3xl font-bold text-gray-900">
                    Projet pour {dossier.client}
                  </motion.h1>
                  <div className="mt-4 space-y-3">
                    <motion.div whileHover={{ x: 5 }} className="flex items-center text-gray-700">
                      <EnvelopeIcon className="w-6 h-6 mr-3" />
                      <span className="text-lg">{dossier.clientEmail || "client@example.com"}</span>
                    </motion.div>
                    <motion.div whileHover={{ x: 5 }} className="flex items-center text-gray-700">
                      <PhoneIcon className="w-6 h-6 mr-3" />
                      <span className="text-lg">{dossier.clientPhone || "+1 (555) 555-5555"}</span>
                    </motion.div>
                    <motion.div whileHover={{ x: 5 }} className="flex items-center text-gray-700">
                      <MapPinIcon className="w-6 h-6 mr-3" />
                      <span className="text-lg">
                        {dossier.clientAddress || "123 Main St, City, Country"}
                      </span>
                    </motion.div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-gray-500">Dossier {dossier.numero}</span>
                  </div>
                </div>
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

          <StepProgress currentStep={currentStep} />

          <div className="flex border-b border-gray-300 mb-4">
            <button
              onClick={() => setActiveTab("info")}
              className={`px-4 py-2 -mb-px font-semibold ${
                activeTab === "info" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500 hover:text-blue-500"
              }`}
            >
              Cartes d&apos;information
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`px-4 py-2 -mb-px font-semibold ${
                activeTab === "documents" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500 hover:text-blue-500"
              }`}
            >
              Documents
            </button>
          </div>

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

          {activeTab === "info" ? (
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
                  <h2 className="text-2xl font-bold text-gray-700">Informations Générales</h2>
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
                    <h2 className="text-2xl font-bold text-gray-700">Informations Logement</h2>
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
                    <h2 className="text-2xl font-bold text-gray-700">Informations Travaux</h2>
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
                  <h2 className="text-2xl font-bold text-gray-700">Détails Supplémentaires</h2>
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
            <div id="documents">
              <DocumentsTab contactId={dossier.contactId || ""} />
            </div>
            
          )}
        </main>
      </div>
    </div>
  );
}
