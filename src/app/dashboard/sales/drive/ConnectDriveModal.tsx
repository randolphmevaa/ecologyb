// 4. ConnectDriveModal.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  XMarkIcon,
  // CloudArrowUpIcon,
  ExclamationCircleIcon,
  UserPlusIcon,
  CheckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { IDriveAccount } from "./page";

interface ConnectDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectDrive: (account: IDriveAccount) => void;
}

export const ConnectDriveModal: React.FC<ConnectDriveModalProps> = ({
  isOpen,
  onClose,
  onConnectDrive,
}) => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [connecting, setConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    setConnecting(true);
    
    // Simulate connecting to Google Drive
    setTimeout(() => {
      const newAccount: IDriveAccount = {
        _id: `account_${Date.now()}`,
        email,
        name,
        status: "connected",
        quota: {
          used: 3.2 * 1024 * 1024 * 1024, // 3.2 GB
          total: 15 * 1024 * 1024 * 1024  // 15 GB
        },
        lastSynced: new Date().toISOString(),
        isDefault: false
      };
      
      onConnectDrive(newAccount);
      setEmail("");
      setName("");
      setConnecting(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl overflow-hidden relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#213f5b] hover:bg-[#f0f0f0] transition-colors"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#f0f7ff] flex items-center justify-center">
            <UserPlusIcon className="h-6 w-6 text-[#213f5b]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#213f5b]">Ajouter un compte Google Drive</h2>
            <p className="text-sm text-[#213f5b] opacity-75">
              Connectez un compte Google Drive à votre CRM
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#213f5b] mb-1">
                Adresse email Google
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@gmail.com"
                className="px-4 py-2.5 w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9]"
                required
              />
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#213f5b] mb-1">
                Nom du compte
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Professionnel, Personnel, etc."
                className="px-4 py-2.5 w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9]"
                required
              />
            </div>
          </div>
          
          <div className="bg-[#f8fafc] rounded-lg p-4 border border-[#eaeaea] mb-6">
            <p className="text-sm text-[#213f5b]">
              <span className="font-medium">Note:</span> Dans une application réelle, cette action ouvrirait une fenêtre d&apos;authentification Google pour autoriser l&apos;accès à votre Drive.
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
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
              disabled={connecting}
              className="bg-gradient-to-r from-[#213f5b] to-[#3978b5] hover:from-[#152a3d] hover:to-[#2d5e8e] text-white transition-all rounded-lg py-2.5 px-5 flex items-center shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {connecting ? (
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
          </div>
        </form>
      </motion.div>
    </div>
  );
};