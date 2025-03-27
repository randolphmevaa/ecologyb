"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
// import { Button } from "@/components/ui/Button";
import { 
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  FolderIcon,
  SpeakerWaveIcon,
  ArrowsRightLeftIcon,
  EnvelopeIcon,
  PhoneXMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";

// Define menu option interface
interface IMenuOption {
  key: string;
  action: string;
  destination?: string;
}

// Define step data interfaces
interface IGreetingStepData {
  message: string;
}

interface IMenuStepData {
  options: IMenuOption[];
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

// Define step type
type StepType = "greeting" | "menu" | "forward" | "voicemail" | "end";

// Define types
interface ICallFlow {
  enabled: boolean;
  steps: {
    type: StepType;
    data: StepData;
  }[];
}

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
  forwarding: {
    enabled: boolean;
    destination: string;
    conditions: "always" | "busy" | "no-answer" | "custom";
    timeout?: number;
    schedules?: {
      days: ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")[];
      startTime: string;
      endTime: string;
    }[];
  };
  voicemail: {
    enabled: boolean;
    greeting: "default" | "custom";
    transcription: boolean;
    emailNotification: boolean;
    pin?: string;
  };
  callFlow?: ICallFlow;
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

interface CallFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  line: IPhoneLine | null;
  onSave: (line: IPhoneLine) => void;
}

// Define a type for step data field values
type StepDataValue = string | IMenuOption[] | undefined;

// Define a type for menu option field values
type MenuOptionFieldName = keyof IMenuOption;

export const CallFlowModal = ({
  isOpen,
  onClose,
  line,
  onSave,
}: CallFlowModalProps) => {
  const isDarkMode = document.documentElement.classList.contains('dark-theme');
  
  const [callFlow, setCallFlow] = useState<ICallFlow>({
    enabled: false,
    steps: []
  });
  
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen && line) {
      setCallFlow(line.callFlow || { enabled: false, steps: [] });
      setExpandedSteps((line.callFlow?.steps || []).map((_, index) => `step-${index}`));
      setErrors({});
    }
  }, [isOpen, line]);
  
  // Toggle step expansion
  const toggleStepExpansion = (stepId: string) => {
    setExpandedSteps(prev => {
      if (prev.includes(stepId)) {
        return prev.filter(id => id !== stepId);
      } else {
        return [...prev, stepId];
      }
    });
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCallFlow(prev => ({ ...prev, [name]: checked }));
  };
  
  // Add a new step
  const addStep = (type: StepType) => {
    let newStepData: StepData;
    
    switch (type) {
      case "greeting":
        newStepData = { message: "Bienvenue chez notre entreprise" };
        break;
      case "menu":
        newStepData = { options: [{ key: "1", action: "forward", destination: "" }] };
        break;
      case "forward":
        newStepData = { destination: "" };
        break;
      case "voicemail":
        newStepData = { greeting: "Veuillez laisser un message" };
        break;
      case "end":
        newStepData = { message: "Merci pour votre appel" };
        break;
    }
    
    const newStep = {
      type,
      data: newStepData
    };
    
    setCallFlow(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
    
    // Expand the newly added step
    setExpandedSteps(prev => [...prev, `step-${callFlow.steps.length}`]);
  };
  
  // Remove a step
  const removeStep = (index: number) => {
    setCallFlow(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
    
    // Remove from expanded steps
    setExpandedSteps(prev => prev.filter(id => id !== `step-${index}`));
  };
  
  // Move a step up
  const moveStepUp = (index: number) => {
    if (index === 0) return;
    
    setCallFlow(prev => {
      const newSteps = [...prev.steps];
      const temp = newSteps[index];
      newSteps[index] = newSteps[index - 1];
      newSteps[index - 1] = temp;
      return { ...prev, steps: newSteps };
    });
  };
  
  // Move a step down
  const moveStepDown = (index: number) => {
    if (index >= callFlow.steps.length - 1) return;
    
    setCallFlow(prev => {
      const newSteps = [...prev.steps];
      const temp = newSteps[index];
      newSteps[index] = newSteps[index + 1];
      newSteps[index + 1] = temp;
      return { ...prev, steps: newSteps };
    });
  };
  
  // Update a step's data
  const updateStepData = (index: number, field: string, value: StepDataValue) => {
    setCallFlow(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => {
        if (i === index) {
          return { 
            ...step, 
            data: { ...step.data, [field]: value } 
          };
        }
        return step;
      })
    }));
  };
  
  // Add a menu option
  const addMenuOption = (stepIndex: number) => {
    setCallFlow(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => {
        if (i === stepIndex && step.type === "menu") {
          const menuStep = step.data as IMenuStepData;
          const options = [...menuStep.options];
          const keys = options.map((opt: IMenuOption) => opt.key);
          
          // Find a new key that's not used yet
          let newKey = "1";
          for (let j: number = 1; j <= 9; j++) {
            if (!keys.includes(j.toString())) {
              newKey = j.toString();
              break;
            }
          }
          
          return { 
            ...step, 
            data: { 
              ...step.data, 
              options: [...options, { key: newKey, action: "forward", destination: "" }] 
            } 
          };
        }
        return step;
      })
    }));
  };
  
  // Remove a menu option
  const removeMenuOption = (stepIndex: number, optionIndex: number) => {
    setCallFlow(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => {
        if (i === stepIndex && step.type === "menu") {
          const menuStep = step.data as IMenuStepData;
          return { 
            ...step, 
            data: { 
              ...step.data, 
              options: menuStep.options.filter((_, j: number) => j !== optionIndex) 
            } 
          };
        }
        return step;
      })
    }));
  };
  
  // Update a menu option
  const updateMenuOption = (stepIndex: number, optionIndex: number, field: MenuOptionFieldName, value: string) => {
    setCallFlow(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => {
        if (i === stepIndex && step.type === "menu") {
          const menuStep = step.data as IMenuStepData;
          return { 
            ...step, 
            data: { 
              ...step.data, 
              options: menuStep.options.map((option: IMenuOption, j: number) => {
                if (j === optionIndex) {
                  return { ...option, [field]: value };
                }
                return option;
              }) 
            } 
          };
        }
        return step;
      })
    }));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (callFlow.enabled) {
      if (callFlow.steps.length === 0) {
        newErrors.general = "Au moins une étape est requise";
      }
      
      callFlow.steps.forEach((step, index) => {
        if (step.type === "greeting") {
          const greetingStep = step.data as IGreetingStepData;
          if (!greetingStep.message) {
            newErrors[`step-${index}-message`] = "Le message d'accueil est requis";
          }
        }
        
        if (step.type === "menu") {
          const menuStep = step.data as IMenuStepData;
          if (!menuStep.options || menuStep.options.length === 0) {
            newErrors[`step-${index}-options`] = "Au moins une option est requise";
          }
          
          if (menuStep.options) {
            menuStep.options.forEach((option: IMenuOption, optionIndex: number) => {
              if (!option.key) {
                newErrors[`step-${index}-option-${optionIndex}-key`] = "La touche est requise";
              }
              
              if (option.action === "forward" && !option.destination) {
                newErrors[`step-${index}-option-${optionIndex}-destination`] = "La destination est requise";
              }
            });
          }
        }
        
        if (step.type === "forward") {
          const forwardStep = step.data as IForwardStepData;
          if (!forwardStep.destination) {
            newErrors[`step-${index}-destination`] = "La destination est requise";
          }
        }
        
        if (step.type === "voicemail") {
          const voicemailStep = step.data as IVoicemailStepData;
          if (!voicemailStep.greeting) {
            newErrors[`step-${index}-greeting`] = "Le message de la messagerie est requis";
          }
        }
        
        if (step.type === "end") {
          const endStep = step.data as IEndStepData;
          if (!endStep.message) {
            newErrors[`step-${index}-message`] = "Le message de fin est requis";
          }
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && line) {
      const updatedLine = { 
        ...line, 
        callFlow: callFlow
      };
      
      onSave(updatedLine);
    }
  };
  
  // Step type labels
  const stepTypeLabels: { [key in StepType]: string } = {
    greeting: "Message d'accueil",
    menu: "Menu interactif",
    forward: "Transfert d'appel",
    voicemail: "Messagerie vocale",
    end: "Fin de l'appel"
  };
  
  // Step type icons
  const getStepIcon = (type: StepType) => {
    switch (type) {
      case "greeting":
        return <SpeakerWaveIcon className="h-5 w-5" />;
      case "menu":
        return <FolderIcon className="h-5 w-5" />;
      case "forward":
        return <ArrowsRightLeftIcon className="h-5 w-5" />;
      case "voicemail":
        return <EnvelopeIcon className="h-5 w-5" />;
      case "end":
        return <PhoneXMarkIcon className="h-5 w-5" />;
      default:
        return <FolderIcon className="h-5 w-5" />;
    }
  };
  
  if (!isOpen || !line) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`${isDarkMode ? 'bg-[#1F2937]' : 'bg-white'} rounded-xl shadow-xl w-full max-w-xl overflow-hidden`}
      >
        <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-[#374151]' : 'border-[#E5E7EB]'}`}>
          <div className="flex items-center gap-2">
            <FolderIcon className={`h-5 w-5 ${isDarkMode ? 'text-[#6366F1]' : 'text-[#4F46E5]'}`} />
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
              Flux d&apos;appel
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
              checked={callFlow.enabled}
              onChange={handleCheckboxChange}
              className={`rounded ${
                isDarkMode 
                  ? 'border-[#374151] text-[#4F46E5] focus:ring-[#4F46E5]' 
                  : 'border-[#E5E7EB] text-[#4F46E5] focus:ring-[#4F46E5]'
              } mr-2`}
            />
            <label htmlFor="enabled" className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
              Activer le flux d&apos;appel personnalisé
            </label>
          </div>
          
          {callFlow.enabled && (
            <>
              {errors.general && (
                <div className={`p-3 mb-3 rounded-lg ${isDarkMode ? 'bg-red-900 bg-opacity-30' : 'bg-red-100'} text-red-500 text-sm`}>
                  {errors.general}
                </div>
              )}
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                    Étapes du flux d&apos;appel
                  </h3>
                  <div className="flex gap-1">
                    <div className="relative group">
                      <button
                        type="button"
                        className={`px-2 py-1 text-xs font-medium rounded-lg ${
                          isDarkMode 
                            ? 'bg-[#4F46E5] text-white hover:bg-[#4338CA]' 
                            : 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
                        }`}
                      >
                        <PlusIcon className="h-3 w-3" />
                      </button>
                      
                      <div className={`absolute right-0 mt-1 w-44 rounded-lg shadow-lg ${
                        isDarkMode ? 'bg-[#111827] border-[#374151]' : 'bg-white border-[#E5E7EB]'
                      } border overflow-hidden z-10 hidden group-hover:block`}>
                        <div className={`py-1 ${isDarkMode ? 'divide-[#374151]' : 'divide-[#E5E7EB]'} divide-y`}>
                          {Object.entries(stepTypeLabels).map(([type, label]) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => addStep(type as StepType)}
                              className={`w-full px-4 py-2 text-xs text-left ${
                                isDarkMode 
                                  ? 'text-[#F9FAFB] hover:bg-[#374151]' 
                                  : 'text-[#111827] hover:bg-[#F3F4F6]'
                              }`}
                            >
                              <div className="flex items-center">
                                {getStepIcon(type as StepType)}
                                <span className="ml-2">{label}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {callFlow.steps.length === 0 ? (
                  <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-[#111827] border-[#374151]' : 'bg-[#F9FAFB] border-[#E5E7EB]'} border text-center`}>
                    <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-2`}>
                      Aucune étape définie
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                      Cliquez sur + pour ajouter une étape au flux d&apos;appel
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {callFlow.steps.map((step, index) => (
                      <div 
                        key={index} 
                        className={`rounded-lg border ${
                          isDarkMode ? 'bg-[#111827] border-[#374151]' : 'bg-white border-[#E5E7EB]'
                        } overflow-hidden`}
                      >
                        <div 
                          className={`flex items-center justify-between p-3 ${
                            isDarkMode ? 'bg-[#1F2937]' : 'bg-[#F9FAFB]'
                          } cursor-pointer`}
                          onClick={() => toggleStepExpansion(`step-${index}`)}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`h-6 w-6 rounded-full ${
                              isDarkMode ? 'bg-[#374151] text-[#9CA3AF]' : 'bg-[#E5E7EB] text-[#6B7280]'
                            } flex items-center justify-center`}>
                              {index + 1}
                            </div>
                            <div className="flex items-center gap-1">
                              {getStepIcon(step.type)}
                              <span className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#111827]'}`}>
                                {stepTypeLabels[step.type]}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveStepUp(index);
                              }}
                              disabled={index === 0}
                              className={`p-1 rounded ${
                                index === 0
                                  ? isDarkMode ? 'text-[#6B7280] cursor-not-allowed' : 'text-[#D1D5DB] cursor-not-allowed'
                                  : isDarkMode ? 'text-[#9CA3AF] hover:bg-[#374151] hover:text-[#F9FAFB]' : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'
                              }`}
                            >
                              <ArrowUpIcon className="h-4 w-4" />
                            </button>
                            
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveStepDown(index);
                              }}
                              disabled={index === callFlow.steps.length - 1}
                              className={`p-1 rounded ${
                                index === callFlow.steps.length - 1
                                  ? isDarkMode ? 'text-[#6B7280] cursor-not-allowed' : 'text-[#D1D5DB] cursor-not-allowed'
                                  : isDarkMode ? 'text-[#9CA3AF] hover:bg-[#374151] hover:text-[#F9FAFB]' : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'
                              }`}
                            >
                              <ArrowDownIcon className="h-4 w-4" />
                            </button>
                            
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeStep(index);
                              }}
                              className={`p-1 rounded ${
                                isDarkMode 
                                  ? 'text-red-400 hover:bg-red-900 hover:bg-opacity-30' 
                                  : 'text-red-500 hover:bg-red-100'
                              }`}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                            
                            {expandedSteps.includes(`step-${index}`) ? (
                              <ChevronUpIcon className="h-4 w-4" />
                            ) : (
                              <ChevronDownIcon className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                        
                        {expandedSteps.includes(`step-${index}`) && (
                          <div className="p-3 border-t border-dashed border-[#374151] dark:border-[#E5E7EB]">
                            {/* Greeting Step */}
                            {step.type === "greeting" && (
                              <div>
                                <label className={`block text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-1`}>
                                  Message d&apos;accueil
                                </label>
                                <textarea
                                  value={(step.data as IGreetingStepData).message}
                                  onChange={(e) => updateStepData(index, 'message', e.target.value)}
                                  rows={2}
                                  className={`w-full px-3 py-2 rounded-lg ${
                                    isDarkMode 
                                      ? 'bg-[#1F2937] border-[#374151] text-[#F9FAFB] focus:ring-[#4F46E5] focus:border-[#4F46E5]' 
                                      : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] focus:ring-[#4F46E5] focus:border-[#4F46E5]'
                                  } border ${errors[`step-${index}-message`] ? 'border-red-500' : ''}`}
                                  placeholder="Bienvenue chez notre entreprise..."
                                />
                                {errors[`step-${index}-message`] && (
                                  <p className="text-red-500 text-xs mt-1">{errors[`step-${index}-message`]}</p>
                                )}
                              </div>
                            )}
                            
                            {/* Menu Step */}
                            {step.type === "menu" && (
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className={`block text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                    Options du menu
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => addMenuOption(index)}
                                    className={`text-xs ${isDarkMode ? 'text-[#6366F1] hover:text-[#818CF8]' : 'text-[#4F46E5] hover:text-[#6366F1]'} flex items-center gap-1`}
                                  >
                                    <PlusIcon className="h-3 w-3" />
                                    <span>Ajouter</span>
                                  </button>
                                </div>
                                
                                {errors[`step-${index}-options`] && (
                                  <p className="text-red-500 text-xs mb-2">{errors[`step-${index}-options`]}</p>
                                )}
                                
                                {(step.data as IMenuStepData).options.length === 0 ? (
                                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1F2937]' : 'bg-[#F9FAFB]'} text-center`}>
                                    <p className={`text-xs ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                                      Aucune option définie
                                    </p>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {(step.data as IMenuStepData).options.map((option: IMenuOption, optionIndex: number) => (
                                      <div 
                                        key={optionIndex} 
                                        className={`p-2 rounded-lg border ${
                                          isDarkMode ? 'bg-[#1F2937] border-[#374151]' : 'bg-[#F9FAFB] border-[#E5E7EB]'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2 mb-2">
                                          <input
                                            type="text"
                                            value={option.key}
                                            onChange={(e) => updateMenuOption(index, optionIndex, 'key', e.target.value)}
                                            maxLength={1}
                                            className={`w-12 px-3 py-1 rounded-lg text-center ${
                                              isDarkMode 
                                                ? 'bg-[#111827] border-[#374151] text-[#F9FAFB] focus:ring-[#4F46E5] focus:border-[#4F46E5]' 
                                                : 'bg-white border-[#E5E7EB] text-[#111827] focus:ring-[#4F46E5] focus:border-[#4F46E5]'
                                            } border ${errors[`step-${index}-option-${optionIndex}-key`] ? 'border-red-500' : ''}`}
                                            placeholder="#"
                                          />
                                          
                                          <select
                                            value={option.action}
                                            onChange={(e) => updateMenuOption(index, optionIndex, 'action', e.target.value)}
                                            className={`flex-1 px-3 py-1 rounded-lg ${
                                              isDarkMode 
                                                ? 'bg-[#111827] border-[#374151] text-[#F9FAFB] focus:ring-[#4F46E5] focus:border-[#4F46E5]' 
                                                : 'bg-white border-[#E5E7EB] text-[#111827] focus:ring-[#4F46E5] focus:border-[#4F46E5]'
                                            } border text-sm`}
                                          >
                                            <option value="forward">Transférer</option>
                                            <option value="voicemail">Messagerie vocale</option>
                                            <option value="end">Terminer l&apos;appel</option>
                                          </select>
                                          
                                          <button
                                            type="button"
                                            onClick={() => removeMenuOption(index, optionIndex)}
                                            className={`p-1 rounded ${
                                              isDarkMode 
                                                ? 'text-red-400 hover:bg-red-900 hover:bg-opacity-30' 
                                                : 'text-red-500 hover:bg-red-100'
                                            }`}
                                          >
                                            <TrashIcon className="h-4 w-4" />
                                          </button>
                                        </div>
                                        
                                        {errors[`step-${index}-option-${optionIndex}-key`] && (
                                          <p className="text-red-500 text-xs mb-1">{errors[`step-${index}-option-${optionIndex}-key`]}</p>
                                        )}
                                        
                                        {option.action === "forward" && (
                                          <div>
                                            <input
                                              type="text"
                                              value={option.destination || ""}
                                              onChange={(e) => updateMenuOption(index, optionIndex, 'destination', e.target.value)}
                                              className={`w-full px-3 py-1 rounded-lg ${
                                                isDarkMode 
                                                  ? 'bg-[#111827] border-[#374151] text-[#F9FAFB] focus:ring-[#4F46E5] focus:border-[#4F46E5]' 
                                                  : 'bg-white border-[#E5E7EB] text-[#111827] focus:ring-[#4F46E5] focus:border-[#4F46E5]'
                                              } border text-sm ${errors[`step-${index}-option-${optionIndex}-destination`] ? 'border-red-500' : ''}`}
                                              placeholder="Destination (nom ou numéro)"
                                            />
                                            {errors[`step-${index}-option-${optionIndex}-destination`] && (
                                              <p className="text-red-500 text-xs mt-1">{errors[`step-${index}-option-${optionIndex}-destination`]}</p>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Forward Step */}
                            {step.type === "forward" && (
                              <div>
                                <label className={`block text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-1`}>
                                  Destination
                                </label>
                                <input
                                  type="text"
                                  value={(step.data as IForwardStepData).destination || ""}
                                  onChange={(e) => updateStepData(index, 'destination', e.target.value)}
                                  className={`w-full px-3 py-2 rounded-lg ${
                                    isDarkMode 
                                      ? 'bg-[#1F2937] border-[#374151] text-[#F9FAFB] focus:ring-[#4F46E5] focus:border-[#4F46E5]' 
                                      : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] focus:ring-[#4F46E5] focus:border-[#4F46E5]'
                                  } border ${errors[`step-${index}-destination`] ? 'border-red-500' : ''}`}
                                  placeholder="Numéro de téléphone ou nom du service"
                                />
                                {errors[`step-${index}-destination`] && (
                                  <p className="text-red-500 text-xs mt-1">{errors[`step-${index}-destination`]}</p>
                                )}
                              </div>
                            )}
                            
                            {/* Voicemail Step */}
                            {step.type === "voicemail" && (
                              <div>
                                <label className={`block text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-1`}>
                                  Message de la messagerie
                                </label>
                                <textarea
                                  value={(step.data as IVoicemailStepData).greeting || ""}
                                  onChange={(e) => updateStepData(index, 'greeting', e.target.value)}
                                  rows={2}
                                  className={`w-full px-3 py-2 rounded-lg ${
                                    isDarkMode 
                                      ? 'bg-[#1F2937] border-[#374151] text-[#F9FAFB] focus:ring-[#4F46E5] focus:border-[#4F46E5]' 
                                      : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] focus:ring-[#4F46E5] focus:border-[#4F46E5]'
                                  } border ${errors[`step-${index}-greeting`] ? 'border-red-500' : ''}`}
                                  placeholder="Veuillez laisser un message..."
                                />
                                {errors[`step-${index}-greeting`] && (
                                  <p className="text-red-500 text-xs mt-1">{errors[`step-${index}-greeting`]}</p>
                                )}
                              </div>
                            )}
                            
                            {/* End Step */}
                            {step.type === "end" && (
                              <div>
                                <label className={`block text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} mb-1`}>
                                  Message de fin
                                </label>
                                <textarea
                                  value={(step.data as IEndStepData).message || ""}
                                  onChange={(e) => updateStepData(index, 'message', e.target.value)}
                                  rows={2}
                                  className={`w-full px-3 py-2 rounded-lg ${
                                    isDarkMode 
                                      ? 'bg-[#1F2937] border-[#374151] text-[#F9FAFB] focus:ring-[#4F46E5] focus:border-[#4F46E5]' 
                                      : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] focus:ring-[#4F46E5] focus:border-[#4F46E5]'
                                  } border ${errors[`step-${index}-message`] ? 'border-red-500' : ''}`}
                                  placeholder="Merci pour votre appel..."
                                />
                                {errors[`step-${index}-message`] && (
                                  <p className="text-red-500 text-xs mt-1">{errors[`step-${index}-message`]}</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
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