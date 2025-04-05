import React, { useState, useRef, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  ChevronDownIcon,
  DocumentIcon,
  DocumentCheckIcon,
  BuildingLibraryIcon,
  XMarkIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import { SizingNote, TableItem, FinancialTotals, FinancingData, DPMairieData, IncentivesData } from './types';
import { generateDevisPDF } from './devis-pdf-generator';
import { generateSizingNotePDF } from './sizing-note-pdf-generator';
import { IndivisionData } from './AddIndivisionModal';

interface PDFGeneratorProps {
  tableItems: TableItem[];
  quoteNumber: string;
  quoteDate: string;
  clientName?: string;
  totals: FinancialTotals;
  dealId?: string;
  additionalInfo?: string;
  sizingNotes?: SizingNote[];
  financingData?: FinancingData | null;
  dpMairieData?: DPMairieData | null;
  indivisionData?: IndivisionData | null; // Add indivision data prop
  incentivesData?: IncentivesData;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ 
  tableItems, 
  quoteNumber, 
  quoteDate, 
  clientName = "Client", 
  totals,
  dealId,
  additionalInfo,
  sizingNotes = [],
  financingData = null,
  dpMairieData = null,
  indivisionData = null,
  incentivesData = null // Add with default value
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Call the appropriate PDF generator function based on selection
  const handleGenerateDevisPDF = () => {
    generateDevisPDF(
      tableItems,
      quoteNumber,
      quoteDate,
      clientName,
      totals,
      dealId,
      additionalInfo,
      sizingNotes,
      financingData,
      incentivesData // Pass incentivesData to the generator
    );
    setDropdownVisible(false);
  };

  const handleGenerateSizingNotePDF = () => {
    generateSizingNotePDF(
      quoteNumber,
      quoteDate,
      clientName,
      sizingNotes
    );
    setDropdownVisible(false);
  };

  // Function to generate other document types
  const generateDocument = (documentType: string) => {
    switch (documentType) {
      case 'dp-mairie':
        // Generate DP Mairie document
        alert(`Génération de la DP Mairie en cours...`);
        break;
      case 'daact':
        // Generate DAACT document
        alert(`Génération de la Déclaration attestant l'achèvement et la conformité des travaux (DAACT) en cours...`);
        break;
      case 'attestation-proprietaire-bailleur':
        // Generate Attestation Propriétaire bailleur
        alert(`Génération de l'Attestation Propriétaire bailleur en cours...`);
        break;
      case 'attestation-indivision':
        // Generate Attestation d'indivision
        alert(`Génération de l'Attestation d'indivision en cours...`);
        break;
      default:
        alert(`Génération de document "${documentType}" à implémenter.`);
    }
    setDropdownVisible(false);
  };

  // Group documents by category for better organization
  const documentCategories = [
    {
      name: "Documents de base",
      items: [
        { id: "devis", label: "Devis", icon: <DocumentIcon className="h-4 w-4 text-blue-500" />, action: handleGenerateDevisPDF },
        { id: "devis-sans-prix", label: "Devis sans prix", icon: <DocumentIcon className="h-4 w-4 text-blue-500" />, action: () => generateDocument("Devis sans prix") }
      ]
    },
    {
      name: "Documents techniques",
      items: sizingNotes.length > 0 ? [
        { id: "sizing-note", label: "Note de dimensionnement", icon: <DocumentCheckIcon className="h-4 w-4 text-green-500" />, action: handleGenerateSizingNotePDF }
      ] : []
    },
    {
      name: "Documents administratifs",
      items: [
        { id: "dossier-cee", label: "Dossier CEE", icon: <DocumentCheckIcon className="h-4 w-4 text-gray-500" />, action: () => generateDocument("Dossier CEE") },
        { id: "courrier-rac", label: "Courrier de prise en charge du RAC", icon: <DocumentCheckIcon className="h-4 w-4 text-gray-500" />, action: () => generateDocument("Courrier de prise en charge du RAC") },
        { id: "attestation-fin", label: "Attestation de Fin des Travaux", icon: <DocumentCheckIcon className="h-4 w-4 text-gray-500" />, action: () => generateDocument("Attestation de Fin des Travaux") },
        { id: "attestation-mise-service", label: "Attestation mise en service ECOLOGY'B", icon: <DocumentCheckIcon className="h-4 w-4 text-gray-500" />, action: () => generateDocument("Attestation mise en service ECOLOGY'B") }
      ]
    },
    {
      name: "Documents financiers",
      items: [
        { id: "cession-creance", label: "Cession de créance de RENOLIB", icon: <DocumentCheckIcon className="h-4 w-4 text-gray-500" />, action: () => generateDocument("Cession de créance de RENOLIB") },
        { id: "eco-ptz", label: "ECO-PTZ", icon: <DocumentCheckIcon className="h-4 w-4 text-gray-500" />, action: () => generateDocument("ECO-PTZ") },
        { id: "mandat-perception", label: "Mandat de perception de fond EFFY", icon: <DocumentCheckIcon className="h-4 w-4 text-gray-500" />, action: () => generateDocument("Mandat de perception de fond EFFY") },
        { id: "cgv", label: "Conditions générales de vente", icon: <DocumentCheckIcon className="h-4 w-4 text-gray-500" />, action: () => generateDocument("Conditions générales de vente") }
      ]
    }
  ];

  // Add DP Mairie category if dpMairieData exists
  if (dpMairieData) {
    const dpMairieCategory = {
      name: "Documents d'urbanisme",
      items: [
        { id: "dp-mairie", label: "DP Mairie", icon: <BuildingLibraryIcon className="h-4 w-4 text-purple-500" />, action: () => generateDocument("dp-mairie") }
      ]
    };
    
    // Add DAACT document if numeroDeclarationPrealable exists
    if (dpMairieData.numeroDeclarationPrealable) {
      dpMairieCategory.items.push({
        id: "daact", 
        label: "Déclaration d'achèvement (DAACT)", 
        icon: <DocumentCheckIcon className="h-4 w-4 text-purple-500" />, 
        action: () => generateDocument("daact")
      });
    }
    
    documentCategories.push(dpMairieCategory);
  }

  // Add Indivision category if indivisionData exists
  if (indivisionData) {
    const indivisionCategory = {
      name: "Documents d'indivision",
      items: [
        { 
          id: "attestation-indivision", 
          label: "Attestation d'indivision", 
          icon: <UserGroupIcon className="h-4 w-4 text-orange-500" />, 
          action: () => generateDocument("attestation-indivision") 
        }
      ]
    };
    
    // Add Attestation Propriétaire bailleur if typeProprietaire is "bailleur"
    if (indivisionData.typeProprietaire === "bailleur") {
      indivisionCategory.items.push({
        id: "attestation-proprietaire-bailleur", 
        label: "Attestation Propriétaire bailleur", 
        icon: <DocumentCheckIcon className="h-4 w-4 text-orange-500" />, 
        action: () => generateDocument("attestation-proprietaire-bailleur")
      });
    }
    
    documentCategories.push(indivisionCategory);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
      >
        <DocumentTextIcon className="h-5 w-5" />
        <span>Générer des documents PDF</span>
        <ChevronDownIcon className="h-5 w-5 ml-1" />
      </button>
      
      {dropdownVisible && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-50 border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium text-gray-700">Documents disponibles</h3>
            <button 
              onClick={() => setDropdownVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-2 max-h-80 overflow-y-auto">
            {documentCategories.map((category, idx) => (
              category.items.length > 0 && (
                <div key={idx} className="mb-3 last:mb-0">
                  <div className="font-medium text-gray-600 text-xs uppercase tracking-wider px-2 py-1">
                    {category.name}
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {category.items.map(item => (
                      <div 
                        key={item.id} 
                        className="px-2 py-2 hover:bg-blue-50 cursor-pointer rounded text-sm flex items-center gap-2 transition-colors"
                        onClick={item.action}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFGenerator;