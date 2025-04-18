"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  XMarkIcon,
  DocumentDuplicateIcon,
  PlusIcon,
  // ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  TrashIcon,
  ExclamationCircleIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

// Define the EmailTemplate interface
interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  category: string;
  isSystem: boolean;
  lastUsed: string | null;
}

interface CreateEmailTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateCreated: (template: EmailTemplate) => void;
}

export const CreateEmailTemplateModal: React.FC<CreateEmailTemplateModalProps> = ({
  isOpen,
  onClose,
  onTemplateCreated,
}) => {
  const [name, setName] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [category, setCategory] = useState<string>("general");
  const [variables, setVariables] = useState<string[]>([]);
  const [newVariable, setNewVariable] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showVariableAdd, setShowVariableAdd] = useState<boolean>(false);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate template
    if (!name.trim()) {
      setError("Le nom du template est requis");
      return;
    }
    
    if (!subject.trim()) {
      setError("L'objet du template est requis");
      return;
    }
    
    if (!body.trim()) {
      setError("Le contenu du template est requis");
      return;
    }
    
    setError(null);
    
    // Create the new template object
    const newTemplate: EmailTemplate = {
      _id: `template_${Date.now()}`,
      name,
      subject,
      body: `<p>${body.replace(/\n/g, '</p><p>')}</p>`,
      variables,
      category,
      isSystem: false,
      lastUsed: null
    };
    
    // Call the onTemplateCreated callback
    onTemplateCreated(newTemplate);
    
    // Reset states
    setName("");
    setSubject("");
    setBody("");
    setCategory("general");
    setVariables([]);
    setNewVariable("");
    
    // Close the modal
    onClose();
  };

  // Handle adding a new variable
  const handleAddVariable = () => {
    if (!newVariable.trim()) return;
    
    if (variables.includes(newVariable)) {
      setError("Cette variable existe déjà");
      return;
    }
    
    setVariables([...variables, newVariable]);
    setNewVariable("");
    setError(null);
    setShowVariableAdd(false);
  };

  // Handle removing a variable
  const handleRemoveVariable = (variable: string) => {
    setVariables(variables.filter(v => v !== variable));
  };

  // Insert a variable placeholder into the body
  const insertVariable = (variable: string) => {
    setBody(prev => prev + ` {{${variable}}}`);
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-xl overflow-hidden relative"
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
            <DocumentDuplicateIcon className="h-6 w-6 text-[#213f5b]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#213f5b]">Créer un template d&apos;email</h2>
            <p className="text-sm text-[#213f5b] opacity-75">
              Créez des templates réutilisables pour vos emails
            </p>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {/* Template Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#213f5b] mb-1">
                Nom du template <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Réponse client, Confirmation, etc."
                className="px-4 py-2.5 w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9]"
                required
              />
            </div>
            
            {/* Template Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-[#213f5b] mb-1">
                Catégorie
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2.5 w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9]"
              >
                <option value="general">Général</option>
                <option value="sales">Commercial</option>
                <option value="marketing">Marketing</option>
                <option value="support">Support</option>
              </select>
            </div>
            
            {/* Subject Line */}
            <div className="md:col-span-2">
              <label htmlFor="subject" className="block text-sm font-medium text-[#213f5b] mb-1">
                Objet de l&apos;email <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Re: {{sujet}}"
                className="px-4 py-2.5 w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9]"
                required
              />
            </div>
            
            {/* Template Body */}
            <div className="md:col-span-2">
              <label htmlFor="body" className="block text-sm font-medium text-[#213f5b] mb-1">
                Contenu du template <span className="text-red-500">*</span>
              </label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Bonjour {{nom_client}},&#10;&#10;Merci de nous avoir contacté. Votre demande a bien été prise en compte.&#10;&#10;{{message_personnalisé}}&#10;&#10;N'hésitez pas à me contacter pour toute information complémentaire."
                className="px-4 py-2.5 w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9]"
                rows={8}
                required
              />
              <p className="text-xs text-[#213f5b] mt-1 opacity-75">
                Utilisez {'{{'}{"}"}nom_variable{'}}'} pour insérer des variables
              </p>
            </div>
            
            {/* Variables */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-[#213f5b]">
                  Variables
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowVariableAdd(!showVariableAdd)}
                  className="text-[#213f5b] text-xs hover:bg-[#f0f0f0] transition-colors p-1 rounded-lg flex items-center"
                >
                  {showVariableAdd ? (
                    <>
                      <ChevronUpIcon className="h-3 w-3 mr-1" />
                      <span>Masquer</span>
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-3 w-3 mr-1" />
                      <span>Ajouter</span>
                    </>
                  )}
                </Button>
              </div>
              
              {/* Add Variable Section */}
              {showVariableAdd && (
                <div className="bg-[#f8fafc] rounded-lg p-4 border border-[#eaeaea] mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newVariable}
                      onChange={(e) => setNewVariable(e.target.value)}
                      placeholder="Nom de la variable (sans espaces)"
                      className="px-4 py-2 w-full rounded-lg border-[#eaeaea] focus:border-[#bfddf9] focus:ring-1 focus:ring-[#bfddf9] text-sm"
                    />
                    <Button
                      type="button"
                      onClick={handleAddVariable}
                      className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg py-2 px-3 flex items-center shadow-md hover:shadow-lg"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-[#213f5b] mt-2 opacity-75">
                    Ex: nom_client, date_livraison, montant, etc.
                  </p>
                </div>
              )}
              
              {/* Variables List */}
              <div className="flex flex-wrap gap-2">
                {variables.length === 0 ? (
                  <p className="text-sm text-[#213f5b] opacity-75">
                    Aucune variable définie
                  </p>
                ) : (
                  variables.map((variable) => (
                    <div
                      key={variable}
                      className="flex items-center bg-[#f0f7ff] text-[#213f5b] text-sm rounded-lg px-3 py-1.5 border border-[#bfddf9]"
                    >
                      <span>{variable}</span>
                      <div className="flex items-center ml-2 gap-1">
                        <button
                          type="button"
                          onClick={() => insertVariable(variable)}
                          className="p-1 rounded hover:bg-[#bfddf9] transition-colors"
                          title="Insérer dans le contenu"
                        >
                          <PencilIcon className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariable(variable)}
                          className="p-1 rounded hover:bg-[#bfddf9] transition-colors"
                          title="Supprimer la variable"
                        >
                          <TrashIcon className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
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
          <div className="flex items-center justify-between pt-2 border-t border-[#eaeaea]">
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
              <span>Créer le template</span>
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
