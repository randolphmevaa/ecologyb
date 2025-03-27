"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { XMarkIcon, InformationCircleIcon, ArrowPathIcon, KeyIcon, UserPlusIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

import type { IAdAccount } from "./page";

interface ConnectAdAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountConnected: (account: IAdAccount) => void;
}

export const ConnectAdAccountModal = ({
  isOpen,
  onClose,
  onAccountConnected,
}: ConnectAdAccountModalProps) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: "",
    accountId: "",
    businessName: "",
    accessToken: "",
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [connectionMethod, setConnectionMethod] = useState<"api" | "facebook">("facebook");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real implementation, this would be an API call to the Facebook Marketing API
      // to verify and connect the ad account
      
      // Simulate API delay
      setTimeout(() => {
        // Create a mock account
        const mockAccount: IAdAccount = {
          _id: `account_${Date.now()}`,
          name: formData.name,
          accountId: formData.accountId,
          status: "active",
          currency: "EUR",
          timeZone: "Europe/Paris",
          businessName: formData.businessName,
          businessLogo: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.businessName)}&background=4267B2&color=fff`,
          totalSpent: 0,
          dailySpend: 0
        };
        
        onAccountConnected(mockAccount);
        onClose();
        setLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error connecting account:", error);
      setLoading(false);
    }
  };
  
  // Simulate Facebook Connect
  const handleFacebookConnect = () => {
    setLoading(true);
    
    // In a real implementation, this would open a Facebook OAuth flow
    setTimeout(() => {
      setFormData({
        name: "Nouveau compte publicitaire",
        accountId: "act_" + Math.floor(Math.random() * 1000000000),
        businessName: "Votre Entreprise",
        accessToken: "EAAxx..." + Math.random().toString(36).substring(2, 15)
      });
      
      setStep(2);
      setLoading(false);
    }, 2000);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-[#242526] rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#E4E6EB] dark:border-[#3A3B3C]">
          <h2 className="text-lg font-semibold text-[#050505] dark:text-[#E4E6EB]">
            {step === 1 ? "Connecter un compte publicitaire Facebook" : "Configurer le compte"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#65676B] dark:text-[#B0B3B8] hover:text-[#050505] dark:hover:text-[#E4E6EB] rounded-full p-1"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-4 bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-lg">
                <div className="flex items-start gap-3">
                  <InformationCircleIcon className="h-5 w-5 text-[#1877F2] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[#050505] dark:text-[#E4E6EB]">
                    Connectez votre compte publicitaire Facebook pour gérer vos campagnes publicitaires directement depuis votre CRM. Cette intégration vous permet de créer, modifier et suivre les performances de vos publicités sans quitter l&apos;application.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer ${
                    connectionMethod === "facebook" 
                      ? 'border-[#1877F2] bg-[#E7F3FF] dark:bg-[#263C5A] dark:border-[#1877F2]' 
                      : 'border-[#E4E6EB] dark:border-[#3A3B3C] hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C]'
                  }`}
                  onClick={() => setConnectionMethod("facebook")}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 bg-[#1877F2] rounded-full flex items-center justify-center">
                      <UserPlusIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#050505] dark:text-[#E4E6EB]">Connexion avec Facebook</h3>
                      <p className="text-sm text-[#65676B] dark:text-[#B0B3B8]">Méthode recommandée</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#050505] dark:text-[#E4E6EB] pl-12">
                    Autorisez l&apos;accès via votre compte Facebook Business pour une connexion simple et rapide.
                  </p>
                </div>
                
                <div 
                  className={`p-4 border rounded-lg cursor-pointer ${
                    connectionMethod === "api" 
                      ? 'border-[#1877F2] bg-[#E7F3FF] dark:bg-[#263C5A] dark:border-[#1877F2]' 
                      : 'border-[#E4E6EB] dark:border-[#3A3B3C] hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C]'
                  }`}
                  onClick={() => setConnectionMethod("api")}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 bg-[#1877F2] rounded-full flex items-center justify-center">
                      <KeyIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#050505] dark:text-[#E4E6EB]">Connexion avec un token d&apos;accès</h3>
                      <p className="text-sm text-[#65676B] dark:text-[#B0B3B8]">Pour utilisateurs avancés</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#050505] dark:text-[#E4E6EB] pl-12">
                    Utilisez un token d&apos;accès Facebook API que vous avez généré dans Facebook Business Manager.
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <Button
                  onClick={connectionMethod === "facebook" ? handleFacebookConnect : () => setStep(2)}
                  className="w-full bg-[#1877F2] hover:bg-[#0A66C2] text-white py-2.5"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                      Connexion en cours...
                    </span>
                  ) : (
                    <span>
                      {connectionMethod === "facebook" ? "Se connecter avec Facebook" : "Continuer"}
                    </span>
                  )}
                </Button>
                
                <p className="mt-3 text-xs text-[#65676B] dark:text-[#B0B3B8]">
                  En connectant votre compte, vous acceptez nos <a href="#" className="text-[#1877F2]">Conditions d&apos;utilisation</a> et notre <a href="#" className="text-[#1877F2]">Politique de confidentialité</a>.
                </p>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-4 bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-lg mb-4">
                <div className="flex items-start gap-3">
                  <ShieldCheckIcon className="h-5 w-5 text-[#1877F2] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[#050505] dark:text-[#E4E6EB]">
                    {connectionMethod === "facebook" 
                      ? "Votre compte Facebook a été authentifié avec succès. Veuillez finaliser la configuration pour établir la connexion."
                      : "Veuillez fournir les informations de votre compte publicitaire Facebook et un token d'accès valide avec les permissions adéquates."}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#050505] dark:text-[#E4E6EB] mb-1">
                  Nom du compte (pour référence interne)
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Compte publicitaire principal"
                  className="w-full px-3 py-2 border border-[#E4E6EB] dark:border-[#3A3B3C] rounded-lg bg-white dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#050505] dark:text-[#E4E6EB] mb-1">
                  ID du compte publicitaire
                </label>
                <input
                  type="text"
                  name="accountId"
                  value={formData.accountId}
                  onChange={handleChange}
                  placeholder="act_123456789"
                  className="w-full px-3 py-2 border border-[#E4E6EB] dark:border-[#3A3B3C] rounded-lg bg-white dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                  required
                />
                <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-1">
                  Vous pouvez trouver l&apos;ID de votre compte dans Facebook Business Manager
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#050505] dark:text-[#E4E6EB] mb-1">
                  Nom de l&apos;entreprise
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Votre entreprise"
                  className="w-full px-3 py-2 border border-[#E4E6EB] dark:border-[#3A3B3C] rounded-lg bg-white dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                  required
                />
              </div>
              
              {connectionMethod === "api" && (
                <div>
                  <label className="block text-sm font-medium text-[#050505] dark:text-[#E4E6EB] mb-1">
                    Token d&apos;accès Facebook
                  </label>
                  <input
                    type="text"
                    name="accessToken"
                    value={formData.accessToken}
                    onChange={handleChange}
                    placeholder="EAAxxx..."
                    className="w-full px-3 py-2 border border-[#E4E6EB] dark:border-[#3A3B3C] rounded-lg bg-white dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                    required
                  />
                  <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-1">
                    Le token doit avoir les permissions ads_management, ads_read
                  </p>
                </div>
              )}
              
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#E4E6EB] dark:border-[#3A3B3C] text-[#1877F2] hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C]"
                  onClick={() => setStep(1)}
                >
                  Retour
                </Button>
                
                <Button
                  type="submit"
                  className="bg-[#1877F2] hover:bg-[#0A66C2] text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                      Connexion en cours...
                    </span>
                  ) : (
                    "Connecter le compte"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};