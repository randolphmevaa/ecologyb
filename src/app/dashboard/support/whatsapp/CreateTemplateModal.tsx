"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { ITemplate } from "./page";

// Define the type for template categories
type TemplateCategory = 'utility' | 'marketing' | 'customer_service';

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateCreated: (template: ITemplate) => void;
}

export function CreateTemplateModal({
  isOpen,
  onClose,
  onTemplateCreated,
}: CreateTemplateModalProps) {
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<TemplateCategory>("utility");
  const [language, setLanguage] = useState<string>("fr");
  const [content, setContent] = useState<string>("");
  const [variables, setVariables] = useState<string[]>([""]);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<boolean>(false);

  // Add a new variable field
  const handleAddVariable = () => {
    setVariables([...variables, ""]);
  };

  // Remove a variable field
  const handleRemoveVariable = (index: number) => {
    if (variables.length > 1) {
      const updatedVariables = [...variables];
      updatedVariables.splice(index, 1);
      setVariables(updatedVariables);
    }
  };

  // Update a variable value
  const handleVariableChange = (index: number, value: string) => {
    const updatedVariables = [...variables];
    updatedVariables[index] = value;
    setVariables(updatedVariables);
  };

  // Insert a variable into the content
  const insertVariable = (index: number) => {
    const variablePlaceholder = `{{${index + 1}}}`;
    setContent(prev => prev + variablePlaceholder);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!name.trim()) {
      setError("Le nom du template est requis");
      return;
    }
    
    if (!content.trim()) {
      setError("Le contenu du message est requis");
      return;
    }

    // Filter out empty variables
    const filteredVariables = variables.filter(v => v.trim() !== "");
    
    // Create new template object
    const newTemplate: ITemplate = {
      _id: `template_${Date.now()}`,
      name: name.trim(),
      content: content.trim(),
      variables: filteredVariables,
      category: category,
      status: "pending",
      language
    };
    
    // Call the onTemplateCreated callback with the new template
    onTemplateCreated(newTemplate);
    
    // Close the modal
    onClose();
  };

  // Preview message with variables replaced
  const getPreviewContent = () => {
    let previewContent = content;
    variables.forEach((variable, index) => {
      if (variable.trim()) {
        previewContent = previewContent.replace(
          new RegExp(`{{${index + 1}}}`, 'g'), 
          `<span class="bg-[#bfddf9] px-1 rounded text-[#213f5b]">${variable}</span>`
        );
      }
    });
    return previewContent;
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
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative p-6 border-b border-[#f0f0f0]">
              <h2 className="text-xl font-bold text-[#213f5b]">Créer un template de message</h2>
              <p className="text-sm text-[#213f5b] opacity-75 mt-1">
                Les templates doivent être approuvés par WhatsApp avant utilisation
              </p>
              <button 
                className="absolute top-6 right-6 text-[#213f5b] hover:text-[#152a3d] rounded-full p-1"
                onClick={onClose}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Template Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#213f5b] mb-1">
                    Nom du template <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9]"
                    placeholder="ex: Bienvenue client"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#213f5b] mb-1">
                    Catégorie
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TemplateCategory)}
                    className="w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9]"
                  >
                    <option value="utility">Utilitaire</option>
                    <option value="marketing">Marketing</option>
                    <option value="customer_service">Service client</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#213f5b] mb-1">
                  Langue
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9]"
                >
                  <option value="fr">Français</option>
                  <option value="en">Anglais</option>
                  <option value="es">Espagnol</option>
                  <option value="de">Allemand</option>
                  <option value="it">Italien</option>
                </select>
              </div>
              
              {/* Template Content */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-[#213f5b]">
                    Contenu du message <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setPreview(!preview)}
                      className="text-xs flex items-center text-[#213f5b] hover:text-[#152a3d] px-2 py-1 rounded-lg hover:bg-[#f0f0f0]"
                    >
                      {preview ? (
                        <>
                          <DocumentTextIcon className="h-3 w-3 mr-1" />
                          Mode édition
                        </>
                      ) : (
                        <>
                          <CheckIcon className="h-3 w-3 mr-1" />
                          Prévisualiser
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {!preview ? (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9] h-32"
                    placeholder={"Bonjour {{1}}, merci pour votre commande #{{2}}. Votre livraison est prévue le {{3}}."}
                  />
                ) : (
                  <div 
                    className="w-full rounded-lg border border-[#eaeaea] bg-[#f8fafc] p-4 h-32 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
                  />
                )}
                
                <p className="text-xs text-[#213f5b] opacity-75 mt-1 flex items-start gap-1">
                  <InformationCircleIcon className="h-4 w-4 flex-shrink-0" />
                  <span>{"Utilisez {{1}}, {{2}}, etc. pour les variables. WhatsApp n'autorise que du texte simple."}</span>
                </p>
              </div>
              
              {/* Template Variables */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#213f5b] mb-2">
                  Variables
                </label>
                
                <div className="space-y-3">
                  {variables.map((variable, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-[#bfddf9] bg-opacity-20 flex items-center justify-center text-[#213f5b] font-medium">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        value={variable}
                        onChange={(e) => handleVariableChange(index, e.target.value)}
                        className="flex-1 rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9]"
                        placeholder={`Variable ${index + 1} (ex: nom_client)`}
                      />
                      <Button
                        variant="ghost"
                        onClick={() => insertVariable(index)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-[#213f5b] hover:bg-[#f0f0f0]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Button>
                      {variables.length > 1 && (
                        <Button
                          variant="ghost"
                          onClick={() => handleRemoveVariable(index)}
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-[#213f5b] hover:bg-[#f0f0f0] hover:text-red-500"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  onClick={handleAddVariable}
                  className="mt-3 text-xs border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] hover:bg-opacity-10"
                >
                  <PlusIcon className="h-3 w-3 mr-1" />
                  Ajouter une variable
                </Button>
              </div>
              
              {/* WhatsApp Policy Information */}
              <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#eaeaea] mb-6">
                <h4 className="text-sm font-medium text-[#213f5b] mb-2 flex items-center gap-1.5">
                  <InformationCircleIcon className="h-4 w-4 text-[#213f5b]" />
                  Règles d&apos;approbation WhatsApp
                </h4>
                <ul className="text-xs text-[#213f5b] opacity-75 space-y-1.5 pl-6 list-disc">
                  <li>Les templates ne doivent pas contenir de contenu promotionnel ou marketing excessif</li>
                  <li>Évitez le langage agressif, les émojis excessifs et les majuscules</li>
                  <li>N&apos;incluez pas d&apos;informations personnelles sensibles</li>
                  <li>Respectez les politiques de WhatsApp concernant le contenu</li>
                  <li>Le processus d&apos;approbation peut prendre jusqu&apos;à 24 heures</li>
                </ul>
              </div>
              
              {error && (
                <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2">
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
                className="bg-[#213f5b] hover:bg-[#152a3d] text-white"
              >
                Créer le template
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}