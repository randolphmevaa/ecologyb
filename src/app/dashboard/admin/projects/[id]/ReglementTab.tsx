import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  // CreditCardIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PlusIcon,
  BanknotesIcon,
  ArrowPathIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  ChartPieIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  ArrowTrendingUpIcon,
  UserCircleIcon,
  ArrowLeftIcon,
  CurrencyEuroIcon
} from "@heroicons/react/24/outline";
import {
  // BarChart,
  // Bar,
  // XAxis,
  // YAxis,
  // CartesianGrid,
  // LineChart,
  // Line,
  // Area,
  // AreaChart,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

interface ClientPaymentDashboardProps {
  // Existing properties
  contactId: string; // Add this property
}

// Payment Type Definitions
type PaymentType =
  | "CLIENT_TO_PAY"
  | "CLIENT_PAID"
  | "TO_RECEIVE"
  | "PAID_OUT";

type PaymentStatus =
  | "PAIEMENT A VENIR"
  | "PAIEMENT RECU";

interface Payment {
  id: string;
  client: string;
  clientId: string; // Added clientId field
  amount: string;
  status: PaymentStatus;
  type: PaymentType;
  dueDate?: string;
  paymentDate?: string;
}

interface ClientPaymentDashboardProps {
  clientId?: string;
  onBackClick?: () => void;
}

// Payment types dictionary
const PAYMENT_TYPES: Record<PaymentType, string> = {
  CLIENT_TO_PAY: "À payer par le client",
  CLIENT_PAID: "Payé par le client",
  TO_RECEIVE: "À recevoir",
  PAID_OUT: "Payé aux fournisseurs"
};

// Payment types descriptions
const PAYMENT_DESCRIPTIONS: Record<PaymentType, string> = {
  CLIENT_TO_PAY: "Montants que vous devez payer",
  CLIENT_PAID: "Montants que vous avez déjà payés",
  TO_RECEIVE: "Montants que vous allez recevoir du client",
  PAID_OUT: "Montants que vous avez déjà reçus du client"
};

/**
 * Single interface for any timeframe data – we use optional properties
 * for the label (week / month / quarter / year).
 */
interface TimeFrameData {
  week?: string;
  month?: string;
  quarter?: string;
  year?: string;
  income: number;
  expenses: number;
  profit: number;
  growth: string; // e.g. "+15%"
}

// Sample data with clientId added
const SAMPLE_PAYMENT_DATA: Payment[] = [
  { id: "p1", client: "Martin Dupont", clientId: "client1", amount: "1200", status: "PAIEMENT A VENIR", type: "CLIENT_TO_PAY", dueDate: "2025-05-15" },
  { id: "p2", client: "Martin Dupont", clientId: "client1", amount: "650", status: "PAIEMENT RECU", type: "CLIENT_PAID", paymentDate: "2025-03-10" },
  { id: "p3", client: "Martin Dupont", clientId: "client1", amount: "850", status: "PAIEMENT A VENIR", type: "TO_RECEIVE", dueDate: "2025-04-20" },
  { id: "p4", client: "Martin Dupont", clientId: "client1", amount: "1450", status: "PAIEMENT RECU", type: "PAID_OUT", paymentDate: "2025-03-05" },
  { id: "p5", client: "Sophie Laurent", clientId: "client2", amount: "950", status: "PAIEMENT A VENIR", type: "CLIENT_TO_PAY", dueDate: "2025-04-30" },
  { id: "p6", client: "Sophie Laurent", clientId: "client2", amount: "2200", status: "PAIEMENT RECU", type: "CLIENT_PAID", paymentDate: "2025-03-15" },
  { id: "p7", client: "Jean Lefebvre", clientId: "client3", amount: "1800", status: "PAIEMENT A VENIR", type: "TO_RECEIVE", dueDate: "2025-05-10" },
  { id: "p8", client: "Marie Dubois", clientId: "client4", amount: "780", status: "PAIEMENT RECU", type: "PAID_OUT", paymentDate: "2025-02-28" },
  { id: "p9", client: "Thomas Moreau", clientId: "client5", amount: "1350", status: "PAIEMENT A VENIR", type: "CLIENT_TO_PAY", dueDate: "2025-04-25" },
  { id: "p10", client: "Julie Girard", clientId: "client6", amount: "2100", status: "PAIEMENT RECU", type: "CLIENT_PAID", paymentDate: "2025-03-20" },
  { id: "p11", client: "Paul Bernard", clientId: "client7", amount: "1600", status: "PAIEMENT A VENIR", type: "TO_RECEIVE", dueDate: "2025-04-15" },
  { id: "p12", client: "Camille Petit", clientId: "client8", amount: "920", status: "PAIEMENT RECU", type: "PAID_OUT", paymentDate: "2025-03-02" },
  // Additional payments for Martin Dupont (client1)
  { id: "p16", client: "Martin Dupont", clientId: "client1", amount: "750", status: "PAIEMENT A VENIR", type: "CLIENT_TO_PAY", dueDate: "2025-06-01" },
  { id: "p17", client: "Martin Dupont", clientId: "client1", amount: "1100", status: "PAIEMENT RECU", type: "CLIENT_PAID", paymentDate: "2025-02-20" },
  { id: "p18", client: "Martin Dupont", clientId: "client1", amount: "980", status: "PAIEMENT A VENIR", type: "TO_RECEIVE", dueDate: "2025-05-05" },
  { id: "p19", client: "Martin Dupont", clientId: "client1", amount: "2300", status: "PAIEMENT RECU", type: "PAID_OUT", paymentDate: "2025-01-15" }
];

// Sample data for client-specific analysis (already typed with TimeFrameData)
const CLIENT_WEEKLY_DATA: TimeFrameData[] = [
  { week: "Sem 1", income: 2500, expenses: 1100, profit: 1400, growth: "+15%" },
  { week: "Sem 2", income: 3100, expenses: 1350, profit: 1750, growth: "+25%" },
  { week: "Sem 3", income: 2950, expenses: 1200, profit: 1750, growth: "+0%" },
  { week: "Sem 4", income: 3800, expenses: 1500, profit: 2300, growth: "+31%" }
];

const CLIENT_MONTHLY_DATA: TimeFrameData[] = [
  { month: "Jan", income: 9200, expenses: 4300, profit: 4900, growth: "+12%" },
  { month: "Fév", income: 10600, expenses: 4700, profit: 5900, growth: "+20%" },
  { month: "Mar", income: 12400, expenses: 5100, profit: 7300, growth: "+24%" },
  { month: "Avr", income: 11800, expenses: 4900, profit: 6900, growth: "-5%" },
  { month: "Mai", income: 14200, expenses: 5400, profit: 8800, growth: "+28%" },
  { month: "Juin", income: 15800, expenses: 6100, profit: 9700, growth: "+10%" }
];

const CLIENT_QUARTERLY_DATA: TimeFrameData[] = [
  { quarter: "Q1", income: 32200, expenses: 14100, profit: 18100, growth: "+18%" },
  { quarter: "Q2", income: 41800, expenses: 16400, profit: 25400, growth: "+40%" },
  { quarter: "Q3", income: 47300, expenses: 18700, profit: 28600, growth: "+13%" },
  { quarter: "Q4", income: 53900, expenses: 20800, profit: 33100, growth: "+16%" }
];

const CLIENT_ANNUAL_DATA: TimeFrameData[] = [
  { year: "2022", income: 110000, expenses: 48000, profit: 62000, growth: "+22%" },
  { year: "2023", income: 142000, expenses: 56000, profit: 86000, growth: "+39%" },
  { year: "2024", income: 165000, expenses: 68000, profit: 97000, growth: "+13%" },
  { year: "2025", income: 175200, expenses: 70000, profit: 105200, growth: "+8%" }
];

// Profit breakdown by category for pie chart
// const CLIENT_PROFIT_BREAKDOWN = {
//   weekly: [
//     { name: "Produits", value: 950, color: "#3B82F6" },
//     { name: "Services", value: 720, color: "#10B981" },
//     { name: "Conseil", value: 380, color: "#F59E0B" },
//     { name: "Formation", value: 250, color: "#8B5CF6" }
//   ],
//   monthly: [
//     { name: "Produits", value: 4200, color: "#3B82F6" },
//     { name: "Services", value: 3100, color: "#10B981" },
//     { name: "Conseil", value: 1650, color: "#F59E0B" },
//     { name: "Formation", value: 950, color: "#8B5CF6" }
//   ],
//   quarterly: [
//     { name: "Produits", value: 11800, color: "#3B82F6" },
//     { name: "Services", value: 8500, color: "#10B981" },
//     { name: "Conseil", value: 4700, color: "#F59E0B" },
//     { name: "Formation", value: 2800, color: "#8B5CF6" }
//   ],
//   annual: [
//     { name: "Produits", value: 42000, color: "#3B82F6" },
//     { name: "Services", value: 34000, color: "#10B981" },
//     { name: "Conseil", value: 19000, color: "#F59E0B" },
//     { name: "Formation", value: 10200, color: "#8B5CF6" }
//   ]
// };

type TimeframeType = "weekly" | "monthly" | "quarterly" | "annual";

const ClientPaymentDashboard: React.FC<ClientPaymentDashboardProps> = ({
  clientId = "client1",
  onBackClick
}) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState<Partial<Payment>>({
    client: "",
    clientId: clientId,
    amount: "",
    status: "PAIEMENT A VENIR",
    type: "CLIENT_TO_PAY",
    dueDate: new Date().toISOString().split("T")[0]
  });
  // const [activeChartView, setActiveChartView] = useState<
  //   "bar" | "line" | "area" | "pie"
  // >("area");
  const [activeTimeframe, setActiveTimeframe] =
    useState<TimeframeType>("monthly");

  // Fetch data effect - filter by clientId
  useEffect(() => {
    setIsLoading(true);

    // Simulate API call with filtered sample data
    setTimeout(() => {
      const filteredPayments = SAMPLE_PAYMENT_DATA.filter(
        (payment) => payment.clientId === clientId
      );
      setPayments(filteredPayments);
      setIsLoading(false);
    }, 800);
  }, [clientId]);

  // Get client name from payments
  const clientName = useMemo(() => {
    if (payments.length > 0) {
      return payments[0].client;
    }
    return "Client";
  }, [payments]);

  // Calculate totals and filter payments by type
  const {
    clientToPayTotal,
    clientPaidTotal,
    toReceiveTotal,
    paidOutTotal,
    clientToPayPayments,
    clientPaidPayments,
    toReceivePayments,
    paidOutPayments,
    // totalRevenue,
    // totalExpenses,
    // totalProfit,
    // profitGrowth,
    paymentCountsByType
  } = useMemo(() => {
    // Filter payments by type
    const clientToPay = payments.filter((p) => p.type === "CLIENT_TO_PAY");
    const clientPaid = payments.filter((p) => p.type === "CLIENT_PAID");
    const toReceive = payments.filter((p) => p.type === "TO_RECEIVE");
    const paidOut = payments.filter((p) => p.type === "PAID_OUT");

    // Calculate totals
    const clientToPaySum = clientToPay.reduce(
      (sum, p) => sum + parseFloat(p.amount),
      0
    );
    const clientPaidSum = clientPaid.reduce(
      (sum, p) => sum + parseFloat(p.amount),
      0
    );
    const toReceiveSum = toReceive.reduce(
      (sum, p) => sum + parseFloat(p.amount),
      0
    );
    const paidOutSum = paidOut.reduce(
      (sum, p) => sum + parseFloat(p.amount),
      0
    );

    // Calculate overall financials
    const totalRev = paidOutSum + toReceiveSum;
    const totalExp = clientPaidSum + clientToPaySum;
    const profit = Math.max(totalRev - totalExp, 0);

    return {
      clientToPayTotal: clientToPaySum.toLocaleString("fr-FR") + "€",
      clientPaidTotal: clientPaidSum.toLocaleString("fr-FR") + "€",
      toReceiveTotal: toReceiveSum.toLocaleString("fr-FR") + "€",
      paidOutTotal: paidOutSum.toLocaleString("fr-FR") + "€",
      clientToPayPayments: clientToPay,
      clientPaidPayments: clientPaid,
      toReceivePayments: toReceive,
      paidOutPayments: paidOut,
      totalRevenue: totalRev,
      totalExpenses: totalExp,
      totalProfit: profit,
      profitGrowth: "+12.5%",
      paymentCountsByType: {
        clientToPay: clientToPay.length,
        clientPaid: clientPaid.length,
        toReceive: toReceive.length,
        paidOut: paidOut.length
      }
    };
  }, [payments]);

  // Returns the TimeFrameData array based on current timeframe
  const getTimeframeData = (): TimeFrameData[] => {
    switch (activeTimeframe) {
      case "weekly":
        return CLIENT_WEEKLY_DATA;
      case "monthly":
        return CLIENT_MONTHLY_DATA;
      case "quarterly":
        return CLIENT_QUARTERLY_DATA;
      case "annual":
        return CLIENT_ANNUAL_DATA;
      default:
        return CLIENT_MONTHLY_DATA;
    }
  };

  /**
   * Helper to get the correct label from TimeFrameData,
   * avoiding `item[labelKey]` errors.
   */
  function getItemLabel(item: TimeFrameData, timeframe: TimeframeType): string {
    switch (timeframe) {
      case "weekly":
        return item.week ?? "Semaine inconnue";
      case "monthly":
        return item.month ?? "Mois inconnu";
      case "quarterly":
        return item.quarter ?? "Trimestre inconnu";
      case "annual":
        return item.year ?? "Année inconnue";
      default:
        return "N/A";
    }
  }

  // Function to prepare profit distribution data for a pie chart
  const getProfitDistributionByTime = () => {
    const data = getTimeframeData();
    const colors = [
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#8B5CF6",
      "#EC4899",
      "#4F46E5"
    ];

    return data.map((item, index) => {
      return {
        name: getItemLabel(item, activeTimeframe),
        value: item.profit,
        color: colors[index % colors.length]
      };
    });
  };

  // Get timeframe title
  const getTimeframeTitle = () => {
    switch (activeTimeframe) {
      case "weekly":
        return "Hebdomadaire";
      case "monthly":
        return "Mensuelle";
      case "quarterly":
        return "Trimestrielle";
      case "annual":
        return "Annuelle";
      default:
        return "Mensuelle";
    }
  };

  // Function to format a date for display
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  // Payment status badge component
  const PaymentStatusBadge: React.FC<{ status: PaymentStatus }> = ({
    status
  }) => {
    const isReceived = status === "PAIEMENT RECU";
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center ${
          isReceived
            ? "bg-green-100 text-green-800"
            : "bg-blue-100 text-blue-800"
        }`}
      >
        {isReceived ? (
          <CheckCircleIcon className="mr-1 h-4 w-4" />
        ) : (
          <ClockIcon className="mr-1 h-4 w-4" />
        )}
        {isReceived ? "Payé" : "À payer"}
      </span>
    );
  };

  // Payment card component
  const PaymentCard: React.FC<{ payment: Payment }> = ({ payment }) => (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.12)"
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:border-blue-300 cursor-pointer shadow-sm hover:shadow-md"
    >
      <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <BanknotesIcon className="h-8 w-8 text-blue-600" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <PaymentStatusBadge status={payment.status} />
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {payment.type === "CLIENT_TO_PAY" || payment.type === "CLIENT_PAID"
              ? "Paiement Client"
              : "Paiement Admin"}
          </h3>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            {formatDate(payment.paymentDate || payment.dueDate)}
          </div>
          <div className="font-semibold text-black">{payment.amount}€</div>
        </div>
      </div>
    </motion.div>
  );

  // Empty state component
  const EmptyState: React.FC<{ type: PaymentType }> = ({ type }) => (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 text-center shadow-inner">
      <BanknotesIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
      <h3 className="text-gray-900 font-medium text-lg mb-1">
        Aucun paiement trouvé
      </h3>
      <p className="text-gray-500 mb-4">
        Aucun paiement de type &quot;{PAYMENT_TYPES[type]}&quot; pour ce client
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
      >
        <PlusIcon className="h-5 w-5" />
        <span>Ajouter un paiement</span>
      </motion.button>
    </div>
  );

  // Loading component
  const LoadingState: React.FC<{ color?: string }> = ({ color = "blue" }) => (
    <div className="flex justify-center items-center py-16">
      <div className="relative">
        <div
          className={`h-16 w-16 border-4 border-${color}-200 border-dashed rounded-full animate-spin`}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ArrowPathIcon className={`h-6 w-6 text-${color}-500 animate-pulse`} />
        </div>
      </div>
    </div>
  );

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create new payment with generated ID
    const newId = `p${payments.length + 1}`;
    const paymentToAdd: Payment = {
      id: newId,
      client: clientName,
      clientId: clientId,
      amount: newPayment.amount || "0",
      status: newPayment.status || "PAIEMENT A VENIR",
      type: newPayment.type || "CLIENT_TO_PAY",
      dueDate: newPayment.dueDate,
      paymentDate:
        newPayment.status === "PAIEMENT RECU"
          ? new Date().toISOString().split("T")[0]
          : undefined
    };

    // Add to payments
    setPayments([...payments, paymentToAdd]);

    // Reset form and close modal
    setNewPayment({
      client: clientName,
      clientId: clientId,
      amount: "",
      status: "PAIEMENT A VENIR",
      type: "CLIENT_TO_PAY",
      dueDate: new Date().toISOString().split("T")[0]
    });
    setIsModalOpen(false);
  };

  // Custom tooltip for charts (Example for bar/area/line charts if you re-enable them)
  // const ChartTooltip = ({ active, payload, label }: any) => {
  //   if (active && payload && payload.length) {
  //     return (
  //       <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
  //         <p className="font-medium text-gray-900">{label}</p>
  //         <div className="mt-1">
  //           {payload.map((item: any, index: number) => (
  //             <p
  //               key={index}
  //               style={{ color: item.color }}
  //               className="text-sm flex items-center"
  //             >
  //               <span
  //                 className="w-3 h-3 rounded-full mr-1"
  //                 style={{ backgroundColor: item.color }}
  //               ></span>
  //               {`${item.name}: ${item.value?.toLocaleString?.("fr-FR") ?? 0}€`}
  //             </p>
  //           ))}
  //         </div>
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  // Statistics Card component
  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendUp?: boolean;
    bgClass?: string;
    iconClass?: string;
  }> = ({
    title,
    value,
    icon,
    trend,
    trendUp = true,
    bgClass = "bg-blue-50",
    iconClass = "text-blue-600"
  }) => (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.1)"
      }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-md p-5 border border-gray-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 ${bgClass} rounded-lg`}>
            <div className={`h-8 w-8 ${iconClass}`}>{icon}</div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">
              {typeof value === "number"
                ? value.toLocaleString("fr-FR") + "€"
                : value}
            </p>
          </div>
        </div>
        {trend && (
          <span
            className={`flex items-center ${
              trendUp ? "text-green-600" : "text-red-600"
            }`}
          >
            {trendUp ? (
              <ArrowUpRightIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownRightIcon className="h-4 w-4 mr-1" />
            )}
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="h-full bg-gradient-to-br from-indigo-50/30 to-white">
      {/* Enhanced Header with Background */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="relative bg-gradient-to-r from-indigo-700 to-indigo-500 px-10 py-10 rounded-t-2xl shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full -mr-16 -mt-20 opacity-30 blur-xl" />
        <div className="absolute bottom-0 right-24 w-32 h-32 bg-indigo-300 rounded-full -mb-10 opacity-20 blur-md" />
        <div className="absolute left-20 bottom-10 w-16 h-16 bg-indigo-400 rounded-full opacity-20 blur-md" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center">
            {onBackClick && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onBackClick}
                className="mr-4 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </motion.button>
            )}
            <div className="flex items-center justify-center bg-white text-indigo-600 rounded-full w-16 h-16 mr-6 shadow-2xl border-2 border-indigo-100">
              <UserCircleIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                {clientName}
              </h2>
              <p className="text-indigo-100 mt-1 font-light">
                Tableau des paiements du client
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-white text-indigo-700 rounded-lg shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2 font-medium"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Ajouter un paiement</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 -mt-6 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -6, scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg flex flex-col overflow-hidden border border-gray-200"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3">
            <h3 className="text-white font-bold">Total à payer</h3>
            <p className="text-blue-100 text-sm">
              {PAYMENT_DESCRIPTIONS.CLIENT_TO_PAY}
            </p>
          </div>
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg border border-blue-200">
                <ArrowDownTrayIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {clientToPayTotal}
                </p>
                <p className="text-sm text-gray-500">
                  {paymentCountsByType.clientToPay} paiements
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -6, scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg flex flex-col overflow-hidden border border-gray-200"
        >
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 py-3">
            <h3 className="text-white font-bold">Total payé</h3>
            <p className="text-green-100 text-sm">
              {PAYMENT_DESCRIPTIONS.CLIENT_PAID}
            </p>
          </div>
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg border border-green-200">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {clientPaidTotal}
                </p>
                <p className="text-sm text-gray-500">
                  {paymentCountsByType.clientPaid} paiements
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          whileHover={{ y: -6, scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg flex flex-col overflow-hidden border border-gray-200"
        >
          <div className="bg-gradient-to-r from-amber-600 to-amber-500 px-4 py-3">
            <h3 className="text-white font-bold">Total à recevoir</h3>
            <p className="text-amber-100 text-sm">
              {PAYMENT_DESCRIPTIONS.TO_RECEIVE}
            </p>
          </div>
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-lg border border-amber-200">
                <ArrowUpTrayIcon className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {toReceiveTotal}
                </p>
                <p className="text-sm text-gray-500">
                  {paymentCountsByType.toReceive} paiements
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          whileHover={{ y: -6, scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg flex flex-col overflow-hidden border border-gray-200"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-3">
            <h3 className="text-white font-bold">Total reçu</h3>
            <p className="text-indigo-100 text-sm">
              {PAYMENT_DESCRIPTIONS.PAID_OUT}
            </p>
          </div>
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg border border-indigo-200">
                <BanknotesIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {paidOutTotal}
                </p>
                <p className="text-sm text-gray-500">
                  {paymentCountsByType.paidOut} paiements
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-xl p-6 mx-6 mb-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* À payer par le client */}
          <motion.div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -mr-10 -mt-10 opacity-20" />
              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <ArrowDownTrayIcon className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    À payer par le client
                  </h2>
                </div>
                <div className="text-white text-lg font-bold">
                  {clientToPayTotal}
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Payment List */}
              {isLoading ? (
                <LoadingState color="blue" />
              ) : clientToPayPayments.length === 0 ? (
                <EmptyState type="CLIENT_TO_PAY" />
              ) : (
                <div className="grid gap-4">
                  {clientToPayPayments.map((payment) => (
                    <PaymentCard key={payment.id} payment={payment} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Payé par le client */}
          <motion.div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100">
            <div className="relative bg-gradient-to-r from-green-600 to-green-400 px-6 py-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full -mr-10 -mt-10 opacity-20" />
              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <CheckCircleIcon className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Payé par le client
                  </h2>
                </div>
                <div className="text-white text-lg font-bold">
                  {clientPaidTotal}
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Payment List */}
              {isLoading ? (
                <LoadingState color="green" />
              ) : clientPaidPayments.length === 0 ? (
                <EmptyState type="CLIENT_PAID" />
              ) : (
                <div className="grid gap-4">
                  {clientPaidPayments.map((payment) => (
                    <PaymentCard key={payment.id} payment={payment} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
          {/* À recevoir */}
          <motion.div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100">
            <div className="relative bg-gradient-to-r from-amber-600 to-amber-400 px-6 py-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full -mr-10 -mt-10 opacity-20" />
              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <ArrowUpTrayIcon className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">À recevoir</h2>
                </div>
                <div className="text-white text-lg font-bold">
                  {toReceiveTotal}
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Payment List */}
              {isLoading ? (
                <LoadingState color="amber" />
              ) : toReceivePayments.length === 0 ? (
                <EmptyState type="TO_RECEIVE" />
              ) : (
                <div className="grid gap-4">
                  {toReceivePayments.map((payment) => (
                    <PaymentCard key={payment.id} payment={payment} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Payé (reçu) */}
          <motion.div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-indigo-100">
            <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-400 px-6 py-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full -mr-10 -mt-10 opacity-20" />
              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <BanknotesIcon className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Payé aux fournisseurs
                  </h2>
                </div>
                <div className="text-white text-lg font-bold">
                  {paidOutTotal}
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Payment List */}
              {isLoading ? (
                <LoadingState color="indigo" />
              ) : paidOutPayments.length === 0 ? (
                <EmptyState type="PAID_OUT" />
              ) : (
                <div className="grid gap-4">
                  {paidOutPayments.map((payment) => (
                    <PaymentCard key={payment.id} payment={payment} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Financial Analytics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mx-6 mb-6"
      >
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full -mr-10 -mt-10 opacity-20" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <ChartPieIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Statistiques Client
                </h2>
              </div>

              {/* Timeframe Buttons (Weekly, Monthly, etc.) */}
              <div className="flex bg-white/10 backdrop-blur-sm rounded-lg mr-2">
                <motion.button
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTimeframe("weekly")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTimeframe === "weekly"
                      ? "bg-white text-purple-700"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  Hebdo
                </motion.button>
                <motion.button
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTimeframe("monthly")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTimeframe === "monthly"
                      ? "bg-white text-purple-700"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  Mensuel
                </motion.button>
                <motion.button
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTimeframe("quarterly")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTimeframe === "quarterly"
                      ? "bg-white text-purple-700"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  Trim.
                </motion.button>
                <motion.button
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTimeframe("annual")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTimeframe === "annual"
                      ? "bg-white text-purple-700"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  Annuel
                </motion.button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Revenus"
                value={
                  getTimeframeData()[getTimeframeData().length - 1].income
                }
                icon={<ArrowUpTrayIcon />}
                trend="+15%"
                trendUp={true}
                bgClass="bg-green-50"
                iconClass="text-green-600"
              />
              <StatCard
                title="Dépenses"
                value={
                  getTimeframeData()[getTimeframeData().length - 1].expenses
                }
                icon={<ArrowDownTrayIcon />}
                trend="+8%"
                trendUp={false}
                bgClass="bg-red-50"
                iconClass="text-red-600"
              />
              <StatCard
                title="Bénéfice"
                value={getTimeframeData()[getTimeframeData().length - 1].profit}
                icon={<CurrencyEuroIcon width={24} height={24} />}
                trend={
                  getTimeframeData()[getTimeframeData().length - 1].growth
                }
                trendUp={getTimeframeData()[
                  getTimeframeData().length - 1
                ].growth.includes("+")}
                bgClass="bg-indigo-50"
                iconClass="text-indigo-600"
              />
              <StatCard
                title="Taux de conversion"
                value="92%"
                icon={<ArrowTrendingUpIcon />}
                trend="+4%"
                trendUp={true}
                bgClass="bg-purple-50"
                iconClass="text-purple-600"
              />
            </div>

            {/* Pie Chart Only */}
            <div className="flex flex-col items-center h-80">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Répartition du Bénéfice {getTimeframeTitle()}
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getProfitDistributionByTime()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={130}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {getProfitDistributionByTime().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0];
                        return (
                          <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                            <p className="font-medium text-gray-900">
                              {data.name}
                            </p>
                            <p className="text-gray-700 mt-1">
                              {`${(data.value ?? 0).toLocaleString(
                                "fr-FR"
                              )}€`}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {`${(
                                (data.payload?.percent ?? 0) * 100
                              ).toFixed(1)}% du bénéfice total`}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add Payment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden"
            >
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -mr-10 -mt-10 opacity-20" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <PlusIcon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Ajouter un paiement pour {clientName}
                    </h2>
                  </div>
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(255, 255, 255, 0.2)"
                    }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsModalOpen(false)}
                    className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Montant (€)
                    </label>
                    <input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newPayment.amount}
                      onChange={(e) =>
                        setNewPayment({ ...newPayment, amount: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Type de paiement
                    </label>
                    <select
                      id="type"
                      value={newPayment.type}
                      onChange={(e) =>
                        setNewPayment({
                          ...newPayment,
                          type: e.target.value as PaymentType
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      required
                    >
                      <option value="CLIENT_TO_PAY">
                        À payer par le client
                      </option>
                      <option value="CLIENT_PAID">Payé par le client</option>
                      <option value="TO_RECEIVE">À recevoir</option>
                      <option value="PAID_OUT">Payé aux fournisseurs</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Statut
                    </label>
                    <select
                      id="status"
                      value={newPayment.status}
                      onChange={(e) =>
                        setNewPayment({
                          ...newPayment,
                          status: e.target.value as PaymentStatus
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      required
                    >
                      <option value="PAIEMENT A VENIR">À payer</option>
                      <option value="PAIEMENT RECU">Payé</option>
                    </select>
                  </div>

                  {newPayment.status === "PAIEMENT A VENIR" && (
                    <div>
                      <label
                        htmlFor="dueDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Date d&apos;échéance
                      </label>
                      <input
                        id="dueDate"
                        type="date"
                        value={newPayment.dueDate}
                        onChange={(e) =>
                          setNewPayment({ ...newPayment, dueDate: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors font-medium"
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#3b82f6" }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Ajouter
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientPaymentDashboard;
