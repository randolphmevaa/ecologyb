"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  DocumentArrowDownIcon,
  PlusIcon,
  XMarkIcon,
  CubeIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ListBulletIcon,
  TableCellsIcon,
  ExclamationTriangleIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  ArrowSmallUpIcon,
  ArrowSmallDownIcon,
  ArchiveBoxIcon,
  TruckIcon,
  // BanknotesIcon,
  // LightningBoltIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { FaBolt } from "react-icons/fa6";

// Product Details interface
interface ProductDetails {
  classe?: string;
  efficaciteEnergetique?: string;
  temperaturePAC?: string;
  temperaturePACType?: string;
  classeRegulateur?: string;
  cop?: string;
  scop?: string;
  temperatureEau?: string;
  temperatureArret?: string;
  puissanceNominale?: string;
  labelFlameVerte?: string;
  typeAppareil?: string;
  utilisant?: string;
  typeInstallationBallon?: string;
  profilSousTirage?: string;
  productiviteCapteur?: string;
  capaciteStockage?: string;
  surfaceCapteurs?: string;
  certificationCapteurs?: string;
  capteursHybrides?: string;
  // Standard kWh Cumac for all operations
  kwhCumac?: string;
  // Fields for BAR-TH-113
  chaudiereOperationMode?: string;
}

// Stock information interface
interface StockInfo {
  stockTotal: number;
  stockDisponible: number;
  stockReserve: number;
  stockMinimum: number;
  stockAlerte: number;
  emplacement?: string;
  dateDerniereReception?: string;
  codeBarres?: string;
}

// Order Information interface
interface OrderInfo {
  isOrderItem: boolean;
  orderId?: string;
  statusCommande?: 'en attente' | 'confirmé' | 'en préparation' | 'expédié' | 'installé';
  dateCommande?: string;
  datePreparation?: string;
  dateLivraison?: string;
  notes?: string;
  isPACAccessoire?: boolean;
  relatedProductId?: string;
}

// Product interface
interface Product {
  id: string;
  reference: string;
  description: string;
  libelle: string;
  quantite: number;
  prixTTC: number;
  categorie: string;
  tva: string;
  marque: string;
  unite: string;
  operation: string;
  details: ProductDetails;
  imageUrl?: string;
  stock?: StockInfo;
  orderInfo?: OrderInfo;
  isDevisItem: boolean;
}

// Form state interface
interface ProductForm {
  id: string;
  reference: string;
  description: string;
  libelle: string;
  quantite: string; // Form fields are strings
  prixTTC: string;  // Form fields are strings
  categorie: string;
  tva: string;
  marque: string;
  unite: string;
  operation: string;
  details: ProductDetails;
  imageUrl?: string;
  stock?: StockInfo;
  orderInfo?: OrderInfo;
  isDevisItem: boolean;
}

// Sample brands
const SAMPLE_BRANDS = [
  { id: "B001", name: "EcoTherm" },
  { id: "B002", name: "Clim+" },
  { id: "B003", name: "BoisEco" },
  { id: "B004", name: "AquaTherm" },
  { id: "B005", name: "SolarPlus" },
  { id: "B006", name: "BiomasseTech" }
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
const SAMPLE_PRODUCTS: Product[] = [
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
    isDevisItem: true
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
    }
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
    }
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
    isDevisItem: true
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
    }
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
    }
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
    isDevisItem: true
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
    }
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
    }
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
    }
  }
];

export default function ProduitsPage() {
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedOperation, setSelectedOperation] = useState<string>("");
  
  // Products state
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // State for file uploads
  const [, setProductImage] = useState<File | null>(null);
  
  // Tab state - changed default to "commande" per requirement
  const [activeTab, setActiveTab] = useState<"commande" | "devis">("commande");
  
  // View mode state for Produit Commande
  const [commandeViewMode, setCommandeViewMode] = useState<"all" | "accessoires">("all");
  
  // Sorting state
  const [sortField, setSortField] = useState<string>("reference");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Add to command state
  // const [showAddToCommandeModal, setShowAddToCommandeModal] = useState(false);

  // Form state
  const [produitForm, setProduitForm] = useState<ProductForm>({
    id: "",
    reference: "",
    description: "",
    libelle: "",
    quantite: "",
    prixTTC: "",
    categorie: "",
    tva: "",
    marque: "",
    unite: "",
    operation: "",
    imageUrl: "",
    isDevisItem: true,
    details: {
      classe: "",
      efficaciteEnergetique: "",
      temperaturePAC: "",
      classeRegulateur: "",
      cop: "",
      scop: "",
      temperatureEau: "",
      temperatureArret: "",
      puissanceNominale: "",
      labelFlameVerte: "",
      typeAppareil: "",
      utilisant: "",
      typeInstallationBallon: "",
      profilSousTirage: "",
      productiviteCapteur: "",
      capaciteStockage: "",
      surfaceCapteurs: "",
      certificationCapteurs: "",
      capteursHybrides: "",
      kwhCumac: ""
    },
    stock: {
      stockTotal: 0,
      stockDisponible: 0,
      stockReserve: 0,
      stockMinimum: 0,
      stockAlerte: 0
    }
  });

  // Add product to order
  const addProductToOrder = (product: Product) => {
    // Create a copy of the product with order info
    const orderProduct = {
      ...product,
      orderInfo: {
        isOrderItem: true,
        orderId: `CMD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        statusCommande: 'en attente' as const,
        dateCommande: new Date().toISOString().split('T')[0],
      }
    };

    // Update the products array
    setProducts(prevProducts => {
      const productIndex = prevProducts.findIndex(p => p.id === product.id);
      if (productIndex >= 0) {
        const updatedProducts = [...prevProducts];
        updatedProducts[productIndex] = orderProduct;
        return updatedProducts;
      }
      return [...prevProducts, orderProduct];
    });
  };

  // Add accessory to order
  const addAccessoryToOrder = (product: Product, mainProductId: string) => {
    // Create a copy of the product with order info and PAC accessory flag
    const accessoryProduct = {
      ...product,
      orderInfo: {
        isOrderItem: true,
        orderId: `CMD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        statusCommande: 'en attente' as const,
        dateCommande: new Date().toISOString().split('T')[0],
        isPACAccessoire: true,
        relatedProductId: mainProductId
      }
    };

    // Update the products array
    setProducts(prevProducts => {
      const productIndex = prevProducts.findIndex(p => p.id === product.id);
      if (productIndex >= 0) {
        const updatedProducts = [...prevProducts];
        updatedProducts[productIndex] = accessoryProduct;
        return updatedProducts;
      }
      return [...prevProducts, accessoryProduct];
    });
  };

  // Handle sorting
const handleSort = (field: string) => {
  if (sortField === field) {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  } else {
    setSortField(field);
    setSortDirection("asc");
  }
};

