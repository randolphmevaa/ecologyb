"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Import icons from Heroicons (adjust paths if needed)
import {
  ClipboardIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  CalendarIcon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  PlusIcon,
  EllipsisHorizontalIcon,
  SunIcon,
  ChartBarIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

// Define a type for custom CSS properties if needed
type CustomCSSProperties = React.CSSProperties;

// Define the different calendar view modes (react-big-calendar uses lowercase strings)
enum Views {
  MONTH = "month",
  WEEK = "week",
  DAY = "day",
  AGENDA = "agenda",
}

interface ConversationMessage {
  sender: string;
  timestamp: number;
  content: string;
}

interface EventDetails {
  _id?: string;
  id?: string | number;
  title?: string;
  type?: string;
  start?: Date;
  end?: Date;
  ticket?: string;
  status?: "pending" | "scheduled" | "completed" | "open" | string;
  location?: string;
  customerFirstName?: string;
  customerLastName?: string;
  technicianFirstName?: string;
  technicianLastName?: string;
  technicianId?: string; 
  contactId?: string;
  address?: string;
  notes?: string;
  problem?: string;
  priority?: string;
  participants?: string;
  conversation?: ConversationMessage[];
  createdAt?: string;
}

export default function CalendarPage() {
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<Views>(Views.MONTH);
  const [activeViewTab, setActiveViewTab] = useState<string>("Mois");
  const [ , setShowNewEventModal] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<EventDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Setup localizer for react-big-calendar using moment
  const localizer = momentLocalizer(moment);

  // Function to fetch ticket data from API
  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/tickets');
        
        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des tickets: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform API data to calendar event format
        // Make sure each event has start and end as Date objects
        const formattedEvents = data.map((ticket: EventDetails) => ({
          ...ticket,
          start: ticket.start ? new Date(ticket.start) : undefined,
          end: ticket.end ? new Date(ticket.end) : undefined,
          id: ticket._id || ticket.id, // Handle different ID formats
        }));
        
        setCalendarEvents(formattedEvents);
      } catch (err) {
        console.error("Erreur lors du chargement des tickets:", err);
        setError(err instanceof Error ? err.message : "Une erreur est survenue lors du chargement des tickets");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Helper function to check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Helper function to determine event color based on status or type
  const getEventColor = (event: EventDetails) => {
    // Prioritize status for color coding
    if (event.status) {
      switch (event.status.toLowerCase()) {
        case 'open':
          return { bg: "#3b82f6", border: "#2563eb", text: "white" }; // Blue
        case 'pending':
          return { bg: "#f59e0b", border: "#d97706", text: "white" }; // Amber/Yellow
        case 'completed':
          return { bg: "#10b981", border: "#059669", text: "white" }; // Green
        case 'scheduled':
          return { bg: "#8b5cf6", border: "#7c3aed", text: "white" }; // Purple
        default:
          break;
      }
    }

    // Fallback to type-based coloring
    if (event.type) {
      switch (event.type.toLowerCase()) {
        case 'réunion':
        case 'reunion':
          return { bg: "#1a365d", border: "#0f2942", text: "white" }; // Dark blue
        case 'maintenance':
          return { bg: "#10b981", border: "#059669", text: "white" }; // Green
        case 'urgence':
          return { bg: "#ef4444", border: "#dc2626", text: "white" }; // Red
        case 'installation':
          return { bg: "#8b5cf6", border: "#7c3aed", text: "white" }; // Purple
        default:
          return { bg: "#c5f7a5", border: "#b3e19f", text: "#1a365d" }; // Light green
      }
    }

    // Default color
    return { bg: "#c5f7a5", border: "#b3e19f", text: "#1a365d" }; // Light green
  };

  // Calendar navigation handlers
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (currentView === Views.MONTH) {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (currentView === Views.WEEK) {
      newDate.setDate(newDate.getDate() - 7);
    } else if (currentView === Views.DAY || currentView === Views.AGENDA) {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (currentView === Views.MONTH) {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (currentView === Views.WEEK) {
      newDate.setDate(newDate.getDate() + 7);
    } else if (currentView === Views.DAY || currentView === Views.AGENDA) {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  // View tab change handler
  const viewTabs = ["Jour", "Semaine", "Mois", "Listing"];
  const handleViewChange = (view: string) => {
    setActiveViewTab(view);
    if (view === "Mois") {
      setCurrentView(Views.MONTH);
    } else if (view === "Semaine") {
      setCurrentView(Views.WEEK);
    } else if (view === "Jour") {
      setCurrentView(Views.DAY);
    } else if (view === "Listing") {
      setCurrentView(Views.AGENDA);
    }
  };

  // Close the event details popup
  const handleClosePopup = () => {
    setEventDetails(null);
  };

  // Filter events by search term
  const filteredEvents = calendarEvents.filter(event => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (event.title?.toLowerCase().includes(searchLower) || 
      event.problem?.toLowerCase().includes(searchLower) ||
      event.customerFirstName?.toLowerCase().includes(searchLower) ||
      event.customerLastName?.toLowerCase().includes(searchLower) ||
      event.location?.toLowerCase().includes(searchLower) ||
      event.ticket?.toLowerCase().includes(searchLower) ||
      event.status?.toLowerCase().includes(searchLower) ||
      (event.technicianFirstName + " " + event.technicianLastName)?.toLowerCase().includes(searchLower))
    );
  });

  // Function to refresh ticket data
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/tickets');
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des tickets: ${response.status}`);
      }
      
      const data = await response.json();
      
      const formattedEvents = data.map((ticket: EventDetails) => ({
        ...ticket,
        start: ticket.start ? new Date(ticket.start) : undefined,
        end: ticket.end ? new Date(ticket.end) : undefined,
        id: ticket._id || ticket.id,
      }));
      
      setCalendarEvents(formattedEvents);
    } catch (err) {
      console.error("Erreur lors du chargement des tickets:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors du chargement des tickets");
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  // Render loading state with skeleton UI
  if (isLoading && calendarEvents.length === 0) {
    return (
      <div className="flex h-screen bg-white">
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          <main
            className="flex-1 overflow-y-auto px-8 py-6 space-y-6"
            style={{
              background: "linear-gradient(135deg, rgba(191,221,249,0.1) 0%, rgba(210,252,178,0.05) 100%)",
            }}
          >
            <div className="bg-gradient-to-r from-[#1a365d] to-[#0f2942] p-7 text-white rounded-t-2xl shadow-lg">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-white/15 rounded-2xl backdrop-blur-md flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-green-300 animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <div className="h-7 w-48 bg-white/20 rounded-md mb-2 animate-pulse"></div>
                  <div className="h-5 w-72 bg-white/10 rounded-md animate-pulse"></div>
                </div>
              </div>
              
              <div className="mt-10 flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="w-36 h-10 bg-white/15 rounded-xl animate-pulse"></div>
                  <div className="w-24 h-10 bg-white/15 rounded-xl animate-pulse"></div>
                </div>
                <div className="w-48 h-8 bg-white/15 rounded-lg animate-pulse"></div>
              </div>
              
              <div className="mt-6 pt-4 bg-white border-b border-gray-100">
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-24 h-10 bg-gray-100 rounded-t-xl animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-6 bg-white rounded-b-2xl shadow-md">
              <div className="flex flex-col items-center justify-center h-80">
                <motion.div 
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-green-400"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                    rotate: 360 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "linear" 
                  }}
                />
                <h3 className="mt-6 text-xl font-medium text-gray-900">Chargement des rendez-vous</h3>
                <p className="mt-2 text-gray-500 max-w-md text-center">
                  Nous récupérons vos rendez-vous et préparons votre calendrier. Cela ne prendra qu&apos;un instant...
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main
          className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 space-y-6"
          style={{
            background: "linear-gradient(135deg, rgba(191,221,249,0.1) 0%, rgba(210,252,178,0.05) 100%)",
          }}
        >
          {/* Main container with Calendar Navigation and Calendar */}
          <div className="flex flex-col">
            {/* Navigation Header */}
            <div className="bg-gradient-to-r from-[#1a365d] to-[#0f2942] p-5 sm:p-7 text-white rounded-t-xl shadow-md">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-5">
                  <div className="p-3 sm:p-4 bg-white/15 rounded-2xl backdrop-blur-md flex items-center justify-center shadow-inner">
                    <CalendarIcon className="h-6 sm:h-8 w-6 sm:w-8 text-[#e2ffc2]" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                      Calendrier
                    </h2>
                    <p className="text-white/90 font-medium mt-1 text-sm sm:text-base">
                      Planifiez, gérez et organisez vos rendez-vous
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <StarIcon className="h-4 w-4 text-white/60" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Rechercher un événement..."
                      className="w-full text-sm border-none bg-white/15 hover:bg-white/20 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-white placeholder-white/60"
                    />
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <span className="text-white/60 text-xs bg-white/20 rounded-full h-5 w-5 flex items-center justify-center">
                          ×
                        </span>
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setShowNewEventModal(true)}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#e2ffc2] to-[#c5f7a5] hover:opacity-90 text-[#1a365d] rounded-xl text-sm font-semibold transition-colors shadow-md hover:shadow-lg"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Nouvel événement</span>
                    <span className="sm:hidden">Nouveau</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    onClick={handleToday}
                    className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-xs sm:text-sm font-medium backdrop-blur-md flex items-center gap-2 shadow-sm hover:shadow"
                  >
                    <CalendarDaysIcon className="h-3 sm:h-4 w-3 sm:w-4" />
                    Aujourd&apos;hui
                  </button>
                  <div className="flex gap-1.5">
                    <button
                      onClick={handlePrev}
                      className="p-2 sm:p-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors shadow-sm hover:shadow"
                    >
                      <ChevronLeftIcon className="h-4 sm:h-5 w-4 sm:w-5" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-2 sm:p-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors shadow-sm hover:shadow"
                    >
                      <ChevronRightIcon className="h-4 sm:h-5 w-4 sm:w-5" />
                    </button>
                  </div>
                  <button
                    onClick={handleRefreshData}
                    className={`p-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors backdrop-blur-sm ${isRefreshing ? 'animate-spin' : ''} relative overflow-hidden group`}
                    disabled={isRefreshing}
                  >
                    <ArrowPathIcon className="h-5 w-5 relative z-10" />
                    {isRefreshing && (
                      <span className="absolute inset-0 bg-blue-500/20 animate-pulse"></span>
                    )}
                    <span className="absolute bottom-0 left-0 w-full h-0 bg-white/30 group-hover:h-full transition-all duration-300 -z-0"></span>
                    <span className="hidden group-hover:block absolute -top-7 left-1/2 -translate-x-1/2 text-xs bg-black/80 text-white px-2 py-1 rounded whitespace-nowrap">
                      Actualiser les données
                    </span>
                  </button>
                </div>
                <h3 className="text-xl font-semibold text-white whitespace-nowrap">
                  {currentDate.toLocaleString("fr-FR", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
              </div>
              {/* View Tabs */}
              <div className="px-4 sm:px-7 pt-4 bg-white border-b border-gray-100 overflow-x-auto rounded-t-md">
                <div className="flex gap-1 sm:gap-2 min-w-max">
                  {viewTabs.map((view, index) => {
                    const isActive = activeViewTab === view;
                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleViewChange(view)}
                        className={`px-2 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-t-xl transition-all ${
                          isActive
                            ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600 shadow-sm"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {view}
                        {isActive && (
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                            layoutId="activetab"
                          />
                        )}
                      </motion.button>
                    );
                  })}
                  <div className="ml-auto flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
                      <SunIcon className="h-4 sm:h-5 w-4 sm:w-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
                      <ChartBarIcon className="h-4 sm:h-5 w-4 sm:w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Error state */}
            {error && (
              <motion.div 
                className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-4 my-4 rounded-r-lg shadow-md"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  <ExclamationCircleIcon className="h-6 w-6 text-red-500 mr-2" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
                <p className="text-red-600/70 text-sm mt-1 mb-2 pl-8">Une erreur est survenue lors du chargement des données.</p>
                <button 
                  onClick={handleRefreshData}
                  className="ml-8 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-sm flex items-center gap-2 font-medium shadow-sm hover:shadow transition-all"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  Réessayer
                </button>
              </motion.div>
            )}
            
            {/* Empty state when no events match the search */}
            {filteredEvents.length === 0 && !isLoading && !error && (
              <motion.div 
                className="bg-blue-50 border border-blue-100 p-6 my-4 rounded-lg text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  {searchTerm ? (
                    <StarIcon className="h-8 w-8 text-blue-500" />
                  ) : (
                    <CalendarIcon className="h-8 w-8 text-blue-500" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-blue-800">
                  {searchTerm 
                    ? `Aucun événement ne correspond à "${searchTerm}"` 
                    : "Aucun événement trouvé"}
                </h3>
                <p className="text-blue-600 mt-2 max-w-md mx-auto">
                  {searchTerm 
                    ? "Essayez un terme de recherche différent ou effacez la recherche pour voir tous les événements."
                    : "Il n'y a aucun événement planifié. Cliquez sur 'Nouvel événement' pour en créer un."}
                </p>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-4 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow-sm hover:shadow"
                  >
                    Effacer la recherche
                  </button>
                )}
              </motion.div>
            )}

            {/* Calendar Component */}
            <div className="p-4 sm:p-7 pt-5">
              <motion.div
                className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Calendar
                  localizer={localizer}
                  events={filteredEvents}
                  startAccessor="start"
                  endAccessor="end"
                  date={currentDate}
                  view={currentView}
                  onNavigate={(date) => setCurrentDate(date)}
                  onView={(view) => setCurrentView(view as Views)}
                  defaultView={Views.MONTH}
                  views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                  messages={{
                    month: "Mois",
                    week: "Semaine",
                    day: "Jour",
                    agenda: "Agenda",
                    previous: "Précédent",
                    next: "Suivant",
                    today: "Aujourd'hui",
                    showMore: (total) => `+ ${total} autres`,
                    allDay: "Toute la journée",
                    date: "Date",
                    time: "Heure",
                    event: "Événement",
                    noEventsInRange: "Aucun événement dans cette période",
                  }}
                  style={
                    {
                      height: "75vh",
                      "--c-primary": "#1a365d",
                      "--c-secondary": "#0f2942",
                      "--c-accent": "#c5f7a5",
                    } as CustomCSSProperties
                  }
                  className="calendrier-premium"
                  eventPropGetter={(event) => {
                    const colors = getEventColor(event);
                    return {
                      style: {
                        backgroundColor: colors.bg,
                        border: `1px solid ${colors.border}`,
                        borderRadius: "10px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        color: colors.text,
                        padding: "8px 14px",
                        fontSize: "0.875rem",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      },
                    };
                  }}
                  dayPropGetter={(date) => ({
                    className:
                      date.getDate() === new Date().getDate() &&
                      date.getMonth() === new Date().getMonth() &&
                      date.getFullYear() === new Date().getFullYear()
                        ? "jour-actuel bg-gradient-to-br from-blue-50/70 to-blue-100/40 border-l-4 border-blue-500"
                        : "",
                  })}
                  components={{
                    event: ({ event }) => {
                      const colors = getEventColor(event);
                      return (
                        <motion.div
                          className="h-full p-2"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.03, y: -1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <div className="flex items-start gap-3 h-full relative">
                            <div
                              className={`h-2.5 w-2.5 rounded-full mt-1.5 flex-shrink-0`}
                              style={{ backgroundColor: colors.text === "white" ? "rgba(255, 255, 255, 0.9)" : "rgba(26, 54, 93, 0.8)" }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{event.title || event.problem || "Sans titre"}</p>
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <ClockIcon
                                    className={`h-3 w-3`}
                                    style={{ color: colors.text === "white" ? "rgba(255, 255, 255, 0.8)" : "rgba(75, 85, 99, 1)" }}
                                  />
                                  <span
                                    className={`text-xs font-medium`}
                                    style={{ color: colors.text === "white" ? "rgba(255, 255, 255, 0.9)" : "rgba(75, 85, 99, 1)" }}
                                  >
                                    {event.start && event.start.toLocaleTimeString("fr-FR", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                
                                {event.location && (
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <span
                                      style={{ color: colors.text === "white" ? "rgba(255, 255, 255, 0.6)" : "rgba(156, 163, 175, 1)" }}
                                      className="hidden sm:inline"
                                    >
                                      •
                                    </span>
                                    <MapPinIcon
                                      className={`h-3 w-3`}
                                      style={{ color: colors.text === "white" ? "rgba(255, 255, 255, 0.8)" : "rgba(75, 85, 99, 1)" }}
                                    />
                                    <span
                                      className={`text-xs truncate max-w-[60px] sm:max-w-[100px]`}
                                      style={{ color: colors.text === "white" ? "rgba(255, 255, 255, 0.9)" : "rgba(75, 85, 99, 1)" }}
                                    >
                                      {event.location}
                                    </span>
                                  </div>
                                )}
                                
                                {event.ticket && (
                                  <div className="flex items-center gap-1 flex-shrink-0 hidden sm:flex">
                                    <span
                                      style={{ color: colors.text === "white" ? "rgba(255, 255, 255, 0.6)" : "rgba(156, 163, 175, 1)" }}
                                      className="hidden sm:inline"
                                    >
                                      •
                                    </span>
                                    <ClipboardIcon
                                      className={`h-3 w-3`}
                                      style={{ color: colors.text === "white" ? "rgba(255, 255, 255, 0.8)" : "rgba(75, 85, 99, 1)" }}
                                    />
                                    <span
                                      className={`text-xs truncate`}
                                      style={{ color: colors.text === "white" ? "rgba(255, 255, 255, 0.9)" : "rgba(75, 85, 99, 1)" }}
                                    >
                                      {event.ticket}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Touch target overlay for better mobile experience */}
                            <div className="absolute inset-0 cursor-pointer" />
                          </div>
                        </motion.div>
                      );
                    },
                    toolbar: () => (
                      <motion.div
                        className="border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                      ></motion.div>
                    ),
                    timeGutterHeader: () => (
                      <div className="h-full bg-gray-50 flex items-center justify-center text-sm font-semibold text-gray-600 border-r border-gray-100">
                        <ClockIcon className="h-4 w-4 mr-1.5 text-blue-500" /> Horaire
                      </div>
                    ),
                    agenda: {
                      event: ({ event }) => (
                        <motion.div
                          className="flex items-center gap-4 p-4 my-2.5 bg-white border-l-4 rounded-xl shadow-sm hover:shadow-md transition-all group"
                          style={{ borderLeftColor: getEventColor(event).bg }}
                          whileHover={{ x: 5, backgroundColor: "#f8fafc" }}
                        >
                          <div
                            className={`h-3.5 w-3.5 rounded-full`}
                            style={{ backgroundColor: getEventColor(event).bg }}
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {event.title || event.problem || "Sans titre"}
                              {event.ticket && <span className="ml-2 text-xs text-gray-500">{event.ticket}</span>}
                            </p>
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-3 mt-1.5">
                              <div className="flex items-center gap-1.5">
                                <ClockIcon className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {event.start && event.start.toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                  {event.end && " - "}
                                  {event.end && event.end.toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <span className="text-gray-400 hidden sm:inline">|</span>
                              <div className="flex items-center gap-1.5">
                                <UserCircleIcon className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {event.participants || 
                                    (event.technicianFirstName && event.customerFirstName 
                                      ? `${event.technicianFirstName} ${event.technicianLastName} & ${event.customerFirstName} ${event.customerLastName}`
                                      : "Aucun participant")}
                                </span>
                              </div>
                              {event.location && (
                                <>
                                  <span className="text-gray-400 hidden sm:inline">|</span>
                                  <div className="flex items-center gap-1.5">
                                    <MapPinIcon className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600 truncate max-w-[200px]">
                                      {event.location}
                                    </span>
                                  </div>
                                </>
                              )}
                              {event.status && (
                                <>
                                  <span className="text-gray-400 hidden sm:inline">|</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className={`inline-block h-2 w-2 rounded-full ${
                                      event.status === "completed" ? "bg-green-500" :
                                      event.status === "open" ? "bg-blue-500" :
                                      event.status === "pending" ? "bg-yellow-500" : "bg-gray-500"
                                    }`}></span>
                                    <span className="text-sm text-gray-600">
                                      {event.status === "pending"
                                        ? "En attente"
                                        : event.status === "scheduled"
                                        ? "Planifié"
                                        : event.status === "completed"
                                        ? "Complété"
                                        : event.status === "open"
                                        ? "Ouvert"
                                        : event.status}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <PencilIcon className="h-4 w-4 text-gray-500" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <TrashIcon className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                        </motion.div>
                      ),
                      time: ({ label }: { label?: string }) => (
                        <div className="text-sm font-medium text-gray-700 bg-gray-50 p-3 border-b border-gray-100">
                          {label || ""}
                        </div>
                      ),
                    },
                    week: {
                      header: ({ date }) => (
                        <div className="text-center py-3 bg-gradient-to-b from-blue-50 to-white border-b border-gray-100">
                          <p className="text-sm font-bold text-blue-600 mb-1 uppercase">
                            {date.toLocaleDateString("fr-FR", { weekday: "short" })}
                          </p>
                          <p
                            className={`text-xl ${
                              date.getDate() === new Date().getDate() &&
                              date.getMonth() === new Date().getMonth() &&
                              date.getFullYear() === new Date().getFullYear()
                                ? "text-blue-600 font-bold"
                                : "text-gray-800 font-semibold"
                            }`}
                          >
                            {date.getDate()}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {date.toLocaleDateString("fr-FR", { month: "short" })}
                          </p>
                        </div>
                      ),
                    },
                    day: {
                      header: ({ date }) => (
                        <div className="text-center py-6 bg-blue-50 border-b border-blue-100">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
                            <p className="text-lg font-bold text-blue-600">
                              {date.toLocaleDateString("fr-FR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="flex items-center justify-center text-sm text-blue-700">
                            {isToday(date) && (
                              <span className="px-3 py-1 bg-blue-100 rounded-full font-medium">
                                Aujourd&apos;hui
                              </span>
                            )}
                          </div>
                        </div>
                      ),
                    },
                  }}
                  popup
                  selectable
                  onSelectEvent={(event) => {
                    console.log("Événement sélectionné:", event);
                    setEventDetails(event);
                  }}
                  onSelectSlot={(slotInfo) => {
                    console.log("Créneau sélectionné:", slotInfo);
                    // You could trigger the new event modal here with pre-filled dates
                    // setShowNewEventModal(true);
                  }}
                  culture="fr"
                />
              </motion.div>
            </div>
          </div>
        </main>
      </div>

      {/* Calendrier S.A.V. Popup Modal */}
      {eventDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Semi-transparent background with blur effect */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClosePopup}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          ></motion.div>

          {/* Popup content */}
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl z-10 max-w-md w-full mx-4 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Status color accent at top of modal */}
            <div 
              className="absolute top-0 left-0 right-0 h-2"
              style={{ 
                backgroundColor: getEventColor(eventDetails).bg,
                boxShadow: `0 0 20px ${getEventColor(eventDetails).bg}`
              }}
            ></div>
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6 mt-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {eventDetails.title || eventDetails.problem || eventDetails.type || "Détails de l'événement"}
                  </h3>
                  {eventDetails.type && (
                    <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {eventDetails.type}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleClosePopup}
                  className="rounded-full h-8 w-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xl font-medium">×</span>
                </button>
              </div>
            </div>

            {/* Event Information Grid */}
            <div className="space-y-4">
              {/* Ticket and Status */}
              <div className="grid grid-cols-2 gap-4">
                {eventDetails.ticket && (
                  <div className="flex items-center space-x-2">
                    <ClipboardIcon className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Ticket
                      </p>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {eventDetails.ticket}
                      </p>
                    </div>
                  </div>
                )}
                {eventDetails.status && (
                  <div className="flex items-center space-x-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        eventDetails.status === "completed"
                          ? "bg-green-500"
                          : eventDetails.status === "pending"
                          ? "bg-yellow-500"
                          : eventDetails.status === "scheduled"
                          ? "bg-blue-500"
                          : eventDetails.status === "open"
                          ? "bg-blue-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Statut
                      </p>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {eventDetails.status === "pending"
                          ? "En attente"
                          : eventDetails.status === "scheduled"
                          ? "Planifié"
                          : eventDetails.status === "completed"
                          ? "Complété"
                          : eventDetails.status === "open"
                          ? "Ouvert"
                          : eventDetails.status}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Priority */}
              {eventDetails.priority && (
                <div className="flex items-center space-x-3">
                  <EllipsisHorizontalIcon className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Priorité
                    </p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {eventDetails.priority === "high" 
                        ? "Haute" 
                        : eventDetails.priority === "medium" 
                        ? "Moyenne" 
                        : eventDetails.priority === "low" 
                        ? "Basse" 
                        : eventDetails.priority}
                    </p>
                  </div>
                </div>
              )}

              {/* Date and Time */}
              {eventDetails.start && (
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Date
                    </p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {new Date(eventDetails.start).toLocaleString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {eventDetails.end && " - "}
                      {eventDetails.end && new Date(eventDetails.end).toLocaleString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )}

              {/* Customer and Technician */}
              <div className="grid grid-cols-2 gap-4">
                {(eventDetails.customerFirstName ||
                  eventDetails.customerLastName) && (
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Client
                      </p>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {`${eventDetails.customerFirstName || ""} ${eventDetails.customerLastName || ""}`}
                      </p>
                    </div>
                  </div>
                )}
                {(eventDetails.technicianFirstName ||
                  eventDetails.technicianLastName) && (
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Technicien
                      </p>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {`${eventDetails.technicianFirstName || ""} ${eventDetails.technicianLastName || ""}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Location */}
              {(eventDetails.address || eventDetails.location) && (
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Lieu
                      </p>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {eventDetails.address || eventDetails.location}
                      </p>
                    </div>
                  </div>
                  <iframe
                    title="Map"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      (eventDetails.address || eventDetails.location) as string
                    )}&output=embed`}
                    width="100%"
                    height="200"
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
                </div>
              )}

              {/* Created At */}
              {eventDetails.createdAt && (
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Créé le
                    </p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {new Date(eventDetails.createdAt).toLocaleString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )}

              {/* Description */}
              {(eventDetails.notes || eventDetails.problem) && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    Description
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-gray-800 dark:text-gray-200">
                      {eventDetails.notes || eventDetails.problem}
                    </p>
                  </div>
                </div>
              )}

              {/* Conversation */}
              {eventDetails.conversation &&
                eventDetails.conversation.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <EllipsisHorizontalIcon className="h-5 w-5 text-indigo-500" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Conversation
                      </p>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                    {eventDetails.conversation?.map((msg: ConversationMessage, index: number) => (
                        <div
                          key={index}
                          className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                              {msg.sender}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(msg.timestamp).toLocaleString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {msg.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button
                onClick={handleClosePopup}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 font-medium"
              >
                Fermer
              </button>
              <button
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium shadow-md hover:shadow-lg"
              >
                Modifier
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Global custom CSS for react-big-calendar */}
      <style jsx global>{`
        .calendrier-premium {
          .rbc-month-view,
          .rbc-time-view {
            border: none;
            background: linear-gradient(to bottom right, #f8fafc, #ffffff);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }
          .rbc-header {
            padding: 1.25rem 1rem;
            background: linear-gradient(to bottom, #f9fafb, #ffffff);
            color: #4b5563;
            font-weight: 600;
            border-bottom: 1px solid #e5e7eb;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-size: 0.875rem;
          }
          .rbc-month-row {
            overflow: visible;
          }
          .rbc-day-bg {
            transition: background 0.3s;
          }
          .rbc-day-bg:hover {
            background: rgba(243, 244, 246, 0.7);
          }
          .rbc-event {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transform-origin: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 10px !important;
            overflow: visible !important;
          }
          .rbc-event:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
            z-index: 10 !important;
          }
          .rbc-event:active {
            transform: translateY(0px) scale(0.98);
          }
          .rbc-time-content {
            border-top: 0;
          }
          .rbc-timeslot-group {
            border-color: #e5e7eb;
          }
          .rbc-current-time-indicator {
            background: #3b82f6;
            height: 2px;
          }
          .rbc-today {
            background-color: rgba(239, 246, 255, 0.6);
          }
          .rbc-label {
            font-weight: 500;
            color: #4b5563;
          }
          .rbc-time-header-content {
            border-color: #e5e7eb;
          }
          .rbc-agenda-view table.rbc-agenda-table {
            border-radius: 10px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
          }
          .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
            background-color: #f3f4f6;
            color: #4b5563;
            font-weight: 600;
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
          }
          .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
          }
          .rbc-agenda-view table.rbc-agenda-table tbody > tr:hover {
            background-color: #f9fafb;
          }
          .rbc-header + .rbc-header {
            border-left: 1px solid #e5e7eb;
          }
          .rbc-off-range-bg {
            background: #f9fafb;
          }
          .rbc-off-range {
            color: #9ca3af;
          }
          .rbc-date-cell {
            padding: 6px 8px;
            text-align: center;
            font-weight: 500;
            color: #4b5563;
          }
          .rbc-date-cell.rbc-now {
            color: #2563eb;
            font-weight: 700;
          }
          .rbc-button-link {
            font-weight: 500;
          }
          @media (max-width: 640px) {
            .rbc-toolbar {
              flex-direction: column;
              align-items: flex-start;
              margin-bottom: 10px;
            }
            .rbc-toolbar-label {
              margin: 8px 0;
            }
            .rbc-btn-group {
              margin-bottom: 8px;
            }
            .rbc-header {
              padding: 0.75rem 0.5rem;
              font-size: 0.75rem;
            }
            .rbc-event {
              padding: 4px 6px !important;
              min-height: 36px;
            }
            .rbc-event-content {
              font-size: 0.7rem !important;
            }
            .rbc-event-label {
              font-size: 0.7rem !important;
            }
            .rbc-day-slot .rbc-events-container {
              margin-right: 0;
            }
            .rbc-row-segment {
              padding: 0 1px;
            }
            .rbc-date-cell {
              font-size: 0.7rem;
              padding: 4px;
            }
            .rbc-month-row {
              min-height: 60px; /* Ensure rows have enough height on mobile */
            }
            .rbc-date-cell > a {
              margin: 2px auto;
            }
          }
          
          /* Some additional mobile optimizations */
          @media (max-width: 480px) {
            .rbc-month-view {
              border-radius: 8px;
              margin: 0 -4px;
            }
            .rbc-month-header {
              height: auto;
            }
            .rbc-header {
              padding: 8px 4px;
              font-size: 0.65rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              height: auto;
            }
            .rbc-date-cell {
              padding: 2px;
            }
            .rbc-event {
              min-height: 28px;
              padding: 2px 4px !important;
            }
          }
          .rbc-time-header-content .rbc-header {
            background: linear-gradient(to bottom, #eef2ff, #f9fafb);
            padding: 1rem;
            height: auto;
          }
          .rbc-month-header .rbc-header {
            background: linear-gradient(to bottom, #eef2ff, #f9fafb);
            padding: 1rem;
            text-transform: capitalize;
            font-weight: 600;
            font-size: 0.9rem;
          }
        }
        .jour-actuel {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(255,255,255,0) 70%);
          position: relative;
        }
        .jour-actuel::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #3b82f6;
          border-radius: 3px 3px 0 0;
        }
      `}</style>
    </div>
  );
}
