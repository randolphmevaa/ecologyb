"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { BarChart } from "@/components/ui/Charts/BarChart";
import {
  FireIcon,
  SunIcon,
  BoltIcon,
  HomeModernIcon,
  ChartBarIcon,
  // PlusIcon,
  DocumentArrowDownIcon,
  ArrowUpRightIcon,
  WrenchIcon,
  UserGroupIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

// Define the energyProducts object along with type definitions
const energyProducts = {
  "Pompes a chaleur": { 
    icon: FireIcon, 
    color: "#2a75c7",
    installations: 234,
    revenue: "245 500 €",
    efficiency: "320%"
  },
  "Chauffe-eau solaire individuel": { 
    icon: SunIcon, 
    color: "#f59e0b",
    installations: 189,
    revenue: "178 200 €",
    efficiency: "78%"
  },
  "Chauffe-eau thermodynamique": { 
    icon: BoltIcon, 
    color: "#10b981",
    installations: 156,
    revenue: "162 000 €",
    efficiency: "210%"
  },
  "Système Solaire Combiné": { 
    icon: HomeModernIcon, 
    color: "#8b5cf6",
    installations: 98,
    revenue: "134 750 €",
    efficiency: "65%"
  },
};

// Type definitions for energyProducts
type EnergyProductKey = keyof typeof energyProducts;
type EnergyProduct = typeof energyProducts[EnergyProductKey];

// Create a typed version of Object.entries for energyProducts
const energyProductsEntries = Object.entries(energyProducts) as [EnergyProductKey, EnergyProduct][];

// Your installation data remains here
const installationData = [
  { month: 'Janv', pompes: 25, solaire: 18, thermodynamique: 12, combine: 8 },
  { month: 'Févr', pompes: 32, solaire: 22, thermodynamique: 18, combine: 10 },
  { month: 'Mars', pompes: 45, solaire: 28, thermodynamique: 24, combine: 15 },
  { month: 'Avril', pompes: 52, solaire: 35, thermodynamique: 30, combine: 20 },
];

export default function ProductsServicesPage() {
  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[#1a365d]">Produits & Services</h1>
          </div>
          {/* Product Performance Header */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {energyProductsEntries.map(([product, { icon: Icon, color, installations, revenue }]) => (
              <div
                key={product}
                className={cn(
                  "p-6 rounded-2xl border bg-white",
                  "transition-all hover:shadow-lg",
                  "border-[#bfddf9]/30 relative group"
                )}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${color}10` }}
                  >
                    <Icon className="h-6 w-6" style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{product}</h3>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-gray-500">Installations</p>
                        <p className="text-xl font-bold" style={{ color }}>
                          {installations}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Revenu</p>
                        <p className="text-xl font-bold" style={{ color }}>
                          {revenue}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Installation Trends */}
            <motion.div 
              className="lg:col-span-2 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#bfddf9]/20 rounded-lg">
                    <ChartBarIcon className="h-6 w-6 text-[#2a75c7]" />
                  </div>
                  <h2 className="font-header text-xl font-semibold text-[#1a365d]">
                    Tendances d&apos;Installation
                  </h2>
                </div>
                <Button variant="ghost" size="sm" className="text-[#1a365d]">
                  Exporter Données <DocumentArrowDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <BarChart
                data={installationData}
                xKey="month"
                yKeys={['pompes', 'solaire', 'thermodynamique', 'combine']}
                colors={['#2a75c7', '#f59e0b', '#10b981', '#8b5cf6']}
                height={400}
                stacked
                barRadius={4}
                currency=""
              />
            </motion.div>

            {/* Efficiency Metrics */}
            <div className="space-y-6">
              <motion.div 
                className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d]">Efficacité Énergétique</h3>
                <div className="space-y-4">
                  {energyProductsEntries.map(([product, { color, efficiency }]) => (
                    <div 
                      key={product}
                      className="flex items-center justify-between p-3 bg-[#bfddf9]/10 rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm">{product}</span>
                      </div>
                      <span 
                        className="font-semibold"
                        style={{ color }}
                      >
                        {efficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Maintenance Alerts */}
              <motion.div 
                className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-[#1a365d]">Maintenance</h3>
                  <span className="text-sm text-red-600">3 alertes</span>
                </div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-red-50/50 rounded-lg border border-red-100"
                    >
                      <WrenchIcon className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="text-sm font-medium">PAC-00{i+1}</p>
                        <p className="text-xs text-red-600">Maintenance préventive requise</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Recent Installations */}
          <motion.div 
            className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-header text-xl font-semibold text-[#1a365d]">
                Installations Récentes
              </h2>
              <Button variant="ghost" size="sm" className="text-[#1a365d]">
                Voir Toutes <ArrowUpRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => {
                // Use a type assertion if needed, e.g., casting product as EnergyProductKey
                const product = Object.keys(energyProducts)[i] as EnergyProductKey;
                const { icon: Icon, color } = energyProducts[product];
                return (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-[#bfddf9]/30 hover:border-[#bfddf9]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${color}10` }}
                      >
                        <Icon className="h-5 w-5" style={{ color }} />
                      </div>
                      <span className="text-sm font-medium">{product}</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">Installé le 15/04/2024</p>
                      <div className="flex items-center gap-2">
                        <UserGroupIcon className="h-4 w-4 text-gray-600" />
                        <span className="text-sm">Équipe Technique #{(i+1)*2}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckBadgeIcon className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Installation validée</span>
                      </div>
                    </div>
                  </div>
                )}
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
