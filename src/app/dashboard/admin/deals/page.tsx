"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import {
  DocumentArrowDownIcon,
  PlusIcon,
  XMarkIcon,
  CurrencyEuroIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ListBulletIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";

// Interface for Deal entity
interface Deal {
  id: string;
  nomDuDeal: string;
  ratioInstallateur: number; // Stored as decimal (e.g., 0.7 for 70%)
  ratioBeneficiaire: number; // Stored as decimal (e.g., 0.3 for 30%)
  active: boolean;
}

// Interface for the form state
interface DealForm {
  id: string;
  nomDuDeal: string;
  ratioInstallateur: string; // Using string for form
  ratioBeneficiaire: string; // Using string for form
  active: boolean;
}

// Sample data for deals
const SAMPLE_DEALS: Deal[] = [
  {
    id: "D001",
    nomDuDeal: "Rénovation énergétique standard",
    ratioInstallateur: 0.700,
    ratioBeneficiaire: 0.300,
    active: true
  },
  {
    id: "D002",
    nomDuDeal: "Pompe à chaleur premium",
    ratioInstallateur: 0.650,
    ratioBeneficiaire: 0.350,
    active: true
  },
  {
    id: "D003",
    nomDuDeal: "Isolation complète",
    ratioInstallateur: 0.600,
    ratioBeneficiaire: 0.400,
    active: false
  },
  {
    id: "D004",
    nomDuDeal: "Solaire résidentiel",
    ratioInstallateur: 0.750,
    ratioBeneficiaire: 0.250,
    active: true
  }
];

