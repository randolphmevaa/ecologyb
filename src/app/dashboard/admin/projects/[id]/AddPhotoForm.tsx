// AddPhotoForm.tsx
"use client";

import React, { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";

interface PhotoData {
  id: string;
  url: string;
  date: string;
  caption?: string;
}

interface AddPhotoFormProps {
  onClose: () => void;
  contactId: string;
  /**
   * When editing, initialData will contain the photo's current values.
   */
  initialData?: PhotoData;
  /**
   * Callback to handle the photo saved (new or updated).
   */
  onPhotoSaved: (photo: PhotoData) => void;
}

const AddPhotoForm: React.FC<AddPhotoFormProps> = ({
  onClose,
  contactId,
  initialData,
  onPhotoSaved,
}) => {
  // If editing, prefill the caption. Otherwise, start with an empty string.
  const [caption, setCaption] = useState(initialData?.caption || "");
  const [file, setFile] = useState<File | null>(null);
  // Format the current date in French (day/month/year)
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

    // When adding a new photo, a file is required.
    if (!caption || !contactId || (!initialData && !file)) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Create a FormData instance for multipart/form-data.
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("date", currentDate);
    formData.append("contactId", contactId);
    if (file) {
      formData.append("file", file);
    }

    try {
      // Determine if we're adding a new photo or updating an existing one.
      const endpoint = initialData ? `/api/photos/${initialData.id}` : "/api/photos";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        body: formData,
      });
      if (!res.ok) throw new Error("Erreur lors du téléversement de la photo");
      const savedPhoto: PhotoData = await res.json();
      onPhotoSaved(savedPhoto);
      onClose(); // Close the modal on success.
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de l'enregistrement.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        Informations de la photo
      </h3>

      {/* File Upload Area */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photo
        </label>
        <div className="relative">
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="photo-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <PhotoIcon className="w-10 h-10 text-gray-400 mb-2" />
            {file ? (
              <span className="text-gray-700">{file.name}</span>
            ) : (
              <span className="text-gray-500">
                Cliquez ou glissez-déposez votre photo ici
              </span>
            )}
          </label>
        </div>
        {/* When adding a new photo, file is required */}
        {!file && !initialData && (
          <p className="mt-1 text-xs text-gray-500">
            Vous pouvez enregistrer cette photo et téléverser le fichier ultérieurement.
          </p>
        )}
      </div>

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

      {/* Caption */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Légende <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Entrez une légende pour la photo..."
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors text-center"
        >
          {initialData ? "Mettre à jour" : file ? "Téléverser" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
};

export default AddPhotoForm;
