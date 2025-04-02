import React, { useState } from 'react';
import { 
  DocumentTextIcon, 
  ChevronDownIcon,
  DocumentIcon,
  DocumentCheckIcon
} from "@heroicons/react/24/outline";

// Company information for the PDF header and footer
const companyInfo = {
  name: "ECOLOGY'B",
  legalForm: "SASU",
  address: "52 AVENUE DU 8 MAI 1945 95200 SARCELLES",
  phone: "0952028136",
  email: "contact@ecologyb.fr",
  website: "www.ecologyb.fr",
  capital: "50 000 €",
  siret: "SIRET 89131843800027",
  ape: "APE 43.22B",
  tvaNumber: "TVA FR73891318438",
  president: "Berreby Georges",
  insurance: "N° Décennale H244-4795",
  rm: "Numéro d'enregistrement répertoire des métiers : 891318438RM95",
  qualification: "QPAC/74310"
};

// Brand colors
const brandColors = {
  white: "#ffffff",
  lightBlue: "#bfddf9",
  lightGreen: "#d2fcb2",
  navyBlue: "#213f5b"
};

interface PDFGeneratorProps {
  tableItems: {
    reference: string;
    name: string;
    quantity: number;
    unitPriceHT: number;
    tva: number;
    totalHT: number;
  }[];
  quoteNumber: string;
  quoteDate: string;
  clientName?: string;
  totals: {
    totalHT: number;
    totalTTC: number;
    primeCEE: number;
    primeRenov: number;
    remaining: number;
  };
  dealId?: string;
  additionalInfo?: string;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ 
  tableItems, 
  quoteNumber, 
  quoteDate, 
  clientName = "Client", 
  totals,
  dealId,
  additionalInfo
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Function to generate the Devis PDF
  const generateDevisPDF = () => {
    // Create a new window to render the PDF content
    const printWindow = window.open('', '_blank', 'width=1000,height=800');
    
    if (!printWindow) {
      alert('Veuillez autoriser les popups pour générer le PDF');
      return;
    }

    // Format date for the PDF
    const formattedDate = new Date(quoteDate).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // Apply styles to the new window
    printWindow.document.write(`
      <html>
        <head>
          <title>Devis ${quoteNumber}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
            
            :root {
              --navy: ${brandColors.navyBlue};
              --light-blue: ${brandColors.lightBlue};
              --light-green: ${brandColors.lightGreen};
              --white: ${brandColors.white};
              --light-navy: #2c5480;
              --extra-light-blue: #f0f7ff;
              --extra-light-green: #f0fff0;
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
              color: #333;
              line-height: 1.5;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              background-color: #f5f5f5;
            }
            
            .page {
              position: relative;
              width: 210mm;
              min-height: 297mm;
              margin: 0 auto;
              page-break-after: always;
              background-color: white;
              box-shadow: 0 4px 24px rgba(0,0,0,0.1);
            }
            
            .content {
              padding: 25mm 18mm 35mm 18mm;
            }
            
            /* Header Styling */
            .header-band {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 12mm;
              background: linear-gradient(90deg, var(--navy) 0%, var(--light-navy) 100%);
            }
            
            .header-accent {
              position: absolute;
              top: 12mm;
              left: 0;
              width: 10mm;
              height: 50mm;
              background: linear-gradient(180deg, var(--navy) 0%, transparent 100%);
            }
            
            .logo-container {
              position: absolute;
              top: 18mm;
              left: 18mm;
              display: flex;
              align-items: center;
            }
            
            .logo-bg {
              width: 12mm;
              height: 12mm;
              background-color: var(--navy);
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 2mm;
            }
            
            .logo-text {
              font-size: 20px;
              font-weight: 700;
              color: var(--white);
              letter-spacing: 0.5px;
            }
            
            .company-info {
              position: absolute;
              top: 20mm;
              right: 18mm;
              text-align: right;
              font-size: 8px;
              font-weight: 500;
              color: var(--navy);
              line-height: 1.6;
            }
            
            /* Main Content Styling */
            .main-content {
              margin-top: 30mm;
            }
            
            .document-title {
              position: relative;
              margin-bottom: 10mm;
            }
            
            .small-label {
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #777;
              margin-bottom: 2mm;
              font-weight: 600;
            }
            
            .title {
              font-size: 26px;
              font-weight: 700;
              color: var(--navy);
              letter-spacing: -0.5px;
              margin-bottom: 2mm;
            }
            
            .subtitle {
              font-size: 14px;
              color: #555;
            }
            
            .subtitle strong {
              color: var(--navy);
              font-weight: 600;
            }
            
            .info-grid {
              display: flex;
              gap: 10mm;
              margin-bottom: 12mm;
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
            
            /* Page 2 - Terms and Conditions */
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
            
            /* Footer Styling */
            .footer-container {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 25mm;
              background-color: #f9fafc;
              border-top: 1px solid #eee;
              overflow: hidden;
            }
            
            .footer-accent {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 5mm;
              background: linear-gradient(90deg, var(--navy) 0%, var(--light-navy) 100%);
            }
            
            .footer-content {
              position: relative;
              padding: 4mm 18mm;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            
            .footer-logo {
              font-size: 14px;
              font-weight: 700;
              color: var(--navy);
              position: relative;
              padding-bottom: 1.5mm;
            }
            
            .footer-logo::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              width: 20px;
              height: 2px;
              background-color: var(--light-green);
            }
            
            .footer-info {
              font-size: 7px;
              color: #666;
              text-align: right;
              line-height: 1.7;
            }
            
            .page-number {
              position: absolute;
              bottom: 6mm;
              right: 18mm;
              font-size: 8px;
              color: white;
              font-weight: 500;
              z-index: 10;
            }
            
            /* Watermark */
            .watermark {
              position: absolute;
              bottom: 30mm;
              right: 10mm;
              font-size: 150px;
              color: rgba(0,0,0,0.02);
              font-weight: 700;
              transform: rotate(-45deg);
              transform-origin: center;
              pointer-events: none;
              z-index: 0;
            }
            
            /* Print-specific styles */
            @media print {
              body {
                background-color: white;
              }
              
              .page {
                margin: 0;
                box-shadow: none;
              }
              
              @page {
                size: A4;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <!-- Page 1 -->
          <div class="page">
            <!-- Header Elements -->
            <div class="header-band"></div>
            <div class="header-accent"></div>
            
            <!-- Logo and Company Info -->
            <div class="logo-container">
              <div class="logo-bg">
                <div class="logo-text">E'B</div>
              </div>
            </div>
            
            <div class="company-info">
              <div>${companyInfo.legalForm} ${companyInfo.name}</div>
              <div>${companyInfo.address}</div>
              <div>Tél: ${companyInfo.phone} | Email: ${companyInfo.email}</div>
              <div>Site web: ${companyInfo.website}</div>
            </div>
            
            <!-- Watermark -->
            <div class="watermark">ECOLOGY'B</div>
            
            <!-- Main Content -->
            <div class="content">
              <div class="main-content">
                <!-- Document Title -->
                <div class="document-title">
                  <div class="small-label">Proposition commerciale</div>
                  <h1 class="title">DEVIS</h1>
                  <div class="subtitle">N° <strong>${quoteNumber}</strong> | Créé le <strong>${formattedDate}</strong></div>
                </div>
                
                <!-- Client and Devis Info -->
                <div class="info-grid">
                  <div class="info-box client-box">
                    <h3 class="box-title">Informations Client</h3>
                    <div class="info-row">
                      <div class="info-label">Nom</div>
                      <div class="info-value">${clientName}</div>
                    </div>
                    <div class="info-row">
                      <div class="info-label">Adresse</div>
                      <div class="info-value">Adresse du client</div>
                    </div>
                    <div class="info-row">
                      <div class="info-label">Code postal</div>
                      <div class="info-value">Code postal</div>
                    </div>
                    <div class="info-row">
                      <div class="info-label">Ville</div>
                      <div class="info-value">Ville</div>
                    </div>
                    <div class="info-row">
                      <div class="info-label">Téléphone</div>
                      <div class="info-value">Téléphone du client</div>
                    </div>
                    <div class="info-row">
                      <div class="info-label">Email</div>
                      <div class="info-value">Email du client</div>
                    </div>
                  </div>
                  
                  <div class="info-box details-box">
                    <h3 class="box-title">Détails du Devis</h3>
                    <div class="info-row">
                      <div class="info-label">N° Devis</div>
                      <div class="info-value">${quoteNumber}</div>
                    </div>
                    <div class="info-row">
                      <div class="info-label">Date</div>
                      <div class="info-value">${formattedDate}</div>
                    </div>
                    <div class="info-row">
                      <div class="info-label">Validité</div>
                      <div class="info-value">30 jours</div>
                    </div>
                    ${dealId ? `
                    <div class="info-row">
                      <div class="info-label">Deal</div>
                      <div class="info-value">${dealId}</div>
                    </div>
                    ` : ''}
                    <div class="info-row">
                      <div class="info-label">Consultant</div>
                      <div class="info-value">${companyInfo.president}</div>
                    </div>
                    <div class="info-row">
                      <div class="info-label">Ref. Client</div>
                      <div class="info-value">ECO-${Math.floor(1000 + Math.random() * 9000)}</div>
                    </div>
                  </div>
                </div>
                
                <!-- Products Table -->
                <h3 class="section-title">Détail des prestations</h3>
                <div class="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th style="width: 40%">Désignation</th>
                        <th style="width: 10%">Qté</th>
                        <th style="width: 15%">Prix unitaire HT</th>
                        <th style="width: 10%">TVA</th>
                        <th style="width: 25%">Total HT</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${tableItems.map(item => `
                        <tr>
                          <td>
                            <div class="item-name">${item.reference}</div>
                            <div class="item-desc">${item.name.replace(/<[^>]*>/g, '')}</div>
                          </td>
                          <td>${item.reference === 'MENTION DÉCHETS' ? '' : item.quantity}</td>
                          <td>${item.reference === 'MENTION DÉCHETS' ? '' : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.unitPriceHT)}</td>
                          <td>${item.reference === 'MENTION DÉCHETS' ? '' : item.tva + '%'}</td>
                          <td>${item.reference === 'MENTION DÉCHETS' ? '' : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.totalHT)}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
                
