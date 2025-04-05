import React, { useState } from 'react';
import { motion } from "framer-motion";
import {
  XMarkIcon,
  FolderPlusIcon,
  DocumentIcon,
  PlusIcon,
  TrashIcon
} from "@heroicons/react/24/outline";

// Define TypeScript interfaces
interface Document {
  id: string;
  name: string;
  size: string;
  tag: string;
  date: string;
}

interface AddDocumentModalProps {
  onClose: () => void;
  onSave: (documents: Document[]) => void;
}

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({ onClose, onSave }) => {
  const [selectedFiles, setSelectedFiles] = useState<Document[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("");
  
  // Document tags options
  const tagOptions = [
    "Cadre de contribution", 
    "Attestation sur l'honneur", 
    "Facture", 
    "Devis"
  ];

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Convert FileList to an array of Document objects
    const newFiles: Document[] = Array.from(files).map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: formatFileSize(file.size),
      tag: selectedTag,
      date: new Date().toLocaleDateString('fr-FR')
    }));
    
    setSelectedFiles(prev => [...prev, ...newFiles]);
    
    // Reset the input
    e.target.value = '';
  };
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Handle tag selection for a specific file
  const handleTagChange = (fileId: string, tag: string) => {
    setSelectedFiles(files => 
      files.map(file => 
        file.id === fileId ? { ...file, tag } : file
      )
    );
  };
  
  // Remove a file from the list
  const handleRemoveFile = (fileId: string) => {
    setSelectedFiles(files => files.filter(file => file.id !== fileId));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that at least one file is selected
    if (selectedFiles.length === 0) {
      alert("Veuillez sélectionner au moins un document");
      return;
    }
    
    onSave(selectedFiles);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-white rounded-xl w-full max-w-3xl m-4 overflow-hidden shadow-2xl"
      >
        {/* Modal header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -mr-10 -mt-10 opacity-20" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <FolderPlusIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Ajouter un document au devis
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Modal body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="documents" className="block text-lg font-semibold text-gray-800 mb-3">
                Vous pouvez séléctionnez un ou plusieurs document(s) pour le devis*
              </label>
              
              {/* File selection button */}
              <div className="flex items-center gap-2 mb-4">
                <label className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200">
                  <PlusIcon className="h-5 w-5" />
                  <span>Sélectionner un fichier</span>
                  <input
                    type="file"
                    id="documents"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                
                {/* Tag dropdown */}
                <div className="relative flex-grow">
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
                  >
                    <option value="">Vous pouvez sélectionner un tag</option>
                    {tagOptions.map((tag, index) => (
                      <option key={index} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Selected files list */}
              {selectedFiles.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Document
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Taille
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tag
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedFiles.map((file) => (
                        <tr key={file.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <DocumentIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900 truncate max-w-[200px]">{file.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {file.size}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={file.tag}
                              onChange={(e) => handleTagChange(file.id, e.target.value)}
                              className="border border-gray-300 rounded-md text-sm p-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            >
                              <option value="">Sélectionner un tag</option>
                              {tagOptions.map((tag, index) => (
                                <option key={index} value={tag}>{tag}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {file.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(file.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {selectedFiles.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <DocumentIcon className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-500">Aucun document sélectionné</p>
                  <p className="text-sm text-gray-400 mt-1">Cliquez sur le bouton ci-dessus pour ajouter des documents</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 transition hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg transition hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddDocumentModal;