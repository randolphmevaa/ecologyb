import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import { motion } from "framer-motion";
import {
  XMarkIcon,
  DocumentTextIcon,
  // MapPinIcon,
  UserIcon,
  ClockIcon,
  CalendarIcon,
  WrenchIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/Button"; // Your custom Button component
import { jsPDF } from "jspdf";
import SignaturePad from "signature_pad";
import { PencilIcon } from "lucide-react";

interface AttestationData {
  lastName: string;
  firstName: string;
  ticketId: string;
  date: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  interventionDate: string;
  interventionDetails: string;
  signatureDate: string;
  signature: string | null;
}

interface Event {
  notes?: string;
  _id: string;
  customerLastName: string;
  customerFirstName: string;
  createdAt: string;
  technicianFirstName: string;
  technicianLastName: string;
  problem?: string;
  equipmentType?: string;
}

interface Contact {
  mailingAddress: string;
  phone: string;
  // add other properties if needed
}


interface Client {
  _id: string;
  mailingAddress: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface EventDetailsModalProps {
  title?: string;
  selectedEvent: Event;
  contact: Contact | null;
  onClose: () => void;
  handleGenerateAttestation: () => void;
  // selectedEvent: SelectedEvent;
  // contact?: Contact;
  formattedDate: string;
  formattedTime: string;
  // onClose: () => void;
  setShowAttestationModal: (show: boolean) => void;
  pdfPreviewUrl?: string;
  onSendToTechnician?: () => void;
  onSendToClient?: () => void;
}

// Define types for the component props
// interface SelectedEvent {
//   customerFirstName: string;
//   customerLastName: string;
//   problem?: string;
//   technicianFirstName: string;
//   technicianLastName: string;
//   equipmentType?: string;
//   notes?: string;
// }

interface Contact {
  mailingAddress: string;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  // title,
  selectedEvent,
  contact,
  onClose,
  onSendToTechnician = () => {},
  onSendToClient = () => {}
}) => {
  // Main modal state for Event Details
  const [showAttestationModal, setShowAttestationModal] = useState<boolean>(false);
  const [ , setClients] = useState<Client[]>([]);
  // Removed selectedClientId if it is not used elsewhere
  const [signaturePadKey, setSignaturePadKey] = useState<number>(Date.now());
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Attestation form state – allow editing later
  const [attestationData, setAttestationData] = useState<AttestationData>({
    lastName: "",
    firstName: "",
    ticketId: "",
    date: new Date().toISOString().split("T")[0],
    address: "",
    postalCode: "",
    city: "",
    phone: "",
    interventionDate: new Date().toISOString().slice(0, 16),
    interventionDetails: "",
    signatureDate: "",
    signature: null,
  });
  const [techSectionRevealed, setTechSectionRevealed] = useState(false);
  const [clientSectionRevealed, setClientSectionRevealed] = useState(false);
  // Persist PDF preview URL from backend so it survives refreshes
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string>("");

  // Refs for the signature pad
  const signatureRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  // Fetch client contacts from API on mount
  useEffect(() => {
    fetch("/api/contacts")
      .then((res) => res.json())
      .then((data: Client[]) => setClients(data))
      .catch((error) => console.error("Error fetching clients:", error));
  }, []);

  // Fetch saved attestation data for selected event if available
  useEffect(() => {
    if (selectedEvent) {
      fetch(`/api/attestations/${selectedEvent._id}`)
        .then((res) => res.json())
        .then((result) => {
          if (result.success && result.data && result.data.pdfUrl) {
            setPdfPreviewUrl(result.data.pdfUrl);
            if (result.data.attestationData) {
              setAttestationData(result.data.attestationData);
            }
          }
        })
        .catch((err) => console.error("Error fetching saved attestation:", err));
    }
  }, [selectedEvent]);

  // Utility function to parse mailingAddress
  const parseMailingAddress = (mailingAddress: string) => {
    const regex = /(\d{5})\s+(.+)$/;
    const match = mailingAddress.match(regex);
    if (match) {
      return { postalCode: match[1], city: match[2] };
    }
    return { postalCode: "", city: "" };
  };

  // Prefill the attestation data from selectedEvent and contact
  useEffect(() => {
    if (selectedEvent && contact) {
      const { postalCode, city } = parseMailingAddress(contact.mailingAddress);
      setAttestationData((prev) => ({
        ...prev,
        lastName: selectedEvent.customerLastName,
        firstName: selectedEvent.customerFirstName,
        address: contact.mailingAddress,
        postalCode,
        city,
        phone: contact.phone,
      }));
    }
  }, [selectedEvent, contact]);

  // Initialize the signature pad
  const initializeSignaturePad = () => {
    if (!signatureRef.current) {
      console.error("signatureRef.current is null");
      return;
    }
    if (!canvasRef.current) {
      const canvas = document.createElement("canvas");
      canvasRef.current = canvas;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.cursor = "crosshair";
      canvas.style.touchAction = "none";
      canvas.width = signatureRef.current.clientWidth;
      canvas.height = signatureRef.current.clientHeight;
      signatureRef.current.innerHTML = "";
      signatureRef.current.appendChild(canvas);
    }
    if (canvasRef.current) {
      try {
        const newSignaturePad = new SignaturePad(canvasRef.current, {
          backgroundColor: "rgba(255, 255, 255, 0)",
          penColor: "black",
          minWidth: 1,
          maxWidth: 2.5,
        });
        signaturePadRef.current = newSignaturePad;
        if (attestationData.signature) {
          newSignaturePad.fromDataURL(attestationData.signature);
        }
        canvasRef.current.addEventListener("mousedown", () => {
          if (canvasRef.current) {
            canvasRef.current.style.border = "1px solid #3b82f6";
          }
        });
      } catch (error) {
        console.error("Error initializing signature pad:", error);
      }
    }
  };

  // Initialize signature pad after modal opens
  useEffect(() => {
    if (showAttestationModal) {
      const timer = setTimeout(() => {
        initializeSignaturePad();
      }, 300);
      return () => {
        clearTimeout(timer);
        if (signaturePadRef.current) {
          signaturePadRef.current.off();
        }
      };
    }
  }, [showAttestationModal, attestationData.signature]);

  // Resize canvas on window resize
  useEffect(() => {
    const handleResize = () => {
      if (!signatureRef.current || !canvasRef.current || !signaturePadRef.current) return;
      try {
        const data = signaturePadRef.current.toData();
        const container = signatureRef.current;
        const canvas = canvasRef.current;
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = container.clientWidth * ratio;
        canvas.height = container.clientHeight * ratio;
        const context = canvas.getContext("2d");
        if (context) {
          context.scale(ratio, ratio);
        }
        signaturePadRef.current.clear();
        if (data && data.length > 0) {
          signaturePadRef.current.fromData(data);
        }
      } catch (error) {
        console.error("Error resizing signature pad:", error);
      }
    };

    if (showAttestationModal) {
      window.addEventListener("resize", handleResize);
      setTimeout(handleResize, 100);
    }
    return () => window.removeEventListener("resize", handleResize);
  }, [showAttestationModal]);

  // Clear the signature
  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setAttestationData((prev) => ({ ...prev, signature: null }));
      if (canvasRef.current) {
        canvasRef.current.style.border = "1px dashed #cbd5e1";
      }
    }
  };

  // Utility functions for PDF generation
  function formatDateOnly(dateString?: string): string {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("fr-FR");
    } catch {
      return dateString;
    }
  }

  function formatDateTime(dateString?: string): string {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const formatted = date
        .toLocaleString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(/:/g, "h");
      return formatted.replace(/^(\d{2}\/\d{2}\/\d{4})\s*/, "$1 à ");
    } catch {
      return dateString;
    }
  }

  // Generate the PDF using jsPDF and return the PDF data URL
  const generatePDF = (data: AttestationData): string => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    // Define colors
    const primaryColor = "#2A4365";
    const secondaryColor = "#EBF8FF";
    const accentColor = "#48BB78";
    const textColor = "#2D3748";

    // Set a clean background
    doc.setFillColor(secondaryColor);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Header Section
    const headerHeight = 40;
    doc.setFillColor("#FFFFFF");
    doc.roundedRect(margin, 15, contentWidth, headerHeight, 3, 3, "F");

    // Place logo on the left
    const logoHeight = 25;
    const logoWidth = logoHeight * 1.5;
    try {
      doc.addImage(
        "/ecologyblogo.png",
        "PNG",
        margin + 10,
        15 + (headerHeight - logoHeight) / 2 - 2,
        logoWidth,
        logoHeight
      );
    } catch {
      doc.setTextColor(primaryColor);
      doc.setFontSize(14);
      doc.text("ECOLOGY'B", margin + 10, 15 + headerHeight / 2);
    }

    // Header Titles
    doc.setTextColor(primaryColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    const title1 = "ATTESTATION D'INTERVENTION";
    const title1Width = doc.getTextWidth(title1);
    const title1X = margin + (contentWidth - title1Width) / 2 + 23;
    doc.text(title1, title1X, 15 + headerHeight / 2);

    doc.setFontSize(12);
    const title2 = "Service Après-Vente";
    const title2Width = doc.getTextWidth(title2);
    const title2X = margin + (contentWidth - title2Width) / 2;
    doc.text(title2, title2X, 15 + headerHeight / 2 + 6);

    // Client Information Section
    let yPos = 15 + headerHeight + 15;
    doc.setFontSize(10);
    const clientInfo = [
      {
        label: "Nom du client",
        value: ((data.lastName || "") + " " + (data.firstName || "")).trim(),
      },
      { label: "Adresse", value: data.address || "" },
      { label: "Code Postal", value: data.postalCode || "" },
      { label: "Ville", value: data.city || "" },
      { label: "Tél portable", value: data.phone || "" },
      {
        label: "Date de l'intervention",
        value: data.interventionDate
          ? `Le ${formatDateTime(data.interventionDate)}`
          : "",
      },
    ];

    clientInfo.forEach((info) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(textColor);
      doc.text(`${info.label}:`, margin, yPos);
      doc.setFont("helvetica", "normal");
      if (info.label === "Date de l'intervention") {
        doc.text(info.value, margin + 45, yPos);
      } else {
        doc.text((info.value || "").toUpperCase(), margin + 45, yPos);
      }
      yPos += 7;
    });
    yPos += 10;

    // Technical Team Box
    const techBoxHeight = 40;
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, yPos, contentWidth, techBoxHeight, 3, 3, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    const techText = "ENCADRÉ RÉSERVÉ À L'ÉQUIPE TECHNIQUE";
    const techTextWidth = doc.getTextWidth(techText);
    const techTextX = margin + (contentWidth - techTextWidth) / 2;
    doc.setTextColor(primaryColor);
    doc.text(techText, techTextX, yPos + 10);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    doc.text("Détail de l’intervention:", margin + 10, yPos + 16);

    doc.setFont("helvetica", "normal");
    const techDetails = doc.splitTextToSize(
      (data.interventionDetails || "Aucun détail fourni").toUpperCase(),
      contentWidth - 20
    );
    doc.text(techDetails, margin + 10, yPos + 22);
    yPos += techBoxHeight + 10;

    // Client Declaration Box (with Signature)
    const declBoxHeight = 100;
    doc.setDrawColor(accentColor);
    doc.roundedRect(margin, yPos, contentWidth, declBoxHeight, 3, 3, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    const clientBoxText = "ENCADRÉ RÉSERVÉ AU CLIENT";
    const clientBoxTextWidth = doc.getTextWidth(clientBoxText);
    const clientBoxTextX = margin + (contentWidth - clientBoxTextWidth) / 2;
    doc.setTextColor(accentColor);
    doc.text(clientBoxText, clientBoxTextX, yPos + 10);

    doc.setFontSize(10);
    doc.setTextColor(textColor);
    let textY = yPos + 20;

    doc.setFont("helvetica", "bold");
    const line1Label = "Je soussigné(e) Madame/Monsieur:";
    doc.text(line1Label, margin + 10, textY);
    doc.setFont("helvetica", "normal");
    doc.text(
      ((data.lastName || "") + " " + (data.firstName || "")).toUpperCase(),
      margin + 72,
      textY
    );
    textY += 6;

    doc.setFont("helvetica", "bold");
    const line2Label1 = "Demeurant à l'adresse:";
    doc.text(line2Label1, margin + 10, textY);
    doc.setFont("helvetica", "normal");
    doc.text(
      (data.address || "").toUpperCase(),
      margin + 12 + doc.getTextWidth(line2Label1) + 2,
      textY
    );
    textY += 6;

    doc.setFont("helvetica", "bold");
    const line2Label2 = "Code Postal:";
    doc.text(line2Label2, margin + 10, textY);
    doc.setFont("helvetica", "normal");
    doc.text(
      (data.postalCode || "").toUpperCase(),
      margin + 10 + doc.getTextWidth(line2Label2) + 2,
      textY
    );
    textY += 6;
    doc.setFont("helvetica", "bold");
    const line2Label3 = "  Ville:";
    doc.text(line2Label3, margin + 8, textY);

    doc.setFont("helvetica", "normal");
    doc.text(
      (data.city || "").toUpperCase(),
      margin + 10 + doc.getTextWidth(line2Label3) + 2,
      textY
    );
    textY += 6;

    textY += 6;

    doc.setFont("helvetica", "bold");
    doc.text(
      "Atteste que la société ECOLOGY'B a pris en charge ma demande de SAV.",
      margin + 10,
      textY
    );
    textY += 6;

    doc.text(
      "J'atteste sur l'honneur que les tâches mentionnées ci-dessus ont bien été réalisées et",
      margin + 10,
      textY
    );
    textY += 6;

    doc.text("m'apportent entière satisfaction.", margin + 10, textY);
    textY += 6;

    textY += 6;

    doc.setFont("helvetica", "bold");
    const boldLabel = "Date: ";
    doc.text(boldLabel, margin + 10, textY);
    const boldLabelWidth = doc.getTextWidth(boldLabel);

    doc.setFont("helvetica", "normal");
    doc.text(
      "Le " + formatDateOnly(data.signatureDate).toUpperCase(),
      margin + 10 + boldLabelWidth,
      textY
    );
    textY += 6;

    doc.setFont("helvetica", "bold");
    const line7Label = "A:";
    doc.text(line7Label, margin + 10, textY);
    doc.setFont("helvetica", "normal");
    doc.text(
      (data.city || "").toUpperCase(),
      margin + 10 + doc.getTextWidth(line7Label) + 2,
      textY
    );
    textY += 6;

    doc.setFont("helvetica", "bold");
    doc.text("Signature:", margin + 10, textY);

    if (data.signature) {
      try {
        doc.addImage(data.signature, "PNG", margin + 10, textY + 2, 40, 15);
      } catch {
        doc.text("Signature non disponible", margin + 10, textY + 10);
      }
    }
    textY += 15;

    yPos = yPos + declBoxHeight + 10;

    // Footer Section
    const footerHeight = 20;
    doc.setFillColor(primaryColor);
    doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, "F");
    doc.setTextColor("#FFF");
    doc.setFontSize(9);
    const footerY = pageHeight - footerHeight + 7;
    doc.text("Contact: contact@ecologyb.fr | Tél: 09 52 02 81 36", margin, footerY);
    doc.text("SIRET: 891 318 438 00027 | RCS Pontoise", margin, footerY + 5);

    const pdfDataUrl = doc.output("dataurlstring");
    setPdfPreviewUrl(pdfDataUrl);
    return pdfDataUrl;
  };

  // Save the attestation on the backend (including the pdfUrl)
  const saveAttestation = async (data: AttestationData & { pdfUrl: string }): Promise<void> => {
    try {
      const response = await fetch("/api/attestations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEvent._id,
          attestationData: data,
          pdfUrl: data.pdfUrl,
        }),
      });
      const result = await response.json();
      if (result && result.data && result.data.pdfUrl) {
        setPdfPreviewUrl(result.data.pdfUrl);
      }
    } catch (error) {
      console.error("Error saving attestation:", error);
    }
  };

  // Handler for generating attestation (PDF), saving it on the backend, and showing the preview
  const handleGenerateAttestationPDF = async () => {
    if (!signaturePadRef.current && canvasRef.current) {
      initializeSignaturePad();
    }

    if (!signaturePadRef.current) {
      console.error("Signature pad not initialized");
      alert("Erreur: La zone de signature n'est pas initialisée correctement. Veuillez réessayer.");
      return;
    }

    let signatureData = "";
    if (!signaturePadRef.current.isEmpty()) {
      signatureData = signaturePadRef.current.toDataURL("image/png");
    }

    const finalData: AttestationData = {
      ...attestationData,
      signature: signatureData,
      signatureDate: attestationData.signatureDate || new Date().toISOString().split("T")[0],
    };

    // Generate the PDF preview and get its data URL
    const pdfUrl = generatePDF(finalData);
    // Save the attestation on the backend including the pdfUrl
    await saveAttestation({ ...finalData, pdfUrl });
  };

  if (!selectedEvent) return null;

  // Format event date & time for the Event Details modal
  const eventDate = new Date(selectedEvent.createdAt);
  const formattedDate = eventDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div>
      {/* Event Details Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-[#213f5b] to-[#1a324a] p-5 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Détails de l&apos;intervention
              </h3>
              <button
                onClick={onClose}
                className="text-white hover:text-red-300 focus:outline-none transition-all duration-300 ease-in-out transform hover:rotate-90"
                aria-label="Fermer"
              >
                <XMarkIcon className="h-7 w-7" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Information Sections */}
            <div className="space-y-4">
              {/* Client Info */}
              <div 
                className="flex items-start space-x-4 p-4 bg-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <UserIcon className={`h-6 w-6 text-[#213f5b] mt-1 transition-transform ${isHovered ? 'scale-110' : ''}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-500">Client</div>
                  <div className="font-semibold text-gray-800">
                    {`${selectedEvent.customerFirstName} ${selectedEvent.customerLastName}`}
                  </div>
                </div>
              </div>

              {/* Other Sections Similar to Above */}
              <div className="flex items-start space-x-4 p-4 bg-gray-100 rounded-xl">
                <WrenchIcon className="h-6 w-6 text-[#213f5b] mt-1" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Problème</div>
                  <div className="font-semibold text-gray-800">
                    {selectedEvent.problem || "Intervention programmée"}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="flex items-start space-x-4 p-4 bg-gray-100 rounded-xl">
                <PencilIcon className="h-6 w-6 text-[#213f5b] mt-1" />
                <div>
                  <div className="text-sm font-semibold text-gray-500">Notes</div>
                  <div className="font-thin text-gray-800">
                    {selectedEvent.notes || "Intervention programmée"}
                  </div>
                </div>
              </div>

              {/* Date and Time Row */}
              <div className="flex space-x-4">
                <div className="flex-1 flex items-start space-x-4 p-4 bg-gray-100 rounded-xl">
                  <CalendarIcon className="h-6 w-6 text-[#213f5b] mt-1" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Date</div>
                    <div className="font-semibold text-gray-800">{formattedDate}</div>
                  </div>
                </div>
                <div className="flex-1 flex items-start space-x-4 p-4 bg-gray-100 rounded-xl">
                  <ClockIcon className="h-6 w-6 text-[#213f5b] mt-1" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Heure</div>
                    <div className="font-semibold text-gray-800">{formattedTime}</div>
                  </div>
                </div>
              </div>

              {/* Technician Info */}
              <div className="flex items-start space-x-4 p-4 bg-gray-100 rounded-xl">
                <UserIcon className="h-6 w-6 text-[#213f5b] mt-1" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Technicien</div>
                  <div className="font-semibold text-gray-800">
                    {`${selectedEvent.technicianFirstName} ${selectedEvent.technicianLastName}`}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {/* Send to Technician Button */}
              <button
                onClick={onSendToTechnician}
                className="flex items-center justify-center space-x-2 bg-[#213f5b] hover:bg-[#1a324a] text-white rounded-lg px-4 py-3 font-medium transition-colors group"
              >
                <PaperAirplaneIcon className="h-5 w-5 group-hover:rotate-45 transition-transform" />
                <span>Envoyer au technicien</span>
              </button>

              {/* Send to Client Button */}
              <button
                onClick={onSendToClient}
                className="flex items-center justify-center space-x-2 bg-[#1a9c66] hover:bg-[#167a51] text-white rounded-lg px-4 py-3 font-medium transition-colors group"
              >
                <EnvelopeIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Envoyer au client</span>
              </button>

              {/* Attestation Button */}
              <div className="col-span-2 mt-2">
                <button
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg px-4 py-3 font-medium transition-colors flex items-center justify-center space-x-2"
                  onClick={() => {
                    setShowAttestationModal(true);
                  }}
                >
                  <DocumentTextIcon className="h-5 w-5" />
                  <span>
                    {pdfPreviewUrl ? "Voir Attestation" : "Générer une attestation"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Attestation Modal */}
      <Modal
        isOpen={showAttestationModal}
        onAfterOpen={initializeSignaturePad}
        onRequestClose={() => setShowAttestationModal(false)}
        contentLabel="Générer une Attestation d'Intervention S.A.V."
        className="fixed inset-0 flex items-center justify-center p-4 sm:p-8 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 transition-opacity"
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl mx-auto p-6 sm:p-8 border border-gray-200 dark:border-gray-700 transition-all transform overflow-y-auto"
          style={{ maxHeight: "80vh" }}
        >
          <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-gray-700">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white">
              Générer une Attestation d&apos;Intervention S.A.V.
            </h2>
            <button
              onClick={() => setShowAttestationModal(false)}
              className="text-gray-500 hover:text-gray-800 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Fermer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {pdfPreviewUrl ? (
            // PDF Preview Section (persistent)
            <div className="space-y-4">
              <iframe
                src={pdfPreviewUrl}
                title="PDF Preview"
                className="w-full h-[500px] border border-gray-300 rounded-lg"
              ></iframe>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  className="px-6 py-2.5 rounded-lg bg-gray-400 text-white hover:bg-gray-500 transition-colors"
                  onClick={() => {
                    // Clear the PDF preview to show the form
                    setPdfPreviewUrl("");
                    // Force remount the signature container by updating the key
                    setSignaturePadKey(Date.now());
                    // After a short delay (to allow the container to remount), initialize the signature pad
                    setTimeout(() => {
                      initializeSignaturePad();
                    }, 100);
                  }}
                >
                  Editer
                </Button>

                <Button
                  type="button"
                  className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    // Trigger actual download of the PDF
                    const link = document.createElement("a");
                    link.href = pdfPreviewUrl;
                    link.download = `ATTESTATION_SAV_${attestationData.lastName.toUpperCase()}_${Math.floor(
                      Math.random() * 9000 + 1000
                    )}.pdf`;
                    link.click();
                  }}
                >
                  Télécharger
                </Button>
              </div>
            </div>
          ) : (
            // Attestation Form Section
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerateAttestationPDF();
              }}
              className="space-y-8"
            >
              {/* Informations Client – Prefilled and editable */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Informations Client
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="lastName" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Nom
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={attestationData.lastName}
                      onChange={(e) =>
                        setAttestationData((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      required
                      placeholder="Entrez le nom"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="firstName" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Prénom
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={attestationData.firstName}
                      onChange={(e) =>
                        setAttestationData((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      required
                      placeholder="Entrez le prénom"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label htmlFor="address" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Adresse
                    </label>
                    <input
                      id="address"
                      type="text"
                      value={attestationData.address}
                      onChange={(e) =>
                        setAttestationData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      required
                      placeholder="Adresse complète"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Code Postal
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      value={attestationData.postalCode}
                      onChange={(e) =>
                        setAttestationData((prev) => ({
                          ...prev,
                          postalCode: e.target.value,
                        }))
                      }
                      required
                      maxLength={5}
                      pattern="\d{5}"
                      placeholder="Ex: 75001"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Ville
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={attestationData.city}
                      onChange={(e) =>
                        setAttestationData((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      required
                      placeholder="Ex: Paris"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Tél portable
                    </label>
                    <input
                      id="phone"
                      type="text"
                      value={attestationData.phone}
                      onChange={(e) =>
                        setAttestationData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      required
                      pattern="\d+"
                      placeholder="Ex: 0612345678"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="interventionDate" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Date de l&apos;intervention
                    </label>
                    <div className="relative">
                      <input
                        id="interventionDate"
                        type="datetime-local"
                        lang="fr"
                        value={attestationData.interventionDate}
                        onChange={(e) =>
                          setAttestationData((prev) => ({
                            ...prev,
                            interventionDate: e.target.value,
                          }))
                        }
                        required
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        {/* Optional SVG icon */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Problème rencontré */}
              <div className="relative pt-6 border-t dark:border-gray-700">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Problème rencontré
                  </h3>
                  <div>
                    <label htmlFor="interventionDetails" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Détails du problème rencontré
                    </label>
                    <textarea
                      id="interventionDetails"
                      value={selectedEvent.notes}
                      readOnly
                      onChange={(e) =>
                        setAttestationData((prev) => ({
                          ...prev,
                          interventionDetails: e.target.value,
                        }))
                      }
                      rows={5}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="Décrivez les détails de l'intervention technique..."
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Section équipe technique */}
              <div className="relative pt-6 border-t dark:border-gray-700">
                {!techSectionRevealed && (
                  <button
                    type="button"
                    onClick={() => setTechSectionRevealed(true)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 px-6 py-2.5 rounded-lg bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:border-red-700 hover:shadow-md font-medium transition-colors"
                  >
                    Remplir pour l&apos;ÉQUIPE TECHNIQUE
                  </button>
                )}
                <div className={`space-y-6 ${!techSectionRevealed ? "blur-sm pointer-events-none" : ""}`}>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    ENCADRÉ RÉSERVÉ À L&apos;ÉQUIPE TECHNIQUE
                  </h3>
                  <div>
                    <label htmlFor="interventionDetails" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Détail de l&apos;intervention
                    </label>
                    <textarea
                      id="interventionDetails"
                      value={attestationData.interventionDetails}
                      onChange={(e) =>
                        setAttestationData((prev) => ({
                          ...prev,
                          interventionDetails: e.target.value,
                        }))
                      }
                      rows={5}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="Décrivez les détails de l'intervention technique..."
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Section Signature */}
              <div className="relative pt-6 border-t dark:border-gray-700">
                {!clientSectionRevealed && (
                  <button
                    type="button"
                    onClick={() => setClientSectionRevealed(true)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 px-6 py-2.5 rounded-lg bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:border-red-700 hover:shadow-md font-medium transition-colors"
                  >
                    Remplir pour le CLIENT
                  </button>
                )}
                <div className={`space-y-6 ${!clientSectionRevealed ? "blur-sm pointer-events-none" : ""}`}>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    ENCADRÉ RÉSERVÉ AU CLIENT
                  </h3>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Signature
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Utilisez votre souris ou votre doigt pour signer dans la zone ci-dessous.
                  </p>
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-white">
                    <div
                      key={signaturePadKey}
                      className="w-full h-48 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center relative cursor-crosshair"
                      ref={signatureRef}
                    >
                      {!attestationData.signature && (
                        <div className="text-gray-400 dark:text-gray-500 absolute pointer-events-none">
                          Cliquez ou touchez ici pour signer
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between mt-2">
                      <div className="text-sm text-gray-500">
                        {signaturePadRef.current && !signaturePadRef.current.isEmpty() ? "Signature enregistrée" : ""}
                      </div>
                      <button
                        type="button"
                        onClick={clearSignature}
                        className="text-sm text-gray-400 dark:text-gray-700 hover:text-red-500 dark:hover:text-red-400"
                      >
                        Effacer la signature
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Boutons Annuler / Enregistrer */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t dark:border-gray-700">
                <Button
                  type="button"
                  className="px-6 py-2.5 rounded-lg bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:border-red-700 hover:shadow-md font-medium transition-colors"
                  onClick={() => setShowAttestationModal(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Enregistrer
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default EventDetailsModal;
