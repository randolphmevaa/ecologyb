// Sizing Note PDF Generator Module

import { 
  formatDate, 
  getCommonStyles, 
  getCompanyHeader, 
  // getCompanyFooter,
  // openPrintWindow  // Remove triggerPrint import
} from './pdf-utils';

import { SizingNote } from './types';

// Styles specific to the sizing note PDF
const getSizingNoteStyles = () => `
  .info-box {
    border-radius: 1mm;
    padding: 2mm;  /* Further reduced from 3mm to 2mm */
    margin-bottom: 3mm;  /* Further reduced from 6mm to 3mm */
    position: relative;
  }
  
  .general-info-box {
    background-color: var(--extra-light-blue);
    border-left: 2px solid var(--light-blue);
  }
  
  .box-title {
    font-size: 12px;  /* Reduced from 14px to 12px */
    font-weight: 600;
    color: var(--navy);
    margin-bottom: 1mm;  /* Further reduced from 2mm to 1mm */
    padding-bottom: 0.5mm;  /* Further reduced from 1mm to 0.5mm */
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }
  
  /* Two column layout */
  .two-column-layout {
    display: flex;
    gap: 8mm;  /* Reduced from 15mm to 8mm */
    margin-top: 4mm;  /* Further reduced from 8mm to 4mm */
  }
  
  .left-column {
    flex: 1;
  }
  
  .right-column {
    flex: 1;
  }
  
  /* Client info section */
  .client-name {
    font-size: 14px;  /* Reduced from 16px to 14px */
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 1mm;  /* Further reduced from 2mm to 1mm */
  }
  
  .client-address {
    font-size: 11px;  /* Reduced from 12px to 11px */
    margin-bottom: 1.5mm;  /* Further reduced from 3mm to 1.5mm */
  }
  
  /* Info grid */
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1mm;  /* Further reduced from 2mm to 1mm */
  }
  
  .info-item {
    margin-bottom: 1mm;  /* Further reduced from 2mm to 1mm */
  }
  
  .info-label {
    font-size: 9px;  /* Reduced from 10px to 9px */
    color: #666;
    font-weight: 600;
    margin-bottom: 0.2mm;  /* Further reduced from 0.5mm to 0.2mm */
  }
  
  .info-value {
    font-size: 10px;  /* Reduced from 11px to 10px */
    color: #333;
    font-weight: 500;
  }
  
  /* Equipment info */
  .equipment-info {
    margin-top: 3mm;  /* Further reduced from 8mm to 3mm */
  }
  
  /* Images container */
  .images-container {
    margin-top: 3mm;  /* Further reduced from 8mm to 3mm */
    display: flex;
    flex-direction: column;
    gap: 3mm;  /* Further reduced from 8mm to 3mm */
  }
  
  .image-wrapper {
    width: 100%;
  }
  
  .image-wrapper img {
    width: 100%;
    height: auto;
    display: block;
    max-height: 80mm;  /* Added max-height to keep images from taking too much space */
  }
  
  /* Sizing section */
  .sizing-section {
    background-color: var(--extra-light-blue);
    border-left: 2px solid var(--light-blue);
  }
  
  .sizing-formula {
    font-size: 10px;  /* Reduced from 12px to 10px */
    font-style: italic;
    margin-bottom: 1.5mm;  /* Further reduced from 3mm to 1.5mm */
    padding: 1mm;  /* Further reduced from 2mm to 1mm */
    background-color: rgba(255,255,255,0.5);
    border-radius: 1mm;
  }
  
  .sizing-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1mm;  /* Further reduced from 2mm to 1mm */
    margin-bottom: 1.5mm;  /* Further reduced from 3mm to 1.5mm */
  }
  
  .calculation-step {
    margin-bottom: 1mm;  /* Further reduced from 2mm to 1mm */
  }
  
  .calculation-title {
    font-size: 10px;  /* Reduced from 12px to 10px */
    font-weight: 600;
    margin-bottom: 0.5mm;  /* Further reduced from 1mm to 0.5mm */
  }
  
  .calculation-result {
    font-size: 10px;  /* Reduced from 12px to 10px */
    padding: 0.8mm;  /* Further reduced from 1.5mm to 0.8mm */
    background-color: rgba(255,255,255,0.5);
    border-radius: 0.5mm;
    display: inline-block;
  }
  
  /* Notes section */
  .notes-section {
    margin: 3mm 0;  /* Further reduced from 8mm to 3mm */
    font-size: 9px;  /* Reduced from 11px to 9px */
    line-height: 1.3;  /* Further reduced from 1.4 to 1.3 */
  }
  
  /* Results section */
  .results-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2mm;  /* Further reduced from 4mm to 2mm */
    margin: 3mm 0;  /* Further reduced from 8mm to 3mm */
  }
  
  .result-item {
    background-color: rgba(240,240,240,0.5);
    padding: 1mm;  /* Further reduced from 2mm to 1mm */
    border-radius: 0.5mm;
  }
  
  .result-label {
    font-size: 9px;  /* Reduced from 10px to 9px */
    color: #666;
    margin-bottom: 0.5mm;  /* Further reduced from 1mm to 0.5mm */
  }
  
  .result-value {
    font-size: 12px;  /* Reduced from 14px to 12px */
    font-weight: 600;
    color: var(--navy);
  }
  
  /* Coverage section */
  .coverage-section {
    margin: 3mm 0;  /* Further reduced from 8mm to 3mm */
  }
  
  .coverage-explanation {
    font-size: 9px;  /* Reduced from 10px to 9px */
    margin-bottom: 0.5mm;  /* Further reduced from 1mm to 0.5mm */
  }
  
  .coverage-result {
    font-size: 12px;  /* Reduced from 14px to 12px */
    font-weight: 600;
    color: var(--navy);
  }
  
  /* Signature section */
  .signature-section {
    margin-top: 4mm;  /* Further reduced from 10mm to 4mm */
    border-top: 1px solid #eee;
    padding-top: 3mm;  /* Further reduced from 8mm to 3mm */
  }
  
  .signature-company {
    font-weight: 600;
    margin-bottom: 1mm;  /* Reduced from 2mm to 1mm */
  }
  
  .signature-details {
    font-size: 9px;  /* Reduced from 11px to 9px */
    margin-bottom: 2mm;  /* Further reduced from 4mm to 2mm */
  }
  
  .signature-image {
    width: 40mm;  /* Reduced from 60mm to 40mm */
    height: auto;
  }
  
  /* Print button styling */
  @media print {
    body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    .print-button {
      display: none;
    }
  }
  
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
`;

