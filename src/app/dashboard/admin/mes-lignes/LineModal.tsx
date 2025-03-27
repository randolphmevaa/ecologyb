"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
// import { Button } from "@/components/ui/Button";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Define types
interface IPhoneLineStats {
  incoming: number;
  outgoing: number;
  missed: number;
  minutes: number;
  totalCalls: number;
  usagePercentage: number;
}

interface ICallForwarding {
  enabled: boolean;
  destination: string;
  conditions: "always" | "busy" | "no-answer" | "custom";
  timeout?: number; // seconds to wait before forwarding
  schedules?: {
    days: ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")[];
    startTime: string;
    endTime: string;
  }[];
}

interface IVoicemailConfig {
  enabled: boolean;
  greeting: "default" | "custom";
  transcription: boolean;
  emailNotification: boolean;
  pin?: string;
}

// Define step data interfaces
interface IGreetingStepData {
  message: string;
}

interface IMenuStepData {
  options: {
    key: string;
    action: string;
    destination?: string;
  }[];
}

interface IForwardStepData {
  destination: string;
}

interface IVoicemailStepData {
  greeting: string;
}

interface IEndStepData {
  message: string;
}

// Union type for step data
type StepData = 
  | IGreetingStepData
  | IMenuStepData
  | IForwardStepData
  | IVoicemailStepData
  | IEndStepData;

interface ICallFlow {
  enabled: boolean;
  steps: {
    type: "greeting" | "menu" | "forward" | "voicemail" | "end";
    data: StepData;
  }[];
}

// Define possible values for the index signature
type PhoneLinePropertyValue = 
  | string 
  | number 
  | boolean 
  | Date
  | undefined
  | IPhoneLineStats
  | ICallForwarding
  | IVoicemailConfig
  | ICallFlow
  | { [key: string]: boolean | string | number | undefined }
  | {
      plan: string;
      monthlyCost: number;
      minutesIncluded: number;
      minutesUsed: number;
      nextRenewal: string;
    };

interface IPhoneLine {
  id: string;
  number: string;
  extension?: string;
  label: string;
  type: "direct" | "extension" | "virtual" | "fax" | "conference";
  status: "active" | "inactive" | "forwarded" | "voicemail" | "dnd";
  assignedTo?: string;
  capabilities: {
    sms: boolean;
    voicemail: boolean;
    recording: boolean;
    conferencing: boolean;
    fax: boolean;
    international: boolean;
  };
  forwarding: ICallForwarding;
  voicemail: IVoicemailConfig;
  callFlow?: ICallFlow;
  stats: IPhoneLineStats;
  subscription: {
    plan: string;
    monthlyCost: number;
    minutesIncluded: number;
    minutesUsed: number;
    nextRenewal: string;
  };
  dateAdded: string;
  [key: string]: PhoneLinePropertyValue; // Index signature with more specific type
}

interface LineModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  line?: IPhoneLine | null;
  onSave: (line: IPhoneLine) => void;
}

