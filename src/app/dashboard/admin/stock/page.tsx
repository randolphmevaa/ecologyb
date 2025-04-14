'use client';

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MagnifyingGlassIcon, XMarkIcon, 
  ArrowDownIcon,   PlusIcon, 
  ArrowPathIcon, ArchiveBoxIcon, 
  CheckCircleIcon, ClockIcon, DocumentArrowDownIcon, 
  ChevronLeftIcon, ChevronRightIcon, 
  CubeIcon, ShoppingCartIcon, TruckIcon, EyeIcon, PencilIcon,
  UsersIcon 
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
  productType: string; // Added for categorizing products (PAC Air/Eau, Poêle à granulés, etc.)
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

// Client interface for reservation information
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
}

// Reservation interface
interface Reservation {
  id: string;
  clientId: string;
  productId: string;
  quantity: number;
  dateReserved: string;
  expectedDelivery?: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  notes?: string;
  surCommande: boolean;
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
    reservations?: Reservation[]; // Added for client reservation info
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

// SAMPLE CLIENTS
const SAMPLE_CLIENTS: Client[] = [
  {
    id: "C001",
    name: "Martin Dupont",
    email: "martin.dupont@example.com",
    phone: "06 12 34 56 78",
    company: "Résidences Modernes",
    address: "15 Rue du Commerce, 75015 Paris"
  },
  {
    id: "C002",
    name: "Sophie Laurent",
    email: "sophie.laurent@example.com",
    phone: "07 23 45 67 89",
    company: "Eco-Habitat",
    address: "42 Avenue des Fleurs, 69002 Lyon"
  },
  {
    id: "C003",
    name: "Thomas Petit",
    email: "thomas.petit@example.com",
    phone: "06 34 56 78 90",
    address: "8 Rue des Artisans, 33000 Bordeaux"
  },
  {
    id: "C004",
    name: "Isabelle Moreau",
    email: "isabelle.moreau@example.com",
    phone: "07 45 67 89 01",
    company: "Constructions Durables",
    address: "27 Boulevard Principal, 59000 Lille"
  },
  {
    id: "C005",
    name: "Pierre Simon",
    email: "pierre.simon@example.com",
    phone: "06 56 78 90 12",
    address: "53 Rue du Marché, 44000 Nantes"
  }
];

// SAMPLE DATA with product types
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
    productType: "PAC Air/Eau",
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
    productType: "PAC Air/Air",
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
    productType: "Poêle à granulés",
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
    productType: "Chauffe-eau thermodynamique",
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
    productType: "Système solaire",
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
    productType: "Chauffe-eau solaire",
    imageUrl: "https://images.unsplash.com/photo-1622219970016-09f07c1eed36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: {
      capaciteStockage: "300",
      efficaciteEnergetique: "B",
      surfaceCapteurs: "4.5",
      certificationCapteurs: "OUI",
      capteursHybrides: "OUI"
    }
  },
  {
    id: "P007",
    reference: "PAC-AW-STANDARD",
    description: "Pompe à chaleur Air/Eau standard pour maison individuelle",
    libelle: "PAC Air/Eau Standard",
    quantite: 1,
    prixTTC: 6000,
    categorie: "MONO GESTE",
    tva: "5.5",
    marque: "EcoTherm",
    unite: "Unité",
    operation: "BAR-TH-171 : POMPE A CHALEUR AIR/EAU",
    productType: "PAC Air/Eau",
    imageUrl: "https://images.unsplash.com/photo-1598255352001-7a22fe8c5f92?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: {
      classe: "A++",
      efficaciteEnergetique: "175",
      temperaturePAC: "60°C",
      classeRegulateur: "V",
      cop: "4.2",
      scop: "4.8",
      temperatureEau: "55°C",
      temperatureArret: "-20°C"
    }
  },
  {
    id: "P008",
    reference: "PAC-AA-STANDARD",
    description: "Pompe à chaleur Air/Air mono-split",
    libelle: "PAC Air/Air Standard",
    quantite: 1,
    prixTTC: 2200,
    categorie: "MONO GESTE",
    tva: "5.5",
    marque: "Clim+",
    unite: "Unité",
    operation: "BAR-TH-129 : POMPE A CHALEUR AIR/AIR",
    productType: "PAC Air/Air",
    imageUrl: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=1943&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: {
      cop: "3.8",
      scop: "4.0",
      puissanceNominale: "4kW"
    }
  },
  {
    id: "P009",
    reference: "GRANULES-ECO",
    description: "Poêle à granulés modèle économique",
    libelle: "Poêle à granulés Eco",
    quantite: 1,
    prixTTC: 1800,
    categorie: "MONO GESTE",
    tva: "5.5",
    marque: "BoisEco",
    unite: "Unité",
    operation: "BAR-TH-112 : POELE A GRANULES",
    productType: "Poêle à granulés",
    imageUrl: "https://images.unsplash.com/photo-1651039909351-81aae617adf4?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: {
      labelFlameVerte: "OUI",
      typeAppareil: "PEOLE",
      utilisant: "granules de bois",
      efficaciteEnergetique: "82"
    }
  }
];

