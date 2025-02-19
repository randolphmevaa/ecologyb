"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  // XCircleIcon,
  ArrowUpRightIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  SparklesIcon,
  FireIcon,
  SunIcon,
  BoltIcon,
  HomeModernIcon,
} from "@heroicons/react/24/outline";

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


// Energy solutions mapping with icons and colors
const energySolutions = {
  "Pompes a chaleur": { icon: FireIcon, color: "#2a75c7" },
  "Chauffe-eau solaire individuel": { icon: SunIcon, color: "#f59e0b" },
  "Chauffe-eau thermodynamique": { icon: BoltIcon, color: "#10b981" },
  "Système Solaire Combiné": { icon: HomeModernIcon, color: "#8b5cf6" },
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tickets from the API on component mount
  useEffect(() => {
    fetch("/api/tickets")
      .then((res) => res.json())
      .then((data) => {
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

  // --- Compute Support Metrics ---
  const openTickets = tickets.filter(
    (ticket) => ticket.statut.toLowerCase() === "ouvert"
  ).length;

  const closedTickets = tickets.filter(
    (ticket) => ticket.statut.toLowerCase() === "closed"
  ).length;
  const totalTickets = tickets.length;

  // Compute average response time in minutes (if a resolution date exists)
  const responseTimes = tickets
    .filter((ticket) => ticket.dates.resolution && ticket.dates.resolution !== "")
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

  // For demonstration, compute a satisfaction rate based on closed tickets
  const satisfactionRate =
    totalTickets > 0 ? `${Math.round((closedTickets / totalTickets) * 100)}%` : "N/A";

  // We'll use a static value for SLA compliance (adjust as needed)
  const slaCompliance = "98%";

  // --- Compute Ticket Analytics Data ---
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
    // getDay() returns 0 (Sunday) to 6 (Saturday)
    const dayIndex = created.getDay();
    // Map day index to our keys: 1=Monday, 2=Tuesday, etc.
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
      // Assume ticket is 'solved' if statut is "closed" or a non-empty solution is provided
      if (
        ticket.statut.toLowerCase() === "closed" ||
        (ticket.solution && ticket.solution.trim() !== "")
      ) {
        initialChartData[dayKey].solutions += 1;
      }
    }
  });

  const ticketData = Object.keys(initialChartData).map((day) => {
    const key = day as WeekdayKey;
    return {
      day,
      tickets: initialChartData[key].tickets,
      solutions: initialChartData[key].solutions,
    };
  });

  // --- Recent Tickets ---
  // Sort by creation date (newest first) and take the top 3
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.dates.created).getTime() - new Date(a.dates.created).getTime())
    .slice(0, 3);

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
                  <p className="text-2xl font-bold text-red-600">{openTickets}</p>
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
                  <p className="text-2xl font-bold text-blue-600">{avgResponseTime}</p>
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
                  <p className="text-2xl font-bold text-green-600">{satisfactionRate}</p>
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
                  <p className="text-2xl font-bold text-purple-600">{slaCompliance}</p>
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
                    Exporter CSV{" "}
                    <DocumentArrowDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <LineChart
                  data={ticketData}
                  xKey="day"
                  yKeys={["tickets", "solutions"]}
                  colors={["#2a75c7", "#10b981"]}
                  height={300}
                  gradient
                  gradientColor="rgba(191, 221, 249, 0.2)"
                />
              </div>

              {/* Recent Tickets */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[#1a365d]">Tickets Récents</h2>
                  <Button variant="ghost" size="sm" className="text-[#1a365d]">
                    Voir Tous{" "}
                    <ArrowUpRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentTickets.map((ticket, i) => {
                    // Cast keys so that TypeScript knows they're valid keys from energySolutions
                    const solutionKeys = Object.keys(energySolutions) as (keyof typeof energySolutions)[];
                    const solutionKey = solutionKeys[i % solutionKeys.length];
                    const { color, icon: Icon } = energySolutions[solutionKey];

                    return (
                      <div
                        key={ticket._id}
                        className="flex items-center justify-between p-4 hover:bg-[#bfddf9]/10 rounded-xl transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}10` }}>
                            <Icon className="h-6 w-6" style={{ color }} />
                          </div>
                          <div>
                            <h4 className="font-medium">{ticket.problème}</h4>
                            <p className="text-sm text-gray-500">Client: {ticket.customer}</p>
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
                  {["En ligne", "Occupé", "Hors ligne"].map((status, i) => (
                    <div
                      key={status}
                      className="flex items-center justify-between p-3 bg-[#bfddf9]/10 rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            i === 0 ? "bg-green-500" : i === 1 ? "bg-amber-500" : "bg-gray-400"
                          }`}
                        />
                        <span className="text-sm">{status}</span>
                      </div>
                      <span className="font-semibold text-[#1a365d]">{i + 2}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#bfddf9]/20">
                <h3 className="font-semibold text-lg mb-4 text-[#1a365d]">Actions Rapides</h3>
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
                      style={{ width: "98%" }}
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
                      <h4 className="font-medium">Demande de support #{i + 1}</h4>
                      <p className="text-sm text-gray-500">{ticket.problème}</p>
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
