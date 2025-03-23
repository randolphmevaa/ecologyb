"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import FocusLock from "react-focus-lock";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { INewUser } from "@/types/INewUser";
import { 
  X, User, Mail, Phone, Briefcase, Building2, CreditCard, UserCircle, 
  Loader2, Globe, MapPin, Euro, Upload, AlertCircle, CheckCircle2 
} from "lucide-react";

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (newUser: INewUser) => void;
}

export function AddContactModal({ isOpen, onClose, onUserAdded }: AddContactModalProps) {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    role: "",
    gender: "",
    // Additional Régie fields
    nomEntreprise: "",
    siteWeb: "",
    adresse: "",
    codePostalVille: "",
    siret: "",
    emailPro: "",
    telephonePro: "",
    tva: "",
    logo: null as File | null
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine if we need to show the Régie specific fields
  const isRegieRole = formData.role === "Project / Installation Manager";

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        prenom: "",
        nom: "",
        email: "",
        telephone: "",
        role: "",
        gender: "",
        nomEntreprise: "",
        siteWeb: "",
        adresse: "",
        codePostalVille: "",
        siret: "",
        emailPro: "",
        telephonePro: "",
        tva: "",
        logo: null
      });
      setErrors({});
      setTouched({});
      setLogoPreview(null);
    }
  }, [isOpen]);

  // Handle Escape key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Clear error when user types
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  // Handle logo file upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, logo: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
        
        // Show success animation (we would normally add a success message here)
        const successElement = document.getElementById('logo-upload-success');
        if (successElement) {
          successElement.classList.remove('opacity-0');
          successElement.classList.add('opacity-100');
          
          // Hide after 3 seconds
          setTimeout(() => {
            successElement.classList.remove('opacity-100');
            successElement.classList.add('opacity-0');
          }, 3000);
        }
      };
      reader.readAsDataURL(file);
      
      // Clear any logo-related errors
      if (errors.logo) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.logo;
          return newErrors;
        });
      }
    }
  };

  // Trigger file input click when the upload button is clicked
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove the logo
  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, logo: null }));
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Field validation
  const validateField = (name: string, value: string | File | null): string => {
    // Required fields
    const requiredFields = ["prenom", "nom", "email", "telephone", "role", "gender"];
    
    // Additional required fields for Régie role
    const regieRequiredFields = ["nomEntreprise", "siret", "emailPro"];
    
    // Check if the field is required and should be validated
    const isRequired = 
      requiredFields.includes(name) || 
      (isRegieRole && regieRequiredFields.includes(name));
    
    // Skip validation for non-required fields if they're empty
    if (!isRequired && (!value || (typeof value === 'string' && !value.trim()))) {
      return "";
    }
    
    if (isRequired && (!value || (typeof value === 'string' && !value.trim()))) {
      return "Ce champ est requis";
    }
    
    // Field-specific validations
    switch (name) {
      case "email":
      case "emailPro":
        if (!/^\S+@\S+\.\S+$/.test(value as string)) {
          return "Veuillez entrer un email valide";
        }
        break;
      case "telephone":
      case "telephonePro":
        if (!/^[0-9+\s()-]{8,20}$/.test(value as string)) {
          return "Format de téléphone invalide";
        }
        break;
      case "siret":
        if (!/^[0-9]{9,14}$/.test(value as string)) {
          return "Le SIRET doit contenir entre 9 et 14 chiffres";
        }
        break;
      case "tva":
        if (value && !/^[A-Z]{2}[0-9A-Z]{2,12}$/.test(value as string)) {
          return "Format de TVA invalide (ex: FR12345678901)";
        }
        break;
      case "siteWeb":
        if (value && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value as string)) {
          return "Format d'URL invalide";
        }
        break;
    }
    
    return "";
  };

  // Handle field blur for validation
  const handleBlur = (name: string, value: string | File | null) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Validate all form fields
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const fieldsToValidate = [
      "prenom", "nom", "email", "telephone", "role", "gender"
    ];
    
    // Add Régie fields if that role is selected
    if (isRegieRole) {
      fieldsToValidate.push(
        "nomEntreprise", "siteWeb", "adresse", "codePostalVille", 
        "siret", "emailPro", "telephonePro", "tva"
      );
    }
    
    // Validate each field
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation display
    const allTouched: { [key: string]: boolean } = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.error-field');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload if needed
      const submitData = new FormData();
      
      // Basic user data
      const userData = {
        firstName: formData.prenom,
        lastName: formData.nom,
        email: formData.email,
        phone: formData.telephone,
        role: formData.role,
        gender: formData.gender,
      };
      
      // Add Régie specific data if needed
      if (isRegieRole) {
        Object.assign(userData, {
          companyName: formData.nomEntreprise,
          website: formData.siteWeb,
          address: formData.adresse,
          postalCode: formData.codePostalVille,
          siret: formData.siret,
          professionalEmail: formData.emailPro,
          professionalPhone: formData.telephonePro,
          vatNumber: formData.tva
        });
        
        // Add logo if provided
        if (formData.logo) {
          submitData.append('logo', formData.logo);
        }
      }
      
      // Add all user data to FormData
      submitData.append('userData', JSON.stringify(userData));
      
      // Determine endpoint based on role
      const endpoint = formData.role === "Client / Customer (Client Portal)" 
        ? "/api/contacts" 
        : "/api/users";
      
      // Submit the form data
      const response = await fetch(endpoint, {
        method: "POST",
        body: submitData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Log activity
      await logActivity(formData.email, formData.role);
      
      // Success! Close modal and notify parent
      onUserAdded(data);
      onClose();
      showNotification("Contact ajouté avec succès", "success");
      
    } catch (error) {
      console.error("Error submitting form:", error);
      showNotification("Erreur lors de l'ajout du contact", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Log activity to server
  const logActivity = async (email: string, role: string) => {
    // Get user info from localStorage
    const proInfoStr = localStorage.getItem("proInfo");
    const proInfo = proInfoStr ? JSON.parse(proInfoStr) : {};
  
    // Format the current time
    const now = new Date();
    const formattedTime = `${now.getHours()}h${(now.getMinutes() < 10 ? "0" : "") + now.getMinutes()}`;
  
    // Map role to French label
    const roleMapping: Record<string, string> = {
      "Sales Representative / Account Executive": "Commercial",
      "Project / Installation Manager": "Régie",
      "Technician / Installer": "Technicien",
      "Customer Support / Service Representative": "Support client",
      "Super Admin": "Super administrateur",
      "Client / Customer (Client Portal)": "Client",
    };
    
    const roleLabel = roleMapping[role] || role;
    const logDetails = `${email} ajouté comme ${roleLabel}`;
  
    // Send log to API
    try {
      await fetch("/api/activity-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "Nouvel utilisateur créé",
          details: logDetails,
          time: formattedTime,
          user: proInfo.email || "unknown",
        }),
      });
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  };

  // Show notification message
  const showNotification = (message: string, type: 'success' | 'error') => {
    // Implementation would depend on your notification system
    console.log(`${type}: ${message}`);
  };

  // Render form field with label, icon, and error handling
  const renderField = (
    id: string, 
    label: string, 
    type: string = "text", 
    icon: React.ReactNode, 
    placeholder: string = "", 
    required: boolean = false,
    options?: string[][]
  ) => {
    const hasError = touched[id] && errors[id];
    const isValid = touched[id] && !errors[id];
    
    return (
      <div className={`mb-5 ${hasError ? 'error-field' : ''}`}>
        <label htmlFor={id} className="flex items-center text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
          
          {type === "select" ? (
            <select
              id={id}
              value={formData[id as keyof typeof formData] as string}
              onChange={handleChange}
              onBlur={(e) => handleBlur(id, e.target.value)}
              required={required}
              className={`pl-10 pr-10 py-3 block w-full rounded-lg border-2 shadow-sm focus:ring-2 focus:ring-offset-0 appearance-none bg-white transition-all duration-200 ${
                hasError 
                  ? "border-red-300 focus:ring-red-200 focus:border-red-400" 
                  : isValid
                    ? "border-green-300 focus:ring-green-200 focus:border-green-400"
                    : "border-gray-200 focus:ring-blue-100 focus:border-blue-500"
              }`}
            >
              <option value="">{placeholder}</option>
              {options?.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          ) : type === "textarea" ? (
            <textarea
              id={id}
              value={formData[id as keyof typeof formData] as string}
              onChange={handleChange}
              onBlur={(e) => handleBlur(id, e.target.value)}
              placeholder={placeholder}
              required={required}
              rows={3}
              className={`pl-10 pr-3 py-3 block w-full rounded-lg border-2 shadow-sm focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                hasError 
                  ? "border-red-300 focus:ring-red-200 focus:border-red-400" 
                  : isValid
                    ? "border-green-300 focus:ring-green-200 focus:border-green-400"
                    : "border-gray-200 focus:ring-blue-100 focus:border-blue-500"
              }`}
            />
          ) : (
            <input
              type={type}
              id={id}
              value={formData[id as keyof typeof formData] as string}
              onChange={handleChange}
              onBlur={(e) => handleBlur(id, e.target.value)}
              placeholder={placeholder}
              required={required}
              className={`pl-10 pr-9 py-3 block w-full rounded-lg border-2 shadow-sm focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                hasError 
                  ? "border-red-300 focus:ring-red-200 focus:border-red-400" 
                  : isValid
                    ? "border-green-300 focus:ring-green-200 focus:border-green-400"
                    : "border-gray-200 focus:ring-blue-100 focus:border-blue-500"
              }`}
            />
          )}
          
          {/* Status indicators */}
          {hasError && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
          
          {isValid && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          )}
          
          {/* Dropdown arrow for select inputs */}
          {type === "select" && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Error message */}
        {hasError && (
          <p className="text-red-500 text-xs mt-1 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors[id]}
          </p>
        )}
      </div>
    );
  };

  // File input for logo upload
  const renderLogoUpload = () => {
    return (
      <div className="mb-5">
        <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
          Logo de l&apos;entreprise
        </label>
        
        <input
          type="file"
          id="logo"
          ref={fileInputRef}
          onChange={handleLogoChange}
          accept="image/*"
          className="hidden"
        />
        
        <div className="mt-1 flex items-center">
          {logoPreview ? (
            <div className="relative">
              <img 
                src={logoPreview} 
                alt="Company logo" 
                className="w-20 h-20 object-contain border-2 border-gray-200 rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div 
              onClick={handleUploadClick}
              className="w-full flex flex-col items-center justify-center py-6 px-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Cliquez pour sélectionner une image</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF jusqu&apos;à 10MB</p>
            </div>
          )}
        </div>
        
        {logoPreview ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleUploadClick}
            className="mt-2 text-sm"
          >
            Changer le logo
          </Button>
        ) : null}
        
        {touched.logo && errors.logo && (
          <p className="text-red-500 text-xs mt-1">{errors.logo}</p>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop with blur effect */}
        <motion.div
          className="absolute inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <FocusLock>
          <motion.div
            className="relative bg-white z-10 w-full h-[95vh] overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true"
          >
            {/* Left Sidebar */}
            <div className="hidden md:block w-64 lg:w-80 bg-gradient-to-b from-[#213f5b] to-[#3978b5] text-white overflow-hidden relative">
              {/* Abstract decorative shapes */}
              <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -mt-48 -ml-48"></div>
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl -mb-40 -mr-40"></div>
              <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-blue-300 opacity-10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* Left sidebar content */}
              <div className="relative h-full flex flex-col p-8">
                {/* Logo or branding section */}
                <div className="mb-8">
                  <button 
                    onClick={onClose}
                    className="inline-flex items-center text-sm text-white/80 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Retour au tableau de bord
                  </button>
                  
                  <div className="mt-10">
                    <h1 className="text-3xl font-bold leading-tight">
                      Ajout d&apos;un nouvel utilisateur
                    </h1>
                    <p className="text-blue-100 mt-3 opacity-90 leading-relaxed">
                      Enrichissez votre plateforme avec de nouveaux membres pour améliorer la collaboration et la productivité.
                    </p>
                  </div>
                </div>
                
                {/* Feature highlights */}
                <div className="flex-1 mt-4">
                  <div className="space-y-6">
                    <div className="bg-white/10 rounded-lg p-5 backdrop-blur-sm">
                      <div className="flex items-start">
                        <div className="p-2 bg-white/20 rounded-full">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium text-lg">Gestion simplifiée</h3>
                          <p className="text-sm text-blue-100 mt-1 opacity-80 leading-relaxed">
                            Créez, modifiez et gérez tous vos utilisateurs depuis un seul endroit.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 rounded-lg p-5 backdrop-blur-sm">
                      <div className="flex items-start">
                        <div className="p-2 bg-white/20 rounded-full">
                          <Briefcase className="h-5 w-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium text-lg">Rôles personnalisés</h3>
                          <p className="text-sm text-blue-100 mt-1 opacity-80 leading-relaxed">
                            Attribuez des rôles spécifiques pour contrôler l&apos;accès aux fonctionnalités.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {isRegieRole && (
                      <div className="bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-lg p-5 backdrop-blur-sm border border-white/10">
                        <div className="flex items-start">
                          <div className="p-2 bg-white/20 rounded-full">
                            <Building2 className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-medium text-lg">Profil Régie</h3>
                            <p className="text-sm text-blue-100 mt-1 opacity-80 leading-relaxed">
                              Vous configurez actuellement un compte de type Régie avec des champs supplémentaires pour les informations d&apos;entreprise.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Help section */}
                <div className="mt-auto pt-6 border-t border-white/10">
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <h4 className="font-medium flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      Besoin d&apos;aide ?
                    </h4>
                    <p className="text-sm mt-2 text-blue-100">
                      Contactez l&apos;équipe support pour obtenir de l&apos;aide concernant l&apos;ajout d&apos;utilisateurs.
                    </p>
                    <button className="mt-3 text-sm font-medium text-white inline-flex items-center bg-white/20 hover:bg-white/30 transition-colors px-3 py-1.5 rounded-full">
                      <span>Consulter la documentation</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Mobile header (visible on mobile only) */}
              <div className="md:hidden bg-gradient-to-r from-[#213f5b] to-[#3978b5] p-4 text-white">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={onClose}
                    className="inline-flex items-center text-sm text-white/80 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Retour
                  </button>
                  
                  <h1 className="text-lg font-bold">Ajout d&apos;utilisateur</h1>
                  
                  <div className="w-5"></div> {/* Spacer for alignment */}
                </div>
              </div>
              
              {/* Top bar with actions and info */}
              <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-full">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Nouvel Utilisateur</h2>
                    <p className="text-sm text-gray-500">Créez un nouvel utilisateur</p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="hidden md:flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Fermer"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              
              {/* Main form area */}
              <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-blue-50/30">
                <form onSubmit={handleSubmit} noValidate className="max-w-5xl mx-auto">
                  
                  {/* Form header card */}
                  <div className="mb-6 bg-white backdrop-blur-sm rounded-xl shadow-lg border border-blue-100/50 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#213f5b] to-[#3978b5] p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-white">
                            Informations de l&apos;utilisateur
                          </h3>
                          <p className="text-blue-100 text-sm">
                            Veuillez remplir tous les champs marqués d&apos;un astérisque (*)
                          </p>
                        </div>
                      </div>
                    </div>
                    

                  </div>
                  
                  {/* Basic Information Section */}
                  <div className="mb-6 bg-white backdrop-blur-sm rounded-xl shadow-lg border border-blue-100/50 overflow-hidden">
                    <div className="p-6 relative">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 opacity-20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                      
                      <h4 className="text-lg font-semibold text-[#213f5b] mb-6 flex items-center relative">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <User className="h-5 w-5 text-blue-700" />
                        </div>
                        Informations personnelles
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative">
                        <div>
                          {renderField(
                            "prenom", 
                            "Prénom", 
                            "text", 
                            <User className="h-5 w-5 text-gray-400" />, 
                            "Entrez le prénom", 
                            true
                          )}
                          
                          {renderField(
                            "nom", 
                            "Nom", 
                            "text", 
                            <User className="h-5 w-5 text-gray-400" />, 
                            "Entrez le nom", 
                            true
                          )}
                        </div>
                        
                        <div>
                          {renderField(
                            "email", 
                            "Email", 
                            "email", 
                            <Mail className="h-5 w-5 text-gray-400" />, 
                            "Entrez l'email", 
                            true
                          )}
                          
                          {renderField(
                            "telephone", 
                            "Téléphone", 
                            "tel", 
                            <Phone className="h-5 w-5 text-gray-400" />, 
                            "Entrez le numéro de téléphone", 
                            true
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Role Section */}
                  <div className="mb-6 bg-white backdrop-blur-sm rounded-xl shadow-lg border border-blue-100/50 overflow-hidden">
                    <div className="p-6 relative">
                      {/* Decorative elements */}
                      <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-100 opacity-20 rounded-full blur-3xl -ml-20 -mb-20"></div>
                      
                      <h4 className="text-lg font-semibold text-[#213f5b] mb-6 flex items-center relative">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <Briefcase className="h-5 w-5 text-blue-700" />
                        </div>
                        Rôle et accès
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative">
                        <div>
                          {renderField(
                            "role", 
                            "Rôle", 
                            "select", 
                            <Briefcase className="h-5 w-5 text-gray-400" />, 
                            "Sélectionnez un rôle", 
                            true,
                            [
                              ["Sales Representative / Account Executive", "Représentant commercial / Chargé de compte"],
                              ["Project / Installation Manager", "Régie"],
                              ["Technician / Installer", "Technicien / Installateur"],
                              ["Customer Support / Service Representative", "Support client / Représentant du service"],
                              ["Super Admin", "Super administrateur"],
                              // ["Client / Customer (Client Portal)", "Client"]
                            ]
                          )}
                        </div>
                        
                        <div>
                          {renderField(
                            "gender", 
                            "Genre", 
                            "select", 
                            <UserCircle className="h-5 w-5 text-gray-400" />, 
                            "Sélectionnez un genre", 
                            true,
                            [
                              ["Homme", "Homme"],
                              ["Femme", "Femme"]
                            ]
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Régie specific fields (conditionally rendered) */}
                  <AnimatePresence>
                    {isRegieRole && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, type: "spring" }}
                        className="overflow-hidden mb-6"
                      >
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 backdrop-blur-sm rounded-xl shadow-lg border border-blue-200 overflow-hidden relative">
                          {/* Decorative elements */}
                          <div className="absolute top-0 left-1/2 w-40 h-40 bg-blue-200 opacity-20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
                          <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-200 opacity-20 rounded-full blur-3xl -mr-20 -mb-20"></div>
                          
                          <div className="pt-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                          
                          <div className="p-6 relative">
                            <h4 className="text-lg font-semibold text-[#213f5b] mb-6 flex items-center">
                              <div className="p-2 bg-blue-200 rounded-lg mr-3">
                                <Building2 className="h-5 w-5 text-blue-800" />
                              </div>
                              Informations Régie
                              <span className="ml-3 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                Entreprise
                              </span>
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                              <div>
                                {renderField(
                                  "nomEntreprise", 
                                  "Nom de l'entreprise", 
                                  "text", 
                                  <Building2 className="h-5 w-5 text-gray-400" />, 
                                  "Entrez le nom de l'entreprise", 
                                  true
                                )}
                                
                                {renderField(
                                  "siteWeb", 
                                  "Site Web", 
                                  "url", 
                                  <Globe className="h-5 w-5 text-gray-400" />, 
                                  "https://www.example.com"
                                )}
                                
                                {renderField(
                                  "adresse", 
                                  "Adresse", 
                                  "textarea", 
                                  <MapPin className="h-5 w-5 text-gray-400" />, 
                                  "Entrez l'adresse complète"
                                )}
                                
                                {renderField(
                                  "codePostalVille", 
                                  "Code postal et ville", 
                                  "text", 
                                  <MapPin className="h-5 w-5 text-gray-400" />, 
                                  "75000 Paris"
                                )}
                              </div>
                              
                              <div>
                                {renderField(
                                  "siret", 
                                  "Numéro SIRET", 
                                  "text", 
                                  <CreditCard className="h-5 w-5 text-gray-400" />, 
                                  "12345678900001", 
                                  true
                                )}
                                
                                {renderField(
                                  "emailPro", 
                                  "Email professionnel", 
                                  "email", 
                                  <Mail className="h-5 w-5 text-gray-400" />, 
                                  "contact@entreprise.com", 
                                  true
                                )}
                                
                                {renderField(
                                  "telephonePro", 
                                  "Téléphone professionnel", 
                                  "tel", 
                                  <Phone className="h-5 w-5 text-gray-400" />, 
                                  "01 23 45 67 89"
                                )}
                                
                                {renderField(
                                  "tva", 
                                  "Numéro de TVA", 
                                  "text", 
                                  <Euro className="h-5 w-5 text-gray-400" />, 
                                  "FR12345678901"
                                )}
                              </div>
                            </div>
                            
                            {/* Logo upload section with enhanced styling */}
                            <div className="mt-6 relative">
                              <h5 className="text-base font-medium text-[#213f5b] mb-3 flex items-center">
                                <Upload className="mr-2 h-5 w-5 text-blue-500" />
                                Logo de l&apos;entreprise
                              </h5>
                              <div className="mt-2 p-6 bg-white/50 backdrop-blur-sm rounded-xl border-2 border-dashed border-blue-200">
                                {renderLogoUpload()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
              
              {/* Bottom action bar (sticky) */}
              <div className="p-5 border-t border-blue-100 bg-white shadow-lg z-10">
                <div className="max-w-5xl mx-auto">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm order-2 sm:order-1">
                      {isRegieRole ? (
                        <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">Type de compte: Régie (entreprise)</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <span>Tous les champs obligatoires doivent être remplis</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-3 order-1 sm:order-2 w-full sm:w-auto">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none px-5 py-2.5 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all"
                      >
                        Annuler
                      </Button>
                      
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        className="flex-1 sm:flex-none px-7 py-3 bg-gradient-to-r from-[#213f5b] to-[#3978b5] hover:from-[#162b40] hover:to-[#2d5e8e] text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="relative">
                              <Loader2 className="h-5 w-5 animate-spin" />
                              <div className="absolute inset-0 h-5 w-5 animate-ping opacity-30 rounded-full bg-white"></div>
                            </div>
                            <span className="ml-3">Traitement...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <UserCircle className="h-5 w-5" />
                            <span className="ml-2 font-medium">Ajouter l&apos;utilisateur</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </FocusLock>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}