import React, { useState } from 'react';
import { 
  DocumentTextIcon, 
  ChevronDownIcon,
  DocumentIcon,
  DocumentCheckIcon
} from "@heroicons/react/24/outline";
import { SizingNote, TableItem, FinancialTotals } from './types';
import { generateDevisPDF } from './devis-pdf-generator';
import { generateSizingNotePDF } from './sizing-note-pdf-generator';

interface PDFGeneratorProps {
  tableItems: TableItem[];
  quoteNumber: string;
  quoteDate: string;
  clientName?: string;
  totals: FinancialTotals;
  dealId?: string;
  additionalInfo?: string;
  sizingNotes?: SizingNote[];
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ 
  tableItems, 
  quoteNumber, 
  quoteDate, 
  clientName = "Client", 
  totals,
  dealId,
  additionalInfo,
  sizingNotes = []
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

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
      []  // Don't include sizing notes in the devis PDF
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
    alert(`Génération de document "${documentType}" à implémenter.`);
    setDropdownVisible(false);
  };

  return (
    <div className="relative flex-grow">
      <button
        onClick={toggleDropdown}
        className="inline-flex items-center gap-2 px-4 py-2 w-full bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
      >
        <DocumentTextIcon className="h-5 w-5" />
        <span>Générer des documents PDF</span>
        <ChevronDownIcon className="h-5 w-5 ml-auto" />
      </button>
      
      {dropdownVisible && (
        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden z-10 border border-gray-200">
          <div className="p-2 max-h-64 overflow-y-auto">
            <div className="space-y-1">
              <div className="font-medium text-gray-700 px-2 py-1">Documents disponibles:</div>
              <div 
                className="px-2 py-1.5 hover:bg-blue-50 cursor-pointer rounded text-sm flex items-center gap-1"
                onClick={handleGenerateDevisPDF}
              >
                <DocumentIcon className="h-4 w-4 text-blue-500" />
                <span>Devis</span>
              </div>
              {sizingNotes && sizingNotes.length > 0 && (
                <div 
                  className="px-2 py-1.5 hover:bg-blue-50 cursor-pointer rounded text-sm flex items-center gap-1"
                  onClick={handleGenerateSizingNotePDF}
                >
                  <DocumentCheckIcon className="h-4 w-4 text-blue-500" />
                  <span>Note de dimensionnement</span>
                </div>
              )}
              {[
                "Dossier CEE",
                "Courrier de prise en charge du RAC", 
                "Attestation de Fin des Travaux", 
                "Attestation mise en service ECOLOGY'B", 
                "Attestation simplifiée", 
                "Cession de créance de RENOLIB", 
                "ECO-PTZ", 
                "Enedis", 
                "Cadastre", 
                "Mandat de perception de fond EFFY", 
                "Conditions générales de vente", 
                "Checklist EFFY"
              ].map(doc => (
                <div 
                  key={doc} 
                  className="px-2 py-1.5 hover:bg-blue-50 cursor-pointer rounded text-sm flex items-center gap-1"
                  onClick={() => generateDocument(doc)}
                >
                  <DocumentCheckIcon className="h-4 w-4 text-gray-500" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFGenerator;