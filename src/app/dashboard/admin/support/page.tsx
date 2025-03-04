"use client";

import React, {useRef} from 'react';
import SignaturePad from 'signature_pad';
import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NewTicketModal from './NewTicketModal';
import NewEventModal from './NewEventModal';
import {  subDays, eachDayOfInterval, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import axios from 'axios';
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { jsPDF } from 'jspdf';
import { LineChart, customTooltip } from "@/components/ui/Charts/LineChart";
import EventDetailsModal from "./Modal2";
// import jsPDF from "jspdf"; // Make sure to install jsPDF (npm install jspdf)
import Modal from "react-modal"; // Or use your preferred modal library

import {
  LifebuoyIcon,
  ClockIcon,
  CheckCircleIcon,
  // DocumentArrowDownIcon,
  // AdjustmentsHorizontalIcon,
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
import { CalendarDaysIcon, Clipboard, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, Clock, MapPin, MessageCircle, PencilIcon, PrinterIcon, SearchIcon, TrashIcon, User, X } from "lucide-react";


// Define your types (adjust as needed)
interface ConversationMessage {
  sender: string;
  content: string;
  timestamp: string;
}

export interface Ticket {
  customerLastName: string;
  customerFirstName: string;
  _id?: string;
  id: string;
  createdAt: string;
  ticket?: React.ReactNode;
  status: 'scheduled' | 'completed' | 'pending';
  statut: 'scheduled' | 'completed' | 'pending';
  priority: 'high' | 'medium' | 'low';
  customer: string;
  date: Date;
  technician: string;
  address: string;
  title: string;
  problem: string;
  start: Date; // Changed to Date
  end: Date;   // Changed to Date
  allDay: boolean;
  type: string;
  location: string;
  notes: string;
  participants: string;
  equipmentType: string; // Added missing property
  conversation?: ConversationMessage[];
}

// Ensure moment is using French
moment.locale("fr");
const localizer = momentLocalizer(moment);

// Define your event type
interface SavEvent {
  end: Date;
  start: Date;
  ticket?: React.ReactNode;
  title: string | undefined;
  id: string | number;
  customerFirstName?: string;
  customerLastName?: string;
  customer?: string;
  createdAt: string;
  technicianFirstName?: string;
  technicianLastName?: string;
  technician?: string;
  contactId?: string | number;
  status: "completed" | "pending" | "scheduled";
  priority?: "high" | "medium" | "low";
  date: Date;
  address: string;
  problem?: string;
  equipmentType?: string;
  notes?: string;
  type?: string;         // Used for conditional styling and as a potential title
  location?: string;     // To show location details
  participants?: string; // To list participants
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

interface ProcessedDataPoint {
  date?: string;
  label?: string;
  tickets: number;
  solutions: number;
  [key: string]: unknown;
}

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
  lastName: string;
  firstName: string;
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

// Define props for the SAV event card component
interface SavEventCardProps {
  event: SavEvent;
  setSelectedEvent: (event: SavEvent) => void;
}

const SavEventCard: React.FC<SavEventCardProps> = ({ event, setSelectedEvent }) => {
  const [mailingAddress, setMailingAddress] = useState<string>("");

  useEffect(() => {
    if (event.contactId) {
      fetch(`/api/contacts/${event.contactId}`)
        .then((res) => res.json())
        .then((data) => {
          setMailingAddress(data.mailingAddress);
        })
        .catch((err) => console.error("Failed to fetch contact:", err));
    }
  }, [event.contactId]);

  const customerName = event.customerFirstName
    ? `${event.customerFirstName} ${event.customerLastName}`
    : event.customer || "";

  const technicianName = event.technicianFirstName
    ? `${event.technicianFirstName} ${event.technicianLastName}`
    : event.technician || "";

  return (
    <motion.div
      key={event.id}
      className="bg-white rounded-xl border border-[#bfddf9] shadow-sm p-5 hover:shadow-md transition-all duration-300 cursor-pointer"
      whileHover={{ x: 5 }}
      onClick={() => setSelectedEvent(event)}
    >
      <div className="flex items-start gap-4">
        {/* Status Indicator */}
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
        {/* Event Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-[#213f5b] flex items-center gap-2">
                {customerName}
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
                {new Date(event.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
              <p className="text-sm text-[#5a6e87]">
                {new Date(event.createdAt).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-[#f8fbff] text-[#5a6e87]">
              <UserCircleIcon className="h-3.5 w-3.5 mr-1" />
              {technicianName}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-[#f8fbff] text-[#5a6e87]">
              <MapPinIcon className="h-3.5 w-3.5 mr-1" />
              {mailingAddress}
            </span>
            {event.equipmentType && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-[#f8fbff] text-[#5a6e87]">
                {energySolutions[event.equipmentType]
                  ? (() => {
                      const Icon = energySolutions[event.equipmentType].icon;
                      const color = energySolutions[event.equipmentType].color;
                      return (
                        <>
                          <Icon className="h-3.5 w-3.5 mr-1" style={{ color }} />
                          {event.equipmentType}
                        </>
                      );
                    })()
                  : (
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
  );
};

interface Contact {
  mailingAddress: string;
  phone: string;
  // add other properties if needed
}

interface Client {
  _id: string;
  mailingAddress: string;
  firstName: string;
  lastName: string;
  phone: string;
  // add other properties as needed
}


const AttestationModal: React.FC = () => {
  const [showAttestationModal, setShowAttestationModal] = useState<boolean>(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [attestationData, setAttestationData] = useState<AttestationData>({
    lastName: '',
    firstName: '',
    ticketId: '',
    date: new Date().toISOString().split('T')[0],
    address: '',
    postalCode: '',
    city: '',
    phone: '',
    interventionDate: new Date().toISOString().slice(0, 16),
    interventionDetails: '',
    signatureDate: '',
    signatureLocation: '',
    signature: null,
  });
  const [techSectionRevealed, setTechSectionRevealed] = useState(false);
  const [clientSectionRevealed, setClientSectionRevealed] = useState(false);

  // Références pour le conteneur, le canvas et l'instance de SignaturePad
  const signatureRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  // Fetch client contacts from API on mount
  useEffect(() => {
    fetch('/api/contacts')
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((error) => console.error('Error fetching clients:', error));
  }, []);

  // Utility function to parse mailingAddress
  const parseMailingAddress = (mailingAddress: string) => {
    // Extract postal code (5 digits) and the rest as city from the mailing address string.
    const regex = /(\d{5})\s+(.+)$/;
    const match = mailingAddress.match(regex);
    if (match) {
      return { postalCode: match[1], city: match[2] };
    }
    return { postalCode: '', city: '' };
  };

  // Update attestationData when a client is selected from dropdown
  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = clients.find((c) => c._id === clientId);
    if (client) {
      const { postalCode, city } = parseMailingAddress(client.mailingAddress);
      setAttestationData((prev) => ({
        ...prev,
        lastName: client.lastName,
        firstName: client.firstName,
        address: client.mailingAddress,
        postalCode,
        city,
        phone: client.phone,
      }));
    }
  };

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
    // const lightText = "#718096";       

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
      { 
        label: "Nom du client", 
        value: ((data.lastName || "") + " " + (data.firstName || "")).trim() 
      },
      { label: "Adresse", value: data.address || "" },
      { label: "Code Postal", value: data.postalCode || "" },
      { label: "Ville", value: data.city || "" },
      { label: "Tél portable", value: data.phone || "" },
      { label: "Date de l'intervention", value: data.interventionDate ? `Le ${formatDateTime(data.interventionDate)}` : "" }
    ];

    clientInfo.forEach(info => {
      // Bold the label
      doc.setFont("helvetica", "bold");
      doc.setTextColor(textColor);
      doc.text(`${info.label}:`, margin, yPos);
      
      // Normal text for the value
      doc.setFont("helvetica", "normal");
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
    doc.setFont("helvetica", "normal");
    doc.text(((data.lastName || "") + " " + (data.firstName || "")).toUpperCase(), margin + 72, yPos+ 20);
    textY += 6;
    
    doc.setFont("helvetica", "bold");
    const line2Label1 = "Demeurant à l'adresse:";
    doc.text(line2Label1, margin + 10, textY);
    doc.setFont("helvetica", "normal");
    doc.text((data.address || "").toUpperCase(), margin + 12 + doc.getTextWidth(line2Label1) + 2, textY);
    textY += 6;

    // New line for Code Postal:
    doc.setFont("helvetica", "bold");
    const line2Label2 = "Code Postal:";
    doc.text(line2Label2, margin + 10, textY);
    doc.setFont("helvetica", "normal");
    doc.text((data.postalCode || "").toUpperCase(), margin + 10 + doc.getTextWidth(line2Label2) + 2, textY);
    textY += 6;
    doc.setFont("helvetica", "bold");
    const line2Label3 = "  Ville:";
    doc.text(line2Label3, margin + 8, textY);
    
    doc.setFont("helvetica", "normal");
    doc.text((data.city || "").toUpperCase(), margin + 10 + doc.getTextWidth(line2Label3) + 2, textY);
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
    
    doc.setFont("helvetica", "bold");
    const boldLabel = "Date: ";
    doc.text(boldLabel, margin + 10, textY);
    const boldLabelWidth = doc.getTextWidth(boldLabel);

    doc.setFont("helvetica", "normal");
    doc.text("Le " + formatDateOnly(data.signatureDate).toUpperCase(), margin + 10 + boldLabelWidth, textY);
    textY += 6;
        
    doc.setFont("helvetica", "bold");
    const line7Label = "A:";
    doc.text(line7Label, margin + 10, textY);
    doc.setFont("helvetica", "normal");
    doc.text((data.city || "").toUpperCase(), margin + 10 + doc.getTextWidth(line7Label) + 2, textY);
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
    doc.text("Contact: contact@ecologyb.fr | Tél: 09 52 02 81 36", margin, footerY);
    doc.text("SIRET: 891 318 438 00027 | RCS Pontoise", margin, footerY + 5);

    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    const clientName = (data.lastName || "CLIENT").toUpperCase();
    const fileName = `ATTESTATION_SAV_${clientName}_${randomNumber}.pdf`;

    doc.save(fileName);
  };

  function formatDateTime(dateString?: string): string {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const formatted = date.toLocaleString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/:/g, "h");
      return formatted.replace(/^(\d{2}\/\d{2}\/\d{4})\s*/, "$1 à ");
    } catch {
      return dateString;
    }
  }
  
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
  
    // Get signature data only if a signature exists
    let signatureData = "";
    if (!signaturePadRef.current.isEmpty()) {
      signatureData = signaturePadRef.current.toDataURL('image/png');
    }
  
    const finalData = {
      ...attestationData,
      signature: signatureData, // May be an empty string if no signature was provided
      signatureDate: attestationData.signatureDate || new Date().toISOString().split('T')[0],
    };
  
    console.log("Form submitted with data:", finalData);
    generatePDF(finalData);
    setShowAttestationModal(false);
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
            {/* Dropdown to choose a client */}
            <div className="mb-6">
              <label htmlFor="clientSelect" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Sélectionner un client
              </label>
              <select
                id="clientSelect"
                value={selectedClientId}
                onChange={(e) => handleClientSelect(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              >
                <option value="">-- Choisir un client --</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.firstName} {client.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Informations Client */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informations Client</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="lastName" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Nom
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={attestationData.lastName}
                    onChange={(e) =>
                      setAttestationData(prev => ({ ...prev, lastName: e.target.value }))
                    }
                    required
                    placeholder="Entrez le nom"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="firstName" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Prénom
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={attestationData.firstName}
                    onChange={(e) =>
                      setAttestationData(prev => ({ ...prev, firstName: e.target.value }))
                    }
                    required
                    placeholder="Entrez le prénom"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
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
                    placeholder="Adresse complète"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
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
                    maxLength={5}
                    pattern="\d{5}"
                    placeholder="Ex: 75001"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
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
                    placeholder="Ex: Paris"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Tél portable
                  </label>
                  <input
                    id="phone"
                    type="text"
                    value={attestationData.phone}
                    onChange={(e) =>
                      setAttestationData(prev => ({ ...prev, phone: e.target.value }))
                    }
                    required
                    pattern="\d+"
                    placeholder="Ex: 0612345678"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
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
            <div className="relative pt-6 border-t dark:border-gray-700">
              {!techSectionRevealed && (
                <button
                  type="button"
                  onClick={() => setTechSectionRevealed(true)}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 px-6 py-2.5 rounded-lg bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:border-red-700 hover:shadow-md font-medium transition-colors"
                >
                  Remplir pour l&apos;ÉQUIPE TECHNIQUE
                </button>
              
              )}
              <div className={`space-y-6 ${!techSectionRevealed ? "blur-sm pointer-events-none" : ""}`}>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  ENCADRÉ RÉSERVÉ À L&apos;ÉQUIPE TECHNIQUE
                </h3>
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
            </div>

            {/* Section Signature */}
            <div className="relative pt-6 border-t dark:border-gray-700">
              {!clientSectionRevealed && (
                <button
                  type="button"
                  onClick={() => setClientSectionRevealed(true)}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 px-6 py-2.5 rounded-lg bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:border-red-700 hover:shadow-md font-medium transition-colors"
                >
                  Remplir pour le CLIENT
                </button>
              )}
              <div className={`space-y-6 ${!clientSectionRevealed ? "blur-sm pointer-events-none" : ""}`}>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  ENCADRÉ RÉSERVÉ AU CLIENT
                </h3>
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
            </div>

            {/* Boutons Annuler / Enregistrer */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t dark:border-gray-700">
              <Button
                type="button"
                className="px-6 py-2.5 rounded-lg bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:border-red-700 hover:shadow-md font-medium transition-colors"
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<SavEvent | null>(null);
  const [activeEvent, setActiveEvent] = useState<SavEvent | null>(null);
  const [contact, setContact] = useState<Contact | null>(null);
  const [eventDetails, setEventDetails] = useState<SavEvent | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<"month" | "week" | "day" | "agenda">(Views.MONTH);
  const [activeViewTab, setActiveViewTab] = useState("Mois");
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
  // Inside your component
  const itemsPerPage = 5; // Adjust as needed
  const [currentPage, setCurrentPage] = useState(1);
  // These could be set via similar API calls for closedTickets and pendingTickets
  const [attestationsCount, setAttestationsCount] = useState(0);

  useEffect(() => {
    // Fetch attestations data from your API endpoint
    axios.get('/api/attestations')
      .then(response => {
        if (response.data.success) {
          // Set the count to the number of items returned by the API
          setAttestationsCount(response.data.data.length);
        }
      })
      .catch(error => {
        console.error('Error fetching attestations:', error);
      });
  }, []);

  // Calculate indices for slicing the events array
  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  
  // Handler to close the popup.
  const handleClosePopup = () => setEventDetails(null);

  // For the S.A.V. filter tabs
  const [activeFilter, setActiveFilter] = useState<string>("all");

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

    // Fetch the contact details when an event is selected
    useEffect(() => {
      if (selectedEvent && selectedEvent.contactId) {
        fetch(`/api/contacts/${selectedEvent.contactId}`)
          .then((res) => res.json())
          .then((data: Contact) => setContact(data))
          .catch((error) => {
            console.error("Error fetching contact data:", error);
            setContact(null);
          });
      }
    }, [selectedEvent]);

  // Fetch tickets from your API on mount and convert date strings to Date objects
  useEffect(() => {
    fetch('/api/tickets')
      .then((res) => res.json())
      .then((data: Ticket[]) => {
        const mappedTickets = data.map((ticket) => ({
          ...ticket,
          start: new Date(ticket.start),
          end: new Date(ticket.end),
          date: new Date(ticket.createdAt),
        }));
        setTickets(mappedTickets);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching tickets:', err);
        setError('Error loading tickets');
        setLoading(false);
      });
  }, []);

  const calendarEvents = tickets;

  const savEvents: Ticket[] = tickets;

  // Filter S.A.V. events
  const filteredSavEvents = useMemo(() => {
    if (activeFilter === "all") return savEvents;
    return savEvents.filter((event) => event.status === activeFilter);
  }, [savEvents, activeFilter]);

  const currentEvents = filteredSavEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  // Calculate total pages for disabling/enabling navigation buttons
  const totalPages = Math.ceil(filteredSavEvents.length / itemsPerPage);

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
    ticket => ["ouvert", "scheduled", "open" ].includes(ticket.status?.toLowerCase())
  ).length;
  const pendingTickets = tickets.filter(
    ticket => ["pending", "scheduled"].includes(ticket.status?.toLowerCase())
  ).length;
  const closedTickets = tickets.filter(
    ticket => ["completed", "closed"].includes(ticket.status?.toLowerCase())
  ).length;

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

  // Dummy attestation generator – replace with your real implementation
  const handleGenerateAttestation = () => {
    alert(`Attestation generated for event`);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p>Chargement des données...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

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

              <Button
                className="bg-[#213f5b] hover:bg-[#162c41] text-white rounded-xl shadow-md"
                onClick={() => setIsModalOpen(true)}
              >
                <PlusIcon className="h-5 w-5 mr-2 text-[#d2fcb2]" />
                Nouveau Ticket
              </Button>

              {/* Conditionally render the modal */}
              {isModalOpen && (
                <NewTicketModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onTicketCreated={(ticket) => {
                    console.log('New ticket created:', ticket);
                    // Optionally handle the newly created ticket here
                  }}
                />
              )}

              {/* Attestation Modal */}
              <AttestationModal/>

            </div>
            {/* Créer un Nouvel Événement Conditionally render the modal */}
            {showNewEventModal && (
                        <NewEventModal
                          isOpen={showNewEventModal}
                          onClose={() => setShowNewEventModal(false)}
                          onEventCreated={(eventData) => {
                            console.log('New event created:', eventData);
                            // Optionally handle the newly created ticket here
                          }}
                        />
                      )}
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
            {/* S.A.V. Planning Section */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#bfddf9]"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#213f5b] to-[#1d3349] p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                      <CalendarIcon className="h-7 w-7 text-[#d2fcb2]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold">Planning S.A.V.</h2>
                      <p className="text-white/80 font-medium mt-1">
                        Interventions programmées •{" "}
                        {new Date().toLocaleDateString("fr-FR", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  {/* <div className="flex gap-2">
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
                  </div> */}
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
                        {closedTickets}
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
                      <div className="text-sm text-[#5a6e87]">Tickets en attente</div>
                      <div className="text-2xl font-bold text-[#213f5b]">
                        {pendingTickets}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-[#bfddf9]/20 rounded-full">
                    <div className="w-1/3 h-full bg-[#bfddf9] rounded-full animate-pulse" />
                  </div>
                </div>

                {/* Attestations Card (Real Data) */}
                <div className="p-5 bg-[#213f5b]/5 rounded-xl border border-[#213f5b]/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#213f5b] rounded-xl">
                      <DocumentCheckIcon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-[#5a6e87]">Attestations</div>
                      <div className="text-2xl font-bold text-[#213f5b]">
                        {attestationsCount}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-[#213f5b]/10 rounded-full">
                    <div className="w-2/3 h-full bg-[#213f5b] rounded-full" />
                  </div>
                </div>
              </div>

              {/* List of S.A.V. Events with Pagination */}
              <div className="px-6 pb-6 space-y-4">
                {currentEvents.length > 0 ? (
                  currentEvents.map((event) => (
                    <SavEventCard
                      key={event.id}
                      event={event}
                      setSelectedEvent={setSelectedEvent}
                    />
                  ))
                ) : (
                  <div className="text-center text-[#5a6e87] py-4">
                    Aucune intervention trouvée.
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center space-x-4 p-4">
                <button
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Précédent
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} sur {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
            </motion.div>

            {/* Modal for Event Details and Attestation */}
            {selectedEvent && (
              <EventDetailsModal
                title="Détails de l'intervention"
                selectedEvent={{
                  ...selectedEvent,
                  _id: String(selectedEvent.id),
                  customerFirstName: selectedEvent.customerFirstName || "",
                  customerLastName: selectedEvent.customerLastName || "",
                  technicianFirstName: selectedEvent.technicianFirstName || "",
                  technicianLastName: selectedEvent.technicianLastName || "",
                  // Provide defaults for any other required properties of type string
                }}
                contact={contact}
                onClose={() => setSelectedEvent(null)}
                handleGenerateAttestation={handleGenerateAttestation}
              />
            )}

            {/* Calendrier S.A.V. Popup Modal */}
            {eventDetails && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
              {/* Semi-transparent background with blur effect */}
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClosePopup}
              ></div>
        
              {/* Popup content */}
              <motion.div
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl z-10 max-w-md w-full mx-4 relative"
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20 
                }}
              >
                {/* Close Button */}
                <button
                  onClick={handleClosePopup}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
        
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {eventDetails.title || eventDetails.type || "Détails de l'événement"}
                  </h3>
                </div>
        
                {/* Event Information Grid */}
                <div className="space-y-4">
                  {/* Ticket and Status */}
                  <div className="grid grid-cols-2 gap-4">
                    {eventDetails.ticket && (
                      <div className="flex items-center space-x-2">
                        <Clipboard className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Ticket</p>
                          <p className="font-semibold text-white">{eventDetails.ticket}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <div className={`h-3 w-3 rounded-full ${
                        eventDetails.status === 'completed' ? 'bg-green-500' : 
                        eventDetails.status === 'pending' ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Status</p>
                        <p className="font-semibold text-white">{eventDetails.status}</p>
                      </div>
                    </div>
                  </div>
        
                  {/* Date and Time */}
                  {eventDetails.start && eventDetails.end && (
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Date</p>
                        <p className="font-semibold text-white">
                          {new Date(eventDetails.start).toLocaleString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" - "}
                          {new Date(eventDetails.end).toLocaleString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
        
                  {/* Customer and Technician */}
                  <div className="grid grid-cols-2 gap-4">
                    {eventDetails.customer && (
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Client</p>
                          <p className="font-semibold text-white">{eventDetails.customer}</p>
                        </div>
                      </div>
                    )}
                    {eventDetails.technician && (
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Technicien</p>
                          <p className="font-semibold text-white">{eventDetails.technician}</p>
                        </div>
                      </div>
                    )}
                  </div>
        
                  {/* Location */}
                  {(eventDetails.address || eventDetails.location) && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Lieu</p>
                        <p className="font-semibold text-white">
                          {eventDetails.address || eventDetails.location}
                        </p>
                      </div>
                    </div>
                  )}
        
                  {/* Description */}
                  {(eventDetails.notes || eventDetails.problem) && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Description</p>
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <p className="text-gray-800 dark:text-gray-200">
                          {eventDetails.notes || eventDetails.problem}
                        </p>
                      </div>
                    </div>
                  )}
        
                  {/* Conversation */}
                  {eventDetails.conversation && eventDetails.conversation.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <MessageCircle className="h-5 w-5 text-indigo-500" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">Conversation</p>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {eventDetails.conversation.map((msg, index) => (
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
        
                {/* Close Button */}
                <button
                  onClick={handleClosePopup}
                  className="mt-6 w-full px-4 py-3 bg-blue-600 text-white rounded-lg 
                             hover:bg-blue-700 transition-colors 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                             dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Fermer
                </button>
              </motion.div>
            </div>
            )}

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
                    {/* <div className="flex items-center gap-3">
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
                    </div> */}
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                    {/* Left: Today and Navigation */}
                    <div className="flex flex-wrap items-center gap-3">
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

                    {/* Center: Current Date Label */}
                    <h3 className="text-xl font-semibold text-white whitespace-nowrap">
                      {currentDate.toLocaleString("fr-FR", { month: "long", year: "numeric" })}
                    </h3>

                    {/* Right: Search and New Event Button */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                      <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <SearchIcon className="h-4 w-4 text-white/60" />
                        </div>
                        <input
                          type="text"
                          placeholder="Rechercher un événement..."
                          className="w-full text-sm border-none bg-white/15 hover:bg-white/20 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-white placeholder-white/60"
                        />
                      </div>
                      <Button className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#e2ffc2] to-[#c5f7a5] hover:opacity-90 text-[#1a365d] rounded-xl text-sm font-semibold transition-colors"
                      onClick={() => setShowNewEventModal(true)}>
                        <PlusIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Nouvel événement</span>
                        <span className="sm:hidden">Nouveau</span>
                      </Button>
                      
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
                      events={calendarEvents}
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
                      onSelectEvent={(event) => {
                        console.log("Événement sélectionné:", event);
                        setEventDetails(event);
                      }}
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
                {activeEvent && (
                  <button
                    onClick={() => setActiveEvent(null)}
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
              {/* Left Panel - Event List (Hidden on mobile when an event is selected) */}
              <div className={`border-r border-[#e5f1fd] ${activeEvent ? 'hidden lg:block' : 'block'} lg:w-1/2`}>
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
                          activeEvent && activeEvent.id === event.id
                            ? 'border-[#213f5b] bg-[#f5faff]'
                            : 'border-[#bfddf9]'
                        }`}
                        whileHover={{ x: 5 }}
                        onClick={() => setActiveEvent(event)}
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
                                {`${event.customerFirstName} ${event.customerLastName}`}
                              </h3>
                              <div className="text-right">
                                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-[#f5faff] text-[#213f5b]">
                                  {new Date(event.createdAt).toLocaleDateString("fr-FR", {
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
                                {new Date(event.createdAt).toLocaleTimeString("fr-FR", {
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

              {/* Right Panel - Conversation View (Full width on mobile when an event is selected) */}
              <div className={`${activeEvent ? 'block' : 'hidden lg:block'} lg:w-1/2 bg-[#fafcff]`}>
                {activeEvent ? (
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b border-[#e5f1fd] bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            activeEvent.status === "completed"
                              ? "bg-green-500 ring-4 ring-green-100"
                              : activeEvent.status === "pending"
                              ? "bg-amber-500 ring-4 ring-amber-100"
                              : "bg-blue-500 ring-4 ring-blue-100"
                          }`} />
                          <div>
                            <h3 className="font-semibold text-[#213f5b]">{`${activeEvent.customerFirstName} ${activeEvent.customerLastName}`}</h3>
                            <p className="text-sm text-[#5a6e87]">{activeEvent.problem}</p>
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
                    
                    {/* Conversation messages */}
                    <div className="flex-1 overflow-auto p-4 space-y-4">
                      {activeEvent.conversation && activeEvent.conversation.length > 0 ? (
                        activeEvent.conversation.map((msg, index) => (
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
