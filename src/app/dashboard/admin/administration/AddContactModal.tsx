"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import FocusLock from "react-focus-lock";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { INewUser } from "@/types/INewUser";
import { X, User, Mail, Phone, Briefcase, Building2, CreditCard, UserCircle, Loader2 } from "lucide-react";

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
    siret: "",
    raisonSocial: ""
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSection, setCurrentSection] = useState(1);
  const [ , setTouched] = useState<{ [key: string]: boolean }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        prenom: "",
        nom: "",
        email: "",
        telephone: "",
        role: "",
        gender: "",
        siret: "",
        raisonSocial: ""
      });
      setErrors({});
      setCurrentSection(1);
      setTouched({});
    }
  }, [isOpen]);

  const validateField = (name: string, value: string): string => {
    if (!value.trim()) {
      return "Ce champ est requis";
    }
    if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      return "Veuillez entrer un email valide";
    }
    if (name === "telephone" && !/^[0-9+\s()-]{8,20}$/.test(value)) {
      return "Format de téléphone invalide";
    }
    if (name === "siret" && !/^[0-9]{9,14}$/.test(value)) {
      return "Le SIRET doit contenir entre 9 et 14 chiffres";
    }
    return "";
  };

  const handleBlur = (name: string, value: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateSection = (section: number): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (section === 1) {
      newErrors.prenom = validateField("prenom", formData.prenom);
      newErrors.nom = validateField("nom", formData.nom);
    } else if (section === 2) {
      newErrors.email = validateField("email", formData.email);
      newErrors.telephone = validateField("telephone", formData.telephone);
    } else if (section === 3) {
      newErrors.role = validateField("role", formData.role);
      newErrors.gender = validateField("gender", formData.gender);
      
      if (formData.role === "Project / Installation Manager") {
        newErrors.siret = validateField("siret", formData.siret);
        newErrors.raisonSocial = validateField("raisonSocial", formData.raisonSocial);
      }
    }
    
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextSection = () => {
    if (validateSection(currentSection)) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const prevSection = () => {
    setCurrentSection(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateSection(currentSection)) {
      return;
    }
  
    setIsSubmitting(true);
    const { prenom, nom, email, telephone, role, gender, siret, raisonSocial } = formData;
    const endpoint = role === "Client / Customer (Client Portal)" ? "/api/contacts" : "/api/users";
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: prenom,
          lastName: nom,
          email,
          phone: telephone,
          role,
          gender,
          // Include additional fields if applicable
          ...(role === "Project / Installation Manager" && { siret, raisonSocial }),
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Log the creation action in activity logs
      const proInfoStr = localStorage.getItem("proInfo");
      const proInfo = proInfoStr ? JSON.parse(proInfoStr) : {};
  
      // Format the current time as "14h15" (example)
      const now = new Date();
      const formattedTime =
        now.getHours() + "h" + (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();
  
      // Map the role to a short label for the log details
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
  
      setIsSubmitting(false);
      onUserAdded(data);
      onClose();
      // Show success notification instead of reloading
      showNotification("Contact ajouté avec succès", "success");
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
      showNotification("Erreur lors de l'ajout du contact", "error");
    }
  };  

  const showNotification = (message: string, type: 'success' | 'error') => {
    // Implementation would depend on your notification system
    // This is a placeholder function
    console.log(`${type}: ${message}`);
  };

  if (!isOpen) return null;

  const renderProgressBar = () => {
    return (
      <div className="w-full mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#213f5b]">Progression</span>
          <span className="text-xs font-medium text-[#213f5b]">{currentSection}/3</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-[#213f5b] h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentSection / 3) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderFormSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Informations personnelles</h3>
            
            {/* Prénom */}
            <div className="mb-5">
              <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("prenom", e.target.value)}
                  placeholder="Entrez le prénom"
                  required
                  autoFocus
                  className={`pl-10 pr-3 py-3 block w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                    errors.prenom ? "border-red-300 focus:ring-red-200 focus:border-red-400" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-500"
                  }`}
                />
              </div>
              {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
            </div>

            {/* Nom */}
            <div className="mb-5">
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("nom", e.target.value)}
                  placeholder="Entrez le nom"
                  required
                  className={`pl-10 pr-3 py-3 block w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                    errors.nom ? "border-red-300 focus:ring-red-200 focus:border-red-400" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-500"
                  }`}
                />
              </div>
              {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Coordonnées</h3>

            {/* Email */}
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("email", e.target.value)}
                  placeholder="Entrez l'email"
                  required
                  className={`pl-10 pr-3 py-3 block w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                    errors.email ? "border-red-300 focus:ring-red-200 focus:border-red-400" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-500"
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Téléphone */}
            <div className="mb-5">
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("telephone", e.target.value)}
                  placeholder="Entrez le numéro de téléphone"
                  required
                  className={`pl-10 pr-3 py-3 block w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                    errors.telephone ? "border-red-300 focus:ring-red-200 focus:border-red-400" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-500"
                  }`}
                />
              </div>
              {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Rôle et détails</h3>

            {/* Rôle */}
            <div className="mb-5">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("role", e.target.value)}
                  required
                  className={`pl-10 pr-10 py-3 block w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-offset-0 appearance-none bg-white transition-all duration-200 ${
                    errors.role ? "border-red-300 focus:ring-red-200 focus:border-red-400" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-500"
                  }`}
                >
                  <option value="">Sélectionnez un rôle</option>
                  <option value="Sales Representative / Account Executive">
                    Représentant commercial / Chargé de compte
                  </option>
                  <option value="Project / Installation Manager">
                    Régie
                  </option>
                  <option value="Technician / Installer">
                    Technicien / Installateur
                  </option>
                  <option value="Customer Support / Service Representative">
                    Support client / Représentant du service
                  </option>
                  <option value="Super Admin">
                    Super administrateur
                  </option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
            </div>

            {/* Genre */}
            <div className="mb-5">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircle className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("gender", e.target.value)}
                  required
                  className={`pl-10 pr-10 py-3 block w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-offset-0 appearance-none bg-white transition-all duration-200 ${
                    errors.gender ? "border-red-300 focus:ring-red-200 focus:border-red-400" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-500"
                  }`}
                >
                  <option value="">Sélectionnez un genre</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>

            {/* Additional fields for "Régie" role */}
            {formData.role === "Project / Installation Manager" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-lg bg-indigo-50 mb-5 border border-indigo-100">
                  <h4 className="font-medium text-indigo-800 mb-3">Informations complémentaires Régie</h4>

                  {/* SIRET / SIREN */}
                  <div className="mb-4">
                    <label htmlFor="siret" className="block text-sm font-medium text-gray-700 mb-1">
                      SIRET / SIREN
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="siret"
                        value={formData.siret}
                        onChange={handleChange}
                        onBlur={(e) => handleBlur("siret", e.target.value)}
                        placeholder="Entrez votre numéro SIRET ou SIREN"
                        required
                        className={`pl-10 pr-3 py-3 block w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                          errors.siret ? "border-red-300 focus:ring-red-200 focus:border-red-400" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-500"
                        }`}
                      />
                    </div>
                    {errors.siret && <p className="text-red-500 text-xs mt-1">{errors.siret}</p>}
                  </div>

                  {/* Raison Sociale */}
                  <div>
                    <label htmlFor="raisonSocial" className="block text-sm font-medium text-gray-700 mb-1">
                      Raison Sociale
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="raisonSocial"
                        value={formData.raisonSocial}
                        onChange={handleChange}
                        onBlur={(e) => handleBlur("raisonSocial", e.target.value)}
                        placeholder="Entrez le nom légal de votre entreprise"
                        required
                        className={`pl-10 pr-3 py-3 block w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                          errors.raisonSocial ? "border-red-300 focus:ring-red-200 focus:border-red-400" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-500"
                        }`}
                      />
                    </div>
                    {errors.raisonSocial && <p className="text-red-500 text-xs mt-1">{errors.raisonSocial}</p>}
                  </div>
                </div>
              </motion.div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  const renderNavButtons = () => {
    return (
      <div className="mt-8 flex justify-between items-center">
        {currentSection > 1 ? (
          <Button
            variant="outline"
            onClick={prevSection}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-medium transition-all"
          >
            Précédent
          </Button>
        ) : (
          <div></div> // Empty div to maintain flex layout
        )}
        
        {currentSection < 3 ? (
          <Button
            variant="primary"
            onClick={nextSection}
            className="px-6 py-2.5 text-sm font-medium bg-[#213f5b] hover:bg-indigo-700 text-white transition-all"
          >
            Suivant
          </Button>
        ) : (
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-medium bg-[#213f5b] hover:bg-indigo-700 text-white transition-all"
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Traitement...</span>
              </div>
            ) : (
              "Ajouter le contact"
            )}
          </Button>
        )}
      </div>
    );
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop with blur effect */}
        <motion.div
          className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <FocusLock>
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl z-10 w-full max-w-md max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true"
          >
            {/* Modal header with gradient background */}
            <div className="bg-gradient-to-r from-[#213f5b] to-purple-600 p-6 text-white">
              <div className="flex justify-between items-center">
                <h2 id="modal-title" className="text-2xl font-bold">
                  Ajouter un contact
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-full p-1 hover:bg-white hover:bg-opacity-20 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#213f5b]"
                  aria-label="Fermer la fenêtre modale"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <p className="text-indigo-100 mt-1">Remplissez les informations pour ajouter un nouveau contact</p>
            </div>

            {/* Modal body with scrollable content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {renderProgressBar()}
              <form onSubmit={handleSubmit} noValidate>
                {renderFormSection()}
                {renderNavButtons()}
              </form>
            </div>
          </motion.div>
        </FocusLock>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}