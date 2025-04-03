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