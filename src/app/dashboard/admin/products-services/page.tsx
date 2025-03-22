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
  WrenchScrewdriverIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ListBulletIcon,
  TableCellsIcon,
  CogIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";

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

interface Prestation {
  id: string;
  reference: string;
  quantite: number;
  unite: string;
  designation: string;
  prixTTC: string;
  tva: string;
  codeComptable: string;
  active: boolean;
  operations: string[];
  produits: string[];
}

// Interface for Operation
interface Operation {
  id: string;
  code: string;
  name: string;
  description: string;
  categorie: string;
  active: boolean;
}

// Interface for Brand
interface Brand {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  website?: string;
  active: boolean;
}

// Form state interfaces
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

interface PrestationForm {
  id: string;
  reference: string;
  quantite: string; // Form fields are strings
  unite: string;
  designation: string;
  prixTTC: string;
  tva: string;
  codeComptable: string;
  active: boolean;
  operations: string[];
  produits: string[];
}

// Form interface for Operation
interface OperationForm {
  id: string;
  code: string;
  name: string;
  description: string;
  categorie: string;
  active: boolean;
}

// Form interface for Brand
interface BrandForm {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  website?: string;
  active: boolean;
}

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

// Sample data
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

const SAMPLE_PRESTATIONS: Prestation[] = [
  {
    id: "S001",
    reference: "POSE-PAC-AW",
    quantite: 1,
    unite: "Forfait",
    designation: "- Pose et installation complète d'une pompe à chaleur air/eau - Forfait déplacement et mise en service comprise.\n- Installation d'un ballon tampon 25L :\nBouteilles de mélange et de décantation, pour installations de chauffage corps acier, jaquette skaï,Isolation 35 mm réversibles droite ou gauche de la chaudière pose murale livrée avec 4 bouchons pour circuits inutilisés.",
    prixTTC: "1500",
    tva: "10",
    codeComptable: "7061",
    active: true,
    operations: [OPERATIONS.BAR_TH_171],
    produits: ["P001"]
  },
  {
    id: "S002",
    reference: "POSE-PAC-AA",
    quantite: 1,
    unite: "Forfait",
    designation: "Installation :\nInstallation du module intérieur - Installation du module extérieur Liaison frigorifique -\nCâblage d'alimentation , Câblage connexion électrique - Protection disjoncteur\ndifférentiel,\nMise en service & Programmation :\nContrôle du positionnement des appareils -Raccord du circuit frigorifique - Tire au\nvide, Contrôle de l'étanchéité du circuit frigorifique - Contrôle du raccordement des\ncondensats, Contrôle du circuit électrique (conforme NF C15 100) - Mise en service et\ncontrôle du fonctionnement, Réglage des paramètres d'utilisation - Démonstration,\ncomplète des différentes fonctions",
    prixTTC: "1500",
    tva: "10",
    codeComptable: "7061",
    active: true,
    operations: [OPERATIONS.BAR_TH_129],
    produits: ["P002"]
  },
  {
    id: "S003",
    reference: "POSE-POELE",
    quantite: 1,
    unite: "Forfait",
    designation: "Installation :\nInstallation du module intérieur - Installation du module extérieur Liaison frigorifique -\nCâblage d'alimentation , Câblage connexion électrique - Protection disjoncteur\ndifférentiel,\nMise en service & Programmation :\nContrôle du positionnement des appareils -Raccord du circuit frigorifique - Tire au\nvide, Contrôle de l'étanchéité du circuit frigorifique - Contrôle du raccordement des\ncondensats, Contrôle du circuit électrique (conforme NF C15 100) - Mise en service et\ncontrôle du fonctionnement, Réglage des paramètres d'utilisation - Démonstration,\ncomplète des différentes fonctions",
    prixTTC: "1500",
    tva: "10",
    codeComptable: "7062",
    active: true,
    operations: [OPERATIONS.BAR_TH_112],
    produits: ["P003"]
  },
  {
    id: "S004",
    reference: "POSE-SSC",
    quantite: 1,
    unite: "Forfait",
    designation: "FORFAIT POSE ET MISE EN SERVICE D'UN SYSTÈME SOLAIRE COMBINÉ \n- Pose et installation complète d'un système solaire combiné - Vidange et dépose du ballon existant - Mise en place du systeme solaire combiné en lieu et place de l'ancien chauffe-eau. - Raccordement sur eau froide et eau chaude du circuit sanitaire existant au moyen de flexibles. - Raccordement sur tuyau de vidange existant. - Raccordement sur ligne(s) électrique(s) existante(s) devant correspondre aux normes en vigueur. - Remplacement du groupe de sécurité. - Remplissage et tests d'étanchéité. - Contrôle du bon fonctionnement. Mise en service et conseils d'utilisation.",
    prixTTC: "2500",
    tva: "10",
    codeComptable: "7063",
    active: true,
    operations: [OPERATIONS.BAR_TH_143],
    produits: ["P005"]
  }
];

// Sample data for operations
const SAMPLE_OPERATIONS: Operation[] = [
  {
    id: "O001",
    code: "BAR-TH-171",
    name: "POMPE A CHALEUR AIR/EAU",
    description: "Installation d'une pompe à chaleur air/eau pour le chauffage de locaux à usage d'habitation.",
    categorie: "CHAUFFAGE",
    active: true
  },
  {
    id: "O002",
    code: "BAR-TH-129",
    name: "POMPE A CHALEUR AIR/AIR",
    description: "Installation d'une pompe à chaleur air/air pour le chauffage des locaux à usage d'habitation.",
    categorie: "CHAUFFAGE",
    active: true
  },
  {
    id: "O003",
    code: "BAR-TH-112",
    name: "POELE A GRANULES",
    description: "Installation d'un poêle à granulés ou à bûches.",
    categorie: "CHAUFFAGE",
    active: true
  },
  {
    id: "O004",
    code: "BAR-TH-148",
    name: "CHAUFFE EAU THERMODYNAMIQUE",
    description: "Installation d'un chauffe-eau thermodynamique à accumulation.",
    categorie: "EAU CHAUDE SANITAIRE",
    active: true
  },
  {
    id: "O005",
    code: "BAR-TH-143",
    name: "SYSTEME SOLAIRE COMBINE",
    description: "Installation d'un système solaire combiné (SSC).",
    categorie: "CHAUFFAGE",
    active: true
  },
  {
    id: "O006",
    code: "BAR-TH-101",
    name: "CHAUFFE EAU SOLAIRE INDIVIDUEL",
    description: "Installation d'un chauffe-eau solaire individuel (CESI).",
    categorie: "EAU CHAUDE SANITAIRE",
    active: true
  },
  {
    id: "O007",
    code: "BAR-TH-113",
    name: "CHAUDIERE BIOMASSE",
    description: "Installation d'une chaudière biomasse individuelle à haute performance énergétique.",
    categorie: "CHAUFFAGE",
    active: true
  }
];

// Sample data for brands
const SAMPLE_BRANDS: Brand[] = [
  {
    id: "B001",
    name: "EcoTherm",
    description: "Fabricant de pompes à chaleur haute performance énergétique",
    website: "https://ecotherm.fr",
    active: true
  },
  {
    id: "B002",
    name: "Clim+",
    description: "Spécialiste des systèmes de climatisation et pompes à chaleur air/air",
    website: "https://climplus.fr",
    active: true
  },
  {
    id: "B003",
    name: "BoisEco",
    description: "Solutions de chauffage au bois écologiques et performantes",
    website: "https://boiseco.fr",
    active: true
  },
  {
    id: "B004",
    name: "AquaTherm",
    description: "Chauffe-eau thermodynamiques et solutions d'eau chaude sanitaire",
    website: "https://aquatherm.fr",
    active: true
  },
  {
    id: "B005",
    name: "SolarPlus",
    description: "Systèmes solaires combinés et panneaux photovoltaïques innovants",
    website: "https://solarplus.fr",
    active: true
  },
  {
    id: "B006",
    name: "BiomasseTech",
    description: "Chaudières biomasse haute performance et solutions de chauffage responsables",
    website: "https://biomassetech.fr",
    active: true
  }
];

export default function ProduitPrestationPage() {
  const [activeTab, setActiveTab] = useState<"produit" | "prestation" | "operation" | "marque">("produit");
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [selectedOperation, setSelectedOperation] = useState<string>("");
  const [selectedOperations, setSelectedOperations] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // States for data lists
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [prestations, setPrestations] = useState<Prestation[]>(SAMPLE_PRESTATIONS);
  const [operations, setOperations] = useState<Operation[]>(SAMPLE_OPERATIONS);
  const [brands, setBrands] = useState<Brand[]>(SAMPLE_BRANDS);

  // Selected item for editing
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPrestation, setSelectedPrestation] = useState<Prestation | null>(null);
  const [selectedOperationItem, setSelectedOperationItem] = useState<Operation | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  // States for file uploads
  const [ , setProductImage] = useState<File | null>(null);
  const [ , setBrandLogo] = useState<File | null>(null);

  // State for product form
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
    // Dynamic details fields
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

  // State for prestation form
  const [prestationForm, setPrestationForm] = useState<PrestationForm>({
    id: "",
    reference: "",
    quantite: "",
    unite: "",
    designation: "",
    prixTTC: "",
    tva: "",
    codeComptable: "",
    active: true,
    operations: [],
    produits: []
  });

  // State for operation form
  const [operationForm, setOperationForm] = useState<OperationForm>({
    id: "",
    code: "",
    name: "",
    description: "",
    categorie: "",
    active: true
  });

  // State for brand form
  const [brandForm, setBrandForm] = useState<BrandForm>({
    id: "",
    name: "",
    description: "",
    logoUrl: "",
    website: "",
    active: true
  });

  // File upload handlers
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

  const handleBrandLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBrandLogo(e.target.files[0]);
      // For demo purposes, we'll create a fake URL
      const logoUrl = URL.createObjectURL(e.target.files[0]);
      setBrandForm({
        ...brandForm,
        logoUrl: logoUrl
      });
    }
  };

  // Edit handlers
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

  const handleEditPrestation = (prestation: Prestation) => {
    setSelectedPrestation(prestation);
    setPrestationForm({
      id: prestation.id,
      reference: prestation.reference,
      quantite: String(prestation.quantite), // Convert number to string for form
      unite: prestation.unite,
      designation: prestation.designation,
      prixTTC: prestation.prixTTC,
      tva: prestation.tva,
      codeComptable: prestation.codeComptable,
      active: prestation.active,
      operations: prestation.operations || [],
      produits: prestation.produits || []
    });
    setSelectedOperations(prestation.operations || []);
    setSelectedProducts(prestation.produits || []);
    setViewMode("form");
  };

  const handleEditOperation = (operation: Operation) => {
    setSelectedOperationItem(operation);
    setOperationForm({
      id: operation.id,
      code: operation.code,
      name: operation.name,
      description: operation.description,
      categorie: operation.categorie,
      active: operation.active
    });
    setViewMode("form");
  };

  const handleEditBrand = (brand: Brand) => {
    setSelectedBrand(brand);
    setBrandForm({
      id: brand.id,
      name: brand.name,
      description: brand.description,
      logoUrl: brand.logoUrl || "",
      website: brand.website || "",
      active: brand.active
    });
    setViewMode("form");
  };

  // Delete handlers
  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const handleDeletePrestation = (id: string) => {
    setPrestations(prestations.filter(prestation => prestation.id !== id));
  };

  const handleDeleteOperation = (id: string) => {
    setOperations(operations.filter(operation => operation.id !== id));
  };

  const handleDeleteBrand = (id: string) => {
    setBrands(brands.filter(brand => brand.id !== id));
  };

  // Add new item handlers
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

  const handleAddNewPrestation = () => {
    setSelectedPrestation(null);
    setPrestationForm({
      id: `S${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      reference: "",
      quantite: "",
      unite: "",
      designation: "",
      prixTTC: "",
      tva: "",
      codeComptable: "",
      active: true,
      operations: [],
      produits: []
    });
    setSelectedOperations([]);
    setSelectedProducts([]);
    setViewMode("form");
  };

  const handleAddNewOperation = () => {
    setSelectedOperationItem(null);
    setOperationForm({
      id: `O${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      code: "",
      name: "",
      description: "",
      categorie: "",
      active: true
    });
    setViewMode("form");
  };

  const handleAddNewBrand = () => {
    setSelectedBrand(null);
    setBrandForm({
      id: `B${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name: "",
      description: "",
      logoUrl: "",
      website: "",
      active: true
    });
    setViewMode("form");
  };

  // Save handlers
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

  const handleSavePrestation = () => {
    const prestationToSave: Prestation = {
      id: prestationForm.id,
      reference: prestationForm.reference,
      quantite: Number(prestationForm.quantite), // Convert string to number
      unite: prestationForm.unite,
      designation: prestationForm.designation,
      prixTTC: prestationForm.prixTTC,
      tva: prestationForm.tva,
      codeComptable: prestationForm.codeComptable,
      active: prestationForm.active,
      operations: selectedOperations,
      produits: selectedProducts
    };

    if (selectedPrestation) {
      // Update existing prestation
      setPrestations(prestations.map(p => p.id === prestationToSave.id ? prestationToSave : p));
    } else {
      // Add new prestation
      setPrestations([...prestations, prestationToSave]);
    }
    setViewMode("list");
  };

  const handleSaveOperation = () => {
    const operationToSave: Operation = {
      id: operationForm.id,
      code: operationForm.code,
      name: operationForm.name,
      description: operationForm.description,
      categorie: operationForm.categorie,
      active: operationForm.active
    };

    if (selectedOperationItem) {
      // Update existing operation
      setOperations(operations.map(o => o.id === operationToSave.id ? operationToSave : o));
    } else {
      // Add new operation
      setOperations([...operations, operationToSave]);
    }
    setViewMode("list");
  };

  const handleSaveBrand = () => {
    const brandToSave: Brand = {
      id: brandForm.id,
      name: brandForm.name,
      description: brandForm.description,
      logoUrl: brandForm.logoUrl,
      website: brandForm.website,
      active: brandForm.active
    };

    if (selectedBrand) {
      // Update existing brand
      setBrands(brands.map(b => b.id === brandToSave.id ? brandToSave : b));
    } else {
      // Add new brand
      setBrands([...brands, brandToSave]);
    }
    setViewMode("list");
  };

  // Handle operation selection in produit form
  const handleOperationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOperation(e.target.value);
  };

  // Handle operation selection in prestation form
  const handlePrestationOperationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const operation = e.target.value;
    setSelectedOperations([operation]);
    
    // Autofill designation and price based on operation
    let designation = "";
    let prixTTC = "";
    
    if (operation === OPERATIONS.BAR_TH_171) {
      designation = "- Pose et installation complète d'une pompe à chaleur air/eau - Forfait déplacement et mise en service comprise.\n- Installation d'un ballon tampon 25L :\nBouteilles de mélange et de décantation, pour installations de chauffage corps acier, jaquette skaï,Isolation 35 mm réversibles droite ou gauche de la chaudière pose murale livrée avec 4 bouchons pour circuits inutilisés.";
      prixTTC = "1500";
    } else if ([OPERATIONS.BAR_TH_148, OPERATIONS.BAR_TH_101, OPERATIONS.BAR_TH_112, OPERATIONS.BAR_TH_129].includes(operation)) {
      designation = "Installation :\nInstallation du module intérieur - Installation du module extérieur Liaison frigorifique -\nCâblage d'alimentation , Câblage connexion électrique - Protection disjoncteur\ndifférentiel,\nMise en service & Programmation :\nContrôle du positionnement des appareils -Raccord du circuit frigorifique - Tire au\nvide, Contrôle de l'étanchéité du circuit frigorifique - Contrôle du raccordement des\ncondensats, Contrôle du circuit électrique (conforme NF C15 100) - Mise en service et\ncontrôle du fonctionnement, Réglage des paramètres d'utilisation - Démonstration,\ncomplète des différentes fonctions";
      prixTTC = "1500";
    } else if (operation === OPERATIONS.BAR_TH_143) {
      designation = "FORFAIT POSE ET MISE EN SERVICE D'UN SYSTÈME SOLAIRE COMBINÉ \n- Pose et installation complète d'un système solaire combiné - Vidange et dépose du ballon existant - Mise en place du systeme solaire combiné en lieu et place de l'ancien chauffe-eau. - Raccordement sur eau froide et eau chaude du circuit sanitaire existant au moyen de flexibles. - Raccordement sur tuyau de vidange existant. - Raccordement sur ligne(s) électrique(s) existante(s) devant correspondre aux normes en vigueur. - Remplacement du groupe de sécurité. - Remplissage et tests d'étanchéité. - Contrôle du bon fonctionnement. Mise en service et conseils d'utilisation.";
      prixTTC = "2500";
    }
    
    // Update the prestation form
    setPrestationForm({
      ...prestationForm,
      designation,
      prixTTC
    });
  };

  // Handle product selection for prestation
  const handleProduitSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProducts([e.target.value]);
  };

  // Handle product form changes
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

  // Handle prestation form changes
  const handlePrestationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPrestationForm({
      ...prestationForm,
      [name]: value
    });
  };

  // Handle operation form changes
  const handleOperationFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOperationForm({
      ...operationForm,
      [name]: value
    });
  };

  // Handle brand form changes
  const handleBrandFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBrandForm({
      ...brandForm,
      [name]: value
    });
  };

  // Return to list view
  const handleCancelForm = () => {
    setViewMode("list");
    setSelectedProduct(null);
    setSelectedPrestation(null);
    setSelectedOperationItem(null);
    setSelectedBrand(null);
  };

  // Filtered lists based on search term
  const filteredProducts = products.filter(product => 
    product.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPrestations = prestations.filter(prestation => 
    prestation.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prestation.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOperations = operations.filter(operation => 
    operation.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operation.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (brand.website && brand.website.toLowerCase().includes(searchTerm.toLowerCase()))
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
                  <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#213f5b] to-[#2c5681] mb-2 pl-2">Produits & Prestations</h1>
                  <p className="text-[#213f5b] opacity-75 pl-2">Ajoutez et gérez vos produits et prestations</p>
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
                      onClick={() => {
                        if (activeTab === "produit") handleAddNewProduct();
                        else if (activeTab === "prestation") handleAddNewPrestation();
                        else if (activeTab === "operation") handleAddNewOperation();
                        else if (activeTab === "marque") handleAddNewBrand();
                      }}
                      className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      {activeTab === "produit" ? "Nouveau Produit" : 
                       activeTab === "prestation" ? "Nouvelle Prestation" :
                       activeTab === "operation" ? "Nouvelle Opération" :
                       "Nouvelle Marque"}
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
                    placeholder={`Rechercher des ${
                      activeTab === "produit" ? "produits" : 
                      activeTab === "prestation" ? "prestations" : 
                      activeTab === "operation" ? "opérations" :
                      "marques"
                    }...`}
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

            {/* Main Tabs - Custom Implementation */}
            <div className="w-full mb-8">
              <div className="flex flex-wrap border-b border-[#e5e7eb] mb-6">
                <button
                  className={`flex items-center gap-2 py-3 px-5 ${
                    activeTab === "produit" 
                      ? "bg-[#213f5b] text-white rounded-t-lg" 
                      : "text-[#213f5b] hover:bg-[#f0f7ff]"
                  }`}
                  onClick={() => {
                    setActiveTab("produit");
                    setViewMode("list");
                  }}
                >
                  <CubeIcon className="h-5 w-5" />
                  <span>Produit</span>
                </button>
                <button
                  className={`flex items-center gap-2 py-3 px-5 ${
                    activeTab === "prestation" 
                      ? "bg-[#213f5b] text-white rounded-t-lg" 
                      : "text-[#213f5b] hover:bg-[#f0f7ff]"
                  }`}
                  onClick={() => {
                    setActiveTab("prestation");
                    setViewMode("list");
                  }}
                >
                  <WrenchScrewdriverIcon className="h-5 w-5" />
                  <span>Prestation</span>
                </button>
                <button
                  className={`flex items-center gap-2 py-3 px-5 ${
                    activeTab === "operation" 
                      ? "bg-[#213f5b] text-white rounded-t-lg" 
                      : "text-[#213f5b] hover:bg-[#f0f7ff]"
                  }`}
                  onClick={() => {
                    setActiveTab("operation");
                    setViewMode("list");
                  }}
                >
                  <CogIcon className="h-5 w-5" />
                  <span>Opération</span>
                </button>
                <button
                  className={`flex items-center gap-2 py-3 px-5 ${
                    activeTab === "marque" 
                      ? "bg-[#213f5b] text-white rounded-t-lg" 
                      : "text-[#213f5b] hover:bg-[#f0f7ff]"
                  }`}
                  onClick={() => {
                    setActiveTab("marque");
                    setViewMode("list");
                  }}
                >
                  <BuildingStorefrontIcon className="h-5 w-5" />
                  <span>Marque</span>
                </button>
              </div>

              {/* Product Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === "produit" && (
                  <>
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
                                className="bg-white rounded-xl border border-[#eaeaea] shadow-sm hover:shadow-md hover:border-[#bfddf9] transition-all group"
                                whileHover={{ y: -4 }}
                              >
                                {/* Product Image (if available) */}
                                {product.imageUrl && (
                                  <div className="w-full h-48 rounded-t-xl overflow-hidden">
                                    <img 
                                      src={product.imageUrl} 
                                      alt={product.libelle || product.reference} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                
                                <div className="p-5 border-b border-[#eaeaea] bg-gradient-to-r from-white to-[#f8fafc]">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-start gap-3">
                                      <div className="p-2 bg-[#bfddf9] bg-opacity-50 rounded-lg group-hover:bg-opacity-100 transition-colors">
                                        <CubeIcon className="h-6 w-6 text-[#213f5b]" />
                                      </div>
                                      <div>
                                        <h3 className="font-bold text-[#213f5b] line-clamp-1">{product.libelle || product.reference}</h3>
                                        <p className="text-xs opacity-75">{product.reference}</p>
                                      </div>
                                    </div>
                                    <span className="text-xs font-medium rounded-full px-2 py-0.5 bg-[#213f5b] bg-opacity-10 text-[#213f5b]">
                                      {product.categorie}
                                    </span>
                                  </div>
                                  <p className="text-sm text-[#213f5b] opacity-75 line-clamp-2 mt-1">{product.description}</p>
                                </div>
                                
                                <div className="p-5">
                                  <div className="grid grid-cols-2 gap-y-2 mb-4">
                                    <div>
                                      <p className="text-xs text-[#213f5b] opacity-75">Prix TTC</p>
                                      <p className="font-semibold text-[#213f5b]">{product.prixTTC.toLocaleString()} € <span className="text-xs">({product.tva}%)</span></p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-[#213f5b] opacity-75">Quantité</p>
                                      <p className="font-semibold text-[#213f5b]">{product.quantite} <span className="text-xs">{product.unite}</span></p>
                                    </div>
                                    <div className="col-span-2 mt-1">
                                      <p className="text-xs text-[#213f5b] opacity-75">Opération</p>
                                      <p className="font-medium text-[#213f5b] text-sm truncate">{product.operation}</p>
                                    </div>
                                    <div className="col-span-2 mt-1">
                                      <p className="text-xs text-[#213f5b] opacity-75">Marque</p>
                                      <p className="font-medium text-[#213f5b] text-sm">{product.marque}</p>
                                    </div>
                                    {product.details.kwhCumac && (
                                      <div className="col-span-2 mt-1">
                                        <p className="text-xs text-[#213f5b] opacity-75">kWh Cumac</p>
                                        <p className="font-medium text-[#213f5b] text-sm">{product.details.kwhCumac}</p>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex justify-end gap-2 mt-4">
                                    <button 
                                      className="p-2 rounded-full text-[#213f5b] hover:bg-[#bfddf9] transition-colors"
                                      onClick={() => handleEditProduct(product)}
                                    >
                                      <PencilIcon className="h-4 w-4" />
                                    </button>
                                    <button 
                                      className="p-2 rounded-full text-[#213f5b] hover:bg-red-100 hover:text-red-500 transition-colors"
                                      onClick={() => handleDeleteProduct(product.id)}
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9]"
                                      onClick={() => handleEditProduct(product)}
                                    >
                                      Modifier
                                    </Button>
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
                              <h2 className="text-xl font-bold text-[#213f5b]">Infos générales</h2>
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
    {brands.map(brand => (
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
    {operations.map((operation) => (
      <option key={operation.id} value={`${operation.code} : ${operation.name}`}>
        {operation.code} : {operation.name}
      </option>
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
                    </>
                  )}
                </AnimatePresence>

                {/* Brand Tab Content */}
                <AnimatePresence mode="wait">
                  {activeTab === "marque" && (
                    <>
                      {viewMode === "list" && (
                        <motion.div
                          key="brand-list"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Brands Grid View */}
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
                            {filteredBrands.length === 0 ? (
                              <div className="col-span-full flex flex-col items-center justify-center py-12 text-[#213f5b]">
                                <BuildingStorefrontIcon className="h-16 w-16 mb-4 opacity-50" />
                                <h3 className="text-xl font-semibold mb-2">Aucune marque trouvée</h3>
                                <p className="text-sm opacity-75 mb-6">Ajoutez une nouvelle marque ou modifiez vos critères de recherche</p>
                                <Button
                                  onClick={handleAddNewBrand}
                                  className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                                >
                                  <PlusIcon className="h-4 w-4 mr-2" />
                                  Nouvelle Marque
                                </Button>
                              </div>
                            ) : (
                              filteredBrands.map((brand) => (
                                <motion.div
                                  key={brand.id}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="bg-white rounded-xl border border-[#eaeaea] shadow-sm hover:shadow-md hover:border-[#bfddf9] transition-all group"
                                  whileHover={{ y: -4 }}
                                >
                                  <div className="p-5 border-b border-[#eaeaea] bg-gradient-to-r from-white to-[#f8fafc]">
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="flex items-start gap-3">
                                        <div className="p-2 bg-[#bfddf9] bg-opacity-50 rounded-lg group-hover:bg-opacity-100 transition-colors">
                                          {brand.logoUrl ? (
                                            <img 
                                              src={brand.logoUrl} 
                                              alt={`Logo ${brand.name}`} 
                                              className="h-10 w-10 object-contain" 
                                            />
                                          ) : (
                                            <BuildingStorefrontIcon className="h-6 w-6 text-[#213f5b]" />
                                          )}
                                        </div>
                                        <div>
                                          <h3 className="font-bold text-[#213f5b] line-clamp-1">{brand.name}</h3>
                                          {brand.website && (
                                            <a 
                                              href={brand.website} 
                                              target="_blank" 
                                              rel="noopener noreferrer" 
                                              className="text-xs text-blue-500 hover:underline"
                                            >
                                              {brand.website}
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                      <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                                        brand.active 
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {brand.active ? 'Actif' : 'Inactif'}
                                      </span>
                                    </div>
                                    <p className="text-sm text-[#213f5b] opacity-75 line-clamp-2 mt-1">{brand.description}</p>
                                  </div>
                                  
                                  <div className="p-5">
                                    <div className="flex justify-end gap-2 mt-4">
                                      <button 
                                        className="p-2 rounded-full text-[#213f5b] hover:bg-[#bfddf9] transition-colors"
                                        onClick={() => handleEditBrand(brand)}
                                      >
                                        <PencilIcon className="h-4 w-4" />
                                      </button>
                                      <button 
                                        className="p-2 rounded-full text-[#213f5b] hover:bg-red-100 hover:text-red-500 transition-colors"
                                        onClick={() => handleDeleteBrand(brand.id)}
                                      >
                                        <TrashIcon className="h-4 w-4" />
                                      </button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9]"
                                        onClick={() => handleEditBrand(brand)}
                                      >
                                        Modifier
                                      </Button>
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
                          key="brand-form"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          {/* Brand form */}
                          <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-gradient-to-r from-white to-[#f8fafc] border-b p-6">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-1 rounded-full bg-[#213f5b]"></div>
                                <h2 className="text-xl font-bold text-[#213f5b]">
                                  {selectedBrand ? 'Modifier la marque' : 'Ajouter une nouvelle marque'}
                                </h2>
                              </div>
                              <p className="text-[#213f5b] opacity-75 ml-3 pl-3">Informations de la marque</p>
                            </div>
                            <div className="p-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="name-brand">Nom de la marque *</label>
                                  <input
                                    id="name-brand"
                                    type="text"
                                    name="name"
                                    value={brandForm.name}
                                    onChange={handleBrandFormChange}
                                    className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                                    placeholder="Nom de la marque"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="website">Site web</label>
                                  <input
                                    id="website"
                                    type="text"
                                    name="website"
                                    value={brandForm.website}
                                    onChange={handleBrandFormChange}
                                    className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                                    placeholder="https://example.com"
                                  />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                  <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="description-brand">Description</label>
                                  <textarea
                                    id="description-brand"
                                    name="description"
                                    value={brandForm.description}
                                    onChange={handleBrandFormChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                                    placeholder="Description de la marque..."
                                  />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                  <label className="block text-sm font-medium text-[#213f5b] mb-1">Logo</label>
                                  <div className="flex items-center gap-4">
                                    {brandForm.logoUrl && (
                                      <div className="w-24 h-24 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
                                        <img 
                                          src={brandForm.logoUrl} 
                                          alt="Logo preview" 
                                          className="max-w-full max-h-full object-contain" 
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <label className="flex flex-col items-center px-4 py-6 bg-white border border-dashed border-[#bfddf9] rounded-lg cursor-pointer hover:bg-[#f0f7ff]">
                                        <svg className="w-8 h-8 text-[#213f5b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                        <span className="mt-2 text-sm text-[#213f5b]">Cliquez pour télécharger un logo</span>
                                        <input 
                                          type="file" 
                                          className="hidden" 
                                          accept="image/*" 
                                          onChange={handleBrandLogoChange}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      className="sr-only peer"
                                      checked={brandForm.active}
                                      onChange={() => setBrandForm({...brandForm, active: !brandForm.active})}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-[#213f5b] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#213f5b]"></div>
                                    <span className="ml-3 text-sm font-medium text-[#213f5b]">Active</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Submit Buttons */}
                          <div className="flex flex-wrap justify-end gap-3 mt-4">
                            <Button
                              variant="outline"
                              className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9]"
                              onClick={handleCancelForm}
                            >
                              Annuler
                            </Button>
                            <Button
                              className="bg-[#213f5b] hover:bg-[#152a3d] text-white"
                              onClick={handleSaveBrand}
                            >
                              Enregistrer
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}
                </AnimatePresence>

                {/* Prestation Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === "prestation" && (
                  <>
                    {viewMode === "list" && (
                      <motion.div
                        key="prestation-list"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Prestations List View */}
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

                        {filteredPrestations.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-[#213f5b]">
                            <WrenchScrewdriverIcon className="h-16 w-16 mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold mb-2">Aucune prestation trouvée</h3>
                            <p className="text-sm opacity-75 mb-6">Ajoutez une nouvelle prestation ou modifiez vos critères de recherche</p>
                            <Button
                              onClick={handleAddNewPrestation}
                              className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                            >
                              <PlusIcon className="h-4 w-4 mr-2" />
                              Nouvelle Prestation
                            </Button>
                          </div>
                        ) : (
                          <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm text-left">
                                <thead className="text-xs text-[#213f5b] uppercase bg-[#f8fafc]">
                                  <tr>
                                    <th scope="col" className="px-6 py-4">Référence</th>
                                    <th scope="col" className="px-6 py-4">Désignation</th>
                                    <th scope="col" className="px-6 py-4">Prix TTC</th>
                                    <th scope="col" className="px-6 py-4">TVA</th>
                                    <th scope="col" className="px-6 py-4">Statut</th>
                                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredPrestations.map((prestation) => (
                                    <tr key={prestation.id} className="border-b hover:bg-[#f0f7ff] transition-colors">
                                      <td className="px-6 py-4 font-medium text-[#213f5b]">{prestation.reference}</td>
                                      <td className="px-6 py-4 text-[#213f5b] max-w-[300px] truncate">{prestation.designation}</td>
                                      <td className="px-6 py-4 text-[#213f5b]">{prestation.prixTTC} €</td>
                                      <td className="px-6 py-4 text-[#213f5b]">{prestation.tva}%</td>
                                      <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prestation.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                          {prestation.active ? 'Actif' : 'Inactif'}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 text-right space-x-2">
                                        <button 
                                          className="font-medium text-[#213f5b] hover:text-[#152a3d] p-1 rounded hover:bg-[#bfddf9]"
                                          onClick={() => handleEditPrestation(prestation)}
                                        >
                                          <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button 
                                          className="font-medium text-[#213f5b] hover:text-red-500 p-1 rounded hover:bg-red-100"
                                          onClick={() => handleDeletePrestation(prestation.id)}
                                        >
                                          <TrashIcon className="h-4 w-4" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                    
                    {viewMode === "form" && (
                      <motion.div
                        key="prestation-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        {/* Enregistrement prestation */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                          <div className="bg-gradient-to-r from-white to-[#f8fafc] border-b p-6">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-1 rounded-full bg-[#213f5b]"></div>
                              <h2 className="text-xl font-bold text-[#213f5b]">Enregistrement prestation</h2>
                            </div>
                            <p className="text-[#213f5b] opacity-75 ml-3 pl-3">Informations de base de la prestation</p>
                          </div>
                          <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="reference-prestation">Reference de la prestation *</label>
                                <input
                                  id="reference-prestation"
                                  type="text"
                                  name="reference"
                                  value={prestationForm.reference}
                                  onChange={handlePrestationChange}
                                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="quantite-prestation">Quantité</label>
                                <input
                                  id="quantite-prestation"
                                  type="number"
                                  name="quantite"
                                  value={prestationForm.quantite}
                                  onChange={handlePrestationChange}
                                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="unite-prestation">Selectionner une unité</label>
                                <input
                                  id="unite-prestation"
                                  type="text"
                                  name="unite"
                                  value={prestationForm.unite}
                                  onChange={handlePrestationChange}
                                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="prixTTC-prestation">Prix TTC</label>
                                <input
                                  id="prixTTC-prestation"
                                  type="number"
                                  name="prixTTC"
                                  value={prestationForm.prixTTC}
                                  onChange={handlePrestationChange}
                                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                                />
                              </div>

                              <div className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="designation-prestation">Désignation *</label>
                                <textarea
                                  id="designation-prestation"
                                  name="designation"
                                  value={prestationForm.designation}
                                  onChange={handlePrestationChange}
                                  rows={5}
                                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="tva-prestation">TVA</label>
                                <select
                                  id="tva-prestation"
                                  name="tva"
                                  value={prestationForm.tva}
                                  onChange={handlePrestationChange}
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
                              <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="codeComptable">Code comptable</label>
                                <input
                                  id="codeComptable"
                                  type="text"
                                  name="codeComptable"
                                  value={prestationForm.codeComptable}
                                  onChange={handlePrestationChange}
                                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                                />
                              </div>

                              <div className="flex items-center space-x-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={prestationForm.active}
                                    onChange={() => setPrestationForm({...prestationForm, active: !prestationForm.active})}
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-[#213f5b] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#213f5b]"></div>
                                  <span className="ml-3 text-sm font-medium text-[#213f5b]">Active</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Affecter cette prestation à une ou plusieurs opérations */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                          <div className="bg-gradient-to-r from-white to-[#f8fafc] border-b p-6">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-1 rounded-full bg-[#bfddf9]"></div>
                              <h2 className="text-xl font-bold text-[#213f5b]">Affecter cette prestation à une ou plusieurs opérations</h2>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="operations">Opération(s)</label>
                              <select
                                id="operations"
                                name="operations"
                                onChange={handlePrestationOperationChange}
                                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                              >
                                <option value="">Sélectionner une opération</option>
                                {operations.map((operation) => (
                                  <option key={operation.id} value={`${operation.code} : ${operation.name}`}>
                                    {operation.code} : {operation.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            {selectedOperations.length > 0 && (
                              <div className="mt-4">
                                <p className="text-sm font-medium text-[#213f5b] mb-2">Opérations sélectionnées:</p>
                                <div className="flex flex-wrap gap-2">
                                  {selectedOperations.map(op => (
                                    <div key={op} className="bg-[#bfddf9] text-[#213f5b] rounded-lg px-3 py-1 text-sm flex items-center">
                                      {op}
                                      <button
                                        onClick={() => setSelectedOperations(selectedOperations.filter(o => o !== op))}
                                        className="ml-2 text-[#213f5b] hover:text-red-500"
                                      >
                                        <XMarkIcon className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Affecter cette prestation à un ou plusieurs produits */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                          <div className="bg-gradient-to-r from-white to-[#f8fafc] border-b p-6">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-1 rounded-full bg-[#d2fcb2]"></div>
                              <h2 className="text-xl font-bold text-[#213f5b]">Affecter cette prestation à un ou plusieurs produits</h2>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="produits">Produit(s)</label>
                              <select
                                id="produits"
                                name="produits"
                                onChange={handleProduitSelection}
                                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                              >
                                <option value="">Sélectionner un produit</option>
                                {products.map(product => (
                                  <option key={product.id} value={product.id}>{product.libelle || product.reference}</option>
                                ))}
                              </select>
                            </div>
                            {selectedProducts.length > 0 && (
                              <div className="mt-4">
                                <p className="text-sm font-medium text-[#213f5b] mb-2">Produits sélectionnés:</p>
                                <div className="flex flex-wrap gap-2">
                                  {selectedProducts.map(prodId => {
                                    const product = products.find(p => p.id === prodId);
                                    return (
                                      <div key={prodId} className="bg-[#d2fcb2] text-[#213f5b] rounded-lg px-3 py-1 text-sm flex items-center">
                                        {product ? (product.libelle || product.reference) : prodId}
                                        <button
                                          onClick={() => setSelectedProducts(selectedProducts.filter(p => p !== prodId))}
                                          className="ml-2 text-[#213f5b] hover:text-red-500"
                                        >
                                          <XMarkIcon className="h-4 w-4" />
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Submit Buttons - Full Width */}
                        <div className="flex flex-wrap justify-end gap-3 mt-4">
                          <Button
                            variant="outline"
                            className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9]"
                            onClick={handleCancelForm}
                          >
                            Annuler
                          </Button>
                          <Button
                            className="bg-[#213f5b] hover:bg-[#152a3d] text-white"
                            onClick={handleSavePrestation}
                          >
                            Enregistrer
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </AnimatePresence>

              {/* Operation Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === "operation" && (
                  <>
                    {viewMode === "list" && (
                      <motion.div
                        key="operation-list"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Operations List View */}
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

                        {filteredOperations.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-[#213f5b]">
                            <CogIcon className="h-16 w-16 mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold mb-2">Aucune opération trouvée</h3>
                            <p className="text-sm opacity-75 mb-6">Ajoutez une nouvelle opération ou modifiez vos critères de recherche</p>
                            <Button
                              onClick={handleAddNewOperation}
                              className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                            >
                              <PlusIcon className="h-4 w-4 mr-2" />
                              Nouvelle Opération
                            </Button>
                          </div>
                        ) : (
                          <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm text-left">
                                <thead className="text-xs text-[#213f5b] uppercase bg-[#f8fafc]">
                                  <tr>
                                    <th scope="col" className="px-6 py-4">Code</th>
                                    <th scope="col" className="px-6 py-4">Nom</th>
                                    <th scope="col" className="px-6 py-4">Description</th>
                                    <th scope="col" className="px-6 py-4">Catégorie</th>
                                    <th scope="col" className="px-6 py-4">Statut</th>
                                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredOperations.map((operation) => (
                                    <tr key={operation.id} className="border-b hover:bg-[#f0f7ff] transition-colors">
                                      <td className="px-6 py-4 font-medium text-[#213f5b]">{operation.code}</td>
                                      <td className="px-6 py-4 text-[#213f5b]">{operation.name}</td>
                                      <td className="px-6 py-4 text-[#213f5b] max-w-[300px] truncate">{operation.description}</td>
                                      <td className="px-6 py-4 text-[#213f5b]">{operation.categorie}</td>
                                      <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${operation.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                          {operation.active ? 'Actif' : 'Inactif'}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 text-right space-x-2">
                                        <button 
                                          className="font-medium text-[#213f5b] hover:text-[#152a3d] p-1 rounded hover:bg-[#bfddf9]"
                                          onClick={() => handleEditOperation(operation)}
                                        >
                                          <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button 
                                          className="font-medium text-[#213f5b] hover:text-red-500 p-1 rounded hover:bg-red-100"
                                          onClick={() => handleDeleteOperation(operation.id)}
                                        >
                                          <TrashIcon className="h-4 w-4" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                    
                    {viewMode === "form" && (
                      <motion.div
                        key="operation-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        {/* Enregistrement opération */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                          <div className="bg-gradient-to-r from-white to-[#f8fafc] border-b p-6">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-1 rounded-full bg-[#213f5b]"></div>
                              <h2 className="text-xl font-bold text-[#213f5b]">Enregistrement opération</h2>
                            </div>
                            <p className="text-[#213f5b] opacity-75 ml-3 pl-3">Informations de base de l&apos;opération</p>
                          </div>
                          <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="code-operation">Code de l&apos;opération *</label>
                                <input
                                  id="code-operation"
                                  type="text"
                                  name="code"
                                  value={operationForm.code}
                                  onChange={handleOperationFormChange}
                                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                                  placeholder="Ex: BAR-TH-XXX"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="name-operation">Nom de l&apos;opération *</label>
                                <input
                                  id="name-operation"
                                  type="text"
                                  name="name"
                                  value={operationForm.name}
                                  onChange={handleOperationFormChange}
                                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                                  placeholder="Ex: POMPE A CHALEUR AIR/EAU"
                                />
                              </div>

                              <div className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="description-operation">Description *</label>
                                <textarea
                                  id="description-operation"
                                  name="description"
                                  value={operationForm.description}
                                  onChange={handleOperationFormChange}
                                  rows={3}
                                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                                  placeholder="Description détaillée de l'opération..."
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="categorie-operation">Catégorie</label>
                                <select
                                  id="categorie-operation"
                                  name="categorie"
                                  value={operationForm.categorie}
                                  onChange={handleOperationFormChange}
                                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                                >
                                  <option value="">Sélectionner une catégorie</option>
                                  <option value="CHAUFFAGE">CHAUFFAGE</option>
                                  <option value="EAU CHAUDE SANITAIRE">EAU CHAUDE SANITAIRE</option>
                                  <option value="ISOLATION">ISOLATION</option>
                                  <option value="VENTILATION">VENTILATION</option>
                                  <option value="ENERGIES RENOUVELABLES">ENERGIES RENOUVELABLES</option>
                                </select>
                              </div>

                              <div className="flex items-center space-x-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={operationForm.active}
                                    onChange={() => setOperationForm({...operationForm, active: !operationForm.active})}
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-[#213f5b] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#213f5b]"></div>
                                  <span className="ml-3 text-sm font-medium text-[#213f5b]">Active</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Submit Buttons - Full Width */}
                        <div className="flex flex-wrap justify-end gap-3 mt-4">
                          <Button
                            variant="outline"
                            className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9]"
                            onClick={handleCancelForm}
                          >
                            Annuler
                          </Button>
                          <Button
                            className="bg-[#213f5b] hover:bg-[#152a3d] text-white"
                            onClick={handleSaveOperation}
                          >
                            Enregistrer
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </AnimatePresence>
              </div>
            </div>
          </main>
        </div>
      </div>

  );
}