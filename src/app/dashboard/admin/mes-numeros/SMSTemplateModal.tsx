"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";

// Define interfaces for our data structures
interface SMSTemplate {
  id: string;
  name: string;
  content: string;
  usageCount: number;
}

interface SMSConfig {
  enabled: boolean;
  autoReply: boolean;
  templates: SMSTemplate[];
  forwardToEmail: boolean;
  emailDestination: string;
}

// Define a more specific type instead of using 'any'
export interface NumberData {
  smsConfig: SMSConfig;
  [key: string]: SMSConfig | string | number | boolean | object | undefined; // Allow for other typed properties
}

// Define component props
interface SMSTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  number: NumberData | null;
  onSave: (data: NumberData) => void;
}

export const SMSTemplateModal = ({ 
  isOpen, 
  onClose, 
  number = null,
  onSave 
}: SMSTemplateModalProps) => {
  const [formData, setFormData] = useState<NumberData>({
    smsConfig: {
      enabled: true,
      autoReply: false,
      templates: [],
      forwardToEmail: false,
      emailDestination: ""
    }
  });

  const [editingTemplate, setEditingTemplate] = useState<SMSTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState<SMSTemplate>({
    id: "",
    name: "",
    content: "",
    usageCount: 0
  });

  useEffect(() => {
    if (number) {
      setFormData({
        ...number
      });
    }
  }, [number]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    if (type === "checkbox" && checked !== undefined) {
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        const parentKey = parent as keyof NumberData;
        const parentValue = formData[parentKey];
        
        // Ensure parentValue is an object before spreading
        if (parentValue && typeof parentValue === 'object' && !Array.isArray(parentValue)) {
          setFormData({
            ...formData,
            [parent]: {
              ...parentValue,
              [child]: checked
            }
          });
        }
      } else {
        setFormData({
          ...formData,
          [name]: checked
        });
      }
    } else {
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        const parentKey = parent as keyof NumberData;
        const parentValue = formData[parentKey];
        
        // Ensure parentValue is an object before spreading
        if (parentValue && typeof parentValue === 'object' && !Array.isArray(parentValue)) {
          setFormData({
            ...formData,
            [parent]: {
              ...parentValue,
              [child]: value
            }
          });
        }
      } else {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    }
  };

  const handleNewTemplateChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTemplate({
      ...newTemplate,
      [name]: value
    });
  };

  const handleEditTemplateChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingTemplate) {
      setEditingTemplate({
        ...editingTemplate,
        [name]: value
      });
    }
  };

  const addTemplate = () => {
    if (newTemplate.name.trim() === "" || newTemplate.content.trim() === "") {
      return;
    }
    
    const updatedTemplates = [
      ...formData.smsConfig.templates,
      {
        ...newTemplate,
        id: `template-${Date.now()}`,
        usageCount: 0
      }
    ];
    
    setFormData({
      ...formData,
      smsConfig: {
        ...formData.smsConfig,
        templates: updatedTemplates
      }
    });
    
    // Reset form
    setNewTemplate({
      id: "",
      name: "",
      content: "",
      usageCount: 0
    });
  };

  const editTemplate = (template: SMSTemplate) => {
    setEditingTemplate({...template});
  };

  const saveEditedTemplate = () => {
    if (!editingTemplate || editingTemplate.name.trim() === "" || editingTemplate.content.trim() === "") {
      return;
    }
    
    const updatedTemplates = formData.smsConfig.templates.map(template => 
      template.id === editingTemplate.id ? editingTemplate : template
    );
    
    setFormData({
      ...formData,
      smsConfig: {
        ...formData.smsConfig,
        templates: updatedTemplates
      }
    });
    
    setEditingTemplate(null);
  };

  const deleteTemplate = (templateId: string) => {
    const updatedTemplates = formData.smsConfig.templates.filter(template => 
      template.id !== templateId
    );
    
    setFormData({
      ...formData,
      smsConfig: {
        ...formData.smsConfig,
        templates: updatedTemplates
      }
    });
    
    // If deleting the currently edited template, close the editor
    if (editingTemplate && editingTemplate.id === templateId) {
      setEditingTemplate(null);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const calculateSmsLength = (text: string) => {
    // Simple SMS length calculation 
    // (actual SMS length depends on character encoding and special characters)
    const length = text.length;
    const maxStandardLength = 160;
    
    if (length <= maxStandardLength) {
      return `${length}/${maxStandardLength} (1 SMS)`;
    } else {
      const smsCount = Math.ceil(length / 153); // 153 characters for concatenated SMS
      return `${length}/${maxStandardLength} (${smsCount} SMS)`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2 text-indigo-600" />
            Configuration SMS
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 flex-1">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* SMS Configuration */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Paramètres SMS</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="smsConfig.enabled"
                      checked={formData.smsConfig.enabled}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Activer les SMS pour ce numéro</span>
                  </label>
                </div>
                
                {formData.smsConfig.enabled && (
                  <>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            name="smsConfig.autoReply"
                            checked={formData.smsConfig.autoReply}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Activer la réponse automatique</span>
                        </label>
                        
                        {formData.smsConfig.autoReply && formData.smsConfig.templates.length === 0 && (
                          <div className="mt-2 text-sm text-amber-600 dark:text-amber-400 flex items-center">
                            <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                            Ajoutez au moins un modèle pour la réponse automatique
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            name="smsConfig.forwardToEmail"
                            checked={formData.smsConfig.forwardToEmail}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Transférer les SMS vers un email</span>
                        </label>
                        
                        {formData.smsConfig.forwardToEmail && (
                          <div className="mt-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Email de destination
                            </label>
                            <input
                              type="email"
                              name="smsConfig.emailDestination"
                              value={formData.smsConfig.emailDestination}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                              placeholder="email@exemple.com"
                              required={formData.smsConfig.forwardToEmail}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* SMS Templates */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Modèles SMS</h3>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formData.smsConfig.templates.length} modèle(s)
                        </span>
                      </div>
                      
                      {/* Template List */}
                      <div className="space-y-3 mb-4">
                        {formData.smsConfig.templates.map(template => (
                          <div 
                            key={template.id}
                            className={`p-3 border ${
                              editingTemplate && editingTemplate.id === template.id
                                ? 'border-indigo-500 dark:border-indigo-400'
                                : 'border-gray-300 dark:border-gray-600'
                            } rounded-lg`}
                          >
                            {editingTemplate && editingTemplate.id === template.id ? (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Nom du modèle
                                  </label>
                                  <input
                                    type="text"
                                    name="name"
                                    value={editingTemplate.name}
                                    onChange={handleEditTemplateChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Nom du modèle"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Contenu du SMS
                                  </label>
                                  <textarea
                                    name="content"
                                    value={editingTemplate.content}
                                    onChange={handleEditTemplateChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Contenu du SMS"
                                  ></textarea>
                                  <div className="flex justify-between mt-1">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {calculateSmsLength(editingTemplate.content)}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      Utilisé {editingTemplate.usageCount} fois
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex justify-end space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => setEditingTemplate(null)}
                                    className="px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                  >
                                    Annuler
                                  </button>
                                  <button
                                    type="button"
                                    onClick={saveEditedTemplate}
                                    className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                                  >
                                    <CheckIcon className="h-3 w-3 inline mr-1" />
                                    Enregistrer
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-medium text-gray-900 dark:text-white">
                                    {template.name}
                                  </h4>
                                  <div className="flex space-x-1">
                                    <button
                                      type="button"
                                      onClick={() => editTemplate(template)}
                                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                      <PencilIcon className="h-4 w-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => deleteTemplate(template.id)}
                                      className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                  {template.content}
                                </p>
                                <div className="flex justify-between mt-2">
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {calculateSmsLength(template.content)}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Utilisé {template.usageCount} fois
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                        
                        {formData.smsConfig.templates.length === 0 && (
                          <div className="p-6 text-center border border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                            <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 dark:text-gray-400">
                              Aucun modèle SMS. Ajoutez votre premier modèle.
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Add New Template Form */}
                      {!editingTemplate && (
                        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                            Ajouter un nouveau modèle
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nom du modèle
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={newTemplate.name}
                                onChange={handleNewTemplateChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Ex: Réponse automatique"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Contenu du SMS
                              </label>
                              <textarea
                                name="content"
                                value={newTemplate.content}
                                onChange={handleNewTemplateChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Merci de nous avoir contacté. Nous vous répondrons dans les plus brefs délais."
                              ></textarea>
                              {newTemplate.content && (
                                <div className="text-right mt-1">
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {calculateSmsLength(newTemplate.content)}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="text-right">
                              <button
                                type="button"
                                onClick={addTemplate}
                                disabled={!newTemplate.name || !newTemplate.content}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                                  !newTemplate.name || !newTemplate.content
                                    ? 'bg-indigo-400 cursor-not-allowed' 
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                              >
                                <PlusIcon className="h-4 w-4 inline mr-1" />
                                Ajouter le modèle
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
        
        <div className="flex justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Enregistrer les modifications
          </button>
        </div>
      </motion.div>
    </div>
  );
};