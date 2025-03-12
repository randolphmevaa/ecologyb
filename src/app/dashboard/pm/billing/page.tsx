"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";

import {
  BanknotesIcon,
  DocumentTextIcon,
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
  prix: string;
  assignedRegie: string;
  _id?: string;
  id?: string;
  name?: string;
  firstName: string;
  lastName: string;
  mailingAddress: string;
  phone?: string;
  email?: string;
  projet?: string[];
}

interface Solution {
  _id?: string;
  id: string;
  name: string;
  base_price: number;
  postedByUserId?: string | null;
}

type InvoiceStatus =
  | "Payée"
  | "En attente de validation"
  | "Envoyée"
  | "Brouillon"
  | "Annulé";

  interface Invoice {
    _id?: string;
    id: string;
    date_creation: string;
    contact_ids: string[];
    solution_id: string;
    montant_ht: number;
    tva: number;
    montant_ttc: number;
    statut: InvoiceStatus;
    date_paiement: string | null;
    postedByUserId?: string | null;
    projets?: string[]; // Add field to track project types
  }

/** ---------------------
 *     MAIN COMPONENT
 *  --------------------- */
export default function FacturationPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [factures, setFactures] = useState<Invoice[]>([]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = (invoice: Invoice, contacts: Contact[], solutions: Solution[]): void => {
    // Initialize PDF document in portrait mode (A4)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set default font
    doc.setFont("helvetica");
    
    // Colors
    const primaryColor = "#213f5b";
    // const secondaryColor = "#f8fafc";
    const accentColor = "#bfddf9";
    
    // Dimensions
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Helper functions
    const formatDate = (dateString: string | null): string => {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    };
    
    const formatMontant = (montant: number): string => {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2
      }).format(montant);
    };
    
    const getContactName = (contactId: string): string => {
      const contact = contacts.find((c: Contact) => c.id === contactId || c._id === contactId);
      if (!contact) return "Contact inconnu";
      return `${contact.firstName} ${contact.lastName}`;
    };
    
    const getSolutionName = (solutionId: string): string => {
      const solution = solutions.find((s: Solution) => s.id === solutionId);
      return solution ? solution.name : "Solution inconnue";
    };
    
    const getStatusColor = (statut: InvoiceStatus): string => {
      if (statut === "Payée") return "#10b981"; // green
      if (statut === "Envoyée") return "#3b82f6"; // blue
      if (statut === "En attente de validation") return "#8b5cf6"; // purple
      if (statut === "Brouillon") return "#f59e0b"; // orange
      if (statut === "Annulé") return "#ef4444"; // red
      return "#6b7280"; // gray
    };
    
    // Draw background header
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, pageWidth, 40, "F");
    
    // Add company logo placeholder
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, 12, 40, 16, 2, 2, "F");
    doc.setTextColor(primaryColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("LOGO", margin + 20, 22, { align: "center" });
    
    // Add company name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Ma Régie SARL", pageWidth - margin, 22, { align: "right" });
    
    // Add invoice title and number
    doc.setFillColor(accentColor);
    doc.rect(0, 40, pageWidth, 15, "F");
    doc.setTextColor(primaryColor);
    doc.setFontSize(14);
    doc.text(`FACTURE N° ${invoice.id}`, margin, 50);
    
    // Add status badge
    const statusText = invoice.statut.toUpperCase();
    const statusColor = getStatusColor(invoice.statut);
    doc.setFillColor(statusColor);
    const statusWidth = doc.getTextWidth(statusText) + 10;
    doc.roundedRect(pageWidth - margin - statusWidth, 43, statusWidth, 8, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(statusText, pageWidth - margin - statusWidth/2, 48, { align: "center" });
    
    // Left column - Company Info
    doc.setTextColor(primaryColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMATIONS SOCIÉTÉ", margin, 70);
    doc.setDrawColor(accentColor);
    doc.line(margin, 72, margin + 60, 72);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Ma Régie SARL", margin, 80);
    doc.text("123 Avenue des Énergies Renouvelables", margin, 85);
    doc.text("75000 Paris, France", margin, 90);
    doc.text("Tél: 01 23 45 67 89", margin, 95);
    doc.text("Email: regie-contact@example.com", margin, 100);
    doc.text("SIRET: 123 456 789 00012", margin, 105);
    
    // Right column - Bill To
    doc.setTextColor(primaryColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("FACTURER À", pageWidth - margin - 60, 70);
    doc.setDrawColor(accentColor);
    doc.line(pageWidth - margin - 60, 72, pageWidth - margin, 72);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    
    // If we have contacts, display them
    if (invoice.contact_ids && invoice.contact_ids.length > 0) {
      const contactNames = invoice.contact_ids.map(getContactName);
      const primaryContact = contacts.find((c: Contact) => c.id === invoice.contact_ids[0] || c._id === invoice.contact_ids[0]);
      
      if (primaryContact) {
        doc.text(`${primaryContact.firstName} ${primaryContact.lastName}`, pageWidth - margin - 60, 80);
        doc.text(primaryContact.mailingAddress || "Adresse non spécifiée", pageWidth - margin - 60, 85);
        doc.text(primaryContact.email || "", pageWidth - margin - 60, 90);
        doc.text(primaryContact.phone || "", pageWidth - margin - 60, 95);
      } else {
        doc.text(contactNames.join(", "), pageWidth - margin - 60, 80);
      }
    } else {
      doc.text("Pas de contacts spécifiés", pageWidth - margin - 60, 80);
    }
    
    // Invoice Details
    doc.setTextColor(primaryColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("DÉTAILS FACTURE", margin, 120);
    doc.setDrawColor(accentColor);
    doc.line(margin, 122, pageWidth - margin, 122);
    
    // Invoice details table
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Numéro de Facture:", margin, 130);
    doc.text(invoice.id, margin + 70, 130);
    
    doc.text("Date d'émission:", margin, 135);
    doc.text(formatDate(invoice.date_creation), margin + 70, 135);
    
    if (invoice.date_paiement) {
      doc.text("Date de paiement:", margin, 140);
      doc.text(formatDate(invoice.date_paiement), margin + 70, 140);
    }
    
    doc.text("Solution:", margin, 145);
    doc.text(getSolutionName(invoice.solution_id), margin + 70, 145);
    
    // Item table header
    const tableTop = 160;
    doc.setFillColor(primaryColor);
    doc.rect(margin, tableTop, contentWidth, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("DESCRIPTION", margin + 5, tableTop + 6);
    doc.text("QTÉ", margin + contentWidth * 0.6, tableTop + 6);
    doc.text("PRIX UNITAIRE", margin + contentWidth * 0.7, tableTop + 6);
    doc.text("TOTAL", margin + contentWidth * 0.9, tableTop + 6);
    
    // Table content
    doc.setTextColor(primaryColor);
    doc.setFont("helvetica", "normal");
    
    const solution = solutions.find((s: Solution) => s.id === invoice.solution_id);
    const qty = invoice.contact_ids.length || 1;
    const unitPrice = solution ? solution.base_price : invoice.montant_ht / qty;
    
    let y = tableTop + 15;
    
    // Solution item row
    doc.text(getSolutionName(invoice.solution_id), margin + 5, y);
    doc.text(qty.toString(), margin + contentWidth * 0.6, y);
    doc.text(formatMontant(unitPrice), margin + contentWidth * 0.7, y);
    doc.text(formatMontant(invoice.montant_ht), margin + contentWidth * 0.9, y);
    
    y += 10;
    
    // Optional: Add contact details or additional line items here
    if (invoice.contact_ids && invoice.contact_ids.length > 0) {
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("Contacts inclus:", margin + 5, y);
      y += 5;
      
      // List contacts (max 5 to avoid overflow)
      const maxContactsToShow = 5;
      const displayedContacts = invoice.contact_ids.slice(0, maxContactsToShow);
      
      displayedContacts.forEach((contactId: string) => {
        doc.text(`• ${getContactName(contactId)}`, margin + 10, y);
        y += 4;
      });
      
      if (invoice.contact_ids.length > maxContactsToShow) {
        doc.text(`... et ${invoice.contact_ids.length - maxContactsToShow} autre(s)`, margin + 10, y);
        y += 4;
      }
      
      doc.setFontSize(9);
      doc.setTextColor(primaryColor);
      y += 5;
    }
    
    // Draw line
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y, margin + contentWidth, y);
    y += 10;
    
    // Totals section
    doc.setFont("helvetica", "normal");
    doc.text("Sous-total:", margin + contentWidth * 0.7, y);
    doc.text(formatMontant(invoice.montant_ht), margin + contentWidth * 0.9, y);
    y += 6;
    
    doc.text(`TVA (${invoice.tva}%):`, margin + contentWidth * 0.7, y);
    doc.text(formatMontant(invoice.montant_ht * (invoice.tva / 100)), margin + contentWidth * 0.9, y);
    y += 6;
    
    doc.setFont("helvetica", "bold");
    doc.text("Total TTC:", margin + contentWidth * 0.7, y);
    doc.text(formatMontant(invoice.montant_ttc), margin + contentWidth * 0.9, y);
    
    // Payment Information
    y += 20;
    doc.setFillColor(primaryColor);
    doc.setTextColor(255, 255, 255);
    doc.rect(margin, y, contentWidth, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.text("INFORMATIONS DE PAIEMENT", margin + 5, y + 6);
    
    y += 15;
    doc.setTextColor(primaryColor);
    doc.setFont("helvetica", "normal");
    doc.text("Mode de paiement:", margin + 5, y);
    doc.text("Virement bancaire", margin + 70, y);
    y += 6;
    
    doc.text("IBAN:", margin + 5, y);
    doc.text("FR76 1234 5678 9012 3456 7890 123", margin + 70, y);
    y += 6;
    
    doc.text("BIC:", margin + 5, y);
    doc.text("REGIEFRPP", margin + 70, y);
    y += 6;
    
    // Terms and conditions
    y += 10;
    doc.setFontSize(8);
    doc.text("Conditions de Paiement: Cette facture est payable dans les 30 jours suivant la date d'émission.", margin, y);
    y += 4;
    doc.text("Tout retard de paiement entraînera des pénalités de retard au taux annuel de 5%.", margin, y);
    
    // Footer
    doc.setDrawColor(primaryColor);
    doc.setFillColor(primaryColor);
    doc.rect(0, pageHeight - 12, pageWidth, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("Ma Régie SARL - SIRET 123 456 789 00012", pageWidth / 2, pageHeight - 5, { align: "center" });
    
    // Page numbers
    doc.text(`Page 1/1`, pageWidth - margin, pageHeight - 5, { align: "right" });
    
    // Save the PDF
    doc.save(`Facture_${invoice.id}.pdf`);
  };

  // Primary action: if invoice is in "Brouillon", send it ("Envoyée"); otherwise mark it as paid.
  const handlePrimaryActionClick = async (invoice: Invoice) => {
    try {
      let updatedFields: Partial<Invoice> = {};
      if (invoice.statut === "Brouillon") {
        updatedFields = {
          statut: "Envoyée",
          postedByUserId: "67a365fff299ca9cb60a6ab4",
        };
      } else {
        updatedFields = {
          statut: "Payée",
          date_paiement: new Date().toISOString(),
        };
      }

      const res = await fetch(`/api/factures/${invoice._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      if (!res.ok) {
        throw new Error(`Failed to update invoice: ${res.statusText}`);
      }

      const updatedInvoice = (await res.json()) as Invoice;

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

  // New cancellation handler to update invoice status to "Annulé"
  const handleCancelInvoice = async (invoice: Invoice) => {
    try {
      const updatedFields: Partial<Invoice> = { statut: "Annulé" };
      const res = await fetch(`/api/factures/${invoice._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok) {
        throw new Error(`Failed to cancel invoice: ${res.statusText}`);
      }
      const updatedInvoice = (await res.json()) as Invoice;
      setFactures((prev) =>
        prev.map((f) => (f._id === updatedInvoice._id ? updatedInvoice : f))
      );
      if (selectedInvoice && selectedInvoice._id === updatedInvoice._id) {
        setSelectedInvoice(updatedInvoice);
      }
    } catch (error) {
      console.error(error);
      alert("Could not cancel invoice.");
    }
  };

  // const getFilteredContactsByRegie = (contactsList: Contact[], regieId: string): Contact[] => {
  //   if (!regieId) return [];
    
  //   return contactsList.filter((contact: Contact) => 
  //     contact.assignedRegie === regieId
  //   );
  // };

  // New function to calculate total price from selected contacts
const calculateTotalPriceFromContacts = (contactIds: string[], contactsList: Contact[]): number => {
  let totalPrice = 0;
  
  contactIds.forEach(contactId => {
    const contact = contactsList.find(c => (c.id === contactId || c._id === contactId));
    if (contact && contact.prix) {
      // Convert to number because prix might be stored as string
      const contactPrice = parseFloat(contact.prix);
      if (!isNaN(contactPrice)) {
        totalPrice += contactPrice;
      }
    }
  });
  
  return totalPrice;
};

// Update the checkbox onChange handler for contacts
const handleContactCheckboxChange = (contactKey: string, isChecked: boolean) => {
  let newContactIds: string[];
  
  if (isChecked) {
    // Remove the contact
    newContactIds = newInvoice.contact_ids.filter(cid => cid !== contactKey);
  } else {
    // Add the contact
    newContactIds = [...newInvoice.contact_ids, contactKey];
  }
  
  // Calculate the new total price
  const totalPrice = calculateTotalPriceFromContacts(newContactIds, contacts);
  
  // Update the invoice state with new contact ids and price
  setNewInvoice(prev => ({
    ...prev,
    contact_ids: newContactIds,
    montant_ht: totalPrice
  }));
};

// Update the "Tout sélectionner" button click handler
const handleSelectAllContacts = () => {
  const filteredContacts = userInfo 
    ? contacts.filter((contact: Contact) => 
        contact.assignedRegie === userInfo.id || 
        contact.assignedRegie === userInfo.id?.toString())
    : [];
  
  const contactIds = filteredContacts
    .map((c) => c.id || c._id)
    .filter((key): key is string => key !== undefined);
  
  // Calculate total price for all selected contacts
  const totalPrice = calculateTotalPriceFromContacts(contactIds, contacts);
  
  setNewInvoice((prev) => ({
    ...prev,
    contact_ids: contactIds,
    montant_ht: totalPrice
  }));
};

// Update the "Tout désélectionner" button click handler
const handleDeselectAllContacts = () => {
  setNewInvoice((prev) => ({
    ...prev,
    contact_ids: [],
    montant_ht: 0
  }));
};

  const [userInfo, setUserInfo] = useState<{
    id: unknown; _id: string; email: string 
} | null>(null);
  useEffect(() => {
    const proInfo = localStorage.getItem("proInfo");
    if (proInfo) {
      setUserInfo(JSON.parse(proInfo));
    }
  }, []);

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

  // const userFilteredSolutions = userInfo
  //   ? solutions.filter((solution) => solution.postedByUserId === userInfo._id)
  //   : solutions;

  const [filter, setFilter] = useState<InvoiceStatus | "Toutes">("Toutes");
  const [, setCurrentDate] = useState("");
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [showInvoiceDetailModal, setShowInvoiceDetailModal] = useState(false);
  const [showNewSolutionModal, setShowNewSolutionModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] =
    useState<"date" | "contact" | "montant" | "statut">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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

  const [newSolution, setNewSolution] = useState<{
    id?: string;
    name: string;
    base_price: number;
  }>({ name: "", base_price: 0 });

  const [ , setCurrentUserId] = useState<string | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("proInfo");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUserId(user._id || user.email || null);
    }
  }, []);

  const getContactName = (contactId: string): string => {
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) return "Contact inconnu";
    return `${contact.firstName} ${contact.lastName}`;
  };

  const getSolutionName = (solutionId: string): string => {
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
    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  useEffect(() => {
    setNewInvoice((prev) => ({
      ...prev,
      montant_ttc: prev.montant_ht * (1 + prev.tva / 100),
    }));
  }, [newInvoice.montant_ht, newInvoice.tva]);

  // useEffect(() => {
  //   const solution = solutions.find((s) => s.id === newInvoice.solution_id);
  //   if (solution) {
  //     const contactCount = newInvoice.contact_ids.length || 1;
  //     setNewInvoice((prev) => ({
  //       ...prev,
  //       montant_ht: solution.base_price * contactCount,
  //     }));
  //   } else {
  //     setNewInvoice((prev) => ({ ...prev, montant_ht: 0 }));
  //   }
  // }, [newInvoice.solution_id, newInvoice.contact_ids, solutions]);

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

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetailModal(true);
  };

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

      setShowNewInvoiceModal(false);
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
      setFactures((prev) => [createdInvoice, ...prev]);
    } catch (error) {
      console.error(error);
      alert("Could not create invoice.");
    }
  };

  const handleCreateSolution = async () => {
    try {
      const storedUser = localStorage.getItem("proInfo");
      const userInfo = storedUser ? JSON.parse(storedUser) : null;
      const postedByUserId = userInfo?._id || userInfo?.email || null;
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

      setSolutions((prev) => [...prev, createdSolution]);
      setNewSolution({ name: "", base_price: 0 });
      setShowNewSolutionModal(false);
    } catch (err) {
      console.error(err);
      alert("Could not create solution.");
    }
  };

  const handleSort = (field: "date" | "contact" | "montant" | "statut") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Utility to determine status color classes
  const getStatusClasses = (statut: InvoiceStatus) => {
    if (statut === "Brouillon") return "bg-orange-100 text-orange-800";
    if (statut === "En attente de validation")
      return "bg-purple-100 text-purple-800";
    if (statut === "Envoyée") return "bg-blue-100 text-blue-800";
    if (statut === "Payée") return "bg-green-100 text-green-800";
    if (statut === "Annulé") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
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
                  {factures.filter((f) => f.statut === "En attente de validation").length}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Montant encore non encaissé
                </p>
              </motion.div>

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
                          "En attente de validation",
                          "Envoyée",
                          "Payée",
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
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
                                invoice.statut
                              )}`}
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
                              {(invoice.statut === "Brouillon" ||
                                invoice.statut === "En attente de validation") && (
                                <button
                                  onClick={() => handleCancelInvoice(invoice)}
                                  className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                >
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
                    
                    {userInfo && contacts.filter((contact: Contact) => 
                      contact.assignedRegie === userInfo.id || contact.assignedRegie === userInfo.id?.toString()
                    ).length === 0 ? (
                      <p className="text-sm text-gray-500">
                        Aucun contact assigné à votre régie.
                      </p>
                    ) : (
                      contacts
                        .filter((contact: Contact) => userInfo && (contact.assignedRegie === userInfo.id || contact.assignedRegie === userInfo.id?.toString()))
                        .map((contact) => {
                          const contactKey = contact.id || contact._id;
                          if (!contactKey) return null;
                          const isChecked = newInvoice.contact_ids.includes(contactKey);
                          const displayName =
                            contact.firstName && contact.lastName
                              ? `${contact.firstName} ${contact.lastName}`
                              : contact.name || "Sans nom";
                          
                          // Add price display
                          const price = contact.prix ? parseFloat(contact.prix) : 0;
                          const formattedPrice = price ? formatMontant(price) : "N/A";
                          
                          return (
                            <label
                              key={contactKey}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleContactCheckboxChange(contactKey, isChecked)}
                              />
                              <span className="text-sm text-gray-700">
                                {displayName} – {contact.mailingAddress} – <span className="font-medium">{formattedPrice}</span>
                              </span>
                            </label>
                          );
                        })
                    )}
                  </div>
                  
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={handleSelectAllContacts}
                      className="text-xs text-blue-600 underline"
                    >
                      Tout sélectionner
                    </button>
                    <button
                      onClick={handleDeselectAllContacts}
                      className="text-xs text-blue-600 underline"
                    >
                      Tout désélectionner
                    </button>
                  </div>
                </div>

                  {/* <div>
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
                  </div> */}

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
                    {newInvoice.statut === "En attente de validation"
                      ? "Envoyé Facture"
                      : "Créer Facture"}
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
                        className={`mt-2 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusClasses(
                          selectedInvoice.statut
                        )}`}
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
                    onClick={() => handleDownloadPDF(selectedInvoice, contacts, solutions)}
                    className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Télécharger
                  </button>
                  {selectedInvoice.statut !== "Payée" &&
                    selectedInvoice.statut !== "Annulé" && (
                      <button
                        type="button"
                        onClick={() =>
                          handlePrimaryActionClick(selectedInvoice)
                        }
                        className="inline-flex items-center gap-1 rounded-md bg-[#213f5b] px-4 py-2 text-sm font-medium text-white hover:bg-[#213f5b]/90"
                      >
                        <PaperAirplaneIcon className="h-4 w-4" />
                        {selectedInvoice.statut === "Brouillon"
                          ? "Envoyer"
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
