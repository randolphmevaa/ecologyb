import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
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
  CurrencyEuroIcon,
  EyeIcon,
  InformationCircleIcon,
  PencilIcon
} from "@heroicons/react/24/outline";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

interface ClientPaymentDashboardProps {
  clientId?: string;
  onBackClick?: () => void;
}

// Payment Type Definitions
type PaymentType = "à payer" | "payé" | "à recevoir" | "reçu";

type PaymentStatus = "à payer" | "payé" | "en attente" | "reçu";

// Payment Categories - Proper case instead of all caps
type PaymentOutCategory = 
  | "Matériel" 
  | "Regie" 
  | "Commercial"
  | "Telepros" 
  | "Poseur" 
  | "Dédommagement client"
  | "Mon accompagnateur Renov" 
  | "Auditeur";

type PaymentInCategory = 
  | "Certificat d'économie d'énergie" 
  | "Maprimerenov'" 
  | "Financement" 
  | "Chèque";

interface PaymentChequeDetails {
  count?: number;
  encashmentDate?: string;
}

interface Payment {
  id: string;
  client: string;
  clientId: string;
  amount: string;
  status: PaymentStatus;
  type: PaymentType;
  dueDate?: string;
  paymentDate?: string;
  category?: PaymentOutCategory | PaymentInCategory;
  chequeDetails?: PaymentChequeDetails;
  notes?: string;
}

// Payment types dictionary
const PAYMENT_TYPES: Record<PaymentType, string> = {
  "à payer": "À payer",
  "payé": "Payé",
  "à recevoir": "À recevoir",
  "reçu": "Reçu"
};

// Payment types descriptions
const PAYMENT_DESCRIPTIONS: Record<PaymentType, string> = {
  "à payer": "Montants que vous devez payer",
  "payé": "Montants que vous avez déjà payés",
  "à recevoir": "Montants que vous allez recevoir",
  "reçu": "Montants que vous avez déjà reçus"
};

// Categories in proper case
const PAYMENT_OUT_CATEGORIES: PaymentOutCategory[] = [
  "Matériel", 
  "Regie", 
  "Commercial",
  "Telepros", 
  "Poseur", 
  "Dédommagement client",
  "Mon accompagnateur Renov", 
  "Auditeur"
];

const PAYMENT_IN_CATEGORIES: PaymentInCategory[] = [
  "Certificat d'économie d'énergie", 
  "Maprimerenov'", 
  "Financement", 
  "Chèque"
];

// Category colors
const CATEGORY_COLORS: Record<string, string> = {
  "Matériel": "#3B82F6",
  "Regie": "#10B981",
  "Commercial": "#F59E0B",
  "Telepros": "#8B5CF6", 
  "Poseur": "#EC4899", 
  "Dédommagement client": "#F43F5E",
  "Mon accompagnateur Renov": "#06B6D4", 
  "Auditeur": "#6366F1",
  "Certificat d'économie d'énergie": "#3B82F6", 
  "Maprimerenov'": "#10B981", 
  "Financement": "#F59E0B", 
  "Chèque": "#8B5CF6"
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
  { id: "p1", client: "Reglement", clientId: "client1", amount: "1200", status: "à payer", type: "à payer", dueDate: "2025-05-15", category: "Matériel" },
  { id: "p2", client: "Reglement", clientId: "client1", amount: "650", status: "payé", type: "payé", paymentDate: "2025-03-10", category: "Regie" },
  { id: "p3", client: "Reglement", clientId: "client1", amount: "850", status: "en attente", type: "à recevoir", dueDate: "2025-04-20", category: "Certificat d'économie d'énergie" },
  { id: "p4", client: "Reglement", clientId: "client1", amount: "1450", status: "reçu", type: "reçu", paymentDate: "2025-03-05", category: "Maprimerenov'" },
  { id: "p5", client: "Sophie Laurent", clientId: "client2", amount: "950", status: "à payer", type: "à payer", dueDate: "2025-04-30", category: "Commercial" },
  { id: "p6", client: "Sophie Laurent", clientId: "client2", amount: "2200", status: "payé", type: "payé", paymentDate: "2025-03-15", category: "Telepros" },
  { id: "p7", client: "Jean Lefebvre", clientId: "client3", amount: "1800", status: "en attente", type: "à recevoir", dueDate: "2025-05-10", category: "Financement" },
  { id: "p8", client: "Marie Dubois", clientId: "client4", amount: "780", status: "reçu", type: "reçu", paymentDate: "2025-02-28", category: "Chèque", chequeDetails: { count: 2, encashmentDate: "2025-03-15" } },
  { id: "p16", client: "Reglement", clientId: "client1", amount: "750", status: "à payer", type: "à payer", dueDate: "2025-06-01", category: "Poseur" },
  { id: "p17", client: "Reglement", clientId: "client1", amount: "1100", status: "payé", type: "payé", paymentDate: "2025-02-20", category: "Dédommagement client" },
  { id: "p18", client: "Reglement", clientId: "client1", amount: "980", status: "en attente", type: "à recevoir", dueDate: "2025-05-05", category: "Financement" },
  { id: "p19", client: "Reglement", clientId: "client1", amount: "2300", status: "reçu", type: "reçu", paymentDate: "2025-01-15", category: "Chèque", chequeDetails: { count: 3, encashmentDate: "2025-02-10" } }
];

