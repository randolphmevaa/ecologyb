"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import {
  // ChartBarIcon,
  CurrencyEuroIcon,
  // CalendarIcon,
  UserGroupIcon,
  // ArrowUpIcon,
  ArrowDownIcon,
  // ArrowPathIcon,
  AdjustmentsHorizontalIcon,
  // FunnelIcon,
  BuildingOfficeIcon,
  // BanknotesIcon,
  // WrenchScrewdriverIcon,
  // SunIcon,
  HomeModernIcon,
  // PresentationChartLineIcon,
  PlusIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  // CubeIcon,
  ShieldCheckIcon,
  UsersIcon,
  MapPinIcon
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
  // RadialBarChart,
  // RadialBar,
  ReferenceLine,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";
// import { Button } from "@headlessui/react";
// import { Button as HeadlessButton } from "@headlessui/react";

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
  // variant,
  // size,
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

interface SavType {
  name: string;
  value: number;
}

interface SavStatus {
  name: string;
  value: number;
  color: string;
}

interface TotalStats {
  installations: number;
  revenue: number;
  pendingAmount: number;
  receivedAmount: number;
  revenueByCategory: CategoryRevenue[];
  averageSAVRate: number;
  averageSatisfaction: number;
  topPerformer: Regie;
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

const SAMPLE_REGIES: Regie[] = [
  {
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
  },
  {
    id: "R002",
    name: "Régie Lyon",
    region: "Auvergne-Rhône-Alpes",
    manager: "Marie Dupont",
    performance: 88,
    installations: 142,
    revenue: 412000,
    pendingAmount: 65000,
    receivedAmount: 28000,
    satisfaction: 4.6,
    lastUpdate: "2023-10-14T09:15:00",
    categories: {
      monoGeste: 40,
      financement: 28,
      renovationAmpleur: 22,
      panneauxPV: 10
    },
    savRate: 2.8,
    monthlyInstallations: [12, 14, 16, 13, 15, 17, 16],
    revenueByCategory: [
      { name: "Mono-geste", value: 164800 },
      { name: "Financement", value: 115360 },
      { name: "Rénovation", value: 90640 },
      { name: "Panneaux PV", value: 41200 }
    ]
  },
  {
    id: "R003",
    name: "Régie Marseille",
    region: "Provence-Alpes-Côte d'Azur",
    manager: "Jean Moreau",
    performance: 84,
    installations: 128,
    revenue: 365000,
    pendingAmount: 52000,
    receivedAmount: 23000,
    satisfaction: 4.4,
    lastUpdate: "2023-10-16T11:45:00",
    categories: {
      monoGeste: 38,
      financement: 26,
      renovationAmpleur: 20,
      panneauxPV: 16
    },
    savRate: 3.2,
    monthlyInstallations: [10, 12, 14, 16, 13, 15, 14],
    revenueByCategory: [
      { name: "Mono-geste", value: 138700 },
      { name: "Financement", value: 94900 },
      { name: "Rénovation", value: 73000 },
      { name: "Panneaux PV", value: 58400 }
    ]
  },
  {
    id: "R004",
    name: "Régie Bordeaux",
    region: "Nouvelle-Aquitaine",
    manager: "Sophie Martin",
    performance: 90,
    installations: 155,
    revenue: 438000,
    pendingAmount: 62000,
    receivedAmount: 29000,
    satisfaction: 4.7,
    lastUpdate: "2023-10-15T16:20:00",
    categories: {
      monoGeste: 42,
      financement: 30,
      renovationAmpleur: 20,
      panneauxPV: 8
    },
    savRate: 2.5,
    monthlyInstallations: [13, 15, 14, 16, 18, 17, 15],
    revenueByCategory: [
      { name: "Mono-geste", value: 183960 },
      { name: "Financement", value: 131400 },
      { name: "Rénovation", value: 87600 },
      { name: "Panneaux PV", value: 35040 }
    ]
  },
  {
    id: "R005",
    name: "Régie Lille",
    region: "Hauts-de-France",
    manager: "Philippe Bernard",
    performance: 86,
    installations: 132,
    revenue: 385000,
    pendingAmount: 58000,
    receivedAmount: 25000,
    satisfaction: 4.5,
    lastUpdate: "2023-10-14T10:30:00",
    categories: {
      monoGeste: 44,
      financement: 28,
      renovationAmpleur: 18,
      panneauxPV: 10
    },
    savRate: 2.9,
    monthlyInstallations: [11, 13, 15, 14, 12, 16, 13],
    revenueByCategory: [
      { name: "Mono-geste", value: 169400 },
      { name: "Financement", value: 107800 },
      { name: "Rénovation", value: 69300 },
      { name: "Panneaux PV", value: 38500 }
    ]
  },
  {
    id: "R006",
    name: "Régie Strasbourg",
    region: "Grand Est",
    manager: "Claire Dubois",
    performance: 87,
    installations: 138,
    revenue: 398000,
    pendingAmount: 60000,
    receivedAmount: 26000,
    satisfaction: 4.6,
    lastUpdate: "2023-10-16T13:15:00",
    categories: {
      monoGeste: 41,
      financement: 29,
      renovationAmpleur: 19,
      panneauxPV: 11
    },
    savRate: 2.7,
    monthlyInstallations: [12, 14, 13, 15, 16, 14, 13],
    revenueByCategory: [
      { name: "Mono-geste", value: 163180 },
      { name: "Financement", value: 115420 },
      { name: "Rénovation", value: 75620 },
      { name: "Panneaux PV", value: 43780 }
    ]
  }
];

const CATEGORIES_COLORS: Record<string, string> = {
  monoGeste: "#4299e1",
  financement: "#38b2ac",
  renovationAmpleur: "#805ad5",
  panneauxPV: "#f6ad55"
};

// const CATEGORIES_ICONS: Record<string, JSX.Element> = {
//   monoGeste: <WrenchScrewdriverIcon className="h-4 w-4" />,
//   financement: <BanknotesIcon className="h-4 w-4" />,
//   renovationAmpleur: <HomeModernIcon className="h-4 w-4" />,
//   panneauxPV: <SunIcon className="h-4 w-4" />
// };

const SAV_TYPES: SavType[] = [
  { name: "Problème technique", value: 45 },
  { name: "Installation", value: 25 },
  { name: "Utilisation", value: 20 },
  { name: "Autre", value: 10 }
];

const SAV_STATUSES: SavStatus[] = [
  { name: "Résolu", value: 68, color: "#4ade80" },
  { name: "En cours", value: 24, color: "#facc15" },
  { name: "En attente", value: 8, color: "#f97316" }
];

export default function StatsPage() {
  // States
  const [timeRange, setTimeRange] = useState<string>("year");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRegie, setSelectedRegie] = useState<Regie | null>(null);
  const [regieListVisible, setRegieListVisible] = useState<boolean>(true);
  const [regieSearchTerm, setRegieSearchTerm] = useState<string>("");
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [detailModalType, setDetailModalType] = useState<string | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  // Derived state
  const filteredRegies = useMemo<Regie[]>(() => {
    return SAMPLE_REGIES.filter(regie => 
      regie.name.toLowerCase().includes(regieSearchTerm.toLowerCase()) ||
      regie.region.toLowerCase().includes(regieSearchTerm.toLowerCase()) ||
      regie.manager.toLowerCase().includes(regieSearchTerm.toLowerCase())
    );
  }, [regieSearchTerm]);

