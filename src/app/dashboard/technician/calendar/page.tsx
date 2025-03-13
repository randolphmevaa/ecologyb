"use client";

import { useState, useEffect, useRef, JSX } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  PlusIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  StarIcon,
  // ArrowLeftIcon,
  // ArrowRightIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon as ClockIconSolid,
  ExclamationCircleIcon,
  PhoneIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  ArrowPathIcon,
  PencilIcon,
  CameraIcon,
  DocumentCheckIcon,
  ChatBubbleLeftIcon,
  AdjustmentsHorizontalIcon,
  CreditCardIcon,
  MoonIcon,
  SunIcon,
  // BuildingOfficeIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  // WifiIcon,
  IdentificationIcon,
  CursorArrowRaysIcon,
} from "@heroicons/react/24/outline";
import React from "react";

// Define event interface with extended fields for technicians
interface CalendarEvent {
  id: number;
  date: string;
  title: string;
  solution: string;
  type: string;
  location: string;
  time: string;
  duration: string; // Duration of the job
  travelTime: string; // Travel time to location
  technicianName: string;
  status: "completed" | "scheduled" | "pending" | "in-progress" | "cancelled";
  priority: "normal" | "high" | "urgent";
  customer: {
    name: string;
    phone: string;
    email: string;
    history?: string;
    preferredContactMethod?: "phone" | "email" | "sms";
  };
  notes?: string;
  requiredTools?: string[];
  requiredParts?: { name: string; quantity: number; available: boolean }[];
  parkingInfo?: string;
  accessInfo?: string;
  previousVisits?: number;
  techDocs?: { name: string; url: string }[];
  checklist?: { task: string; completed: boolean }[];
  photos?: { id: number; name: string; url: string }[];
  signatureRequired: boolean;
  signatureCollected?: boolean;
  collectPayment?: boolean;
  paymentCollected?: boolean;
  paymentAmount?: number;
  teamMembers?: string[];
}

// Sample extended events data for technician tasks/interventions
const events: CalendarEvent[] = [
  {
    id: 1,
    date: "2025-03-08",
    title: "Installation - Pompe à chaleur - Résidence Dupont",
    solution: "Pompes a chaleur",
    type: "installation",
    location: "12 Rue des Lilas, 75020 Paris",
    time: "09:00 - 12:00",
    duration: "3h",
    travelTime: "30min",
    technicianName: "Jean Martin",
    status: "scheduled",
    priority: "normal",
    customer: {
      name: "Famille Dupont",
      phone: "06 12 34 56 78",
      email: "dupont@email.com",
      preferredContactMethod: "phone",
      history: "Premier achat. Besoin d'installation rapide suite à panne de chauffage"
    },
    requiredTools: ["Multimètre", "Perceuse", "Niveau", "Jeu de tournevis"],
    requiredParts: [
      { name: "Pompe à chaleur Air/Eau 8kW", quantity: 1, available: true },
      { name: "Kit de fixation murale", quantity: 1, available: true },
      { name: "Tuyau d'évacuation 2m", quantity: 2, available: true }
    ],
    parkingInfo: "Parking visiteur disponible devant la résidence",
    accessInfo: "Code bâtiment 4567B, 2ème étage",
    notes: "Client souhaite installation discrète, minimaliser bruit extérieur",
    signatureRequired: true,
    techDocs: [
      { name: "Manuel d'installation PAC8000", url: "/docs/pac8000.pdf" },
      { name: "Schéma raccordement électrique", url: "/docs/schema_pac.pdf" }
    ],
    checklist: [
      { task: "Vérifier emplacement installation", completed: false },
      { task: "Installer support mural", completed: false },
      { task: "Raccorder système électrique", completed: false },
      { task: "Tester fonctionnement", completed: false },
      { task: "Expliquer utilisation au client", completed: false }
    ]
  },
  {
    id: 2,
    date: "2025-03-12",
    title: "Maintenance - Chauffe-eau solaire individuel - Immeuble Martin",
    solution: "Chauffe-eau solaire individuel",
    type: "maintenance",
    location: "45 Avenue Victor Hugo, 75016 Paris",
    time: "14:00 - 16:00",
    duration: "2h",
    travelTime: "25min",
    technicianName: "Sophie Dubois",
    status: "pending",
    priority: "high",
    customer: {
      name: "Famille Martin",
      phone: "06 98 76 54 32",
      email: "martin@email.com",
      preferredContactMethod: "email",
      history: "Client fidèle depuis 3 ans, maintenance annuelle"
    },
    requiredTools: ["Kit de maintenance solaire", "Détecteur de fuites", "Multimètre"],
    requiredParts: [
      { name: "Liquide caloporteur", quantity: 1, available: true },
      { name: "Joints d'étanchéité", quantity: 4, available: true }
    ],
    parkingInfo: "Stationnement difficile, parking payant à 200m",
    previousVisits: 3,
    notes: "Client a signalé baisse de performance récente",
    signatureRequired: true,
    checklist: [
      { task: "Vérifier état du panneau solaire", completed: false },
      { task: "Contrôler pression du circuit", completed: false },
      { task: "Remplacer liquide caloporteur", completed: false },
      { task: "Tester performances", completed: false }
    ],
    collectPayment: true,
    paymentAmount: 180
  },
  {
    id: 3,
    date: "2025-03-15",
    title: "Révision - Chauffe-eau thermodynamique - Complexe Belle Vue",
    solution: "Chauffe-eau thermodynamique",
    type: "révision",
    location: "8 Boulevard Saint-Michel, 75005 Paris",
    time: "10:30 - 12:30",
    duration: "2h",
    travelTime: "40min",
    technicianName: "Thomas Bernard",
    status: "completed",
    priority: "normal",
    customer: {
      name: "Copropriété Belle Vue",
      phone: "01 23 45 67 89",
      email: "syndic@bellevue.fr",
      preferredContactMethod: "email"
    },
    requiredTools: ["Kit d'outils standard", "Analyseur de performance"],
    photos: [
      { id: 1, name: "Avant intervention", url: "/photos/bellevue_avant.jpg" },
      { id: 2, name: "Après intervention", url: "/photos/bellevue_apres.jpg" }
    ],
    signatureRequired: true,
    signatureCollected: true,
    notes: "Accueil par le gardien, M. Robert"
  },
  {
    id: 4,
    date: "2025-03-20",
    title: "Intervention - Système Solaire Combiné - Résidence Soleil",
    solution: "Système Solaire Combiné",
    type: "intervention",
    location: "27 Rue de la Paix, 75002 Paris",
    time: "15:00 - 17:30",
    duration: "2h30",
    travelTime: "35min",
    technicianName: "Marie Lambert",
    status: "scheduled",
    priority: "urgent",
    customer: {
      name: "Résidence Soleil",
      phone: "01 87 65 43 21",
      email: "contact@residence-soleil.fr",
      preferredContactMethod: "phone"
    },
    requiredTools: ["Kit d'urgence solaire", "Testeur de pression", "Multimètre"],
    requiredParts: [
      { name: "Vanne de régulation", quantity: 1, available: true },
      { name: "Fluide antigel", quantity: 2, available: false }
    ],
    teamMembers: ["Marie Lambert", "Alexandre Petit"],
    notes: "Fuite détectée, intervention urgente requise",
    signatureRequired: true,
    accessInfo: "Contacter gardien à l'arrivée"
  },
  {
    id: 5,
    date: "2025-03-12",
    title: "Réparation - Panneaux Solaires - Villa Beausoleil",
    solution: "Panneaux Solaires",
    type: "intervention",
    location: "3 Rue du Soleil, 75011 Paris",
    time: "08:00 - 10:00",
    duration: "2h",
    travelTime: "20min",
    technicianName: "Pierre Durand",
    status: "scheduled",
    priority: "high",
    customer: {
      name: "M. Beausoleil",
      phone: "06 11 22 33 44",
      email: "beausoleil@email.com",
      preferredContactMethod: "sms"
    },
    requiredTools: ["Échelle", "Kit de réparation solaire", "Équipement de sécurité toiture"],
    accessInfo: "Propriétaire présent, accès par le jardin arrière",
    techDocs: [
      { name: "Schéma d'installation", url: "/docs/schema_panneaux.pdf" }
    ],
    signatureRequired: true
  },
  {
    id: 6,
    date: "2025-03-10",
    title: "Diagnostic - Système de Ventilation - Bureau Moderne",
    solution: "Système de Ventilation",
    type: "maintenance",
    location: "18 Avenue de l'Innovation, 75013 Paris",
    time: "11:00 - 12:30",
    duration: "1h30",
    travelTime: "15min",
    technicianName: "Sophie Dubois",
    status: "completed",
    priority: "normal",
    customer: {
      name: "Entreprise Moderne",
      phone: "01 98 76 54 32",
      email: "contact@entreprise-moderne.com",
      preferredContactMethod: "email"
    },
    requiredTools: ["Anémomètre", "Caméra thermique"],
    photos: [
      { id: 1, name: "VMC Centrale", url: "/photos/vmc_centrale.jpg" },
      { id: 2, name: "Conduits", url: "/photos/conduits.jpg" }
    ],
    signatureRequired: true,
    signatureCollected: true,
    notes: "Accès entre 9h et 17h uniquement, jours ouvrés"
  },
  {
    id: 7,
    date: "2025-03-13",
    title: "Installation - Bornes de Recharge - Parking Central",
    solution: "Bornes de Recharge",
    type: "installation",
    location: "65 Rue de la République, 75001 Paris",
    time: "13:30 - 17:00",
    duration: "3h30",
    travelTime: "30min",
    technicianName: "Jean Martin",
    status: "pending",
    priority: "normal",
    customer: {
      name: "Parking Central SARL",
      phone: "01 12 23 34 45",
      email: "direction@parking-central.fr",
      preferredContactMethod: "phone"
    },
    requiredTools: ["Perceuse industrielle", "Niveau laser", "Multimètre", "Testeur de charge"],
    requiredParts: [
      { name: "Borne de recharge 22kW", quantity: 2, available: true },
      { name: "Câbles spéciaux 10m", quantity: 2, available: true },
      { name: "Panneau signalétique", quantity: 2, available: true }
    ],
    teamMembers: ["Jean Martin", "Thomas Bernard"],
    techDocs: [
      { name: "Plans électriques du parking", url: "/docs/plan_electrique.pdf" },
      { name: "Manuel d'installation", url: "/docs/manuel_bornes.pdf" }
    ],
    checklist: [
      { task: "Vérifier emplacement installation", completed: false },
      { task: "Préparer passages de câbles", completed: false },
      { task: "Installer bornes", completed: false },
      { task: "Connecter au réseau électrique", completed: false },
      { task: "Tester fonctionnement", completed: false },
      { task: "Installer signalétique", completed: false }
    ],
    signatureRequired: true,
    notes: "Installation dans parking souterrain, prévoir éclairage"
  },
  // Add a few more events on different days to better demonstrate the calendar
  {
    id: 8,
    date: "2025-03-18",
    title: "Entretien - Système de Climatisation - Hôtel Luxe",
    solution: "Climatisation industrielle",
    type: "maintenance",
    location: "42 Avenue des Champs-Élysées, 75008 Paris",
    time: "09:00 - 11:30",
    duration: "2h30",
    travelTime: "45min",
    technicianName: "Alexandre Petit",
    status: "scheduled",
    priority: "normal",
    customer: {
      name: "Hôtel Luxe",
      phone: "01 55 66 77 88",
      email: "technique@hotel-luxe.com",
      preferredContactMethod: "email"
    },
    requiredTools: ["Kit d'entretien climatisation", "Détecteur de fuites"],
    notes: "Maintenance préventive avant saison estivale",
    signatureRequired: true
  },
  {
    id: 9,
    date: "2025-03-19",
    title: "Installation - Système domotique - Maison intelligente",
    solution: "Domotique résidentielle",
    type: "installation",
    location: "33 Rue de l'Avenir, 75020 Paris",
    time: "14:00 - 18:00",
    duration: "4h",
    travelTime: "25min",
    technicianName: "Marie Lambert",
    status: "scheduled",
    priority: "high",
    customer: {
      name: "M. et Mme Futur",
      phone: "06 99 88 77 66",
      email: "futur@email.com",
      preferredContactMethod: "phone"
    },
    requiredTools: ["Kit d'installation domotique", "Testeur réseau", "Perceuse"],
    requiredParts: [
      { name: "Centrale domotique", quantity: 1, available: true },
      { name: "Capteurs multi-usages", quantity: 8, available: true },
      { name: "Actionneurs", quantity: 5, available: true }
    ],
    signatureRequired: true,
    notes: "Clients très intéressés par les explications techniques"
  },
  {
    id: 10,
    date: "2025-03-21",
    title: "Inspection - Panneaux photovoltaïques - Ferme agricole",
    solution: "Panneaux photovoltaïques",
    type: "maintenance",
    location: "120 Route des Champs, 77000 Melun",
    time: "10:00 - 12:00",
    duration: "2h",
    travelTime: "1h15",
    technicianName: "Pierre Durand",
    status: "scheduled",
    priority: "normal",
    customer: {
      name: "EARL des Champs",
      phone: "06 22 33 44 55",
      email: "contact@earl-champs.fr",
      preferredContactMethod: "phone"
    },
    requiredTools: ["Drone d'inspection", "Caméra thermique"],
    signatureRequired: true,
    notes: "Installation sur hangar agricole, prévoir véhicule adapté aux chemins"
  }
];

