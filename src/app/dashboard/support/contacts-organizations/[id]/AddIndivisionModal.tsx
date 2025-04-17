import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  XMarkIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

// Define TypeScript interface for co-owner (indivisaire) data
export interface Indivisaire {
  nom: string;
  prenom: string;
  dateNaissance: string;
  adresse: string;
  codePostal: string;
  ville: string;
}

// Define TypeScript interface for indivision data
export interface IndivisionData {
  typeProprietaire: "occupant" | "bailleur";
  indivisaires: Indivisaire[];
}

interface AddIndivisionModalProps {
  onClose: () => void;
  onSave: (data: IndivisionData) => void;
}

const AddIndivisionModal: React.FC<AddIndivisionModalProps> = ({ onClose, onSave }) => {
  // State for proprietor type
  const [typeProprietaire, setTypeProprietaire] = useState<"occupant" | "bailleur">("occupant");
  
  // State for co-owners (indivisaires)
  const [indivisaires, setIndivisaires] = useState<Indivisaire[]>([
    // Initialize with empty values for 5 co-owners
    { nom: "", prenom: "", dateNaissance: "", adresse: "", codePostal: "", ville: "" },
    { nom: "", prenom: "", dateNaissance: "", adresse: "", codePostal: "", ville: "" },
    { nom: "", prenom: "", dateNaissance: "", adresse: "", codePostal: "", ville: "" },
    { nom: "", prenom: "", dateNaissance: "", adresse: "", codePostal: "", ville: "" },
    { nom: "", prenom: "", dateNaissance: "", adresse: "", codePostal: "", ville: "" },
  ]);

  // Handle input change for co-owner fields
  const handleIndivisaireChange = (index: number, field: keyof Indivisaire, value: string) => {
    const updatedIndivisaires = [...indivisaires];
    updatedIndivisaires[index] = {
      ...updatedIndivisaires[index],
      [field]: value
    };
    setIndivisaires(updatedIndivisaires);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty indivisaires (those without at least name and first name)
    const filteredIndivisaires = indivisaires.filter(
      indiv => indiv.nom.trim() !== "" && indiv.prenom.trim() !== ""
    );
    
    if (filteredIndivisaires.length === 0) {
      alert("Veuillez ajouter au moins un indivisaire");
      return;
    }
    
    const indivisionData: IndivisionData = {
      typeProprietaire,
      indivisaires: filteredIndivisaires
    };
    
    onSave(indivisionData);
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
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Ajouter une indivision
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
        
        {/* Modal body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            {/* Proprietor type selection */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Demande à déposer en tant que propriétaire occupant ou bailleur ?
              </label>
              <div className="flex space-x-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="proprietaireOccupant"
                    name="typeProprietaire"
                    checked={typeProprietaire === "occupant"}
                    onChange={() => setTypeProprietaire("occupant")}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="proprietaireOccupant" className="ml-2 text-gray-700">
                    Propriétaire occupant
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="proprietaireBailleur"
                    name="typeProprietaire"
                    checked={typeProprietaire === "bailleur"}
                    onChange={() => setTypeProprietaire("bailleur")}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="proprietaireBailleur" className="ml-2 text-gray-700">
                    Propriétaire bailleur
                  </label>
                </div>
              </div>
            </div>
            
            {/* Co-owners forms */}
            {indivisaires.map((indivisaire, index) => (
              <div key={`indivisaire-${index + 2}`} className="mb-8 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Indivisaire N°{index + 2}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor={`nom-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      id={`nom-${index}`}
                      value={indivisaire.nom}
                      onChange={(e) => handleIndivisaireChange(index, "nom", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required={index === 0}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`prenom-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id={`prenom-${index}`}
                      value={indivisaire.prenom}
                      onChange={(e) => handleIndivisaireChange(index, "prenom", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required={index === 0}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`dateNaissance-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Date de Naissance *
                    </label>
                    <input
                      type="date"
                      id={`dateNaissance-${index}`}
                      value={indivisaire.dateNaissance}
                      onChange={(e) => handleIndivisaireChange(index, "dateNaissance", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required={index === 0}
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor={`adresse-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    id={`adresse-${index}`}
                    value={indivisaire.adresse}
                    onChange={(e) => handleIndivisaireChange(index, "adresse", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required={index === 0}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`codePostal-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Code Postal *
                    </label>
                    <input
                      type="text"
                      id={`codePostal-${index}`}
                      value={indivisaire.codePostal}
                      onChange={(e) => handleIndivisaireChange(index, "codePostal", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required={index === 0}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`ville-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Ville *
                    </label>
                    <input
                      type="text"
                      id={`ville-${index}`}
                      value={indivisaire.ville}
                      onChange={(e) => handleIndivisaireChange(index, "ville", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required={index === 0}
                    />
                  </div>
                </div>
              </div>
            ))}
            
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

export default AddIndivisionModal;