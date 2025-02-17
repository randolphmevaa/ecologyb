"use client";

import { motion } from "framer-motion";
// import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { LineChart } from "@/components/ui/Charts/LineChart";
import {
  LifebuoyIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  ScaleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowUpRightIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  SparklesIcon,
  FireIcon,
  SunIcon,
  BoltIcon,
  HomeModernIcon,
} from "@heroicons/react/24/outline";

const energySolutions = {
  "Pompes a chaleur": { icon: FireIcon, color: "#2a75c7" },
  "Chauffe-eau solaire individuel": { icon: SunIcon, color: "#f59e0b" },
  "Chauffe-eau thermodynamique": { icon: BoltIcon, color: "#10b981" },
  "Système Solaire Combiné": { icon: HomeModernIcon, color: "#8b5cf6" },
};

const supportMetrics = {
  openTickets: 24,
  avgResponseTime: "38m",
  satisfactionRate: "94%",
  slaCompliance: "98%",
};

const ticketData = [
  { day: 'Lun', tickets: 12, solutions: 8 },
  { day: 'Mar', tickets: 18, solutions: 15 },
  { day: 'Mer', tickets: 9, solutions: 7 },
  { day: 'Jeu', tickets: 22, solutions: 18 },
  { day: 'Ven', tickets: 14, solutions: 12 },
];

export default function SupportPage() {
  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Header />
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[#1a365d]">Support & Tickets</h1>
          </div>
          {/* Support Header Metrics */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <LifebuoyIcon className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Tickets Ouverts</h3>
                  <p className="text-2xl font-bold text-red-600">
                    {supportMetrics.openTickets}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Temps de Réponse</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {supportMetrics.avgResponseTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Satisfaction</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {supportMetrics.satisfactionRate}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <ScaleIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Conformité SLA</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {supportMetrics.slaCompliance}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Support Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ticket Analytics */}
            <motion.div 
              className="lg:col-span-2 space-y-8"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              {/* Ticket Trends */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[#1a365d] flex items-center gap-2">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-[#2a75c7]" />
                    Activité des Tickets Hebdomadaire
                  </h2>
                  <Button variant="ghost" size="sm" className="text-[#1a365d]">
                    Exporter CSV <DocumentArrowDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <LineChart
                  data={ticketData}
                  xKey="day"
                  yKeys={['tickets', 'solutions']}
                  colors={['#2a75c7', '#10b981']}
                  height={300}
                  gradient
                  gradientColor="rgba(191, 221, 249, 0.2)"
                />
              </div>

              {/* Recent Tickets */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[#1a365d]">
                    Tickets Récents
                  </h2>
                  <Button variant="ghost" size="sm" className="text-[#1a365d]">
                    Voir Tous <ArrowUpRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => {
                    const solution = Object.keys(energySolutions)[i] as keyof typeof energySolutions;
                    const { color, icon: Icon } = energySolutions[solution];
                    
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 hover:bg-[#bfddf9]/10 rounded-xl transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}10` }}>
                            <Icon className="h-6 w-6" style={{ color }} />
                          </div>
                          <div>
                            <h4 className="font-medium">Problème d&apos;installation {solution}</h4>
                            <p className="text-sm text-gray-500">Client: Entreprise #{i+1}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm px-2 py-1 rounded-full bg-red-100 text-red-600">
                            <XCircleIcon className="h-4 w-4 inline mr-1" />
                            Ouvert
                          </span>
                          <span className="text-sm text-gray-600">2h ago</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Support Operations */}
            <motion.div 
              className="space-y-6"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              {/* Team Availability */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d] flex items-center gap-2">
                  <UserGroupIcon className="h-6 w-6 text-[#2a75c7]" />
                  Disponibilité de l&apos;Équipe
                </h3>
                <div className="space-y-4">
                  {['En ligne', 'Occupé', 'Hors ligne'].map((status, i) => (
                    <div key={status} className="flex items-center justify-between p-3 bg-[#bfddf9]/10 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${
                          i === 0 ? 'bg-green-500' : 
                          i === 1 ? 'bg-amber-500' : 'bg-gray-400'
                        }`} />
                        <span className="text-sm">{status}</span>
                      </div>
                      <span className="font-semibold text-[#1a365d]">{i+2}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d]">
                  Actions Rapides
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <Button className="h-12 bg-[#bfddf9]/20 hover:bg-[#bfddf9]/30 text-[#1a365d] justify-start">
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Nouveau Ticket
                  </Button>
                  <Button className="h-12 bg-[#d2fcb2] hover:bg-[#c2ecb2] text-[#1a4231] justify-start">
                    <UserCircleIcon className="h-5 w-5 mr-2" />
                    Assigner un Technicien
                  </Button>
                  <Button className="h-12 bg-white border border-[#bfddf9]/30 hover:bg-[#bfddf9]/10 text-[#1a365d] justify-start">
                    <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                    Base de Connaissances
                  </Button>
                </div>
              </div>

              {/* SLA Monitoring */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d] flex items-center gap-2">
                  <ScaleIcon className="h-6 w-6 text-[#8b5cf6]" />
                  Surveillance SLA
                </h3>
                <div className="space-y-4">
                  {Object.entries(energySolutions).map(([solution, { color }]) => (
                    <div key={solution} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{solution}</span>
                      <span className="font-semibold" style={{ color }}>
                        98%
                      </span>
                    </div>
                  ))}
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#2a75c7] via-[#10b981] to-[#8b5cf6]" 
                      style={{ width: '98%' }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Customer Communications */}
          <motion.div 
            className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-header text-xl font-semibold text-[#1a365d]">
                Communications Clients
              </h2>
              <Button variant="ghost" size="sm" className="text-[#1a365d]">
                Voir Historique <ArrowUpRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="group p-4 hover:bg-[#bfddf9]/10 rounded-xl transition-colors cursor-pointer border border-[#bfddf9]/20"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[#bfddf9]/20 rounded-lg">
                      <ChatBubbleLeftRightIcon className="h-6 w-6 text-[#2a75c7]" />
                    </div>
                    <div>
                      <h4 className="font-medium">Demande de support #{i+1}</h4>
                      <p className="text-sm text-gray-500">
                        {Object.keys(energySolutions)[i % 4]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Client #{i+1}</span>
                    <span className="text-gray-500">1h ago</span>
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