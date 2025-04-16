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
  
  // Format a date for PDF display with fallback to current date
export const formatDate = (dateString: string): string => {
  // Try to create a date from the provided string
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    // If invalid, use current date as fallback
    return new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
  // If valid, use the provided date
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
  
// Modify the print-specific styles in getCommonStyles to preserve colors
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
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
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
    padding: 10mm 10mm 10mm 10mm
  }
  
  .logo-container {
    position: absolute;
    top: 10mm;
    left: 10mm;
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
    top: 10mm;
    right: 10mm;
    text-align: right;
    font-size: 8px;
    font-weight: 500;
    color: var(--navy);
    line-height: 1.6;
  }
  
  /* Main Content Styling */
  .main-content {
    margin-top: 100px;
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
  
  /* Header-specific styles */
  .header-band {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5mm;
    background-color: var(--light-blue);
  }
  
  .header-accent {
    position: absolute;
    top: 5mm;
    left: 0;
    right: 0;
    height: 1mm;
    background: linear-gradient(90deg, var(--navy) 0%, var(--light-navy) 100%);
  }
  
  /* Enhanced print-specific styles */
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
    
    /* Force background colors and images to print */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    
    /* Ensure gradients and background colors print correctly */
    thead, .finance-header, .footer-accent, .header-accent, .header-band, .watermark {
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
    
    .logo-container img, .company-info img {
      print-color-adjust: exact;
    }
    
    /* Make sure linear gradients print properly */
    .footer-accent, .header-accent {
      background: linear-gradient(90deg, var(--navy) 0%, var(--light-navy) 100%) !important;
    }
  }
`;

// Enhanced Header and Footer Functions with color printing support

// Function to generate HTML for the company header with enhanced color support
export const getCompanyHeader = () => `
  <!-- Logo and Certification Logo -->
  <div class="logo-container" style="display: flex; align-items: center; background: none; border: none; box-shadow: none;">
    <img src="/ecologyb.png" alt="ECOLOGY'B" style="max-height: 60px; max-width: 150px; object-fit: contain;" />
  </div>

  <div class="company-info" style="display: flex; justify-content: flex-end; align-items: center;">
    <div style="display: flex; flex-direction: column; align-items: center;">
      <img src="/logos/qualipac.png" alt="RGE QualiPac" style="max-height: 60px; max-width: 150px; object-fit: contain;" />
      <span style="font-size: 8px; margin-top: 4px;">QPAC/74310</span>
    </div>
  </div>
`;

// Function to generate HTML for the company footer with enhanced color support
export const getCompanyFooter = (pageNumber: string) => `
  <!-- Footer -->
  <div class="footer-container" style="-webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;">
    <div class="footer-content">
      <div class="footer-logo" style="color: var(--navy) !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;">ECOLOGY'B</div>
      <div class="footer-info">
        ${companyInfo.legalForm} ${companyInfo.name} | ${companyInfo.address} | Tél: ${companyInfo.phone} | Email: ${companyInfo.email} | ${companyInfo.website}<br/>
        ${companyInfo.siret} | ${companyInfo.ape} | Capital: ${companyInfo.capital} | Représentée par ${companyInfo.president} (Président)<br/>
        ${companyInfo.insurance} | ${companyInfo.tvaNumber} | ${companyInfo.rm} | ${companyInfo.qualification}
      </div>
    </div>
    <div class="footer-accent" style="background: linear-gradient(90deg, var(--navy) 0%, var(--light-navy) 100%) !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;"></div>
  </div>
  
  <div class="page-number" style="color: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;">${pageNumber}</div>
`;

// Modify the triggerPrint function to add a brief delay for the browser to properly render
export const triggerPrint = (printWindow: Window) => {
  // Add a small visible indicator that printing preparation is happening
  const loadingDiv = printWindow.document.createElement('div');
  loadingDiv.innerHTML = 'Préparation du document...';
  loadingDiv.style.position = 'fixed';
  loadingDiv.style.top = '10px';
  loadingDiv.style.right = '10px';
  loadingDiv.style.background = 'rgba(255,255,255,0.8)';
  loadingDiv.style.padding = '5px 10px';
  loadingDiv.style.borderRadius = '4px';
  loadingDiv.style.zIndex = '9999';
  printWindow.document.body.appendChild(loadingDiv);
  
  // Force image loading before printing
  const images = printWindow.document.querySelectorAll('img');
  let imagesLoaded = 0;
  const totalImages = images.length;
  
  if (totalImages === 0) {
    // No images to load, proceed with printing
    continueWithPrinting();
  } else {
    // Wait for all images to load
    images.forEach(img => {
      if (img.complete) {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
          continueWithPrinting();
        }
      } else {
        img.addEventListener('load', () => {
          imagesLoaded++;
          if (imagesLoaded === totalImages) {
            continueWithPrinting();
          }
        });
        // Handle image loading errors
        img.addEventListener('error', () => {
          imagesLoaded++;
          if (imagesLoaded === totalImages) {
            continueWithPrinting();
          }
        });
      }
    });
  }
  
  function continueWithPrinting() {
    // Increase timeout to give the browser more time to fully render
    setTimeout(() => {
      printWindow.document.body.removeChild(loadingDiv);
      printWindow.document.close();
      printWindow.focus(); // Ensure the window has focus before printing
      printWindow.print();
      // Don't close the window to allow the user to save as PDF
    }, 1500); // Increased from 1200ms to 1500ms for better rendering
  }
};

// Modify the openPrintWindow function to set document HTML with proper print settings
export const openPrintWindow = (title: string) => {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Veuillez autoriser les popups pour générer le PDF');
    return null;
  }
  
  printWindow.document.title = title;
  
  // Add meta tags for color printing
  const colorSchemeMeta = printWindow.document.createElement('meta');
  colorSchemeMeta.name = 'color-scheme';
  colorSchemeMeta.content = 'light';
  printWindow.document.head.appendChild(colorSchemeMeta);
  
  const viewportMeta = printWindow.document.createElement('meta');
  viewportMeta.name = 'viewport';
  viewportMeta.content = 'width=device-width, initial-scale=1.0';
  printWindow.document.head.appendChild(viewportMeta);
  
  // Add a special style tag specifically for print
  const printStyle = printWindow.document.createElement('style');
  printStyle.innerHTML = `
    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      @page {
        size: A4;
        margin: 0;
      }
    }
    
    /* Improve PDF viewing experience in browser tab */
    html, body {
      margin: 0;
      padding: 0;
      background-color: #e0e0e0;
      display: flex;
      justify-content: center;
      overflow-x: hidden;
    }
    
    .page {
      margin: 20px 0;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    
    /* Add some spacing between pages when viewed in browser */
    .page + .page {
      margin-top: 30px;
    }
    
    /* Add print button for easier access */
    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #213f5b;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      font-family: 'Montserrat', sans-serif;
      font-weight: 500;
      z-index: 9999;
    }
    
    .print-button:hover {
      background: #2c5480;
    }
  `;
  printWindow.document.head.appendChild(printStyle);
  
  return printWindow;
};

  