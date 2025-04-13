import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
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

// Define a proper interface for ClientDetails matching the expected structure
interface ClientDetails {
  street: string;
  postalCode: string;
  city: string;
  cadastralParcel: string;
  phoneNumber: string;
  zone: string;
  houseType: string;
  houseAge: string;
  precarity: string;
  heatingType: string;
  dwellingType: string;
  clientNumber: string;
  // Add any additional properties that might be used
  email?: string;
  name?: string;
  firstName?: string;
}

// Then update the PDFGeneratorProps interface
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
  indivisionData?: IndivisionData | null;
  incentivesData?: IncentivesData;
  customName?: string; // Add the customName prop
  // Add new date fields
  validUntilDate?: string;
  preVisitDate?: string;
  estimatedWorkDate?: string;
  commitmentDate?: string;
  clientDetails: ClientDetails;
}

// Update the pdfPreviewPaths object to use the PUBLIC_URL environment variable
const pdfPreviewPaths: Record<string, string | null> = {
  "attestation-fin": `${process.env.PUBLIC_URL || ''}/AFT.pdf`,
  "attestation-simplifiee": `${process.env.PUBLIC_URL || ''}/AS.pdf`,
  "attestation-indivision": `${process.env.PUBLIC_URL || ''}/ATTESTATION_INDIV.pdf`,
  "attestation-mise-service": `${process.env.PUBLIC_URL || ''}/Attestation_mise_en_service.pdf`,
  "cession-creance": `${process.env.PUBLIC_URL || ''}/Cession_RENOLIB.pdf`,
  "attestation-proprietaire-bailleur": `${process.env.PUBLIC_URL || ''}/ATTESTATION_PROP.pdf`,
  "dp-mairie": `${process.env.PUBLIC_URL || ''}/DPMairie.pdf`,
  "daact": `${process.env.PUBLIC_URL || ''}/DAACT.pdf`,
  "enedis": `${process.env.PUBLIC_URL || ''}/Enedis_.pdf`,
  "eco-ptz": `${process.env.PUBLIC_URL || ''}/ECO-PTZ.pdf`,
  "mandat-perception": `${process.env.PUBLIC_URL || ''}/Checklist_Effy.pdf`,
  "cgv": `${process.env.PUBLIC_URL || ''}/CGV.pdf`,
  "devis-sans-prix": null,
  "courrier-rac": null,
  "dossier-cee": null,
  "devis": null, // No preview available yet
  "sizing-note": null, // No preview available yet
  // Default fallback for any other documents
  "default": null
};

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
  incentivesData = null,
  // customName = "", // Add with default value
  validUntilDate = "",
  preVisitDate = "",
  estimatedWorkDate = "",
  commitmentDate = "",
  clientDetails
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [hoveredDocId, setHoveredDocId] = useState<string | null>(null);
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

  // New function to generate custom filenames
  // const getCustomFileName = (documentType: string): string => {
  //   let prefix: string;
    
  //   // Determine the appropriate prefix based on document type
  //   switch (documentType) {
  //     case "devis":
  //       prefix = "Devis";
  //       break;
  //     case "facture":
  //       prefix = "Facture";
  //       break;
  //     case "sizing-note":
  //       prefix = "Note_Dimensionnement";
  //       break;
  //     case "attestation-fin":
  //       prefix = "Attestation_Fin_Travaux";
  //       break;
  //     case "attestation-mise-service":
  //       prefix = "Attestation_Mise_En_Service";
  //       break;
  //     case "attestation-simplifiee":
  //       prefix = "Attestation_Simplifiee";
  //       break;
  //     case "attestation-indivision":
  //       prefix = "Attestation_Indivision";
  //       break;
  //     case "proprietaire-bailleur":
  //       prefix = "Attestation_Proprietaire_Bailleur";
  //       break;
  //     case "cession-creance":
  //       prefix = "Cession_Creance_RENOLIB";
  //       break;
  //     case "dp-mairie":
  //       prefix = "DP_Mairie";
  //       break;
  //     case "daact":
  //       prefix = "DAACT";
  //       break;
  //     case "enedis":
  //       prefix = "ENEDIS";
  //       break;
  //     case "eco-ptz":
  //       prefix = "ECO_PTZ";
  //       break;
  //     case "mandat-perception":
  //       prefix = "Mandat_Perception_EFFY";
  //       break;
  //     case "cgv":
  //       prefix = "CGV";
  //       break;
  //     default:
  //       prefix = documentType.replace(/\s+/g, '_');
  //   }
    
  //   if (customName && customName.trim() !== "") {
  //     // Sanitize the custom name for file use
  //     const sanitizedName = customName.replace(/\s+/g, '_').replace(/[^\w\-_.]/g, '');
  //     return `${prefix}_${sanitizedName}.pdf`;
  //   }
    
  //   // Default to using the reference number
  //   return `${prefix}_${quoteNumber}.pdf`;
  // };

  // // Common function to handle downloading PDFs with the custom filename
  // const downloadPDF = (pdfBytes: Uint8Array, documentType: string) => {
  //   const filename = getCustomFileName(documentType);
  //   const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
  //   // Create a download link
  //   const link = document.createElement('a');
  //   link.href = URL.createObjectURL(blob);
  //   link.download = filename;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   URL.revokeObjectURL(link.href);
  // };

  // Modified function for attestation mise en service
  const generateAttestationMiseEnServicePDF = async () => {
    try {
      console.log("Generating Attestation mise en service ECOLOGY'B PDF");
      
      // Fetch the PDF template from public directory
      const formUrl = `${process.env.PUBLIC_URL || ''}/Attestation_mise_en_service.pdf`;
      const formPdfBytes = await fetch(formUrl).then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch PDF template: ${res.status} ${res.statusText}`);
        }
        return res.arrayBuffer();
      });
      
      // Load the PDF document
      const pdfDoc = await PDFDocument.load(formPdfBytes);
      const form = pdfDoc.getForm();
      
      // Get all form fields for debugging
      const fields = form.getFields();
      console.log("Available PDF form fields:", fields.map(f => f.getName()));
      
      // Use client data if available, otherwise use sample data
      const clientData = {
        nom: clientName || 'Dupont Jean',
        adresse: indivisionData?.indivisaires[0]?.adresse || '15 rue de la République',
        email: 'client@example.com',
        phone: '06 12 34 56 78'
      };
      
      // Use sous-traitant sample data (you would replace this with actual data)
      const sousTraitantData = {
        nom: 'Technique Services',
        adresse: '10 avenue des Artisans, 75020 Paris',
        email: 'contact@techniqueservices.fr',
        siret: '12345678901234',
        societe: 'TECHNIQUE SERVICES SARL'
      };
      
      // Fill the client fields
      try {
        // Client full name
        const fieldName = `nom, prénom`;
        const field = form.getTextField(fieldName);
        field.setText(clientData.nom);
        console.log(`Successfully set ${fieldName} to "${clientData.nom}"`);
      } catch (e) {
        console.warn(`Failed to set nom, prénom field:`, e);
      }
      
      try {
        // Client address
        const fieldName = `adresse`;
        const field = form.getTextField(fieldName);
        field.setText(clientData.adresse);
        console.log(`Successfully set ${fieldName} to "${clientData.adresse}"`);
      } catch (e) {
        console.warn(`Failed to set adresse field:`, e);
      }
      
      try {
        // Client email
        const fieldName = `e-mail`;
        const field = form.getTextField(fieldName);
        field.setText(clientData.email);
        console.log(`Successfully set ${fieldName} to "${clientData.email}"`);
      } catch (e) {
        console.warn(`Failed to set e-mail field:`, e);
      }
      
      try {
        // Client phone
        const fieldName = `phone`;
        const field = form.getTextField(fieldName);
        field.setText(clientData.phone);
        console.log(`Successfully set ${fieldName} to "${clientData.phone}"`);
      } catch (e) {
        console.warn(`Failed to set phone field:`, e);
      }
      
      // Fill the sous-traitant fields
      try {
        // Sous-traitant name
        const fieldName = `sous-traitant-nom`;
        const field = form.getTextField(fieldName);
        field.setText(sousTraitantData.nom);
        console.log(`Successfully set ${fieldName} to "${sousTraitantData.nom}"`);
      } catch (e) {
        console.warn(`Failed to set sous-traitant-nom field:`, e);
      }
      
      try {
        // Sous-traitant business name
        const fieldName = `sous-traitant`;
        const field = form.getTextField(fieldName);
        field.setText(sousTraitantData.nom);
        console.log(`Successfully set ${fieldName} to "${sousTraitantData.nom}"`);
      } catch (e) {
        console.warn(`Failed to set sous-traitant field:`, e);
      }
      
      try {
        // Sous-traitant address
        const fieldName = `sous-traitant-adresse`;
        const field = form.getTextField(fieldName);
        field.setText(sousTraitantData.adresse);
        console.log(`Successfully set ${fieldName} to "${sousTraitantData.adresse}"`);
      } catch (e) {
        console.warn(`Failed to set sous-traitant-adresse field:`, e);
      }
      
      try {
        // Sous-traitant email
        const fieldName = `email`;
        const field = form.getTextField(fieldName);
        field.setText(sousTraitantData.email);
        console.log(`Successfully set ${fieldName} to "${sousTraitantData.email}"`);
      } catch (e) {
        console.warn(`Failed to set email field:`, e);
      }
      
      try {
        // Company name
        const fieldName = `société`;
        const field = form.getTextField(fieldName);
        field.setText(sousTraitantData.societe);
        console.log(`Successfully set ${fieldName} to "${sousTraitantData.societe}"`);
      } catch (e) {
        console.warn(`Failed to set société field:`, e);
      }
      
      try {
        // SIRET number
        const fieldName = `SIRET`;
        const field = form.getTextField(fieldName);
        field.setText(sousTraitantData.siret);
        console.log(`Successfully set ${fieldName} to "${sousTraitantData.siret}"`);
      } catch (e) {
        console.warn(`Failed to set SIRET field:`, e);
      }
      
      // IMPORTANT: Flatten the form to make fields uneditable
      form.flatten();
      console.log("Form flattened - all fields converted to regular content");
      
      // Save the PDF with security settings to make it uneditable
      const pdfBytes = await pdfDoc.save({
        updateFieldAppearances: true,
        useObjectStreams: false
      });
      
      // Use the downloadPDF function with the custom filename
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
      alert('Une erreur est survenue lors de la génération du PDF: ' + errorMessage);
    }
  };

// Export this function or make it available to the devis-pdf-generator module
// const getCustomFilename = () => {
//   return currentCustomFilename;
// };

// Modified handler function - doesn't pass filename directly
const handleGenerateDevisPDF = () => {
  // Then call the generator with all the date parameters
  generateDevisPDF(
    tableItems,
    quoteNumber,
    quoteDate,
    clientName,
    totals,
    dealId,
    additionalInfo,
    // sizingNotes,
    financingData,
    incentivesData,
    validUntilDate,      // Add valid until date
    preVisitDate,        // Add pre-visit date
    estimatedWorkDate,   // Add estimated work date
    commitmentDate,
    clientDetails
  );
  setDropdownVisible(false);
};

  // Similarly, update the sizing note generation
const handleGenerateSizingNotePDF = () => {
  
  // Then call the generator without the filename parameter
  generateSizingNotePDF(
    quoteNumber,
    quoteDate,
    clientName,
    sizingNotes
  );
  setDropdownVisible(false);
};

  // Add this new function to generate the Attestation de Fin de Travaux PDF
const generateAttestationFinTravauxPDF = async () => {
  try {
    console.log("Generating Attestation de Fin de Travaux PDF");
    
    // Fetch the PDF template from public directory
    const formUrl = `${process.env.PUBLIC_URL || ''}/AFT.pdf`;
    const formPdfBytes = await fetch(formUrl).then(res => {
      if (!res.ok) {
        throw new Error(`Failed to fetch PDF template: ${res.status} ${res.statusText}`);
      }
      return res.arrayBuffer();
    });
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();
    
    // Get all form fields for debugging
    const fields = form.getFields();
    console.log("Available PDF form fields:", fields.map(f => f.getName()));
    
    // Get current date and format it
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('fr-FR');
    
    // Use indivision data if available, otherwise use sample data
    const personData = indivisionData?.indivisaires[0] || {
      nom: 'Dupont',
      prenom: 'Jean',
      adresse: '15 rue de la République',
      codePostal: '75001',
      ville: 'Paris'
    };
    
    // Fill the specified fields
    
    // Address
    try {
      const fieldName = `adresse`;
      const field = form.getTextField(fieldName);
      field.setText(personData.adresse);
      console.log(`Successfully set ${fieldName} to "${personData.adresse}"`);
    } catch (e) {
      console.warn(`Failed to set address field:`, e);
    }
    
    // Postal code
    try {
      const fieldName = `code`;
      const field = form.getTextField(fieldName);
      field.setText(personData.codePostal);
      console.log(`Successfully set ${fieldName} to "${personData.codePostal}"`);
    } catch (e) {
      console.warn(`Failed to set postal code field:`, e);
    }
    
    // Date
    try {
      const fieldName = `date`;
      const field = form.getTextField(fieldName);
      field.setText(formattedDate);
      console.log(`Successfully set ${fieldName} to "${formattedDate}"`);
    } catch (e) {
      console.warn(`Failed to set date field:`, e);
    }
    
    // Last name
    try {
      const fieldName = `nom`;
      const field = form.getTextField(fieldName);
      field.setText(personData.nom);
      console.log(`Successfully set ${fieldName} to "${personData.nom}"`);
    } catch (e) {
      console.warn(`Failed to set nom field:`, e);
    }
    
    // Land plot (parcelle) - using a default value
    try {
      const fieldName = `parcelle`;
      const field = form.getTextField(fieldName);
      const defaultParcelle = "AB-123456"; // Default value
      field.setText(defaultParcelle);
      console.log(`Successfully set ${fieldName} to "${defaultParcelle}"`);
    } catch (e) {
      console.warn(`Failed to set parcelle field:`, e);
    }
    
    // Phone number - using a default value
    try {
      const fieldName = `phone`;
      const field = form.getTextField(fieldName);
      const defaultPhone = "06 12 34 56 78"; // Default value
      field.setText(defaultPhone);
      console.log(`Successfully set ${fieldName} to "${defaultPhone}"`);
    } catch (e) {
      console.warn(`Failed to set phone field:`, e);
    }
    
    // First name
    try {
      const fieldName = `prénom`;
      const field = form.getTextField(fieldName);
      field.setText(personData.prenom);
      console.log(`Successfully set ${fieldName} to "${personData.prenom}"`);
    } catch (e) {
      console.warn(`Failed to set prénom field:`, e);
    }
    
    // City
    try {
      const fieldName = `ville`;
      const field = form.getTextField(fieldName);
      field.setText(personData.ville);
      console.log(`Successfully set ${fieldName} to "${personData.ville}"`);
    } catch (e) {
      console.warn(`Failed to set ville field:`, e);
    }
    
    // IMPORTANT: Flatten the form to make fields uneditable
    form.flatten();
    console.log("Form flattened - all fields converted to regular content");
    
    // Save the PDF with security settings to make it uneditable
    const pdfBytes = await pdfDoc.save({
      updateFieldAppearances: true,
      useObjectStreams: false
    });
    
    // Use the downloadPDF function with the custom filename
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
    alert('Une erreur est survenue lors de la génération du PDF: ' + errorMessage);
  }
};

// Function to generate Attestation Simplifiée PDF
const generateAttestationSimplifiee = async () => {
  try {
    console.log("Generating Attestation Simplifiée PDF");
    
    // Fetch the PDF template from public directory
    const formUrl = `${process.env.PUBLIC_URL || ''}/AS.pdf`;
    const formPdfBytes = await fetch(formUrl).then(res => {
      if (!res.ok) {
        throw new Error(`Failed to fetch PDF template: ${res.status} ${res.statusText}`);
      }
      return res.arrayBuffer();
    });
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();
    
    // Get all form fields for debugging
    const fields = form.getFields();
    console.log("Available PDF form fields:", fields.map(f => f.getName()));
    
    // Get current date and format it
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('fr-FR');
    
    // Use client data if available, otherwise use sample data
    const personData = indivisionData?.indivisaires[0] || {
      nom: clientName?.split(' ')[0] || 'Delacott',
      prenom: clientName?.split(' ')[1] || 'Michel',
      adresse: '15 rue de la République',
      codePostal: '75001',
      ville: 'Paris'
    };
    
    // Fill the specified fields
    
    // Last name
    try {
      const fieldName = `Nom`;
      const field = form.getTextField(fieldName);
      field.setText(personData.nom);
      console.log(`Successfully set ${fieldName} to "${personData.nom}"`);
    } catch (e) {
      console.warn(`Failed to set Nom field:`, e);
    }
    
    // First name
    try {
      const fieldName = `Prenom`;
      const field = form.getTextField(fieldName);
      field.setText(personData.prenom);
      console.log(`Successfully set ${fieldName} to "${personData.prenom}"`);
    } catch (e) {
      console.warn(`Failed to set Prenom field:`, e);
    }
    
    // Address
    try {
      const fieldName = `Adresse`;
      const field = form.getTextField(fieldName);
      field.setText(personData.adresse);
      console.log(`Successfully set ${fieldName} to "${personData.adresse}"`);
    } catch (e) {
      console.warn(`Failed to set Adresse field:`, e);
    }
    
    // Postal code
    try {
      const fieldName = `CodePostal`;
      const field = form.getTextField(fieldName);
      field.setText(personData.codePostal);
      console.log(`Successfully set ${fieldName} to "${personData.codePostal}"`);
    } catch (e) {
      console.warn(`Failed to set CodePostal field:`, e);
    }
    
    // City
    try {
      const fieldName = `Commune`;
      const field = form.getTextField(fieldName);
      field.setText(personData.ville);
      console.log(`Successfully set ${fieldName} to "${personData.ville}"`);
    } catch (e) {
      console.warn(`Failed to set Commune field:`, e);
    }
    
    // Date
    try {
      const fieldName = `date`;
      const field = form.getTextField(fieldName);
      field.setText(formattedDate);
      console.log(`Successfully set ${fieldName} to "${formattedDate}"`);
    } catch (e) {
      console.warn(`Failed to set date field:`, e);
    }
    
    // IMPORTANT: Flatten the form to make fields uneditable
    form.flatten();
    console.log("Form flattened - all fields converted to regular content");
    
    // Save the PDF with security settings to make it uneditable
    const pdfBytes = await pdfDoc.save({
      updateFieldAppearances: true,
      useObjectStreams: false
    });
    
    // Use the downloadPDF function with the custom filename
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
    alert('Une erreur est survenue lors de la génération du PDF: ' + errorMessage);
  }
};

  // Define the function with proper typing
  const generateAttestationIndivisionPDF = async (indivisionData: IndivisionData) => {
    try {
      console.log("Generating PDF with data:", JSON.stringify(indivisionData, null, 2));
      
      // Fetch the PDF template from public directory
      const formUrl = `${process.env.PUBLIC_URL || ''}/ATTESTATION_INDIV.pdf`;
      const formPdfBytes = await fetch(formUrl).then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch PDF template: ${res.status} ${res.statusText}`);
        }
        return res.arrayBuffer();
      });
      
      // Load the PDF document
      const pdfDoc = await PDFDocument.load(formPdfBytes);
      const form = pdfDoc.getForm();
      
      // Get all form fields for debugging
      const fields = form.getFields();
      console.log("Available PDF form fields:", fields.map(f => f.getName()));
      
      // Add proprietor type to the form
      try {
        const proprietaireTypeText = indivisionData.typeProprietaire === 'occupant' 
          ? 'Propriétaire occupant' 
          : 'Propriétaire bailleur';
        
        // Try multiple possible field names for proprietor type
        const possibconstypeFields = ['Champ-type-proprietaire', 'type-proprietaire', 'proprietaire_type'];
        for (const fieldName of possibconstypeFields) {
          try {
            const field = form.getTextField(fieldName);
            field.setText(proprietaireTypeText);
            console.log(`Successfully set ${fieldName} field`);
            break;
          } catch {
            console.log(`Field ${fieldName} not found, trying next option`);
          }
        }
      } catch (e) {
        console.warn('Failed to set proprietaire type:', e);
      }
      
      // Get current date and year info
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('fr-FR');
      const currentYearLastTwoDigits = currentDate.getFullYear().toString().slice(-2);
      
      // Set MPR year field (last 2 digits of current year)
      try {
        const fieldName = `MPR20`;
        const field = form.getTextField(fieldName);
        field.setText(currentYearLastTwoDigits);
        console.log(`Successfully set ${fieldName} to "${currentYearLastTwoDigits}"`);
      } catch (e) {
        console.warn(`Failed to set MPR20 field:`, e);
      }
      
      // Set client number field - fixed TypeScript error
      try {
        const fieldName = `numero`;
        const field = form.getTextField(fieldName);
        // Use 123654 as default client number since clientNumber is not in the type
        const clientNumber = "123654";
        field.setText(clientNumber);
        console.log(`Successfully set ${fieldName} to "${clientNumber}"`);
      } catch (e) {
        console.warn(`Failed to set numero field:`, e);
      }
      
      // Set current date field
      try {
        const fieldName = `date`;
        const field = form.getTextField(fieldName);
        field.setText(formattedDate);
        console.log(`Successfully set ${fieldName} to "${formattedDate}"`);
      } catch (e) {
        console.warn(`Failed to set date field:`, e);
      }
      
      // Fill in fields for each indivisaire
      indivisionData.indivisaires.forEach((indivisaire, index) => {
        // Skip empty entries
        if (!indivisaire.nom.trim() && !indivisaire.prenom.trim()) return;
        
        console.log(`Filling data for indivisaire ${index}:`, indivisaire);
        
        // Create combined address string
        const combinedAddress = `${indivisaire.adresse}, ${indivisaire.codePostal} ${indivisaire.ville}`;
        
        // COMBINED FIELD 1: Combine nom, prénom et date de naissance
        try {
          const fieldName = `nom, prénom et date de naissance`;
          const field = form.getTextField(fieldName);
          const combinedValue = `${indivisaire.nom} ${indivisaire.prenom}, né(e) le ${indivisaire.dateNaissance}`;
          field.setText(combinedValue);
          console.log(`Successfully set ${fieldName} to "${combinedValue}"`);
        } catch (e) {
          console.warn(`Failed to set combined name field for indivisaire ${index}:`, e);
        }
        
        // COMBINED FIELD 2: Combine address fields for lieu de résidence principale
        try {
          const fieldName = `lieu de résidence principale`;
          const field = form.getTextField(fieldName);
          field.setText(combinedAddress);
          console.log(`Successfully set ${fieldName} to "${combinedAddress}"`);
        } catch (e) {
          console.warn(`Failed to set combined address field for indivisaire ${index}:`, e);
        }
        
        // COMBINED FIELD 3: Address for indivision property field for this indivisaire
        try {
          const fieldName = `adresse du bien appartenant à l’indivision 1`;
          const field = form.getTextField(fieldName);
          field.setText(combinedAddress);
          console.log(`Successfully set ${fieldName} to "${combinedAddress}"`);
        } catch (e) {
          console.warn(`Failed to set indivision address field ${index + 1}:`, e);
        }
        
        // Set Nom, prénom field
        try {
          const fieldName = `Nom, prénom`;
          const field = form.getTextField(fieldName);
          const fullName = `${indivisaire.nom} ${indivisaire.prenom}`;
          field.setText(fullName);
          console.log(`Successfully set ${fieldName} to "${fullName}"`);
        } catch (e) {
          console.warn(`Failed to set Nom, prénom field:`, e);
        }
        
        // Set lieu field with ville
        try {
          const fieldName = `lieu`;
          const field = form.getTextField(fieldName);
          field.setText(indivisaire.ville);
          console.log(`Successfully set ${fieldName} to "${indivisaire.ville}"`);
        } catch (e) {
          console.warn(`Failed to set lieu field:`, e);
        }
      });
      
      // IMPORTANT: Flatten the form to make fields uneditable
      form.flatten();
      console.log("Form flattened - all fields converted to regular content");
      
      // Save the PDF with security settings to make it uneditable
      const pdfBytes = await pdfDoc.save({
        updateFieldAppearances: true,
        useObjectStreams: false
      });
      
      // Use the downloadPDF function with the custom filename
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
      alert('Une erreur est survenue lors de la génération du PDF: ' + errorMessage);
    }
  };

  // Add this new function to generate the Attestation Propriétaire bailleur PDF