  // Calculate totals across all regies for main dashboard
  const totalStats = useMemo<TotalStats>(() => {
    return {
      installations: SAMPLE_REGIES.reduce((sum, regie) => sum + regie.installations, 0),
      revenue: SAMPLE_REGIES.reduce((sum, regie) => sum + regie.revenue, 0),
      pendingAmount: SAMPLE_REGIES.reduce((sum, regie) => sum + regie.pendingAmount, 0),
      receivedAmount: SAMPLE_REGIES.reduce((sum, regie) => sum + regie.receivedAmount, 0),
      revenueByCategory: [
        { 
          name: "Mono-geste", 
          value: SAMPLE_REGIES.reduce((sum, regie) => sum + regie.revenueByCategory[0].value, 0)
        },
        { 
          name: "Financement", 
          value: SAMPLE_REGIES.reduce((sum, regie) => sum + regie.revenueByCategory[1].value, 0)
        },
        { 
          name: "Rénovation", 
          value: SAMPLE_REGIES.reduce((sum, regie) => sum + regie.revenueByCategory[2].value, 0)
        },
        { 
          name: "Panneaux PV", 
          value: SAMPLE_REGIES.reduce((sum, regie) => sum + regie.revenueByCategory[3].value, 0)
        }
      ],
      averageSAVRate: SAMPLE_REGIES.reduce((sum, regie) => sum + regie.savRate, 0) / SAMPLE_REGIES.length,
      averageSatisfaction: SAMPLE_REGIES.reduce((sum, regie) => sum + regie.satisfaction, 0) / SAMPLE_REGIES.length,
      topPerformer: SAMPLE_REGIES.reduce((best, regie) => 
        regie.performance > best.performance ? regie : best, SAMPLE_REGIES[0]
      )
    };
  }, []);

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
  const handleOpenDetailModal = (type: string): void => {
    setDetailModalType(type);
    setShowDetailModal(true);
  };

