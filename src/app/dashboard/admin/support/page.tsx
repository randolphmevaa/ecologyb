"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { LineChart } from "@/components/ui/Charts/LineChart";
// import { forwardRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import "react-datepicker/dist/react-datepicker.css";
import { fr } from 'date-fns/locale';
import {
  LifebuoyIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  CheckCircleIcon,
  ArrowUpRightIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  SparklesIcon,
  FireIcon,
  SunIcon,
  BoltIcon,
  HomeModernIcon,
  DocumentMagnifyingGlassIcon,
  CalendarIcon,
  DocumentCheckIcon,
  // WrenchIcon,
  PlusIcon,
  MapPinIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { Select } from "@headlessui/react";
import { cn } from "@/lib/utils";

// Define the valid keys for weekdays
type WeekdayKey = "Lun" | "Mar" | "Mer" | "Jeu" | "Ven";

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

interface SavEvent {
  id: string;
  status: "completed" | "pending"; // or any other statuses you use
  customer: string;
  date: string;
  technician: string;
  address: string;
}

// Extend ProcessedDataPoint so that it satisfies Record<string, unknown>
interface ProcessedDataPoint extends Record<string, unknown> {
  date?: string;
  label?: string;
  tickets: number;
  solutions: number;
}

interface TooltipPayload {
  active?: boolean;
  payload?: unknown[];
  label?: string;
  tickets?: number;
  solutions?: number;
}

// Energy solutions mapping with icons and colors
const energySolutions = {
  "Pompes a chaleur": { icon: FireIcon, color: "#2a75c7" },
  "Chauffe-eau solaire individuel": { icon: SunIcon, color: "#f59e0b" },
  "Chauffe-eau thermodynamique": { icon: BoltIcon, color: "#10b981" },
  "Système Solaire Combiné": { icon: HomeModernIcon, color: "#8b5cf6" },
};

function processTicketData(
  tickets: Ticket[],
  dateRange: { startDate: Date | null; endDate: Date | null },
  // grouping: "daily" | "weekly" | "monthly" | "yearly"
): ProcessedDataPoint[] {
  if (!dateRange.startDate || !dateRange.endDate) return [];

  // Generate an array of dates between start and end
  const days = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  });

  // Create a data point for each day with random sample values.
  return days.map((day) => ({
    date: day.toISOString(),
    label: day.toLocaleDateString("fr-FR"),
    tickets: Math.floor(Math.random() * 100) + 20,
    solutions: Math.floor(Math.random() * 90) + 10,
  }));
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Date range and grouping state
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: subDays(new Date(), 7),
    endDate: new Date(),
  });
  const [dataGrouping, setDataGrouping] = useState<"daily" | "weekly" | "monthly" | "yearly">("weekly");

  // Visible metrics for the chart
  // const [ , setVisibleMetrics] = useState<string[]>(["tickets", "solutions"]);
  // const toggleMetricVisibility = (metric: string) => {
  //   setVisibleMetrics((prev) =>
  //     prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
  //   );
  // };

  const savEvents: SavEvent[] = [
    {
      id: "1",
      status: "completed",
      customer: "Alice Johnson",
      date: "2024-03-10T14:00:00.000Z",
      technician: "Technician A",
      address: "123 Main St",
    },
    {
      id: "2",
      status: "pending",
      customer: "Bob Smith",
      date: "2024-03-11T15:30:00.000Z",
      technician: "Technician B",
      address: "456 Oak Ave",
    },
    // add more events as needed
  ];
  
  // Function to generate sample data
  // Note: This function expects non-null start and end dates.
  const generateSampleData = (_start: Date, _end: Date) => {
    // const diffTime = Math.abs(end.getTime() - start.getTime());
    // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    void _start;
    void _end;
    // const newData = Array.from({ length: diffDays }).map((_, i) => ({
    //   date: new Date(start.getTime() + i * 86400000).toISOString(),
    //   label: `Jour ${i + 1}`,
    //   tickets: Math.floor(Math.random() * 100) + 20,
    //   solutions: Math.floor(Math.random() * 90) + 10,
    // }));
    // Here you could update a state variable if needed.
  };

  // Process ticket data for charting
  const processedData: ProcessedDataPoint[] = useMemo(() => {
    if (!dateRange.startDate || !dateRange.endDate) return [];
    return processTicketData(tickets, dateRange );
  }, [tickets, dateRange, dataGrouping]);

  // Compute totals for sample data (used in footer)
  const sampleData = useMemo(() => {
    return {
      ticketsTotal: processedData.reduce((acc, curr) => acc + curr.tickets, 0),
      solutionsTotal: processedData.reduce((acc, curr) => acc + curr.solutions, 0),
    };
  }, [processedData]);

  const formatXAxis = (value: string, grouping: string): string => {
    const date = new Date(value);
    switch (grouping) {
      case "daily":
        return format(date, "d MMM");
      case "weekly":
        return `Sem. ${format(date, "w")}`;
      case "monthly":
        return format(date, "MMM yyyy");
      case "yearly":
        return format(date, "yyyy");
      default:
        return value;
    }
  };

  const formatTooltipDate = (label: string, grouping: string): string => {
    switch (grouping) {
      case "weekly":
        return `Semaine ${label}`;
      case "monthly":
        return format(new Date(label), "MMMM yyyy");
      case "yearly":
        return `Année ${label}`;
      default:
        return format(new Date(label), "d MMMM yyyy");
    }
  };

  // const CustomDatePickerInput = forwardRef<HTMLButtonElement, any>(({ value, onClick }, ref) => (
  //   <button
  //     ref={ref}
  //     onClick={onClick}
  //     className="flex items-center gap-2 px-4 py-2.5 text-[#213f5b] hover:bg-[#f8fbff] rounded-xl transition-colors"
  //   >
  //     <CalendarIcon className="h-5 w-5" />
  //     {value || "Sélectionner une période"}
  //     <ChevronDownIcon className="h-4 w-4 ml-2" />
  //   </button>
  // ));

  const resolutionRate = useMemo(() => {
    const totalTickets = processedData.reduce((acc, curr) => acc + curr.tickets, 0);
    const totalSolutions = processedData.reduce((acc, curr) => acc + curr.solutions, 0);
    return totalTickets > 0
      ? Math.round((totalSolutions / totalTickets) * 100)
      : 0;
  }, [processedData]);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Compute some support metrics
  const openTickets = tickets.filter(
    (ticket) => ticket.statut.toLowerCase() === "ouvert"
  ).length;
  const closedTickets = tickets.filter(
    (ticket) => ticket.statut.toLowerCase() === "closed"
  ).length;
  const totalTickets = tickets.length;

  const responseTimes = tickets
    .filter(
      (ticket) => ticket.dates.resolution && ticket.dates.resolution !== ""
    )
    .map((ticket) => {
      const created = new Date(ticket.dates.created);
      const resolution = new Date(ticket.dates.resolution!);
      return (resolution.getTime() - created.getTime()) / (1000 * 60);
    });
  const avgResponseTimeMinutes =
    responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0;
  const avgResponseTime = `${avgResponseTimeMinutes}m`;
  const satisfactionRate =
    totalTickets > 0
      ? `${Math.round((closedTickets / totalTickets) * 100)}%`
      : "N/A";
  // const slaCompliance = "98%";

  // Group tickets by weekday (only Monday to Friday)
  const initialChartData: Record<WeekdayKey, { tickets: number; solutions: number }> = {
    Lun: { tickets: 0, solutions: 0 },
    Mar: { tickets: 0, solutions: 0 },
    Mer: { tickets: 0, solutions: 0 },
    Jeu: { tickets: 0, solutions: 0 },
    Ven: { tickets: 0, solutions: 0 },
  };

  tickets.forEach((ticket) => {
    const created = new Date(ticket.dates.created);
    const dayIndex = created.getDay();
    const mapping: Record<number, WeekdayKey> = {
      1: "Lun",
      2: "Mar",
      3: "Mer",
      4: "Jeu",
      5: "Ven",
    };
    const dayKey = mapping[dayIndex];
    if (dayKey) {
      initialChartData[dayKey].tickets += 1;
      if (
        ticket.statut.toLowerCase() === "closed" ||
        (ticket.solution && ticket.solution.trim() !== "")
      ) {
        initialChartData[dayKey].solutions += 1;
      }
    }
  });

  // const ticketData = Object.keys(initialChartData).map((day) => {
  //   const key = day as WeekdayKey;
  //   return {
  //     day,
  //     tickets: initialChartData[key].tickets,
  //     solutions: initialChartData[key].solutions,
  //   };
  // });

  const recentTickets = [...tickets]
    .sort(
      (a, b) =>
        new Date(b.dates.created).getTime() - new Date(a.dates.created).getTime()
    )
    .slice(0, 3);

  const isQuickRangeActive = (days: number): boolean => {
    if (!dateRange.startDate || !dateRange.endDate) return false;
    const diff =
      (dateRange.endDate.getTime() - dateRange.startDate.getTime()) /
      (1000 * 60 * 60 * 24);
    return diff === days;
  };

  const setQuickRange = (days: number): void => {
    const newStart = subDays(new Date(), days);
    const newEnd = new Date();
    setDateRange({ startDate: newStart, endDate: newEnd });
    generateSampleData(newStart, newEnd);
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-[#bfddf9]/10 to-[#d2fcb2]/05">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[#1a365d]">
              Support & Tickets
            </h1>
          </div>
          {/* Metrics Overview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
                    {openTickets}
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
                    {avgResponseTime}
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
                    {satisfactionRate}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Main Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              className="lg:col-span-2 space-y-8"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <motion.div 
                className="relative bg-white backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl shadow-[#213f5b]/10 border border-[#bfddf9]/30 hover:shadow-[#213f5b]/20 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Fond dégradé dynamique */}
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[#bfddf9]/15 to-[#d2fcb2]/10 opacity-40 pointer-events-none animate-gradient-shift" />
                
                <div className="relative z-10 space-y-8">
                  {/* En-tête Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#213f5b] rounded-2xl shadow-inner-lg">
                        <CalendarIcon className="h-7 w-7 text-[#d2fcb2] animate-pulse-slow" />
                      </div>
                      <div>
                        <h2 className="text-2xl/normal font-semibold text-[#0d2840]">
                          Planning S.A.V.
                        </h2>
                        <p className="text-[#5a6e87] font-medium mt-1">
                          Interventions programmées • {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="rounded-full h-12 w-12 bg-white/90 shadow-sm border border-[#bfddf9] hover:bg-[#213f5b]/5"
                    >
                      <EllipsisVerticalIcon className="h-6 w-6 text-[#213f5b]" />
                    </Button>
                  </div>

                  {/* Statistiques en Temps Réel */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="p-5 bg-[#d2fcb2]/20 rounded-2xl border border-[#d2fcb2]/30 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#d2fcb2] rounded-xl">
                          <CheckCircleIcon className="h-6 w-6 text-[#1a4231]" />
                        </div>
                        <div>
                          <div className="text-sm text-[#5a6e87]">Terminées</div>
                          <div className="text-2xl font-bold text-[#213f5b]">18</div>
                        </div>
                      </div>
                      <div className="mt-3 h-1 bg-[#d2fcb2]/30 rounded-full">
                        <div className="w-4/5 h-full bg-[#d2fcb2] rounded-full" />
                      </div>
                    </div>
                    
                    <div className="p-5 bg-[#bfddf9]/20 rounded-2xl border border-[#bfddf9]/30 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#bfddf9] rounded-xl">
                          <ClockIcon className="h-6 w-6 text-[#213f5b]" />
                        </div>
                        <div>
                          <div className="text-sm text-[#5a6e87]">En Cours</div>
                          <div className="text-2xl font-bold text-[#213f5b]">5</div>
                        </div>
                      </div>
                      <div className="mt-3 h-1 bg-[#bfddf9]/30 rounded-full">
                        <div className="w-1/3 h-full bg-[#bfddf9] rounded-full animate-pulse" />
                      </div>
                    </div>

                    <div className="p-5 bg-white/90 rounded-2xl border border-[#bfddf9] shadow-sm">
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <Button
                          className="w-full h-full py-4 bg-gradient-to-br from-[#213f5b] to-[#1a2f47] hover:from-[#1a2f47] hover:to-[#213f5b] text-white shadow-xl"
                          onClick={() => console.log('Générer attestation')}
                        >
                          <DocumentCheckIcon className="h-6 w-6 mr-2 text-[#d2fcb2]" />
                          Générer Attestation
                          <span className="ml-2 bg-white/10 px-2 py-1 rounded-full text-xs">PDF</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Liste des Interventions */}
                  <div className="space-y-6">
                    {savEvents.length > 0 ? savEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        className={cn(
                          "relative p-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-[#bfddf9]",
                          "hover:shadow-md hover:border-[#213f5b]/50 transition-all duration-200 cursor-pointer",
                          "group/item"
                        )}
                        whileHover={{ y: -2 }}
                      >
                        {/* Timeline */}
                        <div className="absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-[#bfddf9] to-transparent" />

                        <div className="flex items-start gap-5">
                          {/* Indicateur de Statut */}
                          <div className="relative mt-1.5">
                            <div className={cn(
                              "w-3 h-3 rounded-full ring-4 animate-pulse-slow",
                              event.status === 'completed' 
                                ? "bg-[#d2fcb2] ring-[#d2fcb2]/30" 
                                : "bg-[#bfddf9] ring-[#bfddf9]/30"
                            )} />
                          </div>

                          {/* Contenu Principal */}
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-[#213f5b]">{event.customer}</h3>
                              <ChevronRightIcon className="h-6 w-6 text-[#5a6e87] group-hover/item:text-[#213f5b] transition-colors" />
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-[#5a6e87]">
                              <div className="flex items-center gap-2 bg-[#f8fbff] px-3 py-1.5 rounded-full">
                                <ClockIcon className="h-4 w-4" />
                                {new Date(event.date).toLocaleTimeString('fr-FR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                              
                              <div className="flex items-center gap-2 bg-[#f8fbff] px-3 py-1.5 rounded-full">
                                <UserCircleIcon className="h-4 w-4" />
                                {event.technician}
                              </div>

                              <div className="flex items-center gap-2 bg-[#f8fbff] px-3 py-1.5 rounded-full">
                                <MapPinIcon className="h-4 w-4" />
                                {event.address}
                              </div>
                            </div>

                            {/* Barre de Progression */}
                            <div className="mt-4 relative">
                              <div className="h-2 bg-[#bfddf9]/20 rounded-full overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    event.status === 'completed' 
                                      ? "bg-[#d2fcb2] w-full" 
                                      : "bg-[#213f5b] w-2/3"
                                  )}
                                />
                              </div>
                              <div className="mt-2 text-xs text-[#5a6e87]">
                                {event.status === 'completed' 
                                  ? 'Intervention finalisée' 
                                  : 'En cours de traitement'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions Secondaires */}
                        <div className="absolute right-6 top-6 flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 rounded-xl bg-white/90 shadow-sm border border-[#bfddf9] hover:bg-[#213f5b]/5"
                            onClick={() => console.log('Générer attestation')}
                          >
                            <DocumentCheckIcon className="h-5 w-5 text-[#5a6e87]" />
                          </Button>
                        </div>
                      </motion.div>
                    )) : (
                      <div className="p-8 text-center bg-white/90 rounded-2xl border border-dashed border-[#bfddf9]">
                        <DocumentMagnifyingGlassIcon className="mx-auto h-12 w-12 text-[#bfddf9] mb-4" />
                        <h3 className="text-lg font-semibold text-[#213f5b]">Aucune intervention programmée</h3>
                        <p className="text-[#5a6e87] mt-2">Commencez par planifier une nouvelle intervention</p>
                      </div>
                    )}
                  </div>

                  {/* Bouton Flottant */}
                  <motion.div 
                    className="sticky bottom-6 mt-8"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="w-full py-6 rounded-[1.5rem] bg-gradient-to-br from-[#213f5b] to-[#1a2f47] hover:from-[#1a2f47] hover:to-[#213f5b] text-white shadow-2xl"
                      onClick={() => console.log('Nouvelle intervention')}
                    >
                      <PlusIcon className="h-6 w-6 mr-3 text-[#d2fcb2]" />
                      Planifier Intervention
                      <span className="ml-3 bg-white/10 px-3 py-1 rounded-full text-sm">Nouveau</span>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Trends des Tickets */}
              <motion.div 
                className="bg-white/95 backdrop-blur-lg p-8 rounded-[2rem] shadow-2xl shadow-[#213f5b]/10 border border-[#bfddf9] hover:shadow-[#213f5b]/20 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* En-tête */}
                <div className="flex flex-col gap-6 mb-8 pb-6 border-b border-[#bfddf9]">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#213f5b]/5 rounded-2xl shadow-inner border border-[#bfddf9]">
                        <ChatBubbleLeftRightIcon className="h-8 w-8 text-[#213f5b] animate-pulse-slow" />
                      </div>
                      <div className="space-y-1">
                        <h1 className="text-2xl/normal font-bold text-[#213f5b]">
                          Activité des Demandes S.A.V.
                          <span className="ml-3 bg-[#d2fcb2] text-[#1a4231] px-3 py-1 rounded-full text-sm font-medium">
                            Données en Direct
                          </span>
                        </h1>
                        <p className="text-sm text-[#5a6e87] font-medium">
                          Analyse temporelle des interventions • Mise à jour : {new Date().toLocaleTimeString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="h-12 px-5 shadow-sm bg-white border-[#bfddf9] text-[#213f5b] hover:bg-[#f8fbff] font-medium flex items-center gap-2"
                    >
                      <DocumentArrowDownIcon className="h-5 w-5" />
                      Exporter CSV
                    </Button>
                  </div>

                  {/* Contrôles Graphique */}
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm p-2 rounded-xl border border-[#bfddf9]">
                    <DatePicker
                      selected={dateRange.startDate}
                      onChange={(dates) => {
                        const [start, end] = dates as [Date | null, Date | null];
                        setDateRange({ startDate: start, endDate: end || start });
                      }}
                      startDate={dateRange.startDate}
                      endDate={dateRange.endDate}
                      selectsRange
                      locale={fr}
                      dateFormat="dd/MM/yyyy"
                      isClearable
                      placeholderText="📅 Sélectionner une période"
                      className="font-medium text-[#213f5b] border-none bg-transparent w-[280px]"
                      calendarClassName="shadow-2xl rounded-2xl border border-[#bfddf9] z-[1000]"
                      popperClassName="z-[1000]"
                      customInput={
                        <button className="flex items-center gap-2 px-4 py-2.5 text-[#213f5b] hover:bg-[#f8fbff] rounded-xl transition-colors">
                          <CalendarIcon className="h-5 w-5" />
                          {dateRange.startDate ? 
                            `${dateRange.startDate.toLocaleDateString('fr-FR')} - ${dateRange.endDate?.toLocaleDateString('fr-FR')}` 
                            : "Choisir dates"}
                          <ChevronDownIcon className="h-4 w-4 ml-2" />
                        </button>
                      }
                    />
                      
                      <Select
                        value={dataGrouping}
                        onChange={(e) => setDataGrouping(e.target.value as typeof dataGrouping)}
                        className="border-0 bg-transparent font-medium text-[#213f5b] [&>button]:px-3 [&>button]:py-2"
                      >
                        <option value="daily" className="text-[#213f5b]">📆 Journalier</option>
                        <option value="weekly" className="text-[#213f5b]">🗓️ Hebdomadaire</option>
                        <option value="monthly" className="text-[#213f5b]">📅 Mensuel</option>
                        <option value="yearly" className="text-[#213f5b]">🎉 Annuel</option>
                      </Select>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {[1, 7, 30, 90].map((days) => (
                        <Button
                          key={days}
                          className={`px-4 py-2 rounded-xl font-medium transition-all ${
                            isQuickRangeActive(days)
                              ? "bg-[#213f5b] text-white shadow-lg hover:bg-[#1a2f47]"
                              : "text-[#5a6e87] hover:bg-[#f8fbff] hover:text-[#213f5b]"
                          }`}
                          onClick={() => setQuickRange(days)}
                        >
                          {days}j
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Visualisation Graphique */}
                <div className="relative h-[500px]">
                  {processedData.length > 0 ? (
                    <LineChart
                      data={processedData}
                      xKey={dataGrouping === "daily" ? "date" : "label"}
                      yKeys={["tickets", "solutions"]}
                      colors={["#213f5b", "#d2fcb2"]}
                      height={500}
                      gradient
                      gradientColor="rgba(191, 221, 249, 0.1)"
                      strokeWidth={2.5}
                      dotRadius={5}
                      showGrid
                      gridColor="rgba(191, 221, 249, 0.15)"
                      axisProps={{
                        stroke: "#bfddf9",
                        fontSize: 13,
                        // tickMargin: 12,
                      }}
                      xAxisFormatter={(value: string) => formatXAxis(value, dataGrouping)}
                      tooltip={(payload: TooltipPayload) => (
                        <div className="bg-white p-4 rounded-xl shadow-xl border border-[#e0efff] backdrop-blur-sm">
                          <p className="text-sm font-semibold text-[#213f5b] mb-2">
                            📌 {formatTooltipDate(payload.label!, dataGrouping)}
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="h-2.5 w-2.5 rounded-full bg-[#213f5b]" />
                              <span className="text-sm font-medium text-[#405976]">
                                Tickets: <span className="text-[#0d2840] font-bold">{payload.tickets}</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="h-2.5 w-2.5 rounded-full bg-[#d2fcb2]" />
                              <span className="text-sm font-medium text-[#405976]">
                                Solutions: <span className="text-[#0d2840] font-bold">{payload.solutions}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-[#f8fbff] rounded-2xl border-2 border-dashed border-[#bfddf9]">
                      <DocumentMagnifyingGlassIcon className="h-16 w-16 text-[#bfddf9] mb-4 animate-pulse" />
                      <p className="text-[#8aa4bf] font-medium">Chargement des données...</p>
                    </div>
                  )}
                </div>

                {/* Pied de Section */}
                <div className="mt-8 pt-6 border-t border-[#bfddf9]">
                  <div className="flex flex-wrap gap-6 items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-[#f8fbff] px-4 py-2 rounded-xl">
                        <div className="h-3 w-3 rounded-full bg-[#213f5b]" />
                        <span className="text-sm text-[#5a6e87]">Total Tickets : {sampleData.ticketsTotal}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-[#f8fbff] px-4 py-2 rounded-xl">
                        <div className="h-3 w-3 rounded-full bg-[#d2fcb2]" />
                        <span className="text-sm text-[#5a6e87]">Solutions : {sampleData.solutionsTotal}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-[#d2fcb2]/20 px-4 py-2 rounded-xl">
                      <SparklesIcon className="h-5 w-5 text-[#1a4231]" />
                      <span className="text-sm font-medium text-[#1a4231]">
                        Taux de Résolution : <span className="font-bold">{resolutionRate}%</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[#1a365d]">
                    S.A.V. Récents
                  </h2>
                  <Button variant="ghost" size="sm" className="text-[#1a365d]">
                    Voir Tous{" "}
                    <ArrowUpRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentTickets.map((ticket, i) => {
                    const solutionKeys = Object.keys(energySolutions) as (keyof typeof energySolutions)[];
                    const solutionKey = solutionKeys[i % solutionKeys.length];
                    const { color, icon: Icon } = energySolutions[solutionKey];
                    return (
                      <div
                        key={ticket._id}
                        className="flex items-center justify-between p-4 hover:bg-[#bfddf9]/10 rounded-xl transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${color}10` }}
                          >
                            <Icon className="h-6 w-6" style={{ color }} />
                          </div>
                          <div>
                            <h4 className="font-medium">{ticket.problème}</h4>
                            <p className="text-sm text-gray-500">
                              Client: {ticket.customer}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`text-sm px-2 py-1 rounded-full ${
                              ticket.statut.toLowerCase() === "ouvert"
                                ? "bg-red-100 text-red-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {ticket.statut}
                          </span>
                          <span className="text-sm text-gray-600">
                            {new Date(ticket.dates.created).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
            <motion.div
              className="space-y-6"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d] flex items-center gap-2">
                  <UserGroupIcon className="h-6 w-6 text-[#2a75c7]" />
                  Disponibilité de l&apos;Équipe
                </h3>
                <div className="space-y-4">
                  {["En ligne", "Occupé", "Hors ligne"].map((status, i) => (
                    <div
                      key={status}
                      className="flex items-center justify-between p-3 bg-[#bfddf9]/10 rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            i === 0
                              ? "bg-green-500"
                              : i === 1
                              ? "bg-amber-500"
                              : "bg-gray-400"
                          }`}
                        />
                        <span className="text-sm">{status}</span>
                      </div>
                      <span className="font-semibold text-[#1a365d]">
                        {i + 2}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d]">
                  Actions Rapides
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <Button className="h-12 bg-[#bfddf9]/20 hover:bg-[#bfddf9]/30 text-[#1a365d] justify-start">
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Nouveau Ticket S.A.v.
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
                Voir Historique{" "}
                <ArrowUpRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tickets.slice(0, 4).map((ticket, i) => (
                <div
                  key={ticket._id}
                  className="group p-4 hover:bg-[#bfddf9]/10 rounded-xl transition-colors cursor-pointer border border-[#bfddf9]/20"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[#bfddf9]/20 rounded-lg">
                      <ChatBubbleLeftRightIcon className="h-6 w-6 text-[#2a75c7]" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        Demande de support #{i + 1}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {ticket.problème}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{ticket.customer}</span>
                    <span className="text-gray-500">
                      {new Date(ticket.dates.created).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
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
