import React from "react";
import { XMarkIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { IndivisionData } from "./AddIndivisionModal";

interface IndivisionInfoDisplayProps {
  indivisionData: IndivisionData;
  onRemove: () => void;
}

const IndivisionInfoDisplay: React.FC<IndivisionInfoDisplayProps> = ({
  indivisionData,
  onRemove,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-md">
            <UserGroupIcon className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Indivision créée</h3>
        </div>
        <button
          onClick={onRemove}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Type de propriétaire: {indivisionData.typeProprietaire === "occupant" 
            ? "Propriétaire occupant" 
            : "Propriétaire bailleur"}
        </p>
        
        <p className="text-sm font-medium text-gray-700 mb-1">Indivisaires:</p>
        <div className="space-y-2">
          {indivisionData.indivisaires.map((indivisaire, index) => (
            <div key={`indivisaire-summary-${index}`} className="text-sm pl-2 border-l-2 border-blue-200">
              <p className="font-medium">
                Indivisaire N°{index + 2}: {indivisaire.prenom} {indivisaire.nom}
              </p>
              <p className="text-gray-600 text-xs">
                Né(e) le: {new Date(indivisaire.dateNaissance).toLocaleDateString('fr-FR')}
              </p>
              <p className="text-gray-600 text-xs">
                {indivisaire.adresse}, {indivisaire.codePostal} {indivisaire.ville}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndivisionInfoDisplay;