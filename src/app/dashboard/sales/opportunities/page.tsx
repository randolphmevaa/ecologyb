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
} from "@heroicons/react/24/outline";
import { jsPDF } from "jspdf";

// ---------- TYPE DEFINITIONS ----------
interface Regie {
  id: string;
  _id?: string;
  name: string;
  email: string;
  region: string;
}

interface Solution {
  id: string;
  _id?: string;
  name: string;
  base_price: number;
}

interface Contact {
  id?: string;
  _id?: string;
  firstName: string;
  lastName: string;
  mailingAddress: string;
  email?: string;
  phone?: string;
  assignedRegie?: string; // Mark as optional since it might be undefined
}

// Map the original statuses to admin view statuses
type OriginalInvoiceStatus =
  | "Payée"
  | "En attente de validation"
  | "Envoyée"
  | "Brouillon"
  | "Annulé"
  | "Rejetée";

type AdminInvoiceStatus = "Approuvée" | "En attente d'approbation" | "Rejetée" | "Reçu";

interface Invoice {
  _id?: string;
  id: string;
  date_creation: string;
  date_reception?: string;
  contact_ids: string[];
  solution_id: string;
  montant_ht: number;
  tva: number;
  montant_ttc: number;
  statut: OriginalInvoiceStatus;
  date_approbation?: string | null;
  date_paiement: string | null;
  commentaire_admin?: string;
}

