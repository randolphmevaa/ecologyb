"use client";
import Image from 'next/image';
import React, { useState, useEffect } from "react";
// import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/Header";
import {
  EnvelopeIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  UserGroupIcon,
  XMarkIcon,
  FunnelIcon,
  ChartBarIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  PaperAirplaneIcon,
  CogIcon,
  PlusIcon,
  Bars3BottomLeftIcon,
  PhotoIcon,
  LinkIcon,
  CalendarIcon,
  CursorArrowRaysIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
//   TagIcon,
  ShieldCheckIcon,
//   AtSymbolIcon,
//   BellAlertIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import { ChevronLeftIcon, SearchIcon, Copy, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

// Define email models types
type EmailModel = {
  _id: string;
  name: string;
  subject: string;
  description: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  lastSent?: string;
  performance?: {
    opens: number;
    clicks: number;
    responses: number;
    conversions: number;
  };
  content: {
    sections: EmailSection[];
  };
  status: 'draft' | 'active' | 'archived';
};

// Define more specific types for email section content
type HeaderContent = {
  text: string;
  size: 'h1' | 'h2' | 'h3';
  alignment: 'left' | 'center' | 'right';
};

type TextContent = {
  text: string;
};

type ImageContent = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type ButtonContent = {
  text: string;
  url: string;
};

type DividerContent = Record<string, never>;

type SpacerContent = {
  height: number;
};

type ColumnItem = {
  text: string;
};

type ColumnsContent = {
  columns: ColumnItem[];
};

// Union type for all possible content types
type SectionContent = 
  | HeaderContent
  | TextContent
  | ImageContent
  | ButtonContent
  | DividerContent
  | SpacerContent
  | ColumnsContent;

// Define more specific types for section settings
type CommonSettings = {
  backgroundColor: string;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
};

type HeaderSettings = CommonSettings & {
  color: string;
  fontFamily: string;
  fontSize: number;
  alignment: 'left' | 'center' | 'right';
  fontWeight: string;
};

type TextSettings = CommonSettings & {
  color: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  alignment: 'left' | 'center' | 'right';
};

type ImageSettings = CommonSettings & {
  alignment: 'left' | 'center' | 'right';
  borderRadius: number;
  shadow: boolean;
};

type ButtonSettings = CommonSettings & {
  color: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  alignment: 'left' | 'center' | 'right';
  borderRadius: number;
  width: string;
};

type DividerSettings = CommonSettings & {
  color: string;
  thickness: number;
  style: 'solid' | 'dashed' | 'dotted';
};

type SpacerSettings = {
  height: number;
};

type ColumnsSettings = CommonSettings & {
  columnsCount: number;
  gap: number;
  responsiveBreakpoint: 'mobile' | 'tablet' | 'desktop';
};

// Union type for all possible settings types
type SectionSettings = 
  | HeaderSettings
  | TextSettings
  | ImageSettings
  | ButtonSettings
  | DividerSettings
  | SpacerSettings
  | ColumnsSettings;

// Define types for data parameter in updateSection
type UpdateSectionData = Partial<SectionContent> | Partial<SectionSettings>;

// Define the return type for getDefaultContentByType
type DefaultContentReturn = SectionContent;

// Define the return type for getDefaultSettingsByType
type DefaultSettingsReturn = SectionSettings;


type EmailSection = {
  id: string;
  type: 'header' | 'text' | 'image' | 'button' | 'divider' | 'spacer' | 'columns';
  content: SectionContent;
  settings: SectionSettings;
};

// Define recipient type
type Recipient = {
  _id: string;
  name: string;
  email: string;
  group?: string;
};

export default function EmailModelsPage() {
  // State for email models
  const [emailModels, setEmailModels] = useState<EmailModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedModel, setSelectedModel] = useState<EmailModel | null>(null);
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
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showSectionMenu, setShowSectionMenu] = useState<boolean>(false);
  const [editorContent, setEditorContent] = useState<EmailSection[]>([]);
  
  // Email sending state
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [sendingStatus, setSendingStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [sendSubject, setSendSubject] = useState<string>("");
  const [sendFromName, setSendFromName] = useState<string>("Eco Solutions");
  const [sendFromEmail, setSendFromEmail] = useState<string>("contact@ecosolutions.fr");
  const [sendReplyTo, setSendReplyTo] = useState<string>("support@ecosolutions.fr");

  // Fetch email models
  const fetchEmailModels = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setEmailModels(sampleEmailModels);
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
    fetchEmailModels();
    fetchRecipients();
  }, []);

  // Start editing model
  const handleEditModel = (model: EmailModel) => {
    setSelectedModel(model);
    // Make sure sections are properly typed
    setEditorContent(model.content.sections);
    setEditMode(true);
    setPreviewMode(false);
    setSendMode(false);
  };

  // Create new model
  const handleCreateModel = () => {
    const newModel: EmailModel = {
      _id: `model-${Date.now()}`,
      name: "Nouveau modèle",
      subject: "Sujet de l'email",
      description: "Description du modèle",
      category: "Générique",
      tags: ["nouveau"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: {
        sections: []
      },
      status: 'draft'
    };
    setSelectedModel(newModel);
    setEditorContent([]);
    setEditMode(true);
    setPreviewMode(false);
    setSendMode(false);
  };

  // Handle preview mode
  const handlePreviewModel = (model: EmailModel) => {
    setSelectedModel(model);
    setEditorContent(model.content.sections);
    setPreviewMode(true);
    setEditMode(false);
    setSendMode(false);
  };
  
  // Handle send mode
  const handleSendModel = (model: EmailModel) => {
    setSelectedModel(model);
    setEditorContent(model.content.sections);
    setSendSubject(model.subject);
    setSendMode(true);
    setEditMode(false);
    setPreviewMode(false);
  };

  // Add new section to email model
  const addSection = (type: string) => {
    const newSection: EmailSection = {
      id: `section-${Date.now()}`,
      type: type as 'header' | 'text' | 'image' | 'button' | 'divider' | 'spacer' | 'columns',
      content: getDefaultContentByType(type),
      settings: getDefaultSettingsByType(type) as SectionSettings
    };
    
    setEditorContent([...editorContent, newSection]);
    setActiveSection(newSection.id);
    setShowSectionMenu(false);
  };

  // Get default content based on section type
  const getDefaultContentByType = (type: string): DefaultContentReturn => {
    switch(type) {
      case 'header':
        return { 
          text: "Titre principal", 
          size: "h1", 
          alignment: "center" 
        } as HeaderContent;
      case 'text':
        return { 
          text: "Insérez votre texte ici. Vous pouvez modifier le style, la taille et l'alignement." 
        } as TextContent;
      case 'image':
        return { 
          src: "/api/placeholder/600/300", 
          alt: "Image", 
          width: 600, 
          height: 300 
        } as ImageContent;
      case 'button':
        return { 
          text: "Cliquez ici", 
          url: "#" 
        } as ButtonContent;
      case 'divider':
        return {} as DividerContent;
      case 'spacer':
        return { 
          height: 20 
        } as SpacerContent;
      case 'columns':
        return { 
          columns: [
            { text: "Première colonne" },
            { text: "Deuxième colonne" }
          ]
        } as ColumnsContent;
      default:
        return {} as SectionContent;
    }
  };

  // Get default settings based on section type
  const getDefaultSettingsByType = (type: string): DefaultSettingsReturn => {
    const commonSettings = {
      backgroundColor: "transparent",
      padding: { top: 20, right: 20, bottom: 20, left: 20 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    };
    
    switch(type) {
      case 'header':
        return {
          ...commonSettings,
          color: "#213f5b",
          fontFamily: "Arial, sans-serif",
          fontSize: 28,
          alignment: "center",
          fontWeight: "bold",
        } as HeaderSettings;
      case 'text':
        return {
          ...commonSettings,
          color: "#333333",
          fontFamily: "Arial, sans-serif",
          fontSize: 16,
          lineHeight: 1.5,
          alignment: "left",
        } as TextSettings;
      case 'image':
        return {
          ...commonSettings,
          alignment: "center",
          borderRadius: 0,
          shadow: false,
        } as ImageSettings;
      case 'button':
        return {
          ...commonSettings,
          backgroundColor: "#4facfe",
          color: "#FFFFFF",
          fontFamily: "Arial, sans-serif",
          fontSize: 16,
          fontWeight: "bold",
          alignment: "center",
          borderRadius: 4,
          width: "auto",
        } as ButtonSettings;
      case 'divider':
        return {
          ...commonSettings,
          color: "#E0E0E0",
          thickness: 1,
          style: "solid",
        } as DividerSettings;
      case 'spacer':
        return {
          height: 20,
        } as SpacerSettings;
      case 'columns':
        return {
          ...commonSettings,
          columnsCount: 2,
          gap: 20,
          responsiveBreakpoint: "mobile",
        } as ColumnsSettings;
      default:
        return commonSettings as SectionSettings;
    }
  };

  // Update section content or settings
  const updateSection = (sectionId: string, data: UpdateSectionData, isSettings = false) => {
    const updatedContent = editorContent.map(section => {
      if (section.id === sectionId) {
        if (isSettings) {
          // For settings, we need to ensure type compatibility
          const updatedSettings = { ...section.settings, ...data };
          return { 
            ...section, 
            settings: updatedSettings as SectionSettings 
          };
        } else {
          // For content, we need to ensure type compatibility based on section type
          const updatedContent = { ...section.content, ...data };
          return { 
            ...section, 
            content: updatedContent as SectionContent
          };
        }
      }
      return section;
    });
    
    setEditorContent(updatedContent);
  };

  // Delete section
  const deleteSection = (sectionId: string) => {
    const updatedContent = editorContent.filter(section => section.id !== sectionId);
    setEditorContent(updatedContent);
    setActiveSection(null);
  };

  // Move section up or down
  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const index = editorContent.findIndex(section => section.id === sectionId);
    if (index === -1) return;
    
    if (direction === 'up' && index > 0) {
      const newContent = [...editorContent];
      [newContent[index], newContent[index - 1]] = [newContent[index - 1], newContent[index]];
      setEditorContent(newContent);
    } else if (direction === 'down' && index < editorContent.length - 1) {
      const newContent = [...editorContent];
      [newContent[index], newContent[index + 1]] = [newContent[index + 1], newContent[index]];
      setEditorContent(newContent);
    }
  };

  // Duplicate section
  const duplicateSection = (sectionId: string) => {
    const sectionToDuplicate = editorContent.find(section => section.id === sectionId);
    if (!sectionToDuplicate) return;
    
    const duplicatedSection = {
      ...sectionToDuplicate,
      id: `section-${Date.now()}`,
    };
    
    const index = editorContent.findIndex(section => section.id === sectionId);
    const newContent = [...editorContent];
    newContent.splice(index + 1, 0, duplicatedSection);
    setEditorContent(newContent);
  };

  // Save model
  const saveModel = () => {
    if (!selectedModel) return;
    
    const updatedModel = {
      ...selectedModel,
      content: { sections: editorContent },
      updatedAt: new Date().toISOString()
    };
    
    // Update models list
    setEmailModels(models => 
      models.map(model => 
        model._id === updatedModel._id ? updatedModel : model
      )
    );
    
    // Exit edit mode
    setEditMode(false);
    setSelectedModel(null);
    setActiveSection(null);
  };
  
  // Send email handler
  const handleSendEmail = () => {
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
  const filteredModels = emailModels.filter(model => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      model.name.toLowerCase().includes(query) ||
      model.description.toLowerCase().includes(query) ||
      model.subject.toLowerCase().includes(query);

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
  const totalModelsCount = emailModels.length;
  const activeModelsCount = emailModels.filter(model => model.status === 'active').length;
  const draftModelsCount = emailModels.filter(model => model.status === 'draft').length;
  const categoryCounts = emailModels.reduce((acc, model) => {
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

  // Render email preview based on sections
  const renderEmailPreview = () => {
    return editorContent.map((section) => {
      switch(section.type) {
        case 'header': {
          const content = section.content as HeaderContent;
          const settings = section.settings as HeaderSettings;
          return (
            <div 
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`email-section relative group ${activeSection === section.id ? 'ring-2 ring-[#4facfe]' : ''}`}
              style={{
                padding: `${settings.padding.top}px ${settings.padding.right}px ${settings.padding.bottom}px ${settings.padding.left}px`,
                margin: `${settings.margin.top}px ${settings.margin.right}px ${settings.margin.bottom}px ${settings.margin.left}px`,
                backgroundColor: settings.backgroundColor,
                textAlign: settings.alignment,
              }}
            >
              <h1 
                style={{
                  color: settings.color,
                  fontFamily: settings.fontFamily,
                  fontSize: `${settings.fontSize}px`,
                  fontWeight: settings.fontWeight,
                }}
              >
                {content.text}
              </h1>
              {renderSectionToolbar(section)}
            </div>
          );
        }
        
        case 'text': {
          const content = section.content as TextContent;
          const settings = section.settings as TextSettings;
          return (
            <div 
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`email-section relative group ${activeSection === section.id ? 'ring-2 ring-[#4facfe]' : ''}`}
              style={{
                padding: `${settings.padding.top}px ${settings.padding.right}px ${settings.padding.bottom}px ${settings.padding.left}px`,
                margin: `${settings.margin.top}px ${settings.margin.right}px ${settings.margin.bottom}px ${settings.margin.left}px`,
                backgroundColor: settings.backgroundColor,
                textAlign: settings.alignment,
              }}
            >
              <p
                style={{
                  color: settings.color,
                  fontFamily: settings.fontFamily,
                  fontSize: `${settings.fontSize}px`,
                  lineHeight: settings.lineHeight,
                }}
              >
                {content.text}
              </p>
              {renderSectionToolbar(section)}
            </div>
          );
        }
        
        case 'image': {
          const content = section.content as ImageContent;
          const settings = section.settings as ImageSettings;
          return (
            <div 
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`email-section relative group ${activeSection === section.id ? 'ring-2 ring-[#4facfe]' : ''}`}
              style={{
                padding: `${settings.padding.top}px ${settings.padding.right}px ${settings.padding.bottom}px ${settings.padding.left}px`,
                margin: `${settings.margin.top}px ${settings.margin.right}px ${settings.margin.bottom}px ${settings.margin.left}px`,
                backgroundColor: settings.backgroundColor,
                textAlign: settings.alignment,
              }}
            >
              <Image
                src={content.src}
                alt={content.alt}
                width={content.width || 600}
                height={content.height || 300}
                style={{
                  borderRadius: `${settings.borderRadius}px`,
                  boxShadow: settings.shadow ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
                  display: 'inline-block',
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
              {renderSectionToolbar(section)}
            </div>
          );
        }
        
        case 'button': {
          const content = section.content as ButtonContent;
          const settings = section.settings as ButtonSettings;
          return (
            <div 
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`email-section relative group ${activeSection === section.id ? 'ring-2 ring-[#4facfe]' : ''}`}
              style={{
                padding: `${settings.padding.top}px ${settings.padding.right}px ${settings.padding.bottom}px ${settings.padding.left}px`,
                margin: `${settings.margin.top}px ${settings.margin.right}px ${settings.margin.bottom}px ${settings.margin.left}px`,
                backgroundColor: settings.backgroundColor,
                textAlign: settings.alignment,
              }}
            >
              <button
                className="cursor-pointer"
                style={{
                  backgroundColor: settings.backgroundColor,
                  color: settings.color,
                  fontFamily: settings.fontFamily,
                  fontSize: `${settings.fontSize}px`,
                  fontWeight: settings.fontWeight,
                  borderRadius: `${settings.borderRadius}px`,
                  padding: '12px 24px',
                  display: 'inline-block',
                  textDecoration: 'none',
                  border: 'none',
                }}
              >
                {content.text}
              </button>
              {renderSectionToolbar(section)}
            </div>
          );
        }
        
        case 'divider': {
          const settings = section.settings as DividerSettings;
          return (
            <div 
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`email-section relative group ${activeSection === section.id ? 'ring-2 ring-[#4facfe]' : ''}`}
              style={{
                padding: `${settings.padding.top}px ${settings.padding.right}px ${settings.padding.bottom}px ${settings.padding.left}px`,
                margin: `${settings.margin.top}px ${settings.margin.right}px ${settings.margin.bottom}px ${settings.margin.left}px`,
                backgroundColor: settings.backgroundColor,
              }}
            >
              <hr
                style={{
                  borderTop: `${settings.thickness}px ${settings.style} ${settings.color}`,
                  margin: '0',
                }}
              />
              {renderSectionToolbar(section)}
            </div>
          );
        }
        
        case 'spacer': {
          const settings = section.settings as SpacerSettings;
          return (
            <div 
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`email-section relative group ${activeSection === section.id ? 'ring-2 ring-[#4facfe]' : ''}`}
            >
              <div style={{ height: `${settings.height}px` }}></div>
              {renderSectionToolbar(section)}
            </div>
          );
        }
        
        case 'columns': {
          const content = section.content as ColumnsContent;
          const settings = section.settings as ColumnsSettings;
          return (
            <div 
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`email-section relative group ${activeSection === section.id ? 'ring-2 ring-[#4facfe]' : ''}`}
              style={{
                padding: `${settings.padding.top}px ${settings.padding.right}px ${settings.padding.bottom}px ${settings.padding.left}px`,
                margin: `${settings.margin.top}px ${settings.margin.right}px ${settings.margin.bottom}px ${settings.margin.left}px`,
                backgroundColor: settings.backgroundColor,
              }}
            >
              <div 
                className="grid gap-4"
                style={{ 
                  gridTemplateColumns: `repeat(${settings.columnsCount}, 1fr)`,
                  gap: `${settings.gap}px`,
                }}
              >
                {content.columns.map((column: ColumnItem, index: number) => (
                  <div key={index} className="column">
                    <p>{column.text}</p>
                  </div>
                ))}
              </div>
              {renderSectionToolbar(section)}
            </div>
          );
        }
        
        default:
          return null;
      }
    });
  };

  // Render section toolbar for editor
  const renderSectionToolbar = (section: EmailSection) => {
    if (!editMode || activeSection !== section.id) return null;
    
    return (
      <div className="absolute top-0 right-0 bg-white shadow-md rounded-md flex items-center p-1 z-10">
        <button 
          onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'up'); }}
          className="p-1 text-gray-600 hover:text-[#4facfe] hover:bg-[#4facfe]/10 rounded"
          title="Déplacer vers le haut"
        >
          <ChevronLeftIcon className="h-4 w-4 rotate-90" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'down'); }}
          className="p-1 text-gray-600 hover:text-[#4facfe] hover:bg-[#4facfe]/10 rounded"
          title="Déplacer vers le bas"
        >
          <ChevronRightIcon className="h-4 w-4 rotate-90" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); duplicateSection(section.id); }}
          className="p-1 text-gray-600 hover:text-[#4facfe] hover:bg-[#4facfe]/10 rounded"
          title="Dupliquer"
        >
          <Copy className="h-4 w-4" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
          className="p-1 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded"
          title="Supprimer"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    );
  };

  // Render section editor
  const renderSectionEditor = () => {
    if (!activeSection) return null;
    
    const section = editorContent.find(s => s.id === activeSection);
    if (!section) return null;
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-[#213f5b] border-b pb-2 mb-4">
          Éditer {getSectionTypeLabel(section.type)}
        </h3>
        
        {section.type === 'header' && (() => {
          const content = section.content as HeaderContent;
          const settings = section.settings as HeaderSettings;
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texte</label>
                <input
                  type="text"
                  value={content.text}
                  onChange={(e) => updateSection(section.id, { text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taille</label>
                <select
                  value={content.size}
                  onChange={(e) => updateSection(section.id, { size: e.target.value as 'h1' | 'h2' | 'h3' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                >
                  <option value="h1">Grand (H1)</option>
                  <option value="h2">Moyen (H2)</option>
                  <option value="h3">Petit (H3)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
                <input
                  type="color"
                  value={settings.color}
                  onChange={(e) => updateSection(section.id, { color: e.target.value }, true)}
                  className="w-full h-10 p-1 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alignement</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateSection(section.id, { alignment: 'left' }, true)}
                    className={`p-2 rounded ${settings.alignment === 'left' ? 'bg-[#4facfe]/20 text-[#4facfe]' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <AlignLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => updateSection(section.id, { alignment: 'center' }, true)}
                    className={`p-2 rounded ${settings.alignment === 'center' ? 'bg-[#4facfe]/20 text-[#4facfe]' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <AlignCenter className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => updateSection(section.id, { alignment: 'right' }, true)}
                    className={`p-2 rounded ${settings.alignment === 'right' ? 'bg-[#4facfe]/20 text-[#4facfe]' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <AlignRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
        
        {section.type === 'text' && (() => {
          const content = section.content as TextContent;
          const settings = section.settings as TextSettings;
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texte</label>
                <textarea
                  value={content.text}
                  onChange={(e) => updateSection(section.id, { text: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
                <input
                  type="color"
                  value={settings.color}
                  onChange={(e) => updateSection(section.id, { color: e.target.value }, true)}
                  className="w-full h-10 p-1 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taille de police</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="12"
                    max="32"
                    value={settings.fontSize}
                    onChange={(e) => updateSection(section.id, { fontSize: parseInt(e.target.value) }, true)}
                    className="flex-1"
                  />
                  <span className="w-8 text-sm text-gray-600">{settings.fontSize}px</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alignement</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateSection(section.id, { alignment: 'left' }, true)}
                    className={`p-2 rounded ${settings.alignment === 'left' ? 'bg-[#4facfe]/20 text-[#4facfe]' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <AlignLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => updateSection(section.id, { alignment: 'center' }, true)}
                    className={`p-2 rounded ${settings.alignment === 'center' ? 'bg-[#4facfe]/20 text-[#4facfe]' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <AlignCenter className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => updateSection(section.id, { alignment: 'right' }, true)}
                    className={`p-2 rounded ${settings.alignment === 'right' ? 'bg-[#4facfe]/20 text-[#4facfe]' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <AlignRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
        
        {section.type === 'image' && (() => {
          const content = section.content as ImageContent;
          const settings = section.settings as ImageSettings;
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de l&apos;image</label>
                <input
                  type="text"
                  value={content.src}
                  onChange={(e) => updateSection(section.id, { src: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texte alternatif</label>
                <input
                  type="text"
                  value={content.alt}
                  onChange={(e) => updateSection(section.id, { alt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rayon de bordure</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={settings.borderRadius}
                    onChange={(e) => updateSection(section.id, { borderRadius: parseInt(e.target.value) }, true)}
                    className="flex-1"
                  />
                  <span className="w-8 text-sm text-gray-600">{settings.borderRadius}px</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="shadow"
                  checked={settings.shadow}
                  onChange={(e) => updateSection(section.id, { shadow: e.target.checked }, true)}
                  className="h-4 w-4 text-[#4facfe] rounded focus:ring-[#4facfe]"
                />
                <label htmlFor="shadow" className="text-sm font-medium text-gray-700">Ajouter une ombre</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alignement</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateSection(section.id, { alignment: 'left' }, true)}
                    className={`p-2 rounded ${settings.alignment === 'left' ? 'bg-[#4facfe]/20 text-[#4facfe]' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <AlignLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => updateSection(section.id, { alignment: 'center' }, true)}
                    className={`p-2 rounded ${settings.alignment === 'center' ? 'bg-[#4facfe]/20 text-[#4facfe]' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <AlignCenter className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => updateSection(section.id, { alignment: 'right' }, true)}
                    className={`p-2 rounded ${settings.alignment === 'right' ? 'bg-[#4facfe]/20 text-[#4facfe]' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <AlignRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
        
        {section.type === 'button' && (() => {
          const content = section.content as ButtonContent;
          const settings = section.settings as ButtonSettings;
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texte du bouton</label>
                <input
                  type="text"
                  value={content.text}
                  onChange={(e) => updateSection(section.id, { text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="text"
                  value={content.url}
                  onChange={(e) => updateSection(section.id, { url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Couleur d&apos;arrière-plan</label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => updateSection(section.id, { backgroundColor: e.target.value }, true)}
                  className="w-full h-10 p-1 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Couleur du texte</label>
                <input
                  type="color"
                  value={settings.color}
                  onChange={(e) => updateSection(section.id, { color: e.target.value }, true)}
                  className="w-full h-10 p-1 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rayon de bordure</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={settings.borderRadius}
                    onChange={(e) => updateSection(section.id, { borderRadius: parseInt(e.target.value) }, true)}
                    className="flex-1"
                  />
                  <span className="w-8 text-sm text-gray-600">{settings.borderRadius}px</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alignement</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateSection(section.id, { alignment: 'left' }, true)}
                    className={`p-2 rounded ${settings.alignment === 'left' ? 'bg-[#4facfe]/20 text-[#4facfe]' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <AlignLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => updateSection(section.id, { alignment: 'center' }, true)}
                    className={`p-2 rounded ${settings.alignment === 'center' ? 'bg-[#4facfe]/20 text-[#4facfe]' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <AlignCenter className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => updateSection(section.id, { alignment: 'right' }, true)}
                    className={`p-2 rounded ${settings.alignment === 'right' ? 'bg-[#4facfe]/20 text-[#4facfe]' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <AlignRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
        
        {section.type === 'divider' && (() => {
          const settings = section.settings as DividerSettings;
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
                <input
                  type="color"
                  value={settings.color}
                  onChange={(e) => updateSection(section.id, { color: e.target.value }, true)}
                  className="w-full h-10 p-1 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Épaisseur</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={settings.thickness}
                    onChange={(e) => updateSection(section.id, { thickness: parseInt(e.target.value) }, true)}
                    className="flex-1"
                  />
                  <span className="w-8 text-sm text-gray-600">{settings.thickness}px</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                <select
                  value={settings.style}
                  onChange={(e) => updateSection(section.id, { style: e.target.value as 'solid' | 'dashed' | 'dotted' }, true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                >
                  <option value="solid">Solide</option>
                  <option value="dashed">Tirets</option>
                  <option value="dotted">Pointillés</option>
                </select>
              </div>
            </div>
          );
        })()}
        
        {section.type === 'spacer' && (() => {
          const settings = section.settings as SpacerSettings;
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hauteur</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={settings.height}
                    onChange={(e) => updateSection(section.id, { height: parseInt(e.target.value) }, true)}
                    className="flex-1"
                  />
                  <span className="w-8 text-sm text-gray-600">{settings.height}px</span>
                </div>
              </div>
            </div>
          );
        })()}
        
        {section.type === 'columns' && (() => {
          const content = section.content as ColumnsContent;
          const settings = section.settings as ColumnsSettings;
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de colonnes</label>
                <select
                  value={settings.columnsCount}
                  onChange={(e) => {
                    const count = parseInt(e.target.value);
                    const currentColumns = [...(content.columns || [])];
                    let newColumns = [...currentColumns];
                    
                    if (count > currentColumns.length) {
                      // Add more columns
                      for (let i = currentColumns.length; i < count; i++) {
                        newColumns.push({ text: `Colonne ${i+1}` });
                      }
                    } else if (count < currentColumns.length) {
                      // Remove columns
                      newColumns = currentColumns.slice(0, count);
                    }
                    
                    updateSection(section.id, { columnsCount: count }, true);
                    updateSection(section.id, { columns: newColumns });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                >
                  <option value="2">2 colonnes</option>
                  <option value="3">3 colonnes</option>
                  <option value="4">4 colonnes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Espacement entre colonnes</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={settings.gap}
                    onChange={(e) => updateSection(section.id, { gap: parseInt(e.target.value) }, true)}
                    className="flex-1"
                  />
                  <span className="w-8 text-sm text-gray-600">{settings.gap}px</span>
                </div>
              </div>
              <div className="space-y-3 border-t pt-3 mt-4">
                <h4 className="font-medium text-sm text-gray-700">Contenu des colonnes</h4>
                {content.columns.map((column: ColumnItem, index: number) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Colonne {index + 1}
                    </label>
                    <textarea
                      value={column.text}
                      onChange={(e) => {
                        const newColumns = [...content.columns];
                        newColumns[index].text = e.target.value;
                        updateSection(section.id, { columns: newColumns });
                      }}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    );
  };

  // Get section type label
  const getSectionTypeLabel = (type: string) => {
    switch(type) {
      case 'header': return 'Titre';
      case 'text': return 'Texte';
      case 'image': return 'Image';
      case 'button': return 'Bouton';
      case 'divider': return 'Séparateur';
      case 'spacer': return 'Espacement';
      case 'columns': return 'Colonnes';
      default: return type;
    }
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
            Chargement des modèles d&apos;email...
          </p>
        </div>
      </div>
    );
  }

  // Render section add menu
  const renderSectionAddMenu = () => {
    if (!showSectionMenu) return null;
    
    const sectionTypes = [
      { type: 'header', label: 'Titre', icon: <Bars3BottomLeftIcon className="h-5 w-5" /> },
      { type: 'text', label: 'Texte', icon: <AlignLeft className="h-5 w-5" /> },
      { type: 'image', label: 'Image', icon: <PhotoIcon className="h-5 w-5" /> },
      { type: 'button', label: 'Bouton', icon: <CursorArrowRaysIcon className="h-5 w-5" /> },
      { type: 'divider', label: 'Séparateur', icon: <LinkIcon className="h-5 w-5 rotate-90" /> },
      { type: 'spacer', label: 'Espacement', icon: <CalendarIcon className="h-5 w-5" /> },
      { type: 'columns', label: 'Colonnes', icon: <FunnelIcon className="h-5 w-5 rotate-90" /> },
    ];
    
    return (
      <div className="absolute left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg z-20 p-2 grid grid-cols-4 gap-2 w-96 border border-[#4facfe]/20">
        {sectionTypes.map((item) => (
          <button
            key={item.type}
            onClick={() => addSection(item.type)}
            className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-[#4facfe]/10 transition-colors"
          >
            <div className="bg-[#213f5b]/5 rounded-full p-2 mb-2">
              {item.icon}
            </div>
            <span className="text-xs font-medium text-gray-700">{item.label}</span>
          </button>
        ))}
      </div>
    );
  };

  // Editor, Preview or Send mode
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
                        {editMode && "Éditeur de modèle"}
                        {previewMode && "Aperçu du modèle"}
                        {sendMode && "Envoyer un email"}
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
                            setSendSubject(selectedModel?.subject || "");
                          }}
                          className="px-4 py-2 rounded-lg bg-[#4facfe] text-white hover:bg-[#4facfe]/90 flex items-center"
                        >
                          <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                          Envoyer l&apos;email
                        </button>
                      </>
                    )}
                    
                    {sendMode && sendingStatus === 'idle' && (
                      <button
                        onClick={handleSendEmail}
                        disabled={selectedRecipients.length === 0}
                        className={`px-4 py-2 rounded-lg bg-[#4facfe] text-white hover:bg-[#4facfe]/90 flex items-center ${
                          selectedRecipients.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                        {scheduledDate ? 'Programmer l\'envoi' : 'Envoyer maintenant'}
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
                        Email envoyé avec succès
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
            
            {/* Editor/Preview/Send Area */}
            <div className="h-full overflow-auto relative">
              <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {/* Edit Mode */}
                {editMode && (
                  <div className="flex gap-6 h-full">
                    {/* Email Canvas */}
                    <div className="w-3/5 bg-gray-100 rounded-lg p-4 overflow-y-auto">
                      {/* Email Header Info */}
                      <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du modèle</label>
                            <input
                              type="text"
                              value={selectedModel?.name || ''}
                              onChange={(e) => setSelectedModel(prev => prev ? {...prev, name: e.target.value} : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sujet de l&apos;email</label>
                            <input
                              type="text"
                              value={selectedModel?.subject || ''}
                              onChange={(e) => setSelectedModel(prev => prev ? {...prev, subject: e.target.value} : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                            <select
                              value={selectedModel?.category || ''}
                              onChange={(e) => setSelectedModel(prev => prev ? {...prev, category: e.target.value} : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                            >
                              <option value="Générique">Générique</option>
                              <option value="Marketing">Marketing</option>
                              <option value="Notification">Notification</option>
                              <option value="Confirmation">Confirmation</option>
                              <option value="Bienvenue">Bienvenue</option>
                              <option value="Relance">Relance</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      {/* Email Content Preview */}
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden relative">
                        {/* Preview Header */}
                        <div className="bg-[#f5f5f5] p-3 border-b border-gray-200 flex items-center">
                          <div className="flex space-x-2 mr-4">
                            <div className="w-3 h-3 bg-[#ff6057] rounded-full"></div>
                            <div className="w-3 h-3 bg-[#ffbd2e] rounded-full"></div>
                            <div className="w-3 h-3 bg-[#27c940] rounded-full"></div>
                          </div>
                          <div className="flex-1 text-center">
                            <span className="text-xs text-gray-500">Aperçu du modèle</span>
                          </div>
                        </div>
                        
                        {/* Email Content */}
                        <div className="p-6">
                          {editorContent.length === 0 ? (
                            <div className="text-center py-8">
                              <div className="bg-[#f5f5f5] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <EnvelopeIcon className="h-8 w-8 text-gray-400" />
                              </div>
                              <h3 className="text-lg text-gray-700 font-medium">Modèle vide</h3>
                              <p className="text-sm text-gray-500 mt-1 mb-4">
                                Commencez par ajouter une section pour créer votre modèle.
                              </p>
                              <button
                                onClick={() => setShowSectionMenu(!showSectionMenu)}
                                className="px-4 py-2 rounded-lg bg-[#4facfe] text-white hover:bg-[#4facfe]/90 inline-flex items-center"
                              >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Ajouter une section
                              </button>
                            </div>
                          ) : (
                            <div className="email-preview">
                              {renderEmailPreview()}
                            </div>
                          )}
                        </div>
                        
                        {/* Add Section Button */}
                        {editorContent.length > 0 && (
                          <div className="flex justify-center p-4 border-t border-gray-200 relative">
                            <button
                              onClick={() => setShowSectionMenu(!showSectionMenu)}
                              className="px-4 py-2 rounded-lg bg-[#f0f9ff] text-[#4facfe] border border-[#4facfe]/30 hover:bg-[#4facfe]/10 inline-flex items-center"
                            >
                              <PlusIcon className="h-4 w-4 mr-2" />
                              Ajouter une section
                            </button>
                            {showSectionMenu && renderSectionAddMenu()}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Section Editor */}
                    <div className="w-2/5 overflow-y-auto">
                      {activeSection ? (
                        renderSectionEditor()
                      ) : (
                        <div className="bg-white p-4 rounded-lg shadow-md h-64 flex flex-col items-center justify-center">
                          <div className="bg-[#f5f5f5] rounded-full p-3 mb-4">
                            <CogIcon className="h-6 w-6 text-gray-500" />
                          </div>
                          <h3 className="text-lg font-medium text-[#213f5b]">Paramètres d&apos;édition</h3>
                          <p className="text-sm text-gray-500 text-center mt-2">
                            Sélectionnez une section pour afficher ses options d&apos;édition
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Preview Mode */}
                {previewMode && (
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                      <div className="bg-[#213f5b] p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <EnvelopeIcon className="h-5 w-5 text-white mr-2" />
                            <span className="text-white font-medium">{selectedModel?.subject}</span>
                          </div>
                          <div>
                            <span className="text-xs text-white/70">De: Eco Solutions &lt;contact@ecosolutions.fr&gt;</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 bg-white">
                        <div className="email-preview mb-4">
                          {renderEmailPreview()}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            <span>Créé le {formatDate(selectedModel?.createdAt || '')}</span>
                          </div>
                          <div className="flex items-center">
                            <UserGroupIcon className="h-4 w-4 mr-1" />
                            <span>Utilisé {selectedModel?.performance?.opens || 0} fois</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 bg-white rounded-lg shadow-md p-4">
                      <h3 className="text-lg font-medium text-[#213f5b] mb-4">Informations sur le modèle</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Nom</p>
                          <p className="text-gray-800">{selectedModel?.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Catégorie</p>
                          <p className="text-gray-800">{selectedModel?.category}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm font-medium text-gray-500">Description</p>
                          <p className="text-gray-800">{selectedModel?.description}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Statut</p>
                          <span 
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                              selectedModel?.status === 'active' ? 'bg-[#43e97b]/20 text-[#2a8a4a]' :
                              selectedModel?.status === 'draft' ? 'bg-[#f7b91b]/20 text-[#b07b0f]' :
                              'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {selectedModel?.status === 'active' ? 'Actif' :
                             selectedModel?.status === 'draft' ? 'Brouillon' :
                             'Archivé'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Dernière mise à jour</p>
                          <p className="text-gray-800">{formatDate(selectedModel?.updatedAt || '')}</p>
                        </div>
                      </div>
                      
                      {selectedModel?.performance && (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-500 mb-3">Statistiques de performance</h4>
                          <div className="grid grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg text-center">
                              <p className="text-xl font-bold text-[#4facfe]">{selectedModel.performance.opens}</p>
                              <p className="text-xs text-gray-500">Ouvertures</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg text-center">
                              <p className="text-xl font-bold text-[#43e97b]">{selectedModel.performance.clicks}</p>
                              <p className="text-xs text-gray-500">Clics</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg text-center">
                              <p className="text-xl font-bold text-[#f7b91b]">{selectedModel.performance.responses}</p>
                              <p className="text-xs text-gray-500">Réponses</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg text-center">
                              <p className="text-xl font-bold text-[#38c2de]">{selectedModel.performance.conversions}</p>
                              <p className="text-xs text-gray-500">Conversions</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Send Mode */}
                {sendMode && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Recipients */}
                    <div className="lg:col-span-2">
                      {/* Email Details */}
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                        <div className="p-4 border-b border-gray-100">
                          <h2 className="text-lg font-semibold text-[#213f5b]">Détails de l&apos;email</h2>
                        </div>
                        
                        <div className="p-4 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                            <input 
                              type="text"
                              value={sendSubject}
                              onChange={(e) => setSendSubject(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                              placeholder="Sujet de l'email"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">De (nom)</label>
                              <input 
                                type="text"
                                value={sendFromName}
                                onChange={(e) => setSendFromName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                                placeholder="Nom de l'expéditeur"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">De (email)</label>
                              <input 
                                type="email"
                                value={sendFromEmail}
                                onChange={(e) => setSendFromEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                                placeholder="email@domaine.com"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Répondre à</label>
                            <input 
                              type="email"
                              value={sendReplyTo}
                              onChange={(e) => setSendReplyTo(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4facfe] focus:border-[#4facfe]"
                              placeholder="repondre@domaine.com"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Recipients */}
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
                                placeholder="Rechercher par nom ou adresse email..."
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
                                      Email
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
                                        <div className="text-sm text-[#4facfe]">{recipient.email}</div>
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
                                <span className="text-sm font-medium text-gray-700">Activer le suivi des emails</span>
                              </label>
                              <p className="text-xs text-gray-500 mb-4">
                                Suivez les ouvertures, clics et réponses pour chaque email envoyé.
                              </p>
                              
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 text-[#4facfe] focus:ring-[#4facfe] border-gray-300 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">Inclure le lien de désinscription</span>
                              </label>
                              <p className="text-xs text-gray-500">
                                Ajouter automatiquement un lien de désinscription en bas de l&apos;email.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Column - Email Preview */}
                    <div className="lg:col-span-1">
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                        <div className="p-4 border-b border-gray-100">
                          <h2 className="text-lg font-semibold text-[#213f5b]">Aperçu de l&apos;email</h2>
                        </div>
                        
                        <div className="p-4">
                          <div className="bg-gray-100 rounded-lg p-3 relative mb-4">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#4facfe] flex items-center justify-center text-white font-bold text-sm">
                                {sendFromName.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-800">{sendSubject || selectedModel?.subject}</p>
                                <p className="text-xs text-gray-500">
                                  De: {sendFromName} &lt;{sendFromEmail}&gt;<br/>
                                  À: [Destinataires]
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                            <div className="email-preview text-sm">
                              {renderEmailPreview()}
                            </div>
                            
                            {/* Email Footer */}
                            <div className="mt-6 pt-3 border-t border-gray-200">
                              <p className="text-xs text-gray-500">
                                © {new Date().getFullYear()} Eco Solutions | <a href="#" className="text-[#4facfe]">Se désinscrire</a>
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4 bg-[#f9fafb] rounded-lg p-3">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Informations</h3>
                            <ul className="space-y-2 text-xs text-gray-600">
                              <li className="flex justify-between">
                                <span>Destinataires:</span>
                                <span className="font-medium">{selectedRecipients.length}</span>
                              </li>
                              <li className="flex justify-between">
                                <span>Modèle:</span>
                                <span className="font-medium">{selectedModel?.name}</span>
                              </li>
                              <li className="flex justify-between">
                                <span>Statut:</span>
                                <span className="font-medium">
                                  {scheduledDate ? 'Programmé' : 'Prêt à envoyer'}
                                </span>
                              </li>
                              {scheduledDate && (
                                <li className="flex justify-between">
                                  <span>Date d&apos;envoi:</span>
                                  <span className="font-medium">
                                    {new Date(scheduledDate).toLocaleString('fr-FR')}
                                  </span>
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-[#f5f5f5] border-t border-gray-200">
                          <div className="flex items-center text-sm text-gray-700">
                            <ShieldCheckIcon className="h-5 w-5 mr-2 text-[#4facfe]" />
                            <p>
                              Tous les emails sont envoyés en conformité avec le RGPD et les bonnes pratiques d&apos;emailing.
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

  // Main model listing view
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
<div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#4facfe]/10 -mt-32 -mr-32"></div>
<div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#4facfe]/5 -mb-40 -ml-40"></div>

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
  <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold text-white">Modèles d&apos;email</h1>
      <p className="mt-1 text-[#bfddf9]">
        Gérez vos modèles d&apos;email pour différentes campagnes et communications
      </p>
    </div>
    <div className="mt-4 md:mt-0">
      <button
        onClick={handleCreateModel}
        className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white px-4 py-2 rounded-lg font-medium flex items-center hover:shadow-md transition"
      >
        <PlusIcon className="h-5 w-5 mr-1.5" />
        Nouveau modèle
      </button>
    </div>
  </div>
</div>
</div>

{/* Stats Bar */}
<div className="w-full bg-white border-b border-gray-200 shadow-sm">
<div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="flex items-center">
      <div className="p-2 rounded-lg bg-[#f0f9ff]">
        <DocumentTextIcon className="h-6 w-6 text-[#4facfe]" />
      </div>
      <div className="ml-3">
        <p className="text-sm text-gray-500">Total des modèles</p>
        <p className="text-xl font-semibold text-[#213f5b]">{totalModelsCount}</p>
      </div>
    </div>
    <div className="flex items-center">
      <div className="p-2 rounded-lg bg-[#ecfdf5]">
        <CheckCircleIcon className="h-6 w-6 text-[#43e97b]" />
      </div>
      <div className="ml-3">
        <p className="text-sm text-gray-500">Modèles actifs</p>
        <p className="text-xl font-semibold text-[#213f5b]">{activeModelsCount}</p>
      </div>
    </div>
    <div className="flex items-center">
      <div className="p-2 rounded-lg bg-[#fffbeb]">
        <PencilSquareIcon className="h-6 w-6 text-[#f7b91b]" />
      </div>
      <div className="ml-3">
        <p className="text-sm text-gray-500">Brouillons</p>
        <p className="text-xl font-semibold text-[#213f5b]">{draftModelsCount}</p>
      </div>
    </div>
    <div className="flex items-center">
      <div className="p-2 rounded-lg bg-[#f3f4f6]">
        <ChartBarIcon className="h-6 w-6 text-[#a0a0a0]" />
      </div>
      <div className="ml-3">
        <p className="text-sm text-gray-500">Catégories</p>
        <p className="text-xl font-semibold text-[#213f5b]">
          {Object.keys(categoryCounts).length}
        </p>
      </div>
    </div>
  </div>
</div>
</div>

{/* Filters and Search */}
<div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
<div className="bg-white rounded-lg shadow-sm p-4 mb-6">
  <div className="flex flex-col md:flex-row justify-between gap-4">
    <div className="flex flex-1 gap-4 items-center">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Rechercher par nom, description ou sujet..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4facfe] focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="w-64">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4facfe] focus:border-transparent"
        >
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              {option === "Tous" ? "Toutes les catégories" : `Catégorie: ${option}`}
            </option>
          ))}
        </select>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">
        {filteredModels.length} modèle(s) trouvé(s)
      </span>
      <button
        onClick={() => {
          setFilter("Tous");
          setSearchQuery("");
        }}
        className="text-[#4facfe] flex items-center text-sm hover:text-[#00f2fe]"
      >
        <ArrowPathIcon className="h-4 w-4 mr-1" />
        Réinitialiser
      </button>
    </div>
  </div>
</div>

{/* Email Models Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
  {paginatedModels.length === 0 ? (
    <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm">
      <div className="p-4 rounded-full bg-[#f5f5f5] mb-4">
        <EnvelopeIcon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun modèle trouvé</h3>
      <p className="text-gray-500 text-center max-w-md mb-4">
        {searchQuery || filter !== "Tous"
          ? "Aucun modèle ne correspond à vos critères de recherche. Veuillez essayer d'autres filtres."
          : "Vous n'avez pas encore créé de modèles d'email. Créez votre premier modèle pour commencer."}
      </p>
      {searchQuery || filter !== "Tous" ? (
        <button
          onClick={() => {
            setFilter("Tous");
            setSearchQuery("");
          }}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
        >
          <ArrowPathIcon className="h-4 w-4 mr-1.5" />
          Réinitialiser les filtres
        </button>
      ) : (
        <button
          onClick={handleCreateModel}
          className="px-4 py-2 bg-[#4facfe] text-white rounded-lg hover:bg-[#4facfe]/90 flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-1.5" />
          Créer un modèle
        </button>
      )}
    </div>
  ) : (
    paginatedModels.map((model) => (
      <div
        key={model._id}
        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      >
        <div
          className={`h-2 ${getStatusColor(model.status)}`}
        ></div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-[#213f5b] truncate pr-2">
              {model.name}
            </h3>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                model.status === "active"
                  ? "bg-[#43e97b]/20 text-[#2a8a4a]"
                  : model.status === "draft"
                  ? "bg-[#f7b91b]/20 text-[#b07b0f]"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {model.status === "active"
                ? "Actif"
                : model.status === "draft"
                ? "Brouillon"
                : "Archivé"}
            </span>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {model.description || model.subject}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#213f5b]/10 text-[#213f5b]">
              {model.category}
            </span>
            {model.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#4facfe]/10 text-[#4facfe]"
              >
                {tag}
              </span>
            ))}
            {model.tags.length > 2 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                +{model.tags.length - 2}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center">
              <ClockIcon className="h-3.5 w-3.5 mr-1" />
              <span>{formatDate(model.updatedAt)}</span>
            </div>
            {model.lastSent && (
              <div className="flex items-center">
                <PaperAirplaneIcon className="h-3.5 w-3.5 mr-1" />
                <span>Envoyé {formatDate(model.lastSent)}</span>
              </div>
            )}
          </div>

          {model.performance && (
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="flex flex-col items-center p-1 bg-gray-50 rounded">
                <span className="text-xs text-gray-500">Vues</span>
                <span className="font-medium text-[#4facfe]">
                  {model.performance.opens}
                </span>
              </div>
              <div className="flex flex-col items-center p-1 bg-gray-50 rounded">
                <span className="text-xs text-gray-500">Clics</span>
                <span className="font-medium text-[#43e97b]">
                  {model.performance.clicks}
                </span>
              </div>
              <div className="flex flex-col items-center p-1 bg-gray-50 rounded">
                <span className="text-xs text-gray-500">Rép.</span>
                <span className="font-medium text-[#f7b91b]">
                  {model.performance.responses}
                </span>
              </div>
              <div className="flex flex-col items-center p-1 bg-gray-50 rounded">
                <span className="text-xs text-gray-500">Conv.</span>
                <span className="font-medium text-[#38c2de]">
                  {model.performance.conversions}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-2 border-t border-gray-100">
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditModel(model)}
                className="p-2 text-gray-600 hover:text-[#4facfe] hover:bg-[#4facfe]/10 rounded"
                title="Modifier"
              >
                <PencilSquareIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handlePreviewModel(model)}
                className="p-2 text-gray-600 hover:text-[#4facfe] hover:bg-[#4facfe]/10 rounded"
                title="Aperçu"
              >
                <EyeIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleSendModel(model)}
                className="p-2 text-gray-600 hover:text-[#4facfe] hover:bg-[#4facfe]/10 rounded"
                title="Envoyer"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={() => {
                // Delete model logic would go here
                // For now it just shows/hides this button as example
              }}
              className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded"
              title="Supprimer"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    ))
  )}
</div>

{/* Pagination */}
{totalPages > 1 && (
  <div className="flex justify-center mb-8">
    <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
      <button
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
          currentPage === 1
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-500 hover:bg-gray-50"
        }`}
      >
        <span className="sr-only">Précédent</span>
        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      
      {Array.from({ length: totalPages }).map((_, index) => {
        const pageNum = index + 1;
        const isCurrentPage = pageNum === currentPage;
        
        // Show a subset of pages with ellipsis for better UX
        if (
          pageNum === 1 ||
          pageNum === totalPages ||
          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
        ) {
          return (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                isCurrentPage
                  ? "z-10 bg-[#4facfe] border-[#4facfe] text-white"
                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {pageNum}
            </button>
          );
        }
        
        // Add ellipsis (but just once for consecutive hidden pages)
        if (
          (pageNum === 2 && currentPage > 3) ||
          (pageNum === totalPages - 1 && currentPage < totalPages - 2)
        ) {
          return (
            <span
              key={pageNum}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
            >
              ...
            </span>
          );
        }
        
        return null;
      })}
      
      <button
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
          currentPage === totalPages
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-500 hover:bg-gray-50"
        }`}
      >
        <span className="sr-only">Suivant</span>
        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </nav>
  </div>
)}
</div>
</main>
</div>
</div>
);
}

// Sample data for email models
const sampleEmailModels: EmailModel[] = [
{
_id: "model-1",
name: "Newsletter mensuelle",
subject: "Découvrez nos actualités du mois de mars",
description: "Modèle pour les newsletters mensuelles avec les dernières actualités",
category: "Marketing",
tags: ["newsletter", "mensuel", "actualités"],
createdAt: "2023-01-15T08:30:00Z",
updatedAt: "2023-03-20T14:45:00Z",
lastSent: "2023-03-21T09:15:00Z",
performance: {
  opens: 1342,
  clicks: 385,
  responses: 47,
  conversions: 18
},
content: {
  sections: []
},
status: 'active'
},
{
_id: "model-2",
name: "Email de bienvenue",
subject: "Bienvenue chez Eco Solutions !",
description: "Premier email envoyé aux nouveaux clients",
category: "Bienvenue",
tags: ["onboarding", "accueil"],
createdAt: "2022-11-05T10:20:00Z",
updatedAt: "2023-02-12T16:30:00Z",
performance: {
  opens: 2156,
  clicks: 1843,
  responses: 412,
  conversions: 352
},
content: {
  sections: []
},
status: 'active'
},
{
_id: "model-3",
name: "Confirmation de commande",
subject: "Votre commande a été confirmée",
description: "Email de confirmation après achat",
category: "Confirmation",
tags: ["commande", "transaction"],
createdAt: "2022-12-10T09:00:00Z",
updatedAt: "2023-01-25T11:20:00Z",
lastSent: "2023-03-25T16:45:00Z",
performance: {
  opens: 3568,
  clicks: 2975,
  responses: 125,
  conversions: 0
},
content: {
  sections: []
},
status: 'active'
},
{
_id: "model-4",
name: "Promotion printemps",
subject: "Offres spéciales du printemps - jusqu'à -30%",
description: "Campagne promotionnelle saisonnière",
category: "Marketing",
tags: ["promotion", "saisonnier", "printemps"],
createdAt: "2023-02-28T14:15:00Z",
updatedAt: "2023-03-01T09:50:00Z",
content: {
  sections: []
},
status: 'draft'
},
{
_id: "model-5",
name: "Relance panier abandonné",
subject: "Vous avez oublié quelque chose ?",
description: "Email automatique envoyé après abandon de panier",
category: "Relance",
tags: ["panier", "relance", "automatique"],
createdAt: "2022-09-18T13:10:00Z",
updatedAt: "2023-03-05T15:25:00Z",
lastSent: "2023-03-26T10:30:00Z",
performance: {
  opens: 864,
  clicks: 231,
  responses: 0,
  conversions: 156
},
content: {
  sections: []
},
status: 'active'
},
{
_id: "model-6",
name: "Invitation webinaire",
subject: "Rejoignez notre prochain webinaire sur l'écologie",
description: "Invitation à un événement en ligne",
category: "Événement",
tags: ["webinaire", "invitation", "événement"],
createdAt: "2023-03-10T11:05:00Z",
updatedAt: "2023-03-15T16:20:00Z",
content: {
  sections: []
},
status: 'draft'
},
{
_id: "model-7",
name: "Enquête de satisfaction",
subject: "Votre avis nous intéresse",
description: "Sondage client après achat ou interaction",
category: "Notification",
tags: ["enquête", "satisfaction", "feedback"],
createdAt: "2022-10-22T08:45:00Z",
updatedAt: "2023-01-18T13:55:00Z",
lastSent: "2023-03-15T14:10:00Z",
performance: {
  opens: 742,
  clicks: 318,
  responses: 186,
  conversions: 0
},
content: {
  sections: []
},
status: 'archived'
},
{
_id: "model-8",
name: "Rappel de rendez-vous",
subject: "Rappel: Votre rendez-vous demain",
description: "Email automatique de rappel avant un rendez-vous",
category: "Notification",
tags: ["rendez-vous", "rappel", "automatique"],
createdAt: "2022-11-30T15:30:00Z",
updatedAt: "2023-02-05T10:15:00Z",
content: {
  sections: []
},
status: 'active'
},
{
_id: "model-9",
name: "Nouvel article de blog",
subject: "Nouveau sur notre blog: Les tendances écologiques",
description: "Notification de nouveau contenu",
category: "Marketing",
tags: ["blog", "contenu", "actualité"],
createdAt: "2023-01-05T09:25:00Z",
updatedAt: "2023-03-12T16:40:00Z",
content: {
  sections: []
},
status: 'draft'
}
];

// Sample recipients data
const sampleRecipients: Recipient[] = [
{
_id: "rec-1",
name: "Jean Dupont",
email: "jean.dupont@example.com",
group: "Clients"
},
{
_id: "rec-2",
name: "Marie Lambert",
email: "marie.lambert@example.com",
group: "Prospects"
},
{
_id: "rec-3",
name: "Thomas Bernard",
email: "thomas.bernard@example.com",
group: "Clients"
},
{
_id: "rec-4",
name: "Sophie Martin",
email: "sophie.martin@example.com",
group: "VIP"
},
{
_id: "rec-5",
name: "Pierre Lefebvre",
email: "pierre.lefebvre@example.com",
group: "Partenaires"
},
{
_id: "rec-6",
name: "Émilie Dubois",
email: "emilie.dubois@example.com",
group: "Prospects"
},
{
_id: "rec-7",
name: "Nicolas Moreau",
email: "nicolas.moreau@example.com",
group: "Clients"
},
{
_id: "rec-8",
name: "Julie Rousseau",
email: "julie.rousseau@example.com",
group: "Partenaires"
},
{
_id: "rec-9",
name: "Alexandre Petit",
email: "alexandre.petit@example.com",
group: "VIP"
},
{
_id: "rec-10",
name: "Camille Leroy",
email: "camille.leroy@example.com",
group: "Prospects"
}
];