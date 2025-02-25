"use client";

import { useState, useEffect, JSX } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, ChevronLeft, ChevronRight, PlusCircle, Filter, Search, Zap, Thermometer, CalendarDays, Activity, Sun, CloudRain, Cloud
} from "lucide-react";

// Brand colors
const BRAND = {
  white: "#ffffff",
  lightBlue: "#bfddf9",
  lightGreen: "#d2fcb2",
  darkBlue: "#213f5b",
  // Extended palette
  paleBlue: "#e9f4fd",
  mediumBlue: "#6fa8dc",
  darkGreen: "#8cc63f",
  accentYellow: "#ffd966",
  accentOrange: "#f9cb9c"
};

// Define an interface for Event
interface EventData {
  id: number;
  date: string;
  time: string;
  title: string;
  client: string;
  contact: string;
  location: string;
  solution: string;
  status: string;
  priority: string;
  notes: string;
  weatherForecast: string;
}

// Sample events data for Sales with expanded details
const events: EventData[] = [
  {
    id: 1,
    date: "2025-04-05",
    time: "10:00 - 11:30",
    title: "Réunion Vente - Pompe à chaleur",
    client: "Entreprise EcoHabitat",
    contact: "Jean Martin",
    location: "14 Rue de la Paix, Paris",
    solution: "Pompes à chaleur",
    status: "confirmed",
    priority: "high",
    notes: "Présentation de notre nouvelle gamme de pompes à chaleur air-eau à haute efficacité énergétique.",
    weatherForecast: "Ensoleillé, 18°C"
  },
  {
    id: 2,
    date: "2025-04-10",
    time: "14:00 - 15:00",
    title: "Suivi Commercial - Chauffe-eau solaire individuel",
    client: "Résidence Les Jardins Verts",
    contact: "Sophie Dupont",
    location: "25 Avenue des Fleurs, Lyon",
    solution: "Chauffe-eau solaire individuel",
    status: "scheduled",
    priority: "medium",
    notes: "Suivi après installation initiale. Discuter des performances et de la satisfaction client.",
    weatherForecast: "Partiellement nuageux, 16°C"
  },
  {
    id: 3,
    date: "2025-04-15",
    time: "09:30 - 11:00",
    title: "Présentation Produit - Chauffe-eau thermodynamique",
    client: "Complexe Résidentiel Méditerranée",
    contact: "Alexandre Blanc",
    location: "5 Boulevard du Littoral, Marseille",
    solution: "Chauffe-eau thermodynamique",
    status: "pending",
    priority: "medium",
    notes: "Démonstration du nouveau modèle Eco-Therm Plus pour un projet de rénovation énergétique.",
    weatherForecast: "Ensoleillé, 22°C"
  },
  {
    id: 4,
    date: "2025-04-05",
    time: "15:30 - 16:30",
    title: "Consultation Technique - Pompe à chaleur",
    client: "Hôtel Belvédère",
    contact: "Pierre Dubois",
    location: "8 Rue des Vignes, Bordeaux",
    solution: "Pompes à chaleur",
    status: "confirmed",
    priority: "medium",
    notes: "Évaluation technique pour remplacement du système de chauffage existant.",
    weatherForecast: "Ensoleillé, 19°C"
  },
  {
    id: 5,
    date: "2025-04-20",
    time: "13:00 - 14:30",
    title: "Discussion Stratégique - Système Solaire Combiné",
    client: "Éco-Quartier Saint-Michel",
    contact: "Marie Laurent",
    location: "30 Rue des Écologistes, Bordeaux",
    solution: "Système Solaire Combiné",
    status: "confirmed",
    priority: "high",
    notes: "Projet d'implantation pour l'ensemble du quartier résidentiel. Opportunité de vente importante.",
    weatherForecast: "Nuageux, 15°C"
  },
  {
    id: 6,
    date: "2025-04-25",
    time: "11:00 - 12:00",
    title: "Suivi de Projet - Chauffe-eau thermodynamique",
    client: "Centre Sportif Atlantique",
    contact: "Thomas Moreau",
    location: "40 Avenue des Sports, Nantes",
    solution: "Chauffe-eau thermodynamique",
    status: "scheduled",
    priority: "low",
    notes: "Vérification de l'installation récente et formation du personnel technique.",
    weatherForecast: "Pluvieux, 14°C"
  },
  {
    id: 7,
    date: "2025-04-28",
    time: "09:00 - 10:30",
    title: "Audit Énergétique - Système Hybride",
    client: "Campus Universitaire Vert",
    contact: "Christine Leroy",
    location: "1 Place de l'Université, Toulouse",
    solution: "Système Hybride",
    status: "confirmed",
    priority: "medium",
    notes: "Évaluation complète des besoins énergétiques et proposition de solutions optimisées.",
    weatherForecast: "Ensoleillé, 20°C"
  },
  {
    id: 8,
    date: "2025-04-12",
    time: "16:00 - 17:30",
    title: "Briefing Technique - Pompe à chaleur",
    client: "Société ThermoPlus",
    contact: "Lucie Bernard",
    location: "22 Rue du Commerce, Lille",
    solution: "Pompes à chaleur",
    status: "pending",
    priority: "low",
    notes: "Présentation des spécifications techniques avant la phase d'installation.",
    weatherForecast: "Partiellement nuageux, 17°C"
  },
  {
    id: 9,
    date: "2025-04-18",
    time: "10:30 - 12:00",
    title: "Réunion de Coordination - Système Solaire Combiné",
    client: "Collectif Énergie Verte",
    contact: "Olivier Marchand",
    location: "10 Avenue de la Liberté, Strasbourg",
    solution: "Système Solaire Combiné",
    status: "scheduled",
    priority: "medium",
    notes: "Coordination entre les équipes d'installation et de maintenance pour le déploiement régional.",
    weatherForecast: "Nuageux, 16°C"
  },
  {
    id: 10,
    date: "2025-04-22",
    time: "14:00 - 15:30",
    title: "Formation Client - Chauffe-eau solaire individuel",
    client: "Résidence Soleil Levant",
    contact: "Isabelle Morel",
    location: "5 Rue de la République, Montpellier",
    solution: "Chauffe-eau solaire individuel",
    status: "confirmed",
    priority: "high",
    notes: "Session de formation sur l'utilisation et l'entretien des chauffe-eau solaires.",
    weatherForecast: "Ensoleillé, 21°C"
  }
];


