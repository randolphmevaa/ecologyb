// SavTab.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClockIcon, PlusIcon } from "@heroicons/react/24/outline";

interface SavTabProps {
  contactId: string | number;
}

// This interface matches the API response
interface ApiTicket {
  _id: string;
  ticket: string;
  "problème": string;
  customer: string;
  statut: string;
  priority: string;
  description: string;
  solution: string;
  assignedTechnician: string;
  dates: {
    created: string;
    updated: string;
    resolution: string;
  };
  contactId: string;
}

// This is our internal Ticket interface used by the UI.
// (We map the API fields into the properties below.)
interface Ticket {
  id: string;
  titre: string; // from API "problème"
  categorie: string; // here we use the customer name (adjust as needed)
  status: string; // from API "statut" (we’ll capitalize it)
  dateCreation: string; // from API dates.created
  derniereMiseAJour: string; // from API dates.updated
  description: string;
}

const SavTab: React.FC<SavTabProps> = ({ contactId }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketSelectionne, setTicketSelectionne] = useState<Ticket | null>(null);
  const [recherche, setRecherche] = useState("");

  useEffect(() => {
    // Convert contactId to a string in case it is a number.
    const contactIdStr = contactId.toString();

    // Fetch real data filtered by contactId from GET /api/tickets?contactId=${contactId}
    fetch(`/api/tickets?contactId=${contactIdStr}`)
      .then((res) => res.json())
      .then((data: ApiTicket[]) => {
        // Transform the API data into our internal Ticket shape
        const transformedTickets: Ticket[] = data.map((apiTicket) => ({
          id: apiTicket._id,
          titre: apiTicket["problème"], // using the "problème" field as title
          categorie: apiTicket.customer, // or consider using another field like apiTicket.priority
          status:
            apiTicket.statut.charAt(0).toUpperCase() +
            apiTicket.statut.slice(1), // capitalize the first letter (e.g., "ouvert" -> "Ouvert")
          dateCreation: new Date(apiTicket.dates.created).toLocaleDateString(),
          derniereMiseAJour: new Date(apiTicket.dates.updated).toLocaleDateString(),
          description: apiTicket.description,
        }));
        setTickets(transformedTickets);
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
      });
  }, [contactId]);

  // Filter tickets based on the search query (matching title or category)
  const ticketsFiltres = tickets.filter(
    (ticket) =>
      ticket.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      ticket.categorie.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="p-6 bg-white shadow">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            Service Après-Vente
          </h1>
          <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400">
            <PlusIcon className="w-5 h-5" />
            Nouveau Ticket
          </button>
        </div>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Rechercher un ticket..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="flex flex-grow overflow-hidden">
        {/* Left panel – Ticket list */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto p-6 bg-white">
          {ticketsFiltres.length === 0 && (
            <p className="text-center text-gray-500">Aucun ticket trouvé.</p>
          )}
          <ul className="space-y-4">
            {ticketsFiltres.map((ticket) => (
              <motion.li
                key={ticket.id}
                onClick={() => setTicketSelectionne(ticket)}
                className={`p-4 rounded-lg shadow cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                  ticketSelectionne?.id === ticket.id ? "bg-gray-100" : "bg-white"
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {ticket.titre}
                  </h2>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full 
                      ${
                        ticket.status === "Ouvert"
                          ? "bg-yellow-100 text-yellow-600"
                          : ""
                      }
                      ${
                        ticket.status === "En cours"
                          ? "bg-blue-100 text-blue-600"
                          : ""
                      }
                      ${
                        ticket.status === "Fermé"
                          ? "bg-green-100 text-green-600"
                          : ""
                      }`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{ticket.categorie}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                  <ClockIcon className="w-4 h-4" />
                  <span>{ticket.derniereMiseAJour}</span>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Right panel – Ticket details */}
        <div className="flex-grow p-6 overflow-y-auto">
          {ticketSelectionne ? (
            <AnimatePresence>
              <motion.div
                key={ticketSelectionne.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {ticketSelectionne.titre}
                </h2>
                <div className="mb-4 flex items-center gap-2">
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded-full 
                      ${
                        ticketSelectionne.status === "Ouvert"
                          ? "bg-yellow-100 text-yellow-600"
                          : ""
                      }
                      ${
                        ticketSelectionne.status === "En cours"
                          ? "bg-blue-100 text-blue-600"
                          : ""
                      }
                      ${
                        ticketSelectionne.status === "Fermé"
                          ? "bg-green-100 text-green-600"
                          : ""
                      }`}
                  >
                    {ticketSelectionne.status}
                  </span>
                  <p className="text-sm text-gray-500">
                    {ticketSelectionne.categorie}
                  </p>
                </div>
                <div className="mb-4 text-sm text-gray-500">
                  <p>
                    <strong>Date de création :</strong>{" "}
                    {ticketSelectionne.dateCreation}
                  </p>
                  <p>
                    <strong>Dernière mise à jour :</strong>{" "}
                    {ticketSelectionne.derniereMiseAJour}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700">
                    {ticketSelectionne.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-500">
                Sélectionnez un ticket pour voir les détails.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavTab;
