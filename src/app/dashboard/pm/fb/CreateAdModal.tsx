"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { XMarkIcon, PhotoIcon, UsersIcon, GlobeAltIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import type { IAdAccount, ICampaign, IAdSet, IAd } from "./page";

interface CreateAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  adAccounts: IAdAccount[];
  campaigns: ICampaign[];
  adSets: IAdSet[];
  viewMode: "campaigns" | "adsets" | "ads" | "audiences";
  selectedAdAccount: string | null;
  selectedCampaign: string | null;
  selectedAdSet: string | null;
  onAdCreated: (ad: IAd) => void;
}

export const CreateAdModal = ({
  isOpen,
  onClose,
  adAccounts,
  campaigns,
  adSets,
  viewMode,
  selectedAdAccount,
  selectedCampaign,
  selectedAdSet,
  onAdCreated,
}: CreateAdModalProps) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: "",
    adAccountId: selectedAdAccount || "",
    campaignId: selectedCampaign || "",
    adSetId: selectedAdSet || "",
    objective: "traffic",
    budget: 50,
    budgetType: "daily",
    targeting: {
      locations: ["France"],
      ageRange: {
        min: 18,
        max: 65
      },
      genders: ["all"]
    },
    creative: {
      title: "",
      description: "",
      imageUrl: "",
      linkUrl: "",
      callToAction: "Learn More"
    }
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  
  // Set initial values based on selected items
  useState(() => {
    if (selectedAdAccount) {
      setFormData(prev => ({ ...prev, adAccountId: selectedAdAccount }));
    }
    if (selectedCampaign) {
      setFormData(prev => ({ ...prev, campaignId: selectedCampaign }));
    }
    if (selectedAdSet) {
      setFormData(prev => ({ ...prev, adSetId: selectedAdSet }));
    }
  });
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
  
    // Handle nested properties
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...((prev[parent as keyof typeof prev] as Record<string, unknown>) || {}),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real implementation, this would be an API call to the Facebook Marketing API
      const mockAd: IAd = {
        _id: `ad_new_${Date.now()}`,
        name: formData.name,
        adSetId: formData.adSetId,
        campaignId: formData.campaignId,
        status: "in_review",
        creative: {
          title: formData.creative.title,
          description: formData.creative.description,
          imageUrl: formData.creative.imageUrl || `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/600/400`,
          linkUrl: formData.creative.linkUrl,
          callToAction: formData.creative.callToAction
        },
        preview: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/200`,
        spend: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        cpc: 0,
        cpm: 0,
        conversionRate: 0,
        lastEditedAt: new Date().toISOString(),
        startDate: new Date().toISOString(),
        labels: []
      };
      
      // Simulate API delay
      setTimeout(() => {
        onAdCreated(mockAd);
        onClose();
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error creating ad:", error);
      setLoading(false);
    }
  };
  
  const getStepTitle = () => {
    switch (step) {
      case 1:
        return viewMode === "campaigns" ? "Créer une campagne" : 
               viewMode === "adsets" ? "Créer un ensemble de publicités" : 
               viewMode === "ads" ? "Créer une publicité" : "Créer une audience";
      case 2:
        return "Ciblage";
      case 3:
        return "Contenu créatif";
      default:
        return "Étape " + step;
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-[#242526] rounded-xl shadow-xl w-full max-w-4xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#E4E6EB] dark:border-[#3A3B3C]">
          <h2 className="text-lg font-semibold text-[#050505] dark:text-[#E4E6EB]">{getStepTitle()}</h2>
          <button
            onClick={onClose}
            className="text-[#65676B] dark:text-[#B0B3B8] hover:text-[#050505] dark:hover:text-[#E4E6EB] rounded-full p-1"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-[#1877F2] text-white' : 'bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#65676B] dark:text-[#B0B3B8]'
              }`}>
                1
              </div>
              <div className={`h-1 w-8 ${
                step >= 2 ? 'bg-[#1877F2]' : 'bg-[#F0F2F5] dark:bg-[#3A3B3C]'
              }`} />
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-[#1877F2] text-white' : 'bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#65676B] dark:text-[#B0B3B8]'
              }`}>
                2
              </div>
              <div className={`h-1 w-8 ${
                step >= 3 ? 'bg-[#1877F2]' : 'bg-[#F0F2F5] dark:bg-[#3A3B3C]'
              }`} />
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-[#1877F2] text-white' : 'bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#65676B] dark:text-[#B0B3B8]'
              }`}>
                3
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#050505] dark:text-[#E4E6EB] mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={viewMode === "campaigns" ? "Nom de la campagne" : 
                                 viewMode === "adsets" ? "Nom de l'ensemble de publicités" : 
                                 viewMode === "ads" ? "Nom de la publicité" : "Nom de l'audience"}
                    className="w-full px-3 py-2 border border-[#E4E6EB] dark:border-[#3A3B3C] rounded-lg bg-white dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#050505] dark:text-[#E4E6EB] mb-1">
                    Compte publicitaire
                  </label>
                  <select
                    name="adAccountId"
                    value={formData.adAccountId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[#E4E6EB] dark:border-[#3A3B3C] rounded-lg bg-white dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                    required
                  >
                    <option value="">Sélectionner un compte</option>
                    {adAccounts.map(account => (
                      <option key={account._id} value={account._id} disabled={account.status === "disabled"}>
                        {account.name} ({account.accountId})
                      </option>
                    ))}
                  </select>
                </div>
                
                {(viewMode === "adsets" || viewMode === "ads") && (
                  <div>
                    <label className="block text-sm font-medium text-[#050505] dark:text-[#E4E6EB] mb-1">
                      Campagne
                    </label>
                    <select
                      name="campaignId"
                      value={formData.campaignId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-[#E4E6EB] dark:border-[#3A3B3C] rounded-lg bg-white dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                      required
                    >
                      <option value="">Sélectionner une campagne</option>
                      {campaigns
                        .filter(campaign => formData.adAccountId ? campaign.adAccountId === formData.adAccountId : true)
                        .map(campaign => (
                          <option key={campaign._id} value={campaign._id}>{campaign.name}</option>
                        ))}
                    </select>
                  </div>
                )}
                
                {viewMode === "ads" && (
                  <div>
                    <label className="block text-sm font-medium text-[#050505] dark:text-[#E4E6EB] mb-1">
                      Ensemble de publicités
                    </label>
                    <select
                      name="adSetId"
                      value={formData.adSetId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-[#E4E6EB] dark:border-[#3A3B3C] rounded-lg bg-white dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                      required
                    >
                      <option value="">Sélectionner un ensemble</option>
                      {adSets
                        .filter(adSet => formData.campaignId ? adSet.campaignId === formData.campaignId : true)
                        .map(adSet => (
                          <option key={adSet._id} value={adSet._id}>{adSet.name}</option>
                        ))}
                    </select>
                  </div>
                )}
                
                {viewMode === "campaigns" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-[#050505] dark:text-[#E4E6EB] mb-1">
                        Objectif
                      </label>
                      <select
                        name="objective"
                        value={formData.objective}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-[#E4E6EB] dark:border-[#3A3B3C] rounded-lg bg-white dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                      >
                        <option value="awareness">Notoriété</option>
                        <option value="traffic">Trafic</option>
                        <option value="engagement">Engagement</option>
                        <option value="leads">Génération de leads</option>
                        <option value="app_promotion">Promotion d&apos;applications</option>
                        <option value="sales">Ventes</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#050505] dark:text-[#E4E6EB] mb-1">
                          Budget
                        </label>
                        <input
                          type="number"
                          name="budget"
                          value={formData.budget}
                          onChange={handleNumberChange}
                          min="1"
                          step="1"
                          className="w-full px-3 py-2 border border-[#E4E6EB] dark:border-[#3A3B3C] rounded-lg bg-white dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#050505] dark:text-[#E4E6EB] mb-1">
                          Type de budget
                        </label>
                        <select
                          name="budgetType"
                          value={formData.budgetType}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-[#E4E6EB] dark:border-[#3A3B3C] rounded-lg bg-white dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                        >
                          <option value="daily">Quotidien</option>
                          <option value="lifetime">Durée de vie</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Step 2: Targeting */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="p-4 bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-[#050505] dark:text-[#E4E6EB]">Localisation</h3>
                    <GlobeAltIcon className="h-5 w-5 text-[#1877F2]" />
                  </div>
                  
                  <div className="relative mb-3">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MagnifyingGlassIcon className="h-4 w-4 text-[#65676B] dark:text-[#B0B3B8]" />
                    </div>
                    <input
                      type="text"
                      placeholder="Rechercher des pays, des régions ou des villes"
                      className="w-full pl-10 pr-3 py-2 border border-[#E4E6EB] dark:border-[#3A3B3C] rounded-lg bg-white dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white dark:bg-[#242526] rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 flex items-center justify-center bg-[#E7F3FF] dark:bg-[#263C5A] rounded-full">
                          <GlobeAltIcon className="h-4 w-4 text-[#1877F2]" />
                        </div>
                        <span className="text-sm text-[#050505] dark:text-[#E4E6EB]">France</span>
                      </div>
                      <button type="button" className="text-[#65676B] dark:text-[#B0B3B8]">
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-[#050505] dark:text-[#E4E6EB]">Âge et sexe</h3>
                    <UsersIcon className="h-5 w-5 text-[#1877F2]" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-xs text-[#65676B] dark:text-[#B0B3B8] mb-1">
                        Âge minimum
                      </label>
                      <select
                        name="targeting.ageRange.min"
                        value={formData.targeting.ageRange.min}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-[#E4E6EB] dark:border-[#3A3B3C] rounded-lg bg-white dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                      >
                        {[13, 18, 21, 25, 30, 35, 40, 45, 50, 55, 60, 65].map(age => (
                          <option key={age} value={age}>{age}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-[#65676B] dark:text-[#B0B3B8] mb-1">
                        Âge maximum
                      </label>
                      <select
                        name="targeting.ageRange.max"
                        value={formData.targeting.ageRange.max}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-[#E4E6EB] dark:border-[#3A3B3C] rounded-lg bg-white dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                      >
                        {[18, 21, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, "65+"].map(age => (
                          <option key={age} value={age}>{age === '65+' ? '65+' : age}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-[#65676B] dark:text-[#B0B3B8] mb-1">
                      Sexe
                    </label>
                    <select
                      name="targeting.genders"
                      value={formData.targeting.genders[0]}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        targeting: {
                          ...prev.targeting,
                          genders: [e.target.value as "male" | "female" | "all"]
                        }
                      }))}
                      className="w-full px-3 py-2 border border-[#E4E6EB] dark:border-[#3A3B3C] rounded-lg bg-white dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                    >
                      <option value="all">Tous</option>
                      <option value="male">Hommes</option>
                      <option value="female">Femmes</option>
                    </select>
                  </div>
                </div>
                
                <div className="p-4 bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-[#050505] dark:text-[#E4E6EB]">Ciblage détaillé</h3>
                    <button
                      type="button"
                      className="text-[#1877F2] hover:text-[#0A66C2] text-sm font-medium"
                    >
                      Parcourir
                    </button>
                  </div>
                  
                  <p className="text-sm text-[#65676B] dark:text-[#B0B3B8] mt-1">
                    Ajoutez des centres d&apos;intérêt, des comportements ou des caractéristiques démographiques pour affiner votre ciblage
                  </p>
                </div>
              </div>
            )}
            
            {/* Step 3: Creative */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="p-4 bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-[#050505] dark:text-[#E4E6EB]">Contenu créatif</h3>
                    <PhotoIcon className="h-5 w-5 text-[#1877F2]" />
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-[#050505] dark:text-[#E4E6EB] mb-1">
                        Titre de la publicité
                      </label>
                      <input
                        type="text"
                        name="creative.title"
                        value={formData.creative.title}
                        onChange={handleChange}
                        placeholder="Saisissez un titre accrocheur"
                        className="w-full px-3 py-2 border border-[#E4E6EB] dark:border-[#3A3B3C] rounded-lg bg-white dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                        required
                      />
                      <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-1">
                        25 caractères maximum recommandés
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-[#050505] dark:text-[#E4E6EB] mb-1">
                        Description
                      </label>
                      <textarea
                        name="creative.description"
                        value={formData.creative.description}
                        onChange={handleChange}
                        placeholder="Décrivez votre produit ou service"
                        className="w-full px-3 py-2 border border-[#E4E6EB] dark:border-[#3A3B3C] rounded-lg bg-white dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:ring-2 focus:ring-[#1877F2] resize-none h-20"
                        required
                      ></textarea>
                      <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-1">
                        125 caractères maximum recommandés
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-[#050505] dark:text-[#E4E6EB] mb-1">
                        URL de destination
                      </label>
                      <input
                        type="url"
                        name="creative.linkUrl"
                        value={formData.creative.linkUrl}
                        onChange={handleChange}
                        placeholder="https://votre-site.com/page-de-destination"
                        className="w-full px-3 py-2 border border-[#E4E6EB] dark:border-[#3A3B3C] rounded-lg bg-white dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-[#050505] dark:text-[#E4E6EB] mb-1">
                        Bouton d&apos;action
                      </label>
                      <select
                        name="creative.callToAction"
                        value={formData.creative.callToAction}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-[#E4E6EB] dark:border-[#3A3B3C] rounded-lg bg-white dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                      >
                        <option value="Learn More">En savoir plus</option>
                        <option value="Shop Now">Acheter maintenant</option>
                        <option value="Sign Up">S&apos;inscrire</option>
                        <option value="Book Now">Réserver maintenant</option>
                        <option value="Contact Us">Nous contacter</option>
                        <option value="Download">Télécharger</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-[#050505] dark:text-[#E4E6EB] mb-1">
                        Image ou vidéo
                      </label>
                      <div className="border border-dashed border-[#E4E6EB] dark:border-[#3A3B3C] bg-white dark:bg-[#3A3B3C] rounded-lg p-4 text-center">
                        <div className="mx-auto h-12 w-12 rounded-full bg-[#E7F3FF] dark:bg-[#263C5A] flex items-center justify-center mb-2">
                          <PhotoIcon className="h-6 w-6 text-[#1877F2]" />
                        </div>
                        <p className="text-sm text-[#050505] dark:text-[#E4E6EB]">
                          Faites glisser une image ou cliquez pour parcourir
                        </p>
                        <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-1">
                          Formats recommandés : JPG, PNG ou MP4. Taille maximale : 4 Mo.
                        </p>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*,video/*"
                        />
                        <button
                          type="button"
                          className="mt-3 text-[#1877F2] hover:text-[#0A66C2] text-sm font-medium"
                        >
                          Télécharger
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-lg">
                  <h3 className="font-medium text-[#050505] dark:text-[#E4E6EB] mb-3">Aperçu</h3>
                  
                  <div className="bg-white dark:bg-[#242526] rounded-lg p-3 border border-[#E4E6EB] dark:border-[#3A3B3C]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-full bg-[#E7F3FF] dark:bg-[#263C5A] flex items-center justify-center">
                        <span className="text-xs font-bold text-[#1877F2]">FB</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#050505] dark:text-[#E4E6EB]">Votre entreprise</p>
                        <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">Sponsorisé</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-[#050505] dark:text-[#E4E6EB] mb-2">
                      {formData.creative.title || "Titre de la publicité"}
                    </p>
                    
                    <div className="bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-lg h-40 flex items-center justify-center mb-2">
                      <PhotoIcon className="h-12 w-12 text-[#65676B] dark:text-[#B0B3B8]" />
                    </div>
                    
                    <p className="text-sm text-[#65676B] dark:text-[#B0B3B8] mb-3">
                      {formData.creative.description || "Description de votre produit ou service"}
                    </p>
                    
                    <button
                      type="button"
                      className="w-full py-1.5 bg-[#1877F2] hover:bg-[#0A66C2] text-white text-sm font-medium rounded-md"
                    >
                      {formData.creative.callToAction}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between pt-6">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#E4E6EB] dark:border-[#3A3B3C] text-[#1877F2] hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C]"
                  onClick={() => setStep(step - 1)}
                >
                  Retour
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#E4E6EB] dark:border-[#3A3B3C] text-[#65676B] dark:text-[#B0B3B8] hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C]"
                  onClick={onClose}
                >
                  Annuler
                </Button>
              )}
              
              {step < 3 ? (
                <Button
                  type="button"
                  className="bg-[#1877F2] hover:bg-[#0A66C2] text-white"
                  onClick={() => setStep(step + 1)}
                >
                  Continuer
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-[#1877F2] hover:bg-[#0A66C2] text-white"
                  disabled={loading}
                >
                  {loading ? 'Création...' : 'Créer'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};