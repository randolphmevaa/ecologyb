"use client";

import { useState, useEffect, ChangeEvent, FormEvent, JSX } from "react";
import { motion } from "framer-motion";
import {
  DevicePhoneMobileIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  PhoneArrowUpRightIcon,
  FingerPrintIcon,
  QrCodeIcon,
  XMarkIcon,
  // CheckIcon,
  // PencilIcon
} from "@heroicons/react/24/outline";

// Define interfaces for our data structures
interface Capabilities {
  sms: boolean;
  mms: boolean;
  voice: boolean;
  fax: boolean;
  international: boolean;
  shortcode: boolean;
}

interface SMSConfig {
  enabled: boolean;
  autoReply: boolean;
  templates: Array<unknown>; // We could define a template interface if needed
  forwardToEmail: boolean;
  emailDestination: string;
}

interface CallerID {
  display: string;
  fallback: string;
}

interface Blocking {
  enabled: boolean;
  blockedNumbers: Array<string>;
  spamFiltering: boolean;
  anonymousCallBlocking: boolean;
  whitelistedNumbers: Array<string>;
  customRules: Array<unknown>; // We could define a rule interface if needed
}

interface Stats {
  incomingCalls: number;
  outgoingCalls: number;
  missedCalls: number;
  callMinutes: number;
  smsSent: number;
  smsReceived: number;
  totalCommunications: number;
  usagePercentage: number;
}

interface Plan {
  name: string;
  monthlyCost: number;
  includedSMS: number;
  includedMinutes: number;
  smsUsed: number;
  minutesUsed: number;
  nextRenewal: string;
}

// Define a specific union type for all possible property values
type PhoneNumberPropertyValue = 
  | string 
  | number 
  | boolean 
  | string[]
  | Array<unknown>
  | Capabilities
  | SMSConfig
  | CallerID
  | Blocking
  | Stats
  | Plan
  | undefined;

export interface PhoneNumber {
  id: string;
  number: string;
  label: string;
  type: string;
  status: string;
  assignedTo: string;
  capabilities: Capabilities;
  smsConfig: SMSConfig;
  callerID: CallerID;
  blocking: Blocking;
  stats: Stats;
  plan: Plan;
  dateAcquired: string;
  tags: string[];
  [key: string]: PhoneNumberPropertyValue; // Use the specific union type instead of any
}

interface NumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  number: PhoneNumber | null;
  onSave: (number: PhoneNumber) => void;
}

interface NumberType {
  id: string;
  name: string;
  icon: JSX.Element;
}

