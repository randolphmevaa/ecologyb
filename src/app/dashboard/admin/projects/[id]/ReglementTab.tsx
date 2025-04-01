import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CreditCardIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  BanknotesIcon,
  ArrowPathIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  // ExclamationTriangleIcon,
  // ArrowsUpDownIcon
} from "@heroicons/react/24/outline";


// Payment Type Definitions
type PaymentType = 
  | 'CLIENT_TO_PAY' 
  | 'CLIENT_PAID' 
  | 'TO_RECEIVE' 
  | 'PAID_OUT';

type PaymentStatus = 
  | 'PAIEMENT A VENIR' 
  | 'PAIEMENT RECU';

interface Payment {
  id: string;
  client: string;
  amount: string;
  status: PaymentStatus;
  type: PaymentType;
  dueDate?: string;
  paymentDate?: string;
}

// Payment types dictionary
const PAYMENT_TYPES: Record<PaymentType, string> = {
  CLIENT_TO_PAY: "À payer par le client",
  CLIENT_PAID: "Payé par le client",
  TO_RECEIVE: "À recevoir",
  PAID_OUT: "Payé aux fournisseurs"
};

// Sample data
const SAMPLE_PAYMENT_DATA: Payment[] = [
  { id: "p1", client: "Martin Dupont", amount: "1200", status: "PAIEMENT A VENIR", type: "CLIENT_TO_PAY", dueDate: "2025-05-15" },
  { id: "p2", client: "Sophie Laurent", amount: "650", status: "PAIEMENT RECU", type: "CLIENT_PAID", paymentDate: "2025-03-10" },
  { id: "p3", client: "Jean Lefebvre", amount: "850", status: "PAIEMENT A VENIR", type: "TO_RECEIVE", dueDate: "2025-04-20" },
  { id: "p4", client: "Marie Dubois", amount: "1450", status: "PAIEMENT RECU", type: "PAID_OUT", paymentDate: "2025-03-05" },
  { id: "p5", client: "Thomas Moreau", amount: "950", status: "PAIEMENT A VENIR", type: "CLIENT_TO_PAY", dueDate: "2025-04-30" },
  { id: "p6", client: "Julie Girard", amount: "2200", status: "PAIEMENT RECU", type: "CLIENT_PAID", paymentDate: "2025-03-15" },
  { id: "p7", client: "Paul Bernard", amount: "1800", status: "PAIEMENT A VENIR", type: "TO_RECEIVE", dueDate: "2025-05-10" },
  { id: "p8", client: "Camille Petit", amount: "780", status: "PAIEMENT RECU", type: "PAID_OUT", paymentDate: "2025-02-28" },
  { id: "p9", client: "Alexandre Leroy", amount: "1350", status: "PAIEMENT A VENIR", type: "CLIENT_TO_PAY", dueDate: "2025-04-25" },
  { id: "p10", client: "Émilie Simon", amount: "2100", status: "PAIEMENT RECU", type: "CLIENT_PAID", paymentDate: "2025-03-20" },
  { id: "p11", client: "Marc Fournier", amount: "1600", status: "PAIEMENT A VENIR", type: "TO_RECEIVE", dueDate: "2025-04-15" },
  { id: "p12", client: "Céline Mercier", amount: "920", status: "PAIEMENT RECU", type: "PAID_OUT", paymentDate: "2025-03-02" }
];

// Tab type
type TabType = 'all' | 'recent';

interface PaymentDashboardProps {
  contactId?: string;
}

