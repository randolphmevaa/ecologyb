"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardDocumentCheckIcon,
  CalendarIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  MapPinIcon,
  ClockIcon,
  ChevronRightIcon,
  LightBulbIcon,
  BoltIcon,
  SunIcon,
  MoonIcon,
  SparklesIcon,
  TruckIcon,
  ChartBarIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  // EllipsisHorizontalIcon,
  BellAlertIcon,
  PresentationChartLineIcon,
  // CogIcon,
  DocumentTextIcon,
  // HandThumbUpIcon,
  // StarIcon,
  // FireIcon,
  CloudIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import {
  StarIcon as StarIconSolid,
  FireIcon as FireIconSolid,
  BoltIcon as BoltIconSolid,
  // SunIcon as SunIconSolid,
} from "@heroicons/react/24/solid";

// Dummy data for our dashboard
const technicianInfo = {
  name: "Thomas Dubois",
  role: "Technicien Sénior",
  avatar: "/avatars/thomas.jpg",
  rating: 4.9,
  certified: true,
  status: "Disponible",
  completionRate: 98,
  efficiency: 92,
};

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
    iconBg: "bg-[#d2fcb2]",
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
    iconBg: "bg-[#bfddf9]",
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
    iconBg: "bg-white",
  },
];

const interventions = [
  {
    id: 1,
    title: "Installation PAC Air-Eau",
    location: "Lyon 7ème",
    client: "Residence Les Érables",
    date: "2024-03-10",
    time: "09:00 - 12:30",
    progress: 80,
    status: "En cours",
    statusColor: "bg-[#bfddf9]/50 text-[#213f5b]",
    equipment: "Pompe à chaleur Daikin Altherma 3",
    priority: "Haute",
    priorityColor: "text-orange-600",
    description: "Installation complète avec mise en service et formation client",
    eco_impact: "+68% d'efficacité vs. ancien système",
    client_image: "/clients/residence.jpg"
  },
  {
    id: 2,
    title: "Maintenance chauffe-eau solaire",
    location: "Marseille 13008",
    client: "Maison Dubois",
    date: "2024-03-11",
    time: "14:00 - 16:00",
    progress: 35,
    status: "En attente",
    statusColor: "bg-[#d2fcb2]/50 text-[#213f5b]",
    equipment: "Chauffe-eau Thermodynamique Atlantic",
    priority: "Normale", 
    priorityColor: "text-blue-600",
    description: "Vérification annuelle et optimisation des performances",
    eco_impact: "Prolongation durée de vie +5 ans",
    client_image: "/clients/maison.jpg"
  },
  {
    id: 3,
    title: "Contrôle annuel SSC",
    location: "Paris 75015",
    client: "Appt. Bélanger",
    date: "2024-03-12",
    time: "10:30 - 12:00",
    progress: 0,
    status: "Planifiée",
    statusColor: "bg-[#213f5b]/10 text-[#213f5b]",
    equipment: "Système Solaire Combiné Wagner",
    priority: "Basse",
    priorityColor: "text-green-600",
    description: "Contrôle de routine et vérification des performances",
    eco_impact: "Optimisation rendement +15%",
    client_image: "/clients/apartment.jpg"
  },
  {
    id: 4,
    title: "Installation Panneaux Photovoltaïques",
    location: "Nantes 44000",
    client: "Centre Commercial Atlantis",
    date: "2024-03-15",
    time: "08:00 - 17:00",
    progress: 10,
    status: "Préparation",
    statusColor: "bg-purple-100 text-purple-700",
    equipment: "30 panneaux SunPower Maxeon 3",
    priority: "Urgente",
    priorityColor: "text-red-600",
    description: "Installation sur toiture plate avec système de monitoring",
    eco_impact: "Réduction CO2: 15 tonnes/an",
    client_image: "/clients/commercial.jpg"
  },
];

const equipmentStatus = [
  {
    name: "Pompes à chaleur",
    count: 12,
    issues: 2,
    icon: BoltIcon,
    color: "bg-[#213f5b]",
    efficiency: 94,
    lastCheck: "Il y a 3 jours",
    model: "Daikin, Mitsubishi, Atlantic"
  },
  {
    name: "Chauffe-eaux solaires",
    count: 8,
    issues: 1,
    icon: SunIcon,
    color: "bg-[#d2fcb2]",
    efficiency: 88,
    lastCheck: "Il y a 2 semaines",
    model: "Wagner, Viessmann, De Dietrich"
  },
  {
    name: "Ventilation Mécanique",
    count: 5,
    issues: 0,
    icon: CloudIcon,
    color: "bg-[#bfddf9]",
    efficiency: 97,
    lastCheck: "Hier",
    model: "Aldes, Atlantic, Zehnder"
  },
];

