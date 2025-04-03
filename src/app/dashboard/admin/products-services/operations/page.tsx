"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import {
  DocumentArrowDownIcon,
  PlusIcon,
  XMarkIcon,
  CogIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ListBulletIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";

// Interface for Operation
interface Operation {
  id: string;
  code: string;
  name: string;
  description: string;
  categorie: string;
  active: boolean;
  kwhCumac?: string;
  typeCoupDePouce?: string;
  kwhCumacCoupDePouce?: string;
  kwhCumacHorsCoupDePouce?: string;
}

// Form interface for Operation
interface OperationForm {
  id: string;
  code: string;
  name: string;
  description: string;
  categorie: string;
  active: boolean;
  kwhCumac?: string;
  typeCoupDePouce?: string;
  kwhCumacCoupDePouce?: string;
  kwhCumacHorsCoupDePouce?: string;
}

// Sample data for operations
const SAMPLE_OPERATIONS: Operation[] = [
  {
    id: "O001",
    code: "BAR-TH-171",
    name: "POMPE A CHALEUR AIR/EAU",
    description: "Installation d'une pompe à chaleur air/eau pour le chauffage de locaux à usage d'habitation.",
    categorie: "CHAUFFAGE",
    active: true,
    // kwhCumac: "85000"
    kwhCumac: "60000",
    typeCoupDePouce: "COUP DE POUCE",
    kwhCumacCoupDePouce: "120000"
  },
  {
    id: "O002",
    code: "BAR-TH-129",
    name: "POMPE A CHALEUR AIR/AIR",
    description: "Installation d'une pompe à chaleur air/air pour le chauffage des locaux à usage d'habitation.",
    categorie: "CHAUFFAGE",
    active: true,
    kwhCumac: "45000"
  },
  {
    id: "O003",
    code: "BAR-TH-112",
    name: "POELE A GRANULES",
    description: "Installation d'un poêle à granulés ou à bûches.",
    categorie: "CHAUFFAGE",
    active: true,
    kwhCumac: "37000"
  },
  {
    id: "O004",
    code: "BAR-TH-148",
    name: "CHAUFFE EAU THERMODYNAMIQUE",
    description: "Installation d'un chauffe-eau thermodynamique à accumulation.",
    categorie: "EAU CHAUDE SANITAIRE",
    active: true,
    kwhCumac: "28000"
  },
  {
    id: "O005",
    code: "BAR-TH-143",
    name: "SYSTEME SOLAIRE COMBINE",
    description: "Installation d'un système solaire combiné (SSC).",
    categorie: "CHAUFFAGE",
    active: true,
    kwhCumac: "95000",
    typeCoupDePouce: "COUP DE POUCE",
    kwhCumacCoupDePouce: "120000"
  },
  {
    id: "O006",
    code: "BAR-TH-101",
    name: "CHAUFFE EAU SOLAIRE INDIVIDUEL",
    description: "Installation d'un chauffe-eau solaire individuel (CESI).",
    categorie: "EAU CHAUDE SANITAIRE",
    active: true,
    kwhCumac: "42000"
  },
  {
    id: "O007",
    code: "BAR-TH-113",
    name: "CHAUDIERE BIOMASSE",
    description: "Installation d'une chaudière biomasse individuelle à haute performance énergétique.",
    categorie: "CHAUFFAGE",
    active: true,
    kwhCumac: "60000",
    typeCoupDePouce: "COUP DE POUCE",
    kwhCumacCoupDePouce: "120000"
  }
];

