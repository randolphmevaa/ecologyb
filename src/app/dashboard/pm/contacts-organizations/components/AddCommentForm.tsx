"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Définition d'une interface pour les utilisateurs
interface Utilisateur {
  id: string | number;
  email: string;
  role: string;
}

// Interface pour les options du champ "Lier à"
interface OptionLinked {
  value: string;
  label: string;
}

// Props du composant
interface AddCommentFormProps {
  contactId: string;
  onClose: () => void;
}

interface Ticket {
  id: string | number;
  ticket: string;
}

interface DocumentItem {
  id: string | number;
  type: string;
  date: string;
}

interface Dossier {
  _id: string | number;
  numero: string;
  projet: string;
}


export default function AddCommentForm({ contactId, onClose }: AddCommentFormProps) {
  // États pour les champs du formulaire
  const [auteur, setAuteur] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [date, setDate] = useState("");
  const [linkedTo, setLinkedTo] = useState("");

  // États pour les listes de données à charger
  const [users, setUsers] = useState<Utilisateur[]>([]);
  const [linkedOptions, setLinkedOptions] = useState<OptionLinked[]>([]);

  useEffect(() => {
    // Définir la date d'aujourd'hui au format français
    setDate(new Date().toLocaleDateString("fr-FR"));

    // Charger la liste des utilisateurs depuis /api/users
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Erreur lors du chargement des utilisateurs");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs :", error);
      }
    }

    // Charger les éléments liés depuis /api/tickets, /api/documents et /api/dossiers
    async function fetchLinkedItems() {
      try {
        const [ticketsRes, documentsRes, dossiersRes] = await Promise.all([
          fetch(`/api/tickets?contactId=${contactId}`),
          fetch(`/api/documents?contactId=${contactId}`),
          fetch(`/api/dossiers?contactId=${contactId}`)
        ]);
        
        // Type the JSON responses as arrays of the corresponding interfaces
        const [tickets, documents, dossiers]: [Ticket[], DocumentItem[], Dossier[]] = await Promise.all([
          ticketsRes.json(),
          documentsRes.json(),
          dossiersRes.json()
        ]);
    
        const options: OptionLinked[] = [];
    
        // Options pour les tickets
        tickets.forEach((ticket: Ticket) => {
          options.push({
            value: `ticket:${ticket.id}`,
            label: `Ticket: ${ticket.ticket}`
          });
        });
    
        // Options pour les documents
        documents.forEach((doc: DocumentItem) => {
          options.push({
            value: `document:${doc.id}`,
            label: `Document: ${doc.type} (${doc.date})`
          });
        });
    
        // Options pour les dossiers
        dossiers.forEach((dos: Dossier) => {
          options.push({
            value: `dossier:${dos._id}`,
            label: `Dossier: ${dos.numero} - ${dos.projet}`
          });
        });
        setLinkedOptions(options);
      } catch (error) {
        console.error("Erreur lors du chargement des éléments liés :", error);
      }
    }

    fetchUsers();
    fetchLinkedItems();
  }, [contactId]);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const commentaireData = {
      contactId,
      auteur,
      date,
      commentaire,
      linkedTo,
    };

    try {
      const res = await fetch("/api/commentaires", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentaireData),
      });
      if (!res.ok) throw new Error("Erreur lors de la création du commentaire");
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création du commentaire :", error);
      alert("Une erreur est survenue lors de la création du commentaire.");
    }
  };

  return (
    // Conteneur modal avec overlay sombre
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Conteneur du modal avec largeur augmentée et défilement vertical si nécessaire */}
      <div className="max-w-2xl w-full mx-4 bg-white p-8 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto relative">
        {/* En-tête du modal */}
        <div className="flex items-center justify-between mb-6 border-b pb-3">
          <h2 className="text-2xl font-bold text-gray-800">Ajouter un commentaire</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>
        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Champ caché pour contactId */}
          <input type="hidden" value={contactId} />
          {/* Auteur */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Auteur</label>
            <select
              value={auteur}
              onChange={(e) => setAuteur(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Sélectionnez un auteur</option>
              {users.map((user) => (
                <option key={user.id} value={user.email}>
                  {user.email} ({user.role})
                </option>
              ))}
            </select>
          </div>
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="text"
              value={date}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
            />
          </div>
          {/* Commentaire */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Commentaire</label>
            <textarea
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              placeholder="Entrez votre commentaire..."
              rows={4}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          {/* Lier à */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Lier à</label>
            <select
              value={linkedTo}
              onChange={(e) => setLinkedTo(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Sélectionnez un élément lié</option>
              {linkedOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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
              Enregistrer le commentaire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