const generateAttestationProprietaireBailleurPDF = async (indivisionData: IndivisionData) => {
  try {
    console.log("Generating Attestation Propriétaire bailleur PDF with data:", JSON.stringify(indivisionData, null, 2));
    
    // Fetch the PDF template from public directory
    const formUrl = `${process.env.PUBLIC_URL || ''}/ATTESTATION_PROP.pdf`;
    const formPdfBytes = await fetch(formUrl).then(res => {
      if (!res.ok) {
        throw new Error(`Failed to fetch PDF template: ${res.status} ${res.statusText}`);
      }
      return res.arrayBuffer();
    });
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();
    
    // Get all form fields for debugging
    const fields = form.getFields();
    console.log("Available PDF form fields:", fields.map(f => f.getName()));
    
    // Get current date and year info
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('fr-FR');
    
    // Use the first indivisaire's data if available
    const firstIndivisaire = indivisionData.indivisaires[0] || {
      nom: '',
      prenom: '',
      dateNaissance: '',
      adresse: '',
      codePostal: '',
      ville: ''
    };
    
    // Fill the specified fields
    
    // Name, first name and birth date
    try {
      const fieldName = `nom, prénom`;
      const field = form.getTextField(fieldName);
      const combinedValue = `${firstIndivisaire.nom} ${firstIndivisaire.prenom}, né(e) le ${firstIndivisaire.dateNaissance}`;
      field.setText(combinedValue);
      console.log(`Successfully set ${fieldName} to "${combinedValue}"`);
    } catch (e) {
      console.warn(`Failed to set nom et prénom et date de naissance field:`, e);
    }
    
    // MPR field
    try {
      const fieldName = `MPR`;
      const field = form.getTextField(fieldName);
      const mprNumber = "123654"; // Use fallback as specified
      field.setText(mprNumber);
      console.log(`Successfully set ${fieldName} to "${mprNumber}"`);
    } catch (e) {
      console.warn(`Failed to set MPR field:`, e);
    }
    
    // Address line 1
    try {
      const fieldName = `adresse complète avec le numéro d'appart`;
      const field = form.getTextField(fieldName);
      const address = firstIndivisaire.adresse;
      field.setText(address);
      console.log(`Successfully set ${fieldName} to "${address}"`);
    } catch (e) {
      console.warn(`Failed to set address field:`, e);
    }
    
    // Address line 2
    try {
      const fieldName = `adresse complète avec numéro d'appart suite`;
      const field = form.getTextField(fieldName);
      const addressLine2 = `${firstIndivisaire.codePostal} ${firstIndivisaire.ville}`;
      field.setText(addressLine2);
      console.log(`Successfully set ${fieldName} to "${addressLine2}"`);
    } catch (e) {
      console.warn(`Failed to set address line 2 field:`, e);
    }
    
    // City
    try {
      const fieldName = `ville`;
      const field = form.getTextField(fieldName);
      field.setText(firstIndivisaire.ville);
      console.log(`Successfully set ${fieldName} to "${firstIndivisaire.ville}"`);
    } catch (e) {
      console.warn(`Failed to set ville field:`, e);
    }
    
    // Date
    try {
      const fieldName = `date`;
      const field = form.getTextField(fieldName);
      field.setText(formattedDate);
      console.log(`Successfully set ${fieldName} to "${formattedDate}"`);
    } catch (e) {
      console.warn(`Failed to set date field:`, e);
    }
    
    // IMPORTANT: Flatten the form to make fields uneditable
    form.flatten();
    console.log("Form flattened - all fields converted to regular content");
    
    // Save the PDF with security settings to make it uneditable
    const pdfBytes = await pdfDoc.save({
      updateFieldAppearances: true,
      useObjectStreams: false,
      // Removed unsupported permissions property
    });
    
    // Use the downloadPDF function with the custom filename
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
    alert('Une erreur est survenue lors de la génération du PDF: ' + errorMessage);
  }
};