  // Handle selecting a regie
  const handleSelectRegie = (regie: Regie): void => {
    setSelectedRegie(regie);
    setRegieListVisible(false);
  };

  // Handle back to regie list
  const handleBackToRegieList = (): void => {
    setSelectedRegie(null);
    setRegieListVisible(true);
  };

  // Render the main dashboard content
  const renderMainDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Summary Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Installations */}
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
                <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{totalStats.installations}</h3>
                <p className="text-xs text-[#213f5b] opacity-75 mt-1">
                  sur la période sélectionnée
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <HomeModernIcon className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#eaeaea]">
              <div className="flex items-center gap-1 text-green-500 text-xs">
                <ArrowTrendingUpIcon className="h-3 w-3" />
                <span>+12% par rapport à la période précédente</span>
              </div>
            </div>
          </motion.div>

          {/* Total Revenue */}
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
                <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{formatCurrency(totalStats.revenue)}</h3>
                <p className="text-xs text-[#213f5b] opacity-75 mt-1">
                  sur la période sélectionnée
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CurrencyEuroIcon className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#eaeaea]">
              <div className="flex items-center gap-1 text-green-500 text-xs">
                <ArrowTrendingUpIcon className="h-3 w-3" />
                <span>+8.5% par rapport à la période précédente</span>
              </div>
            </div>
          </motion.div>

          {/* Pending + Received Amounts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-[#eaeaea] hover:shadow-md transition-all"
            whileHover={{ y: -4 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-[#213f5b] opacity-75">En Attente + Reçu</p>
                <h3 className="text-2xl font-bold text-[#213f5b] mt-1">
                  {formatCurrency(totalStats.pendingAmount + totalStats.receivedAmount)}
                </h3>
                <p className="text-xs text-[#213f5b] opacity-75 mt-1">
                  {formatCurrency(totalStats.pendingAmount)} en attente
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <ClockIcon className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#eaeaea]">
              <div className="flex justify-between text-xs">
                <span className="text-[#213f5b] opacity-75">En attente</span>
                <span className="text-amber-500 font-medium">{Math.round((totalStats.pendingAmount / (totalStats.pendingAmount + totalStats.receivedAmount)) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div 
                  className="h-1.5 rounded-full bg-amber-500"
                  style={{ width: `${(totalStats.pendingAmount / (totalStats.pendingAmount + totalStats.receivedAmount)) * 100}%` }}
                ></div>
              </div>
            </div>
          </motion.div>

          {/* Top Performer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-[#eaeaea] hover:shadow-md transition-all"
            whileHover={{ y: -4 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-[#213f5b] opacity-75">Meilleure Performance</p>
                <h3 className="text-xl font-bold text-[#213f5b] mt-1 truncate">
                  {totalStats.topPerformer.name}
                </h3>
                <p className="text-xs text-[#213f5b] opacity-75 mt-1">
                  Score: {totalStats.topPerformer.performance}%
                </p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-indigo-500" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#eaeaea]">
              <button 
                onClick={() => handleSelectRegie(totalStats.topPerformer)}
                className="text-indigo-500 text-xs flex items-center"
              >
                <span>Voir les détails</span>
                <ChevronRightIcon className="h-3 w-3 ml-1" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Installations Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-[#eaeaea] overflow-hidden"
          >
            <div className="p-5 border-b border-[#eaeaea] flex justify-between items-center">
              <h3 className="font-semibold text-[#213f5b]">Installations par mois</h3>
              <div className="flex rounded-md shadow-sm bg-gray-100 overflow-hidden">
                <button 
                  onClick={() => setTimeRange("quarter")}
                  className={`px-3 py-1.5 text-xs ${timeRange === "quarter" ? "bg-[#213f5b] text-white" : "bg-gray-100 text-[#213f5b]"}`}
                >
                  Trimestre
                </button>
                <button 
                  onClick={() => setTimeRange("year")}
                  className={`px-3 py-1.5 text-xs ${timeRange === "year" ? "bg-[#213f5b] text-white" : "bg-gray-100 text-[#213f5b]"}`}
                >
                  Année
                </button>
              </div>
            </div>
            <div className="p-5">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeRange === "quarter" ? SAMPLE_MONTHLY_INSTALLATIONS.slice(-3) : SAMPLE_MONTHLY_INSTALLATIONS}>
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
                    <Legend verticalAlign="top" height={36} />
                    <Bar 
                      name="Installations" 
                      dataKey="installations" 
                      fill="#4299e1"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      name="Objectif" 
                      dataKey="target" 
                      fill="#e2e8f0"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#eaeaea]">
                <div>
                  <p className="text-sm font-medium text-[#213f5b]">Total</p>
                  <p className="text-2xl font-bold text-[#213f5b]">
                    {SAMPLE_MONTHLY_INSTALLATIONS.reduce((sum, item) => sum + item.installations, 0)}
                  </p>
                </div>
                <button 
                  onClick={() => handleOpenDetailModal('installations')}
                  className="text-blue-500 text-sm flex items-center"
                >
                  <span>Voir plus de détails</span>
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Revenue by Category Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-[#eaeaea] overflow-hidden"
          >
            <div className="p-5 border-b border-[#eaeaea] flex justify-between items-center">
              <h3 className="font-semibold text-[#213f5b]">Chiffre d&apos;affaires par catégorie</h3>
              <div className="flex rounded-md shadow-sm bg-gray-100 overflow-hidden">
                <button 
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1.5 text-xs ${selectedCategory === "all" ? "bg-[#213f5b] text-white" : "bg-gray-100 text-[#213f5b]"}`}
                >
                  Tous
                </button>
                <button 
                  onClick={() => setSelectedCategory("percentage")}
                  className={`px-3 py-1.5 text-xs ${selectedCategory === "percentage" ? "bg-[#213f5b] text-white" : "bg-gray-100 text-[#213f5b]"}`}
                >
                  Pourcentage
                </button>
              </div>
            </div>
            <div className="p-5">
              <div className="h-64 flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  {selectedCategory === "all" ? (
                    <BarChart 
                      data={totalStats.revenueByCategory}
                      layout="vertical"
                      margin={{ left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                      <XAxis type="number" axisLine={false} tickLine={false} />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false} 
                        width={100}
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
                        {totalStats.revenueByCategory.map((entry, index) => (
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
                  ) : (
                    <PieChart>
                      <Pie
                        data={totalStats.revenueByCategory}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {totalStats.revenueByCategory.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === 0 ? CATEGORIES_COLORS.monoGeste : 
                                  index === 1 ? CATEGORIES_COLORS.financement : 
                                  index === 2 ? CATEGORIES_COLORS.renovationAmpleur : 
                                  CATEGORIES_COLORS.panneauxPV} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [formatCurrency(typeof value === 'number' ? value : Number(value)), "Montant"]}
                        contentStyle={{ 
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: '1px solid #eaeaea',
                          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-[#eaeaea]">
                <div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-[#4299e1]"></span>
                    <p className="text-xs text-[#213f5b]">Mono-geste</p>
                  </div>
                  <p className="text-sm font-medium text-[#213f5b] mt-1">
                    {formatCurrency(totalStats.revenueByCategory[0].value)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-[#38b2ac]"></span>
                    <p className="text-xs text-[#213f5b]">Financement</p>
                  </div>
                  <p className="text-sm font-medium text-[#213f5b] mt-1">
                    {formatCurrency(totalStats.revenueByCategory[1].value)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-[#805ad5]"></span>
                    <p className="text-xs text-[#213f5b]">Rénovation</p>
                  </div>
                  <p className="text-sm font-medium text-[#213f5b] mt-1">
                    {formatCurrency(totalStats.revenueByCategory[2].value)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-[#f6ad55]"></span>
                    <p className="text-xs text-[#213f5b]">Panneaux PV</p>
                  </div>
                  <p className="text-sm font-medium text-[#213f5b] mt-1">
                    {formatCurrency(totalStats.revenueByCategory[3].value)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* SAV and Performance Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SAV Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-[#eaeaea] overflow-hidden"
          >
            <div className="p-5 border-b border-[#eaeaea]">
              <h3 className="font-semibold text-[#213f5b]">Statistiques SAV</h3>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-[#213f5b] opacity-75">Taux moyen</p>
                  <p className="text-2xl font-bold text-[#213f5b]">{totalStats.averageSAVRate.toFixed(1)}%</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-xs text-green-500 flex items-center">
                    <ArrowDownIcon className="h-3 w-3 mr-1" />
                    <span>0.3% vs période précédente</span>
                  </div>
                  <p className="text-xs text-[#213f5b] opacity-75 mt-1">Objectif: &lt;3.0%</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm font-medium text-[#213f5b]">Types d&apos;interventions</p>
                {SAV_TYPES.map((type, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-[#213f5b]">{type.name}</span>
                      <span className="text-xs font-medium text-[#213f5b]">{type.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="h-1.5 rounded-full bg-blue-500"
                        style={{ width: `${type.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-[#eaeaea]">
                <p className="text-sm font-medium text-[#213f5b] mb-3">Statut des demandes</p>
                <div className="flex items-center gap-3">
                  {SAV_STATUSES.map((status, index) => (
                    <div 
                      key={index} 
                      className="flex-1 p-3 rounded-lg"
                      style={{ backgroundColor: `${status.color}20` }}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: status.color }}
                        ></span>
                        <p className="text-xs text-[#213f5b]">{status.name}</p>
                      </div>
                      <p 
                        className="text-lg font-bold"
                        style={{ color: status.color }}
                      >
                        {status.value}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Facturation Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-[#eaeaea] overflow-hidden"
          >
            <div className="p-5 border-b border-[#eaeaea]">
              <h3 className="font-semibold text-[#213f5b]">Facturation</h3>
            </div>
            <div className="p-5 space-y-5">
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Payées", value: 68, color: "#4ade80" },
                        { name: "En attente", value: 24, color: "#facc15" },
                        { name: "Retard", value: 8, color: "#f97316" }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {[0, 1, 2].map((index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index === 0 ? "#4ade80" : index === 1 ? "#facc15" : "#f97316"} 
                        />
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
              
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-green-50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-green-800">Payées</p>
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-lg font-bold text-green-700">68%</p>
                  <p className="text-xs text-green-700 mt-1">+5% vs précédent</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-amber-800">En attente</p>
                    <ClockIcon className="h-4 w-4 text-amber-600" />
                  </div>
                  <p className="text-lg font-bold text-amber-700">24%</p>
                  <p className="text-xs text-amber-700 mt-1">-2% vs précédent</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-orange-800">Retard</p>
                    <ExclamationCircleIcon className="h-4 w-4 text-orange-600" />
                  </div>
                  <p className="text-lg font-bold text-orange-700">8%</p>
                  <p className="text-xs text-orange-700 mt-1">-3% vs précédent</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-[#eaeaea]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-[#213f5b]">Délai moyen de paiement</p>
                  <p className="text-sm font-bold text-[#213f5b]">28 jours</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full bg-blue-500"
                    style={{ width: '70%' }}
                  ></div>
                </div>
                <p className="text-xs text-[#213f5b] opacity-75 mt-1">Objectif: 30 jours</p>
              </div>
            </div>
          </motion.div>
          
          {/* Performance Radar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="bg-white rounded-xl shadow-sm border border-[#eaeaea] overflow-hidden"
          >
            <div className="p-5 border-b border-[#eaeaea]">
              <h3 className="font-semibold text-[#213f5b]">Performances</h3>
            </div>
            <div className="p-5">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart 
                    cx="50%" 
                    cy="50%" 
                    outerRadius="80%" 
                    data={[
                      { subject: 'Installations', A: 85, fullMark: 100 },
                      { subject: 'Revenue', A: 90, fullMark: 100 },
                      { subject: 'Délais', A: 78, fullMark: 100 },
                      { subject: 'Qualité', A: 92, fullMark: 100 },
                      { subject: 'SAV', A: 88, fullMark: 100 },
                      { subject: 'Satisfaction', A: 95, fullMark: 100 },
                    ]}
                  >
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#4a5568', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Performance" dataKey="A" stroke="#4299e1" fill="#4299e1" fillOpacity={0.6} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        border: '1px solid #eaeaea',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 pt-4 border-t border-[#eaeaea]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#213f5b] opacity-75">Satisfaction client</p>
                    <div className="flex items-center">
                      <p className="text-xl font-bold text-[#213f5b]">{totalStats.averageSatisfaction.toFixed(1)}</p>
                      <p className="text-xs text-[#213f5b] opacity-75 ml-1">/5</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className={`w-4 h-4 ${star <= Math.round(totalStats.averageSatisfaction) ? 'text-yellow-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  // Render the regie detail view
  const renderRegieDetail = () => {
    if (!selectedRegie) return null;
    
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
                  <h2 className="text-2xl font-bold text-[#213f5b]">{selectedRegie.name}</h2>
                  <div className="flex items-center gap-2 mt-1 text-sm text-[#213f5b] opacity-75">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{selectedRegie.region}</span>
                    <span className="mx-2">•</span>
                    <UsersIcon className="h-4 w-4" />
                    <span>{selectedRegie.manager}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-[#213f5b] opacity-75">Performance</p>
                  <p className="text-2xl font-bold text-[#213f5b]">{selectedRegie.performance}%</p>
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
                      stroke={selectedRegie.performance >= 90 ? "#4ade80" : selectedRegie.performance >= 80 ? "#facc15" : "#f97316"}
                      strokeWidth="3"
                      strokeDasharray={`${selectedRegie.performance}, 100`}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
                <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{selectedRegie.installations}</h3>
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
                <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{formatCurrency(selectedRegie.revenue)}</h3>
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
                <span className="text-[#213f5b] font-medium">{formatCurrency(selectedRegie.revenue / 12)}</span>
              </div>
            </div>
          </motion.div>
          
          {/* En attente + Reçu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-[#eaeaea] hover:shadow-md transition-all"
            whileHover={{ y: -4 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-[#213f5b] opacity-75">En Attente + Reçu</p>
                <h3 className="text-2xl font-bold text-[#213f5b] mt-1">
                  {formatCurrency(selectedRegie.pendingAmount + selectedRegie.receivedAmount)}
                </h3>
                <p className="text-xs text-[#213f5b] opacity-75 mt-1">
                  {formatCurrency(selectedRegie.pendingAmount)} en attente
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <ClockIcon className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-[#eaeaea]">
              <div className="flex justify-between text-xs">
                <span className="text-[#213f5b] opacity-75">En attente</span>
                <span className="text-amber-500 font-medium">
                  {Math.round((selectedRegie.pendingAmount / (selectedRegie.pendingAmount + selectedRegie.receivedAmount)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div 
                  className="h-1.5 rounded-full bg-amber-500"
                  style={{ width: `${(selectedRegie.pendingAmount / (selectedRegie.pendingAmount + selectedRegie.receivedAmount)) * 100}%` }}
                ></div>
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
                  <h3 className="text-2xl font-bold text-[#213f5b]">{selectedRegie.satisfaction.toFixed(1)}</h3>
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
                  <svg key={star} className={`w-4 h-4 ${star <= Math.round(selectedRegie.satisfaction) ? 'text-yellow-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
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
                  <LineChart data={selectedRegie.monthlyInstallations.map((value, index) => {
                    // Get the last X months
                    const date = new Date();
                    date.setMonth(date.getMonth() - (selectedRegie.monthlyInstallations.length - 1 - index));
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
                    {(selectedRegie.monthlyInstallations.reduce((sum, val) => sum + val, 0) / selectedRegie.monthlyInstallations.length).toFixed(1)}
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
                        data={Object.entries(selectedRegie.categories).map(([key, value]) => ({
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
                        {Object.keys(selectedRegie.categories).map((key, index) => (
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
                      data={selectedRegie.revenueByCategory}
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
                        {selectedRegie.revenueByCategory.map((entry, index) => (
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
                        {selectedRegie.categories[cat]}%
                      </span>
                      <div className="ml-2 text-xs text-[#213f5b] opacity-75">
                        ({formatCurrency(selectedRegie.revenueByCategory[index].value)})
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
                  <p className="text-2xl font-bold text-[#213f5b]">{selectedRegie.savRate.toFixed(1)}%</p>
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
          
          {/* Facturation */}
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
                        <span className="text-xs text-[#213f5b]">Payées</span>
                        <span className="text-xs font-medium text-green-600">72%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-green-500" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-[#213f5b]">En attente</span>
                        <span className="text-xs font-medium text-amber-600">20%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-amber-500" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-[#213f5b]">Retard</span>
                        <span className="text-xs font-medium text-orange-600">8%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-orange-500" style={{ width: '8%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 pl-6 border-l border-[#eaeaea]">
                  <p className="text-sm font-medium text-[#213f5b] mb-2">Montants</p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-[#213f5b] opacity-75">Facturé</p>
                      <p className="text-lg font-bold text-[#213f5b]">{formatCurrency(selectedRegie.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#213f5b] opacity-75">En attente</p>
                      <p className="text-lg font-bold text-amber-600">{formatCurrency(selectedRegie.pendingAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#213f5b] opacity-75">Reçu</p>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(selectedRegie.receivedAmount)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-[#eaeaea]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-[#213f5b]">Dernière mise à jour</p>
                  <p className="text-sm text-[#213f5b]">{formatDate(selectedRegie.lastUpdate)}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 flex items-start">
                  <QuestionMarkCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p>Les données de facturation sont mises à jour quotidiennement. Pour des rapports détaillés, consultez l&apos;onglet Facturation.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };
  
  // Render the regie list
  const renderRegieList = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <div className="bg-white rounded-xl shadow-sm border border-[#eaeaea] overflow-hidden">
          <div className="p-5 border-b border-[#eaeaea] flex justify-between items-center">
            <h3 className="font-semibold text-[#213f5b]">Liste des régies</h3>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="w-4 h-4 text-[#213f5b] opacity-50" />
              </div>
              <input
                type="search"
                className="block w-56 px-4 py-2 pl-10 text-sm text-[#213f5b] border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                placeholder="Rechercher une régie..."
                value={regieSearchTerm}
                onChange={(e) => setRegieSearchTerm(e.target.value)}
              />
              {regieSearchTerm && (
                <button 
                  className="absolute right-2.5 top-2.5 text-[#213f5b] hover:text-[#152a3d]"
                  onClick={() => setRegieSearchTerm("")}
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#eaeaea]">
              <thead className="bg-[#f8fafc]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                    Région
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                    Performance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                    Installations
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                    C.A.
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                    Satisfaction
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#213f5b] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#eaeaea]">
                {filteredRegies.map((regie) => (
                  <tr 
                    key={regie.id} 
                    className="hover:bg-[#f8fafc] transition-colors cursor-pointer"
                    onClick={() => handleSelectRegie(regie)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#213f5b]">
                      {regie.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#213f5b]">
                      {regie.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            regie.performance >= 90
                              ? "bg-green-100 text-green-800"
                              : regie.performance >= 80
                              ? "bg-amber-100 text-amber-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {regie.performance}%
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#213f5b]">
                      {regie.installations}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#213f5b]">
                      {formatCurrency(regie.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-[#213f5b] mr-2">
                          {regie.satisfaction.toFixed(1)}
                        </span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className={`w-3 h-3 ${star <= Math.round(regie.satisfaction) ? 'text-yellow-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectRegie(regie);
                        }}
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRegies.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-[#213f5b] opacity-75">Aucune régie trouvée avec ces critères de recherche.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#f8fafc] to-[#f0f7ff]">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto px-0 sm:px-2">
            {/* Page Header */}
            <div className="mb-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                <div className="relative">
                  <div className="absolute -left-3 md:-left-5 top-1 w-1.5 h-12 bg-gradient-to-b from-[#bfddf9] to-[#d2fcb2] rounded-full"></div>
                  <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#213f5b] to-[#2c5681] mb-2 pl-2">
                    {selectedRegie 
                      ? `Statistiques : ${selectedRegie.name}` 
                      : "Rapports & Statistiques"}
                  </h1>
                  <p className="text-[#213f5b] opacity-75 pl-2">
                    {selectedRegie 
                      ? `Performance et indicateurs pour ${selectedRegie.region}` 
                      : "Analysez les performances et suivez les indicateurs clés"}
                  </p>
                  <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-[#bfddf9] opacity-10 rounded-full blur-3xl"></div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  {selectedRegie && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBackToRegieList}
                      className="border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] transition-colors rounded-lg px-4 py-2 flex items-center"
                    >
                      <ChevronRightIcon className="h-4 w-4 mr-2 rotate-180" />
                      Retour à la liste
                    </Button>
                  )}
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
                      <label className="block text-sm font-medium text-[#213f5b] mb-1">Région</label>
                      <select
                        className="w-full px-3 py-2 border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#213f5b]"
                      >
                        <option value="all">Toutes les régions</option>
                        {Array.from(new Set(SAMPLE_REGIES.map(r => r.region))).map((region) => (
                          <option key={region} value={region}>{region}</option>
                        ))}
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
          
          {/* Main Content: Dashboard, Régie Detail or Régie List */}
          {selectedRegie ? (
            renderRegieDetail()
          ) : regieListVisible ? (
            <>
              {renderMainDashboard()}
              {renderRegieList()}
            </>
          ) : (
            renderMainDashboard()
          )}
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
