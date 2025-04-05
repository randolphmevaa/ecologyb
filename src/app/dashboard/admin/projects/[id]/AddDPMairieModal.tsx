import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  XMarkIcon,
  BuildingLibraryIcon,
  InformationCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

// Define TypeScript interface for DP Mairie data
interface DPMairieData {
  mandataire: string;
  transmissionVoieElectronique: boolean;
  terrainLotissement: string; // "oui" | "non" | "je ne sais pas"
  certificatUrbanisme: string; // "oui" | "non" | "je ne sais pas"
  zoneAmenagementConcertee: string; // "oui" | "non" | "je ne sais pas"
  remembrementUrbain: string; // "oui" | "non" | "je ne sais pas"
  projetUrbainPartenarial: string; // "oui" | "non" | "je ne sais pas"
  operationInteretNational: string; // "oui" | "non" | "je ne sais pas"
  precisionsTerrainConcerne: string;
  immeubleClasseMonumentsHistoriques: boolean;
  projetConcerne: string; // "résidence principale" | "résidence secondaire"
  perimetresProtection: {
    sitePatrimonialRemarquable: boolean;
    abordsMonumentHistorique: boolean;
    siteClasse: boolean;
  };
  parcellesCadastralesSupplementaires: {
    parcelle1: string;
    parcelle2: string;
    parcelle3: string;
  };
  puissanceElectrique: number;
  puissanceCrete: number;
  destinationEnergie: string;
  modeUtilisationLogements: string;
  titreProjet: string;
  autresPrecisions: string;
  superficiePanneauxSol: number;
  surfacePlancherExistante: number;
  surfacePlancherSupprimee: number;
  surfacePlancherCreee: number;
  travauxConstructionExistante: string;
  descriptionProjet: string;
  // DAACT fields
  numeroDeclarationPrealable: string;
  dateAchevementChantier: string;
  totaliteTravaux: boolean;
  surfacePlancherCreeeDaact: number;
  dateEnvoiDaact: string;
}

interface AddDPMairieModalProps {
  onClose: () => void;
  onSave: (dpMairieData: DPMairieData) => void;
}

// Sample mandataires for the dropdown
const mandatairesDPMairie = [
  { id: "DP1", name: "Martin Construction" },
  { id: "DP2", name: "Bureau d'études techniques Dupont" },
  { id: "DP3", name: "Cabinet d'architecture Laurent" },
];

