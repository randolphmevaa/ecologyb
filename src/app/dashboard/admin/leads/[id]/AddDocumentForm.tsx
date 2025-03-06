// AddDocumentForm.tsx
"use client";

import React, { useState } from "react";
import { CloudIcon } from "@heroicons/react/24/outline";

interface AddDocumentFormProps {
  onClose: () => void;
  contactId: string;
}

const AddDocumentForm = ({ onClose, contactId }: AddDocumentFormProps) => {
  // States for document type, custom type when "autre" is selected, file, and solution.
  const [docType, setDocType] = useState("");
  const [customDocType, setCustomDocType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("Manquant");
  // Format the current date in French (day/month/year)
  const currentDate = new Date().toLocaleDateString("fr-FR");
  const [solution, setSolution] = useState("");

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

    // Check required fields: finalDocType, solution and contactId.
    if (!finalDocType || !solution || !contactId) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Create a FormData instance for multipart/form-data.
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
      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Erreur lors du téléversement du document");
      onClose(); // Close the modal on success.
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

      {/* Document Type */}
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

      {/* Custom Type Input for "autre" */}
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

      {/* Upload Date */}
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

      {/* File Upload Area */}
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

      {/* Status */}
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

export default AddDocumentForm;
