// SavTab.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClockIcon,
  PlusIcon,
  // ExclamationCircleIcon,
  // CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface Ticket {
  id: number;
  titre: string;
  categorie: string;
  status: "Ouvert" | "En cours" | "Fermé";
  dateCreation: string;
  derniereMiseAJour: string;
  description: string;
}

const sampleTickets: Ticket[] = [
  {
    id: 1,
    titre: "Problème avec la livraison",
    categorie: "Livraison",
    status: "Ouvert",
    dateCreation: "10/02/2025",
    derniereMiseAJour: "11/02/2025",
    description:
      "Je n'ai pas encore reçu mon colis et il est en retard. Merci de vérifier ce problème dès que possible.",
  },
  {
    id: 2,
    titre: "Produit défectueux",
    categorie: "Produit",
    status: "En cours",
    dateCreation: "08/02/2025",
    derniereMiseAJour: "12/02/2025",
    description:
      "Le produit reçu présente des défauts majeurs, je souhaite un échange ou un remboursement.",
  },
  {
    id: 3,
    titre: "Erreur de facturation",
    categorie: "Facturation",
    status: "Fermé",
    dateCreation: "25/01/2025",
    derniereMiseAJour: "01/02/2025",
    description:
      "Il y a une erreur sur ma facture concernant le montant facturé. Merci de corriger ce problème.",
  },
];

const SavTab: React.FC = () => {
  const [tickets] = useState<Ticket[]>(sampleTickets);
  const [ticketSelectionne, setTicketSelectionne] = useState<Ticket | null>(
    null
  );
  const [recherche, setRecherche] = useState("");

  const ticketsFiltres = tickets.filter(
    (ticket) =>
      ticket.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      ticket.categorie.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* En-tête */}
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

      {/* Contenu en deux panneaux */}
      <div className="flex flex-grow overflow-hidden">
        {/* Liste des tickets (panneau gauche) */}
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

        {/* Détails du ticket (panneau droit) */}
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
                  <p className="text-gray-700">{ticketSelectionne.description}</p>
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