"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Add these imports at the top
import { ChartPieIcon, StarIcon, TrophyIcon, CogIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Header } from "@/components/Header";
import {
  CurrencyEuroIcon,
  // UserGroupIcon,
  ArrowDownIcon,
  AdjustmentsHorizontalIcon,
  BuildingOfficeIcon,
  HomeModernIcon,
  PlusIcon,
  DocumentTextIcon,
  // MagnifyingGlassIcon,
  // ChevronRightIcon,
  // CheckCircleIcon,
  // ExclamationCircleIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
  // ClockIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  UsersIcon,
  MapPinIcon,
  // TicketIcon,
  // BanknotesIcon
} from "@heroicons/react/24/outline";

// For charts
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  // RadarChart,
  // Radar,
  // PolarGrid,
  // PolarAngleAxis,
  // PolarRadiusAxis,
  ComposedChart
} from "recharts";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: string;
  size?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = "", 
  onClick,
  ...props 
}) => {
  return (
    <button 
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Add this client profit data near your other sample data constants
const CLIENT_PROFIT_DATA = [
  { name: "Martin Dupont", profit: 85400, revenue: 238000, percentage: 24, growth: "+15%", projects: 12, margin: 35.9 },
  { name: "Sophie Laurent", profit: 62300, revenue: 175000, percentage: 18, growth: "+8%", projects: 8, margin: 35.6 },
  { name: "Jean Lefebvre", profit: 53900, revenue: 142000, percentage: 15, growth: "+12%", projects: 10, margin: 38.0 },
  { name: "Marie Dubois", profit: 47200, revenue: 128000, percentage: 14, growth: "+5%", projects: 6, margin: 36.9 },
  { name: "Thomas Moreau", profit: 34600, revenue: 89000, percentage: 10, growth: "+7%", projects: 5, margin: 38.9 },
  { name: "Autres clients", profit: 68500, revenue: 189000, percentage: 19, growth: "+10%", projects: 22, margin: 36.2 }
];

// Client profit colors - consistent with your existing theme but with distinct values
const CLIENT_PROFIT_COLORS = [
  "#4f46e5", // indigo
  "#0ea5e9", // sky
  "#8b5cf6", // violet
  "#f97316", // orange
  "#10b981", // emerald
  "#64748b"  // slate
];

// Monthly profit data for the time series chart
const MONTHLY_PROFIT_DATA = [
  { month: "Jan", profit: 25800, costs: 18200, margin: 41.6 },
  { month: "Fév", profit: 28600, costs: 19400, margin: 42.5 },
  { month: "Mar", profit: 32500, costs: 21500, margin: 43.3 },
  { month: "Avr", profit: 34600, costs: 22400, margin: 43.7 },
  { month: "Mai", profit: 38200, costs: 24800, margin: 43.5 },
  { month: "Jun", profit: 42100, costs: 26900, margin: 44.0 },
  { month: "Jul", profit: 45800, costs: 29200, margin: 44.2 }
];

// Define interfaces for our data structures
interface MonthlyInstallation {
  month: string;
  installations: number;
  target: number;
  revenue: number;
}

interface CategoryRevenue {
  name: string;
  value: number;
}

interface RegieCategories {
  monoGeste: number;
  financement: number;
  renovationAmpleur: number;
  panneauxPV: number;
  [key: string]: number; // Add index signature
}

interface Regie {
  id: string;
  name: string;
  region: string;
  manager: string;
  performance: number;
  installations: number;
  revenue: number;
  pendingAmount: number;
  receivedAmount: number;
  satisfaction: number;
  lastUpdate: string;
  categories: RegieCategories;
  savRate: number;
  monthlyInstallations: number[];
  revenueByCategory: CategoryRevenue[];
}

// Sample data for the dashboard
const SAMPLE_MONTHLY_INSTALLATIONS: MonthlyInstallation[] = [
  { month: "Jan", installations: 24, target: 20, revenue: 68000 },
  { month: "Fév", installations: 28, target: 22, revenue: 76000 },
  { month: "Mar", installations: 32, target: 25, revenue: 92000 },
  { month: "Avr", installations: 35, target: 28, revenue: 98000 },
  { month: "Mai", installations: 30, target: 30, revenue: 85000 },
  { month: "Jun", installations: 38, target: 32, revenue: 112000 },
  { month: "Jul", installations: 42, target: 35, revenue: 125000 },
  { month: "Aoû", installations: 45, target: 38, revenue: 135000 },
  { month: "Sep", installations: 49, target: 40, revenue: 142000 },
  { month: "Oct", installations: 52, target: 42, revenue: 158000 },
  { month: "Nov", installations: 48, target: 40, revenue: 145000 },
  { month: "Déc", installations: 38, target: 35, revenue: 110000 }
];

// Define current regie - this would normally come from an auth context or props
// We'll use Paris as example
const CURRENT_REGIE: Regie = {
  id: "R001",
  name: "Régie Paris Centre",
  region: "Île-de-France",
  manager: "Thomas Laurent",
  performance: 92,
  installations: 187,
  revenue: 524000,
  pendingAmount: 78000,
  receivedAmount: 32000,
  satisfaction: 4.8,
  lastUpdate: "2023-10-15T14:30:00",
  categories: {
    monoGeste: 45,
    financement: 32,
    renovationAmpleur: 18,
    panneauxPV: 5
  },
  savRate: 2.1,
  monthlyInstallations: [15, 18, 16, 14, 19, 22, 17],
  revenueByCategory: [
    { name: "Mono-geste", value: 235800 },
    { name: "Financement", value: 167680 },
    { name: "Rénovation", value: 94320 },
    { name: "Panneaux PV", value: 26200 }
  ]
};

const CATEGORIES_COLORS: Record<string, string> = {
  monoGeste: "#4299e1",
  financement: "#38b2ac",
  renovationAmpleur: "#805ad5",
  panneauxPV: "#f6ad55"
};

// Client Profit Chart Component
const ClientProfitChart = ({ }) => {
  const [activeTab, setActiveTab] = useState("clients");
  const totalProfit = CLIENT_PROFIT_DATA.reduce((sum, client) => sum + client.profit, 0);
  const totalRevenue = CLIENT_PROFIT_DATA.reduce((sum, client) => sum + client.revenue, 0);
  const avgMargin = (totalProfit / totalRevenue * 100).toFixed(1);
  
  // Define formatCurrency function inside the component with proper typing
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#eaeaea]"
    >
      <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-400 px-6 py-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full -mr-10 -mt-10 opacity-20" />
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <ChartPieIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Bénéfices & Rentabilité</h2>
          </div>
          
          <div className="flex bg-white/10 backdrop-blur-sm rounded-lg">
            <button
              onClick={() => setActiveTab("clients")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors rounded-lg ${
                activeTab === "clients" ? "bg-white text-indigo-700" : "text-white hover:bg-white/20"
              }`}
            >
              Par Client
            </button>
            <button
              onClick={() => setActiveTab("time")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors rounded-lg ${
                activeTab === "time" ? "bg-white text-indigo-700" : "text-white hover:bg-white/20"
              }`}
            >
              Évolution
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {activeTab === "clients" ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Pie Chart */}
            <div className="lg:w-1/2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CLIENT_PROFIT_DATA}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      dataKey="profit"
                      nameKey="name"
                      labelLine={false}
                      label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                    >
                      {CLIENT_PROFIT_DATA.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CLIENT_PROFIT_COLORS[index % CLIENT_PROFIT_COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value as number), "Bénéfice"]}
                      contentStyle={{ 
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        border: '1px solid #eaeaea',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      formatter={(value) => value.length > 12 ? `${value.substring(0, 12)}...` : value}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Client List */}
            <div className="lg:w-1/2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-[#213f5b]">Top Clients par Bénéfice</h3>
                  <div className="text-xs text-indigo-600 font-medium flex items-center gap-1">
                    <span>Marge moyenne:</span>
                    <span className="text-sm font-bold">{avgMargin}%</span>
                  </div>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {CLIENT_PROFIT_DATA.map((client, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm" 
                             style={{ backgroundColor: CLIENT_PROFIT_COLORS[index] }}>
                          <span className="text-xs font-medium text-white">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-[#213f5b]">{client.name}</h4>
                          <div className="flex items-center gap-3 mt-0.5">
                            <div className="flex items-center text-xs text-green-600">
                              <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                              <span>{client.growth}</span>
                            </div>
                            <div className="text-xs text-gray-500">{client.projects} projets</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#213f5b]">{formatCurrency(client.profit)}</div>
                        <div className="flex items-center justify-end gap-2 mt-0.5">
                          <div className="text-xs text-gray-500">Marge</div>
                          <div className="text-xs font-medium text-indigo-600">{client.margin}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Monthly Profit Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={MONTHLY_PROFIT_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === "profit") return [formatCurrency(value as number), "Bénéfice"];
                      if (name === "costs") return [formatCurrency(value as number), "Coûts"];
                      if (name === "margin") return [`${value}%`, "Marge"];
                      return [value, name];
                    }}
                    contentStyle={{ 
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid #eaeaea',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" name="Bénéfice" dataKey="profit" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="left" name="Coûts" dataKey="costs" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" name="Marge %" type="monotone" dataKey="margin" stroke="#10b981" strokeWidth={2} dot={{ stroke: '#10b981', strokeWidth: 2, r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            {/* Monthly Profit Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl border border-indigo-100">
                <div className="flex justify-between mb-2">
                  <h4 className="text-xs font-medium text-indigo-800">Bénéfice Total</h4>
                  <SparklesIcon className="h-4 w-4 text-indigo-600" />
                </div>
                <p className="text-lg font-bold text-indigo-800">{formatCurrency(MONTHLY_PROFIT_DATA.reduce((sum, m) => sum + m.profit, 0))}</p>
                <p className="text-xs text-indigo-600 mt-1 flex items-center">
                  <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                  <span>+18.3% vs trimestre précédent</span>
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-100">
                <div className="flex justify-between mb-2">
                  <h4 className="text-xs font-medium text-green-800">Marge Moyenne</h4>
                  <CogIcon className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-lg font-bold text-green-800">
                  {(MONTHLY_PROFIT_DATA.reduce((sum, m) => sum + m.margin, 0) / MONTHLY_PROFIT_DATA.length).toFixed(1)}%
                </p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                  <span>+2.4pts vs trimestre précédent</span>
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-100">
                <div className="flex justify-between mb-2">
                  <h4 className="text-xs font-medium text-amber-800">Meilleur Mois</h4>
                  <TrophyIcon className="h-4 w-4 text-amber-600" />
                </div>
                <p className="text-lg font-bold text-amber-800">Juillet</p>
                <p className="text-xs text-amber-600 mt-1">{formatCurrency(MONTHLY_PROFIT_DATA[6].profit)} (Marge: {MONTHLY_PROFIT_DATA[6].margin}%)</p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-100">
                <div className="flex justify-between mb-2">
                  <h4 className="text-xs font-medium text-blue-800">Prévision Annuelle</h4>
                  <ChartPieIcon className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-lg font-bold text-blue-800">{formatCurrency(45800 * 12)}</p>
                <p className="text-xs text-blue-600 mt-1">Basé sur la performance actuelle</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-5 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyEuroIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Bénéfice Total</p>
              <p className="text-lg font-bold text-[#213f5b]">{formatCurrency(totalProfit)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <TrophyIcon className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Client le Plus Rentable</p>
              <p className="text-base font-bold text-[#213f5b] truncate">{CLIENT_PROFIT_DATA[0].name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <StarIcon className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Croissance Bénéfice Annuel</p>
              <p className="text-lg font-bold text-green-600">+12.4%</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function StatsPage() {
  // States
  const [timeRange, setTimeRange] = useState<string>("year");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [detailModalType ] = useState<string | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle opening the detail modal
  // const handleOpenDetailModal = (type: string): void => {
  //   setDetailModalType(type);
  //   setShowDetailModal(true);
  // };

  // Render the regie detail view (main content)
  const renderRegieDetail = () => {    
    const catOrder = ["monoGeste", "financement", "renovationAmpleur", "panneauxPV"];
    const catNames: Record<string, string> = {
      monoGeste: "Mono-geste",
      financement: "Financement",
      renovationAmpleur: "Rénovation d'ampleur",
      panneauxPV: "Panneaux photovoltaïques"
    };
    
    return (
      <div className="space-y-6">
        {/* Regie Header */}
        <div className="bg-white rounded-xl shadow-sm border border-[#eaeaea] overflow-hidden">
          <div className="p-6 border-b border-[#eaeaea] bg-gradient-to-r from-white to-blue-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-[#213f5b] bg-opacity-10 rounded-full">
                  <BuildingOfficeIcon className="h-8 w-8 text-[#213f5b]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#213f5b]">{CURRENT_REGIE.name}</h2>
                  <div className="flex items-center gap-2 mt-1 text-sm text-[#213f5b] opacity-75">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{CURRENT_REGIE.region}</span>
                    <span className="mx-2">•</span>
                    <UsersIcon className="h-4 w-4" />
                    <span>{CURRENT_REGIE.manager}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-[#213f5b] opacity-75">Performance</p>
                  <p className="text-2xl font-bold text-[#213f5b]">{CURRENT_REGIE.performance}%</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center">
                  <svg viewBox="0 0 36 36" className="h-14 w-14 transform -rotate-90">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eaeaea"
                      strokeWidth="3"
                      strokeDasharray="100, 100"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={CURRENT_REGIE.performance >= 90 ? "#4ade80" : CURRENT_REGIE.performance >= 80 ? "#facc15" : "#f97316"}
                      strokeWidth="3"
                      strokeDasharray={`${CURRENT_REGIE.performance}, 100`}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Installations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-[#eaeaea] hover:shadow-md transition-all"
            whileHover={{ y: -4 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-[#213f5b] opacity-75">Installations Totales</p>
                <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{CURRENT_REGIE.installations}</h3>
                <div className="text-xs text-green-500 flex items-center mt-1">
                  <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                  <span>+8% vs période précédente</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <HomeModernIcon className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-[#eaeaea]">
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                <div 
                  className="h-1.5 rounded-full bg-blue-500"
                  style={{ width: '75%' }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#213f5b] opacity-75">Progression</span>
                <span className="text-[#213f5b] font-medium">75%</span>
              </div>
            </div>
          </motion.div>
          
          {/* Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-[#eaeaea] hover:shadow-md transition-all"
            whileHover={{ y: -4 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-[#213f5b] opacity-75">Chiffre d&apos;Affaires</p>
                <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{formatCurrency(CURRENT_REGIE.revenue)}</h3>
                <div className="text-xs text-green-500 flex items-center mt-1">
                  <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                  <span>+12% vs période précédente</span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CurrencyEuroIcon className="h-6 w-6 text-green-500" />
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-[#eaeaea]">
              <div className="flex justify-between text-xs">
                <span className="text-[#213f5b] opacity-75">Moyenne mensuelle</span>
                <span className="text-[#213f5b] font-medium">{formatCurrency(CURRENT_REGIE.revenue / 12)}</span>
              </div>
            </div>
          </motion.div>

          {/* Satisfaction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-[#eaeaea] hover:shadow-md transition-all"
            whileHover={{ y: -4 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-[#213f5b] opacity-75">Satisfaction Client</p>
                <div className="flex items-center mt-1">
                  <h3 className="text-2xl font-bold text-[#213f5b]">{CURRENT_REGIE.satisfaction.toFixed(1)}</h3>
                  <p className="text-xs text-[#213f5b] opacity-75 ml-1">/5</p>
                </div>
                <div className="text-xs text-green-500 flex items-center mt-1">
                  <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                  <span>+0.2 vs période précédente</span>
                </div>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <ShieldCheckIcon className="h-6 w-6 text-indigo-500" />
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-[#eaeaea]">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className={`w-4 h-4 ${star <= Math.round(CURRENT_REGIE.satisfaction) ? 'text-yellow-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Installations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-[#eaeaea] overflow-hidden"
          >
            <div className="p-5 border-b border-[#eaeaea]">
              <h3 className="font-semibold text-[#213f5b]">Installations Mensuelles</h3>
            </div>
            <div className="p-5">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={CURRENT_REGIE.monthlyInstallations.map((value, index) => {
                    // Get the last X months
                    const date = new Date();
                    date.setMonth(date.getMonth() - (CURRENT_REGIE.monthlyInstallations.length - 1 - index));
                    return {
                      month: date.toLocaleDateString('fr-FR', {month: 'short'}),
                      value: value
                    };
                  })}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        border: '1px solid #eaeaea',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#4299e1" 
                      strokeWidth={3}
                      dot={{ fill: '#4299e1', strokeWidth: 2, r: 4 }}
                      activeDot={{ fill: '#4299e1', strokeWidth: 0, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#eaeaea]">
                <div>
                  <p className="text-sm font-medium text-[#213f5b]">Moyenne</p>
                  <p className="text-xl font-bold text-[#213f5b]">
                    {(CURRENT_REGIE.monthlyInstallations.reduce((sum, val) => sum + val, 0) / CURRENT_REGIE.monthlyInstallations.length).toFixed(1)}
                  </p>
                </div>
                <p className="text-sm text-[#213f5b] opacity-75">
                  Objectif mensuel: 20
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Categories Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-[#eaeaea] overflow-hidden"
          >
            <div className="p-5 border-b border-[#eaeaea]">
              <h3 className="font-semibold text-[#213f5b]">Répartition par Catégorie</h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Category Percentage */}
                <div className="h-48 flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(CURRENT_REGIE.categories).map(([key, value]) => ({
                          name: catNames[key],
                          value: value,
                          color: CATEGORIES_COLORS[key]
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {Object.keys(CURRENT_REGIE.categories).map((key, index) => (
                          <Cell key={`cell-${index}`} fill={CATEGORIES_COLORS[key]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, "Pourcentage"]}
                        contentStyle={{ 
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: '1px solid #eaeaea',
                          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Category Revenue */}
                <div className="h-48 flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={CURRENT_REGIE.revenueByCategory}
                      layout="vertical"
                      margin={{ left: 0, right: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                      <XAxis type="number" axisLine={false} tickLine={false} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`} />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false}
                        width={80}
                        tickFormatter={(value) => value.length > 10 ? value.substring(0, 9) + "..." : value}
                      />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(typeof value === 'number' ? value : Number(value)), "Montant"]}
                        contentStyle={{ 
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: '1px solid #eaeaea',
                          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        radius={[0, 4, 4, 0]}
                      >
                        {CURRENT_REGIE.revenueByCategory.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === 0 ? CATEGORIES_COLORS.monoGeste : 
                                  index === 1 ? CATEGORIES_COLORS.financement : 
                                  index === 2 ? CATEGORIES_COLORS.renovationAmpleur : 
                                  CATEGORIES_COLORS.panneauxPV} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-[#eaeaea]">
                {catOrder.map((cat, index) => (
                  <div key={cat} className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: CATEGORIES_COLORS[cat] }}
                      ></span>
                      <p className="text-xs text-[#213f5b]">{catNames[cat]}</p>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-sm font-medium text-[#213f5b]">
                        {CURRENT_REGIE.categories[cat]}%
                      </span>
                      <div className="ml-2 text-xs text-[#213f5b] opacity-75">
                        ({formatCurrency(CURRENT_REGIE.revenueByCategory[index].value)})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* SAV and Performance Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SAV Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-[#eaeaea] overflow-hidden"
          >
            <div className="p-5 border-b border-[#eaeaea]">
              <h3 className="font-semibold text-[#213f5b]">Performance SAV</h3>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-[#213f5b] opacity-75">Taux d&apos;interventions</p>
                  <p className="text-2xl font-bold text-[#213f5b]">{CURRENT_REGIE.savRate.toFixed(1)}%</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-xs text-green-500 flex items-center">
                    <ArrowDownIcon className="h-3 w-3 mr-1" />
                    <span>0.2% vs période précédente</span>
                  </div>
                  <p className="text-xs text-[#213f5b] opacity-75 mt-1">Objectif: &lt;3.0%</p>
                </div>
              </div>
              
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={[
                      { name: 'Jan', value: 3.2 },
                      { name: 'Fév', value: 3.1 },
                      { name: 'Mar', value: 2.9 },
                      { name: 'Avr', value: 2.7 },
                      { name: 'Mai', value: 2.5 },
                      { name: 'Jun', value: 2.4 },
                      { name: 'Jul', value: 2.1 }
                    ]}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorSAV" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4299e1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4299e1" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, "Taux d'interventions"]}
                      contentStyle={{ 
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        border: '1px solid #eaeaea',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#4299e1" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorSAV)" 
                    />
                    <ReferenceLine y={3.0} stroke="#f97316" strokeDasharray="3 3" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 pt-4 border-t border-[#eaeaea]">
                <p className="text-sm font-medium text-[#213f5b] mb-2">Délai moyen de résolution</p>
                <div className="flex items-center justify-between">
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-[#213f5b]">Actuel: 2.3 jours</span>
                      <span className="text-xs text-[#213f5b] opacity-75">Objectif: 2 jours</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="h-1.5 rounded-full bg-blue-500"
                        style={{ width: `${(2 / 2.3) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Facturation - Updated with new categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-[#eaeaea] overflow-hidden"
          >
            <div className="p-5 border-b border-[#eaeaea]">
              <h3 className="font-semibold text-[#213f5b]">Facturation</h3>
            </div>
            <div className="p-5">
              <div className="flex mb-6">
                <div className="w-1/2">
                  <p className="text-sm font-medium text-[#213f5b] mb-2">État des factures</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-[#213f5b]">Payé</span>
                        <span className="text-xs font-medium text-green-600">62%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-green-500" style={{ width: '62%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-[#213f5b]">En attente de paiement</span>
                        <span className="text-xs font-medium text-amber-600">20%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-amber-500" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-[#213f5b]">À modifier</span>
                        <span className="text-xs font-medium text-orange-600">10%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-orange-500" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-[#213f5b]">À payé</span>
                        <span className="text-xs font-medium text-blue-600">8%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-blue-500" style={{ width: '8%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 pl-6 border-l border-[#eaeaea]">
                  <p className="text-sm font-medium text-[#213f5b] mb-2">Montants</p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-[#213f5b] opacity-75">Facturé</p>
                      <p className="text-lg font-bold text-[#213f5b]">{formatCurrency(CURRENT_REGIE.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#213f5b] opacity-75">En attente</p>
                      <p className="text-lg font-bold text-amber-600">{formatCurrency(CURRENT_REGIE.pendingAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#213f5b] opacity-75">Reçu</p>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(CURRENT_REGIE.receivedAmount)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-[#eaeaea]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-[#213f5b]">Dernière mise à jour</p>
                  <p className="text-sm text-[#213f5b]">{formatDate(CURRENT_REGIE.lastUpdate)}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 flex items-start">
                  <QuestionMarkCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p>Les données de facturation sont mises à jour quotidiennement. Pour des rapports détaillés, consultez l&apos;onglet Facturation.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-6">
          <ClientProfitChart />
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
        style={{
          background: "linear-gradient(135deg, rgba(191,221,249,0.1) 0%, rgba(210,252,178,0.05) 100%)",
        }}
        >
          <div className="max-w-7xl mx-auto px-0 sm:px-2">
            {/* Page Header */}
            <div className="mb-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                <div className="relative">
                  <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="absolute -left-3 md:-left-5 top-1 w-1.5 h-12 bg-gradient-to-b from-[#bfddf9] to-[#d2fcb2] rounded-full"></div>
                  <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#213f5b] to-[#2c5681] mb-2 pl-2">
                    Rapports & Statistiques - {CURRENT_REGIE.name}
                  </h1>
                  <p className="text-[#213f5b] opacity-75 pl-2">
                    Performance et indicateurs pour {CURRENT_REGIE.region}
                  </p>
                  <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-[#bfddf9] opacity-10 rounded-full blur-3xl"></div>
                  </motion.div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                    variant="outline"
                    size="sm" 
                    className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] transition-colors rounded-lg px-4 py-2 flex items-center"
                  >
                    <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] transition-colors rounded-lg px-4 py-2 flex items-center"
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                  <Button
                    className="bg-[#213f5b] hover:bg-[#152a3d] text-white transition-all rounded-lg px-5 py-2.5 flex items-center shadow-md hover:shadow-lg"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Nouveau rapport
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Filter Drawer */}
            <AnimatePresence>
              {isFilterDrawerOpen && (
                <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white p-5 rounded-xl shadow-sm mb-6 border border-[#eaeaea]">
                  <h3 className="font-medium text-[#213f5b] mb-4">Filtres avancés</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#213f5b] mb-1">Période</label>
                      <select
                        className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                      >
                        <option value="month">Mois en cours</option>
                        <option value="quarter">Trimestre en cours</option>
                        <option value="year">Année en cours</option>
                        <option value="custom">Période personnalisée</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#213f5b] mb-1">Catégorie</label>
                      <select
                        className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="all">Toutes les catégories</option>
                        <option value="monoGeste">Mono-geste</option>
                        <option value="financement">Financement</option>
                        <option value="renovationAmpleur">Rénovation d&apos;ampleur</option>
                        <option value="panneauxPV">Panneaux photovoltaïques</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#213f5b] mb-1">Type de données</label>
                      <select
                        className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                      >
                        <option value="all">Toutes les données</option>
                        <option value="installations">Installations</option>
                        <option value="revenue">Chiffre d&apos;affaires</option>
                        <option value="satisfaction">Satisfaction client</option>
                        <option value="sav">Service après-vente</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTimeRange("year");
                        setSelectedCategory("all");
                      }}
                      className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] mr-2"
                    >
                      Réinitialiser
                    </Button>
                    <Button
                      onClick={() => setIsFilterDrawerOpen(false)}
                      className="bg-[#213f5b] hover:bg-[#152a3d] text-white"
                    >
                      Appliquer
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Main Content: Only Régie Detail View */}
          {renderRegieDetail()}
        </div>
      </main>
    </div>
    
    {/* Detail Modal */}
    <AnimatePresence>
      {showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-[#eaeaea]">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#213f5b]">
                  {detailModalType === 'installations' ? "Détails des installations" : 
                   detailModalType === 'revenue' ? "Détails des revenus" : 
                   detailModalType === 'sav' ? "Détails SAV" :
                   "Détails"}
                </h3>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 rounded-full hover:bg-[#f0f7ff] text-[#213f5b]"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {detailModalType === 'installations' && (
                <div className="space-y-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={SAMPLE_MONTHLY_INSTALLATIONS}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            border: '1px solid #eaeaea',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          name="Installations"
                          dataKey="installations" 
                          stroke="#4299e1" 
                          activeDot={{ r: 6 }}
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          name="Objectif"
                          dataKey="target" 
                          stroke="#a0aec0" 
                          strokeDasharray="4 4"
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          name="Chiffre d'affaires"
                          dataKey="revenue" 
                          stroke="#48bb78" 
                          yAxisId="right"
                          strokeWidth={2}
                        />
                        <YAxis 
                          yAxisId="right" 
                          orientation="right" 
                          axisLine={false} 
                          tickLine={false}
                          tickFormatter={(value) => `${value / 1000}k€`}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-xs text-blue-800">Total installations</p>
                      <p className="text-2xl font-bold text-blue-800">
                        {SAMPLE_MONTHLY_INSTALLATIONS.reduce((sum, item) => sum + item.installations, 0)}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-xs text-green-800">Chiffre d&apos;affaires</p>
                      <p className="text-2xl font-bold text-green-800">
                        {formatCurrency(SAMPLE_MONTHLY_INSTALLATIONS.reduce((sum, item) => sum + item.revenue, 0))}
                      </p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <p className="text-xs text-indigo-800">Taux de réalisation</p>
                      <p className="text-2xl font-bold text-indigo-800">
                        {Math.round((SAMPLE_MONTHLY_INSTALLATIONS.reduce((sum, item) => sum + item.installations, 0) / 
                                    SAMPLE_MONTHLY_INSTALLATIONS.reduce((sum, item) => sum + item.target, 0)) * 100)}%
                      </p>
                    </div>
                  </div>
                  
                  <table className="min-w-full divide-y divide-[#eaeaea] border">
                    <thead className="bg-[#f8fafc]">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-[#213f5b]">Mois</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-[#213f5b]">Installations</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-[#213f5b]">Objectif</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-[#213f5b]">C.A.</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-[#213f5b]">C.A. / Installation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eaeaea]">
                      {SAMPLE_MONTHLY_INSTALLATIONS.map((item) => (
                        <tr key={item.month} className="hover:bg-[#f8fafc]">
                          <td className="px-4 py-2 text-sm text-[#213f5b]">{item.month}</td>
                          <td className="px-4 py-2 text-right text-sm text-[#213f5b]">
                            {item.installations}
                          </td>
                          <td className="px-4 py-2 text-right text-sm text-[#213f5b]">
                            {item.target}
                          </td>
                          <td className="px-4 py-2 text-right text-sm text-[#213f5b]">
                            {formatCurrency(item.revenue)}
                          </td>
                          <td className="px-4 py-2 text-right text-sm text-[#213f5b]">
                            {formatCurrency(item.revenue / item.installations)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-[#eaeaea] bg-[#f8fafc] flex justify-end gap-3 rounded-b-xl">
              <Button
                variant="outline"
                className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9]"
                onClick={() => setShowDetailModal(false)}
              >
                Fermer
              </Button>
              <Button
                className="bg-[#213f5b] hover:bg-[#152a3d] text-white"
                onClick={() => setShowDetailModal(false)}
              >
                Exporter
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </div>
);
}
