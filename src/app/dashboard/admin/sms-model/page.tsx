"use client";

import React, { useState, useEffect } from "react";
import {  motion } from "framer-motion";
import { Header } from "@/components/Header";
import {
  ChatBubbleBottomCenterTextIcon,
  PencilSquareIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  UserGroupIcon,
  XMarkIcon,
  FunnelIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  PaperAirplaneIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  TagIcon,
  HashtagIcon,
  VariableIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { ChevronLeftIcon, SearchIcon } from "lucide-react";

// Define SMS Model types
type SmsModel = {
  _id: string;
  name: string;
  content: string;
  description: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  lastSent?: string;
  characterCount: number;
  variables?: string[];
  performance?: {
    delivered: number;
    failed: number;
    responses: number;
    conversions: number;
  };
  status: 'draft' | 'active' | 'archived';
};

// Define recipient type
type Recipient = {
  _id: string;
  name: string;
  phone: string;
  group?: string;
};

export default function SmsModelsPage() {
  // State for SMS models
  const [smsModels, setSmsModels] = useState<SmsModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedModel, setSelectedModel] = useState<SmsModel | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [sendMode, setSendMode] = useState<boolean>(false);
  
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filter, setFilter] = useState("Tous");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 9;
  
  // Editor state
  const [editContent, setEditContent] = useState<string>("");
  const [editName, setEditName] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [editCategory, setEditCategory] = useState<string>("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  
  // SMS sending state
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [sendingStatus, setSendingStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [smsPreview, setSmsPreview] = useState<{content: string, characterCount: number}>({
    content: "",
    characterCount: 0
  });

  // Fetch SMS models
  const fetchSmsModels = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSmsModels(sampleSmsModels);
      setLoading(false);
    }, 800);
  };

  // Fetch recipients
  const fetchRecipients = () => {
    // Simulate API call
    setTimeout(() => {
      setRecipients(sampleRecipients);
    }, 600);
  };

  useEffect(() => {
    fetchSmsModels();
    fetchRecipients();
  }, []);

  // Handle preview mode
  const handlePreviewModel = (model: SmsModel) => {
    setSelectedModel(model);
    setSmsPreview({
      content: model.content,
      characterCount: model.characterCount
    });
    setPreviewMode(true);
    setEditMode(false);
    setSendMode(false);
  };
  
  // Start editing model
  const handleEditModel = (model: SmsModel) => {
    setSelectedModel(model);
    setEditContent(model.content);
    setEditName(model.name);
    setEditDescription(model.description);
    setEditCategory(model.category);
    setEditTags(model.tags);
    setEditMode(true);
    setPreviewMode(false);
    setSendMode(false);
  };
  
  // Handle send mode
  const handleSendModel = (model: SmsModel) => {
    setSelectedModel(model);
    setSmsPreview({
      content: model.content,
      characterCount: model.characterCount
    });
    setSendMode(true);
    setEditMode(false);
    setPreviewMode(false);
  };

  // Create new model
  const handleCreateModel = () => {
    const newModel: SmsModel = {
      _id: `sms-${Date.now()}`,
      name: "Nouveau modèle SMS",
      content: "Votre texte de message ici. Utilisez {{variable}} pour les champs personnalisés.",
      description: "Description du modèle SMS",
      category: "Générique",
      tags: ["nouveau"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      characterCount: 68,
      variables: ["variable"],
      status: 'draft'
    };
    setSelectedModel(newModel);
    setEditContent(newModel.content);
    setEditName(newModel.name);
    setEditDescription(newModel.description);
    setEditCategory(newModel.category);
    setEditTags(newModel.tags);
    setEditMode(true);
    setPreviewMode(false);
    setSendMode(false);
  };

  // Save model
  const saveModel = () => {
    if (!selectedModel) return;
    
    const updatedModel = {
      ...selectedModel,
      name: editName,
      content: editContent,
      description: editDescription,
      category: editCategory,
      tags: editTags,
      characterCount: editContent.length,
      variables: extractVariables(editContent),
      updatedAt: new Date().toISOString()
    };
    
    // Update models list
    setSmsModels(models => 
      models.map(model => 
        model._id === updatedModel._id ? updatedModel : model
      )
    );
    
    // Exit edit mode
    setEditMode(false);
    setSelectedModel(null);
  };
  
  // Extract variables from content (like {{name}})
  const extractVariables = (content: string) => {
    const regex = /{{([^}]+)}}/g;
    const variables: string[] = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      variables.push(match[1]);
    }
    
    return [...new Set(variables)]; // Remove duplicates
  };
  
  // Add tag handler
  const handleAddTag = () => {
    if (newTag.trim() && !editTags.includes(newTag.trim())) {
      setEditTags([...editTags, newTag.trim()]);
      setNewTag("");
    }
  };
  
  // Remove tag handler
  const handleRemoveTag = (tag: string) => {
    setEditTags(editTags.filter(t => t !== tag));
  };
  
  // Send SMS handler
  const handleSendSms = () => {
    if (!selectedModel || selectedRecipients.length === 0) return;
    
    setSendingStatus('sending');
    
    // Simulate API call
    setTimeout(() => {
      setSendingStatus('success');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSendingStatus('idle');
        setSendMode(false);
        setSelectedModel(null);
        setSelectedRecipients([]);
        setSelectedGroups([]);
        setScheduledDate("");
      }, 3000);
    }, 2000);
  };

  // Filter models
  const filteredModels = smsModels.filter(model => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      model.name.toLowerCase().includes(query) ||
      model.description.toLowerCase().includes(query) ||
      model.content.toLowerCase().includes(query);

    const matchesFilter =
      filter === "Tous" ||
      model.category.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredModels.length / pageSize);
  const paginatedModels = filteredModels.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Stats calculations
  const totalModelsCount = smsModels.length;
  const activeModelsCount = smsModels.filter(model => model.status === 'active').length;
  const draftModelsCount = smsModels.filter(model => model.status === 'draft').length;
  const categoryCounts = smsModels.reduce((acc, model) => {
    acc[model.category] = (acc[model.category] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Category options for filtering
  const categoryOptions = ["Tous", ...Object.keys(categoryCounts)];
  
  // Recipient groups from data
  const recipientGroups = [...new Set(recipients.map(r => r.group).filter(Boolean))];

  // Helper functions for UI
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active':
        return "bg-gradient-to-r from-[#43e97b] to-[#38f9d7]";
      case 'draft':
        return "bg-gradient-to-r from-[#f7b91b] to-[#f59e0b]";
      case 'archived':
        return "bg-gradient-to-r from-[#a0a0a0] to-[#d0d0d0]";
      default:
        return "bg-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };
  
  // Get SMS character count class based on length
  const getCharacterCountClass = (count: number) => {
    if (count <= 160) return "text-[#43e97b]";
    if (count <= 320) return "text-[#f7b91b]";
    return "text-[#f87171]";
  };
  
  // Count SMS segments based on character count
  const getSmsSegments = (count: number) => {
    return Math.ceil(count / 160);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-white to-[#bfddf9]/10">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-[#213f5b] mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-lg font-semibold text-[#213f5b]">
            Chargement des modèles SMS...
          </p>
        </div>
      </div>
    );
  }
  
  // Editor or Preview mode or Send mode
  if (editMode || previewMode || sendMode) {
    return (
      <div className="flex h-screen bg-white">
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-hidden bg-[#f9fafb]">
            {/* Top Bar with Actions */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setPreviewMode(false);
                        setSendMode(false);
                        setSelectedModel(null);
                      }}
                      className="mr-4 p-2 rounded-lg hover:bg-gray-100"
                    >
                      <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    
                    <div>
                      <h1 className="text-xl font-semibold text-[#213f5b]">
                        {editMode && "Éditeur de modèle SMS"}
                        {previewMode && "Aperçu du modèle SMS"}
                        {sendMode && "Envoyer un SMS"}
                      </h1>
                      <p className="text-sm text-gray-500">
                        {selectedModel?.name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {editMode && (
                      <>
                        <button
                          onClick={() => {
                            setPreviewMode(true);
                            setEditMode(false);
                            setSmsPreview({
                              content: editContent,
                              characterCount: editContent.length
                            });
                          }}
                          className="px-4 py-2 rounded-lg border border-[#4facfe] text-[#4facfe] hover:bg-[#4facfe]/5 flex items-center"
                        >
                          <EyeIcon className="h-4 w-4 mr-2" />
                          Aperçu
                        </button>
                        <button
                          onClick={saveModel}
                          className="px-4 py-2 rounded-lg bg-[#4facfe] text-white hover:bg-[#4facfe]/90 flex items-center"
                        >
                          <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
                          Enregistrer
                        </button>
                      </>
                    )}
                    
                    {previewMode && (
                      <>
                        <button
                          onClick={() => {
                            setEditMode(true);
                            setPreviewMode(false);
                          }}
                          className="px-4 py-2 rounded-lg border border-[#4facfe] text-[#4facfe] hover:bg-[#4facfe]/5 flex items-center"
                        >
                          <PencilSquareIcon className="h-4 w-4 mr-2" />
                          Modifier
                        </button>
                        <button
                          onClick={() => {
                            setSendMode(true);
                            setPreviewMode(false);
                          }}
                          className="px-4 py-2 rounded-lg bg-[#4facfe] text-white hover:bg-[#4facfe]/90 flex items-center"
                        >
                          <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                          Envoyer SMS
                        </button>
                      </>
                    )}
                    
                    {sendMode && sendingStatus === 'idle' && (
                      <button
                        onClick={handleSendSms}
                        disabled={selectedRecipients.length === 0}
                        className={`px-4 py-2 rounded-lg bg-[#4facfe] text-white hover:bg-[#4facfe]/90 flex items-center ${
                          selectedRecipients.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                        {scheduledDate ? 'Programmer' : 'Envoyer maintenant'}
                      </button>
                    )}
                    
                    {sendMode && sendingStatus === 'sending' && (
                      <button
                        disabled
                        className="px-4 py-2 rounded-lg bg-[#4facfe] text-white flex items-center opacity-70"
                      >
                        <svg
                          className="animate-spin h-4 w-4 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Envoi en cours...
                      </button>
                    )}
                    
                    {sendMode && sendingStatus === 'success' && (
                      <button
                        disabled
                        className="px-4 py-2 rounded-lg bg-[#43e97b] text-white flex items-center"
                      >
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                        SMS envoyé avec succès
                      </button>
                    )}
                    
                    {sendMode && sendingStatus === 'error' && (
                      <button
                        disabled
                        className="px-4 py-2 rounded-lg bg-[#f87171] text-white flex items-center"
                      >
                        <ExclamationCircleIcon className="h-4 w-4 mr-2" />
                        Erreur d&apos;envoi
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Editor or Preview Area */}
            <div className="h-full overflow-auto relative">
              <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {/* Edit Mode */}
                {editMode && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - SMS Content Editor */}
                    <div className="lg:col-span-2">
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100">
                          <h2 className="text-lg font-semibold text-[#213f5b]">Contenu du SMS</h2>
                        </div>
                        
                        <div className="p-4">
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Texte du message</label>
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              rows={6}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                              placeholder="Entrez le contenu de votre SMS ici. Utilisez {{variable}} pour les champs personnalisés."
                            />
                          </div>
                          
                          <div className="flex justify-between items-center text-sm">
                            <div>
                              <span className="font-medium">Caractères:</span>{" "}
                              <span className={getCharacterCountClass(editContent.length)}>
                                {editContent.length}
                              </span>
                              {" / "}
                              <span className="text-gray-500">
                                Segments: {getSmsSegments(editContent.length)}
                              </span>
                            </div>
                            <div className="text-gray-500">
                              <span className="text-xs">
                                Standard SMS: 160 caractères par segment
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-[#f9fafb] p-4 border-t border-gray-100">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Variables détectées</h3>
                          <div className="flex flex-wrap gap-2">
                            {extractVariables(editContent).length > 0 ? (
                              extractVariables(editContent).map((variable, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#4facfe]/10 text-[#4facfe]"
                                >
                                  <VariableIcon className="h-3 w-3 mr-1" />
                                  {variable}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-gray-500">
                                Aucune variable détectée. Utilisez pour ajouter des champs personnalisés.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Column - Model Details */}
                    <div className="lg:col-span-1">
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100">
                          <h2 className="text-lg font-semibold text-[#213f5b]">Détails du modèle</h2>
                        </div>
                        
                        <div className="p-4 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du modèle</label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                            <select
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                            >
                              <option value="Générique">Générique</option>
                              <option value="Marketing">Marketing</option>
                              <option value="Notification">Notification</option>
                              <option value="Confirmation">Confirmation</option>
                              <option value="Alerte">Alerte</option>
                              <option value="Rappel">Rappel</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {editTags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#4facfe]/10 text-[#4facfe] group"
                                >
                                  <TagIcon className="h-3 w-3 mr-1" />
                                  {tag}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-[#4facfe] hover:bg-[#4facfe]/20"
                                  >
                                    <XMarkIcon className="h-3 w-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                            <div className="flex">
                              <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                placeholder="Ajouter un tag"
                                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                              />
                              <button
                                type="button"
                                onClick={handleAddTag}
                                className="px-3 py-1.5 bg-[#4facfe] text-white rounded-r-md hover:bg-[#4facfe]/90 text-sm"
                              >
                                Ajouter
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                            <div className="flex space-x-3">
                              <div className="flex items-center">
                                <input
                                  id="status-draft"
                                  name="status"
                                  type="radio"
                                  checked={selectedModel?.status === 'draft'}
                                  onChange={() => setSelectedModel(prev => prev ? {...prev, status: 'draft'} : null)}
                                  className="h-4 w-4 text-[#4facfe] focus:ring-[#4facfe] border-gray-300"
                                />
                                <label htmlFor="status-draft" className="ml-2 text-sm text-gray-700">
                                  Brouillon
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="status-active"
                                  name="status"
                                  type="radio"
                                  checked={selectedModel?.status === 'active'}
                                  onChange={() => setSelectedModel(prev => prev ? {...prev, status: 'active'} : null)}
                                  className="h-4 w-4 text-[#4facfe] focus:ring-[#4facfe] border-gray-300"
                                />
                                <label htmlFor="status-active" className="ml-2 text-sm text-gray-700">
                                  Actif
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="status-archived"
                                  name="status"
                                  type="radio"
                                  checked={selectedModel?.status === 'archived'}
                                  onChange={() => setSelectedModel(prev => prev ? {...prev, status: 'archived'} : null)}
                                  className="h-4 w-4 text-[#4facfe] focus:ring-[#4facfe] border-gray-300"
                                />
                                <label htmlFor="status-archived" className="ml-2 text-sm text-gray-700">
                                  Archivé
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Preview Mode */}
                {previewMode && (
                  <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-[#213f5b]">Aperçu du SMS</h2>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${getCharacterCountClass(smsPreview.characterCount)}`}>
                            {smsPreview.characterCount} caractères
                          </span>
                          <span className="text-xs text-gray-500">
                            {getSmsSegments(smsPreview.characterCount)} segment(s)
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        {/* Mobile Phone Preview */}
                        <div className="max-w-xs mx-auto bg-gray-800 rounded-xl p-2 shadow-lg">
                          <div className="bg-gray-900 rounded-lg overflow-hidden">
                            {/* Phone Header */}
                            <div className="p-2 bg-gray-800 flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="h-3 w-3 bg-[#4facfe] rounded-full"></div>
                                <span className="text-white text-xs ml-2">Messages</span>
                              </div>
                              <div className="text-white text-xs">
                                {new Date().getHours()}:{String(new Date().getMinutes()).padStart(2, '0')}
                              </div>
                            </div>
                            
                            {/* Message Bubble */}
                            <div className="p-3 h-64 bg-gray-100 overflow-y-auto">
                              <div className="max-w-[85%] ml-auto bg-[#4facfe] text-white px-3 py-2 rounded-lg rounded-tr-none mt-4">
                                {smsPreview.content}
                              </div>
                              <div className="text-right mt-1">
                                <span className="text-xs text-gray-500">
                                  {new Date().getHours()}:{String(new Date().getMinutes()).padStart(2, '0')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-[#f9fafb] p-4 border-t border-gray-100">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Détails du modèle</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-500">Nom:</span> {selectedModel?.name}
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Catégorie:</span> {selectedModel?.category}
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium text-gray-500">Description:</span> {selectedModel?.description}
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium text-gray-500">Tags:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedModel?.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#4facfe]/10 text-[#4facfe]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Créé le:</span> {formatDate(selectedModel?.createdAt || '')}
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Mis à jour:</span> {formatDate(selectedModel?.updatedAt || '')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Send Mode */}
                {sendMode && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Recipients */}
                    <div className="lg:col-span-2">
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                        <div className="p-4 border-b border-gray-100">
                          <h2 className="text-lg font-semibold text-[#213f5b]">Destinataires</h2>
                        </div>
                        
                        <div className="p-4">
                          {/* Search Recipients */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher des contacts</label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Rechercher par nom ou numéro de téléphone..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                              />
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Select Groups */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sélectionner par groupe</label>
                            <div className="flex flex-wrap gap-2">
                              {recipientGroups.map((group, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    if (selectedGroups.includes(group!)) {
                                      setSelectedGroups(selectedGroups.filter(g => g !== group));
                                      // Remove recipients from this group
                                      const groupRecipientIds = recipients
                                        .filter(r => r.group === group)
                                        .map(r => r._id);
                                      setSelectedRecipients(selectedRecipients.filter(id => !groupRecipientIds.includes(id)));
                                    } else {
                                      setSelectedGroups([...selectedGroups, group!]);
                                      // Add all recipients from this group
                                      const groupRecipientIds = recipients
                                        .filter(r => r.group === group)
                                        .map(r => r._id);
                                      setSelectedRecipients([...new Set([...selectedRecipients, ...groupRecipientIds])]);
                                    }
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    selectedGroups.includes(group!)
                                      ? "bg-[#4facfe] text-white"
                                      : "bg-white text-gray-600 border border-gray-200 hover:border-[#4facfe] hover:bg-[#4facfe]/10"
                                  }`}
                                >
                                  <span className="flex items-center">
                                    <UserGroupIcon className="h-3.5 w-3.5 mr-1.5" />
                                    {group}
                                    <span className="ml-1.5 bg-gray-200 text-gray-700 rounded-full text-xs px-1.5">
                                      {recipients.filter(r => r.group === group).length}
                                    </span>
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          {/* Recipients List */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <label className="block text-sm font-medium text-gray-700">Contacts ({selectedRecipients.length} sélectionnés)</label>
                              {selectedRecipients.length > 0 && (
                                <button
                                  onClick={() => setSelectedRecipients([])}
                                  className="text-xs text-[#4facfe] hover:text-[#4facfe]/80"
                                >
                                  Tout désélectionner
                                </button>
                              )}
                            </div>
                            
                            <div className="border border-gray-200 rounded-md overflow-hidden max-h-64 overflow-y-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                                      <input
                                        type="checkbox"
                                        className="h-4 w-4 text-[#4facfe] focus:ring-[#4facfe] border-gray-300 rounded"
                                        checked={selectedRecipients.length === recipients.length}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedRecipients(recipients.map(r => r._id));
                                          } else {
                                            setSelectedRecipients([]);
                                          }
                                        }}
                                      />
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Nom
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Téléphone
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Groupe
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {recipients.map((recipient) => (
                                    <tr 
                                      key={recipient._id}
                                      className={selectedRecipients.includes(recipient._id) ? "bg-[#4facfe]/5" : "hover:bg-gray-50"}
                                    >
                                      <td className="px-4 py-2 whitespace-nowrap">
                                        <input
                                          type="checkbox"
                                          className="h-4 w-4 text-[#4facfe] focus:ring-[#4facfe] border-gray-300 rounded"
                                          checked={selectedRecipients.includes(recipient._id)}
                                          onChange={() => {
                                            if (selectedRecipients.includes(recipient._id)) {
                                              setSelectedRecipients(selectedRecipients.filter(id => id !== recipient._id));
                                            } else {
                                              setSelectedRecipients([...selectedRecipients, recipient._id]);
                                            }
                                          }}
                                        />
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{recipient.name}</div>
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{recipient.phone}</div>
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap">
                                        {recipient.group && (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#4facfe]/10 text-[#4facfe]">
                                            {recipient.group}
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            
                            {/* Selected Count */}
                            <div className="mt-2 text-sm text-gray-500">
                              {selectedRecipients.length} destinataire(s) sélectionné(s)
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Scheduling Options */}
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100">
                          <h2 className="text-lg font-semibold text-[#213f5b]">Options d&apos;envoi</h2>
                        </div>
                        
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Planifier l&apos;envoi</label>
                              <div className="flex items-center space-x-4 mb-4">
                                <div className="flex items-center">
                                  <input
                                    id="send-now"
                                    name="schedule"
                                    type="radio"
                                    checked={!scheduledDate}
                                    onChange={() => setScheduledDate("")}
                                    className="h-4 w-4 text-[#4facfe] focus:ring-[#4facfe] border-gray-300"
                                  />
                                  <label htmlFor="send-now" className="ml-2 text-sm text-gray-700">
                                    Envoyer maintenant
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id="schedule-later"
                                    name="schedule"
                                    type="radio"
                                    checked={!!scheduledDate}
                                    onChange={() => setScheduledDate(new Date().toISOString().slice(0, 16))}
                                    className="h-4 w-4 text-[#4facfe] focus:ring-[#4facfe] border-gray-300"
                                  />
                                  <label htmlFor="schedule-later" className="ml-2 text-sm text-gray-700">
                                    Programmer
                                  </label>
                                </div>
                              </div>
                              
                              {scheduledDate && (
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Date et heure d&apos;envoi</label>
                                  <input
                                    type="datetime-local"
                                    value={scheduledDate}
                                    onChange={(e) => setScheduledDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                                  />
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <label className="flex items-center space-x-2 mb-2">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 text-[#4facfe] focus:ring-[#4facfe] border-gray-300 rounded"
                                  defaultChecked={true}
                                />
                                <span className="text-sm font-medium text-gray-700">Activer le suivi des SMS</span>
                              </label>
                              <p className="text-xs text-gray-500 mb-4">
                                Suivez le statut de livraison et les statistiques d&apos;engagement pour chaque SMS envoyé.
                              </p>
                              
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 text-[#4facfe] focus:ring-[#4facfe] border-gray-300 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">Activer les réponses automatiques</span>
                              </label>
                              <p className="text-xs text-gray-500">
                                Configurez des réponses automatiques pour les réponses courantes des destinataires.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Column - Message Preview */}
                    <div className="lg:col-span-1">
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                        <div className="p-4 border-b border-gray-100">
                          <h2 className="text-lg font-semibold text-[#213f5b]">Aperçu du message</h2>
                        </div>
                        
                        <div className="p-4">
                          <div className="bg-gray-100 rounded-lg p-4 relative">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#4facfe] flex items-center justify-center text-white font-bold text-sm">
                                ES
                              </div>
                              <div className="ml-3 bg-white p-3 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-800">
                                  {smsPreview.content}
                                </p>
                                <span className="block text-xs text-gray-500 mt-1">
                                  {new Date().getHours()}:{new Date().getMinutes()} {selectedRecipients.length > 0 ? '• Envoi à ' + selectedRecipients.length + ' destinataire(s)' : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <div className="bg-[#f9fafb] rounded-lg p-3">
                              <h3 className="text-sm font-medium text-gray-700 mb-2">Informations</h3>
                              <ul className="space-y-2 text-xs text-gray-600">
                                <li className="flex justify-between">
                                  <span>Caractères:</span>
                                  <span className={getCharacterCountClass(smsPreview.characterCount)}>
                                    {smsPreview.characterCount}
                                  </span>
                                </li>
                                <li className="flex justify-between">
                                  <span>Segments SMS:</span>
                                  <span>{getSmsSegments(smsPreview.characterCount)}</span>
                                </li>
                                <li className="flex justify-between">
                                  <span>Total des destinataires:</span>
                                  <span>{selectedRecipients.length}</span>
                                </li>
                                <li className="flex justify-between">
                                  <span>Coût estimé:</span>
                                  <span>{(getSmsSegments(smsPreview.characterCount) * 0.05 * selectedRecipients.length).toFixed(2)}€</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-[#f5f5f5] border-t border-gray-200">
                          <div className="flex items-center text-sm text-gray-700">
                            <ShieldCheckIcon className="h-5 w-5 mr-2 text-[#4facfe]" />
                            <p>
                              Tous les SMS sont envoyés en conformité avec la réglementation RGPD et incluent une option de désinscription.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Main listing view
  return (
    <div className="flex h-screen bg-white">
      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main
          className="flex-1 overflow-y-auto"
          style={{
            background:
              "linear-gradient(135deg, rgba(191,221,249,0.15), rgba(210,252,178,0.1))",
          }}
        >
          {/* Hero Section */}
          <div
            className="w-full py-8 md:py-10 relative overflow-hidden"
            style={{ 
              background: "linear-gradient(135deg, #213f5b, #1a324a)" 
            }}
          >
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#bfddf9]/10 transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#d2fcb2]/10 transform -translate-x-1/3 translate-y-1/3"></div>

            <motion.div
              className="max-w-7xl mx-auto px-4 md:px-8 relative z-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-start md:items-center justify-between flex-col md:flex-row">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Modèles d&apos;SMS
                  </h1>
                  <p className="mt-2 md:mt-4 text-base md:text-lg text-[#d2fcb2]">
                    Créez et gérez tous vos modèles SMS pour vos communications automatisées.
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex gap-3">
                  <button
                    onClick={handleCreateModel}
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg px-4 py-2 inline-flex items-center text-sm transition-all border border-white/20 shadow-lg"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Créer un modèle
                  </button>
                  <button
                    className="bg-[#43e97b]/90 hover:bg-[#43e97b] text-white rounded-lg px-4 py-2 inline-flex items-center text-sm transition-all shadow-lg"
                  >
                    <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                    Envoyer un SMS
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
            {/* Stats Section */}
            <motion.div
              className="mb-6 md:mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Total Models */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="flex h-full">
                  <div className="w-2 bg-gradient-to-b from-[#4facfe] to-[#1d6fa5]"></div>
                  <div className="flex-1 p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">Total Modèles</p>
                        <h3 className="text-xl md:text-2xl font-bold text-[#213f5b] mt-1">
                          {totalModelsCount}
                        </h3>
                      </div>
                      <div className="p-2 md:p-3 rounded-full bg-[#4facfe]/10 group-hover:bg-[#4facfe]/20 transition-all">
                        <ChatBubbleBottomCenterTextIcon className="h-5 w-5 md:h-6 md:w-6 text-[#4facfe]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Models */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="flex h-full">
                  <div className="w-2 bg-gradient-to-b from-[#43e97b] to-[#38f9d7]"></div>
                  <div className="flex-1 p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">Modèles Actifs</p>
                        <h3 className="text-xl md:text-2xl font-bold text-[#213f5b] mt-1">
                          {activeModelsCount}
                        </h3>
                      </div>
                      <div className="p-2 md:p-3 rounded-full bg-[#43e97b]/10 group-hover:bg-[#43e97b]/20 transition-all">
                        <PaperAirplaneIcon className="h-5 w-5 md:h-6 md:w-6 text-[#43e97b]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Draft Models */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="flex h-full">
                  <div className="w-2 bg-gradient-to-b from-[#f7b91b] to-[#f59e0b]"></div>
                  <div className="flex-1 p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">Brouillons</p>
                        <h3 className="text-xl md:text-2xl font-bold text-[#213f5b] mt-1">
                          {draftModelsCount}
                        </h3>
                      </div>
                      <div className="p-2 md:p-3 rounded-full bg-[#f7b91b]/10 group-hover:bg-[#f7b91b]/20 transition-all">
                        <PencilSquareIcon className="h-5 w-5 md:h-6 md:w-6 text-[#f7b91b]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SMS Statistics */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="flex h-full">
                  <div className="w-2 bg-gradient-to-b from-[#38c2de] to-[#1d6fa5]"></div>
                  <div className="flex-1 p-4 md:p-6">
                    <div>
                      <p className="text-xs md:text-sm text-gray-500 font-medium">SMS envoyés ce mois</p>
                      <h3 className="text-lg font-bold text-[#213f5b] mt-1">
                        1,248
                      </h3>
                      <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#38c2de] to-[#1d6fa5]"
                          style={{width: '75%'}}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        75% du forfait mensuel
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Search Bar & Filter Buttons */}
            <div className="mb-6 md:mb-8 bg-white p-4 rounded-xl shadow-sm border border-[#bfddf9]/30">
              <div className="relative mb-4">
                <SearchIcon className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, contenu ou description..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-24 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition"
                />
                <div className="absolute right-3 top-2 flex items-center">
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="p-1.5 text-gray-500 hover:text-gray-700 transition mr-1"
                      title="Effacer la recherche"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={fetchSmsModels}
                    className="p-1.5 text-[#213f5b] bg-[#bfddf9]/10 rounded-lg hover:bg-[#bfddf9]/20 transition border border-[#bfddf9]/30"
                    title="Rafraîchir la liste"
                  >
                    <ArrowPathIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <FunnelIcon className="w-4 h-4 text-gray-500 mr-2" />
                <p className="text-sm text-gray-500 mr-4">Filtres:</p>
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {categoryOptions.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setFilter(item);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filter === item
                          ? "bg-gradient-to-r from-[#213f5b] to-[#1d6fa5] text-white shadow-sm"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-[#4facfe] hover:bg-[#4facfe]/10"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Model Count */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{filteredModels.length}</span> modèle
                {filteredModels.length !== 1 ? "s" : ""} trouvé
                {filteredModels.length !== 1 ? "s" : ""}
              </p>

              {paginatedModels.length > 0 && (
                <p className="text-sm text-gray-600">
                  Page {currentPage} sur {totalPages}
                </p>
              )}
            </div>

            {/* SMS Model Cards Grid */}
            {paginatedModels.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center border border-[#bfddf9]/20">
                <div className="flex flex-col items-center justify-center">
                  <div className="p-3 bg-[#bfddf9]/10 rounded-full mb-4">
                    <SearchIcon className="h-8 w-8 text-[#213f5b]/60" />
                  </div>
                  <h3 className="text-lg font-medium text-[#213f5b]">
                    Aucun modèle trouvé
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Essayez de modifier vos filtres ou votre recherche
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilter("Tous");
                    }}
                    className="mt-4 px-4 py-2 bg-[#213f5b]/10 text-[#213f5b] rounded-lg hover:bg-[#213f5b]/20 transition"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {paginatedModels.map((model) => {
                  return (
                    <motion.div
                      key={model._id}
                      className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -3 }}
                    >
                      {/* Status indicator stripe at top */}
                      <div 
                        className="absolute top-0 left-0 right-0 h-1 z-10"
                        style={{ background: getStatusColor(model.status) }}
                      ></div>
                      
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#4facfe]/5 to-[#4facfe]/15 rounded-bl-full z-0 group-hover:scale-110 transition-transform duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#43e97b]/5 to-[#43e97b]/15 rounded-tr-full z-0 group-hover:scale-110 transition-transform duration-500"></div>

                      {/* Model Main Content */}
                      <div className="p-5 flex-1 relative z-10">
                        {/* Header with name and status */}
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-[#213f5b]">
                              {model.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {model.category}
                            </p>
                          </div>
                          <span 
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              model.status === 'active' ? 'bg-[#43e97b]/20 text-[#2a8a4a]' :
                              model.status === 'draft' ? 'bg-[#f7b91b]/20 text-[#b07b0f]' :
                              'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {model.status === 'active' ? 'Actif' :
                             model.status === 'draft' ? 'Brouillon' :
                             'Archivé'}
                          </span>
                        </div>
                        
                        {/* SMS Content */}
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-1">Contenu du SMS</p>
                          <div className="bg-[#f5f5f5] p-3 rounded-md">
                            <p className="text-sm text-gray-700 line-clamp-3">{model.content}</p>
                          </div>
                          <div className="flex justify-between items-center mt-1.5">
                            <span className="text-xs font-medium text-gray-500">
                              Caractères: <span className={getCharacterCountClass(model.characterCount)}>{model.characterCount}</span>
                            </span>
                            <span className="text-xs text-gray-500">
                              {getSmsSegments(model.characterCount)} segment(s)
                            </span>
                          </div>
                        </div>
                        
                        {/* Description */}
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-1">Description</p>
                          <p className="text-sm text-gray-600 line-clamp-2">{model.description}</p>
                        </div>
                        
                        {/* Variables */}
                        {model.variables && model.variables.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-1">Variables</p>
                            <div className="flex flex-wrap gap-2">
                              {model.variables.map((variable, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#38c2de]/10 text-[#38c2de]"
                                >
                                  <HashtagIcon className="h-3 w-3 mr-1" />
                                  {variable}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Tags */}
                        {model.tags && model.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {model.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-1 bg-[#4facfe]/10 text-[#4facfe] rounded-md text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Meta Info */}
                        <div className="mt-auto text-xs text-gray-500 grid grid-cols-2 gap-2">
                          <div>
                            <p>Créé le: {formatDate(model.createdAt)}</p>
                            <p>Mis à jour: {formatDate(model.updatedAt)}</p>
                          </div>
                          <div>
                            {model.lastSent && (
                              <p>Dernier envoi: {formatDate(model.lastSent)}</p>
                            )}
                            {model.performance && (
                              <p className="text-[#43e97b]">
                                Taux de livraison: {((model.performance.delivered / (model.performance.delivered + model.performance.failed)) * 100).toFixed(1)}%
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="p-4 border-t border-gray-100 bg-[#f9fafb]">
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => handlePreviewModel(model)}
                            className="flex items-center justify-center py-2 text-[#213f5b] rounded-lg hover:bg-[#213f5b]/5 transition-colors text-sm"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            Aperçu
                          </button>
                          <button
                            onClick={() => handleEditModel(model)}
                            className="flex items-center justify-center py-2 text-[#213f5b] rounded-lg hover:bg-[#213f5b]/5 transition-colors text-sm"
                          >
                            <PencilSquareIcon className="h-4 w-4 mr-1" />
                            Modifier
                          </button>
                          <button
                            onClick={() => handleSendModel(model)}
                            className="flex items-center justify-center py-2 text-[#43e97b] rounded-lg hover:bg-[#43e97b]/10 transition-colors text-sm font-medium"
                          >
                            <PaperAirplaneIcon className="h-4 w-4 mr-1" />
                            Envoyer
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg flex items-center gap-2 text-[#213f5b] border border-[#4facfe]/40 hover:bg-[#4facfe]/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Précédent</span>
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show first, last, current and surrounding pages
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                        currentPage === pageNum
                          ? "bg-gradient-to-br from-[#213f5b] to-[#1d6fa5] text-white shadow-lg"
                          : "text-[#213f5b] hover:bg-[#4facfe]/10 border border-[#4facfe]/40"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg flex items-center gap-2 text-[#213f5b] border border-[#4facfe]/40 hover:bg-[#4facfe]/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="text-sm font-medium">Suivant</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Footer spacing */}
            <div className="h-8"></div>
          </div>
        </main>
      </div>

      {/* Add some CSS for animations */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

// Sample data for the models
const sampleSmsModels: SmsModel[] = [
  {
    _id: 'sms-1',
    name: 'Confirmation de rendez-vous',
    content: 'Bonjour {{nom}}, votre rendez-vous avec Eco Solutions est confirmé pour le {{date}} à {{heure}}. Pour modifier, appelez-nous au 01 23 45 67 89.',
    description: 'SMS de confirmation envoyé après la prise de rendez-vous.',
    category: 'Confirmation',
    tags: ['rendez-vous', 'automatique'],
    createdAt: '2023-01-15T10:30:00.000Z',
    updatedAt: '2023-06-10T14:45:00.000Z',
    lastSent: '2023-08-15T09:12:00.000Z',
    characterCount: 142,
    variables: ['nom', 'date', 'heure'],
    performance: {
      delivered: 487,
      failed: 13,
      responses: 56,
      conversions: 32
    },
    status: 'active'
  },
  {
    _id: 'sms-2',
    name: 'Rappel de rendez-vous',
    content: 'Rappel: Votre RDV avec Eco Solutions est demain à {{heure}}. En cas d\'empêchement, merci de nous prévenir au 01 23 45 67 89.',
    description: 'SMS de rappel envoyé la veille du rendez-vous.',
    category: 'Rappel',
    tags: ['rendez-vous', 'automatique'],
    createdAt: '2023-02-20T09:15:00.000Z',
    updatedAt: '2023-05-12T11:30:00.000Z',
    lastSent: '2023-08-18T16:23:00.000Z',
    characterCount: 121,
    variables: ['heure'],
    performance: {
      delivered: 392,
      failed: 8,
      responses: 41,
      conversions: 27
    },
    status: 'active'
  },
  {
    _id: 'sms-3',
    name: 'Notification de livraison',
    content: 'Bonjour {{nom}}, votre commande #{{numero}} sera livrée aujourd\'hui entre {{heure_debut}} et {{heure_fin}}. Un technicien vous contactera 30min avant son arrivée.',
    description: 'SMS de notification le jour de la livraison/installation.',
    category: 'Notification',
    tags: ['livraison', 'installation'],
    createdAt: '2023-03-05T14:20:00.000Z',
    updatedAt: '2023-07-18T10:05:00.000Z',
    characterCount: 158,
    variables: ['nom', 'numero', 'heure_debut', 'heure_fin'],
    status: 'active'
  },
  {
    _id: 'sms-4',
    name: 'Promotion pompes à chaleur',
    content: 'OFFRE SPÉCIALE: -15% sur toutes nos pompes à chaleur jusqu\'au {{date_fin}}! Prenez RDV pour une étude gratuite au 01 23 45 67 89 ou sur ecosolutions.fr',
    description: 'SMS promotionnel pour les pompes à chaleur.',
    category: 'Marketing',
    tags: ['promotion', 'campagne'],
    createdAt: '2023-04-10T11:45:00.000Z',
    updatedAt: '2023-08-01T09:30:00.000Z',
    characterCount: 151,
    variables: ['date_fin'],
    performance: {
      delivered: 1243,
      failed: 57,
      responses: 118,
      conversions: 42
    },
    status: 'draft'
  },
  {
    _id: 'sms-5',
    name: 'Suivi après installation',
    content: 'Bonjour {{nom}}, comment se passe votre nouvelle installation depuis 2 semaines? N\'hésitez pas à nous contacter pour toute question au 01 23 45 67 89. L\'équipe Eco Solutions',
    description: 'SMS de suivi envoyé 2 semaines après l\'installation.',
    category: 'Relance',
    tags: ['suivi', 'satisfaction'],
    createdAt: '2023-05-15T08:50:00.000Z',
    updatedAt: '2023-07-22T16:15:00.000Z',
    lastSent: '2023-08-10T10:40:00.000Z',
    characterCount: 167,
    variables: ['nom'],
    status: 'active'
  },
  {
    _id: 'sms-6',
    name: 'Rappel de maintenance',
    content: 'RAPPEL: La maintenance annuelle de votre installation est à prévoir. Contactez-nous au 01 23 45 67 89 pour programmer l\'intervention. L\'équipe Eco Solutions',
    description: 'SMS de rappel pour la maintenance annuelle.',
    category: 'Rappel',
    tags: ['maintenance', 'automatique'],
    createdAt: '2023-06-01T13:25:00.000Z',
    updatedAt: '2023-08-05T15:10:00.000Z',
    characterCount: 146,
    variables: [],
    status: 'active'
  },
  {
    _id: 'sms-7',
    name: 'Confirmation de devis',
    content: 'Bonjour {{nom}}, votre devis #{{numero}} est disponible dans votre espace client sur ecosolutions.fr. Il est valable jusqu\'au {{date_validite}}. Questions? 01 23 45 67 89',
    description: 'SMS envoyé lorsqu\'un devis est prêt.',
    category: 'Confirmation',
    tags: ['devis', 'automatique'],
    createdAt: '2023-07-05T09:40:00.000Z',
    updatedAt: '2023-08-03T14:55:00.000Z',
    characterCount: 162,
    variables: ['nom', 'numero', 'date_validite'],
    status: 'active'
  },
  {
    _id: 'sms-8',
    name: 'Alerte météo',
    content: 'ALERTE: Des températures extrêmes sont prévues dans votre région. Pensez à régler votre système pour optimiser votre confort et économies d\'énergie. Eco Solutions',
    description: 'SMS d\'alerte en cas de conditions météorologiques extrêmes.',
    category: 'Alerte',
    tags: ['météo', 'automatique'],
    createdAt: '2023-08-01T10:15:00.000Z',
    updatedAt: '2023-08-10T11:20:00.000Z',
    characterCount: 171,
    variables: [],
    status: 'draft'
  }
];

// Sample recipients data
const sampleRecipients: Recipient[] = [
  { _id: 'r1', name: 'Jean Dupont', phone: '06 12 34 56 78', group: 'Clients' },
  { _id: 'r2', name: 'Marie Martin', phone: '06 23 45 67 89', group: 'Clients' },
  { _id: 'r3', name: 'Pierre Durand', phone: '06 34 56 78 90', group: 'Prospects' },
  { _id: 'r4', name: 'Sophie Bernard', phone: '06 45 67 89 01', group: 'Clients' },
  { _id: 'r5', name: 'Lucas Petit', phone: '06 56 78 90 12', group: 'Prospects' },
  { _id: 'r6', name: 'Emma Leroy', phone: '06 67 89 01 23', group: 'Partenaires' },
  { _id: 'r7', name: 'Thomas Moreau', phone: '06 78 90 12 34', group: 'Clients' },
  { _id: 'r8', name: 'Camille Simon', phone: '06 89 01 23 45', group: 'Partenaires' },
  { _id: 'r9', name: 'Antoine Michel', phone: '06 90 12 34 56', group: 'Clients' },
  { _id: 'r10', name: 'Julie Robert', phone: '06 01 23 45 67', group: 'Prospects' }
];

// export default SmsModelsPage;