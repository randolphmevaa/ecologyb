"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import {
  DocumentArrowDownIcon,
  PlusIcon,
  XMarkIcon,
  BuildingStorefrontIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ListBulletIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";

// Interface for Brand
interface Brand {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  website?: string;
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

export default function MarquesPage() {
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Brands state
  const [brands, setBrands] = useState<Brand[]>(SAMPLE_BRANDS);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  
  // State for file uploads
  const [, setBrandLogo] = useState<File | null>(null);
  
  // Form state
  const [brandForm, setBrandForm] = useState<BrandForm>({
    id: "",
    name: "",
    description: "",
    logoUrl: "",
    website: "",
    active: true
  });

  // Handle file upload
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

  // Edit handler
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

  // Delete handler
  const handleDeleteBrand = (id: string) => {
    setBrands(brands.filter(brand => brand.id !== id));
  };

  // Add new brand handler
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

  // Save handler
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

  // Form change handler
  const handleBrandFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBrandForm({
      ...brandForm,
      [name]: value
    });
  };

  // Cancel form handler
  const handleCancelForm = () => {
    setViewMode("list");
    setSelectedBrand(null);
  };

  // Filtered brands based on search term
  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (brand.website && brand.website.toLowerCase().includes(searchTerm.toLowerCase()))
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
                  <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#213f5b] to-[#2c5681] mb-2 pl-2">Marques</h1>
                  <p className="text-[#213f5b] opacity-75 pl-2">Gestion des marques et fabricants</p>
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
                      onClick={handleAddNewBrand}
                      className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Nouvelle Marque
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
                    placeholder="Rechercher des marques..."
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

            {/* Brand Content */}
            <AnimatePresence mode="wait">
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

                  {filteredBrands.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-[#213f5b]">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredBrands.map((brand) => (
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
                      ))}
                    </div>
                  )}
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
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
