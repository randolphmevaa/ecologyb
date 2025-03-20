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
  ListBulletIcon,
  TableCellsIcon,
  ChevronLeftIcon,
  UserIcon,
  DocumentCheckIcon,
  // CertificateIcon, // We'll use this for certifications
  // InformationCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  // IdentificationIcon,
  // ClockIcon,
} from "@heroicons/react/24/outline";

// Interface for Sous-traitant data model
interface SousTraitant {
  id: string;
  raisonSociale: string;
  typeSociete: string;
  telephone: string;
  adresse: string;
  codePostal: string;
  ville: string;
  active: boolean;
  sousTraitant: boolean;
  
  // New fields
  nomDirigeant: string;
  prenomDirigeant: string;
  fonction: string;
  email: string;
  telephoneMobile: string;
  siret: string;
  siren: string;
  numeroDecennale: string;
  dateValiditeDecennale: string;
  numeroTVA: string;
  numeroRepertoireMetiers: string;
  signatureTampon: string; // Will store file path or name

  // Certification fields
  qualibat: boolean;
  dateDebutQualibat: string;
  dateFinQualibat: string;
  
  qualisol: boolean;
  dateDebutQualisol: string;
  dateFinQualisol: string;
  
  qualipac: boolean;
  dateDebutQualipac: string;
  dateFinQualipac: string;
  
  qualibois: boolean;
  dateDebutQualibois: string;
  dateFinQualibois: string;
  
  opqibi: boolean;
  dateDebutOpqibi: string;
  dateFinOpqibi: string;
  
  ventilation: boolean;
  dateDebutVentilation: string;
  dateFinVentilation: string;
  
  rgeEtude: boolean;
  dateDebutRGEEtude: string;
  dateFinRGEEtude: string;
  
  qualiPv: boolean;
  dateDebutQualiPv: string;
  dateFinQualiPv: string;
  
  numeroCNOA: string;
  dateDebutCNOA: string;
  dateFinCNOA: string;
}

// Interface for the form state
interface SousTraitantForm {
  id: string;
  raisonSociale: string;
  typeSociete: string;
  telephone: string;
  adresse: string;
  codePostal: string;
  ville: string;
  active: boolean;
  sousTraitant: boolean;
  
  // New fields
  nomDirigeant: string;
  prenomDirigeant: string;
  fonction: string;
  email: string;
  telephoneMobile: string;
  siret: string;
  siren: string;
  numeroDecennale: string;
  dateValiditeDecennale: string;
  numeroTVA: string;
  numeroRepertoireMetiers: string;
  signatureTampon: string;

  // Certification fields
  qualibat: boolean;
  dateDebutQualibat: string;
  dateFinQualibat: string;
  
  qualisol: boolean;
  dateDebutQualisol: string;
  dateFinQualisol: string;
  
  qualipac: boolean;
  dateDebutQualipac: string;
  dateFinQualipac: string;
  
  qualibois: boolean;
  dateDebutQualibois: string;
  dateFinQualibois: string;
  
  opqibi: boolean;
  dateDebutOpqibi: string;
  dateFinOpqibi: string;
  
  ventilation: boolean;
  dateDebutVentilation: string;
  dateFinVentilation: string;
  
  rgeEtude: boolean;
  dateDebutRGEEtude: string;
  dateFinRGEEtude: string;
  
  qualiPv: boolean;
  dateDebutQualiPv: string;
  dateFinQualiPv: string;
  
  numeroCNOA: string;
  dateDebutCNOA: string;
  dateFinCNOA: string;
}

