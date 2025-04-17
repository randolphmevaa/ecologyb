import { useState, ReactNode, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { IoDocumentOutline } from "react-icons/io5";
import {
  XMarkIcon,
  // ChevronLeftIcon,
  // ChevronRightIcon,
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
  CubeIcon,
  UserIcon,
  ClockIcon,
  // DevicePhoneMobileIcon,
  BuildingOfficeIcon,
  // ArrowsPointingOutIcon,
  PlusIcon,
  // FunnelIcon,
  MagnifyingGlassIcon,
  // AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";
import {  
  DocumentTextIcon, TagIcon, InformationCircleIcon,
  // ExclamationTriangleIcon, ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { 
  ShieldCheckIcon, 
  CheckCircleIcon,
  // TruckIcon,
  // FireIcon,
  // LightBulbIcon,
  // BoltIcon as BoltSolidIcon,
  // CalendarDaysIcon,
  // Cog8ToothIcon,
} from "@heroicons/react/24/solid";
import EnhancedCalendar from "./EnhancedCalendar";
import { Dialog } from "@headlessui/react";
import React from "react";

// TypeScript interfaces for component props
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

// Make sure the Modal component is properly using the onClose prop:
const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
        onClick={(e) => {
          // Only close if clicking the backdrop, not the modal content
          if (e.target === e.currentTarget) {
            onClose?.();
          }
        }}
      >
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
  duration: number;
  available: boolean;
  installerCount?: number;
}

// interface AvailableSlot {
//   id: number;
//   date: string;
//   times: string[];
//   timeSlots?: TimeSlot[];
// }

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
  experience?: number;
  certifications?: string[];
  responseTime?: number;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  icon: React.ReactNode;
  iconColor: string;
  iconBgColor: string;
  energy: string;
  power: string;
  dimensions: string;
  compatible: boolean;
  description?: string;
  warranty?: number;
  features?: string[];
  ecoBenefits?: string[];
  installationTime?: number;
  manufacturer?: string;
  reference: string;
  libelle: string;
  quantite: number;
  prixTTC: number;
  categorie: string;
  tva: string;
  marque: string;
  unite: string;
  operation: string;
  details: Record<string, string | number | boolean>;
  imageUrl?: string;
  stock?: {
    stockTotal: number;
    stockDisponible: number;
    stockReserve: number;
    stockMinimum: number;
    stockAlerte: number;
    emplacement?: string;
    dateDerniereReception?: string;
    codeBarres?: string;
  };
  orderInfo?: {
    isOrderItem: boolean;
    orderId?: string;
    statusCommande?: 'en attente' | 'confirmé' | 'en préparation' | 'expédié' | 'installé' | 'en attente fournisseur';
    dateCommande?: string;
    datePreparation?: string;
    dateLivraison?: string;
    notes?: string;
    isPACAccessoire?: boolean;
    relatedProductId?: string;
  };
  isDevisItem: boolean;
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
  compatibility?: string[];
  required?: boolean;
  warranty?: number;
}

// interface CalendarDay {
//   date: Date;
//   dateString: string;
//   isCurrentMonth: boolean;
//   hasSlots?: boolean;
// }

// interface DraggableAppointment {
//   id: string;
//   startTime: string;
//   endTime: string;
//   duration: number;
//   title: string;
//   content?: string;
//   color: string;
// }

// Product quantity mapping type
interface ProductQuantityMap {
  [productId: string]: number;
}

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

// Operation constants
const OPERATIONS = {
  BAR_TH_171: "BAR-TH-171 : POMPE A CHALEUR AIR/EAU",
  BAR_TH_129: "BAR-TH-129 : POMPE A CHALEUR AIR/AIR",
  BAR_TH_112: "BAR-TH-112 : POELE A GRANULES",
  BAR_TH_113: "BAR-TH-113 : CHAUDIERE BIOMASSE",
  BAR_TH_148: "BAR-TH-148 : CHAUFFE EAU THERMODYNAMIQUE",
  BAR_TH_143: "BAR-TH-143 : SYSTEME SOLAIRE COMBINE",
  BAR_TH_101: "BAR-TH-101 : CHAUFFE EAU SOLAIRE INDIVIDUEL"
};

