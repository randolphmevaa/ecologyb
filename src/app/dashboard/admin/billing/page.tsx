"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { LineChart } from "@/components/ui/Charts/LineChart";
import {
  CurrencyEuroIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  ChartBarIcon,
  FireIcon,
  SunIcon,
  ArrowUpRightIcon,
  BoltIcon,
  HomeModernIcon,
} from "@heroicons/react/24/outline";

const energySolutions = {
  "Pompes a chaleur": { icon: FireIcon, color: "#2a75c7" },
  "Chauffe-eau solaire individuel": { icon: SunIcon, color: "#f59e0b" },
  "Chauffe-eau thermodynamique": { icon: BoltIcon, color: "#10b981" },
  "Système Solaire Combiné": { icon: HomeModernIcon, color: "#8b5cf6" },
};

const billingData = {
  overdueInvoices: 3,
  totalRevenue: "124 500 €",
  pendingPayments: "45 200 €",
  averagePaymentTime: "34 jours",
};

const revenueData = [
  { month: 'Janv', revenue: 65000 },
  { month: 'Févr', revenue: 82000 },
  { month: 'Mars', revenue: 105000 },
  { month: 'Avril', revenue: 124500 },
];

export default function BillingPage() {
  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={{ name: "Administrateur", avatar: "/admin-avatar.png" }} />
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[#1a365d]">Facturation / Paiements</h1>
          </div>
        
          {/* Energy Solutions Quick Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {Object.entries(energySolutions).map(([solution, { icon: Icon, color }]) => (
              <div
                key={solution}
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
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{solution}</h3>
                    <p className="text-2xl font-bold mt-1" style={{ color }}>
                      12 450 €
                    </p>
                    <span className="text-sm text-gray-500">+8.4% vs dernier trimestre</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Main Billing Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Overview */}
            <motion.div 
              className="lg:col-span-2 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#bfddf9]/20 rounded-lg">
                    <CurrencyEuroIcon className="h-6 w-6 text-[#2a75c7]" />
                  </div>
                  <h2 className="font-header text-xl font-semibold text-[#1a365d]">
                    Revenus des Solutions Énergétiques
                  </h2>
                </div>
                <Button variant="ghost" size="sm" className="text-[#1a365d]">
                  Exporter PDF <DocumentArrowDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <LineChart
                data={revenueData}
                xKey="month"
                yKeys={['revenue']}
                colors={['#2a75c7']}
                height={300}
                gradient
                gradientColor="rgba(191, 221, 249, 0.2)"
                currency="€"
              />
            </motion.div>

            {/* Key Metrics */}
            <div className="space-y-6">
              <motion.div 
                className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d]">Statistiques Clés</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-[#bfddf9]/10 rounded-xl">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-5 w-5 text-red-500" />
                      <span className="text-sm">Factures En Retard</span>
                    </div>
                    <span className="font-semibold text-red-600">{billingData.overdueInvoices}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#d2fcb2]/10 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CurrencyEuroIcon className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Revenu Total</span>
                    </div>
                    <span className="font-semibold text-green-700">{billingData.totalRevenue}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#fde68a]/10 rounded-xl">
                    <div className="flex items-center gap-2">
                      <ChartBarIcon className="h-5 w-5 text-amber-600" />
                      <span className="text-sm">Paiements En Attente</span>
                    </div>
                    <span className="font-semibold text-amber-700">{billingData.pendingPayments}</span>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div 
                className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d]">Actions Rapides</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button className="h-12 bg-[#bfddf9]/20 hover:bg-[#bfddf9]/30 text-[#1a365d]">
                    + Nouvelle Facture
                  </Button>
                  <Button className="h-12 bg-[#d2fcb2] hover:bg-[#c2ecb2] text-[#1a4231]">
                    Générer Rapport
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Recent Transactions */}
          <motion.div 
            className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-header text-xl font-semibold text-[#1a365d]">
                Transactions Récentes
              </h2>
              <Button variant="ghost" size="sm" className="text-[#1a365d]">
                Voir Toutes <ArrowUpRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between p-4 hover:bg-[#bfddf9]/10 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-[#bfddf9]/20 rounded-lg">
                      <DocumentArrowDownIcon className="h-6 w-6 text-[#2a75c7]" />
                    </div>
                    <div>
                      <h4 className="font-medium">Facture #INV-00{i+1}</h4>
                      <p className="text-sm text-gray-500">Installation {Object.keys(energySolutions)[i]}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">8 450 €</p>
                    <span className="text-sm text-green-600">Payé</span>
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