"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardDocumentCheckIcon,
  CalendarIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  MapPinIcon,
  ClockIcon,
  // ChevronRightIcon,
  LightBulbIcon,
  BoltIcon,
  SunIcon,
  SparklesIcon,
  TruckIcon,
  // ChartBarIcon,
} from "@heroicons/react/24/outline";

const stats = [
  {
    name: "Interventions en cours",
    value: "12",
    icon: WrenchScrewdriverIcon,
    trend: "8.5%",
    positive: true,
    description: "Cette semaine",
    color: "from-[#d2fcb2]/20 to-[#bfddf9]/30",
    iconColor: "text-[#213f5b]",
  },
  {
    name: "Projets terminés",
    value: "20",
    icon: CheckCircleIcon,
    trend: "15.0%",
    positive: true,
    description: "Ce mois-ci",
    color: "from-[#bfddf9]/20 to-[#d2fcb2]/30",
    iconColor: "text-[#213f5b]",
  },
  {
    name: "Équipements installés",
    value: "45",
    icon: SparklesIcon,
    trend: "22.3%",
    positive: true,
    description: "30 derniers jours",
    color: "from-[#d2fcb2]/10 via-[#bfddf9]/20 to-[#d2fcb2]/10",
    iconColor: "text-[#213f5b]",
  },
];

const interventions = [
  {
    id: 1,
    title: "Installation PAC Air-Eau",
    location: "Lyon 7ème",
    client: "Residence Les Érables",
    date: "2024-03-10",
    progress: 80,
    status: "En cours",
    statusColor: "bg-[#bfddf9]/50 text-[#213f5b]",
    equipment: "Pompe à chaleur Daikin",
  },
  {
    id: 2,
    title: "Maintenance chauffe-eau solaire",
    location: "Marseille 13008",
    client: "Maison Dubois",
    date: "2024-03-11",
    progress: 35,
    status: "En attente",
    statusColor: "bg-[#d2fcb2]/50 text-[#213f5b]",
    equipment: "Chauffe-eau Thermodynamique",
  },
  {
    id: 3,
    title: "Contrôle annuel SSC",
    location: "Paris 75015",
    client: "Appt. Bélanger",
    date: "2024-03-12",
    progress: 0,
    status: "Planifiée",
    statusColor: "bg-[#213f5b]/10 text-[#213f5b]",
    equipment: "Système Solaire Combiné",
  },
];

const equipmentStatus = [
  {
    name: "Pompes à chaleur",
    count: 12,
    issues: 2,
    icon: BoltIcon,
    color: "bg-[#213f5b]",
  },
  {
    name: "Chauffe-eaux solaires",
    count: 8,
    issues: 1,
    icon: SunIcon,
    color: "bg-[#d2fcb2]",
  },
  {
    name: "Ventilation Mécanique",
    count: 5,
    issues: 0,
    icon: SparklesIcon,
    color: "bg-[#bfddf9]",
  },
];

const quickActions = [
  { 
    action: "Nouveau rapport d'intervention", 
    icon: ClipboardDocumentCheckIcon,
    color: "bg-[#213f5b]"
  },
  { 
    action: "Planifier une maintenance", 
    icon: CalendarIcon,
    color: "bg-[#d2fcb2]"
  },
  { 
    action: "Commander des pièces", 
    icon: TruckIcon,
    color: "bg-[#bfddf9]"
  },
];