const AddDPMairieModal: React.FC<AddDPMairieModalProps> = ({ onClose, onSave }) => {
  // Form state with initial values
  const [formData, setFormData] = useState<DPMairieData>({
    mandataire: "",
    transmissionVoieElectronique: true,
    terrainLotissement: "je ne sais pas",
    certificatUrbanisme: "je ne sais pas",
    zoneAmenagementConcertee: "je ne sais pas",
    remembrementUrbain: "je ne sais pas",
    projetUrbainPartenarial: "je ne sais pas",
    operationInteretNational: "je ne sais pas",
    precisionsTerrainConcerne: "",
    immeubleClasseMonumentsHistoriques: false,
    projetConcerne: "résidence principale",
    perimetresProtection: {
      sitePatrimonialRemarquable: false,
      abordsMonumentHistorique: false,
      siteClasse: false,
    },
    parcellesCadastralesSupplementaires: {
      parcelle1: "",
      parcelle2: "",
      parcelle3: "",
    },
    puissanceElectrique: 0,
    puissanceCrete: 0,
    destinationEnergie: "",
    modeUtilisationLogements: "",
    titreProjet: "",
    autresPrecisions: "",
    superficiePanneauxSol: 0,
    surfacePlancherExistante: 0,
    surfacePlancherSupprimee: 0,
    surfacePlancherCreee: 0,
    travauxConstructionExistante: "",
    descriptionProjet: "",
    numeroDeclarationPrealable: "",
    dateAchevementChantier: "",
    totaliteTravaux: false,
    surfacePlancherCreeeDaact: 0,
    dateEnvoiDaact: "",
  });
  
  // Handle standard input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkboxes separately
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } 
    // Handle number inputs
    else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : parseFloat(value)
      });
    }
    // Handle all other inputs
    else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Create a type for the nested fields
  type NestedField = {
    [key: string]: string | boolean | number;
  };

  // Update the handleNestedChange function with proper typing
  const handleNestedChange = (
    category: keyof DPMairieData, 
    field: string, 
    value: string | boolean | number
  ) => {
    setFormData({
      ...formData,
      [category]: {
        ...(formData[category] as NestedField),
        [field]: value
      }
    });
  };

  // Handle radio button changes
  const handleRadioChange = (name: string, value: string | boolean) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-white rounded-xl w-full max-w-5xl m-4 overflow-hidden shadow-2xl"
      >
        {/* Modal header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -mr-10 -mt-10 opacity-20" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <BuildingLibraryIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Ajouter une DP Mairie
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Modal body with scrollable content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Informations générales */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations générales</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="mandataire" className="block text-sm font-medium text-gray-700 mb-1">
                      Mandataire DP Mairie
                    </label>
                    <select
                      id="mandataire"
                      name="mandataire"
                      value={formData.mandataire}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      <option value="">Sélectionnez un mandataire DP</option>
                      {mandatairesDPMairie.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transmission par voie électronique
                    </label>
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="transmissionOui" 
                          name="transmissionVoieElectronique" 
                          checked={formData.transmissionVoieElectronique === true}
                          onChange={() => handleRadioChange("transmissionVoieElectronique", true)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="transmissionOui" className="ml-2 text-sm text-gray-700">Oui</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="transmissionNon" 
                          name="transmissionVoieElectronique"
                          checked={formData.transmissionVoieElectronique === false}
                          onChange={() => handleRadioChange("transmissionVoieElectronique", false)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="transmissionNon" className="ml-2 text-sm text-gray-700">Non</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Terrain */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations sur le terrain</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="terrainLotissement" className="block text-sm font-medium text-gray-700 mb-1">
                      Ce terrain est situé dans un lotissement ?
                    </label>
                    <select
                      id="terrainLotissement"
                      name="terrainLotissement"
                      value={formData.terrainLotissement}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      <option value="oui">Oui</option>
                      <option value="non">Non</option>
                      <option value="je ne sais pas">Je ne sais pas</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="certificatUrbanisme" className="block text-sm font-medium text-gray-700 mb-1">
                      Êtes-vous titulaire d&apos;un certificat d&apos;urbanisme pour ce terrain ?
                    </label>
                    <select
                      id="certificatUrbanisme"
                      name="certificatUrbanisme"
                      value={formData.certificatUrbanisme}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      <option value="oui">Oui</option>
                      <option value="non">Non</option>
                      <option value="je ne sais pas">Je ne sais pas</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="zoneAmenagementConcertee" className="block text-sm font-medium text-gray-700 mb-1">
                      Le terrain est-il situé dans une Zone d&apos;Aménagement Concertée (Z.A.C.) ?
                    </label>
                    <select
                      id="zoneAmenagementConcertee"
                      name="zoneAmenagementConcertee"
                      value={formData.zoneAmenagementConcertee}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      <option value="oui">Oui</option>
                      <option value="non">Non</option>
                      <option value="je ne sais pas">Je ne sais pas</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="remembrementUrbain" className="block text-sm font-medium text-gray-700 mb-1">
                      Le terrain fait-il partie d&apos;un remembrement urbain (Association Foncière Urbain) ?
                    </label>
                    <select
                      id="remembrementUrbain"
                      name="remembrementUrbain"
                      value={formData.remembrementUrbain}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      <option value="oui">Oui</option>
                      <option value="non">Non</option>
                      <option value="je ne sais pas">Je ne sais pas</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="projetUrbainPartenarial" className="block text-sm font-medium text-gray-700 mb-1">
                      Le terrain est-il situé dans un périmètre ayant fait l&apos;objet d&apos;une convention de Projet Urbain Partenarial (P.U.P) ?
                    </label>
                    <select
                      id="projetUrbainPartenarial"
                      name="projetUrbainPartenarial"
                      value={formData.projetUrbainPartenarial}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      <option value="oui">Oui</option>
                      <option value="non">Non</option>
                      <option value="je ne sais pas">Je ne sais pas</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="operationInteretNational" className="block text-sm font-medium text-gray-700 mb-1">
                      Le projet est-il situé dans le périmètre d&apos;une Opération d&apos;Intérêt National (O.I.N) ?
                    </label>
                    <select
                      id="operationInteretNational"
                      name="operationInteretNational"
                      value={formData.operationInteretNational}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      <option value="oui">Oui</option>
                      <option value="non">Non</option>
                      <option value="je ne sais pas">Je ne sais pas</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="precisionsTerrainConcerne" className="block text-sm font-medium text-gray-700 mb-1">
                      Si votre terrain est concerné par l&apos;un des cas ci-dessus, veuillez préciser, si vous les connaissez, les dates de décision ou d&apos;autorisation, les numéros et les denominations
                    </label>
                    <textarea
                      id="precisionsTerrainConcerne"
                      name="precisionsTerrainConcerne"
                      value={formData.precisionsTerrainConcerne}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>
              
              {/* Construction */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations sur la construction</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      La construction projetée concerne t-elle un immeuble classé ou inscrit au titre des monuments historiques ?
                    </label>
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="immeubleOui" 
                          name="immeubleClasseMonumentsHistoriques"
                          checked={formData.immeubleClasseMonumentsHistoriques === true}
                          onChange={() => handleRadioChange("immeubleClasseMonumentsHistoriques", true)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="immeubleOui" className="ml-2 text-sm text-gray-700">Oui</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="immeubleNon" 
                          name="immeubleClasseMonumentsHistoriques"
                          checked={formData.immeubleClasseMonumentsHistoriques === false}
                          onChange={() => handleRadioChange("immeubleClasseMonumentsHistoriques", false)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="immeubleNon" className="ml-2 text-sm text-gray-700">Non</label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Votre projet concerne ?
                    </label>
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="residencePrincipale" 
                          name="projetConcerne"
                          checked={formData.projetConcerne === "résidence principale"}
                          onChange={() => handleRadioChange("projetConcerne", "résidence principale")}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="residencePrincipale" className="ml-2 text-sm text-gray-700">Votre résidence principale</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="residenceSecondaire" 
                          name="projetConcerne"
                          checked={formData.projetConcerne === "résidence secondaire"}
                          onChange={() => handleRadioChange("projetConcerne", "résidence secondaire")}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="residenceSecondaire" className="ml-2 text-sm text-gray-700">Votre résidence secondaire</label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Votre projet se situe dans les périmètres de protection suivants :
                    </label>
                    <div className="space-y-2 ml-2">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="sitePatrimonialRemarquable" 
                          checked={formData.perimetresProtection.sitePatrimonialRemarquable}
                          onChange={(e) => handleNestedChange("perimetresProtection", "sitePatrimonialRemarquable", e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="sitePatrimonialRemarquable" className="ml-2 text-sm text-gray-700">
                          Se situe dans le périmètre d&apos;un site patrimonial remarquable
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="abordsMonumentHistorique" 
                          checked={formData.perimetresProtection.abordsMonumentHistorique}
                          onChange={(e) => handleNestedChange("perimetresProtection", "abordsMonumentHistorique", e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="abordsMonumentHistorique" className="ml-2 text-sm text-gray-700">
                          Se situe dans les abords d&apos;un monument historique
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="siteClasse" 
                          checked={formData.perimetresProtection.siteClasse}
                          onChange={(e) => handleNestedChange("perimetresProtection", "siteClasse", e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="siteClasse" className="ml-2 text-sm text-gray-700">
                          Se situe dans un site classé ou en instance de classement au titre du code de l&apos;environnement
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Parcelles cadastrales */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Parcelles cadastrales</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="parcelle1" className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse Parcelle cadastrale supplémentaire 1 (m²)
                    </label>
                    <input
                      type="text"
                      id="parcelle1"
                      name="parcelle1"
                      value={formData.parcellesCadastralesSupplementaires.parcelle1}
                      onChange={(e) => handleNestedChange("parcellesCadastralesSupplementaires", "parcelle1", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="parcelle2" className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse Parcelle cadastrale supplémentaire 2 (m²)
                    </label>
                    <input
                      type="text"
                      id="parcelle2"
                      name="parcelle2"
                      value={formData.parcellesCadastralesSupplementaires.parcelle2}
                      onChange={(e) => handleNestedChange("parcellesCadastralesSupplementaires", "parcelle2", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="parcelle3" className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse Parcelle cadastrale supplémentaire (m²)
                    </label>
                    <input
                      type="text"
                      id="parcelle3"
                      name="parcelle3"
                      value={formData.parcellesCadastralesSupplementaires.parcelle3}
                      onChange={(e) => handleNestedChange("parcellesCadastralesSupplementaires", "parcelle3", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>
              
              {/* Informations techniques */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations techniques</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="puissanceElectrique" className="block text-sm font-medium text-gray-700 mb-1">
                      Indiquez la puissance électrique nécessaire à votre projet (kW)
                    </label>
                    <input
                      type="number"
                      id="puissanceElectrique"
                      name="puissanceElectrique"
                      value={formData.puissanceElectrique || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="puissanceCrete" className="block text-sm font-medium text-gray-700 mb-1">
                      Indiquez la puissance crête (kW)
                    </label>
                    <input
                      type="number"
                      id="puissanceCrete"
                      name="puissanceCrete"
                      value={formData.puissanceCrete || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="destinationEnergie" className="block text-sm font-medium text-gray-700 mb-1">
                      La destination principale de l&apos;énergie produite
                    </label>
                    <input
                      type="text"
                      id="destinationEnergie"
                      name="destinationEnergie"
                      value={formData.destinationEnergie}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="modeUtilisationLogements" className="block text-sm font-medium text-gray-700 mb-1">
                      Mode d&apos;utilisation principale des logements
                    </label>
                    <input
                      type="text"
                      id="modeUtilisationLogements"
                      name="modeUtilisationLogements"
                      value={formData.modeUtilisationLogements}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="titreProjet" className="block text-sm font-medium text-gray-700 mb-1">
                      Si le projet est un foyer ou une résidence, à quel titre
                    </label>
                    <input
                      type="text"
                      id="titreProjet"
                      name="titreProjet"
                      value={formData.titreProjet}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="autresPrecisions" className="block text-sm font-medium text-gray-700 mb-1">
                      Si autres, précisez
                    </label>
                    <input
                      type="text"
                      id="autresPrecisions"
                      name="autresPrecisions"
                      value={formData.autresPrecisions}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>
              
              {/* Surfaces */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Surfaces</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="superficiePanneauxSol" className="block text-sm font-medium text-gray-700 mb-1">
                      Superficie des panneaux photovoltiques posés au sol (m²)
                    </label>
                    <input
                      type="number"
                      id="superficiePanneauxSol"
                      name="superficiePanneauxSol"
                      value={formData.superficiePanneauxSol || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="surfacePlancherExistante" className="block text-sm font-medium text-gray-700 mb-1">
                      Surface de plancher existante (m²)
                    </label>
                    <input
                      type="number"
                      id="surfacePlancherExistante"
                      name="surfacePlancherExistante"
                      value={formData.surfacePlancherExistante || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="surfacePlancherSupprimee" className="block text-sm font-medium text-gray-700 mb-1">
                      Surface de plancher supprimée (m²)
                    </label>
                    <input
                      type="number"
                      id="surfacePlancherSupprimee"
                      name="surfacePlancherSupprimee"
                      value={formData.surfacePlancherSupprimee || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="surfacePlancherCreee" className="block text-sm font-medium text-gray-700 mb-1">
                      Surface de plancher créée (m²)
                    </label>
                    <input
                      type="number"
                      id="surfacePlancherCreee"
                      name="surfacePlancherCreee"
                      value={formData.surfacePlancherCreee || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Description du projet</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="travauxConstructionExistante" className="block text-sm font-medium text-gray-700 mb-1">
                      Travaux sur une contruction existante
                    </label>
                    <textarea
                      id="travauxConstructionExistante"
                      name="travauxConstructionExistante"
                      value={formData.travauxConstructionExistante}
                      onChange={handleChange}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="descriptionProjet" className="block text-sm font-medium text-gray-700 mb-1">
                      Courte description de votre projet
                    </label>
                    <textarea
                      id="descriptionProjet"
                      name="descriptionProjet"
                      value={formData.descriptionProjet}
                      onChange={handleChange}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>
              
              {/* DAACT */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Déclaration attestant l&apos;achèvement et la conformité des travaux (DAACT)</h3>
                  <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                    Requis
                  </div>
                </div>
                
                <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800">
                  <div className="flex items-center gap-2">
                    <InformationCircleIcon className="h-6 w-6 text-blue-600" />
                    <p className="font-medium">Pour générer le document Déclaration attestant l&apos;achèvement et la conformité des travaux (DAACT), vous devez au moins renseigner le Numéro de Déclaration Préalable</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="numeroDeclarationPrealable" className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro de Déclaration Préalable
                    </label>
                    <input
                      type="text"
                      id="numeroDeclarationPrealable"
                      name="numeroDeclarationPrealable"
                      value={formData.numeroDeclarationPrealable}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dateAchevementChantier" className="block text-sm font-medium text-gray-700 mb-1">
                      Chantier achevé le
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="dateAchevementChantier"
                        name="dateAchevementChantier"
                        value={formData.dateAchevementChantier}
                        onChange={handleChange}
                        className="w-full pl-10 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="totaliteTravaux" 
                      name="totaliteTravaux"
                      checked={formData.totaliteTravaux}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="totaliteTravaux" className="ml-2 text-sm text-gray-700">
                      Pour la totalité des travaux
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="surfacePlancherCreeeDaact" className="block text-sm font-medium text-gray-700 mb-1">
                      Surface de plancher créée
                    </label>
                    <input
                      type="number"
                      id="surfacePlancherCreeeDaact"
                      name="surfacePlancherCreeeDaact"
                      value={formData.surfacePlancherCreeeDaact || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dateEnvoiDaact" className="block text-sm font-medium text-gray-700 mb-1">
                      Date d&apos;envoi de la DAACT
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="dateEnvoiDaact"
                        name="dateEnvoiDaact"
                        value={formData.dateEnvoiDaact}
                        onChange={handleChange}
                        className="w-full pl-10 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer with actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 transition hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg transition hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddDPMairieModal;