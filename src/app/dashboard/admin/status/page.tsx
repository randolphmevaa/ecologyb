"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CheckIcon,
  BeakerIcon,
  BanknotesIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  EnvelopeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PhoneIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

// Define status option type
type StatusOption = {
  id: string;
  value: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: string; // Changed from specific type to string to accept any icon name
};

// Icons mapping with proper typing
const iconOptions: { [key: string]: React.ReactNode } = {
  CheckCircleIcon: <CheckCircleIcon className="h-4 w-4 mr-1" />,
  ClockIcon: <ClockIcon className="h-4 w-4 mr-1" />,
  ArrowPathIcon: <ArrowPathIcon className="h-4 w-4 mr-1" />,
  ExclamationCircleIcon: <ExclamationCircleIcon className="h-4 w-4 mr-1" />,
  BeakerIcon: <BeakerIcon className="h-4 w-4 mr-1" />,
  BanknotesIcon: <BanknotesIcon className="h-4 w-4 mr-1" />,
  DocumentTextIcon: <DocumentTextIcon className="h-4 w-4 mr-1" />,
  // Adding more icons
  XMarkIcon: <XMarkIcon className="h-4 w-4 mr-1" />,
  PlusIcon: <PlusIcon className="h-4 w-4 mr-1" />,
  PencilIcon: <PencilIcon className="h-4 w-4 mr-1" />,
  TrashIcon: <TrashIcon className="h-4 w-4 mr-1" />,
  ChevronDownIcon: <ChevronDownIcon className="h-4 w-4 mr-1" />,
  CheckIcon: <CheckIcon className="h-4 w-4 mr-1" />,
  // Import additional icons from the existing imports in your code
  MagnifyingGlassIcon: <MagnifyingGlassIcon className="h-4 w-4 mr-1" />,
  UserGroupIcon: <UserGroupIcon className="h-4 w-4 mr-1" />,
  BuildingOfficeIcon: <BuildingOfficeIcon className="h-4 w-4 mr-1" />,
  MapPinIcon: <MapPinIcon className="h-4 w-4 mr-1" />,
  EnvelopeIcon: <EnvelopeIcon className="h-4 w-4 mr-1" />,
  PhoneIcon: <PhoneIcon className="h-4 w-4 mr-1" />,
  FunnelIcon: <FunnelIcon className="h-4 w-4 mr-1" />,
  ChartBarIcon: <ChartBarIcon className="h-4 w-4 mr-1" />
};

// Initial status options based on the original code
const initialStatusOptions: StatusOption[] = [
  { 
    id: "pending", 
    value: "En attente de paiement", 
    color: "bg-amber-100 text-amber-800 border-amber-200",
    bgColor: "#FEF3C7", 
    textColor: "#92400E", 
    borderColor: "#FDE68A",
    icon: "ClockIcon"
  },
  { 
    id: "paid", 
    value: "Payé", 
    color: "bg-green-100 text-green-800 border-green-200",
    bgColor: "#D1FAE5", 
    textColor: "#065F46", 
    borderColor: "#A7F3D0",
    icon: "CheckCircleIcon"
  },
  { 
    id: "in-progress", 
    value: "En cours", 
    color: "bg-blue-100 text-blue-800 border-blue-200",
    bgColor: "#DBEAFE", 
    textColor: "#1E40AF", 
    borderColor: "#BFDBFE",
    icon: "ArrowPathIcon"
  },
  { 
    id: "completed", 
    value: "Terminé", 
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    bgColor: "#E0E7FF", 
    textColor: "#3730A3", 
    borderColor: "#C7D2FE",
    icon: "CheckCircleIcon"
  },
  { 
    id: "canceled", 
    value: "Annulé", 
    color: "bg-red-100 text-red-800 border-red-200",
    bgColor: "#FEE2E2", 
    textColor: "#991B1B", 
    borderColor: "#FECACA",
    icon: "ExclamationCircleIcon"
  }
];