// Performance metrics for dashboard
const performanceMetrics = {
  monthlyTotals: {
    meetings: 14,
    newProspects: 8,
    proposals: 6,
    closedDeals: 3
  },
  targetProgress: 67, // percent
  conversionRate: 45, // percent
  revenueTarget: {
    current: 34500,
    goal: 50000
  }
};

// Define an interface for solution details
interface SolutionDetail {
  color: string;
  icon: JSX.Element;
  efficiency: string;
  savings: string;
}

// Solution type to color mapping with icons
const solutionDetails: Record<string, SolutionDetail> = {
  "Pompes à chaleur": {
    color: BRAND.lightBlue,
    icon: <Thermometer size={16} />,
    efficiency: "COP 4.5-5.2",
    savings: "60-70%"
  },
  "Chauffe-eau solaire individuel": {
    color: BRAND.accentYellow,
    icon: <Sun size={16} />,
    efficiency: "Rendement 85%",
    savings: "50-60%"
  },
  "Chauffe-eau thermodynamique": {
    color: BRAND.lightGreen,
    icon: <Zap size={16} />,
    efficiency: "COP 3.5-4.0",
    savings: "40-50%"
  },
  "Système Solaire Combiné": {
    color: BRAND.accentOrange,
    icon: <Sun size={16} />,
    efficiency: "Rendement 90%",
    savings: "70-80%"
  },
  "Système Hybride": {
    color: BRAND.mediumBlue,
    icon: <Activity size={16} />,
    efficiency: "Variable",
    savings: "50-75%"
  }
};

// Helper function to generate calendar days for a given month and year.
function getCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1).getDay(); // Sunday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays: (Date | null)[] = [];

  // Adjust for Monday as first day of week
  const startDay = firstDay === 0 ? 6 : firstDay - 1;

  // Fill in blank cells before the first day of the month.
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  // Add all days of the month.
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }
  // Pad the grid to complete the final week.
  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }
  return calendarDays;
}

