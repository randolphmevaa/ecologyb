"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";

import {
  BanknotesIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  PlusCircleIcon,
  EyeIcon,
  PaperAirplaneIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";

/** ---------------------
 *    TYPE DEFINITIONS
 *  --------------------- */
interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Solution {
  id: number;
  name: string;
  base_price: number;
}

type InvoiceStatus =
  | "Payée"
  | "En attente"
  | "Envoyée"
  | "Brouillon"
  | "En attente de validation";

interface Invoice {
  id: string;
  date_creation: string; // e.g. "2025-03-01"
  client_id: number;
  solution_id: number;
  montant_ht: number;
  tva: number;
  montant_ttc: number;
  statut: InvoiceStatus;
  date_paiement: string | null;
}

/** ---------------------
 *    SAMPLE DATA
 *  --------------------- */
const clients: Client[] = [
  {
    id: 1,
    name: "Durand Martin",
    email: "durand.martin@example.com",
    phone: "06 12 34 56 78",
    address: "15 Rue des Lilas, 75001 Paris",
  },
  {
    id: 2,
    name: "Dubois Sophie",
    email: "dubois.sophie@example.com",
    phone: "06 23 45 67 89",
    address: "25 Avenue Victor Hugo, 69002 Lyon",
  },
  {
    id: 3,
    name: "Bernard Thomas",
    email: "bernard.thomas@example.com",
    phone: "06 34 56 78 90",
    address: "8 Rue de la Paix, 33000 Bordeaux",
  },
  {
    id: 4,
    name: "Petit Julie",
    email: "petit.julie@example.com",
    phone: "06 45 67 89 01",
    address: "42 Boulevard Haussmann, 44000 Nantes",
  },
  {
    id: 5,
    name: "Robert Philippe",
    email: "robert.philippe@example.com",
    phone: "06 56 78 90 12",
    address: "3 Place Bellecour, 13001 Marseille",
  },
];

const solutions: Solution[] = [
  { id: 1, name: "Pompes à chaleur", base_price: 5800 },
  { id: 2, name: "Chauffe-eau solaire individuel", base_price: 3200 },
  { id: 3, name: "Chauffe-eau thermodynamique", base_price: 2800 },
  { id: 4, name: "Système Solaire Combiné", base_price: 7500 },
  { id: 5, name: "Poêle à bois", base_price: 1800 },
];

const factures: Invoice[] = [
  {
    id: "FACT-2025-001",
    date_creation: "2025-03-01",
    client_id: 1,
    solution_id: 1,
    montant_ht: 5800,
    tva: 20,
    montant_ttc: 6960,
    statut: "Payée",
    date_paiement: "2025-03-05",
  },
  {
    id: "FACT-2025-002",
    date_creation: "2025-03-02",
    client_id: 2,
    solution_id: 2,
    montant_ht: 3200,
    tva: 20,
    montant_ttc: 3840,
    statut: "En attente",
    date_paiement: null,
  },
  {
    id: "FACT-2025-003",
    date_creation: "2025-03-03",
    client_id: 3,
    solution_id: 3,
    montant_ht: 2800,
    tva: 20,
    montant_ttc: 3360,
    statut: "Envoyée",
    date_paiement: null,
  },
  {
    id: "FACT-2025-004",
    date_creation: "2025-03-04",
    client_id: 4,
    solution_id: 4,
    montant_ht: 7500,
    tva: 20,
    montant_ttc: 9000,
    statut: "En attente de validation",
    date_paiement: null,
  },
  {
    id: "FACT-2025-005",
    date_creation: "2025-03-05",
    client_id: 5,
    solution_id: 5,
    montant_ht: 1800,
    tva: 20,
    montant_ttc: 2160,
    statut: "Brouillon",
    date_paiement: null,
  },
];

/** ---------------------
 *    HELPER FUNCTIONS
 *  --------------------- */
const getClientName = (clientId: number): string => {
  const client = clients.find((c) => c.id === clientId);
  return client ? client.name : "Client inconnu";
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
  // Use valid TS-literal string values for weekday/month/day
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

// Simple generator for new invoice IDs
const generateFactureId = (): string => {
  const year = new Date().getFullYear();
  const lastId =
    factures.length > 0 ? parseInt(factures[0].id.split("-")[2]) : 0;
  const newId = lastId + 1;
  return `FACT-${year}-${String(newId).padStart(3, "0")}`;
};

/** ---------------------
 *     MAIN COMPONENT
 *  --------------------- */
export default function FacturationPage() {
  // Filter, searching, sorting
  const [filter, setFilter] = useState<InvoiceStatus | "Toutes">("Toutes");
  const [ , setCurrentDate] = useState("");
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [showInvoiceDetailModal, setShowInvoiceDetailModal] = useState(false);

  // Track the invoice selected for viewing
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "client" | "montant" | "statut">(
    "date"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // State for the "new invoice" form
  const [newInvoice, setNewInvoice] = useState<Invoice>({
    id: generateFactureId(),
    date_creation: new Date().toISOString().split("T")[0],
    client_id: 0, // typed as number
    solution_id: 0, // typed as number
    montant_ht: 0,
    tva: 20,
    montant_ttc: 0,
    statut: "Brouillon",
    date_paiement: null,
  });

  // Recompute montant_ttc whenever montant_ht or tva changes
  useEffect(() => {
    setNewInvoice((prev) => ({
      ...prev,
      montant_ttc: prev.montant_ht * (1 + prev.tva / 100),
    }));
  }, [newInvoice.montant_ht, newInvoice.tva]);

  // Update montant_ht if the solution changes
  useEffect(() => {
    if (newInvoice.solution_id) {
      const solution = solutions.find(
        (s) => s.id === newInvoice.solution_id
      );
      if (solution) {
        setNewInvoice((prev) => ({
          ...prev,
          montant_ht: solution.base_price,
        }));
      }
    }
  }, [newInvoice.solution_id]);

  // Just to show current date in French
  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(now.toLocaleDateString("fr-FR", options));
  }, []);

  // Filter invoices by status and searchTerm
  const filteredInvoices = factures
    .filter((invoice) => {
      if (filter === "Toutes") return true;
      return invoice.statut === filter;
    })
    .filter((invoice) => {
      if (!searchTerm) return true;
      const client = getClientName(invoice.client_id).toLowerCase();
      const solution = getSolutionName(invoice.solution_id).toLowerCase();
      const id = invoice.id.toLowerCase();
      const search = searchTerm.toLowerCase();
      return (
        client.includes(search) ||
        solution.includes(search) ||
        id.includes(search)
      );
    });

  // Sort the invoices by date, client name, amount or status
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "date":
        comparison =
          new Date(a.date_creation).getTime() -
          new Date(b.date_creation).getTime();
        break;
      case "client":
        comparison = getClientName(a.client_id).localeCompare(
          getClientName(b.client_id)
        );
        break;
      case "montant":
        comparison = a.montant_ttc - b.montant_ttc;
        break;
      case "statut":
        comparison = a.statut.localeCompare(b.statut);
        break;
      default:
        comparison = 0;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  // When user clicks "Voir" to view invoice details
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetailModal(true);
  };

  // Create a new invoice (in real life you'd call an API instead)
  const handleCreateInvoice = () => {
    factures.unshift(newInvoice);

    // Reset & close
    setNewInvoice({
      id: generateFactureId(),
      date_creation: new Date().toISOString().split("T")[0],
      client_id: 0,
      solution_id: 0,
      montant_ht: 0,
      tva: 20,
      montant_ttc: 0,
      statut: "Brouillon",
      date_paiement: null,
    });
    setShowNewInvoiceModal(false);
  };

  // Handle sorting changes
  const handleSort = (field: "date" | "client" | "montant" | "statut") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // The UI
  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main
          className="flex-1 overflow-y-auto px-8 py-6 space-y-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(191,221,249,0.1) 0%, rgba(210,252,178,0.05) 100%)",
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-[#213f5b]">
                Facturation / Paiements
              </h1>
              <p className="text-gray-600">
                Gestion des factures et suivi des paiements
              </p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-[#213f5b] text-white rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
              onClick={() => setShowNewInvoiceModal(true)}
            >
              <PlusCircleIcon className="h-5 w-5" />
              Nouvelle Facture
            </motion.button>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Statistiques */}
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
                  <p className="text-sm font-medium text-[#213f5b]">
                    Total Facturé
                  </p>
                  <div className="p-2 rounded-full bg-white/60">
                    <BanknotesIcon className="h-5 w-5 text-[#213f5b]" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#213f5b]">
                  {formatMontant(
                    factures.reduce((sum, f) => sum + f.montant_ttc, 0)
                  )}
                </p>
                <p className="text-xs text-gray-600 mt-1">Ce mois-ci</p>
              </motion.div>

              <motion.div
                className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-[#bfddf9]/20 to-[#d2fcb2]/30 border border-[#bfddf9]/30"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium text-[#213f5b]">
                    Factures Émises
                  </p>
                  <div className="p-2 rounded-full bg-white/60">
                    <DocumentTextIcon className="h-5 w-5 text-[#213f5b]" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#213f5b]">
                  {factures.length}
                </p>
                <p className="text-xs text-gray-600 mt-1">Total</p>
              </motion.div>

              <motion.div
                className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-[#d2fcb2]/10 via-[#bfddf9]/20 to-[#d2fcb2]/10 border border-[#bfddf9]/30"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium text-[#213f5b]">
                    En Attente
                  </p>
                  <div className="p-2 rounded-full bg-white/60">
                    <ClockIcon className="h-5 w-5 text-[#213f5b]" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#213f5b]">
                  {factures.filter((f) => f.statut === "En attente").length}
                </p>
                <p className="text-xs text-gray-600 mt-1">À relancer</p>
              </motion.div>

              <motion.div
                className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-[#bfddf9]/30 to-[#d2fcb2]/20 border border-[#bfddf9]/30"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium text-[#213f5b]">
                    Taux de Conversion
                  </p>
                  <div className="p-2 rounded-full bg-white/60">
                    <ArrowPathIcon className="h-5 w-5 text-[#213f5b]" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#213f5b]">
                  {Math.round(
                    (factures.filter((f) => f.statut === "Payée").length /
                      factures.length) *
                      100
                  )}
                  %
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Devis → Factures payées
                </p>
              </motion.div>
            </motion.div>

            {/* Filtres */}
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
                      placeholder="Rechercher..."
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
                        {[
                          "Toutes",
                          "Brouillon",
                          "En attente",
                          "Envoyée",
                          "Payée",
                          "En attente de validation",
                        ].map((status) => (
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
                        ))}
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

            {/* Tableau des factures */}
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
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort("date")}
                        >
                          <div className="flex items-center gap-1">
                            N° Facture / Date
                            {sortBy === "date" && (
                              <ArrowsUpDownIcon
                                className={`h-3.5 w-3.5 ${
                                  sortOrder === "asc" ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort("client")}
                        >
                          <div className="flex items-center gap-1">
                            Client / Solution
                            {sortBy === "client" && (
                              <ArrowsUpDownIcon
                                className={`h-3.5 w-3.5 ${
                                  sortOrder === "asc" ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </div>
                        </th>
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-[#213f5b]">
                              {invoice.id}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(invoice.date_creation)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-[#213f5b]">
                              {getClientName(invoice.client_id)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {getSolutionName(invoice.solution_id)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-[#213f5b]">
                              {formatMontant(invoice.montant_ttc)}
                            </div>
                            <div className="text-xs text-gray-500">
                              TVA: {invoice.tva}%
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                invoice.statut === "Payée"
                                  ? "bg-green-100 text-green-800"
                                  : invoice.statut === "En attente"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : invoice.statut === "Envoyée"
                                  ? "bg-blue-100 text-blue-800"
                                  : invoice.statut ===
                                    "En attente de validation"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {invoice.statut}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => handleViewInvoice(invoice)}
                                className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                              >
                                <EyeIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Voir</span>
                              </button>
                              {invoice.statut === "Brouillon" && (
                                <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                                  <PaperAirplaneIcon className="h-4 w-4" />
                                  <span className="hidden sm:inline">
                                    Envoyer
                                  </span>
                                </button>
                              )}
                              {[
                                "Brouillon",
                                "En attente de validation",
                              ].includes(invoice.statut) && (
                                <button className="text-green-600 hover:text-green-900 flex items-center gap-1">
                                  <CheckCircleIcon className="h-4 w-4" />
                                  <span className="hidden sm:inline">
                                    Valider
                                  </span>
                                </button>
                              )}
                              {[
                                "Brouillon",
                                "En attente de validation",
                              ].includes(invoice.statut) && (
                                <button className="text-red-600 hover:text-red-900 flex items-center gap-1">
                                  <XCircleIcon className="h-4 w-4" />
                                  <span className="hidden sm:inline">
                                    Annuler
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
          </div>
        </main>
      </div>

      {/* Modal Nouvelle Facture */}
      <AnimatePresence>
        {showNewInvoiceModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#213f5b]">
                    Nouvelle Facture
                  </h2>
                  <button
                    onClick={() => setShowNewInvoiceModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro de Facture
                      </label>
                      <input
                        type="text"
                        value={newInvoice.id}
                        onChange={(e) =>
                          setNewInvoice({ ...newInvoice, id: e.target.value })
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de Création
                      </label>
                      <input
                        type="date"
                        value={newInvoice.date_creation}
                        onChange={(e) =>
                          setNewInvoice({
                            ...newInvoice,
                            date_creation: e.target.value,
                          })
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client à Facturer
                    </label>
                    <select
                      value={newInvoice.client_id}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          client_id: parseInt(e.target.value, 10),
                        })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                    >
                      <option value={0}>Sélectionner un client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name} - {client.address}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Solution / Prestation
                    </label>
                    <select
                      value={newInvoice.solution_id}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          solution_id: parseInt(e.target.value, 10),
                        })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                    >
                      <option value={0}>Sélectionner une solution</option>
                      {solutions.map((solution) => (
                        <option key={solution.id} value={solution.id}>
                          {solution.name} - Prix de base:{" "}
                          {formatMontant(solution.base_price)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Montant HT
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                          type="number"
                          value={newInvoice.montant_ht}
                          onChange={(e) =>
                            setNewInvoice({
                              ...newInvoice,
                              montant_ht: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="block w-full rounded-md border-gray-300 pr-12 focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-gray-500 sm:text-sm">€</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        TVA (%)
                      </label>
                      <input
                        type="number"
                        value={newInvoice.tva}
                        onChange={(e) =>
                          setNewInvoice({
                            ...newInvoice,
                            tva: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Montant TTC
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                          type="number"
                          value={newInvoice.montant_ttc}
                          disabled
                          className="block w-full rounded-md border-gray-300 bg-gray-50 pr-12 focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-gray-500 sm:text-sm">€</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Statut Initial
                    </label>
                    <select
                      value={newInvoice.statut}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          statut: e.target.value as InvoiceStatus,
                        })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                    >
                      <option value="Brouillon">Brouillon</option>
                      <option value="En attente de validation">
                        En attente de validation
                      </option>
                      <option value="En attente">En attente</option>
                      <option value="Envoyée">Envoyée</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNewInvoiceModal(false)}
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateInvoice}
                    className="inline-flex justify-center rounded-md border border-transparent bg-[#213f5b] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#213f5b]/90"
                  >
                    Créer Facture
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Détails Facture */}
      <AnimatePresence>
        {showInvoiceDetailModal && selectedInvoice && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#213f5b]">
                    Détails de la Facture
                  </h2>
                  <button
                    onClick={() => setShowInvoiceDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-[#213f5b]">
                        {selectedInvoice.id}
                      </h3>
                      <p className="text-gray-500">
                        Date d&apos;émission:{" "}
                        {formatDate(selectedInvoice.date_creation)}
                      </p>
                      <div
                        className={`mt-2 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                          selectedInvoice.statut === "Payée"
                            ? "bg-green-100 text-green-800"
                            : selectedInvoice.statut === "En attente"
                            ? "bg-yellow-100 text-yellow-800"
                            : selectedInvoice.statut === "Envoyée"
                            ? "bg-blue-100 text-blue-800"
                            : selectedInvoice.statut ===
                              "En attente de validation"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {selectedInvoice.statut}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-sm text-gray-500">
                        Total à payer:
                      </div>
                      <div className="text-2xl font-bold text-[#213f5b]">
                        {formatMontant(selectedInvoice.montant_ttc)}
                      </div>
                      {selectedInvoice.date_paiement && (
                        <div className="text-sm text-green-600 mt-1">
                          Payé le {formatDate(selectedInvoice.date_paiement)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-600">
                        Informations Client
                      </h4>
                      <div className="border-t pt-2">
                        <p className="font-medium">
                          {getClientName(selectedInvoice.client_id)}
                        </p>
                        <p>
                          {
                            clients.find(
                              (c) => c.id === selectedInvoice.client_id
                            )?.address
                          }
                        </p>
                        <p>
                          Email:{" "}
                          {
                            clients.find(
                              (c) => c.id === selectedInvoice.client_id
                            )?.email
                          }
                        </p>
                        <p>
                          Tél:{" "}
                          {
                            clients.find(
                              (c) => c.id === selectedInvoice.client_id
                            )?.phone
                          }
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-600">
                        Informations Prestataire
                      </h4>
                      <div className="border-t pt-2">
                        <p className="font-medium">Eco Solutions SARL</p>
                        <p>123 Avenue des Énergies Renouvelables</p>
                        <p>75000 Paris, France</p>
                        <p>contact@ecosolutions.fr</p>
                        <p>Tél: 01 23 45 67 89</p>
                        <p>SIRET: 123 456 789 00012</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-600 mb-4">
                    Détails Prestation
                  </h4>
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Description
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Prix unitaire
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Quantité
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Total HT
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {getSolutionName(selectedInvoice.solution_id)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {formatMontant(selectedInvoice.montant_ht)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            1
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {formatMontant(selectedInvoice.montant_ht)}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          {/* Use numeric colSpan */}
                          <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                            Total HT
                          </td>
                          <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                            {formatMontant(selectedInvoice.montant_ht)}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                            TVA ({selectedInvoice.tva}%)
                          </td>
                          <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                            {formatMontant(
                              selectedInvoice.montant_ht *
                                (selectedInvoice.tva / 100)
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan={3}
                            className="px-6 py-3 text-right text-sm font-medium text-gray-900"
                          >
                            Total TTC
                          </td>
                          <td className="px-6 py-3 text-right text-sm font-medium text-gray-900 font-bold">
                            {formatMontant(selectedInvoice.montant_ttc)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-600 mb-2">
                    Conditions de Paiement
                  </h4>
                  <p className="text-sm text-gray-600">
                    Cette facture est payable dans les 30 jours suivant la date
                    d&apos;émission. Tout retard de paiement entraînera des pénalités
                    de retard au taux annuel de 5%.
                  </p>
                  <div className="mt-3 text-sm">
                    <p>Mode de paiement: Virement bancaire</p>
                    <p>IBAN: FR76 1234 5678 9012 3456 7890 123</p>
                    <p>BIC: ECOSOLFRPP</p>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowInvoiceDetailModal(false)}
                    className="inline-flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <XCircleIcon className="h-4 w-4" />
                    Fermer
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    <PrinterIcon className="h-4 w-4" />
                    Imprimer
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Télécharger
                  </button>
                  {selectedInvoice.statut !== "Payée" && (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-md bg-[#213f5b] px-4 py-2 text-sm font-medium text-white hover:bg-[#213f5b]/90"
                    >
                      <PaperAirplaneIcon className="h-4 w-4" />
                      {selectedInvoice.statut === "Brouillon"
                        ? "Envoyer"
                        : selectedInvoice.statut === "En attente"
                        ? "Relancer"
                        : selectedInvoice.statut === "En attente de validation"
                        ? "Valider"
                        : "Marquer comme payée"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
