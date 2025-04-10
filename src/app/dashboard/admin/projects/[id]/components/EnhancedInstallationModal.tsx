import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  CalendarIcon,
  UserGroupIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  ShoppingBagIcon,
  ArrowLongRightIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  ArrowPathIcon,
  // StarIcon,
  // ShieldExclamationIcon,
  // BoltIcon,
  // CubeIcon
} from "@heroicons/react/24/outline";
import { 
  ShieldCheckIcon, 
  CheckCircleIcon,
  TruckIcon,
  FireIcon,
  // LightBulbIcon,
  // BoltIcon as BoltSolidIcon,
  // SparklesIcon
} from "@heroicons/react/24/solid";

// TypeScript interfaces for component props
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

// Modal for demo purposes - in a real implementation, you would use your Dialog component
const Modal = ({ isOpen, children }: ModalProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" />
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        {children}
      </div>
    </div>
  );
};

// TypeScript interfaces for our data models
interface TimeSlot {
  time: string;
  duration: number; // in minutes
  available: boolean;
}

interface AvailableSlot {
  id: number;
  date: string;
  times: string[];
  timeSlots?: TimeSlot[]; // Detailed info for enhanced UI
}

interface Installer {
  id: number;
  name: string;
  rating: number;
  specialty: string;
  available: boolean;
  image: string;
  installations: number;
  verified: boolean;
  experience?: number; // Years of experience
  certifications?: string[]; // Professional certifications
  responseTime?: number; // Average response time in hours
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  stock: number;
  energy: string;
  power: string;
  dimensions: string;
  compatible: boolean;
  description?: string;
  warranty?: number; // Warranty period in years
  features?: string[]; // Special features
  ecoBenefits?: string[]; // Ecological benefits
  installationTime?: number; // Estimated installation time in hours
  manufacturer?: string;
}

interface Accessory {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
  description: string;
  compatibility?: string[]; // Compatible with which products
  required?: boolean; // Is this accessory required for installation?
  warranty?: number; // Warranty period in years
}

interface CalendarDay {
  date: Date;
  dateString: string;
  isCurrentMonth: boolean;
  hasSlots?: boolean;
}

// Available installation slots for the agenda
const availableSlots: AvailableSlot[] = [
  { 
    id: 1, 
    date: "2025-04-15", 
    times: ["08:00", "11:00", "14:00", "16:00"],
    timeSlots: [
      { time: "08:00", duration: 120, available: true },
      { time: "11:00", duration: 120, available: true },
      { time: "14:00", duration: 120, available: true },
      { time: "16:00", duration: 120, available: true }
    ]
  },
  { 
    id: 2, 
    date: "2025-04-16", 
    times: ["09:00", "13:00", "15:00"],
    timeSlots: [
      { time: "09:00", duration: 120, available: true },
      { time: "13:00", duration: 120, available: true },
      { time: "15:00", duration: 120, available: true }
    ]
  },
  { 
    id: 3, 
    date: "2025-04-17", 
    times: ["08:30", "10:30", "14:30", "16:30"],
    timeSlots: [
      { time: "08:30", duration: 120, available: true },
      { time: "10:30", duration: 120, available: true },
      { time: "14:30", duration: 120, available: true },
      { time: "16:30", duration: 120, available: true }
    ]
  },
  { 
    id: 4, 
    date: "2025-04-18", 
    times: ["08:00", "12:00", "15:00"],
    timeSlots: [
      { time: "08:00", duration: 120, available: true },
      { time: "12:00", duration: 120, available: true },
      { time: "15:00", duration: 120, available: true }
    ]
  },
  { 
    id: 5, 
    date: "2025-04-19", 
    times: ["10:00", "14:00"],
    timeSlots: [
      { time: "10:00", duration: 120, available: true },
      { time: "14:00", duration: 120, available: true }
    ]
  },
  { 
    id: 6, 
    date: "2025-04-22", 
    times: ["09:00", "13:30", "16:00"],
    timeSlots: [
      { time: "09:00", duration: 120, available: true },
      { time: "13:30", duration: 120, available: true },
      { time: "16:00", duration: 120, available: true }
    ]
  },
  { 
    id: 7, 
    date: "2025-04-23", 
    times: ["08:00", "10:30", "14:00", "15:30"],
    timeSlots: [
      { time: "08:00", duration: 120, available: true },
      { time: "10:30", duration: 120, available: true },
      { time: "14:00", duration: 120, available: true },
      { time: "15:30", duration: 120, available: true }
    ]
  },
  { 
    id: 8, 
    date: "2025-04-24", 
    times: ["09:30", "13:00", "16:30"],
    timeSlots: [
      { time: "09:30", duration: 120, available: true },
      { time: "13:00", duration: 120, available: true },
      { time: "16:30", duration: 120, available: true }
    ]
  },
  { 
    id: 9, 
    date: "2025-04-25", 
    times: ["08:30", "11:30", "14:30"],
    timeSlots: [
      { time: "08:30", duration: 120, available: true },
      { time: "11:30", duration: 120, available: true },
      { time: "14:30", duration: 120, available: true }
    ]
  },
  { 
    id: 10, 
    date: "2025-04-26", 
    times: ["10:00", "14:00"],
    timeSlots: [
      { time: "10:00", duration: 120, available: true },
      { time: "14:00", duration: 120, available: true }
    ]
  }
];

