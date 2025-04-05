// Type definitions for the PDF Generator

export interface SizingNote {
    id?: string;
    productType: string;
    productBrand: string;
    productReference: string;
    volume: string;
    heatLoss: string;
    dimensioning: string;
    coverage: number;
    constructionCoef?: number;
    buildingType: string;
    radiatorType: string;
    waterTemperature: string;
    heatedArea: string;
    ceilingHeight: string;
    baseTemperature: number;
    desiredTemperature: number;
    altitude: number;
  }
  
  export interface TableItem {
    reference: string;
    name: string;
    quantity: number;
    unitPriceHT: number;
    tva: number;
    totalHT: number;
  }
  
  export interface FinancialTotals {
    totalHT: number;
    totalTTC: number;
    primeCEE: number;
    primeRenov: number;
    remaining: number;
  }
  
  export type DocumentType = "devis" | "facture";
  export type DocumentStatus = "brouillon" | "envoyé" | "signé" | "payé" | "refusé" | "expiré";
  export type SignatureStatus = "non_demandé" | "en_attente" | "signé" | "refusé";
  
  export interface Document {
    id: string;
    type: DocumentType;
    reference: string;
    clientId: string;
    clientName: string;
    dateCreation: string;
    dateExpiration?: string;
    dateDue?: string;
    montant: string;
    status: DocumentStatus;
    signatureStatus: SignatureStatus;
    signatureDate?: string;
    fileUrl: string;
  }

  // Add this to your existing types.ts file

// Define FinancingData interface for the financing modal
export interface FinancingData {
  bankName: string;
  fixedRate: string;
  paymentAmountWithInsurance: string;
  loanAmount: string;
  annualPercentageRate: string;
  paymentAmountWithoutInsurance: string;
  frequency: string;
  deferredMonths: string;
  numberOfPayments: string;
  personalContribution: string;
  totalAmountDue: string;
  sellerName: string;
}

// Add this to your types.ts file

export interface DPMairieData {
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

// Indivision types to be added to your types.ts file

export interface Indivisaire {
  nom: string;
  prenom: string;
  dateNaissance: string;
  adresse: string;
  codePostal: string;
  ville: string;
}

export interface IndivisionData {
  typeProprietaire: "occupant" | "bailleur";
  indivisaires: Indivisaire[];
}

// Define TypeScript interface for incentives data
export interface IncentivesData {
  primeCEE: string;
  remiseExceptionnelle: string;
  primeMPR: string;
  montantPriseEnChargeRAC: string;
  activiteMaPrimeRenov: boolean;
  acompte: string;
}