export default function DealsPage() {
  // View mode state (list or form)
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // State for deals data
  const [deals, setDeals] = useState<Deal[]>(SAMPLE_DEALS);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // State for form
  const [dealForm, setDealForm] = useState<DealForm>({
    id: "",
    nomDuDeal: "",
    ratioInstallateur: "",
    ratioBeneficiaire: "",
    active: true
  });

  // Helper function to format number with comma as decimal separator
  const formatDecimal = (value: number): string => {
    return value.toFixed(3).replace('.', ',');
  };

  // Helper function to parse a French decimal string to a number
  const parseDecimal = (value: string): number => {
    return parseFloat(value.replace(',', '.')) || 0;
  };

  // Edit handler
  const handleEditDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setDealForm({
      id: deal.id,
      nomDuDeal: deal.nomDuDeal,
      ratioInstallateur: formatDecimal(deal.ratioInstallateur),
      ratioBeneficiaire: formatDecimal(deal.ratioBeneficiaire),
      active: deal.active
    });
    setViewMode("form");
  };

  // Delete handler
  const handleDeleteDeal = (id: string) => {
    setDeals(deals.filter(deal => deal.id !== id));
  };

  // Add new deal handler
  const handleAddNewDeal = () => {
    setSelectedDeal(null);
    setDealForm({
      id: `D${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      nomDuDeal: "",
      ratioInstallateur: "",
      ratioBeneficiaire: "",
      active: true
    });
    setViewMode("form");
  };

  // Save handler
  const handleSaveDeal = () => {
    const dealToSave: Deal = {
      id: dealForm.id,
      nomDuDeal: dealForm.nomDuDeal,
      ratioInstallateur: parseDecimal(dealForm.ratioInstallateur),
      ratioBeneficiaire: parseDecimal(dealForm.ratioBeneficiaire),
      active: dealForm.active
    };

    if (selectedDeal) {
      // Update existing deal
      setDeals(deals.map(d => d.id === dealToSave.id ? dealToSave : d));
    } else {
      // Add new deal
      setDeals([...deals, dealToSave]);
    }
    setViewMode("list");
  };

  // Handle form changes
  const handleDealChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDealForm({
      ...dealForm,
      [name]: value
    });
  };

  // Auto-calculate remaining ratio
  const handleRatioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Parse input value, allow comma as decimal separator
    const inputValue = value.replace(',', '.');
    const numValue = parseFloat(inputValue) || 0;
    
    // Ensure value is between 0 and 1
    const clampedValue = Math.min(1, Math.max(0, numValue));
    
    if (name === "ratioInstallateur") {
      setDealForm({
        ...dealForm,
        ratioInstallateur: formatDecimal(clampedValue),
        ratioBeneficiaire: formatDecimal(1 - clampedValue)
      });
    } else if (name === "ratioBeneficiaire") {
      setDealForm({
        ...dealForm,
        ratioBeneficiaire: formatDecimal(clampedValue),
        ratioInstallateur: formatDecimal(1 - clampedValue)
      });
    }
  };

  // Return to list view
  const handleCancelForm = () => {
    setViewMode("list");
    setSelectedDeal(null);
  };

  // Filtered deals based on search term
  const filteredDeals = deals.filter(deal => 
    deal.nomDuDeal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get color based on installateur ratio
  const getRatioColor = (ratio: number) => {
    if (ratio >= 0.7) return "text-green-600";
    if (ratio >= 0.5) return "text-blue-600";
    return "text-orange-500";
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
                  <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#213f5b] to-[#2c5681] mb-2 pl-2">Deals</h1>
                  <p className="text-[#213f5b] opacity-75 pl-2">Gérez les deals et les ratios de distribution</p>
                  <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-[#bfddf9] opacity-10 rounded-full blur-3xl"></div>
                </div>
                
                {viewMode === "list" && (
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {/* Handle Export */}}
                      className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] transition-colors rounded-lg px-4 py-2 flex items-center"
                    >
                      <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                      Exporter
                    </Button>
                    <Button
                      onClick={handleAddNewDeal}
                      className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Nouveau Deal
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
                    placeholder="Rechercher des deals..."
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

            {/* Main Content */}
            {viewMode === "list" && (
              <motion.div
                key="deal-list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Display options */}
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

                {filteredDeals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-[#213f5b]">
                    <CurrencyEuroIcon className="h-16 w-16 mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">Aucun deal trouvé</h3>
                    <p className="text-sm opacity-75 mb-6">Ajoutez un nouveau deal ou modifiez vos critères de recherche</p>
                    <Button
                      onClick={handleAddNewDeal}
                      className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Nouveau Deal
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDeals.map((deal) => (
                      <motion.div
                        key={deal.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-xl border border-[#eaeaea] shadow-sm hover:shadow-md hover:border-[#bfddf9] transition-all group"
                        whileHover={{ y: -4 }}
                      >
                        <div className="p-5 border-b border-[#eaeaea] bg-gradient-to-r from-white to-[#f8fafc]">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-[#bfddf9] bg-opacity-50 rounded-lg group-hover:bg-opacity-100 transition-colors">
                                <CurrencyEuroIcon className="h-6 w-6 text-[#213f5b]" />
                              </div>
                              <div>
                                <h3 className="font-bold text-[#213f5b] line-clamp-1">{deal.nomDuDeal}</h3>
                                <p className="text-xs opacity-75">ID: {deal.id}</p>
                              </div>
                            </div>
                            <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${deal.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {deal.active ? 'Actif' : 'Inactif'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-5">
                          <div className="space-y-4 mb-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-xs text-[#213f5b] opacity-75">Ratio installateur:</span>
                                <span className={`text-sm font-medium ${getRatioColor(deal.ratioInstallateur)}`}>{formatDecimal(deal.ratioInstallateur)}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-[#213f5b] h-2.5 rounded-full" style={{ width: `${deal.ratioInstallateur * 100}%` }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-xs text-[#213f5b] opacity-75">Ratio bénéficiaire:</span>
                                <span className={`text-sm font-medium ${getRatioColor(deal.ratioBeneficiaire)}`}>{formatDecimal(deal.ratioBeneficiaire)}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-[#4ade80] h-2.5 rounded-full" style={{ width: `${deal.ratioBeneficiaire * 100}%` }}></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-4">
                            <button 
                              className="p-2 rounded-full text-[#213f5b] hover:bg-[#bfddf9] transition-colors"
                              onClick={() => handleEditDeal(deal)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-2 rounded-full text-[#213f5b] hover:bg-red-100 hover:text-red-500 transition-colors"
                              onClick={() => handleDeleteDeal(deal.id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9]"
                              onClick={() => handleEditDeal(deal)}
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
                key="deal-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-white to-[#f8fafc] border-b p-6">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-1 rounded-full bg-[#213f5b]"></div>
                      <h2 className="text-xl font-bold text-[#213f5b]">{selectedDeal ? 'Modifier le deal' : 'Ajouter un deal'}</h2>
                    </div>
                    <p className="text-[#213f5b] opacity-75 ml-3 pl-3">Informations du deal et répartition des ratios</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      {/* Nom du deal */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="nomDuDeal">
                          Nom du deal <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="nomDuDeal"
                          type="text"
                          name="nomDuDeal"
                          required
                          value={dealForm.nomDuDeal}
                          onChange={handleDealChange}
                          className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                        />
                      </div>

                      {/* Ratio installateur */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="ratioInstallateur">
                          Ratio installateur <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="ratioInstallateur"
                          type="text"
                          name="ratioInstallateur"
                          placeholder="0,000"
                          value={dealForm.ratioInstallateur}
                          onChange={handleRatioChange}
                          className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                        />
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div 
                            className="bg-[#213f5b] h-2.5 rounded-full transition-all duration-300" 
                            style={{ width: `${parseDecimal(dealForm.ratioInstallateur) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Ratio bénéficiaire */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="ratioBeneficiaire">
                          Ratio bénéficiaire <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="ratioBeneficiaire"
                          type="text"
                          name="ratioBeneficiaire"
                          placeholder="0,000"
                          value={dealForm.ratioBeneficiaire}
                          onChange={handleRatioChange}
                          className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                        />
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div 
                            className="bg-[#4ade80] h-2.5 rounded-full transition-all duration-300" 
                            style={{ width: `${parseDecimal(dealForm.ratioBeneficiaire) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Total calculation */}
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-[#213f5b]">Total des ratios:</span>
                          <span className={`text-sm font-bold ${
                            Math.abs(parseDecimal(dealForm.ratioInstallateur) + parseDecimal(dealForm.ratioBeneficiaire) - 1) < 0.001
                              ? 'text-green-600' 
                              : 'text-red-500'
                          }`}>
                            {formatDecimal(parseDecimal(dealForm.ratioInstallateur) + parseDecimal(dealForm.ratioBeneficiaire))}
                          </span>
                        </div>
                        {Math.abs(parseDecimal(dealForm.ratioInstallateur) + parseDecimal(dealForm.ratioBeneficiaire) - 1) >= 0.001 && (
                          <p className="text-xs text-red-500 mt-1">Le total des ratios doit être égal à 1,000</p>
                        )}
                      </div>

                      {/* Active status */}
                      <div className="flex items-center space-x-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={dealForm.active}
                            onChange={() => setDealForm({...dealForm, active: !dealForm.active})}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-[#213f5b] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#213f5b]"></div>
                          <span className="ml-3 text-sm font-medium text-[#213f5b]">Actif</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 p-6 border-t border-[#eaeaea]">
                    <Button
                      variant="outline"
                      className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9]"
                      onClick={handleCancelForm}
                    >
                      Annuler
                    </Button>
                    <Button
                      className="bg-[#213f5b] hover:bg-[#152a3d] text-white"
                      disabled={!dealForm.nomDuDeal || Math.abs(parseDecimal(dealForm.ratioInstallateur) + parseDecimal(dealForm.ratioBeneficiaire) - 1) >= 0.001}
                      onClick={handleSaveDeal}
                    >
                      Enregistrer
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
