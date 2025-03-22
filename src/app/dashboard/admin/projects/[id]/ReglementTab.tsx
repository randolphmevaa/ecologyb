import React, { FC, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClockIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ArrowsUpDownIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  FunnelIcon,
  TrashIcon,
  ExclamationCircleIcon,
  BanknotesIcon,
  ArrowPathIcon,
  CalendarIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

// Constants for better maintainability
const PAYMENT_SOURCES = [
  { value: "MaPrimeRenov", label: "MaPrimeRenov" },
  { value: "Cee", label: "Cee" },
  { value: "Chèque", label: "Chèque" },
  { value: "Virement", label: "Virement" },
  { value: "Financement", label: "Financement" },
  { value: "Acompte", label: "Acompte" },
  { value: "L'anah", label: "L'anah" },
];

const PAYMENT_STATUSES = [
  { value: "PAIEMENT A VENIR", label: "Paiement à venir" },
  { value: "PAIEMENT RECU", label: "Paiement reçu" },
];

interface ReglementTabProps {
  contactId: string;
}

interface Payment {
  id: string;
  provenance: string;
  amount: string;
  paymentDate: string;
  status: string;
}

const DEFAULT_NEW_PAYMENT = {
  provenance: "MaPrimeRenov",
  amount: "",
  paymentDate: "",
  status: "PAIEMENT A VENIR",
};

// Separate components for better organization
const PaymentStatusBadge: FC<{ status: string }> = ({ status }) => {
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
      {isReceived ? "Paiement reçu" : "Paiement à venir"}
    </span>
  );
};

const FormattedAmount: FC<{ amount: string }> = ({ amount }) => {
  // Format amount to look better
  const formattedAmount = amount.includes("€") ? amount : `${amount}€`;
  return <span className="font-semibold">{formattedAmount}</span>;
};

