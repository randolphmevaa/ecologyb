// Sizing Note PDF Generator Module

import { 
    formatDate, 
    getCommonStyles, 
    getCompanyHeader, 
    getCompanyFooter,
    openPrintWindow,
    triggerPrint
  } from './pdf-utils';
  
  import { SizingNote } from './types';
  
  // Styles specific to the sizing note PDF
  const getSizingNoteStyles = () => `
    .info-box {
      flex: 1;
      border-radius: 2mm;
      padding: 5mm;
      margin-bottom: 10mm;
      position: relative;
    }
    
    .client-box {
      background-color: var(--extra-light-blue);
      border-left: 3px solid var(--light-blue);
    }
    
    .box-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--navy);
      margin-bottom: 4mm;
      padding-bottom: 2mm;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    
    /* Sizing Note Styling */
    .sizing-note-section {
      margin-bottom: 12mm;
      background-color: var(--extra-light-blue);
      padding: 6mm;
      border-radius: 2mm;
      border-left: 3px solid var(--light-blue);
    }
    
    .sizing-note-title {
      font-size: 16px;
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
      padding: 4mm;
      border-radius: 1mm;
    }
    
    .sizing-note-subtitle {
      font-size: 14px;
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
  `;
  
  // Generate client information HTML
  const getClientInfo = (clientName: string, quoteNumber: string, formattedDate: string) => `
    <div class="info-box client-box">
      <h3 class="box-title">Informations Client</h3>
      <div class="sizing-note-row">
        <div class="sizing-note-label">Nom</div>
        <div class="sizing-note-value">${clientName}</div>
      </div>
      <div class="sizing-note-row">
        <div class="sizing-note-label">Référence</div>
        <div class="sizing-note-value">${quoteNumber}</div>
      </div>
      <div class="sizing-note-row">
        <div class="sizing-note-label">Date</div>
        <div class="sizing-note-value">${formattedDate}</div>
      </div>
    </div>
  `;
  
  // Generate sizing notes HTML content
  const getSizingNotesContent = (sizingNotes: SizingNote[]) => {
    return sizingNotes.map((note, index) => `
      <div class="sizing-note-section">
        <h4 class="sizing-note-title">Note de dimensionnement ${index + 1} - ${note.productType}</h4>
        <div class="sizing-note-grid">
          <div class="sizing-note-row">
            <div class="sizing-note-label">Type de produit</div>
            <div class="sizing-note-value">${note.productType}</div>
          </div>
          <div class="sizing-note-row">
            <div class="sizing-note-label">Marque du produit</div>
            <div class="sizing-note-value">${note.productBrand}</div>
          </div>
          <div class="sizing-note-row">
            <div class="sizing-note-label">Référence du produit</div>
            <div class="sizing-note-value">${note.productReference}</div>
          </div>
          <div class="sizing-note-row">
            <div class="sizing-note-label">Volume</div>
            <div class="sizing-note-value">${note.volume} m³</div>
          </div>
          <div class="sizing-note-row">
          <div class="sizing-note-label">G (Coeff. de construction)</div>
          <div class="sizing-note-value">${note.constructionCoef || 1}</div>
        </div>
        <div class="sizing-note-row">
          <div class="sizing-note-label">Déperdition</div>
          <div class="sizing-note-value">${parseFloat(note.heatLoss).toLocaleString('fr-FR')} watts soit ${(parseFloat(note.heatLoss)/1000).toLocaleString('fr-FR')} kW</div>
        </div>
          <div class="sizing-note-row">
            <div class="sizing-note-label">Déperdition</div>
            <div class="sizing-note-value">${parseFloat(note.heatLoss).toLocaleString('fr-FR')} watts soit ${(parseFloat(note.heatLoss)/1000).toLocaleString('fr-FR')} kW</div>
          </div>
          <div class="sizing-note-row">
            <div class="sizing-note-label">Dimensionnement</div>
            <div class="sizing-note-value">${note.dimensioning} kW</div>
          </div>
          <div class="sizing-note-row">
            <div class="sizing-note-label">Couverture</div>
            <div class="sizing-note-value">${note.coverage}%</div>
          </div>
        </div>
        <div class="sizing-note-details">
          <h5 class="sizing-note-subtitle">Détails techniques</h5>
          <div class="sizing-note-tech-grid">
            <div class="sizing-note-tech-item">
              <div class="sizing-note-tech-label">Type de logement</div>
              <div class="sizing-note-tech-value">${note.buildingType}</div>
            </div>
            <div class="sizing-note-tech-item">
              <div class="sizing-note-tech-label">Type de radiateur</div>
              <div class="sizing-note-tech-value">${note.radiatorType}</div>
            </div>
            <div class="sizing-note-tech-item">
              <div class="sizing-note-tech-label">Température de l'eau</div>
              <div class="sizing-note-tech-value">${note.waterTemperature}</div>
            </div>
            <div class="sizing-note-tech-item">
              <div class="sizing-note-tech-label">Surface chauffée</div>
              <div class="sizing-note-tech-value">${note.heatedArea} m²</div>
            </div>
            <div class="sizing-note-tech-item">
              <div class="sizing-note-tech-label">Hauteur sous plafond</div>
              <div class="sizing-note-tech-value">${note.ceilingHeight} m</div>
            </div>
            <div class="sizing-note-tech-item">
              <div class="sizing-note-tech-label">Température de base</div>
              <div class="sizing-note-tech-value">${note.baseTemperature}°C</div>
            </div>
            <div class="sizing-note-tech-item">
              <div class="sizing-note-tech-label">Température souhaitée</div>
              <div class="sizing-note-tech-value">${note.desiredTemperature}°C</div>
            </div>
            <div class="sizing-note-tech-item">
              <div class="sizing-note-tech-label">Altitude</div>
              <div class="sizing-note-tech-value">${note.altitude} m</div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  };
  
  // Main function to generate the sizing note PDF
  export const generateSizingNotePDF = (
    quoteNumber: string,
    quoteDate: string,
    clientName: string = "Client",
    sizingNotes: SizingNote[] = []
  ) => {
    // Check if there are sizing notes
    if (sizingNotes.length === 0) {
      alert('Aucune note de dimensionnement disponible.');
      return;
    }
    
    // Open print window
    const printWindow = openPrintWindow(`Note de dimensionnement - ${quoteNumber}`);
    if (!printWindow) return;
    
    // Format date
    const formattedDate = formatDate(quoteDate);
    
    // Generate HTML content
    printWindow.document.write(`
      <html>
        <head>
          <title>Note de dimensionnement - ${quoteNumber}</title>
          <style>
            ${getCommonStyles()}
            ${getSizingNoteStyles()}
          </style>
        </head>
        <body>
          <!-- Page 1 -->
          <div class="page">
            ${getCompanyHeader()}
            
            <!-- Main Content -->
            <div class="content">
              <div class="main-content">
                <!-- Document Title -->
                <div class="document-title">
                  <div class="small-label">Document technique</div>
                  <h1 class="title">NOTE DE DIMENSIONNEMENT</h1>
                  <div class="subtitle">Devis N° <strong>${quoteNumber}</strong> | Créé le <strong>${formattedDate}</strong></div>
                </div>
                
                <!-- Basic Info -->
                ${getClientInfo(clientName, quoteNumber, formattedDate)}
                
                <!-- Sizing Notes -->
                ${getSizingNotesContent(sizingNotes)}
              </div>
            </div>
            
            ${getCompanyFooter('Page 1/1')}
          </div>
        </body>
      </html>
    `);
    
    // Trigger print
    triggerPrint(printWindow);
  };