// Helper function to generate a unique ID
const generateUniqueId = () => {
  return `status-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Form validation function
const validateStatusForm = (status: Partial<StatusOption>) => {
  const errors: { [key: string]: string } = {};
  
  if (!status.value?.trim()) {
    errors.value = "Le nom du statut est requis";
  }
  
  if (!status.id?.trim()) {
    errors.id = "L'identifiant est requis";
  }
  
  if (!status.bgColor?.trim()) {
    errors.bgColor = "La couleur de fond est requise";
  }
  
  if (!status.textColor?.trim()) {
    errors.textColor = "La couleur du texte est requise";
  }
  
  if (!status.borderColor?.trim()) {
    errors.borderColor = "La couleur de bordure est requise";
  }
  
  if (!status.icon) {
    errors.icon = "L'icône est requise";
  }
  
  return errors;
};

export default function StatusManagementPage() {
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>(initialStatusOptions);
  const [editingStatus, setEditingStatus] = useState<StatusOption | null>(null);
  const [newStatus, setNewStatus] = useState<Partial<StatusOption>>({
    id: "",
    value: "",
    bgColor: "#F3F4F6",
    textColor: "#1F2937",
    borderColor: "#E5E7EB",
    icon: "CheckCircleIcon"
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isIconModalOpen, setIconModalOpen] = useState(false); // New state for icon modal
  const [statusToDelete, setStatusToDelete] = useState<StatusOption | null>(null);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Predefined color palettes with labels
  const colorPalettes = [
    // Blues
    { name: "Bleu", bgColor: "#DBEAFE", textColor: "#1E40AF", borderColor: "#BFDBFE" },
    { name: "Bleu clair", bgColor: "#EFF6FF", textColor: "#1E3A8A", borderColor: "#DBEAFE" },
    // Greens
    { name: "Vert", bgColor: "#D1FAE5", textColor: "#065F46", borderColor: "#A7F3D0" },
    { name: "Vert clair", bgColor: "#ECFDF5", textColor: "#064E3B", borderColor: "#D1FAE5" },
    // Yellows/Ambers
    { name: "Ambre", bgColor: "#FEF3C7", textColor: "#92400E", borderColor: "#FDE68A" },
    { name: "Jaune", bgColor: "#FFFBEB", textColor: "#7C2D12", borderColor: "#FEF3C7" },
    // Reds
    { name: "Rouge", bgColor: "#FEE2E2", textColor: "#991B1B", borderColor: "#FECACA" },
    { name: "Rouge clair", bgColor: "#FEF2F2", textColor: "#7F1D1D", borderColor: "#FEE2E2" },
    // Purples
    { name: "Violet", bgColor: "#E0E7FF", textColor: "#3730A3", borderColor: "#C7D2FE" },
    { name: "Indigo", bgColor: "#EEF2FF", textColor: "#312E81", borderColor: "#E0E7FF" },
    // Oranges
    { name: "Orange", bgColor: "#FFEDD5", textColor: "#9A3412", borderColor: "#FED7AA" },
    { name: "Pêche", bgColor: "#FFF7ED", textColor: "#7C2D12", borderColor: "#FFEDD5" },
  ];

  // Simulate loading status from API or storage
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // In a real application, you would fetch from an API
      // For now, just use the initialStatusOptions
      setStatusOptions(initialStatusOptions);
      setLoading(false);
    }, 800);
  }, []);

  // Save status options to localStorage or API
  useEffect(() => {
    if (!loading) {
      // In a real app, this would be an API call
      localStorage.setItem('statusOptions', JSON.stringify(statusOptions));
    }
  }, [statusOptions, loading]);

  // Handle opening the edit modal
  const handleEditClick = (status: StatusOption) => {
    setEditingStatus(status);
    setNewStatus({...status});
    setErrors({});
    setIsModalOpen(true);
  };

  // Handle opening the delete confirmation modal
  const handleDeleteClick = (status: StatusOption) => {
    setStatusToDelete(status);
    setIsDeleteModalOpen(true);
  };

  // Handle confirming deletion
  const handleConfirmDelete = () => {
    if (statusToDelete) {
      const updatedStatusOptions = statusOptions.filter(s => s.id !== statusToDelete.id);
      setStatusOptions(updatedStatusOptions);
      setStatusToDelete(null);
      setIsDeleteModalOpen(false);
      showNotification("success", "Statut supprimé avec succès");
    }
  };

  // Handle saving a new or edited status
  const handleSaveStatus = () => {
    const validationErrors = validateStatusForm(newStatus);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editingStatus) {
      // Update existing status
      const updatedStatusOptions = statusOptions.map(status => 
        status.id === editingStatus.id ? newStatus as StatusOption : status
      );
      setStatusOptions(updatedStatusOptions);
      showNotification("success", "Statut mis à jour avec succès");
    } else {
      // Add new status
      const statusToAdd = {
        ...newStatus,
        id: newStatus.id || generateUniqueId(),
      } as StatusOption;
      
      setStatusOptions([...statusOptions, statusToAdd]);
      showNotification("success", "Nouveau statut ajouté avec succès");
    }

    setIsModalOpen(false);
    setEditingStatus(null);
    resetNewStatus();
  };

  // Reset the new status form
  const resetNewStatus = () => {
    setNewStatus({
      id: "",
      value: "",
      bgColor: "#F3F4F6",
      textColor: "#1F2937",
      borderColor: "#E5E7EB",
      icon: "CheckCircleIcon"
    });
    setErrors({});
  };

  // Show notification
  const showNotification = (type: string, message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Apply a predefined color palette
  const applyColorPalette = (palette: { bgColor: string; textColor: string; borderColor: string }) => {
    setNewStatus(prev => ({
      ...prev,
      bgColor: palette.bgColor,
      textColor: palette.textColor,
      borderColor: palette.borderColor
    }));
    setIsColorPickerOpen(null);
  };

  // Update a field in the new status form
  const updateField = (field: keyof StatusOption, value: string) => {
    setNewStatus(prev => {
      const updates: Partial<StatusOption> = { ...prev, [field]: value };
      
      // Auto-generate ID from status name when the name changes
      if (field === 'value') {
        const generatedId = value
          .toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with a single one
          .trim();
        
        // Only auto-update ID if it wasn't manually set or is still empty
        if (!prev.id || prev.id === '' || 
            prev.id === prev.value?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\s-]/g, '').trim()) {
          updates.id = generatedId;
        }
      }
      
      return updates;
    });
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle adding a new status
  const handleAddNewStatus = () => {
    resetNewStatus();
    setEditingStatus(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-white to-[#bfddf9]/10">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-[#213f5b] mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-lg font-semibold text-[#213f5b]">
            Chargement des statuts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main
          className="flex-1 overflow-y-auto"
          style={{
            background:
              "linear-gradient(135deg, rgba(191,221,249,0.15), rgba(210,252,178,0.1))",
          }}
        >
          {/* Hero Section */}
          <div
            className="w-full py-8 md:py-10 relative overflow-hidden"
            style={{ 
              background: "linear-gradient(135deg, #213f5b, #1a324a)" 
            }}
          >
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#bfddf9]/10 transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#d2fcb2]/10 transform -translate-x-1/3 translate-y-1/3"></div>

            <motion.div
              className="max-w-7xl mx-auto px-4 md:px-8 relative z-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-start md:items-center justify-between flex-col md:flex-row">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Gérer les Statuts
                  </h1>
                  <p className="mt-2 md:mt-4 text-base md:text-lg text-[#d2fcb2]">
                    Personnalisez les statuts pour vos dossiers et projets
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <button 
                    onClick={handleAddNewStatus}
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg px-4 py-2 inline-flex items-center text-sm transition-all border border-white/20 shadow-lg"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Ajouter un statut
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
            {/* Notification */}
            <AnimatePresence>
              {notification && (
                <motion.div 
                  className={`mb-6 p-4 rounded-lg shadow-md flex items-center ${
                    notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {notification.type === 'success' ? 
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" /> : 
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-3" />
                  }
                  <p className={notification.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                    {notification.message}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Status Management Section */}
            <motion.div
              className="bg-white rounded-xl shadow-md overflow-hidden border border-[#bfddf9]/30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-6 border-b border-[#bfddf9]/30 bg-gradient-to-r from-[#213f5b]/5 to-[#4facfe]/10">
                <h2 className="text-lg font-bold text-[#213f5b]">Liste des statuts disponibles</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Gérez les statuts qui peuvent être assignés aux projets et dossiers
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aperçu
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Couleurs
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {statusOptions.map((status, index) => (
                      <tr 
                        key={status.id} 
                        className={`hover:bg-[#4facfe]/5 transition-colors group ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div 
                            className="px-3 py-1.5 rounded-full inline-flex items-center shadow-sm"
                            style={{ 
                              backgroundColor: status.bgColor,
                              color: status.textColor,
                              borderWidth: '1px',
                              borderStyle: 'solid',
                              borderColor: status.borderColor
                            }}
                          >
                            {iconOptions[status.icon]}
                            <span className="text-sm font-medium ml-1">{status.value}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded-md border border-gray-200">{status.id}</code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {status.value}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="flex flex-col items-center">
                              <div 
                                className="h-6 w-6 rounded-full border border-gray-200 shadow-sm group-hover:scale-110 transition-transform" 
                                style={{ backgroundColor: status.bgColor }}
                                title="Couleur de fond"
                              ></div>
                              <span className="text-xs text-gray-500 mt-1">Fond</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div 
                                className="h-6 w-6 rounded-full border border-gray-200 shadow-sm group-hover:scale-110 transition-transform" 
                                style={{ backgroundColor: status.textColor }}
                                title="Couleur du texte"
                              ></div>
                              <span className="text-xs text-gray-500 mt-1">Texte</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div 
                                className="h-6 w-6 rounded-full border border-gray-200 shadow-sm group-hover:scale-110 transition-transform" 
                                style={{ backgroundColor: status.borderColor }}
                                title="Couleur de bordure"
                              ></div>
                              <span className="text-xs text-gray-500 mt-1">Bordure</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditClick(status)}
                              className="p-2 text-[#4facfe] bg-[#4facfe]/10 rounded-lg hover:bg-[#4facfe]/20 transition flex items-center"
                              title="Modifier"
                            >
                              <PencilIcon className="h-4 w-4" />
                              <span className="ml-1 text-xs font-medium hidden group-hover:inline">Modifier</span>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(status)}
                              className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition flex items-center"
                              title="Supprimer"
                            >
                              <TrashIcon className="h-4 w-4" />
                              <span className="ml-1 text-xs font-medium hidden group-hover:inline">Supprimer</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Tips Section */}
            <motion.div
              className="mt-8 bg-gradient-to-r from-[#213f5b]/5 to-[#4facfe]/10 rounded-xl p-6 border border-[#4facfe]/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-bold text-[#213f5b] mb-3">Conseils pour les statuts</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-[#4facfe] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Utilisez des couleurs qui reflètent le sens du statut (rouge pour les annulations, vert pour les succès)</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-[#4facfe] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Choisissez des icônes qui représentent visuellement l&apos;état du projet</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-[#4facfe] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Gardez les noms de statut courts et descriptifs</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-[#4facfe] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Assurez-vous que le contraste entre la couleur de fond et la couleur du texte est suffisant pour la lisibilité</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Footer spacing */}
          <div className="h-16"></div>
        </main>
      </div>

      {/* Status Edit/Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="fixed inset-0 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Modal backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            
            {/* Modal content */}
            <div className="flex items-center justify-center min-h-screen p-4">
              <motion.div 
                className="bg-white rounded-xl shadow-xl max-w-2xl w-full relative z-10 overflow-hidden"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="p-6 border-b border-[#bfddf9]/30 bg-gradient-to-r from-[#213f5b]/5 to-[#4facfe]/10">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[#213f5b]">
                      {editingStatus ? "Modifier le statut" : "Ajouter un nouveau statut"}
                    </h2>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition p-1.5 rounded-full hover:bg-white/50"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Preview section - Enhanced with gradient background */}
                    <div className="bg-gradient-to-br from-white to-[#f9fbff] p-6 rounded-lg border border-[#bfddf9]/30 flex flex-col shadow-sm">
                      <span className="text-sm font-medium text-[#213f5b] mb-3 flex items-center">
                        <span className="w-3 h-0.5 bg-[#4facfe] mr-2"></span>
                        Aperçu du statut
                      </span>
                      <div className="flex-1 flex items-center justify-center bg-white/80 rounded-lg p-6 border border-[#bfddf9]/20">
                        <div 
                          className="px-4 py-2 rounded-full inline-flex items-center shadow-md"
                          style={{ 
                            backgroundColor: newStatus.bgColor || "#F3F4F6",
                            color: newStatus.textColor || "#1F2937",
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: newStatus.borderColor || "#E5E7EB"
                          }}
                        >
                          {newStatus.icon ? iconOptions[newStatus.icon] : null}
                          <span className="text-sm font-medium ml-1">{newStatus.value || "Nom du statut"}</span>
                        </div>
                      </div>
                    </div>
                    </div>
                    
                    {/* Form fields */}
                    <div className="space-y-4">
                      {/* Name field - Put first since ID is auto-generated from it */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom du statut
                        </label>
                        <input
                          type="text"
                          value={newStatus.value || ""}
                          onChange={(e) => updateField("value", e.target.value)}
                          placeholder="ex: En attente, Terminé, etc."
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition ${
                            errors.value ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                        />
                        {errors.value && (
                          <p className="mt-1 text-xs text-red-600">{errors.value}</p>
                        )}
                      </div>
                      
                      {/* ID field - Auto-generated from name */}
                      <div>
                        <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-1">
                          <span>Identifiant</span>
                          <span className="text-xs text-gray-500 italic">(Généré automatiquement)</span>
                        </label>
                        <input
                          type="text"
                          value={newStatus.id || ""}
                          onChange={(e) => updateField("id", e.target.value)}
                          placeholder="ex: pending, completed, etc."
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition bg-gray-50 ${
                            errors.id ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                        />
                        {errors.id && (
                          <p className="mt-1 text-xs text-red-600">{errors.id}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          Identifiant technique utilisé dans le code (sans espaces, caractères spéciaux)
                        </p>
                      </div>
                      
                      {/* Icon selection with modal */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Icône
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setIconModalOpen(true)}
                            className={`w-full px-3 py-2 border rounded-lg bg-white text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition ${
                              errors.icon ? "border-red-300 bg-red-50" : "border-gray-300"
                            }`}
                          >
                            <span className="flex items-center">
                              {newStatus.icon && (
                                <div className="p-1 rounded-full bg-[#4facfe]/10 mr-1">
                                  {iconOptions[newStatus.icon]}
                                </div>
                              )}
                              <span className="ml-1">{newStatus.icon ? 
                                ({
                                  "CheckCircleIcon": "Coche / Validé",
                                  "ClockIcon": "Horloge / En attente",
                                  "ArrowPathIcon": "Flèche circulaire / En cours",
                                  "ExclamationCircleIcon": "Attention / Erreur",
                                  "BeakerIcon": "Bécher / Test",
                                  "BanknotesIcon": "Billets / Paiement",
                                  "DocumentTextIcon": "Document / Administratif"
                                }[newStatus.icon] || newStatus.icon)
                                : "Choisir une icône"}
                              </span>
                            </span>
                            <span className="bg-[#4facfe]/10 text-[#4facfe] px-2 py-1 rounded text-xs">
                              Changer
                            </span>
                          </button>
                        </div>
                        {errors.icon && (
                          <p className="mt-1 text-xs text-red-600">{errors.icon}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Color sections - Improved UI */}
                  <div className="mt-6 border rounded-xl p-5 bg-white shadow-sm">
                    <h3 className="text-base font-medium text-[#213f5b] mb-3 flex items-center">
                      <div className="w-1 h-4 bg-gradient-to-b from-[#4facfe] to-[#1d6fa5] mr-2 rounded-full"></div>
                      Couleurs
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-6">
                      {/* Color previews - Unified visual representation */}
                      <div className="bg-[#f9fbff] border border-[#bfddf9]/30 rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-3">Aperçu des couleurs sélectionnées</p>
                        <div className="flex items-center justify-center gap-4">
                          <div>
                            <div 
                              className="h-16 w-16 rounded-lg shadow-sm mx-auto border"
                              style={{ backgroundColor: newStatus.bgColor || "#F3F4F6" }}
                            ></div>
                            <p className="text-xs text-center mt-2">Fond</p>
                          </div>
                          <div>
                            <div 
                              className="h-16 w-16 rounded-lg shadow-sm mx-auto border"
                              style={{ backgroundColor: newStatus.textColor || "#1F2937" }}
                            ></div>
                            <p className="text-xs text-center mt-2">Texte</p>
                          </div>
                          <div>
                            <div 
                              className="h-16 w-16 rounded-lg shadow-sm mx-auto border"
                              style={{ backgroundColor: newStatus.borderColor || "#E5E7EB" }}
                            ></div>
                            <p className="text-xs text-center mt-2">Bordure</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Color selection palettes */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Background color */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-sm transition">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Couleur de fond
                          </label>
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-2">
                              <button
                                className="h-8 w-8 rounded-lg border border-gray-300 overflow-hidden shadow-sm relative hover:scale-110 transition"
                                style={{ backgroundColor: newStatus.bgColor || "#F3F4F6" }}
                                onClick={() => setIsColorPickerOpen(isColorPickerOpen === "bg" ? null : "bg")}
                              >
                                {isColorPickerOpen === "bg" && (
                                  <div className="absolute inset-0 border-2 border-[#4facfe] rounded-md"></div>
                                )}
                              </button>
                              <input
                                type="text"
                                value={newStatus.bgColor || ""}
                                onChange={(e) => updateField("bgColor", e.target.value)}
                                placeholder="#FFFFFF"
                                className={`flex-1 px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4facfe] focus:border-transparent text-sm transition ${
                                  errors.bgColor ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                              />
                            </div>
                            <p className="text-xs text-gray-500">Couleur d&apos;arrière-plan du badge</p>
                          </div>
                        </div>
                        
                        {/* Text color */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-sm transition">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Couleur du texte
                          </label>
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-2">
                              <button
                                className="h-8 w-8 rounded-lg border border-gray-300 overflow-hidden shadow-sm relative hover:scale-110 transition"
                                style={{ backgroundColor: newStatus.textColor || "#1F2937" }}
                                onClick={() => setIsColorPickerOpen(isColorPickerOpen === "text" ? null : "text")}
                              >
                                {isColorPickerOpen === "text" && (
                                  <div className="absolute inset-0 border-2 border-[#4facfe] rounded-md"></div>
                                )}
                              </button>
                              <input
                                type="text"
                                value={newStatus.textColor || ""}
                                onChange={(e) => updateField("textColor", e.target.value)}
                                placeholder="#000000"
                                className={`flex-1 px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4facfe] focus:border-transparent text-sm transition ${
                                  errors.textColor ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                              />
                            </div>
                            <p className="text-xs text-gray-500">Couleur du texte et de l&apos;icône</p>
                          </div>
                        </div>
                        
                        {/* Border color */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-sm transition">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Couleur de bordure
                          </label>
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-2">
                              <button
                                className="h-8 w-8 rounded-lg border border-gray-300 overflow-hidden shadow-sm relative hover:scale-110 transition"
                                style={{ backgroundColor: newStatus.borderColor || "#E5E7EB" }}
                                onClick={() => setIsColorPickerOpen(isColorPickerOpen === "border" ? null : "border")}
                              >
                                {isColorPickerOpen === "border" && (
                                  <div className="absolute inset-0 border-2 border-[#4facfe] rounded-md"></div>
                                )}
                              </button>
                              <input
                                type="text"
                                value={newStatus.borderColor || ""}
                                onChange={(e) => updateField("borderColor", e.target.value)}
                                placeholder="#EEEEEE"
                                className={`flex-1 px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4facfe] focus:border-transparent text-sm transition ${
                                  errors.borderColor ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                              />
                            </div>
                            <p className="text-xs text-gray-500">Couleur de la bordure du badge</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Color palette presets - Always visible */}
                      <div className="mt-6 p-4 border border-[#bfddf9]/30 rounded-lg bg-white shadow-md">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium text-[#213f5b] flex items-center">
                            <div className="w-1 h-4 bg-gradient-to-b from-[#4facfe] to-[#1d6fa5] mr-2 rounded-full"></div>
                            Palettes de couleurs prédéfinies
                          </span>
                          {isColorPickerOpen && (
                            <button 
                              onClick={() => setIsColorPickerOpen(null)}
                              className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-500 mb-3">
                          Cliquez sur une palette pour appliquer ces couleurs à votre statut
                        </p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {colorPalettes.map((palette, index) => (
                            <motion.button
                              key={index}
                              onClick={() => applyColorPalette(palette)}
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              className="group p-3 rounded-lg border border-gray-200 hover:border-[#4facfe] transition hover:shadow-md flex flex-col"
                              style={{ backgroundColor: palette.bgColor }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium" style={{ color: palette.textColor }}>
                                  {palette.name}
                                </span>
                                <div className="invisible group-hover:visible bg-white bg-opacity-70 rounded-full p-0.5">
                                  <CheckIcon className="h-3 w-3 text-[#213f5b]" />
                                </div>
                              </div>
                              
                              <div className="flex gap-2 mt-1 justify-center">
                                {/* Color swatches */}
                                <div className="flex flex-col items-center">
                                  <div 
                                    className="h-6 w-6 rounded-md shadow-sm border border-white/50"
                                    style={{ backgroundColor: palette.bgColor }}
                                    title="Couleur de fond"
                                  ></div>
                                  <span className="text-[9px] mt-1" style={{ color: palette.textColor }}>Fond</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div 
                                    className="h-6 w-6 rounded-md shadow-sm border border-white/50"
                                    style={{ backgroundColor: palette.textColor }}
                                    title="Couleur du texte"
                                  ></div>
                                  <span className="text-[9px] mt-1" style={{ color: palette.textColor }}>Texte</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div 
                                    className="h-6 w-6 rounded-md shadow-sm border border-white/50"
                                    style={{ backgroundColor: palette.borderColor }}
                                    title="Couleur de bordure"
                                  ></div>
                                  <span className="text-[9px] mt-1" style={{ color: palette.textColor }}>Bordure</span>
                                </div>
                              </div>
                              
                              {/* Badge example */}
                              <div className="mt-3 flex justify-center">
                                <div 
                                  className="px-2 py-1 rounded-full text-[9px] inline-flex items-center"
                                  style={{ 
                                    backgroundColor: palette.bgColor, 
                                    color: palette.textColor,
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderColor: palette.borderColor
                                  }}
                                >
                                  <CheckCircleIcon className="h-2 w-2 mr-0.5" />
                                  Exemple
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                  </div>
                </div>
                
                <div className="p-6 border-t border-[#bfddf9]/30 bg-gradient-to-r from-[#213f5b]/5 to-[#4facfe]/10 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition shadow-sm font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveStatus}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#213f5b] to-[#1d6fa5] text-white rounded-lg hover:opacity-90 transition shadow-md font-medium relative overflow-hidden group"
                  >
                    {/* Button shimmer effect */}
                    <div className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    
                    {editingStatus ? "Mettre à jour" : "Ajouter"}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && statusToDelete && (
          <motion.div 
            className="fixed inset-0 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
            
            <div className="flex items-center justify-center min-h-screen p-4">
              <motion.div 
                className="bg-white rounded-xl shadow-xl max-w-md w-full relative z-10"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-center mb-4 bg-red-100 h-16 w-16 rounded-full mx-auto">
                    <ExclamationCircleIcon className="h-8 w-8 text-red-600" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                    Confirmer la suppression
                  </h3>
                  
                  <p className="text-sm text-gray-500 text-center mb-6">
                    Êtes-vous sûr de vouloir supprimer le statut <span className="font-medium text-gray-900">&quot;{statusToDelete.value}&quot;</span> ? Cette action ne peut pas être annulée.
                  </p>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition text-sm"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon Selection Modal */}
      <AnimatePresence>
        {isIconModalOpen && (
          <motion.div 
            className="fixed inset-0 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm" onClick={() => setIconModalOpen(false)}></div>
            
            <div className="flex items-center justify-center min-h-screen p-4">
              <motion.div 
                className="bg-white rounded-xl shadow-xl max-w-2xl w-full relative z-10"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="p-6 border-b border-[#bfddf9]/30 bg-gradient-to-r from-[#213f5b]/5 to-[#4facfe]/10 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[#213f5b]">Choisir une icône</h2>
                  <button 
                    onClick={() => setIconModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition p-1.5 rounded-full hover:bg-white/50"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                
                {/* Icon Selection Modal - Improved UI */}
                <div className="p-8 overflow-y-auto max-h-[calc(100vh-200px)]">
                  <div className="mb-6 bg-[#f9fbff] rounded-xl p-4 border border-[#bfddf9]/30">
                    <p className="text-sm text-gray-600">
                      Sélectionnez une icône qui représente le mieux ce statut. L&apos;icône sera affichée à côté du nom du statut.
                    </p>
                  </div>
                
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {Object.entries(iconOptions).map(([name, icon]) => {
                      // French translations for icon names
                      const frenchNames: {[key: string]: string} = {
                        "CheckCircleIcon": "Validé",
                        "ClockIcon": "En attente",
                        "ArrowPathIcon": "En cours",
                        "ExclamationCircleIcon": "Attention",
                        "BeakerIcon": "Test",
                        "BanknotesIcon": "Paiement",
                        "DocumentTextIcon": "Document",
                        "XMarkIcon": "Annulé",
                        "PlusIcon": "Ajouter",
                        "PencilIcon": "Modifier",
                        "TrashIcon": "Supprimer",
                        "ChevronDownIcon": "Développer",
                        "CheckIcon": "Validé (simple)",
                        "MagnifyingGlassIcon": "Recherche",
                        "UserGroupIcon": "Utilisateurs",
                        "BuildingOfficeIcon": "Bâtiment",
                        "MapPinIcon": "Localisation",
                        "EnvelopeIcon": "Email",
                        "PhoneIcon": "Téléphone",
                        "FunnelIcon": "Filtre",
                        "ChartBarIcon": "Statistiques"
                      };
                      
                      const isSelected = newStatus.icon === name;
                      
                      return (
                        <motion.button
                          key={name}
                          type="button"
                          onClick={() => {
                            updateField("icon", name);
                          }}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl border text-center flex flex-col items-center justify-between h-36 transition-all ${
                            isSelected 
                              ? 'border-[#4facfe] bg-[#4facfe]/10 shadow-md' 
                              : 'border-gray-200 hover:border-[#4facfe]/50 hover:bg-[#4facfe]/5'
                          }`}
                        >
                          <div className="flex-1 flex items-center justify-center w-full">
                            <div className={`p-3 rounded-full mb-2 flex items-center justify-center ${
                              isSelected 
                                ? 'bg-[#4facfe] text-white shadow-md' 
                                : 'bg-gray-100 text-[#213f5b]'
                            }`}>
                              <div className="h-8 w-8 flex items-center justify-center">
                                {/* Fix for TypeScript error with cloneElement */}
                                {typeof icon === 'object' && React.isValidElement(icon) 
                                  ? React.cloneElement(icon, { 
                                    //   className: "h-6 w-6",
                                      // Preserve original props
                                    //   ...icon.props,
                                    })
                                  : icon
                                }
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">{frenchNames[name] || name}</p>
                            
                            {isSelected && (
                              <div className="text-xs font-medium text-[#4facfe] flex items-center justify-center">
                                <CheckIcon className="h-3 w-3 mr-1" />
                                Sélectionné
                              </div>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
                
                <div className="p-4 border-t border-[#bfddf9]/30 bg-gradient-to-r from-[#213f5b]/5 to-[#4facfe]/10 flex justify-end">
                  <button
                    onClick={() => setIconModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition shadow-sm font-medium"
                  >
                    Fermer
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add some CSS for animations */}
      <style jsx global>{`
        .shimmer {
          animation: shimmer 2s infinite linear;
          background-size: 1000px 100%;
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