// Sample products data with stock and order information
const products: Product[] = [
  {
    id: "P001",
    reference: "PAC-AW-PREMIUM",
    description: "Pompe à chaleur Air/Eau haute performance énergétique",
    libelle: "PAC Air/Eau Premium",
    quantite: 1,
    prixTTC: 8500,
    categorie: "MONO GESTE",
    tva: "5.5",
    marque: "EcoTherm",
    unite: "Unité",
    operation: OPERATIONS.BAR_TH_171,
    imageUrl: "https://images.unsplash.com/photo-1622219970016-09f07c1eed36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: {
      classe: "A+++",
      efficaciteEnergetique: "195",
      temperaturePAC: "65°C",
      classeRegulateur: "VI",
      cop: "4.8",
      scop: "5.2",
      temperatureEau: "60°C",
      temperatureArret: "-25°C",
      kwhCumac: "85000"
    },
    stock: {
      stockTotal: 15,
      stockDisponible: 8,
      stockReserve: 7,
      stockMinimum: 5,
      stockAlerte: 3,
      emplacement: "Entrepôt A - Allée 5",
      dateDerniereReception: "2025-03-15",
      codeBarres: "PAC-AW-P001"
    },
    isDevisItem: true,
    name: "",
    category: "",
    price: 0,
    rating: 0,
    icon: undefined,
    iconColor: "",
    iconBgColor: "",
    energy: "",
    power: "",
    dimensions: "",
    compatible: false
  },
  {
    id: "P002",
    reference: "PAC-AA-MULTI",
    description: "Système multi-split air/air pour habitation jusqu'à 120m²",
    libelle: "PAC Air/Air Multisplit",
    quantite: 1,
    prixTTC: 4750,
    categorie: "MONO GESTE",
    tva: "5.5",
    marque: "Clim+",
    unite: "Unité",
    operation: OPERATIONS.BAR_TH_129,
    imageUrl: "https://plus.unsplash.com/premium_photo-1674624682288-085eff4f98da?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: {
      cop: "4.1",
      scop: "4.3",
      puissanceNominale: "8kW",
      kwhCumac: "45000"
    },
    stock: {
      stockTotal: 12,
      stockDisponible: 4,
      stockReserve: 8,
      stockMinimum: 6,
      stockAlerte: 4,
      emplacement: "Entrepôt B - Allée 2",
      dateDerniereReception: "2025-03-10",
      codeBarres: "PAC-AA-M002"
    },
    isDevisItem: true,
    orderInfo: {
      isOrderItem: true,
      orderId: "CMD-2025-042",
      statusCommande: "confirmé",
      dateCommande: "2025-04-01",
      datePreparation: "2025-04-08",
      dateLivraison: "2025-04-15"
    },
    name: "",
    category: "",
    price: 0,
    rating: 0,
    icon: undefined,
    iconColor: "",
    iconBgColor: "",
    energy: "",
    power: "",
    dimensions: "",
    compatible: false
  },
  {
    id: "P003",
    reference: "GRANULES-FLAMME7",
    description: "Poêle à granulés avec technologie flamme verte 7*",
    libelle: "Poêle à granulés Premium",
    quantite: 1,
    prixTTC: 3200,
    categorie: "MONO GESTE",
    tva: "5.5",
    marque: "BoisEco",
    unite: "Unité",
    operation: OPERATIONS.BAR_TH_112,
    imageUrl: "https://plus.unsplash.com/premium_photo-1678509112086-a64a9499b922?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: {
      labelFlameVerte: "OUI",
      typeAppareil: "PEOLE",
      utilisant: "granules de bois",
      efficaciteEnergetique: "87",
      kwhCumac: "37000"
    },
    stock: {
      stockTotal: 20,
      stockDisponible: 2,
      stockReserve: 18,
      stockMinimum: 5,
      stockAlerte: 3,
      emplacement: "Entrepôt A - Allée 7",
      dateDerniereReception: "2025-02-25",
      codeBarres: "GRA-FLV-P003"
    },
    isDevisItem: true,
    orderInfo: {
      isOrderItem: true,
      orderId: "CMD-2025-039",
      statusCommande: "en préparation",
      dateCommande: "2025-03-25",
      datePreparation: "2025-04-05",
      dateLivraison: "2025-04-12"
    },
    name: "",
    category: "",
    price: 0,
    rating: 0,
    icon: undefined,
    iconColor: "",
    iconBgColor: "",
    energy: "",
    power: "",
    dimensions: "",
    compatible: false
  },
  {
    id: "P004",
    reference: "CET-AIR-AMBIANT",
    description: "Chauffe-eau thermodynamique sur air ambiant 200L",
    libelle: "CET 200L",
    quantite: 1,
    prixTTC: 2800,
    categorie: "MONO GESTE",
    tva: "5.5",
    marque: "AquaTherm",
    unite: "Unité",
    operation: OPERATIONS.BAR_TH_148,
    imageUrl: "https://images.unsplash.com/photo-1451847251646-8a6c0dd1510c?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: {
      cop: "3.5",
      scop: "3.7",
      typeInstallationBallon: "SUR AIR AMBIANT",
      profilSousTirage: "L",
      efficaciteEnergetique: "135",
      kwhCumac: "28000"
    },
    stock: {
      stockTotal: 10,
      stockDisponible: 7,
      stockReserve: 3,
      stockMinimum: 4,
      stockAlerte: 2,
      emplacement: "Entrepôt B - Allée 4",
      dateDerniereReception: "2025-03-20",
      codeBarres: "CET-200L-P004"
    },
    isDevisItem: true,
    name: "",
    category: "",
    price: 0,
    rating: 0,
    icon: undefined,
    iconColor: "",
    iconBgColor: "",
    energy: "",
    power: "",
    dimensions: "",
    compatible: false
  },
  {
    id: "P005",
    reference: "SSC-COMPLET",
    description: "Système solaire combiné avec régulation intelligente",
    libelle: "Système Solaire Combiné",
    quantite: 1,
    prixTTC: 9500,
    categorie: "PANNEAUX PHOTOVOLTAIQUE",
    tva: "5.5",
    marque: "SolarPlus",
    unite: "Unité",
    operation: OPERATIONS.BAR_TH_143,
    imageUrl: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    details: {
      productiviteCapteur: "580",
      capaciteStockage: "400",
      surfaceCapteurs: "8.5",
      certificationCapteurs: "OUI",
      capteursHybrides: "NON",
      kwhCumac: "95000"
    },
    stock: {
      stockTotal: 5,
      stockDisponible: 2,
      stockReserve: 3,
      stockMinimum: 2,
      stockAlerte: 1,
      emplacement: "Entrepôt C - Zone Spéciale",
      dateDerniereReception: "2025-03-05",
      codeBarres: "SSC-COM-P005"
    },
    isDevisItem: true,
    orderInfo: {
      isOrderItem: true,
      orderId: "CMD-2025-045",
      statusCommande: "en attente",
      dateCommande: "2025-04-05",
      datePreparation: "",
      dateLivraison: ""
    },
    name: "",
    category: "",
    price: 0,
    rating: 0,
    icon: undefined,
    iconColor: "",
    iconBgColor: "",
    energy: "",
    power: "",
    dimensions: "",
    compatible: false
  },
  {
    id: "P006",
    reference: "CESI-COMPLET",
    description: "Chauffe-eau solaire individuel avec capteurs plans",
    libelle: "CESI 300L",
    quantite: 1,
    prixTTC: 4200,
    categorie: "PANNEAUX PHOTOVOLTAIQUE",
    tva: "5.5",
    marque: "SolarPlus",
    unite: "Unité",
    operation: OPERATIONS.BAR_TH_101,
    imageUrl: "https://images.unsplash.com/photo-1448317846460-907988886b33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    details: {
      capaciteStockage: "300",
      efficaciteEnergetique: "B",
      surfaceCapteurs: "4.5",
      certificationCapteurs: "OUI",
      capteursHybrides: "OUI",
      kwhCumac: "42000"
    },
    stock: {
      stockTotal: 8,
      stockDisponible: 0,
      stockReserve: 8,
      stockMinimum: 3,
      stockAlerte: 2,
      emplacement: "Entrepôt A - Allée 9",
      dateDerniereReception: "2025-02-18",
      codeBarres: "CESI-300L-P006"
    },
    isDevisItem: true,
    orderInfo: {
      isOrderItem: true,
      orderId: "CMD-2025-038",
      statusCommande: "expédié",
      dateCommande: "2025-03-20",
      datePreparation: "2025-03-27",
      dateLivraison: "2025-04-05"
    },
    name: "",
    category: "",
    price: 0,
    rating: 0,
    icon: undefined,
    iconColor: "",
    iconBgColor: "",
    energy: "",
    power: "",
    dimensions: "",
    compatible: false
  },
  {
    id: "P007",
    reference: "BIO-CHAUD-ECO",
    description: "Chaudière biomasse automatique à haute performance énergétique",
    libelle: "Chaudière Biomasse Automatique",
    quantite: 1,
    prixTTC: 5800,
    categorie: "MONO GESTE",
    tva: "5.5",
    marque: "BiomasseTech",
    unite: "Unité",
    operation: OPERATIONS.BAR_TH_113,
    imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    details: {
      efficaciteEnergetique: "92",
      puissanceNominale: "24kW",
      chaudiereOperationMode: "Automatique",
      labelFlameVerte: "OUI",
      kwhCumac: "60000"
    },
    stock: {
      stockTotal: 6,
      stockDisponible: 6,
      stockReserve: 0,
      stockMinimum: 2,
      stockAlerte: 1,
      emplacement: "Entrepôt B - Allée 6",
      dateDerniereReception: "2025-04-01",
      codeBarres: "BIO-CHA-P007"
    },
    isDevisItem: true,
    name: "",
    category: "",
    price: 0,
    rating: 0,
    icon: undefined,
    iconColor: "",
    iconBgColor: "",
    energy: "",
    power: "",
    dimensions: "",
    compatible: false
  },
  // PAC Accessories
  {
    id: "P008",
    reference: "PAC-ACC-TUYAU",
    description: "Kit tuyauterie cuivre isolé pour raccordement PAC air/eau",
    libelle: "Kit tuyauterie PAC",
    quantite: 1,
    prixTTC: 280,
    categorie: "ACCESSOIRE",
    tva: "20",
    marque: "EcoTherm",
    unite: "Kit",
    operation: "",
    details: {},
    stock: {
      stockTotal: 25,
      stockDisponible: 12,
      stockReserve: 13,
      stockMinimum: 10,
      stockAlerte: 5,
      emplacement: "Entrepôt A - Allée 2",
      dateDerniereReception: "2025-03-15",
      codeBarres: "PAC-ACC-T008"
    },
    isDevisItem: true,
    orderInfo: {
      isOrderItem: true,
      orderId: "CMD-2025-042",
      statusCommande: "confirmé",
      dateCommande: "2025-04-01",
      datePreparation: "2025-04-08",
      dateLivraison: "2025-04-15",
      isPACAccessoire: true,
      relatedProductId: "P001"
    },
    name: "",
    category: "",
    price: 0,
    rating: 0,
    icon: undefined,
    iconColor: "",
    iconBgColor: "",
    energy: "",
    power: "",
    dimensions: "",
    compatible: false
  },
  {
    id: "P009",
    reference: "PAC-ACC-SUPPORT",
    description: "Support mural anti-vibration pour unité extérieure PAC",
    libelle: "Support PAC mural",
    quantite: 1,
    prixTTC: 195,
    categorie: "ACCESSOIRE",
    tva: "20",
    marque: "EcoTherm",
    unite: "Unité",
    operation: "",
    details: {},
    stock: {
      stockTotal: 30,
      stockDisponible: 18,
      stockReserve: 12,
      stockMinimum: 15,
      stockAlerte: 8,
      emplacement: "Entrepôt A - Allée 2",
      dateDerniereReception: "2025-03-10",
      codeBarres: "PAC-ACC-S009"
    },
    isDevisItem: true,
    orderInfo: {
      isOrderItem: true,
      orderId: "CMD-2025-045",
      statusCommande: "en attente",
      dateCommande: "2025-04-05",
      datePreparation: "",
      dateLivraison: "",
      isPACAccessoire: true,
      relatedProductId: "P002"
    },
    name: "",
    category: "",
    price: 0,
    rating: 0,
    icon: undefined,
    iconColor: "",
    iconBgColor: "",
    energy: "",
    power: "",
    dimensions: "",
    compatible: false
  },
  {
    id: "P010",
    reference: "PAC-ACC-FLUIDE",
    description: "Recharge fluide frigorigène R32 pour PAC",
    libelle: "Fluide frigorigène R32",
    quantite: 1,
    prixTTC: 120,
    categorie: "ACCESSOIRE",
    tva: "20",
    marque: "Clim+",
    unite: "Unité",
    operation: "",
    details: {},
    stock: {
      stockTotal: 15,
      stockDisponible: 2,
      stockReserve: 13,
      stockMinimum: 8,
      stockAlerte: 5,
      emplacement: "Entrepôt B - Zone Spéciale",
      dateDerniereReception: "2025-02-25",
      codeBarres: "PAC-ACC-F010"
    },
    isDevisItem: true,
    orderInfo: {
      isOrderItem: true,
      orderId: "CMD-2025-039",
      statusCommande: "en préparation",
      dateCommande: "2025-03-25",
      datePreparation: "2025-04-05",
      dateLivraison: "2025-04-12",
      isPACAccessoire: true,
      relatedProductId: "P002"
    },
    name: "",
    category: "",
    price: 0,
    rating: 0,
    icon: undefined,
    iconColor: "",
    iconBgColor: "",
    energy: "",
    power: "",
    dimensions: "",
    compatible: false
  },
  
  // NEW OUT-OF-STOCK PRODUCTS
  {
    id: "P011",
    reference: "VENTI-DOUBLE-FLUX",
    description: "Système de ventilation double flux haute efficacité avec récupération de chaleur",
    libelle: "VMC Double Flux Premium",
    quantite: 1,
    prixTTC: 3200,
    categorie: "MONO GESTE",
    tva: "5.5",
    marque: "AirPur",
    unite: "Unité",
    operation: OPERATIONS.BAR_TH_171,
    imageUrl: "https://images.unsplash.com/photo-1631545806770-7ef06ee21cd3?q=80&w=1974&auto=format&fit=crop",
    details: {
      efficaciteEnergetique: "A+",
      puissanceElectrique: "45W",
      debitAir: "300m³/h",
      rendementEchangeur: "92%",
      kwhCumac: "38000"
    },
    stock: {
      stockTotal: 10,
      stockDisponible: 0,
      stockReserve: 10,
      stockMinimum: 4,
      stockAlerte: 2,
      emplacement: "Entrepôt C - Zone 2",
      dateDerniereReception: "2025-02-15",
      codeBarres: "VMC-DF-P011"
    },
    isDevisItem: true,
    orderInfo: {
      isOrderItem: true,
      orderId: "CMD-2025-054",
      statusCommande: "en attente",
      dateCommande: "2025-04-10",
      datePreparation: "",
      dateLivraison: ""
    },
    name: "",
    category: "",
    price: 0,
    rating: 0,
    icon: undefined,
    iconColor: "",
    iconBgColor: "",
    energy: "",
    power: "",
    dimensions: "",
    compatible: false
  },
  {
    id: "P012",
    reference: "ISOLANT-FIBRE-BOIS",
    description: "Panneaux isolants en fibre de bois écologique haute densité",
    libelle: "Panneaux isolants naturels",
    quantite: 1,
    prixTTC: 2400,
    categorie: "ISOLATION",
    tva: "5.5",
    marque: "NaturIso",
    unite: "Lot",
    operation: OPERATIONS.BAR_TH_101,
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop",
    details: {
      resistance: "R=5.25 m².K/W",
      epaisseur: "180mm",
      surfaceCouverture: "8m²",
      lambdaThermique: "0.038 W/m.K",
      kwhCumac: "25000"
    },
    stock: {
      stockTotal: 18,
      stockDisponible: 0,
      stockReserve: 18,
      stockMinimum: 10,
      stockAlerte: 5,
      emplacement: "Entrepôt B - Allée 8",
      dateDerniereReception: "2025-01-25",
      codeBarres: "ISO-FB-P012"
    },
    isDevisItem: true,
    name: "",
    category: "",
    price: 0,
    rating: 0,
    icon: undefined,
    iconColor: "",
    iconBgColor: "",
    energy: "",
    power: "",
    dimensions: "",
    compatible: false
  },
  {
    id: "P013",
    reference: "BALLON-TAMPON-SOLAIRE",
    description: "Ballon tampon solaire 800L avec échangeur thermique intégré",
    libelle: "Ballon tampon 800L",
    quantite: 1,
    prixTTC: 3800,
    categorie: "PANNEAUX PHOTOVOLTAIQUE",
    tva: "5.5",
    marque: "SolarPlus",
    unite: "Unité",
    operation: OPERATIONS.BAR_TH_143,
    imageUrl: "https://images.unsplash.com/photo-1611921561607-13afed0ee386?q=80&w=1974&auto=format&fit=crop",
    details: {
      capaciteStockage: "800L",
      isolationThermique: "100mm",
      echangeursThermiques: "2",
      classeEnergetique: "A",
      kwhCumac: "40000"
    },
    stock: {
      stockTotal: 6,
      stockDisponible: 0,
      stockReserve: 6,
      stockMinimum: 3,
      stockAlerte: 2,
      emplacement: "Entrepôt C - Zone Spéciale",
      dateDerniereReception: "2025-03-02",
      codeBarres: "BAL-SOL-P013"
    },
    isDevisItem: true,
    orderInfo: {
      isOrderItem: true,
      orderId: "CMD-2025-048",
      statusCommande: "confirmé",
      dateCommande: "2025-04-07",
      datePreparation: "2025-04-20",
      dateLivraison: "2025-04-27"
    },
    name: "",
    category: "",
    price: 0,
    rating: 0,
    icon: undefined,
    iconColor: "",
    iconBgColor: "",
    energy: "",
    power: "",
    dimensions: "",
    compatible: false
  },
  {
    id: "P014",
    reference: "BATTERIE-STOCKAGE-10KWH",
    description: "Batterie de stockage d'énergie lithium-ion 10kWh pour système photovoltaïque",
    libelle: "Batterie stockage 10kWh",
    quantite: 1,
    prixTTC: 7500,
    categorie: "BATTERIE",
    tva: "20",
    marque: "PowerStore",
    unite: "Unité",
    operation: "",
    imageUrl: "https://images.unsplash.com/photo-1593866223856-5c966e9eff86?q=80&w=2070&auto=format&fit=crop",
    details: {
      capacite: "10kWh",
      typeCellules: "Lithium-ion LFP",
      puissanceMax: "5kW",
      dureeVie: "6000 cycles",
      garantie: "10 ans"
    },
    stock: {
      stockTotal: 8,
      stockDisponible: 0,
      stockReserve: 8,
      stockMinimum: 4,
      stockAlerte: 2,
      emplacement: "Entrepôt C - Zone Sécurisée",
      dateDerniereReception: "2025-02-10",
      codeBarres: "BAT-10K-P014"
    },
    isDevisItem: true,
    name: "",
    category: "",
    price: 0,
    rating: 0,
    icon: undefined,
    iconColor: "",
    iconBgColor: "",
    energy: "",
    power: "",
    dimensions: "",
    compatible: false
  },
  {
    id: "P015",
    reference: "KIT-PHOTOV-COMPLET-6KW",
    description: "Kit photovoltaïque complet 6kW avec micro-onduleurs et système de monitoring",
    libelle: "Kit photovoltaïque 6kW",
    quantite: 1,
    prixTTC: 12500,
    categorie: "PANNEAUX PHOTOVOLTAIQUE",
    tva: "10",
    marque: "SunPower",
    unite: "Kit",
    operation: "",
    imageUrl: "https://images.unsplash.com/photo-1613665813427-4c5a2e4989f5?q=80&w=2069&auto=format&fit=crop",
    details: {
      puissanceCreste: "6kWc",
      nbPanneaux: "15",
      puissancePanneau: "400Wc",
      typeOnduleur: "Micro-onduleurs",
      garantiePanneaux: "25 ans",
      rendementSystème: "97%"
    },
    stock: {
      stockTotal: 5,
      stockDisponible: 0,
      stockReserve: 5,
      stockMinimum: 2,
      stockAlerte: 1,
      emplacement: "Entrepôt D - Zone PV",
      dateDerniereReception: "2025-01-20",
      codeBarres: "PV-6KW-P015"
    },
    isDevisItem: true,
    orderInfo: {
      isOrderItem: true,
      orderId: "CMD-2025-056",
      statusCommande: "en attente fournisseur",
      dateCommande: "2025-04-11",
      datePreparation: "",
      dateLivraison: ""
    },
    name: "",
    category: "",
    price: 0,
    rating: 0,
    icon: undefined,
    iconColor: "",
    iconBgColor: "",
    energy: "",
    power: "",
    dimensions: "",
    compatible: false
  }
];


