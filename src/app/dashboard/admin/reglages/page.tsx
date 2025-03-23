"use client";

import React, { useState, useEffect, useRef, JSX } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  BriefcaseIcon,
  KeyIcon,
  BellIcon,
  CameraIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  PhotoIcon,
  UserCircleIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  CheckIcon,
  WrenchIcon,
  BuildingLibraryIcon,
  SparklesIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  PaintBrushIcon,
  XMarkIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

// Define types for notification preferences
interface NotificationChannels {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
}

interface ProfileData {
  profile: CompanyProfile;
  notificationPreferences: NotificationPreferences;
  appearanceSettings: AppearanceSettings;
  passwordChange?: {
    currentPassword: string;
    newPassword: string;
  };
}

interface NotificationFrequencies {
  invoices: string;
  payments: string;
  reports: string;
}

interface NotificationTypes {
  newInvoice: boolean;
  paymentReminder: boolean;
  paymentReceived: boolean;
  serviceUpdate: boolean;
  marketingEmails: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
}

interface NotificationPreferences {
  channels: NotificationChannels;
  frequencies: NotificationFrequencies;
  types: NotificationTypes;
}

type NotificationChannelType = keyof NotificationChannels;
type NotificationFrequencyType = keyof NotificationFrequencies;
type NotificationType = keyof NotificationTypes;

interface CompanyProfile {
  companyName: string;
  businessType: string;
  registrationNumber: string;
  vatNumber: string;
  email: string;
  phone: string;
  website: string;
  role: string;
  department: string;
  avatar: string | null;
  logo: string | ArrayBuffer | null;
  ecologicalFocus: string[];
  foundedYear: string;
  description: string;
}

interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  sessionTimeout: number;
  ipRestriction: boolean;
  loginHistory: LoginHistoryItem[];
}

interface LoginHistoryItem {
  date: string;
  ip: string;
  location: string;
  device: string;
}

interface AppearanceSettings {
  theme: string;
  accentColor: string;
  fontScale: number;
  reducedMotion: boolean;
  compactMode: boolean;
  highContrast: boolean;
  denseMode: boolean;
}

interface FormFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  tooltip?: string | null;
  placeholder?: string;
  icon?: React.ReactNode;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  endElement?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
}

interface ToggleSwitchProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tooltip?: string | null;
  className?: string;
}

interface TooltipProps {
  id: string;
  text: string;
}

interface ColorOption {
  name: string;
  value: string;
}

type TabType = "profile" | "security" | "notifications" | "appearance";

/** ---------------------
 *     MAIN COMPONENT
 *  --------------------- */
