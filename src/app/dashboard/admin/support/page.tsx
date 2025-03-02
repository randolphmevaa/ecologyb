"use client";

import React, {useRef} from 'react';
import SignaturePad from 'signature_pad';
import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {  subDays, eachDayOfInterval, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { jsPDF } from 'jspdf';
import { LineChart, customTooltip } from "@/components/ui/Charts/LineChart";
// import jsPDF from "jspdf"; // Make sure to install jsPDF (npm install jspdf)
import Modal from "react-modal"; // Or use your preferred modal library

import {
  LifebuoyIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentArrowDownIcon,
  AdjustmentsHorizontalIcon,
  BellIcon,
  ShieldCheckIcon,
  PlusIcon,
  CalendarIcon,
  DocumentCheckIcon,
  UserCircleIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  // DocumentMagnifyingGlassIcon,
  FireIcon,
  // ViewColumnsIcon,
  // TableCellsIcon,
  SunIcon,
  // EllipsisVerticalIcon,
  ChartBarIcon,
  EllipsisHorizontalIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// React Big Calendar
import { Calendar, momentLocalizer, Views} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CalendarDaysIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, PencilIcon, PrinterIcon, SearchIcon, TrashIcon } from "lucide-react";

// Ensure moment is using French
moment.locale("fr");
const localizer = momentLocalizer(moment);


// Example French messages for react-big-calendar
// const messagesFr = {
//   allDay: "Toute la journée",
//   previous: "Précédent",
//   next: "Suivant",
//   today: "Aujourd'hui",
//   month: "Mois",
//   week: "Semaine",
//   day: "Jour",
//   agenda: "Agenda",
//   date: "Date",
//   time: "Heure",
//   event: "Événement",
//   noEventsInRange: "Aucun événement à afficher.",
//   showMore: (count: number) => `+ ${count} supplémentaire(s)`,
// };

// interface CustomCSSProperties extends React.CSSProperties {}

// type WeekdayKey = "Lun" | "Mar" | "Mer" | "Jeu" | "Ven";

interface Ticket {
  _id: string;
  statut: string;
  dates: {
    created: string;
    resolution?: string;
  };
  problème: string;
  customer: string;
  solution?: string;
}

interface CalendarEvent extends SavEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

interface SavEvent {
  id: string;
  status: "completed" | "pending" | "scheduled";
  priority?: "high" | "medium" | "low";
  customer: string;
  date: string;
  technician: string;
  address: string;
  problem?: string;
  equipmentType?: string;
  notes?: string;
  type?: string;         // Added to support conditional styling (e.g. 'réunion')
  location?: string;     // Added if you want to show location details
  participants?: string; // Added if you want to list participants
  conversation?: { sender: string; content: string; timestamp: string }[];
}

// A mapping for different equipment types (optional icons/colors).
const energySolutions: {
  [key: string]: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; color: string }
} = {
  "Pompe à chaleur": { icon: FireIcon, color: "#213f5b" },
  "Chauffe-eau solaire individuel": { icon: FireIcon, color: "#f59e0b" },
  "Chauffe-eau thermodynamique": { icon: FireIcon, color: "#10b981" },
  "Système Solaire Combiné": { icon: FireIcon, color: "#8b5cf6" },
};

  // Example usage:
  // const data: AttestationData = {
  //   customerName: "Jean Dupont",
  //   address: "123 Rue de Paris",
  //   postalCode: "75001",
  //   city: "Paris",
  //   phone: "06 12 34 56 78",
  //   email: "jean.dupont@email.com",
  //   interventionDate: "2025-03-01",
  //   interventionDetails: "Réparation de la carte mère et remplacement du ventilateur. Nettoyage complet du système.",
  //   technicianName: "Pierre Martin",
  //   parts: [
  //     { quantity: 1, description: "Carte mère ASUS B550", reference: "ASB550-01", price: 129.99 },
  //     { quantity: 2, description: "Ventilateur 120mm", reference: "FAN120-A", price: 19.99 }
  //   ],
  //   signatureDate: "01/03/2025",
  //   signatureLocation: "Paris"
  // };
  // generatePDF(data);

interface ProcessedDataPoint {
  date?: string;
  label?: string;
  tickets: number;
  solutions: number;
  [key: string]: unknown;
}


// Convert your SAV events into the shape react-big-calendar needs
// function eventsForCalendar(savEvents: SavEvent[]) {
//   return savEvents.map((ev) => ({
//     ...ev,
//     // For RBC: title, start, end
//     title: ev.customer + (ev.problem ? ` — ${ev.problem}` : ""),
//     start: new Date(ev.date),
//     end: new Date(ev.date),
//     allDay: false, // or true if you want an all-day event
//   }));
// }

function processTicketData(
  tickets: Ticket[],
  dateRange: { startDate: Date | null; endDate: Date | null }
): ProcessedDataPoint[] {
  if (!dateRange.startDate || !dateRange.endDate) return [];

  const days = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  });

  return days.map((day) => ({
    date: day.toISOString(),
    label: day.toLocaleDateString("fr-FR"),
    tickets: Math.floor(Math.random() * 100) + 20,
    solutions: Math.floor(Math.random() * 90) + 10,
  }));
}

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  type?: string;
  location?: string;
  participants?: string;
}

// Exemple de données pour le calendrier (mars 2025)
const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    status: "scheduled", // Peut être "completed", "pending" ou "scheduled"
    customer: "Jean Dupont",
    date: "2025-03-05T09:00:00.000Z",
    technician: "Technicien A",
    address: "123 Rue de Paris, Paris",
    title: "Réunion d'équipe",
    start: new Date("2025-03-05T09:00:00"),
    end: new Date("2025-03-05T10:00:00"),
    allDay: false,
    type: "réunion", // Pour le style conditionnel, par exemple "réunion"
    location: "Salle de conférence",
    priority: "medium",
    equipmentType: "Pompe à chaleur",
    notes: "Discussion sur les objectifs du mois",
    participants: "Jean Dupont, Marie Curie",
    conversation: [
      {
        sender: "Jean Dupont",
        content: "Préparons la réunion.",
        timestamp: "2025-03-05T08:45:00.000Z",
      },
    ],
  },
  {
    id: "2",
    status: "pending",
    customer: "Alice Martin",
    date: "2025-03-10T14:00:00.000Z",
    technician: "Technicien B",
    address: "456 Avenue de Lyon, Lyon",
    title: "Visite client",
    start: new Date("2025-03-10T14:00:00"),
    end: new Date("2025-03-10T15:30:00"),
    allDay: false,
    type: "visite",
    location: "Bureau de Lyon",
    priority: "high",
    equipmentType: "Chauffe-eau solaire individuel",
    notes: "Inspection préventive",
    participants: "Alice Martin, Technicien B",
  },
  {
    id: "3",
    status: "completed",
    customer: "Pierre Legrand",
    date: "2025-03-15T11:00:00.000Z",
    technician: "Technicien C",
    address: "789 Boulevard Saint-Germain, Marseille",
    title: "Maintenance programmée",
    start: new Date("2025-03-15T11:00:00"),
    end: new Date("2025-03-15T12:00:00"),
    allDay: false,
    type: "maintenance",
    location: "Centre technique",
    priority: "low",
    equipmentType: "Système Solaire Combiné",
    notes: "Vérification annuelle effectuée",
    participants: "Pierre Legrand, Technicien C",
  },
  {
    id: "4",
    status: "pending",
    customer: "Sophie Lambert",
    date: "2025-03-20T08:30:00.000Z",
    technician: "Technicien D",
    address: "321 Rue de Bordeaux, Bordeaux",
    title: "Intervention urgente",
    start: new Date("2025-03-20T08:30:00"),
    end: new Date("2025-03-20T09:30:00"),
    allDay: false,
    type: "intervention",
    location: "Site de Bordeaux",
    priority: "high",
    equipmentType: "Chauffe-eau thermodynamique",
    notes: "Problème de surchauffe détecté",
    participants: "Sophie Lambert, Technicien D",
  },
  {
    id: "5",
    status: "scheduled",
    customer: "Marc Dubois",
    date: "2025-03-25T13:00:00.000Z",
    technician: "Technicien E",
    address: "987 Rue de Nice, Nice",
    title: "Formation technique",
    start: new Date("2025-03-25T13:00:00"),
    end: new Date("2025-03-25T15:00:00"),
    allDay: false,
    type: "formation",
    location: "Centre de formation",
    priority: "medium",
    equipmentType: "Système Solaire Combiné",
    notes: "Session de formation sur le nouveau logiciel",
    participants: "Marc Dubois, Technicien E",
  },
];

