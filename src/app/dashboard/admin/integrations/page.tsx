"use client";

import { motion } from "framer-motion";
// import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { LineChart } from "@/components/ui/Charts/LineChart";
import {
  CodeBracketIcon,
  DocumentArrowDownIcon,
  ServerIcon,
  CheckCircleIcon,
  KeyIcon,
  CpuChipIcon,
  LinkIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  // ArrowPathIcon,
  CommandLineIcon,
  LockClosedIcon,
  CloudIcon,
  GlobeAltIcon,
  // DocumentMagnifyingGlassIcon,
  BoltIcon,
  // SunIcon,
  // FireIcon,
  // HomeModernIcon,
  ArrowUpRightIcon,
  PlusIcon,
  EllipsisVerticalIcon
} from "@heroicons/react/24/outline";

const energyIntegrations = {
  "Monitoring Énergétique": { icon: BoltIcon, color: "#2a75c7" },
  "IoT Devices": { icon: CpuChipIcon, color: "#f59e0b" },
  "ERP Sectoriel": { icon: ServerIcon, color: "#10b981" },
  "Portail Client": { icon: GlobeAltIcon, color: "#8b5cf6" },
};

const apiMetrics = {
  activeConnections: 42,
  apiUsage: "98%",
  latency: "128ms",
  errorRate: "0.2%",
};

const usageData = [
  { hour: '00h', requests: 1200 },
  { hour: '04h', requests: 800 },
  { hour: '08h', requests: 4500 },
  { hour: '12h', requests: 6200 },
  { hour: '16h', requests: 5800 },
  { hour: '20h', requests: 3800 },
];

export default function IntegrationsPage() {
  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[#1a365d]">Intégrations / API</h1>
          </div>
          {/* API Health Header */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <LinkIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Connexions Actives</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {apiMetrics.activeConnections}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Utilisation API</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {apiMetrics.apiUsage}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <CommandLineIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Latence Moyenne</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {apiMetrics.latency}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <ShieldCheckIcon className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Taux d&apos;Erreur</h3>
                  <p className="text-2xl font-bold text-red-600">
                    {apiMetrics.errorRate}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Integration Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* API Management */}
            <motion.div 
              className="lg:col-span-2 space-y-8"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              {/* API Usage Monitor */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[#1a365d] flex items-center gap-2">
                    <CodeBracketIcon className="h-6 w-6 text-[#2a75c7]" />
                    Activité API en Temps Réel
                  </h2>
                  <Button variant="ghost" size="sm" className="text-[#1a365d]">
                    Exporter les Données <DocumentArrowDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <LineChart
                  data={usageData}
                  xKey="hour"
                  yKeys={['requests']}
                  colors={['#2a75c7']}
                  height={300}
                  gradient
                  gradientColor="rgba(191, 221, 249, 0.2)"
                />
              </div>

              {/* Energy Solution Endpoints */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[#1a365d]">
                    Endpoints Énergétiques
                  </h2>
                  <Button variant="ghost" size="sm" className="text-[#1a365d]">
                    Voir Documentation <ArrowUpRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(energyIntegrations).map(([integration, { icon: Icon, color }]) => (
                    <div
                      key={integration}
                      className="p-4 hover:bg-[#bfddf9]/10 rounded-xl border border-[#bfddf9]/20 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}10` }}>
                          <Icon className="h-6 w-6" style={{ color }} />
                        </div>
                        <div>
                          <h4 className="font-medium">{integration}</h4>
                          <p className="text-sm text-gray-500">api/v1/{integration.toLowerCase().replace(/ /g, '-')}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">98% uptime</span>
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircleIcon className="h-4 w-4" />
                          Opérationnel
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Integration Controls */}
            <motion.div 
              className="space-y-6"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              {/* API Key Management */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d] flex items-center gap-2">
                  <KeyIcon className="h-6 w-6 text-[#8b5cf6]" />
                  Gestion des Clés API
                </h3>
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[#bfddf9]/10 rounded-xl">
                      <div className="flex items-center gap-2">
                        <LockClosedIcon className="h-5 w-5 text-gray-600" />
                        <span className="text-sm truncate">sk_live_...{i}2345</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          i === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {i === 0 ? 'Actif' : 'Révoqué'}
                        </span>
                        <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                  <Button className="w-full bg-[#d2fcb2] hover:bg-[#c2ecb2] text-[#1a4231]">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Générer une Nouvelle Clé
                  </Button>
                </div>
              </div>

              {/* Connected Services */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d]">
                  Services Connectés
                </h3>
                <div className="space-y-4">
                  {[
                    { name: "Zendesk", status: "connected", color: "#2a75c7" },
                    { name: "Salesforce", status: "connected", color: "#10b981" },
                    { name: "Azure IoT", status: "pending", color: "#f59e0b" },
                  ].map((service) => (
                    <div key={service.name} className="flex items-center justify-between p-3 bg-[#bfddf9]/10 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-5 w-5 rounded-full" 
                          style={{ backgroundColor: service.color }}
                        />
                        <span className="text-sm">{service.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        service.status === 'connected' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {service.status === 'connected' ? 'Connecté' : 'En Attente'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Webhooks */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d] flex items-center gap-2">
                  <CloudIcon className="h-6 w-6 text-[#2a75c7]" />
                  Webhooks Actifs
                </h3>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[#bfddf9]/10 rounded-xl">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-5 w-5 text-gray-600" />
                        <span className="text-sm truncate">https://webhook.energy/{i+1}</span>
                      </div>
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Energy IoT Status */}
          <motion.div 
            className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-header text-xl font-semibold text-[#1a365d]">
                Statut des Appareils IoT Énergétiques
              </h2>
              <Button variant="ghost" size="sm" className="text-[#1a365d]">
                Voir Tous <ArrowUpRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(energyIntegrations).map(([solution, { icon: Icon, color }]) => (
                <div
                  key={solution}
                  className="p-4 hover:bg-[#bfddf9]/10 rounded-xl border border-[#bfddf9]/20 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}10` }}>
                      <Icon className="h-6 w-6" style={{ color }} />
                    </div>
                    <div>
                      <h4 className="font-medium">{solution}</h4>
                      <p className="text-sm text-gray-500">{(Math.random()*1000).toFixed(0)} appareils</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Connectivité</span>
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircleIcon className="h-4 w-4" />
                      {(Math.random()*100).toFixed(1)}%
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