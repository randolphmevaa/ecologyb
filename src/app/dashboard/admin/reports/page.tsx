"use client";

import { motion } from "framer-motion";
// import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { BarChart } from "@/components/ui/Charts/BarChart";
import {
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  SparklesIcon,
  FireIcon,
  SunIcon,
  BoltIcon,
  HomeModernIcon,
  ArrowUpRightIcon,
  DocumentArrowDownIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";

const energySolutions = {
  "Pompes a chaleur": { icon: FireIcon, color: "#2a75c7" },
  "Chauffe-eau solaire individuel": { icon: SunIcon, color: "#f59e0b" },
  "Chauffe-eau thermodynamique": { icon: BoltIcon, color: "#10b981" },
  "Système Solaire Combiné": { icon: HomeModernIcon, color: "#8b5cf6" },
};

const reportMetrics = {
  totalReports: 245,
  dataCoverage: "98%",
  analysisTime: "2.4h",
  insightsGenerated: 1245,
};

const performanceData = [
  { solution: "PAC", installations: 65, revenue: 140000, efficiency: 92 },
  { solution: "CESI", installations: 78, revenue: 180000, efficiency: 88 },
  { solution: "CET", installations: 83, revenue: 210000, efficiency: 95 },
  { solution: "SSC", installations: 92, revenue: 240000, efficiency: 90 },
];

export default function ReportsPage() {
  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[#1a365d]">Rapports / Statistiques</h1>
          </div>

          {/* Energy Insights Header */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
              <h1 className="text-2xl font-bold text-[#1a365d] flex items-center gap-3">
                <SparklesIcon className="h-8 w-8 text-[#2a75c7]" />
                Tableaux de Bord des Solutions Énergétiques
              </h1>
              <p className="text-gray-600 mt-2">
                Analytics intelligents pour l&apos;optimisation des performances
              </p>
            </div>
            <div className="bg-[#d2fcb2]/10 p-6 rounded-2xl border border-[#d2fcb2]/30">
              <div className="flex items-center gap-3">
                <ChartPieIcon className="h-6 w-6 text-[#2a8547]" />
                <span className="font-semibold text-[#1a4231]">
                  Dernière Mise à Jour: 
                  <span className="block text-sm font-normal">15 min ago</span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Analytics */}
            <motion.div 
              className="lg:col-span-2 space-y-8"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              {/* Solution Performance */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[#1a365d] flex items-center gap-2">
                    <ChartBarIcon className="h-6 w-6 text-[#2a75c7]" />
                    Performance par Solution
                  </h2>
                  <Button variant="ghost" size="sm" className="text-[#1a365d]">
                    Comparer les Périodes <ArrowUpRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <BarChart
                  data={performanceData}
                  xKey="solution"
                  yKeys={['installations', 'revenue', 'efficiency']}
                  colors={['#2a75c7', '#10b981', '#f59e0b']}
                  height={400}
                  barRadius={6}
                  stacked
                  currency="€"
                />
              </div>

              {/* Efficiency Matrix */}
              <div className="grid grid-cols-2 gap-6">
                {Object.entries(energySolutions).map(([solution, { icon: Icon, color }]) => (
                  <div
                    key={solution}
                    className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className="h-6 w-6" style={{ color }} />
                      <h3 className="font-semibold text-[#1a365d]">{solution}</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Efficacité Moyenne</span>
                        <span className="font-semibold" style={{ color }}>92%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Alertes Actives</span>
                        <span className="font-semibold text-red-600">3</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-500" 
                          style={{ width: '85%', backgroundColor: color }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Insights Panel */}
            <motion.div 
              className="space-y-6"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              {/* Report Metrics */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d]">
                  Métriques Clés
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#bfddf9]/10 rounded-xl">
                    <div className="flex items-center gap-2">
                      <DocumentTextIcon className="h-5 w-5 text-[#2a75c7]" />
                      <span className="text-sm">Rapports Générés</span>
                    </div>
                    <span className="font-semibold text-[#1a365d]">
                      {reportMetrics.totalReports}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#d2fcb2]/10 rounded-xl">
                    <div className="flex items-center gap-2">
                      <ChartBarIcon className="h-5 w-5 text-[#10b981]" />
                      <span className="text-sm">Couverture des Données</span>
                    </div>
                    <span className="font-semibold text-[#10b981]">
                      {reportMetrics.dataCoverage}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#fde68a]/10 rounded-xl">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-5 w-5 text-[#f59e0b]" />
                      <span className="text-sm">Temps d&apos;Analyse Moyen</span>
                    </div>
                    <span className="font-semibold text-[#f59e0b]">
                      {reportMetrics.analysisTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d]">
                  Actions Rapides
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <Button className="h-12 bg-[#bfddf9]/20 hover:bg-[#bfddf9]/30 text-[#1a365d] justify-start">
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Nouveau Rapport Personnalisé
                  </Button>
                  <Button className="h-12 bg-[#d2fcb2] hover:bg-[#c2ecb2] text-[#1a4231] justify-start">
                    <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                    Exporter les Données Brutes
                  </Button>
                  <Button className="h-12 bg-white border border-[#bfddf9]/30 hover:bg-[#bfddf9]/10 text-[#1a365d] justify-start">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    Planifier un Rapport
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Analysis */}
          <motion.div 
            className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-header text-xl font-semibold text-[#1a365d]">
                Analyses Récentes
              </h2>
              <Button variant="ghost" size="sm" className="text-[#1a365d]">
                Voir Historique Complet <ArrowUpRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="group p-4 hover:bg-[#bfddf9]/10 rounded-xl transition-colors cursor-pointer border border-[#bfddf9]/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-[#bfddf9]/20 rounded-lg">
                      <DocumentTextIcon className="h-6 w-6 text-[#2a75c7]" />
                    </div>
                    <div>
                      <h4 className="font-medium">Analyse des Performances Q{i+1}</h4>
                      <p className="text-sm text-gray-500">
                        {Object.keys(energySolutions)[i]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">15 Juin 2024</span>
                    <span className="flex items-center gap-1">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                      Complété
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}