// Function to generate Cession de créance de RENOLIB PDF
const generateCessionCreanceRenolibPDF = async () => {
  try {
    console.log("Generating Cession de créance de RENOLIB PDF");
    
    // Fetch the PDF template from public directory
    const formUrl = `${process.env.PUBLIC_URL || ''}/Cession_RENOLIB.pdf`;
    const formPdfBytes = await fetch(formUrl).then(res => {
      if (!res.ok) {
        throw new Error(`Failed to fetch PDF template: ${res.status} ${res.statusText}`);
      }
      return res.arrayBuffer();
    });
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();
    
    // Get all form fields for debugging
    const fields = form.getFields();
    console.log("Available PDF form fields:", fields.map(f => f.getName()));
    
    // Use client data if available, otherwise use sample data
    const personName = clientName || 'Dupont Jean';
    
    // Use quote data
    const amount = totals.totalTTC ? `${totals.totalTTC.toFixed(2)} €` : '5000.00 €';
    const quoteNum = quoteNumber || 'DEVIS-2025-001';
    
    // Fill the specified fields
    
    // Client name
    try {
      const fieldName = `Nom`;
      const field = form.getTextField(fieldName);
      field.setText(personName);
      console.log(`Successfully set ${fieldName} to "${personName}"`);
    } catch (e) {
      console.warn(`Failed to set Nom field:`, e);
    }
    
    // Amount
    try {
      const fieldName = `montant`;
      const field = form.getTextField(fieldName);
      field.setText(amount);
      console.log(`Successfully set ${fieldName} to "${amount}"`);
    } catch (e) {
      console.warn(`Failed to set montant field:`, e);
    }
    
    // Quote number
    try {
      const fieldName = `numero-devis`;
      const field = form.getTextField(fieldName);
      field.setText(quoteNum);
      console.log(`Successfully set ${fieldName} to "${quoteNum}"`);
    } catch (e) {
      console.warn(`Failed to set numero-devis field:`, e);
    }
    
    // IMPORTANT: Flatten the form to make fields uneditable
    form.flatten();
    console.log("Form flattened - all fields converted to regular content");
    
    // Save the PDF with security settings to make it uneditable
    const pdfBytes = await pdfDoc.save({
      updateFieldAppearances: true,
      useObjectStreams: false
    });
    
    // Use the downloadPDF function with the custom filename
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
    alert('Une erreur est survenue lors de la génération du PDF: ' + errorMessage);
  }
};

