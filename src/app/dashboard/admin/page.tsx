"use client";


import { Header } from "@/components/Header";
import { StatsCard } from "@/components/ui/StatsCard";
import { BarChart } from "@/components/ui/Charts/BarChart";
import { LineChart } from "@/components/ui/Charts/LineChart";
import { RecentUsersTable } from "@/components/ui/Tables/RecentUsersTable";
import { Button } from "@/components/ui/Button";
import { ArrowUpRightIcon, UsersIcon, CurrencyDollarIcon, ClockIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const stats = [
    { 
      name: "Utilisateurs Totaux", 
      value: "2 543",
      icon: UsersIcon,
      trend: "12,5%",
      positive: true,
      description: "Depuis le mois dernier" 
    },
    { 
      name: "Sessions Actives", 
      value: "1 234",
      icon: ClockIcon,
      trend: "3,2%",
      positive: false,
      description: "En temps réel" 
    },
    { 
      name: "Revenus", 
      value: "24 500 €",
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
    <div className="flex h-screen bg-[#ffffff]">
      {/* Branded Sidebar Area */}
      <motion.div 
        className="relative border-r border-[#bfddf9]/30 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
      </motion.div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Header />
        
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
          {/* Floating Stats Grid */}
          <motion.div 
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {stats.map((stat) => (
              <StatsCard 
                key={stat.name} 
                stat={stat}
                className={cn(
                  "hover:shadow-xl transition-all duration-300",
                  "border border-[#bfddf9]/30 bg-white",
                  "hover:border-[#d2fcb2]/50 hover:bg-gradient-to-br hover:from-white hover:to-[#bfddf9]/10"
                )}
              />
            ))}
          </motion.div>

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

          {/* Live Pulse Widget */}
          <motion.div 
            className="bg-[#bfddf9]/10 p-6 rounded-2xl border border-[#bfddf9]/20 backdrop-blur-sm"
            whileHover={{ scale: 1.005 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-2 w-2 bg-[#2a75c7] rounded-full animate-pulse" />
              <h3 className="font-header font-semibold text-[#1a365d]">Activité en temps réel</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              {[
                { label: "Visites aujourd'hui", value: "1 892" },
                { label: "Conversions", value: "12,4%" },
                { label: "Clients satisfaits", value: "94,7%" },
                { label: "Support ouvert", value: "23" },
              ].map((metric, index) => (
                <div 
                  key={index}
                  className="p-4 bg-white/90 rounded-xl border border-[#bfddf9]/20 hover:border-[#d2fcb2]/50 transition-colors backdrop-blur-sm"
                >
                  <div className="text-[#5c7c9f] mb-1">{metric.label}</div>
                  <div className="font-header text-xl font-semibold text-[#1a365d]">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
