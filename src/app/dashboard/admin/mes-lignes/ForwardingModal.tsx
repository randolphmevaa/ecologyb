"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
// import { Button } from "@/components/ui/Button";
import { XMarkIcon, PlusIcon, TrashIcon, ArrowsRightLeftIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

// Define types
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

// Define valid status types
type LineStatus = "active" | "inactive" | "forwarded" | "voicemail" | "dnd";
type DayType = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

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

interface IPhoneLine {
  id: string;
  number: string;
  extension?: string;
  label: string;
  type: "direct" | "extension" | "virtual" | "fax" | "conference";
  status: LineStatus;
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
  voicemail: {
    enabled: boolean;
    greeting: "default" | "custom";
    transcription: boolean;
    emailNotification: boolean;
    pin?: string;
  };
  callFlow?: {
    enabled: boolean;
    steps: {
      type: "greeting" | "menu" | "forward" | "voicemail" | "end";
      data: StepData;
    }[];
  };
  stats: {
    incoming: number;
    outgoing: number;
    missed: number;
    minutes: number;
    totalCalls: number;
    usagePercentage: number;
  };
  subscription: {
    plan: string;
    monthlyCost: number;
    minutesIncluded: number;
    minutesUsed: number;
    nextRenewal: string;
  };
  dateAdded: string;
}

interface ForwardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  line: IPhoneLine | null;
  onSave: (line: IPhoneLine) => void;
}

// Define a type for the schedule fields that can be updated
type ScheduleField = 'days' | 'startTime' | 'endTime';
type ScheduleValue = DayType[] | string;