export default function OperationsPage() {
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Operations state
  const [operations, setOperations] = useState<Operation[]>(SAMPLE_OPERATIONS);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  
  // Form state
  const [operationForm, setOperationForm] = useState<OperationForm>({
    id: "",
    code: "",
    name: "",
    description: "",
    categorie: "",
    active: true,
    kwhCumac: ""
  });

  // Edit handler
  const handleEditOperation = (operation: Operation) => {
    setSelectedOperation(operation);
    setOperationForm({
      id: operation.id,
      code: operation.code,
      name: operation.name,
      description: operation.description,
      categorie: operation.categorie,
      active: operation.active,
      kwhCumac: operation.kwhCumac || "",
      typeCoupDePouce: operation.typeCoupDePouce || "",
      kwhCumacCoupDePouce: operation.kwhCumacCoupDePouce || "",
      kwhCumacHorsCoupDePouce: operation.kwhCumacHorsCoupDePouce || ""
    });
    setViewMode("form");
  };

  // Delete handler
  const handleDeleteOperation = (id: string) => {
    setOperations(operations.filter(operation => operation.id !== id));
  };

  // Add new handler
  const handleAddNewOperation = () => {
    setSelectedOperation(null);
    setOperationForm({
      id: `O${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      code: "",
      name: "",
      description: "",
      categorie: "",
      active: true,
      kwhCumac: ""
    });
    setViewMode("form");
  };

  // Save handler
  const handleSaveOperation = () => {
    const operationToSave: Operation = {
      id: operationForm.id,
      code: operationForm.code,
      name: operationForm.name,
      description: operationForm.description,
      categorie: operationForm.categorie,
      active: operationForm.active,
      kwhCumac: operationForm.kwhCumac,
      typeCoupDePouce: operationForm.typeCoupDePouce,
      kwhCumacCoupDePouce: operationForm.kwhCumacCoupDePouce,
      kwhCumacHorsCoupDePouce: operationForm.kwhCumacHorsCoupDePouce
    };

    if (selectedOperation) {
      // Update existing operation
      setOperations(operations.map(o => o.id === operationToSave.id ? operationToSave : o));
    } else {
      // Add new operation
      setOperations([...operations, operationToSave]);
    }
    setViewMode("list");
  };

  // Form change handler
  const handleOperationFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOperationForm({
      ...operationForm,
      [name]: value
    });
  };

  // Cancel form handler
  const handleCancelForm = () => {
    setViewMode("list");
    setSelectedOperation(null);
  };

  // Filtered operations based on search term
  const filteredOperations = operations.filter(operation => 
    operation.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operation.description.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#213f5b] to-[#2c5681] mb-2 pl-2">Opérations</h1>
                  <p className="text-[#213f5b] opacity-75 pl-2">Gestion des opérations éligibles aux CEE</p>
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
                      onClick={handleAddNewOperation}
                      className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Nouvelle Opération
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
                    placeholder="Rechercher des opérations..."
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

            {/* Operation Content */}
            <AnimatePresence mode="wait">
              {viewMode === "list" && (
                <motion.div
                  key="operation-list"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Operations Grid View */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredOperations.map((operation) => (
                        <motion.div
                          key={operation.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-white rounded-xl border border-[#eaeaea] shadow-sm hover:shadow-md hover:border-[#bfddf9] transition-all group"
                          whileHover={{ y: -4 }}
                        >
                          <div className="p-5 border-b border-[#eaeaea] bg-gradient-to-r from-white to-[#f8fafc]">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-[#bfddf9] bg-opacity-50 rounded-lg group-hover:bg-opacity-100 transition-colors">
                                  <CogIcon className="h-6 w-6 text-[#213f5b]" />
                                </div>
                                <div>
                                  <div className="flex items-center">
                                    <h3 className="font-bold text-[#213f5b]">{operation.code}</h3>
                                  </div>
                                  <p className="text-sm font-medium text-[#213f5b]">{operation.name}</p>
                                </div>
                              </div>
                              <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                                operation.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {operation.active ? 'Actif' : 'Inactif'}
                              </span>
                            </div>
                            <p className="text-sm text-[#213f5b] opacity-75 line-clamp-3 mt-2">{operation.description}</p>
                          </div>
                          
                          <div className="p-5">
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs text-[#213f5b] opacity-75 mb-1">Catégorie</p>
                                <p className="text-sm font-medium text-[#213f5b]">{operation.categorie}</p>
                              </div>
                              
                              {/* Display kWh Cumac for all operations */}
                              {operation.kwhCumac && (
                                <div>
                                  <p className="text-xs text-[#213f5b] opacity-75 mb-1">kWh Cumac</p>
                                  <p className="text-sm font-medium text-[#213f5b]">{parseInt(operation.kwhCumac).toLocaleString()}</p>
                                </div>
                              )}
                              
                              {/* Display Coup de Pouce type if applicable */}
                              {operation.typeCoupDePouce && (
                                <div>
                                  <p className="text-xs text-[#213f5b] opacity-75 mb-1">Type de valorisation</p>
                                  <p className="text-sm font-medium text-[#213f5b]">{operation.typeCoupDePouce}</p>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex justify-end gap-2 mt-4">
                              <button 
                                className="p-2 rounded-full text-[#213f5b] hover:bg-[#bfddf9] transition-colors"
                                onClick={() => handleEditOperation(operation)}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button 
                                className="p-2 rounded-full text-[#213f5b] hover:bg-red-100 hover:text-red-500 transition-colors"
                                onClick={() => handleDeleteOperation(operation.id)}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9]"
                                onClick={() => handleEditOperation(operation)}
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
                        <h2 className="text-xl font-bold text-[#213f5b]">
                          {selectedOperation ? 'Modifier l\'opération' : 'Ajouter une nouvelle opération'}
                        </h2>
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
                        
                        {/* kWh Cumac Input - only for operations that don't have Coup de Pouce or when no type is selected */}
                        {(!["BAR-TH-171", "BAR-TH-143", "BAR-TH-113"].includes(operationForm.code) || 
                         (["BAR-TH-171", "BAR-TH-143", "BAR-TH-113"].includes(operationForm.code) && !operationForm.typeCoupDePouce)) && (
                          <div className="space-y-2 md:col-span-2 border-t pt-4 mt-4">
                            <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="kwhCumac">kWh Cumac standard</label>
                            <input
                              id="kwhCumac"
                              type="text"
                              name="kwhCumac"
                              value={operationForm.kwhCumac || ""}
                              onChange={handleOperationFormChange}
                              className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                              placeholder="Entrez la valeur kWh Cumac standard"
                            />
                          </div>
                        )}
                        
                        {/* COUP DE POUCE fields - only for BAR-TH-171 and BAR-TH-143 and BAR-TH-113 */}
                        {(operationForm.code === "BAR-TH-171" || operationForm.code === "BAR-TH-143" || operationForm.code === "BAR-TH-113") && (
                          <div className="space-y-4 md:col-span-2 border-t pt-4 mt-2">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-[#213f5b] mb-1">Type de valorisation</label>
                              <div className="flex items-center space-x-4">
                                <label className="inline-flex items-center cursor-pointer">
                                  <input
                                    type="radio"
                                    name="typeCoupDePouce"
                                    value="COUP DE POUCE"
                                    checked={(operationForm.typeCoupDePouce || "") === "COUP DE POUCE"}
                                    onChange={(e) => setOperationForm({
                                      ...operationForm,
                                      typeCoupDePouce: e.target.value
                                    })}
                                    className="mr-2 h-4 w-4 text-[#213f5b] focus:ring-[#213f5b]"
                                  />
                                  <span className="text-sm font-medium text-[#213f5b]">COUP DE POUCE</span>
                                </label>
                                <label className="inline-flex items-center cursor-pointer">
                                  <input
                                    type="radio"
                                    name="typeCoupDePouce"
                                    value="HORS COUP DE POUCE"
                                    checked={(operationForm.typeCoupDePouce || "") === "HORS COUP DE POUCE"}
                                    onChange={(e) => setOperationForm({
                                      ...operationForm,
                                      typeCoupDePouce: e.target.value
                                    })}
                                    className="mr-2 h-4 w-4 text-[#213f5b] focus:ring-[#213f5b]"
                                  />
                                  <span className="text-sm font-medium text-[#213f5b]">HORS COUP DE POUCE</span>
                                </label>
                              </div>
                            </div>
                            
                            {/* Conditional fields based on COUP DE POUCE selection */}
                            {operationForm.typeCoupDePouce === "COUP DE POUCE" && (
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#213f5b] mb-1">kWh Cumac (Coup de Pouce)</label>
                                <input
                                  type="text"
                                  name="kwhCumacCoupDePouce"
                                  value={operationForm.kwhCumacCoupDePouce || ""}
                                  onChange={handleOperationFormChange}
                                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                                  placeholder="Entrez la valeur kWh Cumac pour Coup de Pouce"
                                />
                              </div>
                            )}
                            
                            {operationForm.typeCoupDePouce === "HORS COUP DE POUCE" && (
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#213f5b] mb-1">kWh Cumac (Hors Coup de Pouce)</label>
                                <input
                                  type="text"
                                  name="kwhCumacHorsCoupDePouce"
                                  value={operationForm.kwhCumacHorsCoupDePouce || ""}
                                  onChange={handleOperationFormChange}
                                  className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                                  placeholder="Entrez la valeur kWh Cumac hors Coup de Pouce"
                                />
                              </div>
                            )}
                          </div>
                        )}
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
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
