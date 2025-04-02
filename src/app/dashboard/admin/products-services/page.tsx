"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
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
} from "@heroicons/react/24/outline";

// Product Details interface
interface ProductDetails {
  classe?: string;
  efficaciteEnergetique?: string;
  temperaturePAC?: string;
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
  // Fields for COUP DE POUCE
  typeCoupDePouce?: string;
  kwhCumacCoupDePouce?: string;
  kwhCumacHorsCoupDePouce?: string;
  // Fields for BAR-TH-113
  chaudiereOperationMode?: string;
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

// Sample products data
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
    operation: OPERATIONS.BAR_TH_129,
    imageUrl: "https://plus.unsplash.com/premium_photo-1674624682288-085eff4f98da?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: {
      cop: "4.1",
      scop: "4.3",
      puissanceNominale: "8kW",
      kwhCumac: "45000"
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
    operation: OPERATIONS.BAR_TH_143,
    imageUrl: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    details: {
      productiviteCapteur: "580",
      capaciteStockage: "400",
      surfaceCapteurs: "8.5",
      certificationCapteurs: "OUI",
      capteursHybrides: "NON",
      kwhCumac: "95000"
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
      typeCoupDePouce: "COUP DE POUCE",
      kwhCumacCoupDePouce: "120000",
      kwhCumac: "60000"
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
    }
  });

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
      details: product.details || {}
    });
    setSelectedOperation(product.operation);
    setViewMode("form");
  };

  // Delete handler
  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
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
      details: {
        kwhCumac: ""
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
      imageUrl: produitForm.imageUrl
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

  // Cancel form handler
  const handleCancelForm = () => {
    setViewMode("list");
    setSelectedProduct(null);
  };

  // Filtered products based on search term
  const filteredProducts = products.filter(product => 
    product.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    const showCoupDePouceToggle = [
      OPERATIONS.BAR_TH_171, 
      OPERATIONS.BAR_TH_143, 
      OPERATIONS.BAR_TH_113
    ].includes(selectedOperation);

    // Render Coup de Pouce toggle if needed
    const renderCoupDePouceToggle = () => {
      if (!showCoupDePouceToggle) return null;
      
      return (
        <div className="mb-6 border-b pb-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#213f5b] mb-1">Type de valorisation</label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="typeCoupDePouce"
                  value="COUP DE POUCE"
                  checked={(produitForm.details.typeCoupDePouce || "") === "COUP DE POUCE"}
                  onChange={(e) => handleProduitDetailsChange({
                    target: {
                      name: "typeCoupDePouce",
                      value: e.target.value
                    }
                  } as React.ChangeEvent<HTMLInputElement>)}
                  className="mr-2 h-4 w-4 text-[#213f5b] focus:ring-[#213f5b]"
                />
                <span className="text-sm font-medium text-[#213f5b]">COUP DE POUCE</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="typeCoupDePouce"
                  value="HORS COUP DE POUCE"
                  checked={(produitForm.details.typeCoupDePouce || "") === "HORS COUP DE POUCE"}
                  onChange={(e) => handleProduitDetailsChange({
                    target: {
                      name: "typeCoupDePouce",
                      value: e.target.value
                    }
                  } as React.ChangeEvent<HTMLInputElement>)}
                  className="mr-2 h-4 w-4 text-[#213f5b] focus:ring-[#213f5b]"
                />
                <span className="text-sm font-medium text-[#213f5b]">HORS COUP DE POUCE</span>
              </label>
            </div>
          </div>
          
          {(produitForm.details.typeCoupDePouce || "") === "COUP DE POUCE" && (
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">kWh Cumac (Coup de Pouce)</label>
              <input
                type="text"
                name="kwhCumacCoupDePouce"
                value={produitForm.details.kwhCumacCoupDePouce || ""}
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              />
            </div>
          )}
          
          {(produitForm.details.typeCoupDePouce || "") === "HORS COUP DE POUCE" && (
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-[#213f5b] mb-1">kWh Cumac (Hors Coup de Pouce)</label>
              <input
                type="text"
                name="kwhCumacHorsCoupDePouce"
                value={produitForm.details.kwhCumacHorsCoupDePouce || ""}
                onChange={handleProduitDetailsChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
              />
            </div>
          )}
        </div>
      );
    };

    switch (selectedOperation) {
      case OPERATIONS.BAR_TH_113:
        return (
          <>
            {renderCoupDePouceToggle()}
            
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
          </>
        );
        
      case OPERATIONS.BAR_TH_171:
        return (
          <>
            {renderCoupDePouceToggle()}
            
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
          </>
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
            {renderCoupDePouceToggle()}
            
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
                    placeholder="Rechercher des produits..."
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
                  {/* Products Grid/List View */}
                  <div className="mb-4 flex justify-end">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.length === 0 ? (
                      <div className="col-span-full flex flex-col items-center justify-center py-12 text-[#213f5b]">
                        <CubeIcon className="h-16 w-16 mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
                        <p className="text-sm opacity-75 mb-6">Ajoutez un nouveau produit ou modifiez vos critères de recherche</p>
                        <Button
                          onClick={handleAddNewProduct}
                          className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Nouveau Produit
                        </Button>
                      </div>
                    ) : (
                      filteredProducts.map((product) => (
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
                                  <CubeIcon className="h-6 w-6 text-white" />
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
                                <span className="text-sm text-[#213f5b] opacity-75 font-medium">{product.operation.split(':')[0]}</span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-[#213f5b] opacity-75 line-clamp-2 mb-4 leading-relaxed">{product.description}</p>
                            
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="bg-[#f8fafc] rounded-xl p-3.5 border border-[#eaeaea] transition-all group-hover:border-[#bfddf9] group-hover:shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-2 h-2 rounded-full bg-[#213f5b]"></div>
                                  <p className="text-xs text-[#213f5b] font-semibold">Prix TTC</p>
                                </div>
                                <p className="font-bold text-[#213f5b] text-xl ml-4">{product.prixTTC.toLocaleString()} €</p>
                                <p className="text-xs text-[#213f5b] opacity-75 mt-0.5 ml-4">TVA {product.tva}%</p>
                              </div>
                              <div className="bg-[#f8fafc] rounded-xl p-3.5 border border-[#eaeaea] transition-all group-hover:border-[#bfddf9] group-hover:shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-2 h-2 rounded-full bg-[#213f5b]"></div>
                                  <p className="text-xs text-[#213f5b] font-semibold">Quantité</p>
                                </div>
                                <p className="font-bold text-[#213f5b] text-xl ml-4">{product.quantite}</p>
                                <p className="text-xs text-[#213f5b] opacity-75 mt-0.5 ml-4">{product.unite}</p>
                              </div>
                            </div>
                            
                            {product.details.kwhCumac && (
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
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
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
                    </div>
                  </div>

                  {/* Détails */}
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-white to-[#f8fafc] border-b p-6">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-1 rounded-full bg-[#bfddf9]"></div>
                        <h2 className="text-xl font-bold text-[#213f5b]">Détails</h2>
                      </div>
                      <p className="text-[#213f5b] opacity-75 ml-3 pl-3">Détails spécifiques selon l&apos;opération</p>
                    </div>
                    <div className="p-6">
                      {renderOperationDetails()}
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
