"use client";

import { Header } from "@/components/Header";
// import { StatsCard } from "@/components/ui/StatsCard";
import { BarChart } from "@/components/ui/Charts/BarChart";
import { LineChart } from "@/components/ui/Charts/LineChart";
import { RecentUsersTable } from "@/components/ui/Tables/RecentUsersTable";
import { Button } from "@/components/ui/Button";
import { 
  ArrowUpRightIcon, 
  UsersIcon, 
  CurrencyDollarIcon, 
  ClockIcon,
  ChartBarIcon,
  // CalendarIcon,
  // ArrowPathIcon,
  // AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
// import { useState } from "react";

export default function AdminDashboard() {
  // const [activeTimeframe, setActiveTimeframe] = useState("week");
  // const [showDataLabels, setShowDataLabels] = useState(true);

  const stats = [
    { 
      name: "Utilisateurs Totaux", 
      value: "2 543",
      icon: UsersIcon,
      trend: "12,5%",
      positive: true,
      description: "Depuis le mois dernier" 
    },
    { 
      name: "Sessions Actives", 
      value: "1 234",
      icon: ClockIcon,
      trend: "3,2%",
      positive: false,
      description: "En temps réel" 
    },
    { 
      name: "Revenus", 
      value: "24 500 €",
      icon: CurrencyDollarIcon,
      trend: "24,8%",
      positive: true,
      description: "Ce mois-ci" 
    },
  ];

  const chartData = [
    { mois: 'Janv', utilisateurs: 65, revenus: 140 },
    { mois: 'Févr', utilisateurs: 78, revenus: 180 },
    { mois: 'Mars', utilisateurs: 83, revenus: 210 },
    { mois: 'Avril', utilisateurs: 92, revenus: 240 },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc]">
      <Header />
      
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
        {/* Dashboard Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-header font-bold text-[#213f5b]">Tableau de bord</h1>
              <p className="text-[#213f5b]/70">Bienvenue dans votre espace administrateur</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-[#bfddf9]/30 text-[#213f5b] hover:bg-[#bfddf9]/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Exporter
              </Button>
              <Button 
                size="sm" 
                className="bg-[#213f5b] hover:bg-[#213f5b]/90 text-white shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Nouveau rapport
              </Button>
            </div>
          </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className={cn(
                "bg-white rounded-2xl p-6 border border-[#bfddf9]/20 shadow-sm transition-all duration-300",
                "hover:border-[#d2fcb2]/50 hover:shadow-md relative overflow-hidden"
              )}>
                <div className="absolute inset-0 bg-gradient-to-br from-white via-[#bfddf9]/5 to-[#d2fcb2]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex items-start justify-between mb-4 relative">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#bfddf9]/20 to-[#d2fcb2]/20">
                    <stat.icon className="h-6 w-6 text-[#213f5b]" />
                  </div>
                  <span className={cn(
                    "text-sm font-semibold flex items-center gap-1 rounded-full px-2.5 py-1",
                    stat.positive 
                      ? "text-green-700 bg-green-100" 
                      : "text-red-700 bg-red-100"
                  )}>
                    {stat.positive ? "+" : ""}{stat.trend}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor" 
                      className={cn(
                        "w-4 h-4",
                        !stat.positive && "transform rotate-180"
                      )}
                    >
                      <path fillRule="evenodd" d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
                
                <div className="space-y-1 relative">
                  <h3 className="text-[#213f5b]/70 text-sm">{stat.name}</h3>
                  <p className="text-3xl font-bold text-[#213f5b]">{stat.value}</p>
                  <p className="text-xs text-[#213f5b]/60">{stat.description}</p>
                </div>
                
                {/* Mini Sparkline */}
                <div className="h-10 mt-3 flex items-end gap-0.5">
                  {[4, 7, 5, 9, 6, 8, 7, 9, 8, 10, 12].map((value, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "w-full h-[20%] bg-[#bfddf9]/40 rounded-sm transition-all group-hover:bg-[#bfddf9]",
                        i === 10 && "bg-[#213f5b] group-hover:bg-[#213f5b]"
                      )}
                      style={{ height: `${value * 10}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Glassmorphism Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div 
              className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20 relative overflow-hidden group"
              whileHover={{ scale: 1.005 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#bfddf9]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#bfddf9]/20 rounded-lg">
                    <UsersIcon className="h-6 w-6 text-[#2a75c7]" />
                  </div>
                  <h2 className="font-header text-xl font-semibold text-[#1a365d]">Croissance des Utilisateurs</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="group-hover:bg-[#bfddf9]/20 text-[#1a365d]"
                >
                  Voir le rapport <ArrowUpRightIcon className="ml-2 h-4 w-4 group-hover:text-[#2a75c7]" />
                </Button>
              </div>
              <LineChart
                data={chartData}
                xKey="mois"
                yKeys={['utilisateurs']}
                colors={['#2a75c7']}
                height={300}
                gradient
                gradientColor="rgba(191, 221, 249, 0.2)"
              />
            </motion.div>

            <motion.div 
              className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#d2fcb2]/30 relative group"
              whileHover={{ scale: 1.005 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#d2fcb2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#d2fcb2]/30 rounded-lg">
                  <CurrencyDollarIcon className="h-6 w-6 text-[#2a8547]" />
                </div>
                <h2 className="font-header text-xl font-semibold text-[#1a4231]">Aperçu des Revenus</h2>
              </div>
              <BarChart
                data={chartData}
                xKey="mois"
                yKeys={['revenus']}
                colors={['#2a8547']}
                height={300}
                barRadius={6}
                gradientColor="rgba(210, 252, 178, 0.3)" currency={""}              />
            </motion.div>
          </div>

          {/* Airy Users Table */}
          <motion.div 
            className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#bfddf9]/20 rounded-lg">
                    <UsersIcon className="h-6 w-6 text-[#2a75c7]" />
                  </div>
                  <h2 className="font-header text-xl font-semibold text-[#1a365d]">Derniers Utilisateurs</h2>
                </div>
                <p className="font-body text-sm text-[#5c7c9f] mt-2 ml-11">
                  32 nouveaux utilisateurs cette semaine
                </p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full sm:w-auto hover:bg-[#bfddf9]/10 border-[#bfddf9]/30 text-[#1a365d]"
                >
                  Exporter CSV
                </Button>
                <Button 
                  size="sm" 
                  className="w-full sm:w-auto shadow-sm hover:shadow-md bg-[#d2fcb2] hover:bg-[#c2ecb2] text-[#1a4231]"
                >
                  Ajouter un utilisateur
                </Button>
              </div>
            </div>
            <RecentUsersTable />
          </motion.div>

        {/* Activity Dashboard with Cards Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Visites aujourd'hui", value: "1 892", change: "+12%", positive: true, icon: ChartBarIcon, color: "from-blue-50 to-blue-100", iconColor: "text-blue-600" },
            { label: "Conversions", value: "12,4%", change: "+3%", positive: true, icon: ArrowUpRightIcon, color: "from-indigo-50 to-indigo-100", iconColor: "text-indigo-600" },
            { label: "Clients satisfaits", value: "94,7%", change: "+1.2%", positive: true, icon: UsersIcon, color: "from-green-50 to-green-100", iconColor: "text-green-600" },
            { label: "Support ouvert", value: "23", change: "-5", positive: true, icon: ClockIcon, color: "from-amber-50 to-amber-100", iconColor: "text-amber-600" },
          ].map((metric, index) => (
            <motion.div 
              key={index}
              className="group cursor-pointer"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              // transition={{ delay: index * 0.1 + 0.3 }}
            >
              <div className="h-full p-5 bg-white rounded-2xl shadow-sm border border-[#bfddf9]/20 hover:border-[#d2fcb2]/50 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between mb-3">
                  <div className={cn(
                    "p-2.5 rounded-lg bg-gradient-to-br",
                    metric.color
                  )}>
                    <metric.icon className={cn("h-5 w-5", metric.iconColor)} />
                  </div>
                  <div className={cn(
                    "text-xs font-semibold flex items-center rounded-full px-2 py-1",
                    metric.positive 
                      ? "text-green-700 bg-green-100" 
                      : "text-red-700 bg-red-100"
                  )}>
                    {metric.change}
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-[#213f5b]/70 text-xs font-medium uppercase tracking-wider">{metric.label}</p>
                  <h3 className="text-2xl font-bold text-[#213f5b] mt-1">{metric.value}</h3>
                </div>
                
                <div className="mt-3 pt-3 border-t border-[#bfddf9]/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#213f5b]/70">Progression</span>
                    <span className="font-medium text-[#213f5b]">78%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#bfddf9] to-[#d2fcb2] rounded-full w-[78%] group-hover:from-[#213f5b] group-hover:to-[#2a75c7] transition-all duration-500"
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}