// Sample data for sous-traitants (now with expanded fields)
const SAMPLE_SOUS_TRAITANTS: SousTraitant[] = [
  {
    id: "ST001",
    raisonSociale: "Thermo Experts",
    typeSociete: "SARL",
    telephone: "01 23 45 67 89",
    telephoneMobile: "06 12 34 56 78",
    adresse: "12 rue des Artisans, ZI des Entrepreneurs",
    codePostal: "75001",
    ville: "Paris",
    active: true,
    sousTraitant: true,
    
    // New fields with sample data
    nomDirigeant: "Dupont",
    prenomDirigeant: "Jean",
    fonction: "Gérant",
    email: "contact@thermo-experts.fr",
    siret: "12345678901234",
    siren: "123456789",
    numeroDecennale: "DEC-2023-789",
    dateValiditeDecennale: "2025-12-31",
    numeroTVA: "FR12345678901",
    numeroRepertoireMetiers: "RM-75001-2020",
    signatureTampon: "",
    
    // Certifications
    qualibat: true,
    dateDebutQualibat: "2022-01-01",
    dateFinQualibat: "2024-12-31",
    
    qualisol: true,
    dateDebutQualisol: "2022-03-15",
    dateFinQualisol: "2025-03-14",
    
    qualipac: true,
    dateDebutQualipac: "2021-11-20",
    dateFinQualipac: "2024-11-19",
    
    qualibois: false,
    dateDebutQualibois: "",
    dateFinQualibois: "",
    
    opqibi: false,
    dateDebutOpqibi: "",
    dateFinOpqibi: "",
    
    ventilation: true,
    dateDebutVentilation: "2023-01-01",
    dateFinVentilation: "2025-12-31",
    
    rgeEtude: false,
    dateDebutRGEEtude: "",
    dateFinRGEEtude: "",
    
    qualiPv: false,
    dateDebutQualiPv: "",
    dateFinQualiPv: "",
    
    numeroCNOA: "",
    dateDebutCNOA: "",
    dateFinCNOA: "",
  },
  {
    id: "ST002",
    raisonSociale: "Solaris Installation",
    typeSociete: "SAS",
    telephone: "02 34 56 78 90",
    telephoneMobile: "07 23 45 67 89",
    adresse: "45 avenue du Soleil, Parc d'activités Sud",
    codePostal: "69002",
    ville: "Lyon",
    active: true,
    sousTraitant: true,
    
    // New fields with sample data
    nomDirigeant: "Martin",
    prenomDirigeant: "Sophie",
    fonction: "Présidente",
    email: "contact@solaris-installation.fr",
    siret: "98765432109876",
    siren: "987654321",
    numeroDecennale: "DEC-2022-456",
    dateValiditeDecennale: "2024-10-15",
    numeroTVA: "FR98765432109",
    numeroRepertoireMetiers: "RM-69002-2019",
    signatureTampon: "",
    
    // Certifications
    qualibat: true,
    dateDebutQualibat: "2022-05-10",
    dateFinQualibat: "2025-05-09",
    
    qualisol: true,
    dateDebutQualisol: "2021-07-01",
    dateFinQualisol: "2024-06-30",
    
    qualipac: false,
    dateDebutQualipac: "",
    dateFinQualipac: "",
    
    qualibois: false,
    dateDebutQualibois: "",
    dateFinQualibois: "",
    
    opqibi: false,
    dateDebutOpqibi: "",
    dateFinOpqibi: "",
    
    ventilation: false,
    dateDebutVentilation: "",
    dateFinVentilation: "",
    
    rgeEtude: true,
    dateDebutRGEEtude: "2023-02-15",
    dateFinRGEEtude: "2026-02-14",
    
    qualiPv: true,
    dateDebutQualiPv: "2022-11-01",
    dateFinQualiPv: "2025-10-31",
    
    numeroCNOA: "CNOA-2022-789",
    dateDebutCNOA: "2022-11-01",
    dateFinCNOA: "2025-10-31",
  },
  {
    id: "ST003",
    raisonSociale: "Eco-Chauffagistes",
    typeSociete: "EURL",
    telephone: "03 45 67 89 01",
    telephoneMobile: "06 54 32 10 98",
    adresse: "8 impasse des Chaleurs, Zone Artisanale Est",
    codePostal: "33000",
    ville: "Bordeaux",
    active: false,
    sousTraitant: true,
    
    // New fields with sample data
    nomDirigeant: "Leroy",
    prenomDirigeant: "Marc",
    fonction: "Directeur",
    email: "contact@eco-chauffagistes.fr",
    siret: "45678901234567",
    siren: "456789012",
    numeroDecennale: "DEC-2021-123",
    dateValiditeDecennale: "2023-09-30",
    numeroTVA: "FR45678901234",
    numeroRepertoireMetiers: "RM-33000-2018",
    signatureTampon: "",
    
    // Certifications
    qualibat: false,
    dateDebutQualibat: "",
    dateFinQualibat: "",
    
    qualisol: false,
    dateDebutQualisol: "",
    dateFinQualisol: "",
    
    qualipac: false,
    dateDebutQualipac: "",
    dateFinQualipac: "",
    
    qualibois: true,
    dateDebutQualibois: "2021-04-01",
    dateFinQualibois: "2024-03-31",
    
    opqibi: false,
    dateDebutOpqibi: "",
    dateFinOpqibi: "",
    
    ventilation: false,
    dateDebutVentilation: "",
    dateFinVentilation: "",
    
    rgeEtude: false,
    dateDebutRGEEtude: "",
    dateFinRGEEtude: "",
    
    qualiPv: false,
    dateDebutQualiPv: "",
    dateFinQualiPv: "",
    
    numeroCNOA: "",
    dateDebutCNOA: "",
    dateFinCNOA: "",
  },
  {
    id: "ST004",
    raisonSociale: "All-Clima Services",
    typeSociete: "SASU",
    telephone: "04 56 78 90 12",
    telephoneMobile: "07 89 65 43 21",
    adresse: "27 boulevard des Techniques, Technoparc",
    codePostal: "31000",
    ville: "Toulouse",
    active: true,
    sousTraitant: true,
    
    // New fields with sample data
    nomDirigeant: "Bernard",
    prenomDirigeant: "Thomas",
    fonction: "PDG",
    email: "contact@all-clima.fr",
    siret: "78901234567890",
    siren: "789012345",
    numeroDecennale: "DEC-2022-567",
    dateValiditeDecennale: "2025-06-30",
    numeroTVA: "FR78901234567",
    numeroRepertoireMetiers: "RM-31000-2019",
    signatureTampon: "",
    
    // Certifications
    qualibat: true,
    dateDebutQualibat: "2021-09-01",
    dateFinQualibat: "2024-08-31",
    
    qualisol: false,
    dateDebutQualisol: "",
    dateFinQualisol: "",
    
    qualipac: true,
    dateDebutQualipac: "2022-03-15",
    dateFinQualipac: "2025-03-14",
    
    qualibois: false,
    dateDebutQualibois: "",
    dateFinQualibois: "",
    
    opqibi: true,
    dateDebutOpqibi: "2022-06-01",
    dateFinOpqibi: "2025-05-31",
    
    ventilation: true,
    dateDebutVentilation: "2022-07-15",
    dateFinVentilation: "2025-07-14",
    
    rgeEtude: false,
    dateDebutRGEEtude: "",
    dateFinRGEEtude: "",
    
    qualiPv: false,
    dateDebutQualiPv: "",
    dateFinQualiPv: "",
    
    numeroCNOA: "",
    dateDebutCNOA: "",
    dateFinCNOA: "",
  }
];

