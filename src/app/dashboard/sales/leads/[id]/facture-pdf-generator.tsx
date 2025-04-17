// Facture (Invoice) PDF Generator Module
// Based on the Devis PDF Generator with invoice-specific modifications

// Import utilities from pdf-utils
import { 
  formatDate, 
  getCommonStyles, 
  getCompanyHeader, 
  getCompanyFooter,
} from './pdf-utils';

// Store custom filename
let customFilename = "";

/**
 * Sets a custom filename to be used for the next PDF generation
 * @param filename The custom filename to use (without extension)
 */
export const setCustomFilename = (filename: string) => {
  customFilename = filename;
};

/**
 * Gets the current custom filename
 * @returns The current custom filename
 */
export const getCustomFilename = () => {
  return customFilename;
};

// Define proper interfaces to replace 'any' types
interface TableItem {
  reference: string;
  name: string;
  quantity: number;
  unitPriceHT: number;
  tva: number;
  totalHT: number;
  id?: string;
}

interface IncentivesData {
  primeCEE: string;
  remiseExceptionnelle: string;
  primeMPR: string;
  montantPriseEnChargeRAC: string;
  activiteMaPrimeRenov: boolean;
  acompte: string;
}

interface FinancialTotals {
  totalHT: number;
  totalTTC: number;
  primeCEE?: number;
  primeRenov?: number;
  remaining: number;
}

