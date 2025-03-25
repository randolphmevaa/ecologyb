"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowsUpDownIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  PlusIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  ArchiveBoxIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  CubeIcon,
  ShoppingCartIcon,
  TruckIcon,
  TagIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  PencilIcon,
  BellAlertIcon,
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
  imageUrl?: string; // Added image URL property
  details: Record<string, string | number | boolean | undefined>;
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

const SAMPLE_PRODUCTS = [
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

// Generate stock data for sample products
const STOCK_PRODUCTS: StockProduct[] = SAMPLE_PRODUCTS.map(product => ({
  ...product,
  stock: {
    current: Math.floor(Math.random() * 100),
    min: Math.floor(Math.random() * 20),
    ordered: Math.floor(Math.random() * 50),
    reserved: Math.floor(Math.random() * 10),
    incoming: Math.floor(Math.random() * 30),
    lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    locations: [
      { name: "Entrepôt Principal", quantity: Math.floor(Math.random() * 50) },
      { name: "Magasin Paris", quantity: Math.floor(Math.random() * 30) },
      { name: "Magasin Lyon", quantity: Math.floor(Math.random() * 20) }
    ],
    history: Array.from({ length: 5 }, () => ({
      date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      type: ["in", "out", "adjustment"][Math.floor(Math.random() * 3)] as "in" | "out" | "adjustment",
      quantity: Math.floor(Math.random() * 20),
      note: ["Livraison fournisseur", "Commande client", "Inventaire", "Retour client", "Ajustement manuel"][Math.floor(Math.random() * 5)]
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
}));

// Stock form state interface
interface StockUpdateForm {
  productId: string;
  adjustment: number;
  type: "add" | "remove" | "set";
  location: string;
  note: string;
}

export default function StockPage() {
  // States
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");
  const [sortBy, setSortBy] = useState<{ field: string; direction: "asc" | "desc" }>({ field: "reference", direction: "asc" });
  const [viewMode, setViewMode] = useState<"cards" | "table" | "detail">("cards");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [stockProducts, setStockProducts] = useState<StockProduct[]>(STOCK_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<StockProduct | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(9);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [updateForm, setUpdateForm] = useState<StockUpdateForm>({
    productId: "",
    adjustment: 0,
    type: "add",
    location: "Entrepôt Principal",
    note: ""
  });
  
  // Derived state
  const uniqueCategories = useMemo(() => {
    const categories = new Set(stockProducts.map(p => p.categorie));
    return ["Tous", ...Array.from(categories)];
  }, [stockProducts]);
  
  const locations = useMemo(() => {
    const locationSet = new Set<string>();
    stockProducts.forEach(product => {
      product.stock.locations?.forEach(location => {
        locationSet.add(location.name);
      });
    });
    return ["Tous emplacements", ...Array.from(locationSet)];
  }, [stockProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return stockProducts
      .filter(product => {
        // Search term filter
        const matchesSearch = 
          product.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.marque.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Category filter
        const matchesCategory = selectedCategory === "" || selectedCategory === "Tous" || product.categorie === selectedCategory;
        
        // Stock filter
        let matchesStockFilter = true;
        if (stockFilter === "low") {
          matchesStockFilter = product.stock.current <= product.stock.min;
        } else if (stockFilter === "out") {
          matchesStockFilter = product.stock.current === 0;
        }
        
        // Location filter
        let matchesLocation = true;
        if (selectedLocation && selectedLocation !== "Tous emplacements") {
          matchesLocation = product.stock.locations?.some(
            location => location.name === selectedLocation
          ) || false;
        }
        
        return matchesSearch && matchesCategory && matchesStockFilter && matchesLocation;
      })
      .sort((a, b) => {
        // Dynamic sorting based on current sort field and direction
        const { field, direction } = sortBy;
        
        let valueA, valueB;
        
        if (field === "stock") {
          valueA = a.stock.current;
          valueB = b.stock.current;
        } else if (field === "price") {
          valueA = a.prixTTC;
          valueB = b.prixTTC;
        } else if (field === "reference") {
          valueA = a.reference;
          valueB = b.reference;
        } else if (field === "name") {
          valueA = a.libelle;
          valueB = b.libelle;
        } else if (field === "lastUpdated") {
          valueA = new Date(a.stock.lastUpdated).getTime();
          valueB = new Date(b.stock.lastUpdated).getTime();
        } else {
          valueA = a[field as keyof StockProduct];
          valueB = b[field as keyof StockProduct];
        }
        
        if (direction === "asc") {
          return typeof valueA === "string" && typeof valueB === "string"
            ? valueA.localeCompare(valueB)
            : (valueA as number) - (valueB as number);
        } else {
          return typeof valueA === "string" && typeof valueB === "string"
            ? valueB.localeCompare(valueA)
            : (valueB as number) - (valueA as number);
        }
      });
  }, [stockProducts, searchTerm, selectedCategory, stockFilter, selectedLocation, sortBy]);
  
  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handlers
  const handleSort = (field: string) => {
    setSortBy({
      field,
      direction: sortBy.field === field && sortBy.direction === "asc" ? "desc" : "asc"
    });
  };
  
  const handleViewProduct = (product: StockProduct) => {
    setSelectedProduct(product);
    setViewMode("detail");
  };
  
  const handleBackToList = () => {
    setSelectedProduct(null);
    setViewMode("cards");
  };
  
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
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
        const historyEntry = {
            date: new Date().toISOString(),
            type: updateForm.type === "add" ? "in" : updateForm.type === "remove" ? "out" : "adjustment" as "in" | "out" | "adjustment",
            quantity: updateForm.adjustment,
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
    
    // Also update selectedProduct if in detail view
    if (selectedProduct && selectedProduct.id === updateForm.productId) {
      const updatedProduct = updatedProducts.find(p => p.id === updateForm.productId);
      if (updatedProduct) {
        setSelectedProduct(updatedProduct);
      }
    }
  };
  
  // Render stock status indicator with appropriate color and icon
  const renderStockStatus = (product: StockProduct) => {
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
    } else {
      return (
        <div className="flex items-center gap-1 text-green-500">
          <CheckCircleIcon className="h-4 w-4" />
          <span className="text-xs font-medium">En stock</span>
        </div>
      );
    }
  };
  
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Calculate stock health percentage
  const calculateStockHealth = (product: StockProduct) => {
    const { current, min } = product.stock;
    if (min === 0) return 100;
    
    const ratio = current / min;
    if (ratio >= 2) return 100;
    if (ratio <= 0) return 0;
    
    return Math.round(ratio * 50);
  };
  
  // Render summary cards
  const renderSummaryCards = () => {
    // Calculate summary statistics
    const totalStock = stockProducts.reduce((sum, product) => sum + product.stock.current, 0);
    const totalProducts = stockProducts.length;
    const reservedProducts = stockProducts.reduce((sum, product) => sum + product.stock.reserved, 0);
    // This is a placeholder since there's no "installed" field in the data
    // We could use a fake calculation or add this field to the data model
    const installedProducts = stockProducts.reduce((sum, product) => {
      // For demo purposes, let's say 40% of products that aren't in stock or reserved have been installed
      const potentiallyInstalled = Math.floor((product.quantite - product.stock.current - product.stock.reserved) * 0.4);
      return sum + Math.max(0, potentiallyInstalled);
    }, 0);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-[#eaeaea]"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-[#213f5b] opacity-75">Produits totaux</p>
              <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{totalProducts}</h3>
              <p className="text-xs text-[#213f5b] opacity-75 mt-1">
                {totalStock} unités en stock
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <ArchiveBoxIcon className="h-6 w-6 text-[#213f5b]" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#eaeaea]">
            <div className="flex items-center gap-1 text-green-500 text-xs">
              <ArrowTrendingUpIcon className="h-3 w-3" />
              <span>+3% depuis le mois dernier</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-[#eaeaea]"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-[#213f5b] opacity-75">Produit en stock</p>
              <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{totalStock}</h3>
              <p className="text-xs text-[#213f5b] opacity-75 mt-1">
                {stockProducts.filter(p => p.stock.current > 0).length} produits disponibles
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#eaeaea]">
            <div className="flex items-center gap-1 text-green-500 text-xs">
              <ArrowTrendingUpIcon className="h-3 w-3" />
              <span>+2.5% depuis le mois dernier</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-[#eaeaea]"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-[#213f5b] opacity-75">Produit réservé</p>
              <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{reservedProducts}</h3>
              <p className="text-xs text-[#213f5b] opacity-75 mt-1">
                {stockProducts.filter(p => p.stock.reserved > 0).length} produits avec réservations
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <ClockIcon className="h-6 w-6 text-amber-500" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#eaeaea]">
            <div className="flex items-center gap-1 text-amber-500 text-xs">
              <span>En attente de livraison</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-[#eaeaea]"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-[#213f5b] opacity-75">Produit installé</p>
              <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{installedProducts}</h3>
              <p className="text-xs text-[#213f5b] opacity-75 mt-1">
                {Math.round(installedProducts / (totalProducts * 0.4) * 100)}% du total
              </p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <TagIcon className="h-6 w-6 text-indigo-500" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#eaeaea]">
            <div className="flex items-center gap-1 text-indigo-500 text-xs">
              <CheckCircleIcon className="h-3 w-3" />
              <span>Projets complétés</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };
  
  // Main render
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
                  <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#213f5b] to-[#2c5681] mb-2 pl-2">
                    {viewMode === "detail" && selectedProduct 
                      ? `Stock: ${selectedProduct.libelle || selectedProduct.reference}` 
                      : "Gestion des Stocks"}
                  </h1>
                  <p className="text-[#213f5b] opacity-75 pl-2">
                    {viewMode === "detail" && selectedProduct 
                      ? `Référence: ${selectedProduct.reference}` 
                      : "Surveillez et gérez les niveaux de stock de vos produits"}
                  </p>
                  <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-[#bfddf9] opacity-10 rounded-full blur-3xl"></div>
                </div>
                
                {viewMode !== "detail" ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsExportModalOpen(true)}
                      className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] transition-colors rounded-lg px-4 py-2 flex items-center"
                    >
                      <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                      Exporter
                    </Button>
                    <Button
                      onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                      variant="outline"
                      size="sm" 
                      className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] transition-colors rounded-lg px-4 py-2 flex items-center"
                    >
                      <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                      Filtres
                    </Button>
                    <Button
                      className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Ajouter un produit
                    </Button>
                  </div>
                ) : (
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
                    {selectedProduct && (
                      <Button
                        onClick={() => handleOpenUpdateModal(selectedProduct)}
                        className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                      >
                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                        Mettre à jour le stock
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Summary Cards - Only show in list view */}
            {viewMode !== "detail" && renderSummaryCards()}
            
            {/* Main Content */}
            <div className="space-y-6">
              {/* Filters and Search - Only show in list view */}
              {viewMode !== "detail" && (
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  {/* Search Bar */}
                  <div className="w-full md:w-auto">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon className="w-5 h-5 text-[#213f5b] opacity-50" />
                      </div>
                      <input
                        type="search"
                        className="block w-full md:w-80 px-4 py-3 pl-10 text-sm text-[#213f5b] border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                        placeholder="Rechercher par référence, libellé, description..."
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
                  
                  {/* Quick Filters */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={stockFilter === "all" ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setStockFilter("all")}
                      className={stockFilter === "all" 
                        ? "bg-[#213f5b] text-white" 
                        : "border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9]"
                      }
                    >
                      Tous
                    </Button>
                    <Button
                      variant={stockFilter === "low" ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setStockFilter("low")}
                      className={stockFilter === "low" 
                        ? "bg-amber-500 text-white border-amber-500" 
                        : "border-amber-200 text-amber-600 hover:bg-amber-50"
                      }
                    >
                      Stock bas
                    </Button>
                    <Button
                      variant={stockFilter === "out" ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setStockFilter("out")}
                      className={stockFilter === "out" 
                        ? "bg-red-500 text-white border-red-500" 
                        : "border-red-200 text-red-600 hover:bg-red-50"
                      }
                    >
                      Rupture
                    </Button>
                    
                    {/* View Toggle */}
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
              
              {/* Filter Drawer */}
              <AnimatePresence>
                {isFilterDrawerOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white p-5 rounded-xl shadow-sm mb-6 border border-[#eaeaea]">
                      <h3 className="font-medium text-[#213f5b] mb-4">Filtres avancés</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#213f5b] mb-1">Catégorie</label>
                          <select
                            className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                          >
                            {uniqueCategories.map((category) => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#213f5b] mb-1">Emplacement</label>
                          <select
                            className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                          >
                            {locations.map((location) => (
                              <option key={location} value={location}>{location}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#213f5b] mb-1">Trier par</label>
                          <select
                            className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                            value={`${sortBy.field}-${sortBy.direction}`}
                            onChange={(e) => {
                              const [field, direction] = e.target.value.split('-');
                              setSortBy({
                                field,
                                direction: direction as 'asc' | 'desc'
                              });
                            }}
                          >
                            <option value="reference-asc">Référence (A-Z)</option>
                            <option value="reference-desc">Référence (Z-A)</option>
                            <option value="name-asc">Nom (A-Z)</option>
                            <option value="name-desc">Nom (Z-A)</option>
                            <option value="stock-desc">Stock (élevé à bas)</option>
                            <option value="stock-asc">Stock (bas à élevé)</option>
                            <option value="price-desc">Prix (élevé à bas)</option>
                            <option value="price-asc">Prix (bas à élevé)</option>
                            <option value="lastUpdated-desc">Dernière mise à jour (récente)</option>
                            <option value="lastUpdated-asc">Dernière mise à jour (ancienne)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCategory("");
                            setSelectedLocation("");
                            setSortBy({ field: "reference", direction: "asc" });
                            setStockFilter("all");
                            setSearchTerm("");
                          }}
                          className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] mr-2"
                        >
                          Réinitialiser
                        </Button>
                        <Button
                          onClick={() => setIsFilterDrawerOpen(false)}
                          className="bg-[#213f5b] hover:bg-[#152a3d] text-white"
                        >
                          Appliquer
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Detail View */}
              {viewMode === "detail" && selectedProduct && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {/* Product Info */}
                  <div className="md:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#eaeaea]">
                    <div className="p-6 border-b border-[#eaeaea] bg-gradient-to-r from-white to-[#f8fafc]">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#bfddf9] bg-opacity-70 rounded-lg">
                          {/* Add product logo based on category */}
                          {selectedProduct.categorie === "MONO GESTE" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#213f5b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          ) : selectedProduct.categorie === "PANNEAUX PHOTOVOLTAIQUE" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#213f5b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          ) : (
                            <CubeIcon className="h-8 w-8 text-[#213f5b]" />
                          )}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-[#213f5b]">{selectedProduct.libelle}</h2>
                          <p className="text-[#213f5b] opacity-75">{selectedProduct.reference}</p>
                        </div>
                        <div className="ml-auto">
                          {renderStockStatus(selectedProduct)}
                        </div>
                      </div>
                    </div>
                      
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-6 mb-6">
                          <div>
                            <h3 className="text-sm font-semibold text-[#213f5b] mb-4">Détails du stock</h3>
                            <dl className="space-y-3">
                              <div className="flex justify-between">
                                <dt className="text-sm text-[#213f5b] opacity-75">Disponible</dt>
                                <dd className="text-sm font-medium text-[#213f5b]">{selectedProduct.stock.current} {selectedProduct.unite}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm text-[#213f5b] opacity-75">Stock minimum</dt>
                                <dd className="text-sm font-medium text-[#213f5b]">{selectedProduct.stock.min} {selectedProduct.unite}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm text-[#213f5b] opacity-75">Commandé</dt>
                                <dd className="text-sm font-medium text-[#213f5b]">{selectedProduct.stock.ordered} {selectedProduct.unite}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm text-[#213f5b] opacity-75">Réservé</dt>
                                <dd className="text-sm font-medium text-[#213f5b]">{selectedProduct.stock.reserved} {selectedProduct.unite}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm text-[#213f5b] opacity-75">En attente</dt>
                                <dd className="text-sm font-medium text-[#213f5b]">{selectedProduct.stock.incoming} {selectedProduct.unite}</dd>
                              </div>
                            </dl>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-semibold text-[#213f5b] mb-4">Informations produit</h3>
                            <dl className="space-y-3">
                              <div className="flex justify-between">
                                <dt className="text-sm text-[#213f5b] opacity-75">Catégorie</dt>
                                <dd className="text-sm font-medium text-[#213f5b]">{selectedProduct.categorie}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm text-[#213f5b] opacity-75">Prix unitaire</dt>
                                <dd className="text-sm font-medium text-[#213f5b]">{selectedProduct.prixTTC.toLocaleString()} €</dd>
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
                                  {(selectedProduct.stock.current * selectedProduct.prixTTC).toLocaleString()} €
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <h3 className="text-sm font-semibold text-[#213f5b] mb-4">Description</h3>
                          <p className="text-sm text-[#213f5b]">{selectedProduct.description}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-semibold text-[#213f5b] mb-4">Emplacements</h3>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-[#eaeaea]">
                              <thead>
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                                    Emplacement
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                                    Quantité
                                  </th>
                                  <th className="px-4 py-3 text-right text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#eaeaea]">
                                {selectedProduct.stock.locations?.map((location, index) => (
                                  <tr key={index} className="hover:bg-[#f8fafc]">
                                    <td className="px-4 py-3 text-sm text-[#213f5b]">
                                      {location.name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-[#213f5b]">
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
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#eaeaea] mt-6">
                      <div className="p-6 border-b border-[#eaeaea]">
                        <h3 className="font-semibold text-[#213f5b]">Historique des mouvements</h3>
                      </div>
                      <div className="p-6">
                        <div className="flow-root">
                          <ul className="-mb-8">
                            {selectedProduct.stock.history?.slice(0, 10).map((event, index) => (
                              <li key={index}>
                                <div className="relative pb-8">
                                  {index !== selectedProduct.stock.history!.length - 1 && (
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
                                            ? `Entrée de ${event.quantity} ${selectedProduct.unite}` 
                                            : event.type === "out" 
                                            ? `Sortie de ${event.quantity} ${selectedProduct.unite}` 
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
                          
                          <Button
                            variant="outline"
                            className="justify-start h-auto py-3 text-[#213f5b] hover:bg-[#f0f7ff] border-[#eaeaea]"
                          >
                            <TagIcon className="h-5 w-5 mr-3 text-[#213f5b]" />
                            <div className="text-left">
                              <div className="font-medium">Imprimer étiquettes</div>
                              <div className="text-xs opacity-75">Générer des étiquettes de stock</div>
                            </div>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {viewMode === "cards" && (
                <>
                  {paginatedProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-[#213f5b]">
                      <ArchiveBoxIcon className="h-16 w-16 mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
                      <p className="text-sm opacity-75 mb-6">Modifiez vos critères de recherche ou ajoutez de nouveaux produits</p>
                      <Button
                        className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Ajouter un produit
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {paginatedProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-white rounded-xl border border-[#eaeaea] shadow-sm hover:shadow-md hover:border-[#bfddf9] transition-all group overflow-hidden"
                          whileHover={{ y: -4 }}
                        >
                          {/* Product Image Section - Using product-specific images */}
                          <div className="relative h-48 overflow-hidden bg-gradient-to-r from-[#f0f7ff] to-[#f8fafc] flex items-center justify-center">
                            <div className="absolute top-2 right-2 z-10">
                              {renderStockStatus(product)}
                            </div>
                            
                            {/* Use the product's imageUrl if available, otherwise use a fallback based on category */}
                            <img 
                              src={product.imageUrl || (
                                product.categorie === "PANNEAUX PHOTOVOLTAIQUE" 
                                  ? "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80"
                                  : "https://images.unsplash.com/photo-1643241281835-54659c3c6286?auto=format&fit=crop&w=800&q=80"
                              )} 
                              alt={product.libelle} 
                              className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105"
                              // onError={(e) => {
                              //   // Fallback if image fails to load
                              //   e.target.src = "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=800&q=80";
                              // }}
                            />
                            
                            {/* Category Badge */}
                            <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 rounded-full px-3 py-1 text-xs font-medium text-[#213f5b] shadow-sm">
                              {product.categorie}
                            </div>
                            
                            {/* Brand Badge */}
                            <div className="absolute bottom-2 right-2 bg-[#213f5b] bg-opacity-90 rounded-full px-3 py-1 text-xs font-medium text-white shadow-sm">
                              {product.marque}
                            </div>
                          </div>
                          
                          {/* Product Info Section */}
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-bold text-[#213f5b] text-lg line-clamp-1">{product.libelle || product.reference}</h3>
                                <p className="text-xs text-[#213f5b] opacity-75">{product.reference}</p>
                              </div>
                              <div className="text-[#213f5b] font-bold text-lg">
                                {product.prixTTC.toLocaleString()} €
                              </div>
                            </div>
                            <p className="text-sm text-[#213f5b] opacity-75 line-clamp-2 mb-3">{product.description}</p>
                            
                            {/* Stock Information - Improved layout */}
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div className="bg-[#f8fafc] rounded-lg p-2 text-center">
                                <p className="text-xs text-[#213f5b] opacity-75">Stock actuel</p>
                                <p className="font-semibold text-[#213f5b]">
                                  {product.stock.current} <span className="text-xs">{product.unite}</span>
                                </p>
                              </div>
                              <div className="bg-[#f8fafc] rounded-lg p-2 text-center">
                                <p className="text-xs text-[#213f5b] opacity-75">Stock minimum</p>
                                <p className="font-semibold text-[#213f5b]">
                                  {product.stock.min} <span className="text-xs">{product.unite}</span>
                                </p>
                              </div>
                            </div>
                            
                            {/* Stock Level Bar */}
                            <div className="mb-4">
                              <div className="flex justify-between mb-1">
                                <span className="text-xs font-medium text-[#213f5b]">Niveau de stock</span>
                                <span className="text-xs text-[#213f5b] opacity-75">
                                  {calculateStockHealth(product)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    calculateStockHealth(product) > 66
                                      ? "bg-green-500"
                                      : calculateStockHealth(product) > 33
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${calculateStockHealth(product)}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            {/* Actions Section */}
                            <div className="flex justify-between items-center pt-2 border-t border-[#eaeaea]">
                              <div className="text-xs text-[#213f5b] opacity-75">
                                Mis à jour le {formatDate(product.stock.lastUpdated).split(' ')[0]}
                              </div>
                              
                              <div className="flex gap-2">
                                <button 
                                  className="p-2 rounded-full text-[#213f5b] hover:bg-[#bfddf9] transition-colors"
                                  onClick={() => handleOpenUpdateModal(product)}
                                  title="Mettre à jour le stock"
                                >
                                  <ArrowPathIcon className="h-4 w-4" />
                                </button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] flex items-center"
                                  onClick={() => handleViewProduct(product)}
                                >
                                  <EyeIcon className="h-4 w-4 mr-1" />
                                  Détails
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {viewMode === "table" && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#eaeaea]">
                      <thead className="bg-[#f8fafc]">
                        <tr>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                            Logo
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-4 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider cursor-pointer hover:bg-[#f0f7ff]"
                            onClick={() => handleSort("reference")}
                          >
                            <div className="flex items-center">
                              Référence
                              {sortBy.field === "reference" && (
                                sortBy.direction === "asc" ? 
                                <ArrowUpIcon className="h-4 w-4 ml-1" /> : 
                                <ArrowDownIcon className="h-4 w-4 ml-1" />
                              )}
                            </div>
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-4 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider cursor-pointer hover:bg-[#f0f7ff]"
                            onClick={() => handleSort("name")}
                          >
                            <div className="flex items-center">
                              Libellé
                              {sortBy.field === "name" && (
                                sortBy.direction === "asc" ? 
                                <ArrowUpIcon className="h-4 w-4 ml-1" /> : 
                                <ArrowDownIcon className="h-4 w-4 ml-1" />
                              )}
                            </div>
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-4 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider cursor-pointer hover:bg-[#f0f7ff]"
                            onClick={() => handleSort("stock")}
                          >
                            <div className="flex items-center">
                              Stock
                              {sortBy.field === "stock" && (
                                sortBy.direction === "asc" ? 
                                <ArrowUpIcon className="h-4 w-4 ml-1" /> : 
                                <ArrowDownIcon className="h-4 w-4 ml-1" />
                              )}
                            </div>
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-4 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider"
                          >
                            Statut
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-4 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider cursor-pointer hover:bg-[#f0f7ff]"
                            onClick={() => handleSort("price")}
                          >
                            <div className="flex items-center">
                              Prix
                              {sortBy.field === "price" && (
                                sortBy.direction === "asc" ? 
                                <ArrowUpIcon className="h-4 w-4 ml-1" /> : 
                                <ArrowDownIcon className="h-4 w-4 ml-1" />
                              )}
                            </div>
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-4 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider cursor-pointer hover:bg-[#f0f7ff]"
                            onClick={() => handleSort("categorie")}
                          >
                            <div className="flex items-center">
                              Catégorie
                              {sortBy.field === "categorie" && (
                                sortBy.direction === "asc" ? 
                                <ArrowUpIcon className="h-4 w-4 ml-1" /> : 
                                <ArrowDownIcon className="h-4 w-4 ml-1" />
                              )}
                            </div>
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-4 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider cursor-pointer hover:bg-[#f0f7ff]"
                            onClick={() => handleSort("lastUpdated")}
                          >
                            <div className="flex items-center">
                              Dernière mise à jour
                              {sortBy.field === "lastUpdated" && (
                                sortBy.direction === "asc" ? 
                                <ArrowUpIcon className="h-4 w-4 ml-1" /> : 
                                <ArrowDownIcon className="h-4 w-4 ml-1" />
                              )}
                            </div>
                          </th>
                          <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-[#eaeaea]">
                        {paginatedProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-[#f8fafc] transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="p-2 bg-[#bfddf9] bg-opacity-50 rounded-lg inline-flex">
                                {/* Add product logo based on category or brand */}
                                {product.categorie === "MONO GESTE" ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#213f5b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                ) : product.categorie === "PANNEAUX PHOTOVOLTAIQUE" ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#213f5b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                  </svg>
                                ) : (
                                  <CubeIcon className="h-5 w-5 text-[#213f5b]" />
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#213f5b]">
                              {product.reference}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#213f5b]">
                              {product.libelle}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="mr-2">
                                  <span className="text-sm font-medium text-[#213f5b]">{product.stock.current}</span>
                                  <span className="text-xs text-[#213f5b] opacity-75"> / {product.stock.min} min</span>
                                </div>
                                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className={`h-1.5 rounded-full ${
                                      calculateStockHealth(product) > 66
                                        ? "bg-green-500"
                                        : calculateStockHealth(product) > 33
                                        ? "bg-amber-500"
                                        : "bg-red-500"
                                    }`}
                                    style={{ width: `${calculateStockHealth(product)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {renderStockStatus(product)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#213f5b]">
                              {product.prixTTC.toLocaleString()} €
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#213f5b] bg-opacity-10 text-[#213f5b]">
                                {product.categorie}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#213f5b] opacity-75">
                              {formatDate(product.stock.lastUpdated)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <button 
                                  className="p-1.5 rounded-full text-[#213f5b] hover:bg-[#bfddf9] transition-colors"
                                  onClick={() => handleOpenUpdateModal(product)}
                                >
                                  <ArrowPathIcon className="h-4 w-4" />
                                </button>
                                <button 
                                  className="p-1.5 rounded-full text-[#213f5b] hover:bg-[#bfddf9] transition-colors"
                                  onClick={() => handleViewProduct(product)}
                                >
                                  <EyeIcon className="h-4 w-4" />
                                </button>
                                <button 
                                  className="p-1.5 rounded-full text-[#213f5b] hover:bg-[#bfddf9] transition-colors"
                                >
                                  <EllipsisHorizontalIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Pagination - Only in list views */}
              {viewMode !== "detail" && totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <Button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-4 py-2 border border-[#bfddf9] text-sm font-medium rounded-md ${
                        currentPage === 1
                          ? "text-gray-400 bg-gray-50"
                          : "text-[#213f5b] bg-white hover:bg-[#bfddf9]"
                      }`}
                    >
                      Précédent
                    </Button>
                    <Button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-4 py-2 border border-[#bfddf9] text-sm font-medium rounded-md ${
                        currentPage === totalPages
                          ? "text-gray-400 bg-gray-50"
                          : "text-[#213f5b] bg-white hover:bg-[#bfddf9]"
                      }`}
                    >
                      Suivant
                    </Button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-[#213f5b]">
                        Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{" "}
                        <span className="font-medium">
                          {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
                        </span>{" "}
                        sur <span className="font-medium">{filteredProducts.length}</span> résultats
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-[#bfddf9] bg-white text-sm font-medium ${
                            currentPage === 1
                              ? "text-gray-400"
                              : "text-[#213f5b] hover:bg-[#bfddf9]"
                          }`}
                        >
                          <span className="sr-only">Précédent</span>
                          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            // Show all pages if 5 or fewer
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            // Near the start
                            pageNum = i + 1;
                            if (i === 4) pageNum = totalPages;
                          } else if (currentPage >= totalPages - 2) {
                            // Near the end
                            pageNum = totalPages - 4 + i;
                            if (i === 0) pageNum = 1;
                          } else {
                            // Middle
                            pageNum = currentPage - 2 + i;
                            if (i === 0) pageNum = 1;
                            if (i === 4) pageNum = totalPages;
                          }
                          
                          // Add ellipsis
                          if ((i === 1 && pageNum !== 2) || (i === 3 && pageNum !== totalPages - 1)) {
                            return (
                              <span
                                key={i}
                                className="relative inline-flex items-center px-4 py-2 border border-[#bfddf9] bg-white text-sm font-medium text-[#213f5b]"
                              >
                                ...
                              </span>
                            );
                          }
                          
                          return (
                            <button
                              key={i}
                              onClick={() => handlePageChange(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border border-[#bfddf9] text-sm font-medium ${
                                currentPage === pageNum
                                  ? "bg-[#213f5b] text-white"
                                  : "bg-white text-[#213f5b] hover:bg-[#bfddf9]"
                              }`}
                              aria-current={currentPage === pageNum ? "page" : undefined}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-[#bfddf9] bg-white text-sm font-medium ${
                            currentPage === totalPages
                              ? "text-gray-400"
                              : "text-[#213f5b] hover:bg-[#bfddf9]"
                          }`}
                        >
                          <span className="sr-only">Suivant</span>
                          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
      
      {/* Export Modal */}
      <AnimatePresence>
        {isExportModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4"
            >
              <div className="p-6 border-b border-[#eaeaea]">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-[#213f5b]">Exporter les données de stock</h3>
                  <button 
                    onClick={() => setIsExportModalOpen(false)}
                    className="p-2 rounded-full hover:bg-[#f0f7ff] text-[#213f5b]"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#213f5b] mb-2">Format d&apos;export</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        className="flex flex-col items-center justify-center px-3 py-4 text-sm font-medium rounded-lg border border-[#bfddf9] text-[#213f5b] hover:bg-[#f0f7ff]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <path d="M8 13H12V20H8z"/>
                          <path d="M16 13H12V20H16z"/>
                        </svg>
                        <span>Excel (.xlsx)</span>
                      </button>
                      <button
                        type="button"
                        className="flex flex-col items-center justify-center px-3 py-4 text-sm font-medium rounded-lg border border-[#bfddf9] text-[#213f5b] hover:bg-[#f0f7ff]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="8" y1="13" x2="16" y2="13"/>
                          <line x1="8" y1="17" x2="16" y2="17"/>
                          <line x1="8" y1="9" x2="10" y2="9"/>
                        </svg>
                        <span>CSV (.csv)</span>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#213f5b] mb-2">Options d&apos;export</label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="current-filter"
                          type="checkbox"
                          className="h-4 w-4 text-[#213f5b] border-[#bfddf9] rounded focus:ring-[#213f5b]"
                          defaultChecked
                        />
                        <label htmlFor="current-filter" className="ml-2 text-sm text-[#213f5b]">
                          Appliquer les filtres actuels
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="include-details"
                          type="checkbox"
                          className="h-4 w-4 text-[#213f5b] border-[#bfddf9] rounded focus:ring-[#213f5b]"
                          defaultChecked
                        />
                        <label htmlFor="include-details" className="ml-2 text-sm text-[#213f5b]">
                          Inclure les détails de produit complets
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="include-history"
                          type="checkbox"
                          className="h-4 w-4 text-[#213f5b] border-[#bfddf9] rounded focus:ring-[#213f5b]"
                        />
                        <label htmlFor="include-history" className="ml-2 text-sm text-[#213f5b]">
                          Inclure l&apos;historique des mouvements
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="include-locations"
                          type="checkbox"
                          className="h-4 w-4 text-[#213f5b] border-[#bfddf9] rounded focus:ring-[#213f5b]"
                          defaultChecked
                        />
                        <label htmlFor="include-locations" className="ml-2 text-sm text-[#213f5b]">
                          Inclure les détails des emplacements
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#213f5b] mb-2">Période</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="start-date" className="block text-xs text-[#213f5b] mb-1">
                          Date de début
                        </label>
                        <input
                          id="start-date"
                          type="date"
                          className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b] text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="end-date" className="block text-xs text-[#213f5b] mb-1">
                          Date de fin
                        </label>
                        <input
                          id="end-date"
                          type="date"
                          className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b] text-sm"
                          defaultValue={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-[#eaeaea] bg-[#f8fafc] flex justify-end gap-3 rounded-b-xl">
                <Button
                  variant="outline"
                  className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9]"
                  onClick={() => setIsExportModalOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  className="bg-[#213f5b] hover:bg-[#152a3d] text-white"
                  onClick={() => {
                    // Handle export logic here
                    setIsExportModalOpen(false);
                  }}
                >
                  Exporter
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