// Generate more diverse stock data for sample products and add client reservations
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
    
    // Generate client reservations if the product has reserved quantity
    const reservations: Reservation[] = [];
    if (reserved > 0) {
      // Determine how many clients have reservations for this product
      const numClients = Math.min(Math.ceil(Math.random() * 3), SAMPLE_CLIENTS.length);
      let remainingReserved = reserved;
      
      for (let i = 0; i < numClients && remainingReserved > 0; i++) {
        const clientId = SAMPLE_CLIENTS[Math.floor(Math.random() * SAMPLE_CLIENTS.length)].id;
        
        // Check for duplicate client - we'll allow multiple reservations per client in this sample
        const isLastClient = i === numClients - 1;
        const reservationQuantity = isLastClient ? remainingReserved : Math.ceil(Math.random() * remainingReserved);
        remainingReserved -= reservationQuantity;
        
        // Determine if this is a normal reservation or "sur commande"
        const surCommande = Math.random() < 0.3; // 30% chance of being "sur commande"
        
        const reservationDate = new Date();
        reservationDate.setDate(reservationDate.getDate() - Math.floor(Math.random() * 14)); // 0-14 days ago
        
        const expectedDeliveryDate = new Date();
        expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7 + Math.floor(Math.random() * 21)); // 7-28 days in the future
        
        const statuses: Array<"confirmed" | "pending" | "completed" | "cancelled"> = ["confirmed", "pending"];
        
        reservations.push({
          id: `R${product.id}-${clientId}-${i}`,
          clientId,
          productId: product.id,
          quantity: reservationQuantity,
          dateReserved: reservationDate.toISOString(),
          expectedDelivery: expectedDeliveryDate.toISOString(),
          status: statuses[Math.floor(Math.random() * statuses.length)],
          notes: surCommande ? "Produit sur commande" : undefined,
          surCommande
        });
      }
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
        history,
        reservations
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

// Stock update form state interface
interface StockUpdateForm {
  productId: string;
  adjustment: number;
  type: "add" | "remove" | "set";
  location: string;
  note: string;
}