export const ForwardingModal = ({
  isOpen,
  onClose,
  line,
  onSave,
}: ForwardingModalProps) => {
  const isDarkMode = document.documentElement.classList.contains('dark-theme');
  
  const [forwarding, setForwarding] = useState<ICallForwarding>({
    enabled: false,
    destination: "",
    conditions: "always",
    timeout: 20,
    schedules: []
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen && line) {
      setForwarding(structuredClone(line.forwarding));
      setErrors({});
    }
  }, [isOpen, line]);
  
  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForwarding(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForwarding(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle timeout change (number input)
  const handleTimeoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setForwarding(prev => ({ ...prev, timeout: value }));
    }
  };
  
  // Add a new schedule
  const addSchedule = () => {
    setForwarding(prev => ({
      ...prev,
      schedules: [
        ...(prev.schedules || []),
        {
          days: ["mon", "tue", "wed", "thu", "fri"],
          startTime: "09:00",
          endTime: "18:00"
        }
      ]
    }));
  };
  
  // Remove a schedule
  const removeSchedule = (index: number) => {
    setForwarding(prev => ({
      ...prev,
      schedules: prev.schedules?.filter((_, i) => i !== index)
    }));
  };
  
  // Update a schedule
  const updateSchedule = (index: number, field: ScheduleField, value: ScheduleValue) => {
    setForwarding(prev => ({
      ...prev,
      schedules: prev.schedules?.map((schedule, i) => {
        if (i === index) {
          return { ...schedule, [field]: value };
        }
        return schedule;
      })
    }));
  };
  
  // Handle day toggle for a schedule
  const toggleDay = (scheduleIndex: number, day: DayType) => {
    setForwarding(prev => ({
      ...prev,
      schedules: prev.schedules?.map((schedule, i) => {
        if (i === scheduleIndex) {
          const days = [...schedule.days];
          if (days.includes(day)) {
            return { ...schedule, days: days.filter(d => d !== day) };
          } else {
            return { ...schedule, days: [...days, day] };
          }
        }
        return schedule;
      })
    }));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (forwarding.enabled) {
      if (!forwarding.destination) {
        newErrors.destination = "Le numéro de destination est requis";
      } else if (!/^\+\d{10,15}$/.test(forwarding.destination)) {
        newErrors.destination = "Format invalide. Exemple: +33123456789";
      }
      
      if (forwarding.conditions === "no-answer" && (!forwarding.timeout || forwarding.timeout <= 0)) {
        newErrors.timeout = "Le délai doit être supérieur à 0";
      }
      
      if (forwarding.conditions === "custom" && (!forwarding.schedules || forwarding.schedules.length === 0)) {
        newErrors.schedules = "Au moins une plage horaire est requise";
      }
      
      if (forwarding.conditions === "custom" && forwarding.schedules) {
        forwarding.schedules.forEach((schedule, index) => {
          if (schedule.days.length === 0) {
            newErrors[`schedules.${index}.days`] = "Sélectionnez au moins un jour";
          }
          
          if (!schedule.startTime || !schedule.endTime) {
            newErrors[`schedules.${index}.time`] = "Les horaires sont requis";
          } else if (schedule.startTime >= schedule.endTime) {
            newErrors[`schedules.${index}.time`] = "L'heure de fin doit être après l'heure de début";
          }
        });
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && line) {
      // Create a deep copy to avoid modifying the original data
      const updatedForwarding = structuredClone(forwarding);
      
      // If forwarding is enabled and conditions are not 'custom', remove schedules
      if (updatedForwarding.conditions !== "custom") {
        delete updatedForwarding.schedules;
      }
      
      // If forwarding is enabled and conditions are not 'no-answer', remove timeout
      if (updatedForwarding.conditions !== "no-answer") {
        delete updatedForwarding.timeout;
      }
      
      // Determine the new status based on forwarding
      const newStatus: LineStatus = updatedForwarding.enabled 
        ? "forwarded" 
        : line.status === "forwarded" 
          ? "active" 
          : line.status;
      
      // Create a new line object with updated properties
      const updatedLine: IPhoneLine = structuredClone(line);
      updatedLine.forwarding = updatedForwarding;
      updatedLine.status = newStatus;
      
      onSave(updatedLine);
    }
  };
  
  // Day labels
  const dayLabels: { [key in DayType]: string } = {
    mon: "Lun",
    tue: "Mar",
    wed: "Mer",
    thu: "Jeu",
    fri: "Ven",
    sat: "Sam",
    sun: "Dim"
  };
  
  if (!isOpen || !line) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`${isDarkMode ? 'bg-[#1F2937]' : 'bg-white'} rounded-xl shadow-xl w-full max-w-lg overflow-hidden`}
      >
        <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-[#374151]' : 'border-[#E5E7EB]'}`}>
          <div className="flex items-center gap-2">
            <ArrowsRightLeftIcon className={`h-5 w-5 ${isDarkMode ? 'text-[#6366F1]' : 'text-[#4F46E5]'}`} />
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
              Transfert d&apos;appel
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`${isDarkMode ? 'text-[#9CA3AF] hover:text-[#F9FAFB]' : 'text-[#6B7280] hover:text-[#111827]'} rounded-full p-1`}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="enabled"
              name="enabled"
              checked={forwarding.enabled}
              onChange={handleCheckboxChange}
              className={`rounded ${
                isDarkMode 
                  ? 'border-[#374151] text-[#4F46E5] focus:ring-[#4F46E5]' 
                  : 'border-[#E5E7EB] text-[#4F46E5] focus:ring-[#4F46E5]'
              } mr-2`}
            />
            <label htmlFor="enabled" className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
              Activer le transfert d&apos;appel
            </label>
          </div>
          
          {forwarding.enabled && (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-1`}>
                  Numéro de destination <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="destination"
                  value={forwarding.destination}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg ${
                    isDarkMode 
                      ? 'bg-[#111827] border-[#374151] text-[#F9FAFB] focus:ring-[#4F46E5] focus:border-[#4F46E5]' 
                      : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] focus:ring-[#4F46E5] focus:border-[#4F46E5]'
                  } border ${errors.destination ? 'border-red-500' : ''}`}
                  placeholder="+33123456789"
                />
                {errors.destination ? (
                  <p className="text-red-500 text-xs mt-1">{errors.destination}</p>
                ) : (
                  <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mt-1`}>
                    Numéro de téléphone qui recevra les appels
                  </p>
                )}
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-1`}>
                  Conditions de transfert
                </label>
                <select
                  name="conditions"
                  value={forwarding.conditions}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg ${
                    isDarkMode 
                      ? 'bg-[#111827] border-[#374151] text-[#F9FAFB] focus:ring-[#4F46E5] focus:border-[#4F46E5]' 
                      : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] focus:ring-[#4F46E5] focus:border-[#4F46E5]'
                  } border`}
                >
                  <option value="always">Toujours (transfert permanent)</option>
                  <option value="busy">Uniquement si occupé</option>
                  <option value="no-answer">Pas de réponse après délai</option>
                  <option value="custom">Planification personnalisée</option>
                </select>
              </div>
              
              {forwarding.conditions === "no-answer" && (
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-1`}>
                    Délai avant transfert (secondes) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="timeout"
                    value={forwarding.timeout || 20}
                    onChange={handleTimeoutChange}
                    min="1"
                    max="60"
                    className={`w-full px-3 py-2 rounded-lg ${
                      isDarkMode 
                        ? 'bg-[#111827] border-[#374151] text-[#F9FAFB] focus:ring-[#4F46E5] focus:border-[#4F46E5]' 
                        : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] focus:ring-[#4F46E5] focus:border-[#4F46E5]'
                    } border ${errors.timeout ? 'border-red-500' : ''}`}
                  />
                  {errors.timeout && (
                    <p className="text-red-500 text-xs mt-1">{errors.timeout}</p>
                  )}
                </div>
              )}
              
              {forwarding.conditions === "custom" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                      Plages horaires
                    </label>
                    <button
                      type="button"
                      onClick={addSchedule}
                      className={`text-xs font-medium ${isDarkMode ? 'text-[#6366F1] hover:text-[#818CF8]' : 'text-[#4F46E5] hover:text-[#6366F1]'} flex items-center`}
                    >
                      <PlusIcon className="h-3 w-3 mr-1" />
                      Ajouter
                    </button>
                  </div>
                  
                  {errors.schedules && (
                    <div className={`p-2 mb-2 rounded-lg ${isDarkMode ? 'bg-red-900 bg-opacity-30' : 'bg-red-100'} flex items-start gap-2`}>
                      <ExclamationCircleIcon className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-red-500">{errors.schedules}</p>
                    </div>
                  )}
                  
                  {forwarding.schedules && forwarding.schedules.length > 0 ? (
                    <div className="space-y-4">
                      {forwarding.schedules.map((schedule, index) => (
                        <div 
                          key={index} 
                          className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#111827] border-[#374151]' : 'bg-[#F9FAFB] border-[#E5E7EB]'} border`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                              Plage #{index + 1}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeSchedule(index)}
                              className={`text-xs ${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'} flex items-center`}
                            >
                              <TrashIcon className="h-3 w-3 mr-1" />
                              Supprimer
                            </button>
                          </div>
                          
                          <div className="mb-2">
                            <label className={`block text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-1`}>
                              Jours
                            </label>
                            <div className="flex flex-wrap gap-1">
                              {(Object.entries(dayLabels) as [DayType, string][]).map(([day, label]) => (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() => toggleDay(index, day)}
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    schedule.days.includes(day)
                                      ? isDarkMode 
                                        ? 'bg-[#4F46E5] text-white' 
                                        : 'bg-[#4F46E5] text-white'
                                      : isDarkMode 
                                        ? 'bg-[#374151] text-[#9CA3AF] hover:bg-[#4B5563]' 
                                        : 'bg-[#E5E7EB] text-[#6B7280] hover:bg-[#D1D5DB]'
                                  }`}
                                >
                                  {label}
                                </button>
                              ))}
                            </div>
                            {errors[`schedules.${index}.days`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`schedules.${index}.days`]}</p>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className={`block text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-1`}>
                                Heure de début
                              </label>
                              <input
                                type="time"
                                value={schedule.startTime}
                                onChange={(e) => updateSchedule(index, 'startTime', e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg ${
                                  isDarkMode 
                                    ? 'bg-[#111827] border-[#374151] text-[#F9FAFB] focus:ring-[#4F46E5] focus:border-[#4F46E5]' 
                                    : 'bg-white border-[#E5E7EB] text-[#111827] focus:ring-[#4F46E5] focus:border-[#4F46E5]'
                                } border`}
                              />
                            </div>
                            
                            <div>
                              <label className={`block text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-1`}>
                                Heure de fin
                              </label>
                              <input
                                type="time"
                                value={schedule.endTime}
                                onChange={(e) => updateSchedule(index, 'endTime', e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg ${
                                  isDarkMode 
                                    ? 'bg-[#111827] border-[#374151] text-[#F9FAFB] focus:ring-[#4F46E5] focus:border-[#4F46E5]' 
                                    : 'bg-white border-[#E5E7EB] text-[#111827] focus:ring-[#4F46E5] focus:border-[#4F46E5]'
                                } border`}
                              />
                            </div>
                          </div>
                          {errors[`schedules.${index}.time`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`schedules.${index}.time`]}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#111827]' : 'bg-[#F9FAFB]'} text-center`}>
                      <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                        Aucune plage horaire définie
                      </p>
                      <button
                        type="button"
                        onClick={addSchedule}
                        className={`mt-2 text-sm ${isDarkMode ? 'text-[#6366F1] hover:text-[#818CF8]' : 'text-[#4F46E5] hover:text-[#6366F1]'}`}
                      >
                        Ajouter une plage
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
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
              Enregistrer
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