// Function to generate DP Mairie PDF
const generateDPMairiePDF = async () => {
  try {
    console.log("Generating DP Mairie PDF");
    
    // Fetch the PDF template from public directory
    const formUrl = `${process.env.PUBLIC_URL || ''}/DP_Mairie.pdf`;
    const formPdfBytes = await fetch(formUrl).then(res => {
      if (!res.ok) {
        throw new Error(`Failed to fetch PDF template: ${res.status} ${res.statusText}`);
      }
      return res.arrayBuffer();
    });
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    
    // Save the PDF
    const pdfBytes = await pdfDoc.save({
      updateFieldAppearances: true,
      useObjectStreams: false
    });
    
    // Use the downloadPDF function with the custom filename
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
    alert('Une erreur est survenue lors de la génération du PDF: ' + errorMessage);
  }
};

// Function to generate DAACT PDF
const generateDAACTPDF = async () => {
  try {
    console.log("Generating DAACT PDF");
    
    // Fetch the PDF template from public directory
    const formUrl = `${process.env.PUBLIC_URL || ''}/DAACT.pdf`;
    const formPdfBytes = await fetch(formUrl).then(res => {
      if (!res.ok) {
        throw new Error(`Failed to fetch PDF template: ${res.status} ${res.statusText}`);
      }
      return res.arrayBuffer();
    });
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    
    // Save the PDF
    const pdfBytes = await pdfDoc.save({
      updateFieldAppearances: true,
      useObjectStreams: false
    });
    
    // Use the downloadPDF function with the custom filename
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
    alert('Une erreur est survenue lors de la génération du PDF: ' + errorMessage);
  }
};

