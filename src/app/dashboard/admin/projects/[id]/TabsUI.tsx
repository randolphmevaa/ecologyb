import { FC, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import {
  InformationCircleIcon,
  PhotoIcon,
  ChatBubbleLeftEllipsisIcon,
  LifebuoyIcon,
  CurrencyEuroIcon,
  DocumentCheckIcon,
  FolderIcon,
  ChevronDownIcon,
  XMarkIcon,
  UserCircleIcon,
  ClockIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
  CheckIcon,
  UserGroupIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";
import { Menu, Dialog } from "@headlessui/react";

// Define a union type for the available tabs
type TabType = "info" | "documents" | "photo" | "chat" | "sav" | "reglement" | "devis";

// Define the props interface for PremiumTabs
interface PremiumTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  chatMessageCount: number;
  dossierStatus?: string; // New prop for the status
  onStatusChange?: (newStatus: string) => void; // Callback for status changes
  contactId?: string; // Contact ID for API updates
}

// Define the dropdown menu items (all except "Informations client")
const dropdownItems = [
  { id: "documents", label: "Documents", icon: FolderIcon, description: "Gérer tous les documents" },
  { id: "devis", label: "Devis / Facture", icon: DocumentCheckIcon, description: "Accéder aux devis" },
  { id: "photo", label: "Photo d'installation", icon: PhotoIcon, description: "Consulter les photos" },
  { id: "chat", label: "Chat", icon: ChatBubbleLeftEllipsisIcon, description: "Communiquer avec le client" },
  { id: "sav", label: "S.A.V.", icon: LifebuoyIcon, description: "Service après-vente" },
  { id: "reglement", label: "Règlement", icon: CurrencyEuroIcon, description: "Gérer les paiements" },
];

// Available statuses with colors and API values
const statusOptions = [
  { id: "pending", value: "En attente de paiement", color: "bg-amber-100 text-amber-800 border-amber-200", apiValue: "EN_ATTENTE_PAIEMENT" },
  { id: "paid", value: "Payé", color: "bg-green-100 text-green-800 border-green-200", apiValue: "PAYE" },
  { id: "in-progress", value: "En cours", color: "bg-blue-100 text-blue-800 border-blue-200", apiValue: "EN_COURS" },
  { id: "to-invoice", value: "À facturer", color: "bg-amber-100 text-amber-800 border-amber-200", apiValue: "A_FACTURER" },
  { id: "completed", value: "Terminé", color: "bg-indigo-100 text-indigo-800 border-indigo-200", apiValue: "TERMINE" },
  { id: "canceled", value: "Annulé", color: "bg-red-100 text-red-800 border-red-200", apiValue: "ANNULE" }
];

// Available installation slots for the agenda
const availableSlots = [
  { id: 1, date: "2025-04-15", times: ["08:00", "11:00", "14:00", "16:00"] },
  { id: 2, date: "2025-04-16", times: ["09:00", "13:00", "15:00"] },
  { id: 3, date: "2025-04-17", times: ["08:30", "10:30", "14:30", "16:30"] },
  { id: 4, date: "2025-04-18", times: ["08:00", "12:00", "15:00"] },
  { id: 5, date: "2025-04-19", times: ["10:00", "14:00"] },
];

// Example installers for the dropdown
const installers = [
  { id: 1, name: "Thomas Martin", rating: 4.9, specialty: "Chauffage", available: true },
  { id: 2, name: "Sophie Dubois", rating: 4.8, specialty: "Électricité", available: true },
  { id: 3, name: "Paul Lefebvre", rating: 4.7, specialty: "Plomberie", available: false },
  { id: 4, name: "Camille Leroy", rating: 4.9, specialty: "Polyvalent", available: true },
  { id: 5, name: "Antoine Mercier", rating: 4.6, specialty: "Chauffage", available: true },
];

// Get color for a specific status
const getStatusColor = (status: string) => {
  const option = statusOptions.find(opt => opt.value === status);
  return option ? option.color : "bg-gray-100 text-gray-800 border-gray-200";
};

const PremiumTabs: FC<PremiumTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  chatMessageCount,
  dossierStatus = "En attente de paiement", // Default status
  onStatusChange = () => {}, // Default empty callback
  contactId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(dossierStatus);
  
  // Installation modal state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedInstaller, setSelectedInstaller] = useState<number | null>(null);
  const [installationNotes, setInstallationNotes] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Update local status when prop changes
  useEffect(() => {
    setCurrentStatus(dossierStatus);
  }, [dossierStatus]);
  
  // State for API request status
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  
  // Function to update status via API
  const updateStatusViaApi = async (newStatus: string) => {
    if (!contactId) return;
    
    // Find the API value for the selected status
    const statusOption = statusOptions.find(opt => opt.value === newStatus);
    if (!statusOption) return;
    
    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          statut: statusOption.apiValue
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Status update failed: ${response.status}`);
      }
      
      // Success - status is already updated in the UI
    } catch (error) {
      console.error('Error updating status:', error);
      setUpdateError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Function to handle installation submission
  const handleInstallSubmit = async () => {
    if (!selectedDate || !selectedTime || !selectedInstaller) return;
    
    setIsSubmitting(true);
    
    try {
      // This would be replaced by your actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update status to "En cours" after successful installation scheduling
      onStatusChange("En cours");
      setCurrentStatus("En cours");
      updateStatusViaApi("En cours");
      
      // Close the modal after successful submission
      setIsInstallModalOpen(false);
      resetInstallationForm();
    } catch (error) {
      console.error('Error scheduling installation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset installation form values
  const resetInstallationForm = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedInstaller(null);
    setInstallationNotes("");
    setCurrentStep(1);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Find the active item for display in the dropdown button
  const activeItem = activeTab !== "info" ? dropdownItems.find((item) => item.id === activeTab) : undefined;

  // Get status color based on current status
  const statusColor = getStatusColor(currentStatus);

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };
  
  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  return (
    <MotionConfig transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
      <div className="relative bg-white backdrop-blur-lg rounded-2xl shadow-lg p-6 mb-8 border border-gray-100/80"
        style={{
          background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.98), rgba(249, 250, 251, 0.97))",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.02) inset"
        }}
      >
        {/* Expand/collapse toggle for mobile */}
        <div className="block sm:hidden mb-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setExpanded(!expanded)}
            className="w-full py-2 rounded-xl flex items-center justify-center font-medium bg-gray-100 text-gray-700"
          >
            <span>{expanded ? "Masquer les options" : "Afficher les options"}</span>
            <ChevronDownIcon 
              className={`ml-2 w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} 
            />
          </motion.button>
        </div>

        <AnimatePresence>
          {(expanded || window.innerWidth >= 640) && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Info button - always visible and separate from dropdown */}
              <motion.button
                onClick={() => setActiveTab("info")}
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
                }}
                whileTap={{ scale: 0.97 }}
                className={`group flex items-center space-x-3 px-6 py-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 ${
                  activeTab === "info"
                    ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200"
                }`}
              >
                <span className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                  activeTab === "info"
                    ? "bg-white/20 group-hover:bg-white/30"
                    : "bg-gray-100 group-hover:bg-gray-200"
                }`}>
                  <InformationCircleIcon className="w-5 h-5" />
                </span>
                <span className="text-sm font-semibold tracking-wide">Informations client</span>
              </motion.button>

              {/* NEW BUTTON: Placer en installation */}
              <motion.button
                onClick={() => {
                  setIsInstallModalOpen(true);
                  resetInstallationForm();
                }}
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)"
                }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center space-x-3 px-6 py-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/20"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 group-hover:bg-white/30">
                  <WrenchScrewdriverIcon className="w-5 h-5" />
                </span>
                <span className="text-sm font-semibold tracking-wide">Placer en installation</span>
              </motion.button>

              {/* Status dossier with dropdown */}
              <div className="relative" ref={statusDropdownRef}>
                <motion.button
                  onClick={() => setIsStatusOpen(!isStatusOpen)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isUpdating}
                  className={`flex-shrink-0 flex flex-col justify-center px-5 py-3 rounded-xl border ${statusColor} shadow-sm cursor-pointer transition-colors duration-300 ${isUpdating ? 'opacity-75' : ''}`}
                >
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Status dossier</span>
                    <ChevronDownIcon className={`w-3 h-3 transition-transform ${isStatusOpen ? "rotate-180" : ""}`} />
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm font-semibold mt-1">{currentStatus}</p>
                    {isUpdating && (
                      <span className="ml-2 mt-1">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                    )}
                  </div>
                  {updateError && (
                    <p className="text-xs text-red-600 mt-1">Erreur: {updateError}</p>
                  )}
                </motion.button>
                
                {/* Status dropdown */}
                <AnimatePresence>
                  {isStatusOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                      className="absolute z-50 mt-2 w-64 origin-top-left rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
                    >
                      <div className="py-2 max-h-60 overflow-y-auto">
                        {statusOptions.map((status) => (
                          <motion.button
                            key={status.id}
                            variants={itemVariants}
                            onClick={() => {
                              onStatusChange(status.value);
                              setCurrentStatus(status.value);
                              setIsStatusOpen(false);
                              updateStatusViaApi(status.value);
                            }}
                            className={`flex w-full items-center px-4 py-2 text-left hover:bg-gray-50 ${
                              currentStatus === status.value ? "bg-gray-50" : ""
                            }`}
                          >
                            <div className={`w-3 h-3 rounded-full mr-3 ${status.color.split(" ")[0]}`} />
                            <span className="text-sm">{status.value}</span>
                            {currentStatus === status.value && (
                              <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="ml-auto flex items-center justify-center text-blue-600"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dropdown menu */}
              <div className="relative w-full sm:w-auto sm:flex-1 md:max-w-sm" ref={dropdownRef}>
                <Menu as="div" className="relative inline-block w-full text-left">
                  {({ }) => (
                    <>
                      <Menu.Button as="div">
                        <motion.button
                          onClick={() => setIsOpen(!isOpen)}
                          whileHover={{ 
                            scale: 1.02, 
                            boxShadow: activeTab !== "info" 
                              ? "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
                              : "0 10px 25px -5px rgba(209, 213, 219, 0.3)"
                          }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center justify-between w-full space-x-3 px-6 py-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            activeTab !== "info" 
                              ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md shadow-blue-500/20 focus:ring-blue-500/50" 
                              : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 shadow-sm focus:ring-gray-200"
                          }`}
                        >
                          <div className="flex items-center space-x-3 overflow-hidden">
                            {activeTab !== "info" && activeItem && (
                              <>
                                <motion.div 
                                  initial={{ rotate: 0 }}
                                  animate={{ rotate: isOpen ? 180 : 0 }}
                                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20"
                                >
                                  <activeItem.icon className="w-5 h-5" />
                                </motion.div>
                                <span className="text-sm font-semibold tracking-wide truncate">{activeItem.label}</span>
                              </>
                            )}
                            {activeTab === "info" && (
                              <>
                                <motion.div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100">
                                  <UserCircleIcon className="w-5 h-5 text-gray-600" />
                                </motion.div>
                                <span className="text-sm font-semibold tracking-wide">Autres options</span>
                              </>
                            )}
                          </div>
                          <ChevronDownIcon 
                            className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? "transform rotate-180" : ""}`}
                          />
                          
                          {/* Chat notification badge */}
                          {chatMessageCount > 0 && activeTab !== "chat" && (
                            <motion.span 
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 15 }}
                              className="absolute top-0 right-0 -mt-2 -mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white shadow-lg ring-2 ring-white"
                            >
                              {chatMessageCount}
                            </motion.span>
                          )}
                        </motion.button>
                      </Menu.Button>

                      <AnimatePresence>
                        {isOpen && (
                          <Menu.Items
                            as={motion.div}
                            static
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={dropdownVariants}
                            className="absolute right-0 z-50 mt-3 w-96 origin-top-right overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
                          >
                            {/* Header with close button */}
                            <div className="relative px-5 py-3 bg-gray-50">
                              <div className="flex justify-end items-center">
                                <button 
                                  onClick={() => setIsOpen(false)}
                                  className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                                >
                                  <XMarkIcon className="w-4 h-4" />
                                </button>
                              </div>
                              
                              {/* Radial background */}
                              <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                                <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 blur-3xl" />
                              </div>
                            </div>

                            {/* All options */}
                            <div className="max-h-80 overflow-y-auto p-2 space-y-1 thin-scrollbar">
                              {dropdownItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                  <Menu.Item key={item.id}>
                                    {({ active }) => (
                                      <motion.button
                                        variants={itemVariants}
                                        onClick={() => {
                                          setActiveTab(item.id as TabType);
                                          setIsOpen(false);
                                        }}
                                        className={`flex items-center w-full px-3 py-2.5 rounded-lg text-left ${
                                          active
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700"
                                        }`}
                                      >
                                        <div className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg mr-3 ${
                                          active
                                            ? "bg-blue-100 text-blue-600"
                                            : "bg-gray-100 text-gray-600"
                                        }`}>
                                          <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                          <p className={`text-sm font-medium ${
                                            activeTab === item.id ? "text-blue-700" : ""
                                          }`}>
                                            {item.label}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {item.description}
                                          </p>
                                        </div>
                                        {item.id === "chat" && chatMessageCount > 0 && (
                                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                                            {chatMessageCount}
                                          </span>
                                        )}
                                      </motion.button>
                                    )}
                                  </Menu.Item>
                                );
                              })}
                            </div>

                            {/* Footer with indicator */}
                            <div className="px-4 py-3 bg-gray-50">
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-500">
                                  {activeTab !== "info" && (
                                    <>Option active: <span className="font-medium">{activeItem?.label}</span></>
                                  )}
                                </p>
                                <div className="flex space-x-1.5">
                                  {dropdownItems.map((item ) => (
                                    <div
                                      key={`ind-${item.id}`}
                                      className={`h-1 w-6 rounded-full ${
                                        activeTab === item.id
                                          ? "bg-blue-600"
                                          : "bg-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Menu.Items>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </Menu>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Subtle content indicator and glass effect */}
        <div className="absolute -bottom-0.5 left-0 right-0 h-1 bg-gray-200 overflow-hidden rounded-b-2xl">
          <motion.div 
            initial={false}
            animate={{ 
              translateX: activeTab === "info" ? "-83%" : activeTab === "documents" ? "-50%" : 
                        activeTab === "photo" ? "-16.6%" : activeTab === "chat" ? "16.6%" : 
                        activeTab === "sav" ? "50%" : activeTab === "reglement" ? "83%" : "100%"
            }}
            className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700"
            style={{ width: "16.6%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Glass reflection effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent opacity-5"></div>
        </div>
      </div>

      {/* INSTALLATION MODAL */}
      <AnimatePresence>
        {isInstallModalOpen && (
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            open={isInstallModalOpen}
            onClose={() => {
              if (!isSubmitting) setIsInstallModalOpen(false);
            }}
          >
              <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" aria-hidden="true" />

              <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
              
                              <motion.div
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="relative inline-block w-full max-w-4xl transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all sm:align-middle sm:max-w-4xl"
                >
                  {/* Modal header with gradient background */}
                  <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 pt-6">
                    {/* Close button */}
                    <button
                      onClick={() => {
                        if (!isSubmitting) setIsInstallModalOpen(false);
                      }}
                      disabled={isSubmitting}
                      className="absolute right-4 top-4 rounded-full bg-white/20 p-1.5 text-white transition-colors hover:bg-white/30 focus:outline-none"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                    
                    {/* Header content */}
                    <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 sm:mb-0 sm:mr-5">
                        <WrenchScrewdriverIcon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white" id="modal-title">
                          Placer un client en installation
                        </h3>
                        <p className="mt-1 text-emerald-100">
                          Sélectionnez une date, un horaire et un installateur pour ce client
                        </p>
                      </div>
                    </div>
                    
                    {/* Step indicators - Moved down and improved */}
                    <div className="py-4 flex justify-center bg-gradient-to-r from-green-700/40 to-emerald-700/40 rounded-lg mb-2">
                      <div className="flex w-full max-w-md items-center justify-between px-4">
                        {[1, 2, 3].map((step) => (
                          <div key={step} className="flex flex-col items-center">
                            <div 
                              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-md ${
                                currentStep === step
                                  ? "border-white bg-white text-green-600"
                                  : currentStep > step
                                  ? "border-white bg-green-700 text-white"
                                  : "border-white/40 bg-transparent text-white/60"
                              }`}
                            >
                              {currentStep > step ? (
                                <CheckIcon className="h-5 w-5" />
                              ) : (
                                <span className="text-sm font-medium">{step}</span>
                              )}
                            </div>
                            <span className={`mt-2 text-xs font-medium ${
                              currentStep >= step ? "text-white" : "text-white/60"
                            }`}>
                              {step === 1 ? "Agenda" : step === 2 ? "Installateur" : "Confirmation"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500 opacity-20 blur-3xl"></div>
                    <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-green-400 opacity-20 blur-3xl"></div>
                  </div>

                  {/* Modal body with steps */}
                  <div className="p-6 sm:p-8">
                    {/* Step 1: Agenda */}
                    {currentStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">Sélectionnez une date et un horaire</h4>
                          <p className="mt-1 text-sm text-gray-500">Consultez l&apos;agenda des disponibilités pour planifier l&apos;installation</p>
                        </div>
                        
                        {/* Calendar view */}
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                          <div className="mb-4 flex items-center justify-between">
                            <h5 className="flex items-center text-sm font-medium text-gray-700">
                              <CalendarIcon className="mr-2 h-5 w-5 text-gray-500" />
                              Avril 2025
                            </h5>
                            <div className="flex space-x-2">
                              <button className="rounded-lg border border-gray-300 bg-white p-1.5 text-gray-500 hover:bg-gray-50">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <button className="rounded-lg border border-gray-300 bg-white p-1.5 text-gray-500 hover:bg-gray-50">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          
                          {/* Calendar grid */}
                          <div className="grid grid-cols-7 gap-2">
                            {/* Week days */}
                            {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => (
                              <div key={i} className="text-center text-xs font-medium text-gray-500">
                                {day}
                              </div>
                            ))}
                            
                            {/* Empty cells for previous month */}
                            {Array.from({ length: 1 }).map((_, i) => (
                              <div key={`empty-${i}`} className="h-10 rounded-lg border border-transparent p-1 text-center text-sm text-gray-400">
                                {31 + i}
                              </div>
                            ))}
                            
                            {/* Days in current month */}
                            {Array.from({ length: 30 }).map((_, i) => {
                              const dayNumber = i + 1;
                              const dateString = `2025-04-${dayNumber.toString().padStart(2, '0')}`;
                              const hasSlots = availableSlots.some(slot => slot.date === dateString);
                              const isSelected = selectedDate === dateString;
                              
                              return (
                                <button
                                  key={`day-${i}`}
                                  onClick={() => {
                                    if (hasSlots) {
                                      setSelectedDate(dateString);
                                      setSelectedTime(null);
                                    }
                                  }}
                                  disabled={!hasSlots}
                                  className={`flex h-10 items-center justify-center rounded-lg border p-1 text-center text-sm transition-colors ${
                                    isSelected
                                      ? "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500"
                                      : hasSlots
                                      ? "cursor-pointer border-green-200 bg-green-50/50 text-green-800 hover:border-green-300 hover:bg-green-50"
                                      : "cursor-not-allowed border-gray-200 text-gray-400"
                                  }`}
                                >
                                  {dayNumber}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        
                        {/* Time slots */}
                        {selectedDate && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 rounded-xl border border-gray-200 p-5"
                          >
                            <h5 className="mb-3 text-sm font-medium text-gray-700">Horaires disponibles pour le {new Date(selectedDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</h5>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                              {availableSlots
                                .find(slot => slot.date === selectedDate)
                                ?.times.map((time, index) => (
                                  <button
                                    key={index}
                                    onClick={() => setSelectedTime(time)}
                                    className={`rounded-lg border px-4 py-2 text-center text-sm font-medium transition-colors ${
                                      selectedTime === time
                                        ? "border-green-500 bg-green-50 text-green-700"
                                        : "border-gray-200 bg-white text-gray-700 hover:border-green-200 hover:bg-green-50/50"
                                    }`}
                                  >
                                    {time}
                                  </button>
                                ))}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                    
                    {/* Step 2: Installer Selection */}
                    {currentStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">Sélectionnez un installateur</h4>
                          <p className="mt-1 text-sm text-gray-500">Choisissez un professionnel pour réaliser cette installation</p>
                        </div>
                        
                        <div className="space-y-3">
                          {installers
                            .filter(installer => installer.available)
                            .map(installer => (
                              <motion.button
                                key={installer.id}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => setSelectedInstaller(installer.id)}
                                className={`flex w-full items-center rounded-xl border p-4 transition-colors ${
                                  selectedInstaller === installer.id
                                    ? "border-green-500 bg-green-50"
                                    : "border-gray-200 bg-white hover:border-green-200 hover:bg-green-50/30"
                                }`}
                              >
                                <div className={`mr-4 flex h-12 w-12 items-center justify-center rounded-full ${
                                  selectedInstaller === installer.id ? "bg-green-100" : "bg-gray-100"
                                }`}>
                                  <UserGroupIcon className={`h-6 w-6 ${
                                    selectedInstaller === installer.id ? "text-green-600" : "text-gray-500"
                                  }`} />
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="flex items-center">
                                    <h5 className={`text-base font-medium ${
                                      selectedInstaller === installer.id ? "text-green-700" : "text-gray-900"
                                    }`}>
                                      {installer.name}
                                    </h5>
                                    <div className="ml-2 flex items-center">
                                      <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                      <span className="ml-1 text-xs font-medium text-gray-600">{installer.rating}</span>
                                    </div>
                                  </div>
                                  <div className="mt-1 flex items-center">
                                    <span className="text-xs text-gray-500">Spécialité: {installer.specialty}</span>
                                    <span className="mx-2 text-gray-300">•</span>
                                    <span className="text-xs font-medium text-green-600">Disponible</span>
                                  </div>
                                </div>
                                
                                {selectedInstaller === installer.id && (
                                  <div className="ml-2 rounded-full bg-green-100 p-1 text-green-600">
                                    <CheckIcon className="h-5 w-5" />
                                  </div>
                                )}
                              </motion.button>
                            ))}
                        </div>
                        
                        <div className="rounded-lg border border-gray-200 p-4">
                          <h5 className="mb-2 text-sm font-medium text-gray-700">Notes d&apos;installation</h5>
                          <textarea
                            value={installationNotes}
                            onChange={(e) => setInstallationNotes(e.target.value)}
                            placeholder="Ajoutez des instructions spécifiques pour l'installateur..."
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            rows={3}
                          />
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Step 3: Confirmation */}
                    {currentStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">Confirmez les détails de l&apos;installation</h4>
                          <p className="mt-1 text-sm text-gray-500">Vérifiez les informations avant de finaliser</p>
                        </div>
                        
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                          <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <CalendarIcon className="h-5 w-5" />
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-gray-700">Date et heure</h5>
                                <p className="text-sm text-gray-900">
                                  {selectedDate && new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} à {selectedTime}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <UserGroupIcon className="h-5 w-5" />
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-gray-700">Installateur</h5>
                                <p className="text-sm text-gray-900">
                                  {selectedInstaller && installers.find(inst => inst.id === selectedInstaller)?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {selectedInstaller && installers.find(inst => inst.id === selectedInstaller)?.specialty}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <MapPinIcon className="h-5 w-5" />
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-gray-700">Adresse d&apos;installation</h5>
                                <p className="text-sm text-gray-900">123 Rue de Paris, 75001 Paris</p>
                                <p className="mt-1 text-xs text-blue-600 underline">Voir sur la carte</p>
                              </div>
                            </div>
                            
                            {installationNotes && (
                              <div className="rounded-lg border border-gray-200 bg-white p-3">
                                <h5 className="text-xs font-medium uppercase text-gray-500">Notes</h5>
                                <p className="mt-1 whitespace-pre-line text-sm text-gray-700">{installationNotes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                          <div className="flex">
                            <svg className="mr-3 h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <p>
                              Une fois confirmée, cette installation sera programmée et le statut du dossier passera automatiquement à &quot;En cours&quot;. Un email de confirmation sera envoyé au client.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Modal footer with actions */}
                  <div className="rounded-b-2xl bg-gray-50 px-6 py-4">
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          if (currentStep > 1) {
                            setCurrentStep(currentStep - 1);
                          } else {
                            setIsInstallModalOpen(false);
                          }
                        }}
                        disabled={isSubmitting}
                        className="mt-3 inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
                      >
                        {currentStep > 1 ? "Retour" : "Annuler"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (currentStep === 1) {
                            if (selectedDate && selectedTime) {
                              setCurrentStep(2);
                            }
                          } else if (currentStep === 2) {
                            if (selectedInstaller) {
                              setCurrentStep(3);
                            }
                          } else {
                            handleInstallSubmit();
                          }
                        }}
                        disabled={
                          isSubmitting ||
                          (currentStep === 1 && (!selectedDate || !selectedTime)) ||
                          (currentStep === 2 && !selectedInstaller)
                        }
                        className={`inline-flex w-full items-center justify-center rounded-lg px-6 py-3 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto ${
                          (currentStep === 1 && (!selectedDate || !selectedTime)) ||
                          (currentStep === 2 && !selectedInstaller) ||
                          isSubmitting
                            ? "cursor-not-allowed bg-green-400"
                            : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="mr-3 -ml-1 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Traitement...
                          </>
                        ) : currentStep < 3 ? (
                          "Continuer"
                        ) : (
                          "Confirmer l'installation"
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
};

export default PremiumTabs;