// Example installers for the dropdown
const installers: Installer[] = [
  { 
    id: 1, 
    name: "Thomas Martin", 
    rating: 4.9, 
    specialty: "Chauffage", 
    available: true, 
    image: "/api/placeholder/48/48", 
    installations: 127, 
    verified: true,
    experience: 8,
    certifications: ["RGE QualiPAC", "Qualibat"],
    responseTime: 2
  },
  { 
    id: 2, 
    name: "Sophie Dubois", 
    rating: 4.8, 
    specialty: "Électricité", 
    available: true, 
    image: "/api/placeholder/48/48", 
    installations: 98, 
    verified: true,
    experience: 6,
    certifications: ["Qualifélec", "RGE Eco Artisan"],
    responseTime: 3
  },
  { 
    id: 3, 
    name: "Paul Lefebvre", 
    rating: 4.7, 
    specialty: "Plomberie", 
    available: false, 
    image: "/api/placeholder/48/48", 
    installations: 75, 
    verified: true,
    experience: 5,
    certifications: ["Qualibat"],
    responseTime: 4
  },
  { 
    id: 4, 
    name: "Camille Leroy", 
    rating: 4.9, 
    specialty: "Polyvalent", 
    available: true, 
    image: "/api/placeholder/48/48", 
    installations: 156, 
    verified: true,
    experience: 10,
    certifications: ["RGE QualiPAC", "Qualibat", "Qualifélec"],
    responseTime: 1
  },
  { 
    id: 5, 
    name: "Antoine Mercier", 
    rating: 4.6, 
    specialty: "Chauffage", 
    available: true, 
    image: "/api/placeholder/48/48", 
    installations: 68, 
    verified: false,
    experience: 3,
    certifications: ["En cours de certification"],
    responseTime: 5
  },
];

// Example products for the installation
const products: Product[] = [
  { 
    id: 1, 
    name: "Pompe à chaleur EcoHeat Pro", 
    category: "Chauffage", 
    price: 3499, 
    rating: 4.8, 
    image: "/api/placeholder/80/80", 
    stock: 12,
    energy: "A+++",
    power: "8 kW",
    dimensions: "80 × 60 × 40 cm",
    compatible: true,
    description: "Pompe à chaleur air/eau haute performance avec technologie inverter",
    warranty: 5,
    features: ["Contrôle intelligent", "Mode ECO", "Dégivrage automatique", "Ultra silencieux"],
    ecoBenefits: ["Réduction CO2 de 70%", "Éligible aux aides de l'état", "CEE bonifié"],
    installationTime: 6,
    manufacturer: "EcoSystems France"
  },
  { 
    id: 2, 
    name: "Climatiseur réversible AirMax", 
    category: "Climatisation", 
    price: 2799, 
    rating: 4.7, 
    image: "/api/placeholder/80/80", 
    stock: 8,
    energy: "A++",
    power: "12000 BTU",
    dimensions: "95 × 30 × 25 cm",
    compatible: true,
    description: "Climatiseur réversible pour chauffage et refroidissement",
    warranty: 3,
    features: ["Mode nuit", "Auto-nettoyage", "Filtre anti-allergie", "WiFi intégré"],
    ecoBenefits: ["Faible niveau sonore", "Réfrigérant écologique R32"],
    installationTime: 4,
    manufacturer: "AirClim Technologies"
  },
  { 
    id: 3, 
    name: "Chaudière condensation EcoBoiler", 
    category: "Chauffage", 
    price: 2299, 
    rating: 4.9, 
    image: "/api/placeholder/80/80", 
    stock: 5,
    energy: "A++",
    power: "24 kW",
    dimensions: "70 × 45 × 35 cm",
    compatible: true,
    description: "Chaudière à condensation haute efficacité pour chauffage central",
    warranty: 7,
    features: ["Rendement 109%", "Modulation continue", "Échangeur inox", "Connectivité smartphone"],
    ecoBenefits: ["Réduction consommation gaz 30%", "Éligible MaPrimeRénov'"],
    installationTime: 5,
    manufacturer: "ThermoConfort"
  },
  { 
    id: 4, 
    name: "Radiateur connecté SmartHeat", 
    category: "Chauffage", 
    price: 899, 
    rating: 4.5, 
    image: "/api/placeholder/80/80", 
    stock: 23,
    energy: "A+",
    power: "1500 W",
    dimensions: "100 × 50 × 10 cm",
    compatible: false,
    description: "Radiateur électrique intelligent avec détection de présence",
    warranty: 2,
    features: ["Pilotage à distance", "Programmation hebdomadaire", "Mode éco", "Capteur de présence"],
    ecoBenefits: ["Économie d'énergie jusqu'à 45%"],
    installationTime: 2,
    manufacturer: "ConnectHeat"
  }
];

// Accessories for heating pumps
const accessories: Accessory[] = [
  { 
    id: 101, 
    name: "Kit d'installation standard", 
    price: 199, 
    image: "/api/placeholder/60/60", 
    stock: 45,
    description: "Kit complet avec tuyaux, supports et raccords",
    compatibility: ["Pompe à chaleur EcoHeat Pro", "Climatiseur réversible AirMax"],
    required: true,
    warranty: 2
  },
  { 
    id: 102, 
    name: "Protection antigel premium", 
    price: 149, 
    image: "/api/placeholder/60/60", 
    stock: 32,
    description: "Protection contre le gel jusqu'à -25°C",
    compatibility: ["Pompe à chaleur EcoHeat Pro"],
    required: false,
    warranty: 3
  },
  { 
    id: 103, 
    name: "Support mural renforcé", 
    price: 89, 
    image: "/api/placeholder/60/60", 
    stock: 18,
    description: "Support anti-vibration pour unité extérieure",
    compatibility: ["Pompe à chaleur EcoHeat Pro", "Climatiseur réversible AirMax"],
    required: false,
    warranty: 5
  },
  { 
    id: 104, 
    name: "Module Wi-Fi EcoConnect", 
    price: 129, 
    image: "/api/placeholder/60/60", 
    stock: 27,
    description: "Contrôle à distance via smartphone",
    compatibility: ["Pompe à chaleur EcoHeat Pro", "Chaudière condensation EcoBoiler"],
    required: false,
    warranty: 2
  }
];

interface EnhancedInstallationModalProps {
  // Optional props can be added here if needed
  initialStep?: number;
  onComplete?: (data: {
    date: string;
    time: string;
    installer: Installer | undefined;
    product: Product | null;
    quantity: number;
    accessories: Accessory[];
    notes: string;
    total: number;
    address: string;
    status: string;
  }) => void;
  clientAddress?: string;
}

