"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import {
  DocumentArrowDownIcon,
  PlusIcon,
  XMarkIcon,
  UserIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ListBulletIcon,
  TableCellsIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";

// Interface for Mandataire MPR entity
interface MandataireMPR {
  id: string;
  raisonSociale: string;
  adresse: string;
  email: string;
  civilite: string;
  codePostal: string;
  signatureFile: File | null;
  signatureFileName: string;
  nom: string;
  ville: string;
  numeroMandat: string;
  prenom: string;
  telephone: string;
  typeMandat: string;
  active: boolean;
}

// Interface for the form state
interface MandataireMPRForm {
  id: string;
  raisonSociale: string;
  adresse: string;
  email: string;
  civilite: string;
  codePostal: string;
  signatureFile: File | null;
  signatureFileName: string;
  nom: string;
  ville: string;
  numeroMandat: string;
  prenom: string;
  telephone: string;
  typeMandat: string;
  active: boolean;
}

// Sample data for mandataires
const SAMPLE_MANDATAIRES: MandataireMPR[] = [
  {
    id: "M001",
    raisonSociale: "Éco Énergie Conseil",
    adresse: "45 rue de la République",
    email: "contact@eec.fr",
    civilite: "M.",
    codePostal: "75001",
    signatureFile: null,
    signatureFileName: "signature_eec.png",
    nom: "Dupont",
    ville: "Paris",
    numeroMandat: "EEC-2023-001",
    prenom: "Jean",
    telephone: "01 23 45 67 89",
    typeMandat: "Administratif et Financier",
    active: true
  },
  {
    id: "M002",
    raisonSociale: "Solutions Thermiques Pro",
    adresse: "12 avenue des Champs",
    email: "info@stp.fr",
    civilite: "Mme",
    codePostal: "69002",
    signatureFile: null,
    signatureFileName: "signature_stp.png",
    nom: "Martin",
    ville: "Lyon",
    numeroMandat: "STP-2023-042",
    prenom: "Sophie",
    telephone: "04 78 12 34 56",
    typeMandat: "Financier",
    active: true
  },
  {
    id: "M003",
    raisonSociale: "ExpertClimat Services",
    adresse: "8 boulevard Gambetta",
    email: "contact@expertclimat.fr",
    civilite: "M.",
    codePostal: "33000",
    signatureFile: null,
    signatureFileName: "signature_ecs.png",
    nom: "Dubois",
    ville: "Bordeaux",
    numeroMandat: "ECS-2023-078",
    prenom: "Pierre",
    telephone: "05 56 78 90 12",
    typeMandat: "Administratif",
    active: false
  }
];