// Helper function to generate an array of dates (or null for blank cells)
// for the given year and month.
function getCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1).getDay(); // Sunday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = [];

  // Adjust for Monday as first day of week (European calendar)
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

  // Fill in blank cells before the first day of the month.
  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarDays.push(null);
  }

  // Add each day of the month.
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  // Pad the end of the grid to complete the final week.
  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }

  return calendarDays;
}

// Helper function to get an array of dates for the current week
function getWeekDays(date: Date): Date[] {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
  const monday = new Date(date.setDate(diff));
  const weekDays = [];
  
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(monday);
    currentDay.setDate(monday.getDate() + i);
    weekDays.push(currentDay);
  }
  
  return weekDays;
}

// Get hours array for day view
function getHoursArray(): string[] {
  const hours = [];
  for (let i = 6; i <= 20; i++) {
    hours.push(`${i.toString().padStart(2, '0')}:00`);
  }
  return hours;
}

// Get status color based on event status
function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
      return "bg-green-500";
    case "scheduled":
      return "bg-blue-500";
    case "pending":
      return "bg-yellow-500";
    case "in-progress":
      return "bg-purple-500";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

// Get status icon based on event status
function getStatusIcon(status: string): JSX.Element {
  switch (status) {
    case "completed":
      return <CheckCircleIcon className="h-4 w-4" />;
    case "scheduled":
      return <CalendarIcon className="h-4 w-4" />;
    case "pending":
      return <ExclamationCircleIcon className="h-4 w-4" />;
    case "in-progress":
      return <ArrowPathIcon className="h-4 w-4" />;
    case "cancelled":
      return <ExclamationTriangleIcon className="h-4 w-4" />;
    default:
      return <ClockIconSolid className="h-4 w-4" />;
  }
}

// Get priority badge
function getPriorityBadge(priority: string): JSX.Element {
  switch (priority) {
    case "urgent":
      return (
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full border border-red-400 flex items-center">
          <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
          Urgent
        </span>
      );
    case "high":
      return (
        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded-full border border-orange-400 flex items-center">
          <ArrowPathIcon className="h-3 w-3 mr-1" />
          Prioritaire
        </span>
      );
    default:
      return (
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full border border-blue-400 flex items-center">
          <CalendarIcon className="h-3 w-3 mr-1" />
          Normal
        </span>
      );
  }
}

// Get event color based on event type
function getEventColor(type: string): string {
  switch (type) {
    case "installation":
      return "bg-blue-100 border-l-4 border-blue-600 text-blue-800";
    case "maintenance":
      return "bg-green-100 border-l-4 border-green-600 text-green-800";
    case "révision":
      return "bg-purple-100 border-l-4 border-purple-600 text-purple-800";
    case "intervention":
      return "bg-yellow-100 border-l-4 border-yellow-600 text-yellow-800";
    default:
      return "bg-gray-100 border-l-4 border-gray-600 text-gray-800";
  }
}

// Get event gradient for event detail
function getEventGradient(type: string): string {
  switch (type) {
    case "installation":
      return "bg-gradient-to-r from-blue-600 to-blue-500";
    case "maintenance":
      return "bg-gradient-to-r from-green-600 to-green-500";
    case "révision":
      return "bg-gradient-to-r from-purple-600 to-purple-500";
    case "intervention":
      return "bg-gradient-to-r from-yellow-600 to-yellow-500";
    default:
      return "bg-gradient-to-r from-gray-600 to-gray-500";
  }
}

// Parse time string to get hour and minutes (e.g., "09:00 - 12:00" => { start: 9, end: 12 })
function parseTimeString(timeString: string): { start: number; end: number } {
  const [startTime, endTime] = timeString.split(" - ");
  const startHour = parseInt(startTime.split(":")[0]);
  const endHour = parseInt(endTime.split(":")[0]);
  return { start: startHour, end: endHour };
}

// Group events by location proximity (simplified demo)
function groupEventsByProximity(events: CalendarEvent[]): Record<string, CalendarEvent[]> {
  const districts: Record<string, CalendarEvent[]> = {};
  
  events.forEach(event => {
    // Extract district from Paris address (simplified)
    const match = event.location.match(/Paris/);
    if (match) {
      const district = event.location.substring(event.location.length - 10, event.location.length).trim();
      if (!districts[district]) {
        districts[district] = [];
      }
      districts[district].push(event);
    } else {
      if (!districts["Hors Paris"]) {
        districts["Hors Paris"] = [];
      }
      districts["Hors Paris"].push(event);
    }
  });
  
  return districts;
}