// Sample data for client-specific analysis
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

type TimeframeType = "weekly" | "monthly" | "quarterly" | "annual";
type ChartType = "pie" | "bar";

// Define tooltip props interface
interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    payload?: {
      percent?: number;
    };
  }[];
  label?: string;
}
interface ClientPaymentDashboardProps {
  // Existing properties
  contactId: string; // Add this line
}

const ClientPaymentDashboard: React.FC<ClientPaymentDashboardProps> = ({
  clientId = "client1",
  onBackClick
}) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [chartType, setChartType] = useState<ChartType>("pie");
  
  const [newPayment, setNewPayment] = useState<Partial<Payment>>({
    client: "Reglement",
    clientId: clientId,
    amount: "",
    status: "à payer",
    type: "à payer",
    dueDate: new Date().toISOString().split("T")[0],
    category: "Matériel"
  });

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
    return "Reglement";
  }, [payments]);

  // Calculate totals and filter payments by type
  const {
    toPay,
    paid,
    toReceive,
    received,
    toPayPayments,
    paidPayments,
    toReceivePayments,
    receivedPayments,
    paymentCountsByType,
    marginPercentage
  } = useMemo(() => {
    // Filter payments by type
    const toPayItems = payments.filter((p) => p.type === "à payer");
    const paidItems = payments.filter((p) => p.type === "payé");
    const toReceiveItems = payments.filter((p) => p.type === "à recevoir");
    const receivedItems = payments.filter((p) => p.type === "reçu");

    // Calculate totals
    const toPaySum = toPayItems.reduce(
      (sum, p) => sum + parseFloat(p.amount),
      0
    );
    const paidSum = paidItems.reduce(
      (sum, p) => sum + parseFloat(p.amount),
      0
    );
    const toReceiveSum = toReceiveItems.reduce(
      (sum, p) => sum + parseFloat(p.amount),
      0
    );
    const receivedSum = receivedItems.reduce(
      (sum, p) => sum + parseFloat(p.amount),
      0
    );

    // Calculate overall financials
    const totalRev = receivedSum + toReceiveSum;
    const totalExp = paidSum + toPaySum;
    const profit = totalRev - totalExp;
    
    // Calculate margin percentage
    const marginPct = totalRev > 0 ? ((profit / totalRev) * 100).toFixed(1) : "0";

    return {
      toPay: toPaySum.toLocaleString("fr-FR") + "€",
      paid: paidSum.toLocaleString("fr-FR") + "€",
      toReceive: toReceiveSum.toLocaleString("fr-FR") + "€",
      received: receivedSum.toLocaleString("fr-FR") + "€",
      toPayPayments: toPayItems,
      paidPayments: paidItems,
      toReceivePayments: toReceiveItems,
      receivedPayments: receivedItems,
      totalRevenue: totalRev,
      totalExpenses: totalExp,
      totalProfit: profit,
      profitGrowth: "+12.5%",
      marginPercentage: marginPct + "%",
      paymentCountsByType: {
        toPay: toPayItems.length,
        paid: paidItems.length,
        toReceive: toReceiveItems.length,
        received: receivedItems.length
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
      "#4f46e5", // Indigo
      "#0ea5e9", // Sky
      "#0284c7", // Light blue
      "#4338ca", // Indigo
      "#7c3aed", // Violet
      "#8b5cf6", // Purple
      "#c084fc", // Fuchsia
      "#e879f9"  // Pink
    ];

    return data.map((item, index) => {
      return {
        name: getItemLabel(item, activeTimeframe),
        value: item.profit,
        color: colors[index % colors.length]
      };
    });
  };

  // Function to prepare category distribution data
  const getCategoryDistribution = () => {
    // Group by category and sum amounts
    const categories: Record<string, number> = {};
    
    // Process payment categories for both incoming and outgoing
    payments.forEach(payment => {
      if (payment.category) {
        if (!categories[payment.category]) {
          categories[payment.category] = 0;
        }
        categories[payment.category] += parseFloat(payment.amount);
      }
    });
    
    // Convert to pie chart data format
    return Object.entries(categories).map(([category, amount]) => ({
      name: category,
      value: amount,
      color: CATEGORY_COLORS[category] || "#6366F1"
    }));
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

  // Function to transform a status into a capitalized and formatted version
  const formatStatus = (status: PaymentStatus): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Payment status badge component
  const PaymentStatusBadge: React.FC<{ status: PaymentStatus }> = ({
    status
  }) => {
    let bgColor, textColor, icon;
    
    switch(status) {
      case "payé":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        icon = <CheckCircleIcon className="mr-1 h-4 w-4" />;
        break;
      case "reçu":
        bgColor = "bg-blue-100";
        textColor = "text-blue-800";
        icon = <CheckCircleIcon className="mr-1 h-4 w-4" />;
        break;
      case "à payer":
        bgColor = "bg-amber-100";
        textColor = "text-amber-800";
        icon = <ClockIcon className="mr-1 h-4 w-4" />;
        break;
      case "en attente":
        bgColor = "bg-purple-100";
        textColor = "text-purple-800";
        icon = <ClockIcon className="mr-1 h-4 w-4" />;
        break;
      default:
        bgColor = "bg-gray-100";
        textColor = "text-gray-800";
        icon = <ClockIcon className="mr-1 h-4 w-4" />;
    }
    
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center ${bgColor} ${textColor}`}
      >
        {icon}
        {formatStatus(status)}
      </span>
    );
  };

  // Category Badge component
  const CategoryBadge: React.FC<{ category?: PaymentOutCategory | PaymentInCategory }> = ({ category }) => {
    if (!category) return null;
    
    const bgColor = `bg-${CATEGORY_COLORS[category]?.replace('#', '')}-100` || "bg-gray-100";
    const textColor = `text-${CATEGORY_COLORS[category]?.replace('#', '')}-800` || "text-gray-800";
    
    return (
      <span
        className={`px-2 py-0.5 rounded-md text-xs font-medium ${bgColor} ${textColor} border border-current`}
        style={{
          backgroundColor: `${CATEGORY_COLORS[category]}20`,
          color: CATEGORY_COLORS[category]
        }}
      >
        {category}
      </span>
    );
  };

  // Payment card component with view details button
  const PaymentCard: React.FC<{ payment: Payment }> = ({ payment }) => (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.12)"
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 shadow-sm hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div 
          className="p-3 rounded-lg border"
          style={{
            background: `linear-gradient(135deg, ${CATEGORY_COLORS[payment.category || 'Matériel']}20, ${CATEGORY_COLORS[payment.category || 'Matériel']}40)`,
            borderColor: `${CATEGORY_COLORS[payment.category || 'Matériel']}60`
          }}
        >
          <BanknotesIcon className="h-8 w-8" style={{ color: CATEGORY_COLORS[payment.category || 'Matériel'] }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <PaymentStatusBadge status={payment.status} />
            <CategoryBadge category={payment.category} />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {formatDate(payment.paymentDate || payment.dueDate)}
              </div>
              <div className="font-semibold text-black">{payment.amount}€</div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedPayment(payment);
                setIsDetailsModalOpen(true);
                setIsEditMode(false);
              }}
              className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
            >
              <EyeIcon className="h-5 w-5" />
            </motion.button>
          </div>
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
          className="h-16 w-16 border-4 rounded-full animate-spin"
          style={{ borderColor: `${color}40`, borderTopColor: color, borderStyle: 'dashed' }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ArrowPathIcon className="h-6 w-6 animate-pulse" style={{ color }} />
        </div>
      </div>
    </div>
  );

  // Handle form submission for new payment
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create new payment with generated ID
    const newId = `p${payments.length + 1}`;
    
    // Determine which category list to use based on the type
    const isOutgoing = newPayment.type === "à payer" || newPayment.type === "payé";
    const defaultCategory = isOutgoing 
        ? PAYMENT_OUT_CATEGORIES[0] as PaymentOutCategory
        : PAYMENT_IN_CATEGORIES[0] as PaymentInCategory;
        
    const paymentToAdd: Payment = {
      id: newId,
      client: clientName,
      clientId: clientId,
      amount: newPayment.amount || "0",
      status: newPayment.status || "à payer",
      type: newPayment.type || "à payer",
      category: newPayment.category as (PaymentOutCategory | PaymentInCategory) || defaultCategory,
      paymentDate: (newPayment.status === "payé" || newPayment.status === "reçu")
        ? newPayment.paymentDate || new Date().toISOString().split("T")[0]
        : undefined,
      notes: newPayment.notes,
      chequeDetails: newPayment.category === "Chèque" 
        ? {
            count: Number(newPayment.chequeDetails?.count) || 1,
            encashmentDate: newPayment.chequeDetails?.encashmentDate || new Date().toISOString().split("T")[0]
          }
        : undefined
    };

    // Add to payments
    setPayments([...payments, paymentToAdd]);

    // Reset form and close modal
    setNewPayment({
      client: clientName,
      clientId: clientId,
      amount: "",
      status: "à payer",
      type: "à payer",
      category: "Matériel"
    });
    setIsModalOpen(false);
  };
  
  // Handle form submission for editing payment
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPayment) return;
    
    // Adjusting the payment
    const updatedPayment: Payment = {
      ...selectedPayment,
      amount: newPayment.amount || selectedPayment.amount,
      status: newPayment.status || selectedPayment.status,
      type: getPaymentTypeFromStatus(newPayment.status || selectedPayment.status),
      category: newPayment.category as (PaymentOutCategory | PaymentInCategory) || selectedPayment.category,
      paymentDate: (newPayment.status === "payé" || newPayment.status === "reçu")
        ? newPayment.paymentDate || selectedPayment.paymentDate || new Date().toISOString().split("T")[0]
        : undefined,
      notes: newPayment.notes !== undefined ? newPayment.notes : selectedPayment.notes,
      chequeDetails: newPayment.category === "Chèque" 
        ? {
            count: Number(newPayment.chequeDetails?.count) || selectedPayment.chequeDetails?.count || 1,
            encashmentDate: newPayment.chequeDetails?.encashmentDate || selectedPayment.chequeDetails?.encashmentDate || new Date().toISOString().split("T")[0]
          }
        : undefined
    };
    
    // Update payments array
    const updatedPayments = payments.map(p => 
      p.id === selectedPayment.id ? updatedPayment : p
    );
    
    setPayments(updatedPayments);
    setSelectedPayment(updatedPayment);
    setIsEditMode(false);
  };
  
  // Get payment type based on status
  const getPaymentTypeFromStatus = (status: PaymentStatus): PaymentType => {
    if (status === "à payer") return "à payer";
    if (status === "payé") return "payé";
    if (status === "en attente") return "à recevoir";
    if (status === "reçu") return "reçu";
    return "à payer"; // default
  };
  
  // Update payment status and type together
  const handleStatusChange = (payment: Payment, newStatus: PaymentStatus) => {
    // Determine the new type based on status
    const newType = getPaymentTypeFromStatus(newStatus);
    
    const updatedPayment = {
      ...payment,
      status: newStatus,
      type: newType, // Update the type based on status
      paymentDate: (newStatus === "payé" || newStatus === "reçu") 
        ? new Date().toISOString().split("T")[0] 
        : payment.paymentDate
    };
    
    const updatedPayments = payments.map(p => 
      p.id === payment.id ? updatedPayment : p
    );
    
    setPayments(updatedPayments);
    setSelectedPayment(updatedPayment);
  };

  // Custom tooltip for charts with proper typing
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-gray-700 mt-1">
            {`${(data.value ?? 0).toLocaleString("fr-FR")}€`}
          </p>
          <p className="text-gray-600 text-sm">
            {`${((data.payload?.percent ?? 0) * 100).toFixed(1)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Statistics Card component with gradient backgrounds and better contrast
  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendUp?: boolean;
    gradientFrom: string;
    gradientTo: string;
    textColor: string;
  }> = ({
    title,
    value,
    icon,
    trend,
    trendUp = true,
    gradientFrom,
    gradientTo,
    textColor
  }) => (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.15)"
      }}
      transition={{ duration: 0.2 }}
      className="rounded-xl shadow-md overflow-hidden border border-gray-200"
    >
      <div style={{ background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})` }} className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <div className={`h-8 w-8 ${textColor}`}>{icon}</div>
            </div>
            <div>
              <h3 className={`text-sm font-medium ${textColor} opacity-90`}>{title}</h3>
              <p className={`text-2xl font-bold ${textColor}`}>
                {typeof value === "number"
                  ? value.toLocaleString("fr-FR") + "€"
                  : value}
              </p>
            </div>
          </div>
          {trend && (
            <span
              className={`flex items-center ${
                trendUp ? "text-green-100" : "text-red-100"
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
      </div>
    </motion.div>
  );

  // Updated category selection based on payment type
  useEffect(() => {
    if (isEditMode) return; // Skip if editing existing payment
    
    // Reset category when payment type changes to match appropriate options
    if (newPayment.type === "à payer" || newPayment.type === "payé") {
      setNewPayment(prev => ({
        ...prev,
        category: PAYMENT_OUT_CATEGORIES[0],
        chequeDetails: undefined
      }));
    } else {
      setNewPayment(prev => ({
        ...prev,
        category: PAYMENT_IN_CATEGORIES[0],
        chequeDetails: prev.category === "Chèque" ? { count: 1 } : undefined
      }));
    }
  }, [newPayment.type, isEditMode]);

  // Update status options based on payment type
  useEffect(() => {
    if (isEditMode) return; // Skip if editing existing payment
    
    const isOutgoing = newPayment.type === "à payer" || newPayment.type === "payé";
    setNewPayment(prev => ({
      ...prev,
      status: isOutgoing ? (prev.type === "à payer" ? "à payer" : "payé") : 
                         (prev.type === "à recevoir" ? "en attente" : "reçu")
    }));
  }, [newPayment.type, isEditMode]);
  
  // Initialize edit form
  const startEditMode = () => {
    if (!selectedPayment) return;
    
    setNewPayment({
      ...selectedPayment,
      chequeDetails: selectedPayment.chequeDetails || undefined
    });
    
    setIsEditMode(true);
  };

  return (
    <div className="h-full bg-gradient-to-br from-indigo-50/30 to-white">
      {/* Enhanced Header with Background */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="relative bg-gradient-to-r from-indigo-800 to-indigo-600 px-10 py-10 rounded-t-2xl shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full -mr-16 -mt-20 opacity-30 blur-xl" />
        <div className="absolute bottom-0 right-24 w-32 h-32 bg-indigo-400 rounded-full -mb-10 opacity-20 blur-md" />
        <div className="absolute left-20 bottom-10 w-16 h-16 bg-indigo-500 rounded-full opacity-20 blur-md" />

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
                Tableau des paiements
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsModalOpen(true); 
              setIsEditMode(false);
              setNewPayment({
                client: clientName,
                clientId: clientId,
                amount: "",
                status: "à payer",
                type: "à payer",
                dueDate: new Date().toISOString().split("T")[0],
                category: "Matériel"
              });
            }}
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
          className="rounded-xl shadow-lg flex flex-col overflow-hidden border border-gray-200"
        >
          <div className="bg-gradient-to-r from-amber-600 to-amber-500 px-4 py-3">
            <h3 className="text-white font-bold">À payer</h3>
            <p className="text-amber-100 text-sm">
              {PAYMENT_DESCRIPTIONS["à payer"]}
            </p>
          </div>
          <div className="p-5 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-lg border border-amber-200">
                <ArrowDownTrayIcon className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {toPay}
                </p>
                <p className="text-sm text-gray-500">
                  {paymentCountsByType.toPay} paiements
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
          className="rounded-xl shadow-lg flex flex-col overflow-hidden border border-gray-200"
        >
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 py-3">
            <h3 className="text-white font-bold">Payé</h3>
            <p className="text-green-100 text-sm">
              {PAYMENT_DESCRIPTIONS["payé"]}
            </p>
          </div>
          <div className="p-5 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg border border-green-200">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {paid}
                </p>
                <p className="text-sm text-gray-500">
                  {paymentCountsByType.paid} paiements
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
          className="rounded-xl shadow-lg flex flex-col overflow-hidden border border-gray-200"
        >
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-4 py-3">
            <h3 className="text-white font-bold">À recevoir</h3>
            <p className="text-purple-100 text-sm">
              {PAYMENT_DESCRIPTIONS["à recevoir"]}
            </p>
          </div>
          <div className="p-5 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg border border-purple-200">
                <ArrowUpTrayIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {toReceive}
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
          className="rounded-xl shadow-lg flex flex-col overflow-hidden border border-gray-200"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3">
            <h3 className="text-white font-bold">Reçu</h3>
            <p className="text-blue-100 text-sm">
              {PAYMENT_DESCRIPTIONS["reçu"]}
            </p>
          </div>
          <div className="p-5 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg border border-blue-200">
                <BanknotesIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {received}
                </p>
                <p className="text-sm text-gray-500">
                  {paymentCountsByType.received} paiements
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
          {/* À payer */}
          <motion.div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100">
            <div className="relative bg-gradient-to-r from-amber-600 to-amber-400 px-6 py-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full -mr-10 -mt-10 opacity-20" />
              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <ArrowDownTrayIcon className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    À payer
                  </h2>
                </div>
                <div className="text-white text-lg font-bold">
                  {toPay}
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Payment List */}
              {isLoading ? (
                <LoadingState color="#d97706" />
              ) : toPayPayments.length === 0 ? (
                <EmptyState type="à payer" />
              ) : (
                <div className="grid gap-4">
                  {toPayPayments.map((payment) => (
                    <PaymentCard key={payment.id} payment={payment} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Payé */}
          <motion.div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100">
            <div className="relative bg-gradient-to-r from-green-600 to-green-400 px-6 py-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full -mr-10 -mt-10 opacity-20" />
              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <CheckCircleIcon className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Payé
                  </h2>
                </div>
                <div className="text-white text-lg font-bold">
                  {paid}
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Payment List */}
              {isLoading ? (
                <LoadingState color="#16a34a" />
              ) : paidPayments.length === 0 ? (
                <EmptyState type="payé" />
              ) : (
                <div className="grid gap-4">
                  {paidPayments.map((payment) => (
                    <PaymentCard key={payment.id} payment={payment} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
          {/* À recevoir */}
          <motion.div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100">
            <div className="relative bg-gradient-to-r from-purple-600 to-purple-400 px-6 py-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full -mr-10 -mt-10 opacity-20" />
              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <ArrowUpTrayIcon className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">À recevoir</h2>
                </div>
                <div className="text-white text-lg font-bold">
                  {toReceive}
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Payment List */}
              {isLoading ? (
                <LoadingState color="#9333ea" />
              ) : toReceivePayments.length === 0 ? (
                <EmptyState type="à recevoir" />
              ) : (
                <div className="grid gap-4">
                  {toReceivePayments.map((payment) => (
                    <PaymentCard key={payment.id} payment={payment} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Reçu */}
          <motion.div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -mr-10 -mt-10 opacity-20" />
              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <BanknotesIcon className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Reçu
                  </h2>
                </div>
                <div className="text-white text-lg font-bold">
                  {received}
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Payment List */}
              {isLoading ? (
                <LoadingState color="#2563eb" />
              ) : receivedPayments.length === 0 ? (
                <EmptyState type="reçu" />
              ) : (
                <div className="grid gap-4">
                  {receivedPayments.map((payment) => (
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
          <div className="relative bg-gradient-to-r from-indigo-800 via-indigo-700 to-indigo-600 px-6 py-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full -mr-10 -mt-10 opacity-20" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <ChartPieIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Analyse Financière
                </h2>
              </div>

              <div className="flex items-center gap-3">
                {/* Chart type toggle */}
                <div className="flex bg-white/10 backdrop-blur-sm rounded-lg">
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setChartType("pie")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      chartType === "pie"
                        ? "bg-white text-indigo-800"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    Camembert
                  </motion.button>
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setChartType("bar")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      chartType === "bar"
                        ? "bg-white text-indigo-800"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    Barres
                  </motion.button>
                </div>

                {/* Timeframe Buttons */}
                <div className="flex bg-white/10 backdrop-blur-sm rounded-lg">
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTimeframe("weekly")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeTimeframe === "weekly"
                        ? "bg-white text-indigo-800"
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
                        ? "bg-white text-indigo-800"
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
                        ? "bg-white text-indigo-800"
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
                        ? "bg-white text-indigo-800"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    Annuel
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Financial Summary - Updated with better gradients and contrast */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Total encaissé"
                value={
                  getTimeframeData()[getTimeframeData().length - 1].income
                }
                icon={<ArrowUpTrayIcon />}
                trend="+15%"
                trendUp={true}
                gradientFrom="#1e40af"
                gradientTo="#3b82f6"
                textColor="text-white"
              />
              <StatCard
                title="Dépenses"
                value={
                  getTimeframeData()[getTimeframeData().length - 1].expenses
                }
                icon={<ArrowDownTrayIcon />}
                trend="+8%"
                trendUp={false}
                gradientFrom="#15803d"
                gradientTo="#22c55e"
                textColor="text-white"
              />
              <StatCard
                title="Bénéfice net"
                value={getTimeframeData()[getTimeframeData().length - 1].profit}
                icon={<CurrencyEuroIcon />}
                trend={
                  getTimeframeData()[getTimeframeData().length - 1].growth
                }
                trendUp={getTimeframeData()[
                  getTimeframeData().length - 1
                ].growth.includes("+")}
                gradientFrom="#c2410c"
                gradientTo="#f97316"
                textColor="text-white"
              />
              <StatCard
                title="% de marge par dossier"
                value={marginPercentage}
                icon={<ArrowTrendingUpIcon />}
                trend="+4%"
                trendUp={true}
                gradientFrom="#7e22ce"
                gradientTo="#a855f7"
                textColor="text-white"
              />
            </div>

            {/* Charts Container */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enhanced Visualization with Chart Type Toggle */}
              <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  Répartition par période ({getTimeframeTitle()})
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "pie" ? (
                      <PieChart>
                        <Pie
                          data={getProfitDistributionByTime()}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={90}
                          innerRadius={40}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {getProfitDistributionByTime().map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color} 
                              strokeWidth={2} 
                              stroke="#fff"
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          layout="horizontal" 
                          verticalAlign="bottom" 
                          align="center"
                          formatter={(value) => <span className="text-sm font-medium">{value}</span>}
                        />
                      </PieChart>
                    ) : (
                      <BarChart 
                        data={getProfitDistributionByTime()}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <XAxis 
                          dataKey="name"
                          tick={{ fontSize: 12 }}
                          axisLine={{ stroke: '#e5e7eb' }}
                          tickLine={false}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          axisLine={{ stroke: '#e5e7eb' }}
                          tickLine={false}
                          tickFormatter={(value) => `${value / 1000}k€`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="value" 
                          radius={[4, 4, 0, 0]}
                        >
                          {getProfitDistributionByTime().map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
                
              {/* Category Distribution Chart */}
              <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  Répartition par catégorie
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "pie" ? (
                      <PieChart>
                        <Pie
                          data={getCategoryDistribution()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ percent }) =>
                            `${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={90}
                          innerRadius={40}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {getCategoryDistribution().map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color} 
                              strokeWidth={2}
                              stroke="#fff"
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          layout="vertical" 
                          verticalAlign="middle" 
                          align="right"
                          formatter={(value) => <span className="text-xs font-medium">{value}</span>}
                          wrapperStyle={{
                            paddingLeft: 20,
                            maxWidth: 140,
                            overflowWrap: 'break-word'
                          }}
                        />
                      </PieChart>
                    ) : (
                      <BarChart 
                        data={getCategoryDistribution()}
                        layout="vertical"
                        margin={{ top: 5, right: 5, left: 80, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                        <XAxis 
                          type="number"
                          tick={{ fontSize: 12 }}
                          axisLine={{ stroke: '#e5e7eb' }}
                          tickLine={false}
                          tickFormatter={(value) => `${value / 1000}k€`}
                        />
                        <YAxis 
                          type="category"
                          dataKey="name"
                          width={80}
                          tick={{ fontSize: 10 }}
                          axisLine={{ stroke: '#e5e7eb' }}
                          tickLine={false}
                          tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 12)}...` : value}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="value" 
                          radius={[0, 4, 4, 0]}
                        >
                          {getCategoryDistribution().map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Payment Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedPayment && (
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
              <div 
                className="relative px-6 py-4"
                style={{
                  background: `linear-gradient(to right, ${
                    selectedPayment.type === "à payer" ? "#d97706" :
                    selectedPayment.type === "payé" ? "#16a34a" :
                    selectedPayment.type === "à recevoir" ? "#9333ea" : "#2563eb"
                  }, ${
                    selectedPayment.type === "à payer" ? "#f59e0b" :
                    selectedPayment.type === "payé" ? "#22c55e" :
                    selectedPayment.type === "à recevoir" ? "#a855f7" : "#3b82f6"
                  })`
                }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 opacity-20" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <BanknotesIcon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      {isEditMode ? "Modifier le paiement" : "Détails du paiement"}
                    </h2>
                  </div>
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(255, 255, 255, 0.2)"
                    }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      setIsEditMode(false);
                    }}
                    className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {!isEditMode ? (
                // Details View
                <div className="p-6">
                  {/* Payment Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-semibold">{PAYMENT_TYPES[selectedPayment.type]}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Montant</p>
                      <p className="font-semibold text-xl">{selectedPayment.amount}€</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Statut</p>
                      <PaymentStatusBadge status={selectedPayment.status} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-semibold">
                        {formatDate(selectedPayment.paymentDate || selectedPayment.dueDate)}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Catégorie</p>
                      <CategoryBadge category={selectedPayment.category} />
                    </div>
                    
                    {/* Additional fields for cheque payments */}
                    {selectedPayment.category === "Chèque" && selectedPayment.chequeDetails && (
                      <>
                        <div>
                          <p className="text-sm text-gray-500">Nombre de chèques</p>
                          <p className="font-semibold">{selectedPayment.chequeDetails.count}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date d&apos;encaissement</p>
                          <p className="font-semibold">{formatDate(selectedPayment.chequeDetails.encashmentDate)}</p>
                        </div>
                      </>
                    )}
                    
                    {/* Notes */}
                    {selectedPayment.notes && (
                      <div className="col-span-2 mt-2">
                        <p className="text-sm text-gray-500">Notes</p>
                        <p className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                          {selectedPayment.notes}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Status Change Section */}
                  <div className="border-t border-gray-200 pt-5">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Actions</h3>
                    <div className="flex flex-wrap gap-3">
                      {/* Edit button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startEditMode}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Modifier
                      </motion.button>
                      
                      {/* Status change buttons */}
                      {selectedPayment.type === "à payer" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleStatusChange(selectedPayment, "payé")}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg transition-colors"
                        >
                          Marquer comme payé
                        </motion.button>
                      )}
                      
                      {selectedPayment.type === "payé" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleStatusChange(selectedPayment, "à payer")}
                          className="px-4 py-2 bg-amber-600 text-white rounded-lg transition-colors"
                        >
                          Marquer comme à payer
                        </motion.button>
                      )}
                      
                      {selectedPayment.type === "à recevoir" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleStatusChange(selectedPayment, "reçu")}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors"
                        >
                          Marquer comme reçu
                        </motion.button>
                      )}
                      
                      {selectedPayment.type === "reçu" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleStatusChange(selectedPayment, "en attente")}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg transition-colors"
                        >
                          Marquer comme en attente
                        </motion.button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsDetailsModalOpen(false)}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors font-medium"
                    >
                      Fermer
                    </motion.button>
                  </div>
                </div>
              ) : (
                // Edit Form
                <form onSubmit={handleEditSubmit} className="p-6">
                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="edit-amount"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Montant (€)
                      </label>
                      <input
                        id="edit-amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newPayment.amount}
                        onChange={(e) =>
                          setNewPayment({ ...newPayment, amount: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="edit-status"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Statut
                      </label>
                      <select
                        id="edit-status"
                        value={newPayment.status}
                        onChange={(e) => {
                          // Update status and also type
                          const newStatus = e.target.value as PaymentStatus;
                          const newType = getPaymentTypeFromStatus(newStatus);
                          
                          setNewPayment({
                            ...newPayment,
                            status: newStatus,
                            type: newType
                          });
                        }}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        required
                      >
                        {(selectedPayment.type === "à payer" || selectedPayment.type === "payé") ? (
                          <>
                            <option value="à payer">À payer</option>
                            <option value="payé">Payé</option>
                          </>
                        ) : (
                          <>
                            <option value="en attente">En attente</option>
                            <option value="reçu">Reçu</option>
                          </>
                        )}
                      </select>
                    </div>
                    
                    <div>
                      <label
                        htmlFor="edit-category"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Catégorie
                      </label>
                      <select
                        id="edit-category"
                        value={newPayment.category}
                        onChange={(e) =>
                          setNewPayment({
                            ...newPayment,
                            category: e.target.value as (PaymentOutCategory | PaymentInCategory)
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        required
                      >
                        {(selectedPayment.type === "à payer" || selectedPayment.type === "payé") ? (
                          // Out payment categories
                          PAYMENT_OUT_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))
                        ) : (
                          // In payment categories
                          PAYMENT_IN_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))
                        )}
                      </select>
                    </div>

                    {/* Show payment date field if status is Payé or Reçu */}
                    {(newPayment.status === "payé" || newPayment.status === "reçu") && (
                      <div>
                        <label
                          htmlFor="edit-paymentDate"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Date de paiement
                        </label>
                        <input
                          id="edit-paymentDate"
                          type="date"
                          value={newPayment.paymentDate || ""}
                          onChange={(e) =>
                            setNewPayment({ ...newPayment, paymentDate: e.target.value })
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                    )}
                    
                    {/* Cheque-specific fields */}
                    {newPayment.category === "Chèque" && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-800 flex items-center gap-1">
                          <InformationCircleIcon className="h-5 w-5 text-blue-500" />
                          Détails du chèque
                        </h4>
                        
                        <div>
                          <label
                            htmlFor="edit-chequeCount"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Nombre de chèques
                          </label>
                          <input
                            id="edit-chequeCount"
                            type="number"
                            min="1"
                            value={newPayment.chequeDetails?.count || 1}
                            onChange={(e) =>
                              setNewPayment({ 
                                ...newPayment, 
                                chequeDetails: {
                                  ...(newPayment.chequeDetails || {}),
                                  count: Number(e.target.value)
                                }
                              })
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          />
                        </div>
                        
                        <div>
                          <label
                            htmlFor="edit-encashmentDate"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Date d&apos;encaissement
                          </label>
                          <input
                            id="edit-encashmentDate"
                            type="date"
                            value={newPayment.chequeDetails?.encashmentDate || ""}
                            onChange={(e) =>
                              setNewPayment({ 
                                ...newPayment, 
                                chequeDetails: {
                                  ...(newPayment.chequeDetails || {}),
                                  encashmentDate: e.target.value
                                }
                              })
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label
                        htmlFor="edit-notes"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Notes (optionnel)
                      </label>
                      <textarea
                        id="edit-notes"
                        value={newPayment.notes || ""}
                        onChange={(e) =>
                          setNewPayment({ ...newPayment, notes: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setIsEditMode(false)}
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
                      Enregistrer
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <div className="relative bg-gradient-to-r from-indigo-700 to-blue-600 px-6 py-4">
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
                      <option value="à payer">À payer</option>
                      <option value="payé">Payé</option>
                      <option value="à recevoir">À recevoir</option>
                      <option value="reçu">Reçu</option>
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
                      {(newPayment.type === "à payer" || newPayment.type === "payé") ? (
                        <>
                          <option value="à payer">À payer</option>
                          <option value="payé">Payé</option>
                        </>
                      ) : (
                        <>
                          <option value="en attente">En attente</option>
                          <option value="reçu">Reçu</option>
                        </>
                      )}
                    </select>
                  </div>
                  
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Catégorie
                    </label>
                    <select
                      id="category"
                      value={newPayment.category}
                      onChange={(e) =>
                        setNewPayment({
                          ...newPayment,
                          category: e.target.value as (PaymentOutCategory | PaymentInCategory)
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      required
                    >
                      {(newPayment.type === "à payer" || newPayment.type === "payé") ? (
                        // Out payment categories
                        PAYMENT_OUT_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))
                      ) : (
                        // In payment categories
                        PAYMENT_IN_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* Show payment date field if status is Payé or Reçu */}
                  {(newPayment.status === "payé" || newPayment.status === "reçu") && (
                    <div>
                      <label
                        htmlFor="paymentDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Date de paiement
                      </label>
                      <input
                        id="paymentDate"
                        type="date"
                        value={newPayment.paymentDate || ""}
                        onChange={(e) =>
                          setNewPayment({ ...newPayment, paymentDate: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        required
                      />
                    </div>
                  )}
                  
                  {/* Cheque-specific fields */}
                  {newPayment.category === "Chèque" && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-800 flex items-center gap-1">
                        <InformationCircleIcon className="h-5 w-5 text-blue-500" />
                        Détails du chèque
                      </h4>
                      
                      <div>
                        <label
                          htmlFor="chequeCount"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Nombre de chèques
                        </label>
                        <input
                          id="chequeCount"
                          type="number"
                          min="1"
                          value={newPayment.chequeDetails?.count || 1}
                          onChange={(e) =>
                            setNewPayment({ 
                              ...newPayment, 
                              chequeDetails: {
                                ...(newPayment.chequeDetails || {}),
                                count: Number(e.target.value)
                              }
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label
                          htmlFor="encashmentDate"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Date d&apos;encaissement
                        </label>
                        <input
                          id="encashmentDate"
                          type="date"
                          value={newPayment.chequeDetails?.encashmentDate || ""}
                          onChange={(e) =>
                            setNewPayment({ 
                              ...newPayment, 
                              chequeDetails: {
                                ...(newPayment.chequeDetails || {}),
                                encashmentDate: e.target.value
                              }
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Notes (optionnel)
                    </label>
                    <textarea
                      id="notes"
                      value={newPayment.notes || ""}
                      onChange={(e) =>
                        setNewPayment({ ...newPayment, notes: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      rows={3}
                    />
                  </div>
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