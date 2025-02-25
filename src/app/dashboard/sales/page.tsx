"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircleIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  ArrowUpRightIcon,
  ChartBarIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  LightBulbIcon,
  BoltIcon,
  SunIcon,
  // DropletIcon
} from "@heroicons/react/24/outline";

// Brand colors
// const brandColors = {
//   white: "#ffffff",
//   lightBlue: "#bfddf9",
//   lightGreen: "#d2fcb2",
//   navyBlue: "#213f5b"
// };

// Sample statistics data for the Sales dashboard
const stats = [
  {
    name: "Total Leads",
    value: "1,200",
    icon: UserCircleIcon,
    trend: "8.4%",
    positive: true,
    description: "Depuis le mois dernier",
    color: "from-white to-[#bfddf9]/30",
    iconColor: "text-[#213f5b]",
    trendColor: "text-[#213f5b]"
  },
  {
    name: "Opportunités",
    value: "320",
    icon: BriefcaseIcon,
    trend: "3.7%",
    positive: false,
    description: "Nouveaux ce mois-ci",
    color: "from-white to-[#d2fcb2]/30",
    iconColor: "text-[#213f5b]",
    trendColor: "text-red-600"
  },
  {
    name: "Revenus",
    value: "€45,000",
    icon: CurrencyDollarIcon,
    trend: "12.3%",
    positive: true,
    description: "Ce mois-ci",
    color: "from-[#bfddf9]/30 to-[#bfddf9]/50",
    iconColor: "text-[#213f5b]",
    trendColor: "text-[#213f5b]"
  },
];

// Sample pipeline data for the sales funnel
const pipeline = [
  { stage: "Prospection", percentage: 40, color: "bg-[#213f5b]" },
  { stage: "Qualification", percentage: 30, color: "bg-[#213f5b]/80" },
  { stage: "Proposition", percentage: 20, color: "bg-[#213f5b]/60" },
  { stage: "Négociation", percentage: 10, color: "bg-[#213f5b]/40" },
];

// Sample recent leads data with solution types and icons
const recentLeads = [
  {
    id: 1,
    name: "Client Alpha",
    solution: "Pompes à chaleur",
    icon: BoltIcon,
    contact: "alpha@example.com",
    status: "Nouveau",
    statusColor: "bg-[#d2fcb2]/50 text-[#213f5b]",
    date: "2025-04-01",
  },
  {
    id: 2,
    name: "Client Beta",
    solution: "Chauffe-eau solaire individuel",
    icon: SunIcon,
    contact: "beta@example.com",
    status: "En discussion",
    statusColor: "bg-[#bfddf9]/50 text-[#213f5b]",
    date: "2025-04-03",
  },
  {
    id: 3,
    name: "Client Gamma",
    solution: "Chauffe-eau thermodynamique",
    icon: BoltIcon,
    contact: "gamma@example.com",
    status: "Converti",
    statusColor: "bg-[#213f5b]/20 text-[#213f5b]",
    date: "2025-03-28",
  },
  {
    id: 4,
    name: "Client Delta",
    solution: "Panneaux solaires",
    icon: SunIcon,
    contact: "delta@example.com",
    status: "Nouveau",
    statusColor: "bg-[#d2fcb2]/50 text-[#213f5b]",
    date: "2025-04-05",
  },
];

// Sample top performing regions data
const topRegions = [
  { 
    region: "Île-de-France", 
    revenue: "€20,000", 
    growth: "12%", 
    color: "from-[#bfddf9] to-[#bfddf9]",
    solutions: "Pompes à chaleur, Panneaux solaires" 
  },
  { 
    region: "Provence-Alpes-Côte d'Azur", 
    revenue: "€15,000", 
    growth: "8%", 
    color: "from-[#d2fcb2] to-[#d2fcb2]",
    solutions: "Chauffe-eau solaire" 
  },
  { 
    region: "Auvergne-Rhône-Alpes", 
    revenue: "€10,000", 
    growth: "15%", 
    color: "from-[#bfddf9]/70 to-[#d2fcb2]/70",
    solutions: "Éoliennes domestiques" 
  },
];

