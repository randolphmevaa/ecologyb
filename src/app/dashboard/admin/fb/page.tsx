"use client";

import { useState, useEffect,  createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
// import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

import {
  ChartBarIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  ArrowPathIcon,
  EllipsisHorizontalIcon,
  // FunnelIcon,
  XMarkIcon,
  CheckCircleIcon,
  // PauseCircleIcon,
  PencilSquareIcon,
  // TrashIcon,
  CalendarIcon,
  PhotoIcon,
  UsersIcon,
  // LinkIcon,
  // ClockIcon,
  CheckIcon,
  BellIcon,
  DocumentDuplicateIcon,
  PresentationChartLineIcon,
  AdjustmentsHorizontalIcon,
  // ArchiveBoxIcon,
  GlobeAltIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

// Import modals for Facebook ads management
import { CreateAdModal } from "./CreateAdModal";
import { ConnectAdAccountModal } from "./ConnectAdAccountModal";
import { AdDetailsModal } from "./AdDetailsModal";

const ThemeContext = createContext({ isDarkMode: false, toggleTheme: () => {} });

// Ad Account type definition
export interface IAdAccount {
  _id: string;
  name: string;
  accountId: string;
  status: "active" | "disabled";
  currency: string;
  timeZone: string;
  businessName: string;
  businessLogo?: string;
  spendCap?: number;
  totalSpent: number;
  dailySpend: number;
}

// Campaign type definition
export interface ICampaign {
  _id: string;
  name: string;
  objective: "awareness" | "traffic" | "engagement" | "leads" | "app_promotion" | "sales";
  status: "active" | "paused" | "completed" | "deleted" | "archived" | "draft";
  budget: number;
  budgetType: "daily" | "lifetime";
  startDate: string;
  endDate?: string;
  adAccountId: string;
  adSetCount: number;
  adCount: number;
  totalSpent: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  ctr: number;
  cpc: number;
  cpm: number;
  conversionRate: number;
  lastEditedAt: string;
}

// Ad Set type definition
export interface IAdSet {
  _id: string;
  name: string;
  campaignId: string;
  status: "active" | "paused" | "completed" | "deleted" | "archived" | "draft";
  budget: number;
  budgetType: "daily" | "lifetime";
  startDate: string;
  endDate?: string;
  targeting: {
    locations?: string[];
    ageRange?: {
      min: number;
      max: number;
    };
    genders?: ("male" | "female" | "all")[];
    interests?: string[];
    behaviors?: string[];
    demographics?: string[];
  };
  optimizationGoal: "impressions" | "link_clicks" | "page_likes" | "landing_page_views" | "lead_generation" | "conversions";
  bidStrategy: "lowest_cost" | "target_cost";
  adCount: number;
  totalSpent: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  ctr: number;
  cpc: number;
  cpm: number;
  conversionRate: number;
}

// Ad type definition
export interface IAd {
  _id: string;
  name: string;
  adSetId: string;
  campaignId: string;
  status: "active" | "paused" | "completed" | "deleted" | "archived" | "draft" | "rejected" | "in_review";
  creative: {
    title: string;
    description?: string;
    imageUrl?: string;
    videoUrl?: string;
    linkUrl: string;
    callToAction: string;
  };
  preview?: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpm: number;
  conversionRate: number;
  lastEditedAt: string;
  startDate: string;
  rejectionReason?: string;
  labels?: string[];
}

// Audience type definition
export interface IAudience {
  _id: string;
  name: string;
  size: number;
  type: "saved_audience" | "custom_audience" | "lookalike_audience";
  source?: string;
  lastUsed?: string;
  description?: string;
  isShared: boolean;
}

// Facebook color schemes
// const colors = {
//   light: {
//     primary: "#1877F2",      // Facebook blue
//     secondary: "#4267B2",    // Facebook darker blue
//     accent: "#E7F3FF",       // Light blue (message bubbles)
//     background: "#F0F2F5",   // Facebook light background
//     surface: "#FFFFFF",      // White surface
//     border: "#E4E6EB",       // Light borders
//     text: "#050505",         // Dark text
//     textSecondary: "#65676B" // Secondary text
//   },
//   dark: {
//     primary: "#1877F2",      // Facebook blue
//     secondary: "#4267B2",    // Facebook darker blue
//     accent: "#3A3B3C",       // Dark mode accent
//     background: "#18191A",   // Dark background
//     surface: "#242526",      // Dark surface
//     border: "#3A3B3C",       // Dark borders
//     text: "#E4E6EB",         // Light text
//     textSecondary: "#B0B3B8" // Secondary text
//   }
// };

// Ad objective colors
const objectiveColors = {
  "awareness": { 
    light: { bg: "#E7F3FF", text: "#1877F2" },
    dark: { bg: "#263C5A", text: "#1877F2" }
  },
  "traffic": { 
    light: { bg: "#E3F2FD", text: "#2196F3" },
    dark: { bg: "#0D47A1", text: "#2196F3" }
  },
  "engagement": { 
    light: { bg: "#E8F5E9", text: "#4CAF50" },
    dark: { bg: "#1B5E20", text: "#4CAF50" }
  },
  "leads": { 
    light: { bg: "#FFF8E1", text: "#FFA000" },
    dark: { bg: "#F57F17", text: "#FFF8E1" }
  },
  "app_promotion": { 
    light: { bg: "#F3E5F5", text: "#9C27B0" },
    dark: { bg: "#4A148C", text: "#9C27B0" }
  },
  "sales": { 
    light: { bg: "#FFEBEE", text: "#F44336" },
    dark: { bg: "#B71C1C", text: "#FFEBEE" }
  },
};

// Label colors
const labelColors = {
  "high_performing": { 
    light: { bg: "#E8F5E9", text: "#4CAF50" },
    dark: { bg: "#1B5E20", text: "#4CAF50" }
  },
  "needs_attention": { 
    light: { bg: "#FFF8E1", text: "#FFA000" },
    dark: { bg: "#F57F17", text: "#FFF8E1" }
  },
  "underperforming": { 
    light: { bg: "#FFEBEE", text: "#F44336" },
    dark: { bg: "#B71C1C", text: "#FFEBEE" }
  },
  "test": { 
    light: { bg: "#E3F2FD", text: "#2196F3" },
    dark: { bg: "#0D47A1", text: "#2196F3" }
  },
  "seasonal": { 
    light: { bg: "#F3E5F5", text: "#9C27B0" },
    dark: { bg: "#4A148C", text: "#9C27B0" }
  },
};

// Theme provider component
import { ReactNode } from "react";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check system preference or saved preference
    const savedTheme = localStorage.getItem('facebook-ads-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setIsDarkMode(savedTheme === 'dark' || (!savedTheme && prefersDark));
    
    // Apply theme to document
    document.documentElement.classList.toggle('dark-theme', isDarkMode);
  }, [isDarkMode]);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('facebook-ads-theme', !isDarkMode ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
const useTheme = () => useContext(ThemeContext);

export default function FacebookAdsPage() {
  // States for Facebook Ads management
  const [adAccounts, setAdAccounts] = useState<IAdAccount[]>([]);
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
  const [adSets, setAdSets] = useState<IAdSet[]>([]);
  const [ads, setAds] = useState<IAd[]>([]);
  const [audiences, setAudiences] = useState<IAudience[]>([]);
  const [selectedAdAccount, setSelectedAdAccount] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [selectedAdSet, setSelectedAdSet] = useState<string | null>(null);
  const [selectedAd, setSelectedAd] = useState<IAd | null>(null);
  const [viewMode, setViewMode] = useState<"campaigns" | "adsets" | "ads" | "audiences">("campaigns");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [objectiveFilter, setObjectiveFilter] = useState<string>("");
  const [dateRangeFilter, setDateRangeFilter] = useState<"today" | "yesterday" | "last7days" | "last30days" | "thisMonth" | "lastMonth" | "custom">("last7days");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const { isDarkMode } = useTheme();
  // const theme = isDarkMode ? colors.dark : colors.light;

  // Modal states
  const [isCreateAdModalOpen, setIsCreateAdModalOpen] = useState<boolean>(false);
  const [isConnectAccountModalOpen, setIsConnectAccountModalOpen] = useState<boolean>(false);
  const [isAdDetailsModalOpen, setIsAdDetailsModalOpen] = useState<boolean>(false);

  // Stats
  const [stats, setStats] = useState({
    totalSpend: 0,
    todaySpend: 0,
    activeAdsCount: 0,
    averageCTR: 0,
    averageCPC: 0,
    totalConversions: 0
  });

  // Fetch Facebook Ad accounts and data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Mock fetching ad accounts
        // In a real implementation, this would be an API call to the Facebook Marketing API
        const mockAdAccounts: IAdAccount[] = [
          {
            _id: "1",
            name: "Main Ad Account",
            accountId: "act_12345678",
            status: "active",
            currency: "EUR",
            timeZone: "Europe/Paris",
            businessName: "Your Business",
            businessLogo: "https://ui-avatars.com/api/?name=Your+Business&background=4267B2&color=fff",
            spendCap: 5000,
            totalSpent: 2345.67,
            dailySpend: 128.90
          },
          {
            _id: "2",
            name: "E-commerce Store",
            accountId: "act_87654321",
            status: "active",
            currency: "EUR",
            timeZone: "Europe/Paris",
            businessName: "Your Business",
            businessLogo: "https://ui-avatars.com/api/?name=Store&background=4267B2&color=fff",
            totalSpent: 1235.40,
            dailySpend: 85.30
          },
          {
            _id: "3",
            name: "Events Promotion",
            accountId: "act_23456789",
            status: "disabled",
            currency: "EUR",
            timeZone: "Europe/Paris",
            businessName: "Your Business",
            businessLogo: "https://ui-avatars.com/api/?name=Events&background=4267B2&color=fff",
            totalSpent: 567.80,
            dailySpend: 0
          }
        ];
        
        // Mock fetching campaigns
        const mockCampaigns: ICampaign[] = Array.from({ length: 12 }, (_, i) => {
          const objectives: ("awareness" | "traffic" | "engagement" | "leads" | "app_promotion" | "sales")[] = [
            "awareness", "traffic", "engagement", "leads", "app_promotion", "sales"
          ];
          
          const statuses: ("active" | "paused" | "completed" | "deleted" | "archived" | "draft")[] = [
            "active", "paused", "completed", "archived", "draft"
          ];
          
          const budgetTypes: ("daily" | "lifetime")[] = ["daily", "lifetime"];
          const objective = objectives[Math.floor(Math.random() * objectives.length)];
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          const budgetType = budgetTypes[Math.floor(Math.random() * budgetTypes.length)];
          const budget = Math.floor(Math.random() * 1000) + 100;
          
          // Generate random performance metrics
          const totalImpressions = Math.floor(Math.random() * 100000) + 1000;
          const totalClicks = Math.floor(totalImpressions * (Math.random() * 0.1));
          const totalConversions = Math.floor(totalClicks * (Math.random() * 0.2));
          const totalSpent = Math.floor(Math.random() * budget) + 10;
          
          // Calculate derived metrics
          const ctr = (totalClicks / totalImpressions) * 100;
          const cpc = totalClicks > 0 ? totalSpent / totalClicks : 0;
          const cpm = (totalSpent / totalImpressions) * 1000;
          const conversionRate = (totalConversions / totalClicks) * 100;
          
          // Generate dates
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 60));
          
          const endDate = new Date(startDate);
          if (budgetType === "lifetime") {
            endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 30) + 7);
          }
          
          const lastEditedAt = new Date();
          lastEditedAt.setHours(lastEditedAt.getHours() - Math.floor(Math.random() * 72));
          
          const account = mockAdAccounts[Math.floor(Math.random() * mockAdAccounts.length)];
          
          return {
            _id: `campaign_${i}`,
            name: `Campaign ${i + 1} - ${objective.charAt(0).toUpperCase() + objective.slice(1)}`,
            objective: objective,
            status: status,
            budget: budget,
            budgetType: budgetType,
            startDate: startDate.toISOString(),
            endDate: budgetType === "lifetime" ? endDate.toISOString() : undefined,
            adAccountId: account._id,
            adSetCount: Math.floor(Math.random() * 5) + 1,
            adCount: Math.floor(Math.random() * 10) + 1,
            totalSpent: totalSpent,
            totalImpressions: totalImpressions,
            totalClicks: totalClicks,
            totalConversions: totalConversions,
            ctr: ctr,
            cpc: cpc,
            cpm: cpm,
            conversionRate: conversionRate,
            lastEditedAt: lastEditedAt.toISOString()
          };
        });
        
        // Mock fetching ad sets
        const mockAdSets: IAdSet[] = [];
        mockCampaigns.forEach(campaign => {
          for (let i = 0; i < campaign.adSetCount; i++) {
            const statuses: ("active" | "paused" | "completed" | "deleted" | "archived" | "draft")[] = [
              "active", "paused", "completed", "archived", "draft"
            ];
            
            const optimizationGoals: ("impressions" | "link_clicks" | "page_likes" | "landing_page_views" | "lead_generation" | "conversions")[] = [
              "impressions", "link_clicks", "page_likes", "landing_page_views", "lead_generation", "conversions"
            ];
            
            const bidStrategies: ("lowest_cost" | "target_cost")[] = ["lowest_cost", "target_cost"];
            
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const optimizationGoal = optimizationGoals[Math.floor(Math.random() * optimizationGoals.length)];
            const bidStrategy = bidStrategies[Math.floor(Math.random() * bidStrategies.length)];
            
            // Generate random performance metrics
            const adCount = Math.floor(Math.random() * 5) + 1;
            const totalImpressions = Math.floor(Math.random() * 50000) + 500;
            const totalClicks = Math.floor(totalImpressions * (Math.random() * 0.1));
            const totalConversions = Math.floor(totalClicks * (Math.random() * 0.2));
            const totalSpent = Math.floor(Math.random() * campaign.budget / campaign.adSetCount) + 5;
            
            // Calculate derived metrics
            const ctr = (totalClicks / totalImpressions) * 100;
            const cpc = totalClicks > 0 ? totalSpent / totalClicks : 0;
            const cpm = (totalSpent / totalImpressions) * 1000;
            const conversionRate = (totalConversions / totalClicks) * 100;
            
            mockAdSets.push({
              _id: `adset_${campaign._id}_${i}`,
              name: `Ad Set ${i + 1} for ${campaign.name}`,
              campaignId: campaign._id,
              status: status,
              budget: campaign.budget / campaign.adSetCount,
              budgetType: campaign.budgetType,
              startDate: campaign.startDate,
              endDate: campaign.endDate,
              targeting: {
                locations: ["France", "Belgium", "Switzerland"],
                ageRange: {
                  min: 18 + Math.floor(Math.random() * 12),
                  max: 45 + Math.floor(Math.random() * 20)
                },
                genders: ["all"],
                interests: ["Digital Marketing", "E-commerce", "Technology"],
                behaviors: ["Online shopping"],
                demographics: ["Parents", "Homeowners"]
              },
              optimizationGoal: optimizationGoal,
              bidStrategy: bidStrategy,
              adCount: adCount,
              totalSpent: totalSpent,
              totalImpressions: totalImpressions,
              totalClicks: totalClicks,
              totalConversions: totalConversions,
              ctr: ctr,
              cpc: cpc,
              cpm: cpm,
              conversionRate: conversionRate
            });
          }
        });
        
        // Mock fetching ads
        const mockAds: IAd[] = [];
        mockAdSets.forEach(adSet => {
          for (let i = 0; i < adSet.adCount; i++) {
            const statuses: ("active" | "paused" | "completed" | "deleted" | "archived" | "draft" | "rejected" | "in_review")[] = [
              "active", "paused", "completed", "archived", "draft", "in_review"
            ];
            
            const callToActions: string[] = [
              "Shop Now", "Learn More", "Sign Up", "Book Now", "Contact Us", "Download"
            ];
            
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const callToAction = callToActions[Math.floor(Math.random() * callToActions.length)];
            
            // Generate random performance metrics based on ad set metrics
            const impressionShare = Math.random() * 0.5 + 0.5; // Between 0.5 and 1
            const impressions = Math.floor(adSet.totalImpressions * impressionShare / adSet.adCount);
            const clickRate = Math.random() * 0.1; // CTR between 0% and 10%
            const clicks = Math.floor(impressions * clickRate);
            const conversionRate = Math.random() * 0.2; // Conversion rate between 0% and 20%
            const conversions = Math.floor(clicks * conversionRate);
            const spend = adSet.totalSpent * impressionShare / adSet.adCount;
            
            // Calculate derived metrics
            const ctr = (clicks / impressions) * 100;
            const cpc = clicks > 0 ? spend / clicks : 0;
            const cpm = (spend / impressions) * 1000;
            
            // Generate random labels
            const labels = ["high_performing", "needs_attention", "underperforming", "test", "seasonal"];
            const randomLabels: string[] = [];
            const labelCount = Math.floor(Math.random() * 2);
            
            for (let j = 0; j < labelCount; j++) {
              const label = labels[Math.floor(Math.random() * labels.length)];
              if (!randomLabels.includes(label)) {
                randomLabels.push(label);
              }
            }
            
            // const campaign = mockCampaigns.find(c => c._id === adSet.campaignId);
            
            mockAds.push({
              _id: `ad_${adSet._id}_${i}`,
              name: `Ad ${i + 1} for ${adSet.name}`,
              adSetId: adSet._id,
              campaignId: adSet.campaignId,
              status: status,
              creative: {
                title: `Try our amazing product ${i + 1}`,
                description: "Limited time offer! Get your exclusive deal today.",
                imageUrl: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/600/400`,
                linkUrl: "https://example.com/product",
                callToAction: callToAction
              },
              preview: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/200`,
              spend: spend,
              impressions: impressions,
              clicks: clicks,
              conversions: conversions,
              ctr: ctr,
              cpc: cpc,
              cpm: cpm,
              conversionRate: (conversions / clicks) * 100,
              lastEditedAt: new Date().toISOString(),
              startDate: adSet.startDate,
              labels: randomLabels
            });
          }
        });
        
        // Mock audiences
        const mockAudiences: IAudience[] = [
          {
            _id: "audience_1",
            name: "Website Visitors",
            size: 52460,
            type: "custom_audience",
            source: "Website",
            lastUsed: new Date().toISOString(),
            description: "People who visited our website in the last 30 days",
            isShared: true
          },
          {
            _id: "audience_2",
            name: "Email Subscribers",
            size: 18750,
            type: "custom_audience",
            source: "Customer File",
            lastUsed: new Date().toISOString(),
            description: "People who subscribed to our newsletter",
            isShared: true
          },
          {
            _id: "audience_3",
            name: "Recent Purchasers",
            size: 4320,
            type: "custom_audience",
            source: "App Activity",
            lastUsed: new Date().toISOString(),
            description: "People who made a purchase in the last 14 days",
            isShared: false
          },
          {
            _id: "audience_4",
            name: "Tech Enthusiasts",
            size: 2450000,
            type: "saved_audience",
            lastUsed: new Date().toISOString(),
            description: "People interested in technology and gadgets",
            isShared: true
          },
          {
            _id: "audience_5",
            name: "Lookalike - Top Customers",
            size: 1200000,
            type: "lookalike_audience",
            source: "Top 1% Customers",
            lastUsed: new Date().toISOString(),
            description: "1% lookalike of our top customers",
            isShared: false
          }
        ];
        
        // Calculate stats
        const totalSpend = mockCampaigns.reduce((sum, campaign) => sum + campaign.totalSpent, 0);
        const todaySpend = mockAdAccounts.reduce((sum, account) => sum + account.dailySpend, 0);
        const activeAdsCount = mockAds.filter(ad => ad.status === "active").length;
        const totalClicks = mockCampaigns.reduce((sum, campaign) => sum + campaign.totalClicks, 0);
        const totalImpressions = mockCampaigns.reduce((sum, campaign) => sum + campaign.totalImpressions, 0);
        const totalConversions = mockCampaigns.reduce((sum, campaign) => sum + campaign.totalConversions, 0);
        
        const mockStats = {
          totalSpend: totalSpend,
          todaySpend: todaySpend,
          activeAdsCount: activeAdsCount,
          averageCTR: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
          averageCPC: totalClicks > 0 ? totalSpend / totalClicks : 0,
          totalConversions: totalConversions
        };
        
        // Set state with mock data
        setAdAccounts(mockAdAccounts);
        setCampaigns(mockCampaigns);
        setAdSets(mockAdSets);
        setAds(mockAds);
        setAudiences(mockAudiences);
        setStats(mockStats);
        
        if (mockAdAccounts.length > 0) {
          setSelectedAdAccount(mockAdAccounts[0]._id);
        }
        
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Filter campaigns/ads/adsets based on search, account, and filter selections
  const getFilteredItems = () => {
    let items: (ICampaign | IAdSet | IAd | IAudience)[] = [];
    
    // First, get items based on the view mode
    switch (viewMode) {
      case "campaigns":
        items = campaigns;
        break;
      case "adsets":
        items = selectedCampaign ? adSets.filter(adSet => adSet.campaignId === selectedCampaign) : adSets;
        break;
      case "ads":
        if (selectedAdSet) {
          items = ads.filter(ad => ad.adSetId === selectedAdSet);
        } else if (selectedCampaign) {
          items = ads.filter(ad => ad.campaignId === selectedCampaign);
        } else {
          items = ads;
        }
        break;
      case "audiences":
        items = audiences;
        break;
    }
    
    // Then, filter by ad account
    if (selectedAdAccount) {
      if (viewMode === "campaigns") {
        items = (items as ICampaign[]).filter(campaign => campaign.adAccountId === selectedAdAccount);
      } else if (viewMode === "adsets") {
        const campaignIds = campaigns
          .filter(campaign => campaign.adAccountId === selectedAdAccount)
          .map(campaign => campaign._id);
        items = (items as IAdSet[]).filter(adSet => campaignIds.includes(adSet.campaignId));
      } else if (viewMode === "ads") {
        const campaignIds = campaigns
          .filter(campaign => campaign.adAccountId === selectedAdAccount)
          .map(campaign => campaign._id);
        items = (items as IAd[]).filter(ad => campaignIds.includes(ad.campaignId));
      }
      // Audiences are account-agnostic in this mock implementation
    }
    
    // Next, apply search filter
    if (searchTerm) {
      items = items.filter((item) => {
        const itemName = "name" in item ? item.name.toLowerCase() : "";
        return itemName.includes(searchTerm.toLowerCase());
      });
    }
    
    // Apply status filter
    if (statusFilter && viewMode !== "audiences") {
      items = items.filter((item) => {
        return "status" in item && item.status === statusFilter;
      });
    }
    
    // Apply objective filter (campaigns only)
    if (objectiveFilter && viewMode === "campaigns") {
      items = (items as ICampaign[]).filter((campaign) => campaign.objective === objectiveFilter);
    }
    
    // Apply date range filter
    // In a real implementation, you would check if the item was active during the selected period
    
    return items;
  };

  const filteredItems = getFilteredItems();

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setObjectiveFilter("");
    setDateRangeFilter("last7days");
    setDateRange({ start: "", end: "" });
  };

  // Get breadcrumb based on selected items
  const getBreadcrumb = () => {
    const breadcrumb = [];
    
    if (viewMode === "campaigns" || viewMode === "adsets" || viewMode === "ads") {
      breadcrumb.push({
        label: "Campaigns",
        onClick: () => {
          setViewMode("campaigns");
          setSelectedCampaign(null);
          setSelectedAdSet(null);
        },
        active: viewMode === "campaigns"
      });
    }
    
    if (viewMode === "adsets" || viewMode === "ads") {
      const campaign = campaigns.find(c => c._id === selectedCampaign);
      if (campaign) {
        breadcrumb.push({
          label: campaign.name,
          onClick: () => {
            setViewMode("adsets");
            setSelectedAdSet(null);
          },
          active: viewMode === "adsets"
        });
      }
    }
    
    if (viewMode === "ads" && selectedAdSet) {
      const adSet = adSets.find(a => a._id === selectedAdSet);
      if (adSet) {
        breadcrumb.push({
          label: adSet.name,
          onClick: () => {
            setViewMode("ads");
          },
          active: true
        });
      }
    }
    
    return breadcrumb;
  };

  // Helper function to format currency
  const formatCurrency = (amount: number, currency: string = "EUR") => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Helper function to format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 0) {
      const hourDiff = Math.floor(diff / (1000 * 60 * 60));
      if (hourDiff === 0) {
        const minuteDiff = Math.floor(diff / (1000 * 60));
        return `Il y a ${minuteDiff} minute${minuteDiff !== 1 ? 's' : ''}`;
      }
      return `Il y a ${hourDiff} heure${hourDiff !== 1 ? 's' : ''}`;
    } else if (dayDiff === 1) {
      return "Hier";
    } else if (dayDiff < 7) {
      return `Il y a ${dayDiff} jour${dayDiff !== 1 ? 's' : ''}`;
    } else {
      return formatDate(dateString);
    }
  };

  // Helper function to format percentage
  const formatPercentage = (value: number) => {
    return value.toFixed(2) + "%";
  };

  // Helper function to format number
  const formatNumber = (value: number) => {
    return value.toLocaleString('fr-FR');
  };

  return (
    <ThemeProvider>
      <div className={`flex h-screen ${isDarkMode ? 'bg-gradient-to-b from-[#18191A] to-[#242526]' : 'bg-gradient-to-b from-[#F0F2F5] to-[#FFFFFF]'}`}>
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          <Header />

          <main className="flex-1 overflow-hidden flex flex-col">
            <div className="max-w-full h-full flex flex-col">
              {/* Dashboard Header with Stats */}
              <div className={`${isDarkMode ? 'bg-[#242526] border-[#3A3B3C]' : 'bg-white border-[#E4E6EB]'} border-b px-4 sm:px-6 lg:px-8 py-4`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                  <div className="relative">
                    <div className="absolute -left-3 md:-left-5 top-1 w-1.5 h-12 bg-gradient-to-b from-[#1877F2] to-[#4267B2] rounded-full"></div>
                    <h1 className={`text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode ? 'from-[#1877F2] to-[#4267B2]' : 'from-[#1877F2] to-[#4267B2]'} mb-1 pl-2`}>Facebook Ads</h1>
                    <p className={`${isDarkMode ? 'text-[#E4E6EB] opacity-90' : 'text-[#4267B2] opacity-90'} pl-2`}>Gérez vos campagnes publicitaires Facebook depuis votre CRM</p>
                    <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-[#1877F2] opacity-10 rounded-full blur-3xl"></div>
                  </div>
                  
                  <div className="flex items-center gap-3 self-end">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateAdModalOpen(true)}
                      className={`${isDarkMode ? 'border-[#1877F2] text-[#E4E6EB] hover:bg-[#3A3B3C]' : 'border-[#1877F2] text-[#1877F2] hover:bg-[#E7F3FF]'} transition-colors rounded-lg px-4 py-2 flex items-center shadow-sm hover:shadow`}
                    >
                      <PlusCircleIcon className="h-4 w-4 mr-2" />
                      Créer une publicité
                    </Button>
                    <Button
                      onClick={() => setIsConnectAccountModalOpen(true)}
                      className={`${isDarkMode ? 'bg-gradient-to-r from-[#1877F2] to-[#4267B2] hover:from-[#0A66C2] hover:to-[#385898]' : 'bg-gradient-to-r from-[#1877F2] to-[#4267B2] hover:from-[#0A66C2] hover:to-[#385898]'} text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg`}
                    >
                      <PlusCircleIcon className="h-4 w-4 mr-2" />
                      Ajouter un compte
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className={`${isDarkMode ? 'bg-[#242526] border-[#3A3B3C]' : 'bg-white border-[#E4E6EB]'} backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border hover:border-[#1877F2] transition-colors overflow-hidden relative group`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1877F2] to-[#4267B2] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#1877F2] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'} font-medium`}>Dépenses totales</p>
                        <div className="flex items-center">
                          <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'} mt-1`}>{formatCurrency(stats.totalSpend)}</p>
                        </div>
                        <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#1877F2] opacity-60'} mt-1`}>sur tous les comptes</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#1877F2] to-[#4267B2] shadow-lg">
                        <CurrencyDollarIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className={`${isDarkMode ? 'bg-[#242526] border-[#3A3B3C]' : 'bg-white border-[#E4E6EB]'} backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border hover:border-[#1877F2] transition-colors overflow-hidden relative group`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1877F2] to-[#4267B2] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#1877F2] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'} font-medium`}>Dépenses aujourd&apos;hui</p>
                        <div className="flex items-center">
                          <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'} mt-1`}>{formatCurrency(stats.todaySpend)}</p>
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">+8%</span>
                        </div>
                        <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#1877F2] opacity-60'} mt-1`}>vs. hier</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#1877F2] to-[#4267B2] shadow-lg">
                        <CalendarIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className={`${isDarkMode ? 'bg-[#242526] border-[#3A3B3C]' : 'bg-white border-[#E4E6EB]'} backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border hover:border-[#1877F2] transition-colors overflow-hidden relative group`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1877F2] to-[#4267B2] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#1877F2] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'} font-medium`}>Publicités actives</p>
                        <div className="flex items-center">
                          <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'} mt-1`}>{stats.activeAdsCount}</p>
                        </div>
                        <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#1877F2] opacity-60'} mt-1`}>sur tous les comptes</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#1877F2] to-[#4267B2] shadow-lg">
                        <CheckCircleIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className={`${isDarkMode ? 'bg-[#242526] border-[#3A3B3C]' : 'bg-white border-[#E4E6EB]'} backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border hover:border-[#1877F2] transition-colors overflow-hidden relative group`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1877F2] to-[#4267B2] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#1877F2] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'} font-medium`}>CTR moyen</p>
                        <div className="flex items-center">
                          <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'} mt-1`}>{formatPercentage(stats.averageCTR)}</p>
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Bon</span>
                        </div>
                        <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#1877F2] opacity-60'} mt-1`}>taux de clics</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#1877F2] to-[#4267B2] shadow-lg">
                        <ChartBarIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className={`${isDarkMode ? 'bg-[#242526] border-[#3A3B3C]' : 'bg-white border-[#E4E6EB]'} backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border hover:border-[#1877F2] transition-colors overflow-hidden relative group`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1877F2] to-[#4267B2] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#1877F2] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'} font-medium`}>CPC moyen</p>
                        <div className="flex items-center">
                          <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'} mt-1`}>{formatCurrency(stats.averageCPC)}</p>
                          <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">Moyen</span>
                        </div>
                        <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#1877F2] opacity-60'} mt-1`}>coût par clic</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#1877F2] to-[#4267B2] shadow-lg">
                        <CurrencyDollarIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                    className={`${isDarkMode ? 'bg-[#242526] border-[#3A3B3C]' : 'bg-white border-[#E4E6EB]'} backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border hover:border-[#1877F2] transition-colors overflow-hidden relative group`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1877F2] to-[#4267B2] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-[#1877F2] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'} font-medium`}>Conversions</p>
                        <div className="flex items-center">
                          <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'} mt-1`}>{formatNumber(stats.totalConversions)}</p>
                        </div>
                        <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#1877F2] opacity-60'} mt-1`}>tous comptes confondus</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#1877F2] to-[#4267B2] shadow-lg">
                        <CheckIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Main Content - Facebook Ads Interface */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - View Selector & Filters */}
                <div className={`w-full md:w-72 border-r ${isDarkMode ? 'border-[#3A3B3C] bg-[#242526]' : 'border-[#E4E6EB] bg-white'} flex flex-col`}>
                  {/* Account selector and search */}
                  <div className={`p-4 border-b ${isDarkMode ? 'border-[#3A3B3C]' : 'border-[#E4E6EB]'}`}>
                    <select
                      value={selectedAdAccount || ""}
                      onChange={(e) => {
                        setSelectedAdAccount(e.target.value);
                        setSelectedCampaign(null);
                        setSelectedAdSet(null);
                      }}
                      className={`w-full ${
                        isDarkMode 
                          ? 'bg-[#3A3B3C] border-[#3A3B3C] text-[#E4E6EB] focus:ring-[#1877F2] focus:border-[#1877F2]' 
                          : 'bg-[#F0F2F5] border-[#E4E6EB] text-[#1877F2] focus:ring-[#1877F2] focus:border-[#1877F2]'
                      } rounded-lg text-sm mb-3`}
                    >
                      {adAccounts.map(account => (
                        <option key={account._id} value={account._id} disabled={account.status === "disabled"}>
                          {account.name} ({account.accountId}) 
                          {account.status === "disabled" ? " - Désactivé" : ""}
                        </option>
                      ))}
                    </select>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon className={`h-4 w-4 ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#1877F2] opacity-50'}`} />
                      </div>
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        className={`pl-10 pr-10 py-2.5 w-full rounded-lg ${
                          isDarkMode 
                            ? 'border-[#3A3B3C] bg-[#3A3B3C] text-[#E4E6EB] focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2]' 
                            : 'border-[#E4E6EB] bg-[#F0F2F5] text-[#1877F2] focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2]'
                        } text-sm`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <button 
                          onClick={() => setSearchTerm("")}
                          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-[#B0B3B8] hover:text-[#E4E6EB]' : 'text-[#1877F2] hover:text-[#4267B2]'}`}
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* View Mode Selector */}
                  <div className={`p-4 border-b ${isDarkMode ? 'border-[#3A3B3C]' : 'border-[#E4E6EB]'}`}>
                    <h2 className={`text-sm font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'} mb-3`}>Affichage</h2>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setViewMode("campaigns");
                          setSelectedCampaign(null);
                          setSelectedAdSet(null);
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                          viewMode === "campaigns"
                            ? isDarkMode 
                              ? 'bg-[#1877F2] text-white' 
                              : 'bg-[#E7F3FF] text-[#1877F2]'
                            : isDarkMode 
                              ? 'text-[#E4E6EB] hover:bg-[#3A3B3C]' 
                              : 'text-[#050505] hover:bg-[#F0F2F5]'
                        } transition-colors`}
                      >
                        <PresentationChartLineIcon className="h-5 w-5" />
                        <span className="text-sm">Campagnes</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setViewMode("adsets");
                          setSelectedAdSet(null);
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                          viewMode === "adsets"
                            ? isDarkMode 
                              ? 'bg-[#1877F2] text-white' 
                              : 'bg-[#E7F3FF] text-[#1877F2]'
                            : isDarkMode 
                              ? 'text-[#E4E6EB] hover:bg-[#3A3B3C]' 
                              : 'text-[#050505] hover:bg-[#F0F2F5]'
                        } transition-colors`}
                      >
                        <UsersIcon className="h-5 w-5" />
                        <span className="text-sm">Ensembles de publicités</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setViewMode("ads");
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                          viewMode === "ads"
                            ? isDarkMode 
                              ? 'bg-[#1877F2] text-white' 
                              : 'bg-[#E7F3FF] text-[#1877F2]'
                            : isDarkMode 
                              ? 'text-[#E4E6EB] hover:bg-[#3A3B3C]' 
                              : 'text-[#050505] hover:bg-[#F0F2F5]'
                        } transition-colors`}
                      >
                        <PhotoIcon className="h-5 w-5" />
                        <span className="text-sm">Publicités</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setViewMode("audiences");
                          setSelectedCampaign(null);
                          setSelectedAdSet(null);
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                          viewMode === "audiences"
                            ? isDarkMode 
                              ? 'bg-[#1877F2] text-white' 
                              : 'bg-[#E7F3FF] text-[#1877F2]'
                            : isDarkMode 
                              ? 'text-[#E4E6EB] hover:bg-[#3A3B3C]' 
                              : 'text-[#050505] hover:bg-[#F0F2F5]'
                        } transition-colors`}
                      >
                        <UsersIcon className="h-5 w-5" />
                        <span className="text-sm">Audiences</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Filters */}
                  <div className={`p-4 border-b ${isDarkMode ? 'border-[#3A3B3C]' : 'border-[#E4E6EB]'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className={`text-sm font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'}`}>Filtres</h2>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                        className={`h-7 w-7 p-0 rounded-full flex items-center justify-center ${
                          isDarkMode ? 'text-[#B0B3B8] hover:bg-[#3A3B3C]' : 'text-[#1877F2] hover:bg-[#F0F2F5]'
                        } transition-colors`}
                      >
                        {isFiltersVisible ? (
                          <XMarkIcon className="h-4 w-4" />
                        ) : (
                          <AdjustmentsHorizontalIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    <AnimatePresence>
                      {isFiltersVisible && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-3 overflow-hidden"
                        >
                          {viewMode !== "audiences" && (
                            <div>
                              <label className={`block text-xs font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'} mb-1`}>Statut</label>
                              <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className={`w-full rounded-lg ${
                                  isDarkMode 
                                    ? 'border-[#3A3B3C] bg-[#3A3B3C] text-[#E4E6EB] focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2]'
                                    : 'border-[#E4E6EB] bg-[#F0F2F5] text-[#1877F2] focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2]'
                                } text-sm`}
                              >
                                <option value="">Tous les statuts</option>
                                <option value="active">Actif</option>
                                <option value="paused">En pause</option>
                                <option value="completed">Terminé</option>
                                <option value="archived">Archivé</option>
                                <option value="draft">Brouillon</option>
                                {viewMode === "ads" && (
                                  <>
                                    <option value="in_review">En cours d&apos;examen</option>
                                    <option value="rejected">Rejeté</option>
                                  </>
                                )}
                              </select>
                            </div>
                          )}
                          
                          {viewMode === "campaigns" && (
                            <div>
                              <label className={`block text-xs font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'} mb-1`}>Objectif</label>
                              <select
                                value={objectiveFilter}
                                onChange={(e) => setObjectiveFilter(e.target.value)}
                                className={`w-full rounded-lg ${
                                  isDarkMode 
                                    ? 'border-[#3A3B3C] bg-[#3A3B3C] text-[#E4E6EB] focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2]'
                                    : 'border-[#E4E6EB] bg-[#F0F2F5] text-[#1877F2] focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2]'
                                } text-sm`}
                              >
                                <option value="">Tous les objectifs</option>
                                <option value="awareness">Notoriété</option>
                                <option value="traffic">Trafic</option>
                                <option value="engagement">Engagement</option>
                                <option value="leads">Génération de leads</option>
                                <option value="app_promotion">Promotion d&apos;applications</option>
                                <option value="sales">Ventes</option>
                              </select>
                            </div>
                          )}
                          
                          <div>
                            <label className={`block text-xs font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'} mb-1`}>Période</label>
                            <select
                              value={dateRangeFilter}
                              onChange={(e) => setDateRangeFilter(e.target.value as "today" | "yesterday" | "last7days" | "last30days" | "thisMonth" | "lastMonth" | "custom")}
                              className={`w-full rounded-lg ${
                                isDarkMode 
                                  ? 'border-[#3A3B3C] bg-[#3A3B3C] text-[#E4E6EB] focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2]'
                                  : 'border-[#E4E6EB] bg-[#F0F2F5] text-[#1877F2] focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2]'
                              } text-sm`}
                            >
                              <option value="today">Aujourd&apos;hui</option>
                              <option value="yesterday">Hier</option>
                              <option value="last7days">7 derniers jours</option>
                              <option value="last30days">30 derniers jours</option>
                              <option value="thisMonth">Ce mois-ci</option>
                              <option value="lastMonth">Mois dernier</option>
                              <option value="custom">Personnalisée</option>
                            </select>
                          </div>
                          
                          {dateRangeFilter === "custom" && (
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className={`block text-xs font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'} mb-1`}>Début</label>
                                <input
                                  type="date"
                                  value={dateRange.start}
                                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                  className={`w-full rounded-lg ${
                                    isDarkMode 
                                      ? 'border-[#3A3B3C] bg-[#3A3B3C] text-[#E4E6EB] focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2]'
                                      : 'border-[#E4E6EB] bg-[#F0F2F5] text-[#1877F2] focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2]'
                                  } text-sm`}
                                />
                              </div>
                              <div>
                                <label className={`block text-xs font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'} mb-1`}>Fin</label>
                                <input
                                  type="date"
                                  value={dateRange.end}
                                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                  className={`w-full rounded-lg ${
                                    isDarkMode 
                                      ? 'border-[#3A3B3C] bg-[#3A3B3C] text-[#E4E6EB] focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2]'
                                      : 'border-[#E4E6EB] bg-[#F0F2F5] text-[#1877F2] focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2]'
                                  } text-sm`}
                                />
                              </div>
                            </div>
                          )}
                          
                          {(statusFilter || objectiveFilter || dateRangeFilter !== "last7days") && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={clearFilters}
                              className={`mt-2 ${isDarkMode ? 'text-[#B0B3B8] hover:text-[#E4E6EB]' : 'text-[#1877F2] hover:text-[#4267B2]'} text-xs`}
                            >
                              Effacer les filtres
                            </Button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Quick Stats */}
                  <div className="p-4">
                    <h2 className={`text-sm font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'} mb-3`}>Votre compte</h2>
                    
                    {selectedAdAccount && (
                      <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'} mb-4`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            <img 
                              src={adAccounts.find(a => a._id === selectedAdAccount)?.businessLogo || ""} 
                              alt={adAccounts.find(a => a._id === selectedAdAccount)?.businessName || "Business"} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'}`}>
                              {adAccounts.find(a => a._id === selectedAdAccount)?.name}
                            </h3>
                            <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>
                              {adAccounts.find(a => a._id === selectedAdAccount)?.accountId}
                            </p>
                          </div>
                        </div>
                        
                        <div className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'} space-y-1`}>
                          <div className="flex justify-between">
                            <span>Dépense aujourd&apos;hui:</span>
                            <span className="font-medium">{formatCurrency(adAccounts.find(a => a._id === selectedAdAccount)?.dailySpend || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Dépense totale:</span>
                            <span className="font-medium">{formatCurrency(adAccounts.find(a => a._id === selectedAdAccount)?.totalSpent || 0)}</span>
                          </div>
                          {adAccounts.find(a => a._id === selectedAdAccount)?.spendCap && (
                            <div className="flex justify-between">
                              <span>Limite de dépense:</span>
                              <span className="font-medium">{formatCurrency(adAccounts.find(a => a._id === selectedAdAccount)?.spendCap || 0)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className={`w-full justify-start ${
                          isDarkMode 
                            ? 'border-[#3A3B3C] text-[#E4E6EB] hover:bg-[#3A3B3C]' 
                            : 'border-[#E4E6EB] text-[#1877F2] hover:bg-[#F0F2F5]'
                        } rounded-lg transition-colors`}
                      >
                        <BellIcon className="h-4 w-4 mr-2" />
                        <span className="text-sm">Notifications</span>
                        <span className={`ml-auto px-1.5 py-0.5 rounded-full text-xs ${
                          isDarkMode ? 'bg-[#1877F2] text-white' : 'bg-[#E7F3FF] text-[#1877F2]'
                        }`}>3</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className={`w-full justify-start ${
                          isDarkMode 
                            ? 'border-[#3A3B3C] text-[#E4E6EB] hover:bg-[#3A3B3C]' 
                            : 'border-[#E4E6EB] text-[#1877F2] hover:bg-[#F0F2F5]'
                        } rounded-lg transition-colors`}
                      >
                        <PresentationChartLineIcon className="h-4 w-4 mr-2" />
                        <span className="text-sm">Rapports</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className={`w-full justify-start ${
                          isDarkMode 
                            ? 'border-[#3A3B3C] text-[#E4E6EB] hover:bg-[#3A3B3C]' 
                            : 'border-[#E4E6EB] text-[#1877F2] hover:bg-[#F0F2F5]'
                        } rounded-lg transition-colors`}
                      >
                        <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                        <span className="text-sm">Paramètres du compte</span>
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Right Panel - Main Content View */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Breadcrumb & Actions */}
                  <div className={`border-b ${isDarkMode ? 'border-[#3A3B3C] bg-[#242526]' : 'border-[#E4E6EB] bg-white'} p-4 flex items-center justify-between`}>
                    <div className="flex items-center">
                      {getBreadcrumb().length > 0 ? (
                        <div className="flex items-center">
                          {getBreadcrumb().map((item, index) => (
                            <div key={index} className="flex items-center">
                              {index > 0 && (
                                <span className={`mx-2 ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>/</span>
                              )}
                              <button
                                onClick={item.onClick}
                                className={`text-sm ${
                                  item.active
                                    ? isDarkMode ? 'text-[#E4E6EB] font-medium' : 'text-[#1877F2] font-medium'
                                    : isDarkMode ? 'text-[#B0B3B8] hover:text-[#E4E6EB]' : 'text-[#65676B] hover:text-[#1877F2]'
                                }`}
                              >
                                {item.label}
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'}`}>
                          {viewMode === "campaigns" && "Campagnes"}
                          {viewMode === "adsets" && "Ensembles de publicités"}
                          {viewMode === "ads" && "Publicités"}
                          {viewMode === "audiences" && "Audiences"}
                        </h2>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className={`${isDarkMode ? 'border-[#3A3B3C] text-[#E4E6EB] hover:bg-[#3A3B3C]' : 'border-[#E4E6EB] text-[#1877F2] hover:bg-[#F0F2F5]'} transition-colors rounded-lg`}
                      >
                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                        Actualiser
                      </Button>
                      
                      <Button
                        onClick={() => setIsCreateAdModalOpen(true)}
                        className={`${isDarkMode ? 'bg-[#1877F2] hover:bg-[#0A66C2]' : 'bg-[#1877F2] hover:bg-[#0A66C2]'} text-white transition-colors rounded-lg`}
                      >
                        <PlusCircleIcon className="h-4 w-4 mr-2" />
                        {viewMode === "campaigns" && "Nouvelle campagne"}
                        {viewMode === "adsets" && "Nouvel ensemble"}
                        {viewMode === "ads" && "Nouvelle publicité"}
                        {viewMode === "audiences" && "Nouvelle audience"}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Main Content */}
                  <div className="flex-1 overflow-auto p-4">
                    {loading ? (
                      <div className="flex flex-col justify-center items-center p-12">
                        <div className="relative">
                          <div className={`absolute inset-0 bg-gradient-to-r ${isDarkMode ? 'from-[#1877F2] to-[#4267B2]' : 'from-[#1877F2] to-[#4267B2]'} rounded-full blur opacity-30 animate-pulse`}></div>
                          <div className={`relative animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${isDarkMode ? 'border-[#1877F2]' : 'border-[#1877F2]'}`}></div>
                        </div>
                        <p className={`mt-4 ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'} animate-pulse`}>Chargement des données...</p>
                      </div>
                    ) : error ? (
                      <div className="p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
                        <p className="text-red-700 mb-4">{error}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2 text-red-600 border-red-300 hover:bg-red-100 rounded-lg"
                          onClick={() => window.location.reload()}
                        >
                          Rafraîchir
                        </Button>
                      </div>
                    ) : filteredItems.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="relative mx-auto mb-6 w-20 h-20">
                          <div className={`absolute inset-0 ${isDarkMode ? 'bg-[#1877F2]' : 'bg-[#1877F2]'} opacity-20 rounded-full animate-pulse`}></div>
                          {viewMode === "campaigns" && <PresentationChartLineIcon className={`h-20 w-20 ${isDarkMode ? 'text-[#1877F2]' : 'text-[#1877F2]'} opacity-60`} />}
                          {viewMode === "adsets" && <UsersIcon className={`h-20 w-20 ${isDarkMode ? 'text-[#1877F2]' : 'text-[#1877F2]'} opacity-60`} />}
                          {viewMode === "ads" && <PhotoIcon className={`h-20 w-20 ${isDarkMode ? 'text-[#1877F2]' : 'text-[#1877F2]'} opacity-60`} />}
                          {viewMode === "audiences" && <UsersIcon className={`h-20 w-20 ${isDarkMode ? 'text-[#1877F2]' : 'text-[#1877F2]'} opacity-60`} />}
                        </div>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'} mb-2`}>Aucun résultat</h3>
                        <p className={`${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#1877F2] opacity-75'} mb-4`}>Aucun élément ne correspond à vos critères de recherche.</p>
                        <Button 
                          variant="outline" 
                          onClick={clearFilters}
                          className={`${
                            isDarkMode 
                              ? 'border-[#1877F2] bg-[#242526] text-[#E4E6EB] hover:bg-[#3A3B3C]' 
                              : 'border-[#1877F2] bg-white text-[#1877F2] hover:bg-[#E7F3FF]'
                          } transition-all rounded-lg py-2 px-4`}
                        >
                          <XMarkIcon className="h-4 w-4 mr-2" />
                          Effacer les filtres
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Campaigns View */}
                        {viewMode === "campaigns" && (
                          <div className="grid grid-cols-1 gap-4">
                            {(filteredItems as ICampaign[]).map((campaign, index) => (
                              <motion.div
                                key={campaign._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.2 }}
                                className={`${
                                  isDarkMode ? 'bg-[#242526] border-[#3A3B3C]' : 'bg-white border-[#E4E6EB]'
                                } border rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow`}
                              >
                                <div className="p-4">
                                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h3 
                                          className={`text-lg font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'} cursor-pointer hover:underline`}
                                          onClick={() => {
                                            setViewMode("adsets");
                                            setSelectedCampaign(campaign._id);
                                          }}
                                        >
                                          {campaign.name}
                                        </h3>
                                        <span 
                                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                            campaign.status === "active" 
                                              ? isDarkMode ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800' 
                                              : campaign.status === "paused"
                                                ? isDarkMode ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-100 text-yellow-800'
                                                : isDarkMode ? 'bg-[#3A3B3C] text-[#B0B3B8]' : 'bg-[#F0F2F5] text-[#65676B]'
                                          }`}
                                        >
                                          {campaign.status === "active" ? "Actif" : 
                                           campaign.status === "paused" ? "En pause" : 
                                           campaign.status === "completed" ? "Terminé" : 
                                           campaign.status === "archived" ? "Archivé" : "Brouillon"}
                                        </span>
                                      </div>
                                      
                                      <div className="flex flex-wrap gap-2 mb-2">
                                        <span 
                                          className="text-xs px-2 py-0.5 rounded-full"
                                          style={{ 
                                            backgroundColor: isDarkMode 
                                              ? objectiveColors[campaign.objective as keyof typeof objectiveColors]?.dark?.bg || '#3A3B3C'
                                              : objectiveColors[campaign.objective as keyof typeof objectiveColors]?.light?.bg || '#E7F3FF',
                                            color: isDarkMode 
                                              ? objectiveColors[campaign.objective as keyof typeof objectiveColors]?.dark?.text || '#E4E6EB'
                                              : objectiveColors[campaign.objective as keyof typeof objectiveColors]?.light?.text || '#1877F2'
                                          }}
                                        >
                                          {campaign.objective === "awareness" ? "Notoriété" : 
                                           campaign.objective === "traffic" ? "Trafic" : 
                                           campaign.objective === "engagement" ? "Engagement" : 
                                           campaign.objective === "leads" ? "Génération de leads" : 
                                           campaign.objective === "app_promotion" ? "Promotion d'applications" : "Ventes"}
                                        </span>
                                        
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                          isDarkMode ? 'bg-[#3A3B3C] text-[#B0B3B8]' : 'bg-[#F0F2F5] text-[#65676B]'
                                        }`}>
                                          Budget: {formatCurrency(campaign.budget)} {campaign.budgetType === "daily" ? "/ jour" : "total"}
                                        </span>
                                        
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                          isDarkMode ? 'bg-[#3A3B3C] text-[#B0B3B8]' : 'bg-[#F0F2F5] text-[#65676B]'
                                        }`}>
                                          Début: {formatDate(campaign.startDate)}
                                          {campaign.endDate && ` - Fin: ${formatDate(campaign.endDate)}`}
                                        </span>
                                      </div>
                                      
                                      <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>
                                        Dernière modification: {formatTimeAgo(campaign.lastEditedAt)}
                                      </p>
                                    </div>
                                    
                                    <div className="flex sm:flex-col sm:items-end gap-2 sm:min-w-[100px]">
                                      <div className={`${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'} px-2 py-1 rounded`}>
                                        <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>Dépensé</p>
                                        <p className={`text-base font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'}`}>
                                          {formatCurrency(campaign.totalSpent)}
                                        </p>
                                      </div>
                                      <div className="flex gap-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className={`h-8 w-8 rounded-full ${isDarkMode ? 'text-[#B0B3B8] hover:bg-[#3A3B3C]' : 'text-[#65676B] hover:bg-[#F0F2F5]'}`}
                                        >
                                          <PencilSquareIcon className="h-4 w-4" />
                                        </Button>
                                        
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className={`h-8 w-8 rounded-full ${isDarkMode ? 'text-[#B0B3B8] hover:bg-[#3A3B3C]' : 'text-[#65676B] hover:bg-[#F0F2F5]'}`}
                                        >
                                          <EllipsisHorizontalIcon className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                                    <div className={`${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'} p-2 rounded-lg`}>
                                      <div className="flex justify-between items-center mb-1">
                                        <span className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>Impressions</span>
                                      </div>
                                      <p className={`text-base font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                                        {formatNumber(campaign.totalImpressions)}
                                      </p>
                                    </div>
                                    
                                    <div className={`${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'} p-2 rounded-lg`}>
                                      <div className="flex justify-between items-center mb-1">
                                        <span className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>Clics</span>
                                      </div>
                                      <p className={`text-base font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                                        {formatNumber(campaign.totalClicks)}
                                      </p>
                                    </div>
                                    
                                    <div className={`${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'} p-2 rounded-lg`}>
                                      <div className="flex justify-between items-center mb-1">
                                        <span className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>CTR</span>
                                      </div>
                                      <p className={`text-base font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                                        {formatPercentage(campaign.ctr)}
                                      </p>
                                    </div>
                                    
                                    <div className={`${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'} p-2 rounded-lg`}>
                                      <div className="flex justify-between items-center mb-1">
                                        <span className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>CPC</span>
                                      </div>
                                      <p className={`text-base font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                                        {formatCurrency(campaign.cpc)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className={`flex border-t ${isDarkMode ? 'border-[#3A3B3C]' : 'border-[#E4E6EB]'} divide-x ${isDarkMode ? 'divide-[#3A3B3C]' : 'divide-[#E4E6EB]'}`}>
                                  <button
                                    className={`flex-1 py-2 text-sm font-medium ${isDarkMode ? 'text-[#E4E6EB] hover:bg-[#3A3B3C]' : 'text-[#1877F2] hover:bg-[#F0F2F5]'} transition-colors flex items-center justify-center`}
                                    onClick={() => {
                                      setViewMode("adsets");
                                      setSelectedCampaign(campaign._id);
                                    }}
                                  >
                                    <UsersIcon className="h-4 w-4 mr-1" />
                                    Ensembles ({campaign.adSetCount})
                                  </button>
                                  
                                  <button
                                    className={`flex-1 py-2 text-sm font-medium ${isDarkMode ? 'text-[#E4E6EB] hover:bg-[#3A3B3C]' : 'text-[#1877F2] hover:bg-[#F0F2F5]'} transition-colors flex items-center justify-center`}
                                    onClick={() => {
                                      setViewMode("ads");
                                      setSelectedCampaign(campaign._id);
                                    }}
                                  >
                                    <PhotoIcon className="h-4 w-4 mr-1" />
                                    Publicités ({campaign.adCount})
                                  </button>
                                  
                                  <button
                                    className={`flex-1 py-2 text-sm font-medium ${isDarkMode ? 'text-[#E4E6EB] hover:bg-[#3A3B3C]' : 'text-[#1877F2] hover:bg-[#F0F2F5]'} transition-colors flex items-center justify-center`}
                                  >
                                    <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                                    Dupliquer
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                        
                        {/* Ad Sets View */}
                        {viewMode === "adsets" && (
                          <div className="grid grid-cols-1 gap-4">
                            {(filteredItems as IAdSet[]).map((adSet, index) => (
                              <motion.div
                                key={adSet._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.2 }}
                                className={`${
                                  isDarkMode ? 'bg-[#242526] border-[#3A3B3C]' : 'bg-white border-[#E4E6EB]'
                                } border rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow`}
                              >
                                <div className="p-4">
                                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h3 
                                          className={`text-lg font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'} cursor-pointer hover:underline`}
                                          onClick={() => {
                                            setViewMode("ads");
                                            setSelectedAdSet(adSet._id);
                                          }}
                                        >
                                          {adSet.name}
                                        </h3>
                                        <span 
                                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                            adSet.status === "active" 
                                              ? isDarkMode ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800' 
                                              : adSet.status === "paused"
                                                ? isDarkMode ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-100 text-yellow-800'
                                                : isDarkMode ? 'bg-[#3A3B3C] text-[#B0B3B8]' : 'bg-[#F0F2F5] text-[#65676B]'
                                          }`}
                                        >
                                          {adSet.status === "active" ? "Actif" : 
                                           adSet.status === "paused" ? "En pause" : 
                                           adSet.status === "completed" ? "Terminé" : 
                                           adSet.status === "archived" ? "Archivé" : "Brouillon"}
                                        </span>
                                      </div>
                                      
                                      <div className="flex flex-wrap gap-2 mb-2">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                          isDarkMode ? 'bg-[#3A3B3C] text-[#B0B3B8]' : 'bg-[#F0F2F5] text-[#65676B]'
                                        }`}>
                                          Budget: {formatCurrency(adSet.budget)} {adSet.budgetType === "daily" ? "/ jour" : "total"}
                                        </span>
                                        
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                          isDarkMode ? 'bg-[#3A3B3C] text-[#B0B3B8]' : 'bg-[#F0F2F5] text-[#65676B]'
                                        }`}>
                                          {adSet.optimizationGoal === "impressions" ? "Optimisé pour les impressions" : 
                                           adSet.optimizationGoal === "link_clicks" ? "Optimisé pour les clics" : 
                                           adSet.optimizationGoal === "page_likes" ? "Optimisé pour les likes" : 
                                           adSet.optimizationGoal === "landing_page_views" ? "Optimisé pour les vues de page" : 
                                           adSet.optimizationGoal === "lead_generation" ? "Optimisé pour les leads" : 
                                           "Optimisé pour les conversions"}
                                        </span>
                                      </div>
                                      
                                      <div className={`p-2 mb-2 rounded ${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'}`}>
                                        <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                                          Ciblage:
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                          {adSet.targeting.locations && (
                                            <span className={`text-xs px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-[#242526] text-[#B0B3B8]' : 'bg-white text-[#65676B]'}`}>
                                              <GlobeAltIcon className="h-3 w-3 inline mr-0.5" />
                                              {adSet.targeting.locations.join(', ')}
                                            </span>
                                          )}
                                          
                                          {adSet.targeting.ageRange && (
                                            <span className={`text-xs px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-[#242526] text-[#B0B3B8]' : 'bg-white text-[#65676B]'}`}>
                                              <UsersIcon className="h-3 w-3 inline mr-0.5" />
                                              {adSet.targeting.ageRange.min} - {adSet.targeting.ageRange.max} ans
                                            </span>
                                          )}
                                          
                                          {adSet.targeting.interests && adSet.targeting.interests.length > 0 && (
                                            <span className={`text-xs px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-[#242526] text-[#B0B3B8]' : 'bg-white text-[#65676B]'}`}>
                                              <TagIcon className="h-3 w-3 inline mr-0.5" />
                                              Intérêts: {adSet.targeting.interests.join(', ')}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      
                                      <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>
                                        Début: {formatDate(adSet.startDate)}
                                        {adSet.endDate && ` - Fin: ${formatDate(adSet.endDate)}`}
                                      </p>
                                    </div>
                                    
                                    <div className="flex sm:flex-col sm:items-end gap-2 sm:min-w-[100px]">
                                      <div className={`${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'} px-2 py-1 rounded`}>
                                        <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>Dépensé</p>
                                        <p className={`text-base font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'}`}>
                                          {formatCurrency(adSet.totalSpent)}
                                        </p>
                                      </div>
                                      <div className="flex gap-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className={`h-8 w-8 rounded-full ${isDarkMode ? 'text-[#B0B3B8] hover:bg-[#3A3B3C]' : 'text-[#65676B] hover:bg-[#F0F2F5]'}`}
                                        >
                                          <PencilSquareIcon className="h-4 w-4" />
                                        </Button>
                                        
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className={`h-8 w-8 rounded-full ${isDarkMode ? 'text-[#B0B3B8] hover:bg-[#3A3B3C]' : 'text-[#65676B] hover:bg-[#F0F2F5]'}`}
                                        >
                                          <EllipsisHorizontalIcon className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                                    <div className={`${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'} p-2 rounded-lg`}>
                                      <div className="flex justify-between items-center mb-1">
                                        <span className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>Impressions</span>
                                      </div>
                                      <p className={`text-base font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                                        {formatNumber(adSet.totalImpressions)}
                                      </p>
                                    </div>
                                    
                                    <div className={`${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'} p-2 rounded-lg`}>
                                      <div className="flex justify-between items-center mb-1">
                                        <span className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>Clics</span>
                                      </div>
                                      <p className={`text-base font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                                        {formatNumber(adSet.totalClicks)}
                                      </p>
                                    </div>
                                    
                                    <div className={`${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'} p-2 rounded-lg`}>
                                      <div className="flex justify-between items-center mb-1">
                                        <span className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>CTR</span>
                                      </div>
                                      <p className={`text-base font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                                        {formatPercentage(adSet.ctr)}
                                      </p>
                                    </div>
                                    
                                    <div className={`${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'} p-2 rounded-lg`}>
                                      <div className="flex justify-between items-center mb-1">
                                        <span className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>CPC</span>
                                      </div>
                                      <p className={`text-base font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                                        {formatCurrency(adSet.cpc)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className={`flex border-t ${isDarkMode ? 'border-[#3A3B3C]' : 'border-[#E4E6EB]'} divide-x ${isDarkMode ? 'divide-[#3A3B3C]' : 'divide-[#E4E6EB]'}`}>
                                  <button
                                    className={`flex-1 py-2 text-sm font-medium ${isDarkMode ? 'text-[#E4E6EB] hover:bg-[#3A3B3C]' : 'text-[#1877F2] hover:bg-[#F0F2F5]'} transition-colors flex items-center justify-center`}
                                    onClick={() => {
                                      setViewMode("ads");
                                      setSelectedAdSet(adSet._id);
                                    }}
                                  >
                                    <PhotoIcon className="h-4 w-4 mr-1" />
                                    Publicités ({adSet.adCount})
                                  </button>
                                  
                                  <button
                                    className={`flex-1 py-2 text-sm font-medium ${isDarkMode ? 'text-[#E4E6EB] hover:bg-[#3A3B3C]' : 'text-[#1877F2] hover:bg-[#F0F2F5]'} transition-colors flex items-center justify-center`}
                                  >
                                    <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                                    Dupliquer
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                        
                        {/* Ads View */}
                        {viewMode === "ads" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(filteredItems as IAd[]).map((ad, index) => (
                              <motion.div
                                key={ad._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.2 }}
                                className={`${
                                  isDarkMode ? 'bg-[#242526] border-[#3A3B3C]' : 'bg-white border-[#E4E6EB]'
                                } border rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow`}
                                onClick={() => {
                                  setSelectedAd(ad);
                                  setIsAdDetailsModalOpen(true);
                                }}
                              >
                                <div className="relative aspect-video overflow-hidden">
                                  <img 
                                    src={ad.preview || ad.creative.imageUrl}
                                    alt={ad.name}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute top-2 right-2 flex gap-1">
                                    <span 
                                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                        ad.status === "active" 
                                          ? isDarkMode ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800' 
                                          : ad.status === "paused"
                                            ? isDarkMode ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-100 text-yellow-800'
                                            : ad.status === "in_review"
                                              ? isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'
                                              : ad.status === "rejected"
                                                ? isDarkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800'
                                                : isDarkMode ? 'bg-[#3A3B3C] text-[#B0B3B8]' : 'bg-[#F0F2F5] text-[#65676B]'
                                      }`}
                                    >
                                      {ad.status === "active" ? "Actif" : 
                                       ad.status === "paused" ? "En pause" : 
                                       ad.status === "completed" ? "Terminé" : 
                                       ad.status === "archived" ? "Archivé" : 
                                       ad.status === "in_review" ? "En examen" : 
                                       ad.status === "rejected" ? "Rejeté" : "Brouillon"}
                                    </span>
                                  </div>
                                </div>
                                <div className="p-3">
                                  <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'} mb-1 truncate`}>
                                    {ad.name}
                                  </h3>
                                  
                                  <p className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'} mb-2 line-clamp-2`}>
                                    {ad.creative.title}
                                  </p>
                                  
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {ad.labels && ad.labels.map(label => (
                                      <span 
                                        key={label}
                                        className="text-[10px] px-1.5 py-0.5 rounded-full font-medium truncate max-w-[100px]"
                                        style={{ 
                                          backgroundColor: isDarkMode 
                                            ? labelColors[label as keyof typeof labelColors]?.dark?.bg || '#3A3B3C'
                                            : labelColors[label as keyof typeof labelColors]?.light?.bg || '#E7F3FF',
                                          color: isDarkMode 
                                            ? labelColors[label as keyof typeof labelColors]?.dark?.text || '#E4E6EB'
                                            : labelColors[label as keyof typeof labelColors]?.light?.text || '#1877F2'
                                        }}
                                      >
                                        {label}
                                      </span>
                                    ))}
                                  </div>
                                  
                                  <div className="grid grid-cols-3 gap-2 mt-3">
                                    <div>
                                      <p className={`text-[10px] ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>Impressions</p>
                                      <p className={`text-xs font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                                        {formatNumber(ad.impressions)}
                                      </p>
                                    </div>
                                    
                                    <div>
                                      <p className={`text-[10px] ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>Clics</p>
                                      <p className={`text-xs font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                                        {formatNumber(ad.clicks)}
                                      </p>
                                    </div>
                                    
                                    <div>
                                      <p className={`text-[10px] ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>CTR</p>
                                      <p className={`text-xs font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                                        {formatPercentage(ad.ctr)}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-dashed ${isDarkMode ? 'border-[#3A3B3C]' : 'border-[#E4E6EB]'}">
                                    <div>
                                      <p className={`text-[10px] ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>Dépensé</p>
                                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#1877F2]'}`}>
                                        {formatCurrency(ad.spend)}
                                      </p>
                                    </div>
                                    
                                    <div className="flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`h-8 w-8 rounded-full ${isDarkMode ? 'text-[#B0B3B8] hover:bg-[#3A3B3C]' : 'text-[#65676B] hover:bg-[#F0F2F5]'}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                      >
                                        <PencilSquareIcon className="h-4 w-4" />
                                      </Button>
                                      
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`h-8 w-8 rounded-full ${isDarkMode ? 'text-[#B0B3B8] hover:bg-[#3A3B3C]' : 'text-[#65676B] hover:bg-[#F0F2F5]'}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                      >
                                        <EllipsisHorizontalIcon className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                        
                        {/* Audiences View */}
                        {viewMode === "audiences" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(filteredItems as IAudience[]).map((audience, index) => (
                              <motion.div
                                key={audience._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.2 }}
                                className={`${
                                  isDarkMode ? 'bg-[#242526] border-[#3A3B3C]' : 'bg-white border-[#E4E6EB]'
                                } border rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow p-4`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                                      {audience.name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        isDarkMode ? 'bg-[#3A3B3C] text-[#B0B3B8]' : 'bg-[#F0F2F5] text-[#65676B]'
                                      }`}>
                                        {audience.type === "saved_audience" ? "Audience enregistrée" : 
                                         audience.type === "custom_audience" ? "Audience personnalisée" : 
                                         "Audience similaire"}
                                      </span>
                                      
                                      {audience.isShared && (
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                          isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                          Partagée
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 w-8 rounded-full ${isDarkMode ? 'text-[#B0B3B8] hover:bg-[#3A3B3C]' : 'text-[#65676B] hover:bg-[#F0F2F5]'}`}
                                  >
                                    <EllipsisHorizontalIcon className="h-4 w-4" />
                                  </Button>
                                </div>
                                
                                {audience.description && (
                                  <p className={`text-sm ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'} mb-3`}>
                                    {audience.description}
                                  </p>
                                )}
                                
                                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#3A3B3C]' : 'bg-[#F0F2F5]'} mb-3`}>
                                  <div className="flex justify-between items-center">
                                    <span className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>
                                      Taille estimée
                                    </span>
                                    <span className={`text-base font-semibold ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>
                                      {audience.size > 1000000 
                                        ? `${(audience.size / 1000000).toFixed(1)}M` 
                                        : audience.size > 1000 
                                          ? `${(audience.size / 1000).toFixed(1)}K` 
                                          : audience.size}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                  {audience.source && (
                                    <div className="flex justify-between">
                                      <span className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>Source:</span>
                                      <span className={`text-xs ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>{audience.source}</span>
                                    </div>
                                  )}
                                  
                                  {audience.lastUsed && (
                                    <div className="flex justify-between">
                                      <span className={`text-xs ${isDarkMode ? 'text-[#B0B3B8]' : 'text-[#65676B]'}`}>Dernière utilisation:</span>
                                      <span className={`text-xs ${isDarkMode ? 'text-[#E4E6EB]' : 'text-[#050505]'}`}>{formatDate(audience.lastUsed)}</span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex gap-2 mt-4">
                                  <Button
                                    variant="outline"
                                    className={`flex-1 ${
                                      isDarkMode 
                                        ? 'border-[#3A3B3C] text-[#E4E6EB] hover:bg-[#3A3B3C]' 
                                        : 'border-[#E4E6EB] text-[#1877F2] hover:bg-[#F0F2F5]'
                                    } text-xs rounded-lg py-1.5`}
                                  >
                                    <DocumentDuplicateIcon className="h-3 w-3 mr-1" />
                                    Dupliquer
                                  </Button>
                                  
                                  <Button
                                    className={`flex-1 ${isDarkMode ? 'bg-[#1877F2] hover:bg-[#0A66C2]' : 'bg-[#1877F2] hover:bg-[#0A66C2]'} text-white transition-colors rounded-lg text-xs py-1.5`}
                                  >
                                    <PlusCircleIcon className="h-3 w-3 mr-1" />
                                    Créer une publicité
                                  </Button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        
        {/* Modals */}
        <AnimatePresence>
          {isCreateAdModalOpen && (
            <CreateAdModal
              isOpen={isCreateAdModalOpen}
              onClose={() => setIsCreateAdModalOpen(false)}
              adAccounts={adAccounts}
              campaigns={campaigns}
              adSets={adSets}
              viewMode={viewMode}
              selectedAdAccount={selectedAdAccount}
              selectedCampaign={selectedCampaign}
              selectedAdSet={selectedAdSet}
              onAdCreated={(newAd) => {
                // Handle new ad creation
                setAds(prev => [newAd, ...prev]);
              }}
            />
          )}
          
          {isConnectAccountModalOpen && (
            <ConnectAdAccountModal
              isOpen={isConnectAccountModalOpen}
              onClose={() => setIsConnectAccountModalOpen(false)}
              onAccountConnected={(newAccount) => {
                setAdAccounts(prev => [...prev, newAccount]);
              }}
            />
          )}
          
          {isAdDetailsModalOpen && selectedAd && (
            <AdDetailsModal
              isOpen={isAdDetailsModalOpen}
              onClose={() => {
                setIsAdDetailsModalOpen(false);
                setSelectedAd(null);
              }}
              ad={selectedAd}
              isDarkMode={isDarkMode}
              onAdUpdated={(updatedAd) => {
                // Handle ad update
                setAds(prev => prev.map(ad => ad._id === updatedAd._id ? updatedAd : ad));
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}