const quickActions = [
  { 
    action: "Nouveau rapport d'intervention", 
    icon: ClipboardDocumentCheckIcon,
    color: "bg-[#213f5b]",
    description: "Créer un rapport détaillé"
  },
  { 
    action: "Planifier une maintenance", 
    icon: CalendarIcon,
    color: "bg-[#d2fcb2]",
    description: "Organiser votre planning"
  },
  { 
    action: "Commander des pièces", 
    icon: TruckIcon,
    color: "bg-[#bfddf9]",
    description: "Demander des composants"
  },
  { 
    action: "Contacter un client", 
    icon: ChatBubbleLeftRightIcon,
    color: "bg-[#d2fcb2]/70",
    description: "Envoyer un message"
  },
];

const ecoTips = [
  "Vérifiez l'étanchéité des installations pour optimiser l'efficacité énergétique",
  "Recommandez un entretien annuel pour maintenir les performances optimales",
  "Utilisez des outils de diagnostic connectés pour un suivi précis",
  "Nettoyez régulièrement les filtres pour améliorer la qualité de l'air",
  "Ajustez les paramètres selon les saisons pour optimiser la consommation",
  "Expliquez au client les bonnes pratiques d'utilisation",
];

const performanceMetrics = [
  { name: "Économies moyennes", value: 75, color: "#213f5b", suffix: "%" },
  { name: "Taux de satisfaction", value: 94, color: "#99D98C", suffix: "%" },
  { name: "Temps d'intervention", value: 48, color: "#52B69A", suffix: "min" },
  { name: "Efficacité énergétique", value: 87, color: "#168AAD", suffix: "%" },
];

const weeklyStats = [
  { day: "Lun", value: 5, target: 4 },
  { day: "Mar", value: 7, target: 4 },
  { day: "Mer", value: 3, target: 4 },
  { day: "Jeu", value: 6, target: 4 },
  { day: "Ven", value: 8, target: 4 },
  { day: "Sam", value: 4, target: 3 },
  { day: "Dim", value: 0, target: 0 },
];

const recentNotifications = [
  { 
    id: 1, 
    title: "Pièce disponible", 
    message: "Le filtre pour la PAC #2483 est disponible au dépôt", 
    time: "Il y a 25 min", 
    read: false,
    type: "info",
    link: "/pieces/2483"
  },
  { 
    id: 2, 
    title: "Client satisfait", 
    message: "M. Dubois a laissé une évaluation 5 étoiles pour votre intervention", 
    time: "Il y a 2h", 
    read: true,
    type: "success",
    link: "/evaluations/568"
  },
  { 
    id: 3, 
    title: "Maintenance urgente", 
    message: "Intervention prioritaire demandée pour la résidence Les Érables", 
    time: "Il y a 1j", 
    read: false,
    type: "urgent",
    link: "/interventions/345"
  },
];

