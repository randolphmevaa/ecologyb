import { useState,  ReactNode } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
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
  StarIcon,
  // ShieldExclamationIcon,
  // BoltIcon,
  CubeIcon,
  UserIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  BuildingOfficeIcon,
  // CurrencyEuroIcon,
  ArrowsPointingOutIcon,
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  // HomeIcon,
  // ChevronDownIcon,
  AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";
import { 
  ShieldCheckIcon, 
  CheckCircleIcon,
  TruckIcon,
  FireIcon,
  LightBulbIcon,
  BoltIcon as BoltSolidIcon,
  // SparklesIcon,
  CalendarDaysIcon,
  Cog8ToothIcon,
  // LockClosedIcon,
  // ArrowTrendingUpIcon
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
  id: string;
  time: string;
  duration: number; // in minutes
  available: boolean;
  installerCount?: number; // Number of available installers
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
  iconColor: string;
  iconBgColor: string;
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
  icon: React.ReactNode;
  iconColor: string;
  iconBgColor: string;
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
  icon: React.ReactNode;
  iconColor: string;
  iconBgColor: string;
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

interface DraggableAppointment {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  title: string;
  content?: string;
  color: string;
}

// Available installation slots for the agenda
const availableSlots: AvailableSlot[] = [
  { 
    id: 1, 
    date: "2025-04-15", 
    times: ["08:00", "11:00", "14:00", "16:00"],
    timeSlots: [
      { id: "slot-1-1", time: "08:00", duration: 120, available: true, installerCount: 3 },
      { id: "slot-1-2", time: "11:00", duration: 120, available: true, installerCount: 1 },
      { id: "slot-1-3", time: "14:00", duration: 120, available: true, installerCount: 2 },
      { id: "slot-1-4", time: "16:00", duration: 120, available: true, installerCount: 3 }
    ]
  },
  { 
    id: 2, 
    date: "2025-04-16", 
    times: ["09:00", "13:00", "15:00"],
    timeSlots: [
      { id: "slot-2-1", time: "09:00", duration: 120, available: true, installerCount: 2 },
      { id: "slot-2-2", time: "13:00", duration: 120, available: true, installerCount: 4 },
      { id: "slot-2-3", time: "15:00", duration: 120, available: true, installerCount: 1 }
    ]
  },
  { 
    id: 3, 
    date: "2025-04-17", 
    times: ["08:30", "10:30", "14:30", "16:30"],
    timeSlots: [
      { id: "slot-3-1", time: "08:30", duration: 120, available: true, installerCount: 5 },
      { id: "slot-3-2", time: "10:30", duration: 120, available: true, installerCount: 3 },
      { id: "slot-3-3", time: "14:30", duration: 120, available: true, installerCount: 2 },
      { id: "slot-3-4", time: "16:30", duration: 120, available: true, installerCount: 1 }
    ]
  },
  { 
    id: 4, 
    date: "2025-04-18", 
    times: ["08:00", "12:00", "15:00"],
    timeSlots: [
      { id: "slot-4-1", time: "08:00", duration: 120, available: true, installerCount: 4 },
      { id: "slot-4-2", time: "12:00", duration: 120, available: true, installerCount: 3 },
      { id: "slot-4-3", time: "15:00", duration: 120, available: true, installerCount: 2 }
    ]
  },
  { 
    id: 5, 
    date: "2025-04-19", 
    times: ["10:00", "14:00"],
    timeSlots: [
      { id: "slot-5-1", time: "10:00", duration: 120, available: true, installerCount: 3 },
      { id: "slot-5-2", time: "14:00", duration: 120, available: true, installerCount: 2 }
    ]
  },
  { 
    id: 6, 
    date: "2025-04-22", 
    times: ["09:00", "13:30", "16:00"],
    timeSlots: [
      { id: "slot-6-1", time: "09:00", duration: 120, available: true, installerCount: 1 },
      { id: "slot-6-2", time: "13:30", duration: 120, available: true, installerCount: 3 },
      { id: "slot-6-3", time: "16:00", duration: 120, available: true, installerCount: 2 }
    ]
  },
  { 
    id: 7, 
    date: "2025-04-23", 
    times: ["08:00", "10:30", "14:00", "15:30"],
    timeSlots: [
      { id: "slot-7-1", time: "08:00", duration: 120, available: true, installerCount: 4 },
      { id: "slot-7-2", time: "10:30", duration: 120, available: true, installerCount: 2 },
      { id: "slot-7-3", time: "14:00", duration: 120, available: true, installerCount: 3 },
      { id: "slot-7-4", time: "15:30", duration: 120, available: true, installerCount: 1 }
    ]
  },
  { 
    id: 8, 
    date: "2025-04-24", 
    times: ["09:30", "13:00", "16:30"],
    timeSlots: [
      { id: "slot-8-1", time: "09:30", duration: 120, available: true, installerCount: 2 },
      { id: "slot-8-2", time: "13:00", duration: 120, available: true, installerCount: 5 },
      { id: "slot-8-3", time: "16:30", duration: 120, available: true, installerCount: 1 }
    ]
  },
  { 
    id: 9, 
    date: "2025-04-25", 
    times: ["08:30", "11:30", "14:30"],
    timeSlots: [
      { id: "slot-9-1", time: "08:30", duration: 120, available: true, installerCount: 3 },
      { id: "slot-9-2", time: "11:30", duration: 120, available: true, installerCount: 2 },
      { id: "slot-9-3", time: "14:30", duration: 120, available: true, installerCount: 1 }
    ]
  },
  { 
    id: 10, 
    date: "2025-04-26", 
    times: ["10:00", "14:00"],
    timeSlots: [
      { id: "slot-10-1", time: "10:00", duration: 120, available: true, installerCount: 4 },
      { id: "slot-10-2", time: "14:00", duration: 120, available: true, installerCount: 1 }
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
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-100",
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
    iconColor: "text-amber-600",
    iconBgColor: "bg-amber-100",
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
    iconColor: "text-sky-600",
    iconBgColor: "bg-sky-100",
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
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-100",
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
    iconColor: "text-green-600",
    iconBgColor: "bg-green-100",
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
    icon: <BoltSolidIcon className="h-full w-full" />,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-100",
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
    icon: <LightBulbIcon className="h-full w-full" />,
    iconColor: "text-cyan-600",
    iconBgColor: "bg-cyan-100",
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
    icon: <FireIcon className="h-full w-full" />,
    iconColor: "text-orange-600",
    iconBgColor: "bg-orange-100",
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
    icon: <Cog8ToothIcon className="h-full w-full" />,
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-100",
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
    icon: <WrenchScrewdriverIcon className="h-full w-full" />,
    iconColor: "text-gray-600",
    iconBgColor: "bg-gray-100",
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
    icon: <ShieldCheckIcon className="h-full w-full" />,
    iconColor: "text-indigo-600",
    iconBgColor: "bg-indigo-100",
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
    icon: <BuildingOfficeIcon className="h-full w-full" />,
    iconColor: "text-lime-600",
    iconBgColor: "bg-lime-100",
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
    icon: <DevicePhoneMobileIcon className="h-full w-full" />,
    iconColor: "text-sky-600",
    iconBgColor: "bg-sky-100",
    stock: 27,
    description: "Contrôle à distance via smartphone",
    compatibility: ["Pompe à chaleur EcoHeat Pro", "Chaudière condensation EcoBoiler"],
    required: false,
    warranty: 2
  }
];

// Define preset appointment slots for the advanced calendar
const presetAppointments: DraggableAppointment[] = [
  {
    id: "appt-1",
    startTime: "09:00",
    endTime: "11:00",
    duration: 120,
    title: "Installation PAC",
    content: "Installation complète avec test",
    color: "bg-blue-100 border-blue-300 text-blue-800"
  },
  {
    id: "appt-2",
    startTime: "13:00",
    endTime: "15:00",
    duration: 120,
    title: "Maintenance syst.",
    content: "Vérification annuelle",
    color: "bg-green-100 border-green-300 text-green-800"
  },
  {
    id: "appt-3",
    startTime: "15:30",
    endTime: "17:00",
    duration: 90,
    title: "Dépannage",
    content: "Intervention urgente",
    color: "bg-red-100 border-red-300 text-red-800"
  }
];

interface InstallationData {
  date: string;
  time: string;
  installer: Installer | undefined;
  product: Product;
  quantity: number;
  accessories: Accessory[];
  notes: string;
  total: number;
  address: string;
  status: string;
}

const hourMarkers = Array.from({ length: 11 }, (_, i) => {
  const hour = i + 8; // Start at 8 AM
  return `${hour}:00`;
});

interface EnhancedInstallationModalProps {
  // Optional props can be added here if needed
  initialStep?: number;
  onComplete?: (data: InstallationData) => void;
  clientAddress?: string;
}

// TimeSlot component for draggable appointments
const TimeSlotAppointment = ({ 
  appointment,
  isSelected,
  onSelect,
  onResize
}: { 
  appointment: DraggableAppointment, 
  isSelected: boolean,
  onSelect: () => void,
  onResize: (newDuration: number) => void
}) => {
  const dragControls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);
  const [, setIsResizing] = useState(false);
  const [currentHeight, setCurrentHeight] = useState<number>(appointment.duration);
  // const startRef = useRef<HTMLDivElement>(null);
  
  // Calculate position in the grid
  const startHour = parseInt(appointment.startTime.split(':')[0], 10);
  const startMinute = parseInt(appointment.startTime.split(':')[1], 10);
  const topPosition = (startHour - 8) * 60 + startMinute; // 8 AM is our 0 position
  
  return (
    <motion.div
      drag="y"
      dragControls={dragControls}
      dragConstraints={{ top: 0, bottom: 600 }}
      dragElastic={0.1}
      dragMomentum={false}
      whileDrag={{ zIndex: 10 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      style={{ 
        top: `${topPosition}px`,
        height: `${currentHeight}px`
      }}
      className={`absolute left-16 right-4 rounded-md px-2 py-1.5 border shadow-sm cursor-move
        ${appointment.color} ${isSelected ? 'ring-2 ring-offset-1 ring-blue-500' : ''} 
        ${isDragging ? 'opacity-70' : ''}
      `}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium text-sm">{appointment.title}</div>
          <div className="text-xs opacity-90">{appointment.startTime} - {appointment.endTime}</div>
        </div>
        {isSelected && (
          <div className="flex space-x-1">
            <button className="p-0.5 hover:bg-white/20 rounded">
              <PencilIcon className="h-3 w-3" />
            </button>
            <button className="p-0.5 hover:bg-white/20 rounded">
              <TrashIcon className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
      
      {/* Resize handle */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize flex items-center justify-center"
        onMouseDown={(e) => {
          e.stopPropagation();
          setIsResizing(true);
          
          const startY = e.clientY;
          const startHeight = currentHeight;
          
          const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaY = moveEvent.clientY - startY;
            const newHeight = Math.max(30, Math.min(240, startHeight + deltaY));
            setCurrentHeight(newHeight);
          };
          
          const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            
            // Call the resize callback with the new duration
            onResize(currentHeight);
          };
          
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}
      >
        <div className="h-1 w-10 bg-current opacity-30 rounded-full" />
      </div>
    </motion.div>
  );
};

// PencilIcon and TrashIcon components for appointment actions
const PencilIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

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
  const [calendarView, setCalendarView] = useState<"month" | "day" | "week" | "schedule">("schedule");
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<DraggableAppointment[]>(presetAppointments);
  
  // Installer state
  const [selectedInstaller, setSelectedInstaller] = useState<number | null>(null);
  const [installationNotes, setInstallationNotes] = useState<string>("");
  const [searchInstallerQuery, setSearchInstallerQuery] = useState<string>("");
  const [installerFilterSpecialty, setInstallerFilterSpecialty] = useState<string | null>(null);
  
  // Product state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showAccessories, setShowAccessories] = useState<boolean>(false);
  const [selectedAccessories, setSelectedAccessories] = useState<Accessory[]>([]);
  const [orderReserved, setOrderReserved] = useState<boolean>(false);
  const [productSearchQuery, setProductSearchQuery] = useState<string>("");
  const [productCategoryFilter, setProductCategoryFilter] = useState<string | null>(null);
  
  // UI state
  const [showInstallerDetails, setShowInstallerDetails] = useState<boolean>(false);
  const [ , setShowProductDetails] = useState<boolean>(false);
  const [ , setActiveDetailTab] = useState<string>("specs");
  
  // Advanced calendar state
  const [showMiniMonth, setShowMiniMonth] = useState<boolean>(true);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date(2025, 3, 14)); // April 14, 2025
  // const [draggedAppointment, setDraggedAppointment] = useState<DraggableAppointment | null>(null);
  
  // Cart totals
  const cartTotal = selectedProduct 
    ? selectedProduct.price * quantity + 
      selectedAccessories.reduce((sum, acc) => sum + acc.price, 0)
    : 0;
  
  // Filtered installers based on search and filters
  const filteredInstallers = installers
    .filter(installer => 
      installer.available && 
      (searchInstallerQuery === "" || 
       installer.name.toLowerCase().includes(searchInstallerQuery.toLowerCase()) ||
       installer.specialty.toLowerCase().includes(searchInstallerQuery.toLowerCase())) &&
      (installerFilterSpecialty === null || installer.specialty === installerFilterSpecialty)
    );
    
  // Filtered products based on search and filters
  const filteredProducts = products
    .filter(product => 
      (productSearchQuery === "" || 
       product.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
       product.category.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
       product.description?.toLowerCase().includes(productSearchQuery.toLowerCase())) &&
      (productCategoryFilter === null || product.category === productCategoryFilter)
    );
    
  // Get available specialties for filtering
  const availableSpecialties = Array.from(new Set(installers.map(installer => installer.specialty)));
  
  // Get available product categories for filtering
  const availableCategories = Array.from(new Set(products.map(product => product.category)));
  
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
    setCalendarView("schedule");
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
  
  // Handle appointment resize
  const handleAppointmentResize = (appointmentId: string, newDuration: number): void => {
    setAppointments(appointments.map(appointment => {
      if (appointment.id === appointmentId) {
        const startHour = parseInt(appointment.startTime.split(':')[0], 10);
        const startMinute = parseInt(appointment.startTime.split(':')[1], 10);
        
        // Calculate new end time based on duration
        const durationHours = Math.floor(newDuration / 60);
        const durationMinutes = newDuration % 60;
        
        let endHour = startHour + durationHours;
        let endMinute = startMinute + durationMinutes;
        
        if (endMinute >= 60) {
          endHour += 1;
          endMinute -= 60;
        }
        
        const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
        
        return {
          ...appointment,
          duration: newDuration,
          endTime
        };
      }
      return appointment;
    }));
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
  // const generateWeekView = (): CalendarDay[] => {
  //   if (!selectedDate) return [];
    
  //   const selectedDateObj = new Date(selectedDate);
  //   const dayOfWeek = selectedDateObj.getDay();
  //   const sunday = new Date(selectedDateObj);
  //   sunday.setDate(selectedDateObj.getDate() - dayOfWeek);
    
  //   const weekDays: CalendarDay[] = [];
  //   for (let i = 0; i < 7; i++) {
  //     const date = new Date(sunday);
  //     date.setDate(sunday.getDate() + i);
  //     const dateString = date.toISOString().split('T')[0];
      
  //     weekDays.push({
  //       date,
  //       dateString,
  //       isCurrentMonth: date.getMonth() === currentMonth.getMonth(),
  //       hasSlots: hasAvailableSlots(dateString)
  //     });
  //   }
    
  //   return weekDays;
  // };
  
  // Get time slots for a specific date with detailed information
  const getTimeSlots = (dateString: string): TimeSlot[] => {
    const slot = availableSlots.find(slot => slot.date === dateString);
    return slot?.timeSlots || [];
  };
  
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
  
  // Navigate to previous week
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };
  
  // Navigate to next week
  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };
  
  // Generate days for the week view
  const generateWeekDays = (): Date[] => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStart);
      day.setDate(currentWeekStart.getDate() + i);
      days.push(day);
    }
    return days;
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
          className="relative inline-block w-full max-w-6xl transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all sm:align-middle"
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
            {/* Step 1: Enhanced Google-like Calendar/Agenda */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Sélectionnez une date et un horaire</h4>
                  <p className="mt-1 text-sm text-gray-500">Consultez le calendrier et planifiez l&apos;installation en fonction des disponibilités</p>
                </div>
                
                {/* Top-tier Calendar view, Google Calendar-like */}
                <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Calendar Toolbar */}
                  <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setCalendarView("schedule")}
                        className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
                          calendarView === "schedule" 
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <CalendarIcon className="w-4 h-4 mr-1.5" />
                        Planning
                      </button>
                      <button 
                        onClick={() => setCalendarView("month")}
                        className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
                          calendarView === "month" 
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <CalendarDaysIcon className="w-4 h-4 mr-1.5" />
                        Mois
                      </button>
                      <button 
                        onClick={() => setCalendarView("week")}
                        className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
                          calendarView === "week" 
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <AdjustmentsHorizontalIcon className="w-4 h-4 mr-1.5" />
                        Semaine
                      </button>
                      <button 
                        onClick={() => setCalendarView("day")}
                        className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
                          calendarView === "day" 
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <ClockIcon className="w-4 h-4 mr-1.5" />
                        Jour
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={calendarView === "month" ? goToPreviousMonth : goToPreviousWeek}
                        className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100"
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>
                      
                      <div className="text-sm font-medium text-gray-900">
                        {calendarView === "month" ? formatMonth(currentMonth) : 
                          calendarView === "week" || calendarView === "schedule" ? 
                          `${new Date(currentWeekStart).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} - ${
                            new Date(new Date(currentWeekStart).setDate(currentWeekStart.getDate() + 6))
                            .toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
                          }` : 
                          selectedDate ? 
                          new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) :
                          "Sélectionnez une date"
                        }
                      </div>
                      
                      <button 
                        onClick={calendarView === "month" ? goToNextMonth : goToNextWeek}
                        className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                      
                      {/* Additional actions */}
                      <div className="flex items-center pl-2 space-x-1.5 ml-2 border-l border-gray-200">
                        <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100">
                          <MagnifyingGlassIcon className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100">
                          <FunnelIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setShowMiniMonth(!showMiniMonth)}
                          className={`p-1.5 rounded-md ${showMiniMonth ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:bg-gray-100"}`}
                        >
                          <ArrowsPointingOutIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Calendar body - Google Calendar inspired Schedule view */}
                  {calendarView === "schedule" && (
                    <div className="flex">
                      {/* Side mini month calendar when enabled */}
                      {showMiniMonth && (
                        <div className="w-64 p-3 border-r border-gray-200 bg-gray-50">
                          {/* Mini month view */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-gray-500 uppercase">
                                {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                              </span>
                              <div className="flex space-x-1">
                                <button 
                                  onClick={goToPreviousMonth}
                                  className="p-1 rounded-full text-gray-500 hover:bg-gray-200"
                                >
                                  <ChevronLeftIcon className="h-3 w-3" />
                                </button>
                                <button 
                                  onClick={goToNextMonth}
                                  className="p-1 rounded-full text-gray-500 hover:bg-gray-200"
                                >
                                  <ChevronRightIcon className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                            
                            {/* Mini calendar days */}
                            <div className="grid grid-cols-7 gap-1 text-center">
                              {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => (
                                <div key={`day-label-${i}`} className="text-xs text-gray-500 font-medium py-1">
                                  {day}
                                </div>
                              ))}
                              
                              {generateCalendarDays().map((day, index) => {
                                const isSelected = selectedDate === day.dateString;
                                const isToday = new Date().toDateString() === day.date.toDateString();
                                
                                return (
                                  <button
                                    key={`mini-day-${index}`}
                                    onClick={() => {
                                      if (day.hasSlots) {
                                        setSelectedDate(day.dateString);
                                        // Update the currentWeekStart to contain this date
                                        const newWeekStart = new Date(day.date);
                                        const dayOfWeek = newWeekStart.getDay(); // 0 = Sunday, 1 = Monday, ...
                                        newWeekStart.setDate(newWeekStart.getDate() - dayOfWeek);
                                        setCurrentWeekStart(newWeekStart);
                                      }
                                    }}
                                    disabled={!day.hasSlots && day.isCurrentMonth}
                                    className={`h-6 w-6 flex items-center justify-center text-xs rounded-full 
                                      ${!day.isCurrentMonth ? "text-gray-400" : 
                                        isSelected ? "bg-blue-600 text-white" : 
                                        isToday ? "bg-blue-100 text-blue-800" : 
                                        day.hasSlots ? "hover:bg-blue-50 text-gray-800" : 
                                        "text-gray-800"}`}
                                  >
                                    {day.date.getDate()}
                                    {day.hasSlots && !isSelected && (
                                      <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-green-500"></span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          
                          {/* Available appointment types */}
                          <div>
                            <h6 className="text-xs font-medium text-gray-500 uppercase mb-2">Types de Rendez-vous</h6>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm p-2 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                <span>Installation (2h)</span>
                              </div>
                              <div className="flex items-center text-sm p-2 rounded-md hover:bg-gray-100">
                                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                <span>Maintenance (2h)</span>
                              </div>
                              <div className="flex items-center text-sm p-2 rounded-md hover:bg-gray-100">
                                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                <span>Dépannage (1h30)</span>
                              </div>
                              <div className="flex items-center text-sm p-2 rounded-md hover:bg-gray-100">
                                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                                <span>Consultation (1h)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Weekly schedule view */}
                      <div className="flex-1 overflow-auto">
                        {/* Week days header */}
                        <div className="flex border-b border-gray-200 bg-gray-50">
                          <div className="w-16 flex-shrink-0 border-r border-gray-200 py-2"></div>
                          {generateWeekDays().map((date, idx) => {
                            const dateString = date.toISOString().split('T')[0];
                            const isToday = new Date().toDateString() === date.toDateString();
                            const isSelectedDay = selectedDate === dateString;
                            
                            return (
                              <div 
                                key={`weekday-${idx}`} 
                                className={`flex-1 text-center p-2 min-w-[100px] ${isToday ? "bg-blue-50" : ""}`}
                                onClick={() => setSelectedDate(dateString)}
                              >
                                <div className={`text-sm font-medium ${isToday ? "text-blue-700" : "text-gray-700"}`}>
                                  {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                                </div>
                                <div className={`flex items-center justify-center h-7 w-7 mx-auto ${
                                  isSelectedDay 
                                    ? "bg-blue-600 text-white rounded-full" 
                                    : isToday 
                                    ? "bg-blue-100 text-blue-800 rounded-full" 
                                    : ""
                                }`}>
                                  {date.getDate()}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Time grid */}
                        <div className="relative">
                          {/* Time markers */}
                          <div className="flex">
                            <div className="w-16 flex-shrink-0 border-r border-gray-200">
                              {hourMarkers.map((hour, idx) => (
                                <div 
                                  key={`hour-${idx}`} 
                                  className="h-20 flex items-center justify-center text-xs text-gray-500"
                                  style={{ height: "60px" }}
                                >
                                  {hour}
                                </div>
                              ))}
                            </div>
                            
                            {/* Day columns with grid lines */}
                            <div className="flex-1 flex">
                              {generateWeekDays().map((date, dayIdx) => {
                                const dateString = date.toISOString().split('T')[0];
                                const isToday = new Date().toDateString() === date.toDateString();
                                
                                return (
                                  <div 
                                    key={`day-col-${dayIdx}`}
                                    className={`flex-1 border-r border-gray-100 relative min-w-[100px] ${isToday ? "bg-blue-50/30" : ""}`}
                                  >
                                    {/* Horizontal time grid lines */}
                                    {hourMarkers.map((_, idx) => (
                                      <div 
                                        key={`grid-${dayIdx}-${idx}`}
                                        className="h-[60px] border-b border-gray-100"
                                      ></div>
                                    ))}
                                    
                                    {/* Time slots */}
                                    {getTimeSlots(dateString).map((slot, slotIdx) => {
                                      const isSelected = selectedDate === dateString && selectedTime === slot.time;
                                      const startHour = parseInt(slot.time.split(':')[0], 10);
                                      const startMinute = parseInt(slot.time.split(':')[1], 10);
                                      const topPosition = (startHour - 8) * 60 + startMinute; // 8AM is our start
                                      
                                      return (
                                        <motion.div
                                          key={`slot-${dayIdx}-${slotIdx}`}
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                          onClick={() => {
                                            setSelectedDate(dateString);
                                            setSelectedTime(slot.time);
                                            setSelectedTimeSlot(slot);
                                          }}
                                          style={{ top: `${topPosition}px`, height: `${slot.duration}px` }}
                                          className={`absolute left-1 right-1 rounded-md border shadow-sm px-2 py-1.5 cursor-pointer ${
                                            isSelected 
                                              ? "bg-blue-100 border-blue-300 text-blue-800 z-10 ring-2 ring-blue-500/50"
                                              : "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                          }`}
                                        >
                                          <div className="flex justify-between items-start">
                                            <div>
                                              <div className="font-medium text-sm">Installation</div>
                                              <div className="text-xs">{slot.time} - {
                                                (() => {
                                                  const [hours, minutes] = slot.time.split(':').map(Number);
                                                  const endTime = new Date(2025, 0, 1, hours, minutes);
                                                  endTime.setMinutes(endTime.getMinutes() + slot.duration);
                                                  return endTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                                                })()
                                              }</div>
                                            </div>
                                            <div className="text-xs bg-white/60 px-1.5 py-0.5 rounded-full">
                                              {slot.installerCount} installateurs
                                            </div>
                                          </div>
                                          {isSelected && (
                                            <motion.div 
                                              initial={{ opacity: 0 }}
                                              animate={{ opacity: 1 }}
                                              className="absolute bottom-0 left-0 right-0 h-6 bg-blue-500/10 flex items-center justify-center rounded-b-md"
                                            >
                                              <CheckIcon className="h-3.5 w-3.5 text-blue-700" />
                                              <span className="text-xs font-medium text-blue-700 ml-1">Sélectionné</span>
                                            </motion.div>
                                          )}
                                        </motion.div>
                                      );
                                    })}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Month view calendar - grid view */}
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
                              className={`relative h-24 rounded-lg border p-1 text-center transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                !day.isCurrentMonth
                                  ? "border-transparent bg-white text-gray-300"
                                  : isSelected
                                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md ring-1 ring-blue-500/30"
                                  : isToday && day.hasSlots
                                  ? "cursor-pointer border-blue-300 bg-blue-50/30 text-blue-700 shadow-sm"
                                  : day.hasSlots
                                  ? "cursor-pointer border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm"
                                  : "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400"
                              }`}
                            >
                              <div className="flex flex-col h-full">
                                {/* Date header */}
                                <div className="flex justify-between items-center mb-1">
                                  {/* Date with special indicator for today */}
                                  {isToday ? (
                                    <div className={`flex items-center justify-center h-6 w-6 rounded-full ${
                                      isSelected 
                                        ? "bg-blue-500 text-white"
                                        : "bg-blue-500 text-white"
                                    }`}>
                                      <span className="text-xs font-bold">{day.date.getDate()}</span>
                                    </div>
                                  ) : (
                                    <span className={`text-sm ${isSelected ? "font-medium" : ""} px-1`}>
                                      {day.date.getDate()}
                                    </span>
                                  )}
                                  
                                  {/* Slot count indicator */}
                                  {day.isCurrentMonth && day.hasSlots && (
                                    <span className={`text-xs rounded-full px-1.5 ${
                                      isSelected
                                        ? "bg-blue-200 text-blue-800"
                                        : "bg-green-100 text-green-700"
                                    }`}>
                                      {slotCount}
                                    </span>
                                  )}
                                </div>
                                
                                {/* Time slot indicators */}
                                {day.isCurrentMonth && day.hasSlots && (
                                  <div className="flex flex-col space-y-1 mt-1 text-left">
                                    {availableSlots
                                      .find(slot => slot.date === day.dateString)
                                      ?.times.slice(0, 2).map((time, idx) => (
                                        <div 
                                          key={`time-${idx}`} 
                                          className={`text-xs px-1.5 py-0.5 rounded truncate ${
                                            isSelected
                                              ? "bg-blue-100 text-blue-800"
                                              : "bg-gray-100 text-gray-700"
                                          }`}
                                        >
                                          {time} - Installation
                                        </div>
                                      ))
                                    }
                                    {(availableSlots.find(slot => slot.date === day.dateString)?.times.length || 0) > 2 && (
                                      <div className="text-xs text-gray-500 pl-1.5">
                                        +{(availableSlots.find(slot => slot.date === day.dateString)?.times.length || 0) - 2} autres
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              {/* Enhanced hover effect */}
                              {day.isCurrentMonth && day.hasSlots && !isSelected && (
                                <div className="absolute inset-0 rounded-lg border-2 border-blue-500/70 opacity-0 hover:opacity-100 transition-opacity" />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Week view */}
                  {calendarView === "week" && (
                    <div className="bg-white">
                      {/* Week header */}
                      <div className="flex border-b border-gray-200">
                        <div className="w-16 flex-shrink-0 p-3 border-r border-gray-200"></div>
                        {generateWeekDays().map((date, idx) => {
                          const dateString = date.toISOString().split('T')[0];
                          const isToday = new Date().toDateString() === date.toDateString();
                          const isSelected = selectedDate === dateString;
                          
                          return (
                            <div 
                              key={`week-header-${idx}`}
                              className={`flex-1 p-3 text-center ${isToday ? "bg-blue-50" : ""}`}
                            >
                              <div className="text-xs font-medium text-gray-500 uppercase">
                                {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                              </div>
                              <div className={`inline-flex items-center justify-center h-7 w-7 mt-1 ${
                                isSelected
                                  ? "bg-blue-600 text-white rounded-full"
                                  : isToday
                                  ? "bg-blue-100 text-blue-800 rounded-full"
                                  : ""
                              }`}>
                                {date.getDate()}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Week Time Grid */}
                      <div className="flex">
                        {/* Time column */}
                        <div className="w-16 flex-shrink-0 border-r border-gray-200">
                          {[...Array(13)].map((_, idx) => {
                            const hour = 8 + idx;
                            return (
                              <div 
                                key={`time-marker-${idx}`}
                                className="h-20 flex items-center justify-center text-xs text-gray-500 border-b border-gray-100"
                              >
                                {hour}:00
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Day columns */}
                        <div className="flex flex-1">
                          {generateWeekDays().map((date, dayIdx) => {
                            const dateString = date.toISOString().split('T')[0];
                            const isToday = new Date().toDateString() === date.toDateString();
                            
                            return (
                              <div
                                key={`week-col-${dayIdx}`}
                                className={`flex-1 relative border-r border-gray-100 ${isToday ? "bg-blue-50/20" : ""}`}
                              >
                                {/* Hour grid */}
                                {[...Array(13)].map((_, hourIdx) => (
                                  <div
                                    key={`grid-${dayIdx}-${hourIdx}`}
                                    className="h-20 border-b border-gray-100"
                                  ></div>
                                ))}
                                
                                {/* Appointment slots for this day */}
                                {getTimeSlots(dateString).map((slot, slotIdx) => {
                                  const isSelected = selectedDate === dateString && selectedTime === slot.time;
                                  const hour = parseInt(slot.time.split(':')[0], 10);
                                  const minute = parseInt(slot.time.split(':')[1], 10);
                                  const topPosition = (hour - 8) * 80 + (minute / 60) * 80;
                                  const heightPosition = (slot.duration / 60) * 80;
                                  
                                  return (
                                    <motion.div
                                      key={`week-slot-${dayIdx}-${slotIdx}`}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => {
                                        setSelectedDate(dateString);
                                        setSelectedTime(slot.time);
                                        setSelectedTimeSlot(slot);
                                      }}
                                      style={{ 
                                        top: `${topPosition}px`, 
                                        height: `${heightPosition}px`
                                      }}
                                      className={`absolute left-0.5 right-0.5 px-2 py-1 rounded shadow-sm border ${
                                        isSelected 
                                          ? "bg-blue-100 border-blue-300 text-blue-800 z-20"
                                          : "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                      }`}
                                    >
                                      <div className="text-xs font-medium truncate">
                                        Installation
                                      </div>
                                      <div className="text-xs opacity-70 truncate">
                                        {slot.time}
                                      </div>
                                      {isSelected && (
                                        <div className="absolute bottom-0 left-0 right-0 h-4 bg-blue-200/40 flex items-center justify-center">
                                          <span className="text-[10px] font-medium text-blue-700">Sélectionné</span>
                                        </div>
                                      )}
                                    </motion.div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Day view calendar - Enhanced with timeline */}
                  {calendarView === "day" && selectedDate && (
                    <div className="bg-white">
                      {/* Day header */}
                      <div className="flex border-b border-gray-200 bg-gray-50 p-3 items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-2">
                            <CalendarIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <h6 className="text-sm font-medium text-gray-800 capitalize">
                              {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </h6>
                            <div className="text-xs text-gray-500">
                              {getTimeSlots(selectedDate).length} créneaux disponibles
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => {
                              const currentDate = new Date(selectedDate);
                              currentDate.setDate(currentDate.getDate() - 1);
                              setSelectedDate(currentDate.toISOString().split('T')[0]);
                            }}
                            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200"
                          >
                            <ChevronLeftIcon className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => {
                              const currentDate = new Date(selectedDate);
                              currentDate.setDate(currentDate.getDate() + 1);
                              setSelectedDate(currentDate.toISOString().split('T')[0]);
                            }}
                            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200"
                          >
                            <ChevronRightIcon className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => setCalendarView("schedule")}
                            className="p-1.5 rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100"
                          >
                            <ArrowsPointingOutIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Advanced time grid with draggable appointments */}
                      <div className="relative h-[600px] overflow-y-auto">
                        {/* Hour markers */}
                        <div className="flex">
                          <div className="w-16 flex-shrink-0 border-r border-gray-200 bg-gray-50">
                            {hourMarkers.map((hour, idx) => (
                              <div 
                                key={`day-hour-${idx}`}
                                className="h-[60px] flex items-center justify-center text-xs text-gray-500 border-b border-gray-200"
                              >
                                {hour}
                              </div>
                            ))}
                          </div>
                          
                          {/* Appointment grid */}
                          <div className="flex-1 relative">
                            {/* Hour grid lines */}
                            {hourMarkers.map((_, idx) => (
                              <div 
                                key={`day-grid-${idx}`}
                                className="h-[60px] border-b border-gray-100"
                              ></div>
                            ))}
                            
                            {/* Current time indicator */}
                            <div 
                              className="absolute left-0 right-0 h-0.5 bg-red-500 z-10"
                              style={{ top: "180px" }} // 3 hours from 8AM = 11AM
                            >
                              <div className="absolute -left-1 -top-1.5 h-3 w-3 rounded-full bg-red-500"></div>
                            </div>
                            
                            {/* Draggable appointment examples */}
                            {appointments.map((appointment) => (
                              <TimeSlotAppointment 
                                key={appointment.id}
                                appointment={appointment}
                                isSelected={selectedAppointment === appointment.id}
                                onSelect={() => setSelectedAppointment(appointment.id)}
                                onResize={(newDuration) => handleAppointmentResize(appointment.id, newDuration)}
                              />
                            ))}
                            
                            {/* Add appointment button */}
                            <button
                              className="absolute right-4 bottom-4 h-12 w-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                            >
                              <PlusIcon className="h-6 w-6" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Selected time summary */}
                  {selectedDate && selectedTime && (
                    <div className="border-t border-gray-100 bg-gray-50 p-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                          <CheckIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Créneau sélectionné
                          </span>
                          <p className="font-medium text-gray-800">
                            {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {selectedTime}
                          </p>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedDate(null);
                            setSelectedTime(null);
                            setSelectedTimeSlot(null);
                          }}
                          className="px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                        >
                          Changer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Scheduling help */}
                <div className="flex items-start p-4 rounded-lg bg-blue-50 text-blue-800">
                  <svg className="h-5 w-5 flex-shrink-0 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Planning et organisation</p>
                    <p>Le calendrier vous permet de sélectionner un créneau disponible, de visualiser les rendez-vous existants, et d&apos;organiser les installations. Vous pouvez également faire glisser les rendez-vous pour les déplacer ou les redimensionner selon vos besoins.</p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Step 2: Enhanced Installer Selection */}
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
                
                {/* Search and filter bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={searchInstallerQuery}
                      onChange={(e) => setSearchInstallerQuery(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Rechercher un installateur..."
                    />
                  </div>
                  
                  <div className="sm:w-56">
                    <select
                      value={installerFilterSpecialty || ""}
                      onChange={(e) => setInstallerFilterSpecialty(e.target.value || null)}
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Toutes les spécialités</option>
                      {availableSpecialties.map((specialty, index) => (
                        <option key={index} value={specialty}>{specialty}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Installer count */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {filteredInstallers.length} installateur{filteredInstallers.length > 1 ? 's' : ''} disponible{filteredInstallers.length > 1 ? 's' : ''}
                  </span>
                  
                  {/* View toggle - list/grid */}
                  <div className="flex bg-gray-100 p-0.5 rounded-lg">
                    <button className="p-1.5 rounded-md bg-white shadow-sm text-gray-700">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                    <button className="p-1.5 rounded-md text-gray-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Enhanced installer cards with icons instead of images */}
                {filteredInstallers.length > 0 ? (
                  <div className="space-y-3">
                    {filteredInstallers.map(installer => (
                      <motion.div
                        key={installer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                          setSelectedInstaller(installer.id);
                          setShowInstallerDetails(false);
                        }}
                        className={`flex w-full items-center rounded-xl border p-4 transition-all cursor-pointer hover:shadow-md ${
                          selectedInstaller === installer.id
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/30"
                        }`}
                      >
                        {/* Installer icon */}
                        <div className={`relative mr-4 h-16 w-16 flex-shrink-0 rounded-full overflow-hidden ${
                          selectedInstaller === installer.id ? "ring-2 ring-blue-500" : ""
                        }`}>
                          <div className={`h-full w-full flex items-center justify-center ${installer.iconBgColor}`}>
                            <UserIcon className={`h-8 w-8 ${installer.iconColor}`} />
                          </div>
                          {installer.verified && (
                            <div className="absolute -right-1 -bottom-1 h-5 w-5 rounded-full bg-green-100 p-0.5 ring-2 ring-white">
                              <ShieldCheckIcon className="h-full w-full text-green-600" />
                            </div>
                          )}
                        </div>
                        
                        {/* Installer details */}
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <h5 className={`text-base font-medium ${
                                selectedInstaller === installer.id ? "text-blue-700" : "text-gray-900"
                              }`}>
                                {installer.name}
                              </h5>
                              <div className="ml-2 flex items-center">
                                <StarIcon className="h-4 w-4 text-amber-400 fill-current" />
                                <span className="ml-1 text-xs font-medium text-gray-600">{installer.rating}</span>
                              </div>
                            </div>
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedInstaller(installer.id);
                                setShowInstallerDetails(!showInstallerDetails);
                              }} 
                              className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                            >
                              Détails
                            </button>
                          </div>
                          
                          <div className="mt-1 flex flex-wrap items-center gap-y-1 gap-x-3">
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                              {installer.specialty}
                            </span>
                            
                            <span className="flex items-center text-xs text-gray-500">
                              <svg className="mr-1 h-3.5 w-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              {installer.installations} installations
                            </span>
                            
                            <span className="flex items-center text-xs text-gray-500">
                              <svg className="mr-1 h-3.5 w-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              {installer.experience} ans d&apos;exp.
                            </span>
                          </div>
                          
                          <div className="mt-2 flex items-center">
                            <span className="inline-flex items-center text-xs font-medium text-green-600">
                              <CheckCircleIcon className="mr-1 h-3.5 w-3.5" />
                              Disponible le {selectedDate ? new Date(selectedDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) : 'jour sélectionné'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Selection indicator */}
                        {selectedInstaller === installer.id && (
                          <div className="ml-2 rounded-full bg-blue-100 p-1.5 text-blue-600">
                            <CheckIcon className="h-5 w-5" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun installateur trouvé</h3>
                    <p className="mt-1 text-sm text-gray-500">Essayez de modifier vos critères de recherche.</p>
                    <div className="mt-3">
                      <button
                        onClick={() => {
                          setSearchInstallerQuery("");
                          setInstallerFilterSpecialty(null);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                      >
                        Réinitialiser les filtres
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Installer detail modal */}
                {showInstallerDetails && selectedInstaller && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
                      <div className="flex justify-between items-center">
                        <h5 className="text-lg font-medium">Profil de l&apos;installateur</h5>
                        <button 
                          onClick={() => setShowInstallerDetails(false)} 
                          className="rounded-full bg-white/20 p-1 hover:bg-white/30 transition-colors"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    {(() => {
                      const installer = installers.find(i => i.id === selectedInstaller);
                      if (!installer) return null;
                      
                      return (
                        <div className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center">
                            <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                              <div className={`relative h-20 w-20 rounded-full overflow-hidden border-4 border-white ring-1 ring-gray-200 flex items-center justify-center ${installer.iconBgColor}`}>
                                <UserIcon className={`h-10 w-10 ${installer.iconColor}`} />
                                {installer.verified && (
                                  <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-green-100 p-1 ring-2 ring-white">
                                    <ShieldCheckIcon className="h-full w-full text-green-600" />
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-gray-900">{installer.name}</h4>
                              <div className="mt-1 flex items-center">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon 
                                      key={i} 
                                      className={`h-4 w-4 ${
                                        i < Math.floor(installer.rating) 
                                          ? "text-amber-400 fill-current" 
                                          : i < installer.rating
                                          ? "text-amber-400 fill-current" // For partial stars, you might want a different icon
                                          : "text-gray-300"
                                      }`} 
                                    />
                                  ))}
                                  <span className="ml-2 text-sm text-gray-600">{installer.rating} sur 5</span>
                                </div>
                                <span className="mx-2 text-gray-300">•</span>
                                <span className="text-sm text-gray-600">{installer.installations} installations</span>
                              </div>
                              
                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                  {installer.specialty}
                                </span>
                                {installer.verified && (
                                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                    <ShieldCheckIcon className="mr-1 h-3 w-3" />
                                    Vérifié
                                  </span>
                                )}
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                  <ClockIcon className="mr-1 h-3 w-3" />
                                  Répond en {installer.responseTime}h
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
                            <div>
                              <h6 className="text-sm font-medium text-gray-700">Certifications</h6>
                              <div className="mt-2 space-y-1">
                                {installer.certifications?.map((cert, i) => (
                                  <div key={i} className="flex items-center text-sm">
                                    <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                                    <span>{cert}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h6 className="text-sm font-medium text-gray-700">Expérience</h6>
                              <div className="mt-2">
                                <p className="text-sm text-gray-600">{installer.experience} ans d&apos;expérience</p>
                                <p className="text-sm text-gray-600 mt-1">{installer.installations} installations réalisées</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 flex justify-end">
                            <button
                              onClick={() => setShowInstallerDetails(false)}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                              Fermer
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
                
                {/* Installation notes - Enhanced */}
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h5 className="text-sm font-medium text-gray-700 flex items-center">
                      <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Notes d&apos;installation
                    </h5>
                  </div>
                  <div className="p-4">
                    <textarea
                      value={installationNotes}
                      onChange={(e) => setInstallationNotes(e.target.value)}
                      placeholder="Ajoutez des instructions spécifiques pour l'installateur..."
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows={3}
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Ces notes seront communiquées à l&apos;installateur avec les détails de l&apos;intervention.
                    </p>
                  </div>
                </div>
                
                {/* Selected installer summary - Enhanced */}
                {selectedInstaller && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-blue-50 p-4 border border-blue-200"
                  >
                    <div className="flex items-start">
                      <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <CheckIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h6 className="text-sm font-medium text-blue-800">
                          Installateur sélectionné: {installers.find(i => i.id === selectedInstaller)?.name}
                        </h6>
                        <p className="mt-1 text-xs text-blue-700">
                          L&apos;installateur sera notifié après confirmation de cette intervention.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
            
            {/* Step 3: Product Selection (NEW) with icons instead of images */}
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
                
                {/* Product search and filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Rechercher un produit..."
                    />
                  </div>
                  
                  <div className="sm:w-56">
                    <select
                      value={productCategoryFilter || ""}
                      onChange={(e) => setProductCategoryFilter(e.target.value || null)}
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Toutes les catégories</option>
                      {availableCategories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Product selection cards with icons */}
                <div className="space-y-4">
                  {filteredProducts.map(product => (
                    <motion.div
                      key={product.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedProduct(product)}
                      className={`relative flex w-full rounded-xl border transition-all cursor-pointer ${
                        selectedProduct?.id === product.id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-sm"
                      }`}
                    >
                      {/* Selected indicator */}
                      {selectedProduct?.id === product.id && (
                        <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-blue-500 shadow-sm flex items-center justify-center ring-2 ring-white">
                          <CheckIcon className="h-4 w-4 text-white" />
                        </div>
                      )}
                      
                      {/* Product icon */}
                      <div className="p-4 flex-shrink-0">
                        <div className={`h-16 w-16 rounded-lg ${product.iconBgColor} p-3 flex items-center justify-center`}>
                          {product.icon}
                        </div>
                      </div>
                      
                      {/* Product details */}
                      <div className="flex-1 p-4 pl-0">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className={`text-base font-medium ${
                            selectedProduct?.id === product.id ? "text-blue-700" : "text-gray-900"
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
                          {product.description || `Catégorie: ${product.category}`}
                        </p>
                        
                        {/* Product specs */}
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
                          <span className="inline-flex items-center text-xs text-gray-500">
                            <BoltSolidIcon className="h-3 w-3 mr-1 text-blue-500" />
                            Classe énergétique: {product.energy}
                          </span>
                          <span className="inline-flex items-center text-xs text-gray-500">
                            <LightBulbIcon className="h-3 w-3 mr-1 text-amber-500" />
                            Puissance: {product.power}
                          </span>
                          <span className="inline-flex items-center text-xs text-gray-500">
                            <CubeIcon className="h-3 w-3 mr-1 text-purple-500" />
                            Dimensions: {product.dimensions}
                          </span>
                        </div>
                      </div>
                      
                      {/* Price and rating */}
                      <div className="border-l border-gray-200 p-4 flex flex-col justify-between items-end">
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-amber-400 fill-current" />
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
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/30"
                                }`}
                              >
                                <div className={`h-12 w-12 flex-shrink-0 rounded-lg ${accessory.iconBgColor} p-2 mr-3 flex items-center justify-center`}>
                                  {accessory.icon}
                                </div>
                                <div className="flex-1">
                                  <h6 className={`text-sm font-medium ${
                                    selectedAccessories.find(a => a.id === accessory.id)
                                      ? "text-blue-700"
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
                                    ? "bg-blue-500 text-white"
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
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4">
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
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4">
                        <UserGroupIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h6 className="text-sm font-medium text-gray-700">Installateur</h6>
                        <div className="flex items-center mt-1">
                          {selectedInstaller && (() => {
                            const installer = installers.find(i => i.id === selectedInstaller);
                            if (!installer) return null;
                            
                            return (
                              <div className="flex items-center">
                                <div className={`h-8 w-8 rounded-full ${installer.iconBgColor} mr-2 flex items-center justify-center`}>
                                  <UserIcon className={`h-4 w-4 ${installer.iconColor}`} />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-900">{installer.name}</p>
                                  <p className="text-xs text-gray-500">{installer.specialty}</p>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Products */}
                    <div className="flex p-4 sm:p-6">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4">
                        <ShoppingBagIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h6 className="text-sm font-medium text-gray-700">Produits commandés</h6>
                        
                        {/* Main product */}
                        {selectedProduct && (
                          <div className="mt-2 rounded-lg border border-gray-200 p-3">
                            <div className="flex">
                              <div className={`h-14 w-14 rounded-md ${selectedProduct.iconBgColor} p-2 flex items-center justify-center mr-3 flex-shrink-0`}>
                                {selectedProduct.icon}
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
                                  <div className={`h-8 w-8 rounded-md ${accessory.iconBgColor} flex items-center justify-center mr-2 flex-shrink-0`}>
                                    {accessory.icon}
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
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4">
                        <MapPinIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h6 className="text-sm font-medium text-gray-700">Adresse d&apos;installation</h6>
                        <p className="text-sm text-gray-900 mt-1">{clientAddress}</p>
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
                className="mt-3 inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
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
                className={`inline-flex w-full items-center justify-center rounded-lg px-6 py-3 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto ${
                  (currentStep === 1 && (!selectedDate || !selectedTime)) ||
                  (currentStep === 2 && !selectedInstaller) ||
                  (currentStep === 3 && !selectedProduct) ||
                  isSubmitting
                    ? "cursor-not-allowed bg-blue-400"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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