// Define preset appointment slots for the advanced calendar
// const presetAppointments: DraggableAppointment[] = [
//   {
//     id: "appt-1",
//     startTime: "09:00",
//     endTime: "11:00",
//     duration: 120,
//     title: "Installation PAC",
//     content: "Installation complète avec test",
//     color: "bg-blue-100 border-blue-300 text-blue-800"
//   },
//   {
//     id: "appt-2",
//     startTime: "13:00",
//     endTime: "15:00",
//     duration: 120,
//     title: "Maintenance syst.",
//     content: "Vérification annuelle",
//     color: "bg-green-100 border-green-300 text-green-800"
//   },
//   {
//     id: "appt-3",
//     startTime: "15:30",
//     endTime: "17:00",
//     duration: 90,
//     title: "Dépannage",
//     content: "Intervention urgente",
//     color: "bg-red-100 border-red-300 text-red-800"
//   }
// ];


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

// const hourMarkers = Array.from({ length: 11 }, (_, i) => {
//   const hour = i + 8; // Start at 8 AM
//   return `${hour}:00`;
// });

interface EnhancedInstallationModalProps {
  initialStep?: number;
  onComplete?: (data: InstallationData) => void;
  clientAddress?: string;
  isOpen?: boolean; // Add this
  onClose?: () => void; // Add this
}

