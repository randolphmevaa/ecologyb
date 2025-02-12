"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardDocumentCheckIcon,
  HomeIcon,
  BriefcaseIcon,
  ClockIcon,
  BuildingOffice2Icon,
  LightBulbIcon,
  SunIcon,
  FireIcon,
  PaintBrushIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

// ------------------------------------------------------
// Type Definitions (adjust as needed)
// ------------------------------------------------------

export interface Dossier {
  client: string;
  projet: string;
  solution: string;
  etape: string;
  valeur: string;
  assignedTeam?: string;
  notes?: string;
  informationLogement?: {
    typeDeLogement: string;
    surfaceHabitable: string;
    anneeConstruction: string;
    systemeChauffage: string;
    profil?: string; // Added to fix error
    nombrePersonnes?: string; // Added if needed
  };
  informationTravaux?: {
    typeTravaux: string;
    typeUtilisation: string;
    surfaceChauffee: string;
    circuitChauffageFonctionnel: string;
  };
  _id: string;
  contactId?: string;
}

export interface DossierFormData {
  client: string;
  projet: string;
  solution: string;
  etape: string;
  valeur: string;
  assignedTeam: string;
  notes: string;
  informationLogement?: {
    typeDeLogement: string;
    surfaceHabitable: string;
    anneeConstruction: string;
    systemeChauffage: string;
    profil?: string; // Added to fix error
    nombrePersonnes?: string; // Added if needed
  };
  informationTravaux?: {
    typeTravaux: string;
    typeUtilisation: string;
    surfaceChauffee: string;
    circuitChauffageFonctionnel: string;
  };
}

// New interface for contact data
export interface Contact {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  organizationPhone?: string;    // Added to fix error
  organizationAddress?: string;  // Added to fix error
  role?: string;
  titre?: string;
  tags?: string[];
  suivi?: boolean;
  dateNextActivity?: string;
  heatingType?: string;
  rfr?: string;
  prefix?: string;
  emailOptedOut?: boolean;
  homePhone?: string;
  mobilePhone?: string;
  otherPhone?: string;
  assistantPhone?: string;
  assistantName?: string;
  fax?: string;
  linkedIn?: string;
  facebook?: string;
  twitter?: string;
  mailingAddress?: string;
  otherAddress?: string;
  dateToRemember?: string;
  dateOfBirth?: string;
  description?: string;
  department?: string;
  climateZone?: string;
  imageUrl?: string;
}

// Define a type for weather data to fix errors with weather.icon etc.
interface WeatherData {
  icon: string;
  condition: string;
  temp: number;
}

interface InfoTabProps {
  dossier: Dossier;
  formData: DossierFormData;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  // Updated the type of event to include HTMLSelectElement
  handleNestedInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    section: "informationLogement" | "informationTravaux"
  ) => void;
  userList: { email: string; role: string }[];
  handleSave: () => void;
  handleCancel: () => void;
  contact?: Contact; // Marked as optional
}

