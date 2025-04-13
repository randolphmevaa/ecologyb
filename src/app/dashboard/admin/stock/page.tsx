"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { Line, Pie } from "recharts";
import { 
  MagnifyingGlassIcon, XMarkIcon, ArrowsUpDownIcon, 
  ArrowDownIcon, ArrowUpIcon, PlusIcon, 
  ArrowPathIcon, ArchiveBoxIcon, ExclamationCircleIcon, 
  CheckCircleIcon, ClockIcon, DocumentArrowDownIcon, 
  ChevronLeftIcon, ChevronRightIcon, BellAlertIcon, 
  CubeIcon, ShoppingCartIcon, TruckIcon, EyeIcon, PencilIcon
} from "@heroicons/react/24/outline";

// Define Product interface
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
  imageUrl?: string;
  details: Record<string, string | number | boolean | undefined>;
}

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

// Extended Product interface for stock functionality
interface StockProduct extends Product {
  stock: {
    current: number;
    min: number;
    ordered: number;
    reserved: number;
    incoming: number;
    lastUpdated: string;
    locations?: Array<{
      name: string;
      quantity: number;
    }>;
    history?: Array<{
      date: string;
      type: "in" | "out" | "adjustment";
      quantity: number;
      note?: string;
    }>;
  };
}

// SAMPLE DATA (Using the same data structure as your original component)
const SAMPLE_PRODUCTS = [
  // Products data from your original component
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
    operation: "BAR-TH-171 : POMPE A CHALEUR AIR/EAU",
    imageUrl: "https://images.unsplash.com/photo-1588238323099-14abfe4a6015?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: {
      classe: "A+++",
      efficaciteEnergetique: "195",
      temperaturePAC: "65°C",
      classeRegulateur: "VI",
      cop: "4.8",
      scop: "5.2",
      temperatureEau: "60°C",
      temperatureArret: "-25°C"
    }
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
    operation: "BAR-TH-129 : POMPE A CHALEUR AIR/AIR",
    imageUrl: "https://plus.unsplash.com/premium_photo-1728940153866-35e9ef596e0f?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: {
      cop: "4.1",
      scop: "4.3",
      puissanceNominale: "8kW"
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
    operation: "BAR-TH-112 : POELE A GRANULES",
    imageUrl: "https://images.unsplash.com/photo-1562408954-be39449c4962?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: {
      labelFlameVerte: "OUI",
      typeAppareil: "PEOLE",
      utilisant: "granules de bois",
      efficaciteEnergetique: "87"
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
    operation: "BAR-TH-148 : CHAUFFE EAU THERMODYNAMIQUE",
    imageUrl: "https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: {
      cop: "3.5",
      scop: "3.7",
      typeInstallationBallon: "SUR AIR AMBIANT",
      profilSousTirage: "L",
      efficaciteEnergetique: "135"
    }
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
    operation: "BAR-TH-143 : SYSTEME SOLAIRE COMBINE",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    details: {
      productiviteCapteur: "580",
      capaciteStockage: "400",
      surfaceCapteurs: "8.5",
      certificationCapteurs: "OUI",
      capteursHybrides: "NON"
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
    operation: "BAR-TH-101 : CHAUFFE EAU SOLAIRE INDIVIDUEL",
    imageUrl: "https://images.unsplash.com/photo-1622219970016-09f07c1eed36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: {
      capaciteStockage: "300",
      efficaciteEnergetique: "B",
      surfaceCapteurs: "4.5",
      certificationCapteurs: "OUI",
      capteursHybrides: "OUI"
    }
  }
];

// Generate more diverse stock data for sample products
const generateStockProducts = (): StockProduct[] => {
  const products = [...SAMPLE_PRODUCTS];
  
  // Add more products with different stock statuses
  for (let i = 0; i < 15; i++) {
    const baseProduct = products[i % products.length];
    const id = `P${(100 + i).toString().padStart(3, '0')}`;
    
    products.push({
      ...baseProduct,
      id,
      reference: `${baseProduct.reference}-${id}`,
      libelle: `${baseProduct.libelle} ${id.substring(1)}`,
    });
  }
  
  return products.map(product => {
    // Create more diverse stock situations
    const stockStatus = Math.floor(Math.random() * 5); // 0-4 for different scenarios
    
    let current: number, min: number, ordered: number, reserved: number, incoming: number;
    
    // Create different stock scenarios
    switch (stockStatus) {
      case 0: // Out of stock
        current = 0;
        min = 5 + Math.floor(Math.random() * 10);
        ordered = Math.floor(Math.random() * 20);
        reserved = 0;
        incoming = 5 + Math.floor(Math.random() * 15);
        break;
      case 1: // Low stock
        min = 5 + Math.floor(Math.random() * 10);
        current = 1 + Math.floor(Math.random() * (min - 1));
        ordered = Math.floor(Math.random() * 15);
        reserved = Math.floor(current / 2);
        incoming = 5 + Math.floor(Math.random() * 10);
        break;
      case 2: // Reserved exceeds available
        current = 5 + Math.floor(Math.random() * 10);
        min = Math.floor(current * 0.8);
        ordered = Math.floor(Math.random() * 10);
        reserved = current + 1 + Math.floor(Math.random() * 5);
        incoming = 10 + Math.floor(Math.random() * 15);
        break;
      case 3: // Good stock
        current = 15 + Math.floor(Math.random() * 30);
        min = 5 + Math.floor(Math.random() * 10);
        ordered = Math.floor(Math.random() * 15);
        reserved = Math.floor(Math.random() * (current / 2));
        incoming = Math.floor(Math.random() * 10);
        break;
      case 4: // Excess stock
        current = 40 + Math.floor(Math.random() * 60);
        min = 5 + Math.floor(Math.random() * 15);
        ordered = Math.floor(Math.random() * 10);
        reserved = Math.floor(Math.random() * 20);
        incoming = Math.floor(Math.random() * 5);
        break;
      default:
        // Default case to satisfy TypeScript
        current = 10;
        min = 5;
        ordered = 0;
        reserved = 0;
        incoming = 0;
    }
    
    // Create random history with bias based on current stock status
    const historyLength = 5 + Math.floor(Math.random() * 5);
    const history = [];
    
    for (let i = 0; i < historyLength; i++) {
      const daysAgo = i * 3 + Math.floor(Math.random() * 3);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      // Determine history type based on stock status
      let type: "in" | "out" | "adjustment";
      if (stockStatus === 0 || stockStatus === 1) {
        // Out of stock or low stock - more outgoing
        type = Math.random() < 0.7 ? "out" : (Math.random() < 0.5 ? "in" : "adjustment");
      } else if (stockStatus === 4) {
        // Excess stock - fewer incoming
        type = Math.random() < 0.3 ? "in" : (Math.random() < 0.6 ? "out" : "adjustment");
      } else {
        // Normal distribution
        type = Math.random() < 0.4 ? "in" : (Math.random() < 0.7 ? "out" : "adjustment");
      }
      
      const quantity = 1 + Math.floor(Math.random() * 10);
      
      const notes = [
        "Livraison fournisseur", 
        "Commande client", 
        "Inventaire annuel", 
        "Retour client", 
        "Ajustement après inventaire",
        "Transfert entre entrepôts",
        "Produit endommagé",
        "Réception partielle",
        "Erreur d'expédition"
      ];
      
      history.push({
        date: date.toISOString(),
        type,
        quantity: type === "out" ? -quantity : quantity,
        note: notes[Math.floor(Math.random() * notes.length)]
      });
    }
    
    // Sort history by date, most recent first
    history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Generate random locations
    const locationNames = [
      "Entrepôt Principal", 
      "Magasin Paris", 
      "Magasin Lyon", 
      "Entrepôt Sud",
      "Showroom",
      "Réserve Technique"
    ];
    
    // Distribute current stock across 1-3 random locations
    const numLocations = 1 + Math.floor(Math.random() * 3);
    const locations: Array<{name: string, quantity: number}> = [];
    let remainingStock = current;

    for (let i = 0; i < numLocations && remainingStock > 0; i++) {
      const locationName = locationNames[Math.floor(Math.random() * locationNames.length)];
      
      // Make sure we don't duplicate locations
      if (locations.find(loc => loc.name === locationName)) {
        continue;
      }
      
      const isLastLocation = i === numLocations - 1;
      const quantity = isLastLocation ? remainingStock : Math.ceil(Math.random() * remainingStock);
      remainingStock -= quantity;
      
      locations.push({
        name: locationName,
        quantity
      });
    }
      
    return {
      ...product,
      stock: {
        current,
        min,
        ordered,
        reserved,
        incoming,
        lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
        locations,
        history
      }
    };
  });
};

