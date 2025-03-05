import React, { FC, useState, useEffect, useMemo } from "react";
import {
  Clock,
  CreditCard,
  CheckCircle,
  ArrowDownUp,
  Edit,
  Check,
  X,
  Plus,
  Filter,
  Trash2,
  AlertCircle,
} from "lucide-react";
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
        <CheckCircle className="mr-1" size={14} />
      ) : (
        <Clock className="mr-1" size={14} />
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
      className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-lg shadow-md"
    >
      <div>
        <label className="block text-sm mb-1 text-[#213f5b] font-medium">
          Provenance
        </label>
        <select
          value={payment.provenance || ""}
          onChange={(e) => onChange("provenance", e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
          {PAYMENT_SOURCES.map((source) => (
            <option key={source.value} value={source.value}>
              {source.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1 text-[#213f5b] font-medium">
          Montant
        </label>
        <input
          type="text"
          value={payment.amount || ""}
          onChange={(e) => onChange("amount", e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="ex: 1200€"
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1 text-[#213f5b] font-medium">
          Statut
        </label>
        <select
          value={payment.status || ""}
          onChange={(e) => onChange("status", e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
          {PAYMENT_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1 text-[#213f5b] font-medium">
          Date de paiement
        </label>
        <input
          type="date"
          value={payment.paymentDate || ""}
          onChange={(e) => onChange("paymentDate", e.target.value)}
          className={`w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
            payment.status !== "PAIEMENT RECU" ? "bg-gray-100" : ""
          }`}
          disabled={payment.status !== "PAIEMENT RECU"}
        />
        {payment.status !== "PAIEMENT RECU" && (
          <p className="text-xs text-gray-500 mt-1">
            Obligatoire pour les paiements reçus
          </p>
        )}
      </div>
      <div className="md:col-span-4 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 transition hover:bg-gray-100"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="bg-[#213f5b] text-white px-6 py-2 rounded-md transition hover:bg-opacity-90 inline-flex items-center"
        >
          <Check size={16} className="mr-1" />
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 transition hover:bg-gray-100"
            onClick={onCancel}
          >
            Annuler
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md transition hover:bg-red-700"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const EmptyState: FC<{ onAddClick: () => void }> = ({ onAddClick }) => (
  <div className="py-12 text-center bg-gray-50 rounded-lg">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
      <CreditCard className="text-blue-600" size={28} />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Aucun paiement trouvé
    </h3>
    <p className="text-gray-500 mb-4 max-w-md mx-auto">
      Il n&apos;y a pas encore de paiements enregistrés pour ce contact. Commencez par
      ajouter votre premier paiement.
    </p>
    <button
      onClick={onAddClick}
      className="bg-[#213f5b] text-white px-4 py-2 rounded-md transition hover:bg-opacity-90 inline-flex items-center"
    >
      <Plus size={16} className="mr-1" />
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
    <div className="">
      <div className="">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <header className="bg-[#213f5b] text-white p-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Paiements</h1>
              <p className="text-sm opacity-80">
                Vue d&apos;ensemble de vos solutions énergétiques
              </p>
            </div>
            <div className="p-3 bg-white rounded-full">
              <CreditCard className="text-[#213f5b]" size={32} />
            </div>
          </header>

          {/* Summary Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-[#bfddf9]">
            <div className="bg-white p-4 rounded-xl shadow transition transform hover:scale-105 flex items-center space-x-4">
              <Clock className="text-[#213f5b]" size={24} />
              <div>
                <p className="text-gray-500 text-sm">Paiements à venir</p>
                <p className="text-2xl font-bold text-[#213f5b]">
                  {paiementsAVenirCount}
                </p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow transition transform hover:scale-105 flex items-center space-x-4">
              <CheckCircle className="text-[#213f5b]" size={24} />
              <div>
                <p className="text-gray-500 text-sm">Paiements reçus</p>
                <p className="text-2xl font-bold text-[#213f5b]">
                  {paiementRecuCount}
                </p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow transition transform hover:scale-105 flex items-center space-x-4">
              <CreditCard className="text-[#213f5b]" size={24} />
              <div>
                <p className="text-gray-500 text-sm">Montant total</p>
                <p className="text-2xl font-bold text-[#213f5b]">
                  {totalAmount}
                </p>
              </div>
            </div>
          </section>

          {/* Add Payment Toggle & Form */}
          <section className="bg-[#d2fcb2] px-6 pt-6 pb-3">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => {
                  setShowAddForm((prev) => !prev);
                  if (showAddForm) {
                    setNewPayment({ ...DEFAULT_NEW_PAYMENT });
                  }
                }}
                className="bg-[#213f5b] text-white px-6 py-2 rounded-md transition hover:bg-opacity-90 flex items-center"
              >
                {showAddForm ? (
                  <>
                    <X size={16} className="mr-1" />
                    Annuler
                  </>
                ) : (
                  <>
                    <Plus size={16} className="mr-1" />
                    Ajouter un Paiement
                  </>
                )}
              </button>
            </div>

            {showAddForm && (
              <div className="mb-6 animate-fadeIn">
                <h2 className="text-xl font-bold mb-4 text-[#213f5b]">
                  Ajouter un Paiement
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
              </div>
            )}
          </section>

          {/* Filters and Sorting */}
          <section className="px-6 py-4 bg-[#d2fcb2] flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex space-x-2 mb-4 md:mb-0">
              <button
                onClick={() => setFilterStatus(null)}
                className={`px-4 py-2 rounded-full text-sm transition inline-flex items-center ${
                  filterStatus === null
                    ? "bg-[#213f5b] text-white"
                    : "bg-white text-[#213f5b] border border-[#213f5b]"
                }`}
              >
                <Filter size={14} className="mr-1" />
                Tous
              </button>
              <button
                onClick={() => setFilterStatus("PAIEMENT A VENIR")}
                className={`px-4 py-2 rounded-full text-sm transition inline-flex items-center ${
                  filterStatus === "PAIEMENT A VENIR"
                    ? "bg-[#213f5b] text-white"
                    : "bg-white text-[#213f5b] border border-[#213f5b]"
                }`}
              >
                <Clock size={14} className="mr-1" />
                Paiements à venir
              </button>
              <button
                onClick={() => setFilterStatus("PAIEMENT RECU")}
                className={`px-4 py-2 rounded-full text-sm transition inline-flex items-center ${
                  filterStatus === "PAIEMENT RECU"
                    ? "bg-[#213f5b] text-white"
                    : "bg-white text-[#213f5b] border border-[#213f5b]"
                }`}
              >
                <CheckCircle size={14} className="mr-1" />
                Paiements reçus
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-[#213f5b] font-medium">Trier par</span>
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm"
                  value={sortConfig.key}
                  onChange={(e) => handleSort(e.target.value as keyof Payment)}
                >
                  <option value="provenance">Provenance</option>
                  <option value="amount">Montant</option>
                  <option value="paymentDate">Date de paiement</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  {sortConfig.direction === "asc" ? (
                    <ArrowDownUp size={16} />
                  ) : (
                    <ArrowDownUp size={16} className="rotate-180" />
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Loading, Error and Empty states */}
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#213f5b]"></div>
              <p className="mt-2 text-gray-600">Chargement des paiements...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-[#213f5b] text-white rounded-md"
              >
                Réessayer
              </button>
            </div>
          ) : payments.length === 0 ? (
            <EmptyState onAddClick={() => setShowAddForm(true)} />
          ) : (
            /* Payments Table */
            <section className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-[#bfddf9] text-[#213f5b]">
                      <th
                        className="px-4 py-3 text-left rounded-l-lg cursor-pointer"
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
                        className="px-4 py-3 text-left cursor-pointer"
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
                        className="px-4 py-3 text-left cursor-pointer"
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
                      <th className="px-4 py-3 text-left">Statut</th>
                      <th className="px-4 py-3 text-right rounded-r-lg">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                      >
                        {/* Editing mode */}
                        {editingPaymentId === payment.id && editedPayment ? (
                          <td colSpan={5} className="px-4 py-4">
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
                            <td className="px-4 py-4">
                              <span className="text-[#213f5b] font-medium">
                                {payment.provenance}
                              </span>
                            </td>

                            {/* Montant */}
                            <td className="px-4 py-4">
                              <FormattedAmount amount={payment.amount} />
                            </td>

                            {/* Date de paiement */}
                            <td className="px-4 py-4">
                              <span className="text-[#213f5b]">
                                {formatDate(payment.paymentDate)}
                              </span>
                            </td>

                            {/* Statut */}
                            <td className="px-4 py-4">
                              <PaymentStatusBadge status={payment.status} />
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-4 text-right">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => startEditing(payment)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    openDeleteConfirmation(payment.id)
                                  }
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 size={16} />
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
            </section>
          )}
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmation.isOpen}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer ce paiement ?"
        confirmLabel="Supprimer"
        onConfirm={handleDeletePayment}
        onCancel={closeDeleteConfirmation}
      />
    </div>
  );
};

export default ReglementTab;