// Function to generate ENEDIS PDF
const generateENEDISPDF = async () => {
  try {
    console.log("Generating ENEDIS PDF");
    
    // Fetch the PDF template from public directory
    const formUrl = `${process.env.PUBLIC_URL || ''}/Enedis_.pdf`;
    const formPdfBytes = await fetch(formUrl).then(res => {
      if (!res.ok) {
        throw new Error(`Failed to fetch PDF template: ${res.status} ${res.statusText}`);
      }
      return res.arrayBuffer();
    });
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    
    // Save the PDF
    const pdfBytes = await pdfDoc.save({
      updateFieldAppearances: true,
      useObjectStreams: false
    });
    
    // Use the downloadPDF function with the custom filename
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');

    
  } catch (error) {
    console.error('Error generating PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
    alert('Une erreur est survenue lors de la génération du PDF: ' + errorMessage);
  }
};

// Function to generate ECO-PTZ PDF
const generateECOPTZPDF = async () => {
  try {
    console.log("Generating ECO-PTZ PDF");
    
    // Fetch the PDF template from public directory
    const formUrl = `${process.env.PUBLIC_URL || ''}/ECO-PTZ.pdf`;
    const formPdfBytes = await fetch(formUrl).then(res => {
      if (!res.ok) {
        throw new Error(`Failed to fetch PDF template: ${res.status} ${res.statusText}`);
      }
      return res.arrayBuffer();
    });
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();
    
    // Get all form fields for debugging
    const fields = form.getFields();
    console.log("Available PDF form fields:", fields.map(f => f.getName()));
    
    // Get current date and format it
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('fr-FR');
    
    // Fill date field
    try {
      const fieldName = `date`;
      const field = form.getTextField(fieldName);
      field.setText(formattedDate);
      console.log(`Successfully set ${fieldName} to "${formattedDate}"`);
    } catch (e) {
      console.warn(`Failed to set date field:`, e);
    }
    
    // IMPORTANT: Flatten the form to make fields uneditable
    form.flatten();
    console.log("Form flattened - all fields converted to regular content");
    
    // Save the PDF with security settings to make it uneditable
    const pdfBytes = await pdfDoc.save({
      updateFieldAppearances: true,
      useObjectStreams: false
    });
    
    // Use the downloadPDF function with the custom filename
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
    alert('Une erreur est survenue lors de la génération du PDF: ' + errorMessage);
  }
};

// Function to generate Mandat de perception de fond EFFY PDF
const generateMandatPerceptionEffyPDF = async () => {
  try {
    console.log("Generating Mandat de perception de fond EFFY PDF");
    
    // Fetch the PDF template from public directory
    const formUrl = `${process.env.PUBLIC_URL || ''}/Checklist_Effy.pdf`;
    const formPdfBytes = await fetch(formUrl).then(res => {
      if (!res.ok) {
        throw new Error(`Failed to fetch PDF template: ${res.status} ${res.statusText}`);
      }
      return res.arrayBuffer();
    });
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    
    // Save the PDF
    const pdfBytes = await pdfDoc.save({
      updateFieldAppearances: true,
      useObjectStreams: false
    });
    
    // Use the downloadPDF function with the custom filename
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
    alert('Une erreur est survenue lors de la génération du PDF: ' + errorMessage);
  }
};

// Function to generate CGV (Conditions générales de vente) PDF
const generateCGVPDF = async () => {
  try {
    console.log("Generating CGV PDF");
    
    // Fetch the PDF template from public directory
    const formUrl = `${process.env.PUBLIC_URL || ''}/CGV.pdf`;
    const formPdfBytes = await fetch(formUrl).then(res => {
      if (!res.ok) {
        throw new Error(`Failed to fetch PDF template: ${res.status} ${res.statusText}`);
      }
      return res.arrayBuffer();
    });
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    
    // Save the PDF
    const pdfBytes = await pdfDoc.save({
      updateFieldAppearances: true,
      useObjectStreams: false
    });
    
    // Use the downloadPDF function with the custom filename
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
    alert('Une erreur est survenue lors de la génération du PDF: ' + errorMessage);
  }
};

  // Function to generate other document types
const generateDocument = (documentType: string) => {
  switch (documentType) {
    case 'dp-mairie':
      // Generate DP Mairie document
      generateDPMairiePDF();
      break;
    case 'daact':
      // Generate DAACT document
      generateDAACTPDF();
      break;
    case 'enedis':
      // Generate ENEDIS document
      generateENEDISPDF();
      break;
    case 'eco-ptz':
      // Generate ECO-PTZ document
      generateECOPTZPDF();
      break;
    case 'attestation-proprietaire-bailleur':
      // Generate Attestation Propriétaire bailleur
      if (indivisionData) {
        console.log("Generating attestation propriétaire bailleur with data:", indivisionData);
        generateAttestationProprietaireBailleurPDF(indivisionData);
      } else {
        // Use sample data until API is available
        const sampleIndivisionData = {
          typeProprietaire: 'bailleur',
          indivisaires: [
            {
              nom: 'Martin',
              prenom: 'Pierre',
              dateNaissance: '10/03/1975',
              adresse: '15 avenue Victor Hugo',
              codePostal: '75016',
              ville: 'Paris'
            }
          ]
        };
        console.log("Using sample proprietaire bailleur data:", sampleIndivisionData);
        generateAttestationProprietaireBailleurPDF(sampleIndivisionData as IndivisionData);
      }
      break;
    case 'attestation-indivision':
      // Generate filled Attestation d'indivision
      if (indivisionData) {
        console.log("Generating attestation d'indivision with data:", indivisionData);
        generateAttestationIndivisionPDF(indivisionData);
      } else {
        // Use sample data until API is available
        const sampleIndivisionData = {
          typeProprietaire: 'occupant',
          indivisaires: [
            {
              nom: 'Dupont',
              prenom: 'Jean',
              dateNaissance: '01/01/1980',
              adresse: '10 rue de la Paix',
              codePostal: '75001',
              ville: 'Paris'
            },
            {
              nom: 'Durand',
              prenom: 'Marie',
              dateNaissance: '15/05/1982',
              adresse: '10 rue de la Paix',
              codePostal: '75001',
              ville: 'Paris'
            }
          ]
        };
        console.log("Using sample indivision data:", sampleIndivisionData);
        generateAttestationIndivisionPDF(sampleIndivisionData as IndivisionData);
      }
      break;
    case 'Attestation de Fin des Travaux': // Make sure this matches the ID in the items array
      // Generate Attestation de Fin des Travaux
      generateAttestationFinTravauxPDF();
      break;
    case 'Attestation mise en service ECOLOGY\'B': // Add the new case
      // Generate Attestation mise en service ECOLOGY'B
      generateAttestationMiseEnServicePDF();
      break;
    case 'Attestation Simplifiée': // Add the new Attestation Simplifiée case
      // Generate Attestation Simplifiée
      generateAttestationSimplifiee();
      break;
    case 'Cession de créance de RENOLIB': // Add the new Cession de créance case
      // Generate Cession de créance de RENOLIB
      generateCessionCreanceRenolibPDF();
      break;
    case 'Conditions générales de vente':
      // Generate CGV document
      generateCGVPDF();
      break;
    case 'Mandat de perception de fond EFFY':
      // Generate Mandat de perception de fond EFFY document
      generateMandatPerceptionEffyPDF();
      break;
    default:
      alert(`Génération de document "${documentType}" à implémenter.`);
  }
  setDropdownVisible(false);
};

  // Group documents by category for better organization but with standardized icon colors
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
        { id: "sizing-note", label: "Note de dimensionnement", icon: <DocumentCheckIcon className="h-4 w-4 text-blue-500" />, action: handleGenerateSizingNotePDF }
      ] : []
    },
    {
      name: "Documents administratifs",
      items: [
        { id: "dossier-cee", label: "Dossier CEE", icon: <DocumentCheckIcon className="h-4 w-4 text-blue-500" />, action: () => generateDocument("Dossier CEE") },
        { id: "courrier-rac", label: "Courrier de prise en charge du RAC", icon: <DocumentCheckIcon className="h-4 w-4 text-blue-500" />, action: () => generateDocument("Courrier de prise en charge du RAC") },
        { id: "attestation-fin", label: "Attestation de Fin des Travaux", icon: <DocumentCheckIcon className="h-4 w-4 text-blue-500" />, action: () => generateDocument("Attestation de Fin des Travaux") },
        { id: "attestation-mise-service", label: "Attestation mise en service ECOLOGY'B", icon: <DocumentCheckIcon className="h-4 w-4 text-blue-500" />, action: () => generateDocument("Attestation mise en service ECOLOGY'B") },
        { id: "attestation-simplifiee", label: "Attestation Simplifiée", icon: <DocumentCheckIcon className="h-4 w-4 text-blue-500" />, action: () => generateDocument("Attestation Simplifiée") },
        { id: "enedis", label: "ENEDIS", icon: <DocumentCheckIcon className="h-4 w-4 text-blue-500" />, action: () => generateDocument("enedis") }
      ]
    },
    {
      name: "Documents financiers",
      items: [
        { id: "cession-creance", label: "Cession de créance de RENOLIB", icon: <DocumentCheckIcon className="h-4 w-4 text-blue-500" />, action: () => generateDocument("Cession de créance de RENOLIB") },
        { id: "eco-ptz", label: "ECO-PTZ", icon: <DocumentCheckIcon className="h-4 w-4 text-blue-500" />, action: () => generateDocument("eco-ptz") },
        { id: "mandat-perception", label: "Mandat de perception de fond EFFY", icon: <DocumentCheckIcon className="h-4 w-4 text-blue-500" />, action: () => generateDocument("Mandat de perception de fond EFFY") },
        { id: "cgv", label: "Conditions générales de vente", icon: <DocumentCheckIcon className="h-4 w-4 text-blue-500" />, action: () => generateDocument("Conditions générales de vente") }
      ]
    }
  ];

  // Add DP Mairie category if dpMairieData exists
  if (dpMairieData) {
    const dpMairieCategory = {
      name: "Documents d'urbanisme",
      items: [
        { id: "dp-mairie", label: "DP Mairie", icon: <BuildingLibraryIcon className="h-4 w-4 text-blue-500" />, action: () => generateDocument("dp-mairie") }
      ]
    };
    
    // Add DAACT document if numeroDeclarationPrealable exists
    if (dpMairieData.numeroDeclarationPrealable) {
      dpMairieCategory.items.push({
        id: "daact", 
        label: "Déclaration d'achèvement (DAACT)", 
        icon: <DocumentCheckIcon className="h-4 w-4 text-blue-500" />, 
        action: () => generateDocument("daact")
      });
    }
    
    documentCategories.push(dpMairieCategory);
  }

  // Always add the indivision category to documentCategories
