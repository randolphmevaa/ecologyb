import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  XMarkIcon, 
  PhotoIcon, 
  PlusIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon,
  CalendarIcon,
  // InformationCircleIcon,
  // ChevronDownIcon,
  CameraIcon,
  TrashIcon,
  PencilIcon
} from "@heroicons/react/24/outline";
import Image from "next/image";

interface PhotoTabProps {
  contactId: string;
}

interface PhotoData {
  id: string;
  url: string;
  date: string;
  caption?: string;
  phase?: string; // "before" or "after"
}

// Sample data for demonstration purposes
const SAMPLE_PHOTOS: PhotoData[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1558442074-3c19857bc1dc",
    date: "15/03/2025",
    caption: "État initial de la chaudière avant remplacement",
    phase: "before"
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4",
    date: "15/03/2025",
    caption: "Vue extérieure avant installation de la PAC",
    phase: "before"
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1560184611-ff3e53f00e8f",
    date: "15/03/2025",
    caption: "Zone d'installation - mur extérieur",
    phase: "before"
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1564182842519-8a3b2af3e228",
    date: "20/03/2025",
    caption: "Nouvelle pompe à chaleur installée",
    phase: "after"
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1742599404576-72e237d030f1?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "20/03/2025",
    caption: "Connexions hydrauliques finalisées",
    phase: "after"
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1576615278693-f8e095e37e01",
    date: "20/03/2025",
    caption: "Unité extérieure de la PAC installée",
    phase: "after"
  }
];