// Get sorted products with proper typing
const getSortedProducts = (productsToSort: Product[]) => {
  return [...productsToSort].sort((a, b) => {
    // Special handling for nested properties
    if (sortField === "stock.stockDisponible") {
      const aValue = a.stock?.stockDisponible ?? 0;
      const bValue = b.stock?.stockDisponible ?? 0;
      
      return sortDirection === "asc" 
        ? (aValue > bValue ? 1 : -1)
        : (aValue < bValue ? 1 : -1);
    }
    
    // Extract property value with proper type handling
    const aValue = a[sortField as keyof Product];
    const bValue = b[sortField as keyof Product];
    
    // Handle null or undefined values
    if (aValue === null || aValue === undefined) return sortDirection === "asc" ? -1 : 1;
    if (bValue === null || bValue === undefined) return sortDirection === "asc" ? 1 : -1;
    
    // Compare string values
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    // Compare number values
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" 
        ? (aValue > bValue ? 1 : -1)
        : (aValue < bValue ? 1 : -1);
    }
    
    // Compare boolean values
    if (typeof aValue === "boolean" && typeof bValue === "boolean") {
      return sortDirection === "asc"
        ? (aValue === bValue ? 0 : aValue ? 1 : -1)
        : (aValue === bValue ? 0 : aValue ? -1 : 1);
    }
    
    // For complex objects, convert to string and compare
    // This is a fallback for unexpected property types
    const aStr = String(aValue);
    const bStr = String(bValue);
    return sortDirection === "asc"
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });
};

  // File upload handler
  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductImage(e.target.files[0]);
      // For demo purposes, we'll create a fake URL (in production, you'd upload to a server)
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setProduitForm({
        ...produitForm,
        imageUrl: imageUrl
      });
    }
  };

  // Edit handler
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setProduitForm({
      id: product.id,
      reference: product.reference,
      description: product.description,
      libelle: product.libelle,
      quantite: String(product.quantite), // Convert number to string for form
      prixTTC: String(product.prixTTC),   // Convert number to string for form
      categorie: product.categorie,
      tva: product.tva,
      marque: product.marque,
      unite: product.unite,
      operation: product.operation,
      imageUrl: product.imageUrl,
      isDevisItem: product.isDevisItem,
      details: product.details || {},
      stock: product.stock || {
        stockTotal: 0,
        stockDisponible: 0,
        stockReserve: 0,
        stockMinimum: 0,
        stockAlerte: 0
      },
      orderInfo: product.orderInfo
    });
    setSelectedOperation(product.operation);
    setViewMode("form");
  };

  // Delete handler
  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  // Remove from order handler
  const handleRemoveFromOrder = (id: string) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === id ? { ...product, orderInfo: undefined } : product
      )
    );
  };

  // Add new product handler
  const handleAddNewProduct = () => {
    setSelectedProduct(null);
    setProduitForm({
      id: `P${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      reference: "",
      description: "",
      libelle: "",
      quantite: "",
      prixTTC: "",
      categorie: "",
      tva: "",
      marque: "",
      unite: "",
      operation: "",
      imageUrl: "",
      isDevisItem: activeTab === "devis",
      details: {
        kwhCumac: ""
      },
      stock: {
        stockTotal: 0,
        stockDisponible: 0,
        stockReserve: 0,
        stockMinimum: 0,
        stockAlerte: 0
      }
    });
    setSelectedOperation("");
    setViewMode("form");
  };

  // Save handler
  const handleSaveProduct = () => {
    const productToSave: Product = {
      id: produitForm.id,
      reference: produitForm.reference,
      description: produitForm.description,
      libelle: produitForm.libelle,
      quantite: Number(produitForm.quantite), // Convert string to number
      prixTTC: Number(produitForm.prixTTC),   // Convert string to number
      categorie: produitForm.categorie,
      tva: produitForm.tva,
      marque: produitForm.marque,
      unite: produitForm.unite,
      operation: selectedOperation,
      details: { ...produitForm.details },
      imageUrl: produitForm.imageUrl,
      isDevisItem: produitForm.isDevisItem,
      stock: produitForm.stock,
      orderInfo: produitForm.orderInfo
    };

    if (selectedProduct) {
      // Update existing product
      setProducts(products.map(p => p.id === productToSave.id ? productToSave : p));
    } else {
      // Add new product
      setProducts([...products, productToSave]);
    }
    setViewMode("list");
  };

  // Handle operation selection
  const handleOperationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOperation(e.target.value);
  };

  // Form change handlers
  const handleProduitChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduitForm({
      ...produitForm,
      [name]: value
    });
  };

  // Handle product details changes
  const handleProduitDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduitForm({
      ...produitForm,
      details: {
        ...produitForm.details,
        [name]: value
      }
    });
  };

  // Handle stock information changes
  // const handleStockInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   const numValue = name === "emplacement" || name === "dateDerniereReception" || name === "codeBarres" 
  //     ? value 
  //     : Number(value);
      
  //   setProduitForm({
  //     ...produitForm,
  //     stock: {
  //       ...produitForm.stock!,
  //       [name]: numValue
  //     }
  //   });
  // };

  // Handle order information changes
  // const handleOrderInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target;
  //   setProduitForm({
  //     ...produitForm,
  //     orderInfo: {
  //       ...produitForm.orderInfo!,
  //       [name]: value,
  //       isOrderItem: true
  //     }
  //   });
  // };

  // Cancel form handler
  const handleCancelForm = () => {
    setViewMode("list");
    setSelectedProduct(null);
  };

  // Get stock status color based on stock levels
  const getStockStatusColor = (stock?: StockInfo) => {
    if (!stock) return "bg-gray-300";
    
    if (stock.stockDisponible <= 0) return "bg-red-500";
    if (stock.stockDisponible <= stock.stockAlerte) return "bg-orange-500";
    if (stock.stockDisponible <= stock.stockMinimum) return "bg-yellow-400";
    return "bg-green-500";
  };

  // Get stock status text
  const getStockStatusText = (stock?: StockInfo) => {
    if (!stock) return "Non géré";
    
    if (stock.stockDisponible <= 0) return "Rupture de stock";
    if (stock.stockDisponible <= stock.stockAlerte) return "Stock critique";
    if (stock.stockDisponible <= stock.stockMinimum) return "Stock bas";
    return "En stock";
  };

  // Get stock status warning message
  const getStockWarningMessage = (stock?: StockInfo) => {
    if (!stock) return null;
    
    if (stock.stockDisponible <= 0) {
      return (
        <div className="bg-red-100 text-red-800 p-3 rounded-md flex items-center mb-4 border border-red-200">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-red-600" />
          <span className="flex-1">Rupture de stock! Consultez la <Link href="/dashboard/admin/stock" className="font-medium underline hover:text-red-700 inline-flex items-center">page stock <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-1" /></Link></span>
        </div>
      );
    }
    
    if (stock.stockDisponible <= stock.stockAlerte) {
      return (
        <div className="bg-orange-100 text-orange-800 p-3 rounded-md flex items-center mb-4 border border-orange-200">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-orange-600" />
          <span className="flex-1">Stock critique! Consultez la <Link href="/dashboard/admin/stock" className="font-medium underline hover:text-orange-700 inline-flex items-center">page stock <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-1" /></Link></span>
        </div>
      );
    }
    
    if (stock.stockDisponible <= stock.stockMinimum) {
      return (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md flex items-center mb-4 border border-yellow-200">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-yellow-600" />
          <span className="flex-1">Stock bas! Consultez la <Link href="/dashboard/admin/stock" className="font-medium underline hover:text-yellow-700 inline-flex items-center">page stock <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-1" /></Link></span>
        </div>
      );
    }
    
    return null;
  };

  // Get order status color
  const getOrderStatusColor = (status?: string) => {
    switch(status) {
      case 'en attente': return "bg-blue-100 text-blue-800";
      case 'confirmé': return "bg-purple-100 text-purple-800";
      case 'en préparation': return "bg-yellow-100 text-yellow-800";
      case 'expédié': return "bg-green-100 text-green-800";
      case 'installé': return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get order status icon
  const getOrderStatusIcon = (status?: string) => {
    switch(status) {
      case 'en attente':
        return <ClockIcon className="h-4 w-4" />;
      case 'confirmé':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'en préparation':
        return <CubeIcon className="h-4 w-4" />;
      case 'expédié':
        return <TruckIcon className="h-4 w-4" />;
      case 'installé':
        return <CheckBadgeIcon className="h-4 w-4" />;
      default:
        return <QuestionMarkCircleIcon className="h-4 w-4" />;
    }
  };

  // Filtered products based on search term and active tab
  const filteredProducts = products.filter(product => {
    const matchesSearchTerm = 
      product.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.libelle.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "commande") {
      if (commandeViewMode === "accessoires") {
        return matchesSearchTerm && 
               product.orderInfo?.isOrderItem && 
               product.orderInfo?.isPACAccessoire === true;
      } else {
        return matchesSearchTerm && 
               (product.orderInfo?.isOrderItem || product.isDevisItem);
      }
    } else { // devis tab
      return matchesSearchTerm && product.isDevisItem;
    }
  });

  // Sorted and filtered products
  const sortedAndFilteredProducts = getSortedProducts(filteredProducts);

  // Get all products for a main product
  const getAccessoriesForProduct = (productId: string) => {
    return products.filter(p => 
      p.orderInfo?.isPACAccessoire && 
      p.orderInfo.relatedProductId === productId
    );
  };

  // Function to render kWh Cumac input for all operation details
  const renderKwhCumacInput = () => {
    return (
      <div className="space-y-2 mt-4 border-t pt-4">
        <label className="block text-sm font-medium text-[#213f5b] mb-1">kWh Cumac standard</label>
        <input 
          type="text"
          name="kwhCumac" 
          value={produitForm.details.kwhCumac || ""} 
          onChange={handleProduitDetailsChange}
          className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
          placeholder="Entrez la valeur kWh Cumac standard"
        />
      </div>
    );
  };

  // Render operation-specific details
  const renderOperationDetails = () => {
    switch (selectedOperation) {
      case OPERATIONS.BAR_TH_113:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">% Efficacité énerg. saisonnière</label>
              <input 
                type="text"
                name="efficaciteEnergetique" 
                value={produitForm.details.efficaciteEnergetique || ""} 
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">Puissance nominale</label>
              <input 
                type="text"
                name="puissanceNominale" 
                value={produitForm.details.puissanceNominale || ""} 
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">Chaudière opérée d&apos;une manière</label>
              <select
                name="chaudiereOperationMode"
                value={produitForm.details.chaudiereOperationMode || ""}
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              >
                <option value="">Sélectionner</option>
                <option value="Automatique">Automatique</option>
                <option value="Semi-automatique">Semi-automatique</option>
                <option value="Manuelle">Manuelle</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">L&apos;appareil possède-t-il le label flamme verte 7*?</label>
              <select
                name="labelFlameVerte"
                value={produitForm.details.labelFlameVerte || ""}
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              >
                <option value="">Sélectionner</option>
                <option value="OUI">OUI</option>
                <option value="NON">NON</option>
              </select>
            </div>
            
            {/* Add kWh Cumac input */}
            {renderKwhCumacInput()}
          </div>
        );
        
      case OPERATIONS.BAR_TH_171:
        return (
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#213f5b] mb-1">Classe</label>
                <input 
                  type="text"
                  name="classe" 
                  value={produitForm.details.classe || ""} 
                  onChange={handleProduitDetailsChange}
                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#213f5b] mb-1">% Efficacité énerg. saisonnière</label>
                <input 
                  type="text"
                  name="efficaciteEnergetique" 
                  value={produitForm.details.efficaciteEnergetique || ""} 
                  onChange={handleProduitDetailsChange}
                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#213f5b] mb-1">T° PAC</label>
                <input 
                  type="text"
                  name="temperaturePAC" 
                  value={produitForm.details.temperaturePAC || ""} 
                  onChange={handleProduitDetailsChange}
                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#213f5b] mb-1">Classe du régulateur</label>
                <input 
                  type="text"
                  name="classeRegulateur" 
                  value={produitForm.details.classeRegulateur || ""} 
                  onChange={handleProduitDetailsChange}
                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                />
              </div>
            </div>
            
            {/* Add new dropdown for PAC temperature type */}
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">Type de T° PAC</label>
              <select
                name="temperaturePACType"
                value={produitForm.details.temperaturePACType || ""}
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              >
                <option value="">Sélectionner</option>
                <option value="Basse Température">Basse Température</option>
                <option value="Moyenne Température">Moyenne Température</option>
                <option value="Haute Température">Haute Température</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#213f5b] mb-1">COP</label>
                <input 
                  type="text"
                  name="cop" 
                  value={produitForm.details.cop || ""} 
                  onChange={handleProduitDetailsChange}
                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#213f5b] mb-1">SCOP</label>
                <input 
                  type="text"
                  name="scop" 
                  value={produitForm.details.scop || ""} 
                  onChange={handleProduitDetailsChange}
                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#213f5b] mb-1">La temperature d&apos;eau</label>
                <input 
                  type="text"
                  name="temperatureEau" 
                  value={produitForm.details.temperatureEau || ""} 
                  onChange={handleProduitDetailsChange}
                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#213f5b] mb-1">La temperature d&apos;arrêt</label>
                <input 
                  type="text"
                  name="temperatureArret" 
                  value={produitForm.details.temperatureArret || ""} 
                  onChange={handleProduitDetailsChange}
                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                />
              </div>
            </div>
            
            {/* Add kWh Cumac input */}
            {renderKwhCumacInput()}
          </div>
        );
        
      case OPERATIONS.BAR_TH_129:
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#213f5b] mb-1">COP</label>
                <input 
                  type="text"
                  name="cop" 
                  value={produitForm.details.cop || ""} 
                  onChange={handleProduitDetailsChange}
                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#213f5b] mb-1">SCOP</label>
                <input 
                  type="text"
                  name="scop" 
                  value={produitForm.details.scop || ""} 
                  onChange={handleProduitDetailsChange}
                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">Puissance nominale</label>
              <input 
                type="text"
                name="puissanceNominale" 
                value={produitForm.details.puissanceNominale || ""} 
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              />
            </div>
            
            {/* Add kWh Cumac input */}
            {renderKwhCumacInput()}
          </>
        );
        
      case OPERATIONS.BAR_TH_112:
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">L&apos;appareil possède-t-il le label flame verte 7*?</label>
              <select
                name="labelFlameVerte"
                value={produitForm.details.labelFlameVerte || ""}
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              >
                <option value="">Sélectionner</option>
                <option value="OUI">OUI</option>
                <option value="NON">NON</option>
              </select>
            </div>
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">Type d&apos;appareil</label>
              <select
                name="typeAppareil"
                value={produitForm.details.typeAppareil || ""}
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              >
                <option value="">Sélectionner</option>
                <option value="PEOLE">PEOLE</option>
                <option value="INSERT">INSERT</option>
                <option value="CUISINIERE">CUISINIERE</option>
                <option value="AUTRES">AUTRES</option>
              </select>
            </div>
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">Utilisant</label>
              <select
                name="utilisant"
                value={produitForm.details.utilisant || ""}
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              >
                <option value="">Sélectionner</option>
                <option value="Buches de bois">Buches de bois</option>
                <option value="granules de bois">Granules de bois</option>
              </select>
            </div>
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">Efficacité énergétique saisonnière (Etas)</label>
              <input 
                type="text"
                name="efficaciteEnergetique" 
                value={produitForm.details.efficaciteEnergetique || ""} 
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              />
            </div>
            
            {/* Add kWh Cumac input */}
            {renderKwhCumacInput()}
          </>
        );
        
      case OPERATIONS.BAR_TH_148:
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#213f5b] mb-1">COP</label>
                <input 
                  type="text"
                  name="cop" 
                  value={produitForm.details.cop || ""} 
                  onChange={handleProduitDetailsChange}
                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#213f5b] mb-1">SCOP</label>
                <input 
                  type="text"
                  name="scop" 
                  value={produitForm.details.scop || ""} 
                  onChange={handleProduitDetailsChange}
                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">Type d&apos;installation ballon</label>
              <select
                name="typeInstallationBallon"
                value={produitForm.details.typeInstallationBallon || ""}
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              >
                <option value="">Sélectionner</option>
                <option value="AUTRES TYPES D'INSTALLATION">AUTRES TYPES D&apos;INSTALLATION</option>
                <option value="SUR AIR EXTRAIT">SUR AIR EXTRAIT</option>
                <option value="SUR AIR AMBIANT">SUR AIR AMBIANT</option>
              </select>
            </div>
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">Profil de sous tirage</label>
              <select
                name="profilSousTirage"
                value={produitForm.details.profilSousTirage || ""}
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              >
                <option value="">Sélectionner</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">Efficacité énergetique saisonnière</label>
              <input 
                type="text"
                name="efficaciteEnergetique" 
                value={produitForm.details.efficaciteEnergetique || ""} 
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              />
            </div>
            
            {/* Add kWh Cumac input */}
            {renderKwhCumacInput()}
          </>
        );
        
      case OPERATIONS.BAR_TH_143:
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">Productivité capteur</label>
              <input 
                type="text"
                name="productiviteCapteur" 
                value={produitForm.details.productiviteCapteur || ""} 
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              />
            </div>
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">Capacité de stockage du ou des ballon d&apos;eau chaude solaires (litre)</label>
              <input 
                type="text"
                name="capaciteStockage" 
                value={produitForm.details.capaciteStockage || ""} 
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              />
            </div>
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">Surface hors tout de capteurs installés</label>
              <input 
                type="text"
                name="surfaceCapteurs" 
                value={produitForm.details.surfaceCapteurs || ""} 
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              />
            </div>
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">Certification capteurs solaires ?</label>
              <select
                name="certificationCapteurs"
                value={produitForm.details.certificationCapteurs || ""}
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              >
                <option value="">Sélectionner</option>
                <option value="OUI">OUI</option>
                <option value="NON">NON</option>
              </select>
            </div>
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">Capteurs solaires hybrides ?</label>
              <select
                name="capteursHybrides"
                value={produitForm.details.capteursHybrides || ""}
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              >
                <option value="">Sélectionner</option>
                <option value="OUI">OUI</option>
                <option value="NON">NON</option>
              </select>
            </div>
            
            {/* Add kWh Cumac input */}
            {renderKwhCumacInput()}
          </>
        );
        
      case OPERATIONS.BAR_TH_101:
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">Capacité de stockage du ballon d&apos;eau chaide solaire (litres)*</label>
              <input 
                type="text"
                name="capaciteStockage" 
                value={produitForm.details.capaciteStockage || ""} 
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              />
            </div>
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">Si la capacité de stockage du ballon d&apos;eau chaude solaire est inférieur ou égale à 500 litres, classe d&apos;efficacité énergetique du ballon d&apos;eau chaude solaire*</label>
              <input 
                type="text"
                name="efficaciteEnergetique" 
                value={produitForm.details.efficaciteEnergetique || ""} 
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              />
            </div>
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">Surface hors-tout totale de capteurs solaires vitrés thermque installés (m²)*</label>
              <input 
                type="text"
                name="surfaceCapteurs" 
                value={produitForm.details.surfaceCapteurs || ""} 
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              />
            </div>
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">Les capteurs solaires ont une certification CSTBat ou Solar Keymark ou équivalente</label>
              <select
                name="certificationCapteurs"
                value={produitForm.details.certificationCapteurs || ""}
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              >
                <option value="">Sélectionner</option>
                <option value="OUI">OUI</option>
                <option value="NON">NON</option>
              </select>
            </div>
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">Les capteurs solaires sont des capteurs non hybrides</label>
              <select
                name="capteursHybrides"
                value={produitForm.details.capteursHybrides || ""}
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              >
                <option value="">Sélectionner</option>
                <option value="OUI">OUI</option>
                <option value="NON">NON</option>
              </select>
            </div>
            
            {/* Add kWh Cumac input */}
            {renderKwhCumacInput()}
          </>
        );
        
      default:
        return (
          <div className="flex items-center justify-center h-40 text-gray-500">
            <p>Veuillez sélectionner une opération pour afficher les détails</p>
          </div>
        );
    }
  };

  // Render stock details form
  // const renderStockDetails = () => {
  //   return (
  //     <div className="space-y-4">
  //       <div className="bg-blue-100 text-blue-800 p-3 rounded-md flex items-center mb-4 border border-blue-200">
  //         <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-blue-600" />
  //         <span className="flex-1">Les informations détaillées de stock sont disponibles dans la <Link href="/dashboard/admin/stock" className="font-medium underline hover:text-blue-700 inline-flex items-center">page stock <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-1" /></Link></span>
  //       </div>
      
  //       <div className="grid grid-cols-2 gap-4">
  //         <div className="space-y-2">
  //           <label className="block text-sm font-medium text-[#213f5b] mb-1">Stock Minimum</label>
  //           <div className="relative">
  //             <input
  //               type="number"
  //               name="stockMinimum"
  //               value={produitForm.stock?.stockMinimum || 0}
  //               onChange={handleStockInfoChange}
  //               className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
  //             />
  //             <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-xs text-[#213f5b] opacity-75">
  //               Seuil de réapprovisionnement
  //             </div>
  //           </div>
  //         </div>
          
  //         <div className="space-y-2">
  //           <label className="block text-sm font-medium text-[#213f5b] mb-1">Seuil d&apos;Alerte</label>
  //           <div className="relative">
  //             <input
  //               type="number"
  //               name="stockAlerte"
  //               value={produitForm.stock?.stockAlerte || 0}
  //               onChange={handleStockInfoChange}
  //               className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
  //             />
  //             <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-xs text-[#213f5b] opacity-75">
  //               Niveau critique
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // Render order details form
  // const renderOrderDetails = () => {
  //   return produitForm.orderInfo ? (
  //     <div className="space-y-4">
  //       <div className="space-y-2">
  //         <label className="block text-sm font-medium text-[#213f5b] mb-1">ID Commande</label>
  //         <input
  //           type="text"
  //           name="orderId"
  //           value={produitForm.orderInfo.orderId || ""}
  //           onChange={handleOrderInfoChange}
  //           className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
  //         />
  //       </div>

  //       <div className="space-y-2">
  //         <label className="block text-sm font-medium text-[#213f5b] mb-1">Statut de la Commande</label>
  //         <select
  //           name="statusCommande"
  //           value={produitForm.orderInfo.statusCommande || ""}
  //           onChange={handleOrderInfoChange}
  //           className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
  //         >
  //           <option value="">Sélectionner un statut</option>
  //           <option value="en attente">En attente</option>
  //           <option value="confirmé">Confirmé</option>
  //           <option value="en préparation">En préparation</option>
  //           <option value="expédié">Expédié</option>
  //           <option value="installé">Installé</option>
  //         </select>
  //       </div>

  //       <div className="grid grid-cols-3 gap-4">
  //         <div className="space-y-2">
  //           <label className="block text-sm font-medium text-[#213f5b] mb-1">Date Commande</label>
  //           <input
  //             type="date"
  //             name="dateCommande"
  //             value={produitForm.orderInfo.dateCommande || ""}
  //             onChange={handleOrderInfoChange}
  //             className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
  //           />
  //         </div>
  //         <div className="space-y-2">
  //           <label className="block text-sm font-medium text-[#213f5b] mb-1">Date Préparation</label>
  //           <input
  //             type="date"
  //             name="datePreparation"
  //             value={produitForm.orderInfo.datePreparation || ""}
  //             onChange={handleOrderInfoChange}
  //             className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
  //           />
  //         </div>
  //         <div className="space-y-2">
  //           <label className="block text-sm font-medium text-[#213f5b] mb-1">Date Livraison</label>
  //           <input
  //             type="date"
  //             name="dateLivraison"
  //             value={produitForm.orderInfo.dateLivraison || ""}
  //             onChange={handleOrderInfoChange}
  //             className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
  //           />
  //         </div>
  //       </div>

  //       <div className="space-y-2">
  //         <div className="flex items-center gap-2">
  //           <input
  //             type="checkbox"
  //             id="isPACAccessoire"
  //             name="isPACAccessoire"
  //             checked={produitForm.orderInfo.isPACAccessoire || false}
  //             onChange={(e) => {
  //               setProduitForm({
  //                 ...produitForm,
  //                 orderInfo: {
  //                   ...produitForm.orderInfo!,
  //                   isPACAccessoire: e.target.checked
  //                 }
  //               });
  //             }}
  //             className="h-4 w-4 text-[#213f5b] rounded border-[#bfddf9] focus:ring-[#213f5b]"
  //           />
  //           <label htmlFor="isPACAccessoire" className="text-sm font-medium text-[#213f5b]">
  //             Accessoire PAC
  //           </label>
  //         </div>
  //       </div>

  //       {produitForm.orderInfo.isPACAccessoire && (
  //         <div className="space-y-2">
  //           <label className="block text-sm font-medium text-[#213f5b] mb-1">Produit Principal Associé</label>
  //           <select
  //             name="relatedProductId"
  //             value={produitForm.orderInfo.relatedProductId || ""}
  //             onChange={handleOrderInfoChange}
  //             className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
  //           >
  //             <option value="">Sélectionner un produit principal</option>
  //             {products
  //               .filter(p => p.categorie !== "ACCESSOIRE" && 
  //                      (!p.orderInfo?.isPACAccessoire) && 
  //                      p.orderInfo?.isOrderItem)
  //               .map(p => (
  //                 <option key={p.id} value={p.id}>{p.libelle || p.reference}</option>
  //               ))
  //             }
  //           </select>
  //         </div>
  //       )}

  //       <div className="space-y-2">
  //         <label className="block text-sm font-medium text-[#213f5b] mb-1">Notes</label>
  //         <textarea
  //           name="notes"
  //           value={produitForm.orderInfo.notes || ""}
  //           onChange={handleOrderInfoChange}
  //           rows={3}
  //           className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
  //           placeholder="Informations supplémentaires..."
  //         />
  //       </div>
  //     </div>
  //   ) : (
  //     <div className="flex flex-col items-center justify-center h-40 text-gray-500">
  //       <button
  //         onClick={() => {
  //           setProduitForm({
  //             ...produitForm,
  //             orderInfo: {
  //               isOrderItem: true,
  //               orderId: `CMD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
  //               statusCommande: 'en attente',
  //               dateCommande: new Date().toISOString().split('T')[0]
  //             }
  //           });
  //         }}
  //         className="px-4 py-2 bg-[#213f5b] text-white rounded-lg hover:bg-[#152a3d]"
  //       >
  //         Ajouter aux commandes
  //       </button>
  //     </div>
  //   );
  // };

  // Import for heroicons not in the initial import list
  const ClockIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const CheckBadgeIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );

  const QuestionMarkCircleIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#f8fafc] to-[#f0f7ff]">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto px-0 sm:px-2">
            {/* Page Header */}
            <div className="mb-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                <div className="relative">
                  <div className="absolute -left-3 md:-left-5 top-1 w-1.5 h-12 bg-gradient-to-b from-[#bfddf9] to-[#d2fcb2] rounded-full"></div>
                  <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#213f5b] to-[#2c5681] mb-2 pl-2">Produits</h1>
                  <p className="text-[#213f5b] opacity-75 pl-2">Gestion des produits et équipements</p>
                  <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-[#bfddf9] opacity-10 rounded-full blur-3xl"></div>
                </div>
                
                {viewMode === "list" && (
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {/* Handle Import */}}
                      className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] transition-colors rounded-lg px-4 py-2 flex items-center"
                    >
                      <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                      Importer
                    </Button>
                    <Button
                      onClick={handleAddNewProduct}
                      className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Nouveau Produit
                    </Button>
                  </div>
                )}
                
                {viewMode === "form" && (
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelForm}
                      className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] transition-colors rounded-lg px-4 py-2 flex items-center"
                    >
                      <ChevronLeftIcon className="h-4 w-4 mr-2" />
                      Retour à la liste
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs Navigation (only in list view) */}
            {viewMode === "list" && (
              <div className="mb-6">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-4 sm:space-x-8" aria-label="Tabs">
                    <button
                      onClick={() => setActiveTab("commande")}
                      className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-lg flex items-center gap-2 ${
                        activeTab === "commande"
                          ? "border-[#213f5b] text-[#213f5b]"
                          : "border-transparent text-gray-500 hover:text-[#213f5b] hover:border-gray-300"
                      }`}
                    >
                      <ShoppingCartIcon className="h-5 w-5" />
                      Produits Commande
                      {products.some(p => 
                        p.stock && 
                        p.stock.stockDisponible <= p.stock.stockAlerte
                      ) && (
                        <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                          <ExclamationTriangleIcon className="h-3 w-3" />
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("devis")}
                      className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-lg flex items-center gap-2 ${
                        activeTab === "devis"
                          ? "border-[#213f5b] text-[#213f5b]"
                          : "border-transparent text-gray-500 hover:text-[#213f5b] hover:border-gray-300"
                      }`}
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                      Produits Devis
                    </button>
                  </nav>
                </div>
              </div>
            )}

            {/* Command Mode Switch (only in command tab) */}
            {viewMode === "list" && activeTab === "commande" && (
              <div className="mb-6">
                <div className="bg-white p-3 rounded-xl shadow-sm flex flex-wrap gap-3 border border-[#eaeaea]">
                  <button
                    onClick={() => setCommandeViewMode("all")}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      commandeViewMode === "all"
                        ? "bg-[#213f5b] text-white shadow-sm"
                        : "bg-white text-[#213f5b] border border-[#bfddf9] hover:bg-[#f0f7ff]"
                    }`}
                  >
                    <ShoppingCartIcon className="h-4 w-4" />
                    Tous les produits
                  </button>
                  <button
                    onClick={() => setCommandeViewMode("accessoires")}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      commandeViewMode === "accessoires"
                        ? "bg-[#213f5b] text-white shadow-sm"
                        : "bg-white text-[#213f5b] border border-[#bfddf9] hover:bg-[#f0f7ff]"
                    }`}
                  >
                    <FaBolt className="h-4 w-4" />
                    Accessoires PAC
                  </button>
                </div>
              </div>
            )}

            {/* Search Bar (only in list view) */}
            {viewMode === "list" && (
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-[#213f5b] opacity-50" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="search"
                    className="block w-full px-4 py-3 pl-10 text-sm text-[#213f5b] border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                    placeholder={`Rechercher des produits ${activeTab === "devis" ? "devis" : "commande"}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button 
                      className="absolute right-2.5 bottom-2.5 bg-[#bfddf9] rounded-full p-1.5 text-[#213f5b] hover:bg-[#a0c8e9] transition-all"
                      onClick={() => setSearchTerm("")}
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Products Content */}
            <AnimatePresence mode="wait">
              {viewMode === "list" && (
                <motion.div
                  key="product-list"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Stock Warnings */}
                  {activeTab === "commande" && products.some(p => 
                    p.stock && p.stock.stockDisponible <= p.stock.stockAlerte
                  ) && (
                    <div className="mb-6">
                      {products
                        .filter(p => p.stock && p.stock.stockDisponible <= p.stock.stockAlerte)
                        .slice(0, 3) // Show only the first 3 warnings to avoid clutter
                        .map(p => getStockWarningMessage(p.stock))}
                      
                      {products.filter(p => p.stock && p.stock.stockDisponible <= p.stock.stockAlerte).length > 3 && (
                        <div className="bg-blue-100 text-blue-800 p-3 rounded-md flex items-center mt-2 border border-blue-200">
                          <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span className="flex-1">
                            {products.filter(p => p.stock && p.stock.stockDisponible <= p.stock.stockAlerte).length - 3} autres produits nécessitent votre attention. Consultez la <Link href="/dashboard/admin/stock" className="font-medium underline hover:text-blue-700 inline-flex items-center">page stock <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-1" /></Link>
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sort & View Controls */}
                  <div className="mb-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-[#213f5b] font-medium">Trier par:</span>
                      <div className="inline-flex gap-2">
                        <button 
                          onClick={() => handleSort("reference")}
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-1 ${
                            sortField === "reference" 
                              ? "bg-[#213f5b] text-white" 
                              : "bg-white text-[#213f5b] border border-[#bfddf9] hover:bg-[#f0f7ff]"
                          }`}
                        >
                          Référence
                          {sortField === "reference" && (
                            sortDirection === "asc" 
                              ? <ArrowSmallUpIcon className="w-4 h-4" />
                              : <ArrowSmallDownIcon className="w-4 h-4" />
                          )}
                        </button>
                        <button 
                          onClick={() => handleSort("marque")}
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-1 ${
                            sortField === "marque" 
                              ? "bg-[#213f5b] text-white" 
                              : "bg-white text-[#213f5b] border border-[#bfddf9] hover:bg-[#f0f7ff]"
                          }`}
                        >
                          Marque
                          {sortField === "marque" && (
                            sortDirection === "asc" 
                              ? <ArrowSmallUpIcon className="w-4 h-4" />
                              : <ArrowSmallDownIcon className="w-4 h-4" />
                          )}
                        </button>
                        <button 
                          onClick={() => handleSort("prixTTC")}
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-1 ${
                            sortField === "prixTTC" 
                              ? "bg-[#213f5b] text-white" 
                              : "bg-white text-[#213f5b] border border-[#bfddf9] hover:bg-[#f0f7ff]"
                          }`}
                        >
                          Prix
                          {sortField === "prixTTC" && (
                            sortDirection === "asc" 
                              ? <ArrowSmallUpIcon className="w-4 h-4" />
                              : <ArrowSmallDownIcon className="w-4 h-4" />
                          )}
                        </button>
                        {activeTab === "commande" && (
                          <button 
                            onClick={() => handleSort("stock.stockDisponible")}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-1 ${
                              sortField === "stock.stockDisponible" 
                                ? "bg-[#213f5b] text-white" 
                                : "bg-white text-[#213f5b] border border-[#bfddf9] hover:bg-[#f0f7ff]"
                            }`}
                          >
                            Stock
                            {sortField === "stock.stockDisponible" && (
                              sortDirection === "asc" 
                                ? <ArrowSmallUpIcon className="w-4 h-4" />
                                : <ArrowSmallDownIcon className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="inline-flex rounded-md shadow-sm">
                      <button 
                        type="button" 
                        className="px-4 py-2 text-sm font-medium text-[#213f5b] bg-white border border-[#bfddf9] rounded-l-lg hover:bg-[#f0f7ff] focus:z-10 focus:outline-none"
                      >
                        <TableCellsIcon className="w-5 h-5" />
                      </button>
                      <button 
                        type="button" 
                        className="px-4 py-2 text-sm font-medium text-white bg-[#213f5b] border border-[#213f5b] rounded-r-lg hover:bg-[#152a3d] focus:z-10 focus:outline-none"
                      >
                        <ListBulletIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Products Grid Display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedAndFilteredProducts.length === 0 ? (
                      <div className="col-span-full flex flex-col items-center justify-center py-12 text-[#213f5b]">
                        <CubeIcon className="h-16 w-16 mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
                        <p className="text-sm opacity-75 mb-6">
                          {activeTab === "devis" 
                            ? "Ajoutez un nouveau produit au catalogue ou modifiez vos critères de recherche" 
                            : commandeViewMode === "accessoires"
                              ? "Aucun accessoire PAC disponible correspondant à vos critères"
                              : "Ajoutez des produits à la commande en cliquant sur le bouton ci-dessous"}
                        </p>
                        {activeTab === "commande" && commandeViewMode === "all" && (
                          <div className="flex gap-3">
                            <Button
                              onClick={handleAddNewProduct}
                              className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                            >
                              <PlusIcon className="h-4 w-4 mr-2" />
                              Nouveau Produit
                            </Button>
                            <Button
                              onClick={() => setActiveTab("devis")}
                              className="bg-white border border-[#bfddf9] text-[#213f5b] hover:bg-[#f0f7ff] transition-all rounded-lg px-5 py-2.5 flex items-center shadow-sm hover:shadow-md"
                            >
                              <ShoppingCartIcon className="h-4 w-4 mr-2" />
                              Ajouter depuis le catalogue
                            </Button>
                          </div>
                        )}
                        {activeTab === "devis" && (
                          <Button
                            onClick={handleAddNewProduct}
                            className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                          >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Nouveau Produit
                          </Button>
                        )}
                      </div>
                    ) : (
                      sortedAndFilteredProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-white rounded-xl border border-[#eaeaea] shadow-md hover:shadow-xl transition-all group overflow-hidden h-full flex flex-col"
                          whileHover={{ 
                            y: -6,
                            transition: { duration: 0.3 } 
                          }}
                        >
                          {/* Product Image Container */}
                          <div className="relative w-full h-64 overflow-hidden">
                            {/* Category Badge */}
                            <div className="absolute top-3 right-3 z-10">
                              <span className="text-xs font-medium rounded-full px-3 py-1.5 bg-[#213f5b] text-white shadow-md backdrop-blur-sm bg-opacity-80 border border-white border-opacity-30">
                                {product.categorie}
                              </span>
                            </div>
                            
                            {/* PAC Accessory Badge */}
                            {product.orderInfo?.isPACAccessoire && (
                              <div className="absolute top-3 left-3 z-10">
                                <span className="text-xs font-medium rounded-full px-3 py-1.5 bg-[#0ea5e9] text-white shadow-md backdrop-blur-sm bg-opacity-80 border border-white border-opacity-30 flex items-center gap-1">
                                  <FaBolt className="w-3 h-3" />
                                  Accessoire PAC
                                </span>
                              </div>
                            )}

                            {/* Stock Status Badge (for commandes) */}
                            {activeTab === "commande" && product.stock && (
                              <div className="absolute top-12 right-3 z-10">
                                <span className={`text-xs font-medium rounded-full px-3 py-1.5 flex items-center gap-1 shadow-md backdrop-blur-sm border border-white border-opacity-30 ${
                                  product.stock.stockDisponible <= 0
                                    ? "bg-red-500 text-white"
                                    : product.stock.stockDisponible <= product.stock.stockAlerte
                                    ? "bg-orange-500 text-white"
                                    : product.stock.stockDisponible <= product.stock.stockMinimum
                                    ? "bg-yellow-400 text-[#213f5b]"
                                    : "bg-green-500 text-white"
                                }`}>
                                  <span className={`inline-block w-2 h-2 rounded-full ${getStockStatusColor(product.stock)}`}></span>
                                  {getStockStatusText(product.stock)}
                                </span>
                              </div>
                            )}

                            {/* Image with overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#213f5b] to-[#152a3d] opacity-10"></div>
                            
                            {product.imageUrl ? (
                              <img 
                                src={product.imageUrl} 
                                alt={product.libelle || product.reference} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#f0f7ff] to-[#e6f0fd]">
                                <CubeIcon className="h-24 w-24 text-[#bfddf9]" />
                              </div>
                            )}
                            
                            {/* Brand overlay at bottom of image */}
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#000000cc] via-[#00000080] to-transparent py-4 px-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs text-[#bfddf9] font-medium mb-1">MARQUE</p>
                                  <p className="text-white font-semibold">{product.marque}</p>
                                </div>
                                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 border border-white border-opacity-30">
                                  {activeTab === "devis" ? (
                                    <DocumentTextIcon className="h-6 w-6 text-white" />
                                  ) : (
                                    <ShoppingCartIcon className="h-6 w-6 text-white" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Product Info */}
                          <div className="p-5 flex-grow">
                            <div className="mb-4">
                              <h3 className="font-bold text-[#213f5b] text-xl mb-2 leading-tight">{product.libelle || product.reference}</h3>
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="bg-[#bfddf9] bg-opacity-30 px-2.5 py-1 rounded-md font-medium text-sm text-[#213f5b]">
                                  {product.reference}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#213f5b] opacity-50"></span>
                                <span className="text-sm text-[#213f5b] opacity-75 font-medium">
                                  {product.operation ? product.operation.split(':')[0] : "ACCESSOIRE"}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-[#213f5b] opacity-75 line-clamp-2 mb-4 leading-relaxed">{product.description}</p>
                            
                            {/* Order Status (for commandes) */}
                            {activeTab === "commande" && product.orderInfo?.statusCommande && (
                              <div className={`mb-4 px-3 py-2 rounded-lg flex items-center gap-2 ${getOrderStatusColor(product.orderInfo.statusCommande)}`}>
                                {getOrderStatusIcon(product.orderInfo.statusCommande)}
                                <span className="font-medium text-sm">{product.orderInfo.statusCommande?.charAt(0).toUpperCase()}{product.orderInfo.statusCommande?.slice(1)}</span>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="bg-[#f8fafc] rounded-xl p-3.5 border border-[#eaeaea] transition-all group-hover:border-[#bfddf9] group-hover:shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-2 h-2 rounded-full bg-[#213f5b]"></div>
                                  <p className="text-xs text-[#213f5b] font-semibold">Prix TTC</p>
                                </div>
                                <p className="font-bold text-[#213f5b] text-xl ml-4">{product.prixTTC.toLocaleString()} €</p>
                                <p className="text-xs text-[#213f5b] opacity-75 mt-0.5 ml-4">TVA {product.tva}%</p>
                              </div>
                              
                              {activeTab === "devis" ? (
                                <div className="bg-[#f8fafc] rounded-xl p-3.5 border border-[#eaeaea] transition-all group-hover:border-[#bfddf9] group-hover:shadow-sm">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-[#213f5b]"></div>
                                    <p className="text-xs text-[#213f5b] font-semibold">Quantité</p>
                                  </div>
                                  <p className="font-bold text-[#213f5b] text-xl ml-4">{product.quantite}</p>
                                  <p className="text-xs text-[#213f5b] opacity-75 mt-0.5 ml-4">{product.unite}</p>
                                </div>
                              ) : (
                                <div className="bg-[#f8fafc] rounded-xl p-3.5 border border-[#eaeaea] transition-all group-hover:border-[#bfddf9] group-hover:shadow-sm">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className={`w-2 h-2 rounded-full ${getStockStatusColor(product.stock)}`}></div>
                                    <p className="text-xs text-[#213f5b] font-semibold">Stock</p>
                                  </div>
                                  <p className="font-bold text-[#213f5b] text-xl ml-4">
                                    {product.stock?.stockDisponible || 0} / {product.stock?.stockTotal || 0}
                                  </p>
                                  <p className="text-xs text-[#213f5b] opacity-75 mt-0.5 ml-4">Disponible / Total</p>
                                </div>
                              )}
                            </div>
                            
                            {/* Accessory Information */}
                            {activeTab === "commande" && product.orderInfo?.isPACAccessoire && product.orderInfo.relatedProductId && (
                              <div className="mb-4 bg-blue-50 rounded-xl p-4 border-l-4 border-blue-400 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                  <FaBolt className="h-4 w-4 text-blue-500" />
                                  <span className="text-xs text-blue-700 font-semibold">Accessoire pour</span>
                                </div>
                                <p className="font-medium text-blue-800 ml-6 text-sm">
                                  {products.find(p => p.id === product.orderInfo?.relatedProductId)?.libelle || 
                                   products.find(p => p.id === product.orderInfo?.relatedProductId)?.reference || 
                                   "Produit principal"}
                                </p>
                              </div>
                            )}
                            
                            {/* Order ID Information */}
                            {activeTab === "commande" && product.orderInfo?.orderId && (
                              <div className="mb-4 bg-[#f0f7ff] rounded-xl p-4 border-l-4 border-[#bfddf9] shadow-sm">
                                <p className="font-medium text-[#213f5b]">
                                  <span className="text-xs opacity-75">COMMANDE</span><br />
                                  {product.orderInfo.orderId}
                                </p>
                              </div>
                            )}
                            
                            {activeTab === "devis" && product.details.kwhCumac && (
                              <div className="mb-4 bg-[#f0f7ff] rounded-xl p-4 border-l-4 border-[#bfddf9] shadow-sm">
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 bg-[#bfddf9] rounded-lg">
                                    <ChevronLeftIcon className="h-3 w-3 text-[#213f5b]" />
                                  </div>
                                  <p className="text-xs text-[#213f5b] font-semibold">kWh Cumac</p>
                                </div>
                                <p className="mt-1 ml-7 font-bold text-[#213f5b] text-lg">{parseInt(product.details.kwhCumac).toLocaleString()}</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="p-4 border-t border-[#eaeaea] bg-gradient-to-b from-white to-[#f8fafc] mt-auto">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-2 h-8 rounded-full bg-[#213f5b] mr-2 opacity-20"></div>
                                <p className="text-xs text-[#213f5b] opacity-75 font-medium">Réf. {product.id}</p>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {/* Show different actions based on the tab */}
                                {activeTab === "devis" ? (
                                  <>
                                    <button 
                                      className="p-2 rounded-full text-[#213f5b] hover:bg-[#bfddf9] transition-colors hover:shadow-sm"
                                      onClick={() => handleEditProduct(product)}
                                    >
                                      <PencilIcon className="h-4 w-4" />
                                    </button>
                                    <button 
                                      className="p-2 rounded-full text-[#213f5b] hover:bg-red-100 hover:text-red-500 transition-colors hover:shadow-sm"
                                      onClick={() => handleDeleteProduct(product.id)}
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] hover:shadow-sm"
                                      onClick={() => handleEditProduct(product)}
                                    >
                                      Modifier
                                    </Button>
                                    {!product.orderInfo?.isOrderItem && (
                                      <Button
                                        size="sm"
                                        className="bg-[#213f5b] hover:bg-[#152a3d] text-white"
                                        onClick={() => addProductToOrder(product)}
                                      >
                                        <ShoppingCartIcon className="h-4 w-4 mr-1" />
                                        Commander
                                      </Button>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {product.orderInfo?.isOrderItem ? (
                                      <>
                                        <button 
                                          className="p-2 rounded-full text-[#213f5b] hover:bg-[#bfddf9] transition-colors hover:shadow-sm"
                                          onClick={() => handleEditProduct(product)}
                                        >
                                          <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button 
                                          className="p-2 rounded-full text-[#213f5b] hover:bg-red-100 hover:text-red-500 transition-colors hover:shadow-sm"
                                          onClick={() => handleRemoveFromOrder(product.id)}
                                        >
                                          <TrashIcon className="h-4 w-4" />
                                        </button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] hover:shadow-sm"
                                          onClick={() => handleEditProduct(product)}
                                        >
                                          Modifier
                                        </Button>
                                      </>
                                    ) : (
                                      <Button
                                        size="sm"
                                        className="bg-[#213f5b] hover:bg-[#152a3d] text-white"
                                        onClick={() => addProductToOrder(product)}
                                      >
                                        <ShoppingCartIcon className="h-4 w-4 mr-1" />
                                        Ajouter
                                      </Button>
                                    )}
                                    {/* Additional button for adding PAC accessory */}
                                    {!product.orderInfo?.isPACAccessoire && 
                                     product.orderInfo?.isOrderItem && 
                                     product.categorie !== "ACCESSOIRE" && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                                        onClick={() => {
                                          // Find an accessory to add
                                          const accessory = products.find(p => 
                                            p.categorie === "ACCESSOIRE" && 
                                            !getAccessoriesForProduct(product.id).some(a => a.id === p.id)
                                          );
                                          
                                          if (accessory) {
                                            addAccessoryToOrder(accessory, product.id);
                                          }
                                        }}
                                      >
                                        <FaBolt className="h-4 w-4 mr-1" />
                                        Accessoire
                                      </Button>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            
              {viewMode === "form" && (
                <motion.div
                  key="product-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Form Tabs */}
                  <div className="mb-6 bg-white rounded-lg shadow-sm border border-[#eaeaea]">
                    <div className="flex flex-wrap">
                      <button
                        className="flex-1 text-center py-3 px-4 font-medium text-[#213f5b] border-b-2 border-[#213f5b]"
                      >
                        Informations Générales
                      </button>
                      <button
                        className="flex-1 text-center py-3 px-4 font-medium text-gray-500 border-b border-gray-200 hover:text-[#213f5b]"
                      >
                        Détails Techniques
                      </button>
                      <button
                        className="flex-1 text-center py-3 px-4 font-medium text-gray-500 border-b border-gray-200 hover:text-[#213f5b]"
                      >
                        Gestion Stock
                      </button>
                      {produitForm.orderInfo?.isOrderItem && (
                        <button
                          className="flex-1 text-center py-3 px-4 font-medium text-gray-500 border-b border-gray-200 hover:text-[#213f5b]"
                        >
                          Détails Commande
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Form Content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Infos Générales */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                      <div className="bg-gradient-to-r from-white to-[#f8fafc] border-b p-6">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-1 rounded-full bg-[#213f5b]"></div>
                          <h2 className="text-xl font-bold text-[#213f5b]">
                            {selectedProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
                          </h2>
                        </div>
                        <p className="text-[#213f5b] opacity-75 ml-3 pl-3">Informations de base du produit</p>
                      </div>
                      <div className="p-6 space-y-4">
                        {/* Product Image Upload */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-[#213f5b] mb-1">Image du produit</label>
                          <div className="flex items-center gap-4">
                            {produitForm.imageUrl && (
                              <div className="w-24 h-24 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
                                <img 
                                  src={produitForm.imageUrl} 
                                  alt="Aperçu du produit" 
                                  className="max-w-full max-h-full object-contain" 
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <label className="flex flex-col items-center px-4 py-6 bg-white border border-dashed border-[#bfddf9] rounded-lg cursor-pointer hover:bg-[#f0f7ff]">
                                <svg className="w-8 h-8 text-[#213f5b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                </svg>
                                <span className="mt-2 text-sm text-[#213f5b]">Cliquez pour télécharger une image</span>
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*" 
                                  onChange={handleProductImageChange}
                                />
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="reference">Reference du produit *</label>
                          <input
                            id="reference"
                            type="text"
                            name="reference"
                            value={produitForm.reference}
                            onChange={handleProduitChange}
                            className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="description">Description *</label>
                          <textarea
                            id="description"
                            name="description"
                            value={produitForm.description}
                            onChange={handleProduitChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="libelle">Libellé</label>
                          <input
                            id="libelle"
                            type="text"
                            name="libelle"
                            value={produitForm.libelle}
                            onChange={handleProduitChange}
                            className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="quantite">Quantité *</label>
                            <input
                              id="quantite"
                              type="number"
                              name="quantite"
                              value={produitForm.quantite}
                              onChange={handleProduitChange}
                              className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="prixTTC">Prix T.T.C *</label>
                            <input
                              id="prixTTC"
                              type="number"
                              name="prixTTC"
                              value={produitForm.prixTTC}
                              onChange={handleProduitChange}
                              className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="categorie">Categorie *</label>
                          <select
                            id="categorie"
                            name="categorie"
                            value={produitForm.categorie}
                            onChange={handleProduitChange}
                            className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                          >
                            <option value="">Sélectionner une catégorie</option>
                            <option value="MONO GESTE">MONO GESTE</option>
                            <option value="RENO AMPLEUR">RENO AMPLEUR</option>
                            <option value="PANNEAUX PHOTOVOLTAIQUE">PANNEAUX PHOTOVOLTAIQUE</option>
                            <option value="FINANCEMENT">FINANCEMENT</option>
                            <option value="ACCESSOIRE">ACCESSOIRE</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="tva">TVA *</label>
                          <select
                            id="tva"
                            name="tva"
                            value={produitForm.tva}
                            onChange={handleProduitChange}
                            className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                          >
                            <option value="">Sélectionner un taux de TVA</option>
                            <option value="0">0%</option>
                            <option value="5.5">5,5%</option>
                            <option value="10">10%</option>
                            <option value="20">20%</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="marque">Marque *</label>
                          <select
                            id="marque"
                            name="marque"
                            value={produitForm.marque}
                            onChange={handleProduitChange}
                            className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                          >
                            <option value="">Sélectionner une marque</option>
                            {SAMPLE_BRANDS.map(brand => (
                              <option key={brand.id} value={brand.name}>{brand.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="unite">Unité</label>
                          <input
                            id="unite"
                            type="text"
                            name="unite"
                            value={produitForm.unite}
                            onChange={handleProduitChange}
                            className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="operation">Opération *</label>
                          <select
                            id="operation"
                            name="operation"
                            value={selectedOperation}
                            onChange={handleOperationChange}
                            className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                          >
                            <option value="">Sélectionner une opération</option>
                            {Object.entries(OPERATIONS).map(([key, value]) => (
                              <option key={key} value={value}>{value}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="isDevisItem"
                              name="isDevisItem"
                              checked={produitForm.isDevisItem}
                              onChange={(e) => setProduitForm({...produitForm, isDevisItem: e.target.checked})}
                              className="h-4 w-4 text-[#213f5b] rounded border-[#bfddf9] focus:ring-[#213f5b]"
                            />
                            <label htmlFor="isDevisItem" className="text-sm font-medium text-[#213f5b]">
                              Inclure dans le catalogue devis
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Second Column (Tabs) */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                      <div className="bg-white border-b">
                        <div className="flex">
                          <button 
                            className="py-3 px-4 border-b-2 border-[#213f5b] font-medium text-[#213f5b] flex items-center gap-1"
                          >
                            <DocumentTextIcon className="h-4 w-4" />
                            Détails
                          </button>
                          <button 
                            className="py-3 px-4 border-b border-transparent font-medium text-gray-500 hover:text-[#213f5b] hover:border-gray-300 flex items-center gap-1"
                          >
                            <ArchiveBoxIcon className="h-4 w-4" />
                            Stock
                          </button>
                          <button 
                            className="py-3 px-4 border-b border-transparent font-medium text-gray-500 hover:text-[#213f5b] hover:border-gray-300 flex items-center gap-1"
                          >
                            <ShoppingCartIcon className="h-4 w-4" />
                            Commande
                          </button>
                        </div>
                      </div>
                      <div className="p-6">
                        {/* Details Tab Content */}
                        {renderOperationDetails()}
                        
                        {/* Stock Tab Content would be shown here */}
                        {/* {renderStockDetails()} */}
                        
                        {/* Order Tab Content would be shown here */}
                        {/* {renderOrderDetails()} */}
                      </div>
                    </div>

                    {/* Submit Buttons - Full Width */}
                    <div className="md:col-span-2 flex flex-wrap justify-end gap-3 mt-4">
                      <Button
                        variant="outline"
                        className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9]"
                        onClick={handleCancelForm}
                      >
                        Annuler
                      </Button>
                      <Button
                        className="bg-[#213f5b] hover:bg-[#152a3d] text-white"
                        onClick={handleSaveProduct}
                      >
                        Enregistrer
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}