export default function TechnicianDashboard() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    } as const;
    
    setCurrentDate(now.toLocaleDateString('fr-FR', options));
    
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6"
          style={{
            background: "linear-gradient(135deg, rgba(191,221,249,0.1) 0%, rgba(210,252,178,0.05) 100%)",
          }}>
          
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#213f5b] to-[#213f5b]/80 text-white shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Bonjour, Technicien!</h2>
                    <p className="text-[#bfddf9]">{currentDate} - Prêt pour une journée productive et écologique!</p>
                  </div>
                  <button onClick={() => setShowWelcome(false)} className="text-white opacity-80 hover:opacity-100">×</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center mb-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-[#213f5b]">
                Tableau de Bord Technique
              </h1>
              <p className="text-gray-600">
                Gestion des interventions et maintenance écologique
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex gap-3"
            >
              <button className="px-4 py-2 bg-white text-[#213f5b] rounded-lg shadow hover:shadow-md flex items-center gap-2 border border-gray-200">
                <CalendarIcon className="h-5 w-5 text-[#213f5b]/80" />
                <span>Vue Hebdomadaire</span>
              </button>
            </motion.div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Main Content */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* Stats Cards */}
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
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm font-medium text-[#213f5b]">{stat.name}</p>
                      <div className={`p-2 rounded-full bg-white/60 ${stat.iconColor}`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-2xl font-bold text-[#213f5b]">{stat.value}</p>
                      <p className="text-sm flex items-center gap-1 text-[#213f5b]">
                        {stat.trend} ↑
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Interventions en Cours */}
              <motion.div
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bfddf9]/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="p-5 border-b border-[#bfddf9]/20">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[#213f5b]">Interventions en Cours</h2>
                    <button className="px-3 py-1 bg-[#213f5b] text-white rounded-lg text-sm hover:bg-[#213f5b]/90">
                      + Nouvelle Intervention
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-[#bfddf9]/20">
                  {interventions.map((intervention) => (
                    <motion.div
                      key={intervention.id}
                      className="p-4 hover:bg-[#d2fcb2]/5 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="text-base font-semibold text-[#213f5b]">
                            {intervention.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-[#213f5b]/80">
                            <MapPinIcon className="h-4 w-4" />
                            {intervention.location} • {intervention.client}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#213f5b]/80">
                            <ClockIcon className="h-4 w-4" />
                            {intervention.date}
                          </div>
                          <div className="mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${intervention.statusColor}`}>
                              {intervention.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="w-40 space-y-2">
                          <div className="h-2 bg-[#bfddf9]/20 rounded-full">
                            <motion.div
                              className={`h-2 rounded-full ${intervention.progress > 0 ? 'bg-[#213f5b]' : 'bg-gray-200'}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${intervention.progress}%` }}
                              transition={{ duration: 0.8 }}
                            />
                          </div>
                          <p className="text-xs text-[#213f5b]/60 text-right">
                            Progression: {intervention.progress}%
                          </p>
                          <p className="text-xs text-[#213f5b]/60 mt-2">
                            Équipement: {intervention.equipment}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Équipements Installés */}
              <motion.div
                className="bg-white rounded-xl shadow-sm p-5 border border-[#bfddf9]/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-xl font-bold text-[#213f5b] mb-4">État des Équipements</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {equipmentStatus.map((equipment, idx) => (
                    <div key={idx} className="p-4 rounded-lg border border-[#bfddf9]/30 hover:border-[#d2fcb2]/50 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-full ${equipment.color}/20`}>
                          <equipment.icon className="h-6 w-6 text-[#213f5b]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#213f5b]">{equipment.name}</h3>
                          <p className="text-sm text-[#213f5b]/80">{equipment.count} unités</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#213f5b]/80">Incidents:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          equipment.issues > 0 ? 'bg-red-100 text-red-800' : 'bg-[#d2fcb2]/50 text-[#213f5b]'
                        }`}>
                          {equipment.issues} {equipment.issues === 1 ? 'incident' : 'incidents'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Actions Rapides */}
              <motion.div
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bfddf9]/20"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="p-5 border-b border-[#bfddf9]/20">
                  <h2 className="text-xl font-bold text-[#213f5b]">Actions Rapides</h2>
                </div>
                <div className="p-4 space-y-3">
                  {quickActions.map((action, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ x: 5 }}
                      className="w-full p-3 rounded-lg flex items-center gap-3 hover:bg-[#d2fcb2]/10 transition-colors"
                    >
                      <div className={`p-2 rounded-full ${action.color}/20`}>
                        <action.icon className="h-5 w-5 text-[#213f5b]" />
                      </div>
                      <span className="text-sm font-medium text-[#213f5b]">{action.action}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Conseils Techniques */}
              <motion.div
                className="bg-gradient-to-br from-[#d2fcb2]/20 to-[#bfddf9]/20 rounded-xl shadow-sm overflow-hidden border border-[#d2fcb2]/30"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="p-5 border-b border-[#d2fcb2]/30 flex items-center gap-3">
                  <div className="p-2 bg-[#d2fcb2]/30 rounded-full">
                    <LightBulbIcon className="h-5 w-5 text-[#213f5b]" />
                  </div>
                  <h2 className="text-lg font-bold text-[#213f5b]">Astuces Écologiques</h2>
                </div>
                <div className="p-5">
                  <div className="text-sm text-[#213f5b]/80 space-y-3">
                    <p>✅ Vérifiez l&apos;étanchéité des installations pour optimiser l&apos;efficacité énergétique</p>
                    <p>🌱 Recommandez un entretien annuel pour maintenir les performances optimales</p>
                    <p>💡 Utilisez des outils de diagnostic connectés pour un suivi précis</p>
                  </div>
                  <button className="mt-4 w-full py-2 bg-[#213f5b] text-white rounded-lg text-sm hover:bg-[#213f5b]/90 transition-colors">
                    Voir plus de conseils
                  </button>
                </div>
              </motion.div>

              {/* Statistiques d'Efficacité */}
              <motion.div
                className="bg-white rounded-xl shadow-sm p-5 border border-[#bfddf9]/20"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-xl font-bold text-[#213f5b] mb-4">Efficacité Énergétique</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-[#213f5b]/80">Économies moyennes</span>
                      <span className="text-sm font-medium text-[#213f5b]">75%</span>
                    </div>
                    <div className="w-full bg-[#bfddf9]/20 rounded-full h-2">
                      <div className="h-2 rounded-full bg-[#213f5b] w-3/4"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-[#213f5b]/80">Taux de satisfaction</span>
                      <span className="text-sm font-medium text-[#213f5b]">94%</span>
                    </div>
                    <div className="w-full bg-[#bfddf9]/20 rounded-full h-2">
                      <div className="h-2 rounded-full bg-[#d2fcb2] w-11/12"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}