// Main component
function SAVStatistics() {
  // State management
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date()
  });
  const [dataGrouping, setDataGrouping] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");
  const [processedData, setProcessedData] = useState<ProcessedDataPoint[]>([]);
  const [activeQuickRange, setActiveQuickRange] = useState<number>(30);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["tickets", "solutions"]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sample data - replace with actual API call
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const generateSampleData = () => {
        const data: ProcessedDataPoint[] = [];
        // Use nullish coalescing operator to ensure a Date is always provided
        const current = new Date(dateRange.startDate ?? new Date());
        const end = new Date(dateRange.endDate ?? new Date());
        
        while (current <= end) {
          const day = current.toISOString().split('T')[0];
          const tickets = Math.floor(Math.random() * 30) + 20;
          const solutions = Math.floor(tickets * (0.6 + Math.random() * 0.3));
          
          data.push({
            date: day,
            tickets,
            solutions,
            ratio: Math.round((solutions / tickets) * 100)
          });
          
          current.setDate(current.getDate() + 1);
        }
        
        return data;
      };
      
      const rawData = generateSampleData();
      
      // Process data according to grouping
      let grouped: ProcessedDataPoint[] = [];
      
      if (dataGrouping === "daily") {
        grouped = rawData;
      } else if (dataGrouping === "weekly") {
        // Group by week
        const weekMap = new Map<string, { date: string; tickets: number; solutions: number }>();
        
        rawData.forEach(point => {
          const date = new Date(point.date ?? new Date());
          const weekNum = Math.floor(date.getDate() / 7) + 1;
          const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
          const key = `S${weekNum} ${monthYear}`;
          
          if (!weekMap.has(key)) {
            weekMap.set(key, { date: key, tickets: 0, solutions: 0 });
          }
          
          const existing = weekMap.get(key)!;
          existing.tickets += point.tickets;
          existing.solutions += point.solutions;
        });
        
        grouped = Array.from(weekMap.values());
      } else if (dataGrouping === "monthly") {
        // Group by month
        const monthMap = new Map<string, { date: string; tickets: number; solutions: number }>();
        
        rawData.forEach(point => {
          const date = new Date(point.date ?? new Date());
          const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
          
          if (!monthMap.has(monthYear)) {
            monthMap.set(monthYear, { date: monthYear, tickets: 0, solutions: 0 });
          }
          
          const existing = monthMap.get(monthYear)!;
          existing.tickets += point.tickets;
          existing.solutions += point.solutions;
        });
        
        grouped = Array.from(monthMap.values());
      } else {
        // Group by year
        const yearMap = new Map<string, { date: string; tickets: number; solutions: number }>();
        
        rawData.forEach(point => {
          const date = new Date(point.date ?? new Date());
          const year = date.getFullYear().toString();
          
          if (!yearMap.has(year)) {
            yearMap.set(year, { date: year, tickets: 0, solutions: 0 });
          }
          
          const existing = yearMap.get(year)!;
          existing.tickets += point.tickets;
          existing.solutions += point.solutions;
        });
        
        grouped = Array.from(yearMap.values());
      }
      
      // Add ratio to each grouped item
      grouped = grouped.map(item => ({
        ...item,
        ratio: Math.round((item.solutions / item.tickets) * 100)
      }));
      
      setProcessedData(grouped);
      setIsLoading(false);
    }, 800);
  }, [dateRange, dataGrouping]);  

  // Helper functions
  const setQuickRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    setDateRange({
      startDate: start,
      endDate: end
    });
    setActiveQuickRange(days);
  };

  const isQuickRangeActive = (days: number) => {
    return activeQuickRange === days;
  };

  const formatXAxis = (value: string, grouping: string) => {
    if (grouping === "daily") {
      const date = new Date(value);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }
    return value;
  };

  // Stats cards
  const statsCards = [
    {
      title: "Total Tickets",
      value: processedData.reduce((acc, curr) => acc + curr.tickets, 0),
      icon: <ChatBubbleLeftRightIcon className="h-5 w-5 text-[#213f5b]" />,
      bgColor: "bg-[#e8f3ff]",
      textColor: "text-[#213f5b]"
    },
    {
      title: "Total Solutions",
      value: processedData.reduce((acc, curr) => acc + curr.solutions, 0),
      icon: <ChatBubbleLeftRightIcon className="h-5 w-5 text-[#10b981]" />,
      bgColor: "bg-[#e6faf5]",
      textColor: "text-[#10b981]"
    },
    {
      title: "Taux de Résolution",
      value: `${Math.round((processedData.reduce((acc, curr) => acc + curr.solutions, 0) / processedData.reduce((acc, curr) => acc + curr.tickets, 0)) * 100)}%`,
      icon: <ChatBubbleLeftRightIcon className="h-5 w-5 text-[#f59e0b]" />,
      bgColor: "bg-[#fef7e9]",
      textColor: "text-[#f59e0b]"
    }
  ];

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats overview */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {statsCards.map((stat, index) => (
          <motion.div
            key={index}
            className={`rounded-2xl ${stat.bgColor} p-4 flex items-center gap-4`}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-3 bg-white/40 rounded-xl">
              {stat.icon}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
              <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main chart */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#bfddf9]"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#213f5b] to-[#1d3349] p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <ChatBubbleLeftRightIcon className="h-7 w-7 text-[#d2fcb2]" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">
                  Statistique S.A.V.
                </h2>
                <p className="text-white/80 font-medium mt-1">
                  Analyse des tickets sur la période
                </p>
              </div>
            </div>
            
            {/* Quick Range Buttons */}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className={`${
                  isQuickRangeActive(7)
                    ? "bg-white/20 ring-2 ring-white/30"
                    : "bg-white/10 hover:bg-white/20"
                } text-white rounded-xl h-10 px-3 transition-all`}
                onClick={() => setQuickRange(7)}
              >
                7J
              </Button>
              <Button
                variant="ghost"
                className={`${
                  isQuickRangeActive(14)
                    ? "bg-white/20 ring-2 ring-white/30"
                    : "bg-white/10 hover:bg-white/20"
                } text-white rounded-xl h-10 px-3 transition-all`}
                onClick={() => setQuickRange(14)}
              >
                14J
              </Button>
              <Button
                variant="ghost"
                className={`${
                  isQuickRangeActive(30)
                    ? "bg-white/20 ring-2 ring-white/30"
                    : "bg-white/10 hover:bg-white/20"
                } text-white rounded-xl h-10 px-3 transition-all`}
                onClick={() => setQuickRange(30)}
              >
                30J
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 bg-[#f8fbff] border-b border-[#bfddf9] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <DatePicker
              selected={dateRange.startDate}
              onChange={(date) =>
                setDateRange(prev => ({
                  ...prev,
                  startDate: date ?? new Date(), // ensures it's always a Date
                }))
              }
              selectsStart
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              dateFormat="dd/MM/yyyy"
              className="border border-[#bfddf9] rounded-xl px-3 py-2 text-sm"
              placeholderText="Date de début"
              locale={fr}
            />
            <span className="text-[#5a6e87]">au</span>
            <DatePicker
              selected={dateRange.endDate}
              onChange={(date) =>
                setDateRange(prev => ({
                  ...prev,
                  startDate: date ?? new Date(), // ensures it's always a Date
                }))
              }
              selectsEnd
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              dateFormat="dd/MM/yyyy"
              className="border border-[#bfddf9] rounded-xl px-3 py-2 text-sm"
              placeholderText="Date de fin"
              locale={fr}
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={dataGrouping}
              onChange={(e) =>
                setDataGrouping(
                  e.target.value as
                    | "daily"
                    | "weekly"
                    | "monthly"
                    | "yearly"
                )
              }
              className="border border-[#bfddf9] rounded-xl px-3 py-2 text-sm"
            >
              <option value="daily">Quotidien</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuel</option>
              <option value="yearly">Annuel</option>
            </select>

            {/* Metrics selector */}
            <div className="flex items-center gap-2 border border-[#bfddf9] rounded-xl px-3 py-1">
              <div className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id="tickets"
                  checked={selectedMetrics.includes("tickets")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedMetrics([...selectedMetrics, "tickets"]);
                    } else if (selectedMetrics.length > 1) {
                      setSelectedMetrics(selectedMetrics.filter(m => m !== "tickets"));
                    }
                  }}
                  className="rounded"
                />
                <label htmlFor="tickets" className="text-sm cursor-pointer">Tickets</label>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id="solutions"
                  checked={selectedMetrics.includes("solutions")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedMetrics([...selectedMetrics, "solutions"]);
                    } else if (selectedMetrics.length > 1) {
                      setSelectedMetrics(selectedMetrics.filter(m => m !== "solutions"));
                    }
                  }}
                  className="rounded"
                />
                <label htmlFor="solutions" className="text-sm cursor-pointer">Solutions</label>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="p-6">
          <AnimatePresence>
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-64 flex items-center justify-center"
              >
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 border-4 border-t-[#213f5b] border-r-[#213f5b] border-b-[#10b981] border-l-[#10b981] rounded-full animate-spin"></div>
                  <p className="mt-4 text-[#5a6e87]">Chargement des données...</p>
                </div>
              </motion.div>
            ) : processedData.length > 0 ? (
              <motion.div
                key="chart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LineChart<ProcessedDataPoint>
                  data={processedData}
                  xKey="date"
                  yKeys={selectedMetrics as (keyof ProcessedDataPoint)[]}
                  colors={["#213f5b", "#10b981"]}
                  xAxisFormatter={(value: string) => formatXAxis(value, dataGrouping)}
                  tooltip={(props) => customTooltip(props)}
                  height={350}
                  className="mx-auto"
                  // showLegend={true}
                  // legendLabels={["Tickets créés", "Solutions apportées"]}
                />
              </motion.div>
            ) : (
              <motion.div 
                key="no-data"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-[#5a6e87] py-12"
              >
                <div className="flex flex-col items-center">
                  <svg className="h-12 w-12 text-[#bfddf9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-4">Aucune donnée à afficher pour cette période.</p>
                  <Button 
                    className="mt-4 bg-[#213f5b] hover:bg-[#1d3349] text-white"
                    onClick={() => setQuickRange(30)}
                  >
                    Réinitialiser la période
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

interface AttestationData {
  customerName: string;
  address?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
  email?: string; // Added missing property
  interventionDate?: string;
  interventionDetails?: string;
  signature?: string | null; // Changed to accept null value
  signatureDate?: string;
  signatureLocation?: string;
  referenceNumber?: string; // Added missing property
  technicianName?: string; // Added missing property
  parts?: Part[]; // Added missing property
  ticketId?: string; // Added missing property from your state
  date?: string; // Added missing property from your state
}

// Define the Part interface for parts items
interface Part {
  quantity: number;
  description: string;
  reference?: string;
  price?: number;
}

// Type declaration for missing jsPDF methods
declare module 'jspdf' {
  interface jsPDF {
    setGlobalAlpha(alpha: number): jsPDF;
    getNumberOfPages(): number;
  }
}

// const primaryColor = "#2A4365";    // Deep blue
// const secondaryColor = "#EBF8FF";  // Light background
// const accentColor = "#48BB78";     // Fresh green
// const textColor = "#2D3748";       // Dark gray
// const lightText = "#718096";       // Gray for labels

const AttestationModal: React.FC = () => {
  const [showAttestationModal, setShowAttestationModal] = useState<boolean>(false);
  const [attestationData, setAttestationData] = useState<AttestationData>({
    customerName: '',
    ticketId: '',
    date: new Date().toISOString().split('T')[0],
    address: '',
    postalCode: '',
    city: '',
    phone: '',
    // Use slice(0,16) to include both date and hour/minute in ISO format
    interventionDate: new Date().toISOString().slice(0, 16),
    interventionDetails: '',
    signatureDate: '',
    signatureLocation: '',
    signature: null,
  });

  // Références pour le conteneur, le canvas et l'instance de SignaturePad
  const signatureRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  // Fonction d'initialisation de la zone de signature
  const initializeSignaturePad = () => {
    if (!signatureRef.current) {
      console.error("signatureRef.current is null");
      return;
    }
    console.log("signatureRef.current dimensions:", signatureRef.current.clientWidth, signatureRef.current.clientHeight);
    
    if (!canvasRef.current) {
      const canvas = document.createElement('canvas');
      canvasRef.current = canvas;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.cursor = 'crosshair';
      canvas.style.touchAction = 'none';
      
      // Définir les dimensions du canvas d'après le conteneur
      canvas.width = signatureRef.current.clientWidth;
      canvas.height = signatureRef.current.clientHeight;
      
      // Vider le conteneur et y ajouter le canvas
      signatureRef.current.innerHTML = '';
      signatureRef.current.appendChild(canvas);
    }
    
    if (canvasRef.current) {
      try {
        const newSignaturePad = new SignaturePad(canvasRef.current, {
          backgroundColor: 'rgba(255, 255, 255, 0)',
          penColor: 'black',
          minWidth: 1,
          maxWidth: 2.5,
        });
        signaturePadRef.current = newSignaturePad;
        
        if (attestationData.signature) {
          newSignaturePad.fromDataURL(attestationData.signature);
        }
        
        // Pour mettre en surbrillance lors de l'interaction
        canvasRef.current.addEventListener('mousedown', () => {
          if (canvasRef.current) {
            canvasRef.current.style.border = '1px solid #3b82f6';
          }
        });
        
        console.log("Signature pad initialized successfully");
      } catch (error) {
        console.error("Error initializing signature pad:", error);
      }
    }
  };

  // Initialiser la zone de signature après ouverture du modal
  useEffect(() => {
    if (showAttestationModal) {
      const timer = setTimeout(() => {
        initializeSignaturePad();
      }, 300);
      return () => {
        clearTimeout(timer);
        if (signaturePadRef.current) {
          signaturePadRef.current.off();
        }
      };
    }
  }, [showAttestationModal, attestationData.signature]);

  // Ajuster le canvas lors du redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      if (!signatureRef.current || !canvasRef.current || !signaturePadRef.current) return;
      try {
        const data = signaturePadRef.current.toData();
        const container = signatureRef.current;
        const canvas = canvasRef.current;
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = container.clientWidth * ratio;
        canvas.height = container.clientHeight * ratio;
        const context = canvas.getContext('2d');
        if (context) {
          context.scale(ratio, ratio);
        }
        signaturePadRef.current.clear();
        if (data && data.length > 0) {
          signaturePadRef.current.fromData(data);
        }
        console.log('Signature pad resized successfully');
      } catch (error) {
        console.error('Error resizing signature pad:', error);
      }
    };

    if (showAttestationModal) {
      window.addEventListener('resize', handleResize);
      setTimeout(handleResize, 100);
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [showAttestationModal]);

  // Fonction pour effacer la signature
  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setAttestationData(prev => ({ ...prev, signature: null }));
      if (canvasRef.current) {
        canvasRef.current.style.border = '1px dashed #cbd5e1';
      }
    }
  };

  // Fonction pour générer le PDF avec jsPDF
  const generatePDF = (data: AttestationData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    // Define colors
    const primaryColor = "#2A4365";    
    const secondaryColor = "#EBF8FF";  
    const accentColor = "#48BB78";     
    const textColor = "#2D3748";       
    const lightText = "#718096";       

    // Set a clean background
    doc.setFillColor(secondaryColor);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // -----------------------------
    // Header Section (reduced height)
    // -----------------------------
    const headerHeight = 40; 
    doc.setFillColor("#FFFFFF");
    doc.roundedRect(margin, 15, contentWidth, headerHeight, 3, 3, 'F');

    // Place logo on the left
    const logoHeight = 25;
    const logoWidth = logoHeight * 1.5;
    try {
      doc.addImage("/ecologyblogo.png", 'PNG', margin + 10, 15 + (headerHeight - logoHeight) / 2 - 2, logoWidth, logoHeight);
    } catch {
      doc.setTextColor(primaryColor);
      doc.setFontSize(14);
      doc.text("ECOLOGY'B", margin + 10, 15 + headerHeight / 2);
    }

    // -----------------------------
    // Header Titles with Adjustments
    // -----------------------------
    doc.setTextColor(primaryColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    const title1 = "ATTESTATION D'INTERVENTION";
    const title1Width = doc.getTextWidth(title1);
    const title1X = margin + (contentWidth - title1Width) / 2 + 23;
    doc.text(title1, title1X, 15 + headerHeight / 2);

    doc.setFontSize(12);
    const title2 = "Service Après-Vente";
    const title2Width = doc.getTextWidth(title2);
    const title2X = margin + (contentWidth - title2Width) / 2;
    doc.text(title2, title2X, 15 + headerHeight / 2 + 6);

    // -----------------------------
    // Client Information Section
    // -----------------------------
    let yPos = 15 + headerHeight + 15;
    doc.setFontSize(10);
    const clientInfo = [
      { label: "Nom du client", value: data.customerName || "" },
      { label: "Adresse", value: data.address || "" },
      { label: "Code Postal", value: data.postalCode || "" },
      { label: "Ville", value: data.city || "" },
      { label: "Tél portable", value: data.phone || "" },
      // Build the date string with "Le" and the formatted intervention date.
      { label: "Date de l'intervention", value: data.interventionDate ? `Le ${formatDateTime(data.interventionDate)}` : "" }
    ];

    clientInfo.forEach(info => {
      // Bold the label
      doc.setFont("helvetica", "bold");
      doc.setTextColor(textColor);
      doc.text(`${info.label}:`, margin, yPos);
      
      // Normal text for the value
      doc.setFont("helvetica", "normal");
      // For "Date de l'intervention", don't force uppercase so it keeps the "à" in lowercase
      if (info.label === "Date de l'intervention") {
        doc.text(info.value, margin + 45, yPos);
      } else {
        doc.text((info.value || "").toUpperCase(), margin + 45, yPos);
      }
      yPos += 7;
    });
    yPos += 10;

    // -----------------------------
    // Technical Team Box
    // -----------------------------
    const techBoxHeight = 40;
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, yPos, contentWidth, techBoxHeight, 3, 3, 'S');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    const techText = "ENCADRÉ RÉSERVÉ À L'ÉQUIPE TECHNIQUE";
    const techTextWidth = doc.getTextWidth(techText);
    const techTextX = margin + (contentWidth - techTextWidth) / 2;
    doc.setTextColor(primaryColor);
    doc.text(techText, techTextX, yPos + 10);
    
    // Intervention details in uppercase
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    doc.text("Détail de l’intervention:", margin + 10, yPos + 16);

    doc.setFont("helvetica", "normal");
    // Convert interventionDetails to uppercase before splitting the text
    const techDetails = doc.splitTextToSize((data.interventionDetails || "Aucun détail fourni").toUpperCase(), contentWidth - 20);
    doc.text(techDetails, margin + 10, yPos + 22);
    yPos += techBoxHeight + 10;

    function formatDateOnly(dateString?: string): string {
      if (!dateString) return "";
      try {
        return new Date(dateString).toLocaleDateString('fr-FR');
      } catch {
        return dateString;
      }
    }

    // -----------------------------
    // Client Declaration Box (with Signature)
    // -----------------------------
    const declBoxHeight = 100;
    doc.setDrawColor(accentColor);
    doc.roundedRect(margin, yPos, contentWidth, declBoxHeight, 3, 3, 'S');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    const clientBoxText = "ENCADRÉ RÉSERVÉ AU CLIENT";
    const clientBoxTextWidth = doc.getTextWidth(clientBoxText);
    const clientBoxTextX = margin + (contentWidth - clientBoxTextWidth) / 2;
    doc.setTextColor(accentColor);
    doc.text(clientBoxText, clientBoxTextX, yPos + 10);
    
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    let textY = yPos + 20;
    
    // Customer declaration lines...
    doc.setFont("helvetica", "bold");
    const line1Label = "Je soussigné(e) Madame/Monsieur:";
    doc.text(line1Label, margin + 10, textY);
    const line1LabelWidth = doc.getTextWidth(line1Label);
    doc.setFont("helvetica", "normal");
    doc.text((data.customerName || "").toUpperCase(), margin + 10 + line1LabelWidth + 2, textY);
    textY += 6;
    
    doc.setFont("helvetica", "bold");
    const line2Label1 = "Demeurant à l'adresse:";
    doc.text(line2Label1, margin + 10, textY);
    const line2Label1Width = doc.getTextWidth(line2Label1);
    doc.setFont("helvetica", "normal");
    doc.text((data.address || "").toUpperCase(), margin + 10 + line2Label1Width + 2, textY);
    
    doc.setFont("helvetica", "bold");
    const line2Label2 = ", Code Postal:";
    const xAfterAddress = margin + 10 + line2Label1Width + 2 + doc.getTextWidth((data.address || "").toUpperCase());
    doc.text(line2Label2, xAfterAddress, textY);
    const line2Label2Width = doc.getTextWidth(line2Label2);
    
    doc.setFont("helvetica", "normal");
    doc.text((data.postalCode || "").toUpperCase(), xAfterAddress + line2Label2Width + 2, textY);
    
    doc.setFont("helvetica", "bold");
    const line2Label3 = "  Ville:";
    const xAfterPostalCode = xAfterAddress + line2Label2Width + 2 + doc.getTextWidth((data.postalCode || "").toUpperCase());
    doc.text(line2Label3, xAfterPostalCode, textY);
    const line2Label3Width = doc.getTextWidth(line2Label3);
    
    doc.setFont("helvetica", "normal");
    doc.text((data.city || "").toUpperCase(), xAfterPostalCode + line2Label3Width + 2, textY);
    textY += 6;
    
    textY += 6;
    
    doc.setFont("helvetica", "bold");
    doc.text("Atteste que la société ECOLOGY'B a pris en charge ma demande de SAV.", margin + 10, textY);
    textY += 6;
    
    doc.text("J'atteste sur l'honneur que les tâches mentionnées ci-dessus ont bien été réalisées et", margin + 10, textY);
    textY += 6;
    
    doc.text("m'apportent entière satisfaction.", margin + 10, textY);
    textY += 6;
    
    textY += 6;
    
    // Bold "Date: "
    doc.setFont("helvetica", "bold");
    const boldLabel = "Date: ";
    doc.text(boldLabel, margin + 10, textY);
    const boldLabelWidth = doc.getTextWidth(boldLabel);

    // Normal "Le {date}"
    doc.setFont("helvetica", "normal");
    doc.text("Le " + formatDateOnly(data.signatureDate).toUpperCase(), margin + 10 + boldLabelWidth, textY);
    textY += 6;
        
    doc.setFont("helvetica", "bold");
    const line7Label = "A:";
    doc.text(line7Label, margin + 10, textY);
    const line7LabelWidth = doc.getTextWidth(line7Label);
    doc.setFont("helvetica", "normal");
    doc.text((data.city || "").toUpperCase(), margin + 10 + line7LabelWidth + 2, textY);
    textY += 6;
    
    doc.setFont("helvetica", "bold");
    doc.text("Signature:", margin + 10, textY);
    
    if (data.signature) {
      try {
        doc.addImage(data.signature, 'PNG', margin + 10, textY + 2, 40, 15);
      } catch {
        doc.text("Signature non disponible", margin + 10, textY + 10);
      }
    }
    textY += 15;

    yPos = yPos + declBoxHeight + 10;

    // -----------------------------
    // Footer Section
    // -----------------------------
    const footerHeight = 20;
    doc.setFillColor(primaryColor);
    doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, 'F');
    doc.setTextColor("#FFF");
    doc.setFontSize(9);
    const footerY = pageHeight - footerHeight + 7;
    doc.text("Contact: contact@entreprise.com | Tél: 01 23 45 67 89", margin, footerY);
    doc.text("SIRET: 123 456 789 00034 | RCS Paris", margin, footerY + 5);

    doc.save("attestation_professionnelle.pdf");
  };

  // ------------------------------------------------------------------
  // Fonction utilitaire pour formater la date et l'heure
  // ------------------------------------------------------------------
  function formatDateTime(dateString?: string): string {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      // Format date-time and replace ':' with 'h'
      const formatted = date.toLocaleString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/:/g, "h");
      // Insert " à " after the date part (assumes format dd/mm/yyyy)
      return formatted.replace(/^(\d{2}\/\d{2}\/\d{4})\s*/, "$1 à ");
    } catch {
      return dateString;
    }
  }
  
  // Gestion de la soumission du formulaire
  const handleGenerateAttestation = () => {
    if (!signaturePadRef.current && canvasRef.current) {
      initializeSignaturePad();
      console.log("Signature pad initialized on demand");
    }

    if (!signaturePadRef.current) {
      console.error("Signature pad not initialized");
      alert("Erreur: La zone de signature n'est pas initialisée correctement. Veuillez réessayer.");
      return;
    }

    if (signaturePadRef.current.isEmpty()) {
      alert("Veuillez signer le document avant de continuer.");
      return;
    }

    try {
      const signatureData = signaturePadRef.current.toDataURL('image/png');
      const finalData = {
        ...attestationData,
        signature: signatureData,
        signatureDate: attestationData.signatureDate || new Date().toISOString().split('T')[0],
      };

      console.log("Form submitted with data:", finalData);
      generatePDF(finalData);
      setShowAttestationModal(false);
    } catch (error) {
      console.error("Error generating attestation:", error);
      alert("Une erreur s'est produite lors de la génération du document. Veuillez réessayer.");
    }
  };

  return (
    <>
      <Button 
        onClick={() => setShowAttestationModal(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl ml-2 shadow-md"
      >
        Générer Attestation
      </Button>

      <Modal
        isOpen={showAttestationModal}
        onAfterOpen={initializeSignaturePad}
        onRequestClose={() => setShowAttestationModal(false)}
        contentLabel="Générer une Attestation d'Intervention S.A.V."
        className="fixed inset-0 flex items-center justify-center p-4 sm:p-8 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 transition-opacity"
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl mx-auto p-6 sm:p-8 border border-gray-200 dark:border-gray-700 transition-all transform overflow-y-auto"
          style={{ maxHeight: '80vh' }}
        >
          <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-gray-700">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white">
              Générer une Attestation d&apos;Intervention S.A.V.
            </h2>
            <button
              onClick={() => setShowAttestationModal(false)}
              className="text-gray-500 hover:text-gray-800 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Fermer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerateAttestation();
            }}
            className="space-y-8"
          >
            {/* Section Informations Client */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informations Client</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label htmlFor="customerName" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Nom du client
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    value={attestationData.customerName}
                    onChange={(e) =>
                      setAttestationData(prev => ({ ...prev, customerName: e.target.value }))
                    }
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Entrez le nom du client"
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label htmlFor="address" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Adresse
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={attestationData.address}
                    onChange={(e) =>
                      setAttestationData(prev => ({ ...prev, address: e.target.value }))
                    }
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Adresse complète"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Code Postal
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    value={attestationData.postalCode}
                    onChange={(e) =>
                      setAttestationData(prev => ({ ...prev, postalCode: e.target.value }))
                    }
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Ex: 75001"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Ville
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={attestationData.city}
                    onChange={(e) =>
                      setAttestationData(prev => ({ ...prev, city: e.target.value }))
                    }
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Ex: Paris"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Tél portable
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={attestationData.phone}
                    onChange={(e) =>
                      setAttestationData(prev => ({ ...prev, phone: e.target.value }))
                    }
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Ex: 06 12 34 56 78"
                  />
                </div>
                <div>
                <label htmlFor="interventionDate" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Date de l&apos;intervention
                </label>
                <div className="relative">
                  <input
                    id="interventionDate"
                    type="datetime-local"
                    lang="fr"
                    value={attestationData.interventionDate}
                    onChange={(e) =>
                      setAttestationData(prev => ({ ...prev, interventionDate: e.target.value }))
                    }
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    {/* Optional SVG icon */}
                  </div>
                </div>
                </div>
              </div>
            </div>
            
            {/* Section équipe technique */}
            <div className="space-y-6 pt-6 border-t dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">ENCADRÉ RÉSERVÉ À L&apos;ÉQUIPE TECHNIQUE</h3>
              <div>
                <label htmlFor="interventionDetails" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Détail de l&apos;intervention
                </label>
                <textarea
                  id="interventionDetails"
                  value={attestationData.interventionDetails}
                  onChange={(e) =>
                    setAttestationData(prev => ({ ...prev, interventionDetails: e.target.value }))
                  }
                  rows={5}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Décrivez les détails de l'intervention technique..."
                ></textarea>
              </div>
            </div>
            
            {/* Section Signature */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Signature
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Utilisez votre souris ou votre doigt pour signer dans la zone ci-dessous.
              </p>
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-white">
                <div 
                  className="w-full h-48 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center relative cursor-crosshair"
                  ref={signatureRef}
                >
                  {!attestationData.signature && (
                    <div className="text-gray-400 dark:text-gray-500 absolute pointer-events-none">
                      Cliquez ou touchez ici pour signer
                    </div>
                  )}
                </div>
                <div className="flex justify-between mt-2">
                  <div className="text-sm text-gray-500">
                    {signaturePadRef.current && !signaturePadRef.current.isEmpty() ? "Signature enregistrée" : ""}
                  </div>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="text-sm text-gray-400 dark:text-gray-700 hover:text-red-500 dark:hover:text-red-400"
                  >
                    Effacer la signature
                  </button>
                </div>
              </div>
            </div>
            
            {/* Boutons Annuler / Enregistrer */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t dark:border-gray-700">
              <Button
                type="button"
                className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-300 dark:text-gray-300 font-medium transition-colors"
                onClick={() => setShowAttestationModal(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Enregistrer
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};


export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<SavEvent | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<"month" | "week" | "day" | "agenda">(Views.MONTH);
  const [activeViewTab, setActiveViewTab] = useState("Mois");
  // Date range and grouping state
  const [dateRange ] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: subDays(new Date(), 7),
    endDate: new Date(),
  });
  const [dataGrouping,  ] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("weekly");

  // For the S.A.V. filter tabs
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Sample S.A.V. events
  const savEvents: SavEvent[] = [
    {
      id: "1",
      status: "completed", // Must be exactly one of: "completed", "pending", "scheduled"
      priority: "medium",  // Allowed: "high", "medium", "low"
      customer: "Alice Johnson",
      date: "2024-03-10T14:00:00.000Z",
      technician: "Technicien A",
      address: "123 Main St, Paris",
      problem: "Panne de chauffage",
      equipmentType: "Pompe à chaleur",
      notes: "Installation récente, problème de configuration",
      conversation: [
        {
          sender: "Alice Johnson",
          content: "La panne a été résolue rapidement.",
          timestamp: "2024-03-10T14:30:00.000Z",
        },
        {
          sender: "Technicien A",
          content: "Merci pour votre retour.",
          timestamp: "2024-03-10T14:35:00.000Z",
        },
      ],
    },
    {
      id: "2",
      status: "pending",
      priority: "high",
      customer: "Jean Martin",
      date: "2024-03-11T16:30:00.000Z",
      technician: "Technicien B",
      address: "456 Rue de Lyon, Lyon",
      problem: "Fuite d'eau importante",
      equipmentType: "Chauffe-eau solaire individuel",
      notes: "Fuite détectée lors de la vérification de routine, intervention urgente nécessaire",
      conversation: [
        {
          sender: "Jean Martin",
          content: "L'eau s'accumule rapidement dans la cave.",
          timestamp: "2024-03-11T16:45:00.000Z",
        },
      ],
    },
    {
      id: "3",
      status: "scheduled",
      priority: "low",
      customer: "Marie Dubois",
      date: "2024-03-12T10:00:00.000Z",
      technician: "Technicien C",
      address: "789 Rue Victor Hugo, Marseille",
      problem: "Maintenance programmée",
      equipmentType: "Système Solaire Combiné",
      notes: "Entretien annuel prévu pour vérifier le système",
      conversation: [],
    },
    {
      id: "4",
      status: "completed",
      priority: "medium",
      customer: "Sophie Laurent",
      date: "2024-03-13T09:00:00.000Z",
      technician: "Technicien D",
      address: "321 Rue de Rivoli, Paris",
      problem: "Problème de thermostat",
      equipmentType: "Pompe à chaleur",
      notes: "Remplacement du thermostat effectué, intervention réussie",
      conversation: [
        {
          sender: "Sophie Laurent",
          content: "Le remplacement a fonctionné parfaitement.",
          timestamp: "2024-03-13T09:45:00.000Z",
        },
        {
          sender: "Technicien D",
          content: "Heureux d'avoir pu aider !",
          timestamp: "2024-03-13T09:50:00.000Z",
        },
      ],
    },
    {
      id: "5",
      status: "pending",
      priority: "high",
      customer: "Luc Moreau",
      date: "2024-03-14T14:30:00.000Z",
      technician: "Technicien E",
      address: "654 Avenue des Champs-Élysées, Paris",
      problem: "Dysfonctionnement du système de ventilation",
      equipmentType: "Chauffe-eau thermodynamique",
      notes: "Signalement urgent, l'intervention est en cours",
      conversation: [
        {
          sender: "Luc Moreau",
          content:
            "Le système ne fonctionne pas du tout, j'ai besoin d'une solution rapide.",
          timestamp: "2024-03-14T14:45:00.000Z",
        },
        {
          sender: "Technicien E",
          content: "Nous sommes sur le coup, merci de votre patience.",
          timestamp: "2024-03-14T14:55:00.000Z",
        },
      ],
    },
    {
      id: "6",
      status: "scheduled",
      priority: "medium",
      customer: "Claire Petit",
      date: "2024-03-15T11:00:00.000Z",
      technician: "Technicien F",
      address: "987 Boulevard Saint-Germain, Paris",
      problem: "Vérification annuelle de la chaudière",
      equipmentType: "Chaudière à condensation",
      notes: "Inspection de routine programmée pour le contrôle de sécurité",
      conversation: [],
    },
    {
      id: "7",
      status: "completed",
      priority: "low",
      customer: "Antoine Lefèvre",
      date: "2024-03-16T08:30:00.000Z",
      technician: "Technicien G",
      address: "159 Rue de la République, Lyon",
      problem: "Mise à jour du logiciel de contrôle",
      equipmentType: "Système de gestion énergétique",
      notes: "Mise à jour effectuée sans interruption de service",
      conversation: [
        {
          sender: "Antoine Lefèvre",
          content: "Tout fonctionne mieux après la mise à jour.",
          timestamp: "2024-03-16T08:45:00.000Z",
        },
      ],
    },
  ];
  
  // Prepare RBC events
  // const bigCalEvents = useMemo(() => eventsForCalendar(savEvents), [savEvents]);

  // Ticket data for charts
  const processedData = useMemo(() => {
    if (!dateRange.startDate || !dateRange.endDate) return [];
    return processTicketData(tickets, dateRange);
  }, [tickets, dateRange, dataGrouping]);

  // Compute resolution rate
  const resolutionRate = useMemo(() => {
    const totalTickets = processedData.reduce((acc, curr) => acc + curr.tickets, 0);
    const totalSolutions = processedData.reduce(
      (acc, curr) => acc + curr.solutions,
      0
    );
    return totalTickets > 0
      ? Math.round((totalSolutions / totalTickets) * 100)
      : 0;
  }, [processedData]);

    // Filter S.A.V. events
    const filteredSavEvents = useMemo(() => {
      if (activeFilter === "all") return savEvents;
      return savEvents.filter((event) => event.status === activeFilter);
    }, [savEvents, activeFilter]);



// Event handlers
// const handleSelectEvent = (event: CalendarEvent): void => {
//   console.log('Event selected:', event);
//   // Open event details modal
// };

// const handleSelectSlot = (slotInfo: SlotInfo): void => {
//   console.log('Slot selected:', slotInfo);
//   // Open new event creation modal
// };

  // Fetch tickets on mount
  useEffect(() => {
    fetch("/api/tickets")
      .then((res) => res.json())
      .then((data: Ticket[]) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tickets:", err);
        setError("Error loading tickets");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#bfddf9]/5 to-white">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 mb-4 rounded-full border-4 border-[#bfddf9] border-t-[#213f5b] mx-auto"></div>
          <p className="text-[#213f5b] font-medium">Chargement des données...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#bfddf9]/5 to-white">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-200 max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <LifebuoyIcon className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-[#213f5b] mb-2">
            Erreur de chargement
          </h1>
          <p className="text-[#5a6e87] mb-4">{error}</p>
          <Button
            className="bg-[#213f5b] hover:bg-[#162c41] text-white px-6 py-3"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </div>
      </div>
    );

  // Compute some support metrics
  // (Adjust if your statuses differ)
  const openTickets = tickets.filter(
    (ticket) => ticket.statut.toLowerCase() === "ouvert"
  ).length;
  const pendingTickets = tickets.filter(
    (ticket) => ticket.statut.toLowerCase() === "pending"
  ).length;
  const closedTickets = tickets.filter(
    (ticket) => ticket.statut.toLowerCase() === "closed"
  ).length;

  // Quick range helpers
  // const isQuickRangeActive = (days: number): boolean => {
  //   if (!dateRange.startDate || !dateRange.endDate) return false;
  //   const diff =
  //     (dateRange.endDate.getTime() - dateRange.startDate.getTime()) /
  //     (1000 * 60 * 60 * 24);
  //   return diff === days;
  // };

  // const setQuickRange = (days: number): void => {
  //   const newStart = subDays(new Date(), days);
  //   const newEnd = new Date();
  //   setDateRange({ startDate: newStart, endDate: newEnd });
  // };


  // For calendar event styling (color-coded by status)
  // const eventPropGetter = (event: SavEvent) => {
  //   let bgColor = "#3b82f6"; // default blue
  //   if (event.status === "completed") bgColor = "#10b981"; // green
  //   if (event.status === "pending") bgColor = "#f59e0b"; // amber
  //   if (event.status === "scheduled") bgColor = "#2563eb"; // lighter blue

  //   const style = {
  //     backgroundColor: bgColor,
  //     color: "#fff",
  //     borderRadius: "8px",
  //     border: "none",
  //     padding: "4px 6px",
  //     // Adjust more if you like
  //   };
  //   return { style };
  // };

  // Format x-axis
  // const formatXAxis = (value: string, grouping: string): string => {
  //   const date = new Date(value);
  //   switch (grouping) {
  //     case "daily":
  //       return format(date, "d MMM", { locale: fr });
  //     case "weekly":
  //       return `Sem. ${format(date, "w", { locale: fr })}`;
  //     case "monthly":
  //       return format(date, "MMM yyyy", { locale: fr });
  //     case "yearly":
  //       return format(date, "yyyy", { locale: fr });
  //     default:
  //       return value;
  //   }
  // };

  // Format tooltip
  // const formatTooltipDate = (label: string, grouping: string): string => {
  //   switch (grouping) {
  //     case "weekly":
  //       return `Semaine ${label}`;
  //     case "monthly":
  //       return format(new Date(label), "MMMM yyyy", { locale: fr });
  //     case "yearly":
  //       return `Année ${label}`;
  //     default:
  //       return format(new Date(label), "d MMMM yyyy", { locale: fr });
  //   }
  // };

  interface CustomCSSProperties extends React.CSSProperties {
    '--c-primary'?: string;
    '--c-secondary'?: string;
    '--c-accent'?: string;
  }  

   // Handlers for navigation buttons
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

  // Handle view tab changes
  const viewTabs = ["Mois", "Semaine", "Jour", "Agenda"];
  const handleViewChange = (view: string) => {
    setActiveViewTab(view);
    if (view === "Mois") {
      setCurrentView(Views.MONTH);
    } else if (view === "Semaine") {
      setCurrentView(Views.WEEK);
    } else if (view === "Jour") {
      setCurrentView(Views.DAY);
    } else if (view === "Agenda") {
      setCurrentView(Views.AGENDA);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-white to-[#bfddf9]/5">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          {/* Page Title & Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-[#213f5b] rounded-2xl p-3 mr-4 shadow-lg">
                <LifebuoyIcon className="h-7 w-7 text-[#d2fcb2]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#213f5b] mb-1">
                  Support & S.A.V.
                </h1>
                <p className="text-[#5a6e87] font-medium">
                  {new Date().toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex mt-4 sm:mt-0 items-center">
              <Button
                variant="ghost"
                className="bg-white mr-2 border border-[#bfddf9] rounded-xl h-12 w-12 flex items-center justify-center shadow-sm hover:bg-[#bfddf9]/10"
              >
                <div className="relative">
                  <BellIcon className="h-6 w-6 text-[#213f5b]" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    3
                  </span>
                </div>
              </Button>

              <Button className="bg-[#213f5b] hover:bg-[#162c41] text-white rounded-xl shadow-md">
                <PlusIcon className="h-5 w-5 mr-2 text-[#d2fcb2]" />
                Nouveau Ticket
              </Button>

              {/* Attestation Modal */}
              <AttestationModal/>

            </div>
          </div>

          {/* Metrics Overview Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Tickets Ouverts */}
            <div className="bg-white rounded-2xl shadow-md border border-[#bfddf9]/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <LifebuoyIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#213f5b]">
                      Tickets Ouverts
                    </h3>
                    <p className="text-2xl font-bold text-red-600">
                      {openTickets}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-transparent h-1.5">
                <div className="bg-red-500 h-full w-1/3" />
              </div>
            </div>

            {/* Tickets en attente de traitement */}
            <div className="bg-white rounded-2xl shadow-md border border-[#bfddf9]/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#213f5b]">
                      Tickets en attente
                    </h3>
                    <p className="text-2xl font-bold text-yellow-600">
                      {pendingTickets}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-transparent h-1.5">
                <div className="bg-yellow-500 h-full w-1/4" />
              </div>
            </div>

            {/* Tickets clôturés */}
            <div className="bg-white rounded-2xl shadow-md border border-[#bfddf9]/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#213f5b]">
                      Tickets clôturés
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      {closedTickets}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-transparent h-1.5">
                <div className="bg-green-500 h-full w-3/4" />
              </div>
            </div>

            {/* Résolution */}
            <div className="bg-white rounded-2xl shadow-md border border-[#bfddf9]/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#213f5b]/10 rounded-xl">
                    <ShieldCheckIcon className="h-6 w-6 text-[#213f5b]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#213f5b]">
                      Résolution
                    </h3>
                    <p className="text-2xl font-bold text-[#213f5b]">
                      {resolutionRate}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#213f5b]/10 to-transparent h-1.5">
                <div
                  className="bg-[#213f5b] h-full"
                  style={{ width: `${resolutionRate}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* MAIN GRID: Left = S.A.V. Planning (List), Right = Calendar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT: S.A.V. Planning List */}
            <motion.div
              className="space-y-8"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {/* S.A.V. Planning Section */}
              <motion.div
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#bfddf9]"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-[#213f5b] to-[#1d3349] p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                        <CalendarIcon className="h-7 w-7 text-[#d2fcb2]" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold">
                          Planning S.A.V.
                        </h2>
                        <p className="text-white/80 font-medium mt-1">
                          Interventions programmées •{" "}
                          {new Date().toLocaleDateString("fr-FR", {
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        className="bg-white/10 hover:bg-white/20 text-white rounded-xl h-10"
                      >
                        <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                        Exporter
                      </Button>

                      <Button
                        variant="ghost"
                        className="bg-white/10 hover:bg-white/20 text-white rounded-xl h-10 w-10 p-0 flex items-center justify-center"
                      >
                        <AdjustmentsHorizontalIcon className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-[#f8fbff] px-6 py-3 border-b border-[#bfddf9]">
                  <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                    {["all", "scheduled", "pending", "completed"].map((filter) => (
                      <Button
                        key={filter}
                        className={`rounded-xl px-4 py-2 whitespace-nowrap ${
                          activeFilter === filter
                            ? "bg-[#213f5b] text-white shadow-md"
                            : "bg-white border border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9]/10"
                        }`}
                        onClick={() => setActiveFilter(filter)}
                      >
                        {filter === "all"
                          ? "Toutes"
                          : filter === "scheduled"
                          ? "Planifiées"
                          : filter === "pending"
                          ? "En cours"
                          : "Terminées"}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Statistics Summary */}
                <div className="grid grid-cols-3 gap-6 p-6">
                  <div className="p-5 bg-[#d2fcb2]/10 rounded-xl border border-[#d2fcb2]/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#d2fcb2] rounded-xl">
                        <CheckCircleIcon className="h-6 w-6 text-[#213f5b]" />
                      </div>
                      <div>
                        <div className="text-sm text-[#5a6e87]">Terminées</div>
                        <div className="text-2xl font-bold text-[#213f5b]">
                          18
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 h-2 bg-[#d2fcb2]/20 rounded-full">
                      <div className="w-4/5 h-full bg-[#d2fcb2] rounded-full" />
                    </div>
                  </div>

                  <div className="p-5 bg-[#bfddf9]/10 rounded-xl border border-[#bfddf9]/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#bfddf9] rounded-xl">
                        <ClockIcon className="h-6 w-6 text-[#213f5b]" />
                      </div>
                      <div>
                        <div className="text-sm text-[#5a6e87]">En Cours</div>
                        <div className="text-2xl font-bold text-[#213f5b]">
                          5
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 h-2 bg-[#bfddf9]/20 rounded-full">
                      <div className="w-1/3 h-full bg-[#bfddf9] rounded-full animate-pulse" />
                    </div>
                  </div>

                  <div className="p-5 bg-[#213f5b]/5 rounded-xl border border-[#213f5b]/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#213f5b] rounded-xl">
                        <DocumentCheckIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-[#5a6e87]">Attestations</div>
                        <div className="text-2xl font-bold text-[#213f5b]">
                          12
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 h-2 bg-[#213f5b]/10 rounded-full">
                      <div className="w-2/3 h-full bg-[#213f5b] rounded-full" />
                    </div>
                  </div>
                </div>

                {/* List of S.A.V. Events */}
                <div className="px-6 pb-6 space-y-4">
                  {filteredSavEvents.length > 0 ? (
                    filteredSavEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        className="bg-white rounded-xl border border-[#bfddf9] shadow-sm p-5 hover:shadow-md transition-all duration-300 cursor-pointer"
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-start gap-4">
                          {/* Status Indicator + Priority */}
                          <div className="mt-1.5 relative">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                event.status === "completed"
                                  ? "bg-green-500 ring-4 ring-green-100"
                                  : event.status === "pending"
                                  ? "bg-amber-500 ring-4 ring-amber-100 animate-pulse"
                                  : "bg-blue-500 ring-4 ring-blue-100"
                              }`}
                            />
                            {event.priority === "high" && (
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold text-[#213f5b] flex items-center gap-2">
                                  {event.customer}
                                  {event.priority === "high" && (
                                    <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                                      Urgent
                                    </span>
                                  )}
                                </h3>
                                <p className="text-[#5a6e87] text-sm mt-1">
                                  {event.problem || "Intervention programmée"}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-[#213f5b] font-medium">
                                  {new Date(event.date).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "short",
                                  })}
                                </p>
                                <p className="text-sm text-[#5a6e87]">
                                  {new Date(event.date).toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* Badges for technician, address, etc. */}
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-[#f8fbff] text-[#5a6e87]">
                                <UserCircleIcon className="h-3.5 w-3.5 mr-1" />
                                {event.technician}
                              </span>

                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-[#f8fbff] text-[#5a6e87]">
                                <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                                {event.address}
                              </span>

                              {event.equipmentType && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-[#f8fbff] text-[#5a6e87]">
                                  {energySolutions[event.equipmentType] ? (
                                    <>
                                      {(() => {
                                        const Icon =
                                          energySolutions[event.equipmentType].icon;
                                        const color =
                                          energySolutions[event.equipmentType].color;
                                        return (
                                          <Icon
                                            className="h-3.5 w-3.5 mr-1"
                                            style={{ color }}
                                          />
                                        );
                                      })()}
                                      {event.equipmentType}
                                    </>
                                  ) : (
                                    <>
                                      <FireIcon className="h-3.5 w-3.5 mr-1 text-[#213f5b]" />
                                      {event.equipmentType}
                                    </>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center text-[#5a6e87] py-4">
                      Aucune intervention trouvée.
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>

            {/* RIGHT: Enhanced Big Calendar (French) */}
            <motion.div
              className="space-y-8"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <motion.div
                className="bg-white rounded-3xl overflow-hidden border border-[#e0eeff]"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* En-tête du calendrier */}
                <div className="bg-gradient-to-r from-[#1a365d] to-[#0f2942] p-7 text-white">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-5">
                      <div className="p-4 bg-white/15 rounded-2xl backdrop-blur-md flex items-center justify-center">
                        <CalendarIcon className="h-8 w-8 text-[#e2ffc2]" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">Calendrier S.A.V.</h2>
                        <p className="text-white/90 font-medium mt-1.5">
                          Planifiez, gérez et organisez vos rendez-vous
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative group">
                        <button className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors">
                          <BellIcon className="h-5 w-5" />
                        </button>
                        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 p-3 border border-gray-100">
                          <h4 className="font-semibold text-gray-800 mb-2">Notifications</h4>
                          <div className="space-y-2">
                            <div className="p-2 bg-blue-50 rounded-lg border-l-4 border-blue-500 text-sm">
                              <p className="font-medium text-blue-800">Réunion d&apos;équipe</p>
                              <p className="text-blue-700 mt-1">Aujourd&apos;hui, 14:00 - 15:30</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative group">
                        <button className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors">
                          <UserCircleIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleToday}
                        className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-sm font-medium backdrop-blur-md flex items-center gap-2"
                      >
                        <CalendarDaysIcon className="h-4 w-4" />
                        Aujourd&apos;hui
                      </button>
                      <div className="flex gap-1.5">
                        <button
                          onClick={handlePrev}
                          className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
                        >
                          <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={handleNext}
                          className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
                        >
                          <ChevronRightIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {currentDate.toLocaleString("fr-FR", { month: "long", year: "numeric" })}
                    </h3>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="relative flex-1 sm:flex-none">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <SearchIcon className="h-4 w-4 text-white/60" />
                        </div>
                        <input
                          type="text"
                          placeholder="Rechercher un événement..."
                          className="w-full sm:w-64 text-sm border-none bg-white/15 hover:bg-white/20 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-white placeholder-white/60"
                        />
                      </div>
                      <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#e2ffc2] to-[#c5f7a5] hover:opacity-90 text-[#1a365d] rounded-xl text-sm font-semibold transition-colors">
                        <PlusIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Nouvel événement</span>
                        <span className="sm:hidden">Nouveau</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Onglets de vue */}
                <div className="px-4 sm:px-7 pt-4 bg-white border-b border-gray-100 overflow-x-auto">
                  <div className="flex gap-2 min-w-max">
                    {viewTabs.map((view, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleViewChange(view)}
                        className={`px-3 sm:px-5 py-2.5 text-sm font-medium rounded-t-xl transition-colors ${
                          activeViewTab === view
                            ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {view}
                      </motion.button>
                    ))}
                    <div className="ml-auto flex items-center gap-2">
                      <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
                        <SunIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
                        <ChartBarIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Composant Calendrier */}
                <div className="p-4 sm:p-7 pt-5">
                  <motion.div 
                    className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Calendar
                      localizer={localizer}
                      events={sampleEvents}
                      startAccessor="start"
                      endAccessor="end"
                      date={currentDate}
                      view={currentView}
                      onNavigate={(date) => setCurrentDate(date)}
                      onView={(view) => setCurrentView(view as "month" | "week" | "day" | "agenda")}
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
                      eventPropGetter={(event) => ({
                        style: {
                          backgroundColor: event.type === "réunion" ? "var(--c-primary)" : "var(--c-accent)",
                          border: `1px solid ${event.type === "réunion" ? "var(--c-secondary)" : "#b3e19f"}`,
                          borderRadius: "10px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          color: event.type === "réunion" ? "white" : "var(--c-secondary)",
                          padding: "8px 14px",
                          fontSize: "0.875rem",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        },
                      })}
                      dayPropGetter={(date) => ({
                        className:
                          date.getDate() === new Date().getDate()
                            ? "jour-actuel bg-gradient-to-br from-blue-50/70 to-blue-100/40 border-l-4 border-blue-500"
                            : "",
                      })}
                      components={{
                        event: ({ event }) => (
                          <motion.div
                            className="h-full p-2"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.03, y: -1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`h-2.5 w-2.5 rounded-full mt-1.5 ${event.type === "réunion" ? "bg-white/90" : "bg-[#1a365d]/80"}`} />
                              <div className="flex-1">
                                <p className="font-medium truncate">{event.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <ClockIcon className={`h-3.5 w-3.5 ${event.type === "réunion" ? "text-white/80" : "text-gray-600"}`} />
                                  <span className={`text-xs font-medium ${event.type === "réunion" ? "text-white/90" : "text-gray-600"}`}>
                                    {event.start.toLocaleTimeString("fr-FR", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                  {event.location && (
                                    <>
                                      <span className={`${event.type === "réunion" ? "text-white/60" : "text-gray-400"}`}>•</span>
                                      <MapPinIcon className={`h-3.5 w-3.5 ${event.type === "réunion" ? "text-white/80" : "text-gray-600"}`} />
                                      <span className={`text-xs ${event.type === "réunion" ? "text-white/90" : "text-gray-600"}`}>{event.location}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1 hover:bg-white/10 rounded-full">
                                  <EllipsisHorizontalIcon className={`h-4 w-4 ${event.type === "réunion" ? "text-white/90" : "text-gray-600"}`} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ),
                        toolbar: ( ) => (
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
                              className="flex items-center gap-4 p-4 my-2.5 bg-white border-l-4 border-[#1a365d] rounded-xl shadow-sm hover:shadow-md transition-all group"
                              whileHover={{ x: 5, backgroundColor: "#f8fafc" }}
                            >
                              <div className={`h-3.5 w-3.5 rounded-full ${event.type === "réunion" ? "bg-[#c5f7a5]" : "bg-[#1a365d]"}`} />
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{event.title}</p>
                                <div className="flex flex-wrap items-center gap-y-2 gap-x-3 mt-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <ClockIcon className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                      {event.start.toLocaleTimeString("fr-FR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                      {" - "}
                                      {event.end.toLocaleTimeString("fr-FR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                  <span className="text-gray-400 hidden sm:inline">|</span>
                                  <div className="flex items-center gap-1.5">
                                    <UserCircleIcon className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                      {event.participants || "Aucun participant"}
                                    </span>
                                  </div>
                                  {event.location && (
                                    <>
                                      <span className="text-gray-400 hidden sm:inline">|</span>
                                      <div className="flex items-center gap-1.5">
                                        <MapPinIcon className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">{event.location}</span>
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
                              <p className={`text-xl ${date.getDate() === new Date().getDate() ? "text-blue-600 font-bold" : "text-gray-800 font-semibold"}`}>
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
                                  {date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                                </p>
                              </div>
                              <div className="flex items-center justify-center text-sm text-blue-700">
                                {isToday(date) && (
                                  <span className="px-3 py-1 bg-blue-100 rounded-full font-medium">Aujourd&apos;hui</span>
                                )}
                              </div>
                            </div>
                          ),
                        },
                      }}
                      popup
                      selectable
                      onSelectEvent={(event) => console.log("Événement sélectionné:", event)}
                      onSelectSlot={(slotInfo) => console.log("Créneau sélectionné:", slotInfo)}
                      culture="fr"
                    />
                  </motion.div>
                </div>

                {/* Custom CSS */}
                <style jsx global>{`
                  .calendrier-premium {
                    .rbc-month-view,
                    .rbc-time-view {
                      border: none;
                      background: linear-gradient(to bottom right, #f8fafc, #ffffff);
                      border-radius: 12px;
                      overflow: hidden;
                    }
                    .rbc-header {
                      padding: 1.25rem 1rem;
                      background: #f9fafb;
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
                      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
                      transform-origin: center;
                      transition: transform 0.2s, box-shadow 0.2s;
                    }
                    .rbc-event:hover {
                      transform: translateY(-2px);
                      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
                      z-index: 5;
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
                    
                    /* Support mobile */
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
                        padding: 4px 8px !important;
                      }
                      .rbc-day-slot .rbc-events-container {
                        margin-right: 0;
                      }
                    }
                    
                    /* Amélioration des en-têtes de la semaine */
                    .rbc-time-header-content .rbc-header {
                      background: linear-gradient(to bottom, #eef2ff, #f9fafb);
                      padding: 1rem;
                      height: auto;
                    }
                    
                    /* Amélioration des en-têtes du mois */
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

                {/* Pied de page - Actions rapides */}
                <div className="px-4 sm:px-7 py-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#1a365d] to-[#0f2942] hover:from-[#1e4269] hover:to-[#133356] text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
                      <CalendarDaysIcon className="h-4 w-4" />
                      Synchroniser
                    </button>
                    <div className="relative group">
                      <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <FunnelIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Filtrer</span>
                        <ChevronDownIcon className="h-4 w-4 ml-1" />
                      </button>
                      <div className="absolute left-0 top-full mt-2 p-3 bg-white rounded-xl shadow-lg z-10 border border-gray-100 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" checked />
                            <span>Réunions</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" checked />
                            <span>Rendez-vous clients</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" checked />
                            <span>Interventions</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center sm:justify-end w-full sm:w-auto">
                    <button className="flex-1 sm:flex-auto flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Exporter</span>
                    </button>
                    <button className="flex-1 sm:flex-auto flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <PrinterIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Imprimer</span>
                    </button>
                    <div className="relative group flex-1 sm:flex-auto">
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <Cog6ToothIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Paramètres</span>
                        <ChevronDownIcon className="h-4 w-4 ml-1" />
                      </button>
                      <div className="absolute right-0 top-full mt-2 p-3 bg-white rounded-xl shadow-lg z-10 border border-gray-100 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="space-y-2">
                          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                            Apparence
                          </button>
                          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                            Notifications
                          </button>
                          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                            Intégrations
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>

          {/* Statistique S.A.V. (Line Chart) */}
          <SAVStatistics/>

          {/* IMPROVED SECTION: Unified S.A.V. Interface with Modern UI */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#bfddf9]">
            {/* Unified Header */}
            <div className="bg-gradient-to-r from-[#213f5b] to-[#1d3349] p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold">Toutes les S.A.V.</h2>
                  <p className="text-white/80 font-medium mt-1">
                    Gestion complète des interventions
                  </p>
                </div>
                {selectedEvent && (
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-white bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg px-4 py-2 transition-all duration-300 flex items-center gap-2"
                  >
                    <span>Retour</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row">
              {/* Left Panel - Event List (Hidden when event is selected on mobile) */}
              <div className={`border-r border-[#e5f1fd] ${selectedEvent ? 'hidden lg:block' : 'block'} lg:w-1/2`}>
                <div className="p-4">
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Rechercher une intervention..."
                      className="w-full pl-10 pr-4 py-2 bg-[#f5faff] border border-[#bfddf9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213f5b]"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#5a6e87] absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="max-h-[500px] overflow-auto pr-2">
                    {savEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        className={`mb-3 bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition-all duration-300 cursor-pointer ${
                          selectedEvent && selectedEvent.id === event.id
                            ? 'border-[#213f5b] bg-[#f5faff]'
                            : 'border-[#bfddf9]'
                        }`}
                        whileHover={{ x: 5 }}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Status indicator */}
                          <div className="mt-1.5 relative">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                event.status === "completed"
                                  ? "bg-green-500 ring-4 ring-green-100"
                                  : event.status === "pending"
                                  ? "bg-amber-500 ring-4 ring-amber-100 animate-pulse"
                                  : "bg-blue-500 ring-4 ring-blue-100"
                              }`}
                            />
                            <div className="absolute top-4 left-1.5 h-full w-px bg-[#e5f1fd]"></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="text-lg font-semibold text-[#213f5b]">
                                {event.customer}
                              </h3>
                              <div className="text-right">
                                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-[#f5faff] text-[#213f5b]">
                                  {new Date(event.date).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "short",
                                  })}
                                </span>
                              </div>
                            </div>
                            <p className="text-[#5a6e87] text-sm mt-1">
                              {event.problem || "Intervention programmée"}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-[#5a6e87]">
                                {new Date(event.date).toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                event.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : event.status === "pending"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}>
                                {event.status === "completed" ? "Terminé" : 
                                event.status === "pending" ? "En attente" : "En cours"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Panel - Conversation View (Full width when selected on mobile) */}
              <div className={`${selectedEvent ? 'block' : 'hidden lg:block'} lg:w-1/2 bg-[#fafcff]`}>
                {selectedEvent ? (
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b border-[#e5f1fd] bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            selectedEvent.status === "completed"
                              ? "bg-green-500 ring-4 ring-green-100"
                              : selectedEvent.status === "pending"
                              ? "bg-amber-500 ring-4 ring-amber-100"
                              : "bg-blue-500 ring-4 ring-blue-100"
                          }`} />
                          <div>
                            <h3 className="font-semibold text-[#213f5b]">{selectedEvent.customer}</h3>
                            <p className="text-sm text-[#5a6e87]">{selectedEvent.problem}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 rounded-lg text-[#213f5b] hover:bg-[#f5faff]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </button>
                          <button className="p-2 rounded-lg text-[#213f5b] hover:bg-[#f5faff]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-auto p-4 space-y-4">
                      {/* Conversation messages */}
                      {selectedEvent.conversation ? (
                        selectedEvent.conversation.map((msg, index) => (
                          <div 
                            key={index} 
                            className={`max-w-[80%] ${
                              msg.sender === "Technicien" 
                                ? "ml-auto bg-[#213f5b] text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl" 
                                : "bg-white border border-[#e5f1fd] shadow-sm rounded-tl-2xl rounded-tr-2xl rounded-br-2xl"
                            } p-4`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <p className={`text-sm font-semibold ${
                                msg.sender === "Technicien" ? "text-white/90" : "text-[#213f5b]"
                              }`}>
                                {msg.sender}
                              </p>
                              <span className={`text-xs ${
                                msg.sender === "Technicien" ? "text-white/70" : "text-[#5a6e87]"
                              }`}>
                                {new Date(msg.timestamp).toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </span>
                            </div>
                            <p className={`text-sm ${
                              msg.sender === "Technicien" ? "text-white/90" : "text-[#5a6e87]"
                            }`}>
                              {msg.content}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-[#5a6e87] p-6">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#bfddf9] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <p>Aucune conversation disponible pour cette intervention</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Message input area */}
                    <div className="p-4 border-t border-[#e5f1fd] bg-white">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Tapez votre message..."
                          className="flex-1 bg-[#f5faff] border border-[#bfddf9] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#213f5b]"
                        />
                        <button className="bg-[#213f5b] hover:bg-[#1a324a] text-white rounded-lg p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-[#5a6e87] p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#bfddf9] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <p className="font-medium text-lg text-[#213f5b] mb-1">Aucune conversation sélectionnée</p>
                    <p>Sélectionnez un S.A.V. dans la liste pour voir les détails</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