interface FinancingData {
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

// Function to get the deal name from the deal ID
const getDealName = (dealId?: string): string => {
  if (!dealId) return '';
  
  // Map of deal IDs to their display names
  const dealMap: {[key: string]: string} = {
    'CEE': 'CEE',
    'EFFY': 'EFFY'
    // Add more deals here as needed
  };
  
  return dealMap[dealId] || dealId;
};

// ===== IMPROVED LAYOUT COMPONENTS FOR INVOICE =====

// Update the getCustomerAndInvoiceInfo function with improved spacing and typography
const getCustomerAndInvoiceInfo = (
  clientName: string, 
  invoiceNumber: string, 
  invoiceDate: string, 
  quoteNumber: string,
  quoteDate: string,
  paymentDueDate?: string,
  installationDate?: string,
  workCompletionDate?: string,
  dealId?: string,
  clientDetails?: {
    street?: string,
    postalCode?: string,
    city?: string,
    cadastralParcel?: string,
    phoneNumber?: string,
    zone?: string,
    houseType?: string,
    houseAge?: string,
    precarity?: string,
    heatingType?: string,
    dwellingType?: string,
    clientNumber?: string,
    subcontractor?: {
      name?: string,
      address?: string,
      leader?: string,
      siret?: string,
      decennialNumber?: string,
      qualifications?: string[]
    }
  }
) => `
  <!-- Client and Invoice Info -->
  <div class="info-grid">
    <div class="info-box client-box">
      <h3 class="box-title" style="margin-bottom: 2mm;">FACTURE : ${invoiceNumber}</h3>
      <div style="font-size: 11px; margin-bottom: 4mm; padding-bottom: 2mm; border-bottom: 1px solid rgba(0,0,0,0.05);">
        Numéro client : ${clientDetails?.clientNumber || 'N/A'}
      </div>
      <div class="info-row">
        <div class="info-label">Date de facture</div>
        <div class="info-value">${formatDate(invoiceDate)}</div>
      </div>
      
      <div class="info-row">
        <div class="info-label">N° de devis</div>
        <div class="info-value">${quoteNumber}</div>
      </div>
      
      <div class="info-row">
        <div class="info-label">Date du devis</div>
        <div class="info-value">${formatDate(quoteDate)}</div>
      </div>
      
      ${paymentDueDate ? `
      <div class="info-row">
        <div class="info-label">Date d'échéance</div>
        <div class="info-value">${formatDate(paymentDueDate)}</div>
      </div>
      ` : ''}

      ${installationDate ? `
      <div class="info-row">
        <div class="info-label">Date de pose</div>
        <div class="info-value">${formatDate(installationDate)}</div>
      </div>
      ` : ''}

      ${workCompletionDate ? `
      <div class="info-row">
        <div class="info-label">Fin des travaux</div>
        <div class="info-value">${formatDate(workCompletionDate)}</div>
      </div>
      ` : ''}
      
      ${clientDetails?.subcontractor ? `
      <div class="info-row">
        <div class="info-label">Travaux sous-traités</div>
        <div class="info-value">
          <strong>${clientDetails.subcontractor.name}</strong><br>
          ${clientDetails.subcontractor.address}<br>
          Dirigeant : ${clientDetails.subcontractor.leader}<br>
          N° de Siret : ${clientDetails.subcontractor.siret}<br>
          N° Décennale : ${clientDetails.subcontractor.decennialNumber}<br>
          ${clientDetails.subcontractor.qualifications ? 
            `- ${clientDetails.subcontractor.qualifications.join(' - ')}` : ''}
        </div>
      </div>
      ` : ''}
    </div>
    
    <div class="info-box details-box">
      <h3 class="box-title" style="margin-bottom: 2mm;">${clientName.toUpperCase()}</h3>
      <div style="font-size: 11px; margin-bottom: 4mm; padding-bottom: 2mm; border-bottom: 1px solid rgba(0,0,0,0.05);">
        Détails du projet
      </div>
      <div class="info-row">
        <div class="info-label">Adresse</div>
        <div class="info-value">${clientDetails?.street || 'Adresse non renseignée'}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Code postal</div>
        <div class="info-value">${clientDetails?.postalCode || 'N/A'} ${clientDetails?.city || ''}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Parcelle cadastrale</div>
        <div class="info-value">${clientDetails?.cadastralParcel || 'N/A'}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Téléphone</div>
        <div class="info-value">${clientDetails?.phoneNumber || 'N/A'}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Zone</div>
        <div class="info-value">${clientDetails?.zone || 'N/A'}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Type de maison</div>
        <div class="info-value">${clientDetails?.houseType || 'N/A'} ${clientDetails?.houseAge || ''}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Précarité</div>
        <div class="info-value">${clientDetails?.precarity || 'N/A'}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Type de chauffage</div>
        <div class="info-value">${clientDetails?.heatingType || 'N/A'}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Type de logement</div>
        <div class="info-value">${clientDetails?.dwellingType || 'N/A'}</div>
      </div>
    </div>
  </div>`;

  
// Generate the products table HTML with improved typography and spacing and pagination
const getProductsTable = (tableItems: TableItem[]) => `
  <!-- Products Table -->
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th style="width: 45%">Détail</th>
          <th style="width: 7%">Qté</th>
          <th style="width: 10%">PU HT</th>
          <th style="width: 10%">PU TTC</th>
          <th style="width: 6%">TVA</th>
          <th style="width: 11%"><strong>Total HT</strong></th>
          <th style="width: 11%"><strong>Total TTC</strong></th>
        </tr>
      </thead>
      <tbody>
        ${tableItems.map(item => {
          // Calculate PU TTC and Total TTC
          const unitPriceTTC = item.unitPriceHT * (1 + item.tva/100);
          const totalTTC = item.totalHT * (1 + item.tva/100);
          
          return `
          <tr>
            <td>
              <div class="item-desc">${item.name}</div>
            </td>
            <td>${item.reference === 'MENTION DÉCHETS' ? '' : item.quantity}</td>
            <td>${item.reference === 'MENTION DÉCHETS' ? '' : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.unitPriceHT)}</td>
            <td>${item.reference === 'MENTION DÉCHETS' ? '' : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(unitPriceTTC)}</td>
            <td>${item.reference === 'MENTION DÉCHETS' ? '' : item.tva + '%'}</td>
            <td><strong>${item.reference === 'MENTION DÉCHETS' ? '' : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.totalHT)}</strong></td>
            <td><strong>${item.reference === 'MENTION DÉCHETS' ? '' : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalTTC)}</strong></td>
          </tr>
        `}).join('')}
      </tbody>
      <tfoot>
        <!-- Empty footer to ensure proper table pagination -->
        <tr style="height: 0; visibility: hidden;">
          <td colspan="7"></td>
        </tr>
      </tfoot>
    </table>
  </div>
`;