const EnhancedInstallationModal: React.FC<EnhancedInstallationModalProps> = ({
  initialStep = 1,
  onComplete,
  clientAddress = "123 Rue de Paris, 75001 Paris",
}) => {
  // Modal state
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showCartModal, setShowCartModal] = useState<boolean>(false);
  // Add these state variables inside your EnhancedInstallationModal component
// near the other useState declarations (after the imports and before the return statement)

// For out-of-stock products modal
const [showOutOfStockProducts, setShowOutOfStockProducts] = useState<boolean>(false);
const [outOfStockSearchQuery, setOutOfStockSearchQuery] = useState<string>('');

// You may need to enhance the filteredProducts logic to account for in-stock/out-of-stock:

  // Calendar state
  // const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 3)); // April 2025
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [ , setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [ , setCalendarView] = useState<"month" | "day" | "week" | "schedule">("schedule");
  // const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  // const [appointments, setAppointments] = useState<DraggableAppointment[]>(presetAppointments);
  
  // Installer state
  const [selectedInstaller, setSelectedInstaller] = useState<number | null>(null);
  const [installationNotes, setInstallationNotes] = useState<string>("");
  const [searchInstallerQuery, setSearchInstallerQuery] = useState<string>("");
  const [installerFilterSpecialty, setInstallerFilterSpecialty] = useState<string | null>(null);
  
  // Product state
  const [ , setSelectedProduct] = useState<Product | null>(null);
  const [ , setQuantity] = useState<number>(1);
  const [ , setShowAccessories] = useState<boolean>(false);
  const [showInstallerDetails, setShowInstallerDetails] = useState<boolean>(false);
  const [ , setShowProductDetails] = useState<boolean>(false);
  const [ , setActiveDetailTab] = useState<string>("specs");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  
  // Updated state variables
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedAccessories, setSelectedAccessories] = useState<Product[]>([]);
  const [ , setShowPacAccessories] = useState<boolean>(false);
  const [orderReserved, setOrderReserved] = useState<boolean>(false);
  const [productSearchQuery, setProductSearchQuery] = useState<string>('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string | null>(null);
  
  // New state for product quantities
  const [productQuantities, setProductQuantities] = useState<ProductQuantityMap>({});
  const [accessoryQuantities, setAccessoryQuantities] = useState<ProductQuantityMap>({});

  // Calculate available categories from products
  const availableCategories = useMemo(() => {
    return Array.from(new Set(products.map(product => product.categorie)));
  }, [products]);

  // Filter products based on search and category
  // const filteredProducts = useMemo(() => {
  //   return products.filter(product => {
  //     // Skip accessories when not in accessory mode
  //     if (!showPacAccessories && product.categorie === "ACCESSOIRE") {
  //       return false;
  //     }
      
  //     // Show only accessories when in accessory mode
  //     if (showPacAccessories && product.categorie !== "ACCESSOIRE") {
  //       return false;
  //     }
      
  //     const matchesSearch = !productSearchQuery || 
  //       product.reference.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
  //       product.libelle.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
  //       (product.description ?? "").toLowerCase().includes(productSearchQuery.toLowerCase());
      
  //     const matchesCategory = !productCategoryFilter || product.categorie === productCategoryFilter;
      
  //     return matchesSearch && matchesCategory;
  //   });
  // }, [products, productSearchQuery, productCategoryFilter, showPacAccessories]);
  

  // Handler for product submission
  const handleProductSubmit = () => {
    setOrderReserved(true);
    
    // No need for timeout, just set the state
    // This change ensures the "Continue" button works immediately
  };

  // Update product quantity
  const updateProductQuantity = (productId: string, newQuantity: number) => {
    setProductQuantities({
      ...productQuantities,
      [productId]: newQuantity
    });
  };

  // Update accessory quantity
  // const updateAccessoryQuantity = (accessoryId: string, newQuantity: number) => {
  //   setAccessoryQuantities({
  //     ...accessoryQuantities,
  //     [accessoryId]: newQuantity
  //   });
  // };

  // Get quantity for a product
  const getProductQuantity = (productId: string): number => {
    return productQuantities[productId] || 1;
  };

  // Get quantity for an accessory
  const getAccessoryQuantity = (accessoryId: string): number => {
    return accessoryQuantities[accessoryId] || 1;
  };

  // Calculate cart total considering quantities
  const cartTotal = useMemo(() => {
    const productsTotal = selectedProducts.reduce((sum, product) => {
      return sum + (product.prixTTC * getProductQuantity(product.id));
    }, 0);

    const accessoriesTotal = selectedAccessories.reduce((sum, accessory) => {
      return sum + (accessory.prixTTC * getAccessoryQuantity(accessory.id));
    }, 0);

    return productsTotal + accessoriesTotal;
  }, [selectedProducts, selectedAccessories, productQuantities, accessoryQuantities]);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList) return;
    const newFiles = Array.from(fileList);
    setAttachedFiles((prev) => [...prev, ...newFiles]);
  }
  
  function handleRemoveFile(index: number) {
    setAttachedFiles(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  }
  
  // Advanced calendar state
  // const [showMiniMonth, setShowMiniMonth] = useState<boolean>(true);
  // const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date(2025, 3, 14)); // April 14, 2025
  
  // Filtered installers based on search and filters
  const filteredInstallers = installers.filter(installer => 
    installer.available && 
    (searchInstallerQuery === "" || 
      installer.name.toLowerCase().includes(searchInstallerQuery.toLowerCase()) ||
      installer.specialty.toLowerCase().includes(searchInstallerQuery.toLowerCase())) &&
    (installerFilterSpecialty === null || installer.specialty === installerFilterSpecialty)
  );
  
  // Get available specialties for filtering
  const availableSpecialties = Array.from(new Set(installers.map(installer => installer.specialty)));
  
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
    setSelectedProducts([]);
    setProductQuantities({});
    setAccessoryQuantities({});
    setShowPacAccessories(false);
  };
  
  // Handle final installation submission
  const handleInstallSubmit = (): void => {
    if (!selectedDate || !selectedTime || !selectedInstaller || selectedProducts.length === 0) return;
    
    setIsSubmitting(true);
    
    // Prepare data for submission
    const installationData = {
      date: selectedDate,
      time: selectedTime,
      installer: installers.find(i => i.id === selectedInstaller),
      product: selectedProducts[0], // Using the first product as main product
      quantity: getProductQuantity(selectedProducts[0].id),
      accessories: [], // This would need to be updated
      notes: installationNotes,
      total: cartTotal,
      address: clientAddress,
      status: "EN_COURS",
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
  
  // // Get days in month for calendar
  // const getDaysInMonth = (year: number, month: number): number => {
  //   return new Date(year, month + 1, 0).getDate();
  // };
  
  // // Get day of week (0-6) for the first day of the month
  // const getFirstDayOfMonth = (year: number, month: number): number => {
  //   return new Date(year, month, 1).getDay();
  // };
  
  // Check if a date has available slots
  // const hasAvailableSlots = (dateString: string): boolean => {
  //   return availableSlots.some(slot => slot.date === dateString);
  // };
  
  // Get available slot count for a date
  // const getAvailableSlotCount = (dateString: string): number => {
  //   const slot = availableSlots.find(slot => slot.date === dateString);
  //   return slot ? slot.times.length : 0;
  // };
  
  // // Handle appointment resize
  // const handleAppointmentResize = (appointmentId: string, newDuration: number): void => {
  //   setAppointments(appointments.map(appointment => {
  //     if (appointment.id === appointmentId) {
  //       const startHour = parseInt(appointment.startTime.split(':')[0], 10);
  //       const startMinute = parseInt(appointment.startTime.split(':')[1], 10);
        
  //       // Calculate new end time based on duration
  //       const durationHours = Math.floor(newDuration / 60);
  //       const durationMinutes = newDuration % 60;
        
  //       let endHour = startHour + durationHours;
  //       let endMinute = startMinute + durationMinutes;
        
  //       if (endMinute >= 60) {
  //         endHour += 1;
  //         endMinute -= 60;
  //       }
        
  //       const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
        
  //       return {
  //         ...appointment,
  //         duration: newDuration,
  //         endTime
  //       };
  //     }
  //     return appointment;
  //   }));
  // };
  
  // Adjust first day to make Monday the first day of the week (0 = Monday, 6 = Sunday)
  // const adjustFirstDay = (day: number): number => {
  //   return day === 0 ? 6 : day - 1;
  // };
  
  // Generate calendar days for current month view
  // const generateCalendarDays = (): CalendarDay[] => {
  //   const year = currentMonth.getFullYear();
  //   const month = currentMonth.getMonth();
  //   const daysInMonth = getDaysInMonth(year, month);
  //   const firstDay = adjustFirstDay(getFirstDayOfMonth(year, month));
    
  //   // Previous month days (for filling the first row)
  //   const prevMonthDays: CalendarDay[] = [];
  //   if (firstDay > 0) {
  //     const prevMonth = new Date(year, month, 0);
  //     const prevMonthDaysCount = prevMonth.getDate();
  //     for (let i = prevMonthDaysCount - firstDay + 1; i <= prevMonthDaysCount; i++) {
  //       const date = new Date(year, month - 1, i);
  //       prevMonthDays.push({
  //         date,
  //         dateString: date.toISOString().split('T')[0],
  //         isCurrentMonth: false
  //       });
  //     }
  //   }
    
  //   // Current month days
  //   const currentMonthDays: CalendarDay[] = [];
  //   for (let i = 1; i <= daysInMonth; i++) {
  //     const date = new Date(year, month, i);
  //     const dateString = date.toISOString().split('T')[0];
  //     currentMonthDays.push({
  //       date,
  //       dateString,
  //       isCurrentMonth: true,
  //       hasSlots: hasAvailableSlots(dateString)
  //     });
  //   }
    
  //   // Next month days (for filling the last row)
  //   const nextMonthDays: CalendarDay[] = [];
  //   const totalDays = prevMonthDays.length + currentMonthDays.length;
  //   const remainingCells = 42 - totalDays; // 6 rows * 7 days = 42 cells
    
  //   for (let i = 1; i <= remainingCells; i++) {
  //     const date = new Date(year, month + 1, i);
  //     nextMonthDays.push({
  //       date,
  //       dateString: date.toISOString().split('T')[0],
  //       isCurrentMonth: false
  //     });
  //   }
    
  //   return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  // };
  
  // // Get time slots for a specific date with detailed information
  // const getTimeSlots = (dateString: string): TimeSlot[] => {
  //   const slot = availableSlots.find(slot => slot.date === dateString);
  //   return slot?.timeSlots || [];
  // };
  
  // // Navigate to previous month
  // const goToPreviousMonth = () => {
  //   setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  // };
  
  // // Navigate to next month
  // const goToNextMonth = () => {
  //   setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  // };
  
  // // Format month name
  // const formatMonth = (date: Date) => {
  //   return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  // };
  
  // // Navigate to previous week
  // const goToPreviousWeek = () => {
  //   const newDate = new Date(currentWeekStart);
  //   newDate.setDate(newDate.getDate() - 7);
  //   setCurrentWeekStart(newDate);
  // };
  
  // // Navigate to next week
  // const goToNextWeek = () => {
  //   const newDate = new Date(currentWeekStart);
  //   newDate.setDate(newDate.getDate() + 7);
  //   setCurrentWeekStart(newDate);
  // };
  
  // Generate days for the week view
  // const generateWeekDays = (): Date[] => {
  //   const days: Date[] = [];
  //   for (let i = 0; i < 7; i++) {
  //     const day = new Date(currentWeekStart);
  //     day.setDate(currentWeekStart.getDate() + i);
  //     days.push(day);
  //   }
  //   return days;
  // };

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

  // function setIsInstallModalOpen(value: boolean) {
  //   setIsOpen(value);
  // }

  // Cart review modal
  const CartReviewModal = React.memo(() => {
    // Local state for quantity management to prevent the modal from reloading
    const [localQuantities, setLocalQuantities] = useState<ProductQuantityMap>({});
    const [localProducts, setLocalProducts] = useState<Product[]>([]);
    
    // Initialize local state when the modal opens
    useEffect(() => {
      if (showCartModal) {
        setLocalQuantities({...productQuantities});
        setLocalProducts([...selectedProducts]);
      }
    }, [showCartModal]);
    
    // Local handlers to update quantities without triggering parent rerender
    const handleIncrementQuantity = (productId: string) => {
      setLocalQuantities(prev => {
        const currentQty = prev[productId] || 1;
        const maxQty = 99;
        if (currentQty < maxQty) {
          return { ...prev, [productId]: currentQty + 1 };
        }
        return prev;
      });
    };
    
    const handleDecrementQuantity = (productId: string) => {
      setLocalQuantities(prev => {
        const currentQty = prev[productId] || 1;
        if (currentQty > 1) {
          return { ...prev, [productId]: currentQty - 1 };
        }
        return prev;
      });
    };
    
    const handleRemoveProduct = (productId: string) => {
      setLocalProducts(prev => prev.filter(p => p.id !== productId));
    };
    
    // Apply changes to parent state when closing the modal
    const handleSaveChanges = () => {
      setProductQuantities(localQuantities);
      setSelectedProducts(localProducts);
      handleProductSubmit();
      setShowCartModal(false);
    };
    
    // Get local quantity for a product
    const getLocalQuantity = (productId: string): number => {
      return localQuantities[productId] || 1;
    };
    
    // Calculate total units
    const totalUnits = localProducts.reduce((total, product) => 
      total + getLocalQuantity(product.id), 0
    );
    
    return (
      <Dialog
        as="div"
        className="fixed inset-0 z-[100] overflow-y-auto"
        open={showCartModal}
        onClose={() => setShowCartModal(false)}
      >
        <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:p-0">
          <div className="fixed inset-0 bg-gray-900/20 transition-opacity" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative inline-block transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-full bg-white/20 p-2 mr-3">
                    <ShoppingBagIcon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-white">
                    Mon panier
                  </h3>
                </div>
                <button
                  type="button"
                  className="rounded-md bg-white/20 p-1.5 text-white hover:bg-white/30"
                  onClick={() => setShowCartModal(false)}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[70vh] overflow-y-auto">
              {localProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                  <ShoppingBagIcon className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500 text-center">Votre panier est vide</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h5 className="text-sm font-medium text-gray-700">
                        {localProducts.length} produit{localProducts.length > 1 ? 's' : ''} sélectionné{localProducts.length > 1 ? 's' : ''}
                      </h5>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {localProducts.map(product => (
                        <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start">
                            <div className="h-12 w-12 rounded-md bg-blue-100 p-2 flex items-center justify-center mr-3 flex-shrink-0">
                              {product.categorie === "ACCESSOIRE" ? (
                                <WrenchScrewdriverIcon className="h-6 w-6 text-blue-600" />
                              ) : (
                                <CubeIcon className="h-6 w-6 text-blue-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-800">{product.libelle || product.reference}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">{product.reference}</p>
                                </div>
                              </div>
                              
                              <div className="mt-2 flex items-center justify-between">
                                <div className="flex flex-wrap gap-2">
                                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                    <TagIcon className="h-3 w-3 mr-1" />
                                    {product.categorie}
                                  </span>
                                  {product.stock && product.stock.stockDisponible > 0 ? (
                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                                      {product.stock.stockDisponible} en stock
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                                      Sur commande
                                    </span>
                                  )}
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <div className="flex items-center h-8 rounded-md border border-gray-300 bg-white">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDecrementQuantity(product.id);
                                      }}
                                      className="flex items-center justify-center w-8 text-gray-500 hover:text-gray-700"
                                    >
                                      <MinusCircleIcon className="h-4 w-4" />
                                    </button>
                                    <span className="w-8 text-center text-sm font-medium">
                                      {getLocalQuantity(product.id)}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleIncrementQuantity(product.id);
                                      }}
                                      className="flex items-center justify-center w-8 text-gray-500 hover:text-gray-700"
                                    >
                                      <PlusCircleIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveProduct(product.id);
                                    }}
                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                  >
                                    <XMarkIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Summary without prices */}
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Récapitulatif</span>
                      <span className="text-sm font-medium text-gray-700">
                        {totalUnits} unité{totalUnits > 1 ? 's' : ''} au total
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 px-4 py-3 flex justify-between sm:px-6">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => setShowCartModal(false)}
              >
                Continuer mes achats
              </button>
              
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleSaveChanges}
                disabled={localProducts.length === 0}
              >
                Valider ma sélection
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>
    );
  });

  // Add this line to fix the display name error
  CartReviewModal.displayName = 'CartReviewModal';

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
        <span className="text-sm font-semibold tracking-wide">Prendre rendez-vous avec le client</span>
      </button>
      
        {/* Enhanced Installation Modal */}
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
        <Modal isOpen={isOpen} onClose={() => !isSubmitting && setIsOpen(false)}>
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="z-50 relative inline-block w-full max-w-6xl transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all sm:align-middle"
          >
            {/* Modal header with gradient background */}
            <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 pt-6">
              {/* Close button */}
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent default behavior
                  e.stopPropagation(); // Prevent event bubbling
                  console.log("Close button clicked"); // Debug log
                  setIsOpen(false); // Force close regardless of isSubmitting
                }}
                className="absolute right-4 top-4 rounded-full bg-white/20 p-1.5 text-white transition-colors 
                          hover:bg-white/30 focus:outline-none cursor-pointer z-50"
              >
                <XMarkIcon className="h-5 w-5 pointer-events-none" />
              </button>
              
              {/* Header content */}
              <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 sm:mb-0 sm:mr-5">
                  <WrenchScrewdriverIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white" id="modal-title">
                    Prendre rendez-vous avec le client
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
                  <EnhancedCalendar
                    onTimeSlotSelect={(date, time) => {
                      setSelectedDate(date);
                      setSelectedTime(time);
                    }}
                  />

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
                        placeholder="Ajoutez des instructions spécifiques..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        rows={3}
                      />

                      <p className="mt-2 text-xs text-gray-500">
                        Ces notes seront communiquées à l&apos;installateur avec les détails de l&apos;intervention.
                      </p>

                      {/* Pièces jointes */}
                      <div className="mt-4">
                        <label htmlFor="attached-files" className="block text-sm font-medium text-gray-700">
                          Pièces jointes (photos, devis, etc.)
                        </label>
                        <div className="mt-1 flex items-center">
                          <input
                            id="attached-files"
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                                      file:border-0 file:text-sm file:font-semibold
                                      file:bg-gray-200 file:text-gray-700
                                      hover:file:bg-gray-300
                                      focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        {attachedFiles.length > 0 && (
                          <ul className="mt-3 text-sm text-gray-600 space-y-1">
                            {attachedFiles.map((file, index) => (
                              <li key={index} className="flex items-center justify-between">
                                <span>{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFile(index)}
                                  className="ml-3 text-xs text-red-600 hover:underline"
                                >
                                  Supprimer
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
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
              
              {/* Step 3: Improved Product Selection */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Sélectionnez les produits à installer</h4>
                    <p className="mt-1 text-sm text-gray-500">Choisissez un ou plusieurs équipements nécessaires pour cette installation</p>
                  </div>
                  
                  {/* Add state variables */}
                  {/* For reference - add these to the top of your component:
                  const [showOutOfStockProducts, setShowOutOfStockProducts] = useState<boolean>(false);
                  const [outOfStockSearchQuery, setOutOfStockSearchQuery] = useState<string>(''); */}
                  
                  {/* Enhanced Product search and filters */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={productSearchQuery}
                        onChange={(e) => setProductSearchQuery(e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2.5 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
                        placeholder="Rechercher un produit par référence, nom ou catégorie..."
                      />
                      {productSearchQuery && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setProductSearchQuery('');
                          }}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        </button>
                      )}
                    </div>
                    
                    <div className="sm:w-56">
                      <select
                        value={productCategoryFilter || ""}
                        onChange={(e) => setProductCategoryFilter(e.target.value || null)}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
                      >
                        <option value="">Toutes les catégories</option>
                        {availableCategories.map((category, index) => (
                          <option key={index} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Button to add out-of-stock products */}
                    <button
                      onClick={() => setShowOutOfStockProducts(true)}
                      className="inline-flex items-center justify-center px-4 py-2.5 border border-blue-300 text-sm font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Ajouter un produit à la commande
                    </button>
                  </div>

                  {/* Product selection cards with multi-select */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <h5 className="text-sm font-medium text-gray-700">
                        {selectedProducts.length > 0 
                          ? `${selectedProducts.length} produit(s) sélectionné(s)` 
                          : "Sélectionnez un ou plusieurs produits"}
                      </h5>
                      {selectedProducts.length > 0 && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProducts([]);
                            setProductQuantities({});
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Effacer la sélection
                        </button>
                      )}
                    </div>
                        
                    {/* Show only products WITH STOCK in the grid */}
                    {(() => {
                      // Modified to only show products with stock
                      const displayProducts = products.filter(product => {
                        // Only show products that have stock
                        const hasStock = product.stock && product.stock.stockDisponible > 0;
                        
                        const matchesSearch = !productSearchQuery || 
                          product.reference.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
                          product.libelle.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
                          (product.description ?? "").toLowerCase().includes(productSearchQuery.toLowerCase());
                        
                        const matchesCategory = !productCategoryFilter || product.categorie === productCategoryFilter;
                        
                        return hasStock && matchesSearch && matchesCategory;
                      });
                          
                      return displayProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                          <IoDocumentOutline className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-gray-500 text-center">Aucun produit en stock ne correspond à votre recherche</p>
                          <p className="text-gray-500 text-center mt-2">Utilisez le bouton &quot;Ajouter un produit à la commande&quot; pour voir les produits hors stock</p>
                        </div>
                      ) : (
                        // Grid layout for products
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {displayProducts.map((product) => (
                            <motion.div
                              key={product.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`relative flex flex-col rounded-xl border transition-all h-full ${
                                selectedProducts.some(p => p.id === product.id)
                                  ? "border-blue-500 bg-blue-50 shadow-md"
                                  : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-sm"
                              }`}
                            >
                              {/* Product header - icon and title */}
                              <div className="flex items-start p-4">
                                <div 
                                  className={`h-12 w-12 rounded-lg ${
                                    selectedProducts.some(p => p.id === product.id)
                                      ? "bg-blue-200"
                                      : "bg-blue-100" 
                                  } p-2 flex items-center justify-center relative mr-3 cursor-pointer`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (selectedProducts.some(p => p.id === product.id)) {
                                      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
                                    } else {
                                      setSelectedProducts([...selectedProducts, product]);
                                    }
                                  }}
                                >
                                  {/* Show appropriate icon based on product category */}
                                  {product.categorie === "ACCESSOIRE" ? (
                                    <WrenchScrewdriverIcon className="h-6 w-6 text-blue-600" />
                                  ) : (
                                    <CubeIcon className="h-6 w-6 text-blue-600" />
                                  )}
                                  
                                  {/* Selection checkmark */}
                                  {selectedProducts.some(p => p.id === product.id) && (
                                    <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-blue-500 shadow-sm flex items-center justify-center ring-1 ring-white">
                                      <CheckIcon className="h-3 w-3 text-white" />
                                    </div>
                                  )}
                                </div>
                                
                                <div 
                                  className="flex-1 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (selectedProducts.some(p => p.id === product.id)) {
                                      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
                                    } else {
                                      setSelectedProducts([...selectedProducts, product]);
                                    }
                                  }}
                                >
                                  <h5 className={`text-base font-medium ${
                                    selectedProducts.some(p => p.id === product.id) ? "text-blue-700" : "text-gray-900"
                                  } line-clamp-1`}>
                                    {product.libelle || product.reference}
                                  </h5>
                                  
                                  <div className="flex items-center mt-1">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                      product.stock && product.stock.stockDisponible > 10
                                        ? "bg-green-100 text-green-800"
                                        : "bg-amber-100 text-amber-800"
                                    }`}>
                                      {product.stock ? product.stock.stockDisponible : 0} en stock
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Product body */}
                              <div 
                                className="px-4 pb-2 flex-1 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (selectedProducts.some(p => p.id === product.id)) {
                                    setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
                                  } else {
                                    setSelectedProducts([...selectedProducts, product]);
                                  }
                                }}
                              >
                                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                                  {product.description || `Référence: ${product.reference}`}
                                </p>
                                
                                {/* Product specs */}
                                <div className="flex flex-wrap gap-x-3 gap-y-1">
                                  <span className="inline-flex items-center text-xs text-gray-500">
                                    <TagIcon className="h-3 w-3 mr-1 text-blue-500" />
                                    {product.categorie}
                                  </span>
                                  <span className="inline-flex items-center text-xs text-gray-500">
                                    <BuildingOfficeIcon className="h-3 w-3 mr-1 text-amber-500" />
                                    {product.marque}
                                  </span>
                                  {product.operation && (
                                    <span className="inline-flex items-center text-xs text-gray-500">
                                      <DocumentTextIcon className="h-3 w-3 mr-1 text-purple-500" />
                                      {product.operation.split(':')[0]}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Product footer - with quantity control and without prices */}
                              <div className="border-t border-gray-200 p-3 flex items-center justify-end mt-auto">
                                {selectedProducts.some(p => p.id === product.id) ? (
                                  <div className="flex items-center h-8 rounded-md border border-gray-300 bg-white">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const currentQty = getProductQuantity(product.id);
                                        if (currentQty > 1) {
                                          updateProductQuantity(product.id, currentQty - 1);
                                        }
                                      }}
                                      className="flex items-center justify-center w-8 text-gray-500 hover:text-gray-700"
                                    >
                                      <MinusCircleIcon className="h-4 w-4" />
                                    </button>
                                    <span className="w-8 text-center text-sm font-medium">
                                      {getProductQuantity(product.id)}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const currentQty = getProductQuantity(product.id);
                                        // Allow any quantity (up to 99) for all products, regardless of stock status
                                        const maxQty = 99;
                                        if (currentQty < maxQty) {
                                          updateProductQuantity(product.id, currentQty + 1);
                                        }
                                      }}
                                      className="flex items-center justify-center w-8 text-gray-500 hover:text-gray-700"
                                    >
                                      <PlusCircleIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedProducts([...selectedProducts, product]);
                                    }}
                                    className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  >
                                    <PlusIcon className="h-4 w-4 mr-1" />
                                    Ajouter
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                  
                  {/* Selection Summary - Fixed at bottom */}
                  {(selectedProducts.length > 0 || selectedAccessories.length > 0) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="sticky bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 rounded-t-xl z-20 mt-8"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <ShoppingBagIcon className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-sm font-medium">
                            {selectedProducts.length + selectedAccessories.length} produit{(selectedProducts.length + selectedAccessories.length) > 1 ? 's' : ''} sélectionné{(selectedProducts.length + selectedAccessories.length) > 1 ? 's' : ''}
                          </span>
                          
                          {/* Badge showing total quantity */}
                          <div className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {Object.values(productQuantities).reduce((sum, qty) => sum + qty, 0) + 
                            Object.values(accessoryQuantities).reduce((sum, qty) => sum + qty, 0)} unités
                          </div>
                        </div>
                        
                        {/* Order reservation buttons - MODIFIED to include the "Voir mon panier" button */}
                        <div className="flex space-x-2">
                          {/* Add this button */}
                          <button
                            onClick={() => setShowCartModal(true)}
                            disabled={selectedProducts.length === 0}
                            className={`flex items-center justify-center py-2 px-4 rounded-lg border ${
                              selectedProducts.length === 0
                                ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "border-blue-300 bg-white text-blue-600 hover:bg-blue-50"
                            } text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
                          >
                            <span>Voir mon panier</span>
                          </button>
                          
                          {/* Existing button */}
                          {!orderReserved ? (
                            <button
                              onClick={handleProductSubmit}
                              disabled={selectedProducts.length === 0}
                              className={`flex items-center justify-center py-2 px-4 rounded-lg ${
                                selectedProducts.length === 0
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                              } text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
                            >
                              <span className="mr-2">Valider la sélection</span>
                              <ArrowLongRightIcon className="h-5 w-5" />
                            </button>
                          ) : (
                            <div className="flex items-center text-green-600">
                              <CheckCircleIcon className="h-5 w-5 mr-1" />
                              <span className="font-medium text-sm">Sélection validée</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Enhanced modal for out-of-stock products */}
                  {showOutOfStockProducts && (
                    <Dialog
                      as="div"
                      className="fixed inset-0 z-[100] overflow-y-auto"
                      open={showOutOfStockProducts}
                      onClose={() => setShowOutOfStockProducts(false)}
                    >
                      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-900/20 transition-opacity" />
                        
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="relative inline-block transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl"
                        >
                          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 rounded-full bg-white/20 p-2 mr-3">
                                  <PlusIcon className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-lg font-medium text-white">
                                  Ajouter un produit à la commande
                                </h3>
                              </div>
                              <button
                                type="button"
                                className="rounded-md bg-white/20 p-1.5 text-white hover:bg-white/30"
                                onClick={() => setShowOutOfStockProducts(false)}
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[70vh] overflow-y-auto">
                            {/* Improved message about special order products */}
                            <div className="flex items-center bg-blue-50 p-3 rounded-lg mb-3">
                              <div className="h-8 w-8 flex-shrink-0 rounded-full bg-blue-100 p-1 flex items-center justify-center mr-3">
                                <InformationCircleIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-blue-800">
                                  Commande spéciale
                                </p>
                                <p className="text-sm text-blue-700 mt-0.5">
                                  Ces produits seront commandés directement auprès du fournisseur pour votre installation.
                                </p>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  type="text"
                                  value={outOfStockSearchQuery}
                                  onChange={(e) => setOutOfStockSearchQuery(e.target.value)}
                                  className="block w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
                                  placeholder="Rechercher par référence, nom ou description..."
                                />
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              {(() => {
                                // Show only out-of-stock products that aren't already selected
                                const outOfStockProducts = products.filter(p => 
                                  (!p.stock || p.stock.stockDisponible === 0) &&
                                  !selectedProducts.some(sp => sp.id === p.id) &&
                                  (outOfStockSearchQuery === "" || 
                                  p.reference.toLowerCase().includes(outOfStockSearchQuery.toLowerCase()) ||
                                  p.libelle.toLowerCase().includes(outOfStockSearchQuery.toLowerCase()) ||
                                  (p.description || "").toLowerCase().includes(outOfStockSearchQuery.toLowerCase()))
                                );
                                
                                // Add some sample products for demo purposes if there are none out of stock
                                let displayProducts = outOfStockProducts;
                                if (displayProducts.length === 0 && !outOfStockSearchQuery) {
                                  // Add P006 from sample data which is out of stock
                                  const sampleOutOfStock = products.find(p => p.id === "P006");
                                  if (sampleOutOfStock && !selectedProducts.some(sp => sp.id === sampleOutOfStock.id)) {
                                    displayProducts = [sampleOutOfStock];
                                  }
                                }
                                
                                return displayProducts.length === 0 ? (
                                  <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                                    <DocumentTextIcon className="h-12 w-12 text-gray-400 mb-2" />
                                    <p className="text-gray-500 text-center">Aucun produit hors stock ne correspond à votre recherche</p>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {displayProducts.map((product) => (
                                      <button 
                                        key={product.id}
                                        className="text-left flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
                                        onClick={() => {
                                          setSelectedProducts([...selectedProducts, product]);
                                          setShowOutOfStockProducts(false);
                                        }}
                                      >
                                        <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-blue-100 p-2 flex items-center justify-center mr-3">
                                          {product.categorie === "ACCESSOIRE" ? (
                                            <WrenchScrewdriverIcon className="h-6 w-6 text-blue-600" />
                                          ) : (
                                            <CubeIcon className="h-6 w-6 text-blue-600" />
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                                            {product.libelle || product.reference}
                                          </h4>
                                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                            {product.description || `Référence: ${product.reference}`}
                                          </p>
                                          <div className="flex items-center mt-1">
                                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                                              Sur commande
                                            </span>
                                            <span className="inline-flex items-center ml-2 text-xs text-gray-500">
                                              <TagIcon className="h-3 w-3 mr-1" />
                                              {product.categorie}
                                            </span>
                                            {product.marque && (
                                              <span className="inline-flex items-center ml-2 text-xs text-gray-500">
                                                <BuildingOfficeIcon className="h-3 w-3 mr-1" />
                                                {product.marque}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="ml-4 inline-flex items-center justify-center p-2 border border-transparent rounded-full text-blue-600 hover:bg-blue-100">
                                          <PlusIcon className="h-5 w-5" />
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 px-4 py-3 flex flex-row-reverse sm:px-6">
                            <button
                              type="button"
                              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                              onClick={() => setShowOutOfStockProducts(false)}
                            >
                              Fermer
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    </Dialog>
                  )}
                </motion.div>
              )}
              
              {/* Step 4: Improved Final Confirmation */}
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
                  
                  {/* Confirmation summary card */}
                  <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white">
                      <h5 className="text-base font-medium">Récapitulatif de l&apos;installation</h5>
                    </div>
                    
                    {/* Summary content */}
                    <div className="divide-y divide-gray-100">
                      {/* Date and time section */}
                      <div className="p-5 flex items-start">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4">
                          <CalendarIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h6 className="text-sm font-medium text-gray-700">Date et heure d&apos;installation</h6>
                          <p className="text-sm text-gray-900 mt-1">
                            {selectedDate && new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} à {selectedTime}
                          </p>
                          <div className="flex items-center mt-2">
                            <ClockIcon className="h-4 w-4 text-blue-500 mr-1" />
                            <span className="text-xs text-blue-600">Durée estimée: 2 heures</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Installer section with enhanced UI */}
                      <div className="p-5 flex items-start">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4">
                          <UserGroupIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h6 className="text-sm font-medium text-gray-700">Installateur</h6>
                          {selectedInstaller && (() => {
                            const installer = installers.find(i => i.id === selectedInstaller);
                            if (!installer) return null;
                            
                            return (
                              <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center">
                                  <div className={`h-12 w-12 rounded-full ${installer.iconBgColor} mr-3 flex items-center justify-center border-2 border-white shadow-sm`}>
                                    <UserIcon className={`h-6 w-6 ${installer.iconColor}`} />
                                  </div>
                                  <div>
                                    <p className="text-base font-medium text-gray-800">{installer.name}</p>
                                    <div className="flex items-center mt-1">
                                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 mr-2">
                                        {installer.specialty}
                                      </span>
                                      <div className="flex items-center">
                                        <StarIcon className="h-3.5 w-3.5 text-amber-400 fill-current" />
                                        <span className="ml-1 text-xs font-medium text-gray-600">{installer.rating}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="mt-2 pt-2 border-t border-gray-200 flex items-center text-xs text-gray-500">
                                  <ClockIcon className="h-3.5 w-3.5 mr-1" />
                                  <span>Réponse moyenne en {installer.responseTime}h</span>
                                  <span className="mx-1.5">•</span>
                                  <CheckCircleIcon className="h-3.5 w-3.5 text-green-500 mr-1" />
                                  <span>{installer.installations} installations</span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                      
                      {/* Products section with improved layout */}
                      <div className="p-5">
                        <div className="flex items-center mb-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4">
                            <ShoppingBagIcon className="h-5 w-5" />
                          </div>
                          <h6 className="text-sm font-medium text-gray-700">Produits à installer</h6>
                        </div>
                        
                        {/* Main products with quantities */}
                        {selectedProducts.length > 0 && (
                          <div className="space-y-3 ml-14">
                            {selectedProducts.map(product => (
                              <div key={product.id} className="rounded-lg border border-gray-200 p-3 hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                                <div className="flex items-start">
                                  <div className="h-12 w-12 rounded-md bg-blue-100 p-2 flex items-center justify-center mr-3 flex-shrink-0">
                                    <CubeIcon className="h-6 w-6 text-blue-600" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <p className="text-sm font-medium text-gray-800">{product.libelle || product.reference}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{product.reference}</p>
                                      </div>
                                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Qté: {getProductQuantity(product.id)}
                                      </div>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                                        <TagIcon className="h-3 w-3 mr-1" />
                                        {product.categorie}
                                      </span>
                                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                                        <BuildingOfficeIcon className="h-3 w-3 mr-1" />
                                        {product.marque}
                                      </span>
                                      {product.operation && (
                                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 truncate max-w-[180px]">
                                          <DocumentTextIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                                          {product.operation.split(':')[0]}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Accessories with better visual hierarchy */}
                        {selectedAccessories.length > 0 && (
                          <div className="mt-4 ml-14">
                            <div className="flex items-center mb-2">
                              <WrenchScrewdriverIcon className="h-4 w-4 text-gray-500 mr-2" />
                              <h6 className="text-xs font-medium uppercase text-gray-500">Accessoires</h6>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {selectedAccessories.map(accessory => (
                                <div key={accessory.id} className="flex items-center p-2 rounded-lg bg-gray-50 border border-gray-200">
                                  <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0">
                                    <WrenchScrewdriverIcon className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div className="flex-1 flex items-center justify-between">
                                    <div>
                                      <span className="text-xs font-medium text-gray-800">{accessory.libelle || accessory.reference}</span>
                                      <div className="text-xs text-gray-500">Qté: {getAccessoryQuantity(accessory.id)}</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Summary totals */}
                        <div className="mt-5 pt-3 border-t border-gray-200 flex justify-between items-center ml-14">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700">Total des produits</span>
                            <span className="text-xs text-gray-500">
                              {selectedProducts.length + selectedAccessories.length} article(s), {Object.values(productQuantities).reduce((sum, qty) => sum + qty, 0) + Object.values(accessoryQuantities).reduce((sum, qty) => sum + qty, 0)} unité(s)
                            </span>
                          </div>
                          <div className="rounded-full bg-blue-100 px-3 py-1">
                            <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Address section with map link */}
                      <div className="p-5 flex items-start">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4">
                          <MapPinIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h6 className="text-sm font-medium text-gray-700">Adresse d&apos;installation</h6>
                          <p className="text-sm text-gray-900 mt-1">{clientAddress}</p>
                          <button className="mt-2 inline-flex items-center text-xs text-blue-600 hover:text-blue-800">
                            <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                            Voir sur la carte
                          </button>
                        </div>
                      </div>
                      
                      {/* Notes section if any */}
                      {installationNotes && (
                        <div className="p-5">
                          <div className="flex items-center mb-2">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4">
                              <DocumentTextIcon className="h-5 w-5" />
                            </div>
                            <h6 className="text-sm font-medium text-gray-700">Notes d&apos;installation</h6>
                          </div>
                          <div className="ml-14 rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <p className="whitespace-pre-line text-sm text-gray-700">{installationNotes}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Attached files section if any */}
                      {attachedFiles.length > 0 && (
                        <div className="p-5">
                          <div className="flex items-center mb-2">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4">
                              <DocumentTextIcon className="h-5 w-5" />
                            </div>
                            <h6 className="text-sm font-medium text-gray-700">Pièces jointes</h6>
                          </div>
                          <div className="ml-14">
                            <ul className="space-y-2">
                              {attachedFiles.map((file, index) => (
                                <li key={index} className="flex items-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                                  <DocumentTextIcon className="h-5 w-5 text-gray-500 mr-2" />
                                  <span className="text-sm text-gray-800 flex-1">{file.name}</span>
                                  <span className="text-xs text-gray-500">{Math.round(file.size / 1024)} KB</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Enhanced confirmation notice */}
                  <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 text-blue-800 shadow-sm">
                    <div className="flex">
                      <InformationCircleIcon className="h-6 w-6 flex-shrink-0 mr-3 text-blue-500" />
                      <div>
                        <p className="text-sm font-semibold text-blue-800">Prêt à confirmer l&apos;installation</p>
                        <p className="mt-1 text-sm text-blue-700">
                          Une fois confirmée, cette installation sera programmée et le statut du dossier passera automatiquement à &quot;En cours&quot;. Un email de confirmation sera envoyé au client et à l&apos;installateur.
                        </p>
                        
                        <div className="mt-3 flex items-center text-xs text-blue-700">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-2">
                            <CheckIcon className="h-3 w-3" />
                          </div>
                          <span>Le client sera notifié par email</span>
                          
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 mx-2 ml-4">
                            <CheckIcon className="h-3 w-3" />
                          </div>
                          <span>L&apos;installateur recevra les détails de l&apos;intervention</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Large confirmation button for mobile-friendly experience */}
                  <div className="mt-6 sm:hidden">
                    <button
                      type="button"
                      onClick={handleInstallSubmit}
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium shadow-md hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="mr-2 h-5 w-5" />
                          Confirmer l&apos;installation
                        </>
                      )}
                    </button>
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
          if (selectedProducts.length > 0) {
            if (!orderReserved) {
              handleProductSubmit();
            }
            // Always proceed to next step if products are selected
            setCurrentStep(4);
          }
        } else {
          handleInstallSubmit();
        }
      }}
      disabled={
        isSubmitting ||
        (currentStep === 1 && (!selectedDate || !selectedTime)) ||
        (currentStep === 2 && !selectedInstaller) ||
        (currentStep === 3 && selectedProducts.length === 0)
      }
      className={`inline-flex w-full items-center justify-center rounded-lg px-6 py-3 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto ${
        (currentStep === 1 && (!selectedDate || !selectedTime)) ||
        (currentStep === 2 && !selectedInstaller) ||
        (currentStep === 3 && selectedProducts.length === 0) ||
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
      ) : currentStep === 3 ? (
        orderReserved ? "Continuer" : "Continuer"
      ) : (
        "Confirmer l'installation"
      )}
    </button>
  </div>
</div>
</motion.div>
</Modal>
{/* Render the cart review modal */}
<CartReviewModal />
</Dialog>
</div>
);
};
export default EnhancedInstallationModal;