"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  BanknotesIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  ArrowsUpDownIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ExclamationTriangleIcon,
  // Removed UserIcon from display,
  CalendarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

// ---------- TYPE DEFINITIONS ----------
interface Regie {
  id: number;
  name: string;
  email: string;
  region: string;
}

interface Solution {
  id: number;
  name: string;
  base_price: number;
}

type InvoiceStatus = "Approuvée" | "En attente d'approbation" | "Rejetée";

interface Invoice {
  id: string;
  date_creation: string;
  date_reception: string;
  // Removed client_id from display logic, no longer shown
  solution_id: number;
  regie_id: number;
  montant_ht: number;
  tva: number;
  montant_ttc: number;
  statut: InvoiceStatus;
  date_approbation: string | null;
  date_paiement: string | null;
  commentaire_admin: string;
}

// ---------- SAMPLE DATA ----------
const regies: Regie[] = [
  { id: 1, name: "Martin Laurent", email: "martin.l@regie.com", region: "Île-de-France" },
  { id: 2, name: "Caroline Dubois", email: "c.dubois@regie.com", region: "Auvergne-Rhône-Alpes" },
  { id: 3, name: "Philippe Moreau", email: "p.moreau@regie.com", region: "Provence-Alpes-Côte d'Azur" },
];

const solutions: Solution[] = [
  { id: 1, name: "Pompes à chaleur", base_price: 5800 },
  { id: 2, name: "Chauffe-eau solaire individuel", base_price: 3200 },
  { id: 3, name: "Chauffe-eau thermodynamique", base_price: 2800 },
  { id: 4, name: "Système Solaire Combiné", base_price: 7500 },
  { id: 5, name: "Poêle à bois", base_price: 1800 },
];

// Example factures with minimal mention of client for data – 
// but we won't show them in the UI
const factures: Invoice[] = [
  {
    id: "FACT-2025-001",
    date_creation: "2025-03-01",
    date_reception: "2025-03-01",
    solution_id: 1,
    regie_id: 1,
    montant_ht: 5800,
    tva: 20,
    montant_ttc: 6960,
    statut: "Approuvée",
    date_approbation: "2025-03-02",
    date_paiement: "2025-03-05",
    commentaire_admin: "Paiement effectué par virement bancaire",
  },
  {
    id: "FACT-2025-002",
    date_creation: "2025-03-02",
    date_reception: "2025-03-02",
    solution_id: 2,
    regie_id: 2,
    montant_ht: 3200,
    tva: 20,
    montant_ttc: 3840,
    statut: "En attente d'approbation",
    date_approbation: null,
    date_paiement: null,
    commentaire_admin: "",
  },
  {
    id: "FACT-2025-003",
    date_creation: "2025-03-03",
    date_reception: "2025-03-03",
    solution_id: 3,
    regie_id: 3,
    montant_ht: 2800,
    tva: 20,
    montant_ttc: 3360,
    statut: "Approuvée",
    date_approbation: "2025-03-04",
    date_paiement: null,
    commentaire_admin: "En attente du paiement client",
  },
  {
    id: "FACT-2025-004",
    date_creation: "2025-03-04",
    date_reception: "2025-03-04",
    solution_id: 4,
    regie_id: 1,
    montant_ht: 7500,
    tva: 20,
    montant_ttc: 9000,
    statut: "Rejetée",
    date_approbation: null,
    date_paiement: null,
    commentaire_admin: "Informations client incomplètes",
  },
  {
    id: "FACT-2025-005",
    date_creation: "2025-03-05",
    date_reception: "2025-03-05",
    solution_id: 5,
    regie_id: 2,
    montant_ht: 1800,
    tva: 20,
    montant_ttc: 2160,
    statut: "En attente d'approbation",
    date_approbation: null,
    date_paiement: null,
    commentaire_admin: "",
  },
];

// ---------- UTILITY FUNCTIONS ----------
const getRegieName = (regieId: number): string => {
  const regie = regies.find((r) => r.id === regieId);
  return regie ? regie.name : "Régie inconnue";
};

const getSolutionName = (solutionId: number): string => {
  const solution = solutions.find((s) => s.id === solutionId);
  return solution ? solution.name : "Solution inconnue";
};