// Sample next actions
const nextActions = [
  { 
    action: "Appel avec Client Alpha", 
    date: "Aujourd'hui, 14:00", 
    priority: "Haute",
    priorityColor: "bg-red-100 text-red-800" 
  },
  { 
    action: "Présentation solution à Client Omega", 
    date: "Demain, 10:00", 
    priority: "Moyenne",
    priorityColor: "bg-[#bfddf9]/50 text-[#213f5b]" 
  },
  { 
    action: "Suivi avec Client Beta", 
    date: "26 Fev, 15:30", 
    priority: "Normale",
    priorityColor: "bg-[#d2fcb2]/40 text-[#213f5b]" 
  },
];

// Sample solution performance
const solutionPerformance = [
  { name: "Pompes à chaleur", sales: 42, growth: "+15%", color: "bg-[#213f5b]" },
  { name: "Panneaux solaires", sales: 38, growth: "+10%", color: "bg-[#bfddf9]" },
  { name: "Chauffe-eau solaire", sales: 27, growth: "+5%", color: "bg-[#d2fcb2]" },
  { name: "Éoliennes domestiques", sales: 15, growth: "+20%", color: "bg-[#bfddf9]/60" },
];

export default function SalesDashboard() {
  // State for filter
  const [leadFilter, setLeadFilter] = useState("Tous");
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentDate, setCurrentDate] = useState("");

  // Update current date on component mount
  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };    
    setCurrentDate(now.toLocaleDateString('fr-FR', options));
    
    // Hide welcome message after 5 seconds
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Optionally filter recent leads
  const filteredLeads =
    leadFilter === "Tous"
      ? recentLeads
      : recentLeads.filter((lead) => lead.solution.includes(leadFilter));

  return (
    <div className="flex h-screen bg-[#ffffff]">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Common Header */}
        <Header />

        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(191,221,249,0.1) 0%, rgba(210,252,178,0.05) 100%)",
          }}>
          
          {/* Welcome Banner with Fade Out */}
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#213f5b] to-[#213f5b]/80 text-white shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0, padding: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Bonjour, Michelle!</h2>
                    <p className="text-[#bfddf9]">{currentDate} – Une belle journée pour sauver la planète et faire du business!</p>
                  </div>
                  <button onClick={() => setShowWelcome(false)} className="text-white opacity-80 hover:opacity-100">×</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dashboard Header */}
          <div className="flex justify-between items-center mb-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-[#213f5b]">
                Tableau de Bord Commercial
              </h1>
              <p className="text-gray-600">
                Solutions énergétiques écologiques - Aperçu des ventes
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex gap-3"
            >
              <button className="px-4 py-2 bg-white text-[#213f5b] rounded-lg shadow hover:shadow-md flex items-center gap-2 border border-gray-200">
                <CalendarDaysIcon className="h-5 w-5 text-[#213f5b]/80" />
                <span>Cette semaine</span>
              </button>
              <button className="px-4 py-2 bg-[#213f5b] text-white rounded-lg shadow hover:shadow-md hover:bg-[#213f5b]/90 transition-colors flex items-center gap-2">
                <ArrowTrendingUpIcon className="h-5 w-5" />
                <span>Rapport complet</span>
              </button>
            </motion.div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - 8/12 */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* Sales Statistics Cards */}
              <motion.div
                className="grid grid-cols-1 gap-5 md:grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {stats.map((stat) => (
                  <motion.div
                    key={stat.name}
                    className={`p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br ${stat.color} border border-[#bfddf9]/30`}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm font-medium text-[#213f5b]">{stat.name}</p>
                      <div className={`p-2 rounded-full bg-white/60 ${stat.iconColor}`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-2xl font-bold text-[#213f5b]">{stat.value}</p>
                      <p className={`text-sm flex items-center gap-1 ${stat.trendColor}`}>
                        {stat.trend} {stat.positive ? "↑" : "↓"}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Recent Leads Table with Quick Actions */}
              <motion.div
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bfddf9]/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="p-5 border-b border-[#bfddf9]/20">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[#213f5b]">Leads Récents</h2>
                    <div className="flex gap-2">
                      <select 
                        className="px-3 py-1 rounded-lg border border-[#bfddf9]/30 text-sm text-[#213f5b] focus:outline-none focus:ring-2 focus:ring-[#213f5b]"
                        value={leadFilter}
                        onChange={(e) => setLeadFilter(e.target.value)}
                      >
                        <option value="Tous">Toutes solutions</option>
                        <option value="Pompes">Pompes à chaleur</option>
                        <option value="solaire">Solutions solaires</option>
                        <option value="thermodynamique">Thermodynamique</option>
                      </select>
                      <button className="px-3 py-1 bg-[#213f5b] text-white rounded-lg text-sm hover:bg-[#213f5b]/90">
                        + Nouveau Lead
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-[#bfddf9]/10">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-[#213f5b] uppercase tracking-wider">Client</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-[#213f5b] uppercase tracking-wider">Solution</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-[#213f5b] uppercase tracking-wider">Contact</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-[#213f5b] uppercase tracking-wider">Statut</th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-[#213f5b] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#bfddf9]/10">
                      {filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-[#d2fcb2]/5 transition-colors">
                          <td className="px-5 py-4 text-sm text-[#213f5b] font-medium">{lead.name}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-full bg-[#d2fcb2]/30">
                                <lead.icon className="h-4 w-4 text-[#213f5b]" />
                              </span>
                              <span className="text-sm text-[#213f5b]/80">{lead.solution}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-[#213f5b]/70">{lead.contact}</td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${lead.statusColor}`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-1 rounded-full hover:bg-[#bfddf9]/10">
                                <CalendarDaysIcon className="h-4 w-4 text-[#213f5b]/60" />
                              </button>
                              <button className="p-1 rounded-full hover:bg-[#bfddf9]/10">
                                <ChartBarIcon className="h-4 w-4 text-[#213f5b]/60" />
                              </button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center text-[#213f5b] font-medium text-sm ml-2"
                              >
                                Détails <ChevronRightIcon className="ml-1 h-4 w-4" />
                              </motion.button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-3 bg-[#bfddf9]/5 border-t border-[#bfddf9]/20 text-center">
                  <button className="text-[#213f5b] text-sm font-medium hover:text-[#213f5b]/80">
                    Voir tous les leads →
                  </button>
                </div>
              </motion.div>

              {/* Pipeline Overview */}
              <motion.div
                className="bg-white rounded-xl shadow-sm p-5 border border-[#bfddf9]/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-bold text-[#213f5b]">Vue d&apos;ensemble du Pipeline</h2>
                  <span className="text-sm text-[#213f5b]/70">285 opportunités actives</span>
                </div>
                
                <div className="space-y-5">
                  {pipeline.map((stage, idx) => (
                    <div key={idx} className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-[#213f5b]">{stage.stage}</span>
                        <span className="text-sm font-medium text-[#213f5b]">{stage.percentage}%</span>
                      </div>
                      <div className="w-full bg-[#bfddf9]/20 rounded-full h-3">
                        <motion.div
                          className={`h-3 rounded-full ${stage.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${stage.percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.1 * idx }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between">
                        <span className="text-xs text-[#213f5b]/70">{Math.round(320 * stage.percentage / 100)} opportunités</span>
                        <span className="text-xs text-[#213f5b]/70">€{Math.round(45000 * stage.percentage / 100).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Solution Performance */}
              <motion.div
                className="bg-white rounded-xl shadow-sm p-5 border border-[#bfddf9]/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-xl font-bold text-[#213f5b] mb-4">Performance par Solution</h2>
                <div className="flex flex-col space-y-3">
                  {solutionPerformance.map((solution, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-52 font-medium text-[#213f5b]">{solution.name}</div>
                      <div className="flex-1">
                        <div className="w-full bg-[#bfddf9]/20 rounded-full h-3">
                          <motion.div
                            className={`h-3 rounded-full ${solution.color}`}
                            style={{ width: `${(solution.sales / 50) * 100}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(solution.sales / 50) * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.1 * idx }}
                          />
                        </div>
                      </div>
                      <div className="w-20 pl-4 text-sm font-medium text-[#213f5b] text-right">{solution.sales}</div>
                      <div className="w-16 pl-2 text-sm font-medium text-[#213f5b] text-right">{solution.growth}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-[#bfddf9]/20 flex justify-between items-center">
                  <p className="text-sm text-[#213f5b]/80">Total des ventes: <span className="font-medium">122 unités</span></p>
                  <button className="text-[#213f5b] text-sm font-medium hover:text-[#213f5b]/80 flex items-center">
                    Rapport détaillé <ArrowUpRightIcon className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Right Column - 4/12 */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Upcoming Actions Card */}
              <motion.div
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bfddf9]/20"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="p-5 border-b border-[#bfddf9]/20">
                  <h2 className="text-xl font-bold text-[#213f5b]">Actions à venir</h2>
                </div>
                <div className="divide-y divide-[#bfddf9]/20">
                  {nextActions.map((action, idx) => (
                    <div key={idx} className="p-4 hover:bg-[#d2fcb2]/5 transition-colors">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-[#213f5b]">{action.action}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${action.priorityColor}`}>
                          {action.priority}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center text-xs text-[#213f5b]/70">
                        <CalendarDaysIcon className="h-3.5 w-3.5 mr-1" />
                        {action.date}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-[#bfddf9]/5 text-center">
                  <button className="text-[#213f5b] text-sm font-medium hover:text-[#213f5b]/80">
                    + Ajouter une action
                  </button>
                </div>
              </motion.div>

              {/* Top Performing Regions */}
              <motion.div
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bfddf9]/20"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="p-5 border-b border-[#bfddf9]/20">
                  <h2 className="text-xl font-bold text-[#213f5b]">Top Régions</h2>
                </div>
                <div className="p-4 space-y-4">
                  {topRegions.map((region, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-gradient-to-r from-white to-[#bfddf9]/5 hover:to-[#d2fcb2]/10 transition-all border border-[#bfddf9]/30 hover:border-[#d2fcb2]/50">
                      <div className={`h-1.5 w-12 rounded-full mb-3 bg-gradient-to-r ${region.color}`}></div>
                      <h3 className="text-base font-semibold text-[#213f5b] flex justify-between">
                        {region.region}
                        <span className="text-[#213f5b] text-sm">+{region.growth}</span>
                      </h3>
                      <p className="mt-1 text-sm text-[#213f5b]/80">{region.revenue} de revenus</p>
                      <p className="mt-2 text-xs text-[#213f5b]/70 truncate">Solutions populaires: {region.solutions}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Eco Tips */}
              <motion.div
                className="bg-gradient-to-br from-[#d2fcb2]/20 to-[#bfddf9]/20 rounded-xl shadow-sm overflow-hidden border border-[#d2fcb2]/30"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="p-5 border-b border-[#d2fcb2]/30 flex items-center gap-3">
                  <div className="p-2 bg-[#d2fcb2]/30 rounded-full">
                    <LightBulbIcon className="h-5 w-5 text-[#213f5b]" />
                  </div>
                  <h2 className="text-lg font-bold text-[#213f5b]">Conseils Éco-Vente</h2>
                </div>
                <div className="p-5">
                  <div className="text-sm text-[#213f5b]/80">
                    <p className="mb-3"><span className="font-medium">💡 Le saviez-vous?</span> Une pompe à chaleur permet d&apos;économiser jusqu&apos;à 75% sur la facture de chauffage par rapport aux systèmes traditionnels.</p>
                    <p><span className="font-medium">🔍 Argument clé:</span> Soulignez que l&apos;investissement initial est compensé en moyenne après 4-5 ans d&apos;utilisation.</p>
                  </div>
                  <button className="mt-4 w-full py-2 bg-[#213f5b] text-white rounded-lg text-sm hover:bg-[#213f5b]/90 transition-colors">
                    Plus de conseils de vente
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
