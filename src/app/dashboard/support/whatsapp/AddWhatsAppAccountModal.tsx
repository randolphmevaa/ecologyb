"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  QrCodeIcon,
  XMarkIcon,
  PhoneIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { IWhatsAppAccount } from "./page";

interface AddWhatsAppAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountAdded: (account: IWhatsAppAccount) => void;
}

export function AddWhatsAppAccountModal({
  isOpen,
  onClose,
  onAccountAdded,
}: AddWhatsAppAccountModalProps) {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [connectionStatus, setConnectionStatus] = useState<string>("waiting"); // waiting, connecting, connected, failed

  // QR Code scan simulation
  const handleConnectWhatsApp = () => {
    if (!phoneNumber.trim() || !businessName.trim()) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    setError(null);
    setLoading(true);
    setConnectionStatus("connecting");
    
    // Simulate connection process
    setTimeout(() => {
      setLoading(false);
      setConnectionStatus("connected");
      
      // Move to the next step after connection
      setTimeout(() => {
        setStep(3);
      }, 1500);
    }, 3000);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Create new WhatsApp account object
    const newAccount: IWhatsAppAccount = {
      _id: `wa_${Date.now()}`,
      phoneNumber,
      name: businessName,
      status: "connected",
      businessName,
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(businessName)}&background=213f5b&color=fff`,
      messagesPerDay: 0,
      messagesTotal: 0
    };
    
    // Call the onAccountAdded callback with the new account
    onAccountAdded(newAccount);
    
    // Close the modal
    onClose();
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
              <h2 className="text-xl font-bold text-[#213f5b]">Ajouter un compte WhatsApp</h2>
              <p className="text-sm text-[#213f5b] opacity-75 mt-1">
                Connectez un numéro WhatsApp Business à votre CRM
              </p>
              <button 
                className="absolute top-6 right-6 text-[#213f5b] hover:text-[#152a3d] rounded-full p-1"
                onClick={onClose}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Content - Step Indicator */}
            <div className="px-6 pt-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <div className={`h-1 rounded-full ${step >= 1 ? 'bg-[#213f5b]' : 'bg-[#eaeaea]'}`}></div>
                </div>
                <div className="flex-shrink-0 mx-2">
                  <div className={`flex items-center justify-center h-6 w-6 rounded-full ${
                    step > 1 ? 'bg-[#213f5b] text-white' : 'bg-[#eaeaea] text-[#213f5b]'
                  }`}>
                    {step > 1 ? (
                      <CheckCircleIcon className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-medium">1</span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className={`h-1 rounded-full ${step >= 2 ? 'bg-[#213f5b]' : 'bg-[#eaeaea]'}`}></div>
                </div>
                <div className="flex-shrink-0 mx-2">
                  <div className={`flex items-center justify-center h-6 w-6 rounded-full ${
                    step > 2 ? 'bg-[#213f5b] text-white' : step === 2 ? 'bg-[#eaeaea] text-[#213f5b]' : 'bg-[#eaeaea] text-[#213f5b] opacity-60'
                  }`}>
                    {step > 2 ? (
                      <CheckCircleIcon className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-medium">2</span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className={`h-1 rounded-full ${step >= 3 ? 'bg-[#213f5b]' : 'bg-[#eaeaea]'}`}></div>
                </div>
                <div className="flex-shrink-0 mx-2">
                  <div className={`flex items-center justify-center h-6 w-6 rounded-full ${
                    step === 3 ? 'bg-[#eaeaea] text-[#213f5b]' : 'bg-[#eaeaea] text-[#213f5b] opacity-60'
                  }`}>
                    <span className="text-xs font-medium">3</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className={`h-1 rounded-full ${step >= 3 ? 'bg-[#213f5b]' : 'bg-[#eaeaea]'}`}></div>
                </div>
              </div>
            </div>
            
            {/* Step 1: Enter Business Info */}
            {step === 1 && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[#213f5b] mb-4">Informations du compte</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#213f5b] mb-1">
                      Nom de l&apos;entreprise <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9] placeholder-[#a0aec0]"
                      placeholder="Entrez le nom de votre entreprise"
                    />
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
                        className="w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9] pl-10 placeholder-[#a0aec0]"
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
                </div>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="border-[#eaeaea] text-[#213f5b] hover:bg-[#f8fafc]"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!businessName.trim() || !phoneNumber.trim()}
                    className="bg-[#213f5b] hover:bg-[#152a3d] text-white"
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 2: Connect WhatsApp */}
            {step === 2 && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[#213f5b] mb-4">Connecter WhatsApp</h3>
                
                <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#eaeaea] mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <QrCodeIcon className="h-6 w-6 text-[#213f5b]" />
                    <p className="text-sm font-medium text-[#213f5b]">Scanner le QR Code</p>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center">
                    {connectionStatus === "waiting" && (
                      <>
                        <div className="bg-white p-3 rounded-lg border border-[#eaeaea] w-48 h-48 flex items-center justify-center mb-4">
                          <QrCodeIcon className="h-32 w-32 text-[#213f5b] opacity-40" />
                        </div>
                        <p className="text-sm text-[#213f5b] text-center">
                          1. Ouvrez WhatsApp sur votre téléphone<br />
                          2. Allez dans Paramètres &gt; Appareils connectés<br />
                          3. Cliquez sur &quot;Associer un appareil&quot;<br />
                          4. Scannez le QR Code ci-dessus
                        </p>
                      </>
                    )}
                    
                    {connectionStatus === "connecting" && (
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="relative mb-4">
                          <div className="absolute inset-0 bg-gradient-to-r from-[#bfddf9] to-[#d2fcb2] rounded-full blur opacity-30 animate-pulse"></div>
                          <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-[#213f5b] border-t-transparent"></div>
                        </div>
                        <p className="text-sm font-medium text-[#213f5b]">Connexion en cours...</p>
                        <p className="text-xs text-[#213f5b] opacity-75 mt-1">
                          Veuillez patienter pendant la connexion à WhatsApp
                        </p>
                      </div>
                    )}
                    
                    {connectionStatus === "connected" && (
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="rounded-full bg-green-100 p-4 mb-4">
                          <CheckCircleIcon className="h-12 w-12 text-green-600" />
                        </div>
                        <p className="text-sm font-medium text-green-700">Connexion réussie!</p>
                        <p className="text-xs text-[#213f5b] opacity-75 mt-1 text-center">
                          Votre compte WhatsApp Business est maintenant connecté.
                        </p>
                      </div>
                    )}
                    
                    {connectionStatus === "failed" && (
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="rounded-full bg-red-100 p-4 mb-4">
                          <ExclamationCircleIcon className="h-12 w-12 text-red-600" />
                        </div>
                        <p className="text-sm font-medium text-red-700">Échec de la connexion</p>
                        <p className="text-xs text-[#213f5b] opacity-75 mt-1 text-center">
                          Une erreur est survenue lors de la connexion. Veuillez réessayer.
                        </p>
                        <Button
                          onClick={() => setConnectionStatus("waiting")}
                          className="mt-4 bg-[#213f5b] hover:bg-[#152a3d] text-white"
                        >
                          <ArrowPathIcon className="h-4 w-4 mr-2" />
                          Réessayer
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="border-[#eaeaea] text-[#213f5b] hover:bg-[#f8fafc]"
                  >
                    Retour
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="border-[#eaeaea] text-[#213f5b] hover:bg-[#f8fafc]"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleConnectWhatsApp}
                      disabled={loading || connectionStatus === "connected"}
                      className={`${
                        connectionStatus === "connected"
                          ? "bg-green-600 hover:bg-green-700" 
                          : "bg-[#213f5b] hover:bg-[#152a3d]"
                      } text-white`}
                    >
                      {connectionStatus === "connecting" ? (
                        <>
                          <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                          Connexion...
                        </>
                      ) : connectionStatus === "connected" ? (
                        <>
                          <CheckCircleIcon className="h-4 w-4 mr-2" />
                          Connecté
                        </>
                      ) : (
                        "Connecter"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Permissions */}
            {step === 3 && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[#213f5b] mb-4">Permissions et finalisation</h3>
                
                <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#eaeaea] mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheckIcon className="h-6 w-6 text-[#213f5b]" />
                    <p className="text-sm font-medium text-[#213f5b]">Permissions requises</p>
                  </div>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-[#213f5b] font-medium">Envoyer des messages</p>
                        <p className="text-xs text-[#213f5b] opacity-75">Envoi de messages texte, médias et documents</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-[#213f5b] font-medium">Recevoir des messages</p>
                        <p className="text-xs text-[#213f5b] opacity-75">Réception des messages entrants</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-[#213f5b] font-medium">Accès au statut des messages</p>
                        <p className="text-xs text-[#213f5b] opacity-75">Tracking des messages envoyés, lus et reçus</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                  <div className="flex items-start gap-2">
                    <div className="text-amber-500 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-800">Note importante</p>
                      <p className="text-xs text-amber-700 mt-1">
                        En connectant ce numéro WhatsApp, vous acceptez les conditions d&apos;utilisation 
                        de l&apos;API WhatsApp Business. Assurez-vous de respecter les politiques de messagerie 
                        de WhatsApp pour éviter toute restriction.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="border-[#eaeaea] text-[#213f5b] hover:bg-[#f8fafc]"
                  >
                    Retour
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="border-[#eaeaea] text-[#213f5b] hover:bg-[#f8fafc]"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="bg-[#213f5b] hover:bg-[#152a3d] text-white"
                    >
                      Finaliser
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}
