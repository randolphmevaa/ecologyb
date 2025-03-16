import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, PhotoIcon, PlusIcon } from "@heroicons/react/24/outline";
import AddPhotoForm, { PhotoData } from "./AddPhotoForm";
import Spinner from "./Spinner";
import Image from "next/image";

interface PhotoTabProps {
  contactId: string;
}

interface PhotoApiResponse {
  _id: string;
  url: string;
  date: string;
  caption?: string;
  phase?: string; // "before" or "after"
}

function PhotoTab({ contactId }: PhotoTabProps) {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoToEdit, setPhotoToEdit] = useState<PhotoData | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<PhotoData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (contactId) {
      setLoading(true);
      fetch(`/api/photos?contactId=${contactId}`)
        .then((res) => res.json())
        .then((data: PhotoApiResponse[]) => {
          const mappedPhotos: PhotoData[] = data.map((photo) => ({
            id: photo._id,
            url: photo.url,
            date: photo.date,
            caption: photo.caption,
            phase: photo.phase,
          }));
          setPhotos(mappedPhotos);
          setError("");
        })
        .catch((err) => {
          console.error("Error fetching photos:", err);
          setError("Erreur lors du chargement des photos.");
        })
        .finally(() => setLoading(false));
    }
  }, [contactId]);

  const filteredPhotos = photos.filter((photo) => {
    const query = searchQuery.toLowerCase();
    return (
      (photo.caption?.toLowerCase().includes(query)) ||
      photo.date.toLowerCase().includes(query) ||
      photo.phase?.toLowerCase().includes(query)
    );
  });

  const handlePhotoSaved = (savedPhoto: PhotoData) => {
    if (photoToEdit) {
      // Update existing photo.
      setPhotos((prev) => prev.map((p) => (p.id === savedPhoto.id ? savedPhoto : p)));
    } else {
      // Add new photo.
      setPhotos((prev) => [...prev, savedPhoto]);
    }
    setPhotoToEdit(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Photos d&apos;installation</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spinner />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden p-6"
        >
          <div className="mb-4 flex flex-col sm:flex-row sm:justify-between items-stretch gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par date, légende ou phase (avant/après)..."
              className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              onClick={() => {
                setPhotoToEdit(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-5 w-5" />
              Ajouter une photo
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-indigo-600 text-white sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Aperçu</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Phase</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Légende</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPhotos.length > 0 ? (
                  filteredPhotos.map((photo) => (
                    <motion.tr
                      key={photo.id}
                      whileHover={{ backgroundColor: "#f0f4f8" }}
                      transition={{ duration: 0.2 }}
                      className="transition-colors duration-200"
                    >
                      <td className="px-4 py-3">
                        <Image
                          src={photo.url}
                          alt={photo.caption || "Photo"}
                          className="h-12 w-12 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {photo.date}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {photo.phase === "before" ? "Avant" : "Après"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {photo.caption || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setPreviewPhoto(photo)}
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <PhotoIcon className="h-5 w-5" />
                          Visualiser
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
                      Aucune photo trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Modal for Add/Edit Photo */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setPhotoToEdit(null);
                }}
                className="absolute top-4 right-4 focus:outline-none"
                aria-label="Fermer la fenêtre"
              >
                <XMarkIcon className="h-6 w-6 text-gray-600 hover:text-gray-800" />
              </button>
              <AddPhotoForm
                onClose={() => {
                  setIsModalOpen(false);
                  setPhotoToEdit(null);
                }}
                contactId={contactId}
                initialData={photoToEdit || undefined}
                onPhotoSaved={handlePhotoSaved}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewPhoto && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              className="bg-white rounded-lg p-4 max-w-3xl w-full relative shadow-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Prévisualisation de la photo
                </h3>
                <button
                  onClick={() => setPreviewPhoto(null)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label="Fermer la prévisualisation"
                >
                  Fermer
                </button>
              </div>
              <Image
                src={previewPhoto.url}
                alt={previewPhoto.caption || "Aperçu de la photo"}
                className="w-full h-auto rounded"
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    if (!previewPhoto) return;
                    fetch(`/api/photos/${previewPhoto.id}`, { method: "DELETE" })
                      .then((res) => {
                        if (!res.ok)
                          throw new Error("Erreur lors de la suppression de la photo");
                        setPhotos((prev) =>
                          prev.filter((p) => p.id !== previewPhoto.id)
                        );
                        setPreviewPhoto(null);
                      })
                      .catch((err) =>
                        console.error("Erreur lors de la suppression :", err)
                      );
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
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

export default PhotoTab;
