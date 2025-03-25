"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  XMarkIcon,
  UserPlusIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { IContact, IWhatsAppAccount } from "./page";

interface AddContactToWhatsAppModalProps {
  isOpen: boolean;
  accounts: IWhatsAppAccount[];
  onClose: () => void;
  onContactAdded: (contact: IContact, accountId: string) => void;
}

export function AddContactToWhatsAppModal({
  isOpen,
  accounts,
  onClose,
  onContactAdded,
}: AddContactToWhatsAppModalProps) {
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [isBusinessAccount, setIsBusinessAccount] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<string>(accounts.length > 0 ? accounts[0]._id : "");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Phone number validation
  const validatePhoneNumber = (phone: string) => {
    // Basic validation for international format
    const phoneRegex = /^\+\d{1,3}\d{9,14}$/;
    return phoneRegex.test(phone);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!name.trim()) {
      setError("Le nom du contact est requis");
      return;
    }
    
    if (!phoneNumber.trim()) {
      setError("Le numéro de téléphone est requis");
      return;
    }
    
    if (!validatePhoneNumber(phoneNumber)) {
      setError("Le format du numéro de téléphone est invalide. Utilisez le format international (+336XXXXXXXX)");
      return;
    }
    
    if (!selectedAccount) {
      setError("Vous devez sélectionner un compte WhatsApp");
      return;
    }
    
    setError(null);
    setIsSaving(true);
    
    // Simulate saving delay
    setTimeout(() => {
      // Create new contact object
      const newContact: IContact = {
        _id: `contact_${Date.now()}`,
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim() || undefined,
        company: company.trim() || undefined,
        isBusinessAccount,
        profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=213f5b&color=fff`,
        lastActivity: new Date().toISOString()
      };
      
      // Call the onContactAdded callback with the new contact and selected account
      onContactAdded(newContact, selectedAccount);
      
      // Close the modal
      onClose();
    }, 1000);
  };

  // Backdrop click handler
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div 
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative p-6 border-b border-[#f0f0f0]">
              <h2 className="text-xl font-bold text-[#213f5b]">Ajouter un contact</h2>
              <p className="text-sm text-[#213f5b] opacity-75 mt-1">
                Créez un nouveau contact pour WhatsApp
              </p>
              <button 
                className="absolute top-6 right-6 text-[#213f5b] hover:text-[#152a3d] rounded-full p-1"
                onClick={onClose}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#213f5b] mb-1">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9] pl-10"
                      placeholder="Nom complet"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserPlusIcon className="h-4 w-4 text-[#213f5b] opacity-50" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#213f5b] mb-1">
                    Numéro de téléphone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9] pl-10"
                      placeholder="+33 6 12 34 56 78"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-4 w-4 text-[#213f5b] opacity-50" />
                    </div>
                  </div>
                  <p className="text-xs text-[#213f5b] opacity-75 mt-1">
                    Format international avec indicatif pays (ex: +33612345678)
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#213f5b] mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9] pl-10"
                      placeholder="email@exemple.com"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-4 w-4 text-[#213f5b] opacity-50" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#213f5b] mb-1">
                    Entreprise
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9] pl-10"
                      placeholder="Nom de l'entreprise"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BuildingOfficeIcon className="h-4 w-4 text-[#213f5b] opacity-50" />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isBusinessAccount"
                    checked={isBusinessAccount}
                    onChange={(e) => setIsBusinessAccount(e.target.checked)}
                    className="rounded border-[#eaeaea] text-[#213f5b] focus:ring-[#bfddf9]"
                  />
                  <label htmlFor="isBusinessAccount" className="ml-2 block text-sm text-[#213f5b]">
                    Compte professionnel WhatsApp
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#213f5b] mb-1">
                    Compte WhatsApp à utiliser <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9]"
                  >
                    {accounts.length === 0 ? (
                      <option value="" disabled>Aucun compte disponible</option>
                    ) : (
                      accounts.map((account) => (
                        <option key={account._id} value={account._id}>
                          {account.name} ({account.phoneNumber})
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-[#f0f0f0] bg-[#f8fafc] flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-[#eaeaea] text-[#213f5b] hover:bg-[#f0f0f0]"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSaving || !name.trim() || !phoneNumber.trim() || !selectedAccount}
                className="bg-[#213f5b] hover:bg-[#152a3d] text-white min-w-[100px]"
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Enregistrement...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>Enregistrer</span>
                  </div>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}