// Custom button component
const Button = ({ 
  children, 
  className = "", 
  variant = "default", 
  size = "md", 
  ...props 
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  
  const variantStyles: Record<string, string> = {
    default: "bg-[#213f5b] text-white hover:bg-[#152a3d]",
    outline: "bg-white border hover:bg-gray-50",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "bg-transparent hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700"
  };
  
  const sizeStyles: Record<string, string> = {
    sm: "text-xs px-2.5 py-1.5 rounded-md",
    md: "text-sm px-4 py-2 rounded-lg",
    lg: "text-base px-6 py-3 rounded-lg"
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Mock data for charts
// const generateChartData = (): ChartData => {
//   // Stock movement history for the last 30 days
//   const stockMovementData = [];
//   const startDate = new Date();
//   startDate.setDate(startDate.getDate() - 30);
  
//   for (let i = 0; i < 30; i++) {
//     const date = new Date(startDate);
//     date.setDate(date.getDate() + i);
    
//     // Create some patterns in the data
//     let inAmount, outAmount;
    
//     // Weekend pattern - less movement
//     const dayOfWeek = date.getDay();
//     const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
//     if (isWeekend) {
//       inAmount = Math.floor(Math.random() * 5);
//       outAmount = Math.floor(Math.random() * 3);
//     } else {
//       // Middle of month tends to be busier
//       const dayOfMonth = date.getDate();
//       const isMidMonth = dayOfMonth > 10 && dayOfMonth < 20;
      
//       if (isMidMonth) {
//         inAmount = 5 + Math.floor(Math.random() * 15);
//         outAmount = 8 + Math.floor(Math.random() * 12);
//       } else {
//         inAmount = 3 + Math.floor(Math.random() * 10);
//         outAmount = 5 + Math.floor(Math.random() * 8);
//       }
//     }
    
//     stockMovementData.push({
//       date: date.toISOString().split('T')[0],
//       entrees: inAmount,
//       sorties: outAmount,
//       net: inAmount - outAmount
//     });
//   }
  
//   // Category distribution data
//   const categoryData: CategoryData[] = [
//     { name: 'MONO GESTE', value: 48 },
//     { name: 'PANNEAUX PHOTOVOLTAIQUE', value: 32 },
//     { name: 'RENO AMPLEUR', value: 12 },
//     { name: 'ACCESSOIRE', value: 8 }
//   ];
  
//   // Stock status data
//   const stockStatusData: StockStatusData[] = [
//     { name: 'En stock', value: 65 },
//     { name: 'Stock bas', value: 15 },
//     { name: 'Rupture', value: 10 },
//     { name: 'Sur-stock', value: 10 }
//   ];
  
//   return {
//     stockMovementData,
//     categoryData,
//     stockStatusData
//   };
// };

// Stock update form state interface
interface StockUpdateForm {
  productId: string;
  adjustment: number;
  type: "add" | "remove" | "set";
  location: string;
  note: string;
}

// interface StockMovementData {
//   date: string;
//   entrees: number;
//   sorties: number;
//   net: number;
// }

// // Category distribution data interface
// interface CategoryData {
//   name: string;
//   value: number;
// }

// // Stock status data interface
// interface StockStatusData {
//   name: string;
//   value: number;
// }

// Chart data interface
// interface ChartData {
//   stockMovementData: StockMovementData[];
//   categoryData: CategoryData[];
//   stockStatusData: StockStatusData[];
// }

const StockManagementDashboard = () => {
  // Generate more varied stock data
  const STOCK_PRODUCTS = useMemo<StockProduct[]>(() => generateStockProducts(), []);
  
  // States
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  // const [stockFilter, setStockFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("dashboard"); // "dashboard", "available", "reserved", "low", "out"
  const [viewMode, setViewMode] = useState<string>("cards");
  const [selectedProduct, setSelectedProduct] = useState<StockProduct | null>(null);
  const [stockProducts, setStockProducts] = useState<StockProduct[]>(STOCK_PRODUCTS);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(8);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [updateForm, setUpdateForm] = useState<StockUpdateForm>({
    productId: "",
    adjustment: 0,
    type: "add",
    location: "Entrepôt Principal",
    note: ""
  });
  
  // Chart data
  // const [chartData] = useState<ChartData>(generateChartData());
  
  // Derived data
  const uniqueCategories = useMemo<string[]>(() => {
    const categories = new Set(stockProducts.map(p => p.categorie));
    return ["Tous", ...Array.from(categories)];
  }, [stockProducts]);
  
  const locations = useMemo<string[]>(() => {
    const locationSet = new Set<string>();
    stockProducts.forEach(product => {
      product.stock.locations?.forEach(location => {
        if (location && location.name) {
          locationSet.add(location.name);
        }
      });
    });
    return ["Tous emplacements", ...Array.from(locationSet)];
  }, [stockProducts]);
  
  // Stock summary data
  const stockSummary = useMemo(() => {
    const available = stockProducts.reduce((sum, p) => sum + Math.max(0, (p.stock.current || 0) - (p.stock.reserved || 0)), 0);
    const reserved = stockProducts.reduce((sum, p) => sum + (p.stock.reserved || 0), 0);
    const total = stockProducts.reduce((sum, p) => sum + (p.stock.current || 0), 0);
    const lowStock = stockProducts.filter(p => (p.stock.current || 0) > 0 && (p.stock.current || 0) <= (p.stock.min || 0)).length;
    const outOfStock = stockProducts.filter(p => (p.stock.current || 0) === 0).length;
    const incoming = stockProducts.reduce((sum, p) => sum + (p.stock.incoming || 0), 0);
    const ordered = stockProducts.reduce((sum, p) => sum + (p.stock.ordered || 0), 0);

    
    // Calculate value
    const availableValue = stockProducts.reduce((sum, p) => 
      sum + (Math.max(0, (p.stock.current || 0) - (p.stock.reserved || 0)) * p.prixTTC), 0);
    const reservedValue = stockProducts.reduce((sum, p) => 
      sum + ((p.stock.reserved || 0) * p.prixTTC), 0);
    const totalValue = stockProducts.reduce((sum, p) => 
      sum + ((p.stock.current || 0) * p.prixTTC), 0);
    
    return {
      available,
      reserved,
      total,
      lowStock,
      outOfStock,
      incoming,
      ordered,
      availableValue,
      reservedValue,
      totalValue
    };
  }, [stockProducts]);
  
  // Filtered products based on current view and filters
  const filteredProducts = useMemo<StockProduct[]>(() => {
    let filtered = [...stockProducts];
    
    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(product => {
        return (
          product.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.marque.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== "Tous") {
      filtered = filtered.filter(product => product.categorie === selectedCategory);
    }
    
    // Apply location filter
    if (selectedLocation && selectedLocation !== "Tous emplacements") {
      filtered = filtered.filter(product => 
        product.stock.locations?.some(location => location.name === selectedLocation)
      );
    }
    
    // Apply tab filter
    switch(activeTab) {
      case "available":
        filtered = filtered.filter(p => (p.stock.current || 0) > (p.stock.reserved || 0));
        break;
      case "reserved":
        filtered = filtered.filter(p => (p.stock.reserved || 0) > 0);
        break;
      case "low":
        filtered = filtered.filter(p => (p.stock.current || 0) > 0 && (p.stock.current || 0) <= (p.stock.min || 0));
        break;
      case "out":
        filtered = filtered.filter(p => (p.stock.current || 0) === 0);
        break;
      case "excess":
        filtered = filtered.filter(p => (p.stock.current || 0) > (p.stock.min || 0) * 2);
        break;
      // dashboard shows all
    }
    
    return filtered;
  }, [stockProducts, searchTerm, selectedCategory, activeTab, selectedLocation]);
  
  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo<StockProduct[]>(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);
  
  // Handlers
  const handleOpenUpdateModal = (product: StockProduct) => {
    setUpdateForm({
      productId: product.id,
      adjustment: 0,
      type: "add",
      location: product.stock.locations?.[0]?.name || "Entrepôt Principal",
      note: ""
    });
    setSelectedProduct(product);
    setIsUpdateModalOpen(true);
  };
  
  const handleUpdateStock = () => {
    const updatedProducts = stockProducts.map(product => {
      if (product.id === updateForm.productId) {
        const newStock = { ...product.stock };
        let newCurrent = product.stock.current;
        
        // Calculate new stock value
        if (updateForm.type === "add") {
          newCurrent += updateForm.adjustment;
        } else if (updateForm.type === "remove") {
          newCurrent = Math.max(0, newCurrent - updateForm.adjustment);
        } else if (updateForm.type === "set") {
          newCurrent = Math.max(0, updateForm.adjustment);
        }
        
        // Update location quantities
        if (updateForm.location && newStock.locations) {
          const locationIndex = newStock.locations.findIndex(loc => loc.name === updateForm.location);
          if (locationIndex >= 0) {
            let locationStock = newStock.locations[locationIndex].quantity;
            
            if (updateForm.type === "add") {
              locationStock += updateForm.adjustment;
            } else if (updateForm.type === "remove") {
              locationStock = Math.max(0, locationStock - updateForm.adjustment);
            } else if (updateForm.type === "set") {
              locationStock = Math.max(0, updateForm.adjustment);
            }
            
            newStock.locations[locationIndex].quantity = locationStock;
          }
        }
        
        // Add history entry
        const historyEntry: {
          date: string;
          type: "in" | "out" | "adjustment";
          quantity: number;
          note?: string;
        } = {
          date: new Date().toISOString(),
          type: updateForm.type === "add" ? "in" : updateForm.type === "remove" ? "out" : "adjustment",
          quantity: updateForm.adjustment * (updateForm.type === "remove" ? -1 : 1),
          note: updateForm.note
        };
        
        return {
          ...product,
          stock: {
            ...newStock,
            current: newCurrent,
            lastUpdated: new Date().toISOString(),
            history: [historyEntry, ...(product.stock.history || [])]
          }
        };
      }
      return product;
    });
    
    setStockProducts(updatedProducts);
    setIsUpdateModalOpen(false);
    
    // Update selected product if in detail view
    if (selectedProduct && selectedProduct.id === updateForm.productId) {
      const updatedProduct = updatedProducts.find(p => p.id === updateForm.productId);
      if (updatedProduct) {
        setSelectedProduct(updatedProduct);
      }
    }
  };
  
  const handleViewProduct = (product: StockProduct) => {
    setSelectedProduct(product);
  };
  
  const handleBackToList = () => {
    setSelectedProduct(null);
  };
  
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Render stock status indicator with appropriate color and icon
  const renderStockStatus = (product: StockProduct) => {
    // const availableStock = Math.max(0, product.stock.current - product.stock.reserved);
    
    if (product.stock.current === 0) {
      return (
        <div className="flex items-center gap-1 text-red-500">
          <ExclamationCircleIcon className="h-4 w-4" />
          <span className="text-xs font-medium">Rupture</span>
        </div>
      );
    } else if (product.stock.current <= product.stock.min) {
      return (
        <div className="flex items-center gap-1 text-amber-500">
          <BellAlertIcon className="h-4 w-4" />
          <span className="text-xs font-medium">Stock bas</span>
        </div>
      );
    } else if (product.stock.reserved > product.stock.current) {
      return (
        <div className="flex items-center gap-1 text-orange-500">
          <ClockIcon className="h-4 w-4" />
          <span className="text-xs font-medium">Sur-réservé</span>
        </div>
      );
    } else if (product.stock.current > product.stock.min * 2) {
      return (
        <div className="flex items-center gap-1 text-blue-500">
          <ArchiveBoxIcon className="h-4 w-4" />
          <span className="text-xs font-medium">Sur-stock</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 text-green-500">
          <CheckCircleIcon className="h-4 w-4" />
          <span className="text-xs font-medium">En stock</span>
        </div>
      );
    }
  };
  
  // Calculate stock health percentage
  const calculateStockHealth = (product: StockProduct) => {
    const { current = 0, min = 0 } = product.stock;
    if (min === 0) return 100;
    
    const ratio = current / min;
    if (ratio >= 2) return 100;
    if (ratio <= 0) return 0;
    
    return Math.round(ratio * 50);
  };
  
  // Stock alerts
  const stockAlerts = useMemo(() => {
    const alerts = [];
    
    // Out of stock products
    const outOfStockCount = stockProducts.filter(p => p.stock.current === 0).length;
    if (outOfStockCount > 0) {
      alerts.push({
        id: 'out-of-stock',
        type: 'error',
        icon: <ExclamationCircleIcon className="h-5 w-5" />,
        title: `${outOfStockCount} produit${outOfStockCount > 1 ? 's' : ''} en rupture de stock`,
        description: 'Des commandes futures pourraient être impactées'
      });
    }
    
    // Low stock products
    const lowStockCount = stockProducts.filter(p => p.stock.current > 0 && p.stock.current <= p.stock.min).length;
    if (lowStockCount > 0) {
      alerts.push({
        id: 'low-stock',
        type: 'warning',
        icon: <BellAlertIcon className="h-5 w-5" />,
        title: `${lowStockCount} produit${lowStockCount > 1 ? 's' : ''} en stock bas`,
        description: 'Commander rapidement pour éviter les ruptures'
      });
    }
    
    // Over-reserved products
    const overReservedCount = stockProducts.filter(p => p.stock.reserved > p.stock.current).length;
    if (overReservedCount > 0) {
      alerts.push({
        id: 'over-reserved',
        type: 'warning',
        icon: <ClockIcon className="h-5 w-5" />,
        title: `${overReservedCount} produit${overReservedCount > 1 ? 's' : ''} sur-réservé${overReservedCount > 1 ? 's' : ''}`,
        description: 'Les réservations dépassent le stock disponible'
      });
    }
    
    // Incoming deliveries
    const incomingCount = stockProducts.filter(p => p.stock.incoming > 0).length;
    if (incomingCount > 0) {
      alerts.push({
        id: 'incoming',
        type: 'info',
        icon: <TruckIcon className="h-5 w-5" />,
        title: `${stockSummary.incoming} unités en attente de livraison`,
        description: `Pour ${incomingCount} produit${incomingCount > 1 ? 's' : ''}`
      });
    }
    
    // Excess stock
    const excessStockCount = stockProducts.filter(p => p.stock.current > p.stock.min * 3).length;
    if (excessStockCount > 0) {
      alerts.push({
        id: 'excess-stock',
        type: 'info',
        icon: <ArchiveBoxIcon className="h-5 w-5" />,
        title: `${excessStockCount} produit${excessStockCount > 1 ? 's' : ''} en sur-stock`,
        description: 'Optimisez votre espace de stockage'
      });
    }
    
    return alerts;
  }, [stockProducts, stockSummary]);
  
  // Conditional rendering for the main content based on tab
  const renderMainContent = () => {
    // If a product is selected, show the product detail view
    if (selectedProduct) {
      return renderProductDetail();
    }
    
    // Otherwise, show the appropriate list view based on the active tab
    if (activeTab === "dashboard") {
      return renderDashboard();
    } else {
      return renderProductList();
    }
  };
  
  // Render the dashboard view
  const renderDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Stock Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-[#eaeaea] hover:shadow-md hover:border-[#bfddf9] transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-[#213f5b] opacity-75">Stock disponible</p>
                <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{stockSummary.available}</h3>
                <p className="text-sm text-[#213f5b] font-medium mt-1">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stockSummary.availableValue)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#eaeaea] flex justify-between items-center">
              <div className="text-xs text-[#213f5b]">
                {stockProducts.filter(p => p.stock.current > p.stock.reserved).length} produits disponibles
              </div>
              <Button
                size="sm"
                className="text-green-600 bg-green-50 hover:bg-green-100"
                onClick={() => setActiveTab("available")}
              >
                <EyeIcon className="h-3 w-3 mr-1" />
                Voir
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-[#eaeaea] hover:shadow-md hover:border-[#bfddf9] transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-[#213f5b] opacity-75">Stock réservé</p>
                <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{stockSummary.reserved}</h3>
                <p className="text-sm text-[#213f5b] font-medium mt-1">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stockSummary.reservedValue)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <ClockIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#eaeaea] flex justify-between items-center">
              <div className="text-xs text-[#213f5b]">
                {stockProducts.filter(p => p.stock.reserved > 0).length} produits réservés
              </div>
              <Button
                size="sm"
                className="text-blue-600 bg-blue-50 hover:bg-blue-100"
                onClick={() => setActiveTab("reserved")}
              >
                <EyeIcon className="h-3 w-3 mr-1" />
                Voir
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-[#eaeaea] hover:shadow-md hover:border-[#bfddf9] transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-[#213f5b] opacity-75">Stock bas & ruptures</p>
                <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{stockSummary.lowStock + stockSummary.outOfStock}</h3>
                <p className="text-sm text-[#213f5b] font-medium mt-1">
                  <span className="text-amber-500">{stockSummary.lowStock} bas</span> • <span className="text-red-500">{stockSummary.outOfStock} ruptures</span>
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <BellAlertIcon className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#eaeaea] flex justify-between items-center">
              <div className="text-xs text-[#213f5b]">
                {stockSummary.incoming} unités en commande
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="text-amber-600 bg-amber-50 hover:bg-amber-100"
                  onClick={() => setActiveTab("low")}
                >
                  <EyeIcon className="h-3 w-3 mr-1" />
                  Stock bas
                </Button>
                <Button
                  size="sm"
                  className="text-red-600 bg-red-50 hover:bg-red-100"
                  onClick={() => setActiveTab("out")}
                >
                  <EyeIcon className="h-3 w-3 mr-1" />
                  Ruptures
                </Button>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-[#eaeaea] hover:shadow-md hover:border-[#bfddf9] transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-[#213f5b] opacity-75">Total en stock</p>
                <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{stockSummary.total}</h3>
                <p className="text-sm text-[#213f5b] font-medium mt-1">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stockSummary.totalValue)}
                </p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <ArchiveBoxIcon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#eaeaea] flex justify-between items-center">
              <div className="text-xs text-[#213f5b]">
                {stockProducts.length} produits différents
              </div>
              <Button
                size="sm"
                className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                onClick={() => {
                  setActiveTab("excess");
                }}
              >
                <EyeIcon className="h-3 w-3 mr-1" />
                Sur-stock
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Alerts & Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stock Alerts */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-[#eaeaea] lg:col-span-1"
          >
            <div className="p-5 border-b border-[#eaeaea]">
              <h3 className="font-semibold text-[#213f5b]">Alertes de stock</h3>
            </div>
            <div className="p-1">
              {stockAlerts.length === 0 ? (
                <div className="p-4 text-center text-[#213f5b] opacity-75">
                  <CheckCircleIcon className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>Aucune alerte de stock</p>
                </div>
              ) : (
                <ul className="divide-y divide-[#eaeaea]">
                  {stockAlerts.map(alert => (
                    <li key={alert.id} className="p-4 hover:bg-[#f8fafc] transition-colors">
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 p-1.5 rounded-full ${
                          alert.type === 'error' ? 'text-red-500 bg-red-50' :
                          alert.type === 'warning' ? 'text-amber-500 bg-amber-50' :
                          'text-blue-500 bg-blue-50'
                        }`}>
                          {alert.icon}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-[#213f5b]">{alert.title}</p>
                          <p className="text-xs text-[#213f5b] opacity-75 mt-1">{alert.description}</p>
                        </div>
                        <div className="ml-auto">
                          <Button
                            size="sm"
                            className={`${
                              alert.type === 'error' ? 'text-red-500 bg-red-50 hover:bg-red-100' :
                              alert.type === 'warning' ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' :
                              'text-blue-500 bg-blue-50 hover:bg-blue-100'
                            }`}
                            onClick={() => {
                              if (alert.id === 'out-of-stock') setActiveTab('out');
                              else if (alert.id === 'low-stock') setActiveTab('low');
                              else if (alert.id === 'over-reserved') setActiveTab('reserved');
                              else if (alert.id === 'excess-stock') setActiveTab('excess');
                            }}
                          >
                            <EyeIcon className="h-3 w-3 mr-1" />
                            Voir
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
          
          {/* Stock Movement Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-[#eaeaea] lg:col-span-2"
          >
            <div className="p-5 border-b border-[#eaeaea]">
              <h3 className="font-semibold text-[#213f5b]">Mouvements du stock (30 derniers jours)</h3>
            </div>
            <div className="p-5">
              <div className="h-64">
                {/* Here we would place a line chart showing stock movements */}
                {/* For simplicity, I'm just showing a placeholder */}
                <div className="h-full flex items-center justify-center text-[#213f5b] opacity-75">
                  Graphique des mouvements de stock (entrées/sorties)
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Action Shortcuts Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-[#eaeaea] hover:shadow-md transition-all cursor-pointer"
            onClick={() => setActiveTab("low")}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <BellAlertIcon className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="font-medium text-[#213f5b]">Stock à commander</h3>
            </div>
            <p className="text-sm text-[#213f5b] opacity-75 mb-3">
              {stockSummary.lowStock} produits en stock bas
            </p>
            <div className="flex justify-end">
              <Button
                size="sm"
                className="text-[#213f5b] bg-[#f0f7ff] hover:bg-[#bfddf9]"
              >
                Voir tous
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-[#eaeaea] hover:shadow-md transition-all cursor-pointer"
            onClick={() => setActiveTab("reserved")}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TruckIcon className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="font-medium text-[#213f5b]">Livraisons en attente</h3>
            </div>
            <p className="text-sm text-[#213f5b] opacity-75 mb-3">
              {stockSummary.ordered} produits commandés
            </p>
            <div className="flex justify-end">
              <Button
                size="sm"
                className="text-[#213f5b] bg-[#f0f7ff] hover:bg-[#bfddf9]"
              >
                Voir tous
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-[#eaeaea] hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <DocumentArrowDownIcon className="h-5 w-5 text-indigo-500" />
              </div>
              <h3 className="font-medium text-[#213f5b]">Exporter le rapport</h3>
            </div>
            <p className="text-sm text-[#213f5b] opacity-75 mb-3">
              Générer un rapport complet du stock
            </p>
            <div className="flex justify-end">
              <Button
                size="sm"
                className="text-[#213f5b] bg-[#f0f7ff] hover:bg-[#bfddf9]"
              >
                Exporter
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Recent Activity & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.9 }}
            className="bg-white rounded-xl shadow-sm border border-[#eaeaea] lg:col-span-2"
          >
            <div className="p-5 border-b border-[#eaeaea] flex justify-between items-center">
              <h3 className="font-semibold text-[#213f5b]">Activité récente</h3>
              <button className="text-sm text-[#213f5b] hover:underline">Voir tout</button>
            </div>
            <div className="p-5">
              <ul className="divide-y divide-[#eaeaea]">
                {stockProducts
                  .flatMap(product => 
                    (product.stock.history || []).map(history => ({
                      product,
                      history
                    }))
                  )
                  .sort((a, b) => new Date(b.history.date).getTime() - new Date(a.history.date).getTime())
                  .slice(0, 5)
                  .map((item, index) => (
                    <li key={index} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 p-1.5 rounded-full ${
                          item.history.type === 'in' ? 'text-green-500 bg-green-50' :
                          item.history.type === 'out' ? 'text-red-500 bg-red-50' :
                          'text-blue-500 bg-blue-50'
                        }`}>
                          {item.history.type === 'in' ? (
                            <ArrowUpIcon className="h-4 w-4" />
                          ) : item.history.type === 'out' ? (
                            <ArrowDownIcon className="h-4 w-4" />
                          ) : (
                            <ArrowsUpDownIcon className="h-4 w-4" />
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-[#213f5b]">
                            {item.history.type === 'in' 
                              ? `Entrée de ${Math.abs(item.history.quantity)} ${item.product.unite}` 
                              : item.history.type === 'out' 
                              ? `Sortie de ${Math.abs(item.history.quantity)} ${item.product.unite}`
                              : `Ajustement de ${item.history.quantity > 0 ? '+' : ''}${item.history.quantity} ${item.product.unite}`
                            }
                          </p>
                          <p className="text-xs text-[#213f5b] opacity-75 mt-1">
                            {item.product.libelle} • {item.history.note}
                          </p>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="text-xs text-[#213f5b] opacity-75">
                            {new Date(item.history.date).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-xs text-[#213f5b] opacity-75 mt-1">
                            {new Date(item.history.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </motion.div>
          
          {/* Inventory Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.0 }}
            className="bg-white rounded-xl shadow-sm border border-[#eaeaea]"
          >
            <div className="p-5 border-b border-[#eaeaea]">
              <h3 className="font-semibold text-[#213f5b]">Distribution du stock</h3>
            </div>
            <div className="p-5">
              <div className="h-48 flex items-center justify-center">
                {/* Here we would place a pie chart showing stock distribution */}
                <div className="text-center text-[#213f5b] opacity-75">
                  <p>Graphique de répartition du stock</p>
                  <p className="text-xs mt-2">Par catégorie / statut</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-[#213f5b]">En stock (65%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-xs text-[#213f5b]">Stock bas (15%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-xs text-[#213f5b]">Rupture (10%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-[#213f5b]">Sur-stock (10%)</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Featured Products */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.1 }}
          className="bg-white rounded-xl shadow-sm border border-[#eaeaea]"
        >
          <div className="p-5 border-b border-[#eaeaea] flex justify-between items-center">
            <h3 className="font-semibold text-[#213f5b]">Produits nécessitant attention</h3>
            <button className="text-sm text-[#213f5b] hover:underline">Voir tous</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#eaeaea]">
              <thead className="bg-[#f8fafc]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                    Produit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                    Stock / Min
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                    Réservations
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                    Emplacement
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#eaeaea]">
                {stockProducts
                  .filter(p => 
                    p.stock.current === 0 || 
                    p.stock.current <= p.stock.min || 
                    p.stock.reserved > p.stock.current
                  )
                  .sort((a, b) => {
                    // Sort priority: 1. Out of stock, 2. Reserved > Current, 3. Low stock
                    if (a.stock.current === 0 && b.stock.current !== 0) return -1;
                    if (a.stock.current !== 0 && b.stock.current === 0) return 1;
                    if (a.stock.reserved > a.stock.current && b.stock.reserved <= b.stock.current) return -1;
                    if (a.stock.reserved <= a.stock.current && b.stock.reserved > b.stock.current) return 1;
                    return (a.stock.current / a.stock.min) - (b.stock.current / b.stock.min);
                  })
                  .slice(0, 5)
                  .map((product) => (
                    <tr key={product.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-md bg-[#f0f7ff] flex items-center justify-center">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.libelle} className="h-10 w-10 rounded-md object-cover" />
                            ) : (
                              <CubeIcon className="h-6 w-6 text-[#213f5b]" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-[#213f5b]">{product.libelle}</div>
                            <div className="text-xs text-[#213f5b] opacity-75">{product.reference}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStockStatus(product)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#213f5b]">
                          {product.stock.current} / {product.stock.min} {product.unite}
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                          <div 
                            className={`h-1.5 rounded-full ${
                              product.stock.current === 0 ? "bg-red-500" :
                              product.stock.current < product.stock.min ? "bg-amber-500" :
                              product.stock.current < product.stock.min * 2 ? "bg-green-500" :
                              "bg-blue-500"
                            }`}
                            style={{ width: `${Math.min(100, (product.stock.current / product.stock.min) * 50)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#213f5b]">
                          {product.stock.reserved} {product.unite}
                        </div>
                        <div className="text-xs text-[#213f5b] opacity-75">
                          {product.stock.reserved > product.stock.current ? (
                            <span className="text-orange-500">Sur-réservé</span>
                          ) : product.stock.reserved > 0 ? (
                            <span>Réservé: {Math.round((product.stock.reserved / product.stock.current) * 100)}%</span>
                          ) : (
                            <span>Aucune réservation</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#213f5b]">
                          {product.stock.locations && product.stock.locations.length > 0 ? (
                            <span>{product.stock.locations[0].name}</span>
                          ) : (
                            <span className="text-[#213f5b] opacity-50">Non assigné</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9]"
                            onClick={() => handleOpenUpdateModal(product)}
                          >
                            <ArrowPathIcon className="h-3 w-3 mr-1" />
                            Mettre à jour
                          </Button>
                          <Button
                            size="sm"
                            className="bg-[#213f5b] hover:bg-[#152a3d] text-white"
                            onClick={() => handleViewProduct(product)}
                          >
                            <EyeIcon className="h-3 w-3 mr-1" />
                            Détails
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    );
  };
  
  // Render the product list view
  const renderProductList = () => {
    // Different view titles based on active tab
    const tabTitles: Record<string, string> = {
      "available": "Stock disponible",
      "reserved": "Produits réservés",
      "low": "Stock bas",
      "out": "Ruptures de stock",
      "excess": "Sur-stock"
    };
    
    return (
      <div className="space-y-6">
        {/* Tab description */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-[#eaeaea]">
          <h3 className="font-medium text-lg text-[#213f5b] mb-2">{tabTitles[activeTab] || "Produits"}</h3>
          <p className="text-sm text-[#213f5b] opacity-75">
            {activeTab === "available" && `${filteredProducts.length} produits disponibles pour un total de ${stockSummary.available} unités`}
            {activeTab === "reserved" && `${filteredProducts.length} produits avec ${stockSummary.reserved} unités réservées`}
            {activeTab === "low" && `${filteredProducts.length} produits avec un stock inférieur au minimum requis`}
            {activeTab === "out" && `${filteredProducts.length} produits en rupture de stock`}
            {activeTab === "excess" && `${filteredProducts.length} produits avec un stock excessif`}
          </p>
        </div>
        
        {/* Products grid */}
        {paginatedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-[#213f5b] bg-white rounded-xl shadow-sm">
            <ArchiveBoxIcon className="h-16 w-16 mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
            <p className="text-sm opacity-75 mb-6">Modifiez vos critères de recherche ou ajoutez de nouveaux produits</p>
            <Button
              className="bg-[#213f5b] hover:bg-[#152a3d] text-white"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl border border-[#eaeaea] shadow-sm hover:shadow-md hover:border-[#bfddf9] transition-all group overflow-hidden h-full flex flex-col"
                whileHover={{ y: -4 }}
              >
                {/* Product header */}
                <div className="relative h-40 overflow-hidden bg-gradient-to-r from-[#f0f7ff] to-[#f8fafc] flex items-center justify-center">
                  <div className="absolute top-2 right-2 z-10">
                    {renderStockStatus(product)}
                  </div>
                  
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.libelle} 
                      className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <CubeIcon className="h-16 w-16 text-[#bfddf9]" />
                  )}
                  
                  <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 rounded-full px-3 py-1 text-xs font-medium text-[#213f5b] shadow-sm">
                    {product.categorie}
                  </div>
                </div>
                
                {/* Product info */}
                <div className="p-4 flex-grow">
                  <div className="mb-2">
                    <h3 className="font-medium text-[#213f5b] line-clamp-1">{product.libelle || product.reference}</h3>
                    <p className="text-xs text-[#213f5b] opacity-75">{product.reference}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-[#f8fafc] rounded-lg p-2 text-center">
                      <p className="text-xs text-[#213f5b] opacity-75">En stock</p>
                      <p className="font-semibold text-[#213f5b]">
                        {product.stock.current} <span className="text-xs">{product.unite}</span>
                      </p>
                    </div>
                    
                    <div className="bg-[#f8fafc] rounded-lg p-2 text-center">
                      <p className="text-xs text-[#213f5b] opacity-75">
                        {activeTab === "reserved" ? "Réservé" : "Minimum"}
                      </p>
                      <p className="font-semibold text-[#213f5b]">
                        {activeTab === "reserved" ? product.stock.reserved : product.stock.min} <span className="text-xs">{product.unite}</span>
                      </p>
                    </div>
                  </div>
                  
                  {activeTab === "available" && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-[#213f5b] mb-1">
                        <span>Disponible</span>
                        <span>{Math.max(0, product.stock.current - product.stock.reserved)} {product.unite}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full bg-green-500"
                          style={{ width: `${Math.min(100, ((product.stock.current - product.stock.reserved) / product.stock.current) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === "reserved" && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-[#213f5b] mb-1">
                        <span>Ratio réservé</span>
                        <span>{product.stock.current > 0 ? Math.round((product.stock.reserved / product.stock.current) * 100) : 100}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${product.stock.reserved > product.stock.current ? "bg-orange-500" : "bg-blue-500"}`}
                          style={{ width: `${Math.min(100, (product.stock.reserved / Math.max(1, product.stock.current)) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {(activeTab === "low" || activeTab === "out") && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-[#213f5b] mb-1">
                        <span>Stock / Minimum</span>
                        <span>{Math.round((product.stock.current / Math.max(1, product.stock.min)) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${product.stock.current === 0 ? "bg-red-500" : "bg-amber-500"}`}
                          style={{ width: `${Math.min(100, (product.stock.current / Math.max(1, product.stock.min)) * 50)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === "excess" && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-[#213f5b] mb-1">
                        <span>Stock / Minimum</span>
                        <span>{Math.round((product.stock.current / Math.max(1, product.stock.min)))}x</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full bg-blue-500"
                          style={{ width: `${Math.min(100, (product.stock.current / Math.max(1, product.stock.min * 3)) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-[#213f5b] opacity-75 mb-2">
                    {product.stock.locations && product.stock.locations.length > 0 ? (
                      <p>Emplacement: {product.stock.locations[0].name}</p>
                    ) : (
                      <p>Aucun emplacement assigné</p>
                    )}
                  </div>
                  
                  <div className="text-xs text-[#213f5b] opacity-75">
                    Dernière mise à jour: {formatDate(product.stock.lastUpdated)}
                  </div>
                </div>
                
                {/* Product actions */}
                <div className="p-4 border-t border-[#eaeaea] mt-auto">
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9]"
                      onClick={() => handleOpenUpdateModal(product)}
                    >
                      <ArrowPathIcon className="h-3 w-3 mr-1" />
                      Mettre à jour
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#213f5b] hover:bg-[#152a3d] text-white"
                      onClick={() => handleViewProduct(product)}
                    >
                      <EyeIcon className="h-3 w-3 mr-1" />
                      Détails
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-[#bfddf9] bg-white text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-400"
                    : "text-[#213f5b] hover:bg-[#bfddf9]"
                }`}
              >
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                  if (i === 4) pageNum = totalPages;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                  if (i === 0) pageNum = 1;
                } else {
                  pageNum = currentPage - 2 + i;
                  if (i === 0) pageNum = 1;
                  if (i === 4) pageNum = totalPages;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border border-[#bfddf9] text-sm font-medium ${
                      currentPage === pageNum
                        ? "bg-[#213f5b] text-white"
                        : "bg-white text-[#213f5b] hover:bg-[#bfddf9]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-[#bfddf9] bg-white text-sm font-medium ${
                  currentPage === totalPages
                    ? "text-gray-400"
                    : "text-[#213f5b] hover:bg-[#bfddf9]"
                }`}
              >
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        )}
      </div>
    );
  };
  
  // Render product detail view
  const renderProductDetail = () => {
    if (!selectedProduct) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Main product info */}
        <div className="md:col-span-2 space-y-6">
          {/* Product header */}
          <div className="bg-white rounded-xl shadow-sm border border-[#eaeaea] overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              {selectedProduct.imageUrl ? (
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.libelle} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#f0f7ff] to-[#f8fafc]">
                  <CubeIcon className="h-24 w-24 text-[#bfddf9]" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{selectedProduct.libelle}</h2>
                    <p className="text-sm opacity-90">{selectedProduct.reference}</p>
                  </div>
                  <div className="bg-white rounded-lg py-1 px-3 text-[#213f5b] font-medium text-sm shadow-lg">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(selectedProduct.prixTTC)}
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4">
                <div className="bg-white bg-opacity-90 rounded-lg px-3 py-1.5 shadow-lg flex items-center gap-1.5">
                  {renderStockStatus(selectedProduct)}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#eaeaea]">
                  <p className="text-xs text-[#213f5b] opacity-75 mb-1">Stock actuel</p>
                  <p className="text-xl font-bold text-[#213f5b]">{selectedProduct.stock.current}</p>
                  <p className="text-xs text-[#213f5b] opacity-75">{selectedProduct.unite}</p>
                </div>
                <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#eaeaea]">
                  <p className="text-xs text-[#213f5b] opacity-75 mb-1">Stock réservé</p>
                  <p className="text-xl font-bold text-[#213f5b]">{selectedProduct.stock.reserved}</p>
                  <p className="text-xs text-[#213f5b] opacity-75">{selectedProduct.unite}</p>
                </div>
                <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#eaeaea]">
                  <p className="text-xs text-[#213f5b] opacity-75 mb-1">Disponible</p>
                  <p className="text-xl font-bold text-[#213f5b]">{Math.max(0, selectedProduct.stock.current - selectedProduct.stock.reserved)}</p>
                  <p className="text-xs text-[#213f5b] opacity-75">{selectedProduct.unite}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#213f5b] mb-3">Détails du produit</h3>
                <p className="text-sm text-[#213f5b]">{selectedProduct.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-[#213f5b] mb-2">Informations stock</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-[#213f5b] opacity-75">Stock minimum</dt>
                      <dd className="text-sm font-medium text-[#213f5b]">{selectedProduct.stock.min} {selectedProduct.unite}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-[#213f5b] opacity-75">Commandé</dt>
                      <dd className="text-sm font-medium text-[#213f5b]">{selectedProduct.stock.ordered} {selectedProduct.unite}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-[#213f5b] opacity-75">En attente</dt>
                      <dd className="text-sm font-medium text-[#213f5b]">{selectedProduct.stock.incoming} {selectedProduct.unite}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-[#213f5b] opacity-75">Dernière mise à jour</dt>
                      <dd className="text-sm font-medium text-[#213f5b]">{formatDate(selectedProduct.stock.lastUpdated)}</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-[#213f5b] mb-2">Informations produit</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-[#213f5b] opacity-75">Catégorie</dt>
                      <dd className="text-sm font-medium text-[#213f5b]">{selectedProduct.categorie}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-[#213f5b] opacity-75">Marque</dt>
                      <dd className="text-sm font-medium text-[#213f5b]">{selectedProduct.marque}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-[#213f5b] opacity-75">TVA</dt>
                      <dd className="text-sm font-medium text-[#213f5b]">{selectedProduct.tva}%</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-[#213f5b] opacity-75">Valeur du stock</dt>
                      <dd className="text-sm font-medium text-[#213f5b]">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(selectedProduct.stock.current * selectedProduct.prixTTC)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-[#213f5b] mb-2">Indicateurs de stock</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-[#213f5b] mb-1">
                      <span>Stock / Minimum</span>
                      <span>{selectedProduct.stock.min > 0 ? Math.round((selectedProduct.stock.current / selectedProduct.stock.min) * 100) : 100}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          selectedProduct.stock.current === 0 ? "bg-red-500" :
                          selectedProduct.stock.current < selectedProduct.stock.min ? "bg-amber-500" :
                          selectedProduct.stock.current < selectedProduct.stock.min * 2 ? "bg-green-500" :
                          "bg-blue-500"
                        }`}
                        style={{ width: `${Math.min(100, (selectedProduct.stock.current / Math.max(1, selectedProduct.stock.min)) * 50)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm text-[#213f5b] mb-1">
                      <span>Disponible / Total</span>
                      <span>{selectedProduct.stock.current > 0 ? Math.round(((selectedProduct.stock.current - selectedProduct.stock.reserved) / selectedProduct.stock.current) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${Math.min(100, ((selectedProduct.stock.current - selectedProduct.stock.reserved) / Math.max(1, selectedProduct.stock.current)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Locations */}
<div className="bg-white rounded-xl shadow-sm border border-[#eaeaea] overflow-hidden">
  <div className="p-6 border-b border-[#eaeaea]">
    <h3 className="font-semibold text-[#213f5b]">Emplacements</h3>
  </div>
  <div className="p-6">
    {selectedProduct.stock.locations && selectedProduct.stock.locations.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#eaeaea]">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                Emplacement
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                Quantité
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaeaea]">
            {selectedProduct.stock.locations.map((location, index) => (
              <tr key={index} className="hover:bg-[#f8fafc]">
                <td className="px-4 py-3 text-sm text-[#213f5b]">
                  {location.name}
                </td>
                <td className="px-4 py-3 text-sm text-right text-[#213f5b]">
                  {location.quantity} {selectedProduct.unite}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUpdateForm({
                        productId: selectedProduct.id,
                        adjustment: 0,
                        type: "add",
                        location: location.name,
                        note: ""
                      });
                      setIsUpdateModalOpen(true);
                    }}
                    className="text-[#213f5b]"
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="text-center py-6 text-[#213f5b] opacity-75">
        <p>Aucun emplacement défini pour ce produit</p>
      </div>
    )}
  </div>
</div>

{/* History */}
<div className="bg-white rounded-xl shadow-sm border border-[#eaeaea] overflow-hidden">
  <div className="p-6 border-b border-[#eaeaea]">
    <h3 className="font-semibold text-[#213f5b]">Historique des mouvements</h3>
  </div>
  <div className="p-6">
    <div className="flow-root">
      <ul className="-mb-8">
        {selectedProduct.stock.history?.slice(0, 10).map((event, index) => (
          <li key={index}>
            <div className="relative pb-8">
            {index !== (selectedProduct.stock.history?.length ?? 0) - 1 && (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-[#eaeaea]" aria-hidden="true"></span>
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                    event.type === "in" 
                      ? "bg-green-100" 
                      : event.type === "out" 
                      ? "bg-red-100" 
                      : "bg-blue-100"
                  }`}>
                    {event.type === "in" ? (
                      <ArrowUpIcon className="h-4 w-4 text-green-600" />
                    ) : event.type === "out" ? (
                      <ArrowDownIcon className="h-4 w-4 text-red-600" />
                    ) : (
                      <ArrowsUpDownIcon className="h-4 w-4 text-blue-600" />
                    )}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-[#213f5b]">
                      {event.type === "in" 
                        ? `Entrée de ${Math.abs(event.quantity)} ${selectedProduct.unite}` 
                        : event.type === "out" 
                        ? `Sortie de ${Math.abs(event.quantity)} ${selectedProduct.unite}` 
                        : `Ajustement de ${event.quantity > 0 ? '+' : ''}${event.quantity} ${selectedProduct.unite}`
                      }
                      {event.note && ` - ${event.note}`}
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-[#213f5b] opacity-75">
                    {formatDate(event.date)}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>
</div>

{/* Sidebar */}
<div className="space-y-6">
  {/* Stock Health Card */}
  <div className="bg-white rounded-xl shadow-sm border border-[#eaeaea] overflow-hidden">
    <div className="p-6 border-b border-[#eaeaea]">
      <h3 className="font-semibold text-[#213f5b]">Santé du stock</h3>
    </div>
    <div className="p-6">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-[#213f5b]">
              {calculateStockHealth(selectedProduct)}%
            </span>
            <span className="text-sm text-[#213f5b] opacity-75">
              {selectedProduct.stock.current} / min {selectedProduct.stock.min}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                calculateStockHealth(selectedProduct) > 66
                  ? "bg-green-500"
                  : calculateStockHealth(selectedProduct) > 33
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${calculateStockHealth(selectedProduct)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-[#eaeaea]">
          <h4 className="text-sm font-medium text-[#213f5b] mb-3">Actions recommandées</h4>
          {selectedProduct.stock.current === 0 ? (
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg text-red-700 text-sm">
              <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Stock épuisé</p>
                <p className="mt-1">Commander immédiatement au moins {selectedProduct.stock.min * 2} unités pour reconstituer le stock</p>
              </div>
            </div>
          ) : selectedProduct.stock.current <= selectedProduct.stock.min ? (
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-amber-700 text-sm">
              <BellAlertIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Stock bas</p>
                <p className="mt-1">Commander {selectedProduct.stock.min * 2 - selectedProduct.stock.current} unités supplémentaires dès que possible</p>
              </div>
            </div>
          ) : selectedProduct.stock.reserved > selectedProduct.stock.current ? (
            <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg text-orange-700 text-sm">
              <ClockIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Sur-réservé</p>
                <p className="mt-1">Il manque {selectedProduct.stock.reserved - selectedProduct.stock.current} unités pour satisfaire toutes les réservations</p>
              </div>
            </div>
          ) : selectedProduct.stock.current > selectedProduct.stock.min * 3 ? (
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-blue-700 text-sm">
              <ArchiveBoxIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Sur-stock</p>
                <p className="mt-1">Le niveau de stock est très élevé, optimisez votre espace de stockage</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg text-green-700 text-sm">
              <CheckCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Stock sain</p>
                <p className="mt-1">Aucune action requise pour le moment</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  
  {/* Quick Actions Card */}
  <div className="bg-white rounded-xl shadow-sm border border-[#eaeaea] overflow-hidden">
    <div className="p-6 border-b border-[#eaeaea]">
      <h3 className="font-semibold text-[#213f5b]">Actions rapides</h3>
    </div>
    <div className="p-4">
      <div className="grid grid-cols-1 gap-2">
        <Button
          variant="outline"
          className="justify-start h-auto py-3 text-[#213f5b] hover:bg-[#f0f7ff] border-[#eaeaea]"
          onClick={() => handleOpenUpdateModal(selectedProduct)}
        >
          <ShoppingCartIcon className="h-5 w-5 mr-3 text-[#213f5b]" />
          <div className="text-left">
            <div className="font-medium">Ajouter au stock</div>
            <div className="text-xs opacity-75">Enregistrer une entrée de stock</div>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className="justify-start h-auto py-3 text-[#213f5b] hover:bg-[#f0f7ff] border-[#eaeaea]"
          onClick={() => {
            setUpdateForm({
              productId: selectedProduct.id,
              adjustment: 1,
              type: "remove",
              location: selectedProduct.stock.locations?.[0]?.name || "Entrepôt Principal",
              note: "Sortie de stock"
            });
            setIsUpdateModalOpen(true);
          }}
        >
          <ArrowDownIcon className="h-5 w-5 mr-3 text-[#213f5b]" />
          <div className="text-left">
            <div className="font-medium">Retirer du stock</div>
            <div className="text-xs opacity-75">Enregistrer une sortie de stock</div>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className="justify-start h-auto py-3 text-[#213f5b] hover:bg-[#f0f7ff] border-[#eaeaea]"
        >
          <PencilIcon className="h-5 w-5 mr-3 text-[#213f5b]" />
          <div className="text-left">
            <div className="font-medium">Modifier le produit</div>
            <div className="text-xs opacity-75">Modifier les détails du produit</div>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className="justify-start h-auto py-3 text-[#213f5b] hover:bg-[#f0f7ff] border-[#eaeaea]"
        >
          <TruckIcon className="h-5 w-5 mr-3 text-[#213f5b]" />
          <div className="text-left">
            <div className="font-medium">Commander</div>
            <div className="text-xs opacity-75">Créer une commande fournisseur</div>
          </div>
        </Button>
      </div>
    </div>
  </div>
</div>
</motion.div>
);
};

// Main component render
return (
<div className="flex h-screen bg-gradient-to-b from-[#f8fafc] to-[#f0f7ff]">
  <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
    {/* Header would go here */}
    <div className="bg-white border-b border-[#eaeaea] p-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#213f5b]">Gestion des Stocks</h1>
        {/* Other header elements */}
      </div>
    </div>
    
    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="relative">
              <div className="absolute -left-3 md:-left-5 top-1 w-1.5 h-12 bg-gradient-to-b from-[#bfddf9] to-[#d2fcb2] rounded-full"></div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#213f5b] to-[#2c5681] mb-2 pl-2">
                {selectedProduct 
                  ? `Stock: ${selectedProduct.libelle || selectedProduct.reference}` 
                  : activeTab === "dashboard"
                  ? "Tableau de bord des stocks"
                  : activeTab === "available"
                  ? "Stock disponible"
                  : activeTab === "reserved"
                  ? "Produits réservés"
                  : activeTab === "low"
                  ? "Stock bas"
                  : activeTab === "out"
                  ? "Ruptures de stock"
                  : "Gestion des stocks"
                }
              </h1>
              <p className="text-[#213f5b] opacity-75 pl-2">
                {selectedProduct 
                  ? `Référence: ${selectedProduct.reference}` 
                  : activeTab === "dashboard"
                  ? "Vue d'ensemble de votre inventaire"
                  : activeTab === "available"
                  ? `${stockSummary.available} unités disponibles`
                  : activeTab === "reserved"
                  ? `${stockSummary.reserved} unités réservées`
                  : activeTab === "low"
                  ? `${stockSummary.lowStock} produits en stock bas`
                  : activeTab === "out"
                  ? `${stockSummary.outOfStock} produits en rupture`
                  : "Surveillez et gérez les niveaux de stock de vos produits"
                }
              </p>
            </div>
            
            {selectedProduct ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToList}
                  className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] transition-colors rounded-lg px-4 py-2 flex items-center"
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-2" />
                  Retour à la liste
                </Button>
                <Button
                  onClick={() => handleOpenUpdateModal(selectedProduct)}
                  className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Mettre à jour le stock
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] transition-colors rounded-lg px-4 py-2 flex items-center"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
                <Button
                  className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Ajouter un produit
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Tab Navigation (only in list view) */}
        {!selectedProduct && (
          <div className="mb-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex overflow-x-auto hide-scrollbar">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-4 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                    activeTab === "dashboard"
                      ? "text-[#213f5b] border-b-2 border-[#213f5b]"
                      : "text-gray-500 hover:text-[#213f5b] hover:bg-[#f8fafc]"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Tableau de bord
                </button>
                <button
                  onClick={() => setActiveTab("available")}
                  className={`px-4 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                    activeTab === "available"
                      ? "text-[#213f5b] border-b-2 border-[#213f5b]"
                      : "text-gray-500 hover:text-[#213f5b] hover:bg-[#f8fafc]"
                  }`}
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  Disponible
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {stockSummary.available}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("reserved")}
                  className={`px-4 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                    activeTab === "reserved"
                      ? "text-[#213f5b] border-b-2 border-[#213f5b]"
                      : "text-gray-500 hover:text-[#213f5b] hover:bg-[#f8fafc]"
                  }`}
                >
                  <ClockIcon className="h-4 w-4" />
                  Réservé
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {stockSummary.reserved}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("low")}
                  className={`px-4 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                    activeTab === "low"
                      ? "text-[#213f5b] border-b-2 border-[#213f5b]"
                      : "text-gray-500 hover:text-[#213f5b] hover:bg-[#f8fafc]"
                  }`}
                >
                  <BellAlertIcon className="h-4 w-4" />
                  Stock bas
                  <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {stockSummary.lowStock}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("out")}
                  className={`px-4 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                    activeTab === "out"
                      ? "text-[#213f5b] border-b-2 border-[#213f5b]"
                      : "text-gray-500 hover:text-[#213f5b] hover:bg-[#f8fafc]"
                  }`}
                >
                  <ExclamationCircleIcon className="h-4 w-4" />
                  Rupture
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {stockSummary.outOfStock}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("excess")}
                  className={`px-4 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                    activeTab === "excess"
                      ? "text-[#213f5b] border-b-2 border-[#213f5b]"
                      : "text-gray-500 hover:text-[#213f5b] hover:bg-[#f8fafc]"
                  }`}
                >
                  <ArchiveBoxIcon className="h-4 w-4" />
                  Sur-stock
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Search & Filter Bar (only in list view, not on dashboard) */}
        {!selectedProduct && activeTab !== "dashboard" && (
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="w-full md:w-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MagnifyingGlassIcon className="w-5 h-5 text-[#213f5b] opacity-50" />
                </div>
                <input
                  type="search"
                  className="block w-full md:w-80 px-4 py-3 pl-10 text-sm text-[#213f5b] border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                  placeholder="Rechercher par référence, libellé..."
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
            
            <div className="flex flex-wrap gap-2">
              <select
                className="px-3 py-2 border border-[#bfddf9] rounded-lg text-sm text-[#213f5b] focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                className="px-3 py-2 border border-[#bfddf9] rounded-lg text-sm text-[#213f5b] focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                {locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              
              <Button
                variant="outline"
                size="sm"
                className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9]"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setSelectedLocation("");
                }}
              >
                Réinitialiser
              </Button>
              
              <div className="ml-2 inline-flex rounded-md shadow-sm">
                <button 
                  type="button" 
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-2 text-sm font-medium ${
                    viewMode === "table" 
                      ? "text-white bg-[#213f5b] border-[#213f5b]"
                      : "text-[#213f5b] bg-white border-[#bfddf9] hover:bg-[#f0f7ff]"
                  } border rounded-l-lg focus:z-10 focus:outline-none`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                  </svg>
                </button>
                <button 
                  type="button"
                  onClick={() => setViewMode("cards")}
                  className={`px-3 py-2 text-sm font-medium ${
                    viewMode === "cards" 
                      ? "text-white bg-[#213f5b] border-[#213f5b]"
                      : "text-[#213f5b] bg-white border-[#bfddf9] hover:bg-[#f0f7ff]"
                  } border rounded-r-lg focus:z-10 focus:outline-none`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        {renderMainContent()}
      </div>
    </main>
  </div>
  
  {/* Stock Update Modal */}
  <AnimatePresence>
    {isUpdateModalOpen && selectedProduct && (
      <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4"
        >
          <div className="p-6 border-b border-[#eaeaea]">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#213f5b]">Mise à jour du stock</h3>
              <button 
                onClick={() => setIsUpdateModalOpen(false)}
                className="p-2 rounded-full hover:bg-[#f0f7ff] text-[#213f5b]"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#213f5b] mb-1">Produit</label>
                <div className="px-3 py-2 border border-[#eaeaea] rounded-lg bg-[#f8fafc]">
                  <p className="font-medium text-[#213f5b]">{selectedProduct.libelle}</p>
                  <p className="text-xs text-[#213f5b] opacity-75">{selectedProduct.reference}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#213f5b] mb-1">Type d&apos;opération</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setUpdateForm({...updateForm, type: "add"})}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border ${
                      updateForm.type === "add"
                        ? "bg-green-50 border-green-500 text-green-700"
                        : "border-[#eaeaea] text-[#213f5b] hover:bg-[#f0f7ff]"
                    }`}
                  >
                    Entrée
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpdateForm({...updateForm, type: "remove"})}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border ${
                      updateForm.type === "remove"
                        ? "bg-red-50 border-red-500 text-red-700"
                        : "border-[#eaeaea] text-[#213f5b] hover:bg-[#f0f7ff]"
                    }`}
                  >
                    Sortie
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpdateForm({...updateForm, type: "set"})}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border ${
                      updateForm.type === "set"
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "border-[#eaeaea] text-[#213f5b] hover:bg-[#f0f7ff]"
                    }`}
                  >
                    Définir
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="adjustment">
                  {updateForm.type === "add" 
                    ? "Quantité à ajouter" 
                    : updateForm.type === "remove" 
                    ? "Quantité à retirer" 
                    : "Nouvelle quantité"
                  }
                </label>
                <input
                  id="adjustment"
                  type="number"
                  min="0"
                  value={updateForm.adjustment}
                  onChange={(e) => setUpdateForm({...updateForm, adjustment: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="location">
                  Emplacement
                </label>
                <select
                  id="location"
                  value={updateForm.location}
                  onChange={(e) => setUpdateForm({...updateForm, location: e.target.value})}
                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                >
                  {selectedProduct.stock.locations?.map((location, index) => (
                    <option key={index} value={location.name}>
                      {location.name} ({location.quantity} en stock)
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="note">
                  Note (optionnel)
                </label>
                <textarea
                  id="note"
                  value={updateForm.note}
                  onChange={(e) => setUpdateForm({...updateForm, note: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                  placeholder="Ajoutez une note pour cette opération..."
                />
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-[#eaeaea] bg-[#f8fafc] flex justify-end gap-3 rounded-b-xl">
            <Button
              variant="outline"
              className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9]"
              onClick={() => setIsUpdateModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              className="bg-[#213f5b] hover:bg-[#152a3d] text-white"
              onClick={handleUpdateStock}
            >
              Confirmer
            </Button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
</div>
);
};

export default StockManagementDashboard;