export default function SousTraitantPage() {
  // View mode state (list or form)
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // State for sous-traitants data
  const [sousTraitants, setSousTraitants] = useState<SousTraitant[]>(SAMPLE_SOUS_TRAITANTS);
  const [selectedSousTraitant, setSelectedSousTraitant] = useState<SousTraitant | null>(null);

  // State for sous-traitant form
  const [sousTraitantForm, setSousTraitantForm] = useState<SousTraitantForm>({
    id: "",
    raisonSociale: "",
    typeSociete: "",
    telephone: "",
    adresse: "",
    codePostal: "",
    ville: "",
    active: true,
    sousTraitant: true,
    
    // New fields initialization
    nomDirigeant: "",
    prenomDirigeant: "",
    fonction: "",
    email: "",
    telephoneMobile: "",
    siret: "",
    siren: "",
    numeroDecennale: "",
    dateValiditeDecennale: "",
    numeroTVA: "",
    numeroRepertoireMetiers: "",
    signatureTampon: "",
    
    // Certification fields initialization
    qualibat: false,
    dateDebutQualibat: "",
    dateFinQualibat: "",
    
    qualisol: false,
    dateDebutQualisol: "",
    dateFinQualisol: "",
    
    qualipac: false,
    dateDebutQualipac: "",
    dateFinQualipac: "",
    
    qualibois: false,
    dateDebutQualibois: "",
    dateFinQualibois: "",
    
    opqibi: false,
    dateDebutOpqibi: "",
    dateFinOpqibi: "",
    
    ventilation: false,
    dateDebutVentilation: "",
    dateFinVentilation: "",
    
    rgeEtude: false,
    dateDebutRGEEtude: "",
    dateFinRGEEtude: "",
    
    qualiPv: false,
    dateDebutQualiPv: "",
    dateFinQualiPv: "",
    
    numeroCNOA: "",
    dateDebutCNOA: "",
    dateFinCNOA: "",
  });

  // State for active form section (for accordion-like UI)
  const [activeSection, setActiveSection] = useState<"general" | "contact" | "administrative" | "certifications">("general");

  // Edit handler
  const handleEditSousTraitant = (sousTraitant: SousTraitant) => {
    setSelectedSousTraitant(sousTraitant);
    setSousTraitantForm({
      ...sousTraitant
    });
    setViewMode("form");
    setActiveSection("general"); // Reset to first section when editing
  };

  // Delete handler
  const handleDeleteSousTraitant = (id: string) => {
    setSousTraitants(sousTraitants.filter(sousTraitant => sousTraitant.id !== id));
  };

  // Add new sous-traitant handler
  const handleAddNewSousTraitant = () => {
    setSelectedSousTraitant(null);
    setSousTraitantForm({
      id: `ST${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      raisonSociale: "",
      typeSociete: "",
      telephone: "",
      adresse: "",
      codePostal: "",
      ville: "",
      active: true,
      sousTraitant: true,
      
      // New fields
      nomDirigeant: "",
      prenomDirigeant: "",
      fonction: "",
      email: "",
      telephoneMobile: "",
      siret: "",
      siren: "",
      numeroDecennale: "",
      dateValiditeDecennale: "",
      numeroTVA: "",
      numeroRepertoireMetiers: "",
      signatureTampon: "",
      
      // Certification defaults
      qualibat: false,
      dateDebutQualibat: "",
      dateFinQualibat: "",
      
      qualisol: false,
      dateDebutQualisol: "",
      dateFinQualisol: "",
      
      qualipac: false,
      dateDebutQualipac: "",
      dateFinQualipac: "",
      
      qualibois: false,
      dateDebutQualibois: "",
      dateFinQualibois: "",
      
      opqibi: false,
      dateDebutOpqibi: "",
      dateFinOpqibi: "",
      
      ventilation: false,
      dateDebutVentilation: "",
      dateFinVentilation: "",
      
      rgeEtude: false,
      dateDebutRGEEtude: "",
      dateFinRGEEtude: "",
      
      qualiPv: false,
      dateDebutQualiPv: "",
      dateFinQualiPv: "",
      
      numeroCNOA: "",
      dateDebutCNOA: "",
      dateFinCNOA: "",
    });
    setViewMode("form");
    setActiveSection("general"); // Start with first section for new sous-traitant
  };

  // Save handler
  const handleSaveSousTraitant = () => {
    const sousTraitantToSave: SousTraitant = {
      ...sousTraitantForm
    };

    if (selectedSousTraitant) {
      // Update existing sous-traitant
      setSousTraitants(sousTraitants.map(s => s.id === sousTraitantToSave.id ? sousTraitantToSave : s));
    } else {
      // Add new sous-traitant
      setSousTraitants([...sousTraitants, sousTraitantToSave]);
    }
    setViewMode("list");
  };

  // Handle form changes for text, select, etc.
  const handleSousTraitantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox specially
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSousTraitantForm({
        ...sousTraitantForm,
        [name]: checked
      });
    } else {
      setSousTraitantForm({
        ...sousTraitantForm,
        [name]: value
      });
    }
  };

  // Handle file upload for signature et tampon
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, you'd handle the file upload to server here
      // For now, we'll just store the file name
      setSousTraitantForm({
        ...sousTraitantForm,
        signatureTampon: e.target.files[0].name
      });
    }
  };

  // Return to list view
  const handleCancelForm = () => {
    setViewMode("list");
    setSelectedSousTraitant(null);
  };

  // Filtered sous-traitants based on search term
  const filteredSousTraitants = sousTraitants.filter(sousTraitant => 
    sousTraitant.raisonSociale.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sousTraitant.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sousTraitant.nomDirigeant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sousTraitant.prenomDirigeant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sousTraitant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render certification form component
  const renderCertificationField = (
    label: string,
    checkboxName: string,
    startDateName: string,
    endDateName: string,
    checkboxValue: boolean,
    startDateValue: string,
    endDateValue: string
  ) => {
    return (
      <div className="p-4 border border-[#e5e7eb] rounded-lg mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id={checkboxName}
              name={checkboxName}
              checked={checkboxValue}
              onChange={(e) => setSousTraitantForm({
                ...sousTraitantForm,
                [checkboxName]: e.target.checked
              })}
              className="h-4 w-4 text-[#213f5b] focus:ring-[#213f5b] border-gray-300 rounded"
            />
            <label htmlFor={checkboxName} className="ml-2 block text-sm font-medium text-[#213f5b]">
              {label}
            </label>
          </div>
        </div>
        
        {checkboxValue && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#213f5b]">Date de début</label>
              <input
                type="date"
                name={startDateName}
                value={startDateValue}
                onChange={handleSousTraitantChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b] text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#213f5b]">Date de fin</label>
              <input
                type="date"
                name={endDateName}
                value={endDateValue}
                onChange={handleSousTraitantChange}
                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b] text-sm"
              />
            </div>
          </div>
        )}
      </div>
    );
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
                  <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#213f5b] to-[#2c5681] mb-2 pl-2">Sous-traitants</h1>
                  <p className="text-[#213f5b] opacity-75 pl-2">Ajoutez et gérez vos sous-traitants</p>
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
                      onClick={handleAddNewSousTraitant}
                      className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Nouveau Sous-traitant
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
                    placeholder="Rechercher des sous-traitants..."
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
            <AnimatePresence mode="wait">
              {viewMode === "list" && (
                <motion.div
                  key="sous-traitant-list"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Sous-traitants List/Grid View */}
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

                  {filteredSousTraitants.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-[#213f5b]">
                      <BuildingStorefrontIcon className="h-16 w-16 mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">Aucun sous-traitant trouvé</h3>
                      <p className="text-sm opacity-75 mb-6">Ajoutez un nouveau sous-traitant ou modifiez vos critères de recherche</p>
                      <Button
                        onClick={handleAddNewSousTraitant}
                        className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Nouveau Sous-traitant
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredSousTraitants.map((sousTraitant) => (
                        <motion.div
                          key={sousTraitant.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-white rounded-xl border border-[#eaeaea] shadow-sm hover:shadow-md hover:border-[#bfddf9] transition-all group"
                          whileHover={{ y: -4 }}
                        >
                          <div className="p-5 border-b border-[#eaeaea] bg-gradient-to-r from-white to-[#f8fafc]">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-[#bfddf9] bg-opacity-50 rounded-lg group-hover:bg-opacity-100 transition-colors">
                                  <BuildingStorefrontIcon className="h-6 w-6 text-[#213f5b]" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-[#213f5b] line-clamp-1">{sousTraitant.raisonSociale}</h3>
                                  <p className="text-xs opacity-75">{sousTraitant.typeSociete}</p>
                                </div>
                              </div>
                              <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${sousTraitant.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {sousTraitant.active ? 'Actif' : 'Inactif'}
                              </span>
                            </div>
                            
                            {/* Show dirigeant info */}
                            <div className="mt-2 text-sm text-[#213f5b]">
                              <p>{sousTraitant.prenomDirigeant} {sousTraitant.nomDirigeant} - {sousTraitant.fonction}</p>
                            </div>
                          </div>
                          
                          <div className="p-5">
                            <div className="space-y-2 mb-4">
                              <div className="flex gap-2 items-center">
                                <PhoneIcon className="h-4 w-4 text-[#213f5b] opacity-60" />
                                <span className="text-sm font-medium text-[#213f5b]">{sousTraitant.telephoneMobile || sousTraitant.telephone}</span>
                              </div>
                              <div className="flex gap-2 items-center">
                                <EnvelopeIcon className="h-4 w-4 text-[#213f5b] opacity-60" />
                                <span className="text-sm font-medium text-[#213f5b]">{sousTraitant.email}</span>
                              </div>
                              <div className="flex gap-2 items-start">
                                <BuildingStorefrontIcon className="h-4 w-4 text-[#213f5b] opacity-60 mt-0.5" />
                                <span className="text-sm font-medium text-[#213f5b]">{sousTraitant.adresse}, {sousTraitant.codePostal} {sousTraitant.ville}</span>
                              </div>
                            </div>
                            
                            {/* Display certifications summary */}
                            <div className="mt-4 border-t pt-4 border-dashed border-gray-200">
                              <p className="text-xs font-medium text-[#213f5b] mb-2">Certifications:</p>
                              <div className="flex flex-wrap gap-1">
                                {sousTraitant.qualibat && (
                                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">Qualibat</span>
                                )}
                                {sousTraitant.qualisol && (
                                  <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded text-xs">Qualisol</span>
                                )}
                                {sousTraitant.qualipac && (
                                  <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">Qualipac</span>
                                )}
                                {sousTraitant.qualibois && (
                                  <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs">Qualibois</span>
                                )}
                                {sousTraitant.ventilation && (
                                  <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs">Ventilation</span>
                                )}
                                {/* More certifications can be displayed here */}
                              </div>
                            </div>
                            
                            <div className="flex justify-end gap-2 mt-4">
                              <button 
                                className="p-2 rounded-full text-[#213f5b] hover:bg-[#bfddf9] transition-colors"
                                onClick={() => handleEditSousTraitant(sousTraitant)}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button 
                                className="p-2 rounded-full text-[#213f5b] hover:bg-red-100 hover:text-red-500 transition-colors"
                                onClick={() => handleDeleteSousTraitant(sousTraitant.id)}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9]"
                                onClick={() => handleEditSousTraitant(sousTraitant)}
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
                  key="sousTraitant-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Section tabs */}
                  <div className="bg-white rounded-lg shadow-sm mb-6 p-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveSection("general")}
                      className={`py-2 px-4 rounded-md text-sm font-medium flex items-center gap-2 ${
                        activeSection === "general" 
                          ? "bg-[#213f5b] text-white" 
                          : "text-[#213f5b] hover:bg-[#f0f7ff]"
                      }`}
                    >
                      <BuildingStorefrontIcon className="h-5 w-5" />
                      <span>Informations générales</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveSection("contact")}
                      className={`py-2 px-4 rounded-md text-sm font-medium flex items-center gap-2 ${
                        activeSection === "contact" 
                          ? "bg-[#213f5b] text-white" 
                          : "text-[#213f5b] hover:bg-[#f0f7ff]"
                      }`}
                    >
                      <UserIcon className="h-5 w-5" />
                      <span>Contact & Dirigeant</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveSection("administrative")}
                      className={`py-2 px-4 rounded-md text-sm font-medium flex items-center gap-2 ${
                        activeSection === "administrative" 
                          ? "bg-[#213f5b] text-white" 
                          : "text-[#213f5b] hover:bg-[#f0f7ff]"
                      }`}
                    >
                      <DocumentCheckIcon className="h-5 w-5" />
                      <span>Informations administratives</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveSection("certifications")}
                      className={`py-2 px-4 rounded-md text-sm font-medium flex items-center gap-2 ${
                        activeSection === "certifications" 
                          ? "bg-[#213f5b] text-white" 
                          : "text-[#213f5b] hover:bg-[#f0f7ff]"
                      }`}
                    >
                      <DocumentCheckIcon className="h-5 w-5" />
                      <span>Certifications</span>
                    </button>
                  </div>
                  
                  {/* General information section */}
                  {activeSection === "general" && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                      <div className="bg-gradient-to-r from-white to-[#f8fafc] border-b p-6">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-1 rounded-full bg-[#213f5b]"></div>
                          <h2 className="text-xl font-bold text-[#213f5b]">Informations générales</h2>
                        </div>
                        <p className="text-[#213f5b] opacity-75 ml-3 pl-3">Informations de base du sous-traitant</p>
                      </div>
                      
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2 md:col-span-2">
                            <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="raisonSociale">Raison sociale *</label>
                            <input
                              id="raisonSociale"
                              type="text"
                              name="raisonSociale"
                              value={sousTraitantForm.raisonSociale}
                              onChange={handleSousTraitantChange}
                              className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="typeSociete">Type de société (SAS, SASU, SARL...)</label>
                            <input
                              id="typeSociete"
                              type="text"
                              name="typeSociete"
                              value={sousTraitantForm.typeSociete}
                              onChange={handleSousTraitantChange}
                              className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="telephone">Téléphone (fixe)</label>
                            <input
                              id="telephone"
                              type="text"
                              name="telephone"
                              value={sousTraitantForm.telephone}
                              onChange={handleSousTraitantChange}
                              className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="adresse">Adresse *</label>
                            <textarea
                              id="adresse"
                              name="adresse"
                              value={sousTraitantForm.adresse}
                              onChange={handleSousTraitantChange}
                              rows={2}
                              className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="codePostal">Code Postal *</label>
                            <input
                              id="codePostal"
                              type="text"
                              name="codePostal"
                              value={sousTraitantForm.codePostal}
                              onChange={handleSousTraitantChange}
                              className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="ville">Ville *</label>
                            <input
                              id="ville"
                              type="text"
                              name="ville"
                              value={sousTraitantForm.ville}
                              onChange={handleSousTraitantChange}
                              className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                            />
                          </div>
                          
                          <div className="md:col-span-2 flex flex-wrap gap-6">
                            <div className="flex items-center space-x-2">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer"
                                  checked={sousTraitantForm.active}
                                  onChange={() => setSousTraitantForm({...sousTraitantForm, active: !sousTraitantForm.active})}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-[#213f5b] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#213f5b]"></div>
                                <span className="ml-3 text-sm font-medium text-[#213f5b]">Activé</span>
                              </label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer"
                                  checked={sousTraitantForm.sousTraitant}
                                  onChange={() => setSousTraitantForm({...sousTraitantForm, sousTraitant: !sousTraitantForm.sousTraitant})}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-[#213f5b] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#213f5b]"></div>
                                <span className="ml-3 text-sm font-medium text-[#213f5b]">Sous-traitant</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Contact & Dirigeant section */}
                  {activeSection === "contact" && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                      <div className="bg-gradient-to-r from-white to-[#f8fafc] border-b p-6">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-1 rounded-full bg-[#213f5b]"></div>
                          <h2 className="text-xl font-bold text-[#213f5b]">Contact & Dirigeant</h2>
                        </div>
                        <p className="text-[#213f5b] opacity-75 ml-3 pl-3">Informations de contact et du dirigeant</p>
                      </div>
                      
                      <div className="p-6">
                        <div className="mb-6">
                          <h3 className="text-lg font-medium text-[#213f5b] mb-4">Dirigeant</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="nomDirigeant">Nom du dirigeant *</label>
                              <input
                                id="nomDirigeant"
                                type="text"
                                name="nomDirigeant"
                                value={sousTraitantForm.nomDirigeant}
                                onChange={handleSousTraitantChange}
                                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="prenomDirigeant">Prénom du dirigeant *</label>
                              <input
                                id="prenomDirigeant"
                                type="text"
                                name="prenomDirigeant"
                                value={sousTraitantForm.prenomDirigeant}
                                onChange={handleSousTraitantChange}
                                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="fonction">Fonction *</label>
                              <input
                                id="fonction"
                                type="text"
                                name="fonction"
                                value={sousTraitantForm.fonction}
                                onChange={handleSousTraitantChange}
                                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium text-[#213f5b] mb-4">Contact</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="email">Email *</label>
                              <input
                                id="email"
                                type="email"
                                name="email"
                                value={sousTraitantForm.email}
                                onChange={handleSousTraitantChange}
                                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="telephoneMobile">Téléphone mobile *</label>
                              <input
                                id="telephoneMobile"
                                type="text"
                                name="telephoneMobile"
                                value={sousTraitantForm.telephoneMobile}
                                onChange={handleSousTraitantChange}
                                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Administrative information section */}
                  {activeSection === "administrative" && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                      <div className="bg-gradient-to-r from-white to-[#f8fafc] border-b p-6">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-1 rounded-full bg-[#213f5b]"></div>
                          <h2 className="text-xl font-bold text-[#213f5b]">Informations administratives</h2>
                        </div>
                        <p className="text-[#213f5b] opacity-75 ml-3 pl-3">Détails administratifs du sous-traitant</p>
                      </div>
                      
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="siret">SIRET *</label>
                            <input
                              id="siret"
                              type="text"
                              name="siret"
                              value={sousTraitantForm.siret}
                              onChange={handleSousTraitantChange}
                              className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="siren">SIREN *</label>
                            <input
                              id="siren"
                              type="text"
                              name="siren"
                              value={sousTraitantForm.siren}
                              onChange={handleSousTraitantChange}
                              className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="numeroDecennale">N° Décennale</label>
                            <input
                              id="numeroDecennale"
                              type="text"
                              name="numeroDecennale"
                              value={sousTraitantForm.numeroDecennale}
                              onChange={handleSousTraitantChange}
                              className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="dateValiditeDecennale">Date de validité décennale</label>
                            <input
                              id="dateValiditeDecennale"
                              type="date"
                              name="dateValiditeDecennale"
                              value={sousTraitantForm.dateValiditeDecennale}
                              onChange={handleSousTraitantChange}
                              className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="numeroTVA">Numéro TVA intra communautaire</label>
                            <input
                              id="numeroTVA"
                              type="text"
                              name="numeroTVA"
                              value={sousTraitantForm.numeroTVA}
                              onChange={handleSousTraitantChange}
                              className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="numeroRepertoireMetiers">Numéro d&apos;enregistrement répertoire des métiers</label>
                            <input
                              id="numeroRepertoireMetiers"
                              type="text"
                              name="numeroRepertoireMetiers"
                              value={sousTraitantForm.numeroRepertoireMetiers}
                              onChange={handleSousTraitantChange}
                              className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="signatureTampon">Signature et tampon</label>
                            <div className="flex items-center">
                              <input
                                id="signatureTampon"
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                              <label htmlFor="signatureTampon" className="cursor-pointer flex items-center justify-center px-4 py-2 bg-[#f0f7ff] text-[#213f5b] rounded-lg border border-[#bfddf9] hover:bg-[#bfddf9] transition-colors">
                                <span className="text-sm">Choisir le fichier</span>
                              </label>
                              {sousTraitantForm.signatureTampon && (
                                <span className="ml-3 text-sm text-[#213f5b]">
                                  {sousTraitantForm.signatureTampon}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="numeroCNOA">Numéro de certification CNOA</label>
                            <input
                              id="numeroCNOA"
                              type="text"
                              name="numeroCNOA"
                              value={sousTraitantForm.numeroCNOA}
                              onChange={handleSousTraitantChange}
                              className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="dateDebutCNOA">Date de début CNOA</label>
                              <input
                                id="dateDebutCNOA"
                                type="date"
                                name="dateDebutCNOA"
                                value={sousTraitantForm.dateDebutCNOA}
                                onChange={handleSousTraitantChange}
                                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="dateFinCNOA">Date de fin CNOA</label>
                              <input
                                id="dateFinCNOA"
                                type="date"
                                name="dateFinCNOA"
                                value={sousTraitantForm.dateFinCNOA}
                                onChange={handleSousTraitantChange}
                                className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Certifications section */}
                  {activeSection === "certifications" && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                      <div className="bg-gradient-to-r from-white to-[#f8fafc] border-b p-6">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-1 rounded-full bg-[#213f5b]"></div>
                          <h2 className="text-xl font-bold text-[#213f5b]">Certifications</h2>
                        </div>
                        <p className="text-[#213f5b] opacity-75 ml-3 pl-3">Certifications et qualifications du sous-traitant</p>
                      </div>
                      
                      <div className="p-6">
                        <div className="grid grid-cols-1 gap-4">
                          {/* Qualibat certification */}
                          {renderCertificationField(
                            "Qualibat",
                            "qualibat",
                            "dateDebutQualibat",
                            "dateFinQualibat",
                            sousTraitantForm.qualibat,
                            sousTraitantForm.dateDebutQualibat,
                            sousTraitantForm.dateFinQualibat
                          )}
                          
                          {/* Qualisol certification */}
                          {renderCertificationField(
                            "Qualisol",
                            "qualisol",
                            "dateDebutQualisol",
                            "dateFinQualisol",
                            sousTraitantForm.qualisol,
                            sousTraitantForm.dateDebutQualisol,
                            sousTraitantForm.dateFinQualisol
                          )}
                          
                          {/* Qualipac certification */}
                          {renderCertificationField(
                            "Qualipac",
                            "qualipac",
                            "dateDebutQualipac",
                            "dateFinQualipac",
                            sousTraitantForm.qualipac,
                            sousTraitantForm.dateDebutQualipac,
                            sousTraitantForm.dateFinQualipac
                          )}
                          
                          {/* Qualibois certification */}
                          {renderCertificationField(
                            "Qualibois",
                            "qualibois",
                            "dateDebutQualibois",
                            "dateFinQualibois",
                            sousTraitantForm.qualibois,
                            sousTraitantForm.dateDebutQualibois,
                            sousTraitantForm.dateFinQualibois
                          )}
                          
                          {/* OPQIBI certification */}
                          {renderCertificationField(
                            "OPQIBI",
                            "opqibi",
                            "dateDebutOpqibi",
                            "dateFinOpqibi",
                            sousTraitantForm.opqibi,
                            sousTraitantForm.dateDebutOpqibi,
                            sousTraitantForm.dateFinOpqibi
                          )}
                          
                          {/* Ventilation certification */}
                          {renderCertificationField(
                            "Ventilation",
                            "ventilation",
                            "dateDebutVentilation",
                            "dateFinVentilation",
                            sousTraitantForm.ventilation,
                            sousTraitantForm.dateDebutVentilation,
                            sousTraitantForm.dateFinVentilation
                          )}
                          
                          {/* RGE Etude certification */}
                          {renderCertificationField(
                            "RGE Etude",
                            "rgeEtude",
                            "dateDebutRGEEtude",
                            "dateFinRGEEtude",
                            sousTraitantForm.rgeEtude,
                            sousTraitantForm.dateDebutRGEEtude,
                            sousTraitantForm.dateFinRGEEtude
                          )}
                          
                          {/* QualiPv certification */}
                          {renderCertificationField(
                            "QualiPv",
                            "qualiPv",
                            "dateDebutQualiPv",
                            "dateFinQualiPv",
                            sousTraitantForm.qualiPv,
                            sousTraitantForm.dateDebutQualiPv,
                            sousTraitantForm.dateFinQualiPv
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 mb-6">
                    <Button
                      variant="outline"
                      className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9]"
                      onClick={handleCancelForm}
                    >
                      Annuler
                    </Button>
                    <Button
                      className="bg-[#213f5b] hover:bg-[#152a3d] text-white"
                      onClick={handleSaveSousTraitant}
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