const EnhancedInstallationModal: React.FC<EnhancedInstallationModalProps> = ({
  initialStep = 1,
  onComplete,
  clientAddress = "123 Rue de Paris, 75001 Paris"
}) => {
  // Modal state
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 3)); // April 2025
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [ , setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [calendarView, setCalendarView] = useState<"month" | "day" | "week">("month");
  
  // Installer state
  const [selectedInstaller, setSelectedInstaller] = useState<number | null>(null);
  const [installationNotes, setInstallationNotes] = useState<string>("");
  const [ , setSearchInstallerQuery] = useState<string>("");
  const [ , setInstallerFilterSpecialty] = useState<string | null>(null);
  
  // Product state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showAccessories, setShowAccessories] = useState<boolean>(false);
  const [selectedAccessories, setSelectedAccessories] = useState<Accessory[]>([]);
  const [orderReserved, setOrderReserved] = useState<boolean>(false);
  const [ , setProductSearchQuery] = useState<string>("");
  const [ , setProductCategoryFilter] = useState<string | null>(null);
  
  // UI state
  const [ , setShowInstallerDetails] = useState<boolean>(false);
  const [ , setShowProductDetails] = useState<boolean>(false);
  const [ , setActiveDetailTab] = useState<string>("specs");
  
  // Cart totals
  const cartTotal = selectedProduct 
    ? selectedProduct.price * quantity + 
      selectedAccessories.reduce((sum, acc) => sum + acc.price, 0)
    : 0;
  
  // Filtered installers based on search and filters
  // const filteredInstallers = installers
  //   .filter(installer => 
  //     installer.available && 
  //     (searchInstallerQuery === "" || 
  //      installer.name.toLowerCase().includes(searchInstallerQuery.toLowerCase()) ||
  //      installer.specialty.toLowerCase().includes(searchInstallerQuery.toLowerCase())) &&
  //     (installerFilterSpecialty === null || installer.specialty === installerFilterSpecialty)
  //   );
    
  // Filtered products based on search and filters
  // const filteredProducts = products
  //   .filter(product => 
  //     (productSearchQuery === "" || 
  //      product.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
  //      product.category.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
  //      product.description?.toLowerCase().includes(productSearchQuery.toLowerCase())) &&
  //     (productCategoryFilter === null || product.category === productCategoryFilter)
  //   );
    
  // Get available specialties for filtering
  // const availableSpecialties = Array.from(new Set(installers.map(installer => installer.specialty)));
  
  // Get available product categories for filtering
  // const availableCategories = Array.from(new Set(products.map(product => product.category)));
  
  // Reset form state when modal is opened
  const openModal = (): void => {
    setIsOpen(true);
    resetForm();
  };
  
  // Reset all form values
  const resetForm = (): void => {
    setCurrentStep(initialStep);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedTimeSlot(null);
    setSelectedInstaller(null);
    setInstallationNotes("");
    setSelectedProduct(null);
    setQuantity(1);
    setShowAccessories(false);
    setSelectedAccessories([]);
    setOrderReserved(false);
    setCalendarView("month");
    setSearchInstallerQuery("");
    setInstallerFilterSpecialty(null);
    setProductSearchQuery("");
    setProductCategoryFilter(null);
    setShowInstallerDetails(false);
    setShowProductDetails(false);
    setActiveDetailTab("specs");
  };
  
  // Handle product form submission
  const handleProductSubmit = (): void => {
    setOrderReserved(true);
    // Simulate stock update
    const productIndex = products.findIndex(p => p.id === selectedProduct?.id);
    if (productIndex !== -1 && products[productIndex].stock >= quantity) {
      products[productIndex].stock -= quantity;
    }
    
    // Show completion animation then move to next step
    setTimeout(() => {
      setCurrentStep(4);
    }, 1500);
  };
  
  // Handle final installation submission
  const handleInstallSubmit = (): void => {
    if (!selectedDate || !selectedTime || !selectedInstaller || !selectedProduct) return;
    
    setIsSubmitting(true);
    
    // Prepare data for submission
    const installationData = {
      date: selectedDate,
      time: selectedTime,
      installer: installers.find(i => i.id === selectedInstaller),
      product: selectedProduct,
      quantity,
      accessories: selectedAccessories,
      notes: installationNotes,
      total: cartTotal,
      address: clientAddress,
      status: "EN_COURS"
    };
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsOpen(false);
      resetForm();
      
      // Call completion callback if provided
      if (onComplete) {
        onComplete(installationData);
      }
    }, 2000);
  };
  
  // Toggle accessory selection
  const toggleAccessory = (accessory: Accessory): void => {
    if (selectedAccessories.find(a => a.id === accessory.id)) {
      setSelectedAccessories(selectedAccessories.filter(a => a.id !== accessory.id));
    } else {
      setSelectedAccessories([...selectedAccessories, accessory]);
    }
  };
  
  // Get days in month for calendar
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get day of week (0-6) for the first day of the month
  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };
  
  // Check if a date has available slots
  const hasAvailableSlots = (dateString: string): boolean => {
    return availableSlots.some(slot => slot.date === dateString);
  };
  
  // Get available slot count for a date
  const getAvailableSlotCount = (dateString: string): number => {
    const slot = availableSlots.find(slot => slot.date === dateString);
    return slot ? slot.times.length : 0;
  };
  
  // Adjust first day to make Monday the first day of the week (0 = Monday, 6 = Sunday)
  const adjustFirstDay = (day: number): number => {
    return day === 0 ? 6 : day - 1;
  };
  
  // Generate calendar days for current month view
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = adjustFirstDay(getFirstDayOfMonth(year, month));
    
    // Previous month days (for filling the first row)
    const prevMonthDays: CalendarDay[] = [];
    if (firstDay > 0) {
      const prevMonth = new Date(year, month, 0);
      const prevMonthDaysCount = prevMonth.getDate();
      for (let i = prevMonthDaysCount - firstDay + 1; i <= prevMonthDaysCount; i++) {
        const date = new Date(year, month - 1, i);
        prevMonthDays.push({
          date,
          dateString: date.toISOString().split('T')[0],
          isCurrentMonth: false
        });
      }
    }
    
    // Current month days
    const currentMonthDays: CalendarDay[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      currentMonthDays.push({
        date,
        dateString,
        isCurrentMonth: true,
        hasSlots: hasAvailableSlots(dateString)
      });
    }
    
    // Next month days (for filling the last row)
    const nextMonthDays: CalendarDay[] = [];
    const totalDays = prevMonthDays.length + currentMonthDays.length;
    const remainingCells = 42 - totalDays; // 6 rows * 7 days = 42 cells
    
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      nextMonthDays.push({
        date,
        dateString: date.toISOString().split('T')[0],
        isCurrentMonth: false
      });
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };
  
  // Generate week view data centered around selected date
  const generateWeekView = (): CalendarDay[] => {
    if (!selectedDate) return [];
    
    const selectedDateObj = new Date(selectedDate);
    const dayOfWeek = selectedDateObj.getDay();
    const sunday = new Date(selectedDateObj);
    sunday.setDate(selectedDateObj.getDate() - dayOfWeek);
    
    const weekDays: CalendarDay[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      weekDays.push({
        date,
        dateString,
        isCurrentMonth: date.getMonth() === currentMonth.getMonth(),
        hasSlots: hasAvailableSlots(dateString)
      });
    }
    
    return weekDays;
  };
  
  // Get time slots for a specific date with detailed information
  // const getTimeSlots = (dateString: string): TimeSlot[] => {
  //   const slot = availableSlots.find(slot => slot.date === dateString);
  //   return slot?.timeSlots || [];
  // };
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  
  // Format month name
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
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
    <div>
      {/* Demo button to open modal */}
      <button 
        onClick={openModal}
        className="group flex items-center space-x-3 px-6 py-3.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/20"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 group-hover:bg-white/30">
          <WrenchScrewdriverIcon className="w-5 h-5" />
        </span>
        <span className="text-sm font-semibold tracking-wide">Placer en installation</span>
      </button>
      
      {/* Enhanced Installation Modal */}
      <Modal isOpen={isOpen} onClose={() => !isSubmitting && setIsOpen(false)}>
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
              onClick={() => !isSubmitting && setIsOpen(false)}
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
                  Planifiez l&apos;installation, sélectionnez les produits et l&apos;installateur
                </p>
              </div>
            </div>
            
            {/* Step indicators - Enhanced with 4 steps */}
            <div className="py-4 flex justify-center bg-gradient-to-r from-green-700/40 to-emerald-700/40 rounded-lg mb-2">
              <div className="flex w-full max-w-md items-center justify-between px-4">
                {[1, 2, 3, 4].map((step) => (
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
                      {step === 1 ? "Agenda" : 
                       step === 2 ? "Installateur" : 
                       step === 3 ? "Produits" : 
                       "Confirmation"}
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
          <div className="px-6 py-6 sm:px-8 sm:py-8 max-h-[70vh] overflow-y-auto">
            {/* Step 1: Enhanced Calendar/Agenda */}
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
                
                {/* Enhanced Calendar view */}
                <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Calendar header */}
                  <div className="bg-white p-5 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                          <CalendarIcon className="h-5 w-5" />
                        </div>
                        <h5 className="text-base font-medium text-gray-800 capitalize">
                          {formatMonth(currentMonth)}
                        </h5>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {/* Calendar view toggle */}
                        <div className="flex p-1 rounded-lg bg-gray-100 text-xs font-medium">
                          <button
                            onClick={() => setCalendarView("month")}
                            className={`px-3 py-1.5 rounded-md transition ${
                              calendarView === "month"
                                ? "bg-white text-gray-800 shadow-sm"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            Mois
                          </button>
                          <button
                            onClick={() => setCalendarView("day")}
                            disabled={!selectedDate}
                            className={`px-3 py-1.5 rounded-md transition ${
                              calendarView === "day"
                                ? "bg-white text-gray-800 shadow-sm"
                                : selectedDate
                                ? "text-gray-600 hover:bg-gray-50"
                                : "text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            Jour
                          </button>
                        </div>
                        
                        {/* Month navigation */}
                        <div className="flex space-x-2">
                          <button 
                            onClick={goToPreviousMonth}
                            className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 transition"
                          >
                            <ChevronLeftIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={goToNextMonth}
                            className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 transition"
                          >
                            <ChevronRightIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Calendar grid - Month view */}
                  {calendarView === "month" && (
                    <div className="bg-white p-4">
                      {/* Week days */}
                      <div className="grid grid-cols-7 mb-2">
                        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, i) => (
                          <div key={i} className="text-center py-2">
                            <span className="text-xs font-medium text-gray-500">{day}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Calendar days grid - Enhanced with animations and better visuals */}
                      <div className="grid grid-cols-7 gap-1">
                        {generateCalendarDays().map((day, index) => {
                          const isSelected = selectedDate === day.dateString;
                          const slotCount = day.isCurrentMonth && day.hasSlots ? 
                            getAvailableSlotCount(day.dateString) : 0;
                          
                          // Today's date for highlighting
                          const isToday = new Date().toISOString().split('T')[0] === day.dateString;
                          
                          return (
                            <motion.button
                              key={index}
                              whileHover={day.isCurrentMonth && day.hasSlots ? { scale: 1.05 } : {}}
                              whileTap={day.isCurrentMonth && day.hasSlots ? { scale: 0.95 } : {}}
                              onClick={() => {
                                if (day.isCurrentMonth && day.hasSlots) {
                                  setSelectedDate(day.dateString);
                                  setSelectedTime(null);
                                  setSelectedTimeSlot(null);
                                  setCalendarView("day");
                                }
                              }}
                              disabled={!day.isCurrentMonth || !day.hasSlots}
                              className={`relative h-14 rounded-lg border p-1 text-center transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                !day.isCurrentMonth
                                  ? "border-transparent bg-white text-gray-300"
                                  : isSelected
                                  ? "border-green-500 bg-green-50 text-green-700 shadow-md ring-1 ring-green-500/30"
                                  : isToday && day.hasSlots
                                  ? "cursor-pointer border-blue-300 bg-blue-50/30 text-blue-700 shadow-sm"
                                  : day.hasSlots
                                  ? "cursor-pointer border-gray-100 hover:border-green-200 hover:bg-green-50/50 hover:shadow-sm"
                                  : "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400"
                              }`}
                            >
                              <div className="flex flex-col items-center justify-center h-full">
                                {/* Date with special indicator for today */}
                                {isToday ? (
                                  <div className={`flex items-center justify-center h-6 w-6 rounded-full ${
                                    isSelected 
                                      ? "bg-green-500 text-white"
                                      : "bg-blue-500 text-white"
                                  }`}>
                                    <span className="text-xs font-bold">{day.date.getDate()}</span>
                                  </div>
                                ) : (
                                  <span className={`text-sm ${isSelected ? "font-medium" : ""}`}>
                                    {day.date.getDate()}
                                  </span>
                                )}
                                
                                {/* Enhanced indicator for available slots */}
                                {day.isCurrentMonth && day.hasSlots && (
                                  <div className="mt-1 text-center">
                                    <div className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs ${
                                      isSelected
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}>
                                      <span>{slotCount}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Enhanced hover effect */}
                              {day.isCurrentMonth && day.hasSlots && !isSelected && (
                                <div className="absolute inset-0 rounded-lg border-2 border-green-500/70 opacity-0 hover:opacity-100 transition-opacity" />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* NEW: Week view */}
                  {calendarView === "week" && selectedDate && (
                    <div className="bg-white p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h6 className="text-sm font-medium text-gray-700 flex items-center">
                          <span className="capitalize">Semaine du {new Date(selectedDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
                          <button 
                            onClick={() => setCalendarView("month")}
                            className="ml-2 text-xs text-blue-600 hover:text-blue-700 flex items-center"
                          >
                            <ChevronLeftIcon className="h-3.5 w-3.5 mr-0.5" />
                            Vue mois
                          </button>
                        </h6>
                      </div>
                      
                      {/* Week days header */}
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day, i) => (
                          <div key={i} className="text-center">
                            <span className="text-xs font-medium text-gray-500">{day}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Week days content */}
                      <div className="grid grid-cols-7 gap-2">
                        {generateWeekView().map((day, index) => {
                          const isSelected = selectedDate === day.dateString;
                          const slotCount = day.hasSlots ? getAvailableSlotCount(day.dateString) : 0;
                          
                          return (
                            <motion.button
                              key={index}
                              whileHover={day.hasSlots ? { scale: 1.05 } : {}}
                              whileTap={day.hasSlots ? { scale: 0.95 } : {}}
                              onClick={() => {
                                if (day.hasSlots) {
                                  setSelectedDate(day.dateString);
                                  setSelectedTime(null);
                                  setSelectedTimeSlot(null);
                                  setCalendarView("day");
                                }
                              }}
                              disabled={!day.hasSlots}
                              className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
                                isSelected
                                  ? "border-green-500 bg-green-50 text-green-700 shadow-md"
                                  : day.hasSlots
                                  ? "border-gray-200 hover:border-green-200 hover:bg-green-50/50"
                                  : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              <span className="text-sm font-medium">
                                {day.date.getDate()}
                              </span>
                              
                              {day.hasSlots && (
                                <div className="mt-1 text-xs text-center">
                                  <span className={`inline-block rounded-full px-1.5 py-0.5 ${
                                    isSelected
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}>
                                    {slotCount} dispo
                                  </span>
                                </div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Calendar view - Enhanced Day view */}
                  {calendarView === "day" && selectedDate && (
                    <div className="bg-white p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 mr-2">
                            <CalendarIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Disponibilités</span>
                            <h6 className="text-sm font-medium text-gray-800 capitalize">
                              {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </h6>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => setCalendarView("month")}
                            className="px-2 py-1 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center transition-colors"
                          >
                            <ChevronLeftIcon className="h-3.5 w-3.5 mr-0.5" />
                            Mois
                          </button>
                          <button 
                            onClick={() => setCalendarView("week")}
                            className="px-2 py-1 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center transition-colors"
                          >
                            <ChevronLeftIcon className="h-3.5 w-3.5 mr-0.5" />
                            Semaine
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          {availableSlots.find(slot => slot.date === selectedDate)?.times.length || 0} créneaux disponibles
                        </span>
                        
                        {/* Morning/Afternoon filter buttons */}
                        <div className="flex p-0.5 rounded-lg bg-gray-100 text-xs font-medium">
                          <button className="px-3 py-1 rounded-md bg-white text-gray-800 shadow-sm">
                            Tous
                          </button>
                          <button className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-50">
                            Matin
                          </button>
                          <button className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-50">
                            Après-midi
                          </button>
                        </div>
                      </div>
                      
                      {/* Timeline view for time slots - Enhanced design */}
                      <div className="relative pt-4 pb-1">
                        {/* Timeline line */}
                        <div className="absolute left-5 top-4 bottom-0 w-0.5 bg-gray-200"></div>
                        
                        {/* Time slots along timeline */}
                        <div className="space-y-4">
                          {availableSlots
                            .find(slot => slot.date === selectedDate)
                            ?.timeSlots?.map((timeSlot, index) => {
                              const isSelected = selectedTime === timeSlot.time;
                              const hour = parseInt(timeSlot.time.split(':')[0], 10);
                              const isMorning = hour < 12;
                              
                              return (
                                <motion.div
                                  key={index}
                                  whileHover={{ x: 4 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => {
                                    setSelectedTime(timeSlot.time);
                                    setSelectedTimeSlot(timeSlot);
                                  }}
                                  className={`flex items-start relative cursor-pointer group ml-2 pl-10 pr-3 py-3 rounded-lg border transition-all ${
                                    isSelected
                                      ? "border-green-500 bg-green-50 shadow-md"
                                      : "border-gray-200 hover:border-green-300 hover:bg-green-50/50 hover:shadow-sm"
                                  }`}
                                >
                                  {/* Timeline dot */}
                                  <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 flex items-center justify-center h-5 w-5 rounded-full border-2 border-white z-10 ${
                                    isSelected 
                                      ? "bg-green-500" 
                                      : "bg-gray-300 group-hover:bg-green-400"
                                  }`}>
                                    {isSelected && <CheckIcon className="h-3 w-3 text-white" />}
                                  </div>
                                  
                                  {/* Time indicator */}
                                  <div className={`flex items-center justify-center h-11 w-11 rounded-full mr-3 ${
                                    isSelected ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                  }`}>
                                    <div className="text-center">
                                      <span className="text-sm font-bold block leading-none">
                                        {timeSlot.time}
                                      </span>
                                      <span className="text-xs opacity-70">
                                        {isMorning ? "AM" : "PM"}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* Slot details */}
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <span className={`text-base ${isSelected ? "font-medium text-green-700" : "text-gray-700"}`}>
                                        Créneau d&apos;installation
                                      </span>
                                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                        isSelected 
                                          ? "bg-green-100 text-green-800" 
                                          : "bg-gray-100 text-gray-700"
                                      }`}>
                                        Disponible
                                      </span>
                                    </div>
                                    <div className="mt-0.5 flex items-center text-xs text-gray-500">
                                      <svg className="h-3.5 w-3.5 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                      </svg>
                                      <span>Durée: {timeSlot.duration / 60} heure{timeSlot.duration / 60 > 1 ? 's' : ''}</span>
                                      
                                      <span className="mx-2 text-gray-300">•</span>
                                      
                                      <svg className="h-3.5 w-3.5 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                      </svg>
                                      <span>{isMorning ? 'Équipe du matin' : 'Équipe du soir'}</span>
                                    </div>
                                  </div>
                                  
                                  {/* Selection indicator */}
                                  {isSelected && (
                                    <div className="ml-2 flex-shrink-0">
                                      <div className="bg-green-100 rounded-full p-1.5 text-green-600">
                                        <CheckIcon className="h-4 w-4" />
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Selected time summary */}
                  {selectedDate && selectedTime && (
                    <div className="border-t border-gray-100 bg-gray-50 p-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-100 text-green-600 mr-3">
                          <CheckIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Créneau sélectionné
                          </span>
                          <p className="font-medium text-gray-800">
                            {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {selectedTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Time selection help */}
                <div className="flex items-start p-4 rounded-lg bg-blue-50 text-blue-800">
                  <svg className="h-5 w-5 flex-shrink-0 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Sélection de créneau</p>
                    <p>Choisissez une date avec des disponibilités (indiquées par des points) puis sélectionnez l&apos;horaire qui vous convient.</p>
                  </div>
                </div>
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
                  <p className="mt-1 text-sm text-gray-500">Choisissez un professionnel certifié pour réaliser cette installation</p>
                </div>
                
                {/* Enhanced installer cards with hover effects */}
                <div className="space-y-3">
                  {installers
                    .filter(installer => installer.available)
                    .map(installer => (
                      <motion.button
                        key={installer.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedInstaller(installer.id)}
                        className={`flex w-full items-center rounded-xl border p-4 transition-all hover:shadow-md ${
                          selectedInstaller === installer.id
                            ? "border-green-500 bg-green-50 shadow-sm"
                            : "border-gray-200 bg-white hover:border-green-200 hover:bg-green-50/30"
                        }`}
                      >
                        {/* Installer avatar */}
                        <div className={`relative mr-4 h-14 w-14 flex-shrink-0 rounded-full ${
                          selectedInstaller === installer.id ? "ring-2 ring-green-500" : ""
                        }`}>
                          <img
                            src={installer.image} 
                            alt={installer.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                          {installer.verified && (
                            <div className="absolute -right-1 -bottom-1 h-5 w-5 rounded-full bg-green-100 p-0.5 ring-2 ring-white">
                              <ShieldCheckIcon className="h-full w-full text-green-600" />
                            </div>
                          )}
                        </div>
                        
                        {/* Installer details */}
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
                          
                          <div className="mt-1 flex flex-wrap items-center gap-y-1 gap-x-3">
                            <span className="flex items-center text-xs text-gray-500">
                              <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                              Spécialité: {installer.specialty}
                            </span>
                            
                            <span className="flex items-center text-xs text-gray-500">
                              <svg className="mr-1 h-3.5 w-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              {installer.installations} installations
                            </span>
                            
                            <span className="text-xs font-medium text-green-600">
                              Disponible {selectedDate ? `le ${new Date(selectedDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}` : ''}
                            </span>
                          </div>
                        </div>
                        
                        {/* Selection indicator */}
                        {selectedInstaller === installer.id && (
                          <div className="ml-2 rounded-full bg-green-100 p-1 text-green-600">
                            <CheckIcon className="h-5 w-5" />
                          </div>
                        )}
                      </motion.button>
                    ))}
                </div>
                
                {/* Installation notes */}
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
                
                {/* Selected installer summary */}
                {selectedInstaller && (
                  <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                    <div className="flex items-start">
                      <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <CheckIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h6 className="text-sm font-medium text-gray-800">
                          Installateur sélectionné: {installers.find(i => i.id === selectedInstaller)?.name}
                        </h6>
                        <p className="mt-1 text-xs text-gray-500">
                          L&apos;installateur sera notifié après confirmation de cette intervention.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            
            {/* Step 3: Product Selection (NEW) */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Sélectionnez les produits à installer</h4>
                  <p className="mt-1 text-sm text-gray-500">Choisissez les équipements nécessaires pour cette installation</p>
                </div>
                
                {/* Product selection cards */}
                <div className="space-y-4">
                  {products.map(product => (
                    <motion.div
                      key={product.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedProduct(product)}
                      className={`relative flex w-full rounded-xl border transition-all cursor-pointer ${
                        selectedProduct?.id === product.id
                          ? "border-green-500 bg-green-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-green-200 hover:bg-green-50/30 hover:shadow-sm"
                      }`}
                    >
                      {/* Selected indicator */}
                      {selectedProduct?.id === product.id && (
                        <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-green-500 shadow-sm flex items-center justify-center ring-2 ring-white">
                          <CheckIcon className="h-4 w-4 text-white" />
                        </div>
                      )}
                      
                      {/* Product image */}
                      <div className="p-4 flex-shrink-0">
                        <div className="h-20 w-20 rounded-lg bg-gray-100 p-1 flex items-center justify-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </div>
                      
                      {/* Product details */}
                      <div className="flex-1 p-4 pl-0">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className={`text-base font-medium ${
                            selectedProduct?.id === product.id ? "text-green-700" : "text-gray-900"
                          }`}>
                            {product.name}
                          </h5>
                          <div className="flex items-center ml-2">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              product.stock > 10
                                ? "bg-green-100 text-green-800"
                                : product.stock > 5
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                              {product.stock} en stock
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-2">
                          Catégorie: {product.category}
                        </p>
                        
                        {/* Product specs */}
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
                          <span className="inline-flex items-center text-xs text-gray-500">
                            <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-1"></span>
                            Classe énergétique: {product.energy}
                          </span>
                          <span className="inline-flex items-center text-xs text-gray-500">
                            <span className="inline-block h-2 w-2 rounded-full bg-purple-500 mr-1"></span>
                            Puissance: {product.power}
                          </span>
                          <span className="inline-flex items-center text-xs text-gray-500">
                            <span className="inline-block h-2 w-2 rounded-full bg-gray-500 mr-1"></span>
                            Dimensions: {product.dimensions}
                          </span>
                        </div>
                      </div>
                      
                      {/* Price and rating */}
                      <div className="border-l border-gray-200 p-4 flex flex-col justify-between items-end">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 text-xs font-medium text-gray-600">{product.rating}</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {product.price.toLocaleString('fr-FR')} €
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Quantity selector and accessories - Appears when product is selected */}
                {selectedProduct && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-gray-200 overflow-hidden"
                  >
                    {/* Quantity section */}
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium text-gray-700">Quantité</h5>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                          >
                            <MinusCircleIcon className="h-5 w-5" />
                          </button>
                          <span className="text-base font-medium text-gray-900 w-6 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                            disabled={quantity >= selectedProduct.stock}
                            className={`h-8 w-8 flex items-center justify-center rounded-full border bg-white ${
                              quantity >= selectedProduct.stock
                                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                                : "border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            <PlusCircleIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Accessories toggle */}
                    <button
                      onClick={() => setShowAccessories(!showAccessories)}
                      className="w-full p-4 flex items-center justify-between border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="mr-3 h-10 w-10 flex items-center justify-center rounded-full bg-amber-100 text-amber-600">
                          <FireIcon className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <h5 className="text-sm font-medium text-gray-800">Accessoires recommandés</h5>
                          <p className="text-xs text-gray-500">Ajoutez des accessoires pour optimiser votre installation</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2 text-xs font-medium text-gray-500">
                          {selectedAccessories.length} sélectionné(s)
                        </span>
                        <ChevronRightIcon className={`h-5 w-5 text-gray-400 transition-transform ${showAccessories ? "rotate-90" : ""}`} />
                      </div>
                    </button>
                    
                    {/* Accessories selection */}
                    <AnimatePresence>
                      {showAccessories && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-b border-gray-200 overflow-hidden"
                        >
                          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {accessories.map(accessory => (
                              <div
                                key={accessory.id}
                                onClick={() => toggleAccessory(accessory)}
                                className={`relative flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                  selectedAccessories.find(a => a.id === accessory.id)
                                    ? "border-green-500 bg-green-50"
                                    : "border-gray-200 hover:border-green-200 hover:bg-green-50/30"
                                }`}
                              >
                                <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gray-100 p-1 mr-3 flex items-center justify-center">
                                  <img
                                    src={accessory.image}
                                    alt={accessory.name}
                                    className="max-h-full max-w-full object-contain"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h6 className={`text-sm font-medium ${
                                    selectedAccessories.find(a => a.id === accessory.id)
                                      ? "text-green-700"
                                      : "text-gray-800"
                                  }`}>
                                    {accessory.name}
                                  </h6>
                                  <p className="text-xs text-gray-500">{accessory.description}</p>
                                </div>
                                <div className="ml-2 text-right">
                                  <p className="text-sm font-bold text-gray-900">{accessory.price} €</p>
                                  <p className="text-xs text-gray-500">Stock: {accessory.stock}</p>
                                </div>
                                
                                {/* Checkbox */}
                                <div className={`absolute top-2 right-2 h-5 w-5 rounded-full ${
                                  selectedAccessories.find(a => a.id === accessory.id)
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200"
                                } flex items-center justify-center transition-colors`}>
                                  {selectedAccessories.find(a => a.id === accessory.id) && (
                                    <CheckIcon className="h-3 w-3" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Cart summary and reservations */}
                    <div className="p-4 bg-gray-50">
                      <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <ShoppingBagIcon className="h-5 w-5 text-gray-500 mr-2" />
                            <span className="text-sm font-medium text-gray-700">Total commande</span>
                          </div>
                          <span className="text-lg font-bold text-gray-900">
                            {cartTotal.toLocaleString('fr-FR')} €
                          </span>
                        </div>
                        
                        {/* Order reservation button */}
                        {!orderReserved ? (
                          <button
                            onClick={handleProductSubmit}
                            className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                          >
                            <span className="mr-2">Valider la commande</span>
                            <ArrowLongRightIcon className="h-5 w-5" />
                          </button>
                        ) : (
                          <div className="flex items-center justify-center p-3 rounded-lg bg-green-100 text-green-800">
                            <CheckCircleIcon className="h-5 w-5 mr-2 text-green-600" />
                            <span className="font-medium">Commande validée et réservée</span>
                          </div>
                        )}
                        
                        {/* Additional info */}
                        <div className="flex items-center text-xs text-gray-500">
                          <TruckIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                          <span>Les produits seront disponibles pour l&apos;installateur à la date prévue</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Product selection help */}
                {!selectedProduct && (
                  <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
                    <div className="flex">
                      <svg className="h-5 w-5 flex-shrink-0 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm">
                        Sélectionnez un produit principal pour l&apos;installation. Vous pourrez ensuite ajouter des accessoires recommandés.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            
            {/* Step 4: Final Confirmation */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Confirmez les détails de l&apos;installation</h4>
                  <p className="mt-1 text-sm text-gray-500">Vérifiez toutes les informations avant de finaliser</p>
                </div>
                
                {/* Confirmation summary */}
                <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                  {/* Section headers */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h5 className="text-base font-medium text-gray-800">Récapitulatif de l&apos;installation</h5>
                  </div>
                  
                  {/* Summary content */}
                  <div className="divide-y divide-gray-100">
                    {/* Date and time */}
                    <div className="flex p-4 sm:p-6">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 mr-4">
                        <CalendarIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h6 className="text-sm font-medium text-gray-700">Date et heure d&apos;installation</h6>
                        <p className="text-sm text-gray-900 mt-1">
                          {selectedDate && new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} à {selectedTime}
                        </p>
                      </div>
                    </div>
                    
                    {/* Installer */}
                    <div className="flex p-4 sm:p-6">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 mr-4">
                        <UserGroupIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h6 className="text-sm font-medium text-gray-700">Installateur</h6>
                        <div className="flex items-center mt-1">
                          <div className="h-8 w-8 rounded-full bg-gray-200 mr-2 overflow-hidden">
                            <img 
                              src={installers.find(inst => inst.id === selectedInstaller)?.image || '/api/placeholder/32/32'} 
                              alt="Installateur" 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-900">
                              {selectedInstaller && installers.find(inst => inst.id === selectedInstaller)?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {selectedInstaller && installers.find(inst => inst.id === selectedInstaller)?.specialty}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Products */}
                    <div className="flex p-4 sm:p-6">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 mr-4">
                        <ShoppingBagIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h6 className="text-sm font-medium text-gray-700">Produits commandés</h6>
                        
                        {/* Main product */}
                        {selectedProduct && (
                          <div className="mt-2 rounded-lg border border-gray-200 p-3">
                            <div className="flex">
                              <div className="h-14 w-14 rounded-md bg-gray-100 p-1 flex items-center justify-center mr-3 flex-shrink-0">
                                <img 
                                  src={selectedProduct.image} 
                                  alt={selectedProduct.name} 
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <p className="text-sm font-medium text-gray-800">{selectedProduct.name}</p>
                                  <p className="text-sm font-bold text-gray-800">
                                    {(selectedProduct.price * quantity).toLocaleString('fr-FR')} €
                                  </p>
                                </div>
                                <p className="text-xs text-gray-500">Quantité: {quantity}</p>
                                <div className="mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                                  Réservé
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Accessories */}
                        {selectedAccessories.length > 0 && (
                          <div className="mt-3">
                            <h6 className="text-xs font-medium uppercase text-gray-500 mb-2">Accessoires</h6>
                            <div className="space-y-2">
                              {selectedAccessories.map(accessory => (
                                <div key={accessory.id} className="flex items-center p-2 rounded-lg bg-gray-50">
                                  <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center mr-2 flex-shrink-0">
                                    <img 
                                      src={accessory.image} 
                                      alt={accessory.name} 
                                      className="max-h-full max-w-full object-contain"
                                    />
                                  </div>
                                  <div className="flex-1 flex items-center justify-between">
                                    <span className="text-xs text-gray-800">{accessory.name}</span>
                                    <span className="text-xs font-medium text-gray-800">{accessory.price} €</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Total */}
                        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Total</span>
                          <span className="text-base font-bold text-gray-900">{cartTotal.toLocaleString('fr-FR')} €</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Address */}
                    <div className="flex p-4 sm:p-6">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 mr-4">
                        <MapPinIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h6 className="text-sm font-medium text-gray-700">Adresse d&apos;installation</h6>
                        <p className="text-sm text-gray-900 mt-1">123 Rue de Paris, 75001 Paris</p>
                        <p className="mt-1 text-xs text-blue-600 underline cursor-pointer">Voir sur la carte</p>
                      </div>
                    </div>
                    
                    {/* Notes */}
                    {installationNotes && (
                      <div className="p-4 sm:p-6">
                        <h6 className="text-xs font-medium uppercase text-gray-500 mb-2">Notes d&apos;installation</h6>
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                          <p className="whitespace-pre-line text-sm text-gray-700">{installationNotes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Final confirmation notice */}
                <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
                  <div className="flex">
                    <svg className="h-5 w-5 flex-shrink-0 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium">Prêt à confirmer l&apos;installation</p>
                      <p className="mt-1 text-sm">
                        Une fois confirmée, cette installation sera programmée et le statut du dossier passera automatiquement à &quot;En cours&quot;. Un email de confirmation sera envoyé au client et à l&apos;installateur.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Modal footer with actions */}
          <div className="rounded-b-2xl bg-gray-50 px-6 py-4 border-t border-gray-100">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => {
                  if (currentStep > 1) {
                    setCurrentStep(currentStep - 1);
                  } else {
                    setIsOpen(false);
                  }
                }}
                disabled={isSubmitting}
                className="mt-3 inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
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
                  } else if (currentStep === 3) {
                    if (selectedProduct && orderReserved) {
                      setCurrentStep(4);
                    } else if (selectedProduct) {
                      handleProductSubmit();
                    }
                  } else {
                    handleInstallSubmit();
                  }
                }}
                disabled={
                  isSubmitting ||
                  (currentStep === 1 && (!selectedDate || !selectedTime)) ||
                  (currentStep === 2 && !selectedInstaller) ||
                  (currentStep === 3 && !selectedProduct)
                }
                className={`inline-flex w-full items-center justify-center rounded-lg px-6 py-3 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto ${
                  (currentStep === 1 && (!selectedDate || !selectedTime)) ||
                  (currentStep === 2 && !selectedInstaller) ||
                  (currentStep === 3 && !selectedProduct) ||
                  isSubmitting
                    ? "cursor-not-allowed bg-green-400"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                    Traitement...
                  </>
                ) : currentStep < 3 ? (
                  "Continuer"
                ) : currentStep === 3 && !orderReserved ? (
                  "Valider les produits"
                ) : currentStep === 3 && orderReserved ? (
                  "Continuer"
                ) : (
                  "Confirmer l'installation"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </Modal>
    </div>
  );
};

export default EnhancedInstallationModal;