// Improved MaPrimeRenov Conditions function with better typography
const getMaPrimeRenovConditions = (primeRenovAmount: number | undefined): string => {
  if (primeRenovAmount === undefined || primeRenovAmount === 0) return '';
  
  const formattedAmount = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(primeRenovAmount);
  
  return `
    <!-- MaPrimeRenov Conditions -->
    <div class="additional-section prime-renov-section" style="margin-top: 8mm; background-color: #f0f8ff; border-left: 3px solid #1e40af;">
      <h3 class="additional-title">Conditions particulières relatives à l'aide MaPrimeRénov'</h3>
      <div class="additional-content">
        <p>(**) Conditions particulières relatives à l'aide ANAH / MaPrimeRénov Cette offre est cumulable avec l'aide MaPrimeRénov', accordée uniquement après analyse du dossier, d'un montant estimatif de ${formattedAmount}. Dans le cas où l'aide notifiée au client est inférieure au montant de l'aide prévisionnelle, l'usager n'est pas lié par le devis et l'entreprise s'engage à proposer un devis rectificatif. Le client conserve alors un droit de rétractation d'une durée de quatorze jours à partir de la date de présentation du devis rectificatif. L'aide MaPrimeRénov' est conditionnelle et soumise à la conformité des pièces justificatives et informations déclarées par le bénéficiaire. En cas de fausse déclaration, de manoeuvre frauduleuse ou de changement du projet de travaux subventionné, le bénéficiaire s'expose au retrait et reversement de tout ou partie de la prime. Les services de l'Anah pourront faire procéder à tout contrôle des engagements et sanctionner le bénéficiaire et son mandataire éventuel des manquements constatés. Prime versée par l'ANAH d'un montant prévisionnel de ${formattedAmount} dans le cadre du dispositif MaPrimeRénov'</p>
      </div>
    </div>
  `;
};

// Improved Termes et conditions function with better spacing
const getTermes = (dealId?: string): string => {
  const dealName = getDealName(dealId);
  
  return `
    <!-- Termes et Conditions CEE -->
    <div class="additional-section terms-section" style="margin-top: 8mm; background-color: #f9f9f9; border-left: 3px solid #6B7280;">
      <h3 class="additional-title">Termes et conditions</h3>
      <div class="additional-content">
        <p>Montant final versé par ${dealName} en votre nom et pour votre compte dans le cadre du mandat que vous avez signé et du dispositif des Certificats d'Économies d'Énergie. Cette déduction est conditionnée à la réception, dans les délais de validité de votre demande de Prime ${dealName}, d'un dossier conforme et validé par ${dealName}, et des travaux contrôlés conformes en l'absence duquel vous devrez nous régler directement ce montant.</p>
      </div>
    </div>
  `;
};

// Improved Payment Information section for invoices
const getPaymentInformation = (paymentDueDate?: string): string => {
  const formattedDate = paymentDueDate ? formatDate(paymentDueDate) : 'À réception de facture';
  
  return `
    <!-- Payment Information -->
    <div class="additional-section payment-section" style="margin-top: 8mm; background-color: #fff8e6; border-left: 3px solid #f59e0b;">
      <h3 class="additional-title">Informations de paiement</h3>
      <div class="additional-content">
        <p>Cette facture est payable au plus tard le ${formattedDate}.</p>
        <p>Modes de paiement acceptés : Chèque, Carte bancaire, Virement bancaire.</p>
        <p><strong>Coordonnées bancaires :</strong><br>
        IBAN : FR76 0000 0000 0000 0000 0000 000<br>
        BIC : XXXXXXXX<br>
        Banque : Exemple Banque<br>
        Titulaire : ECOLOGY'B</p>
        <p class="small-print">En cas de retard de paiement, une pénalité de 3 fois le taux d'intérêt légal sera appliquée, ainsi qu'une indemnité forfaitaire pour frais de recouvrement de 40€ (articles L.441-6 et D.441-5 du Code de Commerce).</p>
      </div>
    </div>
  `;
};