const indivisionCategory = {
  name: "Documents d'indivision",
  items: [
    { 
      id: "attestation-indivision", 
      label: "Attestation d'indivision", 
      icon: <UserGroupIcon className="h-4 w-4 text-blue-500" />, 
      action: () => generateDocument("attestation-indivision") 
    }
  ]
};

// Only conditionally add the proprietaire-bailleur document if we know it's needed
if (indivisionData?.typeProprietaire === "bailleur") {
  indivisionCategory.items.push({
    id: "attestation-proprietaire-bailleur", 
    label: "Attestation Propriétaire bailleur", 
    icon: <DocumentCheckIcon className="h-4 w-4 text-blue-500" />, 
    action: () => generateDocument("attestation-proprietaire-bailleur")
  });
}

// Always add this category
documentCategories.push(indivisionCategory);

  // Flatten all document items from all categories into a single array
  const allDocuments = documentCategories.flatMap(category => category.items);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main button with enhanced styling */}
      <button
        onClick={toggleDropdown}
        className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
      >
        <DocumentTextIcon className="h-5 w-5" />
        <span className="font-medium">Générer des documents PDF</span>
        <ChevronDownIcon className={`h-5 w-5 ml-1 transition-transform duration-300 ${dropdownVisible ? 'rotate-180' : ''}`} />
      </button>
  
      {/* Enhanced dropdown with improved positioning and responsive behavior */}
      {dropdownVisible && (
        <div
          className={`
            absolute 
            bottom-full 
            sm:left-0 
            left-0 
            right-0
            sm:right-auto
            mb-3 
            z-50 
            w-[98%]
            mx-auto
            sm:mx-0
            max-h-[90vh] 
            bg-white 
            rounded-xl 
            shadow-2xl 
            border 
            border-gray-100 
            overflow-hidden 
            flex 
            md:flex-row
            flex-col
            transition-all 
            duration-300 
            ease-in-out
            origin-top-left
            ${hoveredDocId ? 'lg:w-[900px] md:w-[700px] animate-expand' : 'lg:w-[320px] md:w-[300px]'} 
          `}
          style={{
            animation: 'fadeIn 0.2s ease-out',
          }}
          onMouseLeave={() => setHoveredDocId(null)}
        >
          {/* LEFT COLUMN: Categories and document list */}
          <div className={`
            flex 
            flex-col 
            md:w-80
            w-full
            md:max-w-none
            md:border-r 
            border-b
            md:border-b-0
            border-gray-200 
            ${!hoveredDocId ? 'w-full' : ''}
          `}>
            {/* Header with glass morphism effect */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
              <h3 className="font-semibold text-gray-800">Documents disponibles</h3>
              <button
                onClick={() => setDropdownVisible(false)}
                className="text-gray-500 hover:text-gray-800 rounded-full p-1 hover:bg-gray-200 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
  
            {/* Scrollable documents without category headers */}
            <div className="p-2 overflow-y-auto flex-1 max-h-[50vh] md:max-h-[70vh]">
              <div className="space-y-1">
                {/* Flatten all items from all categories into a single list */}
                {documentCategories.flatMap(category => category.items).map((item) => (
                  <div
                    key={item.id}
                    className={`px-3 py-2.5 cursor-pointer rounded-lg text-sm flex items-center gap-3 transition-all ${hoveredDocId === item.id ? 'bg-purple-100 text-purple-800' : 'hover:bg-gray-100 text-gray-700'}`}
                    onMouseEnter={() => setHoveredDocId(item.id)}
                    onClick={item.action}
                  >
                    <div className={`p-1.5 rounded-md ${hoveredDocId === item.id ? 'bg-purple-200' : 'bg-gray-100'}`}>
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                    
                    {/* Preview indicator */}
                    {hoveredDocId === item.id && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-auto text-purple-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick actions footer */}
            <div className="border-t border-gray-200 p-3">
              <div className="text-xs text-gray-500 mb-2">Actions rapides</div>
              <div className="flex flex-wrap gap-2">
                <button 
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 flex items-center gap-1 transition-colors"
                  onClick={() => handleGenerateDevisPDF()}
                >
                  <DocumentIcon className="h-3.5 w-3.5" />
                  <span>Générer devis</span>
                </button>
                <button 
                  className="px-3 py-1.5 text-xs bg-purple-100 hover:bg-purple-200 rounded-md text-purple-700 flex items-center gap-1 transition-colors"
                  onClick={() => generateCGVPDF()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span>CGV</span>
                </button>
                {!hoveredDocId && (
                  <button 
                    className="px-3 py-1.5 text-xs bg-blue-50 hover:bg-blue-100 rounded-md text-blue-700 flex items-center gap-1 transition-colors md:hidden"
                    onClick={() => setHoveredDocId(allDocuments[0]?.id || null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Voir aperçu</span>
                  </button>
                )}
              </div>
            </div>
          </div>
  
          {/* RIGHT COLUMN: Enhanced PDF Preview - Only shown when hovering on desktop, or clicking "Voir aperçu" on mobile */}
          <div className={`
            flex-1 
            flex 
            flex-col 
            bg-gray-50 
            relative 
            ${hoveredDocId ? 'animate-slideIn md:w-auto' : 'md:hidden w-0 overflow-hidden'}
            ${hoveredDocId ? 'block' : 'hidden md:flex'}
            min-h-[250px]
            md:min-h-0
            transition-[width] duration-300 ease-in-out
          `}>
            {!hoveredDocId ? (
              <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-6">
                <div className="text-center">
                  <DocumentTextIcon className="h-20 w-20 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Aperçu du document</h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto md:block hidden">
                    Passez la souris sur un document dans la liste pour afficher l&apos;aperçu
                  </p>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto md:hidden block">
                    Sélectionnez un document pour voir son aperçu
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Preview header with responsive design */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-medium text-gray-700 flex items-center truncate max-w-[180px] md:max-w-none">
                    <DocumentIcon className="h-4 w-4 mr-2 flex-shrink-0 text-gray-500" />
                    <span className="truncate">{allDocuments.find(doc => doc.id === hoveredDocId)?.label || 'Aperçu du document'}</span>
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full hidden md:inline-block">Aperçu</span>
                    <button 
                      className="md:hidden px-2 py-1 bg-gray-100 rounded-md text-gray-500 flex items-center"
                      onClick={() => setHoveredDocId(null)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                      </svg>
                      <span className="text-xs ml-1">Retour</span>
                    </button>
                    <button 
                      className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md font-medium flex items-center gap-1 transition-colors text-xs sm:text-sm"
                      onClick={() => {
                        const selectedDoc = allDocuments.find(doc => doc.id === hoveredDocId);
                        if (selectedDoc && selectedDoc.action) {
                          selectedDoc.action();
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                      </svg>
                      <span>Générer</span>
                    </button>
                  </div>
                </div>

  
                {/* PDF iframe with better styling and responsive design */}
                <div className="relative flex-1 w-full overflow-hidden">
                  <div className="absolute inset-0 shadow-inner">
                    {pdfPreviewPaths[hoveredDocId] === null ? (
                      // Custom "Under Construction" message when no preview is available
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-6">
                        <div className="p-4 rounded-full bg-purple-100 mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-purple-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Aperçu en Construction</h3>
                        <p className="text-sm text-gray-600 text-center max-w-md mb-3">
                          L&apos;aperçu de ce document sera disponible très prochainement avec une mise en page et un contenu optimisés.
                        </p>
                        <div className="text-xs px-3 py-1 bg-purple-50 text-purple-700 rounded-full">
                          Disponible bientôt
                        </div>
                      </div>
                    ) : (
                      // Regular iframe when a preview is available
                      <iframe
                        title="PDF Preview"
                        src={pdfPreviewPaths[hoveredDocId] || ""}
                        className="w-full h-full border-0"
                        style={{
                          backgroundColor: '#f5f5f5',
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Loading overlay - conditionally shown while loading */}
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 pointer-events-none" 
                      style={{ opacity: 0.8, animation: 'fadeOut 1s forwards 0.5s' }}>
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mb-3"></div>
                      <p className="text-purple-700">Chargement...</p>
                    </div>
                  </div>
                </div>
  
                {/* PDF info footer - simplified on mobile */}
                <div className="bg-white border-t border-gray-200 px-3 py-2 flex items-center justify-between text-xs text-gray-600">
                  <span className="hidden sm:inline">Format: PDF</span>
                  <span className="truncate max-w-[160px] sm:max-w-none">
                    {allDocuments.find(doc => doc.id === hoveredDocId)?.label || hoveredDocId}
                  </span>
                  <span className="text-gray-500 hidden sm:inline">Cliquez pour générer</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
  
      {/* Add CSS for animations */}
            <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(20px); width: 0; }
            to { opacity: 1; transform: translateX(0); width: auto; }
          }
          @keyframes fadeOut {
            from { opacity: 0.8; }
            to { opacity: 0; }
          }
          @keyframes expand {
            from { width: 320px; }
            to { width: 900px; }
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }
          .animate-expand {
            animation: expand 0.3s ease-in-out forwards;
          }
        `
      }} />
    </div>
  );
};

export default PDFGenerator;