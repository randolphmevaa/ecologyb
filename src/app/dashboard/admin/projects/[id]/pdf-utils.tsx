// PDF Utils Module - Common functions and styles for PDF generation

// Company information for the PDF header and footer
export const companyInfo = {
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
  export const brandColors = {
    white: "#ffffff",
    lightBlue: "#bfddf9",
    lightGreen: "#d2fcb2",
    navyBlue: "#213f5b"
  };
  
  // Format a date for PDF display
  export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Common CSS styles for PDFs
  export const getCommonStyles = () => `
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
      padding: 10mm 18mm 35mm 18mm;
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
      margin-bottom: 0mm;
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
  `;

  // Function to generate HTML for the company header
  export const getCompanyHeader = () => `
  <!-- Header Elements -->
  <div class="header-band"></div>
  <div class="header-accent"></div>

  <!-- Logo and Certification Logo -->
  <div class="logo-container" style="display: flex; align-items: center; background: none; border: none; box-shadow: none;">
    <img src="/ecologyb.png" alt="ECOLOGY'B" style="max-height: 60px; max-width: 150px; object-fit: contain;" />
  </div>

  <div class="company-info" style="display: flex; justify-content: flex-end; align-items: center;">
    <img src="/logos/qualipac.png" alt="RGE QualiPac" style="max-height: 60px; max-width: 150px; object-fit: contain;" />
  </div>

  <!-- Watermark -->
  <div class="watermark">ECOLOGY'B</div>
  `;
  
  // Function to generate HTML for the company footer
  export const getCompanyFooter = (pageNumber: string) => `
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
    
    <div class="page-number">${pageNumber}</div>
  `;
  
  // Utility function to open a print window
  export const openPrintWindow = (title: string) => {
    const printWindow = window.open('', '_blank', 'width=1000,height=800');
    
    if (!printWindow) {
      alert('Veuillez autoriser les popups pour générer le PDF');
      return null;
    }
    
    printWindow.document.title = title;
    return printWindow;
  };
  
  // Utility function to trigger printing
  export const triggerPrint = (printWindow: Window) => {
    setTimeout(() => {
      printWindow.document.close();
      printWindow.print();
      // Don't close the window to allow the user to save as PDF
    }, 800);
  };

  