// Priority to color/style mapping
const priorityStyles: Record<string, { badge: string; icon: string }> = {
  high: {
    badge: "bg-red-100 text-red-700 ring-1 ring-red-600/20",
    icon: "text-red-500"
  },
  medium: {
    badge: "bg-amber-100 text-amber-700 ring-1 ring-amber-600/20",
    icon: "text-amber-500"
  },
  low: {
    badge: "bg-green-100 text-green-700 ring-1 ring-green-600/20",
    icon: "text-green-500"
  }
};

// Status to style mapping
const statusStyles: Record<string, { badge: string; text: string }> = {
  confirmed: {
    badge: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/10",
    text: "Confirmé"
  },
  scheduled: {
    badge: "bg-blue-100 text-blue-700 ring-1 ring-blue-600/10",
    text: "Programmé"
  },
  pending: {
    badge: "bg-amber-100 text-amber-700 ring-1 ring-amber-600/10",
    text: "En attente"
  },
  canceled: {
    badge: "bg-gray-100 text-gray-700 ring-1 ring-gray-600/10",
    text: "Annulé"
  }
};

// Weather icon mapping
const weatherIcons: Record<string, JSX.Element> = {
  "Ensoleillé": <Sun className="text-yellow-500" size={16} />,
  "Partiellement nuageux": <CloudRain className="text-gray-500" size={16} />,
  "Nuageux": <Cloud className="text-gray-400" size={16} />,
  "Pluvieux": <CloudRain className="text-blue-400" size={16} />
};

