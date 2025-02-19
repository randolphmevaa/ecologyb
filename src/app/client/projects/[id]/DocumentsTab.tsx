"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CloudArrowDownIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

interface DocumentData {
  id: string;
  type: string;
  date: string;
  status: string;
  filePath?: string;
}

interface DocumentApiResponse {
  _id: string;
  type: string;
  date: string;
  statut: string;
  filePath?: string;
}

interface DocumentsTabProps {
  contactId: string;
}

// Dummy predefined types – adjust as needed.
const predefinedTypes = [
  "avis d'imposition",
  "devis facture",
  "checklist PAC",
  "note de dimensionnement",
];

// Minimal AddDocumentForm component (for uploads in "Documents à transmettre")
interface AddDocumentFormProps {
  onClose: () => void;
  contactId: string;
  onDocumentSaved: (doc: DocumentData) => void;
}
function AddDocumentForm({
  onClose,
  contactId,
  onDocumentSaved,
}: AddDocumentFormProps) {
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [solution, setSolution] = useState("");
  const currentDate = new Date().toLocaleDateString("fr-FR");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!docType || !solution || !contactId) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    const formData = new FormData();
    formData.append("docType", docType);
    formData.append("date", currentDate);
    // In an upload, status will be updated to "Soumis" once file is uploaded.
    formData.append("status", "Soumis");
    formData.append("solution", solution);
    formData.append("contactId", contactId);
    if (file) {
      formData.append("file", file);
    }
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });
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
        Ajouter un document
      </h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de document <span className="text-red-500">*</span>
        </label>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          required
        >
          <option value="">Sélectionner le type</option>
          {predefinedTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
          <option value="autre">Autre</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Solution <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          placeholder="Ex: Chauffe-eau solaire individuel"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fichier
        </label>
        <div className="relative">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            {file ? (
              <span className="text-gray-700">{file.name}</span>
            ) : (
              <span className="text-gray-500">
                Cliquez ou glissez-déposez votre fichier ici
              </span>
            )}
          </label>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
        >
          {file ? "Téléverser" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}

export default function DocumentsTab({ contactId }: DocumentsTabProps) {
  const [downloadableDocs, setDownloadableDocs] = useState<DocumentData[]>([]);
  const [transmittableDocs, setTransmittableDocs] = useState<DocumentData[]>([]);
  const [searchDownload, setSearchDownload] = useState("");
  const [searchTransmit, setSearchTransmit] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ , setPreviewDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contactId) {
      setLoading(true);
      fetch(`/api/documents?contactId=${contactId}`)
        .then((res) => res.json())
        .then((data: DocumentApiResponse[]) => {
          const mappedDocs: DocumentData[] = data.map((doc) => ({
            id: doc._id,
            type: doc.type,
            date: doc.date,
            status: doc.statut,
            filePath: doc.filePath,
          }));
          setDownloadableDocs(mappedDocs.filter((doc) => doc.status === "Soumis"));
          setTransmittableDocs(mappedDocs.filter((doc) => doc.status === "Manquant"));
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching documents:", err);
          setLoading(false);
        });
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

  const handleAjouterDocTransmettre = (): void => {
    // Open the modal to add/upload a new document for "Documents à transmettre"
    setIsModalOpen(true);
  };

  const handleDocumentSaved = (savedDoc: DocumentData) => {
    // For a new document upload, if status becomes "Soumis", move it from transmittable to downloadable.
    if (savedDoc.status === "Manquant") {
      setTransmittableDocs((prev) => [...prev, savedDoc]);
    } else if (savedDoc.status === "Soumis") {
      setDownloadableDocs((prev) => [...prev, savedDoc]);
      setTransmittableDocs((prev) => prev.filter((d) => d.id !== savedDoc.id));
    }
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Add/Edit Document Modal for "Documents à transmettre" */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <AddDocumentForm
                onClose={() => setIsModalOpen(false)}
                contactId={contactId}
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
        className="space-y-10 px-4 py-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Documents à télécharger (view-only) */}
          <motion.div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 flex items-center gap-3">
              <CloudArrowDownIcon className="h-10 w-10 text-white" />
              <h2 className="text-2xl font-bold text-white">Documents à télécharger</h2>
            </div>
            <div className="p-6">
              <div className="relative mb-6">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchDownload}
                  onChange={(e) => setSearchDownload(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <motion.div
                    className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-blue-500 text-white sticky top-0">
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
                              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                            >
                              <DocumentTextIcon className="h-5 w-5" />
                              Visualiser
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                      {filteredDownloadableDocs.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-3 text-center text-gray-500">
                            Aucun document trouvé.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>

          {/* Documents à transmettre (upload enabled) */}
          <motion.div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4 flex items-center gap-3">
              <ArrowUpTrayIcon className="h-10 w-10 text-white" />
              <h2 className="text-2xl font-bold text-white">Documents à transmettre</h2>
            </div>
            <div className="flex flex-col flex-grow p-6">
              <div className="relative mb-6">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTransmit}
                  onChange={(e) => setSearchTransmit(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <motion.div
                    className="w-8 h-8 border-4 border-green-500 border-dashed rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                </div>
              ) : (
                <div className="overflow-x-auto flex-grow">
                  <table className="min-w-full">
                    <thead className="bg-green-500 text-white sticky top-0">
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
                              onClick={() => handleVisualiser(doc)}
                              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                            >
                              <DocumentTextIcon className="h-5 w-5" />
                              Visualiser
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                      {filteredTransmittableDocs.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-3 text-center text-gray-500">
                            Aucun document trouvé.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleAjouterDocTransmettre}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  <PlusIcon className="h-5 w-5" />
                  Ajouter un document
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
