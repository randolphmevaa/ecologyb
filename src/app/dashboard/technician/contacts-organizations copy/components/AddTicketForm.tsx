"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Technicien {
  id: string | number;
  email: string;
  role: string;
}

interface AddTicketFormProps {
  contactId: string;
  onClose: () => void;
}

export default function AddTicketForm({ contactId, onClose }: AddTicketFormProps) {
  // États pour le formulaire
  const [ticket, setTicket] = useState("");
  const [probleme, setProbleme] = useState("");
  const [client, setClient] = useState(""); // Nom du client pré-rempli
  const [statut, setStatut] = useState("ouvert");
  const [priorite, setPriorite] = useState("Moyenne");
  const [description, setDescription] = useState("");
  const [solution, setSolution] = useState("");
  const [technicienAssigne, setTechnicienAssigne] = useState("");
  const [techniciens, setTechniciens] = useState<Technicien[]>([]);

  // À l'initialisation, générer le numéro du ticket, charger les techniciens et le nom du client
  useEffect(() => {
    setTicket(générerNuméroTicket());
    chargerTechniciens();
    chargerClient();
  }, []);

  // Générer un numéro de ticket au format "TKT-2023-XXXX"
  const générerNuméroTicket = () => {
    const année = new Date().getFullYear();
    const nombreAléatoire = Math.floor(Math.random() * 9000) + 1000;
    return `TKT-${année}-${nombreAléatoire}`;
  };

  // Charger la liste des techniciens depuis /api/users
  const chargerTechniciens = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Erreur lors du chargement des techniciens");
      const données = await res.json();
      setTechniciens(données);
    } catch (error) {
      console.error("Erreur lors du chargement des techniciens :", error);
    }
  };

  // Charger le nom du client depuis /api/contacts
  const chargerClient = async () => {
    try {
      const res = await fetch(`/api/contacts?id=${contactId}`);
      if (!res.ok) throw new Error("Erreur lors du chargement du contact");
      const données = await res.json();
      // La réponse peut être un tableau ou un objet
      let contact;
      if (Array.isArray(données)) {
        contact = données[0];
      } else {
        contact = données;
      }
      const nom = contact?.name || `${contact.firstName || ""} ${contact.lastName || ""}`.trim();
      setClient(nom || "Client inconnu");
    } catch (error) {
      console.error("Erreur lors du chargement du contact :", error);
      setClient("Client inconnu");
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const maintenant = new Date().toISOString();
    const donnéesTicket = {
      ticket,
      problème: probleme,
      customer: client,
      statut,
      priority: priorite,
      description,
      solution,
      assignedTechnician: technicienAssigne,
      dates: {
        created: maintenant,
        updated: maintenant,
        resolution: "" // À compléter ultérieurement
      },
      contactId,
    };

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donnéesTicket),
      });
      if (!res.ok) throw new Error("Erreur lors de la création du ticket");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de la création du ticket.");
    }
  };

  return (
    // Conteneur modal en fond fixe avec un overlay sombre
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Conteneur du modal avec largeur augmentée et contenu défilable */}
      <div className="max-w-3xl w-full mx-4 bg-white p-8 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto relative">
        {/* En-tête du modal */}
        <div className="flex items-center justify-between mb-6 border-b pb-3">
          <h2 className="text-2xl font-bold text-gray-800">Ajouter un ticket/support</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>
        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ticket auto-généré */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Ticket</label>
            <input
              type="text"
              value={ticket}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
            />
          </div>
          {/* Problème */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Problème</label>
            <input
              type="text"
              value={probleme}
              onChange={(e) => setProbleme(e.target.value)}
              placeholder="Décrivez le problème"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          {/* Client pré-rempli */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Client</label>
            <input
              type="text"
              value={client}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
            />
          </div>
          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Statut</label>
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="ouvert">Ouvert</option>
              <option value="ferme">Fermé</option>
            </select>
          </div>
          {/* Priorité */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Priorité</label>
            <select
              value={priorite}
              onChange={(e) => setPriorite(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="Basse">Basse</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Haute">Haute</option>
              <option value="Urgente">Urgente</option>
            </select>
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails sur le problème..."
              rows={4}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          {/* Solution */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Solution</label>
            <input
              type="text"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Solution appliquée (facultatif)"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          {/* Technicien assigné */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Technicien assigné</label>
            <select
              value={technicienAssigne}
              onChange={(e) => setTechnicienAssigne(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Sélectionnez un technicien</option>
              {techniciens.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.email} ({tech.role})
                </option>
              ))}
            </select>
          </div>
          {/* Bouton de soumission */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
            >
              Créer le ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