export default function SalesCalendarDashboard() {
  const today = new Date();
  // Type the state for events properly
  const [selectedEvents, setSelectedEvents] = useState<EventData[]>([]);
  const [ , setSelectedEvent] = useState<EventData | null>(null);

  // Other state hooks with proper types:
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [viewMode, setViewMode] = useState<"calendar" | "agenda" | "stats">("calendar");
  const [ , setIsAddingEvent] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // Define type for filters
  interface Filters {
    solutions: string[];
    priorities: string[];
    statuses: string[];
  }
  const [filters, setFilters] = useState<Filters>({
    solutions: Object.keys(solutionDetails),
    priorities: ["high", "medium", "low"],
    statuses: ["confirmed", "scheduled", "pending"]
  });

  // Generate calendar days for the current month.
  const calendarDays = getCalendarDays(currentYear, currentMonth);

  // Filter events for the current month.
  // const eventsThisMonth = events.filter((event) => {
  //   const eventDate = new Date(event.date);
  //   return (
  //     eventDate.getFullYear() === currentYear &&
  //     eventDate.getMonth() === currentMonth
  //   );
  // });

  // Apply filters to events
  const filteredEvents = events.filter(event =>
    filters.solutions.includes(event.solution) &&
    filters.priorities.includes(event.priority) &&
    filters.statuses.includes(event.status)
  );

  // Update selected events when date changes
  useEffect(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const filtered = filteredEvents.filter(event => event.date === dateStr);
    setSelectedEvents(filtered);
    setSelectedEvent(null); // Clear selected event when date changes
  }, [selectedDate, filteredEvents]);

  // Handlers to navigate between months
  const goToPreviousMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear = currentYear - 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const goToNextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear = currentYear + 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  // Handler for filter changes. We specify type of filter key and value.
  const toggleFilter = (type: keyof Filters, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[type].includes(value)) {
        newFilters[type] = newFilters[type].filter((item: string) => item !== value);
      } else {
        newFilters[type] = [...newFilters[type], value];
      }
      return newFilters;
    });
  };

  // Format date for display
  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  // Get weather icon
  const getWeatherIcon = (forecast: string): JSX.Element | null => {
    if (!forecast) return null;
    const weatherType = forecast.split(',')[0];
    return weatherIcons[weatherType] || <CloudRain size={16} />;
  };

  // Calculate percentage of day passed
  const getDayProgress = (date: Date): number | null => {
    if (date.toDateString() !== today.toDateString()) return null;
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const totalMs = endOfDay.getTime() - startOfDay.getTime();
    const elapsedMs = now.getTime() - startOfDay.getTime();
    return Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));
  };

  return (
    <div className="flex h-screen bg-[#ffffff]">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Common Header */}
        <Header />

        <main 
          className="flex-1 overflow-y-auto"
          style={{
            background:
              "linear-gradient(135deg, rgba(191,221,249,0.15), rgba(210,252,178,0.1))",
          }}
        >
          {/* Hero Section */}
          <div className="w-full py-10" style={{ backgroundColor: "rgba(33,63,91,0.95)" }}>
            <motion.div
              className="max-w-7xl mx-auto px-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-white">Agenda</h1>
              <p className="mt-4 text-lg text-[#d2fcb2]">
                Découvrez dans votre agenda tous vos rendez-vous clés et opportunités stratégiques pour piloter avec succès vos projets énergétiques.
              </p>
            </motion.div>
          </div>
          
          <div className="max-w-7xl mx-auto px-8 py-8">
            {/* Top Navigation Bar */}
            <motion.div
              className="flex justify-between items-center mb-6 p-3 rounded-xl bg-white shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center space-x-6">
                <div className="flex space-x-2">
                  <button 
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${viewMode === 'calendar' ? 'bg-white shadow-md' : 'hover:bg-gray-100'}`}
                    onClick={() => setViewMode('calendar')}
                    style={viewMode === 'calendar' ? { color: BRAND.darkBlue, borderLeft: `3px solid ${BRAND.darkBlue}` } : {}}
                  >
                    <Calendar size={16} className="inline mr-1" /> Calendrier
                  </button>
                  <button 
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${viewMode === 'agenda' ? 'bg-white shadow-md' : 'hover:bg-gray-100'}`}
                    onClick={() => setViewMode('agenda')}
                    style={viewMode === 'agenda' ? { color: BRAND.darkBlue, borderLeft: `3px solid ${BRAND.darkBlue}` } : {}}
                  >
                    <CalendarDays size={16} className="inline mr-1" /> Liste
                  </button>
                  <button 
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${viewMode === 'stats' ? 'bg-white shadow-md' : 'hover:bg-gray-100'}`}
                    onClick={() => setViewMode('stats')}
                    style={viewMode === 'stats' ? { color: BRAND.darkBlue, borderLeft: `3px solid ${BRAND.darkBlue}` } : {}}
                  >
                    <Activity size={16} className="inline mr-1" /> Statistiques
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="relative rounded-lg overflow-hidden bg-gray-100">
                  <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    className="px-3 py-2 pr-8 text-sm w-40 md:w-64 outline-none bg-gray-100 placeholder-gray-500"
                  />
                  <Search size={16} className="absolute right-2 top-2.5 text-gray-400" />
                </div>
                
                <button 
                  className="p-2 rounded-lg bg-white hover:bg-gray-100 transition"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter size={18} style={{ color: BRAND.darkBlue }} />
                </button>
                
                <button 
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-white shadow-md transition hover:shadow-lg flex items-center"
                  style={{ backgroundColor: BRAND.darkBlue }}
                  onClick={() => setIsAddingEvent(true)}
                >
                  <PlusCircle size={16} className="mr-1" /> Nouveau
                </button>
              </div>
            </motion.div>

            {/* Filters Panel (Conditional) */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  className="mb-6 p-4 rounded-xl shadow-lg bg-white"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium" style={{ color: BRAND.darkBlue }}>Filtrer les rendez-vous</h3>
                    <button
                      className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition"
                      onClick={() => setFilters({
                        solutions: Object.keys(solutionDetails),
                        priorities: ["high", "medium", "low"],
                        statuses: ["confirmed", "scheduled", "pending"]
                      })}
                    >
                      Réinitialiser
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-gray-500">Solutions</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(solutionDetails).map((solution) => (
                          <button
                            key={solution}
                            className={`text-xs px-2 py-1 rounded-full flex items-center transition ${
                              filters.solutions.includes(solution) 
                                ? 'opacity-100 ring-1' 
                                : 'opacity-50 hover:opacity-80'
                            }`}
                            style={{ 
                              backgroundColor: solutionDetails[solution].color + '40',
                              color: BRAND.darkBlue,
                            }}
                            onClick={() => toggleFilter('solutions', solution)}
                          >
                            <span className="mr-1">{solutionDetails[solution].icon}</span>
                            {solution.split(' ').slice(0, 2).join(' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-gray-500">Priorité</h4>
                      <div className="flex gap-2">
                        {["high", "medium", "low"].map((priority) => (
                          <button
                            key={priority}
                            className={`text-xs px-2 py-1 rounded-full transition ${
                              filters.priorities.includes(priority) 
                                ? priorityStyles[priority].badge 
                                : 'bg-gray-100 text-gray-500 opacity-50 hover:opacity-80'
                            }`}
                            onClick={() => toggleFilter('priorities', priority)}
                          >
                            {priority === "high" ? "Haute" : priority === "medium" ? "Moyenne" : "Basse"}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-gray-500">Statut</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(statusStyles).map((status) => (
                          <button
                            key={status}
                            className={`text-xs px-2 py-1 rounded-full transition ${
                              filters.statuses.includes(status) 
                                ? statusStyles[status].badge 
                                : 'bg-gray-100 text-gray-500 opacity-50 hover:opacity-80'
                            }`}
                            onClick={() => toggleFilter('statuses', status)}
                          >
                            {statusStyles[status].text}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Calendar View */}
            {viewMode === 'calendar' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel: Month Navigation & Calendar */}
                <motion.div
                  className="lg:col-span-2 rounded-xl shadow-lg overflow-hidden bg-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Calendar Navigation */}
                  <div 
                    className="flex justify-between items-center p-4"
                    style={{ backgroundColor: BRAND.darkBlue }}
                  >
                    <button
                      onClick={goToPreviousMonth}
                      className="p-2 rounded-full text-white hover:bg-white/20 transition"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className="text-xl font-bold text-white flex items-center">
                      <Calendar size={18} className="mr-2" />
                      {new Date(currentYear, currentMonth).toLocaleString("fr-FR", {
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <button
                      onClick={goToNextMonth}
                      className="p-2 rounded-full text-white hover:bg-white/20 transition"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  {/* Day Headers */}
                  <div className="grid grid-cols-7 border-b border-gray-200">
                    {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
                      <div key={day} className="text-center py-3 font-medium text-sm text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7">
                    {calendarDays.map((date, index) => {
                      if (!date) {
                        return (
                          <div
                            key={`empty-${index}`}
                            className="h-24 md:h-32 bg-gray-50/30"
                          ></div>
                        );
                      }

                      // Check if this is today
                      const isToday =
                        date.getDate() === today.getDate() &&
                        currentMonth === today.getMonth() &&
                        currentYear === today.getFullYear();
                      
                      // Check if this date is selected
                      const isSelected =
                        date.getDate() === selectedDate.getDate() &&
                        currentMonth === selectedDate.getMonth() &&
                        currentYear === selectedDate.getFullYear();

                      // Day progress indicator for today
                      const dayProgress = getDayProgress(date);

                      // Filter events for this specific day
                      const dayEvents = filteredEvents.filter(
                        (event) => {
                          const eventDate = new Date(event.date);
                          return eventDate.getDate() === date.getDate() &&
                                 eventDate.getMonth() === currentMonth &&
                                 eventDate.getFullYear() === currentYear;
                        }
                      );

                      return (
                        <div
                          key={`day-${index}`}
                          className={`h-24 md:h-32 border border-gray-100 p-1 relative cursor-pointer transition group ${isToday ? "bg-blue-40" : ""} ${isSelected ? 'ring-2 ring-offset-2' : ''}`}
                          onClick={() => setSelectedDate(date)}
                        >
                          {/* Day number with indicator for today */}
                          <div className="flex justify-between items-start">
                            <div className={`text-sm font-medium z-10 ${isToday ? 'bg-white text-center p-1 rounded-full w-6 h-6 shadow-sm' : ''}`}>
                              {date.getDate()}
                            </div>
                            
                            {dayEvents.length > 0 && (
                              <span 
                                className="px-1.5 py-0.5 text-xs rounded-full bg-gray-100"
                                style={{ color: BRAND.darkBlue }}
                              >
                                {dayEvents.length}
                              </span>
                            )}
                          </div>
                          
                          {/* Day progress bar for today */}
                          {isToday && dayProgress !== null && (
                            <div className="h-0.5 w-full bg-gray-200 mt-1 rounded-full overflow-hidden">
                              <div 
                                className="h-full transition-all duration-1000 ease-out rounded-full"
                                style={{ width: `${dayProgress}%`, backgroundColor: BRAND.darkGreen }}
                              ></div>
                            </div>
                          )}

                          {/* Events for this day */}
                          <div className="mt-1 space-y-1 max-h-[calc(100%-28px)] overflow-hidden">
                            {dayEvents.slice(0, 3).map((event, i) => (
                              <div
                                key={`event-${i}`}
                                className="text-xs px-1.5 py-1 truncate rounded flex items-center gap-1 transition hover:bg-white hover:shadow-sm"
                                style={{ 
                                  backgroundColor: solutionDetails[event.solution].color + '20',
                                  color: BRAND.darkBlue,
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEvent(event);
                                }}
                              >
                                {/* Priority dot */}
                                <span className={`w-2 h-2 rounded-full ${priorityStyles[event.priority].icon}`}></span>
                                <span className="truncate">{event.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Right Panel: Selected Date Details */}
                <motion.div
                  className="rounded-xl shadow-lg p-4 bg-white"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-xl font-bold mb-3" style={{ color: BRAND.darkBlue }}>
                    {formatDate(selectedDate)}
                  </h2>
                  {selectedEvents.length === 0 ? (
                    <p className="text-sm text-gray-500">Aucun événement pour cette date.</p>
                  ) : (
                    <ul className="space-y-3">
                      {selectedEvents.map(event => (
                        <li key={event.id} className="p-3 border rounded-lg" style={{ borderLeft: `4px solid ${solutionDetails[event.solution].color}` }}>
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          <p className="text-sm text-gray-600">{event.time}</p>
                          <p className="text-sm">{event.client} - {event.contact}</p>
                          <p className="text-sm text-gray-500">{event.location}</p>
                          <p className="text-xs text-gray-400 mt-1">{event.notes}</p>
                          <div className="mt-1 flex items-center gap-1">
                            {getWeatherIcon(event.weatherForecast)}
                            <span className="text-xs text-gray-500">{event.weatherForecast}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </div>
            )}

            {/* Agenda View */}
            {viewMode === 'agenda' && (
              <div className="rounded-xl shadow-lg p-4 bg-white">
                <h2 className="text-xl font-bold mb-4" style={{ color: BRAND.darkBlue }}>Agenda</h2>
                {filteredEvents.length === 0 ? (
                  <p className="text-gray-500">Aucun événement trouvé pour ces filtres.</p>
                ) : (
                  <ul className="space-y-4">
                    {filteredEvents.map(event => (
                      <li key={event.id} className="p-4 border rounded-lg" style={{ borderLeft: `4px solid ${solutionDetails[event.solution].color}` }}>
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[event.status].badge}`}>
                            {statusStyles[event.status].text}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{formatDate(event.date)} - {event.time}</p>
                        <p className="text-sm">{event.client} - {event.contact}</p>
                        <p className="text-sm text-gray-500">{event.location}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Statistics View */}
            {viewMode === 'stats' && (
              <div className="rounded-xl shadow-lg p-4 bg-white">
                <h2 className="text-xl font-bold mb-4" style={{ color: BRAND.darkBlue }}>Statistiques</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold">Rendez-vous ce mois</h3>
                    <p className="text-2xl font-bold">{performanceMetrics.monthlyTotals.meetings}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold">Nouveaux prospects</h3>
                    <p className="text-2xl font-bold">{performanceMetrics.monthlyTotals.newProspects}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold">Propositions</h3>
                    <p className="text-2xl font-bold">{performanceMetrics.monthlyTotals.proposals}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold">Ventes conclues</h3>
                    <p className="text-2xl font-bold">{performanceMetrics.monthlyTotals.closedDeals}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Progression de l&apos;objectif</h3>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="h-4 rounded-full" style={{ width: `${performanceMetrics.targetProgress}%`, backgroundColor: BRAND.darkGreen }}></div>
                  </div>
                  <p className="text-sm mt-1">{performanceMetrics.targetProgress}% atteint</p>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Revenu</h3>
                  <p className="text-sm">
                    Actuel: €{performanceMetrics.revenueTarget.current} / Objectif: €{performanceMetrics.revenueTarget.goal}
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