export default function MandataireMPRPage() {
  // View mode state (list or form)
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // State for mandataires data
  const [mandataires, setMandataires] = useState<MandataireMPR[]>(SAMPLE_MANDATAIRES);
  const [selectedMandataire, setSelectedMandataire] = useState<MandataireMPR | null>(null);

  // State for form
  const [mandataireForm, setMandataireForm] = useState<MandataireMPRForm>({
    id: "",
    raisonSociale: "",
    adresse: "",
    email: "",
    civilite: "",
    codePostal: "",
    signatureFile: null,
    signatureFileName: "",
    nom: "",
    ville: "",
    numeroMandat: "",
    prenom: "",
    telephone: "",
    typeMandat: "",
    active: true
  });

  // Edit handler
  const handleEditMandataire = (mandataire: MandataireMPR) => {
    setSelectedMandataire(mandataire);
    setMandataireForm({
      ...mandataire
    });
    setViewMode("form");
  };

  // Delete handler
  const handleDeleteMandataire = (id: string) => {
    setMandataires(mandataires.filter(mandataire => mandataire.id !== id));
  };

  // Add new mandataire handler
  const handleAddNewMandataire = () => {
    setSelectedMandataire(null);
    setMandataireForm({
      id: `M${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      raisonSociale: "",
      adresse: "",
      email: "",
      civilite: "",
      codePostal: "",
      signatureFile: null,
      signatureFileName: "",
      nom: "",
      ville: "",
      numeroMandat: "",
      prenom: "",
      telephone: "",
      typeMandat: "",
      active: true
    });
    setViewMode("form");
  };

  // Save handler
  const handleSaveMandataire = () => {
    const mandataireToSave: MandataireMPR = {
      ...mandataireForm
    };

    if (selectedMandataire) {
      // Update existing mandataire
      setMandataires(mandataires.map(m => m.id === mandataireToSave.id ? mandataireToSave : m));
    } else {
      // Add new mandataire
      setMandataires([...mandataires, mandataireToSave]);
    }
    setViewMode("list");
  };

  // Handle form changes
  const handleMandataireChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMandataireForm({
      ...mandataireForm,
      [name]: value
    });
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMandataireForm({
        ...mandataireForm,
        signatureFile: file,
        signatureFileName: file.name
      });
    }
  };

  // Return to list view
  const handleCancelForm = () => {
    setViewMode("list");
    setSelectedMandataire(null);
  };

  // Filtered mandataires based on search term
  const filteredMandataires = mandataires.filter(mandataire => 
    mandataire.raisonSociale.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mandataire.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mandataire.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mandataire.ville.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#213f5b] to-[#2c5681] mb-2 pl-2">Mandataires MPR</h1>
                  <p className="text-[#213f5b] opacity-75 pl-2">Ajoutez et gérez vos mandataires pour Ma Prime Rénov</p>
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
                      Exporter
                    </Button>
                    <Button
                      onClick={handleAddNewMandataire}
                      className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Nouveau Mandataire
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
                    placeholder="Rechercher des mandataires..."
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
                key="mandataire-list"
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

                {filteredMandataires.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-[#213f5b]">
                    <UserIcon className="h-16 w-16 mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">Aucun mandataire trouvé</h3>
                    <p className="text-sm opacity-75 mb-6">Ajoutez un nouveau mandataire ou modifiez vos critères de recherche</p>
                    <Button
                      onClick={handleAddNewMandataire}
                      className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Nouveau Mandataire
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMandataires.map((mandataire) => (
                      <motion.div
                        key={mandataire.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-xl border border-[#eaeaea] shadow-sm hover:shadow-md hover:border-[#bfddf9] transition-all group"
                        whileHover={{ y: -4 }}
                      >
                        <div className="p-5 border-b border-[#eaeaea] bg-gradient-to-r from-white to-[#f8fafc]">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-[#bfddf9] bg-opacity-50 rounded-lg group-hover:bg-opacity-100 transition-colors">
                                <UserIcon className="h-6 w-6 text-[#213f5b]" />
                              </div>
                              <div>
                                <h3 className="font-bold text-[#213f5b] line-clamp-1">{mandataire.raisonSociale}</h3>
                                <p className="text-xs opacity-75">{mandataire.civilite} {mandataire.prenom} {mandataire.nom}</p>
                              </div>
                            </div>
                            <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${mandataire.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {mandataire.active ? 'Actif' : 'Inactif'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-5">
                          <div className="space-y-2 mb-4">
                            <div className="flex gap-2">
                              <span className="text-xs text-[#213f5b] opacity-75">N° de matricule:</span>
                              <span className="text-sm font-medium text-[#213f5b]">{mandataire.numeroMandat}</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-xs text-[#213f5b] opacity-75">Téléphone:</span>
                              <span className="text-sm font-medium text-[#213f5b]">{mandataire.telephone}</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-xs text-[#213f5b] opacity-75">Email:</span>
                              <span className="text-sm font-medium text-[#213f5b]">{mandataire.email}</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-xs text-[#213f5b] opacity-75">Type de mandat:</span>
                              <span className="text-sm font-medium text-[#213f5b]">{mandataire.typeMandat}</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-xs text-[#213f5b] opacity-75">Adresse:</span>
                              <span className="text-sm font-medium text-[#213f5b]">{mandataire.adresse}, {mandataire.codePostal} {mandataire.ville}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-4">
                            <button 
                              className="p-2 rounded-full text-[#213f5b] hover:bg-[#bfddf9] transition-colors"
                              onClick={() => handleEditMandataire(mandataire)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-2 rounded-full text-[#213f5b] hover:bg-red-100 hover:text-red-500 transition-colors"
                              onClick={() => handleDeleteMandataire(mandataire.id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9]"
                              onClick={() => handleEditMandataire(mandataire)}
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
                key="mandataire-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-white to-[#f8fafc] border-b p-6">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-1 rounded-full bg-[#213f5b]"></div>
                      <h2 className="text-xl font-bold text-[#213f5b]">{selectedMandataire ? 'Modifier le mandataire' : 'Ajouter un mandataire'}</h2>
                    </div>
                    <p className="text-[#213f5b] opacity-75 ml-3 pl-3">Informations du mandataire MPR</p>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Raison sociale */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="raisonSociale">
                          Raison sociale <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="raisonSociale"
                          type="text"
                          name="raisonSociale"
                          required
                          value={mandataireForm.raisonSociale}
                          onChange={handleMandataireChange}
                          className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                        />
                      </div>

                      {/* Civilité */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="civilite">
                          Civilité
                        </label>
                        <select
                          id="civilite"
                          name="civilite"
                          value={mandataireForm.civilite}
                          onChange={handleMandataireChange}
                          className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                        >
                          <option value="">Sélectionner</option>
                          <option value="M.">Monsieur</option>
                          <option value="Mme">Madame</option>
                        </select>
                      </div>

                      {/* Nom */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="nom">
                          Nom
                        </label>
                        <input
                          id="nom"
                          type="text"
                          name="nom"
                          value={mandataireForm.nom}
                          onChange={handleMandataireChange}
                          className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                        />
                      </div>

                      {/* Prénom */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="prenom">
                          Prénom
                        </label>
                        <input
                          id="prenom"
                          type="text"
                          name="prenom"
                          value={mandataireForm.prenom}
                          onChange={handleMandataireChange}
                          className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                        />
                      </div>

                      {/* N° de matricule */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="numeroMandat">
                          N° de matricule
                        </label>
                        <input
                          id="numeroMandat"
                          type="text"
                          name="numeroMandat"
                          value={mandataireForm.numeroMandat}
                          onChange={handleMandataireChange}
                          className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                        />
                      </div>

                      {/* Type de Mandat */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="typeMandat">
                          Mandat <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="typeMandat"
                          name="typeMandat"
                          required
                          value={mandataireForm.typeMandat}
                          onChange={handleMandataireChange}
                          className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                        >
                          <option value="">Sélectionner</option>
                          <option value="Administratif">Administratif</option>
                          <option value="Financier">Financier</option>
                          <option value="Administratif et Financier">Administratif et Financier</option>
                        </select>
                      </div>

                      {/* Adresse */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="adresse">
                          Adresse
                        </label>
                        <input
                          id="adresse"
                          type="text"
                          name="adresse"
                          value={mandataireForm.adresse}
                          onChange={handleMandataireChange}
                          className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                        />
                      </div>

                      {/* Code Postal */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="codePostal">
                          Code Postal
                        </label>
                        <input
                          id="codePostal"
                          type="text"
                          name="codePostal"
                          value={mandataireForm.codePostal}
                          onChange={handleMandataireChange}
                          className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                        />
                      </div>

                      {/* Ville */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="ville">
                          Ville
                        </label>
                        <input
                          id="ville"
                          type="text"
                          name="ville"
                          value={mandataireForm.ville}
                          onChange={handleMandataireChange}
                          className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="email">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={mandataireForm.email}
                          onChange={handleMandataireChange}
                          className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                        />
                      </div>

                      {/* Téléphone */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="telephone">
                          Téléphone
                        </label>
                        <input
                          id="telephone"
                          type="tel"
                          name="telephone"
                          value={mandataireForm.telephone}
                          onChange={handleMandataireChange}
                          className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                        />
                      </div>

                      {/* Signature et tampon */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-medium text-[#213f5b] mb-1" htmlFor="signatureFile">
                          Signature et tampon
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 px-4 py-2 bg-white border border-[#bfddf9] rounded-lg cursor-pointer hover:bg-[#f0f7ff] transition-colors">
                            <DocumentIcon className="h-5 w-5 text-[#213f5b]" />
                            <span className="text-sm text-[#213f5b]">Choisir le fichier</span>
                            <input
                              id="signatureFile"
                              type="file"
                              accept="image/png,image/jpeg,application/pdf"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                          {mandataireForm.signatureFileName && (
                            <span className="text-sm text-[#213f5b]">{mandataireForm.signatureFileName}</span>
                          )}
                        </div>
                      </div>

                      {/* Active status */}
                      <div className="flex items-center space-x-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={mandataireForm.active}
                            onChange={() => setMandataireForm({...mandataireForm, active: !mandataireForm.active})}
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
                      onClick={handleSaveMandataire}
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
