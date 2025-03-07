"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";  // <---- Import jsPDF here

import {
  BanknotesIcon,
  DocumentTextIcon,
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
interface Contact {
  _id?: string;
  id?: string;           // e.g. "b84d023e-85bf-4fcf-b047-3890d2e7218d"
  name?: string;
  firstName: string;
  lastName: string;
  mailingAddress: string;
  phone?: string;
  email?: string;
  // ...any other fields
}

interface Solution {
  _id?: string;
  id: string;            // now a string (UUID)
  name: string;
  base_price: number;
  postedByUserId?: string | null;
}

type InvoiceStatus =
  | "Payée"
  | "En attente"
  | "Envoyée"
  | "Brouillon"
  | "En attente de validation";

interface Invoice {
  _id?: string;
  id: string;               // e.g. "FACT-2025-001"
  date_creation: string;    // e.g. "2025-03-01"
  contact_ids: string[];    // array of Contact.id
  solution_id: string;      // references a solution (string UUID)
  montant_ht: number;
  tva: number;
  montant_ttc: number;
  statut: InvoiceStatus;
  date_paiement: string | null;
  postedByUserId?: string | null;
}

/** ---------------------
 *     MAIN COMPONENT
 *  --------------------- */
export default function FacturationPage() {
  // 1) Local state for data fetched from the API
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [factures, setFactures] = useState<Invoice[]>([]);
  const handlePrint = () => {
    // This will print the entire page by default:
    window.print();
  };
  
  const handleDownloadPDF = (invoice: Invoice) => {
    const doc = new jsPDF();
  
    // Just a bare-bones example. You can get more elaborate:
    doc.setFontSize(14);
    doc.text(`Facture: ${invoice.id}`, 10, 10);
    doc.text(`Date de création: ${invoice.date_creation}`, 10, 20);
    doc.text(`Statut: ${invoice.statut}`, 10, 30);
    doc.text(`Montant TTC: ${invoice.montant_ttc} €`, 10, 40);
  
    // Download the file
    doc.save(`Facture_${invoice.id}.pdf`);
  };

  // 1) Define a handler that receives the invoice to update
  const handlePrimaryActionClick = async (invoice: Invoice) => {
    try {
      // Prepare the updated fields
      let updatedFields: Partial<Invoice> = {};
      
      if (invoice.statut === "Brouillon") {
        // "Envoyer": update status and assign to admin
        updatedFields = {
          statut: "Envoyée",
          postedByUserId: "67a365fff299ca9cb60a6ab4",
        };
      } else if (invoice.statut === "En attente") {
        // "Relancer": you may trigger a reminder without changing the status,
        // or update a specific field if needed.
        updatedFields = { statut: "En attente" };
      } else if (invoice.statut === "En attente de validation") {
        // "Valider": change the status accordingly
        updatedFields = { statut: "En attente" };
      } else {
        // "Marquer comme payée": update status and add payment date
        updatedFields = {
          statut: "Payée",
          date_paiement: new Date().toISOString(),
        };
      }
  
      // Send the PATCH request to update the invoice
      const res = await fetch(`/api/factures/${invoice._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
  
      if (!res.ok) {
        throw new Error(`Failed to update invoice: ${res.statusText}`);
      }
  
      const updatedInvoice = (await res.json()) as Invoice;
  
      // Update your local state
      setFactures((prev) =>
        prev.map((f) => (f._id === updatedInvoice._id ? updatedInvoice : f))
      );
      if (selectedInvoice && selectedInvoice._id === updatedInvoice._id) {
        setSelectedInvoice(updatedInvoice);
      }
    } catch (error) {
      console.error(error);
      alert("Could not update invoice status.");
    }
  };
  
  // Track the logged-in user
  const [userInfo, setUserInfo] = useState<{ _id: string; email: string } | null>(null);
  useEffect(() => {
    const proInfo = localStorage.getItem("proInfo");
    if (proInfo) {
      setUserInfo(JSON.parse(proInfo));
    }
  }, []);

  // 2) Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [contactsRes, solutionsRes, facturesRes] = await Promise.all([
          fetch("/api/contacts"),
          fetch("/api/solutions"),
          fetch("/api/factures"),
        ]);

        const [contactsData, solutionsData, facturesData] = await Promise.all([
          contactsRes.json(),
          solutionsRes.json(),
          facturesRes.json(),
        ]);

        const contactsArray = Array.isArray(contactsData)
          ? contactsData
          : contactsData.contacts;
        setContacts(contactsArray);
        setSolutions(solutionsData);
        setFactures(facturesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  // A second fetch for contacts (could be merged, but leaving as is)
  useEffect(() => {
    async function fetchData() {
      try {
        const contactsRes = await fetch("/api/contacts");
        const contactsJson = await contactsRes.json();

        const contactsArray = Array.isArray(contactsJson)
          ? contactsJson
          : contactsJson.contacts || [];

        setContacts(contactsArray);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    }
    fetchData();
  }, []);

  // Fetch solutions for the current user
  useEffect(() => {
    async function fetchSolutions() {
      if (!userInfo) return;
      try {
        const res = await fetch(`/api/solutions?postedByUserId=${userInfo._id}`);
        const data = await res.json();
        setSolutions(data);
      } catch (error) {
        console.error("Error fetching solutions:", error);
      }
    }
    fetchSolutions();
  }, [userInfo]);

  // Somewhere in your component body, after you have both solutions and userInfo:
const userFilteredSolutions = userInfo
? solutions.filter((solution) => solution.postedByUserId === userInfo._id)
: solutions;


  // Filter, searching, sorting
  const [filter, setFilter] = useState<InvoiceStatus | "Toutes">("Toutes");
  const [, setCurrentDate] = useState("");
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [showInvoiceDetailModal, setShowInvoiceDetailModal] = useState(false);

  // A separate modal for creating a new solution
  const [showNewSolutionModal, setShowNewSolutionModal] = useState(false);

  // Track the invoice selected for viewing
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] =
    useState<"date" | "contact" | "montant" | "statut">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // "newInvoice" defaults
  const [newInvoice, setNewInvoice] = useState<Invoice>({
    id: "",
    date_creation: new Date().toISOString().split("T")[0],
    contact_ids: [],
    solution_id: "0",
    montant_ht: 0,
    tva: 20,
    montant_ttc: 0,
    statut: "Brouillon",
    date_paiement: null,
  });

  // For creating a new solution
  const [newSolution, setNewSolution] = useState<{
    id?: string;
    name: string;
    base_price: number;
  }>({ name: "", base_price: 0 });

  // Store currentUserId
  const [ , setCurrentUserId] = useState<string | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("proInfo");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUserId(user._id || user.email || null);
    }
  }, []);

  /** Helper: get a contact's name */
  const getContactName = (contactId: string): string => {
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) return "Contact inconnu";
    return `${contact.firstName} ${contact.lastName}`;
  };

  /** Helper: get a solution name by ID */
  const getSolutionName = (solutionId: string): string => {
    const solution = solutions.find((s) => s.id === solutionId);
    return solution ? solution.name : "Solution inconnue";
  };

  /** Format currency */
  const formatMontant = (montant: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(montant);
  };

  /** Format date */
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Recompute montant_ttc whenever montant_ht or tva changes
  useEffect(() => {
    setNewInvoice((prev) => ({
      ...prev,
      montant_ttc: prev.montant_ht * (1 + prev.tva / 100),
    }));
  }, [newInvoice.montant_ht, newInvoice.tva]);

  // Recompute montant_ht if either solution_id or contact_ids changes
  // so that if user changes contacts after selecting a solution, it updates.
  useEffect(() => {
    const solution = solutions.find((s) => s.id === newInvoice.solution_id);
    if (solution) {
      // If no contacts selected, default to 1
      const contactCount = newInvoice.contact_ids.length || 1;
      setNewInvoice((prev) => ({
        ...prev,
        montant_ht: solution.base_price * contactCount,
      }));
    } else {
      setNewInvoice((prev) => ({ ...prev, montant_ht: 0 }));
    }
  }, [newInvoice.solution_id, newInvoice.contact_ids, solutions]);

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

  /** Filter & search logic */
  const filteredInvoices = factures
    .filter((invoice) => {
      if (filter === "Toutes") return true;
      return invoice.statut === filter;
    })
    .filter((invoice) => {
      if (!searchTerm) return true;
      const contactNames = invoice.contact_ids
        .map(getContactName)
        .join(" ")
        .toLowerCase();
      const solutionName = getSolutionName(invoice.solution_id).toLowerCase();
      const invoiceId = invoice.id.toLowerCase();
      const search = searchTerm.toLowerCase();
      return (
        contactNames.includes(search) ||
        solutionName.includes(search) ||
        invoiceId.includes(search)
      );
    });

  /** Sorting */
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "date":
        comparison =
          new Date(a.date_creation).getTime() -
          new Date(b.date_creation).getTime();
        break;
      case "contact": {
        const aNames = a.contact_ids.map(getContactName).join(", ");
        const bNames = b.contact_ids.map(getContactName).join(", ");
        comparison = aNames.localeCompare(bNames);
        break;
      }
      case "montant":
        comparison = a.montant_ttc - b.montant_ttc;
        break;
      case "statut":
        comparison = a.statut.localeCompare(b.statut);
        break;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  /** Viewing an invoice detail */
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetailModal(true);
  };

  /** Create a new invoice -> POST /api/factures */
  const handleCreateInvoice = async () => {
    try {
      const res = await fetch("/api/factures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvoice),
      });
      if (!res.ok) {
        throw new Error(`Failed to create invoice: ${res.statusText}`);
      }
      const data = await res.json();
      const createdInvoice = data.invoiceDoc as Invoice;

      // 1) Close modal
      setShowNewInvoiceModal(false);
      // 2) Clear form
      setNewInvoice({
        id: "",
        date_creation: new Date().toISOString().split("T")[0],
        contact_ids: [],
        solution_id: "0",
        montant_ht: 0,
        tva: 20,
        montant_ttc: 0,
        statut: "Brouillon",
        date_paiement: null,
      });
      // 3) Update our local list
      setFactures((prev) => [createdInvoice, ...prev]);
    } catch (error) {
      console.error(error);
      alert("Could not create invoice.");
    }
  };

  /** Create a new solution -> POST /api/solutions */
  const handleCreateSolution = async () => {
    try {
      const storedUser = localStorage.getItem("proInfo");
      const userInfo = storedUser ? JSON.parse(storedUser) : null;

      // Use _id if available; otherwise fallback to email.
      const postedByUserId = userInfo?._id || userInfo?.email || null;

      // Build the payload
      const solutionPayload = {
        ...newSolution,
        postedByUserId,
      };

      const response = await fetch("/api/solutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(solutionPayload),
      });

      if (!response.ok) {
        throw new Error(`Failed to create solution: ${response.statusText}`);
      }
      const data = await response.json();
      const createdSolution = data.solutionDoc as Solution;

      // Add the newly created solution to the local array
      setSolutions((prev) => [...prev, createdSolution]);

      // Reset form
      setNewSolution({ name: "", base_price: 0 });

      // Close modal
      setShowNewSolutionModal(false);
    } catch (err) {
      console.error(err);
      alert("Could not create solution.");
    }
  };

  /** Handle sorting */
  const handleSort = (field: "date" | "contact" | "montant" | "statut") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

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
              className="col-span-12 grid grid-cols-1 gap-5 md:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Paiements en Attente */}
              <motion.div
                className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-[#d2fcb2]/20 to-[#bfddf9]/30 border border-[#bfddf9]/30"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium text-[#213f5b]">
                    Paiements en Attente
                  </p>
                  <div className="p-2 rounded-full bg-white/60">
                    <ClockIcon className="h-5 w-5 text-[#213f5b]" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#213f5b]">
                  {factures.filter((f) => f.statut === "En attente").length}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Montant encore non encaissé
                </p>
              </motion.div>

              {/* À Facturer */}
              <motion.div
                className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-[#bfddf9]/20 to-[#d2fcb2]/30 border border-[#bfddf9]/30"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium text-[#213f5b]">
                    À Facturer
                  </p>
                  <div className="p-2 rounded-full bg-white/60">
                    <DocumentTextIcon className="h-5 w-5 text-[#213f5b]" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#213f5b]">
                  {
                    factures.filter((f) =>
                      ["Brouillon", "En attente de validation"].includes(f.statut)
                    ).length
                  }
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Prochaines factures à émettre
                </p>
              </motion.div>

              {/* Payé */}
              <motion.div
                className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-[#bfddf9]/30 to-[#d2fcb2]/20 border border-[#bfddf9]/30"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium text-[#213f5b]">Payé</p>
                  <div className="p-2 rounded-full bg-white/60">
                    <BanknotesIcon className="h-5 w-5 text-[#213f5b]" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#213f5b]">
                  {formatMontant(
                    factures
                      .filter((f) => f.statut === "Payée")
                      .reduce((sum, f) => sum + f.montant_ttc, 0)
                  )}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Montant encaissé avec succès
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
                          onClick={() => handleSort("contact")}
                        >
                          <div className="flex items-center gap-1">
                            Contact(s) / Solution
                            {sortBy === "contact" && (
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
                          key={invoice._id}
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
                              {invoice.contact_ids.length > 0
                                ? invoice.contact_ids
                                    .map((cid) => getContactName(cid))
                                    .join(", ")
                                : "—"}
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
                {/* Title & close */}
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

                {/* Form Content */}
                <div className="space-y-6">
                  {/* Invoice ID & Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro de Facture (optionnel)
                      </label>
                      <input
                        type="text"
                        value={newInvoice.id}
                        onChange={(e) =>
                          setNewInvoice({ ...newInvoice, id: e.target.value })
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                        placeholder="(laissez vide si auto)"
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

                  {/* CONTACTS CHECKBOXES */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contacts à Facturer
                    </label>
                    <div className="border border-gray-300 rounded-md p-2 max-h-40 overflow-y-auto space-y-1">
                      {contacts.length === 0 && (
                        <p className="text-sm text-gray-500">
                          Aucun contact trouvé.
                        </p>
                      )}
                      {contacts.map((contact) => {
                        const contactKey = contact.id || contact._id;
                        if (!contactKey) return null;
                        const isChecked =
                          newInvoice.contact_ids.includes(contactKey);
                        const displayName =
                          contact.firstName && contact.lastName
                            ? `${contact.firstName} ${contact.lastName}`
                            : contact.name || "Sans nom";
                        return (
                          <label
                            key={contactKey}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setNewInvoice((prev) => ({
                                    ...prev,
                                    contact_ids: prev.contact_ids.filter(
                                      (cid) => cid !== contactKey
                                    ),
                                  }));
                                } else {
                                  setNewInvoice((prev) => ({
                                    ...prev,
                                    contact_ids: [
                                      ...prev.contact_ids,
                                      contactKey,
                                    ],
                                  }));
                                }
                              }}
                            />
                            <span className="text-sm text-gray-700">
                              {displayName} – {contact.mailingAddress}
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() =>
                          setNewInvoice((prev) => ({
                            ...prev,
                            contact_ids: contacts
                              .map((c) => c.id || c._id)
                              .filter((key): key is string => key !== undefined),
                          }))
                        }
                        className="text-xs text-blue-600 underline"
                      >
                        Tout sélectionner
                      </button>
                      <button
                        onClick={() =>
                          setNewInvoice((prev) => ({
                            ...prev,
                            contact_ids: [],
                          }))
                        }
                        className="text-xs text-blue-600 underline"
                      >
                        Tout désélectionner
                      </button>
                    </div>
                  </div>

                  {/* SOLUTION SELECT + Add new solution button */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Solution / Prestation
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowNewSolutionModal(true)}
                        className="inline-flex items-center gap-1 text-sm text-blue-600 underline"
                      >
                        <PlusCircleIcon className="h-4 w-4" />
                        Nouvelle Solution
                      </button>
                    </div>
                    <select
                      value={newInvoice.solution_id}
                      onChange={(e) => {
                        const solutionId = e.target.value;
                        // Immediately set solution_id
                        setNewInvoice((prev) => ({
                          ...prev,
                          solution_id: solutionId,
                        }));
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                    >
                      <option value="0">Sélectionner une solution</option>
                      {userFilteredSolutions.map((solution) => (
                        <option key={solution.id} value={solution.id}>
                          {solution.name} — Prix de base: {formatMontant(solution.base_price)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* MONTANT HT / TVA / TTC */}
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

                  {/* STATUT INITIAL */}
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

                {/* Buttons */}
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

                  {/* *** RÉGIE + ADMIN Info *** */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-600">
                        Informations de la Régie
                      </h4>
                      <div className="border-t pt-2 text-sm">
                        <p className="font-medium">Ma Régie SARL</p>
                        <p>123 Avenue des Énergies Renouvelables</p>
                        <p>75000 Paris, France</p>
                        <p>regie-contact@example.com</p>
                        <p>Tél: 01 23 45 67 89</p>
                        <p>SIRET: 123 456 789 00012</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-600">
                        Informations Administrateur
                      </h4>
                      <div className="border-t pt-2 text-sm">
                        <p className="font-medium">Nom Admin</p>
                        <p>Email: admin@example.com</p>
                        <p>Tél: 06 01 02 03 04</p>
                        <p>Rôle: Admin &amp; Facturation</p>
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
                            {formatMontant(
                              solutions.find(
                                (s) => s.id === selectedInvoice.solution_id
                              )?.base_price || 0
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {selectedInvoice.contact_ids.length}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {formatMontant(selectedInvoice.montant_ht)}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td
                            colSpan={3}
                            className="px-6 py-3 text-right text-sm font-medium text-gray-500"
                          >
                            Total HT
                          </td>
                          <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                            {formatMontant(selectedInvoice.montant_ht)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan={3}
                            className="px-6 py-3 text-right text-sm font-medium text-gray-500"
                          >
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
                    d&apos;émission. Tout retard de paiement entraînera des
                    pénalités de retard au taux annuel de 5%.
                  </p>
                  <div className="mt-3 text-sm">
                    <p>Mode de paiement: Virement bancaire</p>
                    <p>IBAN: FR76 1234 5678 9012 3456 7890 123</p>
                    <p>BIC: REGIEFRPP</p>
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
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    <PrinterIcon className="h-4 w-4" />
                    Imprimer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadPDF(selectedInvoice)}
                    className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Télécharger
                  </button>
                  {selectedInvoice.statut !== "Payée" && (
                    <button
                      type="button"
                      onClick={() => handlePrimaryActionClick(selectedInvoice)}
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

      {/* Modal Nouvelle Solution */}
      <AnimatePresence>
        {showNewSolutionModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#213f5b]">
                    Nouvelle Solution
                  </h2>
                  <button
                    onClick={() => setShowNewSolutionModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de la Solution
                    </label>
                    <input
                      type="text"
                      value={newSolution.name}
                      onChange={(e) =>
                        setNewSolution({ ...newSolution, name: e.target.value })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix de base (HT)
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        value={newSolution.base_price}
                        onChange={(e) =>
                          setNewSolution({
                            ...newSolution,
                            base_price: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="block w-full rounded-md border-gray-300 pr-12 focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 sm:text-sm">€</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNewSolutionModal(false)}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateSolution}
                    className="inline-flex items-center rounded-md border border-transparent bg-[#213f5b] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#213f5b]/90"
                  >
                    Créer Solution
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