export default function ProfilAdministrateurPage() {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(null); // null, 'success', 'error'
  const [activeTab, setActiveTab] = useState<TabType>("profile"); // profile, security, notifications, appearance
  const [hasChanges, setHasChanges] = useState(false);
  const [showTooltip, setShowTooltip] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [themePreview, setThemePreview] = useState<string | null>(null);
  // const [notificationExpanded, setNotificationExpanded] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  // Company profile state
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    companyName: "Ecology'b",
    businessType: "Société par actions simplifiée (SAS)",
    registrationNumber: "RCS Paris B 987 654 321",
    vatNumber: "FR 12 987654321",
    email: "admin@ecology-b.com",
    phone: "06 01 02 03 04",
    website: "www.ecology-b.com",
    role: "Admin & Facturation",
    department: "Finance",
    avatar: null,
    logo: null,
    ecologicalFocus: ["Énergie renouvelable", "Recyclage", "Économie circulaire"],
    foundedYear: "2021",
    description: "Ecology'b est une entreprise engagée dans la transition écologique, offrant des solutions innovantes pour réduire l'impact environnemental.",
  });  

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    lastPasswordChange: "2023-11-15T10:30:00",
    sessionTimeout: 60, // minutes
    ipRestriction: false,
    loginHistory: [
      { date: "2024-03-08T14:32:00", ip: "192.168.1.45", location: "Paris, France", device: "Chrome / MacOS" },
      { date: "2024-03-05T09:17:00", ip: "192.168.1.30", location: "Paris, France", device: "Safari / iOS" },
    ]
  });
  
  // Notification preferences state
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    channels: {
      email: true,
      sms: false,
      push: true,
      inApp: true
    },
    frequencies: {
      invoices: "immediate",
      payments: "daily",
      reports: "weekly"
    },
    types: {
      newInvoice: true,
      paymentReminder: true,
      paymentReceived: true,
      serviceUpdate: true,
      marketingEmails: false,
      weeklyReports: true,
      monthlyReports: true,
    }
  });
  
  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    theme: "light",
    accentColor: "#213f5b", 
    fontScale: 1,
    reducedMotion: false,
    compactMode: false,
    highContrast: false,
    denseMode: false,
  });

  // Load profile from localStorage
  useEffect(() => {
    const storedInfo = localStorage.getItem("adminInfo");
    if (storedInfo) {
      try {
        const parsedInfo = JSON.parse(storedInfo);
        setCompanyProfile(prev => ({
          ...prev,
          ...parsedInfo,
        }));
      } catch (error) {
        console.error("Error parsing stored profile data:", error);
      }
    }
  }, []);

  // Load profile data from API
  useEffect(() => {
    async function fetchProfileData() {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch("/api/users?id=67a365fff299ca9cb60a6ab4");
        
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        
        const data = await response.json();
        
        // If API returns actual data, use it
        if (data.profile) {
          setCompanyProfile(prev => ({
            ...prev,
            ...data.profile,
          }));
        }
        
        if (data.notificationPreferences) {
          setNotificationPrefs(data.notificationPreferences);
        }
        
        if (data.securitySettings) {
          setSecuritySettings(prev => ({
            ...prev,
            twoFactorEnabled: data.securitySettings.twoFactorEnabled || false,
            sessionTimeout: data.securitySettings.sessionTimeout || 60,
            ipRestriction: data.securitySettings.ipRestriction || false,
            lastPasswordChange: data.securitySettings.lastPasswordChange || prev.lastPasswordChange,
          }));
        }
        
        if (data.appearanceSettings) {
          setAppearanceSettings(data.appearanceSettings);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        // Keep using default values if fetch fails
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfileData();
  }, []);

  // Handle company profile changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyProfile(prev => ({
      ...prev,
      [name]: value,
    }));
    setHasChanges(true);
  };

  // Handle security settings changes
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement; // Type assertion
    const { name, value, type, checked } = target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setSecuritySettings(prev => ({
      ...prev,
      [name]: newValue,
    }));
    setHasChanges(true);
  };
  
  // Handle notification preferences changes
  const handleNotificationChange = (
    type: 'channels' | 'frequencies' | 'types',
    name: NotificationChannelType | NotificationFrequencyType | NotificationType,
    value: boolean | string
  ) => {
    setNotificationPrefs(prev => {
      const newPrefs = { ...prev };
      
      if (type === 'channels') {
        newPrefs.channels[name as NotificationChannelType] = value as boolean;
      } else if (type === 'frequencies') {
        newPrefs.frequencies[name as NotificationFrequencyType] = value as string;
      } else if (type === 'types') {
        newPrefs.types[name as NotificationType] = value as boolean;
      }
      
      return newPrefs;
    });
    setHasChanges(true);
  };
  
  // Handle appearance settings changes
  const handleAppearanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setAppearanceSettings(prev => ({
      ...prev,
      [name]: newValue,
    }));
    setHasChanges(true);
  };
  
  // Handle accent color change
  const handleAccentColorChange = (color: string) => {
    setAppearanceSettings(prev => ({
      ...prev,
      accentColor: color,
    }));
    setHasChanges(true);
    setThemePreview(color);
    
    // Reset preview after 2 seconds
    setTimeout(() => {
      setThemePreview(null);
    }, 2000);
  };
  
  // Handle file input change for logo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const imageUrl = event.target.result;
        setCompanyProfile(prev => ({
          ...prev,
          logo: imageUrl,
        }));
        setHasChanges(true);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle form submission
  // 1. Fix handleSubmit function by making the parameter optional with proper type
  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    if (e && 'preventDefault' in e) {
      e.preventDefault();
    }
    
    try {
      setLoading(true);
      setSaveStatus(null);
      
      // Prepare data to save
      const profileData: ProfileData = {
        profile: companyProfile,
        notificationPreferences: notificationPrefs,
        appearanceSettings: appearanceSettings,
      };
      
      // Handle password update logic separately
      if (activeTab === "security" && 
          securitySettings.currentPassword && 
          securitySettings.newPassword &&
          securitySettings.newPassword === securitySettings.confirmPassword) {
        // Add password change request
        profileData.passwordChange = {
          currentPassword: securitySettings.currentPassword,
          newPassword: securitySettings.newPassword,
        };
      }
      
      // Updated to use the requested API endpoint with PATCH method
      const response = await fetch('/api/users?id=67a365fff299ca9cb60a6ab4', {
        method: 'PATCH',  // Changed from POST to PATCH
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save profile');
      }
      
      // Update localStorage with new profile data
      localStorage.setItem("adminInfo", JSON.stringify(companyProfile));
      
      // Reset password fields
      if (activeTab === "security") {
        setSecuritySettings(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }
      
      setSaveStatus('success');
      setHasChanges(false);
      
      // Reset status after a delay
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveStatus('error');
    } finally {
      setLoading(false);
    }
  };
  
  // Auto-save when changes are made (with debounce)
  useEffect(() => {
    if (!hasChanges || activeTab === "security") return;
    
    const timer = setTimeout(() => {
      handleSubmit();
    }, 2000); // Auto-save after 2 seconds of inactivity
    
    return () => clearTimeout(timer);
  }, [companyProfile, notificationPrefs, appearanceSettings, hasChanges, activeTab]);
  
  // Status notification component
  const StatusNotification = () => {
    if (!saveStatus) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        className={`fixed top-20 right-6 z-50 p-5 rounded-lg shadow-xl flex items-center gap-3 backdrop-blur-sm ${
          saveStatus === 'success' 
            ? 'bg-green-50/90 text-green-800 border border-green-200' 
            : 'bg-red-50/90 text-red-800 border border-red-200'
        }`}
      >
        {saveStatus === 'success' ? (
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
            <ExclamationCircleIcon className="h-5 w-5 text-red-600" />
          </div>
        )}
        <div>
          <h3 className="font-medium">
            {saveStatus === 'success' ? 'Modifications enregistrées' : 'Erreur'}
          </h3>
          <p className="text-sm opacity-90">
            {saveStatus === 'success' 
              ? 'Vos modifications ont été enregistrées avec succès.' 
              : 'Une erreur est survenue. Veuillez réessayer.'}
          </p>
        </div>
      </motion.div>
    );
  };
  
  // Tooltip component
  const Tooltip = ({ id, text }: TooltipProps) => {
    if (showTooltip !== id) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
        className="absolute z-10 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg"
        style={{ transform: 'translateY(-100%)', marginTop: '-8px' }}
      >
        {text}
        <div className="absolute -bottom-1 left-4 w-3 h-3 bg-gray-800 rotate-45" />
      </motion.div>
    );
  };
  
  // Input field with label component
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
    className = "",
    disabled = false,
    endElement = null,
    multiline = false,
    rows = 3,
  }: FormFieldProps) => {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
          {tooltip && (
            <div 
              className="relative inline-block"
              onMouseEnter={() => setShowTooltip(name)}
              onMouseLeave={() => setShowTooltip("")}
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
          
          {multiline ? (
            <textarea
              name={name}
              id={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              rows={rows}
              className={`block w-full rounded-lg border-gray-300
                ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5
                focus:border-[${themePreview || appearanceSettings.accentColor}] focus:ring focus:ring-[${themePreview || appearanceSettings.accentColor}]/20 focus:ring-opacity-50 
                transition-all duration-200 ease-in-out
                placeholder:text-gray-400 text-gray-800 bg-white
                hover:border-gray-400
                ${hasChanges && !disabled ? 'border-amber-300' : ''}
                ${disabled ? 'bg-gray-50 text-gray-500' : ''}
                resize-none
              `}
            />
          ) : (
            <input
              type={type}
              name={name}
              id={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              className={`block w-full rounded-lg border-gray-300 
                ${icon ? 'pl-10' : 'pl-3.5'} 
                ${endElement ? 'pr-10' : 'pr-3.5'} py-2.5 
                focus:border-[${themePreview || appearanceSettings.accentColor}] focus:ring focus:ring-[${themePreview || appearanceSettings.accentColor}]/20 focus:ring-opacity-50 
                transition-all duration-200 ease-in-out
                placeholder:text-gray-400 text-gray-800 bg-white
                hover:border-gray-400
                ${hasChanges && !disabled ? 'border-amber-300' : ''}
                ${disabled ? 'bg-gray-50 text-gray-500' : ''}
              `}
            />
          )}
          
          {endElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {endElement}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Toggle switch component
  const ToggleSwitch = ({ 
    label, 
    name, 
    checked, 
    onChange, 
    tooltip = null,
    className = "" 
  }: ToggleSwitchProps) => {
    return (
      <div className={`relative flex items-center justify-between ${className}`}>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {tooltip && (
            <div 
              className="relative inline-block"
              onMouseEnter={() => setShowTooltip(name)}
              onMouseLeave={() => setShowTooltip("")}
            >
              <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
              <Tooltip id={name} text={tooltip} />
            </div>
          )}
        </div>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            className="sr-only peer"
          />
          <div className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[${themePreview || appearanceSettings.accentColor}]/30 rounded-full peer 
            peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
            peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
            after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
            after:h-5 after:w-5 after:transition-all peer-checked:bg-[${themePreview || appearanceSettings.accentColor}]`}
          ></div>
        </label>
      </div>
    );
  };
  
  // Section titles
  const sectionTitles: Record<TabType, string> = {
    profile: "Profil Entreprise",
    security: "Sécurité & Authentification",
    notifications: "Notifications & Communications",
    appearance: "Apparence & Préférences"
  };
  
  // Section icons
  const sectionIcons: Record<TabType, JSX.Element> = {
    profile: <BuildingOfficeIcon className="h-5 w-5" />,
    security: <ShieldCheckIcon className="h-5 w-5" />,
    notifications: <BellIcon className="h-5 w-5" />,
    appearance: <PaintBrushIcon className="h-5 w-5" />
  };
  
  // Color palette for accent color selection
  const colorPalette: ColorOption[] = [
    { name: "Bleu Marine", value: "#213f5b" },
    { name: "Émeraude", value: "#00A878" },
    { name: "Indigo", value: "#4F46E5" },
    { name: "Corail", value: "#F43F5E" },
    { name: "Violet", value: "#8B5CF6" },
    { name: "Ambre", value: "#D97706" },
  ];
  
  // Theme previews
  const getThemePreview = (color: string) => {
    return {
      backgroundColor: color,
      color: '#FFFFFF',
    };
  };
  
  // Formatted date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <AnimatePresence>
          {saveStatus && <StatusNotification />}
        </AnimatePresence>
        
                  <main
          className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-16"
          style={{
            background:
              "linear-gradient(135deg, rgba(191,221,249,0.1) 0%, rgba(210,252,178,0.05) 100%)",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-4 sm:mb-6 flex items-center justify-between bg-white p-3 sm:p-4 lg:hidden rounded-xl shadow-sm">
              <button 
                onClick={() => window.history.back()}
                className="p-2 rounded-full hover:bg-gray-100 touch-manipulation"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Paramètres</h1>
              <div className="w-8"></div> {/* Spacer for alignment */}
            </div>
            
            {/* Mobile tab navigation */}
            <div className="xl:hidden mb-4 sm:mb-6 overflow-x-auto bg-white p-2 sm:p-4 rounded-xl shadow-sm">
              <div className="flex gap-1 sm:gap-2 py-1 px-1 min-w-full">
                {(Object.keys(sectionTitles) as TabType[]).map(key => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center px-3 sm:px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap flex-1 sm:flex-none justify-center sm:justify-start touch-manipulation
                      ${activeTab === key 
                        ? `bg-[${themePreview || appearanceSettings.accentColor}] text-white shadow-md` 
                        : 'bg-gray-50 text-gray-700 border border-gray-100 hover:bg-gray-100'}
                      transition-all duration-200
                    `}
                    style={activeTab === key ? getThemePreview(themePreview || appearanceSettings.accentColor) : {}}
                  >
                    <span className={`sm:mr-1.5 ${activeTab === key ? 'text-white' : `text-[${themePreview || appearanceSettings.accentColor}]`}`}>
                      {sectionIcons[key]}
                    </span>
                    <span className="hidden sm:inline">{sectionTitles[key]}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="lg:grid lg:grid-cols-12 lg:gap-4 xl:gap-8">
              {/* Desktop sidebar */}
              <div className="hidden lg:block xl:col-span-3 lg:col-span-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                  <div className="p-6 flex flex-col items-center border-b border-gray-100">
                    <div className="relative group">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*" 
                      />
                      {companyProfile.logo ? (
                        <div className="h-24 w-24 rounded-lg shadow-md overflow-hidden bg-white">
                          <img 
                            src={typeof companyProfile.logo === 'string' ? companyProfile.logo : ''}
                            alt="Logo" 
                            className="h-full w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="h-24 w-24 rounded-lg bg-[#213f5b]/10 border-2 border-[#213f5b]/20 flex items-center justify-center text-2xl font-semibold text-[#213f5b]">
                          {companyProfile.companyName.charAt(0)}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={triggerFileInput}
                          className="text-white flex flex-col items-center justify-center w-full h-full text-xs"
                        >
                          <CameraIcon className="h-6 w-6 mb-1" />
                          Modifier
                        </button>
                      </div>
                    </div>
                    <h3 className="mt-4 font-semibold text-gray-900">{companyProfile.companyName}</h3>
                    <div className="flex items-center mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 text-xs">
                        <span className="w-1.5 h-1.5 mr-1 rounded-full bg-green-600"></span>
                        Actif
                      </span>
                    </div>
                  </div>
                  
                  <nav className="p-4">
                    {(Object.keys(sectionTitles) as TabType[]).map(key => (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex items-center w-full px-4 py-3.5 rounded-lg text-sm font-medium mb-1.5
                          ${activeTab === key 
                            ? 'text-white shadow-sm' 
                            : 'text-gray-700 hover:bg-gray-50'}
                          transition-all duration-200
                        `}
                        style={activeTab === key ? getThemePreview(themePreview || appearanceSettings.accentColor) : {}}
                      >
                        <span className={activeTab === key ? 'text-white' : `text-[${themePreview || appearanceSettings.accentColor}]`}>
                          {sectionIcons[key]}
                        </span>
                        <span className="ml-3">{sectionTitles[key]}</span>
                      </button>
                    ))}
                  </nav>
                  
                  <div className="p-6 border-t border-gray-100">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => handleSubmit()}
                        className="text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-colors w-full flex items-center justify-center gap-1.5 shadow-sm"
                        style={getThemePreview(themePreview || appearanceSettings.accentColor)}
                      >
                        {loading ? (
                          <ArrowPathIcon className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircleIcon className="h-4 w-4" />
                        )}
                        Sauvegarder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main content */}
              <div className="xl:col-span-9 lg:col-span-8">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: themePreview || appearanceSettings.accentColor }}>
                        {sectionTitles[activeTab]}
                      </h1>
                      <p className="text-gray-600 mt-1 text-sm sm:text-base">
                        {activeTab === "profile" && "Gérez les informations de votre entreprise"}
                        {activeTab === "security" && "Protégez votre compte et configurez l'authentification"}
                        {activeTab === "notifications" && "Personnalisez vos préférences de notification"}
                        {activeTab === "appearance" && "Personnalisez l'apparence de votre interface"}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => handleSubmit()}
                      className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg shadow-sm text-sm font-medium transition-all flex self-end sm:self-auto items-center gap-1.5 touch-manipulation
                        ${hasChanges 
                          ? 'text-white' 
                          : 'bg-gray-100 text-gray-500'}
                      `}
                      style={hasChanges ? getThemePreview(themePreview || appearanceSettings.accentColor) : {}}
                    >
                      {loading ? (
                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircleIcon className="h-4 w-4" />
                          Enregistrer
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Company Profile Tab */}
                  {activeTab === "profile" && (
                    <div className="space-y-8">
                      {/* Main Information Card */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-center">
                            <BuildingLibraryIcon className="h-6 w-6 mr-2.5" style={{ color: appearanceSettings.accentColor }} />
                            <h2 className="text-xl font-medium text-gray-900">Informations de l&apos;entreprise</h2>
                          </div>
                        </div>
                        
                        <div className="lg:p-8 p-6">
                          <div className="lg:hidden flex flex-col items-center mb-8 pb-6 border-b border-gray-100">
                            <div className="relative group">
                              <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                className="hidden" 
                                accept="image/*" 
                              />
                              {companyProfile.logo ? (
                                <div className="h-24 w-24 rounded-lg shadow-md overflow-hidden bg-white">
                                  <img 
                                    src={typeof companyProfile.logo === 'string' ? companyProfile.logo : ''}
                                    alt="Logo" 
                                    className="h-full w-full object-contain"
                                  />
                                </div>
                              ) : (
                                <div className="h-24 w-24 rounded-lg bg-[#213f5b]/10 border-2 border-[#213f5b]/20 flex items-center justify-center text-2xl font-semibold text-[#213f5b]">
                                  {companyProfile.companyName.charAt(0)}
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={triggerFileInput}
                                  className="text-white flex flex-col items-center justify-center w-full h-full text-xs"
                                >
                                  <CameraIcon className="h-6 w-6 mb-1" />
                                  Modifier
                                </button>
                              </div>
                            </div>
                            <button className="mt-3 text-sm hover:underline flex items-center gap-1.5" 
                              style={{ color: appearanceSettings.accentColor }}
                              onClick={triggerFileInput}
                            >
                              <PhotoIcon className="h-4 w-4" />
                              Modifier logo
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <FormField
                              label="Nom de l'entreprise"
                              name="companyName"
                              value={companyProfile.companyName}
                              onChange={handleProfileChange}
                              required={true}
                              placeholder="Nom de votre entreprise"
                              tooltip="Nom complet de votre entreprise"
                              icon={<BuildingOfficeIcon className="h-5 w-5 text-gray-400" />}
                            />
                            
                            <FormField
                              label="Type d'entreprise"
                              name="businessType"
                              value={companyProfile.businessType}
                              onChange={handleProfileChange}
                              placeholder="SAS, SARL, etc."
                              icon={<BriefcaseIcon className="h-5 w-5 text-gray-400" />}
                            />
                            
                            <FormField
                              label="Numéro d'immatriculation"
                              name="registrationNumber"
                              value={companyProfile.registrationNumber}
                              onChange={handleProfileChange}
                              placeholder="RCS Paris B XXX XXX XXX"
                              tooltip="Numéro RCS, SIREN ou SIRET"
                              icon={<IdentificationIcon className="h-5 w-5 text-gray-400" />}
                            />
                            
                            <FormField
                              label="Numéro de TVA"
                              name="vatNumber"
                              value={companyProfile.vatNumber}
                              onChange={handleProfileChange}
                              placeholder="FR XX XXX XXX XXX"
                              tooltip="Numéro d'identification à la TVA intracommunautaire"
                              icon={<DocumentTextIcon className="h-5 w-5 text-gray-400" />}
                            />
                            
                            <FormField
                              label="Email professionnel"
                              name="email"
                              type="email"
                              value={companyProfile.email}
                              onChange={handleProfileChange}
                              required={true}
                              placeholder="contact@votreentreprise.com"
                              tooltip="Email principal pour les communications officielles"
                              icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                            />
                            
                            <FormField
                              label="Téléphone"
                              name="phone"
                              value={companyProfile.phone}
                              onChange={handleProfileChange}
                              placeholder="01 XX XX XX XX"
                              icon={<PhoneIcon className="h-5 w-5 text-gray-400" />}
                            />
                            
                            <FormField
                              label="Site web"
                              name="website"
                              value={companyProfile.website}
                              onChange={handleProfileChange}
                              placeholder="www.votreentreprise.com"
                              icon={<GlobeAltIcon className="h-5 w-5 text-gray-400" />}
                            />
                            
                            <FormField
                              label="Année de création"
                              name="foundedYear"
                              value={companyProfile.foundedYear}
                              onChange={handleProfileChange}
                              placeholder="2021"
                              icon={<CalendarIcon className="h-5 w-5 text-gray-400" />}
                            />
                            
                            <FormField
                              label="Description de l'entreprise"
                              name="description"
                              value={companyProfile.description}
                              onChange={handleProfileChange}
                              placeholder="Décrivez votre entreprise en quelques lignes..."
                              multiline={true}
                              rows={4}
                              tooltip="Brève description de l'activité de votre entreprise"
                              className="md:col-span-2"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Role & Department */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-center">
                            <UserCircleIcon className="h-6 w-6 mr-2.5" style={{ color: appearanceSettings.accentColor }} />
                            <h2 className="text-xl font-medium text-gray-900">Rôle Administrateur</h2>
                          </div>
                        </div>
                        
                        <div className="p-4 sm:p-6 lg:p-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-4 sm:gap-y-6">
                            <FormField
                              label="Rôle / Fonction"
                              name="role"
                              value={companyProfile.role}
                              onChange={handleProfileChange}
                              placeholder="Ex: Administrateur, Comptable..."
                              icon={<IdentificationIcon className="h-5 w-5 text-gray-400" />}
                            />
                            
                            <FormField
                              label="Département"
                              name="department"
                              value={companyProfile.department}
                              onChange={handleProfileChange}
                              placeholder="Ex: Finance, Administration..."
                              icon={<BriefcaseIcon className="h-5 w-5 text-gray-400" />}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Ecological Focus */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6">
                          <div className="flex items-center mb-4">
                            <SparklesIcon className="h-6 w-6 mr-2.5" style={{ color: appearanceSettings.accentColor }} />
                            <h2 className="text-xl font-medium text-gray-900">Activités écologiques</h2>
                          </div>
                          
                          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                            <div className="flex">
                              <LightBulbIcon className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                              <div>
                                <h4 className="text-sm font-medium text-green-800">Domaines d&apos;expertise</h4>
                                <p className="mt-1 text-sm text-green-700">
                                  En tant qu&apos;entreprise écologique, vos domaines d&apos;expertise seront affichés sur les factures, renforçant votre image éco-responsable.
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {companyProfile.ecologicalFocus.map((focus, index) => (
                                    <span key={index} className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                                      {focus}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Security Tab */}
                  {activeTab === "security" && (
                    <div className="space-y-8">
                      {/* Password Change Card */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-center">
                            <KeyIcon className="h-6 w-6 mr-2.5" style={{ color: appearanceSettings.accentColor }} />
                            <h2 className="text-xl font-medium text-gray-900">Changer le mot de passe</h2>
                          </div>
                        </div>
                        
                        <div className="lg:p-8 p-6">
                          <div className="grid grid-cols-1 gap-y-5">
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mb-4">
                              <div className="flex">
                                <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                  <p className="text-sm text-blue-700">
                                    Dernier changement de mot de passe: <span className="font-medium">{formatDate(securitySettings.lastPasswordChange)}</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <FormField
                              label="Mot de passe actuel"
                              name="currentPassword"
                              type={showPassword ? "text" : "password"}
                              value={securitySettings.currentPassword}
                              onChange={handleSecurityChange}
                              placeholder="••••••••••••"
                              icon={<KeyIcon className="h-5 w-5 text-gray-400" />}
                              endElement={
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5" />
                                  ) : (
                                    <EyeIcon className="h-5 w-5" />
                                  )}
                                </button>
                              }
                            />
                            
                            <FormField
                              label="Nouveau mot de passe"
                              name="newPassword"
                              type={showPassword ? "text" : "password"}
                              value={securitySettings.newPassword}
                              onChange={handleSecurityChange}
                              placeholder="••••••••••••"
                              icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                            />
                            
                            <FormField
                              label="Confirmer le mot de passe"
                              name="confirmPassword"
                              type={showPassword ? "text" : "password"}
                              value={securitySettings.confirmPassword}
                              onChange={handleSecurityChange}
                              placeholder="••••••••••••"
                              icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                            />
                            
                            {/* Password strength indicator */}
                            {securitySettings.newPassword && (
                              <div className="mt-1">
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-xs text-gray-500">Force du mot de passe</span>
                                  <span className="text-xs font-medium" style={{ color: appearanceSettings.accentColor }}>
                                    {securitySettings.newPassword.length < 8 ? 'Faible' : 
                                    securitySettings.newPassword.length < 12 ? 'Moyen' : 'Fort'}
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{ 
                                      width: `${Math.min(100, (securitySettings.newPassword.length / 16) * 100)}%`,
                                      backgroundColor: appearanceSettings.accentColor
                                    }}
                                  ></div>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                  <ul className="space-y-1">
                                    <li className="flex items-center">
                                      <span className={`mr-1.5 ${securitySettings.newPassword.length >= 8 ? 'text-green-500' : 'text-gray-400'}`}>
                                        {securitySettings.newPassword.length >= 8 ? 
                                          <CheckIcon className="h-3.5 w-3.5" /> : 
                                          <XMarkIcon className="h-3.5 w-3.5" />
                                        }
                                      </span>
                                      Au moins 8 caractères
                                    </li>
                                    <li className="flex items-center">
                                      <span className={`mr-1.5 ${/[A-Z]/.test(securitySettings.newPassword) ? 'text-green-500' : 'text-gray-400'}`}>
                                        {/[A-Z]/.test(securitySettings.newPassword) ? 
                                          <CheckIcon className="h-3.5 w-3.5" /> : 
                                          <XMarkIcon className="h-3.5 w-3.5" />
                                        }
                                      </span>
                                      Au moins une majuscule
                                    </li>
                                    <li className="flex items-center">
                                      <span className={`mr-1.5 ${/[0-9]/.test(securitySettings.newPassword) ? 'text-green-500' : 'text-gray-400'}`}>
                                        {/[0-9]/.test(securitySettings.newPassword) ? 
                                          <CheckIcon className="h-3.5 w-3.5" /> : 
                                          <XMarkIcon className="h-3.5 w-3.5" />
                                        }
                                      </span>
                                      Au moins un chiffre
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            )}
                            
                            <div className="mt-2">
                              <button
                                type="button"
                                onClick={() => handleSubmit()}
                                disabled={!securitySettings.currentPassword || !securitySettings.newPassword || securitySettings.newPassword !== securitySettings.confirmPassword}
                                className="px-5 py-2.5 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                style={getThemePreview(themePreview || appearanceSettings.accentColor)}
                              >
                                Mettre à jour le mot de passe
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Account Security */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-center">
                            <ShieldCheckIcon className="h-6 w-6 mr-2.5" style={{ color: appearanceSettings.accentColor }} />
                            <h2 className="text-xl font-medium text-gray-900">Sécurité du compte</h2>
                          </div>
                        </div>
                        
                        <div className="lg:p-8 p-6">
                          <div className="space-y-6">
                            <ToggleSwitch
                              label="Authentification à deux facteurs"
                              name="twoFactorEnabled"
                              checked={securitySettings.twoFactorEnabled}
                              onChange={(e) => handleSecurityChange({
                                target: { name: "twoFactorEnabled", checked: e.target.checked, type: "checkbox", value: '' }
                              } as React.ChangeEvent<HTMLInputElement>)}
                              tooltip="Renforce la sécurité en requérant un code en plus du mot de passe"
                            />
                            
                            <div className="pt-1 pb-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Délai d&apos;expiration de session (minutes)
                              </label>
                              <div className="flex items-center">
                                <input
                                  type="range"
                                  min="15"
                                  max="240"
                                  step="15"
                                  name="sessionTimeout"
                                  value={securitySettings.sessionTimeout}
                                  onChange={handleSecurityChange}
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#213f5b]"
                                />
                                <span className="ml-3 w-12 text-sm text-gray-700">
                                  {securitySettings.sessionTimeout}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-gray-500">
                                Durée après laquelle vous serez automatiquement déconnecté en cas d&apos;inactivité.
                              </p>
                            </div>
                            
                            <ToggleSwitch
                              label="Restriction d'accès par IP"
                              name="ipRestriction"
                              checked={securitySettings.ipRestriction}
                              onChange={(e) => handleSecurityChange({
                                target: { name: "ipRestriction", checked: e.target.checked, type: "checkbox", value: '' }
                              } as React.ChangeEvent<HTMLInputElement>)}
                              tooltip="Limite l'accès à certaines adresses IP uniquement"
                            />
                            
                            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 mt-4">
                              <div className="flex">
                                <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                  <h4 className="text-sm font-medium text-amber-800">Attention</h4>
                                  <p className="mt-1 text-sm text-amber-700">
                                    La restriction par IP peut empêcher l&apos;accès à votre compte si votre adresse IP change.
                                    Assurez-vous d&apos;avoir configuré des adresses IP alternatives ou un moyen de récupération.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Connection History */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-center">
                            <ClockIcon className="h-6 w-6 mr-2.5" style={{ color: appearanceSettings.accentColor }} />
                            <h2 className="text-xl font-medium text-gray-900">Historique de connexion</h2>
                          </div>
                        </div>
                        
                        <div className="px-4 sm:px-6 py-4">
                          {/* Responsive Table for Larger Screens */}
                          <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead>
                                <tr>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date et heure
                                  </th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Adresse IP
                                  </th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Localisation
                                  </th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Appareil
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {securitySettings.loginHistory.map((login, index) => (
                                  <tr key={index} className={index === 0 ? "bg-blue-50" : ""}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                      {formatDate(login.date)}
                                      {index === 0 && (
                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                          Actuelle
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                      {login.ip}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                      {login.location}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                      {login.device}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          
                          {/* Card View for Mobile Screens */}
                          <div className="md:hidden space-y-4">
                            {securitySettings.loginHistory.map((login, index) => (
                              <div key={index} className={`p-4 rounded-lg border ${index === 0 ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"}`}>
                                <div className="flex justify-between items-start mb-2">
                                  <div className="font-medium text-sm">
                                    {formatDate(login.date)}
                                  </div>
                                  {index === 0 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                      Actuelle
                                    </span>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <div className="text-gray-500 text-xs uppercase mb-1">IP</div>
                                    <div>{login.ip}</div>
                                  </div>
                                  <div>
                                    <div className="text-gray-500 text-xs uppercase mb-1">Localisation</div>
                                    <div>{login.location}</div>
                                  </div>
                                  <div className="col-span-2">
                                    <div className="text-gray-500 text-xs uppercase mb-1">Appareil</div>
                                    <div>{login.device}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 text-center">
                            <button className="text-sm hover:underline" style={{ color: appearanceSettings.accentColor }}>
                              Voir l&apos;historique complet
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Notifications Tab */}
                  {activeTab === "notifications" && (
                    <div className="space-y-8">
                      {/* Notification Channels */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-center">
                            <BellIcon className="h-6 w-6 mr-2.5" style={{ color: appearanceSettings.accentColor }} />
                            <h2 className="text-xl font-medium text-gray-900">Canaux de notification</h2>
                          </div>
                        </div>
                        
                        <div className="lg:p-8 p-6">
                          <div className="space-y-5">
                            <ToggleSwitch
                              label="Notifications par email"
                              name="email"
                              checked={notificationPrefs.channels.email}
                              onChange={(e) => handleNotificationChange(
                                'channels', 'email', e.target.checked
                              )}
                              tooltip="Recevez des notifications par email"
                            />
                            
                            <ToggleSwitch
                              label="Notifications par SMS"
                              name="sms"
                              checked={notificationPrefs.channels.sms}
                              onChange={(e) => handleNotificationChange(
                                'channels', 'sms', e.target.checked
                              )}
                              tooltip="Recevez des notifications par SMS (des frais peuvent s'appliquer)"
                            />
                            
                            <ToggleSwitch
                              label="Notifications push"
                              name="push"
                              checked={notificationPrefs.channels.push}
                              onChange={(e) => handleNotificationChange(
                                'channels', 'push', e.target.checked
                              )}
                              tooltip="Recevez des notifications push sur votre navigateur"
                            />
                            
                            <ToggleSwitch
                              label="Notifications dans l'application"
                              name="inApp"
                              checked={notificationPrefs.channels.inApp}
                              onChange={(e) => handleNotificationChange(
                                'channels', 'inApp', e.target.checked
                              )}
                              tooltip="Recevez des notifications dans l'interface de l'application"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Notification Frequencies */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-center">
                            <ClockIcon className="h-6 w-6 mr-2.5" style={{ color: appearanceSettings.accentColor }} />
                            <h2 className="text-xl font-medium text-gray-900">Fréquence des notifications</h2>
                          </div>
                        </div>
                        
                        <div className="lg:p-8 p-6">
                          <div className="space-y-6">
                                                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notifications de factures
                              </label>
                              <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-3">
                                {['immediate', 'daily', 'weekly'].map((freq) => (
                                  <div key={freq} className="relative">
                                    <input
                                      type="radio"
                                      id={`freq-invoices-${freq}`}
                                      name="invoicesFreq"
                                      className="sr-only peer"
                                      checked={notificationPrefs.frequencies.invoices === freq}
                                      onChange={() => handleNotificationChange(
                                        'frequencies', 'invoices', freq
                                      )}
                                    />
                                    <label
                                      htmlFor={`freq-invoices-${freq}`}
                                      className="flex items-center justify-center p-2.5 text-center text-sm font-medium border rounded-lg cursor-pointer 
                                        peer-checked:border-0 peer-checked:text-white hover:bg-gray-50 peer-checked:hover:bg-opacity-90"
                                      style={notificationPrefs.frequencies.invoices === freq ? getThemePreview(themePreview || appearanceSettings.accentColor) : {}}
                                    >
                                      {freq === 'immediate' ? 'Immédiat' : freq === 'daily' ? 'Quotidien' : 'Hebdomadaire'}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                                                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notifications de paiements
                              </label>
                              <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-3">
                                {['immediate', 'daily', 'weekly'].map((freq) => (
                                  <div key={freq} className="relative">
                                    <input
                                      type="radio"
                                      id={`freq-payments-${freq}`}
                                      name="paymentsFreq"
                                      className="sr-only peer"
                                      checked={notificationPrefs.frequencies.payments === freq}
                                      onChange={() => handleNotificationChange(
                                        'frequencies', 'payments', freq
                                      )}
                                    />
                                    <label
                                      htmlFor={`freq-payments-${freq}`}
                                      className="flex items-center justify-center p-2.5 text-center text-sm font-medium border rounded-lg cursor-pointer 
                                        peer-checked:border-0 peer-checked:text-white hover:bg-gray-50 peer-checked:hover:bg-opacity-90"
                                      style={notificationPrefs.frequencies.payments === freq ? getThemePreview(themePreview || appearanceSettings.accentColor) : {}}
                                    >
                                      {freq === 'immediate' ? 'Immédiat' : freq === 'daily' ? 'Quotidien' : 'Hebdomadaire'}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                                                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rapports et analyses
                              </label>
                              <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-3">
                                {['weekly', 'biweekly', 'monthly'].map((freq) => (
                                  <div key={freq} className="relative">
                                    <input
                                      type="radio"
                                      id={`freq-reports-${freq}`}
                                      name="reportsFreq"
                                      className="sr-only peer"
                                      checked={notificationPrefs.frequencies.reports === freq}
                                      onChange={() => handleNotificationChange(
                                        'frequencies', 'reports', freq
                                      )}
                                    />
                                    <label
                                      htmlFor={`freq-reports-${freq}`}
                                      className="flex items-center justify-center p-2.5 text-center text-sm font-medium border rounded-lg cursor-pointer 
                                        peer-checked:border-0 peer-checked:text-white hover:bg-gray-50 peer-checked:hover:bg-opacity-90"
                                      style={notificationPrefs.frequencies.reports === freq ? getThemePreview(themePreview || appearanceSettings.accentColor) : {}}
                                    >
                                      {freq === 'weekly' ? 'Hebdomadaire' : freq === 'biweekly' ? 'Bimensuel' : 'Mensuel'}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Notification Types */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-center">
                            <DocumentTextIcon className="h-6 w-6 mr-2.5" style={{ color: appearanceSettings.accentColor }} />
                            <h2 className="text-xl font-medium text-gray-900">Types de notifications</h2>
                          </div>
                        </div>
                        
                        <div className="lg:p-8 p-6">
                          <div className="space-y-5 divide-y divide-gray-100">
                            <div className="pb-4">
                              <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-1">
                                  Facturation et paiements
                                </h3>
                                <p className="text-xs text-gray-500">
                                  Notifications liées aux factures et paiements
                                </p>
                              </div>
                              
                              <div className="space-y-4">
                                <ToggleSwitch
                                  label="Nouvelles factures"
                                  name="newInvoice"
                                  checked={notificationPrefs.types.newInvoice}
                                  onChange={(e) => handleNotificationChange(
                                    'types', 'newInvoice', e.target.checked
                                  )}
                                />
                                
                                <ToggleSwitch
                                  label="Rappels de paiement"
                                  name="paymentReminder"
                                  checked={notificationPrefs.types.paymentReminder}
                                  onChange={(e) => handleNotificationChange(
                                    'types', 'paymentReminder', e.target.checked
                                  )}
                                />
                                
                                <ToggleSwitch
                                  label="Paiements reçus"
                                  name="paymentReceived"
                                  checked={notificationPrefs.types.paymentReceived}
                                  onChange={(e) => handleNotificationChange(
                                    'types', 'paymentReceived', e.target.checked
                                  )}
                                />
                              </div>
                            </div>
                            
                            <div className="py-4">
                              <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-1">
                                  Rapports et analyses
                                </h3>
                                <p className="text-xs text-gray-500">
                                  Notifications liées aux rapports d&apos;activité
                                </p>
                              </div>
                              
                              <div className="space-y-4">
                                <ToggleSwitch
                                  label="Rapports hebdomadaires"
                                  name="weeklyReports"
                                  checked={notificationPrefs.types.weeklyReports}
                                  onChange={(e) => handleNotificationChange(
                                    'types', 'weeklyReports', e.target.checked
                                  )}
                                />
                                
                                <ToggleSwitch
                                  label="Rapports mensuels"
                                  name="monthlyReports"
                                  checked={notificationPrefs.types.monthlyReports}
                                  onChange={(e) => handleNotificationChange(
                                    'types', 'monthlyReports', e.target.checked
                                  )}
                                />
                              </div>
                            </div>
                            
                            <div className="pt-4">
                              <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-1">
                                  Autres notifications
                                </h3>
                                <p className="text-xs text-gray-500">
                                  Autres types de notifications
                                </p>
                              </div>
                              
                              <div className="space-y-4">
                                <ToggleSwitch
                                  label="Mises à jour du service"
                                  name="serviceUpdate"
                                  checked={notificationPrefs.types.serviceUpdate}
                                  onChange={(e) => handleNotificationChange(
                                    'types', 'serviceUpdate', e.target.checked
                                  )}
                                />
                                
                                <ToggleSwitch
                                  label="Emails marketing et promotions"
                                  name="marketingEmails"
                                  checked={notificationPrefs.types.marketingEmails}
                                  onChange={(e) => handleNotificationChange(
                                    'types', 'marketingEmails', e.target.checked
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex">
                              <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                              <div>
                                <h4 className="text-sm font-medium text-blue-800">Note importante</h4>
                                <p className="mt-1 text-sm text-blue-700">
                                  Les notifications critiques concernant la sécurité de votre compte seront toujours envoyées, 
                                  quelle que soit votre configuration.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Appearance Tab */}
                  {activeTab === "appearance" && (
                    <div className="space-y-8">
                      {/* Theme Selection */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-center">
                            <PaintBrushIcon className="h-6 w-6 mr-2.5" style={{ color: appearanceSettings.accentColor }} />
                            <h2 className="text-xl font-medium text-gray-900">Thème de l&apos;interface</h2>
                          </div>
                        </div>
                        
                        <div className="lg:p-8 p-6">
                          <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Mode d&apos;affichage
                            </label>
                                                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                              <div className="relative">
                                <input
                                  type="radio"
                                  id="theme-light"
                                  name="theme"
                                  value="light"
                                  className="sr-only peer"
                                  checked={appearanceSettings.theme === 'light'}
                                  onChange={handleAppearanceChange}
                                />
                                <label
                                  htmlFor="theme-light"
                                  className="flex flex-col items-center justify-between p-3 sm:p-4 h-full text-center border rounded-lg cursor-pointer touch-manipulation
                                    peer-checked:border-2 hover:bg-gray-50"
                                  style={{ borderColor: appearanceSettings.theme === 'light' ? appearanceSettings.accentColor : '#e5e7eb' }}
                                >
                                  <div className="w-full h-14 sm:h-20 bg-white border border-gray-200 rounded-md shadow-sm mb-2 sm:mb-3 overflow-hidden">
                                    <div className="h-3 sm:h-4 bg-gray-100 border-b border-gray-200"></div>
                                    <div className="p-1 sm:p-2">
                                      <div className="h-1.5 sm:h-2 w-2/3 bg-gray-200 rounded mb-1"></div>
                                      <div className="h-1.5 sm:h-2 w-1/2 bg-gray-200 rounded"></div>
                                    </div>
                                  </div>
                                  <span className="text-xs sm:text-sm font-medium">Clair</span>
                                  {appearanceSettings.theme === 'light' && (
                                    <CheckIcon className="absolute top-2 right-2 h-4 sm:h-5 w-4 sm:w-5" style={{ color: appearanceSettings.accentColor }} />
                                  )}
                                </label>
                              </div>
                              
                              <div className="relative">
                                <input
                                  type="radio"
                                  id="theme-dark"
                                  name="theme"
                                  value="dark"
                                  className="sr-only peer"
                                  checked={appearanceSettings.theme === 'dark'}
                                  onChange={handleAppearanceChange}
                                />
                                <label
                                  htmlFor="theme-dark"
                                  className="flex flex-col items-center justify-between p-3 sm:p-4 h-full text-center border rounded-lg cursor-pointer touch-manipulation
                                    peer-checked:border-2 hover:bg-gray-50"
                                  style={{ borderColor: appearanceSettings.theme === 'dark' ? appearanceSettings.accentColor : '#e5e7eb' }}
                                >
                                  <div className="w-full h-14 sm:h-20 bg-gray-900 border border-gray-800 rounded-md shadow-sm mb-2 sm:mb-3 overflow-hidden">
                                    <div className="h-3 sm:h-4 bg-gray-800 border-b border-gray-700"></div>
                                    <div className="p-1 sm:p-2">
                                      <div className="h-1.5 sm:h-2 w-2/3 bg-gray-700 rounded mb-1"></div>
                                      <div className="h-1.5 sm:h-2 w-1/2 bg-gray-700 rounded"></div>
                                    </div>
                                  </div>
                                  <span className="text-xs sm:text-sm font-medium">Sombre</span>
                                  {appearanceSettings.theme === 'dark' && (
                                    <CheckIcon className="absolute top-2 right-2 h-4 sm:h-5 w-4 sm:w-5" style={{ color: appearanceSettings.accentColor }} />
                                  )}
                                </label>
                              </div>
                              
                              <div className="relative col-span-2 sm:col-span-3">
                                <input
                                  type="radio"
                                  id="theme-system"
                                  name="theme"
                                  value="system"
                                  className="sr-only peer"
                                  checked={appearanceSettings.theme === 'system'}
                                  onChange={handleAppearanceChange}
                                />
                                <label
                                  htmlFor="theme-system"
                                  className="flex flex-col items-center justify-center p-3 sm:p-4 h-12 sm:h-14 text-center border rounded-lg cursor-pointer touch-manipulation
                                    peer-checked:border-2 hover:bg-gray-50"
                                  style={{ borderColor: appearanceSettings.theme === 'system' ? appearanceSettings.accentColor : '#e5e7eb' }}
                                >
                                  <span className="text-xs sm:text-sm font-medium">Automatique (selon les préférences système)</span>
                                  {appearanceSettings.theme === 'system' && (
                                    <CheckIcon className="absolute top-2 right-2 h-4 sm:h-5 w-4 sm:w-5" style={{ color: appearanceSettings.accentColor }} />
                                  )}
                                </label>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Couleur d&apos;accentuation
                            </label>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
                              {colorPalette.map((color) => (
                                <div key={color.value} className="relative">
                                  <input
                                    type="radio"
                                    id={`color-${color.value.substring(1)}`}
                                    name="accentColor"
                                    value={color.value}
                                    className="sr-only peer"
                                    checked={(themePreview || appearanceSettings.accentColor) === color.value}
                                    onChange={() => handleAccentColorChange(color.value)}
                                  />
                                                                      <label
                                    htmlFor={`color-${color.value.substring(1)}`}
                                    className="flex flex-col items-center p-2 sm:p-3 text-center border rounded-lg cursor-pointer touch-manipulation
                                      peer-checked:border-2 hover:opacity-90"
                                    style={{ borderColor: (themePreview || appearanceSettings.accentColor) === color.value ? color.value : '#e5e7eb' }}
                                  >
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mb-1" style={{ backgroundColor: color.value }}></div>
                                    <span className="text-xs font-medium truncate w-full">{color.name}</span>
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-4">
                              Options d&apos;accessibilité
                            </h3>
                            <div className="space-y-4">
                              <ToggleSwitch
                                label="Mode haute lisibilité"
                                name="highContrast"
                                checked={appearanceSettings.highContrast}
                                onChange={handleAppearanceChange}
                                tooltip="Augmente le contraste pour une meilleure lisibilité"
                              />
                              
                              <ToggleSwitch
                                label="Réduire les animations"
                                name="reducedMotion"
                                checked={appearanceSettings.reducedMotion}
                                onChange={handleAppearanceChange}
                                tooltip="Réduit ou désactive les animations de l'interface"
                              />
                              
                              <div className="pt-1 pb-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                  Taille des textes
                                </label>
                                <div className="flex items-center">
                                  <input
                                    type="range"
                                    min="0.8"
                                    max="1.4"
                                    step="0.1"
                                    name="fontScale"
                                    value={appearanceSettings.fontScale}
                                    onChange={handleAppearanceChange}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#213f5b]"
                                  />
                                  <span className="ml-3 w-10 text-sm text-gray-700">
                                    {appearanceSettings.fontScale}x
                                  </span>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                  <span className="text-xs text-gray-500">A</span>
                                  <span className="text-base text-gray-500">A</span>
                                  <span className="text-xl text-gray-500">A</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex">
                              <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                              <div>
                                <h4 className="text-sm font-medium text-blue-800">Prévisualisation des changements</h4>
                                <p className="mt-1 text-sm text-blue-700">
                                  Certains changements d&apos;apparence nécessiteront un rechargement de la page pour être appliqués complètement.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Layout Preferences */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-center">
                            <WrenchIcon className="h-6 w-6 mr-2.5" style={{ color: appearanceSettings.accentColor }} />
                            <h2 className="text-xl font-medium text-gray-900">Préférences d&apos;affichage</h2>
                          </div>
                        </div>
                        
                        <div className="lg:p-8 p-6">
                          <div className="space-y-4">
                            <ToggleSwitch
                              label="Mode compact"
                              name="compactMode"
                              checked={appearanceSettings.compactMode}
                              onChange={handleAppearanceChange}
                              tooltip="Réduit l'espacement pour afficher plus de contenu"
                            />
                            
                            <ToggleSwitch
                              label="Densité accrue"
                              name="denseMode"
                              checked={appearanceSettings.denseMode}
                              onChange={handleAppearanceChange}
                              tooltip="Augmente la densité des éléments dans les listes et tableaux"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Floating save button */}
                                        {/* Mobile Bottom Navigation */}
                  <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 px-2 py-2">
                    <div className="flex justify-around items-center">
                      {(Object.keys(sectionTitles) as TabType[]).map(key => (
                        <button
                          key={key}
                          onClick={() => setActiveTab(key)}
                          className={`flex flex-col items-center p-2 rounded-lg text-xs touch-manipulation ${
                            activeTab === key 
                              ? 'font-medium' 
                              : 'text-gray-500'
                          }`}
                          style={{ color: activeTab === key ? appearanceSettings.accentColor : '' }}
                        >
                          <span className="mb-1">
                            {sectionIcons[key]}
                          </span>
                          <span className="truncate" style={{ maxWidth: '70px' }}>
                            {sectionTitles[key]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                      
                  {/* Floating Save Button for Mobile */}
                  {hasChanges && (
                    <motion.div
                      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 50 }}
                      className="fixed bottom-20 right-4 z-40 sm:hidden"
                    >
                      <button
                        onClick={handleSubmit}
                        className="rounded-full h-14 w-14 shadow-lg flex items-center justify-center hover:shadow-xl active:scale-95 transition-all touch-manipulation"
                        style={{ backgroundColor: appearanceSettings.accentColor, color: 'white' }}
                      >
                        {loading ? (
                          <ArrowPathIcon className="h-6 w-6 animate-spin" />
                        ) : (
                          <CheckCircleIcon className="h-6 w-6" />
                        )}
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Calendar Icon component
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
      />
    </svg>
  );
}

// Clock Icon component
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