export default function TechnicianCalendarDashboard() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0-indexed
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [calendarView, setCalendarView] = useState<"day" | "week" | "month" | "list" | "map">("day");
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>(events);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showRoutePlanner, setShowRoutePlanner] = useState<boolean>(false);
  const [checklistEdit, setChecklistEdit] = useState<{ [key: string]: boolean }>({});
  const mapRef = useRef<HTMLDivElement>(null);

  // Current week days
  const weekDays = getWeekDays(currentDate);
  
  // Generate the calendar days for the current month
  const calendarDays = getCalendarDays(currentYear, currentMonth);
  
  // Get hours for day view
  const hours = getHoursArray();

  // Filter events whenever search query or filters change
  useEffect(() => {
    let filtered = events;
    
    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.solution.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query) ||
          event.technicianName.toLowerCase().includes(query) ||
          (event.customer?.name?.toLowerCase().includes(query))
      );
    }
    
    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((event) => event.type === filterType);
    }
    
    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((event) => event.status === filterStatus);
    }
    
    setFilteredEvents(filtered);
  }, [searchQuery, filterType, filterStatus]);

  // Load map with grouped events
  useEffect(() => {
    if (calendarView === "map" && mapRef.current) {
      // This would be where you'd initialize a real map with the events
      console.log("Map view initialized");
    }
  }, [calendarView, filteredEvents]);

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Filter events for the currently viewed month
  const eventsThisMonth = filteredEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === currentYear &&
      eventDate.getMonth() === currentMonth
    );
  });

  // Filter events for the currently viewed week
  // const eventsThisWeek = filteredEvents.filter((event) => {
  //   const eventDate = new Date(event.date);
  //   return weekDays.some(
  //     (day) =>
  //       day.getDate() === eventDate.getDate() &&
  //       day.getMonth() === eventDate.getMonth() &&
  //       day.getFullYear() === eventDate.getFullYear()
  //   );
  // });

  // Filter events for the currently viewed day
  const eventsThisDay = filteredEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === currentDate.getDate() &&
      eventDate.getMonth() === currentDate.getMonth() &&
      eventDate.getFullYear() === currentDate.getFullYear()
    );
  });

  // Get today's events
  const todaysEvents = filteredEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    );
  });

  // Handlers to navigate between months, weeks, or days
  const goToPrevious = () => {
    if (calendarView === "day") {
      const prevDay = new Date(currentDate);
      prevDay.setDate(prevDay.getDate() - 1);
      setCurrentDate(prevDay);
      setCurrentMonth(prevDay.getMonth());
      setCurrentYear(prevDay.getFullYear());
    } else if (calendarView === "week") {
      const prevWeek = new Date(currentDate);
      prevWeek.setDate(prevWeek.getDate() - 7);
      setCurrentDate(prevWeek);
      setCurrentMonth(prevWeek.getMonth());
      setCurrentYear(prevWeek.getFullYear());
    } else {
      let newMonth = currentMonth - 1;
      let newYear = currentYear;
      if (newMonth < 0) {
        newMonth = 11;
        newYear = currentYear - 1;
      }
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
      // Update current date to the first day of the new month
      setCurrentDate(new Date(newYear, newMonth, 1));
    }
  };

  const goToNext = () => {
    if (calendarView === "day") {
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setCurrentDate(nextDay);
      setCurrentMonth(nextDay.getMonth());
      setCurrentYear(nextDay.getFullYear());
    } else if (calendarView === "week") {
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      setCurrentDate(nextWeek);
      setCurrentMonth(nextWeek.getMonth());
      setCurrentYear(nextWeek.getFullYear());
    } else {
      let newMonth = currentMonth + 1;
      let newYear = currentYear;
      if (newMonth > 11) {
        newMonth = 0;
        newYear = currentYear + 1;
      }
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
      // Update current date to the first day of the new month
      setCurrentDate(new Date(newYear, newMonth, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const openEventDetails = (event: CalendarEvent) => {
    setSelectedEvent(event);
    // Initialize checklist edit state
    if (event.checklist) {
      const initialState: { [key: string]: boolean } = {};
      event.checklist.forEach((item, index) => {
        initialState[`${event.id}-${index}`] = item.completed;
      });
      setChecklistEdit(initialState);
    }
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  // Toggle checklist item
  const toggleChecklistItem = (eventId: number, index: number) => {
    setChecklistEdit(prev => ({
      ...prev,
      [`${eventId}-${index}`]: !prev[`${eventId}-${index}`]
    }));
  };

  // Helper to check if a date is today
  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Helper to get events for a specific day
  const getEventsForDay = (date: Date | null) => {
    if (!date) return [];
    return filteredEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Calculate total travel time for a day
  const calculateDayTravelTime = (events: CalendarEvent[]): string => {
    if (events.length === 0) return "0min";
    
    let totalMinutes = 0;
    events.forEach(event => {
      const timeMatch = event.travelTime.match(/(\d+)(h|min)/);
      if (timeMatch) {
        if (timeMatch[2] === 'h') {
          totalMinutes += parseInt(timeMatch[1]) * 60;
        } else {
          totalMinutes += parseInt(timeMatch[1]);
        }
      }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return hours > 0 
      ? `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`
      : `${minutes}min`;
  };
  
  // Calculate total work time for a day
  const calculateDayWorkTime = (events: CalendarEvent[]): string => {
    if (events.length === 0) return "0h";
    
    let totalMinutes = 0;
    events.forEach(event => {
      const timeMatch = event.duration.match(/(\d+)(h|min)/);
      if (timeMatch) {
        if (timeMatch[2] === 'h') {
          totalMinutes += parseInt(timeMatch[1]) * 60;
        } else {
          totalMinutes += parseInt(timeMatch[1]);
        }
      }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return hours > 0 
      ? `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`
      : `${minutes}min`;
  };

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Common Header */}
      <Header />
      <main className="flex-1 overflow-y-auto">
        {/* Main container with Calendar Navigation and Calendar */}
      <div className="flex flex-col">
        {/* Navigation Header */}
        <div className={`${darkMode ? "bg-gradient-to-r from-gray-900 to-gray-800" : "bg-gradient-to-r from-[#1a365d] to-[#0f2942]"} p-7 text-white`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-white/15 rounded-2xl backdrop-blur-md flex items-center justify-center">
                <WrenchScrewdriverIcon className="h-8 w-8 text-[#e2ffc2]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Calendrier Technicien</h2>
                <p className="text-white/90 font-medium mt-1.5">
                  Planifiez vos installations, maintenances et interventions efficacement
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <StarIcon className="h-4 w-4 text-white/60" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher intervention, client..."
                  className="w-full text-sm border-none bg-white/15 hover:bg-white/20 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-white placeholder-white/60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                className="flex-shrink-0 p-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
                onClick={() => setDarkMode(!darkMode)}
                aria-label={darkMode ? "Mode clair" : "Mode sombre"}
              >
                {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>
              <button 
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#e2ffc2] to-[#c5f7a5] hover:opacity-90 text-[#1a365d] rounded-xl text-sm font-semibold transition-colors"
                onClick={() => setShowRoutePlanner(!showRoutePlanner)}
              >
                {showRoutePlanner ? (
                  <>
                    <CalendarIcon className="h-4 w-4" />
                    <span>Voir calendrier</span>
                  </>
                ) : (
                  <>
                    <TruckIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Optimiser ma tournée</span>
                    <span className="sm:hidden">Tournée</span>
                  </>
                )}
              </button>
              <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#e2ffc2] to-[#c5f7a5] hover:opacity-90 text-[#1a365d] rounded-xl text-sm font-semibold transition-colors">
                <PlusIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Nouvelle intervention</span>
                <span className="sm:hidden">Nouveau</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={goToToday}
                className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-sm font-medium backdrop-blur-md flex items-center gap-2"
              >
                <CalendarDaysIcon className="h-4 w-4" />
                Aujourd&apos;hui
              </button>
              <div className="flex gap-1.5">
                <button
                  onClick={goToPrevious}
                  className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={goToNext}
                  className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
                  aria-label="Next"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
              
              {/* View Selector */}
              <div className="flex bg-white/15 rounded-xl overflow-hidden p-0.5">
                <button
                  onClick={() => setCalendarView("day")}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                    calendarView === "day" ? "bg-white text-[#1a365d]" : "text-white"
                  }`}
                >
                  Jour
                </button>
                <button
                  onClick={() => setCalendarView("week")}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                    calendarView === "week" ? "bg-white text-[#1a365d]" : "text-white"
                  }`}
                >
                  Semaine
                </button>
                <button
                  onClick={() => setCalendarView("month")}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                    calendarView === "month" ? "bg-white text-[#1a365d]" : "text-white"
                  }`}
                >
                  Mois
                </button>
                <button
                  onClick={() => setCalendarView("list")}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                    calendarView === "list" ? "bg-white text-[#1a365d]" : "text-white"
                  }`}
                >
                  Liste
                </button>
                <button
                  onClick={() => setCalendarView("map")}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                    calendarView === "map" ? "bg-white text-[#1a365d]" : "text-white"
                  }`}
                >
                  Carte
                </button>
              </div>
              
              {/* Type and Status Filters */}
              <div className="relative">
                <button 
                  className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-sm font-medium flex items-center gap-1"
                >
                  <AdjustmentsHorizontalIcon className="h-4 w-4" />
                  <span>Filtres</span>
                </button>
                <div className="absolute left-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg z-20 p-3 w-60 text-sm border border-gray-200 dark:border-gray-700 hidden">
                  <div className="mb-2">
                    <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">Type d&apos;intervention</label>
                    <select 
                      className="w-full bg-gray-100 dark:bg-gray-700 rounded p-1.5 text-gray-800 dark:text-white"
                      value={filterType}
                      onChange={e => setFilterType(e.target.value)}
                    >
                      <option value="all">Tous les types</option>
                      <option value="installation">Installation</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="révision">Révision</option>
                      <option value="intervention">Intervention</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">Statut</label>
                    <select 
                      className="w-full bg-gray-100 dark:bg-gray-700 rounded p-1.5 text-gray-800 dark:text-white"
                      value={filterStatus}
                      onChange={e => setFilterStatus(e.target.value)}
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="scheduled">Planifiés</option>
                      <option value="pending">En attente</option>
                      <option value="in-progress">En cours</option>
                      <option value="completed">Terminés</option>
                      <option value="cancelled">Annulés</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white whitespace-nowrap">
              {calendarView === "day" 
                ? formatDate(currentDate)
                : calendarView === "week"
                ? `${weekDays[0].toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} - ${weekDays[6].toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}`
                : calendarView === "list" || calendarView === "map"
                ? "Planification des interventions"
                : new Date(currentYear, currentMonth).toLocaleString("fr-FR", {
                    month: "long",
                    year: "numeric",
                  })}
            </h3>
          </div>
        </div>

        {/* Calendar Component */}
        <div className={`p-4 sm:p-7 pt-5 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
          {/* Quick Access Tech Toolbar */}
          <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 ${darkMode ? "text-white" : ""}`}>
            <motion.div 
              className={`rounded-xl p-4 flex items-center gap-3 ${darkMode ? "bg-gray-800 text-white" : "bg-white"} shadow-sm border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-2.5 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BriefcaseIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>
                  Aujourd&apos;hui
                </p>
                <p className="text-xl font-bold">{todaysEvents.length} interventions</p>
              </div>
            </motion.div>
            
            <motion.div 
              className={`rounded-xl p-4 flex items-center gap-3 ${darkMode ? "bg-gray-800 text-white" : "bg-white"} shadow-sm border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="p-2.5 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>
                  Temps de travail
                </p>
                <p className="text-xl font-bold">{calculateDayWorkTime(todaysEvents)}</p>
              </div>
            </motion.div>
            
            <motion.div 
              className={`rounded-xl p-4 flex items-center gap-3 ${darkMode ? "bg-gray-800 text-white" : "bg-white"} shadow-sm border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="p-2.5 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <TruckIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>
                  Temps de trajet
                </p>
                <p className="text-xl font-bold">{calculateDayTravelTime(todaysEvents)}</p>
              </div>
            </motion.div>
            
            <motion.div 
              className={`rounded-xl p-4 flex items-center gap-3 ${darkMode ? "bg-gray-800 text-white" : "bg-white"} shadow-sm border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="p-2.5 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <DocumentCheckIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>
                  Documents requis
                </p>
                <p className="text-xl font-bold">{todaysEvents.filter(e => e.techDocs && e.techDocs.length > 0).length}</p>
              </div>
            </motion.div>
            
            <motion.div 
              className={`rounded-xl p-4 flex items-center gap-3 ${darkMode ? "bg-gray-800 text-white" : "bg-white"} shadow-sm border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="p-2.5 bg-red-100 dark:bg-red-900 rounded-lg">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>
                  Priorités
                </p>
                <p className="text-xl font-bold">
                  {todaysEvents.filter(e => e.priority === "urgent" || e.priority === "high").length}
                </p>
              </div>
            </motion.div>
          </div>

          {showRoutePlanner ? (
            <motion.div
              className={`rounded-2xl overflow-hidden border ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} shadow-sm`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className={`p-5 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <h3 className="text-lg font-semibold">Optimisation de tournée</h3>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
                  Planifiez votre journée efficacement en optimisant vos déplacements
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 divide-x divide-y lg:divide-y-0 divide-gray-200 dark:divide-gray-700">
                {/* Map container */}
                <div className="col-span-2 h-[500px] bg-gray-100 dark:bg-gray-700 p-4" ref={mapRef}>
                  <div className="h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-lg">
                    <div className="text-center">
                      <MapPinIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
                      <p className="mt-2 font-medium">Carte de vos interventions du jour</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Visualisez et optimisez votre parcours
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Route planner */}
                <div className={`p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                  <h4 className="font-semibold mb-3">Votre itinéraire optimal</h4>
                  
                  <div className="space-y-3 max-h-[400px] overflow-auto pr-2">
                    {todaysEvents.length === 0 ? (
                      <div className={`text-center py-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        <p>Aucune intervention prévue aujourd&apos;hui</p>
                      </div>
                    ) : (
                      todaysEvents.map((event, index) => (
                        <div 
                          key={event.id} 
                          className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} relative`}
                        >
                          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-400 dark:bg-blue-500"></div>
                          
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 relative">
                              <div className="h-7 w-7 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm z-10 relative">
                                {index + 1}
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">{event.time}</p>
                                {getPriorityBadge(event.priority)}
                              </div>
                              
                              <p className="mt-1 font-semibold">{event.title.split(" - ")[0]}</p>
                              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                {event.solution}
                              </p>
                              
                              <div className="flex items-center mt-2 text-sm">
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                <p className="truncate">{event.location}</p>
                              </div>
                              
                              {index < todaysEvents.length - 1 && (
                                <div className={`flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400 ${darkMode ? "bg-gray-800" : "bg-white"} py-1 px-2 rounded`}>
                                  <TruckIcon className="h-3 w-3 mr-1" />
                                  <p>
                                    {index === 0 ? "Départ: " : ""}
                                    {event.travelTime} de trajet
                                    {index === todaysEvents.length - 2 ? " avant retour" : ""}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Distance totale:</span>
                      <span className="font-medium">42 km</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span>Temps de conduite:</span>
                      <span className="font-medium">{calculateDayTravelTime(todaysEvents)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span>Consommation estimée:</span>
                      <span className="font-medium">3.2L</span>
                    </div>
                    
                    <button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 font-medium flex items-center justify-center">
                      <ArrowPathIcon className="h-4 w-4 mr-2" />
                      Lancer la navigation GPS
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className={`rounded-2xl overflow-hidden border ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} shadow-sm`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Day View */}
              {calendarView === "day" && (
                <div className="h-full flex flex-col">
                  <div className={`p-4 border-b ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"} flex justify-between items-center`}>
                    <h3 className="font-semibold">
                      {currentDate.toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {eventsThisDay.length} interventions
                      </span>
                      <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {isToday(currentDate) ? "Aujourd'hui" : ""}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row h-full">
                    {/* Time slots */}
                    <div className="w-full md:w-1/2 border-r border-gray-200 dark:border-gray-700">
                      <div className={`grid grid-cols-[80px_1fr] h-full ${darkMode ? "divide-y divide-gray-700" : "divide-y divide-gray-200"}`}>
                        {hours.map((hour) => (
                          <React.Fragment key={hour}>
                            <div className={`p-2 text-right pr-3 ${darkMode ? "text-gray-400" : "text-gray-500"} text-sm font-medium border-r ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                              {hour}
                            </div>
                            <div className={`p-2 min-h-20 ${darkMode ? "hover:bg-gray-700/40" : "hover:bg-blue-50/20"} transition-colors relative`}>
                              {eventsThisDay.map(event => {
                                const { start, end } = parseTimeString(event.time);
                                const hourNum = parseInt(hour.split(":")[0]);
                                if (hourNum >= start && hourNum < end) {
                                  return (
                                    <motion.div
                                      key={event.id}
                                      className={`absolute left-2 right-2 p-2 rounded-lg shadow-sm cursor-pointer ${getEventColor(event.type)} z-10`}
                                      style={{
                                        top: hourNum === start ? "0" : "",
                                        bottom: hourNum === end - 1 ? "0" : "",
                                        height: (hourNum === start && hourNum === end - 1) ? "calc(100% - 4px)" : "auto"
                                      }}
                                      whileHover={{ scale: 1.02 }}
                                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                      onClick={() => openEventDetails(event)}
                                    >
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="font-medium">{event.time}</p>
                                          <p className="font-bold mt-1">{event.title.split(" - ")[0]}</p>
                                          <p className="text-sm mt-0.5">{event.solution}</p>
                                        </div>
                                        <div className={`p-1.5 rounded-full ${getStatusColor(event.status)} text-white`}>
                                          {getStatusIcon(event.status)}
                                        </div>
                                      </div>
                                      <div className="flex items-center mt-2 text-sm">
                                        <MapPinIcon className="h-4 w-4 mr-1" />
                                        {event.location}
                                      </div>
                                      <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center text-sm">
                                          <UserIcon className="h-4 w-4 mr-1" />
                                          {event.customer?.name}
                                        </div>
                                        {event.priority !== "normal" && getPriorityBadge(event.priority)}
                                      </div>
                                    </motion.div>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    
                    {/* Events for the day */}
                    <div className={`w-full md:w-1/2 p-4 max-h-[calc(100vh-350px)] overflow-y-auto ${darkMode ? "scrollbar-dark" : ""}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Détails des interventions</h4>
                        <div className="flex items-center text-sm">
                          <span className={`mr-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            <span className="font-medium">{calculateDayWorkTime(eventsThisDay)}</span> de travail
                          </span>
                          <span className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            <span className="font-medium">{calculateDayTravelTime(eventsThisDay)}</span> de trajet
                          </span>
                        </div>
                      </div>
                      
                      {eventsThisDay.length === 0 ? (
                        <div className="text-center py-8">
                          <div className={`rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                            <CalendarIcon className={`h-8 w-8 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                          </div>
                          <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>Aucune intervention programmée pour ce jour</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {eventsThisDay.map((event, index) => (
                            <motion.div
                              key={event.id}
                              className={`p-4 rounded-xl shadow-sm cursor-pointer ${darkMode ? "bg-gray-700" : getEventColor(event.type)}`}
                              whileHover={{ scale: 1.01, y: -2 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              onClick={() => openEventDetails(event)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <p className="font-medium text-sm bg-black/10 dark:bg-white/10 rounded-full px-2 py-0.5">
                                      {event.time}
                                    </p>
                                    <p className="text-xs bg-black/10 dark:bg-white/10 rounded-full px-2 py-0.5">
                                      {event.duration}
                                    </p>
                                    {event.teamMembers && event.teamMembers.length > 1 && (
                                      <p className="text-xs bg-black/10 dark:bg-white/10 rounded-full px-2 py-0.5">
                                        Équipe: {event.teamMembers.length}
                                      </p>
                                    )}
                                  </div>
                                  <h5 className="font-semibold mt-2">{event.title}</h5>
                                  
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                                    <div className="flex items-center text-sm">
                                      <DocumentTextIcon className="h-4 w-4 mr-2 opacity-70" />
                                      <span>{event.solution}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                      <MapPinIcon className="h-4 w-4 mr-2 opacity-70" />
                                      <span className="truncate">{event.location}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                      <UserIcon className="h-4 w-4 mr-2 opacity-70" />
                                      <span>{event.customer.name}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                      <PhoneIcon className="h-4 w-4 mr-2 opacity-70" />
                                      <span>{event.customer.phone}</span>
                                    </div>
                                  </div>
                                  
                                  {/* Required tools and parts */}
                                  {(event.requiredTools || event.requiredParts) && (
                                    <div className={`mt-3 p-2 rounded text-xs ${darkMode ? "bg-gray-800" : "bg-white/60"}`}>
                                      {event.requiredTools && (
                                        <p className="mb-1">
                                          <span className="font-semibold">Outils:</span> {event.requiredTools.join(", ")}
                                        </p>
                                      )}
                                      {event.requiredParts && event.requiredParts.length > 0 && (
                                        <p>
                                          <span className="font-semibold">Pièces:</span> {event.requiredParts.map(part => 
                                            `${part.name} (${part.quantity}) ${!part.available ? "⚠️" : ""}`
                                          ).join(", ")}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex flex-col items-end space-y-2">
                                  <div className={`p-1.5 rounded-full ${getStatusColor(event.status)} text-white`}>
                                    {getStatusIcon(event.status)}
                                  </div>
                                  {getPriorityBadge(event.priority)}
                                </div>
                              </div>
                              
                              {/* Notes and special instructions */}
                              {event.notes && (
                                <div className={`mt-3 p-2 rounded text-sm ${darkMode ? "bg-gray-800/70" : "bg-black/5"}`}>
                                  <p className="italic">&quot;{event.notes}&quot;</p>
                                </div>
                              )}
                              
                              {/* Access info */}
                              {event.accessInfo && (
                                <div className="mt-3 flex items-center">
                                  <KeyIcon className="h-4 w-4 mr-2" />
                                  <span className="text-sm font-medium">{event.accessInfo}</span>
                                </div>
                              )}
                              
                              {/* Quick buttons */}
                              <div className="flex items-center justify-end mt-3 space-x-2">
                                <button className="p-1.5 rounded-lg bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20">
                                  <PhoneIcon className="h-4 w-4" />
                                </button>
                                <button className="p-1.5 rounded-lg bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20">
                                  <MapPinIcon className="h-4 w-4" />
                                </button>
                                {event.techDocs && event.techDocs.length > 0 && (
                                  <button className="p-1.5 rounded-lg bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20">
                                    <DocumentArrowDownIcon className="h-4 w-4" />
                                  </button>
                                )}
                                <button className="flex items-center space-x-1 px-2 py-1.5 rounded-lg bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20">
                                  <CursorArrowRaysIcon className="h-4 w-4" />
                                  <span className="text-xs font-medium">Démarrer</span>
                                </button>
                              </div>
                              
                              {/* Travel info for next appointment */}
                              {index < eventsThisDay.length - 1 && (
                                <div className={`mt-4 p-2 rounded ${darkMode ? "bg-gray-600/30" : "bg-blue-50"} flex items-center`}>
                                  <TruckIcon className="h-4 w-4 mr-2" />
                                  <span className="text-sm">
                                    {event.travelTime} de trajet jusqu&apos;à la prochaine intervention
                                  </span>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Week View */}
              {calendarView === "week" && (
                <div className="h-full">
                  {/* Day Headers */}
                  <div className={`grid grid-cols-7 gap-px ${darkMode ? "bg-gray-700" : "bg-gray-50"} border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    {weekDays.map((day, index) => (
                      <div
                        key={index}
                        className={`text-center p-4 ${
                          isToday(day) 
                            ? darkMode 
                              ? "bg-blue-900/30 text-blue-400"
                              : "bg-blue-50 text-blue-600" 
                            : ""
                        }`}
                      >
                        <div className={`text-xs uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {day.toLocaleDateString("fr-FR", { weekday: "short" })}
                        </div>
                        <div className={`mt-1 font-semibold text-lg ${
                          isToday(day) 
                            ? "text-blue-600 dark:text-blue-400" 
                            : darkMode ? "text-white" : "text-gray-800"
                        }`}>
                          {day.getDate()}
                        </div>
                        <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {getEventsForDay(day).length > 0 ? `${getEventsForDay(day).length} RDV` : "Libre"}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Week Events */}
                  <div className={`grid grid-cols-7 gap-px ${darkMode ? "border-gray-700" : "border-gray-200"} h-[calc(100vh-400px)] overflow-y-auto`}>
                    {weekDays.map((day, index) => {
                      const dayEvents = getEventsForDay(day);
                      return (
                        <div
                          key={index}
                          className={`p-1 min-h-48 relative ${
                            isToday(day) 
                              ? darkMode 
                                ? "bg-blue-900/20" 
                                : "bg-blue-50/50" 
                              : darkMode 
                                ? "hover:bg-gray-700/50" 
                                : "hover:bg-gray-50/80"
                          } transition-colors`}
                        >
                          {dayEvents.length > 0 ? (
                            <div className="space-y-1 mt-1">
                              {dayEvents.map((event) => {
                                const { start, end } = parseTimeString(event.time);
                                return (
                                  <motion.div
                                    key={event.id}
                                    className={`p-2 rounded-lg shadow-sm text-xs cursor-pointer relative ${darkMode ? "bg-gray-700" : getEventColor(event.type)}`}
                                    style={{
                                      marginTop: `${(start - 6) * 10}px`,
                                      height: `${(end - start) * 12}px`,
                                      minHeight: "40px",
                                    }}
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    onClick={() => openEventDetails(event)}
                                  >
                                    <div className="flex justify-between">
                                      <span className="font-medium">{event.time}</span>
                                      {event.priority !== "normal" && (
                                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                      )}
                                    </div>
                                    <div className="mt-1 font-medium truncate">
                                      {event.title.split(" - ")[0]}
                                    </div>
                                    <div className="truncate opacity-75">{event.customer?.name}</div>
                                    
                                    {/* Quick info */}
                                    <div className={`absolute bottom-1 right-1 flex space-x-1 ${darkMode ? "" : "text-gray-600"}`}>
                                      {event.requiredTools && event.requiredTools.length > 0 && (
                                        <div className="bg-black/10 dark:bg-white/10 rounded-full p-0.5">
                                          <WrenchScrewdriverIcon className="h-3 w-3" />
                                        </div>
                                      )}
                                      {event.teamMembers && event.teamMembers.length > 1 && (
                                        <div className="bg-black/10 dark:bg-white/10 rounded-full p-0.5">
                                          <UserIcon className="h-3 w-3" />
                                        </div>
                                      )}
                                      {event.signatureRequired && (
                                        <div className="bg-black/10 dark:bg-white/10 rounded-full p-0.5">
                                          <IdentificationIcon className="h-3 w-3" />
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <button className={`p-1.5 rounded-full ${darkMode ? "bg-gray-600/70 text-gray-300 hover:bg-gray-500/90" : "bg-gray-200/70 text-gray-500 hover:bg-gray-300/90"} hover:text-gray-700`}>
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Month View */}
              {calendarView === "month" && (
                <>
                  {/* Day Headers */}
                  <div className={`grid grid-cols-7 gap-2 ${darkMode ? "bg-gray-800" : "bg-gray-50"} border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
                      <div
                        key={day}
                        className={`text-center font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"} p-4 text-sm uppercase tracking-wide`}
                      >
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
                            key={index}
                            className={`min-h-32 border-b border-r ${darkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50/50"}`}
                          ></div>
                        );
                      }

                      // Get events for this day
                      const dayEvents = getEventsForDay(date);

                      return (
                        <div
                          key={index}
                          className={`min-h-32 max-h-48 border-b border-r ${darkMode ? "border-gray-700" : "border-gray-200"} p-2 relative transition-colors ${
                            isToday(date)
                              ? darkMode 
                                ? "bg-blue-900/20 border-l-4 border-blue-500" 
                                : "bg-blue-50/70 border-l-4 border-blue-500"
                              : darkMode 
                                ? "hover:bg-gray-700/50" 
                                : "hover:bg-blue-50/30"
                          } overflow-hidden`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <div
                              className={`text-sm font-medium ${
                                isToday(date)
                                  ? "bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center"
                                  : darkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {date.getDate()}
                            </div>
                            {dayEvents.length > 0 && (
                              <div className={`text-xs ${darkMode ? "text-gray-400 bg-gray-700" : "text-gray-500 bg-gray-100"} font-medium px-1.5 py-0.5 rounded`}>
                                {dayEvents.length}
                              </div>
                            )}
                          </div>
                          
                          {dayEvents.length > 0 && (
                            <div className="mt-1 space-y-1">
                              {dayEvents.slice(0, 3).map((event) => (
                                <motion.div
                                  key={event.id}
                                  className={`p-1.5 rounded-lg shadow-sm cursor-pointer text-xs ${darkMode ? "bg-gray-700" : getEventColor(event.type)}`}
                                  whileHover={{ scale: 1.03, y: -1 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                  onClick={() => openEventDetails(event)}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium truncate">
                                      {event.title.split(" - ")[0]}
                                    </span>
                                    <div
                                      className={`h-2 w-2 rounded-full ${getStatusColor(
                                        event.status
                                      )}`}
                                    ></div>
                                  </div>
                                  <div className="mt-0.5 flex justify-between items-center">
                                    <span className="truncate opacity-90 text-xs">
                                      {event.time}
                                    </span>
                                    {event.priority !== "normal" && (
                                      <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                              {dayEvents.length > 3 && (
                                <div 
                                  className={`text-xs text-center p-1 ${
                                    darkMode 
                                      ? "text-blue-400 hover:text-blue-300 font-medium hover:underline cursor-pointer" 
                                      : "text-blue-600 font-medium hover:underline cursor-pointer"
                                  }`}
                                  onClick={() => {
                                    setCurrentDate(date);
                                    setCalendarView("day");
                                  }}
                                >
                                  +{dayEvents.length - 3} autres
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              
              {/* List View */}
              {calendarView === "list" && (
                <div className={`p-5 h-[calc(100vh-400px)] overflow-y-auto ${darkMode ? "scrollbar-dark" : ""}`}>
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="font-semibold text-lg">Toutes vos interventions</h3>
                    <div className="flex items-center gap-2">
                      <button className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === "all" ? (darkMode ? "bg-blue-500 text-white" : "bg-blue-500 text-white") : (darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600")}`} onClick={() => setFilterStatus("all")}>
                        Tous
                      </button>
                      <button className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === "scheduled" ? (darkMode ? "bg-blue-500 text-white" : "bg-blue-500 text-white") : (darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600")}`} onClick={() => setFilterStatus("scheduled")}>
                        Planifiés
                      </button>
                      <button className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === "pending" ? (darkMode ? "bg-blue-500 text-white" : "bg-blue-500 text-white") : (darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600")}`} onClick={() => setFilterStatus("pending")}>
                        En attente
                      </button>
                      <button className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === "completed" ? (darkMode ? "bg-blue-500 text-white" : "bg-blue-500 text-white") : (darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600")}`} onClick={() => setFilterStatus("completed")}>
                        Terminés
                      </button>
                    </div>
                  </div>
                  
                  {filteredEvents.length === 0 ? (
                    <div className="text-center py-12">
                      <div className={`rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                        <CalendarIcon className={`h-8 w-8 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                      </div>
                      <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>Aucune intervention trouvée avec ces critères</p>
                      <button 
                        className={`mt-3 px-4 py-2 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
                        onClick={() => {
                          setFilterStatus("all");
                          setFilterType("all");
                          setSearchQuery("");
                        }}
                      >
                        Réinitialiser les filtres
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Group events by date */}
                      {Object.entries(
                        filteredEvents.reduce((acc: Record<string, CalendarEvent[]>, event) => {
                          const date = event.date;
                          if (!acc[date]) {
                            acc[date] = [];
                          }
                          acc[date].push(event);
                          return acc;
                        }, {})
                      )
                        .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                        .map(([date, dateEvents]) => (
                          <div key={date} className="mb-6">
                            <div className={`flex items-center mb-2 ${
                              new Date(date).toDateString() === new Date().toDateString() 
                                ? "text-blue-500 dark:text-blue-400" 
                                : ""
                            }`}>
                              <CalendarIcon className="h-5 w-5 mr-2" />
                              <h4 className="font-semibold">
                                {new Date(date).toLocaleDateString("fr-FR", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric"
                                })}
                                {new Date(date).toDateString() === new Date().toDateString() && " (Aujourd'hui)"}
                              </h4>
                              <div className={`ml-2 text-xs ${darkMode ? "bg-gray-700" : "bg-gray-200"} rounded-full px-2 py-0.5`}>
                                {dateEvents.length} interventions
                              </div>
                            </div>
                            
                            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm overflow-hidden`}>
                              {dateEvents
                                .sort((a, b) => {
                                  const timeA = a.time.split(" - ")[0];
                                  const timeB = b.time.split(" - ")[0];
                                  return timeA.localeCompare(timeB);
                                })
                                .map((event, idx) => (
                                  <div 
                                    key={event.id}
                                    className={`p-4 cursor-pointer ${
                                      darkMode 
                                        ? `hover:bg-gray-700 ${idx < dateEvents.length - 1 ? "border-b border-gray-700" : ""}`
                                        : `hover:bg-gray-50 ${idx < dateEvents.length - 1 ? "border-b border-gray-200" : ""}`
                                    }`}
                                    onClick={() => openEventDetails(event)}
                                  >
                                    <div className="flex items-start">
                                      <div className="flex-shrink-0 w-20 text-center">
                                        <div className={`text-sm font-bold ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
                                          {event.time.split(" - ")[0]}
                                        </div>
                                        <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                          {event.duration}
                                        </div>
                                      </div>
                                      
                                      <div className="ml-4 flex-1">
                                        <div className="flex justify-between">
                                          <h5 className="font-semibold">{event.title}</h5>
                                          <div className="flex items-center space-x-2">
                                            {getPriorityBadge(event.priority)}
                                            <div className={`p-1.5 rounded-full ${getStatusColor(event.status)} text-white`}>
                                              {getStatusIcon(event.status)}
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                                          <div className="flex items-center text-sm">
                                            <MapPinIcon className="h-4 w-4 mr-2 opacity-70" />
                                            <span className="truncate">{event.location}</span>
                                          </div>
                                          <div className="flex items-center text-sm">
                                            <UserIcon className="h-4 w-4 mr-2 opacity-70" />
                                            <span>{event.customer.name}</span>
                                          </div>
                                          <div className="flex items-center text-sm">
                                            <PhoneIcon className="h-4 w-4 mr-2 opacity-70" />
                                            <span>{event.customer.phone}</span>
                                          </div>
                                          <div className="flex items-center text-sm">
                                            <TruckIcon className="h-4 w-4 mr-2 opacity-70" />
                                            <span>Trajet: {event.travelTime}</span>
                                          </div>
                                        </div>
                                        
                                        {/* Required tools/parts badges */}
                                        {(event.requiredTools || event.requiredParts) && (
                                          <div className="flex flex-wrap gap-2 mt-2">
                                            {event.requiredTools && event.requiredTools.length > 0 && (
                                              <div className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                                                <span className="font-medium">Outils: {event.requiredTools.length}</span>
                                              </div>
                                            )}
                                            {event.requiredParts && event.requiredParts.length > 0 && (
                                              <div className={`text-xs px-2 py-0.5 rounded-full ${
                                                event.requiredParts.some(part => !part.available)
                                                  ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                                                  : darkMode ? "bg-gray-700" : "bg-gray-100"
                                              }`}>
                                                <span className="font-medium">
                                                  Pièces: {event.requiredParts.length}
                                                  {event.requiredParts.some(part => !part.available) && " ⚠️"}
                                                </span>
                                              </div>
                                            )}
                                            {event.signatureRequired && (
                                              <div className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                                                <span className="font-medium">Signature requise</span>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Map View */}
              {calendarView === "map" && (
                <div className="h-[calc(100vh-350px)]">
                  <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                    {/* Map container */}
                    <div className="col-span-2 h-full p-1">
                      <div className={`h-full ${darkMode ? "bg-gray-700" : "bg-gray-100"} rounded-lg flex items-center justify-center`}>
                        <div className="text-center">
                          <MapPinIcon className={`h-12 w-12 mx-auto ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                          <p className="mt-2 font-medium">Carte des interventions</p>
                          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
                            Visualisez vos interventions géolocalisées
                          </p>
                          <button className={`mt-4 px-4 py-2 rounded-lg ${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-200 hover:bg-gray-300"} text-sm font-medium`}>
                            Afficher sur Google Maps
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Events list */}
                    <div className={`${darkMode ? "bg-gray-800" : "bg-white"} border-l ${darkMode ? "border-gray-700" : "border-gray-200"} overflow-y-auto`}>
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold">Interventions par zone</h3>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
                          Regroupées par proximité géographique
                        </p>
                      </div>
                      
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {Object.entries(groupEventsByProximity(filteredEvents)).map(([district, districtEvents]) => (
                          <div key={district} className="p-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Zone: {district}</h4>
                              <span className={`text-xs ${darkMode ? "bg-gray-700" : "bg-gray-100"} rounded-full px-2 py-0.5`}>
                                {districtEvents.length} interventions
                              </span>
                            </div>
                            
                            <div className="mt-3 space-y-2">
                              {districtEvents.map(event => (
                                <div 
                                  key={event.id} 
                                  className={`p-3 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"} cursor-pointer`}
                                  onClick={() => openEventDetails(event)}
                                >
                                  <div className="flex justify-between">
                                    <div className="flex items-center">
                                      <div className={`w-2 h-full rounded-full ${getStatusColor(event.status)} mr-2`}></div>
                                      <p className="font-medium text-sm">{event.time}</p>
                                    </div>
                                    {getPriorityBadge(event.priority)}
                                  </div>
                                  
                                  <p className="font-medium mt-1 truncate">{event.title}</p>
                                  
                                  <div className="flex items-center text-sm mt-1">
                                    <MapPinIcon className="h-4 w-4 mr-1 opacity-70" />
                                    <p className="truncate">{event.location}</p>
                                  </div>
                                  
                                  <div className="flex justify-between items-center mt-2">
                                    <div className="flex items-center text-sm">
                                      <TruckIcon className="h-4 w-4 mr-1 opacity-70" />
                                      <span>{event.travelTime}</span>
                                    </div>
                                    
                                    <div className="flex space-x-1">
                                      <button className={`p-1 rounded ${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-white hover:bg-gray-200"}`}>
                                        <PhoneIcon className="h-4 w-4" />
                                      </button>
                                      <button className={`p-1 rounded ${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-white hover:bg-gray-200"}`}>
                                        <MapPinIcon className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Event Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <motion.div 
              className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-4 border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 ${darkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"} rounded-lg`}>
                  <CalendarIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>Total du mois</h4>
                  <p className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{eventsThisMonth.length}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-4 border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 ${darkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-600"} rounded-lg`}>
                  <CheckCircleIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>Terminés</h4>
                  <p className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {eventsThisMonth.filter((e) => e.status === "completed").length}
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-4 border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 ${darkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"} rounded-lg`}>
                  <ClockIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>Planifiés</h4>
                  <p className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {eventsThisMonth.filter((e) => e.status === "scheduled").length}
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-4 border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 ${darkMode ? "bg-yellow-900/30 text-yellow-400" : "bg-yellow-100 text-yellow-600"} rounded-lg`}>
                  <ExclamationCircleIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>En attente</h4>
                  <p className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {eventsThisMonth.filter((e) => e.status === "pending").length}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      
      </main>
      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {/* Semi-transparent background with blur effect */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeEventDetails}
            ></motion.div>

            {/* Popup content */}
            <motion.div
              className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-2xl z-10 max-w-4xl w-full max-h-[90vh] overflow-hidden relative`}
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Header with status color */}
              <div
                className={`p-6 ${getEventGradient(selectedEvent.type)} text-white sticky top-0 z-10`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm font-medium">
                        {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                      </span>
                      {getPriorityBadge(selectedEvent.priority)}
                    </div>
                    <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
                  </div>
                  <button
                    onClick={closeEventDetails}
                    className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center mt-2">
                  <div
                    className={`h-3 w-3 rounded-full ${getStatusColor(selectedEvent.status)}`}
                  ></div>
                  <span className="ml-2 text-sm font-medium">
                    {selectedEvent.status === "completed"
                      ? "Terminé"
                      : selectedEvent.status === "scheduled"
                      ? "Planifié"
                      : selectedEvent.status === "in-progress"
                      ? "En cours"
                      : selectedEvent.status === "cancelled"
                      ? "Annulé"
                      : "En attente"}
                  </span>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                  <div className="space-y-6">
                    {/* Event Information */}
                    <div className={`rounded-xl p-4 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                      <h4 className="font-medium mb-4">Informations sur l&apos;intervention</h4>
                      
                      <div className="space-y-4">
                        {/* Date and Time */}
                        <div className="flex items-start space-x-3">
                          <ClockIcon className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"} mt-0.5`} />
                          <div>
                            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Date et heure</p>
                            <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                              {new Date(selectedEvent.date).toLocaleDateString("fr-FR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                              {" · "}
                              {selectedEvent.time}
                              {" ("}
                              {selectedEvent.duration}
                              {")"}
                            </p>
                          </div>
                        </div>

                        {/* Solution */}
                        <div className="flex items-start space-x-3">
                          <WrenchScrewdriverIcon className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"} mt-0.5`} />
                          <div>
                            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Solution énergétique</p>
                            <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{selectedEvent.solution}</p>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-start space-x-3">
                          <MapPinIcon className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"} mt-0.5`} />
                          <div>
                            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Adresse</p>
                            <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{selectedEvent.location}</p>
                            {selectedEvent.parkingInfo && (
                              <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                <span className="font-medium">Parking:</span> {selectedEvent.parkingInfo}
                              </p>
                            )}
                            {selectedEvent.accessInfo && (
                              <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                <span className="font-medium">Accès:</span> {selectedEvent.accessInfo}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Technician */}
                        <div className="flex items-start space-x-3">
                          <UserIcon className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"} mt-0.5`} />
                          <div>
                            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Technicien assigné</p>
                            <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{selectedEvent.technicianName}</p>
                            {selectedEvent.teamMembers && selectedEvent.teamMembers.length > 1 && (
                              <div className="mt-1">
                                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Équipe complète:</p>
                                <ul className={`text-sm list-disc pl-4 mt-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                  {selectedEvent.teamMembers.map((member, idx) => (
                                    <li key={idx}>{member}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Notes */}
                        {selectedEvent.notes && (
                          <div className="flex items-start space-x-3">
                            <ChatBubbleLeftIcon className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"} mt-0.5`} />
                            <div>
                              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Notes</p>
                              <p className={`italic mt-1 ${darkMode ? "text-white" : "text-gray-900"}`}>{selectedEvent.notes}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Customer Information */}
                    <div className={`rounded-xl p-4 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                      <h4 className="font-medium mb-4">Informations client</h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{selectedEvent.customer.name}</p>
                          
                          <div className="flex space-x-2">
                            <button className={`p-2 rounded-full ${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-white hover:bg-gray-200"} shadow-sm`}>
                              <PhoneIcon className="h-4 w-4" />
                            </button>
                            <button className={`p-2 rounded-full ${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-white hover:bg-gray-200"} shadow-sm`}>
                              <ChatBubbleLeftIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          <div>
                            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Téléphone</p>
                            <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{selectedEvent.customer.phone}</p>
                          </div>
                          <div>
                            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Email</p>
                            <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{selectedEvent.customer.email}</p>
                          </div>
                          <div>
                            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Méthode préférée</p>
                            <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                              {selectedEvent.customer.preferredContactMethod === "phone" ? "Téléphone" :
                               selectedEvent.customer.preferredContactMethod === "email" ? "Email" : "SMS"}
                            </p>
                          </div>
                          <div>
                            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Visites précédentes</p>
                            <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                              {selectedEvent.previousVisits || 0}
                            </p>
                          </div>
                        </div>
                        
                        {selectedEvent.customer.history && (
                          <div className={`mt-3 p-3 rounded ${darkMode ? "bg-gray-600" : "bg-gray-100"}`}>
                            <p className={`text-xs font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Historique client</p>
                            <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{selectedEvent.customer.history}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Map */}
                    <div className={`rounded-xl overflow-hidden ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                      <div className="h-48">
                        <iframe
                          title="Map"
                          src={`https://www.google.com/maps?q=${encodeURIComponent(
                            selectedEvent.location
                          )}&output=embed`}
                          width="100%"
                          height="100%"
                          className="border-0"
                          loading="lazy"
                        ></iframe>
                      </div>
                      <div className="p-2 flex justify-between items-center">
                        <div className="flex items-center space-x-1">
                          <TruckIcon className="h-4 w-4" />
                          <span className="text-sm font-medium">Trajet: {selectedEvent.travelTime}</span>
                        </div>
                        <button className={`text-xs font-medium px-2 py-1 rounded ${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-white hover:bg-gray-100"}`}>
                          Ouvrir dans GPS
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Checklist */}
                    {selectedEvent.checklist && selectedEvent.checklist.length > 0 && (
                      <div className={`rounded-xl p-4 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Liste de vérification</h4>
                          <div className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? "bg-gray-600" : "bg-gray-200"}`}>
                            {selectedEvent.checklist.filter(item => checklistEdit[`${selectedEvent.id}-${selectedEvent.checklist!.indexOf(item)}`]).length}/{selectedEvent.checklist.length} terminés
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {selectedEvent.checklist.map((item, index) => (
                            <div 
                              key={index} 
                              className={`p-3 rounded flex items-start ${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-white hover:bg-gray-100"} transition-colors`}
                              onClick={() => toggleChecklistItem(selectedEvent.id, index)}
                            >
                              <div className={`flex-shrink-0 w-5 h-5 rounded ${
                                checklistEdit[`${selectedEvent.id}-${index}`] 
                                  ? "bg-green-500 text-white flex items-center justify-center" 
                                  : "border-2 border-gray-400"
                              }`}>
                                {checklistEdit[`${selectedEvent.id}-${index}`] && (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              <span className={`ml-3 text-sm ${checklistEdit[`${selectedEvent.id}-${index}`] ? "line-through opacity-70" : ""}`}>
                                {item.task}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Required Tools */}
                    {selectedEvent.requiredTools && selectedEvent.requiredTools.length > 0 && (
                      <div className={`rounded-xl p-4 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                        <h4 className="font-medium mb-4">Outils nécessaires</h4>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {selectedEvent.requiredTools.map((tool, index) => (
                            <div 
                              key={index} 
                              className={`p-2 rounded flex items-center ${darkMode ? "bg-gray-600" : "bg-white"}`}
                            >
                              <WrenchScrewdriverIcon className="h-4 w-4 mr-2 opacity-70" />
                              <span className="text-sm">{tool}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Required Parts */}
                    {selectedEvent.requiredParts && selectedEvent.requiredParts.length > 0 && (
                      <div className={`rounded-xl p-4 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                        <h4 className="font-medium mb-4">Pièces nécessaires</h4>
                        
                        <div className="space-y-2">
                          {selectedEvent.requiredParts.map((part, index) => (
                            <div 
                              key={index} 
                              className={`p-3 rounded flex items-center justify-between ${
                                !part.available 
                                  ? darkMode ? "bg-red-900/40" : "bg-red-50" 
                                  : darkMode ? "bg-gray-600" : "bg-white"
                              }`}
                            >
                              <div className="flex items-center">
                                <div className={`w-1.5 h-6 rounded-full mr-3 ${part.available ? "bg-green-500" : "bg-red-500"}`}></div>
                                <div>
                                  <p className="font-medium text-sm">{part.name}</p>
                                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Quantité: {part.quantity}</p>
                                </div>
                              </div>
                              
                              {!part.available && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? "bg-red-900/60 text-red-200" : "bg-red-100 text-red-800"} flex items-center`}>
                                  <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                                  Indisponible
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Technical Documents */}
                    {selectedEvent.techDocs && selectedEvent.techDocs.length > 0 && (
                      <div className={`rounded-xl p-4 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                        <h4 className="font-medium mb-4">Documents techniques</h4>
                        
                        <div className="space-y-2">
                          {selectedEvent.techDocs.map((doc, index) => (
                            <div 
                              key={index} 
                              className={`p-3 rounded flex items-center justify-between ${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-white hover:bg-gray-100"} transition-colors cursor-pointer`}
                            >
                              <div className="flex items-center">
                                <DocumentTextIcon className="h-5 w-5 mr-2 opacity-70" />
                                <span className="text-sm font-medium">{doc.name}</span>
                              </div>
                              
                              <button className={`p-1 rounded ${darkMode ? "bg-gray-500 hover:bg-gray-400" : "bg-gray-100 hover:bg-gray-200"}`}>
                                <DocumentArrowDownIcon className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Photos */}
                    {selectedEvent.photos && selectedEvent.photos.length > 0 && (
                      <div className={`rounded-xl p-4 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Photos</h4>
                          <button className={`p-1.5 rounded ${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-white hover:bg-gray-100"}`}>
                            <CameraIcon className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {selectedEvent.photos.map((photo, index) => (
                            <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-gray-300 dark:bg-gray-600">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <CameraIcon className="h-8 w-8 text-white opacity-50" />
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                                <p className="text-xs text-white truncate">{photo.name}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Signature and Payment */}
                    <div className={`rounded-xl p-4 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                      <h4 className="font-medium mb-4">Signature et paiement</h4>
                      
                      <div className="space-y-3">
                        {selectedEvent.signatureRequired && (
                          <div className={`p-3 rounded ${darkMode ? "bg-gray-600" : "bg-white"}`}>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <IdentificationIcon className="h-5 w-5 mr-2 opacity-70" />
                                <span className="font-medium">Signature client requise</span>
                              </div>
                              
                              {selectedEvent.signatureCollected ? (
                                <span className={`text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300`}>
                                  Collectée
                                </span>
                              ) : (
                                <button className={`text-xs px-2 py-1 rounded ${darkMode ? "bg-blue-900/40 text-blue-200 hover:bg-blue-800/60" : "bg-blue-100 text-blue-800 hover:bg-blue-200"}`}>
                                  Collecter
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {selectedEvent.collectPayment && (
                          <div className={`p-3 rounded ${darkMode ? "bg-gray-600" : "bg-white"}`}>
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="flex items-center">
                                  <CreditCardIcon className="h-5 w-5 mr-2 opacity-70" />
                                  <span className="font-medium">Paiement à collecter</span>
                                </div>
                                <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  Montant: {selectedEvent.paymentAmount?.toFixed(2)}€
                                </p>
                              </div>
                              
                              {selectedEvent.paymentCollected ? (
                                <span className={`text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300`}>
                                  Collecté
                                </span>
                              ) : (
                                <button className={`text-xs px-2 py-1 rounded ${darkMode ? "bg-blue-900/40 text-blue-200 hover:bg-blue-800/60" : "bg-blue-100 text-blue-800 hover:bg-blue-200"}`}>
                                  Collecter
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`flex p-4 ${darkMode ? "bg-gray-900 border-t border-gray-700" : "bg-gray-50 border-t border-gray-100"} sticky bottom-0`}>
                <button
                  onClick={closeEventDetails}
                  className={`flex-1 py-2.5 ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-200"} font-medium rounded-xl transition-colors`}
                >
                  Fermer
                </button>
                <button 
                  className={`flex-1 py-2.5 ${
                    selectedEvent.status === "scheduled" || selectedEvent.status === "pending"
                      ? "bg-green-500 hover:bg-green-600 text-white" 
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  } font-medium rounded-xl mx-2 transition-colors flex items-center justify-center`}
                >
                  {selectedEvent.status === "scheduled" || selectedEvent.status === "pending" ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 mr-2" />
                      Démarrer l&apos;intervention
                    </>
                  ) : (
                    <>
                      <DocumentCheckIcon className="h-4 w-4 mr-2" />
                      Compléter le rapport
                    </>
                  )}
                </button>
                <button className={`flex-1 py-2.5 ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} font-medium rounded-xl transition-colors`}>
                  <PencilIcon className="h-4 w-4 mx-auto" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
