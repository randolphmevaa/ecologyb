"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
// import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/Header";
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

// Sample data for the Sales Funnel
const funnelStages = [
  { stage: "Prospects", count: 150, color: "#bfddf9" },
  { stage: "Leads Qualifiés", count: 100, color: "#d2fcb2" },
  { stage: "Propositions Envoyées", count: 60, color: "#fdd6ba" },
  { stage: "Négociations", count: 30, color: "#fbcfe8" },
  { stage: "Affaires Gagnées", count: 15, color: "#c7d2fe" },
];

// Sample data for the Deal Forecast
const forecastData = [
  { id: 1, opportunity: "Installation - Pompe à chaleur", probability: 80, value: 12000 },
  { id: 2, opportunity: "Maintenance - Chauffe-eau solaire individuel", probability: 65, value: 8000 },
  { id: 3, opportunity: "Projet - Système solaire combiné", probability: 50, value: 15000 },
  { id: 4, opportunity: "Devis - Chauffe-eau thermodynamique", probability: 40, value: 10000 },
];

//
// SalesFunnel Component: Displays a visual pipeline with sample data.
//
function SalesFunnel() {
  return (
    <motion.div
      className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow border border-[#bfddf9]/30 mb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <ChartBarIcon className="h-6 w-6 text-[#2a75c7]" />
        <h2 className="text-xl font-semibold text-[#1a4231]">Pipeline des opportunités</h2>
      </div>
      <div className="flex flex-col space-y-4">
        {funnelStages.map((stage, index) => (
          <motion.div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white/80 hover:shadow-lg transition-shadow duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: stage.color }}
              >
                <BriefcaseIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#1a365d]">{stage.stage}</p>
                <p className="text-xs text-gray-500">{stage.count} opportunités</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#1a365d]">{stage.count}</span>
              <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#2a75c7]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(stage.count / funnelStages[0].count) * 100}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

//
// DealForecast Component: Displays a forecast table with sample deal data.
//
function DealForecast() {
  return (
    <motion.div
      className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow border border-[#d2fcb2]/30"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <ArrowTrendingUpIcon className="h-6 w-6 text-[#2a8547]" />
        <h2 className="text-xl font-semibold text-[#1a4231]">Prévisions des affaires</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Opportunité</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Probabilité</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Valeur</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {forecastData.map((deal) => (
              <tr key={deal.id} className="hover:bg-gray-100 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-[#1a365d]">
                  {deal.opportunity}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {deal.probability}%
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  <CurrencyDollarIcon className="inline h-4 w-4 text-[#2a8547] mr-1" />
                  {deal.value.toLocaleString()} €
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Button variant="outline" size="sm">Détails</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

//
// OpportunitiesPage: Combines the sidebar, header, and the two main opportunity components.
//
export default function OpportunitiesPage() {
  return (
    <div className="flex h-screen bg-[#ffffff]">
      {/* Sidebar Area */}
      <motion.div
        className="relative border-r border-[#bfddf9]/30 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* <Sidebar role="admin" /> */}
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={{ name: "Administrateur", avatar: "/admin-avatar.png" }} />
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[#1a365d]">Pipeline des opportunités</h1>
            <Button>Nouvelle opportunité</Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesFunnel />
          <DealForecast />
          </div>
          
        </main>
      </div>
    </div>
  );
}