// Improved Financial Summary with better alignment and typography
const getFinancialSummary = (
  totals: FinancialTotals, 
  dealId?: string, 
  incentivesData?: IncentivesData | null,
  hasOperations: boolean = false
): string => {
  // Get the deal name if dealId is provided
  const dealName = getDealName(dealId);
  
  // Base HTML code
  let html = `
    <!-- Financial Summary -->
    <div class="finance-wrapper">
      <!-- Signature Section (Left Side) -->
      <div class="signature-payment-section">
        <div class="payment-method">
          <div class="payment-method-title">Mode de paiement :</div>
          <div class="payment-method-options">Chèque, CB ou virement bancaire</div>
        </div>
        
        <!-- For invoices, show "Facture acquittée" stamp instead of signature area -->
        <div class="invoice-stamp">
          <p>Facture acquittée le : ______________________</p>
          <div class="stamp-placeholder">
            <div class="stamp-text">PAYÉ</div>
          </div>
        </div>
      </div>
      
      <!-- Financial Summary (Right Side) -->
      <div class="finance-summary">
        <div class="finance-header">Récapitulatif Financier</div>
        <div class="finance-row">
          <div class="finance-label">Total HT</div>
          <div class="finance-value">${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totals.totalHT)}</div>
        </div>
        <div class="finance-row">
          <div class="finance-label">TVA</div>
          <div class="finance-value">${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totals.totalTTC - totals.totalHT)}</div>
        </div>
        <div class="finance-row">
          <div class="finance-label">Total TTC</div>
          <div class="finance-value">${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totals.totalTTC)}</div>
        </div>
  `;

  // Add deal-related prime CEE if available
  if (dealId && totals.primeCEE && totals.primeCEE > 0) {
    html += `
        <div class="finance-row primes">
          <div class="finance-label">Prime ${dealName}</div>
          <div class="finance-value">-${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totals.primeCEE)}</div>
        </div>
    `;
  }
  
  // Directly match the DevisEditor logic for MaPrimeRenov display
  const primeRenovValue = totals.primeRenov ?? 0;
  if (primeRenovValue > 0 && hasOperations && incentivesData?.primeMPR !== "Prime MPR non deduite") {
    html += `
      <div class="finance-row primes">
        <div class="finance-label">Estimation MaPrimeRenov'</div>
        <div class="finance-value">-${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(primeRenovValue)}</div>
      </div>
      <div class="finance-note">
        <div class="finance-note-text">Sous réserve de l'accord de l'ANAH (**)</div>
      </div>
    `;
  }

  // Add user-defined incentives if available
  if (incentivesData) {
    // Additional Prime CEE
    if (incentivesData.primeCEE && parseFloat(incentivesData.primeCEE) > 0) {
      html += `
        <div class="finance-row primes">
          <div class="finance-label">Prime C.E.E supplémentaire</div>
          <div class="finance-value">-${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(parseFloat(incentivesData.primeCEE))}</div>
        </div>
      `;
    }
    
    // Exceptional discount
    if (incentivesData.remiseExceptionnelle && parseFloat(incentivesData.remiseExceptionnelle) > 0) {
      html += `
        <div class="finance-row primes">
          <div class="finance-label">Remise exceptionnelle</div>
          <div class="finance-value">-${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(parseFloat(incentivesData.remiseExceptionnelle))}</div>
        </div>
      `;
    }
    
    // MPR Prime deducted
    if (incentivesData.primeMPR && parseFloat(incentivesData.primeMPR) > 0) {
      html += `
        <div class="finance-row primes">
          <div class="finance-label">Prime MPR déduite</div>
          <div class="finance-value">-${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(parseFloat(incentivesData.primeMPR))}</div>
        </div>
      `;
    }
    
    // RAC support amount
    if (incentivesData.montantPriseEnChargeRAC && parseFloat(incentivesData.montantPriseEnChargeRAC) > 0) {
      html += `
        <div class="finance-row primes">
          <div class="finance-label">Prise en charge du RAC</div>
          <div class="finance-value">-${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(parseFloat(incentivesData.montantPriseEnChargeRAC))}</div>
        </div>
      `;
    }
    
    // Down payment
    if (incentivesData.acompte && parseFloat(incentivesData.acompte) > 0) {
      html += `
        <div class="finance-row" style="color: #d97706;">
          <div class="finance-label">Acompte</div>
          <div class="finance-value">-${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(parseFloat(incentivesData.acompte))}</div>
        </div>
      `;
    }
  }

  // Modified final total with improved positioning
  html += `
      <div class="final-total">
        <div class="finance-label" style="position: relative; width: 100%;">
          Reste à payer
          <div style="position: absolute; bottom: 0; right: 0; font-weight: 700; color: var(--navy);">
            ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totals.remaining)}
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  return html;
};

// Generate the additional information HTML section with improved typography
const getAdditionalInfo = (additionalInfo: string) => {
  if (!additionalInfo) return '';
  
  return `
    <!-- Additional Information -->
    <div class="additional-section">
      <h3 class="additional-title">Informations complémentaires</h3>
      <div class="additional-content">${additionalInfo}</div>
    </div>
  `;
};

// Generate the financing information HTML section with improved spacing
const getFinancingSection = (financingData: FinancingData) => {
  // Helper function to get frequency label
  const getFrequencyLabel = (frequencyId: string) => {
    const frequencyMap: {[key: string]: string} = {
      'monthly': 'Mensuelle',
      'quarterly': 'Trimestrielle',
      'biannual': 'Semestrielle',
      'annual': 'Annuelle'
    };
    return frequencyMap[frequencyId] || frequencyId;
  };

  return `
    <!-- Financing Information -->
    <div class="financing-section">
      <h3 class="financing-title">Paiement avec financement</h3>
      <div class="financing-content">
        <p><strong>Organisme Bancaire : ${financingData.bankName}</strong></p>
        
        <p class="financing-subtitle">Une offre préalable de crédit a été remise au client aux conditions principales suivantes :</p>
        
        <div class="financing-grid">
          <div class="financing-row">
            <div class="financing-label">Montant du prêt :</div>
            <div class="financing-value">${financingData.loanAmount} €</div>
          </div>
          <div class="financing-row">
            <div class="financing-label">Mois de Report :</div>
            <div class="financing-value">${financingData.deferredMonths}</div>
          </div>
          <div class="financing-row">
            <div class="financing-label">Taux débiteur fixe :</div>
            <div class="financing-value">${financingData.fixedRate} %</div>
          </div>
          <div class="financing-row">
            <div class="financing-label">TAEG :</div>
            <div class="financing-value">${financingData.annualPercentageRate} %</div>
          </div>
          <div class="financing-row">
            <div class="financing-label">Nombre d'échéances :</div>
            <div class="financing-value">${financingData.numberOfPayments}</div>
          </div>
          <div class="financing-row">
            <div class="financing-label">Échéances avec assurance :</div>
            <div class="financing-value">${financingData.paymentAmountWithInsurance} €</div>
          </div>
          <div class="financing-row">
            <div class="financing-label">Échéances sans assurance :</div>
            <div class="financing-value">${financingData.paymentAmountWithoutInsurance} €</div>
          </div>
          <div class="financing-row">
            <div class="financing-label">Périodicité :</div>
            <div class="financing-value">${getFrequencyLabel(financingData.frequency)}</div>
          </div>
          <div class="financing-row">
            <div class="financing-label">Montant total dû :</div>
            <div class="financing-value">${financingData.totalAmountDue} €</div>
          </div>
          ${financingData.personalContribution && financingData.personalContribution !== "0" ? `
          <div class="financing-row">
            <div class="financing-label">Apport personnel :</div>
            <div class="financing-value">${financingData.personalContribution} €</div>
          </div>
          ` : ''}
          ${financingData.sellerName ? `
          <div class="financing-row">
            <div class="financing-label">Nom du vendeur :</div>
            <div class="financing-value">${financingData.sellerName}</div>
          </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
};

// ===== IMPROVED STYLES FOR INVOICE =====

// Improved getFactureStyles function with enhanced background pattern and print styles
const getFactureStyles = () => `
/* Enhanced A4 Print Optimization */
@page {
  size: A4;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
  width: 210mm;
  background: #fff;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}

/* Enhanced Background Pattern Styles */
.page {
  position: relative;
  width: 210mm;
  min-height: 297mm; /* Changed from fixed height to min-height to allow content to flow */
  margin: 0 auto;
  background-color: white;
  overflow: visible; /* Changed from hidden to visible to prevent content cutoff */
  page-break-after: always;
  box-sizing: border-box;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

/* Main background - perfectly centered logo with minimal rotation */
.page::before {
  content: '';
  position: absolute;
  top: 40%;
  left: 50%;
  width: 140mm;
  height: 140mm;
  background-image: url('/ecologyb.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  opacity: 0.08;
  transform: translate(-50%, -50%) rotate(0deg);
  z-index: 0;
  pointer-events: none;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

/* Lighter gradient overlay to make logo more visible */
.page .gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.6) 100%);
  z-index: 0;
  pointer-events: none;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

/* Content positioning */
.content {
  position: relative;
  z-index: 1;
  padding: 10mm 15mm 35mm 15mm; /* Increased bottom padding to 35mm to make room for footer */
  box-sizing: border-box;
  min-height: 220mm; /* Ensure there's enough space between content and footer */
}

/* Client and Quote Info Grid */
.info-grid {
  display: flex;
  gap: 5mm;
  margin-bottom: 6mm;
  margin-top: 5mm;
}

.info-box {
  flex: 1;
  border-radius: 2mm;
  padding: 4mm;
  position: relative;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.client-box {
  background-color: var(--extra-light-blue);
  border-left: 3px solid var(--light-blue);
}

.details-box {
  background-color: var(--extra-light-green);
  border-left: 3px solid var(--light-green);
}

.box-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--navy);
  margin-bottom: 3mm;
  padding-bottom: 2mm;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.info-row {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 2mm;
  margin-bottom: 2mm;
  align-items: center;
}

.info-label {
  font-size: 9px;
  color: #555;
  font-weight: 600;
}

.info-value {
  font-size: 10px;
  color: #333;
}

/* Table Styling */
.section-title {
  position: relative;
  font-size: 15px;
  font-weight: 600;
  color: var(--navy);
  margin-bottom: 4mm;
  padding-bottom: 2mm;
  border-bottom: 1px solid var(--light-blue);
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 30mm;
  height: 2px;
  background-color: var(--navy);
}

.table-wrapper {
  margin-bottom: 10mm;
  border-radius: 2mm;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  /* Removed overflow: hidden to allow tables to break across pages */
}

table {
  width: 100%;
  border-collapse: collapse;
  page-break-inside: auto; /* Allow table to break across pages */
}

/* Make sure table headers repeat on each page */
thead {
  background: linear-gradient(90deg, var(--navy) 0%, var(--light-navy) 100%);
  color: white;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  display: table-header-group; /* Force headers to appear on each page */
}

tfoot {
  display: table-footer-group; /* Force footer to appear on each page */
}

/* Make sure a row doesn't break across pages if possible */
tr {
  page-break-inside: avoid;
  page-break-after: auto;
}

th {
  text-align: left;
  padding: 3mm 3mm;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

td {
  padding: 2.5mm 3mm;
  font-size: 9px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: top;
}

tr:last-child td {
  border-bottom: none;
}

tr:nth-child(even) {
  background-color: #f9fafc;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.item-desc {
  font-size: 9px;
  color: #333;
  line-height: 1.4;
}

/* Additional Sections */
.additional-section {
  margin-bottom: 10mm;
  padding: 4mm;
  background-color: #f9fafc;
  border-radius: 2mm;
  border-left: 3px solid var(--navy);
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.prime-renov-section {
  background-color: #f0f8ff !important;
  border-left: 3px solid #1e40af !important;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.terms-section {
  background-color: #f9f9f9 !important;
  border-left: 3px solid #6B7280 !important;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.payment-section {
  background-color: #fff8e6 !important;
  border-left: 3px solid #f59e0b !important;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.additional-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--navy);
  margin-bottom: 3mm;
  padding-bottom: 2mm;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.additional-content {
  font-size: 9px;
  color: #444;
  line-height: 1.5;
}

.small-print {
  font-size: 8px;
  color: #666;
  margin-top: 2mm;
}

/* Invoice Stamp */
.invoice-stamp {
  margin-top: 5mm;
  border-radius: 2mm;
  padding: 4mm;
  background-color: #f9f9f9;
  border: 1px solid #e5e7eb;
  position: relative;
  min-height: 60mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.invoice-stamp p {
  font-size: 10px;
  font-weight: 500;
  color: #333;
  margin-bottom: 10mm;
}

.stamp-placeholder {
  position: relative;
  width: 50mm;
  height: 30mm;
  border: 2px dashed #d1d5db;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2mm;
}

.stamp-text {
  font-size: 24px;
  font-weight: 700;
  color: rgba(220, 38, 38, 0.2);
  transform: rotate(-15deg);
  letter-spacing: 5px;
}

/* Improved Financial Summary Styling */
.finance-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12mm;
  width: 100%;
  page-break-inside: avoid; /* Prevent breaking inside financial summary */
  page-break-before: auto; /* Allow page break before if needed */
}

/* Signature and payment method section */
.signature-payment-section {
  width: 48%;
  padding-right: 5mm;
}

.signature-area {
  margin-bottom: 5mm;
  border-radius: 2mm;
  padding: 4mm;
  background-color: #f9f9f9;
  border: 1px solid #e5e7eb;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.signature-instruction {
  font-size: 10px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8mm;
  text-align: center;
}

.signature-line {
  height: 0.5mm;
  background-color: #d1d5db;
  margin-bottom: 5mm;
}

.signature-date-line {
  font-size: 9px;
  color: #333;
}

.payment-method {
  border-radius: 2mm;
  padding: 4mm;
  background-color: #f9f9f9;
  border: 1px solid #e5e7eb;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.payment-method-title {
  font-size: 10px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2mm;
}

.payment-method-options {
  font-size: 9px;
  color: #555;
}

/* Finance summary */
.finance-summary {
  width: 45%;
  border-radius: 2mm;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  background-color: white;
}

.finance-header {
  background: linear-gradient(90deg, var(--navy) 0%, var(--light-navy) 100%);
  color: white;
  padding: 2.5mm 3mm;
  font-size: 12px;
  font-weight: 600;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.finance-row {
  display: flex;
  justify-content: space-between;
  padding: 2mm 3mm;
  border-bottom: 1px solid #f0f0f0;
}

.finance-label {
  font-size: 9px;
  font-weight: 500;
  color: #555;
}

.finance-value {
  font-size: 10px;
  font-weight: 600;
  color: #333;
}

.primes .finance-label, .primes .finance-value {
  color: #047857;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.final-total {
  background-color: var(--extra-light-blue);
  padding: 3mm;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.final-total .finance-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--navy);
}

/* Finance note */
.finance-note {
  padding: 0 3mm 2mm 3mm;
  border-bottom: 1px solid #f0f0f0;
}

.finance-note-text {
  font-size: 8px;
  color: #666;
  font-style: italic;
  margin-top: -1mm;
}

/* Financing Section */
.financing-section {
  margin-bottom: 10mm;
  padding: 4mm;
  background-color: #fff8e6;
  border-radius: 2mm;
  border-left: 3px solid #f59e0b;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.financing-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--navy);
  margin-bottom: 3mm;
  padding-bottom: 2mm;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.financing-subtitle {
  font-size: 11px;
  font-weight: 600;
  color: var(--navy);
  margin-top: 3mm;
  margin-bottom: 2mm;
}

.financing-content {
  font-size: 9px;
  color: #444;
  line-height: 1.5;
}

.financing-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2mm;
  margin-top: 3mm;
}

.financing-row {
  display: flex;
  align-items: center;
}

.financing-label {
  font-size: 9px;
  color: #555;
  font-weight: 500;
  width: 70px;
  flex-shrink: 0;
}

.financing-value {
  font-size: 10px;
  color: #333;
  font-weight: 600;
}

/* Print-specific optimizations */
@media print {
  body {
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 0;
  }
  
  .page {
    margin: 0;
    padding: 0;
    border: none;
    box-shadow: none;
    width: 210mm;
    height: 297mm;
  }
  
  .content {
    padding: 10mm 15mm;
  }
  
  .print-button {
    display: none;
  }
  
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  
  thead, .finance-header, .footer-accent, .header-accent {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}

/* Optimizations for preview mode */
.print-button {
  position: fixed;
  top: 15px;
  right: 15px;
  padding: 8px 16px;
  background-color: #213f5b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  z-index: 9999;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.print-button:hover {
  background-color: #2c5480;
}
`;

// Main PDF generation function with improved page layout
export const generateFacturePDF = (
tableItems: TableItem[],
invoiceNumber: string,
invoiceDate: string,
clientName: string = "Client",
totals: FinancialTotals,
dealId?: string,
additionalInfo?: string,
financingData: FinancingData | null = null,
incentivesData: IncentivesData | null = null,
paymentDueDate?: string,
installationDate?: string, 
workCompletionDate?: string,
quoteNumber: string = "DEVIS-####",
quoteDate: string = "",
clientDetails?: {
  street?: string,
  postalCode?: string,
  city?: string,
  cadastralParcel?: string,
  phoneNumber?: string,
  zone?: string,
  houseType?: string,
  houseAge?: string,
  precarity?: string,
  heatingType?: string,
  dwellingType?: string,
  clientNumber?: string,
  subcontractor?: {
    name?: string,
    address?: string,
    leader?: string,
    siret?: string,
    decennialNumber?: string,
    qualifications?: string[]
  }
}
) => {
// Check if operations exist in the tableItems
const hasOperations = tableItems.some(item => 
  (item.id && item.id.startsWith('op-')) || 
  (item.reference && (
    item.reference.startsWith('BAR-TH-') || 
    ["BAR-TH-171", "BAR-TH-104", "BAR-TH-113", "BAR-TH-143"].includes(item.reference)
  ))
);

// Check if we should show MaPrimeRenov conditions
const showMaPrimeRenovConditions = hasOperations && 
                                  incentivesData && 
                                  incentivesData.activiteMaPrimeRenov && 
                                  totals.primeRenov !== undefined;

// Format date
const formattedInvoiceDate = formatDate(invoiceDate);

// Generate HTML content with optimized layout and improved pagination
const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Facture ${invoiceNumber}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        ${getCommonStyles()}
        ${getFactureStyles()}
        
        /* Additional pagination styles */
        @page {
          size: A4;
          margin: 0;
        }
        
        /* Style for table headers that repeat on each page */
        table thead {
          display: table-header-group;
        }
        
        /* Force a page break before the recapitulatif if needed */
        .page-break-before {
          page-break-before: always;
        }
      </style>
    </head>
    <body>
      <!-- Add a print button -->
      <button class="print-button" onclick="window.print()">Imprimer</button>
      
      <!-- Page 1 and continued pages for content -->
      <div class="page">
        <div class="gradient-overlay"></div>
        ${getCompanyHeader()} <!-- Pass true to indicate this is an invoice -->
        
        <!-- Main Content -->
        <div class="content">
          <div class="main-content">
            ${getCustomerAndInvoiceInfo(
              clientName, 
              invoiceNumber, 
              formattedInvoiceDate,
              quoteNumber,
              quoteDate,
              paymentDueDate,
              installationDate,
              workCompletionDate,
              dealId, 
              clientDetails
            )}
            ${getProductsTable(tableItems)}

            ${additionalInfo ? getAdditionalInfo(additionalInfo) : ''}
            ${getPaymentInformation(paymentDueDate)}
            ${showMaPrimeRenovConditions && totals.primeRenov !== undefined ? getMaPrimeRenovConditions(totals.primeRenov) : ''}
            ${getTermes(dealId)}
            ${financingData ? getFinancingSection(financingData) : ''}
            
            <!-- Financial summary with potential page break -->
            <div id="financial-summary-section">
              ${getFinancialSummary(totals, dealId, incentivesData, hasOperations)}
            </div>
          </div>
        </div>
        
        ${getCompanyFooter('Page 1/')} <!-- Pass true to indicate this is an invoice -->
      </div>
      
      <script>
        // Force loading of all fonts and images before print
        document.fonts.ready.then(() => {
          console.log("All fonts are loaded");
          
          // Wait for images to load
          const images = document.querySelectorAll('img');
          let loadedImages = 0;
          
          if (images.length === 0) {
            initializePagination();
          } else {
            images.forEach(img => {
              if (img.complete) {
                loadedImages++;
                if (loadedImages === images.length) {
                  initializePagination();
                }
              } else {
                img.addEventListener('load', () => {
                  loadedImages++;
                  if (loadedImages === images.length) {
                    initializePagination();
                  }
                });
                
                // Also handle errors
                img.addEventListener('error', () => {
                  loadedImages++;
                  if (loadedImages === images.length) {
                    initializePagination();
                  }
                });
              }
            });
          }
        });
        
        // Function to check if financial summary needs its own page
        function initializePagination() {
          // Fix table headers on every page
          const tableHeaders = document.querySelectorAll('table thead');
          tableHeaders.forEach(header => {
            header.style.display = 'table-header-group';
          });
          
          // Dynamically update page numbers
          const footers = document.querySelectorAll('.page-number');
          footers.forEach((footer, index) => {
            footer.textContent = 'Page ' + (index + 1) + '/' + footers.length; // Updated page count calculation
          });
          
          // Check if financial summary needs to break to a new page
          const financialSummary = document.getElementById('financial-summary-section');
          if (financialSummary) {
            const rect = financialSummary.getBoundingClientRect();
            const pageHeight = 297; // mm
            const footerHeight = 35; // mm
            
            // Convert px to mm for comparison (rough approximation)
            const pxToMm = 0.264583;
            const summaryPosInMm = rect.top * pxToMm;
            
            // If summary is too close to bottom of page, add page break
            if (summaryPosInMm > (pageHeight - footerHeight - 80)) {
              financialSummary.classList.add('page-break-before');
            }
          }
        }
        
        // Add event listener for before printing
        window.addEventListener('beforeprint', () => {
          // Any last-minute adjustments before printing
          document.querySelector('.print-button').style.display = 'none';
        });
        
        // Add event listener for after printing
        window.addEventListener('afterprint', () => {
          // Restore any elements that were hidden for printing
          document.querySelector('.print-button').style.display = 'block';
        });
      </script>
    </body>
  </html>
`;

// Open a new tab with improved error handling
const newTab = window.open('', '_blank');
if (!newTab) {
  alert('Le bloqueur de fenêtres pop-up a empêché l\'ouverture de l\'aperçu. Veuillez autoriser les fenêtres pop-up pour ce site.');
  return;
}

// Write the HTML content to the new tab with improved rendering
newTab.document.open();
newTab.document.write(htmlContent);
newTab.document.close();

// Focus the new tab
newTab.focus();
};