const formatMontant = (montant: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(montant);
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" } as Intl.DateTimeFormatOptions;
  return new Intl.DateTimeFormat("fr-FR", options).format(date);
};

// ---------- MAIN COMPONENT ----------
export default function AdminFacturationPage() {
  const [filter, setFilter] = useState<InvoiceStatus | "Toutes">("Toutes");
  const [ , setCurrentDate] = useState("");
  const [showInvoiceDetailModal, setShowInvoiceDetailModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date_reception" | "regie" | "montant" | "statut">("date_reception");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [invoiceComment, setInvoiceComment] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  // Stats
  const statsData = {
    totalApproved: factures.filter((f) => f.statut === "Approuvée").length,
    totalPending: factures.filter((f) => f.statut === "En attente d'approbation").length,
    totalRejected: factures.filter((f) => f.statut === "Rejetée").length,
    totalAmount: factures
      .filter((f) => f.statut === "Approuvée")
      .reduce((sum, f) => sum + f.montant_ttc, 0),
    pendingAmount: factures
      .filter((f) => f.statut === "En attente d'approbation")
      .reduce((sum, f) => sum + f.montant_ttc, 0),
  };

  // Region data
  const regionData = regies.map((regie) => {
    const regieInvoices = factures.filter((f) => f.regie_id === regie.id && f.statut === "Approuvée");
    return {
      region: regie.region,
      count: regieInvoices.length,
      amount: regieInvoices.reduce((sum, f) => sum + f.montant_ttc, 0),
    };
  });

  useEffect(() => {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    } as Intl.DateTimeFormatOptions;
    setCurrentDate(now.toLocaleDateString("fr-FR", options));
  }, []);

  useEffect(() => {
    if (selectedInvoice) {
      setInvoiceComment(selectedInvoice.commentaire_admin || "");
    }
  }, [selectedInvoice]);

  // NEW: Only show invoices that come from known regie IDs
  const validRegieIds = regies.map((r) => r.id);

  // Filter
  const filteredInvoices = factures
    .filter((invoice) => {
      if (filter === "Toutes") return true;
      return invoice.statut === filter;
    })
    .filter((invoice) => {
      if (!searchTerm) return true;
      // Searching only on invoice.id, regieName, solutionName
      const solName = getSolutionName(invoice.solution_id).toLowerCase();
      const regieName = getRegieName(invoice.regie_id).toLowerCase();
      const id = invoice.id.toLowerCase();
      const search = searchTerm.toLowerCase();
      return (
        solName.includes(search) ||
        regieName.includes(search) ||
        id.includes(search)
      );
    })
    .filter((invoice) => validRegieIds.includes(invoice.regie_id));

  // Sort
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "date_reception":
        comparison = new Date(a.date_reception).getTime() - new Date(b.date_reception).getTime();
        break;
      case "regie":
        comparison = getRegieName(a.regie_id).localeCompare(getRegieName(b.regie_id));
        break;
      case "montant":
        comparison = a.montant_ttc - b.montant_ttc;
        break;
      case "statut":
        comparison = a.statut.localeCompare(b.statut);
        break;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Handlers
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetailModal(true);
  };

  const handleSort = (field: "date_reception" | "regie" | "montant" | "statut") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Approve
  const handleApproveInvoice = () => {
    if (!selectedInvoice) return;

    factures.forEach((invoice) => {
      if (invoice.id === selectedInvoice.id) {
        invoice.statut = "Approuvée";
        invoice.date_approbation = new Date().toISOString().split("T")[0];
        invoice.commentaire_admin = invoiceComment;
      }
    });
    setSelectedInvoice({
      ...selectedInvoice,
      statut: "Approuvée",
      date_approbation: new Date().toISOString().split("T")[0],
      commentaire_admin: invoiceComment,
    });
    setAlertMessage("La facture a été approuvée avec succès.");
    setAlertType("success");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  // Reject
  const handleRejectInvoice = () => {
    if (!selectedInvoice) return;
    if (!invoiceComment.trim()) {
      setAlertMessage("Veuillez fournir un motif de rejet.");
      setAlertType("error");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
      return;
    }
    factures.forEach((invoice) => {
      if (invoice.id === selectedInvoice.id) {
        invoice.statut = "Rejetée";
        invoice.commentaire_admin = invoiceComment;
      }
    });
    setSelectedInvoice({
      ...selectedInvoice,
      statut: "Rejetée",
      commentaire_admin: invoiceComment,
    });
    setAlertMessage("La facture a été rejetée.");
    setAlertType("success");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  // Mark as paid
  const handleMarkAsPaid = () => {
    if (!selectedInvoice) return;
    factures.forEach((invoice) => {
      if (invoice.id === selectedInvoice.id) {
        invoice.date_paiement = new Date().toISOString().split("T")[0];
        invoice.commentaire_admin = invoiceComment || "Paiement enregistré";
      }
    });
    setSelectedInvoice({
      ...selectedInvoice,
      date_paiement: new Date().toISOString().split("T")[0],
      commentaire_admin: invoiceComment || "Paiement enregistré",
    });
    setAlertMessage("Le paiement de la facture a été enregistré.");
    setAlertType("success");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  // JSX
  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main
          className="flex-1 overflow-y-auto px-8 py-6 space-y-6"
          style={{
            background: "linear-gradient(135deg, rgba(191,221,249,0.1) 0%, rgba(210,252,178,0.05) 100%)",
          }}
        >
          <AnimatePresence>
            {showAlert && (
              <motion.div
                className={`mb-6 p-4 rounded-xl ${
                  alertType === "success"
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                } shadow-sm`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center">
                  {alertType === "success" ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  ) : (
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-3" />
                  )}
                  <p className={alertType === "success" ? "text-green-700" : "text-red-700"}>
                    {alertMessage}
                  </p>
                  <button
                    onClick={() => setShowAlert(false)}
                    className="ml-auto text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center mb-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-[#213f5b]">
                Administration Facturation
              </h1>
              <p className="text-gray-600">
                Gestion des factures envoyées par les régies
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* -- Stats row -- */}
            <motion.div
              className="col-span-12 grid grid-cols-1 gap-5 md:grid-cols-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-[#d2fcb2]/20 to-[#bfddf9]/30 border border-[#bfddf9]/30"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium text-[#213f5b]">Total Approuvé</p>
                  <div className="p-2 rounded-full bg-white/60">
                    <CheckBadgeIcon className="h-5 w-5 text-[#213f5b]" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#213f5b]">
                  {formatMontant(statsData.totalAmount)}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {statsData.totalApproved} factures
                </p>
              </motion.div>

              <motion.div
                className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-[#bfddf9]/20 to-[#d2fcb2]/30 border border-[#bfddf9]/30"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium text-[#213f5b]">En Attente</p>
                  <div className="p-2 rounded-full bg-white/60">
                    <ClockIcon className="h-5 w-5 text-[#213f5b]" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#213f5b]">
                  {formatMontant(statsData.pendingAmount)}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {statsData.totalPending} factures à traiter
                </p>
              </motion.div>

              <motion.div
                className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-[#d2fcb2]/10 via-[#bfddf9]/20 to-[#d2fcb2]/10 border border-[#bfddf9]/30"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium text-[#213f5b]">Taux d&apos;Approbation</p>
                  <div className="p-2 rounded-full bg-white/60">
                    <ChartBarIcon className="h-5 w-5 text-[#213f5b]" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#213f5b]">
                  {Math.round(
                    (statsData.totalApproved /
                      (statsData.totalApproved + statsData.totalRejected + statsData.totalPending || 1)) * 100
                  )}
                  %
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Des factures soumises
                </p>
              </motion.div>

              <motion.div
                className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-[#bfddf9]/30 to-[#d2fcb2]/20 border border-[#bfddf9]/30"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium text-[#213f5b]">Délai Moyen</p>
                  <div className="p-2 rounded-full bg-white/60">
                    <CalendarIcon className="h-5 w-5 text-[#213f5b]" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#213f5b]">2.3 jours</p>
                <p className="text-xs text-gray-600 mt-1">
                  D&apos;approbation des factures
                </p>
              </motion.div>
            </motion.div>

            {/* -- Filtres -- */}
            <div className="col-span-12">
              <motion.div
                className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between gap-4 items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative rounded-md shadow-sm flex-1 sm:flex-none">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#213f5b] sm:w-64"
                      placeholder="Rechercher par N° Facture, solution, régie..."
                    />
                  </div>
                  <div className="relative">
                    <button
                      className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
                      onClick={() =>
                        document
                          .getElementById("filterDropdown")
                          ?.classList.toggle("hidden")
                      }
                    >
                      <AdjustmentsHorizontalIcon className="h-4 w-4" />
                      Filtrer
                    </button>
                    <div
                      id="filterDropdown"
                      className="absolute z-10 mt-1 hidden min-w-[200px] rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                    >
                      <div className="p-2">
                        {["Toutes", "En attente d'approbation", "Approuvée", "Rejetée"].map(
                          (status) => (
                            <div
                              key={status}
                              className={`px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 ${
                                filter === status
                                  ? "bg-[#bfddf9]/30 font-medium"
                                  : ""
                              }`}
                              onClick={() => {
                                setFilter(status as InvoiceStatus | "Toutes");
                                document
                                  .getElementById("filterDropdown")
                                  ?.classList.add("hidden");
                              }}
                            >
                              {status}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button className="px-3 py-1.5 text-sm rounded-md flex items-center gap-1 border border-gray-300 bg-white hover:bg-gray-50">
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Exporter
                  </button>
                  <button className="px-3 py-1.5 text-sm rounded-md flex items-center gap-1 border border-gray-300 bg-white hover:bg-gray-50">
                    <PrinterIcon className="h-4 w-4" />
                    Imprimer
                  </button>
                </div>
              </motion.div>
            </div>

            {/* -- Tableau des factures -- */}
            <motion.div
              className="col-span-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {/* Col: N° Facture / Date */}
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort("date_reception")}
                        >
                          <div className="flex items-center gap-1">
                            N° Facture / Date
                            {sortBy === "date_reception" && (
                              <ArrowsUpDownIcon
                                className={`h-3.5 w-3.5 ${
                                  sortOrder === "asc" ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </div>
                        </th>

                        {/* Col: Régie */}
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort("regie")}
                        >
                          <div className="flex items-center gap-1">
                            Régie
                            {sortBy === "regie" && (
                              <ArrowsUpDownIcon
                                className={`h-3.5 w-3.5 ${
                                  sortOrder === "asc" ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </div>
                        </th>

                        {/* Col: Montant */}
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort("montant")}
                        >
                          <div className="flex items-center gap-1">
                            Montant
                            {sortBy === "montant" && (
                              <ArrowsUpDownIcon
                                className={`h-3.5 w-3.5 ${
                                  sortOrder === "asc" ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </div>
                        </th>

                        {/* Col: Statut */}
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort("statut")}
                        >
                          <div className="flex items-center gap-1">
                            Statut
                            {sortBy === "statut" && (
                              <ArrowsUpDownIcon
                                className={`h-3.5 w-3.5 ${
                                  sortOrder === "asc" ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </div>
                        </th>

                        {/* Col: Actions */}
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedInvoices.map((invoice) => (
                        <tr
                          key={invoice.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {/* Cell: N° Facture / Date */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-[#213f5b]">
                              {invoice.id}
                            </div>
                            <div className="text-xs text-gray-500">
                              Reçue le {formatDate(invoice.date_reception)}
                            </div>
                          </td>

                          {/* Cell: Régie */}
                          <td className="px-6 py-4">
                            <div className="font-medium text-[#213f5b]">
                              {getRegieName(invoice.regie_id)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Créée le {formatDate(invoice.date_creation)}
                            </div>
                          </td>

                          {/* Cell: Montant */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-[#213f5b]">
                              {formatMontant(invoice.montant_ttc)}
                            </div>
                            <div className="text-xs text-gray-500">
                              TVA: {invoice.tva}%
                            </div>
                          </td>

                          {/* Cell: Statut */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                invoice.statut === "Approuvée"
                                  ? "bg-green-100 text-green-800"
                                  : invoice.statut === "En attente d'approbation"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {invoice.statut}
                            </span>
                            {invoice.date_paiement && (
                              <div className="text-xs text-gray-500 mt-1">
                                Payée le {formatDate(invoice.date_paiement)}
                              </div>
                            )}
                          </td>

                          {/* Cell: Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => handleViewInvoice(invoice)}
                                className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                              >
                                <EyeIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Voir</span>
                              </button>
                              {invoice.statut === "En attente d'approbation" && (
                                <button
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setShowInvoiceDetailModal(true);
                                  }}
                                  className="text-green-600 hover:text-green-900 flex items-center gap-1"
                                >
                                  <CheckCircleIcon className="h-4 w-4" />
                                  <span className="hidden sm:inline">
                                    Approuver
                                  </span>
                                </button>
                              )}
                              {invoice.statut === "Approuvée" &&
                                !invoice.date_paiement && (
                                  <button
                                    onClick={() => {
                                      setSelectedInvoice(invoice);
                                      setShowInvoiceDetailModal(true);
                                    }}
                                    className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                  >
                                    <BanknotesIcon className="h-4 w-4" />
                                    <span className="hidden sm:inline">
                                      Paiement
                                    </span>
                                  </button>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {/* -- Résumé par région -- */}
            <motion.div
              className="col-span-12 md:col-span-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-sm p-6 h-full">
                <h3 className="text-lg font-semibold text-[#213f5b] mb-4">
                  Facturation par région
                </h3>
                <div className="space-y-4">
                  {regionData.map((region, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium text-[#213f5b]">
                            {region.region}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({region.count} factures)
                          </span>
                        </div>
                        <span className="font-medium text-[#213f5b]">
                          {formatMontant(region.amount)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full bg-[#213f5b]"
                          initial={{ width: 0 }}
                          animate={{ width: `${(region.amount / statsData.totalAmount) * 100}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* -- Factures récentes en attente -- */}
            <motion.div
              className="col-span-12 md:col-span-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-sm p-6 h-full">
                <h3 className="text-lg font-semibold text-[#213f5b] mb-4">
                  Factures récentes en attente
                </h3>
                <div className="space-y-4">
                  {factures
                    .filter((f) => f.statut === "En attente d'approbation")
                    .sort(
                      (a, b) =>
                        new Date(b.date_reception).getTime() -
                        new Date(a.date_reception).getTime()
                    )
                    .slice(0, 4)
                    .map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-[#213f5b]">
                            {invoice.id}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getSolutionName(invoice.solution_id)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Régie: {getRegieName(invoice.regie_id)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-[#213f5b]">
                            {formatMontant(invoice.montant_ttc)}
                          </div>
                          <button
                            onClick={() => handleViewInvoice(invoice)}
                            className="text-xs text-indigo-600 hover:text-indigo-900 mt-1"
                          >
                            Voir détails
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* -- MODAL: Détails Facture (NO 'Informations Client') -- */}
      <AnimatePresence>
        {showInvoiceDetailModal && selectedInvoice && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#213f5b]">
                    Validation de la Facture
                  </h2>
                  <button
                    onClick={() => setShowInvoiceDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-sm text-gray-500">
                        Numéro de Facture
                      </div>
                      <div className="font-bold text-xl text-[#213f5b]">
                        {selectedInvoice.id}
                      </div>
                      <div className="text-sm text-gray-500 mt-4">
                        Date de réception
                      </div>
                      <div className="font-medium">
                        {formatDate(selectedInvoice.date_reception)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Statut</div>
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          selectedInvoice.statut === "Approuvée"
                            ? "bg-green-100 text-green-800"
                            : selectedInvoice.statut === "En attente d'approbation"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedInvoice.statut}
                      </span>
                      {selectedInvoice.date_approbation && (
                        <>
                          <div className="text-sm text-gray-500 mt-4">
                            Date d&apos;approbation
                          </div>
                          <div className="font-medium">
                            {formatDate(selectedInvoice.date_approbation)}
                          </div>
                        </>
                      )}
                      {selectedInvoice.date_paiement && (
                        <>
                          <div className="text-sm text-gray-500 mt-2">
                            Date de paiement
                          </div>
                          <div className="font-medium">
                            {formatDate(selectedInvoice.date_paiement)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Only showing "Informations Régie" + "Informations Admin" */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-md font-semibold text-[#213f5b] mb-3">
                      Informations Régie
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg h-full">
                      {regies.find((r) => r.id === selectedInvoice.regie_id) && (
                        <>
                          <div className="font-semibold mb-1">
                            {getRegieName(selectedInvoice.regie_id)}
                          </div>
                          <div className="text-sm text-gray-500 mb-1">
                            {
                              regies.find((r) => r.id === selectedInvoice.regie_id)
                                ?.email
                            }
                          </div>
                          <div className="text-sm text-gray-500">
                            Région:{" "}
                            {
                              regies.find((r) => r.id === selectedInvoice.regie_id)
                                ?.region
                            }
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-semibold text-[#213f5b] mb-3">
                      Informations Admin
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg h-full">
                      {/* Hardcode or replace with real "Admin" data */}
                      <div className="font-semibold mb-1">Nom Admin</div>
                      <div className="text-sm text-gray-500 mb-1">
                        admin@example.com
                      </div>
                      <div className="text-sm text-gray-500">
                        Rôle: Administration Facturation
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-md font-semibold text-[#213f5b] mb-3">
                    Détails de la prestation
                  </h3>
                  <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Prix unitaire HT
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Quantité
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total HT
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {getSolutionName(selectedInvoice.solution_id)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                          {formatMontant(selectedInvoice.montant_ht)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                          1
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                          {formatMontant(selectedInvoice.montant_ht)}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-3 text-sm" colSpan={2}></td>
                        <td className="px-4 py-3 text-sm text-right font-medium">
                          Total HT
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium">
                          {formatMontant(selectedInvoice.montant_ht)}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-3 text-sm" colSpan={2}></td>
                        <td className="px-4 py-3 text-sm text-right font-medium">
                          TVA ({selectedInvoice.tva}%)
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium">
                          {formatMontant(
                            selectedInvoice.montant_ttc - selectedInvoice.montant_ht
                          )}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-3 text-sm" colSpan={2}></td>
                        <td className="px-4 py-3 text-sm text-right font-semibold">
                          Total TTC
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold">
                          {formatMontant(selectedInvoice.montant_ttc)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="mb-6">
                  <h3 className="text-md font-semibold text-[#213f5b] mb-3">
                    {selectedInvoice.statut === "En attente d'approbation"
                      ? "Commentaire pour la régie"
                      : "Commentaire de l'administration"}
                  </h3>
                  <textarea
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                    placeholder={
                      selectedInvoice.statut === "En attente d'approbation"
                        ? "Ajouter un commentaire pour la régie..."
                        : ""
                    }
                    value={invoiceComment}
                    onChange={(e) => setInvoiceComment(e.target.value)}
                    disabled={
                      selectedInvoice.statut !== "En attente d'approbation" &&
                      !selectedInvoice.date_paiement
                    }
                  />
                </div>

                <div className="flex justify-between items-center mt-8">
                  <button
                    type="button"
                    onClick={() => setShowInvoiceDetailModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex items-center gap-1"
                  >
                    <XCircleIcon className="h-4 w-4" />
                    Fermer
                  </button>

                  <div className="flex gap-3">
                    {selectedInvoice.statut === "En attente d'approbation" && (
                      <>
                        <button
                          type="button"
                          onClick={handleRejectInvoice}
                          className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 flex items-center gap-1"
                        >
                          <XCircleIcon className="h-4 w-4" />
                          Rejeter
                        </button>
                        <button
                          type="button"
                          onClick={handleApproveInvoice}
                          className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 flex items-center gap-1"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                          Approuver
                        </button>
                      </>
                    )}
                    {selectedInvoice.statut === "Approuvée" &&
                      !selectedInvoice.date_paiement && (
                        <button
                          type="button"
                          onClick={handleMarkAsPaid}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 flex items-center gap-1"
                        >
                          <BanknotesIcon className="h-4 w-4" />
                          Marquer comme payée
                        </button>
                      )}
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-white bg-[#213f5b] border border-transparent rounded-md shadow-sm hover:bg-[#213f5b]/90 flex items-center gap-1"
                    >
                      <PrinterIcon className="h-4 w-4" />
                      Imprimer
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