// ------------------------------------------------------
// Component
// ------------------------------------------------------
const InfoTab: React.FC<InfoTabProps> = ({
  dossier,
  formData,
  handleInputChange,
  handleNestedInputChange,
  userList,
  // handleSave,
  // handleCancel,
  contact,
}) => {
  const [saveStatus] = useState("Sauvegardé");
  // Set the weather state with the proper type
  const [weather ] = useState<WeatherData | null>(null);
  const [weatherLoading] = useState(false);
  const [weatherError] = useState<string | null>(null);

  // Helper function to determine MaPrimeRenov badge color based on RFR
  const getMaPrimeRenovColor = (rfr: string | undefined) => {
    const value = parseInt(rfr || "0", 10);
    if (isNaN(value)) return "bg-gray-500";
    if (value < 50000) return "bg-green-500";
    else if (value < 100000) return "bg-yellow-500";
    else return "bg-red-500";
  };

  return (
    <div className="flex gap-8">
      {/* Left Column: Main Sections */}
      <div className="flex-1 space-y-10">
        {/* --- Détails Généraux --- */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="relative bg-white rounded-2xl p-10 border border-blue-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
            <div className="flex items-center">
              <div className="flex items-center justify-center bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-full w-20 h-20 mr-6 shadow-lg">
                <ClipboardDocumentCheckIcon className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-800">
                Détails Généraux
              </h2>
            </div>
            {contact?.imageUrl && (
              <img
                src={contact.imageUrl}
                alt={contact?.name || "Profile"}
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-600 shadow-lg"
              />
            )}
          </div>
  
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Client
              </label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                placeholder="Nom du client"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
              />
  
              <label className="block text-sm font-medium text-gray-600 mt-6 mb-2">
                Projet
              </label>
              <input
                type="text"
                name="projet"
                value={formData.projet}
                onChange={handleInputChange}
                placeholder="Nom du projet"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
              />
  
              <label className="block text-sm font-medium text-gray-600 mt-6 mb-2">
                Solution proposée
              </label>
              <select
                name="solution"
                value={formData.solution}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
              >
                <option value="">Sélectionnez une solution</option>
                <option value="Pompes a chaleur">Pompes à chaleur</option>
                <option value="Chauffe-eau solaire individuel">
                  Chauffe-eau solaire individuel
                </option>
                <option value="Chauffe-eau thermodynamique">
                  Chauffe-eau thermodynamique
                </option>
                <option value="Système Solaire Combiné">
                  Système Solaire Combiné
                </option>
              </select>
            </div>
  
            {/* Right Column */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Phase du projet
              </label>
              <select
                name="etape"
                value={formData.etape}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
              >
                <option value="1Prise de contact">1 – Prise de contact</option>
                <option value="2En attente des documents">
                  2 – En attente des documents
                </option>
                <option value="3Instruction du dossier">
                  3 – Instruction du dossier
                </option>
                <option value="4Dossier Accepter">4 – Dossier accepté</option>
                <option value="5Installation">5 – Installation</option>
                <option value="6Controle">6 – Contrôle</option>
                <option value="7Dossier cloturer">
                  7 – Dossier clôturé
                </option>
              </select>
  
              <label className="block text-sm font-medium text-gray-600 mt-6 mb-2">
                Budget (en €)
              </label>
              <input
                type="number"
                name="valeur"
                value={formData.valeur}
                onChange={handleInputChange}
                placeholder="Ex: 15000"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
              />
  
              <label className="block text-sm font-medium text-gray-600 mt-6 mb-2">
                Équipe assignée
              </label>
              <select
                name="assignedTeam"
                value={formData.assignedTeam}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
              >
                <option value="">Sélectionnez une équipe</option>
                {userList.map((user) => (
                  <option key={user.email} value={user.email}>
                    {user.email} ({user.role})
                  </option>
                ))}
              </select>
            </div>
          </div>
  
          {/* Comments */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Commentaires
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Vos remarques..."
              rows={4}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            />
          </div>
  
          {/* Dropdown Sections */}
          <div className="mt-12 space-y-8">
            {/* Nom et Occupation */}
            <motion.details
              whileHover={{ scale: 1.01 }}
              className="group bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200 shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              <summary className="flex items-center justify-between font-semibold text-blue-800 cursor-pointer list-none">
                <span>Nom et Occupation</span>
                <ChevronDownIcon className="w-6 h-6 text-blue-500 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600">Nom</label>
                  <input
                    type="text"
                    value={contact?.name || ""}
                    readOnly
                    className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Titre</label>
                  <input
                    type="text"
                    value={contact?.titre || ""}
                    readOnly
                    className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white"
                  />
                </div>
              </div>
            </motion.details>
  
            {/* Coordonnées */}
            <motion.details
              whileHover={{ scale: 1.01 }}
              className="group bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200 shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              <summary className="flex items-center justify-between font-semibold text-blue-800 cursor-pointer list-none">
                <span>Coordonnées</span>
                <ChevronDownIcon className="w-6 h-6 text-blue-500 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600">Email</label>
                  <input
                    type="text"
                    value={contact?.email || ""}
                    readOnly
                    className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="block text-sm text-gray-600">
                    Email désinscrit
                  </label>
                  <input
                    type="checkbox"
                    checked={contact?.emailOptedOut || false}
                    readOnly
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={contact?.phone || ""}
                    readOnly
                    className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">
                    Téléphone domicile
                  </label>
                  <input
                    type="text"
                    value={contact?.homePhone || ""}
                    readOnly
                    className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Mobile</label>
                  <input
                    type="text"
                    value={contact?.mobilePhone || ""}
                    readOnly
                    className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">
                    Autre téléphone
                  </label>
                  <input
                    type="text"
                    value={contact?.otherPhone || ""}
                    readOnly
                    className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">
                    Téléphone assistant
                  </label>
                  <input
                    type="text"
                    value={contact?.assistantPhone || ""}
                    readOnly
                    className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white"
                  />
                </div>
              </div>
            </motion.details>
  
            {/* Localisation */}
            <motion.details
              whileHover={{ scale: 1.01 }}
              className="group bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200 shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              <summary className="flex items-center justify-between font-semibold text-blue-800 cursor-pointer list-none">
                <span>Localisation</span>
                <ChevronDownIcon className="w-6 h-6 text-blue-500 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600">
                    Département
                  </label>
                  <input
                    type="text"
                    value={contact?.department || ""}
                    readOnly
                    className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">
                    Adresse mailing
                  </label>
                  <input
                    type="text"
                    value={contact?.mailingAddress || ""}
                    readOnly
                    className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-gray-600">
                    Autre adresse
                  </label>
                  <input
                    type="text"
                    value={contact?.otherAddress || ""}
                    readOnly
                    className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white"
                  />
                </div>
              </div>
            </motion.details>
  
            {/* Informations Énergétiques */}
            <motion.details
              whileHover={{ scale: 1.01 }}
              className="group bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200 shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              <summary className="flex items-center justify-between font-semibold text-blue-800 cursor-pointer list-none">
                <span>Informations Énergétiques</span>
                <ChevronDownIcon className="w-6 h-6 text-blue-500 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600">RFR</label>
                  <input
                    type="text"
                    value={contact?.rfr || ""}
                    readOnly
                    className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">
                    MaPrimeRenov
                  </label>
                  <span
                    className={`w-full inline-block px-3 py-2 rounded-md text-white ${getMaPrimeRenovColor(
                      contact?.rfr
                    )}`}
                  >
                    {contact?.rfr ? "Eligible" : "Non éligible"}
                  </span>
                </div>
                <div>
                  <label className="block text-sm text-gray-600">
                    Zone climatique
                  </label>
                  <input
                    type="text"
                    value={contact?.climateZone || ""}
                    readOnly
                    className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">
                    Type de chauffage
                  </label>
                  <input
                    type="text"
                    value={contact?.heatingType || ""}
                    readOnly
                    className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white"
                  />
                </div>
              </div>
            </motion.details>
          </div>
        </motion.section>
  
        {/* --- Logement Section (Updated with New Fields) --- */}
        {dossier.informationLogement && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="relative bg-white rounded-2xl p-10 border border-green-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
              <div className="flex items-center">
                <div className="flex items-center justify-center bg-gradient-to-r from-green-700 to-green-500 text-white rounded-full w-20 h-20 mr-6 shadow-lg">
                  <HomeIcon className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-800">
                  Logement
                </h2>
              </div>
            </div>
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Type (dropdown) */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Type
                </label>
                <select
                  name="typeDeLogement"
                  value={formData.informationLogement?.typeDeLogement || ""}
                  onChange={(e) =>
                    handleNestedInputChange(e, "informationLogement")
                  }
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-200"
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="maison">Maison</option>
                  <option value="appartement">Appartement</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              {/* Surface (m²) as number */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Surface (m²)
                </label>
                <input
                  type="number"
                  name="surfaceHabitable"
                  value={formData.informationLogement?.surfaceHabitable || ""}
                  onChange={(e) =>
                    handleNestedInputChange(e, "informationLogement")
                  }
                  placeholder="Ex: 85"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-200"
                />
              </div>
              {/* Année de construction as number */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Année de construction
                </label>
                <input
                  type="number"
                  name="anneeConstruction"
                  value={formData.informationLogement?.anneeConstruction || ""}
                  onChange={(e) =>
                    handleNestedInputChange(e, "informationLogement")
                  }
                  placeholder="Ex: 1995"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-200"
                />
              </div>
              {/* Chauffage (dropdown) */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Chauffage
                </label>
                <select
                  name="systemeChauffage"
                  value={formData.informationLogement?.systemeChauffage || ""}
                  onChange={(e) =>
                    handleNestedInputChange(e, "informationLogement")
                  }
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-200"
                >
                  <option value="">
                    Sélectionnez un type de chauffage
                  </option>
                  <option value="gaz">Gaz</option>
                  <option value="bois">Bois</option>
                  <option value="electrique">Électrique</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              {/* Nombre de personnes au foyer */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Nombre de personnes au foyer
                </label>
                <input
                  type="number"
                  name="nombrePersonnes"
                  value={formData.informationLogement?.nombrePersonnes || ""}
                  onChange={(e) =>
                    handleNestedInputChange(e, "informationLogement")
                  }
                  placeholder="Ex: 4"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-200"
                />
              </div>
              {/* Profil (dropdown) */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Profil
                </label>
                <select
                  name="profil"
                  value={formData.informationLogement?.profil || ""}
                  onChange={(e) =>
                    handleNestedInputChange(e, "informationLogement")
                  }
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-200"
                >
                  <option value="">Sélectionnez un profil</option>
                  <option value="proprietaire">Propriétaire</option>
                  <option value="occupant">Occupant</option>
                  <option value="bailleur">Bailleur</option>
                  <option value="SCI">SCI</option>
                </select>
              </div>
            </div>
          </motion.section>
        )}
  
        {/* --- Travaux Section --- */}
        {dossier.informationTravaux && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative bg-white rounded-2xl p-10 border border-purple-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
              <div className="flex items-center">
                <div className="flex items-center justify-center bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-full w-20 h-20 mr-6 shadow-lg">
                  <BriefcaseIcon className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-800">
                  Travaux
                </h2>
              </div>
            </div>
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Type de travaux (dropdown) */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Type de travaux
                </label>
                <select
                  name="typeTravaux"
                  value={formData.informationTravaux?.typeTravaux || ""}
                  onChange={(e) =>
                    handleNestedInputChange(e, "informationTravaux")
                  }
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all duration-200"
                >
                  <option value="">Sélectionnez un type de travaux</option>
                  <option value="renovation">Rénovation</option>
                  <option value="extension">Extension</option>
                  <option value="installation">Installation</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              {/* Surface chauffée (m²) as number */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Surface chauffée (m²)
                </label>
                <input
                  type="number"
                  name="surfaceChauffee"
                  value={formData.informationTravaux?.surfaceChauffee || ""}
                  onChange={(e) =>
                    handleNestedInputChange(e, "informationTravaux")
                  }
                  placeholder="Ex: 60"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all duration-200"
                />
              </div>
            </div>
          </motion.section>
        )}
  
        {/* --- Auto-Save Status --- */}
        <div className="text-right text-xs text-gray-500 italic">
          {saveStatus}
        </div>
      </div>
  
      {/* Right Column: Additional Info Boxes */}
      <div className="w-80 space-y-6 sticky top-10">
        {/* Heure Locale */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4"
        >
          <div className="flex items-center gap-4">
            <ClockIcon className="h-12 w-12 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800 text-lg">
                Heure Locale
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-green-900">
                  {new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
  
        {/* Infos Organisation */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
        >
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <BuildingOffice2Icon className="h-6 w-6 text-gray-600" />
            Chargé de compte
          </h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Nom:</span>{" "}
              {contact?.organization ?? "N/A"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Téléphone:</span>{" "}
              {contact?.organizationPhone || "N/A"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Adresse:</span>{" "}
              {contact?.organizationAddress || "N/A"}
            </p>
          </div>
        </motion.div>
  
        {/* Synthèse Énergétique */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
        >
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <LightBulbIcon className="h-6 w-6 text-yellow-500" />
            Synthèse Énergétique
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <SunIcon className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Zone Climatique</p>
                <p className="font-medium">{contact?.climateZone ?? "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FireIcon className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Chauffage</p>
                <p className="font-medium">{contact?.heatingType ?? "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PaintBrushIcon className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">MaPrimeRénov</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getMaPrimeRenovColor(
                    contact?.rfr
                  )}`}
                >
                  {contact?.rfr ? "Eligible" : "Non éligible"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
  
        {/* Météo Locale */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4"
        >
          <div className="flex items-center gap-4">
            {weatherLoading ? (
              <div className="animate-pulse flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-6 bg-gray-200 rounded w-16" />
                </div>
              </div>
            ) : weatherError ? (
              <div className="text-red-500 text-sm flex items-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5" />
                {weatherError}
              </div>
            ) : weather ? (
              <>
                {weather.icon && (
                  <Image
                    src={weather.icon}
                    alt={weather.condition}
                    width={112}
                    height={112}
                    className="h-12 w-12"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-blue-800 text-lg">
                    Météo Locale
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-blue-900">
                      {weather.temp}°C
                    </span>
                    <span className="text-sm text-blue-800 capitalize">
                      {weather.condition}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 mt-1">
                    {contact?.department
                      ? `Département ${contact.department}`
                      : "Localisation inconnue"}
                  </p>
                </div>
              </>
            ) : null}
          </div>
        </motion.div>
      </div>
    </div>
  );  
  
};

export default InfoTab;
