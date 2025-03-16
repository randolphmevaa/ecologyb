"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  BuildingOfficeIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
  PencilIcon,
  // ArrowLeftIcon,
  InformationCircleIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  BanknotesIcon,
  // UserIcon,
} from "@heroicons/react/24/outline";
import { PrinterIcon } from "lucide-react";

/** ---------------------
 *     TYPE DEFINITIONS
 *  --------------------- */
interface UserInfo {
  _id: string;
  // Add other properties as needed
}

interface CompanyInfo {
  name: string;
  address: string;
  cityZip: string;
  email: string;
  phone: string;
  siret: string;
  logo: string | null;
  website: string;
  tvaNumber: string;
}

interface PaymentInfo {
  method: string;
  iban: string;
  bic: string;
  bankName: string;
  accountName: string;
  paymentDeadline: number;
  latePaymentRate: number;
}

interface InvoiceTerms {
  paymentTerms: string;
  legalNotice: string;
  thankYouMessage: string;
  footerNote: string;
}

type SaveStatus = null | 'success' | 'error';
type TabKey = 'company' | 'payment' | 'invoice' | 'preview';

interface FormFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  tooltip?: string | null;
  placeholder?: string;
  icon?: React.ReactNode;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

interface TextareaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  tooltip?: string | null;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

interface TooltipProps {
  id: string;
  text: string;
}

/** ---------------------
 *     MAIN COMPONENT
 *  --------------------- */
export default function ReglagesPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("company");
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<string>("");
  
  // Company information state with empty initial values
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "",
    address: "",
    cityZip: "",
    email: "",
    phone: "",
    siret: "",
    logo: null, // For future logo upload
    website: "",
    tvaNumber: "",
  });

  // Payment information state with empty initial values
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: "",
    iban: "",
    bic: "",
    bankName: "",
    accountName: "",
    paymentDeadline: 0, // Days
    latePaymentRate: 0, // Percentage
  });
  
  // Invoice terms state with empty initial values
  const [invoiceTerms, setInvoiceTerms] = useState<InvoiceTerms>({
    paymentTerms: "",
    legalNotice: "",
    thankYouMessage: "",
    footerNote: "",
  });
  
  // Load user info from localStorage
  useEffect(() => {
    const proInfo = localStorage.getItem("proInfo");
    if (proInfo) {
      const parsedInfo = JSON.parse(proInfo);
      console.log("User info from localStorage:", parsedInfo);
      setUserInfo(parsedInfo);
    } else {
      console.log("No user info found in localStorage");
    }
  }, []);

  // Load company and payment information from API
  useEffect(() => {
    if (!userInfo) return;
    
    async function fetchReglagesData() {
      try {
        setLoading(true);
        console.log("Fetching user settings with ID:", userInfo?._id);
        // Fetch data from the API
        const response = await fetch(`/api/users?id=${userInfo?._id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }
        
        const data = await response.json();
        console.log("API Response:", data);
        console.log("Profile data:", data.profile);
        
        // Data is nested under the profile object
        if (data.profile && data.profile.companyInfo) {
          console.log("Setting company info:", data.profile.companyInfo);
          setCompanyInfo(data.profile.companyInfo);
        }
        
        if (data.profile && data.profile.paymentInfo) {
          console.log("Setting payment info:", data.profile.paymentInfo);
          setPaymentInfo(data.profile.paymentInfo);
        }
        
        if (data.profile && data.profile.invoiceTerms) {
          console.log("Setting invoice terms:", data.profile.invoiceTerms);
          setInvoiceTerms(data.profile.invoiceTerms);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        // Fields remain empty if fetch fails
      } finally {
        setLoading(false);
      }
    }
    
    fetchReglagesData();
  }, [userInfo]);

  // Handle form field changes - simple implementation to maintain focus
  const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Use a timeout to delay setting hasChanges
    if (!hasChanges) {
      setTimeout(() => {
        setHasChanges(true);
      }, 100);
    }
  };

  // Handle payment info changes - simple implementation to maintain focus
  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const processedValue = name === 'paymentDeadline' || name === 'latePaymentRate' 
      ? (value === '' ? '' : parseFloat(value) || 0) 
      : value;
      
    setPaymentInfo(prev => ({
      ...prev,
      [name]: processedValue,
    }));
    
    if (!hasChanges) {
      setTimeout(() => {
        setHasChanges(true);
      }, 100);
    }
  };
  
  // Handle invoice terms changes - simple implementation to maintain focus
  const handleInvoiceTermsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceTerms(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Use a timeout to delay setting hasChanges
    if (!hasChanges) {
      setTimeout(() => {
        setHasChanges(true);
      }, 100);
    }
  };

  // Handle form submission
const handleSubmit = async (e?: React.FormEvent) => {
  if (e) e.preventDefault();
  
  try {
    setLoading(true);
    setSaveStatus(null);
    
    // Get the user info from localStorage
    const proInfoString = localStorage.getItem("proInfo");
    if (!proInfoString) {
      setSaveStatus('error');
      return;
    }
    
    // Parse the user info to extract the _id
    const proInfo = JSON.parse(proInfoString);
    const userId = proInfo._id;
    
    if (!userId) {
      setSaveStatus('error');
      return;
    }
    
    // Structure the data according to what the API expects
    const dataToSave = {
      profile: {
        // Company info
        companyInfo: companyInfo,
        // Payment info
        paymentInfo: paymentInfo,
        // Invoice terms
        invoiceTerms: invoiceTerms
      }
    };
    
    // Make a PATCH request to the specified endpoint
    const response = await fetch(`/api/users?id=${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSave),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save settings');
    }
    
    const result = await response.json();
    console.log('Update result:', result);
    
    setSaveStatus('success');
    setHasChanges(false);
    
    // Enable auto-save after the first manual save
    setAutoSaveEnabled(true);
    
    // Reset status after a delay
    setTimeout(() => {
      setSaveStatus(null);
    }, 3000);
    
  } catch (error) {
    console.error('Error saving settings:', error);
    setSaveStatus('error');
  } finally {
    setLoading(false);
  }
};
  
  // Add a state to track if auto-save should be enabled
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(false);
  
  // Auto-save when changes are made (with debounce) - only if enabled
  useEffect(() => {
    if (!hasChanges || !autoSaveEnabled) return;
    
    const timer = setTimeout(() => {
      handleSubmit();
    }, 8000); // Auto-save after 2 seconds of inactivity
    
    return () => clearTimeout(timer);
  }, [companyInfo, paymentInfo, invoiceTerms, hasChanges, autoSaveEnabled]);
  
  // Status notification component
  const StatusNotification = () => {
    if (!saveStatus) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-20 right-6 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          saveStatus === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
                                    'bg-red-50 text-red-800 border border-red-200'
        }`}
      >
        {saveStatus === 'success' ? (
          <CheckCircleIcon className="h-5 w-5 text-green-600" />
        ) : (
          <ExclamationCircleIcon className="h-5 w-5 text-red-600" />
        )}
        <span>
          {saveStatus === 'success' 
            ? `Paramètres enregistrés avec succès ${autoSaveEnabled ? '(Auto-save activé)' : ''}` 
            : 'Erreur lors de l\'enregistrement des paramètres'}
        </span>
      </motion.div>
    );
  };
  
  // Tooltip component with improved mobile support
  const Tooltip = ({ id, text }: TooltipProps) => {
    if (showTooltip !== id) return null;
    
    return (
      <div
        className="absolute z-10 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg"
        style={{ 
          transform: 'translateY(-100%)', 
          marginTop: '-8px',
          maxWidth: '90vw',  // Ensure tooltip doesn't go off-screen on mobile
          right: '0'         // Align to the right for better mobile viewing
        }}
      >
        {text}
        <div className="absolute -bottom-1 right-4 w-3 h-3 bg-gray-800 rotate-45" />
      </div>
    );
  };
  
  // Input field with label component - improved for mobile, focus handling
  const FormField = ({ 
    label, 
    name, 
    value, 
    onChange, 
    type = "text", 
    tooltip = null,
    placeholder = "",
    icon = null,
    required = false,
    min,
    max,
    step,
    className = ""
  }: FormFieldProps) => {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {tooltip && (
            <div 
              className="relative inline-block"
              onMouseEnter={() => setShowTooltip(name)}
              onMouseLeave={() => setShowTooltip("")}
              onClick={() => setShowTooltip(showTooltip === name ? "" : name)} // Toggle on mobile touch
            >
              <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
              <Tooltip id={name} text={tooltip} />
            </div>
          )}
        </div>
        <div className="relative rounded-md shadow-sm">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {icon}
            </div>
          )}
          <input
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            required={required}
            className={`block w-full rounded-lg border-gray-300 ${icon ? 'pl-10' : 'pl-3'} pr-3 py-3 
              focus:border-[#213f5b] focus:ring focus:ring-[#213f5b]/20 focus:ring-opacity-50 
              transition-all duration-200 ease-in-out
              placeholder:text-gray-400 text-gray-800 bg-white text-base
              hover:border-gray-400`}
          />
        </div>
      </div>
    );
  };
  
  // Textarea field component - improved for mobile, focus handling
  const TextareaField = ({ 
    label, 
    name, 
    value, 
    onChange, 
    rows = 3,
    tooltip = null,
    placeholder = "",
    required = false,
    className = ""
  }: TextareaFieldProps) => {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {tooltip && (
            <div 
              className="relative inline-block"
              onMouseEnter={() => setShowTooltip(name)}
              onMouseLeave={() => setShowTooltip("")}
              onClick={() => setShowTooltip(showTooltip === name ? "" : name)} // Toggle on mobile touch
            >
              <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
              <Tooltip id={name} text={tooltip} />
            </div>
          )}
        </div>
        <textarea
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          required={required}
          className="block w-full rounded-lg border-gray-300 p-3 text-base
            focus:border-[#213f5b] focus:ring focus:ring-[#213f5b]/20 focus:ring-opacity-50 
            transition-all duration-200 ease-in-out
            placeholder:text-gray-400 text-gray-800 bg-white
            hover:border-gray-400"
        />
      </div>
    );
  };
  
  // Section titles
  const sectionTitles: Record<TabKey, string> = {
    company: "Informations de la Régie",
    payment: "Informations de Paiement",
    invoice: "Conditions de Facturation",
    preview: "Aperçu des Factures"
  };
  
  // Section icons
  const sectionIcons: Record<TabKey, React.ReactNode> = {
    company: <BuildingOfficeIcon className="h-5 w-5" />,
    payment: <BanknotesIcon className="h-5 w-5" />,
    invoice: <DocumentTextIcon className="h-5 w-5" />,
    preview: <CreditCardIcon className="h-5 w-5" />
  };

  // Preview component with responsive improvements and handling of empty values
  const InvoicePreview = () => (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-8 mt-4 overflow-x-auto">
      <div className="min-w-[600px]"> {/* Set minimum width to ensure readability */}
        <div className="flex justify-between mb-8">
          <div>
            <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
              Logo
            </div>
            <div className="mt-2">
              <h3 className="font-bold">{companyInfo.name || 'Nom de l\'entreprise'}</h3>
              <p className="text-sm text-gray-600">{companyInfo.address || 'Adresse'}</p>
              <p className="text-sm text-gray-600">{companyInfo.cityZip || 'Code postal, Ville'}</p>
              <p className="text-sm text-gray-600">
                {companyInfo.phone ? `Tél: ${companyInfo.phone}` : 'Tél: -'} | {companyInfo.email ? `Email: ${companyInfo.email}` : 'Email: -'}
              </p>
              <p className="text-sm text-gray-600">SIRET: {companyInfo.siret || '-'}</p>
              {companyInfo.tvaNumber && <p className="text-sm text-gray-600">TVA: {companyInfo.tvaNumber}</p>}
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-800">FACTURE</h2>
            <p className="text-gray-600">N° XXXXXX</p>
            <p className="text-gray-600">Date: {new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
        
        <div className="border-t border-b py-4 my-4">
          <h3 className="font-medium">Client</h3>
          <p>Nom du Client</p>
          <p>Adresse du Client</p>
          <p>Code Postal, Ville</p>
        </div>
        
        <table className="min-w-full mt-8">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Description</th>
              <th className="text-right py-2">Prix unitaire</th>
              <th className="text-right py-2">Quantité</th>
              <th className="text-right py-2">Total HT</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Prestation exemple</td>
              <td className="text-right">1 000,00 €</td>
              <td className="text-right">1</td>
              <td className="text-right">1 000,00 €</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right py-2 font-medium">Total HT</td>
              <td className="text-right">1 000,00 €</td>
            </tr>
            <tr>
              <td colSpan={3} className="text-right py-2 font-medium">TVA (20%)</td>
              <td className="text-right">200,00 €</td>
            </tr>
            <tr className="font-bold">
              <td colSpan={3} className="text-right py-2">Total TTC</td>
              <td className="text-right">1 200,00 €</td>
            </tr>
          </tfoot>
        </table>
        
        <div className="mt-8 pt-4 border-t">
          <h4 className="font-medium mb-2">Conditions de paiement</h4>
          <p className="text-sm">{invoiceTerms.paymentTerms || 'Aucune condition de paiement spécifiée'}</p>
        </div>
        
        <div className="mt-4 pt-2">
          <p className="text-sm">{invoiceTerms.thankYouMessage || ''}</p>
        </div>
        
        <div className="mt-8 pt-4 border-t text-xs text-gray-500 text-center">
          <p>{invoiceTerms.legalNotice || 'Aucune mention légale spécifiée'}</p>
          <p className="mt-2">{invoiceTerms.footerNote || ''}</p>
        </div>
        
        <div className="mt-4 pt-2 border-t">
          <div className="flex justify-between text-sm text-gray-600">
            <div>
              <p>Mode de paiement: {paymentInfo.method || '-'}</p>
              <p>IBAN: {paymentInfo.iban || '-'}</p>
              <p>BIC: {paymentInfo.bic || '-'}</p>
            </div>
            <div className="text-right">
              <p>{companyInfo.website || '-'}</p>
              <p>{companyInfo.email || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar for navigation */}
      <div className="hidden lg:block w-64 bg-gray-50 border-r border-gray-200">
        <div className="h-16 flex items-center px-6 border-b">
          <Cog6ToothIcon className="h-6 w-6 text-[#213f5b]" />
          <span className="ml-2 text-lg font-medium text-[#213f5b]">Paramètres</span>
        </div>
        <nav className="px-3 py-4">
          {(Object.keys(sectionTitles) as TabKey[]).map(key => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium mb-1
                ${activeTab === key 
                  ? 'bg-[#213f5b] text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100'}
                transition-all duration-200
              `}
            >
              <span className={`${activeTab === key ? 'text-white' : 'text-[#213f5b]'}`}>
                {sectionIcons[key]}
              </span>
              <span className="ml-3">{sectionTitles[key]}</span>
              <ChevronRightIcon className="h-4 w-4 ml-auto" />
            </button>
          ))}
        </nav>
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <AnimatePresence>
          {saveStatus && <StatusNotification />}
        </AnimatePresence>
        
        <main
          className="flex-1 overflow-y-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(191,221,249,0.1) 0%, rgba(210,252,178,0.05) 100%)",
            backgroundAttachment: "fixed",
          }}
        >
          {/* Mobile tab navigation - Improved for better usability */}
          <div className="lg:hidden mb-6">
            <div className="grid grid-cols-2 gap-2 pb-1">
              {(Object.keys(sectionTitles) as TabKey[]).map(key => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center justify-center px-3 py-3 rounded-lg text-sm font-medium
                    ${activeTab === key 
                      ? 'bg-[#213f5b] text-white shadow-md' 
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}
                    transition-all duration-200
                  `}
                >
                  <span className={`mr-1.5 ${activeTab === key ? 'text-white' : 'text-[#213f5b]'}`}>
                    {sectionIcons[key]}
                  </span>
                  <span className="text-xs sm:text-sm">{sectionTitles[key]}</span>
                </button>
              ))}
            </div>
          </div>
          
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#213f5b]">
                    {sectionTitles[activeTab]}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {activeTab === "company" && "Gérez les informations de votre régie"}
                    {activeTab === "payment" && "Configurez vos préférences de paiement"}
                    {activeTab === "invoice" && "Personnalisez les conditions de vos factures"}
                    {activeTab === "preview" && "Aperçu de vos factures"}
                  </p>
                </div>
                
                <div className="flex items-center gap-3 mt-3 sm:mt-0">
                  {/* Auto-save toggle for non-preview tabs */}
                  {activeTab !== "preview" && (
                    <div className="flex items-center mr-2">
                      <label className="flex items-center cursor-pointer">
                        <span className="mr-2 text-sm text-gray-600">Auto-save</span>
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={autoSaveEnabled}
                            onChange={() => setAutoSaveEnabled(!autoSaveEnabled)}
                          />
                          <div className={`block w-10 h-6 rounded-full ${autoSaveEnabled ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                          <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${autoSaveEnabled ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                      </label>
                    </div>
                  )}
                
                  {activeTab !== "preview" && (
                    <button
                      onClick={handleSubmit}
                      className={`px-4 py-2 rounded-lg shadow-sm text-sm font-medium transition-all
                        ${hasChanges 
                          ? 'bg-gradient-to-br from-[#213f5b] to-[#0f2b47] text-white hover:shadow-md active:shadow-inner' 
                          : 'bg-gray-100 text-gray-500'}
                      `}
                    >
                      {loading ? (
                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <CheckCircleIcon className="h-4 w-4" />
                          Enregistrer
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Company Information Tab */}
              {activeTab === "company" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 sm:p-6 md:p-8">
                    {/* Info message when no company data is found */}
                    {!companyInfo.name && !companyInfo.address && !companyInfo.siret && (
                      <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-start">
                          <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-blue-800">Pas d&apos;informations trouvées</h4>
                            <p className="mt-1 text-sm text-blue-600">
                              Veuillez remplir les informations de votre entreprise pour les afficher sur vos factures.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-6">
                      <FormField
                        label="Nom de l'entreprise"
                        name="name"
                        value={companyInfo.name}
                        onChange={handleCompanyInfoChange}
                        required={true}
                        placeholder="Nom de votre régie"
                        tooltip="Ce nom apparaîtra sur tous vos documents officiels"
                        icon={<BuildingOfficeIcon className="h-5 w-5 text-gray-400" />}
                      />
                      
                      <FormField
                        label="Site Web"
                        name="website"
                        value={companyInfo.website}
                        onChange={handleCompanyInfoChange}
                        placeholder="www.exemple.com"
                        tooltip="L'URL de votre site web professionnel"
                      />
                      
                      <FormField
                        label="Adresse"
                        name="address"
                        value={companyInfo.address}
                        onChange={handleCompanyInfoChange}
                        placeholder="Numéro et rue"
                        tooltip="L'adresse physique de votre entreprise"
                        className="md:col-span-2"
                      />
                      
                      <FormField
                        label="Code postal et ville"
                        name="cityZip"
                        value={companyInfo.cityZip}
                        onChange={handleCompanyInfoChange}
                        placeholder="75000 Paris, France"
                      />
                      
                      <FormField
                        label="Numéro SIRET"
                        name="siret"
                        value={companyInfo.siret}
                        onChange={handleCompanyInfoChange}
                        placeholder="123 456 789 00012"
                        tooltip="Votre numéro SIRET à 14 chiffres"
                      />
                      
                      <FormField
                        label="Email professionnel"
                        name="email"
                        type="email"
                        value={companyInfo.email}
                        onChange={handleCompanyInfoChange}
                        placeholder="contact@votreentreprise.com"
                        icon={<InformationCircleIcon className="h-5 w-5 text-gray-400" />}
                      />
                      
                      <FormField
                        label="Téléphone"
                        name="phone"
                        value={companyInfo.phone}
                        onChange={handleCompanyInfoChange}
                        placeholder="01 23 45 67 89"
                      />
                      
                      <FormField
                        label="Numéro de TVA"
                        name="tvaNumber"
                        value={companyInfo.tvaNumber}
                        onChange={handleCompanyInfoChange}
                        placeholder="FR 01 123456789"
                        tooltip="Votre numéro d'identification à la TVA, si applicable"
                      />
                    </div>
                    
                    <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-start">
                        <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-blue-800">Logo de l&apos;entreprise</h4>
                          <p className="mt-1 text-sm text-blue-600">
                            L&apos;ajout d&apos;un logo sera bientôt disponible. Il apparaîtra sur toutes vos factures
                            et documents officiels.
                          </p>
                          <button
                            className="mt-3 inline-flex items-center px-3 py-1.5 bg-white border border-blue-200 rounded-md text-xs text-blue-800 hover:bg-blue-50"
                            disabled
                          >
                            <PencilIcon className="h-3.5 w-3.5 mr-1" />
                            Ajouter un logo
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Payment Information Tab */}
              {activeTab === "payment" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 sm:p-6 md:p-8">
                    {/* Info message when no payment data is found */}
                    {!paymentInfo.method && !paymentInfo.iban && !paymentInfo.bankName && (
                      <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-start">
                          <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-blue-800">Pas d&apos;informations de paiement trouvées</h4>
                            <p className="mt-1 text-sm text-blue-600">
                              Veuillez remplir vos informations de paiement pour faciliter les règlements de vos factures.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-6">
                      <FormField
                        label="Mode de paiement"
                        name="method"
                        value={paymentInfo.method}
                        onChange={handlePaymentInfoChange}
                        placeholder="Ex: Virement bancaire"
                        tooltip="Le mode de paiement préféré pour vos factures"
                        icon={<CreditCardIcon className="h-5 w-5 text-gray-400" />}
                      />
                      
                      <FormField
                        label="Nom de la banque"
                        name="bankName"
                        value={paymentInfo.bankName}
                        onChange={handlePaymentInfoChange}
                        placeholder="Ex: Banque Nationale"
                      />
                      
                      <FormField
                        label="Nom du compte"
                        name="accountName"
                        value={paymentInfo.accountName}
                        onChange={handlePaymentInfoChange}
                        placeholder="Ex: Ma Régie SARL"
                        tooltip="Le nom associé à votre compte bancaire"
                      />
                      
                      <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Coordonnées bancaires</h3>
                      </div>
                      
                      <FormField
                        label="IBAN"
                        name="iban"
                        value={paymentInfo.iban}
                        onChange={handlePaymentInfoChange}
                        placeholder="FR76 1234 5678 9012 3456 7890 123"
                        tooltip="Votre numéro de compte bancaire international"
                        className="md:col-span-2"
                      />
                      
                      <FormField
                        label="BIC / SWIFT"
                        name="bic"
                        value={paymentInfo.bic}
                        onChange={handlePaymentInfoChange}
                        placeholder="ABCDEFGHIJK"
                        tooltip="Code d'identification de votre banque"
                        className="md:col-span-2"
                      />
                      
                      <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Conditions de paiement</h3>
                      </div>
                      
                      <FormField
                        label="Délai de paiement (jours)"
                        name="paymentDeadline"
                        type="number"
                        value={paymentInfo.paymentDeadline}
                        onChange={handlePaymentInfoChange}
                        min={0}
                        max={90}
                        tooltip="Nombre de jours accordés au client pour régler la facture"
                      />
                      
                      <FormField
                        label="Taux de pénalité de retard (%)"
                        name="latePaymentRate"
                        type="number"
                        value={paymentInfo.latePaymentRate}
                        onChange={handlePaymentInfoChange}
                        min={0}
                        max={20}
                        step={0.1}
                        tooltip="Taux annuel des pénalités en cas de retard de paiement"
                      />
                    </div>
                    
                    <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-100">
                      <div className="flex items-start">
                        <InformationCircleIcon className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-amber-800">Note importante</h4>
                          <p className="mt-1 text-sm text-amber-600">
                            Ces coordonnées bancaires apparaîtront sur toutes vos factures. Assurez-vous qu&apos;elles sont correctes
                            pour éviter tout retard de paiement.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Invoice Terms Tab */}
              {activeTab === "invoice" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 sm:p-6 md:p-8">
                    {/* Info message when no invoice terms are found */}
                    {!invoiceTerms.paymentTerms && !invoiceTerms.legalNotice && (
                      <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-start">
                          <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-blue-800">Pas de conditions de facturation trouvées</h4>
                            <p className="mt-1 text-sm text-blue-600">
                              Veuillez définir vos conditions de facturation et mentions légales pour les afficher sur vos factures.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="space-y-4 sm:space-y-6">
                      <TextareaField
                        label="Conditions de paiement"
                        name="paymentTerms"
                        value={invoiceTerms.paymentTerms}
                        onChange={handleInvoiceTermsChange}
                        rows={3}
                        placeholder="Décrivez vos conditions de paiement..."
                        tooltip="Ces conditions apparaîtront sur toutes vos factures"
                      />
                      
                      <TextareaField
                        label="Mentions légales"
                        name="legalNotice"
                        value={invoiceTerms.legalNotice}
                        onChange={handleInvoiceTermsChange}
                        rows={3}
                        placeholder="Mentions légales obligatoires..."
                        tooltip="Mentions légales obligatoires (TVA, CGV, etc.)"
                      />
                      
                      <TextareaField
                        label="Message de remerciement"
                        name="thankYouMessage"
                        value={invoiceTerms.thankYouMessage}
                        onChange={handleInvoiceTermsChange}
                        rows={2}
                        placeholder="Un message de remerciement pour vos clients..."
                        tooltip="Un message de remerciement personnalisé"
                      />
                      
                      <TextareaField
                        label="Note de bas de page"
                        name="footerNote"
                        value={invoiceTerms.footerNote}
                        onChange={handleInvoiceTermsChange}
                        rows={2}
                        placeholder="Informations complémentaires en pied de facture..."
                        tooltip="Informations complémentaires en pied de facture"
                      />
                    </div>
                    
                    <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                      <div className="flex items-start">
                        <InformationCircleIcon className="h-5 w-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-indigo-800">Aide à la conformité</h4>
                          <p className="mt-1 text-sm text-indigo-600">
                            Assurez-vous que vos mentions légales sont conformes à la réglementation française.
                            Les factures doivent inclure votre numéro SIRET, numéro de TVA (si applicable),
                            et les conditions de paiement.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Preview Tab */}
              {activeTab === "preview" && (
                <div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <h3 className="text-lg font-medium text-gray-800">Aperçu de la facture</h3>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button className="px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-gray-100 text-gray-700 flex items-center gap-1.5 hover:bg-gray-200 transition-colors">
                          <PrinterIcon className="h-4 w-4" />
                          <span className="hidden xs:inline">Imprimer</span>
                        </button>
                        <button className="px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-[#213f5b] text-white flex items-center gap-1.5 hover:bg-[#152a3f] transition-colors">
                          <ArrowPathIcon className="h-4 w-4" />
                          <span className="hidden xs:inline">Actualiser</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Auto-save toggle */}
                    <div className="mt-4 flex items-center justify-end">
                      <label className="flex items-center cursor-pointer">
                        <span className="mr-2 text-sm text-gray-600">Auto-save</span>
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={autoSaveEnabled}
                            onChange={() => setAutoSaveEnabled(!autoSaveEnabled)}
                          />
                          <div className={`block w-10 h-6 rounded-full ${autoSaveEnabled ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                          <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${autoSaveEnabled ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                      </label>
                    </div>
                    
                    {/* Warning when important data is missing */}
                    {(!companyInfo.name || !companyInfo.siret) && (
                      <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="flex items-start">
                          <InformationCircleIcon className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-amber-800">Données incomplètes</h4>
                            <p className="mt-1 text-sm text-amber-600">
                              Certaines informations importantes manquent pour générer une facture complète. 
                              Veuillez compléter les onglets précédents pour un aperçu plus précis.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-100 border border-gray-200 rounded-xl p-2 sm:p-4 md:p-8">
                    <InvoicePreview />
                  </div>
                </div>
              )}
              
              {/* Floating save button for non-preview tabs - Improved for mobile */}
              {activeTab !== "preview" && hasChanges && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="fixed bottom-4 right-4 z-40"
                >
                  <button
                    onClick={handleSubmit}
                    className="rounded-full bg-[#213f5b] text-white h-10 sm:h-12 px-4 sm:px-6 shadow-lg flex items-center justify-center gap-2 hover:bg-[#152a3f] transition-all hover:shadow-xl active:scale-95"
                  >
                    {loading ? (
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircleIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">Enregistrer les modifications</span>
                        <span className="sm:hidden">Enregistrer</span>
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