                <!-- Financial Summary -->
                <div class="finance-wrapper">
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
                    ${dealId ? `
                      <div class="finance-row primes">
                        <div class="finance-label">Prime ${dealId}</div>
                        <div class="finance-value">-${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totals.primeCEE)}</div>
                      </div>
                      <div class="finance-row primes">
                        <div class="finance-label">MaPrimeRenov'</div>
                        <div class="finance-value">-${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totals.primeRenov)}</div>
                      </div>
                    ` : ''}
                    <div class="final-total">
                      <div class="finance-label">Reste à payer</div>
                      <div class="finance-value">${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totals.remaining)}</div>
                    </div>
                  </div>
                </div>
                
                ${additionalInfo ? `
                <!-- Additional Information -->
                <div class="additional-section">
                  <h3 class="additional-title">Informations complémentaires</h3>
                  <div class="additional-content">${additionalInfo}</div>
                </div>
                ` : ''}
                
                <!-- Signature Section -->
                <div class="signature-section">
                  <div class="signature-box signature-company">
                    <div class="signature-title">Signature du prestataire</div>
                    <span class="signature-line"></span>
                    <div class="signature-date">Fait à Sarcelles, le ${formattedDate}</div>
                    <div class="signature-note">Signature et cachet</div>
                  </div>
                  <div class="signature-box signature-client">
                    <div class="signature-title">Signature du client</div>
                    <span class="signature-line"></span>
                    <div class="signature-date">Fait à ________________, le ____ / ____ / ________</div>
                    <div class="signature-note">Bon pour accord</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer-container">
              <div class="footer-content">
                <div class="footer-logo">ECOLOGY'B</div>
                <div class="footer-info">
                  ${companyInfo.legalForm} ${companyInfo.name} | ${companyInfo.address} | Tél: ${companyInfo.phone} | Email: ${companyInfo.email} | ${companyInfo.website}<br/>
                  ${companyInfo.siret} | ${companyInfo.ape} | Capital: ${companyInfo.capital} | Représentée par ${companyInfo.president} (Président)<br/>
                  ${companyInfo.insurance} | ${companyInfo.tvaNumber} | ${companyInfo.rm} | ${companyInfo.qualification}
                </div>
              </div>
              <div class="footer-accent"></div>
            </div>
            
            <div class="page-number">Page 1/2</div>
          </div>
          
          <!-- Page 2 -->
          <div class="page">
            <!-- Header Elements -->
            <div class="header-band"></div>
            <div class="header-accent"></div>
            
            <!-- Logo and Company Info -->
            <div class="logo-container">
              <div class="logo-bg">
                <div class="logo-text">E'B</div>
              </div>
            </div>
            
            <div class="company-info">
              <div>${companyInfo.legalForm} ${companyInfo.name}</div>
              <div>${companyInfo.address}</div>
              <div>Tél: ${companyInfo.phone} | Email: ${companyInfo.email}</div>
              <div>Site web: ${companyInfo.website}</div>
            </div>
            
            <!-- Watermark -->
            <div class="watermark">ECOLOGY'B</div>
            
            <!-- Main Content -->
            <div class="content">
              <div class="main-content">
                <!-- Document Title -->
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
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer-container">
              <div class="footer-content">
                <div class="footer-logo">ECOLOGY'B</div>
                <div class="footer-info">
                  ${companyInfo.legalForm} ${companyInfo.name} | ${companyInfo.address} | Tél: ${companyInfo.phone} | Email: ${companyInfo.email} | ${companyInfo.website}<br/>
                  ${companyInfo.siret} | ${companyInfo.ape} | Capital: ${companyInfo.capital} | Représentée par ${companyInfo.president} (Président)<br/>
                  ${companyInfo.insurance} | ${companyInfo.tvaNumber} | ${companyInfo.rm} | ${companyInfo.qualification}
                </div>
              </div>
              <div class="footer-accent"></div>
            </div>
            
            <div class="page-number">Page 2/2</div>
          </div>
        </body>
      </html>
    `);

    // Print the window to generate PDF
    setTimeout(() => {
      printWindow.document.close();
      printWindow.print();
      // Don't close the window to allow the user to save as PDF
    }, 800);
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
                onClick={() => {
                  generateDevisPDF();
                  setDropdownVisible(false);
                }}
              >
                <DocumentIcon className="h-4 w-4 text-blue-500" />
                <span>Devis</span>
              </div>
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