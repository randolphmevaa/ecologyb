// Devis PDF Generator Module
// Add these lines at the beginning of your devis-pdf-generator.tsx file
// (after the imports but before any other code)

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

// Then modify the openPrintWindow function or create a wrapper
// If you don't have direct access to modify openPrintWindow, create this wrapper function:

// import { openPrintWindow as originalOpenPrintWindow } from './pdf-utils';
import { 
  formatDate, 
  getCommonStyles, 
  getCompanyHeader, 
  getCompanyFooter,
  // openPrintWindow,
  // triggerPrint
} from './pdf-utils';

// import { SizingNote } from './types';

// Define proper interfaces to replace 'any' types
// Update the TableItem interface to include id
interface TableItem {
  reference: string;
  name: string;
  quantity: number;
  unitPriceHT: number;
  tva: number;
  totalHT: number;
  id?: string; // Add optional id property
}

// Add IncentivesData interface
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

// Add FinancingData interface to existing interfaces
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

// Also modify the openPrintWindow function to return a new tab instead of a print window
// const openPrintWindow = (defaultTitle: string) => {
//   // Use custom filename if available, otherwise use the default
//   const title = customFilename || defaultTitle;
  
//   // Open a new tab instead of using the original function
//   const newTab = window.open('', '_blank');
  
//   // Reset custom filename after use to avoid affecting future generations
//   customFilename = "";
  
//   return newTab;
// };

// Add a function to get the deal name from the deal ID
const getDealName = (dealId?: string): string => {
  if (!dealId) return '';
  
  // Map of deal IDs to their display names
  const dealMap: {[key: string]: string} = {
    'CEE': 'CEE',
    'EFFY': 'EFFY'
    // Add more deals here as needed
  };
  
  return dealMap[dealId] || dealId; // Return the mapped name or the ID if no mapping exists
};