// Main function to generate the sizing note PDF
export const generateSizingNotePDF = (
  quoteNumber: string,
  quoteDate: string,
  clientName: string = "Client",
  sizingNotes: SizingNote[] = [],
  clientAddress: string = "",
  additionalInfo: { cadastralPlot?: string; phone?: string; email?: string } = {}
) => {
  // Check if there are sizing notes
  if (sizingNotes.length === 0) {
    alert('Aucune note de dimensionnement disponible.');
    return;
  }
  
  // Use the first sizing note for the document
  const sizingNote = sizingNotes[0];
  
  // Open a new tab instead of using the print window
  const newTab = window.open('', '_blank');
  if (!newTab) {
    alert('Le bloqueur de fenêtres pop-up a empêché l\'ouverture de l\'aperçu. Veuillez autoriser les fenêtres pop-up pour ce site.');
    return;
  }
  
  // Format date
  const formattedDate = formatDate(quoteDate);
  
  // Convert string values to numbers for calculations
  const heatedArea = parseFloat(sizingNote.heatedArea || "0");
  const ceilingHeight = parseFloat(sizingNote.ceilingHeight || "0");
  const desiredTemp = sizingNote.desiredTemperature || 0;
  const baseTemp = sizingNote.baseTemperature || 0;
  const constCoef = sizingNote.constructionCoef || 1;
  
  // Calculate values
  const volume = heatedArea * ceilingHeight;
  const deltaT = desiredTemp - baseTemp;
  const heatLoss = volume * constCoef * deltaT;
  const heatLossKW = heatLoss / 1000;
  const dimensioningValue = parseFloat(sizingNote.dimensioning || "0");
  
  // Power calculations
  const definedPower = heatLossKW;
  const power60percent = definedPower * 0.6;
  const power130percent = definedPower * 1.3;
  const coverage = (dimensioningValue * 1000 * 100) / heatLoss;
  
  // Generate HTML content
  const htmlContent = `
    <html>
      <head>
        <title>Note de dimensionnement - ${quoteNumber}</title>
        <style>
          ${getCommonStyles()}
          ${getSizingNoteStyles()}
        </style>
      </head>
      <body>
        <!-- Add a print button -->
        <button class="print-button" onclick="window.print()">Imprimer</button>
        
        <!-- Page 1 -->
        <div class="page">
          ${getCompanyHeader()}
          
          <!-- Main Content -->
          <div class="content">
            <div class="main-content">
              <!-- Document Title -->
              <div class="document-title" style="margin-bottom: 2mm;">
                <div class="small-label" style="font-size: 9px; margin-bottom: 1mm;">Document technique</div>
                <h1 class="title" style="font-size: 16px; margin: 0;">NOTE DE DIMENSIONNEMENT</h1>
              </div>
              
              <!-- Two Column Layout -->
              <div class="two-column-layout">
                <!-- Left Column -->
                <div class="left-column">
                  <!-- General Information Box -->
                  <div class="info-box general-info-box">
                    <h3 class="box-title">Informations Générales</h3>
                    <div class="client-name">${clientName}</div>
                    <div class="client-address">${clientAddress}</div>
                    
                    <div class="info-grid">
                      <div class="info-column">
                        <div class="info-item">
                          <div class="info-label">Surf. chauffée</div>
                          <div class="info-value">${sizingNote.heatedArea || '0'} m²</div>
                        </div>
                        <div class="info-item">
                          <div class="info-label">Parcelle cadastrale</div>
                          <div class="info-value">${additionalInfo.cadastralPlot || '-'}</div>
                        </div>
                        <div class="info-item">
                          <div class="info-label">Téléphone</div>
                          <div class="info-value">${additionalInfo.phone || '-'}</div>
                        </div>
                        <div class="info-item">
                          <div class="info-label">Email</div>
                          <div class="info-value">${additionalInfo.email || '-'}</div>
                        </div>
                      </div>
                      
                      <div class="info-column">
                        <div class="info-item">
                          <div class="info-label">H. s/plafond</div>
                          <div class="info-value">${sizingNote.ceilingHeight || '0'} m</div>
                        </div>
                        <div class="info-item">
                          <div class="info-label">Altitude</div>
                          <div class="info-value">${sizingNote.altitude || '0'} m</div>
                        </div>
                        <div class="info-item">
                          <div class="info-label">Type de radiateurs existants</div>
                          <div class="info-value">${sizingNote.radiatorType || '-'}</div>
                        </div>
                        <div class="info-item">
                          <div class="info-label">Température d'eau</div>
                          <div class="info-value">${sizingNote.waterTemperature || '-'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Equipment Information Box -->
                  <div class="info-box equipment-info">
                    <h3 class="box-title">Informations sur le matériel installé</h3>
                    <div class="info-item">
                      <div class="info-label">Type de produit</div>
                      <div class="info-value">${sizingNote.productType || '-'}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Marque</div>
                      <div class="info-value">${sizingNote.productBrand || '-'}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Référence du produit</div>
                      <div class="info-value">${sizingNote.productReference || '-'}</div>
                    </div>
                  </div>
                  
                  <!-- Images -->
                  <div class="images-container">
                    <div class="image-wrapper">
                      <img src="/carte.png" alt="Carte" />
                    </div>
                    <div class="image-wrapper">
                      <img src="/tableau.png" alt="Tableau" />
                    </div>
                  </div>
                </div>
                
                <!-- Right Column -->
                <div class="right-column">
                  <!-- Sizing Box -->
                  <div class="info-box sizing-section">
                    <h3 class="box-title">Dimensionnement de l'appareil</h3>
                    
                    <div class="sizing-formula">
                      Déperditions thermiques (en Watt) = Volume à chauffer en m3 X Coeff. de construction X (T° ambiante - T° extérieure)
                    </div>
                    
                    <div class="sizing-grid">
                      <div class="info-item">
                        <div class="info-label">Volume à chauffer</div>
                        <div class="info-value">${volume} m³</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">T° ambiante souhaitée</div>
                        <div class="info-value">${sizingNote.desiredTemperature || 0}°C</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Coeff. de construction</div>
                        <div class="info-value">${sizingNote.constructionCoef || 1}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">T° extérieure de base</div>
                        <div class="info-value">${sizingNote.baseTemperature || 0}°C</div>
                      </div>
                    </div>
                    
                    <div class="calculation-step">
                      <div class="calculation-title">Détermination du G (Coeff. de construction)</div>
                      <div class="calculation-result">G (Coeff. de construction) = ${constCoef}</div>
                    </div>
                    
                    <div class="calculation-step">
                      <div class="calculation-title">Détermination de la température extérieure de base : T° ext</div>
                      <div class="calculation-result">T° ext = ${baseTemp}°C</div>
                    </div>
                    
                    <div class="calculation-step">
                      <div class="calculation-title">Détermination de ΔT</div>
                      <div class="calculation-result">ΔT = T° ambiante souhaitée - T° ext (ΔT = ${desiredTemp} - ${baseTemp})</div>
                      <div class="calculation-result">ΔT = ${deltaT}°C</div>
                    </div>
                    
                    <div class="calculation-step">
                      <div class="calculation-title">Détermination des déperditions</div>
                      <div class="calculation-result">Volume chauffé = (surface chauffée X hauteur s/plafond)</div>
                      <div class="calculation-result">Volume chauffé = ${heatedArea} m² X ${ceilingHeight} m = ${volume} m³</div>
                      <div class="calculation-result">Déperditions = ${volume} X ${constCoef} X ${deltaT} = ${heatLoss.toLocaleString('fr-FR')} Watts</div>
                    </div>
                  </div>
                  
                  <!-- Notes Section -->
                  <div class="notes-section">
                    <p>- Les déperditions calculées concernent bien uniquement les pièces du logement desservies par le réseau de chauffage.</p>
                    <p>- Les déperditions sont bien calculées sans considération des éventuels autres générateurs présents dans les pièces du logement desservies par le réseau de chauffage.</p>
                  </div>
                  
                  <!-- Results Section -->
                  <div class="results-section">
                    <div class="result-item">
                      <div class="result-label">Les déperditions du logement sont donc estimées à</div>
                      <div class="result-value">${heatLoss.toLocaleString('fr-FR')} Watts soit ${heatLossKW.toLocaleString('fr-FR')} KWs</div>
                    </div>
                    <div class="result-item">
                      <div class="result-label">Puissance définie du matériel à la T° de base</div>
                      <div class="result-value">${definedPower.toLocaleString('fr-FR')} KWs</div>
                    </div>
                    <div class="result-item">
                      <div class="result-label">Puissance à 60%</div>
                      <div class="result-value">${power60percent.toLocaleString('fr-FR')} KWs</div>
                    </div>
                    <div class="result-item">
                      <div class="result-label">Puissance à 130%</div>
                      <div class="result-value">${power130percent.toLocaleString('fr-FR')} KWs</div>
                    </div>
                  </div>
                  
                  <!-- Coverage Section -->
                  <div class="coverage-section">
                    <div class="coverage-explanation">
                      Taux de couverture par rapport aux besoins de chauffage à la T° de base (en %) : (Puissance définie du produit x 100) / Déperdition du logement)
                    </div>
                    <div class="coverage-result">${coverage.toFixed(0)} %</div>
                    
                    <div class="coverage-explanation" style="margin-top: 2mm;">
                      Le dimensionnement correct du matériel à installer est de
                    </div>
                    <div class="coverage-result">${sizingNote.dimensioning || '0'} KWs</div>
                  </div>
                  
                  <!-- Signature Section -->
                  <div class="signature-section">
                    <div class="signature-company">POUR ECOLOGY'B</div>
                    <div class="signature-details">
                      SIRET : 89131843800027<br>
                      BERREBY GEORGES, Président<br>
                      A : MARSEILLE<br>
                      LE : ${formattedDate}<br>
                      SIGNATURE ET CACHET :
                    </div>
                    <img src="/signature.png" alt="Signature" class="signature-image" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          

        </div>
      </body>
    </html>
  `;
  
  // Write the HTML content to the new tab
  newTab.document.open();
  newTab.document.write(htmlContent);
  newTab.document.close();
};