const PaymentForm: FC<{
  payment: Partial<Payment>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (key: string, value: string) => void;
  onCancel: () => void;
  submitLabel: string;
}> = ({ payment, onSubmit, onChange, onCancel, submitLabel }) => {
  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <div>
        <label className="block text-sm mb-1 text-gray-700 font-medium">
          Provenance
        </label>
        <select
          value={payment.provenance || ""}
          onChange={(e) => onChange("provenance", e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
          {PAYMENT_SOURCES.map((source) => (
            <option key={source.value} value={source.value}>
              {source.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1 text-gray-700 font-medium">
          Montant
        </label>
        <input
          type="text"
          value={payment.amount || ""}
          onChange={(e) => onChange("amount", e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="ex: 1200€"
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1 text-gray-700 font-medium">
          Statut
        </label>
        <select
          value={payment.status || ""}
          onChange={(e) => onChange("status", e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
          {PAYMENT_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1 text-gray-700 font-medium">
          Date de paiement
        </label>
        <input
          type="date"
          value={payment.paymentDate || ""}
          onChange={(e) => onChange("paymentDate", e.target.value)}
          className={`w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
            payment.status !== "PAIEMENT RECU" ? "bg-gray-50" : ""
          }`}
          disabled={payment.status !== "PAIEMENT RECU"}
        />
        {payment.status !== "PAIEMENT RECU" && (
          <p className="text-xs text-gray-500 mt-1">
            Obligatoire pour les paiements reçus
          </p>
        )}
      </div>
      <div className="md:col-span-4 flex justify-end space-x-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 transition hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg transition hover:bg-indigo-700 inline-flex items-center"
        >
          <CheckIcon className="h-4 w-4 mr-1" />
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

const ConfirmDialog: FC<{
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, title, message, confirmLabel, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-white rounded-xl p-6 shadow-2xl max-w-md w-full"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 transition hover:bg-gray-50"
            onClick={onCancel}
          >
            Annuler
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg transition hover:bg-red-700"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const EmptyState: FC<{ onAddClick: () => void }> = ({ onAddClick }) => (
  <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl py-12 px-4">
    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
      <CreditCardIcon className="h-10 w-10 text-indigo-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      Aucun paiement trouvé
    </h3>
    <p className="text-gray-500 mb-6 max-w-md text-center">
      Il n&apos;y a pas encore de paiements enregistrés pour ce contact. Commencez par
      ajouter votre premier paiement.
    </p>
    <button
      onClick={onAddClick}
      className="bg-indigo-600 text-white px-4 py-2 rounded-lg transition hover:bg-indigo-700 inline-flex items-center"
    >
      <PlusIcon className="h-5 w-5 mr-1" />
      Ajouter un paiement
    </button>
  </div>
);

const ReglementTab: FC<ReglementTabProps> = ({ contactId }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Payment;
    direction: "asc" | "desc";
  }>({
    key: "paymentDate",
    direction: "desc", // Changed to desc to show newest first
  });

  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newPayment, setNewPayment] = useState({ ...DEFAULT_NEW_PAYMENT });

  // State for editing a payment row
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [editedPayment, setEditedPayment] = useState<Payment | null>(null);

  // State for delete confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    paymentId: string | null;
  }>({
    isOpen: false,
    paymentId: null,
  });

  // Fetch payments on mount or when contactId changes
  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/payments?contactId=${contactId}`);
        if (!response.ok) throw new Error("Failed to fetch payments");
        const data = await response.json();
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setError("Impossible de charger les paiements. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, [contactId]);

  // Summary counts using useMemo for performance
  const { paiementsAVenirCount, paiementRecuCount, totalAmount } = useMemo(() => {
    const paiementsAVenir = payments.filter(
      (payment) => payment.status === "PAIEMENT A VENIR"
    );
    const paiementsRecus = payments.filter(
      (payment) => payment.status === "PAIEMENT RECU"
    );

    // Calculate total amount (removing € symbol if present)
    const total = payments.reduce((sum, payment) => {
      const amountNum = parseFloat(payment.amount.replace(/[€\s]/g, ""));
      return isNaN(amountNum) ? sum : sum + amountNum;
    }, 0);

    return {
      paiementsAVenirCount: paiementsAVenir.length,
      paiementRecuCount: paiementsRecus.length,
      totalAmount: total.toLocaleString("fr-FR") + "€",
    };
  }, [payments]);

  // Sorting and filtering logic with useMemo for performance
  const displayedPayments = useMemo(() => {
    const sortedPayments = [...payments].sort((a, b) => {
      // Special case for date sorting
      if (sortConfig.key === "paymentDate") {
        const dateA = a[sortConfig.key] ? new Date(a[sortConfig.key]) : new Date(0);
        const dateB = b[sortConfig.key] ? new Date(b[sortConfig.key]) : new Date(0);

        return sortConfig.direction === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }

      // Special case for amount sorting (convert to number first)
      if (sortConfig.key === "amount") {
        const amountA = parseFloat(a[sortConfig.key].replace(/[€\s]/g, "")) || 0;
        const amountB = parseFloat(b[sortConfig.key].replace(/[€\s]/g, "")) || 0;

        return sortConfig.direction === "asc"
          ? amountA - amountB
          : amountB - amountA;
      }

      // Default string comparison
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filterStatus
      ? sortedPayments.filter((payment) => payment.status === filterStatus)
      : sortedPayments;
  }, [payments, sortConfig, filterStatus]);

  const handleSort = (key: keyof Payment) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Handle new payment changes; reset date if status is "PAIEMENT A VENIR"
  const handleNewPaymentChange = (key: string, value: string) => {
    setNewPayment((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "status" && value === "PAIEMENT A VENIR") {
        updated.paymentDate = "";
      }
      return updated;
    });
  };

  // Add new payment
  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Form validation
      if (newPayment.status === "PAIEMENT RECU" && !newPayment.paymentDate) {
        toast.error("La date de paiement est requise pour les paiements reçus");
        return;
      }

      const response = await fetch(`/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newPayment, contactId }),
      });

      if (!response.ok) throw new Error("Failed to add payment");

      const addedPayment = await response.json();
      setPayments((prev) => [...prev, addedPayment]);
      setNewPayment({ ...DEFAULT_NEW_PAYMENT });
      setShowAddForm(false);
      toast.success("Paiement ajouté avec succès");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'ajout du paiement");
    }
  };

  // Confirm delete dialog
  const openDeleteConfirmation = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      paymentId: id,
    });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      paymentId: null,
    });
  };

  // Delete a payment
  const handleDeletePayment = async () => {
    if (!deleteConfirmation.paymentId) return;

    try {
      const response = await fetch(
        `/api/payments/${deleteConfirmation.paymentId}?contactId=${contactId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete payment");

      setPayments((prev) =>
        prev.filter((payment) => payment.id !== deleteConfirmation.paymentId)
      );

      toast.success("Paiement supprimé avec succès");
      closeDeleteConfirmation();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression du paiement");
    }
  };

  // Start editing a row
  const startEditing = (payment: Payment) => {
    setEditingPaymentId(payment.id);
    setEditedPayment({ ...payment });
  };

  const cancelEditing = () => {
    setEditingPaymentId(null);
    setEditedPayment(null);
  };

  // Handle edited payment change; reset date if status is "PAIEMENT A VENIR"
  const handleEditChange = (key: string, value: string) => {
    if (editedPayment) {
      const updated = { ...editedPayment, [key]: value };
      if (key === "status" && value === "PAIEMENT A VENIR") {
        updated.paymentDate = "";
      }
      setEditedPayment(updated);
    }
  };

  // Save edited payment
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPaymentId || !editedPayment) return;

    try {
      // Form validation
      if (editedPayment.status === "PAIEMENT RECU" && !editedPayment.paymentDate) {
        toast.error("La date de paiement est requise pour les paiements reçus");
        return;
      }

      const response = await fetch(`/api/payments/${editingPaymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editedPayment, contactId }),
      });

      if (!response.ok) throw new Error("Failed to update payment");

      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === editingPaymentId ? editedPayment : payment
        )
      );

      toast.success("Paiement mis à jour avec succès");
      cancelEditing();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour du paiement");
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Enhanced Header with Background */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="relative bg-gradient-to-r from-indigo-600 to-indigo-400 px-10 py-8"
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
                Paiements
              </h2>
              <p className="text-indigo-100 mt-1">Vue d&apos;ensemble de vos solutions énergétiques</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              setShowAddForm((prev) => !prev);
              if (showAddForm) {
                setNewPayment({ ...DEFAULT_NEW_PAYMENT });
              }
            }}
            className="px-4 py-2 bg-white text-indigo-700 rounded-lg shadow-md hover:bg-indigo-50 transition-colors flex items-center gap-2"
          >
            {showAddForm ? (
              <>
                <XMarkIcon className="h-5 w-5" />
                <span>Annuler</span>
              </>
            ) : (
              <>
                <PlusIcon className="h-5 w-5" />
                <span>Ajouter un paiement</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-indigo-50 border-b border-indigo-100">
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4"
        >
          <div className="p-3 bg-blue-100 rounded-lg">
            <ClockIcon className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Paiements à venir</p>
            <p className="text-2xl font-bold text-gray-900">{paiementsAVenirCount}</p>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4"
        >
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Paiements reçus</p>
            <p className="text-2xl font-bold text-gray-900">{paiementRecuCount}</p>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4"
        >
          <div className="p-3 bg-amber-100 rounded-lg">
            <BanknotesIcon className="h-8 w-8 text-amber-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Montant total</p>
            <p className="text-2xl font-bold text-gray-900">{totalAmount}</p>
          </div>
        </motion.div>
      </div>

      {/* Add Payment Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white px-6 py-4 border-b border-gray-200 overflow-hidden"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Ajouter un paiement
            </h2>
            <PaymentForm
              payment={newPayment}
              onSubmit={handleAddPayment}
              onChange={handleNewPaymentChange}
              onCancel={() => {
                setShowAddForm(false);
                setNewPayment({ ...DEFAULT_NEW_PAYMENT });
              }}
              submitLabel="Enregistrer"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Sorting */}
      <div className="p-4 bg-white border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex space-x-2 mb-4 sm:mb-0">
          <button
            onClick={() => setFilterStatus(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition inline-flex items-center gap-1 ${
              filterStatus === null
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FunnelIcon className="h-4 w-4" />
            Tous
          </button>
          <button
            onClick={() => setFilterStatus("PAIEMENT A VENIR")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition inline-flex items-center gap-1 ${
              filterStatus === "PAIEMENT A VENIR"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ClockIcon className="h-4 w-4" />
            À venir
          </button>
          <button
            onClick={() => setFilterStatus("PAIEMENT RECU")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition inline-flex items-center gap-1 ${
              filterStatus === "PAIEMENT RECU"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <CheckCircleIcon className="h-4 w-4" />
            Reçus
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">Trier par</span>
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={sortConfig.key}
              onChange={(e) => handleSort(e.target.value as keyof Payment)}
            >
              <option value="provenance">Provenance</option>
              <option value="amount">Montant</option>
              <option value="paymentDate">Date de paiement</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              {sortConfig.direction === "asc" ? (
                <ArrowsUpDownIcon className="h-4 w-4" />
              ) : (
                <ArrowsUpDownIcon className="h-4 w-4 rotate-180" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-y-auto">
        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
              <p className="text-indigo-500">Chargement des paiements...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <ExclamationCircleIcon className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur</h3>
            <p className="text-gray-600 mb-6 text-center">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <ArrowPathIcon className="h-5 w-5" />
              Réessayer
            </button>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-6">
            <EmptyState onAddClick={() => setShowAddForm(true)} />
          </div>
        ) : (
          <div className="p-6">
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("provenance")}
                    >
                      <div className="flex items-center">
                        Provenance
                        {sortConfig.key === "provenance" && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("amount")}
                    >
                      <div className="flex items-center">
                        Montant
                        {sortConfig.key === "amount" && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("paymentDate")}
                    >
                      <div className="flex items-center">
                        Date de paiement
                        {sortConfig.key === "paymentDate" && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-indigo-50/50 transition-colors"
                    >
                      {/* Editing mode */}
                      {editingPaymentId === payment.id && editedPayment ? (
                        <td colSpan={5} className="px-6 py-4">
                          <PaymentForm
                            payment={editedPayment}
                            onSubmit={handleSaveEdit}
                            onChange={handleEditChange}
                            onCancel={cancelEditing}
                            submitLabel="Mettre à jour"
                          />
                        </td>
                      ) : (
                        <>
                          {/* Provenance */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                                <ChartBarIcon className="h-5 w-5 text-indigo-600" />
                              </div>
                              <span className="text-gray-700 font-medium">
                                {payment.provenance}
                              </span>
                            </div>
                          </td>

                          {/* Montant */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-900">
                              <FormattedAmount amount={payment.amount} />
                            </div>
                          </td>

                          {/* Date de paiement */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {payment.paymentDate && (
                                <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                              )}
                              <span className="text-gray-700">
                                {formatDate(payment.paymentDate)}
                              </span>
                            </div>
                          </td>

                          {/* Statut */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <PaymentStatusBadge status={payment.status} />
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => startEditing(payment)}
                                className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                                title="Modifier"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openDeleteConfirmation(payment.id)}
                                className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                title="Supprimer"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <AnimatePresence>
        {deleteConfirmation.isOpen && (
          <ConfirmDialog
            isOpen={deleteConfirmation.isOpen}
            title="Confirmer la suppression"
            message="Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action est irréversible."
            confirmLabel="Supprimer"
            onConfirm={handleDeletePayment}
            onCancel={closeDeleteConfirmation}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReglementTab;