"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import {
  DocumentArrowDownIcon,
  PlusIcon,
  XMarkIcon,
  WrenchScrewdriverIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ListBulletIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";

// Interface for Prestation
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

// Interface for Product (simplified for reference)
// interface Product {
//   id: string;
//   reference: string;
//   libelle: string;
//   description: string;
//   // Other fields omitted for brevity
// }

// Form interface for Prestation
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

// Sample data for operations (simplified)
const SAMPLE_OPERATIONS = [
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

// Sample products (simplified)
const SAMPLE_PRODUCTS = [
  {
    id: "P001",
    reference: "PAC-AW-PREMIUM",
    description: "Pompe à chaleur Air/Eau haute performance énergétique",
    libelle: "PAC Air/Eau Premium",
  },
  {
    id: "P002",
    reference: "PAC-AA-MULTI",
    description: "Système multi-split air/air pour habitation jusqu'à 120m²",
    libelle: "PAC Air/Air Multisplit",
  },
  {
    id: "P003",
    reference: "GRANULES-FLAMME7",
    description: "Poêle à granulés avec technologie flamme verte 7*",
    libelle: "Poêle à granulés Premium",
  },
  {
    id: "P004",
    reference: "CET-AIR-AMBIANT",
    description: "Chauffe-eau thermodynamique sur air ambiant 200L",
    libelle: "CET 200L",
  },
  {
    id: "P005",
    reference: "SSC-COMPLET",
    description: "Système solaire combiné avec régulation intelligente",
    libelle: "Système Solaire Combiné",
  }
];

// Sample data for prestations
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

export default function PrestationsPage() {
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedOperations, setSelectedOperations] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  // State for prestation list
  const [prestations, setPrestations] = useState<Prestation[]>(SAMPLE_PRESTATIONS);
  
  // Selected item for editing
  const [selectedPrestation, setSelectedPrestation] = useState<Prestation | null>(null);
  
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

  // Edit handler
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

  // Delete handler
  const handleDeletePrestation = (id: string) => {
    setPrestations(prestations.filter(prestation => prestation.id !== id));
  };

  // Add new item handler
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

  // Save handler
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

  // Handle prestation form changes
  const handlePrestationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPrestationForm({
      ...prestationForm,
      [name]: value
    });
  };

  // Return to list view
  const handleCancelForm = () => {
    setViewMode("list");
    setSelectedPrestation(null);
  };

  // Filtered prestations based on search term
  const filteredPrestations = prestations.filter(prestation => 
    prestation.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prestation.designation.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#213f5b] to-[#2c5681] mb-2 pl-2">Prestations</h1>
                  <p className="text-[#213f5b] opacity-75 pl-2">Gestion des prestations de service</p>
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
                      onClick={handleAddNewPrestation}
                      className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Nouvelle Prestation
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
                    placeholder="Rechercher des prestations..."
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

            {/* Prestation Content */}
            <AnimatePresence mode="wait">
              {viewMode === "list" && (
                <motion.div
                  key="prestation-list"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Prestations Grid View */}
                  <div className="mb-4 flex justify-end">
                    <div className="inline-flex rounded-md shadow-sm">
                      <button 
                        type="button" 
                        className="px-4 py-2 text-sm font-medium text-white bg-[#213f5b] border border-[#213f5b] rounded-l-lg hover:bg-[#152a3d] focus:z-10 focus:outline-none"
                      >
                        <TableCellsIcon className="w-5 h-5" />
                      </button>
                      <button 
                        type="button" 
                        className="px-4 py-2 text-sm font-medium text-[#213f5b] bg-white border border-[#bfddf9] rounded-r-lg hover:bg-[#f0f7ff] focus:z-10 focus:outline-none"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredPrestations.map((prestation) => (
                        <motion.div
                          key={prestation.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-white rounded-xl border border-[#eaeaea] shadow-sm hover:shadow-md hover:border-[#bfddf9] transition-all group"
                          whileHover={{ y: -4 }}
                        >
                          <div className="p-5 border-b border-[#eaeaea] bg-gradient-to-r from-white to-[#f8fafc]">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-[#bfddf9] bg-opacity-50 rounded-lg group-hover:bg-opacity-100 transition-colors">
                                  <WrenchScrewdriverIcon className="h-6 w-6 text-[#213f5b]" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-[#213f5b] line-clamp-1">{prestation.reference}</h3>
                                  <div className="flex items-center mt-1">
                                    <span className="text-xs font-medium mr-2">Prix: {prestation.prixTTC} €</span>
                                    <span className="text-xs font-medium">TVA: {prestation.tva}%</span>
                                  </div>
                                </div>
                              </div>
                              <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                                prestation.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {prestation.active ? 'Actif' : 'Inactif'}
                              </span>
                            </div>
                            <p className="text-sm text-[#213f5b] opacity-75 line-clamp-3 mt-2">{prestation.designation}</p>
                          </div>
                          
                          <div className="p-5">
                            <div className="space-y-3">
                              {prestation.operations && prestation.operations.length > 0 && (
                                <div>
                                  <p className="text-xs text-[#213f5b] opacity-75 mb-1">Opérations associées</p>
                                  <div className="flex flex-wrap gap-2">
                                    {prestation.operations.map(op => (
                                      <span key={op} className="inline-flex text-xs bg-[#bfddf9] text-[#213f5b] rounded-lg px-2 py-1">
                                        {op.split(" : ")[0]}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {prestation.produits && prestation.produits.length > 0 && (
                                <div>
                                  <p className="text-xs text-[#213f5b] opacity-75 mb-1">Produits associés</p>
                                  <div className="flex flex-wrap gap-2">
                                    {prestation.produits.map(prodId => {
                                      const product = SAMPLE_PRODUCTS.find(p => p.id === prodId);
                                      return (
                                        <span key={prodId} className="inline-flex text-xs bg-[#d2fcb2] text-[#213f5b] rounded-lg px-2 py-1">
                                          {product ? (product.libelle || product.reference) : prodId}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex justify-end gap-2 mt-4">
                              <button 
                                className="p-2 rounded-full text-[#213f5b] hover:bg-[#bfddf9] transition-colors"
                                onClick={() => handleEditPrestation(prestation)}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button 
                                className="p-2 rounded-full text-[#213f5b] hover:bg-red-100 hover:text-red-500 transition-colors"
                                onClick={() => handleDeletePrestation(prestation.id)}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9]"
                                onClick={() => handleEditPrestation(prestation)}
                              >
                                Modifier
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
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
                          {SAMPLE_OPERATIONS.map((operation) => (
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
                          {SAMPLE_PRODUCTS.map(product => (
                            <option key={product.id} value={product.id}>{product.libelle || product.reference}</option>
                          ))}
                        </select>
                      </div>
                      {selectedProducts.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-[#213f5b] mb-2">Produits sélectionnés:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedProducts.map(prodId => {
                              const product = SAMPLE_PRODUCTS.find(p => p.id === prodId);
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
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