export const LineModal = ({
  isOpen,
  onClose,
  mode,
  line,
  onSave,
}: LineModalProps) => {
  const isDarkMode = document.documentElement.classList.contains('dark-theme');
  
  // Default values for a new line
  const defaultLine: IPhoneLine = {
    id: `line_${Date.now()}`,
    number: "",
    extension: "",
    label: "",
    type: "direct",
    status: "active",
    capabilities: {
      sms: true,
      voicemail: true,
      recording: false,
      conferencing: false,
      fax: false,
      international: false,
    },
    forwarding: {
      enabled: false,
      destination: "",
      conditions: "always"
    },
    voicemail: {
      enabled: true,
      greeting: "default",
      transcription: true,
      emailNotification: true
    },
    stats: {
      incoming: 0,
      outgoing: 0,
      missed: 0,
      minutes: 0,
      totalCalls: 0,
      usagePercentage: 0
    },
    subscription: {
      plan: "Business Basic",
      monthlyCost: 14.99,
      minutesIncluded: 500,
      minutesUsed: 0,
      nextRenewal: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
    },
    dateAdded: new Date().toISOString()
  };
  
  // Fix the spread issue by properly initializing formData with a valid default
  const [formData, setFormData] = useState<IPhoneLine>(
    mode === "edit" && line ? structuredClone(line) : structuredClone(defaultLine)
  );
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      // Fix spread operator type issue by using structuredClone for deep copy
      setFormData(mode === "edit" && line ? structuredClone(line) : structuredClone(defaultLine));
      setErrors({});
    }
  }, [isOpen, mode, line]);
  
  // Handle input change
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  
  if (name.includes(".")) {
    // Handle nested properties
    const [parent, child] = name.split(".");
    setFormData(prev => {
      const newFormData = { ...prev };
      
      switch (parent) {
        case "capabilities":
          newFormData.capabilities = {
            ...newFormData.capabilities,
            [child]: value === "true" ? true : value === "false" ? false : value
          };
          break;
        case "forwarding":
          newFormData.forwarding = {
            ...newFormData.forwarding,
            [child]: value
          };
          break;
        case "voicemail":
          newFormData.voicemail = {
            ...newFormData.voicemail,
            [child]: value
          };
          break;
        case "subscription":
          newFormData.subscription = {
            ...newFormData.subscription,
            [child]: value
          };
          break;
        case "stats":
          newFormData.stats = {
            ...newFormData.stats,
            [child]: parseFloat(value) || 0
          };
          break;
        // Add more cases as needed for other nested objects
      }
      
      return newFormData;
    });
  } else {
    setFormData(prev => ({ ...prev, [name]: value }));
  }
};