export const NumberModal = ({ 
  isOpen, 
  onClose, 
  mode = "add", 
  number = null,
  onSave 
}: NumberModalProps) => {
  // Default initial state
  const initialFormData: PhoneNumber = {
    id: "",
    number: "",
    label: "",
    type: "mobile",
    status: "active",
    assignedTo: "",
    capabilities: {
      sms: false,
      mms: false,
      voice: true,
      fax: false,
      international: false,
      shortcode: false
    },
    smsConfig: {
      enabled: false,
      autoReply: false,
      templates: [],
      forwardToEmail: false,
      emailDestination: ""
    },
    callerID: {
      display: "",
      fallback: ""
    },
    blocking: {
      enabled: false,
      blockedNumbers: [],
      spamFiltering: true,
      anonymousCallBlocking: false,
      whitelistedNumbers: [],
      customRules: []
    },
    stats: {
      incomingCalls: 0,
      outgoingCalls: 0,
      missedCalls: 0,
      callMinutes: 0,
      smsSent: 0,
      smsReceived: 0,
      totalCommunications: 0,
      usagePercentage: 0
    },
    plan: {
      name: "Standard",
      monthlyCost: 19.99,
      includedSMS: 500,
      includedMinutes: 500,
      smsUsed: 0,
      minutesUsed: 0,
      nextRenewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    dateAcquired: new Date().toISOString().split('T')[0],
    tags: []
  };

  const [formData, setFormData] = useState<PhoneNumber>(initialFormData);

  useEffect(() => {
    if (mode === "edit" && number) {
      // Use structuredClone for deep copy, avoiding spread operator issues
      setFormData(structuredClone(number));
    } else if (mode === "add") {
      // Generate a unique ID for new numbers
      setFormData((prev: PhoneNumber) => {
        const newData = structuredClone(prev);
        newData.id = `num${Date.now()}`;
        return newData;
      });
    }
  }, [mode, number]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    // Create a safe copy of the form data
    const newFormData = structuredClone(formData);
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      
      switch (parent) {
        case "capabilities":
          if (type === "checkbox" && checked !== undefined) {
            newFormData.capabilities = {
              ...newFormData.capabilities,
              [child]: checked
            };
          } else {
            newFormData.capabilities = {
              ...newFormData.capabilities,
              [child]: value
            };
          }
          break;
        case "smsConfig":
          if (type === "checkbox" && checked !== undefined) {
            newFormData.smsConfig = {
              ...newFormData.smsConfig,
              [child]: checked
            };
          } else {
            newFormData.smsConfig = {
              ...newFormData.smsConfig,
              [child]: value
            };
          }
          break;
        case "callerID":
          newFormData.callerID = {
            ...newFormData.callerID,
            [child]: value
          };
          break;
        case "blocking":
          if (type === "checkbox" && checked !== undefined) {
            newFormData.blocking = {
              ...newFormData.blocking,
              [child]: checked
            };
          } else {
            newFormData.blocking = {
              ...newFormData.blocking,
              [child]: value
            };
          }
          break;
        case "stats":
          newFormData.stats = {
            ...newFormData.stats,
            [child]: typeof value === 'string' && /^\d+(\.\d+)?$/.test(value) ? parseFloat(value) : value
          };
          break;
        case "plan":
          newFormData.plan = {
            ...newFormData.plan,
            [child]: typeof value === 'string' && /^\d+(\.\d+)?$/.test(value) ? parseFloat(value) : value
          };
          break;
        default:
          console.warn(`Unhandled property parent: ${parent}`);
          break;
      }
    } else {
      // Handle direct properties
      if (type === "checkbox" && checked !== undefined) {
        newFormData[name as keyof PhoneNumber] = checked as PhoneNumberPropertyValue;
      } else {
        newFormData[name as keyof PhoneNumber] = value as PhoneNumberPropertyValue;
      }
    }
    
    setFormData(newFormData);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Create a safe copy of the form data without using spread
    const updatedFormData = structuredClone(formData);
    
    if (mode === "add") {
      updatedFormData.dateAcquired = new Date().toISOString().split('T')[0];
    }
    
    // Auto-set fallback number if empty
    if (!updatedFormData.callerID.fallback) {
      updatedFormData.callerID.fallback = updatedFormData.number;
    }
    
    onSave(updatedFormData);
  };

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
    const tagInput = e.target.value;
    // Split by comma and trim whitespace
    const tagArray = tagInput.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag !== '');
    
    // Update tags safely
    const newFormData = structuredClone(formData);
    newFormData.tags = tagArray;
    setFormData(newFormData);
  };

  // Number type options
  const numberTypes: NumberType[] = [
    { id: "mobile", name: "Mobile", icon: <DevicePhoneMobileIcon className="h-5 w-5" /> },
    { id: "landline", name: "Fixe", icon: <BuildingOfficeIcon className="h-5 w-5" /> },
    { id: "tollfree", name: "Numéro vert", icon: <PhoneArrowUpRightIcon className="h-5 w-5" /> },
    { id: "vanity", name: "Mémorable", icon: <FingerPrintIcon className="h-5 w-5" /> },
    { id: "international", name: "International", icon: <GlobeAltIcon className="h-5 w-5" /> },
    { id: "virtual", name: "Virtuel", icon: <QrCodeIcon className="h-5 w-5" /> }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {mode === "add" ? "Ajouter un numéro" : "Modifier le numéro"}
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
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Informations de base</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Numéro de téléphone
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={formData.number}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="+33XXXXXXXXX"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Libellé
                    </label>
                    <input
                      type="text"
                      name="label"
                      value={formData.label}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Ex: Service client"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Number Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type de numéro
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {numberTypes.map(type => (
                    <label
                      key={type.id}
                      className={`
                        flex items-center p-3 border rounded-lg cursor-pointer
                        ${formData.type === type.id 
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900 dark:border-indigo-400' 
                          : 'border-gray-300 dark:border-gray-600'}
                      `}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type.id}
                        checked={formData.type === type.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <div className="mr-3 text-gray-700 dark:text-gray-300">
                          {type.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {type.name}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Assignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assigné à (optionnel)
                </label>
                <input
                  type="text"
                  name="assignedTo"
                  value={formData.assignedTo || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ex: Service client"
                />
              </div>
              
              {/* Capabilities */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Fonctionnalités</h3>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="capabilities.voice"
                      checked={formData.capabilities.voice}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Voix</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="capabilities.sms"
                      checked={formData.capabilities.sms}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">SMS</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="capabilities.mms"
                      checked={formData.capabilities.mms}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">MMS</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="capabilities.fax"
                      checked={formData.capabilities.fax}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Fax</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="capabilities.international"
                      checked={formData.capabilities.international}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">International</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="capabilities.shortcode"
                      checked={formData.capabilities.shortcode}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Code court</span>
                  </label>
                </div>
              </div>
              
              {/* Caller ID */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Identification d&apos;appel</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nom affiché
                    </label>
                    <input
                      type="text"
                      name="callerID.display"
                      value={formData.callerID.display}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Ex: Votre Entreprise"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* SMS Configuration - Simple */}
              {formData.capabilities.sms && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Configuration SMS</h3>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="smsConfig.enabled"
                        checked={formData.smsConfig.enabled}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Activer les SMS</span>
                    </label>
                    
                    {formData.smsConfig.enabled && (
                      <>
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
                        
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            name="smsConfig.forwardToEmail"
                            checked={formData.smsConfig.forwardToEmail}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Transférer vers email</span>
                        </label>
                        
                        {formData.smsConfig.forwardToEmail && (
                          <div>
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
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Blocking - Simple */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Blocage</h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="blocking.enabled"
                      checked={formData.blocking.enabled}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Activer le blocage</span>
                  </label>
                  
                  {formData.blocking.enabled && (
                    <>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="blocking.spamFiltering"
                          checked={formData.blocking.spamFiltering}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Filtrage anti-spam</span>
                      </label>
                      
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="blocking.anonymousCallBlocking"
                          checked={formData.blocking.anonymousCallBlocking}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Bloquer les appels anonymes</span>
                      </label>
                    </>
                  )}
                </div>
              </div>
              
              {/* Plan */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Forfait</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nom du forfait
                    </label>
                    <select
                      name="plan.name"
                      value={formData.plan.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Standard">Standard (19,99€)</option>
                      <option value="Business Pro">Business Pro (29,99€)</option>
                      <option value="Business Standard">Business Standard (24,99€)</option>
                      <option value="Mobile Business Pro">Mobile Business Pro (34,99€)</option>
                      <option value="Numéro Vert Premium">Numéro Vert Premium (39,99€)</option>
                      <option value="International Business">International Business (59,99€)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tags (séparés par des virgules)
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={handleTagChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ex: service client, principal, marketing"
                />
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
            {mode === "add" ? "Ajouter" : "Enregistrer"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};