function PhotoTab({ contactId }: PhotoTabProps) {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ , setIsModalOpen] = useState(false);
  const [ , setPhotoToEdit] = useState<PhotoData | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<PhotoData | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error ] = useState<string>("");
  // const [showBeforePhotos ] = useState<boolean>(true);
  // const [showAfterPhotos ] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"all" | "before" | "after">("all");

  // For this demo, we'll use the sample data instead of fetching from API
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPhotos(SAMPLE_PHOTOS);
      setLoading(false);
    }, 800);
  }, [contactId]);

  const beforePhotos = photos.filter(photo => photo.phase === "before");
  const afterPhotos = photos.filter(photo => photo.phase === "after");

  const filteredPhotos = photos.filter((photo) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      (photo.caption?.toLowerCase().includes(query)) ||
      photo.date.toLowerCase().includes(query) ||
      photo.phase?.toLowerCase().includes(query)
    );
    
    // Filter by active tab and search query
    if (activeTab === "all") return matchesSearch;
    return photo.phase === activeTab && matchesSearch;
  });

  const handleNextPhoto = () => {
    if (!previewPhoto) return;
    const currentFiltered = filteredPhotos;
    const currentIndex = currentFiltered.findIndex(p => p.id === previewPhoto.id);
    const nextIndex = (currentIndex + 1) % currentFiltered.length;
    setPreviewPhoto(currentFiltered[nextIndex]);
    setCurrentPhotoIndex(nextIndex);
  };

  const handlePreviousPhoto = () => {
    if (!previewPhoto) return;
    const currentFiltered = filteredPhotos;
    const currentIndex = currentFiltered.findIndex(p => p.id === previewPhoto.id);
    const prevIndex = (currentIndex - 1 + currentFiltered.length) % currentFiltered.length;
    setPreviewPhoto(currentFiltered[prevIndex]);
    setCurrentPhotoIndex(prevIndex);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") handleNextPhoto();
    if (e.key === "ArrowLeft") handlePreviousPhoto();
    if (e.key === "Escape") setPreviewPhoto(null);
  };

  const openPhotoPreview = (photo: PhotoData) => {
    setPreviewPhoto(photo);
    const index = filteredPhotos.findIndex(p => p.id === photo.id);
    setCurrentPhotoIndex(index);
  };

  return (
    <div className="h-full" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Enhanced Header with Background */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="relative bg-gradient-to-r from-indigo-600 to-indigo-400 px-10 py-8 rounded-t-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full -mr-16 -mt-20 opacity-30" />
        <div className="absolute bottom-0 right-24 w-32 h-32 bg-indigo-300 rounded-full -mb-10 opacity-20" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center">
            <div className="flex items-center justify-center bg-white text-indigo-600 rounded-full w-16 h-16 mr-6 shadow-xl">
              <CameraIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-white">
                Photos d&apos;installation
              </h2>
              <p className="text-indigo-100 mt-1">Documentation visuelle des travaux réalisés</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              setPhotoToEdit(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-white text-indigo-700 rounded-lg shadow-md hover:bg-indigo-50 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Ajouter une photo</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-b-2xl shadow-xl p-6"
      >
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
        )}

        {/* Search and Filter Controls */}
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between items-stretch gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par légende, date..."
              className="pl-10 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                activeTab === "all" 
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>Toutes</span>
            </button>
            <button
              onClick={() => setActiveTab("before")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                activeTab === "before" 
                  ? "bg-amber-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>Avant</span>
            </button>
            <button
              onClick={() => setActiveTab("after")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                activeTab === "after" 
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>Après</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune photo trouvée</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucune photo ne correspond à vos critères de recherche.
            </p>
          </div>
        ) : (
          <>
            {/* "Before" Photos Section */}
            {(activeTab === "all" || activeTab === "before") && beforePhotos.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mr-3">
                    <CalendarIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Avant installation</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {beforePhotos.filter(photo => {
                    const query = searchQuery.toLowerCase();
                    return (
                      !query || 
                      (photo.caption?.toLowerCase().includes(query)) ||
                      photo.date.toLowerCase().includes(query)
                    );
                  }).map((photo) => (
                    <motion.div
                      key={photo.id}
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                      onClick={() => openPhotoPreview(photo)}
                    >
                      <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Avant
                      </div>
                      <div className="h-48 relative overflow-hidden">
                        <Image
                          src={photo.url}
                          alt={photo.caption || "Photo avant installation"}
                          fill
                          className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {photo.date}
                        </div>
                        <p className="text-sm font-medium text-gray-800 line-clamp-2">
                          {photo.caption}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {/* "After" Photos Section */}
            {(activeTab === "all" || activeTab === "after") && afterPhotos.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3">
                    <CheckIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Après installation</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {afterPhotos.filter(photo => {
                    const query = searchQuery.toLowerCase();
                    return (
                      !query || 
                      (photo.caption?.toLowerCase().includes(query)) ||
                      photo.date.toLowerCase().includes(query)
                    );
                  }).map((photo) => (
                    <motion.div
                      key={photo.id}
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                      onClick={() => openPhotoPreview(photo)}
                    >
                      <div className="absolute top-2 left-2 z-10 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Après
                      </div>
                      <div className="h-48 relative overflow-hidden">
                        <Image
                          src={photo.url}
                          alt={photo.caption || "Photo après installation"}
                          fill
                          className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {photo.date}
                        </div>
                        <p className="text-sm font-medium text-gray-800 line-clamp-2">
                          {photo.caption}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Enhanced Photo Preview Modal */}
      <AnimatePresence>
        {previewPhoto && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewPhoto(null)}
          >
            <motion.div
              className="relative max-w-5xl w-full h-[85vh] p-4 mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Navigation buttons */}
              <button
                onClick={handlePreviousPhoto}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 sm:-translate-x-10 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              
              <button
                onClick={handleNextPhoto}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 sm:translate-x-10 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg"
              >
                <ArrowRightIcon className="h-6 w-6" />
              </button>
              
              {/* Image */}
              <div className="h-[70vh] relative overflow-hidden rounded-xl border-4 border-white shadow-2xl">
                <Image
                  src={previewPhoto.url}
                  alt={previewPhoto.caption || "Aperçu de la photo"}
                  fill
                  className="object-contain"
                />
                
                <div className="absolute top-2 left-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    previewPhoto.phase === "before" 
                      ? "bg-amber-500 text-white" 
                      : "bg-green-500 text-white"
                  }`}>
                    {previewPhoto.phase === "before" ? "Avant" : "Après"}
                  </span>
                </div>
                
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => setPreviewPhoto(null)}
                    className="bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              {/* Image details */}
              <div className="bg-white rounded-xl p-4 mt-4 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {previewPhoto.date}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {previewPhoto.caption || "Sans légende"}
                    </h3>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  {currentPhotoIndex + 1} sur {filteredPhotos.length}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// CheckIcon component for "After" section
const CheckIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={2}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M5 13l4 4L19 7" 
    />
  </svg>
);

export default PhotoTab;