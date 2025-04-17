// This file contains all the modal components needed for the Google Drive integration

// 1. CreateFolderModal.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  XMarkIcon,
  FolderIcon,
  ExclamationCircleIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (folderName: string) => void;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onClose,
  onCreateFolder,
}) => {
  const [folderName, setFolderName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!folderName.trim()) {
      setError("Veuillez saisir un nom de dossier");
      return;
    }
    
    onCreateFolder(folderName);
    setFolderName("");
    setError(null);
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
            <FolderIcon className="h-6 w-6 text-[#213f5b]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#213f5b]">Nouveau dossier</h2>
            <p className="text-sm text-[#213f5b] opacity-75">
              Créez un nouveau dossier dans l&apos;emplacement actuel
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="folderName" className="block text-sm font-medium text-[#213f5b] mb-1">
              Nom du dossier
            </label>
            <input
              type="text"
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Nom du dossier"
              className="px-4 py-2.5 w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9]"
              autoFocus
            />
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
              className="bg-gradient-to-r from-[#213f5b] to-[#3978b5] hover:from-[#152a3d] hover:to-[#2d5e8e] text-white transition-all rounded-lg py-2.5 px-5 flex items-center shadow-md hover:shadow-lg"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              <span>Créer</span>
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