// ---------- MAIN COMPONENT ----------
export default function AdminFacturationPage() {
  // Data states
  const [regies, setRegies] = useState<Regie[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [factures, setFactures] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // UI states
  const [filter, setFilter] = useState<AdminInvoiceStatus | "Toutes">("Toutes");
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

  // Helper functions for status mapping
  const mapStatusToAdmin = (status: OriginalInvoiceStatus): AdminInvoiceStatus => {
    if (status === "Payée") return "Approuvée";
    if (status === "En attente de validation") return "En attente d'approbation";
    if (status === "Envoyée") return "Reçu";
    if (status === "Rejetée" || status === "Annulé") return "Rejetée";
    return "En attente d'approbation"; // Default
  };

  // Load data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [facturesRes, solutionsRes, contactsRes] = await Promise.all([
          fetch("/api/factures"),
          fetch("/api/solutions"),
          fetch("/api/contacts")
        ]);

        // Parse responses
        const facturesData = await facturesRes.json();
        const solutionsData = await solutionsRes.json();
        const contactsData = await contactsRes.json();

        // Normalize data
        const contactsArray = Array.isArray(contactsData) ? contactsData : contactsData.contacts || [];
        
        // Generate regies from contacts with assignedRegie
        const regieMap = new Map();
        contactsArray.forEach((contact: Contact) => {
          if (contact.assignedRegie) {
            if (!regieMap.has(contact.assignedRegie)) {
              regieMap.set(contact.assignedRegie, {
                id: contact.assignedRegie,
                name: `${contact.firstName} ${contact.lastName}`,
                email: contact.email || "no-email@example.com",
                region: contact.mailingAddress?.split(",").pop()?.trim() || "Unknown Region"
              });
            }
          }
        });
        
        const regiesArray = Array.from(regieMap.values());
        
        // Set state
        setContacts(contactsArray);
        setSolutions(Array.isArray(solutionsData) ? solutionsData : []);
        setRegies(regiesArray);
        setFactures(Array.isArray(facturesData) ? facturesData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Set current date
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

  // Set invoice comment when invoice is selected
  useEffect(() => {
    if (selectedInvoice) {
      setInvoiceComment(selectedInvoice.commentaire_admin || "");
    }
  }, [selectedInvoice]);

  // Stats for the dashboard
  const statsData = {
    enAttenteApprobation: factures.filter(f => 
      f.statut === "En attente de validation"
    ).length,
    enAttenteVerification: factures.filter(f => 
      f.statut === "Envoyée"
    ).length,
    aPayer: factures.filter(f => 
      f.statut === "Payée" && !f.date_paiement
    ).length,
    facturePaye: factures.filter(f => 
      f.statut === "Payée" && f.date_paiement
    ).length,
    totalEnAttenteApprobation: factures
      .filter(f => f.statut === "En attente de validation")
      .reduce((sum, f) => sum + f.montant_ttc, 0),
    totalEnAttenteVerification: factures
      .filter(f => f.statut === "Envoyée")
      .reduce((sum, f) => sum + f.montant_ttc, 0),
    totalAPayer: factures
      .filter(f => f.statut === "Payée" && !f.date_paiement)
      .reduce((sum, f) => sum + f.montant_ttc, 0),
    totalPaye: factures
      .filter(f => f.statut === "Payée" && f.date_paiement)
      .reduce((sum, f) => sum + f.montant_ttc, 0),
  };

  // Region data for visualization
  // const regionData = regies.map((regie) => {
  //   const regieInvoices = factures.filter(f => {
  //     // Find all contacts assigned to this regie
  //     const regieContactIds = contacts
  //       .filter((c: Contact) => c.assignedRegie === regie.id)
  //       .map((c: Contact) => c.id || c._id || "");
        
  //     // Check if any of the invoice's contacts belong to this regie
  //     return f.contact_ids.some(cid => regieContactIds.includes(cid)) && 
  //            mapStatusToAdmin(f.statut) === "Approuvée";
  //   });
    
  //   return {
  //     region: regie.region,
  //     count: regieInvoices.length,
  //     amount: regieInvoices.reduce((sum, f) => sum + f.montant_ttc, 0),
  //   };
  // }).filter(region => region.count > 0);

  // Utility functions
  const getContactName = (contactId: string): string => {
    const contact = contacts.find(c => (c.id === contactId || c._id === contactId));
    if (!contact) return "Contact inconnu";
    return `${contact.firstName} ${contact.lastName}`;
  };

  const getContactsForInvoice = (invoice: Invoice): string => {
    return invoice.contact_ids
      .map(id => getContactName(id))
      .join(", ");
  };

  const getRegieForInvoice = (invoice: Invoice): Regie | null => {
    // Find a contact in the invoice
    if (invoice.contact_ids.length === 0) return null;
    
    const contactId = invoice.contact_ids[0];
    const contact = contacts.find(c => (c.id === contactId || c._id === contactId));
    
    if (!contact || !contact.assignedRegie) return null;
    
    return regies.find(r => r.id === contact.assignedRegie) || null;
  };

  const getRegieName = (invoice: Invoice): string => {
    const regie = getRegieForInvoice(invoice);
    return regie ? regie.name : "Régie inconnue";
  };

  const getSolutionName = (solutionId: string): string => {
    const solution = solutions.find(s => s.id === solutionId || s._id === solutionId);
    return solution ? solution.name : "Solution inconnue";
  };

  const formatMontant = (montant: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(montant);
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" } as Intl.DateTimeFormatOptions;
    return new Intl.DateTimeFormat("fr-FR", options).format(date);
  };

  // const handlePrint = () => {
  //   window.print();
  // };

  const handleDownloadPDF = (invoice: Invoice) => {
    if (!invoice) return;
    
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Facture: ${invoice.id}`, 10, 10);
    doc.text(`Date de création: ${formatDate(invoice.date_creation)}`, 10, 20);
    doc.text(`Statut: ${mapStatusToAdmin(invoice.statut)}`, 10, 30);
    doc.text(`Montant TTC: ${formatMontant(invoice.montant_ttc)}`, 10, 40);
    
    if (invoice.contact_ids.length > 0) {
      doc.text(`Contacts: ${getContactsForInvoice(invoice)}`, 10, 50);
    }
    
    const regie = getRegieForInvoice(invoice);
    if (regie) {
      doc.text(`Régie: ${regie.name}`, 10, 60);
    }
    
    doc.save(`Facture_${invoice.id}.pdf`);
  };

  // Filter invoices according to criteria
  // Exclude "Brouillon" status
  const validInvoices = factures.filter(invoice => invoice.statut !== "Brouillon");
  
  // Apply additional filters
  const filteredInvoices = validInvoices
    .filter(invoice => {
      if (filter === "Toutes") return true;
      return mapStatusToAdmin(invoice.statut) === filter;
    })
    .filter(invoice => {
      if (!searchTerm) return true;
      const contactNames = getContactsForInvoice(invoice).toLowerCase();
      const regieName = getRegieName(invoice).toLowerCase();
      const solutionName = getSolutionName(invoice.solution_id).toLowerCase();
      const invoiceId = invoice.id.toLowerCase();
      const search = searchTerm.toLowerCase();
      
      return (
        contactNames.includes(search) ||
        regieName.includes(search) ||
        solutionName.includes(search) ||
        invoiceId.includes(search)
      );
    });

  // Sort the filtered invoices
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "date_reception":
        comparison = new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime();
        break;
      case "regie":
        comparison = getRegieName(a).localeCompare(getRegieName(b));
        break;
      case "montant":
        comparison = a.montant_ttc - b.montant_ttc;
        break;
      case "statut":
        comparison = mapStatusToAdmin(a.statut).localeCompare(mapStatusToAdmin(b.statut));
        break;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Handlers for view actions
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

  // Handle approving an invoice
  const handleApproveInvoice = async () => {
    if (!selectedInvoice) return;

    try {
      // Convert admin status to original status
      const updatedFields = {
        statut: "Payée", // Use the original status system
        date_approbation: new Date().toISOString().split("T")[0],
        commentaire_admin: invoiceComment
      };

      // Make sure _id exists before using it
      const invoiceId = selectedInvoice._id;
      if (!invoiceId) {
        throw new Error("Invoice ID is undefined");
      }

      const res = await fetch(`/api/factures/${invoiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      if (!res.ok) {
        throw new Error(`Failed to update invoice: ${res.statusText}`);
      }

      const updatedInvoice = await res.json();

      // Update local state
      setFactures(prev => 
        prev.map(f => f._id === selectedInvoice._id ? updatedInvoice : f)
      );
      
      setSelectedInvoice({
        ...selectedInvoice,
        statut: "Payée",
        date_approbation: new Date().toISOString().split("T")[0],
        commentaire_admin: invoiceComment,
      });
      
      setAlertMessage("La facture a été approuvée avec succès.");
      setAlertType("success");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    } catch (error) {
      console.error(error);
      setAlertMessage("Erreur lors de l'approbation de la facture.");
      setAlertType("error");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    }
  };

  // Handle rejecting an invoice
  const handleRejectInvoice = async () => {
    if (!selectedInvoice) return;
    
    if (!invoiceComment.trim()) {
      setAlertMessage("Veuillez fournir un motif de rejet.");
      setAlertType("error");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
      return;
    }
    
    try {
      const updatedFields = {
        statut: "Annulé", // Using "Annulé" as the rejection status
        commentaire_admin: invoiceComment
      };

      // Make sure _id exists before using it
      const invoiceId = selectedInvoice._id;
      if (!invoiceId) {
        throw new Error("Invoice ID is undefined");
      }

      const res = await fetch(`/api/factures/${invoiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      if (!res.ok) {
        throw new Error(`Failed to update invoice: ${res.statusText}`);
      }

      const updatedInvoice = await res.json();

      // Update local state
      setFactures(prev => 
        prev.map(f => f._id === selectedInvoice._id ? updatedInvoice : f)
      );
      
      setSelectedInvoice({
        ...selectedInvoice,
        statut: "Annulé",
        commentaire_admin: invoiceComment,
      });
      
      setAlertMessage("La facture a été rejetée.");
      setAlertType("success");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    } catch (error) {
      console.error(error);
      setAlertMessage("Erreur lors du rejet de la facture.");
      setAlertType("error");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    }
  };

  // Mark invoice as paid
  const handleMarkAsPaid = async () => {
    if (!selectedInvoice) return;
    
    try {
      const updatedFields = {
        date_paiement: new Date().toISOString().split("T")[0],
        commentaire_admin: invoiceComment || "Paiement enregistré"
      };

      // Make sure _id exists before using it
      const invoiceId = selectedInvoice._id;
      if (!invoiceId) {
        throw new Error("Invoice ID is undefined");
      }

      const res = await fetch(`/api/factures/${invoiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      if (!res.ok) {
        throw new Error(`Failed to update invoice: ${res.statusText}`);
      }

      const updatedInvoice = await res.json();

      // Update local state
      setFactures(prev => 
        prev.map(f => f._id === selectedInvoice._id ? updatedInvoice : f)
      );
      
      setSelectedInvoice({
        ...selectedInvoice,
        date_paiement: new Date().toISOString().split("T")[0],
        commentaire_admin: invoiceComment || "Paiement enregistré",
      });
      
      setAlertMessage("Le paiement de la facture a été enregistré.");
      setAlertType("success");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    } catch (error) {
      console.error(error);
      setAlertMessage("Erreur lors de l'enregistrement du paiement.");
      setAlertType("error");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    }
  };

  // Helper to get status display classes
  const getStatusClasses = (status: AdminInvoiceStatus) => {
    if (status === "Approuvée") return "bg-green-100 text-green-800";
    if (status === "En attente d'approbation") return "bg-yellow-100 text-yellow-800";
    if (status === "Reçu") return "bg-blue-100 text-blue-800";
    if (status === "Rejetée") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
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

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-gray-600">Chargement des données...</p>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-6">
              {/* -- Stats row -- */}
<motion.div
  className="col-span-12 grid grid-cols-1 gap-5 md:grid-cols-4"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.2 }}
>
  {/* Pending - Blue theme */}
  <motion.div
    className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-200"
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex justify-between items-center mb-3">
      <p className="text-sm font-medium text-[#213f5b]">En attente</p>
      <div className="p-2 rounded-full bg-white/60">
        <ClockIcon className="h-5 w-5 text-blue-500" />
      </div>
    </div>
    <p className="text-2xl font-bold text-[#213f5b]">
      {formatMontant(statsData.totalEnAttenteApprobation)}
    </p>
    <p className="text-xs text-gray-600 mt-1">
      {statsData.enAttenteApprobation} factures
    </p>
  </motion.div>

  {/* To modify - Purple theme */}
  <motion.div
    className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-purple-100 to-purple-200 border border-purple-200"
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex justify-between items-center mb-3">
      <p className="text-sm font-medium text-[#213f5b]">A modifier</p>
      <div className="p-2 rounded-full bg-white/60">
        <MagnifyingGlassIcon className="h-5 w-5 text-purple-500" />
      </div>
    </div>
    <p className="text-2xl font-bold text-[#213f5b]">
      {formatMontant(statsData.totalEnAttenteVerification)}
    </p>
    <p className="text-xs text-gray-600 mt-1">
      {statsData.enAttenteVerification} factures
    </p>
  </motion.div>

  {/* To pay - Orange theme */}
  <motion.div
    className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-orange-100 to-orange-200 border border-orange-200"
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex justify-between items-center mb-3">
      <p className="text-sm font-medium text-[#213f5b]">A payer</p>
      <div className="p-2 rounded-full bg-white/60">
        <BanknotesIcon className="h-5 w-5 text-orange-500" />
      </div>
    </div>
    <p className="text-2xl font-bold text-[#213f5b]">
      {formatMontant(statsData.totalAPayer)}
    </p>
    <p className="text-xs text-gray-600 mt-1">
      {statsData.aPayer} factures
    </p>
  </motion.div>

  {/* Paid - Green theme */}
  <motion.div
    className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-green-100 to-green-200 border border-green-200"
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex justify-between items-center mb-3">
      <p className="text-sm font-medium text-[#213f5b]">Payé</p>
      <div className="p-2 rounded-full bg-white/60">
        <CheckBadgeIcon className="h-5 w-5 text-green-500" />
      </div>
    </div>
    <p className="text-2xl font-bold text-[#213f5b]">
      {formatMontant(statsData.totalPaye)}
    </p>
    <p className="text-xs text-gray-600 mt-1">
      {statsData.facturePaye} factures
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
                          {["Toutes", "En attente d'approbation", "Reçu", "Approuvée", "Rejetée"].map(
                            (status) => (
                              <div
                                key={status}
                                className={`px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 ${
                                  filter === status
                                    ? "bg-[#bfddf9]/30 font-medium"
                                    : ""
                                }`}
                                onClick={() => {
                                  setFilter(status as AdminInvoiceStatus | "Toutes");
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
                              Régie / Contacts
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
                        {sortedInvoices.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                              Aucune facture trouvée.
                            </td>
                          </tr>
                        ) : (
                          sortedInvoices.map((invoice) => {
                            const adminStatus = mapStatusToAdmin(invoice.statut);
                            
                            return (
                              <tr
                                key={invoice._id || invoice.id}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                {/* Cell: N° Facture / Date */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="font-medium text-[#213f5b]">
                                    {invoice.id}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Créée le {formatDate(invoice.date_creation)}
                                  </div>
                                </td>

                                {/* Cell: Régie / Contacts */}
                                <td className="px-6 py-4">
                                  <div className="font-medium text-[#213f5b]">
                                    {getRegieName(invoice)}
                                  </div>
                                  <div className="text-xs text-gray-500 truncate max-w-xs">
                                    {getContactsForInvoice(invoice)}
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
                                      getStatusClasses(adminStatus)
                                    }`}
                                  >
                                    {adminStatus}
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
                                    
                                    {(adminStatus === "En attente d'approbation" || adminStatus === "Reçu") && (
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
                                    
                                    {adminStatus === "Approuvée" && !invoice.date_paiement && (
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
                            );
                          })
                        )}
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
                    Par partenaires
                  </h3>
                  
                  {/* Chart visualization */}
                  <div className="h-60 mb-4">
                    {/* This would be a bar chart showing invoice amounts per user */}
                    <div className="w-full h-full bg-gradient-to-b from-[#bfddf9]/30 to-[#d2fcb2]/20 rounded-lg relative overflow-hidden">
                      {contacts.filter(c => c.assignedRegie).slice(0, 5).map((contact, idx) => {
                        // Calculate total amount for this user
                        const contactId = contact.id || contact._id || "";
                        
                        const totalAmount = factures
                          .filter(f => f.contact_ids.includes(contactId) && f.statut === "Payée")
                          .reduce((sum, f) => sum + f.montant_ttc, 0);
                          
                        // Calculate width percentage based on max total
                        const maxTotal = Math.max(...contacts
                          .filter(c => c.assignedRegie)
                          .map(c => {
                            const cId = c.id || c._id || "";
                            return factures
                              .filter(f => f.contact_ids.includes(cId) && f.statut === "Payée")
                              .reduce((sum, f) => sum + f.montant_ttc, 0);
                          }));
                          
                        const widthPercentage = Math.max(5, Math.round((totalAmount / (maxTotal || 1)) * 90));
                        
                        return (
                          <div 
                            key={contactId || idx} 
                            className="flex items-center my-3 px-3"
                          >
                            <div className="w-32 mr-3 text-sm truncate">
                              {contact.firstName} {contact.lastName}
                            </div>
                            <div className="flex-1 h-8 bg-gray-100 rounded-lg">
                              <div 
                                className="h-8 rounded-lg bg-[#213f5b]"
                                style={{ width: `${widthPercentage}%` }}
                              >
                                <div className="flex h-full items-center justify-end">
                                  <span className="text-white text-xs font-medium px-2">
                                    {formatMontant(totalAmount)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Total section */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-[#213f5b]">Total</span>
                      <span className="text-xl font-bold text-[#213f5b]">
                        {formatMontant(factures
                          .filter(f => f.statut === "Payée")
                          .reduce((sum, f) => sum + f.montant_ttc, 0)
                        )}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {factures.filter(f => f.statut === "Payée").length} factures payées
                    </div>
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
                  {factures.filter(f => 
                    mapStatusToAdmin(f.statut) === "En attente d'approbation" || 
                    mapStatusToAdmin(f.statut) === "Reçu"
                  ).length === 0 ? (
                    <p className="text-gray-500">Aucune facture en attente.</p>
                  ) : (
                    <div className="space-y-4">
                      {factures
                        .filter(f => 
                          mapStatusToAdmin(f.statut) === "En attente d'approbation" || 
                          mapStatusToAdmin(f.statut) === "Reçu"
                        )
                        .sort((a, b) => 
                          new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime()
                        )
                        .slice(0, 4)
                        .map((invoice) => (
                          <div
                            key={invoice._id || invoice.id}
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
                                Régie: {getRegieName(invoice)}
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
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </main>
      </div>

      {/* -- MODAL: Détails Facture -- */}
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
                        Date de création
                      </div>
                      <div className="font-medium">
                        {formatDate(selectedInvoice.date_creation)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Statut</div>
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          getStatusClasses(mapStatusToAdmin(selectedInvoice.statut))
                        }`}
                      >
                        {mapStatusToAdmin(selectedInvoice.statut)}
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

                {/* Infos Régie & Admin */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-md font-semibold text-[#213f5b] mb-3">
                      Informations Régie
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg h-full">
                      {getRegieForInvoice(selectedInvoice) ? (
                        <>
                          <div className="font-semibold mb-1">
                            {getRegieName(selectedInvoice)}
                          </div>
                          <div className="text-sm text-gray-500 mb-1">
                            {getRegieForInvoice(selectedInvoice)?.email || "Email non disponible"}
                          </div>
                          <div className="text-sm text-gray-500">
                            Région: {getRegieForInvoice(selectedInvoice)?.region || "Région non disponible"}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Informations de régie non disponibles
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-semibold text-[#213f5b] mb-3">
                      Informations Admin
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg h-full">
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

                {/* Information Contacts */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-[#213f5b] mb-3">
                    Contacts
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {selectedInvoice.contact_ids.length === 0 ? (
                      <div className="text-sm text-gray-500">Aucun contact lié à cette facture</div>
                    ) : (
                      <div className="space-y-2">
                        {selectedInvoice.contact_ids.map((contactId, idx) => {
                          const contact = contacts.find(c => (c.id === contactId || c._id === contactId));
                          if (!contact) return null;
                          
                          return (
                            <div key={idx} className="text-sm">
                              <div className="font-medium">{contact.firstName} {contact.lastName}</div>
                              <div className="text-gray-500">{contact.mailingAddress}</div>
                              {contact.email && <div className="text-gray-500">{contact.email}</div>}
                              {contact.phone && <div className="text-gray-500">{contact.phone}</div>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Détails Prestation */}
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

                {/* Commentaire */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-[#213f5b] mb-3">
                    {(mapStatusToAdmin(selectedInvoice.statut) === "En attente d'approbation" ||
                     mapStatusToAdmin(selectedInvoice.statut) === "Reçu")
                      ? "Commentaire pour la régie"
                      : "Commentaire de l'administration"}
                  </h3>
                  <textarea
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#213f5b] focus:ring-[#213f5b] sm:text-sm"
                    placeholder={
                      (mapStatusToAdmin(selectedInvoice.statut) === "En attente d'approbation" ||
                      mapStatusToAdmin(selectedInvoice.statut) === "Reçu")
                        ? "Ajouter un commentaire pour la régie..."
                        : ""
                    }
                    value={invoiceComment}
                    onChange={(e) => setInvoiceComment(e.target.value)}
                    disabled={
                      !(mapStatusToAdmin(selectedInvoice.statut) === "En attente d'approbation" ||
                      mapStatusToAdmin(selectedInvoice.statut) === "Reçu" ||
                      (mapStatusToAdmin(selectedInvoice.statut) === "Approuvée" && !selectedInvoice.date_paiement))
                    }
                  />
                </div>

                {/* Buttons */}
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
                    {(mapStatusToAdmin(selectedInvoice.statut) === "En attente d'approbation" ||
                     mapStatusToAdmin(selectedInvoice.statut) === "Reçu") && (
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
                    {mapStatusToAdmin(selectedInvoice.statut) === "Approuvée" &&
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
                      onClick={() => handleDownloadPDF(selectedInvoice)}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#213f5b] border border-transparent rounded-md shadow-sm hover:bg-[#213f5b]/90 flex items-center gap-1"
                    >
                      <PrinterIcon className="h-4 w-4" />
                      Imprimer / Télécharger
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