// Update the getCustomerAndQuoteInfo function to include DEVIS number and client name
// Update the getCustomerAndQuoteInfo function to include additional dates
const getCustomerAndQuoteInfo = (
  clientName: string, 
  quoteNumber: string, 
  quoteDate: string, 
  validUntilDate?: string,
  preVisitDate?: string,
  estimatedWorkDate?: string,
  commitmentDate?: string,
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
  <!-- Client and Devis Info -->
  <div class="info-grid">
    <div class="info-box client-box">
      <h3 class="box-title" style="margin-bottom: 2mm;">DEVIS : ${quoteNumber}</h3>
      <div style="font-size: 11px; margin-bottom: 4mm; padding-bottom: 2mm; border-bottom: 1px solid rgba(0,0,0,0.05);">
        Numéro client : ${clientDetails?.clientNumber || 'N/A'}
      </div>
      <div class="info-row">
        <div class="info-label">Date</div>
        <div class="info-value">${formatDate(quoteDate)}</div>
      </div>
      
      ${validUntilDate ? `
      <div class="info-row">
        <div class="info-label">Valable jusqu'au</div>
        <div class="info-value">${formatDate(validUntilDate)}</div>
      </div>
      ` : ''}

      ${preVisitDate ? `
      <div class="info-row">
        <div class="info-label">Prévisite/Audit</div>
        <div class="info-value">${formatDate(preVisitDate)}</div>
      </div>
      ` : ''}

      ${estimatedWorkDate ? `
      <div class="info-row">
        <div class="info-label">Travaux prévus</div>
        <div class="info-value">${formatDate(estimatedWorkDate)}</div>
      </div>
      ` : ''}

      ${commitmentDate ? `
      <div class="info-row">
        <div class="info-label">Engagement</div>
        <div class="info-value">${formatDate(commitmentDate)}</div>
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

// Generate the products table HTML
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
    </table>
  </div>
`;



// First, let's modify the getMaPrimeRenovConditions function to remove the "Termes et conditions" part
const getMaPrimeRenovConditions = (primeRenovAmount: number | undefined): string => {
  if (primeRenovAmount === undefined || primeRenovAmount === 0) return '';
  
  const formattedAmount = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(primeRenovAmount);
  
  return `
    <!-- MaPrimeRenov Conditions -->
    <div class="additional-section" style="margin-top: 8mm; background-color: #f0f8ff; border-left: 3px solid #1e40af;">
      <h3 class="additional-title">Conditions particulières relatives à l'aide MaPrimeRénov'</h3>
      <div class="additional-content">
        <p>(**) Conditions particulières relatives à l'aide ANAH / MaPrimeRénov Cette offre est cumulable avec l'aide MaPrimeRénov', accordée uniquement après analyse du dossier, d'un montant estimatif de ${formattedAmount}. Dans le cas où l'aide notifiée au client est inférieure au montant de l'aide prévisionnelle, l'usager n'est pas lié par le devis et l'entreprise s'engage à proposer un devis rectificatif. Le client conserve alors un droit de rétractation d'une durée de quatorze jours à partir de la date de présentation du devis rectificatif. L'aide MaPrimeRénov' est conditionnelle et soumise à la conformité des pièces justificatives et informations déclarées par le bénéficiaire. En cas de fausse déclaration, de manoeuvre frauduleuse ou de changement du projet de travaux subventionné, le bénéficiaire s'expose au retrait et reversement de tout ou partie de la prime. Les services de l'Anah pourront faire procéder à tout contrôle des engagements et sanctionner le bénéficiaire et son mandataire éventuel des manquements constatés. Prime versée par l'ANAH d'un montant prévisionnel de ${formattedAmount} dans le cadre du dispositif MaPrimeRénov'</p>
      </div>
    </div>
  `;
};

// Now, let's create a new function for "Termes et conditions"
const getTermes = (dealId?: string): string => {
  const dealName = getDealName(dealId);
  
  return `
    <!-- Termes et Conditions CEE -->
    <div class="additional-section" style="margin-top: 8mm; background-color: #f9f9f9; border-left: 3px solid #6B7280;">
      <h3 class="additional-title">Termes et conditions</h3>
      <div class="additional-content">
        <p>Montant final versé par ${dealName} en votre nom et pour votre compte dans le cadre du mandat que vous avez signé et du dispositif des Certificats d'Économies d'Énergie. Cette déduction est conditionnée à la réception, dans les délais de validité de votre demande de Prime ${dealName}, d'un dossier conforme et validé par ${dealName}, et des travaux contrôlés conformes en l'absence duquel vous devrez nous régler directement ce montant.</p>
      </div>
    </div>
  `;
};

// Updated getFinancialSummary function with signature section
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
        <div class="signature-area">
          <div class="signature-instruction">
            Apposer signature précédée de la mention<br>
            "Lu et approuvé, bon pour accord"
          </div>
          <div class="signature-line"></div>
          <div class="signature-date-line">Le : _____________________</div>
        </div>
        <div class="payment-method">
          <div class="payment-method-title">Mode de paiement :</div>
          <div class="payment-method-options">Chèque, CB ou virement bancaire</div>
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

  // Add deal-related primes if available
  if (dealId && totals.primeCEE) {
    html += `
        <div class="finance-row primes">
          <div class="finance-label">Prime ${dealName}</div>
          <div class="finance-value">-${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totals.primeCEE)}</div>
        </div>
    `;
    
    // Only show Estimation MaPrimeRenov when operations exist AND Prime MPR is set to "Prime MPR deduite"
    const showMaPrimeRenov = hasOperations && 
    incentivesData && 
    incentivesData.primeMPR === "Prime MPR deduite" && 
    totals.primeRenov !== undefined;

    if (showMaPrimeRenov && totals.primeRenov !== undefined) {
    html += `
    <div class="finance-row primes">
    <div class="finance-label">Estimation MaPrimeRenov'</div>
    <div class="finance-value">-${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totals.primeRenov)}</div>
    </div>
    `;
    }
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

  // Add final total
  html += `
      <div class="final-total">
        <div class="finance-label">Reste à payer</div>
        <div class="finance-value">${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totals.remaining)}</div>
      </div>
    </div>
  </div>
  `;

  return html;
};

// Generate the additional information HTML section
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

// Generate the terms and conditions HTML for page 2
const getTermsAndConditions = (quoteNumber: string, formattedDate: string) => `
  <div class="document-title">
    <div class="small-label">Annexe au devis</div>
    <h1 class="title">CONDITIONS GÉNÉRALES DE VENTE</h1>
    <div class="subtitle">Devis N° <strong>${quoteNumber}</strong> | Date: <strong>${formattedDate}</strong></div>
  </div>
  
  <!-- Terms and Conditions -->
  <div class="terms-content">
    <h4>Article 1 - Acceptation des conditions générales de vente</h4>
    <p>Les présentes conditions générales de vente sont applicables à toutes commandes passées par le Client auprès de notre société. Toute commande implique l'acceptation sans réserve par le Client de ces conditions générales de vente.</p>

    <h4>Article 2 - Commandes</h4>
    <p>Toute commande doit faire l'objet d'un devis signé par le Client, accompagné d'un acompte de 30% du montant total TTC. Les commandes ne sont définitives qu'après acceptation écrite de notre société.</p>

    <h4>Article 3 - Prix et paiement</h4>
    <p>Les prix sont exprimés en euros, HT et TTC. Le solde du prix est payable à la livraison ou à la fin des travaux. Tout retard de paiement entraînera l'application de pénalités de retard au taux légal en vigueur.</p>

    <h4>Article 4 - Délais d'exécution</h4>
    <p>Les délais d'exécution sont donnés à titre indicatif. Aucune pénalité de retard ne pourra être appliquée à notre société en cas de retard dans la livraison ou l'exécution des travaux, sauf convention expresse entre les parties.</p>

    <h4>Article 5 - Garanties</h4>
    <p>Les travaux réalisés par notre société sont garantis conformément à la législation en vigueur. Pour mettre en œuvre la garantie, le Client doit impérativement signaler par écrit à notre société les défauts qu'il constate.</p>

    <h4>Article 6 - Droit de rétractation</h4>
    <p>Conformément aux dispositions légales en vigueur, le Client dispose d'un délai de 14 jours à compter de la conclusion du contrat pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.</p>

    <h4>Article 7 - Litiges</h4>
    <p>En cas de litige, les parties s'efforceront de régler leur différend à l'amiable. À défaut d'accord amiable, le tribunal compétent sera celui du lieu du siège social de notre société.</p>
    
    <h4>Article 8 - Installation et mise en service</h4>
    <p>L'installation et la mise en service des équipements sont effectuées par notre société ou par un sous-traitant agréé. Le Client s'engage à mettre à disposition un espace adapté et conforme aux normes en vigueur pour l'installation des équipements.</p>
    
    <h4>Article 9 - Responsabilité</h4>
    <p>Notre société ne pourra être tenue responsable des dommages indirects ou immatériels subis par le Client, tels que pertes d'exploitation, pertes de production, manque à gagner, etc. En tout état de cause, la responsabilité de notre société est limitée au montant HT payé par le Client pour la commande concernée.</p>
    
    <h4>Article 10 - Aides et subventions</h4>
    <p>Les éventuelles aides, subventions ou crédits d'impôts mentionnés dans notre offre le sont à titre indicatif, sans garantie d'obtention. Notre société ne saurait être tenue responsable en cas de refus d'octroi ou de modification des conditions d'attribution par les organismes concernés.</p>
    
    <h4>Article 11 - Réserve de propriété</h4>
    <p>Notre société conserve la propriété des biens vendus jusqu'au paiement intégral du prix par le Client. Le transfert de propriété des produits au Client n'est réalisé qu'après paiement complet du prix par ce dernier, et ce quelle que soit la date de livraison ou d'installation desdits produits.</p>
    
    <h4>Article 12 - Force majeure</h4>
    <p>La responsabilité de notre société ne pourra pas être mise en œuvre si la non-exécution ou le retard dans l'exécution de l'une de ses obligations décrites dans les présentes conditions générales de vente découle d'un cas de force majeure. À ce titre, la force majeure s'entend de tout événement extérieur, imprévisible et irrésistible au sens de l'article 1148 du Code civil.</p>
    
    <h4>Article 13 - Protection des données personnelles</h4>
    <p>Les données personnelles collectées auprès des Clients sont destinées exclusivement à l'usage de notre société. Ces informations sont nécessaires au traitement des commandes et à l'établissement des factures. Conformément à la loi "Informatique et Libertés" et au RGPD, le Client dispose d'un droit d'accès, de rectification et d'opposition aux données personnelles le concernant.</p>
    
    <h4>Article 14 - Modifications des conditions générales de vente</h4>
    <p>Notre société se réserve la faculté de modifier ses conditions générales de vente à tout moment. Les conditions générales de vente applicables sont celles en vigueur à la date de la commande passée par le Client.</p>
    
    <h4>Article 15 - Droit applicable</h4>
    <p>Les présentes conditions générales de vente et les opérations qui en découlent sont régies par le droit français. Tout litige relatif à l'interprétation ou à l'exécution des présentes conditions générales de vente sera de la compétence exclusive des tribunaux français.</p>
  </div>
`;

// Add styling for financing section in getDevisStyles function
const getDevisStyles = () => `
/* Updated Financial Summary Styling */
.finance-wrapper {
  display: flex;
  justify-content: space-between; /* Changed from flex-end to space-between */
  align-items: flex-start;
  margin-bottom: 12mm;
  width: 100%;
}

/* New styles for signature and payment method section */
.signature-payment-section {
  width: 50%; /* Take up half of the available space */
  padding-right: 10mm;
}

.signature-area {
  margin-bottom: 8mm;
  border-radius: 2mm;
  padding: 4mm;
  background-color: #f9f9f9;
  border: 1px solid #e5e7eb;
}

.signature-instruction {
  font-size: 11px;
  font-weight: 500;
  color: #333;
  margin-bottom: 10mm;
  text-align: center;
}

.signature-line {
  height: 0.5mm;
  background-color: #e5e7eb;
  margin-bottom: 5mm;
}

.signature-date-line {
  font-size: 10px;
  color: #333;
}

.payment-method {
  border-radius: 2mm;
  padding: 4mm;
  background-color: #f9f9f9;
  border: 1px solid #e5e7eb;
}

.payment-method-title {
  font-size: 11px;
  font-weight: 600;
  color: #333;
  margin-bottom: 3mm;
}

.payment-method-options {
  font-size: 10px;
  color: #555;
}

/* Update finance summary to take less width */
.finance-summary {
  width: 45%; /* Take less than half the space */
  border-radius: 2mm;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  background-color: white;
}

  .info-grid {
    display: flex;
    gap: 5mm;
    margin-bottom: 5mm;
    margin-top: 5mm;
  }
  
  .info-box {
    flex: 1;
    border-radius: 2mm;
    padding: 4mm;
    position: relative;
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
    font-size: 14px;
    font-weight: 600;
    color: var(--navy);
    margin-bottom: 4mm;
    padding-bottom: 2mm;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }
  
  .info-row {
    display: grid;
    grid-template-columns: 90px 1fr;
    gap: 2mm;
    margin-bottom: 2.5mm;
    align-items: center;
  }
  
  .info-label {
    font-size: 10px;
    color: #666;
    font-weight: 600;
  }
  
  .info-value {
    font-size: 11px;
    color: #333;
  }
  
  /* Table Styling */
  .section-title {
    position: relative;
    font-size: 16px;
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
    margin-bottom: 12mm;
    border-radius: 2mm;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  thead {
    background: linear-gradient(90deg, var(--navy) 0%, var(--light-navy) 100%);
    color: white;
  }
  
  th {
    text-align: left;
    padding: 3mm 4mm;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  
  td {
    padding: 3mm 4mm;
    font-size: 10px;
    border-bottom: 1px solid #f0f0f0;
    vertical-align: top;
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  tr:nth-child(even) {
    background-color: #f9fafc;
  }
  
  .item-name {
    font-weight: 600;
    color: var(--navy);
    font-size: 11px;
    margin-bottom: 1mm;
  }
  
  .item-desc {
    font-size: 9px;
    color: #666;
    line-height: 1.5;
  }
  
  /* Sizing Note Styling */
  .sizing-note-section {
    margin-bottom: 12mm;
    background-color: var(--extra-light-blue);
    padding: 4mm;
    border-radius: 2mm;
    border-left: 3px solid var(--light-blue);
  }
  
  .sizing-note-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--navy);
    margin-bottom: 4mm;
    padding-bottom: 2mm;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }
  
  .sizing-note-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3mm;
    margin-bottom: 4mm;
  }
  
  .sizing-note-row {
    display: flex;
    align-items: center;
  }
  
  .sizing-note-label {
    font-size: 10px;
    color: #666;
    font-weight: 600;
    width: 100px;
    flex-shrink: 0;
  }
  
  .sizing-note-value {
    font-size: 11px;
    color: #333;
    font-weight: 500;
  }
  
  .sizing-note-details {
    background-color: rgba(255,255,255,0.5);
    padding: 3mm;
    border-radius: 1mm;
  }
  
  .sizing-note-subtitle {
    font-size: 12px;
    color: var(--navy);
    margin-bottom: 3mm;
    font-weight: 500;
  }
  
  .sizing-note-tech-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2mm;
  }
  
  .sizing-note-tech-item {
    margin-bottom: 1.5mm;
  }
  
  .sizing-note-tech-label {
    font-size: 9px;
    color: #666;
    margin-bottom: 0.5mm;
  }
  
  .sizing-note-tech-value {
    font-size: 10px;
    color: #333;
    font-weight: 500;
  }
  
  /* Financial Summary Styling */
  .finance-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12mm;
  }
  
  .finance-summary {
    width: 75mm;
    border-radius: 2mm;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    background-color: white;
  }
  
  .finance-header {
    background: linear-gradient(90deg, var(--navy) 0%, var(--light-navy) 100%);
    color: white;
    padding: 3mm 4mm;
    font-size: 13px;
    font-weight: 600;
  }
  
  .finance-row {
    display: flex;
    justify-content: space-between;
    padding: 2.5mm 4mm;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .finance-row:last-child {
    border-bottom: none;
  }
  
  .finance-label {
    font-size: 10px;
    font-weight: 500;
    color: #555;
  }
  
  .finance-value {
    font-size: 11px;
    font-weight: 600;
    color: #333;
  }
  
  .primes .finance-label, .primes .finance-value {
    color: #047857;
  }
  
  .final-total {
    background-color: var(--extra-light-blue);
    padding: 3mm 4mm;
  }
  
  .final-total .finance-label, .final-total .finance-value {
    font-size: 13px;
    font-weight: 700;
    color: var(--navy);
  }
  
  /* Additional Info */
  .additional-section {
    margin-bottom: 12mm;
    padding: 4mm;
    background-color: #f9fafc;
    border-radius: 2mm;
    border-left: 3px solid var(--navy);
  }
  
  .additional-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--navy);
    margin-bottom: 3mm;
    padding-bottom: 2mm;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }
  
  .additional-content {
    font-size: 10px;
    color: #555;
    line-height: 1.6;
  }
  
  /* Financing Section */
  .financing-section {
    margin-bottom: 12mm;
    padding: 4mm;
    background-color: #fff8e6;
    border-radius: 2mm;
    border-left: 3px solid #f59e0b;
  }
  
  .financing-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--navy);
    margin-bottom: 3mm;
    padding-bottom: 2mm;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }
  
  .financing-subtitle {
    font-size: 12px;
    font-weight: 600;
    color: var(--navy);
    margin-top: 3mm;
    margin-bottom: 2mm;
  }
  
  .financing-content {
    font-size: 10px;
    color: #555;
    line-height: 1.6;
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
    font-size: 10px;
    color: #666;
    font-weight: 500;
    width: 70px;
    flex-shrink: 0;
  }
  
  .financing-value {
    font-size: 11px;
    color: #333;
    font-weight: 600;
  }
  
  /* Signature Section */
  .signature-section {
    display: flex;
    gap: 8mm;
    margin-bottom: 8mm;
  }
  
  .signature-box {
    flex: 1;
    padding: 4mm;
    border-radius: 2mm;
    position: relative;
  }
  
  .signature-company {
    background-color: var(--extra-light-blue);
    border: 1px solid var(--light-blue);
  }
  
  .signature-client {
    background-color: var(--extra-light-green);
    border: 1px solid var(--light-green);
  }
  
  .signature-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--navy);
    margin-bottom: 8mm;
  }
  
  .signature-line {
    display: block;
    width: 100%;
    height: 1px;
    background-color: #ddd;
    margin-bottom: 3mm;
  }
  
  .signature-date {
    font-size: 9px;
    color: #666;
  }
  
  .signature-note {
    position: absolute;
    bottom: 2mm;
    left: 4mm;
    font-size: 8px;
    color: #888;
    font-style: italic;
  }
  
  /* Terms and Conditions */
  .terms-content {
    font-size: 9px;
    color: #444;
    line-height: 1.6;
  }
  
  .terms-content h4 {
    color: var(--navy);
    font-size: 11px;
    font-weight: 600;
    margin: 4mm 0 1.5mm;
  }
  
  .terms-content p {
    margin-bottom: 2.5mm;
  }
`;

// Generate the financing information HTML section
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

// Modify the generateDevisPDF function in devis-pdf-generator.tsx
// Replace the last part of the function with this:

export const generateDevisPDF = (
  tableItems: TableItem[],
  quoteNumber: string,
  quoteDate: string,
  clientName: string = "Client",
  totals: FinancialTotals,
  dealId?: string,
  additionalInfo?: string,
  // sizingNotes: SizingNote[] = [],
  financingData: FinancingData | null = null,
  incentivesData: IncentivesData | null = null,
  validUntilDate?: string,
  preVisitDate?: string,
  estimatedWorkDate?: string,
  commitmentDate?: string,
  clientDetails = {
    street: '13 ROUTE DU POINT GAGNARD',
    postalCode: '13014',
    city: 'MARSEILLE',
    cadastralParcel: '000 / ZA / 0061',
    phoneNumber: '+336122336',
    zone: 'ZONE H3',
    houseType: 'Maison individuelle',
    houseAge: 'de + 15 ans',
    precarity: 'Modeste',
    heatingType: 'Bois',
    dwellingType: 'Maison individuelle',
    clientNumber: '76-750595907',
  }
) => {
  // Check if operations exist in the tableItems
  const hasOperations = tableItems.some(item => 
    item.id?.startsWith('op-') || // Check by ID if available
    item.reference?.startsWith('BAR-TH-') // Check by operation reference code pattern
  );

  // Check if we should show MaPrimeRenov conditions
  const showMaPrimeRenovConditions = hasOperations && 
                                    incentivesData && 
                                    incentivesData.activiteMaPrimeRenov && 
                                    totals.primeRenov !== undefined;
  
  // Format date
  const formattedDate = formatDate(quoteDate);
  
  // Generate HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Devis ${quoteNumber}</title>
        <style>
          ${getCommonStyles()}
          ${getDevisStyles()}
          
          /* Add print-specific styles */
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .print-button {
              display: none;
            }
          }
          
          /* Add a print button style */
          .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .print-button:hover {
            background-color: #2563eb;
          }
        </style>
      </head>
      <body>
        <!-- Add a print button -->
        <button class="print-button" onclick="window.print()">Imprimer</button>
        
        <!-- Page 1 -->
        <div class="page">
          ${getCompanyHeader()}
          
          <!-- Main Content -->
          <div class="content" style="margin-top: 0mm;">
            <div class="main-content">
              ${getCustomerAndQuoteInfo(
                clientName, 
                quoteNumber, 
                formattedDate, 
                validUntilDate,
                preVisitDate,
                estimatedWorkDate,
                commitmentDate,
                dealId, 
                clientDetails
              )}
              ${getProductsTable(tableItems)}

              ${additionalInfo ? getAdditionalInfo(additionalInfo) : ''}
              ${showMaPrimeRenovConditions && totals.primeRenov !== undefined ? getMaPrimeRenovConditions(totals.primeRenov) : ''}
              ${getTermes(dealId)} <!-- Always include the Termes et conditions section -->
              ${financingData ? getFinancingSection(financingData) : ''}
              ${getFinancialSummary(totals, dealId, incentivesData, hasOperations)}
            </div>
          </div>
          
          ${getCompanyFooter('Page 1/2')}
        </div>
        
        <!-- Page 2 -->
        <div class="page">
          ${getCompanyHeader()}
          
          <!-- Main Content -->
          <div class="content">
            <div class="main-content">
              ${getTermsAndConditions(quoteNumber, formattedDate)}
            </div>
          </div>
          
          ${getCompanyFooter('Page 2/2')}
        </div>
      </body>
    </html>
  `;
  
  // Open a new tab instead of using the print window
  const newTab = window.open('', '_blank');
  if (!newTab) {
    alert('Le bloqueur de fenêtres pop-up a empêché l\'ouverture de l\'aperçu. Veuillez autoriser les fenêtres pop-up pour ce site.');
    return;
  }
  
  // Write the HTML content to the new tab
  newTab.document.open();
  newTab.document.write(htmlContent);
  newTab.document.close();
};
