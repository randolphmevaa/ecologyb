"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  CalendarIcon, 
  ClockIcon, 
  CheckCircleIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  UserIcon,
  ArrowRightIcon,
  // PhotoIcon,
  CloudIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  StarIcon,
  CheckIcon,
  PencilIcon,
  BuildingOfficeIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { format, addDays, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, getDay, addMonths, startOfMonth, endOfMonth, addWeeks, isSameMonth, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

// Define all the necessary TypeScript interfaces and types
interface Technician {
  name: string;
  phone: string;
  photo: string;
  rating: number;
  experience: string;
}

interface Step {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  date: string;
}

interface Document {
  id: number;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
}

interface Communication {
  id: number;
  date: string;
  content: string;
  from: "support" | "technician";
  read: boolean;
}

interface ChecklistItem {
  id: number;
  description: string;
  completed: boolean;
}

type InstallationStatus = 'confirmed' | 'in_progress' | 'completed' | 'delayed';
type WeatherCondition = 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy' | 'stormy';
type CalendarView = 'day' | 'week' | 'month';

interface WeatherForecast {
  date: string;
  condition: WeatherCondition;
  temperature: number;
  precipitationProbability: number;
  windSpeed: number;
}

interface InstallationData {
  id: string;
  status: InstallationStatus;
  projectId: string;
  projectName: string;
  address: string;
  installationDate: string;
  duration: number;
  readyForInstallation: boolean;
  progress: number;
  technician: Technician;
  steps: Step[];
  documents: Document[];
  communications: Communication[];
  checklist: ChecklistItem[];
  weatherForecast: WeatherForecast;
}

// Mock data with proper typing
const installationData: InstallationData = {
  id: "INST-2357",
  status: "confirmed",
  projectId: "PRJ-4821",
  projectName: "Installation Pompe à Chaleur Air/Eau",
  address: "15 Rue des Fleurs, 75001 Paris",
  installationDate: "2025-03-25T09:00:00",
  duration: 2,
  readyForInstallation: true,
  progress: 0,
  technician: {
    name: "Thomas Laurent",
    phone: "06 78 90 12 34",
    photo: "/technician-profile.jpg",
    rating: 4.8,
    experience: "8 ans"
  },
  steps: [
    { id: 1, name: "Validation technique", description: "Vérification finale des spécifications techniques", completed: true, date: "2025-03-10T14:30:00" },
    { id: 2, name: "Préparation du chantier", description: "Préparation du site et des matériaux nécessaires", completed: true, date: "2025-03-18T10:00:00" },
    { id: 3, name: "Installation", description: "Installation de la pompe à chaleur", completed: false, date: "2025-03-25T09:00:00" },
    { id: 4, name: "Tests et réglages", description: "Vérification du fonctionnement et optimisation des performances", completed: false, date: "2025-03-26T14:00:00" },
    { id: 5, name: "Formation", description: "Explication du fonctionnement et de l'entretien", completed: false, date: "2025-03-27T11:00:00" },
    { id: 6, name: "Suivi de performance", description: "Évaluation des performances après 30 jours", completed: false, date: "2025-04-27T10:00:00" }
  ],
  documents: [
    { id: 1, name: "Plan d'installation.pdf", type: "pdf", uploadDate: "2025-03-01T10:24:00", size: "2.4 MB" },
    { id: 2, name: "Guide technique PAC.pdf", type: "pdf", uploadDate: "2025-03-02T15:45:00", size: "4.8 MB" },
    { id: 3, name: "Certificat de garantie.pdf", type: "pdf", uploadDate: "2025-03-02T15:48:00", size: "1.2 MB" }
  ],
  communications: [
    { id: 1, date: "2025-03-05T11:23:00", content: "Confirmation de la date d'installation", from: "support", read: true },
    { id: 2, date: "2025-03-12T14:17:00", content: "Validation des détails techniques du projet", from: "technician", read: true },
    { id: 3, date: "2025-03-18T09:45:00", content: "Rappel : Préparer l'accès à la zone d'installation et couper l'alimentation électrique", from: "technician", read: false }
  ],
  checklist: [
    { id: 1, description: "Dégager la zone d'installation (min. 2m²)", completed: true },
    { id: 2, description: "Prévoir un accès pour les techniciens et le matériel", completed: true },
    { id: 3, description: "Couper l'alimentation électrique le matin de l'installation", completed: false },
    { id: 4, description: "Sécuriser les animaux domestiques pendant l'installation", completed: false }
  ],
  weatherForecast: {
    date: "2025-03-25",
    condition: "partly_cloudy",
    temperature: 14,
    precipitationProbability: 20,
    windSpeed: 12
  }
};

export default function InstallationTracker() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [checklist, setChecklist] = useState(installationData.checklist);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [currentDate, setCurrentDate] = useState(parseISO(installationData.installationDate));
  const [calendarView, setCalendarView] = useState<CalendarView>('week');

  // Brand colors
  const colors = {
    darkBlue: "#213f5b",
    lightBlue: "#bfddf9",
    lightGreen: "#d2fcb2",
    white: "#ffffff",
    orange: "#FFA500",
    red: "#FF5252"
  };

  // Calculate days remaining until installation
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const installationDateTime = parseISO(installationData.installationDate);
      const now = new Date();
      
      const totalSeconds = Math.floor((installationDateTime.getTime() - now.getTime()) / 1000);
      
      if (totalSeconds <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = Math.floor(totalSeconds % 60);
      
      setCountdown({ days, hours, minutes, seconds });
    };
    
    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);
    
    return () => clearInterval(timer);
  }, [installationData.installationDate]);

  // Toggle checklist item completion
  const toggleChecklistItem = (id: number) => {
    setChecklist(current =>
      current.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

// For the getStatusColor function
type InstallationStatus = 'confirmed' | 'in_progress' | 'completed' | 'delayed';

const getStatusColor = (status: InstallationStatus) => {
  switch(status) {
    case "confirmed":
      return {
        bg: colors.lightBlue,
        text: colors.darkBlue,
        icon: <ClockIcon className="h-5 w-5" />
      };
    case "in_progress":
      return {
        bg: colors.orange,
        text: "#ffffff",
        icon: <ClockIcon className="h-5 w-5" />
      };
    case "completed":
      return {
        bg: colors.lightGreen,
        text: colors.darkBlue,
        icon: <CheckCircleIcon className="h-5 w-5" />
      };
    case "delayed":
      return {
        bg: colors.red,
        text: "#ffffff",
        icon: <ExclamationCircleIcon className="h-5 w-5" />
      };
    default:
      return {
        bg: colors.lightBlue,
        text: colors.darkBlue,
        icon: <ClockIcon className="h-5 w-5" />
      };
  }
};

type WeatherCondition = 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy' | 'stormy';

  // Get proper weather icon
  const getWeatherIcon = (condition: WeatherCondition) => {
    switch(condition) {
      case "sunny":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case "partly_cloudy":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        );
      case "cloudy":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        );
      case "rainy":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        );
      case "stormy":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default:
        return <CloudIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  // Format date
  const formatDate = (dateString: string, includeTime: boolean = true) => {
    const date = parseISO(dateString);
    if (includeTime) {
      return format(date, "d MMMM yyyy 'à' HH'h'mm", { locale: fr });
    }
    return format(date, "d MMMM yyyy", { locale: fr });
  };

  // Calendar navigation functions
  const nextPeriod = () => {
    if (calendarView === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    } else if (calendarView === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const prevPeriod = () => {
    if (calendarView === 'day') {
      setCurrentDate(addDays(currentDate, -1));
    } else if (calendarView === 'week') {
      setCurrentDate(addWeeks(currentDate, -1));
    } else {
      setCurrentDate(addMonths(currentDate, -1));
    }
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  // Get the date range for the current view
  const getDateRange = () => {
    if (calendarView === 'day') {
      return [currentDate];
    } else if (calendarView === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Week starts on Monday
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return eachDayOfInterval({ start, end });
    }
  };

  // Get installation events
  const getEvents = () => {
    return installationData.steps.map(step => ({
      id: step.id,
      title: step.name,
      description: step.description,
      date: parseISO(step.date),
      completed: step.completed
    }));
  };

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
      transition: { duration: 0.4 }
    }
  };

  const renderCalendarHeader = () => {
    // const monthYear = format(currentDate, 'MMMM yyyy', { locale: fr });
    let dateRangeText = "";
    
    if (calendarView === 'day') {
      dateRangeText = format(currentDate, "EEEE d MMMM yyyy", { locale: fr });
    } else if (calendarView === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      dateRangeText = `${format(start, "d", { locale: fr })} - ${format(end, "d MMMM yyyy", { locale: fr })}`;
    } else {
      dateRangeText = format(currentDate, "MMMM yyyy", { locale: fr });
    }
    
    return (
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#213f5b]">{dateRangeText}</h3>
        <div className="flex space-x-2">
          <button 
            onClick={prevPeriod}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeftIcon className="h-5 w-5 text-[#213f5b]" />
          </button>
          <button 
            onClick={today}
            className="px-3 py-1 text-sm bg-[#bfddf9]/20 text-[#213f5b] rounded-lg hover:bg-[#bfddf9]/30"
          >
            Aujourd&apos;hui
          </button>
          <button 
            onClick={nextPeriod}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronRightIcon className="h-5 w-5 text-[#213f5b]" />
          </button>
        </div>
      </div>
    );
  };

  const renderCalendarViewSelector = () => {
    return (
      <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden mb-6 shadow-sm">
        <button
          onClick={() => setCalendarView('day')}
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            calendarView === 'day'
              ? 'bg-[#213f5b] text-white'
              : 'text-[#213f5b] hover:bg-gray-50'
          }`}
        >
          Jour
        </button>
        <button
          onClick={() => setCalendarView('week')}
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            calendarView === 'week'
              ? 'bg-[#213f5b] text-white'
              : 'text-[#213f5b] hover:bg-gray-50'
          }`}
        >
          Semaine
        </button>
        <button
          onClick={() => setCalendarView('month')}
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            calendarView === 'month'
              ? 'bg-[#213f5b] text-white'
              : 'text-[#213f5b] hover:bg-gray-50'
          }`}
        >
          Mois
        </button>
      </div>
    );
  };

  const renderDayView = () => {
    const events = getEvents().filter(event => 
      isSameDay(event.date, currentDate)
    );
    
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 - 19:00
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 bg-[#f8faff]">
          <h4 className="text-base font-medium text-[#213f5b] capitalize">
            {format(currentDate, "EEEE d MMMM", { locale: fr })}
          </h4>
        </div>
        <div className="divide-y divide-gray-100">
          {hours.map((hour) => {
            const hourEvents = events.filter(event => {
              const eventHour = event.date.getHours();
              return eventHour === hour;
            });
            
            return (
              <div key={hour} className="flex p-3 hover:bg-gray-50">
                <div className="w-16 flex-shrink-0 text-gray-500 text-sm">
                  {`${hour}:00`}
                </div>
                <div className="flex-grow">
                  {hourEvents.length > 0 ? (
                    hourEvents.map(event => (
                      <div 
                        key={event.id}
                        className={`p-2 rounded-lg text-sm mb-1 ${
                          event.completed 
                            ? 'bg-[#d2fcb2]/20 border border-[#d2fcb2]' 
                            : 'bg-[#bfddf9]/20 border border-[#bfddf9]'
                        }`}
                      >
                        <div className="font-medium text-[#213f5b]">{event.title}</div>
                        <div className="text-xs text-gray-600">{event.description}</div>
                      </div>
                    ))
                  ) : (
                    <div className="h-6"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getDateRange();
    const events = getEvents();
    const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        {/* Week header */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map((day, index) => (
            <div key={index} className="py-3 px-2 text-center text-sm font-medium text-[#213f5b]">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 h-96 auto-rows-fr">
          {days.map((day, i) => {
            const dayEvents = events.filter(event => 
              isSameDay(event.date, day)
            );
            const isToday = isSameDay(day, new Date());
            const isInstallationDay = isSameDay(day, parseISO(installationData.installationDate));
            
            return (
              <div 
                key={i} 
                className={`border-r border-b border-gray-100 p-2 ${
                  isToday 
                    ? 'bg-[#f8faff]' 
                    : isInstallationDay
                      ? 'bg-[#d2fcb2]/10'
                      : ''
                } hover:bg-gray-50`}
              >
                <div className={`text-sm mb-2 ${
                  isToday 
                    ? 'font-bold text-[#213f5b]' 
                    : 'text-gray-500'
                }`}>
                  {format(day, 'd', { locale: fr })}
                </div>
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id}
                      className={`p-1 rounded text-xs ${
                        event.completed 
                          ? 'bg-[#d2fcb2]/20 border border-[#d2fcb2]' 
                          : 'bg-[#bfddf9]/20 border border-[#bfddf9]'
                      }`}
                    >
                      <div className="font-medium text-[#213f5b] truncate">{event.title}</div>
                      <div className="text-gray-600 truncate text-xs">
                        {format(event.date, 'HH:mm')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    // const currentMonth = getMonth(currentDate);
    // const currentYear = getYear(currentDate);
    const monthStart = startOfMonth(currentDate);
    const firstDayOfMonth = getDay(monthStart);
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for Monday start
    
    // Generate days including those from previous and next months to fill the grid
    const startDate = addDays(monthStart, -adjustedFirstDay);
    const days = Array.from({ length: 42 }, (_, i) => addDays(startDate, i));
    
    const events = getEvents();
    const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        {/* Week header */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map((day, index) => (
            <div key={index} className="py-3 px-2 text-center text-sm font-medium text-[#213f5b]">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {days.map((day, i) => {
            const inCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            const isInstallationDay = isSameDay(day, parseISO(installationData.installationDate));
            const dayEvents = events.filter(event => isSameDay(event.date, day));
            
            return (
              <div 
                key={i} 
                className={`h-24 border-r border-b border-gray-100 p-1 ${
                  !inCurrentMonth 
                    ? 'bg-gray-50 text-gray-400' 
                    : isToday 
                      ? 'bg-[#f8faff]' 
                      : isInstallationDay
                        ? 'bg-[#d2fcb2]/10'
                        : ''
                } hover:bg-gray-50`}
              >
                <div className={`text-sm p-1 ${
                  isToday 
                    ? 'font-bold text-white bg-[#213f5b] rounded-full w-6 h-6 flex items-center justify-center' 
                    : inCurrentMonth ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1 mt-1 overflow-y-auto max-h-16">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id}
                      className={`p-1 rounded text-xs ${
                        event.completed 
                          ? 'bg-[#d2fcb2]/20 border border-[#d2fcb2]' 
                          : 'bg-[#bfddf9]/20 border border-[#bfddf9]'
                      }`}
                    >
                      <div className="font-medium text-[#213f5b] truncate">{event.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#fafbfd]">

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
      <Header />
      <main 
      className="p-8 flex-1 overflow-y-auto"
      style={{
        background:
          "linear-gradient(135deg, rgba(191,221,249,0.15), rgba(210,252,178,0.1))",
      }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="sm:py-10 sm:pt-2"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center mb-2">
                <Link href="/client/projects" className="text-[#213f5b] hover:text-[#213f5b]/80 flex items-center">
                  <ArrowRightIcon className="h-4 w-4 rotate-180 mr-1" />
                  <span className="text-sm">Retour aux projets</span>
                </Link>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#213f5b]">
                Suivi d&apos;Installation
              </h1>
              <p className="mt-2 text-lg text-gray-600 max-w-3xl">
                Suivez l&apos;avancement de votre installation en temps réel et préparez-vous pour le jour J.
              </p>
            </div>
            
            {/* Status Badge - Dynamically styled based on status */}
            <div className="flex items-center">
              <span 
                className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: getStatusColor(installationData.status).bg,
                  color: getStatusColor(installationData.status).text
                }}
              >
                {getStatusColor(installationData.status).icon}
                {installationData.status === "confirmed" && "Installation confirmée"}
                {installationData.status === "in_progress" && "Installation en cours"}
                {installationData.status === "completed" && "Installation terminée"}
                {installationData.status === "delayed" && "Installation reportée"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width on desktop */}
          <div className="lg:col-span-2 space-y-6">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex items-center py-4 px-6 text-sm font-medium ${
                    activeTab === "overview"
                      ? "text-[#213f5b] border-b-2 border-[#213f5b]"
                      : "text-gray-500 hover:text-[#213f5b]"
                  }`}
                >
                  <InformationCircleIcon className="h-5 w-5 mr-2" />
                  Vue d&apos;ensemble
                </button>
                <button
                  onClick={() => setActiveTab("timeline")}
                  className={`flex items-center py-4 px-6 text-sm font-medium ${
                    activeTab === "timeline"
                      ? "text-[#213f5b] border-b-2 border-[#213f5b]"
                      : "text-gray-500 hover:text-[#213f5b]"
                  }`}
                >
                  <ClockIcon className="h-5 w-5 mr-2" />
                  Calendrier
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`flex items-center py-4 px-6 text-sm font-medium ${
                    activeTab === "messages"
                      ? "text-[#213f5b] border-b-2 border-[#213f5b]"
                      : "text-gray-500 hover:text-[#213f5b]"
                  } relative`}
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                  Messages
                  {installationData.communications.some(comm => !comm.read) && (
                    <span className="absolute top-3 right-3 h-2.5 w-2.5 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                  >
                    {/* Installation Details */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#f8faff] rounded-lg p-5 border border-[#bfddf9]/30">
                        <h3 className="text-lg font-semibold text-[#213f5b] mb-4">Détails de l&apos;installation</h3>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <CalendarIcon className="h-5 w-5 text-[#213f5b] mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-[#213f5b]">Date d&apos;installation</p>
                              <p className="text-sm text-gray-600">{formatDate(installationData.installationDate)}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <ClockIcon className="h-5 w-5 text-[#213f5b] mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-[#213f5b]">Durée estimée</p>
                              <p className="text-sm text-gray-600">{installationData.duration} jour{installationData.duration > 1 ? 's' : ''}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <MapPinIcon className="h-5 w-5 text-[#213f5b] mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-[#213f5b]">Adresse</p>
                              <p className="text-sm text-gray-600">{installationData.address}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <ClockIcon className="h-5 w-5 text-[#213f5b] mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-[#213f5b]">Référence projet</p>
                              <p className="text-sm text-gray-600">{installationData.projectId}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Technician Info */}
                      <div className="bg-[#f8faff] rounded-lg p-5 border border-[#bfddf9]/30">
                        <h3 className="text-lg font-semibold text-[#213f5b] mb-4">Votre technicien</h3>
                        <div className="flex items-center mb-4">
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#213f5b] to-[#bfddf9] text-white text-xl font-bold flex items-center justify-center mr-4">
                            {installationData.technician.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="text-base font-medium text-[#213f5b]">{installationData.technician.name}</h4>
                            <div className="flex items-center mt-1">
                              <div className="flex items-center">
                                <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-sm text-gray-600 ml-1">{installationData.technician.rating}</span>
                              </div>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className="text-sm text-gray-600">{installationData.technician.experience} d&apos;expérience</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-5">
                          <button 
                            onClick={() => alert(`Appeler le technicien: ${installationData.technician.phone}`)}
                            className="flex items-center justify-center bg-[#213f5b] text-white py-2 px-4 rounded-lg flex-1 hover:bg-[#213f5b]/90 transition-colors text-sm"
                          >
                            <PhoneIcon className="h-4 w-4 mr-2" />
                            Appeler
                          </button>
                          <button 
                            onClick={() => setShowMessageModal(true)}
                            className="flex items-center justify-center bg-white text-[#213f5b] py-2 px-4 rounded-lg flex-1 border border-[#bfddf9] hover:bg-[#bfddf9]/10 transition-colors text-sm"
                          >
                            <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                            Message
                          </button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Countdown Timer */}
                    <motion.div variants={itemVariants} className="bg-gradient-to-r from-[#213f5b] to-[#213f5b]/90 rounded-lg p-6 text-white">
                      <h3 className="text-lg font-semibold mb-4">Compte à rebours avant l&apos;installation</h3>
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="flex flex-col items-center">
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 w-full text-center">
                            <span className="text-2xl font-bold">{countdown.days}</span>
                          </div>
                          <span className="text-xs mt-2">Jours</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 w-full text-center">
                            <span className="text-2xl font-bold">{countdown.hours}</span>
                          </div>
                          <span className="text-xs mt-2">Heures</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 w-full text-center">
                            <span className="text-2xl font-bold">{countdown.minutes}</span>
                          </div>
                          <span className="text-xs mt-2">Minutes</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 w-full text-center">
                            <span className="text-2xl font-bold">{countdown.seconds}</span>
                          </div>
                          <span className="text-xs mt-2">Secondes</span>
                        </div>
                      </div>
                      <div className="text-sm mt-2 text-center text-white/80">
                        Votre installation est prévue pour le {formatDate(installationData.installationDate)}
                      </div>
                    </motion.div>

                    {/* Installation Checklist */}
                    <motion.div variants={itemVariants} className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
                      <h3 className="text-lg font-semibold text-[#213f5b] mb-4">Préparatifs pour l&apos;installation</h3>
                      <div className="space-y-3">
                        {checklist.map((item) => (
                          <div 
                            key={item.id} 
                            className={`flex items-center p-3 rounded-lg border ${
                              item.completed 
                                ? "border-[#d2fcb2] bg-[#d2fcb2]/10" 
                                : "border-gray-200 hover:border-[#bfddf9] hover:bg-[#bfddf9]/5"
                            } transition-colors cursor-pointer`}
                            onClick={() => toggleChecklistItem(item.id)}
                          >
                            <div className={`h-5 w-5 mr-3 rounded-full flex items-center justify-center ${
                              item.completed 
                                ? "bg-[#d2fcb2] text-[#213f5b]" 
                                : "border-2 border-gray-300"
                            }`}>
                              {item.completed && <CheckIcon className="h-3 w-3" />}
                            </div>
                            <span className={`text-sm ${item.completed ? "text-gray-600 line-through" : "text-[#213f5b]"}`}>
                              {item.description}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button 
                          className="text-sm text-[#213f5b] hover:text-[#213f5b]/80 flex items-center"
                          onClick={() => alert("Modification de la liste")}
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Modifier la liste
                        </button>
                      </div>
                    </motion.div>
                    
                    {/* Progress Tracker - Advanced Material-like UI */}
                    <motion.div variants={itemVariants} className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-semibold text-[#213f5b]">Progression de l&apos;installation</h3>
                        <button 
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="text-sm text-[#213f5b] hover:text-[#213f5b]/80 flex items-center"
                        >
                          {isExpanded ? (
                            <>
                              <span className="mr-1">Réduire</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                              </svg>
                            </>
                          ) : (
                            <>
                              <span className="mr-1">Voir tout</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="relative">
                        {/* Vertical timeline line */}
                        <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200 z-0"></div>

                        {/* Timeline items */}
                        <div className="space-y-8">
                          {installationData.steps.slice(0, isExpanded ? installationData.steps.length : 3).map((step, index) => {
                            // Determine step status styling
                            const isPast = step.completed;
                            const isCurrent = !step.completed && index === installationData.steps.findIndex(s => !s.completed);
                            const isFuture = !step.completed && !isCurrent;
                            
                            let dotColor, textColor, bgColor;
                            if (isPast) {
                              dotColor = "bg-[#d2fcb2]";
                              textColor = "text-[#213f5b]";
                              bgColor = "bg-[#d2fcb2]/10";
                            } else if (isCurrent) {
                              dotColor = "bg-[#bfddf9]";
                              textColor = "text-[#213f5b]";
                              bgColor = "bg-[#bfddf9]/10";
                            } else {
                              dotColor = "bg-gray-200";
                              textColor = "text-gray-500";
                              bgColor = "bg-white";
                            }

                            return (
                              <div 
                                key={step.id} 
                                className={`relative flex ${activeStep === step.id ? "z-10" : "z-0"}`}
                                onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                              >
                                {/* Timeline dot */}
                                <div className={`flex-shrink-0 h-8 w-8 rounded-full ${dotColor} flex items-center justify-center relative z-10 mt-1 mr-4 cursor-pointer transition-transform hover:scale-110`}>
                                  {isPast && (
                                    <CheckIcon className="h-4 w-4 text-[#213f5b]" />
                                  )}
                                  {isCurrent && (
                                    <div className="h-2 w-2 bg-white rounded-full"></div>
                                  )}
                                  {isFuture && (
                                    <span className="text-xs font-medium text-gray-500">{step.id}</span>
                                  )}
                                </div>
                                
                                {/* Content card */}
                                <div className={`flex-grow ${bgColor} rounded-lg border ${isPast ? "border-[#d2fcb2]" : isCurrent ? "border-[#bfddf9]" : "border-gray-200"} p-4 cursor-pointer transition-all duration-200 hover:shadow-md`}>
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className={`text-base font-medium ${textColor}`}>{step.name}</h4>
                                      <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {formatDate(step.date, true)}
                                    </span>
                                  </div>
                                  
                                  {/* Expanded content - shown only when step is active */}
                                  <AnimatePresence>
                                    {activeStep === step.id && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-4 pt-4 border-t border-gray-200 overflow-hidden"
                                      >
                                        <p className="text-sm text-gray-600">
                                          {isPast 
                                            ? "Cette étape a été complétée avec succès." 
                                            : isCurrent 
                                              ? "Cette étape est actuellement en cours." 
                                              : `Cette étape est prévue pour le ${formatDate(step.date)}.`
                                          }
                                        </p>
                                        {isCurrent && (
                                          <button 
                                            className="mt-3 bg-[#213f5b] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#213f5b]/90 transition-colors"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              alert(`Détails supplémentaires pour l'étape: ${step.name}`);
                                            }}
                                          >
                                            Voir les détails
                                          </button>
                                        )}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Calendar Tab */}
                {activeTab === "timeline" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="bg-[#213f5b]/5 rounded-lg p-5">
                      <h3 className="text-lg font-semibold text-[#213f5b] mb-4">Calendrier d&apos;installation</h3>
                      
                      {/* Calendar View Controls */}
                      {renderCalendarViewSelector()}
                      
                      {/* Calendar Header */}
                      {renderCalendarHeader()}
                      
                      {/* Calendar Content based on view */}
                      {calendarView === 'day' && renderDayView()}
                      {calendarView === 'week' && renderWeekView()}
                      {calendarView === 'month' && renderMonthView()}
                      
                      {/* Installation legend */}
                      <div className="mt-6 flex items-center space-x-6">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-[#bfddf9]/80 mr-2"></div>
                          <span className="text-sm text-gray-600">À venir</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-[#d2fcb2]/80 mr-2"></div>
                          <span className="text-sm text-gray-600">Complété</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-[#213f5b] mr-2"></div>
                          <span className="text-sm text-gray-600">Aujourd&apos;hui</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Messages Tab */}
                {activeTab === "messages" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="bg-[#213f5b]/5 rounded-lg p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-[#213f5b]">Communications</h3>
                        <button 
                          onClick={() => setShowMessageModal(true)}
                          className="flex items-center text-sm text-[#213f5b] hover:text-[#213f5b]/80 py-1 px-3 bg-white rounded-lg border border-[#bfddf9]/30 hover:bg-[#bfddf9]/10 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                          </svg>
                          Nouveau message
                        </button>
                      </div>

                      <div className="space-y-4">
                        {installationData.communications.map((comm) => (
                          <div 
                            key={comm.id} 
                            className={`bg-white rounded-lg p-4 border ${comm.read ? "border-gray-100" : "border-[#bfddf9]"} ${!comm.read ? "shadow-md" : ""}`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center">
                                <div className={`h-8 w-8 rounded-full mr-3 flex items-center justify-center ${
                                  comm.from === "technician" 
                                    ? "bg-[#213f5b] text-white"
                                    : "bg-[#bfddf9] text-[#213f5b]"
                                }`}>
                                  {comm.from === "technician" ? (
                                    <UserIcon className="h-4 w-4" />
                                  ) : (
                                    <BuildingOfficeIcon className="h-4 w-4" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-[#213f5b]">
                                    {comm.from === "technician" ? "Technicien" : "Support Client"}
                                  </h4>
                                  <p className="text-xs text-gray-500">
                                    {formatDate(comm.date)}
                                  </p>
                                </div>
                              </div>
                              {!comm.read && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#bfddf9] text-[#213f5b]">
                                  Nouveau
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 ml-11">
                              {comm.content}
                            </p>
                            <div className="mt-3 ml-11">
                              <button 
                                className="text-xs text-[#213f5b] hover:text-[#213f5b]/80"
                                onClick={() => setShowMessageModal(true)}
                              >
                                Répondre
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width on desktop */}
          <div className="space-y-6">
            {/* Weather Forecast Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bfddf9]/20"
            >
              <div className="p-5">
                <h3 className="text-lg font-semibold text-[#213f5b] mb-3">Météo pour l&apos;installation</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {format(parseISO(installationData.weatherForecast.date), "EEEE d MMMM", { locale: fr })}
                    </p>
                    <div className="flex items-center">
                      <span className="text-3xl font-semibold text-[#213f5b]">{installationData.weatherForecast.temperature}°</span>
                      <span className="ml-2 text-sm text-gray-500">Ressenti 16°</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    {getWeatherIcon(installationData.weatherForecast.condition)}
                    <span className="text-sm text-gray-600 mt-1 capitalize">
                      {installationData.weatherForecast.condition === "partly_cloudy" ? "Partiellement nuageux" : 
                       installationData.weatherForecast.condition === "sunny" ? "Ensoleillé" :
                       installationData.weatherForecast.condition === "cloudy" ? "Nuageux" :
                       installationData.weatherForecast.condition === "rainy" ? "Pluvieux" : "Orageux"}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-[#f8faff] rounded-lg p-3 flex items-center">
                    <CloudIcon className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Précipitations</p>
                      <p className="text-sm font-medium text-[#213f5b]">{installationData.weatherForecast.precipitationProbability}%</p>
                    </div>
                  </div>
                  <div className="bg-[#f8faff] rounded-lg p-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Vent</p>
                      <p className="text-sm font-medium text-[#213f5b]">{installationData.weatherForecast.windSpeed} km/h</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm">
                  <p className={`${
                    installationData.weatherForecast.condition === "rainy" || installationData.weatherForecast.condition === "stormy"
                      ? "text-orange-500"
                      : "text-green-500"
                  }`}>
                    {installationData.weatherForecast.condition === "rainy" || installationData.weatherForecast.condition === "stormy"
                      ? "⚠️ La météo pourrait affecter l'installation. Notre équipe vous contactera en cas de report."
                      : "✓ Les conditions météo sont favorables pour l'installation."}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bfddf9]/20"
            >
              <div className="p-5">
                <h3 className="text-lg font-semibold text-[#213f5b] mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 bg-[#213f5b] text-white rounded-lg hover:bg-[#213f5b]/90 transition-colors">
                    <span className="flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-3" />
                      Modifier la date d&apos;installation
                    </span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-white text-[#213f5b] border border-[#bfddf9] rounded-lg hover:bg-[#bfddf9]/10 transition-colors">
                    <span className="flex items-center">
                      <PhoneIcon className="h-5 w-5 mr-3" />
                      Contacter le support
                    </span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-white text-[#213f5b] border border-[#bfddf9] rounded-lg hover:bg-[#bfddf9]/10 transition-colors">
                    <span className="flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-3" />
                      Guide de préparation
                    </span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* FAQ Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bfddf9]/20"
            >
              <div className="p-5">
                <h3 className="text-lg font-semibold text-[#213f5b] mb-4">Questions fréquentes</h3>
                <div className="space-y-3">
                  <div className="border border-gray-100 rounded-lg p-3 hover:border-[#bfddf9]/40 hover:bg-[#f8faff] transition-colors cursor-pointer">
                    <h4 className="text-sm font-medium text-[#213f5b]">Combien de temps dure l&apos;installation ?</h4>
                    <p className="text-xs text-gray-500 mt-1">L&apos;installation d&apos;une pompe à chaleur prend généralement 1 à 2 jours selon la complexité.</p>
                  </div>
                  <div className="border border-gray-100 rounded-lg p-3 hover:border-[#bfddf9]/40 hover:bg-[#f8faff] transition-colors cursor-pointer">
                    <h4 className="text-sm font-medium text-[#213f5b]">Dois-je être présent pendant l&apos;installation ?</h4>
                    <p className="text-xs text-gray-500 mt-1">Votre présence est recommandée au début et à la fin de l&apos;installation.</p>
                  </div>
                  <div className="border border-gray-100 rounded-lg p-3 hover:border-[#bfddf9]/40 hover:bg-[#f8faff] transition-colors cursor-pointer">
                    <h4 className="text-sm font-medium text-[#213f5b]">Que faire en cas de mauvais temps ?</h4>
                    <p className="text-xs text-gray-500 mt-1">En cas de conditions météo défavorables, notre équipe vous contactera pour reprogrammer si nécessaire.</p>
                  </div>
                </div>
                <button className="w-full mt-4 text-sm text-[#213f5b] hover:text-[#213f5b]/80 flex items-center justify-center">
                  <span>Voir toutes les questions</span>
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      </div>

      {/* Send Message Modal */}
      <AnimatePresence>
        {showMessageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" onClick={() => setShowMessageModal(false)}></div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-xl shadow-xl p-6 z-10"
            >
              <h3 className="text-lg font-semibold text-[#213f5b] mb-4">Envoyer un message</h3>
              <div className="mb-4">
                <label htmlFor="messageType" className="block text-sm font-medium text-gray-700 mb-1">
                  Destinataire
                </label>
                <select
                  id="messageType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#bfddf9] focus:border-transparent"
                >
                  <option value="technician">Technicien</option>
                  <option value="support">Support Client</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="messageContent" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="messageContent"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#bfddf9] focus:border-transparent"
                  placeholder="Écrivez votre message ici..."
                ></textarea>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    alert("Message envoyé avec succès!");
                    setMessage("");
                    setShowMessageModal(false);
                  }}
                  className="px-4 py-2 bg-[#213f5b] text-white rounded-lg hover:bg-[#213f5b]/90 transition-colors"
                  disabled={!message.trim()}
                >
                  Envoyer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