const StockManagementDashboard = () => {
  // Generate more varied stock data
  const STOCK_PRODUCTS = useMemo<StockProduct[]>(() => generateStockProducts(), []);
  
  // States
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("available"); // "available" or "reserved"
  const [viewMode, setViewMode] = useState<string>("cards");
  const [selectedProduct, setSelectedProduct] = useState<StockProduct | null>(null);
  const [stockProducts, setStockProducts] = useState<StockProduct[]>(STOCK_PRODUCTS);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(8);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [updateForm, setUpdateForm] = useState<StockUpdateForm>({
    productId: "",
    adjustment: 0,
    type: "add",
    location: "Entrepôt Principal",
    note: ""
  });
  
  // Derived data
  const uniqueCategories = useMemo<string[]>(() => {
    const categories = new Set(stockProducts.map(p => p.categorie));
    return ["Tous", ...Array.from(categories)];
  }, [stockProducts]);
  
  // Get product types for statistics
  const productTypes = useMemo<string[]>(() => {
    const types = new Set(stockProducts.map(p => p.productType));
    return Array.from(types);
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
  
  // Get unique clients for filtering
  const clients = useMemo<Client[]>(() => {
    const clientMap = new Map<string, Client>();
    
    SAMPLE_CLIENTS.forEach(client => {
      clientMap.set(client.id, client);
    });
    
    return Array.from(clientMap.values());
  }, []);
  
  // Stock summary data
  const stockSummary = useMemo(() => {
    const available = stockProducts.reduce((sum, p) => sum + Math.max(0, (p.stock.current || 0) - (p.stock.reserved || 0)), 0);
    const reserved = stockProducts.reduce((sum, p) => sum + (p.stock.reserved || 0), 0);
    const total = stockProducts.reduce((sum, p) => sum + (p.stock.current || 0), 0);
    const incoming = stockProducts.reduce((sum, p) => sum + (p.stock.incoming || 0), 0);
    const ordered = stockProducts.reduce((sum, p) => sum + (p.stock.ordered || 0), 0);
    const surCommande = stockProducts.reduce((sum, p) => {
      const surCommandeReservations = p.stock.reservations?.filter(r => r.surCommande) || [];
      return sum + surCommandeReservations.reduce((s, r) => s + r.quantity, 0);
    }, 0);

    // Product type statistics (for "Stock dispo" tab)
    const productTypeStats = productTypes.reduce((acc, type) => {
      const count = stockProducts.filter(p => 
        p.productType === type && 
        (p.stock.current > p.stock.reserved)
      ).length;
      
      const quantity = stockProducts
        .filter(p => p.productType === type)
        .reduce((sum, p) => sum + Math.max(0, (p.stock.current || 0) - (p.stock.reserved || 0)), 0);
      
      acc[type] = { count, quantity };
      return acc;
    }, {} as Record<string, { count: number, quantity: number }>);
    
    // Client statistics (for "Stock réservé" tab)
    const clientStats = clients.reduce((acc, client) => {
      let count = 0;
      let quantity = 0;
      let surCommandeCount = 0;
      
      stockProducts.forEach(product => {
        const clientReservations = product.stock.reservations?.filter(r => r.clientId === client.id) || [];
        if (clientReservations.length > 0) {
          count += 1;
          quantity += clientReservations.reduce((sum, r) => sum + r.quantity, 0);
          surCommandeCount += clientReservations.filter(r => r.surCommande).length;
        }
      });
      
      acc[client.id] = { count, quantity, surCommandeCount };
      return acc;
    }, {} as Record<string, { count: number, quantity: number, surCommandeCount: number }>);
    
    // Calculate value
    const availableValue = stockProducts.reduce((sum, p) => 
      sum + (Math.max(0, (p.stock.current || 0) - (p.stock.reserved || 0)) * p.prixTTC), 0);
    const reservedValue = stockProducts.reduce((sum, p) => 
      sum + ((p.stock.reserved || 0) * p.prixTTC), 0);
    
    return {
      available,
      reserved,
      total,
      incoming,
      ordered,
      surCommande,
      availableValue,
      reservedValue,
      productTypeStats,
      clientStats
    };
  }, [stockProducts, productTypes, clients]);
  
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
          product.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.productType.toLowerCase().includes(searchTerm.toLowerCase())
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
    
    // Apply client filter (for reserved products)
    if (selectedClientId && activeTab === "reserved") {
      filtered = filtered.filter(product => 
        product.stock.reservations?.some(reservation => reservation.clientId === selectedClientId)
      );
    }
    
    // Apply tab filter
    if (activeTab === "available") {
      filtered = filtered.filter(p => (p.stock.current || 0) > (p.stock.reserved || 0));
    } else if (activeTab === "reserved") {
      filtered = filtered.filter(p => (p.stock.reserved || 0) > 0);
    }
    
    return filtered;
  }, [stockProducts, searchTerm, selectedCategory, activeTab, selectedLocation, selectedClientId]);
  
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
          <ArchiveBoxIcon className="h-4 w-4" />
          <span className="text-xs font-medium">Rupture</span>
        </div>
      );
    } else if (product.stock.reserved > product.stock.current) {
      return (
        <div className="flex items-center gap-1 text-orange-500">
          <ClockIcon className="h-4 w-4" />
          <span className="text-xs font-medium">Sur-réservé</span>
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
  
  // Get client name from client ID
  const getClientName = (clientId: string): string => {
    const client = SAMPLE_CLIENTS.find(c => c.id === clientId);
    return client ? client.name : "Client inconnu";
  };
  
  // Conditional rendering for the main content based on tab
  const renderMainContent = () => {
    // If a product is selected, show the product detail view
    if (selectedProduct) {
      return renderProductDetail();
    }
    
    // Otherwise, show the appropriate list view based on the active tab
    return activeTab === "available" ? renderAvailableStock() : renderReservedStock();
  };
  
  // Render the "Stock dispo" (Available Stock) view
  const renderAvailableStock = () => {
    return (
      <div className="space-y-6">
        {/* Product Type Statistics */}
        <div className="bg-white rounded-xl shadow-sm border border-[#eaeaea] p-6">
          <h3 className="text-lg font-semibold text-[#213f5b] mb-4">Statistiques par type de produit</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {productTypes.map(type => (
              <div key={type} className="bg-[#f8fafc] rounded-lg p-4 border border-[#eaeaea]">
                <h4 className="font-medium text-[#213f5b] mb-2">{type}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-[#213f5b] opacity-75">Produits</p>
                    <p className="text-lg font-bold text-[#213f5b]">
                      {stockSummary.productTypeStats[type]?.count || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#213f5b] opacity-75">Disponibles</p>
                    <p className="text-lg font-bold text-[#213f5b]">
                      {stockSummary.productTypeStats[type]?.quantity || 0}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Total Available */}
            <div className="bg-[#f0f7ff] rounded-lg p-4 border border-[#bfddf9]">
              <h4 className="font-medium text-[#213f5b] mb-2">Total disponible</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-[#213f5b] opacity-75">Produits</p>
                  <p className="text-lg font-bold text-[#213f5b]">
                    {filteredProducts.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#213f5b] opacity-75">Unités</p>
                  <p className="text-lg font-bold text-[#213f5b]">
                    {stockSummary.available}
                  </p>
                </div>
              </div>
              {/* <div className="mt-2">
                <p className="text-xs text-[#213f5b] opacity-75">Valeur totale</p>
                <p className="text-sm font-medium text-[#213f5b]">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stockSummary.availableValue)}
                </p>
              </div> */}
            </div>
          </div>
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
                    {product.productType}
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
                      <p className="text-xs text-[#213f5b] opacity-75">Disponible</p>
                      <p className="font-semibold text-[#213f5b]">
                        {Math.max(0, product.stock.current - product.stock.reserved)} <span className="text-xs">{product.unite}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-[#213f5b] mb-1">
                      <span>Disponible</span>
                      <span>{Math.max(0, product.stock.current - product.stock.reserved)} / {product.stock.current} {product.unite}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="h-1.5 rounded-full bg-green-500"
                        style={{ width: `${Math.min(100, ((product.stock.current - product.stock.reserved) / Math.max(1, product.stock.current)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
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
  
  // Render the "Stock réservé" (Reserved Stock) view
  const renderReservedStock = () => {
    return (
      <div className="space-y-6">
        {/* Client Reservation Statistics */}
        <div className="bg-white rounded-xl shadow-sm border border-[#eaeaea] p-6">
          <h3 className="text-lg font-semibold text-[#213f5b] mb-4">Statistiques par client</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {clients.map(client => {
              const stats = stockSummary.clientStats[client.id];
              if (!stats || stats.count === 0) return null;
              
              return (
                <div 
                  key={client.id} 
                  className={`rounded-lg p-4 border ${
                    selectedClientId === client.id 
                      ? "bg-[#f0f7ff] border-[#bfddf9]" 
                      : "bg-[#f8fafc] border-[#eaeaea] hover:border-[#bfddf9] cursor-pointer"
                  }`}
                  onClick={() => setSelectedClientId(selectedClientId === client.id ? "" : client.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-[#213f5b] text-white">
                      <UsersIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#213f5b]">{client.name}</h4>
                      {client.company && (
                        <p className="text-xs text-[#213f5b] opacity-75">{client.company}</p>
                      )}
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div>
                          <p className="text-xs text-[#213f5b] opacity-75">Produits</p>
                          <p className="text-base font-semibold text-[#213f5b]">{stats.count}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#213f5b] opacity-75">Unités</p>
                          <p className="text-base font-semibold text-[#213f5b]">{stats.quantity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#213f5b] opacity-75">Sur commande</p>
                          <p className="text-base font-semibold text-[#213f5b]">{stats.surCommandeCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Total Reserved */}
            <div className="bg-[#f0f7ff] rounded-lg p-4 border border-[#bfddf9] xl:col-span-2">
              <h4 className="font-medium text-[#213f5b] mb-2">Total réservé</h4>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-[#213f5b] opacity-75">Produits</p>
                  <p className="text-lg font-bold text-[#213f5b]">
                    {stockProducts.filter(p => p.stock.reserved > 0).length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#213f5b] opacity-75">Unités réservées</p>
                  <p className="text-lg font-bold text-[#213f5b]">
                    {stockSummary.reserved}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#213f5b] opacity-75">Sur commande</p>
                  <p className="text-lg font-bold text-[#213f5b]">
                    {stockSummary.surCommande}
                  </p>
                </div>
                {/* <div>
                  <p className="text-xs text-[#213f5b] opacity-75">Valeur totale</p>
                  <p className="text-lg font-bold text-[#213f5b]">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(stockSummary.reservedValue)}
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        
        {/* Products grid with reservations */}
        {paginatedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-[#213f5b] bg-white rounded-xl shadow-sm">
            <ArchiveBoxIcon className="h-16 w-16 mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Aucun produit réservé trouvé</h3>
            <p className="text-sm opacity-75 mb-6">Modifiez vos critères de recherche ou réservez des produits</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl border border-[#eaeaea] shadow-sm hover:shadow-md hover:border-[#bfddf9] transition-all overflow-hidden h-full flex flex-col"
                whileHover={{ y: -4 }}
              >
                {/* Product header */}
                <div className="relative h-32 overflow-hidden bg-gradient-to-r from-[#f0f7ff] to-[#f8fafc] flex items-center justify-center">
                  <div className="absolute top-2 right-2 z-10">
                    {renderStockStatus(product)}
                  </div>
                  
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.libelle} 
                      className="object-cover h-full w-full"
                    />
                  ) : (
                    <CubeIcon className="h-16 w-16 text-[#bfddf9]" />
                  )}
                  
                  <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 rounded-full px-3 py-1 text-xs font-medium text-[#213f5b] shadow-sm">
                    {product.productType}
                  </div>
                </div>
                
                {/* Product info */}
                <div className="p-4 flex-grow">
                  <div className="mb-3">
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
                      <p className="text-xs text-[#213f5b] opacity-75">Réservé</p>
                      <p className="font-semibold text-[#213f5b]">
                        {product.stock.reserved} <span className="text-xs">{product.unite}</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Client reservations */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-[#213f5b] mb-2">Réservations clients</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {product.stock.reservations?.map((reservation, index) => (
                        <div 
                          key={index} 
                          className={`p-2 rounded-lg text-xs border ${
                            reservation.surCommande 
                              ? "border-amber-200 bg-amber-50" 
                              : "border-[#eaeaea] bg-[#f8fafc]"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{getClientName(reservation.clientId)}</span>
                            <span>{reservation.quantity} {product.unite}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="opacity-75">
                              {formatDate(reservation.dateReserved).split(' ')[0]}
                            </span>
                            {reservation.surCommande && (
                              <span className="text-amber-600 font-medium">Sur commande</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
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
    
    // Determine if this product has reservations
    const hasReservations = selectedProduct.stock.reservations && selectedProduct.stock.reservations.length > 0;
    
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
                      <dt className="text-sm text-[#213f5b] opacity-75">Type de produit</dt>
                      <dd className="text-sm font-medium text-[#213f5b]">{selectedProduct.productType}</dd>
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
                      <span>Réservé / Total</span>
                      <span>{selectedProduct.stock.current > 0 ? Math.round((selectedProduct.stock.reserved / selectedProduct.stock.current) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          selectedProduct.stock.reserved > selectedProduct.stock.current ? "bg-orange-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${Math.min(100, (selectedProduct.stock.reserved / Math.max(1, selectedProduct.stock.current)) * 100)}%` }}
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
          
          {/* Client Reservations (only if the product has reservations) */}
          {hasReservations && (
            <div className="bg-white rounded-xl shadow-sm border border-[#eaeaea] overflow-hidden">
              <div className="p-6 border-b border-[#eaeaea]">
                <h3 className="font-semibold text-[#213f5b]">Réservations clients</h3>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#eaeaea]">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                          Quantité
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eaeaea]">
                      {selectedProduct.stock.reservations?.map((reservation, index) => {
                        const client = SAMPLE_CLIENTS.find(c => c.id === reservation.clientId);
                        return (
                          <tr key={index} className={`hover:bg-[#f8fafc] ${reservation.surCommande ? "bg-amber-50" : ""}`}>
                            <td className="px-4 py-3 text-sm text-[#213f5b]">
                              <div>
                                <p className="font-medium">{client?.name || "Client inconnu"}</p>
                                {client?.company && (
                                  <p className="text-xs opacity-75">{client.company}</p>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-[#213f5b]">
                              {formatDate(reservation.dateReserved).split(' ')[0]}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-[#213f5b]">
                              {reservation.quantity} {selectedProduct.unite}
                            </td>
                            <td className="px-4 py-3 text-sm text-[#213f5b]">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                reservation.surCommande 
                                  ? "bg-amber-100 text-amber-800" 
                                  : "bg-blue-100 text-blue-800"
                              }`}>
                                {reservation.surCommande ? "Sur commande" : reservation.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-[#213f5b]">
                              {reservation.notes || "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Type Info */}
          <div className="bg-white rounded-xl shadow-sm border border-[#eaeaea] overflow-hidden">
            <div className="p-6 border-b border-[#eaeaea]">
              <h3 className="font-semibold text-[#213f5b]">{selectedProduct.productType}</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-[#f0f7ff] rounded-lg">
                  <CubeIcon className="h-6 w-6 text-[#213f5b]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#213f5b]">{selectedProduct.libelle}</p>
                  <p className="text-xs text-[#213f5b] opacity-75">{selectedProduct.marque}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {Object.entries(selectedProduct.details).map(([key, value], index) => (
                  <div key={index} className="flex justify-between">
                    <dt className="text-sm text-[#213f5b] opacity-75">{key}</dt>
                    <dd className="text-sm font-medium text-[#213f5b]">{value?.toString()}</dd>
                  </div>
                ))}
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
          : activeTab === "available"
          ? "Stock disponible"
          : "Stock réservé"
        }
      </h1>
      <p className="text-[#213f5b] opacity-75 pl-2">
        {selectedProduct 
          ? `Référence: ${selectedProduct.reference}` 
          : activeTab === "available"
          ? `${stockSummary.available} unités disponibles`
          : `${stockSummary.reserved} unités réservées`
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

{/* Tab Navigation */}
{!selectedProduct && (
  <div className="mb-6">
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab("available")}
          className={`px-4 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
            activeTab === "available"
              ? "text-[#213f5b] border-b-2 border-[#213f5b]"
              : "text-gray-500 hover:text-[#213f5b] hover:bg-[#f8fafc]"
          }`}
        >
          <CheckCircleIcon className="h-4 w-4" />
          Stock disponible
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
          Stock réservé
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
            {stockSummary.reserved}
          </span>
        </button>
      </div>
    </div>
  </div>
)}

{/* Search & Filter Bar */}
{!selectedProduct && (
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
      
      {activeTab === "reserved" && (
        <select
          className="px-3 py-2 border border-[#bfddf9] rounded-lg text-sm text-[#213f5b] focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
        >
          <option value="">Tous les clients</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
      )}
      
      <Button
        variant="outline"
        size="sm"
        className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9]"
        onClick={() => {
          setSearchTerm("");
          setSelectedCategory("");
          setSelectedLocation("");
          setSelectedClientId("");
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