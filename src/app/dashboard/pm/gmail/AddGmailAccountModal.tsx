"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  XMarkIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserCircleIcon,
  CheckIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

// Define GmailAccount interface
interface GmailAccount {
  _id: string;
  email: string;
  name: string;
  avatar: string;
  status: string;
  unreadCount: number;
  lastChecked: string;
  signature: string;
  isDefault: boolean;
  quota: {
    used: number;
    total: number;
  };
}

interface AddGmailAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountAdded: (account: GmailAccount) => void;
}

export const AddGmailAccountModal: React.FC<AddGmailAccountModalProps> = ({
  isOpen,
  onClose,
  onAccountAdded,
}) => {
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isDefault, setIsDefault] = useState<boolean>(false);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validate email
      if (!email.trim() || !email.includes('@')) {
        setError("Veuillez saisir une adresse email valide");
        return;
      }
      
      // Validate name
      if (!name.trim()) {
        setError("Veuillez saisir un nom pour ce compte");
        return;
      }
      
      setError(null);
      setStep(2);
    } else if (step === 2) {
      // Validate password
      if (!password.trim() || password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères");
        return;
      }
      
      setError(null);
      handleConnect();
    }
  };

  // Handle account connection
  const handleConnect = () => {
    setIsConnecting(true);
    setError(null);
    
    // In a real implementation, this would be an API call to connect the Gmail account
    // Here we just simulate the connection with a timeout
    setTimeout(() => {
      // Create the new account object
      const newAccount: GmailAccount = {
        _id: `account_${Date.now()}`,
        email,
        name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=213f5b&color=fff`,
        status: "connected",
        unreadCount: 0,
        lastChecked: new Date().toISOString(),
        signature: `<p>Cordialement,<br>${name}</p>`,
        isDefault,
        quota: {
          used: 2.1 * 1024 * 1024 * 1024, // 2.1 GB
          total: 15 * 1024 * 1024 * 1024  // 15 GB
        }
      };
      
      // Call the onAccountAdded callback
      onAccountAdded(newAccount);
      
      // Reset states
      setIsConnecting(false);
      setEmail("");
      setName("");
      setPassword("");
      setStep(1);
      setIsDefault(false);
      
      // Close the modal
      onClose();
    }, 2000);
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl overflow-hidden relative"
      >
        {/* Background Decoration */}
        <div className="absolute -z-10 right-0 top-0 w-96 h-96 bg-[#bfddf9] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute -z-10 left-0 bottom-0 w-96 h-96 bg-[#d2fcb2] opacity-5 rounded-full blur-3xl"></div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#213f5b] hover:bg-[#f0f0f0] transition-colors"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#f0f7ff] flex items-center justify-center">
            <EnvelopeIcon className="h-6 w-6 text-[#213f5b]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#213f5b]">Ajouter un compte Gmail</h2>
            <p className="text-sm text-[#213f5b] opacity-75">
              {step === 1 ? "Saisissez les informations de votre compte" : "Connectez-vous à votre compte Gmail"}
            </p>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="w-full h-1 bg-[#f0f0f0] rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#213f5b] to-[#3978b5] transition-all duration-300"
            style={{ width: `${step * 50}%` }}
          ></div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <>
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#213f5b] mb-1">
                    Adresse Gmail
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-[#213f5b] opacity-50" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre.email@gmail.com"
                      className="pl-10 pr-4 py-2.5 w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9]"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#213f5b] mb-1">
                    Nom du compte
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <UserCircleIcon className="h-5 w-5 text-[#213f5b] opacity-50" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Support, Commercial, etc."
                      className="pl-10 pr-4 py-2.5 w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9]"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center pt-2">
                  <input
                    type="checkbox"
                    id="default"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="h-4 w-4 text-[#213f5b] border-[#eaeaea] rounded focus:ring-[#bfddf9]"
                  />
                  <label htmlFor="default" className="ml-2 text-sm text-[#213f5b]">
                    Définir comme compte par défaut
                  </label>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[#213f5b] mb-1">
                    Mot de passe Gmail
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-[#213f5b] opacity-50" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Votre mot de passe"
                      className="pl-10 pr-4 py-2.5 w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9]"
                      required
                    />
                  </div>
                </div>
                
                <div className="bg-[#f8fafc] rounded-lg p-4 border border-[#eaeaea]">
                  <p className="text-sm text-[#213f5b]">
                    <span className="font-medium">Note:</span> Dans une application réelle, nous utiliserions OAuth pour une connexion sécurisée à Gmail. Aucun mot de passe ne serait stocké.
                  </p>
                </div>
              </div>
            </>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            {step === 1 ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-[#eaeaea] text-[#213f5b] hover:bg-[#f8fafc] transition-colors rounded-lg py-2.5 px-5"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#213f5b] to-[#3978b5] hover:from-[#152a3d] hover:to-[#2d5e8e] text-white transition-all rounded-lg py-2.5 px-5 flex items-center shadow-md hover:shadow-lg"
                >
                  <span>Continuer</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="border-[#eaeaea] text-[#213f5b] hover:bg-[#f8fafc] transition-colors rounded-lg py-2.5 px-5 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Retour</span>
                </Button>
                <Button
                  type="submit"
                  disabled={isConnecting}
                  className="bg-gradient-to-r from-[#213f5b] to-[#3978b5] hover:from-[#152a3d] hover:to-[#2d5e8e] text-white transition-all rounded-lg py-2.5 px-5 flex items-center shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isConnecting ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                      <span>Connexion...</span>
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-4 w-4 mr-2" />
                      <span>Connecter</span>
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};
