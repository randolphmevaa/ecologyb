import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  XMarkIcon, 
  PhotoIcon, 
  PlusIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon,
  CalendarIcon,
  CameraIcon,
  TrashIcon,
  PencilIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  ExclamationCircleIcon
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

interface PhotoUpload {
  id: string;
  file: File;
  preview: string;
  caption: string;
  phase: "before" | "after";
  date: string;
  isUploading?: boolean;
  progress?: number;
  error?: string;
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

// Format date to DD/MM/YYYY
const formatDate = (date: Date): string => {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

// Get current date formatted
const getCurrentDate = (): string => {
  return formatDate(new Date());
};

function PhotoTab({ contactId }: PhotoTabProps) {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ , setPhotoToEdit] = useState<PhotoData | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<PhotoData | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error ] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"all" | "before" | "after">("all");
  
  // For upload modal
  const [uploadedPhotos, setUploadedPhotos] = useState<PhotoUpload[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStep, setUploadStep] = useState<"select" | "details" | "uploading" | "complete">("select");
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);
  const [batchPhase, setBatchPhase] = useState<"before" | "after" | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // For this demo, we'll use the sample data instead of fetching from API
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPhotos(SAMPLE_PHOTOS);
      setLoading(false);
    }, 800);
  }, [contactId]);

  // Filter photos
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

  // Photo preview navigation
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

  // File upload handlers
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newUploads: PhotoUpload[] = Array.from(files).map(file => {
      // Generate preview URL
      const preview = URL.createObjectURL(file);
      
      return {
        id: `temp-${Math.random().toString(36).substring(2, 11)}`,
        file,
        preview,
        caption: "",
        phase: batchPhase || "before",
        date: getCurrentDate(),
        progress: 0
      };
    });

    setUploadedPhotos([...uploadedPhotos, ...newUploads]);
    
    // Move to details step if there are photos
    if (uploadStep === "select" && newUploads.length > 0) {
      setUploadStep("details");
      if (newUploads.length > 0) {
        setActivePhotoId(newUploads[0].id);
      }
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [batchPhase, uploadedPhotos, uploadStep]);

  const removeUploadedPhoto = (id: string) => {
    const photoToRemove = uploadedPhotos.find(p => p.id === id);
    if (photoToRemove?.preview) {
      URL.revokeObjectURL(photoToRemove.preview);
    }
    
    const updatedPhotos = uploadedPhotos.filter(p => p.id !== id);
    setUploadedPhotos(updatedPhotos);
    
    // Update active photo if needed
    if (activePhotoId === id) {
      setActivePhotoId(updatedPhotos.length > 0 ? updatedPhotos[0].id : null);
    }
    
    // Go back to select step if no photos left
    if (updatedPhotos.length === 0) {
      setUploadStep("select");
    }
  };

  const updatePhotoDetails = (id: string, updates: Partial<PhotoUpload>) => {
    setUploadedPhotos(prev => 
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  };

  const applyBatchSettings = () => {
    if (!batchPhase) return;
    
    setUploadedPhotos(prev => 
      prev.map(p => ({ ...p, phase: batchPhase }))
    );
  };

  // Simulate photo upload
  const uploadPhotos = async () => {
    setIsUploading(true);
    setUploadStep("uploading");
    
    // Simulate individual upload progress
    for (let i = 0; i < uploadedPhotos.length; i++) {
      const photo = uploadedPhotos[i];
      
      // Update status to uploading
      setUploadedPhotos(prev => 
        prev.map(p => p.id === photo.id ? { ...p, isUploading: true } : p)
      );
      
      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setUploadedPhotos(prev => 
          prev.map(p => p.id === photo.id ? { ...p, progress } : p)
        );
        
        // Update overall progress
        const overallPercent = Math.floor(((i * 100) + progress) / (uploadedPhotos.length * 100) * 100);
        setOverallProgress(overallPercent);
      }
    }
    
    // Simulate API call delay for saving all photos
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create new photos from uploads
    const newPhotos = uploadedPhotos.map((upload, index) => ({
      id: (photos.length + index + 1).toString(),
      url: upload.preview, // In a real app, this would be the URL from your server
      date: upload.date,
      caption: upload.caption,
      phase: upload.phase
    }));
    
    // Update photos state with new ones
    setPhotos(prev => [...prev, ...newPhotos]);
    
    // Complete the upload
    setUploadStep("complete");
    setIsUploading(false);
    setOverallProgress(100);
    
    // Wait 2 seconds then close modal
    setTimeout(() => {
      closeModal();
    }, 2000);
  };

  const closeModal = () => {
    // Clean up previews
    uploadedPhotos.forEach(photo => {
      if (photo.preview) {
        URL.revokeObjectURL(photo.preview);
      }
    });
    
    setIsModalOpen(false);
    setUploadedPhotos([]);
    setUploadStep("select");
    setActivePhotoId(null);
    setBatchPhase(null);
    setIsUploading(false);
    setOverallProgress(0);
  };

  const resetUpload = () => {
    // Clean up previews
    uploadedPhotos.forEach(photo => {
      if (photo.preview) {
        URL.revokeObjectURL(photo.preview);
      }
    });
    
    setUploadedPhotos([]);
    setUploadStep("select");
    setActivePhotoId(null);
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

      {/* Multi-Upload Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={( ) => {
              if (!isUploading) closeModal();
            }}
          >
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-6 flex justify-between items-center">
                <div className="flex items-center">
                  <CloudArrowUpIcon className="h-8 w-8 mr-3" />
                  <div>
                    <h3 className="text-xl font-bold">Ajouter des photos</h3>
                    <p className="text-indigo-100 text-sm">
                      {uploadStep === "select" && "Sélectionnez les photos à télécharger"}
                      {uploadStep === "details" && "Renseignez les détails des photos"}
                      {uploadStep === "uploading" && "Téléchargement en cours..."}
                      {uploadStep === "complete" && "Téléchargement terminé !"}
                    </p>
                  </div>
                </div>
                
                {!isUploading && (
                  <button
                    onClick={closeModal}
                    className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                )}
              </div>

              {/* Progress bar when uploading */}
              {uploadStep === "uploading" && (
                <div className="h-2 bg-gray-200 w-full">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-300"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              )}
              
              {/* Modal Content */}
              <div className="p-0">
                {/* Step 1: Select Files */}
                {uploadStep === "select" && (
                  <div className="p-6">
                    <div 
                      ref={dropZoneRef}
                      className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
                        isDragging 
                          ? "border-indigo-500 bg-indigo-50" 
                          : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileSelect(e.target.files)}
                      />
                      
                      <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: isDragging ? 1.05 : 1 }}
                        className="space-y-4"
                      >
                        <div className="mx-auto w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                          <CloudArrowUpIcon className="h-10 w-10" />
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">
                            Glissez-déposez vos photos ici
                          </h4>
                          <p className="text-gray-500 mt-1">
                            ou <button onClick={() => fileInputRef.current?.click()} className="text-indigo-600 font-medium hover:text-indigo-800">parcourez vos fichiers</button>
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Formats acceptés: JPG, PNG, HEIC - Max 10MB par photo
                          </p>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Batch Settings */}
                    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Paramètres par défaut pour toutes les photos</h4>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">Phase:</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setBatchPhase("before")}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                              batchPhase === "before" 
                                ? "bg-amber-500 text-white" 
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            Avant installation
                          </button>
                          <button
                            onClick={() => setBatchPhase("after")}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                              batchPhase === "after" 
                                ? "bg-green-500 text-white" 
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            Après installation
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Photo Details */}
                {uploadStep === "details" && (
                  <div className="flex h-[60vh]">
                    {/* Sidebar with thumbnail list */}
                    <div className="w-1/3 border-r overflow-y-auto p-4 bg-gray-50">
                      <h4 className="font-medium text-gray-700 mb-3">Photos sélectionnées ({uploadedPhotos.length})</h4>
                      
                      <div className="space-y-2">
                        {uploadedPhotos.map((photo) => (
                          <div
                            key={photo.id}
                            onClick={() => setActivePhotoId(photo.id)}
                            className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                              activePhotoId === photo.id 
                                ? "bg-indigo-100 border border-indigo-300" 
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <div className="w-16 h-16 relative rounded-md overflow-hidden mr-3 flex-shrink-0">
                              <Image
                                src={photo.preview}
                                alt="Thumbnail"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {photo.file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(photo.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              <div className="flex items-center mt-1">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                                  photo.phase === "before" 
                                    ? "bg-amber-100 text-amber-800" 
                                    : "bg-green-100 text-green-800"
                                }`}>
                                  {photo.phase === "before" ? "Avant" : "Après"}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeUploadedPhoto(photo.id);
                              }}
                              className="ml-2 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-200"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => {
                          setUploadStep("select");
                          fileInputRef.current?.click();
                        }}
                        className="mt-4 w-full flex items-center justify-center p-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
                      >
                        <PlusIcon className="h-5 w-5 mr-1" />
                        <span className="text-sm">Ajouter plus de photos</span>
                      </button>
                    </div>
                    
                    {/* Details editing area */}
                    <div className="flex-1 p-6 overflow-y-auto">
                      {activePhotoId ? (
                        <>
                          {(() => {
                            const activePhoto = uploadedPhotos.find(p => p.id === activePhotoId);
                            if (!activePhoto) return null;
                            
                            return (
                              <div>
                                <div className="mb-6 relative rounded-xl overflow-hidden shadow-md h-56 bg-gray-100">
                                  <Image
                                    src={activePhoto.preview}
                                    alt="Preview"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                                
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Nom du fichier
                                    </label>
                                    <input
                                      type="text"
                                      value={activePhoto.file.name}
                                      disabled
                                      className="w-full bg-gray-100 rounded-lg border border-gray-300 p-2 text-sm text-gray-700"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Légende
                                    </label>
                                    <textarea
                                      value={activePhoto.caption}
                                      onChange={(e) => updatePhotoDetails(activePhotoId, { caption: e.target.value })}
                                      placeholder="Décrivez ce qui est visible sur cette photo..."
                                      className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                      rows={3}
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Date
                                    </label>
                                    <input
                                      type="text"
                                      value={activePhoto.date}
                                      onChange={(e) => updatePhotoDetails(activePhotoId, { date: e.target.value })}
                                      placeholder="JJ/MM/AAAA"
                                      className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Phase d&apos;installation
                                    </label>
                                    <div className="flex space-x-4">
                                      <button
                                        onClick={() => updatePhotoDetails(activePhotoId, { phase: "before" })}
                                        className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                                          activePhoto.phase === "before" 
                                            ? "bg-amber-500 text-white" 
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                      >
                                        Avant installation
                                      </button>
                                      <button
                                        onClick={() => updatePhotoDetails(activePhotoId, { phase: "after" })}
                                        className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                                          activePhoto.phase === "after" 
                                            ? "bg-green-500 text-white" 
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                      >
                                        Après installation
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center text-gray-500">
                            <DocumentTextIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                            <p>Sélectionnez une photo pour modifier ses détails</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Step 3: Uploading in progress */}
                {uploadStep === "uploading" && (
                  <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <div className="mb-4 text-center">
                      <p className="text-lg font-medium text-gray-900">
                        Téléchargement des photos en cours...
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        {Math.round(overallProgress)}% terminé - Ne fermez pas cette fenêtre
                      </p>
                    </div>
                    
                    <div className="space-y-3 mt-6">
                      {uploadedPhotos.map((photo) => (
                        <div key={photo.id} className="flex items-center bg-gray-50 p-3 rounded-lg">
                          <div className="w-12 h-12 relative rounded-md overflow-hidden mr-3 flex-shrink-0">
                            <Image
                              src={photo.preview}
                              alt="Thumbnail"
                              fill
                              className="object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {photo.file.name}
                            </p>
                            <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-indigo-500 transition-all duration-300"
                                style={{ width: `${photo.progress || 0}%` }}
                              />
                            </div>
                          </div>
                          
                          <div className="ml-3 flex-shrink-0">
                            {photo.error ? (
                              <div className="text-red-500">
                                <ExclamationCircleIcon className="h-5 w-5" />
                              </div>
                            ) : photo.progress === 100 ? (
                              <div className="text-green-500">
                                <CheckIcon className="h-5 w-5" />
                              </div>
                            ) : (
                              <div className="text-gray-400">
                                <span className="text-xs">{photo.progress || 0}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Step 4: Upload complete */}
                {uploadStep === "complete" && (
                  <div className="p-10 text-center">
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <CheckIcon className="h-10 w-10" />
                    </div>
                    
                    <h3 className="mt-4 text-xl font-bold text-gray-900">
                      Téléchargement terminé !
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {uploadedPhotos.length} photo{uploadedPhotos.length > 1 ? 's' : ''} ajoutée{uploadedPhotos.length > 1 ? 's' : ''} avec succès.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Modal Footer */}
              <div className="border-t p-4 flex justify-between items-center bg-gray-50">
                {uploadStep === "select" && (
                  <>
                    <div className="text-sm text-gray-500">
                      {uploadedPhotos.length} photo{uploadedPhotos.length !== 1 ? 's' : ''} sélectionnée{uploadedPhotos.length !== 1 ? 's' : ''}
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={closeModal}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => {
                          if (uploadedPhotos.length > 0) {
                            setUploadStep("details");
                            setActivePhotoId(uploadedPhotos[0].id);
                          } else {
                            fileInputRef.current?.click();
                          }
                        }}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          uploadedPhotos.length > 0
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "bg-indigo-200 text-indigo-500 cursor-not-allowed"
                        }`}
                        disabled={uploadedPhotos.length === 0}
                      >
                        Continuer
                      </button>
                    </div>
                  </>
                )}
                
                {uploadStep === "details" && (
                  <>
                    <div>
                      <button
                        onClick={applyBatchSettings}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                        disabled={!batchPhase}
                      >
                        <span>Appliquer le type à toutes les photos</span>
                      </button>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setUploadStep("select");
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Retour
                      </button>
                      <button
                        onClick={resetUpload}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Réinitialiser
                      </button>
                      <button
                        onClick={uploadPhotos}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Télécharger les photos
                      </button>
                    </div>
                  </>
                )}
                
                {uploadStep === "uploading" && (
                  <div className="w-full text-center text-sm text-gray-500">
                    Le téléchargement est en cours, veuillez patienter...
                  </div>
                )}
                
                {uploadStep === "complete" && (
                  <div className="w-full flex justify-center">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Terminer
                    </button>
                  </div>
                )}
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