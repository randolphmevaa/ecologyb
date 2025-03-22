import { FC, useState, useRef, useEffect, Fragment } from "react";
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
  UserCircleIcon
} from "@heroicons/react/24/outline";
import { Menu } from "@headlessui/react";

// Define a union type for the available tabs
type TabType = "info" | "documents" | "photo" | "chat" | "sav" | "reglement" | "devis";

// Define the props interface for PremiumTabs
interface PremiumTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  chatMessageCount: number;
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

const PremiumTabs: FC<PremiumTabsProps> = ({ activeTab, setActiveTab, chatMessageCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Find the active item for display in the dropdown button
  const activeItem = activeTab !== "info" ? dropdownItems.find((item) => item.id === activeTab) : undefined;

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
    </MotionConfig>
  );
};

export default PremiumTabs;