const PaymentDashboard: React.FC<PaymentDashboardProps> = ({ contactId }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeClientToPayTab, setActiveClientToPayTab] = useState<TabType>('all');
  const [activeClientPaidTab, setActiveClientPaidTab] = useState<TabType>('all');
  const [activeToReceiveTab, setActiveToReceiveTab] = useState<TabType>('all');
  const [activePaidOutTab, setActivePaidOutTab] = useState<TabType>('all');
  const [searchClientToPay, setSearchClientToPay] = useState('');
  const [searchClientPaid, setSearchClientPaid] = useState('');
  const [searchToReceive, setSearchToReceive] = useState('');
  const [searchPaidOut, setSearchPaidOut] = useState('');
  
  // Fetch data effect
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call with sample data
    setTimeout(() => {
      setPayments(SAMPLE_PAYMENT_DATA);
      setIsLoading(false);
    }, 800);
  }, [contactId]);
  
  // Calculate totals and filter payments
  const {
    clientToPayTotal,
    clientPaidTotal,
    toReceiveTotal,
    paidOutTotal,
    clientToPayPayments,
    clientPaidPayments,
    toReceivePayments,
    paidOutPayments
  } = useMemo(() => {
    // Filter payments by type
    const clientToPay = payments.filter(p => p.type === "CLIENT_TO_PAY");
    const clientPaid = payments.filter(p => p.type === "CLIENT_PAID");
    const toReceive = payments.filter(p => p.type === "TO_RECEIVE");
    const paidOut = payments.filter(p => p.type === "PAID_OUT");
    
    // Calculate totals
    const clientToPaySum = clientToPay.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const clientPaidSum = clientPaid.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const toReceiveSum = toReceive.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const paidOutSum = paidOut.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    
    // Apply search filters
    const filteredClientToPay = clientToPay.filter(p => 
      p.client.toLowerCase().includes(searchClientToPay.toLowerCase())
    );
    
    const filteredClientPaid = clientPaid.filter(p => 
      p.client.toLowerCase().includes(searchClientPaid.toLowerCase())
    );
    
    const filteredToReceive = toReceive.filter(p => 
      p.client.toLowerCase().includes(searchToReceive.toLowerCase())
    );
    
    const filteredPaidOut = paidOut.filter(p => 
      p.client.toLowerCase().includes(searchPaidOut.toLowerCase())
    );
    
    return {
      clientToPayTotal: clientToPaySum.toLocaleString("fr-FR") + "€",
      clientPaidTotal: clientPaidSum.toLocaleString("fr-FR") + "€",
      toReceiveTotal: toReceiveSum.toLocaleString("fr-FR") + "€",
      paidOutTotal: paidOutSum.toLocaleString("fr-FR") + "€",
      clientToPayPayments: filteredClientToPay,
      clientPaidPayments: filteredClientPaid,
      toReceivePayments: filteredToReceive,
      paidOutPayments: filteredPaidOut
    };
  }, [
    payments, 
    searchClientToPay, 
    searchClientPaid, 
    searchToReceive, 
    searchPaidOut
  ]);
  
  // Function to format a date for display
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };
  
  // Payment status badge component
  const PaymentStatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
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
      whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:border-blue-300"
    >
      <div className="p-3 bg-blue-50 rounded-lg">
        <BanknotesIcon className="h-8 w-8 text-blue-600" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {payment.client}
          </h3>
          <PaymentStatusBadge status={payment.status} />
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            {formatDate(payment.paymentDate || payment.dueDate)}
          </div>
          <div className="font-semibold text-black">
            {payment.amount}€
          </div>
        </div>
      </div>
    </motion.div>
  );
  
  // Empty state component
  const EmptyState: React.FC<{ type: PaymentType }> = ({ type }) => (
    <div className="bg-gray-50 rounded-xl p-8 text-center">
      <BanknotesIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
      <h3 className="text-gray-900 font-medium text-lg mb-1">Aucun paiement trouvé</h3>
      <p className="text-gray-500 mb-4">
        Aucun paiement de type &quot;{PAYMENT_TYPES[type]}&quot; ne correspond à vos critères
      </p>
    </div>
  );
  
  // Loading component
  const LoadingState: React.FC<{ color?: string }> = ({ color = "blue" }) => (
    <div className="flex justify-center items-center py-16">
      <div className="relative">
        <div className={`h-16 w-16 border-4 border-${color}-200 border-dashed rounded-full animate-spin`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ArrowPathIcon className={`h-6 w-6 text-${color}-500 animate-pulse`} />
        </div>
      </div>
    </div>
  );
  return (
    <div className="h-full">
      {/* Enhanced Header with Background */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="relative bg-gradient-to-r from-indigo-600 to-indigo-400 px-10 py-8 rounded-t-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full -mr-16 -mt-20 opacity-30" />
        <div className="absolute bottom-0 right-24 w-32 h-32 bg-indigo-300 rounded-full -mb-10 opacity-20" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center">
            <div className="flex items-center justify-center bg-white text-indigo-600 rounded-full w-16 h-16 mr-6 shadow-xl">
              <CreditCardIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-white">
                Tableau des paiements
              </h2>
              <p className="text-indigo-100 mt-1">Gestion de tous vos paiements et encaissements</p>
            </div>
          </div>
          
          <button
            className="px-4 py-2 bg-white text-indigo-700 rounded-lg shadow-md hover:bg-indigo-50 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Ajouter un paiement</span>
          </button>
        </div>
      </motion.div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-indigo-50">
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl shadow-md flex flex-col overflow-hidden"
        >
          <div className="bg-blue-600 px-4 py-3">
            <h3 className="text-white font-bold">Total à payer</h3>
            <p className="text-blue-100 text-sm">Paiements clients à venir</p>
          </div>
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ArrowDownTrayIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{clientToPayTotal}</p>
                <p className="text-sm text-gray-500">{clientToPayPayments.length} paiements</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl shadow-md flex flex-col overflow-hidden"
        >
          <div className="bg-green-600 px-4 py-3">
            <h3 className="text-white font-bold">Total payé</h3>
            <p className="text-green-100 text-sm">Paiements reçus des clients</p>
          </div>
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{clientPaidTotal}</p>
                <p className="text-sm text-gray-500">{clientPaidPayments.length} paiements</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl shadow-md flex flex-col overflow-hidden"
        >
          <div className="bg-amber-600 px-4 py-3">
            <h3 className="text-white font-bold">Total à recevoir</h3>
            <p className="text-amber-100 text-sm">Paiements attendus</p>
          </div>
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-lg">
                <ArrowUpTrayIcon className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{toReceiveTotal}</p>
                <p className="text-sm text-gray-500">{toReceivePayments.length} paiements</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl shadow-md flex flex-col overflow-hidden"
        >
          <div className="bg-indigo-600 px-4 py-3">
            <h3 className="text-white font-bold">Total reçu</h3>
            <p className="text-indigo-100 text-sm">Paiements versés</p>
          </div>
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <BanknotesIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{paidOutTotal}</p>
                <p className="text-sm text-gray-500">{paidOutPayments.length} paiements</p>
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
        className="bg-white rounded-b-2xl shadow-xl p-6 pb-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* À payer par le client */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100"
          >
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -mr-10 -mt-10 opacity-20" />
              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <ArrowDownTrayIcon className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">À payer par le client</h2>
                </div>
                <div className="text-white text-lg font-bold">
                  {clientToPayTotal}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {/* Enhanced Search */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="relative flex-1 w-full">
                  <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchClientToPay}
                    onChange={(e) => setSearchClientToPay(e.target.value)}
                    placeholder="Rechercher un client..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveClientToPayTab("all")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeClientToPayTab === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeClientToPayTab === "recent"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveClientToPayTab("recent")}
                  >
                    Récents
                  </button>
                </div>
              </div>
              
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
          <motion.div
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100"
          >
            <div className="relative bg-gradient-to-r from-green-600 to-green-400 px-6 py-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full -mr-10 -mt-10 opacity-20" />
              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <CheckCircleIcon className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Payé par le client</h2>
                </div>
                <div className="text-white text-lg font-bold">
                  {clientPaidTotal}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {/* Enhanced Search */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="relative flex-1 w-full">
                  <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchClientPaid}
                    onChange={(e) => setSearchClientPaid(e.target.value)}
                    placeholder="Rechercher un client..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveClientPaidTab("all")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeClientPaidTab === "all"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeClientPaidTab === "recent"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveClientPaidTab("recent")}
                  >
                    Récents
                  </button>
                </div>
              </div>
              
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
          <motion.div
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100"
          >
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
              {/* Enhanced Search */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="relative flex-1 w-full">
                  <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchToReceive}
                    onChange={(e) => setSearchToReceive(e.target.value)}
                    placeholder="Rechercher un client..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveToReceiveTab("all")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeToReceiveTab === "all"
                        ? "bg-amber-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeToReceiveTab === "recent"
                        ? "bg-amber-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveToReceiveTab("recent")}
                  >
                    Récents
                  </button>
                </div>
              </div>
              
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

          {/* Payé (versé) */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-indigo-100"
          >
            <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-400 px-6 py-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full -mr-10 -mt-10 opacity-20" />
              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <BanknotesIcon className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Payé aux fournisseurs</h2>
                </div>
                <div className="text-white text-lg font-bold">
                  {paidOutTotal}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {/* Enhanced Search */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="relative flex-1 w-full">
                  <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchPaidOut}
                    onChange={(e) => setSearchPaidOut(e.target.value)}
                    placeholder="Rechercher un client..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActivePaidOutTab("all")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activePaidOutTab === "all"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activePaidOutTab === "recent"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setActivePaidOutTab("recent")}
                  >
                    Récents
                  </button>
                </div>
              </div>
              
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
    </div>
  );
};

export default PaymentDashboard;