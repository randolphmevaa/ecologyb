"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  XMarkIcon,
  ArrowsRightLeftIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

// Define interfaces for our data structures
interface PortingStatus {
  status: "pending" | "in_progress" | "completed" | "cancelled";
  requestDate: string;
  estimatedCompletionDate: string;
  previousProvider: string;
  notes: string;
}

export interface NumberData {
  number?: string;
  label?: string;
  status?: string;
  portingStatus?: PortingStatus;
  [key: string]: string | number | boolean | PortingStatus | undefined; // More specific union type
}

// Define component props
interface PortingModalProps {
  isOpen: boolean;
  onClose: () => void;
  number: NumberData | null;
  onSave: (data: NumberData) => void;
}

export const PortingModal = ({ 
  isOpen, 
  onClose, 
  number = null,
  onSave 
}: PortingModalProps) => {
  const [formData, setFormData] = useState<NumberData>({
    portingStatus: {
      status: "pending",
      requestDate: new Date().toISOString().split('T')[0],
      estimatedCompletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      previousProvider: "",
      notes: ""
    }
  });

  const [activeStep, setActiveStep] = useState<number>(1);

  useEffect(() => {
    if (number) {
      if (number.portingStatus) {
        setFormData({
          ...number,
          portingStatus: {
            ...number.portingStatus,
            // If editing existing porting, don't change status and dates
            status: number.portingStatus.status,
            requestDate: number.portingStatus.requestDate,
            estimatedCompletionDate: number.portingStatus.estimatedCompletionDate || formData.portingStatus!.estimatedCompletionDate
          }
        });
      } else {
        setFormData({
          ...number,
          portingStatus: {
            ...formData.portingStatus!,
          }
        });
      }
    }
  }, [number]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes("portingStatus.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        portingStatus: {
          ...formData.portingStatus!,
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Update the status based on form submission
    const updatedNumber: NumberData = {
      ...formData,
      status: "porting",
      portingStatus: {
        ...formData.portingStatus!,
        status: "in_progress" // Set status to in_progress when submitting
      }
    };
    
    onSave(updatedNumber);
  };

  const handleNextStep = () => {
    setActiveStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  const formatPhoneNumber = (phoneNumber: string | undefined): string => {
    if (!phoneNumber) return "";
    
    // Basic formatting for French numbers
    if (phoneNumber.startsWith("+33") && phoneNumber.length === 12) {
      return phoneNumber.replace(/(\+33)(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5 $6");
    }
    return phoneNumber;
  };

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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <ArrowsRightLeftIcon className="h-6 w-6 mr-2 text-indigo-600" />
            Demande de portabilité
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        {/* Stepper */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              activeStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${
              activeStep >= 2 ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              activeStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              2
            </div>
            <div className={`flex-1 h-1 mx-2 ${
              activeStep >= 3 ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              activeStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              3
            </div>
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="text-center flex-1">Informations</div>
            <div className="text-center flex-1">Opérateur précédent</div>
            <div className="text-center flex-1">Confirmation</div>
          </div>
        </div>
        
        <div className="overflow-y-auto p-4 flex-1">
          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            {activeStep === 1 && (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Information sur la portabilité
                      </h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                        <p>Le processus de portabilité permet de conserver votre numéro en changeant d&apos;opérateur. Ce processus prend généralement entre 1 et 4 semaines.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Numéro à porter</h3>
                  <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-lg">
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">{formatPhoneNumber(number?.number)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{number?.label || ""}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date souhaitée de portage
                  </label>
                  <input
                    type="date"
                    name="portingStatus.estimatedCompletionDate"
                    value={formData.portingStatus?.estimatedCompletionDate}
                    onChange={handleChange}
                    min={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // Minimum 7 days from now
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Veuillez prévoir au moins 7 jours à partir d&apos;aujourd&apos;hui.
                  </p>
                </div>
              </div>
            )}
            
            {/* Step 2 */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Opérateur actuel</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nom de l&apos;opérateur actuel
                    </label>
                    <input
                      type="text"
                      name="portingStatus.previousProvider"
                      value={formData.portingStatus?.previousProvider}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Ex: Orange, SFR, Bouygues, Free..."
                      required
                    />
                  </div>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-900 p-4 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <DocumentTextIcon className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        Documents requis
                      </h3>
                      <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                        <p>Pour finaliser la demande de portabilité, vous devrez fournir :</p>
                        <ul className="list-disc list-inside mt-1">
                          <li>Une facture récente de votre opérateur actuel (moins de 3 mois)</li>
                          <li>Votre RIO (Relevé d&apos;Identité Opérateur)</li>
                          <li>Une pièce d&apos;identité valide</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes supplémentaires
                  </label>
                  <textarea
                    name="portingStatus.notes"
                    value={formData.portingStatus?.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Informations complémentaires sur votre demande de portabilité..."
                  ></textarea>
                </div>
              </div>
            )}
            
            {/* Step 3 */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg text-center">
                  <CheckCircleIcon className="h-12 w-12 text-green-600 dark:text-green-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">
                    Prêt à soumettre votre demande
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Vérifiez que les informations ci-dessous sont correctes avant de finaliser votre demande.
                  </p>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-800 dark:text-white mb-3">Récapitulatif de la demande</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Numéro à porter:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{formatPhoneNumber(number?.number)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Opérateur actuel:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{formData.portingStatus?.previousProvider}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Date de la demande:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{new Date().toLocaleDateString('fr-FR')}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Date souhaitée de portage:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formData.portingStatus?.estimatedCompletionDate ? 
                          new Date(formData.portingStatus.estimatedCompletionDate).toLocaleDateString('fr-FR') : 
                          ''}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      required
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Je comprends que cette demande va initier un processus de portabilité et j&apos;accepte les conditions générales du service.
                    </span>
                  </label>
                </div>
              </div>
            )}
          </form>
        </div>
        
        <div className="flex justify-between p-4 border-t border-gray-200 dark:border-gray-700">
          {activeStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Précédent
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Annuler
            </button>
          )}
          
          {activeStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Suivant
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Soumettre la demande
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};