export default function TechnicianDashboard() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentTip, setCurrentTip] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState("today");
  const [showNotifications, setShowNotifications] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    }
  };

  const chartRef = useRef(null);

  // Update date and time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      } as const;
      
      setCurrentDate(now.toLocaleDateString('fr-FR', options));
      setCurrentTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    
    const welcomeTimer = setTimeout(() => setShowWelcome(false), 5000);
    
    // Rotate eco tips
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % ecoTips.length);
    }, 8000);
    
    return () => {
      clearTimeout(welcomeTimer);
      clearInterval(interval);
      clearInterval(tipInterval);
    };
  }, []);

  // Draw chart when component mounts
  useEffect(() => {
    if (chartRef.current) {
      const canvas = chartRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw chart
        const barWidth = canvas.width / weeklyStats.length - 10;
        const maxValue = Math.max(...weeklyStats.map(item => item.value), ...weeklyStats.map(item => item.target));
        const chartHeight = canvas.height - 30;
        
        // Draw target line
        ctx.beginPath();
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = darkMode ? 'rgba(191, 221, 249, 0.5)' : 'rgba(33, 63, 91, 0.3)';
        ctx.lineWidth = 1;
        
        weeklyStats.forEach((stat, i) => {
          if (stat.target > 0) {
            const x = i * (barWidth + 10) + barWidth / 2;
            const y = canvas.height - (stat.target / maxValue) * chartHeight - 10;
            
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
        });
        
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw bars
        weeklyStats.forEach((stat, i) => {
          const barHeight = (stat.value / maxValue) * chartHeight;
          const x = i * (barWidth + 10);
          const y = canvas.height - barHeight - 10;
          
          // Create gradient
          const gradient = ctx.createLinearGradient(x, y, x, canvas.height - 10);
          gradient.addColorStop(0, darkMode ? 'rgba(210, 252, 178, 0.9)' : 'rgba(33, 63, 91, 0.9)');
          gradient.addColorStop(1, darkMode ? 'rgba(191, 221, 249, 0.9)' : 'rgba(191, 221, 249, 0.9)');
          
          // Draw bar
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
          ctx.fill();
          
          // Draw day label
          ctx.fillStyle = darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(33, 63, 91, 0.8)';
          ctx.font = '10px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(stat.day, x + barWidth / 2, canvas.height - 2);
        });
      }
    }
  }, [darkMode]);

  const getNotificationIcon = (type: 'info' | 'success' | 'urgent' | string) => {
    switch(type) {
      case 'info':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <StarIconSolid className="h-5 w-5 text-yellow-500" />;
      case 'urgent':
        return <BellAlertIcon className="h-5 w-5 text-red-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main
          className={`flex-1 overflow-y-auto px-8 py-6 space-y-6 transition-colors duration-300 ${
            darkMode
              ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
              : "bg-gradient-to-br from-[#f8fbff] via-white to-[#f8fbff]"
          }`}
        >
          {/* Welcome Banner */}
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                className={`mb-6 p-5 rounded-xl shadow-lg ${
                  darkMode
                    ? "bg-gradient-to-r from-[#213f5b] to-[#2d5478] text-white"
                    : "bg-gradient-to-r from-[#213f5b] to-[#2d5478] text-white"
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                      <UserCircleIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Bonjour, {technicianInfo.name}!</h2>
                      <p className="text-[#bfddf9]">
                        {currentDate} • {currentTime} - Prêt pour une journée productive et écologique!
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowWelcome(false)} 
                    className="p-2 hover:bg-black/10 rounded-full transition-colors"
                  >
                    ×
                  </button>
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
              <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-[#213f5b]"}`}>
                Tableau de Bord Technique
              </h1>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Gestion des interventions et maintenance écologique • {currentDate}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex gap-3 items-center"
            >
              {/* Notification button */}
              <div className="relative">
                <button 
                  className={`p-2.5 rounded-xl ${
                    darkMode 
                      ? "bg-gray-800 hover:bg-gray-700" 
                      : "bg-white hover:bg-gray-50"
                  } shadow-sm transition-colors relative`}
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <BellAlertIcon className={`h-5 w-5 ${darkMode ? "text-gray-200" : "text-[#213f5b]"}`} />
                  <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full"></span>
                </button>
                
                {/* Notifications dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      className={`absolute right-0 mt-2 w-80 rounded-xl overflow-hidden z-50 shadow-lg ${
                        darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                      }`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className={`p-3 border-b ${darkMode ? "border-gray-700" : "border-gray-100"} flex justify-between items-center`}>
                        <h3 className="font-medium">Notifications</h3>
                        <button className="text-xs underline">Tout marquer comme lu</button>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {recentNotifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`p-3 ${notification.read ? '' : darkMode ? 'bg-gray-700/50' : 'bg-blue-50/50'} ${
                              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                            } transition-colors cursor-pointer border-b ${
                              darkMode ? "border-gray-700" : "border-gray-100"
                            }`}
                          >
                            <div className="flex gap-3">
                              <div className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-white"} flex-shrink-0`}>
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div>
                                <h4 className="text-sm font-medium flex items-center gap-2">
                                  {notification.title}
                                  {!notification.read && (
                                    <span className={`w-2 h-2 rounded-full ${
                                      notification.type === 'urgent' ? "bg-red-500" : "bg-blue-500"
                                    }`}></span>
                                  )}
                                </h4>
                                <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">{notification.message}</p>
                                <p className="text-xs mt-2 text-gray-400 dark:text-gray-500">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 text-center">
                        <button className={`text-sm ${darkMode ? "text-blue-400" : "text-blue-600"} hover:underline`}>
                          Voir toutes les notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* View selector */}
              <div className={`flex rounded-xl overflow-hidden shadow-sm ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}>
                <button
                  className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                    viewMode === "today"
                      ? darkMode
                        ? "bg-[#213f5b] text-white"
                        : "bg-[#213f5b] text-white"
                      : darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-700 hover:text-[#213f5b]"
                  }`}
                  onClick={() => setViewMode("today")}
                >
                  Aujourd&apos;hui
                </button>
                <button
                  className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                    viewMode === "week"
                      ? darkMode
                        ? "bg-[#213f5b] text-white"
                        : "bg-[#213f5b] text-white"
                      : darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-700 hover:text-[#213f5b]"
                  }`}
                  onClick={() => setViewMode("week")}
                >
                  Semaine
                </button>
              </div>
              
              {/* Dark mode toggle */}
              <button 
                className={`p-2.5 rounded-xl ${
                  darkMode 
                    ? "bg-gray-800 hover:bg-gray-700" 
                    : "bg-white hover:bg-gray-50"
                } shadow-sm transition-colors`}
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5 text-gray-200" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-[#213f5b]" />
                )}
              </button>
            </motion.div>
          </div>

          {/* Technician overview card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-xl p-5 ${
              darkMode
                ? "bg-gradient-to-r from-[#1d3a52] to-[#2a4b65] border border-gray-700"
                : "bg-gradient-to-r from-[#edf6ff] to-[#f0f9f0] border border-[#bfddf9]/30"
            } shadow-sm mb-6`}
          >
            <div className="flex flex-wrap justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`h-16 w-16 rounded-xl ${darkMode ? "bg-gray-700" : "bg-white"} shadow-sm flex items-center justify-center p-1`}>
                  <div className="h-full w-full rounded-lg bg-gradient-to-br from-[#213f5b] to-[#3a6d99] flex items-center justify-center relative">
                    <UserCircleIcon className="h-10 w-10 text-white" />
                    {technicianInfo.certified && (
                      <div className="absolute -bottom-1 -right-1 bg-[#d2fcb2] rounded-full p-0.5 shadow-sm">
                        <CheckCircleIcon className="h-4 w-4 text-[#213f5b]" />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-[#213f5b]"}`}>
                      {technicianInfo.name}
                    </h2>
                    <div className="flex items-center">
                      <StarIconSolid className="h-4 w-4 text-yellow-400" />
                      <span className={`ml-1 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {technicianInfo.rating}
                      </span>
                    </div>
                  </div>
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {technicianInfo.role}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      darkMode ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-800"
                    }`}>
                      <div className="h-1.5 w-1.5 bg-green-500 rounded-full mr-1"></div>
                      {technicianInfo.status}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      darkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-800"
                    }`}>
                      Certifié RGE
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Taux de complétion</p>
                  <div className="flex items-center mt-1 gap-2">
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-[#213f5b] to-[#3a6d99]"
                        style={{ width: `${technicianInfo.completionRate}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-[#213f5b]"}`}>
                      {technicianInfo.completionRate}%
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Efficacité</p>
                  <div className="flex items-center mt-1 gap-2">
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-[#d2fcb2] to-[#99d98c]"
                        style={{ width: `${technicianInfo.efficiency}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-[#213f5b]"}`}>
                      {technicianInfo.efficiency}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <button className={`px-4 py-2 rounded-lg ${
                    darkMode ? "bg-[#213f5b] hover:bg-[#1a324a]" : "bg-[#213f5b] hover:bg-[#1a324a]"
                  } text-white text-sm font-medium transition-colors flex items-center gap-2`}>
                    <ClipboardDocumentCheckIcon className="h-4 w-4" />
                    Rapport quotidien
                  </button>
                  <button className={`px-4 py-2 rounded-lg ${
                    darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-50"
                  } text-sm font-medium transition-colors border ${
                    darkMode ? "border-gray-600" : "border-gray-200"
                  } flex items-center gap-2`}>
                    <PresentationChartLineIcon className="h-4 w-4" />
                    Performance
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-12 gap-6">
            {/* Main Content */}
            <motion.div 
              className="col-span-12 lg:col-span-8 space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Stats Cards */}
              <motion.div
                className="grid grid-cols-1 gap-5 md:grid-cols-3"
                variants={itemVariants}
              >
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.name}
                    className={`p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${
                      darkMode 
                        ? "bg-gray-800 border border-gray-700" 
                        : `bg-gradient-to-br ${stat.color} border border-[#bfddf9]/30`
                    }`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ delay: i * 0.1 }}
                    variants={itemVariants}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <p className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-[#213f5b]"}`}>
                        {stat.name}
                      </p>
                      <div className={`p-2 rounded-full ${
                        darkMode ? "bg-gray-700" : `${stat.iconBg}/60`
                      } ${stat.iconColor}`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-[#213f5b]"}`}>
                        {stat.value}
                      </p>
                      <p className={`text-sm flex items-center gap-1 ${
                        darkMode 
                          ? stat.positive ? "text-green-400" : "text-red-400"
                          : stat.positive ? "text-green-600" : "text-red-600"
                      }`}>
                        {stat.positive ? <ArrowTrendingUpIcon className="h-4 w-4" /> : <ArrowTrendingDownIcon className="h-4 w-4" />}
                        {stat.trend}
                      </p>
                    </div>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"} mt-1`}>
                      {stat.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Weekly Performance Chart */}
              <motion.div
                className={`rounded-xl shadow-sm overflow-hidden ${
                  darkMode 
                    ? "bg-gray-800 border border-gray-700" 
                    : "bg-white border border-[#bfddf9]/20"
                }`}
                variants={itemVariants}
              >
                <div className={`p-5 border-b ${
                  darkMode ? "border-gray-700" : "border-[#bfddf9]/20"
                }`}>
                  <div className="flex justify-between items-center">
                    <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-[#213f5b]"} flex items-center gap-2`}>
                      <ChartBarIcon className="h-5 w-5" />
                      Performance hebdomadaire
                    </h2>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <div className={`h-3 w-3 rounded-full ${darkMode ? "bg-[#d2fcb2]" : "bg-[#213f5b]"}`}></div>
                        <span className="text-xs">Interventions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-0.5 w-5 bg-gray-400 dark:bg-gray-500"></div>
                        <span className="text-xs">Objectif</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="h-60 w-full">
                    <canvas ref={chartRef} height="240" width="600" className="w-full h-full"></canvas>
                  </div>
                </div>
              </motion.div>

              {/* Interventions en Cours */}
              <motion.div
                className={`rounded-xl shadow-sm overflow-hidden ${
                  darkMode 
                    ? "bg-gray-800 border border-gray-700" 
                    : "bg-white border border-[#bfddf9]/20"
                }`}
                variants={itemVariants}
              >
                <div className={`p-5 border-b ${
                  darkMode ? "border-gray-700" : "border-[#bfddf9]/20"
                }`}>
                  <div className="flex justify-between items-center">
                    <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-[#213f5b]"} flex items-center gap-2`}>
                      <WrenchScrewdriverIcon className="h-5 w-5" />
                      Interventions en Cours
                    </h2>
                    <button className={`px-3 py-1.5 ${
                      darkMode 
                        ? "bg-[#213f5b] hover:bg-[#1a324a]" 
                        : "bg-[#213f5b] hover:bg-[#1a324a]"
                    } text-white rounded-lg text-sm hover:shadow-md transition-all flex items-center gap-1`}>
                      <PlusIcon className="h-4 w-4" />
                      <span>Nouvelle</span>
                    </button>
                  </div>
                </div>

                <div className={`divide-y ${
                  darkMode ? "divide-gray-700" : "divide-[#bfddf9]/20"
                }`}>
                  {interventions.map((intervention, i) => (
                    <motion.div
                      key={intervention.id}
                      className={`p-5 ${
                        darkMode 
                          ? "hover:bg-gray-700/50" 
                          : "hover:bg-[#d2fcb2]/5"
                      } transition-colors`}
                      whileHover={{ x: 5 }}
                      variants={itemVariants}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: 0.2 + (i * 0.1) }
                      }}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className={`text-base font-semibold ${
                              darkMode ? "text-white" : "text-[#213f5b]"
                            }`}>
                              {intervention.title}
                            </h3>
                            
                            <span className={`text-sm font-medium ${intervention.priorityColor}`}>
                              {intervention.priority}
                            </span>
                          </div>
                          
                          <div className={`flex items-center gap-2 text-sm ${
                            darkMode ? "text-gray-300" : "text-[#213f5b]/80"
                          }`}>
                            <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{intervention.location} • {intervention.client}</span>
                          </div>
                          
                          <div className={`flex items-center gap-2 text-sm ${
                            darkMode ? "text-gray-300" : "text-[#213f5b]/80"
                          }`}>
                            <ClockIcon className="h-4 w-4 flex-shrink-0" />
                            <span>{intervention.date} • {intervention.time}</span>
                          </div>
                          
                          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            {intervention.description}
                          </p>
                          
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              intervention.statusColor
                            }`}>
                              {intervention.status}
                            </span>
                            
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              darkMode ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-800"
                            }`}>
                              {intervention.eco_impact}
                            </span>
                          </div>
                        </div>
                        
                        <div className="w-full md:w-48 space-y-3 flex-shrink-0">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className={`text-xs ${darkMode ? "text-gray-400" : "text-[#213f5b]/60"}`}>
                                Progression
                              </span>
                              <span className={`text-xs font-medium ${darkMode ? "text-white" : "text-[#213f5b]"}`}>
                                {intervention.progress}%
                              </span>
                            </div>
                            <div className={`h-2 rounded-full ${
                              darkMode ? "bg-gray-700" : "bg-[#bfddf9]/20"
                            }`}>
                              <motion.div
                                className={`h-2 rounded-full ${
                                  intervention.progress > 60 
                                    ? "bg-green-500" 
                                    : intervention.progress > 30
                                    ? "bg-[#213f5b]" 
                                    : "bg-amber-500"
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${intervention.progress}%` }}
                                transition={{ duration: 0.8, delay: 0.3 + (i * 0.1) }}
                              />
                            </div>
                          </div>
                          
                          <div className={`text-xs ${darkMode ? "text-gray-400" : "text-[#213f5b]/60"}`}>
                            <span>Équipement: </span>
                            <span className="font-medium">{intervention.equipment}</span>
                          </div>
                          
                          <button className={`w-full py-1.5 mt-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                            darkMode 
                              ? "bg-gray-700 hover:bg-gray-600 text-white" 
                              : "bg-[#213f5b]/10 hover:bg-[#213f5b]/20 text-[#213f5b]"
                          }`}>
                            <ArrowRightIcon className="h-3 w-3" />
                            <span>Voir détails</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className={`p-4 border-t ${
                  darkMode ? "border-gray-700" : "border-[#bfddf9]/20"
                }`}>
                  <button className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                    darkMode 
                      ? "bg-gray-700 hover:bg-gray-600 text-white" 
                      : "bg-gray-100 hover:bg-gray-200 text-[#213f5b]"
                  }`}>
                    Voir toutes les interventions
                  </button>
                </div>
              </motion.div>

              {/* Équipements Installés */}
              <motion.div
                className={`rounded-xl shadow-sm p-6 ${
                  darkMode 
                    ? "bg-gray-800 border border-gray-700" 
                    : "bg-white border border-[#bfddf9]/20"
                }`}
                variants={itemVariants}
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-[#213f5b]"} flex items-center gap-2`}>
                    <BoltIconSolid className="h-5 w-5 text-blue-500" />
                    État des Équipements
                  </h2>
                  <div className="flex gap-2">
                    <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {equipmentStatus.map((equipment, idx) => (
                    <motion.div 
                      key={idx} 
                      className={`p-5 rounded-xl border ${
                        darkMode
                          ? "border-gray-700 hover:border-gray-600"
                          : "border-[#bfddf9]/30 hover:border-[#d2fcb2]/50"
                      } transition-all hover:shadow-md`}
                      whileHover={{ y: -4 }}
                      variants={itemVariants}
                      custom={idx}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2.5 rounded-lg ${equipment.color}/20`}>
                          <equipment.icon className={`h-6 w-6 ${darkMode ? "text-white" : "text-[#213f5b]"}`} />
                        </div>
                        <div>
                          <h3 className={`font-semibold ${darkMode ? "text-white" : "text-[#213f5b]"}`}>
                            {equipment.name}
                          </h3>
                          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-[#213f5b]/80"}`}>
                            {equipment.count} unités
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mt-4">
                        <div className="flex justify-between items-center">
                          <span className={`text-xs ${darkMode ? "text-gray-400" : "text-[#213f5b]/80"}`}>
                            Efficacité moyenne
                          </span>
                          <span className={`text-xs font-medium ${darkMode ? "text-white" : "text-[#213f5b]"}`}>
                            {equipment.efficiency}%
                          </span>
                        </div>
                        <div className={`h-1.5 rounded-full ${darkMode ? "bg-gray-700" : "bg-[#bfddf9]/20"}`}>
                          <motion.div
                            className={`h-1.5 rounded-full bg-gradient-to-r ${
                              equipment.efficiency > 90 
                                ? "from-green-500 to-green-400" 
                                : equipment.efficiency > 80
                                ? "from-blue-500 to-blue-400" 
                                : "from-amber-500 to-amber-400"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${equipment.efficiency}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                          />
                        </div>
                        
                        <div className="flex justify-between items-center pt-2">
                          <div className={`text-xs ${darkMode ? "text-gray-400" : "text-[#213f5b]/80"}`}>
                            <span>Dernière vérification: </span>
                            <span className={`font-medium ${darkMode ? "text-gray-300" : "text-[#213f5b]"}`}>
                              {equipment.lastCheck}
                            </span>
                          </div>
                          
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            equipment.issues > 0 
                              ? darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800' 
                              : darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
                          }`}>
                            {equipment.issues} {equipment.issues === 1 ? 'incident' : 'incidents'}
                          </span>
                        </div>
                        
                        <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} pt-1`}>
                          Modèles: {equipment.model}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Sidebar */}
            <motion.div 
              className="col-span-12 lg:col-span-4 space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Performance Card */}
              <motion.div
                className={`rounded-xl overflow-hidden shadow-sm ${
                  darkMode 
                    ? "bg-gradient-to-br from-[#1e3951] to-[#2d5478]" 
                    : "bg-gradient-to-br from-[#213f5b] to-[#2d5478]"
                } text-white border ${
                  darkMode ? "border-gray-700" : "border-[#213f5b]/50"
                }`}
                variants={itemVariants}
              >
                <div className="p-5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FireIconSolid className="h-6 w-6 text-amber-400" />
                    <h2 className="text-lg font-bold">Performance globale</h2>
                  </div>
                  <div className="bg-white/10 rounded-full p-1.5">
                    <PresentationChartLineIcon className="h-6 w-6" />
                  </div>
                </div>
                
                <div className="px-5 pb-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    {performanceMetrics.map((metric, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-white/80">{metric.name}</span>
                          <span className="text-sm font-semibold">{metric.value}{metric.suffix}</span>
                        </div>
                        <div className="h-1.5 bg-white/20 rounded-full">
                          <motion.div
                            className="h-1.5 rounded-full"
                            style={{ backgroundColor: metric.color, width: `${(metric.value / 100) * 100}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(metric.value / 100) * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.2 + (idx * 0.1) }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-white/10 rounded-full p-1.5">
                        <StarIconSolid className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-xs text-white/80">Score hebdomadaire</p>
                        <p className="text-lg font-bold">92 points</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1 text-sm">
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-400" />
                      <span className="font-medium">+15%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Actions Rapides */}
              <motion.div
                className={`rounded-xl shadow-sm overflow-hidden ${
                  darkMode 
                    ? "bg-gray-800 border border-gray-700" 
                    : "bg-white border border-[#bfddf9]/20"
                }`}
                variants={itemVariants}
              >
                <div className={`p-5 border-b ${
                  darkMode ? "border-gray-700" : "border-[#bfddf9]/20"
                }`}>
                  <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-[#213f5b]"} flex items-center gap-2`}>
                    <BoltIcon className="h-5 w-5" />
                    Actions Rapides
                  </h2>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quickActions.map((action, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ y: -4 }}
                      className={`p-4 rounded-xl flex flex-col items-center gap-3 transition-all ${
                        darkMode 
                          ? "bg-gray-700 hover:bg-gray-600" 
                          : "bg-gray-50 hover:bg-[#d2fcb2]/20"
                      } hover:shadow-md text-center`}
                      variants={itemVariants}
                      custom={idx}
                    >
                      <div className={`p-3 rounded-full ${action.color}/20`}>
                        <action.icon className={`h-6 w-6 ${darkMode ? "text-white" : "text-[#213f5b]"}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-[#213f5b]"}`}>
                          {action.action}
                        </p>
                        <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {action.description}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Conseils Techniques */}
              <motion.div
                className={`rounded-xl shadow-sm overflow-hidden ${
                  darkMode 
                    ? "bg-gray-800 border border-gray-700" 
                    : "bg-gradient-to-br from-[#d2fcb2]/20 to-[#bfddf9]/20 border border-[#d2fcb2]/30"
                }`}
                variants={itemVariants}
              >
                <div className={`p-5 border-b ${
                  darkMode ? "border-gray-700" : "border-[#d2fcb2]/30"
                } flex items-center gap-3`}>
                  <div className={`p-2 ${darkMode ? "bg-gray-700" : "bg-[#d2fcb2]/30"} rounded-full`}>
                    <LightBulbIcon className={`h-5 w-5 ${darkMode ? "text-yellow-400" : "text-[#213f5b]"}`} />
                  </div>
                  <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-[#213f5b]"}`}>
                    Astuces Écologiques
                  </h2>
                </div>
                <div className="p-5 relative min-h-[180px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTip}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 p-5"
                    >
                      <div className={`text-sm ${darkMode ? "text-gray-300" : "text-[#213f5b]/80"} space-y-6 flex items-center h-full`}>
                        <p className="leading-relaxed">✅ {ecoTips[currentTip]}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  
                  <div className="absolute bottom-4 right-4 flex space-x-1">
                    {ecoTips.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 w-1.5 rounded-full transition-colors ${
                          i === currentTip 
                            ? darkMode ? "bg-blue-400" : "bg-[#213f5b]" 
                            : darkMode ? "bg-gray-600" : "bg-gray-300"
                        }`} 
                      />
                    ))}
                  </div>
                  
                  <button className={`w-full py-2 mt-10 ${
                    darkMode 
                      ? "bg-[#213f5b] hover:bg-[#1a324a]" 
                      : "bg-[#213f5b] hover:bg-[#1a324a]"
                  } text-white rounded-lg text-sm hover:shadow-md transition-all`}>
                    Voir plus de conseils
                  </button>
                </div>
              </motion.div>

              {/* Prochaines Interventions */}
              <motion.div
                className={`rounded-xl shadow-sm ${
                  darkMode 
                    ? "bg-gray-800 border border-gray-700" 
                    : "bg-white border border-[#bfddf9]/20"
                }`}
                variants={itemVariants}
              >
                <div className={`p-5 border-b ${
                  darkMode ? "border-gray-700" : "border-[#bfddf9]/20"
                }`}>
                  <div className="flex items-center justify-between">
                    <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-[#213f5b]"} flex items-center gap-2`}>
                      <CalendarIcon className="h-5 w-5" />
                      Prochaines interventions
                    </h2>
                    <button className={`text-sm ${darkMode ? "text-blue-400" : "text-blue-600"} hover:underline flex items-center gap-1`}>
                      <span>Voir agenda</span>
                      <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                  {interventions.filter(i => i.status !== "En cours").slice(0, 3).map((intervention, i) => (
                    <div key={i} className={`p-4 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"} transition-colors`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-3 rounded-lg ${
                          darkMode 
                            ? "bg-gray-700" 
                            : intervention.status === "Planifiée" 
                              ? "bg-blue-100" 
                              : "bg-amber-100"
                        } flex-shrink-0`}>
                          <CalendarIcon className={`h-5 w-5 ${
                            darkMode 
                              ? "text-white" 
                              : intervention.status === "Planifiée" 
                                ? "text-blue-600" 
                                : "text-amber-600"
                          }`} />
                        </div>
                        <div>
                          <h4 className={`font-medium ${darkMode ? "text-white" : "text-[#213f5b]"}`}>
                            {intervention.title}
                          </h4>
                          <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
                            {intervention.date} • {intervention.time}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              intervention.statusColor
                            }`}>
                              {intervention.status}
                            </span>
                            <span className={`text-xs ${intervention.priorityColor}`}>
                              {intervention.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className={`p-4 ${darkMode ? "border-t border-gray-700" : ""}`}>
                  <button className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                    darkMode 
                      ? "bg-gray-700 hover:bg-gray-600" 
                      : "bg-[#213f5b]/10 hover:bg-[#213f5b]/20 text-[#213f5b]"
                  }`}>
                    Planifier une intervention
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}