"use client";

import { useState } from "react";
import { motion } from "framer-motion";
// import { Button } from "@/components/ui/Button";
import { 
  XMarkIcon, 
  PencilSquareIcon, 
//   ClockIcon, 
  PauseCircleIcon, 
  PlayCircleIcon, 
  ArrowPathIcon, 
  ChartBarIcon, 
//   LinkIcon, 
  DocumentDuplicateIcon, 
  ArchiveBoxIcon, 
  TrashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlusCircleIcon
} from "@heroicons/react/24/outline";

import type { IAd } from "./page";

interface AdDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ad: IAd;
  isDarkMode: boolean;
  onAdUpdated: (ad: IAd) => void;
}

export const AdDetailsModal = ({
  isOpen,
  onClose,
  ad,
  isDarkMode,
  onAdUpdated,
}: AdDetailsModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"overview" | "performance" | "settings">("overview");
  
  // Format numbers for display
  const formatNumber = (value: number) => {
    return value.toLocaleString('fr-FR');
  };
  
  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };
  
  // Format percentage for display
  const formatPercentage = (value: number) => {
    return value.toFixed(2) + '%';
  };
  
  // Handle status change
  const handleStatusChange = (newStatus: "active" | "paused" | "archived") => {
    setLoading(true);
    
    // In a real implementation, this would be an API call to update the ad status
    setTimeout(() => {
      const updatedAd: IAd = {
        ...ad,
        status: newStatus,
        lastEditedAt: new Date().toISOString()
      };
      
      onAdUpdated(updatedAd);
      setLoading(false);
    }, 1000);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`${isDarkMode ? 'bg-[#242526]' : 'bg-white'} rounded-xl shadow-xl w-full max-w-4xl overflow-hidden h-[80vh] flex flex-col`}
      >
        <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-[#3A3B3C]' : 'border-[#E4E6EB]'}`}>
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>{ad.name}</h2>
          <button
            onClick={onClose}
            className={`${isDarkMode ? 'text-[#B0B3B8] hover:text-[#E4E6EB]' : 'text-[#65676B] hover:text-[#050505]'} rounded-full p-1`}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className={`flex border-b ${isDarkMode ? 'border-[#3A3B3C]' : 'border-[#E4E6EB]'}`}>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "overview"
                ? isDarkMode 
                  ? 'text-[#1877F2] border-b-2 border-[#1877F2]' 
                  : 'text-[#1877F2] border-b-2 border-[#1877F2]'
                : isDarkMode 
                  ? 'text-[#B0B3B8] hover:bg-[#3A3B3C]' 
                  : 'text-[#65676B] hover:bg-[#F0F2F5]'
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Aperçu
          </button>
          
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "performance"
                ? isDarkMode 
                  ? 'text-[#1877F2] border-b-2 border-[#1877F2]' 
                  : 'text-[#1877F2] border-b-2 border-[#1877F2]'
                : isDarkMode 
                  ? 'text-[#B0B3B8] hover:bg-[#3A3B3C]' 
                  : 'text-[#65676B] hover:bg-[#F0F2F5]'
            }`}
            onClick={() => setActiveTab("performance")}
          >
            Performances
          </button>
          
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "settings"
                ? isDarkMode 
                  ? 'text-[#1877F2] border-b-2 border-[#1877F2]' 
                  : 'text-[#1877F2] border-b-2 border-[#1877F2]'
                : isDarkMode 
                  ? 'text-[#B0B3B8] hover:bg-[#3A3B3C]' 
                  : 'text-[#65676B] hover:bg-[#F0F2F5]'
            }`}
            onClick={() => setActiveTab("settings")}
          >
            Paramètres
          </button>
        </div>
        
        <div className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-[#18191A]' : 'bg-[#F0F2F5]'} p-4`}>
          {/* Overview tab */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Ad Preview */}
              <div className={`${isDarkMode ? 'bg-[#242526] border-[#3A3B3C]' : 'bg-white border-[#E4E6EB]'} border rounded-lg overflow-hidden`}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>Aperçu de la publicité</h3>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        ad.status === "active" 
                          ? isDarkMode ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800' 
                          : ad.status === "paused"
                            ? isDarkMode ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-100 text-yellow-800'
                            : ad.status === "in_review"
                              ? isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'
                              : ad.status === "rejected"
                                ? isDarkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800'
                                : isDarkMode ? 'bg-[#3A3B3C] text-[#B0B3B8]' : 'bg-[#F0F2F5] text-[#65676B]'
                      }`}>
                        {ad.status === "active" ? "Actif" : 
                         ad.status === "paused" ? "En pause" : 
                         ad.status === "completed" ? "Terminé" : 
                         ad.status === "archived" ? "Archivé" : 
                         ad.status === "in_review" ? "En examen" : 
                         ad.status === "rejected" ? "Rejeté" : "Brouillon"}
                      </span>
                      
                      {ad.status === "rejected" && (
                        <button 
                          className={`${isDarkMode ? 'text-[#B0B3B8] hover:text-[#E4E6EB]' : 'text-[#65676B] hover:text-[#050505]'}`}
                          title="Raison du rejet"
                        >
                          <ExclamationCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/2">
                      <div className="aspect-video overflow-hidden rounded-lg mb-3">
                        <img 
                          src={ad.preview || ad.creative.imageUrl}
                          alt={ad.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-8 w-8 rounded-full bg-[#E7F3FF] dark:bg-[#263C5A] flex items-center justify-center">
                            <span className="text-xs font-bold text-[#1877F2]">FB</span>
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                              Votre entreprise
                            </p>
                            <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>
                              Sponsorisé
                            </p>
                          </div>
                        </div>
                        
                        <p className={`text-sm ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'} mb-2`}>
                          {ad.creative.title}
                        </p>
                        
                        {ad.creative.description && (
                          <p className={`text-sm ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'} mb-3`}>
                            {ad.creative.description}
                          </p>
                        )}
                        
                        <button
                          className="w-full py-1.5 bg-[#1877F2] text-white text-sm font-medium rounded-md"
                        >
                          {ad.creative.callToAction}
                        </button>
                      </div>
                    </div>
                    
                    <div className="md:w-1/2">
                      <div className={`p-4 ${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'} rounded-lg mb-3`}>
                        <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                          Détails de la publicité
                        </h4>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>ID:</span>
                            <span className={`text-xs font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>{ad._id}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>Date de création:</span>
                            <span className={`text-xs font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                              {new Date(ad.startDate).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>Dernière modification:</span>
                            <span className={`text-xs font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                              {new Date(ad.lastEditedAt).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>URL de destination:</span>
                            <a 
                              href={ad.creative.linkUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs font-medium text-[#1877F2] hover:underline"
                            >
                              {ad.creative.linkUrl.length > 30 
                                ? ad.creative.linkUrl.substring(0, 30) + '...' 
                                : ad.creative.linkUrl}
                            </a>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`grid grid-cols-2 gap-3 ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'}`}>
                          <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'} mb-1`}>
                            Impressions
                          </p>
                          <p className="text-lg font-semibold">
                            {formatNumber(ad.impressions)}
                          </p>
                        </div>
                        
                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'}`}>
                          <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'} mb-1`}>
                            Clics
                          </p>
                          <p className="text-lg font-semibold">
                            {formatNumber(ad.clicks)}
                          </p>
                        </div>
                        
                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'}`}>
                          <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'} mb-1`}>
                            CTR
                          </p>
                          <p className="text-lg font-semibold">
                            {formatPercentage(ad.ctr)}
                          </p>
                        </div>
                        
                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'}`}>
                          <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'} mb-1`}>
                            Dépensé
                          </p>
                          <p className="text-lg font-semibold">
                            {formatCurrency(ad.spend)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className={`flex flex-wrap border-t ${isDarkMode ? 'border-[#3A3B3C]' : 'border-[#E4E6EB]'}`}>
                  {ad.status === "active" && (
                    <button
                      className={`flex-1 py-3 text-sm font-medium ${isDarkMode ? 'text-[#E4E6EB] hover:bg-[#3A3B3C]' : 'text-[#1877F2] hover:bg-[#F0F2F5]'} transition-colors flex items-center justify-center`}
                      onClick={() => handleStatusChange("paused")}
                      disabled={loading}
                    >
                      {loading ? (
                        <ArrowPathIcon className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <PauseCircleIcon className="h-4 w-4 mr-1" />
                      )}
                      Mettre en pause
                    </button>
                  )}
                  
                  {ad.status === "paused" && (
                    <button
                      className={`flex-1 py-3 text-sm font-medium ${isDarkMode ? 'text-[#E4E6EB] hover:bg-[#3A3B3C]' : 'text-[#1877F2] hover:bg-[#F0F2F5]'} transition-colors flex items-center justify-center`}
                      onClick={() => handleStatusChange("active")}
                      disabled={loading}
                    >
                      {loading ? (
                        <ArrowPathIcon className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <PlayCircleIcon className="h-4 w-4 mr-1" />
                      )}
                      Activer
                    </button>
                  )}
                  
                  {ad.status !== "archived" && (
                    <button
                      className={`flex-1 py-3 text-sm font-medium ${isDarkMode ? 'text-[#E4E6EB] hover:bg-[#3A3B3C]' : 'text-[#1877F2] hover:bg-[#F0F2F5]'} transition-colors flex items-center justify-center`}
                      onClick={() => handleStatusChange("archived")}
                      disabled={loading}
                    >
                      {loading ? (
                        <ArrowPathIcon className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <ArchiveBoxIcon className="h-4 w-4 mr-1" />
                      )}
                      Archiver
                    </button>
                  )}
                  
                  <button
                    className={`flex-1 py-3 text-sm font-medium ${isDarkMode ? 'text-[#E4E6EB] hover:bg-[#3A3B3C]' : 'text-[#1877F2] hover:bg-[#F0F2F5]'} transition-colors flex items-center justify-center`}
                  >
                    <PencilSquareIcon className="h-4 w-4 mr-1" />
                    Modifier
                  </button>
                  
                  <button
                    className={`flex-1 py-3 text-sm font-medium ${isDarkMode ? 'text-[#E4E6EB] hover:bg-[#3A3B3C]' : 'text-[#1877F2] hover:bg-[#F0F2F5]'} transition-colors flex items-center justify-center`}
                  >
                    <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                    Dupliquer
                  </button>
                </div>
              </div>
              
              {/* Labels and Tags */}
              <div className={`${isDarkMode ? 'bg-[#242526] border-[#3A3B3C]' : 'bg-white border-[#E4E6EB]'} border rounded-lg p-4`}>
                <h3 className={`font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'} mb-3`}>
                  Étiquettes
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {ad.labels && ad.labels.length > 0 ? (
                    ad.labels.map((label: string) => (
                      <div 
                        key={label}
                        className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: isDarkMode ? '#3A3B3C' : '#F0F2F5',
                          color: isDarkMode ? '#E4E6EB' : '#050505'
                        }}
                      >
                        {label}
                        <button className={`${isDarkMode ? 'text-[#B0B3B8] hover:text-[#E4E6EB]' : 'text-[#65676B] hover:text-[#050505]'}`}>
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className={`text-sm ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>
                      Aucune étiquette. Ajoutez des étiquettes pour organiser vos publicités.
                    </p>
                  )}
                </div>
                
                <button 
                  className={`text-sm font-medium ${isDarkMode ? 'text-[#1877F2] hover:text-[#0A66C2]' : 'text-[#1877F2] hover:text-[#0A66C2]'} flex items-center`}
                >
                  <PlusCircleIcon className="h-4 w-4 mr-1" />
                  Ajouter une étiquette
                </button>
              </div>
            </div>
          )}
          
          {/* Performance tab */}
          {activeTab === "performance" && (
            <div className="space-y-4">
              <div className={`${isDarkMode ? 'bg-[#242526] border-[#3A3B3C]' : 'bg-white border-[#E4E6EB]'} border rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                    Performances de la publicité
                  </h3>
                  
                  <select 
                    className={`text-sm px-2 py-1 rounded-md ${
                      isDarkMode 
                        ? 'bg-[#3A3B3C] border-[#3A3B3C] text-[#E4E6EB]' 
                        : 'bg-[#F0F2F5] border-[#E4E6EB] text-[#050505]'
                    } border`}
                  >
                    <option value="last7days">7 derniers jours</option>
                    <option value="last30days">30 derniers jours</option>
                    <option value="lastMonth">Mois dernier</option>
                    <option value="lifetime">Depuis le début</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'}`}>
                    <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'} mb-1`}>
                      Impressions
                    </p>
                    <p className={`text-lg font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                      {formatNumber(ad.impressions)}
                    </p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'}`}>
                    <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'} mb-1`}>
                      Clics
                    </p>
                    <p className={`text-lg font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                      {formatNumber(ad.clicks)}
                    </p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'}`}>
                    <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'} mb-1`}>
                      CTR
                    </p>
                    <p className={`text-lg font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                      {formatPercentage(ad.ctr)}
                    </p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'}`}>
                    <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'} mb-1`}>
                      Dépensé
                    </p>
                    <p className={`text-lg font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                      {formatCurrency(ad.spend)}
                    </p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'}`}>
                    <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'} mb-1`}>
                      CPC
                    </p>
                    <p className={`text-lg font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                      {formatCurrency(ad.cpc)}
                    </p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'}`}>
                    <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'} mb-1`}>
                      CPM
                    </p>
                    <p className={`text-lg font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                      {formatCurrency(ad.cpm)}
                    </p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'}`}>
                    <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'} mb-1`}>
                      Conversions
                    </p>
                    <p className={`text-lg font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                      {formatNumber(ad.conversions)}
                    </p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'}`}>
                    <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'} mb-1`}>
                      Taux de conversion
                    </p>
                    <p className={`text-lg font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                      {formatPercentage(ad.conversionRate)}
                    </p>
                  </div>
                </div>
                
                <div className={`mt-4 h-64 bg-[#3A3B3C] rounded-lg flex items-center justify-center ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>
                  <div className="text-center">
                    <ChartBarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Le graphique de performance sera affiché ici</p>
                  </div>
                </div>
              </div>
              
              <div className={`${isDarkMode ? 'bg-[#242526] border-[#3A3B3C]' : 'bg-white border-[#E4E6EB]'} border rounded-lg p-4`}>
                <h3 className={`font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'} mb-3`}>
                  Recommandations
                </h3>
                
                <div className={`p-3 rounded-lg mb-3 ${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'} flex items-start gap-3`}>
                  <div className={`p-2 rounded-full ${isDarkMode ? 'bg-[#263C5A]' : 'bg-[#E7F3FF]'} flex-shrink-0`}>
                    <CheckCircleIcon className="h-5 w-5 text-[#1877F2]" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'} mb-1`}>
                      Bon taux de clics
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>
                      Votre taux de clics est supérieur à la moyenne de votre secteur. Continuez ainsi !
                    </p>
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'} flex items-start gap-3`}>
                  <div className={`p-2 rounded-full ${isDarkMode ? 'bg-[#632D35]' : 'bg-[#FEE2E2]'} flex-shrink-0`}>
                    <ExclamationCircleIcon className="h-5 w-5 text-[#EF4444]" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'} mb-1`}>
                      Optimisez votre CPC
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>
                      Votre coût par clic pourrait être amélioré. Essayez d&apos;affiner votre ciblage ou de modifier votre créatif pour de meilleurs résultats.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Settings tab */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              <div className={`${isDarkMode ? 'bg-[#242526] border-[#3A3B3C]' : 'bg-white border-[#E4E6EB]'} border rounded-lg p-4`}>
                <h3 className={`font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'} mb-3`}>
                  Paramètres de la publicité
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'} mb-1`}>
                      Nom de la publicité
                    </label>
                    <input
                      type="text"
                      value={ad.name}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDarkMode 
                          ? 'border-[#3A3B3C] bg-[#3A3B3C] text-[#E4E6EB]' 
                          : 'border-[#E4E6EB] bg-[#F0F2F5] text-[#050505]'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'} mb-1`}>
                      Statut
                    </label>
                    <select
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDarkMode 
                          ? 'border-[#3A3B3C] bg-[#3A3B3C] text-[#E4E6EB]' 
                          : 'border-[#E4E6EB] bg-[#F0F2F5] text-[#050505]'
                      }`}
                      value={ad.status}
                    >
                      <option value="active">Actif</option>
                      <option value="paused">En pause</option>
                      <option value="archived">Archivé</option>
                      <option value="draft">Brouillon</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'} mb-1`}>
                      URL de destination
                    </label>
                    <input
                      type="url"
                      value={ad.creative.linkUrl}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDarkMode 
                          ? 'border-[#3A3B3C] bg-[#3A3B3C] text-[#E4E6EB]' 
                          : 'border-[#E4E6EB] bg-[#F0F2F5] text-[#050505]'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'} mb-1`}>
                      Bouton d&apos;action
                    </label>
                    <select
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDarkMode 
                          ? 'border-[#3A3B3C] bg-[#3A3B3C] text-[#E4E6EB]' 
                          : 'border-[#E4E6EB] bg-[#F0F2F5] text-[#050505]'
                      }`}
                      value={ad.creative.callToAction}
                    >
                      <option value="Learn More">En savoir plus</option>
                      <option value="Shop Now">Acheter maintenant</option>
                      <option value="Sign Up">S&apos;inscrire</option>
                      <option value="Book Now">Réserver maintenant</option>
                      <option value="Contact Us">Nous contacter</option>
                      <option value="Download">Télécharger</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-dashed border-[#E4E6EB] dark:border-[#3A3B3C]">
                  <button
                    className="px-4 py-2 bg-[#1877F2] hover:bg-[#0A66C2] text-white rounded-lg text-sm font-medium mr-2"
                  >
                    Enregistrer les modifications
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      isDarkMode 
                        ? 'bg-[#3A3B3C] text-[#E4E6EB] hover:bg-[#4E4F50]' 
                        : 'bg-[#F0F2F5] text-[#050505] hover:bg-[#E4E6EB]'
                    }`}
                  >
                    Annuler
                  </button>
                </div>
              </div>
              
              <div className={`${isDarkMode ? 'bg-[#242526] border-[#3A3B3C]' : 'bg-white border-[#E4E6EB]'} border rounded-lg p-4`}>
                <h3 className={`font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'} mb-3 text-red-600 dark:text-red-400`}>
                  Zone de danger
                </h3>
                
                <p className={`text-sm ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'} mb-3`}>
                  Les actions ci-dessous sont destructives et ne peuvent pas être annulées.
                </p>
                
                <button
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium flex items-center"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Supprimer cette publicité
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};