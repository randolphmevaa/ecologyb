// 3. UploadFileModal.tsx
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  XMarkIcon,
  CloudArrowUpIcon,
  ExclamationCircleIcon,
  CheckIcon,
  DocumentIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

interface UploadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  currentFolder: string;
  folderName: string;
}

export const UploadFileModal: React.FC<UploadFileModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  // currentFolder,
  folderName,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError("Veuillez sélectionner un fichier à importer");
      return;
    }
    
    onUpload(selectedFile);
    setSelectedFile(null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
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
            <CloudArrowUpIcon className="h-6 w-6 text-[#213f5b]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#213f5b]">Importer un fichier</h2>
            <p className="text-sm text-[#213f5b] opacity-75">
              Importer un fichier dans {folderName || "Drive"}
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div 
            className={`mb-6 border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive 
                ? 'border-[#3978b5] bg-[#f0f7ff]' 
                : 'border-[#eaeaea] hover:border-[#bfddf9] hover:bg-[#f8fafc]'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            
            {selectedFile ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#f0f7ff] rounded-xl flex items-center justify-center mb-4">
                  <DocumentIcon className="h-8 w-8 text-[#3978b5]" />
                </div>
                <p className="text-[#213f5b] font-medium mb-1">{selectedFile.name}</p>
                <p className="text-[#213f5b] opacity-75 text-sm">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#f8fafc] rounded-xl flex items-center justify-center mb-4">
                  <ArrowUpTrayIcon className="h-8 w-8 text-[#213f5b] opacity-50" />
                </div>
                <p className="text-[#213f5b] font-medium mb-1">
                  Glissez-déposez votre fichier ici
                </p>
                <p className="text-[#213f5b] opacity-75 text-sm">
                  ou cliquez pour sélectionner un fichier
                </p>
              </div>
            )}
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
              disabled={!selectedFile}
              className="bg-gradient-to-r from-[#213f5b] to-[#3978b5] hover:from-[#152a3d] hover:to-[#2d5e8e] text-white transition-all rounded-lg py-2.5 px-5 flex items-center shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              <span>Importer</span>
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