// Handle checkbox change
const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, checked } = e.target;
  
  if (name.includes(".")) {
    // Handle nested properties
    const [parent, child] = name.split(".");
    setFormData(prev => {
      const newFormData = { ...prev };
      
      switch (parent) {
        case "capabilities":
          newFormData.capabilities = {
            ...newFormData.capabilities,
            [child]: checked
          };
          break;
        case "forwarding":
          newFormData.forwarding = {
            ...newFormData.forwarding,
            [child]: checked
          };
          break;
        case "voicemail":
          newFormData.voicemail = {
            ...newFormData.voicemail,
            [child]: checked
          };
          break;
        // Add more cases as needed for other nested objects
      }
      
      return newFormData;
    });
  } else {
    setFormData(prev => ({ ...prev, [name]: checked }));
  }
};
  
  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.number) {
      newErrors.number = "Le numéro de téléphone est requis";
    } else if (!/^\+\d{10,15}$/.test(formData.number)) {
      newErrors.number = "Format invalide. Exemple: +33123456789";
    }
    
    if (!formData.label) {
      newErrors.label = "Le libellé est requis";
    }
    
    if (formData.type === "extension" && !formData.extension) {
      newErrors.extension = "L'extension est requise pour ce type de ligne";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`${isDarkMode ? 'bg-[#1F2937]' : 'bg-white'} rounded-xl shadow-xl w-full max-w-lg overflow-hidden`}
      >
        <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-[#374151]' : 'border-[#E5E7EB]'}`}>
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
            {mode === "add" ? "Ajouter une ligne" : "Modifier la ligne"}
          </h2>
          <button
            onClick={onClose}
            className={`${isDarkMode ? 'text-[#9CA3AF] hover:text-[#F9FAFB]' : 'text-[#6B7280] hover:text-[#111827]'} rounded-full p-1`}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Basic Information */}
            <div>
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'} mb-3`}>Informations de base</h3>
              
              <div className="space-y-3">
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-1`}>
                    Libellé <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-lg ${
                      isDarkMode 
                        ? 'bg-[#111827] border-[#374151] text-[#F9FAFB] focus:ring-[#4F46E5] focus:border-[#4F46E5]' 
                        : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] focus:ring-[#4F46E5] focus:border-[#4F46E5]'
                    } border ${errors.label ? 'border-red-500' : ''}`}
                    placeholder="Ex: Support technique"
                  />
                  {errors.label && (
                    <p className="text-red-500 text-xs mt-1">{errors.label}</p>
                  )}
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-1`}>
                    Numéro de téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-lg ${
                      isDarkMode 
                        ? 'bg-[#111827] border-[#374151] text-[#F9FAFB] focus:ring-[#4F46E5] focus:border-[#4F46E5]' 
                        : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] focus:ring-[#4F46E5] focus:border-[#4F46E5]'
                    } border ${errors.number ? 'border-red-500' : ''}`}
                    placeholder="+33123456789"
                  />
                  {errors.number ? (
                    <p className="text-red-500 text-xs mt-1">{errors.number}</p>
                  ) : (
                    <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mt-1`}>
                      Format international avec préfixe pays (+33)
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-1`}>
                      Type de ligne
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg ${
                        isDarkMode 
                          ? 'bg-[#111827] border-[#374151] text-[#F9FAFB] focus:ring-[#4F46E5] focus:border-[#4F46E5]' 
                          : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] focus:ring-[#4F46E5] focus:border-[#4F46E5]'
                      } border`}
                    >
                      <option value="direct">Ligne directe</option>
                      <option value="extension">Extension</option>
                      <option value="virtual">Ligne virtuelle</option>
                      <option value="fax">Fax</option>
                      <option value="conference">Conférence</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-1`}>
                      Extension {formData.type === "extension" && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      name="extension"
                      value={formData.extension || ""}
                      onChange={handleChange}
                      disabled={formData.type === "fax" || formData.type === "conference"}
                      className={`w-full px-3 py-2 rounded-lg ${
                        isDarkMode 
                          ? 'bg-[#111827] border-[#374151] text-[#F9FAFB] focus:ring-[#4F46E5] focus:border-[#4F46E5] disabled:bg-[#374151] disabled:text-[#6B7280]' 
                          : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] focus:ring-[#4F46E5] focus:border-[#4F46E5] disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]'
                      } border ${errors.extension ? 'border-red-500' : ''}`}
                      placeholder="Ex: 101"
                    />
                    {errors.extension && (
                      <p className="text-red-500 text-xs mt-1">{errors.extension}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-1`}>
                    Assigné à
                  </label>
                  <input
                    type="text"
                    name="assignedTo"
                    value={formData.assignedTo || ""}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-lg ${
                      isDarkMode 
                        ? 'bg-[#111827] border-[#374151] text-[#F9FAFB] focus:ring-[#4F46E5] focus:border-[#4F46E5]' 
                        : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] focus:ring-[#4F46E5] focus:border-[#4F46E5]'
                    } border`}
                    placeholder="Ex: Sophie Martin"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-1`}>
                    Statut
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-lg ${
                      isDarkMode 
                        ? 'bg-[#111827] border-[#374151] text-[#F9FAFB] focus:ring-[#4F46E5] focus:border-[#4F46E5]' 
                        : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] focus:ring-[#4F46E5] focus:border-[#4F46E5]'
                    } border`}
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="forwarded">Transfert</option>
                    <option value="voicemail">Messagerie</option>
                    <option value="dnd">Ne pas déranger</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Capabilities */}
            <div>
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'} mb-3`}>Fonctionnalités</h3>
              
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F9FAFB]'}`}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sms"
                      name="capabilities.sms"
                      checked={formData.capabilities.sms}
                      onChange={handleCheckboxChange}
                      disabled={formData.type === "fax" || formData.type === "conference"}
                      className={`rounded ${
                        isDarkMode 
                          ? 'border-[#374151] text-[#4F46E5] focus:ring-[#4F46E5] disabled:bg-[#374151]' 
                          : 'border-[#E5E7EB] text-[#4F46E5] focus:ring-[#4F46E5] disabled:bg-[#F3F4F6]'
                      } mr-2`}
                    />
                    <label htmlFor="sms" className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                      SMS
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="voicemail"
                      name="capabilities.voicemail"
                      checked={formData.capabilities.voicemail}
                      onChange={handleCheckboxChange}
                      className={`rounded ${
                        isDarkMode 
                          ? 'border-[#374151] text-[#4F46E5] focus:ring-[#4F46E5]' 
                          : 'border-[#E5E7EB] text-[#4F46E5] focus:ring-[#4F46E5]'
                      } mr-2`}
                    />
                    <label htmlFor="voicemail" className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                      Messagerie vocale
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="recording"
                      name="capabilities.recording"
                      checked={formData.capabilities.recording}
                      onChange={handleCheckboxChange}
                      className={`rounded ${
                        isDarkMode 
                          ? 'border-[#374151] text-[#4F46E5] focus:ring-[#4F46E5]' 
                          : 'border-[#E5E7EB] text-[#4F46E5] focus:ring-[#4F46E5]'
                      } mr-2`}
                    />
                    <label htmlFor="recording" className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                      Enregistrement
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="conferencing"
                      name="capabilities.conferencing"
                      checked={formData.capabilities.conferencing}
                      onChange={handleCheckboxChange}
                      className={`rounded ${
                        isDarkMode 
                          ? 'border-[#374151] text-[#4F46E5] focus:ring-[#4F46E5]' 
                          : 'border-[#E5E7EB] text-[#4F46E5] focus:ring-[#4F46E5]'
                      } mr-2`}
                    />
                    <label htmlFor="conferencing" className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                      Conférence
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="fax"
                      name="capabilities.fax"
                      checked={formData.capabilities.fax}
                      onChange={handleCheckboxChange}
                      className={`rounded ${
                        isDarkMode 
                          ? 'border-[#374151] text-[#4F46E5] focus:ring-[#4F46E5]' 
                          : 'border-[#E5E7EB] text-[#4F46E5] focus:ring-[#4F46E5]'
                      } mr-2`}
                    />
                    <label htmlFor="fax" className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                      Fax
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="international"
                      name="capabilities.international"
                      checked={formData.capabilities.international}
                      onChange={handleCheckboxChange}
                      className={`rounded ${
                        isDarkMode 
                          ? 'border-[#374151] text-[#4F46E5] focus:ring-[#4F46E5]' 
                          : 'border-[#E5E7EB] text-[#4F46E5] focus:ring-[#4F46E5]'
                      } mr-2`}
                    />
                    <label htmlFor="international" className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                      International
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Subscription Info */}
            <div>
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'} mb-3`}>Abonnement</h3>
              
              <div className="space-y-3">
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-1`}>
                    Forfait
                  </label>
                  <select
                    name="subscription.plan"
                    value={formData.subscription.plan}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-lg ${
                      isDarkMode 
                        ? 'bg-[#111827] border-[#374151] text-[#F9FAFB] focus:ring-[#4F46E5] focus:border-[#4F46E5]' 
                        : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] focus:ring-[#4F46E5] focus:border-[#4F46E5]'
                    } border`}
                  >
                    <option value="Business Basic">Business Basic (14,99€)</option>
                    <option value="Business Standard">Business Standard (19,99€)</option>
                    <option value="Business Pro">Business Pro (24,99€)</option>
                    <option value="Fax Service">Fax Service (9,99€)</option>
                    <option value="Conference Pro">Conference Pro (29,99€)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-[#374151] text-[#F9FAFB] hover:bg-[#4B5563]' 
                  : 'bg-[#F3F4F6] text-[#111827] hover:bg-[#E5E7EB]'
              }`}
            >
              Annuler
            </button>
            
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white`}
            >
              {mode === "add" ? "Ajouter" : "Enregistrer"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
